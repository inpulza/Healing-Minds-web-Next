import { Request, Response } from 'express';

// Sitemap XML generator for Dr. Melva Reve's psychiatric practice
export const generateSitemap = (req: Request, res: Response) => {
  // Determine preferred protocol and domain consistently
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  let host = req.get('host') || 'www.healingmindsp.com';
  
  // Ensure consistent www subdomain for canonical URLs
  if (host === 'healingmindsp.com') {
    host = 'www.healingmindsp.com';
  }
  
  const baseUrl = `${protocol}://${host}`;
  
  // Define realistic last modification dates for different types of content
  const recentDate = '2025-08-20'; // Recent major updates (Microsoft Clarity, schema optimization)
  const contentDate = '2025-08-15'; // Service page content updates
  const oldContentDate = '2025-07-15'; // Older established content
  const locationDate = '2025-09-15'; // New satellite location pages
  const legalDate = '2025-06-01'; // Legal pages (less frequent updates)
  
  // Define bilingual page relationships for hreflang
  const bilingualPages = [
    // Homepage with bilingual version
    {
      en: '/',
      es: '/es/',
      lastmod: recentDate,
      changefreq: 'weekly',
      priority: '1.0'
    },
    // Main pages with bilingual versions
    {
      en: '/about',
      es: '/es/acerca-de',
      lastmod: oldContentDate,
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      en: '/contact',
      es: '/es/contacto',
      lastmod: oldContentDate,
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      en: '/for-patients',
      es: '/es/para-pacientes',
      lastmod: oldContentDate,
      changefreq: 'monthly',
      priority: '0.6'
    },
    // Main service pages with bilingual versions
    {
      en: '/services',
      es: '/es/servicios',
      lastmod: contentDate,
      changefreq: 'monthly',
      priority: '0.8'
    },
    // Individual service pages with bilingual versions
    {
      en: '/services/anxiety-treatment',
      es: '/es/servicios/tratamiento-ansiedad',
      lastmod: contentDate,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      en: '/services/depression-treatment',
      es: '/es/servicios/tratamiento-depresion',
      lastmod: contentDate,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      en: '/services/adhd-treatment',
      es: '/es/servicios/tratamiento-adhd',
      lastmod: contentDate,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      en: '/services/ptsd-treatment',
      es: '/es/servicios/tratamiento-tept',
      lastmod: contentDate,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      en: '/services/bipolar-treatment',
      es: '/es/servicios/tratamiento-bipolar',
      lastmod: contentDate,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      en: '/services/medication-management',
      es: '/es/servicios/manejo-medicamentos',
      lastmod: contentDate,
      changefreq: 'monthly',
      priority: '0.7'
    },
    // Location pages with bilingual versions (CRITICAL for local SEO)
    {
      en: '/locations/psychiatrist-naples',
      es: '/es/ubicaciones/psiquiatra-naples',
      lastmod: oldContentDate,
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      en: '/locations/psychiatrist-bonita-springs',
      es: '/es/ubicaciones/psiquiatra-bonita-springs',
      lastmod: locationDate,
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      en: '/locations/psychiatrist-marco-island',
      es: '/es/ubicaciones/psiquiatra-marco-island',
      lastmod: locationDate,
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      en: '/locations/psychiatrist-fort-myers',
      es: '/es/ubicaciones/psiquiatra-fort-myers',
      lastmod: locationDate,
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      en: '/locations/psychiatrist-ave-maria',
      es: '/es/ubicaciones/psiquiatra-ave-maria',
      lastmod: locationDate,
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      en: '/locations/psychiatrist-estero',
      es: '/es/ubicaciones/psiquiatra-estero',
      lastmod: locationDate,
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      en: '/locations/psychiatrist-golden-gate',
      es: '/es/ubicaciones/psiquiatra-golden-gate',
      lastmod: locationDate,
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      en: '/locations/psychiatrist-immokalee',
      es: '/es/ubicaciones/psiquiatra-immokalee',
      lastmod: locationDate,
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      en: '/locations/psychiatrist-lely-resort',
      es: '/es/ubicaciones/psiquiatra-lely-resort',
      lastmod: locationDate,
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      en: '/locations/psychiatrist-vanderbilt-beach',
      es: '/es/ubicaciones/psiquiatra-vanderbilt-beach',
      lastmod: locationDate,
      changefreq: 'monthly',
      priority: '0.6'
    }
  ];

  // Pages that exist only in English (no Spanish version) - currently empty
  const englishOnlyPages: Array<{url: string, lastmod: string, changefreq: string, priority: string}> = [];
  
  // Define legal pages with bilingual support (lower priority as per SEO best practices)
  const legalPages = [
    {
      en: '/privacy-policy',
      es: '/es/politica-privacidad',
      lastmod: legalDate,
      changefreq: 'yearly',
      priority: '0.3'
    },
    {
      en: '/terms-of-service',
      es: '/es/terminos-servicio',
      lastmod: legalDate,
      changefreq: 'yearly',
      priority: '0.3'
    },
    {
      en: '/hipaa-notice',
      es: '/es/aviso-hipaa',
      lastmod: legalDate,
      changefreq: 'yearly',
      priority: '0.3'
    },
    {
      en: '/cookie-policy',
      es: '/es/politica-cookies',
      lastmod: legalDate,
      changefreq: 'yearly',
      priority: '0.3'
    }
  ];
  
  // Define site structure with priorities and update frequencies  
  const pages: Array<{url: string, lastmod: string, changefreq: string, priority: string}> = [];

  // Generate XML sitemap with hreflang support (currently unused as pages array is empty)
  const regularPagesXml = pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
  </url>`).join('\n');

  // Generate English-only pages (if any) with hreflang auto-reference
  const englishOnlyPagesXml = englishOnlyPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <xhtml:link 
                rel="alternate"
                hreflang="en"
                href="${baseUrl}${page.url}"
                />
    <lastmod>${page.lastmod}</lastmod>
  </url>`).join('\n');

  // Generate bilingual pages with optimized hreflang (cleaner, non-redundant approach)
  const bilingualPagesXml = bilingualPages.map(page => [
    // English version (canonical) with hreflang to both languages
    `  <url>
    <loc>${baseUrl}${page.en}</loc>
    <xhtml:link 
                rel="alternate"
                hreflang="en"
                href="${baseUrl}${page.en}"
                />
    <xhtml:link 
                rel="alternate"
                hreflang="es"
                href="${baseUrl}${page.es}"
                />
    <lastmod>${page.lastmod}</lastmod>
  </url>`,
    // Spanish version with hreflang to both languages
    `  <url>
    <loc>${baseUrl}${page.es}</loc>
    <xhtml:link 
                rel="alternate"
                hreflang="en"
                href="${baseUrl}${page.en}"
                />
    <xhtml:link 
                rel="alternate"
                hreflang="es"
                href="${baseUrl}${page.es}"
                />
    <lastmod>${page.lastmod}</lastmod>
  </url>`
  ]).flat().join('\n');

  // Generate legal pages with hreflang (indexed for trust signals)
  const legalPagesXml = legalPages.map(page => [
    // English version with hreflang
    `  <url>
    <loc>${baseUrl}${page.en}</loc>
    <xhtml:link 
                rel="alternate"
                hreflang="en"
                href="${baseUrl}${page.en}"
                />
    <xhtml:link 
                rel="alternate"
                hreflang="es"
                href="${baseUrl}${page.es}"
                />
    <lastmod>${page.lastmod}</lastmod>
  </url>`,
    // Spanish version with hreflang
    `  <url>
    <loc>${baseUrl}${page.es}</loc>
    <xhtml:link 
                rel="alternate"
                hreflang="en"
                href="${baseUrl}${page.en}"
                />
    <xhtml:link 
                rel="alternate"
                hreflang="es"
                href="${baseUrl}${page.es}"
                />
    <lastmod>${page.lastmod}</lastmod>
  </url>`
  ]).flat().join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${regularPagesXml}
${bilingualPagesXml}
${englishOnlyPagesXml}
${legalPagesXml}
</urlset>`;

  // Set proper headers for XML
  res.set({
    'Content-Type': 'application/xml',
    'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
  });
  
  res.send(sitemapXml);
};

// Robots.txt generator to reference sitemap
export const generateRobotsTxt = (req: Request, res: Response) => {
  // Determine preferred protocol and domain consistently
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  let host = req.get('host') || 'www.healingmindsp.com';
  
  // Ensure consistent www subdomain for canonical URLs
  if (host === 'healingmindsp.com') {
    host = 'www.healingmindsp.com';
  }
  
  const baseUrl = `${protocol}://${host}`;
  
  // OPTIMIZADO: Robots.txt conforme a directrices Google 2025
  const robotsTxt = `User-agent: *
Allow: /

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Block backend endpoints and admin areas
Disallow: /api/
Disallow: /server/
Disallow: /admin/
Disallow: /_next/
Disallow: /404
Disallow: /500

# Block URLs with tracking parameters
Disallow: /*?_g=

# Block resource-intensive crawlers
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /`;

  res.set({
    'Content-Type': 'text/plain',
    'Cache-Control': 'public, max-age=86400'
  });
  
  res.send(robotsTxt);
};