import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import test from "node:test";

test("patient identifier guard fail-closes marked AI fields while preserving public editorial content", () => {
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
      "Patient name Jane Doe",
      "Nombre del paciente María García",
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
      "Patient-Centered Care in Psychiatry",
      "Case-Based Approaches to Anxiety",
      "patient support services started in 2020",
      "patient care services scheduled for launch",
      "paciente apoyo familiar empezó en 2020",
      "patient may benefit from therapy",
      "patient will receive follow-up care",
      "patient privacy in telehealth",
      "patient confidentiality and HIPAA",
      "paciente privacidad y telesalud",
      "Patient Privacy Rights",
      "Patient HIPAA Privacy Rules",
      "Patient Telehealth Privacy",
      "Patient Guide to Managing Anxiety",
      "Patient Perspectives on Mental Health",
      "Patient Guide to Jane Doe",
      "Patient Perspectives from Maria Lopez",
      "patient guide to Jane Doe",
      "Patient perspectives from Maria Lopez",
      "patient chronic pain management",
      "patient housing needs",
      "patient family needs assessment",
    ]) {
      assert.equal(containsLikelyPatientIdentifier(editorialText), false, editorialText);
      const hasExplicitPatientMarker = /\\b(?:patient|paciente)\\b/iu.test(editorialText);
      assert.equal(
        containsLikelyPatientIdentifierInAiFields({ topic: editorialText }),
        hasExplicitPatientMarker,
        editorialText,
      );
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
      "patient jane doe called yesterday",
      "paciente maría garcía llamó ayer",
      "patient jane doe needs help",
      "patient jane doe has severe anxiety",
      "patient jane doe wrote yesterday",
      "patient will smith called yesterday",
      "patient may lee called yesterday",
      "paciente maría garcía necesita ayuda",
      "paciente maría garcía escribió ayer",
      "paciente maría garcía tuvo una crisis",
      "patient madonna called yesterday",
      "paciente madonna llamó ayer",
      "patient madonna requires help",
      "patient madonna seeks help",
      "patient madonna prefers telehealth",
      "patient jane doe denies symptoms",
      "paciente madonna acudió ayer",
      "paciente madonna prefiere telesalud",
      "paciente maría garcía explicó sus síntomas",
      "Patient provided Jane Doe as her name",
      "Paciente proporcionó María García como su nombre",
      'Patient provided "Jane Doe" as her name',
      "Patient provided (Jane Doe) as her name",
      "Patient provided Madonna as her name",
      "Paciente proporcionó Madonna como su nombre",
      "Paciente proporcionó «María García» como su nombre",
      "Paciente proporcionó «Pelé» como su nombre",
      "Patient mentioned Pelé during intake",
      "Patient provided “Pelé” during intake",
      "Patient provided Madonna as my name",
      "Patient provided Madonna as her full name",
      "Patient provided Madonna as her legal name",
      "Paciente proporcionó Madonna como mi nombre",
      "Patient Reported “Jane Doe” during Intake",
      "Patient Said “Jane Doe” during Intake",
      "Patient Wrote “Jane Doe” during Intake",
      "Patient SAID “JANE DOE” during Intake",
      "Patient said Jane Doe during intake",
      "Patient WROTE JANE DOE during intake",
      "Paciente dijo María García durante la admisión",
      "Patient is Jane Doe",
      "Patient was Jane Doe during intake",
      "Patient has Jane Doe as contact",
      "Paciente es María García",
      "Patient spoke to Jane Doe",
      "Patient referred to Jane Doe",
      "Patient sent records to Jane Doe",
      "Paciente refirió a María García",
      "Paciente remitió a María García",
    ]) {
      assert.equal(containsLikelyPatientIdentifier(narrative), true, narrative);
    }
    assert.equal(containsLikelyPatientIdentifierInAiFields({
      topic: "Patient provided",
      targetKeyword: "Jane Doe as her name",
    }), true);
    assert.equal(containsLikelyPatientIdentifierInAiFields({
      topic: "Patient Guide to",
      targetKeyword: "Jane Doe",
    }), true);
    assert.equal(containsLikelyPatientIdentifierInAiFields({
      topic: "patient guide to",
      targetKeyword: "Jane Doe",
    }), true);
    assert.equal(containsLikelyPatientIdentifierInAiFields({
      topic: "Patient provided",
      targetKeyword: "Madonna",
      additionalContext: "as her name",
    }), true);
    assert.equal(containsLikelyPatientIdentifierInAiFields({
      topic: "Patient provided",
      targetKeyword: "Pelé",
      additionalContext: "as my name",
    }), true);
    assert.equal(containsLikelyPatientIdentifierInAiFields({
      topic: "Patient Said",
      targetKeyword: "“Jane Doe”",
    }), true);
    assert.equal(containsLikelyPatientIdentifierInAiFields({
      topic: "Patient said",
      targetKeyword: "Jane Doe",
    }), true);
    assert.equal(containsLikelyPatientIdentifierInAiFields({
      topic: "Patient referred to",
      targetKeyword: "Jane Doe",
    }), true);
    assert.equal(containsLikelyPatientIdentifierInAiFields({
      topic: "Paciente remitió a",
      targetKeyword: "María García",
    }), true);
    for (const patientMarkedAiInput of [
      { topic: "Patient said jane doe during intake" },
      { topic: "Patient emailed john smith yesterday" },
      { topic: "paciente dijo maría garcía durante la admisión" },
      { topic: "The patient's full legal name is jane doe" },
      { topic: "El nombre legal de la paciente es maría garcía" },
      { topic: "patient lives in New York and mentioned Jane Doe" },
      { topic: "paciente vive en Nueva York y mencionó María García" },
      { topic: "Patient legal name", targetKeyword: "jane doe" },
      { topic: "patient lives in New York and mentioned", targetKeyword: "jane doe" },
    ]) {
      assert.equal(
        containsLikelyPatientIdentifierInAiFields(patientMarkedAiInput),
        true,
        JSON.stringify(patientMarkedAiInput),
      );
    }
    for (const rephrasedEditorialInput of [
      { topic: "New York resources for adults" },
      { topic: "Telehealth resources across Florida" },
      { topic: "Coping skills for anxiety" },
      { topic: "Billing department workflow" },
    ]) {
      assert.equal(
        containsLikelyPatientIdentifierInAiFields(rephrasedEditorialInput),
        false,
        JSON.stringify(rephrasedEditorialInput),
      );
    }
    for (const editorialFields of [
      { topic: "patient confidentiality in Florida" },
      { topic: "patient access to Florida care" },
      { topic: "patient resources for Naples adults" },
      { topic: "patient privacy under Florida law" },
      { topic: "patient confidentiality in", targetKeyword: "Florida" },
      { topic: "patient navigating South Florida resources" },
      { topic: "patient moving to New York" },
      { topic: "patient discussed South Florida resources" },
      { topic: "patient navigating", targetKeyword: "South Florida" },
      { topic: "patient discussed New York resources" },
      { topic: "patient lives in New York" },
      { topic: "patient reviewed Los Angeles providers" },
      { topic: "patient seeking New York services" },
      { topic: "patient discussed", targetKeyword: "New York resources" },
      { topic: "patient moving toward New York" },
      { topic: "patient relocated into New York" },
      { topic: "patient living outside New York" },
      { topic: "patient reviewed New York coverage" },
      { topic: "patient discussed Los Angeles clinics" },
      { topic: "paciente vive en Nueva York" },
      { topic: "paciente busca servicios en Nueva York" },
      { topic: "paciente se mudó a Nueva York" },
      { topic: "paciente revisó proveedores en Los Ángeles" },
      { topic: "patient lives in", targetKeyword: "New York" },
      { topic: "paciente vive en", targetKeyword: "Nueva York" },
    ]) {
      const hasExplicitPatientMarker = Object.values(editorialFields)
        .some(value => /\\b(?:patient|paciente)\\b/iu.test(value || ""));
      assert.equal(
        containsLikelyPatientIdentifierInAiFields(editorialFields),
        hasExplicitPatientMarker,
        JSON.stringify(editorialFields),
      );
    }
    assert.equal(containsLikelyPatientIdentifier("Name: Madonna"), true);
    assert.equal(containsLikelyPatientIdentifier("Nombre: Pelé"), true);
    assert.equal(containsLikelyPatientIdentifier("Patient Jane Doe"), true);
    assert.equal(containsLikelyPatientIdentifier("Paciente María García"), true);
    assert.equal(containsLikelyPatientIdentifierInAiFields({
      topic: "Patient name:",
      targetKeyword: "Jane Doe",
    }), true);
    assert.equal(containsLikelyPatientIdentifierInAiFields({
      topic: "Patient name",
      targetKeyword: "Jane Doe",
    }), true);
    assert.equal(containsLikelyPatientIdentifierInAiFields({
      topic: "Date of birth",
      targetKeyword: "5 de enero de 1980",
    }), true);
    assert.equal(containsLikelyPatientIdentifierInAiFields({
      topic: "Date",
      targetKeyword: "of birth:",
      additionalContext: "01/05/1980",
    }), true);
    assert.equal(containsLikelyPatientIdentifierInAiFields({
      topic: "Patient",
      targetKeyword: "jane doe",
      additionalContext: "called yesterday",
    }), true);
    assert.equal(containsLikelyPatientIdentifierInAiFields({
      topic: "Patient",
      targetKeyword: "Jane Doe",
    }), true);
    assert.equal(containsLikelyPatientIdentifierInAiFields({
      topic: "Paciente",
      targetKeyword: "maría garcía",
      additionalContext: "necesita ayuda",
    }), true);
    assert.equal(containsLikelyPatientIdentifierInAiFields({
      topic: "anxiety",
      targetKeyword: "Maria Garcia",
    }), false);
    assert.equal(containsLikelyPatientIdentifierInAiFields({
      topic: "Patient email:",
      targetKeyword: "jane.doe",
      additionalContext: "@example.com",
    }), true);
    assert.equal(containsLikelyPatientIdentifierInAiFields({
      topic: "Date of birth:",
      targetKeyword: "01/05",
      additionalContext: "/1980",
    }), true);
    assert.equal(containsLikelyPatientIdentifierInAiFields({
      topic: "Patient ID:",
      targetKeyword: "AB",
      additionalContext: "-12345",
    }), true);
    for (const editorialFields of [
      { topic: "Patient", targetKeyword: "Care Options", additionalContext: "support services" },
      { topic: "Patient Care Options", targetKeyword: "support services", additionalContext: "for Florida adults" },
      { topic: "Patient Resources", targetKeyword: "Treatment Options", additionalContext: "support guide" },
      { topic: "Patient", targetKeyword: "Support Services", additionalContext: "started in 2020" },
      { topic: "Patient", targetKeyword: "HIPAA Privacy Rules" },
      { topic: "Patient", targetKeyword: "Telehealth Privacy" },
    ]) {
      const hasExplicitPatientMarker = Object.values(editorialFields)
        .some(value => /\\b(?:patient|paciente)\\b/iu.test(value || ""));
      assert.equal(
        containsLikelyPatientIdentifierInAiFields(editorialFields),
        hasExplicitPatientMarker,
        JSON.stringify(editorialFields),
      );
    }

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
  for (const [filename, flowMarker] of [
    ["server/blog/admin-routes.ts", 'app.post("/api/admin/blog/generate-draft"'],
    ["app/api/admin/blog/[[...path]]/route.ts", 'segments[0] === "generate-draft"'],
  ]) {
    const source = fs.readFileSync(filename, "utf8");
    assert.match(source, /containsLikelyPatientIdentifierInAiFields\(payload\)/, filename);
    assert.doesNotMatch(source, /possibleSensitiveText/, filename);
    const flow = source.slice(source.indexOf(flowMarker), source.indexOf(flowMarker) + 9_000);
    const privacyGateIndex = flow.indexOf("containsLikelyPatientIdentifierInAiFields(payload)");
    const candidateSelectionIndex = flow.indexOf("selectBlogTopicCandidate(");
    const planningClaimIndex = flow.indexOf("claimCompletedBlogPlanningRun(");
    assert.ok(privacyGateIndex >= 0, `${filename}: missing privacy gate`);
    assert.ok(candidateSelectionIndex > privacyGateIndex, `${filename}: candidate selected before privacy gate`);
    assert.ok(planningClaimIndex > privacyGateIndex, `${filename}: planning run claimed before privacy gate`);
  }
});

