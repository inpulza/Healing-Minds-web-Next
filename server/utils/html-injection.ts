import { Request } from 'express';
import { cityHyperlocal, type Lang } from '@/data/locationHyperlocal';
import { locationFAQs } from '@/data/locationFAQs';
import type { BilingualPageContent } from '@/data/pageContent/types';
import { pageContentToHtml, sectionToHtml, inlineToHtml } from './content-html';
import { privacyPolicyContent } from '@/data/pageContent/legal/privacyPolicy';
import { termsOfServiceContent } from '@/data/pageContent/legal/termsOfService';
import { hipaaNoticeContent } from '@/data/pageContent/legal/hipaaNotice';
import { cookiePolicyContent } from '@/data/pageContent/legal/cookiePolicy';
import { cancellationPolicyContent } from '@/data/pageContent/legal/cancellationPolicy';
import { billingPolicyContent } from '@/data/pageContent/legal/billingPolicy';
import { emergencyPolicyContent } from '@/data/pageContent/legal/emergencyPolicy';
import { patientRightsContent } from '@/data/pageContent/legal/patientRights';
import { telehealthConsentContent } from '@/data/pageContent/legal/telehealthConsent';
import { noSurprisesActContent } from '@/data/pageContent/legal/noSurprisesAct';
import { accessibilityStatementContent } from '@/data/pageContent/legal/accessibilityStatement';
import { nondiscriminationNoticeContent } from '@/data/pageContent/legal/nondiscriminationNotice';
import { communicationsPolicyContent } from '@/data/pageContent/legal/communicationsPolicy';
import { medicalDisclaimerContent } from '@/data/pageContent/legal/medicalDisclaimer';
import {
  organizationSocialProfileUrls,
  physicianSocialProfileUrls,
} from '@shared/social-profiles';
import { anxietyTreatmentContent } from '@/data/pageContent/services/anxietyTreatment';
import { depressionTreatmentContent } from '@/data/pageContent/services/depressionTreatment';
import { adhdTreatmentContent } from '@/data/pageContent/services/adhdTreatment';
import { ptsdTreatmentContent } from '@/data/pageContent/services/ptsdTreatment';
import { bipolarTreatmentContent } from '@/data/pageContent/services/bipolarTreatment';
import { medicationManagementContent } from '@/data/pageContent/services/medicationManagement';
import { servicesIndexContent } from '@/data/pageContent/services/servicesIndex';
import { homeContent } from '@/data/pageContent/mainPages/home';
import { aboutContent } from '@/data/pageContent/mainPages/about';
import { contactContent } from '@/data/pageContent/mainPages/contact';
import { forPatientsContent } from '@/data/pageContent/mainPages/forPatients';
import { naplesLocationContent } from '@/data/pageContent/mainPages/naples';
import { telepsychiatryFloridaContent } from '@/data/pageContent/mainPages/telepsychiatryFlorida';
import { forPatientsSectionContent, doctorSectionContent } from '@/data/pageContent/mainPages/sharedSections';
import {
  getBlogIndexPath,
  getBlogPostBySlug,
  getBlogPostPath,
  getBlogPostPlainText,
  getBlogPosts,
  getBlogSlugFromPath,
  getPostTranslations,
  type BlogLanguage,
  type BlogPostWithRelations,
} from '../blog/storage';
import { sanitizeRenderedBlogContentHtml } from '../blog/sanitize';
import { getSelectedBlogPostImages } from '../blog/images/storage';
import { materializeSelectedInlineImages } from '../blog/images/render';
import { getSeoSiteConfig } from '../seo/config';
import { getKnownRoutePaths, getBilingualUrlMap, getSitemapEntries } from '@shared/routeManifest';

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

async function getBlogPostFromPath(path: string): Promise<BlogPostWithRelations | undefined> {
  const match = getBlogSlugFromPath(path);
  if (!match) return undefined;
  const post = await getBlogPostBySlug(match.slug, match.language);
  if (!post) return undefined;
  const images = await getSelectedBlogPostImages(post.id);
  return {
    ...post,
    content: materializeSelectedInlineImages(post.content || '', images),
  };
}

function formatBlogDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getBlogDate(post: BlogPostWithRelations, field: 'published' | 'modified'): Date {
  if (field === 'published') {
    return post.publishedAt || post.createdAt;
  }
  return post.updatedAt || post.publishedAt || post.createdAt;
}

function getBlogSchemaLanguage(language: BlogLanguage): string {
  return language === 'es' ? 'es' : 'en-US';
}

function getBlogDescription(post: BlogPostWithRelations): string {
  return post.metaDescription || post.excerpt || getBlogPostPlainText(post).slice(0, 160);
}

function toAbsoluteBlogAssetUrl(baseUrl: string, value?: string | null): string | null {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return `${baseUrl}${value.startsWith('/') ? value : `/${value}`}`;
}

function getBlogImage(baseUrl: string, post: BlogPostWithRelations): string {
  return toAbsoluteBlogAssetUrl(baseUrl, post.featuredImage) || `${baseUrl}/og-image.png`;
}

function getPhysicianAuthorSchema(baseUrl: string, author?: BlogPostWithRelations['author']) {
  return {
    "@type": "Person",
    "@id": `${baseUrl}/#physician`,
    "name": author?.name || "Dr. Melva Reve Urgelles",
    "honorificPrefix": "Dr.",
    "jobTitle": author?.title || "Psychiatrist",
    "description": author?.bio || "Psychiatrist specializing in anxiety, depression, ADHD, and PTSD treatment. Bilingual in English and Spanish.",
    "image": author?.imageUrl || `${baseUrl}/doctor-profile-v2.webp`,
    "medicalSpecialty": "Psychiatry",
    "identifier": {
      "@type": "PropertyValue",
      "propertyID": "NPI",
      "value": "1982233631"
    },
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Medical Doctor"
      }
    ],
    "sameAs": [
      "https://www.healthgrades.com/physician/dr-melva-reve-urgelles-1dgbqeci76",
      "https://weprevent.org/listing/dr-melva-reve-urgelles-md-vc998mp/",
      "https://npiregistry.cms.hhs.gov/provider-view/1982233631",
      ...physicianSocialProfileUrls
    ],
    "knowsLanguage": ["English", "Spanish"],
    "worksFor": {
      "@id": `${baseUrl}/#organization`
    }
  };
}

