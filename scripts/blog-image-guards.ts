import assert from "node:assert/strict";
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
  containsLikelyPatientIdentifierInAiFields,
} from "../server/blog/privacy";
import { buildSafeVisualBrief } from "../server/blog/images/prompt";

const originalEnabled = process.env.BLOG_IMAGE_ENABLED;
const originalApiKey = process.env.OPENAI_API_KEY;
const originalModel = process.env.BLOG_IMAGE_MODEL;

try {
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
    promptVersion: "healing-minds-v1",
    provider: "openai",
    model: "gpt-image-2",
    generationRunId: null,
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
  assert.equal(containsLikelyPatientIdentifier("Understanding Seasonal Affective Disorder"), false);
  assert.equal(containsLikelyPatientIdentifier("Managing Panic Attacks"), false);
  assert.equal(containsLikelyPatientIdentifierInAiFields({ topic: "Depresión Estacional" }), false);
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
  assert.match(visualBrief, /Approved article theme: anxiety education/);
  assert.equal(visualBrief.includes("Maria Garcia"), false);
  assert.equal(visualBrief.includes("123 Main Street"), false);

  console.log("Blog image config, path, PHI, sanitizer, and render guards passed.");
} finally {
  if (originalEnabled === undefined) delete process.env.BLOG_IMAGE_ENABLED;
  else process.env.BLOG_IMAGE_ENABLED = originalEnabled;
  if (originalApiKey === undefined) delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY = originalApiKey;
  if (originalModel === undefined) delete process.env.BLOG_IMAGE_MODEL;
  else process.env.BLOG_IMAGE_MODEL = originalModel;
}
