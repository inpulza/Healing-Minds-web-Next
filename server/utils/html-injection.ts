import { Request } from 'express';

interface MetaTag {
  name?: string;
  property?: string;
  content: string;
  rel?: string;
  href?: string;
}

interface PageMeta {
  title?: string;
  description?: string;
  canonical?: string;
  schema?: object;
  metaTags?: MetaTag[];
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
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  let host = req.get('host') || 'www.healingmindsp.com';
  
  // Ensure consistent www subdomain (critical for production SEO)
  if (host === 'healingmindsp.com' || host?.includes('replit.app')) {
    host = 'www.healingmindsp.com';
  }
  
  const baseUrl = `${protocol}://${host}`;
  
  // Define page-specific meta data
  const pageMetaData = getPageMetaData(url, baseUrl);
  
  if (!pageMetaData) {
    return html; // No changes for unknown routes
  }
  
  let modifiedHtml = html;
  
  // Inject canonical tag in <head>
  if (pageMetaData.canonical) {
    const canonicalTag = `    <link rel="canonical" href="${pageMetaData.canonical}" />`;
    modifiedHtml = modifiedHtml.replace(
      '</head>',
      `${canonicalTag}\n  </head>`
    );
  }
  
  // Inject JSON-LD schema in <head>
  if (pageMetaData.schema) {
    const schemaTag = `    <script type="application/ld+json">${JSON.stringify(pageMetaData.schema, null, 2)}</script>`;
    modifiedHtml = modifiedHtml.replace(
      '</head>',
      `${schemaTag}\n  </head>`
    );
  }
  
  // Inject additional meta tags
  if (pageMetaData.metaTags && pageMetaData.metaTags.length > 0) {
    const additionalTags = pageMetaData.metaTags
      .map(tag => {
        if (tag.rel && tag.href) {
          return `    <link rel="${tag.rel}" href="${tag.href}" />`;
        } else if (tag.name) {
          return `    <meta name="${tag.name}" content="${tag.content}" />`;
        } else if (tag.property) {
          return `    <meta property="${tag.property}" content="${tag.content}" />`;
        }
        return '';
      })
      .filter(tag => tag !== '')
      .join('\n');
      
    if (additionalTags) {
      modifiedHtml = modifiedHtml.replace(
        '</head>',
        `${additionalTags}\n  </head>`
      );
    }
  }
  
  return modifiedHtml;
}

/**
 * Define meta data specific to each route
 */
