import { eq } from "drizzle-orm";
import {
  blogPosts,
  type InsertBlogLink,
  type InsertBlogLinkSource,
} from "@shared/schema";
import { db } from "../../db";
import { getSeoSiteConfig } from "../../seo/config";
import { BLOG_LINK_SCORE_VERSION } from "./config";
import { normalizeBlogLinkHref } from "./normalization";
import {
  scoreSourceQuality,
  type SourceQualityBreakdown,
} from "./scoring";
import {
  getBlogLinkByCanonicalHref,
  insertBlogLinkIfMissing,
  insertBlogLinkSourceIfMissing,
} from "./storage";
import { syncManagedBlogPostTarget } from "./service";

const SEEDED_REVIEW_AT = new Date("2026-07-27T00:00:00.000Z");

type BlogLinkSeedLogger = Pick<Console, "log" | "warn" | "error">;

type SeedBlogLinkLibraryOptions = {
  logger?: BlogLinkSeedLogger;
  includePublishedPosts?: boolean;
};

type SeededLinkDefinition = {
  stableKey: string;
  sourceStableKey: string;
  href: string;
  kind: "internal" | "external";
  title: string;
  label: string;
  language: "en" | "es" | "all";
  sourceCategory: string;
  topicTags: string[];
  categoryKeys: string[];
  contentPillars: string[];
  keywords: string[];
  summary: string;
  evidenceType: string;
  evidenceScope: string;
  evidenceScore: number;
  freshnessScore: number;
};

const FIRST_PARTY_QUALITY: SourceQualityBreakdown = {
  accountablePublisher: 25,
  expertReview: 25,
  traceableEvidence: 10,
  currency: 15,
  fundingTransparency: 5,
  stableIdentifier: 5,
};

const NIMH_QUALITY: SourceQualityBreakdown = {
  accountablePublisher: 25,
  expertReview: 25,
  traceableEvidence: 20,
  currency: 15,
  fundingTransparency: 10,
  stableIdentifier: 5,
};

const LIFELINE_QUALITY: SourceQualityBreakdown = {
  accountablePublisher: 25,
  expertReview: 25,
  traceableEvidence: 15,
  currency: 15,
  fundingTransparency: 10,
  stableIdentifier: 5,
};

const FIRST_PARTY_SCORE = scoreSourceQuality(FIRST_PARTY_QUALITY);
const NIMH_SCORE = scoreSourceQuality(NIMH_QUALITY);
const LIFELINE_SCORE = scoreSourceQuality(LIFELINE_QUALITY);

const SOURCE_SEEDS: InsertBlogLinkSource[] = [
  {
    stableKey: "healing-minds-psychiatry",
    name: "Healing Minds Psychiatry",
    canonicalDomain: "healingmindsp.com",
    sourceType: "first_party",
    languages: ["en", "es"],
    reviewStatus: "approved",
    reviewedBy: "Healing Minds editorial seed",
    reviewedAt: SEEDED_REVIEW_AT,
    reviewNotes: "First-party public pages managed by Healing Minds Psychiatry.",
    qualityScore: FIRST_PARTY_SCORE.total,
    qualityBreakdown: FIRST_PARTY_SCORE.breakdown,
    scoreVersion: FIRST_PARTY_SCORE.scoreVersion,
  },
  {
    stableKey: "nimh",
    name: "National Institute of Mental Health",
    canonicalDomain: "nimh.nih.gov",
    sourceType: "government",
    languages: ["en", "es"],
    reviewStatus: "approved",
    reviewedBy: "Healing Minds editorial seed",
    reviewedAt: SEEDED_REVIEW_AT,
    reviewNotes: "Existing approved federal mental-health education source.",
    qualityScore: NIMH_SCORE.total,
    qualityBreakdown: NIMH_SCORE.breakdown,
    scoreVersion: NIMH_SCORE.scoreVersion,
  },
  {
    stableKey: "988-lifeline-publisher",
    name: "988 Suicide & Crisis Lifeline",
    canonicalDomain: "988lifeline.org",
    sourceType: "crisis",
    languages: ["en", "es"],
    reviewStatus: "approved",
    reviewedBy: "Healing Minds editorial seed",
    reviewedAt: SEEDED_REVIEW_AT,
    reviewNotes: "Official operational crisis resource; use only in genuine crisis context.",
    qualityScore: LIFELINE_SCORE.total,
    qualityBreakdown: LIFELINE_SCORE.breakdown,
    scoreVersion: LIFELINE_SCORE.scoreVersion,
  },
];

