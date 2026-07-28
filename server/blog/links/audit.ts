import { randomUUID } from "node:crypto";
import { lookup } from "node:dns/promises";
import { request as httpsRequest } from "node:https";
import { eq } from "drizzle-orm";
import {
  blogLinkChecks,
  blogLinks,
  blogLinkSources,
  blogPosts,
  type BlogLink,
  type BlogLinkAuditRun,
  type BlogLinkHealthStatus,
  type BlogLinkSource,
} from "@shared/schema";
import { db } from "../../db";
import { getActiveBlogRedirect } from "../storage";
import { isKnownRoute } from "../../utils/html-injection";
import { BLOG_LINK_CUTOVER_MARKER_KEY, getBlogLinkConfig } from "./config";
import {
  isForbiddenExternalHostname,
  rememberCrossDomainBlogLinkRedirect,
} from "./normalization";
import { createPinnedBlogLinkLookup } from "./pinned-lookup";
import {
  assertBlogLinkAuditIdempotencyMatch,
  canonicalizeBlogLinkAuditIds,
  isLiveManagedBlogPostTarget,
  isManagedBlogPostTarget,
} from "./policy";
import { calculateGenerationEligibility } from "./service";
import {
  advanceBlogLinkAuditCheckpoint,
  getPendingBlogLinkAuditIds,
  isSameBlogLinkAuditTarget,
  nextBlogLinkAuditFailureCount,
  readBlogLinkAuditCheckpoint,
  shouldResumeBlogLinkAuditStatus,
  type BlogLinkAuditCheckpoint,
  type BlogLinkAuditLease,
  type BlogLinkAuditOutcome,
} from "./audit-recovery";
import {
  checkpointBlogLinkAuditRun,
  claimBlogLinkAuditRun,
  completeBlogLinkAuditRun,
  createBlogLinkAuditRun as persistBlogLinkAuditRun,
  failBlogLinkAuditRun,
  getBlogLinkAuditRun as loadBlogLinkAuditRun,
  getBlogLinkAuditRunByIdempotencyKey,
  heartbeatBlogLinkAuditRun,
  markStaleBlogLinkAuditRunsInterrupted as persistStaleAuditRunRecovery,
  requeueInterruptedBlogLinkAuditRun,
} from "./storage";

const STALE_AUDIT_MS = 15 * 60 * 1_000;

type LinkWithSource = {
  link: BlogLink;
  source: BlogLinkSource | null;
};

type BlogLinkAuditRunWriteContext = {
  lease: BlogLinkAuditLease;
  checkpoint: BlogLinkAuditCheckpoint;
};

const BLOG_LINK_AUDIT_LEASE_LOST = "blog_link_audit_lease_lost";

function createBlogLinkAuditLeaseLostError(): Error {
  return Object.assign(
    new Error("Blog link audit lease is no longer current"),
    { code: BLOG_LINK_AUDIT_LEASE_LOST },
  );
}

function isBlogLinkAuditLeaseLostError(error: unknown): boolean {
  return (error as { code?: string })?.code === BLOG_LINK_AUDIT_LEASE_LOST;
}

function isBlogLinkAuditTargetConflictError(error: unknown): boolean {
  return (error as { code?: string })?.code?.startsWith(
    "blog_link_audit_target_",
  ) === true;
}

function auditOutcome(result: BlogLinkAuditResult): BlogLinkAuditOutcome {
  if (result.healthStatus === "healthy") return "healthy";
  if (result.healthStatus === "redirected") return "redirected";
  return "attention";
}

type HeaderResult = {
  method: "HEAD" | "GET";
  statusCode: number;
  location: string | null;
  durationMs: number;
};

export type BlogLinkAuditResult = {
  linkId: number;
  healthStatus: BlogLinkHealthStatus;
  result: string;
  method: "INTERNAL" | "HEAD" | "GET";
  httpStatus: number | null;
  resolvedHref: string | null;
  redirectCount: number;
  durationMs: number;
  errorCategory: string | null;
};

export function isUnsafeBlogLinkAddress(address: string): boolean {
  return isForbiddenExternalHostname(address);
}

