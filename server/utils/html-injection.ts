import { Request } from 'express';

interface MetaTag {
  name?: string;
  property?: string;
  content?: string;
  rel?: string;
  href?: string;
  hreflang?: string;
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
          // Handle hreflang links
          if (tag.hreflang) {
            return `    <link rel="${tag.rel}" hreflang="${tag.hreflang}" href="${tag.href}" />`;
          }
          return `    <link rel="${tag.rel}" href="${tag.href}" />`;
        } else if (tag.name && tag.content) {
          return `    <meta name="${tag.name}" content="${tag.content}" />`;
        } else if (tag.property && tag.content) {
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
          },
          // HREFLANG CRITICAL: Homepage bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/`
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
          },
          // HREFLANG: About bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/about`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/acerca-de`
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
          },
          // HREFLANG: Contact bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/contact`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/contacto`
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
          },
          // HREFLANG: Services bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/services`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/servicios`
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
          },
          // HREFLANG: For Patients bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/for-patients`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/para-pacientes`
          }
        ]
      };

    case '/locations/psychiatrist-naples':
      return {
        canonical: `${baseUrl}/locations/psychiatrist-naples`,
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
            content: `${baseUrl}/locations/psychiatrist-naples`
          },
          // HREFLANG: Naples bilingual versions (FIXED - Spanish version now exists)
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/locations/psychiatrist-naples`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/ubicaciones/psiquiatra-naples`
          }
        ]
      };

    // Satellite Location Pages - Hub & Spoke Pattern
    case '/locations/psychiatrist-bonita-springs':
      return {
        canonical: `${baseUrl}/locations/psychiatrist-bonita-springs`,
        schema: getServiceSchema(baseUrl, 'Bonita Springs'),
        metaTags: [
          {
            name: 'description',
            content: 'Looking for expert psychiatric care in Bonita Springs? Dr. Melva Reve serves Bonita Springs FL area with anxiety, depression, ADHD, PTSD treatment. Call (239) 423-0272.'
          },
          {
            property: 'og:title',
            content: 'Psychiatrist Near Bonita Springs FL - Dr. Melva Reve | Healing Minds'
          },
          {
            property: 'og:description',
            content: 'Looking for expert psychiatric care in Bonita Springs? Dr. Melva Reve serves Bonita Springs FL area with anxiety, depression, ADHD, PTSD treatment.'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/locations/psychiatrist-bonita-springs`
          },
          // HREFLANG: Bonita Springs bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/locations/psychiatrist-bonita-springs`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/ubicaciones/psiquiatra-bonita-springs`
          }
        ]
      };

    case '/locations/psychiatrist-marco-island':
      return {
        canonical: `${baseUrl}/locations/psychiatrist-marco-island`,
        schema: getServiceSchema(baseUrl, 'Marco Island'),
        metaTags: [
          {
            name: 'description',
            content: 'Looking for expert psychiatric care in Marco Island? Dr. Melva Reve serves Marco Island FL area with anxiety, depression, ADHD, PTSD treatment. Call (239) 423-0272.'
          },
          {
            property: 'og:title',
            content: 'Psychiatrist Near Marco Island FL - Dr. Melva Reve | Healing Minds'
          },
          {
            property: 'og:description',
            content: 'Looking for expert psychiatric care in Marco Island? Dr. Melva Reve serves Marco Island FL area with anxiety, depression, ADHD, PTSD treatment.'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/locations/psychiatrist-marco-island`
          },
          // HREFLANG: Marco Island bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/locations/psychiatrist-marco-island`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/ubicaciones/psiquiatra-marco-island`
          }
        ]
      };

    case '/locations/psychiatrist-fort-myers':
      return {
        canonical: `${baseUrl}/locations/psychiatrist-fort-myers`,
        schema: getServiceSchema(baseUrl, 'Fort Myers'),
        metaTags: [
          {
            name: 'description',
            content: 'Looking for expert psychiatric care in Fort Myers? Dr. Melva Reve serves Fort Myers FL area with anxiety, depression, ADHD, PTSD treatment. Call (239) 423-0272.'
          },
          {
            property: 'og:title',
            content: 'Psychiatrist Near Fort Myers FL - Dr. Melva Reve | Healing Minds'
          },
          {
            property: 'og:description',
            content: 'Looking for expert psychiatric care in Fort Myers? Dr. Melva Reve serves Fort Myers FL area with anxiety, depression, ADHD, PTSD treatment.'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/locations/psychiatrist-fort-myers`
          },
          // HREFLANG: Fort Myers bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/locations/psychiatrist-fort-myers`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/ubicaciones/psiquiatra-fort-myers`
          }
        ]
      };

    case '/locations/psychiatrist-ave-maria':
      return {
        canonical: `${baseUrl}/locations/psychiatrist-ave-maria`,
        schema: getServiceSchema(baseUrl, 'Ave Maria'),
        metaTags: [
          {
            name: 'description',
            content: 'Looking for expert psychiatric care in Ave Maria? Dr. Melva Reve serves Ave Maria FL area with anxiety, depression, ADHD, PTSD treatment. Call (239) 423-0272.'
          },
          {
            property: 'og:title',
            content: 'Psychiatrist Near Ave Maria FL - Dr. Melva Reve | Healing Minds'
          },
          {
            property: 'og:description',
            content: 'Looking for expert psychiatric care in Ave Maria? Dr. Melva Reve serves Ave Maria FL area with anxiety, depression, ADHD, PTSD treatment.'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/locations/psychiatrist-ave-maria`
          },
          // HREFLANG: Ave Maria bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/locations/psychiatrist-ave-maria`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/ubicaciones/psiquiatra-ave-maria`
          }
        ]
      };

    case '/locations/psychiatrist-estero':
      return {
        canonical: `${baseUrl}/locations/psychiatrist-estero`,
        schema: getServiceSchema(baseUrl, 'Estero'),
        metaTags: [
          {
            name: 'description',
            content: 'Looking for expert psychiatric care in Estero? Dr. Melva Reve serves Estero FL area with anxiety, depression, ADHD, PTSD treatment. Call (239) 423-0272.'
          },
          {
            property: 'og:title',
            content: 'Psychiatrist Near Estero FL - Dr. Melva Reve | Healing Minds'
          },
          {
            property: 'og:description',
            content: 'Looking for expert psychiatric care in Estero? Dr. Melva Reve serves Estero FL area with anxiety, depression, ADHD, PTSD treatment.'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/locations/psychiatrist-estero`
          },
          // HREFLANG: Estero bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/locations/psychiatrist-estero`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/ubicaciones/psiquiatra-estero`
          }
        ]
      };

    case '/locations/psychiatrist-golden-gate':
      return {
        canonical: `${baseUrl}/locations/psychiatrist-golden-gate`,
        schema: getServiceSchema(baseUrl, 'Golden Gate'),
        metaTags: [
          {
            name: 'description',
            content: 'Looking for expert psychiatric care in Golden Gate? Dr. Melva Reve serves Golden Gate FL area with anxiety, depression, ADHD, PTSD treatment. Call (239) 423-0272.'
          },
          {
            property: 'og:title',
            content: 'Psychiatrist Near Golden Gate FL - Dr. Melva Reve | Healing Minds'
          },
          {
            property: 'og:description',
            content: 'Looking for expert psychiatric care in Golden Gate? Dr. Melva Reve serves Golden Gate FL area with anxiety, depression, ADHD, PTSD treatment.'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/locations/psychiatrist-golden-gate`
          },
          // HREFLANG: Golden Gate bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/locations/psychiatrist-golden-gate`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/ubicaciones/psiquiatra-golden-gate`
          }
        ]
      };

    case '/locations/psychiatrist-immokalee':
      return {
        canonical: `${baseUrl}/locations/psychiatrist-immokalee`,
        schema: getServiceSchema(baseUrl, 'Immokalee'),
        metaTags: [
          {
            name: 'description',
            content: 'Looking for expert psychiatric care in Immokalee? Dr. Melva Reve serves Immokalee FL area with anxiety, depression, ADHD, PTSD treatment. Call (239) 423-0272.'
          },
          {
            property: 'og:title',
            content: 'Psychiatrist Near Immokalee FL - Dr. Melva Reve | Healing Minds'
          },
          {
            property: 'og:description',
            content: 'Looking for expert psychiatric care in Immokalee? Dr. Melva Reve serves Immokalee FL area with anxiety, depression, ADHD, PTSD treatment.'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/locations/psychiatrist-immokalee`
          },
          // HREFLANG: Immokalee bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/locations/psychiatrist-immokalee`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/ubicaciones/psiquiatra-immokalee`
          }
        ]
      };

    case '/locations/psychiatrist-lely-resorts':
      return {
        canonical: `${baseUrl}/locations/psychiatrist-lely-resorts`,
        schema: getServiceSchema(baseUrl, 'Lely Resort'),
        metaTags: [
          {
            name: 'description',
            content: 'Looking for expert psychiatric care in Lely Resort? Dr. Melva Reve serves Lely Resort FL area with anxiety, depression, ADHD, PTSD treatment. Call (239) 423-0272.'
          },
          {
            property: 'og:title',
            content: 'Psychiatrist Near Lely Resort FL - Dr. Melva Reve | Healing Minds'
          },
          {
            property: 'og:description',
            content: 'Looking for expert psychiatric care in Lely Resort? Dr. Melva Reve serves Lely Resort FL area with anxiety, depression, ADHD, PTSD treatment.'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/locations/psychiatrist-lely-resorts`
          },
          // HREFLANG: Lely Resorts bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/locations/psychiatrist-lely-resorts`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/ubicaciones/psiquiatra-lely-resorts`
          }
        ]
      };

    case '/locations/psychiatrist-vanderbilt-beach':
      return {
        canonical: `${baseUrl}/locations/psychiatrist-vanderbilt-beach`,
        schema: getServiceSchema(baseUrl, 'Vanderbilt Beach'),
        metaTags: [
          {
            name: 'description',
            content: 'Looking for expert psychiatric care in Vanderbilt Beach? Dr. Melva Reve serves Vanderbilt Beach FL area with anxiety, depression, ADHD, PTSD treatment. Call (239) 423-0272.'
          },
          {
            property: 'og:title',
            content: 'Psychiatrist Near Vanderbilt Beach FL - Dr. Melva Reve | Healing Minds'
          },
          {
            property: 'og:description',
            content: 'Looking for expert psychiatric care in Vanderbilt Beach? Dr. Melva Reve serves Vanderbilt Beach FL area with anxiety, depression, ADHD, PTSD treatment.'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/locations/psychiatrist-vanderbilt-beach`
          },
          // HREFLANG: Vanderbilt Beach bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/locations/psychiatrist-vanderbilt-beach`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/ubicaciones/psiquiatra-vanderbilt-beach`
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

    // Homepage española
    case '/es':
    case '/es/':
      return {
        canonical: `${baseUrl}/es/`,
        schema: getMedicalBusinessSchema(baseUrl),
        metaTags: [
          {
            name: 'description',
            content: 'La psiquiatra certificada Dra. Melva Reve brinda atención psiquiátrica experta en Naples, FL. Especializada en ansiedad, depresión, TDAH y terapia. Servicios de salud mental para el suroeste de Florida.'
          },
          {
            property: 'og:title',
            content: 'Dra. Melva Reve - Psiquiatra Naples FL | Healing Minds Psychiatry'
          },
          {
            property: 'og:description',
            content: 'Psiquiatra certificada en Naples, FL. Tratamiento experto para ansiedad, depresión, TDAH, TEPT. Atención bilingüe disponible.'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es/`
          },
          // HREFLANG: Homepage bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/`
          }
        ]
      };

    // Acerca de español
    case '/es/acerca-de':
      return {
        canonical: `${baseUrl}/es/acerca-de`,
        metaTags: [
          {
            name: 'description',
            content: 'Conozca a la Dra. Melva Reve, psiquiatra certificada con más de 15 años de experiencia sirviendo Naples, FL. Atención bilingüe con sensibilidad cultural.'
          },
          {
            property: 'og:title',
            content: 'Acerca de la Dra. Melva Reve - Psiquiatra Certificada Naples FL | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es/acerca-de`
          },
          // HREFLANG: About bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/about`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/acerca-de`
          }
        ]
      };

    // Contacto español
    case '/es/contacto':
      return {
        canonical: `${baseUrl}/es/contacto`,
        metaTags: [
          {
            name: 'description',
            content: 'Contacte Healing Minds Psychiatry en Naples, FL para programar su consulta. Llame (239) 423-0272 o envíe un mensaje. Servicios bilingües disponibles.'
          },
          {
            property: 'og:title',
            content: 'Contactar Dra. Melva Reve - Naples FL Psiquiatra | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es/contacto`
          },
          // HREFLANG: Contact bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/contact`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/contacto`
          }
        ]
      };

    // Para Pacientes español
    case '/es/para-pacientes':
      return {
        canonical: `${baseUrl}/es/para-pacientes`,
        metaTags: [
          {
            name: 'description',
            content: 'Información importante para pacientes sobre seguro, citas y atención psiquiátrica en Healing Minds Naples. FAQ y qué esperar.'
          },
          {
            property: 'og:title',
            content: 'Para Pacientes - Healing Minds Psychiatry | Dra. Melva Reve Naples FL'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es/para-pacientes`
          },
          // HREFLANG: For Patients bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/for-patients`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/para-pacientes`
          }
        ]
      };

    // ADHD Treatment español (faltaba esta ruta crítica)
    case '/es/servicios/tratamiento-adhd':
      return {
        canonical: `${baseUrl}/es/servicios/tratamiento-adhd`,
        metaTags: [
          {
            name: 'description',
            content: 'Tratamiento de TDAH para adultos en Naples, FL. La Dra. Melva Reve proporciona evaluación integral de TDAH, terapia y manejo de medicamentos.'
          },
          {
            property: 'og:title',
            content: 'Tratamiento TDAH Adultos Naples FL - Dra. Melva Reve | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es/servicios/tratamiento-adhd`
          }
        ]
      };

    // Spanish location pages (CRITICAL - these were missing per Gemini diagnosis)
    case '/es/ubicaciones/psiquiatra-naples':
      return {
        canonical: `${baseUrl}/es/ubicaciones/psiquiatra-naples`,
        schema: getMedicalBusinessSchema(baseUrl),
        metaTags: [
          {
            name: 'description',
            content: 'Visite a la Dra. Melva Reve en Naples, FL en 4760 Tamiami Trl N # 25. Atención psiquiátrica experta para ansiedad, depresión, TDAH, TEPT. Llame (239) 423-0272.'
          },
          {
            property: 'og:title',
            content: 'Psiquiatra Naples FL - Ubicación Dra. Melva Reve | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es/ubicaciones/psiquiatra-naples`
          },
          // HREFLANG: Naples bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/locations/psychiatrist-naples`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/ubicaciones/psiquiatra-naples`
          }
        ]
      };

    case '/es/ubicaciones/psiquiatra-bonita-springs':
      return {
        canonical: `${baseUrl}/es/ubicaciones/psiquiatra-bonita-springs`,
        schema: getServiceSchema(baseUrl, 'Bonita Springs'),
        metaTags: [
          {
            name: 'description',
            content: '¿Busca atención psiquiátrica experta en Bonita Springs? La Dra. Melva Reve sirve el área de Bonita Springs FL con tratamiento para ansiedad, depresión, TDAH, TEPT. Llame (239) 423-0272.'
          },
          {
            property: 'og:title',
            content: 'Psiquiatra Cerca de Bonita Springs FL - Dra. Melva Reve | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es/ubicaciones/psiquiatra-bonita-springs`
          },
          // HREFLANG: Bonita Springs bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/locations/psychiatrist-bonita-springs`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/ubicaciones/psiquiatra-bonita-springs`
          }
        ]
      };

    case '/es/ubicaciones/psiquiatra-marco-island':
      return {
        canonical: `${baseUrl}/es/ubicaciones/psiquiatra-marco-island`,
        schema: getServiceSchema(baseUrl, 'Marco Island'),
        metaTags: [
          {
            name: 'description',
            content: '¿Busca atención psiquiátrica experta en Marco Island? La Dra. Melva Reve sirve el área de Marco Island FL con tratamiento para ansiedad, depresión, TDAH, TEPT. Llame (239) 423-0272.'
          },
          {
            property: 'og:title',
            content: 'Psiquiatra Cerca de Marco Island FL - Dra. Melva Reve | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es/ubicaciones/psiquiatra-marco-island`
          },
          // HREFLANG: Marco Island bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/locations/psychiatrist-marco-island`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/ubicaciones/psiquiatra-marco-island`
          }
        ]
      };

    case '/es/ubicaciones/psiquiatra-fort-myers':
      return {
        canonical: `${baseUrl}/es/ubicaciones/psiquiatra-fort-myers`,
        schema: getServiceSchema(baseUrl, 'Fort Myers'),
        metaTags: [
          {
            name: 'description',
            content: '¿Busca atención psiquiátrica experta en Fort Myers? La Dra. Melva Reve sirve el área de Fort Myers FL con tratamiento para ansiedad, depresión, TDAH, TEPT. Llame (239) 423-0272.'
          },
          {
            property: 'og:title',
            content: 'Psiquiatra Cerca de Fort Myers FL - Dra. Melva Reve | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es/ubicaciones/psiquiatra-fort-myers`
          },
          // HREFLANG: Fort Myers bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/locations/psychiatrist-fort-myers`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/ubicaciones/psiquiatra-fort-myers`
          }
        ]
      };

    case '/es/ubicaciones/psiquiatra-ave-maria':
      return {
        canonical: `${baseUrl}/es/ubicaciones/psiquiatra-ave-maria`,
        schema: getServiceSchema(baseUrl, 'Ave Maria'),
        metaTags: [
          {
            name: 'description',
            content: '¿Busca atención psiquiátrica experta en Ave Maria? La Dra. Melva Reve sirve el área de Ave Maria FL con tratamiento para ansiedad, depresión, TDAH, TEPT. Llame (239) 423-0272.'
          },
          {
            property: 'og:title',
            content: 'Psiquiatra Cerca de Ave Maria FL - Dra. Melva Reve | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es/ubicaciones/psiquiatra-ave-maria`
          },
          // HREFLANG: Ave Maria bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/locations/psychiatrist-ave-maria`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/ubicaciones/psiquiatra-ave-maria`
          }
        ]
      };

    case '/es/ubicaciones/psiquiatra-estero':
      return {
        canonical: `${baseUrl}/es/ubicaciones/psiquiatra-estero`,
        schema: getServiceSchema(baseUrl, 'Estero'),
        metaTags: [
          {
            name: 'description',
            content: '¿Busca atención psiquiátrica experta en Estero? La Dra. Melva Reve sirve el área de Estero FL con tratamiento para ansiedad, depresión, TDAH, TEPT. Llame (239) 423-0272.'
          },
          {
            property: 'og:title',
            content: 'Psiquiatra Cerca de Estero FL - Dra. Melva Reve | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es/ubicaciones/psiquiatra-estero`
          },
          // HREFLANG: Estero bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/locations/psychiatrist-estero`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/ubicaciones/psiquiatra-estero`
          }
        ]
      };

    case '/es/ubicaciones/psiquiatra-golden-gate':
      return {
        canonical: `${baseUrl}/es/ubicaciones/psiquiatra-golden-gate`,
        schema: getServiceSchema(baseUrl, 'Golden Gate'),
        metaTags: [
          {
            name: 'description',
            content: '¿Busca atención psiquiátrica experta en Golden Gate? La Dra. Melva Reve sirve el área de Golden Gate FL con tratamiento para ansiedad, depresión, TDAH, TEPT. Llame (239) 423-0272.'
          },
          {
            property: 'og:title',
            content: 'Psiquiatra Cerca de Golden Gate FL - Dra. Melva Reve | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es/ubicaciones/psiquiatra-golden-gate`
          },
          // HREFLANG: Golden Gate bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/locations/psychiatrist-golden-gate`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/ubicaciones/psiquiatra-golden-gate`
          }
        ]
      };

    case '/es/ubicaciones/psiquiatra-immokalee':
      return {
        canonical: `${baseUrl}/es/ubicaciones/psiquiatra-immokalee`,
        schema: getServiceSchema(baseUrl, 'Immokalee'),
        metaTags: [
          {
            name: 'description',
            content: '¿Busca atención psiquiátrica experta en Immokalee? La Dra. Melva Reve sirve el área de Immokalee FL con tratamiento para ansiedad, depresión, TDAH, TEPT. Llame (239) 423-0272.'
          },
          {
            property: 'og:title',
            content: 'Psiquiatra Cerca de Immokalee FL - Dra. Melva Reve | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es/ubicaciones/psiquiatra-immokalee`
          },
          // HREFLANG: Immokalee bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/locations/psychiatrist-immokalee`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/ubicaciones/psiquiatra-immokalee`
          }
        ]
      };

    case '/es/ubicaciones/psiquiatra-lely-resorts':
      return {
        canonical: `${baseUrl}/es/ubicaciones/psiquiatra-lely-resorts`,
        schema: getServiceSchema(baseUrl, 'Lely Resorts'),
        metaTags: [
          {
            name: 'description',
            content: '¿Busca atención psiquiátrica experta en Lely Resorts? La Dra. Melva Reve sirve el área de Lely Resorts FL con tratamiento para ansiedad, depresión, TDAH, TEPT. Llame (239) 423-0272.'
          },
          {
            property: 'og:title',
            content: 'Psiquiatra Cerca de Lely Resorts FL - Dra. Melva Reve | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es/ubicaciones/psiquiatra-lely-resorts`
          },
          // HREFLANG: Lely Resorts bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/locations/psychiatrist-lely-resorts`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/ubicaciones/psiquiatra-lely-resorts`
          }
        ]
      };

    case '/es/ubicaciones/psiquiatra-vanderbilt-beach':
      return {
        canonical: `${baseUrl}/es/ubicaciones/psiquiatra-vanderbilt-beach`,
        schema: getServiceSchema(baseUrl, 'Vanderbilt Beach'),
        metaTags: [
          {
            name: 'description',
            content: '¿Busca atención psiquiátrica experta en Vanderbilt Beach? La Dra. Melva Reve sirve el área de Vanderbilt Beach FL con tratamiento para ansiedad, depresión, TDAH, TEPT. Llame (239) 423-0272.'
          },
          {
            property: 'og:title',
            content: 'Psiquiatra Cerca de Vanderbilt Beach FL - Dra. Melva Reve | Healing Minds'
          },
          {
            property: 'og:url',
            content: `${baseUrl}/es/ubicaciones/psiquiatra-vanderbilt-beach`
          },
          // HREFLANG: Vanderbilt Beach bilingual versions
          {
            rel: 'alternate',
            hreflang: 'en',
            href: `${baseUrl}/locations/psychiatrist-vanderbilt-beach`
          },
          {
            rel: 'alternate',
            hreflang: 'es',
            href: `${baseUrl}/es/ubicaciones/psiquiatra-vanderbilt-beach`
          }
        ]
      };

    // Add more routes as needed
    default:
      return null;
  }
}

