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
 */
export function injectMetaTags(html: string, req: Request): string {
  const url = req.originalUrl;
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  let host = req.get('host') || 'www.healingmindsp.com';
  
  // Ensure consistent www subdomain
  if (host === 'healingmindsp.com') {
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
      
    // Add more routes as needed
    default:
      return null;
  }
}

/**
 * Generate MedicalBusiness schema for locations
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
    "paymentAccepted": "Insurance, Credit Card, Cash",
    "currenciesAccepted": "USD",
    "sameAs": [
      "https://www.google.com/maps/place/Healing+Minds+Psychiatry/@26.2044803,-81.8021344,17z"
    ],
    "hasMap": "https://www.google.com/maps/place/Healing+Minds+Psychiatry/@26.2044803,-81.8021344,17z",
    "isAcceptingNewPatients": true,
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