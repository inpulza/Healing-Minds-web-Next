import {
  and,
  desc,
  eq,
  inArray,
  isNull,
  notInArray,
  sql,
} from "drizzle-orm";
import {
  blogLinkAuditRuns,
  blogLinkChecks,
  blogLinks,
  blogLinkSources,
  blogPostLinks,
  blogPosts,
  blogRedirects,
  type BlogLink,
  type BlogLinkAuditRun,
  type BlogLinkCheck,
  type BlogLinkOrigin,
  type BlogLinkSource,
  type BlogLinkUsageOrigin,
  type BlogPostLink,
  type InsertBlogLink,
  type InsertBlogLinkAuditRun,
  type InsertBlogLinkCheck,
  type InsertBlogLinkSource,
} from "@shared/schema";
import { db } from "../../db";
import {
  assertBlogPostSnapshotMatches,
  assertBlogRedirectCleanupSnapshotMatches,
  type BlogRedirectSnapshot,
} from "../lifecycle";
import { lockBlogRedirectPaths } from "../redirect-lock";
import { BLOG_LINK_SCORE_VERSION } from "./config";
import {
  createBlogPostContentChecksum,
  extractBlogLinkOccurrences,
  resolveBlogLinkUsageGenerationRunId,
} from "./extract";
import {
  createCanonicalBlogLinkKey,
  normalizeBlogLinkHref,
} from "./normalization";
import { rewriteExactBlogLinkHref } from "./rewrite";
import type { BlogLinkAuditLease } from "./audit-recovery";

export type BlogLinkTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export type BlogLinkOccurrenceInput = {
  rawHref: string;
  normalizedHref: string;
  kind: "internal" | "external";
  anchorText: string;
  sectionHeading: string | null;
  rel: string | null;
  target: string | null;
  ordinal: number;
  occurrenceKey: string;
  claimClass?: string | null;
};

export type ReconcileBlogPostLinksInput = {
  postId: number;
  contentHtml: string;
  language: "en" | "es";
  origin: BlogLinkUsageOrigin;
  generationRunId?: number | null;
  publicSiteUrl?: string;
  occurrences?: BlogLinkOccurrenceInput[];
  observedAt?: Date;
};

export type RedirectLinkCleanupSnapshot = {
  id: number;
  expectedStatus: "draft" | "pending_review" | "published" | "rejected";
  expectedUpdatedAt: Date;
};

export type RedirectLinkCleanupResult = {
  postId: number;
  replacements: number;
  reconciliation: BlogPostLinkReconciliationResult | null;
};

export type BlogPostLinkReconciliationResult = {
  postId: number;
  contentChecksum: string;
  observedCount: number;
  addedCount: number;
  revivedCount: number;
  updatedCount: number;
  retainedCount: number;
  removedCount: number;
  pendingLinkIds: number[];
};

export const buildBlogLinkCanonicalKey = createCanonicalBlogLinkKey;
export const buildBlogPostContentChecksum = createBlogPostContentChecksum;

function usageOriginToLinkOrigin(origin: BlogLinkUsageOrigin): BlogLinkOrigin {
  if (origin === "ai") return "ai";
  if (origin === "backfill") return "backfill";
  return "manual";
}

function assertCanonicalMatch(link: BlogLink, normalizedHref: string): BlogLink {
  if (link.normalizedHref !== normalizedHref) {
    throw Object.assign(
      new Error("Blog link canonical hash collision detected"),
      {
        code: "blog_link_canonical_collision",
        linkId: link.id,
      },
    );
  }
  return link;
}

async function getLinkByCanonicalKeyInTransaction(
  tx: BlogLinkTransaction,
  canonicalKey: string,
): Promise<BlogLink | undefined> {
  const [link] = await tx
    .select()
    .from(blogLinks)
    .where(eq(blogLinks.canonicalKey, canonicalKey))
    .limit(1);
  return link;
}

