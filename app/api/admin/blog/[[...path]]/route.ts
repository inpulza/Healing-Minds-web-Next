import { after, NextRequest, NextResponse } from "next/server";
import { getAdminSession, noStoreHeaders } from "../../../../../server/next-admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ path?: string[] }> };

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: noStoreHeaders });
}

function language(value: string | null): "en" | "es" | undefined {
  return value === "en" || value === "es" ? value : undefined;
}

export async function GET(request: NextRequest, context: RouteContext) {
  if (!getAdminSession(request)) {
    return json({ success: false, message: "Admin login required" }, 401);
  }

  const segments = (await context.params).path || [];
  if (segments[0] === "images" && segments[1] === "config") {
    return json({
      success: true,
      data: {
        enabled: process.env.BLOG_IMAGE_ENABLED === "true" && Boolean(process.env.OPENAI_API_KEY),
        model: process.env.BLOG_IMAGE_MODEL?.trim() || "gpt-image-2",
        storage: process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID ? "vercel-blob" : "not-configured",
      },
    });
  }
  if (segments[0] === "links" && segments[1] === "config") {
    const config = await import("../../../../../server/blog/links/config");
    return json({
      success: true,
      data: {
        ...config.getSafeBlogLinkConfigSummary(config.getBlogLinkConfig()),
        policy: {
          policyVersion: config.BLOG_LINK_POLICY_VERSION,
          scoreVersion: config.BLOG_LINK_SCORE_VERSION,
          thresholds: config.BLOG_LINK_SCORE_THRESHOLDS,
        },
      },
    });
  }

  if (!process.env.DATABASE_URL) {
    return json({ success: false, message: "Blog database is not configured" }, 503);
  }

  try {
    const storage = await import("../../../../../server/blog/storage");
    if (["links", "link-sources", "link-audits"].includes(segments[0]) || (segments[0] === "posts" && segments[2]?.startsWith("link"))) {
      const config = await import("../../../../../server/blog/links/config");
      if (!config.getBlogLinkConfig().enabled) {
        return json({
          success: false,
          message: "Link Intelligence is disabled. Apply the migration, seed and backfill before enabling BLOG_LINK_ENABLED.",
        }, 503);
      }
      const service = await import("../../../../../server/blog/links/service");
      if (segments.length === 2 && segments[0] === "links" && segments[1] === "summary") {
        return json({ success: true, data: await service.getBlogLinkSummary() });
      }
      if (segments.length === 1 && segments[0] === "link-sources") {
        return json({ success: true, data: await service.listManagedBlogLinkSources() });
      }
      if (segments.length === 1 && segments[0] === "links") {
        const query = request.nextUrl.searchParams;
        const routes = await import("../../../../../server/blog/links/routes");
        const reviewStatus = routes.reviewStatusSchema.safeParse(query.get("reviewStatus"));
        const healthStatus = routes.healthStatusSchema.safeParse(query.get("healthStatus"));
        const kind = query.get("kind");
        const language = query.get("language");
        return json({ success: true, data: await service.listManagedBlogLinks({
          kind: kind === "internal" || kind === "external" ? kind : undefined,
          language: language === "en" || language === "es" || language === "all" ? language : undefined,
          reviewStatus: reviewStatus.success ? reviewStatus.data : undefined,
          healthStatus: healthStatus.success ? healthStatus.data : undefined,
          generationEligible: query.get("generationEligible") === "true" ? true : query.get("generationEligible") === "false" ? false : undefined,
          sourceId: Number(query.get("sourceId")) || undefined,
          categoryKey: query.get("categoryKey")?.slice(0, 120),
          contentPillar: query.get("contentPillar")?.slice(0, 120),
          search: query.get("search")?.slice(0, 255),
          page: Number(query.get("page")) || undefined,
          pageSize: Number(query.get("pageSize")) || undefined,
        }) });
      }
      if (segments.length >= 2 && segments[0] === "links") {
        const linkId = Number(segments[1]);
        if (!Number.isInteger(linkId) || linkId <= 0) return json({ success: false, message: "Invalid link id" }, 400);
        const detail = await service.getManagedBlogLinkDetail(linkId);
        if (!detail) return json({ success: false, message: "Link not found" }, 404);
        if (segments.length === 3 && segments[2] === "checks") return json({ success: true, data: detail.checks });
        if (segments.length === 3 && segments[2] === "usages") return json({ success: true, data: detail.usages });
        if (segments.length === 2) return json({ success: true, data: detail });
      }
      if (segments.length === 3 && segments[0] === "posts") {
        const postId = Number(segments[1]);
        if (!Number.isInteger(postId) || postId <= 0) return json({ success: false, message: "Invalid post id" }, 400);
        if (segments[2] === "links" || segments[2] === "link-report") {
          return json({ success: true, data: await service.getBlogPostLinkReport(postId) });
        }
        if (segments[2] === "link-opportunities") {
          return json({ success: true, data: await service.getBlogInternalLinkOpportunities(postId) });
        }
      }
      if (segments.length === 2 && segments[0] === "link-audits") {
        const auditId = Number(segments[1]);
        if (!Number.isInteger(auditId) || auditId <= 0) return json({ success: false, message: "Invalid audit run id" }, 400);
        const [audit, routes] = await Promise.all([
          import("../../../../../server/blog/links/audit"),
          import("../../../../../server/blog/links/routes"),
        ]);
        const run = await audit.getBlogLinkAuditRun(auditId);
        return run ? json({ success: true, data: routes.publicBlogLinkAuditRun(run) }) : json({ success: false, message: "Audit run not found" }, 404);
      }
    }
    if (segments.length === 2 && segments[0] === "generation-runs" && segments[1] === "by-key") {
      const key = request.nextUrl.searchParams.get("key")?.trim() || "";
      if (!/^[A-Za-z0-9._:-]{8,255}$/.test(key)) return json({ success: false, message: "Invalid idempotency key" }, 400);
      const generation = await import("../../../../../server/blog/generation/storage");
      const run = await generation.getBlogGenerationRunByIdempotencyKey(key);
      return run ? json({ success: true, data: run }) : json({ success: false, message: "Generation run not found" }, 404);
    }
    if (segments.length === 2 && segments[0] === "generation-runs") {
      const runId = Number(segments[1]);
      if (!Number.isInteger(runId) || runId <= 0) return json({ success: false, message: "Invalid generation run id" }, 400);
      const generation = await import("../../../../../server/blog/generation/storage");
      const run = await generation.getBlogGenerationRun(runId);
      return run ? json({ success: true, data: run }) : json({ success: false, message: "Generation run not found" }, 404);
    }
    if (segments.length === 3 && segments[0] === "generation-runs" && segments[2] === "events") {
      const runId = Number(segments[1]);
      if (!Number.isInteger(runId) || runId <= 0) return json({ success: false, message: "Invalid generation run id" }, 400);
      const [generation, admin] = await Promise.all([
        import("../../../../../server/blog/generation/storage"),
        import("../../../../../server/blog/admin-routes"),
      ]);
      const initialRun = await generation.getBlogGenerationRun(runId);
      if (!initialRun) return json({ success: false, message: "Generation run not found" }, 404);
      if (initialRun.status === "queued") after(() => admin.executePersistedAutoGenerateRun(initialRun.id));
      const encoder = new TextEncoder();
      let cancelled = false;
      const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
          let afterId = Number(request.headers.get("last-event-id") || 0) || 0;
          let terminalSent = false;
          try {
            while (!cancelled && !terminalSent) {
              const events = await generation.listBlogGenerationEvents(runId, { afterId });
              for (const event of events) {
                afterId = event.id;
                controller.enqueue(encoder.encode(`id: ${event.id}\nevent: ${event.eventType}\ndata: ${JSON.stringify(event.payload)}\n\n`));
                if (["complete", "failed", "interrupted"].includes(event.eventType)) terminalSent = true;
              }
              const run = await generation.getBlogGenerationRun(runId);
              if (!run) {
                controller.enqueue(encoder.encode(`event: failed\ndata: ${JSON.stringify({ message: "Generation run no longer exists" })}\n\n`));
                terminalSent = true;
              } else if (!terminalSent && ["completed", "failed", "interrupted"].includes(run.status)) {
                const eventType = run.status === "completed" ? "complete" : run.status;
                const payload = run.result || {
                  success: false,
                  message: run.status === "interrupted" ? "Generation was interrupted" : "Generation failed",
                  workflow: run.workflow,
                  postId: run.postId,
                  partialSuccess: Boolean(run.postId),
                };
                controller.enqueue(encoder.encode(`event: ${eventType}\ndata: ${JSON.stringify(payload)}\n\n`));
                terminalSent = true;
              }
              if (!terminalSent) {
                controller.enqueue(encoder.encode(`: heartbeat ${Date.now()}\n\n`));
                await new Promise(resolve => setTimeout(resolve, 500));
              }
            }
          } catch {
            controller.enqueue(encoder.encode(`event: failed\ndata: ${JSON.stringify({ message: "Could not read generation progress" })}\n\n`));
          } finally {
            controller.close();
          }
        },
        cancel() { cancelled = true; },
      });
      return new NextResponse(stream, {
        headers: {
          ...noStoreHeaders,
          "Content-Type": "text/event-stream",
          "Connection": "keep-alive",
          "X-Accel-Buffering": "no",
        },
      });
    }
    if (segments.length === 1 && segments[0] === "stats") {
      return json({ success: true, data: await storage.getBlogStats() });
    }
    if (segments.length === 1 && segments[0] === "authors") {
      return json({ success: true, data: await storage.getBlogAuthors() });
    }
    if (segments.length === 1 && segments[0] === "categories") {
      return json({ success: true, data: await storage.getBlogCategories(language(request.nextUrl.searchParams.get("language"))) });
    }
    if (segments.length === 1 && segments[0] === "tags") {
      return json({ success: true, data: await storage.getBlogTags(language(request.nextUrl.searchParams.get("language"))) });
    }
    if (segments.length === 1 && segments[0] === "posts") {
      const rawStatus = request.nextUrl.searchParams.get("status");
      const status = rawStatus === "draft" || rawStatus === "pending_review" || rawStatus === "published" || rawStatus === "rejected"
        ? rawStatus
        : "all";
      const rawLanguage = request.nextUrl.searchParams.get("language");
      const requestedLanguage = rawLanguage === "en" || rawLanguage === "es" ? rawLanguage : "all";
      return json({
        success: true,
        data: await storage.getAdminBlogPosts({
          status,
          language: requestedLanguage,
          search: request.nextUrl.searchParams.get("search")?.trim() || undefined,
        }),
      });
    }
    if (segments.length === 3 && segments[0] === "posts" && segments[2] === "images") {
      const postId = Number(segments[1]);
      if (!Number.isInteger(postId) || postId <= 0) return json({ success: false, message: "Invalid blog post id" }, 400);
      const [post, images] = await Promise.all([
        storage.getBlogPostById(postId),
        import("../../../../../server/blog/images/storage"),
      ]);
      if (!post) return json({ success: false, message: "Blog post not found" }, 404);
      if (post.status === "draft") await images.ensureCuratedHeroImage(post);
      return json({ success: true, data: await images.listBlogPostImages(postId) });
    }
    if (segments.length === 3 && segments[0] === "posts" && segments[2] === "verify") {
      const postId = Number(segments[1]);
      if (!Number.isInteger(postId) || postId <= 0) return json({ success: false, message: "Invalid post id" }, 400);
      const post = await storage.getBlogPostById(postId);
      if (!post) return json({ success: false, message: "Blog post not found" }, 404);
      const [{ buildBlogVerificationReport }, linkRuntime, linkStorage, linkService] = await Promise.all([
        import("../../../../../server/blog/verification"),
        import("../../../../../server/blog/links/runtime"),
        import("../../../../../server/blog/links/storage"),
        import("../../../../../server/blog/links/service"),
      ]);
      let linkReport;
      if (linkRuntime.isBlogLinkRuntimeEnabled()) {
        const { getBlogLinkConfig } = await import("../../../../../server/blog/links/config");
        await linkStorage.reconcileStoredBlogPostLinks(post.id, {
          origin: "manual",
          publicSiteUrl: getBlogLinkConfig().publicSiteUrl,
        });
        linkReport = await linkService.getBlogPostLinkReport(post.id);
      }
      return json({ success: true, data: buildBlogVerificationReport(post), linkReport });
    }
    if (segments.length === 3 && segments[0] === "posts" && segments[2] === "unpublish-impact") {
      const postId = Number(segments[1]);
      if (!Number.isInteger(postId) || postId <= 0) return json({ success: false, message: "Invalid post id" }, 400);
      const post = await storage.getBlogPostById(postId);
      if (!post) return json({ success: false, message: "Blog post not found" }, 404);
      const linkingPosts = post.status === "published" ? await storage.findPublishedPostsLinkingToPost(post) : [];
      return json({
        success: true,
        data: {
          postId: post.id,
          slug: post.slug,
          status: post.status,
          publicPath: storage.getBlogPostPath(post),
          linkingPosts,
          linkingPostCount: linkingPosts.length,
        },
      });
    }
    if (segments.length === 2 && segments[0] === "posts") {
      const id = Number(segments[1]);
      if (!Number.isInteger(id) || id <= 0) return json({ success: false, message: "Invalid post id" }, 400);
      const post = await storage.getBlogPostById(id);
      return post
        ? json({ success: true, data: post })
        : json({ success: false, message: "Blog post not found" }, 404);
    }
    return json({ success: false, message: "Admin blog endpoint not found" }, 404);
  } catch {
    return json({ success: false, message: "Blog admin request failed" }, 500);
  }
}

