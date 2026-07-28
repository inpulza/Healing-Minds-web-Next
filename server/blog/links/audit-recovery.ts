export type BlogLinkAuditCounts = {
  requested: number;
  checked: number;
  healthy: number;
  redirected: number;
  attention: number;
  failed: number;
};

export type BlogLinkAuditCheckpoint = BlogLinkAuditCounts & {
  completedLinkIds: number[];
};

export type BlogLinkAuditOutcome =
  | "healthy"
  | "redirected"
  | "attention"
  | "failed";

export type BlogLinkAuditLease = {
  runId: number;
  token: string;
  epoch: number;
};

export const BLOG_LINK_AUDIT_ROW_LOCK_ORDER = [
  "target_post",
  "source",
  "link",
] as const;

export type BlogLinkAuditTargetIdentity = {
  id: number;
  normalizedHref: string;
  canonicalKey: string;
  kind: string;
  sourceId: number | null;
  targetPostId: number | null;
};

type BlogLinkAuditLeaseSnapshot = {
  id: number;
  status: string;
  leaseToken: string | null;
  leaseEpoch: number;
};

function asNonNegativeInteger(value: unknown): number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0
    ? value
    : 0;
}

function canonicalRequestedIds(linkIds: readonly number[]): number[] {
  return Array.from(
    new Set(linkIds.filter(linkId => Number.isInteger(linkId) && linkId > 0)),
  ).sort((left, right) => left - right);
}

export function readBlogLinkAuditCheckpoint(
  result: Record<string, unknown> | null | undefined,
  requestedLinkIds: readonly number[],
): BlogLinkAuditCheckpoint {
  const requestedIds = canonicalRequestedIds(requestedLinkIds);
  const requestedSet = new Set(requestedIds);
  const completedValues = result?.completedLinkIds;
  const completedLinkIds = Array.isArray(completedValues)
    ? canonicalRequestedIds(
      completedValues.filter(
        (value): value is number => (
          typeof value === "number"
          && requestedSet.has(value)
        ),
      ),
    )
    : [];
  const categoryCounts = {
    healthy: asNonNegativeInteger(result?.healthy),
    redirected: asNonNegativeInteger(result?.redirected),
    attention: asNonNegativeInteger(result?.attention),
    failed: asNonNegativeInteger(result?.failed),
  };
  const categorizedCount = (
    categoryCounts.healthy
    + categoryCounts.redirected
    + categoryCounts.attention
    + categoryCounts.failed
  );

  if (categorizedCount !== completedLinkIds.length) {
    categoryCounts.healthy = 0;
    categoryCounts.redirected = 0;
    categoryCounts.attention = 0;
    categoryCounts.failed = completedLinkIds.length;
  }

  return {
    requested: requestedIds.length,
    checked: completedLinkIds.length,
    ...categoryCounts,
    completedLinkIds,
  };
}

export function advanceBlogLinkAuditCheckpoint(
  checkpoint: BlogLinkAuditCheckpoint,
  linkId: number,
  outcome: BlogLinkAuditOutcome,
): BlogLinkAuditCheckpoint {
  if (checkpoint.completedLinkIds.includes(linkId)) return checkpoint;

  return {
    ...checkpoint,
    checked: checkpoint.checked + 1,
    [outcome]: checkpoint[outcome] + 1,
    completedLinkIds: [...checkpoint.completedLinkIds, linkId]
      .sort((left, right) => left - right),
  };
}

export function getPendingBlogLinkAuditIds(
  requestedLinkIds: readonly number[],
  checkpoint: BlogLinkAuditCheckpoint,
): number[] {
  const completed = new Set(checkpoint.completedLinkIds);
  return canonicalRequestedIds(requestedLinkIds)
    .filter(linkId => !completed.has(linkId));
}

export function isBlogLinkAuditLeaseCurrent(
  snapshot: BlogLinkAuditLeaseSnapshot,
  lease: BlogLinkAuditLease,
): boolean {
  return (
    snapshot.id === lease.runId
    && snapshot.status === "running"
    && snapshot.leaseToken === lease.token
    && snapshot.leaseEpoch === lease.epoch
  );
}

export function shouldResumeBlogLinkAuditStatus(status: string): boolean {
  return status === "interrupted";
}

export function nextBlogLinkAuditFailureCount(
  currentConsecutiveFailures: number,
  healthStatus: string,
): number {
  if (healthStatus === "healthy" || healthStatus === "redirected") return 0;
  return Math.max(0, Math.floor(currentConsecutiveFailures)) + 1;
}

export function isSameBlogLinkAuditTarget(
  inspected: BlogLinkAuditTargetIdentity,
  current: BlogLinkAuditTargetIdentity,
): boolean {
  return (
    inspected.id === current.id
    && inspected.normalizedHref === current.normalizedHref
    && inspected.canonicalKey === current.canonicalKey
    && inspected.kind === current.kind
    && inspected.sourceId === current.sourceId
    && inspected.targetPostId === current.targetPostId
  );
}
