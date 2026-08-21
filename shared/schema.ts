import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  preferredLanguage: text("preferred_language").notNull().default("english"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogPostStatusEnum = pgEnum("blog_post_status", [
  "draft",
  "pending_review",
  "published",
  "rejected",
]);

export const blogGenerationRunStatusEnum = pgEnum("blog_generation_run_status", [
  "planning",
  "queued",
  "running",
  "completed",
  "failed",
  "interrupted",
]);

export const blogPostImageRoleEnum = pgEnum("blog_post_image_role", [
  "hero",
  "inline",
]);

export const blogPostImageSourceEnum = pgEnum("blog_post_image_source", [
  "curated",
  "ai",
]);

export const blogPostImageGenerationStatusEnum = pgEnum("blog_post_image_generation_status", [
  "pending",
  "generating",
  "completed",
  "failed",
]);

export const blogImageGenerationJobStatusEnum = pgEnum("blog_image_generation_job_status", [
  "admitting",
  "queued",
  "running",
  "completed",
  "partial_failed",
  "failed",
]);

export const blogImageGenerationOperationEnum = pgEnum("blog_image_generation_operation", [
  "generate_set",
  "regenerate_variant",
]);

export const blogPostImageReviewStatusEnum = pgEnum("blog_post_image_review_status", [
  "candidate",
  "selected",
  "rejected",
]);

export const blogLinkKindEnum = pgEnum("blog_link_kind", [
  "internal",
  "external",
]);

export const blogLinkReviewStatusEnum = pgEnum("blog_link_review_status", [
  "pending",
  "approved",
  "blocked",
  "retired",
]);

export const blogLinkHealthStatusEnum = pgEnum("blog_link_health_status", [
  "unchecked",
  "healthy",
  "redirected",
  "unreachable",
  "broken",
  "changed_review_needed",
  "stale",
]);

export const blogLinkOriginEnum = pgEnum("blog_link_origin", [
  "seed",
  "manual",
  "ai",
  "backfill",
]);

export const blogLinkUsageOriginEnum = pgEnum("blog_link_usage_origin", [
  "ai",
  "manual",
  "backfill",
  "server_fix",
]);

export const blogLinkAuditStatusEnum = pgEnum("blog_link_audit_status", [
  "queued",
  "running",
  "completed",
  "failed",
  "interrupted",
]);

export const blogLinkSourceTypeEnum = pgEnum("blog_link_source_type", [
  "first_party",
  "government",
  "professional_guideline",
  "academic",
  "health_system",
  "crisis",
  "other",
]);

export const blogAuthors = pgTable("blog_authors", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }),
  bio: text("bio"),
  imageUrl: varchar("image_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogCategories = pgTable(
  "blog_categories",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull(),
    language: varchar("language", { length: 5 }).notNull().default("en"),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("idx_blog_categories_language_slug").on(table.language, table.slug),
  ],
);

