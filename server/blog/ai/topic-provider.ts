import { z } from "zod";
import type { BlogLanguage } from "../storage";
import {
  BLOG_CONTENT_FORMATS,
  BLOG_CONTENT_PILLARS,
  BLOG_PATIENT_STAGES,
  BLOG_PILLAR_WEIGHTS,
  BLOG_SEARCH_INTENTS,
  HEALING_MINDS_TOPIC_PROMPT_VERSION,
  HEALING_MINDS_CATEGORY_KEYS,
  getHealingMindsCategories,
  type HealingMindsCategoryKey,
} from "../strategy/healing-minds";
import { createStructuredResponse } from "./responses-client";

export const topicProposalSchema = z.object({
  candidateKey: z.string().trim().min(3).max(120).regex(/^[a-z0-9-]+$/),
  topic: z.string().trim().min(8).max(180),
  targetKeyword: z.string().trim().min(3).max(120),
  language: z.enum(["en", "es"]),
  categoryKey: z.enum(HEALING_MINDS_CATEGORY_KEYS),
  pillar: z.enum(BLOG_CONTENT_PILLARS),
  patientStage: z.enum(BLOG_PATIENT_STAGES),
  contentFormat: z.enum(BLOG_CONTENT_FORMATS),
  searchIntent: z.enum(BLOG_SEARCH_INTENTS),
  expertiseAngle: z.string().trim().min(10).max(500),
  whyTimely: z.string().trim().min(10).max(500),
  sourceRecommendationIds: z.array(z.string().trim().min(3).max(100)).max(4),
  createOrUpdate: z.enum(["create_new", "update_existing"]),
});

const topicBatchSchema = z.object({
  candidates: z.array(topicProposalSchema).length(5),
});

export type TopicProposal = z.infer<typeof topicProposalSchema>;

const TOPIC_BATCH_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["candidates"],
  properties: {
    candidates: {
      type: "array",
      minItems: 5,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "candidateKey", "topic", "targetKeyword", "language", "categoryKey", "pillar",
          "patientStage", "contentFormat", "searchIntent", "expertiseAngle", "whyTimely",
          "sourceRecommendationIds", "createOrUpdate",
        ],
        properties: {
          candidateKey: { type: "string", pattern: "^[a-z0-9-]{3,120}$" },
          topic: { type: "string", minLength: 8, maxLength: 180 },
          targetKeyword: { type: "string", minLength: 3, maxLength: 120 },
          language: { type: "string", enum: ["en", "es"] },
          categoryKey: {
            type: "string",
            enum: HEALING_MINDS_CATEGORY_KEYS,
          },
          pillar: { type: "string", enum: BLOG_CONTENT_PILLARS },
          patientStage: { type: "string", enum: BLOG_PATIENT_STAGES },
          contentFormat: { type: "string", enum: BLOG_CONTENT_FORMATS },
          searchIntent: { type: "string", enum: BLOG_SEARCH_INTENTS },
          expertiseAngle: { type: "string", minLength: 10, maxLength: 500 },
          whyTimely: { type: "string", minLength: 10, maxLength: 500 },
          sourceRecommendationIds: {
            type: "array",
            maxItems: 4,
            items: { type: "string", minLength: 3, maxLength: 100 },
          },
          createOrUpdate: { type: "string", enum: ["create_new", "update_existing"] },
        },
      },
    },
  },
};

export type TopicInventorySnapshot = {
  posts: Array<{
    id: number;
    title: string;
    targetKeyword?: string | null;
    topicKey?: string | null;
    categoryKey: string;
    pillar?: string | null;
    patientStage?: string | null;
    contentFormat?: string | null;
    status: string;
  }>;
  clusterCounts: Record<string, number>;
  recentCategoryKeys: string[];
  recentPillars: string[];
  recentFormats: string[];
};

export async function generateTopicCandidateBatch(input: {
  language: BlogLanguage;
  inventory: TopicInventorySnapshot;
  categoryKeys: HealingMindsCategoryKey[];
  sourceIds: string[];
  batch: 1 | 2;
  rejectionEvidence?: Array<{ topic: string; reason: string }>;
}) {
  const call = () => createStructuredResponse({
    role: "planner",
    system: [
      "You plan educational psychiatry blog topics for Healing Minds Psychiatry in Naples, Florida.",
      "Return exactly five genuinely distinct, useful topics in the requested language.",
      "Use only the supplied taxonomy values and source IDs. Do not invent facts or sources.",
      "Never include PHI, patient stories, a fabricated Dr. Reve quote, diagnosis, guaranteed outcomes, medication instructions, dosages, crisis dramatization, or promotional superlatives.",
      "Avoid cosmetic uniqueness based only on a year, season, location, or list number.",
      "Use at most one listicle-like idea in the batch. Prefer patient questions and meaningful search-intent gaps.",
      "Treat the inventory as the complete existing-topic record and diversify categories, pillars, stages, and formats.",
    ].join(" "),
    user: {
      language: input.language,
      strategyVersion: "healing-minds-topic-strategy-v1",
      promptVersion: HEALING_MINDS_TOPIC_PROMPT_VERSION,
      categoryKeys: input.categoryKeys,
      categoryStrategy: getHealingMindsCategories(input.language).map(category => ({
        key: category.key,
        name: category.name,
        description: category.description,
        aliases: category.aliases,
        defaultPillars: category.defaultPillars,
      })),
      allowedPillars: BLOG_CONTENT_PILLARS,
      pillarPriorityWeights: BLOG_PILLAR_WEIGHTS,
      allowedPatientStages: BLOG_PATIENT_STAGES,
      allowedFormats: BLOG_CONTENT_FORMATS,
      allowedSearchIntents: BLOG_SEARCH_INTENTS,
      allowedSourceIds: input.sourceIds,
      batch: input.batch,
      inventory: input.inventory,
      rejectionEvidence: input.rejectionEvidence || [],
    },
    format: { name: "healing_minds_topic_batch", schema: TOPIC_BATCH_JSON_SCHEMA },
  });
  let response: Awaited<ReturnType<typeof call>>;
  try {
    response = await call();
  } catch (error) {
    if (!(error as { retryable?: boolean }).retryable) throw error;
    response = await call();
  }
  const parsed = topicBatchSchema.parse(response.data);
  if (parsed.candidates.some(candidate => candidate.language !== input.language)) {
    throw Object.assign(new Error("Topic provider returned the wrong language"), {
      statusCode: 502,
      code: "topic_language_mismatch",
    });
  }
  return { ...parsed, model: response.model, durationMs: response.durationMs };
}
