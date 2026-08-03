import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("the responsive hero keeps one semantic h1 and one visible test target per layout", () => {
  const hero = read("client/src/components/Hero.tsx");
  assert.match(hero, /const isMobile = useIsMobile\(\)/);
  assert.match(hero, /const MobileTitleTag = isMobile \? ['"]h1['"] : ['"]p['"]/);
  assert.match(hero, /const DesktopTitleTag = isMobile \? ['"]p['"] : ['"]h1['"]/);
  assert.match(hero, /<MobileTitleTag[^>]*data-testid=\{isMobile \? ['"]hero-title['"] : undefined\}/s);
  assert.match(hero, /<DesktopTitleTag[^>]*data-testid=\{!isMobile \? ['"]hero-title['"] : undefined\}/s);
  assert.doesNotMatch(hero, /hero-title-mobile/);
});

test("home demotes the embedded contact heading while contact pages keep their page h1", () => {
  const contact = read("client/src/components/Contact.tsx");
  const home = read("client/src/pages/Home.tsx");
  const homeSpanish = read("client/src/pages/HomeEspanol.tsx");
  const contactPage = read("client/src/pages/Contact.tsx");
  const contactPageSpanish = read("client/src/pages/ContactoEspanol.tsx");

  assert.match(contact, /headingLevel = ['"]h1['"]/);
  assert.match(contact, /const ContactHeading = headingLevel/);
  assert.match(contact, /<ContactHeading[^>]*data-testid=["']contact-title["']/s);
  assert.match(home, /<LazyContact headingLevel=["']h2["']\s*\/>/);
  assert.match(homeSpanish, /<LazyContact headingLevel=["']h2["']\s*\/>/);
  assert.match(contactPage, /<Contact\s*\/>/);
  assert.match(contactPageSpanish, /<Contact\s*\/>/);
});

test("the Next root restores the public runtime shell without applying it to admin", () => {
  const providers = read("app/providers.tsx");
  const layout = read("app/layout.tsx");
  const languageContext = read("client/src/contexts/LanguageContext.tsx");
  const queryClient = read("client/src/lib/queryClient.ts");
  const shell = read("app/public-shell.tsx");
  const trackingConfig = read("client/src/lib/tracking-config.ts");

  assert.match(providers, /PublicShell/);
  assert.match(queryClient, /export function createQueryClient/);
  assert.match(providers, /typeof window === ["']undefined["']/);
  assert.match(providers, /createQueryClient\(\)/);
  assert.match(providers, /browserQueryClient/);
  assert.match(providers, /client=\{nextQueryClient\}/);
  assert.match(layout, /<Providers initialLanguage=\{language\}>/);
  assert.match(providers, /<LanguageProvider initialLanguage=\{initialLanguage\}>/);
  assert.match(languageContext, /useState<Language>\(initialLanguage\)/);
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
  assert.match(trackingConfig, /TIKTOK_PIXEL_SITEWIDE_ENABLED = false/);
  assert.match(shell, /tracking config keeps the Pixel itself disabled sitewide/);
  assert.match(read("client/src/components/Footer.tsx"), /suppressHydrationWarning/);
  assert.match(read("client/src/components/Footer.tsx"), /getUTCFullYear\(\)/);
});

test("route scroll stays native and respects reduced-motion preferences", () => {
  const scrollHook = read("client/src/hooks/useScrollToTop.ts");

  assert.match(scrollHook, /matchMedia\(['"]\(prefers-reduced-motion: reduce\)['"]\)\.matches/);
  assert.match(scrollHook, /behavior: shouldReduceMotion \? ['"]auto['"] : ['"]smooth['"]/);
  assert.doesNotMatch(scrollHook, /lenis/i);
});

test("the telehealth widget keeps its interactions without shipping an animation runtime", () => {
  const widget = read("client/src/components/TelehealthVideoWidget.tsx");

  assert.doesNotMatch(widget, /framer-motion|AnimatePresence|<motion\./);
  assert.match(widget, /animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4/);
  assert.match(widget, /transition-transform hover:scale-105 active:scale-95/);
  assert.match(widget, /if \(event\.key === ['"]Escape['"]\) collapse\(\)/);
  assert.match(widget, /trackLeadConversion\(['"]appointment_booking['"]/);
  assert.match(widget, /trackLeadConversion\(['"]phone_call['"]/);
});
