interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  lang?: string;
  canonical?: string;
  ogImage?: string;
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
  // CRITICAL: Remove ALL existing SEO meta tags before adding new ones to prevent duplicates
  // This is essential for SPA navigation where multiple route changes could accumulate tags
  
  // Step 1: Remove existing meta tags that we're about to update
  const metaTags = [
    'meta[name="description"]',
    'meta[name="keywords"]', 
    'meta[property="og:title"]',
    'meta[property="og:description"]',
    'meta[property="og:url"]',
    'meta[property="og:image"]',
    'meta[name="twitter:title"]',
    'meta[name="twitter:description"]',
    'meta[name="twitter:image"]',
    'link[rel="canonical"]'
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
  
  // Step 5: Create canonical URL - ALWAYS absolute for consistency
  if (data.canonical) {
    // Ensure canonical URLs always use www subdomain for consistency
    const preferredOrigin = window.location.origin.includes('healingmindsp.com') 
      ? window.location.origin.replace('://healingmindsp.com', '://www.healingmindsp.com')
      : window.location.origin;
    
    // Convert relative canonical to absolute URL
    const absoluteCanonical = data.canonical.startsWith('http') 
      ? data.canonical 
      : `${preferredOrigin}${data.canonical}`;
      
    createLinkTag('canonical', absoluteCanonical);
  }
  
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

// Complete Medical Clinic Schema - Single authoritative source for Healing Minds Psychiatry
// Optimized to prevent duplicate schemas and Google Rich Results validation issues
export const addMedicalBusinessSchema = () => {
  // STEP 1: Remove ALL existing schema markup to prevent duplicates
  const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
  existingSchemas.forEach(schema => {
    const content = schema.textContent || '';
    // Remove any schema that mentions our business to prevent conflicts
    if (content.includes('Healing Minds Psychiatry') || content.includes('Melva Reve') || content.includes('MedicalClinic')) {
      schema.remove();
      console.log('🧹 Removed existing schema to prevent duplicates:', schema.id || 'unnamed');
    }
  });

  // STEP 2: Create single, complete, authoritative schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": "https://www.healingmindsp.com/#MedicalClinic",
    "name": "Healing Minds Psychiatry",
    "description": "Healing Minds Psychiatry (Tamiami): Su centro de confianza para la salud mental en Naples, FL. Dirigidos por la Dra. Melva Reve, psiquiatra bilingüe (español/inglés), ofrecemos atención compasiva para ansiedad, depresión y TDAH. Nuestra oficina en Tamiami Trail N proporciona evaluaciones psiquiátricas, manejo de medicamentos y telepsiquiatría.",
    "image": "https://healingmindsp.com/favicon.svg",
    "url": "https://healingmindsp.com",
    "telephone": "+1-239-423-0272",
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
      "latitude": "26.2044803",
      "longitude": "-81.8021344"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Monday",
        "opens": "09:00",
        "closes": "17:00"
      },
      {
        "@type": "OpeningHoursSpecification", 
        "dayOfWeek": "Tuesday",
        "opens": "09:00",
        "closes": "17:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Wednesday", 
        "opens": "09:00",
        "closes": "17:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Thursday",
        "opens": "09:00", 
        "closes": "17:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Friday",
        "opens": "09:00",
        "closes": "17:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "00:00",
        "closes": "00:00"
      },
      {
        "@type": "OpeningHoursSpecification", 
        "dayOfWeek": "Sunday",
        "opens": "00:00",
        "closes": "00:00"
      }
    ],
    "medicalSpecialty": "Psychiatry",
    "availableService": [
      {
        "@type": "MedicalTherapy",
        "name": "Anxiety Treatment"
      },
      {
        "@type": "MedicalTherapy",
        "name": "Depression Treatment"
      },
      {
        "@type": "MedicalTherapy",
        "name": "ADHD Treatment"
      },
      {
        "@type": "MedicalTherapy",
        "name": "PTSD Treatment"
      },
      {
        "@type": "MedicalTherapy",
        "name": "Bipolar Treatment"
      },
      {
        "@type": "MedicalProcedure",
        "name": "Medication Management"
      },
      {
        "@type": "MedicalProcedure",
        "name": "Telepsychiatry"
      }
    ],
    "priceRange": "$$",
    "member": {
      "@type": "Physician",
      "@id": "https://healingmindsp.com/about#physician",
      "name": "Dr. Melva Reve",
      "jobTitle": "Psychiatrist",
      "telephone": "+1-239-423-0272",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "4760 Tamiami Trl N # 25",
        "addressLocality": "Naples",
        "addressRegion": "FL",
        "postalCode": "34103",
        "addressCountry": "US"
      },
      "image": "https://healingmindsp.com/favicon.svg",
      "knowsLanguage": ["es-US", "en-US"],
      "knowsAbout": [
        "Anxiety Treatment",
        "Depression Treatment", 
        "ADHD Treatment",
        "PTSD Treatment",
        "Bipolar Treatment",
        "Medication Management"
      ],
      "alumniOf": "University of Miami Miller School of Medicine",
      "memberOf": "American Psychiatric Association",
      "worksFor": {
        "@type": "MedicalClinic",
        "name": "Healing Minds Psychiatry"
      }
    },
    "sameAs": [
      "https://healingmindsp.com",
      "https://www.google.com/maps/place/Healing+Minds+Psychiatry+%7C+Naples/@26.2044803,-81.8021344,17z"
    ]
  };

  // STEP 3: Add single, clean schema with unique identifier
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'healing-minds-schema'; // Unique ID to prevent duplicates
  script.setAttribute('data-schema-type', 'medical-business');
  script.textContent = JSON.stringify(schema, null, 2);
  document.head.appendChild(script);
  
  console.log('✅ Single authoritative schema added for Healing Minds Psychiatry');
};

// FUNCTION PERMANENTLY REMOVED: addPhysicianSchema
// All physician information is now integrated into the main MedicalClinic schema above.
// This prevents Google Rich Results from detecting duplicate or conflicting schemas.
// DO NOT RE-ADD THIS FUNCTION - it causes schema conflicts and validation issues.

// Generic Service Schema Generator for Hub & Spoke Model
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
