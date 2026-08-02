import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));

test("the application has a real Next.js App Router entrypoint", () => {
  assert.equal(exists("app/layout.tsx"), true, "missing app/layout.tsx");
  assert.equal(exists("app/page.tsx"), true, "missing app/page.tsx");
  assert.equal(exists("next.config.mjs"), true, "missing next.config.mjs");

  const pkg = JSON.parse(read("package.json"));
  assert.match(pkg.scripts?.dev ?? "", /next dev/);
  assert.match(pkg.scripts?.build ?? "", /next build/);
  assert.equal(typeof pkg.dependencies?.next, "string", "next must be a runtime dependency");
});

test("the root route renders owned React content instead of a frozen HTML snapshot", () => {
  const page = read("app/page.tsx");
  assert.match(page, /Home/);
  assert.doesNotMatch(page, /readFile|page\.html|dangerouslySetInnerHTML/);
});

test("the Next production path avoids unused animation and Replit runtimes", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.equal(pkg.dependencies?.["framer-motion"], undefined);
  assert.doesNotMatch(pkg.scripts?.dev ?? "", /vite|replit/i);
  assert.doesNotMatch(pkg.scripts?.build ?? "", /vite|replit/i);
  assert.doesNotMatch(pkg.scripts?.start ?? "", /vite|replit/i);
  const packageNames = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  assert.deepEqual(packageNames.filter(name => name.startsWith("@replit/")), []);
});

test("production typography is self-hosted through next/font with the live font families", () => {
  const layout = read("app/layout.tsx");
  const css = read("client/src/index.css");
  assert.match(layout, /next\/font\/google/);
  assert.match(layout, /Instrument_Sans/);
  assert.match(layout, /Playfair_Display/);
  assert.match(layout, /instrumentSans\.variable/);
  assert.match(layout, /playfairDisplay\.variable/);
  assert.match(css, /var\(--font-instrument\)/);
  assert.match(css, /var\(--font-playfair\)/);
});
