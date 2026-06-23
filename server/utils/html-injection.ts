import { Request } from 'express';
import { cityHyperlocal, type Lang } from '@/data/locationHyperlocal';
import { getSeoSiteConfig } from '../seo/config';

interface MetaTag {
  name?: string;
  property?: string;
  content?: string;
  rel?: string;
  href?: string;
  hreflang?: string;
}

interface PageMeta {
  title?: string;
  description?: string;
  canonical?: string;
  schema?: object;
  schemas?: object[];
  metaTags?: MetaTag[];
}

// Detect non-rendering crawlers / bots (search engines, AI crawlers, social
// scrapers). Only these receive the static text-only body inside #root, so
// human visitors never see the unstyled pre-render flash before React mounts.
// Googlebot/Bingbot render JS and still get the full React app; the static
// fallback mainly serves engines that don't execute JavaScript.
const CRAWLER_UA_REGEX = new RegExp(
  [
    'bot', 'crawl', 'spider', 'slurp',
    'googlebot', 'bingbot', 'duckduckbot', 'yandex', 'baiduspider',
    'gptbot', 'oai-searchbot', 'chatgpt-user', 'claudebot', 'claude-web',
    'anthropic-ai', 'perplexitybot', 'google-extended', 'ccbot', 'applebot',
    'bytespider', 'amazonbot', 'facebookexternalhit', 'facebot',
    'twitterbot', 'linkedinbot', 'pinterest', 'redditbot', 'whatsapp',
    'telegrambot', 'discordbot', 'embedly', 'quora link preview',
    'mediapartners-google', 'adsbot-google', 'apis-google',
  ].join('|'),
  'i'
);

function isCrawlerRequest(req: Request): boolean {
  const ua = req.get('user-agent') || '';
  if (!ua) return false;
  return CRAWLER_UA_REGEX.test(ua);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ── Satellite location registry ──────────────────────────────────────────────
// Single source of truth tying each non-Naples location route to its hyperlocal
// content (client/src/data/locationHyperlocal.ts) so server-side metadata and the
// pre-rendered crawler body stay in sync with the React pages. Naples is the main
// office and keeps its own bespoke entries in the switch statements below.
interface SatelliteCity {
  key: string;        // cityHyperlocal key
  enSlug: string;     // path segment after /locations/
  esSlug: string;     // path segment after /es/ubicaciones/
  cityName: string;   // display + areaServed name
}

const SATELLITE_CITIES: SatelliteCity[] = [
  { key: 'bonitaSprings',   enSlug: 'psychiatrist-bonita-springs',   esSlug: 'psiquiatra-bonita-springs',   cityName: 'Bonita Springs' },
  { key: 'marcoIsland',     enSlug: 'psychiatrist-marco-island',     esSlug: 'psiquiatra-marco-island',     cityName: 'Marco Island' },
  { key: 'fortMyers',       enSlug: 'psychiatrist-fort-myers',       esSlug: 'psiquiatra-fort-myers',       cityName: 'Fort Myers' },
  { key: 'aveMaria',        enSlug: 'psychiatrist-ave-maria',        esSlug: 'psiquiatra-ave-maria',        cityName: 'Ave Maria' },
  { key: 'estero',          enSlug: 'psychiatrist-estero',           esSlug: 'psiquiatra-estero',           cityName: 'Estero' },
  { key: 'goldenGate',      enSlug: 'psychiatrist-golden-gate',      esSlug: 'psiquiatra-golden-gate',      cityName: 'Golden Gate' },
  { key: 'immokalee',       enSlug: 'psychiatrist-immokalee',        esSlug: 'psiquiatra-immokalee',        cityName: 'Immokalee' },
  { key: 'lelyResorts',     enSlug: 'psychiatrist-lely-resort',      esSlug: 'psiquiatra-lely-resort',      cityName: 'Lely Resort' },
  { key: 'vanderbiltBeach', enSlug: 'psychiatrist-vanderbilt-beach', esSlug: 'psiquiatra-vanderbilt-beach', cityName: 'Vanderbilt Beach' },
];

const SATELLITE_BY_PATH: Record<string, { city: SatelliteCity; lang: Lang }> = (() => {
  const index: Record<string, { city: SatelliteCity; lang: Lang }> = {};
  for (const city of SATELLITE_CITIES) {
    index[`/locations/${city.enSlug}`] = { city, lang: 'en' };
    index[`/es/ubicaciones/${city.esSlug}`] = { city, lang: 'es' };
  }
  return index;
})();

// Per-route PageMeta for a satellite city, sourced from its hyperlocal SEO copy
// so titles/descriptions are city-specific instead of boilerplate.
function getLocationPageMeta(baseUrl: string, city: SatelliteCity, lang: Lang): PageMeta {
  const data = cityHyperlocal[city.key];
  const enUrl = `${baseUrl}/locations/${city.enSlug}`;
  const esUrl = `${baseUrl}/es/ubicaciones/${city.esSlug}`;
  const canonical = lang === 'es' ? esUrl : enUrl;
  const locationPath = lang === 'es'
    ? `/es/ubicaciones/${city.esSlug}`
    : `/locations/${city.enSlug}`;
  return {
    canonical,
    schema: getServiceSchema(baseUrl, city.cityName, lang, locationPath),
    metaTags: [
      { name: 'description', content: data.seo.description[lang] },
      { property: 'og:title', content: data.seo.title[lang] },
      { property: 'og:description', content: data.seo.description[lang] },
      { property: 'og:url', content: canonical },
      { rel: 'alternate', hreflang: 'en', href: enUrl },
      { rel: 'alternate', hreflang: 'es', href: esUrl },
    ],
  };
}

// Pre-rendered crawler body for a satellite city, built from hyperlocal copy so
// JS-disabled crawlers and AI bots see real, city-specific content.
function buildLocationBody(
  city: SatelliteCity,
  lang: Lang,
  links: { contactInfo: string; serviceLinks: string; locationLinks: string },
): string {
  const data = cityHyperlocal[city.key];
  const isEs = lang === 'es';
  const home = isEs ? '/es' : '/';
  const altPath = isEs ? `/locations/${city.enSlug}` : `/es/ubicaciones/${city.esSlug}`;
  const contactPath = isEs ? '/es/contacto' : '/contact';
  const aboutPath = isEs ? '/es/acerca-de' : '/about';
  const neighborhoods = data.neighborhoods[lang]
    .map(n => `<li>${escapeHtml(n)}</li>`)
    .join('\n      ');

  const t = isEs
    ? {
        h1: `Psiquiatra para ${city.cityName}, FL — Dra. Melva Reve`,
        localHeading: `Atención Local en ${city.cityName}`,
        neighborhoodsHeading: 'Vecindarios que Atendemos',
        servicesNav: 'Servicios',
        areasNav: 'Otras Áreas',
        quickNav: 'Enlaces Rápidos',
        schedule: 'Programar Cita',
        about: 'Sobre la Dra. Melva Reve',
        altLabel: 'English',
      }
    : {
        h1: `Psychiatrist for ${city.cityName}, FL — Dr. Melva Reve`,
        localHeading: `Local Care in ${city.cityName}`,
        neighborhoodsHeading: 'Neighborhoods We Serve',
        servicesNav: 'Services',
        areasNav: 'Nearby Areas',
        quickNav: 'Quick Links',
        schedule: 'Schedule Appointment',
        about: 'About Dr. Melva Reve',
        altLabel: 'Español',
      };

  return `<main>
  <header><a href="${home}">Healing Minds Psychiatry</a></header>
  <section>
    <h1>${escapeHtml(t.h1)}</h1>
    <p>${escapeHtml(data.heroDescription[lang])}</p>
    <p>${escapeHtml(data.healingParagraph[lang])}</p>
    ${links.contactInfo}
  </section>
  <section>
    <h2>${escapeHtml(t.localHeading)}</h2>
    <p>${escapeHtml(data.localContext[lang])}</p>
    <h3>${escapeHtml(t.neighborhoodsHeading)}</h3>
    <ul>
      ${neighborhoods}
    </ul>
    <p>${escapeHtml(data.routeIntro[lang])}</p>
  </section>
  <nav aria-label="${escapeHtml(t.servicesNav)}">${links.serviceLinks}</nav>
  <nav aria-label="${escapeHtml(t.areasNav)}">${links.locationLinks}</nav>
  <nav aria-label="${escapeHtml(t.quickNav)}"><ul>
    <li><a href="${contactPath}">${escapeHtml(t.schedule)}</a></li>
    <li><a href="${aboutPath}">${escapeHtml(t.about)}</a></li>
    <li><a href="${altPath}">${escapeHtml(t.altLabel)}</a></li>
  </ul></nav>
</main>`;
}

function buildMetaTagString(tag: MetaTag): string {
  if (tag.rel && tag.href) {
    if (tag.hreflang) {
      return `<link rel="${tag.rel}" hreflang="${tag.hreflang}" href="${tag.href}" />`;
    }
    return `<link rel="${tag.rel}" href="${tag.href}" />`;
  }
  if (tag.name && tag.content !== undefined) {
    return `<meta name="${tag.name}" content="${escapeHtml(tag.content)}" />`;
  }
  if (tag.property && tag.content !== undefined) {
    return `<meta property="${tag.property}" content="${escapeHtml(tag.content)}" />`;
  }
  return '';
}

/**
 * Replace an existing <meta name|property="..."> tag if present, otherwise insert before </head>.
 * For <link rel="alternate" hreflang="..."> we never deduplicate by rel only (multiple allowed);
 * we replace only when the same hreflang+rel combo already exists.
 */
function upsertMetaTag(html: string, tag: MetaTag): string {
  const tagStr = `    ${buildMetaTagString(tag)}`;
  if (!tagStr.trim()) return html;

  if (tag.name) {
    const regex = new RegExp(`<meta\\s+name=["']${escapeRegex(tag.name)}["'][^>]*>`, 'i');
    if (regex.test(html)) return html.replace(regex, tagStr.trim());
  } else if (tag.property) {
    const regex = new RegExp(`<meta\\s+property=["']${escapeRegex(tag.property)}["'][^>]*>`, 'i');
    if (regex.test(html)) return html.replace(regex, tagStr.trim());
  } else if (tag.rel === 'alternate' && tag.hreflang) {
    const regex = new RegExp(
      `<link\\s+rel=["']alternate["']\\s+hreflang=["']${escapeRegex(tag.hreflang)}["'][^>]*>`,
      'i'
    );
    if (regex.test(html)) return html.replace(regex, tagStr.trim());
  } else if (tag.rel) {
    const regex = new RegExp(`<link\\s+rel=["']${escapeRegex(tag.rel)}["'][^>]*>`, 'i');
    if (regex.test(html)) return html.replace(regex, tagStr.trim());
  }

  return html.replace('</head>', `${tagStr}\n  </head>`);
}

/**
 * CRÍTICO: HTML Injection para meta tags server-side
 * Esta función inyecta meta tags específicos por ruta ANTES de enviar HTML al cliente
 * Compatible con desarrollo (Vite) y producción (static files)
 * 
 * ARQUITECTURA:
 * - Desarrollo: Intercepta HTML transformado por Vite
 * - Producción: Intercepta HTML estático servido por Express
 * - Ambos casos: Inyecta canonical tags y schema JSON-LD antes de envío al cliente
 */
export function injectMetaTags(html: string, req: Request): string {
  const url = req.originalUrl;
  const baseUrl = getSeoSiteConfig().siteBaseUrl;
  
  // Define page-specific meta data
  const pageMetaData = getPageMetaData(url, baseUrl);
  
  if (!pageMetaData) {
    return html; // No changes for unknown routes
  }
  
  let modifiedHtml = html;

  // 0) Rewrite language signals per route so non-JS crawlers and social bots
  //    read the correct locale from the INITIAL HTML. The shared shell defaults
  //    to English (lang="en", og:locale="en_US"); Spanish routes override to es.
  const pathOnly = url.split('?')[0].split('#')[0];
  const isSpanish = pathOnly === '/es' || pathOnly.startsWith('/es/');
  modifiedHtml = modifiedHtml.replace(
    /<html\s+lang="[^"]*">/i,
    `<html lang="${isSpanish ? 'es' : 'en'}">`
  );
  modifiedHtml = upsertMetaTag(modifiedHtml, {
    property: 'og:locale',
    content: isSpanish ? 'es_US' : 'en_US',
  });
  modifiedHtml = upsertMetaTag(modifiedHtml, {
    property: 'og:locale:alternate',
    content: isSpanish ? 'en_US' : 'es_US',
  });

  // 1) Replace <title> per-route. If no explicit title is defined,
  //    derive it from og:title in the metaTags array (every route already declares one).
  let titleToUse = pageMetaData.title;
  if (!titleToUse && pageMetaData.metaTags) {
    const ogTitle = pageMetaData.metaTags.find(t => t.property === 'og:title');
    if (ogTitle?.content) titleToUse = ogTitle.content;
  }
  if (titleToUse) {
    modifiedHtml = modifiedHtml.replace(
      /<title>[\s\S]*?<\/title>/,
      `<title>${escapeHtml(titleToUse)}</title>`
    );
  }

  // 2) Replace <meta name="description"> per-route (also covers description
  //    when only declared as a top-level field, not inside metaTags).
  if (pageMetaData.description) {
    modifiedHtml = upsertMetaTag(modifiedHtml, {
      name: 'description',
      content: pageMetaData.description,
    });
  }

  // 3) Inject canonical tag (append; index.html does not include one).
  if (pageMetaData.canonical) {
    const canonicalTag = `    <link rel="canonical" href="${pageMetaData.canonical}" />`;
    modifiedHtml = modifiedHtml.replace('</head>', `${canonicalTag}\n  </head>`);
  }

  // 4) Inject JSON-LD schemas. Append all; index.html has none baked in.
  const schemasToInject = pageMetaData.schemas || (pageMetaData.schema ? [pageMetaData.schema] : []);
  if (schemasToInject.length > 0) {
    const schemaTags = schemasToInject
      .map(schema => `    <script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`)
      .join('\n');
    modifiedHtml = modifiedHtml.replace('</head>', `${schemaTags}\n  </head>`);
  }

  // 5) Upsert all per-route meta tags (replace if already present, else insert).
  //    This is what fixes the og:url/og:title/description duplication bug.
  let ogTitle: MetaTag | undefined;
  let ogDescription: MetaTag | undefined;
  if (pageMetaData.metaTags && pageMetaData.metaTags.length > 0) {
    ogTitle = pageMetaData.metaTags.find(t => t.property === 'og:title');
    ogDescription = pageMetaData.metaTags.find(t => t.property === 'og:description');

    for (const tag of pageMetaData.metaTags) {
      modifiedHtml = upsertMetaTag(modifiedHtml, tag);
    }
  }

  // 6) Guarantee a COMPLETE social card on every route, even when a route
  //    definition omits og:description / og:image. Social crawlers do not run
  //    client JS, so the initial HTML must carry route-specific previews instead
  //    of falling back to the homepage copy + favicon from the shared shell.

  // 6a) og:description + twitter:description fall back to the route description
  //     (then og:title) when the route declares no explicit og:description.
  //     The route description may live either as the top-level field or as a
  //     metaTags entry (name="description"); check both before the title.
  const routeDescription =
    pageMetaData.description ||
    pageMetaData.metaTags?.find(t => t.name === 'description')?.content;
  const effectiveDescription =
    ogDescription?.content || routeDescription || ogTitle?.content;
  if (effectiveDescription) {
    modifiedHtml = upsertMetaTag(modifiedHtml, {
      property: 'og:description',
      content: effectiveDescription,
    });
    modifiedHtml = upsertMetaTag(modifiedHtml, {
      name: 'twitter:description',
      content: effectiveDescription,
    });
  }

  // 6b) twitter:title mirrors og:title (or the page <title>) per route.
  const effectiveTitle = ogTitle?.content || titleToUse;
  if (effectiveTitle) {
    modifiedHtml = upsertMetaTag(modifiedHtml, {
      name: 'twitter:title',
      content: effectiveTitle,
    });
  }

  // 6c) Branded 1200x630 share image + large summary card, replacing the
  //     favicon-based preview from the shell. A route may still ship its own
  //     og:image (handled in the loop above); we only inject the default when
  //     none was provided.
  const hasRouteImage = pageMetaData.metaTags?.some(t => t.property === 'og:image');
  if (!hasRouteImage) {
    const shareImage = `${baseUrl}/og-image.png`;
    const shareImageAlt =
      'Healing Minds Psychiatry - Dr. Melva Reve, expert psychiatric care in Naples, FL';
    modifiedHtml = upsertMetaTag(modifiedHtml, { property: 'og:image', content: shareImage });
    modifiedHtml = upsertMetaTag(modifiedHtml, { property: 'og:image:alt', content: shareImageAlt });
    modifiedHtml = upsertMetaTag(modifiedHtml, { property: 'og:image:width', content: '1200' });
    modifiedHtml = upsertMetaTag(modifiedHtml, { property: 'og:image:height', content: '630' });
    modifiedHtml = upsertMetaTag(modifiedHtml, { name: 'twitter:image', content: shareImage });
    modifiedHtml = upsertMetaTag(modifiedHtml, { name: 'twitter:image:alt', content: shareImageAlt });
  }
  modifiedHtml = upsertMetaTag(modifiedHtml, {
    name: 'twitter:card',
    content: 'summary_large_image',
  });

  // 7) Inject static pre-render body content into #root for non-rendering crawlers
  //    ONLY. Human visitors get an empty #root so React mounts cleanly with no
  //    flash of the unstyled text-only fallback. JS-disabled crawlers and AI bots
  //    (GPTBot, ClaudeBot, etc.) still see real H1 + description + internal links.
  if (isCrawlerRequest(req)) {
    const staticBody = getStaticPageBody(pathOnly, baseUrl);
    if (staticBody) {
      modifiedHtml = modifiedHtml.replace(
        '<div id="root"></div>',
        `<div id="root">${staticBody}</div>`
      );
    }
  }

  return modifiedHtml;
}

