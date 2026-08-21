import { Request, Response } from 'express';
import {
  getBlogIndexPath,
  getBlogPostPath,
  getBlogPosts,
  getPostTranslations,
  type BlogLanguage,
  type BlogPostWithRelations,
} from '../blog/storage';
import { getSeoSiteConfig } from '../seo/config';
import { getSitemapEntries } from '@shared/routeManifest';

function getBaseUrl(): string {
  return getSeoSiteConfig().siteBaseUrl;
}

function getBlogLastMod(post: BlogPostWithRelations): string {
  const date = post.publishedAt || post.updatedAt || post.createdAt;
  return date.toISOString().split('T')[0];
}

function getBlogHreflangLinks(baseUrl: string, posts: BlogPostWithRelations[]): string {
  const byLanguage = new Map<BlogLanguage, BlogPostWithRelations>();
  for (const post of posts) {
    if (post.language === 'en' || post.language === 'es') {
      byLanguage.set(post.language, post);
    }
  }

  const links = (['en', 'es'] as const)
    .map(language => byLanguage.get(language))
    .filter((post): post is BlogPostWithRelations => Boolean(post))
    .map(post => `    <xhtml:link
                rel="alternate"
                hreflang="${post.language}"
                href="${baseUrl}${getBlogPostPath(post)}"
                />`);

  const defaultPost = byLanguage.get('en') || posts[0];
  if (defaultPost) {
    links.push(`    <xhtml:link
                rel="alternate"
                hreflang="x-default"
                href="${baseUrl}${getBlogPostPath(defaultPost)}"
                />`);
  }

  return links.join('\n');
}

// Sitemap XML generator for Dr. Melva Reve's psychiatric practice
export const generateSitemap = async (req: Request, res: Response) => {
  const baseUrl = getBaseUrl();
  
  // Static pages come from the single route manifest (shared/routeManifest.ts).
  // The split below only preserves the historical sitemap block order
  // (main/service/location pages first, then legal pages).
  const sitemapEntries = getSitemapEntries();
  const bilingualPages = sitemapEntries.filter(page => page.changefreq !== 'yearly');
  const legalPages = sitemapEntries.filter(page => page.changefreq === 'yearly');

  // Pages that exist only in English (no Spanish version) - currently empty
  const englishOnlyPages: Array<{url: string, changefreq: string, priority: string}> = [];

  // Define site structure with priorities and update frequencies  
  const pages: Array<{url: string, changefreq: string, priority: string}> = [];

  // Generate XML sitemap with hreflang support (currently unused as pages array is empty)
  const regularPagesXml = pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
  </url>`).join('\n');

  // Generate English-only pages (if any) with hreflang auto-reference
  const englishOnlyPagesXml = englishOnlyPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <xhtml:link
                rel="alternate"
                hreflang="en"
                href="${baseUrl}${page.url}"
                />
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
  </url>`
  ]).flat().join('\n');

  const blogPosts = await getBlogPosts({ status: 'published', limit: 500 });
  const blogPostPagesXml = await Promise.all(blogPosts.map(async post => {
    const translations = await getPostTranslations(post.translationGroupId);
    return `  <url>
    <loc>${baseUrl}${getBlogPostPath(post)}</loc>
    <lastmod>${getBlogLastMod(post)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
${getBlogHreflangLinks(baseUrl, translations)}
  </url>`;
  }));

  const blogPagesXml = [
    `  <url>
    <loc>${baseUrl}/blog</loc>
    <xhtml:link
                rel="alternate"
                hreflang="en"
                href="${baseUrl}${getBlogIndexPath('en')}"
                />
    <xhtml:link
                rel="alternate"
                hreflang="es"
                href="${baseUrl}${getBlogIndexPath('es')}"
                />
    <xhtml:link
                rel="alternate"
                hreflang="x-default"
                href="${baseUrl}${getBlogIndexPath('en')}"
                />
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`,
    `  <url>
    <loc>${baseUrl}/es/blog</loc>
    <xhtml:link
                rel="alternate"
                hreflang="en"
                href="${baseUrl}${getBlogIndexPath('en')}"
                />
    <xhtml:link
                rel="alternate"
                hreflang="es"
                href="${baseUrl}${getBlogIndexPath('es')}"
                />
    <xhtml:link
                rel="alternate"
                hreflang="x-default"
                href="${baseUrl}${getBlogIndexPath('en')}"
                />
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`,
    ...blogPostPagesXml,
  ].join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${regularPagesXml}
