import type { BlogCategory, BlogTag, InsertBlogTopicCandidate } from "@shared/schema";
import { buildBlogEditorialBrief } from "./editorial-brief";
import { getAdminBlogPosts, type BlogLanguage, type BlogPostWithRelations } from "../storage";
import { selectBlogTagIds } from "../taxonomy";
import {
  BLOG_PATIENT_STAGES,
  BLOG_TOPIC_THRESHOLDS,
  HEALING_MINDS_TOPIC_PROMPT_VERSION,
  HEALING_MINDS_TOPIC_STRATEGY_VERSION,
  getHealingMindsCategories,
  inferHealingMindsCategoryKey,
  type BlogContentFormat,
  type BlogContentPillar,
  type BlogPatientStage,
  type BlogSearchIntent,
  type HealingMindsCategoryKey,
} from "../strategy/healing-minds";
import { buildTopicKey, hasCosmeticFreshness, hasRiskyListicleLanguage, hasUnsafeYmylTopic, normalizeTopicText, topicJaccardSimilarity } from "./topic-normalization";
import { scoreTopicCandidate, type TopicScoreBreakdown } from "./topic-scoring";
import { generateTopicCandidateBatch, type TopicInventorySnapshot, type TopicProposal } from "./topic-provider";
import { judgeTopicCandidates, type TopicJudgeDecision } from "./topic-judge";
import { persistBlogTopicCandidates, selectBlogTopicCandidate } from "../topic-candidate-storage";
import type { BlogResearchBrief, BlogSemanticMemory } from "./types";
import {
  containsLikelyPatientIdentifier,
  containsLikelyPatientIdentifierInAiFields,
} from "../privacy";
import {
  getRuntimeBlogResearchSourceIds,
  selectRuntimeBlogInternalLinks,
  selectRuntimeBlogResearchSources,
} from "../links/runtime";
import { snapshotPlannedLinkIds } from "./planned-topic-provenance";

type TopicPlannerInput = {
  language: BlogLanguage;
  categories: BlogCategory[];
  tags: BlogTag[];
  runId?: number;
};

type TopicMatch = {
  postId: number;
  title: string;
  slug: string;
  status: string;
  score: number;
  overlapTerms: string[];
};

export type BlogTopicPlanCandidate = {
  id: string;
  topicCandidateId?: number;
  candidateKey: string;
  batch: number;
  topic: string;
  targetKeyword: string;
  topicKey: string;
  language: BlogLanguage;
  categoryId: number;
  categoryKey: HealingMindsCategoryKey;
  categoryName: string;
  pillar: BlogContentPillar;
  patientStage: BlogPatientStage;
  contentFormat: BlogContentFormat;
  searchIntent: BlogSearchIntent;
  tagIds: number[];
  tagNames: string[];
  internalLinks: string[];
  internalLinkTargetIds: string[];
  sourceRecommendationIds: string[];
  score: number;
  scoreBreakdown: TopicScoreBreakdown;
  noveltyScore: number;
  overlapScore: number;
  recommendation: "recommended" | "change_angle" | "update_existing";
  semanticDecision: TopicJudgeDecision["decision"] | "judge_unavailable";
  semanticConfidenceBasisPoints: number;
  semanticMatchedPostId: number | null;
  semanticRationale: string;
  angle: string;
  rationale: string;
  whyTimely: string;
  riskNotes: string[];
  research: BlogResearchBrief;
  semanticMemory: BlogSemanticMemory;
  editorialBrief: ReturnType<typeof buildBlogEditorialBrief>;
  strategyVersion: typeof HEALING_MINDS_TOPIC_STRATEGY_VERSION;
  promptVersion: typeof HEALING_MINDS_TOPIC_PROMPT_VERSION;
  providerModel: string;
  judgeModel?: string;
};

export type BlogTopicPlan = {
  runId?: number;
  language: BlogLanguage;
  generatedAt: string;
  strategyVersion: string;
  promptVersion: string;
  selectedCandidateId?: string;
  candidates: BlogTopicPlanCandidate[];
  summary: {
    considered: number;
    returned: number;
    recommended: number;
    changeAngle: number;
    updateExisting: number;
    batches: number;
  };
};

