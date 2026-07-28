import { useQuery } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  CheckCircle2,
  FileWarning,
  Link2,
  RefreshCw,
  Route,
  ShieldQuestion,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApiResponse, LinkIntelligenceSummary } from "./link-intelligence-types";

type LinkOverviewProps = {
  enabled: boolean;
};

type SummaryMetric = {
  key: keyof LinkIntelligenceSummary;
  label: string;
  description: string;
  icon: LucideIcon;
  tone: string;
};

const SUMMARY_METRICS: SummaryMetric[] = [
  {
    key: "publishedBrokenLinks",
    label: "Published broken links",
    description: "Confirmed broken targets currently present in published posts.",
    icon: FileWarning,
    tone: "text-rose-700",
  },
  {
    key: "pendingMedicalSources",
    label: "Pending publishers",
    description: "External medical publishers waiting for human approval.",
    icon: ShieldQuestion,
    tone: "text-amber-700",
  },
  {
    key: "staleMedicalSources",
    label: "Stale medical sources",
    description: "Approved sources that need a fresh editorial review.",
    icon: AlertTriangle,
    tone: "text-orange-700",
  },
  {
    key: "linksNeedingHealthCheck",
    label: "Links needing a health check",
    description: "Approved targets that are unchecked, unreachable, stale, or past their technical check date.",
    icon: RefreshCw,
    tone: "text-cyan-700",
  },
  {
    key: "orphanPublishedPosts",
    label: "Orphan published posts",
    description: "Published posts with no current inbound internal link.",
    icon: Link2,
    tone: "text-sky-700",
  },
  {
    key: "redirectedReviewNeeded",
    label: "Redirects needing review",
    description: "Targets whose destination changed and require a decision.",
    icon: Route,
    tone: "text-violet-700",
  },
  {
    key: "generationEligibleLinks",
    label: "Generation-eligible links",
    description: "Approved, healthy targets available to AI Blog Generate.",
    icon: CheckCircle2,
    tone: "text-emerald-700",
  },
];

export function LinkOverview({ enabled }: LinkOverviewProps) {
  const summaryQuery = useQuery<ApiResponse<LinkIntelligenceSummary>>({
    queryKey: ["/api/admin/blog/links/summary"],
    enabled,
    staleTime: 30_000,
    refetchOnMount: "always",
  });

  if (!enabled) {
    return (
      <Alert>
        <ShieldQuestion className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>Link Intelligence is not enabled</AlertTitle>
        <AlertDescription>
          Apply the database migration and enable BLOG_LINK_ENABLED before using this workspace.
        </AlertDescription>
      </Alert>
    );
  }

  if (summaryQuery.isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Loading link intelligence summary">
        {SUMMARY_METRICS.map(metric => (
          <Skeleton key={metric.key} className="h-36 rounded-lg" />
        ))}
      </div>
    );
  }

  if (summaryQuery.isError || !summaryQuery.data?.data) {
    return (
      <Alert variant="destructive" role="alert">
        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>Summary unavailable</AlertTitle>
        <AlertDescription className="space-y-3">
          <p>{summaryQuery.error instanceof Error ? summaryQuery.error.message : "The summary could not be loaded."}</p>
          <Button variant="outline" size="sm" onClick={() => summaryQuery.refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const summary = summaryQuery.data.data;

  return (
    <section aria-labelledby="link-overview-title" className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="link-overview-title" className="text-lg font-semibold text-slate-950">
            What needs attention
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Editorial approval, technical health and internal opportunity remain separate signals.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => summaryQuery.refetch()}
          disabled={summaryQuery.isFetching}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${summaryQuery.isFetching ? "animate-spin" : ""}`}
            aria-hidden="true"
          />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-live="polite">
        {SUMMARY_METRICS.map(metric => {
          const Icon = metric.icon;
          return (
            <Card key={metric.key} className="shadow-none">
              <CardHeader className="flex-row items-start justify-between space-y-0 pb-3">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-slate-700">{metric.label}</CardTitle>
                  <p className="text-3xl font-semibold tracking-tight text-slate-950">
                    {summary[metric.key] ?? 0}
                  </p>
                </div>
                <Icon className={`h-5 w-5 ${metric.tone}`} aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <CardDescription>{metric.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