const INTERNAL_LINK_SEEDS: SeededLinkDefinition[] = [
  {
    stableKey: "hm-en-services",
    sourceStableKey: "healing-minds-psychiatry",
    href: "/services",
    kind: "internal",
    title: "Psychiatric Services",
    label: "psychiatric services",
    language: "en",
    sourceCategory: "first_party_service_hub",
    topicTags: ["psychiatry", "treatment", "care"],
    categoryKeys: [
      "anxiety",
      "depression",
      "adult_adhd",
      "trauma_ptsd",
      "bipolar",
      "medication",
    ],
    contentPillars: ["condition_education", "evaluation_care_journey", "medication_safety"],
    keywords: [
      "service",
      "services",
      "treatment",
      "care",
      "medication",
      "anxiety",
      "depression",
      "psychiatric",
      "servicio",
      "tratamiento",
      "cuidado",
    ],
    summary: "Healing Minds overview of psychiatric services.",
    evidenceType: "first_party_service_page",
    evidenceScope: "First-party care and service navigation.",
    evidenceScore: 100,
    freshnessScore: 100,
  },
  {
    stableKey: "hm-en-telepsychiatry",
    sourceStableKey: "healing-minds-psychiatry",
    href: "/telepsychiatry-florida",
    kind: "internal",
    title: "Telepsychiatry in Florida",
    label: "telepsychiatry options in Florida",
    language: "en",
    sourceCategory: "first_party_service",
    topicTags: ["telepsychiatry", "virtual care", "Florida"],
    categoryKeys: ["telepsychiatry"],
    contentPillars: ["access_telepsychiatry", "local_service_navigation"],
    keywords: [
      "telepsychiatry",
      "online",
      "virtual",
      "remote",
      "Florida",
      "telepsiquiatria",
      "remoto",
    ],
    summary: "Healing Minds information about virtual psychiatric care in Florida.",
    evidenceType: "first_party_service_page",
    evidenceScope: "First-party telepsychiatry access and service information.",
    evidenceScore: 100,
    freshnessScore: 100,
  },
  {
    stableKey: "hm-en-for-patients",
    sourceStableKey: "healing-minds-psychiatry",
    href: "/for-patients",
    kind: "internal",
    title: "For Patients",
    label: "patient information",
    language: "en",
    sourceCategory: "first_party_patient_resource",
    topicTags: ["patients", "appointments", "preparation"],
    categoryKeys: ["psychiatric_guides"],
    contentPillars: ["evaluation_care_journey", "local_service_navigation"],
    keywords: [
      "patient",
      "patients",
      "expect",
      "appointment",
      "new patient",
      "paciente",
      "cita",
    ],
    summary: "Healing Minds practical information for current and prospective patients.",
    evidenceType: "first_party_patient_page",
    evidenceScope: "First-party patient logistics and preparation.",
    evidenceScore: 100,
    freshnessScore: 100,
  },
  {
    stableKey: "hm-en-contact",
    sourceStableKey: "healing-minds-psychiatry",
    href: "/contact",
    kind: "internal",
    title: "Contact Healing Minds Psychiatry",
    label: "contact Healing Minds Psychiatry",
    language: "en",
    sourceCategory: "first_party_contact",
    topicTags: ["contact", "appointments", "Naples"],
    categoryKeys: ["psychiatric_guides"],
    contentPillars: ["local_service_navigation"],
    keywords: [
      "contact",
      "schedule",
      "appointment",
      "consultation",
      "Naples",
      "contacto",
      "programar",
      "cita",
    ],
    summary: "Healing Minds contact and appointment page.",
    evidenceType: "first_party_contact_page",
    evidenceScope: "First-party contact and appointment navigation.",
    evidenceScore: 100,
    freshnessScore: 100,
  },
  {
    stableKey: "hm-es-services",
    sourceStableKey: "healing-minds-psychiatry",
    href: "/es/servicios",
    kind: "internal",
    title: "Servicios Psiquiatricos",
    label: "servicios psiquiatricos",
    language: "es",
    sourceCategory: "first_party_service_hub",
    topicTags: ["psiquiatria", "tratamiento", "cuidado"],
    categoryKeys: [
      "anxiety",
      "depression",
      "adult_adhd",
      "trauma_ptsd",
      "bipolar",
      "medication",
    ],
    contentPillars: ["condition_education", "evaluation_care_journey", "medication_safety"],
    keywords: [
      "servicio",
      "servicios",
      "tratamiento",
      "cuidado",
      "medicacion",
      "ansiedad",
      "depresion",
      "psiquiatrico",
      "service",
      "treatment",
    ],
    summary: "Resumen en espanol de los servicios psiquiatricos de Healing Minds.",
    evidenceType: "first_party_service_page",
    evidenceScope: "Navegacion de servicios y cuidado de primera parte.",
    evidenceScore: 100,
    freshnessScore: 100,
  },
  {
    stableKey: "hm-es-telepsychiatry",
    sourceStableKey: "healing-minds-psychiatry",
    href: "/es/telepsiquiatria-florida",
    kind: "internal",
    title: "Telepsiquiatria en Florida",
    label: "opciones de telepsiquiatria en Florida",
    language: "es",
    sourceCategory: "first_party_service",
    topicTags: ["telepsiquiatria", "cuidado virtual", "Florida"],
    categoryKeys: ["telepsychiatry"],
    contentPillars: ["access_telepsychiatry", "local_service_navigation"],
    keywords: [
      "telepsiquiatria",
      "online",
      "virtual",
      "remoto",
      "Florida",
      "telepsychiatry",
      "remote",
    ],
    summary: "Informacion de Healing Minds sobre cuidado psiquiatrico virtual en Florida.",
    evidenceType: "first_party_service_page",
    evidenceScope: "Informacion de primera parte sobre acceso por telepsiquiatria.",
    evidenceScore: 100,
    freshnessScore: 100,
  },
  {
    stableKey: "hm-es-for-patients",
    sourceStableKey: "healing-minds-psychiatry",
    href: "/es/para-pacientes",
    kind: "internal",
    title: "Para Pacientes",
    label: "informacion para pacientes",
    language: "es",
    sourceCategory: "first_party_patient_resource",
    topicTags: ["pacientes", "citas", "preparacion"],
    categoryKeys: ["psychiatric_guides"],
    contentPillars: ["evaluation_care_journey", "local_service_navigation"],
    keywords: [
      "paciente",
      "pacientes",
      "esperar",
      "cita",
      "nuevo paciente",
      "patient",
      "appointment",
    ],
    summary: "Informacion practica de Healing Minds para pacientes actuales y nuevos.",
    evidenceType: "first_party_patient_page",
    evidenceScope: "Logistica y preparacion del paciente de primera parte.",
    evidenceScore: 100,
    freshnessScore: 100,
  },
  {
    stableKey: "hm-es-contact",
    sourceStableKey: "healing-minds-psychiatry",
    href: "/es/contacto",
    kind: "internal",
    title: "Contacto Healing Minds Psychiatry",
    label: "contactar a Healing Minds Psychiatry",
    language: "es",
    sourceCategory: "first_party_contact",
    topicTags: ["contacto", "citas", "Naples"],
    categoryKeys: ["psychiatric_guides"],
    contentPillars: ["local_service_navigation"],
    keywords: [
      "contacto",
      "programar",
      "cita",
      "consulta",
      "Naples",
      "contact",
      "appointment",
    ],
    summary: "Pagina de contacto y citas de Healing Minds.",
    evidenceType: "first_party_contact_page",
    evidenceScope: "Navegacion de contacto y citas de primera parte.",
    evidenceScore: 100,
    freshnessScore: 100,
  },
];

