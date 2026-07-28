import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ApiResponse } from "./link-intelligence-types";
import {
  choosePendingAuditRequest,
  isPendingAuditRequestForRun,
  normalizeAuditLinkIds,
  parsePendingAuditRequest,
  serializePendingAuditRequest,
  type PendingAuditRequest,
} from "./link-audit-retry";

const MAX_LINK_IDS = 25;
const POLL_INTERVAL_MS = 2_000;
const RUN_STORAGE_KEY = "healing-blog-link-audit-run";
const REQUEST_STORAGE_KEY = "healing-blog-link-audit-request-v2";
const LEGACY_IDEMPOTENCY_STORAGE_KEY = "healing-blog-link-audit-idempotency";

type LinkAuditStatus = "queued" | "running" | "completed" | "failed" | "interrupted";

type LinkAuditRun = {
  id: number;
  idempotencyKey: string;
  status: LinkAuditStatus;
  input: Record<string, unknown>;
  result: Record<string, unknown> | null;
};

type LinkAuditCounts = {
  requested: number;
  checked: number;
  healthy: number;
  redirected: number;
  attention: number;
  failed: number;
};

type LinkAuditRunControlProps = {
  enabled: boolean;
  linkIds: number[];
  onCompleted: () => void;
};

const ACTIVE_STATUSES = new Set<LinkAuditStatus>(["queued", "running"]);

const STATUS_LABELS: Record<LinkAuditStatus, string> = {
  queued: "Queued",
  running: "Running",
  completed: "Completed",
  failed: "Failed",
  interrupted: "Interrupted",
};

const STATUS_STYLES: Record<LinkAuditStatus, string> = {
  queued: "border-sky-200 bg-sky-50 text-sky-800",
  running: "border-cyan-200 bg-cyan-50 text-cyan-800",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  failed: "border-rose-200 bg-rose-50 text-rose-800",
  interrupted: "border-amber-200 bg-amber-50 text-amber-800",
};

const COUNT_ITEMS: Array<{
  key: keyof LinkAuditCounts;
  label: string;
  className: string;
}> = [
  { key: "requested", label: "Requested", className: "text-slate-950" },
  { key: "checked", label: "Checked", className: "text-slate-950" },
  { key: "healthy", label: "Healthy", className: "text-emerald-700" },
  { key: "redirected", label: "Redirected", className: "text-violet-700" },
  { key: "attention", label: "Attention", className: "text-amber-700" },
  { key: "failed", label: "Failed checks", className: "text-rose-700" },
];

function getStoredRunId(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.sessionStorage.getItem(RUN_STORAGE_KEY);
    if (!value) return null;
    const runId = Number(value);
    if (Number.isInteger(runId) && runId > 0) return runId;
    window.sessionStorage.removeItem(RUN_STORAGE_KEY);
  } catch {
    // The control still works for this mount when storage is unavailable.
  }
  return null;
}

function getStoredValue(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStoredValue(key: string, value: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (value === null) window.sessionStorage.removeItem(key);
    else window.sessionStorage.setItem(key, value);
  } catch {
    // Session persistence is an enhancement; requests and polling remain usable.
  }
}

function getStoredPendingAuditRequest(): PendingAuditRequest | null {
  const serialized = getStoredValue(REQUEST_STORAGE_KEY);
  const request = parsePendingAuditRequest(serialized, MAX_LINK_IDS);
  if (serialized && !request) setStoredValue(REQUEST_STORAGE_KEY, null);
  setStoredValue(LEGACY_IDEMPOTENCY_STORAGE_KEY, null);
  return request;
}

function setStoredPendingAuditRequest(
  request: PendingAuditRequest | null,
): void {
  setStoredValue(
    REQUEST_STORAGE_KEY,
    request ? serializePendingAuditRequest(request) : null,
  );
}

function asCount(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : fallback;
}

function getRunLinkIds(run: LinkAuditRun | undefined): number[] {
  const values = run?.input?.linkIds;
  return Array.isArray(values)
    ? normalizeAuditLinkIds(
      values.filter((value): value is number => typeof value === "number"),
      MAX_LINK_IDS,
    )
    : [];
}