function assertSafeExternalUrl(url: URL): void {
  if (url.protocol !== "https:") {
    throw Object.assign(new Error("Only HTTPS external links can be checked"), {
      code: "unsafe_protocol",
    });
  }
  if (url.username || url.password) {
    throw Object.assign(new Error("Link URLs cannot contain credentials"), {
      code: "url_credentials",
    });
  }
  if (!getBlogLinkConfig().allowedExternalPorts.includes(url.port)) {
    throw Object.assign(new Error("The external link port is not allowed"), {
      code: "unsafe_port",
    });
  }
  const hostname = url.hostname.toLowerCase().replace(/\.$/, "");
  if (
    hostname === "localhost"
    || hostname.endsWith(".localhost")
    || hostname.endsWith(".local")
  ) {
    throw Object.assign(new Error("Local hostnames cannot be checked"), {
      code: "unsafe_hostname",
    });
  }
}

async function resolveSafeAddress(
  url: URL,
  timeoutMs: number,
): Promise<{ address: string; family: 4 | 6 }> {
  assertSafeExternalUrl(url);
  let timeoutHandle: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_resolve, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(Object.assign(new Error("DNS resolution timed out"), { code: "timeout" }));
    }, timeoutMs);
    timeoutHandle.unref();
  });
  let resolved;
  try {
    resolved = await Promise.race([
      lookup(url.hostname, { all: true, verbatim: true }),
      timeout,
    ]);
  } finally {
    if (timeoutHandle) clearTimeout(timeoutHandle);
  }
  if (resolved.length === 0) {
    throw Object.assign(new Error("Hostname did not resolve"), { code: "dns_empty" });
  }
  if (resolved.some(item => isUnsafeBlogLinkAddress(item.address))) {
    throw Object.assign(new Error("Hostname resolves to a non-public address"), {
      code: "unsafe_address",
    });
  }
  const chosen = resolved[0];
  return {
    address: chosen.address,
    family: chosen.family === 6 ? 6 : 4,
  };
}

async function requestHeaders(
  url: URL,
  method: "HEAD" | "GET",
  timeoutMs: number,
): Promise<HeaderResult> {
  const startedAt = Date.now();
  const resolved = await resolveSafeAddress(url, timeoutMs);
  const requestTimeoutMs = timeoutMs - (Date.now() - startedAt);
  if (requestTimeoutMs <= 0) {
    throw Object.assign(new Error("Link check timed out"), { code: "timeout" });
  }

  return new Promise((resolve, reject) => {
    let settled = false;
    let wallClockTimer: NodeJS.Timeout | undefined;
    const clearWallClockTimer = () => {
      if (wallClockTimer) clearTimeout(wallClockTimer);
      wallClockTimer = undefined;
    };
    const request = httpsRequest(url, {
      method,
      headers: {
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.1",
        "User-Agent": "HealingMindsLinkAudit/1.0",
        ...(method === "GET" ? { Range: "bytes=0-0" } : {}),
      },
      lookup: createPinnedBlogLinkLookup(resolved),
    }, response => {
      const finish = (error?: Error) => {
        if (settled) return;
        settled = true;
        clearWallClockTimer();
        response.destroy();
        if (error) {
          reject(error);
          return;
        }
        resolve({
          method,
          statusCode: response.statusCode || 0,
          location: typeof response.headers.location === "string"
            ? response.headers.location
            : null,
          durationMs: Date.now() - startedAt,
        });
      };
      finish();
    });

    wallClockTimer = setTimeout(() => {
      request.destroy(Object.assign(new Error("Link check timed out"), { code: "timeout" }));
    }, requestTimeoutMs);
    wallClockTimer.unref();
    request.setTimeout(requestTimeoutMs, () => {
      request.destroy(Object.assign(new Error("Link check timed out"), { code: "timeout" }));
    });
    request.once("error", error => {
      if (settled) return;
      settled = true;
      clearWallClockTimer();
      reject(error);
    });
    request.end();
  });
}

