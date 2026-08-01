import assert from "node:assert/strict";
import {
  BLOG_LINK_POLICY_VERSION,
  BLOG_LINK_SCORE_VERSION,
  createBlogLinkConfig,
  getBlogLinkPageReviewTtlMs,
  getBlogLinkSourceReviewTtlMs,
  getBlogLinkConfig,
  getSafeBlogLinkConfigSummary,
  isBlogLinkSourceReviewCurrent,
  isBlogLinkPageReviewCurrent,
  isBlogLinkEnabled,
} from "../server/blog/links/config";
import {
  BlogLinkNormalizationError,
  createCanonicalBlogLinkKey,
  normalizeBlogLinkHref,
  normalizeBlogLinkSearchText,
  rememberCrossDomainBlogLinkRedirect,
} from "../server/blog/links/normalization";
import {
  buildBlogLinkReconciliationPlan,
  extractBlogLinkDocument,
  extractBlogLinkOccurrences,
  getUnknownBlogLinkDefaults,
  resolveBlogLinkUsageGenerationRunId,
} from "../server/blog/links/extract";
import {
  rankInternalLinkOpportunities,
  scoreCitationFit,
  scoreCitationUse,
  scoreInternalLinkOpportunity,
  scoreSourceQuality,
} from "../server/blog/links/scoring";
import {
  assertBlogLinkAuditIdempotencyMatch,
  assertSafeBlogLinkAuditInput,
  canonicalizeBlogLinkAuditIds,
  classifyBlogLinkHealthObservation,
  detectBlogLinkIntent,
  evaluateBlogLinkGenerationEligibility,
  is988AllowedForContext,
  isExactEligibleExternalHref,
  isLiveManagedBlogPostTarget,
  isManagedBlogPostTarget,
  matchesBlogLinkSourceTopic,
  resolveBlogLinkSelectionFailOpen,
  resolveRequestedBlogLinkStableIds,
  shouldProcessBlogLinkAuditRun,
  type BlogLinkGenerationCandidate,
} from "../server/blog/links/policy";
import { normalizeAiGeneratedDraft } from "../server/blog/ai/validation";
import {
  countBlogLinkTopicMatches,
  isBlogLinkTopicallyCompatible,
} from "../server/blog/links/selection";
import {
  BLOG_LINK_AUDIT_ROW_LOCK_ORDER,
  advanceBlogLinkAuditCheckpoint,
  getPendingBlogLinkAuditIds,
  isBlogLinkAuditLeaseCurrent,
  isSameBlogLinkAuditTarget,
  nextBlogLinkAuditFailureCount,
  readBlogLinkAuditCheckpoint,
  shouldResumeBlogLinkAuditStatus,
} from "../server/blog/links/audit-recovery";
import {
  choosePendingAuditRequest,
  isPendingAuditRequestForRun,
  parsePendingAuditRequest,
  serializePendingAuditRequest,
} from "../client/src/components/admin/blog/link-audit-retry";
import {
  assertBlogPostSnapshotMatches,
  assertBlogRedirectCleanupSnapshotMatches,
  assertBlogRedirectPublishSnapshotMatches,
  blogRedirectPresenceSnapshotMatches,
  blogRedirectSnapshotMatches,
  blogPostSnapshotMatches,
  buildBlogPostStatusTransitionPlan,
  planBlogPostImageObjectDeletion,
} from "../server/blog/lifecycle";
import { rewriteExactBlogLinkHref } from "../server/blog/links/rewrite";
import { createPinnedBlogLinkLookup } from "../server/blog/links/pinned-lookup";
import { parseBlogLinkBackfillOptions } from "./blog-link-backfill-options";

const PUBLIC_SITE_URL = "https://www.healingmindsp.com";

function expectNormalizationError(
  action: () => unknown,
  code: BlogLinkNormalizationError["code"],
): void {
  assert.throws(
    action,
    (error: unknown) => (
      error instanceof BlogLinkNormalizationError
      && error.code === code
    ),
  );
}

function checkPinnedAuditLookup(): void {
  const lookup = createPinnedBlogLinkLookup({
    address: "203.0.113.42",
    family: 4,
  });
  let allAddress: unknown;
  let allFamily: number | undefined;
  lookup("ignored.example", { all: true }, (error, address, family) => {
    assert.equal(error, null);
    allAddress = address;
    allFamily = family;
  });
  assert.deepEqual(allAddress, [{
    address: "203.0.113.42",
    family: 4,
  }]);
  assert.equal(allFamily, undefined);

  let singleAddress: unknown;
  let singleFamily: number | undefined;
  lookup("ignored.example", { all: false }, (error, address, family) => {
    assert.equal(error, null);
    singleAddress = address;
    singleFamily = family;
  });
  assert.equal(singleAddress, "203.0.113.42");
  assert.equal(singleFamily, 4);
}

