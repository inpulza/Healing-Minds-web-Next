import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { trackEvent } from '../client/src/lib/analytics';

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

  const httpServer = createServer(app);
  return httpServer;
}
