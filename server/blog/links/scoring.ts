import {
  BLOG_LINK_POLICY_VERSION,
  BLOG_LINK_SCORE_THRESHOLDS,
  BLOG_LINK_SCORE_VERSION,
  CITATION_FIT_WEIGHTS,
  INTERNAL_OPPORTUNITY_WEIGHTS,
  SOURCE_QUALITY_WEIGHTS,
} from "./config";

export type SourceQualityBreakdown = {
  accountablePublisher: number;
  expertReview: number;
  traceableEvidence: number;
  currency: number;
  fundingTransparency: number;
  stableIdentifier: number;
};

export type CitationFitBreakdown = {
  directSupport: number;
  evidenceTypeFit: number;
  contextFit: number;
  languageAccessibility: number;
  diversity: number;
};

export type InternalOpportunityBreakdown = {
  topicalAffinity: number;
  patientJourneyFit: number;
  graphNeed: number;
  anchorContext: number;
  editorialDiversity: number;
};

export type ExplainableScore<T extends Record<string, number>> = {
  policyVersion: typeof BLOG_LINK_POLICY_VERSION;
  scoreVersion: typeof BLOG_LINK_SCORE_VERSION;
  total: number;
  maxTotal: 100;
  breakdown: T;
  explanations: Record<keyof T, string>;
};

export type CitationUseScore = {
  policyVersion: typeof BLOG_LINK_POLICY_VERSION;
  scoreVersion: typeof BLOG_LINK_SCORE_VERSION;
  total: number;
  sourceQuality: number;
  citationFit: number;
  weights: {
    sourceQuality: 40;
    citationFit: 60;
  };
};

export type InternalOpportunityGateInput = {
  destinationPublic: boolean;
  destinationCanonical: boolean;
  destinationIndexable: boolean;
  distinctDestination: boolean;
  languageCompatible: boolean;
  notDuplicated: boolean;
  destinationHealthy: boolean;
  destinationRedirected: boolean;
};

export type InternalOpportunityBand = "recommended" | "optional" | "none";

export type InternalOpportunityScore = ExplainableScore<InternalOpportunityBreakdown> & {
  eligible: boolean;
  band: InternalOpportunityBand;
  gateReasons: string[];
};

const DEFAULT_SOURCE_EXPLANATIONS: Record<keyof SourceQualityBreakdown, string> = {
  accountablePublisher: "Responsible publisher or editor is identifiable.",
  expertReview: "Expert editorial or scientific review is documented.",
  traceableEvidence: "Evidence and references are inspectable and traceable.",
  currency: "Publication or review currency is documented.",
  fundingTransparency: "Funding and conflicts are disclosed or reviewed.",
  stableIdentifier: "The page has a stable identifier or durable permalink.",
};

const DEFAULT_CITATION_EXPLANATIONS: Record<keyof CitationFitBreakdown, string> = {
  directSupport: "The exact page directly supports the article topic or claim.",
  evidenceTypeFit: "The evidence type is appropriate for the intended claim.",
  contextFit: "Population, jurisdiction, and care context fit the article.",
  languageAccessibility: "Language and reading level fit the intended reader.",
  diversity: "The use adds evidence without unnecessary source repetition.",
};

const DEFAULT_INTERNAL_EXPLANATIONS: Record<keyof InternalOpportunityBreakdown, string> = {
  topicalAffinity: "The source and destination share an explainable topic relationship.",
  patientJourneyFit: "The destination advances the reader's care or information journey.",
  graphNeed: "The link reduces an orphan or underlinked-page gap.",
  anchorContext: "The proposed anchor and section context are natural and descriptive.",
  editorialDiversity: "The suggestion avoids repetitive targets and anchors.",
};

function scoreError(component: string, value: number, maximum: number): Error {
  return Object.assign(
    new Error(`Score component ${component} must be between 0 and ${maximum}; received ${value}`),
    {
      code: "blog_link_score_out_of_bounds",
      component,
      value,
      maximum,
    },
  );
}

function assertBoundedScore(
  component: string,
  value: number,
  maximum: number,
): void {
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0 || value > maximum) {
    throw scoreError(component, value, maximum);
  }
}

function mergeExplanations<T extends Record<string, number>>(
  defaults: Record<keyof T, string>,
  overrides?: Partial<Record<keyof T, string>>,
): Record<keyof T, string> {
  const merged = { ...defaults };
  if (!overrides) return merged;
  for (const key of Object.keys(overrides) as Array<keyof T>) {
    const value = overrides[key]?.trim();
    if (value) merged[key] = value;
  }
  return merged;
}

export function scoreSourceQuality(
  breakdown: SourceQualityBreakdown,
  explanations?: Partial<Record<keyof SourceQualityBreakdown, string>>,
): ExplainableScore<SourceQualityBreakdown> {
  for (const key of Object.keys(SOURCE_QUALITY_WEIGHTS) as Array<keyof SourceQualityBreakdown>) {
    assertBoundedScore(key, breakdown[key], SOURCE_QUALITY_WEIGHTS[key]);
  }

  return {
    policyVersion: BLOG_LINK_POLICY_VERSION,
    scoreVersion: BLOG_LINK_SCORE_VERSION,
    total: Object.values(breakdown).reduce((total, value) => total + value, 0),
    maxTotal: 100,
    breakdown: { ...breakdown },
    explanations: mergeExplanations(DEFAULT_SOURCE_EXPLANATIONS, explanations),
  };
}