function checkSafeConfiguration(): void {
  assert.equal(isBlogLinkEnabled({ BLOG_LINK_ENABLED: "true" }), true);
  assert.equal(isBlogLinkEnabled({ BLOG_LINK_ENABLED: "TRUE" }), false);
  assert.equal(getBlogLinkConfig({
    BLOG_LINK_ENABLED: "true",
    PUBLIC_SITE_URL,
  }).enabled, true);

  const config = createBlogLinkConfig({
    enabled: true,
    publicSiteUrl: PUBLIC_SITE_URL,
  });
  const summary = getSafeBlogLinkConfigSummary(config);
  assert.equal(summary.policyVersion, BLOG_LINK_POLICY_VERSION);
  assert.equal(summary.scoreVersion, BLOG_LINK_SCORE_VERSION);
  assert.equal(summary.publicHosts.includes("healingmindsp.com"), true);
  assert.equal(summary.publicHosts.includes("www.healingmindsp.com"), true);
  assert.doesNotMatch(
    JSON.stringify(summary).toLowerCase(),
    /api[_-]?key|authorization|cookie|password|secret|token/,
  );
  assert.equal(getBlogLinkSourceReviewTtlMs("crisis"), 30 * 24 * 60 * 60 * 1_000);
  assert.equal(getBlogLinkPageReviewTtlMs({
    kind: "external",
    sourceCategory: "crisis",
  }), 30 * 24 * 60 * 60 * 1_000);
  assert.equal(isBlogLinkSourceReviewCurrent({
    sourceType: "government",
    reviewedAt: new Date(),
  }), true);
  assert.equal(isBlogLinkSourceReviewCurrent({
    sourceType: "crisis",
    reviewedAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1_000),
  }), false);
  assert.equal(isBlogLinkPageReviewCurrent({
    kind: "external",
    sourceCategory: "clinical",
    reviewedAt: new Date(Date.now() - 91 * 24 * 60 * 60 * 1_000),
  }), false);
}

function checkNormalization(): void {
  assert.deepEqual(
    normalizeBlogLinkHref("/es/servicios/?campaign=ignored#section", {
      publicSiteUrl: PUBLIC_SITE_URL,
    }),
    {
      kind: "internal",
      normalizedHref: "/es/servicios",
      displayHref: "/es/servicios",
      host: "www.healingmindsp.com",
    },
  );
  assert.equal(
    normalizeBlogLinkHref(
      "https://healingmindsp.com/services/?utm_source=newsletter#care",
      { publicSiteUrl: PUBLIC_SITE_URL },
    ).normalizedHref,
    "/services",
  );
  assert.equal(
    normalizeBlogLinkHref("/", { publicSiteUrl: PUBLIC_SITE_URL }).normalizedHref,
    "/",
  );

  const external = normalizeBlogLinkHref(
    "https://www.nimh.nih.gov:443/health/topics/anxiety-disorders/?z=2&utm_source=x&a=1&fbclid=y#symptoms",
    { publicSiteUrl: PUBLIC_SITE_URL },
  );
  assert.deepEqual(external, {
    kind: "external",
    normalizedHref: "https://www.nimh.nih.gov/health/topics/anxiety-disorders?a=1&z=2",
    displayHref: "https://www.nimh.nih.gov/health/topics/anxiety-disorders?a=1&z=2",
    host: "www.nimh.nih.gov",
  });
  assert.equal(createCanonicalBlogLinkKey(external.normalizedHref).length, 64);

  expectNormalizationError(
    () => normalizeBlogLinkHref("//nimh.nih.gov/health"),
    "protocol_relative",
  );
  expectNormalizationError(
    () => normalizeBlogLinkHref("mailto:care@example.com"),
    "invalid_protocol",
  );
  expectNormalizationError(
    () => normalizeBlogLinkHref("http://www.nimh.nih.gov/health"),
    "external_https_required",
  );
  expectNormalizationError(
    () => normalizeBlogLinkHref("https://user:password@www.nimh.nih.gov/health"),
    "credentials_not_allowed",
  );
  expectNormalizationError(
    () => normalizeBlogLinkHref("/api/private", { publicSiteUrl: PUBLIC_SITE_URL }),
    "non_public_internal_path",
  );
  expectNormalizationError(
    () => normalizeBlogLinkHref("/api%2Fprivate", { publicSiteUrl: PUBLIC_SITE_URL }),
    "non_public_internal_path",
  );
  expectNormalizationError(
    () => normalizeBlogLinkHref("/images/guide.pdf", { publicSiteUrl: PUBLIC_SITE_URL }),
    "internal_asset_path",
  );

  for (const privateTarget of [
    "https://127.0.0.1/",
    "https://2130706433/",
    "https://0x7f000001/",
    "https://169.254.169.254/latest/meta-data/",
    "https://10.0.0.1/",
    "https://192.88.99.1/",
    "https://198.51.100.1/",
    "https://[::1]/",
    "https://[fc00::1]/",
    "https://[fe80::1]/",
    "https://[2001:2::1]/",
    "https://[100::1]/",
    "https://[::ffff:127.0.0.1]/",
    "https://[::127.0.0.1]/",
    "https://[64:ff9b::127.0.0.1]/",
    "https://[64:ff9b::808:808]/",
    "https://[64:ff9b:1::1]/",
    "https://[64:ff9b:1:ffff:ffff:ffff:ffff:ffff]/",
    "https://[2002:7f00:1::]/",
    "https://[2001:0::1]/",
    "https://metadata.google.internal/",
  ]) {
    expectNormalizationError(
      () => normalizeBlogLinkHref(privateTarget),
      "private_or_reserved_host",
    );
  }

  const redirectOrigin = new URL("https://a.example/initial");
  const redirectOtherDomain = new URL("https://b.example/hop");
  const redirectBackToOrigin = new URL("https://a.example/final");
  let crossDomainSeen = rememberCrossDomainBlogLinkRedirect(
    false,
    redirectOrigin,
    redirectOtherDomain,
  );
  crossDomainSeen = rememberCrossDomainBlogLinkRedirect(
    crossDomainSeen,
    redirectOtherDomain,
    redirectBackToOrigin,
  );
  assert.equal(
    crossDomainSeen,
    true,
    "A cross-domain redirect must remain review-required even when the chain returns to origin",
  );
}

