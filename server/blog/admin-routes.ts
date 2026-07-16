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
  createBlogTag,
  deactivateBlogRedirect,
  deleteBlogPostWithRedirect,
  findBlogPostsLinkingToPath,
  findPublishedPostsLinkingToPost,
  getActiveBlogRedirect,
  getAdminBlogPosts,
  getAnyBlogPostBySlug,
  getBlogAuthors,
  getBlogCategories,
  getBlogPostById,
  getBlogPostBySlug,
  getBlogPostPath,
  getBlogRedirectById,
  getBlogRedirects,
  getBlogStats,
  getBlogTags,
  normalizeInternalPath,
  upsertBlogRedirect,
  updateBlogPost,
  type BlogLanguage,
} from "./storage";
import { estimateReadingTime, sanitizeBlogContentHtml } from "./sanitize";
import { assertBlogAiGenerationConfigured, generateBlogDraftWithAi } from "./ai/generator";
import { checkBlogAiRateLimit } from "./ai/rate-limit";
import { buildBlogEditorialBrief } from "./ai/editorial-brief";
import { buildBlogSemanticMemory } from "./ai/memory";
import { selectBlogResearchSources } from "./ai/research";
import { buildBlogTopicPlan, type BlogTopicPlanCandidate } from "./ai/topic-planner";
import { applyDeterministicBlogFix } from "./content-fixes";
import { getCuratedFeaturedImageAlt, selectCuratedFeaturedImage } from "./featured-images";
import { ensureBlogInternalLinks, selectBlogInternalLinks } from "./internal-links";
import { selectBlogTagIds } from "./taxonomy";
import { buildBlogVerificationReport } from "./verification";
import { runSeoPublishingCheck } from "../seo/publishing";
import { getClientIp } from "../utils/client-ip";

