// SINGLE SOURCE OF TRUTH for the site's static routes.
//
// Consumed by:
//   - server/utils/html-injection.ts  (KNOWN_ROUTES for bot-body injection / 410 handling)
//   - server/routes/sitemap.ts        (sitemap.xml static entries with hreflang)
//   - client/src/utils/urlMapping.ts  (EN <-> ES language switching)
//
// Blog routes beyond the two index pages are dynamic (database-driven) and are
// handled separately by the blog storage layer; they do NOT belong here.
//
// Pure data module: no imports, safe for both client and server bundles.

export interface BilingualRouteEntry {
  /** English path (canonical form, no trailing slash except '/'). */
  en: string;
  /** Spanish path. */
  es: string;
  /** Sitemap changefreq (only used when inSitemap is true). */
  changefreq: 'weekly' | 'monthly' | 'yearly';
  /** Sitemap priority (only used when inSitemap is true). */
  priority: string;
  /**
   * Whether the pair is listed in the static part of sitemap.xml.
   * Blog index pages are added dynamically by sitemap.ts (inSitemap: false here).
   * California pages are noindex and must NEVER be in the sitemap.
   */
  inSitemap: boolean;
  /** Pages served with noindex meta (California landings pending license verification). */
  noindex?: boolean;
  /**
   * false = the pair exists only for language-switch mapping; there is no real
   * route registered in client/src/App.tsx (e.g. '/locations'). Excluded from
   * KNOWN_ROUTES so the server keeps returning 404 for it.
   */
  routed?: boolean;
}

/**
 * Ordered list of bilingual page pairs. The order of `inSitemap` entries
 * defines the order of static URLs in sitemap.xml — do not reorder casually.
 */