function errorCategory(error: unknown): string {
  const value = error as NodeJS.ErrnoException & { code?: string };
  if (value.code === "timeout") return "timeout";
  if (value.code === "unsafe_address" || value.code === "unsafe_hostname") return "ssrf_blocked";
  if (value.code === "unsafe_protocol" || value.code === "unsafe_port" || value.code === "url_credentials") {
    return "unsafe_url";
  }
  if (value.code?.startsWith("CERT_") || value.code?.includes("TLS")) return "tls";
  if (value.code === "ENOTFOUND" || value.code === "EAI_AGAIN" || value.code === "dns_empty") return "dns";
  if (value.code === "ECONNRESET" || value.code === "ECONNREFUSED") return "connection";
  return "request_failed";
}

function nextCheckDate(
  link: BlogLink,
  source: BlogLinkSource | null,
  healthStatus: BlogLinkHealthStatus,
): Date {
  const days = healthStatus === "unreachable"
    ? 1
    : link.kind === "internal"
      ? 7
      : source?.sourceType === "crisis"
        ? 1
        : link.sourceCategory === "clinical"
          ? 7
          : 30;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1_000);
}

async function checkInternalLink(link: BlogLink): Promise<BlogLinkAuditResult> {
  const startedAt = Date.now();
  const redirect = await getActiveBlogRedirect(link.normalizedHref);
  if (redirect) {
    return {
      linkId: link.id,
      healthStatus: "redirected",
      result: "internal_redirect",
      method: "INTERNAL",
      httpStatus: redirect.statusCode,
      resolvedHref: redirect.targetPath,
      redirectCount: 1,
      durationMs: Date.now() - startedAt,
      errorCategory: null,
    };
  }

  const known = await isKnownRoute(link.normalizedHref);
  return {
    linkId: link.id,
    healthStatus: known ? "healthy" : "broken",
    result: known ? "internal_route_ok" : "internal_route_missing",
    method: "INTERNAL",
    httpStatus: known ? 200 : 404,
    resolvedHref: known ? link.normalizedHref : null,
    redirectCount: 0,
    durationMs: Date.now() - startedAt,
    errorCategory: known ? null : "not_found",
  };
}