function checkHtmlExtractionAndReconciliation(): void {
  const contentHtml = [
    "<h2>Evaluación y próximos pasos</h2>",
    "<p>",
    "<a href=/es/servicios>servicios psiquiátricos</a>",
    " y ",
    "<a href='https://www.nimh.nih.gov/health/topics/anxiety-disorders?utm_source=draft' rel='nofollow sponsored'>fuente de NIMH</a>",
    "</p>",
    "<h3>Preparación</h3>",
    '<p><a href="/es/para-pacientes" target="_self"><strong>información para pacientes</strong></a></p>',
  ].join("");
  const original = contentHtml;
  const document = extractBlogLinkDocument(contentHtml, {
    postIdentity: 42,
    publicSiteUrl: PUBLIC_SITE_URL,
  });
  const occurrences = extractBlogLinkOccurrences(contentHtml, {
    postIdentity: 42,
    publicSiteUrl: PUBLIC_SITE_URL,
  });

  assert.equal(contentHtml, original, "Extraction must never mutate article HTML");
  assert.equal(document.rejected.length, 0);
  assert.equal(occurrences.length, 3);
  assert.equal(occurrences[0].rawHref, "/es/servicios");
  assert.equal(occurrences[0].anchorText, "servicios psiquiátricos");
  assert.equal(occurrences[0].sectionHeading, "Evaluación y próximos pasos");

  const rejectedDocument = extractBlogLinkDocument(
    '<h2>Unsafe targets</h2><p><a href="http://example.com/clinical">insecure source</a> <a href="/admin">private admin</a></p>',
    {
      postIdentity: 43,
      publicSiteUrl: PUBLIC_SITE_URL,
    },
  );
  assert.deepEqual(
    rejectedDocument.rejected.map(item => ({
      href: item.rawHref,
      anchor: item.anchorText,
      heading: item.sectionHeading,
      reason: item.reasonCode,
    })),
    [
      {
        href: "http://example.com/clinical",
        anchor: "insecure source",
        heading: "Unsafe targets",
        reason: "external_https_required",
      },
      {
        href: "/admin",
        anchor: "private admin",
        heading: "Unsafe targets",
        reason: "non_public_internal_path",
      },
    ],
  );
  assert.equal(occurrences[0].ordinal, 0);
  assert.equal(occurrences[1].kind, "external");
  assert.equal(
    occurrences[1].normalizedHref,
    "https://www.nimh.nih.gov/health/topics/anxiety-disorders",
  );
  assert.equal(occurrences[1].target, "_blank");
  assert.equal(occurrences[2].anchorText, "información para pacientes");
  assert.equal(occurrences[2].sectionHeading, "Preparación");
  assert.equal(occurrences[2].ordinal, 2);
  assert.equal(occurrences[0].occurrenceKey.length, 64);
  assert.deepEqual(
    extractBlogLinkOccurrences(contentHtml, {
      postIdentity: 42,
      publicSiteUrl: PUBLIC_SITE_URL,
    }).map(item => item.occurrenceKey),
    occurrences.map(item => item.occurrenceKey),
  );
  assert.equal(document.contentChecksum.length, 64);
  assert.equal("contentHtml" in occurrences[0], false, "Extraction cannot inject render HTML");

  const firstPlan = buildBlogLinkReconciliationPlan(occurrences, []);
  assert.equal(firstPlan.create.length, 3);
  assert.equal(firstPlan.restore.length, 0);
  assert.equal(firstPlan.removeOccurrenceKeys.length, 0);

  const currentRows = occurrences.map(item => ({
    occurrenceKey: item.occurrenceKey,
    removedAt: null,
  }));
  const idempotentPlan = buildBlogLinkReconciliationPlan(occurrences, currentRows);
  assert.equal(idempotentPlan.create.length, 0);
  assert.equal(idempotentPlan.retain.length, 3);
  assert.equal(idempotentPlan.removeOccurrenceKeys.length, 0);

  const removalPlan = buildBlogLinkReconciliationPlan(occurrences.slice(0, 2), currentRows);
  assert.deepEqual(removalPlan.removeOccurrenceKeys, [occurrences[2].occurrenceKey]);

  const restorePlan = buildBlogLinkReconciliationPlan(occurrences, [
    { occurrenceKey: occurrences[0].occurrenceKey, removedAt: new Date() },
    ...currentRows.slice(1),
  ]);
  assert.deepEqual(
    restorePlan.restore.map(item => item.occurrenceKey),
    [occurrences[0].occurrenceKey],
  );

  assert.deepEqual(getUnknownBlogLinkDefaults("manual"), {
    reviewStatus: "pending",
    generationEligible: false,
    healthStatus: "unchecked",
    origin: "manual",
  });
}

function checkBilingualIntentAndSourcePolicy(): void {
  assert.equal(
    normalizeBlogLinkSearchText("Evaluación, medicación y atención"),
    "evaluacion medicacion y atencion",
  );
  assert.equal(
    matchesBlogLinkSourceTopic(
      "nimh-adhd",
      "Qué esperar de una evaluación de TDAH en adultos",
      "es",
    ),
    true,
  );
  assert.equal(
    matchesBlogLinkSourceTopic(
      "nimh-es-adhd",
      "Qué esperar de una evaluación de TDAH en adultos",
      "es",
    ),
    true,
  );
  assert.equal(is988AllowedForContext("General anxiety education", "en"), false);
  assert.equal(
    is988AllowedForContext("Ayuda inmediata ante una crisis de suicidio o autolesión", "es"),
    true,
  );
  assert.equal(detectBlogLinkIntent("Uso seguro de medicación", "es").medication, true);
  const anxietyHaystack = normalizeBlogLinkSearchText(
    "Questions to ask during an anxiety evaluation",
  );
  const unrelatedPreferredMatches = countBlogLinkTopicMatches(
    anxietyHaystack,
    ["Bipolar medication follow-up"],
  );
  assert.equal(unrelatedPreferredMatches, 0);
  assert.equal(
    isBlogLinkTopicallyCompatible(unrelatedPreferredMatches),
    false,
    "A preferred stable ID cannot bypass topical matching",
  );
  assert.equal(
    isBlogLinkTopicallyCompatible(countBlogLinkTopicMatches(
      anxietyHaystack,
      ["anxiety evaluation"],
    )),
    true,
  );
}

