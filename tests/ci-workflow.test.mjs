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

test("CI runs browser end-to-end journeys against the production build", () => {
  assert.match(workflow, /npm run test:e2e/);
  assert.ok(
    workflow.indexOf("npm run build") < workflow.indexOf("npm run test:e2e"),
    "browser E2E must use the completed production build",
  );
});

test("CI retains Playwright evidence when a browser journey fails", () => {
  assert.match(workflow, /uses: actions\/upload-artifact@v4/);
  assert.match(workflow, /if: failure\(\)/);
  assert.match(workflow, /playwright-report\//);
  assert.match(workflow, /test-results\//);
});

test("CI verifies the rendered admin noindex contract after the production build", () => {
  assert.match(workflow, /npm run seo:admin-noindex-check/);
  assert.ok(
    workflow.indexOf("npm run build") < workflow.indexOf("npm run seo:admin-noindex-check"),
    "the admin noindex smoke must use the completed production build",
  );
});

test("CI verifies lazy-mounted page heading hierarchy after the production build", () => {
  assert.match(workflow, /npm run seo:heading-hierarchy-check/);
  assert.ok(
    workflow.indexOf("npm run build") < workflow.indexOf("npm run seo:heading-hierarchy-check"),
    "the heading hierarchy smoke must use the completed production build",
  );
});
