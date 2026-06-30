import { z } from "zod";
import type { BlogPostStatus } from "@shared/schema";
import type { BlogPostWithRelations } from "./storage";
import { getPlainTextFromHtml } from "./sanitize";

const statusSchema = z.enum(["draft", "pending_review", "published", "rejected"]);
const languageSchema = z.enum(["en", "es"]);

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

const disclaimerPatterns = [
  /not a substitute/i,
  /emergency/i,
  /911/,
  /no sustituye/i,
  /emergencia/i,
];

export function validatePostForPublish(post: BlogPostWithRelations): PublishCheck[] {
  const text = getPlainTextFromHtml(post.content || "");
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const hasDisclaimer = disclaimerPatterns.some(pattern => pattern.test(text));

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
  const failed = checks.filter(check => !check.ok);
  if (failed.length > 0) {
    const error = new Error("Post is not ready to publish") as Error & { checks?: PublishCheck[] };
    error.checks = checks;
    throw error;
  }
}

export function isBlogPostStatus(value: unknown): value is BlogPostStatus {
  return typeof value === "string" && ["draft", "pending_review", "published", "rejected"].includes(value);
}
