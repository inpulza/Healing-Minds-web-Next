import type { BlogAiGenerateInput, BlogEditorialBrief } from "./types";

const EN_CORE_SECTIONS = [
  "What patients can expect",
  "When psychiatric care may help",
  "Medication management considerations",
  "Questions to discuss with a clinician",
  "Care options in Naples and Florida",
  "Sources",
];

const ES_CORE_SECTIONS = [
  "Que pueden esperar los pacientes",
  "Cuando puede ayudar la atencion psiquiatrica",
  "Consideraciones sobre manejo de medicamentos",
  "Preguntas para conversar con un clinico",
  "Opciones de cuidado en Naples y Florida",
  "Fuentes",
];

const CONDITION_SECTIONS: Record<string, { en: string; es: string }> = {
  anxiety: {
    en: "How anxiety symptoms can affect daily life",
    es: "Como los sintomas de ansiedad pueden afectar la vida diaria",
  },
  depression: {
    en: "How depression can show up over time",
    es: "Como la depresion puede presentarse con el tiempo",
  },
  adhd: {
    en: "How attention symptoms can affect work, school, and routines",
    es: "Como los sintomas de atencion pueden afectar el trabajo, la escuela y las rutinas",
  },
  ptsd: {
    en: "How trauma symptoms can affect safety, sleep, and relationships",
    es: "Como los sintomas de trauma pueden afectar seguridad, sueno y relaciones",
  },
  bipolar: {
    en: "Why mood history matters before treatment decisions",
    es: "Por que el historial del estado de animo importa antes de decidir tratamiento",
  },
  medication: {
    en: "How medication follow-up is usually monitored",
    es: "Como suele monitorearse el seguimiento de medicamentos",
  },
};

const CONDITION_ALIASES: Record<string, string[]> = {
  anxiety: ["anxiety", "ansiedad"],
  depression: ["depression", "depresion", "depresión"],
  adhd: ["adhd", "tdah", "attention", "atencion", "atención"],
  ptsd: ["ptsd", "tept", "trauma", "post traumatic", "postraumatico", "postraumático"],
  bipolar: ["bipolar", "mania", "maniaco", "maníaco"],
  medication: ["medication", "medications", "medicacion", "medicación", "medicamento", "medicamentos"],
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function uniqueOrdered(values: string[]): string[] {
  return Array.from(new Set(values.map(value => value.trim()).filter(Boolean)));
}

function selectConditionSections(input: BlogAiGenerateInput): string[] {
  const haystack = normalize([
    input.topic,
    input.targetKeyword,
    input.additionalContext,
    input.categoryName,
    ...(input.tagNames || []),
  ].filter(Boolean).join(" "));

  return Object.entries(CONDITION_SECTIONS)
    .filter(([keyword]) => (CONDITION_ALIASES[keyword] || [keyword]).some(alias => haystack.includes(normalize(alias))))
    .map(([, section]) => input.language === "es" ? section.es : section.en);
}

function buildSearchIntent(input: BlogAiGenerateInput): string {
  if (input.language === "es") {
    return "Educativo y local: explicar opciones de atencion psiquiatrica sin diagnosticar ni prometer resultados.";
  }

  return "Educational and local: explain psychiatric care options without diagnosing or promising outcomes.";
}

function buildAudience(input: BlogAiGenerateInput): string {
  if (input.language === "es") {
    return "Pacientes adultos y familias en Naples o Florida que estan considerando atencion psiquiatrica.";
  }

  return "Adult patients and families in Naples or Florida who are considering psychiatric care.";
}

function targetWordCount(input: BlogAiGenerateInput): number {
  if (input.semanticMemory?.recommendation === "update_existing") return 950;
  if (input.semanticMemory?.recommendation === "change_angle") return 1100;
  return 1250;
}

export function buildBlogEditorialBrief(input: BlogAiGenerateInput): BlogEditorialBrief {
  const coreSections = input.language === "es" ? ES_CORE_SECTIONS : EN_CORE_SECTIONS;
  const sections = uniqueOrdered([
    ...selectConditionSections(input),
    ...coreSections,
  ]).slice(0, 7);
  const target = targetWordCount(input);
  const sourceCount = input.researchSources?.length || 0;
  const riskNotes: string[] = [];

  if (sourceCount === 0) {
    riskNotes.push("No trusted sources matched; draft should use conservative broad language.");
  }
  if (input.semanticMemory?.recommendation === "change_angle") {
    riskNotes.push("Similar content exists; use a materially different angle and structure.");
  }
  if (input.semanticMemory?.recommendation === "update_existing") {
    riskNotes.push("A close existing article exists; editor should consider updating the older post instead of publishing a new one.");
  }

  return {
    targetWordCount: target,
    minimumWordCount: Math.max(800, Math.round(target * 0.72)),
    maximumWordCount: Math.round(target * 1.25),
    searchIntent: buildSearchIntent(input),
    audience: buildAudience(input),
    requiredSections: sections,
    requiredInternalLinks: (input.internalLinks || []).slice(0, 3),
    sourceRequirement: sourceCount > 0 ? "Use 1 to 3 trusted sources from the provided list." : "Do not invent sources.",
    riskNotes,
  };
}

export function formatEditorialBriefForPrompt(brief: BlogEditorialBrief | undefined): string {
  if (!brief) return "- No editorial brief provided.";

  return [
    `- Target word count: ${brief.targetWordCount} words. Minimum acceptable depth: ${brief.minimumWordCount}. Maximum: ${brief.maximumWordCount}.`,
    `- Search intent: ${brief.searchIntent}`,
    `- Audience: ${brief.audience}`,
    `- Required sections: ${brief.requiredSections.join("; ")}`,
    `- Internal link targets: ${brief.requiredInternalLinks.length > 0 ? brief.requiredInternalLinks.join(", ") : "Use the allowed internal links if relevant."}`,
    `- Source requirement: ${brief.sourceRequirement}`,
    ...brief.riskNotes.map(note => `- Editorial risk: ${note}`),
  ].join("\n");
}
