import crypto from "crypto";
import sharp from "sharp";
import type {
  BlogImageGenerationJob,
  BlogPostImage,
  BlogPostImageRole,
  InsertBlogPostImage,
} from "@shared/schema";
import { getBlogPostById, type BlogPostWithRelations } from "../storage";
import { containsLikelyPatientIdentifierAcrossTextFields } from "../privacy";
import { getPlainTextFromHtml } from "../sanitize";
import { getBlogImageConfig, isBlogImageEnabled } from "./config";
import {
  buildBlogImageAlt,
  buildBlogImageCaption,
  buildBlogImagePrompt,
  buildSafeVisualBrief,
  BLOG_IMAGE_PROMPT_VERSION,
} from "./prompt";
import { generateImageWithOpenAi } from "./provider";
import {
  claimBlogPostImageForDeletion,
  completeBlogImageCleanup,
  createDraftBlogPostImage,
  ensureCuratedHeroImage,
  finalizeBlogPostImageDeletion,
  getSelectedBlogPostImages,
  getBlogPostImage,
  listBlogPostImages,
  listQueuedBlogImageCleanupKeys,
  markStaleGeneratingBlogImagesFailed,
  markBlogImageCleanupFailed,
  queueBlogImageCleanup,
  replaceSelectedDraftBlogImages,
  updateBlogPostImage,
  updateDraftBlogPostImage,
} from "./storage";
import {
  deleteBlogImageObject,
  downloadBlogImage,
  getManagedBlogImagePublicUrl,
  isManagedBlogImagePublicUrl,
  uploadBlogImage,
} from "./object-storage";
import { getInlineImageAnchors } from "./render";
import { getBlogTranslationSibling } from "../translation/storage";
import { summarizeBlogImageJobSlots } from "./job-summary";
import {
  claimBlogImageGenerationJob,
  claimPendingBlogImageJobSlot,
  completeBlogImageGenerationJob,
  createBlogImageGenerationJobIfAbsent,
  expireStaleBlogImageJobAdmission,
  failBlogImageGenerationJob,
  getBlogImageGenerationJob,
  heartbeatBlogImageGenerationJob,
  listBlogImageJobSlots,
  recoverStaleBlogImageGenerationJob,
  requeueBlogImageGenerationJobAfterWorkerError,
  updateBlogImageGenerationJobProgress,
} from "./job-storage";

type GenerateVariantInput = {
  post: BlogPostWithRelations;
  role: BlogPostImageRole;
  slot: string;
  anchorHeading?: string | null;
  generationRunId?: number;
  sortOrder?: number;
};

export type BlogImageGenerationSummary = {
  enabled: boolean;
  generated: BlogPostImage[];
  failed: BlogPostImage[];
  warnings: string[];
};

export type BlogImageSetOptions = {
  role?: "hero" | "inline" | "all";
  generationRunId?: number;
  maxInline?: number;
};

function getErrorDetails(error: unknown): { code: string; message: string } {
  const providerError = error as { errorCode?: string; statusCode?: number; message?: string };
  return {
    code: providerError.errorCode || (providerError.statusCode ? `http_${providerError.statusCode}` : "generation_failed"),
    message: (providerError.message || "Blog image generation failed").slice(0, 1000),
  };
}

function buildObjectKey(postId: number, role: BlogPostImageRole, slot: string): string {
  const slotPart = role === "hero"
    ? "hero"
    : `inline-${Math.max(1, Number(slot.split(":")[1]) || 1)}`;
  return `blog-images/posts/post-${postId}-${slotPart}-${Date.now()}-${crypto.randomBytes(6).toString("hex")}.webp`;
}

async function cleanupUnregisteredSiblingCopies(objectKeys: string[]): Promise<void> {
  for (const objectKey of objectKeys) {
    try {
      await deleteBlogImageObject(objectKey);
    } catch (error) {
      await queueBlogImageCleanup(objectKey, error).catch(queueError => {
        console.error("Could not queue an unregistered sibling image copy for cleanup:", queueError);
      });
    }
  }
}

export type BlogSiblingImageReuseResult = {
  sourcePostId: number;
  sourceLanguage: "en" | "es";
  selected: BlogPostImage[];
  candidates: BlogPostImage[];
  uploadedCopies: number;
  reusedExisting: number;
};