function buildBlogAlternateLinks(baseUrl: string, translations: BlogPostWithRelations[]): MetaTag[] {
  const links: MetaTag[] = [];
  const byLanguage = new Map<BlogLanguage, BlogPostWithRelations>();
  for (const post of translations) {
    if (post.language === 'en' || post.language === 'es') {
      byLanguage.set(post.language, post);
    }
  }

  for (const language of ['en', 'es'] as const) {
    const post = byLanguage.get(language);
    if (post) {
      links.push({
        rel: 'alternate',
        hreflang: language,
        href: `${baseUrl}${getBlogPostPath(post)}`,
      });
    }
  }

  const defaultPost = byLanguage.get('en') || translations[0];
  if (defaultPost) {
    links.push({
      rel: 'alternate',
      hreflang: 'x-default',
      href: `${baseUrl}${getBlogPostPath(defaultPost)}`,
    });
  }

  return links;
}

function safeJsonForInlineScript(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
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
  const faqs = locationFAQs[city.key]?.[lang] ?? [];
  const isEs = lang === 'es';
  const home = isEs ? '/es' : '/';
  const altPath = isEs ? `/locations/${city.enSlug}` : `/es/ubicaciones/${city.esSlug}`;
  const contactPath = isEs ? '/es/contacto' : '/contact';
  const aboutPath = isEs ? '/es/acerca-de' : '/about';
  const neighborhoods = data.neighborhoods[lang]
    .map(n => `<li>${escapeHtml(n)}</li>`)
    .join('\n      ');
  const badges = data.featureBadges
    .map(b => `<li>${escapeHtml(b[lang])}</li>`)
    .join('\n      ');
  const serviceNotes = data.serviceNotes[lang]
    .map(n => `<li>${escapeHtml(n)}</li>`)
    .join('\n      ');
  const routeSteps = data.routeSteps[lang]
    .map(s => `<li>${escapeHtml(s)}</li>`)
    .join('\n      ');
  const faqBlocks = faqs
    .map(f => `<h3>${escapeHtml(f.question)}</h3>\n    <p>${escapeHtml(f.answer)}</p>`)
    .join('\n    ');

  const t = isEs
    ? {
        h1: `Su Psiquiatra de Confianza en ${city.cityName}, FL`,
        localHeading: `Atención Local en ${city.cityName}`,
        neighborhoodsHeading: 'Vecindarios que Atendemos',
        servicesHeading: 'Servicios en Esta Ubicación',
        directionsHeading: 'Cómo Llegar a Nuestra Oficina',
        durationLabel: 'Duración del trayecto',
        faqHeading: 'Preguntas Frecuentes',
        faqIntro: 'Encuentre respuestas a preguntas comunes sobre atención psiquiátrica y nuestros servicios.',
        servicesNav: 'Servicios',
        areasNav: 'Otras Áreas',
        quickNav: 'Enlaces Rápidos',
        schedule: 'Programar Cita',
        about: 'Sobre la Dra. Melva Reve',
        altLabel: 'English',
      }
    : {
        h1: `Your Trusted Psychiatrist in ${city.cityName}, FL`,
        localHeading: `Local Care in ${city.cityName}`,
        neighborhoodsHeading: 'Neighborhoods We Serve',
        servicesHeading: 'Services at This Location',
        directionsHeading: 'How to Get to Our Office',
        durationLabel: 'Drive time',
        faqHeading: 'Frequently Asked Questions',
        faqIntro: 'Find answers to common questions about psychiatric care and our services.',
        servicesNav: 'Services',
        areasNav: 'Nearby Areas',
        quickNav: 'Quick Links',
        schedule: 'Schedule Appointment',
        about: 'About Dr. Melva Reve',
        altLabel: 'Español',
      };

  const faqSection = faqs.length
    ? `
  <section>
    <h2>${escapeHtml(t.faqHeading)}</h2>
    <p>${escapeHtml(t.faqIntro)}</p>
    ${faqBlocks}
  </section>`
    : '';

  return `<main>
  <header><a href="${home}">Healing Minds Psychiatry</a></header>
  <section>
    <h1>${escapeHtml(t.h1)}</h1>
    <p>${escapeHtml(data.heroDescription[lang])}</p>
    <ul>
      ${badges}
    </ul>
    <p>${escapeHtml(data.healingParagraph[lang])}</p>
    ${links.contactInfo}
  </section>
  <section>
    <h2>${escapeHtml(t.servicesHeading)}</h2>
    <p>${escapeHtml(data.servicesIntro[lang])}</p>
    <p>${escapeHtml(data.seo.serviceDescription[lang])}</p>
    <ul>
      ${serviceNotes}
    </ul>
  </section>
  <section>
    <h2>${escapeHtml(t.localHeading)}</h2>
    <p>${escapeHtml(data.localContext[lang])}</p>
    <h3>${escapeHtml(t.neighborhoodsHeading)}</h3>
    <ul>
      ${neighborhoods}
    </ul>
  </section>
  <section>
    <h2>${escapeHtml(t.directionsHeading)}</h2>
    <p>${escapeHtml(data.routeIntro[lang])}</p>
    <ol>
      ${routeSteps}
    </ol>
    <p>${escapeHtml(t.durationLabel)}: ${escapeHtml(data.duration[lang])}</p>
    <p>${escapeHtml(data.bottomNote[lang])}</p>
  </section>${faqSection}
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
export async function injectMetaTags(html: string, req: Request): Promise<string> {
  const url = req.originalUrl;
  const baseUrl = getSeoSiteConfig().siteBaseUrl;
  
  // Define page-specific meta data
  const pageMetaData = await getPageMetaData(url, baseUrl);
  
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

  // 4b) Blog posts get the same payload shape as the API in the initial HTML.
  // This lets the React page render synchronously and avoids a blank article
  // shell while the client refetches in the background.
  const blogPostForClient = await getBlogPostFromPath(pathOnly);
  if (blogPostForClient) {
    const inlineData = safeJsonForInlineScript({
      success: true,
      data: blogPostForClient,
    });
    modifiedHtml = modifiedHtml.replace(
      '</head>',
      `    <script>window.__SSR_BLOG_POST__ = ${inlineData};</script>\n  </head>`
    );
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
    const staticBody = await getStaticPageBody(pathOnly, baseUrl);
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
 * This is the source of truth for 404 vs. 200 decisions.
 * Static routes come from the single route manifest (shared/routeManifest.ts).
 */
const KNOWN_ROUTES: ReadonlySet<string> = new Set(getKnownRoutePaths());

/**
 * Returns true when the given URL path corresponds to a real route we serve.
 * Accepts either a bare path ("/about") or a full URL with query/hash; everything
 * after "?" or "#" is ignored, and a single trailing slash is tolerated so that
 * "/about/" still resolves to true (it will be 301-normalized separately).
 */
export async function isKnownRoute(urlOrPath: string): Promise<boolean> {
  if (!urlOrPath) return false;
  // Strip query string and hash before lookup.
  let path = urlOrPath.split('?')[0].split('#')[0];
  // Tolerate one trailing slash (real normalization happens via 301 redirect).
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  if (KNOWN_ROUTES.has(path)) return true;
  return Boolean(await getBlogPostFromPath(path));
}

/**
 * Define meta data specific to each route
 */
async function getPageMetaData(url: string, baseUrl: string): Promise<PageMeta | null> {
  // Normalize URL for matching: strip query string and hash, then a single
  // trailing slash so "/about?utm=x" and "/about/" both resolve to "/about".
  const pathOnly = url.split('?')[0].split('#')[0];
  const normalizedUrl = pathOnly.replace(/\/$/, '') || '/';

  if (normalizedUrl === '/admin' || normalizedUrl.startsWith('/admin/')) {
    const canonical = `${baseUrl}${normalizedUrl}`;
    return {
      title: 'Admin | Healing Minds Psychiatry',
      description: 'Private admin area for Healing Minds Psychiatry.',
      canonical,
      metaTags: [
        {
          name: 'robots',
          content: 'noindex, nofollow',
        },
        {
          name: 'description',
          content: 'Private admin area for Healing Minds Psychiatry.',
        },
        {
          property: 'og:title',
          content: 'Admin | Healing Minds Psychiatry',
        },
        {
          property: 'og:description',
          content: 'Private admin area for Healing Minds Psychiatry.',
        },
        {
          property: 'og:url',
          content: canonical,
        },
      ],
    };
  }

  if (normalizedUrl === '/blog' || normalizedUrl === '/es/blog') {
    const language: BlogLanguage = normalizedUrl === '/es/blog' ? 'es' : 'en';
    const title = language === 'es'
      ? 'Blog de Salud Mental | Healing Minds Psychiatry'
      : 'Mental Health Blog | Healing Minds Psychiatry';
    const description = language === 'es'
      ? 'Articulos educativos de Healing Minds Psychiatry sobre ansiedad, telepsiquiatria, manejo de medicamentos y atencion psiquiatrica en Naples y Florida.'
      : 'Educational articles from Healing Minds Psychiatry about anxiety, telepsychiatry, medication management, and psychiatric care in Naples and Florida.';
    const canonical = `${baseUrl}${getBlogIndexPath(language)}`;
    return {
      title,
      description,
      canonical,
      schema: await getBlogSchema(baseUrl, language),
      metaTags: [
        {
          name: 'description',
          content: description,
        },
        {
          property: 'og:title',
          content: title,
        },
        {
          property: 'og:description',
          content: description,
        },
        {
          property: 'og:url',
          content: canonical,
        },
        {
          rel: 'alternate',
          hreflang: 'en',
          href: `${baseUrl}/blog`,
        },
        {
          rel: 'alternate',
          hreflang: 'es',
          href: `${baseUrl}/es/blog`,
        },
        {
          rel: 'alternate',
          hreflang: 'x-default',
          href: `${baseUrl}/blog`,
        },
      ],
    };
  }

  const blogPost = await getBlogPostFromPath(normalizedUrl);
  if (blogPost) {
    const translations = await getPostTranslations(blogPost.translationGroupId);
    const alternateLinks = buildBlogAlternateLinks(baseUrl, translations);
    return {
      title: blogPost.metaTitle || blogPost.title,
      description: blogPost.metaDescription || blogPost.excerpt || undefined,
      canonical: `${baseUrl}${getBlogPostPath(blogPost)}`,
      schemas: [
        getBlogPostSchema(baseUrl, blogPost),
        getBreadcrumbListSchema(baseUrl, normalizedUrl),
      ],
      metaTags: [
        {
          name: 'description',
          content: blogPost.metaDescription || blogPost.excerpt || '',
        },
        {
          property: 'og:title',
          content: blogPost.metaTitle || blogPost.title,
        },
        {
          property: 'og:description',
          content: blogPost.metaDescription || blogPost.excerpt || '',
        },
        {
          property: 'og:url',
          content: `${baseUrl}${getBlogPostPath(blogPost)}`,
        },
        ...(blogPost.featuredImage ? [
          {
            property: 'og:image',
            content: getBlogImage(baseUrl, blogPost),
          },
          {
            property: 'og:image:alt',
            content: blogPost.featuredImageAlt || blogPost.title,
          },
          {
            name: 'twitter:image',
            content: getBlogImage(baseUrl, blogPost),
          },
          {
            name: 'twitter:image:alt',
            content: blogPost.featuredImageAlt || blogPost.title,
          },
        ] : []),
        {
          property: 'article:published_time',
          content: (blogPost.publishedAt || blogPost.createdAt).toISOString(),
        },
        {
          property: 'article:modified_time',
          content: blogPost.updatedAt.toISOString(),
        },
        ...alternateLinks,
      ],
    };
  }

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
            content: 'La psiquiatra Dra. Melva Reve brinda atención psiquiátrica experta en Naples, FL. Especializada en ansiedad, depresión, TDAH y terapia. Servicios de salud mental para el suroeste de Florida.'
          },
          {
            property: 'og:title',
            content: 'Dra. Melva Reve - Psiquiatra Naples FL | Healing Minds Psychiatry'
          },
          {
            property: 'og:description',
            content: 'Psiquiatra con licencia en Naples, FL. Tratamiento experto para ansiedad, depresión, TDAH, TEPT. Atención bilingüe disponible.'
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
            content: 'Conozca a la Dra. Melva Reve, psiquiatra con más de 15 años de experiencia sirviendo Naples, FL. Atención bilingüe con sensibilidad cultural.'
          },
          {
            property: 'og:title',
            content: 'Acerca de la Dra. Melva Reve - Psiquiatra Naples FL | Healing Minds'
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

    // California landing pages (EN + ES) - noindex ad landing pages
    case '/psychiatrist-california':
      return {
        title: 'Online Psychiatrist in Spanish | California | Healing Minds',
        canonical: `${baseUrl}/psychiatrist-california`,
        schema: getCaliforniaServiceSchema(baseUrl, 'en'),
        metaTags: [
          { name: 'robots', content: 'noindex, follow' },
          { name: 'description', content: 'A psychiatrist who sees you in Spanish from home, anywhere in California. Anxiety, depression and ADHD. Direct pay, clear pricing, no insurance.' },
          { property: 'og:title', content: 'Online Psychiatrist in Spanish | California | Healing Minds' },
          { property: 'og:description', content: 'A psychiatrist who sees you in Spanish from home, anywhere in California. Anxiety, depression and ADHD. Direct pay, clear pricing, no insurance.' },
          { property: 'og:url', content: `${baseUrl}/psychiatrist-california` },
          { rel: 'alternate', hreflang: 'en', href: `${baseUrl}/psychiatrist-california` },
          { rel: 'alternate', hreflang: 'es', href: `${baseUrl}/es/psiquiatra-california` },
        ],
      };

    case '/es/psiquiatra-california':
      return {
        title: 'Psiquiatra Online en Español | California | Healing Minds',
        canonical: `${baseUrl}/es/psiquiatra-california`,
        schema: getCaliforniaServiceSchema(baseUrl, 'es'),
        metaTags: [
          { name: 'robots', content: 'noindex, follow' },
          { name: 'description', content: 'Psiquiatra que te atiende en español desde tu casa, en California. Ansiedad, depresión y TDAH. Pago directo, precio claro, sin seguros.' },
          { property: 'og:title', content: 'Psiquiatra Online en Español | California | Healing Minds' },
          { property: 'og:description', content: 'Psiquiatra que te atiende en español desde tu casa, en California. Ansiedad, depresión y TDAH. Pago directo, precio claro, sin seguros.' },
          { property: 'og:url', content: `${baseUrl}/es/psiquiatra-california` },
          { rel: 'alternate', hreflang: 'en', href: `${baseUrl}/psychiatrist-california` },
          { rel: 'alternate', hreflang: 'es', href: `${baseUrl}/es/psiquiatra-california` },
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

    case '/telehealth-consent':
      return {
        canonical: `${baseUrl}/telehealth-consent`,
        metaTags: [
          { name: 'description', content: 'Telehealth informed consent at Healing Minds Psychiatry. Benefits, limitations, privacy and patient responsibilities for psychiatric video visits in Florida and California.' },
          { property: 'og:title', content: 'Telehealth Informed Consent - Healing Minds Psychiatry' },
          { property: 'og:url', content: `${baseUrl}/telehealth-consent` },
          { rel: 'alternate', hreflang: 'en', href: `${baseUrl}/telehealth-consent` },
          { rel: 'alternate', hreflang: 'es', href: `${baseUrl}/es/consentimiento-telesalud` },
        ],
      };

    case '/es/consentimiento-telesalud':
      return {
        canonical: `${baseUrl}/es/consentimiento-telesalud`,
        metaTags: [
          { name: 'description', content: 'Consentimiento informado de telesalud en Healing Minds Psychiatry. Beneficios, limitaciones, privacidad y responsabilidades del paciente para visitas psiquiátricas por video en Florida y California.' },
          { property: 'og:title', content: 'Consentimiento Informado de Telesalud - Healing Minds Psychiatry' },
          { property: 'og:url', content: `${baseUrl}/es/consentimiento-telesalud` },
          { rel: 'alternate', hreflang: 'en', href: `${baseUrl}/telehealth-consent` },
          { rel: 'alternate', hreflang: 'es', href: `${baseUrl}/es/consentimiento-telesalud` },
        ],
      };

    case '/no-surprises-act':
      return {
        canonical: `${baseUrl}/no-surprises-act`,
        metaTags: [
          { name: 'description', content: 'No Surprises Act notice at Healing Minds Psychiatry. Your rights against surprise medical bills and the right to a Good Faith Estimate for self-pay patients.' },
          { property: 'og:title', content: 'No Surprises Act and Good Faith Estimate - Healing Minds Psychiatry' },
          { property: 'og:url', content: `${baseUrl}/no-surprises-act` },
          { rel: 'alternate', hreflang: 'en', href: `${baseUrl}/no-surprises-act` },
          { rel: 'alternate', hreflang: 'es', href: `${baseUrl}/es/ley-sin-sorpresas` },
        ],
      };

    case '/es/ley-sin-sorpresas':
      return {
        canonical: `${baseUrl}/es/ley-sin-sorpresas`,
        metaTags: [
          { name: 'description', content: 'Aviso de la Ley Sin Sorpresas en Healing Minds Psychiatry. Sus derechos contra facturas médicas sorpresa y el derecho a un Estimado de Buena Fe para pacientes de pago directo.' },
          { property: 'og:title', content: 'Ley Sin Sorpresas y Estimado de Buena Fe - Healing Minds Psychiatry' },
          { property: 'og:url', content: `${baseUrl}/es/ley-sin-sorpresas` },
          { rel: 'alternate', hreflang: 'en', href: `${baseUrl}/no-surprises-act` },
          { rel: 'alternate', hreflang: 'es', href: `${baseUrl}/es/ley-sin-sorpresas` },
        ],
      };

    case '/accessibility-statement':
      return {
        canonical: `${baseUrl}/accessibility-statement`,
        metaTags: [
          { name: 'description', content: 'Accessibility statement of Healing Minds Psychiatry. Our commitment to WCAG 2.1 AA web accessibility, available accommodations and how to request assistance.' },
          { property: 'og:title', content: 'Accessibility Statement - Healing Minds Psychiatry' },
          { property: 'og:url', content: `${baseUrl}/accessibility-statement` },
          { rel: 'alternate', hreflang: 'en', href: `${baseUrl}/accessibility-statement` },
          { rel: 'alternate', hreflang: 'es', href: `${baseUrl}/es/declaracion-accesibilidad` },
        ],
      };

    case '/es/declaracion-accesibilidad':
      return {
        canonical: `${baseUrl}/es/declaracion-accesibilidad`,
        metaTags: [
          { name: 'description', content: 'Declaración de accesibilidad de Healing Minds Psychiatry. Nuestro compromiso con la accesibilidad web WCAG 2.1 AA, adaptaciones disponibles y cómo solicitar asistencia.' },
          { property: 'og:title', content: 'Declaración de Accesibilidad - Healing Minds Psychiatry' },
          { property: 'og:url', content: `${baseUrl}/es/declaracion-accesibilidad` },
          { rel: 'alternate', hreflang: 'en', href: `${baseUrl}/accessibility-statement` },
          { rel: 'alternate', hreflang: 'es', href: `${baseUrl}/es/declaracion-accesibilidad` },
        ],
      };

    case '/nondiscrimination-notice':
      return {
        canonical: `${baseUrl}/nondiscrimination-notice`,
        metaTags: [
          { name: 'description', content: 'Nondiscrimination notice of Healing Minds Psychiatry. Free language assistance and aids for people with disabilities. How to file a civil rights complaint.' },
          { property: 'og:title', content: 'Nondiscrimination Notice - Healing Minds Psychiatry' },
          { property: 'og:url', content: `${baseUrl}/nondiscrimination-notice` },
          { rel: 'alternate', hreflang: 'en', href: `${baseUrl}/nondiscrimination-notice` },
          { rel: 'alternate', hreflang: 'es', href: `${baseUrl}/es/aviso-no-discriminacion` },
        ],
      };

    case '/es/aviso-no-discriminacion':
      return {
        canonical: `${baseUrl}/es/aviso-no-discriminacion`,
        metaTags: [
          { name: 'description', content: 'Aviso de no discriminación de Healing Minds Psychiatry. Asistencia gratuita de idiomas y ayudas para personas con discapacidades. Cómo presentar una queja de derechos civiles.' },
          { property: 'og:title', content: 'Aviso de No Discriminación - Healing Minds Psychiatry' },
          { property: 'og:url', content: `${baseUrl}/es/aviso-no-discriminacion` },
          { rel: 'alternate', hreflang: 'en', href: `${baseUrl}/nondiscrimination-notice` },
          { rel: 'alternate', hreflang: 'es', href: `${baseUrl}/es/aviso-no-discriminacion` },
        ],
      };

    case '/communications-policy':
      return {
        canonical: `${baseUrl}/communications-policy`,
        metaTags: [
          { name: 'description', content: 'Communications policy of Healing Minds Psychiatry. SMS, WhatsApp and email consent, opt-out instructions (STOP/HELP), privacy considerations and emergency guidance.' },
          { property: 'og:title', content: 'Communications Policy - Healing Minds Psychiatry' },
          { property: 'og:url', content: `${baseUrl}/communications-policy` },
          { rel: 'alternate', hreflang: 'en', href: `${baseUrl}/communications-policy` },
          { rel: 'alternate', hreflang: 'es', href: `${baseUrl}/es/politica-comunicaciones` },
        ],
      };

    case '/es/politica-comunicaciones':
      return {
        canonical: `${baseUrl}/es/politica-comunicaciones`,
        metaTags: [
          { name: 'description', content: 'Política de comunicaciones de Healing Minds Psychiatry. Consentimiento para SMS, WhatsApp y correo, cómo darse de baja (STOP/AYUDA), privacidad y guía de emergencias.' },
          { property: 'og:title', content: 'Política de Comunicaciones - Healing Minds Psychiatry' },
          { property: 'og:url', content: `${baseUrl}/es/politica-comunicaciones` },
          { rel: 'alternate', hreflang: 'en', href: `${baseUrl}/communications-policy` },
          { rel: 'alternate', hreflang: 'es', href: `${baseUrl}/es/politica-comunicaciones` },
        ],
      };

    case '/medical-disclaimer':
      return {
        canonical: `${baseUrl}/medical-disclaimer`,
        metaTags: [
          { name: 'description', content: 'Medical disclaimer of Healing Minds Psychiatry. Website and blog content is educational only and does not replace professional psychiatric evaluation or treatment.' },
          { property: 'og:title', content: 'Medical Disclaimer - Healing Minds Psychiatry' },
          { property: 'og:url', content: `${baseUrl}/medical-disclaimer` },
          { rel: 'alternate', hreflang: 'en', href: `${baseUrl}/medical-disclaimer` },
          { rel: 'alternate', hreflang: 'es', href: `${baseUrl}/es/descargo-responsabilidad-medica` },
        ],
      };

    case '/es/descargo-responsabilidad-medica':
      return {
        canonical: `${baseUrl}/es/descargo-responsabilidad-medica`,
        metaTags: [
          { name: 'description', content: 'Descargo de responsabilidad médica de Healing Minds Psychiatry. El contenido del sitio y del blog es educativo y no reemplaza la evaluación ni el tratamiento psiquiátrico profesional.' },
          { property: 'og:title', content: 'Descargo de Responsabilidad Médica - Healing Minds Psychiatry' },
          { property: 'og:url', content: `${baseUrl}/es/descargo-responsabilidad-medica` },
          { rel: 'alternate', hreflang: 'en', href: `${baseUrl}/medical-disclaimer` },
          { rel: 'alternate', hreflang: 'es', href: `${baseUrl}/es/descargo-responsabilidad-medica` },
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

/**
 * Service schema for the California telehealth landing pages.
 * Intentionally has NO address/geo data (the practice has no California office)
 * and references the organization by @id only, so no Naples clinic data leaks in.
 * No FAQPage schema is emitted for these pages (they are noindex ad landings).
 */
function getCaliforniaServiceSchema(baseUrl: string, lang: 'en' | 'es') {
  const path = lang === 'en' ? '/psychiatrist-california' : '/es/psiquiatra-california';
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${baseUrl}${path}#service`,
    "name": lang === 'en'
      ? 'Online Psychiatric Care in Spanish for California'
      : 'Atención Psiquiátrica Online en Español para California',
    "serviceType": lang === 'en' ? 'Telepsychiatry' : 'Telepsiquiatría',
    "description": lang === 'en'
      ? 'Psychiatric evaluation and treatment follow-up for adults by video call, in Spanish, for patients located in California. Anxiety, depression and ADHD. Direct pay.'
      : 'Evaluación psiquiátrica y seguimiento del tratamiento para adultos por videollamada, en español, para pacientes en California. Ansiedad, depresión y TDAH. Pago directo.',
    "url": `${baseUrl}${path}`,
    "areaServed": {
      "@type": "State",
      "name": "California",
      "addressCountry": "US"
    },
    "provider": {
      "@id": "https://www.healingmindsp.com/#organization"
    },
    "availableLanguage": ["Spanish", "English"]
  };
}

