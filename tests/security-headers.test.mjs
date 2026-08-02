import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";

test("public responses declare baseline browser security headers", async () => {
  const configUrl = pathToFileURL(path.join(process.cwd(), "next.config.mjs")).href;
  const { default: config } = await import(configUrl);
  const rules = await config.headers();

  assert.equal(rules.length, 1);
  assert.equal(rules[0].source, "/:path*");
  assert.deepEqual(Object.fromEntries(rules[0].headers.map(({ key, value }) => [key, value])), {
    "Content-Security-Policy": "base-uri 'self'; object-src 'none'; frame-ancestors 'self'",
    "X-Frame-Options": "SAMEORIGIN",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  });
});
