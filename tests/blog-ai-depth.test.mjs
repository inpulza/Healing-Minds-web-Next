import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

test("short AI drafts receive one safe mocked expansion pass", () => {
  const result = spawnSync(
    process.execPath,
    ["--import", "tsx", "scripts/blog-ai-depth-guards.ts"],
    {
      cwd: process.cwd(),
      encoding: "utf8",
      maxBuffer: 5 * 1024 * 1024,
    },
  );

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(
    result.stdout,
    /PASS blog AI depth expansion guards \(one retry, no real provider or secrets\)/,
  );
});
