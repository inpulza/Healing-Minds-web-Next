import type { Express, Response } from "express";
import { z, ZodError } from "zod";
import { getBlogPostById } from "../storage";
import { assertBlogImageConfigured, isBlogImageEnabled } from "./config";
import {
  deleteBlogImageVariant,
  generateBlogImageSet,
  regenerateBlogImageVariant,
} from "./service";
import {
  ensureCuratedHeroImage,
  deselectInlineBlogPostImage,
  getBlogPostImage,
  getBlogPostImageByObjectKey,
  listBlogPostImages,
  selectBlogPostImage,
} from "./storage";
import {
  downloadBlogImage,
  isManagedBlogImageKey,
} from "./object-storage";
import { checkBlogImageRateLimit } from "./rate-limit";

const generateSchema = z.object({
  role: z.enum(["hero", "inline", "all"]).default("all"),
  maxInline: z.coerce.number().int().min(1).max(2).optional(),
});

function parsePositiveId(value: string): number | null {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function sendImageError(res: Response, error: unknown): void {
  const requestError = error as { statusCode?: number; message?: string };
  if (error instanceof ZodError) {
    res.status(400).json({ success: false, message: "Invalid blog image request" });
    return;
  }
  const statusCode = requestError.statusCode && requestError.statusCode >= 400
    ? requestError.statusCode
    : 500;
  if (statusCode >= 500) console.error("Blog image API error:", error);
  res.status(statusCode).json({
    success: false,
    message: requestError.message || "Blog image request failed",
  });
}

async function getDraftPost(postId: number) {
  const post = await getBlogPostById(postId);
  if (!post) throw Object.assign(new Error("Blog post not found"), { statusCode: 404 });
  if (post.status !== "draft") {
    throw Object.assign(new Error("Blog image changes are allowed only while the post is a draft"), {
      statusCode: 409,
    });
  }
  return post;
}

export function registerBlogImageRoutes(app: Express): void {
  app.get("/api/admin/blog/images/config", (_req, res) => {
    res.status(200).json({
      success: true,
      data: {
        enabled: isBlogImageEnabled(),
        model: process.env.BLOG_IMAGE_MODEL?.trim() || "gpt-image-2",
        storage: process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID ? "vercel-blob" : "not-configured",
      },
    });
  });

  app.get("/api/admin/blog/posts/:postId/images", async (req, res) => {
    const postId = parsePositiveId(req.params.postId);
    if (!postId) return res.status(400).json({ success: false, message: "Invalid blog post id" });
    try {
      const post = await getBlogPostById(postId);
      if (!post) return res.status(404).json({ success: false, message: "Blog post not found" });
      if (post.status === "draft") await ensureCuratedHeroImage(post);
      res.status(200).json({ success: true, data: await listBlogPostImages(postId) });
    } catch (error) {
      sendImageError(res, error);
    }
  });

  app.post("/api/admin/blog/posts/:postId/images/generate", async (req, res) => {
    const postId = parsePositiveId(req.params.postId);
    if (!postId) return res.status(400).json({ success: false, message: "Invalid blog post id" });
    try {
      assertBlogImageConfigured();
      const payload = generateSchema.parse(req.body || {});
      const post = await getDraftPost(postId);
      const rateLimit = checkBlogImageRateLimit(req.ip || "admin");
      if (!rateLimit.allowed) {
        if (rateLimit.retryAfterSec) res.set("Retry-After", String(rateLimit.retryAfterSec));
        return res.status(429).json({ success: false, message: "Blog image generation rate limit reached" });
      }
      const result = await generateBlogImageSet(post, payload);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      sendImageError(res, error);
    }
  });

  app.post("/api/admin/blog/posts/:postId/images/:imageId/regenerate", async (req, res) => {
    const postId = parsePositiveId(req.params.postId);
    const imageId = parsePositiveId(req.params.imageId);
    if (!postId || !imageId) return res.status(400).json({ success: false, message: "Invalid id" });
    try {
      assertBlogImageConfigured();
      const post = await getDraftPost(postId);
      const rateLimit = checkBlogImageRateLimit(req.ip || "admin");
      if (!rateLimit.allowed) {
        if (rateLimit.retryAfterSec) res.set("Retry-After", String(rateLimit.retryAfterSec));
        return res.status(429).json({ success: false, message: "Blog image generation rate limit reached" });
      }
      const image = await regenerateBlogImageVariant(post, imageId);
      res.status(201).json({ success: true, data: image });
    } catch (error) {
      sendImageError(res, error);
    }
  });

  app.post("/api/admin/blog/posts/:postId/images/:imageId/select", async (req, res) => {
    const postId = parsePositiveId(req.params.postId);
    const imageId = parsePositiveId(req.params.imageId);
    if (!postId || !imageId) return res.status(400).json({ success: false, message: "Invalid id" });
    try {
      await getDraftPost(postId);
      const source = await getBlogPostImage(imageId);
      if (!source || source.postId !== postId) {
        return res.status(404).json({ success: false, message: "Blog image variant not found" });
      }
      const selected = await selectBlogPostImage(postId, imageId);
      if (!selected) {
        return res.status(409).json({ success: false, message: "Only completed image variants can be selected" });
      }
      res.status(200).json({ success: true, data: selected });
    } catch (error) {
      sendImageError(res, error);
    }
  });

  app.post("/api/admin/blog/posts/:postId/images/:imageId/deselect", async (req, res) => {
    const postId = parsePositiveId(req.params.postId);
    const imageId = parsePositiveId(req.params.imageId);
    if (!postId || !imageId) return res.status(400).json({ success: false, message: "Invalid id" });
    try {
      await getDraftPost(postId);
      const deselected = await deselectInlineBlogPostImage(postId, imageId);
      if (!deselected) {
        return res.status(409).json({
          success: false,
          message: "Only a selected inline image on a draft can be removed from its slot",
        });
      }
      res.status(200).json({ success: true, data: deselected });
    } catch (error) {
      sendImageError(res, error);
    }
  });

  app.delete("/api/admin/blog/posts/:postId/images/:imageId", async (req, res) => {
    const postId = parsePositiveId(req.params.postId);
    const imageId = parsePositiveId(req.params.imageId);
    if (!postId || !imageId) return res.status(400).json({ success: false, message: "Invalid id" });
    try {
      await getDraftPost(postId);
      const image = await getBlogPostImage(imageId);
      if (!image || image.postId !== postId) {
        return res.status(404).json({ success: false, message: "Blog image variant not found" });
      }
      await deleteBlogImageVariant(postId, imageId);
      res.status(200).json({ success: true });
    } catch (error) {
      sendImageError(res, error);
    }
  });

  app.get("/public-objects/blog-images/posts/:filename", async (req, res) => {
    const objectKey = `blog-images/posts/${req.params.filename}`;
    if (!isManagedBlogImageKey(objectKey)) {
      return res.status(404).type("text/plain").send("Not found");
    }
    try {
      const image = await getBlogPostImageByObjectKey(objectKey);
      if (!image || image.generationStatus !== "completed" || image.mimeType !== "image/webp") {
        return res.status(404).type("text/plain").send("Not found");
      }
      const bytes = await downloadBlogImage(objectKey);
      res.set({
        "Content-Type": "image/webp",
        "Content-Length": String(bytes.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      });
      return res.status(200).send(bytes);
    } catch (error) {
      const statusCode = (error as { statusCode?: number }).statusCode === 404 ? 404 : 503;
      if (statusCode !== 404) console.error("Blog image read failed:", error);
      return res.status(statusCode).type("text/plain").send(statusCode === 404 ? "Not found" : "Image unavailable");
    }
  });
}