async function getBlogSchema(baseUrl: string, language: BlogLanguage) {
  const posts = await getBlogPosts({ status: 'published', language, limit: 20 });
  const blogPath = getBlogIndexPath(language);
  const isSpanish = language === 'es';
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${baseUrl}${blogPath}#blog`,
    "name": isSpanish ? "Blog de Salud Mental de Healing Minds Psychiatry" : "Healing Minds Psychiatry Blog",
    "description": isSpanish
      ? "Articulos educativos de salud mental de Healing Minds Psychiatry."
      : "Educational mental health articles from Healing Minds Psychiatry.",
    "url": `${baseUrl}${blogPath}`,
    "inLanguage": getBlogSchemaLanguage(language),
    "publisher": {
      "@id": `${baseUrl}/#organization`
    },
    "blogPost": posts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "url": `${baseUrl}${getBlogPostPath(post)}`,
      "datePublished": getBlogDate(post, 'published').toISOString(),
      "dateModified": getBlogDate(post, 'modified').toISOString(),
      "author": {
        "@id": `${baseUrl}/#physician`
      }
    }))
  };
}

function getBlogPostSchema(baseUrl: string, post: BlogPostWithRelations) {
  const plainText = getBlogPostPlainText(post);
  const postUrl = `${baseUrl}${getBlogPostPath(post)}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${postUrl}#blogposting`,
    "headline": post.title,
    "description": getBlogDescription(post),
    "articleBody": plainText,
    "url": postUrl,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl
    },
    "datePublished": getBlogDate(post, 'published').toISOString(),
    "dateModified": getBlogDate(post, 'modified').toISOString(),
    "author": getPhysicianAuthorSchema(baseUrl, post.author),
    "publisher": {
      "@id": `${baseUrl}/#organization`
    },
    "isPartOf": {
      "@id": `${baseUrl}/#website`
    },
    "image": getBlogImage(baseUrl, post),
    "about": post.tags.map(tag => tag.name),
    "articleSection": post.category?.name,
    "inLanguage": getBlogSchemaLanguage(post.language as BlogLanguage),
    "wordCount": plainText.split(/\s+/).filter(Boolean).length
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
      "name": isEs ? "Servicios Psiquiátricos" : "Psychiatric Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": isEs ? "Tratamiento de Ansiedad" : "Anxiety Treatment"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": isEs ? "Tratamiento de Depresión" : "Depression Treatment"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": isEs ? "Tratamiento de TDAH" : "ADHD Treatment"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": isEs ? "Tratamiento de TEPT" : "PTSD Treatment"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": isEs ? "Manejo de Medicamentos" : "Medication Management"
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
      'blog': 'Blog',
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
      "https://www.yelp.com/biz/healing-minds-psychiatry-naples",
      ...organizationSocialProfileUrls
    ],
    "hasMap": "https://www.google.com/maps/place/Healing+Minds+Psychiatry/@26.2044803,-81.8021344,17z",
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
        "https://npiregistry.cms.hhs.gov/provider-view/1982233631",
        ...physicianSocialProfileUrls
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

