/**
 * Bidirectional URL mapping utility for English ↔ Spanish pages.
 * Derived from the single route manifest in shared/routeManifest.ts.
 */

import { getBilingualUrlMap } from '@shared/routeManifest';

const bilingualURLMapping: Record<string, string> = getBilingualUrlMap();

/**
 * Get the corresponding URL for the target language
 * @param currentURL - Current URL path (without domain)
 * @param targetLanguage - Target language ('en' | 'es')
 * @returns Corresponding URL in target language, or null if no bilingual counterpart exists
 */
export function getCorrespondingURL(currentURL: string, targetLanguage: 'en' | 'es'): string | null {
  // Normalize URL by removing trailing slash (except for homepage)
  const normalizedURL = currentURL === '/' ? '/' : currentURL.replace(/\/$/, '');
  
  // Check if current URL has a bilingual counterpart
  const correspondingURL = bilingualURLMapping[normalizedURL];
  
  if (!correspondingURL) {
    return null; // No bilingual counterpart exists
  }
  
  // Validate that the mapping leads to the correct target language
  const isTargetSpanish = targetLanguage === 'es';
  const correspondingIsSpanish = correspondingURL.startsWith('/es');
  
  // Return the URL only if it matches the target language
  if (isTargetSpanish === correspondingIsSpanish) {
    return correspondingURL;
  }
  
  return null;
}

/**
 * Check if a URL has a bilingual counterpart
 * @param currentURL - Current URL path
 * @returns true if the URL has a bilingual counterpart, false otherwise
 */
export function hasBilingualCounterpart(currentURL: string): boolean {
  const normalizedURL = currentURL === '/' ? '/' : currentURL.replace(/\/$/, '');
  return normalizedURL in bilingualURLMapping;
}

/**
 * Get the language of a URL based on its path
 * @param currentURL - Current URL path
 * @returns 'en' for English URLs, 'es' for Spanish URLs
 */
export function getURLLanguage(currentURL: string): 'en' | 'es' {
  return currentURL.startsWith('/es') ? 'es' : 'en';
}

/**
 * Get all available bilingual URL pairs
 * @returns Array of [englishURL, spanishURL] pairs
 */
export function getAllBilingualPairs(): Array<[string, string]> {
  const pairs: Array<[string, string]> = [];
  const processedURLs = new Set<string>();
  
  for (const [url, correspondingURL] of Object.entries(bilingualURLMapping)) {
    if (!processedURLs.has(url) && !processedURLs.has(correspondingURL)) {
      const englishURL = url.startsWith('/es') ? correspondingURL : url;
      const spanishURL = url.startsWith('/es') ? url : correspondingURL;
      pairs.push([englishURL, spanishURL]);
      processedURLs.add(url);
      processedURLs.add(correspondingURL);
    }
  }
  
  return pairs;
}
