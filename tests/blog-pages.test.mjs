import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const snapshot = JSON.parse(fs.readFileSync(path.join(root, "shared", "blog-snapshot.json"), "utf8"));

test("every live sitemap blog post has a frozen production fallback", () => {
  assert.deepEqual(Object.keys(snapshot).sort(), [
    "/blog/bipolar-medication-follow-up-questions",
    "/blog/understanding-anxiety-treatment-naples",
    "/es/blog/tratamiento-ansiedad-naples",
  ]);
  for (const [pathname, post] of Object.entries(snapshot)) {
    assert.ok(post.title, `${pathname}: title`);
    assert.ok(post.content?.length > 500, `${pathname}: content`);
  }
});

test("the Next public graph and API render the frozen live blog posts", () => {
  const routes = fs.readFileSync(path.join(root, "app", "_routing", "public-routes.mjs"), "utf8");
  const publicPage = fs.readFileSync(path.join(root, "app", "_routing", "public-page.tsx"), "utf8");
  const api = fs.readFileSync(path.join(root, "app", "api", "blog", "posts", "[[...slug]]", "route.ts"), "utf8");
  const component = fs.readFileSync(path.join(root, "client", "src", "pages", "BlogPost.tsx"), "utf8");
  for (const pathname of Object.keys(snapshot)) assert.ok(routes.includes(`page("${pathname}", "BlogPost")`));
  assert.match(publicPage, /BlogPost/);
  assert.match(api, /blog-snapshot\.json/);
  assert.match(component, /blog-snapshot\.json/);
  assert.match(component, /typeof window/);
});

test("the database seed includes every frozen published post", () => {
  const seed = fs.readFileSync(path.join(root, "server", "blog", "seed.ts"), "utf8");
  for (const post of Object.values(snapshot)) {
    assert.ok(seed.includes(post.slug), `seed is missing ${post.slug}`);
  }
});
