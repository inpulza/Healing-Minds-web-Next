import { z } from "zod";
import type { BlogPostStatus } from "@shared/schema";
import type { BlogPostWithRelations } from "./storage";
import { getPlainTextFromHtml } from "./sanitize";
import { hasMedicalDisclaimer } from "./editorial-rules";
import { buildBlogVerificationReport } from "./verification";
import {
  BLOG_CONTENT_FORMATS,
  BLOG_CONTENT_PILLARS,
  BLOG_PATIENT_STAGES,
  BLOG_SEARCH_INTENTS,
  HEALING_MINDS_TOPIC_STRATEGY_VERSION,
} from "./strategy/healing-minds";

const statusSchema = z.enum(["draft", "pending_review", "published", "rejected"]);
const languageSchema = z.enum(["en", "es"]);
const blogFixTypeSchema = z.enum([
  "slug",
  "metaTitle",
  "metaDescription",
  "readingTime",
  "featuredImage",
  "featuredImageAlt",
  "medicalDisclaimer",
  "tags",
  "internalLinks",
]);

export const adminBlogPostSchema = z.object({
  title: z.string().trim().min(5).max(255),
  slug: z.string().trim().min(3).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  language: languageSchema.default("en"),
  translationGroupId: z.string().uuid().optional(),
  excerpt: z.string().trim().min(20).max(500),
  content: z.string().trim().min(100),
  featuredImage: z.string().trim().max(500).optional().nullable(),
  featuredImageAlt: z.string().trim().max(255).optional().nullable(),
  authorId: z.coerce.number().int().positive(),
  categoryId: z.coerce.number().int().positive(),
  status: statusSchema.default("draft"),
  isFeatured: z.coerce.boolean().default(false),
  metaTitle: z.string().trim().min(10).max(70),
  metaDescription: z.string().trim().min(50).max(160),
  readingTime: z.coerce.number().int().positive().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  tagIds: z.array(z.coerce.number().int().positive()).default([]),
});

export const adminBlogPostUpdateSchema = adminBlogPostSchema.partial().extend({
  tagIds: z.array(z.coerce.number().int().positive()).optional(),
});

export const adminBlogStatusSchema = z.object({
  status: statusSchema,
  confirmUnpublish: z.boolean().optional(),
  confirmSlug: z.string().trim().optional(),
  redirectTargetPath: z.string().trim().max(500).optional(),
  confirmNoRedirect: z.boolean().optional(),
});

export const adminBlogRedirectSchema = z.object({
  sourcePath: z.string().trim().min(3).max(500),
  targetPath: z.string().trim().min(1).max(500),
  statusCode: z.union([z.literal(301), z.literal(302)]).default(301),
  reason: z.string().trim().max(100).optional().nullable(),
  isActive: z.coerce.boolean().default(true),
  sourcePostId: z.coerce.number().int().positive().optional().nullable(),
});

export const adminBlogInternalLinkAuditSchema = z.object({
  path: z.string().trim().min(1).max(500),
  status: z.enum(["all", "draft", "pending_review", "published", "rejected"]).default("all"),
});

export const adminBlogRedirectCleanupSchema = z.object({
  confirmSourcePath: z.string().trim().min(1).max(500),
});

export const adminBlogFixSchema = z.object({
  fixType: blogFixTypeSchema,
});

export const adminBlogGenerateDraftSchema = z.object({
  topic: z.string().trim().min(5).max(180),
  additionalContext: z.string().trim().max(2000).optional().default(""),
  targetKeyword: z.string().trim().max(120).optional(),
  language: languageSchema.default("en"),
  authorId: z.coerce.number().int().positive(),
  categoryId: z.coerce.number().int().positive(),
  tagIds: z.array(z.coerce.number().int().positive()).max(8).default([]),
  internalLinks: z.array(z.string().trim().regex(/^\/(?!\/)/).max(200)).max(5).default([]),
  translationGroupId: z.string().uuid().optional(),
  contentPillar: z.enum(BLOG_CONTENT_PILLARS).optional(),
  patientStage: z.enum(BLOG_PATIENT_STAGES).optional(),
  contentFormat: z.enum(BLOG_CONTENT_FORMATS).optional(),
  searchIntent: z.enum(BLOG_SEARCH_INTENTS).optional(),
  topicStrategyVersion: z.literal(HEALING_MINDS_TOPIC_STRATEGY_VERSION).optional(),
});