/**
 * Authoritative allowlist of routes the SPA actually renders.
 * Must stay in sync with the <Route> entries in client/src/App.tsx.
 * This is the source of truth for 404 vs. 200 decisions and is intentionally
 * decoupled from the metadata switch (which can lag behind the routes table).
 */
const KNOWN_ROUTES: ReadonlySet<string> = new Set([
  // English
  '/',
  '/about',
  '/contact',
  '/for-patients',
  '/services',
  '/services/anxiety-treatment',
  '/services/depression-treatment',
  '/services/adhd-treatment',
  '/services/ptsd-treatment',
  '/services/bipolar-treatment',
  '/services/medication-management',
  '/telepsychiatry-florida',
  '/locations/psychiatrist-naples',
  '/locations/psychiatrist-bonita-springs',
  '/locations/psychiatrist-marco-island',
  '/locations/psychiatrist-estero',
  '/locations/psychiatrist-fort-myers',
  '/locations/psychiatrist-ave-maria',
  '/locations/psychiatrist-golden-gate',
  '/locations/psychiatrist-immokalee',
  '/locations/psychiatrist-lely-resort',
  '/locations/psychiatrist-vanderbilt-beach',
  '/privacy-policy',
  '/terms-of-service',
  '/hipaa-notice',
  '/cookie-policy',
  '/cancellation-policy',
  '/billing-policy',
  '/emergency-policy',
  '/patient-rights',
  // Spanish
  '/es',
  '/es/acerca-de',
  '/es/contacto',
  '/es/para-pacientes',
  '/es/servicios',
  '/es/servicios/tratamiento-ansiedad',
  '/es/servicios/tratamiento-depresion',
  '/es/servicios/tratamiento-adhd',
  '/es/servicios/tratamiento-tept',
  '/es/servicios/tratamiento-bipolar',
  '/es/servicios/manejo-medicamentos',
  '/es/telepsiquiatria-florida',
  '/es/ubicaciones/psiquiatra-naples',
  '/es/ubicaciones/psiquiatra-bonita-springs',
  '/es/ubicaciones/psiquiatra-marco-island',
  '/es/ubicaciones/psiquiatra-estero',
  '/es/ubicaciones/psiquiatra-fort-myers',
  '/es/ubicaciones/psiquiatra-ave-maria',
  '/es/ubicaciones/psiquiatra-golden-gate',
  '/es/ubicaciones/psiquiatra-immokalee',
  '/es/ubicaciones/psiquiatra-lely-resort',
  '/es/ubicaciones/psiquiatra-marco-island',
  '/es/ubicaciones/psiquiatra-vanderbilt-beach',
  '/es/politica-privacidad',
  '/es/terminos-servicio',
  '/es/aviso-hipaa',
  '/es/politica-cookies',
  '/es/politica-cancelacion',
  '/es/politica-facturacion',
  '/es/politica-emergencias',
  '/es/derechos-paciente',
]);

/**
 * Returns true when the given URL path corresponds to a real route we serve.
 * Accepts either a bare path ("/about") or a full URL with query/hash; everything
 * after "?" or "#" is ignored, and a single trailing slash is tolerated so that
 * "/about/" still resolves to true (it will be 301-normalized separately).
 */
export function isKnownRoute(urlOrPath: string): boolean {
  if (!urlOrPath) return false;
  // Strip query string and hash before lookup.
  let path = urlOrPath.split('?')[0].split('#')[0];
  // Tolerate one trailing slash (real normalization happens via 301 redirect).
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  return KNOWN_ROUTES.has(path);
}

/**
 * Define meta data specific to each route
 */