async function buildBlogIndexBody(baseUrl: string, contactInfo: string, language: BlogLanguage): Promise<string> {
  const posts = await getBlogPosts({ status: 'published', language, limit: 50 });
  const isSpanish = language === 'es';
  const postLinks = posts.map(post => `<article>
    <p>${escapeHtml(post.category?.name || (isSpanish ? 'Salud Mental' : 'Mental Health'))} - ${formatBlogDate(getBlogDate(post, 'published'))} - ${post.readingTime || 5} min ${isSpanish ? 'lectura' : 'read'}</p>
    <h2><a href="${getBlogPostPath(post)}">${escapeHtml(post.title)}</a></h2>
    <p>${escapeHtml(post.excerpt || '')}</p>
  </article>`).join('\n');

  return `<main>
  <header><a href="${isSpanish ? '/es' : '/'}">Healing Minds Psychiatry</a></header>
  <section>
    <h1>${isSpanish ? 'Blog de Salud Mental' : 'Mental Health Blog'}</h1>
    <p>${isSpanish
      ? 'Articulos educativos de Healing Minds Psychiatry sobre ansiedad, telepsiquiatria, manejo de medicamentos y atencion psiquiatrica para pacientes en Naples y Florida.'
      : 'Educational articles from Healing Minds Psychiatry about anxiety, telepsychiatry, medication management, and psychiatric care for patients in Naples and across Florida.'}</p>
    ${contactInfo}
  </section>
  <section aria-label="Published articles">
    ${postLinks || `<p>${isSpanish ? 'Todavia no hay articulos publicados.' : 'No articles are published yet.'}</p>`}
  </section>
  <nav aria-label="Blog navigation"><ul>
    <li><a href="${isSpanish ? '/es/servicios' : '/services'}">${isSpanish ? 'Servicios Psiquiatricos' : 'Psychiatric Services'}</a></li>
    <li><a href="${isSpanish ? '/es/telepsiquiatria-florida' : '/telepsychiatry-florida'}">${isSpanish ? 'Telepsiquiatria en Florida' : 'Telepsychiatry in Florida'}</a></li>
    <li><a href="${isSpanish ? '/es/contacto' : '/contact'}">${isSpanish ? 'Programar una cita' : 'Schedule an Appointment'}</a></li>
  </ul></nav>
</main>`;
}

