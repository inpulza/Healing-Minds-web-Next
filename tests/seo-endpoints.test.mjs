import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const read = (relative) => fs.readFileSync(path.join(process.cwd(), relative), "utf8");
const filesUnder = (relative) => fs.readdirSync(path.join(process.cwd(), relative), { withFileTypes: true })
  .flatMap((entry) => entry.isDirectory()
    ? filesUnder(path.join(relative, entry.name))
    : [path.join(relative, entry.name)]);

test("Next owns sitemap, robots and llms endpoints without blocking its assets", () => {
  for (const file of ["app/sitemap.ts", "app/robots.ts", "app/llms.txt/route.ts"]) {
    assert.equal(fs.existsSync(path.join(process.cwd(), file)), true, `missing ${file}`);
  }
  assert.match(read("app/sitemap.ts"), /getSitemapEntries/);
  assert.match(read("app/robots.ts"), /sitemap/i);
  assert.doesNotMatch(read("app/robots.ts"), /Disallow[^\n]*\/_next/i);
  assert.match(read("app/llms.txt/route.ts"), /text\/plain/);
  assert.match(read("app/llms.txt/route.ts"), /getBlogPosts/);
  assert.match(read("app/llms.txt/route.ts"), /Object\.values\(blogSnapshot\)/);
  assert.match(read("app/llms.txt/route.ts"), /export const revalidate = 86400/);
  assert.doesNotMatch(read("app/llms.txt/route.ts"), /catch \(error\)[\s\S]*blogSnapshot/);

  for (const bot of [
    "Googlebot",
    "Bingbot",
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-SearchBot",
    "Claude-User",
    "PerplexityBot",
  ]) {
    assert.match(read("app/robots.ts"), new RegExp(`['\"]${bot}['\"]`));
  }
});

