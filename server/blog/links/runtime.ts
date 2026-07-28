import { and, eq, gt, inArray, or } from "drizzle-orm";
import {
  blogLinks,
  blogLinkSources,
  blogPosts,
  type BlogLink,
  type BlogLinkSource,
  type BlogPost,
} from "@shared/schema";
import { db } from "../../db";
import type {
  BlogAiGenerateInput,
  BlogResearchBrief,
  BlogResearchConfidence,
  BlogResearchSource,
} from "../ai/types";
import {
  getCuratedBlogResearchSourceIds,
  selectBlogResearchSources,
} from "../ai/research";
import {
  selectBlogInternalLinks,
} from "../internal-links";
import type { BlogLanguage } from "../storage";
import {
  BLOG_LINK_INTENT_ALIASES,
  BLOG_LINK_SOURCE_TOPIC_ALIASES,
  getBlogLinkConfig,
  isBlogLinkPageReviewCurrent,
  isBlogLinkSourceReviewCurrent,
} from "./config";
import { normalizeBlogLinkSearchText } from "./normalization";
import {
  evaluateBlogLinkGenerationEligibility,
  isLiveManagedBlogPostTarget,
} from "./policy";
import {
  countBlogLinkTopicMatches,
  isBlogLinkTopicallyCompatible,
} from "./selection";

type EligibleLinkRow = {
  link: BlogLink;
  source: BlogLinkSource | null;
  targetPost: BlogPost | null;
};

export type RuntimeInternalLinkSelection = {
  hrefs: string[];
  targetIds: string[];
  warnings: string[];
};

export function isBlogLinkRuntimeEnabled(): boolean {
  return getBlogLinkConfig().enabled;
}

function inputHaystack(input: {
  topic?: string;
  targetKeyword?: string;
  additionalContext?: string;
  categoryName?: string;
  tagNames?: string[];
}): string {
  return normalizeBlogLinkSearchText([
    input.topic,
    input.targetKeyword,
    input.additionalContext,
    input.categoryName,
    ...(input.tagNames || []),
  ].filter(Boolean).join(" "));
}

function matchesAliases(haystack: string, aliases: readonly string[]): boolean {
  return aliases.some(alias => {
    const normalized = normalizeBlogLinkSearchText(alias);
    return normalized.length > 0 && ` ${haystack} `.includes(` ${normalized} `);
  });
}

function isCrisisContext(haystack: string): boolean {
  return matchesAliases(haystack, [
    ...BLOG_LINK_INTENT_ALIASES.crisis.en,
    ...BLOG_LINK_INTENT_ALIASES.crisis.es,
  ]);
}

function mapSourceCategory(
  link: BlogLink,
  source: BlogLinkSource | null,
): BlogResearchSource["sourceCategory"] {
  if (source?.sourceType === "crisis" || link.sourceCategory === "crisis") return "crisis";
  if (
    link.sourceCategory === "clinical"
    || source?.sourceType === "professional_guideline"
    || source?.sourceType === "academic"
    || source?.sourceType === "health_system"
  ) {
    return "clinical";
  }
  return "institutional";
}

async function loadEligibleLinks(
  kind: "internal" | "external",
  language: BlogLanguage,
): Promise<EligibleLinkRow[]> {
  const rows = await db
    .select({
      link: blogLinks,
      source: blogLinkSources,
      targetPost: blogPosts,
    })
    .from(blogLinks)
    .leftJoin(blogLinkSources, eq(blogLinks.sourceId, blogLinkSources.id))
    .leftJoin(blogPosts, eq(blogLinks.targetPostId, blogPosts.id))
    .where(and(
      eq(blogLinks.kind, kind),
      eq(blogLinks.reviewStatus, "approved"),
      eq(blogLinks.generationEligible, true),
      eq(blogLinks.healthStatus, "healthy"),
      gt(blogLinks.nextCheckAt, new Date()),
      or(
        eq(blogLinks.language, language),
        eq(blogLinks.language, "all"),
      ),
    ));
  return rows.filter(row => (
    kind !== "internal"
    || isLiveManagedBlogPostTarget(row.link, row.targetPost)
  ));
}

function scoreEligibleLink(
  row: EligibleLinkRow,
  haystack: string,
  preferredIds: ReadonlySet<string>,
): { score: number; termMatches: number } {
  const stableKey = row.link.stableKey || "";
  const aliases = stableKey && stableKey in BLOG_LINK_SOURCE_TOPIC_ALIASES
    ? BLOG_LINK_SOURCE_TOPIC_ALIASES[stableKey as keyof typeof BLOG_LINK_SOURCE_TOPIC_ALIASES]
    : null;
  const terms = [
    row.link.title,
    row.link.label,
    row.link.summary || "",
    row.link.evidenceScope || "",
    row.link.sourceCategory || "",
    ...row.link.topicTags,
    ...row.link.categoryKeys,
    ...row.link.contentPillars,
    ...row.link.keywords,
    ...(aliases ? [...aliases.en, ...aliases.es] : []),
  ];
  const termMatches = countBlogLinkTopicMatches(haystack, terms);
  return {
    score: (
      (preferredIds.has(stableKey) ? 100 : 0)
      + termMatches * 12
      + Math.round((row.source?.qualityScore || 0) / 10)
      + Math.round(row.link.evidenceScore / 10)
    ),
    termMatches,
  };
}