function buildBlogPostBody(post: BlogPostWithRelations, contactInfo: string): string {
  const isSpanish = post.language === 'es';
  const safeContent = sanitizeRenderedBlogContentHtml(post.content || '');
  const tags = post.tags.map(tag => `<li>${escapeHtml(tag.name)}</li>`).join('\n      ');

  return `<main>
  <header><a href="${isSpanish ? '/es' : '/'}">Healing Minds Psychiatry</a> / <a href="${getBlogIndexPath(post.language as BlogLanguage)}">Blog</a></header>
  <article>
    <p>${escapeHtml(post.category?.name || (isSpanish ? 'Salud Mental' : 'Mental Health'))} - ${formatBlogDate(getBlogDate(post, 'published'))} - ${post.readingTime || 5} min ${isSpanish ? 'lectura' : 'read'}</p>
    <p>${escapeHtml(post.author?.name || 'Dr. Melva Reve Urgelles')}</p>
    <h1>${escapeHtml(post.title)}</h1>
    <p>${escapeHtml(post.excerpt || '')}</p>
    ${safeContent}
    <footer>
      <p>${isSpanish
        ? 'Contenido educativo de Healing Minds Psychiatry. Este articulo no sustituye la atencion de emergencia ni el consejo medico individual.'
        : 'Educational content from Healing Minds Psychiatry. This article is not a substitute for emergency care or individualized medical advice.'}</p>
      <ul>
        ${tags}
      </ul>
      ${contactInfo}
    </footer>
  </article>
  <nav aria-label="Related links"><ul>
    <li><a href="${getBlogIndexPath(post.language as BlogLanguage)}">${isSpanish ? 'Volver al blog' : 'Back to the blog'}</a></li>
    <li><a href="${isSpanish ? '/es/servicios' : '/services'}">${isSpanish ? 'Servicios Psiquiatricos' : 'Psychiatric Services'}</a></li>
    <li><a href="${isSpanish ? '/es/contacto' : '/contact'}">${isSpanish ? 'Contactar a Healing Minds Psychiatry' : 'Contact Healing Minds Psychiatry'}</a></li>
  </ul></nav>
</main>`;
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
 *   - Blog index and published blog posts
 *   - 8 legal/trust pages: privacy-policy, terms-of-service, hipaa-notice,
 *     cookie-policy, cancellation-policy, billing-policy, emergency-policy,
 *     patient-rights
 */
// ── Module-backed crawler bodies ─────────────────────────────────────────────
// Bot bodies for content pages are serialized from the same shared modules the
// React pages render (client/src/data/pageContent/*), guaranteeing word/H1
// parity between the crawler view and the visible page.

type BotBodyKind = 'home' | 'main' | 'service' | 'legal' | 'location';

interface BotContentEntry {
  content: BilingualPageContent;
  lang: Lang;
  kind: BotBodyKind;
  altPath?: string;
  /** Optional locationFAQs key whose Q&A the visible page also renders. */
  faqKey?: keyof typeof locationFAQs;
  /** Shared section modules (sharedSections.ts) the visible page also renders. */
  extra?: BilingualPageContent[];
}

const BOT_CONTENT_PAGES: Array<{
  en: string;
  content: BilingualPageContent;
  kind: BotBodyKind;
  faqKey?: keyof typeof locationFAQs;
  extra?: BilingualPageContent[];
}> = [
  { en: '/', content: homeContent, kind: 'home', extra: [forPatientsSectionContent, doctorSectionContent] },
  { en: '/about', content: aboutContent, kind: 'main' },
  { en: '/contact', content: contactContent, kind: 'main' },
  { en: '/services', content: servicesIndexContent, kind: 'main' },
  { en: '/for-patients', content: forPatientsContent, kind: 'main', extra: [forPatientsSectionContent] },
  { en: '/telepsychiatry-florida', content: telepsychiatryFloridaContent, kind: 'main', faqKey: 'telehealth', extra: [doctorSectionContent] },
  { en: '/locations/psychiatrist-naples', content: naplesLocationContent, kind: 'location' },
  { en: '/services/anxiety-treatment', content: anxietyTreatmentContent, kind: 'service' },
  { en: '/services/depression-treatment', content: depressionTreatmentContent, kind: 'service' },
  { en: '/services/adhd-treatment', content: adhdTreatmentContent, kind: 'service' },
  { en: '/services/ptsd-treatment', content: ptsdTreatmentContent, kind: 'service' },
  { en: '/services/bipolar-treatment', content: bipolarTreatmentContent, kind: 'service' },
  { en: '/services/medication-management', content: medicationManagementContent, kind: 'service' },
  { en: '/privacy-policy', content: privacyPolicyContent, kind: 'legal' },
  { en: '/terms-of-service', content: termsOfServiceContent, kind: 'legal' },
  { en: '/hipaa-notice', content: hipaaNoticeContent, kind: 'legal' },
  { en: '/cookie-policy', content: cookiePolicyContent, kind: 'legal' },
  { en: '/cancellation-policy', content: cancellationPolicyContent, kind: 'legal' },
  { en: '/billing-policy', content: billingPolicyContent, kind: 'legal' },
  { en: '/emergency-policy', content: emergencyPolicyContent, kind: 'legal' },
  { en: '/patient-rights', content: patientRightsContent, kind: 'legal' },
  { en: '/telehealth-consent', content: telehealthConsentContent, kind: 'legal' },
  { en: '/no-surprises-act', content: noSurprisesActContent, kind: 'legal' },
  { en: '/accessibility-statement', content: accessibilityStatementContent, kind: 'legal' },
  { en: '/nondiscrimination-notice', content: nondiscriminationNoticeContent, kind: 'legal' },
  { en: '/communications-policy', content: communicationsPolicyContent, kind: 'legal' },
  { en: '/medical-disclaimer', content: medicalDisclaimerContent, kind: 'legal' },
];

export const BOT_CONTENT_BY_PATH: Record<string, BotContentEntry> = (() => {
  const bilingualMap = getBilingualUrlMap();
  const byPath: Record<string, BotContentEntry> = {};
  for (const page of BOT_CONTENT_PAGES) {
    const esPath = bilingualMap[page.en];
    byPath[page.en] = { content: page.content, lang: 'en', kind: page.kind, altPath: esPath, faqKey: page.faqKey, extra: page.extra };
    if (esPath) {
      byPath[esPath] = { content: page.content, lang: 'es', kind: page.kind, altPath: page.en, faqKey: page.faqKey, extra: page.extra };
    }
  }
  return byPath;
})();

interface BotNavContext {
  contactInfo: string;
  serviceLinks: string;
  locationLinks: string;
  legalLinks: string;
}

function buildModuleContentBody(entry: BotContentEntry, ctx: BotNavContext): string {
  const { content, lang, kind, altPath, faqKey, extra } = entry;
  const es = lang === 'es';
  let article = pageContentToHtml(content[lang]);
  for (const shared of extra ?? []) {
    const sharedContent = shared[lang];
    const sharedSections = sharedContent.sections
      .map(s => `    ${sectionToHtml(s)}`)
      .join('\n');
    article += `\n  <section>\n    <h2>${inlineToHtml(sharedContent.title)}</h2>\n${sharedSections}\n  </section>`;
  }
  if (faqKey) {
    const faqs = locationFAQs[faqKey]?.[lang] ?? [];
    if (faqs.length) {
      const faqBlocks = faqs
        .map(f => `<h3>${escapeHtml(f.question)}</h3>\n    <p>${escapeHtml(f.answer)}</p>`)
        .join('\n    ');
      article += `\n  <section>\n    ${faqBlocks}\n  </section>`;
    }
  }

  const switchItem = altPath
    ? `<li><a href="${altPath}">${es ? 'English' : 'Espa&ntilde;ol'}</a></li>`
    : '';
  const quick = (items: string[]) =>
    `<nav aria-label="${es ? 'Enlaces R&aacute;pidos' : 'Quick Links'}"><ul>
    ${[...items, switchItem].filter(Boolean).join('\n    ')}
  </ul></nav>`;

  const servicesNav = `<nav aria-label="${es ? 'Servicios' : 'Services'}">${ctx.serviceLinks}</nav>`;
  const locationsNav = `<nav aria-label="${es ? 'Ubicaciones' : 'Locations'}">${ctx.locationLinks}</nav>`;
  const legalNav = `<nav aria-label="Legal">${ctx.legalLinks}</nav>`;

  const homeItem = es
    ? `<li><a href="/es">Inicio</a></li>`
    : `<li><a href="/">Home</a></li>`;
  const contactItem = es
    ? `<li><a href="/es/contacto">Programar una Cita</a></li>`
    : `<li><a href="/contact">Schedule an Appointment</a></li>`;
  const aboutItem = es
    ? `<li><a href="/es/acerca-de">Sobre la Dra. Melva Reve</a></li>`
    : `<li><a href="/about">About Dr. Melva Reve</a></li>`;
  const forPatientsItem = es
    ? `<li><a href="/es/para-pacientes">Para Pacientes</a></li>`
    : `<li><a href="/for-patients">For Patients</a></li>`;
  const naplesItem = es
    ? `<li><a href="/es/ubicaciones/psiquiatra-naples">Oficina en Naples</a></li>`
    : `<li><a href="/locations/psychiatrist-naples">Naples Office Location</a></li>`;

  let navs: string;
  switch (kind) {
    case 'home':
      navs = `${servicesNav}\n  ${locationsNav}\n  ${quick([aboutItem, contactItem, forPatientsItem])}`;
      break;
    case 'location':
      navs = `${servicesNav}\n  ${locationsNav}\n  ${quick([contactItem, aboutItem])}`;
      break;
    case 'service':
      navs = `${servicesNav}\n  ${quick([contactItem, aboutItem, naplesItem])}`;
      break;
    case 'legal':
      navs = `${legalNav}\n  ${quick([homeItem, contactItem])}`;
      break;
    case 'main':
    default:
      navs = `${servicesNav}\n  ${quick([contactItem, aboutItem, forPatientsItem])}`;
      break;
  }

  return `<main>
  <header><a href="${es ? '/es' : '/'}">Healing Minds Psychiatry</a></header>
  <article>
  ${article}
  </article>
  <section>${ctx.contactInfo}</section>
  ${navs}
</main>`;
}

async function getStaticPageBody(path: string, baseUrl: string): Promise<string | null> {
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
      <li><a href="/telehealth-consent">Telehealth Consent</a></li>
      <li><a href="/no-surprises-act">No Surprises Act</a></li>
      <li><a href="/accessibility-statement">Accessibility Statement</a></li>
      <li><a href="/nondiscrimination-notice">Nondiscrimination Notice</a></li>
      <li><a href="/communications-policy">Communications Policy</a></li>
      <li><a href="/medical-disclaimer">Medical Disclaimer</a></li>
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
      <li><a href="/es/consentimiento-telesalud">Consentimiento de Telesalud</a></li>
      <li><a href="/es/ley-sin-sorpresas">Ley Sin Sorpresas</a></li>
      <li><a href="/es/declaracion-accesibilidad">Declaraci&oacute;n de Accesibilidad</a></li>
      <li><a href="/es/aviso-no-discriminacion">Aviso de No Discriminaci&oacute;n</a></li>
      <li><a href="/es/politica-comunicaciones">Pol&iacute;tica de Comunicaciones</a></li>
      <li><a href="/es/descargo-responsabilidad-medica">Descargo de Responsabilidad M&eacute;dica</a></li>
    </ul>`;

  if (path === '/blog' || path === '/es/blog') {
    return buildBlogIndexBody(baseUrl, contactInfo, path === '/es/blog' ? 'es' : 'en');
  }

  const blogPost = await getBlogPostFromPath(path);
  if (blogPost) {
    return buildBlogPostBody(blogPost, contactInfo);
  }

  // Satellite location pages render their crawler body from hyperlocal copy.
  const satellite = SATELLITE_BY_PATH[path];
  if (satellite) {
    return buildLocationBody(satellite.city, satellite.lang, {
      contactInfo,
      serviceLinks: satellite.lang === 'es' ? esServiceLinks : enServiceLinks,
      locationLinks: satellite.lang === 'es' ? esLocationLinks : enLocationLinks,
    });
  }

  // Content pages backed by shared modules (same source the React pages render).
  const moduleEntry = BOT_CONTENT_BY_PATH[path];
  if (moduleEntry) {
    const es = moduleEntry.lang === 'es';
    return buildModuleContentBody(moduleEntry, {
      contactInfo,
      serviceLinks: es ? esServiceLinks : enServiceLinks,
      locationLinks: es ? esLocationLinks : enLocationLinks,
      legalLinks: es ? esLegalLinks : enLegalLinks,
    });
  }

  switch (path) {
    case '/psychiatrist-california':
      return `<main>
  <header><a href="/">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Online Psychiatrist in Spanish for California</h1>
    <p>Psychiatric care with Dr. Melva Reve, a psychiatrist and native Spanish speaker, by video call for adults located in California. Evaluation and treatment follow-up for anxiety, depression, and ADHD. Direct pay, clear pricing, no insurance. Not for emergencies: call 988 or 911 in a crisis.</p>
  </section>
  <nav aria-label="Quick Links"><ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About Dr. Melva Reve</a></li>
    <li><a href="/es/psiquiatra-california">Espa&ntilde;ol</a></li>
  </ul></nav>
</main>`;

    case '/es/psiquiatra-california':
      return `<main>
  <header><a href="/es">Healing Minds Psychiatry</a></header>
  <section>
    <h1>Psiquiatra Online en Espa&ntilde;ol para California</h1>
    <p>Atenci&oacute;n psiqui&aacute;trica con la Dra. Melva Reve, m&eacute;dica psiquiatra y hablante nativa de espa&ntilde;ol, por videollamada para adultos en California. Evaluaci&oacute;n y seguimiento del tratamiento para ansiedad, depresi&oacute;n y TDAH. Pago directo, precio claro, sin seguros. No es para emergencias: llame al 988 o al 911 en una crisis.</p>
  </section>
  <nav aria-label="Enlaces R&aacute;pidos"><ul>
    <li><a href="/es">Inicio</a></li>
    <li><a href="/es/acerca-de">Sobre la Dra. Melva Reve</a></li>
    <li><a href="/psychiatrist-california">English</a></li>
  </ul></nav>
</main>`;

    default:
      return null;
  }
}

/**
 * Startup guardrail (warn-only): verifies that every sitemap URL (EN + ES)
 * produces a non-empty crawler body via getStaticPageBody. Returns the list
 * of uncovered paths so the caller can log a loud warning at boot.
 * Sitemap entries are all static (blog posts are appended dynamically to the
 * sitemap elsewhere and are covered by the blog SSR path), so this never
 * touches the database.
 */
export async function findSitemapPathsWithoutBotBody(
  baseUrl = 'https://healingmindspsychiatry.com',
): Promise<string[]> {
  const missing: string[] = [];
  for (const entry of getSitemapEntries()) {
    for (const path of [entry.en, entry.es]) {
      try {
        const body = await getStaticPageBody(path, baseUrl);
        if (!body || !body.trim()) missing.push(path);
      } catch (err) {
        missing.push(`${path} (error: ${(err as Error).message})`);
      }
    }
  }
  return missing;
}