test("public NAP sources use the exact GBP suite format and shared profile", () => {
  for (const file of [...filesUnder("app"), ...filesUnder("client/src"), ...filesUnder("shared")]) {
    if (!/\.(?:ts|tsx|js|mjs|json)$/.test(file)) continue;
    assert.doesNotMatch(read(file), /4760 Tamiami (?:Trl|Trail) N # 25/, file);
  }
  for (const file of [
    "client/src/components/Contact.tsx",
    "client/src/components/Footer.tsx",
    "client/src/components/ServiceAreas.tsx",
  ]) {
    assert.match(read(file), /practiceProfile/, file);
  }
});

test("Fort Myers directions consistently send patients south to the Naples office", () => {
  const page = read("client/src/pages/LocationFortMyers.tsx");
  const hyperlocal = read("client/src/data/locationHyperlocal.ts");
  assert.match(page, /I-75 South toward Naples/);
  assert.match(page, /I-75 Sur hacia Naples/);
  assert.match(page, /local\.duration\[language\]/);
  assert.doesNotMatch(page, /(?:north|norte)[^\n]{0,80}(?:Naples|4760)|(?:10|12|15)-20 minutes/i);
  assert.match(hyperlocal, /duration: \{ en: '40-45 minutes', es: '40-45 minutos' \}/);
  assert.match(hyperlocal, /I-75 connects Fort Myers with our Park Shore office to the south/);
  assert.doesNotMatch(hyperlocal, /scheduling the first visit mid-morning|programar la primera visita a media mañana/i);
});

test("all service-area pages share one conservative travel-time source", () => {
  const pages = [
    "client/src/pages/LocationBonitaSprings.tsx",
    "client/src/pages/LocationEstero.tsx",
    "client/src/pages/LocationFortMyers.tsx",
    "client/src/pages/LocationAveMaria.tsx",
    "client/src/pages/LocationVanderbiltBeach.tsx",
    "client/src/pages/LocationLelyResorts.tsx",
    "client/src/pages/LocationMarcoIsland.tsx",
    "client/src/pages/LocationImmokalee.tsx",
    "client/src/pages/LocationGoldenGate.tsx",
  ];

  for (const file of pages) {
    const page = read(file);
    assert.match(page, /local\.duration\[language\]/, file);
    assert.match(page, /Psychiatrist<\/span> Serving/, file);
    assert.match(page, /Psiquiatra<\/span> para residentes de/, file);
    assert.doesNotMatch(page, /\? '\d+[–-]\d+ minutes'\s*:\s*'\d+[–-]\d+ minutos'/i, file);
    assert.doesNotMatch(page, /Psychiatrist<\/span> in|Psiquiatra<\/span> de Confianza en/i, file);
    assert.doesNotMatch(page, /Visit Our .* Location|Visite Nuestra Ubicación|Services at This Location|Servicios en Esta Ubicación/i, file);
    assert.doesNotMatch(page, /\b(?:Exit|Salida) \d+\b/i, file);
  }

  for (const file of [
    "client/src/pages/LocationBonitaSprings.tsx",
    "client/src/pages/LocationEstero.tsx",
    "client/src/pages/LocationFortMyers.tsx",
    "client/src/pages/LocationImmokalee.tsx",
  ]) {
    assert.doesNotMatch(
      read(file),
      /(?:north|norte)[^\n]{0,100}(?:toward|hacia|continue|continúe)[^\n]{0,60}(?:Naples|4760)/i,
      file,
    );
  }

  const hyperlocal = read("client/src/data/locationHyperlocal.ts");
  assert.match(hyperlocal, /bonitaSprings:[\s\S]*?duration: \{ en: '15-20 minutes', es: '15-20 minutos' \}/);
  assert.match(hyperlocal, /estero:[\s\S]*?duration: \{ en: '25-30 minutes', es: '25-30 minutos' \}/);
  assert.match(hyperlocal, /fortMyers:[\s\S]*?duration: \{ en: '40-45 minutes', es: '40-45 minutos' \}/);
  assert.match(hyperlocal, /marcoIsland:[\s\S]*?duration: \{ en: '25-30 minutes', es: '25-30 minutos' \}/);
  assert.match(hyperlocal, /immokalee:[\s\S]*?duration: \{ en: '50-60 minutes', es: '50-60 minutos' \}/);
  assert.match(hyperlocal, /aveMaria:[\s\S]*?duration: \{ en: '50-60 minutes', es: '50-60 minutos' \}/);
});

test("local pages cannot reintroduce false routes or unverified operational claims", () => {
  const sources = [
    "client/src/data/locationFAQs.ts",
    "client/src/data/locationHyperlocal.ts",
    "client/src/data/pageContent/mainPages/naples.ts",
    ...filesUnder("client/src/pages").filter((file) => /Location[^/\\]+\.tsx$/.test(file)),
  ].map((file) => `${file}\n${read(file)}`).join("\n");

  for (const pattern of [
    /Exit 116[^\n]{0,60}Pine Ridge|Exit 105[^\n]{0,60}Immokalee/i,
    /Waterside[^\n]{0,120}(?:head|diríjase)[^\n]{0,40}north|Waterside[^\n]{0,120}norte/i,
    /Airport Pulling Road[^\n]{0,80}(?:head west|hacia el oeste)/i,
    /4760[^\n]{0,100}(?:near|just past|cerca de|justo después de) Wiggins/i,
    /flexible scheduling|horarios flexibles|urgent appointments|citas urgentes/i,
    /Telehealth Anywhere|Telesalud en Cualquier Lugar|when you return north|cuando regres[ae] al norte/i,
    /routinely send|enviamos resúmenes|patients comment|pacientes[^\n]{0,50}comentan/i,
    /we work with Healthcare Network|trabajamos con Healthcare Network/i,
    /first (?:evaluation|visit)[^\n]{0,100}in[- ]person[^\n]{0,100}(?:then|telehealth)/i,
    /primera (?:evaluación|visita)[^\n]{0,100}(?:presencial|en persona)[^\n]{0,100}(?:luego|telesalud)/i,
  ]) {
    assert.doesNotMatch(sources, pattern, pattern.source);
  }

  assert.match(read("client/src/data/locationHyperlocal.ts"), /patient is physically located where Dr\. Reve is authorized/);
  assert.match(read("client/src/data/locationHyperlocal.ts"), /ubicación del paciente y licencias aplicables/);
});

test("the active Next blog auditor no longer imports the legacy HTML injector", () => {
  assert.match(read("server/blog/links/audit.ts"), /routing\/is-known-route/);
  assert.doesNotMatch(read("server/blog/links/audit.ts"), /utils\/html-injection/);
  assert.match(read("server/routing/is-known-route.ts"), /getKnownRoutePaths/);
  assert.match(read("server/utils/html-injection.ts"), /LEGACY EXPRESS\/VITE RENDERER ONLY/);
});

test("admin pages stay crawlable for noindex while private APIs remain blocked", () => {
  const robots = read("app/robots.ts");
  const sitemap = read("app/sitemap.ts");

  assert.doesNotMatch(robots, /["']\/admin(?:\/\*?|[*])?["']/);
  assert.match(robots, /["']\/api\/admin\/["']/);
  assert.doesNotMatch(sitemap, /\/admin(?:\/|["'`])/);
});

test("blog sitemap preserves the historical hreflang contract", () => {
  const sitemap = read("app/sitemap.ts");

  assert.match(sitemap, /"x-default": `\$\{ORIGIN\}\/blog`/);
  assert.match(sitemap, /export const revalidate = 86400/);
  assert.match(sitemap, /Object\.values\(blogSnapshot\)/);
  assert.match(sitemap, /preserving last valid sitemap/);
  assert.match(sitemap, /catch \(error\)[\s\S]*throw error/);
  assert.match(sitemap, /buildBlogSitemapEntries\(ORIGIN, publishedPosts\)/);
});
