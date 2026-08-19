import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import test from "node:test";

const root = resolve(import.meta.dirname, "..");
const publicSourceRoots = ["app", "client", "public", "server", "shared"];
const textExtensions = new Set([".css", ".html", ".js", ".json", ".jsx", ".mjs", ".ts", ".tsx"]);
const unsupportedPlanPattern = /florida\s*blue|blue\s*cross\s*blue\s*shield|bluecross\s*blueshield/i;

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return walk(path);
    return statSync(path).isFile() ? [path] : [];
  });
}

test("unsupported Florida Blue coverage is absent from every public source", () => {
  const violations = [];

  for (const sourceRoot of publicSourceRoots) {
    const absoluteRoot = join(root, sourceRoot);
    if (!existsSync(absoluteRoot)) continue;

    for (const file of walk(absoluteRoot)) {
      if (!textExtensions.has(extname(file))) continue;
      if (unsupportedPlanPattern.test(readFileSync(file, "utf8"))) {
        violations.push(relative(root, file));
      }
    }
  }

  assert.deepEqual(violations, []);
});

test("the retired Florida Blue logo assets are deleted", () => {
  assert.equal(existsSync(join(root, "attached_assets", "6_1755868276798.webp")), false);
  assert.equal(existsSync(join(root, "attached_assets", "6_1755868276798.png")), false);
});
