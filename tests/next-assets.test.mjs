import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const source = fs.readFileSync(path.join(process.cwd(), "client", "src", "components", "OptimizedImage.tsx"), "utf8");
const mobileInsuranceCarousel = fs.readFileSync(
  path.join(process.cwd(), "client", "src", "components", "MobileInsuranceCarousel.tsx"),
  "utf8",
);
const contact = fs.readFileSync(
  path.join(process.cwd(), "client", "src", "components", "Contact.tsx"),
  "utf8",
);
const locationInsuranceLogos = fs.readFileSync(
  path.join(process.cwd(), "client", "src", "components", "LocationInsuranceLogos.tsx"),
  "utf8",
);

test("the shared image component sends local assets through the Next responsive optimizer", () => {
  assert.match(source, /import Image, \{ type ImageProps \} from ['"]next\/image['"]/);
  assert.match(source, /StaticImageLike/);
  assert.match(source, /typeof src === ['"]string['"]/);
  assert.match(source, /<Image/);
  assert.match(source, /src=\{resolvedSrc\}/);
  assert.match(source, /fetchPriority=\{priority \? ['"]high['"] : undefined\}/);
  assert.doesNotMatch(source, /fetchpriority/);
});

test("the shared image component reveals assets that completed before hydration", () => {
  assert.match(source, /imageRef/);
  assert.match(source, /image\?\.complete/);
  assert.match(source, /image\.naturalWidth > 0/);
  assert.match(source, /setIsLoaded\(true\)/);
  assert.match(source, /opacity: priority \|\| isLoaded \? 1 : 0/);
});

test("mobile insurance rotation waits for its buffered responsive image", () => {
  assert.match(source, /onReady\?: \(\) => void/);
  assert.match(source, /onFailure\?: \(\) => void/);
  assert.match(mobileInsuranceCarousel, /loadedIndexesRef\.current\.has\(candidateIndex\)/);
  assert.match(mobileInsuranceCarousel, /findNextCandidate/);
  assert.match(mobileInsuranceCarousel, /failedIndexes/);
  assert.match(mobileInsuranceCarousel, /onFailure=/);
  assert.match(mobileInsuranceCarousel, /setPreviousIndex\(outgoingIndex\)/);
  assert.match(mobileInsuranceCarousel, /width=\{256\}/);
  assert.match(mobileInsuranceCarousel, /height=\{144\}/);
  assert.match(mobileInsuranceCarousel, /sizes="256px"/);
  assert.match(locationInsuranceLogos, /<MobileInsuranceCarousel/);
  assert.doesNotMatch(locationInsuranceLogos, /sizes="160px"/);
});

test("location heroes issue one priority request per viewport", () => {
  const locationPages = [
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

  for (const page of locationPages) {
    const content = fs.readFileSync(
      path.join(process.cwd(), "client", "src", "pages", page),
      "utf8",
    );
    const heroImages = [
      ...content.matchAll(
        /<OptimizedImage\s+src=\{assetUrl\(heroLocationImage\)\}[\s\S]*?\/>/g,
      ),
    ].map((match) => match[0]);

    assert.equal(heroImages.length, 2, `${page} should render two responsive hero elements`);
    assert.match(
      heroImages[0],
      /priority=\{true\}[\s\S]*sizes="\(max-width: 1024px\) 100vw, 1800px"/,
    );
    assert.match(
      heroImages[1],
      /priority=\{true\}[\s\S]*sizes="\(max-width: 1024px\) 100vw, 1800px"/,
    );
  }
});

test("contact insurance sizes describe rendered width instead of height", () => {
  assert.match(contact, /width=\{114\}[\s\S]*height=\{64\}/);
  assert.match(
    contact,
    /sizes="\(max-width: 639px\) 86px, \(max-width: 767px\) 100px, 114px"/,
  );
});

test("direct img elements resolve imported static assets instead of serializing objects", () => {
  const root = path.join(process.cwd(), "client", "src");
  const files = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (entry.name.endsWith(".tsx")) files.push(full);
    }
  };
  visit(root);

  const offenders = [];
  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const imports = [...content.matchAll(/import\s+(\w+)\s+from\s+['"][^'"]+\.(?:webp|png|jpe?g|svg)(?:\?[^'"]*)?['"]/gi)];
    const srcExpressions = [...content.matchAll(/src=\{([^}\n]+)\}/g)].map((match) => match[1]);
    for (const [, identifier] of imports) {
      for (const expression of srcExpressions) {
        const usesIdentifier = new RegExp(`\\b${identifier}\\b`).test(expression);
        if (usesIdentifier && !expression.includes(`assetUrl(${identifier})`)) {
          offenders.push(`${path.relative(root, file)}:${identifier}:${expression.trim()}`);
        }
      }
    }
  }
  assert.deepEqual(offenders, []);
});
