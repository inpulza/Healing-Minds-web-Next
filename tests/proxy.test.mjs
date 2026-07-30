import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const proxyPath = path.join(process.cwd(), "proxy.ts");

test("Next proxy preserves canonical-host and legacy-spam HTTP semantics", () => {
  assert.equal(fs.existsSync(proxyPath), true, "missing Next proxy");
  const source = fs.readFileSync(proxyPath, "utf8");
  assert.match(source, /export\s+function\s+proxy/);
  assert.match(source, /status:\s*410/);
  assert.match(source, /status:\s*403/);
  assert.match(source, /www\.healingmindsp\.com/);
  assert.doesNotMatch(source, /console\.log/);
});