const EXTERNAL_LINK_SEEDS: SeededLinkDefinition[] = [
  {
    stableKey: "nimh-anxiety-disorders",
    sourceStableKey: "nimh",
    href: "https://www.nimh.nih.gov/health/topics/anxiety-disorders",
    kind: "external",
    title: "Anxiety Disorders",
    label: "NIMH anxiety disorders overview",
    language: "en",
    sourceCategory: "institutional",
    topicTags: ["anxiety", "panic", "worry", "phobia", "ansiedad", "panico", "preocupacion", "fobia"],
    categoryKeys: ["anxiety"],
    contentPillars: ["condition_education", "evaluation_care_journey"],
    keywords: ["anxiety", "panic", "worry", "phobia", "fear", "gad", "ansiedad", "panico", "preocupacion", "miedo"],
    summary: "NIMH overview of anxiety disorders, signs, symptoms, research and treatment resources.",
    evidenceType: "official_patient_education",
    evidenceScope: "Broad educational claims about anxiety disorders and care.",
    evidenceScore: 95,
    freshnessScore: 90,
  },
  {
    stableKey: "nimh-depression",
    sourceStableKey: "nimh",
    href: "https://www.nimh.nih.gov/health/topics/depression",
    kind: "external",
    title: "Depression",
    label: "NIMH depression overview",
    language: "en",
    sourceCategory: "institutional",
    topicTags: ["depression", "mood", "sadness", "depresion", "estado de animo", "tristeza"],
    categoryKeys: ["depression"],
    contentPillars: ["condition_education", "evaluation_care_journey"],
    keywords: ["depression", "depressed", "mood", "sadness", "depresion", "deprimido", "tristeza", "estado de animo"],
    summary: "NIMH overview of depression, symptoms, types and treatment resources.",
    evidenceType: "official_patient_education",
    evidenceScope: "Broad educational claims about depression and care.",
    evidenceScore: 95,
    freshnessScore: 90,
  },
  {
    stableKey: "nimh-adhd",
    sourceStableKey: "nimh",
    href: "https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd",
    kind: "external",
    title: "Attention-Deficit/Hyperactivity Disorder (ADHD)",
    label: "NIMH ADHD overview",
    language: "en",
    sourceCategory: "institutional",
    topicTags: ["adhd", "attention", "hyperactivity", "tdah", "atencion", "hiperactividad"],
    categoryKeys: ["adult_adhd"],
    contentPillars: ["condition_education", "evaluation_care_journey"],
    keywords: ["adhd", "inattention", "hyperactivity", "impulsivity", "tdah", "inatencion", "hiperactividad", "impulsividad"],
    summary: "NIMH overview of ADHD signs, symptoms, treatment resources and research.",
    evidenceType: "official_patient_education",
    evidenceScope: "Broad educational claims about ADHD and evaluation.",
    evidenceScore: 95,
    freshnessScore: 90,
  },
  {
    stableKey: "nimh-medications",
    sourceStableKey: "nimh",
    href: "https://www.nimh.nih.gov/health/topics/mental-health-medications",
    kind: "external",
    title: "Mental Health Medications",
    label: "NIMH mental health medications overview",
    language: "en",
    sourceCategory: "clinical",
    topicTags: ["medication", "psychiatry", "antidepressants", "stimulants", "medicacion", "psiquiatria", "antidepresivos", "estimulantes"],
    categoryKeys: ["medication"],
    contentPillars: ["medication_safety", "evaluation_care_journey"],
    keywords: ["medication", "medications", "antidepressant", "stimulant", "mood stabilizer", "medicacion", "medicamento", "antidepresivo", "estimulante"],
    summary: "NIMH patient-facing overview of medication classes and questions for clinicians.",
    evidenceType: "official_medication_education",
    evidenceScope: "Broad medication-class education; never patient-specific dosing or treatment instructions.",
    evidenceScore: 95,
    freshnessScore: 90,
  },
  {
    stableKey: "nimh-bipolar-disorder",
    sourceStableKey: "nimh",
    href: "https://www.nimh.nih.gov/health/topics/bipolar-disorder",
    kind: "external",
    title: "Bipolar Disorder",
    label: "NIMH bipolar disorder overview",
    language: "en",
    sourceCategory: "institutional",
    topicTags: ["bipolar disorder", "mania", "mood episodes", "trastorno bipolar", "mania", "episodios del estado de animo"],
    categoryKeys: ["bipolar"],
    contentPillars: ["condition_education", "evaluation_care_journey", "medication_safety"],
    keywords: ["bipolar", "mania", "manic", "mood episode", "trastorno bipolar", "maniaco", "episodio del estado de animo"],
    summary: "NIMH overview of bipolar disorder, symptoms, research and treatment resources.",
    evidenceType: "official_patient_education",
    evidenceScope: "Broad educational claims about bipolar disorder and care.",
    evidenceScore: 95,
    freshnessScore: 90,
  },
  {
    stableKey: "nimh-ptsd",
    sourceStableKey: "nimh",
    href: "https://www.nimh.nih.gov/health/topics/post-traumatic-stress-disorder-ptsd",
    kind: "external",
    title: "Traumatic Events and Post-Traumatic Stress Disorder (PTSD)",
    label: "NIMH PTSD overview",
    language: "en",
    sourceCategory: "institutional",
    topicTags: ["ptsd", "trauma", "post-traumatic stress", "tept", "estres postraumatico"],
    categoryKeys: ["trauma_ptsd"],
    contentPillars: ["condition_education", "evaluation_care_journey"],
    keywords: ["ptsd", "trauma", "traumatic", "post-traumatic", "tept", "traumatico", "postraumatico"],
    summary: "NIMH overview of PTSD, trauma responses, symptoms and treatment resources.",
    evidenceType: "official_patient_education",
    evidenceScope: "Broad educational claims about PTSD, trauma responses and care.",
    evidenceScore: 95,
    freshnessScore: 90,
  },
  {
    stableKey: "nimh-es-anxiety",
    sourceStableKey: "nimh",
    href: "https://www.nimh.nih.gov/health/publications/espanol/trastorno-de-ansiedad-generalizada-cuando-no-se-pueden-controlar-las-preocupaciones-new",
    kind: "external",
    title: "El trastorno de ansiedad generalizada: Lo que debe saber",
    label: "guía de NIMH sobre la ansiedad generalizada",
    language: "es",
    sourceCategory: "institutional",
    topicTags: ["ansiedad", "ansiedad generalizada", "preocupacion", "miedo"],
    categoryKeys: ["anxiety"],
    contentPillars: ["condition_education", "evaluation_care_journey"],
    keywords: ["ansiedad", "ansiedad generalizada", "preocupacion", "miedo", "tratamiento"],
    summary: "Información oficial de NIMH en español sobre la ansiedad generalizada, sus síntomas y opciones de atención.",
    evidenceType: "official_patient_education",
    evidenceScope: "Educación general en español sobre ansiedad generalizada y atención.",
    evidenceScore: 95,
    freshnessScore: 90,
  },
  {
    stableKey: "nimh-es-depression",
    sourceStableKey: "nimh",
    href: "https://www.nimh.nih.gov/health/publications/espanol/depresion-sp",
    kind: "external",
    title: "Depresión",
    label: "guía de NIMH sobre la depresión",
    language: "es",
    sourceCategory: "institutional",
    topicTags: ["depresion", "estado de animo", "tristeza"],
    categoryKeys: ["depression"],
    contentPillars: ["condition_education", "evaluation_care_journey"],
    keywords: ["depresion", "depresivo", "tristeza", "estado de animo", "tratamiento"],
    summary: "Información oficial de NIMH en español sobre la depresión, sus síntomas y opciones de atención.",
    evidenceType: "official_patient_education",
    evidenceScope: "Educación general en español sobre depresión y atención.",
    evidenceScore: 95,
    freshnessScore: 90,
  },
  {
    stableKey: "nimh-es-adhd",
    sourceStableKey: "nimh",
    href: "https://www.nimh.nih.gov/health/publications/espanol/trastorno-de-deficit-de-atencion-con-hiperactividad-lo-que-usted-necesita-saber",
    kind: "external",
    title: "Trastorno de déficit de atención con hiperactividad",
    label: "guía de NIMH sobre el TDAH",
    language: "es",
    sourceCategory: "institutional",
    topicTags: ["tdah", "deficit de atencion", "hiperactividad", "impulsividad"],
    categoryKeys: ["adult_adhd"],
    contentPillars: ["condition_education", "evaluation_care_journey"],
    keywords: ["tdah", "inatencion", "deficit de atencion", "hiperactividad", "impulsividad"],
    summary: "Información oficial de NIMH en español sobre el TDAH, evaluación y tratamiento.",
    evidenceType: "official_patient_education",
    evidenceScope: "Educación general en español sobre TDAH y evaluación.",
    evidenceScore: 95,
    freshnessScore: 90,
  },
  {
    stableKey: "nimh-es-bipolar-disorder",
    sourceStableKey: "nimh",
    href: "https://www.nimh.nih.gov/health/publications/espanol/trastorno-bipolar",
    kind: "external",
    title: "Trastorno bipolar",
    label: "guía de NIMH sobre el trastorno bipolar",
    language: "es",
    sourceCategory: "institutional",
    topicTags: ["trastorno bipolar", "mania", "episodios del estado de animo"],
    categoryKeys: ["bipolar"],
    contentPillars: ["condition_education", "evaluation_care_journey", "medication_safety"],
    keywords: ["trastorno bipolar", "bipolar", "mania", "maniaco", "estado de animo"],
    summary: "Información oficial de NIMH en español sobre el trastorno bipolar, sus síntomas y tratamiento.",
    evidenceType: "official_patient_education",
    evidenceScope: "Educación general en español sobre trastorno bipolar y atención.",
    evidenceScore: 95,
    freshnessScore: 90,
  },
  {
    stableKey: "nimh-es-ptsd",
    sourceStableKey: "nimh",
    href: "https://www.nimh.nih.gov/health/publications/espanol/trastorno-por-estres-postraumatico",
    kind: "external",
    title: "Trastorno por estrés postraumático",
    label: "guía de NIMH sobre el estrés postraumático",
    language: "es",
    sourceCategory: "institutional",
    topicTags: ["tept", "trauma", "estres postraumatico"],
    categoryKeys: ["trauma_ptsd"],
    contentPillars: ["condition_education", "evaluation_care_journey"],
    keywords: ["tept", "trauma", "traumatico", "estres postraumatico", "tratamiento"],
    summary: "Información oficial de NIMH en español sobre el TEPT, síntomas y opciones de atención.",
    evidenceType: "official_patient_education",
    evidenceScope: "Educación general en español sobre TEPT, trauma y atención.",
    evidenceScore: 95,
    freshnessScore: 90,
  },
  {
    stableKey: "988-lifeline",
    sourceStableKey: "988-lifeline-publisher",
    href: "https://988lifeline.org/",
    kind: "external",
    title: "988 Suicide & Crisis Lifeline",
    label: "988 Suicide & Crisis Lifeline",
    language: "en",
    sourceCategory: "crisis",
    topicTags: ["crisis", "suicide", "emergency", "988", "safety", "crisis", "suicidio", "emergencia", "seguridad"],
    categoryKeys: ["psychiatric_guides"],
    contentPillars: ["crisis_safety"],
    keywords: ["crisis", "suicide", "suicidal", "emergency", "988", "self-harm", "suicidio", "suicida", "emergencia", "autolesion"],
    summary: "Official 988 resource for suicidal crisis, emotional distress or urgent mental-health need.",
    evidenceType: "official_crisis_resource",
    evidenceScope: "Operational crisis contact information only; not a generic medical citation.",
    evidenceScore: 100,
    freshnessScore: 100,
  },
  {
    stableKey: "988-lifeline-es",
    sourceStableKey: "988-lifeline-publisher",
    href: "https://988lifeline.org/es/inicio/",
    kind: "external",
    title: "Línea 988 de Prevención del Suicidio y Crisis",
    label: "Línea 988 en español",
    language: "es",
    sourceCategory: "crisis",
    topicTags: ["crisis", "suicidio", "emergencia", "988", "seguridad"],
    categoryKeys: ["psychiatric_guides"],
    contentPillars: ["crisis_safety"],
    keywords: ["crisis", "suicidio", "suicida", "emergencia", "988", "autolesion", "peligro inmediato"],
    summary: "Recurso oficial en español de la Línea 988 para crisis suicida, angustia emocional o necesidad urgente de salud mental.",
    evidenceType: "official_crisis_resource",
    evidenceScope: "Información operativa de contacto para crisis en español; no es una cita médica genérica.",
    evidenceScore: 100,
    freshnessScore: 100,
  },
];

