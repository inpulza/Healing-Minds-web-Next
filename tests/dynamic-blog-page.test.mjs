import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root, file), "utf8");

test("the catch-all resolves database-published blog slugs beyond the frozen allowlist", () => {
  const page = read("app/[...slug]/page.tsx");
  assert.match(page, /matchBlogPath/);
  assert.match(page, /loadPublicBlogPost/);
  assert.match(page, /DynamicBlogPost/);
  assert.match(page, /loadPublicBlogRedirect/);
  assert.match(page, /if \(target\) permanentRedirect\(target\)/);
  assert.match(page, /notFound\(\)/);
});

test("dynamic blog pages receive server-loaded content and metadata", () => {
  const page = read("app/[...slug]/page.tsx");
  const loader = read("app/_routing/load-public-blog-post.ts");
  const wrapper = read("app/_routing/dynamic-blog-post.tsx");
  assert.match(loader, /getBlogPostBySlug/);
  assert.match(loader, /blogSnapshot/);
  assert.match(loader, /loadPublicBlogPostByKey/);
  assert.match(loader, /loadPublicBlogPostByKey\(match\.slug, match\.language, match\.pathname\)/);
  assert.match(wrapper, /initialPost/);
  assert.match(read("client/src/pages/BlogPost.tsx"), /initialPost/);
  assert.ok(
    page.indexOf("const blogPath = matchBlogPath(pathname)") <
      page.indexOf("if (!blogPath) return frozen"),
    "blog routes must resolve post metadata before accepting the frozen fallback",
  );
  assert.match(page, /images: post\.featuredImage/);
  assert.match(page, /post\.featuredImageAlt \|\| post\.title/);
  assert.match(read("client/src/pages/BlogPost.tsx"), /canPrepareArticle/);
  assert.match(read("client/src/pages/BlogPost.tsx"), /timeZone: 'UTC'/);
});

test("blog indexes receive a server-loaded list before hydration", () => {
  const englishPage = read("app/blog/page.tsx");
  const spanishPage = read("app/es/blog/page.tsx");
  const page = read("app/_routing/blog-index-page.tsx");
  const loader = read("app/_routing/load-public-blog-index.ts");
  const wrapper = read("app/_routing/dynamic-blog-index.tsx");
  const index = read("client/src/pages/BlogIndex.tsx");

  assert.match(englishPage, /BlogIndexPage language="en"/);
  assert.match(spanishPage, /BlogIndexPage language="es"/);
  assert.match(page, /loadPublicBlogArchive\(language/);
  assert.match(page, /<DynamicBlogIndex/);
  assert.match(loader, /unstable_cache/);
  assert.match(loader, /getBlogArchive/);
  assert.match(loader, /blogSnapshot/);
  assert.match(wrapper, /initialArchive=\{initialArchive\}/);
  assert.match(index, /archive\.data/);
  assert.match(index, /buildBlogArchiveHref/);
  assert.match(index, /timeZone:\s*["']UTC["']/);
  assert.match(index, /localeCompare\(b\.name, language === 'es' \? 'es-US' : 'en-US'\)/);
});
