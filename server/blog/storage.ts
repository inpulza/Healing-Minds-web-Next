import { and, count, desc, eq, ilike, inArray, isNull, ne, or, type SQL } from "drizzle-orm";
import {
  blogAuthors,
  blogCategories,
  blogGenerationRuns,
  blogPostImages,
  blogPosts,
  blogPostTags,
  blogRedirects,
  blogTags,
  type BlogRedirect,
  type BlogAuthor,
  type BlogCategory,
  type BlogPost,
  type BlogPostStatus,
  type BlogTag,
  type InsertBlogCategory,
  type InsertBlogPost,
  type InsertBlogRedirect,
  type InsertBlogTag,
} from "@shared/schema";
import { db } from "../db";

export type BlogLanguage = "en" | "es";

export type BlogPostWithRelations = BlogPost & {
  author: BlogAuthor | null;
  category: BlogCategory | null;
  tags: BlogTag[];
};

export type GetBlogPostsOptions = {
  status?: BlogPostStatus;
  language?: BlogLanguage;
  categorySlug?: string;
  tagSlug?: string;
  limit?: number;
  offset?: number;
};

export type GetAdminBlogPostsOptions = {
  status?: BlogPostStatus | "all";
  language?: BlogLanguage | "all";
  search?: string;
  limit?: number;
  offset?: number;
};

export type BlogPostInput = InsertBlogPost & {
  tagIds?: number[];
};

export type BlogRedirectInput = InsertBlogRedirect;

export type BlogInternalLinkImpact = {
  id: number;
  title: string;
  slug: string;
  language: BlogLanguage;
  status: BlogPostStatus;
  path: string;
};

export type FindInternalLinkOptions = {
  status?: BlogPostStatus | "all";
  excludePostId?: number;
};

function isBlogLanguage(value: string): value is BlogLanguage {
  return value === "en" || value === "es";
}

export function getBlogLanguageFromPath(path: string): BlogLanguage {
  return path.startsWith("/es/") || path === "/es" ? "es" : "en";
}