function toCategoryMap(categories: BlogCategory[], language: BlogLanguage): Map<HealingMindsCategoryKey, BlogCategory> {
  const bySlug = new Map(categories.filter(item => item.language === language).map(item => [item.slug, item]));
  const result = new Map<HealingMindsCategoryKey, BlogCategory>();
  for (const strategyCategory of getHealingMindsCategories(language)) {
    const category = bySlug.get(strategyCategory.slug);
    if (category) result.set(strategyCategory.key, category);
  }
  return result;
}

function classifyPost(post: BlogPostWithRelations) {
  const contentSignals = [
    post.title,
    post.targetKeyword,
    post.tags.map(tag => `${tag.name} ${tag.slug}`).join(" "),
  ].filter(Boolean).join(" ");
  const contentCategoryKey = inferHealingMindsCategoryKey(contentSignals);
  const categoryKey = contentCategoryKey !== "psychiatric_guides"
    ? contentCategoryKey
    : post.category
      ? inferHealingMindsCategoryKey(`${post.category.slug} ${post.category.name} ${contentSignals}`)
      : contentCategoryKey;
  return {
    id: post.id,
    title: post.title,
    targetKeyword: post.targetKeyword,
    topicKey: post.topicKey,
    categoryKey,
    pillar: post.contentPillar,
    patientStage: post.patientStage,
    contentFormat: post.contentFormat,
    status: post.status,
  };
}

function getSafePostTitleForProvider(post: Pick<BlogPostWithRelations, "id">): string {
  return `Private post ${post.id}`;
}

function buildInventory(posts: BlogPostWithRelations[]): TopicInventorySnapshot {
  const classified = posts.map(classifyPost);
  const clusterCounts: Record<string, number> = {};
  for (const post of classified) {
    clusterCounts[post.categoryKey] = (clusterCounts[post.categoryKey] || 0) + 1;
  }
  return {
    posts: posts.map((post, index) => ({
      ...classified[index],
      title: getSafePostTitleForProvider(post),
      targetKeyword: null,
      topicKey: null,
    })),
    clusterCounts,
    recentCategoryKeys: classified.slice(0, 5).map(post => post.categoryKey),
    recentPillars: classified.slice(0, 5).map(post => post.pillar).filter((value): value is string => Boolean(value)),
    recentFormats: classified.slice(0, 5).map(post => post.contentFormat).filter((value): value is string => Boolean(value)),
  };
}

function findTopMatches(
  proposal: TopicProposal,
  posts: BlogPostWithRelations[],
): TopicMatch[] {
  const candidateText = `${proposal.topic} ${proposal.targetKeyword}`;
  return posts
    .map(post => {
      const postText = `${post.title} ${post.targetKeyword || ""}`;
      const overlap = topicJaccardSimilarity(candidateText, postText, proposal.language);
      return {
        postId: post.id,
        title: getSafePostTitleForProvider(post),
        slug: post.slug,
        status: post.status,
        score: overlap.score,
        overlapTerms: overlap.overlapTerms,
      };
    })
    .sort((a, b) => b.score - a.score || a.postId - b.postId)
    .slice(0, 3);
}

function deterministicStatus(input: {
  proposal: TopicProposal;
  topMatch?: TopicMatch;
  existingKeys: Set<string>;
  clusterCount: number;
  maximumClusterCount: number;
  batchDuplicate: boolean;
  extraListicle: boolean;
}): "eligible" | "existing_update" | "exact_duplicate" | "high_overlap" | "batch_duplicate" | "saturated" | "unsafe_pattern" {
  const topicKey = buildTopicKey(`${input.proposal.topic} ${input.proposal.targetKeyword}`, input.proposal.language);
  if (input.proposal.createOrUpdate === "update_existing") return "existing_update";
  if (input.existingKeys.has(topicKey)) return "exact_duplicate";
  if ((input.topMatch?.score || 0) >= BLOG_TOPIC_THRESHOLDS.hardDuplicateOverlap) return "high_overlap";
  if (input.batchDuplicate) return "batch_duplicate";
  if (
    input.extraListicle
    || hasCosmeticFreshness(input.proposal.topic)
    || hasUnsafeYmylTopic(
      `${input.proposal.topic} ${input.proposal.targetKeyword} ${input.proposal.expertiseAngle} ${input.proposal.whyTimely}`,
      input.proposal.language,
    )
    || [
      input.proposal.topic,
      input.proposal.targetKeyword,
      input.proposal.expertiseAngle,
      input.proposal.whyTimely,
    ].some(containsLikelyPatientIdentifier)
  ) return "unsafe_pattern";
  const saturated = input.maximumClusterCount >= BLOG_TOPIC_THRESHOLDS.saturationMinimumPosts
    && input.clusterCount >= input.maximumClusterCount
    && input.proposal.createOrUpdate === "create_new";
  if (saturated) return "saturated";
  return "eligible";
}

