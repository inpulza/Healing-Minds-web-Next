import type { BlogLanguage, BlogPostWithRelations } from "../storage";

export type TranslationPairState = "missing" | "draft" | "pending_review" | "published";
export type TranslationRunState = "queued" | "running" | "failed" | "interrupted" | null;

export type BlogTranslationPair = {
  targetLanguage: BlogLanguage;
  state: TranslationPairState;
  sibling: Pick<BlogPostWithRelations, "id" | "title" | "slug" | "language" | "status"> | null;
  run: { id: number; status: string; error?: string } | null;
};

export type BlogTranslationDraft = {
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  metaTitle: string;
  metaDescription: string;
  featuredImageAlt: string;
  targetKeyword: string;
  expertiseAngle: string;
};
