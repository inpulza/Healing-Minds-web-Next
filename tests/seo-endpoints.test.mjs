import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const read = (relative) => fs.readFileSync(path.join(process.cwd(), relative), "utf8");

test("Next owns sitemap, robots and llms endpoints without blocking its assets", () => {
  for (const file of ["app/sitemap.ts", "app/robots.ts", "app/llms.txt/route.ts"]) {
    assert.equal(fs.existsSync(path.join(process.cwd(), file)), true, `missing ${file}`);
  }
  assert.match(read("app/sitemap.ts"), /getSitemapEntries/);
  assert.match(read("app/robots.ts"), /sitemap/i);
  assert.doesNotMatch(read("app/robots.ts"), /Disallow[^\n]*\/_next/i);
  assert.match(read("app/llms.txt/route.ts"), /text\/plain/);
});

test("admin pages stay crawlable for noindex while private APIs remain blocked", () => {
  const robots = read("app/robots.ts");
  const sitemap = read("app/sitemap.ts");

  assert.doesNotMatch(robots, /["']\/admin(?:\/\*?|[*])?["']/);
  assert.match(robots, /["']\/api\/admin\/["']/);
  assert.doesNotMatch(sitemap, /\/admin(?:\/|["'`])/);
});

test("blog sitemap preserves the historical hreflang contract", () => {
  const sitemap = read("app/sitemap.ts");

  assert.match(sitemap, /"x-default": `\$\{ORIGIN\}\/blog`/);
  assert.match(sitemap, /export const revalidate = 86400/);
  assert.match(sitemap, /Object\.values\(blogSnapshot\)/);
  assert.match(sitemap, /preserving last valid sitemap/);
  assert.match(sitemap, /catch \(error\)[\s\S]*throw error/);
  assert.match(sitemap, /buildBlogSitemapEntries\(ORIGIN, publishedPosts\)/);
});
