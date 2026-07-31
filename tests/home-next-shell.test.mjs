import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("the responsive hero keeps one semantic h1 and one visible test target per layout", () => {
  const hero = read("client/src/components/Hero.tsx");
  assert.match(hero, /const isMobile = useIsMobile\(\)/);
  assert.match(hero, /<p[^>]*data-testid=\{isMobile \? ['"]hero-title['"] : undefined\}/s);
  assert.match(hero, /<h1[^>]*data-testid=\{!isMobile \? ['"]hero-title['"] : undefined\}/s);
  assert.doesNotMatch(hero, /hero-title-mobile/);
  assert.equal((hero.match(/<h1\b/g) ?? []).length, 1);
});

test("the Next root restores the public runtime shell without applying it to admin", () => {
  const providers = read("app/providers.tsx");
  const shell = read("app/public-shell.tsx");

  assert.match(providers, /PublicShell/);
  assert.match(shell, /pathname\.startsWith\(["']\/admin["']\)/);
  for (const runtime of [
    "MobileToolbar",
    "CookieBanner",
    "TelehealthVideoWidget",
    "WhatsAppFloatingButton",
    "useAnalytics",
    "useClarity",
    "useTikTokPixel",
    "useScrollToTop",
    "initGA",
    "handleConsentChange",
  ]) {
    assert.match(shell, new RegExp(runtime), `missing ${runtime} from the public shell`);
  }
});
