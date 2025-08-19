import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { generateSitemap, generateRobotsTxt, generateGoogleVerification, generateAdvancedSitemap } from "./routes/sitemap";

export async function registerRoutes(app: Express): Promise<Server> {
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

  // SEO routes - Sitemap XML and Robots.txt
  app.get("/sitemap.xml", generateAdvancedSitemap);
  app.get("/sitemap-basic.xml", generateSitemap); // Keep basic version for compatibility
  app.get("/robots.txt", generateRobotsTxt);
  
  // Google Search Console verification routes
  app.get("/google:code.html", generateGoogleVerification);
  app.get("/googleverification/:code", generateGoogleVerification);
  app.get("/verification/:code", generateGoogleVerification);

  const httpServer = createServer(app);
  return httpServer;
}
