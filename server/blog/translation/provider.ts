import { z } from "zod";
import type { BlogLanguage, BlogPostWithRelations } from "../storage";
import type { BlogTranslationDraft } from "./types";

const translationSchema = z.object({
  title: z.string().trim().min(5).max(255),
  slug: z.string().trim().min(3).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().trim().min(20),
  contentHtml: z.string().trim().min(100),
  metaTitle: z.string().trim().min(5).max(70),
  metaDescription: z.string().trim().min(20).max(160),
  featuredImageAlt: z.string().trim().min(3).max(255),
  targetKeyword: z.string().trim().min(3).max(120),
  expertiseAngle: z.string().trim().max(2_000),
});

type ProviderResponse = { choices?: Array<{ finish_reason?: string; message?: { content?: string } }> };

export function extractHtmlHrefs(html: string): string[] {
  return Array.from(html.matchAll(/\bhref\s*=\s*["']([^"']+)["']/gi), match => match[1]);
}

export function assertTranslationLinkContract(
  sourceHtml: string,
  translatedHtml: string,
  linkMap: Record<string, string>,
  allowedTargetSourceUrls: string[],
): void {
  const sourceHrefs = Array.from(new Set(extractHtmlHrefs(sourceHtml)));
  const permitted = new Set([
    ...sourceHrefs,
    ...Object.values(linkMap),
    ...allowedTargetSourceUrls,
  ]);
  const translatedHrefs = new Set(extractHtmlHrefs(translatedHtml));
  const invented = Array.from(translatedHrefs).filter(href => !permitted.has(href));
  if (invented.length > 0) {
    throw Object.assign(new Error(`Translation invented or manually translated URLs: ${invented.join(", ")}`), {
      statusCode: 502,
      code: "blog_translation_untrusted_url",
    });
  }
  const missing = sourceHrefs.filter(href => !translatedHrefs.has(linkMap[href] || href));
  if (missing.length > 0) {
    throw Object.assign(new Error(`Translation removed source links: ${missing.join(", ")}`), {
      statusCode: 502,
      code: "blog_translation_missing_link",
    });
  }
}

function positiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

export async function translateBlogPostWithAi(input: {
  source: BlogPostWithRelations;
  targetLanguage: BlogLanguage;
  linkMap: Record<string, string>;
  targetSourceUrls: string[];
}): Promise<BlogTranslationDraft> {
  if (process.env.BLOG_AI_ENABLED === "false") {
    throw Object.assign(new Error("Blog AI generation is disabled"), { statusCode: 503 });
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw Object.assign(new Error("Blog AI generation is not configured"), { statusCode: 503 });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), positiveInt(process.env.BLOG_AI_TIMEOUT_MS, 60_000));
  const targetName = input.targetLanguage === "es" ? "Spanish" : "English";
  const prompt = [
    `Create a clinically conservative ${targetName} adaptation of this educational psychiatry article.`,
    "Return one JSON object with title, slug, excerpt, contentHtml, metaTitle, metaDescription, featuredImageAlt, targetKeyword, expertiseAngle.",
    "Preserve meaning, heading hierarchy, paragraph/list structure, disclaimer, citations and all links. Do not add clinical claims, advice, dosages, guarantees, patient stories, sources or URLs.",
    "Translate all visible text including headings, link labels, image alt/captions and the medical disclaimer. Keep the article a human-review draft.",
    `For each exact source URL key, use only its exact mapped value: ${JSON.stringify(input.linkMap)}.`,
    `These are the only additional curated official target-language URLs allowed: ${JSON.stringify(input.targetSourceUrls)}. Use one only when it supports the same cited claim; otherwise retain the original exact URL.`,
    `SOURCE_JSON=${JSON.stringify({
      title: input.source.title,
      slug: input.source.slug,
      excerpt: input.source.excerpt || "",
      contentHtml: input.source.content || "",
      metaTitle: input.source.metaTitle || input.source.title,
      metaDescription: input.source.metaDescription || input.source.excerpt || "",
      featuredImageAlt: input.source.featuredImageAlt || input.source.title,
      targetKeyword: input.source.targetKeyword || input.source.title,
      expertiseAngle: input.source.expertiseAngle || "",
    })}`,
  ].join("\n\n");
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.BLOG_AI_MODEL || "gpt-4o-mini",
        temperature: 0.1,
        max_tokens: positiveInt(process.env.BLOG_AI_MAX_TOKENS, 6_500),
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "You are a bilingual medical editor. You preserve clinical meaning and never invent claims or sources." },
          { role: "user", content: prompt },
        ],
      }),
      signal: controller.signal,
    });
    if (!response.ok) throw Object.assign(new Error("Blog translation provider request failed"), { statusCode: response.status === 429 ? 429 : 502 });
    const payload = await response.json() as ProviderResponse;
    const choice = payload.choices?.[0];
    if (choice?.finish_reason === "length") throw Object.assign(new Error("Blog translation response was truncated"), { statusCode: 502 });
    if (!choice?.message?.content) throw Object.assign(new Error("Blog translation provider returned no content"), { statusCode: 502 });
    const draft = translationSchema.parse(JSON.parse(choice.message.content));
    assertTranslationLinkContract(input.source.content || "", draft.contentHtml, input.linkMap, input.targetSourceUrls);
    return draft;
  } catch (error) {
    if ((error as { name?: string }).name === "AbortError") {
      throw Object.assign(new Error("Blog translation provider timed out"), { statusCode: 504 });
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
