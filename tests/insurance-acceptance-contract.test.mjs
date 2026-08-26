import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import test from "node:test";

const root = resolve(import.meta.dirname, "..");
const publicSourceRoots = ["app", "client", "public", "server", "shared"];
const textExtensions = new Set([".css", ".html", ".js", ".json", ".jsx", ".mjs", ".ts", ".tsx"]);
const unsupportedCarrierPattern = /\b(?:Florida\s*Blue|Blue\s*Cross(?:\s*Blue\s*Shield)?|BCBS)\b/i;
const retiredAssetPattern = /(?:6_1755868276798|florida[-_ ]?blue|blue[-_ ]?cross(?:[-_ ]?blue[-_ ]?shield)?|bcbs)/i;
const unsupportedBroadClaimPatterns = [
  /\b(?:most|several|major)\s+(?:major\s+)?(?:commercial\s+)?insurance\s+plans?\b/i,
  /\btele(?:health|psychiatry)[^.!?\n]{0,80}\bcovered\b/i,
  /\bcovered[^.!?\n]{0,80}\b(?:same as|like)\s+in-person\b/i,
  /\b(?:flexible\s+)?payment\s+plans?\s+(?:are\s+)?available\b/i,
  /\bla mayor[ií]a de (?:los )?(?:principales )?planes de seguro\b/i,
  /\bse aceptan? (?:la mayor[ií]a de )?(?:los )?(?:principales )?planes? de seguro\b/i,
  /\btele(?:salud|psiquiatr[ií]a)[^.!?\n]{0,80}\bcubiert[ao]s?\b/i,
  /\bplanes? de pago (?:flexibles )?(?:est[aá]n )?disponibles\b/i,
];

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

test("Florida Blue, BCBS and unverified broad promises are absent from public sources", () => {
  const violations = [];

  for (const file of publicTextFiles()) {
    const content = readFileSync(file, "utf8");
    if (unsupportedCarrierPattern.test(content)) {
      violations.push(`${relative(root, file)}: named carrier`);
    }
    for (const pattern of unsupportedBroadClaimPatterns) {
      if (pattern.test(content)) {
        violations.push(`${relative(root, file)}: ${pattern.source}`);
      }
    }
  }

  assert.deepEqual(violations, []);
});

test("retired Florida Blue assets cannot be imported or allowlisted for deployment", () => {
  const deploymentConfig = readFileSync(join(root, ".vercelignore"), "utf8");
  assert.doesNotMatch(deploymentConfig, retiredAssetPattern);

  const deployableAssetRoots = ["public", "client/src/assets", "attached_assets"];
  const retiredPaths = deployableAssetRoots.flatMap((sourceRoot) => {
    const absoluteRoot = join(root, sourceRoot);
    if (!existsSync(absoluteRoot)) return [];
    return walk(absoluteRoot)
      .map((file) => relative(root, file))
      .filter((file) => retiredAssetPattern.test(file));
  });

  assert.deepEqual(retiredPaths, []);
});

