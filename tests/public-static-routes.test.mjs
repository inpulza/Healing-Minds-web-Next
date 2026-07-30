import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const legacyRouterSource = fs.readFileSync(path.join(root, "client", "src", "App.tsx"), "utf8");
const frozenBlogPaths = Object.keys(
  JSON.parse(fs.readFileSync(path.join(root, "shared", "blog-snapshot.json"), "utf8")),
);

function legacyStaticPublicPaths() {
  return [...legacyRouterSource.matchAll(/<Route path="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((pathname) => !pathname.includes(":"))
    .filter((pathname) => !pathname.startsWith("/admin"));
}

test("the central resolver owns every statically-known public legacy route", async () => {
  const { publicRoutePaths, resolvePublicRoute } = await import("../app/_routing/public-routes.mjs");
  const expected = [...legacyStaticPublicPaths(), ...frozenBlogPaths].sort();

  assert.deepEqual([...publicRoutePaths].sort(), expected);
  for (const pathname of expected) {
    assert.ok(resolvePublicRoute(pathname), `missing route definition for ${pathname}`);
  }
});

test("the public route resolver is an exact allowlist", async () => {
  const { resolvePublicRoute } = await import("../app/_routing/public-routes.mjs");

  assert.equal(resolvePublicRoute("/about")?.page, "About");
  assert.equal(resolvePublicRoute("/es/acerca-de")?.locale, "es");
  assert.equal(resolvePublicRoute("/locations/naples")?.redirectTo, "/locations/psychiatrist-naples");
  assert.equal(resolvePublicRoute("/about/extra"), null);
  assert.equal(resolvePublicRoute("/ABOUT"), null);
  assert.equal(resolvePublicRoute("/about/"), null);
  assert.equal(resolvePublicRoute("__proto__"), null);
  assert.equal(resolvePublicRoute(null), null);
});

test("catch-all static params are derived from the central allowlist", async () => {
  const { publicRouteParams, publicRoutePaths } = await import("../app/_routing/public-routes.mjs");
  const materialized = publicRouteParams.map(({ slug }) => `/${slug.join("/")}`);

  assert.equal(materialized.includes("/"), false, "the root has its own App Router page");
  assert.deepEqual(materialized.sort(), publicRoutePaths.filter((pathname) => pathname !== "/").sort());
  assert.ok(publicRouteParams.every(({ slug }) => slug.every((segment) => segment.length > 0)));
});

test("the safe catch-all returns a real 404 for paths outside the allowlist", () => {
  const catchAll = fs.readFileSync(path.join(root, "app", "[...slug]", "page.tsx"), "utf8");

  assert.match(catchAll, /resolvePublicRoute/);
  assert.match(catchAll, /notFound\(\)/);
  assert.match(catchAll, /generateStaticParams/);
  assert.doesNotMatch(catchAll, /dynamic\s*\(|import\s*\([^)]*slug|require\s*\([^)]*slug/);
});