async function copyAvailableBlogImages(
  source: BlogPostWithRelations,
  target: BlogPostWithRelations,
): Promise<BlogSiblingImageReuseResult> {
  if (target.status !== "draft") {
    throw Object.assign(new Error("Blog image changes are allowed only while the post is a draft"), {
      statusCode: 409,
    });
  }
  const [selectedSourceImages, allSourceImages, targetImages] = await Promise.all([
    getSelectedBlogPostImages(source.id),
    listBlogPostImages(source.id),
    listBlogPostImages(target.id),
  ]);
  const reusable = selectedSourceImages.filter(image => image.publicUrl && image.generationStatus === "completed");
  const candidateSourceImages = allSourceImages.filter(image =>
    image.reviewStatus === "candidate"
    && image.generationStatus === "completed"
    && image.publicUrl);
  if (!reusable.some(image => image.role === "hero") && source.featuredImage) {
    const registeredHero = allSourceImages.find(image =>
      image.role === "hero"
      && image.publicUrl === source.featuredImage
      && image.generationStatus === "completed");
    if (registeredHero) reusable.unshift(registeredHero);
  }

  const hero = reusable.find(image => image.role === "hero") || null;
  const inline = reusable.filter(image => image.role === "inline").slice(0, 2);
  if (!hero && inline.length === 0 && !source.featuredImage) {
    throw Object.assign(new Error("The source post has no approved images to synchronize"), { statusCode: 409 });
  }

  const targetAnchors = getInlineImageAnchors(target.content || "", inline.length);
  const sources: Array<{
    image: BlogPostImage | null;
    role: BlogPostImageRole;
    slot: string;
    anchorHeading: string | null;
    publicUrl: string;
  }> = [];
  if (hero?.publicUrl || source.featuredImage) {
    sources.push({
      image: hero,
      role: "hero",
      slot: "hero",
      anchorHeading: null,
      publicUrl: hero?.publicUrl || source.featuredImage!,
    });
  }
  inline.forEach((image, index) => {
    if (!image.publicUrl) return;
    sources.push({
      image,
      role: "inline",
      slot: `inline:${index + 1}`,
      anchorHeading: targetAnchors[index] || null,
      publicUrl: image.publicUrl,
    });
  });

  const selections: Parameters<typeof replaceSelectedDraftBlogImages>[0]["selections"] = [];
  const uploadedObjectKeys: string[] = [];
  let uploadedCopies = 0;
  let reusedExisting = 0;
  try {
    for (const source of sources) {
      const alt = buildBlogImageAlt(target, source.role, source.anchorHeading);
      const caption = buildBlogImageCaption(target, source.role, source.anchorHeading);
      const sourceImage = source.image;
      const managed = isManagedBlogImagePublicUrl(source.publicUrl);
      if (sourceImage?.source === "ai" && !managed) {
        throw Object.assign(
          new Error("The sibling AI image is not in managed Vercel Blob storage and cannot be copied safely"),
          { statusCode: 409 },
        );
      }

      if (!managed) {
        const existing = targetImages.find(image =>
          image.slot === source.slot
          && image.publicUrl === source.publicUrl
          && image.generationStatus === "completed");
        if (existing) reusedExisting += 1;
        selections.push({
          slot: source.slot,
          existingImageId: existing?.id,
          values: existing ? undefined : {
            postId: target.id,
            role: source.role,
            slot: source.slot,
            anchorHeading: source.anchorHeading,
            source: "curated",
            generationStatus: "completed",
            reviewStatus: "selected",
            objectKey: null,
            publicUrl: source.publicUrl,
            mimeType: sourceImage?.mimeType || null,
            width: sourceImage?.width || null,
            height: sourceImage?.height || null,
            bytes: sourceImage?.bytes || null,
            checksum: sourceImage?.checksum || null,
            alt,
            caption,
            safeVisualBrief: null,
            prompt: null,
            promptVersion: null,
            provider: null,
            model: null,
            generationRunId: null,
            imageJobId: null,
            startedAt: null,
            completedAt: new Date(),
            durationMs: null,
            errorCode: null,
            errorMessage: null,
            sortOrder: source.role === "hero" ? 0 : sources.indexOf(source),
          },
          updates: { role: source.role, anchorHeading: source.anchorHeading, alt, caption, sortOrder: source.role === "hero" ? 0 : sources.indexOf(source) },
        });
        continue;
      }

      const sourceObjectKey = sourceImage?.objectKey
        || source.publicUrl.slice("/public-objects/".length);
      const existing = sourceImage?.checksum
        ? targetImages.find(image =>
          image.slot === source.slot
          && image.checksum === sourceImage.checksum
          && image.generationStatus === "completed"
          && image.publicUrl)
        : undefined;
      if (existing) {
        reusedExisting += 1;
        selections.push({
          slot: source.slot,
          existingImageId: existing.id,
          updates: { role: source.role, anchorHeading: source.anchorHeading, alt, caption, sortOrder: source.role === "hero" ? 0 : sources.indexOf(source) },
        });
        continue;
      }

      const bytes = await downloadBlogImage(sourceObjectKey);
      const checksum = sourceImage?.checksum || crypto.createHash("sha256").update(bytes).digest("hex");
      const checksumMatch = targetImages.find(image =>
        image.slot === source.slot
        && image.checksum === checksum
        && image.generationStatus === "completed"
        && image.publicUrl);
      if (checksumMatch) {
        reusedExisting += 1;
        selections.push({
          slot: source.slot,
          existingImageId: checksumMatch.id,
          updates: { role: source.role, anchorHeading: source.anchorHeading, alt, caption, sortOrder: source.role === "hero" ? 0 : sources.indexOf(source) },
        });
        continue;
      }

      const objectKey = buildObjectKey(target.id, source.role, source.slot);
      await uploadBlogImage(objectKey, bytes);
      uploadedObjectKeys.push(objectKey);
      selections.push({
        slot: source.slot,
        values: {
          postId: target.id,
          role: source.role,
          slot: source.slot,
          anchorHeading: source.anchorHeading,
          source: sourceImage?.source || "ai",
          generationStatus: "completed",
          reviewStatus: "selected",
          objectKey,
          publicUrl: getManagedBlogImagePublicUrl(objectKey),
          mimeType: "image/webp",
          width: sourceImage?.width || null,
          height: sourceImage?.height || null,
          bytes: bytes.length,
          checksum,
          alt,
          caption,
          safeVisualBrief: sourceImage?.safeVisualBrief || null,
          prompt: sourceImage?.prompt || null,
          promptVersion: sourceImage?.promptVersion || null,
          provider: sourceImage?.provider || null,
          model: sourceImage?.model || null,
          generationRunId: null,
          imageJobId: null,
          startedAt: sourceImage?.startedAt || null,
          completedAt: new Date(),
          durationMs: sourceImage?.durationMs || null,
          errorCode: null,
          errorMessage: null,
          sortOrder: source.role === "hero" ? 0 : sources.indexOf(source),
        },
        updates: { role: source.role, anchorHeading: source.anchorHeading, alt, caption, sortOrder: source.role === "hero" ? 0 : sources.indexOf(source) },
      });
    }

    const selected = await replaceSelectedDraftBlogImages({
      postId: target.id,
      expectedUpdatedAt: target.updatedAt,
      selections,
      authoritative: true,
    });
    uploadedCopies += uploadedObjectKeys.length;
    uploadedObjectKeys.length = 0;

    const candidates: BlogPostImage[] = [];
    const refreshedTargetImages = await listBlogPostImages(target.id);
    const allTargetAnchors = getInlineImageAnchors(target.content || "", 2);
    for (const sourceImage of candidateSourceImages) {
      const anchorIndex = sourceImage.role === "inline"
        ? Math.max(0, (Number(sourceImage.slot.split(":")[1]) || 1) - 1)
        : -1;
      const anchorHeading = sourceImage.role === "inline"
        ? allTargetAnchors[anchorIndex] || null
        : null;
      const alt = buildBlogImageAlt(target, sourceImage.role, anchorHeading);
      const caption = buildBlogImageCaption(target, sourceImage.role, anchorHeading);
      const existing = refreshedTargetImages.find(image =>
        image.slot === sourceImage.slot
        && image.generationStatus === "completed"
        && image.publicUrl
        && (sourceImage.checksum
          ? image.checksum === sourceImage.checksum
          : image.publicUrl === sourceImage.publicUrl));
      if (existing) {
        reusedExisting += 1;
        const updated = await updateDraftBlogPostImage(target.id, existing.id, {
          role: sourceImage.role,
          anchorHeading,
          alt,
          caption,
          sortOrder: sourceImage.sortOrder,
        });
        candidates.push(updated || existing);
        continue;
      }

      const managed = isManagedBlogImagePublicUrl(sourceImage.publicUrl!);
      if (sourceImage.source === "ai" && !managed) {
        throw Object.assign(
          new Error("The sibling AI image candidate is not in managed Vercel Blob storage and cannot be copied safely"),
          { statusCode: 409 },
        );
      }

      let objectKey: string | null = null;
      let publicUrl = sourceImage.publicUrl!;
      let bytesLength = sourceImage.bytes;
      let checksum = sourceImage.checksum;
      if (managed) {
        const sourceObjectKey = sourceImage.objectKey
          || sourceImage.publicUrl!.slice("/public-objects/".length);
        const bytes = await downloadBlogImage(sourceObjectKey);
        checksum = checksum || crypto.createHash("sha256").update(bytes).digest("hex");
        objectKey = buildObjectKey(target.id, sourceImage.role, sourceImage.slot);
        await uploadBlogImage(objectKey, bytes);
        uploadedObjectKeys.push(objectKey);
        publicUrl = getManagedBlogImagePublicUrl(objectKey);
        bytesLength = bytes.length;
      }

      const created = await createDraftBlogPostImage({
        postId: target.id,
        role: sourceImage.role,
        slot: sourceImage.slot,
        anchorHeading,
        source: sourceImage.source,
        generationStatus: "completed",
        reviewStatus: "candidate",
        objectKey,
        publicUrl,
        mimeType: sourceImage.mimeType,
        width: sourceImage.width,
        height: sourceImage.height,
        bytes: bytesLength,
        checksum,
        alt,
        caption,
        safeVisualBrief: sourceImage.safeVisualBrief,
        prompt: sourceImage.prompt,
        promptVersion: sourceImage.promptVersion,
        provider: sourceImage.provider,
        model: sourceImage.model,
        generationRunId: null,
        imageJobId: null,
        startedAt: sourceImage.startedAt,
        completedAt: new Date(),
        durationMs: sourceImage.durationMs,
        errorCode: null,
        errorMessage: null,
        sortOrder: sourceImage.sortOrder,
      });
      if (objectKey) {
        uploadedCopies += 1;
        const cleanupIndex = uploadedObjectKeys.indexOf(objectKey);
        if (cleanupIndex >= 0) uploadedObjectKeys.splice(cleanupIndex, 1);
      }
      candidates.push(created);
      refreshedTargetImages.push(created);
    }
    return {
      sourcePostId: source.id,
      sourceLanguage: source.language === "es" ? "es" : "en",
      selected,
      candidates,
      uploadedCopies,
      reusedExisting,
    };
  } catch (error) {
    await cleanupUnregisteredSiblingCopies(uploadedObjectKeys);
    throw error;
  }
}

