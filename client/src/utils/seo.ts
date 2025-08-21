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

// Complete Medical Clinic Schema - optimized for Google Business Profile connection
export const addMedicalBusinessSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "name": "Healing Minds Psychiatry",
    "description": "Healing Minds Psychiatry (Tamiami): Su centro de confianza para la salud mental en Naples, FL. Dirigidos por la Dra. Melva Reve, psiquiatra bilingüe (español/inglés), ofrecemos atención compasiva para ansiedad, depresión y TDAH. Nuestra oficina en Tamiami Trail N proporciona evaluaciones psiquiátricas, manejo de medicamentos y telepsiquiatría.",
    "image": "https://healingmindsp.com/favicon.svg",
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
      "latitude": "26.2044803",
      "longitude": "-81.8021344"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "08:00",
        "closes": "17:00"
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
    "member": {
      "@type": "Physician",
      "name": "Dr. Melva Reve",
      "jobTitle": "Psychiatrist",
      "knowsLanguage": ["es-US", "en-US"]
    },
    "sameAs": [
      "https://healingmindsp.com",
      "https://www.google.com/maps/place/Healing+Minds+Psychiatry+%7C+Naples/@26.2044803,-81.8021344,17z"
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

// Simplified: The physician info is now integrated into the main MedicalClinic schema above
// This eliminates duplicate schemas and follows Google's latest recommendations
export const addPhysicianSchema = () => {
  // Physician info is now included in the main MedicalClinic schema as "member"
  // No separate physician schema needed
  console.log('Physician info integrated into MedicalClinic schema');
};
