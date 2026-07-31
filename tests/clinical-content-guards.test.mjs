import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const read = (...segments) => fs.readFileSync(path.join(process.cwd(), ...segments), "utf8");

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
