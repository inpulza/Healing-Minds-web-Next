import { buildHealingMindsBlogPrompt } from "./prompts";
import { extractAllowedSourceUrls } from "./research";
import { parseGeneratedDraftJson } from "./validation";
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

export function buildProviderSafeBlogInput(input: BlogAiGenerateInput): BlogAiGenerateInput {
  const providerInput = {
    ...input,
    additionalContext: input.providerEditorialContext,
  };
  delete providerInput.providerEditorialContext;
  if (!providerInput.additionalContext) delete providerInput.additionalContext;
  return providerInput;
}

export async function generateBlogDraftWithAi(input: BlogAiGenerateInput): Promise<BlogAiGeneratedDraft> {
  const config = getBlogAiConfig();
  // Human free-form context is useful for local source/tag/brief selection, but
  // is never sent verbatim. Only a separately-provenanced planner angle may be
  // restored here alongside the deterministic editorial brief.
  const providerInput = buildProviderSafeBlogInput(input);
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
        temperature: 0.35,
        max_tokens: config.maxTokens,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "You create conservative, educational medical blog drafts that require human review. You never invent sources, patient stories, credentials, or treatment guarantees.",
          },
          {
            role: "user",
            content: buildHealingMindsBlogPrompt(providerInput),
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

    return parseGeneratedDraftJson(content, providerInput.language, providerInput.topic, {
      allowedExternalSourceUrls: extractAllowedSourceUrls(providerInput.researchSources || []),
      allowedInternalLinks: providerInput.internalLinks || [],
      minimumWordCount: providerInput.editorialBrief?.minimumWordCount,
      targetWordCount: providerInput.editorialBrief?.targetWordCount,
      minimumH2Count: Math.min(5, providerInput.editorialBrief?.requiredSections.length || 5),
      requiredSections: providerInput.editorialBrief?.requiredSections,
    });
  } catch (error) {
    if ((error as { name?: string }).name === "AbortError") {
      throw Object.assign(new Error("Blog AI provider timed out"), { statusCode: 504 });
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
