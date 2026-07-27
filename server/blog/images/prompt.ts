import type { BlogPostImageRole } from "@shared/schema";
import type { BlogPostWithRelations } from "../storage";
import { getPlainTextFromHtml } from "../sanitize";

export const BLOG_IMAGE_PROMPT_VERSION = "healing-minds-v1";

const APPROVED_VISUAL_TOPICS = [
  { pattern: /\banxi(?:ety|ous)\b|\bansiedad\b/i, label: "anxiety education" },
  { pattern: /\bdepress(?:ion|ive)\b|\bdepresi[oó]n\b/i, label: "depression education" },
  { pattern: /\badhd\b|\btdah\b|\battention\b|\batenci[oó]n\b/i, label: "attention and focus education" },
  { pattern: /\bbipolar\b/i, label: "mood stability education" },
  { pattern: /\bptsd\b|\btrauma\b|\btea?pt\b/i, label: "trauma-informed wellbeing education" },
  { pattern: /\bsleep\b|\binsomnia\b|\bsue[nñ]o\b|\binsomnio\b/i, label: "healthy sleep education" },
  { pattern: /\bstress\b|\bestr[eé]s\b/i, label: "stress management education" },
  { pattern: /\btelehealth\b|\btelepsychiatry\b|\btelesalud\b|\btelepsiquiatr/i, label: "private telehealth access" },
  { pattern: /\bwellness\b|\bwellbeing\b|\bbienestar\b/i, label: "mental wellbeing education" },
] as const;

function compact(value: string | null | undefined, maxLength: number): string {
  return (value || "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function getApprovedVisualTopics(post: BlogPostWithRelations, anchorHeading?: string | null): string {
  const localEditorialText = [
    post.title,
    post.category?.name,
    anchorHeading,
    post.excerpt,
    getPlainTextFromHtml(post.content || ""),
  ].filter(Boolean).join(" ");
  const matches = APPROVED_VISUAL_TOPICS
    .filter(topic => topic.pattern.test(localEditorialText))
    .map(topic => topic.label)
    .slice(0, 2);
  return matches.length > 0 ? matches.join(" and ") : "general mental health education";
}

export function buildSafeVisualBrief(
  post: BlogPostWithRelations,
  role: BlogPostImageRole,
  anchorHeading?: string | null,
): string {
  const language = post.language === "es" ? "Spanish-language" : "English-language";
  const approvedTopics = getApprovedVisualTopics(post, anchorHeading);

  return [
    `${role === "hero" ? "Editorial hero" : "Editorial inline"} image for a ${language} educational mental health article.`,
    `Approved article theme: ${approvedTopics}.`,
    "Use a calm, hopeful, premium editorial still life or abstract environmental metaphor.",
    "Prefer natural light, quiet blue/green neutrals, realistic materials, and generous negative space.",
    "Show no identifiable patient and no real or fabricated clinician likeness.",
    "Do not depict crisis, self-harm, violence, visible distress, restraint, hospitalization, or before/after transformation.",
    "Do not show pills, medication packaging, prescriptions, medical devices as promises, diagnoses, treatment outcomes, or guaranteed results.",
    "No readable text, labels, logos, watermarks, testimonials, charts, or brand marks.",
    "The image is educational atmosphere only and must not imply medical advice or a clinical result.",
  ].join(" ");
}

export function buildBlogImagePrompt(safeVisualBrief: string): string {
  return [
    safeVisualBrief,
    "Landscape 3:2 composition suitable for a responsive psychiatry practice blog.",
    "Photorealistic editorial photography with restrained art direction; no uncanny anatomy and no sensational imagery.",
  ].join(" ");
}

export function buildBlogImageAlt(
  post: BlogPostWithRelations,
  role: BlogPostImageRole,
  anchorHeading?: string | null,
): string {
  const subject = compact(anchorHeading || post.title, 170);
  return post.language === "es"
    ? `Ilustración editorial serena para ${subject}${role === "hero" ? "" : " en el artículo"}`
    : `Calm editorial illustration for ${subject}${role === "hero" ? "" : " in the article"}`;
}

export function buildBlogImageCaption(
  post: BlogPostWithRelations,
  role: BlogPostImageRole,
  anchorHeading?: string | null,
): string | null {
  if (role === "hero") return null;
  const subject = compact(anchorHeading || post.title, 220);
  return post.language === "es"
    ? `Imagen editorial educativa: ${subject}.`
    : `Educational editorial image: ${subject}.`;
}
