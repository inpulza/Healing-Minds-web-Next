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

// Schema markup for medical practice
export const addMedicalBusinessSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "Healing Minds Psychiatry - Dr. Melva Reve",
    "description": "Compassionate psychiatric care for adults in Naples, Florida",
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
      "latitude": "26.1420",
      "longitude": "-81.7948"
    },
    "openingHours": [
      "Mo-Fr 09:00-17:00"
    ],
    "priceRange": "$$",
    "acceptedPaymentMethod": ["Insurance", "Cash", "Credit Card"],
    "hasMap": "https://maps.google.com/?q=4760+Tamiami+Trl+N+25,+Naples,+FL+34103",
    "medicalSpecialty": ["Psychiatry", "Adult Psychiatry", "Anxiety Treatment", "Depression Treatment"]
  };

  // Remove existing schema
  const existingSchema = document.querySelector('script[type="application/ld+json"]');
  if (existingSchema) {
    existingSchema.remove();
  }

  // Add new schema
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
};

// Physician schema
export const addPhysicianSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Physician",
    "name": "Dr. Melva Reve",
    "jobTitle": "Psychiatrist",
    "worksFor": {
      "@type": "MedicalOrganization",
      "name": "Healing Minds Psychiatry"
    },
    "medicalSpecialty": "Psychiatry",
    "alumniOf": "University of Miami Miller School of Medicine",
    "memberOf": "American Psychiatric Association",
    "hasCredential": "Board Certified Psychiatrist",
    "knows": ["English", "Spanish"],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Naples",
      "addressRegion": "FL",
      "addressCountry": "US"
    }
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
};