async function requireWriteAccess(request: NextRequest) {
  if (!getAdminSession(request)) return json({ success: false, message: "Admin login required" }, 401);
  if (!process.env.DATABASE_URL) return json({ success: false, message: "Blog database is not configured" }, 503);
  return null;
}

function requestError(error: unknown) {
  const value = error as { statusCode?: number; message?: string; issues?: Array<{ path: PropertyKey[]; message: string }> };
  if (Array.isArray(value.issues)) {
    return json({
      success: false,
      message: "Invalid blog payload",
      errors: value.issues.map(issue => ({ path: issue.path.join("."), message: issue.message })),
    }, 400);
  }
  const status = value.statusCode && value.statusCode >= 400 && value.statusCode < 600 ? value.statusCode : 500;
  return json({ success: false, message: status === 500 ? "Blog admin request failed" : value.message || "Invalid blog request" }, status);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const denied = await requireWriteAccess(request);
  if (denied) return denied;
  const segments = (await context.params).path || [];
  try {
    const body = await request.json().catch(() => ({}));
    const [storage, validation, sanitizer, verification] = await Promise.all([
      import("../../../../../server/blog/storage"),
      import("../../../../../server/blog/admin-validation"),
      import("../../../../../server/blog/sanitize"),
      import("../../../../../server/blog/verification"),
    ]);
    if (["links", "link-sources", "link-audits"].includes(segments[0]) || (segments[0] === "posts" && segments[2] === "links")) {
      const config = await import("../../../../../server/blog/links/config");
      if (!config.getBlogLinkConfig().enabled) {
        return json({ success: false, message: "Link Intelligence is disabled. Apply the migration, seed and backfill before enabling BLOG_LINK_ENABLED." }, 503);
      }
      const [routes, service] = await Promise.all([
        import("../../../../../server/blog/links/routes"),
        import("../../../../../server/blog/links/service"),
      ]);
      if (segments.length === 1 && segments[0] === "links") {
        const payload = routes.createLinkSchema.parse(body);
        const { normalizeBlogLinkHref } = await import("../../../../../server/blog/links/normalization");
        const normalized = normalizeBlogLinkHref(payload.href, { publicSiteUrl: config.getBlogLinkConfig().publicSiteUrl });
        if (payload.kind && payload.kind !== normalized.kind) {
          return json({ success: false, message: `The submitted kind does not match the normalized ${normalized.kind} target` }, 400);
        }
        return json({ success: true, data: await service.createManagedBlogLink(payload) }, 201);
      }
      if (segments.length === 3 && segments[0] === "link-sources" && segments[2] === "review") {
        const sourceId = Number(segments[1]);
        if (!Number.isInteger(sourceId) || sourceId <= 0) return json({ success: false, message: "Invalid link source id" }, 400);
        const payload = routes.reviewSourceSchema.parse(body);
        const source = await service.reviewManagedBlogLinkSource({ id: sourceId, ...payload, reviewedBy: "blog-admin" });
        return source ? json({ success: true, data: source }) : json({ success: false, message: "Link source not found" }, 404);
      }
      if (segments.length === 3 && segments[0] === "links" && segments[2] === "review") {
        const linkId = Number(segments[1]);
        if (!Number.isInteger(linkId) || linkId <= 0) return json({ success: false, message: "Invalid link id" }, 400);
        const payload = routes.reviewLinkSchema.parse(body);
        const link = await service.reviewManagedBlogLink({
          id: linkId,
          reviewStatus: payload.reviewStatus,
          reviewedBy: "blog-admin",
          reviewNotes: payload.reviewNotes || payload.reason || "",
        });
        return link ? json({ success: true, data: link }) : json({ success: false, message: "Link not found" }, 404);
      }
      if (segments.length === 3 && segments[0] === "links" && segments[2] === "check") {
        const linkId = Number(segments[1]);
        if (!Number.isInteger(linkId) || linkId <= 0) return json({ success: false, message: "Invalid link id" }, 400);
        const audit = await import("../../../../../server/blog/links/audit");
        const result = await audit.auditBlogLinkById(linkId);
        const detail = await service.getManagedBlogLinkDetail(linkId);
        return json({ success: true, data: { result, link: detail?.link } });
      }
      if (segments.length === 4 && segments[0] === "posts" && segments[2] === "links") {
        const postId = Number(segments[1]);
        if (!Number.isInteger(postId) || postId <= 0) return json({ success: false, message: "Invalid post id" }, 400);
        if (segments[3] === "resync") {
          const linksStorage = await import("../../../../../server/blog/links/storage");
          const reconciliation = await linksStorage.reconcileStoredBlogPostLinks(postId, {
            origin: "server_fix",
            publicSiteUrl: config.getBlogLinkConfig().publicSiteUrl,
          });
          return json({ success: true, data: { reconciliation, report: await service.getBlogPostLinkReport(postId) } });
        }
        if (segments[3] === "assert-publish-ready") {
          return json({ success: true, data: await service.assertBlogPostLinksPublishReady(postId) });
        }
      }
      if (segments.length === 1 && segments[0] === "link-audits") {
        const audit = await import("../../../../../server/blog/links/audit");
        const policy = await import("../../../../../server/blog/links/policy");
        policy.assertSafeBlogLinkAuditInput(body);
        const payload = routes.auditRunSchema.parse(body);
        const result = await audit.createBlogLinkAuditRun({
          idempotencyKey: payload.idempotencyKey || request.headers.get("idempotency-key") || crypto.randomUUID(),
          linkIds: Array.from(new Set(payload.linkIds)),
          requestedBy: "blog-admin",
        });
        if (policy.shouldProcessBlogLinkAuditRun(result.created, result.run.status)) {
          after(() => audit.processBlogLinkAuditRun(result.run.id));
        }
        return json({ success: true, data: routes.publicBlogLinkAuditRun(result.run), created: result.created }, result.created ? 202 : 200);
      }
    }
    if (segments.length === 1 && segments[0] === "generation-runs") {
      const payload = validation.adminBlogAutoGenerateSchema.parse(body);
      const idempotencyKey = request.headers.get("idempotency-key")?.trim() || "";
      if (!/^[A-Za-z0-9._:-]{8,255}$/.test(idempotencyKey)) {
        return json({ success: false, message: "A valid Idempotency-Key header is required" }, 400);
      }
      const [generation, admin, generator, responses, { checkBlogAiRateLimit }] = await Promise.all([
        import("../../../../../server/blog/generation/storage"),
        import("../../../../../server/blog/admin-routes"),
        import("../../../../../server/blog/ai/generator"),
        import("../../../../../server/blog/ai/responses-client"),
        import("../../../../../server/blog/ai/rate-limit"),
      ]);
      const existing = await generation.getBlogGenerationRunByIdempotencyKey(idempotencyKey);
      if (existing) {
        if (existing.status === "queued") after(() => admin.executePersistedAutoGenerateRun(existing.id));
        return json({
          success: true,
          data: {
            runId: existing.id,
            status: existing.status,
            workflow: existing.workflow || admin.createAutoGenerateWorkflow(),
          },
        });
      }
      const openRun = await generation.getOpenBlogGenerationRun();
      if (openRun) {
        return json({
          success: false,
          message: `Generation run ${openRun.id} is already ${openRun.status}. Reopen it instead of creating another draft.`,
          workflow: openRun.workflow || undefined,
          runId: openRun.id,
        }, 409);
      }
      generator.assertBlogAiGenerationConfigured();
      responses.assertBlogTopicGenerationConfigured();
      const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
      const rateLimit = checkBlogAiRateLimit(forwardedFor || "admin");
      if (!rateLimit.allowed) {
        const response = json({ success: false, message: "Blog AI generation rate limit reached" }, 429);
        if (rateLimit.retryAfterSec) response.headers.set("Retry-After", String(rateLimit.retryAfterSec));
        return response;
      }
      const workflow = admin.createAutoGenerateWorkflow();
      const run = await generation.createBlogGenerationRun({
        idempotencyKey,
        input: JSON.parse(JSON.stringify(payload)),
        workflow: JSON.parse(JSON.stringify(workflow)),
      });
      await generation.appendBlogGenerationEvent({
        runId: run.id,
        eventType: "progress",
        payload: JSON.parse(JSON.stringify({ runId: run.id, workflow })),
      });
      const queued = await generation.queuePreparedBlogGenerationRun(run.id, JSON.parse(JSON.stringify(workflow)));
      if (!queued) throw new Error("Generation run could not be queued");
      after(() => admin.executePersistedAutoGenerateRun(run.id));
      return json({ success: true, data: { runId: run.id, status: "queued", workflow } }, 202);
    }
    if (segments.length === 1 && segments[0] === "topic-plan") {
      const payload = validation.adminBlogTopicPlannerSchema.parse(body);
      const [responses, { checkBlogAiRateLimit }, planner, generation] = await Promise.all([
        import("../../../../../server/blog/ai/responses-client"),
        import("../../../../../server/blog/ai/rate-limit"),
        import("../../../../../server/blog/ai/topic-planner"),
        import("../../../../../server/blog/generation/storage"),
      ]);
      responses.assertBlogTopicGenerationConfigured();
      const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
      const rateLimit = checkBlogAiRateLimit(forwardedFor || "admin");
      if (!rateLimit.allowed) {
        const response = json({ success: false, message: "Blog AI generation rate limit reached" }, 429);
        if (rateLimit.retryAfterSec) response.headers.set("Retry-After", String(rateLimit.retryAfterSec));
        return response;
      }
      const [categories, tags, openRun] = await Promise.all([
        storage.getBlogCategories(payload.language),
        storage.getBlogTags(payload.language),
        generation.getOpenBlogGenerationRun(),
      ]);
      if (openRun) {
        return json({
          success: false,
          message: `Generation run ${openRun.id} is already ${openRun.status}. Finish or recover it before planning another topic.`,
          runId: openRun.id,
        }, 409);
      }
      const workflow = { mode: "topic-plan", generatedAt: new Date().toISOString(), language: payload.language };
      const run = await generation.createBlogGenerationRun({
        idempotencyKey: `topic-plan:${crypto.randomUUID()}`,
        input: JSON.parse(JSON.stringify({ mode: "topic-plan", language: payload.language })),
        workflow: JSON.parse(JSON.stringify(workflow)),
      });
      try {
        const plan = await planner.buildBlogTopicPlan({ language: payload.language, categories, tags, runId: run.id });
        const completed = await generation.completeBlogPlanningRun(run.id, {
          workflow: JSON.parse(JSON.stringify(workflow)),
          result: JSON.parse(JSON.stringify(plan)),
        });
        if (!completed) throw Object.assign(new Error("The durable topic plan could not be completed"), { statusCode: 409 });
        return json({ success: true, data: plan });
      } catch (error) {
        await generation.failBlogGenerationRun(run.id, {
          error: error instanceof Error ? error.message : "Topic planning failed",
          result: { success: false, mode: "topic-plan" },
        }).catch(() => undefined);
        throw error;
      }
    }
    if (segments.length === 1 && segments[0] === "generate-draft") {
      const requestedPayload = validation.adminBlogGenerateDraftSchema.parse(body);
      let payload = requestedPayload;
      let claimedPlanningRun: Awaited<ReturnType<typeof import("../../../../../server/blog/generation/storage").claimCompletedBlogPlanningRun>> | undefined;
      let topicCandidateSelection: { runId: number; candidateKey: string } | undefined;
      if (requestedPayload.topicCandidateId) {
        const [candidates, planned, strategy] = await Promise.all([
          import("../../../../../server/blog/topic-candidate-storage"),
          import("../../../../../server/blog/ai/planned-topic-provenance"),
          import("../../../../../server/blog/strategy/healing-minds"),
        ]);
        const candidate = await candidates.getBlogTopicCandidateById(requestedPayload.topicCandidateId);
        if (!candidate || candidate.recommendation !== "recommended" || candidate.strategyVersion !== strategy.HEALING_MINDS_TOPIC_STRATEGY_VERSION) {
          throw Object.assign(new Error("The selected topic candidate is no longer eligible. Plan topics again."), { statusCode: 409 });
        }
        payload = { ...requestedPayload, ...planned.buildPersistedTopicDraftOverrides(candidate) };
        topicCandidateSelection = { runId: candidate.runId, candidateKey: candidate.candidateKey };
      }
      const [{ containsLikelyPatientIdentifierInAiFields }, generator, { checkBlogAiRateLimit }, planner, topic, strategy, admin] = await Promise.all([
        import("../../../../../server/blog/privacy"),
        import("../../../../../server/blog/ai/generator"),
        import("../../../../../server/blog/ai/rate-limit"),
        import("../../../../../server/blog/ai/topic-planner"),
        import("../../../../../server/blog/ai/topic-normalization"),
        import("../../../../../server/blog/strategy/healing-minds"),
        import("../../../../../server/blog/admin-routes"),
      ]);
      if (containsLikelyPatientIdentifierInAiFields(payload)) {
        return json({
          success: false,
          message: "AI generation inputs must not include patient/name markers or patient-identifying information. Rephrase public topics without patient/paciente/name/nombre.",
        }, 400);
      }
      generator.assertBlogAiGenerationConfigured();
      const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
      const rateLimit = checkBlogAiRateLimit(forwardedFor || "admin");
      if (!rateLimit.allowed) {
        const response = json({ success: false, message: "Blog AI generation rate limit reached" }, 429);
        if (rateLimit.retryAfterSec) response.headers.set("Retry-After", String(rateLimit.retryAfterSec));
        return response;
      }
      await planner.assertGuidedBlogTopicSafe({
        topic: payload.topic,
        targetKeyword: payload.targetKeyword,
        additionalContext: payload.additionalContext,
        language: payload.language,
      });
      if (topicCandidateSelection) {
        const [candidates, generation] = await Promise.all([
          import("../../../../../server/blog/topic-candidate-storage"),
          import("../../../../../server/blog/generation/storage"),
        ]);
        const selected = await candidates.selectBlogTopicCandidate(
          topicCandidateSelection.runId,
          topicCandidateSelection.candidateKey,
        );
        claimedPlanningRun = await generation.claimCompletedBlogPlanningRun(selected.runId);
        if (!claimedPlanningRun) {
          throw Object.assign(new Error("This topic plan was already used or is no longer available. Plan topics again."), { statusCode: 409 });
        }
      }
      try {
        const result = await admin.createGeneratedBlogDraft({
          ...payload,
          topicKey: topic.buildTopicKey(`${payload.topic} ${payload.targetKeyword || ""}`, payload.language),
          expertiseAngle: payload.additionalContext || undefined,
          topicStrategyVersion: payload.topicStrategyVersion || strategy.HEALING_MINDS_TOPIC_STRATEGY_VERSION,
        }, undefined, undefined, claimedPlanningRun?.id, topicCandidateSelection ? payload.expertiseAngle : undefined);
        if (claimedPlanningRun) {
          const generation = await import("../../../../../server/blog/generation/storage");
          const completed = await generation.completeBlogGenerationRun(claimedPlanningRun.id, {
            postId: result.data.id,
            result: JSON.parse(JSON.stringify({ success: true, ...result, topicPlan: claimedPlanningRun.result })),
          });
          if (!completed) {
            throw Object.assign(new Error("The generated draft was saved, but its planning run could not be finalized"), {
              statusCode: 409,
            });
          }
        }
        return json({ success: true, ...result }, 201);
      } catch (error) {
        if (claimedPlanningRun) {
          const generation = await import("../../../../../server/blog/generation/storage");
          await generation.failBlogGenerationRun(claimedPlanningRun.id, {
            error: error instanceof Error ? error.message : "Guided draft generation failed",
            result: { success: false },
          }).catch(() => undefined);
        }
        throw error;
      }
    }
    if (segments.length === 1 && segments[0] === "posts") {
      const parsed = validation.adminBlogPostSchema.parse(body);
      if (parsed.status === "published") return json({ success: false, message: "Use the publish action to publish a post" }, 400);
      const content = sanitizer.sanitizeBlogContentHtml(parsed.content);
      const post = await storage.createBlogPost({
        ...parsed,
        content,
        readingTime: parsed.readingTime || sanitizer.estimateReadingTime(content),
        publishedAt: null,
      });
      return json({
        success: true,
        data: post,
        checks: validation.validatePostForPublish(post),
        verification: verification.buildBlogVerificationReport(post),
      }, 201);
    }
    if (segments.length === 1 && segments[0] === "categories") {
      return json({ success: true, data: await storage.createBlogCategory(validation.adminBlogCategorySchema.parse(body)) }, 201);
    }
    if (segments.length === 1 && segments[0] === "tags") {
      return json({ success: true, data: await storage.createBlogTag(validation.adminBlogTagSchema.parse(body)) }, 201);
    }
    if (segments.length === 3 && segments[0] === "posts" && segments[2] === "seo-check") {
      const postId = Number(segments[1]);
      if (!Number.isInteger(postId) || postId <= 0) return json({ success: false, message: "Invalid post id" }, 400);
      const post = await storage.getBlogPostById(postId);
      if (!post) return json({ success: false, message: "Blog post not found" }, 404);
      if (post.status !== "published") return json({ success: false, message: "SEO check requires a published post" }, 400);
      const { runSeoPublishingCheck } = await import("../../../../../server/seo/publishing");
      const result = await runSeoPublishingCheck(storage.getBlogPostPath(post), {
        skipSearchConsole: request.nextUrl.searchParams.get("google") === "false",
      });
      return json({ success: true, data: result });
    }
    if (segments.length === 3 && segments[0] === "posts" && segments[2] === "fix") {
      const postId = Number(segments[1]);
      if (!Number.isInteger(postId) || postId <= 0) return json({ success: false, message: "Invalid post id" }, 400);
      const { fixType } = validation.adminBlogFixSchema.parse(body);
      const post = await storage.getBlogPostById(postId);
      if (!post) return json({ success: false, message: "Blog post not found" }, 404);
      const { applyDeterministicBlogFix } = await import("../../../../../server/blog/content-fixes");
      const result = await applyDeterministicBlogFix(post, fixType);
      if (!result.success) return json({ success: false, message: result.message, data: result }, 400);
      return json({
        success: true,
        data: {
          result,
          post: result.post,
          verification: result.verification,
          checks: result.post ? validation.validatePostForPublish(result.post) : validation.validatePostForPublish(post),
        },
      });
    }
    if (segments[0] === "posts" && segments[2] === "images") {
      const postId = Number(segments[1]);
      if (!Number.isInteger(postId) || postId <= 0) return json({ success: false, message: "Invalid blog post id" }, 400);
      const post = await storage.getBlogPostById(postId);
      if (!post) return json({ success: false, message: "Blog post not found" }, 404);
      if (post.status !== "draft") return json({ success: false, message: "Blog image changes are allowed only while the post is a draft" }, 409);
      const [imageConfig, imageService, images] = await Promise.all([
        import("../../../../../server/blog/images/config"),
        import("../../../../../server/blog/images/service"),
        import("../../../../../server/blog/images/storage"),
      ]);
      if (segments.length === 4 && segments[3] === "generate") {
        imageConfig.assertBlogImageConfigured();
        const role = body?.role === "hero" || body?.role === "inline" ? body.role : "all";
        const maxInline = body?.maxInline === undefined ? undefined : Number(body.maxInline);
        if (maxInline !== undefined && (!Number.isInteger(maxInline) || maxInline < 1 || maxInline > 2)) {
          return json({ success: false, message: "maxInline must be 1 or 2" }, 400);
        }
        return json({ success: true, data: await imageService.generateBlogImageSet(post, { role, maxInline }) }, 201);
      }
      const imageId = Number(segments[3]);
      if (segments.length !== 5 || !Number.isInteger(imageId) || imageId <= 0) return json({ success: false, message: "Invalid blog image endpoint" }, 400);
      const image = await images.getBlogPostImage(imageId);
      if (!image || image.postId !== postId) return json({ success: false, message: "Blog image variant not found" }, 404);
      if (segments[4] === "regenerate") {
        imageConfig.assertBlogImageConfigured();
        return json({ success: true, data: await imageService.regenerateBlogImageVariant(post, imageId) }, 201);
      }
      if (segments[4] === "select") {
        const selected = await images.selectBlogPostImage(postId, imageId);
        return selected
          ? json({ success: true, data: selected })
          : json({ success: false, message: "Only completed image variants can be selected" }, 409);
      }
      if (segments[4] === "deselect") {
        const deselected = await images.deselectInlineBlogPostImage(postId, imageId);
        return deselected
          ? json({ success: true, data: deselected })
          : json({ success: false, message: "Only a selected inline image on a draft can be removed from its slot" }, 409);
      }
    }
    return json({ success: false, message: "Admin blog write endpoint not found" }, 404);
  } catch (error) {
    return requestError(error);
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const denied = await requireWriteAccess(request);
  if (denied) return denied;
  const segments = (await context.params).path || [];
  const id = segments[0] === "posts" ? Number(segments[1]) : NaN;
  if (segments.length !== 2 || !Number.isInteger(id) || id <= 0) return json({ success: false, message: "Invalid post id" }, 400);
  try {
    const body = await request.json();
    if (body && typeof body === "object" && "status" in body) return json({ success: false, message: "Use the status action to change a post status" }, 400);
    const [storage, validation, sanitizer, verification] = await Promise.all([
      import("../../../../../server/blog/storage"),
      import("../../../../../server/blog/admin-validation"),
      import("../../../../../server/blog/sanitize"),
      import("../../../../../server/blog/verification"),
    ]);
    const parsed = validation.adminBlogPostUpdateSchema.parse(body);
    const existing = await storage.getBlogPostById(id);
    if (!existing) return json({ success: false, message: "Blog post not found" }, 404);
    if (existing.status === "published" && ["content", "slug", "language", "title"].some(key => Object.hasOwn(parsed, key))) {
      return json({ success: false, message: "Move the published post to draft before changing content, title, slug, or language." }, 409);
    }
    const { content: rawContent, ...rest } = parsed;
    const content = typeof rawContent === "string" ? sanitizer.sanitizeBlogContentHtml(rawContent) : undefined;
    const payload = content === undefined ? rest : {
      ...rest,
      content,
      readingTime: rest.readingTime || sanitizer.estimateReadingTime(content),
    };
    const post = await storage.updateBlogPost(id, payload, {
      expectedStatus: existing.status,
      expectedUpdatedAt: existing.updatedAt,
    });
    if (!post) return json({ success: false, message: "Blog post not found" }, 404);
    return json({
      success: true,
      data: post,
      checks: validation.validatePostForPublish(post),
      verification: verification.buildBlogVerificationReport(post),
    });
  } catch (error) {
    return requestError(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const denied = await requireWriteAccess(request);
  if (denied) return denied;
  const segments = (await context.params).path || [];
  if (segments.length === 2 && segments[0] === "links") {
    const linkId = Number(segments[1]);
    if (!Number.isInteger(linkId) || linkId <= 0) return json({ success: false, message: "Invalid link id" }, 400);
    try {
      const [config, routes, service] = await Promise.all([
        import("../../../../../server/blog/links/config"),
        import("../../../../../server/blog/links/routes"),
        import("../../../../../server/blog/links/service"),
      ]);
      if (!config.getBlogLinkConfig().enabled) {
        return json({ success: false, message: "Link Intelligence is disabled. Apply the migration, seed and backfill before enabling BLOG_LINK_ENABLED." }, 503);
      }
      const link = await service.updateManagedBlogLink(linkId, routes.updateLinkSchema.parse(await request.json()));
      return link ? json({ success: true, data: link }) : json({ success: false, message: "Link not found" }, 404);
    } catch (error) {
      return requestError(error);
    }
  }
  const id = segments[0] === "posts" ? Number(segments[1]) : NaN;
  if (segments.length !== 3 || segments[2] !== "status" || !Number.isInteger(id) || id <= 0) {
    return json({ success: false, message: "Invalid status endpoint" }, 400);
  }
  try {
    const [storage, validation, verification] = await Promise.all([
      import("../../../../../server/blog/storage"),
      import("../../../../../server/blog/admin-validation"),
      import("../../../../../server/blog/verification"),
    ]);
    const payload = validation.adminBlogStatusSchema.parse(await request.json());
    const existing = await storage.getBlogPostById(id);
    if (!existing) return json({ success: false, message: "Blog post not found" }, 404);
    if (payload.status === existing.status) return json({ success: false, message: "The article already has that status" }, 409);

    const currentPath = storage.getBlogPostPath(existing);
    if (payload.status === "published") {
      validation.assertPublishReady(existing);
      if (await storage.getActiveBlogRedirect(currentPath)) {
        return json({ success: false, message: "Deactivate the article URL redirect before publishing" }, 409);
      }
    }

    let redirect: {
      sourcePath: string;
      targetPath: string;
      statusCode: 301 | 302;
      reason: string;
      isActive: boolean;
      sourcePostId: number;
    } | null = null;
    if (existing.status === "published" && payload.status !== "published") {
      if (payload.confirmUnpublish !== true || payload.confirmSlug !== existing.slug) {
        return json({ success: false, message: "Moving a published post requires confirmation with the exact post slug" }, 400);
      }
      if (payload.redirectTargetPath) {
        const targetPath = storage.normalizeInternalPath(payload.redirectTargetPath);
        if (targetPath === currentPath) return json({ success: false, message: "Redirect target must differ from the article path" }, 400);
        if (await storage.getActiveBlogRedirect(targetPath)) {
          return json({ success: false, message: "Redirect target cannot itself be an active redirect" }, 409);
        }
        redirect = { sourcePath: currentPath, targetPath, statusCode: 301, reason: "unpublish", isActive: true, sourcePostId: existing.id };
      } else if (payload.confirmNoRedirect !== true) {
        return json({ success: false, message: "Choose a redirect target or explicitly confirm no redirect" }, 400);
      }
    }

    const transition = await storage.updateBlogPostStatusWithImageGuard(
      id,
      payload.status,
      payload.status === "published" ? existing.publishedAt || new Date() : undefined,
      { expectedStatus: existing.status, expectedUpdatedAt: existing.updatedAt },
      { redirect, deactivateRedirectPath: payload.status === "published" ? currentPath : null },
    );
    if (!transition) return json({ success: false, message: "Blog post not found" }, 404);
    return json({
      success: true,
      data: transition.post,
      redirect: transition.redirect,
      deactivatedRedirect: transition.deactivatedRedirect,
      checks: validation.validatePostForPublish(transition.post),
      verification: verification.buildBlogVerificationReport(transition.post),
    });
  } catch (error) {
    return requestError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const denied = await requireWriteAccess(request);
  if (denied) return denied;
  const segments = (await context.params).path || [];
  const id = segments[0] === "posts" ? Number(segments[1]) : NaN;
  if (!Number.isInteger(id) || id <= 0) return json({ success: false, message: "Invalid post id" }, 400);
  try {
    const [storage, imageService] = await Promise.all([
      import("../../../../../server/blog/storage"),
      import("../../../../../server/blog/images/service"),
    ]);
    if (segments.length === 4 && segments[2] === "images") {
      const imageId = Number(segments[3]);
      if (!Number.isInteger(imageId) || imageId <= 0) return json({ success: false, message: "Invalid blog image id" }, 400);
      const [post, images] = await Promise.all([
        storage.getBlogPostById(id),
        import("../../../../../server/blog/images/storage"),
      ]);
      if (!post) return json({ success: false, message: "Blog post not found" }, 404);
      if (post.status !== "draft") return json({ success: false, message: "Blog image changes are allowed only while the post is a draft" }, 409);
      const image = await images.getBlogPostImage(imageId);
      if (!image || image.postId !== id) return json({ success: false, message: "Blog image variant not found" }, 404);
      await imageService.deleteBlogImageVariant(id, imageId);
      return json({ success: true });
    }
    if (segments.length !== 2) return json({ success: false, message: "Admin blog delete endpoint not found" }, 404);
    const post = await storage.getBlogPostById(id);
    if (!post) return json({ success: false, message: "Blog post not found" }, 404);
    const body = await request.json().catch(() => ({})) as {
      confirmPublishedDelete?: boolean;
      confirmSlug?: string;
      redirectTargetPath?: string;
      confirmNoRedirect?: boolean;
    };
    let redirectRequest: {
      sourcePath: string;
      targetPath: string;
      statusCode: 301;
      reason: string;
      isActive: boolean;
      sourcePostId: null;
    } | undefined;
    if (post.status === "published") {
      if (body.confirmPublishedDelete !== true || body.confirmSlug?.trim() !== post.slug) {
        return json({ success: false, message: "Published post deletion requires confirmation with the exact post slug" }, 400);
      }
      const sourcePath = storage.getBlogPostPath(post);
      if (body.redirectTargetPath) {
        const targetPath = storage.normalizeInternalPath(body.redirectTargetPath);
        if (targetPath === sourcePath) return json({ success: false, message: "Redirect target must differ from the article path" }, 400);
        if (await storage.getActiveBlogRedirect(targetPath)) return json({ success: false, message: "Redirect target cannot itself be an active redirect" }, 409);
        redirectRequest = { sourcePath, targetPath, statusCode: 301, reason: "delete", isActive: true, sourcePostId: null };
      } else if (body.confirmNoRedirect !== true) {
        return json({ success: false, message: "Choose a redirect target or explicitly confirm no redirect" }, 400);
      }
    }
    const deletion = await storage.deleteBlogPostWithRedirect(id, redirectRequest, {
      expectedStatus: post.status,
      expectedUpdatedAt: post.updatedAt,
      deletePhysicalImageObjects: async objectKeys => {
        await imageService.deleteBlogImageObjectsOnly(objectKeys);
      },
    });
    if (!deletion.deleted) return json({ success: false, message: "Blog post not found" }, 404);
    return json({
      success: true,
      data: {
        deletedPostId: id,
        deletedSlug: post.slug,
        deletedStatus: post.status,
        publicPath: storage.getBlogPostPath(post),
        redirect: deletion.redirect,
      },
    });
  } catch (error) {
    return requestError(error);
  }
}