function sourceSupportsRuntimeLanguage(
  source: BlogLinkSource,
  language: BlogLanguage,
): boolean {
  return source.languages.includes(language);
}

function passesContextualExternalPolicy(
  row: EligibleLinkRow,
  language: BlogLanguage,
  contextText: string,
): boolean {
  if (!row.source) return false;
  return evaluateBlogLinkGenerationEligibility({
    stableKey: row.link.stableKey || `link-${row.link.id}`,
    normalizedHref: row.link.normalizedHref,
    kind: row.link.kind,
    language: row.link.language === "es"
      ? "es"
      : row.link.language === "en"
        ? "en"
        : "all",
    reviewStatus: row.link.reviewStatus,
    healthStatus: row.link.healthStatus,
    generationEligible: row.link.generationEligible,
    sourceQualityScore: row.source.qualityScore,
    citationFitScore: row.link.evidenceScore,
    humanReviewed: Boolean(row.link.reviewedAt && row.source.reviewedAt),
    exactHrefMatched: true,
    crossDomainRedirect: false,
  }, {
    language,
    text: contextText,
    claimClass: [row.link.sourceCategory, row.link.evidenceType].filter(Boolean).join(" "),
  }).eligible;
}

function confidenceForSelection(
  selectedCount: number,
  bestTopicalScore: number,
): BlogResearchConfidence {
  if (selectedCount >= 2 && bestTopicalScore >= 24) return "high";
  if (selectedCount >= 1) return "medium";
  return "low";
}

function emptyManagedResearchBrief(
  input: BlogAiGenerateInput,
  message: string,
): BlogResearchBrief {
  const accessedAt = new Date().toISOString().slice(0, 10);
  return {
    topic: input.topic,
    language: input.language,
    accessedAt,
    queries: [],
    sources: [],
    confidence: "low",
    riskNotes: [
      message,
      "Keep claims broad and conservative. Do not invent studies, facts, or URLs.",
    ],
  };
}

export async function getRuntimeBlogResearchSourceIds(): Promise<string[]> {
  if (!isBlogLinkRuntimeEnabled()) return getCuratedBlogResearchSourceIds();
  try {
    const rows = await loadEligibleLinks("external", "en");
    const spanishRows = await loadEligibleLinks("external", "es");
    return Array.from(new Set(
      [...rows, ...spanishRows]
        .filter(row => (
          row.source?.reviewStatus === "approved"
          && isBlogLinkSourceReviewCurrent(row.source)
          && isBlogLinkPageReviewCurrent(row.link)
          && sourceSupportsRuntimeLanguage(
            row.source,
            row.link.language === "es" ? "es" : "en",
          )
        ))
        .map(row => row.link.stableKey)
        .filter((value): value is string => Boolean(value)),
    )).sort();
  } catch (error) {
    console.error("Managed blog research source IDs could not be loaded:", error);
    return [];
  }
}

export async function selectRuntimeBlogResearchSources(
  input: BlogAiGenerateInput,
  preferredSourceIds: string[] = [],
): Promise<BlogResearchBrief> {
  if (!isBlogLinkRuntimeEnabled()) return selectBlogResearchSources(input);

  try {
    const rows = await loadEligibleLinks("external", input.language);
    const haystack = inputHaystack(input);
    const crisisContext = isCrisisContext(haystack);
    const preferred = new Set(preferredSourceIds);
    const scored = rows
      .filter(row => {
        if (row.source?.reviewStatus !== "approved") return false;
        if (!row.source || !isBlogLinkSourceReviewCurrent(row.source)) return false;
        if (!isBlogLinkPageReviewCurrent(row.link)) return false;
        if (!sourceSupportsRuntimeLanguage(row.source, input.language)) return false;
        if (!passesContextualExternalPolicy(row, input.language, haystack)) return false;
        if (
          (row.source.sourceType === "crisis" || row.link.sourceCategory === "crisis")
          && !crisisContext
        ) {
          return false;
        }
        return true;
      })
      .map(row => {
        const scored = scoreEligibleLink(row, haystack, preferred);
        return { row, ...scored };
      })
      .filter(item => isBlogLinkTopicallyCompatible(item.termMatches))
      .sort((a, b) => (
        b.score - a.score
        || (a.row.link.stableKey || a.row.link.normalizedHref)
          .localeCompare(b.row.link.stableKey || b.row.link.normalizedHref)
      ));

    const accessedAt = new Date().toISOString().slice(0, 10);
    const selected = scored.slice(0, 3);
    const selectedSourceIds = new Set(
      selected.map(({ row }) => row.link.stableKey || `link-${row.link.id}`),
    );
    const omittedPreferredSourceIds = Array.from(preferred)
      .filter(sourceId => !selectedSourceIds.has(sourceId));
    if (selected.length === 0) {
      const empty = emptyManagedResearchBrief(
        input,
        "No approved topic-specific medical source matched the managed library.",
      );
      if (omittedPreferredSourceIds.length > 0) {
        empty.riskNotes.push(
          `Planned source targets were no longer eligible or topically compatible and were omitted: ${omittedPreferredSourceIds.join(", ")}.`,
        );
      }
      return empty;
    }

    const sources: BlogResearchSource[] = selected.map(({ row, score }) => ({
      id: row.link.stableKey || `link-${row.link.id}`,
      title: row.link.title,
      publisher: row.source?.name || row.link.host || "Managed source",
      domain: row.link.host || row.source?.canonicalDomain || "",
      url: row.link.normalizedHref,
      sourceCategory: mapSourceCategory(row.link, row.source),
      summary: row.link.summary || row.link.evidenceScope || "Approved managed source.",
      topics: row.link.topicTags,
      confidence: score >= 30 ? "high" : "medium",
      accessedAt,
    }));
    const confidence = confidenceForSelection(selected.length, selected[0]?.score || 0);

    return {
      topic: input.topic,
      language: input.language,
      accessedAt,
      queries: [],
      sources,
      confidence,
      riskNotes: [
        "Use only these exact approved URLs and only for claims they directly support.",
        "This remains an educational draft that requires human clinical review.",
        ...(omittedPreferredSourceIds.length > 0
          ? [`Planned source targets were no longer eligible or topically compatible and were omitted: ${omittedPreferredSourceIds.join(", ")}.`]
          : []),
      ],
    };
  } catch (error) {
    console.error("Managed blog research selection failed:", error);
    return emptyManagedResearchBrief(
      input,
      "The managed source library was temporarily unavailable; draft generation may continue without external claims.",
    );
  }
}

