import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const route = fs.readFileSync(
  path.join(process.cwd(), "app/api/admin/blog/[[...path]]/route.ts"),
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