function getPageMetaData(url: string, baseUrl: string): PageMeta | null {
  // Normalize URL for matching: strip query string and hash, then a single
  // trailing slash so "/about?utm=x" and "/about/" both resolve to "/about".
  const pathOnly = url.split('?')[0].split('#')[0];
  const normalizedUrl = pathOnly.replace(/\/$/, '') || '/';

  // Satellite location routes are generated from hyperlocal data so their titles,
  // descriptions and Service schema stay city-specific and language-aware.
  const satellite = SATELLITE_BY_PATH[normalizedUrl];
  if (satellite) {
    return getLocationPageMeta(baseUrl, satellite.city, satellite.lang);
  }

  switch (normalizedUrl) {
    // Homepage
    case '/':
      return {
        canonical: `${baseUrl}/`,
        schemas: [
          getMedicalBusinessSchema(baseUrl),
          getFAQPageSchema(baseUrl),
          getBreadcrumbListSchema(baseUrl, normalizedUrl)
        ],
        metaTags: [
          {
            name: 'description',
            content: 'Dr. Melva Reve - Expert psychiatrist in Naples, FL. Expert treatment for anxiety, depression, ADHD, PTSD. Bilingual care in English & Spanish. Call (239) 423-0272.'
          },
          {
            property: 'og:title',
            content: 'Dr. Melva Reve - Psychiatrist Naples FL | Healing Minds Psychiatry'
          },
          {
            property: 'og:description',
            content: 'Expert psychiatrist in Naples, FL. Expert treatment for anxiety, depression, ADHD, PTSD. Bilingual care available.'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/`
          },
          // HREFLANG CRITICAL: Homepage bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es`
          },
          {
            rel: 'alternate',
            hreflang: 'x-default',
            href: `${baseUrl}/`
          }
        ]
      };

    // About page
    case '/about':
      return {
        canonical: `${baseUrl}/about`,
        metaTags: [
          {
            name: 'description',
            content: 'Meet Dr. Melva Reve, expert psychiatrist in Naples, FL. University of Miami trained, fluent in English & Spanish. Expert in anxiety, depression, ADHD treatment.'
          },
          {
            property: 'og:title',
            content: 'About Dr. Melva Reve - Psychiatrist Naples FL | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/about`
          },
          // HREFLANG: About bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/about`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/acerca-de`
          }
        ]
      };

    // Contact page
    case '/contact':
      return {
        canonical: `${baseUrl}/contact`,
        metaTags: [
          {
            name: 'description',
            content: 'Contact Healing Minds Psychiatry in Naples, FL. Schedule appointment with Dr. Melva Reve. Phone (239) 423-0272. 4760 Tamiami Trl N # 25, Naples FL 34103.'
          },
          {
            property: 'og:title',
            content: 'Contact Dr. Melva Reve - Naples FL Psychiatrist | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/contact`
          },
          // HREFLANG: Contact bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/contact`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/contacto`
          }
        ]
      };

    // Services main page
    case '/services':
      return {
        canonical: `${baseUrl}/services`,
        metaTags: [
          {
            name: 'description',
            content: 'Comprehensive psychiatric services in Naples, FL. Dr. Melva Reve treats anxiety, depression, ADHD, PTSD, bipolar disorder with expert medication management.'
          },
          {
            property: 'og:title',
            content: 'Psychiatric Services Naples FL - Dr. Melva Reve | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/services`
          },
          // HREFLANG: Services bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/services`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/servicios`
          }
        ]
      };

    // Service pages
    case '/services/anxiety-treatment':
      return {
        canonical: `${baseUrl}/services/anxiety-treatment`,
        schema: getServiceDetailSchema(baseUrl, 'en', 'anxiety'),
        metaTags: [
          {
            name: 'description',
            content: 'Expert anxiety treatment in Naples, FL. Dr. Melva Reve provides comprehensive anxiety disorder therapy and medication management. Call (239) 423-0272.'
          },
          {
            property: 'og:title',
            content: 'Anxiety Treatment Naples FL - Dr. Melva Reve | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/services/anxiety-treatment`
          },
          // HREFLANG: Anxiety Treatment bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/services/anxiety-treatment`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/servicios/tratamiento-ansiedad`
          }
        ]
      };

    case '/services/depression-treatment':
      return {
        canonical: `${baseUrl}/services/depression-treatment`,
        schema: getServiceDetailSchema(baseUrl, 'en', 'depression'),
        metaTags: [
          {
            name: 'description',
            content: 'Professional depression treatment in Naples, FL. Dr. Melva Reve offers expert depression therapy and medication management. Schedule consultation today.'
          },
          {
            property: 'og:title',
            content: 'Depression Treatment Naples FL - Dr. Melva Reve | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/services/depression-treatment`
          },
          // HREFLANG: Depression Treatment bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/services/depression-treatment`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/servicios/tratamiento-depresion`
          }
        ]
      };

    case '/services/adhd-treatment':
      return {
        canonical: `${baseUrl}/services/adhd-treatment`,
        schema: getServiceDetailSchema(baseUrl, 'en', 'adhd'),
        metaTags: [
          {
            name: 'description',
            content: 'ADHD treatment for adults in Naples, FL. Dr. Melva Reve provides comprehensive ADHD evaluation, therapy and medication management. Call (239) 423-0272.'
          },
          {
            property: 'og:title',
            content: 'ADHD Treatment Adults Naples FL - Dr. Melva Reve | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/services/adhd-treatment`
          },
          // HREFLANG: ADHD Treatment bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/services/adhd-treatment`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/servicios/tratamiento-adhd`
          }
        ]
      };

    case '/services/ptsd-treatment':
      return {
        canonical: `${baseUrl}/services/ptsd-treatment`,
        schema: getServiceDetailSchema(baseUrl, 'en', 'ptsd'),
        metaTags: [
          {
            name: 'description',
            content: 'PTSD treatment in Naples, FL. Dr. Melva Reve provides specialized trauma therapy and PTSD treatment with evidence-based approaches.'
          },
          {
            property: 'og:title',
            content: 'PTSD Treatment Naples FL - Dr. Melva Reve | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/services/ptsd-treatment`
          },
          // HREFLANG: PTSD Treatment bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/services/ptsd-treatment`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/servicios/tratamiento-tept`
          }
        ]
      };

    case '/services/bipolar-treatment':
      return {
        canonical: `${baseUrl}/services/bipolar-treatment`,
        schema: getServiceDetailSchema(baseUrl, 'en', 'bipolar'),
        metaTags: [
          {
            name: 'description',
            content: 'Bipolar disorder treatment in Naples, FL. Dr. Melva Reve offers expert bipolar therapy and mood stabilization with comprehensive care.'
          },
          {
            property: 'og:title',
            content: 'Bipolar Treatment Naples FL - Dr. Melva Reve | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/services/bipolar-treatment`
          },
          // HREFLANG: Bipolar Treatment bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/services/bipolar-treatment`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/servicios/tratamiento-bipolar`
          }
        ]
      };

    case '/services/medication-management':
      return {
        canonical: `${baseUrl}/services/medication-management`,
        schema: getServiceDetailSchema(baseUrl, 'en', 'medication'),
        metaTags: [
          {
            name: 'description',
            content: 'Psychiatric medication management in Naples, FL. Dr. Melva Reve provides expert medication monitoring and optimization for mental health conditions.'
          },
          {
            property: 'og:title',
            content: 'Medication Management Naples FL - Dr. Melva Reve | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/services/medication-management`
          },
          // HREFLANG: Medication Management bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/services/medication-management`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/servicios/manejo-medicamentos`
          }
        ]
      };

    // For Patients page
    case '/for-patients':
      return {
        canonical: `${baseUrl}/for-patients`,
        metaTags: [
          {
            name: 'description',
            content: 'Patient resources and information for Healing Minds Psychiatry. Forms, insurance, appointment scheduling and what to expect during your visit with Dr. Melva Reve.'
          },
          {
            property: 'og:title',
            content: 'For Patients - Healing Minds Psychiatry | Dr. Melva Reve Naples FL'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/for-patients`
          },
          // HREFLANG: For Patients bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/for-patients`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/para-pacientes`
          }
        ]
      };

    case '/locations/psychiatrist-naples':
      return {
        canonical: `${baseUrl}/locations/psychiatrist-naples`,
        schema: getMedicalBusinessSchema(baseUrl),
        metaTags: [
          {
            name: 'description',
            content: 'Visit Dr. Melva Reve in Naples, FL at 4760 Tamiami Trl N # 25. Expert psychiatric care for anxiety, depression, ADHD, PTSD. Call (239) 423-0272 to schedule.'
          },
          {
            name: 'keywords', 
            content: 'psychiatrist Naples FL location, 4760 Tamiami Trail Naples # 25, psychiatric office Naples, Dr Melva Reve address, mental health Naples FL'
          },
          {
            property: 'og:title',
            content: 'Psychiatrist Naples FL - Dr. Melva Reve Location | Healing Minds'
          },
          {
            property: 'og:description',
            content: 'Visit Dr. Melva Reve in Naples, FL at 4760 Tamiami Trl N # 25. Expert psychiatric care for anxiety, depression, ADHD, PTSD.'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/locations/psychiatrist-naples`
          },
          // HREFLANG: Naples bilingual versions (FIXED - Spanish version now exists)
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/locations/psychiatrist-naples`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/ubicaciones/psiquiatra-naples`
          }
        ]
      };

    // Legal pages
    case '/privacy-policy':
      return {
        canonical: `${baseUrl}/privacy-policy`,
        metaTags: [
          {
            name: 'description',
            content: 'Privacy Policy for Healing Minds Psychiatry. Learn how we protect your personal health information and comply with HIPAA regulations.'
          },
          {
            property: 'og:title',
            content: 'Privacy Policy - Healing Minds Psychiatry | Dr. Melva Reve'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/privacy-policy`
          },
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/privacy-policy`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/politica-privacidad`
          }
        ]
      };

    case '/terms-of-service':
      return {
        canonical: `${baseUrl}/terms-of-service`,
        metaTags: [
          {
            name: 'description',
            content: 'Terms of Service for Healing Minds Psychiatry. Understanding the terms and conditions for psychiatric care with Dr. Melva Reve.'
          },
          {
            property: 'og:title',
            content: 'Terms of Service - Healing Minds Psychiatry | Dr. Melva Reve'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/terms-of-service`
          },
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/terms-of-service`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/terminos-servicio`
          }
        ]
      };

    case '/hipaa-notice':
      return {
        canonical: `${baseUrl}/hipaa-notice`,
        metaTags: [
          {
            name: 'description',
            content: 'HIPAA Notice of Privacy Practices for Healing Minds Psychiatry. Your rights regarding protected health information and privacy.'
          },
          {
            property: 'og:title',
            content: 'HIPAA Notice - Healing Minds Psychiatry | Dr. Melva Reve'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/hipaa-notice`
          },
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/hipaa-notice`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/aviso-hipaa`
          }
        ]
      };

    case '/cookie-policy':
      return {
        canonical: `${baseUrl}/cookie-policy`,
        metaTags: [
          {
            name: 'description',
            content: 'Cookie Policy for Healing Minds Psychiatry website. Learn about cookies usage, analytics, and your privacy choices.'
          },
          {
            property: 'og:title',
            content: 'Cookie Policy - Healing Minds Psychiatry | Dr. Melva Reve'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/cookie-policy`
          },
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/cookie-policy`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/politica-cookies`
          }
        ]
      };
      
    // Spanish pages
    case '/es/servicios':
      return {
        canonical: `${baseUrl}/es/servicios`,
        metaTags: [
          {
            name: 'description',
            content: 'Servicios psiquiátricos completos en Naples, FL. La Dra. Melva Reve trata ansiedad, depresión, TDAH, TEPT, trastorno bipolar con manejo experto de medicamentos.'
          },
          {
            property: 'og:title',
            content: 'Servicios Psiquiátricos Naples FL - Dra. Melva Reve | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es/servicios`
          },
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/services`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/servicios`
          }
        ]
      };

    // Spanish service pages
    case '/es/servicios/tratamiento-ansiedad':
      return {
        canonical: `${baseUrl}/es/servicios/tratamiento-ansiedad`,
        schema: getServiceDetailSchema(baseUrl, 'es', 'anxiety'),
        metaTags: [
          {
            name: 'description',
            content: 'Tratamiento experto de ansiedad en Naples, FL. La Dra. Melva Reve proporciona terapia integral de trastornos de ansiedad y manejo de medicamentos.'
          },
          {
            property: 'og:title',
            content: 'Tratamiento Ansiedad Naples FL - Dra. Melva Reve | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es/servicios/tratamiento-ansiedad`
          },
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/services/anxiety-treatment`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/servicios/tratamiento-ansiedad`
          }
        ]
      };

    case '/es/servicios/tratamiento-depresion':
      return {
        canonical: `${baseUrl}/es/servicios/tratamiento-depresion`,
        schema: getServiceDetailSchema(baseUrl, 'es', 'depression'),
        metaTags: [
          {
            name: 'description',
            content: 'Tratamiento profesional de depresión en Naples, FL. La Dra. Melva Reve ofrece terapia experta de depresión y manejo de medicamentos.'
          },
          {
            property: 'og:title',
            content: 'Tratamiento Depresión Naples FL - Dra. Melva Reve | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es/servicios/tratamiento-depresion`
          },
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/services/depression-treatment`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/servicios/tratamiento-depresion`
          }
        ]
      };

    case '/es/servicios/tratamiento-tept':
      return {
        canonical: `${baseUrl}/es/servicios/tratamiento-tept`,
        schema: getServiceDetailSchema(baseUrl, 'es', 'ptsd'),
        metaTags: [
          {
            name: 'description',
            content: 'Tratamiento de TEPT en Naples, FL. La Dra. Melva Reve proporciona terapia especializada de trauma y tratamiento de TEPT con enfoques basados en evidencia.'
          },
          {
            property: 'og:title',
            content: 'Tratamiento TEPT Naples FL - Dra. Melva Reve | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es/servicios/tratamiento-tept`
          },
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/services/ptsd-treatment`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/servicios/tratamiento-tept`
          }
        ]
      };

    case '/es/servicios/tratamiento-bipolar':
      return {
        canonical: `${baseUrl}/es/servicios/tratamiento-bipolar`,
        schema: getServiceDetailSchema(baseUrl, 'es', 'bipolar'),
        metaTags: [
          {
            name: 'description',
            content: 'Tratamiento de trastorno bipolar en Naples, FL. La Dra. Melva Reve ofrece terapia experta bipolar y estabilización del estado de ánimo con atención integral.'
          },
          {
            property: 'og:title',
            content: 'Tratamiento Bipolar Naples FL - Dra. Melva Reve | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es/servicios/tratamiento-bipolar`
          },
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/services/bipolar-treatment`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/servicios/tratamiento-bipolar`
          }
        ]
      };

    case '/es/servicios/manejo-medicamentos':
      return {
        canonical: `${baseUrl}/es/servicios/manejo-medicamentos`,
        schema: getServiceDetailSchema(baseUrl, 'es', 'medication'),
        metaTags: [
          {
            name: 'description',
            content: 'Manejo de medicamentos psiquiátricos en Naples, FL. La Dra. Melva Reve proporciona monitoreo y optimización experta de medicamentos para condiciones de salud mental.'
          },
          {
            property: 'og:title',
            content: 'Manejo Medicamentos Naples FL - Dra. Melva Reve | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es/servicios/manejo-medicamentos`
          },
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/services/medication-management`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/servicios/manejo-medicamentos`
          }
        ]
      };

    // Spanish legal pages
    case '/es/politica-privacidad':
      return {
        canonical: `${baseUrl}/es/politica-privacidad`,
        metaTags: [
          {
            name: 'description',
            content: 'Política de Privacidad para Healing Minds Psychiatry. Aprenda cómo protegemos su información de salud personal y cumplimos con las regulaciones HIPAA.'
          },
          {
            property: 'og:title',
            content: 'Política de Privacidad - Healing Minds Psychiatry | Dra. Melva Reve'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es/politica-privacidad`
          },
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/privacy-policy`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/politica-privacidad`
          }
        ]
      };

    case '/es/terminos-servicio':
      return {
        canonical: `${baseUrl}/es/terminos-servicio`,
        metaTags: [
          {
            name: 'description',
            content: 'Términos de Servicio para Healing Minds Psychiatry. Entendiendo los términos y condiciones para la atención psiquiátrica con la Dra. Melva Reve.'
          },
          {
            property: 'og:title',
            content: 'Términos de Servicio - Healing Minds Psychiatry | Dra. Melva Reve'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es/terminos-servicio`
          },
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/terms-of-service`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/terminos-servicio`
          }
        ]
      };

    case '/es/aviso-hipaa':
      return {
        canonical: `${baseUrl}/es/aviso-hipaa`,
        metaTags: [
          {
            name: 'description',
            content: 'Aviso de Prácticas de Privacidad HIPAA para Healing Minds Psychiatry. Sus derechos con respecto a la información de salud protegida y privacidad.'
          },
          {
            property: 'og:title',
            content: 'Aviso HIPAA - Healing Minds Psychiatry | Dra. Melva Reve'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es/aviso-hipaa`
          },
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/hipaa-notice`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/aviso-hipaa`
          }
        ]
      };

    case '/es/politica-cookies':
      return {
        canonical: `${baseUrl}/es/politica-cookies`,
        metaTags: [
          {
            name: 'description',
            content: 'Política de Cookies para el sitio web de Healing Minds Psychiatry. Aprenda sobre el uso de cookies, análisis y sus opciones de privacidad.'
          },
          {
            property: 'og:title',
            content: 'Política de Cookies - Healing Minds Psychiatry | Dra. Melva Reve'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es/politica-cookies`
          },
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/cookie-policy`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/politica-cookies`
          }
        ]
      };

    // Homepage española
    case '/es':
    case '/es/':
      return {
        canonical: `${baseUrl}/es`,
        schema: getMedicalBusinessSchema(baseUrl),
        metaTags: [
          {
            name: 'description',
            content: 'La psiquiatra certificada Dra. Melva Reve brinda atención psiquiátrica experta en Naples, FL. Especializada en ansiedad, depresión, TDAH y terapia. Servicios de salud mental para el suroeste de Florida.'
          },
          {
            property: 'og:title',
            content: 'Dra. Melva Reve - Psiquiatra Naples FL | Healing Minds Psychiatry'
          },
          {
            property: 'og:description',
            content: 'Psiquiatra certificada en Naples, FL. Tratamiento experto para ansiedad, depresión, TDAH, TEPT. Atención bilingüe disponible.'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es`
          },
          // HREFLANG: Homepage bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es`
          },
          {
            rel: 'alternate',
            hreflang: 'x-default',
            href: `${baseUrl}/`
          }
        ]
      };

    // Acerca de español
    case '/es/acerca-de':
      return {
        canonical: `${baseUrl}/es/acerca-de`,
        metaTags: [
          {
            name: 'description',
            content: 'Conozca a la Dra. Melva Reve, psiquiatra certificada con más de 15 años de experiencia sirviendo Naples, FL. Atención bilingüe con sensibilidad cultural.'
          },
          {
            property: 'og:title',
            content: 'Acerca de la Dra. Melva Reve - Psiquiatra Certificada Naples FL | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es/acerca-de`
          },
          // HREFLANG: About bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/about`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/acerca-de`
          }
        ]
      };

    // Contacto español
    case '/es/contacto':
      return {
        canonical: `${baseUrl}/es/contacto`,
        metaTags: [
          {
            name: 'description',
            content: 'Contacte Healing Minds Psychiatry en Naples, FL para programar su consulta. Llame (239) 423-0272 o envíe un mensaje. Servicios bilingües disponibles.'
          },
          {
            property: 'og:title',
            content: 'Contactar Dra. Melva Reve - Naples FL Psiquiatra | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es/contacto`
          },
          // HREFLANG: Contact bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/contact`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/contacto`
          }
        ]
      };

    // Para Pacientes español
    case '/es/para-pacientes':
      return {
        canonical: `${baseUrl}/es/para-pacientes`,
        metaTags: [
          {
            name: 'description',
            content: 'Información importante para pacientes sobre seguro, citas y atención psiquiátrica en Healing Minds Naples. FAQ y qué esperar.'
          },
          {
            property: 'og:title',
            content: 'Para Pacientes - Healing Minds Psychiatry | Dra. Melva Reve Naples FL'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es/para-pacientes`
          },
          // HREFLANG: For Patients bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/for-patients`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/para-pacientes`
          }
        ]
      };

    // ADHD Treatment español (faltaba esta ruta crítica)
    case '/es/servicios/tratamiento-adhd':
      return {
        canonical: `${baseUrl}/es/servicios/tratamiento-adhd`,
        schema: getServiceDetailSchema(baseUrl, 'es', 'adhd'),
        metaTags: [
          {
            name: 'description',
            content: 'Tratamiento de TDAH para adultos en Naples, FL. La Dra. Melva Reve proporciona evaluación integral de TDAH, terapia y manejo de medicamentos.'
          },
          {
            property: 'og:title',
            content: 'Tratamiento TDAH Adultos Naples FL - Dra. Melva Reve | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es/servicios/tratamiento-adhd`
          },
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/services/adhd-treatment`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/servicios/tratamiento-adhd`
          }
        ]
      };

    // Spanish location pages (CRITICAL - these were missing per Gemini diagnosis)
    case '/es/ubicaciones/psiquiatra-naples':
      return {
        canonical: `${baseUrl}/es/ubicaciones/psiquiatra-naples`,
        schema: getMedicalBusinessSchema(baseUrl),
        metaTags: [
          {
            name: 'description',
            content: 'Visite a la Dra. Melva Reve en Naples, FL en 4760 Tamiami Trl N # 25. Atención psiquiátrica experta para ansiedad, depresión, TDAH, TEPT. Llame (239) 423-0272.'
          },
          {
            property: 'og:title',
            content: 'Psiquiatra Naples FL - Ubicación Dra. Melva Reve | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es/ubicaciones/psiquiatra-naples`
          },
          // HREFLANG: Naples bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/locations/psychiatrist-naples`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/ubicaciones/psiquiatra-naples`
          }
        ]
      };

    // Telepsychiatry (EN + ES)
    case '/telepsychiatry-florida':
      return {
        canonical: `${baseUrl}/telepsychiatry-florida`,
        metaTags: [
          { name: 'description', content: 'Telepsychiatry throughout Florida with Dr. Melva Reve. Secure HIPAA-compliant virtual psychiatric care for anxiety, depression, ADHD and more. Call (239) 423-0272.' },
          { property: 'og:title', content: 'Telepsychiatry in Florida - Dr. Melva Reve | Healing Minds' },
          { property: 'og:description', content: 'Bilingual virtual psychiatric care anywhere in Florida. Same quality as in-person, from the comfort of your home.' },
          { property: 'og:url', content: `${baseUrl}/telepsychiatry-florida` },
          { rel: 'alternate', hreflang: 'en', href: `${baseUrl}/telepsychiatry-florida` },
          { rel: 'alternate', hreflang: 'es', href: `${baseUrl}/es/telepsiquiatria-florida` },
        ],
      };

    case '/es/telepsiquiatria-florida':
      return {
        canonical: `${baseUrl}/es/telepsiquiatria-florida`,
        metaTags: [
          { name: 'description', content: 'Telepsiquiatría en toda Florida con la Dra. Melva Reve. Atención psiquiátrica virtual segura, conforme con HIPAA, para ansiedad, depresión, TDAH y más. Llame (239) 423-0272.' },
          { property: 'og:title', content: 'Telepsiquiatría en Florida - Dra. Melva Reve | Healing Minds' },
          { property: 'og:description', content: 'Atención psiquiátrica virtual bilingüe en cualquier lugar de Florida. La misma calidad que en persona, desde la comodidad de su hogar.' },
          { property: 'og:url', content: `${baseUrl}/es/telepsiquiatria-florida` },
          { rel: 'alternate', hreflang: 'en', href: `${baseUrl}/telepsychiatry-florida` },
          { rel: 'alternate', hreflang: 'es', href: `${baseUrl}/es/telepsiquiatria-florida` },
        ],
      };

    // Legal policy pages (EN)
    case '/billing-policy':
      return {
        canonical: `${baseUrl}/billing-policy`,
        metaTags: [
          { name: 'description', content: 'Billing and payment policy for Healing Minds Psychiatry. Insurance accepted, copayments, self-pay rates, credit card fees and payment plans. Naples, FL.' },
          { property: 'og:title', content: 'Billing and Payment Policy - Healing Minds Psychiatry' },
          { property: 'og:url', content: `${baseUrl}/billing-policy` },
          { rel: 'alternate', hreflang: 'en', href: `${baseUrl}/billing-policy` },
          { rel: 'alternate', hreflang: 'es', href: `${baseUrl}/es/politica-facturacion` },
        ],
      };

    case '/cancellation-policy':
      return {
        canonical: `${baseUrl}/cancellation-policy`,
        metaTags: [
          { name: 'description', content: 'Cancellation and no-show policy for Healing Minds Psychiatry. 24-hour notice required, $50 late fee, medical emergency exceptions. Naples, FL.' },
          { property: 'og:title', content: 'Cancellation and No-Show Policy - Healing Minds Psychiatry' },
          { property: 'og:url', content: `${baseUrl}/cancellation-policy` },
          { rel: 'alternate', hreflang: 'en', href: `${baseUrl}/cancellation-policy` },
          { rel: 'alternate', hreflang: 'es', href: `${baseUrl}/es/politica-cancelacion` },
        ],
      };

    case '/emergency-policy':
      return {
        canonical: `${baseUrl}/emergency-policy`,
        metaTags: [
          { name: 'description', content: 'Emergency and crisis policy for Healing Minds Psychiatry. Not an emergency service. Florida crisis resources: 911, 988 Lifeline, David Lawrence Center.' },
          { property: 'og:title', content: 'Emergency and Crisis Policy - Healing Minds Psychiatry' },
          { property: 'og:url', content: `${baseUrl}/emergency-policy` },
          { rel: 'alternate', hreflang: 'en', href: `${baseUrl}/emergency-policy` },
          { rel: 'alternate', hreflang: 'es', href: `${baseUrl}/es/politica-emergencias` },
        ],
      };

    case '/patient-rights':
      return {
        canonical: `${baseUrl}/patient-rights`,
        metaTags: [
          { name: 'description', content: 'Patient rights and responsibilities at Healing Minds Psychiatry. Florida statutory compliance, confidentiality, informed consent and complaint procedures.' },
          { property: 'og:title', content: 'Patient Rights and Responsibilities - Healing Minds Psychiatry' },
          { property: 'og:url', content: `${baseUrl}/patient-rights` },
          { rel: 'alternate', hreflang: 'en', href: `${baseUrl}/patient-rights` },
          { rel: 'alternate', hreflang: 'es', href: `${baseUrl}/es/derechos-paciente` },
        ],
      };

    // Legal policy pages (ES)
    case '/es/politica-facturacion':
      return {
        canonical: `${baseUrl}/es/politica-facturacion`,
        metaTags: [
          { name: 'description', content: 'Política de facturación y pago de Healing Minds Psychiatry. Seguros aceptados, copagos, tarifas particulares, cargos por tarjeta y planes de pago. Naples, FL.' },
          { property: 'og:title', content: 'Política de Facturación y Pago - Healing Minds Psychiatry' },
          { property: 'og:url', content: `${baseUrl}/es/politica-facturacion` },
          { rel: 'alternate', hreflang: 'en', href: `${baseUrl}/billing-policy` },
          { rel: 'alternate', hreflang: 'es', href: `${baseUrl}/es/politica-facturacion` },
        ],
      };

    case '/es/politica-cancelacion':
      return {
        canonical: `${baseUrl}/es/politica-cancelacion`,
        metaTags: [
          { name: 'description', content: 'Política de cancelación y citas perdidas de Healing Minds Psychiatry. Aviso de 24 horas requerido, cargo de $50, excepciones por emergencia médica. Naples, FL.' },
          { property: 'og:title', content: 'Política de Cancelación y Citas Perdidas - Healing Minds Psychiatry' },
          { property: 'og:url', content: `${baseUrl}/es/politica-cancelacion` },
          { rel: 'alternate', hreflang: 'en', href: `${baseUrl}/cancellation-policy` },
          { rel: 'alternate', hreflang: 'es', href: `${baseUrl}/es/politica-cancelacion` },
        ],
      };

    case '/es/politica-emergencias':
      return {
        canonical: `${baseUrl}/es/politica-emergencias`,
        metaTags: [
          { name: 'description', content: 'Política de emergencias y crisis de Healing Minds Psychiatry. No es un servicio de emergencia. Recursos de crisis en Florida: 911, Línea 988, David Lawrence Center.' },
          { property: 'og:title', content: 'Política de Emergencias y Crisis - Healing Minds Psychiatry' },
          { property: 'og:url', content: `${baseUrl}/es/politica-emergencias` },
          { rel: 'alternate', hreflang: 'en', href: `${baseUrl}/emergency-policy` },
          { rel: 'alternate', hreflang: 'es', href: `${baseUrl}/es/politica-emergencias` },
        ],
      };

    case '/es/derechos-paciente':
      return {
        canonical: `${baseUrl}/es/derechos-paciente`,
        metaTags: [
          { name: 'description', content: 'Derechos y responsabilidades del paciente en Healing Minds Psychiatry. Cumplimiento con leyes de Florida, confidencialidad, consentimiento informado y procedimientos de queja.' },
          { property: 'og:title', content: 'Derechos y Responsabilidades del Paciente - Healing Minds Psychiatry' },
          { property: 'og:url', content: `${baseUrl}/es/derechos-paciente` },
          { rel: 'alternate', hreflang: 'en', href: `${baseUrl}/patient-rights` },
          { rel: 'alternate', hreflang: 'es', href: `${baseUrl}/es/derechos-paciente` },
        ],
      };

    // Add more routes as needed
    default:
      return null;
  }
}

