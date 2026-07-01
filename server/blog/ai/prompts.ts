import type { BlogAiGenerateInput } from "./types";
import { formatResearchSourcesForPrompt } from "./research";
import { formatEditorialBriefForPrompt } from "./editorial-brief";
import { getDefaultBlogInternalLinkHrefs } from "../internal-links";

function formatList(items: string[]): string {
  return items.length > 0 ? items.map(item => `- ${item}`).join("\n") : "- None provided";
}

function formatSemanticMemoryForPrompt(input: BlogAiGenerateInput): string {
  const matches = input.semanticMemory?.matches || [];
  if (matches.length === 0) {
    return "- No similar existing blog posts found in the current language.";
  }

  return matches.map(match => (
    `- ${match.title} (${match.status}, score ${match.score}): overlap terms ${match.overlapTerms.join(", ")}. Recommendation: ${match.recommendation}.`
  )).join("\n");
}

export function buildHealingMindsBlogPrompt(input: BlogAiGenerateInput): string {
  const languageName = input.language === "es" ? "Spanish" : "English";
  const fallbackLinks = getDefaultBlogInternalLinkHrefs(input.language);
  const internalLinks = input.internalLinks && input.internalLinks.length > 0 ? input.internalLinks : fallbackLinks;
  const researchSources = input.researchSources || [];
  const semanticMemory = input.semanticMemory;

  return `You are drafting a blog article for Healing Minds Psychiatry in Naples, Florida.

Write in ${languageName}.

Topic:
${input.topic}

Target keyword:
${input.targetKeyword || input.topic}

Editorial context:
${input.additionalContext || "No additional editorial context provided."}

Category:
${input.categoryName || "No category provided"}

Selected tags:
${formatList(input.tagNames || [])}

Allowed internal links:
${formatList(internalLinks)}

Trusted external sources:
${formatResearchSourcesForPrompt(researchSources)}

Existing content to avoid duplicating:
${semanticMemory ? formatSemanticMemoryForPrompt(input) : "- No semantic memory provided."}

Editorial brief:
${formatEditorialBriefForPrompt(input.editorialBrief)}

Clinical/YMYL rules:
- This is an educational draft for human clinical review, not medical advice.
- Do not diagnose the reader.
- Do not promise cures, guaranteed outcomes, or personalized treatment results.
- Do not invent sources, studies, statistics, credentials, patient stories, reviews, or testimonials.
- Use only the trusted external source URLs listed above. Do not use any other external URLs.
- If the trusted sources are not specific enough for a claim, keep the claim broad or omit it.
- Include a short <h2>Sources</h2> section near the end with 1 to 3 trusted source links when relevant.
- Use the existing content notes to avoid repeating the same angle as another article.
- Do not mention patient-identifying information.
- Use Dr. Melva Reve Urgelles as the clinician/author context without inventing credentials beyond psychiatrist/bilingual psychiatric care.
- Include emergency/911 and not-a-substitute-for-medical-advice language near the end.
- Keep the tone calm, clear, professional, and patient-friendly.

HTML rules:
- Return body HTML only, no full document, no markdown.
- Allowed tags only: <p>, <h2>, <h3>, <ul>, <ol>, <li>, <strong>, <em>, <a>, <blockquote>.
- Do not use <h1>, <img>, <script>, <style>, iframes, inline styles, classes, or event handlers.
- Follow the editorial brief sections as <h2> sections where they fit naturally.
- Include 5 to 7 useful <h2> sections.
- Include at least one natural internal link from the allowed list.
- Aim for the editorial brief target word count without padding or repeating yourself.
- Use concise, clinically conservative explanations instead of filler.

Return only valid JSON with this exact shape:
{
  "title": "SEO-friendly article title",
  "slug": "lowercase-hyphenated-slug",
  "excerpt": "20 to 500 character summary",
  "contentHtml": "<p>...</p>",
  "metaTitle": "70 characters max",
  "metaDescription": "50 to 160 characters",
  "featuredImageAlt": "descriptive alt text",
  "riskNotes": ["short note for human reviewer"]
}`;
}
