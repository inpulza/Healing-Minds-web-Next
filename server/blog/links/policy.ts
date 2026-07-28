import {
  BLOG_LINK_CRISIS_SOURCE_STABLE_KEYS,
  BLOG_LINK_INTENT_ALIASES,
  BLOG_LINK_POLICY_VERSION,
  BLOG_LINK_SCORE_THRESHOLDS,
  BLOG_LINK_SOURCE_STABLE_KEYS,
  BLOG_LINK_SOURCE_TOPIC_ALIASES,
  type BlogLinkHealthStatus,
  type BlogLinkKind,
  type BlogLinkLanguage,
  type BlogLinkReviewStatus,
  type BlogLinkSourceStableKey,
} from "./config";
import {
  normalizeBlogLinkHref,
  normalizeBlogLinkSearchText,
  type NormalizeBlogLinkOptions,
} from "./normalization";

export type BlogLinkIntent = {
  crisis: boolean;
  medication: boolean;
  treatment: boolean;
  safety: boolean;
  matchedAliases: string[];
};

export type BlogLinkPolicyContext = {
  language: Exclude<BlogLinkLanguage, "all">;
  text?: string;
  claimClass?: string | null;
};

export type BlogLinkGenerationCandidate = {
  stableKey: string;
  normalizedHref: string;
  kind: BlogLinkKind;
  language: BlogLinkLanguage;
  reviewStatus: BlogLinkReviewStatus;
  healthStatus: BlogLinkHealthStatus;
  generationEligible: boolean;
  sourceQualityScore?: number | null;
  citationFitScore?: number | null;
  humanReviewed?: boolean;
  exactHrefMatched?: boolean;
  crossDomainRedirect?: boolean;
};

export type ManagedBlogPostTargetCandidate = {
  kind: BlogLinkKind;
  stableKey?: string | null;
  sourceCategory?: string | null;
  normalizedHref: string;
  targetPostId?: number | null;
};

export type ManagedBlogPostTargetState = {
  id: number;
  status: string;
  slug: string;
  language: string;
};