/**
 * Generate Service schema for Hub & Spoke pattern (satellite location pages)
 * Links to main MedicalClinic as provider while targeting specific areas
 */
// Authoritative per-service content for the six treatment-detail routes.
// Used to emit a stable, server-rendered Service schema in the initial HTML
// (so non-rendering AI crawlers see it) with correctly localized labels.
const SERVICE_DETAILS: Record<string, {
  serviceTypeEn: string; serviceTypeEs: string;
  nameEn: string; nameEs: string;
  descEn: string; descEs: string;
  pathEn: string; pathEs: string;
}> = {
  anxiety: {
    serviceTypeEn: 'Anxiety Treatment', serviceTypeEs: 'Tratamiento de Ansiedad',
    nameEn: 'Anxiety Treatment in Naples, FL', nameEs: 'Tratamiento de Ansiedad en Naples, FL',
    descEn: 'Expert psychiatric care for anxiety disorders including panic attacks, social anxiety, and generalized anxiety disorder with evidence-based treatments.',
    descEs: 'Atención psiquiátrica experta para trastornos de ansiedad incluyendo ataques de pánico, ansiedad social y trastorno de ansiedad generalizada con tratamientos basados en evidencia.',
    pathEn: '/services/anxiety-treatment', pathEs: '/es/servicios/tratamiento-ansiedad',
  },
  depression: {
    serviceTypeEn: 'Depression Treatment', serviceTypeEs: 'Tratamiento de Depresión',
    nameEn: 'Depression Treatment in Naples, FL', nameEs: 'Tratamiento de Depresión en Naples, FL',
    descEn: 'Comprehensive psychiatric care for major depression, postpartum depression, and seasonal depression with personalized treatment plans and medication management.',
    descEs: 'Atención psiquiátrica integral para depresión mayor, depresión posparto y depresión estacional con planes de tratamiento personalizados y manejo de medicamentos.',
    pathEn: '/services/depression-treatment', pathEs: '/es/servicios/tratamiento-depresion',
  },
  adhd: {
    serviceTypeEn: 'ADHD Treatment', serviceTypeEs: 'Tratamiento de TDAH',
    nameEn: 'ADHD Treatment in Naples, FL', nameEs: 'Tratamiento de TDAH en Naples, FL',
    descEn: 'Expert ADHD treatment for adults with comprehensive evaluation, medication management, and behavioral strategies to improve focus and daily functioning.',
    descEs: 'Tratamiento experto de TDAH para adultos con evaluación integral, manejo de medicamentos y estrategias conductuales para mejorar el enfoque y funcionamiento diario.',
    pathEn: '/services/adhd-treatment', pathEs: '/es/servicios/tratamiento-adhd',
  },
  ptsd: {
    serviceTypeEn: 'PTSD Treatment', serviceTypeEs: 'Tratamiento de TEPT',
    nameEn: 'PTSD Treatment in Naples, FL', nameEs: 'Tratamiento de TEPT en Naples, FL',
    descEn: 'Trauma-informed psychiatric care for post-traumatic stress disorder using evidence-based treatments to help heal from traumatic experiences.',
    descEs: 'Atención psiquiátrica informada en trauma para trastorno de estrés postraumático usando tratamientos basados en evidencia para ayudar a sanar de experiencias traumáticas.',
    pathEn: '/services/ptsd-treatment', pathEs: '/es/servicios/tratamiento-tept',
  },
  bipolar: {
    serviceTypeEn: 'Bipolar Treatment', serviceTypeEs: 'Tratamiento Bipolar',
    nameEn: 'Bipolar Disorder Treatment in Naples, FL', nameEs: 'Tratamiento de Trastorno Bipolar en Naples, FL',
    descEn: 'Expert psychiatric care for bipolar disorder with mood stabilization, medication management, and comprehensive support for bipolar I, II, and cyclothymia.',
    descEs: 'Atención psiquiátrica experta para trastorno bipolar con estabilización del ánimo, manejo de medicamentos y apoyo integral para bipolar I, II y ciclotimia.',
    pathEn: '/services/bipolar-treatment', pathEs: '/es/servicios/tratamiento-bipolar',
  },
  medication: {
    serviceTypeEn: 'Medication Management', serviceTypeEs: 'Manejo de Medicamentos',
    nameEn: 'Medication Management in Naples, FL', nameEs: 'Manejo de Medicamentos en Naples, FL',
    descEn: 'Expert psychiatric medication evaluation, monitoring, and adjustment with comprehensive safety assessments and personalized treatment plans.',
    descEs: 'Evaluación, monitoreo y ajuste experto de medicamentos psiquiátricos con evaluaciones de seguridad integrales y planes de tratamiento personalizados.',
    pathEn: '/services/medication-management', pathEs: '/es/servicios/manejo-medicamentos',
  },
};

