import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { publicRoutePaths, resolvePublicRoute } from "../app/_routing/public-routes.mjs";

const root = process.cwd();
const publicPage = fs.readFileSync(
  path.join(root, "app/_routing/public-page.tsx"),
  "utf8",
);

test("public routes load their page code on demand", () => {
  assert.match(publicPage, /import dynamic from ["']next\/dynamic["']/);
  assert.doesNotMatch(publicPage, /import\s+\w+\s+from\s+["']@\/pages\//);

  const expectedPageNames = new Set(
    publicRoutePaths
      .map((pathname) => resolvePublicRoute(pathname))
      .filter((route) => route && !route.redirectTo)
      .map((route) => route.page),
  );
  const dynamicPageNames = new Set(
    [...publicPage.matchAll(/^\s{2}(\w+):\s*loadPage\(\(\)\s*=>\s*import\(["']@\/pages\//gm)]
      .map((match) => match[1]),
  );

  assert.deepEqual(dynamicPageNames, expectedPageNames);
});
