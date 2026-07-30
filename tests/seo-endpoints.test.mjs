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
