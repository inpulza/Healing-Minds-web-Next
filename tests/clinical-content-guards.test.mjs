import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const read = (...segments) => fs.readFileSync(path.join(process.cwd(), ...segments), "utf8");

const locationPageFiles = [
  "LocationAveMaria.tsx",
  "LocationBonitaSprings.tsx",
  "LocationEstero.tsx",
  "LocationFortMyers.tsx",
  "LocationGoldenGate.tsx",
  "LocationImmokalee.tsx",
  "LocationLelyResorts.tsx",
  "LocationMarcoIsland.tsx",
  "LocationVanderbiltBeach.tsx",
];

const sectionBetween = (source, startMarker, endMarker) => {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.notEqual(start, -1, `missing section marker: ${startMarker}`);
  assert.notEqual(end, -1, `missing section marker: ${endMarker}`);
  return source.slice(start, end);
};

const underageEligibilityPatterns = [
  /\b(?:we|healing minds(?: psychiatry)?|dr\.? (?:melva )?reve)\s+(?:offers?|provides?|treats?|sees?|serves?|accepts?|welcomes?)[^.!?\n]{0,120}\b(?:teens?|teenagers?|adolescents?|children|minors?|pediatric patients?|patients? of all ages)\b/iu,
  /\b(?:care|treatment|therapy|services?|evaluations?|appointments?)\b[^.!?\n]{0,80}\b(?:for|to)\s+(?:teens?|teenagers?|adolescents?|children|minors?|pediatric patients?|patients? of all ages)\b/iu,
  /\b(?:teens?|teenagers?|adolescents?|children|minors?|pediatric patients?|patients? of all ages)\b[^.!?\n]{0,80}\b(?:care|treatment|therapy|services?|evaluations?|appointments?)\b/iu,
  /\b(?:care|treatment|therapy|services?|evaluations?|appointments?|adhd|anxiety|depression|ptsd|psychiatric)\b[^.!?\n]{0,100}\badults?\s+(?:and|&)\s+(?:teens?|teenagers?|adolescents?|children|minors?|pediatric patients?)\b/iu,
  /\badults?\s+(?:and|&)\s+(?:teens?|teenagers?|adolescents?|children|minors?|pediatric patients?)\b[^.!?\n]{0,100}\b(?:care|treatment|therapy|services?|evaluations?|appointments?|adhd|anxiety|depression|ptsd|psychiatric)\b/iu,
  /\b(?:ofrecemos|brindamos|tratamos|atendemos|aceptamos|recibimos)[^.!?\n]{0,120}\b(?:adolescentes?|niños?|menores(?: de edad)?|pacientes pediátricos?|pacientes de todas las edades)\b/iu,
  /\b(?:atención|tratamiento|terapia|servicios?|evaluaciones?|citas)\b[^.!?\n]{0,80}\b(?:para|a)\s+(?:adolescentes?|niños?|menores(?: de edad)?|pacientes pediátricos?|pacientes de todas las edades)\b/iu,
  /\b(?:adolescentes?|niños?|menores(?: de edad)?|pacientes pediátricos?|pacientes de todas las edades)\b[^.!?\n]{0,80}\b(?:atención|tratamiento|terapia|servicios?|evaluaciones?|citas)\b/iu,
  /\b(?:atención|tratamiento|terapia|servicios?|evaluaciones?|citas|tdah|ansiedad|depresión|tept|psiquiátric[oa])\b[^.!?\n]{0,100}\badultos?\s+(?:y|&)\s+(?:adolescentes?|niños?|menores(?: de edad)?|pacientes pediátricos?)\b/iu,
  /\badultos?\s+(?:y|&)\s+(?:adolescentes?|niños?|menores(?: de edad)?|pacientes pediátricos?)\b[^.!?\n]{0,100}\b(?:atención|tratamiento|terapia|servicios?|evaluaciones?|citas|tdah|ansiedad|depresión|tept|psiquiátric[oa])\b/iu,
];

const containsUnderageEligibilityOffer = source => underageEligibilityPatterns.some(pattern => pattern.test(source));

test("telehealth consent does not publish an unverified board-certification claim", () => {
  const consent = read("client", "src", "data", "pageContent", "legal", "telehealthConsent.ts");
  assert.doesNotMatch(consent, /board[- ]certified/i);
  assert.doesNotMatch(consent, /certificad[oa] por la junta/i);
});

test("location pages consistently show weekends as closed", () => {
  for (const filename of locationPageFiles) {
    const source = read("client", "src", "pages", filename);
    assert.doesNotMatch(source, /Saturday: By appointment|Sábado: Con cita/, filename);
    assert.match(source, /Saturday: Closed\\nSunday: Closed/, filename);
    assert.match(source, /Sábado: Cerrado\\nDomingo: Cerrado/, filename);
  }
});

