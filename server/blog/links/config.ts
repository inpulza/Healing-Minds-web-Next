export const BLOG_LINK_POLICY_VERSION = "healing-link-policy-v1";
/**
 * Durable cutover marker for Link Intelligence, written into
 * blog_link_audit_runs by scripts/blog-link-backfill.ts after a full apply pass.
 * Schema presence alone does not prove the library was seeded and the posts
 * were backfilled: without this marker the feature can be enabled over empty
 * tables and report that no links exist. scripts/post-merge.sh checks the same
 * key, so keep both in sync.
 */
export const BLOG_LINK_CUTOVER_MARKER_KEY = "link-intelligence-cutover-backfill";
export const BLOG_LINK_SCORE_VERSION = "healing-link-score-v1";
export const DEFAULT_BLOG_LINK_PUBLIC_SITE_URL = "https://www.healingmindsp.com";
export const BLOG_LINK_CRISIS_SOURCE_STABLE_KEY = "988-lifeline";
export const BLOG_LINK_CRISIS_SOURCE_STABLE_KEYS = [
  BLOG_LINK_CRISIS_SOURCE_STABLE_KEY,
  "988-lifeline-es",
] as const;

export type BlogLinkKind = "internal" | "external";
export type BlogLinkLanguage = "en" | "es" | "all";
export type BlogLinkReviewStatus = "pending" | "approved" | "blocked" | "retired";
export type BlogLinkHealthStatus =
  | "unchecked"
  | "healthy"
  | "redirected"
  | "unreachable"
  | "broken"
  | "changed_review_needed"
  | "stale";
export type BlogLinkOrigin = "seed" | "manual" | "ai" | "backfill";
export type BlogLinkUsageOrigin = "ai" | "manual" | "backfill" | "server_fix";

export const SOURCE_QUALITY_WEIGHTS = {
  accountablePublisher: 25,
  expertReview: 25,
  traceableEvidence: 20,
  currency: 15,
  fundingTransparency: 10,
  stableIdentifier: 5,
} as const;

export const CITATION_FIT_WEIGHTS = {
  directSupport: 50,
  evidenceTypeFit: 20,
  contextFit: 15,
  languageAccessibility: 10,
  diversity: 5,
} as const;

export const INTERNAL_OPPORTUNITY_WEIGHTS = {
  topicalAffinity: 35,
  patientJourneyFit: 20,
  graphNeed: 20,
  anchorContext: 15,
  editorialDiversity: 10,
} as const;

export const BLOG_LINK_SCORE_THRESHOLDS = {
  sourceQualityNormal: 75,
  citationFitNormal: 80,
  sourceQualityCritical: 85,
  citationFitCritical: 90,
  pageEvidenceNormal: 80,
  pageEvidenceCritical: 90,
  internalTopicalGate: 15,
  internalRecommended: 80,
  internalOptional: 65,
} as const;

export const BLOG_LINK_TTLS = {
  internal: {
    technicalHours: 24 * 7,
    editorialDays: 7,
  },
  crisis: {
    technicalHours: 24,
    editorialDays: 30,
  },
  clinical: {
    technicalHours: 24 * 7,
    editorialDays: 90,
  },
  patientEducation: {
    technicalHours: 24 * 14,
    editorialDays: 90,
  },
  research: {
    technicalHours: 24 * 30,
    editorialDays: 180,
    retractionCheckHours: 24 * 30,
  },
  otherExternal: {
    technicalHours: 24 * 30,
    editorialDays: 180,
  },
} as const;

export const BLOG_LINK_TRACKING_PARAMETER_NAMES = new Set([
  "_ga",
  "dclid",
  "fbclid",
  "gclid",
  "mc_cid",
  "mc_eid",
  "msclkid",
]);

export const BLOG_LINK_BLOCKED_INTERNAL_PREFIXES = [
  "/api",
  "/admin",
  "/assets",
  "/attached_assets",
  "/node_modules",
  "/public-objects",
  "/src",
  "/@vite",
  "/__vite",
] as const;

export const BLOG_LINK_SOURCE_STABLE_KEYS = [
  "nimh-anxiety-disorders",
  "nimh-depression",
  "nimh-adhd",
  "nimh-medications",
  "nimh-bipolar-disorder",
  "nimh-ptsd",
  "nimh-es-anxiety",
  "nimh-es-depression",
  "nimh-es-adhd",
  "nimh-es-bipolar-disorder",
  "nimh-es-ptsd",
  BLOG_LINK_CRISIS_SOURCE_STABLE_KEY,
  "988-lifeline-es",
] as const;

export type BlogLinkSourceStableKey = typeof BLOG_LINK_SOURCE_STABLE_KEYS[number];

export function getBlogLinkSourceReviewTtlMs(sourceType: string): number {
  if (sourceType === "crisis") return 30 * 24 * 60 * 60 * 1_000;
  if (sourceType === "academic" || sourceType === "other") {
    return 180 * 24 * 60 * 60 * 1_000;
  }
  return 90 * 24 * 60 * 60 * 1_000;
}

