import assert from "node:assert/strict";
import {
  BLOG_CONTENT_FORMATS,
  BLOG_CONTENT_PILLARS,
  BLOG_PATIENT_STAGES,
  HEALING_MINDS_TOPIC_STRATEGY_VERSION,
  getHealingMindsCategories,
} from "../server/blog/strategy/healing-minds";
import {
  buildTopicKey,
  hasCosmeticFreshness,
  hasRiskyListicleLanguage,
  hasUnsafeYmylTopic,
  topicJaccardSimilarity,
} from "../server/blog/ai/topic-normalization";
import { scoreTopicCandidate } from "../server/blog/ai/topic-scoring";
import { assertBlogTopicGenerationConfigured } from "../server/blog/ai/responses-client";
import { adminBlogAutoGenerateSchema, adminBlogTopicPlannerSchema } from "../server/blog/admin-validation";
import { assertCompleteTopicJudgeDecisionSet, assertValidTopicJudgeMatches } from "../server/blog/ai/topic-judge";
import {
  buildPersistedTopicDraftOverrides,
  snapshotPlannedLinkIds,
} from "../server/blog/ai/planned-topic-provenance";
import { drizzle } from "drizzle-orm/neon-serverless";
import {
  legacyBlogTopicCandidates,
  toLegacyBlogTopicCandidateInsert,
} from "../server/blog/topic-candidate-legacy-schema";

function checkStrategyRegistry(): void {
  const en = getHealingMindsCategories("en");
  const es = getHealingMindsCategories("es");
  assert.equal(HEALING_MINDS_TOPIC_STRATEGY_VERSION, "healing-minds-topic-strategy-v1");
  assert.equal(en.length, 8);
  assert.equal(es.length, 8);
  assert.equal(new Set(en.map(category => category.key)).size, 8);
  assert.deepEqual(
    new Set(en.map(category => category.key)),
    new Set(es.map(category => category.key)),
  );
  assert.equal(new Set(en.map(category => category.slug)).size, 8);
  assert.equal(new Set(es.map(category => category.slug)).size, 8);
  assert.equal(BLOG_CONTENT_PILLARS.length, 7);
  assert.equal(BLOG_PATIENT_STAGES.length, 4);
  assert.equal(BLOG_CONTENT_FORMATS.length, 7);
}

function checkDeterministicOverlap(): void {
  const duplicate = topicJaccardSimilarity(
    "Adult ADHD evaluation: what patients can expect",
    "What to expect from an adult ADHD evaluation",
    "en",
  );
  const reverse = topicJaccardSimilarity(
    "What to expect from an adult ADHD evaluation",
    "Adult ADHD evaluation: what patients can expect",
    "en",
  );
  assert.equal(duplicate.score, reverse.score, "Jaccard similarity must be symmetric");
  assert.ok(duplicate.score >= 0.55, `Expected duplicate score >= .55, received ${duplicate.score}`);

  const distinct = topicJaccardSimilarity(
    "Questions families can ask during bipolar follow-up",
    "Preparing for a first telepsychiatry appointment",
    "en",
  );
  assert.ok(distinct.score < 0.2, `Expected distinct score < .20, received ${distinct.score}`);
  assert.equal(
    buildTopicKey("Evaluacion de TDAH en adultos", "es"),
    buildTopicKey("Evaluación de TDAH en adultos", "es"),
  );
  assert.equal(hasRiskyListicleLanguage("Top treatments that guarantee a cure", "en"), true);
  assert.equal(hasCosmeticFreshness("Anxiety guide for summer 2026"), true);
  assert.equal(hasUnsafeYmylTopic("How to increase medication to 20 mg", "en"), true);
  assert.equal(hasUnsafeYmylTopic("How to diagnose yourself with adult ADHD", "en"), true);
  assert.equal(hasUnsafeYmylTopic("Dr. Reve reveals how she cured bipolar disorder", "en"), true);
  assert.equal(hasUnsafeYmylTopic("How therapy cured depression permanently", "en"), true);
  assert.equal(hasUnsafeYmylTopic("A patient's suicide crisis story that saved them", "en"), true);
  assert.equal(hasUnsafeYmylTopic("When to double your antidepressant", "en"), true);
  assert.equal(hasUnsafeYmylTopic("Antidepressants: when to double them", "en"), true);
  assert.equal(hasUnsafeYmylTopic("Questions to discuss with a psychiatric clinician", "en"), false);
}

