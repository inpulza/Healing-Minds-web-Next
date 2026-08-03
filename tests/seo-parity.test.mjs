import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, "shared", "seo-manifest.json"), "utf8"));
const blogSnapshot = JSON.parse(
  fs.readFileSync(path.join(root, "shared", "blog-snapshot.json"), "utf8"),
);
const nextConfig = fs.readFileSync(path.join(root, "next.config.mjs"), "utf8");
const normalizeSnippet = (value) => value.trim().replace(/\s+/g, " ").toLocaleLowerCase("en-US");

test("Next resolves route metadata before rendering for every user agent", () => {
  assert.match(nextConfig, /htmlLimitedBots:\s*\/\.\*\//);
});

test("the frozen server SEO manifest covers every listed route with canonical metadata", () => {
  const entries = Object.entries(manifest);
  const titleOwners = new Map();
  const descriptionOwners = new Map();
  const canonicalOwners = new Map();

  assert.equal(entries.length, 79);
  for (const [route, seo] of Object.entries(manifest)) {
    assert.equal(typeof seo.title, "string", `${route}: title`);
    assert.equal(seo.title, seo.title.trim(), `${route}: title has surrounding whitespace`);
    assert.ok(seo.title.length > 0, `${route}: empty title`);
    assert.ok(
      seo.title.length <= 60,
      `${route}: title is ${seo.title.length} characters (maximum 60)`,
    );
    assert.equal(typeof seo.description, "string", `${route}: description`);
    assert.equal(
      seo.description,
      seo.description.trim(),
      `${route}: description has surrounding whitespace`,
    );
    assert.ok(seo.description.length > 0, `${route}: empty description`);
    assert.ok(
      seo.description.length <= 160,
      `${route}: description is ${seo.description.length} characters (maximum 160)`,
    );
    assert.equal(seo["og:title"], seo.title, `${route}: og:title must match title`);
    assert.equal(
      seo["og:description"],
      seo.description,
      `${route}: og:description must match description`,
    );
    assert.equal(seo["twitter:title"], seo.title, `${route}: twitter:title must match title`);
    assert.equal(
      seo["twitter:description"],
      seo.description,
      `${route}: twitter:description must match description`,
    );
    assert.match(seo.canonical, /^https:\/\/www\.healingmindsp\.com\//, `${route}: canonical`);
    assert.equal(
      seo.canonical,
      new URL(route, "https://www.healingmindsp.com").toString(),
      `${route}: canonical must match its manifest path`,
    );
    assert.equal(seo["og:url"], seo.canonical, `${route}: og:url must match canonical`);
    assert.ok(seo.lang === "en" || seo.lang === "es", `${route}: lang`);

    const normalizedTitle = normalizeSnippet(seo.title);
    const normalizedDescription = normalizeSnippet(seo.description);
    assert.equal(
      titleOwners.has(normalizedTitle),
      false,
      `${route}: title duplicates ${titleOwners.get(normalizedTitle)}`,
    );
    assert.equal(
      descriptionOwners.has(normalizedDescription),
      false,
      `${route}: description duplicates ${descriptionOwners.get(normalizedDescription)}`,
    );
    assert.equal(
      canonicalOwners.has(seo.canonical),
      false,
      `${route}: canonical duplicates ${canonicalOwners.get(seo.canonical)}`,
    );
    titleOwners.set(normalizedTitle, route);
    descriptionOwners.set(normalizedDescription, route);
    canonicalOwners.set(seo.canonical, route);
  }
});

test("published blog snapshot metadata stays bounded, nonempty and unique", () => {
  const entries = Object.entries(blogSnapshot);
  const titleOwners = new Map();
  const descriptionOwners = new Map();

  assert.ok(entries.length > 0, "blog snapshot must contain at least one published post");
  for (const [route, post] of entries) {
    assert.equal(post.status, "published", `${route}: snapshot post must be published`);
    assert.equal(typeof post.metaTitle, "string", `${route}: metaTitle`);
    assert.equal(post.metaTitle, post.metaTitle.trim(), `${route}: metaTitle has surrounding whitespace`);
    assert.ok(post.metaTitle.length > 0, `${route}: empty metaTitle`);
    assert.ok(
      post.metaTitle.length <= 60,
      `${route}: metaTitle is ${post.metaTitle.length} characters (maximum 60)`,
    );
    assert.equal(typeof post.metaDescription, "string", `${route}: metaDescription`);
    assert.equal(
      post.metaDescription,
      post.metaDescription.trim(),
      `${route}: metaDescription has surrounding whitespace`,
    );
    assert.ok(post.metaDescription.length > 0, `${route}: empty metaDescription`);
    assert.ok(
      post.metaDescription.length <= 160,
      `${route}: metaDescription is ${post.metaDescription.length} characters (maximum 160)`,
    );

    const normalizedTitle = normalizeSnippet(post.metaTitle);
    const normalizedDescription = normalizeSnippet(post.metaDescription);
    assert.equal(
      titleOwners.has(normalizedTitle),
      false,
      `${route}: metaTitle duplicates ${titleOwners.get(normalizedTitle)}`,
    );
    assert.equal(
      descriptionOwners.has(normalizedDescription),
      false,
      `${route}: metaDescription duplicates ${descriptionOwners.get(normalizedDescription)}`,
    );
    titleOwners.set(normalizedTitle, route);
    descriptionOwners.set(normalizedDescription, route);
  }
});

test("the blog editorial pipeline enforces the 60-character title budget end to end", () => {
  const sources = {
    adminValidation: fs.readFileSync(path.join(root, "server", "blog", "admin-validation.ts"), "utf8"),
    verification: fs.readFileSync(path.join(root, "server", "blog", "verification.ts"), "utf8"),
    aiValidation: fs.readFileSync(path.join(root, "server", "blog", "ai", "validation.ts"), "utf8"),
    aiPrompts: fs.readFileSync(path.join(root, "server", "blog", "ai", "prompts.ts"), "utf8"),
    contentFixes: fs.readFileSync(path.join(root, "server", "blog", "content-fixes.ts"), "utf8"),
    adminUi: fs.readFileSync(path.join(root, "client", "src", "pages", "admin", "BlogAdminPage.tsx"), "utf8"),
  };

  assert.match(sources.adminValidation, /metaTitle:\s*z\.string\(\)\.trim\(\)\.min\(10\)\.max\(60\)/);
  assert.match(sources.adminValidation, /post\.metaTitle\.length <= 60/);
  assert.match(sources.verification, /post\.metaTitle\.length >= 10 && post\.metaTitle\.length <= 60/);
  assert.match(sources.verification, /\$\{post\.metaTitle\.length\}\/60 characters/);
  assert.equal(
    [...sources.aiValidation.matchAll(/truncateSeoText\([^\n]+, 60\)/g)].length,
    2,
    "AI normalization must bound both meta-title branches to 60 characters",
  );
  assert.match(sources.aiPrompts, /"metaTitle": "60 characters max"/);
  assert.match(sources.contentFixes, /truncateSeoText\(post\.metaTitle \|\| post\.title, 60\)/);
  assert.match(sources.adminUi, /truncateSeoText\(title, 60\)/);
  assert.doesNotMatch(sources.adminUi, /title\.slice\(0, 60\)/);
  assert.match(sources.adminUi, /maxLength=\{60\}/);
  assert.match(sources.adminUi, /\{form\.metaTitle\.length\}\/60/);
});

test("server and legacy client metadata keep Open Graph on the current language route", () => {
  const metadata = fs.readFileSync(path.join(root, "app", "_seo", "metadata.ts"), "utf8");
  const clientSeo = fs.readFileSync(path.join(root, "client", "src", "utils", "seo.ts"), "utf8");

  assert.match(metadata, /url:\s*pathname === "\/" \? undefined : seo\.canonical \|\| seo\["og:url"\]/);
  assert.match(clientSeo, /productionOrigin\(\).*normalizeRoutePath\(window\.location\.pathname\)/s);
  assert.doesNotMatch(clientSeo, /const ogUrl = data\.canonical/);
  assert.match(metadata, /https:\/\/www\.healingmindsp\.com\/og-image\.png/);
  assert.match(metadata, /images:\s*\[image\]/);
  assert.match(metadata, /width:\s*1200/);
  assert.match(metadata, /height:\s*630/);
});

test("California landing routes keep their dedicated metadata and noindex policy", () => {
  for (const route of ["/psychiatrist-california", "/es/psiquiatra-california"]) {
    const seo = manifest[route];
    assert.ok(seo, `${route}: missing metadata`);
    assert.equal(seo.robots, "noindex, follow", `${route}: robots`);
    assert.match(seo.canonical, new RegExp(`${route.replaceAll("/", "\\/")}$`));
  }
});

test("root and catch-all routes generate metadata from the frozen live manifest", () => {
  const rootPage = fs.readFileSync(path.join(root, "app", "page.tsx"), "utf8");
  const catchAll = fs.readFileSync(path.join(root, "app", "[...slug]", "page.tsx"), "utf8");
  assert.match(rootPage, /metadataForPath\("\/"\)/);
  assert.match(catchAll, /generateMetadata/);
  assert.match(catchAll, /metadataForPath/);
  const layout = fs.readFileSync(path.join(root, "app", "layout.tsx"), "utf8");
  const proxy = fs.readFileSync(path.join(root, "proxy.ts"), "utf8");
  assert.match(layout, /await headers\(\)/, "root layout must render the live route language in HTML");
  assert.match(proxy, /x-healing-pathname/, "proxy must provide the pathname to the root layout");
});
