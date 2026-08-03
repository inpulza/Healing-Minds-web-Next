export function truncateSeoText(value: string, maxLength: number): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;

  const bounded = normalized.slice(0, maxLength + 1);
  const lastWordBoundary = bounded.lastIndexOf(" ");
  if (lastWordBoundary > 0) return bounded.slice(0, lastWordBoundary).trimEnd();

  // A single unbroken token has no safe word boundary. Keep the hard limit as
  // a final guard for URLs or malformed provider output rather than returning
  // an empty SEO field.
  return normalized.slice(0, maxLength);
}