export const blogTags = pgTable(
  "blog_tags",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull(),
    language: varchar("language", { length: 5 }).notNull().default("en"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("idx_blog_tags_language_slug").on(table.language, table.slug),
  ],
);

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    language: varchar("language", { length: 5 }).notNull().default("en"),
    translationGroupId: uuid("translation_group_id").notNull().defaultRandom(),
    excerpt: text("excerpt"),
    content: text("content"),
    featuredImage: varchar("featured_image", { length: 500 }),
    featuredImageAlt: varchar("featured_image_alt", { length: 255 }),
    authorId: integer("author_id").references(() => blogAuthors.id, { onDelete: "set null" }),
    categoryId: integer("category_id").references(() => blogCategories.id, { onDelete: "set null" }),
    status: blogPostStatusEnum("status").notNull().default("draft"),
    isFeatured: boolean("is_featured").notNull().default(false),
    metaTitle: varchar("meta_title", { length: 70 }),
    metaDescription: varchar("meta_description", { length: 160 }),
    readingTime: integer("reading_time"),
    topicCandidateId: integer("topic_candidate_id").references(
      (): AnyPgColumn => blogTopicCandidates.id,
      { onDelete: "set null" },
    ),
    topicKey: varchar("topic_key", { length: 180 }),
    targetKeyword: varchar("target_keyword", { length: 120 }),
    contentPillar: varchar("content_pillar", { length: 80 }),
    patientStage: varchar("patient_stage", { length: 80 }),
    contentFormat: varchar("content_format", { length: 80 }),
    searchIntent: varchar("search_intent", { length: 80 }),
    expertiseAngle: text("expertise_angle"),
    topicStrategyVersion: varchar("topic_strategy_version", { length: 100 }),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("idx_blog_posts_language_slug").on(table.language, table.slug),
    index("idx_blog_posts_status").on(table.status),
    index("idx_blog_posts_published_at").on(table.publishedAt),
    index("idx_blog_posts_category_id").on(table.categoryId),
    index("idx_blog_posts_topic_key").on(table.language, table.topicKey),
    index("idx_blog_posts_topic_strategy").on(table.language, table.contentPillar, table.patientStage),
    uniqueIndex("idx_blog_posts_translation_group_language").on(table.translationGroupId, table.language),
  ],
);

export const blogPostTags = pgTable(
  "blog_post_tags",
  {
    postId: integer("post_id").references(() => blogPosts.id, { onDelete: "cascade" }).notNull(),
    tagId: integer("tag_id").references(() => blogTags.id, { onDelete: "cascade" }).notNull(),
    position: integer("position").default(0).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.postId, table.tagId] }),
  ],
);

export const blogGenerationRuns = pgTable(
  "blog_generation_runs",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    idempotencyKey: varchar("idempotency_key", { length: 255 }).notNull(),
    status: blogGenerationRunStatusEnum("status").notNull().default("planning"),
    input: jsonb("input").$type<Record<string, unknown>>().notNull(),
    workflow: jsonb("workflow").$type<Record<string, unknown>>(),
    result: jsonb("result").$type<Record<string, unknown>>(),
    postId: integer("post_id").references(() => blogPosts.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    startedAt: timestamp("started_at"),
    completedAt: timestamp("completed_at"),
    heartbeatAt: timestamp("heartbeat_at"),
  },
  (table) => [
    uniqueIndex("idx_blog_generation_runs_idempotency_key").on(table.idempotencyKey),
    uniqueIndex("idx_blog_generation_runs_single_open")
      .on(sql`(1)`)
      .where(sql`${table.status} in ('planning', 'queued', 'running')`),
    index("idx_blog_generation_runs_status_heartbeat").on(table.status, table.heartbeatAt),
  ],
);

export const blogGenerationEvents = pgTable(
  "blog_generation_events",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    runId: integer("run_id").references(() => blogGenerationRuns.id, { onDelete: "cascade" }).notNull(),
    eventType: varchar("event_type", { length: 100 }).notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_blog_generation_events_run_id_id").on(table.runId, table.id),
  ],
);

