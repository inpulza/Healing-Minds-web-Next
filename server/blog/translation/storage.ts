import { and, desc, eq, inArray, isNull, or, sql } from "drizzle-orm";
import { blogGenerationRuns, blogPosts, blogPostTags, type BlogGenerationRun } from "@shared/schema";
import { db, pool } from "../../db";
import { getBlogPostById, type BlogLanguage, type BlogPostInput, type BlogPostWithRelations } from "../storage";

export async function assertBlogTranslationSchemaReady(): Promise<void> {
  const result = await pool.query<{ ready: boolean }>(`
    select to_regclass('public.idx_blog_posts_translation_group_language') is not null as ready
  `);
  if (result.rows[0]?.ready) return;
  throw Object.assign(
    new Error("Bilingual draft generation is unavailable until migration 0004_bilingual_translation_siblings is applied"),
    {
      statusCode: 503,
      code: "blog_translation_migration_required",
    },
  );
}

export async function getBlogTranslationSibling(
  source: Pick<BlogPostWithRelations, "id" | "language" | "translationGroupId">,
): Promise<BlogPostWithRelations | undefined> {
  const [row] = await db
    .select({ id: blogPosts.id })
    .from(blogPosts)
    .where(and(
      eq(blogPosts.translationGroupId, source.translationGroupId),
      eq(blogPosts.language, source.language === "en" ? "es" : "en"),
    ))
    .limit(1);
  return row ? getBlogPostById(row.id) : undefined;
}

