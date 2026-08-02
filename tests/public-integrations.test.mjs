import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { dedupeTikTokPayload } from "../shared/tiktok-feed.mjs";

const routes = [
  "app/api/reviews/route.ts",
  "app/api/reviews/rating/route.ts",
  "app/api/tiktok/route.ts",
];

test("public Metricool-backed APIs are represented by cacheable Next handlers", () => {
  for (const route of routes) {
    const full = path.join(process.cwd(), route);
    assert.equal(fs.existsSync(full), true, `missing ${route}`);
    const source = fs.readFileSync(full, "utf8");
    assert.match(source, /export\s+(?:const\s+revalidate|async\s+function\s+GET)/);
  }
  assert.match(fs.readFileSync(path.join(process.cwd(), routes[0]), "utf8"), /staticReviews/);
  const tikTokRoute = fs.readFileSync(path.join(process.cwd(), routes[2]), "utf8");
  assert.match(tikTokRoute, /tiktok-snapshot\.json/);
  assert.doesNotMatch(tikTokRoute, /error\.message/);
  const tikTokSnapshot = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "shared", "tiktok-snapshot.json"), "utf8"),
  );
  assert.equal(tikTokSnapshot.data.length, 4);
  const normalizedTikTokSnapshot = dedupeTikTokPayload(tikTokSnapshot);
  assert.equal(normalizedTikTokSnapshot.data.length, 1);
  assert.equal(normalizedTikTokSnapshot.data[0].root.element.id, "7657683103103683854");
  assert.match(normalizedTikTokSnapshot.data[0].root.element.link, /tiktok\.com\/@melvareve_md\//);
});
