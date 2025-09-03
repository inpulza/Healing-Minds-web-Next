import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

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
