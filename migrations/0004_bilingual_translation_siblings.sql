DROP INDEX "idx_blog_posts_translation_group";--> statement-breakpoint
CREATE UNIQUE INDEX "idx_blog_posts_translation_group_language" ON "blog_posts" USING btree ("translation_group_id","language");
