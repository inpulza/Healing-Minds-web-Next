import { Request, Response } from 'express';

// Sitemap XML generator for Dr. Melva Reve's psychiatric practice
export const generateSitemap = (req: Request, res: Response) => {
  // Use X-Forwarded-Proto header if available (for Replit proxy), otherwise fallback to req.protocol
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const baseUrl = `${protocol}://${req.get('host')}`;
  
  // Define realistic last modification dates for different types of content
  const recentDate = '2025-08-20'; // Recent major updates (Microsoft Clarity, schema optimization)
  const contentDate = '2025-08-15'; // Service page content updates
  const oldContentDate = '2025-07-15'; // Older established content
  const legalDate = '2025-06-01'; // Legal pages (less frequent updates)
  
  // Define bilingual page relationships for hreflang
  const bilingualPages = [
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
    }
  ];

  // Pages that exist only in English (no Spanish version)
  const englishOnlyPages = [
    {
      url: '/locations/naples',
      lastmod: oldContentDate,
      changefreq: 'monthly',
      priority: '0.6'
    }
  ];
  
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
  const pages = [
    // Homepage - Maximum priority (recent schema and analytics updates)
    {
      url: '/',
      lastmod: recentDate,
      changefreq: 'weekly',
      priority: '1.0'
    }
  ];

  // Generate XML sitemap with hreflang support
  const regularPagesXml = pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n');

  // Generate English-only pages
  const englishOnlyPagesXml = englishOnlyPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n');

  // Generate bilingual service pages with hreflang
  const bilingualPagesXml = bilingualPages.flatMap(page => [
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
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
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
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  ]).join('\n');

  // Generate legal pages with hreflang (indexed for trust signals)
  const legalPagesXml = legalPages.flatMap(page => [
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
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
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
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  ]).join('\n');

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
  // Use X-Forwarded-Proto header if available (for Replit proxy), otherwise fallback to req.protocol
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const baseUrl = `${protocol}://${req.get('host')}`;
  
  const robotsTxt = `User-agent: *
Allow: /

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Block admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /404
Disallow: /500`;

  res.set({
    'Content-Type': 'text/plain',
    'Cache-Control': 'public, max-age=86400'
  });
  
  res.send(robotsTxt);
};