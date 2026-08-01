import { and, count, desc, eq, ilike, inArray, isNull, lt, ne, or, type SQL } from "drizzle-orm";
import {
  blogAuthors,
  blogCategories,
  blogImageCleanupQueue,
  blogGenerationRuns,
  blogLinks,
  blogLinkSources,
  blogPostLinks,
  blogPostImages,
  blogPosts,
  blogPostTags,
  blogRedirects,
  blogTags,
  type BlogRedirect,
  type BlogAuthor,
  type BlogCategory,
  type BlogLink,
  type BlogPost,
  type BlogPostStatus,
  type BlogTag,
  type InsertBlogCategory,
  type InsertBlogPost,
  type InsertBlogRedirect,
  type InsertBlogTag,
} from "@shared/schema";
import { db } from "../db";
import { isBlogLinkEnabled } from "./links/config";
import {
  assertBlogPostSnapshotMatches,
  assertBlogRedirectPublishSnapshotMatches,
  planBlogPostImageObjectDeletion,
  type BlogRedirectSnapshot,
} from "./lifecycle";
import {
  lockBlogRedirectPaths,
  type BlogRedirectTransaction,
} from "./redirect-lock";

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

export type BlogPostUpdateGuard = {
  expectedStatus?: BlogPostStatus;
  expectedUpdatedAt?: Date;
};

export type BlogPostStatusTransitionGuard = BlogPostUpdateGuard & {
  linkVersions?: Array<{ id: number; updatedAt: Date }>;
  sourceVersions?: Array<{ id: number; updatedAt: Date }>;
  managedTargetVersion?: {
    id: number;
    updatedAt: Date;
  };
  redirectSnapshot?: BlogRedirectSnapshot | null;
};

export type BlogRedirectInput = InsertBlogRedirect;

export type BlogPostStatusTransitionEffects = {
  redirect?: BlogRedirectInput | null;
  deactivateRedirectPath?: string | null;
};

export type BlogPostStatusTransitionResult = {
  post: BlogPostWithRelations;
  redirect: BlogRedirect | null;
  deactivatedRedirect: BlogRedirect | null;
  managedTarget: BlogLink | null;
};

export type BlogPostDeleteOptions = {
  expectedStatus: BlogPostStatus;
  expectedUpdatedAt: Date;
};

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

async function assertNoActiveRedirectAtTarget(
  tx: BlogRedirectTransaction,
  targetPath: string,
): Promise<void> {
  const [activeTargetRedirect] = await tx
    .select({ id: blogRedirects.id })
    .from(blogRedirects)
    .where(and(
      eq(blogRedirects.sourcePath, normalizeInternalPath(targetPath)),
      eq(blogRedirects.isActive, true),
    ))
    .limit(1)
    .for("update");
  if (activeTargetRedirect) {
    throw Object.assign(
      new Error("Redirect target became another active redirect; choose the final destination and retry."),
      {
        statusCode: 409,
        code: "blog_redirect_target_changed",
      },
    );
  }
}

async function assertRedirectSourceIsNotPublished(
  tx: BlogRedirectTransaction,
  sourcePath: string,
): Promise<void> {
  const parsed = getBlogSlugFromPath(sourcePath);
  if (!parsed) return;
  const [sourcePost] = await tx
    .select({
      id: blogPosts.id,
      status: blogPosts.status,
    })
    .from(blogPosts)
    .where(and(
      eq(blogPosts.language, parsed.language),
      eq(blogPosts.slug, parsed.slug),
    ))
    .limit(1)
    .for("update");
  if (sourcePost?.status === "published") {
    throw Object.assign(
      new Error("Redirect source is currently a published post URL; unpublish or delete the post before redirecting it"),
      {
        statusCode: 409,
        code: "blog_redirect_source_published",
      },
    );
  }
}

