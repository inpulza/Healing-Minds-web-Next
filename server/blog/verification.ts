import type { BlogPostWithRelations } from "./storage";
import { estimateReadingTime, getPlainTextFromHtml, sanitizeBlogContentHtml } from "./sanitize";
import { hasMedicalDisclaimer } from "./editorial-rules";

export type BlogVerificationSeverity = "blocking" | "warning" | "info";

export type BlogVerificationFixType =
  | "slug"
  | "metaTitle"
  | "metaDescription"
  | "readingTime"
  | "featuredImage"
  | "featuredImageAlt"
  | "medicalDisclaimer"
  | "tags"
  | "internalLinks";

export type BlogVerificationCheck = {
  id: string;
  label: string;
  ok: boolean;
  severity: BlogVerificationSeverity;
  message: string;
  detail?: string;
  count?: number;
  required?: number;
  fixType?: BlogVerificationFixType;
};

export type BlogVerificationReport = {
  isReady: boolean;
  score: number;
  summary: string;
  checks: BlogVerificationCheck[];
  blocking: BlogVerificationCheck[];
  warnings: BlogVerificationCheck[];
  passed: BlogVerificationCheck[];
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function wordCount(contentHtml: string | null): number {
  return getPlainTextFromHtml(contentHtml || "").split(/\s+/).filter(Boolean).length;
}

function extractHrefs(contentHtml: string | null): string[] {
  return Array.from((contentHtml || "").matchAll(/<a\b[^>]*\bhref=(["'])(.*?)\1/gi))
    .map(match => match[2])
    .filter(Boolean);
}

function isInternalHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

function isExternalHref(href: string): boolean {
  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function hasUnsafeHtmlSignals(contentHtml: string | null): boolean {
  const content = contentHtml || "";
  return /<script\b/i.test(content)
    || /\son[a-z]+\s*=/i.test(content)
    || /javascript:/i.test(content)
    || sanitizeBlogContentHtml(content) !== content.trim();
}

export function buildBlogVerificationReport(post: BlogPostWithRelations): BlogVerificationReport {
  const checks: BlogVerificationCheck[] = [];
  const text = getPlainTextFromHtml(post.content || "");
  const words = wordCount(post.content);
  const hrefs = extractHrefs(post.content);
  const internalLinks = hrefs.filter(isInternalHref);
  const externalLinks = hrefs.filter(isExternalHref);
  const estimatedReadingTime = estimateReadingTime(post.content || "");
  const hasDisclaimer = hasMedicalDisclaimer(text);
  const contentHasH2 = /<h2\b/i.test(post.content || "");
  const contentHasH1 = /<h1\b/i.test(post.content || "");
  const unsafeHtml = hasUnsafeHtmlSignals(post.content);

  checks.push(
    {
      id: "title",
      label: "Title",
      ok: post.title.trim().length >= 5 && post.title.trim().length <= 255,
      severity: "blocking",
      message: "The post needs a clear title before review.",
    },
    {
      id: "slug",
      label: "Slug",
      ok: slugPattern.test(post.slug),
      severity: "blocking",
      message: "The URL slug must be lowercase, hyphenated, and stable.",
      detail: post.slug,
      fixType: "slug",
    },
    {
      id: "excerpt",
      label: "Excerpt",
      ok: Boolean(post.excerpt && post.excerpt.trim().length >= 20 && post.excerpt.trim().length <= 500),
      severity: "blocking",
      message: "The excerpt is used in the blog index and SEO previews.",
    },
    {
      id: "contentLength",
      label: "Minimum clinical content",
      ok: words >= 250,
      severity: "blocking",
      message: "The article needs enough body copy before it can be published.",
      count: words,
      required: 250,
      detail: `${words} words`,
    },
    {
      id: "contentDepth",
      label: "SEO content depth",
      ok: words >= 800,
      severity: "warning",
      message: "For competitive SEO, this should usually be expanded before final publication.",
      count: words,
      required: 800,
      detail: `${words} words`,
    },
    {
      id: "metaTitle",
      label: "Meta title",
      ok: Boolean(post.metaTitle && post.metaTitle.length >= 10 && post.metaTitle.length <= 60),
      severity: "blocking",
      message: "The meta title must exist and stay within the safe length.",
      detail: post.metaTitle ? `${post.metaTitle.length}/60 characters` : "Missing",
      fixType: "metaTitle",
    },
    {
      id: "metaDescription",
      label: "Meta description",
      ok: Boolean(post.metaDescription && post.metaDescription.length >= 50 && post.metaDescription.length <= 160),
      severity: "blocking",
      message: "The meta description must be complete and stay within the safe length.",
      detail: post.metaDescription ? `${post.metaDescription.length}/160 characters` : "Missing",
      fixType: "metaDescription",
    },
    {
      id: "author",
      label: "Clinical author",
      ok: Boolean(post.authorId && post.author),
      severity: "blocking",
      message: "YMYL articles need a real clinician/person author.",
    },
    {
      id: "category",
      label: "Category",
      ok: Boolean(post.categoryId && post.category),
      severity: "blocking",
      message: "The post needs a category for the blog index and schema.",
    },
    {
      id: "tagsMinimum",
      label: "Tag",
      ok: post.tags.length >= 1,
      severity: "blocking",
      message: "At least one tag is required before publish.",
      count: post.tags.length,
      required: 1,
      fixType: "tags",
    },
    {
      id: "tagsDepth",
      label: "Topic tags",
      ok: post.tags.length >= 2,
      severity: "warning",
      message: "Two or more tags give the admin better topic grouping for future automation.",
      count: post.tags.length,
      required: 2,
      fixType: "tags",
    },
    {
      id: "featuredImageAlt",
      label: "Featured image alt text",
      ok: Boolean(post.featuredImageAlt && post.featuredImageAlt.trim().length >= 10),
      severity: "blocking",
      message: "The featured image needs descriptive alt text before publish.",
      fixType: "featuredImageAlt",
    },
    {
      id: "featuredImage",
      label: "Featured image",
      ok: Boolean(post.featuredImage),
      severity: "warning",
      message: "The article can publish without an image, but a curated featured image improves the blog index and social preview.",
      fixType: "featuredImage",
    },
    {
      id: "medicalDisclaimer",
      label: "Medical disclaimer",
      ok: hasDisclaimer,
      severity: "blocking",
      message: "Include emergency and not-medical-advice language before publishing.",
      fixType: "medicalDisclaimer",
    },
    {
      id: "internalLinks",
      label: "Internal links",
      ok: internalLinks.length >= 1,
      severity: "warning",
      message: "Add at least one internal link to connect the article to the real site structure.",
      count: internalLinks.length,
      required: 1,
      detail: internalLinks.join(", ") || "None",
      fixType: "internalLinks",
    },
    {
      id: "externalSources",
      label: "External sources",
      ok: externalLinks.length >= 1,
      severity: "warning",
      message: "For health content, cite at least one trusted external source before final review.",
      count: externalLinks.length,
      required: 1,
      detail: externalLinks.join(", ") || "None",
    },
    {
      id: "headingStructure",
      label: "Heading structure",
      ok: contentHasH2 && !contentHasH1,
      severity: "warning",
      message: "The body should use H2/H3 sections and avoid a second H1 inside the article.",
      detail: contentHasH1 ? "Body contains an H1" : contentHasH2 ? "H2 sections present" : "No H2 sections found",
    },
    {
      id: "readingTime",
      label: "Reading time",
      ok: post.readingTime === estimatedReadingTime,
      severity: "info",
      message: "Reading time should match the saved content length.",
      detail: `${post.readingTime || 0} saved, ${estimatedReadingTime} estimated`,
      fixType: "readingTime",
    },
    {
      id: "safeHtml",
      label: "Sanitized HTML",
      ok: !unsafeHtml,
      severity: "blocking",
      message: "Content must pass the shared blog HTML sanitizer.",
    },
    {
      id: "humanReview",
      label: "Human review",
      ok: post.status === "pending_review" || post.status === "published",
      severity: "warning",
      message: "AI or draft content should be moved to human review before publication.",
      detail: `Current status: ${post.status}`,
    },
  );

  const blocking = checks.filter(check => check.severity === "blocking" && !check.ok);
  const warnings = checks.filter(check => check.severity === "warning" && !check.ok);
  const passed = checks.filter(check => check.ok);
  const score = Math.round((passed.length / checks.length) * 100);

  return {
    isReady: blocking.length === 0,
    score,
    summary: blocking.length === 0
      ? warnings.length === 0
        ? "Ready for publication."
        : `Publishable, with ${warnings.length} editorial warning${warnings.length === 1 ? "" : "s"}.`
      : `${blocking.length} blocker${blocking.length === 1 ? "" : "s"} must be fixed before publishing.`,
    checks,
    blocking,
    warnings,
    passed,
  };
}