async function resolveOrCreateDiscoveredSource(
  tx: BlogLinkTransaction,
  host: string,
  language: "en" | "es",
  observedAt: Date,
): Promise<BlogLinkSource> {
  const canonicalDomain = host.toLowerCase().replace(/^www\./, "");
  const [created] = await tx
    .insert(blogLinkSources)
    .values({
      stableKey: `publisher-${buildBlogLinkCanonicalKey(canonicalDomain).slice(0, 20)}`,
      name: canonicalDomain,
      canonicalDomain,
      sourceType: "other",
      languages: [language],
      reviewStatus: "pending",
      qualityScore: 0,
      qualityBreakdown: {},
      scoreVersion: BLOG_LINK_SCORE_VERSION,
      updatedAt: observedAt,
    })
    .onConflictDoNothing()
    .returning();
  if (created) return created;

  const [existing] = await tx
    .select()
    .from(blogLinkSources)
    .where(eq(blogLinkSources.canonicalDomain, canonicalDomain))
    .limit(1);
  if (!existing) {
    throw new Error("Discovered external link publisher could not be resolved");
  }
  if (
    existing.languages.includes(language)
    || existing.reviewStatus !== "pending"
  ) {
    return existing;
  }

  const [updated] = await tx
    .update(blogLinkSources)
    .set({
      languages: Array.from(new Set([...existing.languages, language])).sort(),
      updatedAt: observedAt,
    })
    .where(eq(blogLinkSources.id, existing.id))
    .returning();
  return updated || existing;
}

async function resolveOrCreateDiscoveredLink(
  tx: BlogLinkTransaction,
  occurrence: BlogLinkOccurrenceInput,
  input: ReconcileBlogPostLinksInput,
): Promise<BlogLink> {
  const normalized = normalizeBlogLinkHref(occurrence.rawHref, {
    publicSiteUrl: input.publicSiteUrl,
  });
  if (
    normalized.normalizedHref !== occurrence.normalizedHref
    || normalized.kind !== occurrence.kind
  ) {
    throw Object.assign(
      new Error("Extracted blog link occurrence did not match canonical normalization"),
      { code: "blog_link_occurrence_normalization_mismatch" },
    );
  }

  const canonicalKey = buildBlogLinkCanonicalKey(normalized.normalizedHref);
  const existing = await getLinkByCanonicalKeyInTransaction(tx, canonicalKey);
  if (existing) return assertCanonicalMatch(existing, normalized.normalizedHref);
  const observedAt = input.observedAt || new Date();
  const source = normalized.kind === "external"
    ? await resolveOrCreateDiscoveredSource(
      tx,
      normalized.host,
      input.language,
      observedAt,
    )
    : null;

  const [created] = await tx
    .insert(blogLinks)
    .values({
      stableKey: null,
      sourceId: source?.id || null,
      kind: normalized.kind,
      normalizedHref: normalized.normalizedHref,
      canonicalKey,
      displayHref: normalized.displayHref,
      host: normalized.host,
      title: (occurrence.anchorText || normalized.displayHref).slice(0, 255),
      label: (occurrence.anchorText || normalized.displayHref).slice(0, 255),
      language: input.language,
      sourceCategory: null,
      topicTags: [],
      categoryKeys: [],
      contentPillars: [],
      keywords: [],
      summary: null,
      evidenceType: null,
      evidenceScope: null,
      evidenceScore: 0,
      freshnessScore: 0,
      reviewStatus: "pending",
      generationEligible: false,
      healthStatus: "unchecked",
      redirectCount: 0,
      consecutiveFailures: 0,
      scoreBreakdown: {},
      scoreVersion: BLOG_LINK_SCORE_VERSION,
      origin: usageOriginToLinkOrigin(input.origin),
      targetPostId: null,
      updatedAt: observedAt,
    })
    .onConflictDoNothing()
    .returning();

  if (created) return created;

  const raceWinner = await getLinkByCanonicalKeyInTransaction(tx, canonicalKey);
  if (!raceWinner) {
    throw new Error("Blog link could not be created or resolved");
  }
  return assertCanonicalMatch(raceWinner, normalized.normalizedHref);
}

