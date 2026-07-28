export type BlogLinkKind = "internal" | "external";
export type BlogLinkLanguage = "en" | "es" | "all";
export type BlogLinkReviewStatus = "pending" | "approved" | "blocked" | "retired";
export type BlogLinkSourceType =
  | "first_party"
  | "government"
  | "professional_guideline"
  | "academic"
  | "health_system"
  | "crisis"
  | "other";
export type BlogLinkSourceQualityBreakdown = {
  accountablePublisher: number;
  expertReview: number;
  traceableEvidence: number;
  currency: number;
  fundingTransparency: number;
  stableIdentifier: number;
};
export type BlogLinkHealthStatus =
  | "unchecked"
  | "healthy"
  | "redirected"
  | "unreachable"
  | "broken"
  | "changed_review_needed"
  | "stale";

export type BlogLinkSource = {
  id: number;
  stableKey?: string | null;
  name: string;
  canonicalDomain?: string | null;
  sourceType?: BlogLinkSourceType | null;
  languages?: Array<"en" | "es">;
  qualityScore?: number | null;
  qualityBreakdown?: Partial<BlogLinkSourceQualityBreakdown> | null;
  scoreVersion?: string | null;
  reviewStatus?: BlogLinkReviewStatus | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  reviewNotes?: string | null;
};