export function isManagedBlogPostTarget(
  link: ManagedBlogPostTargetCandidate,
): boolean {
  return (
    link.kind === "internal"
    && (
      link.targetPostId !== null && link.targetPostId !== undefined
      || link.sourceCategory === "first_party_blog_post"
      || Boolean(link.stableKey?.startsWith("blog-post-"))
      || /^\/(?:es\/)?blog\/[^/?#]+$/.test(link.normalizedHref)
    )
  );
}

export function isLiveManagedBlogPostTarget(
  link: ManagedBlogPostTargetCandidate,
  targetPost: ManagedBlogPostTargetState | null | undefined,
): boolean {
  if (!isManagedBlogPostTarget(link)) return true;
  if (!targetPost || targetPost.status !== "published") return false;
  const expectedHref = targetPost.language === "es"
    ? `/es/blog/${targetPost.slug}`
    : `/blog/${targetPost.slug}`;
  return (
    link.targetPostId === targetPost.id
    && link.normalizedHref === expectedHref
  );
}

export type BlogLinkEligibilityDecision = {
  policyVersion: typeof BLOG_LINK_POLICY_VERSION;
  eligible: boolean;
  critical: boolean;
  reasons: string[];
  thresholds: {
    sourceQuality: number | null;
    citationFit: number | null;
  };
};

export type ResolvedStableLinkSelection<T extends BlogLinkGenerationCandidate> = {
  selected: T[];
  rejected: Array<{
    stableKey: string;
    reasons: string[];
  }>;
};

export type BlogLinkHealthObservation = {
  httpStatus?: number | null;
  errorCategory?: string | null;
  redirectCount?: number;
  crossDomainRedirect?: boolean;
  previousConsecutiveFailures?: number;
  confirmationAttempt?: boolean;
};

export type BlogLinkHealthClassification = {
  healthStatus: BlogLinkHealthStatus;
  consecutiveFailures: number;
  requiresHumanReview: boolean;
  confirmedBroken: boolean;
};

export type SafeBlogLinkAuditInput = {
  idempotencyKey?: string;
  linkIds?: number[];
  filters?: {
    kind?: BlogLinkKind;
    reviewStatus?: BlogLinkReviewStatus;
    healthStatus?: BlogLinkHealthStatus;
    generationEligible?: boolean;
  };
};

const SAFE_AUDIT_TOP_LEVEL_KEYS = new Set(["idempotencyKey", "linkIds", "filters"]);
const SAFE_AUDIT_FILTER_KEYS = new Set([
  "kind",
  "reviewStatus",
  "healthStatus",
  "generationEligible",
]);
const URL_LIKE_FIELD = /(?:^|_)(?:url|href|host|hostname|origin)(?:$|_)/i;

export function canonicalizeBlogLinkAuditIds(linkIds: readonly number[]): number[] {
  return Array.from(new Set(linkIds)).sort((left, right) => left - right);
}

export function assertBlogLinkAuditIdempotencyMatch(
  storedInput: Record<string, unknown>,
  requestedLinkIds: readonly number[],
): number[] {
  const storedValues = storedInput.linkIds;
  const storedLinkIds = Array.isArray(storedValues)
    && storedValues.every(value => Number.isInteger(value) && Number(value) > 0)
    ? canonicalizeBlogLinkAuditIds(storedValues as number[])
    : null;
  const canonicalRequested = canonicalizeBlogLinkAuditIds(requestedLinkIds);
  if (
    !storedLinkIds
    || storedLinkIds.length !== canonicalRequested.length
    || storedLinkIds.some((linkId, index) => linkId !== canonicalRequested[index])
  ) {
    throw Object.assign(
      new Error("Idempotency key was already used for a different set of blog links"),
      {
        statusCode: 409,
        code: "blog_link_audit_idempotency_conflict",
      },
    );
  }
  return canonicalRequested;
}

export function shouldProcessBlogLinkAuditRun(
  created: boolean,
  status: "queued" | "running" | "completed" | "failed" | "interrupted",
): boolean {
  return created || status === "queued" || status === "interrupted";
}

function containsAlias(haystack: string, alias: string): boolean {
  const normalizedAlias = normalizeBlogLinkSearchText(alias);
  if (!normalizedAlias) return false;
  return ` ${haystack} `.includes(` ${normalizedAlias} `);
}

function aliasesForLanguage(
  aliases: Readonly<Record<"en" | "es", readonly string[]>>,
  language: BlogLinkLanguage,
): readonly string[] {
  if (language === "all") return [...aliases.en, ...aliases.es];
  return aliases[language];
}

export function detectBlogLinkIntent(
  text: string,
  language: BlogLinkLanguage = "all",
): BlogLinkIntent {
  const haystack = normalizeBlogLinkSearchText(text);
  const matchedAliases: string[] = [];
  const matches = (intent: keyof typeof BLOG_LINK_INTENT_ALIASES): boolean => {
    const found = aliasesForLanguage(BLOG_LINK_INTENT_ALIASES[intent], language)
      .filter(alias => containsAlias(haystack, alias));
    matchedAliases.push(...found.map(alias => normalizeBlogLinkSearchText(alias)));
    return found.length > 0;
  };

  return {
    crisis: matches("crisis"),
    medication: matches("medication"),
    treatment: matches("treatment"),
    safety: matches("safety"),
    matchedAliases: Array.from(new Set(matchedAliases)).sort(),
  };
}

export function isManagedBlogLinkSourceStableKey(
  value: string,
): value is BlogLinkSourceStableKey {
  return (BLOG_LINK_SOURCE_STABLE_KEYS as readonly string[]).includes(value);
}

export function matchesBlogLinkSourceTopic(
  stableKey: string,
  text: string,
  language: BlogLinkLanguage = "all",
): boolean {
  if (!isManagedBlogLinkSourceStableKey(stableKey)) return false;
  const haystack = normalizeBlogLinkSearchText(text);
  return aliasesForLanguage(BLOG_LINK_SOURCE_TOPIC_ALIASES[stableKey], language)
    .some(alias => containsAlias(haystack, alias));
}

export function is988AllowedForContext(
  text: string,
  language: BlogLinkLanguage = "all",
): boolean {
  return detectBlogLinkIntent(text, language).crisis;
}

function isLanguageCompatible(
  candidateLanguage: BlogLinkLanguage,
  contextLanguage: Exclude<BlogLinkLanguage, "all">,
): boolean {
  return candidateLanguage === "all" || candidateLanguage === contextLanguage;
}

function isCriticalContext(context: BlogLinkPolicyContext): boolean {
  const combined = [context.text, context.claimClass].filter(Boolean).join(" ");
  const intent = detectBlogLinkIntent(combined, context.language);
  return intent.crisis || intent.medication || intent.treatment || intent.safety;
}

export function evaluateBlogLinkGenerationEligibility(
  candidate: BlogLinkGenerationCandidate,
  context: BlogLinkPolicyContext,
): BlogLinkEligibilityDecision {
  const reasons: string[] = [];
  const critical = isCriticalContext(context);
  const sourceThreshold = candidate.kind === "external"
    ? critical
      ? BLOG_LINK_SCORE_THRESHOLDS.sourceQualityCritical
      : BLOG_LINK_SCORE_THRESHOLDS.sourceQualityNormal
    : null;
  const fitThreshold = candidate.kind === "external"
    ? critical
      ? BLOG_LINK_SCORE_THRESHOLDS.citationFitCritical
      : BLOG_LINK_SCORE_THRESHOLDS.citationFitNormal
    : null;

  if (candidate.reviewStatus !== "approved") reasons.push("review_not_approved");
  if (!candidate.generationEligible) reasons.push("generation_not_enabled");
  if (!isLanguageCompatible(candidate.language, context.language)) reasons.push("language_mismatch");
  if (candidate.healthStatus !== "healthy") reasons.push("health_not_current");
  if (candidate.exactHrefMatched === false) reasons.push("exact_href_not_matched");
  if (candidate.crossDomainRedirect) reasons.push("cross_domain_redirect");

  if (
    (BLOG_LINK_CRISIS_SOURCE_STABLE_KEYS as readonly string[]).includes(candidate.stableKey)
    && !is988AllowedForContext(
      [context.text, context.claimClass].filter(Boolean).join(" "),
      context.language,
    )
  ) {
    reasons.push("988_requires_crisis_context");
  }

  if (candidate.kind === "external") {
    if (
      candidate.sourceQualityScore === null
      || candidate.sourceQualityScore === undefined
      || candidate.sourceQualityScore < (sourceThreshold || 0)
    ) {
      reasons.push("source_quality_below_threshold");
    }
    if (
      candidate.citationFitScore === null
      || candidate.citationFitScore === undefined
      || candidate.citationFitScore < (fitThreshold || 0)
    ) {
      reasons.push("citation_fit_below_threshold");
    }
    if (critical && candidate.humanReviewed !== true) {
      reasons.push("critical_source_requires_human_review");
    }
  }

  return {
    policyVersion: BLOG_LINK_POLICY_VERSION,
    eligible: reasons.length === 0,
    critical,
    reasons,
    thresholds: {
      sourceQuality: sourceThreshold,
      citationFit: fitThreshold,
    },
  };
}

export function resolveRequestedBlogLinkStableIds<T extends BlogLinkGenerationCandidate>(
  requestedStableIds: readonly string[],
  snapshot: readonly T[],
  context: BlogLinkPolicyContext,
): ResolvedStableLinkSelection<T> {
  const byStableKey = new Map(snapshot.map(candidate => [candidate.stableKey, candidate]));
  const seen = new Set<string>();
  const selected: T[] = [];
  const rejected: ResolvedStableLinkSelection<T>["rejected"] = [];

  for (const stableKey of requestedStableIds) {
    if (seen.has(stableKey)) continue;
    seen.add(stableKey);
    const candidate = byStableKey.get(stableKey);
    if (!candidate) {
      rejected.push({ stableKey, reasons: ["unknown_stable_id"] });
      continue;
    }
    const decision = evaluateBlogLinkGenerationEligibility(candidate, context);
    if (decision.eligible) selected.push(candidate);
    else rejected.push({ stableKey, reasons: decision.reasons });
  }

  return { selected, rejected };
}

export function isExactEligibleExternalHref(
  rawHref: string,
  snapshot: readonly BlogLinkGenerationCandidate[],
  context: BlogLinkPolicyContext,
  normalizationOptions: NormalizeBlogLinkOptions = {},
): boolean {
  let normalizedHref: string;
  try {
    const normalized = normalizeBlogLinkHref(rawHref, normalizationOptions);
    if (normalized.kind !== "external") return false;
    normalizedHref = normalized.normalizedHref;
  } catch {
    return false;
  }

  return snapshot.some(candidate => (
    candidate.kind === "external"
    && candidate.normalizedHref === normalizedHref
    && evaluateBlogLinkGenerationEligibility(candidate, context).eligible
  ));
}

export function classifyBlogLinkHealthObservation(
  observation: BlogLinkHealthObservation,
): BlogLinkHealthClassification {
  const previousFailures = Math.max(0, observation.previousConsecutiveFailures || 0);
  const redirectCount = Math.max(0, observation.redirectCount || 0);
  const status = observation.httpStatus ?? null;

  if (observation.crossDomainRedirect) {
    return {
      healthStatus: "changed_review_needed",
      consecutiveFailures: 0,
      requiresHumanReview: true,
      confirmedBroken: false,
    };
  }

  if (status !== null && status >= 200 && status <= 399) {
    return {
      healthStatus: redirectCount > 0 || status >= 300 ? "redirected" : "healthy",
      consecutiveFailures: 0,
      requiresHumanReview: redirectCount > 0 || status >= 300,
      confirmedBroken: false,
    };
  }

  const nextFailures = previousFailures + 1;
  if (
    (status === 404 || status === 410)
    && (observation.confirmationAttempt === true || previousFailures >= 1)
  ) {
    return {
      healthStatus: "broken",
      consecutiveFailures: nextFailures,
      requiresHumanReview: true,
      confirmedBroken: true,
    };
  }

  return {
    healthStatus: "unreachable",
    consecutiveFailures: nextFailures,
    requiresHumanReview: false,
    confirmedBroken: false,
  };
}

function assertPlainObject(value: unknown, label: string): asserts value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw Object.assign(new Error(`${label} must be an object`), {
      code: "blog_link_audit_invalid_input",
    });
  }
}

