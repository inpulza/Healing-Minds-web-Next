export type BlogImageConfig = {
  enabled: boolean;
  apiKey: string;
  model: string;
  timeoutMs: number;
  quality: "low" | "medium" | "high" | "auto";
  maxInline: number;
};

function readPositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function isBlogImageEnabled(): boolean {
  return process.env.BLOG_IMAGE_ENABLED === "true";
}

export function getBlogImageConfig(): BlogImageConfig {
  if (!isBlogImageEnabled()) {
    throw Object.assign(new Error("Blog image generation is disabled"), { statusCode: 503 });
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw Object.assign(new Error("Blog image generation is not configured"), { statusCode: 503 });
  }

  const requestedQuality = process.env.BLOG_IMAGE_QUALITY;
  const quality = requestedQuality === "low"
    || requestedQuality === "medium"
    || requestedQuality === "high"
    || requestedQuality === "auto"
    ? requestedQuality
    : "medium";

  return {
    enabled: true,
    apiKey,
    model: process.env.BLOG_IMAGE_MODEL?.trim() || "gpt-image-2",
    timeoutMs: readPositiveInt(process.env.BLOG_IMAGE_TIMEOUT_MS, 150_000),
    quality,
    maxInline: Math.min(2, readPositiveInt(process.env.BLOG_IMAGE_MAX_INLINE, 2)),
  };
}

export function assertBlogImageConfigured(): void {
  getBlogImageConfig();
}