function occurrencesFromHtml(input: ReconcileBlogPostLinksInput): BlogLinkOccurrenceInput[] {
  if (input.occurrences) return input.occurrences;
  return extractBlogLinkOccurrences(input.contentHtml, {
    postIdentity: String(input.postId),
    publicSiteUrl: input.publicSiteUrl,
  }).map(occurrence => ({
    rawHref: occurrence.rawHref,
    normalizedHref: occurrence.normalizedHref,
    kind: occurrence.kind,
    anchorText: occurrence.anchorText,
    sectionHeading: occurrence.sectionHeading || null,
    rel: occurrence.rel || null,
    target: occurrence.target || null,
    ordinal: occurrence.ordinal,
    occurrenceKey: occurrence.occurrenceKey,
    claimClass: null,
  }));
}

function assertUniqueOccurrences(occurrences: BlogLinkOccurrenceInput[]): void {
  const seen = new Map<string, BlogLinkOccurrenceInput>();
  for (const occurrence of occurrences) {
    const prior = seen.get(occurrence.occurrenceKey);
    if (prior) {
      throw Object.assign(
        new Error("Duplicate blog link occurrence fingerprint"),
        {
          code: "blog_link_duplicate_occurrence",
          occurrenceKey: occurrence.occurrenceKey,
        },
      );
    }
    seen.set(occurrence.occurrenceKey, occurrence);
  }
}

function usageChanged(
  existing: BlogPostLink,
  linkId: number,
  occurrence: BlogLinkOccurrenceInput,
  checksum: string,
  generationRunId: number | null,
): boolean {
  return existing.linkId !== linkId
    || existing.generationRunId !== generationRunId
    || existing.ordinal !== occurrence.ordinal
    || existing.rawHref !== occurrence.rawHref
    || existing.normalizedHref !== occurrence.normalizedHref
    || existing.anchorText !== occurrence.anchorText
    || existing.sectionHeading !== occurrence.sectionHeading
    || existing.rel !== occurrence.rel
    || existing.target !== occurrence.target
    || existing.claimClass !== (occurrence.claimClass || null)
    || existing.postContentChecksum !== checksum;
}

