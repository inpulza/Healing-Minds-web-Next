import type { BlogPostImage } from "@shared/schema";

export function summarizeBlogImageJobSlots(
  slots: BlogPostImage[],
  initialWarnings: string[] = [],
): {
  status: "completed" | "partial_failed" | "failed";
  result: Record<string, unknown>;
} {
  const completed = slots.filter(slot => slot.generationStatus === "completed");
  const failed = slots.filter(slot => slot.generationStatus === "failed");
  const pending = slots.filter(slot => slot.generationStatus === "pending");
  const generating = slots.filter(slot => slot.generationStatus === "generating");
  const warnings = Array.from(new Set([
    ...initialWarnings,
    ...failed.map(slot => `${slot.slot}: ${slot.errorMessage || "image generation failed"}`),
  ]));
  const status = failed.length === 0
    ? "completed"
    : completed.length > 0
      ? "partial_failed"
      : "failed";
  return {
    status,
    result: {
      total: slots.length,
      completed: completed.length,
      failed: failed.length,
      pending: pending.length,
      generating: generating.length,
      generatedImageIds: completed.map(slot => slot.id),
      failedImageIds: failed.map(slot => slot.id),
      warnings,
    },
  };
}
