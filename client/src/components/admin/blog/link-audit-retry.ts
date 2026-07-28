export type PendingAuditRequest = {
  idempotencyKey: string;
  linkIds: number[];
};

export function normalizeAuditLinkIds(
  values: readonly number[],
  maxLinkIds = 25,
): number[] {
  return Array.from(
    new Set(values.filter(value => Number.isInteger(value) && value > 0)),
  )
    .sort((left, right) => left - right)
    .slice(0, maxLinkIds);
}

export function normalizePendingAuditRequest(
  value: unknown,
  maxLinkIds = 25,
): PendingAuditRequest | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const candidate = value as Record<string, unknown>;
  const idempotencyKey = typeof candidate.idempotencyKey === "string"
    ? candidate.idempotencyKey.trim()
    : "";
  const linkIds = Array.isArray(candidate.linkIds)
    ? normalizeAuditLinkIds(
      candidate.linkIds.filter(
        (linkId): linkId is number => typeof linkId === "number",
      ),
      maxLinkIds,
    )
    : [];
  if (
    idempotencyKey.length < 8
    || idempotencyKey.length > 255
    || linkIds.length === 0
  ) {
    return null;
  }
  return { idempotencyKey, linkIds };
}

export function parsePendingAuditRequest(
  serialized: string | null,
  maxLinkIds = 25,
): PendingAuditRequest | null {
  if (!serialized) return null;
  try {
    return normalizePendingAuditRequest(JSON.parse(serialized), maxLinkIds);
  } catch {
    return null;
  }
}

export function serializePendingAuditRequest(
  request: PendingAuditRequest,
): string {
  return JSON.stringify(request);
}

export function isPendingAuditRequestForRun(
  request: PendingAuditRequest,
  run: {
    idempotencyKey: string;
    linkIds: number[];
  },
): boolean {
  const runRequest = normalizePendingAuditRequest(run);
  return Boolean(
    runRequest
    && request.idempotencyKey === runRequest.idempotencyKey
    && request.linkIds.length === runRequest.linkIds.length
    && request.linkIds.every(
      (linkId, index) => linkId === runRequest.linkIds[index],
    ),
  );
}

export function choosePendingAuditRequest(input: {
  storedRequest: PendingAuditRequest | null;
  interruptedRun?: {
    idempotencyKey: string;
    linkIds: number[];
  } | null;
  visibleLinkIds: number[];
  createIdempotencyKey: () => string;
}): PendingAuditRequest | null {
  if (input.interruptedRun) {
    return normalizePendingAuditRequest(input.interruptedRun);
  }
  if (input.storedRequest) return input.storedRequest;
  const linkIds = normalizeAuditLinkIds(input.visibleLinkIds);
  if (linkIds.length === 0) return null;
  return {
    idempotencyKey: input.createIdempotencyKey(),
    linkIds,
  };
}
