import { createHash } from "node:crypto";
import {
  and,
  count,
  countDistinct,
  desc,
  eq,
  gt,
  ilike,
  inArray,
  isNull,
  lt,
  ne,
  not,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import {
  blogLinkChecks,
  blogLinks,
  blogLinkSources,
  blogPostLinks,
  blogPosts,
  type BlogLink,
  type BlogLinkHealthStatus,
  type BlogLinkReviewStatus,
  type BlogLinkSource,
  type BlogLinkSourceType,
} from "@shared/schema";
import { db } from "../../db";
import {
  getAnyBlogPostBySlug,
  getBlogPostById,
  getBlogPostPath,
  getBlogPostPlainText,
  type BlogLanguage,
} from "../storage";
import { inferHealingMindsCategoryKey } from "../strategy/healing-minds";
import {
  BLOG_LINK_POLICY_VERSION,
  BLOG_LINK_SCORE_THRESHOLDS,
  BLOG_LINK_SCORE_VERSION,
  getBlogLinkConfig,
  getBlogLinkPageReviewTtlMs,
  getBlogLinkSourceReviewTtlMs,
  isBlogLinkPageReviewCurrent,
  isBlogLinkSourceReviewCurrent,
} from "./config";
import {
  createCanonicalBlogLinkKey,
  normalizeBlogLinkHref,
  normalizeBlogLinkSearchText,
} from "./normalization";
import {
  isLiveManagedBlogPostTarget,
  isManagedBlogPostTarget,
} from "./policy";
import {
  extractBlogLinkDocument,
  type RejectedBlogLinkOccurrence,
} from "./extract";
import {
  rankInternalLinkOpportunities,
  scoreInternalLinkOpportunity,
  scoreSourceQuality,
  type SourceQualityBreakdown,
} from "./scoring";
import { isBlogLinkRuntimeEnabled } from "./runtime";

export type ManagedBlogLink = BlogLink & {
  source: BlogLinkSource | null;
  currentUsageCount: number;
  pageReviewDueAt: Date | null;
  sourceReviewDueAt: Date | null;
};

export type BlogLinkListOptions = {
  kind?: "internal" | "external";
  language?: "en" | "es" | "all";
  reviewStatus?: BlogLinkReviewStatus;
  healthStatus?: BlogLinkHealthStatus;
  generationEligible?: boolean;
  sourceId?: number;
  categoryKey?: string;
  contentPillar?: string;
  search?: string;
  page?: number;
  pageSize?: number;
};

export type BlogLinkSummary = {
  publishedBrokenLinks: number;
  pendingMedicalSources: number;
  staleMedicalSources: number;
  linksNeedingHealthCheck: number;
  orphanPublishedPosts: number;
  redirectedReviewNeeded: number;
  generationEligibleLinks: number;
};

export type BlogLinkReportCheck = {
  id: string;
  linkId: number | null;
  href: string;
  label: string;
  severity: "blocking" | "warning" | "info";
  ok: boolean;
  detail: string;
};

export type BlogPostLinkReport = {
  enabled: boolean;
  postId: number;
  blockers: BlogLinkReportCheck[];
  warnings: BlogLinkReportCheck[];
  checks: BlogLinkReportCheck[];
  usages: Array<{
    id: number;
    linkId: number;
    anchorText: string;
    sectionHeading: string | null;
    href: string;
    link: ManagedBlogLink;
  }>;
};

export type BlogInternalLinkOpportunity = {
  stableKey: string;
  sourcePostId: number;
  targetLinkId: number;
  targetPostId: number | null;
  targetTitle: string;
  targetHref: string;
  language: string;
  targetStatus: string;
  score: number;
  band: "recommended" | "optional" | "none";
  reasons: string[];
  breakdown: Record<string, number>;
  existingIncomingLinks: number;
  currentAnchors: string[];
};

function asNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function usageCountExpression() {
  return sql<number>`(
    select count(*)::int
    from ${blogPostLinks}
    where ${blogPostLinks.linkId} = ${blogLinks.id}
      and ${blogPostLinks.removedAt} is null
  )`;
}

function sourceReviewCurrentExpression() {
  return sql<boolean>`(
    ${blogLinkSources.reviewedAt} is not null
    and ${blogLinkSources.reviewedAt} > (
      now() - case
        when ${blogLinkSources.sourceType} = 'crisis' then interval '30 days'
        when ${blogLinkSources.sourceType} in ('academic', 'other') then interval '180 days'
        else interval '90 days'
      end
    )
  )`;
}

function mapManagedLink(row: {
  link: BlogLink;
  source: BlogLinkSource | null;
  currentUsageCount: number;
  targetPost?: {
    id: number;
    status: string;
    slug: string;
    language: string;
  } | null;
}): ManagedBlogLink {
  const currentEligibility = (
    row.link.generationEligible
    && calculateGenerationEligibility(row.link, row.source)
    && isLiveManagedBlogPostTarget(row.link, row.targetPost)
  );
  return {
    ...row.link,
    generationEligible: currentEligibility,
    source: row.source,
    currentUsageCount: asNumber(row.currentUsageCount),
    pageReviewDueAt: row.link.reviewedAt
      ? new Date(
        row.link.reviewedAt.getTime()
        + getBlogLinkPageReviewTtlMs(row.link),
      )
      : null,
    sourceReviewDueAt: row.source?.reviewedAt
      ? new Date(
        row.source.reviewedAt.getTime()
        + getBlogLinkSourceReviewTtlMs(row.source.sourceType),
      )
      : null,
  };
}

async function getManagedBlogLinksByIds(ids: number[]): Promise<Map<number, ManagedBlogLink>> {
  if (ids.length === 0) return new Map();
  const rows = await db
    .select({
      link: blogLinks,
      source: blogLinkSources,
      currentUsageCount: usageCountExpression(),
      targetPost: {
        id: blogPosts.id,
        status: blogPosts.status,
        slug: blogPosts.slug,
        language: blogPosts.language,
      },
    })
    .from(blogLinks)
    .leftJoin(blogLinkSources, eq(blogLinks.sourceId, blogLinkSources.id))
    .leftJoin(blogPosts, eq(blogLinks.targetPostId, blogPosts.id))
    .where(inArray(blogLinks.id, Array.from(new Set(ids))));
  return new Map(rows.map(row => [row.link.id, mapManagedLink(row)]));
}

export async function getBlogLinkSummary(): Promise<BlogLinkSummary> {
  const now = new Date();
  const [
    brokenRows,
    pendingRows,
    staleRows,
    healthDueRows,
    changedRows,
    eligibleRows,
    publishedRows,
    inboundRows,
  ] = await Promise.all([
    db
      .select({ value: countDistinct(blogLinks.id) })
      .from(blogPostLinks)
      .innerJoin(blogPosts, eq(blogPostLinks.postId, blogPosts.id))
      .innerJoin(blogLinks, eq(blogPostLinks.linkId, blogLinks.id))
      .where(and(
        isNull(blogPostLinks.removedAt),
        eq(blogPosts.status, "published"),
        eq(blogLinks.healthStatus, "broken"),
      )),
    db
      .select({ value: count() })
      .from(blogLinkSources)
      .where(and(
        eq(blogLinkSources.reviewStatus, "pending"),
        ne(blogLinkSources.sourceType, "first_party"),
      )),
    db
      .select({
        reviewedAt: blogLinkSources.reviewedAt,
        sourceType: blogLinkSources.sourceType,
      })
      .from(blogLinkSources)
      .where(and(
        eq(blogLinkSources.reviewStatus, "approved"),
        ne(blogLinkSources.sourceType, "first_party"),
      )),
    db
      .select({ value: count() })
      .from(blogLinks)
      .where(and(
        eq(blogLinks.reviewStatus, "approved"),
        or(
          inArray(blogLinks.healthStatus, ["unchecked", "unreachable", "stale"]),
          and(
            eq(blogLinks.healthStatus, "healthy"),
            or(
              isNull(blogLinks.nextCheckAt),
              lt(blogLinks.nextCheckAt, now),
            ),
          ),
        ),
      )),
    db
      .select({ value: count() })
      .from(blogLinks)
      .where(eq(blogLinks.healthStatus, "changed_review_needed")),
    db
      .select({
        link: blogLinks,
        source: blogLinkSources,
        targetPost: {
          id: blogPosts.id,
          status: blogPosts.status,
          slug: blogPosts.slug,
          language: blogPosts.language,
        },
      })
      .from(blogLinks)
      .leftJoin(blogLinkSources, eq(blogLinks.sourceId, blogLinkSources.id))
      .leftJoin(blogPosts, eq(blogLinks.targetPostId, blogPosts.id))
      .where(eq(blogLinks.generationEligible, true)),
    db
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(eq(blogPosts.status, "published")),
    db
      .select({ targetPostId: blogLinks.targetPostId })
      .from(blogPostLinks)
      .innerJoin(blogPosts, eq(blogPostLinks.postId, blogPosts.id))
      .innerJoin(blogLinks, eq(blogPostLinks.linkId, blogLinks.id))
      .where(and(
        isNull(blogPostLinks.removedAt),
        eq(blogPosts.status, "published"),
        eq(blogLinks.kind, "internal"),
        sql`${blogLinks.targetPostId} is not null`,
      )),
  ]);

  const linkedPostIds = new Set(
    inboundRows
      .map(row => row.targetPostId)
      .filter((value): value is number => typeof value === "number"),
  );

  return {
    publishedBrokenLinks: asNumber(brokenRows[0]?.value),
    pendingMedicalSources: asNumber(pendingRows[0]?.value),
    staleMedicalSources: staleRows.filter(source => (
      !isBlogLinkSourceReviewCurrent(source, now)
    )).length,
    linksNeedingHealthCheck: asNumber(healthDueRows[0]?.value),
    orphanPublishedPosts: publishedRows.filter(row => !linkedPostIds.has(row.id)).length,
    redirectedReviewNeeded: asNumber(changedRows[0]?.value),
    generationEligibleLinks: eligibleRows.filter(row => (
      calculateGenerationEligibility(row.link, row.source)
      && isLiveManagedBlogPostTarget(row.link, row.targetPost)
    )).length,
  };
}

export async function listManagedBlogLinks(options: BlogLinkListOptions = {}) {
  const page = Math.max(1, options.page || 1);
  const pageSize = Math.max(1, Math.min(options.pageSize || 25, 100));
  const conditions: SQL[] = [];
  if (options.kind) conditions.push(eq(blogLinks.kind, options.kind));
  if (options.language && options.language !== "all") {
    conditions.push(or(
      eq(blogLinks.language, options.language),
      eq(blogLinks.language, "all"),
    )!);
  }
  if (options.reviewStatus) conditions.push(eq(blogLinks.reviewStatus, options.reviewStatus));
  if (options.healthStatus) conditions.push(eq(blogLinks.healthStatus, options.healthStatus));
  if (options.generationEligible !== undefined) {
    if (options.generationEligible) {
      conditions.push(
        eq(blogLinks.generationEligible, true),
        eq(blogLinks.healthStatus, "healthy"),
        gt(blogLinks.nextCheckAt, new Date()),
        or(
          eq(blogLinks.kind, "internal"),
          and(
            eq(blogLinkSources.reviewStatus, "approved"),
            sourceReviewCurrentExpression(),
          ),
        )!,
      );
    } else {
      conditions.push(or(
        eq(blogLinks.generationEligible, false),
        ne(blogLinks.healthStatus, "healthy"),
        isNull(blogLinks.nextCheckAt),
        lt(blogLinks.nextCheckAt, new Date()),
        and(
          eq(blogLinks.kind, "external"),
          or(
            ne(blogLinkSources.reviewStatus, "approved"),
            not(sourceReviewCurrentExpression()),
          ),
        ),
      )!);
    }
  }
  if (options.sourceId) conditions.push(eq(blogLinks.sourceId, options.sourceId));
  if (options.categoryKey) {
    conditions.push(sql`${blogLinks.categoryKeys} @> ${JSON.stringify([options.categoryKey])}::jsonb`);
  }
  if (options.contentPillar) {
    conditions.push(sql`${blogLinks.contentPillars} @> ${JSON.stringify([options.contentPillar])}::jsonb`);
  }
  if (options.search?.trim()) {
    const pattern = `%${options.search.trim()}%`;
    conditions.push(or(
      ilike(blogLinks.title, pattern),
      ilike(blogLinks.label, pattern),
      ilike(blogLinks.normalizedHref, pattern),
      ilike(blogLinks.host, pattern),
      ilike(blogLinkSources.name, pattern),
    )!);
  }
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [rows, totals] = await Promise.all([
    db
      .select({
        link: blogLinks,
        source: blogLinkSources,
        currentUsageCount: usageCountExpression(),
        targetPost: {
          id: blogPosts.id,
          status: blogPosts.status,
          slug: blogPosts.slug,
          language: blogPosts.language,
        },
      })
      .from(blogLinks)
      .leftJoin(blogLinkSources, eq(blogLinks.sourceId, blogLinkSources.id))
      .leftJoin(blogPosts, eq(blogLinks.targetPostId, blogPosts.id))
      .where(where)
      .orderBy(
        sql`case
          when ${blogLinks.healthStatus} in ('broken', 'changed_review_needed') then 0
          when ${blogLinks.reviewStatus} = 'pending' then 1
          else 2
        end`,
        desc(blogLinks.updatedAt),
        desc(blogLinks.id),
      )
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db
      .select({ value: count() })
      .from(blogLinks)
      .leftJoin(blogLinkSources, eq(blogLinks.sourceId, blogLinkSources.id))
      .where(where),
  ]);
  const total = asNumber(totals[0]?.value);

  return {
    links: rows.map(mapManagedLink),
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
  };
}

export async function getManagedBlogLinkDetail(id: number) {
  const links = await getManagedBlogLinksByIds([id]);
  const link = links.get(id);
  if (!link) return undefined;

  const [usages, checks] = await Promise.all([
    db
      .select({
        id: blogPostLinks.id,
        postId: blogPostLinks.postId,
        postTitle: blogPosts.title,
        postStatus: blogPosts.status,
        anchorText: blogPostLinks.anchorText,
        sectionHeading: blogPostLinks.sectionHeading,
        normalizedHref: blogPostLinks.normalizedHref,
        rawHref: blogPostLinks.rawHref,
        origin: blogPostLinks.origin,
        lastSeenAt: blogPostLinks.lastSeenAt,
        removedAt: blogPostLinks.removedAt,
      })
      .from(blogPostLinks)
      .innerJoin(blogPosts, eq(blogPostLinks.postId, blogPosts.id))
      .where(eq(blogPostLinks.linkId, id))
      .orderBy(sql`${blogPostLinks.removedAt} nulls first`, desc(blogPostLinks.lastSeenAt))
      .limit(200),
    db
      .select()
      .from(blogLinkChecks)
      .where(eq(blogLinkChecks.linkId, id))
      .orderBy(desc(blogLinkChecks.checkedAt), desc(blogLinkChecks.id))
      .limit(100),
  ]);

  return { link, usages, checks };
}

async function resolveTargetPostId(normalizedHref: string): Promise<number | null> {
  const match = normalizedHref.match(/^\/(es\/)?blog\/([^/?#]+)$/);
  if (!match) return null;
  const post = await getAnyBlogPostBySlug(
    decodeURIComponent(match[2]),
    match[1] ? "es" : "en",
  );
  return post?.id || null;
}

export async function syncManagedBlogPostTarget(
  postId: number,
): Promise<ManagedBlogLink | undefined> {
  return upsertManagedBlogPostTarget(postId, { activate: true });
}

export async function prepareManagedBlogPostTargetForPublish(
  postId: number,
): Promise<ManagedBlogLink> {
  const target = await upsertManagedBlogPostTarget(postId, { activate: false });
  if (!target) {
    throw Object.assign(
      new Error("The article could not prepare its managed target for publication"),
      {
        statusCode: 409,
        code: "blog_link_target_prepare_failed",
      },
    );
  }
  return target;
}

async function upsertManagedBlogPostTarget(
  postId: number,
  options: { activate: boolean },
): Promise<ManagedBlogLink | undefined> {
  const stableKey = `blog-post-${postId}`;
  const post = await getBlogPostById(postId);
  const [currentStableTarget] = await db
    .select()
    .from(blogLinks)
    .where(eq(blogLinks.stableKey, stableKey))
    .limit(1);

  if (!post || (options.activate && post.status !== "published")) {
    if (!currentStableTarget) return undefined;
    await db
      .update(blogLinks)
      .set({
        generationEligible: false,
        healthStatus: "stale",
        lastErrorCode: "target_not_published",
        nextCheckAt: null,
        updatedAt: new Date(),
      })
      .where(eq(blogLinks.id, currentStableTarget.id));
    const links = await getManagedBlogLinksByIds([currentStableTarget.id]);
    return links.get(currentStableTarget.id);
  }

  const [firstPartySource] = await db
    .select()
    .from(blogLinkSources)
    .where(eq(blogLinkSources.stableKey, "healing-minds-psychiatry"))
    .limit(1);
  if (!firstPartySource || firstPartySource.reviewStatus !== "approved") {
    throw Object.assign(
      new Error("The approved Healing Minds first-party link source is missing; run the Sprint 19 seed"),
      { statusCode: 409, code: "blog_link_seed_required" },
    );
  }

  const normalized = normalizeBlogLinkHref(getBlogPostPath(post), {
    publicSiteUrl: getBlogLinkConfig().publicSiteUrl,
  });
  const canonicalKey = createCanonicalBlogLinkKey(normalized.normalizedHref);

  const now = new Date();
  const categoryKey = inferHealingMindsCategoryKey(
    `${post.category?.name || ""} ${post.category?.slug || ""} ${post.title}`,
  );
  const values = {
    sourceId: firstPartySource.id,
    kind: "internal" as const,
    normalizedHref: normalized.normalizedHref,
    canonicalKey,
    displayHref: normalized.displayHref,
    host: normalized.host,
    title: post.title,
    label: post.title,
    language: post.language,
    sourceCategory: "first_party_blog_post",
    topicTags: [post.targetKeyword, post.category?.name]
      .filter((value): value is string => Boolean(value)),
    categoryKeys: [categoryKey],
    contentPillars: post.contentPillar ? [post.contentPillar] : [],
    keywords: [post.title, post.targetKeyword, post.category?.name]
      .filter((value): value is string => Boolean(value)),
    summary: "Published Healing Minds educational blog article.",
    evidenceType: "first_party_blog_post",
    evidenceScope: "Contextual internal navigation to a published article.",
    evidenceScore: 100,
    freshnessScore: 100,
    reviewStatus: "approved" as const,
    reviewedBy: "Healing Minds publication lifecycle",
    reviewedAt: now,
    reviewNotes: "First-party target synchronized from the published blog route.",
    generationEligible: options.activate,
    healthStatus: options.activate ? "healthy" as const : "stale" as const,
    httpStatus: options.activate ? 200 : null,
    finalHref: options.activate ? normalized.normalizedHref : null,
    redirectCount: 0,
    consecutiveFailures: 0,
    lastCheckedAt: options.activate ? now : null,
    lastSuccessfulAt: options.activate ? now : null,
    nextCheckAt: options.activate
      ? new Date(now.getTime() + 7 * 24 * 60 * 60 * 1_000)
      : null,
    lastErrorCode: options.activate ? null : "target_not_published",
    scoreBreakdown: { firstParty: 100 },
    scoreVersion: BLOG_LINK_SCORE_VERSION,
    origin: "seed" as const,
    targetPostId: post.id,
    updatedAt: now,
  };

  const linkId = await db.transaction(async tx => {
    const [lockedPost] = await tx
      .select({
        id: blogPosts.id,
        status: blogPosts.status,
        slug: blogPosts.slug,
        language: blogPosts.language,
        updatedAt: blogPosts.updatedAt,
      })
      .from(blogPosts)
      .where(eq(blogPosts.id, post.id))
      .limit(1)
      .for("update");
    if (
      !lockedPost
      || lockedPost.status !== post.status
      || lockedPost.slug !== post.slug
      || lockedPost.language !== post.language
      || lockedPost.updatedAt.getTime() !== post.updatedAt.getTime()
    ) {
      throw Object.assign(
        new Error("The post changed while its managed target was synchronizing; retry from the latest post state"),
        {
          statusCode: 409,
          code: "blog_link_target_sync_conflict",
        },
      );
    }

    const [stableOwner] = await tx
      .select()
      .from(blogLinks)
      .where(eq(blogLinks.stableKey, stableKey))
      .limit(1)
      .for("update");
    const [canonicalOwner] = await tx
      .select()
      .from(blogLinks)
      .where(eq(blogLinks.canonicalKey, canonicalKey))
      .limit(1)
      .for("update");

    if (canonicalOwner && canonicalOwner.normalizedHref !== normalized.normalizedHref) {
      throw Object.assign(
        new Error("Blog link canonical hash collision detected"),
        {
          statusCode: 409,
          code: "blog_link_canonical_collision",
          linkId: canonicalOwner.id,
        },
      );
    }
    if (
      canonicalOwner
      && canonicalOwner.targetPostId !== null
      && canonicalOwner.targetPostId !== post.id
    ) {
      throw Object.assign(
        new Error("The published article URL is already owned by another managed post"),
        {
          statusCode: 409,
          code: "blog_link_canonical_conflict",
          linkId: canonicalOwner.id,
        },
      );
    }
    if (
      canonicalOwner
      && canonicalOwner.id !== stableOwner?.id
      && canonicalOwner.stableKey !== null
      && canonicalOwner.stableKey !== stableKey
    ) {
      throw Object.assign(
        new Error("The published article URL is already owned by another stable managed link"),
        {
          statusCode: 409,
          code: "blog_link_stable_key_conflict",
          linkId: canonicalOwner.id,
        },
      );
    }

    if (stableOwner && stableOwner.id !== canonicalOwner?.id) {
      await tx
        .update(blogLinks)
        .set({
          stableKey: null,
          reviewStatus: "retired",
          generationEligible: false,
          healthStatus: "stale",
          nextCheckAt: null,
          lastErrorCode: "target_url_changed",
          updatedAt: now,
        })
        .where(eq(blogLinks.id, stableOwner.id));
    }

    if (canonicalOwner) {
      const [updated] = await tx
        .update(blogLinks)
        .set({
          stableKey,
          ...values,
        })
        .where(eq(blogLinks.id, canonicalOwner.id))
        .returning({ id: blogLinks.id });
      return updated.id;
    }

    const [created] = await tx
      .insert(blogLinks)
      .values({
        stableKey,
        ...values,
      })
      .onConflictDoNothing()
      .returning({ id: blogLinks.id });
    if (created) return created.id;

    const [concurrentOwner] = await tx
      .select()
      .from(blogLinks)
      .where(eq(blogLinks.canonicalKey, canonicalKey))
      .limit(1)
      .for("update");
    if (
      concurrentOwner
      && concurrentOwner.normalizedHref === normalized.normalizedHref
      && concurrentOwner.targetPostId === post.id
      && (
        concurrentOwner.stableKey === null
        || concurrentOwner.stableKey === stableKey
      )
    ) {
      const [adopted] = await tx
        .update(blogLinks)
        .set({
          stableKey,
          ...values,
        })
        .where(eq(blogLinks.id, concurrentOwner.id))
        .returning({ id: blogLinks.id });
      return adopted.id;
    }
    throw Object.assign(
      new Error("A concurrent managed target creation conflicted with this published URL"),
      {
        statusCode: 409,
        code: "blog_link_target_concurrent_conflict",
      },
    );
  });

  const links = await getManagedBlogLinksByIds([linkId]);
  return links.get(linkId);
}

export async function retireManagedBlogPostTarget(postId: number): Promise<void> {
  await db
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
      eq(blogLinks.targetPostId, postId),
      eq(blogLinks.stableKey, `blog-post-${postId}`),
    ));
}

function manualSourceKey(domain: string): string {
  return `publisher-${createHash("sha256").update(domain).digest("hex").slice(0, 20)}`;
}

export function createManualBlogLinkStableKey(canonicalKey: string): string {
  return `managed-${canonicalKey.slice(0, 24)}`;
}

async function resolveOrCreateLinkSource(input: {
  sourceId?: number | null;
  host: string;
  sourceName?: string | null;
  sourceType?: BlogLinkSourceType | null;
  language: "en" | "es" | "all";
}): Promise<BlogLinkSource> {
  const canonicalDomain = input.host.replace(/^www\./, "");
  if (input.sourceId) {
    const [source] = await db
      .select()
      .from(blogLinkSources)
      .where(eq(blogLinkSources.id, input.sourceId))
      .limit(1);
    if (!source) {
      throw Object.assign(new Error("Selected link publisher was not found"), { statusCode: 400 });
    }
    if (
      source.canonicalDomain.replace(/^www\./, "") !== canonicalDomain
    ) {
      throw Object.assign(new Error("Selected publisher does not match the link host"), { statusCode: 400 });
    }
    return source;
  }

  const [existing] = await db
    .select()
    .from(blogLinkSources)
    .where(eq(blogLinkSources.canonicalDomain, canonicalDomain))
    .limit(1);
  if (existing) return existing;

  const [created] = await db
    .insert(blogLinkSources)
    .values({
      stableKey: manualSourceKey(canonicalDomain),
      name: (input.sourceName || canonicalDomain).slice(0, 255),
      canonicalDomain,
      sourceType: input.sourceType || "other",
      languages: input.language === "all" ? ["en", "es"] : [input.language],
      reviewStatus: "pending",
      qualityScore: 0,
      qualityBreakdown: {},
      scoreVersion: BLOG_LINK_SCORE_VERSION,
      updatedAt: new Date(),
    })
    .onConflictDoNothing()
    .returning();
  if (created) return created;
  const [raceWinner] = await db
    .select()
    .from(blogLinkSources)
    .where(eq(blogLinkSources.canonicalDomain, canonicalDomain))
    .limit(1);
  if (!raceWinner) throw new Error("Link publisher could not be resolved");
  return raceWinner;
}

export async function createManagedBlogLink(input: {
  href: string;
  stableKey?: string | null;
  title: string;
  label?: string | null;
  language: "en" | "es" | "all";
  sourceId?: number | null;
  sourceName?: string | null;
  sourceType?: BlogLinkSourceType | null;
  sourceCategory?: string | null;
  topicTags?: string[];
  categoryKeys?: string[];
  contentPillars?: string[];
  keywords?: string[];
  summary?: string | null;
  evidenceType?: string | null;
  evidenceScope?: string | null;
}): Promise<ManagedBlogLink> {
  const normalized = normalizeBlogLinkHref(input.href, {
    publicSiteUrl: getBlogLinkConfig().publicSiteUrl,
  });
  const canonicalKey = createCanonicalBlogLinkKey(normalized.normalizedHref);
  const [duplicate] = await db
    .select({
      id: blogLinks.id,
      normalizedHref: blogLinks.normalizedHref,
    })
    .from(blogLinks)
    .where(eq(blogLinks.canonicalKey, canonicalKey))
    .limit(1);
  if (duplicate) {
    if (duplicate.normalizedHref !== normalized.normalizedHref) {
      throw Object.assign(
        new Error("Blog link canonical hash collision detected"),
        {
          statusCode: 409,
          code: "blog_link_canonical_collision",
          linkId: duplicate.id,
        },
      );
    }
    throw Object.assign(new Error("This normalized link is already in the library"), {
      statusCode: 409,
      linkId: duplicate.id,
    });
  }

  const source = normalized.kind === "external"
    ? await resolveOrCreateLinkSource({
      sourceId: input.sourceId,
      host: normalized.host,
      sourceName: input.sourceName,
      sourceType: input.sourceType,
      language: input.language,
    })
    : null;
  const targetPostId = normalized.kind === "internal"
    ? await resolveTargetPostId(normalized.normalizedHref)
    : null;

  const [created] = await db
    .insert(blogLinks)
    .values({
      stableKey: input.stableKey || createManualBlogLinkStableKey(canonicalKey),
      sourceId: source?.id || null,
      kind: normalized.kind,
      normalizedHref: normalized.normalizedHref,
      canonicalKey,
      displayHref: normalized.displayHref,
      host: normalized.host,
      title: input.title,
      label: input.label || input.title,
      language: input.language,
      sourceCategory: input.sourceCategory || null,
      topicTags: input.topicTags || [],
      categoryKeys: input.categoryKeys || [],
      contentPillars: input.contentPillars || [],
      keywords: input.keywords || [],
      summary: input.summary || null,
      evidenceType: input.evidenceType || null,
      evidenceScope: input.evidenceScope || null,
      evidenceScore: 0,
      freshnessScore: 0,
      reviewStatus: "pending",
      generationEligible: false,
      healthStatus: "unchecked",
      scoreBreakdown: {},
      scoreVersion: BLOG_LINK_SCORE_VERSION,
      origin: "manual",
      targetPostId,
      updatedAt: new Date(),
    })
    .returning();
  const links = await getManagedBlogLinksByIds([created.id]);
  return links.get(created.id)!;
}

export async function updateManagedBlogLink(
  id: number,
  input: Partial<{
    title: string;
    label: string;
    language: "en" | "es" | "all";
    sourceCategory: string | null;
    topicTags: string[];
    categoryKeys: string[];
    contentPillars: string[];
    keywords: string[];
    summary: string | null;
    evidenceType: string | null;
    evidenceScope: string | null;
    evidenceScore: number;
    freshnessScore: number;
  }>,
): Promise<ManagedBlogLink | undefined> {
  const existingLinks = await getManagedBlogLinksByIds([id]);
  const existing = existingLinks.get(id);
  if (!existing) return undefined;
  const nextLink: BlogLink = {
    ...existing,
    ...input,
  };
  const scoreBreakdown = {
    ...(existing.scoreBreakdown || {}),
    ...(input.evidenceScore !== undefined ? { evidenceScore: input.evidenceScore } : {}),
    ...(input.freshnessScore !== undefined ? { freshnessScore: input.freshnessScore } : {}),
  };
  const [updated] = await db
    .update(blogLinks)
    .set({
      ...input,
      generationEligible: calculateGenerationEligibility(nextLink, existing.source),
      updatedAt: new Date(),
      scoreBreakdown,
      scoreVersion: BLOG_LINK_SCORE_VERSION,
    })
    .where(eq(blogLinks.id, id))
    .returning({ id: blogLinks.id });
  if (!updated) return undefined;
  const links = await getManagedBlogLinksByIds([id]);
  return links.get(id);
}

function isCriticalSource(link: BlogLink, source: BlogLinkSource | null): boolean {
  return (
    link.sourceCategory === "clinical"
    || link.sourceCategory === "crisis"
    || source?.sourceType === "crisis"
    || source?.sourceType === "professional_guideline"
  );
}

function sourceSupportsLinkLanguage(link: BlogLink, source: BlogLinkSource): boolean {
  if (link.language === "all") {
    return source.languages.includes("en") && source.languages.includes("es");
  }
  return source.languages.includes(link.language);
}

export function calculateGenerationEligibility(
  link: BlogLink,
  source: BlogLinkSource | null,
  reviewStatus: BlogLinkReviewStatus = link.reviewStatus,
): boolean {
  if (reviewStatus !== "approved") return false;
  if (link.kind === "internal") {
    return (
      link.healthStatus === "healthy"
      && Boolean(link.nextCheckAt && link.nextCheckAt.getTime() > Date.now())
    );
  }
  if (!source || source.reviewStatus !== "approved") return false;
  if (!sourceSupportsLinkLanguage(link, source)) return false;
  if (!isBlogLinkSourceReviewCurrent(source)) return false;
  if (!isBlogLinkPageReviewCurrent(link)) return false;
  if (link.healthStatus !== "healthy") return false;
  if (!link.nextCheckAt || link.nextCheckAt.getTime() <= Date.now()) return false;
  const critical = isCriticalSource(link, source);
  const qualityThreshold = critical
    ? BLOG_LINK_SCORE_THRESHOLDS.sourceQualityCritical
    : BLOG_LINK_SCORE_THRESHOLDS.sourceQualityNormal;
  const evidenceThreshold = critical
    ? BLOG_LINK_SCORE_THRESHOLDS.pageEvidenceCritical
    : BLOG_LINK_SCORE_THRESHOLDS.pageEvidenceNormal;
  return (
    source.qualityScore >= qualityThreshold
    && link.evidenceScore >= evidenceThreshold
  );
}

export async function reviewManagedBlogLink(input: {
  id: number;
  reviewStatus: BlogLinkReviewStatus;
  reviewedBy: string;
  reviewNotes: string;
}): Promise<ManagedBlogLink | undefined> {
  const links = await getManagedBlogLinksByIds([input.id]);
  const existing = links.get(input.id);
  if (!existing) return undefined;
  const reviewedAt = new Date();
  const reviewedLink: BlogLink = {
    ...existing,
    reviewStatus: input.reviewStatus,
    reviewedAt,
  };
  const generationEligible = calculateGenerationEligibility(
    reviewedLink,
    existing.source,
    input.reviewStatus,
  );
  await db
    .update(blogLinks)
    .set({
      ...(
        input.reviewStatus === "approved" && !existing.stableKey
          ? { stableKey: createManualBlogLinkStableKey(existing.canonicalKey) }
          : {}
      ),
      reviewStatus: input.reviewStatus,
      generationEligible,
      reviewedBy: input.reviewedBy,
      reviewedAt,
      reviewNotes: input.reviewNotes,
      updatedAt: new Date(),
    })
    .where(eq(blogLinks.id, input.id));
  const refreshed = await getManagedBlogLinksByIds([input.id]);
  return refreshed.get(input.id);
}

export async function listManagedBlogLinkSources(): Promise<BlogLinkSource[]> {
  return db
    .select()
    .from(blogLinkSources)
    .orderBy(blogLinkSources.name);
}

export async function reviewManagedBlogLinkSource(input: {
  id: number;
  reviewStatus: BlogLinkReviewStatus;
  reviewedBy: string;
  reviewNotes: string;
  qualityBreakdown: SourceQualityBreakdown;
  languages: Array<"en" | "es">;
}): Promise<BlogLinkSource | undefined> {
  const score = scoreSourceQuality(input.qualityBreakdown);
  const [source] = await db
    .update(blogLinkSources)
    .set({
      reviewStatus: input.reviewStatus,
      reviewedBy: input.reviewedBy,
      reviewedAt: new Date(),
      reviewNotes: input.reviewNotes,
      qualityScore: score.total,
      qualityBreakdown: score.breakdown,
      languages: Array.from(new Set(input.languages)).sort(),
      scoreVersion: score.scoreVersion,
      updatedAt: new Date(),
    })
    .where(eq(blogLinkSources.id, input.id))
    .returning();
  if (!source) return undefined;

  const childRows = await db
    .select()
    .from(blogLinks)
    .where(eq(blogLinks.sourceId, source.id));
  for (const link of childRows) {
    await db
      .update(blogLinks)
      .set({
        generationEligible: calculateGenerationEligibility(link, source),
        updatedAt: new Date(),
      })
      .where(eq(blogLinks.id, link.id));
  }
  return source;
}

function linkReportCheck(
  link: ManagedBlogLink,
  severity: "blocking" | "warning" | "info",
  id: string,
  label: string,
  detail: string,
): BlogLinkReportCheck {
  return {
    id,
    linkId: link.id,
    href: link.normalizedHref,
    label,
    severity,
    ok: false,
    detail,
  };
}

function rejectedLinkDetail(rejected: RejectedBlogLinkOccurrence): string {
  const context = rejected.sectionHeading
    ? ` under "${rejected.sectionHeading}"`
    : "";
  const anchor = rejected.anchorText
    ? ` Anchor: "${rejected.anchorText}".`
    : "";
  const reason = rejected.reasonCode === "external_https_required"
    ? "External article links must use HTTPS."
    : rejected.reasonCode === "non_public_internal_path"
      ? "Private admin, API, and application paths cannot be article destinations."
      : rejected.reasonCode === "internal_asset_path"
        ? "Files and application assets cannot be managed article destinations."
        : rejected.reasonCode === "private_or_reserved_host"
          ? "Private, local, metadata, documentation, and reserved hosts are blocked."
          : "The destination does not satisfy the managed-link URL policy.";
  return `${reason}${anchor}${context ? ` Found${context}.` : ""}`;
}

export function buildRejectedBlogLinkChecks(
  rejectedOccurrences: readonly RejectedBlogLinkOccurrence[],
): BlogLinkReportCheck[] {
  return rejectedOccurrences.map(rejected => ({
    id: `rejected-link-${rejected.ordinal}-${rejected.reasonCode}`,
    linkId: null,
    href: rejected.rawHref,
    label: "Unsafe or unmanaged link",
    severity: "blocking",
    ok: false,
    detail: rejectedLinkDetail(rejected),
  }));
}

export async function getBlogPostLinkReport(postId: number): Promise<BlogPostLinkReport> {
  if (!isBlogLinkRuntimeEnabled()) {
    return {
      enabled: false,
      postId,
      blockers: [],
      warnings: [],
      checks: [],
      usages: [],
    };
  }
  const post = await getBlogPostById(postId);
  if (!post) {
    throw Object.assign(new Error("Blog post was not found"), { statusCode: 404 });
  }
  const extractedDocument = extractBlogLinkDocument(post.content || "", {
    postIdentity: post.id,
    publicSiteUrl: getBlogLinkConfig().publicSiteUrl,
  });
  const usageRows = await db
    .select()
    .from(blogPostLinks)
    .where(and(
      eq(blogPostLinks.postId, postId),
      isNull(blogPostLinks.removedAt),
    ))
    .orderBy(blogPostLinks.ordinal);
  const linkMap = await getManagedBlogLinksByIds(usageRows.map(row => row.linkId));
  const targetPostIds = Array.from(new Set(
    Array.from(linkMap.values())
      .map(link => link.targetPostId)
      .filter((value): value is number => typeof value === "number"),
  ));
  const targetPosts = targetPostIds.length > 0
    ? await db
      .select({
        id: blogPosts.id,
        status: blogPosts.status,
        slug: blogPosts.slug,
        language: blogPosts.language,
      })
      .from(blogPosts)
      .where(inArray(blogPosts.id, targetPostIds))
    : [];
  const targetPostById = new Map(targetPosts.map(target => [target.id, target]));
  const checks: BlogLinkReportCheck[] = buildRejectedBlogLinkChecks(
    extractedDocument.rejected,
  );
  const usages = usageRows.flatMap(usage => {
    const link = linkMap.get(usage.linkId);
    if (!link) return [];
    const critical = isCriticalSource(link, link.source);
    const healthCheckOverdue = (
      link.healthStatus === "healthy"
      && (!link.nextCheckAt || link.nextCheckAt.getTime() <= Date.now())
    );

    if (usage.normalizedHref !== link.normalizedHref) {
      checks.push(linkReportCheck(
        link,
        "blocking",
        `link-${link.id}-exact-target-${usage.id}`,
        "Exact target identity",
        "The saved anchor no longer matches this managed exact page. Reconcile the draft before publishing.",
      ));
    }
    if (link.reviewStatus !== "approved") {
      checks.push(linkReportCheck(
        link,
        "blocking",
        `link-${link.id}-review`,
        "Link approval",
        `The ${link.kind} target is ${link.reviewStatus}; human approval is required.`,
      ));
    }
    if (link.language !== "all" && link.language !== post.language) {
      checks.push(linkReportCheck(
        link,
        "blocking",
        `link-${link.id}-language`,
        "Link language",
        `The target is reviewed for ${link.language.toUpperCase()}, but the article is ${post.language.toUpperCase()}.`,
      ));
    }
    const normalizedAnchor = normalizeBlogLinkSearchText(usage.anchorText);
    if (
      !normalizedAnchor
      || [
        "click here",
        "here",
        "read more",
        "learn more",
        "more",
        "aqui",
        "haz clic aqui",
        "leer mas",
        "ver mas",
        "mas informacion",
        "conoce mas",
      ].includes(normalizedAnchor)
      || usage.anchorText.trim() === usage.normalizedHref
    ) {
      checks.push(linkReportCheck(
        link,
        "warning",
        `link-${link.id}-anchor-${usage.id}`,
        "Anchor text",
        "Use concise, descriptive anchor text instead of a generic or raw-URL label.",
      ));
    }
    if (link.kind === "internal" && link.targetPostId === postId) {
      checks.push(linkReportCheck(
        link,
        "blocking",
        `link-${link.id}-self`,
        "Self link",
        "An article cannot use itself as an internal destination.",
      ));
    }
    if (
      link.kind === "internal"
      && isManagedBlogPostTarget(link)
      && !isLiveManagedBlogPostTarget(
        link,
        typeof link.targetPostId === "number"
          ? targetPostById.get(link.targetPostId)
          : undefined,
      )
    ) {
      checks.push(linkReportCheck(
        link,
        "blocking",
        `link-${link.id}-target-publication`,
        "Published destination",
        "The managed blog destination is no longer published at this exact canonical path.",
      ));
    }
    if (link.healthStatus === "broken") {
      checks.push(linkReportCheck(
        link,
        "blocking",
        `link-${link.id}-broken`,
        "Broken link",
        "The target is confirmed broken.",
      ));
    } else if (
      link.healthStatus === "changed_review_needed"
      || (link.kind === "internal" && link.healthStatus === "redirected")
    ) {
      checks.push(linkReportCheck(
        link,
        "blocking",
        `link-${link.id}-redirect`,
        "Redirect review",
        "The destination changed and requires editorial review.",
      ));
    } else if (link.healthStatus === "redirected") {
      checks.push(linkReportCheck(
        link,
        "warning",
        `link-${link.id}-redirect`,
        "Redirect review",
        "The target redirects; review and replace it with the canonical final URL before future AI use.",
      ));
    } else if (
      ["unchecked", "unreachable", "stale"].includes(link.healthStatus)
      || healthCheckOverdue
    ) {
      checks.push(linkReportCheck(
        link,
        link.kind === "internal" || critical ? "blocking" : "warning",
        `link-${link.id}-health`,
        "Link health",
        healthCheckOverdue
          ? "The scheduled health check is overdue."
          : `Current technical state: ${link.healthStatus.replace(/_/g, " ")}.`,
      ));
    }
    if (link.kind === "external" && link.source?.reviewStatus !== "approved") {
      checks.push(linkReportCheck(
        link,
        "blocking",
        `link-${link.id}-publisher`,
        "Publisher approval",
        "The responsible medical publisher has not been approved.",
      ));
    } else if (
      link.kind === "external"
      && link.source
      && !link.source.languages.includes(post.language)
    ) {
      checks.push(linkReportCheck(
        link,
        "blocking",
        `link-${link.id}-publisher-language`,
        "Publisher language review",
        `The publisher is not approved for ${post.language.toUpperCase()} content.`,
      ));
    } else if (
      link.kind === "external"
      && link.source
      && !isBlogLinkSourceReviewCurrent(link.source)
    ) {
      checks.push(linkReportCheck(
        link,
        critical ? "blocking" : "warning",
        `link-${link.id}-publisher-stale`,
        "Publisher review",
        "The publisher's editorial review is due for renewal.",
      ));
    }
    if (
      link.kind === "external"
      && !isBlogLinkPageReviewCurrent(link)
    ) {
      checks.push(linkReportCheck(
        link,
        critical ? "blocking" : "warning",
        `link-${link.id}-page-review-stale`,
        "Exact page review",
        "The exact page's editorial review is due for renewal.",
      ));
    }
    if (link.kind === "external" && link.source) {
      const qualityThreshold = critical
        ? BLOG_LINK_SCORE_THRESHOLDS.sourceQualityCritical
        : BLOG_LINK_SCORE_THRESHOLDS.sourceQualityNormal;
      const evidenceThreshold = critical
        ? BLOG_LINK_SCORE_THRESHOLDS.pageEvidenceCritical
        : BLOG_LINK_SCORE_THRESHOLDS.pageEvidenceNormal;
      if (link.source.qualityScore < qualityThreshold) {
        checks.push(linkReportCheck(
          link,
          "warning",
          `link-${link.id}-source-quality`,
          "Source quality",
          `Publisher quality is ${link.source.qualityScore}/100; the current threshold is ${qualityThreshold}.`,
        ));
      }
      if (link.evidenceScore < evidenceThreshold) {
        checks.push(linkReportCheck(
          link,
          "warning",
          `link-${link.id}-evidence`,
          "Page evidence",
          `Exact-page evidence is ${link.evidenceScore}/100; the current threshold is ${evidenceThreshold}.`,
        ));
      }
    }

    return [{
      id: usage.id,
      linkId: usage.linkId,
      anchorText: usage.anchorText,
      sectionHeading: usage.sectionHeading,
      href: usage.normalizedHref,
      link,
    }];
  });
  const uniqueChecks = Array.from(
    new Map(checks.map(check => [check.id, check])).values(),
  );
  const blockers = uniqueChecks.filter(check => check.severity === "blocking");
  const warnings = uniqueChecks.filter(check => check.severity === "warning");
  return {
    enabled: true,
    postId,
    blockers,
    warnings,
    checks: uniqueChecks,
    usages,
  };
}

export async function assertBlogPostLinksPublishReady(postId: number): Promise<BlogPostLinkReport> {
  const report = await getBlogPostLinkReport(postId);
  if (report.blockers.length > 0) {
    const error = Object.assign(new Error("Post links are not ready to publish"), {
      statusCode: 400,
      checks: report.blockers.map(check => ({
        id: check.id,
        label: check.label,
        ok: false,
        detail: `${check.href}: ${check.detail}`,
      })),
      linkReport: report,
    });
    throw error;
  }
  return report;
}

function tokenSet(value: string): Set<string> {
  return new Set(
    normalizeBlogLinkSearchText(value)
      .split(" ")
      .filter(token => token.length >= 3),
  );
}

function topicalAffinity(sourceText: string, targetText: string): number {
  const source = tokenSet(sourceText);
  const target = tokenSet(targetText);
  if (source.size === 0 || target.size === 0) return 0;
  let shared = 0;
  for (const token of Array.from(target)) {
    if (source.has(token)) shared += 1;
  }
  return Math.min(35, Math.round((shared / Math.min(source.size, target.size)) * 35));
}

export async function getBlogInternalLinkOpportunities(
  sourcePostId: number,
): Promise<BlogInternalLinkOpportunity[]> {
  const post = await getBlogPostById(sourcePostId);
  if (!post) {
    throw Object.assign(new Error("Source blog post was not found"), { statusCode: 404 });
  }
  const existingUsages = await db
    .select({
      linkId: blogPostLinks.linkId,
      anchorText: blogPostLinks.anchorText,
    })
    .from(blogPostLinks)
    .where(and(
      eq(blogPostLinks.postId, sourcePostId),
      isNull(blogPostLinks.removedAt),
    ));
  const usedLinkIds = new Set(existingUsages.map(row => row.linkId));
  const candidates = await db
    .select({
      link: blogLinks,
      incomingCount: usageCountExpression(),
      targetPost: {
        id: blogPosts.id,
        status: blogPosts.status,
        slug: blogPosts.slug,
        language: blogPosts.language,
      },
    })
    .from(blogLinks)
    .leftJoin(blogPosts, eq(blogLinks.targetPostId, blogPosts.id))
    .where(and(
      eq(blogLinks.kind, "internal"),
      eq(blogLinks.reviewStatus, "approved"),
      eq(blogLinks.generationEligible, true),
      eq(blogLinks.healthStatus, "healthy"),
      gt(blogLinks.nextCheckAt, new Date()),
      or(
        eq(blogLinks.language, post.language),
        eq(blogLinks.language, "all"),
      ),
      or(
        isNull(blogLinks.targetPostId),
        ne(blogLinks.targetPostId, post.id),
      ),
    ));
  const sourceText = [
    getBlogPostPlainText(post),
    post.targetKeyword,
    post.contentPillar,
    post.patientStage,
    post.category?.name,
    ...post.tags.map(tag => tag.name),
  ].filter(Boolean).join(" ");

  const opportunities = candidates
    .filter(({ link, targetPost }) => isLiveManagedBlogPostTarget(link, targetPost))
    .map(({ link, incomingCount }) => {
    const affinity = topicalAffinity(sourceText, [
      link.title,
      link.label,
      link.summary,
      ...link.topicTags,
      ...link.categoryKeys,
      ...link.contentPillars,
      ...link.keywords,
    ].filter(Boolean).join(" "));
    const incoming = asNumber(incomingCount);
    const journeyFit = link.contentPillars.includes(post.contentPillar || "")
      ? 20
      : link.categoryKeys.includes(post.category?.slug || "")
        ? 15
        : affinity >= 20
          ? 10
          : 5;
    const graphNeed = incoming === 0 ? 20 : incoming === 1 ? 15 : incoming === 2 ? 8 : 3;
    const score = scoreInternalLinkOpportunity({
      topicalAffinity: affinity,
      patientJourneyFit: journeyFit,
      graphNeed,
      anchorContext: affinity >= 20 ? 15 : 8,
      editorialDiversity: usedLinkIds.has(link.id) ? 0 : 10,
    }, {
      distinctDestination: link.targetPostId !== post.id,
      languageCompatible: link.language === "all" || link.language === post.language,
      notDuplicated: !usedLinkIds.has(link.id),
      destinationHealthy: link.healthStatus === "healthy",
      destinationRedirected: link.healthStatus === "redirected",
      destinationPublic: true,
      destinationCanonical: true,
      destinationIndexable: true,
    });
    return {
      stableKey: link.stableKey || `link-${link.id}`,
      sourcePostId,
      targetLinkId: link.id,
      targetPostId: link.targetPostId,
      targetTitle: link.title,
      targetHref: link.normalizedHref,
      language: link.language,
      targetStatus: link.healthStatus,
      existingIncomingLinks: incoming,
      currentAnchors: existingUsages
        .filter(row => row.linkId === link.id)
        .map(row => row.anchorText),
      score,
    };
    });

  return rankInternalLinkOpportunities(opportunities)
    .filter(item => item.score.eligible && item.score.band !== "none")
    .map(({ score, ...item }) => ({
      ...item,
      score: score.total,
      band: score.band,
      reasons: [
        ...score.gateReasons,
        ...Object.values(score.explanations),
      ],
      breakdown: score.breakdown,
    }));
}

export function getBlogLinkPolicyMetadata() {
  return {
    policyVersion: BLOG_LINK_POLICY_VERSION,
    scoreVersion: BLOG_LINK_SCORE_VERSION,
    thresholds: BLOG_LINK_SCORE_THRESHOLDS,
  };
}