function toInsertLink(
  definition: SeededLinkDefinition,
  sourceId: number,
  publicSiteUrl: string,
): Omit<InsertBlogLink, "canonicalKey"> {
  const normalized = normalizeBlogLinkHref(definition.href, { publicSiteUrl });
  if (normalized.kind !== definition.kind) {
    throw new Error(`Seed ${definition.stableKey} normalized to unexpected link kind`);
  }

  return {
    stableKey: definition.stableKey,
    sourceId,
    kind: definition.kind,
    normalizedHref: normalized.normalizedHref,
    displayHref: normalized.displayHref,
    host: normalized.host,
    title: definition.title,
    label: definition.label,
    language: definition.language,
    sourceCategory: definition.sourceCategory,
    topicTags: definition.topicTags,
    categoryKeys: definition.categoryKeys,
    contentPillars: definition.contentPillars,
    keywords: definition.keywords,
    summary: definition.summary,
    evidenceType: definition.evidenceType,
    evidenceScope: definition.evidenceScope,
    evidenceScore: definition.evidenceScore,
    freshnessScore: definition.freshnessScore,
    reviewStatus: "approved",
    reviewedBy: "Healing Minds editorial seed",
    reviewedAt: SEEDED_REVIEW_AT,
    reviewNotes: "Approved exact URL carried forward from the pre-Sprint 19 allowlist.",
    generationEligible: false,
    healthStatus: "unchecked",
    redirectCount: 0,
    consecutiveFailures: 0,
    scoreBreakdown: {
      evidenceQuality: definition.evidenceScore,
      freshness: definition.freshnessScore,
    },
    scoreVersion: BLOG_LINK_SCORE_VERSION,
    origin: "seed",
    targetPostId: null,
  };
}

