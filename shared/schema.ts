import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

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
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("idx_blog_posts_language_slug").on(table.language, table.slug),
    index("idx_blog_posts_status").on(table.status),
    index("idx_blog_posts_published_at").on(table.publishedAt),
    index("idx_blog_posts_category_id").on(table.categoryId),
    index("idx_blog_posts_translation_group").on(table.translationGroupId),
  ],
);

export const blogPostTags = pgTable(
  "blog_post_tags",
  {
    postId: integer("post_id").references(() => blogPosts.id, { onDelete: "cascade" }).notNull(),
    tagId: integer("tag_id").references(() => blogTags.id, { onDelete: "cascade" }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.postId, table.tagId] }),
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
  stats: reviewsStatsSchema,
  reviews: z.array(reviewSchema),
});

export type Review = z.infer<typeof reviewSchema>;
export type ReviewsStats = z.infer<typeof reviewsStatsSchema>;
export type ReviewsResponse = z.infer<typeof reviewsResponseSchema>;