export async function reconcileBlogPostLinksInTransaction(
  tx: BlogLinkTransaction,
  input: ReconcileBlogPostLinksInput,
): Promise<BlogPostLinkReconciliationResult> {
  const observedAt = input.observedAt || new Date();
  const [post] = await tx
    .select({
      id: blogPosts.id,
      content: blogPosts.content,
      language: blogPosts.language,
    })
    .from(blogPosts)
    .where(eq(blogPosts.id, input.postId))
    .limit(1)
    .for("update");
  if (!post) {
    throw Object.assign(new Error("Blog post was not found for link reconciliation"), {
      statusCode: 404,
    });
  }
  if ((post.content || "") !== input.contentHtml) {
    throw Object.assign(
      new Error("Blog link reconciliation requires the currently saved post content"),
      { code: "blog_link_content_mismatch" },
    );
  }
  if (post.language !== input.language) {
    throw Object.assign(
      new Error("Blog link reconciliation language does not match the saved post"),
      { code: "blog_link_language_mismatch" },
    );
  }

  const occurrences = occurrencesFromHtml({ ...input, observedAt });
  assertUniqueOccurrences(occurrences);
  const contentChecksum = buildBlogPostContentChecksum(input.contentHtml);
  const existingRows = await tx
    .select()
    .from(blogPostLinks)
    .where(eq(blogPostLinks.postId, input.postId));
  const existingByKey = new Map(existingRows.map(row => [row.occurrenceKey, row]));
  const observedKeys: string[] = [];
  const pendingLinkIds = new Set<number>();
  let addedCount = 0;
  let revivedCount = 0;
  let updatedCount = 0;
  let retainedCount = 0;

  for (const occurrence of occurrences) {
    const link = await resolveOrCreateDiscoveredLink(tx, occurrence, {
      ...input,
      observedAt,
    });
    if (link.reviewStatus === "pending") pendingLinkIds.add(link.id);
    observedKeys.push(occurrence.occurrenceKey);
    const existing = existingByKey.get(occurrence.occurrenceKey);
    const generationRunId = resolveBlogLinkUsageGenerationRunId(
      input.generationRunId,
      existing?.generationRunId,
    );

    if (!existing) {
      await tx.insert(blogPostLinks).values({
        postId: input.postId,
        linkId: link.id,
        generationRunId,
        occurrenceKey: occurrence.occurrenceKey,
        ordinal: occurrence.ordinal,
        rawHref: occurrence.rawHref,
        normalizedHref: occurrence.normalizedHref,
        anchorText: occurrence.anchorText,
        sectionHeading: occurrence.sectionHeading,
        rel: occurrence.rel,
        target: occurrence.target,
        claimClass: occurrence.claimClass || null,
        origin: input.origin,
        postContentChecksum: contentChecksum,
        firstSeenAt: observedAt,
        lastSeenAt: observedAt,
        removedAt: null,
        updatedAt: observedAt,
      });
      addedCount += 1;
      continue;
    }

    const changed = usageChanged(
      existing,
      link.id,
      occurrence,
      contentChecksum,
      generationRunId,
    );
    if (existing.removedAt || changed) {
      await tx
        .update(blogPostLinks)
        .set({
          linkId: link.id,
          generationRunId,
          ordinal: occurrence.ordinal,
          rawHref: occurrence.rawHref,
          normalizedHref: occurrence.normalizedHref,
          anchorText: occurrence.anchorText,
          sectionHeading: occurrence.sectionHeading,
          rel: occurrence.rel,
          target: occurrence.target,
          claimClass: occurrence.claimClass || null,
          postContentChecksum: contentChecksum,
          lastSeenAt: observedAt,
          removedAt: null,
          updatedAt: observedAt,
        })
        .where(eq(blogPostLinks.id, existing.id));
      if (existing.removedAt) revivedCount += 1;
      else updatedCount += 1;
      continue;
    }

    retainedCount += 1;
  }

  const currentMissingRows = existingRows.filter(row => (
    !row.removedAt && !observedKeys.includes(row.occurrenceKey)
  ));
  if (currentMissingRows.length > 0) {
    await tx
      .update(blogPostLinks)
      .set({
        removedAt: observedAt,
        updatedAt: observedAt,
      })
      .where(and(
        eq(blogPostLinks.postId, input.postId),
        isNull(blogPostLinks.removedAt),
        observedKeys.length > 0
          ? notInArray(blogPostLinks.occurrenceKey, observedKeys)
          : sql`true`,
      ));
  }

  return {
    postId: input.postId,
    contentChecksum,
    observedCount: occurrences.length,
    addedCount,
    revivedCount,
    updatedCount,
    retainedCount,
    removedCount: currentMissingRows.length,
    pendingLinkIds: Array.from(pendingLinkIds).sort((a, b) => a - b),
  };
}

export async function reconcileBlogPostLinks(
  input: ReconcileBlogPostLinksInput,
): Promise<BlogPostLinkReconciliationResult> {
  return db.transaction(tx => reconcileBlogPostLinksInTransaction(tx, input));
}

