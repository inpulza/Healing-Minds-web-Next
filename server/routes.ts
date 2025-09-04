import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { generateSitemap, generateRobotsTxt } from "./routes/sitemap";
import { MetricoolService } from "./services/metricool";
import { reviewsCache } from "./cache/reviews-cache";
import { staticReviews, staticStats } from "./data/static-reviews";

export async function registerRoutes(app: Express): Promise<Server> {
  // 301 redirect from old ADHD URL to new consistent URL
  app.get('/adhd-treatment-adults-naples-fl', (req, res) => {
    res.redirect(301, '/services/adhd-treatment');
  });
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate request body using Zod schema
      const validatedData = insertContactMessageSchema.parse(req.body);
      
      // Store the contact message
      const contactMessage = await storage.createContactMessage(validatedData);
      
      // In a real application, you would also send an email here
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

  const httpServer = createServer(app);
  return httpServer;
}
