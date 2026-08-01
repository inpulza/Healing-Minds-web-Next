import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import test from "node:test";

const {
  E2E_BASE_URL: _ignoredBaseUrl,
  E2E_EXPECTED_SHA: _ignoredExpectedSha,
  E2E_STORAGE_STATE: _ignoredStorageState,
  VERCEL_AUTOMATION_BYPASS_SECRET: _ignoredBypassSecret,
  VERCEL_OIDC_TOKEN: _ignoredOidcToken,
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
  const specs = ["e2e/navigation.spec.ts", "e2e/consent.spec.ts"].map((path) =>
    fs.readFileSync(path, "utf8"),
  );
  const config = fs.readFileSync("playwright.config.ts", "utf8");
  assert.doesNotMatch(config, /extraHTTPHeaders/);
  assert.match(config, /storageState:\s*storageState \|\| undefined/);
  for (const spec of specs) {
    assert.doesNotMatch(spec, /hostname\.endsWith\("\.vercel\.app"\)/);
    assert.match(spec, /inpulzasolutions-6847s-projects\\\.vercel\\\.app/);
    assert.match(spec, /page\.route\(`\$\{deploymentOrigin\}\/\*\*`/);
    assert.match(spec, /route\.fetch\(\{/);
    assert.match(spec, /maxRedirects:\s*0/);
    assert.match(spec, /route\.fulfill\(\{ response \}\)/);
    assert.doesNotMatch(spec, /route\.continue\(/);
    assert.match(spec, /page\.unrouteAll\(\{ behavior: "ignoreErrors" \}\)/);
    assert.match(spec, /Preview authentication fetch failed/);
  }
  assert.match(specs[0], /credentialLeaks/);
});

test("analytics Preview audit validates auth scope and sitewide TikTok shutdown", () => {
  const audit = fs.readFileSync("scripts/audit-analytics-preview.mjs", "utf8");
  const hostValidation = audit.indexOf('healingMindsImmutablePreviewHost.test');
  const browserLaunch = audit.indexOf("chromium.launch");

  assert.ok(hostValidation >= 0 && hostValidation < browserLaunch);
  assert.doesNotMatch(audit, /hostname\.endsWith\('\.vercel\.app'\)/);
  assert.match(audit, /OIDC credentials may only be forwarded/);
  assert.match(audit, /cookieDomains\.some\(\(domain\) => domain !== parsedPreviewUrl\.hostname\)/);
  assert.doesNotMatch(audit, /extraHTTPHeaders/);
  assert.match(audit, /page\.route\(`\$\{previewOrigin\}\/\*\*`/);
  assert.match(audit, /maxRedirects:\s*0/);
  assert.match(audit, /sample <= 60/);
  assert.match(audit, /page\.waitForTimeout\(500\)/);
  assert.match(audit, /function isTikTokPixelUrl/);
  assert.match(audit, /function assertTikTokDisabled/);
  assert.match(audit, /function savePreferencesWithClarityConsentAudit/);
  assert.match(audit, /Clarity must receive consent\(\$\{expected\}\)/);
  assert.match(audit, /clarityConsentCalls/);
  assert.match(audit, /tiktokRequests/);
  assert.match(audit, /typeof window\.ttq/);
  assert.match(audit, /_tt_enable_cookie/);
  assert.match(audit, /clarity\\\.ms\\\/tag\\\/sxayts0dzk/);
  assert.match(audit, /status: 'disabled-sitewide'/);
  assert.doesNotMatch(audit, /freshTikTokRestore/);
  assert.doesNotMatch(audit, /grantConsentIndex/);
  assert.match(audit, /credentialLeaks/);
});

test("analytics Preview audit rejects another Vercel tenant before browser launch", () => {
  const result = spawnSync(
    process.execPath,
    ["scripts/audit-analytics-preview.mjs", "https://attacker-project.vercel.app"],
    {
      cwd: process.cwd(),
      env: { ...cleanEnvironment, VERCEL_OIDC_TOKEN: "non-secret-test-token" },
      encoding: "utf8",
    },
  );
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /does not belong to the Healing Minds Vercel project/);
  assert.doesNotMatch(result.stderr, /browser/i);
});