function semanticMemoryFromMatches(
  proposal: TopicProposal,
  matches: TopicMatch[],
  recommendation: BlogTopicPlanCandidate["recommendation"],
): BlogSemanticMemory {
  return {
    topic: proposal.topic,
    targetKeyword: proposal.targetKeyword,
    language: proposal.language,
    matches: matches
      .filter(match => match.score >= BLOG_TOPIC_THRESHOLDS.meaningfulOverlap)
      .map(match => ({
      postId: match.postId,
      title: match.title,
      slug: match.slug,
      language: proposal.language,
      status: match.status,
      score: match.score,
      overlapTerms: match.overlapTerms,
      recommendation: recommendation === "update_existing"
        ? "update_existing"
        : recommendation === "change_angle" ? "change_angle" : "create_new",
      })),
    recommendation: recommendation === "update_existing"
      ? "update_existing"
      : recommendation === "change_angle" ? "change_angle" : "create_new",
    riskNotes: recommendation === "recommended"
      ? []
      : ["Potential SEO overlap requires explicit editorial review before any new article is published."],
  };
}

async function evaluateBatch(input: {
  proposals: TopicProposal[];
  batch: 1 | 2;
  providerModel: string;
  language: BlogLanguage;
  posts: BlogPostWithRelations[];
  inventory: TopicInventorySnapshot;
  categories: Map<HealingMindsCategoryKey, BlogCategory>;
  tags: BlogTag[];
  allowedSourceIds: ReadonlySet<string>;
}): Promise<Array<{
  proposal: TopicProposal;
  candidate: BlogTopicPlanCandidate;
  deterministicStatus: string;
  matches: TopicMatch[];
}>> {
  const maximumClusterCount = Math.max(0, ...Object.values(input.inventory.clusterCounts));
  const existingKeys = new Set(input.posts.map(post => (
    post.topicKey || buildTopicKey(`${post.title} ${post.targetKeyword || ""}`, input.language)
  )));
  let listicleCount = 0;
  const preliminary = input.proposals.map((proposal, index) => {
    const matches = findTopMatches(proposal, input.posts);
    const riskyListicle = hasRiskyListicleLanguage(proposal.topic, input.language);
    if (riskyListicle) listicleCount += 1;
    const candidateText = `${proposal.topic} ${proposal.targetKeyword}`;
    const batchDuplicate = input.proposals.slice(0, index).some(previous => (
      topicJaccardSimilarity(
        candidateText,
        `${previous.topic} ${previous.targetKeyword}`,
        input.language,
      ).score >= BLOG_TOPIC_THRESHOLDS.hardDuplicateOverlap
    ));
    return {
      proposal,
      matches,
      deterministicStatus: deterministicStatus({
        proposal,
        topMatch: matches[0],
        existingKeys,
        clusterCount: input.inventory.clusterCounts[proposal.categoryKey] || 0,
        maximumClusterCount,
        batchDuplicate,
        extraListicle: riskyListicle && listicleCount > 1,
      }),
    };
  });

  const eligible = preliminary.filter(item => item.deterministicStatus === "eligible");
  let decisions = new Map<string, TopicJudgeDecision>();
  let judgeModel: string | undefined;
  let judgeUnavailable = false;
  if (eligible.length > 0) {
    try {
      const judged = await judgeTopicCandidates({
        language: input.language,
        existingPosts: input.posts.map(post => {
          return {
            postId: post.id,
            title: getSafePostTitleForProvider(post),
            targetKeyword: null,
            categoryKey: classifyPost(post).categoryKey,
          };
        }),
        candidates: eligible.map(item => ({
          candidateKey: item.proposal.candidateKey,
          topic: item.proposal.topic,
          targetKeyword: item.proposal.targetKeyword,
          expertiseAngle: item.proposal.expertiseAngle,
          topMatches: item.matches.map(match => ({
            postId: match.postId,
            title: match.title,
            scoreBasisPoints: Math.round(match.score * 10_000),
          })),
        })),
      });
      judgeModel = judged.model;
      decisions = new Map(judged.decisions.map(decision => [decision.candidateKey, decision]));
    } catch (error) {
      console.error("Topic semantic judge unavailable; applying conservative deterministic fallback:", error);
      judgeUnavailable = true;
    }
  }

  return Promise.all(preliminary.map(async item => {
    const category = input.categories.get(item.proposal.categoryKey);
    if (!category) {
      throw Object.assign(new Error(`Required category ${input.language}/${item.proposal.categoryKey} is missing; run db:push and the taxonomy seed.`), {
        statusCode: 409,
        code: "topic_taxonomy_incomplete",
      });
    }
    const decision = decisions.get(item.proposal.candidateKey);
    const overlapScore = item.matches[0]?.score || 0;
    const hardDuplicate = decision?.decision === "duplicate"
      && decision.confidenceBasisPoints >= BLOG_TOPIC_THRESHOLDS.semanticHardDuplicateConfidenceBasisPoints;
    const deterministicEligible = item.deterministicStatus === "eligible";
    const judgeFallbackEligible = judgeUnavailable
      && overlapScore < BLOG_TOPIC_THRESHOLDS.judgeFallbackMaximumOverlap;
    const semanticEligible = judgeUnavailable
      ? judgeFallbackEligible
      : decision?.decision === "distinct" || decision?.decision === "same_cluster_distinct_intent";
    const recommended = deterministicEligible && !hardDuplicate && semanticEligible;
    const recommendation: BlogTopicPlanCandidate["recommendation"] = recommended
      ? "recommended"
      : hardDuplicate
        || item.deterministicStatus === "existing_update"
        || item.deterministicStatus === "exact_duplicate"
        || item.deterministicStatus === "high_overlap"
        ? "update_existing"
        : "change_angle";
    const requestedSourceIds = item.proposal.sourceRecommendationIds.filter(id => input.allowedSourceIds.has(id));
    const research = await selectRuntimeBlogResearchSources({
      topic: item.proposal.topic,
      additionalContext: item.proposal.expertiseAngle,
      targetKeyword: item.proposal.targetKeyword,
      language: input.language,
      categoryName: category.name,
    }, requestedSourceIds);
    const sourceRecommendationIds = research.sources.map(source => source.id);
    const semanticMemory = semanticMemoryFromMatches(item.proposal, item.matches, recommendation);
    const tagIds = selectBlogTagIds({
      language: input.language,
      availableTags: input.tags,
      topic: item.proposal.topic,
      targetKeyword: item.proposal.targetKeyword,
      excerpt: item.proposal.expertiseAngle,
      categoryName: category.name,
    });
    const tagNames = input.tags.filter(tag => tagIds.includes(tag.id)).map(tag => tag.name);
    const internalLinkSelection = await selectRuntimeBlogInternalLinks({
      language: input.language,
      topic: item.proposal.topic,
      targetKeyword: item.proposal.targetKeyword,
      categoryName: category.name,
    });
    const internalLinks = internalLinkSelection.hrefs;
    const missingStages = BLOG_PATIENT_STAGES.filter(stage => (
      !input.inventory.posts.some(post => post.patientStage === stage)
    ));
    const scoreBreakdown = scoreTopicCandidate({
      overlapScore,
      clusterCount: input.inventory.clusterCounts[item.proposal.categoryKey] || 0,
      maxClusterCount: maximumClusterCount,
      pillar: item.proposal.pillar,
      recentCategoryKeys: input.inventory.recentCategoryKeys,
      categoryKey: item.proposal.categoryKey,
      recentPillars: input.inventory.recentPillars,
      recentFormats: input.inventory.recentFormats,
      patientStage: item.proposal.patientStage,
      missingStages,
      contentFormat: item.proposal.contentFormat,
      curatedSourceCount: Math.max(sourceRecommendationIds.length, research.sources.length),
      riskyListicle: hasRiskyListicleLanguage(item.proposal.topic, input.language),
    });
    const editorialBrief = buildBlogEditorialBrief({
      topic: item.proposal.topic,
      additionalContext: item.proposal.expertiseAngle,
      targetKeyword: item.proposal.targetKeyword,
      language: input.language,
      categoryName: category.name,
      tagNames,
      internalLinks,
      researchSources: research.sources,
      semanticMemory,
    });
    const rationale = recommended
      ? `${item.proposal.whyTimely} The topic passed deterministic overlap and semantic-intent review.`
      : hardDuplicate
        ? decision?.rationale || "The semantic judge identified the same reader question and intent."
        : `Candidate stopped by ${item.deterministicStatus.replace(/_/g, " ")} review.`;
    const topicKey = buildTopicKey(`${item.proposal.topic} ${item.proposal.targetKeyword}`, input.language);
    return {
      proposal: item.proposal,
      deterministicStatus: item.deterministicStatus,
      matches: item.matches,
      candidate: {
        id: item.proposal.candidateKey,
        candidateKey: item.proposal.candidateKey,
        batch: input.batch,
        topic: item.proposal.topic,
        targetKeyword: item.proposal.targetKeyword,
        topicKey,
        language: input.language,
        categoryId: category.id,
        categoryKey: item.proposal.categoryKey,
        categoryName: category.name,
        pillar: item.proposal.pillar,
        patientStage: item.proposal.patientStage,
        contentFormat: item.proposal.contentFormat,
        searchIntent: item.proposal.searchIntent,
        tagIds,
        tagNames,
        internalLinks,
        internalLinkTargetIds: internalLinkSelection.targetIds,
        sourceRecommendationIds,
        score: recommended ? scoreBreakdown.total : Math.min(scoreBreakdown.total, 49),
        scoreBreakdown,
        noveltyScore: Math.round((1 - overlapScore) * 100),
        overlapScore,
        recommendation,
        semanticDecision: decision?.decision || "judge_unavailable",
        semanticConfidenceBasisPoints: decision?.confidenceBasisPoints || 0,
        semanticMatchedPostId: decision?.matchedPostId || null,
        semanticRationale: decision?.rationale || (
          judgeUnavailable
            ? "Semantic judge unavailable; conservative deterministic fallback applied."
            : "Candidate was not eligible for semantic review."
        ),
        angle: item.proposal.expertiseAngle,
        rationale,
        whyTimely: item.proposal.whyTimely,
        riskNotes: [
          ...semanticMemory.riskNotes,
          ...research.riskNotes,
          ...internalLinkSelection.warnings,
          ...(judgeUnavailable ? ["Semantic judge was unavailable; only very-low-overlap deterministic candidates remain eligible."] : []),
        ],
        research,
        semanticMemory,
        editorialBrief,
        strategyVersion: HEALING_MINDS_TOPIC_STRATEGY_VERSION,
        promptVersion: HEALING_MINDS_TOPIC_PROMPT_VERSION,
        providerModel: input.providerModel,
        judgeModel,
      },
    };
  }));
}

