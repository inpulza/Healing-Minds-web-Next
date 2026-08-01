import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const source = fs.readFileSync("client/src/components/GoogleMapsEmbed.tsx", "utf8");

test("Google Maps loading cannot cover the iframe indefinitely", () => {
  assert.match(source, /const MAP_LOAD_FALLBACK_MS = 8000/);
  assert.match(source, /window\.setTimeout\(\(\) => setIsLoading\(false\), MAP_LOAD_FALLBACK_MS\)/);
  assert.match(source, /return \(\) => window\.clearTimeout\(fallback\)/);
  assert.match(source, /loadedSrcRef\.current === src/);
  assert.match(source, /loadedSrcRef\.current = src/);
  assert.match(source, /\[showLoading, src\]/);
  assert.match(source, /data-testid=\{`google-maps-loading-\$\{context\}`\}/);
});
