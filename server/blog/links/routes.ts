import { randomUUID } from "node:crypto";
import type { Express, Request, Response } from "express";
import { z, ZodError } from "zod";
import type { BlogLinkAuditRun } from "@shared/schema";
import {
  auditBlogLinkById,
  createBlogLinkAuditRun,
  getBlogLinkAuditRun,
  markStaleBlogLinkAuditRunsInterrupted,
  processBlogLinkAuditRun,
} from "./audit";
import {
  getBlogLinkConfig,
  getSafeBlogLinkConfigSummary,
} from "./config";
import {
  BlogLinkNormalizationError,
  normalizeBlogLinkHref,
} from "./normalization";
import {
  assertSafeBlogLinkAuditInput,
  shouldProcessBlogLinkAuditRun,
} from "./policy";
import {
  assertBlogPostLinksPublishReady,
  createManagedBlogLink,
  getBlogInternalLinkOpportunities,
  getBlogLinkPolicyMetadata,
  getBlogLinkSummary,
  getBlogPostLinkReport,
  getManagedBlogLinkDetail,
  listManagedBlogLinks,
  listManagedBlogLinkSources,
  reviewManagedBlogLink,
  reviewManagedBlogLinkSource,
  updateManagedBlogLink,
} from "./service";
import { reconcileStoredBlogPostLinks } from "./storage";

const languageSchema = z.enum(["en", "es", "all"]);
const reviewStatusSchema = z.enum(["pending", "approved", "blocked", "retired"]);
const healthStatusSchema = z.enum([
  "unchecked",
  "healthy",
  "redirected",
  "unreachable",
  "broken",
  "changed_review_needed",
  "stale",
]);
const sourceTypeSchema = z.enum([
  "first_party",
  "government",
  "professional_guideline",
  "academic",
  "health_system",
  "crisis",
  "other",
]);
const boundedStringArray = z.array(z.string().trim().min(1).max(120)).max(30);

const createLinkSchema = z.object({
  kind: z.enum(["internal", "external"]).optional(),
  href: z.string().trim().min(1).max(2_000),
  stableKey: z.string().trim().regex(/^[a-z0-9-]{3,120}$/).optional().nullable(),
  title: z.string().trim().min(2).max(255),
  label: z.string().trim().min(2).max(255).optional().nullable(),
  language: languageSchema.default("all"),
  sourceId: z.coerce.number().int().positive().optional().nullable(),
  sourceName: z.string().trim().min(2).max(255).optional().nullable(),
  sourceType: sourceTypeSchema.optional().nullable(),
  sourceCategory: z.string().trim().max(100).optional().nullable(),
  topicTags: boundedStringArray.optional(),
  categoryKeys: boundedStringArray.optional(),
  contentPillars: boundedStringArray.optional(),
  keywords: boundedStringArray.optional(),
  summary: z.string().trim().max(2_000).optional().nullable(),
  evidenceType: z.string().trim().max(100).optional().nullable(),
  evidenceScope: z.string().trim().max(2_000).optional().nullable(),
});

const updateLinkSchema = z.object({
  title: z.string().trim().min(2).max(255).optional(),
  label: z.string().trim().min(2).max(255).optional(),
  language: languageSchema.optional(),
  sourceCategory: z.string().trim().max(100).optional().nullable(),
  topicTags: boundedStringArray.optional(),
  categoryKeys: boundedStringArray.optional(),
  contentPillars: boundedStringArray.optional(),
  keywords: boundedStringArray.optional(),
  summary: z.string().trim().max(2_000).optional().nullable(),
  evidenceType: z.string().trim().max(100).optional().nullable(),
  evidenceScope: z.string().trim().max(2_000).optional().nullable(),
  evidenceScore: z.number().int().min(0).max(100).optional(),
  freshnessScore: z.number().int().min(0).max(100).optional(),
}).strict();

const reviewLinkSchema = z.object({
  reviewStatus: reviewStatusSchema,
  reason: z.string().trim().max(2_000).optional().nullable(),
  reviewNotes: z.string().trim().max(2_000).optional().nullable(),
}).superRefine((value, ctx) => {
  const note = value.reviewNotes || value.reason;
  if ((value.reviewStatus === "blocked" || value.reviewStatus === "retired") && !note) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["reviewNotes"],
      message: "A reason is required when blocking or retiring a link",
    });
  }
});