export function getBlogSlugFromPath(path: string): { slug: string; language: BlogLanguage } | null {
  const enMatch = path.match(/^\/blog\/([^/?#]+)$/);
  if (enMatch) return { slug: decodeURIComponent(enMatch[1]), language: "en" };

  const esMatch = path.match(/^\/es\/blog\/([^/?#]+)$/);
  if (esMatch) return { slug: decodeURIComponent(esMatch[1]), language: "es" };

  return null;
}

export function getBlogIndexPath(language: BlogLanguage): string {
  return language === "es" ? "/es/blog" : "/blog";
}

export function getBlogPostPath(post: Pick<BlogPostWithRelations, "slug" | "language">): string {
  return post.language === "es" ? `/es/blog/${post.slug}` : `/blog/${post.slug}`;
}

export function getBlogPostPlainText(post: Pick<BlogPostWithRelations, "title" | "excerpt" | "content">): string {
  const content = post.content || "";
  return `${post.title} ${post.excerpt || ""} ${content}`
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeInternalPath(value: string): string {
  const trimmed = value.trim();
  const withoutOrigin = trimmed.replace(/^https?:\/\/[^/]+/i, "");
  const [withoutHash] = withoutOrigin.split("#");
  const [pathOnly] = withoutHash.split("?");
  const normalized = pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`;
  return normalized.length > 1 && normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
}

async function getTagsForPostIds(postIds: number[]): Promise<Map<number, BlogTag[]>> {
  const tagMap = new Map<number, BlogTag[]>();
  if (postIds.length === 0) return tagMap;

  const rows = await db
    .select({
      postId: blogPostTags.postId,
      tag: blogTags,
    })
    .from(blogPostTags)
    .innerJoin(blogTags, eq(blogPostTags.tagId, blogTags.id))
    .where(inArray(blogPostTags.postId, postIds));

  for (const row of rows) {
    const existing = tagMap.get(row.postId) || [];
    existing.push(row.tag);
    tagMap.set(row.postId, existing);
  }

  return tagMap;
}

async function hydratePosts(
  rows: Array<{ post: BlogPost; author: BlogAuthor | null; category: BlogCategory | null }>,
): Promise<BlogPostWithRelations[]> {
  const postIds = rows.map(row => row.post.id);
  const tagMap = await getTagsForPostIds(postIds);

  return rows.map(row => ({
    ...row.post,
    author: row.author,
    category: row.category,
    tags: tagMap.get(row.post.id) || [],
  }));
}

export async function getBlogPosts(options: GetBlogPostsOptions = {}): Promise<BlogPostWithRelations[]> {
  const {
    status = "published",
    language,
    categorySlug,
    tagSlug,
    limit = 50,
    offset = 0,
  } = options;

  const conditions: SQL[] = [eq(blogPosts.status, status)];
  if (language && isBlogLanguage(language)) {
    conditions.push(eq(blogPosts.language, language));
  }
  if (categorySlug) {
    conditions.push(eq(blogCategories.slug, categorySlug));
  }

  if (tagSlug) {
    const tagConditions: SQL[] = [eq(blogTags.slug, tagSlug)];
    if (language) {
      tagConditions.push(eq(blogTags.language, language));
    }

    const tagRows = await db
      .select({ postId: blogPostTags.postId })
      .from(blogPostTags)
      .innerJoin(blogTags, eq(blogPostTags.tagId, blogTags.id))
      .where(and(...tagConditions));
    const taggedPostIds = tagRows.map(row => row.postId);
    if (taggedPostIds.length === 0) return [];
    conditions.push(inArray(blogPosts.id, taggedPostIds));
  }

  const rows = await db
    .select({
      post: blogPosts,
      author: blogAuthors,
      category: blogCategories,
    })
    .from(blogPosts)
    .leftJoin(blogAuthors, eq(blogPosts.authorId, blogAuthors.id))
    .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
    .where(and(...conditions))
    .orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt))
    .limit(limit)
    .offset(offset);

  return hydratePosts(rows);
}

export async function getAdminBlogPosts(options: GetAdminBlogPostsOptions = {}): Promise<BlogPostWithRelations[]> {
  const {
    status = "all",
    language = "all",
    search,
    limit = 100,
    offset = 0,
  } = options;

  const conditions: SQL[] = [];
  if (status !== "all") {
    conditions.push(eq(blogPosts.status, status));
  }
  if (language !== "all" && isBlogLanguage(language)) {
    conditions.push(eq(blogPosts.language, language));
  }
  if (search?.trim()) {
    const pattern = `%${search.trim()}%`;
    conditions.push(
      or(
        ilike(blogPosts.title, pattern),
        ilike(blogPosts.slug, pattern),
        ilike(blogPosts.excerpt, pattern),
      )!,
    );
  }

  const rows = await db
    .select({
      post: blogPosts,
      author: blogAuthors,
      category: blogCategories,
    })
    .from(blogPosts)
    .leftJoin(blogAuthors, eq(blogPosts.authorId, blogAuthors.id))
    .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(blogPosts.updatedAt), desc(blogPosts.createdAt))
    .limit(limit)
    .offset(offset);

  return hydratePosts(rows);
}

export async function getBlogPostById(id: number): Promise<BlogPostWithRelations | undefined> {
  const rows = await db
    .select({
      post: blogPosts,
      author: blogAuthors,
      category: blogCategories,
    })
    .from(blogPosts)
    .leftJoin(blogAuthors, eq(blogPosts.authorId, blogAuthors.id))
    .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
    .where(eq(blogPosts.id, id))
    .limit(1);

  const [post] = await hydratePosts(rows);
  return post;
}

export async function setBlogPostTags(postId: number, tagIds: number[]): Promise<void> {
  const uniqueTagIds = Array.from(new Set(tagIds.filter(Number.isFinite)));
  await db.delete(blogPostTags).where(eq(blogPostTags.postId, postId));
  if (uniqueTagIds.length === 0) return;

  await db
    .insert(blogPostTags)
    .values(uniqueTagIds.map(tagId => ({ postId, tagId })))
    .onConflictDoNothing();
}

export async function createBlogPost(values: BlogPostInput): Promise<BlogPostWithRelations> {
  const { tagIds = [], ...postValues } = values;
  const [post] = await db
    .insert(blogPosts)
    .values({
      ...postValues,
      updatedAt: new Date(),
    })
    .returning();

  await setBlogPostTags(post.id, tagIds);
  const created = await getBlogPostById(post.id);
  if (!created) throw new Error("Blog post was created but could not be loaded");
  return created;
}

export async function createBlogPostForGenerationRun(
  values: BlogPostInput,
  runId: number,
): Promise<BlogPostWithRelations> {
  const postId = await db.transaction(async tx => {
    const { tagIds = [], ...postValues } = values;
    const [post] = await tx
      .insert(blogPosts)
      .values({
        ...postValues,
        updatedAt: new Date(),
      })
      .returning({ id: blogPosts.id });

    const uniqueTagIds = Array.from(new Set(tagIds.filter(Number.isFinite)));
    if (uniqueTagIds.length > 0) {
      await tx
        .insert(blogPostTags)
        .values(uniqueTagIds.map(tagId => ({ postId: post.id, tagId })))
        .onConflictDoNothing();
    }

    const [linkedRun] = await tx
      .update(blogGenerationRuns)
      .set({
        postId: post.id,
        heartbeatAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(
        eq(blogGenerationRuns.id, runId),
        eq(blogGenerationRuns.status, "running"),
        isNull(blogGenerationRuns.postId),
      ))
      .returning({ id: blogGenerationRuns.id });
    if (!linkedRun) {
      throw new Error("Generation run could not claim its draft");
    }

    return post.id;
  });

  const created = await getBlogPostById(postId);
  if (!created) throw new Error("Generated blog post was committed but could not be loaded");
  return created;
}

export async function updateBlogPost(id: number, values: Partial<BlogPostInput>): Promise<BlogPostWithRelations | undefined> {
  const { tagIds, ...postValues } = values;
  const [updated] = await db
    .update(blogPosts)
    .set({
      ...postValues,
      updatedAt: new Date(),
    })
    .where(eq(blogPosts.id, id))
    .returning();

  if (!updated) return undefined;
  if (tagIds) {
    await setBlogPostTags(id, tagIds);
  }

  return getBlogPostById(id);
}

export async function updateBlogPostStatusWithImageGuard(
  id: number,
  status: BlogPostStatus,
  publishedAt?: Date,
): Promise<BlogPostWithRelations | undefined> {
  await db.transaction(async tx => {
    const [post] = await tx
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1)
      .for("update");
    if (!post) return;

    const [blockingImage] = await tx
      .select({ id: blogPostImages.id })
      .from(blogPostImages)
      .where(and(
        eq(blogPostImages.postId, id),
        or(
          eq(blogPostImages.generationStatus, "generating"),
          eq(blogPostImages.errorCode, "deletion_pending"),
        ),
      ))
      .limit(1);
    if (blockingImage) {
      throw Object.assign(
        new Error("Wait for image generation or deletion to finish before publishing"),
        { statusCode: 409 },
      );
    }

    await tx
      .update(blogPosts)
      .set({
        status,
        ...(status === "published" && publishedAt ? { publishedAt } : {}),
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, id));
  });
  return getBlogPostById(id);
}

export async function deleteBlogPostWithRedirect(
  id: number,
  redirectValues?: BlogRedirectInput,
): Promise<{ deleted: boolean; redirect: BlogRedirect | null }> {
  return db.transaction(async tx => {
    const deleted = await tx
      .delete(blogPosts)
      .where(eq(blogPosts.id, id))
      .returning({ id: blogPosts.id });

    if (deleted.length === 0) {
      return { deleted: false, redirect: null };
    }

    if (!redirectValues) {
      return { deleted: true, redirect: null };
    }

    const sourcePath = normalizeInternalPath(redirectValues.sourcePath);
    const targetPath = normalizeInternalPath(redirectValues.targetPath);
    const [redirect] = await tx
      .insert(blogRedirects)
      .values({
        ...redirectValues,
        sourcePath,
        targetPath,
        sourcePostId: null,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: blogRedirects.sourcePath,
        set: {
          targetPath,
          statusCode: redirectValues.statusCode || 301,
          reason: redirectValues.reason || null,
          isActive: redirectValues.isActive ?? true,
          sourcePostId: null,
          updatedAt: new Date(),
        },
      })
      .returning();

    return { deleted: true, redirect };
  });
}

export async function findBlogPostsLinkingToPath(
  targetPath: string,
  options: FindInternalLinkOptions = {},
): Promise<BlogInternalLinkImpact[]> {
  const normalizedPath = normalizeInternalPath(targetPath);
  const conditions: SQL[] = [
    or(
      ilike(blogPosts.content, `%href="${normalizedPath}"%`),
      ilike(blogPosts.content, `%href='${normalizedPath}'%`),
      ilike(blogPosts.content, `%href="${normalizedPath}?%`),
      ilike(blogPosts.content, `%href='${normalizedPath}?%`),
      ilike(blogPosts.content, `%href="${normalizedPath}#%`),
      ilike(blogPosts.content, `%href='${normalizedPath}#%`),
    )!,
  ];
  if (options.status && options.status !== "all") {
    conditions.push(eq(blogPosts.status, options.status));
  }
  if (options.excludePostId) {
    conditions.push(ne(blogPosts.id, options.excludePostId));
  }

  const rows = await db
    .select({ post: blogPosts })
    .from(blogPosts)
    .where(and(...conditions))
    .orderBy(desc(blogPosts.publishedAt), desc(blogPosts.updatedAt));

  return rows.map(row => ({
    id: row.post.id,
    title: row.post.title,
    slug: row.post.slug,
    language: row.post.language as BlogLanguage,
    status: row.post.status,
    path: getBlogPostPath(row.post),
  }));
}

export async function findPublishedPostsLinkingToPost(
  targetPost: Pick<BlogPostWithRelations, "id" | "slug" | "language">,
): Promise<BlogInternalLinkImpact[]> {
  return findBlogPostsLinkingToPath(getBlogPostPath(targetPost), {
    status: "published",
    excludePostId: targetPost.id,
  });
}

export async function getBlogRedirects(): Promise<BlogRedirect[]> {
  return db.select().from(blogRedirects).orderBy(desc(blogRedirects.updatedAt), desc(blogRedirects.createdAt));
}

export async function getBlogRedirectById(id: number): Promise<BlogRedirect | undefined> {
  const [redirect] = await db.select().from(blogRedirects).where(eq(blogRedirects.id, id)).limit(1);
  return redirect;
}

export async function getActiveBlogRedirect(sourcePath: string): Promise<BlogRedirect | undefined> {
  const normalizedPath = normalizeInternalPath(sourcePath);
  const [redirect] = await db
    .select()
    .from(blogRedirects)
    .where(
      and(
        eq(blogRedirects.sourcePath, normalizedPath),
        eq(blogRedirects.isActive, true),
      ),
    )
    .limit(1);
  return redirect;
}

export async function deactivateBlogRedirect(sourcePath: string): Promise<BlogRedirect | undefined> {
  const normalizedPath = normalizeInternalPath(sourcePath);
  const [redirect] = await db
    .update(blogRedirects)
    .set({
      isActive: false,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(blogRedirects.sourcePath, normalizedPath),
        eq(blogRedirects.isActive, true),
      ),
    )
    .returning();
  return redirect;
}

export async function upsertBlogRedirect(values: BlogRedirectInput): Promise<BlogRedirect> {
  const [redirect] = await db
    .insert(blogRedirects)
    .values({
      ...values,
      sourcePath: normalizeInternalPath(values.sourcePath),
      targetPath: normalizeInternalPath(values.targetPath),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: blogRedirects.sourcePath,
      set: {
        targetPath: normalizeInternalPath(values.targetPath),
        statusCode: values.statusCode || 301,
        reason: values.reason || null,
        isActive: values.isActive ?? true,
        sourcePostId: values.sourcePostId || null,
        updatedAt: new Date(),
      },
    })
    .returning();
  return redirect;
}

export async function getBlogAuthors(): Promise<BlogAuthor[]> {
  return db.select().from(blogAuthors).orderBy(blogAuthors.name);
}

export async function getBlogCategories(language?: BlogLanguage): Promise<BlogCategory[]> {
  const query = db.select().from(blogCategories);
  if (language) {
    return query.where(eq(blogCategories.language, language)).orderBy(blogCategories.name);
  }
  return query.orderBy(blogCategories.language, blogCategories.name);
}

export async function getBlogTags(language?: BlogLanguage): Promise<BlogTag[]> {
  const query = db.select().from(blogTags);
  if (language) {
    return query.where(eq(blogTags.language, language)).orderBy(blogTags.name);
  }
  return query.orderBy(blogTags.language, blogTags.name);
}

export async function createBlogCategory(values: InsertBlogCategory): Promise<BlogCategory> {
  const [created] = await db.insert(blogCategories).values(values).returning();
  return created;
}

export async function createBlogTag(values: InsertBlogTag): Promise<BlogTag> {
  const [created] = await db.insert(blogTags).values(values).returning();
  return created;
}

export async function getBlogStats(): Promise<Record<BlogPostStatus, number>> {
  const rows = await db
    .select({
      status: blogPosts.status,
      total: count(),
    })
    .from(blogPosts)
    .groupBy(blogPosts.status);

  const stats: Record<BlogPostStatus, number> = {
    draft: 0,
    pending_review: 0,
    published: 0,
    rejected: 0,
  };

  for (const row of rows) {
    stats[row.status] = Number(row.total);
  }

  return stats;
}

export async function getBlogPostBySlug(
  slug: string,
  language: BlogLanguage,
): Promise<BlogPostWithRelations | undefined> {
  const rows = await db
    .select({
      post: blogPosts,
      author: blogAuthors,
      category: blogCategories,
    })
    .from(blogPosts)
    .leftJoin(blogAuthors, eq(blogPosts.authorId, blogAuthors.id))
    .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
    .where(
      and(
        eq(blogPosts.slug, slug),
        eq(blogPosts.language, language),
        eq(blogPosts.status, "published"),
      ),
    )
    .limit(1);

  const [post] = await hydratePosts(rows);
  return post;
}

export async function getAnyBlogPostBySlug(
  slug: string,
  language: BlogLanguage,
): Promise<BlogPostWithRelations | undefined> {
  const rows = await db
    .select({
      post: blogPosts,
      author: blogAuthors,
      category: blogCategories,
    })
    .from(blogPosts)
    .leftJoin(blogAuthors, eq(blogPosts.authorId, blogAuthors.id))
    .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
    .where(
      and(
        eq(blogPosts.slug, slug),
        eq(blogPosts.language, language),
      ),
    )
    .limit(1);

  const [post] = await hydratePosts(rows);
  return post;
}

export async function getPostTranslations(
  translationGroupId: string,
): Promise<BlogPostWithRelations[]> {
  const rows = await db
    .select({
      post: blogPosts,
      author: blogAuthors,
      category: blogCategories,
    })
    .from(blogPosts)
    .leftJoin(blogAuthors, eq(blogPosts.authorId, blogAuthors.id))
    .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
    .where(
      and(
        eq(blogPosts.translationGroupId, translationGroupId),
        eq(blogPosts.status, "published"),
      ),
    )
    .orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt));

  return hydratePosts(rows);
}
