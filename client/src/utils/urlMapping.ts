/**
 * Bidirectional URL mapping utility for English ↔ Spanish pages
 * Maps ALL bilingual pages based on sitemap configuration
 */

// Define the complete bilingual URL mapping based on sitemap.ts
const bilingualURLMapping: Record<string, string> = {
  // Homepage mapping
  '/': '/es',
  '/es': '/',
  
  // Main pages mapping
  '/about': '/es/acerca-de',
  '/es/acerca-de': '/about',
  '/contact': '/es/contacto',
  '/es/contacto': '/contact',
  '/services': '/es/servicios',
  '/es/servicios': '/services',
  '/for-patients': '/es/para-pacientes',
  '/es/para-pacientes': '/for-patients',
  '/locations': '/es/ubicaciones',
  '/es/ubicaciones': '/locations',
  
  // Individual service pages mapping
  '/services/anxiety-treatment': '/es/servicios/tratamiento-ansiedad',
  '/es/servicios/tratamiento-ansiedad': '/services/anxiety-treatment',
  '/services/depression-treatment': '/es/servicios/tratamiento-depresion',
  '/es/servicios/tratamiento-depresion': '/services/depression-treatment',
  '/services/adhd-treatment': '/es/servicios/tratamiento-adhd',
  '/es/servicios/tratamiento-adhd': '/services/adhd-treatment',
  '/services/ptsd-treatment': '/es/servicios/tratamiento-tept',
  '/es/servicios/tratamiento-tept': '/services/ptsd-treatment',
  '/services/bipolar-treatment': '/es/servicios/tratamiento-bipolar',
  '/es/servicios/tratamiento-bipolar': '/services/bipolar-treatment',
  '/services/medication-management': '/es/servicios/manejo-medicamentos',
  '/es/servicios/manejo-medicamentos': '/services/medication-management',
  
  // Location pages mapping - all satellite location pages
  '/locations/psychiatrist-naples': '/es/ubicaciones/psiquiatra-naples',
  '/es/ubicaciones/psiquiatra-naples': '/locations/psychiatrist-naples',
  '/locations/psychiatrist-bonita-springs': '/es/ubicaciones/psiquiatra-bonita-springs',
  '/es/ubicaciones/psiquiatra-bonita-springs': '/locations/psychiatrist-bonita-springs',
  '/locations/psychiatrist-marco-island': '/es/ubicaciones/psiquiatra-marco-island',
  '/es/ubicaciones/psiquiatra-marco-island': '/locations/psychiatrist-marco-island',
  '/locations/psychiatrist-fort-myers': '/es/ubicaciones/psiquiatra-fort-myers',
  '/es/ubicaciones/psiquiatra-fort-myers': '/locations/psychiatrist-fort-myers',
  '/locations/psychiatrist-ave-maria': '/es/ubicaciones/psiquiatra-ave-maria',
  '/es/ubicaciones/psiquiatra-ave-maria': '/locations/psychiatrist-ave-maria',
  '/locations/psychiatrist-estero': '/es/ubicaciones/psiquiatra-estero',
  '/es/ubicaciones/psiquiatra-estero': '/locations/psychiatrist-estero',
  '/locations/psychiatrist-golden-gate': '/es/ubicaciones/psiquiatra-golden-gate',
  '/es/ubicaciones/psiquiatra-golden-gate': '/locations/psychiatrist-golden-gate',
  '/locations/psychiatrist-immokalee': '/es/ubicaciones/psiquiatra-immokalee',
  '/es/ubicaciones/psiquiatra-immokalee': '/locations/psychiatrist-immokalee',
  '/locations/psychiatrist-lely-resorts': '/es/ubicaciones/psiquiatra-lely-resorts',
  '/es/ubicaciones/psiquiatra-lely-resorts': '/locations/psychiatrist-lely-resorts',
  '/locations/psychiatrist-vanderbilt-beach': '/es/ubicaciones/psiquiatra-vanderbilt-beach',
  '/es/ubicaciones/psiquiatra-vanderbilt-beach': '/locations/psychiatrist-vanderbilt-beach',
  
  // Legal pages mapping
  '/privacy-policy': '/es/politica-privacidad',
  '/es/politica-privacidad': '/privacy-policy',
  '/terms-of-service': '/es/terminos-servicio',
  '/es/terminos-servicio': '/terms-of-service',
  '/hipaa-notice': '/es/aviso-hipaa',
  '/es/aviso-hipaa': '/hipaa-notice',
  '/cookie-policy': '/es/politica-cookies',
  '/es/politica-cookies': '/cookie-policy'
};

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