export const ROUTE_MANIFEST: readonly BilingualRouteEntry[] = [
  // ---- Main pages -------------------------------------------------------
  { en: '/', es: '/es', changefreq: 'weekly', priority: '1.0', inSitemap: true, routed: true },
  { en: '/about', es: '/es/acerca-de', changefreq: 'monthly', priority: '0.8', inSitemap: true, routed: true },
  { en: '/contact', es: '/es/contacto', changefreq: 'monthly', priority: '0.8', inSitemap: true, routed: true },
  { en: '/for-patients', es: '/es/para-pacientes', changefreq: 'monthly', priority: '0.6', inSitemap: true, routed: true },
  { en: '/telepsychiatry-florida', es: '/es/telepsiquiatria-florida', changefreq: 'monthly', priority: '0.8', inSitemap: true, routed: true },
  { en: '/services', es: '/es/servicios', changefreq: 'monthly', priority: '0.8', inSitemap: true, routed: true },

  // ---- Individual service pages -----------------------------------------
  { en: '/services/anxiety-treatment', es: '/es/servicios/tratamiento-ansiedad', changefreq: 'monthly', priority: '0.7', inSitemap: true, routed: true },
  { en: '/services/depression-treatment', es: '/es/servicios/tratamiento-depresion', changefreq: 'monthly', priority: '0.7', inSitemap: true, routed: true },
  { en: '/services/adhd-treatment', es: '/es/servicios/tratamiento-adhd', changefreq: 'monthly', priority: '0.7', inSitemap: true, routed: true },
  { en: '/services/ptsd-treatment', es: '/es/servicios/tratamiento-tept', changefreq: 'monthly', priority: '0.7', inSitemap: true, routed: true },
  { en: '/services/bipolar-treatment', es: '/es/servicios/tratamiento-bipolar', changefreq: 'monthly', priority: '0.7', inSitemap: true, routed: true },
  { en: '/services/medication-management', es: '/es/servicios/manejo-medicamentos', changefreq: 'monthly', priority: '0.7', inSitemap: true, routed: true },

  // ---- Location pages (critical for local SEO) ---------------------------
  { en: '/locations/psychiatrist-naples', es: '/es/ubicaciones/psiquiatra-naples', changefreq: 'monthly', priority: '0.6', inSitemap: true, routed: true },
  { en: '/locations/psychiatrist-bonita-springs', es: '/es/ubicaciones/psiquiatra-bonita-springs', changefreq: 'monthly', priority: '0.6', inSitemap: true, routed: true },
  { en: '/locations/psychiatrist-marco-island', es: '/es/ubicaciones/psiquiatra-marco-island', changefreq: 'monthly', priority: '0.6', inSitemap: true, routed: true },
  { en: '/locations/psychiatrist-fort-myers', es: '/es/ubicaciones/psiquiatra-fort-myers', changefreq: 'monthly', priority: '0.6', inSitemap: true, routed: true },
  { en: '/locations/psychiatrist-ave-maria', es: '/es/ubicaciones/psiquiatra-ave-maria', changefreq: 'monthly', priority: '0.6', inSitemap: true, routed: true },
  { en: '/locations/psychiatrist-estero', es: '/es/ubicaciones/psiquiatra-estero', changefreq: 'monthly', priority: '0.6', inSitemap: true, routed: true },
  { en: '/locations/psychiatrist-golden-gate', es: '/es/ubicaciones/psiquiatra-golden-gate', changefreq: 'monthly', priority: '0.6', inSitemap: true, routed: true },
  { en: '/locations/psychiatrist-immokalee', es: '/es/ubicaciones/psiquiatra-immokalee', changefreq: 'monthly', priority: '0.6', inSitemap: true, routed: true },
  { en: '/locations/psychiatrist-lely-resort', es: '/es/ubicaciones/psiquiatra-lely-resort', changefreq: 'monthly', priority: '0.6', inSitemap: true, routed: true },
  { en: '/locations/psychiatrist-vanderbilt-beach', es: '/es/ubicaciones/psiquiatra-vanderbilt-beach', changefreq: 'monthly', priority: '0.6', inSitemap: true, routed: true },

  // ---- Legal / compliance pages ------------------------------------------
  { en: '/privacy-policy', es: '/es/politica-privacidad', changefreq: 'yearly', priority: '0.3', inSitemap: true, routed: true },
  { en: '/terms-of-service', es: '/es/terminos-servicio', changefreq: 'yearly', priority: '0.3', inSitemap: true, routed: true },
  { en: '/hipaa-notice', es: '/es/aviso-hipaa', changefreq: 'yearly', priority: '0.3', inSitemap: true, routed: true },
  { en: '/cookie-policy', es: '/es/politica-cookies', changefreq: 'yearly', priority: '0.3', inSitemap: true, routed: true },
  { en: '/cancellation-policy', es: '/es/politica-cancelacion', changefreq: 'yearly', priority: '0.3', inSitemap: true, routed: true },
  { en: '/billing-policy', es: '/es/politica-facturacion', changefreq: 'yearly', priority: '0.3', inSitemap: true, routed: true },
  { en: '/emergency-policy', es: '/es/politica-emergencias', changefreq: 'yearly', priority: '0.3', inSitemap: true, routed: true },
  { en: '/patient-rights', es: '/es/derechos-paciente', changefreq: 'yearly', priority: '0.3', inSitemap: true, routed: true },
  { en: '/telehealth-consent', es: '/es/consentimiento-telesalud', changefreq: 'yearly', priority: '0.3', inSitemap: true, routed: true },
  { en: '/no-surprises-act', es: '/es/ley-sin-sorpresas', changefreq: 'yearly', priority: '0.3', inSitemap: true, routed: true },
  { en: '/accessibility-statement', es: '/es/declaracion-accesibilidad', changefreq: 'yearly', priority: '0.3', inSitemap: true, routed: true },
  { en: '/nondiscrimination-notice', es: '/es/aviso-no-discriminacion', changefreq: 'yearly', priority: '0.3', inSitemap: true, routed: true },
  { en: '/communications-policy', es: '/es/politica-comunicaciones', changefreq: 'yearly', priority: '0.3', inSitemap: true, routed: true },
  { en: '/medical-disclaimer', es: '/es/descargo-responsabilidad-medica', changefreq: 'yearly', priority: '0.3', inSitemap: true, routed: true },

  // ---- Routed but NOT in the static sitemap --------------------------------
  // Blog index pages: sitemap.ts adds them dynamically together with posts.
  { en: '/blog', es: '/es/blog', changefreq: 'weekly', priority: '0.7', inSitemap: false, routed: true },
  // California landings: noindex until Jordan verifies the MBC license.
  // They must NEVER appear in the sitemap while noindex is true.
  { en: '/psychiatrist-california', es: '/es/psiquiatra-california', changefreq: 'monthly', priority: '0.5', inSitemap: false, noindex: true, routed: true },

  // ---- Mapping-only pairs (no real route in App.tsx) -----------------------
  // Kept for language-switch behavior parity; excluded from KNOWN_ROUTES.
  { en: '/locations', es: '/es/ubicaciones', changefreq: 'monthly', priority: '0.5', inSitemap: false, routed: false },
];