function toPersistenceRows(
  runId: number,
  evaluated: Awaited<ReturnType<typeof evaluateBatch>>,
): InsertBlogTopicCandidate[] {
  return evaluated.map(item => {
    const linkIds = snapshotPlannedLinkIds(item.candidate);
    return {
    runId,
    batch: item.candidate.batch,
    candidateKey: item.candidate.candidateKey,
    topic: item.candidate.topic,
    targetKeyword: item.candidate.targetKeyword,
    language: item.candidate.language,
    categoryId: item.candidate.categoryId,
    categoryKey: item.candidate.categoryKey,
    pillar: item.candidate.pillar,
    patientStage: item.candidate.patientStage,
    contentFormat: item.candidate.contentFormat,
    searchIntent: item.candidate.searchIntent,
    expertiseAngle: item.candidate.angle,
    whyTimely: item.candidate.whyTimely,
    sourceRecommendationIds: linkIds.sourceRecommendationIds,
    internalLinkTargetIds: linkIds.internalLinkTargetIds,
    createOrUpdate: item.proposal.createOrUpdate,
    strategyVersion: item.candidate.strategyVersion,
    promptVersion: item.candidate.promptVersion,
    provider: "openai",
    model: item.candidate.providerModel,
    deterministicStatus: item.deterministicStatus,
    overlapBasisPoints: Math.round(item.candidate.overlapScore * 10_000),
    matchedPostIds: item.matches
      .filter(match => match.score >= BLOG_TOPIC_THRESHOLDS.meaningfulOverlap)
      .map(match => match.postId),
    semanticDecision: item.candidate.semanticDecision,
    semanticConfidenceBasisPoints: item.candidate.semanticConfidenceBasisPoints,
    semanticMatchedPostId: item.candidate.semanticMatchedPostId,
    semanticRationale: item.candidate.semanticRationale,
    judgeModel: item.candidate.judgeModel,
    score: item.candidate.score,
    scoreBreakdown: item.candidate.scoreBreakdown,
    recommendation: item.candidate.recommendation,
    };
  });
}

