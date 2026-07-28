import {
  asc,
  eq,
  gt,
  inArray,
} from "drizzle-orm";
import {
  blogLinks,
  blogPosts,
  type BlogPostStatus,
} from "@shared/schema";
import { db, pool } from "../server/db";
import { extractBlogLinkDocument } from "../server/blog/links/extract";
import { createCanonicalBlogLinkKey } from "../server/blog/links/normalization";
import { seedBlogLinkLibrary } from "../server/blog/links/seed";
import { reconcileStoredBlogPostLinks } from "../server/blog/links/storage";
import { getSeoSiteConfig } from "../server/seo/config";
import {
  parseBlogLinkBackfillOptions,
  type BlogLinkBackfillOptions,
} from "./blog-link-backfill-options";

type PostSnapshot = {
  id: number;
  slug: string;
  language: string;
  status: BlogPostStatus;
  content: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type UrlObservation = {
  normalizedHref: string;
  postIds: Set<number>;
};

function sameDate(left: Date | null, right: Date | null): boolean {
  if (left === null || right === null) return left === right;
  return left.getTime() === right.getTime();
}

async function assertPostUnchanged(before: PostSnapshot): Promise<void> {
  const [after] = await db
    .select({
      id: blogPosts.id,
      slug: blogPosts.slug,
      language: blogPosts.language,
      status: blogPosts.status,
      content: blogPosts.content,
      publishedAt: blogPosts.publishedAt,
      createdAt: blogPosts.createdAt,
      updatedAt: blogPosts.updatedAt,
    })
    .from(blogPosts)
    .where(eq(blogPosts.id, before.id))
    .limit(1);

  if (
    !after
    || after.slug !== before.slug
    || after.language !== before.language
    || after.status !== before.status
    || after.content !== before.content
    || !sameDate(after.publishedAt, before.publishedAt)
    || !sameDate(after.createdAt, before.createdAt)
    || !sameDate(after.updatedAt, before.updatedAt)
  ) {
    throw Object.assign(
      new Error(`Backfill safety invariant failed for post ${before.id}`),
      { code: "blog_link_backfill_post_changed" },
    );
  }
}

async function loadKnownLinks(
  hrefs: readonly string[],
): Promise<Map<string, { id: number; reviewStatus: string }>> {
  const hrefByKey = new Map<string, string>();
  for (const href of hrefs) {
    const key = createCanonicalBlogLinkKey(href);
    const previousHref = hrefByKey.get(key);
    if (previousHref && previousHref !== href) {
      throw new Error("Canonical hash collision found while preparing backfill report");
    }
    hrefByKey.set(key, href);
  }
  const keys = Array.from(hrefByKey.keys());
  if (keys.length === 0) return new Map();

  const rows = await db
    .select({
      id: blogLinks.id,
      canonicalKey: blogLinks.canonicalKey,
      normalizedHref: blogLinks.normalizedHref,
      reviewStatus: blogLinks.reviewStatus,
    })
    .from(blogLinks)
    .where(inArray(blogLinks.canonicalKey, keys));

  const byHref = new Map<string, { id: number; reviewStatus: string }>();
  for (const row of rows) {
    const requestedHref = hrefByKey.get(row.canonicalKey);
    if (
      !requestedHref
      || row.normalizedHref !== requestedHref
      || row.canonicalKey !== createCanonicalBlogLinkKey(row.normalizedHref)
    ) {
      throw new Error(`Canonical key collision or mismatch for link ${row.id}`);
    }
    byHref.set(row.normalizedHref, {
      id: row.id,
      reviewStatus: row.reviewStatus,
    });
  }
  return byHref;
}

async function runBackfill(options: BlogLinkBackfillOptions): Promise<void> {
  const publicSiteUrl = getSeoSiteConfig().siteBaseUrl;
  const totals = {
    postsScanned: 0,
    postsApplied: 0,
    occurrences: 0,
    rejectedOccurrences: 0,
    added: 0,
    revived: 0,
    updated: 0,
    retained: 0,
    removed: 0,
  };
  const observedUrls = new Map<string, UrlObservation>();
  const pendingUrls = new Map<string, Set<number>>();
  const failures: Array<{ postId: number; message: string }> = [];
  let safeResumeAfterId = options.afterId;

  if (options.mode === "apply") {
    await seedBlogLinkLibrary();
  }

  let cursor = options.afterId;
  while (true) {
    const posts: PostSnapshot[] = await db
      .select({
        id: blogPosts.id,
        slug: blogPosts.slug,
        language: blogPosts.language,
        status: blogPosts.status,
        content: blogPosts.content,
        publishedAt: blogPosts.publishedAt,
        createdAt: blogPosts.createdAt,
        updatedAt: blogPosts.updatedAt,
      })
      .from(blogPosts)
      .where(gt(blogPosts.id, cursor))
      .orderBy(asc(blogPosts.id))
      .limit(options.batchSize);
    if (posts.length === 0) break;

    for (const post of posts) {
      cursor = post.id;
      totals.postsScanned += 1;
      try {
        const extracted = extractBlogLinkDocument(post.content || "", {
          postIdentity: post.id,
          publicSiteUrl,
        });
        totals.occurrences += extracted.occurrences.length;
        totals.rejectedOccurrences += extracted.rejected.length;

        for (const occurrence of extracted.occurrences) {
          const observation = observedUrls.get(occurrence.normalizedHref) || {
            normalizedHref: occurrence.normalizedHref,
            postIds: new Set<number>(),
          };
          observation.postIds.add(post.id);
          observedUrls.set(occurrence.normalizedHref, observation);
        }

        if (options.mode === "apply") {
          const result = await reconcileStoredBlogPostLinks(post.id, {
            origin: "backfill",
            publicSiteUrl,
          });
          totals.postsApplied += 1;
          totals.added += result.addedCount;
          totals.revived += result.revivedCount;
          totals.updated += result.updatedCount;
          totals.retained += result.retainedCount;
          totals.removed += result.removedCount;
        }

        await assertPostUnchanged(post);
        if (failures.length === 0) safeResumeAfterId = post.id;
      } catch (error) {
        failures.push({
          postId: post.id,
          message: error instanceof Error ? error.message : String(error),
        });
      }
    }

    console.log(
      `Processed through post ${cursor}: ${totals.postsScanned} scanned, `
      + `${totals.postsApplied} applied, ${failures.length} failed.`,
    );
  }

  const knownLinks = await loadKnownLinks(Array.from(observedUrls.keys()));
  const unknownUrls: Array<{ normalizedHref: string; postIds: number[] }> = [];
  for (const observation of Array.from(observedUrls.values())) {
    const known = knownLinks.get(observation.normalizedHref);
    if (!known) {
      unknownUrls.push({
        normalizedHref: observation.normalizedHref,
        postIds: Array.from(observation.postIds).sort((left, right) => left - right),
      });
      continue;
    }
    if (known.reviewStatus === "pending") {
      pendingUrls.set(observation.normalizedHref, observation.postIds);
    }
  }

  const report = {
    mode: options.mode,
    batchSize: options.batchSize,
    resumedAfterId: options.afterId,
    lastProcessedId: cursor,
    safeResumeAfterId,
    totals,
    unknownUrls: unknownUrls.sort((left, right) => (
      left.normalizedHref.localeCompare(right.normalizedHref)
    )),
    pendingUrls: Array.from(pendingUrls.entries())
      .map(([normalizedHref, postIds]) => ({
        normalizedHref,
        postIds: Array.from(postIds).sort((left, right) => left - right),
      }))
      .sort((left, right) => left.normalizedHref.localeCompare(right.normalizedHref)),
    failures,
  };
  console.log(JSON.stringify(report, null, 2));

  if (failures.length > 0) {
    throw new Error(
      `Blog link backfill completed with ${failures.length} failed post(s); `
      + `after resolving them, resume with --after-id=${safeResumeAfterId}`,
    );
  }
}

const options = parseBlogLinkBackfillOptions(process.argv.slice(2));
console.log(
  `Blog link backfill mode=${options.mode} batchSize=${options.batchSize} afterId=${options.afterId}`,
);

runBackfill(options)
  .catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