function sendValidationError(res: Response, error: unknown): void {
  const requestError = error as { statusCode?: number; message?: string };
  if (requestError.statusCode && requestError.statusCode >= 400 && requestError.statusCode < 600) {
    res.status(requestError.statusCode).json({
      success: false,
      message: requestError.message || "Invalid blog request",
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

function containsLikelyPatientIdentifier(value: string): boolean {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) return false;

  const datePattern = String.raw`(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{1,2}[/-]\d{1,2}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{1,2},?\s+\d{2,4})`;
  const hasEmail = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(normalized);
  const hasPhone = /\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/.test(normalized);
  const hasSsn = /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/.test(normalized);
  const hasBirthDate = new RegExp(String.raw`\b(?:dob|d\.o\.b\.|date of birth|birth date|birthday|born|fecha de nacimiento|nacimiento)\b.{0,50}\b${datePattern}\b`, "i").test(normalized);
  const hasMedicalId = /\b(?:mrn|medical record|member id|patient id|record number|chart number|insurance id|policy number|historia clinica|numero de paciente|id de paciente)\b\s*[:#-]?\s*[A-Z0-9-]{4,}\b/i.test(normalized);
  const namePattern = String.raw`[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}`;
  const hasExplicitPatientName = new RegExp(String.raw`\b(?:patient|paciente)\s+(?:name\s*)[:#-]?\s*${namePattern}\b`, "i").test(normalized)
    || new RegExp(String.raw`\b(?:patient|paciente)\s*[:#-]\s*${namePattern}\b`, "i").test(normalized);
  const hasNamedPatientContext = new RegExp(String.raw`\b(?:patient|paciente)\s+${namePattern}\b.{0,80}\b(?:dob|d\.o\.b\.|date of birth|birth date|birthday|born|diagnosed|diagnosis|medication|prescribed|symptoms|mrn|medical record|member id|patient id)\b`, "i").test(normalized);

  return hasEmail || hasPhone || hasSsn || hasBirthDate || hasMedicalId || hasExplicitPatientName || hasNamedPatientContext;
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

function parseBlogPostPath(path: string): { slug: string; language: BlogLanguage } | null {
  const normalizedPath = normalizeInternalPath(path);
  if (normalizedPath.startsWith("/es/blog/")) {
    const slug = normalizedPath.slice("/es/blog/".length);
    return slug ? { slug, language: "es" } : null;
  }
  if (normalizedPath.startsWith("/blog/")) {
    const slug = normalizedPath.slice("/blog/".length);
    return slug ? { slug, language: "en" } : null;
  }
  return null;
}

async function assertRedirectSourceIsNotPublishedPost(sourcePath: string): Promise<void> {
  const parsedPath = parseBlogPostPath(sourcePath);
  if (!parsedPath) return;
  const publishedPost = await getBlogPostBySlug(parsedPath.slug, parsedPath.language);
  if (publishedPost) {
    throw Object.assign(new Error("Redirect source is currently a published post URL; unpublish or delete the post before redirecting it"), { statusCode: 400 });
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

function replaceHrefPath(content: string, sourcePath: string, targetPath: string): string {
  const escapedSource = sourcePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const hrefPattern = new RegExp(`(href=["'])${escapedSource}(?=(?:["'?#]))`, "g");
  return content.replace(hrefPattern, `$1${targetPath}`);
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

type AdminBlogGenerateDraftPayload = z.infer<typeof adminBlogGenerateDraftSchema>;

type BlogGenerationWorkflowStep = {
  id: string;
  label: string;
  status: "completed";
  detail?: string;
};

type BlogGenerationWorkflow = {
  mode: "manual" | "auto-generate";
  generatedAt: string;
  selectedCandidate?: BlogTopicPlanCandidate;
  topicPlan?: Awaited<ReturnType<typeof buildBlogTopicPlan>>;
  steps: BlogGenerationWorkflowStep[];
};

function addWorkflowStep(
  steps: BlogGenerationWorkflowStep[] | undefined,
  step: BlogGenerationWorkflowStep,
): void {
  steps?.push(step);
}

async function createGeneratedBlogDraft(
  payload: AdminBlogGenerateDraftPayload,
  workflowSteps?: BlogGenerationWorkflowStep[],
) {
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

  addWorkflowStep(workflowSteps, {
    id: "editorial-context",
    label: "Editorial context",
    status: "completed",
    detail: `${author.name}; ${category.name}; ${requestedTags.length} requested tag${requestedTags.length === 1 ? "" : "s"}.`,
  });

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
  const selectedInternalLinks = selectBlogInternalLinks({
    language: payload.language,
    requestedLinks: payload.internalLinks,
    topic: payload.topic,
    targetKeyword: payload.targetKeyword,
    categoryName: category.name,
  });

  addWorkflowStep(workflowSteps, {
    id: "taxonomy-links",
    label: "Taxonomy and internal links",
    status: "completed",
    detail: `${selectedTags.length} tag${selectedTags.length === 1 ? "" : "s"} selected; ${selectedInternalLinks.length} internal link${selectedInternalLinks.length === 1 ? "" : "s"} selected.`,
  });

  const research = selectBlogResearchSources({
    topic: payload.topic,
    additionalContext: payload.additionalContext,
    targetKeyword: payload.targetKeyword,
    language: payload.language,
    categoryName: category.name,
    tagNames: selectedTags.map(tag => tag.name),
    internalLinks: selectedInternalLinks,
  });
  addWorkflowStep(workflowSteps, {
    id: "trusted-research",
    label: "Trusted research",
    status: "completed",
    detail: `${research.sources.length} allowlisted source${research.sources.length === 1 ? "" : "s"}; confidence ${research.confidence}.`,
  });

  const semanticMemory = await buildBlogSemanticMemory({
    topic: payload.topic,
    targetKeyword: payload.targetKeyword,
    language: payload.language,
    categoryName: category.name,
    tagNames: selectedTags.map(tag => tag.name),
  });
  addWorkflowStep(workflowSteps, {
    id: "semantic-memory",
    label: "Semantic memory",
    status: "completed",
    detail: `${semanticMemory.recommendation.replace(/_/g, " ")}; ${semanticMemory.matches.length} possible overlap match${semanticMemory.matches.length === 1 ? "" : "es"}.`,
  });

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
  addWorkflowStep(workflowSteps, {
    id: "editorial-brief",
    label: "Editorial brief",
    status: "completed",
    detail: `${editorialBrief.requiredSections.length} required section${editorialBrief.requiredSections.length === 1 ? "" : "s"}; target ${editorialBrief.targetWordCount} words.`,
  });

  const generated = await generateBlogDraftWithAi({
    topic: payload.topic,
    additionalContext: payload.additionalContext,
    targetKeyword: payload.targetKeyword,
    language: payload.language,
    categoryName: category.name,
    tagNames: selectedTags.map(tag => tag.name),
    internalLinks: selectedInternalLinks,
    researchSources: research.sources,
    semanticMemory,
    editorialBrief,
  });
  addWorkflowStep(workflowSteps, {
    id: "ai-draft",
    label: "AI draft",
    status: "completed",
    detail: generated.title,
  });

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
  addWorkflowStep(workflowSteps, {
    id: "featured-image",
    label: "Featured image",
    status: "completed",
    detail: `${featuredImage.label} selected from the curated Healing Minds image library.`,
  });
  const postPayload = normalizePostPayload({
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
  });

  const post = await createBlogPost(postPayload);
  const verification = buildBlogVerificationReport(post);
  addWorkflowStep(workflowSteps, {
    id: "sanitize-save",
    label: "Sanitize and save",
    status: "completed",
    detail: `Draft ${post.id} saved with status ${post.status}; publishedAt remains empty.`,
  });
  addWorkflowStep(workflowSteps, {
    id: "verify",
    label: "Verification",
    status: "completed",
    detail: `${verification.score}% score; ${verification.blocking.length} blocker${verification.blocking.length === 1 ? "" : "s"}.`,
  });

  return {
    data: post,
    checks: validatePostForPublish(post),
    verification,
    ai: {
      riskNotes: aiRiskNotes,
      research,
      semanticMemory,
      editorialBrief,
    },
  };
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
      await assertRedirectSourceIsNotPublishedPost(payload.sourcePath);
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
      const updatedPosts = [];
      for (const impact of impactedPosts) {
        const post = await getBlogPostById(impact.id);
        if (!post?.content) continue;
        const nextContent = replaceHrefPath(post.content, sourcePath, targetPath);
        if (nextContent === post.content) continue;
        const updated = await updateBlogPost(post.id, {
          content: sanitizeBlogContentHtml(nextContent),
        });
        if (updated) {
          updatedPosts.push({
            id: updated.id,
            title: updated.title,
            slug: updated.slug,
            language: updated.language,
            status: updated.status,
            path: getBlogPostPath(updated),
          });
        }
      }

      res.status(200).json({
        success: true,
        data: {
          redirect,
          scannedPostCount: impactedPosts.length,
          updatedPostCount: updatedPosts.length,
          updatedPosts,
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
    try {
      const payload = adminBlogTopicPlannerSchema.parse(req.body);
      if (containsLikelyPatientIdentifier(payload.focus || "")) {
        return res.status(400).json({
          success: false,
          message: "Topic planning inputs must not include patient-identifying information",
        });
      }

      const [categories, tags] = await Promise.all([
        getBlogCategories(payload.language),
        getBlogTags(payload.language),
      ]);
      if (payload.categoryId && !categories.some(category => category.id === payload.categoryId)) {
        return res.status(400).json({ success: false, message: "Selected category must match the planner language" });
      }

      const plan = await buildBlogTopicPlan({
        language: payload.language,
        categories,
        tags,
        categoryId: payload.categoryId,
        focus: payload.focus,
        limit: payload.limit,
      });

      res.status(200).json({ success: true, data: plan });
    } catch (error) {
      try {
        sendValidationError(res, error);
      } catch {
        sendDbError(res, error);
      }
    }
  });

  app.post("/api/admin/blog/auto-generate", async (req, res) => {
    try {
      const payload = adminBlogAutoGenerateSchema.parse(req.body);
      if (containsLikelyPatientIdentifier(payload.focus || "")) {
        return res.status(400).json({
          success: false,
          message: "Auto generation inputs must not include patient-identifying information",
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

      const workflowSteps: BlogGenerationWorkflowStep[] = [];
      const [authors, categories, tags] = await Promise.all([
        getBlogAuthors(),
        getBlogCategories(payload.language),
        getBlogTags(payload.language),
      ]);
      const author = authors.find(item => item.id === payload.authorId);
      if (!author) {
        return res.status(400).json({ success: false, message: "Selected author was not found" });
      }
      if (payload.categoryId && !categories.some(category => category.id === payload.categoryId)) {
        return res.status(400).json({ success: false, message: "Selected category must match the auto generation language" });
      }

      const topicPlan = await buildBlogTopicPlan({
        language: payload.language,
        categories,
        tags,
        categoryId: payload.categoryId,
        focus: payload.focus,
        limit: payload.limit,
      });
      addWorkflowStep(workflowSteps, {
        id: "topic-plan",
        label: "Topic plan",
        status: "completed",
        detail: `${topicPlan.summary.returned} candidate${topicPlan.summary.returned === 1 ? "" : "s"}; ${topicPlan.summary.recommended} recommended.`,
      });

      const selectedCandidate = topicPlan.candidates.find(candidate => candidate.recommendation === "recommended");
      const baseWorkflow: BlogGenerationWorkflow = {
        mode: "auto-generate",
        generatedAt: new Date().toISOString(),
        selectedCandidate,
        topicPlan,
        steps: workflowSteps,
      };

      if (!selectedCandidate) {
        return res.status(409).json({
          success: false,
          message: "No low-overlap topic was safe for Auto Generate. Use Plan Topics and select a manual angle.",
          workflow: baseWorkflow,
        });
      }

      addWorkflowStep(workflowSteps, {
        id: "topic-selection",
        label: "Topic selection",
        status: "completed",
        detail: `${selectedCandidate.topic}; overlap ${Math.round(selectedCandidate.overlapScore * 100)}%; score ${selectedCandidate.score}.`,
      });

      const result = await createGeneratedBlogDraft({
        topic: selectedCandidate.topic,
        additionalContext: selectedCandidate.angle,
        targetKeyword: selectedCandidate.targetKeyword,
        language: selectedCandidate.language,
        authorId: payload.authorId,
        categoryId: selectedCandidate.categoryId,
        tagIds: selectedCandidate.tagIds,
        internalLinks: selectedCandidate.internalLinks,
      }, workflowSteps);

      res.status(201).json({
        success: true,
        ...result,
        workflow: baseWorkflow,
      });
    } catch (error) {
      try {
        sendValidationError(res, error);
      } catch {
        sendDbError(res, error);
      }
    }
  });

  app.post("/api/admin/blog/generate-draft", async (req, res) => {
    try {
      const payload = adminBlogGenerateDraftSchema.parse(req.body);
      const possibleSensitiveText = [payload.topic, payload.targetKeyword, payload.additionalContext]
        .filter(Boolean)
        .join(" ");
      if (containsLikelyPatientIdentifier(possibleSensitiveText)) {
        return res.status(400).json({
          success: false,
          message: "AI generation inputs must not include patient-identifying information",
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

      const result = await createGeneratedBlogDraft(payload);
      res.status(201).json({
        success: true,
        ...result,
      });
    } catch (error) {
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
      res.status(200).json({
        success: true,
        data: post,
        checks: validatePostForPublish(post),
        verification: buildBlogVerificationReport(post),
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
      res.status(200).json({ success: true, data: buildBlogVerificationReport(post) });
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

      res.status(200).json({
        success: true,
        data: {
          result,
          post: result.post,
          verification: result.verification,
          checks: result.post ? validatePostForPublish(result.post) : validatePostForPublish(post),
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
      res.status(201).json({
        success: true,
        data: post,
        checks: validatePostForPublish(post),
        verification: buildBlogVerificationReport(post),
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

      const post = await updateBlogPost(id, payload);
      if (!post) return res.status(404).json({ success: false, message: "Blog post not found" });
      res.status(200).json({
        success: true,
        data: post,
        checks: validatePostForPublish(post),
        verification: buildBlogVerificationReport(post),
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

      if (status === "published") {
        assertPublishReady(existing);
      }

      let redirect = null;
      let deactivatedRedirect = null;
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

      const post = await updateBlogPost(id, {
        status,
        ...(status === "published" && !existing.publishedAt ? { publishedAt: new Date() } : {}),
      });

      if (!post) return res.status(404).json({ success: false, message: "Blog post not found" });
      if (redirectSourcePath && redirectTargetPathToCreate) {
        redirect = await upsertBlogRedirect({
          sourcePath: redirectSourcePath,
          targetPath: redirectTargetPathToCreate,
          statusCode: 301,
          reason: "unpublish",
          isActive: true,
          sourcePostId: existing.id,
        });
      }
      if (status === "published") {
        deactivatedRedirect = await deactivateBlogRedirect(getBlogPostPath(post));
        runPostPublishCheckInBackground(getBlogPostPath(post));
      }

      res.status(200).json({
        success: true,
        data: post,
        redirect,
        deactivatedRedirect,
        checks: validatePostForPublish(post),
        verification: buildBlogVerificationReport(post),
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

      const deletion = await deleteBlogPostWithRedirect(id, redirectRequest);
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
