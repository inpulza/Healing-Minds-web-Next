import crypto from "crypto";
import sharp from "sharp";
import type { BlogPostImage, BlogPostImageRole } from "@shared/schema";
import type { BlogPostWithRelations } from "../storage";
import { containsLikelyPatientIdentifier } from "../privacy";
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
  createDraftBlogPostImage,
  ensureCuratedHeroImage,
  finalizeBlogPostImageDeletion,
  getBlogPostImage,
  updateBlogPostImage,
} from "./storage";
import {
  deleteBlogImageObject,
  getManagedBlogImagePublicUrl,
  uploadBlogImage,
} from "./object-storage";
import { getInlineImageAnchors } from "./render";

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

export async function generateBlogImageVariant(
  input: GenerateVariantInput,
): Promise<BlogPostImage> {
  const sensitiveContext = [
    input.post.title,
    input.post.excerpt,
    input.anchorHeading,
    getPlainTextFromHtml(input.post.content || ""),
  ].filter(Boolean).join(" ");
  if (containsLikelyPatientIdentifier(sensitiveContext)) {
    throw Object.assign(new Error("Blog image inputs must not include patient-identifying information"), {
      statusCode: 400,
      errorCode: "phi_detected",
    });
  }

  const config = getBlogImageConfig();
  const safeVisualBrief = buildSafeVisualBrief(
    input.post,
    input.role,
    input.anchorHeading,
    input.slot,
  );
  const prompt = buildBlogImagePrompt(safeVisualBrief);
  const startedAt = new Date();
  const variant = await createDraftBlogPostImage({
    postId: input.post.id,
    role: input.role,
    slot: input.slot,
    anchorHeading: input.anchorHeading || null,
    source: "ai",
    generationStatus: "generating",
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
  });

  let uploadedObjectKey: string | null = null;
  try {
    const generated = await generateImageWithOpenAi(prompt);
    const normalized = await normalizeGeneratedWebp(generated.bytes);
    const objectKey = buildObjectKey(input.post.id, input.role, input.slot);
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

export async function generateBlogImageSet(
  post: BlogPostWithRelations,
  options: {
    role?: "hero" | "inline" | "all";
    generationRunId?: number;
    maxInline?: number;
  } = {},
): Promise<BlogImageGenerationSummary> {
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

export async function regenerateBlogImageVariant(
  post: BlogPostWithRelations,
  imageId: number,
): Promise<BlogPostImage> {
  const source = await getBlogPostImage(imageId);
  if (!source || source.postId !== post.id) {
    throw Object.assign(new Error("Blog image variant not found"), { statusCode: 404 });
  }
  return generateBlogImageVariant({
    post,
    role: source.role,
    slot: source.slot,
    anchorHeading: source.anchorHeading,
    sortOrder: source.sortOrder,
  });
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
  const uniqueObjectKeys = Array.from(new Set(objectKeys.filter(Boolean)));
  let deletedCount = 0;
  for (const objectKey of uniqueObjectKeys) {
    await deleteBlogImageObject(objectKey);
    deletedCount += 1;
  }
  return deletedCount;
}
