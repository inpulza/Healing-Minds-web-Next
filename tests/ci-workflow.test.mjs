import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const workflow = fs.readFileSync(".github/workflows/quality.yml", "utf8");

test("CI installs the Chromium runtime required by browser-backed tests", () => {
  assert.match(workflow, /npx playwright install --with-deps chromium/);
  assert.ok(
    workflow.indexOf("npx playwright install --with-deps chromium") < workflow.indexOf("npm test"),
    "Playwright Chromium must be installed before tests run",
  );
});

test("CI verifies the rendered admin noindex contract after the production build", () => {
  assert.match(workflow, /npm run seo:admin-noindex-check/);
  assert.ok(
    workflow.indexOf("npm run build") < workflow.indexOf("npm run seo:admin-noindex-check"),
    "the admin noindex smoke must use the completed production build",
  );
});