function checkExplainableScoring(): void {
  const sourceQuality = scoreSourceQuality({
    accountablePublisher: 25,
    expertReview: 22,
    traceableEvidence: 18,
    currency: 13,
    fundingTransparency: 9,
    stableIdentifier: 5,
  });
  assert.equal(sourceQuality.total, 92);
  assert.equal(sourceQuality.policyVersion, BLOG_LINK_POLICY_VERSION);
  assert.equal(sourceQuality.scoreVersion, BLOG_LINK_SCORE_VERSION);
  assert.ok(sourceQuality.explanations.expertReview.length > 0);

  assert.throws(
    () => scoreSourceQuality({
      accountablePublisher: 26,
      expertReview: 0,
      traceableEvidence: 0,
      currency: 0,
      fundingTransparency: 0,
      stableIdentifier: 0,
    }),
    (error: unknown) => (error as { code?: string }).code === "blog_link_score_out_of_bounds",
  );

  const fit = scoreCitationFit({
    directSupport: 46,
    evidenceTypeFit: 18,
    contextFit: 14,
    languageAccessibility: 9,
    diversity: 4,
  });
  assert.equal(fit.total, 91);
  assert.equal(scoreCitationUse(sourceQuality, fit).total, 91);

  const recommended = scoreInternalLinkOpportunity({
    topicalAffinity: 32,
    patientJourneyFit: 18,
    graphNeed: 17,
    anchorContext: 12,
    editorialDiversity: 8,
  });
  assert.equal(recommended.total, 87);
  assert.equal(recommended.eligible, true);
  assert.equal(recommended.band, "recommended");

  const gated = scoreInternalLinkOpportunity({
    topicalAffinity: 14,
    patientJourneyFit: 20,
    graphNeed: 20,
    anchorContext: 15,
    editorialDiversity: 10,
  });
  assert.equal(gated.total, 79);
  assert.equal(gated.eligible, false);
  assert.equal(gated.band, "none");
  assert.ok(gated.gateReasons.includes("topical_affinity_below_gate"));

  const tieA = {
    stableKey: "b-target",
    score: recommended,
  };
  const tieB = {
    stableKey: "a-target",
    score: recommended,
  };
  assert.deepEqual(
    rankInternalLinkOpportunities([tieA, tieB]).map(item => item.stableKey),
    ["a-target", "b-target"],
  );
}

function buildExternalCandidate(
  overrides: Partial<BlogLinkGenerationCandidate> = {},
): BlogLinkGenerationCandidate {
  return {
    stableKey: "nimh-anxiety-disorders",
    normalizedHref: "https://www.nimh.nih.gov/health/topics/anxiety-disorders",
    kind: "external",
    language: "all",
    reviewStatus: "approved",
    healthStatus: "healthy",
    generationEligible: true,
    sourceQualityScore: 90,
    citationFitScore: 92,
    humanReviewed: true,
    exactHrefMatched: true,
    crossDomainRedirect: false,
    ...overrides,
  };
}

function checkEligibilityAndExactSelection(): void {
  const managedPostLink = {
    kind: "internal" as const,
    stableKey: "blog-post-42",
    sourceCategory: "first_party_blog_post",
    normalizedHref: "/blog/anxiety-care",
    targetPostId: 42,
  };
  assert.equal(isManagedBlogPostTarget(managedPostLink), true);
  assert.equal(
    isLiveManagedBlogPostTarget(managedPostLink, {
      id: 42,
      status: "published",
      slug: "anxiety-care",
      language: "en",
    }),
    true,
  );
  assert.equal(
    isLiveManagedBlogPostTarget(managedPostLink, {
      id: 42,
      status: "draft",
      slug: "anxiety-care",
      language: "en",
    }),
    false,
  );
  assert.equal(
    isLiveManagedBlogPostTarget(managedPostLink, {
      id: 42,
      status: "published",
      slug: "renamed-anxiety-care",
      language: "en",
    }),
    false,
  );
  assert.equal(
    isLiveManagedBlogPostTarget({
      kind: "internal",
      stableKey: "services",
      sourceCategory: "first_party_service",
      normalizedHref: "/services",
      targetPostId: null,
    }, null),
    true,
  );

  const educationalContext = {
    language: "en" as const,
    text: "An educational overview of anxiety symptoms",
  };
  const criticalContext = {
    language: "en" as const,
    text: "Medication treatment and safety questions",
  };
  assert.equal(
    evaluateBlogLinkGenerationEligibility(
      buildExternalCandidate({ sourceQualityScore: 80, citationFitScore: 84 }),
      educationalContext,
    ).eligible,
    true,
  );
  const criticalWithoutReview = evaluateBlogLinkGenerationEligibility(
    buildExternalCandidate({ humanReviewed: false }),
    criticalContext,
  );
  assert.equal(criticalWithoutReview.eligible, false);
  assert.ok(criticalWithoutReview.reasons.includes("critical_source_requires_human_review"));

  const crisisCandidate = buildExternalCandidate({
    stableKey: "988-lifeline",
    normalizedHref: "https://988lifeline.org/",
  });
  assert.equal(
    evaluateBlogLinkGenerationEligibility(crisisCandidate, educationalContext).eligible,
    false,
  );
  assert.equal(
    evaluateBlogLinkGenerationEligibility(crisisCandidate, {
      language: "es",
      text: "Recursos inmediatos durante una crisis de suicidio",
    }).eligible,
    true,
  );
  const spanishCrisisCandidate = buildExternalCandidate({
    stableKey: "988-lifeline-es",
    normalizedHref: "https://988lifeline.org/es/inicio",
    language: "es",
  });
  assert.equal(
    evaluateBlogLinkGenerationEligibility(
      spanishCrisisCandidate,
      educationalContext,
    ).eligible,
    false,
  );
  assert.equal(
    evaluateBlogLinkGenerationEligibility(spanishCrisisCandidate, {
      language: "es",
      text: "Ayuda inmediata durante una crisis de suicidio",
    }).eligible,
    true,
  );

  const snapshot = [
    buildExternalCandidate(),
    crisisCandidate,
  ];
  const resolution = resolveRequestedBlogLinkStableIds(
    ["invented-source", "nimh-anxiety-disorders", "988-lifeline"],
    snapshot,
    educationalContext,
  );
  assert.deepEqual(resolution.selected.map(item => item.stableKey), [
    "nimh-anxiety-disorders",
  ]);
  assert.deepEqual(resolution.rejected.map(item => item.stableKey), [
    "invented-source",
    "988-lifeline",
  ]);

  assert.equal(
    isExactEligibleExternalHref(
      "https://www.nimh.nih.gov/health/topics/anxiety-disorders?utm_source=writer",
      snapshot,
      educationalContext,
    ),
    true,
  );
  assert.equal(
    isExactEligibleExternalHref(
      "https://www.nimh.nih.gov/health/topics/depression",
      snapshot,
      educationalContext,
    ),
    false,
  );

  assert.equal(
    evaluateBlogLinkGenerationEligibility(
      buildExternalCandidate({ reviewStatus: "pending" }),
      educationalContext,
    ).eligible,
    false,
  );
  assert.equal(
    evaluateBlogLinkGenerationEligibility(
      buildExternalCandidate({ healthStatus: "stale" }),
      educationalContext,
    ).eligible,
    false,
  );
  assert.equal(
    evaluateBlogLinkGenerationEligibility(
      buildExternalCandidate({ crossDomainRedirect: true }),
      educationalContext,
    ).eligible,
    false,
  );
}