async function seedPublishedBlogTargets(
  publicSiteUrl: string,
): Promise<{ created: number; existing: number }> {
  const rows = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      language: blogPosts.language,
    })
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"));

  let created = 0;
  let existing = 0;
  for (const post of rows) {
    const language = post.language === "es" ? "es" : "en";
    const href = language === "es" ? `/es/blog/${post.slug}` : `/blog/${post.slug}`;
    const normalized = normalizeBlogLinkHref(href, { publicSiteUrl });
    const priorExactTarget = await getBlogLinkByCanonicalHref(normalized.normalizedHref);
    await syncManagedBlogPostTarget(post.id);
    if (priorExactTarget) existing += 1;
    else created += 1;
  }
  return { created, existing };
}

export async function seedBlogLinkLibrary(
  options: SeedBlogLinkLibraryOptions = {},
): Promise<{
  sources: { created: number; existing: number };
  fixedLinks: { created: number; existing: number };
  publishedPostLinks: { created: number; existing: number };
}> {
  const logger = options.logger || console;
  const publicSiteUrl = getSeoSiteConfig().siteBaseUrl;
  const sourceIds = new Map<string, number>();
  const sourceCounts = { created: 0, existing: 0 };
  for (const sourceSeed of SOURCE_SEEDS) {
    const result = await insertBlogLinkSourceIfMissing(sourceSeed);
    sourceIds.set(sourceSeed.stableKey, result.source.id);
    if (result.created) sourceCounts.created += 1;
    else sourceCounts.existing += 1;
  }

  const fixedCounts = { created: 0, existing: 0 };
  for (const linkSeed of [...INTERNAL_LINK_SEEDS, ...EXTERNAL_LINK_SEEDS]) {
    const sourceId = sourceIds.get(linkSeed.sourceStableKey);
    if (!sourceId) throw new Error(`Seed source ${linkSeed.sourceStableKey} was not resolved`);
    const result = await insertBlogLinkIfMissing(toInsertLink(linkSeed, sourceId, publicSiteUrl));
    if (result.created) fixedCounts.created += 1;
    else fixedCounts.existing += 1;
  }

  if (!sourceIds.get("healing-minds-psychiatry")) {
    throw new Error("First-party link source was not resolved");
  }
  const publishedPostLinks = options.includePublishedPosts === false
    ? { created: 0, existing: 0 }
    : await seedPublishedBlogTargets(publicSiteUrl);

  logger.log(
    `Blog link seed ready: ${sourceCounts.created} source(s) and ${fixedCounts.created + publishedPostLinks.created} link(s) created; `
    + `${sourceCounts.existing} source(s) and ${fixedCounts.existing + publishedPostLinks.existing} link(s) already existed.`,
  );

  return {
    sources: sourceCounts,
    fixedLinks: fixedCounts,
    publishedPostLinks,
  };
}

export const SEEDED_BLOG_LINK_STABLE_KEYS = Object.freeze([
  ...INTERNAL_LINK_SEEDS.map(link => link.stableKey),
  ...EXTERNAL_LINK_SEEDS.map(link => link.stableKey),
]);
