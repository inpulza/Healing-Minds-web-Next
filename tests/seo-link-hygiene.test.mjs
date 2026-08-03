import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const read = (relative) => fs.readFileSync(path.join(process.cwd(), relative), "utf8");

const publicSourceFiles = [
  "client/src/data/pageContent/legal/patientRights.ts",
  "client/src/pages/LocationNaples.tsx",
  "client/src/pages/LocationImmokalee.tsx",
  "client/src/pages/LocationFortMyers.tsx",
  "client/src/pages/LocationEstero.tsx",
  "client/src/pages/LocationGoldenGate.tsx",
];

test("retired public resource URLs cannot return to active page source", () => {
  const source = publicSourceFiles.map(read).join("\n");
  const retiredUrls = [
    "https://www.ahca.myflorida.com",
    "https://apps.ahca.myflorida.com/smcforms/",
    "https://www.unitedwayofc.org/",
    "https://www.immokaleeca.org/",
    "https://www.harrychapinfoodbank.org/",
    "https://engageestero.org/",
    "https://ggeaca.org/",
  ];

  for (const url of retiredUrls) {
    assert.equal(source.includes(url), false, `retired URL still present: ${url}`);
  }

  for (const url of [
    "https://ahca.myflorida.com/",
    "https://apps.ahca.myflorida.com/hcfc/",
    "https://uwcollierkeys.org/",
    "https://www.coffo.org/",
    "https://harrychapinfoodbank.org/",
    "https://esterotoday.com/",
  ]) {
    assert.equal(source.includes(url), true, `verified replacement missing: ${url}`);
  }
});

test("privacy and cookie links use descriptive labels instead of raw URLs", () => {
  const legalSource = [
    read("client/src/data/pageContent/legal/cookiePolicy.ts"),
    read("client/src/data/pageContent/legal/privacyPolicy.ts"),
  ].join("\n");

  assert.doesNotMatch(
    legalSource,
    /\[\s*https?:\/\/[^\]]+\]\(https?:\/\/[^)]+\)/,
    "a raw URL is still being used as visible anchor text",
  );
  for (const label of [
    "Google Analytics opt-out add-on",
    "Google My Ad Center",
    "Microsoft privacy dashboard",
    "Complemento de inhabilitación de Google Analytics",
    "Mi Centro de Anuncios de Google",
    "Panel de privacidad de Microsoft",
  ]) {
    assert.equal(legalSource.includes(`[${label}]`), true, `descriptive label missing: ${label}`);
  }
});

test("service pages expose the three contextual blog paths in server-rendered markup", () => {
  const anxiety = read("client/src/pages/services/AnxietyTreatment.tsx");
  const bipolar = read("client/src/pages/services/BipolarTreatment.tsx");

  assert.match(anxiety, /\/blog\/understanding-anxiety-treatment-naples/);
  assert.match(anxiety, /\/es\/blog\/tratamiento-ansiedad-naples/);
  assert.match(bipolar, /\/blog\/bipolar-medication-follow-up-questions/);
});

test("the sitemap keeps the canonical trailing slash on the English home", () => {
  const sitemap = read("app/sitemap.ts");

  assert.match(sitemap, /en: `\$\{ORIGIN\}\$\{entry\.en\}`/);
  assert.doesNotMatch(sitemap, /entry\.en === "\/" \? ""/);
});