function checkHealthAndAuditGuards(): void {
  assert.deepEqual(canonicalizeBlogLinkAuditIds([3, 1, 3, 2]), [1, 2, 3]);
  assert.deepEqual(
    assertBlogLinkAuditIdempotencyMatch({ linkIds: [3, 1, 2, 2] }, [2, 3, 1]),
    [1, 2, 3],
  );
  assert.throws(
    () => assertBlogLinkAuditIdempotencyMatch({ linkIds: [1, 2] }, [1, 3]),
    (error: unknown) => (
      (error as { statusCode?: number; code?: string }).statusCode === 409
      && (error as { code?: string }).code === "blog_link_audit_idempotency_conflict"
    ),
  );
  assert.equal(resolveBlogLinkUsageGenerationRunId(undefined, 71), 71);
  assert.equal(resolveBlogLinkUsageGenerationRunId(undefined, null), null);
  assert.equal(resolveBlogLinkUsageGenerationRunId(null, 71), null);
  assert.equal(resolveBlogLinkUsageGenerationRunId(84, 71), 84);
  assert.equal(
    parseBlogLinkBackfillOptions(["--after-id=2147483647"]).afterId,
    2_147_483_647,
  );
  assert.throws(
    () => parseBlogLinkBackfillOptions(["--after-id=2147483648"]),
    /must be between 0 and 2147483647/,
  );
  assert.equal(shouldProcessBlogLinkAuditRun(false, "queued"), true);
  assert.equal(shouldProcessBlogLinkAuditRun(true, "queued"), true);
  assert.equal(shouldProcessBlogLinkAuditRun(false, "running"), false);
  assert.equal(shouldProcessBlogLinkAuditRun(false, "completed"), false);
  assert.equal(shouldProcessBlogLinkAuditRun(false, "interrupted"), true);
  assert.equal(shouldResumeBlogLinkAuditStatus("interrupted"), true);
  assert.equal(shouldResumeBlogLinkAuditStatus("failed"), false);

  const emptyCheckpoint = readBlogLinkAuditCheckpoint(null, [3, 1, 2, 2]);
  assert.deepEqual(emptyCheckpoint, {
    requested: 3,
    checked: 0,
    healthy: 0,
    redirected: 0,
    attention: 0,
    failed: 0,
    completedLinkIds: [],
  });
  const firstCheckpoint = advanceBlogLinkAuditCheckpoint(
    emptyCheckpoint,
    1,
    "healthy",
  );
  const resumedCheckpoint = advanceBlogLinkAuditCheckpoint(
    firstCheckpoint,
    2,
    "failed",
  );
  assert.deepEqual(resumedCheckpoint, {
    requested: 3,
    checked: 2,
    healthy: 1,
    redirected: 0,
    attention: 0,
    failed: 1,
    completedLinkIds: [1, 2],
  });
  assert.deepEqual(
    advanceBlogLinkAuditCheckpoint(resumedCheckpoint, 1, "attention"),
    resumedCheckpoint,
    "A resumed worker must not double-count a completed link ID",
  );
  assert.deepEqual(
    getPendingBlogLinkAuditIds([3, 2, 1], resumedCheckpoint),
    [3],
    "A resumed worker must continue only from the durable checkpoint",
  );
  assert.deepEqual(
    readBlogLinkAuditCheckpoint(resumedCheckpoint, [1, 2, 3]),
    resumedCheckpoint,
  );

  const currentLease = {
    runId: 19,
    token: "current-worker-token",
    epoch: 4,
  };
  const currentLeaseSnapshot = {
    id: 19,
    status: "running",
    leaseToken: "current-worker-token",
    leaseEpoch: 4,
  };
  assert.equal(
    isBlogLinkAuditLeaseCurrent(currentLeaseSnapshot, currentLease),
    true,
  );
  assert.equal(
    isBlogLinkAuditLeaseCurrent(
      { ...currentLeaseSnapshot, leaseToken: "stale-worker-token" },
      currentLease,
    ),
    false,
    "A worker from an older lease token must be fenced out",
  );
  assert.equal(
    isBlogLinkAuditLeaseCurrent(
      { ...currentLeaseSnapshot, leaseEpoch: 5 },
      currentLease,
    ),
    false,
    "A worker from an older lease epoch must be fenced out",
  );
  assert.equal(
    isBlogLinkAuditLeaseCurrent(
      { ...currentLeaseSnapshot, status: "interrupted" },
      currentLease,
    ),
    false,
    "Interrupting a stale run must immediately revoke its active lease",
  );
  assert.equal(
    nextBlogLinkAuditFailureCount(4, "unreachable"),
    5,
    "A serialized audit write must increment the latest locked failure count",
  );
  assert.equal(nextBlogLinkAuditFailureCount(4, "healthy"), 0);
  assert.equal(nextBlogLinkAuditFailureCount(4, "redirected"), 0);
  assert.deepEqual(
    BLOG_LINK_AUDIT_ROW_LOCK_ORDER,
    ["target_post", "source", "link"],
    "Audit writes must lock lifecycle targets before the publication source-before-link order",
  );
  const inspectedTarget = {
    id: 14,
    normalizedHref: "https://www.nimh.nih.gov/health/topics/anxiety-disorders",
    canonicalKey: "canonical-anxiety",
    kind: "external",
    sourceId: 3,
    targetPostId: null,
  };
  assert.equal(isSameBlogLinkAuditTarget(inspectedTarget, inspectedTarget), true);
  assert.equal(
    isSameBlogLinkAuditTarget(
      inspectedTarget,
      { ...inspectedTarget, canonicalKey: "canonical-replaced" },
    ),
    false,
    "A response inspected for an older exact URL identity must never update its replacement",
  );
  assert.equal(
    isSameBlogLinkAuditTarget(
      inspectedTarget,
      { ...inspectedTarget, sourceId: 4 },
    ),
    false,
  );
  assert.equal(
    isSameBlogLinkAuditTarget(
      inspectedTarget,
      { ...inspectedTarget, targetPostId: 88 },
    ),
    false,
    "A health response cannot cross a managed-target lifecycle identity change",
  );

  const savedRetry = {
    idempotencyKey: "audit-retry-persisted",
    linkIds: [7, 2, 4],
  };
  const parsedRetry = parsePendingAuditRequest(
    serializePendingAuditRequest(savedRetry),
  );
  assert.deepEqual(parsedRetry, {
    idempotencyKey: "audit-retry-persisted",
    linkIds: [2, 4, 7],
  });
  assert.deepEqual(
    choosePendingAuditRequest({
      storedRequest: parsedRetry,
      visibleLinkIds: [99],
      createIdempotencyKey: () => "audit-new-key",
    }),
    parsedRetry,
    "A browser refresh or filter change must reuse the complete saved retry payload",
  );
  assert.deepEqual(
    choosePendingAuditRequest({
      storedRequest: parsedRetry,
      interruptedRun: {
        idempotencyKey: "audit-interrupted-run",
        linkIds: [11, 10],
      },
      visibleLinkIds: [99],
      createIdempotencyKey: () => "audit-new-key",
    }),
    {
      idempotencyKey: "audit-interrupted-run",
      linkIds: [10, 11],
    },
    "An interrupted durable run owns its original key and link-ID set",
  );
  assert.equal(
    isPendingAuditRequestForRun(parsedRetry!, {
      idempotencyKey: "audit-retry-persisted",
      linkIds: [7, 4, 2],
    }),
    true,
  );
  assert.equal(
    isPendingAuditRequestForRun(parsedRetry!, {
      idempotencyKey: "audit-older-terminal-run",
      linkIds: [2, 4, 7],
    }),
    false,
    "A failed POST retry must not be replaced by the older terminal run payload",
  );
  assert.equal(parsePendingAuditRequest("{not-json"), null);

  assert.equal(
    classifyBlogLinkHealthObservation({ httpStatus: 200 }).healthStatus,
    "healthy",
  );
  assert.equal(
    classifyBlogLinkHealthObservation({
      httpStatus: 200,
      redirectCount: 1,
    }).healthStatus,
    "redirected",
  );
  assert.equal(
    classifyBlogLinkHealthObservation({
      httpStatus: 200,
      redirectCount: 1,
      crossDomainRedirect: true,
    }).healthStatus,
    "changed_review_needed",
  );
  assert.equal(
    classifyBlogLinkHealthObservation({ httpStatus: 404 }).healthStatus,
    "unreachable",
  );
  assert.equal(
    classifyBlogLinkHealthObservation({
      httpStatus: 404,
      previousConsecutiveFailures: 1,
    }).healthStatus,
    "broken",
  );

  for (const observation of [
    { httpStatus: 403 },
    { httpStatus: 429 },
    { errorCategory: "timeout" },
    { errorCategory: "tls" },
    { errorCategory: "dns" },
  ]) {
    const classified = classifyBlogLinkHealthObservation(observation);
    assert.equal(classified.healthStatus, "unreachable");
    assert.equal(classified.confirmedBroken, false);
  }

  assert.deepEqual(
    assertSafeBlogLinkAuditInput({
      idempotencyKey: "audit-run-123456",
      linkIds: [1, 2, 3],
      filters: { kind: "external", healthStatus: "stale" },
    }),
    {
      idempotencyKey: "audit-run-123456",
      linkIds: [1, 2, 3],
      filters: { kind: "external", healthStatus: "stale" },
    },
  );
  assert.throws(
    () => assertSafeBlogLinkAuditInput({ url: "https://example.com" }),
    (error: unknown) => (error as { code?: string }).code === "blog_link_audit_url_not_allowed",
  );
  assert.throws(
    () => assertSafeBlogLinkAuditInput({
      filters: { href: "https://example.com" },
    }),
    (error: unknown) => (error as { code?: string }).code === "blog_link_audit_url_not_allowed",
  );
  assert.throws(
    () => assertSafeBlogLinkAuditInput({ linkIds: [1], arbitrary: true }),
    (error: unknown) => (error as { code?: string }).code === "blog_link_audit_invalid_input",
  );
}

