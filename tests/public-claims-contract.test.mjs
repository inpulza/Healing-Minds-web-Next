import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import test from "node:test";

const root = resolve(import.meta.dirname, "..");
const publicSourceRoots = ["app", "client", "public", "server", "shared"];
const textExtensions = new Set([".html", ".js", ".json", ".jsx", ".mjs", ".ts", ".tsx"]);

const hardcodedTestimonialPattern = /(?:^|[^\w])(?:J\.D\.|A\.S\.|M\.R\.)(?=$|[^\w])|Real stories from patients|Historias reales de pacientes/i;
const unsupportedExperiencePattern = /15\+|(?:over|more than)\s+15\s+years|15\s+years(?:\s+of)?\s+experience|(?:m[aá]s de|durante m[aá]s de)\s+15\s+a[nñ]os|15\s+a[nñ]os(?:\s+de)?\s+experiencia/i;
const unsupportedCredentialPattern = /Specialized Training in Cultural Competency|Entrenamiento Especializado en Competencia Cultural|Professional Certification|Certificaci[oó]n Profesional|University of Miami(?: Miller School of Medicine)?|American Psychiatric Association|APA Member|countless stories of transformation|innumerables historias de transformaci[oó]n/i;
const unsupportedBiographyPattern = /native Spanish|Spanish is (?:her|his) native language|Spanish \(native\)|natively in both languages|natively in both English and Spanish|espa[nñ]ol nativo|espa[nñ]ol \(nativo\)|hablante nativa de espa[nñ]ol|hablante nativo de espa[nñ]ol|habla espa[nñ]ol de forma nativa|hija de inmigrantes|daughter of immigrants/i;
const unsupportedFaxPattern = /239[- )]330[- ]2073/;

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return walk(path);
    return statSync(path).isFile() ? [path] : [];
  });
}

function publicTextFiles() {
  return publicSourceRoots.flatMap((sourceRoot) => {
    const absoluteRoot = join(root, sourceRoot);
    if (!existsSync(absoluteRoot)) return [];
    return walk(absoluteRoot).filter((file) => textExtensions.has(extname(file)));
  });
}

test("hardcoded testimonials and unsupported credentials are absent from public sources", () => {
  const violations = [];
  for (const file of publicTextFiles()) {
    const content = readFileSync(file, "utf8");
    for (const [label, pattern] of [
      ["hardcoded testimonial", hardcodedTestimonialPattern],
      ["unsupported experience", unsupportedExperiencePattern],
      ["unsupported credential", unsupportedCredentialPattern],
      ["unsupported biography", unsupportedBiographyPattern],
      ["unsupported fax", unsupportedFaxPattern],
    ]) {
      if (pattern.test(content)) violations.push(`${relative(root, file)}: ${label}`);
    }
  }
  assert.deepEqual(violations, []);
});

test("the hardcoded testimonial component, lazy export and duplicate data are removed", () => {
  assert.equal(existsSync(join(root, "client/src/components/Testimonials.tsx")), false);
  const lazyComponents = readFileSync(join(root, "client/src/components/LazyComponents.tsx"), "utf8");
  const home = readFileSync(join(root, "client/src/pages/Home.tsx"), "utf8");
  const homeEs = readFileSync(join(root, "client/src/pages/HomeEspanol.tsx"), "utf8");
  const content = readFileSync(join(root, "client/src/data/content.ts"), "utf8");
  assert.doesNotMatch(`${lazyComponents}\n${home}\n${homeEs}`, /LazyTestimonials|\.\/Testimonials/);
  assert.doesNotMatch(content, /export const testimonials\b/);
});

