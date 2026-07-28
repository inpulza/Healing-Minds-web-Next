import {
  AlertTriangle,
  ExternalLink,
  Loader2,
  PencilLine,
  RefreshCw,
  ShieldBan,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatLinkDate,
  formatLinkScore,
  getManagedLinkUsageCount,
  humanizeLinkValue,
  LINK_HEALTH_BADGE_STYLES,
  LINK_REVIEW_BADGE_STYLES,
  type BlogLinkDetail,
  type BlogLinkReviewStatus,
  type BlogLinkSource,
  type ManagedBlogLink,
} from "./link-intelligence-types";

type ManagedLinkDetailSheetProps = {
  open: boolean;
  link: ManagedBlogLink | null;
  detail: BlogLinkDetail | null;
  isLoading: boolean;
  loadError?: string | null;
  reviewPending: boolean;
  sourceReviewPending: boolean;
  scoreUpdatePending: boolean;
  busyReviewId: number | null;
  checkPending: boolean;
  onOpenChange: (open: boolean) => void;
  onReview: (status: BlogLinkReviewStatus) => void;
  onReviewSource: (source: BlogLinkSource) => void;
  onEditScores: (link: ManagedBlogLink) => void;
  onCheck: (id: number) => void;
  onRetry: () => void;
};

export function ManagedLinkDetailSheet({
  open,
  link,
  detail,
  isLoading,
  loadError,
  reviewPending,
  sourceReviewPending,
  scoreUpdatePending,
  busyReviewId,
  checkPending,
  onOpenChange,
  onReview,
  onReviewSource,
  onEditScores,
  onCheck,
  onRetry,
}: ManagedLinkDetailSheetProps) {
  const activeUsages = (detail?.usages || []).filter(usage => !usage.removedAt);

  return (
    <Sheet open={open} onOpenChange={openState => {
      if (!openState && (reviewPending || sourceReviewPending || scoreUpdatePending)) return;
      onOpenChange(openState);
    }}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        {isLoading || (!link && !loadError) ? (
          <div className="space-y-4 pt-8" aria-label="Loading link details">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : loadError && !link ? (
          <Alert variant="destructive" className="mt-8">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            <AlertTitle>Link details unavailable</AlertTitle>
            <AlertDescription className="space-y-3">
              <p>{loadError}</p>
              <Button variant="outline" size="sm" onClick={onRetry}>
                <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        ) : link ? (
          <div className="space-y-6 pb-8">
            <SheetHeader className="pr-8">
              <SheetTitle>{link.title}</SheetTitle>
              <SheetDescription className="break-all">
                {link.displayHref || link.normalizedHref}
              </SheetDescription>
            </SheetHeader>

            {loadError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                <AlertTitle>Some detail is unavailable</AlertTitle>
                <AlertDescription className="space-y-3">
                  <p>{loadError}</p>
                  <Button variant="outline" size="sm" onClick={onRetry}>
                    <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
                    Retry detail
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{humanizeLinkValue(link.kind)} · {link.language.toUpperCase()}</Badge>
              <Badge variant="outline" className={LINK_REVIEW_BADGE_STYLES[link.reviewStatus]}>
                {humanizeLinkValue(link.reviewStatus)}
              </Badge>
              <Badge
                variant="outline"
                className={LINK_HEALTH_BADGE_STYLES[link.healthStatus] || LINK_HEALTH_BADGE_STYLES.unchecked}
              >
                {humanizeLinkValue(link.healthStatus)}
              </Badge>
              <Badge
                variant="outline"
                className={link.generationEligible ? "border-emerald-200 text-emerald-800" : ""}
              >
                AI {link.generationEligible ? "eligible" : "not eligible"}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => onReview("approved")}
                disabled={link.reviewStatus === "approved" || busyReviewId === link.id}
              >
                <ShieldCheck className="mr-2 h-4 w-4" aria-hidden="true" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onCheck(link.id)}
                disabled={checkPending}
              >
                {checkPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
                )}
                Check now
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReview("blocked")}
                disabled={link.reviewStatus === "blocked" || busyReviewId === link.id}
              >
                <ShieldBan className="mr-2 h-4 w-4" aria-hidden="true" />
                Block
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReview("retired")}
                disabled={link.reviewStatus === "retired" || busyReviewId === link.id}
              >
                <XCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                Retire
              </Button>
            </div>

            <Separator />

            <section aria-labelledby="link-score-heading" className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 id="link-score-heading" className="font-semibold text-slate-950">Separate quality signals</h3>
                  <p className="text-sm text-slate-600">
                    A healthy page is not automatically an authoritative medical source.
                  </p>
                </div>
                {link.kind === "external" && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onEditScores(link)}
                    disabled={scoreUpdatePending}
                  >
                    {scoreUpdatePending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <PencilLine className="mr-2 h-4 w-4" aria-hidden="true" />
                    )}
                    Edit exact page
                  </Button>
                )}
              </div>
              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-md bg-slate-50 p-3">
                  <dt className="text-xs text-slate-500">Source quality</dt>
                  <dd className="mt-1 text-xl font-semibold tabular-nums">
                    {formatLinkScore(link.source?.qualityScore)}
                  </dd>
                </div>
                <div className="rounded-md bg-slate-50 p-3">
                  <dt className="text-xs text-slate-500">Page evidence</dt>
                  <dd className="mt-1 text-xl font-semibold tabular-nums">
                    {formatLinkScore(link.evidenceScore)}
                  </dd>
                </div>
                <div className="rounded-md bg-slate-50 p-3">
                  <dt className="text-xs text-slate-500">Freshness</dt>
                  <dd className="mt-1 text-xl font-semibold tabular-nums">
                    {formatLinkScore(link.freshnessScore)}
                  </dd>
                </div>
                <div className="rounded-md bg-slate-50 p-3">
                  <dt className="text-xs text-slate-500">Current usages</dt>
                  <dd className="mt-1 text-xl font-semibold tabular-nums">
                    {getManagedLinkUsageCount(link)}
                  </dd>
                </div>
              </dl>
              {(Object.keys(link.source?.qualityBreakdown || {}).length > 0
                || Object.keys(link.scoreBreakdown || {}).length > 0) && (
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  {Object.keys(link.source?.qualityBreakdown || {}).length > 0 && (
                    <ScoreBreakdown
                      title="Source quality breakdown"
                      values={link.source?.qualityBreakdown || {}}
                    />
                  )}
                  {Object.keys(link.scoreBreakdown || {}).length > 0 && (
                    <ScoreBreakdown title="Page evidence breakdown" values={link.scoreBreakdown || {}} />
                  )}
                </div>
              )}
              <p className="text-xs text-slate-500">
                Policy: {link.scoreVersion || link.source?.scoreVersion || "Not recorded"}
              </p>
            </section>

            <Separator />

            <section aria-labelledby="link-review-heading" className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 id="link-review-heading" className="font-semibold text-slate-950">Publisher review</h3>
                  <p className="text-sm text-slate-600">
                    The publisher decision is independent from this exact page and its link review.
                  </p>
                </div>
                {link.kind === "external" && link.source && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onReviewSource(link.source!)}
                    disabled={sourceReviewPending}
                  >
                    {sourceReviewPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    )}
                    Review publisher
                  </Button>
                )}
              </div>
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-slate-500">Publisher</dt>
                  <dd className="mt-1 text-slate-900">{link.source?.name || "First-party or not assigned"}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Source type</dt>
                  <dd className="mt-1 text-slate-900">{humanizeLinkValue(link.source?.sourceType)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Publisher status</dt>
                  <dd className="mt-1">
                    {link.source?.reviewStatus ? (
                      <Badge
                        variant="outline"
                        className={LINK_REVIEW_BADGE_STYLES[link.source.reviewStatus]}
                      >
                        {humanizeLinkValue(link.source.reviewStatus)}
                      </Badge>
                    ) : (
                      <span className="text-slate-900">Not assigned</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Publisher reviewed by</dt>
                  <dd className="mt-1 text-slate-900">
                    {link.source?.reviewedBy || "Not recorded"}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Publisher reviewed at</dt>
                  <dd className="mt-1 text-slate-900">
                    {formatLinkDate(link.source?.reviewedAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Publisher review due</dt>
                  <dd className="mt-1 text-slate-900">
                    {formatLinkDate(link.sourceReviewDueAt)}
                  </dd>
                </div>
              </dl>
              {link.source?.reviewNotes && (
                <p className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">
                  {link.source.reviewNotes}
                </p>
              )}
            </section>

            <Separator />

            <section aria-labelledby="page-review-heading" className="space-y-3">
              <h3 id="page-review-heading" className="font-semibold text-slate-950">Exact page review</h3>
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-slate-500">Link status</dt>
                  <dd className="mt-1">
                    <Badge variant="outline" className={LINK_REVIEW_BADGE_STYLES[link.reviewStatus]}>
                      {humanizeLinkValue(link.reviewStatus)}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Reviewed by</dt>
                  <dd className="mt-1 text-slate-900">{link.reviewedBy || "Not recorded"}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Reviewed at</dt>
                  <dd className="mt-1 text-slate-900">{formatLinkDate(link.reviewedAt)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Review due</dt>
                  <dd className="mt-1 text-slate-900">{formatLinkDate(link.pageReviewDueAt)}</dd>
                </div>
              </dl>
              {link.reviewNotes && (
                <p className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">
                  {link.reviewNotes}
                </p>
              )}
              {link.summary && (
                <div>
                  <p className="text-sm font-medium text-slate-800">Evidence scope</p>
                  <p className="mt-1 text-sm text-slate-600">{link.summary}</p>
                </div>
              )}
            </section>

            <Separator />

            <section aria-labelledby="link-health-heading" className="space-y-3">
              <h3 id="link-health-heading" className="font-semibold text-slate-950">Technical health</h3>
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-slate-500">Last check</dt>
                  <dd className="mt-1 text-slate-900">{formatLinkDate(link.lastCheckedAt)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Next check</dt>
                  <dd className="mt-1 text-slate-900">{formatLinkDate(link.nextCheckAt)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">HTTP status</dt>
                  <dd className="mt-1 text-slate-900">{link.httpStatus ?? "Not recorded"}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Consecutive failures</dt>
                  <dd className="mt-1 text-slate-900">{link.consecutiveFailures ?? 0}</dd>
                </div>
              </dl>
              {link.finalHref && link.finalHref !== link.normalizedHref && (
                <p className="break-all rounded-md bg-violet-50 p-3 text-sm text-violet-900">
                  Resolved target: {link.finalHref}
                </p>
              )}
              <div className="space-y-2">
                {(detail?.checks || []).slice(0, 5).map(check => (
                  <div
                    key={check.id}
                    className="flex items-start justify-between gap-4 rounded-md bg-slate-50 p-3 text-sm"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{humanizeLinkValue(check.result)}</p>
                      <p className="text-xs text-slate-500">{formatLinkDate(check.checkedAt)}</p>
                    </div>
                    <p className="text-right text-xs text-slate-600">
                      {check.httpStatus ? `HTTP ${check.httpStatus}` : check.errorCategory || "No status"}
                      {typeof check.durationMs === "number" ? ` · ${check.durationMs} ms` : ""}
                    </p>
                  </div>
                ))}
                {(detail?.checks || []).length === 0 && (
                  <p className="text-sm text-slate-500">No health-check history has been recorded.</p>
                )}
              </div>
            </section>

            <Separator />

            <section aria-labelledby="link-usages-heading" className="space-y-3">
              <h3 id="link-usages-heading" className="font-semibold text-slate-950">
                Current article usages ({activeUsages.length})
              </h3>
              <div className="space-y-2">
                {activeUsages.map(usage => (
                  <div key={usage.id} className="rounded-md bg-slate-50 p-3">
                    <p className="text-sm font-medium text-slate-900">
                      {usage.postTitle || `Post ${usage.postId}`}
                    </p>
                    <p className="mt-1 text-sm text-slate-700">
                      “{usage.anchorText || "Anchor text not recorded"}”
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {usage.sectionHeading || "No section heading"} · {humanizeLinkValue(usage.origin)}
                    </p>
                  </div>
                ))}
                {activeUsages.length === 0 && (
                  <p className="text-sm text-slate-500">This target is not present in saved post HTML.</p>
                )}
              </div>
            </section>

            <Button variant="outline" asChild className="w-full">
              <a
                href={link.displayHref || link.normalizedHref}
                target={link.kind === "external" ? "_blank" : undefined}
                rel={link.kind === "external" ? "noopener noreferrer" : undefined}
              >
                Open target
                <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function ScoreBreakdown({ title, values }: { title: string; values: Record<string, unknown> }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <p className="font-medium text-slate-800">{title}</p>
      <dl className="mt-2 space-y-1">
        {Object.entries(values).map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-3">
            <dt className="text-slate-500">{humanizeLinkValue(label)}</dt>
            <dd className="tabular-nums text-slate-900">
              {typeof value === "number" || typeof value === "string" ? value : "Recorded"}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
