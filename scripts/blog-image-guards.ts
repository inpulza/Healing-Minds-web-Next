import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type { BlogPostImage } from "@shared/schema";
import { getBlogImageConfig, isBlogImageEnabled } from "../server/blog/images/config";
import {
  getManagedBlogImagePublicUrl,
  isManagedBlogImageKey,
  isManagedBlogImagePublicUrl,
} from "../server/blog/images/object-storage";
import { materializeSelectedInlineImages } from "../server/blog/images/render";
import {
  sanitizeBlogContentHtml,
  sanitizeRenderedBlogContentHtml,
} from "../server/blog/sanitize";
import {
  containsHighConfidencePersonName,
  containsLikelyPatientIdentifier,
  containsLikelyPatientIdentifierAcrossTextFields,
  containsLikelyPatientIdentifierInAiFields,
} from "../server/blog/privacy";
import {
  BLOG_IMAGE_PROMPT_VERSION,
  buildBlogImageAlt,
  buildBlogImagePrompt,
  buildSafeVisualBrief,
} from "../server/blog/images/prompt";
import { checkBlogImageRateLimit, getBlogImageRateLimitCost } from "../server/blog/images/rate-limit";
import { summarizeBlogImageJobSlots } from "../server/blog/images/job-summary";

const originalEnabled = process.env.BLOG_IMAGE_ENABLED;
const originalApiKey = process.env.OPENAI_API_KEY;
const originalModel = process.env.BLOG_IMAGE_MODEL;
const nextAdminBlogRoute = readFileSync(
  new URL("../app/api/admin/blog/[[...path]]/route.ts", import.meta.url),
  "utf8",
);

