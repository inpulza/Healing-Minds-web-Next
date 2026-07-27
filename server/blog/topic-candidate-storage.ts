import { and, asc, eq } from "drizzle-orm";
import {
  blogTopicCandidates,
  type BlogTopicCandidate,
  type InsertBlogTopicCandidate,
} from "@shared/schema";
import { db } from "../db";

export async function persistBlogTopicCandidates(
  values: InsertBlogTopicCandidate[],
): Promise<BlogTopicCandidate[]> {
  if (values.length === 0) return [];
  return db
    .insert(blogTopicCandidates)
    .values(values)
    .onConflictDoNothing({
      target: [blogTopicCandidates.runId, blogTopicCandidates.candidateKey],
    })
    .returning();
}
export async function listBlogTopicCandidates(runId: number): Promise<BlogTopicCandidate[]> {
  return db
    .select()
    .from(blogTopicCandidates)
    .where(eq(blogTopicCandidates.runId, runId))
    .orderBy(asc(blogTopicCandidates.batch), asc(blogTopicCandidates.id));
}

export async function selectBlogTopicCandidate(
  runId: number,
  candidateKey: string,
): Promise<BlogTopicCandidate> {
  return db.transaction(async tx => {
    await tx
      .update(blogTopicCandidates)
      .set({ selected: false, updatedAt: new Date() })
      .where(and(
        eq(blogTopicCandidates.runId, runId),
        eq(blogTopicCandidates.selected, true),
      ));

    const [selected] = await tx
      .update(blogTopicCandidates)
      .set({ selected: true, updatedAt: new Date() })
      .where(and(
        eq(blogTopicCandidates.runId, runId),
        eq(blogTopicCandidates.candidateKey, candidateKey),
        eq(blogTopicCandidates.recommendation, "recommended"),
      ))
      .returning();
    if (!selected) {
      throw Object.assign(new Error("Topic candidate is not eligible for selection"), {
        statusCode: 409,
        code: "topic_candidate_not_selectable",
      });
    }
    return selected;
  });
}