export async function buildBlogTopicPlan(input: TopicPlannerInput): Promise<BlogTopicPlan> {
  const categoryMap = toCategoryMap(input.categories, input.language);
  const requiredCategories = getHealingMindsCategories(input.language);
  if (categoryMap.size !== requiredCategories.length) {
    throw Object.assign(new Error(`Healing Minds ${input.language} taxonomy is incomplete. Run db:push and restart the app to seed all categories.`), {
      statusCode: 409,
      code: "topic_taxonomy_incomplete",
    });
  }
  const posts = (await getAdminBlogPosts({
    status: "all",
    language: input.language,
    limit: 200,
    offset: 0,
  })).filter(post => post.status !== "rejected");
  const inventory = buildInventory(posts);
  const sourceIds = await getRuntimeBlogResearchSourceIds();
  const allowedSourceIds = new Set(sourceIds);
  const categoryKeys = requiredCategories.map(category => category.key);
  const allEvaluated: Awaited<ReturnType<typeof evaluateBatch>> = [];
  const rejectionEvidence: Array<{ topic: string; reason: string }> = [];

  for (const batch of [1, 2] as const) {
    const generated = await generateTopicCandidateBatch({
      language: input.language,
      inventory,
      categoryKeys,
      sourceIds,
      batch,
      rejectionEvidence: batch === 2 ? rejectionEvidence : undefined,
    });
    const evaluated = await evaluateBatch({
      proposals: generated.candidates.map((candidate, index) => ({
        ...candidate,
        candidateKey: `b${batch}-${index + 1}-${normalizeTopicText(candidate.topic).replace(/\s+/g, "-")}`.slice(0, 120),
      })),
      batch,
      providerModel: generated.model,
      language: input.language,
      posts,
      inventory,
      categories: categoryMap,
      tags: input.tags.filter(tag => tag.language === input.language),
      allowedSourceIds,
    });
    allEvaluated.push(...evaluated);
    if (input.runId) {
      const persisted = await persistBlogTopicCandidates(toPersistenceRows(input.runId, evaluated));
      const persistedByKey = new Map(persisted.map(row => [row.candidateKey, row.id]));
      for (const item of evaluated) {
        item.candidate.topicCandidateId = persistedByKey.get(item.candidate.candidateKey);
      }
    }
    const recommended = allEvaluated.filter(item => item.candidate.recommendation === "recommended");
    if (recommended.length > 0) break;
    rejectionEvidence.push(...evaluated.map(item => ({
      topic: item.candidate.topic,
      reason: item.candidate.rationale,
    })));
  }

  const candidates = allEvaluated
    .map(item => item.candidate)
    .sort((a, b) => b.score - a.score || a.overlapScore - b.overlapScore || a.candidateKey.localeCompare(b.candidateKey));
  const selectedCandidate = candidates.find(candidate => candidate.recommendation === "recommended");
  if (!selectedCandidate) {
    throw Object.assign(new Error("No safe unique topic remained after two candidate batches."), {
      statusCode: 409,
      code: "no_safe_unique_topic",
      candidates,
    });
  }
  if (input.runId) {
    const selectedRow = await selectBlogTopicCandidate(input.runId, selectedCandidate.candidateKey);
    selectedCandidate.topicCandidateId = selectedRow.id;
  }
  const returned = candidates.slice(0, 10);
  return {
    runId: input.runId,
    language: input.language,
    generatedAt: new Date().toISOString(),
    strategyVersion: HEALING_MINDS_TOPIC_STRATEGY_VERSION,
    promptVersion: HEALING_MINDS_TOPIC_PROMPT_VERSION,
    selectedCandidateId: selectedCandidate.candidateKey,
    candidates: returned,
    summary: {
      considered: candidates.length,
      returned: returned.length,
      recommended: returned.filter(candidate => candidate.recommendation === "recommended").length,
      changeAngle: returned.filter(candidate => candidate.recommendation === "change_angle").length,
      updateExisting: returned.filter(candidate => candidate.recommendation === "update_existing").length,
      batches: Math.max(...returned.map(candidate => candidate.batch)),
    },
  };
}

