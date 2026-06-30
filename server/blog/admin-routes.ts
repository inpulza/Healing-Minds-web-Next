import type { Express, Request, Response } from "express";
import { ZodError } from "zod";
import {
  adminBlogCategorySchema,
  adminBlogPostSchema,
  adminBlogPostUpdateSchema,
  adminBlogStatusSchema,
  adminBlogTagSchema,
  assertPublishReady,
  validatePostForPublish,
} from "./admin-validation";
import {
  createBlogCategory,
  createBlogPost,
  createBlogTag,
  deleteBlogPost,
  getAdminBlogPosts,
  getBlogAuthors,
  getBlogCategories,
  getBlogPostById,
  getBlogPostPath,
  getBlogStats,
  getBlogTags,
  updateBlogPost,
  type BlogLanguage,
} from "./storage";
import { estimateReadingTime, sanitizeBlogContentHtml } from "./sanitize";
import { runSeoPublishingCheck } from "../seo/publishing";

function sendValidationError(res: Response, error: unknown): void {
  const requestError = error as { statusCode?: number; message?: string };
  if (requestError.statusCode && requestError.statusCode >= 400 && requestError.statusCode < 500) {
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

  app.get("/api/admin/blog/posts/:id", async (req, res) => {
    const id = parseId(req);
    if (!id) return res.status(400).json({ success: false, message: "Invalid post id" });

    try {
      const post = await getBlogPostById(id);
      if (!post) return res.status(404).json({ success: false, message: "Blog post not found" });
      res.status(200).json({ success: true, data: post, checks: validatePostForPublish(post) });
    } catch (error) {
      sendDbError(res, error);
    }
  });

  app.post("/api/admin/blog/posts", async (req, res) => {
    try {
      const payload = normalizePostPayload(req.body);
      const post = await createBlogPost(payload);
      res.status(201).json({ success: true, data: post, checks: validatePostForPublish(post) });
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
      const post = await updateBlogPost(id, payload);
      if (!post) return res.status(404).json({ success: false, message: "Blog post not found" });
      res.status(200).json({ success: true, data: post, checks: validatePostForPublish(post) });
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
      const { status } = adminBlogStatusSchema.parse(req.body);
      const existing = await getBlogPostById(id);
      if (!existing) return res.status(404).json({ success: false, message: "Blog post not found" });

      if (status === "published") {
        assertPublishReady(existing);
      }

      const post = await updateBlogPost(id, {
        status,
        ...(status === "published" && !existing.publishedAt ? { publishedAt: new Date() } : {}),
      });

      if (!post) return res.status(404).json({ success: false, message: "Blog post not found" });
      if (status === "published") {
        runPostPublishCheckInBackground(getBlogPostPath(post));
      }

      res.status(200).json({ success: true, data: post, checks: validatePostForPublish(post) });
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
      if (post.status === "published") {
        return res.status(400).json({
          success: false,
          message: "Published posts must be moved to draft before deletion",
        });
      }

      await deleteBlogPost(id);
      res.status(200).json({ success: true });
    } catch (error) {
      sendDbError(res, error);
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
