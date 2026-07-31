import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import test from "node:test";

test("patient identifier guard preserves AI field boundaries without rejecting editorial topics", () => {
  const program = `
    import assert from "node:assert/strict";
    const {
      containsHighConfidencePersonName,
      containsLikelyPatientIdentifier,
      containsLikelyPatientIdentifierInAiFields,
    } = await import("./server/blog/privacy.ts");

    for (const explicitIdentifier of [
      "patient name: Jane Example",
      "Name: Maria Garcia",
      "Nombre: Maria Care",
      "Paciente María García fue diagnosticada con ansiedad.",
      "Patient José O’Neill was prescribed medication.",
      "Número de paciente: AB-12345",
      "Historia clínica: HM-67890",
      "Fecha de nacimiento: 5 de enero de 1980",
    ]) {
      assert.equal(containsLikelyPatientIdentifier(explicitIdentifier), true, explicitIdentifier);
    }

    for (const highConfidenceName of [
      "María García",
      "María García-López",
      "José O’Neill",
      "Ana-María O'Neill",
      "José Luis Pérez",
      "MARÍA GARCÍA",
      "María J. García",
      "María de la Cruz",
      "Draft notes\\nMaría García-López\\nanxiety education",
      "anxiety María García",
    ]) {
      assert.equal(containsHighConfidencePersonName(highConfidenceName), true, highConfidenceName);
    }

    for (const editorialText of [
      "Anxiety Treatment Options",
      "Healing Minds Psychiatry",
      "About Us",
      "Patient Resources",
      "Understanding Seasonal Affective Disorder",
      "Managing Panic Attacks",
      "general educational article about anxiety",
    ]) {
      assert.equal(containsLikelyPatientIdentifier(editorialText), false, editorialText);
      assert.equal(containsHighConfidencePersonName(editorialText), false, editorialText);
    }

    assert.equal(containsLikelyPatientIdentifier("Maria Garcia"), false);
    assert.equal(containsHighConfidencePersonName("Maria Garcia"), false);
    assert.equal(containsLikelyPatientIdentifierInAiFields({
      topic: "anxiety",
      additionalContext: "María García",
    }), true);
    assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "María García" }), true);
    assert.equal(containsLikelyPatientIdentifierInAiFields({
      topic: "anxiety",
      additionalContext: "Name: Maria Garcia",
    }), true);
    assert.equal(containsLikelyPatientIdentifierInAiFields({
      topic: "Understanding Seasonal Affective Disorder",
      targetKeyword: "seasonal affective disorder",
    }), false);
    assert.equal(containsLikelyPatientIdentifierInAiFields({
      topic: "Managing Panic Attacks",
      additionalContext: "educational coping strategies",
    }), false);
  `;

  const result = spawnSync(
    process.execPath,
    ["--import", "tsx", "--input-type=module", "-e", program],
    { cwd: process.cwd(), encoding: "utf8" },
  );

  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test("both draft endpoints evaluate AI fields independently", () => {
  for (const filename of [
    "server/blog/admin-routes.ts",
    "app/api/admin/blog/[[...path]]/route.ts",
  ]) {
    const source = fs.readFileSync(filename, "utf8");
    assert.match(source, /containsLikelyPatientIdentifierInAiFields\(payload\)/, filename);
    assert.doesNotMatch(source, /possibleSensitiveText/, filename);
  }
});

test("legacy contact route never logs a persisted submission body", () => {
  const source = fs.readFileSync("server/routes.ts", "utf8");
  assert.doesNotMatch(source, /console\.(?:log|info|debug)\([^\n]*contactMessage/);
  assert.doesNotMatch(source, /console\.(?:log|info|debug)\([^\n]*(?:validatedData|req\.body)/);
});
