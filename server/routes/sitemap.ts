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

// Enhanced Robots.txt generator with Google Search Console optimizations
export const generateRobotsTxt = (req: Request, res: Response) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  
  const robotsTxt = `# Healing Minds Psychiatry - Dr. Melva Reve
# Naples, FL Mental Health Services
# Generated: ${new Date().toISOString()}

# Allow all crawlers access to the site
User-agent: *
Allow: /
Crawl-delay: 1

# Specific allowances for major search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 1

# Social media crawlers
User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

# Block resource-intensive bots
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: MegaIndex
Disallow: /

# Block admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /node_modules/
Disallow: /dist/
Disallow: /gsc-diagnostic/
Disallow: /*.js$
Disallow: /*.css$
Disallow: /*.json$

# Block error pages
Disallow: /404
Disallow: /500
Disallow: /*?*error=
Disallow: /*?*debug=

# Allow important files
Allow: /sitemap.xml
Allow: /robots.txt
Allow: /*.webp$
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.svg$

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Additional medical practice information
# Medical specialties: Psychiatry, Mental Health, Anxiety, Depression, ADHD, PTSD, Bipolar
# Languages: English, Spanish
# Location: Naples, FL`;

  res.set({
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'public, max-age=86400, s-maxage=604800'
  });
  
  res.send(robotsTxt);
};

// Google Search Console HTML verification file generator
export const generateGoogleVerification = (req: Request, res: Response) => {
  const { code } = req.params;
  
  if (!code) {
    return res.status(400).send('Verification code required');
  }

  const htmlContent = `google-site-verification: google${code}.html`;
  
  res.set({
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'public, max-age=86400'
  });
  
  res.send(htmlContent);
};

// Advanced sitemap with Google Search Console optimizations
export const generateAdvancedSitemap = (req: Request, res: Response) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Enhanced page structure with additional metadata
  const pages = [
    // Homepage - Maximum priority with bilingual support
    {
      url: '/',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '1.0',
      alternates: [
        { lang: 'en', url: '/' },
        { lang: 'es', url: '/es/' },
        { lang: 'x-default', url: '/' }
      ]
    },
    
    // Main service pages - Very high priority
    {
      url: '/services',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.9',
      alternates: [
        { lang: 'en', url: '/services' },
        { lang: 'es', url: '/servicios-espanol' }
      ]
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
      changefreq: 'weekly',
      priority: '0.9'
    },
    {
      url: '/for-patients',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7'
    },
    
    // Location pages - High priority for local SEO
    {
      url: '/locations/naples',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.9'
    },
    
    // Spanish main pages
    {
      url: '/servicios-espanol',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.9',
      alternates: [
        { lang: 'es', url: '/servicios-espanol' },
        { lang: 'en', url: '/services' }
      ]
    },
    
    // Individual service pages - English
    ...['anxiety-treatment', 'depression-treatment', 'adhd-treatment', 'ptsd-treatment', 'bipolar-treatment', 'medication-management'].map(service => ({
      url: `/services/${service}`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8',
      alternates: [
        { lang: 'en', url: `/services/${service}` },
        { lang: 'es', url: `/es/servicios/${service.replace('-treatment', '').replace('anxiety', 'tratamiento-ansiedad').replace('depression', 'tratamiento-depresion').replace('adhd', 'tratamiento-tdah').replace('ptsd', 'tratamiento-tept').replace('bipolar', 'tratamiento-bipolar').replace('medication-management', 'manejo-medicamentos')}` }
      ]
    })),
    
    // Individual service pages - Spanish
    ...['tratamiento-ansiedad', 'tratamiento-depresion', 'tratamiento-tdah', 'tratamiento-tept', 'tratamiento-bipolar', 'manejo-medicamentos'].map(servicio => ({
      url: `/es/servicios/${servicio}`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8',
      alternates: [
        { lang: 'es', url: `/es/servicios/${servicio}` },
        { lang: 'en', url: `/services/${servicio.replace('tratamiento-ansiedad', 'anxiety-treatment').replace('tratamiento-depresion', 'depression-treatment').replace('tratamiento-tdah', 'adhd-treatment').replace('tratamiento-tept', 'ptsd-treatment').replace('tratamiento-bipolar', 'bipolar-treatment').replace('manejo-medicamentos', 'medication-management')}` }
      ]
    }))
  ];

  // Generate enhanced XML sitemap with hreflang support
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages.map(page => {
  let urlEntry = `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>`;
    
  // Add hreflang alternates if present
  if (page.alternates) {
    page.alternates.forEach(alt => {
      urlEntry += `\n    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${baseUrl}${alt.url}" />`;
    });
  }
  
  urlEntry += '\n  </url>';
  return urlEntry;
}).join('\n')}
</urlset>`;

  // Set proper headers for XML with enhanced caching
  res.set({
    'Content-Type': 'application/xml; charset=utf-8',
    'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    'Last-Modified': new Date().toUTCString(),
    'ETag': `"sitemap-${currentDate}"`
  });
  
  res.send(sitemapXml);
};