const baseUrl = process.env.E2E_BASE_URL?.trim();
const expectedSha = process.env.E2E_EXPECTED_SHA?.trim();

if (!baseUrl) {
  throw new Error("E2E_BASE_URL is required for deployed E2E verification");
}

const target = new URL(baseUrl);
if (target.protocol !== "https:") {
  throw new Error("E2E_BASE_URL must be an HTTPS Preview or Production URL");
}

if (!expectedSha || !/^[a-f0-9]{40}$/i.test(expectedSha)) {
  throw new Error("E2E_EXPECTED_SHA must be the exact 40-character deployment commit SHA");
}

console.log(`[deployed-e2e] target=${target.origin} expectedSha=${expectedSha}`);
