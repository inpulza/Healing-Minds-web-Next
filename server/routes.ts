import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema, contactFormRequestSchema } from "@shared/schema";
import { evaluateContactSubmission } from "./services/spam-filter";
import { checkRateLimit } from "./services/rate-limiter";
import { getClientIp } from "./utils/client-ip";
import { generateSitemap, generateRobotsTxt, generateLlmsTxt } from "./routes/sitemap";
import { MetricoolService } from "./services/metricool";
import { reviewsCache } from "./cache/reviews-cache";
import { staticReviews, staticStats } from "./data/static-reviews";
import { emailService } from "./services/email";
import { injectMetaTags, isKnownRoute } from "./utils/html-injection";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // CRÍTICO: Production HTML Injection Middleware
  // Este middleware sirve index.html manualmente en producción para inyectar schemas
  // DEBE ejecutarse ANTES del static file handler
  // NOTE: Replit sets REPLIT_DEPLOYMENT=1 when deployed, not NODE_ENV=production
  const isProduction = process.env.NODE_ENV === 'production' || process.env.REPLIT_DEPLOYMENT === '1';

  // CRÍTICO: Redirect 301 apex (sin www) y dominios *.replit.app a la versión canónica con www.
  // DEBE ir ANTES del middleware de inyección de HTML (que termina la respuesta) para que el 301 ocurra.
  // Solo se activa en producción para no romper el preview de Replit Workspace.
  if (isProduction) {
    app.use((req, res, next) => {
      const rawHost = (req.get('host') || '').toLowerCase();
      // ":443" is the HTTPS default port. Google Frontend's implicit HTTP→HTTPS
      // redirect leaves it in the host; if we don't redirect it away, Google
      // treats "host:443" as a distinct origin and the Search Console fills up
      // with "Page with redirect" duplicates.
      const had443 = rawHost.endsWith(':443');
      const hostBare = had443 ? rawHost.slice(0, -4) : rawHost;
      const shouldRedirect =
        had443 ||
        hostBare === 'healingmindsp.com' ||
        hostBare.endsWith('.replit.app');
      if (shouldRedirect) {
        return res.redirect(301, `https://www.healingmindsp.com${req.originalUrl}`);
      }
      next();
    });
  }

  // El inglés vive en la raíz (no usamos prefijo /en/). Cualquier URL bajo
  // /en redirige en UN solo salto a su equivalente sin prefijo, para no servir
  // páginas vacías ni 404s a usuarios/motores con un enlace antiguo. Debe ir
  // ANTES del normalizador de trailing slash para que /en/ no haga 2 saltos.
  app.get(/^\/en(\/.*)?$/, (req, res) => {
    const rest = req.path.replace(/^\/en/, '');
    const cleaned = rest.replace(/\/+$/, '');
    const target = cleaned || '/';
    const qs = req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : '';
    res.redirect(301, target + qs);
  });

  // CRÍTICO: Bloqueo de URLs basura / hack / spam de parámetros.
  // DEBE ir ANTES del middleware de inyección de HTML (que termina la respuesta);
  // de lo contrario estas URLs devolvían 200 con el home y desperdiciaban crawl budget
  // (causa de los "Crawled - not indexed" / Soft 404 reportados en Search Console).
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    const url = req.originalUrl;
    const pathname = req.path;
    const qs = url.includes('?') ? url.slice(url.indexOf('?') + 1) : '';

    // 1) Hack de keywords japonés + spam de campañas/archivos → 410 Gone (contenido eliminado).
    if (
      url.includes('zhHant') ||
      url.includes('surugaya') ||
      qs.includes('campaign_uid') ||
      qs.includes('.html') ||
      qs.startsWith('cd_html') ||
      qs.startsWith('hobby') ||
      qs.startsWith('events') ||
      pathname.startsWith('/product/') ||
      pathname.includes('/zh') ||
      pathname.includes('/ja/')
    ) {
      console.log(`🚫 410 Gone: junk/hack URL blocked - ${url}`);
      return res.status(410).type('text/plain').send('Gone');
    }

    // 2) Spam de parámetro ?_g= → 403 Forbidden.
    if (url.includes('?_g=') || url.includes('&_g=')) {
      console.log(`🚫 403 Forbidden: parameter spam blocked - ${url}`);
      return res.status(403).type('text/plain').send('Forbidden');
    }

    // 3) URLs fantasma de WordPress (tema anterior) → 410 Gone.
    if (
      pathname.startsWith('/home-') ||
      pathname.startsWith('/member/') ||
      pathname.startsWith('/legend/') ||
      pathname.includes('/wp-') ||
      pathname.includes('/wordpress/') ||
      pathname.includes('/comments') ||
      pathname.endsWith('/feed') ||
      pathname.includes('/feed/') ||
      (pathname.includes('/blog/') && !pathname.startsWith('/blog'))
    ) {
      console.log(`🚫 410 Gone: WordPress legacy URL blocked - ${url}`);
      return res.status(410).type('text/plain').send('Gone');
    }

    next();
  });

  // SEO: Normalize trailing slashes. Redirect every path that ends with "/"
  // (except the root "/") to its slash-less version using a permanent 301.
  // Avoids /about and /about/ being treated as two duplicate pages by Google.
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    const path = req.path;
    if (path.length > 1 && path.endsWith('/') && !path.includes('.')) {
      const search = req.originalUrl.slice(req.path.length);
      return res.redirect(301, path.slice(0, -1) + search);
    }
    next();
  });

  // Legacy URL 301 redirects — MUST be registered BEFORE the unknown-route 404
  // middleware below, otherwise these paths (not in KNOWN_ROUTES) would be
  // returned as 404 in production before the redirect handler can run.
  app.get('/adhd-treatment-adults-naples-fl', (req, res) => {
    res.redirect(301, '/services/adhd-treatment');
  });
  app.get('/locations/naples', (req, res) => {
    res.redirect(301, '/locations/psychiatrist-naples');
  });
  app.get('/locations/psychiatrist-lely-resorts', (req, res) => {
    res.redirect(301, '/locations/psychiatrist-lely-resort');
  });
  app.get('/es/ubicaciones/psiquiatra-lely-resorts', (req, res) => {
    res.redirect(301, '/es/ubicaciones/psiquiatra-lely-resort');
  });

  if (isProduction) {
    app.use(async (req, res, next) => {
      // Solo procesar GET requests para páginas HTML (no APIs, no assets estáticos)
      if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.includes('.')) {
        try {
          // ES modules compatible path resolution (no __dirname)
          // This matches the path used in serveStatic() from server/vite.ts
          const moduleDir = dirname(fileURLToPath(import.meta.url));
          const indexPath = path.resolve(moduleDir, "public", "index.html");
          
          // Verify file exists before reading
          if (!fs.existsSync(indexPath)) {
            console.error(`❌ index.html not found at ${indexPath}, falling back to static handler`);
            return next();
          }
          
          let html = await fs.promises.readFile(indexPath, "utf-8");

          // SEO: real 404 for routes the SPA does not recognize. We still serve
          // the React app (so the NotFound page renders), but with HTTP 404 and
          // a noindex meta so Google removes/skips the URL. Fixes Soft 404s.
          // Use req.path so query strings (e.g. ?utm=...) don't trigger false 404s.
          const known = isKnownRoute(req.path);
          if (!known) {
            html = html.replace(
              /<meta\s+name=["']robots["'][^>]*>/i,
              '<meta name="robots" content="noindex, follow">'
            );
            console.log(`🚫 SEO [PRODUCTION]: 404 + noindex for unknown route ${req.originalUrl}`);
            html = injectMetaTags(html, req);
            return res.status(404).set({ "Content-Type": "text/html" }).end(html);
          }

          console.log(`🔧 SEO [PRODUCTION]: Injecting meta tags for ${req.originalUrl}`);
          html = injectMetaTags(html, req);

          return res.status(200).set({ "Content-Type": "text/html" }).end(html);
        } catch (error) {
          console.error("❌ Error serving HTML with injections, falling back to static handler:", error);
          // SAFETY: If anything fails, pass to next middleware (static handler)
          return next();
        }
      }
      next();
    });
  }

  // CRÍTICO: Development HTML Meta Tags Injection Middleware 
  // Este middleware intercepta responses HTML para inyectar meta tags server-side en desarrollo
  // En desarrollo, Vite envía el HTML como string, así que podemos interceptar res.end()
  if (!isProduction) {
    app.use((req, res, next) => {
      // Solo procesar requests que podrían ser páginas HTML (no APIs, no assets)
      if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.includes('.')) {
        const originalEnd = res.end;
        const known = isKnownRoute(req.path);

        res.end = function(chunk: any, encoding?: any) {
          if (typeof chunk === 'string' && chunk.includes('<!DOCTYPE html')) {
            let modifiedHtml = chunk;
            if (!known) {
              modifiedHtml = modifiedHtml.replace(
                /<meta\s+name=["']robots["'][^>]*>/i,
                '<meta name="robots" content="noindex, follow">'
              );
              console.log(`🚫 SEO [DEV]: 404 + noindex for unknown route ${req.originalUrl}`);
              res.status(404);
            } else {
              console.log(`🔧 SEO [DEV]: Injecting meta tags for ${req.originalUrl}`);
            }
            modifiedHtml = injectMetaTags(modifiedHtml, req);
            return originalEnd.call(this, modifiedHtml, encoding);
          }
          return originalEnd.call(this, chunk, encoding);
        };
      }
      next();
    });
  }

  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const ip = getClientIp(req);
      const emailForLimit =
        typeof req.body?.email === "string" ? req.body.email : undefined;

      // Rate limit by IP and by email. Over the limit → 429.
      const rateLimit = checkRateLimit(ip, emailForLimit);
      if (!rateLimit.allowed) {
        console.log(`🚫 Rate limit exceeded for contact form (ip=${ip})`);
        if (rateLimit.retryAfterSec) {
          res.set("Retry-After", String(rateLimit.retryAfterSec));
        }
        return res.status(429).json({
          success: false,
          message: "Too many requests. Please try again later.",
        });
      }

      // Validate request body (real fields + honeypot/timing fields).
      const submission = contactFormRequestSchema.parse(req.body);

      // Run anti-spam checks. On a spam verdict, respond as if it succeeded but
      // do NOT save, email, or trigger conversions (silent filtering).
      const verdict = await evaluateContactSubmission(submission);
      if (verdict.spam) {
        console.log(
          `🛡️ Contact submission silently filtered as spam (reason=${verdict.reason})`,
        );
        return res.status(202).json({ success: true, filtered: true });
      }

      // Strip anti-spam-only fields before persistence/email.
      const validatedData = insertContactMessageSchema.parse({
        firstName: submission.firstName,
        lastName: submission.lastName,
        email: submission.email,
        phone: submission.phone,
        preferredLanguage: submission.preferredLanguage,
        message: submission.message,
      });

      // Store the contact message
      const contactMessage = await storage.createContactMessage(validatedData);
      
      // Send notification email to practice and confirmation email to patient
      try {
        console.log("🔄 Starting email sending process...");
        await Promise.all([
          emailService.sendContactNotification(validatedData, { test: !isProduction }),
          emailService.sendConfirmationEmail(validatedData)
        ]);
        console.log("✅ Emails sent successfully for contact form submission");
      } catch (emailError) {
        console.error("❌ Error sending emails:", emailError);
        // Don't fail the entire request if email fails, but log the error
        // The contact message is still saved in storage
      }
      
      console.log("New contact message received:", contactMessage);
      
      // Return success response
      res.status(200).json({ 
        success: true, 
        message: "Contact message received successfully",
        id: contactMessage.id
      });
      
    } catch (error) {
      console.error("Error processing contact form:", error);
      
      if (error instanceof Error) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data",
          error: error.message
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
      }
    }
  });

  // Get all contact messages (for admin purposes)
  app.get("/api/contact-messages", async (req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.status(200).json({ success: true, data: messages });
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error fetching contact messages" 
      });
    }
  });

  // Reviews endpoints
  const metricoolService = new MetricoolService();

  // Get reviews with statistics
  app.get("/api/reviews", async (req, res) => {
    try {
      const cacheKey = "reviews-data";
      
      // Try to get from cache first
      let cachedData = reviewsCache.get(cacheKey);
      if (cachedData) {
        return res.status(200).json({ success: true, data: cachedData });
      }

      try {
        // Fetch from Metricool API
        const metricoolResponse = await metricoolService.fetchReviews();
        console.log('📊 Metricool response structure:', { 
          hasReviews: 'reviews' in metricoolResponse,
          reviewsType: typeof metricoolResponse.reviews,
          reviewsLength: metricoolResponse.reviews?.length || 0
        });
        
        const reviews = metricoolResponse.reviews || [];
        const transformedReviews = metricoolService.transformReviewsToUIFormat(reviews);
        const stats = metricoolService.calculateStats(reviews);

        const reviewsData = {
          stats,
          reviews: transformedReviews,
        };

        // Cache the successful response
        reviewsCache.set(cacheKey, reviewsData);
        
        res.status(200).json({ success: true, data: reviewsData });
      } catch (apiError) {
        // Fallback to static reviews if API fails
        console.log("📋 Using static reviews as fallback due to API error:", apiError);
        
        const fallbackData = {
          stats: staticStats,
          reviews: staticReviews,
        };
        
        res.status(200).json({ 
          success: true, 
          data: fallbackData, 
          fallback: true,
          message: "Using static reviews - API unavailable"
        });
      }
    } catch (error) {
      console.error("Error in reviews endpoint:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error fetching reviews" 
      });
    }
  });

  // Get only rating statistics
  app.get("/api/reviews/rating", async (req, res) => {
    try {
      const cacheKey = "reviews-data";
      let cachedData = reviewsCache.get(cacheKey);
      
      if (cachedData) {
        return res.status(200).json({ 
          success: true, 
          data: { 
            averageRating: cachedData.stats.averageRating,
            totalReviews: cachedData.stats.totalReviews 
          }
        });
      }

      try {
        const metricoolResponse = await metricoolService.fetchReviews();
        const stats = metricoolService.calculateStats(metricoolResponse.reviews);
        
        res.status(200).json({ 
          success: true, 
          data: { 
            averageRating: stats.averageRating,
            totalReviews: stats.totalReviews 
          }
        });
      } catch (apiError) {
        console.log("📋 Using static rating as fallback due to API error:", apiError);
        res.status(200).json({ 
          success: true, 
          data: { 
            averageRating: staticStats.averageRating,
            totalReviews: staticStats.totalReviews 
          },
          fallback: true
        });
      }
    } catch (error) {
      console.error("Error in reviews rating endpoint:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error fetching reviews rating" 
      });
    }
  });

  // Refresh reviews cache
  app.post("/api/reviews/refresh", async (req, res) => {
    try {
      reviewsCache.clear();
      res.status(200).json({ 
        success: true, 
        message: "Reviews cache cleared successfully" 
      });
    } catch (error) {
      console.error("Error clearing reviews cache:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error clearing cache" 
      });
    }
  });

  // TikTok posts endpoint
  app.get("/api/tiktok", async (req, res) => {
    try {
      console.log("🎵 TikTok API endpoint called");
      const tiktokData = await metricoolService.fetchTikTokPosts();
      
      res.status(200).json({ 
        success: true, 
        data: tiktokData 
      });
    } catch (error) {
      console.error("❌ Error in TikTok endpoint:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error fetching TikTok posts",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // SEO routes - Sitemap XML and Robots.txt
  app.get("/sitemap.xml", generateSitemap);
  app.get("/robots.txt", generateRobotsTxt);
  app.get("/llms.txt", generateLlmsTxt);

  // NOTA: El bloqueo de URLs basura/hack/spam ahora se registra mucho antes
  // (justo después del redirect /en) para que se ejecute ANTES del middleware
  // de inyección de HTML, que de lo contrario terminaba la respuesta con 200.

  const httpServer = createServer(app);
  return httpServer;
}