export type ManagedBlogLink = {
  id: number;
  stableKey?: string | null;
  sourceId?: number | null;
  source?: BlogLinkSource | null;
  kind: BlogLinkKind;
  normalizedHref: string;
  displayHref?: string | null;
  host?: string | null;
  title: string;
  label?: string | null;
  language: BlogLinkLanguage;
  sourceCategory?: string | null;
  topicTags?: string[] | null;
  categoryKeys?: string[] | null;
  contentPillars?: string[] | null;
  keywords?: string[] | null;
  summary?: string | null;
  evidenceType?: string | null;
  evidenceScope?: string | null;
  evidenceScore?: number | null;
  freshnessScore?: number | null;
  reviewStatus: BlogLinkReviewStatus;
  generationEligible: boolean;
  healthStatus: BlogLinkHealthStatus;
  httpStatus?: number | null;
  finalHref?: string | null;
  redirectCount?: number | null;
  consecutiveFailures?: number | null;
  lastCheckedAt?: string | null;
  lastSuccessfulAt?: string | null;
  nextCheckAt?: string | null;
  lastErrorCode?: string | null;
  scoreBreakdown?: Record<string, number> | null;
  scoreVersion?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  reviewNotes?: string | null;
  pageReviewDueAt?: string | null;
  sourceReviewDueAt?: string | null;
  currentUsageCount?: number;
  usageCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type BlogPostLinkUsage = {
  id: number;
  postId: number;
  postTitle?: string | null;
  postStatus?: string | null;
  anchorText?: string | null;
  sectionHeading?: string | null;
  normalizedHref?: string | null;
  rawHref?: string | null;
  origin?: string | null;
  lastSeenAt?: string | null;
  removedAt?: string | null;
};

export type BlogLinkReportCheck = {
  id: string;
  linkId: number | null;
  href: string;
  label: string;
  severity: "blocking" | "warning" | "info";
  ok: boolean;
  detail: string;
};

export type BlogPostLinkReport = {
  enabled: boolean;
  postId: number;
  blockers: BlogLinkReportCheck[];
  warnings: BlogLinkReportCheck[];
  checks: BlogLinkReportCheck[];
  usages: Array<{
    id: number;
    linkId: number;
    anchorText: string;
    sectionHeading: string | null;
    href: string;
    link: ManagedBlogLink;
  }>;
};

export type BlogLinkCheck = {
  id: number;
  checkedAt: string;
  method?: string | null;
  result: BlogLinkHealthStatus | string;
  httpStatus?: number | null;
  resolvedHref?: string | null;
  redirectCount?: number | null;
  durationMs?: number | null;
  errorCategory?: string | null;
};

export type BlogLinkDetail = {
  link: ManagedBlogLink;
  usages?: BlogPostLinkUsage[];
  checks?: BlogLinkCheck[];
};

export type LinkIntelligenceSummary = {
  publishedBrokenLinks: number;
  pendingMedicalSources: number;
  staleMedicalSources: number;
  linksNeedingHealthCheck: number;
  orphanPublishedPosts: number;
  redirectedReviewNeeded: number;
  generationEligibleLinks: number;
};

export type BlogLinkOpportunity = {
  id?: number | string;
  stableKey?: string;
  sourcePostId: number;
  targetLinkId?: number | null;
  targetPostId?: number | null;
  targetTitle: string;
  targetHref: string;
  language: BlogLinkLanguage;
  targetStatus?: string | null;
  score: number;
  band?: "recommended" | "optional" | "not_suggested" | string;
  reasons?: string[];
  breakdown?: Record<string, number>;
  existingIncomingLinks?: number;
  currentAnchors?: string[];
};

export type PublishedBlogPostOption = {
  id: number;
  title: string;
  language: "en" | "es";
  status: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type LinkListPayload = {
  links?: ManagedBlogLink[];
  items?: ManagedBlogLink[];
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export type LinkDetailPayload = BlogLinkDetail | ManagedBlogLink;
export type LinkMutationPayload = ManagedBlogLink | { link: ManagedBlogLink };

export const LINK_REVIEW_BADGE_STYLES: Record<BlogLinkReviewStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-800",
  blocked: "border-rose-200 bg-rose-50 text-rose-800",
  retired: "border-slate-200 bg-slate-100 text-slate-700",
};

export const LINK_HEALTH_BADGE_STYLES: Record<string, string> = {
  unchecked: "border-slate-200 bg-slate-50 text-slate-700",
  healthy: "border-emerald-200 bg-emerald-50 text-emerald-800",
  redirected: "border-violet-200 bg-violet-50 text-violet-800",
  unreachable: "border-amber-200 bg-amber-50 text-amber-800",
  broken: "border-rose-200 bg-rose-50 text-rose-800",
  changed_review_needed: "border-orange-200 bg-orange-50 text-orange-800",
  stale: "border-orange-200 bg-orange-50 text-orange-800",
};

export function getManagedLinks(payload: LinkListPayload | ManagedBlogLink[] | undefined): ManagedBlogLink[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  return payload.links || payload.items || [];
}

export function getLinkListTotal(payload: LinkListPayload | ManagedBlogLink[] | undefined): number {
  if (!payload) return 0;
  if (Array.isArray(payload)) return payload.length;
  return payload.pagination?.total ?? payload.total ?? getManagedLinks(payload).length;
}

export function getLinkListTotalPages(payload: LinkListPayload | ManagedBlogLink[] | undefined): number {
  if (!payload || Array.isArray(payload)) return 1;
  if (payload.pagination?.totalPages) return payload.pagination.totalPages;
  if (payload.totalPages) return payload.totalPages;
  const pageSize = payload.pagination?.pageSize ?? payload.pageSize ?? 25;
  return Math.max(1, Math.ceil(getLinkListTotal(payload) / pageSize));
}

export function normalizeLinkDetail(payload: LinkDetailPayload | undefined): BlogLinkDetail | null {
  if (!payload) return null;
  if ("link" in payload) return payload;
  return { link: payload, usages: [], checks: [] };
}

export function getMutationLink(payload: LinkMutationPayload | undefined): ManagedBlogLink | null {
  if (!payload) return null;
  return "link" in payload ? payload.link : payload;
}

export function getManagedLinkUsageCount(link: ManagedBlogLink): number {
  return link.currentUsageCount ?? link.usageCount ?? 0;
}

export function formatLinkScore(value?: number | null): string {
  return typeof value === "number" ? String(value) : "—";
}

export function formatLinkDate(value?: string | null): string {
  if (!value) return "Not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not recorded";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function humanizeLinkValue(value?: string | null): string {
  if (!value) return "Not set";
  return value.replace(/_/g, " ").replace(/\b\w/g, character => character.toUpperCase());
}
