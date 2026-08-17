import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = relativePath => fs.readFileSync(path.join(root, relativePath), "utf8");

test("Next and the admin expose explicit sibling image reuse without another AI request", () => {
  const route = read("app/api/admin/blog/[[...path]]/route.ts");
  const client = read("client/src/pages/admin/BlogAdminPage.tsx");
  const service = read("server/blog/images/service.ts");
  const reuseFunction = service.slice(
    service.indexOf("export async function reuseSelectedSiblingBlogImages"),
    service.indexOf("function assertBlogImageInputsSafe"),
  );

  assert.match(route, /reuse-sibling[\s\S]*reuseSelectedSiblingBlogImages/);
  assert.match(client, /Reuse approved images from/);
  assert.match(client, /No new AI image request was sent/);
  assert.match(reuseFunction, /getSelectedBlogPostImages/);
  assert.match(reuseFunction, /downloadBlogImage/);
  assert.match(reuseFunction, /uploadBlogImage/);
  assert.match(reuseFunction, /buildObjectKey\(target\.id/);
  assert.doesNotMatch(reuseFunction, /generateImageWithOpenAi/);
});

test("sibling image copies are draft-only, atomic and independently cleanable", () => {
  const storage = read("server/blog/images/storage.ts");
  const service = read("server/blog/images/service.ts");
  assert.match(storage, /replaceSelectedDraftBlogImages[\s\S]*post\.status !== "draft"/);
  assert.match(storage, /expectedUpdatedAt[\s\S]*The draft changed while sibling images were being prepared/);
  assert.match(storage, /reviewStatus: "candidate"[\s\S]*reviewStatus: "selected"/);
  assert.match(storage, /featuredImage: hero\.publicUrl/);
  assert.match(service, /cleanupUnregisteredSiblingCopies/);
  assert.match(service, /queueBlogImageCleanup/);
});

test("legacy translated SEO fields are normalized to the shared persistence limits", () => {
  const provider = read("server/blog/translation/provider.ts");
  const client = read("client/src/pages/admin/BlogAdminPage.tsx");
  assert.match(provider, /metaTitle: z\.string\(\)\.trim\(\)\.min\(5\)\.max\(60\)/);
  assert.match(provider, /truncateSeoText\(draft\.metaTitle, 60\)/);
  assert.match(provider, /Keep metaTitle at 60 characters or fewer/);
  assert.match(client, /metaTitle: truncateSeoText\(post\.metaTitle \|\| '', 60\)/);
  assert.match(client, /metaTitle: truncateSeoText\(form\.metaTitle, 60\)/);
});