async function checkExternalLink(
  link: BlogLink,
  source: BlogLinkSource | null,
): Promise<BlogLinkAuditResult> {
  const startedAt = Date.now();
  const initialUrl = new URL(link.normalizedHref);
  let currentUrl = initialUrl;
  let redirects = 0;
  let crossDomainSeen = false;
  let lastMethod: "HEAD" | "GET" = "HEAD";
  const config = getBlogLinkConfig();
  const deadline = startedAt + config.totalTimeoutMs;
  const requestWithBudget = async (
    url: URL,
    method: "HEAD" | "GET",
  ): Promise<HeaderResult> => {
    const remainingMs = deadline - Date.now();
    if (remainingMs <= 0) {
      throw Object.assign(new Error("Link check timed out"), { code: "timeout" });
    }
    return requestHeaders(url, method, Math.min(config.connectTimeoutMs, remainingMs));
  };

  try {
    while (true) {
      let response = await requestWithBudget(currentUrl, "HEAD");
      if ([400, 403, 404, 405, 406, 410, 416, 501].includes(response.statusCode)) {
        response = await requestWithBudget(currentUrl, "GET");
      }
      lastMethod = response.method;

      if (response.statusCode >= 300 && response.statusCode < 400) {
        if (!response.location) {
          return {
            linkId: link.id,
            healthStatus: "unreachable",
            result: "redirect_without_location",
            method: lastMethod,
            httpStatus: response.statusCode,
            resolvedHref: currentUrl.toString(),
            redirectCount: redirects,
            durationMs: Date.now() - startedAt,
            errorCategory: "invalid_redirect",
          };
        }
        if (redirects >= config.maxRedirects) {
          return {
            linkId: link.id,
            healthStatus: "unreachable",
            result: "too_many_redirects",
            method: lastMethod,
            httpStatus: response.statusCode,
            resolvedHref: currentUrl.toString(),
            redirectCount: redirects,
            durationMs: Date.now() - startedAt,
            errorCategory: "too_many_redirects",
          };
        }
        const nextUrl = new URL(response.location, currentUrl);
        assertSafeExternalUrl(nextUrl);
        crossDomainSeen = rememberCrossDomainBlogLinkRedirect(
          crossDomainSeen,
          currentUrl,
          nextUrl,
        );
        currentUrl = nextUrl;
        redirects += 1;
        continue;
      }

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return {
          linkId: link.id,
          healthStatus: crossDomainSeen
            ? "changed_review_needed"
            : redirects > 0
              ? "redirected"
              : "healthy",
          result: crossDomainSeen
            ? "cross_domain_redirect"
            : redirects > 0
              ? "redirect_ok"
              : "ok",
          method: lastMethod,
          httpStatus: response.statusCode,
          resolvedHref: currentUrl.toString(),
          redirectCount: redirects,
          durationMs: Date.now() - startedAt,
          errorCategory: null,
        };
      }

      if (response.statusCode === 404 || response.statusCode === 410) {
        const confirmed = (
          response.method === "GET"
          || (link.consecutiveFailures >= 1 && link.lastErrorCode === "not_found")
        );
        return {
          linkId: link.id,
          healthStatus: confirmed ? "broken" : "unreachable",
          result: confirmed ? "missing_confirmed" : "missing_unconfirmed",
          method: lastMethod,
          httpStatus: response.statusCode,
          resolvedHref: currentUrl.toString(),
          redirectCount: redirects,
          durationMs: Date.now() - startedAt,
          errorCategory: "not_found",
        };
      }

      return {
        linkId: link.id,
        healthStatus: "unreachable",
        result: response.statusCode === 403
          ? "forbidden"
          : response.statusCode === 429
            ? "rate_limited"
            : "http_error",
        method: lastMethod,
        httpStatus: response.statusCode || null,
        resolvedHref: currentUrl.toString(),
        redirectCount: redirects,
        durationMs: Date.now() - startedAt,
        errorCategory: response.statusCode === 429 ? "rate_limited" : "http_error",
      };
    }
  } catch (error) {
    return {
      linkId: link.id,
      healthStatus: "unreachable",
      result: "request_error",
      method: lastMethod,
      httpStatus: null,
      resolvedHref: currentUrl.toString(),
      redirectCount: redirects,
      durationMs: Date.now() - startedAt,
      errorCategory: errorCategory(error),
    };
  }
}

async function loadLinkWithSource(linkId: number): Promise<LinkWithSource | null> {
  const [row] = await db
    .select({
      link: blogLinks,
      source: blogLinkSources,
    })
    .from(blogLinks)
    .leftJoin(blogLinkSources, eq(blogLinks.sourceId, blogLinkSources.id))
    .where(eq(blogLinks.id, linkId))
    .limit(1);
  return row || null;
}