const sourceQualitySchema = z.object({
  accountablePublisher: z.number().int().min(0).max(25),
  expertReview: z.number().int().min(0).max(25),
  traceableEvidence: z.number().int().min(0).max(20),
  currency: z.number().int().min(0).max(15),
  fundingTransparency: z.number().int().min(0).max(10),
  stableIdentifier: z.number().int().min(0).max(5),
});

const reviewSourceSchema = z.object({
  reviewStatus: reviewStatusSchema,
  reviewNotes: z.string().trim().max(2_000).default(""),
  qualityBreakdown: sourceQualitySchema,
  languages: z.array(z.enum(["en", "es"])).min(1).max(2),
});

const auditRunSchema = z.object({
  idempotencyKey: z.string().trim().min(8).max(255).optional(),
  linkIds: z.array(z.number().int().positive()).min(1).max(25),
}).strict();

function parsePositiveId(value: string): number | null {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function requestIdentity(req: Request): string {
  const user = req.user as {
    email?: string;
    username?: string;
    claims?: { email?: string; sub?: string };
  } | undefined;
  return (
    user?.claims?.email
    || user?.email
    || user?.username
    || user?.claims?.sub
    || "blog-admin"
  ).slice(0, 255);
}

function publicBlogLinkAuditRun(
  run: BlogLinkAuditRun,
): Omit<BlogLinkAuditRun, "leaseToken" | "leaseEpoch"> {
  const {
    leaseToken: _leaseToken,
    leaseEpoch: _leaseEpoch,
    ...publicRun
  } = run;
  return publicRun;
}

function sendLinkError(res: Response, error: unknown): void {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Invalid Link Intelligence request",
      errors: error.errors.map(issue => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }
  if (error instanceof BlogLinkNormalizationError) {
    res.status(400).json({
      success: false,
      message: error.message,
      code: error.code,
    });
    return;
  }
  const value = error as {
    statusCode?: number;
    code?: string;
    message?: string;
    linkId?: number;
    openRunId?: number;
    checks?: unknown;
  };
  if (value.statusCode && value.statusCode >= 400 && value.statusCode < 600) {
    res.status(value.statusCode).json({
      success: false,
      message: value.message || "Link Intelligence request failed",
      ...(value.code ? { code: value.code } : {}),
      ...(value.linkId ? { linkId: value.linkId } : {}),
      ...(value.openRunId ? { openRunId: value.openRunId } : {}),
      ...(value.checks ? { checks: value.checks } : {}),
    });
    return;
  }
  console.error("Link Intelligence request failed:", error);
  res.status(500).json({
    success: false,
    message: "Link Intelligence request failed",
  });
}

function requireLinkFeature(req: Request, res: Response, next: () => void): void {
  if (!getBlogLinkConfig().enabled) {
    res.status(503).json({
      success: false,
      message: "Link Intelligence is disabled. Apply the migration, seed and backfill before enabling BLOG_LINK_ENABLED.",
    });
    return;
  }
  next();
}

export function registerBlogLinkRoutes(app: Express): void {
  app.get("/api/admin/blog/links/config", (_req, res) => {
    const config = getBlogLinkConfig();
    res.status(200).json({
      success: true,
      data: {
        ...getSafeBlogLinkConfigSummary(config),
        policy: getBlogLinkPolicyMetadata(),
      },
    });
  });

  app.get("/api/admin/blog/links/summary", requireLinkFeature, async (_req, res) => {
    try {
      res.status(200).json({ success: true, data: await getBlogLinkSummary() });
    } catch (error) {
      sendLinkError(res, error);
    }
  });

  app.get("/api/admin/blog/link-sources", requireLinkFeature, async (_req, res) => {
    try {
      res.status(200).json({ success: true, data: await listManagedBlogLinkSources() });
    } catch (error) {
      sendLinkError(res, error);
    }
  });

  app.post("/api/admin/blog/link-sources/:id/review", requireLinkFeature, async (req, res) => {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: "Invalid link source id" });
    try {
      const payload = reviewSourceSchema.parse(req.body);
      const source = await reviewManagedBlogLinkSource({
        id,
        reviewStatus: payload.reviewStatus,
        reviewedBy: requestIdentity(req),
        reviewNotes: payload.reviewNotes,
        qualityBreakdown: payload.qualityBreakdown,
        languages: payload.languages,
      });
      if (!source) return res.status(404).json({ success: false, message: "Link source not found" });
      res.status(200).json({ success: true, data: source });
    } catch (error) {
      sendLinkError(res, error);
    }
  });

  app.get("/api/admin/blog/links", requireLinkFeature, async (req, res) => {
    try {
      const kind = req.query.kind === "internal" || req.query.kind === "external"
        ? req.query.kind
        : undefined;
      const language = req.query.language === "en" || req.query.language === "es" || req.query.language === "all"
        ? req.query.language
        : undefined;
      const reviewStatus = reviewStatusSchema.safeParse(req.query.reviewStatus);
      const healthStatus = healthStatusSchema.safeParse(req.query.healthStatus);
      const sourceId = typeof req.query.sourceId === "string"
        ? parsePositiveId(req.query.sourceId) || undefined
        : undefined;
      const generationEligible = req.query.generationEligible === "true"
        ? true
        : req.query.generationEligible === "false"
          ? false
          : undefined;
      const data = await listManagedBlogLinks({
        kind,
        language,
        reviewStatus: reviewStatus.success ? reviewStatus.data : undefined,
        healthStatus: healthStatus.success ? healthStatus.data : undefined,
        generationEligible,
        sourceId,
        categoryKey: typeof req.query.categoryKey === "string" ? req.query.categoryKey.slice(0, 120) : undefined,
        contentPillar: typeof req.query.contentPillar === "string" ? req.query.contentPillar.slice(0, 120) : undefined,
        search: typeof req.query.search === "string" ? req.query.search.slice(0, 255) : undefined,
        page: typeof req.query.page === "string" ? Number(req.query.page) : undefined,
        pageSize: typeof req.query.pageSize === "string" ? Number(req.query.pageSize) : undefined,
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      sendLinkError(res, error);
    }
  });

  app.post("/api/admin/blog/links", requireLinkFeature, async (req, res) => {
    try {
      const payload = createLinkSchema.parse(req.body);
      const normalized = normalizeBlogLinkHref(payload.href, {
        publicSiteUrl: getBlogLinkConfig().publicSiteUrl,
      });
      if (payload.kind && payload.kind !== normalized.kind) {
        return res.status(400).json({
          success: false,
          message: `The submitted kind does not match the normalized ${normalized.kind} target`,
        });
      }
      const link = await createManagedBlogLink(payload);
      res.status(201).json({ success: true, data: link });
    } catch (error) {
      sendLinkError(res, error);
    }
  });

  app.get("/api/admin/blog/links/:id", requireLinkFeature, async (req, res) => {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: "Invalid link id" });
    try {
      const detail = await getManagedBlogLinkDetail(id);
      if (!detail) return res.status(404).json({ success: false, message: "Link not found" });
      res.status(200).json({ success: true, data: detail });
    } catch (error) {
      sendLinkError(res, error);
    }
  });

  app.patch("/api/admin/blog/links/:id", requireLinkFeature, async (req, res) => {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: "Invalid link id" });
    try {
      const payload = updateLinkSchema.parse(req.body);
      const link = await updateManagedBlogLink(id, payload);
      if (!link) return res.status(404).json({ success: false, message: "Link not found" });
      res.status(200).json({ success: true, data: link });
    } catch (error) {
      sendLinkError(res, error);
    }
  });

  app.post("/api/admin/blog/links/:id/review", requireLinkFeature, async (req, res) => {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: "Invalid link id" });
    try {
      const payload = reviewLinkSchema.parse(req.body);
      const link = await reviewManagedBlogLink({
        id,
        reviewStatus: payload.reviewStatus,
        reviewedBy: requestIdentity(req),
        reviewNotes: payload.reviewNotes || payload.reason || "",
      });
      if (!link) return res.status(404).json({ success: false, message: "Link not found" });
      res.status(200).json({ success: true, data: link });
    } catch (error) {
      sendLinkError(res, error);
    }
  });

  app.post("/api/admin/blog/links/:id/check", requireLinkFeature, async (req, res) => {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: "Invalid link id" });
    try {
      const result = await auditBlogLinkById(id);
      const detail = await getManagedBlogLinkDetail(id);
      res.status(200).json({ success: true, data: { result, link: detail?.link } });
    } catch (error) {
      sendLinkError(res, error);
    }
  });

  app.get("/api/admin/blog/links/:id/checks", requireLinkFeature, async (req, res) => {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: "Invalid link id" });
    try {
      const detail = await getManagedBlogLinkDetail(id);
      if (!detail) return res.status(404).json({ success: false, message: "Link not found" });
      res.status(200).json({ success: true, data: detail.checks });
    } catch (error) {
      sendLinkError(res, error);
    }
  });

  app.get("/api/admin/blog/links/:id/usages", requireLinkFeature, async (req, res) => {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: "Invalid link id" });
    try {
      const detail = await getManagedBlogLinkDetail(id);
      if (!detail) return res.status(404).json({ success: false, message: "Link not found" });
      res.status(200).json({ success: true, data: detail.usages });
    } catch (error) {
      sendLinkError(res, error);
    }
  });

  app.get("/api/admin/blog/posts/:id/links", requireLinkFeature, async (req, res) => {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: "Invalid post id" });
    try {
      res.status(200).json({ success: true, data: await getBlogPostLinkReport(id) });
    } catch (error) {
      sendLinkError(res, error);
    }
  });

  app.get("/api/admin/blog/posts/:id/link-report", requireLinkFeature, async (req, res) => {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: "Invalid post id" });
    try {
      res.status(200).json({ success: true, data: await getBlogPostLinkReport(id) });
    } catch (error) {
      sendLinkError(res, error);
    }
  });

  app.get("/api/admin/blog/posts/:id/link-opportunities", requireLinkFeature, async (req, res) => {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: "Invalid post id" });
    try {
      res.status(200).json({ success: true, data: await getBlogInternalLinkOpportunities(id) });
    } catch (error) {
      sendLinkError(res, error);
    }
  });

  app.post("/api/admin/blog/posts/:id/links/resync", requireLinkFeature, async (req, res) => {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: "Invalid post id" });
    try {
      const reconciliation = await reconcileStoredBlogPostLinks(id, {
        origin: "server_fix",
        publicSiteUrl: getBlogLinkConfig().publicSiteUrl,
      });
      const report = await getBlogPostLinkReport(id);
      res.status(200).json({ success: true, data: { reconciliation, report } });
    } catch (error) {
      sendLinkError(res, error);
    }
  });

  app.post("/api/admin/blog/posts/:id/links/assert-publish-ready", requireLinkFeature, async (req, res) => {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: "Invalid post id" });
    try {
      res.status(200).json({ success: true, data: await assertBlogPostLinksPublishReady(id) });
    } catch (error) {
      sendLinkError(res, error);
    }
  });

  app.post("/api/admin/blog/link-audits", requireLinkFeature, async (req, res) => {
    try {
      try {
        assertSafeBlogLinkAuditInput(req.body);
      } catch (error) {
        throw Object.assign(error instanceof Error ? error : new Error("Invalid link audit input"), {
          statusCode: 400,
        });
      }
      const payload = auditRunSchema.parse(req.body);
      const idempotencyKey = payload.idempotencyKey
        || (typeof req.header("Idempotency-Key") === "string" ? req.header("Idempotency-Key")! : randomUUID());
      const result = await createBlogLinkAuditRun({
        idempotencyKey,
        linkIds: Array.from(new Set(payload.linkIds)),
        requestedBy: requestIdentity(req),
      });
      if (shouldProcessBlogLinkAuditRun(result.created, result.run.status)) {
        void processBlogLinkAuditRun(result.run.id)
          .catch(error => console.error(`Unhandled blog link audit ${result.run.id}:`, error));
      }
      res.status(result.created ? 202 : 200).json({
        success: true,
        data: publicBlogLinkAuditRun(result.run),
        created: result.created,
      });
    } catch (error) {
      sendLinkError(res, error);
    }
  });

  app.get("/api/admin/blog/link-audits/:id", requireLinkFeature, async (req, res) => {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: "Invalid audit run id" });
    try {
      const run = await getBlogLinkAuditRun(id);
      if (!run) return res.status(404).json({ success: false, message: "Audit run not found" });
      res.status(200).json({ success: true, data: publicBlogLinkAuditRun(run) });
    } catch (error) {
      sendLinkError(res, error);
    }
  });

  if (!getBlogLinkConfig().enabled) return;

  void markStaleBlogLinkAuditRunsInterrupted()
    .catch(error => console.error("Could not recover stale blog link audits:", error));
  const recoveryTimer = setInterval(() => {
    void markStaleBlogLinkAuditRunsInterrupted()
      .catch(error => console.error("Could not recover stale blog link audits:", error));
  }, 60_000);
  recoveryTimer.unref();
}