export async function rewriteAndReconcileRedirectLinks(
  snapshots: RedirectLinkCleanupSnapshot[],
  options: {
    redirectSnapshot: BlogRedirectSnapshot;
    publicSiteUrl?: string;
  },
): Promise<RedirectLinkCleanupResult[]> {
  const uniqueSnapshots = Array.from(
    new Map(snapshots.map(snapshot => [snapshot.id, snapshot])).values(),
  ).sort((left, right) => left.id - right.id);
  if (uniqueSnapshots.length === 0) return [];

  return db.transaction(async tx => {
    const rows = await tx
      .select({
        id: blogPosts.id,
        status: blogPosts.status,
        updatedAt: blogPosts.updatedAt,
        content: blogPosts.content,
        language: blogPosts.language,
      })
      .from(blogPosts)
      .where(inArray(blogPosts.id, uniqueSnapshots.map(snapshot => snapshot.id)))
      .orderBy(blogPosts.id)
      .for("update");
    const rowsById = new Map(rows.map(row => [row.id, row]));
    for (const snapshot of uniqueSnapshots) {
      const current = rowsById.get(snapshot.id);
      if (!current) {
        throw Object.assign(
          new Error("An article in this redirect cleanup no longer exists. Refresh the impact list and retry."),
          {
            statusCode: 409,
            code: "blog_redirect_cleanup_post_missing",
          },
        );
      }
      assertBlogPostSnapshotMatches(
        current,
        snapshot,
        {
          message: "An article changed while redirect cleanup was being prepared. No links were rewritten; refresh and retry.",
          code: "blog_redirect_cleanup_snapshot_changed",
        },
      );
    }

    await lockBlogRedirectPaths(tx, [
      options.redirectSnapshot.sourcePath,
      options.redirectSnapshot.targetPath,
    ]);
    const [lockedRedirect] = await tx
      .select({
        id: blogRedirects.id,
        sourcePath: blogRedirects.sourcePath,
        targetPath: blogRedirects.targetPath,
        isActive: blogRedirects.isActive,
        updatedAt: blogRedirects.updatedAt,
      })
      .from(blogRedirects)
      .where(eq(blogRedirects.id, options.redirectSnapshot.id))
      .limit(1)
      .for("update");
    assertBlogRedirectCleanupSnapshotMatches(
      lockedRedirect,
      options.redirectSnapshot,
    );

    const results: RedirectLinkCleanupResult[] = [];
    for (const snapshot of uniqueSnapshots) {
      const current = rowsById.get(snapshot.id)!;
      const rewritten = rewriteExactBlogLinkHref(
        current.content || "",
        options.redirectSnapshot.sourcePath,
        options.redirectSnapshot.targetPath,
      );
      if (
        rewritten.replacements === 0
        || rewritten.contentHtml === (current.content || "")
      ) {
        results.push({
          postId: current.id,
          replacements: 0,
          reconciliation: null,
        });
        continue;
      }

      const observedAt = new Date();
      await tx
        .update(blogPosts)
        .set({
          content: rewritten.contentHtml,
          updatedAt: observedAt,
        })
        .where(eq(blogPosts.id, current.id));
      const reconciliation = await reconcileBlogPostLinksInTransaction(tx, {
        postId: current.id,
        contentHtml: rewritten.contentHtml,
        language: current.language === "es" ? "es" : "en",
        origin: "server_fix",
        publicSiteUrl: options.publicSiteUrl,
        observedAt,
      });
      results.push({
        postId: current.id,
        replacements: rewritten.replacements,
        reconciliation,
      });
    }
    return results;
  });
}

export async function reconcileStoredBlogPostLinks(
  postId: number,
  options: {
    origin?: BlogLinkUsageOrigin;
    generationRunId?: number | null;
    publicSiteUrl?: string;
    observedAt?: Date;
  } = {},
): Promise<BlogPostLinkReconciliationResult> {
  const [post] = await db
    .select({
      id: blogPosts.id,
      content: blogPosts.content,
      language: blogPosts.language,
    })
    .from(blogPosts)
    .where(eq(blogPosts.id, postId))
    .limit(1);
  if (!post) {
    throw Object.assign(new Error("Blog post was not found for link reconciliation"), {
      statusCode: 404,
    });
  }
  return reconcileBlogPostLinks({
    postId: post.id,
    contentHtml: post.content || "",
    language: post.language === "es" ? "es" : "en",
    origin: options.origin || "backfill",
    generationRunId: options.generationRunId,
    publicSiteUrl: options.publicSiteUrl,
    observedAt: options.observedAt,
  });
}

export async function getBlogLinkSourceByStableKey(
  stableKey: string,
): Promise<BlogLinkSource | undefined> {
  const [source] = await db
    .select()
    .from(blogLinkSources)
    .where(eq(blogLinkSources.stableKey, stableKey))
    .limit(1);
  return source;
}

