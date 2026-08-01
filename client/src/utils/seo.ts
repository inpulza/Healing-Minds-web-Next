import { getRobotsPolicy, normalizeRoutePath } from '@shared/routeManifest';

function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  lang?: string;
  canonical?: string;
  ogImage?: string;
}

// Path the server rendered the initial document for. For THAT path the server
// already injected the authoritative robots meta and canonical link, so we must
// not touch them (rewriting them after hydration is what previously caused
// "Google chose a different canonical" in Search Console). They only go stale
// once the user navigates client-side, which is what syncRouteSignals fixes.
const serverRenderedPath =
  typeof window === 'undefined' ? '/' : normalizeRoutePath(window.location.pathname);

function productionOrigin(): string {
  const origin = window.location.origin;
  return origin.replace('://healingmindsp.com', '://www.healingmindsp.com');
}

function upsertHeadTag(selector: string, create: () => Element): Element {
  const existing = document.head.querySelector(selector);
  if (existing) return existing;
  const tag = create();
  document.head.appendChild(tag);
  return tag;
}

// Only the very first call happens during hydration; from then on every call
// follows a client-side navigation.
let hydrationPass = true;

/**
 * Keep robots + canonical aligned with the current route during SPA navigation.
 * Without this, the values the server injected for the entry URL stay in the DOM:
 * leaving a California landing (noindex) would leave the home page carrying
 * `noindex` and the landing's canonical.
 */
function syncRouteSignals() {
  if (typeof window === 'undefined') return;

  const currentPath = normalizeRoutePath(window.location.pathname);

  if (hydrationPass) {
    hydrationPass = false;
    // On first paint the server tags are authoritative for this exact path.
    // Later returns to the same path DO need syncing: by then an intermediate
    // route may have left its own robots/canonical behind.
    if (currentPath === serverRenderedPath) return;
  }

  const robots = getRobotsPolicy(currentPath);
  if (robots) {
    const tag = upsertHeadTag('meta[name="robots"]', () => {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      return meta;
    });
    tag.setAttribute('content', robots);
  }

  // Always self-referencing, exactly like the server (html-injection.ts picks the
  // canonical from the requested URL's language). Deliberately NOT data.canonical:
  // several bilingual pages hardcode the English canonical, which would point the
  // Spanish route at the English URL.
  const tag = upsertHeadTag('link[rel="canonical"]', () => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    return link;
  });
  tag.setAttribute('href', `${productionOrigin()}${currentPath}`);
}

// Global guards for schema initialization to prevent duplicates
let globalSchemaInitialized = false;
let globalSchemaTimestamp: number | null = null;
const SCHEMA_COOLDOWN_MS = 5000; // 5 second cooldown between schema additions

// Helper function to create new meta tags (used after deduplication)
function createMetaTag(name: string, content: string, attribute: string = 'name') {
  const tag = document.createElement('meta');
  tag.setAttribute(attribute, name);
  tag.setAttribute('content', content);
  document.head.appendChild(tag);
}

// Helper function to create new link tags (used after deduplication)
function createLinkTag(rel: string, href: string) {
  const tag = document.createElement('link');
  tag.setAttribute('rel', rel);
  tag.setAttribute('href', href);
  document.head.appendChild(tag);
}

export const updateSEO = (data: SEOData) => {
  // Next App Router owns every route's metadata through metadataForPath() and
  // generateMetadata(). Removing or recreating those nodes here disconnects
  // React's managed head tree and aborts client navigation with removeChild.
  // The explicit layout marker keeps this legacy helper available only to the
  // standalone Vite runtime while making Next the single metadata authority.
  if (document.documentElement.dataset.metadataOwner === 'next') return;

  // CRITICAL: Remove ALL existing SEO meta tags before adding new ones to prevent duplicates
  // This is essential for SPA navigation where multiple route changes could accumulate tags
  
  // Step 1: Remove existing meta tags that we're about to update
  // NOTA: NO incluimos 'link[rel="canonical"]'. El canonical lo inyecta exclusivamente
  // el servidor (server/utils/html-injection.ts) por ruta, para evitar canonicals
  // duplicados o inconsistentes entre el HTML inicial y el DOM tras hidratación.
  const metaTags = [
    'meta[name="description"]',
    'meta[name="keywords"]', 
    'meta[property="og:title"]',
    'meta[property="og:description"]',
    'meta[property="og:url"]',
    'meta[property="og:image"]',
    'meta[name="twitter:title"]',
    'meta[name="twitter:description"]',
    'meta[name="twitter:image"]'
  ];
  
  metaTags.forEach(selector => {
    const existingTags = document.querySelectorAll(selector);
    existingTags.forEach(tag => tag.remove());
  });
  
  // Step 2: Update title (direct assignment, no duplication possible)
  document.title = data.title;
  
  // Step 3: Update language attribute and og:locale signals.
  // The server injects the correct lang/og:locale per route in the initial HTML;
  // here we keep them in sync during client-side navigation. We update the tags
  // IN PLACE (not via createMetaTag) to avoid duplicate og:locale meta tags.
  if (data.lang) {
    document.documentElement.lang = data.lang;

    const locale = data.lang === 'es' ? 'es_US' : 'en_US';
    const altLocale = data.lang === 'es' ? 'en_US' : 'es_US';

    const upsertProperty = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    upsertProperty('og:locale', locale);
    upsertProperty('og:locale:alternate', altLocale);
  }
  
  // Step 4: Create new meta tags and canonical link (guaranteed unique now)
  createMetaTag('description', data.description);
  
  if (data.keywords) {
    createMetaTag('keywords', data.keywords);
  }
  
  // Step 5: Canonical y robots de la ruta de entrada los gestiona el servidor
  // (ver server/utils/html-injection.ts) y el cliente NO los toca, para evitar
  // que tras la hidratación cambien respecto al HTML inicial (causaba
  // "duplicate canonical" / "Google chose different canonical" en Search
  // Console). Sí los sincronizamos cuando el usuario navega a otra ruta dentro
  // de la SPA, porque entonces los valores del servidor quedan obsoletos.
  syncRouteSignals();

  // Step 6: Create Open Graph tags
  createMetaTag('og:title', data.title, 'property');
  createMetaTag('og:description', data.description, 'property');
  
  // Use canonical URL for og:url if available, otherwise current URL
  const ogUrl = data.canonical 
    ? (data.canonical.startsWith('http') 
        ? data.canonical 
        : `${window.location.origin.includes('healingmindsp.com') 
            ? window.location.origin.replace('://healingmindsp.com', '://www.healingmindsp.com')
            : window.location.origin}${data.canonical}`)
    : window.location.href;
  createMetaTag('og:url', ogUrl, 'property');
  
  if (data.ogImage) {
    createMetaTag('og:image', data.ogImage, 'property');
  }
  
  // Step 7: Create Twitter Card tags
  createMetaTag('twitter:title', data.title, 'name');
  createMetaTag('twitter:description', data.description, 'name');
  
  if (data.ogImage) {
    createMetaTag('twitter:image', data.ogImage, 'name');
  }
};

