import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const source = fs.readFileSync(path.join(process.cwd(), "next.config.mjs"), "utf8");

test("legacy URLs are represented as permanent Next redirects", () => {
  for (const route of [
    "/adhd-treatment-adults-naples-fl",
    "/locations/naples",
    "/locations/psychiatrist-lely-resorts",
    "/es/ubicaciones/psiquiatra-lely-resorts",
  ]) {
    assert.match(source, new RegExp(route.replaceAll("/", "\\/")));
  }
  assert.match(source, /async\s+redirects\s*\(/);
});
