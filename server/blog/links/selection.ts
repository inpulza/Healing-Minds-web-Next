import { normalizeBlogLinkSearchText } from "./normalization";

function containsNormalizedPhrase(haystack: string, value: string): boolean {
  const normalized = normalizeBlogLinkSearchText(value);
  return normalized.length > 0 && ` ${haystack} `.includes(` ${normalized} `);
}

export function countBlogLinkTopicMatches(
  normalizedHaystack: string,
  terms: readonly string[],
): number {
  return terms.reduce(
    (total, term) => total + (containsNormalizedPhrase(normalizedHaystack, term) ? 1 : 0),
    0,
  );
}

export function isBlogLinkTopicallyCompatible(termMatches: number): boolean {
  return Number.isInteger(termMatches) && termMatches > 0;
}
