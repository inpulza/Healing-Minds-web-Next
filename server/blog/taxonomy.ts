import type { BlogTag } from "@shared/schema";
import { getPlainTextFromHtml } from "./sanitize";
import type { BlogLanguage, BlogPostWithRelations } from "./storage";

type SelectBlogTagIdsInput = {
  language: BlogLanguage;
  availableTags: BlogTag[];
  existingTagIds?: number[];
  topic?: string;
  targetKeyword?: string;
  title?: string;
  excerpt?: string | null;
  contentHtml?: string | null;
  categoryName?: string | null;
  maxTags?: number;
  minTags?: number;
};

const STOP_WORDS = new Set([
  "about",
  "after",
  "also",
  "and",
  "article",
  "before",
  "blog",
  "care",
  "clinic",
  "clinical",
  "for",
  "from",
  "guide",
  "health",
  "help",
  "how",
  "into",
  "mental",
  "options",
  "patient",
  "patients",
  "the",
  "this",
  "through",
  "treatment",
  "understanding",
  "what",
  "when",
  "with",
]);

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value: string): Set<string> {
  return new Set(
    normalizeText(value)
      .split(" ")
      .filter(token => token.length >= 3 && !STOP_WORDS.has(token)),
  );
}

function getTagTokens(tag: BlogTag): Set<string> {
  return tokenize(`${tag.name} ${tag.slug}`);
}

function scoreTag(tag: BlogTag, haystackText: string, haystackTokens: Set<string>): number {
  const tagTokens = getTagTokens(tag);
  if (tagTokens.size === 0) return 0;

  let score = 0;
  const normalizedName = normalizeText(tag.name);
  const normalizedSlug = normalizeText(tag.slug);

  if (normalizedName && haystackText.includes(normalizedName)) score += 8;
  if (normalizedSlug && haystackText.includes(normalizedSlug)) score += 6;

  for (const token of Array.from(tagTokens)) {
    if (haystackTokens.has(token)) score += 4;
  }

  return score;
}

function uniqueOrdered(values: number[]): number[] {
  return Array.from(new Set(values.filter(Number.isFinite)));
}

export function selectBlogTagIds(input: SelectBlogTagIdsInput): number[] {
  const {
    language,
    availableTags,
    existingTagIds = [],
    maxTags = 3,
    minTags = 2,
  } = input;
  const languageTags = availableTags.filter(tag => tag.language === language);
  if (languageTags.length === 0) return [];

  const validExisting = uniqueOrdered(existingTagIds)
    .filter(tagId => languageTags.some(tag => tag.id === tagId))
    .slice(0, maxTags);

  const haystackRaw = [
    input.topic,
    input.targetKeyword,
    input.title,
    input.excerpt,
    input.categoryName,
    getPlainTextFromHtml(input.contentHtml || ""),
  ].filter(Boolean).join(" ");
  const haystackText = normalizeText(haystackRaw);
  const haystackTokens = tokenize(haystackRaw);

  const scoredTags = languageTags
    .filter(tag => !validExisting.includes(tag.id))
    .map(tag => ({ tag, score: scoreTag(tag, haystackText, haystackTokens) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || a.tag.name.localeCompare(b.tag.name));

  const selected = [...validExisting];
  for (const { tag } of scoredTags) {
    if (selected.length >= maxTags) break;
    selected.push(tag.id);
    if (selected.length >= minTags && scoredTags.length > 1) {
      continue;
    }
  }

  return selected;
}

export function selectBlogTagIdsForPost(
  post: BlogPostWithRelations,
  availableTags: BlogTag[],
): number[] {
  return selectBlogTagIds({
    language: post.language === "es" ? "es" : "en",
    availableTags,
    existingTagIds: post.tags.map(tag => tag.id),
    title: post.title,
    excerpt: post.excerpt,
    contentHtml: post.content,
    categoryName: post.category?.name,
  });
}
