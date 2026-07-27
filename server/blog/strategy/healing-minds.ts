import type { BlogLanguage } from "../storage";

export const HEALING_MINDS_TOPIC_STRATEGY_VERSION = "healing-minds-topic-strategy-v1";
export const HEALING_MINDS_TOPIC_PROMPT_VERSION = "healing-minds-topic-prompt-v1";

export const BLOG_CONTENT_PILLARS = [
  "condition_education",
  "evaluation_care_journey",
  "medication_safety",
  "access_telepsychiatry",
  "daily_function",
  "local_service_navigation",
  "family_support",
] as const;

export const BLOG_PATIENT_STAGES = [
  "recognition",
  "evaluation",
  "treatment_consideration",
  "ongoing_care",
] as const;

export const BLOG_CONTENT_FORMATS = [
  "explainer",
  "what_to_expect",
  "questions_to_ask",
  "comparison",
  "checklist",
  "local_guide",
  "follow_up_guide",
] as const;

export const BLOG_SEARCH_INTENTS = [
  "informational",
  "care_navigation",
  "treatment_consideration",
  "local_service",
] as const;

export const HEALING_MINDS_CATEGORY_KEYS = [
  "anxiety",
  "depression",
  "adult_adhd",
  "trauma_ptsd",
  "bipolar",
  "medication",
  "telepsychiatry",
  "psychiatric_guides",
] as const;

export const BLOG_TOPIC_THRESHOLDS = {
  meaningfulOverlap: 0.3,
  hardDuplicateOverlap: 0.55,
  judgeFallbackMaximumOverlap: 0.2,
  saturationMinimumPosts: 3,
  semanticHardDuplicateConfidenceBasisPoints: 7500,
} as const;

export type BlogContentPillar = typeof BLOG_CONTENT_PILLARS[number];
export type BlogPatientStage = typeof BLOG_PATIENT_STAGES[number];
export type BlogContentFormat = typeof BLOG_CONTENT_FORMATS[number];
export type BlogSearchIntent = typeof BLOG_SEARCH_INTENTS[number];

export const BLOG_PILLAR_WEIGHTS: Record<BlogContentPillar, number> = {
  condition_education: 22,
  evaluation_care_journey: 20,
  medication_safety: 18,
  access_telepsychiatry: 15,
  daily_function: 10,
  local_service_navigation: 8,
  family_support: 7,
};

export type HealingMindsCategoryKey = typeof HEALING_MINDS_CATEGORY_KEYS[number];

export type HealingMindsCategory = {
  key: HealingMindsCategoryKey;
  language: BlogLanguage;
  name: string;
  slug: string;
  description: string;
  aliases: string[];
  defaultPillars: BlogContentPillar[];
  tag: { name: string; slug: string };
};