try {
  assert.match(
    nextAdminBlogRoute,
    /^export const maxDuration = 600;$/m,
    "The durable image worker must retain enough execution time after the HTTP response",
  );
  assert.match(nextAdminBlogRoute, /Idempotency-Key/);
  assert.match(nextAdminBlogRoute, /executePersistedBlogImageGenerationJob/);
  process.env.BLOG_IMAGE_ENABLED = "false";
  delete process.env.OPENAI_API_KEY;
  assert.equal(isBlogImageEnabled(), false);
  assert.throws(() => getBlogImageConfig(), /disabled/);

  process.env.BLOG_IMAGE_ENABLED = "true";
  assert.throws(() => getBlogImageConfig(), /not configured/);
  process.env.OPENAI_API_KEY = "guard-test-key";
  delete process.env.BLOG_IMAGE_MODEL;
  assert.equal(getBlogImageConfig().model, "gpt-image-2");

  const objectKey = "blog-images/posts/post-42-inline-1-1785146400000-a1b2c3d4e5f6.webp";
  const publicUrl = getManagedBlogImagePublicUrl(objectKey);
  assert.equal(isManagedBlogImageKey(objectKey), true);
  assert.equal(isManagedBlogImagePublicUrl(publicUrl), true);
  assert.equal(isManagedBlogImageKey("../blog-images/posts/secret.webp"), false);
  assert.equal(isManagedBlogImagePublicUrl("https://example.com/image.webp"), false);
  assert.equal(isManagedBlogImagePublicUrl("/public-objects/blog-images/posts/not-managed.png"), false);

  const providerHtml = `<h2>Safe heading</h2><img src="${publicUrl}" alt="provider attempted image"><p>Body</p>`;
  assert.equal(sanitizeBlogContentHtml(providerHtml).includes("<img"), false);
  assert.equal(
    sanitizeRenderedBlogContentHtml(`<figure><img src="https://example.com/unsafe.webp"></figure>`).includes("<img"),
    false,
  );

  const selectedInline: BlogPostImage = {
    id: 7,
    postId: 42,
    role: "inline",
    slot: "inline:1",
    anchorHeading: "Safe heading",
    source: "ai",
    generationStatus: "completed",
    reviewStatus: "selected",
    objectKey,
    publicUrl,
    mimeType: "image/webp",
    width: 1536,
    height: 1024,
    bytes: 1234,
    checksum: "a".repeat(64),
    alt: "Calm educational mental health illustration",
    caption: "Educational editorial image.",
    safeVisualBrief: "Safe visual brief",
    prompt: "Safe prompt",
    promptVersion: BLOG_IMAGE_PROMPT_VERSION,
    provider: "openai",
    model: "gpt-image-2",
    generationRunId: null,
    imageJobId: null,
    startedAt: new Date(),
    completedAt: new Date(),
    durationMs: 1000,
    errorCode: null,
    errorMessage: null,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const rendered = materializeSelectedInlineImages(
    "<h2>Safe heading</h2><p>Educational body.</p>",
    [selectedInline],
  );
  assert.match(rendered, /<h2>Safe heading<\/h2><figure class="blog-inline-image">/);
  assert.match(rendered, new RegExp(publicUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal(rendered.includes("https://example.com"), false);

  const failedInline: BlogPostImage = {
    ...selectedInline,
    id: 8,
    generationStatus: "failed",
    reviewStatus: "candidate",
    objectKey: null,
    publicUrl: null,
    errorCode: "provider_error",
    errorMessage: "Provider failed safely",
  };
  assert.equal(summarizeBlogImageJobSlots([selectedInline]).status, "completed");
  assert.equal(summarizeBlogImageJobSlots([selectedInline, failedInline]).status, "partial_failed");
  const failedSummary = summarizeBlogImageJobSlots([failedInline]);
  assert.equal(failedSummary.status, "failed");
  assert.deepEqual(failedSummary.result.failedImageIds, [8]);

  assert.equal(containsLikelyPatientIdentifier("patient name: Jane Example"), true);
  assert.equal(containsLikelyPatientIdentifier("Name: jane doe"), true);
  assert.equal(containsLikelyPatientIdentifier("Our patient Maria Garcia sought psychiatric care last week."), true);
  assert.equal(containsLikelyPatientIdentifier("Case: Maria Garcia, 123 Main Street, Naples, Florida."), true);
  assert.equal(containsLikelyPatientIdentifier("Name: Maria Garcia"), true);
  assert.equal(containsLikelyPatientIdentifier("Nombre: Maria Care"), true);
  assert.equal(containsHighConfidencePersonName("María García"), true);
  assert.equal(containsHighConfidencePersonName("María García-López"), true);
  assert.equal(containsHighConfidencePersonName("José O’Neill"), true);
  assert.equal(containsHighConfidencePersonName("Ana-María O'Neill"), true);
  assert.equal(containsHighConfidencePersonName("José Luis Pérez"), true);
  assert.equal(containsHighConfidencePersonName("MARÍA GARCÍA"), true);
  assert.equal(containsHighConfidencePersonName("María J. García"), true);
  assert.equal(containsHighConfidencePersonName("María de la Cruz"), true);
  assert.equal(containsHighConfidencePersonName("Maria Garcia"), true);
  assert.equal(containsHighConfidencePersonName("Maria Care"), true);
  assert.equal(containsHighConfidencePersonName("Notes about Maria Garcia for follow up"), true);
  assert.equal(containsHighConfidencePersonName("Context: Maria Garcia"), true);
  assert.equal(containsHighConfidencePersonName("anxiety María García"), true);
  assert.equal(containsHighConfidencePersonName("Fatima Khan"), true);
  assert.equal(containsHighConfidencePersonName("Saoirse O'Connor"), true);
  assert.equal(containsHighConfidencePersonName("Zoë Kravitz"), true);
  assert.equal(containsHighConfidencePersonName("Łukasz Kowalski"), true);
  assert.equal(containsHighConfidencePersonName("FÁTIMA KHAN"), true);
  assert.equal(containsHighConfidencePersonName("José-Luis Pérez"), true);
  assert.equal(containsLikelyPatientIdentifier("Paciente María García fue diagnosticada con ansiedad."), true);
  assert.equal(containsLikelyPatientIdentifier("Patient José O’Neill was prescribed medication."), true);
  assert.equal(containsLikelyPatientIdentifier("Número de paciente: AB-12345"), true);
  assert.equal(containsLikelyPatientIdentifier("Historia clínica: HM-67890"), true);
  assert.equal(containsLikelyPatientIdentifier("Fecha de nacimiento: 5 de enero de 1980"), true);
  assert.equal(containsLikelyPatientIdentifier("general educational article about anxiety"), false);
  assert.equal(containsLikelyPatientIdentifier("Anxiety Treatment Options"), false);
  assert.equal(containsLikelyPatientIdentifier("Healing Minds Psychiatry"), false);
  assert.equal(containsLikelyPatientIdentifier("About Us"), false);
  assert.equal(containsLikelyPatientIdentifier("Patient Resources"), false);
  assert.equal(containsLikelyPatientIdentifierAcrossTextFields(["Patient name:", "Jane Doe"]), true);
  assert.equal(containsLikelyPatientIdentifierAcrossTextFields(["Patient name:", "\"Jane Doe\""]), true);
  assert.equal(containsLikelyPatientIdentifierAcrossTextFields(["Patient name:", "(Jane Doe)"]), true);
  assert.equal(containsLikelyPatientIdentifierAcrossTextFields(["Patient name:", "Journey Smith"]), true);
  assert.equal(containsLikelyPatientIdentifierAcrossTextFields(["Nombre del paciente:", "María García"]), true);
  assert.equal(containsLikelyPatientIdentifierAcrossTextFields(["Nombre del paciente:", "«María García»"]), true);
  assert.equal(containsLikelyPatientIdentifierAcrossTextFields(["Nombre legal:", "María García"]), true);
  assert.equal(containsLikelyPatientIdentifierAcrossTextFields(["Nombre completo:", "María García"]), true);
  assert.equal(containsLikelyPatientIdentifierAcrossTextFields(["Patient email:", "jane.doe", "@example.com"]), true);
  assert.equal(containsLikelyPatientIdentifierAcrossTextFields(["Patient Resources", "Care Options"]), false);
  assert.equal(containsLikelyPatientIdentifierAcrossTextFields(["Name and Identity in Therapy", "Legal considerations"]), false);
  assert.equal(containsLikelyPatientIdentifierAcrossTextFields(["Legal Name:", "What Patients Should Know"]), true);
  assert.equal(containsLikelyPatientIdentifierAcrossTextFields(["Name:", "and Identity in Therapy"]), false);
  assert.equal(containsLikelyPatientIdentifierAcrossTextFields(["Names:", "Why Preferred Terms Matter"]), false);
  assert.equal(containsLikelyPatientIdentifierAcrossTextFields(["Understanding the Patient", "Journey Through Recovery"]), false);
  assert.equal(containsLikelyPatientIdentifier("Understanding Seasonal Affective Disorder"), false);
  assert.equal(containsLikelyPatientIdentifier("Managing Panic Attacks"), false);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Depresión Estacional" }), false);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Client: jane doe" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Cliente: maría garcía" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Clients: jane doe" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Clientes: maría garcía" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Phone: +34 612 345 678" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Teléfono: +52 55 1234 5678" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "International access to telepsychiatry" }), false);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Anxiety Treatment" }), false);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Medication Management" }), false);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "ADHD Evaluation" }), false);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Mind Body Connection" }), false);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Trauma Recovery Tools" }), false);
  assert.equal(containsLikelyPatientIdentifierInAiFields({
    topic: "anxiety",
    additionalContext: "María García",
  }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({
    topic: "anxiety",
    additionalContext: "Maria Garcia",
  }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({
    topic: "Managing Panic Attacks",
    additionalContext: "educational coping strategies",
  }), false);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "María García" }), false);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ targetKeyword: "Maria Garcia" }), false);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ additionalContext: "Fatima Khan" }), true);
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
    assert.equal(containsLikelyPatientIdentifierInAiFields({ additionalContext: legitimateLowercaseContext }), false);
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
    assert.equal(containsLikelyPatientIdentifierInAiFields(explicitPluralLabel), true);
  }
  for (const legitimatePluralEditorialText of [
    { topic: "Patients and Families Seeking Care" },
    { topic: "Resources for patients in Florida" },
    { topic: "Names used for common therapy approaches" },
    { topic: "Apoyo para pacientes y familias" },
    { topic: "Patients", targetKeyword: "Care Options" },
    { topic: "Nombres", targetKeyword: "de enfoques terapéuticos" },
  ]) {
    assert.equal(containsLikelyPatientIdentifierInAiFields(legitimatePluralEditorialText), false);
  }
  assert.equal(containsLikelyPatientIdentifier("patient Fatima Khan requested help"), true);
  assert.equal(containsLikelyPatientIdentifier("Patient Fatima requested help"), true);
  assert.equal(containsLikelyPatientIdentifier("patient Fatima Khan called yesterday"), true);
  assert.equal(containsLikelyPatientIdentifier("patient Fatima Khan said she needs help"), true);
  assert.equal(containsLikelyPatientIdentifier("paciente Fátima Khan llamó ayer"), true);
  assert.equal(containsLikelyPatientIdentifier("patient jane doe called yesterday"), true);
  assert.equal(containsLikelyPatientIdentifier("paciente maría garcía llamó ayer"), true);
  assert.equal(containsLikelyPatientIdentifier("patient jane doe needs help"), true);
  assert.equal(containsLikelyPatientIdentifier("paciente maría garcía necesita ayuda"), true);
  assert.equal(containsLikelyPatientIdentifier("patient will smith called yesterday"), true);
  assert.equal(containsLikelyPatientIdentifier("patient may lee called yesterday"), true);
  assert.equal(containsLikelyPatientIdentifier("patient madonna called yesterday"), true);
  assert.equal(containsLikelyPatientIdentifier("paciente madonna llamó ayer"), true);
  assert.equal(containsLikelyPatientIdentifier("patient madonna requires help"), true);
  assert.equal(containsLikelyPatientIdentifier("patient jane doe denies symptoms"), true);
  assert.equal(containsLikelyPatientIdentifier("Patient name Jane Doe"), true);
  assert.equal(containsLikelyPatientIdentifier("Nombre del paciente María García"), true);
  assert.equal(containsLikelyPatientIdentifier("Patient Jane Doe"), true);
  assert.equal(containsLikelyPatientIdentifier("Paciente María García"), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({
    topic: "Patient name:",
    targetKeyword: "Jane Doe",
  }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({
    topic: "Date of birth",
    targetKeyword: "5 de enero de 1980",
  }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient-Centered Care in Psychiatry" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Case-Based Approaches to Anxiety" }), false);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "patient support services started in 2020" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "patient may benefit from therapy" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "patient will receive follow-up care" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "patient privacy in telehealth" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "patient confidentiality and HIPAA" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient HIPAA Privacy Rules" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient Telehealth Privacy" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient Guide to Managing Anxiety" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient Perspectives on Mental Health" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient Guide to Jane Doe" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient Perspectives from Maria Lopez" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "patient guide to Jane Doe" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient perspectives from Maria Lopez" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient provided Jane Doe as her name" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Paciente proporcionó María García como su nombre" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient provided \"Jane Doe\" as her name" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient provided (Jane Doe) as her name" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient provided Madonna as her name" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Paciente proporcionó Madonna como su nombre" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Paciente proporcionó «María García» como su nombre" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Paciente proporcionó «Pelé» como su nombre" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient mentioned Pelé during intake" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient provided “Pelé” during intake" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient provided Madonna as my name" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient provided Madonna as her full name" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient provided Madonna as her legal name" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Paciente proporcionó Madonna como mi nombre" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient Reported “Jane Doe” during Intake" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient Said “Jane Doe” during Intake" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient Wrote “Jane Doe” during Intake" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient SAID “JANE DOE” during Intake" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient said Jane Doe during intake" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient WROTE JANE DOE during intake" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Paciente dijo María García durante la admisión" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient is Jane Doe" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient was Jane Doe during intake" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient has Jane Doe as contact" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Paciente es María García" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient spoke to Jane Doe" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient referred to Jane Doe" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient sent records to Jane Doe" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Paciente refirió a María García" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Paciente remitió a María García" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient provided", targetKeyword: "Jane Doe as her name" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient Guide to", targetKeyword: "Jane Doe" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient provided", targetKeyword: "Madonna", additionalContext: "as her name" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient provided", targetKeyword: "Pelé", additionalContext: "as my name" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient Said", targetKeyword: "“Jane Doe”" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient said", targetKeyword: "Jane Doe" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient referred to", targetKeyword: "Jane Doe" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Paciente remitió a", targetKeyword: "María García" }), true);
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
    assert.equal(containsLikelyPatientIdentifierInAiFields(patientMarkedAiInput), true);
  }
  for (const rephrasedEditorialInput of [
    { topic: "New York resources for adults" },
    { topic: "Telehealth resources across Florida" },
    { topic: "Coping skills for anxiety" },
    { topic: "Billing department workflow" },
  ]) {
    assert.equal(containsLikelyPatientIdentifierInAiFields(rephrasedEditorialInput), false);
  }
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "patient confidentiality in Florida" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "patient access to Florida care" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "patient resources for Naples adults" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "patient privacy under Florida law" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "patient confidentiality in", targetKeyword: "Florida" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "patient navigating South Florida resources" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "patient moving to New York" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "patient discussed South Florida resources" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "patient navigating", targetKeyword: "South Florida" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "patient discussed New York resources" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "patient lives in New York" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "patient reviewed Los Angeles providers" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "patient seeking New York services" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "patient discussed", targetKeyword: "New York resources" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "patient moving toward New York" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "patient relocated into New York" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "patient living outside New York" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "patient reviewed New York coverage" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "patient discussed Los Angeles clinics" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "paciente vive en Nueva York" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "paciente busca servicios en Nueva York" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "paciente se mudó a Nueva York" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "paciente revisó proveedores en Los Ángeles" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "patient lives in", targetKeyword: "New York" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "paciente vive en", targetKeyword: "Nueva York" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "patient guide to", targetKeyword: "Jane Doe" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "patient housing needs" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "patient family needs assessment" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({
    topic: "Date",
    targetKeyword: "of birth:",
    additionalContext: "01/05/1980",
  }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({
    topic: "Patient",
    targetKeyword: "Care Options",
    additionalContext: "support services",
  }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({
    topic: "Patient",
    targetKeyword: "jane doe",
    additionalContext: "called yesterday",
  }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({
    topic: "Patient email:",
    targetKeyword: "jane.doe",
    additionalContext: "@example.com",
  }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient Care Options" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient Resources and Treatment Options" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient Resources across Florida" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Patient Safety during Telehealth" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Paciente Cuidado desde Casa" }), true);
  assert.equal(containsLikelyPatientIdentifier("Name: Madonna"), true);
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
    assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: wrappedGenericName }), true);
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
    assert.equal(containsLikelyPatientIdentifier(publicEditorialTitle), false);
  }
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Legal name", targetKeyword: "jane doe" }), true);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Nombre completo", targetKeyword: "maría garcía" }), true);
  for (const wrappedSplitName of [
    { topic: "Legal name", targetKeyword: '"Jane Doe"' },
    { topic: "Preferred full legal name", targetKeyword: "(jane doe)" },
    { topic: "Legal name:", targetKeyword: '"Jane Doe"' },
    { topic: "Nombre completo:", targetKeyword: "(maría garcía)" },
    { topic: "Legal name —", targetKeyword: "[Jane Doe]" },
    { topic: "Nombre completo es", targetKeyword: "{María García}" },
  ]) {
    assert.equal(containsLikelyPatientIdentifierInAiFields(wrappedSplitName), true);
  }

  const previousImageLimit = process.env.BLOG_IMAGE_HOURLY_LIMIT;
  process.env.BLOG_IMAGE_HOURLY_LIMIT = "2";
  const rateLimitKey = `guard-${Date.now()}`;
  assert.equal(checkBlogImageRateLimit(rateLimitKey).allowed, true);
  assert.equal(checkBlogImageRateLimit(rateLimitKey).allowed, true);
  assert.equal(checkBlogImageRateLimit(rateLimitKey).allowed, false);
  process.env.BLOG_IMAGE_HOURLY_LIMIT = "4";
  const paidCallKey = `paid-call-guard-${Date.now()}`;
  assert.equal(checkBlogImageRateLimit(
    paidCallKey,
    getBlogImageRateLimitCost("all", 2),
  ).allowed, true);
  assert.equal(checkBlogImageRateLimit(
    paidCallKey,
    getBlogImageRateLimitCost("inline", 2),
  ).allowed, false);
  if (previousImageLimit === undefined) delete process.env.BLOG_IMAGE_HOURLY_LIMIT;
  else process.env.BLOG_IMAGE_HOURLY_LIMIT = previousImageLimit;

  const privateDraft = {
    id: 42,
    title: "Our patient Maria Garcia and anxiety",
    slug: "private-draft",
    language: "en" as const,
    translationGroupId: "00000000-0000-4000-8000-000000000042",
    excerpt: "Case: Maria Garcia, 123 Main Street, Naples, Florida.",
    content: "<h2>Maria Garcia's care</h2><p>Private narrative.</p>",
    featuredImage: null,
    featuredImageAlt: null,
    authorId: null,
    categoryId: null,
    status: "draft" as const,
    isFeatured: false,
    metaTitle: null,
    metaDescription: null,
    readingTime: 1,
    topicCandidateId: null,
    topicKey: null,
    targetKeyword: null,
    contentPillar: null,
    patientStage: null,
    contentFormat: null,
    searchIntent: null,
    expertiseAngle: null,
    topicStrategyVersion: null,
    publishedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: null,
    category: null,
    tags: [],
  };
  const visualBrief = buildSafeVisualBrief(privateDraft, "hero");
  assert.match(visualBrief, /APPROVED THEME: anxiety education/);
  assert.equal(visualBrief.includes("Maria Garcia"), false);
  assert.equal(visualBrief.includes("123 Main Street"), false);

  const telehealthDraft = {
    ...privateDraft,
    id: 43,
    title: "Preparing for a Telepsychiatry Appointment in Florida",
    translationGroupId: "00000000-0000-4000-8000-000000000043",
    excerpt: "A general educational guide to virtual care.",
    content: "<h2>What patients can expect</h2><p>General educational content.</p>",
  };
  const telehealthHeroBrief = buildSafeVisualBrief(telehealthDraft, "hero", null, "hero");
  const telehealthInlineBrief = buildSafeVisualBrief(
    telehealthDraft,
    "inline",
    "What patients can expect",
    "inline:1",
  );
  assert.match(telehealthHeroBrief, /APPROVED THEME: private telehealth access/);
  assert.match(telehealthHeroBrief, /fictional adult/i);
  assert.match(telehealthHeroBrief, /CAMPAIGN TREATMENT:/);
  assert.match(telehealthHeroBrief, /medium-format feel/);
  assert.match(telehealthHeroBrief, /Do not depict children or infants/);
  assert.match(telehealthHeroBrief, /anatomically and spatially coherent/);
  assert.doesNotMatch(telehealthHeroBrief, /still life|desk with a window/i);
  assert.notEqual(telehealthHeroBrief, telehealthInlineBrief);
  assert.match(buildBlogImagePrompt(telehealthHeroBrief), /horizontal 3:2 photograph/);
  assert.match(buildBlogImagePrompt(telehealthHeroBrief), /five fingers when fully visible/);
  assert.match(buildBlogImageAlt(telehealthDraft, "hero"), /editorial photograph/i);
  assert.equal(BLOG_IMAGE_PROMPT_VERSION, "healing-minds-v3");

  console.log("Blog image config, topic variety, PHI, sanitizer, and render guards passed.");
} finally {
  if (originalEnabled === undefined) delete process.env.BLOG_IMAGE_ENABLED;
  else process.env.BLOG_IMAGE_ENABLED = originalEnabled;
  if (originalApiKey === undefined) delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY = originalApiKey;
  if (originalModel === undefined) delete process.env.BLOG_IMAGE_MODEL;
  else process.env.BLOG_IMAGE_MODEL = originalModel;
}
