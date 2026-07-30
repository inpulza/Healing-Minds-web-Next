import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

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
  assert.doesNotMatch(storage, /@replit|App Storage/i);
});

test("Next serves managed legacy image URLs through a validated immutable route", () => {
  const route = read("app/public-objects/blog-images/posts/[filename]/route.ts");
  assert.match(route, /isManagedBlogImageKey/);
  assert.match(route, /downloadBlogImage/);
  assert.match(route, /max-age=31536000, immutable/);
  assert.match(route, /X-Content-Type-Options/);
});