function checkScoringPenalties(): void {
  const base = {
    overlapScore: 0.1,
    clusterCount: 1,
    maxClusterCount: 4,
    pillar: "evaluation_care_journey" as const,
    recentCategoryKeys: ["depression", "anxiety"],
    categoryKey: "adult_adhd",
    recentPillars: ["condition_education", "medication_safety"],
    recentFormats: ["explainer", "comparison", "local_guide"],
    patientStage: "evaluation" as const,
    missingStages: ["evaluation"] as Array<"evaluation">,
    contentFormat: "what_to_expect" as const,
    curatedSourceCount: 3,
    riskyListicle: false,
  };
  const good = scoreTopicCandidate(base);
  const penalized = scoreTopicCandidate({
    ...base,
    recentCategoryKeys: ["adult_adhd", "adult_adhd"],
    recentPillars: ["evaluation_care_journey", "evaluation_care_journey"],
    recentFormats: ["what_to_expect", "what_to_expect", "what_to_expect"],
    riskyListicle: true,
  });
  assert.ok(good.total > penalized.total);
  assert.equal(penalized.penalties.listicle, -15);
  assert.equal(penalized.penalties.repeatedCategory, -8);
  assert.equal(penalized.penalties.repeatedPillar, -8);
  assert.equal(penalized.penalties.repeatedFormat, -6);
}

function checkConfigGuardWithoutSecrets(): void {
  assert.throws(
    () => assertCompleteTopicJudgeDecisionSet(["one", "two"], [
      {
        candidateKey: "one",
        decision: "distinct",
        confidenceBasisPoints: 9000,
        matchedPostId: null,
        rationale: "Distinct intent.",
      },
      {
        candidateKey: "one",
        decision: "distinct",
        confidenceBasisPoints: 9000,
        matchedPostId: null,
        rationale: "Duplicate response key.",
      },
    ]),
    (error: unknown) => (error as { code?: string }).code === "topic_judge_incomplete",
  );
  assert.throws(
    () => assertValidTopicJudgeMatches([7], [{
      candidateKey: "one",
      decision: "duplicate",
      confidenceBasisPoints: 9000,
      matchedPostId: 999,
      rationale: "Hallucinated match.",
    }]),
    (error: unknown) => (error as { code?: string }).code === "topic_judge_invalid_match",
  );
  assert.deepEqual(
    adminBlogAutoGenerateSchema.parse({
      language: "en",
      authorId: 1,
      categoryId: 999,
      focus: "patient name: should never persist",
      limit: 8,
    }),
    { language: "en", authorId: 1 },
  );
  assert.deepEqual(
    adminBlogTopicPlannerSchema.parse({ language: "es", focus: "ignored", categoryId: 4 }),
    { language: "es" },
  );
  const previousEnabled = process.env.BLOG_TOPIC_ENABLED;
  const previousKey = process.env.OPENAI_API_KEY;
  process.env.BLOG_TOPIC_ENABLED = "false";
  delete process.env.OPENAI_API_KEY;
  assert.throws(
    () => assertBlogTopicGenerationConfigured(),
    (error: unknown) => (error as { code?: string }).code === "topic_strategy_disabled",
  );
  if (previousEnabled === undefined) delete process.env.BLOG_TOPIC_ENABLED;
  else process.env.BLOG_TOPIC_ENABLED = previousEnabled;
  if (previousKey === undefined) delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY = previousKey;
}

