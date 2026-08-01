import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import test from "node:test";

const {
  E2E_BASE_URL: _ignoredBaseUrl,
  E2E_EXPECTED_SHA: _ignoredExpectedSha,
  ...cleanEnvironment
} = process.env;

function verify(environment = {}) {
  return spawnSync(process.execPath, ["scripts/verify-deployed-e2e-env.mjs"], {
    cwd: process.cwd(),
    env: { ...cleanEnvironment, ...environment },
    encoding: "utf8",
  });
}

test("deployed E2E fails closed without a target URL", () => {
  const result = verify();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /E2E_BASE_URL is required/);
});

test("deployed E2E rejects local or insecure targets", () => {
  const result = verify({
    E2E_BASE_URL: "http://127.0.0.1:3100",
    E2E_EXPECTED_SHA: "a".repeat(40),
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /must be an HTTPS Preview or Production URL/);
});

test("deployed E2E requires an exact commit SHA", () => {
  const result = verify({ E2E_BASE_URL: "https://preview.example.test" });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /exact 40-character deployment commit SHA/);
});

test("deployed E2E records a valid HTTPS target and exact SHA", () => {
  const sha = "a".repeat(40);
  const result = verify({
    E2E_BASE_URL: "https://preview.example.test/path",
    E2E_EXPECTED_SHA: sha,
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, new RegExp(`target=https://preview\\.example\\.test expectedSha=${sha}`));
});

test("Preview credentials are scoped to the deployment origin", () => {
  const spec = fs.readFileSync("e2e/navigation.spec.ts", "utf8");
  const config = fs.readFileSync("playwright.config.ts", "utf8");
  assert.doesNotMatch(config, /extraHTTPHeaders/);
  assert.match(spec, /hostname\.endsWith\("\.vercel\.app"\)/);
  assert.match(spec, /page\.route\(`\$\{deploymentOrigin\}\/\*\*`/);
  assert.match(spec, /route\.fetch\(\{/);
  assert.match(spec, /maxRedirects:\s*0/);
  assert.match(spec, /route\.fulfill\(\{ response \}\)/);
  assert.doesNotMatch(spec, /route\.continue\(/);
  assert.match(spec, /page\.unrouteAll\(\{ behavior: "ignoreErrors" \}\)/);
  assert.match(spec, /Preview authentication fetch failed/);
  assert.match(spec, /credentialLeaks/);
});