export async function insertBlogLinkSourceIfMissing(
  values: InsertBlogLinkSource,
): Promise<{ source: BlogLinkSource; created: boolean }> {
  const [created] = await db
    .insert(blogLinkSources)
    .values(values)
    .onConflictDoNothing()
    .returning();
  if (created) return { source: created, created: true };

  const stableOwner = await getBlogLinkSourceByStableKey(values.stableKey);
  if (stableOwner) {
    if (stableOwner.canonicalDomain !== values.canonicalDomain) {
      throw Object.assign(
        new Error(`Blog link source ${values.stableKey} has a different canonical domain`),
        { code: "blog_link_source_seed_drift" },
      );
    }
    return { source: stableOwner, created: false };
  }

  const [canonicalOwner] = await db
    .select()
    .from(blogLinkSources)
    .where(eq(blogLinkSources.canonicalDomain, values.canonicalDomain))
    .limit(1);
  if (!canonicalOwner) {
    throw new Error(`Blog link source ${values.stableKey} conflicted with another unique row`);
  }
  if (!canonicalOwner.stableKey.startsWith("publisher-")) {
    throw Object.assign(
      new Error(`Blog link source domain is already owned by ${canonicalOwner.stableKey}`),
      {
        code: "blog_link_source_seed_stable_key_conflict",
        sourceId: canonicalOwner.id,
      },
    );
  }
  const [adopted] = await db
    .update(blogLinkSources)
    .set({
      ...values,
      updatedAt: new Date(),
    })
    .where(and(
      eq(blogLinkSources.id, canonicalOwner.id),
      eq(blogLinkSources.stableKey, canonicalOwner.stableKey),
    ))
    .returning();
  if (!adopted) {
    const raceWinner = await getBlogLinkSourceByStableKey(values.stableKey);
    if (raceWinner?.canonicalDomain === values.canonicalDomain) {
      return { source: raceWinner, created: false };
    }
    throw new Error(`Blog link source ${values.stableKey} could not adopt its canonical domain`);
  }
  return { source: adopted, created: false };
}

export async function getBlogLinkByStableKey(stableKey: string): Promise<BlogLink | undefined> {
  const [link] = await db
    .select()
    .from(blogLinks)
    .where(eq(blogLinks.stableKey, stableKey))
    .limit(1);
  return link;
}

export async function getBlogLinkByCanonicalHref(normalizedHref: string): Promise<BlogLink | undefined> {
  const canonicalKey = buildBlogLinkCanonicalKey(normalizedHref);
  const [link] = await db
    .select()
    .from(blogLinks)
    .where(eq(blogLinks.canonicalKey, canonicalKey))
    .limit(1);
  return link ? assertCanonicalMatch(link, normalizedHref) : undefined;
}

export async function insertBlogLinkIfMissing(
  values: Omit<InsertBlogLink, "canonicalKey"> & { canonicalKey?: string },
): Promise<{ link: BlogLink; created: boolean }> {
  const canonicalKey = values.canonicalKey || buildBlogLinkCanonicalKey(values.normalizedHref);
  const [created] = await db
    .insert(blogLinks)
    .values({
      ...values,
      canonicalKey,
    })
    .onConflictDoNothing()
    .returning();
  if (created) return { link: created, created: true };

  const stableOwner = values.stableKey
    ? await getBlogLinkByStableKey(values.stableKey)
    : undefined;
  if (stableOwner) {
    return {
      link: assertCanonicalMatch(stableOwner, values.normalizedHref),
      created: false,
    };
  }

  const canonicalOwner = await getBlogLinkByCanonicalHref(values.normalizedHref);
  if (
    canonicalOwner
    && values.stableKey
    && canonicalOwner.stableKey === null
  ) {
    const [adopted] = await db
      .update(blogLinks)
      .set({
        ...values,
        canonicalKey,
        updatedAt: new Date(),
      })
      .where(and(
        eq(blogLinks.id, canonicalOwner.id),
        isNull(blogLinks.stableKey),
      ))
      .returning();
    if (adopted) return { link: adopted, created: false };
    const refreshed = await getBlogLinkByCanonicalHref(values.normalizedHref);
    if (refreshed?.stableKey === values.stableKey) {
      return { link: refreshed, created: false };
    }
  }
  if (!canonicalOwner) {
    throw new Error(`Blog link ${values.stableKey || values.normalizedHref} conflicted with another unique row`);
  }
  if (
    values.stableKey
    && canonicalOwner.stableKey !== values.stableKey
  ) {
    throw Object.assign(
      new Error("Seeded blog link exact URL is already owned by another stable key"),
      {
        code: "blog_link_seed_stable_key_conflict",
        linkId: canonicalOwner.id,
      },
    );
  }
  return {
    link: assertCanonicalMatch(canonicalOwner, values.normalizedHref),
    created: false,
  };
}