test("automatic topic planning shares the fail-closed AI input contract", () => {
  const plannerSource = fs.readFileSync("server/blog/ai/topic-planner.ts", "utf8");
  const providerSource = fs.readFileSync("server/blog/ai/topic-provider.ts", "utf8");
  assert.match(plannerSource, /containsUnsafePlannedTopicAiInput\(input\.proposal\)/);
  assert.doesNotMatch(providerSource, /Prefer patient questions/);
  assert.match(providerSource, /Do not use the words patient or paciente/);

  const program = `
    import assert from "node:assert/strict";
    const { containsUnsafePlannedTopicAiInput } = await import("./server/blog/ai/topic-planner.ts");
    assert.equal(containsUnsafePlannedTopicAiInput({
      topic: "Patient Guide to Managing Anxiety",
      targetKeyword: "anxiety care",
      expertiseAngle: "educational guide",
    }), true);
    assert.equal(containsUnsafePlannedTopicAiInput({
      topic: "Questions about managing anxiety",
      targetKeyword: "anxiety care",
      expertiseAngle: "educational guide",
    }), false);
  `;
  const result = spawnSync(
    process.execPath,
    ["--import", "tsx", "--input-type=module", "-e", program],
    {
      cwd: process.cwd(),
      encoding: "utf8",
      env: { ...process.env, DATABASE_URL: "postgres://user:pass@localhost:5432/test" },
    },
  );
  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test("topic planning never sends raw historical titles or keywords to providers", () => {
  const source = fs.readFileSync("server/blog/ai/topic-planner.ts", "utf8");
  assert.match(source, /function getSafePostTitleForProvider[\s\S]*return `Private post \$\{post\.id\}`;/);
  assert.doesNotMatch(source, /getSafePostTitleForProvider\(post\)\s*!==\s*post\.title/);
  assert.doesNotMatch(source, /title\s*===\s*post\.title/);
});

test("draft generation sends only provider-safe semantic memory", () => {
  const memorySource = fs.readFileSync("server/blog/ai/memory.ts", "utf8");
  const routeSource = fs.readFileSync("server/blog/admin-routes.ts", "utf8");
  assert.match(memorySource, /export function redactBlogSemanticMemoryForProvider/);
  assert.match(memorySource, /title: `Private post \$\{match\.postId\}`/);
  assert.match(memorySource, /slug: `private-post-\$\{match\.postId\}`/);
  assert.match(routeSource, /const providerSemanticMemory = redactBlogSemanticMemoryForProvider\(semanticMemory\)/);
  assert.match(routeSource, /semanticMemory: providerSemanticMemory,\s*editorialBrief/);
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
