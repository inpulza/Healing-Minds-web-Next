import { useDeferredValue, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Check,
  Eye,
  Link2,
  Loader2,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  formatLinkScore,
  getManagedLinkUsageCount,
  getLinkListTotal,
  getLinkListTotalPages,
  getManagedLinks,
  getMutationLink,
  humanizeLinkValue,
  LINK_HEALTH_BADGE_STYLES,
  LINK_REVIEW_BADGE_STYLES,
  normalizeLinkDetail,
  type ApiResponse,
  type BlogLinkReviewStatus,
  type BlogLinkSource,
  type LinkDetailPayload,
  type LinkListPayload,
  type LinkMutationPayload,
  type ManagedBlogLink,
} from "./link-intelligence-types";
import {
  AddManagedLinkDialog,
  EMPTY_MANAGED_LINK_FORM,
  type AddManagedLinkForm,
} from "./AddManagedLinkDialog";
import { LinkAuditRunControl } from "./LinkAuditRunControl";
import {
  createLinkScoresForm,
  EditLinkScoresDialog,
  type EditLinkScoresForm,
} from "./EditLinkScoresDialog";
import { ManagedLinkDetailSheet } from "./ManagedLinkDetailSheet";
import {
  createSourceReviewForm,
  ReviewLinkSourceDialog,
  type ReviewLinkSourceForm,
} from "./ReviewLinkSourceDialog";

type LinkLibraryViewProps = {
  enabled: boolean;
};

async function invalidateLinkQueries(): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({
      predicate: query => String(query.queryKey[0]).startsWith("/api/admin/blog/links"),
    }),
    queryClient.invalidateQueries({
      queryKey: ["/api/admin/blog/link-sources"],
    }),
  ]);
}

function parseManagedLinkTerms(value: string): string[] {
  return Array.from(new Set(
    value
      .split(",")
      .map(term => term.trim())
      .filter(Boolean),
  )).slice(0, 30);
}

