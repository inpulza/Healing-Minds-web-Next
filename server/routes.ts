import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { generateSitemap, generateRobotsTxt } from "./routes/sitemap";
import { MetricoolService } from "./services/metricool";
import { reviewsCache } from "./cache/reviews-cache";
import { staticReviews, staticStats } from "./data/static-reviews";
import { emailService } from "./services/email";
import { injectMetaTags } from "./utils/html-injection";
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
        
        res.end = function(chunk: any, encoding?: any) {
          if (typeof chunk === 'string' && chunk.includes('<!DOCTYPE html')) {
            console.log(`🔧 SEO [DEV]: Injecting meta tags for ${req.originalUrl}`);
            const modifiedHtml = injectMetaTags(chunk, req);
            return originalEnd.call(this, modifiedHtml, encoding);
          }
          return originalEnd.call(this, chunk, encoding);
        };
      }
      next();
    });
  }

  // CRÍTICO: Redirect non-www to www for domain consistency
  app.use((req, res, next) => {
    const host = req.get('host');
    if (host === 'healingmindsp.com') {
      const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
      return res.redirect(301, `${protocol}://www.healingmindsp.com${req.url}`);
    }
    next();
  });

  // 301 redirect from old ADHD URL to new consistent URL
  app.get('/adhd-treatment-adults-naples-fl', (req, res) => {
    res.redirect(301, '/services/adhd-treatment');
  });

  // 301 redirect from legacy Naples location URL to new consistent URL
  app.get('/locations/naples', (req, res) => {
    res.redirect(301, '/locations/psychiatrist-naples');
  });

  // 301 redirects from old Lely Resort URLs with 's' to new consistent URLs without 's'
  app.get('/locations/psychiatrist-lely-resorts', (req, res) => {
    res.redirect(301, '/locations/psychiatrist-lely-resort');
  });

  app.get('/es/ubicaciones/psiquiatra-lely-resorts', (req, res) => {
    res.redirect(301, '/es/ubicaciones/psiquiatra-lely-resort');
  });

  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate request body using Zod schema
      const validatedData = insertContactMessageSchema.parse(req.body);
      
      // Store the contact message
      const contactMessage = await storage.createContactMessage(validatedData);
      
      // Send notification email to practice and confirmation email to patient
      try {
        console.log("🔄 Starting email sending process...");
        await Promise.all([
          emailService.sendContactNotification(validatedData),
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

  // CRÍTICO: URL Cleanup Middleware - DEBE ir ANTES del catch-all routing
  // Esta es la solución definitiva para Soft 404 y spam de parámetros
  app.use((req, res, next) => {
    const url = req.originalUrl;
    const pathname = req.path;

    // 1. HACKEO: Japanese Keyword Hack URLs → 410 Gone (contenido eliminado permanentemente)
    if (url.includes('zhHant') || 
        url.includes('surugaya') || 
        url.includes('product/surugaya') ||
        pathname.startsWith('/product/') ||
        pathname.includes('/zh') ||
        pathname.includes('/ja/')) {
      console.log(`🚫 410 Gone: Japanese hack URL blocked - ${url}`);
      return res.status(410).json({
        error: 'Gone',
        message: 'This content has been permanently removed',
        code: 410
      });
    }

    // 2. SPAM: URLs con parámetro ?_g= → 403 Forbidden (acceso denegado)
    if (url.includes('?_g=') || url.includes('&_g=')) {
      console.log(`🚫 403 Forbidden: Parameter spam blocked - ${url}`);
      return res.status(403).json({
        error: 'Forbidden', 
        message: 'Access denied - parameter spam detected',
        code: 403
      });
    }

    // 3. WORDPRESS LEGACY: URLs fantasma del tema anterior → 404 Not Found
    if (pathname.startsWith('/home-') ||
        pathname.startsWith('/member/') ||
        pathname.startsWith('/legend/') ||
        pathname.includes('/wp-') ||
        pathname.includes('/wordpress/') ||
        pathname.includes('/blog/') && !pathname.startsWith('/blog') // Bloquea /blog/algo pero permite /blog
        ) {
      console.log(`🚫 404 Not Found: WordPress legacy URL blocked - ${url}`);
      return res.status(404).json({
        error: 'Not Found',
        message: 'The requested page does not exist',
        code: 404
      });
    }

    // 4. URLs legítimas → continuar al SPA routing normal
    next();
  });

  const httpServer = createServer(app);
  return httpServer;
}
