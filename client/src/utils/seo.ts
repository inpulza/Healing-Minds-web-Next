interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  lang?: string;
  canonical?: string;
  ogImage?: string;
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
  
  // Step 3: Update language attribute
  if (data.lang) {
    document.documentElement.lang = data.lang;
  }
  
  // Step 4: Create new meta tags and canonical link (guaranteed unique now)
  createMetaTag('description', data.description);
  
  if (data.keywords) {
    createMetaTag('keywords', data.keywords);
  }
  
  // Step 5: Canonical URL gestionado server-side ÚNICAMENTE.
  // El servidor inyecta <link rel="canonical"> en el HTML inicial por ruta
  // (ver server/utils/html-injection.ts). El cliente NO lo toca para evitar
  // que tras la hidratación de React el canonical cambie respecto al HTML
  // inicial (causaba "duplicate canonical" / "Google chose different canonical"
  // en Search Console).

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
  if (import.meta.env.DEV) {
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