${bilingualPagesXml}
${englishOnlyPagesXml}
${legalPagesXml}
${blogPagesXml}
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
  const baseUrl = getBaseUrl();
  
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

// llms.txt generator — gives AI search engines a clean, plain-text map of the site.
// Format follows the spec at https://llmstxt.org (H1 title, blockquote summary, link sections).
export const generateLlmsTxt = async (req: Request, res: Response) => {
  const baseUrl = getBaseUrl();
  const blogPosts = await getBlogPosts({ status: 'published', limit: 100 });

  const llmsTxt = `# Healing Minds Psychiatry

> Legacy bilingual (English/Spanish) psychiatry practice summary for Dr. Melva Reve in Naples, FL. The office confirms service availability, clinical suitability, modality and licensing requirements case by case. Address: 4760 Tamiami Trl N #25, Naples, FL 34103. Phone: (239) 423-0272.

## Main Pages
- [Home](${baseUrl}/): Overview of the practice, Dr. Melva Reve, and services
- [About Dr. Melva Reve](${baseUrl}/about): Training, credentials, and approach to care
- [Services](${baseUrl}/services): Full list of psychiatric services offered
- [For Patients](${baseUrl}/for-patients): Forms, insurance, and what to expect
- [Contact](${baseUrl}/contact): Address, phone, and appointment scheduling
- [Telepsychiatry Florida](${baseUrl}/telepsychiatry-florida): Virtual psychiatric care across Florida
- [Blog](${baseUrl}/blog): Educational articles from Healing Minds Psychiatry

## Services
- [Anxiety Treatment](${baseUrl}/services/anxiety-treatment)
- [Depression Treatment](${baseUrl}/services/depression-treatment)
- [ADHD Treatment](${baseUrl}/services/adhd-treatment)
- [PTSD Treatment](${baseUrl}/services/ptsd-treatment)
- [Bipolar Treatment](${baseUrl}/services/bipolar-treatment)
- [Medication Management](${baseUrl}/services/medication-management)

## Blog
${blogPosts.map(post => `- [${post.title}](${baseUrl}${getBlogPostPath(post)}): ${post.excerpt || ''}`).join('\n')}

## Locations
- [Psychiatrist in Naples](${baseUrl}/locations/psychiatrist-naples)
- [Psychiatrist in Bonita Springs](${baseUrl}/locations/psychiatrist-bonita-springs)
- [Psychiatrist in Marco Island](${baseUrl}/locations/psychiatrist-marco-island)
- [Psychiatrist in Fort Myers](${baseUrl}/locations/psychiatrist-fort-myers)
- [Psychiatrist in Estero](${baseUrl}/locations/psychiatrist-estero)
- [Psychiatrist in Ave Maria](${baseUrl}/locations/psychiatrist-ave-maria)
- [Psychiatrist in Golden Gate](${baseUrl}/locations/psychiatrist-golden-gate)
- [Psychiatrist in Immokalee](${baseUrl}/locations/psychiatrist-immokalee)
- [Psychiatrist in Lely Resort](${baseUrl}/locations/psychiatrist-lely-resort)
- [Psychiatrist in Vanderbilt Beach](${baseUrl}/locations/psychiatrist-vanderbilt-beach)

## Spanish / Español
- [Inicio](${baseUrl}/es): Versión en español del sitio
- [Acerca de la Dra. Melva Reve](${baseUrl}/es/acerca-de): Sobre la Dra. Melva Reve
- [Servicios](${baseUrl}/es/servicios): Servicios psiquiátricos
- [Telepsiquiatría Florida](${baseUrl}/es/telepsiquiatria-florida): Atención psiquiátrica virtual en toda Florida
- [Para Pacientes](${baseUrl}/es/para-pacientes): Información para pacientes
- [Contacto](${baseUrl}/es/contacto): Dirección, teléfono y citas

## Servicios en Español
- [Tratamiento de Ansiedad](${baseUrl}/es/servicios/tratamiento-ansiedad)
- [Tratamiento de Depresión](${baseUrl}/es/servicios/tratamiento-depresion)
- [Tratamiento de ADHD](${baseUrl}/es/servicios/tratamiento-adhd)
- [Tratamiento de TEPT](${baseUrl}/es/servicios/tratamiento-tept)
- [Tratamiento Bipolar](${baseUrl}/es/servicios/tratamiento-bipolar)
- [Manejo de Medicamentos](${baseUrl}/es/servicios/manejo-medicamentos)

## Ubicaciones en Español
- [Psiquiatra en Naples](${baseUrl}/es/ubicaciones/psiquiatra-naples)
- [Psiquiatra en Bonita Springs](${baseUrl}/es/ubicaciones/psiquiatra-bonita-springs)
- [Psiquiatra en Marco Island](${baseUrl}/es/ubicaciones/psiquiatra-marco-island)
- [Psiquiatra en Fort Myers](${baseUrl}/es/ubicaciones/psiquiatra-fort-myers)
- [Psiquiatra en Estero](${baseUrl}/es/ubicaciones/psiquiatra-estero)
- [Psiquiatra en Ave Maria](${baseUrl}/es/ubicaciones/psiquiatra-ave-maria)
- [Psiquiatra en Golden Gate](${baseUrl}/es/ubicaciones/psiquiatra-golden-gate)
- [Psiquiatra en Immokalee](${baseUrl}/es/ubicaciones/psiquiatra-immokalee)
- [Psiquiatra en Lely Resort](${baseUrl}/es/ubicaciones/psiquiatra-lely-resort)
- [Psiquiatra en Vanderbilt Beach](${baseUrl}/es/ubicaciones/psiquiatra-vanderbilt-beach)

## Legal
- [Privacy Policy](${baseUrl}/privacy-policy)
- [Terms of Service](${baseUrl}/terms-of-service)
- [HIPAA Notice](${baseUrl}/hipaa-notice)
- [Cookie Policy](${baseUrl}/cookie-policy)
- [Cancellation Policy](${baseUrl}/cancellation-policy)
- [Billing Policy](${baseUrl}/billing-policy)
- [Emergency Policy](${baseUrl}/emergency-policy)
- [Patient Rights](${baseUrl}/patient-rights)
- [Telehealth Informed Consent](${baseUrl}/telehealth-consent)
- [No Surprises Act](${baseUrl}/no-surprises-act)
- [Accessibility Statement](${baseUrl}/accessibility-statement)
- [Nondiscrimination Notice](${baseUrl}/nondiscrimination-notice)
- [Communications Policy](${baseUrl}/communications-policy)
- [Medical Disclaimer](${baseUrl}/medical-disclaimer)

## Legal en Español
- [Política de Privacidad](${baseUrl}/es/politica-privacidad)
- [Términos de Servicio](${baseUrl}/es/terminos-servicio)
- [Aviso HIPAA](${baseUrl}/es/aviso-hipaa)
- [Política de Cookies](${baseUrl}/es/politica-cookies)
- [Política de Cancelación](${baseUrl}/es/politica-cancelacion)
- [Política de Facturación](${baseUrl}/es/politica-facturacion)
- [Política de Emergencias](${baseUrl}/es/politica-emergencias)
- [Derechos del Paciente](${baseUrl}/es/derechos-paciente)
- [Consentimiento Informado de Telesalud](${baseUrl}/es/consentimiento-telesalud)
- [Ley Sin Sorpresas](${baseUrl}/es/ley-sin-sorpresas)
- [Declaración de Accesibilidad](${baseUrl}/es/declaracion-accesibilidad)
- [Aviso de No Discriminación](${baseUrl}/es/aviso-no-discriminacion)
- [Política de Comunicaciones](${baseUrl}/es/politica-comunicaciones)
- [Descargo de Responsabilidad Médica](${baseUrl}/es/descargo-responsabilidad-medica)
`;

  res.set({
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'public, max-age=86400'
  });

  res.send(llmsTxt);
};
