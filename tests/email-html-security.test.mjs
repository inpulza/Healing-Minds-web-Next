import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

const cwd = new URL("..", import.meta.url).pathname.replace(/^\/(?:[A-Za-z]:)/, value => value.slice(1));

test("contact email HTML escapes user-controlled fields", () => {
  const script = [
    'import { escapeEmailHtml } from "./server/services/email.ts";',
    'process.stdout.write(escapeEmailHtml(`<img src=x onerror="alert(1)">&\'`));',
  ].join("\n");
  const output = execFileSync(process.execPath, ["--import", "tsx", "--input-type=module", "--eval", script], {
    cwd,
    encoding: "utf8",
  });
  assert.equal(output, "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;&amp;&#39;");
});
