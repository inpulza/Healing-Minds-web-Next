import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const budgetScript = fs.readFileSync(
  path.join(root, "scripts/verify-public-route-bundle-budget.mjs"),
  "utf8",
);

test("production builds enforce first-load JavaScript budgets for public routes", () => {
  assert.match(
    packageJson.scripts.build,
    /next build && node scripts\/verify-public-route-bundle-budget\.mjs/,
  );
  assert.match(budgetScript, /route-bundle-stats\.json/);
  assert.match(budgetScript, /\["\/", 750 \* 1024\]/);
  assert.match(budgetScript, /\["\/\[\.\.\.slug\]", 850 \* 1024\]/);
});
