CREATE TABLE "blog_image_cleanup_queue" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blog_image_cleanup_queue_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"object_key" varchar(500) NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"last_error" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "idx_blog_image_cleanup_queue_object_key" ON "blog_image_cleanup_queue" USING btree ("object_key");
--> statement-breakpoint
CREATE INDEX "idx_blog_image_cleanup_queue_updated_at" ON "blog_image_cleanup_queue" USING btree ("updated_at");
