import { z } from "zod";
import { DomUtils, parseDocument } from "htmlparser2";
import type { Element } from "domhandler";
import { getPlainTextFromHtml, sanitizeBlogContentHtml } from "../sanitize";
import { getMedicalDisclaimerHtml, hasMedicalDisclaimer, slugifyBlogValue, truncateSeoText } from "../editorial-rules";
import { normalizeBlogLinkHref } from "../links/normalization";
import type { BlogAiGeneratedDraft } from "./types";
import type { BlogLanguage } from "../storage";

type NormalizeOptions = {
  allowedExternalSourceUrls?: string[];
  allowedInternalLinks?: string[];
  minimumWordCount?: number;
  targetWordCount?: number;
  minimumH2Count?: number;
  requiredSections?: string[];
};

export function countBlogDraftWords(contentHtml: string): number {
  return getPlainTextFromHtml(contentHtml).split(/\s+/).filter(Boolean).length;
}

function isAnchor(node: unknown): node is Element {
  return Boolean(
    node
    && typeof node === "object"
    && "type" in node
    && (node as Element).type === "tag"
    && (node as Element).name.toLowerCase() === "a",
  );
}

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

function normalizeUrlForComparison(value: string): {
  kind: "internal" | "external";
  normalizedHref: string;
} | null {
  try {
    const normalized = normalizeBlogLinkHref(value);
    return {
      kind: normalized.kind,
      normalizedHref: normalized.normalizedHref,
    };
  } catch {
    return null;
  }
}

export function extractBlogDraftAnchorHrefs(contentHtml: string): string[] {
  const document = parseDocument(contentHtml, {
    decodeEntities: true,
    lowerCaseAttributeNames: true,
    lowerCaseTags: true,
  });
  const hrefs = new Set<string>();
  const anchors = DomUtils.findAll(isAnchor, document.children);
  for (const anchor of anchors) {
    const href = anchor.attribs?.href;
    if (typeof href !== "string") continue;
    try {
      hrefs.add(normalizeBlogLinkHref(href).normalizedHref);
    } catch {
      // The normalizer rejects malformed links elsewhere; omit them here.
    }
  }
  return Array.from(hrefs);
}

function extractExternalUrls(value: string): string[] {
  const urls = new Set<string>();
  const decodeHrefEntities = (href: string) => href
    .replace(/&(?:amp|#0*38|#x0*26);/gi, "&");

  Array.from(value.matchAll(/<a\b[^>]*\bhref=(["'])(.*?)\1/gi))
    .map(match => decodeHrefEntities(match[2]))
    .filter(href => /^https?:\/\//i.test(href))
    .forEach(href => urls.add(href));

  Array.from(value.matchAll(/\bhttps?:\/\/[^\s"'<>]+/gi))
    .map(match => decodeHrefEntities(match[0]).replace(/[).,;:!?]+$/g, ""))
    .forEach(url => urls.add(url));

  return Array.from(urls);
}

function assertAllowedExternalUrls(values: string[], allowedUrls: string[] | undefined): void {
  const foundUrls = values.flatMap(extractExternalUrls);
  if (foundUrls.length === 0) return;

  const allowed = new Set(
    (allowedUrls || [])
      .map(normalizeUrlForComparison)
      .filter((item): item is NonNullable<ReturnType<typeof normalizeUrlForComparison>> => (
        Boolean(item) && item?.kind === "external"
      ))
      .map(item => item.normalizedHref),
  );
  const disallowed = foundUrls
    .filter(href => {
      const normalized = normalizeUrlForComparison(href);
      if (!normalized) return true;
      if (normalized.kind === "internal") return false;
      return !allowed.has(normalized.normalizedHref);
    });

  if (disallowed.length > 0) {
    throw Object.assign(new Error("AI draft included external URLs outside the verified allowlist"), {
      statusCode: 502,
      links: disallowed,
    });
  }
}

function assertAllowedAnchorHrefs(
  contentHtml: string,
  allowedInternalLinks: string[] | undefined,
  allowedExternalUrls: string[] | undefined,
): void {
  const allowedInternal = new Set(
    (allowedInternalLinks || []).map(href => {
      const normalized = normalizeBlogLinkHref(href);
      return normalized.kind === "internal" ? normalized.normalizedHref : "";
    }).filter(Boolean),
  );
  const allowedExternal = new Set(
    (allowedExternalUrls || [])
      .map(normalizeUrlForComparison)
      .filter((item): item is NonNullable<ReturnType<typeof normalizeUrlForComparison>> => (
        Boolean(item) && item?.kind === "external"
      ))
      .map(item => item.normalizedHref),
  );
  const document = parseDocument(contentHtml, {
    decodeEntities: true,
    lowerCaseAttributeNames: true,
    lowerCaseTags: true,
  });
  const disallowedManaged = new Set<string>();
  const disallowedExternal = new Set<string>();
  const anchors = DomUtils.findAll(isAnchor, document.children);
  for (const anchor of anchors) {
    const href = anchor.attribs?.href;
    if (typeof href !== "string") continue;
    let normalized;
    try {
      normalized = normalizeBlogLinkHref(href);
    } catch {
      disallowedManaged.add(href);
      continue;
    }
    if (
      normalized.kind === "internal"
      && !allowedInternal.has(normalized.normalizedHref)
    ) {
      disallowedManaged.add(normalized.normalizedHref);
    }
    if (
      normalized.kind === "external"
      && !allowedExternal.has(normalized.normalizedHref)
    ) {
      disallowedExternal.add(normalized.normalizedHref);
    }
  }
  if (disallowedExternal.size > 0) {
    throw Object.assign(new Error("AI draft included external URLs outside the verified allowlist"), {
      statusCode: 502,
      links: Array.from(disallowedExternal),
    });
  }
  if (disallowedManaged.size > 0) {
    throw Object.assign(new Error("AI draft included anchor targets outside the managed allowlist"), {
      statusCode: 502,
      links: Array.from(disallowedManaged),
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
  assertAllowedAnchorHrefs(
    parsed.contentHtml,
    options.allowedInternalLinks,
    options.allowedExternalSourceUrls,
  );
  const contentWithDisclaimer = ensureDisclaimer(parsed.contentHtml, language);
  const contentHtml = sanitizeBlogContentHtml(contentWithDisclaimer);
  const excerpt = truncateSeoText(parsed.excerpt || getPlainTextFromHtml(contentHtml), 500);
  const metaTitle = buildMetaTitle(parsed.metaTitle || "", title);
  const metaDescription = buildMetaDescription(parsed.metaDescription || "", excerpt, contentHtml);
  const slug = slugifyBlogValue(parsed.slug || title || fallbackTopic);
  const featuredImageAlt = truncateSeoText(parsed.featuredImageAlt || `${title} | Healing Minds Psychiatry`, 255);
  const riskNotes = [...(parsed.riskNotes || [])];
  const wordCount = countBlogDraftWords(contentHtml);
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