function getServiceDetailSchema(baseUrl: string, lang: 'en' | 'es', key: string) {
  const d = SERVICE_DETAILS[key];
  const path = lang === 'en' ? d.pathEn : d.pathEs;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${baseUrl}${path}#service`,
    "name": lang === 'en' ? d.nameEn : d.nameEs,
    "serviceType": lang === 'en' ? d.serviceTypeEn : d.serviceTypeEs,
    "description": lang === 'en' ? d.descEn : d.descEs,
    "url": `${baseUrl}${path}`,
    "areaServed": {
      "@type": "City",
      "name": "Naples",
      "addressRegion": "FL",
      "addressCountry": "US"
    },
    "provider": {
      "@type": "MedicalClinic",
      "@id": "https://www.healingmindsp.com/#organization"
    },
    "availableLanguage": ["English", "Spanish"]
  };
}

function getServiceSchema(baseUrl: string, cityName: string, lang: Lang = 'en', locationPath?: string) {
  const isEs = lang === 'es';
  const url = locationPath
    ? `${baseUrl}${locationPath}`
    : `${baseUrl}/locations/psychiatrist-${cityName.toLowerCase().replace(/ /g, '-')}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#Service`,
    "name": isEs ? "Servicios Psiquiátricos" : "Psychiatric Services",
    "description": isEs
      ? `Atención psiquiátrica experta y servicios de salud mental para residentes de ${cityName}, FL. La Dra. Melva Reve ofrece tratamiento integral para ansiedad, depresión, TDAH, TEPT y otras condiciones de salud mental.`
      : `Expert psychiatric care and mental health services for ${cityName}, FL residents. Dr. Melva Reve provides comprehensive treatment for anxiety, depression, ADHD, PTSD, and other mental health conditions.`,
    "serviceType": isEs ? "Atención Psiquiátrica" : "Psychiatric Care",
    "areaServed": {
      "@type": "City",
      "name": cityName,
      "addressRegion": "FL",
      "addressCountry": "US"
    },
    "provider": {
      "@type": "MedicalClinic",
      "@id": "https://www.healingmindsp.com/#organization"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Psychiatric Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Anxiety Treatment"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Depression Treatment"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "ADHD Treatment"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "PTSD Treatment"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Medication Management"
          }
        }
      ]
    },
    "availableLanguage": ["English", "Spanish"],
    "url": url
  };
}

/**
 * Generate BreadcrumbList schema for site navigation hierarchy
 * Helps Google understand site structure and display breadcrumbs in search results
 */
function getBreadcrumbListSchema(baseUrl: string, path: string) {
  const pathSegments = path.split('/').filter(segment => segment !== '');
  
  // Build breadcrumb items
  const items = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": `${baseUrl}/`
    }
  ];
  
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Map URL segments to readable names
    const nameMapping: { [key: string]: string } = {
      'about': 'About Dr. Reve',
      'contact': 'Contact Us',
      'services': 'Services',
      'anxiety-treatment': 'Anxiety Treatment',
      'depression-treatment': 'Depression Treatment',
      'adhd-treatment': 'ADHD Treatment',
      'ptsd-treatment': 'PTSD Treatment',
      'bipolar-treatment': 'Bipolar Treatment',
      'medication-management': 'Medication Management',
      'telepsychiatry-florida': 'Telepsychiatry Florida',
      'for-patients': 'For Patients',
      'locations': 'Locations',
      'es': 'Español',
      'acerca-de': 'Acerca de',
      'contacto': 'Contacto',
      'servicios': 'Servicios',
      'tratamiento-ansiedad': 'Tratamiento de Ansiedad',
      'tratamiento-depresion': 'Tratamiento de Depresión',
      'tratamiento-tdah': 'Tratamiento de TDAH',
      'tratamiento-tept': 'Tratamiento de TEPT',
      'tratamiento-bipolar': 'Tratamiento Bipolar',
      'manejo-medicamentos': 'Manejo de Medicamentos',
      'telepsiquiatria-florida': 'Telepsiquiatría Florida',
      'para-pacientes': 'Para Pacientes'
    };
    
    const name = nameMapping[segment] || segment.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    items.push({
      "@type": "ListItem",
      "position": index + 2,
      "name": name,
      "item": `${baseUrl}${currentPath}`
    });
  });
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items
  };
}

/**
 * Generate FAQPage schema for common questions about psychiatric services
 * This enables FAQ rich results in Google search with expandable Q&A sections
 */
function getFAQPageSchema(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What can I expect in my first session?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Your first session is a comprehensive evaluation where we'll discuss your current challenges, history, and goals. It's a collaborative process designed to create a personalized treatment plan that works for you. It typically lasts 75 minutes."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between a psychiatrist and a psychologist?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A psychiatrist is a medical doctor who is authorized to order and manage medications for mental health conditions. A psychologist focuses on therapy and counseling but is not authorized to order medications. As a psychiatrist, Dr. Reve can provide both therapy and medication management."
        }
      },
      {
        "@type": "Question",
        "name": "Is my information kept confidential?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, absolutely. All information shared in our sessions is strictly confidential and protected by HIPAA laws. Information is only shared with your written consent or in rare cases required by law for safety reasons."
        }
      },
      {
        "@type": "Question",
        "name": "How do I know if I need medication?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Medication decisions are always made collaboratively between you and Dr. Reve. We'll discuss your symptoms, treatment history, and preferences. Many conditions can be treated with therapy alone, while others may benefit from a combination of therapy and medication."
        }
      },
      {
        "@type": "Question",
        "name": "Do you accept insurance?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We accept most major insurance plans including Aetna, Blue Cross Blue Shield, Cigna, United Healthcare, Humana, Medicare, and Tricare. Our staff will verify your benefits and explain your coverage before your first appointment. We also offer flexible payment options for those without insurance coverage."
        }
      },
      {
        "@type": "Question",
        "name": "How often will I need to come in for appointments?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Appointment frequency depends on your individual needs and treatment plan. Initially, appointments may be weekly or bi-weekly. As you progress, the frequency may decrease. We'll work together to find a schedule that supports your mental health goals."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer telepsychiatry services?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we offer comprehensive telepsychiatry services throughout Florida. Virtual sessions provide the same quality care as in-person visits, with the convenience of attending from your home. We use a secure, HIPAA-compliant platform for all telehealth appointments."
        }
      }
    ]
  };
}

/**
 * Generate comprehensive MedicalOrganization schema optimized for Google Rich Results
 * Compatible with Google Business Profile and Local SEO requirements
 * Uses MedicalOrganization (broader than MedicalClinic) with LocalBusiness properties for maximum visibility
 * Includes AggregateRating for Rich Results star display in SERPs
 */
function getMedicalBusinessSchema(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalOrganization", "LocalBusiness", "MedicalClinic"],
    "@id": `${baseUrl}/#organization`,
    "name": "Healing Minds Psychiatry",
    "alternateName": "Healing Minds Psychiatry - Dr. Melva Reve",
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/favicon.svg`,
      "width": "512",
      "height": "512"
    },
    "image": {
      "@type": "ImageObject",
      "url": `${baseUrl}/doctor-profile-v2.webp`,
      "width": "800",
      "height": "800"
    },
    "description": "Healing Minds Psychiatry, led by Dr. Melva Reve, provides compassionate mental health care in Naples, FL. Expert treatment for anxiety, depression, ADHD, PTSD, and bipolar disorder. Bilingual services in English and Spanish. Telepsychiatry available throughout Florida.",
    "slogan": "Compassionate Mental Health Care in Naples, FL",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "4760 Tamiami Trl N # 25",
      "addressLocality": "Naples",
      "addressRegion": "FL",
      "postalCode": "34103",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 26.2044803,
      "longitude": -81.8021344
    },
    "telephone": "+1-239-423-0272",
    "email": "info@healingmindsp.com",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "17:00"
      }
    ],
    "medicalSpecialty": [
      {
        "@type": "MedicalSpecialty",
        "name": "Psychiatry"
      }
    ],
    "availableService": [
      {
        "@type": "MedicalTherapy",
        "name": "Anxiety Treatment",
        "description": "Comprehensive treatment for anxiety disorders"
      },
      {
        "@type": "MedicalTherapy",
        "name": "Depression Treatment",
        "description": "Expert care for depression and mood disorders"
      },
      {
        "@type": "MedicalTherapy",
        "name": "ADHD Treatment",
        "description": "Specialized ADHD diagnosis and treatment"
      },
      {
        "@type": "MedicalTherapy",
        "name": "PTSD Treatment",
        "description": "Trauma-focused psychiatric care"
      },
      {
        "@type": "MedicalTherapy",
        "name": "Bipolar Disorder Treatment",
        "description": "Expert bipolar disorder management"
      },
      {
        "@type": "MedicalProcedure",
        "name": "Medication Management",
        "description": "Psychiatric medication evaluation and management"
      },
      {
        "@type": "MedicalProcedure",
        "name": "Telepsychiatry",
        "description": "Virtual psychiatric consultations throughout Florida"
      }
    ],
    "availableLanguage": [
      {
        "@type": "Language",
        "name": "English"
      },
      {
        "@type": "Language",
        "name": "Spanish"
      }
    ],
    "areaServed": [
      {
        "@type": "City",
        "name": "Naples",
        "containedInPlace": {
          "@type": "State",
          "name": "Florida"
        }
      },
      {
        "@type": "State",
        "name": "Florida"
      }
    ],
    "paymentAccepted": ["Insurance", "Credit Card", "Cash"],
    "currenciesAccepted": "USD",
    "priceRange": "$$",
    "isAcceptingNewPatients": true,
    "sameAs": [
      "https://www.google.com/maps/place/Healing+Minds+Psychiatry/@26.2044803,-81.8021344,17z",
      "https://www.instagram.com/hmpsychiatry/",
      "https://www.facebook.com/profile.php?id=61578845287836",
      "https://www.youtube.com/@healingmindsp",
      "https://www.yelp.com/biz/healing-minds-psychiatry-naples",
      "https://www.tiktok.com/@dra.melvavidal"
    ],
    "hasMap": "https://www.google.com/maps/place/Healing+Minds+Psychiatry/@26.2044803,-81.8021344,17z",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "17"
    },
    "review": [
      {
        "@type": "Review",
        "name": "A Positive and Reassuring Experience",
        "author": {
          "@type": "Person",
          "name": "Julio Gonzalez"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "datePublished": "2025-10-07",
        "reviewBody": "My visit was genuinely a positive and reassuring experience. The provider was compassionate, patient, and really took the time to listen and understand what I was going through."
      },
      {
        "@type": "Review",
        "name": "Truly Life-Changing Care",
        "author": {
          "@type": "Person",
          "name": "Ismael Gonzalez"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "My experience with Dr Reve has been truly life-changing. Her compassionate approach and expertise have made a significant difference in my mental health journey."
      },
      {
        "@type": "Review",
        "name": "Best Bilingual Psychiatrist",
        "author": {
          "@type": "Person",
          "name": "Maylin Garcia Gonzalez"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "The best bilingual psychiatrist I've ever met! Finding professional mental health care in both English and Spanish has been invaluable for my family."
      }
    ],
    "founder": {
      "@type": "Physician",
      "@id": `${baseUrl}/#physician`,
      "name": "Dr. Melva Reve Urgelles",
      "honorificPrefix": "Dr.",
      "givenName": "Melva",
      "additionalName": "Reve",
      "familyName": "Urgelles",
      "gender": "Female",
      "jobTitle": "Psychiatrist",
      "description": "Psychiatrist specializing in anxiety, depression, ADHD, and PTSD treatment. Bilingual in English and Spanish.",
      "image": `${baseUrl}/doctor-profile-v2.webp`,
      "telephone": "+1-239-423-0272",
      "email": "info@healingmindsp.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "4760 Tamiami Trl N # 25",
        "addressLocality": "Naples",
        "addressRegion": "FL",
        "postalCode": "34103",
        "addressCountry": "US"
      },
      "priceRange": "$$",
      "medicalSpecialty": "Psychiatry",
      "identifier": {
        "@type": "PropertyValue",
        "propertyID": "NPI",
        "value": "1982233631"
      },
      "sameAs": [
        "https://www.healthgrades.com/physician/dr-melva-reve-urgelles-1dgbqeci76",
        "https://weprevent.org/listing/dr-melva-reve-urgelles-md-vc998mp/",
        "https://providers.sharecare.com/doctor/dr-melva-reve-urgelles-1dgbqeci76",
        "https://npidb.org/doctors/allopathic_osteopathic_physicians/psychiatry_2084p0800x/1982233631.aspx"
      ],
      "knowsLanguage": [
        {
          "@type": "Language",
          "name": "English"
        },
        {
          "@type": "Language",
          "name": "Spanish"
        }
      ],
      "worksFor": {
        "@id": `${baseUrl}/#organization`
      },
      "workLocation": {
        "@type": "PostalAddress",
        "streetAddress": "4760 Tamiami Trl N # 25",
        "addressLocality": "Naples",
        "addressRegion": "FL",
        "postalCode": "34103",
        "addressCountry": "US"
      }
    }
  };
}

