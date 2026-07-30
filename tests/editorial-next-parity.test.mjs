import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));
const adminRoute = read("app/api/admin/blog/[[...path]]/route.ts");
const adminUi = [
  read("client/src/pages/admin/BlogAdminPage.tsx"),
  ...fs.readdirSync(path.join(root, "client/src/components/admin/blog"))
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => read(`client/src/components/admin/blog/${file}`)),
].join("\n");
const schema = read("shared/schema.ts");
const migration = read("migrations/0000_initial_schema.sql");

function assertFiles(files) {
  for (const file of files) assert.equal(exists(file), true, `missing ${file}`);
}

function assertTokens(source, tokens, label) {
  for (const token of tokens) assert.match(source, new RegExp(token), `${label} missing ${token}`);
}

test("Sprint 17 reviewed image engine retains schema, migration, API and UI parity", () => {
  assertFiles([
    "server/blog/images/routes.ts",
    "server/blog/images/service.ts",
    "server/blog/images/storage.ts",
    "server/blog/images/provider.ts",
    "shared/blog-images.ts",
  ]);
  assertTokens(schema, ["blogPostImages", "blog_post_images"], "Sprint 17 schema");
  assertTokens(migration, ['CREATE TABLE "blog_post_images"', "idx_blog_post_images_single_selected_slot"], "Sprint 17 migration");
  assertTokens(adminRoute, [
    'segments\\[0\\] === "images"',
    'segments\\[2\\] === "images"',
    'segments\\[3\\] === "generate"',
    'segments\\[4\\] === "regenerate"',
    'segments\\[4\\] === "select"',
    'segments\\[4\\] === "deselect"',
  ], "Sprint 17 Next API");
  assertTokens(adminUi, [
    "/api/admin/blog/images/config",
    "/images/generate",
    "/regenerate",
    "/select",
    "/deselect",
  ], "Sprint 17 admin UI");
});

test("Sprint 18 topic planner retains schema, migration, API and UI parity", () => {
  assertFiles([
    "server/blog/ai/topic-planner.ts",
    "server/blog/ai/topic-provider.ts",
    "server/blog/ai/topic-judge.ts",
    "server/blog/strategy/healing-minds.ts",
    "server/blog/topic-candidate-storage.ts",
  ]);
  assertTokens(schema, ["blogGenerationRuns", "blogGenerationEvents", "blogTopicCandidates"], "Sprint 18 schema");
  assertTokens(migration, [
    'CREATE TABLE "blog_generation_runs"',
    'CREATE TABLE "blog_generation_events"',
    'CREATE TABLE "blog_topic_candidates"',
  ], "Sprint 18 migration");
  assertTokens(adminRoute, [
    'segments\\[0\\] === "generation-runs"',
    'segments\\[0\\] === "topic-plan"',
    'segments\\[0\\] === "generate-draft"',
  ], "Sprint 18 Next API");
  assertTokens(adminUi, [
    "/api/admin/blog/generation-runs",
    "/api/admin/blog/topic-plan",
    "/api/admin/blog/generate-draft",
  ], "Sprint 18 admin UI");
});

test("Sprint 19 link intelligence retains schema, migration, critical API and UI parity", () => {
  assertFiles([
    "server/blog/links/routes.ts",
    "server/blog/links/service.ts",
    "server/blog/links/audit.ts",
    "server/blog/links/storage.ts",
    "client/src/components/admin/blog/LinkIntelligencePanel.tsx",
    "client/src/components/admin/blog/LinkLibraryView.tsx",
    "client/src/components/admin/blog/LinkAuditRunControl.tsx",
  ]);
  assertTokens(schema, [
    "blogLinkSources",
    "blogLinks",
    "blogPostLinks",
    "blogLinkAuditRuns",
    "blogLinkChecks",
  ], "Sprint 19 schema");
  assertTokens(migration, [
    'CREATE TABLE "blog_link_sources"',
    'CREATE TABLE "blog_links"',
    'CREATE TABLE "blog_post_links"',
    'CREATE TABLE "blog_link_audit_runs"',
    'CREATE TABLE "blog_link_checks"',
  ], "Sprint 19 migration");
  assertTokens(adminRoute, [
    'segments\\[0\\] === "links"',
    'segments\\[0\\] === "link-sources"',
    'segments\\[0\\] === "link-audits"',
    'segments\\[2\\] === "link-opportunities"',
    'segments\\[3\\] === "resync"',
    'segments\\[3\\] === "assert-publish-ready"',
  ], "Sprint 19 Next API");
  assertTokens(adminUi, [
    "/api/admin/blog/links/config",
    "/api/admin/blog/links/summary",
    "/api/admin/blog/link-sources",
    "/api/admin/blog/link-audits",
    "/link-opportunities",
  ], "Sprint 19 admin UI");
});