function checkAiInternalLinkAllowlist(): void {
  const depthParagraph = Array.from({ length: 8 }, () => (
    "A clinician can explain benefits, limits, alternatives, timing, follow-up, and safety considerations while answering questions in clear language."
  )).join(" ");
  const baseDraft = {
    title: "Understanding anxiety treatment options",
    excerpt: "A practical educational overview of anxiety treatment and what patients can expect.",
    contentHtml: [
      "<h2>Overview</h2>",
      "<p>Learn about <a href=\"/services\">psychiatric services</a> and the questions to bring to a consultation.</p>",
      `<p>${depthParagraph}</p>`,
      "<p>This educational information does not replace medical advice or emergency care. Call 911 in an emergency.</p>",
    ].join(""),
    metaTitle: "Understanding Anxiety Treatment Options",
    metaDescription: "Learn about anxiety treatment options, questions to discuss, and what to expect from psychiatric care.",
    riskNotes: [],
  };
  assert.equal(
    normalizeAiGeneratedDraft(baseDraft, "en", baseDraft.title, {
      allowedInternalLinks: ["/services"],
    }).contentHtml.includes('href="/services"'),
    true,
  );
  assert.throws(
    () => normalizeAiGeneratedDraft({
      ...baseDraft,
      contentHtml: baseDraft.contentHtml.replace("/services", "/invented-treatment-page"),
    }, "en", baseDraft.title, {
      allowedInternalLinks: ["/services"],
    }),
    /outside the managed allowlist/,
  );
  assert.throws(
    () => normalizeAiGeneratedDraft({
      ...baseDraft,
      contentHtml: baseDraft.contentHtml.replace("/services", "/admin/private"),
    }, "en", baseDraft.title, {
      allowedInternalLinks: ["/services"],
    }),
    /outside the managed allowlist/,
  );
  for (const rejectedHref of [
    "",
    "//unapproved.example/medical",
    "&#x2f;&#x2f;unapproved.example/medical",
    "mailto:care@unapproved.example",
  ]) {
    assert.throws(
      () => normalizeAiGeneratedDraft({
        ...baseDraft,
        contentHtml: baseDraft.contentHtml.replace("/services", rejectedHref),
      }, "en", baseDraft.title, {
        allowedInternalLinks: ["/services"],
      }),
      /outside the managed allowlist/,
    );
  }
  const approvedExternalUrl = "https://www.nimh.nih.gov/health/topics/anxiety-disorders?id=approved";
  const externalDraft = {
    ...baseDraft,
    contentHtml: baseDraft.contentHtml.replace(
      "</p>",
      ` and <a href="${approvedExternalUrl}&utm_source=ai">reviewed NIMH guidance</a></p>`,
    ),
  };
  assert.doesNotThrow(
    () => normalizeAiGeneratedDraft(externalDraft, "en", baseDraft.title, {
      allowedInternalLinks: ["/services"],
      allowedExternalSourceUrls: [approvedExternalUrl],
    }),
  );
  assert.throws(
    () => normalizeAiGeneratedDraft({
      ...externalDraft,
      contentHtml: externalDraft.contentHtml.replace("https://", "//"),
    }, "en", baseDraft.title, {
      allowedInternalLinks: ["/services"],
      allowedExternalSourceUrls: [approvedExternalUrl],
    }),
    /outside the managed allowlist/,
  );
  assert.throws(
    () => normalizeAiGeneratedDraft({
      ...externalDraft,
      contentHtml: externalDraft.contentHtml.replace("id=approved", "id=different"),
    }, "en", baseDraft.title, {
      allowedInternalLinks: ["/services"],
      allowedExternalSourceUrls: [approvedExternalUrl],
    }),
    /outside the verified allowlist/,
  );
}

