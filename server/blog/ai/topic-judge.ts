import { z } from "zod";
import { createStructuredResponse } from "./responses-client";

const judgeDecisionSchema = z.object({
  candidateKey: z.string(),
  decision: z.enum(["duplicate", "same_cluster_distinct_intent", "distinct"]),
  confidenceBasisPoints: z.number().int().min(0).max(10000),
  matchedPostId: z.number().int().positive().nullable(),
  rationale: z.string().min(3).max(500),
});

const judgeBatchSchema = z.object({
  decisions: z.array(judgeDecisionSchema),
});

export type TopicJudgeDecision = z.infer<typeof judgeDecisionSchema>;

export function assertCompleteTopicJudgeDecisionSet(
  requestedCandidateKeys: string[],
  decisions: TopicJudgeDecision[],
): void {
  const requested = new Set(requestedCandidateKeys);
  const received = new Set(decisions.map(decision => decision.candidateKey));
  if (decisions.length !== requested.size
    || received.size !== requested.size
    || Array.from(requested).some(candidateKey => !received.has(candidateKey))
    || decisions.some(decision => !requested.has(decision.candidateKey))) {
    throw Object.assign(new Error("Semantic judge returned incomplete candidate decisions"), {
      statusCode: 502,
      code: "topic_judge_incomplete",
    });
  }
}

export function assertValidTopicJudgeMatches(
  existingPostIds: number[],
  decisions: TopicJudgeDecision[],
): void {
  const allowed = new Set(existingPostIds);
  const invalid = decisions.some(decision => (
    (decision.matchedPostId !== null && !allowed.has(decision.matchedPostId))
    || (decision.decision === "duplicate" && decision.matchedPostId === null)
  ));
  if (invalid) {
    throw Object.assign(new Error("Semantic judge returned an invalid matched post"), {
      statusCode: 502,
      code: "topic_judge_invalid_match",
    });
  }
}

const JUDGE_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["decisions"],
  properties: {
    decisions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["candidateKey", "decision", "confidenceBasisPoints", "matchedPostId", "rationale"],
        properties: {
          candidateKey: { type: "string" },
          decision: { type: "string", enum: ["duplicate", "same_cluster_distinct_intent", "distinct"] },
          confidenceBasisPoints: { type: "integer", minimum: 0, maximum: 10000 },
          matchedPostId: { anyOf: [{ type: "integer", minimum: 1 }, { type: "null" }] },
          rationale: { type: "string", minLength: 3, maxLength: 500 },
        },
      },
    },
  },
};

export async function judgeTopicCandidates(input: {
  language: "en" | "es";
  existingPosts: Array<{
    postId: number;
    title: string;
    targetKeyword?: string | null;
    categoryKey: string;
  }>;
  candidates: Array<{
    candidateKey: string;
    topic: string;
    targetKeyword: string;
    expertiseAngle: string;
    topMatches: Array<{ postId: number; title: string; scoreBasisPoints: number }>;
  }>;
}): Promise<{ decisions: TopicJudgeDecision[]; model: string; durationMs: number }> {
  const call = async () => createStructuredResponse({
    role: "judge",
    system: [
      "You are a conservative SEO cannibalization judge for a medical psychiatry blog.",
      "Compare every candidate against the complete supplied safe existing-post inventory, not only lexical top matches. Do not add medical claims.",
      "duplicate means substantially the same reader question and intent, not merely the same condition.",
      "same_cluster_distinct_intent means the condition overlaps but the patient question and useful outcome differ.",
      "distinct means no material competition. Return one decision for every candidate key.",
    ].join(" "),
    user: input,
    format: { name: "healing_minds_topic_judgments", schema: JUDGE_JSON_SCHEMA },
  });

  let response: Awaited<ReturnType<typeof call>>;
  try {
    response = await call();
  } catch (error) {
    if (!(error as { retryable?: boolean }).retryable) throw error;
    response = await call();
  }
  const parsed = judgeBatchSchema.parse(response.data);
  assertCompleteTopicJudgeDecisionSet(
    input.candidates.map(candidate => candidate.candidateKey),
    parsed.decisions,
  );
  assertValidTopicJudgeMatches(
    input.existingPosts.map(post => post.postId),
    parsed.decisions,
  );
  return { decisions: parsed.decisions, model: response.model, durationMs: response.durationMs };
}
