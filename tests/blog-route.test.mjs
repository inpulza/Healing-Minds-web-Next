import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const routePath = path.join(process.cwd(), "app", "api", "blog", "posts", "[[...slug]]", "route.ts");

test("public blog list and detail API are owned by a lazy Next Route Handler", () => {
  assert.equal(fs.existsSync(routePath), true, "missing public blog Route Handler");
  const source = fs.readFileSync(routePath, "utf8");
  assert.match(source, /export\s+async\s+function\s+GET/);
  assert.match(source, /getBlogPosts/);
  assert.match(source, /getBlogPostBySlug/);
  assert.match(source, /sanitizeBlogContentHtml/);
  assert.match(source, /\bimport\(/, "database modules must stay lazy during static builds");
});
