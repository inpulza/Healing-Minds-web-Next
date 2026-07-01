import type { BlogCategory, BlogTag } from "@shared/schema";
import { buildBlogEditorialBrief } from "./editorial-brief";
import { buildBlogSemanticMemory } from "./memory";
import { selectBlogResearchSources } from "./research";
import { selectBlogInternalLinks } from "../internal-links";
import type { BlogLanguage } from "../storage";
import { selectBlogTagIds } from "../taxonomy";

type TopicTemplate = {
  topic: string;
  targetKeyword: string;
  angle: string;
  keywords: string[];
};

type TopicPlannerInput = {
  language: BlogLanguage;
  categories: BlogCategory[];
  tags: BlogTag[];
  categoryId?: number;
  focus?: string;
  limit?: number;
};

export type BlogTopicPlanCandidate = {
  id: string;
  topic: string;
  targetKeyword: string;
  language: BlogLanguage;
  categoryId: number;
  categoryName: string;
  tagIds: number[];
  tagNames: string[];
  internalLinks: string[];
  score: number;
  noveltyScore: number;
  overlapScore: number;
  recommendation: "recommended" | "change_angle" | "update_existing";
  angle: string;
  rationale: string;
  riskNotes: string[];
  research: ReturnType<typeof selectBlogResearchSources>;
  semanticMemory: Awaited<ReturnType<typeof buildBlogSemanticMemory>>;
  editorialBrief: ReturnType<typeof buildBlogEditorialBrief>;
};

export type BlogTopicPlan = {
  language: BlogLanguage;
  generatedAt: string;
  candidates: BlogTopicPlanCandidate[];
  summary: {
    considered: number;
    returned: number;
    recommended: number;
    changeAngle: number;
    updateExisting: number;
  };
};

