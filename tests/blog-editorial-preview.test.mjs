import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const adminPage = fs.readFileSync(
  path.join(root, "client", "src", "pages", "admin", "BlogAdminPage.tsx"),
  "utf8",
);
const publicPost = fs.readFileSync(
  path.join(root, "client", "src", "pages", "BlogPost.tsx"),
  "utf8",
);
const articleRenderer = fs.readFileSync(
  path.join(root, "client", "src", "lib", "blog-article.ts"),
  "utf8",
);
const adminRoute = fs.readFileSync(
  path.join(root, "app", "api", "admin", "blog", "[[...path]]", "route.ts"),
  "utf8",
);

test("admin and public articles share one sanitized client renderer", () => {
  assert.match(adminPage, /prepareBlogArticleHtml/);
  assert.match(publicPost, /prepareBlogArticleHtml/);
  assert.match(articleRenderer, /isManagedBlogImagePublicUrl/);
  assert.match(articleRenderer, /figure\.className = "blog-inline-image"/);
  assert.match(articleRenderer, /ALLOWED_TAGS:[\s\S]*"figure"[\s\S]*"img"[\s\S]*"figcaption"/);
});

test("admin preview uses the public article typography and complete selected image materialization", () => {
  assert.match(adminPage, /className="blog-article"/);
  assert.match(adminPage, /previewPost\.featuredImage/);
  assert.match(adminPage, /Nothing is published from this window/);
  assert.match(adminPage, /\/api\/admin\/blog\/posts\/\$\{post\.id\}\/preview/);
  assert.match(adminRoute, /segments\[2\] === "preview"/);
  assert.match(adminRoute, /getSelectedBlogPostImages/);
  assert.match(adminRoute, /materializeSelectedInlineImages/);
});