/**
 * Returns static semantic HTML for key public routes so non-rendering crawlers
 * (GPTBot, ClaudeBot, Perplexity, etc.) can read the page's H1, description,
 * and internal-link graph from the initial HTML response.
 *
 * React replaces this content immediately on boot — JS-enabled visitors never
 * see it. The injection targets <div id="root"> in the shared SPA shell.
 *
 * Coverage (EN + ES equivalents for each):
 *   - Homepages
 *   - 6 service detail pages
 *   - 10 location pages
 *   - About and Contact pages
 *   - 3 hub pages: /services, /for-patients, /telepsychiatry-florida
 *   - 8 legal/trust pages: privacy-policy, terms-of-service, hipaa-notice,
 *     cookie-policy, cancellation-policy, billing-policy, emergency-policy,
 *     patient-rights
 */
function getStaticPageBody(path: string, baseUrl: string): string | null {
  const phone = '(239) 423-0272';
  const address = '4760 Tamiami Trl N #25, Naples, FL 34103';

  const contactInfo = `<address>Dr. Melva Reve, MD &mdash; <a href="tel:+12394230272">${phone}</a> &mdash; ${address}</address>`;

  const enServiceLinks = `<ul>
      <li><a href="/services/anxiety-treatment">Anxiety Treatment</a></li>
      <li><a href="/services/depression-treatment">Depression Treatment</a></li>
      <li><a href="/services/adhd-treatment">ADHD Treatment</a></li>
      <li><a href="/services/ptsd-treatment">PTSD Treatment</a></li>
      <li><a href="/services/bipolar-treatment">Bipolar Disorder Treatment</a></li>
      <li><a href="/services/medication-management">Medication Management</a></li>
    </ul>`;

  const esServiceLinks = `<ul>
      <li><a href="/es/servicios/tratamiento-ansiedad">Tratamiento de Ansiedad</a></li>
      <li><a href="/es/servicios/tratamiento-depresion">Tratamiento de Depresi&oacute;n</a></li>
      <li><a href="/es/servicios/tratamiento-adhd">Tratamiento de TDAH</a></li>
      <li><a href="/es/servicios/tratamiento-tept">Tratamiento de TEPT</a></li>
      <li><a href="/es/servicios/tratamiento-bipolar">Tratamiento Bipolar</a></li>
      <li><a href="/es/servicios/manejo-medicamentos">Manejo de Medicamentos</a></li>
    </ul>`;

  const enLocationLinks = `<ul>
      <li><a href="/locations/psychiatrist-naples">Naples</a></li>
      <li><a href="/locations/psychiatrist-bonita-springs">Bonita Springs</a></li>
      <li><a href="/locations/psychiatrist-marco-island">Marco Island</a></li>
      <li><a href="/locations/psychiatrist-fort-myers">Fort Myers</a></li>
      <li><a href="/locations/psychiatrist-estero">Estero</a></li>
      <li><a href="/locations/psychiatrist-golden-gate">Golden Gate</a></li>
      <li><a href="/locations/psychiatrist-ave-maria">Ave Maria</a></li>
      <li><a href="/locations/psychiatrist-immokalee">Immokalee</a></li>
      <li><a href="/locations/psychiatrist-lely-resort">Lely Resort</a></li>
      <li><a href="/locations/psychiatrist-vanderbilt-beach">Vanderbilt Beach</a></li>
    </ul>`;

  const esLocationLinks = `<ul>
      <li><a href="/es/ubicaciones/psiquiatra-naples">Naples</a></li>
      <li><a href="/es/ubicaciones/psiquiatra-bonita-springs">Bonita Springs</a></li>
      <li><a href="/es/ubicaciones/psiquiatra-marco-island">Marco Island</a></li>
      <li><a href="/es/ubicaciones/psiquiatra-fort-myers">Fort Myers</a></li>
      <li><a href="/es/ubicaciones/psiquiatra-estero">Estero</a></li>
      <li><a href="/es/ubicaciones/psiquiatra-golden-gate">Golden Gate</a></li>
      <li><a href="/es/ubicaciones/psiquiatra-ave-maria">Ave Maria</a></li>
      <li><a href="/es/ubicaciones/psiquiatra-immokalee">Immokalee</a></li>
      <li><a href="/es/ubicaciones/psiquiatra-lely-resort">Lely Resort</a></li>
      <li><a href="/es/ubicaciones/psiquiatra-vanderbilt-beach">Vanderbilt Beach</a></li>
    </ul>`;

  const enLegalLinks = `<ul>
      <li><a href="/privacy-policy">Privacy Policy</a></li>
      <li><a href="/terms-of-service">Terms of Service</a></li>
      <li><a href="/hipaa-notice">HIPAA Notice</a></li>
      <li><a href="/cookie-policy">Cookie Policy</a></li>
      <li><a href="/cancellation-policy">Cancellation Policy</a></li>
      <li><a href="/billing-policy">Billing Policy</a></li>
      <li><a href="/emergency-policy">Emergency Policy</a></li>
      <li><a href="/patient-rights">Patient Rights</a></li>
    </ul>`;

  const esLegalLinks = `<ul>
      <li><a href="/es/politica-privacidad">Pol&iacute;tica de Privacidad</a></li>
      <li><a href="/es/terminos-servicio">T&eacute;rminos de Servicio</a></li>
      <li><a href="/es/aviso-hipaa">Aviso HIPAA</a></li>
      <li><a href="/es/politica-cookies">Pol&iacute;tica de Cookies</a></li>
      <li><a href="/es/politica-cancelacion">Pol&iacute;tica de Cancelaci&oacute;n</a></li>
      <li><a href="/es/politica-facturacion">Pol&iacute;tica de Facturaci&oacute;n</a></li>
      <li><a href="/es/politica-emergencias">Pol&iacute;tica de Emergencias</a></li>
      <li><a href="/es/derechos-paciente">Derechos del Paciente</a></li>
    </ul>`;

  // Satellite location pages render their crawler body from hyperlocal copy.
  const satellite = SATELLITE_BY_PATH[path];
  if (satellite) {
    return buildLocationBody(satellite.city, satellite.lang, {
      contactInfo,
      serviceLinks: satellite.lang === 'es' ? esServiceLinks : enServiceLinks,
      locationLinks: satellite.lang === 'es' ? esLocationLinks : enLocationLinks,
    });
  }

  switch (path) {
    // ── English Homepage ────────────────────────────────────────────────────
    case '/':
      return `<main>
  <header><a href="/">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Expert Psychiatric Care in Naples, FL</h1>
    <p>Dr. Melva Reve provides expert psychiatric care in Naples, FL, specializing in anxiety, depression, ADHD, PTSD, and bipolar disorder. Bilingual services in English and Spanish. Most insurance plans accepted. Telehealth and in-office appointments available throughout Southwest Florida.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Services">${enServiceLinks}</nav>
  <nav aria-label="Locations">${enLocationLinks}</nav>
  <nav aria-label="More"><ul>
    <li><a href="/about">About Dr. Melva Reve</a></li>
    <li><a href="/contact">Contact &amp; Schedule Appointment</a></li>
    <li><a href="/for-patients">For Patients</a></li>
    <li><a href="/es">Espa&ntilde;ol</a></li>
  </ul></nav>
</main>`;

    // ── Spanish Homepage ─────────────────────────────────────────────────────
    case '/es':
      return `<main>
  <header><a href="/es">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Atenci&oacute;n Psiqu&iacute;atrica Experta en Naples, FL</h1>
    <p>La Dra. Melva Reve ofrece atenci&oacute;n psiqu&iacute;atrica experta en Naples, FL, especializ&aacute;ndose en ansiedad, depresi&oacute;n, TDAH, TEPT y trastorno bipolar. Servicios biling&uuml;es en ingl&eacute;s y espa&ntilde;ol. Se aceptan la mayor&iacute;a de planes de seguro. Consultas de telesalud y en consultorio disponibles en todo el suroeste de Florida.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Servicios">${esServiceLinks}</nav>
  <nav aria-label="Ubicaciones">${esLocationLinks}</nav>
  <nav aria-label="M&aacute;s"><ul>
    <li><a href="/es/acerca-de">Acerca de la Dra. Melva Reve</a></li>
    <li><a href="/es/contacto">Contacto y Cita</a></li>
    <li><a href="/es/para-pacientes">Para Pacientes</a></li>
    <li><a href="/">English</a></li>
  </ul></nav>
</main>`;

    // ── English Service Pages ────────────────────────────────────────────────
    case '/services/anxiety-treatment':
      return `<main>
  <header><a href="/">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Anxiety Treatment in Naples, FL</h1>
    <p>Expert anxiety treatment in Naples, FL. Dr. Melva Reve provides comprehensive care for panic attacks, social anxiety, and generalized anxiety disorder with evidence-based treatments and personalized medication management. Bilingual psychiatrist serving Southwest Florida.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Related Services">${enServiceLinks}</nav>
  <nav aria-label="Quick Links"><ul>
    <li><a href="/contact">Schedule an Appointment</a></li>
    <li><a href="/about">About Dr. Melva Reve</a></li>
    <li><a href="/locations/psychiatrist-naples">Naples Office Location</a></li>
    <li><a href="/es/servicios/tratamiento-ansiedad">Espa&ntilde;ol</a></li>
  </ul></nav>
</main>`;

    case '/services/depression-treatment':
      return `<main>
  <header><a href="/">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Depression Treatment in Naples, FL</h1>
    <p>Professional depression treatment in Naples, FL. Dr. Melva Reve offers expert care for major depression, postpartum depression, and seasonal depression with personalized treatment plans and medication management. Bilingual psychiatrist serving Southwest Florida.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Related Services">${enServiceLinks}</nav>
  <nav aria-label="Quick Links"><ul>
    <li><a href="/contact">Schedule an Appointment</a></li>
    <li><a href="/about">About Dr. Melva Reve</a></li>
    <li><a href="/locations/psychiatrist-naples">Naples Office Location</a></li>
    <li><a href="/es/servicios/tratamiento-depresion">Espa&ntilde;ol</a></li>
  </ul></nav>
</main>`;

    case '/services/adhd-treatment':
      return `<main>
  <header><a href="/">Healing Minds Psychiatry</a></header>
  <section>
    <h1>ADHD Treatment in Naples, FL</h1>
    <p>Expert ADHD treatment for adults in Naples, FL. Dr. Melva Reve provides comprehensive ADHD evaluation, medication management, and behavioral strategies to improve focus and daily functioning. Bilingual psychiatrist serving Southwest Florida.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Related Services">${enServiceLinks}</nav>
  <nav aria-label="Quick Links"><ul>
    <li><a href="/contact">Schedule an Appointment</a></li>
    <li><a href="/about">About Dr. Melva Reve</a></li>
    <li><a href="/locations/psychiatrist-naples">Naples Office Location</a></li>
    <li><a href="/es/servicios/tratamiento-adhd">Espa&ntilde;ol</a></li>
  </ul></nav>
</main>`;

    case '/services/ptsd-treatment':
      return `<main>
  <header><a href="/">Healing Minds Psychiatry</a></header>
  <section>
    <h1>PTSD Treatment in Naples, FL</h1>
    <p>Trauma-informed psychiatric care for post-traumatic stress disorder in Naples, FL. Dr. Melva Reve uses evidence-based treatments to help patients heal from traumatic experiences, including therapy and medication management. Bilingual psychiatrist serving Southwest Florida.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Related Services">${enServiceLinks}</nav>
  <nav aria-label="Quick Links"><ul>
    <li><a href="/contact">Schedule an Appointment</a></li>
    <li><a href="/about">About Dr. Melva Reve</a></li>
    <li><a href="/locations/psychiatrist-naples">Naples Office Location</a></li>
    <li><a href="/es/servicios/tratamiento-tept">Espa&ntilde;ol</a></li>
  </ul></nav>
</main>`;

    case '/services/bipolar-treatment':
      return `<main>
  <header><a href="/">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Bipolar Disorder Treatment in Naples, FL</h1>
    <p>Expert psychiatric care for bipolar disorder in Naples, FL. Dr. Melva Reve provides mood stabilization, medication management, and comprehensive support for bipolar I, bipolar II, and cyclothymia. Bilingual psychiatrist serving Southwest Florida.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Related Services">${enServiceLinks}</nav>
  <nav aria-label="Quick Links"><ul>
    <li><a href="/contact">Schedule an Appointment</a></li>
    <li><a href="/about">About Dr. Melva Reve</a></li>
    <li><a href="/locations/psychiatrist-naples">Naples Office Location</a></li>
    <li><a href="/es/servicios/tratamiento-bipolar">Espa&ntilde;ol</a></li>
  </ul></nav>
</main>`;

    case '/services/medication-management':
      return `<main>
  <header><a href="/">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Medication Management in Naples, FL</h1>
    <p>Expert psychiatric medication evaluation, monitoring, and adjustment in Naples, FL. Dr. Melva Reve provides comprehensive safety assessments and personalized treatment plans for all psychiatric conditions. Bilingual psychiatrist serving Southwest Florida.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Related Services">${enServiceLinks}</nav>
  <nav aria-label="Quick Links"><ul>
    <li><a href="/contact">Schedule an Appointment</a></li>
    <li><a href="/about">About Dr. Melva Reve</a></li>
    <li><a href="/locations/psychiatrist-naples">Naples Office Location</a></li>
    <li><a href="/es/servicios/manejo-medicamentos">Espa&ntilde;ol</a></li>
  </ul></nav>
</main>`;

    // ── Spanish Service Pages ────────────────────────────────────────────────
    case '/es/servicios/tratamiento-ansiedad':
      return `<main>
  <header><a href="/es">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Tratamiento de Ansiedad en Naples, FL</h1>
    <p>Tratamiento experto de ansiedad en Naples, FL. La Dra. Melva Reve proporciona atenci&oacute;n integral para ataques de p&aacute;nico, ansiedad social y trastorno de ansiedad generalizada con tratamientos basados en evidencia. Psiquiatra biling&uuml;e que atiende el suroeste de Florida.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Servicios Relacionados">${esServiceLinks}</nav>
  <nav aria-label="Enlaces R&aacute;pidos"><ul>
    <li><a href="/es/contacto">Programar una Cita</a></li>
    <li><a href="/es/acerca-de">Sobre la Dra. Melva Reve</a></li>
    <li><a href="/services/anxiety-treatment">English</a></li>
  </ul></nav>
</main>`;

    case '/es/servicios/tratamiento-depresion':
      return `<main>
  <header><a href="/es">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Tratamiento de Depresi&oacute;n en Naples, FL</h1>
    <p>Tratamiento profesional de depresi&oacute;n en Naples, FL. La Dra. Melva Reve ofrece atenci&oacute;n experta para depresi&oacute;n mayor, depresi&oacute;n posparto y depresi&oacute;n estacional con planes de tratamiento personalizados. Psiquiatra biling&uuml;e que atiende el suroeste de Florida.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Servicios Relacionados">${esServiceLinks}</nav>
  <nav aria-label="Enlaces R&aacute;pidos"><ul>
    <li><a href="/es/contacto">Programar una Cita</a></li>
    <li><a href="/es/acerca-de">Sobre la Dra. Melva Reve</a></li>
    <li><a href="/services/depression-treatment">English</a></li>
  </ul></nav>
</main>`;

    case '/es/servicios/tratamiento-adhd':
      return `<main>
  <header><a href="/es">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Tratamiento de TDAH en Naples, FL</h1>
    <p>Tratamiento experto de TDAH para adultos en Naples, FL. La Dra. Melva Reve ofrece evaluaci&oacute;n integral de TDAH, manejo de medicamentos y estrategias conductuales para mejorar el enfoque y funcionamiento diario. Psiquiatra biling&uuml;e que atiende el suroeste de Florida.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Servicios Relacionados">${esServiceLinks}</nav>
  <nav aria-label="Enlaces R&aacute;pidos"><ul>
    <li><a href="/es/contacto">Programar una Cita</a></li>
    <li><a href="/es/acerca-de">Sobre la Dra. Melva Reve</a></li>
    <li><a href="/services/adhd-treatment">English</a></li>
  </ul></nav>
</main>`;

    case '/es/servicios/tratamiento-tept':
      return `<main>
  <header><a href="/es">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Tratamiento de TEPT en Naples, FL</h1>
    <p>Atenci&oacute;n psiqu&iacute;atrica informada en trauma para trastorno de estr&eacute;s postraum&aacute;tico en Naples, FL. La Dra. Melva Reve usa tratamientos basados en evidencia para ayudar a los pacientes a sanar de experiencias traum&aacute;ticas. Psiquiatra biling&uuml;e que atiende el suroeste de Florida.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Servicios Relacionados">${esServiceLinks}</nav>
  <nav aria-label="Enlaces R&aacute;pidos"><ul>
    <li><a href="/es/contacto">Programar una Cita</a></li>
    <li><a href="/es/acerca-de">Sobre la Dra. Melva Reve</a></li>
    <li><a href="/services/ptsd-treatment">English</a></li>
  </ul></nav>
</main>`;

    case '/es/servicios/tratamiento-bipolar':
      return `<main>
  <header><a href="/es">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Tratamiento de Trastorno Bipolar en Naples, FL</h1>
    <p>Atenci&oacute;n psiqu&iacute;atrica experta para trastorno bipolar en Naples, FL. La Dra. Melva Reve ofrece estabilizaci&oacute;n del &aacute;nimo, manejo de medicamentos y apoyo integral para bipolar I, II y ciclotimia. Psiquiatra biling&uuml;e que atiende el suroeste de Florida.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Servicios Relacionados">${esServiceLinks}</nav>
  <nav aria-label="Enlaces R&aacute;pidos"><ul>
    <li><a href="/es/contacto">Programar una Cita</a></li>
    <li><a href="/es/acerca-de">Sobre la Dra. Melva Reve</a></li>
    <li><a href="/services/bipolar-treatment">English</a></li>
  </ul></nav>
</main>`;

    case '/es/servicios/manejo-medicamentos':
      return `<main>
  <header><a href="/es">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Manejo de Medicamentos en Naples, FL</h1>
    <p>Evaluaci&oacute;n, monitoreo y ajuste experto de medicamentos psiqu&iacute;atricos en Naples, FL. La Dra. Melva Reve proporciona evaluaciones de seguridad integrales y planes de tratamiento personalizados para todas las condiciones psiqu&iacute;atricas. Psiquiatra biling&uuml;e que atiende el suroeste de Florida.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Servicios Relacionados">${esServiceLinks}</nav>
  <nav aria-label="Enlaces R&aacute;pidos"><ul>
    <li><a href="/es/contacto">Programar una Cita</a></li>
    <li><a href="/es/acerca-de">Sobre la Dra. Melva Reve</a></li>
    <li><a href="/services/medication-management">English</a></li>
  </ul></nav>
</main>`;

    // ── English Location Pages ───────────────────────────────────────────────
    case '/locations/psychiatrist-naples':
      return `<main>
  <header><a href="/">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Psychiatrist in Naples, FL &mdash; Dr. Melva Reve</h1>
    <p>Visit Dr. Melva Reve at our Naples, FL office for expert psychiatric care. Specializing in anxiety, depression, ADHD, PTSD, and bipolar disorder. In-person and telehealth appointments available. Insurance accepted.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Services">${enServiceLinks}</nav>
  <nav aria-label="Nearby Areas"><ul>
    <li><a href="/locations/psychiatrist-bonita-springs">Bonita Springs</a></li>
    <li><a href="/locations/psychiatrist-marco-island">Marco Island</a></li>
    <li><a href="/locations/psychiatrist-fort-myers">Fort Myers</a></li>
    <li><a href="/locations/psychiatrist-estero">Estero</a></li>
    <li><a href="/contact">Schedule Appointment</a></li>
  </ul></nav>
</main>`;

    // ── Spanish Location Pages ───────────────────────────────────────────────
    case '/es/ubicaciones/psiquiatra-naples':
      return `<main>
  <header><a href="/es">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Psiquiatra en Naples, FL &mdash; Dra. Melva Reve</h1>
    <p>Visite a la Dra. Melva Reve en nuestra oficina en Naples, FL para atenci&oacute;n psiqu&iacute;atrica experta. Especializ&aacute;ndose en ansiedad, depresi&oacute;n, TDAH, TEPT y trastorno bipolar. Citas presenciales y de telesalud disponibles. Se acepta seguro.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Servicios">${esServiceLinks}</nav>
  <nav aria-label="Otras &Aacute;reas"><ul>
    <li><a href="/es/ubicaciones/psiquiatra-bonita-springs">Bonita Springs</a></li>
    <li><a href="/es/ubicaciones/psiquiatra-marco-island">Marco Island</a></li>
    <li><a href="/es/ubicaciones/psiquiatra-fort-myers">Fort Myers</a></li>
    <li><a href="/es/contacto">Programar Cita</a></li>
  </ul></nav>
</main>`;

    // ── About ────────────────────────────────────────────────────────────────
    case '/about':
      return `<main>
  <header><a href="/">Healing Minds Psychiatry</a></header>
  <section>
    <h1>About Dr. Melva Reve &mdash; Naples, FL Psychiatrist</h1>
    <p>Dr. Melva Reve is a board-certified psychiatrist in Naples, FL specializing in anxiety, depression, ADHD, PTSD, and bipolar disorder. She provides compassionate, evidence-based psychiatric care in both English and Spanish, serving patients throughout Southwest Florida.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Services">${enServiceLinks}</nav>
  <nav aria-label="Quick Links"><ul>
    <li><a href="/contact">Schedule an Appointment</a></li>
    <li><a href="/for-patients">For Patients</a></li>
    <li><a href="/es/acerca-de">Espa&ntilde;ol</a></li>
  </ul></nav>
</main>`;

    case '/es/acerca-de':
      return `<main>
  <header><a href="/es">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Sobre la Dra. Melva Reve &mdash; Psiquiatra en Naples, FL</h1>
    <p>La Dra. Melva Reve es una psiquiatra certificada en Naples, FL que se especializa en ansiedad, depresi&oacute;n, TDAH, TEPT y trastorno bipolar. Brinda atenci&oacute;n psiqu&iacute;atrica compasiva basada en evidencia en ingl&eacute;s y espa&ntilde;ol, atendiendo a pacientes en todo el suroeste de Florida.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Servicios">${esServiceLinks}</nav>
  <nav aria-label="Enlaces R&aacute;pidos"><ul>
    <li><a href="/es/contacto">Programar una Cita</a></li>
    <li><a href="/es/para-pacientes">Para Pacientes</a></li>
    <li><a href="/about">English</a></li>
  </ul></nav>
</main>`;

    // ── Contact ──────────────────────────────────────────────────────────────
    case '/contact':
      return `<main>
  <header><a href="/">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Contact Healing Minds Psychiatry &mdash; Naples, FL</h1>
    <p>Schedule an appointment with Dr. Melva Reve for expert psychiatric care in Naples, FL. We accept most insurance plans and offer both in-person and telehealth appointments for anxiety, depression, ADHD, PTSD, and bipolar disorder treatment.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Services">${enServiceLinks}</nav>
  <nav aria-label="Quick Links"><ul>
    <li><a href="/about">About Dr. Melva Reve</a></li>
    <li><a href="/for-patients">For Patients</a></li>
    <li><a href="/es/contacto">Espa&ntilde;ol</a></li>
  </ul></nav>
</main>`;

    case '/es/contacto':
      return `<main>
  <header><a href="/es">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Contacto &mdash; Healing Minds Psychiatry, Naples, FL</h1>
    <p>Programe una cita con la Dra. Melva Reve para atenci&oacute;n psiqu&iacute;atrica experta en Naples, FL. Aceptamos la mayor&iacute;a de los planes de seguro y ofrecemos citas presenciales y de telesalud para el tratamiento de ansiedad, depresi&oacute;n, TDAH, TEPT y trastorno bipolar.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Servicios">${esServiceLinks}</nav>
  <nav aria-label="Enlaces R&aacute;pidos"><ul>
    <li><a href="/es/acerca-de">Sobre la Dra. Melva Reve</a></li>
    <li><a href="/es/para-pacientes">Para Pacientes</a></li>
    <li><a href="/contact">English</a></li>
  </ul></nav>
</main>`;

    // ── English Hub Pages ────────────────────────────────────────────────────
    case '/services':
      return `<main>
  <header><a href="/">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Psychiatric Services in Naples, FL</h1>
    <p>Comprehensive psychiatric services in Naples, FL. Dr. Melva Reve treats anxiety, depression, ADHD, PTSD, and bipolar disorder with expert medication management. Bilingual care in English and Spanish for patients throughout Southwest Florida.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Services">${enServiceLinks}</nav>
  <nav aria-label="Quick Links"><ul>
    <li><a href="/contact">Schedule an Appointment</a></li>
    <li><a href="/about">About Dr. Melva Reve</a></li>
    <li><a href="/for-patients">For Patients</a></li>
    <li><a href="/es/servicios">Espa&ntilde;ol</a></li>
  </ul></nav>
</main>`;

    case '/for-patients':
      return `<main>
  <header><a href="/">Healing Minds Psychiatry</a></header>
  <section>
    <h1>For Patients &mdash; Healing Minds Psychiatry</h1>
    <p>Patient resources and information for Healing Minds Psychiatry. Forms, insurance, appointment scheduling, and what to expect during your visit with Dr. Melva Reve in Naples, FL.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Services">${enServiceLinks}</nav>
  <nav aria-label="Quick Links"><ul>
    <li><a href="/contact">Schedule an Appointment</a></li>
    <li><a href="/about">About Dr. Melva Reve</a></li>
    <li><a href="/telepsychiatry-florida">Telepsychiatry in Florida</a></li>
    <li><a href="/es/para-pacientes">Espa&ntilde;ol</a></li>
  </ul></nav>
</main>`;

    case '/telepsychiatry-florida':
      return `<main>
  <header><a href="/">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Telepsychiatry in Florida</h1>
    <p>Telepsychiatry throughout Florida with Dr. Melva Reve. Secure, HIPAA-compliant virtual psychiatric care for anxiety, depression, ADHD, and more. Bilingual virtual care with the same quality as in-person, from the comfort of your home.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Services">${enServiceLinks}</nav>
  <nav aria-label="Quick Links"><ul>
    <li><a href="/contact">Schedule an Appointment</a></li>
    <li><a href="/about">About Dr. Melva Reve</a></li>
    <li><a href="/for-patients">For Patients</a></li>
    <li><a href="/es/telepsiquiatria-florida">Espa&ntilde;ol</a></li>
  </ul></nav>
</main>`;

    // ── Spanish Hub Pages ────────────────────────────────────────────────────
    case '/es/servicios':
      return `<main>
  <header><a href="/es">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Servicios Psiqui&aacute;tricos en Naples, FL</h1>
    <p>Servicios psiqui&aacute;tricos completos en Naples, FL. La Dra. Melva Reve trata ansiedad, depresi&oacute;n, TDAH, TEPT y trastorno bipolar con manejo experto de medicamentos. Atenci&oacute;n biling&uuml;e en ingl&eacute;s y espa&ntilde;ol para pacientes en todo el suroeste de Florida.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Servicios">${esServiceLinks}</nav>
  <nav aria-label="Enlaces R&aacute;pidos"><ul>
    <li><a href="/es/contacto">Programar una Cita</a></li>
    <li><a href="/es/acerca-de">Sobre la Dra. Melva Reve</a></li>
    <li><a href="/es/para-pacientes">Para Pacientes</a></li>
    <li><a href="/services">English</a></li>
  </ul></nav>
</main>`;

    case '/es/para-pacientes':
      return `<main>
  <header><a href="/es">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Para Pacientes &mdash; Healing Minds Psychiatry</h1>
    <p>Informaci&oacute;n importante para pacientes sobre seguro, citas y atenci&oacute;n psiqui&aacute;trica en Healing Minds Naples. Preguntas frecuentes y qu&eacute; esperar durante su visita con la Dra. Melva Reve.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Servicios">${esServiceLinks}</nav>
  <nav aria-label="Enlaces R&aacute;pidos"><ul>
    <li><a href="/es/contacto">Programar una Cita</a></li>
    <li><a href="/es/acerca-de">Sobre la Dra. Melva Reve</a></li>
    <li><a href="/es/telepsiquiatria-florida">Telepsiquiatr&iacute;a en Florida</a></li>
    <li><a href="/for-patients">English</a></li>
  </ul></nav>
</main>`;

    case '/es/telepsiquiatria-florida':
      return `<main>
  <header><a href="/es">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Telepsiquiatr&iacute;a en Florida</h1>
    <p>Telepsiquiatr&iacute;a en toda Florida con la Dra. Melva Reve. Atenci&oacute;n psiqui&aacute;trica virtual segura, conforme con HIPAA, para ansiedad, depresi&oacute;n, TDAH y m&aacute;s. Atenci&oacute;n virtual biling&uuml;e con la misma calidad que en persona, desde la comodidad de su hogar.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Servicios">${esServiceLinks}</nav>
  <nav aria-label="Enlaces R&aacute;pidos"><ul>
    <li><a href="/es/contacto">Programar una Cita</a></li>
    <li><a href="/es/acerca-de">Sobre la Dra. Melva Reve</a></li>
    <li><a href="/es/para-pacientes">Para Pacientes</a></li>
    <li><a href="/telepsychiatry-florida">English</a></li>
  </ul></nav>
</main>`;

    // ── English Legal &amp; Trust Pages ──────────────────────────────────────
    case '/privacy-policy':
      return `<main>
  <header><a href="/">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Privacy Policy</h1>
    <p>Privacy Policy for Healing Minds Psychiatry. Learn how we protect your personal health information and comply with HIPAA regulations.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Legal">${enLegalLinks}</nav>
  <nav aria-label="Quick Links"><ul>
    <li><a href="/">Home</a></li>
    <li><a href="/contact">Contact</a></li>
    <li><a href="/es/politica-privacidad">Espa&ntilde;ol</a></li>
  </ul></nav>
</main>`;

    case '/terms-of-service':
      return `<main>
  <header><a href="/">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Terms of Service</h1>
    <p>Terms of Service for Healing Minds Psychiatry. Understanding the terms and conditions for psychiatric care with Dr. Melva Reve.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Legal">${enLegalLinks}</nav>
  <nav aria-label="Quick Links"><ul>
    <li><a href="/">Home</a></li>
    <li><a href="/contact">Contact</a></li>
    <li><a href="/es/terminos-servicio">Espa&ntilde;ol</a></li>
  </ul></nav>
</main>`;

    case '/hipaa-notice':
      return `<main>
  <header><a href="/">Healing Minds Psychiatry</a></header>
  <section>
    <h1>HIPAA Notice of Privacy Practices</h1>
    <p>HIPAA Notice of Privacy Practices for Healing Minds Psychiatry. Your rights regarding protected health information and privacy.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Legal">${enLegalLinks}</nav>
  <nav aria-label="Quick Links"><ul>
    <li><a href="/">Home</a></li>
    <li><a href="/contact">Contact</a></li>
    <li><a href="/es/aviso-hipaa">Espa&ntilde;ol</a></li>
  </ul></nav>
</main>`;

    case '/cookie-policy':
      return `<main>
  <header><a href="/">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Cookie Policy</h1>
    <p>Cookie Policy for Healing Minds Psychiatry website. Learn about cookies usage, analytics, and your privacy choices.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Legal">${enLegalLinks}</nav>
  <nav aria-label="Quick Links"><ul>
    <li><a href="/">Home</a></li>
    <li><a href="/contact">Contact</a></li>
    <li><a href="/es/politica-cookies">Espa&ntilde;ol</a></li>
  </ul></nav>
</main>`;

    case '/cancellation-policy':
      return `<main>
  <header><a href="/">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Cancellation and No-Show Policy</h1>
    <p>Cancellation and no-show policy for Healing Minds Psychiatry. 24-hour notice required, $50 late fee, with medical emergency exceptions. Naples, FL.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Legal">${enLegalLinks}</nav>
  <nav aria-label="Quick Links"><ul>
    <li><a href="/">Home</a></li>
    <li><a href="/contact">Contact</a></li>
    <li><a href="/es/politica-cancelacion">Espa&ntilde;ol</a></li>
  </ul></nav>
</main>`;

    case '/billing-policy':
      return `<main>
  <header><a href="/">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Billing and Payment Policy</h1>
    <p>Billing and payment policy for Healing Minds Psychiatry. Insurance accepted, copayments, self-pay rates, credit card fees, and payment plans. Naples, FL.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Legal">${enLegalLinks}</nav>
  <nav aria-label="Quick Links"><ul>
    <li><a href="/">Home</a></li>
    <li><a href="/contact">Contact</a></li>
    <li><a href="/es/politica-facturacion">Espa&ntilde;ol</a></li>
  </ul></nav>
</main>`;

    case '/emergency-policy':
      return `<main>
  <header><a href="/">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Emergency and Crisis Policy</h1>
    <p>Emergency and crisis policy for Healing Minds Psychiatry. We are not an emergency service. Florida crisis resources: 911, 988 Suicide &amp; Crisis Lifeline, and the David Lawrence Center.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Legal">${enLegalLinks}</nav>
  <nav aria-label="Quick Links"><ul>
    <li><a href="/">Home</a></li>
    <li><a href="/contact">Contact</a></li>
    <li><a href="/es/politica-emergencias">Espa&ntilde;ol</a></li>
  </ul></nav>
</main>`;

    case '/patient-rights':
      return `<main>
  <header><a href="/">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Patient Rights and Responsibilities</h1>
    <p>Patient rights and responsibilities at Healing Minds Psychiatry. Florida statutory compliance, confidentiality, informed consent, and complaint procedures.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Legal">${enLegalLinks}</nav>
  <nav aria-label="Quick Links"><ul>
    <li><a href="/">Home</a></li>
    <li><a href="/contact">Contact</a></li>
    <li><a href="/es/derechos-paciente">Espa&ntilde;ol</a></li>
  </ul></nav>
</main>`;

    // ── Spanish Legal &amp; Trust Pages ──────────────────────────────────────
    case '/es/politica-privacidad':
      return `<main>
  <header><a href="/es">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Pol&iacute;tica de Privacidad</h1>
    <p>Pol&iacute;tica de Privacidad para Healing Minds Psychiatry. Aprenda c&oacute;mo protegemos su informaci&oacute;n de salud personal y cumplimos con las regulaciones HIPAA.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Legal">${esLegalLinks}</nav>
  <nav aria-label="Enlaces R&aacute;pidos"><ul>
    <li><a href="/es">Inicio</a></li>
    <li><a href="/es/contacto">Contacto</a></li>
    <li><a href="/privacy-policy">English</a></li>
  </ul></nav>
</main>`;

    case '/es/terminos-servicio':
      return `<main>
  <header><a href="/es">Healing Minds Psychiatry</a></header>
  <section>
    <h1>T&eacute;rminos de Servicio</h1>
    <p>T&eacute;rminos de Servicio para Healing Minds Psychiatry. Entendiendo los t&eacute;rminos y condiciones para la atenci&oacute;n psiqui&aacute;trica con la Dra. Melva Reve.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Legal">${esLegalLinks}</nav>
  <nav aria-label="Enlaces R&aacute;pidos"><ul>
    <li><a href="/es">Inicio</a></li>
    <li><a href="/es/contacto">Contacto</a></li>
    <li><a href="/terms-of-service">English</a></li>
  </ul></nav>
</main>`;

    case '/es/aviso-hipaa':
      return `<main>
  <header><a href="/es">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Aviso de Pr&aacute;cticas de Privacidad HIPAA</h1>
    <p>Aviso de Pr&aacute;cticas de Privacidad HIPAA para Healing Minds Psychiatry. Sus derechos con respecto a la informaci&oacute;n de salud protegida y privacidad.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Legal">${esLegalLinks}</nav>
  <nav aria-label="Enlaces R&aacute;pidos"><ul>
    <li><a href="/es">Inicio</a></li>
    <li><a href="/es/contacto">Contacto</a></li>
    <li><a href="/hipaa-notice">English</a></li>
  </ul></nav>
</main>`;

    case '/es/politica-cookies':
      return `<main>
  <header><a href="/es">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Pol&iacute;tica de Cookies</h1>
    <p>Pol&iacute;tica de Cookies para el sitio web de Healing Minds Psychiatry. Aprenda sobre el uso de cookies, an&aacute;lisis y sus opciones de privacidad.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Legal">${esLegalLinks}</nav>
  <nav aria-label="Enlaces R&aacute;pidos"><ul>
    <li><a href="/es">Inicio</a></li>
    <li><a href="/es/contacto">Contacto</a></li>
    <li><a href="/cookie-policy">English</a></li>
  </ul></nav>
</main>`;

    case '/es/politica-cancelacion':
      return `<main>
  <header><a href="/es">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Pol&iacute;tica de Cancelaci&oacute;n y Citas Perdidas</h1>
    <p>Pol&iacute;tica de cancelaci&oacute;n y citas perdidas de Healing Minds Psychiatry. Aviso de 24 horas requerido, cargo de $50, con excepciones por emergencia m&eacute;dica. Naples, FL.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Legal">${esLegalLinks}</nav>
  <nav aria-label="Enlaces R&aacute;pidos"><ul>
    <li><a href="/es">Inicio</a></li>
    <li><a href="/es/contacto">Contacto</a></li>
    <li><a href="/cancellation-policy">English</a></li>
  </ul></nav>
</main>`;

    case '/es/politica-facturacion':
      return `<main>
  <header><a href="/es">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Pol&iacute;tica de Facturaci&oacute;n y Pago</h1>
    <p>Pol&iacute;tica de facturaci&oacute;n y pago de Healing Minds Psychiatry. Seguros aceptados, copagos, tarifas particulares, cargos por tarjeta y planes de pago. Naples, FL.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Legal">${esLegalLinks}</nav>
  <nav aria-label="Enlaces R&aacute;pidos"><ul>
    <li><a href="/es">Inicio</a></li>
    <li><a href="/es/contacto">Contacto</a></li>
    <li><a href="/billing-policy">English</a></li>
  </ul></nav>
</main>`;

    case '/es/politica-emergencias':
      return `<main>
  <header><a href="/es">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Pol&iacute;tica de Emergencias y Crisis</h1>
    <p>Pol&iacute;tica de emergencias y crisis de Healing Minds Psychiatry. No es un servicio de emergencia. Recursos de crisis en Florida: 911, L&iacute;nea 988 de Prevenci&oacute;n del Suicidio y Crisis, y el David Lawrence Center.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Legal">${esLegalLinks}</nav>
  <nav aria-label="Enlaces R&aacute;pidos"><ul>
    <li><a href="/es">Inicio</a></li>
    <li><a href="/es/contacto">Contacto</a></li>
    <li><a href="/emergency-policy">English</a></li>
  </ul></nav>
</main>`;

    case '/es/derechos-paciente':
      return `<main>
  <header><a href="/es">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Derechos y Responsabilidades del Paciente</h1>
    <p>Derechos y responsabilidades del paciente en Healing Minds Psychiatry. Cumplimiento con leyes de Florida, confidencialidad, consentimiento informado y procedimientos de queja.</p>
    ${contactInfo}
  </section>
  <nav aria-label="Legal">${esLegalLinks}</nav>
  <nav aria-label="Enlaces R&aacute;pidos"><ul>
    <li><a href="/es">Inicio</a></li>
    <li><a href="/es/contacto">Contacto</a></li>
    <li><a href="/patient-rights">English</a></li>
  </ul></nav>
</main>`;

    default:
      return null;
  }
}