export async function reuseSelectedSiblingBlogImages(
  target: BlogPostWithRelations,
): Promise<BlogSiblingImageReuseResult> {
  const sibling = await getBlogTranslationSibling(target);
  if (!sibling) {
    throw Object.assign(new Error("This draft does not have a translation sibling yet"), { statusCode: 409 });
  }
  return copyAvailableBlogImages(sibling, target);
}

export type BlogSiblingImageSyncResult =
  | ({ status: "synced"; targetPostId: number } & BlogSiblingImageReuseResult)
  | {
      status: "skipped";
      reason: "missing-sibling" | "published-sibling" | "already-aligned";
      sourcePostId: number;
      targetPostId: number | null;
      selected: BlogPostImage[];
      candidates: BlogPostImage[];
      uploadedCopies: 0;
      reusedExisting: 0;
    };

function imageIdentity(image: BlogPostImage): string {
  return `${image.slot}:${image.checksum || image.publicUrl || "missing"}`;
}

function availableImagePriority(images: BlogPostImage[]): number {
  const completed = images.filter(image =>
    image.reviewStatus !== "rejected"
    && image.generationStatus === "completed"
    && image.publicUrl);
  const selectedCount = completed.filter(image => image.reviewStatus === "selected").length;
  const inlineCount = completed.filter(image => image.role === "inline").length;
  const aiCount = completed.filter(image => image.source === "ai").length;
  const heroCount = completed.some(image => image.role === "hero") ? 1 : 0;
  return selectedCount * 10_000 + completed.length * 1_000 + inlineCount * 100 + aiCount * 10 + heroCount;
}

