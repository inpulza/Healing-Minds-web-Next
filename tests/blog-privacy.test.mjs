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
    for (const legitimateLowercaseContext of [
      "quality improvement",
      "substance use",
      "panic prevention",
      "grief counseling",
      "mindfulness exercises",
      "screen time",
      "side effects",
      "emotional regulation",
      "executive function",
      "burnout prevention",
      "duelo complicado",
      "regulación emocional",
      "habilidades sociales",
      "crisis de pareja",
      "prevención del suicidio",
      "violencia doméstica",
      "estrés laboral",
      "funciones ejecutivas",
      "adicción y recuperación",
    ]) {
      assert.equal(
        containsLikelyPatientIdentifierInAiFields({ additionalContext: legitimateLowercaseContext }),
        false,
        legitimateLowercaseContext,
      );
    }
    for (const explicitPluralLabel of [
      { topic: "Patients: jane doe" },
      { topic: "Pacientes: maría garcía" },
      { targetKeyword: "Names: jane doe" },
      { targetKeyword: "Nombres: maría garcía" },
      { topic: "Patients:", targetKeyword: "jane doe" },
      { topic: "Nombres=", targetKeyword: "maría garcía" },
      { topic: "Patients", targetKeyword: ": jane doe" },
      { topic: "Nombres", targetKeyword: "= maría garcía" },
      { topic: "Names", targetKeyword: ":", additionalContext: "jane doe" },
      { topic: "Pacientes-", targetKeyword: "maría garcía" },
    ]) {
      assert.equal(
        containsLikelyPatientIdentifierInAiFields(explicitPluralLabel),
        true,
        JSON.stringify(explicitPluralLabel),
      );
    }
    for (const legitimatePluralEditorialText of [
      { topic: "Patients and Families Seeking Care" },
      { topic: "Resources for patients in Florida" },
      { topic: "Names used for common therapy approaches" },
      { topic: "Apoyo para pacientes y familias" },
      { topic: "Patients", targetKeyword: "Care Options" },
      { topic: "Nombres", targetKeyword: "de enfoques terapéuticos" },
    ]) {
      assert.equal(
        containsLikelyPatientIdentifierInAiFields(legitimatePluralEditorialText),
        false,
        JSON.stringify(legitimatePluralEditorialText),
      );
    }
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
    assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Legal name jane doe" }), true);
    assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Nombre completo maría garcía" }), true);
    assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Full legal name john smith" }), true);
    assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Nombre legal completo maría de la cruz" }), true);
    for (const wrappedGenericName of [
      "Legal name — jane doe",
      "Legal name – Jane Doe",
      "Legal name (jane doe)",
      'Legal name "Jane Doe"',
      'Legal name: "Jane Doe"',
      "Nombre completo — maría garcía",
      "Nombre completo «maría garcía»",
      "Nombre completo: «María García»",
      "Legal name is Jane Doe.",
      "Nombre completo es María García.",
      'Legal name: "Jane Doe".',
      "Nombre completo: «María García».",
      "The legal name is Jane Doe",
      "Her legal name is Jane Doe",
      "Su nombre completo es María García",
      "El nombre legal es Juan Pérez",
      "Legal name; Jane Doe",
      "Legal name. Jane Doe",
      "legal_name=jane_doe",
      "nombreCompleto=maríaGarcía",
    ]) {
      assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: wrappedGenericName }), true, wrappedGenericName);
    }
    assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Preferred full legal name: jane doe" }), true);
    assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Nombre legal completo: maría garcía" }), true);
    for (const publicEditorialTitle of [
      "Legal Name Change Process",
      "Preferred Name Policy Guide",
      "Full Name Formatting Standards",
      "Legal Name Requirements",
      "Name and Identity in Therapy",
      "Name Change and Mental Health",
      "Nombre Legal Requisitos Generales",
      "Nombre Completo Guía Práctica",
      "Nombre e Identidad en Terapia",
    ]) {
      assert.equal(containsLikelyPatientIdentifier(publicEditorialTitle), false, publicEditorialTitle);
    }
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
      topic: "Legal name",
      targetKeyword: "jane doe",
    }), true);
    assert.equal(containsLikelyPatientIdentifierInAiFields({
      topic: "Nombre completo",
      targetKeyword: "maría garcía",
    }), true);
    for (const wrappedSplitName of [
      { topic: "Legal name", targetKeyword: '"Jane Doe"' },
      { topic: "Preferred full legal name", targetKeyword: "(jane doe)" },
      { topic: "Legal name:", targetKeyword: '"Jane Doe"' },
      { topic: "Nombre completo:", targetKeyword: "(maría garcía)" },
      { topic: "Legal name —", targetKeyword: "[Jane Doe]" },
      { topic: "Nombre completo es", targetKeyword: "{María García}" },
    ]) {
      assert.equal(containsLikelyPatientIdentifierInAiFields(wrappedSplitName), true, JSON.stringify(wrappedSplitName));
    }
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
    for (const unlabeledSplitIdentifier of [
      { topic: "123 Main", targetKeyword: "Street" },
      { topic: "123", targetKeyword: "Main Street" },
      { topic: "305-555", targetKeyword: "1212" },
      { topic: "(305) 555", targetKeyword: "0123" },
      { topic: "+34 612", targetKeyword: "345 678" },
      { topic: "00 52 55", targetKeyword: "1234 5678" },
      { topic: "123", targetKeyword: "Main", additionalContext: "Street" },
      { topic: "305", targetKeyword: "555", additionalContext: "1212" },
      { topic: "+34", targetKeyword: "612", additionalContext: "345 678" },
      { topic: "Reach me at 305-555", targetKeyword: "1212" },
      { topic: "phone 305-555", targetKeyword: "1212" },
      { topic: "Contact +34 612", targetKeyword: "345 678" },
      { topic: "Call 3", targetKeyword: "05-555-1212" },
      { topic: "Call 305-555-121", targetKeyword: "2" },
      { topic: "Contact +3", targetKeyword: "4 612 345 678" },
      { topic: "Contact +", targetKeyword: "34 612 345 678" },
      { topic: "Call 305-", targetKeyword: "555-1212" },
      { topic: "Call 305", targetKeyword: "-", additionalContext: "555-1212" },
      { topic: "Visit us at 123 Main", targetKeyword: "Street" },
      { topic: "Visit us at 123", targetKeyword: "Main Street" },
      { topic: "Visit us at 123", targetKeyword: "Main", additionalContext: "Street" },
    ]) {
      assert.equal(
        containsLikelyPatientIdentifierInAiFields(unlabeledSplitIdentifier),
        true,
        JSON.stringify(unlabeledSplitIdentifier),
      );
    }
    for (const splitEditorialControl of [
      { topic: "123 reasons to seek care", targetKeyword: "Street stress and recovery" },
      { topic: "10 Ways", targetKeyword: "Road to Better Sleep" },
      { topic: "2026", targetKeyword: "Anxiety Guide" },
      { topic: "305 coping strategies", targetKeyword: "555 community resources" },
      { topic: "2026", targetKeyword: "10 ways", additionalContext: "to reduce anxiety" },
      { topic: "Top 305-555 reasons", targetKeyword: "1212 coping ideas" },
      { topic: "Top 3", targetKeyword: "05 coping ideas" },
      { topic: "Guide 30-555-121", targetKeyword: "2 ways to recover" },
      { topic: "Level +3", targetKeyword: "4 coping skills" },
      { topic: "Contact +", targetKeyword: "34 coping ideas" },
      { topic: "Guide 305-", targetKeyword: "555 recovery ideas" },
      { topic: "Guide 305", targetKeyword: "-", additionalContext: "555 recovery ideas" },
      { topic: "123 reasons to seek care", targetKeyword: "Street stress and recovery" },
      { topic: "Visit us for 123 reasons", targetKeyword: "Main Street wellness" },
      { topic: "Main Street Psychiatry", targetKeyword: "telehealth guide" },
    ]) {
      assert.equal(
        containsLikelyPatientIdentifierInAiFields(splitEditorialControl),
        false,
        JSON.stringify(splitEditorialControl),
      );
    }
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
  const generationStorage = fs.readFileSync("server/blog/generation/storage.ts", "utf8");
  const candidateStorage = fs.readFileSync("server/blog/topic-candidate-storage.ts", "utf8");
  const availabilityHelper = generationStorage.slice(
    generationStorage.indexOf("export async function getAvailableCompletedBlogPlanningRun"),
    generationStorage.indexOf("export async function queuePreparedBlogGenerationRun"),
  );
  assert.match(availabilityHelper, /\.select\(\)/);
  assert.doesNotMatch(availabilityHelper, /\.update\(|\.insert\(|\.delete\(/);
  assert.match(availabilityHelper, /eq\(blogGenerationRuns\.status, "completed"\)/);
  assert.match(availabilityHelper, /isNull\(blogGenerationRuns\.postId\)/);
  const atomicClaimHelper = candidateStorage.slice(
    candidateStorage.indexOf("export async function claimBlogTopicCandidateForGeneration"),
  );
  const runClaimIndex = atomicClaimHelper.indexOf(".update(blogGenerationRuns)");
  const legacySelectionIndex = atomicClaimHelper.indexOf(".update(legacyBlogTopicCandidates)");
  const currentSelectionIndex = atomicClaimHelper.indexOf(".update(blogTopicCandidates)");
  assert.match(atomicClaimHelper, /db\.transaction\(async tx/);
  assert.match(atomicClaimHelper, /eq\(blogGenerationRuns\.status, "completed"\)/);
  assert.match(atomicClaimHelper, /isNull\(blogGenerationRuns\.postId\)/);
  assert.match(atomicClaimHelper, /code === "23505"/);
  assert.match(atomicClaimHelper, /statusCode: 409, code: "blog_generation_run_conflict"/);
  assert.ok(runClaimIndex >= 0, "missing conditional planning-run claim");
  assert.ok(runClaimIndex < legacySelectionIndex, "legacy candidate selected before winning plan claim");
  assert.ok(runClaimIndex < currentSelectionIndex, "current candidate selected before winning plan claim");

  for (const [filename, flowMarker] of [
    ["server/blog/admin-routes.ts", 'app.post("/api/admin/blog/generate-draft"'],
    ["app/api/admin/blog/[[...path]]/route.ts", 'segments[0] === "generate-draft"'],
  ]) {
    const source = fs.readFileSync(filename, "utf8");
    assert.match(source, /containsLikelyPatientIdentifierInAiFields\(payload\)/, filename);
    assert.doesNotMatch(source, /possibleSensitiveText/, filename);
    assert.match(source, /payload\s*=\s*\{\s*\.\.\.requestedPayload,\s*\.\.\.persistedOverrides/s, `${filename}: persisted candidate must override request`);
    assert.match(source, /trustedCandidate:\s*(?:planned\.)?buildPersistedTopicSafetyContext\(/, `${filename}: missing persisted safety context`);
    assert.match(source, /trustedCandidate:\s*topicCandidateSelection\?\.trustedCandidate/, `${filename}: guided judge misses persisted context`);
    const flow = source.slice(source.indexOf(flowMarker), source.indexOf(flowMarker) + 9_000);
    const privacyGateIndex = flow.indexOf("containsLikelyPatientIdentifierInAiFields(payload)");
    const atomicClaimIndex = flow.indexOf("claimBlogTopicCandidateForGeneration(");
    const availabilityIndex = flow.indexOf("getAvailableCompletedBlogPlanningRun(");
    const rateLimitIndex = flow.indexOf("const rateLimit = checkBlogAiRateLimit(");
    const semanticJudgeIndex = flow.indexOf("assertGuidedBlogTopicSafe({");
    assert.ok(privacyGateIndex >= 0, `${filename}: missing privacy gate`);
    assert.ok(availabilityIndex >= 0, `${filename}: missing non-mutating plan availability check`);
    assert.ok(availabilityIndex < privacyGateIndex, `${filename}: consumed plan checked after privacy gate`);
    assert.ok(availabilityIndex < rateLimitIndex, `${filename}: consumed plan checked after rate limit`);
    assert.ok(atomicClaimIndex > privacyGateIndex, `${filename}: planning run claimed before privacy gate`);
    assert.ok(atomicClaimIndex > rateLimitIndex, `${filename}: planning run claimed before rate limit`);
    assert.ok(atomicClaimIndex > semanticJudgeIndex, `${filename}: planning run claimed before semantic judge`);
    assert.equal(flow.indexOf("selectBlogTopicCandidate("), -1, `${filename}: candidate selection is not atomic with plan claim`);
    assert.equal(flow.indexOf("claimCompletedBlogPlanningRun("), -1, `${filename}: legacy standalone plan claim remains in route`);
  }
});

test("automatic topic planning shares the fail-closed AI input contract", () => {
  const plannerSource = fs.readFileSync("server/blog/ai/topic-planner.ts", "utf8");
  const providerSource = fs.readFileSync("server/blog/ai/topic-provider.ts", "utf8");
  assert.match(plannerSource, /containsUnsafePlannedTopicAiInput\(input\.proposal\)/);
  assert.doesNotMatch(providerSource, /Prefer patient questions/);
  assert.match(providerSource, /Do not use patient, paciente, client, cliente, name, nombre, or labeled contact details/);

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
  assert.match(source, /semanticProfile:\s*safeProfilesByPostId\.get\(post\.id\)/);
  assert.match(source, /semanticProfile:\s*buildSafeProposalSemanticProfile\(item\.proposal\)/);
});

test("topic judge receives finite semantic profiles without raw historical text", () => {
  const plannerSource = fs.readFileSync("server/blog/ai/topic-planner.ts", "utf8");
  assert.match(plannerSource, /expertiseAngle:\s*trustedExpertiseAngle\s*\|\|/);
  assert.match(plannerSource, /const requestedCategoryKey = guidedSemanticProfile\.categoryKey/);
  const program = `
    import assert from "node:assert/strict";
    process.env.DATABASE_URL = "postgres://user:pass@localhost:5432/test";
    const { buildGuidedTopicSemanticProfile, buildSafePostSemanticProfile } = await import("./server/blog/ai/topic-planner.ts");
    const privateTitle = "Coping With Panic Attacks for Jane Doe";
    const privateKeyword = "managing sudden anxiety episodes for jane doe";
    const profile = buildSafePostSemanticProfile({
      id: 42,
      title: privateTitle,
      targetKeyword: privateKeyword,
      expertiseAngle: null,
      category: null,
      tags: [],
      contentPillar: null,
      patientStage: null,
      contentFormat: null,
      searchIntent: null,
    });
    const serialized = JSON.stringify(profile);
    assert.equal(profile.categoryKey, "anxiety");
    assert.equal(profile.intentFacet, "acute_symptom_coping");
    assert.equal(profile.pillar, "daily_function");
    assert.equal(serialized.includes(privateTitle), false);
    assert.equal(serialized.includes(privateKeyword), false);
    assert.deepEqual(Object.keys(profile).sort(), [
      "categoryKey", "contentFormat", "intentFacet", "patientStage", "pillar", "searchIntent",
    ]);
    const trustedGuidedProfile = buildGuidedTopicSemanticProfile({
      topic: "Understanding Anxiety",
      targetKeyword: "anxiety overview",
      trustedCandidate: {
        categoryKey: "anxiety",
        pillar: "medication_safety",
        patientStage: "treatment_consideration",
        contentFormat: "questions_to_ask",
        searchIntent: "treatment_consideration",
        expertiseAngle: "Medication safety and side effect questions for follow-up care.",
      },
    });
    assert.deepEqual(trustedGuidedProfile, {
      categoryKey: "anxiety",
      pillar: "medication_safety",
      patientStage: "treatment_consideration",
      contentFormat: "questions_to_ask",
      searchIntent: "treatment_consideration",
      intentFacet: "medication_safety",
    });
  `;
  const result = spawnSync(
    process.execPath,
    ["--import", "tsx", "--input-type=module", "-e", program],
    { cwd: process.cwd(), encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr || result.stdout);
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

test("draft provider never receives raw free-form editorial context", () => {
  const generatorSource = fs.readFileSync("server/blog/ai/generator.ts", "utf8");
  const expressRouteSource = fs.readFileSync("server/blog/admin-routes.ts", "utf8");
  const nextRouteSource = fs.readFileSync("app/api/admin/blog/[[...path]]/route.ts", "utf8");
  assert.match(generatorSource, /buildProviderSafeBlogInput\(input\)/);
  assert.match(generatorSource, /buildHealingMindsBlogPrompt\(providerInput\)/);
  assert.doesNotMatch(generatorSource, /buildHealingMindsBlogPrompt\(input\)/);
  assert.match(expressRouteSource, /generationRunId, selectedCandidate\.angle\)/);
  assert.match(expressRouteSource, /claimedPlanningRun\?\.id, topicCandidateSelection \? payload\.expertiseAngle : undefined\)/);
  assert.match(nextRouteSource, /claimedPlanningRun\?\.id, topicCandidateSelection \? payload\.expertiseAngle : undefined\)/);
  assert.doesNotMatch(expressRouteSource, /claimedPlanningRun\?\.id, payload\.additionalContext\)/);
  assert.doesNotMatch(nextRouteSource, /claimedPlanningRun\?\.id, payload\.additionalContext\)/);

  const program = `
    import assert from "node:assert/strict";
    process.env.OPENAI_API_KEY = "test-provider-key";
    process.env.BLOG_AI_ENABLED = "true";
    const { buildProviderSafeBlogInput, generateBlogDraftWithAi } = await import("./server/blog/ai/generator.ts");
    const { selectBlogResearchSources } = await import("./server/blog/ai/research.ts");
    const privateContext = "notes about jane doe and maría garcía for follow up";
    const input = {
      topic: "Anxiety coping options",
      targetKeyword: "anxiety coping",
      additionalContext: privateContext,
      language: "en",
      editorialBrief: {
        targetWordCount: 1000,
        minimumWordCount: 800,
        maximumWordCount: 1200,
        searchIntent: "Educational",
        audience: "Florida adults",
        requiredSections: ["Coping options"],
        requiredInternalLinks: [],
        sourceRequirement: "Curated sources only",
        riskNotes: [],
      },
    };
    const safe = buildProviderSafeBlogInput(input);
    assert.equal(Object.hasOwn(safe, "additionalContext"), false);
    assert.equal(JSON.stringify(safe).includes(privateContext), false);
    assert.equal(safe.topic, "Anxiety coping options");
    assert.deepEqual(safe.editorialBrief.requiredSections, ["Coping options"]);
    const trustedPlannerAngle = "Differentiate coping skills by daily routine and care setting.";
    const trusted = buildProviderSafeBlogInput({
      ...input,
      providerEditorialContext: trustedPlannerAngle,
    });
    assert.equal(trusted.additionalContext, trustedPlannerAngle);
    assert.equal(Object.hasOwn(trusted, "providerEditorialContext"), false);
    assert.equal(JSON.stringify(trusted).includes(privateContext), false);

    let providerBody = "";
    globalThis.fetch = async (_url, init) => {
      providerBody = String(init?.body || "");
      return new Response(JSON.stringify({ error: { message: "intentional test stop" } }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    };
    await assert.rejects(generateBlogDraftWithAi(input), /Blog AI provider request failed/);
    assert.equal(providerBody.includes("jane doe"), false);
    assert.equal(providerBody.includes("maría garcía"), false);
    assert.equal(providerBody.includes(privateContext), false);
    assert.equal(providerBody.includes("No additional editorial context provided."), true);
    assert.equal(providerBody.includes("Coping options"), true);

    providerBody = "";
    await assert.rejects(generateBlogDraftWithAi({
      ...input,
      providerEditorialContext: trustedPlannerAngle,
    }), /Blog AI provider request failed/);
    assert.equal(providerBody.includes(privateContext), false);
    assert.equal(providerBody.includes(trustedPlannerAngle), true);

    const localResearch = selectBlogResearchSources({
      topic: "General wellness overview",
      targetKeyword: "wellness overview",
      additionalContext: "medication safety",
      language: "en",
    });
    assert.equal(localResearch.sources.some(source => source.id === "nimh-medications"), true);
  `;
  const result = spawnSync(
    process.execPath,
    ["--import", "tsx", "--input-type=module", "-e", program],
    { cwd: process.cwd(), encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test("image generation checks explicit identifiers without treating public editorial names as patients", () => {
  const source = fs.readFileSync("server/blog/images/service.ts", "utf8");
  assert.match(source, /containsLikelyPatientIdentifierAcrossTextFields\(sensitiveInputs\)/);
  assert.doesNotMatch(source, /containsHighConfidencePersonName|containsLikelyPatientIdentifierInTexts/);
});

test("legacy contact route never logs a persisted submission body", () => {
  const source = fs.readFileSync("server/routes.ts", "utf8");
  assert.doesNotMatch(source, /console\.(?:log|info|debug)\([^\n]*contactMessage/);
  assert.doesNotMatch(source, /console\.(?:log|info|debug)\([^\n]*(?:validatedData|req\.body)/);
});
