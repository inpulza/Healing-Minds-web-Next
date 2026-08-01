import type { BlogAiGenerateInput, BlogAiGeneratedDraft } from "./types";
import { formatResearchSourcesForPrompt } from "./research";
import { formatEditorialBriefForPrompt } from "./editorial-brief";
import { isRecomputedDraftShapeRiskNote } from "./validation";

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

const GENERATED_DRAFT_JSON_SHAPE = `{
  "title": "SEO-friendly article title",
  "slug": "lowercase-hyphenated-slug",
  "excerpt": "20 to 500 character summary",
  "contentHtml": "<p>...</p>",
  "metaTitle": "70 characters max",
  "metaDescription": "50 to 160 characters",
  "featuredImageAlt": "descriptive alt text",
  "riskNotes": ["short note for human reviewer"]
}`;

function formatDepthRequirement(input: BlogAiGenerateInput): string {
  const brief = input.editorialBrief;
  if (!brief) {
    return "- Develop every useful section fully and avoid padding or repetition.";
  }

  return `- The article body must contain at least ${brief.minimumWordCount} words and should aim for ${brief.targetWordCount} words without exceeding ${brief.maximumWordCount} words.
- Do not return the draft before it reaches the ${brief.minimumWordCount}-word minimum.
- Develop every useful section fully with concrete educational detail; avoid padding or repetition.`;
}

export function buildHealingMindsBlogPrompt(input: BlogAiGenerateInput): string {
  const languageName = input.language === "es" ? "Spanish" : "English";
  const internalLinks = input.internalLinks || [];
  const internalLinkRule = internalLinks.length > 0
    ? "- Include at least one natural internal link from the allowed list. Never invent or alter an internal path."
    : "- No managed internal link is available for this draft. Do not add or invent any internal link.";
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
${internalLinkRule}
${formatDepthRequirement(input)}
- Use clinically conservative explanations and enough useful detail to satisfy the brief.

Return only valid JSON with this exact shape:
${GENERATED_DRAFT_JSON_SHAPE}`;
}

export function buildHealingMindsBlogExpansionPrompt(
  input: BlogAiGenerateInput,
  draft: BlogAiGeneratedDraft,
  currentWordCount: number,
): string {
  const brief = input.editorialBrief;
  const minimumWordCount = brief?.minimumWordCount || 800;
  const targetWordCount = brief?.targetWordCount || minimumWordCount;
  const maximumWordCount = brief?.maximumWordCount || Math.round(targetWordCount * 1.25);
  const draftForExpansion = {
    ...draft,
    riskNotes: draft.riskNotes.filter(note => !isRecomputedDraftShapeRiskNote(note)),
  };

  return `Expand this existing Healing Minds Psychiatry draft in ${input.language === "es" ? "Spanish" : "English"}.

Success criteria:
- The current article body has ${currentWordCount} words.
- The expanded article body must contain at least ${minimumWordCount} words.
- Aim for ${targetWordCount} words and never exceed ${maximumWordCount} words.
- Expand the existing draft; do not replace it with a shorter rewrite.
- Fully develop the required sections with useful, patient-friendly educational detail.
- Preserve the title, slug, excerpt, metadata, featured image alt text, existing supported claims, and existing links unless a small correction is required for consistency.
- Keep every existing internal and external link intact.
- You may add links only from the allowlists below.
- Do not introduce new sources, URLs, studies, statistics, diagnoses, patient stories, credentials, treatment guarantees, or personalized medical advice.
- Do not add filler or repeat the same point merely to reach the word count.
- Keep the emergency/911 and medical-advice disclaimer near the end.
- Return the complete expanded draft, not a patch or commentary.

Editorial brief:
${formatEditorialBriefForPrompt(brief)}

Required sections:
${formatList(brief?.requiredSections || [])}

Allowed internal links:
${formatList(input.internalLinks || [])}

Trusted external sources:
${formatResearchSourcesForPrompt(input.researchSources || [])}

Current validated draft:
${JSON.stringify(draftForExpansion)}

Return only valid JSON with this exact shape:
${GENERATED_DRAFT_JSON_SHAPE}`;
}