test("public review UI remains API-backed and contains no static review array", () => {
  const reviews = readFileSync(join(root, "client/src/components/Reviews.tsx"), "utf8");
  const snapshot = JSON.parse(readFileSync(join(root, "shared/reviews-snapshot.json"), "utf8"));
  const nextApi = readFileSync(join(root, "app/api/reviews/route.ts"), "utf8");
  const sharedSchema = readFileSync(join(root, "shared/schema.ts"), "utf8");
  const staticReviewSource = readFileSync(join(root, "server/data/static-reviews.ts"), "utf8");
  assert.match(reviews, /queryKey:\s*\[['"]\/api\/reviews['"]\]/);
  assert.match(reviews, /reviewsData\?\.data\?\.reviews/);
  assert.doesNotMatch(reviews, /const\s+reviews\s*=\s*\[/);
  assert.match(reviews, /Reviews retrieved through our public review feed/);
  assert.match(reviews, /Reseñas obtenidas a través de nuestro canal público de reseñas/);
  assert.match(reviews, /Public reviewer/);
  assert.match(reviews, /Autor de reseña pública/);
  assert.doesNotMatch(reviews, /Verified|Verificado|['"]Patient['"]|['"]Paciente['"]|View this review on Google|Ver esta reseña en Google/);
  assert.match(reviews, /Leave a review on Google/);
  assert.match(reviews, /Dejar una reseña en Google/);
  assert.match(reviews, /formatAbsoluteDate\(review\.createdAt\)/);
  assert.doesNotMatch(reviews, /\{review\.date\}/);
  assert.match(reviews, /reviews-updated-at/);
  assert.match(snapshot.fetchedAt, /^2026-07-30T11:17:38\.000Z$/);
  assert.match(nextApi, /fetchedAt:\s*new Date\(\)\.toISOString\(\)/);
  assert.match(nextApi, /fetchedAt:\s*staticReviewsFetchedAt/);
  assert.match(sharedSchema, /fetchedAt:\s*z\.string\(\)\.datetime\(\{ offset: true \}\)/);
  assert.doesNotMatch(sharedSchema, /fetchedAt:\s*z\.date\(\)/);
  assert.match(staticReviewSource, /staticReviewsFetchedAt = snapshot\.fetchedAt/);
});

test("About credentials use the documented primary-source facts", () => {
  const about = readFileSync(join(root, "client/src/data/pageContent/mainPages/about.ts"), "utf8");
  assert.match(about, /Doctor of Medicine \(M\.D\.\)/);
  assert.match(about, /Active Florida medical license ME165518/i);
  assert.match(about, /Psychiatric Residency Training/);
  assert.match(about, /Residencia en Psiquiatría/);
});

test("California campaign license wording and intentional noindex policy stay exact", () => {
  const page = readFileSync(join(root, "client/src/pages/PsiquiatraCalifornia.tsx"), "utf8");
  const manifest = readFileSync(join(root, "shared/routeManifest.ts"), "utf8");
  assert.match(page, /California Physician and Surgeon License · A198275/);
  assert.match(page, /Licencia médica de California · A198275/);
  assert.doesNotMatch(page, /California Licensed Psychiatrist|Psiquiatra con Licencia en California/);
  assert.match(manifest, /A198275 verified 2026-08-21, expires 2026-10-31/);
  assert.match(
    manifest,
    /en: '\/psychiatrist-california'.*inSitemap: false, noindex: true, routed: true/,
  );
  assert.doesNotMatch(
    page,
    /You always talk to her|Hablas siempre con ella|direct pay|pago directo|no insurance|sin seguros|prior authorizations?|autorizaciones previas|billing surprises?|sorpresas? en la factura|surprise copays?|copagos sorpresa|taking the day off|pedir el día libre|from wherever you are|desde donde estés|continuous follow-up|seguimiento continuo|regular follow-up|citas periódicas/i,
  );
  assert.match(page, /The office confirms clinician, price, modality, availability and eligibility before booking/);
  assert.match(page, /El paciente debe estar físicamente donde el profesional tratante confirmado esté autorizado para brindar atención/);
});

test("public NAP keeps one primary phone and WhatsApp stays outside schema telephone", () => {
  const profile = readFileSync(join(root, "shared/practice-profile.ts"), "utf8");
  const schemaSources = [
    "app/_seo/structured-data.ts",
    "server/utils/html-injection.ts",
    "shared/practice-profile.ts",
  ].map((path) => readFileSync(join(root, path), "utf8")).join("\n");
  assert.match(profile, /phoneDisplay:\s*"\(239\) 423-0272"/);
  assert.match(profile, /phoneE164:\s*"\+1-239-423-0272"/);
  assert.doesNotMatch(schemaSources, /239[- )]?920[- ]?1019|12399201019/);
});

test("versioned primary-source registry documents every public identity and license claim", () => {
  const registry = JSON.parse(
    readFileSync(join(root, "shared/public-claims-sources.json"), "utf8"),
  );
  const requiredIds = [
    "florida-license-me165518",
    "california-license-a198275",
    "nppes-organization-1417786278",
    "nppes-person-1982233631",
    "google-business-profile-cid-4284755814550718591",
    "larkin-psychiatry-alumni-2023-2024",
    "david-lawrence-centers-general-information",
    "david-lawrence-centers-crisis-line",
    "florida-telehealth-statute-456-47",
    "california-telehealth-code-2290-5",
    "social-facebook-healing-minds",
    "social-youtube-healing-minds",
    "social-linkedin-melva-reve",
    "social-instagram-melvareve-md",
    "social-tiktok-melvareve-md",
  ];
  const registryIds = registry.map((entry) => entry.id);
  assert.equal(new Set(registryIds).size, registryIds.length, "source registry IDs must be unique");
  for (const requiredId of requiredIds) {
    assert.ok(registryIds.includes(requiredId), `missing required source: ${requiredId}`);
  }
  const today = new Date().toISOString().slice(0, 10);
  for (const entry of registry) {
    assert.equal(typeof entry.claim, "string");
    assert.ok(entry.claim.length > 20, `${entry.id}: claim must be specific`);
    assert.equal(new URL(entry.sourceUrl).protocol, "https:", `${entry.id}: source URL`);
    assert.match(entry.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(entry.verifiedAt <= "2026-08-21", `${entry.id}: verification cannot be future-dated`);
    assert.match(entry.reverifyBy, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(today <= entry.reverifyBy, `${entry.id}: evidence requires re-verification`);
    if (entry.expiresAt) {
      assert.match(entry.expiresAt, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(today <= entry.expiresAt, `${entry.id}: source record is expired`);
    }
  }
  const california = registry.find((entry) => entry.id === "california-license-a198275");
  assert.equal(california.sourceUrl, "https://search.dca.ca.gov/profile/800/8002/198275/A");
  assert.equal(california.expiresAt, "2026-10-31");
  assert.ok(california.expiresAt > california.verifiedAt);
  const florida = registry.find((entry) => entry.id === "florida-license-me165518");
  assert.equal(florida.expiresAt, "2028-01-31");
  const crisis = registry.find((entry) => entry.id === "david-lawrence-centers-crisis-line");
  assert.equal(crisis.sourceUrl, "https://davidlawrencecenters.org/emergency-mental-health-services/");
});

test("crisis resources keep the official David Lawrence line distinct from general information", () => {
  const publicSources = publicTextFiles()
    .filter((file) => !file.endsWith("public-claims-sources.json"))
    .map((file) => readFileSync(file, "utf8"))
    .join("\n");
  const contact = readFileSync(join(root, "client/src/components/Contact.tsx"), "utf8");
  const policy = readFileSync(join(root, "client/src/data/pageContent/legal/emergencyPolicy.ts"), "utf8");
  assert.doesNotMatch(publicSources, /239[- )]455[- ]8500/);
  assert.match(contact, /\(239\) 352-4357/);
  assert.match(policy, /\(239\) 352-4357 \(239-DLC-HELP\)/);
  assert.match(policy, /Call or text 988/);
  assert.match(policy, /Call 911/);
});

test("community resource blocks avoid volatile third-party metrics and implied endorsement", () => {
  const locationFiles = [
    "LocationAveMaria.tsx",
    "LocationBonitaSprings.tsx",
    "LocationEstero.tsx",
    "LocationFortMyers.tsx",
    "LocationGoldenGate.tsx",
    "LocationImmokalee.tsx",
    "LocationLelyResorts.tsx",
    "LocationMarcoIsland.tsx",
    "LocationNaples.tsx",
    "LocationVanderbiltBeach.tsx",
  ];
  const volatileMetric = /\b(?:acres?|members?|miembros?|annually|anualmente|weekly|semanalmente|largest|recent|recently|monthly|mensuales)\b|(?:for|over)\s+\d+\s+years|(?:por|durante)\s+m[aá]s de\s+\d+\s+a[nñ]os|\d{1,3}(?:,\d{3})+/i;
  for (const file of locationFiles) {
    const source = readFileSync(join(root, "client/src/pages", file), "utf8");
    const start = source.indexOf("Community Involvement Section");
    const end = source.indexOf("Video Section", start);
    assert.ok(start >= 0, `${file}: community block marker missing`);
    assert.ok(end > start, `${file}: video boundary marker missing`);
    const block = source.slice(start, end).replaceAll("2-1-1", "");
    assert.doesNotMatch(block, volatileMetric, file);
    assert.doesNotMatch(block, /We proudly support|Apoyamos con orgullo|Support Their|Apoyar Su|strategic partnerships|our partnership|nuestra colaboración/i, file);
    assert.match(block, /Independent Local/);
    assert.match(block, /Recursos Locales/);
  }
});

test("parking and legacy llms copy remain conservative", () => {
  const relevant = [
    "client/src/data/pageContent/mainPages/contact.ts",
    "client/src/data/pageContent/mainPages/naples.ts",
    "client/src/components/GoogleMapsEmbed.tsx",
    "client/src/data/locationFAQs.ts",
    "client/src/data/locationHyperlocal.ts",
    ...readdirSync(join(root, "client/src/pages"))
      .filter((name) => /^Location.*\.tsx$/.test(name))
      .map((name) => `client/src/pages/${name}`),
  ].map((path) => readFileSync(join(root, path), "utf8")).join("\n");
  assert.doesNotMatch(relevant, /ample parking|free,? convenient parking|easy parking|estacionamiento (?:amplio|gratuito|fácil)|amplio estacionamiento|estacionamiento gratuito|estacionamiento fácil/i);
  const legacySitemap = readFileSync(join(root, "server/routes/sitemap.ts"), "utf8");
  assert.doesNotMatch(legacySitemap, /Expert, compassionate treatment|Telepsychiatry available throughout Florida/);
  assert.match(legacySitemap, /Legacy bilingual/);
});
