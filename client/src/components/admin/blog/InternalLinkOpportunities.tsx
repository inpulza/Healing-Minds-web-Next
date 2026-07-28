import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowRight,
  FileSearch,
  Link2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  humanizeLinkValue,
  type ApiResponse,
  type BlogLinkOpportunity,
  type PublishedBlogPostOption,
} from "./link-intelligence-types";

type InternalLinkOpportunitiesProps = {
  enabled: boolean;
};

type OpportunityPayload = BlogLinkOpportunity[] | {
  opportunities?: BlogLinkOpportunity[];
  items?: BlogLinkOpportunity[];
};

function getOpportunities(payload: OpportunityPayload | undefined): BlogLinkOpportunity[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  return payload.opportunities || payload.items || [];
}

function opportunityTone(score: number): string {
  if (score >= 80) return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (score >= 65) return "border-amber-200 bg-amber-50 text-amber-800";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

export function InternalLinkOpportunities({ enabled }: InternalLinkOpportunitiesProps) {
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const postsQuery = useQuery<ApiResponse<PublishedBlogPostOption[]>>({
    queryKey: ["/api/admin/blog/posts?status=published&language=all&search="],
    enabled,
    staleTime: 30_000,
  });

  const opportunitiesQuery = useQuery<ApiResponse<OpportunityPayload>>({
    queryKey: [`/api/admin/blog/posts/${selectedPostId ?? "none"}/link-opportunities`],
    enabled: enabled && selectedPostId !== null,
    staleTime: 15_000,
  });

  if (!enabled) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>Internal opportunities are disabled</AlertTitle>
        <AlertDescription>
          Enable Link Intelligence after the route inventory and published-post backfill have been reviewed.
        </AlertDescription>
      </Alert>
    );
  }

  const posts = postsQuery.data?.data || [];
  const opportunities = getOpportunities(opportunitiesQuery.data?.data);
  const selectedPost = posts.find(post => post.id === selectedPostId);

  return (
    <section aria-labelledby="internal-opportunities-title" className="space-y-5">
      <div>
        <h2 id="internal-opportunities-title" className="text-lg font-semibold text-slate-950">
          Internal link opportunities
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Suggestions are editorial aids. They never change article content automatically.
        </p>
      </div>

      {postsQuery.isError ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>Published posts could not be loaded</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>{postsQuery.error instanceof Error ? postsQuery.error.message : "Please try again."}</p>
            <Button variant="outline" size="sm" onClick={() => postsQuery.refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <div className="max-w-2xl space-y-2">
          <Label htmlFor="opportunity-source-post">Source article</Label>
          <Select
            value={selectedPostId ? String(selectedPostId) : undefined}
            onValueChange={value => setSelectedPostId(Number(value))}
            disabled={postsQuery.isLoading || posts.length === 0}
          >
            <SelectTrigger id="opportunity-source-post">
              <SelectValue placeholder={postsQuery.isLoading ? "Loading published posts..." : "Choose a published article"} />
            </SelectTrigger>
            <SelectContent>
              {posts.map(post => (
                <SelectItem key={post.id} value={String(post.id)}>
                  {post.title} ({post.language.toUpperCase()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500">
            Only public, canonical, indexable destinations in a compatible language are eligible.
          </p>
        </div>
      )}

      <div className="sr-only" aria-live="polite">
        {opportunitiesQuery.isFetching
          ? "Calculating internal link opportunities."
          : selectedPostId
            ? `${opportunities.length} opportunities available.`
            : "Choose a source article to calculate opportunities."}
      </div>

      {!selectedPostId ? (
        <div className="rounded-lg bg-slate-50 px-6 py-12 text-center">
          <FileSearch className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
          <h3 className="mt-3 font-medium text-slate-900">Choose a source article</h3>
          <p className="mt-1 text-sm text-slate-600">
            The system scores each source-to-destination pair, not the destination in isolation.
          </p>
        </div>
      ) : opportunitiesQuery.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2" aria-label="Loading internal link opportunities">
          <Skeleton className="h-52 rounded-lg" />
          <Skeleton className="h-52 rounded-lg" />
        </div>
      ) : opportunitiesQuery.isError ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>Opportunities could not be calculated</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>
              {opportunitiesQuery.error instanceof Error
                ? opportunitiesQuery.error.message
                : "The article remains unchanged."}
            </p>
            <Button variant="outline" size="sm" onClick={() => opportunitiesQuery.refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      ) : opportunities.length === 0 ? (
        <div className="rounded-lg bg-slate-50 px-6 py-12 text-center">
          <Link2 className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
          <h3 className="mt-3 font-medium text-slate-900">No eligible opportunity found</h3>
          <p className="mt-1 text-sm text-slate-600">
            {selectedPost?.title || "This article"} may already be well connected, or no target passed the hard gates.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {opportunities.map(opportunity => {
            const opportunityKey = opportunity.id
              ?? opportunity.stableKey
              ?? `${opportunity.sourcePostId}-${opportunity.targetLinkId ?? opportunity.targetPostId ?? opportunity.targetHref}`;
            const breakdownEntries = Object.entries(opportunity.breakdown || {});

            return (
              <Card key={opportunityKey} className="shadow-none">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Suggested destination</p>
                      <CardTitle className="mt-1 truncate text-base">{opportunity.targetTitle}</CardTitle>
                    </div>
                    <Badge variant="outline" className={opportunityTone(opportunity.score)}>
                      {opportunity.score}/100
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="truncate">{selectedPost?.title}</span>
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{opportunity.targetHref}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{opportunity.language.toUpperCase()}</Badge>
                    <Badge variant="outline">{humanizeLinkValue(opportunity.band || (opportunity.score >= 80 ? "recommended" : "optional"))}</Badge>
                    {opportunity.targetStatus && <Badge variant="outline">{humanizeLinkValue(opportunity.targetStatus)}</Badge>}
                  </div>

                  {breakdownEntries.length > 0 && (
                    <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                      {breakdownEntries.map(([label, value]) => (
                        <div key={label} className="rounded-md bg-slate-50 p-2">
                          <dt className="text-xs text-slate-500">{humanizeLinkValue(label)}</dt>
                          <dd className="mt-1 font-medium tabular-nums text-slate-900">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  {(opportunity.reasons || []).length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-slate-800">Why it helps</p>
                      <ul className="mt-2 space-y-1 text-sm text-slate-600">
                        {(opportunity.reasons || []).map(reason => (
                          <li key={reason} className="flex gap-2">
                            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="text-xs text-slate-500">
                    {opportunity.existingIncomingLinks ?? 0} existing incoming links
                    {(opportunity.currentAnchors || []).length > 0
                      ? ` · Current anchors: ${(opportunity.currentAnchors || []).join(", ")}`
                      : ""}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