export const blogTopicCandidates = pgTable(
  "blog_topic_candidates",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    runId: integer("run_id").references(() => blogGenerationRuns.id, { onDelete: "cascade" }).notNull(),
    batch: integer("batch").notNull(),
    candidateKey: varchar("candidate_key", { length: 120 }).notNull(),
    topic: varchar("topic", { length: 180 }).notNull(),
    targetKeyword: varchar("target_keyword", { length: 120 }).notNull(),
    language: varchar("language", { length: 5 }).notNull(),
    categoryId: integer("category_id").references(() => blogCategories.id, { onDelete: "restrict" }).notNull(),
    categoryKey: varchar("category_key", { length: 80 }).notNull(),
    pillar: varchar("pillar", { length: 80 }).notNull(),
    patientStage: varchar("patient_stage", { length: 80 }).notNull(),
    contentFormat: varchar("content_format", { length: 80 }).notNull(),
    searchIntent: varchar("search_intent", { length: 80 }).notNull(),
    expertiseAngle: text("expertise_angle").notNull(),
    whyTimely: text("why_timely").notNull(),
    sourceRecommendationIds: jsonb("source_recommendation_ids").$type<string[]>().notNull(),
    internalLinkTargetIds: jsonb("internal_link_target_ids").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
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
    semanticMatchedPostId: integer("semantic_matched_post_id").references(() => blogPosts.id, { onDelete: "set null" }),
    semanticRationale: text("semantic_rationale"),
    judgeModel: varchar("judge_model", { length: 100 }),
    score: integer("score").notNull().default(0),
    scoreBreakdown: jsonb("score_breakdown").$type<Record<string, unknown>>().notNull(),
    recommendation: varchar("recommendation", { length: 50 }).notNull(),
    selected: boolean("selected").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("idx_blog_topic_candidates_run_key").on(table.runId, table.candidateKey),
    index("idx_blog_topic_candidates_run_batch").on(table.runId, table.batch),
    index("idx_blog_topic_candidates_strategy").on(table.language, table.categoryKey, table.pillar),
    uniqueIndex("idx_blog_topic_candidates_single_selected")
      .on(table.runId)
      .where(sql`${table.selected} = true`),
  ],
);

export const blogImageGenerationJobs = pgTable(
  "blog_image_generation_jobs",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    postId: integer("post_id").references(() => blogPosts.id, { onDelete: "cascade" }).notNull(),
    idempotencyKey: varchar("idempotency_key", { length: 255 }).notNull(),
    status: blogImageGenerationJobStatusEnum("status").notNull().default("admitting"),
    operation: blogImageGenerationOperationEnum("operation").notNull(),
    role: varchar("role", { length: 20 }).notNull(),
    maxInline: integer("max_inline").notNull().default(2),
    sourceImageId: integer("source_image_id").references(
      (): AnyPgColumn => blogPostImages.id,
      { onDelete: "set null" },
    ),
    result: jsonb("result").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    startedAt: timestamp("started_at"),
    completedAt: timestamp("completed_at"),
    heartbeatAt: timestamp("heartbeat_at"),
  },
  (table) => [
    check("blog_image_generation_jobs_role_check", sql`${table.role} in ('hero', 'inline', 'all')`),
    check("blog_image_generation_jobs_max_inline_check", sql`${table.maxInline} between 1 and 2`),
    uniqueIndex("idx_blog_image_generation_jobs_idempotency_key").on(table.idempotencyKey),
    uniqueIndex("idx_blog_image_generation_jobs_single_open_post")
      .on(table.postId)
      .where(sql`${table.status} in ('admitting', 'queued', 'running')`),
    index("idx_blog_image_generation_jobs_status_heartbeat").on(table.status, table.heartbeatAt),
  ],
);

