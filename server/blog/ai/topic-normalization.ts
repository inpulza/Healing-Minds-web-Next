import type { BlogLanguage } from "../storage";

const STOPWORDS: Record<BlogLanguage, Set<string>> = {
  en: new Set([
    "a", "an", "and", "are", "at", "best", "blog", "care", "for", "from", "guide",
    "healing", "how", "in", "mental", "minds", "more", "naples", "of", "options",
    "patient", "patients", "psychiatric", "psychiatry", "the", "this", "to", "top",
    "treatment", "what", "when", "with", "your",
  ]),
  es: new Set([
    "a", "atencion", "blog", "como", "con", "cuidado", "de", "del", "el", "en",
    "guia", "la", "las", "los", "mejor", "mejores", "mental", "naples", "opciones",
    "para", "paciente", "pacientes", "por", "psiquiatria", "psiquiatrica", "que",
    "tratamiento", "un", "una", "y",
  ]),
};

export function normalizeTopicText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getTopicCoreTokens(value: string, language: BlogLanguage): string[] {
  return Array.from(new Set(
    normalizeTopicText(value)
      .split(" ")
      .filter(token => token.length >= 3 && !STOPWORDS[language].has(token)),
  )).sort();
}

export function topicJaccardSimilarity(
  left: string,
  right: string,
  language: BlogLanguage,
): { score: number; overlapTerms: string[] } {
  const leftTokens = getTopicCoreTokens(left, language);
  const rightTokens = getTopicCoreTokens(right, language);
  const union = new Set([...leftTokens, ...rightTokens]);
  if (union.size === 0) return { score: 0, overlapTerms: [] };
  const rightSet = new Set(rightTokens);
  const overlapTerms = leftTokens.filter(token => rightSet.has(token));
  return {
    score: Number((overlapTerms.length / union.size).toFixed(4)),
    overlapTerms,
  };
}

export function buildTopicKey(value: string, language: BlogLanguage): string {
  const tokens = getTopicCoreTokens(value, language);
  return `${language}:${tokens.join("-").slice(0, 150)}`;
}

export function hasRiskyListicleLanguage(value: string, language: BlogLanguage): boolean {
  const normalized = normalizeTopicText(value);
  const phrases = language === "es"
    ? ["mejores", "top", "garantizado", "cura"]
    : ["best", "top", "guaranteed", "cure"];
  return phrases.some(phrase => new RegExp(`\\b${phrase}\\b`).test(normalized));
}

export function hasCosmeticFreshness(value: string): boolean {
  const normalized = normalizeTopicText(value);
  return /\b(?:20\d{2}|spring|summer|fall|winter|primavera|verano|otono|invierno)\b/.test(normalized);
}

export function hasUnsafeYmylTopic(value: string, language: BlogLanguage): boolean {
  const normalized = normalizeTopicText(value);
  const shared = [
    /\b\d+(?:\.\d+)?\s*(?:mg|mcg|ml)\b/,
    /\b(?:guaranteed|guarantees?|cure[ds]?|curing|permanent(?:ly)?|works every time|curar|cura[ds]?|curo|curado|curando|garantizad[oa]s?|garantiza[ds]?)\b/,
    /\b(?:dr|doctor|dra|doctora)\s+(?:melva\s+)?reve\b/,
    /\b(?:patient|patients|paciente)\s+(?:story|stories|testimonial|testimonio|historia|caso)\b/,
    /\b(?:testimonial|testimonio|case study|caso real)\b/,
    /\b(?:suicide|suicidal|suicidio|suicida|crisis)\b.*\b(?:story|saved|dramatic|confession|historia|salvo|dramatica|confesion)\b/,
  ];
  const languagePatterns = language === "es"
    ? [
        /\b(?:autodiagnosticar|autodiagnostico|diagnosticarte|diagnostiquese|diagnostico en casa)\b/,
        /\b(?:dejar|iniciar|aumentar|reducir|suspender|doblar|duplicar|omitir|cambiar|combinar)\b.*\b(?:medicamento|antidepresivo|estimulante|ansiolitico|dosis)\b/,
        /\b(?:dosis|dosificacion)\s+(?:correcta|ideal|recomendada)\b/,
      ]
    : [
        /\b(?:diagnose yourself|self diagnose|self diagnosis|diagnose at home)\b/,
        /\b(?:start|stop|increase|decrease|taper|double|halve|skip|switch|combine)\b.*\b(?:medication|antidepressant|stimulant|benzodiazepine|dose|dosage)\b/,
        /\b(?:correct|ideal|recommended)\s+dos(?:e|age)\b/,
      ];
  const medicationAction = language === "es"
    ? /\b(?:dejar|iniciar|aumentar|reducir|suspender|doblar|duplicar|omitir|cambiar|combinar)\b/
    : /\b(?:start|stop|increase|decrease|taper|double|halve|skip|switch|combine)\b/;
  const medicationTerm = language === "es"
    ? /\b(?:medicamentos?|medicaciones?|antidepresivos?|estimulantes?|ansioliticos?|benzodiazepinas?|dosis|dosificaciones?)\b/
    : /\b(?:medications?|medicines?|antidepressants?|stimulants?|benzodiazepines?|doses?|dosages?)\b/;
  return [...shared, ...languagePatterns].some(pattern => pattern.test(normalized))
    || (medicationAction.test(normalized) && medicationTerm.test(normalized));
}
