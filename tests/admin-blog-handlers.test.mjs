import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const route = fs.readFileSync(
  path.join(process.cwd(), "app/api/admin/blog/[[...path]]/route.ts"),
  "utf8",
);
const generationStorage = fs.readFileSync(
  path.join(process.cwd(), "server/blog/generation/storage.ts"),
  "utf8",
);
const expressAdminRoutes = fs.readFileSync(
  path.join(process.cwd(), "server/blog/admin-routes.ts"),
  "utf8",
);
const blogStorage = fs.readFileSync(
  path.join(process.cwd(), "server/blog/storage.ts"),
  "utf8",
);
const imageService = fs.readFileSync(
  path.join(process.cwd(), "server/blog/images/service.ts"),
  "utf8",
);
const imageStorage = fs.readFileSync(
  path.join(process.cwd(), "server/blog/images/storage.ts"),
  "utf8",
);

test("Next owns authenticated blog CRUD and publication transitions", () => {
  assert.match(route, /export async function GET/);
  assert.match(route, /export async function POST/);
  assert.match(route, /export async function PUT/);
  assert.match(route, /export async function PATCH/);
  assert.match(route, /export async function DELETE/);
  assert.match(route, /getAdminSession/);
  assert.match(route, /updateBlogPostStatusWithImageGuard/);
  assert.match(route, /confirmUnpublish/);
  assert.match(route, /confirmPublishedDelete/);
  assert.match(route, /deleteBlogPostWithRedirect/);
});

test("Next owns the editor support and Vercel Blob image workflows", () => {
  for (const endpoint of [
    "stats",
    "authors",
    "categories",
    "tags",
    "verify",
    "unpublish-impact",
    "seo-check",
    "fix",
    "images",
    "generate",
    "regenerate",
    "select",
    "deselect",
  ]) {
    assert.match(route, new RegExp(endpoint.replace("-", "\\-")));
  }
  assert.match(route, /vercel-blob/);
  assert.match(route, /Blog image changes are allowed only while the post is a draft/);
});

test("Next owns durable AI planning, generation and SSE recovery", () => {
  for (const endpoint of ["topic-plan", "generate-draft", "generation-runs", "by-key", "events"]) {
    assert.match(route, new RegExp(endpoint));
  }
  assert.match(route, /Idempotency-Key header is required/);
  assert.match(route, /executePersistedAutoGenerateRun/);
  assert.match(route, /Content-Type": "text\/event-stream/);
  assert.match(route, /after\(\(\) =>/);
});

test("generation-run races return a stable conflict instead of a Next 500", () => {
  assert.match(generationStorage, /code !== ["']23505["']/);
  assert.match(generationStorage, /statusCode: 409, code: ["']blog_generation_run_conflict["']/);
  assert.match(generationStorage, /getBlogGenerationRunByIdempotencyKey\(values\.idempotencyKey\)/);
  assert.match(route, /createBlogGenerationRunIfAbsent/);
  assert.match(expressAdminRoutes, /createBlogGenerationRunIfAbsent/);
  assert.match(route, /decideGenerationRunCreationAction\(creation\)/);
  assert.match(expressAdminRoutes, /decideGenerationRunCreationAction\(creation\)/);
  assert.match(expressAdminRoutes, /creationAction !== ["']queue_new["']/);
});

test("Express topic planning heartbeats for the whole provider call", () => {
  assert.match(expressAdminRoutes, /heartbeatBlogGenerationRun\(planningRun\.id\)/);
  assert.match(expressAdminRoutes, /Could not heartbeat topic planning run/);
  assert.match(expressAdminRoutes, /finally \{\s*clearInterval\(heartbeatTimer\)/);
});

test("topic inventory pagination has a deterministic id tie-breaker", () => {
  assert.match(
    blogStorage,
    /orderBy\(desc\(blogPosts\.updatedAt\), desc\(blogPosts\.createdAt\), desc\(blogPosts\.id\)\)/,
  );
});

test("Blob cleanup is durable and retries every queued key", () => {
  assert.match(blogStorage, /insert\(blogImageCleanupQueue\)/);
  assert.match(imageService, /listQueuedBlogImageCleanupKeys\(\)/);
  assert.match(imageService, /for \(const objectKey of uniqueObjectKeys\)/);
  assert.match(imageService, /markBlogImageCleanupFailed\(objectKey, error\)/);
  assert.match(imageStorage, /attempts: sql`\$\{blogImageCleanupQueue\.attempts\} \+ 1`/);
  assert.match(imageStorage, /delete\(blogImageCleanupQueue\)/);
});

test("auto-generation counts every paid image call against its quota", () => {
  assert.match(expressAdminRoutes, /checkBlogImageRateLimit\([\s\S]*?"auto-generate"[\s\S]*?getBlogImageRateLimitCost\("all", 2\)/);
});

test("Next owns Link Intelligence library, reviews, reports and audits", () => {
  for (const symbol of [
    "getBlogLinkSummary",
    "listManagedBlogLinkSources",
    "getBlogPostLinkReport",
    "getBlogInternalLinkOpportunities",
    "assertBlogPostLinksPublishReady",
    "createBlogLinkAuditRun",
  ]) {
    assert.match(route, new RegExp(symbol));
  }
  assert.match(route, /createManagedBlogLink/);
  assert.match(route, /reviewManagedBlogLink/);
  assert.match(route, /updateManagedBlogLink/);
  assert.match(route, /processBlogLinkAuditRun/);
});
