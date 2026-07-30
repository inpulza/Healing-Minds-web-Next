import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, "shared", "seo-manifest.json"), "utf8"));

test("the frozen live SEO manifest covers every sitemap URL with canonical metadata", () => {
  assert.equal(Object.keys(manifest).length, 77);
  for (const [route, seo] of Object.entries(manifest)) {
    assert.equal(typeof seo.title, "string", `${route}: title`);
    assert.ok(seo.title.length > 0, `${route}: empty title`);
    assert.equal(typeof seo.description, "string", `${route}: description`);
    assert.match(seo.canonical, /^https:\/\/www\.healingmindsp\.com\//, `${route}: canonical`);
    assert.ok(seo.lang === "en" || seo.lang === "es", `${route}: lang`);
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
