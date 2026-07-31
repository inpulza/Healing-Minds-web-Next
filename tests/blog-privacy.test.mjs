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
    const { readFileSync } = await import("node:fs");

    for (const explicitIdentifier of [
      "patient name: Jane Example",
      "Name: jane doe",
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
      "Maria Garcia",
      "Maria Care",
      "Draft notes\\nMaría García-López\\nanxiety education",
      "Notes about Maria Garcia for follow up",
      "Notes about María García for follow up",
      "Context: Maria Garcia",
      "anxiety María García",
      "Fatima Khan",
      "Saoirse O'Connor",
      "Zoë Kravitz",
      "Łukasz Kowalski",
      "FÁTIMA KHAN",
      "José-Luis Pérez",
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
      "Depresión Estacional",
      "Anxiety Treatment",
      "Medication Management",
      "ADHD Evaluation",
      "Mindfulness Exercises",
      "Stress Management",
      "Mind Body Connection",
      "Emotional Regulation Skills",
      "Trauma Recovery Tools",
      "Workplace Burnout Prevention",
      "Mood Tracking Benefits",
      "Wellness Coaching",
      "Couples Counseling",
      "Executive Function Skills",
      "Essential Questions for Your Bipolar Medication Follow-Up",
      "Tratamiento de Ansiedad en Naples: Que Pueden Esperar los Pacientes",
      "Understanding Anxiety Treatment in Naples: What Patients Can Expect",
      "Cómo Manejar la Ansiedad",
      "Guía Práctica Para Dormir Mejor",
      "general educational article about anxiety",
      "Patient Care Options",
      "Patient Support Resources",
      "Patient Education Materials",
      "Patient Safety Planning",
      "Patient Resources and Treatment Options",
      "Paciente Opciones de Tratamiento",
      "Paciente Recursos y Apoyo",
      "Patient Resources across Florida",
      "Patient Support after Hospitalization",
      "Patient Rights under HIPAA",
      "Patient Education vs Treatment",
      "Patient Care or Self Care",
      "Patient Safety during Telehealth",
      "Patient Access through Insurance",
      "Patient Care from Home",
      "Patient Support before Treatment",
      "Paciente Apoyo durante Tratamiento",
      "Paciente Recursos antes de la Cita",
      "Paciente Cuidado desde Casa",
    ]) {
      assert.equal(containsLikelyPatientIdentifier(editorialText), false, editorialText);
      assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: editorialText }), false, editorialText);
    }

    assert.equal(containsLikelyPatientIdentifier("Maria Garcia"), false);
    assert.equal(containsLikelyPatientIdentifierInAiFields({
      topic: "anxiety",
      additionalContext: "María García",
    }), true);
    assert.equal(containsLikelyPatientIdentifierInAiFields({
      topic: "anxiety",
      additionalContext: "Maria Garcia",
    }), true);
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
    assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Cómo Manejar la Ansiedad" }), false);
    assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Guía Práctica Para Dormir Mejor" }), false);
    assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "María García" }), false);
    assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Maria Garcia" }), false);
    assert.equal(containsLikelyPatientIdentifierInAiFields({ targetKeyword: "María García" }), false);
    assert.equal(containsLikelyPatientIdentifierInAiFields({ additionalContext: "Fatima Khan" }), true);
    assert.equal(containsLikelyPatientIdentifierInAiFields({ additionalContext: "Grace Under Pressure" }), true);
    assert.equal(containsLikelyPatientIdentifier("patient Fatima Khan requested help"), true);
    assert.equal(containsLikelyPatientIdentifier("Patient Fatima requested help"), true);
    assert.equal(containsLikelyPatientIdentifier("Paciente Fátima Khan solicitó ayuda"), true);
    for (const narrative of [
      "patient Fatima Khan called yesterday",
      "patient Fatima Khan said she needs help",
      "patient Fatima Khan wants an appointment",
      "patient Fatima Khan scheduled a visit",
      "patient Fatima Khan contacted the office",
      "patient Fatima Khan feels anxious",
      "patient Fatima Khan stopped medication",
      "paciente Fátima Khan llamó ayer",
      "paciente Fátima Khan dijo que necesita ayuda",
      "paciente Fátima Khan quiere una cita",
      "paciente Fátima Khan contactó la oficina",
      "paciente Fátima Khan se siente ansiosa",
    ]) {
      assert.equal(containsLikelyPatientIdentifier(narrative), true, narrative);
    }
    assert.equal(containsLikelyPatientIdentifier("Name: Madonna"), true);
    assert.equal(containsLikelyPatientIdentifier("Nombre: Pelé"), true);

    const publishedSnapshot = JSON.parse(readFileSync("shared/blog-snapshot.json", "utf8"));
    for (const post of Object.values(publishedSnapshot)) {
      for (const value of [post.title, post.excerpt, post.content]) {
        assert.equal(containsLikelyPatientIdentifier(value || ""), false, post.title);
      }
    }
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

test("topic planning never sends raw historical titles or keywords to providers", () => {
  const source = fs.readFileSync("server/blog/ai/topic-planner.ts", "utf8");
  assert.match(source, /function getSafePostTitleForProvider[\s\S]*return `Private post \$\{post\.id\}`;/);
});

test("image generation checks explicit identifiers without treating public editorial names as patients", () => {
  const source = fs.readFileSync("server/blog/images/service.ts", "utf8");
  assert.match(source, /sensitiveInputs\.some\(containsLikelyPatientIdentifier\)/);
  assert.doesNotMatch(source, /containsHighConfidencePersonName|containsLikelyPatientIdentifierInTexts/);
});

test("legacy contact route never logs a persisted submission body", () => {
  const source = fs.readFileSync("server/routes.ts", "utf8");
  assert.doesNotMatch(source, /console\.(?:log|info|debug)\([^\n]*contactMessage/);
  assert.doesNotMatch(source, /console\.(?:log|info|debug)\([^\n]*(?:validatedData|req\.body)/);
});