export async function auditBlogLinkById(
  linkId: number,
  runContext?: BlogLinkAuditRunWriteContext,
): Promise<BlogLinkAuditResult> {
  const row = await loadLinkWithSource(linkId);
  if (!row) {
    throw Object.assign(new Error("Blog link was not found"), { statusCode: 404 });
  }

  const result = row.link.kind === "internal"
    ? await checkInternalLink(row.link)
    : await checkExternalLink(row.link, row.source);
  const now = new Date();
  const successful = ["healthy", "redirected"].includes(result.healthStatus);
  const nextCheckpoint = runContext
    ? advanceBlogLinkAuditCheckpoint(
      runContext.checkpoint,
      linkId,
      auditOutcome(result),
    )
    : null;

  await db.transaction(async tx => {
    if (
      runContext
      && nextCheckpoint
      && !(await checkpointBlogLinkAuditRun(
        tx,
        runContext.lease,
        nextCheckpoint,
      ))
    ) {
      throw createBlogLinkAuditLeaseLostError();
    }

    const [observedLink] = await tx
      .select({
        id: blogLinks.id,
        normalizedHref: blogLinks.normalizedHref,
        canonicalKey: blogLinks.canonicalKey,
        kind: blogLinks.kind,
        sourceId: blogLinks.sourceId,
        targetPostId: blogLinks.targetPostId,
      })
      .from(blogLinks)
      .where(eq(blogLinks.id, linkId))
      .limit(1);
    if (!observedLink) {
      throw Object.assign(new Error("Blog link was removed during its audit"), {
        statusCode: 409,
        code: "blog_link_audit_target_missing",
      });
    }

    const [currentTargetPost] = observedLink.targetPostId
      ? await tx
        .select({
          id: blogPosts.id,
          status: blogPosts.status,
          slug: blogPosts.slug,
          language: blogPosts.language,
        })
        .from(blogPosts)
        .where(eq(blogPosts.id, observedLink.targetPostId))
        .limit(1)
        .for("update")
      : [];
    const [currentSource] = observedLink.sourceId
      ? await tx
        .select()
        .from(blogLinkSources)
        .where(eq(blogLinkSources.id, observedLink.sourceId))
        .limit(1)
        .for("update")
      : [];
    if (observedLink.sourceId && !currentSource) {
      throw Object.assign(new Error("Blog link publisher changed during its audit"), {
        statusCode: 409,
        code: "blog_link_audit_source_missing",
      });
    }
    const [currentLink] = await tx
      .select()
      .from(blogLinks)
      .where(eq(blogLinks.id, linkId))
      .limit(1)
      .for("update");
    if (!currentLink) {
      throw Object.assign(new Error("Blog link was removed during its audit"), {
        statusCode: 409,
        code: "blog_link_audit_target_missing",
      });
    }
    if (
      !isSameBlogLinkAuditTarget(row.link, currentLink)
      || !isSameBlogLinkAuditTarget(observedLink, currentLink)
    ) {
      throw Object.assign(new Error("Blog link target changed during its audit"), {
        statusCode: 409,
        code: "blog_link_audit_target_changed",
      });
    }
    if (
      isManagedBlogPostTarget(currentLink)
      && !isLiveManagedBlogPostTarget(currentLink, currentTargetPost)
    ) {
      throw Object.assign(
        new Error("Managed blog target changed publication state during its audit"),
        {
          statusCode: 409,
          code: "blog_link_audit_target_lifecycle_changed",
        },
      );
    }
    const consecutiveFailures = nextBlogLinkAuditFailureCount(
      currentLink.consecutiveFailures,
      result.healthStatus,
    );
    const nextCheckAt = nextCheckDate(
      currentLink,
      currentSource || null,
      result.healthStatus,
    );
    const generationEligible = calculateGenerationEligibility(
      {
        ...currentLink,
        healthStatus: result.healthStatus,
        nextCheckAt,
      },
      currentSource || null,
    ) && isLiveManagedBlogPostTarget(currentLink, currentTargetPost);

    await tx.insert(blogLinkChecks).values({
      runId: runContext?.lease.runId || null,
      linkId,
      checkedAt: now,
      method: result.method,
      result: result.result,
      httpStatus: result.httpStatus,
      resolvedHref: result.resolvedHref,
      redirectCount: result.redirectCount,
      durationMs: result.durationMs,
      errorCategory: result.errorCategory,
    });

    await tx
      .update(blogLinks)
      .set({
        healthStatus: result.healthStatus,
        httpStatus: result.httpStatus,
        finalHref: result.resolvedHref,
        redirectCount: result.redirectCount,
        consecutiveFailures,
        lastCheckedAt: now,
        ...(successful ? { lastSuccessfulAt: now } : {}),
        nextCheckAt,
        lastErrorCode: result.errorCategory,
        generationEligible,
        updatedAt: now,
      })
      .where(eq(blogLinks.id, linkId));
  });

  return result;
}

