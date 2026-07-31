import { randomUUID } from "node:crypto";
import type { Express, Request, Response } from "express";
import { ZodError, type z } from "zod";
import {
  adminBlogAutoGenerateSchema,
  adminBlogInternalLinkAuditSchema,
  adminBlogFixSchema,
  adminBlogCategorySchema,
  adminBlogGenerateDraftSchema,
  adminBlogPostSchema,
  adminBlogPostUpdateSchema,
  adminBlogRedirectCleanupSchema,
  adminBlogRedirectSchema,
  adminBlogStatusSchema,
  adminBlogTagSchema,
  adminBlogTopicPlannerSchema,
  assertPublishReady,
  validatePostForPublish,
} from "./admin-validation";
import {
  createBlogCategory,
  createBlogPost,
  createBlogPostForGenerationRun,
  createBlogTag,
  deleteBlogPostWithRedirect,
  findBlogPostsLinkingToPath,
  findPublishedPostsLinkingToPost,
  getActiveBlogRedirect,
  getAdminBlogPosts,
  getAnyBlogPostBySlug,
  getBlogAuthors,
  getBlogCategories,
  getBlogPostById,
  getBlogPostPath,
  getBlogRedirectById,
  getBlogRedirectBySourcePath,
  getBlogRedirects,
  getBlogStats,
  getBlogTags,
  normalizeInternalPath,
  updateBlogPostStatusWithImageGuard,
  upsertBlogRedirect,
  updateBlogPost,
  type BlogLanguage,
  type BlogPostStatusTransitionGuard,
} from "./storage";
import { estimateReadingTime, sanitizeBlogContentHtml } from "./sanitize";
import { assertBlogAiGenerationConfigured, generateBlogDraftWithAi } from "./ai/generator";
import { checkBlogAiRateLimit } from "./ai/rate-limit";
import { buildBlogEditorialBrief } from "./ai/editorial-brief";
import { buildBlogSemanticMemory, redactBlogSemanticMemoryForProvider } from "./ai/memory";
import { buildPersistedTopicDraftOverrides } from "./ai/planned-topic-provenance";
import { assertGuidedBlogTopicSafe, buildBlogTopicPlan, type BlogTopicPlanCandidate } from "./ai/topic-planner";
import { assertBlogTopicGenerationConfigured } from "./ai/responses-client";
import { buildTopicKey } from "./ai/topic-normalization";
import { HEALING_MINDS_TOPIC_STRATEGY_VERSION } from "./strategy/healing-minds";
import { applyDeterministicBlogFix } from "./content-fixes";
import { getCuratedFeaturedImageAlt, selectCuratedFeaturedImage } from "./featured-images";
import { ensureBlogInternalLinks } from "./internal-links";
import { selectBlogTagIds } from "./taxonomy";
import { buildBlogVerificationReport } from "./verification";
import { runSeoPublishingCheck } from "../seo/publishing";
import { getClientIp } from "../utils/client-ip";
import {
  appendBlogGenerationEvent,
  claimCompletedBlogPlanningRun,
  claimBlogGenerationRun,
  completeBlogGenerationRun,
  completeBlogPlanningRun,
  createBlogGenerationRun,
  failBlogGenerationRun,
  getBlogGenerationRun,
  getBlogGenerationRunByIdempotencyKey,
  getOpenBlogGenerationRun,
  listBlogGenerationEvents,
  markStaleBlogGenerationRunsInterrupted,
  queuePreparedBlogGenerationRun,
  updateBlogGenerationRun,
} from "./generation/storage";
import type { JsonObject } from "./generation/types";
import {
  getBlogTopicCandidateById,
  selectBlogTopicCandidate,
} from "./topic-candidate-storage";
import { containsLikelyPatientIdentifierInAiFields } from "./privacy";
import {
  deleteBlogImageObjectsOnly,
  generateBlogImageSet,
  type BlogImageGenerationSummary,
} from "./images/service";
import { ensureCuratedHeroImage } from "./images/storage";
import { registerBlogLinkRoutes } from "./links/routes";
import {
  isBlogLinkRuntimeEnabled,
  selectRuntimeBlogInternalLinks,
  selectRuntimeBlogResearchSources,
} from "./links/runtime";
import { getBlogLinkConfig } from "./links/config";
import {
  assertBlogPostLinksPublishReady,
  getBlogPostLinkReport,
  prepareManagedBlogPostTargetForPublish,
} from "./links/service";
import {
  reconcileStoredBlogPostLinks,
  rewriteAndReconcileRedirectLinks,
} from "./links/storage";
import { buildBlogPostStatusTransitionPlan } from "./lifecycle";

