import { Request, Response } from 'express';

// Sitemap XML generator for Dr. Melva Reve's psychiatric practice
export const generateSitemap = (req: Request, res: Response) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Define site structure with priorities and update frequencies
  const pages = [
    // Homepage - Maximum priority
    {
      url: '/',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '1.0'
    },
    
    // Main service pages - Very high priority
    {
      url: '/services',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      url: '/about',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      url: '/contact',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8'
    },
    
    // Individual service pages - High priority for SEO
    {
      url: '/services/anxiety-treatment',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      url: '/services/depression-treatment',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      url: '/services/adhd-treatment',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      url: '/services/ptsd-treatment',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      url: '/services/bipolar-treatment',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      url: '/services/medication-management',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7'
    },
    
    // Spanish content - Important for bilingual SEO
    {
      url: '/servicios-espanol',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      url: '/es/servicios/tratamiento-ansiedad',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      url: '/es/servicios/tratamiento-depresion',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      url: '/es/servicios/tratamiento-tdah',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      url: '/es/servicios/tratamiento-tept',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      url: '/es/servicios/tratamiento-bipolar',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      url: '/es/servicios/manejo-medicamentos',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7'
    },
    
    // Location and patient info pages
    {
      url: '/locations/naples',
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: '0.6'
    },
    {
      url: '/for-patients',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.6'
    }
  ];

  // Generate XML sitemap
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
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
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  
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