function availableImageSignature(images: BlogPostImage[]): string {
  return images
    .filter(image =>
      image.reviewStatus !== "rejected"
      && image.generationStatus === "completed"
      && image.publicUrl)
    .map(image => `${image.reviewStatus}:${imageIdentity(image)}`)
    .sort()
    .join("|");
}

export async function syncSelectedBlogImagesToDraftSibling(
  source: BlogPostWithRelations,
): Promise<BlogSiblingImageSyncResult> {
  const sibling = await getBlogTranslationSibling(source);
  if (!sibling) {
    return {
      status: "skipped",
      reason: "missing-sibling",
      sourcePostId: source.id,
      targetPostId: null,
      selected: [],
      candidates: [],
      uploadedCopies: 0,
      reusedExisting: 0,
    };
  }
  if (sibling.status !== "draft") {
    return {
      status: "skipped",
      reason: "published-sibling",
      sourcePostId: source.id,
      targetPostId: sibling.id,
      selected: [],
      candidates: [],
      uploadedCopies: 0,
      reusedExisting: 0,
    };
  }
  const result = await copyAvailableBlogImages(source, sibling);
  return { status: "synced", targetPostId: sibling.id, ...result };
}

export async function reconcileBilingualBlogImages(
  current: BlogPostWithRelations,
): Promise<BlogSiblingImageSyncResult> {
  const sibling = await getBlogTranslationSibling(current);
  if (!sibling) {
    return {
      status: "skipped",
      reason: "missing-sibling",
      sourcePostId: current.id,
      targetPostId: null,
      selected: [],
      candidates: [],
      uploadedCopies: 0,
      reusedExisting: 0,
    };
  }

  const [currentImages, siblingImages] = await Promise.all([
    listBlogPostImages(current.id),
    listBlogPostImages(sibling.id),
  ]);
  if (availableImageSignature(currentImages) === availableImageSignature(siblingImages)) {
    return {
      status: "skipped",
      reason: "already-aligned",
      sourcePostId: current.id,
      targetPostId: sibling.id,
      selected: [],
      candidates: [],
      uploadedCopies: 0,
      reusedExisting: 0,
    };
  }

  const currentPriority = availableImagePriority(currentImages);
  const siblingPriority = availableImagePriority(siblingImages);
  let source: BlogPostWithRelations;
  let target: BlogPostWithRelations;
  if (currentPriority !== siblingPriority) {
    source = currentPriority > siblingPriority ? current : sibling;
    target = source.id === current.id ? sibling : current;
  } else if (current.status !== "draft" && sibling.status === "draft") {
    source = current;
    target = sibling;
  } else if (sibling.status !== "draft" && current.status === "draft") {
    source = sibling;
    target = current;
  } else if (current.status === "draft" && sibling.status === "draft") {
    const currentWasFirst = current.createdAt.getTime() < sibling.createdAt.getTime()
      || (current.createdAt.getTime() === sibling.createdAt.getTime() && current.id < sibling.id);
    source = currentWasFirst ? current : sibling;
    target = currentWasFirst ? sibling : current;
  } else {
    return {
      status: "skipped",
      reason: "published-sibling",
      sourcePostId: current.id,
      targetPostId: sibling.id,
      selected: [],
      candidates: [],
      uploadedCopies: 0,
      reusedExisting: 0,
    };
  }
  if (target.status !== "draft") {
    return {
      status: "skipped",
      reason: "published-sibling",
      sourcePostId: source.id,
      targetPostId: target.id,
      selected: [],
      candidates: [],
      uploadedCopies: 0,
      reusedExisting: 0,
    };
  }
  const result = await copyAvailableBlogImages(source, target);
  return { status: "synced", targetPostId: target.id, ...result };
}

