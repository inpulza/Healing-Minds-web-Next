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

test("language switching uses a document navigation and keeps the full header below xl", () => {
  const header = fs.readFileSync(path.join(sourceRoot, "components", "Header.tsx"), "utf8");
  assert.match(header, /window\.location\.assign\(correspondingURL\)/);
  assert.doesNotMatch(header, /navigate\(correspondingURL\)/);
  assert.match(header, /hidden xl:flex flex-1/);
  assert.match(header, /xl:hidden ml-auto/);
  assert.match(header, /xl:hidden bg-white\/98/);
});

test("the Next navigation adapter keeps navigate stable across renders", () => {
  const navigation = fs.readFileSync(path.join(sourceRoot, "lib", "navigation.tsx"), "utf8");
  assert.match(navigation, /useCallback/);
  assert.match(navigation, /const navigate = useCallback/);
  assert.match(navigation, /\}, \[router\]\)/);
});