/**
 * Generate Service schema for Hub & Spoke pattern (satellite location pages)
 * Links to main MedicalClinic as provider while targeting specific areas
 */
function getServiceSchema(baseUrl: string, cityName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${baseUrl}/locations/psychiatrist-${cityName.toLowerCase().replace(/ /g, '-')}#Service`,
    "name": "Psychiatric Services",
    "description": `Expert psychiatric care and mental health services for ${cityName}, FL residents. Dr. Melva Reve provides comprehensive treatment for anxiety, depression, ADHD, PTSD, and other mental health conditions.`,
    "serviceType": "Psychiatric Care",
    "areaServed": {
      "@type": "City",
      "name": cityName,
      "addressRegion": "FL",
      "addressCountry": "US"
    },
    "provider": {
      "@type": "MedicalClinic",
      "@id": "https://www.healingmindsp.com/#MedicalClinic"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Psychiatric Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Anxiety Treatment"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Depression Treatment"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "ADHD Treatment"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "PTSD Treatment"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Medication Management"
          }
        }
      ]
    },
    "availableLanguage": ["English", "Spanish"],
    "url": `${baseUrl}/locations/psychiatrist-${cityName.toLowerCase().replace(/ /g, '-')}`
  };
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
    "image": `${baseUrl}/doctor-profile-v2.webp`,
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