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

// ADHD Treatment Page Specific Schema
export const addADHDTreatmentSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Physician",
        "name": "Dra. Melva Reve, M.D.",
        "description": "Psiquiatra certificada bilingüe especializada en el tratamiento de TDAH, depresión y ansiedad en adultos en Naples, FL.",
        "medicalSpecialty": "Psychiatry",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "4760 Tamiami Trl N # 25",
          "addressLocality": "Naples",
          "addressRegion": "FL",
          "postalCode": "34103",
          "addressCountry": "US"
        },
        "telephone": "+12394230272",
        "worksFor": {
          "@type": "Organization",
          "name": "Healing Minds Psychiatry"
        },
        "knowsLanguage": ["es-US", "en-US"]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿Cuál es el primer paso para tratar el TDAH si soy adulto?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "El primer y más importante paso es buscar una evaluación profesional completa con un psiquiatra cualificado, como la Dra. Reve en Healing Minds Psychiatry. Un diagnóstico preciso es fundamental para crear un plan de tratamiento efectivo."
            }
          },
          {
            "@type": "Question",
            "name": "¿El tratamiento para el TDAH siempre incluye medicamentos?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No necesariamente. Si bien los medicamentos son altamente efectivos para muchos adultos, el mejor enfoque a menudo combina terapia, estrategias de comportamiento y, si es apropiado, medicación. El plan se personaliza para cada individuo."
            }
          },
          {
            "@type": "Question",
            "name": "¿Cómo puede ayudar la terapia en mi trabajo y relaciones?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "La terapia puede proporcionarte herramientas invaluables para gestionar mejor el tiempo, mejorar tus habilidades de organización y comunicación, y comprender cómo el TDAH influye en tus interacciones, lo que puede conducir a una reducción del estrés y a relaciones más saludables."
            }
          },
          {
            "@type": "Question",
            "name": "¿Ofrecen telepsiquiatría para el tratamiento del TDAH en Florida?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sí, en Healing Minds Psychiatry ofrecemos servicios de telepsiquiatría, permitiéndote recibir atención experta y seguimiento desde la comodidad de tu hogar en cualquier lugar del estado de Florida."
            }
          }
        ]
      }
    ]
  };

  // Remove existing ADHD page schema if present
  const existingSchema = document.querySelector('script[type="application/ld+json"]#adhd-page-schema');
  if (existingSchema) {
    existingSchema.remove();
  }

  // Add ADHD-specific schema to head
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'adhd-page-schema';
  script.textContent = JSON.stringify(schema, null, 2);
  document.head.appendChild(script);
};
