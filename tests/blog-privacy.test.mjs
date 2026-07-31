import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import test from "node:test";

test("patient identifier guard recognizes international standalone names", () => {
  const program = `
    import assert from "node:assert/strict";
    const { containsLikelyPatientIdentifier } = await import("./server/blog/privacy.ts");

    for (const privateName of [
      "Maria Garcia",
      "María García",
      "María García-López",
      "José O’Neill",
      "Ana-María O'Neill",
      "José Luis Pérez",
      "MARÍA GARCÍA",
      "María J. García",
      "María de la Cruz",
      "Maria Care",
      "Draft notes\\nMaría García-López\\nanxiety education",
      "Nombre: José O’Neill",
      "Paciente María García fue diagnosticada con ansiedad.",
      "Patient José O’Neill was prescribed medication.",
      "Número de paciente: AB-12345",
      "Historia clínica: HM-67890",
      "Fecha de nacimiento: 5 de enero de 1980",
    ]) {
      assert.equal(containsLikelyPatientIdentifier(privateName), true, privateName);
    }

    for (const editorialText of [
      "Anxiety Treatment Options",
      "Healing Minds Psychiatry",
      "About Us",
      "Patient Resources",
      "general educational article about anxiety",
    ]) {
      assert.equal(containsLikelyPatientIdentifier(editorialText), false, editorialText);
    }
  `;

  const result = spawnSync(
    process.execPath,
    ["--import", "tsx", "--input-type=module", "-e", program],
    { cwd: process.cwd(), encoding: "utf8" },
  );

  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test("legacy contact route never logs a persisted submission body", () => {
  const source = fs.readFileSync("server/routes.ts", "utf8");
  assert.doesNotMatch(source, /console\.(?:log|info|debug)\([^\n]*contactMessage/);
  assert.doesNotMatch(source, /console\.(?:log|info|debug)\([^\n]*(?:validatedData|req\.body)/);
});