function getPageMetaData(url: string, baseUrl: string): PageMeta | null {
  // Normalize URL for matching
  const normalizedUrl = url.replace(/\/$/, '') || '/';
  
  switch (normalizedUrl) {
    // Homepage
    case '/':
      return {
        canonical: `${baseUrl}/`,
        schema: getMedicalBusinessSchema(baseUrl),
        metaTags: [
          {
            name: 'description',
            content: 'Dr. Melva Reve - Board certified psychiatrist in Naples, FL. Expert treatment for anxiety, depression, ADHD, PTSD. Bilingual care in English & Spanish. Call (239) 423-0272.'
          },
          {
            property: 'og:title',
            content: 'Dr. Melva Reve - Psychiatrist Naples FL | Healing Minds Psychiatry'
          },
          {
            property: 'og:description',
            content: 'Board certified psychiatrist in Naples, FL. Expert treatment for anxiety, depression, ADHD, PTSD. Bilingual care available.'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/`
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
            content: 'Meet Dr. Melva Reve, board-certified psychiatrist in Naples, FL. University of Miami trained, fluent in English & Spanish. Expert in anxiety, depression, ADHD treatment.'
          },
          {
            property: 'og:title',
            content: 'About Dr. Melva Reve - Psychiatrist Naples FL | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/about`
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
          }
        ]
      };

    // Service pages
    case '/services/anxiety-treatment':
      return {
        canonical: `${baseUrl}/services/anxiety-treatment`,
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
          }
        ]
      };

    case '/services/depression-treatment':
      return {
        canonical: `${baseUrl}/services/depression-treatment`,
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
          }
        ]
      };

    case '/services/adhd-treatment':
      return {
        canonical: `${baseUrl}/services/adhd-treatment`,
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
          }
        ]
      };

    case '/services/ptsd-treatment':
      return {
        canonical: `${baseUrl}/services/ptsd-treatment`,
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
          }
        ]
      };

    case '/services/bipolar-treatment':
      return {
        canonical: `${baseUrl}/services/bipolar-treatment`,
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
          }
        ]
      };

    case '/services/medication-management':
      return {
        canonical: `${baseUrl}/services/medication-management`,
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
          }
        ]
      };

    case '/locations/naples':
      return {
        canonical: `${baseUrl}/locations/naples`,
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
            content: `${baseUrl}/locations/naples`
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
          }
        ]
      };

    // Spanish service pages
    case '/es/servicios/tratamiento-ansiedad':
      return {
        canonical: `${baseUrl}/es/servicios/tratamiento-ansiedad`,
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
          }
        ]
      };

    case '/es/servicios/tratamiento-depresion':
      return {
        canonical: `${baseUrl}/es/servicios/tratamiento-depresion`,
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
          }
        ]
      };

    case '/es/servicios/tratamiento-tept':
      return {
        canonical: `${baseUrl}/es/servicios/tratamiento-tept`,
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
          }
        ]
      };

    case '/es/servicios/tratamiento-bipolar':
      return {
        canonical: `${baseUrl}/es/servicios/tratamiento-bipolar`,
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
          }
        ]
      };

    case '/es/servicios/manejo-medicamentos':
      return {
        canonical: `${baseUrl}/es/servicios/manejo-medicamentos`,
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
          }
        ]
      };

    // Add more routes as needed
    default:
      return null;
  }
}

/**
 * Generate comprehensive MedicalBusiness schema optimized for Google Rich Results
 * Compatible with Google Business Profile and Local SEO requirements
 */
function getMedicalBusinessSchema(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": `${baseUrl}/#MedicalClinic`,
    "name": "Healing Minds Psychiatry",
    "url": baseUrl,
    "logo": `${baseUrl}/favicon.svg`,
    "image": `${baseUrl}/favicon.svg`,
    "description": "Board certified psychiatrist Dr. Melva Reve providing expert psychiatric care in Naples, FL. Specializing in anxiety, depression, ADHD, PTSD, and comprehensive mental health services.",
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
    "telephone": "(239) 423-0272",
    "email": "info@healingmindsp.com",
    "openingHours": [
      "Mo-Fr 09:00-17:00"
    ],
    "medicalSpecialty": [
      "Anxiety Disorders",
      "Depression",
      "ADHD",
      "PTSD",
      "Bipolar Disorder",
      "Medication Management"
    ],
    "availableLanguage": ["English", "Spanish"],
    "paymentAccepted": ["Insurance", "Credit Card", "Cash"],
    "currenciesAccepted": "USD",
    "sameAs": [
      "https://www.google.com/maps/place/Healing+Minds+Psychiatry/@26.2044803,-81.8021344,17z"
    ],
    "hasMap": "https://www.google.com/maps/place/Healing+Minds+Psychiatry/@26.2044803,-81.8021344,17z",
    "isAcceptingNewPatients": true,
    "priceRange": "$$",
    "founder": {
      "@type": "Person",
      "@id": `${baseUrl}/#Physician`,
      "name": "Dr. Melva Reve",
      "jobTitle": "Board Certified Psychiatrist",
      "hasCredential": [
        {
          "@type": "EducationalOccupationalCredential",
          "credentialCategory": "Medical Degree",
          "educationalLevel": "MD",
          "recognizedBy": {
            "@type": "Organization",
            "name": "University of Miami"
          }
        }
      ],
      "memberOf": {
        "@type": "Organization", 
        "name": "American Psychiatric Association"
      },
      "knowsLanguage": ["English", "Spanish"],
      "workLocation": {
        "@id": `${baseUrl}/#MedicalClinic`
      }
    }
  };
}