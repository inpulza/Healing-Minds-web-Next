import { getRobotsPolicy, normalizeRoutePath } from '@shared/routeManifest';

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

  // Always self-referencing, exactly like the App Router metadata. Deliberately
  // NOT data.canonical:
  // several bilingual pages hardcode the English canonical, which would point the
  // Spanish route at the English URL.
  const tag = upsertHeadTag('link[rel="canonical"]', () => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    return link;
  });
  tag.setAttribute('href', `${productionOrigin()}${currentPath}`);
}

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
  // NOTA: NO incluimos 'link[rel="canonical"]'. El canonical lo gestiona exclusivamente
  // el App Router mediante metadataForPath/generateMetadata, para evitar canonicals
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
  
  // Step 5: Canonical y robots de la ruta de entrada los gestiona Next.js
  // (metadataForPath/generateMetadata) y el cliente NO los toca, para evitar
  // que tras la hidratación cambien respecto al HTML inicial (causaba
  // "duplicate canonical" / "Google chose different canonical" en Search
  // Console). Sí los sincronizamos cuando el usuario navega a otra ruta dentro
  // de la SPA, porque entonces los valores del servidor quedan obsoletos.
  syncRouteSignals();

  // Step 6: Create Open Graph tags
  createMetaTag('og:title', data.title, 'property');
  createMetaTag('og:description', data.description, 'property');
  
  // og:url is always self-referencing. Several legacy bilingual callers pass
  // their English canonical even while rendering the Spanish route; trusting
  // that value made social shares identify the wrong language document.
  const ogUrl = `${productionOrigin()}${normalizeRoutePath(window.location.pathname)}`;
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