const TOPIC_TEMPLATES: Record<BlogLanguage, TopicTemplate[]> = {
  en: [
    {
      topic: "Anxiety treatment options in Naples",
      targetKeyword: "anxiety treatment Naples",
      angle: "Explain what patients can expect from psychiatric anxiety care without promising outcomes.",
      keywords: ["anxiety", "panic", "worry", "stress"],
    },
    {
      topic: "When anxiety medication management may help",
      targetKeyword: "anxiety medication management",
      angle: "Focus on evaluation, follow-up, questions for the clinician, and safety monitoring.",
      keywords: ["anxiety", "medication", "management"],
    },
    {
      topic: "Depression treatment and psychiatric care in Naples",
      targetKeyword: "depression treatment Naples",
      angle: "Describe signs that may lead adults to seek psychiatric support and how care is reviewed.",
      keywords: ["depression", "mood", "sadness"],
    },
    {
      topic: "ADHD evaluation and medication management for adults",
      targetKeyword: "adult ADHD medication management",
      angle: "Cover adult attention symptoms, evaluation expectations, and conservative medication follow-up.",
      keywords: ["adhd", "attention", "focus"],
    },
    {
      topic: "PTSD and trauma-related symptoms: when to seek psychiatric care",
      targetKeyword: "PTSD psychiatric care",
      angle: "Use careful educational language about trauma symptoms and crisis safety resources.",
      keywords: ["ptsd", "trauma", "sleep"],
    },
    {
      topic: "Bipolar disorder medication follow-up and mood stability",
      targetKeyword: "bipolar medication management",
      angle: "Explain why mood history, monitoring, and follow-up matter before treatment decisions.",
      keywords: ["bipolar", "mood", "mania"],
    },
    {
      topic: "What to ask before starting mental health medication",
      targetKeyword: "mental health medication questions",
      angle: "Give patients a practical list of questions to discuss with a clinician.",
      keywords: ["medication", "psychiatry", "management"],
    },
    {
      topic: "Telepsychiatry in Florida: what patients should know",
      targetKeyword: "telepsychiatry Florida",
      angle: "Explain virtual psychiatric care expectations and when in-person or emergency care may be needed.",
      keywords: ["telepsychiatry", "florida", "virtual"],
    },
  ],
  es: [
    {
      topic: "Opciones de tratamiento para la ansiedad en Naples",
      targetKeyword: "tratamiento ansiedad Naples",
      angle: "Explicar que puede esperar un paciente de la atencion psiquiatrica para ansiedad sin prometer resultados.",
      keywords: ["ansiedad", "panico", "preocupacion", "estres"],
    },
    {
      topic: "Cuando puede ayudar el manejo de medicamentos para la ansiedad",
      targetKeyword: "manejo medicamentos ansiedad",
      angle: "Enfocar evaluacion, seguimiento, preguntas para el clinico y monitoreo de seguridad.",
      keywords: ["ansiedad", "medicamentos", "manejo"],
    },
    {
      topic: "Tratamiento para depresion y cuidado psiquiatrico en Naples",
      targetKeyword: "tratamiento depresion Naples",
      angle: "Describir senales generales para buscar apoyo psiquiatrico y como se revisa el cuidado.",
      keywords: ["depresion", "animo", "tristeza"],
    },
    {
      topic: "Evaluacion de TDAH y manejo de medicamentos en adultos",
      targetKeyword: "manejo medicamentos TDAH adultos",
      angle: "Cubrir sintomas de atencion en adultos, expectativas de evaluacion y seguimiento conservador.",
      keywords: ["tdah", "atencion", "concentracion"],
    },
    {
      topic: "TEPT y sintomas relacionados con trauma: cuando buscar cuidado psiquiatrico",
      targetKeyword: "cuidado psiquiatrico TEPT",
      angle: "Usar lenguaje educativo cuidadoso sobre trauma y recursos de seguridad en crisis.",
      keywords: ["tept", "trauma", "sueno"],
    },
    {
      topic: "Seguimiento de medicamentos para trastorno bipolar y estabilidad del animo",
      targetKeyword: "manejo medicamentos bipolar",
      angle: "Explicar por que el historial del animo y el seguimiento importan antes de decidir tratamiento.",
      keywords: ["bipolar", "animo", "mania"],
    },
    {
      topic: "Que preguntar antes de empezar medicamentos de salud mental",
      targetKeyword: "preguntas medicamentos salud mental",
      angle: "Dar una lista practica de preguntas para conversar con un clinico.",
      keywords: ["medicamentos", "psiquiatria", "manejo"],
    },
    {
      topic: "Telepsiquiatria en Florida: que deben saber los pacientes",
      targetKeyword: "telepsiquiatria Florida",
      angle: "Explicar expectativas de cuidado virtual y cuando puede hacer falta cuidado presencial o urgente.",
      keywords: ["telepsiquiatria", "florida", "virtual"],
    },
  ],
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function stableCandidateId(topic: string, language: BlogLanguage): string {
  return `${language}-${normalize(topic).replace(/\s+/g, "-").slice(0, 80)}`;
}

function rankTemplate(template: TopicTemplate, focusText: string): number {
  if (!focusText) return 1;
  const normalizedFocus = normalize(focusText);
  const directHit = normalizedFocus.includes(normalize(template.topic)) ? 6 : 0;
  const keywordHits = template.keywords.reduce((total, keyword) => (
    normalizedFocus.includes(normalize(keyword)) ? total + 2 : total
  ), 0);
  return directHit + keywordHits;
}

function pickCategory(
  template: TopicTemplate,
  categories: BlogCategory[],
  forcedCategoryId: number | undefined,
): BlogCategory | undefined {
  if (forcedCategoryId) return categories.find(category => category.id === forcedCategoryId);
  const normalizedTopic = normalize(`${template.topic} ${template.targetKeyword} ${template.keywords.join(" ")}`);
  return categories.find(category => normalizedTopic.includes(normalize(category.name)))
    || categories[0];
}

function recommendationFromSemanticMemory(
  recommendation: BlogTopicPlanCandidate["semanticMemory"]["recommendation"],
): BlogTopicPlanCandidate["recommendation"] {
  if (recommendation === "update_existing") return "update_existing";
  if (recommendation === "change_angle") return "change_angle";
  return "recommended";
}

function scoreCandidate(input: {
  noveltyScore: number;
  tagCount: number;
  sourceConfidence: "low" | "medium" | "high";
  recommendation: BlogTopicPlanCandidate["recommendation"];
  templateRank: number;
}): number {
  const confidenceBonus = input.sourceConfidence === "high" ? 10 : input.sourceConfidence === "medium" ? 5 : 0;
  const recommendationPenalty = input.recommendation === "update_existing" ? 45 : input.recommendation === "change_angle" ? 18 : 0;
  return clampScore(input.noveltyScore + confidenceBonus + (input.tagCount * 3) + Math.min(input.templateRank, 8) - recommendationPenalty);
}

export async function buildBlogTopicPlan(input: TopicPlannerInput): Promise<BlogTopicPlan> {
  const languageCategories = input.categories.filter(category => category.language === input.language);
  const languageTags = input.tags.filter(tag => tag.language === input.language);
  if (languageCategories.length === 0) {
    throw Object.assign(new Error("No blog categories exist for the selected language"), { statusCode: 400 });
  }

  const limit = Math.max(1, Math.min(input.limit || 5, 8));
  const focusText = [input.focus, languageCategories.map(category => category.name).join(" "), languageTags.map(tag => tag.name).join(" ")].filter(Boolean).join(" ");
  const rankedTemplates = TOPIC_TEMPLATES[input.language]
    .map(template => ({ template, rank: rankTemplate(template, focusText) }))
    .sort((a, b) => b.rank - a.rank || a.template.topic.localeCompare(b.template.topic))
    .slice(0, Math.max(limit + 4, 8));

  const candidates: BlogTopicPlanCandidate[] = [];

  for (const { template, rank } of rankedTemplates) {
    const category = pickCategory(template, languageCategories, input.categoryId);
    if (!category) continue;

    const tagIds = selectBlogTagIds({
      language: input.language,
      availableTags: languageTags,
      topic: template.topic,
      targetKeyword: template.targetKeyword,
      excerpt: template.angle,
      categoryName: category.name,
    });
    const tagNames = languageTags.filter(tag => tagIds.includes(tag.id)).map(tag => tag.name);
    const internalLinks = selectBlogInternalLinks({
      language: input.language,
      topic: template.topic,
      targetKeyword: template.targetKeyword,
      categoryName: category.name,
    });
    const research = selectBlogResearchSources({
      topic: template.topic,
      additionalContext: template.angle,
      targetKeyword: template.targetKeyword,
      language: input.language,
      categoryName: category.name,
      tagNames,
      internalLinks,
    });
    const semanticMemory = await buildBlogSemanticMemory({
      topic: template.topic,
      targetKeyword: template.targetKeyword,
      language: input.language,
      categoryName: category.name,
      tagNames,
    });
    const recommendation = recommendationFromSemanticMemory(semanticMemory.recommendation);
    const overlapScore = semanticMemory.matches[0]?.score || 0;
    const noveltyScore = clampScore(100 - (overlapScore * 100));
    const editorialBrief = buildBlogEditorialBrief({
      topic: template.topic,
      additionalContext: template.angle,
      targetKeyword: template.targetKeyword,
      language: input.language,
      categoryName: category.name,
      tagNames,
      internalLinks,
      researchSources: research.sources,
      semanticMemory,
    });
    const riskNotes = [
      ...semanticMemory.riskNotes,
      ...editorialBrief.riskNotes,
    ];
    if (tagIds.length === 0) {
      riskNotes.push("No existing tags matched this topic; editor should choose tags manually before generation.");
    }

    candidates.push({
      id: stableCandidateId(template.topic, input.language),
      topic: template.topic,
      targetKeyword: template.targetKeyword,
      language: input.language,
      categoryId: category.id,
      categoryName: category.name,
      tagIds,
      tagNames,
      internalLinks,
      score: scoreCandidate({
        noveltyScore,
        tagCount: tagIds.length,
        sourceConfidence: research.confidence,
        recommendation,
        templateRank: rank,
      }),
      noveltyScore,
      overlapScore,
      recommendation,
      angle: template.angle,
      rationale: recommendation === "recommended"
        ? "Good candidate: low overlap and enough existing editorial structure to generate manually."
        : recommendation === "change_angle"
          ? "Similar content exists; use a clearly different angle if generated."
          : "High overlap detected; consider updating the existing post instead of creating a new one.",
      riskNotes,
      research,
      semanticMemory,
      editorialBrief,
    });
  }

  const sorted = candidates
    .sort((a, b) => b.score - a.score || a.overlapScore - b.overlapScore || a.topic.localeCompare(b.topic));
  const returned = sorted.slice(0, limit);

  return {
    language: input.language,
    generatedAt: new Date().toISOString(),
    candidates: returned,
    summary: {
      considered: candidates.length,
      returned: returned.length,
      recommended: returned.filter(candidate => candidate.recommendation === "recommended").length,
      changeAngle: returned.filter(candidate => candidate.recommendation === "change_angle").length,
      updateExisting: returned.filter(candidate => candidate.recommendation === "update_existing").length,
    },
  };
}
