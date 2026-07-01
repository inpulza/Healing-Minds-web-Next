import type { BlogLanguage } from "../storage";

export type BlogAiGenerateInput = {
  topic: string;
  additionalContext?: string;
  targetKeyword?: string;
  language: BlogLanguage;
  categoryName?: string;
  tagNames?: string[];
  internalLinks?: string[];
  researchSources?: BlogResearchSource[];
  semanticMemory?: BlogSemanticMemory;
  editorialBrief?: BlogEditorialBrief;
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

export type BlogResearchConfidence = "low" | "medium" | "high";

export type BlogResearchSource = {
  id: string;
  title: string;
  publisher: string;
  domain: string;
  url: string;
  sourceCategory: "institutional" | "clinical" | "crisis";
  summary: string;
  topics: string[];
  confidence: BlogResearchConfidence;
  accessedAt: string;
};

export type BlogResearchBrief = {
  topic: string;
  language: BlogLanguage;
  accessedAt: string;
  queries: string[];
  sources: BlogResearchSource[];
  confidence: BlogResearchConfidence;
  riskNotes: string[];
};

export type BlogSemanticMemoryMatch = {
  postId: number;
  title: string;
  slug: string;
  language: BlogLanguage;
  status: string;
  score: number;
  overlapTerms: string[];
  recommendation: "create_new" | "change_angle" | "update_existing";
};

export type BlogSemanticMemory = {
  topic: string;
  targetKeyword?: string;
  language: BlogLanguage;
  matches: BlogSemanticMemoryMatch[];
  recommendation: "create_new" | "change_angle" | "update_existing";
  riskNotes: string[];
};

export type BlogEditorialBrief = {
  targetWordCount: number;
  minimumWordCount: number;
  maximumWordCount: number;
  searchIntent: string;
  audience: string;
  requiredSections: string[];
  requiredInternalLinks: string[];
  sourceRequirement: string;
  riskNotes: string[];
};