function getAuditCounts(run: LinkAuditRun | undefined): LinkAuditCounts {
  const runLinkIds = getRunLinkIds(run);
  const result = run?.result || {};
  return {
    requested: asCount(result.requested, runLinkIds.length),
    checked: asCount(result.checked),
    healthy: asCount(result.healthy),
    redirected: asCount(result.redirected),
    attention: asCount(result.attention),
    failed: asCount(result.failed),
  };
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function createIdempotencyKey(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `link-audit-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function LinkAuditRunControl({
  enabled,
  linkIds,
  onCompleted,
}: LinkAuditRunControlProps) {
  const allValidLinkIds = normalizeAuditLinkIds(
    linkIds,
    Number.MAX_SAFE_INTEGER,
  );
  const selectedLinkIds = allValidLinkIds.slice(0, MAX_LINK_IDS);
  const omittedCount = Math.max(0, allValidLinkIds.length - selectedLinkIds.length);
  const [runId, setRunId] = useState<number | null>(getStoredRunId);
  const completedRunRef = useRef<number | null>(null);
  const [pendingRequest, setPendingRequest] = useState<PendingAuditRequest | null>(
    getStoredPendingAuditRequest,
  );

  const runQuery = useQuery<ApiResponse<LinkAuditRun>>({
    queryKey: [`/api/admin/blog/link-audits/${runId ?? "none"}`],
    enabled: enabled && runId !== null,
    staleTime: 0,
    refetchOnMount: "always",
    refetchInterval: query => {
      const status = query.state.data?.data.status;
      return status && ACTIVE_STATUSES.has(status) ? POLL_INTERVAL_MS : false;
    },
    refetchIntervalInBackground: true,
  });

  const auditMutation = useMutation({
    mutationFn: async (request: PendingAuditRequest) => {
      const response = await apiRequest("POST", "/api/admin/blog/link-audits", {
        idempotencyKey: request.idempotencyKey,
        linkIds: request.linkIds,
      });
      return response.json() as Promise<ApiResponse<LinkAuditRun> & { created?: boolean }>;
    },
    onSuccess: (response, request) => {
      const nextRun = response.data;
      setPendingRequest(request);
      setStoredPendingAuditRequest(request);
      setStoredValue(RUN_STORAGE_KEY, String(nextRun.id));
      setRunId(nextRun.id);
      queryClient.setQueryData<ApiResponse<LinkAuditRun>>(
        [`/api/admin/blog/link-audits/${nextRun.id}`],
        response,
      );
    },
  });

  const run = runQuery.data?.data;
  const status = run?.status;
  const runLinkIds = getRunLinkIds(run);
  const displayedLinkIds = run
    ? runLinkIds
    : pendingRequest?.linkIds || selectedLinkIds;
  const displayedOmittedCount = run ? 0 : omittedCount;
  const counts = getAuditCounts(run);
  const isActive = status ? ACTIVE_STATUSES.has(status) : false;
  const hasUnresolvedStoredRun = runId !== null && !run && !runQuery.isError;
  const progressValue = counts.requested > 0
    ? Math.min(100, Math.round((counts.checked / counts.requested) * 100))
    : status === "completed"
      ? 100
      : 0;

  useEffect(() => {
    if (status !== "completed" || !run || completedRunRef.current === run.id) return;
    completedRunRef.current = run.id;
    setStoredValue(RUN_STORAGE_KEY, null);
    setStoredPendingAuditRequest(null);
    setPendingRequest(null);
    onCompleted();
  }, [onCompleted, run, status]);

  const startAudit = () => {
    if (!enabled || isActive || hasUnresolvedStoredRun) return;
    auditMutation.reset();

    const pendingBelongsToTerminalRun = Boolean(
      run
      && pendingRequest
      && (status === "completed" || status === "failed")
      && isPendingAuditRequestForRun(pendingRequest, {
        idempotencyKey: run.idempotencyKey,
        linkIds: runLinkIds,
      }),
    );
    const hasDetachedFailedRetry = Boolean(
      status === "failed"
      && run
      && pendingRequest
      && !isPendingAuditRequestForRun(pendingRequest, {
        idempotencyKey: run.idempotencyKey,
        linkIds: runLinkIds,
      }),
    );
    const runRetry = (
      (status === "interrupted" || status === "failed")
      && run
      && runLinkIds.length > 0
      && !hasDetachedFailedRetry
    )
      ? {
        idempotencyKey: status === "interrupted"
          ? run.idempotencyKey
          : createIdempotencyKey(),
        linkIds: runLinkIds,
      }
      : null;
    const request = choosePendingAuditRequest({
      storedRequest: pendingBelongsToTerminalRun
        ? null
        : pendingRequest,
      interruptedRun: runRetry,
      visibleLinkIds: selectedLinkIds,
      createIdempotencyKey,
    });
    if (!request) return;
    setPendingRequest(request);
    setStoredPendingAuditRequest(request);
    auditMutation.mutate(request);
  };

  const discardSavedAudit = () => {
    if (runId !== null) {
      queryClient.removeQueries({
        queryKey: [`/api/admin/blog/link-audits/${runId}`],
        exact: true,
      });
    }
    setStoredValue(RUN_STORAGE_KEY, null);
    setStoredPendingAuditRequest(null);
    setPendingRequest(null);
    auditMutation.reset();
    setRunId(null);
  };

  const hasAuditTargets = (
    selectedLinkIds.length > 0
    || Boolean(pendingRequest?.linkIds.length)
    || (
      (status === "interrupted" || status === "failed")
      && runLinkIds.length > 0
    )
  );
  const isStartDisabled = !enabled
    || !hasAuditTargets
    || isActive
    || auditMutation.isPending
    || hasUnresolvedStoredRun
    || (runId !== null && runQuery.isError && !run);

  const startLabel = auditMutation.isPending
    ? "Starting audit..."
    : isActive
      ? "Audit in progress"
      : status === "failed" || status === "interrupted" || auditMutation.isError
        ? "Retry audit"
        : !hasAuditTargets
          ? "No visible links to audit"
          : "Run health audit";

  return (
    <section
      aria-labelledby="link-audit-control-title"
      className="space-y-4 rounded-lg bg-slate-50 p-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-cyan-700" aria-hidden="true" />
            <h3 id="link-audit-control-title" className="text-sm font-semibold text-slate-950">
              Link health audit
            </h3>
            {status ? (
              <Badge variant="outline" className={STATUS_STYLES[status]}>
                {STATUS_LABELS[status]}
              </Badge>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-slate-600">
            Checks saved link IDs only. This control never accepts or submits a URL.
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={startAudit}
          disabled={isStartDisabled}
          className="shrink-0"
        >
          {auditMutation.isPending || isActive ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
          )}
          {startLabel}
        </Button>
      </div>

      <div>
        <div className="flex items-center justify-between gap-3 text-xs">
          <p className="font-medium text-slate-700">
            {run ? "Audited link IDs" : "Visible link IDs"} ({displayedLinkIds.length}/{MAX_LINK_IDS})
          </p>
          {displayedOmittedCount > 0 ? (
            <p className="text-amber-700">
              {displayedOmittedCount} not included
            </p>
          ) : null}
        </div>
        {displayedLinkIds.length > 0 ? (
          <ul
            className="mt-2 flex max-h-20 flex-wrap gap-1.5 overflow-y-auto"
            aria-label={run ? "Persisted link IDs included in this audit run" : "Visible link IDs available for a new audit"}
          >
            {displayedLinkIds.map(linkId => (
              <li key={linkId}>
                <Badge variant="outline" className="bg-white font-mono font-normal text-slate-700">
                  #{linkId}
                </Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-xs text-slate-500">No visible link IDs can be audited.</p>
        )}
      </div>

      {run ? (
        <div className="space-y-3" aria-live="polite" aria-atomic="true">
          <div className="flex items-center justify-between gap-3 text-xs text-slate-600">
            <p>
              Run <span className="font-mono text-slate-800">#{run.id}</span>
            </p>
            <p>{counts.checked} of {counts.requested} checked</p>
          </div>
          <Progress
            value={progressValue}
            className="h-2 bg-slate-200"
            aria-label={`Audit progress: ${counts.checked} of ${counts.requested} links checked`}
          />
          <dl className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {COUNT_ITEMS.map(item => (
              <div key={item.key} className="rounded-md bg-white px-2 py-2 text-center">
                <dt className="text-[11px] leading-tight text-slate-500">{item.label}</dt>
                <dd className={`mt-1 text-sm font-semibold ${item.className}`}>
                  {counts[item.key]}
                </dd>
              </div>
            ))}
          </dl>
          <p className="sr-only" role="status">
            Audit {STATUS_LABELS[run.status].toLowerCase()}. {counts.checked} of {counts.requested}
            links checked; {counts.healthy} healthy, {counts.redirected} redirected,{" "}
            {counts.attention} need attention, and {counts.failed} checks failed.
          </p>
        </div>
      ) : null}

      {!enabled ? (
        <p className="text-xs text-amber-700" role="status">
          Link Intelligence must be enabled before an audit can start or reconnect.
        </p>
      ) : null}

      {runId !== null && runQuery.isLoading && !run ? (
        <p className="flex items-center gap-2 text-xs text-slate-600" role="status" aria-live="polite">
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          Reconnecting to saved audit #{runId}...
        </p>
      ) : null}

      {runQuery.isError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>Audit progress unavailable</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>{getErrorMessage(runQuery.error, "The saved audit could not be loaded.")}</p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void runQuery.refetch()}
                disabled={runQuery.isFetching}
              >
                <RefreshCw
                  className={`h-4 w-4 ${runQuery.isFetching ? "animate-spin" : ""}`}
                  aria-hidden="true"
                />
                Retry status
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={discardSavedAudit}>
                Discard saved audit
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : null}

      {auditMutation.isError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>Audit could not be started</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>{getErrorMessage(auditMutation.error, "No link health checks were started. Try again.")}</p>
            <Button type="button" variant="outline" size="sm" onClick={discardSavedAudit}>
              Discard saved retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {status === "failed" || status === "interrupted" ? (
        <Button type="button" variant="ghost" size="sm" onClick={discardSavedAudit}>
          Discard this audit and start over
        </Button>
      ) : null}

      {status === "completed" ? (
        <p className="flex items-center gap-2 text-xs font-medium text-emerald-700" role="status">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          Audit completed. Link data can now be refreshed safely.
        </p>
      ) : null}
    </section>
  );
}