// DEPRECATED: Schema injection is now handled server-side only
// All JSON-LD schemas are injected server-side via server/utils/html-injection.ts
// This prevents duplicate schemas and conflicts with Google Rich Results
// Keeping this function for backward compatibility but it does nothing
export const addMedicalBusinessSchema = () => {
  if (isDevelopment()) {
    console.log('ℹ️ Schema injection is now handled server-side only. Client-side schema injection is disabled to prevent duplicates.');
  }
  // All schema injection has been moved to server-side for better SEO and to prevent duplicates
  return;
};

// FUNCTION PERMANENTLY REMOVED: addPhysicianSchema
// All physician information is now integrated into the main MedicalClinic schema above.
// This prevents Google Rich Results from detecting duplicate or conflicting schemas.
// DO NOT RE-ADD THIS FUNCTION - it causes schema conflicts and validation issues.

// Enhanced Service Schema Generator for Hub & Spoke Model
// Creates Service schemas for satellite location pages that reference the main MedicalClinic
export const addLocationServiceSchema = (serviceConfig: {
  locationName: string;
  description: string;
  pageId: string;
  language?: 'en' | 'es';
}) => {
  // Define available services in both languages
  const services = {
    en: [
      "Anxiety Treatment",
      "Depression Treatment", 
      "ADHD Treatment",
      "PTSD Treatment",
      "Bipolar Treatment",
      "Medication Management"
    ],
    es: [
      "Tratamiento de Ansiedad",
      "Tratamiento de Depresión",
      "Tratamiento de TDAH", 
      "Tratamiento de TEPT",
      "Tratamiento Bipolar",
      "Manejo de Medicamentos"
    ]
  };

  const lang = serviceConfig.language || 'en';
  const serviceName = lang === 'en' 
    ? `Psychiatric Services for ${serviceConfig.locationName}`
    : `Servicios Psiquiátricos para ${serviceConfig.locationName}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceName,
    "description": serviceConfig.description,
    "serviceType": lang === 'en' ? "Mental Health Services" : "Servicios de Salud Mental",
    "areaServed": {
      "@type": "City", 
      "name": serviceConfig.locationName,
      "addressRegion": "FL"
    },
    "provider": {
      "@type": "MedicalClinic",
      "@id": "https://www.healingmindsp.com/#MedicalClinic"
    },
    "availableService": services[lang]
  };

  // Remove existing service schema for this location if present
  const existingSchema = document.querySelector(`script[type="application/ld+json"]#${serviceConfig.pageId}-service-schema`);
  if (existingSchema) {
    existingSchema.remove();
    console.log(`🧹 Removed existing service schema for ${serviceConfig.locationName}`);
  }

  // Add new service schema to head
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = `${serviceConfig.pageId}-service-schema`;
  script.setAttribute('data-schema-type', 'location-service');
  script.setAttribute('data-location', serviceConfig.locationName);
  script.textContent = JSON.stringify(schema, null, 2);
  document.head.appendChild(script);
  
  console.log(`✅ Location Service schema added for ${serviceConfig.locationName}`);
};

// Legacy function - kept for backward compatibility
export const addServiceSchema = (serviceConfig: {
  serviceType: string;
  name: string;
  description: string;
  pageId: string;
  areaServed?: string;
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": serviceConfig.serviceType,
    "name": serviceConfig.name,
    "description": serviceConfig.description,
    "areaServed": {
      "@type": "City",
      "name": serviceConfig.areaServed || "Naples"
    },
    "provider": {
      "@id": "https://www.healingmindsp.com/#MedicalClinic"
    }
  };

  // Remove existing service schema if present
  const existingSchema = document.querySelector(`script[type="application/ld+json"]#${serviceConfig.pageId}-service-schema`);
  if (existingSchema) {
    existingSchema.remove();
  }

  // Add service schema to head
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = `${serviceConfig.pageId}-service-schema`;
  script.textContent = JSON.stringify(schema, null, 2);
  document.head.appendChild(script);
};