export async function getCurrentBlogPostLinkUsages(
  linkIds: number[],
): Promise<BlogPostLink[]> {
  if (linkIds.length === 0) return [];
  return db
    .select()
    .from(blogPostLinks)
    .where(and(
      inArray(blogPostLinks.linkId, Array.from(new Set(linkIds))),
      isNull(blogPostLinks.removedAt),
    ))
    .orderBy(blogPostLinks.linkId, blogPostLinks.postId, blogPostLinks.ordinal);
}

export async function getCurrentLinksForBlogPost(postId: number): Promise<BlogPostLink[]> {
  return db
    .select()
    .from(blogPostLinks)
    .where(and(
      eq(blogPostLinks.postId, postId),
      isNull(blogPostLinks.removedAt),
    ))
    .orderBy(blogPostLinks.ordinal);
}

export async function createBlogLinkAuditRun(
  values: InsertBlogLinkAuditRun,
): Promise<BlogLinkAuditRun> {
  const [run] = await db
    .insert(blogLinkAuditRuns)
    .values({
      ...values,
      updatedAt: new Date(),
    })
    .returning();
  return run;
}

export async function getBlogLinkAuditRun(id: number): Promise<BlogLinkAuditRun | undefined> {
  const [run] = await db
    .select()
    .from(blogLinkAuditRuns)
    .where(eq(blogLinkAuditRuns.id, id))
    .limit(1);
  return run;
}

export async function getBlogLinkAuditRunByIdempotencyKey(
  idempotencyKey: string,
): Promise<BlogLinkAuditRun | undefined> {
  const [run] = await db
    .select()
    .from(blogLinkAuditRuns)
    .where(eq(blogLinkAuditRuns.idempotencyKey, idempotencyKey))
    .limit(1);
  return run;
}

export async function requeueInterruptedBlogLinkAuditRun(
  id: number,
): Promise<BlogLinkAuditRun | undefined> {
  const now = new Date();
  const [run] = await db
    .update(blogLinkAuditRuns)
    .set({
      status: "queued",
      completedAt: null,
      heartbeatAt: now,
      leaseToken: null,
      updatedAt: now,
    })
    .where(and(
      eq(blogLinkAuditRuns.id, id),
      eq(blogLinkAuditRuns.status, "interrupted"),
    ))
    .returning();
  return run;
}

export async function claimBlogLinkAuditRun(
  id: number,
  leaseToken: string,
): Promise<BlogLinkAuditRun | undefined> {
  const now = new Date();
  const [run] = await db
    .update(blogLinkAuditRuns)
    .set({
      status: "running",
      startedAt: now,
      completedAt: null,
      heartbeatAt: now,
      leaseToken,
      leaseEpoch: sql`${blogLinkAuditRuns.leaseEpoch} + 1`,
      updatedAt: now,
    })
    .where(and(
      eq(blogLinkAuditRuns.id, id),
      eq(blogLinkAuditRuns.status, "queued"),
    ))
    .returning();
  return run;
}