export function isBlogLinkSourceReviewCurrent(
  source: { sourceType: string; reviewedAt: Date | null },
  now = new Date(),
): boolean {
  return Boolean(
    source.reviewedAt
    && source.reviewedAt.getTime() + getBlogLinkSourceReviewTtlMs(source.sourceType) > now.getTime(),
  );
}

export function getBlogLinkPageReviewTtlMs(link: {
  kind: string;
  sourceCategory?: string | null;
  evidenceType?: string | null;
}): number {
  if (link.kind === "internal") {
    return BLOG_LINK_TTLS.internal.editorialDays * 24 * 60 * 60 * 1_000;
  }
  const classification = `${link.sourceCategory || ""} ${link.evidenceType || ""}`.toLowerCase();
  if (classification.includes("crisis")) {
    return BLOG_LINK_TTLS.crisis.editorialDays * 24 * 60 * 60 * 1_000;
  }
  if (
    classification.includes("clinical")
    || classification.includes("medication")
    || classification.includes("guideline")
  ) {
    return BLOG_LINK_TTLS.clinical.editorialDays * 24 * 60 * 60 * 1_000;
  }
  if (
    classification.includes("academic")
    || classification.includes("research")
    || classification.includes("doi")
    || classification.includes("pmid")
  ) {
    return BLOG_LINK_TTLS.research.editorialDays * 24 * 60 * 60 * 1_000;
  }
  if (
    classification.includes("patient")
    || classification.includes("education")
    || classification.includes("institutional")
  ) {
    return BLOG_LINK_TTLS.patientEducation.editorialDays * 24 * 60 * 60 * 1_000;
  }
  return BLOG_LINK_TTLS.otherExternal.editorialDays * 24 * 60 * 60 * 1_000;
}

export function isBlogLinkPageReviewCurrent(
  link: {
    kind: string;
    sourceCategory?: string | null;
    evidenceType?: string | null;
    reviewedAt: Date | null;
  },
  now = new Date(),
): boolean {
  return Boolean(
    link.reviewedAt
    && link.reviewedAt.getTime() + getBlogLinkPageReviewTtlMs(link) > now.getTime(),
  );
}

type BilingualAliases = Readonly<Record<"en" | "es", readonly string[]>>;

export const BLOG_LINK_SOURCE_TOPIC_ALIASES: Readonly<
  Record<BlogLinkSourceStableKey, BilingualAliases>
> = {
  "nimh-anxiety-disorders": {
    en: ["anxiety", "panic", "phobia", "worry", "generalized anxiety", "social anxiety"],
    es: ["ansiedad", "panico", "fobia", "preocupacion", "ansiedad generalizada", "ansiedad social"],
  },
  "nimh-depression": {
    en: ["depression", "depressed", "major depressive", "low mood"],
    es: ["depresion", "depresivo", "depresion mayor", "estado de animo bajo"],
  },
  "nimh-adhd": {
    en: ["adhd", "attention deficit", "inattention", "hyperactivity", "impulsivity"],
    es: ["tdah", "deficit de atencion", "inatencion", "hiperactividad", "impulsividad"],
  },
  "nimh-medications": {
    en: ["medication", "medicine", "antidepressant", "stimulant", "mood stabilizer"],
    es: ["medicacion", "medicamento", "antidepresivo", "estimulante", "estabilizador del animo"],
  },
  "nimh-bipolar-disorder": {
    en: ["bipolar", "mania", "manic", "mood episode"],
    es: ["bipolar", "mania", "maniaco", "episodio del estado de animo"],
  },
  "nimh-ptsd": {
    en: ["ptsd", "post traumatic stress", "trauma", "traumatic event"],
    es: ["tept", "estres postraumatico", "trauma", "evento traumatico"],
  },
  "nimh-es-anxiety": {
    en: ["anxiety", "generalized anxiety", "worry"],
    es: ["ansiedad", "ansiedad generalizada", "preocupacion", "miedo"],
  },
  "nimh-es-depression": {
    en: ["depression", "depressed", "major depressive", "low mood"],
    es: ["depresion", "depresivo", "depresion mayor", "estado de animo bajo"],
  },
  "nimh-es-adhd": {
    en: ["adhd", "attention deficit", "inattention", "hyperactivity", "impulsivity"],
    es: ["tdah", "deficit de atencion", "inatencion", "hiperactividad", "impulsividad"],
  },
  "nimh-es-bipolar-disorder": {
    en: ["bipolar", "mania", "manic", "mood episode"],
    es: ["bipolar", "mania", "maniaco", "episodio del estado de animo"],
  },
  "nimh-es-ptsd": {
    en: ["ptsd", "post traumatic stress", "trauma", "traumatic event"],
    es: ["tept", "estres postraumatico", "trauma", "evento traumatico"],
  },
  "988-lifeline": {
    en: ["crisis", "suicide", "suicidal", "self harm", "988", "immediate danger"],
    es: ["crisis", "suicidio", "suicida", "autolesion", "hacerse dano", "988", "peligro inmediato"],
  },
  "988-lifeline-es": {
    en: ["crisis", "suicide", "suicidal", "self harm", "988", "immediate danger"],
    es: ["crisis", "suicidio", "suicida", "autolesion", "hacerse dano", "988", "peligro inmediato"],
  },
};

