import {
  buildHealingMindsBlogExpansionPrompt,
  buildHealingMindsBlogPrompt,
} from "./prompts";
import { extractAllowedSourceUrls } from "./research";
import {
  countBlogDraftWords,
  extractBlogDraftAnchorHrefs,
  parseGeneratedDraftJson,
} from "./validation";
import type { BlogAiConfig, BlogAiGenerateInput, BlogAiGeneratedDraft } from "./types";

type OpenAiChatResponse = {
  choices?: Array<{
    finish_reason?: string;
    message?: {
      content?: string;
    };
  }>;
};

function readPositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

function getBlogAiConfig(): BlogAiConfig {
  if (process.env.BLOG_AI_ENABLED === "false") {
    throw Object.assign(new Error("Blog AI generation is disabled"), { statusCode: 503 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw Object.assign(new Error("Blog AI generation is not configured"), { statusCode: 503 });
  }

  return {
    apiKey,
    model: process.env.BLOG_AI_MODEL || "gpt-4o-mini",
    timeoutMs: readPositiveInt(process.env.BLOG_AI_TIMEOUT_MS, 60_000),
    maxTokens: readPositiveInt(process.env.BLOG_AI_MAX_TOKENS, 6_500),
  };
}

export function assertBlogAiGenerationConfigured(): void {
  getBlogAiConfig();
}

function getProviderErrorMessage(status: number): string {
  if (status === 401 || status === 403) return "Blog AI provider credentials were rejected";
  if (status === 429) return "Blog AI provider rate limit was reached";
  return "Blog AI provider request failed";
}

async function requestBlogDraftJson(
  config: BlogAiConfig,
  prompt: string,
  temperature: number,
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        temperature,
        max_tokens: config.maxTokens,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "You create conservative, educational medical blog drafts that require human review. You never invent sources, patient stories, credentials, or treatment guarantees.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw Object.assign(new Error(getProviderErrorMessage(response.status)), {
        statusCode: response.status === 429 ? 429 : 502,
      });
    }

    const payload = await response.json() as OpenAiChatResponse;
    const choice = payload.choices?.[0];
    if (choice?.finish_reason === "length") {
      throw Object.assign(new Error("Blog AI provider response was truncated"), { statusCode: 502 });
    }

    const content = choice?.message?.content;
    if (!content) {
      throw Object.assign(new Error("Blog AI provider returned an empty draft"), { statusCode: 502 });
    }

    return content;
  } catch (error) {
    if ((error as { name?: string }).name === "AbortError") {
      throw Object.assign(new Error("Blog AI provider timed out"), { statusCode: 504 });
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function addUniqueRiskNote(draft: BlogAiGeneratedDraft, note: string): BlogAiGeneratedDraft {
  if (draft.riskNotes.includes(note)) return draft;
  return {
    ...draft,
    riskNotes: [...draft.riskNotes, note],
  };
}

function assertExpansionPreservesLinks(
  initialDraft: BlogAiGeneratedDraft,
  expandedDraft: BlogAiGeneratedDraft,
): void {
  const expandedLinks = new Set(extractBlogDraftAnchorHrefs(expandedDraft.contentHtml));
  const missingLinks = extractBlogDraftAnchorHrefs(initialDraft.contentHtml)
    .filter(href => !expandedLinks.has(href));

  if (missingLinks.length > 0) {
    throw Object.assign(new Error("Blog AI expansion removed validated links"), { statusCode: 502 });
  }
}

export async function generateBlogDraftWithAi(input: BlogAiGenerateInput): Promise<BlogAiGeneratedDraft> {
  const config = getBlogAiConfig();
  const normalizationOptions = {
    allowedExternalSourceUrls: extractAllowedSourceUrls(input.researchSources || []),
    allowedInternalLinks: input.internalLinks || [],
    minimumWordCount: input.editorialBrief?.minimumWordCount,
    targetWordCount: input.editorialBrief?.targetWordCount,
    minimumH2Count: Math.min(5, input.editorialBrief?.requiredSections.length || 5),
    requiredSections: input.editorialBrief?.requiredSections,
  };
  const initialContent = await requestBlogDraftJson(
    config,
    buildHealingMindsBlogPrompt(input),
    0.35,
  );
  const initialDraft = parseGeneratedDraftJson(
    initialContent,
    input.language,
    input.topic,
    normalizationOptions,
  );
  const minimumWordCount = input.editorialBrief?.minimumWordCount;
  const initialWordCount = countBlogDraftWords(initialDraft.contentHtml);

  if (!minimumWordCount || initialWordCount >= minimumWordCount) {
    return initialDraft;
  }

  try {
    const expandedContent = await requestBlogDraftJson(
      config,
      buildHealingMindsBlogExpansionPrompt(input, initialDraft, initialWordCount),
      0.2,
    );
    const expandedCandidate = parseGeneratedDraftJson(
      expandedContent,
      input.language,
      input.topic,
      normalizationOptions,
    );
    assertExpansionPreservesLinks(initialDraft, expandedCandidate);
    const expandedDraft: BlogAiGeneratedDraft = {
      ...expandedCandidate,
      title: initialDraft.title,
      slug: initialDraft.slug,
      excerpt: initialDraft.excerpt,
      metaTitle: initialDraft.metaTitle,
      metaDescription: initialDraft.metaDescription,
      featuredImageAlt: initialDraft.featuredImageAlt,
    };
    const expandedWordCount = countBlogDraftWords(expandedDraft.contentHtml);

    if (expandedWordCount > initialWordCount) {
      return expandedDraft;
    }

    return addUniqueRiskNote(
      initialDraft,
      "Automatic depth expansion did not produce a longer safe draft. Expand during human review.",
    );
  } catch {
    return addUniqueRiskNote(
      initialDraft,
      "Automatic depth expansion could not be completed safely. Expand during human review.",
    );
  }
}