test("Immokalee content does not promise unpublished evening or weekend availability", () => {
  const hyperlocalSource = read("client", "src", "data", "locationHyperlocal.ts");
  const faqSource = read("client", "src", "data", "locationFAQs.ts");
  const seoManifest = read("shared", "seo-manifest.json");
  const hyperlocal = sectionBetween(hyperlocalSource, "  immokalee: {", "\n  aveMaria: {");
  const faqs = sectionBetween(faqSource, "  immokalee: {", "\n  aveMaria: {");
  const immokaleeSeo = [...seoManifest.matchAll(/"\/(?:es\/ubicaciones\/psiquiatra-|locations\/psychiatrist-)immokalee"\s*:\s*\{[\s\S]*?\n  \}/g)]
    .map(match => match[0])
    .join("\n");

  assert.notEqual(immokaleeSeo, "", "missing Immokalee SEO manifest entries");

  for (const source of [hyperlocal, faqs, immokaleeSeo]) {
    assert.doesNotMatch(source, /evening|weekend|nocturn|fin(?:es)? de semana|por la(?:s)? tarde(?:s)?/i);
    assert.doesNotMatch(source, /around field hours|scheduled around|adaptad[oa] a horarios del campo|según (?:los )?horarios (?:de trabajo )?en el campo|calendario de cosecha/i);
  }

  assert.match(hyperlocal, /weekday telehealth/i);
  assert.match(hyperlocal, /telesalud entre semana/i);
  assert.match(faqs, /Monday through Friday, 8:00 AM to 5:00 PM/);
  assert.match(faqs, /lunes a viernes de 8:00 AM a 5:00 PM/);
  assert.match(immokaleeSeo, /weekday telehealth/i);
  assert.match(immokaleeSeo, /telesalud entre semana/i);
});

test("public clinical eligibility consistently limits services to adults 18 and older", () => {
  const telehealthConsent = read("client", "src", "data", "pageContent", "legal", "telehealthConsent.ts");
  const medicalDisclaimer = read("client", "src", "data", "pageContent", "legal", "medicalDisclaimer.ts");
  const eligibilitySources = [
    ["components/Services.tsx", read("client", "src", "components", "Services.tsx")],
    ["locationFAQs.ts", read("client", "src", "data", "locationFAQs.ts")],
    ["locationHyperlocal.ts", read("client", "src", "data", "locationHyperlocal.ts")],
    ["servicesIndex.ts", read("client", "src", "data", "pageContent", "services", "servicesIndex.ts")],
    ["naples.ts", read("client", "src", "data", "pageContent", "mainPages", "naples.ts")],
    ["about.ts", read("client", "src", "data", "pageContent", "mainPages", "about.ts")],
    ["shared/seo-manifest.json", read("shared", "seo-manifest.json")],
    ...locationPageFiles.map(filename => [filename, read("client", "src", "pages", filename)]),
  ];
  const explicitAdultOfferSources = [
    ["components/Services.tsx", read("client", "src", "components", "Services.tsx")],
    ["locationHyperlocal.ts", read("client", "src", "data", "locationHyperlocal.ts")],
    ["servicesIndex.ts", read("client", "src", "data", "pageContent", "services", "servicesIndex.ts")],
    ["naples.ts", read("client", "src", "data", "pageContent", "mainPages", "naples.ts")],
    ...locationPageFiles.map(filename => [filename, read("client", "src", "pages", filename)]),
  ];

  assert.match(telehealthConsent, /Services are available to adults 18 and older/);
  assert.match(telehealthConsent, /servicios están disponibles para adultos de 18 años en adelante/i);
  assert.match(medicalDisclaimer, /Services are available to adults 18 and older/);
  assert.match(medicalDisclaimer, /servicios están disponibles para adultos de 18 años en adelante/i);

  for (const [filename, source] of eligibilitySources) {
    assert.equal(containsUnderageEligibilityOffer(source), false, filename);
  }

  for (const [filename, source] of explicitAdultOfferSources) {
    assert.match(source, /adults 18(?:\+| and older)/i, filename);
    assert.match(source, /adultos (?:18\+|de 18 años en adelante)/i, filename);
  }

  for (const underageOffer of [
    "We offer ADHD treatment for children.",
    "Appointments are available to minors.",
    "Healing Minds welcomes pediatric patients.",
    "Psychiatric services for patients of all ages.",
    "Adult and adolescent evaluations are available.",
    "Ofrecemos tratamiento para niños.",
    "Citas para menores de edad.",
    "Atendemos a pacientes de todas las edades.",
    "Evaluaciones para adultos y adolescentes.",
  ]) {
    assert.equal(containsUnderageEligibilityOffer(underageOffer), true, underageOffer);
  }

  for (const allowedContext of [
    "Families with school-age children. We offer adult ADHD care.",
    'question: "Do you see minors?", answer: "No. Appointments are for adults 18 and older only."',
    "Children's Privacy: this website is not directed to children.",
    "Symptoms may begin in childhood and continue into adulthood.",
  ]) {
    assert.equal(containsUnderageEligibilityOffer(allowedContext), false, allowedContext);
  }
});