export async function heartbeatBlogLinkAuditRun(
  lease: BlogLinkAuditLease,
  result?: Record<string, unknown>,
): Promise<boolean> {
  const now = new Date();
  const rows = await db
    .update(blogLinkAuditRuns)
    .set({
      heartbeatAt: now,
      updatedAt: now,
      ...(result ? { result } : {}),
    })
    .where(and(
      eq(blogLinkAuditRuns.id, lease.runId),
      eq(blogLinkAuditRuns.status, "running"),
      eq(blogLinkAuditRuns.leaseToken, lease.token),
      eq(blogLinkAuditRuns.leaseEpoch, lease.epoch),
    ))
    .returning({ id: blogLinkAuditRuns.id });
  return rows.length === 1;
}

export async function checkpointBlogLinkAuditRun(
  tx: BlogLinkTransaction,
  lease: BlogLinkAuditLease,
  result: Record<string, unknown>,
): Promise<boolean> {
  const now = new Date();
  const rows = await tx
    .update(blogLinkAuditRuns)
    .set({
      result,
      heartbeatAt: now,
      updatedAt: now,
    })
    .where(and(
      eq(blogLinkAuditRuns.id, lease.runId),
      eq(blogLinkAuditRuns.status, "running"),
      eq(blogLinkAuditRuns.leaseToken, lease.token),
      eq(blogLinkAuditRuns.leaseEpoch, lease.epoch),
    ))
    .returning({ id: blogLinkAuditRuns.id });
  return rows.length === 1;
}

export async function completeBlogLinkAuditRun(
  lease: BlogLinkAuditLease,
  result: Record<string, unknown>,
): Promise<BlogLinkAuditRun | undefined> {
  const now = new Date();
  const [run] = await db
    .update(blogLinkAuditRuns)
    .set({
      status: "completed",
      result,
      completedAt: now,
      heartbeatAt: now,
      leaseToken: null,
      updatedAt: now,
    })
    .where(and(
      eq(blogLinkAuditRuns.id, lease.runId),
      eq(blogLinkAuditRuns.status, "running"),
      eq(blogLinkAuditRuns.leaseToken, lease.token),
      eq(blogLinkAuditRuns.leaseEpoch, lease.epoch),
    ))
    .returning();
  return run;
}

export async function failBlogLinkAuditRun(
  lease: BlogLinkAuditLease,
  result: Record<string, unknown>,
): Promise<BlogLinkAuditRun | undefined> {
  const now = new Date();
  const [run] = await db
    .update(blogLinkAuditRuns)
    .set({
      status: "failed",
      result,
      completedAt: now,
      heartbeatAt: now,
      leaseToken: null,
      updatedAt: now,
    })
    .where(and(
      eq(blogLinkAuditRuns.id, lease.runId),
      eq(blogLinkAuditRuns.status, "running"),
      eq(blogLinkAuditRuns.leaseToken, lease.token),
      eq(blogLinkAuditRuns.leaseEpoch, lease.epoch),
    ))
    .returning();
  return run;
}

export async function markStaleBlogLinkAuditRunsInterrupted(
  staleBefore: Date,
): Promise<number> {
  const rows = await db
    .update(blogLinkAuditRuns)
    .set({
      status: "interrupted",
      completedAt: new Date(),
      leaseToken: null,
      leaseEpoch: sql`${blogLinkAuditRuns.leaseEpoch} + 1`,
      updatedAt: new Date(),
    })
    .where(and(
      inArray(blogLinkAuditRuns.status, ["queued", "running"]),
      sql`${blogLinkAuditRuns.heartbeatAt} < ${staleBefore}`,
    ))
    .returning({ id: blogLinkAuditRuns.id });
  return rows.length;
}

export async function appendBlogLinkCheck(
  values: InsertBlogLinkCheck,
): Promise<BlogLinkCheck> {
  const [check] = await db
    .insert(blogLinkChecks)
    .values(values)
    .returning();
  return check;
}

export async function listBlogLinkChecks(
  linkId: number,
  limit = 50,
): Promise<BlogLinkCheck[]> {
  return db
    .select()
    .from(blogLinkChecks)
    .where(eq(blogLinkChecks.linkId, linkId))
    .orderBy(desc(blogLinkChecks.checkedAt), desc(blogLinkChecks.id))
    .limit(Math.max(1, Math.min(limit, 200)));
}