async function getTagsForPostIds(postIds: number[]): Promise<Map<number, BlogTag[]>> {
  const tagMap = new Map<number, BlogTag[]>();
  if (postIds.length === 0) return tagMap;

  const rows = await db
    .select({
      postId: blogPostTags.postId,
      position: blogPostTags.position,
      tag: blogTags,
    })
    .from(blogPostTags)
    .innerJoin(blogTags, eq(blogPostTags.tagId, blogTags.id))
    .where(inArray(blogPostTags.postId, postIds))
    .orderBy(blogPostTags.postId, blogPostTags.position, blogPostTags.tagId);

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
    .orderBy(desc(blogPosts.updatedAt), desc(blogPosts.createdAt), desc(blogPosts.id))
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
    .values(uniqueTagIds.map((tagId, position) => ({ postId, tagId, position })))
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
        .values(uniqueTagIds.map((tagId, position) => ({ postId: post.id, tagId, position })))
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

export async function updateBlogPost(
  id: number,
  values: Partial<BlogPostInput>,
  guard: BlogPostUpdateGuard = {},
): Promise<BlogPostWithRelations | undefined> {
  const { tagIds, ...postValues } = values;
  const guarded = guard.expectedStatus !== undefined || guard.expectedUpdatedAt !== undefined;
  const updated = await db.transaction(async tx => {
    const conditions: SQL[] = [eq(blogPosts.id, id)];
    if (guard.expectedStatus !== undefined) {
      conditions.push(eq(blogPosts.status, guard.expectedStatus));
    }
    if (guard.expectedUpdatedAt !== undefined) {
      conditions.push(eq(blogPosts.updatedAt, guard.expectedUpdatedAt));
    }

    const [updatedRow] = await tx
      .update(blogPosts)
      .set({
        ...postValues,
        updatedAt: new Date(),
      })
      .where(and(...conditions))
      .returning({ id: blogPosts.id });

    if (!updatedRow) {
      if (guarded) {
        const [current] = await tx
          .select({ id: blogPosts.id })
          .from(blogPosts)
          .where(eq(blogPosts.id, id))
          .limit(1);
        if (current) {
          throw Object.assign(
            new Error("The post changed while this edit was being applied. Reopen it and review the latest draft before saving again."),
            {
              statusCode: 409,
              code: "blog_post_edit_conflict",
            },
          );
        }
      }
      return false;
    }

    if (tagIds !== undefined) {
      const uniqueTagIds = Array.from(new Set(tagIds.filter(Number.isFinite)));
      await tx.delete(blogPostTags).where(eq(blogPostTags.postId, id));
      if (uniqueTagIds.length > 0) {
        await tx
          .insert(blogPostTags)
          .values(uniqueTagIds.map((tagId, position) => ({ postId: id, tagId, position })))
          .onConflictDoNothing();
      }
    }
    if (
      isBlogLinkEnabled()
      && (
        postValues.slug !== undefined
        || postValues.language !== undefined
        || postValues.title !== undefined
      )
    ) {
      await tx
        .update(blogLinks)
        .set({
          generationEligible: false,
          healthStatus: "stale",
          nextCheckAt: null,
          lastErrorCode: "target_post_changed",
          updatedAt: new Date(),
        })
        .where(or(
          eq(blogLinks.targetPostId, id),
          eq(blogLinks.stableKey, `blog-post-${id}`),
        ));
    }
    return true;
  });

  if (!updated) return undefined;

  return getBlogPostById(id);
}

export async function updateBlogPostStatusWithImageGuard(
  id: number,
  status: BlogPostStatus,
  publishedAt?: Date,
  guard: BlogPostStatusTransitionGuard = {},
  effects: BlogPostStatusTransitionEffects = {},
): Promise<BlogPostStatusTransitionResult | undefined> {
  const transition = await db.transaction(async tx => {
    const [post] = await tx
      .select({
        id: blogPosts.id,
        status: blogPosts.status,
        slug: blogPosts.slug,
        language: blogPosts.language,
        updatedAt: blogPosts.updatedAt,
      })
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1)
      .for("update");
    if (!post) return null;

    assertBlogPostSnapshotMatches(
      post,
      guard,
      {
        message: "The post changed after verification. Reopen it, run Verify again, and then publish.",
        code: "blog_post_publish_snapshot_changed",
      },
    );

    const redirectInput = effects.redirect
      ? {
          ...effects.redirect,
          sourcePath: normalizeInternalPath(effects.redirect.sourcePath),
          targetPath: normalizeInternalPath(effects.redirect.targetPath),
        }
      : null;
    const deactivateRedirectPath = effects.deactivateRedirectPath
      ? normalizeInternalPath(effects.deactivateRedirectPath)
      : null;
    await lockBlogRedirectPaths(tx, [
      redirectInput?.sourcePath,
      redirectInput?.targetPath,
      deactivateRedirectPath,
    ]);
    if (guard.redirectSnapshot !== undefined) {
      const snapshotPath = guard.redirectSnapshot?.sourcePath || deactivateRedirectPath;
      if (!snapshotPath) {
        throw Object.assign(
          new Error("Publication redirect snapshot is missing its article path. Run Verify again."),
          {
            statusCode: 409,
            code: "blog_redirect_publish_snapshot_missing_path",
          },
        );
      }
      const [currentRedirect] = await tx
        .select({
          id: blogRedirects.id,
          sourcePath: blogRedirects.sourcePath,
          targetPath: blogRedirects.targetPath,
          isActive: blogRedirects.isActive,
          updatedAt: blogRedirects.updatedAt,
        })
        .from(blogRedirects)
        .where(eq(blogRedirects.sourcePath, snapshotPath))
        .limit(1)
        .for("update");
      assertBlogRedirectPublishSnapshotMatches(
        currentRedirect,
        guard.redirectSnapshot,
      );
    }
    if (redirectInput) {
      await assertNoActiveRedirectAtTarget(tx, redirectInput.targetPath);
    }

    const sourceVersions = [...(guard.sourceVersions || [])]
      .sort((left, right) => left.id - right.id);
    if (sourceVersions.length > 0) {
      const sourceRows = await tx
        .select({
          id: blogLinkSources.id,
          updatedAt: blogLinkSources.updatedAt,
        })
        .from(blogLinkSources)
        .where(inArray(blogLinkSources.id, sourceVersions.map(item => item.id)))
        .orderBy(blogLinkSources.id)
        .for("update");
      const currentById = new Map(sourceRows.map(row => [row.id, row.updatedAt]));
      const changed = sourceVersions.some(expected => (
        currentById.get(expected.id)?.getTime() !== expected.updatedAt.getTime()
      ));
      if (changed) {
        throw Object.assign(
          new Error("A link publisher review changed after verification. Run Verify again before publishing."),
          {
            statusCode: 409,
            code: "blog_link_source_publish_snapshot_changed",
          },
        );
      }
    }

    const linkVersions = [...(guard.linkVersions || [])]
      .sort((left, right) => left.id - right.id);
    if (linkVersions.length > 0) {
      const linkRows = await tx
        .select({
          id: blogLinks.id,
          updatedAt: blogLinks.updatedAt,
        })
        .from(blogLinks)
        .where(inArray(blogLinks.id, linkVersions.map(item => item.id)))
        .orderBy(blogLinks.id)
        .for("update");
      const currentById = new Map(linkRows.map(row => [row.id, row.updatedAt]));
      const changed = linkVersions.some(expected => (
        currentById.get(expected.id)?.getTime() !== expected.updatedAt.getTime()
      ));
      if (changed) {
        throw Object.assign(
          new Error("A managed link changed after verification. Run Verify again before publishing."),
          {
            statusCode: 409,
            code: "blog_link_publish_snapshot_changed",
          },
        );
      }
    }

    const imageStaleBefore = new Date(Date.now() - 15 * 60 * 1000);
    await tx
      .update(blogPostImages)
      .set({
        generationStatus: "failed",
        completedAt: new Date(),
        errorCode: "generation_interrupted",
        errorMessage: "Image generation was interrupted before completion. Retry from the draft.",
        updatedAt: new Date(),
      })
      .where(and(
        eq(blogPostImages.postId, id),
        eq(blogPostImages.generationStatus, "generating"),
        lt(blogPostImages.updatedAt, imageStaleBefore),
      ));

    const [blockingImage] = await tx
      .select({ id: blogPostImages.id })
      .from(blogPostImages)
      .where(and(
        eq(blogPostImages.postId, id),
        or(
          eq(blogPostImages.generationStatus, "pending"),
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

    const now = new Date();
    let managedTarget: BlogLink | null = null;
    if (isBlogLinkEnabled() && status === "published") {
      const expectedTarget = guard.managedTargetVersion;
      if (!expectedTarget) {
        throw Object.assign(
          new Error("The managed article target was not prepared. Run Verify again before publishing."),
          {
            statusCode: 409,
            code: "blog_link_target_not_prepared",
          },
        );
      }
      const [target] = await tx
        .select()
        .from(blogLinks)
        .where(eq(blogLinks.id, expectedTarget.id))
        .limit(1)
        .for("update");
      const expectedPath = getBlogPostPath(post);
      if (
        !target
        || target.updatedAt.getTime() !== expectedTarget.updatedAt.getTime()
        || target.targetPostId !== id
        || target.stableKey !== `blog-post-${id}`
        || target.kind !== "internal"
        || target.normalizedHref !== expectedPath
        || target.reviewStatus !== "approved"
        || target.sourceId === null
      ) {
        throw Object.assign(
          new Error("The managed article target changed while publication was being prepared. Run Verify again."),
          {
            statusCode: 409,
            code: "blog_link_target_publish_snapshot_changed",
          },
        );
      }
      const [source] = await tx
        .select({
          id: blogLinkSources.id,
          stableKey: blogLinkSources.stableKey,
          reviewStatus: blogLinkSources.reviewStatus,
        })
        .from(blogLinkSources)
        .where(eq(blogLinkSources.id, target.sourceId))
        .limit(1)
        .for("update");
      if (
        !source
        || source.stableKey !== "healing-minds-psychiatry"
        || source.reviewStatus !== "approved"
      ) {
        throw Object.assign(
          new Error("The approved Healing Minds source changed before publication. Run Verify again."),
          {
            statusCode: 409,
            code: "blog_link_target_source_publish_snapshot_changed",
          },
        );
      }
    }

    await tx
      .update(blogPosts)
      .set({
        status,
        ...(status === "published" && publishedAt ? { publishedAt } : {}),
        updatedAt: now,
      })
      .where(eq(blogPosts.id, id));

    if (isBlogLinkEnabled()) {
      if (status === "published") {
        const [activatedTarget] = await tx
          .update(blogLinks)
          .set({
            generationEligible: true,
            healthStatus: "healthy",
            httpStatus: 200,
            finalHref: getBlogPostPath(post),
            redirectCount: 0,
            consecutiveFailures: 0,
            lastCheckedAt: now,
            lastSuccessfulAt: now,
            nextCheckAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1_000),
            lastErrorCode: null,
            updatedAt: now,
          })
          .where(eq(blogLinks.id, guard.managedTargetVersion!.id))
          .returning();
        if (!activatedTarget) {
          throw Object.assign(
            new Error("The managed article target disappeared before publication. Run Verify again."),
            {
              statusCode: 409,
              code: "blog_link_target_publish_conflict",
            },
          );
        }
        managedTarget = activatedTarget;
      } else {
        await tx
          .update(blogLinks)
          .set({
            generationEligible: false,
            healthStatus: "stale",
            nextCheckAt: null,
            lastErrorCode: "target_not_published",
            updatedAt: now,
          })
          .where(or(
            eq(blogLinks.targetPostId, id),
            eq(blogLinks.stableKey, `blog-post-${id}`),
          ));
      }
    }

    let redirect: BlogRedirect | null = null;
    if (redirectInput) {
      const [upsertedRedirect] = await tx
        .insert(blogRedirects)
        .values({
          ...redirectInput,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: blogRedirects.sourcePath,
          set: {
            targetPath: redirectInput.targetPath,
            statusCode: redirectInput.statusCode || 301,
            reason: redirectInput.reason || null,
            isActive: redirectInput.isActive ?? true,
            sourcePostId: redirectInput.sourcePostId || null,
            updatedAt: now,
          },
        })
        .returning();
      redirect = upsertedRedirect;
    }

    let deactivatedRedirect: BlogRedirect | null = null;
    if (deactivateRedirectPath) {
      const [deactivated] = await tx
        .update(blogRedirects)
        .set({
          isActive: false,
          updatedAt: now,
        })
        .where(and(
          eq(blogRedirects.sourcePath, deactivateRedirectPath),
          eq(blogRedirects.isActive, true),
        ))
        .returning();
      deactivatedRedirect = deactivated || null;
    }

    return {
      redirect,
      deactivatedRedirect,
      managedTarget,
    };
  });
  if (!transition) return undefined;
  const post = await getBlogPostById(id);
  if (!post) {
    throw new Error("Blog post status changed but the updated article could not be loaded");
  }
  return {
    post,
    ...transition,
  };
}

export async function deleteBlogPostWithRedirect(
  id: number,
  redirectValues?: BlogRedirectInput,
  options?: BlogPostDeleteOptions,
): Promise<{ deleted: boolean; redirect: BlogRedirect | null; imageObjectKeys: string[] }> {
  return db.transaction(async tx => {
    const [lockedPost] = await tx
      .select({
        id: blogPosts.id,
        status: blogPosts.status,
        updatedAt: blogPosts.updatedAt,
      })
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1)
      .for("update");
    if (!lockedPost) {
      return { deleted: false, redirect: null, imageObjectKeys: [] };
    }
    if (!options) {
      throw Object.assign(
        new Error("Blog post deletion requires an explicit post snapshot"),
        {
          statusCode: 409,
          code: "blog_post_delete_snapshot_required",
        },
      );
    }
    assertBlogPostSnapshotMatches(
      lockedPost,
      options,
      {
        message: "The article changed while deletion was being prepared. No files or database rows were deleted; refresh and retry.",
        code: "blog_post_delete_snapshot_changed",
      },
    );

    const normalizedRedirect = redirectValues
      ? {
          ...redirectValues,
          sourcePath: normalizeInternalPath(redirectValues.sourcePath),
          targetPath: normalizeInternalPath(redirectValues.targetPath),
        }
      : null;
    if (normalizedRedirect) {
      await lockBlogRedirectPaths(tx, [
        normalizedRedirect.sourcePath,
        normalizedRedirect.targetPath,
      ]);
      await assertNoActiveRedirectAtTarget(tx, normalizedRedirect.targetPath);
    }

    const imageStaleBefore = new Date(Date.now() - 15 * 60 * 1000);
    await tx
      .update(blogPostImages)
      .set({
        generationStatus: "failed",
        completedAt: new Date(),
        errorCode: "generation_interrupted",
        errorMessage: "Image generation was interrupted before completion. Retry from the draft.",
        updatedAt: new Date(),
      })
      .where(and(
        eq(blogPostImages.postId, id),
        eq(blogPostImages.generationStatus, "generating"),
        lt(blogPostImages.updatedAt, imageStaleBefore),
      ));

    const images = await tx
      .select({
        source: blogPostImages.source,
        objectKey: blogPostImages.objectKey,
        generationStatus: blogPostImages.generationStatus,
        errorCode: blogPostImages.errorCode,
      })
      .from(blogPostImages)
      .where(eq(blogPostImages.postId, id))
      .for("update");
    const objectKeys = planBlogPostImageObjectDeletion(images);

    if (objectKeys.length > 0) {
      await tx
        .insert(blogImageCleanupQueue)
        .values(objectKeys.map(objectKey => ({ objectKey })))
        .onConflictDoNothing({ target: blogImageCleanupQueue.objectKey });
    }

    if (isBlogLinkEnabled()) {
      await tx
        .update(blogLinks)
        .set({
          reviewStatus: "retired",
          generationEligible: false,
          healthStatus: "stale",
          lastErrorCode: "target_deleted",
          nextCheckAt: null,
          updatedAt: new Date(),
        })
        .where(or(
          eq(blogLinks.targetPostId, id),
          eq(blogLinks.stableKey, `blog-post-${id}`),
        ));
    }

    const deleted = await tx
      .delete(blogPosts)
      .where(eq(blogPosts.id, id))
      .returning({ id: blogPosts.id });

    if (deleted.length === 0) {
      throw new Error("The locked blog post could not be deleted");
    }

    if (!normalizedRedirect) {
      return { deleted: true, redirect: null, imageObjectKeys: objectKeys };
    }

    const [redirect] = await tx
      .insert(blogRedirects)
      .values({
        ...normalizedRedirect,
        sourcePostId: null,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: blogRedirects.sourcePath,
        set: {
          targetPath: normalizedRedirect.targetPath,
          statusCode: normalizedRedirect.statusCode || 301,
          reason: normalizedRedirect.reason || null,
          isActive: normalizedRedirect.isActive ?? true,
          sourcePostId: null,
          updatedAt: new Date(),
        },
      })
      .returning();

    return { deleted: true, redirect, imageObjectKeys: objectKeys };
  });
}

export async function findBlogPostsLinkingToPath(
  targetPath: string,
  options: FindInternalLinkOptions = {},
): Promise<BlogInternalLinkImpact[]> {
  const normalizedPath = normalizeInternalPath(targetPath);
  if (process.env.BLOG_LINK_ENABLED === "true") {
    const ledgerConditions: SQL[] = [
      eq(blogLinks.kind, "internal"),
      eq(blogLinks.normalizedHref, normalizedPath),
      isNull(blogPostLinks.removedAt),
    ];
    if (options.status && options.status !== "all") {
      ledgerConditions.push(eq(blogPosts.status, options.status));
    }
    if (options.excludePostId) {
      ledgerConditions.push(ne(blogPosts.id, options.excludePostId));
    }
    const ledgerRows = await db
      .selectDistinct({ post: blogPosts })
      .from(blogPostLinks)
      .innerJoin(blogPosts, eq(blogPostLinks.postId, blogPosts.id))
      .innerJoin(blogLinks, eq(blogPostLinks.linkId, blogLinks.id))
      .where(and(...ledgerConditions))
      .orderBy(desc(blogPosts.publishedAt), desc(blogPosts.updatedAt));
    return ledgerRows.map(row => ({
      id: row.post.id,
      title: row.post.title,
      slug: row.post.slug,
      language: row.post.language as BlogLanguage,
      status: row.post.status,
      path: getBlogPostPath(row.post),
    }));
  }

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

export async function getBlogRedirectBySourcePath(sourcePath: string): Promise<BlogRedirect | undefined> {
  const normalizedPath = normalizeInternalPath(sourcePath);
  const [redirect] = await db
    .select()
    .from(blogRedirects)
    .where(eq(blogRedirects.sourcePath, normalizedPath))
    .limit(1);
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
  return db.transaction(async tx => {
    await lockBlogRedirectPaths(tx, [normalizedPath]);
    const [redirect] = await tx
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
  });
}

export async function upsertBlogRedirect(values: BlogRedirectInput): Promise<BlogRedirect> {
  const normalizedValues = {
    ...values,
    sourcePath: normalizeInternalPath(values.sourcePath),
    targetPath: normalizeInternalPath(values.targetPath),
  };
  return db.transaction(async tx => {
    await assertRedirectSourceIsNotPublished(tx, normalizedValues.sourcePath);
    await lockBlogRedirectPaths(tx, [
      normalizedValues.sourcePath,
      normalizedValues.targetPath,
    ]);
    await assertNoActiveRedirectAtTarget(tx, normalizedValues.targetPath);
    const [redirect] = await tx
      .insert(blogRedirects)
      .values({
        ...normalizedValues,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: blogRedirects.sourcePath,
        set: {
          targetPath: normalizedValues.targetPath,
          statusCode: normalizedValues.statusCode || 301,
          reason: normalizedValues.reason || null,
          isActive: normalizedValues.isActive ?? true,
          sourcePostId: normalizedValues.sourcePostId || null,
          updatedAt: new Date(),
        },
      })
      .returning();
    return redirect;
  });
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
