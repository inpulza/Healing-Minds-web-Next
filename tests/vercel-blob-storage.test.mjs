import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { getBlogImageStorageErrorStatus } from "../server/blog/images/storage-error.mjs";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("blog image storage uses Vercel Blob with stable managed keys", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.equal(typeof pkg.dependencies?.["@vercel/blob"], "string");
  assert.equal(pkg.dependencies?.["@replit/object-storage"], undefined);

  const storage = read("server/blog/images/object-storage.ts");
  assert.match(storage, /from ["']@vercel\/blob["']/);
  assert.match(storage, /put\(/);
  assert.match(storage, /head\(/);
  assert.match(storage, /del\(/);
  assert.match(storage, /addRandomSuffix:\s*false/);
  assert.match(storage, /getBlogImageStorageErrorStatus/);
  assert.doesNotMatch(storage, /@replit|App Storage/i);
});

test("missing Blob errors become 404 without hiding provider failures", () => {
  assert.equal(getBlogImageStorageErrorStatus(new Error("Vercel Blob: The requested blob does not exist")), 404);
  assert.equal(getBlogImageStorageErrorStatus({ name: "BlobNotFoundError" }), 404);
  assert.equal(getBlogImageStorageErrorStatus({ code: "blob_not_found" }), 404);
  assert.equal(getBlogImageStorageErrorStatus({ status: 404 }), 404);
  assert.equal(getBlogImageStorageErrorStatus({ statusCode: 404 }), 404);

  for (const error of [
    new Error("Vercel Blob request failed"),
    new Error("Vercel Blob: The requested blob does not exist."),
    { status: 401 },
    { statusCode: 403 },
    { status: 500 },
    { code: "forbidden", message: "Vercel Blob: The requested blob does not exist" + " for this token" },
    null,
  ]) {
    assert.equal(getBlogImageStorageErrorStatus(error), 503);
  }
});

test("Next serves managed legacy image URLs through a validated immutable route", () => {
  const route = read("app/public-objects/blog-images/posts/[filename]/route.ts");
  assert.match(route, /isManagedBlogImageKey/);
  assert.match(route, /downloadBlogImage/);
  assert.match(route, /statusCode\?:\s*number/);
  assert.match(route, /===\s*404\s*\?\s*404\s*:\s*503/);
  assert.match(route, /max-age=31536000, immutable/);
  assert.match(route, /X-Content-Type-Options/);
});
