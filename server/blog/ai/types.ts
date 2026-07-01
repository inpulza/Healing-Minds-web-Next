import type { BlogLanguage } from "../storage";

export type BlogAiGenerateInput = {
  topic: string;
  additionalContext?: string;
  targetKeyword?: string;
  language: BlogLanguage;
  categoryName?: string;
  tagNames?: string[];
  internalLinks?: string[];
};

export type BlogAiGeneratedDraft = {
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  metaTitle: string;
  metaDescription: string;
  featuredImageAlt?: string;
  riskNotes: string[];
};

export type BlogAiConfig = {
  apiKey: string;
  model: string;
  timeoutMs: number;
  maxTokens: number;
};