function checkPlannedLinkProvenance(): void {
  assert.deepEqual(snapshotPlannedLinkIds({
    sourceRecommendationIds: ["nimh-anxiety", "nimh-anxiety"],
    internalLinkTargetIds: ["blog-post-42", "services-anxiety"],
  }), {
    sourceRecommendationIds: ["nimh-anxiety"],
    internalLinkTargetIds: ["blog-post-42", "services-anxiety"],
  });
  assert.throws(
    () => snapshotPlannedLinkIds({
      sourceRecommendationIds: ["https://invented.example/page"],
      internalLinkTargetIds: [],
    }),
    (error: unknown) => (
      (error as { code?: string }).code === "topic_candidate_link_provenance_invalid"
    ),
  );

  const overrides = buildPersistedTopicDraftOverrides({
    id: 77,
    runId: 18,
    candidateKey: "b1-1-anxiety-evaluation",
    topic: "Questions to ask during an anxiety evaluation",
    targetKeyword: "anxiety evaluation questions",
    language: "en",
    categoryId: 4,
    categoryKey: "anxiety",
    pillar: "evaluation_care_journey",
    patientStage: "evaluation",
    contentFormat: "questions_to_ask",
    searchIntent: "care_navigation",
    expertiseAngle: "Prepare patients for a collaborative appointment.",
    strategyVersion: HEALING_MINDS_TOPIC_STRATEGY_VERSION,
    recommendation: "recommended",
    sourceRecommendationIds: ["nimh-anxiety"],
    internalLinkTargetIds: ["blog-post-42"],
  });
  assert.equal(overrides.topicCandidateId, 77);
  assert.equal(overrides.topic, "Questions to ask during an anxiety evaluation");
  assert.deepEqual(overrides.internalLinks, []);
  assert.deepEqual(overrides.internalLinkTargetIds, ["blog-post-42"]);
  assert.deepEqual(overrides.sourceRecommendationIds, ["nimh-anxiety"]);
  assert.equal(overrides.topicStrategyVersion, HEALING_MINDS_TOPIC_STRATEGY_VERSION);
}

function checkLegacyTopicCandidateInsertSql(): void {
  const legacyInsert = toLegacyBlogTopicCandidateInsert({
    runId: 18,
    batch: 1,
    candidateKey: "b1-1-anxiety-evaluation",
    topic: "Questions to ask during an anxiety evaluation",
    targetKeyword: "anxiety evaluation questions",
    language: "en",
    categoryId: 4,
    categoryKey: "anxiety",
    pillar: "evaluation_care_journey",
    patientStage: "evaluation",
    contentFormat: "questions_to_ask",
    searchIntent: "care_navigation",
    expertiseAngle: "Prepare patients for a collaborative appointment.",
    whyTimely: "Patients need practical appointment preparation.",
    sourceRecommendationIds: ["nimh-anxiety"],
    internalLinkTargetIds: ["blog-post-42"],
    createOrUpdate: "create",
    strategyVersion: HEALING_MINDS_TOPIC_STRATEGY_VERSION,
    promptVersion: "healing-minds-topic-prompt-v1",
    provider: "openai",
    model: "gpt-5-mini",
    deterministicStatus: "very_low_overlap",
    overlapBasisPoints: 800,
    matchedPostIds: [],
    semanticDecision: "distinct",
    semanticConfidenceBasisPoints: 9200,
    semanticMatchedPostId: null,
    semanticRationale: "Distinct reader question and intent.",
    judgeModel: "gpt-5-mini",
    score: 84,
    scoreBreakdown: { novelty: 24 },
    recommendation: "recommended",
  });
  const mockDb = drizzle.mock();
  const rendered = mockDb
    .insert(legacyBlogTopicCandidates)
    .values(legacyInsert)
    .onConflictDoNothing({
      target: [
        legacyBlogTopicCandidates.runId,
        legacyBlogTopicCandidates.candidateKey,
      ],
    })
    .returning()
    .toSQL();

  assert.match(rendered.sql, /^insert into "blog_topic_candidates"/);
  assert.match(rendered.sql, /"source_recommendation_ids"/);
  assert.doesNotMatch(
    rendered.sql,
    /internal_link_target_ids/,
    "Flag-off INSERT must remain executable against the Sprint 18 schema.",
  );
}

checkStrategyRegistry();
checkDeterministicOverlap();
checkScoringPenalties();
checkConfigGuardWithoutSecrets();
checkPlannedLinkProvenance();
checkLegacyTopicCandidateInsertSql();

console.log("Blog topic guards passed: registry, bilingual normalization, overlap, scoring, config, planned link provenance, and Sprint 18 insert compatibility.");
