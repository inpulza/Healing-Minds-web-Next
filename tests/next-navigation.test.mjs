import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const sourceRoot = path.join(process.cwd(), "client", "src");

function sourceFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(file);
    return /\.tsx?$/.test(entry.name) ? [file] : [];
  });
}

test("Next-owned production components do not depend on the Wouter runtime", () => {
  const offenders = sourceFiles(sourceRoot)
    .filter((file) => !file.endsWith(`${path.sep}App.tsx`))
    .filter((file) => /from\s+["']wouter["']/.test(fs.readFileSync(file, "utf8")))
    .map((file) => path.relative(process.cwd(), file));

  assert.deepEqual(offenders, []);
});
