interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  lang?: string;
  canonical?: string;
  ogImage?: string;
}

export const updateSEO = (data: SEOData) => {
  // Update title
  document.title = data.title;
  
  // Update or create meta description
  updateMetaTag('description', data.description);
  
  // Update or create meta keywords
  if (data.keywords) {
    updateMetaTag('keywords', data.keywords);
  }
  
  // Update language
  if (data.lang) {
    document.documentElement.lang = data.lang;
  }
  
  // Update canonical URL
  if (data.canonical) {
    updateLinkTag('canonical', `${window.location.origin}${data.canonical}`);
  }
  
  // Update Open Graph tags
  updateMetaTag('og:title', data.title, 'property');
  updateMetaTag('og:description', data.description, 'property');
  updateMetaTag('og:url', window.location.href, 'property');
  
  if (data.ogImage) {
    updateMetaTag('og:image', data.ogImage, 'property');
  }
  
  // Update Twitter Card tags
  updateMetaTag('twitter:title', data.title, 'name');
  updateMetaTag('twitter:description', data.description, 'name');
  
  if (data.ogImage) {
    updateMetaTag('twitter:image', data.ogImage, 'name');
  }
};

const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
  let tag = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }
  
  tag.setAttribute('content', content);
};

const updateLinkTag = (rel: string, href: string) => {
  let tag = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', rel);
    document.head.appendChild(tag);
  }
  
  tag.setAttribute('href', href);
};

// Comprehensive Schema markup for medical practice - optimized for Google Business Profile connection
export const addMedicalBusinessSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "Healing Minds Psychiatry - Dr. Melva Reve",
    "description": "Compassionate psychiatric care for adults in Naples, Florida. Bilingual services available.",
    "url": "https://healingmindsp.com",
    "telephone": "+1-239-423-0272",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "4760 Tamiami Trl N #25",
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
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "17:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday", "Sunday"],
        "opens": "00:00",
        "closes": "00:00"
      }
    ],
    "priceRange": "$$",
    "acceptedPaymentMethod": ["Insurance", "Cash", "Credit Card"],
    "hasMap": "https://www.google.com/maps/place/Healing+Minds+Psychiatry+%7C+Naples/@26.2044803,-81.8021344,17z",
    "medicalSpecialty": ["Psychiatry", "Adult Psychiatry", "Anxiety Treatment", "Depression Treatment", "ADHD Treatment", "PTSD Treatment", "Bipolar Treatment"],
    "sameAs": [
      "https://healingmindsp.com",
      "https://www.google.com/maps/place/Healing+Minds+Psychiatry+%7C+Naples/@26.2044803,-81.8021344,17z"
      // Add social media profiles here when available (Facebook, LinkedIn, etc.)
    ]
  };

  // Remove existing medical business schema only
  const existingSchema = document.querySelector('script[type="application/ld+json"]#medical-business-schema');
  if (existingSchema) {
    existingSchema.remove();
  }

  // Add enhanced schema
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'medical-business-schema';
  script.textContent = JSON.stringify(schema, null, 2);
  document.head.appendChild(script);
};

// Enhanced Physician schema integrated with medical business
export const addPhysicianSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Physician",
    "name": "Dr. Melva Reve",
    "jobTitle": "Psychiatrist",
    "worksFor": {
      "@type": "MedicalOrganization",
      "name": "Healing Minds Psychiatry",
      "url": "https://healingmindsp.com",
      "telephone": "+1-239-423-0272",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "4760 Tamiami Trl N #25",
        "addressLocality": "Naples",
        "addressRegion": "FL",
        "postalCode": "34103",
        "addressCountry": "US"
      }
    },
    "medicalSpecialty": ["Psychiatry", "Adult Psychiatry"],
    "alumniOf": "University of Miami Miller School of Medicine",
    "memberOf": "American Psychiatric Association",
    "hasCredential": "Board Certified Psychiatrist",
    "knowsLanguage": ["English", "Spanish"],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "4760 Tamiami Trl N #25",
      "addressLocality": "Naples",
      "addressRegion": "FL",
      "postalCode": "34103",
      "addressCountry": "US"
    },
    "sameAs": [
      "https://healingmindsp.com",
      "https://www.google.com/maps/place/Healing+Minds+Psychiatry+%7C+Naples/@26.2044803,-81.8021344,17z"
      // Add professional profiles here when available (LinkedIn, medical directories, etc.)
    ]
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'physician-schema';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
};