export function LinkLibraryView({ enabled }: LinkLibraryViewProps) {
  const { toast } = useToast();
  const [kind, setKind] = useState("all");
  const [language, setLanguage] = useState("all");
  const [reviewStatus, setReviewStatus] = useState("all");
  const [healthStatus, setHealthStatus] = useState("all");
  const [eligibility, setEligibility] = useState("all");
  const [sourceId, setSourceId] = useState("all");
  const [categoryKey, setCategoryKey] = useState("");
  const [contentPillar, setContentPillar] = useState("");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim());
  const deferredCategoryKey = useDeferredValue(categoryKey.trim());
  const deferredContentPillar = useDeferredValue(contentPillar.trim());
  const [page, setPage] = useState(1);
  const [selectedLinkId, setSelectedLinkId] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<AddManagedLinkForm>(EMPTY_MANAGED_LINK_FORM);
  const [reviewAction, setReviewAction] = useState<BlogLinkReviewStatus | null>(null);
  const [reviewReason, setReviewReason] = useState("");
  const [sourceReviewTarget, setSourceReviewTarget] = useState<BlogLinkSource | null>(null);
  const [sourceReviewForm, setSourceReviewForm] = useState<ReviewLinkSourceForm | null>(null);
  const [scoreEditTarget, setScoreEditTarget] = useState<ManagedBlogLink | null>(null);
  const [scoreEditForm, setScoreEditForm] = useState<EditLinkScoresForm | null>(null);

  const listUrl = useMemo(() => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: "25",
    });
    if (kind !== "all") params.set("kind", kind);
    if (language !== "all") params.set("language", language);
    if (reviewStatus !== "all") params.set("reviewStatus", reviewStatus);
    if (healthStatus !== "all") params.set("healthStatus", healthStatus);
    if (eligibility !== "all") params.set("generationEligible", eligibility);
    if (sourceId !== "all") params.set("sourceId", sourceId);
    if (deferredCategoryKey) params.set("categoryKey", deferredCategoryKey);
    if (deferredContentPillar) params.set("contentPillar", deferredContentPillar);
    if (deferredSearch) params.set("search", deferredSearch);
    return `/api/admin/blog/links?${params.toString()}`;
  }, [
    deferredCategoryKey,
    deferredContentPillar,
    deferredSearch,
    eligibility,
    healthStatus,
    kind,
    language,
    page,
    reviewStatus,
    sourceId,
  ]);

  const linksQuery = useQuery<ApiResponse<LinkListPayload | ManagedBlogLink[]>>({
    queryKey: [listUrl],
    enabled,
    staleTime: 15_000,
  });

  const detailQuery = useQuery<ApiResponse<LinkDetailPayload>>({
    queryKey: [`/api/admin/blog/links/${selectedLinkId ?? "none"}`],
    enabled: enabled && selectedLinkId !== null,
    staleTime: 15_000,
  });

  const sourcesQuery = useQuery<ApiResponse<BlogLinkSource[]>>({
    queryKey: ["/api/admin/blog/link-sources"],
    enabled,
    staleTime: 60_000,
  });

  const createMutation = useMutation({
    mutationFn: async (form: AddManagedLinkForm) => {
      const topicTerms = parseManagedLinkTerms(form.topicTerms);
      const response = await apiRequest("POST", "/api/admin/blog/links", {
        kind: form.kind,
        href: form.href.trim(),
        title: form.title.trim(),
        label: form.label.trim() || null,
        language: form.language,
        sourceName: form.kind === "external" ? form.sourceName.trim() || null : null,
        sourceType: form.kind === "external" ? form.sourceType : null,
        sourceCategory: form.sourceCategory.trim() || null,
        topicTags: topicTerms,
        keywords: topicTerms,
        summary: form.summary.trim() || null,
      });
      return response.json() as Promise<ApiResponse<LinkMutationPayload>>;
    },
    onSuccess: async response => {
      const createdLink = getMutationLink(response.data);
      await invalidateLinkQueries();
      setAddOpen(false);
      setAddForm(EMPTY_MANAGED_LINK_FORM);
      if (createdLink?.id) setSelectedLinkId(createdLink.id);
      toast({
        title: "Link added",
        description: "The target is saved as pending until its review and health gates are satisfied.",
      });
    },
    onError: error => {
      toast({
        variant: "destructive",
        title: "Link could not be added",
        description: error instanceof Error ? error.message : "Please review the fields and try again.",
      });
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async (input: { id: number; reviewStatus: BlogLinkReviewStatus; reason: string }) => {
      const response = await apiRequest("POST", `/api/admin/blog/links/${input.id}/review`, {
        reviewStatus: input.reviewStatus,
        reviewNotes: input.reason.trim(),
      });
      return response.json() as Promise<ApiResponse<LinkMutationPayload>>;
    },
    onSuccess: async response => {
      const reviewedLink = getMutationLink(response.data);
      await invalidateLinkQueries();
      setReviewAction(null);
      setReviewReason("");
      toast({
        title: `Link ${humanizeLinkValue(reviewedLink?.reviewStatus).toLowerCase()}`,
        description: "The review decision was saved without deleting its history or usages.",
      });
    },
    onError: error => {
      toast({
        variant: "destructive",
        title: "Review decision failed",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    },
  });

  const sourceReviewMutation = useMutation({
    mutationFn: async (input: {
      sourceId: number;
      form: ReviewLinkSourceForm;
    }) => {
      const response = await apiRequest(
        "POST",
        `/api/admin/blog/link-sources/${input.sourceId}/review`,
        {
          reviewStatus: input.form.reviewStatus,
          reviewNotes: input.form.reviewNotes.trim(),
          languages: input.form.languages,
          qualityBreakdown: input.form.qualityBreakdown,
        },
      );
      return response.json() as Promise<ApiResponse<BlogLinkSource>>;
    },
    onSuccess: async response => {
      await invalidateLinkQueries();
      setSourceReviewTarget(null);
      setSourceReviewForm(null);
      toast({
        title: "Publisher review saved",
        description: `${response.data.name} now has an explainable quality score and editorial decision.`,
      });
    },
    onError: error => {
      toast({
        variant: "destructive",
        title: "Publisher review failed",
        description: error instanceof Error ? error.message : "The publisher remains unchanged.",
      });
    },
  });

  const scoreUpdateMutation = useMutation({
    mutationFn: async (input: {
      linkId: number;
      form: EditLinkScoresForm;
    }) => {
      const response = await apiRequest("PATCH", `/api/admin/blog/links/${input.linkId}`, {
        title: input.form.title.trim(),
        label: input.form.label.trim(),
        sourceCategory: input.form.sourceCategory.trim() || null,
        topicTags: parseManagedLinkTerms(input.form.topicTerms),
        keywords: parseManagedLinkTerms(input.form.topicTerms),
        summary: input.form.summary.trim() || null,
        evidenceType: input.form.evidenceType.trim() || null,
        evidenceScope: input.form.evidenceScope.trim() || null,
        evidenceScore: input.form.evidenceScore,
        freshnessScore: input.form.freshnessScore,
      });
      return response.json() as Promise<ApiResponse<LinkMutationPayload>>;
    },
    onSuccess: async () => {
      await invalidateLinkQueries();
      setScoreEditTarget(null);
      setScoreEditForm(null);
      toast({
        title: "Exact page saved",
        description: "Its topic metadata and page-level scores are updated; approval and health remain separate gates.",
      });
    },
    onError: error => {
      toast({
        variant: "destructive",
        title: "Page scores could not be saved",
        description: error instanceof Error ? error.message : "The existing scores remain unchanged.",
      });
    },
  });

  const checkMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("POST", `/api/admin/blog/links/${id}/check`);
      return response.json() as Promise<ApiResponse<unknown>>;
    },
    onSuccess: async () => {
      await invalidateLinkQueries();
      toast({
        title: "Health check requested",
        description: "The checker used the persisted link ID; no arbitrary URL was submitted.",
      });
    },
    onError: error => {
      toast({
        variant: "destructive",
        title: "Health check failed",
        description: error instanceof Error ? error.message : "The link remains unchanged.",
      });
    },
  });

  const payload = linksQuery.data?.data;
  const links = getManagedLinks(payload);
  const total = getLinkListTotal(payload);
  const totalPages = getLinkListTotalPages(payload);
  const detail = normalizeLinkDetail(detailQuery.data?.data);
  const currentLink = detail?.link || links.find(link => link.id === selectedLinkId) || null;
  const needsReviewReason = reviewAction === "blocked" || reviewAction === "retired";
  const busyReviewId = reviewMutation.isPending ? reviewMutation.variables?.id : null;

  const updateFilter = (setter: (value: string) => void, value: string) => {
    setter(value);
    setPage(1);
  };

  const closeReviewDialog = (open: boolean) => {
    if (open || reviewMutation.isPending) return;
    setReviewAction(null);
    setReviewReason("");
  };

  const submitReview = () => {
    if (!currentLink || !reviewAction) return;
    if (needsReviewReason && !reviewReason.trim()) return;
    reviewMutation.mutate({
      id: currentLink.id,
      reviewStatus: reviewAction,
      reason: reviewReason,
    });
  };

  const openSourceReview = (source: BlogLinkSource) => {
    sourceReviewMutation.reset();
    setSourceReviewTarget(source);
    setSourceReviewForm(createSourceReviewForm(source));
  };

  const closeSourceReview = (open: boolean) => {
    if (open || sourceReviewMutation.isPending) return;
    setSourceReviewTarget(null);
    setSourceReviewForm(null);
    sourceReviewMutation.reset();
  };

  const submitSourceReview = (form: ReviewLinkSourceForm) => {
    if (!sourceReviewTarget) return;
    sourceReviewMutation.mutate({
      sourceId: sourceReviewTarget.id,
      form,
    });
  };

  const openScoreEditor = (link: ManagedBlogLink) => {
    scoreUpdateMutation.reset();
    setScoreEditTarget(link);
    setScoreEditForm(createLinkScoresForm(link));
  };

  const closeScoreEditor = (open: boolean) => {
    if (open || scoreUpdateMutation.isPending) return;
    setScoreEditTarget(null);
    setScoreEditForm(null);
    scoreUpdateMutation.reset();
  };

  const submitScoreEdit = (form: EditLinkScoresForm) => {
    if (!scoreEditTarget) return;
    scoreUpdateMutation.mutate({
      linkId: scoreEditTarget.id,
      form,
    });
  };

  if (!enabled) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>Library unavailable while the feature is off</AlertTitle>
        <AlertDescription>
          Public article anchors remain unchanged. Enable Link Intelligence after migration, seed and backfill.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <section aria-labelledby="link-library-title" className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="link-library-title" className="text-lg font-semibold text-slate-950">
            Managed link library
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Approval and health are hard gates. Scores explain quality; they never override those gates.
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          Add link
        </Button>
      </div>

      <div className="grid gap-3 rounded-lg bg-slate-50 p-4 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="link-search">Search library</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden="true" />
            <Input
              id="link-search"
              value={search}
              onChange={event => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Title, URL, publisher or topic"
              className="pl-9"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="link-kind-filter">Kind</Label>
          <Select value={kind} onValueChange={value => updateFilter(setKind, value)}>
            <SelectTrigger id="link-kind-filter"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All kinds</SelectItem>
              <SelectItem value="internal">Internal</SelectItem>
              <SelectItem value="external">External</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="link-language-filter">Language</Label>
          <Select value={language} onValueChange={value => updateFilter(setLanguage, value)}>
            <SelectTrigger id="link-language-filter"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All languages</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="link-review-filter">Review</Label>
          <Select value={reviewStatus} onValueChange={value => updateFilter(setReviewStatus, value)}>
            <SelectTrigger id="link-review-filter"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All review states</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="link-health-filter">Health</Label>
          <Select value={healthStatus} onValueChange={value => updateFilter(setHealthStatus, value)}>
            <SelectTrigger id="link-health-filter"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All health states</SelectItem>
              <SelectItem value="healthy">Healthy</SelectItem>
              <SelectItem value="unchecked">Unchecked</SelectItem>
              <SelectItem value="redirected">Redirected</SelectItem>
              <SelectItem value="unreachable">Unreachable</SelectItem>
              <SelectItem value="broken">Broken</SelectItem>
              <SelectItem value="changed_review_needed">Review changed target</SelectItem>
              <SelectItem value="stale">Stale</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="link-eligible-filter">AI eligibility</Label>
          <Select value={eligibility} onValueChange={value => updateFilter(setEligibility, value)}>
            <SelectTrigger id="link-eligible-filter"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All targets</SelectItem>
              <SelectItem value="true">Eligible</SelectItem>
              <SelectItem value="false">Not eligible</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="link-source-filter">Publisher</Label>
          <Select
            value={sourceId}
            onValueChange={value => updateFilter(setSourceId, value)}
            disabled={sourcesQuery.isLoading}
          >
            <SelectTrigger id="link-source-filter">
              <SelectValue placeholder={sourcesQuery.isLoading ? "Loading..." : "All publishers"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All publishers</SelectItem>
              {(sourcesQuery.data?.data || []).map(source => (
                <SelectItem key={source.id} value={String(source.id)}>
                  {source.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="link-category-filter">Category key</Label>
          <Input
            id="link-category-filter"
            value={categoryKey}
            onChange={event => {
              setCategoryKey(event.target.value);
              setPage(1);
            }}
            placeholder="e.g. anxiety-treatment"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="link-pillar-filter">Content pillar</Label>
          <Input
            id="link-pillar-filter"
            value={contentPillar}
            onChange={event => {
              setContentPillar(event.target.value);
              setPage(1);
            }}
            placeholder="e.g. conditions"
          />
        </div>
      </div>

      <div className="sr-only" aria-live="polite">
        {linksQuery.isFetching ? "Updating link library." : `${total} managed links found.`}
        {checkMutation.isPending ? " Running a health check." : ""}
      </div>

      <LinkAuditRunControl
        enabled={enabled}
        linkIds={links.map(link => link.id)}
        onCompleted={() => {
          void invalidateLinkQueries();
        }}
      />

      {linksQuery.isError ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>Library could not be loaded</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>{linksQuery.error instanceof Error ? linksQuery.error.message : "Please try again."}</p>
            <Button variant="outline" size="sm" onClick={() => linksQuery.refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : linksQuery.isLoading ? (
        <div className="space-y-3" aria-label="Loading managed links">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      ) : links.length === 0 ? (
        <div className="rounded-lg bg-slate-50 px-6 py-12 text-center">
          <Link2 className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
          <h3 className="mt-3 font-medium text-slate-900">No links match these filters</h3>
          <p className="mt-1 text-sm text-slate-600">
            Clear a filter or add a managed target. Unknown links remain pending by default.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-lg border md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Target</TableHead>
                  <TableHead>Kind</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Health</TableHead>
                  <TableHead className="text-right">Quality</TableHead>
                  <TableHead className="text-right">Evidence</TableHead>
                  <TableHead className="text-right">Uses</TableHead>
                  <TableHead className="w-14"><span className="sr-only">Inspect</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.map(link => (
                  <TableRow key={link.id}>
                    <TableCell className="max-w-[320px]">
                      <button
                        type="button"
                        onClick={() => setSelectedLinkId(link.id)}
                        className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                      >
                        <span className="block truncate font-medium text-slate-950">{link.title}</span>
                        <span className="block truncate text-xs text-slate-500">
                          {link.source?.name || link.host || link.displayHref || link.normalizedHref}
                        </span>
                      </button>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-700">
                        {humanizeLinkValue(link.kind)} · {link.language.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={LINK_REVIEW_BADGE_STYLES[link.reviewStatus]}>
                        {humanizeLinkValue(link.reviewStatus)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={LINK_HEALTH_BADGE_STYLES[link.healthStatus] || LINK_HEALTH_BADGE_STYLES.unchecked}
                      >
                        {humanizeLinkValue(link.healthStatus)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{formatLinkScore(link.source?.qualityScore)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatLinkScore(link.evidenceScore)}</TableCell>
                    <TableCell className="text-right tabular-nums">{getManagedLinkUsageCount(link)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedLinkId(link.id)}
                        aria-label={`Inspect ${link.title}`}
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-3 md:hidden">
            {links.map(link => (
              <article key={link.id} className="rounded-lg bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-medium text-slate-950">{link.title}</h3>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {link.source?.name || link.displayHref || link.normalizedHref}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedLinkId(link.id)}
                    aria-label={`Inspect ${link.title}`}
                  >
                    Inspect
                  </Button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
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
                </div>
                <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-slate-500">Source quality</dt>
                    <dd className="mt-1 font-medium tabular-nums">{formatLinkScore(link.source?.qualityScore)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Evidence</dt>
                    <dd className="mt-1 font-medium tabular-nums">{formatLinkScore(link.evidenceScore)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Current uses</dt>
                    <dd className="mt-1 font-medium tabular-nums">{getManagedLinkUsageCount(link)}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>

          <div className="flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing {links.length} of {total} links · Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(value => Math.max(1, value - 1))} disabled={page <= 1}>
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage(value => Math.min(totalPages, value + 1))} disabled={page >= totalPages}>
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      <AddManagedLinkDialog
        open={addOpen}
        form={addForm}
        isPending={createMutation.isPending}
        error={createMutation.isError
          ? createMutation.error instanceof Error
            ? createMutation.error.message
            : "The link could not be saved."
          : null}
        onOpenChange={open => {
          setAddOpen(open);
          if (!open) setAddForm(EMPTY_MANAGED_LINK_FORM);
        }}
        onFormChange={setAddForm}
        onSubmit={form => createMutation.mutate(form)}
      />

      <ManagedLinkDetailSheet
        open={selectedLinkId !== null}
        link={currentLink}
        detail={detail}
        isLoading={detailQuery.isLoading}
        loadError={detailQuery.isError
          ? detailQuery.error instanceof Error
            ? detailQuery.error.message
            : "The link details could not be loaded."
          : null}
        reviewPending={reviewMutation.isPending}
        sourceReviewPending={sourceReviewMutation.isPending}
        scoreUpdatePending={scoreUpdateMutation.isPending}
        busyReviewId={busyReviewId ?? null}
        checkPending={checkMutation.isPending}
        onOpenChange={open => {
          if (!open) setSelectedLinkId(null);
        }}
        onReview={setReviewAction}
        onReviewSource={openSourceReview}
        onEditScores={openScoreEditor}
        onCheck={id => checkMutation.mutate(id)}
        onRetry={() => detailQuery.refetch()}
      />

      <ReviewLinkSourceDialog
        open={sourceReviewTarget !== null}
        source={sourceReviewTarget}
        form={sourceReviewForm}
        isPending={sourceReviewMutation.isPending}
        error={sourceReviewMutation.isError
          ? sourceReviewMutation.error instanceof Error
            ? sourceReviewMutation.error.message
            : "The publisher review could not be saved."
          : null}
        onOpenChange={closeSourceReview}
        onFormChange={setSourceReviewForm}
        onSubmit={submitSourceReview}
      />

      <EditLinkScoresDialog
        open={scoreEditTarget !== null}
        link={scoreEditTarget}
        form={scoreEditForm}
        isPending={scoreUpdateMutation.isPending}
        error={scoreUpdateMutation.isError
          ? scoreUpdateMutation.error instanceof Error
            ? scoreUpdateMutation.error.message
            : "The page scores could not be saved."
          : null}
        onOpenChange={closeScoreEditor}
        onFormChange={setScoreEditForm}
        onSubmit={submitScoreEdit}
      />

      <AlertDialog open={reviewAction !== null} onOpenChange={closeReviewDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {reviewAction === "approved" ? "Approve this managed link?" : `${humanizeLinkValue(reviewAction)} this managed link?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {reviewAction === "approved"
                ? "Approval is a human editorial gate. It does not override technical health or evidence thresholds."
                : "The link, audit history and article usages will remain available for review."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="link-review-reason">
              Review note {needsReviewReason ? "(required)" : "(optional)"}
            </Label>
            <Textarea
              id="link-review-reason"
              value={reviewReason}
              onChange={event => setReviewReason(event.target.value)}
              placeholder="Explain the editorial decision."
              rows={3}
            />
          </div>
          {reviewMutation.isError && (
            <p className="text-sm text-rose-700" role="alert">
              {reviewMutation.error instanceof Error ? reviewMutation.error.message : "The review could not be saved."}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={reviewMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={event => {
                event.preventDefault();
                submitReview();
              }}
              disabled={reviewMutation.isPending || (needsReviewReason && !reviewReason.trim())}
              className={reviewAction === "blocked" || reviewAction === "retired" ? "bg-rose-700 text-white hover:bg-rose-800" : ""}
            >
              {reviewMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Check className="mr-2 h-4 w-4" aria-hidden="true" />
              )}
              Confirm {humanizeLinkValue(reviewAction).toLowerCase()}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