export function scoreCitationFit(
  breakdown: CitationFitBreakdown,
  explanations?: Partial<Record<keyof CitationFitBreakdown, string>>,
): ExplainableScore<CitationFitBreakdown> {
  for (const key of Object.keys(CITATION_FIT_WEIGHTS) as Array<keyof CitationFitBreakdown>) {
    assertBoundedScore(key, breakdown[key], CITATION_FIT_WEIGHTS[key]);
  }

  return {
    policyVersion: BLOG_LINK_POLICY_VERSION,
    scoreVersion: BLOG_LINK_SCORE_VERSION,
    total: Object.values(breakdown).reduce((total, value) => total + value, 0),
    maxTotal: 100,
    breakdown: { ...breakdown },
    explanations: mergeExplanations(DEFAULT_CITATION_EXPLANATIONS, explanations),
  };
}

function normalizeTotal(score: number | { total: number }): number {
  const total = typeof score === "number" ? score : score.total;
  assertBoundedScore("total", total, 100);
  return total;
}

export function scoreCitationUse(
  sourceQuality: number | { total: number },
  citationFit: number | { total: number },
): CitationUseScore {
  const sourceQualityTotal = normalizeTotal(sourceQuality);
  const citationFitTotal = normalizeTotal(citationFit);

  return {
    policyVersion: BLOG_LINK_POLICY_VERSION,
    scoreVersion: BLOG_LINK_SCORE_VERSION,
    total: Math.round((sourceQualityTotal * 0.4) + (citationFitTotal * 0.6)),
    sourceQuality: sourceQualityTotal,
    citationFit: citationFitTotal,
    weights: {
      sourceQuality: 40,
      citationFit: 60,
    },
  };
}

const DEFAULT_INTERNAL_GATES: InternalOpportunityGateInput = {
  destinationPublic: true,
  destinationCanonical: true,
  destinationIndexable: true,
  distinctDestination: true,
  languageCompatible: true,
  notDuplicated: true,
  destinationHealthy: true,
  destinationRedirected: false,
};

function getInternalGateReasons(
  breakdown: InternalOpportunityBreakdown,
  gates: InternalOpportunityGateInput,
): string[] {
  const reasons: string[] = [];
  if (!gates.destinationPublic) reasons.push("destination_not_public");
  if (!gates.destinationCanonical) reasons.push("destination_not_canonical");
  if (!gates.destinationIndexable) reasons.push("destination_not_indexable");
  if (!gates.distinctDestination) reasons.push("source_equals_destination");
  if (!gates.languageCompatible) reasons.push("language_mismatch");
  if (!gates.notDuplicated) reasons.push("duplicate_link");
  if (!gates.destinationHealthy) reasons.push("destination_not_healthy");
  if (gates.destinationRedirected) reasons.push("destination_is_redirect");
  if (breakdown.topicalAffinity < BLOG_LINK_SCORE_THRESHOLDS.internalTopicalGate) {
    reasons.push("topical_affinity_below_gate");
  }
  return reasons;
}

export function scoreInternalLinkOpportunity(
  breakdown: InternalOpportunityBreakdown,
  gates: Partial<InternalOpportunityGateInput> = {},
  explanations?: Partial<Record<keyof InternalOpportunityBreakdown, string>>,
): InternalOpportunityScore {
  for (const key of Object.keys(INTERNAL_OPPORTUNITY_WEIGHTS) as Array<keyof InternalOpportunityBreakdown>) {
    assertBoundedScore(key, breakdown[key], INTERNAL_OPPORTUNITY_WEIGHTS[key]);
  }

  const resolvedGates = { ...DEFAULT_INTERNAL_GATES, ...gates };
  const total = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
  const gateReasons = getInternalGateReasons(breakdown, resolvedGates);
  const eligible = gateReasons.length === 0;
  const band: InternalOpportunityBand = !eligible
    ? "none"
    : total >= BLOG_LINK_SCORE_THRESHOLDS.internalRecommended
      ? "recommended"
      : total >= BLOG_LINK_SCORE_THRESHOLDS.internalOptional
        ? "optional"
        : "none";

  return {
    policyVersion: BLOG_LINK_POLICY_VERSION,
    scoreVersion: BLOG_LINK_SCORE_VERSION,
    total,
    maxTotal: 100,
    breakdown: { ...breakdown },
    explanations: mergeExplanations(DEFAULT_INTERNAL_EXPLANATIONS, explanations),
    eligible,
    band,
    gateReasons,
  };
}

export function rankInternalLinkOpportunities<T extends {
  stableKey: string;
  score: InternalOpportunityScore;
}>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => {
    if (a.score.total !== b.score.total) return b.score.total - a.score.total;
    if (a.stableKey < b.stableKey) return -1;
    if (a.stableKey > b.stableKey) return 1;
    return 0;
  });
}