function assertBlogImageInputsSafe(input: GenerateVariantInput): void {
  const sensitiveInputs = [
    input.post.title,
    input.post.excerpt,
    input.anchorHeading,
    getPlainTextFromHtml(input.post.content || ""),
  ].filter((value): value is string => Boolean(value));
  if (containsLikelyPatientIdentifierAcrossTextFields(sensitiveInputs)) {
    throw Object.assign(new Error("Blog image inputs must not include patient-identifying information"), {
      statusCode: 400,
      errorCode: "phi_detected",
    });
  }
}

function prepareBlogImageVariant(
  input: GenerateVariantInput,
  generationStatus: "pending" | "generating",
): Omit<InsertBlogPostImage, "imageJobId"> {
  assertBlogImageInputsSafe(input);
  const config = getBlogImageConfig();
  const safeVisualBrief = buildSafeVisualBrief(
    input.post,
    input.role,
    input.anchorHeading,
    input.slot,
  );
  const prompt = buildBlogImagePrompt(safeVisualBrief);
  const startedAt = generationStatus === "generating" ? new Date() : null;
  return {
    postId: input.post.id,
    role: input.role,
    slot: input.slot,
    anchorHeading: input.anchorHeading || null,
    source: "ai",
    generationStatus,
    reviewStatus: "candidate",
    objectKey: null,
    publicUrl: null,
    mimeType: "image/webp",
    width: null,
    height: null,
    bytes: null,
    checksum: null,
    alt: buildBlogImageAlt(input.post, input.role, input.anchorHeading),
    caption: buildBlogImageCaption(input.post, input.role, input.anchorHeading),
    safeVisualBrief,
    prompt,
    promptVersion: BLOG_IMAGE_PROMPT_VERSION,
    provider: "openai",
    model: config.model,
    generationRunId: input.generationRunId || null,
    startedAt,
    completedAt: null,
    durationMs: null,
    errorCode: null,
    errorMessage: null,
    sortOrder: input.sortOrder || 0,
  };
}