export async function getPublishedBlogTranslationPath(path: string): Promise<string | undefined> {
  const match = path.match(/^\/(es\/)?blog\/([^/?#]+)$/);
  if (!match) return undefined;
  const language: BlogLanguage = match[1] ? "es" : "en";
  const [source] = await db.select({ translationGroupId: blogPosts.translationGroupId })
    .from(blogPosts)
    .where(and(eq(blogPosts.language, language), eq(blogPosts.slug, decodeURIComponent(match[2]))))
    .limit(1);
  if (!source) return undefined;
  const targetLanguage: BlogLanguage = language === "en" ? "es" : "en";
  const [sibling] = await db.select({ slug: blogPosts.slug })
    .from(blogPosts)
    .where(and(
      eq(blogPosts.translationGroupId, source.translationGroupId),
      eq(blogPosts.language, targetLanguage),
      eq(blogPosts.status, "published"),
    ))
    .limit(1);
  return sibling ? (targetLanguage === "es" ? `/es/blog/${sibling.slug}` : `/blog/${sibling.slug}`) : undefined;
}

export async function createBlogTranslationSibling(
  values: BlogPostInput,
  runId: number,
): Promise<{ post: BlogPostWithRelations; created: boolean }> {
  const result = await db.transaction(async tx => {
    const { tagIds = [], ...postValues } = values;
    const [created] = await tx.insert(blogPosts)
      .values({ ...postValues, status: "draft", publishedAt: null, updatedAt: new Date() })
      .onConflictDoNothing({ target: [blogPosts.translationGroupId, blogPosts.language] })
      .returning({ id: blogPosts.id });
    const [existing] = created ? [created] : await tx.select({ id: blogPosts.id })
      .from(blogPosts)
      .where(and(
        eq(blogPosts.translationGroupId, values.translationGroupId!),
        eq(blogPosts.language, values.language || "en"),
      ))
      .limit(1);
    if (!existing) throw new Error("Translation sibling conflict could not be resolved");
    if (created && tagIds.length > 0) {
      await tx.insert(blogPostTags)
        .values(Array.from(new Set(tagIds)).map((tagId, position) => ({ postId: existing.id, tagId, position })))
        .onConflictDoNothing();
    }
    const [linked] = await tx.update(blogGenerationRuns)
      .set({ postId: existing.id, heartbeatAt: new Date(), updatedAt: new Date() })
      .where(and(
        eq(blogGenerationRuns.id, runId),
        eq(blogGenerationRuns.status, "running"),
        or(isNull(blogGenerationRuns.postId), eq(blogGenerationRuns.postId, existing.id)),
      ))
      .returning({ id: blogGenerationRuns.id });
    if (!linked) throw new Error("Translation run could not claim its sibling draft");
    return { id: existing.id, created: Boolean(created) };
  });
  const post = await getBlogPostById(result.id);
  if (!post) throw new Error("Translation sibling was committed but could not be loaded");
  return { post, created: result.created };
}

export async function replaceBlogTranslationSiblingDraft(
  values: BlogPostInput,
  siblingId: number,
  runId: number,
  expectedSiblingUpdatedAt: Date,
): Promise<BlogPostWithRelations> {
  const result = await db.transaction(async tx => {
    const { tagIds = [], ...postValues } = values;
    const [updated] = await tx.update(blogPosts)
      .set({ ...postValues, status: "draft", publishedAt: null, updatedAt: new Date() })
      .where(and(
        eq(blogPosts.id, siblingId),
        eq(blogPosts.status, "draft"),
        eq(blogPosts.translationGroupId, values.translationGroupId!),
        eq(blogPosts.language, values.language || "en"),
        eq(blogPosts.updatedAt, expectedSiblingUpdatedAt),
      ))
      .returning({ id: blogPosts.id });
    if (!updated) {
      throw Object.assign(
        new Error("The sibling draft changed after refresh was queued. Review it and retry explicitly."),
        { statusCode: 409, code: "blog_translation_refresh_sibling_changed" },
      );
    }
    await tx.delete(blogPostTags).where(eq(blogPostTags.postId, siblingId));
    if (tagIds.length > 0) {
      await tx.insert(blogPostTags)
        .values(Array.from(new Set(tagIds)).map((tagId, position) => ({ postId: siblingId, tagId, position })))
        .onConflictDoNothing();
    }
    const [linked] = await tx.update(blogGenerationRuns)
      .set({ postId: siblingId, heartbeatAt: new Date(), updatedAt: new Date() })
      .where(and(
        eq(blogGenerationRuns.id, runId),
        eq(blogGenerationRuns.status, "running"),
        or(isNull(blogGenerationRuns.postId), eq(blogGenerationRuns.postId, siblingId)),
      ))
      .returning({ id: blogGenerationRuns.id });
    if (!linked) throw new Error("Translation refresh run could not claim its sibling draft");
    return updated.id;
  });
  const post = await getBlogPostById(result);
  if (!post) throw new Error("Refreshed translation draft could not be loaded");
  return post;
}

export async function listRecentBlogTranslationRuns(): Promise<BlogGenerationRun[]> {
  return db.select().from(blogGenerationRuns)
    .where(sql`${blogGenerationRuns.input}->>'mode' = 'translation'`)
    .orderBy(desc(blogGenerationRuns.createdAt))
    .limit(200);
}

export async function getBlogTranslationPairs(
  posts: BlogPostWithRelations[],
): Promise<Map<number, { sibling: BlogPostWithRelations | null; run: BlogGenerationRun | null }>> {
  const result = new Map<number, { sibling: BlogPostWithRelations | null; run: BlogGenerationRun | null }>();
  if (posts.length === 0) return result;
  const groupIds = Array.from(new Set(posts.map(post => post.translationGroupId)));
  const siblingRows = await db.select({ post: blogPosts })
    .from(blogPosts)
    .where(inArray(blogPosts.translationGroupId, groupIds));
  const siblings: BlogPostWithRelations[] = siblingRows.map(row => ({
    ...row.post,
    author: null,
    category: null,
    tags: [],
  }));
  const byGroup = new Map<string, BlogPostWithRelations[]>();
  for (const sibling of siblings) {
    const list = byGroup.get(sibling.translationGroupId) || [];
    list.push(sibling);
    byGroup.set(sibling.translationGroupId, list);
  }
  const runs = await listRecentBlogTranslationRuns();
  for (const post of posts) {
    const sibling = byGroup.get(post.translationGroupId)?.find(candidate => candidate.language !== post.language) || null;
    const run = runs.find(candidate => Number(candidate.input.sourcePostId) === post.id) || null;
    result.set(post.id, { sibling, run });
  }
  return result;
}