export const blogPostImages = pgTable(
  "blog_post_images",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    postId: integer("post_id").references(() => blogPosts.id, { onDelete: "cascade" }).notNull(),
    role: blogPostImageRoleEnum("role").notNull(),
    slot: varchar("slot", { length: 100 }).notNull(),
    anchorHeading: varchar("anchor_heading", { length: 255 }),
    source: blogPostImageSourceEnum("source").notNull(),
    generationStatus: blogPostImageGenerationStatusEnum("generation_status").notNull().default("pending"),
    reviewStatus: blogPostImageReviewStatusEnum("review_status").notNull().default("candidate"),
    objectKey: varchar("object_key", { length: 500 }),
    publicUrl: varchar("public_url", { length: 500 }),
    mimeType: varchar("mime_type", { length: 100 }),
    width: integer("width"),
    height: integer("height"),
    bytes: integer("bytes"),
    checksum: varchar("checksum", { length: 64 }),
    alt: varchar("alt", { length: 255 }),
    caption: varchar("caption", { length: 500 }),
    safeVisualBrief: text("safe_visual_brief"),
    prompt: text("prompt"),
    promptVersion: varchar("prompt_version", { length: 50 }),
    provider: varchar("provider", { length: 100 }),
    model: varchar("model", { length: 100 }),
    generationRunId: integer("generation_run_id").references(() => blogGenerationRuns.id, { onDelete: "set null" }),
    imageJobId: integer("image_job_id").references(() => blogImageGenerationJobs.id, { onDelete: "set null" }),
    startedAt: timestamp("started_at"),
    completedAt: timestamp("completed_at"),
    durationMs: integer("duration_ms"),
    errorCode: varchar("error_code", { length: 100 }),
    errorMessage: text("error_message"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_blog_post_images_post_slot").on(table.postId, table.slot),
    index("idx_blog_post_images_generation_run").on(table.generationRunId),
    index("idx_blog_post_images_image_job").on(table.imageJobId),
    uniqueIndex("idx_blog_post_images_image_job_slot")
      .on(table.imageJobId, table.slot)
      .where(sql`${table.imageJobId} is not null`),
    uniqueIndex("idx_blog_post_images_object_key")
      .on(table.objectKey)
      .where(sql`${table.objectKey} is not null`),
    uniqueIndex("idx_blog_post_images_single_selected_slot")
      .on(table.postId, table.slot)
      .where(sql`${table.reviewStatus} = 'selected'`),
  ],
);

export const blogImageCleanupQueue = pgTable(
  "blog_image_cleanup_queue",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    objectKey: varchar("object_key", { length: 500 }).notNull(),
    attempts: integer("attempts").notNull().default(0),
    lastError: text("last_error"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("idx_blog_image_cleanup_queue_object_key").on(table.objectKey),
    index("idx_blog_image_cleanup_queue_updated_at").on(table.updatedAt),
  ],
);

export const blogRedirects = pgTable(
  "blog_redirects",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    sourcePath: varchar("source_path", { length: 500 }).notNull(),
    targetPath: varchar("target_path", { length: 500 }).notNull(),
    statusCode: integer("status_code").notNull().default(301),
    reason: varchar("reason", { length: 100 }),
    isActive: boolean("is_active").notNull().default(true),
    sourcePostId: integer("source_post_id").references(() => blogPosts.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("idx_blog_redirects_source_path").on(table.sourcePath),
    index("idx_blog_redirects_active").on(table.isActive),
    index("idx_blog_redirects_source_post_id").on(table.sourcePostId),
  ],
);

