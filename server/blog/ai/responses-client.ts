type ResponsesConfig = {
  apiKey: string;
  model: string;
  effort: "low" | "medium" | "high";
  timeoutMs: number;
};

type JsonSchemaFormat = {
  name: string;
  schema: Record<string, unknown>;
};

function getEffort(value: string | undefined, fallback: ResponsesConfig["effort"]): ResponsesConfig["effort"] {
  return value === "low" || value === "medium" || value === "high" ? value : fallback;
}

function getResponsesConfig(role: "planner" | "judge"): ResponsesConfig {
  if (process.env.BLOG_TOPIC_ENABLED !== "true") {
    throw Object.assign(new Error("AI topic strategy is disabled. Set BLOG_TOPIC_ENABLED=true to enable it."), {
      statusCode: 503,
      code: "topic_strategy_disabled",
    });
  }
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw Object.assign(new Error("OPENAI_API_KEY is required for AI topic strategy"), {
      statusCode: 503,
      code: "topic_provider_not_configured",
    });
  }
  return {
    apiKey,
    model: role === "planner"
      ? process.env.BLOG_TOPIC_MODEL?.trim() || "gpt-5.6-sol"
      : process.env.BLOG_TOPIC_JUDGE_MODEL?.trim() || "gpt-5.6-terra",
    effort: role === "planner"
      ? getEffort(process.env.BLOG_TOPIC_REASONING_EFFORT, "medium")
      : getEffort(process.env.BLOG_TOPIC_JUDGE_REASONING_EFFORT, "low"),
    timeoutMs: Math.max(10_000, Math.min(120_000, Number(process.env.BLOG_TOPIC_TIMEOUT_MS) || 60_000)),
  };
}

function extractResponseText(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const response = payload as {
    output_text?: string;
    output?: Array<{ type?: string; content?: Array<{ type?: string; text?: string; refusal?: string }> }>;
  };
  if (response.output_text) return response.output_text;
  for (const item of response.output || []) {
    for (const content of item.content || []) {
      if (content.type === "refusal" && content.refusal) {
        throw Object.assign(new Error(`OpenAI refused the topic request: ${content.refusal}`), {
          statusCode: 422,
          code: "topic_provider_refusal",
        });
      }
      if (content.type === "output_text" && content.text) return content.text;
    }
  }
  return "";
}

export async function createStructuredResponse(input: {
  role: "planner" | "judge";
  system: string;
  user: Record<string, unknown>;
  format: JsonSchemaFormat;
}): Promise<{ data: unknown; model: string; durationMs: number }> {
  const config = getResponsesConfig(input.role);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
  const startedAt = Date.now();
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        store: false,
        reasoning: { effort: config.effort },
        instructions: input.system,
        input: JSON.stringify(input.user),
        text: {
          format: {
            type: "json_schema",
            name: input.format.name,
            strict: true,
            schema: input.format.schema,
          },
        },
      }),
      signal: controller.signal,
    });
    const payload = await response.json().catch(() => ({})) as { error?: { message?: string; code?: string } };
    if (!response.ok) {
      throw Object.assign(
        new Error(payload.error?.message || `OpenAI Responses API returned ${response.status}`),
        {
          statusCode: response.status === 429 ? 429 : 502,
          code: payload.error?.code || `responses_${response.status}`,
          retryable: response.status === 408 || response.status === 409 || response.status === 429 || response.status >= 500,
        },
      );
    }
    const text = extractResponseText(payload);
    if (!text) {
      throw Object.assign(new Error("OpenAI returned no structured topic output"), {
        statusCode: 502,
        code: "empty_topic_response",
        retryable: true,
      });
    }
    try {
      return {
        data: JSON.parse(text),
        model: config.model,
        durationMs: Date.now() - startedAt,
      };
    } catch {
      throw Object.assign(new Error("OpenAI returned invalid structured topic JSON"), {
        statusCode: 502,
        code: "invalid_topic_response",
        retryable: true,
      });
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw Object.assign(new Error("OpenAI topic request timed out"), {
        statusCode: 504,
        code: "topic_provider_timeout",
        retryable: true,
      });
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export function assertBlogTopicGenerationConfigured(): void {
  getResponsesConfig("planner");
  getResponsesConfig("judge");
}
