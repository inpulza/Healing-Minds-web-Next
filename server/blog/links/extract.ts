import { createHash } from "node:crypto";
import { Parser } from "htmlparser2";
import { sanitizeBlogContentHtml } from "../sanitize";
import {
  type BlogLinkHealthStatus,
  type BlogLinkKind,
  type BlogLinkOrigin,
  type BlogLinkReviewStatus,
} from "./config";
import {
  BlogLinkNormalizationError,
  normalizeBlogLinkHref,
  type NormalizeBlogLinkOptions,
} from "./normalization";

export type ExtractBlogLinkOptions = NormalizeBlogLinkOptions & {
  postIdentity?: string | number;
  sanitize?: (contentHtml: string) => string;
};

export type BlogLinkOccurrence = {
  rawHref: string;
  normalizedHref: string;
  kind: BlogLinkKind;
  anchorText: string;
  sectionHeading: string | null;
  rel: string | null;
  target: string | null;
  ordinal: number;
  occurrenceKey: string;
};

export type RejectedBlogLinkOccurrence = {
  rawHref: string;
  anchorText: string;
  sectionHeading: string | null;
  ordinal: number;
  reasonCode: string;
};

export type ExtractedBlogLinkDocument = {
  sanitizedHtml: string;
  contentChecksum: string;
  occurrences: BlogLinkOccurrence[];
  rejected: RejectedBlogLinkOccurrence[];
};

export type BlogLinkOccurrenceFingerprintInput = {
  postIdentity: string | number;
  normalizedHref: string;
  ordinal: number;
  anchorText: string;
  sectionHeading: string | null;
};

export type ExistingBlogLinkOccurrence = {
  occurrenceKey: string;
  removedAt?: Date | string | null;
};

export type BlogLinkReconciliationPlan = {
  create: BlogLinkOccurrence[];
  restore: BlogLinkOccurrence[];
  retain: BlogLinkOccurrence[];
  removeOccurrenceKeys: string[];
};

function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeAttributeTokens(value: string | undefined): string | null {
  if (!value) return null;
  const tokens = Array.from(new Set(
    value
      .toLowerCase()
      .split(/[\s,]+/)
      .map(token => token.trim())
      .filter(Boolean),
  )).sort();
  return tokens.length > 0 ? tokens.join(" ") : null;
}

export function createBlogPostContentChecksum(contentHtml: string): string {
  return createHash("sha256").update(contentHtml, "utf8").digest("hex");
}

export function createBlogLinkOccurrenceKey(
  input: BlogLinkOccurrenceFingerprintInput,
): string {
  return createHash("sha256")
    .update(JSON.stringify([
      String(input.postIdentity),
      input.normalizedHref,
      input.ordinal,
      collapseWhitespace(input.anchorText),
      input.sectionHeading ? collapseWhitespace(input.sectionHeading) : "",
    ]), "utf8")
    .digest("hex");
}