async function normalizeGeneratedWebp(input: Buffer): Promise<{
  bytes: Buffer;
  width: number;
  height: number;
  checksum: string;
}> {
  const output = await sharp(input)
    .rotate()
    .webp({ quality: 82, effort: 4 })
    .toBuffer({ resolveWithObject: true });
  const width = output.info.width;
  const height = output.info.height;
  if (!width || !height || width > 3840 || height > 3840 || width * height > 8_294_400) {
    throw Object.assign(new Error("Generated image dimensions are outside the allowed range"), {
      errorCode: "invalid_dimensions",
    });
  }
  return {
    bytes: output.data,
    width,
    height,
    checksum: crypto.createHash("sha256").update(output.data).digest("hex"),
  };
}

async function processPreparedBlogImageVariant(
  postId: number,
  variant: BlogPostImage,
): Promise<BlogPostImage> {
  const prompt = variant.prompt;
  if (!prompt) throw new Error("Prepared blog image variant is missing its safe prompt");
  const startedAt = variant.startedAt || new Date();
  let uploadedObjectKey: string | null = null;
  try {
    const generated = await generateImageWithOpenAi(prompt);
    const normalized = await normalizeGeneratedWebp(generated.bytes);
    const objectKey = buildObjectKey(postId, variant.role, variant.slot);
    await uploadBlogImage(objectKey, normalized.bytes);
    uploadedObjectKey = objectKey;
    const completedAt = new Date();
    const completed = await updateBlogPostImage(variant.id, {
      generationStatus: "completed",
      objectKey,
      publicUrl: getManagedBlogImagePublicUrl(objectKey),
      mimeType: "image/webp",
      width: normalized.width,
      height: normalized.height,
      bytes: normalized.bytes.length,
      checksum: normalized.checksum,
      provider: generated.provider,
      model: generated.model,
      completedAt,
      durationMs: completedAt.getTime() - startedAt.getTime(),
      errorCode: null,
      errorMessage: null,
    });
    if (!completed) throw new Error("Generated image record disappeared before completion");
    return completed;
  } catch (error) {
    if (uploadedObjectKey) {
      await deleteBlogImageObject(uploadedObjectKey).catch(cleanupError => {
        console.error("Could not clean up uncommitted blog image object:", cleanupError);
      });
    }
    const details = getErrorDetails(error);
    const completedAt = new Date();
    const failed = await updateBlogPostImage(variant.id, {
      generationStatus: "failed",
      completedAt,
      durationMs: completedAt.getTime() - startedAt.getTime(),
      errorCode: details.code,
      errorMessage: details.message,
    });
    if (!failed) throw error;
    return failed;
  }
}

export async function generateBlogImageVariant(
  input: GenerateVariantInput,
): Promise<BlogPostImage> {
  const variant = await createDraftBlogPostImage(prepareBlogImageVariant(input, "generating"));
  return processPreparedBlogImageVariant(input.post.id, variant);
}

export async function generateBlogImageSet(
  post: BlogPostWithRelations,
  options: BlogImageSetOptions = {},
): Promise<BlogImageGenerationSummary> {
  await markStaleGeneratingBlogImagesFailed(post.id);
  await ensureCuratedHeroImage(post);
  if (!isBlogImageEnabled()) {
    return {
      enabled: false,
      generated: [],
      failed: [],
      warnings: ["AI image generation is disabled; the curated hero remains selected."],
    };
  }

  const config = getBlogImageConfig();
  const role = options.role || "all";
  const generated: BlogPostImage[] = [];
  const failed: BlogPostImage[] = [];
  const warnings: string[] = [];
  const requests: Array<Omit<GenerateVariantInput, "post">> = [];

  if (role === "all" || role === "hero") {
    requests.push({
      role: "hero",
      slot: "hero",
      anchorHeading: null,
      generationRunId: options.generationRunId,
      sortOrder: 0,
    });
  }

  if (role === "all" || role === "inline") {
    const maxInline = Math.min(config.maxInline, options.maxInline ?? config.maxInline);
    const anchors = getInlineImageAnchors(post.content || "", maxInline);
    anchors.forEach((anchorHeading, index) => {
      requests.push({
        role: "inline",
        slot: `inline:${index + 1}`,
        anchorHeading,
        generationRunId: options.generationRunId,
        sortOrder: index + 1,
      });
    });
    if (anchors.length === 0) warnings.push("No article headings were available for inline image anchors.");
  }

  for (const request of requests) {
    try {
      const image = await generateBlogImageVariant({ post, ...request });
      if (image.generationStatus === "completed") generated.push(image);
      else {
        failed.push(image);
        warnings.push(`${image.slot}: ${image.errorMessage || "image generation failed"}`);
      }
    } catch (error) {
      const details = getErrorDetails(error);
      warnings.push(`${request.slot}: ${details.message}`);
    }
  }

  return { enabled: true, generated, failed, warnings };
}

