import { getBlogImageConfig } from "./config";

type OpenAiImageResponse = {
  data?: Array<{ b64_json?: string }>;
  error?: {
    code?: string;
    message?: string;
    type?: string;
  };
};

export type GeneratedImageBytes = {
  bytes: Buffer;
  model: string;
  provider: "openai";
  requestId: string | null;
};

export async function generateImageWithOpenAi(prompt: string): Promise<GeneratedImageBytes> {
  const config = getBlogImageConfig();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        prompt,
        n: 1,
        size: "1536x1024",
        quality: config.quality,
        output_format: "webp",
        output_compression: 82,
        moderation: "auto",
      }),
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => ({})) as OpenAiImageResponse;
    if (!response.ok) {
      const error = Object.assign(
        new Error(payload.error?.message || `OpenAI image request failed (${response.status})`),
        {
          statusCode: response.status,
          errorCode: payload.error?.code || payload.error?.type || `http_${response.status}`,
        },
      );
      throw error;
    }

    const encoded = payload.data?.[0]?.b64_json;
    if (!encoded) {
      throw Object.assign(new Error("OpenAI image response did not include image bytes"), {
        statusCode: 502,
        errorCode: "empty_image",
      });
    }

    return {
      bytes: Buffer.from(encoded, "base64"),
      model: config.model,
      provider: "openai",
      requestId: response.headers.get("x-request-id"),
    };
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      throw Object.assign(new Error("OpenAI image request timed out"), {
        statusCode: 504,
        errorCode: "timeout",
      });
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
