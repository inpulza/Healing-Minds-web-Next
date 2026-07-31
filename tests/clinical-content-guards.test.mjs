import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const read = (...segments) => fs.readFileSync(path.join(process.cwd(), ...segments), "utf8");

const sectionBetween = (source, startMarker, endMarker) => {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.notEqual(start, -1, `missing section marker: ${startMarker}`);
  assert.notEqual(end, -1, `missing section marker: ${endMarker}`);
  return source.slice(start, end);
};

test("telehealth consent does not publish an unverified board-certification claim", () => {
  const consent = read("client", "src", "data", "pageContent", "legal", "telehealthConsent.ts");
  assert.doesNotMatch(consent, /board[- ]certified/i);
  assert.doesNotMatch(consent, /certificad[oa] por la junta/i);
});

test("location pages consistently show weekends as closed", () => {
  const locationFiles = [
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

  for (const filename of locationFiles) {
    const source = read("client", "src", "pages", filename);
    assert.doesNotMatch(source, /Saturday: By appointment|Sábado: Con cita/, filename);
    assert.match(source, /Saturday: Closed\\nSunday: Closed/, filename);
    assert.match(source, /Sábado: Cerrado\\nDomingo: Cerrado/, filename);
  }
});

test("Immokalee content does not promise unpublished evening or weekend availability", () => {
  const hyperlocalSource = read("client", "src", "data", "locationHyperlocal.ts");
  const faqSource = read("client", "src", "data", "locationFAQs.ts");
  const hyperlocal = sectionBetween(hyperlocalSource, "  immokalee: {", "\n  aveMaria: {");
  const faqs = sectionBetween(faqSource, "  immokalee: {", "\n  aveMaria: {");

  for (const source of [hyperlocal, faqs]) {
    assert.doesNotMatch(source, /evening|weekend|nocturn|fin(?:es)? de semana|por la(?:s)? tarde(?:s)?/i);
    assert.doesNotMatch(source, /around field hours|scheduled around|adaptad[oa] a horarios del campo|según (?:los )?horarios (?:de trabajo )?en el campo|calendario de cosecha/i);
  }

  assert.match(hyperlocal, /weekday telehealth/i);
  assert.match(hyperlocal, /telesalud entre semana/i);
  assert.match(faqs, /Monday through Friday, 8:00 AM to 5:00 PM/);
  assert.match(faqs, /lunes a viernes de 8:00 AM a 5:00 PM/);
});