function assertNoUrlLikeFields(value: unknown): void {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach(assertNoUrlLikeFields);
    return;
  }
  for (const [key, nested] of Object.entries(value)) {
    if (URL_LIKE_FIELD.test(key)) {
      throw Object.assign(new Error("Audit input cannot contain URL, href, host, or origin fields"), {
        code: "blog_link_audit_url_not_allowed",
        field: key,
      });
    }
    assertNoUrlLikeFields(nested);
  }
}

export function assertSafeBlogLinkAuditInput(input: unknown): SafeBlogLinkAuditInput {
  assertPlainObject(input, "Blog link audit input");
  assertNoUrlLikeFields(input);

  for (const key of Object.keys(input)) {
    if (!SAFE_AUDIT_TOP_LEVEL_KEYS.has(key)) {
      throw Object.assign(new Error(`Unsupported blog link audit field: ${key}`), {
        code: "blog_link_audit_invalid_input",
      });
    }
  }

  if (input.linkIds !== undefined) {
    if (
      !Array.isArray(input.linkIds)
      || input.linkIds.length > 500
      || input.linkIds.some(id => !Number.isInteger(id) || Number(id) <= 0)
    ) {
      throw Object.assign(new Error("linkIds must contain at most 500 positive integers"), {
        code: "blog_link_audit_invalid_input",
      });
    }
  }

  if (input.filters !== undefined) {
    assertPlainObject(input.filters, "Blog link audit filters");
    for (const key of Object.keys(input.filters)) {
      if (!SAFE_AUDIT_FILTER_KEYS.has(key)) {
        throw Object.assign(new Error(`Unsupported blog link audit filter: ${key}`), {
          code: "blog_link_audit_invalid_input",
        });
      }
    }
    const filters = input.filters;
    if (filters.kind !== undefined && filters.kind !== "internal" && filters.kind !== "external") {
      throw Object.assign(new Error("Invalid blog link kind filter"), {
        code: "blog_link_audit_invalid_input",
      });
    }
    if (
      filters.reviewStatus !== undefined
      && !["pending", "approved", "blocked", "retired"].includes(String(filters.reviewStatus))
    ) {
      throw Object.assign(new Error("Invalid blog link review filter"), {
        code: "blog_link_audit_invalid_input",
      });
    }
    if (
      filters.healthStatus !== undefined
      && ![
        "unchecked",
        "healthy",
        "redirected",
        "unreachable",
        "broken",
        "changed_review_needed",
        "stale",
      ].includes(String(filters.healthStatus))
    ) {
      throw Object.assign(new Error("Invalid blog link health filter"), {
        code: "blog_link_audit_invalid_input",
      });
    }
    if (
      filters.generationEligible !== undefined
      && typeof filters.generationEligible !== "boolean"
    ) {
      throw Object.assign(new Error("Invalid generation eligibility filter"), {
        code: "blog_link_audit_invalid_input",
      });
    }
  }

  return input as SafeBlogLinkAuditInput;
}

export async function resolveBlogLinkSelectionFailOpen<T>(
  loader: () => T | Promise<T>,
  fallback: T,
  warning = "Link Intelligence selection failed; the draft can continue without managed links.",
): Promise<{ value: T; warnings: string[] }> {
  try {
    return {
      value: await loader(),
      warnings: [],
    };
  } catch {
    return {
      value: fallback,
      warnings: [warning],
    };
  }
}