/** Routed paths that exist in one language only (never in sitemap, never mapped). */
export const SINGLE_LANGUAGE_ROUTES: readonly string[] = [
  '/admin/login',
  '/admin/blog',
];

/** Static sitemap entries, in output order. */
export function getSitemapEntries(): BilingualRouteEntry[] {
  return ROUTE_MANIFEST.filter(entry => entry.inSitemap);
}

/** Every real (routed) static path the server should recognize, EN + ES. */
export function getKnownRoutePaths(): string[] {
  const paths: string[] = [];
  for (const entry of ROUTE_MANIFEST) {
    if (entry.routed === false) continue;
    paths.push(entry.en, entry.es);
  }
  paths.push(...SINGLE_LANGUAGE_ROUTES);
  return paths;
}

// ---- Per-route indexing signals -------------------------------------------
// The server injects the authoritative robots meta per URL in the initial HTML
// (server/utils/html-injection.ts). The client reuses these values to keep the
// tag correct during SPA navigation, where the server has no say.

/** robots value for pages that should be indexed. */
export const INDEXABLE_ROBOTS =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
/** robots value for noindex pages that still allow link following (ad landings). */
export const NOINDEX_FOLLOW_ROBOTS = 'noindex, follow';
/** robots value for private areas. */
export const NOINDEX_NOFOLLOW_ROBOTS = 'noindex, nofollow';

/** Canonical form of a path: no query, no hash, no trailing slash (except '/'). */
export function normalizeRoutePath(path: string): string {
  const withoutQuery = (path || '/').split('#')[0].split('?')[0];
  if (withoutQuery.length > 1 && withoutQuery.endsWith('/')) {
    return withoutQuery.slice(0, -1);
  }
  return withoutQuery || '/';
}

/**
 * robots policy for a path, or `null` when the path is not one we control.
 * Returning `null` matters: callers must then leave any existing robots tag
 * untouched instead of guessing a page is indexable.
 */
export function getRobotsPolicy(path: string): string | null {
  const normalized = normalizeRoutePath(path);

  if (normalized === '/admin' || normalized.startsWith('/admin/')) {
    return NOINDEX_NOFOLLOW_ROBOTS;
  }

  for (const entry of ROUTE_MANIFEST) {
    if (entry.en === normalized || entry.es === normalized) {
      return entry.noindex ? NOINDEX_FOLLOW_ROBOTS : INDEXABLE_ROBOTS;
    }
  }

  // Published blog posts are dynamic routes and always indexable.
  if (normalized.startsWith('/blog/') || normalized.startsWith('/es/blog/')) {
    return INDEXABLE_ROBOTS;
  }

  return null;
}

/** Bidirectional EN <-> ES map for language switching (includes mapping-only pairs). */
export function getBilingualUrlMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const entry of ROUTE_MANIFEST) {
    map[entry.en] = entry.es;
    map[entry.es] = entry.en;
  }
  return map;
}
