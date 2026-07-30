import assert from "node:assert/strict";
import test from "node:test";

const helperUrl = new URL("../scripts/lib/vercel-preview.mjs", import.meta.url);

test("candidate browser contexts omit bypass headers when no secret is configured", async () => {
  const { candidateContextOptions } = await import(helperUrl);
  assert.deepEqual(candidateContextOptions(undefined), {});
});

test("candidate browser contexts use the Vercel automation bypass without exposing it elsewhere", async () => {
  const { candidateContextOptions } = await import(helperUrl);
  const options = candidateContextOptions("test-secret");
  assert.deepEqual(options, {
    extraHTTPHeaders: {
      "x-vercel-protection-bypass": "test-secret",
      "x-vercel-set-bypass-cookie": "true",
    },
  });
});