export function extractBlogLinkDocument(
  contentHtml: string,
  options: ExtractBlogLinkOptions = {},
): ExtractedBlogLinkDocument {
  const sanitizedHtml = (options.sanitize || sanitizeBlogContentHtml)(contentHtml);
  const occurrences: BlogLinkOccurrence[] = [];
  const rejected: RejectedBlogLinkOccurrence[] = [];
  const postIdentity = options.postIdentity ?? "unpersisted";

  let nearestHeading: string | null = null;
  let currentHeading: { tag: "h2" | "h3"; text: string[] } | null = null;
  let currentAnchor: {
    rawHref: string;
    rel?: string;
    target?: string;
    text: string[];
    ordinal: number;
    sectionHeading: string | null;
  } | null = null;
  let nextOrdinal = 0;

  const parser = new Parser(
    {
      onopentag(name, attributes) {
        if (name === "h2" || name === "h3") {
          currentHeading = { tag: name, text: [] };
        }

        if (name === "a" && attributes.href && !currentAnchor) {
          currentAnchor = {
            rawHref: attributes.href,
            rel: attributes.rel,
            target: attributes.target,
            text: [],
            ordinal: nextOrdinal,
            sectionHeading: nearestHeading,
          };
          nextOrdinal += 1;
        }
      },
      ontext(text) {
        if (currentHeading) currentHeading.text.push(text);
        if (currentAnchor) currentAnchor.text.push(text);
      },
      onclosetag(name) {
        if (currentHeading && name === currentHeading.tag) {
          const heading = collapseWhitespace(currentHeading.text.join(""));
          if (heading) nearestHeading = heading;
          currentHeading = null;
        }

        if (name !== "a" || !currentAnchor) return;
        const observed = currentAnchor;
        currentAnchor = null;

        try {
          const normalized = normalizeBlogLinkHref(observed.rawHref, options);
          const anchorText = collapseWhitespace(observed.text.join(""));
          occurrences.push({
            rawHref: observed.rawHref,
            normalizedHref: normalized.normalizedHref,
            kind: normalized.kind,
            anchorText,
            sectionHeading: observed.sectionHeading,
            rel: normalizeAttributeTokens(observed.rel),
            target: observed.target?.trim() || null,
            ordinal: observed.ordinal,
            occurrenceKey: createBlogLinkOccurrenceKey({
              postIdentity,
              normalizedHref: normalized.normalizedHref,
              ordinal: observed.ordinal,
              anchorText,
              sectionHeading: observed.sectionHeading,
            }),
          });
        } catch (error) {
          rejected.push({
            rawHref: observed.rawHref,
            anchorText: collapseWhitespace(observed.text.join("")),
            sectionHeading: observed.sectionHeading,
            ordinal: observed.ordinal,
            reasonCode: error instanceof BlogLinkNormalizationError
              ? error.code
              : "normalization_failed",
          });
        }
      },
    },
    {
      decodeEntities: true,
      lowerCaseAttributeNames: true,
      lowerCaseTags: true,
      recognizeSelfClosing: true,
    },
  );

  parser.end(sanitizedHtml);

  return {
    sanitizedHtml,
    contentChecksum: createBlogPostContentChecksum(contentHtml),
    occurrences,
    rejected,
  };
}

export function extractBlogLinkOccurrences(
  contentHtml: string,
  options: ExtractBlogLinkOptions = {},
): BlogLinkOccurrence[] {
  return extractBlogLinkDocument(contentHtml, options).occurrences;
}

export function buildBlogLinkReconciliationPlan(
  observed: readonly BlogLinkOccurrence[],
  existing: readonly ExistingBlogLinkOccurrence[],
): BlogLinkReconciliationPlan {
  const existingByKey = new Map(existing.map(item => [item.occurrenceKey, item]));
  const observedKeys = new Set<string>();
  const create: BlogLinkOccurrence[] = [];
  const restore: BlogLinkOccurrence[] = [];
  const retain: BlogLinkOccurrence[] = [];

  for (const occurrence of [...observed].sort((a, b) => a.ordinal - b.ordinal)) {
    if (observedKeys.has(occurrence.occurrenceKey)) continue;
    observedKeys.add(occurrence.occurrenceKey);
    const current = existingByKey.get(occurrence.occurrenceKey);
    if (!current) create.push(occurrence);
    else if (current.removedAt) restore.push(occurrence);
    else retain.push(occurrence);
  }

  const removeOccurrenceKeys = existing
    .filter(item => !item.removedAt && !observedKeys.has(item.occurrenceKey))
    .map(item => item.occurrenceKey)
    .sort();

  return {
    create,
    restore,
    retain,
    removeOccurrenceKeys,
  };
}

export function resolveBlogLinkUsageGenerationRunId(
  requestedGenerationRunId: number | null | undefined,
  existingGenerationRunId?: number | null,
): number | null {
  return requestedGenerationRunId === undefined
    ? existingGenerationRunId ?? null
    : requestedGenerationRunId;
}

export function getUnknownBlogLinkDefaults(
  origin: BlogLinkOrigin = "backfill",
): {
  reviewStatus: BlogLinkReviewStatus;
  generationEligible: false;
  healthStatus: BlogLinkHealthStatus;
  origin: BlogLinkOrigin;
} {
  return {
    reviewStatus: "pending",
    generationEligible: false,
    healthStatus: "unchecked",
    origin,
  };
}