function sendValidationError(res: Response, error: unknown): void {
  const requestError = error as {
    statusCode?: number;
    message?: string;
    code?: string;
    checks?: unknown;
    linkReport?: unknown;
    matchedPostId?: number;
    overlapBasisPoints?: number;
    semanticConfidenceBasisPoints?: number;
    semanticReason?: string;
  };
  if (requestError.statusCode && requestError.statusCode >= 400 && requestError.statusCode < 600) {
    res.status(requestError.statusCode).json({
      success: false,
      message: requestError.message || "Invalid blog request",
      ...(requestError.code ? { code: requestError.code } : {}),
      ...(requestError.checks ? { checks: requestError.checks } : {}),
      ...(requestError.linkReport ? { linkReport: requestError.linkReport } : {}),
      ...(requestError.matchedPostId ? { matchedPostId: requestError.matchedPostId } : {}),
      ...(requestError.overlapBasisPoints !== undefined ? { overlapBasisPoints: requestError.overlapBasisPoints } : {}),
      ...(requestError.semanticConfidenceBasisPoints !== undefined
        ? { semanticConfidenceBasisPoints: requestError.semanticConfidenceBasisPoints }
        : {}),
      ...(requestError.semanticReason ? { semanticReason: requestError.semanticReason } : {}),
    });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Invalid blog payload",
      errors: error.errors.map(issue => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  const publishError = error as Error & { checks?: unknown };
  if (publishError.checks) {
    res.status(400).json({
      success: false,
      message: publishError.message,
      checks: publishError.checks,
    });
    return;
  }

  throw error;
}

function sendDbError(res: Response, error: unknown): void {
  const maybeDbError = error as { code?: string; detail?: string; message?: string };
  if (maybeDbError.code === "23505") {
    res.status(409).json({
      success: false,
      message: "A blog record with this unique value already exists",
      detail: maybeDbError.detail,
    });
    return;
  }

  console.error("Blog admin API error:", error);
  res.status(500).json({
    success: false,
    message: "Blog admin request failed",
  });
}

function parseId(req: Request): number | null {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function normalizeLanguage(value: unknown): BlogLanguage | "all" {
  return value === "en" || value === "es" ? value : "all";
}

function assertSafeBlogRedirectPath(sourcePath: string, targetPath: string): void {
  if (!sourcePath.startsWith("/blog/") && !sourcePath.startsWith("/es/blog/")) {
    throw Object.assign(new Error("Redirect source must be a blog post path"), { statusCode: 400 });
  }
  if (targetPath.startsWith("/api/") || targetPath === "/api" || targetPath.startsWith("/admin/") || targetPath === "/admin") {
    throw Object.assign(new Error("Redirect target must be a public internal path"), { statusCode: 400 });
  }
  if (sourcePath === targetPath) {
    throw Object.assign(new Error("Redirect source and target must be different"), { statusCode: 400 });
  }
}

function assertLocalPathInput(value: string, label: string): void {
  const trimmed = value.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || /^https?:\/\//i.test(trimmed)) {
    throw Object.assign(new Error(`${label} must be an internal path that starts with /`), { statusCode: 400 });
  }
}

function normalizeRedirectPayload(input: unknown) {
  const parsed = adminBlogRedirectSchema.parse(input);
  assertLocalPathInput(parsed.sourcePath, "Redirect source");
  assertLocalPathInput(parsed.targetPath, "Redirect target");
  const sourcePath = normalizeInternalPath(parsed.sourcePath);
  const targetPath = normalizeInternalPath(parsed.targetPath);
  assertSafeBlogRedirectPath(sourcePath, targetPath);
  return {
    ...parsed,
    sourcePath,
    targetPath,
    reason: parsed.reason || null,
    sourcePostId: parsed.sourcePostId || null,
  };
}

function getRedirectTargetOrNull(sourcePath: string, redirectTargetPath?: string | null): string | null {
  const rawTarget = redirectTargetPath?.trim();
  if (!rawTarget) return null;
  assertLocalPathInput(rawTarget, "Redirect target");
  const targetPath = normalizeInternalPath(rawTarget);
  assertSafeBlogRedirectPath(sourcePath, targetPath);
  return targetPath;
}

async function assertRedirectHasNoActiveChain(targetPath: string): Promise<void> {
  const chainedRedirect = await getActiveBlogRedirect(targetPath);
  if (chainedRedirect) {
    throw Object.assign(new Error("Redirect target already has an active redirect; choose the final destination instead"), { statusCode: 400 });
  }
}

async function assertRedirectDecision(sourcePath: string, redirectTargetPath?: string | null, confirmNoRedirect?: boolean): Promise<string | null> {
  const targetPath = getRedirectTargetOrNull(sourcePath, redirectTargetPath);
  if (targetPath) {
    await assertRedirectHasNoActiveChain(targetPath);
    return targetPath;
  }
  if (confirmNoRedirect === true) return null;
  throw Object.assign(new Error("Removing a published URL requires a redirect target or explicit no-redirect confirmation"), { statusCode: 400 });
}

async function getAvailableBlogSlug(baseSlug: string, language: BlogLanguage): Promise<string> {
  const normalizedBase = baseSlug || "blog-draft";
  let candidate = normalizedBase;

  for (let suffix = 2; suffix <= 50; suffix += 1) {
    const existing = await getAnyBlogPostBySlug(candidate, language);
    if (!existing) return candidate;
    candidate = `${normalizedBase}-${suffix}`;
  }

  return `${normalizedBase}-${Date.now()}`;
}

async function reconcileBlogPostLinksFailOpen(
  postId: number,
  options: {
    origin: "ai" | "manual" | "server_fix";
    generationRunId?: number;
    warnings?: string[];
  },
) {
  if (!isBlogLinkRuntimeEnabled()) return undefined;
  try {
    return await reconcileStoredBlogPostLinks(postId, {
      origin: options.origin,
      generationRunId: options.generationRunId,
      publicSiteUrl: getBlogLinkConfig().publicSiteUrl,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Link reconciliation failed";
    console.error(`Could not reconcile saved blog links for post ${postId}:`, error);
    options.warnings?.push(`Link Intelligence warning: ${message}. The draft remains saved for review.`);
    return undefined;
  }
}

async function getBlogPostLinkReportFailOpen(postId: number, context: string) {
  if (!isBlogLinkRuntimeEnabled()) return undefined;
  try {
    return await getBlogPostLinkReport(postId);
  } catch (error) {
    console.error(`Could not build ${context} link report for post ${postId}:`, error);
    return undefined;
  }
}

function normalizePostPayload(input: unknown) {
  const parsed = adminBlogPostSchema.parse(input);
  if (parsed.status === "published") {
    throw Object.assign(new Error("Use the publish action to publish a post"), { statusCode: 400 });
  }

  const content = sanitizeBlogContentHtml(parsed.content);
  return {
    ...parsed,
    content,
    readingTime: parsed.readingTime || estimateReadingTime(content),
    publishedAt: null,
  };
}

function normalizePostUpdatePayload(input: unknown) {
  if (input && typeof input === "object" && !Array.isArray(input) && "status" in input) {
    throw Object.assign(new Error("Use the status action to change a post status"), { statusCode: 400 });
  }

  const parsed = adminBlogPostUpdateSchema.parse(input);
  if (parsed.status === "published") {
    throw Object.assign(new Error("Use the publish action to publish a post"), { statusCode: 400 });
  }

  const { content: rawContent, ...rest } = parsed;
  if (typeof rawContent !== "string") {
    return rest;
  }

  const content = sanitizeBlogContentHtml(rawContent);

  return {
    ...rest,
    content,
    readingTime: rest.readingTime || estimateReadingTime(content),
  };
}

export type AdminBlogGenerateDraftPayload = z.infer<typeof adminBlogGenerateDraftSchema> & {
  topicCandidateId?: number;
  topicKey?: string;
  expertiseAngle?: string;
  sourceRecommendationIds?: string[];
  internalLinkTargetIds?: string[];
};
type AdminBlogAutoGeneratePayload = z.infer<typeof adminBlogAutoGenerateSchema>;

type BlogGenerationWorkflowStep = {
  id: string;
  label: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  detail?: string;
};

type BlogGenerationSelectedCandidate = Pick<
  BlogTopicPlanCandidate,
  | "id"
  | "candidateKey"
  | "topicCandidateId"
  | "topic"
  | "targetKeyword"
  | "topicKey"
  | "language"
  | "categoryId"
  | "categoryKey"
  | "categoryName"
  | "pillar"
  | "patientStage"
  | "contentFormat"
  | "searchIntent"
  | "tagIds"
  | "internalLinks"
  | "internalLinkTargetIds"
  | "sourceRecommendationIds"
  | "score"
  | "overlapScore"
  | "recommendation"
  | "angle"
  | "rationale"
  | "strategyVersion"
>;

type BlogGenerationWorkflow = {
  mode: "manual" | "auto-generate";
  generatedAt: string;
  authorId?: number;
  selectedCandidate?: BlogGenerationSelectedCandidate;
  steps: BlogGenerationWorkflowStep[];
};

type BlogGenerationProgressReporter = (
  workflow: BlogGenerationWorkflow,
  step: BlogGenerationWorkflowStep,
) => Promise<void>;

async function updateWorkflowStep(
  workflow: BlogGenerationWorkflow | undefined,
  step: BlogGenerationWorkflowStep,
  reportProgress?: BlogGenerationProgressReporter,
): Promise<void> {
  if (!workflow) return;
  const index = workflow.steps.findIndex(item => item.id === step.id);
  if (index >= 0) workflow.steps[index] = step;
  else workflow.steps.push(step);
  await reportProgress?.(workflow, step);
}

export async function createGeneratedBlogDraft(
  payload: AdminBlogGenerateDraftPayload,
  workflow?: BlogGenerationWorkflow,
  reportProgress?: BlogGenerationProgressReporter,
  generationRunId?: number,
) {
  await updateWorkflowStep(workflow, {
    id: "editorial-context",
    label: "Editorial context",
    status: "in_progress",
    detail: "Loading the selected clinical author and bilingual taxonomy.",
  }, reportProgress);
  const [authors, categories, tags] = await Promise.all([
    getBlogAuthors(),
    getBlogCategories(payload.language),
    getBlogTags(payload.language),
  ]);
  const author = authors.find(item => item.id === payload.authorId);
  const category = categories.find(item => item.id === payload.categoryId);
  const requestedTags = tags.filter(tag => payload.tagIds.includes(tag.id));

  if (!author) {
    throw Object.assign(new Error("Selected author was not found"), { statusCode: 400 });
  }
  if (!category) {
    throw Object.assign(new Error("Selected category must match the draft language"), { statusCode: 400 });
  }
  if (requestedTags.length !== payload.tagIds.length) {
    throw Object.assign(new Error("Selected tags must match the draft language"), { statusCode: 400 });
  }

  await updateWorkflowStep(workflow, {
    id: "editorial-context",
    label: "Editorial context",
    status: "completed",
    detail: `${author.name}; ${category.name}; ${requestedTags.length} requested tag${requestedTags.length === 1 ? "" : "s"}.`,
  }, reportProgress);

  await updateWorkflowStep(workflow, {
    id: "taxonomy-links",
    label: "Taxonomy and internal links",
    status: "in_progress",
    detail: "Selecting existing tags and verified internal routes.",
  }, reportProgress);

  const promptTagIds = selectBlogTagIds({
    language: payload.language,
    availableTags: tags,
    existingTagIds: payload.tagIds,
    topic: payload.topic,
    targetKeyword: payload.targetKeyword,
    excerpt: payload.additionalContext,
    categoryName: category.name,
  });
  const selectedTags = tags.filter(tag => promptTagIds.includes(tag.id));
  const internalLinkSelection = await selectRuntimeBlogInternalLinks({
    language: payload.language,
    requestedLinks: payload.internalLinks,
    requestedTargetIds: payload.internalLinkTargetIds,
    topic: payload.topic,
    targetKeyword: payload.targetKeyword,
    categoryName: category.name,
  });
  const selectedInternalLinks = internalLinkSelection.hrefs;

  await updateWorkflowStep(workflow, {
    id: "taxonomy-links",
    label: "Taxonomy and internal links",
    status: "completed",
    detail: `${selectedTags.length} tag${selectedTags.length === 1 ? "" : "s"} selected; ${selectedInternalLinks.length} internal link${selectedInternalLinks.length === 1 ? "" : "s"} selected.`,
  }, reportProgress);

  await updateWorkflowStep(workflow, {
    id: "trusted-research",
    label: "Trusted research",
    status: "in_progress",
    detail: "Selecting sources from the curated medical allowlist.",
  }, reportProgress);

  const research = await selectRuntimeBlogResearchSources({
    topic: payload.topic,
    additionalContext: payload.additionalContext,
    targetKeyword: payload.targetKeyword,
    language: payload.language,
    categoryName: category.name,
    tagNames: selectedTags.map(tag => tag.name),
    internalLinks: selectedInternalLinks,
  }, payload.sourceRecommendationIds);
  await updateWorkflowStep(workflow, {
    id: "trusted-research",
    label: "Trusted research",
    status: "completed",
    detail: `${research.sources.length} allowlisted source${research.sources.length === 1 ? "" : "s"}; confidence ${research.confidence}.`,
  }, reportProgress);

  await updateWorkflowStep(workflow, {
    id: "semantic-memory",
    label: "Semantic memory",
    status: "in_progress",
    detail: "Comparing the topic with existing drafts and published articles.",
  }, reportProgress);

  const semanticMemory = await buildBlogSemanticMemory({
    topic: payload.topic,
    targetKeyword: payload.targetKeyword,
    language: payload.language,
    categoryName: category.name,
    tagNames: selectedTags.map(tag => tag.name),
  });
  const providerSemanticMemory = redactBlogSemanticMemoryForProvider(semanticMemory);
  await updateWorkflowStep(workflow, {
    id: "semantic-memory",
    label: "Semantic memory",
    status: "completed",
    detail: `${semanticMemory.recommendation.replace(/_/g, " ")}; ${semanticMemory.matches.length} possible overlap match${semanticMemory.matches.length === 1 ? "" : "es"}.`,
  }, reportProgress);

  await updateWorkflowStep(workflow, {
    id: "editorial-brief",
    label: "Editorial brief",
    status: "in_progress",
    detail: "Building the YMYL-safe article structure and depth target.",
  }, reportProgress);

  const editorialBrief = buildBlogEditorialBrief({
    topic: payload.topic,
    additionalContext: payload.additionalContext,
    targetKeyword: payload.targetKeyword,
    language: payload.language,
    categoryName: category.name,
    tagNames: selectedTags.map(tag => tag.name),
    internalLinks: selectedInternalLinks,
    researchSources: research.sources,
    semanticMemory,
  });
  await updateWorkflowStep(workflow, {
    id: "editorial-brief",
    label: "Editorial brief",
    status: "completed",
    detail: `${editorialBrief.requiredSections.length} required section${editorialBrief.requiredSections.length === 1 ? "" : "s"}; target ${editorialBrief.targetWordCount} words.`,
  }, reportProgress);

  await updateWorkflowStep(workflow, {
    id: "ai-draft",
    label: "AI draft",
    status: "in_progress",
    detail: "Generating the unpublished clinical education draft.",
  }, reportProgress);

  const generated = await generateBlogDraftWithAi({
    topic: payload.topic,
    additionalContext: payload.additionalContext,
    targetKeyword: payload.targetKeyword,
    language: payload.language,
    categoryName: category.name,
    tagNames: selectedTags.map(tag => tag.name),
    internalLinks: selectedInternalLinks,
    researchSources: research.sources,
    semanticMemory: providerSemanticMemory,
    editorialBrief,
  });
  await updateWorkflowStep(workflow, {
    id: "ai-draft",
    label: "AI draft",
    status: "completed",
    detail: generated.title,
  }, reportProgress);

  const slug = await getAvailableBlogSlug(generated.slug, payload.language);
  const finalTagIds = selectBlogTagIds({
    language: payload.language,
    availableTags: tags,
    existingTagIds: promptTagIds,
    topic: payload.topic,
    targetKeyword: payload.targetKeyword,
    title: generated.title,
    excerpt: generated.excerpt,
    contentHtml: generated.contentHtml,
    categoryName: category.name,
  });
  const contentWithInternalLinks = ensureBlogInternalLinks(generated.contentHtml, {
    language: payload.language,
    requestedLinks: selectedInternalLinks,
    topic: payload.topic,
    targetKeyword: payload.targetKeyword,
    title: generated.title,
    excerpt: generated.excerpt,
    categoryName: category.name,
  });
  const featuredImage = selectCuratedFeaturedImage({
    language: payload.language,
    title: generated.title,
    topic: payload.topic,
    targetKeyword: payload.targetKeyword,
    excerpt: generated.excerpt,
    contentHtml: contentWithInternalLinks.contentHtml,
    categoryName: category.name,
    tagNames: selectedTags.map(tag => tag.name),
  });
  const aiRiskNotes = [...generated.riskNotes];
  aiRiskNotes.push(...internalLinkSelection.warnings);
  const autoAddedTagNames = tags
    .filter(tag => finalTagIds.includes(tag.id) && !payload.tagIds.includes(tag.id))
    .map(tag => tag.name);
  if (autoAddedTagNames.length > 0) {
    aiRiskNotes.push(`Auto-selected topic tags for editor review: ${autoAddedTagNames.join(", ")}.`);
  }
  if (contentWithInternalLinks.addedLinks.length > 0) {
    aiRiskNotes.push(`Auto-added internal links for editor review: ${contentWithInternalLinks.addedLinks.join(", ")}.`);
  }
  aiRiskNotes.push(`Auto-selected curated featured image for editor review: ${featuredImage.label}.`);
  await updateWorkflowStep(workflow, {
    id: "featured-image",
    label: "Featured image",
    status: "in_progress",
    detail: "Matching an approved Healing Minds image to the article.",
  }, reportProgress);
  await updateWorkflowStep(workflow, {
    id: "featured-image",
    label: "Featured image",
    status: "completed",
    detail: `${featuredImage.label} selected from the curated Healing Minds image library.`,
  }, reportProgress);

  await updateWorkflowStep(workflow, {
    id: "sanitize-save",
    label: "Sanitize and save",
    status: "in_progress",
    detail: "Sanitizing HTML and saving one private draft.",
  }, reportProgress);
  const postPayload = {
    ...normalizePostPayload({
    title: generated.title,
    slug,
    language: payload.language,
    translationGroupId: payload.translationGroupId,
    excerpt: generated.excerpt,
    content: contentWithInternalLinks.contentHtml,
    featuredImage: featuredImage.url,
    featuredImageAlt: getCuratedFeaturedImageAlt(featuredImage, payload.language),
    authorId: payload.authorId,
    categoryId: payload.categoryId,
    status: "draft",
    isFeatured: false,
    metaTitle: generated.metaTitle,
    metaDescription: generated.metaDescription,
      tagIds: finalTagIds,
    }),
    ...(payload.topicCandidateId ? { topicCandidateId: payload.topicCandidateId } : {}),
    ...(payload.topicKey ? { topicKey: payload.topicKey } : {}),
    ...(payload.targetKeyword ? { targetKeyword: payload.targetKeyword } : {}),
    ...(payload.contentPillar ? { contentPillar: payload.contentPillar } : {}),
    ...(payload.patientStage ? { patientStage: payload.patientStage } : {}),
    ...(payload.contentFormat ? { contentFormat: payload.contentFormat } : {}),
    ...(payload.searchIntent ? { searchIntent: payload.searchIntent } : {}),
    ...(payload.expertiseAngle ? { expertiseAngle: payload.expertiseAngle } : {}),
    ...(payload.topicStrategyVersion ? { topicStrategyVersion: payload.topicStrategyVersion } : {}),
  };

  const post = generationRunId
    ? await createBlogPostForGenerationRun(postPayload, generationRunId)
    : await createBlogPost(postPayload);
  const linkReconciliation = await reconcileBlogPostLinksFailOpen(post.id, {
    origin: "ai",
    generationRunId,
    warnings: aiRiskNotes,
  });
  await updateWorkflowStep(workflow, {
    id: "sanitize-save",
    label: "Sanitize and save",
    status: "completed",
    detail: `Draft ${post.id} saved with status ${post.status}; publishedAt remains empty.`,
  }, reportProgress);

  let imageSummary: BlogImageGenerationSummary | undefined;
  if (generationRunId && workflow?.mode === "auto-generate") {
    await updateWorkflowStep(workflow, {
      id: "ai-images",
      label: "AI image variants",
      status: "in_progress",
      detail: "Keeping the curated hero selected while generating reviewed hero and inline candidates.",
    }, reportProgress);
    try {
      imageSummary = await generateBlogImageSet(post, {
        role: "all",
        generationRunId,
        maxInline: 2,
      });
      aiRiskNotes.push(...imageSummary.warnings.map(warning => `Image warning: ${warning}`));
      await updateWorkflowStep(workflow, {
        id: "ai-images",
        label: "AI image variants",
        status: "completed",
        detail: imageSummary.enabled
          ? `${imageSummary.generated.length} candidate${imageSummary.generated.length === 1 ? "" : "s"} ready; ${imageSummary.failed.length} failed. Curated hero remains selected pending review.`
          : "Image generation is disabled. Curated hero remains selected.",
      }, reportProgress);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Image generation failed";
      aiRiskNotes.push(`Image warning: ${message}. Curated hero remains selected.`);
      await updateWorkflowStep(workflow, {
        id: "ai-images",
        label: "AI image variants",
        status: "completed",
        detail: `Image attempt failed open: ${message}. Curated hero remains selected.`,
      }, reportProgress);
    }
  } else {
    await ensureCuratedHeroImage(post).catch(error => {
      console.error(`Could not persist curated image fallback for draft ${post.id}:`, error);
      aiRiskNotes.push("Curated image metadata could not be persisted; the existing featured image remains on the draft.");
    });
  }

  const persistedPost = await getBlogPostById(post.id) || post;
  const verification = buildBlogVerificationReport(persistedPost);
  const linkReport = await getBlogPostLinkReportFailOpen(
    persistedPost.id,
    "generated",
  );
  await updateWorkflowStep(workflow, {
    id: "verify",
    label: "Verification",
    status: "in_progress",
    detail: "Running the editorial and YMYL readiness checks.",
  }, reportProgress);
  await updateWorkflowStep(workflow, {
    id: "verify",
    label: "Verification",
    status: "completed",
    detail: `${verification.score}% score; ${verification.blocking.length} blocker${verification.blocking.length === 1 ? "" : "s"}.`,
  }, reportProgress);

  return {
    data: persistedPost,
    checks: validatePostForPublish(persistedPost),
    verification,
    linkReport,
    ai: {
      riskNotes: aiRiskNotes,
      research,
      semanticMemory,
      editorialBrief,
      images: imageSummary,
      linkReconciliation,
    },
  };
}

const AUTO_GENERATE_WORKFLOW_STEPS: Array<Pick<BlogGenerationWorkflowStep, "id" | "label">> = [
  { id: "strategy-context", label: "Strategy context" },
  { id: "topic-ideation", label: "Topic ideation" },
  { id: "deterministic-review", label: "Deterministic review" },
  { id: "semantic-review", label: "Semantic review" },
  { id: "topic-selection", label: "Topic selection" },
  { id: "editorial-context", label: "Editorial context" },
  { id: "taxonomy-links", label: "Taxonomy and internal links" },
  { id: "trusted-research", label: "Trusted research" },
  { id: "editorial-brief", label: "Editorial brief" },
  { id: "ai-draft", label: "AI draft" },
  { id: "featured-image", label: "Featured image" },
  { id: "sanitize-save", label: "Sanitize and save" },
  { id: "ai-images", label: "AI image variants" },
  { id: "verify", label: "Verification" },
];

export function createAutoGenerateWorkflow(): BlogGenerationWorkflow {
  return {
    mode: "auto-generate",
    generatedAt: new Date().toISOString(),
    steps: AUTO_GENERATE_WORKFLOW_STEPS.map(step => ({ ...step, status: "pending" })),
  };
}

async function prepareAutoGenerateWorkflow(
  payload: AdminBlogAutoGeneratePayload,
  reportProgress?: BlogGenerationProgressReporter,
  generationRunId?: number,
) : Promise<BlogGenerationWorkflow> {
  const workflow = createAutoGenerateWorkflow();
  await updateWorkflowStep(workflow, {
    id: "strategy-context",
    label: "Strategy context",
    status: "in_progress",
    detail: "Loading the bilingual Healing Minds taxonomy and existing topic inventory.",
  }, reportProgress);

  const [authors, categories, tags] = await Promise.all([
    getBlogAuthors(),
    getBlogCategories(payload.language),
    getBlogTags(payload.language),
  ]);
  const author = payload.authorId
    ? authors.find(item => item.id === payload.authorId)
    : authors.length === 1 ? authors[0] : undefined;
  if (!author) {
    const message = payload.authorId
      ? "Selected author was not found"
      : "Choose an author because more than one author is available";
    throw Object.assign(new Error(message), { statusCode: 400, workflow });
  }
  workflow.authorId = author.id;
  await updateWorkflowStep(workflow, {
    id: "strategy-context",
    label: "Strategy context",
    status: "completed",
    detail: `${categories.length} managed categories; ${tags.length} managed tags; author ${author.name}.`,
  }, reportProgress);

  await updateWorkflowStep(workflow, {
    id: "topic-ideation",
    label: "Topic ideation",
    status: "in_progress",
    detail: "Generating five strategy-aware candidates without patient data or article bodies.",
  }, reportProgress);
  const topicPlan = await buildBlogTopicPlan({
    language: payload.language,
    categories,
    tags,
    runId: generationRunId,
  });
  await updateWorkflowStep(workflow, {
    id: "topic-ideation",
    label: "Topic ideation",
    status: "completed",
    detail: `${topicPlan.summary.considered} candidate${topicPlan.summary.considered === 1 ? "" : "s"} across ${topicPlan.summary.batches} batch${topicPlan.summary.batches === 1 ? "" : "es"}.`,
  }, reportProgress);
  await updateWorkflowStep(workflow, {
    id: "deterministic-review",
    label: "Deterministic review",
    status: "completed",
    detail: "Exact topic keys, symmetric token overlap, cluster saturation, and unsafe freshness patterns checked.",
  }, reportProgress);
  await updateWorkflowStep(workflow, {
    id: "semantic-review",
    label: "Semantic review",
    status: "completed",
    detail: `${topicPlan.summary.recommended} candidate${topicPlan.summary.recommended === 1 ? "" : "s"} retained after intent review.`,
  }, reportProgress);

  const selectedCandidate = topicPlan.candidates.find(candidate => candidate.id === topicPlan.selectedCandidateId);
  workflow.selectedCandidate = selectedCandidate ? {
    id: selectedCandidate.id,
    candidateKey: selectedCandidate.candidateKey,
    topicCandidateId: selectedCandidate.topicCandidateId,
    topic: selectedCandidate.topic,
    targetKeyword: selectedCandidate.targetKeyword,
    topicKey: selectedCandidate.topicKey,
    language: selectedCandidate.language,
    categoryId: selectedCandidate.categoryId,
    categoryKey: selectedCandidate.categoryKey,
    categoryName: selectedCandidate.categoryName,
    pillar: selectedCandidate.pillar,
    patientStage: selectedCandidate.patientStage,
    contentFormat: selectedCandidate.contentFormat,
    searchIntent: selectedCandidate.searchIntent,
    tagIds: selectedCandidate.tagIds,
    internalLinks: selectedCandidate.internalLinks,
    internalLinkTargetIds: selectedCandidate.internalLinkTargetIds,
    sourceRecommendationIds: selectedCandidate.sourceRecommendationIds,
    score: selectedCandidate.score,
    overlapScore: selectedCandidate.overlapScore,
    recommendation: selectedCandidate.recommendation,
    angle: selectedCandidate.angle,
    rationale: selectedCandidate.rationale,
    strategyVersion: selectedCandidate.strategyVersion,
  } : undefined;
  if (!selectedCandidate) {
    const message = "No safe unique topic remained after two candidate batches.";
    await updateWorkflowStep(workflow, {
      id: "topic-selection",
      label: "Topic selection",
      status: "failed",
      detail: message,
    }, reportProgress);
    throw Object.assign(new Error(message), { statusCode: 409, workflow });
  }

  await updateWorkflowStep(workflow, {
    id: "topic-selection",
    label: "Topic selection",
    status: "completed",
      detail: `${selectedCandidate.topic}; ${selectedCandidate.categoryName}; ${selectedCandidate.pillar.replace(/_/g, " ")}; score ${selectedCandidate.score}.`,
  }, reportProgress);

  return workflow;
}

async function executeAutoGenerateWorkflow(
  payload: AdminBlogAutoGeneratePayload,
  reportProgress?: BlogGenerationProgressReporter,
  generationRunId?: number,
  preparedWorkflow?: BlogGenerationWorkflow,
) {
  const workflow = preparedWorkflow?.selectedCandidate
    ? preparedWorkflow
    : await prepareAutoGenerateWorkflow(payload, reportProgress, generationRunId);
  const selectedCandidate = workflow.selectedCandidate;
  if (!selectedCandidate) {
    throw Object.assign(new Error("Prepared generation run has no selected topic"), { statusCode: 409, workflow });
  }

  let result: Awaited<ReturnType<typeof createGeneratedBlogDraft>>;
  try {
    result = await createGeneratedBlogDraft({
      topic: selectedCandidate.topic,
      additionalContext: selectedCandidate.angle,
      targetKeyword: selectedCandidate.targetKeyword,
      language: selectedCandidate.language,
      authorId: workflow.authorId || payload.authorId!,
      categoryId: selectedCandidate.categoryId,
      tagIds: selectedCandidate.tagIds,
      internalLinks: selectedCandidate.internalLinks,
      internalLinkTargetIds: selectedCandidate.internalLinkTargetIds,
      sourceRecommendationIds: selectedCandidate.sourceRecommendationIds,
      topicCandidateId: selectedCandidate.topicCandidateId,
      topicKey: selectedCandidate.topicKey,
      contentPillar: selectedCandidate.pillar,
      patientStage: selectedCandidate.patientStage,
      contentFormat: selectedCandidate.contentFormat,
      searchIntent: selectedCandidate.searchIntent,
      expertiseAngle: selectedCandidate.angle,
      topicStrategyVersion: selectedCandidate.strategyVersion,
    }, workflow, reportProgress, generationRunId);
  } catch (error) {
    const workflowError = error as Error & { workflow?: BlogGenerationWorkflow };
    workflowError.workflow = workflow;
    throw workflowError;
  }

  return { result, workflow };
}

function toJsonObject(value: unknown): JsonObject {
  return JSON.parse(JSON.stringify(value)) as JsonObject;
}

export async function executePersistedAutoGenerateRun(runId: number): Promise<void> {
  const claimed = await claimBlogGenerationRun(runId);
  if (!claimed) return;
  const heartbeatTimer = setInterval(() => {
    void updateBlogGenerationRun(runId, { heartbeatAt: new Date() })
      .catch(error => console.error(`Could not heartbeat generation run ${runId}:`, error));
  }, 30_000);
  heartbeatTimer.unref();

  const reportProgress: BlogGenerationProgressReporter = async (workflow, step) => {
    const workflowJson = toJsonObject(workflow);
    const updated = await updateBlogGenerationRun(runId, { workflow: workflowJson });
    if (!updated) throw new Error("Generation run is no longer active");
    await appendBlogGenerationEvent({
      runId,
      eventType: "progress",
      payload: toJsonObject({ runId, workflow, step }),
    }).catch(eventError => console.error("Could not persist generation progress event:", eventError));
  };

  try {
    const payload = adminBlogAutoGenerateSchema.parse(claimed.input);
    const { result, workflow } = await executeAutoGenerateWorkflow(
      payload,
      reportProgress,
      runId,
      claimed.workflow as unknown as BlogGenerationWorkflow,
    );
    const response = {
      success: true,
      ...result,
      workflow,
    };
    const completed = await completeBlogGenerationRun(runId, {
      postId: result.data.id,
      workflow: toJsonObject(workflow),
      result: toJsonObject(response),
    });
    if (!completed) throw new Error("Could not complete the generation run");
    await appendBlogGenerationEvent({
      runId,
      eventType: "complete",
      payload: toJsonObject(response),
    }).catch(eventError => console.error("Could not persist generation completion event:", eventError));
  } catch (error) {
    const runError = error as Error & { statusCode?: number; code?: string; workflow?: BlogGenerationWorkflow };
    const currentRun = await getBlogGenerationRun(runId).catch(() => undefined);
    const workflow = runError.workflow
      || (currentRun?.workflow as unknown as BlogGenerationWorkflow | null)
      || (claimed.workflow as unknown as BlogGenerationWorkflow | null)
      || createAutoGenerateWorkflow();
    const runningStep = workflow.steps.find(step => step.status === "in_progress");
    if (runningStep) {
      runningStep.status = "failed";
      runningStep.detail = runError.message || "Generation failed";
    }
    const failure = {
      success: false,
      message: runError.message || "Auto generation failed",
      statusCode: runError.statusCode || 500,
      ...(runError.code ? { code: runError.code } : {}),
      postId: currentRun?.postId || null,
      partialSuccess: Boolean(currentRun?.postId),
      workflow,
    };
    await failBlogGenerationRun(runId, {
      error: failure.message,
      workflow: toJsonObject(workflow),
      result: toJsonObject(failure),
    }).catch(dbError => console.error("Could not persist failed generation run:", dbError));
    await appendBlogGenerationEvent({
      runId,
      eventType: "failed",
      payload: toJsonObject(failure),
    }).catch(dbError => console.error("Could not persist failed generation event:", dbError));
  } finally {
    clearInterval(heartbeatTimer);
  }
}

function runPostPublishCheckInBackground(path: string): void {
  if (process.env.SEO_PUBLISHING_HOOK_ENABLED === "false") return;

  void runSeoPublishingCheck(path).then(result => {
    if (!result.renderAudit.ok) {
      console.warn("Blog post SEO publish check failed:", result.renderAudit.errors);
    }
  }).catch(error => {
    console.error("Blog post SEO publish check failed:", error);
  });
}

export function registerAdminBlogRoutes(app: Express): void {
  registerBlogLinkRoutes(app);

  const recoverStaleGenerationRuns = () => {
    void markStaleBlogGenerationRunsInterrupted(new Date(Date.now() - 5 * 60 * 1000))
      .catch(error => console.error("Could not recover stale blog generation runs:", error));
  };
  recoverStaleGenerationRuns();
  const generationRecoveryTimer = setInterval(recoverStaleGenerationRuns, 60_000);
  generationRecoveryTimer.unref();

  app.get("/api/admin/blog/stats", async (_req, res) => {
    try {
      res.status(200).json({ success: true, data: await getBlogStats() });
    } catch (error) {
      sendDbError(res, error);
    }
  });

  app.get("/api/admin/blog/redirects", async (_req, res) => {
    try {
      res.status(200).json({ success: true, data: await getBlogRedirects() });
    } catch (error) {
      sendDbError(res, error);
    }
  });

  app.post("/api/admin/blog/redirects", async (req, res) => {
    try {
      const payload = normalizeRedirectPayload(req.body);
      await assertRedirectHasNoActiveChain(payload.targetPath);
      const redirect = await upsertBlogRedirect(payload);
      const linkingPosts = await findBlogPostsLinkingToPath(redirect.sourcePath);
      res.status(201).json({
        success: true,
        data: {
          redirect,
          linkImpact: {
            sourcePath: redirect.sourcePath,
            targetPath: redirect.targetPath,
            linkingPosts,
            linkingPostCount: linkingPosts.length,
          },
        },
      });
    } catch (error) {
      try {
        sendValidationError(res, error);
      } catch {
        sendDbError(res, error);
      }
    }
  });

  app.get("/api/admin/blog/internal-link-audit", async (req, res) => {
    try {
      const payload = adminBlogInternalLinkAuditSchema.parse({
        path: req.query.path,
        status: req.query.status,
      });
      const path = normalizeInternalPath(payload.path);
      const linkingPosts = await findBlogPostsLinkingToPath(path, { status: payload.status });
      res.status(200).json({
        success: true,
        data: {
          path,
          status: payload.status,
          linkingPosts,
          linkingPostCount: linkingPosts.length,
        },
      });
    } catch (error) {
      try {
        sendValidationError(res, error);
      } catch {
        sendDbError(res, error);
      }
    }
  });

  const applyRedirectLinkCleanup = async (req: Request, res: Response) => {
    const id = parseId(req);
    if (!id) return res.status(400).json({ success: false, message: "Invalid redirect id" });

    try {
      const { confirmSourcePath } = adminBlogRedirectCleanupSchema.parse(req.body);
      const redirect = await getBlogRedirectById(id);
      if (!redirect) return res.status(404).json({ success: false, message: "Blog redirect not found" });
      if (!redirect.isActive) return res.status(400).json({ success: false, message: "Cannot apply cleanup for an inactive redirect" });

      const sourcePath = normalizeInternalPath(redirect.sourcePath);
      const targetPath = normalizeInternalPath(redirect.targetPath);
      if (normalizeInternalPath(confirmSourcePath) !== sourcePath) {
        return res.status(400).json({
          success: false,
          message: "Link cleanup requires confirmation with the exact redirect source path",
        });
      }

      const impactedPosts = await findBlogPostsLinkingToPath(sourcePath);
      const snapshots = [];
      for (const impact of impactedPosts) {
        const post = await getBlogPostById(impact.id);
        if (!post?.content) continue;
        snapshots.push({
          id: post.id,
          expectedStatus: post.status,
          expectedUpdatedAt: post.updatedAt,
        });
      }
      const cleanupResults = await rewriteAndReconcileRedirectLinks(
        snapshots,
        {
          redirectSnapshot: {
            id: redirect.id,
            sourcePath,
            targetPath,
            isActive: redirect.isActive,
            updatedAt: redirect.updatedAt,
          },
          publicSiteUrl: getBlogLinkConfig().publicSiteUrl,
        },
      );
      const updatedIds = cleanupResults
        .filter(result => result.replacements > 0)
        .map(result => result.postId);
      const updatedPosts = [];
      for (const postId of updatedIds) {
        const updated = await getBlogPostById(postId);
        if (!updated) {
          throw Object.assign(
            new Error("A cleaned article disappeared before the response was built; refresh the redirect report."),
            {
              statusCode: 409,
              code: "blog_redirect_cleanup_result_changed",
            },
          );
        }
        updatedPosts.push({
          id: updated.id,
          title: updated.title,
          slug: updated.slug,
          language: updated.language,
          status: updated.status,
          path: getBlogPostPath(updated),
        });
      }

      res.status(200).json({
        success: true,
        data: {
          redirect,
          scannedPostCount: impactedPosts.length,
          updatedPostCount: updatedPosts.length,
          updatedPosts,
          linkReconciliations: cleanupResults
            .filter(result => result.reconciliation !== null)
            .map(result => result.reconciliation),
        },
      });
    } catch (error) {
      try {
        sendValidationError(res, error);
      } catch {
        sendDbError(res, error);
      }
    }
  };

  app.post("/api/admin/blog/redirects/:id/apply-link-cleanup", applyRedirectLinkCleanup);
  app.post("/api/admin/blog/redirects/:id/cleanup-links", applyRedirectLinkCleanup);

  app.get("/api/admin/blog/posts", async (req, res) => {
    try {
      const posts = await getAdminBlogPosts({
        status: req.query.status === "draft" || req.query.status === "pending_review" || req.query.status === "published" || req.query.status === "rejected"
          ? req.query.status
          : "all",
        language: normalizeLanguage(req.query.language),
        search: typeof req.query.search === "string" ? req.query.search : undefined,
        limit: typeof req.query.limit === "string" ? Number(req.query.limit) || 100 : 100,
        offset: typeof req.query.offset === "string" ? Number(req.query.offset) || 0 : 0,
      });
      res.status(200).json({ success: true, data: posts });
    } catch (error) {
      sendDbError(res, error);
    }
  });

  app.post("/api/admin/blog/topic-plan", async (req, res) => {
    let planningRunId: number | undefined;
    try {
      const payload = adminBlogTopicPlannerSchema.parse(req.body);
      assertBlogTopicGenerationConfigured();
      const rateLimit = checkBlogAiRateLimit(getClientIp(req));
      if (!rateLimit.allowed) {
        if (rateLimit.retryAfterSec) res.set("Retry-After", String(rateLimit.retryAfterSec));
        return res.status(429).json({
          success: false,
          message: "Blog AI generation rate limit reached",
        });
      }

      const [categories, tags] = await Promise.all([
        getBlogCategories(payload.language),
        getBlogTags(payload.language),
      ]);

      const openRun = await getOpenBlogGenerationRun();
      if (openRun) {
        return res.status(409).json({
          success: false,
          message: `Generation run ${openRun.id} is already ${openRun.status}. Finish or recover it before planning another topic.`,
          runId: openRun.id,
        });
      }
      const planningWorkflow = {
        mode: "topic-plan",
        generatedAt: new Date().toISOString(),
        language: payload.language,
      };
      let planningRun;
      try {
        planningRun = await createBlogGenerationRun({
          idempotencyKey: `topic-plan:${randomUUID()}`,
          input: toJsonObject({
            mode: "topic-plan",
            language: payload.language,
          }),
          workflow: toJsonObject(planningWorkflow),
        });
      } catch (error) {
        if ((error as { code?: string }).code === "23505") {
          throw Object.assign(
            new Error("Another generation or planning run started at the same time. Reopen it before trying again."),
            { statusCode: 409, code: "blog_generation_run_conflict" },
          );
        }
        throw error;
      }
      planningRunId = planningRun.id;
      const plan = await buildBlogTopicPlan({
        language: payload.language,
        categories,
        tags,
        runId: planningRun.id,
      });
      const completed = await completeBlogPlanningRun(planningRun.id, {
        workflow: toJsonObject(planningWorkflow),
        result: toJsonObject(plan),
      });
      if (!completed) {
        throw Object.assign(new Error("The durable topic plan could not be completed"), {
          statusCode: 409,
          code: "topic_plan_completion_conflict",
        });
      }

      res.status(200).json({ success: true, data: plan });
    } catch (error) {
      if (planningRunId) {
        await failBlogGenerationRun(planningRunId, {
          error: error instanceof Error ? error.message : "Topic planning failed",
          result: toJsonObject({
            success: false,
            mode: "topic-plan",
          }),
        }).catch(dbError => console.error("Could not persist failed topic planning run:", dbError));
      }
      try {
        sendValidationError(res, error);
      } catch {
        sendDbError(res, error);
      }
    }
  });

  app.post("/api/admin/blog/generation-runs", async (req, res) => {
    try {
      const payload = adminBlogAutoGenerateSchema.parse(req.body);

      const idempotencyKey = req.get("Idempotency-Key")?.trim() || "";
      if (!/^[A-Za-z0-9._:-]{8,255}$/.test(idempotencyKey)) {
        return res.status(400).json({
          success: false,
          message: "A valid Idempotency-Key header is required",
        });
      }

      const existing = await getBlogGenerationRunByIdempotencyKey(idempotencyKey);
      if (existing) {
        if (existing.status === "queued") {
          setImmediate(() => {
            void executePersistedAutoGenerateRun(existing.id).catch(error => {
              console.error(`Unhandled queued generation run failure (${existing.id}):`, error);
            });
          });
        }
        return res.status(200).json({
          success: true,
          data: {
            runId: existing.id,
            status: existing.status,
            workflow: existing.workflow || createAutoGenerateWorkflow(),
          },
        });
      }

      const openRun = await getOpenBlogGenerationRun();
      if (openRun) {
        return res.status(409).json({
          success: false,
          message: `Generation run ${openRun.id} is already ${openRun.status}. Reopen it instead of creating another draft.`,
          workflow: openRun.workflow || undefined,
          runId: openRun.id,
        });
      }

      assertBlogAiGenerationConfigured();
      assertBlogTopicGenerationConfigured();

      const rateLimit = checkBlogAiRateLimit(getClientIp(req));
      if (!rateLimit.allowed) {
        if (rateLimit.retryAfterSec) res.set("Retry-After", String(rateLimit.retryAfterSec));
        return res.status(429).json({
          success: false,
          message: "Blog AI generation rate limit reached",
        });
      }

      // Persist a safe preflight record before planning so a lost response can
      // recover by idempotency key. This payload contains no free-form topic text.
      let workflow = createAutoGenerateWorkflow();
      const persistedPayload = payload;
      let run: Awaited<ReturnType<typeof createBlogGenerationRun>>;
      try {
        run = await createBlogGenerationRun({
          idempotencyKey,
          input: toJsonObject(persistedPayload),
          workflow: toJsonObject(workflow),
        });
      } catch (error) {
        if ((error as { code?: string }).code === "23505") {
          const concurrentRun = await getOpenBlogGenerationRun();
          return res.status(409).json({
            success: false,
            message: concurrentRun
              ? `Generation run ${concurrentRun.id} is already ${concurrentRun.status}. Reopen it instead of creating another draft.`
              : "Another generation run started at the same time. Reopen it instead of creating another draft.",
            workflow: concurrentRun?.workflow || undefined,
            runId: concurrentRun?.id,
          });
        }
        throw error;
      }
      await appendBlogGenerationEvent({
        runId: run.id,
        eventType: "progress",
        payload: toJsonObject({ runId: run.id, workflow }),
      });

      const queued = await queuePreparedBlogGenerationRun(run.id, toJsonObject(workflow));
      if (!queued) throw new Error("Generation run could not be queued");
      await appendBlogGenerationEvent({
        runId: run.id,
        eventType: "progress",
        payload: toJsonObject({ runId: run.id, workflow }),
      });

      res.status(202).json({
        success: true,
        data: {
          runId: run.id,
          status: "queued",
          workflow,
        },
      });

      setImmediate(() => {
        void executePersistedAutoGenerateRun(run.id).catch(error => {
          console.error(`Unhandled blog generation run failure (${run.id}):`, error);
        });
      });
    } catch (error) {
      try {
        sendValidationError(res, error);
      } catch {
        sendDbError(res, error);
      }
    }
  });

  app.get("/api/admin/blog/generation-runs/by-key", async (req, res) => {
    const idempotencyKey = typeof req.query.key === "string" ? req.query.key.trim() : "";
    if (!/^[A-Za-z0-9._:-]{8,255}$/.test(idempotencyKey)) {
      return res.status(400).json({ success: false, message: "Invalid idempotency key" });
    }
    try {
      const run = await getBlogGenerationRunByIdempotencyKey(idempotencyKey);
      if (!run) return res.status(404).json({ success: false, message: "Generation run not found" });
      res.status(200).json({ success: true, data: run });
    } catch (error) {
      sendDbError(res, error);
    }
  });

  app.get("/api/admin/blog/generation-runs/:id", async (req, res) => {
    const runId = Number(req.params.id);
    if (!Number.isInteger(runId) || runId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid generation run id" });
    }
    try {
      const run = await getBlogGenerationRun(runId);
      if (!run) return res.status(404).json({ success: false, message: "Generation run not found" });
      res.status(200).json({ success: true, data: run });
    } catch (error) {
      sendDbError(res, error);
    }
  });

  app.get("/api/admin/blog/generation-runs/:id/events", async (req, res) => {
    const runId = Number(req.params.id);
    if (!Number.isInteger(runId) || runId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid generation run id" });
    }

    const initialRun = await getBlogGenerationRun(runId).catch(error => {
      console.error("Could not load generation run for SSE:", error);
      return undefined;
    });
    if (!initialRun) return res.status(404).json({ success: false, message: "Generation run not found" });
    if (initialRun.status === "queued") {
      setImmediate(() => {
        void executePersistedAutoGenerateRun(initialRun.id).catch(error => {
          console.error(`Unhandled resumed generation run failure (${initialRun.id}):`, error);
        });
      });
    }

    res.status(200);
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    let closed = false;
    req.on("close", () => { closed = true; });
    res.on("close", () => { closed = true; });

    const headerEventId = Number(req.get("Last-Event-ID") || 0);
    let afterId = Number.isInteger(headerEventId) && headerEventId > 0 ? headerEventId : 0;
    let lastHeartbeat = Date.now();
    let terminalSent = false;

    while (!closed && !res.writableEnded) {
      try {
        const events = await listBlogGenerationEvents(runId, { afterId });
        for (const event of events) {
          afterId = event.id;
          res.write(`id: ${event.id}\nevent: ${event.eventType}\ndata: ${JSON.stringify(event.payload)}\n\n`);
          if (event.eventType === "complete" || event.eventType === "failed" || event.eventType === "interrupted") {
            terminalSent = true;
          }
        }

        const run = await getBlogGenerationRun(runId);
        if (!run) {
          res.write(`event: failed\ndata: ${JSON.stringify({ message: "Generation run no longer exists" })}\n\n`);
          terminalSent = true;
        } else if (!terminalSent && (run.status === "completed" || run.status === "failed" || run.status === "interrupted")) {
          const eventType = run.status === "completed" ? "complete" : run.status;
          const payload = run.result || {
            success: false,
            message: run.status === "interrupted"
              ? (run.postId ? "Generation was interrupted after saving a private draft" : "Generation was interrupted before a draft was saved")
              : "Generation failed",
            workflow: run.workflow,
            postId: run.postId,
            partialSuccess: Boolean(run.postId),
          };
          res.write(`event: ${eventType}\ndata: ${JSON.stringify(payload)}\n\n`);
          terminalSent = true;
        }

        if (terminalSent) break;
        if (Date.now() - lastHeartbeat >= 15_000) {
          res.write(`: heartbeat ${Date.now()}\n\n`);
          lastHeartbeat = Date.now();
        }
      } catch (error) {
        console.error(`Generation SSE polling failed (${runId}):`, error);
        res.write(`event: failed\ndata: ${JSON.stringify({ message: "Could not read generation progress" })}\n\n`);
        terminalSent = true;
        break;
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (!res.writableEnded) res.end();
  });

  app.post("/api/admin/blog/auto-generate", (_req, res) => {
    res.status(410).json({
      success: false,
      message: "The synchronous Auto Generate endpoint was retired to prevent duplicate drafts. Start a durable generation run instead.",
      replacement: "/api/admin/blog/generation-runs",
    });
  });

  app.post("/api/admin/blog/generate-draft", async (req, res) => {
    let claimedPlanningRun: Awaited<ReturnType<typeof claimCompletedBlogPlanningRun>>;
    try {
      const requestedPayload = adminBlogGenerateDraftSchema.parse(req.body);
      let payload: AdminBlogGenerateDraftPayload = requestedPayload;
      let topicCandidateSelection: { runId: number; candidateKey: string } | undefined;
      if (requestedPayload.topicCandidateId) {
        const candidate = await getBlogTopicCandidateById(requestedPayload.topicCandidateId);
        if (!candidate) {
          throw Object.assign(new Error("The selected topic plan candidate was not found. Plan topics again."), {
            statusCode: 409,
            code: "topic_candidate_missing",
          });
        }
        if (
          candidate.recommendation !== "recommended"
          || candidate.strategyVersion !== HEALING_MINDS_TOPIC_STRATEGY_VERSION
        ) {
          throw Object.assign(new Error("The selected topic candidate is no longer eligible. Plan topics again."), {
            statusCode: 409,
            code: "topic_candidate_not_selectable",
          });
        }
        payload = {
          ...requestedPayload,
          ...buildPersistedTopicDraftOverrides(candidate),
        };
        topicCandidateSelection = { runId: candidate.runId, candidateKey: candidate.candidateKey };
      }
      if (containsLikelyPatientIdentifierInAiFields(payload)) {
        return res.status(400).json({
          success: false,
          message: "AI generation inputs must not include patient/name markers or patient-identifying information. Rephrase public topics without patient/paciente/name/nombre.",
        });
      }

      assertBlogAiGenerationConfigured();

      const rateLimit = checkBlogAiRateLimit(getClientIp(req));
      if (!rateLimit.allowed) {
        if (rateLimit.retryAfterSec) res.set("Retry-After", String(rateLimit.retryAfterSec));
        return res.status(429).json({
          success: false,
          message: "Blog AI generation rate limit reached",
        });
      }

      await assertGuidedBlogTopicSafe({
        topic: payload.topic,
        targetKeyword: payload.targetKeyword,
        additionalContext: payload.additionalContext,
        language: payload.language,
      });
      if (topicCandidateSelection) {
        const selectedCandidate = await selectBlogTopicCandidate(
          topicCandidateSelection.runId,
          topicCandidateSelection.candidateKey,
        );
        try {
          claimedPlanningRun = await claimCompletedBlogPlanningRun(selectedCandidate.runId);
        } catch (error) {
          if ((error as { code?: string }).code === "23505") {
            throw Object.assign(
              new Error("Another generation run is active. Finish or recover it before using this topic plan."),
              { statusCode: 409, code: "blog_generation_run_conflict" },
            );
          }
          throw error;
        }
        if (!claimedPlanningRun) {
          throw Object.assign(
            new Error("This topic plan was already used or is no longer available. Plan topics again."),
            { statusCode: 409, code: "topic_plan_already_used" },
          );
        }
      }
      const result = await createGeneratedBlogDraft({
        ...payload,
        topicKey: buildTopicKey(
          `${payload.topic} ${payload.targetKeyword || ""}`,
          payload.language,
        ),
        expertiseAngle: payload.additionalContext || undefined,
        topicStrategyVersion: payload.topicStrategyVersion || HEALING_MINDS_TOPIC_STRATEGY_VERSION,
      }, undefined, undefined, claimedPlanningRun?.id);
      if (claimedPlanningRun) {
        const completed = await completeBlogGenerationRun(claimedPlanningRun.id, {
          postId: result.data.id,
          result: toJsonObject({
            success: true,
            ...result,
            topicPlan: claimedPlanningRun.result,
          }),
        });
        if (!completed) {
          throw Object.assign(
            new Error("The generated draft was saved, but its planning run could not be finalized"),
            {
              statusCode: 409,
              code: "guided_generation_completion_conflict",
              postId: result.data.id,
            },
          );
        }
      }
      res.status(201).json({
        success: true,
        ...result,
      });
    } catch (error) {
      if (claimedPlanningRun) {
        await failBlogGenerationRun(claimedPlanningRun.id, {
          error: error instanceof Error ? error.message : "Guided draft generation failed",
          result: toJsonObject({
            success: false,
            topicPlan: claimedPlanningRun.result,
            postId: (error as { postId?: number }).postId || null,
          }),
        }).catch(dbError => console.error("Could not persist failed guided generation run:", dbError));
      }
      try {
        sendValidationError(res, error);
      } catch {
        sendDbError(res, error);
      }
    }
  });

  app.get("/api/admin/blog/posts/:id", async (req, res) => {
    const id = parseId(req);
    if (!id) return res.status(400).json({ success: false, message: "Invalid post id" });

    try {
      const post = await getBlogPostById(id);
      if (!post) return res.status(404).json({ success: false, message: "Blog post not found" });
      const linkReport = isBlogLinkRuntimeEnabled()
        ? await getBlogPostLinkReport(post.id)
        : undefined;
      res.status(200).json({
        success: true,
        data: post,
        checks: validatePostForPublish(post),
        verification: buildBlogVerificationReport(post),
        linkReport,
      });
    } catch (error) {
      sendDbError(res, error);
    }
  });

  app.get("/api/admin/blog/posts/:id/verify", async (req, res) => {
    const id = parseId(req);
    if (!id) return res.status(400).json({ success: false, message: "Invalid post id" });

    try {
      const post = await getBlogPostById(id);
      if (!post) return res.status(404).json({ success: false, message: "Blog post not found" });
      if (isBlogLinkRuntimeEnabled()) {
        await reconcileStoredBlogPostLinks(post.id, {
          origin: "manual",
          publicSiteUrl: getBlogLinkConfig().publicSiteUrl,
        });
      }
      const linkReport = isBlogLinkRuntimeEnabled()
        ? await getBlogPostLinkReport(post.id)
        : undefined;
      res.status(200).json({
        success: true,
        data: buildBlogVerificationReport(post),
        linkReport,
      });
    } catch (error) {
      sendDbError(res, error);
    }
  });

  app.get("/api/admin/blog/posts/:id/unpublish-impact", async (req, res) => {
    const id = parseId(req);
    if (!id) return res.status(400).json({ success: false, message: "Invalid post id" });

    try {
      const post = await getBlogPostById(id);
      if (!post) return res.status(404).json({ success: false, message: "Blog post not found" });

      const linkingPosts = post.status === "published"
        ? await findPublishedPostsLinkingToPost(post)
        : [];

      res.status(200).json({
        success: true,
        data: {
          postId: post.id,
          slug: post.slug,
          status: post.status,
          publicPath: getBlogPostPath(post),
          linkingPosts,
          linkingPostCount: linkingPosts.length,
        },
      });
    } catch (error) {
      sendDbError(res, error);
    }
  });

  app.post("/api/admin/blog/posts/:id/fix", async (req, res) => {
    const id = parseId(req);
    if (!id) return res.status(400).json({ success: false, message: "Invalid post id" });

    try {
      const { fixType } = adminBlogFixSchema.parse(req.body);
      const post = await getBlogPostById(id);
      if (!post) return res.status(404).json({ success: false, message: "Blog post not found" });

      const result = await applyDeterministicBlogFix(post, fixType);
      if (!result.success) {
        return res.status(400).json({ success: false, message: result.message, data: result });
      }
      const linkReconciliation = result.post
        ? await reconcileBlogPostLinksFailOpen(result.post.id, { origin: "server_fix" })
        : undefined;
      const linkReport = result.post
        ? await getBlogPostLinkReportFailOpen(result.post.id, "fixed draft")
        : undefined;

      res.status(200).json({
        success: true,
        data: {
          result,
          post: result.post,
          verification: result.verification,
          checks: result.post ? validatePostForPublish(result.post) : validatePostForPublish(post),
          linkReconciliation,
          linkReport,
        },
      });
    } catch (error) {
      try {
        sendValidationError(res, error);
      } catch {
        sendDbError(res, error);
      }
    }
  });

  app.post("/api/admin/blog/posts", async (req, res) => {
    try {
      const payload = normalizePostPayload(req.body);
      const post = await createBlogPost(payload);
      const linkReconciliation = await reconcileBlogPostLinksFailOpen(post.id, { origin: "manual" });
      const linkReport = await getBlogPostLinkReportFailOpen(post.id, "saved draft");
      res.status(201).json({
        success: true,
        data: post,
        checks: validatePostForPublish(post),
        verification: buildBlogVerificationReport(post),
        linkReconciliation,
        linkReport,
      });
    } catch (error) {
      try {
        sendValidationError(res, error);
      } catch {
        sendDbError(res, error);
      }
    }
  });

  app.put("/api/admin/blog/posts/:id", async (req, res) => {
    const id = parseId(req);
    if (!id) return res.status(400).json({ success: false, message: "Invalid post id" });

    try {
      const payload = normalizePostUpdatePayload(req.body);
      const existing = await getBlogPostById(id);
      if (!existing) return res.status(404).json({ success: false, message: "Blog post not found" });

      if (existing.status === "published") {
        if (
          isBlogLinkRuntimeEnabled()
          && (
            Object.prototype.hasOwnProperty.call(payload, "content")
            || Object.prototype.hasOwnProperty.call(payload, "slug")
            || Object.prototype.hasOwnProperty.call(payload, "language")
            || Object.prototype.hasOwnProperty.call(payload, "title")
          )
        ) {
          return res.status(409).json({
            success: false,
            message: "Move the published post to draft before changing content, title, slug, or language so links can be reviewed safely.",
          });
        }
        const nextSlug = typeof payload.slug === "string" ? payload.slug : existing.slug;
        const nextLanguage = payload.language === "en" || payload.language === "es" ? payload.language : existing.language;
        const nextPath = getBlogPostPath({ slug: nextSlug, language: nextLanguage });
        const activeRedirect = await getActiveBlogRedirect(nextPath);
        if (activeRedirect) {
          return res.status(400).json({
            success: false,
            message: "Cannot save a published post to a URL with an active redirect; deactivate the redirect first",
          });
        }
      }

      const post = await updateBlogPost(id, payload, {
        expectedStatus: existing.status,
        expectedUpdatedAt: existing.updatedAt,
      });
      if (!post) return res.status(404).json({ success: false, message: "Blog post not found" });
      const linkReconciliation = await reconcileBlogPostLinksFailOpen(post.id, { origin: "manual" });
      const linkReport = await getBlogPostLinkReportFailOpen(post.id, "saved draft");
      if (
        post.status === "draft"
        && (
          Object.prototype.hasOwnProperty.call(payload, "featuredImage")
          || Object.prototype.hasOwnProperty.call(payload, "featuredImageAlt")
        )
      ) {
        await ensureCuratedHeroImage(post);
      }
      res.status(200).json({
        success: true,
        data: post,
        checks: validatePostForPublish(post),
        verification: buildBlogVerificationReport(post),
        linkReconciliation,
        linkReport,
      });
    } catch (error) {
      try {
        sendValidationError(res, error);
      } catch {
        sendDbError(res, error);
      }
    }
  });

  app.patch("/api/admin/blog/posts/:id/status", async (req, res) => {
    const id = parseId(req);
    if (!id) return res.status(400).json({ success: false, message: "Invalid post id" });

    try {
      const {
        status,
        confirmUnpublish,
        confirmSlug,
        redirectTargetPath,
        confirmNoRedirect,
      } = adminBlogStatusSchema.parse(req.body);
      const existing = await getBlogPostById(id);
      if (!existing) return res.status(404).json({ success: false, message: "Blog post not found" });
      if (status === existing.status) {
        return res.status(409).json({
          success: false,
          code: "blog_post_status_transition_redundant",
          message: `The article is already ${status.replace("_", " ")}; choose a different status.`,
        });
      }
      const currentPath = getBlogPostPath(existing);
      const transitionGuard: BlogPostStatusTransitionGuard = {
        expectedStatus: existing.status,
        expectedUpdatedAt: existing.updatedAt,
      };

      if (status === "published") {
        const redirectSnapshot = await getBlogRedirectBySourcePath(currentPath);
        transitionGuard.redirectSnapshot = redirectSnapshot
          ? {
              id: redirectSnapshot.id,
              sourcePath: redirectSnapshot.sourcePath,
              targetPath: redirectSnapshot.targetPath,
              isActive: redirectSnapshot.isActive,
              updatedAt: redirectSnapshot.updatedAt,
            }
          : null;
        assertPublishReady(existing);
        if (isBlogLinkRuntimeEnabled()) {
          await reconcileStoredBlogPostLinks(existing.id, {
            origin: "manual",
            publicSiteUrl: getBlogLinkConfig().publicSiteUrl,
          });
          const readyReport = await assertBlogPostLinksPublishReady(existing.id);
          transitionGuard.linkVersions = Array.from(
            new Map(readyReport.usages.map(usage => [
              usage.link.id,
              {
                id: usage.link.id,
                updatedAt: usage.link.updatedAt,
              },
            ])).values(),
          );
          transitionGuard.sourceVersions = Array.from(
            new Map(readyReport.usages.flatMap(usage => (
              usage.link.source
                ? [[
                    usage.link.source.id,
                    {
                      id: usage.link.source.id,
                      updatedAt: usage.link.source.updatedAt,
                    },
                  ] as const]
                : []
            ))).values(),
          );
          const preparedTarget = await prepareManagedBlogPostTargetForPublish(existing.id);
          transitionGuard.managedTargetVersion = {
            id: preparedTarget.id,
            updatedAt: preparedTarget.updatedAt,
          };
        }
      }

      let redirectSourcePath: string | null = null;
      let redirectTargetPathToCreate: string | null = null;
      if (existing.status === "published" && status !== "published") {
        if (confirmUnpublish !== true || confirmSlug !== existing.slug) {
          return res.status(400).json({
            success: false,
            message: "Moving a published post out of published status requires confirmation with the exact post slug",
          });
        }
        redirectSourcePath = getBlogPostPath(existing);
        redirectTargetPathToCreate = await assertRedirectDecision(redirectSourcePath, redirectTargetPath, confirmNoRedirect);
      }

      const transitionPlan = buildBlogPostStatusTransitionPlan({
        currentStatus: existing.status,
        nextStatus: status,
        currentPath,
        redirectTargetPath: redirectTargetPathToCreate,
      });
      const transition = await updateBlogPostStatusWithImageGuard(
        id,
        status,
        status === "published" ? existing.publishedAt || new Date() : undefined,
        transitionGuard,
        {
          redirect: transitionPlan.createRedirect && redirectSourcePath && redirectTargetPathToCreate
            ? {
                sourcePath: redirectSourcePath,
                targetPath: redirectTargetPathToCreate,
                statusCode: 301,
                reason: "unpublish",
                isActive: true,
                sourcePostId: existing.id,
              }
            : null,
          deactivateRedirectPath: transitionPlan.deactivateRedirectPath,
        },
      );

      if (!transition) return res.status(404).json({ success: false, message: "Blog post not found" });
      const {
        post,
        redirect,
        deactivatedRedirect,
        managedTarget,
      } = transition;
      if (status === "published") {
        runPostPublishCheckInBackground(getBlogPostPath(post));
      }
      const linkReport = isBlogLinkRuntimeEnabled()
        ? await getBlogPostLinkReport(post.id)
        : undefined;

      res.status(200).json({
        success: true,
        data: post,
        redirect,
        deactivatedRedirect,
        checks: validatePostForPublish(post),
        verification: buildBlogVerificationReport(post),
        linkReport,
        managedTarget,
      });
    } catch (error) {
      try {
        sendValidationError(res, error);
      } catch {
        sendDbError(res, error);
      }
    }
  });

  app.post("/api/admin/blog/posts/:id/seo-check", async (req, res) => {
    const id = parseId(req);
    if (!id) return res.status(400).json({ success: false, message: "Invalid post id" });

    try {
      const post = await getBlogPostById(id);
      if (!post) return res.status(404).json({ success: false, message: "Blog post not found" });
      if (post.status !== "published") {
        return res.status(400).json({ success: false, message: "SEO check requires a published post" });
      }

      const result = await runSeoPublishingCheck(getBlogPostPath(post), {
        skipSearchConsole: req.query.google === "false",
      });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      sendDbError(res, error);
    }
  });

  app.delete("/api/admin/blog/posts/:id", async (req, res) => {
    const id = parseId(req);
    if (!id) return res.status(400).json({ success: false, message: "Invalid post id" });

    try {
      const post = await getBlogPostById(id);
      if (!post) return res.status(404).json({ success: false, message: "Blog post not found" });
      let redirectRequest: Parameters<typeof deleteBlogPostWithRedirect>[1];
      if (post.status === "published") {
        const confirmPublishedDelete = req.body?.confirmPublishedDelete === true;
        const confirmSlug = typeof req.body?.confirmSlug === "string" ? req.body.confirmSlug.trim() : "";
        const redirectTargetPath = typeof req.body?.redirectTargetPath === "string" ? req.body.redirectTargetPath : undefined;
        const confirmNoRedirect = req.body?.confirmNoRedirect === true;
        if (!confirmPublishedDelete || confirmSlug !== post.slug) {
          return res.status(400).json({
            success: false,
            message: "Published post deletion requires confirmation with the exact post slug",
          });
        }
        const sourcePath = getBlogPostPath(post);
        const targetPath = await assertRedirectDecision(sourcePath, redirectTargetPath, confirmNoRedirect);
        if (targetPath) {
          redirectRequest = {
            sourcePath,
            targetPath,
            statusCode: 301,
            reason: "delete",
            isActive: true,
            sourcePostId: null,
          };
        }
      }

      const deletion = await deleteBlogPostWithRedirect(
        id,
        redirectRequest,
        {
          expectedStatus: post.status,
          expectedUpdatedAt: post.updatedAt,
          deletePhysicalImageObjects: async objectKeys => {
            await deleteBlogImageObjectsOnly(objectKeys);
          },
        },
      );
      if (!deletion.deleted) {
        return res.status(404).json({ success: false, message: "Blog post not found" });
      }
      res.status(200).json({
        success: true,
        data: {
          deletedPostId: id,
          deletedSlug: post.slug,
          deletedStatus: post.status,
          publicPath: getBlogPostPath(post),
          redirect: deletion.redirect,
        },
      });
    } catch (error) {
      try {
        sendValidationError(res, error);
      } catch {
        sendDbError(res, error);
      }
    }
  });

  app.get("/api/admin/blog/authors", async (_req, res) => {
    try {
      res.status(200).json({ success: true, data: await getBlogAuthors() });
    } catch (error) {
      sendDbError(res, error);
    }
  });

  app.get("/api/admin/blog/categories", async (req, res) => {
    try {
      const language = req.query.language === "en" || req.query.language === "es" ? req.query.language : undefined;
      res.status(200).json({ success: true, data: await getBlogCategories(language) });
    } catch (error) {
      sendDbError(res, error);
    }
  });

  app.post("/api/admin/blog/categories", async (req, res) => {
    try {
      const payload = adminBlogCategorySchema.parse(req.body);
      res.status(201).json({ success: true, data: await createBlogCategory(payload) });
    } catch (error) {
      try {
        sendValidationError(res, error);
      } catch {
        sendDbError(res, error);
      }
    }
  });

  app.get("/api/admin/blog/tags", async (req, res) => {
    try {
      const language = req.query.language === "en" || req.query.language === "es" ? req.query.language : undefined;
      res.status(200).json({ success: true, data: await getBlogTags(language) });
    } catch (error) {
      sendDbError(res, error);
    }
  });

  app.post("/api/admin/blog/tags", async (req, res) => {
    try {
      const payload = adminBlogTagSchema.parse(req.body);
      res.status(201).json({ success: true, data: await createBlogTag(payload) });
    } catch (error) {
      try {
        sendValidationError(res, error);
      } catch {
        sendDbError(res, error);
      }
    }
  });
}