function prepareBlogImageSetRequests(
  post: BlogPostWithRelations,
  options: BlogImageSetOptions,
): {
  role: "hero" | "inline" | "all";
  maxInline: number;
  requests: Array<Omit<GenerateVariantInput, "post">>;
  warnings: string[];
} {
  const config = getBlogImageConfig();
  const role = options.role || "all";
  const maxInline = Math.min(config.maxInline, options.maxInline ?? config.maxInline);
  const requests: Array<Omit<GenerateVariantInput, "post">> = [];
  const warnings: string[] = [];

  if (role === "all" || role === "hero") {
    requests.push({
      role: "hero",
      slot: "hero",
      anchorHeading: null,
      generationRunId: options.generationRunId,
      sortOrder: 0,
    });
  }
  if (role === "all" || role === "inline") {
    const anchors = getInlineImageAnchors(post.content || "", maxInline);
    anchors.forEach((anchorHeading, index) => {
      requests.push({
        role: "inline",
        slot: `inline:${index + 1}`,
        anchorHeading,
        generationRunId: options.generationRunId,
        sortOrder: index + 1,
      });
    });
    if (anchors.length === 0) warnings.push("No article headings were available for inline image anchors.");
  }
  return { role, maxInline, requests, warnings };
}

function getPersistedWarnings(job: BlogImageGenerationJob): string[] {
  const warnings = job.result?.warnings;
  const persisted = Array.isArray(warnings)
    ? warnings.filter((value): value is string => typeof value === "string")
    : [];
  const recoveryWarning = job.result?.recoveryWarning;
  return typeof recoveryWarning === "string"
    ? [...persisted, recoveryWarning]
    : persisted;
}

function buildInitialJobResult(slotCount: number, warnings: string[]): Record<string, unknown> {
  return {
    total: slotCount,
    completed: 0,
    failed: 0,
    pending: slotCount,
    generating: 0,
    generatedImageIds: [],
    failedImageIds: [],
    warnings,
  };
}

export async function createPersistedBlogImageSetJob(
  post: BlogPostWithRelations,
  options: BlogImageSetOptions,
  idempotencyKey: string,
): Promise<{ job: BlogImageGenerationJob; created: boolean }> {
  await markStaleGeneratingBlogImagesFailed(post.id);
  await ensureCuratedHeroImage(post);
  const prepared = prepareBlogImageSetRequests(post, options);
  const slots = prepared.requests.map(request => prepareBlogImageVariant({ post, ...request }, "pending"));
  return createBlogImageGenerationJobIfAbsent({
    postId: post.id,
    idempotencyKey,
    operation: "generate_set",
    role: prepared.role,
    maxInline: prepared.maxInline,
    initialResult: buildInitialJobResult(slots.length, prepared.warnings),
    slots,
  });
}

export async function createPersistedBlogImageRegenerationJob(
  post: BlogPostWithRelations,
  imageId: number,
  idempotencyKey: string,
): Promise<{ job: BlogImageGenerationJob; created: boolean }> {
  await markStaleGeneratingBlogImagesFailed(post.id);
  const source = await getBlogPostImage(imageId);
  if (!source || source.postId !== post.id) {
    throw Object.assign(new Error("Blog image variant not found"), { statusCode: 404 });
  }
  const request: Omit<GenerateVariantInput, "post"> = {
    role: source.role,
    slot: source.slot,
    anchorHeading: source.anchorHeading,
    sortOrder: source.sortOrder,
  };
  const slots = [prepareBlogImageVariant({ post, ...request }, "pending")];
  return createBlogImageGenerationJobIfAbsent({
    postId: post.id,
    idempotencyKey,
    operation: "regenerate_variant",
    role: source.role,
    maxInline: 1,
    sourceImageId: source.id,
    initialResult: buildInitialJobResult(1, []),
    slots,
  });
}