async function checkFailOpenSelection(): Promise<void> {
  const result = await resolveBlogLinkSelectionFailOpen<string[]>(
    () => {
      throw new Error("simulated library failure");
    },
    [],
  );
  assert.deepEqual(result.value, []);
  assert.equal(result.warnings.length, 1);

  const success = await resolveBlogLinkSelectionFailOpen(
    () => ["nimh-anxiety-disorders"],
    [],
  );
  assert.deepEqual(success.value, ["nimh-anxiety-disorders"]);
  assert.deepEqual(success.warnings, []);
}

function checkLifecycleAtomicityGuards(): void {
  const updatedAt = new Date("2026-07-27T10:00:00.000Z");
  assert.equal(
    blogPostSnapshotMatches(
      { status: "published", updatedAt },
      { expectedStatus: "published", expectedUpdatedAt: new Date(updatedAt) },
    ),
    true,
  );
  assert.equal(
    blogPostSnapshotMatches(
      { status: "draft", updatedAt },
      { expectedStatus: "published", expectedUpdatedAt: updatedAt },
    ),
    false,
  );
  const redirectSnapshot = {
    id: 12,
    sourcePath: "/blog/old",
    targetPath: "/blog/new",
    isActive: true,
    updatedAt,
  };
  assert.equal(
    blogRedirectSnapshotMatches(
      { ...redirectSnapshot, updatedAt: new Date(updatedAt) },
      redirectSnapshot,
    ),
    true,
  );
  assert.throws(
    () => assertBlogRedirectCleanupSnapshotMatches(
      {
        ...redirectSnapshot,
        targetPath: "/blog/concurrent-edit",
      },
      redirectSnapshot,
    ),
    (error: unknown) => (
      (error as { statusCode?: number; code?: string }).statusCode === 409
      && (error as { code?: string }).code === "blog_redirect_cleanup_redirect_changed"
    ),
  );
  assert.throws(
    () => assertBlogRedirectCleanupSnapshotMatches(
      {
        ...redirectSnapshot,
        isActive: false,
      },
      redirectSnapshot,
    ),
    /redirect changed/i,
  );
  assert.deepEqual(
    planBlogPostImageObjectDeletion([
      {
        source: "ai",
        objectKey: "blog-images/posts/4/hero-a.webp",
        generationStatus: "completed",
        errorCode: null,
      },
      {
        source: "ai",
        objectKey: "blog-images/posts/4/hero-a.webp",
        generationStatus: "completed",
        errorCode: null,
      },
      {
        source: "curated",
        objectKey: null,
        generationStatus: "completed",
        errorCode: null,
      },
    ]),
    ["blog-images/posts/4/hero-a.webp"],
  );
  assert.throws(
    () => planBlogPostImageObjectDeletion([
      {
        source: "ai",
        objectKey: null,
        generationStatus: "pending",
        errorCode: null,
      },
    ]),
    (error: unknown) => (
      (error as { statusCode?: number; code?: string }).statusCode === 409
      && (error as { code?: string }).code === "blog_post_delete_image_busy"
    ),
  );
  assert.throws(
    () => planBlogPostImageObjectDeletion([
      {
        source: "ai",
        objectKey: null,
        generationStatus: "generating",
        errorCode: null,
      },
    ]),
    (error: unknown) => (
      (error as { statusCode?: number; code?: string }).statusCode === 409
      && (error as { code?: string }).code === "blog_post_delete_image_busy"
    ),
  );
  assert.throws(
    () => planBlogPostImageObjectDeletion([
      {
        source: "ai",
        objectKey: "blog-images/posts/4/inline-a.webp",
        generationStatus: "completed",
        errorCode: "deletion_pending",
      },
    ]),
    /image generation or deletion/i,
  );
  assert.equal(blogRedirectPresenceSnapshotMatches(null, null), true);
  assert.equal(
    blogRedirectPresenceSnapshotMatches(redirectSnapshot, null),
    false,
  );
  assert.equal(
    blogRedirectPresenceSnapshotMatches(
      { ...redirectSnapshot, updatedAt: new Date(updatedAt) },
      redirectSnapshot,
    ),
    true,
  );
  assert.throws(
    () => assertBlogRedirectPublishSnapshotMatches(redirectSnapshot, null),
    (error: unknown) => (
      (error as { statusCode?: number; code?: string }).statusCode === 409
      && (error as { code?: string }).code === "blog_redirect_publish_snapshot_changed"
    ),
  );
  assert.throws(
    () => assertBlogRedirectPublishSnapshotMatches(
      {
        ...redirectSnapshot,
        targetPath: "/blog/concurrent-target",
      },
      redirectSnapshot,
    ),
    /redirect changed/i,
  );
  assert.throws(
    () => assertBlogPostSnapshotMatches(
      { status: "published", updatedAt: new Date(updatedAt.getTime() + 1) },
      { expectedStatus: "published", expectedUpdatedAt: updatedAt },
      {
        message: "stale cleanup snapshot",
        code: "blog_redirect_cleanup_snapshot_changed",
      },
    ),
    (error: unknown) => (
      (error as { statusCode?: number; code?: string }).statusCode === 409
      && (error as { code?: string }).code === "blog_redirect_cleanup_snapshot_changed"
    ),
  );

  assert.deepEqual(
    buildBlogPostStatusTransitionPlan({
      currentStatus: "pending_review",
      nextStatus: "published",
      currentPath: "/blog/anxiety-treatment",
      redirectTargetPath: null,
    }),
    {
      activateManagedTarget: true,
      deactivateRedirectPath: "/blog/anxiety-treatment",
      createRedirect: false,
    },
  );
  assert.deepEqual(
    buildBlogPostStatusTransitionPlan({
      currentStatus: "published",
      nextStatus: "draft",
      currentPath: "/blog/anxiety-treatment",
      redirectTargetPath: "/services",
    }),
    {
      activateManagedTarget: false,
      deactivateRedirectPath: null,
      createRedirect: true,
    },
  );
  assert.equal(
    buildBlogPostStatusTransitionPlan({
      currentStatus: "published",
      nextStatus: "draft",
      currentPath: "/blog/anxiety-treatment",
      redirectTargetPath: null,
    }).createRedirect,
    false,
  );

  const rewritten = rewriteExactBlogLinkHref(
    '<p><a href="/blog/old?ref=article#care">Old article</a> <a href="/blog/older">Other</a></p>',
    "/blog/old",
    "/blog/new",
  );
  assert.equal(rewritten.replacements, 1);
  assert.match(rewritten.contentHtml, /href="\/blog\/new\?ref=article#care"/);
  assert.match(rewritten.contentHtml, /href="\/blog\/older"/);
}

async function main(): Promise<void> {
  checkPinnedAuditLookup();
  checkSafeConfiguration();
  checkNormalization();
  checkHtmlExtractionAndReconciliation();
  checkBilingualIntentAndSourcePolicy();
  checkExplainableScoring();
  checkEligibilityAndExactSelection();
  checkHealthAndAuditGuards();
  checkLifecycleAtomicityGuards();
  checkAiInternalLinkAllowlist();
  await checkFailOpenSelection();

  console.log(
    "Blog link guards passed: safe config, URL normalization, htmlparser2 extraction, "
    + "reconciliation, lifecycle CAS, bilingual policy, explainable scoring, eligibility, health, and fail-open behavior.",
  );
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