export const adminBlogTopicPlannerSchema = z.object({
  language: languageSchema.default("en"),
});

export const adminBlogAutoGenerateSchema = z.object({
  language: languageSchema.default("en"),
  authorId: z.coerce.number().int().positive().optional(),
});

export const adminBlogCategorySchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  language: languageSchema.default("en"),
  description: z.string().trim().max(500).optional().nullable(),
});

export const adminBlogTagSchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  language: languageSchema.default("en"),
});

export type PublishCheck = {
  id: string;
  label: string;
  ok: boolean;
  detail?: string;
};

export function validatePostForPublish(post: BlogPostWithRelations): PublishCheck[] {
  const text = getPlainTextFromHtml(post.content || "");
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const hasDisclaimer = hasMedicalDisclaimer(text);

  return [
    {
      id: "title",
      label: "Title",
      ok: post.title.trim().length >= 5,
    },
    {
      id: "excerpt",
      label: "Excerpt",
      ok: Boolean(post.excerpt && post.excerpt.trim().length >= 20),
    },
    {
      id: "contentLength",
      label: "Content length",
      ok: wordCount >= 250,
      detail: `${wordCount} words`,
    },
    {
      id: "metaTitle",
      label: "Meta title",
      ok: Boolean(post.metaTitle && post.metaTitle.length <= 70),
    },
    {
      id: "metaDescription",
      label: "Meta description",
      ok: Boolean(post.metaDescription && post.metaDescription.length >= 50 && post.metaDescription.length <= 160),
    },
    {
      id: "author",
      label: "Author",
      ok: Boolean(post.authorId && post.author),
    },
    {
      id: "category",
      label: "Category",
      ok: Boolean(post.categoryId && post.category),
    },
    {
      id: "tags",
      label: "Tags",
      ok: post.tags.length >= 1,
    },
    {
      id: "featuredImageAlt",
      label: "Featured image alt text",
      ok: Boolean(post.featuredImageAlt && post.featuredImageAlt.trim().length >= 10),
    },
    {
      id: "ymylDisclaimer",
      label: "Medical disclaimer",
      ok: hasDisclaimer,
      detail: hasDisclaimer ? undefined : "Include emergency/not-medical-advice language before publishing",
    },
  ];
}

export function assertPublishReady(post: BlogPostWithRelations): void {
  const checks = validatePostForPublish(post);
  const verification = buildBlogVerificationReport(post);
  const requiresReview = post.status !== "pending_review" && post.status !== "published";
  const failed = checks.filter(check => !check.ok);
  const verificationBlockers: PublishCheck[] = verification.blocking.map(check => ({
    id: check.id,
    label: check.label,
    ok: false,
    detail: check.detail || check.message,
  }));
  if (requiresReview) {
    failed.push({
      id: "humanReview",
      label: "Human review",
      ok: false,
      detail: "Move the draft to pending review before publishing.",
    });
  }
  if (failed.length > 0 || verification.blocking.length > 0) {
    const error = new Error("Post is not ready to publish") as Error & { checks?: PublishCheck[] };
    error.checks = checks.concat(verificationBlockers, requiresReview ? [{
      id: "humanReview",
      label: "Human review",
      ok: false,
      detail: "Move the draft to pending review before publishing.",
    }] : []);
    throw error;
  }
}

export function isBlogPostStatus(value: unknown): value is BlogPostStatus {
  return typeof value === "string" && ["draft", "pending_review", "published", "rejected"].includes(value);
}
