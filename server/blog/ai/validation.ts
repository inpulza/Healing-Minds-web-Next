import { z } from "zod";
import { getPlainTextFromHtml, sanitizeBlogContentHtml } from "../sanitize";
import { getMedicalDisclaimerHtml, hasMedicalDisclaimer, slugifyBlogValue, truncateSeoText } from "../editorial-rules";
import type { BlogAiGeneratedDraft } from "./types";
import type { BlogLanguage } from "../storage";

type NormalizeOptions = {
  allowedExternalSourceUrls?: string[];
  minimumWordCount?: number;
  targetWordCount?: number;
  minimumH2Count?: number;
  requiredSections?: string[];
};

export const aiGeneratedDraftSchema = z.object({
  title: z.string().trim().min(5).max(255),
  slug: z.string().trim().min(3).max(255).optional(),
  excerpt: z.string().trim().min(20).max(500),
  contentHtml: z.string().trim().min(100),
  metaTitle: z.string().trim().min(10).max(120).optional(),
  metaDescription: z.string().trim().min(50).max(300).optional(),
  featuredImageAlt: z.string().trim().max(255).optional(),
  riskNotes: z.array(z.string().trim().min(1).max(300)).max(8).optional(),
});

export function stripJsonCodeFence(value: string): string {
  return value
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function buildMetaDescription(value: string, excerpt: string, contentHtml: string): string {
  const plainContent = getPlainTextFromHtml(contentHtml);
  const candidate = [value, excerpt, plainContent]
    .map(item => item.replace(/\s+/g, " ").trim())
    .find(item => item.length >= 50) || "";

  if (candidate.length >= 50) {
    return truncateSeoText(candidate, 160);
  }

  return truncateSeoText(`${excerpt} Learn what patients can expect from psychiatric care at Healing Minds Psychiatry.`, 160);
}

function buildMetaTitle(value: string, title: string): string {
  const candidate = (value || title).replace(/\s+/g, " ").trim();
  if (candidate.length >= 10) return truncateSeoText(candidate, 70);
  return truncateSeoText(`${title} | Healing Minds Psychiatry`, 70);
}

function ensureDisclaimer(contentHtml: string, language: BlogLanguage): string {
  const text = getPlainTextFromHtml(contentHtml);
  if (hasMedicalDisclaimer(text)) return contentHtml;
  return `${contentHtml}\n${getMedicalDisclaimerHtml(language)}`;
}

function normalizeUrlForComparison(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    url.hash = "";
    url.search = "";
    return `${url.origin}${url.pathname.replace(/\/$/, "")}`;
  } catch {
    return null;
  }
}

function extractExternalUrls(value: string): string[] {
  const urls = new Set<string>();

  Array.from(value.matchAll(/<a\b[^>]*\bhref=(["'])(.*?)\1/gi))
    .map(match => match[2])
    .filter(href => /^https?:\/\//i.test(href))
    .forEach(href => urls.add(href));

  Array.from(value.matchAll(/\bhttps?:\/\/[^\s"'<>]+/gi))
    .map(match => match[0].replace(/[).,;:!?]+$/g, ""))
    .forEach(url => urls.add(url));

  return Array.from(urls);
}

function assertAllowedExternalUrls(values: string[], allowedUrls: string[] | undefined): void {
  const foundUrls = values.flatMap(extractExternalUrls);
  if (foundUrls.length === 0) return;

  const allowed = new Set((allowedUrls || []).map(normalizeUrlForComparison).filter(Boolean));
  const disallowed = foundUrls
    .filter(href => {
      const normalized = normalizeUrlForComparison(href);
      return !normalized || !allowed.has(normalized);
    });

  if (disallowed.length > 0) {
    throw Object.assign(new Error("AI draft included external URLs outside the verified allowlist"), {
      statusCode: 502,
      links: disallowed,
    });
  }
}

function normalizeTextForStructure(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeAiGeneratedDraft(
  rawDraft: unknown,
  language: BlogLanguage,
  fallbackTopic: string,
  options: NormalizeOptions = {},
): BlogAiGeneratedDraft {
  const parsed = aiGeneratedDraftSchema.parse(rawDraft);
  const title = truncateSeoText(parsed.title || fallbackTopic, 255);
  const contentWithDisclaimer = ensureDisclaimer(parsed.contentHtml, language);
  const contentHtml = sanitizeBlogContentHtml(contentWithDisclaimer);
  const excerpt = truncateSeoText(parsed.excerpt || getPlainTextFromHtml(contentHtml), 500);
  const metaTitle = buildMetaTitle(parsed.metaTitle || "", title);
  const metaDescription = buildMetaDescription(parsed.metaDescription || "", excerpt, contentHtml);
  const slug = slugifyBlogValue(parsed.slug || title || fallbackTopic);
  const featuredImageAlt = truncateSeoText(parsed.featuredImageAlt || `${title} | Healing Minds Psychiatry`, 255);
  const riskNotes = [...(parsed.riskNotes || [])];
  const wordCount = getPlainTextFromHtml(contentHtml).split(/\s+/).filter(Boolean).length;
  if (options.minimumWordCount && wordCount < options.minimumWordCount) {
    riskNotes.push(`Generated draft is ${wordCount} words, below the editorial brief minimum of ${options.minimumWordCount}. Expand during human review.`);
  } else if (options.targetWordCount && wordCount < Math.round(options.targetWordCount * 0.85)) {
    riskNotes.push(`Generated draft is ${wordCount} words, below the target depth of ${options.targetWordCount}.`);
  }
  const h2Count = Array.from(contentHtml.matchAll(/<h2\b/gi)).length;
  if (options.minimumH2Count && h2Count < options.minimumH2Count) {
    riskNotes.push(`Generated draft has ${h2Count} H2 sections, below the editorial brief target of ${options.minimumH2Count}.`);
  }
  const normalizedContent = normalizeTextForStructure(getPlainTextFromHtml(contentHtml));
  const missingSections = (options.requiredSections || [])
    .filter(section => !normalizedContent.includes(normalizeTextForStructure(section)))
    .slice(0, 4);
  if (missingSections.length > 0) {
    riskNotes.push(`Generated draft may be missing or renaming expected sections: ${missingSections.join("; ")}.`);
  }
  assertAllowedExternalUrls(
    [contentHtml, excerpt, metaTitle, metaDescription, featuredImageAlt, ...riskNotes],
    options.allowedExternalSourceUrls,
  );

  if (contentHtml.length < 100 || wordCount < 120) {
    throw Object.assign(new Error("AI draft was too short to save safely"), { statusCode: 502 });
  }

  return {
    title,
    slug,
    excerpt,
    contentHtml,
    metaTitle,
    metaDescription,
    featuredImageAlt,
    riskNotes,
  };
}

export function parseGeneratedDraftJson(
  content: string,
  language: BlogLanguage,
  fallbackTopic: string,
  options: NormalizeOptions = {},
): BlogAiGeneratedDraft {
  let parsed: unknown;
  try {
    parsed = JSON.parse(stripJsonCodeFence(content));
  } catch (error) {
    const statusError = Object.assign(new Error("AI draft response was not valid JSON"), { statusCode: 502, cause: error });
    throw statusError;
  }

  return normalizeAiGeneratedDraft(parsed, language, fallbackTopic, options);
}