const CATEGORY_BASE: Array<{
  key: HealingMindsCategoryKey;
  defaultPillars: BlogContentPillar[];
  en: Omit<HealingMindsCategory, "key" | "language" | "defaultPillars">;
  es: Omit<HealingMindsCategory, "key" | "language" | "defaultPillars">;
}> = [
  {
    key: "anxiety",
    defaultPillars: ["condition_education", "evaluation_care_journey", "daily_function"],
    en: {
      name: "Anxiety Treatment",
      slug: "anxiety-treatment",
      description: "Education about anxiety, psychiatric evaluation, daily function, and treatment conversations.",
      aliases: ["anxiety", "panic", "worry", "stress"],
      tag: { name: "Anxiety", slug: "anxiety" },
    },
    es: {
      name: "Ansiedad",
      slug: "ansiedad",
      description: "Educacion sobre ansiedad, evaluacion psiquiatrica, funcion diaria y conversaciones de tratamiento.",
      aliases: ["ansiedad", "panico", "preocupacion", "estres"],
      tag: { name: "Ansiedad", slug: "ansiedad" },
    },
  },
  {
    key: "depression",
    defaultPillars: ["condition_education", "evaluation_care_journey", "daily_function"],
    en: {
      name: "Depression Treatment",
      slug: "depression-treatment",
      description: "Patient education about depression symptoms, evaluation, function, and ongoing psychiatric care.",
      aliases: ["depression", "depressed", "mood", "sadness"],
      tag: { name: "Depression", slug: "depression" },
    },
    es: {
      name: "Depresion",
      slug: "depresion",
      description: "Educacion para pacientes sobre depresion, evaluacion, funcion y cuidado psiquiatrico continuo.",
      aliases: ["depresion", "animo", "tristeza"],
      tag: { name: "Depresion", slug: "depresion" },
    },
  },
  {
    key: "adult_adhd",
    defaultPillars: ["condition_education", "evaluation_care_journey", "daily_function"],
    en: {
      name: "Adult ADHD",
      slug: "adult-adhd",
      description: "Education about adult ADHD symptoms, evaluation, function, and careful follow-up.",
      aliases: ["adhd", "attention", "focus", "executive function"],
      tag: { name: "Adult ADHD", slug: "adult-adhd" },
    },
    es: {
      name: "TDAH en Adultos",
      slug: "tdah-adultos",
      description: "Educacion sobre TDAH en adultos, evaluacion, funcion y seguimiento cuidadoso.",
      aliases: ["tdah", "atencion", "concentracion", "funcion ejecutiva"],
      tag: { name: "TDAH en Adultos", slug: "tdah-adultos" },
    },
  },
  {
    key: "trauma_ptsd",
    defaultPillars: ["condition_education", "evaluation_care_journey", "family_support"],
    en: {
      name: "PTSD and Trauma",
      slug: "ptsd-trauma",
      description: "Careful education about trauma-related symptoms, evaluation, support, and crisis boundaries.",
      aliases: ["ptsd", "trauma", "post traumatic", "sleep"],
      tag: { name: "PTSD and Trauma", slug: "ptsd-trauma" },
    },
    es: {
      name: "TEPT y Trauma",
      slug: "tept-trauma",
      description: "Educacion cuidadosa sobre trauma, evaluacion, apoyo y limites para situaciones de crisis.",
      aliases: ["tept", "trauma", "postraumatico", "sueno"],
      tag: { name: "TEPT y Trauma", slug: "tept-trauma" },
    },
  },
  {
    key: "bipolar",
    defaultPillars: ["condition_education", "medication_safety", "evaluation_care_journey"],
    en: {
      name: "Bipolar Care",
      slug: "bipolar-care",
      description: "Education about bipolar symptoms, medication safety, monitoring, and psychiatric follow-up.",
      aliases: ["bipolar", "mania", "mood stability", "mood"],
      tag: { name: "Bipolar Care", slug: "bipolar-care" },
    },
    es: {
      name: "Trastorno Bipolar",
      slug: "trastorno-bipolar",
      description: "Educacion sobre sintomas bipolares, seguridad de medicamentos, monitoreo y seguimiento.",
      aliases: ["bipolar", "mania", "estabilidad del animo", "animo"],
      tag: { name: "Trastorno Bipolar", slug: "trastorno-bipolar" },
    },
  },
  {
    key: "medication",
    defaultPillars: ["medication_safety", "evaluation_care_journey"],
    en: {
      name: "Medication Management",
      slug: "medication-management",
      description: "Conservative education about psychiatric medication decisions, safety, and follow-up.",
      aliases: ["medication", "medications", "side effects", "follow up"],
      tag: { name: "Medication Management", slug: "medication-management" },
    },
    es: {
      name: "Manejo de Medicamentos",
      slug: "manejo-medicamentos",
      description: "Educacion conservadora sobre decisiones, seguridad y seguimiento de medicamentos psiquiatricos.",
      aliases: ["medicamento", "medicamentos", "efectos secundarios", "seguimiento"],
      tag: { name: "Manejo de Medicamentos", slug: "manejo-medicamentos" },
    },
  },
  {
    key: "telepsychiatry",
    defaultPillars: ["access_telepsychiatry", "local_service_navigation"],
    en: {
      name: "Telepsychiatry",
      slug: "telepsychiatry",
      description: "Patient guidance about virtual psychiatric care, access, privacy, and appropriate escalation.",
      aliases: ["telepsychiatry", "virtual", "online", "florida"],
      tag: { name: "Telepsychiatry", slug: "telepsychiatry" },
    },
    es: {
      name: "Telepsiquiatria",
      slug: "telepsiquiatria",
      description: "Guia para pacientes sobre cuidado psiquiatrico virtual, acceso, privacidad y escalamiento.",
      aliases: ["telepsiquiatria", "virtual", "en linea", "florida"],
      tag: { name: "Telepsiquiatria", slug: "telepsiquiatria" },
    },
  },
  {
    key: "psychiatric_guides",
    defaultPillars: ["evaluation_care_journey", "local_service_navigation", "family_support"],
    en: {
      name: "Psychiatric Care Guides",
      slug: "psychiatric-care-guides",
      description: "Practical guides for appointments, questions, family support, and navigating psychiatric care.",
      aliases: ["psychiatric care", "appointment", "questions", "family", "guide"],
      tag: { name: "Psychiatric Care Guides", slug: "psychiatric-care-guides" },
    },
    es: {
      name: "Guias de Atencion Psiquiatrica",
      slug: "guias-atencion-psiquiatrica",
      description: "Guias practicas para citas, preguntas, apoyo familiar y navegacion del cuidado psiquiatrico.",
      aliases: ["atencion psiquiatrica", "cita", "preguntas", "familia", "guia"],
      tag: { name: "Guias de Atencion Psiquiatrica", slug: "guias-atencion-psiquiatrica" },
    },
  },
];

export const HEALING_MINDS_CATEGORIES: HealingMindsCategory[] = CATEGORY_BASE.flatMap(item => ([
  { key: item.key, language: "en", defaultPillars: item.defaultPillars, ...item.en },
  { key: item.key, language: "es", defaultPillars: item.defaultPillars, ...item.es },
]));

export function getHealingMindsCategories(language?: BlogLanguage): HealingMindsCategory[] {
  return HEALING_MINDS_CATEGORIES.filter(category => !language || category.language === language);
}

export function getHealingMindsCategory(
  key: HealingMindsCategoryKey,
  language: BlogLanguage,
): HealingMindsCategory {
  const category = HEALING_MINDS_CATEGORIES.find(item => item.key === key && item.language === language);
  if (!category) throw new Error(`Unknown Healing Minds category ${language}/${key}`);
  return category;
}

export function inferHealingMindsCategoryKey(value: string): HealingMindsCategoryKey {
  const normalized = value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const match = HEALING_MINDS_CATEGORIES
    .map(category => ({
      key: category.key,
      score: [category.name, category.slug, ...category.aliases]
        .reduce((score, alias) => score + (normalized.includes(alias.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) ? 1 : 0), 0),
    }))
    .sort((a, b) => b.score - a.score)[0];
  return match?.score ? match.key : "psychiatric_guides";
}