export const BLOG_LINK_INTENT_ALIASES: Readonly<
  Record<"crisis" | "medication" | "treatment" | "safety", BilingualAliases>
> = {
  crisis: BLOG_LINK_SOURCE_TOPIC_ALIASES["988-lifeline"],
  medication: {
    en: ["medication", "medicine", "drug", "dose", "dosage", "antidepressant", "stimulant"],
    es: ["medicacion", "medicamento", "farmaco", "dosis", "antidepresivo", "estimulante"],
  },
  treatment: {
    en: ["treatment", "therapy", "clinical care", "psychiatric care"],
    es: ["tratamiento", "terapia", "atencion clinica", "atencion psiquiatrica"],
  },
  safety: {
    en: ["safety", "side effect", "adverse effect", "warning", "contraindication"],
    es: ["seguridad", "efecto secundario", "efecto adverso", "advertencia", "contraindicacion"],
  },
};

export type BlogLinkConfig = {
  enabled: boolean;
  publicSiteUrl: string;
  publicHosts: readonly string[];
  allowedExternalPorts: readonly string[];
  maxRedirects: number;
  connectTimeoutMs: number;
  totalTimeoutMs: number;
  maxConcurrency: number;
};

export type CreateBlogLinkConfigInput = {
  enabled?: boolean;
  publicSiteUrl?: string;
  additionalPublicHosts?: readonly string[];
  includeWwwAlias?: boolean;
};

export type BlogLinkEnvironment = Record<string, string | undefined> & {
  BLOG_LINK_ENABLED?: string;
  SITE_BASE_URL?: string;
  PUBLIC_SITE_URL?: string;
};

function normalizeConfiguredHost(value: string): string {
  return value.trim().toLowerCase().replace(/\.$/, "");
}

function normalizePublicSiteUrl(value: string): string {
  const parsed = new URL(value.trim());
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error("Blog link public site URL must use HTTP or HTTPS");
  }
  if (parsed.username || parsed.password) {
    throw new Error("Blog link public site URL cannot contain credentials");
  }
  if ((parsed.pathname && parsed.pathname !== "/") || parsed.search || parsed.hash) {
    throw new Error("Blog link public site URL must be an origin without path, query, or fragment");
  }
  return parsed.origin;
}

export function createBlogLinkConfig(
  input: CreateBlogLinkConfigInput = {},
): BlogLinkConfig {
  const publicSiteUrl = normalizePublicSiteUrl(
    input.publicSiteUrl || DEFAULT_BLOG_LINK_PUBLIC_SITE_URL,
  );
  const publicUrl = new URL(publicSiteUrl);
  const canonicalHost = normalizeConfiguredHost(publicUrl.hostname);
  const hosts = new Set<string>([canonicalHost]);

  if (input.includeWwwAlias !== false) {
    if (canonicalHost.startsWith("www.")) hosts.add(canonicalHost.slice(4));
    else hosts.add(`www.${canonicalHost}`);
  }

  for (const host of input.additionalPublicHosts || []) {
    const normalized = normalizeConfiguredHost(host);
    if (normalized) hosts.add(normalized);
  }

  return {
    enabled: input.enabled === true,
    publicSiteUrl,
    publicHosts: Array.from(hosts).sort(),
    allowedExternalPorts: ["", "80", "443"],
    maxRedirects: 3,
    connectTimeoutMs: 5_000,
    totalTimeoutMs: 12_000,
    maxConcurrency: 3,
  };
}

export function isBlogLinkEnabled(
  environment: BlogLinkEnvironment = process.env,
): boolean {
  return environment.BLOG_LINK_ENABLED === "true";
}

export function getBlogLinkConfig(
  environment: BlogLinkEnvironment = process.env,
): BlogLinkConfig {
  return createBlogLinkConfig({
    enabled: isBlogLinkEnabled(environment),
    publicSiteUrl: environment.SITE_BASE_URL
      || environment.PUBLIC_SITE_URL
      || DEFAULT_BLOG_LINK_PUBLIC_SITE_URL,
  });
}

export function getSafeBlogLinkConfigSummary(config: BlogLinkConfig): {
  policyVersion: string;
  scoreVersion: string;
  enabled: boolean;
  publicSiteUrl: string;
  publicHosts: readonly string[];
  maxRedirects: number;
  connectTimeoutMs: number;
  totalTimeoutMs: number;
  maxConcurrency: number;
  ttls: typeof BLOG_LINK_TTLS;
} {
  return {
    policyVersion: BLOG_LINK_POLICY_VERSION,
    scoreVersion: BLOG_LINK_SCORE_VERSION,
    enabled: config.enabled,
    publicSiteUrl: config.publicSiteUrl,
    publicHosts: config.publicHosts,
    maxRedirects: config.maxRedirects,
    connectTimeoutMs: config.connectTimeoutMs,
    totalTimeoutMs: config.totalTimeoutMs,
    maxConcurrency: config.maxConcurrency,
    ttls: BLOG_LINK_TTLS,
  };
}
