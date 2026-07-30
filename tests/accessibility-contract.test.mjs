import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

test("primary green actions use AA contrast for white text", () => {
  const header = read("client/src/components/Header.tsx");
  const hero = read("client/src/components/Hero.tsx");
  const cookies = read("client/src/components/CookieBanner.tsx");
  const toolbar = read("client/src/components/MobileToolbar.tsx");

  assert.match(header, /bg-green-700 text-white hover:bg-green-800/);
  assert.match(hero, /bg-\[#15803d\]/);
  assert.match(cookies, /data-testid="button-accept-all"[\s\S]{0,180}bg-green-700/);
  assert.match(toolbar, /text-green-700 hover:text-green-800 active:text-green-900/);
});

test("toolbar and dropdown accessible names contain their visible labels", () => {
  const header = read("client/src/components/Header.tsx");
  const toolbar = read("client/src/components/MobileToolbar.tsx");

  assert.match(toolbar, /aria-label=\{`\$\{button\.label\}:/);
  assert.match(toolbar, /<IconComponent[\s\S]{0,240}aria-hidden="true"/);
  assert.match(header, /aria-label=\{`\$\{item\.label\}:/);
});
