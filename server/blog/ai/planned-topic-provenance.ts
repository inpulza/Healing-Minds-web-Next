import {
  BLOG_CONTENT_FORMATS,
  BLOG_CONTENT_PILLARS,
  BLOG_PATIENT_STAGES,
  BLOG_SEARCH_INTENTS,
  HEALING_MINDS_TOPIC_STRATEGY_VERSION,
  type BlogContentFormat,
  type BlogContentPillar,
  type BlogPatientStage,
  type BlogSearchIntent,
} from "../strategy/healing-minds";
import { buildTopicKey } from "./topic-normalization";

const MANAGED_LINK_STABLE_ID = /^[a-z0-9-]{3,120}$/;

type PlannedLinkIds = {
  sourceRecommendationIds: string[];
  internalLinkTargetIds: string[];
};

type PersistedTopicCandidateForDraft = PlannedLinkIds & {
  id: number;
  runId: number;
  candidateKey: string;
  topic: string;
  targetKeyword: string;
  language: string;
  categoryId: number;
  pillar: string;
  patientStage: string;
  contentFormat: string;
  searchIntent: string;
  expertiseAngle: string;
  strategyVersion: string;
  recommendation: string;
};

export type PersistedTopicDraftOverrides = {
  topic: string;
  targetKeyword: string;
  additionalContext: string;
  language: "en" | "es";
  categoryId: number;
  internalLinks: [];
  internalLinkTargetIds: string[];
  sourceRecommendationIds: string[];
  topicCandidateId: number;
  topicKey: string;
  expertiseAngle: string;
  contentPillar: BlogContentPillar;
  patientStage: BlogPatientStage;
  contentFormat: BlogContentFormat;
  searchIntent: BlogSearchIntent;
  topicStrategyVersion: typeof HEALING_MINDS_TOPIC_STRATEGY_VERSION;
};

function normalizeStableIds(values: readonly string[], field: string): string[] {
  const normalized = Array.from(new Set(values.map(value => value.trim())));
  if (normalized.some(value => !MANAGED_LINK_STABLE_ID.test(value))) {
    throw Object.assign(new Error(`Persisted topic candidate contains an invalid ${field}`), {
      statusCode: 409,
      code: "topic_candidate_link_provenance_invalid",
    });
  }
  return normalized;
}

export function snapshotPlannedLinkIds(input: PlannedLinkIds): PlannedLinkIds {
  return {
    sourceRecommendationIds: normalizeStableIds(
      input.sourceRecommendationIds,
      "source recommendation ID",
    ),
    internalLinkTargetIds: normalizeStableIds(
      input.internalLinkTargetIds,
      "internal target ID",
    ),
  };
}

export function buildPersistedTopicDraftOverrides(
  candidate: PersistedTopicCandidateForDraft,
): PersistedTopicDraftOverrides {
  if (
    candidate.recommendation !== "recommended"
    || candidate.strategyVersion !== HEALING_MINDS_TOPIC_STRATEGY_VERSION
    || !Number.isInteger(candidate.id)
    || candidate.id <= 0
    || !Number.isInteger(candidate.runId)
    || candidate.runId <= 0
    || !Number.isInteger(candidate.categoryId)
    || candidate.categoryId <= 0
    || (candidate.language !== "en" && candidate.language !== "es")
    || !(BLOG_CONTENT_PILLARS as readonly string[]).includes(candidate.pillar)
    || !(BLOG_PATIENT_STAGES as readonly string[]).includes(candidate.patientStage)
    || !(BLOG_CONTENT_FORMATS as readonly string[]).includes(candidate.contentFormat)
    || !(BLOG_SEARCH_INTENTS as readonly string[]).includes(candidate.searchIntent)
  ) {
    throw Object.assign(new Error("The persisted topic candidate is not safe to generate"), {
      statusCode: 409,
      code: "topic_candidate_not_selectable",
    });
  }

  const linkIds = snapshotPlannedLinkIds(candidate);
  const language = candidate.language;
  return {
    topic: candidate.topic,
    targetKeyword: candidate.targetKeyword,
    additionalContext: candidate.expertiseAngle,
    language,
    categoryId: candidate.categoryId,
    internalLinks: [],
    internalLinkTargetIds: linkIds.internalLinkTargetIds,
    sourceRecommendationIds: linkIds.sourceRecommendationIds,
    topicCandidateId: candidate.id,
    topicKey: buildTopicKey(
      `${candidate.topic} ${candidate.targetKeyword}`,
      language,
    ),
    expertiseAngle: candidate.expertiseAngle,
    contentPillar: candidate.pillar as BlogContentPillar,
    patientStage: candidate.patientStage as BlogPatientStage,
    contentFormat: candidate.contentFormat as BlogContentFormat,
    searchIntent: candidate.searchIntent as BlogSearchIntent,
    topicStrategyVersion: HEALING_MINDS_TOPIC_STRATEGY_VERSION,
  };
}