export async function executePersistedBlogImageGenerationJob(
  jobId: number,
): Promise<BlogImageGenerationJob | undefined> {
  const claimed = await claimBlogImageGenerationJob(jobId);
  if (!claimed) return getBlogImageGenerationJob(jobId);

  const heartbeatTimer = setInterval(() => {
    void heartbeatBlogImageGenerationJob(jobId).catch(error => {
      console.error(`Could not heartbeat blog image job ${jobId}:`, error);
    });
  }, 15_000);

  try {
    const post = await getBlogPostById(claimed.postId);
    if (!post || post.status !== "draft") {
      return failBlogImageGenerationJob(
        jobId,
        "draft_unavailable",
        "The draft changed or disappeared before image generation could finish.",
      );
    }

    const initialWarnings = getPersistedWarnings(claimed);
    const initialSlots = await listBlogImageJobSlots(jobId);
    for (const slot of initialSlots) {
      if (slot.generationStatus !== "pending") continue;
      const claimedSlot = await claimPendingBlogImageJobSlot(jobId, slot.id);
      if (!claimedSlot) continue;
      await processPreparedBlogImageVariant(post.id, claimedSlot);
      const progressSlots = await listBlogImageJobSlots(jobId);
      const progress = summarizeBlogImageJobSlots(progressSlots, initialWarnings).result;
      await updateBlogImageGenerationJobProgress(jobId, progress);
    }

    const finalSlots = await listBlogImageJobSlots(jobId);
    if (finalSlots.some(slot => slot.generationStatus === "pending" || slot.generationStatus === "generating")) {
      throw new Error("Image job still has non-terminal slots after its worker pass");
    }
    const summary = summarizeBlogImageJobSlots(finalSlots, initialWarnings);
    return completeBlogImageGenerationJob(jobId, summary.status, summary.result);
  } catch (error) {
    const details = getErrorDetails(error);
    await requeueBlogImageGenerationJobAfterWorkerError(
      jobId,
      `The image worker stopped safely before untouched slots were charged: ${details.message}`,
    ).catch(dbError => {
      console.error(`Could not persist blog image job ${jobId} interruption:`, dbError);
    });
    throw error;
  } finally {
    clearInterval(heartbeatTimer);
  }
}

export async function recoverPersistedBlogImageGenerationJob(
  job: BlogImageGenerationJob,
): Promise<BlogImageGenerationJob> {
  if (job.status === "admitting") {
    return (await expireStaleBlogImageJobAdmission(job.id)) || job;
  }
  if (job.status !== "running") return job;
  return (await recoverStaleBlogImageGenerationJob(job.id)) || job;
}

export async function deleteBlogImageVariant(postId: number, imageId: number): Promise<void> {
  const claimed = await claimBlogPostImageForDeletion(postId, imageId);
  if (!claimed) {
    throw Object.assign(new Error("Only an unselected AI variant on a draft can be deleted"), {
      statusCode: 409,
    });
  }
  if (claimed.objectKey) await deleteBlogImageObject(claimed.objectKey);
  const deleted = await finalizeBlogPostImageDeletion(postId, imageId);
  if (!deleted) {
    throw Object.assign(new Error("The draft changed while the image was being deleted; retry before publishing"), {
      statusCode: 409,
    });
  }
}

export async function deleteBlogImageObjectsOnly(objectKeys: string[]): Promise<number> {
  const queuedObjectKeys = await listQueuedBlogImageCleanupKeys();
  const uniqueObjectKeys = Array.from(new Set([...queuedObjectKeys, ...objectKeys].filter(Boolean)));
  let deletedCount = 0;
  const failures: string[] = [];
  for (const objectKey of uniqueObjectKeys) {
    try {
      await deleteBlogImageObject(objectKey);
      await completeBlogImageCleanup(objectKey);
      deletedCount += 1;
    } catch (error) {
      failures.push(objectKey);
      await markBlogImageCleanupFailed(objectKey, error).catch(queueError => {
        console.error(`Could not update durable cleanup state for ${objectKey}:`, queueError);
      });
    }
  }
  if (failures.length > 0) {
    throw Object.assign(new Error(`${failures.length} blog image object cleanup operation(s) remain queued`), {
      statusCode: 503,
      code: "blog_image_cleanup_incomplete",
      failedObjectKeys: failures,
      deletedCount,
    });
  }
  return deletedCount;
}