test("the legacy renderer cannot reintroduce stale local or billing claims", () => {
  const legacy = readFileSync(join(root, "server", "utils", "html-injection.ts"), "utf8");

  assert.doesNotMatch(legacy, /isAcceptingNewPatients|paymentAccepted|priceRange/);
  assert.doesNotMatch(legacy, /26\.2044803|-81\.8021344|4760 Tamiami Trl N # 25/);
  assert.match(legacy, /4760 Tamiami Trl N #25/);
  assert.match(legacy, /google\.com\/maps\?cid=4284755814550718591/);
});

test("the canonical registry contains exactly the fourteen approved plans", () => {
  const registry = readFileSync(join(root, "client/src/data/acceptedInsurancePlans.ts"), "utf8");
  const names = [...registry.matchAll(/name: '([^']+)'/g)].map((match) => match[1]);

  assert.deepEqual(names, [
    "Aetna",
    "United Healthcare",
    "Medicare",
    "Medicaid",
    "Cigna",
    "Ambetter",
    "First Health",
    "Oscar",
    "WellCare",
    "Sunshine Health",
    "AvMed",
    "Doctors Healthcare Plans",
    "CHAMPVA",
    "Florida Medicaid",
  ]);
  assert.doesNotMatch(registry, unsupportedCarrierPattern);
  assert.doesNotMatch(registry, retiredAssetPattern);
});

test("Home, Contact and location sections all mount the shared accepted-plan gallery", () => {
  const components = [
    ["client/src/components/InsuranceLogos.tsx", /<AcceptedInsuranceGallery[\s\S]+testId="accepted-insurance-gallery"/],
    ["client/src/components/LocationInsuranceLogos.tsx", /<AcceptedInsuranceGallery[\s\S]+testId="location-accepted-insurance-gallery"/],
    ["client/src/components/Contact.tsx", /<AcceptedInsuranceGallery[\s\S]+testId="contact-accepted-insurance-gallery"/],
  ];

  for (const [file, pattern] of components) {
    const content = readFileSync(join(root, file), "utf8");
    assert.match(content, pattern, file);
  }

  for (const page of ["Home.tsx", "HomeEspanol.tsx"]) {
    const content = readFileSync(join(root, "client/src/pages", page), "utf8");
    assert.match(content, /<InsuranceLogos\s*\/>/, page);
  }
});

test("reduced-motion mobile visitors receive every approved logo as a static accessible list", () => {
  const carousel = readFileSync(
    join(root, "client/src/components/MobileInsuranceCarousel.tsx"),
    "utf8",
  );
  const reducedMotionBranch = carousel.match(
    /if \(prefersReducedMotion\) \{([\s\S]+?)\r?\n  \}\r?\n\r?\n  const nextIndex/,
  )?.[1] ?? "";

  assert.match(reducedMotionBranch, /data-reduced-motion="static"/);
  assert.match(reducedMotionBranch, /logos\.map\(\(logo, index\) =>/);
  assert.match(reducedMotionBranch, /alt=\{logo\.alt\}/);
  assert.doesNotMatch(reducedMotionBranch, /aria-hidden/);
});

test("deployed gallery SSR requests include the origin-scoped Preview credential", () => {
  const deployedSpec = readFileSync(join(root, "e2e/insurance-removal.spec.ts"), "utf8");

  assert.match(deployedSpec, /request\.get\(pathname, \{\s*headers: protectedPreviewHeaders\(\),/);
});

test("required English and Spanish journeys use the conservative verification contract", () => {
  const requiredFiles = [
    "client/src/data/pageContent/mainPages/home.ts",
    "client/src/data/pageContent/mainPages/contact.ts",
    "client/src/data/pageContent/mainPages/sharedSections.ts",
    "client/src/data/pageContent/mainPages/forPatients.ts",
    "client/src/data/pageContent/services/servicesIndex.ts",
    "client/src/data/pageContent/legal/billingPolicy.ts",
    "client/src/data/locationFAQs.ts",
  ];

  const combined = requiredFiles.map((file) => readFileSync(join(root, file), "utf8")).join("\n");
  assert.match(combined, /Participation and benefits vary by plan and service/);
  assert.match(combined, /confirm current participation/i);
  assert.match(combined, /verify[^.]+(?:directly )?with (?:your|the) insurer/i);
  assert.match(combined, /financial options may be evaluated case by case/i);
  assert.match(combined, /La participación y los beneficios varían según el plan y el servicio/);
  assert.match(combined, /confirme la participación vigente/i);
  assert.match(combined, /verifique[^.]+con su aseguradora/i);
  assert.match(combined, /opciones[^.]+pueden evaluarse caso por caso/i);
});

test("all physical-office and service-area pages render insurance plans and neutral billing guidance", () => {
  const locationPages = [
    "LocationNaples.tsx",
    "LocationBonitaSprings.tsx",
    "LocationMarcoIsland.tsx",
    "LocationEstero.tsx",
    "LocationGoldenGate.tsx",
    "LocationImmokalee.tsx",
    "LocationVanderbiltBeach.tsx",
    "LocationAveMaria.tsx",
    "LocationFortMyers.tsx",
    "LocationLelyResorts.tsx",
  ];

  for (const page of locationPages) {
    const content = readFileSync(join(root, "client", "src", "pages", page), "utf8");
    assert.match(content, /<LocationInsuranceLogos\s*\/>/, page);
  }
});