export async function assertGuidedBlogTopicSafe(input: {
  topic: string;
  targetKeyword?: string;
  additionalContext?: string;
  language: BlogLanguage;
}): Promise<void> {
  if (
    hasUnsafeYmylTopic(
      `${input.topic} ${input.targetKeyword || ""} ${input.additionalContext || ""}`,
      input.language,
    )
    || containsLikelyPatientIdentifierInAiFields(input)
    || hasCosmeticFreshness(input.topic)
  ) {
    throw Object.assign(new Error("This guided topic does not pass the medical-safety or meaningful-uniqueness gate. The requested topic was not replaced."), {
      statusCode: 400,
      code: "guided_topic_unsafe",
    });
  }
  const posts = (await getAdminBlogPosts({
    status: "all",
    language: input.language,
    limit: 200,
    offset: 0,
  })).filter(post => post.status !== "rejected");
  const requestedCategoryKey = inferHealingMindsCategoryKey(`${input.topic} ${input.targetKeyword || ""}`);
  const clusterCounts = posts.reduce<Record<string, number>>((counts, post) => {
    const key = classifyPost(post).categoryKey;
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
  const maxClusterCount = Math.max(0, ...Object.values(clusterCounts));
  if (
    maxClusterCount >= BLOG_TOPIC_THRESHOLDS.saturationMinimumPosts
    && (clusterCounts[requestedCategoryKey] || 0) >= maxClusterCount
  ) {
    throw Object.assign(new Error("This topic belongs to the most saturated content cluster. Choose a meaningfully different category or update an existing article."), {
      statusCode: 409,
      code: "guided_topic_cluster_saturated",
    });
  }
  const candidateText = `${input.topic} ${input.targetKeyword || ""}`;
  const matches = posts
    .map(post => {
      const overlap = topicJaccardSimilarity(
        candidateText,
        `${post.title} ${post.targetKeyword || ""}`,
        input.language,
      );
      return {
        postId: post.id,
        title: getSafePostTitleForProvider(post),
        slug: post.slug,
        score: overlap.score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  const top = matches[0];
  if (top && top.score >= BLOG_TOPIC_THRESHOLDS.hardDuplicateOverlap) {
    throw Object.assign(new Error(`This topic overlaps too strongly with “${top.title}”. Review that post instead of creating a competing draft.`), {
      statusCode: 409,
      code: "guided_topic_duplicate",
      matchedPostId: top.postId,
      overlapBasisPoints: Math.round(top.score * 10_000),
      semanticReason: "Deterministic topic overlap exceeded the hard duplicate threshold.",
    });
  }
  try {
    const judged = await judgeTopicCandidates({
      language: input.language,
      existingPosts: posts.map(post => {
        return {
          postId: post.id,
          title: getSafePostTitleForProvider(post),
          targetKeyword: null,
          categoryKey: classifyPost(post).categoryKey,
        };
      }),
      candidates: [{
        candidateKey: "guided-topic",
        topic: input.topic,
        targetKeyword: input.targetKeyword || input.topic,
        expertiseAngle: "Use the exact user-selected topic; judge intent overlap only.",
        topMatches: matches.map(match => ({
          postId: match.postId,
          title: match.title,
          scoreBasisPoints: Math.round(match.score * 10_000),
        })),
      }],
    });
    const decision = judged.decisions[0];
    if (
      decision?.decision === "duplicate"
      && decision.confidenceBasisPoints >= BLOG_TOPIC_THRESHOLDS.semanticHardDuplicateConfidenceBasisPoints
    ) {
      const matched = posts.find(post => post.id === decision.matchedPostId) || posts.find(post => post.id === top?.postId);
      throw Object.assign(new Error(
        matched
          ? `This topic answers the same reader question as “${matched.title}”. The requested topic was not replaced.`
          : "This topic duplicates an existing reader question. The requested topic was not replaced.",
      ), {
        statusCode: 409,
        code: "guided_topic_duplicate",
        matchedPostId: matched?.id || decision.matchedPostId,
        semanticConfidenceBasisPoints: decision.confidenceBasisPoints,
        semanticReason: decision.rationale,
      });
    }
  } catch (error) {
    if ((error as { code?: string }).code === "guided_topic_duplicate") throw error;
    if ((top?.score || 0) >= BLOG_TOPIC_THRESHOLDS.judgeFallbackMaximumOverlap) {
      throw Object.assign(new Error("The semantic topic review is unavailable and deterministic overlap is not low enough to continue safely."), {
        statusCode: 503,
        code: "guided_topic_review_unavailable",
      });
    }
  }
}
