CREATE TYPE "public"."blog_image_generation_job_status" AS ENUM('admitting', 'queued', 'running', 'completed', 'partial_failed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."blog_image_generation_operation" AS ENUM('generate_set', 'regenerate_variant');--> statement-breakpoint
CREATE TABLE "blog_image_generation_jobs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blog_image_generation_jobs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"post_id" integer NOT NULL,
	"idempotency_key" varchar(255) NOT NULL,
	"status" "blog_image_generation_job_status" DEFAULT 'admitting' NOT NULL,
	"operation" "blog_image_generation_operation" NOT NULL,
	"role" varchar(20) NOT NULL,
	"max_inline" integer DEFAULT 2 NOT NULL,
	"source_image_id" integer,
	"result" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp,
	"heartbeat_at" timestamp,
	CONSTRAINT "blog_image_generation_jobs_role_check" CHECK ("blog_image_generation_jobs"."role" in ('hero', 'inline', 'all')),
	CONSTRAINT "blog_image_generation_jobs_max_inline_check" CHECK ("blog_image_generation_jobs"."max_inline" between 1 and 2)
);
--> statement-breakpoint
ALTER TABLE "blog_post_images" ADD COLUMN "image_job_id" integer;--> statement-breakpoint
ALTER TABLE "blog_image_generation_jobs" ADD CONSTRAINT "blog_image_generation_jobs_post_id_blog_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_image_generation_jobs" ADD CONSTRAINT "blog_image_generation_jobs_source_image_id_blog_post_images_id_fk" FOREIGN KEY ("source_image_id") REFERENCES "public"."blog_post_images"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_blog_image_generation_jobs_idempotency_key" ON "blog_image_generation_jobs" USING btree ("idempotency_key");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_blog_image_generation_jobs_single_open_post" ON "blog_image_generation_jobs" USING btree ("post_id") WHERE "blog_image_generation_jobs"."status" in ('admitting', 'queued', 'running');--> statement-breakpoint
CREATE INDEX "idx_blog_image_generation_jobs_status_heartbeat" ON "blog_image_generation_jobs" USING btree ("status","heartbeat_at");--> statement-breakpoint
ALTER TABLE "blog_post_images" ADD CONSTRAINT "blog_post_images_image_job_id_blog_image_generation_jobs_id_fk" FOREIGN KEY ("image_job_id") REFERENCES "public"."blog_image_generation_jobs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_blog_post_images_image_job" ON "blog_post_images" USING btree ("image_job_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_blog_post_images_image_job_slot" ON "blog_post_images" USING btree ("image_job_id","slot") WHERE "blog_post_images"."image_job_id" is not null;