export async function selectRuntimeBlogInternalLinks(input: {
  language: BlogLanguage;
  requestedLinks?: string[];
  requestedTargetIds?: string[];
  topic?: string;
  targetKeyword?: string;
  title?: string;
  excerpt?: string | null;
  contentHtml?: string | null;
  categoryName?: string | null;
  maxLinks?: number;
}): Promise<RuntimeInternalLinkSelection> {
  if (!isBlogLinkRuntimeEnabled()) {
    const hrefs = selectBlogInternalLinks(input);
    return { hrefs, targetIds: [], warnings: [] };
  }

  try {
    const rows = await loadEligibleLinks("internal", input.language);
    const haystack = inputHaystack({
      topic: input.topic,
      targetKeyword: input.targetKeyword,
      additionalContext: [input.excerpt, input.contentHtml].filter(Boolean).join(" "),
      categoryName: input.categoryName || undefined,
    });
    const requested = new Set(input.requestedLinks || []);
    const requestedTargetIds = new Set(input.requestedTargetIds || []);
    const maxLinks = Math.max(1, Math.min(input.maxLinks || 3, 5));
    const eligibleTargetIds = new Set(rows.map(row => (
      row.link.stableKey || `link-${row.link.id}`
    )));
    const candidateRows = requestedTargetIds.size > 0
      ? rows.filter(row => requestedTargetIds.has(
        row.link.stableKey || `link-${row.link.id}`,
      ))
      : rows;
    const ranked = candidateRows
      .map(row => {
        const targetId = row.link.stableKey || `link-${row.link.id}`;
        const terms = [
          row.link.title,
          row.link.label,
          row.link.summary || "",
          ...row.link.topicTags,
          ...row.link.categoryKeys,
          ...row.link.contentPillars,
          ...row.link.keywords,
        ];
        const termMatches = countBlogLinkTopicMatches(haystack, terms);
        return {
          row,
          termMatches,
          score: (
            requestedTargetIds.has(targetId)
              ? 200
              : requested.has(row.link.normalizedHref)
                ? 100
                : 0
          ) + termMatches * 10,
        };
      })
      .filter(item => (
        item.score > 0
        && isBlogLinkTopicallyCompatible(item.termMatches)
      ))
      .sort((a, b) => (
        b.score - a.score
        || (a.row.link.stableKey || a.row.link.normalizedHref)
          .localeCompare(b.row.link.stableKey || b.row.link.normalizedHref)
      ))
      .slice(0, maxLinks);
    const selectedTargetIds = new Set(ranked.map(item => (
      item.row.link.stableKey || `link-${item.row.link.id}`
    )));
    const omittedTargetIds = Array.from(requestedTargetIds)
      .filter(targetId => (
        !eligibleTargetIds.has(targetId)
        || !selectedTargetIds.has(targetId)
      ));

    return {
      hrefs: ranked.map(item => item.row.link.normalizedHref),
      targetIds: ranked.map(item => item.row.link.stableKey || `link-${item.row.link.id}`),
      warnings: omittedTargetIds.length > 0
        ? [`Planned internal targets were no longer eligible or topically compatible and were omitted: ${omittedTargetIds.join(", ")}.`]
        : [],
    };
  } catch (error) {
    console.error("Managed internal-link selection failed:", error);
    return {
      hrefs: [],
      targetIds: [],
      warnings: [
        "The managed internal-link library was temporarily unavailable; the private draft continued without inserting internal links.",
      ],
    };
  }
}
