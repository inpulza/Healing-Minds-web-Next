import { and, asc, eq } from "drizzle-orm";
import {
  blogTopicCandidates,
  type BlogTopicCandidate,
  type InsertBlogTopicCandidate,
} from "@shared/schema";
import { db } from "../db";
import { isBlogLinkEnabled } from "./links/config";
import {
  legacyBlogTopicCandidates,
  toLegacyBlogTopicCandidateInsert,
  type LegacyBlogTopicCandidate,
} from "./topic-candidate-legacy-schema";

function withLegacyLinkTargets(
  row: LegacyBlogTopicCandidate,
): BlogTopicCandidate {
  return {
    ...row,
    internalLinkTargetIds: [],
  };
}

export async function persistBlogTopicCandidates(
  values: InsertBlogTopicCandidate[],
): Promise<BlogTopicCandidate[]> {
  if (values.length === 0) return [];
  if (!isBlogLinkEnabled()) {
    const legacyValues = values.map(toLegacyBlogTopicCandidateInsert);
    const rows = await db
      .insert(legacyBlogTopicCandidates)
      .values(legacyValues)
      .onConflictDoNothing({
        target: [
          legacyBlogTopicCandidates.runId,
          legacyBlogTopicCandidates.candidateKey,
        ],
      })
      .returning();
    return rows.map(withLegacyLinkTargets);
  }
  return db
    .insert(blogTopicCandidates)
    .values(values)
    .onConflictDoNothing({
      target: [blogTopicCandidates.runId, blogTopicCandidates.candidateKey],
    })
    .returning();
}
export async function listBlogTopicCandidates(runId: number): Promise<BlogTopicCandidate[]> {
  if (!isBlogLinkEnabled()) {
    const rows = await db
      .select()
      .from(legacyBlogTopicCandidates)
      .where(eq(legacyBlogTopicCandidates.runId, runId))
      .orderBy(asc(legacyBlogTopicCandidates.batch), asc(legacyBlogTopicCandidates.id));
    return rows.map(withLegacyLinkTargets);
  }
  return db
    .select()
    .from(blogTopicCandidates)
    .where(eq(blogTopicCandidates.runId, runId))
    .orderBy(asc(blogTopicCandidates.batch), asc(blogTopicCandidates.id));
}

export async function getBlogTopicCandidateById(
  candidateId: number,
): Promise<BlogTopicCandidate | undefined> {
  if (!isBlogLinkEnabled()) {
    const [row] = await db
      .select()
      .from(legacyBlogTopicCandidates)
      .where(eq(legacyBlogTopicCandidates.id, candidateId))
      .limit(1);
    return row ? withLegacyLinkTargets(row) : undefined;
  }
  const [row] = await db
    .select()
    .from(blogTopicCandidates)
    .where(eq(blogTopicCandidates.id, candidateId))
    .limit(1);
  return row;
}

export async function selectBlogTopicCandidate(
  runId: number,
  candidateKey: string,
): Promise<BlogTopicCandidate> {
  const linkIntelligenceEnabled = isBlogLinkEnabled();
  if (!linkIntelligenceEnabled) {
    return db.transaction(async tx => {
      await tx
        .update(legacyBlogTopicCandidates)
        .set({ selected: false, updatedAt: new Date() })
        .where(and(
          eq(legacyBlogTopicCandidates.runId, runId),
          eq(legacyBlogTopicCandidates.selected, true),
        ));

      const [selected] = await tx
        .update(legacyBlogTopicCandidates)
        .set({ selected: true, updatedAt: new Date() })
        .where(and(
          eq(legacyBlogTopicCandidates.runId, runId),
          eq(legacyBlogTopicCandidates.candidateKey, candidateKey),
          eq(legacyBlogTopicCandidates.recommendation, "recommended"),
        ))
        .returning();
      if (!selected) {
        throw Object.assign(new Error("Topic candidate is not eligible for selection"), {
          statusCode: 409,
          code: "topic_candidate_not_selectable",
        });
      }
      return withLegacyLinkTargets(selected);
    });
  }

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