export async function createBlogLinkAuditRun(input: {
  idempotencyKey: string;
  linkIds: number[];
  requestedBy?: string | null;
}): Promise<{ run: BlogLinkAuditRun; created: boolean }> {
  // The cutover marker lives in this same table (it is the durable evidence the
  // startup guard looks for) and API callers may choose their own idempotency
  // key, so that one key is reserved: a normal audit must not be able to occupy
  // it, overwrite it, or make an unfinished cutover look finished.
  if (input.idempotencyKey === BLOG_LINK_CUTOVER_MARKER_KEY) {
    throw Object.assign(
      new Error("This idempotency key is reserved for the Link Intelligence cutover marker"),
      { statusCode: 400, code: "blog_link_audit_reserved_idempotency_key" },
    );
  }

  const canonicalLinkIds = canonicalizeBlogLinkAuditIds(input.linkIds);
  const existing = await getBlogLinkAuditRunByIdempotencyKey(input.idempotencyKey);
  if (existing) {
    assertBlogLinkAuditIdempotencyMatch(existing.input, canonicalLinkIds);
    if (shouldResumeBlogLinkAuditStatus(existing.status)) {
      try {
        const resumed = await requeueInterruptedBlogLinkAuditRun(existing.id);
        if (resumed) return { run: resumed, created: false };
        const current = await getBlogLinkAuditRunByIdempotencyKey(input.idempotencyKey);
        if (current) return { run: current, created: false };
      } catch (error) {
        if ((error as { code?: string }).code === "23505") {
          throw Object.assign(new Error("Another link audit is already running"), {
            statusCode: 409,
            code: "blog_link_audit_already_running",
          });
        }
        throw error;
      }
    }
    return { run: existing, created: false };
  }

  try {
    const created = await persistBlogLinkAuditRun({
      idempotencyKey: input.idempotencyKey,
      input: { linkIds: canonicalLinkIds },
      requestedBy: input.requestedBy || null,
      heartbeatAt: new Date(),
    });
    return { run: created, created: true };
  } catch (error) {
    const dbError = error as { code?: string };
    if (dbError.code !== "23505") throw error;
    const raceWinner = await getBlogLinkAuditRunByIdempotencyKey(input.idempotencyKey);
    if (raceWinner) {
      assertBlogLinkAuditIdempotencyMatch(raceWinner.input, canonicalLinkIds);
      return { run: raceWinner, created: false };
    }
    throw Object.assign(new Error("Another link audit is already running"), {
      statusCode: 409,
    });
  }
}

export async function getBlogLinkAuditRun(id: number): Promise<BlogLinkAuditRun | undefined> {
  return loadBlogLinkAuditRun(id);
}

export async function processBlogLinkAuditRun(runId: number): Promise<void> {
  const leaseToken = randomUUID();
  const run = await claimBlogLinkAuditRun(runId, leaseToken);
  if (!run) return;
  const lease: BlogLinkAuditLease = {
    runId: run.id,
    token: leaseToken,
    epoch: run.leaseEpoch,
  };

  const input = run.input as { linkIds?: unknown };
  const linkIds = Array.isArray(input.linkIds)
    ? input.linkIds.filter((value): value is number => Number.isInteger(value) && Number(value) > 0)
    : [];
  let checkpoint = readBlogLinkAuditCheckpoint(run.result, linkIds);

  try {
    for (const linkId of getPendingBlogLinkAuditIds(linkIds, checkpoint)) {
      try {
        const result = await auditBlogLinkById(linkId, {
          lease,
          checkpoint,
        });
        checkpoint = advanceBlogLinkAuditCheckpoint(
          checkpoint,
          linkId,
          auditOutcome(result),
        );
      } catch (error) {
        if (isBlogLinkAuditLeaseLostError(error)) return;
        if (isBlogLinkAuditTargetConflictError(error)) throw error;
        checkpoint = advanceBlogLinkAuditCheckpoint(
          checkpoint,
          linkId,
          "failed",
        );
        if (!(await heartbeatBlogLinkAuditRun(lease, checkpoint))) return;
      }
    }

    await completeBlogLinkAuditRun(lease, checkpoint);
  } catch (error) {
    if (isBlogLinkAuditLeaseLostError(error)) return;
    const failed = await failBlogLinkAuditRun(lease, {
      ...checkpoint,
      error: error instanceof Error ? error.message.slice(0, 500) : "Link audit failed",
    });
    if (!failed) return;
    throw error;
  }
}

export async function markStaleBlogLinkAuditRunsInterrupted(): Promise<number> {
  const cutoff = new Date(Date.now() - STALE_AUDIT_MS);
  return persistStaleAuditRunRecovery(cutoff);
}