export const blogLinkSources = pgTable(
  "blog_link_sources",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    stableKey: varchar("stable_key", { length: 120 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    canonicalDomain: varchar("canonical_domain", { length: 255 }).notNull(),
    sourceType: blogLinkSourceTypeEnum("source_type").notNull(),
    languages: jsonb("languages").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    reviewStatus: blogLinkReviewStatusEnum("review_status").notNull().default("pending"),
    reviewedBy: varchar("reviewed_by", { length: 255 }),
    reviewedAt: timestamp("reviewed_at"),
    reviewNotes: text("review_notes"),
    qualityScore: integer("quality_score").notNull().default(0),
    qualityBreakdown: jsonb("quality_breakdown").$type<Record<string, number>>().notNull().default(sql`'{}'::jsonb`),
    scoreVersion: varchar("score_version", { length: 100 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("idx_blog_link_sources_stable_key").on(table.stableKey),
    uniqueIndex("idx_blog_link_sources_canonical_domain").on(table.canonicalDomain),
    index("idx_blog_link_sources_review_type").on(table.reviewStatus, table.sourceType),
    check("chk_blog_link_sources_languages_array", sql`jsonb_typeof(${table.languages}) = 'array'`),
    check("chk_blog_link_sources_quality_score", sql`${table.qualityScore} between 0 and 100`),
    check("chk_blog_link_sources_quality_breakdown_object", sql`jsonb_typeof(${table.qualityBreakdown}) = 'object'`),
  ],
);

export const blogLinks = pgTable(
  "blog_links",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    stableKey: varchar("stable_key", { length: 120 }),
    sourceId: integer("source_id").references(() => blogLinkSources.id, { onDelete: "restrict" }),
    kind: blogLinkKindEnum("kind").notNull(),
    normalizedHref: text("normalized_href").notNull(),
    canonicalKey: varchar("canonical_key", { length: 64 }).notNull(),
    displayHref: text("display_href").notNull(),
    host: varchar("host", { length: 255 }),
    title: varchar("title", { length: 255 }).notNull(),
    label: varchar("label", { length: 255 }).notNull(),
    language: varchar("language", { length: 5 }).notNull().default("all"),
    sourceCategory: varchar("source_category", { length: 100 }),
    topicTags: jsonb("topic_tags").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    categoryKeys: jsonb("category_keys").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    contentPillars: jsonb("content_pillars").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    keywords: jsonb("keywords").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    summary: text("summary"),
    evidenceType: varchar("evidence_type", { length: 100 }),
    evidenceScope: text("evidence_scope"),
    evidenceScore: integer("evidence_score").notNull().default(0),
    freshnessScore: integer("freshness_score").notNull().default(0),
    reviewStatus: blogLinkReviewStatusEnum("review_status").notNull().default("pending"),
    reviewedBy: varchar("reviewed_by", { length: 255 }),
    reviewedAt: timestamp("reviewed_at"),
    reviewNotes: text("review_notes"),
    generationEligible: boolean("generation_eligible").notNull().default(false),
    healthStatus: blogLinkHealthStatusEnum("health_status").notNull().default("unchecked"),
    httpStatus: integer("http_status"),
    finalHref: text("final_href"),
    redirectCount: integer("redirect_count").notNull().default(0),
    consecutiveFailures: integer("consecutive_failures").notNull().default(0),
    lastCheckedAt: timestamp("last_checked_at"),
    lastSuccessfulAt: timestamp("last_successful_at"),
    nextCheckAt: timestamp("next_check_at"),
    lastErrorCode: varchar("last_error_code", { length: 100 }),
    scoreBreakdown: jsonb("score_breakdown").$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
    scoreVersion: varchar("score_version", { length: 100 }).notNull(),
    origin: blogLinkOriginEnum("origin").notNull(),
    targetPostId: integer("target_post_id").references(() => blogPosts.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("idx_blog_links_stable_key")
      .on(table.stableKey)
      .where(sql`${table.stableKey} is not null`),
    uniqueIndex("idx_blog_links_canonical_key").on(table.canonicalKey),
    index("idx_blog_links_library_filters").on(table.kind, table.language, table.reviewStatus, table.healthStatus),
    index("idx_blog_links_generation_eligible").on(table.generationEligible, table.reviewStatus, table.healthStatus),
    index("idx_blog_links_source_id").on(table.sourceId),
    index("idx_blog_links_target_post_id").on(table.targetPostId),
    check("chk_blog_links_language", sql`${table.language} in ('en', 'es', 'all')`),
    check("chk_blog_links_topic_tags_array", sql`jsonb_typeof(${table.topicTags}) = 'array'`),
    check("chk_blog_links_category_keys_array", sql`jsonb_typeof(${table.categoryKeys}) = 'array'`),
    check("chk_blog_links_content_pillars_array", sql`jsonb_typeof(${table.contentPillars}) = 'array'`),
    check("chk_blog_links_keywords_array", sql`jsonb_typeof(${table.keywords}) = 'array'`),
    check("chk_blog_links_evidence_score", sql`${table.evidenceScore} between 0 and 100`),
    check("chk_blog_links_freshness_score", sql`${table.freshnessScore} between 0 and 100`),
    check("chk_blog_links_http_status", sql`${table.httpStatus} is null or ${table.httpStatus} between 100 and 599`),
    check("chk_blog_links_redirect_count", sql`${table.redirectCount} >= 0`),
    check("chk_blog_links_consecutive_failures", sql`${table.consecutiveFailures} >= 0`),
    check("chk_blog_links_score_breakdown_object", sql`jsonb_typeof(${table.scoreBreakdown}) = 'object'`),
  ],
);

export const blogPostLinks = pgTable(
  "blog_post_links",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    postId: integer("post_id").references(() => blogPosts.id, { onDelete: "cascade" }).notNull(),
    linkId: integer("link_id").references(() => blogLinks.id, { onDelete: "restrict" }).notNull(),
    generationRunId: integer("generation_run_id").references(() => blogGenerationRuns.id, { onDelete: "set null" }),
    occurrenceKey: varchar("occurrence_key", { length: 64 }).notNull(),
    ordinal: integer("ordinal").notNull(),
    rawHref: text("raw_href").notNull(),
    normalizedHref: text("normalized_href").notNull(),
    anchorText: text("anchor_text").notNull(),
    sectionHeading: text("section_heading"),
    rel: varchar("rel", { length: 255 }),
    target: varchar("target", { length: 50 }),
    claimClass: varchar("claim_class", { length: 100 }),
    origin: blogLinkUsageOriginEnum("origin").notNull(),
    postContentChecksum: varchar("post_content_checksum", { length: 64 }).notNull(),
    firstSeenAt: timestamp("first_seen_at").defaultNow().notNull(),
    lastSeenAt: timestamp("last_seen_at").defaultNow().notNull(),
    removedAt: timestamp("removed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("idx_blog_post_links_occurrence").on(table.postId, table.occurrenceKey),
    index("idx_blog_post_links_current_by_link").on(table.linkId, table.removedAt),
    index("idx_blog_post_links_current_by_post").on(table.postId, table.removedAt),
    index("idx_blog_post_links_generation_run").on(table.generationRunId),
    check("chk_blog_post_links_ordinal", sql`${table.ordinal} >= 0`),
  ],
);

export const blogLinkAuditRuns = pgTable(
  "blog_link_audit_runs",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    idempotencyKey: varchar("idempotency_key", { length: 255 }).notNull(),
    status: blogLinkAuditStatusEnum("status").notNull().default("queued"),
    input: jsonb("input").$type<Record<string, unknown>>().notNull(),
    result: jsonb("result").$type<Record<string, unknown>>(),
    requestedBy: varchar("requested_by", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    startedAt: timestamp("started_at"),
    completedAt: timestamp("completed_at"),
    heartbeatAt: timestamp("heartbeat_at"),
    leaseToken: varchar("lease_token", { length: 64 }),
    leaseEpoch: integer("lease_epoch").notNull().default(0),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("idx_blog_link_audit_runs_idempotency_key").on(table.idempotencyKey),
    uniqueIndex("idx_blog_link_audit_runs_single_open")
      .on(sql`(1)`)
      .where(sql`${table.status} in ('queued', 'running')`),
    index("idx_blog_link_audit_runs_status_heartbeat").on(table.status, table.heartbeatAt),
    check("chk_blog_link_audit_runs_input_object", sql`jsonb_typeof(${table.input}) = 'object'`),
    check("chk_blog_link_audit_runs_result_object", sql`${table.result} is null or jsonb_typeof(${table.result}) = 'object'`),
    check("chk_blog_link_audit_runs_lease_epoch", sql`${table.leaseEpoch} >= 0`),
    check(
      "chk_blog_link_audit_runs_active_lease",
      sql`(
        (${table.status} = 'running' and ${table.leaseToken} is not null)
        or (${table.status} <> 'running' and ${table.leaseToken} is null)
      )`,
    ),
  ],
);

export const blogLinkChecks = pgTable(
  "blog_link_checks",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    runId: integer("run_id").references(() => blogLinkAuditRuns.id, { onDelete: "set null" }),
    linkId: integer("link_id").references(() => blogLinks.id, { onDelete: "restrict" }).notNull(),
    checkedAt: timestamp("checked_at").notNull(),
    method: varchar("method", { length: 20 }).notNull(),
    result: varchar("result", { length: 100 }).notNull(),
    httpStatus: integer("http_status"),
    resolvedHref: text("resolved_href"),
    redirectCount: integer("redirect_count").notNull().default(0),
    durationMs: integer("duration_ms"),
    errorCategory: varchar("error_category", { length: 100 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_blog_link_checks_link_checked").on(table.linkId, table.checkedAt),
    index("idx_blog_link_checks_run_id").on(table.runId),
    check("chk_blog_link_checks_http_status", sql`${table.httpStatus} is null or ${table.httpStatus} between 100 and 599`),
    check("chk_blog_link_checks_redirect_count", sql`${table.redirectCount} >= 0`),
    check("chk_blog_link_checks_duration", sql`${table.durationMs} is null or ${table.durationMs} >= 0`),
  ],
);

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

export const insertBlogAuthorSchema = createInsertSchema(blogAuthors).omit({
  createdAt: true,
});

export const insertBlogCategorySchema = createInsertSchema(blogCategories).omit({
  createdAt: true,
});

export const insertBlogTagSchema = createInsertSchema(blogTags).omit({
  createdAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertBlogPostTagSchema = createInsertSchema(blogPostTags);
export const insertBlogPostImageSchema = createInsertSchema(blogPostImages).omit({
  createdAt: true,
  updatedAt: true,
});
export const insertBlogTopicCandidateSchema = createInsertSchema(blogTopicCandidates).omit({
  createdAt: true,
  updatedAt: true,
});
export const insertBlogRedirectSchema = z.object({
  sourcePath: z.string().min(1).max(500),
  targetPath: z.string().min(1).max(500),
  statusCode: z.number().int().refine(value => value === 301 || value === 302).default(301),
  reason: z.string().max(100).nullable().optional(),
  isActive: z.boolean().default(true),
  sourcePostId: z.number().int().positive().nullable().optional(),
});

// Hidden honeypot fields that must stay empty for a real user. Bots that
// auto-fill every input will populate them, letting us silently filter.
export const HONEYPOT_FIELDS = ["website", "url", "homepage", "companyWebsite"] as const;

// Schema for the raw contact form request coming from the browser. It carries
// the real contact fields plus anti-spam-only fields (honeypot + timing) that
// are stripped before persistence. Phone is required and validated here.
export const contactFormRequestSchema = insertContactMessageSchema.extend({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().min(1),
  message: z.string().trim().min(1),
  formStartedAt: z.coerce.number().optional(),
  website: z.string().optional(),
  url: z.string().optional(),
  homepage: z.string().optional(),
  companyWebsite: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type ContactFormRequest = z.infer<typeof contactFormRequestSchema>;
export type BlogPostStatus = (typeof blogPostStatusEnum.enumValues)[number];
export type BlogGenerationRunStatus = (typeof blogGenerationRunStatusEnum.enumValues)[number];
export type InsertBlogAuthor = z.infer<typeof insertBlogAuthorSchema>;
export type BlogAuthor = typeof blogAuthors.$inferSelect;
export type InsertBlogCategory = z.infer<typeof insertBlogCategorySchema>;
export type BlogCategory = typeof blogCategories.$inferSelect;
export type InsertBlogTag = z.infer<typeof insertBlogTagSchema>;
export type BlogTag = typeof blogTags.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPostTag = z.infer<typeof insertBlogPostTagSchema>;
export type BlogPostTag = typeof blogPostTags.$inferSelect;
export type BlogGenerationRun = typeof blogGenerationRuns.$inferSelect;
export type BlogGenerationEvent = typeof blogGenerationEvents.$inferSelect;
export type BlogImageGenerationJobStatus = (typeof blogImageGenerationJobStatusEnum.enumValues)[number];
export type BlogImageGenerationOperation = (typeof blogImageGenerationOperationEnum.enumValues)[number];
export type InsertBlogImageGenerationJob = typeof blogImageGenerationJobs.$inferInsert;
export type BlogImageGenerationJob = typeof blogImageGenerationJobs.$inferSelect;
export type InsertBlogTopicCandidate = typeof blogTopicCandidates.$inferInsert;
export type BlogTopicCandidate = typeof blogTopicCandidates.$inferSelect;
export type BlogPostImageRole = (typeof blogPostImageRoleEnum.enumValues)[number];
export type BlogPostImageSource = (typeof blogPostImageSourceEnum.enumValues)[number];
export type BlogPostImageGenerationStatus = (typeof blogPostImageGenerationStatusEnum.enumValues)[number];
export type BlogPostImageReviewStatus = (typeof blogPostImageReviewStatusEnum.enumValues)[number];
export type InsertBlogPostImage = typeof blogPostImages.$inferInsert;
export type BlogPostImage = typeof blogPostImages.$inferSelect;
export type BlogImageCleanupQueueItem = typeof blogImageCleanupQueue.$inferSelect;
export type InsertBlogRedirect = z.infer<typeof insertBlogRedirectSchema>;
export type BlogRedirect = typeof blogRedirects.$inferSelect;
export type BlogLinkKind = (typeof blogLinkKindEnum.enumValues)[number];
export type BlogLinkReviewStatus = (typeof blogLinkReviewStatusEnum.enumValues)[number];
export type BlogLinkHealthStatus = (typeof blogLinkHealthStatusEnum.enumValues)[number];
export type BlogLinkOrigin = (typeof blogLinkOriginEnum.enumValues)[number];
export type BlogLinkUsageOrigin = (typeof blogLinkUsageOriginEnum.enumValues)[number];
export type BlogLinkAuditStatus = (typeof blogLinkAuditStatusEnum.enumValues)[number];
export type BlogLinkSourceType = (typeof blogLinkSourceTypeEnum.enumValues)[number];
export type InsertBlogLinkSource = typeof blogLinkSources.$inferInsert;
export type BlogLinkSource = typeof blogLinkSources.$inferSelect;
export type InsertBlogLink = typeof blogLinks.$inferInsert;
export type BlogLink = typeof blogLinks.$inferSelect;
export type InsertBlogPostLink = typeof blogPostLinks.$inferInsert;
export type BlogPostLink = typeof blogPostLinks.$inferSelect;
export type InsertBlogLinkAuditRun = typeof blogLinkAuditRuns.$inferInsert;
export type BlogLinkAuditRun = typeof blogLinkAuditRuns.$inferSelect;
export type InsertBlogLinkCheck = typeof blogLinkChecks.$inferInsert;
export type BlogLinkCheck = typeof blogLinkChecks.$inferSelect;

// Review schemas for Metricool integration
export const reviewSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().optional(),
  date: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  fullComment: z.string(),
  createdAt: z.date(),
});

export const reviewsStatsSchema = z.object({
  averageRating: z.number(),
  totalReviews: z.number(),
  ratingDistribution: z.object({
    5: z.number(),
    4: z.number(),
    3: z.number(),
    2: z.number(),
    1: z.number(),
  }),
});

export const reviewsResponseSchema = z.object({
  fetchedAt: z.string().datetime({ offset: true }),
  stats: reviewsStatsSchema,
  reviews: z.array(reviewSchema),
});

export type Review = z.infer<typeof reviewSchema>;
export type ReviewsStats = z.infer<typeof reviewsStatsSchema>;
export type ReviewsResponse = z.infer<typeof reviewsResponseSchema>;
