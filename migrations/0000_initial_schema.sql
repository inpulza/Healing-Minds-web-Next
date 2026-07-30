CREATE TYPE "public"."blog_generation_run_status" AS ENUM('planning', 'queued', 'running', 'completed', 'failed', 'interrupted');--> statement-breakpoint
CREATE TYPE "public"."blog_link_audit_status" AS ENUM('queued', 'running', 'completed', 'failed', 'interrupted');--> statement-breakpoint
CREATE TYPE "public"."blog_link_health_status" AS ENUM('unchecked', 'healthy', 'redirected', 'unreachable', 'broken', 'changed_review_needed', 'stale');--> statement-breakpoint
CREATE TYPE "public"."blog_link_kind" AS ENUM('internal', 'external');--> statement-breakpoint
CREATE TYPE "public"."blog_link_origin" AS ENUM('seed', 'manual', 'ai', 'backfill');--> statement-breakpoint
CREATE TYPE "public"."blog_link_review_status" AS ENUM('pending', 'approved', 'blocked', 'retired');--> statement-breakpoint
CREATE TYPE "public"."blog_link_source_type" AS ENUM('first_party', 'government', 'professional_guideline', 'academic', 'health_system', 'crisis', 'other');--> statement-breakpoint
CREATE TYPE "public"."blog_link_usage_origin" AS ENUM('ai', 'manual', 'backfill', 'server_fix');--> statement-breakpoint
CREATE TYPE "public"."blog_post_image_generation_status" AS ENUM('pending', 'generating', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."blog_post_image_review_status" AS ENUM('candidate', 'selected', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."blog_post_image_role" AS ENUM('hero', 'inline');--> statement-breakpoint
CREATE TYPE "public"."blog_post_image_source" AS ENUM('curated', 'ai');--> statement-breakpoint
CREATE TYPE "public"."blog_post_status" AS ENUM('draft', 'pending_review', 'published', 'rejected');--> statement-breakpoint
CREATE TABLE "blog_authors" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blog_authors_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"title" varchar(255),
	"bio" text,
	"image_url" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_categories" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blog_categories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"language" varchar(5) DEFAULT 'en' NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_generation_events" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blog_generation_events_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"run_id" integer NOT NULL,
	"event_type" varchar(100) NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_generation_runs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blog_generation_runs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"idempotency_key" varchar(255) NOT NULL,
	"status" "blog_generation_run_status" DEFAULT 'planning' NOT NULL,
	"input" jsonb NOT NULL,
	"workflow" jsonb,
	"result" jsonb,
	"post_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp,
	"heartbeat_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "blog_link_audit_runs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blog_link_audit_runs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"idempotency_key" varchar(255) NOT NULL,
	"status" "blog_link_audit_status" DEFAULT 'queued' NOT NULL,
	"input" jsonb NOT NULL,
	"result" jsonb,
	"requested_by" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp,
	"heartbeat_at" timestamp,
	"lease_token" varchar(64),
	"lease_epoch" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chk_blog_link_audit_runs_input_object" CHECK (jsonb_typeof("blog_link_audit_runs"."input") = 'object'),
	CONSTRAINT "chk_blog_link_audit_runs_result_object" CHECK ("blog_link_audit_runs"."result" is null or jsonb_typeof("blog_link_audit_runs"."result") = 'object'),
	CONSTRAINT "chk_blog_link_audit_runs_lease_epoch" CHECK ("blog_link_audit_runs"."lease_epoch" >= 0),
	CONSTRAINT "chk_blog_link_audit_runs_active_lease" CHECK ((
        ("blog_link_audit_runs"."status" = 'running' and "blog_link_audit_runs"."lease_token" is not null)
        or ("blog_link_audit_runs"."status" <> 'running' and "blog_link_audit_runs"."lease_token" is null)
      ))
);
--> statement-breakpoint
CREATE TABLE "blog_link_checks" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blog_link_checks_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"run_id" integer,
	"link_id" integer NOT NULL,
	"checked_at" timestamp NOT NULL,
	"method" varchar(20) NOT NULL,
	"result" varchar(100) NOT NULL,
	"http_status" integer,
	"resolved_href" text,
	"redirect_count" integer DEFAULT 0 NOT NULL,
	"duration_ms" integer,
	"error_category" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chk_blog_link_checks_http_status" CHECK ("blog_link_checks"."http_status" is null or "blog_link_checks"."http_status" between 100 and 599),
	CONSTRAINT "chk_blog_link_checks_redirect_count" CHECK ("blog_link_checks"."redirect_count" >= 0),
	CONSTRAINT "chk_blog_link_checks_duration" CHECK ("blog_link_checks"."duration_ms" is null or "blog_link_checks"."duration_ms" >= 0)
);
--> statement-breakpoint
CREATE TABLE "blog_link_sources" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blog_link_sources_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"stable_key" varchar(120) NOT NULL,
	"name" varchar(255) NOT NULL,
	"canonical_domain" varchar(255) NOT NULL,
	"source_type" "blog_link_source_type" NOT NULL,
	"languages" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"review_status" "blog_link_review_status" DEFAULT 'pending' NOT NULL,
	"reviewed_by" varchar(255),
	"reviewed_at" timestamp,
	"review_notes" text,
	"quality_score" integer DEFAULT 0 NOT NULL,
	"quality_breakdown" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"score_version" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chk_blog_link_sources_languages_array" CHECK (jsonb_typeof("blog_link_sources"."languages") = 'array'),
	CONSTRAINT "chk_blog_link_sources_quality_score" CHECK ("blog_link_sources"."quality_score" between 0 and 100),
	CONSTRAINT "chk_blog_link_sources_quality_breakdown_object" CHECK (jsonb_typeof("blog_link_sources"."quality_breakdown") = 'object')
);
--> statement-breakpoint
CREATE TABLE "blog_links" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blog_links_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"stable_key" varchar(120),
	"source_id" integer,
	"kind" "blog_link_kind" NOT NULL,
	"normalized_href" text NOT NULL,
	"canonical_key" varchar(64) NOT NULL,
	"display_href" text NOT NULL,
	"host" varchar(255),
	"title" varchar(255) NOT NULL,
	"label" varchar(255) NOT NULL,
	"language" varchar(5) DEFAULT 'all' NOT NULL,
	"source_category" varchar(100),
	"topic_tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"category_keys" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"content_pillars" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"keywords" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"summary" text,
	"evidence_type" varchar(100),
	"evidence_scope" text,
	"evidence_score" integer DEFAULT 0 NOT NULL,
	"freshness_score" integer DEFAULT 0 NOT NULL,
	"review_status" "blog_link_review_status" DEFAULT 'pending' NOT NULL,
	"reviewed_by" varchar(255),
	"reviewed_at" timestamp,
	"review_notes" text,
	"generation_eligible" boolean DEFAULT false NOT NULL,
	"health_status" "blog_link_health_status" DEFAULT 'unchecked' NOT NULL,
	"http_status" integer,
	"final_href" text,
	"redirect_count" integer DEFAULT 0 NOT NULL,
	"consecutive_failures" integer DEFAULT 0 NOT NULL,
	"last_checked_at" timestamp,
	"last_successful_at" timestamp,
	"next_check_at" timestamp,
	"last_error_code" varchar(100),
	"score_breakdown" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"score_version" varchar(100) NOT NULL,
	"origin" "blog_link_origin" NOT NULL,
	"target_post_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chk_blog_links_language" CHECK ("blog_links"."language" in ('en', 'es', 'all')),
	CONSTRAINT "chk_blog_links_topic_tags_array" CHECK (jsonb_typeof("blog_links"."topic_tags") = 'array'),
	CONSTRAINT "chk_blog_links_category_keys_array" CHECK (jsonb_typeof("blog_links"."category_keys") = 'array'),
	CONSTRAINT "chk_blog_links_content_pillars_array" CHECK (jsonb_typeof("blog_links"."content_pillars") = 'array'),
	CONSTRAINT "chk_blog_links_keywords_array" CHECK (jsonb_typeof("blog_links"."keywords") = 'array'),
	CONSTRAINT "chk_blog_links_evidence_score" CHECK ("blog_links"."evidence_score" between 0 and 100),
	CONSTRAINT "chk_blog_links_freshness_score" CHECK ("blog_links"."freshness_score" between 0 and 100),
	CONSTRAINT "chk_blog_links_http_status" CHECK ("blog_links"."http_status" is null or "blog_links"."http_status" between 100 and 599),
	CONSTRAINT "chk_blog_links_redirect_count" CHECK ("blog_links"."redirect_count" >= 0),
	CONSTRAINT "chk_blog_links_consecutive_failures" CHECK ("blog_links"."consecutive_failures" >= 0),
	CONSTRAINT "chk_blog_links_score_breakdown_object" CHECK (jsonb_typeof("blog_links"."score_breakdown") = 'object')
);
--> statement-breakpoint
CREATE TABLE "blog_post_images" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blog_post_images_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"post_id" integer NOT NULL,
	"role" "blog_post_image_role" NOT NULL,
	"slot" varchar(100) NOT NULL,
	"anchor_heading" varchar(255),
	"source" "blog_post_image_source" NOT NULL,
	"generation_status" "blog_post_image_generation_status" DEFAULT 'pending' NOT NULL,
	"review_status" "blog_post_image_review_status" DEFAULT 'candidate' NOT NULL,
	"object_key" varchar(500),
	"public_url" varchar(500),
	"mime_type" varchar(100),
	"width" integer,
	"height" integer,
	"bytes" integer,
	"checksum" varchar(64),
	"alt" varchar(255),
	"caption" varchar(500),
	"safe_visual_brief" text,
	"prompt" text,
	"prompt_version" varchar(50),
	"provider" varchar(100),
	"model" varchar(100),
	"generation_run_id" integer,
	"started_at" timestamp,
	"completed_at" timestamp,
	"duration_ms" integer,
	"error_code" varchar(100),
	"error_message" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_post_links" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blog_post_links_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"post_id" integer NOT NULL,
	"link_id" integer NOT NULL,
	"generation_run_id" integer,
	"occurrence_key" varchar(64) NOT NULL,
	"ordinal" integer NOT NULL,
	"raw_href" text NOT NULL,
	"normalized_href" text NOT NULL,
	"anchor_text" text NOT NULL,
	"section_heading" text,
	"rel" varchar(255),
	"target" varchar(50),
	"claim_class" varchar(100),
	"origin" "blog_link_usage_origin" NOT NULL,
	"post_content_checksum" varchar(64) NOT NULL,
	"first_seen_at" timestamp DEFAULT now() NOT NULL,
	"last_seen_at" timestamp DEFAULT now() NOT NULL,
	"removed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chk_blog_post_links_ordinal" CHECK ("blog_post_links"."ordinal" >= 0)
);
--> statement-breakpoint
CREATE TABLE "blog_post_tags" (
	"post_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	CONSTRAINT "blog_post_tags_post_id_tag_id_pk" PRIMARY KEY("post_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blog_posts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"language" varchar(5) DEFAULT 'en' NOT NULL,
	"translation_group_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"excerpt" text,
	"content" text,
	"featured_image" varchar(500),
	"featured_image_alt" varchar(255),
	"author_id" integer,
	"category_id" integer,
	"status" "blog_post_status" DEFAULT 'draft' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"meta_title" varchar(70),
	"meta_description" varchar(160),
	"reading_time" integer,
	"topic_candidate_id" integer,
	"topic_key" varchar(180),
	"target_keyword" varchar(120),
	"content_pillar" varchar(80),
	"patient_stage" varchar(80),
	"content_format" varchar(80),
	"search_intent" varchar(80),
	"expertise_angle" text,
	"topic_strategy_version" varchar(100),
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_redirects" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blog_redirects_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"source_path" varchar(500) NOT NULL,
	"target_path" varchar(500) NOT NULL,
	"status_code" integer DEFAULT 301 NOT NULL,
	"reason" varchar(100),
	"is_active" boolean DEFAULT true NOT NULL,
	"source_post_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_tags" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blog_tags_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"language" varchar(5) DEFAULT 'en' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_topic_candidates" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blog_topic_candidates_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"run_id" integer NOT NULL,
	"batch" integer NOT NULL,
	"candidate_key" varchar(120) NOT NULL,
	"topic" varchar(180) NOT NULL,
	"target_keyword" varchar(120) NOT NULL,
	"language" varchar(5) NOT NULL,
	"category_id" integer NOT NULL,
	"category_key" varchar(80) NOT NULL,
	"pillar" varchar(80) NOT NULL,
	"patient_stage" varchar(80) NOT NULL,
	"content_format" varchar(80) NOT NULL,
	"search_intent" varchar(80) NOT NULL,
	"expertise_angle" text NOT NULL,
	"why_timely" text NOT NULL,
	"source_recommendation_ids" jsonb NOT NULL,
	"internal_link_target_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"create_or_update" varchar(30) NOT NULL,
	"strategy_version" varchar(100) NOT NULL,
	"prompt_version" varchar(100) NOT NULL,
	"provider" varchar(50) NOT NULL,
	"model" varchar(100) NOT NULL,
	"deterministic_status" varchar(50) NOT NULL,
	"overlap_basis_points" integer DEFAULT 0 NOT NULL,
	"matched_post_ids" jsonb NOT NULL,
	"semantic_decision" varchar(50),
	"semantic_confidence_basis_points" integer,
	"semantic_matched_post_id" integer,
	"semantic_rationale" text,
	"judge_model" varchar(100),
	"score" integer DEFAULT 0 NOT NULL,
	"score_breakdown" jsonb NOT NULL,
	"recommendation" varchar(50) NOT NULL,
	"selected" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"preferred_language" text DEFAULT 'english' NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "blog_generation_events" ADD CONSTRAINT "blog_generation_events_run_id_blog_generation_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."blog_generation_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_generation_runs" ADD CONSTRAINT "blog_generation_runs_post_id_blog_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_link_checks" ADD CONSTRAINT "blog_link_checks_run_id_blog_link_audit_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."blog_link_audit_runs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_link_checks" ADD CONSTRAINT "blog_link_checks_link_id_blog_links_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."blog_links"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_links" ADD CONSTRAINT "blog_links_source_id_blog_link_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."blog_link_sources"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_links" ADD CONSTRAINT "blog_links_target_post_id_blog_posts_id_fk" FOREIGN KEY ("target_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_post_images" ADD CONSTRAINT "blog_post_images_post_id_blog_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_post_images" ADD CONSTRAINT "blog_post_images_generation_run_id_blog_generation_runs_id_fk" FOREIGN KEY ("generation_run_id") REFERENCES "public"."blog_generation_runs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_post_links" ADD CONSTRAINT "blog_post_links_post_id_blog_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_post_links" ADD CONSTRAINT "blog_post_links_link_id_blog_links_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."blog_links"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_post_links" ADD CONSTRAINT "blog_post_links_generation_run_id_blog_generation_runs_id_fk" FOREIGN KEY ("generation_run_id") REFERENCES "public"."blog_generation_runs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_post_tags" ADD CONSTRAINT "blog_post_tags_post_id_blog_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_post_tags" ADD CONSTRAINT "blog_post_tags_tag_id_blog_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."blog_tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_blog_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."blog_authors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_category_id_blog_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."blog_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_topic_candidate_id_blog_topic_candidates_id_fk" FOREIGN KEY ("topic_candidate_id") REFERENCES "public"."blog_topic_candidates"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_redirects" ADD CONSTRAINT "blog_redirects_source_post_id_blog_posts_id_fk" FOREIGN KEY ("source_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_topic_candidates" ADD CONSTRAINT "blog_topic_candidates_run_id_blog_generation_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."blog_generation_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_topic_candidates" ADD CONSTRAINT "blog_topic_candidates_category_id_blog_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."blog_categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_topic_candidates" ADD CONSTRAINT "blog_topic_candidates_semantic_matched_post_id_blog_posts_id_fk" FOREIGN KEY ("semantic_matched_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_blog_categories_language_slug" ON "blog_categories" USING btree ("language","slug");--> statement-breakpoint
CREATE INDEX "idx_blog_generation_events_run_id_id" ON "blog_generation_events" USING btree ("run_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_blog_generation_runs_idempotency_key" ON "blog_generation_runs" USING btree ("idempotency_key");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_blog_generation_runs_single_open" ON "blog_generation_runs" USING btree ((1)) WHERE "blog_generation_runs"."status" in ('planning', 'queued', 'running');--> statement-breakpoint
CREATE INDEX "idx_blog_generation_runs_status_heartbeat" ON "blog_generation_runs" USING btree ("status","heartbeat_at");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_blog_link_audit_runs_idempotency_key" ON "blog_link_audit_runs" USING btree ("idempotency_key");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_blog_link_audit_runs_single_open" ON "blog_link_audit_runs" USING btree ((1)) WHERE "blog_link_audit_runs"."status" in ('queued', 'running');--> statement-breakpoint
CREATE INDEX "idx_blog_link_audit_runs_status_heartbeat" ON "blog_link_audit_runs" USING btree ("status","heartbeat_at");--> statement-breakpoint
CREATE INDEX "idx_blog_link_checks_link_checked" ON "blog_link_checks" USING btree ("link_id","checked_at");--> statement-breakpoint
CREATE INDEX "idx_blog_link_checks_run_id" ON "blog_link_checks" USING btree ("run_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_blog_link_sources_stable_key" ON "blog_link_sources" USING btree ("stable_key");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_blog_link_sources_canonical_domain" ON "blog_link_sources" USING btree ("canonical_domain");--> statement-breakpoint
CREATE INDEX "idx_blog_link_sources_review_type" ON "blog_link_sources" USING btree ("review_status","source_type");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_blog_links_stable_key" ON "blog_links" USING btree ("stable_key") WHERE "blog_links"."stable_key" is not null;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_blog_links_canonical_key" ON "blog_links" USING btree ("canonical_key");--> statement-breakpoint
CREATE INDEX "idx_blog_links_library_filters" ON "blog_links" USING btree ("kind","language","review_status","health_status");--> statement-breakpoint
CREATE INDEX "idx_blog_links_generation_eligible" ON "blog_links" USING btree ("generation_eligible","review_status","health_status");--> statement-breakpoint
CREATE INDEX "idx_blog_links_source_id" ON "blog_links" USING btree ("source_id");--> statement-breakpoint
CREATE INDEX "idx_blog_links_target_post_id" ON "blog_links" USING btree ("target_post_id");--> statement-breakpoint
CREATE INDEX "idx_blog_post_images_post_slot" ON "blog_post_images" USING btree ("post_id","slot");--> statement-breakpoint
CREATE INDEX "idx_blog_post_images_generation_run" ON "blog_post_images" USING btree ("generation_run_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_blog_post_images_object_key" ON "blog_post_images" USING btree ("object_key") WHERE "blog_post_images"."object_key" is not null;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_blog_post_images_single_selected_slot" ON "blog_post_images" USING btree ("post_id","slot") WHERE "blog_post_images"."review_status" = 'selected';--> statement-breakpoint
CREATE UNIQUE INDEX "idx_blog_post_links_occurrence" ON "blog_post_links" USING btree ("post_id","occurrence_key");--> statement-breakpoint
CREATE INDEX "idx_blog_post_links_current_by_link" ON "blog_post_links" USING btree ("link_id","removed_at");--> statement-breakpoint
CREATE INDEX "idx_blog_post_links_current_by_post" ON "blog_post_links" USING btree ("post_id","removed_at");--> statement-breakpoint
CREATE INDEX "idx_blog_post_links_generation_run" ON "blog_post_links" USING btree ("generation_run_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_blog_posts_language_slug" ON "blog_posts" USING btree ("language","slug");--> statement-breakpoint
CREATE INDEX "idx_blog_posts_status" ON "blog_posts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_blog_posts_published_at" ON "blog_posts" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "idx_blog_posts_category_id" ON "blog_posts" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "idx_blog_posts_topic_key" ON "blog_posts" USING btree ("language","topic_key");--> statement-breakpoint
CREATE INDEX "idx_blog_posts_topic_strategy" ON "blog_posts" USING btree ("language","content_pillar","patient_stage");--> statement-breakpoint
CREATE INDEX "idx_blog_posts_translation_group" ON "blog_posts" USING btree ("translation_group_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_blog_redirects_source_path" ON "blog_redirects" USING btree ("source_path");--> statement-breakpoint
CREATE INDEX "idx_blog_redirects_active" ON "blog_redirects" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_blog_redirects_source_post_id" ON "blog_redirects" USING btree ("source_post_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_blog_tags_language_slug" ON "blog_tags" USING btree ("language","slug");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_blog_topic_candidates_run_key" ON "blog_topic_candidates" USING btree ("run_id","candidate_key");--> statement-breakpoint
CREATE INDEX "idx_blog_topic_candidates_run_batch" ON "blog_topic_candidates" USING btree ("run_id","batch");--> statement-breakpoint
CREATE INDEX "idx_blog_topic_candidates_strategy" ON "blog_topic_candidates" USING btree ("language","category_key","pillar");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_blog_topic_candidates_single_selected" ON "blog_topic_candidates" USING btree ("run_id") WHERE "blog_topic_candidates"."selected" = true;--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");