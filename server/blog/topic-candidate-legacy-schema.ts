import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import type { InsertBlogTopicCandidate } from "@shared/schema";

/**
 * Code-first view of blog_topic_candidates before Sprint 19.
 *
 * Drizzle emits defaults for every column defined on an insert table, even
 * when a property is omitted from the values object. Keeping this definition
 * physically free of Sprint 19 columns lets a flag-off deployment boot and
 * keep using the Sprint 18 schema before db:push is run.
 */
export const legacyBlogTopicCandidates = pgTable("blog_topic_candidates", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  runId: integer("run_id").notNull(),
  batch: integer("batch").notNull(),
  candidateKey: varchar("candidate_key", { length: 120 }).notNull(),
  topic: varchar("topic", { length: 180 }).notNull(),
  targetKeyword: varchar("target_keyword", { length: 120 }).notNull(),
  language: varchar("language", { length: 5 }).notNull(),
  categoryId: integer("category_id").notNull(),
  categoryKey: varchar("category_key", { length: 80 }).notNull(),
  pillar: varchar("pillar", { length: 80 }).notNull(),
  patientStage: varchar("patient_stage", { length: 80 }).notNull(),
  contentFormat: varchar("content_format", { length: 80 }).notNull(),
  searchIntent: varchar("search_intent", { length: 80 }).notNull(),
  expertiseAngle: text("expertise_angle").notNull(),
  whyTimely: text("why_timely").notNull(),
  sourceRecommendationIds: jsonb("source_recommendation_ids").$type<string[]>().notNull(),
  createOrUpdate: varchar("create_or_update", { length: 30 }).notNull(),
  strategyVersion: varchar("strategy_version", { length: 100 }).notNull(),
  promptVersion: varchar("prompt_version", { length: 100 }).notNull(),
  provider: varchar("provider", { length: 50 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  deterministicStatus: varchar("deterministic_status", { length: 50 }).notNull(),
  overlapBasisPoints: integer("overlap_basis_points").notNull().default(0),
  matchedPostIds: jsonb("matched_post_ids").$type<number[]>().notNull(),
  semanticDecision: varchar("semantic_decision", { length: 50 }),
  semanticConfidenceBasisPoints: integer("semantic_confidence_basis_points"),
  semanticMatchedPostId: integer("semantic_matched_post_id"),
  semanticRationale: text("semantic_rationale"),
  judgeModel: varchar("judge_model", { length: 100 }),
  score: integer("score").notNull().default(0),
  scoreBreakdown: jsonb("score_breakdown").$type<Record<string, unknown>>().notNull(),
  recommendation: varchar("recommendation", { length: 50 }).notNull(),
  selected: boolean("selected").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type LegacyBlogTopicCandidate = typeof legacyBlogTopicCandidates.$inferSelect;
export type InsertLegacyBlogTopicCandidate = typeof legacyBlogTopicCandidates.$inferInsert;

export function toLegacyBlogTopicCandidateInsert(
  value: InsertBlogTopicCandidate,
): InsertLegacyBlogTopicCandidate {
  const {
    internalLinkTargetIds: _internalLinkTargetIds,
    ...legacyValue
  } = value;
  return legacyValue;
}
