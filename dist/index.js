// server/index.ts
import express2 from "express";
import compression from "compression";

// server/routes.ts
import { createServer } from "http";
import fs from "fs";
import path from "path";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  users;
  contactMessages;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.contactMessages = /* @__PURE__ */ new Map();
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async createContactMessage(insertMessage) {
    const id = randomUUID();
    const createdAt = /* @__PURE__ */ new Date();
    const contactMessage = {
      ...insertMessage,
      phone: insertMessage.phone || null,
      preferredLanguage: insertMessage.preferredLanguage || "english",
      id,
      createdAt
    };
    this.contactMessages.set(id, contactMessage);
    return contactMessage;
  }
  async getAllContactMessages() {
    return Array.from(this.contactMessages.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  async getContactMessageById(id) {
    return this.contactMessages.get(id);
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  preferredLanguage: text("preferred_language").notNull().default("english"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true
});
var reviewSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().optional(),
  date: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  fullComment: z.string(),
  createdAt: z.date()
});
var reviewsStatsSchema = z.object({
  averageRating: z.number(),
  totalReviews: z.number(),
  ratingDistribution: z.object({
    5: z.number(),
    4: z.number(),
    3: z.number(),
    2: z.number(),
    1: z.number()
  })
});
var reviewsResponseSchema = z.object({
  stats: reviewsStatsSchema,
  reviews: z.array(reviewSchema)
});

// server/routes/sitemap.ts
var generateSitemap = (req, res) => {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
  let host = req.get("host") || "www.healingmindsp.com";
  if (host === "healingmindsp.com") {
    host = "www.healingmindsp.com";
  }
  const baseUrl = `${protocol}://${host}`;
  const recentDate = "2025-08-20";
  const contentDate = "2025-08-15";
  const oldContentDate = "2025-07-15";
  const locationDate = "2025-09-15";
  const legalDate = "2025-06-01";
  const bilingualPages = [
    // Homepage with bilingual version
    {
      en: "/",
      es: "/es/",
      lastmod: recentDate,
      changefreq: "weekly",
      priority: "1.0"
    },
    // Main pages with bilingual versions
    {
      en: "/about",
      es: "/es/acerca-de",
      lastmod: oldContentDate,
      changefreq: "monthly",
      priority: "0.8"
    },
    {
      en: "/contact",
      es: "/es/contacto",
      lastmod: oldContentDate,
      changefreq: "monthly",
      priority: "0.8"
    },
    {
      en: "/for-patients",
      es: "/es/para-pacientes",
      lastmod: oldContentDate,
      changefreq: "monthly",
      priority: "0.6"
    },
    {
      en: "/telepsychiatry-florida",
      es: "/es/telepsiquiatria-florida",
      lastmod: recentDate,
      changefreq: "monthly",
      priority: "0.8"
    },
    // Main service pages with bilingual versions
    {
      en: "/services",
      es: "/es/servicios",
      lastmod: contentDate,
      changefreq: "monthly",
      priority: "0.8"
    },
    // Individual service pages with bilingual versions
    {
      en: "/services/anxiety-treatment",
      es: "/es/servicios/tratamiento-ansiedad",
      lastmod: contentDate,
      changefreq: "monthly",
      priority: "0.7"
    },
    {
      en: "/services/depression-treatment",
      es: "/es/servicios/tratamiento-depresion",
      lastmod: contentDate,
      changefreq: "monthly",
      priority: "0.7"
    },
    {
      en: "/services/adhd-treatment",
      es: "/es/servicios/tratamiento-adhd",
      lastmod: contentDate,
      changefreq: "monthly",
      priority: "0.7"
    },
    {
      en: "/services/ptsd-treatment",
      es: "/es/servicios/tratamiento-tept",
      lastmod: contentDate,
      changefreq: "monthly",
      priority: "0.7"
    },
    {
      en: "/services/bipolar-treatment",
      es: "/es/servicios/tratamiento-bipolar",
      lastmod: contentDate,
      changefreq: "monthly",
      priority: "0.7"
    },
    {
      en: "/services/medication-management",
      es: "/es/servicios/manejo-medicamentos",
      lastmod: contentDate,
      changefreq: "monthly",
      priority: "0.7"
    },
    // Location pages with bilingual versions (CRITICAL for local SEO)
    {
      en: "/locations/psychiatrist-naples",
      es: "/es/ubicaciones/psiquiatra-naples",
      lastmod: oldContentDate,
      changefreq: "monthly",
      priority: "0.6"
    },
    {
      en: "/locations/psychiatrist-bonita-springs",
      es: "/es/ubicaciones/psiquiatra-bonita-springs",
      lastmod: locationDate,
      changefreq: "monthly",
      priority: "0.6"
    },
    {
      en: "/locations/psychiatrist-marco-island",
      es: "/es/ubicaciones/psiquiatra-marco-island",
      lastmod: locationDate,
      changefreq: "monthly",
      priority: "0.6"
    },
    {
      en: "/locations/psychiatrist-fort-myers",
      es: "/es/ubicaciones/psiquiatra-fort-myers",
      lastmod: locationDate,
      changefreq: "monthly",
      priority: "0.6"
    },
    {
      en: "/locations/psychiatrist-ave-maria",
      es: "/es/ubicaciones/psiquiatra-ave-maria",
      lastmod: locationDate,
      changefreq: "monthly",
      priority: "0.6"
    },
    {
      en: "/locations/psychiatrist-estero",
      es: "/es/ubicaciones/psiquiatra-estero",
      lastmod: locationDate,
      changefreq: "monthly",
      priority: "0.6"
    },
    {
      en: "/locations/psychiatrist-golden-gate",
      es: "/es/ubicaciones/psiquiatra-golden-gate",
      lastmod: locationDate,
      changefreq: "monthly",
      priority: "0.6"
    },
    {
      en: "/locations/psychiatrist-immokalee",
      es: "/es/ubicaciones/psiquiatra-immokalee",
      lastmod: locationDate,
      changefreq: "monthly",
      priority: "0.6"
    },
    {
      en: "/locations/psychiatrist-lely-resort",
      es: "/es/ubicaciones/psiquiatra-lely-resort",
      lastmod: locationDate,
      changefreq: "monthly",
      priority: "0.6"
    },
    {
      en: "/locations/psychiatrist-vanderbilt-beach",
      es: "/es/ubicaciones/psiquiatra-vanderbilt-beach",
      lastmod: locationDate,
      changefreq: "monthly",
      priority: "0.6"
    }
  ];
  const englishOnlyPages = [];
  const legalPages = [
    {
      en: "/privacy-policy",
      es: "/es/politica-privacidad",
      lastmod: legalDate,
      changefreq: "yearly",
      priority: "0.3"
    },
    {
      en: "/terms-of-service",
      es: "/es/terminos-servicio",
      lastmod: legalDate,
      changefreq: "yearly",
      priority: "0.3"
    },
    {
      en: "/hipaa-notice",
      es: "/es/aviso-hipaa",
      lastmod: legalDate,
      changefreq: "yearly",
      priority: "0.3"
    },
    {
      en: "/cookie-policy",
      es: "/es/politica-cookies",
      lastmod: legalDate,
      changefreq: "yearly",
      priority: "0.3"
    }
  ];
  const pages = [];
  const regularPagesXml = pages.map((page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
  </url>`).join("\n");
  const englishOnlyPagesXml = englishOnlyPages.map((page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <xhtml:link 
                rel="alternate"
                hreflang="en"
                href="${baseUrl}${page.url}"
                />
    <lastmod>${page.lastmod}</lastmod>
  </url>`).join("\n");
  const bilingualPagesXml = bilingualPages.map((page) => [
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
  ]).flat().join("\n");
  const legalPagesXml = legalPages.map((page) => [
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
  ]).flat().join("\n");
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${regularPagesXml}
${bilingualPagesXml}
${englishOnlyPagesXml}
${legalPagesXml}
</urlset>`;
  res.set({
    "Content-Type": "application/xml",
    "Cache-Control": "public, max-age=86400"
    // Cache for 24 hours
  });
  res.send(sitemapXml);
};
var generateRobotsTxt = (req, res) => {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
  let host = req.get("host") || "www.healingmindsp.com";
  if (host === "healingmindsp.com") {
    host = "www.healingmindsp.com";
  }
  const baseUrl = `${protocol}://${host}`;
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
    "Content-Type": "text/plain",
    "Cache-Control": "public, max-age=86400"
  });
  res.send(robotsTxt);
};

// server/services/metricool.ts
var MetricoolService = class {
  apiUrl = "https://app.metricool.com/api/v2/inbox/reviews";
  postCommentsUrl = "https://app.metricool.com/api/v2/inbox/post-comments";
  userId = "2603584";
  blogId = "5128724";
  provider = "GMB";
  tiktokProvider = "TIKTOKBUSINESS";
  token = process.env.METRICOOL_TOKEN;
  async fetchReviews() {
    if (!this.token) {
      throw new Error("METRICOOL_TOKEN environment variable is not set");
    }
    const url = `${this.apiUrl}?userId=${this.userId}&blogId=${this.blogId}&provider=${this.provider}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "X-Mc-Auth": this.token
        }
      });
      if (!response.ok) {
        throw new Error(`Metricool API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      let reviews = [];
      if (data.data && Array.isArray(data.data)) {
        reviews = data.data;
        console.log(`\u2705 Metricool API: Fetched ${reviews.length} reviews from data.data`);
      } else if (data.reviews && Array.isArray(data.reviews)) {
        reviews = data.reviews;
        console.log(`\u2705 Metricool API: Fetched ${reviews.length} reviews from data.reviews`);
      } else if (Array.isArray(data)) {
        reviews = data;
        console.log(`\u2705 Metricool API: Fetched ${reviews.length} reviews from root array`);
      } else {
        console.log("\u{1F4CA} Full Metricool API response structure:", JSON.stringify(data, null, 2));
        console.log("\u26A0\uFE0F No reviews array found in response");
      }
      if (reviews.length > 0) {
        console.log("\u{1F4CB} First review structure:", JSON.stringify(reviews[0], null, 2));
      }
      return { reviews };
    } catch (error) {
      console.error("\u274C Error fetching reviews from Metricool:", error);
      throw error;
    }
  }
  transformReviewsToUIFormat(metricoolReviews) {
    if (!metricoolReviews || !Array.isArray(metricoolReviews)) {
      console.log("\u26A0\uFE0F  Metricool reviews is not an array, received:", typeof metricoolReviews);
      return [];
    }
    return metricoolReviews.map((review) => {
      console.log(`\u{1F50D} Processing review ${review.id}:`, {
        hasMessage: !!review.message,
        hasComment: !!review.comment,
        messageLength: review.message?.length || 0,
        commentLength: review.comment?.length || 0,
        messagePreview: review.message?.substring(0, 50) + "..."
      });
      const fullComment = review.message || review.comment || "";
      const truncatedComment = fullComment.length > 120 ? `${fullComment.substring(0, 120)}...` : fullComment;
      const createdDate = new Date(review.creationDate);
      const now = /* @__PURE__ */ new Date();
      const diffTime = Math.abs(now.getTime() - createdDate.getTime());
      const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
      let dateString = "";
      if (diffDays === 1) {
        dateString = "hace 1 d\xEDa";
      } else if (diffDays < 30) {
        dateString = `hace ${diffDays} d\xEDas`;
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        dateString = months === 1 ? "hace 1 mes" : `hace ${months} meses`;
      } else {
        const years = Math.floor(diffDays / 365);
        dateString = years === 1 ? "hace 1 a\xF1o" : `hace ${years} a\xF1os`;
      }
      const customerParticipant = review.participants?.find(
        (p) => p.name && !p.id.includes("accounts/")
      );
      const customerName = customerParticipant?.name || review.customer?.name || "Anonymous";
      const customerImage = customerParticipant?.imageProfileUrl || review.customer?.imageProfileUrl;
      const result = {
        id: review.id,
        name: customerName,
        image: customerImage,
        date: dateString,
        rating: review.stars ?? 5,
        comment: truncatedComment,
        fullComment,
        createdAt: createdDate
      };
      console.log(`\u{1F4DD} Final transformed review ${review.id}:`, {
        name: result.name,
        commentLength: result.comment.length,
        fullCommentLength: result.fullComment.length,
        rating: result.rating
      });
      return result;
    });
  }
  calculateStats(reviews) {
    if (!reviews || !Array.isArray(reviews)) {
      console.log("\u26A0\uFE0F  Metricool reviews is not an array for stats calculation");
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }
    const totalReviews = reviews.length;
    if (totalReviews === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }
    const ratingCounts = reviews.reduce((acc, review) => {
      acc[review.stars] = (acc[review.stars] || 0) + 1;
      return acc;
    }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
    const totalStars = reviews.reduce((sum, review) => sum + (review.stars ?? 0), 0);
    const averageRating = Math.round(totalStars / totalReviews * 10) / 10;
    return {
      averageRating,
      totalReviews,
      ratingDistribution: ratingCounts
    };
  }
  async fetchTikTokPosts() {
    if (!this.token) {
      throw new Error("METRICOOL_TOKEN environment variable is not set");
    }
    const url = `${this.postCommentsUrl}?userId=${this.userId}&blogId=${this.blogId}&provider=${this.tiktokProvider}`;
    try {
      console.log(`\u{1F3B5} Fetching TikTok posts from: ${url}`);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "X-Mc-Auth": this.token
        }
      });
      if (!response.ok) {
        throw new Error(`Metricool TikTok API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log(`\u{1F3B5} TikTok API: Successfully fetched ${data?.data?.length || 0} posts`);
      return data;
    } catch (error) {
      console.error("\u274C Error fetching TikTok posts from Metricool:", error);
      throw error;
    }
  }
};

// server/cache/reviews-cache.ts
var ReviewsCache = class {
  cache = /* @__PURE__ */ new Map();
  cacheDuration = 30 * 60 * 1e3;
  // 30 minutes in milliseconds
  set(key, data) {
    const now = Date.now();
    const entry = {
      data,
      timestamp: now,
      expiresAt: now + this.cacheDuration
    };
    this.cache.set(key, entry);
    console.log(`\u{1F4DD} Reviews cache: Stored data for key "${key}"`);
  }
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) {
      console.log(`\u274C Reviews cache: Cache miss for key "${key}"`);
      return null;
    }
    const now = Date.now();
    if (now > entry.expiresAt) {
      console.log(`\u23F0 Reviews cache: Cache expired for key "${key}"`);
      this.cache.delete(key);
      return null;
    }
    console.log(`\u2705 Reviews cache: Cache hit for key "${key}"`);
    return entry.data;
  }
  clear() {
    this.cache.clear();
    console.log(`\u{1F5D1}\uFE0F  Reviews cache: Cache cleared`);
  }
  has(key) {
    const entry = this.cache.get(key);
    if (!entry) return false;
    const now = Date.now();
    if (now > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }
  size() {
    return this.cache.size;
  }
  getCacheStats() {
    const keys = Array.from(this.cache.keys());
    const entries = Array.from(this.cache.values());
    const oldestEntry = entries.length > 0 ? Math.min(...entries.map((e) => e.timestamp)) : void 0;
    return {
      size: this.cache.size,
      keys,
      oldestEntry
    };
  }
};
var reviewsCache = new ReviewsCache();

// server/data/static-reviews.ts
var staticReviews = [
  {
    id: "review-001",
    name: "Mar\xEDa Gonz\xE1lez",
    image: void 0,
    date: "hace 2 d\xEDas",
    rating: 5,
    comment: "La Dra. Reve es excepcional. Su enfoque compasivo y conocimiento profundo me ayudaron enormemente con mi ansiedad.",
    fullComment: "La Dra. Reve es excepcional. Su enfoque compasivo y conocimiento profundo me ayudaron enormemente con mi ansiedad. Siempre se toma el tiempo para escuchar y explicar todo claramente.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3)
  },
  {
    id: "review-002",
    name: "Robert Smith",
    image: void 0,
    date: "hace 5 d\xEDas",
    rating: 5,
    comment: "Dr. Reve has been instrumental in helping me manage my depression. Her expertise and caring approach...",
    fullComment: "Dr. Reve has been instrumental in helping me manage my depression. Her expertise and caring approach make every session productive and healing. I couldn't recommend her more highly.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1e3)
  },
  {
    id: "review-003",
    name: "Jennifer Davis",
    image: void 0,
    date: "hace 1 semana",
    rating: 5,
    comment: "Outstanding psychiatrist! Dr. Reve helped me understand my ADHD and develop effective strategies...",
    fullComment: "Outstanding psychiatrist! Dr. Reve helped me understand my ADHD and develop effective strategies for managing symptoms. Her bilingual abilities were also very helpful for my family.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3)
  },
  {
    id: "review-004",
    name: "Carlos Mendoza",
    image: void 0,
    date: "hace 2 semanas",
    rating: 5,
    comment: "Excelente profesional. Me ayud\xF3 mucho con el tratamiento de mi trastorno bipolar. Muy recomendable.",
    fullComment: "Excelente profesional. Me ayud\xF3 mucho con el tratamiento de mi trastorno bipolar. Su experiencia y dedicaci\xF3n son evidentes en cada consulta. Muy recomendable.",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1e3)
  },
  {
    id: "review-005",
    name: "Sarah Johnson",
    image: void 0,
    date: "hace 3 semanas",
    rating: 5,
    comment: "Dr. Reve provided excellent care during my PTSD treatment. Professional, empathetic, and effective...",
    fullComment: "Dr. Reve provided excellent care during my PTSD treatment. Professional, empathetic, and effective. She created a safe environment where I could heal and progress.",
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1e3)
  },
  {
    id: "review-006",
    name: "Ana Herrera",
    image: void 0,
    date: "hace 1 mes",
    rating: 5,
    comment: "La atenci\xF3n de la Dra. Reve es excepcional. Su comprensi\xF3n del tratamiento de la ansiedad es impresionante...",
    fullComment: "La atenci\xF3n de la Dra. Reve es excepcional. Su comprensi\xF3n del tratamiento de la ansiedad es impresionante y me ha ayudado enormemente. Habla perfectamente espa\xF1ol, lo cual fue muy importante para m\xED.",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3)
  }
];
var staticStats = {
  averageRating: 5,
  totalReviews: staticReviews.length,
  ratingDistribution: {
    5: staticReviews.length,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  }
};

// server/services/email.ts
import { Resend } from "resend";
var resend = new Resend(process.env.RESEND_API_KEY);
var ResendEmailService = class {
  fromEmail = "noreply@healingmindsp.com";
  practiceEmail = "info@healingmindsp.com";
  async sendContactNotification(contactData) {
    console.log("\u{1F680} ENTERED sendContactNotification method");
    const subject = `Nueva consulta desde el sitio web - ${contactData.firstName} ${contactData.lastName}`;
    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: #ffffff;">
        
        <div style="text-align: center; margin-bottom: 25px; border-bottom: 3px solid #16a34a; padding-bottom: 15px;">
          <h1 style="color: #16a34a; margin: 0; font-size: 24px; font-weight: 600;">Nuevo Lead - Healing Minds</h1>
        </div>

        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #16a34a; margin: 0 0 15px 0; font-size: 18px;">Informaci\xF3n del Contacto</h2>
          <p style="margin: 8px 0; color: #374151; font-size: 15px;"><strong>Nombre:</strong> ${contactData.firstName} ${contactData.lastName}</p>
          <p style="margin: 8px 0; color: #374151; font-size: 15px;"><strong>Email:</strong> ${contactData.email}</p>
          <p style="margin: 8px 0; color: #374151; font-size: 15px;"><strong>Tel\xE9fono:</strong> ${contactData.phone || "No proporcionado"}</p>
          <p style="margin: 8px 0; color: #374151; font-size: 15px;"><strong>Idioma:</strong> ${contactData.preferredLanguage === "spanish" ? "Espa\xF1ol" : "Ingl\xE9s"}</p>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
          <h3 style="color: #374151; margin: 0 0 10px 0; font-size: 16px;">Mensaje:</h3>
          <p style="margin: 0; color: #4b5563; font-size: 15px; line-height: 1.5;">
            "${contactData.message}"
          </p>
        </div>

        <div style="text-align: center; margin-top: 25px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 13px; margin: 0;">
            Enviado desde healingmindsp.com \u2022 ${(/* @__PURE__ */ new Date()).toLocaleString("es-ES", { timeZone: "America/New_York" })}
          </p>
        </div>
      </div>
    `;
    try {
      console.log("\u{1F4E7} Sending notification email to:", this.practiceEmail, "from:", this.fromEmail);
      const response = await resend.emails.send({
        from: this.fromEmail,
        to: this.practiceEmail,
        subject,
        html: htmlContent
      });
      console.log("\u2705 Resend notification response:", response);
    } catch (error) {
      console.error("\u274C Error sending contact notification email:", error);
      console.error("\u274C Error details:", JSON.stringify(error, null, 2));
      throw new Error("Failed to send contact notification email");
    }
  }
  async sendConfirmationEmail(contactData) {
    console.log("\u{1F680} ENTERED sendConfirmationEmail method");
    const isSpanish = contactData.preferredLanguage === "spanish";
    const subject = isSpanish ? "Confirmaci\xF3n de consulta - Healing Minds Psychiatry" : "Contact Confirmation - Healing Minds Psychiatry";
    const htmlContent = isSpanish ? this.getSpanishConfirmationTemplate(contactData) : this.getEnglishConfirmationTemplate(contactData);
    try {
      console.log("\u{1F4E7} Sending confirmation email to:", contactData.email, "from:", this.fromEmail);
      const response = await resend.emails.send({
        from: this.fromEmail,
        to: contactData.email,
        subject,
        html: htmlContent
      });
      console.log("\u2705 Resend confirmation response:", response);
    } catch (error) {
      console.error("\u274C Error sending confirmation email:", error);
      console.error("\u274C Error details:", JSON.stringify(error, null, 2));
      throw new Error("Failed to send confirmation email");
    }
  }
  getSpanishConfirmationTemplate(contactData) {
    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: #ffffff;">
        
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #16a34a; padding-bottom: 20px;">
          <h1 style="color: #16a34a; margin: 0; font-size: 28px; font-weight: 600;">Healing Minds Psychiatry</h1>
          <p style="color: #6b7280; margin: 8px 0; font-size: 16px;">Dra. Melva Reve \u2022 Naples, FL</p>
        </div>

        <div style="margin-bottom: 25px;">
          <h2 style="color: #16a34a; margin: 0 0 15px 0; font-size: 22px;">\xA1Gracias por contactarnos!</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.5; margin: 0;">
            Estimado/a <strong>${contactData.firstName}</strong>, hemos recibido su consulta y nos pondremos en contacto con usted pronto.
          </p>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #16a34a;">
          <p style="margin: 0; color: #4b5563; font-style: italic; font-size: 15px;">
            "${contactData.message}"
          </p>
        </div>

        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #16a34a; margin: 0 0 15px 0; font-size: 18px;">Informaci\xF3n de Contacto</h3>
          <p style="margin: 5px 0; color: #374151;"><strong>Tel\xE9fono:</strong> (239) 276-3030</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Email:</strong> info@healingmindsp.com</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Direcci\xF3n:</strong> Naples, FL</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Horarios:</strong> Lunes - Viernes, 9:00 AM - 5:00 PM</p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            Atenci\xF3n integral en salud mental \u2022 Ansiedad \u2022 Depresi\xF3n \u2022 TDAH \u2022 TEPT
          </p>
        </div>
      </div>
    `;
  }
  getEnglishConfirmationTemplate(contactData) {
    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: #ffffff;">
        
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #16a34a; padding-bottom: 20px;">
          <h1 style="color: #16a34a; margin: 0; font-size: 28px; font-weight: 600;">Healing Minds Psychiatry</h1>
          <p style="color: #6b7280; margin: 8px 0; font-size: 16px;">Dr. Melva Reve \u2022 Naples, FL</p>
        </div>

        <div style="margin-bottom: 25px;">
          <h2 style="color: #16a34a; margin: 0 0 15px 0; font-size: 22px;">Thank you for contacting us!</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.5; margin: 0;">
            Dear <strong>${contactData.firstName}</strong>, we have received your inquiry and will get back to you soon.
          </p>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #16a34a;">
          <p style="margin: 0; color: #4b5563; font-style: italic; font-size: 15px;">
            "${contactData.message}"
          </p>
        </div>

        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #16a34a; margin: 0 0 15px 0; font-size: 18px;">Contact Information</h3>
          <p style="margin: 5px 0; color: #374151;"><strong>Phone:</strong> (239) 276-3030</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Email:</strong> info@healingmindsp.com</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Address:</strong> Naples, FL</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM</p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            Comprehensive mental health care \u2022 Anxiety \u2022 Depression \u2022 ADHD \u2022 PTSD
          </p>
        </div>
      </div>
    `;
  }
};
var emailService = new ResendEmailService();

// server/utils/html-injection.ts
function injectMetaTags(html, req) {
  const url = req.originalUrl;
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
  let host = req.get("host") || "www.healingmindsp.com";
  if (host === "healingmindsp.com" || host?.includes("replit.app")) {
    host = "www.healingmindsp.com";
  }
  const baseUrl = `${protocol}://${host}`;
  const pageMetaData = getPageMetaData(url, baseUrl);
  if (!pageMetaData) {
    return html;
  }
  let modifiedHtml = html;
  if (pageMetaData.canonical) {
    const canonicalTag = `    <link rel="canonical" href="${pageMetaData.canonical}" />`;
    modifiedHtml = modifiedHtml.replace(
      "</head>",
      `${canonicalTag}
  </head>`
    );
  }
  if (pageMetaData.schema) {
    const schemaTag = `    <script type="application/ld+json">${JSON.stringify(pageMetaData.schema, null, 2)}</script>`;
    modifiedHtml = modifiedHtml.replace(
      "</head>",
      `${schemaTag}
  </head>`
    );
  }
  if (pageMetaData.metaTags && pageMetaData.metaTags.length > 0) {
    const additionalTags = pageMetaData.metaTags.map((tag) => {
      if (tag.rel && tag.href) {
        if (tag.hreflang) {
          return `    <link rel="${tag.rel}" hreflang="${tag.hreflang}" href="${tag.href}" />`;
        }
        return `    <link rel="${tag.rel}" href="${tag.href}" />`;
      } else if (tag.name && tag.content) {
        return `    <meta name="${tag.name}" content="${tag.content}" />`;
      } else if (tag.property && tag.content) {
        return `    <meta property="${tag.property}" content="${tag.content}" />`;
      }
      return "";
    }).filter((tag) => tag !== "").join("\n");
    if (additionalTags) {
      modifiedHtml = modifiedHtml.replace(
        "</head>",
        `${additionalTags}
  </head>`
      );
    }
  }
  return modifiedHtml;
}
function getPageMetaData(url, baseUrl) {
  const normalizedUrl = url.replace(/\/$/, "") || "/";
  switch (normalizedUrl) {
    // Homepage
    case "/":
      return {
        canonical: `${baseUrl}/`,
        schema: getMedicalBusinessSchema(baseUrl),
        metaTags: [
          {
            name: "description",
            content: "Dr. Melva Reve - Board certified psychiatrist in Naples, FL. Expert treatment for anxiety, depression, ADHD, PTSD. Bilingual care in English & Spanish. Call (239) 423-0272."
          },
          {
            property: "og:title",
            content: "Dr. Melva Reve - Psychiatrist Naples FL | Healing Minds Psychiatry"
          },
          {
            property: "og:description",
            content: "Board certified psychiatrist in Naples, FL. Expert treatment for anxiety, depression, ADHD, PTSD. Bilingual care available."
          },
          {
            property: "og:url",
            content: `${baseUrl}/`
          },
          // HREFLANG CRITICAL: Homepage bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/`
          },
          {
            rel: "alternate",
            hreflang: "x-default",
            href: `${baseUrl}/`
          }
        ]
      };
    // About page
    case "/about":
      return {
        canonical: `${baseUrl}/about`,
        metaTags: [
          {
            name: "description",
            content: "Meet Dr. Melva Reve, board-certified psychiatrist in Naples, FL. University of Miami trained, fluent in English & Spanish. Expert in anxiety, depression, ADHD treatment."
          },
          {
            property: "og:title",
            content: "About Dr. Melva Reve - Psychiatrist Naples FL | Healing Minds"
          },
          {
            property: "og:url",
            content: `${baseUrl}/about`
          },
          // HREFLANG: About bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/about`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/acerca-de`
          }
        ]
      };
    // Contact page
    case "/contact":
      return {
        canonical: `${baseUrl}/contact`,
        metaTags: [
          {
            name: "description",
            content: "Contact Healing Minds Psychiatry in Naples, FL. Schedule appointment with Dr. Melva Reve. Phone (239) 423-0272. 4760 Tamiami Trl N # 25, Naples FL 34103."
          },
          {
            property: "og:title",
            content: "Contact Dr. Melva Reve - Naples FL Psychiatrist | Healing Minds"
          },
          {
            property: "og:url",
            content: `${baseUrl}/contact`
          },
          // HREFLANG: Contact bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/contact`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/contacto`
          }
        ]
      };
    // Services main page
    case "/services":
      return {
        canonical: `${baseUrl}/services`,
        metaTags: [
          {
            name: "description",
            content: "Comprehensive psychiatric services in Naples, FL. Dr. Melva Reve treats anxiety, depression, ADHD, PTSD, bipolar disorder with expert medication management."
          },
          {
            property: "og:title",
            content: "Psychiatric Services Naples FL - Dr. Melva Reve | Healing Minds"
          },
          {
            property: "og:url",
            content: `${baseUrl}/services`
          },
          // HREFLANG: Services bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/services`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/servicios`
          }
        ]
      };
    // Service pages
    case "/services/anxiety-treatment":
      return {
        canonical: `${baseUrl}/services/anxiety-treatment`,
        metaTags: [
          {
            name: "description",
            content: "Expert anxiety treatment in Naples, FL. Dr. Melva Reve provides comprehensive anxiety disorder therapy and medication management. Call (239) 423-0272."
          },
          {
            property: "og:title",
            content: "Anxiety Treatment Naples FL - Dr. Melva Reve | Healing Minds"
          },
          {
            property: "og:url",
            content: `${baseUrl}/services/anxiety-treatment`
          },
          // HREFLANG: Anxiety Treatment bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/services/anxiety-treatment`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/servicios/tratamiento-ansiedad`
          }
        ]
      };
    case "/services/depression-treatment":
      return {
        canonical: `${baseUrl}/services/depression-treatment`,
        metaTags: [
          {
            name: "description",
            content: "Professional depression treatment in Naples, FL. Dr. Melva Reve offers expert depression therapy and medication management. Schedule consultation today."
          },
          {
            property: "og:title",
            content: "Depression Treatment Naples FL - Dr. Melva Reve | Healing Minds"
          },
          {
            property: "og:url",
            content: `${baseUrl}/services/depression-treatment`
          },
          // HREFLANG: Depression Treatment bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/services/depression-treatment`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/servicios/tratamiento-depresion`
          }
        ]
      };
    case "/services/adhd-treatment":
      return {
        canonical: `${baseUrl}/services/adhd-treatment`,
        metaTags: [
          {
            name: "description",
            content: "ADHD treatment for adults in Naples, FL. Dr. Melva Reve provides comprehensive ADHD evaluation, therapy and medication management. Call (239) 423-0272."
          },
          {
            property: "og:title",
            content: "ADHD Treatment Adults Naples FL - Dr. Melva Reve | Healing Minds"
          },
          {
            property: "og:url",
            content: `${baseUrl}/services/adhd-treatment`
          },
          // HREFLANG: ADHD Treatment bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/services/adhd-treatment`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/servicios/tratamiento-adhd`
          }
        ]
      };
    case "/services/ptsd-treatment":
      return {
        canonical: `${baseUrl}/services/ptsd-treatment`,
        metaTags: [
          {
            name: "description",
            content: "PTSD treatment in Naples, FL. Dr. Melva Reve provides specialized trauma therapy and PTSD treatment with evidence-based approaches."
          },
          {
            property: "og:title",
            content: "PTSD Treatment Naples FL - Dr. Melva Reve | Healing Minds"
          },
          {
            property: "og:url",
            content: `${baseUrl}/services/ptsd-treatment`
          },
          // HREFLANG: PTSD Treatment bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/services/ptsd-treatment`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/servicios/tratamiento-tept`
          }
        ]
      };
    case "/services/bipolar-treatment":
      return {
        canonical: `${baseUrl}/services/bipolar-treatment`,
        metaTags: [
          {
            name: "description",
            content: "Bipolar disorder treatment in Naples, FL. Dr. Melva Reve offers expert bipolar therapy and mood stabilization with comprehensive care."
          },
          {
            property: "og:title",
            content: "Bipolar Treatment Naples FL - Dr. Melva Reve | Healing Minds"
          },
          {
            property: "og:url",
            content: `${baseUrl}/services/bipolar-treatment`
          },
          // HREFLANG: Bipolar Treatment bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/services/bipolar-treatment`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/servicios/tratamiento-bipolar`
          }
        ]
      };
    case "/services/medication-management":
      return {
        canonical: `${baseUrl}/services/medication-management`,
        metaTags: [
          {
            name: "description",
            content: "Psychiatric medication management in Naples, FL. Dr. Melva Reve provides expert medication monitoring and optimization for mental health conditions."
          },
          {
            property: "og:title",
            content: "Medication Management Naples FL - Dr. Melva Reve | Healing Minds"
          },
          {
            property: "og:url",
            content: `${baseUrl}/services/medication-management`
          },
          // HREFLANG: Medication Management bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/services/medication-management`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/servicios/manejo-medicamentos`
          }
        ]
      };
    // For Patients page
    case "/for-patients":
      return {
        canonical: `${baseUrl}/for-patients`,
        metaTags: [
          {
            name: "description",
            content: "Patient resources and information for Healing Minds Psychiatry. Forms, insurance, appointment scheduling and what to expect during your visit with Dr. Melva Reve."
          },
          {
            property: "og:title",
            content: "For Patients - Healing Minds Psychiatry | Dr. Melva Reve Naples FL"
          },
          {
            property: "og:url",
            content: `${baseUrl}/for-patients`
          },
          // HREFLANG: For Patients bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/for-patients`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/para-pacientes`
          }
        ]
      };
    case "/locations/psychiatrist-naples":
      return {
        canonical: `${baseUrl}/locations/psychiatrist-naples`,
        schema: getMedicalBusinessSchema(baseUrl),
        metaTags: [
          {
            name: "description",
            content: "Visit Dr. Melva Reve in Naples, FL at 4760 Tamiami Trl N # 25. Expert psychiatric care for anxiety, depression, ADHD, PTSD. Call (239) 423-0272 to schedule."
          },
          {
            name: "keywords",
            content: "psychiatrist Naples FL location, 4760 Tamiami Trail Naples # 25, psychiatric office Naples, Dr Melva Reve address, mental health Naples FL"
          },
          {
            property: "og:title",
            content: "Psychiatrist Naples FL - Dr. Melva Reve Location | Healing Minds"
          },
          {
            property: "og:description",
            content: "Visit Dr. Melva Reve in Naples, FL at 4760 Tamiami Trl N # 25. Expert psychiatric care for anxiety, depression, ADHD, PTSD."
          },
          {
            property: "og:url",
            content: `${baseUrl}/locations/psychiatrist-naples`
          },
          // HREFLANG: Naples bilingual versions (FIXED - Spanish version now exists)
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/locations/psychiatrist-naples`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/ubicaciones/psiquiatra-naples`
          }
        ]
      };
    // Satellite Location Pages - Hub & Spoke Pattern
    case "/locations/psychiatrist-bonita-springs":
      return {
        canonical: `${baseUrl}/locations/psychiatrist-bonita-springs`,
        schema: getServiceSchema(baseUrl, "Bonita Springs"),
        metaTags: [
          {
            name: "description",
            content: "Looking for expert psychiatric care in Bonita Springs? Dr. Melva Reve serves Bonita Springs FL area with anxiety, depression, ADHD, PTSD treatment. Call (239) 423-0272."
          },
          {
            property: "og:title",
            content: "Psychiatrist Near Bonita Springs FL - Dr. Melva Reve | Healing Minds"
          },
          {
            property: "og:description",
            content: "Looking for expert psychiatric care in Bonita Springs? Dr. Melva Reve serves Bonita Springs FL area with anxiety, depression, ADHD, PTSD treatment."
          },
          {
            property: "og:url",
            content: `${baseUrl}/locations/psychiatrist-bonita-springs`
          },
          // HREFLANG: Bonita Springs bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/locations/psychiatrist-bonita-springs`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/ubicaciones/psiquiatra-bonita-springs`
          }
        ]
      };
    case "/locations/psychiatrist-marco-island":
      return {
        canonical: `${baseUrl}/locations/psychiatrist-marco-island`,
        schema: getServiceSchema(baseUrl, "Marco Island"),
        metaTags: [
          {
            name: "description",
            content: "Looking for expert psychiatric care in Marco Island? Dr. Melva Reve serves Marco Island FL area with anxiety, depression, ADHD, PTSD treatment. Call (239) 423-0272."
          },
          {
            property: "og:title",
            content: "Psychiatrist Near Marco Island FL - Dr. Melva Reve | Healing Minds"
          },
          {
            property: "og:description",
            content: "Looking for expert psychiatric care in Marco Island? Dr. Melva Reve serves Marco Island FL area with anxiety, depression, ADHD, PTSD treatment."
          },
          {
            property: "og:url",
            content: `${baseUrl}/locations/psychiatrist-marco-island`
          },
          // HREFLANG: Marco Island bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/locations/psychiatrist-marco-island`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/ubicaciones/psiquiatra-marco-island`
          }
        ]
      };
    case "/locations/psychiatrist-fort-myers":
      return {
        canonical: `${baseUrl}/locations/psychiatrist-fort-myers`,
        schema: getServiceSchema(baseUrl, "Fort Myers"),
        metaTags: [
          {
            name: "description",
            content: "Looking for expert psychiatric care in Fort Myers? Dr. Melva Reve serves Fort Myers FL area with anxiety, depression, ADHD, PTSD treatment. Call (239) 423-0272."
          },
          {
            property: "og:title",
            content: "Psychiatrist Near Fort Myers FL - Dr. Melva Reve | Healing Minds"
          },
          {
            property: "og:description",
            content: "Looking for expert psychiatric care in Fort Myers? Dr. Melva Reve serves Fort Myers FL area with anxiety, depression, ADHD, PTSD treatment."
          },
          {
            property: "og:url",
            content: `${baseUrl}/locations/psychiatrist-fort-myers`
          },
          // HREFLANG: Fort Myers bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/locations/psychiatrist-fort-myers`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/ubicaciones/psiquiatra-fort-myers`
          }
        ]
      };
    case "/locations/psychiatrist-ave-maria":
      return {
        canonical: `${baseUrl}/locations/psychiatrist-ave-maria`,
        schema: getServiceSchema(baseUrl, "Ave Maria"),
        metaTags: [
          {
            name: "description",
            content: "Looking for expert psychiatric care in Ave Maria? Dr. Melva Reve serves Ave Maria FL area with anxiety, depression, ADHD, PTSD treatment. Call (239) 423-0272."
          },
          {
            property: "og:title",
            content: "Psychiatrist Near Ave Maria FL - Dr. Melva Reve | Healing Minds"
          },
          {
            property: "og:description",
            content: "Looking for expert psychiatric care in Ave Maria? Dr. Melva Reve serves Ave Maria FL area with anxiety, depression, ADHD, PTSD treatment."
          },
          {
            property: "og:url",
            content: `${baseUrl}/locations/psychiatrist-ave-maria`
          },
          // HREFLANG: Ave Maria bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/locations/psychiatrist-ave-maria`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/ubicaciones/psiquiatra-ave-maria`
          }
        ]
      };
    case "/locations/psychiatrist-estero":
      return {
        canonical: `${baseUrl}/locations/psychiatrist-estero`,
        schema: getServiceSchema(baseUrl, "Estero"),
        metaTags: [
          {
            name: "description",
            content: "Looking for expert psychiatric care in Estero? Dr. Melva Reve serves Estero FL area with anxiety, depression, ADHD, PTSD treatment. Call (239) 423-0272."
          },
          {
            property: "og:title",
            content: "Psychiatrist Near Estero FL - Dr. Melva Reve | Healing Minds"
          },
          {
            property: "og:description",
            content: "Looking for expert psychiatric care in Estero? Dr. Melva Reve serves Estero FL area with anxiety, depression, ADHD, PTSD treatment."
          },
          {
            property: "og:url",
            content: `${baseUrl}/locations/psychiatrist-estero`
          },
          // HREFLANG: Estero bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/locations/psychiatrist-estero`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/ubicaciones/psiquiatra-estero`
          }
        ]
      };
    case "/locations/psychiatrist-golden-gate":
      return {
        canonical: `${baseUrl}/locations/psychiatrist-golden-gate`,
        schema: getServiceSchema(baseUrl, "Golden Gate"),
        metaTags: [
          {
            name: "description",
            content: "Looking for expert psychiatric care in Golden Gate? Dr. Melva Reve serves Golden Gate FL area with anxiety, depression, ADHD, PTSD treatment. Call (239) 423-0272."
          },
          {
            property: "og:title",
            content: "Psychiatrist Near Golden Gate FL - Dr. Melva Reve | Healing Minds"
          },
          {
            property: "og:description",
            content: "Looking for expert psychiatric care in Golden Gate? Dr. Melva Reve serves Golden Gate FL area with anxiety, depression, ADHD, PTSD treatment."
          },
          {
            property: "og:url",
            content: `${baseUrl}/locations/psychiatrist-golden-gate`
          },
          // HREFLANG: Golden Gate bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/locations/psychiatrist-golden-gate`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/ubicaciones/psiquiatra-golden-gate`
          }
        ]
      };
    case "/locations/psychiatrist-immokalee":
      return {
        canonical: `${baseUrl}/locations/psychiatrist-immokalee`,
        schema: getServiceSchema(baseUrl, "Immokalee"),
        metaTags: [
          {
            name: "description",
            content: "Looking for expert psychiatric care in Immokalee? Dr. Melva Reve serves Immokalee FL area with anxiety, depression, ADHD, PTSD treatment. Call (239) 423-0272."
          },
          {
            property: "og:title",
            content: "Psychiatrist Near Immokalee FL - Dr. Melva Reve | Healing Minds"
          },
          {
            property: "og:description",
            content: "Looking for expert psychiatric care in Immokalee? Dr. Melva Reve serves Immokalee FL area with anxiety, depression, ADHD, PTSD treatment."
          },
          {
            property: "og:url",
            content: `${baseUrl}/locations/psychiatrist-immokalee`
          },
          // HREFLANG: Immokalee bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/locations/psychiatrist-immokalee`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/ubicaciones/psiquiatra-immokalee`
          }
        ]
      };
    case "/locations/psychiatrist-lely-resort":
      return {
        canonical: `${baseUrl}/locations/psychiatrist-lely-resort`,
        schema: getServiceSchema(baseUrl, "Lely Resort"),
        metaTags: [
          {
            name: "description",
            content: "Looking for expert psychiatric care in Lely Resort? Dr. Melva Reve serves Lely Resort FL area with anxiety, depression, ADHD, PTSD treatment. Call (239) 423-0272."
          },
          {
            property: "og:title",
            content: "Psychiatrist Near Lely Resort FL - Dr. Melva Reve | Healing Minds"
          },
          {
            property: "og:description",
            content: "Looking for expert psychiatric care in Lely Resort? Dr. Melva Reve serves Lely Resort FL area with anxiety, depression, ADHD, PTSD treatment."
          },
          {
            property: "og:url",
            content: `${baseUrl}/locations/psychiatrist-lely-resort`
          },
          // HREFLANG: Lely Resort bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/locations/psychiatrist-lely-resort`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/ubicaciones/psiquiatra-lely-resort`
          }
        ]
      };
    case "/locations/psychiatrist-vanderbilt-beach":
      return {
        canonical: `${baseUrl}/locations/psychiatrist-vanderbilt-beach`,
        schema: getServiceSchema(baseUrl, "Vanderbilt Beach"),
        metaTags: [
          {
            name: "description",
            content: "Looking for expert psychiatric care in Vanderbilt Beach? Dr. Melva Reve serves Vanderbilt Beach FL area with anxiety, depression, ADHD, PTSD treatment. Call (239) 423-0272."
          },
          {
            property: "og:title",
            content: "Psychiatrist Near Vanderbilt Beach FL - Dr. Melva Reve | Healing Minds"
          },
          {
            property: "og:description",
            content: "Looking for expert psychiatric care in Vanderbilt Beach? Dr. Melva Reve serves Vanderbilt Beach FL area with anxiety, depression, ADHD, PTSD treatment."
          },
          {
            property: "og:url",
            content: `${baseUrl}/locations/psychiatrist-vanderbilt-beach`
          },
          // HREFLANG: Vanderbilt Beach bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/locations/psychiatrist-vanderbilt-beach`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/ubicaciones/psiquiatra-vanderbilt-beach`
          }
        ]
      };
    // Legal pages
    case "/privacy-policy":
      return {
        canonical: `${baseUrl}/privacy-policy`,
        metaTags: [
          {
            name: "description",
            content: "Privacy Policy for Healing Minds Psychiatry. Learn how we protect your personal health information and comply with HIPAA regulations."
          },
          {
            property: "og:title",
            content: "Privacy Policy - Healing Minds Psychiatry | Dr. Melva Reve"
          },
          {
            property: "og:url",
            content: `${baseUrl}/privacy-policy`
          }
        ]
      };
    case "/terms-of-service":
      return {
        canonical: `${baseUrl}/terms-of-service`,
        metaTags: [
          {
            name: "description",
            content: "Terms of Service for Healing Minds Psychiatry. Understanding the terms and conditions for psychiatric care with Dr. Melva Reve."
          },
          {
            property: "og:title",
            content: "Terms of Service - Healing Minds Psychiatry | Dr. Melva Reve"
          },
          {
            property: "og:url",
            content: `${baseUrl}/terms-of-service`
          }
        ]
      };
    case "/hipaa-notice":
      return {
        canonical: `${baseUrl}/hipaa-notice`,
        metaTags: [
          {
            name: "description",
            content: "HIPAA Notice of Privacy Practices for Healing Minds Psychiatry. Your rights regarding protected health information and privacy."
          },
          {
            property: "og:title",
            content: "HIPAA Notice - Healing Minds Psychiatry | Dr. Melva Reve"
          },
          {
            property: "og:url",
            content: `${baseUrl}/hipaa-notice`
          }
        ]
      };
    case "/cookie-policy":
      return {
        canonical: `${baseUrl}/cookie-policy`,
        metaTags: [
          {
            name: "description",
            content: "Cookie Policy for Healing Minds Psychiatry website. Learn about cookies usage, analytics, and your privacy choices."
          },
          {
            property: "og:title",
            content: "Cookie Policy - Healing Minds Psychiatry | Dr. Melva Reve"
          },
          {
            property: "og:url",
            content: `${baseUrl}/cookie-policy`
          }
        ]
      };
    // Spanish pages
    case "/es/servicios":
      return {
        canonical: `${baseUrl}/es/servicios`,
        metaTags: [
          {
            name: "description",
            content: "Servicios psiqui\xE1tricos completos en Naples, FL. La Dra. Melva Reve trata ansiedad, depresi\xF3n, TDAH, TEPT, trastorno bipolar con manejo experto de medicamentos."
          },
          {
            property: "og:title",
            content: "Servicios Psiqui\xE1tricos Naples FL - Dra. Melva Reve | Healing Minds"
          },
          {
            property: "og:url",
            content: `${baseUrl}/es/servicios`
          }
        ]
      };
    // Spanish service pages
    case "/es/servicios/tratamiento-ansiedad":
      return {
        canonical: `${baseUrl}/es/servicios/tratamiento-ansiedad`,
        metaTags: [
          {
            name: "description",
            content: "Tratamiento experto de ansiedad en Naples, FL. La Dra. Melva Reve proporciona terapia integral de trastornos de ansiedad y manejo de medicamentos."
          },
          {
            property: "og:title",
            content: "Tratamiento Ansiedad Naples FL - Dra. Melva Reve | Healing Minds"
          },
          {
            property: "og:url",
            content: `${baseUrl}/es/servicios/tratamiento-ansiedad`
          }
        ]
      };
    case "/es/servicios/tratamiento-depresion":
      return {
        canonical: `${baseUrl}/es/servicios/tratamiento-depresion`,
        metaTags: [
          {
            name: "description",
            content: "Tratamiento profesional de depresi\xF3n en Naples, FL. La Dra. Melva Reve ofrece terapia experta de depresi\xF3n y manejo de medicamentos."
          },
          {
            property: "og:title",
            content: "Tratamiento Depresi\xF3n Naples FL - Dra. Melva Reve | Healing Minds"
          },
          {
            property: "og:url",
            content: `${baseUrl}/es/servicios/tratamiento-depresion`
          }
        ]
      };
    case "/es/servicios/tratamiento-tept":
      return {
        canonical: `${baseUrl}/es/servicios/tratamiento-tept`,
        metaTags: [
          {
            name: "description",
            content: "Tratamiento de TEPT en Naples, FL. La Dra. Melva Reve proporciona terapia especializada de trauma y tratamiento de TEPT con enfoques basados en evidencia."
          },
          {
            property: "og:title",
            content: "Tratamiento TEPT Naples FL - Dra. Melva Reve | Healing Minds"
          },
          {
            property: "og:url",
            content: `${baseUrl}/es/servicios/tratamiento-tept`
          }
        ]
      };
    case "/es/servicios/tratamiento-bipolar":
      return {
        canonical: `${baseUrl}/es/servicios/tratamiento-bipolar`,
        metaTags: [
          {
            name: "description",
            content: "Tratamiento de trastorno bipolar en Naples, FL. La Dra. Melva Reve ofrece terapia experta bipolar y estabilizaci\xF3n del estado de \xE1nimo con atenci\xF3n integral."
          },
          {
            property: "og:title",
            content: "Tratamiento Bipolar Naples FL - Dra. Melva Reve | Healing Minds"
          },
          {
            property: "og:url",
            content: `${baseUrl}/es/servicios/tratamiento-bipolar`
          }
        ]
      };
    case "/es/servicios/manejo-medicamentos":
      return {
        canonical: `${baseUrl}/es/servicios/manejo-medicamentos`,
        metaTags: [
          {
            name: "description",
            content: "Manejo de medicamentos psiqui\xE1tricos en Naples, FL. La Dra. Melva Reve proporciona monitoreo y optimizaci\xF3n experta de medicamentos para condiciones de salud mental."
          },
          {
            property: "og:title",
            content: "Manejo Medicamentos Naples FL - Dra. Melva Reve | Healing Minds"
          },
          {
            property: "og:url",
            content: `${baseUrl}/es/servicios/manejo-medicamentos`
          }
        ]
      };
    // Spanish legal pages
    case "/es/politica-privacidad":
      return {
        canonical: `${baseUrl}/es/politica-privacidad`,
        metaTags: [
          {
            name: "description",
            content: "Pol\xEDtica de Privacidad para Healing Minds Psychiatry. Aprenda c\xF3mo protegemos su informaci\xF3n de salud personal y cumplimos con las regulaciones HIPAA."
          },
          {
            property: "og:title",
            content: "Pol\xEDtica de Privacidad - Healing Minds Psychiatry | Dra. Melva Reve"
          },
          {
            property: "og:url",
            content: `${baseUrl}/es/politica-privacidad`
          }
        ]
      };
    case "/es/terminos-servicio":
      return {
        canonical: `${baseUrl}/es/terminos-servicio`,
        metaTags: [
          {
            name: "description",
            content: "T\xE9rminos de Servicio para Healing Minds Psychiatry. Entendiendo los t\xE9rminos y condiciones para la atenci\xF3n psiqui\xE1trica con la Dra. Melva Reve."
          },
          {
            property: "og:title",
            content: "T\xE9rminos de Servicio - Healing Minds Psychiatry | Dra. Melva Reve"
          },
          {
            property: "og:url",
            content: `${baseUrl}/es/terminos-servicio`
          }
        ]
      };
    case "/es/aviso-hipaa":
      return {
        canonical: `${baseUrl}/es/aviso-hipaa`,
        metaTags: [
          {
            name: "description",
            content: "Aviso de Pr\xE1cticas de Privacidad HIPAA para Healing Minds Psychiatry. Sus derechos con respecto a la informaci\xF3n de salud protegida y privacidad."
          },
          {
            property: "og:title",
            content: "Aviso HIPAA - Healing Minds Psychiatry | Dra. Melva Reve"
          },
          {
            property: "og:url",
            content: `${baseUrl}/es/aviso-hipaa`
          }
        ]
      };
    case "/es/politica-cookies":
      return {
        canonical: `${baseUrl}/es/politica-cookies`,
        metaTags: [
          {
            name: "description",
            content: "Pol\xEDtica de Cookies para el sitio web de Healing Minds Psychiatry. Aprenda sobre el uso de cookies, an\xE1lisis y sus opciones de privacidad."
          },
          {
            property: "og:title",
            content: "Pol\xEDtica de Cookies - Healing Minds Psychiatry | Dra. Melva Reve"
          },
          {
            property: "og:url",
            content: `${baseUrl}/es/politica-cookies`
          }
        ]
      };
    // Homepage española
    case "/es":
    case "/es/":
      return {
        canonical: `${baseUrl}/es/`,
        schema: getMedicalBusinessSchema(baseUrl),
        metaTags: [
          {
            name: "description",
            content: "La psiquiatra certificada Dra. Melva Reve brinda atenci\xF3n psiqui\xE1trica experta en Naples, FL. Especializada en ansiedad, depresi\xF3n, TDAH y terapia. Servicios de salud mental para el suroeste de Florida."
          },
          {
            property: "og:title",
            content: "Dra. Melva Reve - Psiquiatra Naples FL | Healing Minds Psychiatry"
          },
          {
            property: "og:description",
            content: "Psiquiatra certificada en Naples, FL. Tratamiento experto para ansiedad, depresi\xF3n, TDAH, TEPT. Atenci\xF3n biling\xFCe disponible."
          },
          {
            property: "og:url",
            content: `${baseUrl}/es/`
          },
          // HREFLANG: Homepage bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/`
          },
          {
            rel: "alternate",
            hreflang: "x-default",
            href: `${baseUrl}/`
          }
        ]
      };
    // Acerca de español
    case "/es/acerca-de":
      return {
        canonical: `${baseUrl}/es/acerca-de`,
        metaTags: [
          {
            name: "description",
            content: "Conozca a la Dra. Melva Reve, psiquiatra certificada con m\xE1s de 15 a\xF1os de experiencia sirviendo Naples, FL. Atenci\xF3n biling\xFCe con sensibilidad cultural."
          },
          {
            property: "og:title",
            content: "Acerca de la Dra. Melva Reve - Psiquiatra Certificada Naples FL | Healing Minds"
          },
          {
            property: "og:url",
            content: `${baseUrl}/es/acerca-de`
          },
          // HREFLANG: About bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/about`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/acerca-de`
          }
        ]
      };
    // Contacto español
    case "/es/contacto":
      return {
        canonical: `${baseUrl}/es/contacto`,
        metaTags: [
          {
            name: "description",
            content: "Contacte Healing Minds Psychiatry en Naples, FL para programar su consulta. Llame (239) 423-0272 o env\xEDe un mensaje. Servicios biling\xFCes disponibles."
          },
          {
            property: "og:title",
            content: "Contactar Dra. Melva Reve - Naples FL Psiquiatra | Healing Minds"
          },
          {
            property: "og:url",
            content: `${baseUrl}/es/contacto`
          },
          // HREFLANG: Contact bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/contact`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/contacto`
          }
        ]
      };
    // Para Pacientes español
    case "/es/para-pacientes":
      return {
        canonical: `${baseUrl}/es/para-pacientes`,
        metaTags: [
          {
            name: "description",
            content: "Informaci\xF3n importante para pacientes sobre seguro, citas y atenci\xF3n psiqui\xE1trica en Healing Minds Naples. FAQ y qu\xE9 esperar."
          },
          {
            property: "og:title",
            content: "Para Pacientes - Healing Minds Psychiatry | Dra. Melva Reve Naples FL"
          },
          {
            property: "og:url",
            content: `${baseUrl}/es/para-pacientes`
          },
          // HREFLANG: For Patients bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/for-patients`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/para-pacientes`
          }
        ]
      };
    // ADHD Treatment español (faltaba esta ruta crítica)
    case "/es/servicios/tratamiento-adhd":
      return {
        canonical: `${baseUrl}/es/servicios/tratamiento-adhd`,
        metaTags: [
          {
            name: "description",
            content: "Tratamiento de TDAH para adultos en Naples, FL. La Dra. Melva Reve proporciona evaluaci\xF3n integral de TDAH, terapia y manejo de medicamentos."
          },
          {
            property: "og:title",
            content: "Tratamiento TDAH Adultos Naples FL - Dra. Melva Reve | Healing Minds"
          },
          {
            property: "og:url",
            content: `${baseUrl}/es/servicios/tratamiento-adhd`
          }
        ]
      };
    // Spanish location pages (CRITICAL - these were missing per Gemini diagnosis)
    case "/es/ubicaciones/psiquiatra-naples":
      return {
        canonical: `${baseUrl}/es/ubicaciones/psiquiatra-naples`,
        schema: getMedicalBusinessSchema(baseUrl),
        metaTags: [
          {
            name: "description",
            content: "Visite a la Dra. Melva Reve en Naples, FL en 4760 Tamiami Trl N # 25. Atenci\xF3n psiqui\xE1trica experta para ansiedad, depresi\xF3n, TDAH, TEPT. Llame (239) 423-0272."
          },
          {
            property: "og:title",
            content: "Psiquiatra Naples FL - Ubicaci\xF3n Dra. Melva Reve | Healing Minds"
          },
          {
            property: "og:url",
            content: `${baseUrl}/es/ubicaciones/psiquiatra-naples`
          },
          // HREFLANG: Naples bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/locations/psychiatrist-naples`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/ubicaciones/psiquiatra-naples`
          }
        ]
      };
    case "/es/ubicaciones/psiquiatra-bonita-springs":
      return {
        canonical: `${baseUrl}/es/ubicaciones/psiquiatra-bonita-springs`,
        schema: getServiceSchema(baseUrl, "Bonita Springs"),
        metaTags: [
          {
            name: "description",
            content: "\xBFBusca atenci\xF3n psiqui\xE1trica experta en Bonita Springs? La Dra. Melva Reve sirve el \xE1rea de Bonita Springs FL con tratamiento para ansiedad, depresi\xF3n, TDAH, TEPT. Llame (239) 423-0272."
          },
          {
            property: "og:title",
            content: "Psiquiatra Cerca de Bonita Springs FL - Dra. Melva Reve | Healing Minds"
          },
          {
            property: "og:url",
            content: `${baseUrl}/es/ubicaciones/psiquiatra-bonita-springs`
          },
          // HREFLANG: Bonita Springs bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/locations/psychiatrist-bonita-springs`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/ubicaciones/psiquiatra-bonita-springs`
          }
        ]
      };
    case "/es/ubicaciones/psiquiatra-marco-island":
      return {
        canonical: `${baseUrl}/es/ubicaciones/psiquiatra-marco-island`,
        schema: getServiceSchema(baseUrl, "Marco Island"),
        metaTags: [
          {
            name: "description",
            content: "\xBFBusca atenci\xF3n psiqui\xE1trica experta en Marco Island? La Dra. Melva Reve sirve el \xE1rea de Marco Island FL con tratamiento para ansiedad, depresi\xF3n, TDAH, TEPT. Llame (239) 423-0272."
          },
          {
            property: "og:title",
            content: "Psiquiatra Cerca de Marco Island FL - Dra. Melva Reve | Healing Minds"
          },
          {
            property: "og:url",
            content: `${baseUrl}/es/ubicaciones/psiquiatra-marco-island`
          },
          // HREFLANG: Marco Island bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/locations/psychiatrist-marco-island`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/ubicaciones/psiquiatra-marco-island`
          }
        ]
      };
    case "/es/ubicaciones/psiquiatra-fort-myers":
      return {
        canonical: `${baseUrl}/es/ubicaciones/psiquiatra-fort-myers`,
        schema: getServiceSchema(baseUrl, "Fort Myers"),
        metaTags: [
          {
            name: "description",
            content: "\xBFBusca atenci\xF3n psiqui\xE1trica experta en Fort Myers? La Dra. Melva Reve sirve el \xE1rea de Fort Myers FL con tratamiento para ansiedad, depresi\xF3n, TDAH, TEPT. Llame (239) 423-0272."
          },
          {
            property: "og:title",
            content: "Psiquiatra Cerca de Fort Myers FL - Dra. Melva Reve | Healing Minds"
          },
          {
            property: "og:url",
            content: `${baseUrl}/es/ubicaciones/psiquiatra-fort-myers`
          },
          // HREFLANG: Fort Myers bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/locations/psychiatrist-fort-myers`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/ubicaciones/psiquiatra-fort-myers`
          }
        ]
      };
    case "/es/ubicaciones/psiquiatra-ave-maria":
      return {
        canonical: `${baseUrl}/es/ubicaciones/psiquiatra-ave-maria`,
        schema: getServiceSchema(baseUrl, "Ave Maria"),
        metaTags: [
          {
            name: "description",
            content: "\xBFBusca atenci\xF3n psiqui\xE1trica experta en Ave Maria? La Dra. Melva Reve sirve el \xE1rea de Ave Maria FL con tratamiento para ansiedad, depresi\xF3n, TDAH, TEPT. Llame (239) 423-0272."
          },
          {
            property: "og:title",
            content: "Psiquiatra Cerca de Ave Maria FL - Dra. Melva Reve | Healing Minds"
          },
          {
            property: "og:url",
            content: `${baseUrl}/es/ubicaciones/psiquiatra-ave-maria`
          },
          // HREFLANG: Ave Maria bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/locations/psychiatrist-ave-maria`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/ubicaciones/psiquiatra-ave-maria`
          }
        ]
      };
    case "/es/ubicaciones/psiquiatra-estero":
      return {
        canonical: `${baseUrl}/es/ubicaciones/psiquiatra-estero`,
        schema: getServiceSchema(baseUrl, "Estero"),
        metaTags: [
          {
            name: "description",
            content: "\xBFBusca atenci\xF3n psiqui\xE1trica experta en Estero? La Dra. Melva Reve sirve el \xE1rea de Estero FL con tratamiento para ansiedad, depresi\xF3n, TDAH, TEPT. Llame (239) 423-0272."
          },
          {
            property: "og:title",
            content: "Psiquiatra Cerca de Estero FL - Dra. Melva Reve | Healing Minds"
          },
          {
            property: "og:url",
            content: `${baseUrl}/es/ubicaciones/psiquiatra-estero`
          },
          // HREFLANG: Estero bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/locations/psychiatrist-estero`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/ubicaciones/psiquiatra-estero`
          }
        ]
      };
    case "/es/ubicaciones/psiquiatra-golden-gate":
      return {
        canonical: `${baseUrl}/es/ubicaciones/psiquiatra-golden-gate`,
        schema: getServiceSchema(baseUrl, "Golden Gate"),
        metaTags: [
          {
            name: "description",
            content: "\xBFBusca atenci\xF3n psiqui\xE1trica experta en Golden Gate? La Dra. Melva Reve sirve el \xE1rea de Golden Gate FL con tratamiento para ansiedad, depresi\xF3n, TDAH, TEPT. Llame (239) 423-0272."
          },
          {
            property: "og:title",
            content: "Psiquiatra Cerca de Golden Gate FL - Dra. Melva Reve | Healing Minds"
          },
          {
            property: "og:url",
            content: `${baseUrl}/es/ubicaciones/psiquiatra-golden-gate`
          },
          // HREFLANG: Golden Gate bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/locations/psychiatrist-golden-gate`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/ubicaciones/psiquiatra-golden-gate`
          }
        ]
      };
    case "/es/ubicaciones/psiquiatra-immokalee":
      return {
        canonical: `${baseUrl}/es/ubicaciones/psiquiatra-immokalee`,
        schema: getServiceSchema(baseUrl, "Immokalee"),
        metaTags: [
          {
            name: "description",
            content: "\xBFBusca atenci\xF3n psiqui\xE1trica experta en Immokalee? La Dra. Melva Reve sirve el \xE1rea de Immokalee FL con tratamiento para ansiedad, depresi\xF3n, TDAH, TEPT. Llame (239) 423-0272."
          },
          {
            property: "og:title",
            content: "Psiquiatra Cerca de Immokalee FL - Dra. Melva Reve | Healing Minds"
          },
          {
            property: "og:url",
            content: `${baseUrl}/es/ubicaciones/psiquiatra-immokalee`
          },
          // HREFLANG: Immokalee bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/locations/psychiatrist-immokalee`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/ubicaciones/psiquiatra-immokalee`
          }
        ]
      };
    case "/es/ubicaciones/psiquiatra-lely-resort":
      return {
        canonical: `${baseUrl}/es/ubicaciones/psiquiatra-lely-resort`,
        schema: getServiceSchema(baseUrl, "Lely Resort"),
        metaTags: [
          {
            name: "description",
            content: "\xBFBusca atenci\xF3n psiqui\xE1trica experta en Lely Resort? La Dra. Melva Reve sirve el \xE1rea de Lely Resort FL con tratamiento para ansiedad, depresi\xF3n, TDAH, TEPT. Llame (239) 423-0272."
          },
          {
            property: "og:title",
            content: "Psiquiatra Cerca de Lely Resort FL - Dra. Melva Reve | Healing Minds"
          },
          {
            property: "og:url",
            content: `${baseUrl}/es/ubicaciones/psiquiatra-lely-resort`
          },
          // HREFLANG: Lely Resort bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/locations/psychiatrist-lely-resort`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/ubicaciones/psiquiatra-lely-resort`
          }
        ]
      };
    case "/es/ubicaciones/psiquiatra-vanderbilt-beach":
      return {
        canonical: `${baseUrl}/es/ubicaciones/psiquiatra-vanderbilt-beach`,
        schema: getServiceSchema(baseUrl, "Vanderbilt Beach"),
        metaTags: [
          {
            name: "description",
            content: "\xBFBusca atenci\xF3n psiqui\xE1trica experta en Vanderbilt Beach? La Dra. Melva Reve sirve el \xE1rea de Vanderbilt Beach FL con tratamiento para ansiedad, depresi\xF3n, TDAH, TEPT. Llame (239) 423-0272."
          },
          {
            property: "og:title",
            content: "Psiquiatra Cerca de Vanderbilt Beach FL - Dra. Melva Reve | Healing Minds"
          },
          {
            property: "og:url",
            content: `${baseUrl}/es/ubicaciones/psiquiatra-vanderbilt-beach`
          },
          // HREFLANG: Vanderbilt Beach bilingual versions
          {
            rel: "alternate",
            hreflang: "en",
            href: `${baseUrl}/locations/psychiatrist-vanderbilt-beach`
          },
          {
            rel: "alternate",
            hreflang: "es",
            href: `${baseUrl}/es/ubicaciones/psiquiatra-vanderbilt-beach`
          }
        ]
      };
    // Add more routes as needed
    default:
      return null;
  }
}
function getServiceSchema(baseUrl, cityName) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${baseUrl}/locations/psychiatrist-${cityName.toLowerCase().replace(/ /g, "-")}#Service`,
    "name": "Psychiatric Services",
    "description": `Expert psychiatric care and mental health services for ${cityName}, FL residents. Dr. Melva Reve provides comprehensive treatment for anxiety, depression, ADHD, PTSD, and other mental health conditions.`,
    "serviceType": "Psychiatric Care",
    "areaServed": {
      "@type": "City",
      "name": cityName,
      "addressRegion": "FL",
      "addressCountry": "US"
    },
    "provider": {
      "@type": "MedicalClinic",
      "@id": "https://www.healingmindsp.com/#MedicalClinic"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Psychiatric Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Anxiety Treatment"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Depression Treatment"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "ADHD Treatment"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "PTSD Treatment"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Medication Management"
          }
        }
      ]
    },
    "availableLanguage": ["English", "Spanish"],
    "url": `${baseUrl}/locations/psychiatrist-${cityName.toLowerCase().replace(/ /g, "-")}`
  };
}
function getMedicalBusinessSchema(baseUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": `${baseUrl}/#MedicalClinic`,
    "name": "Healing Minds Psychiatry",
    "url": baseUrl,
    "logo": `${baseUrl}/favicon.svg`,
    "image": `${baseUrl}/doctor-profile-v2.webp`,
    "description": "Board certified psychiatrist Dr. Melva Reve providing expert psychiatric care in Naples, FL. Specializing in anxiety, depression, ADHD, PTSD, and comprehensive mental health services.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": 5,
      "reviewCount": 17,
      "bestRating": 5,
      "worstRating": 1
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "4760 Tamiami Trl N # 25",
      "addressLocality": "Naples",
      "addressRegion": "FL",
      "postalCode": "34103",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 26.2044803,
      "longitude": -81.8021344
    },
    "telephone": "(239) 423-0272",
    "email": "info@healingmindsp.com",
    "openingHours": [
      "Mo-Fr 09:00-17:00"
    ],
    "medicalSpecialty": [
      "Anxiety Disorders",
      "Depression",
      "ADHD",
      "PTSD",
      "Bipolar Disorder",
      "Medication Management"
    ],
    "availableLanguage": ["English", "Spanish"],
    "paymentAccepted": ["Insurance", "Credit Card", "Cash"],
    "currenciesAccepted": "USD",
    "sameAs": [
      "https://www.google.com/maps/place/Healing+Minds+Psychiatry/@26.2044803,-81.8021344,17z",
      "https://www.instagram.com/hmpsychiatry/",
      "https://www.facebook.com/profile.php?id=61578845287836",
      "https://www.tiktok.com/@dra.melvavidal",
      "https://www.youtube.com/@healingmindsp",
      "https://www.healthgrades.com/physician/dr-melva-reve-urgelles-1dgbqeci76",
      "https://www.yelp.com/biz/healing-minds-psychiatry-naples"
    ],
    "hasMap": "https://www.google.com/maps/place/Healing+Minds+Psychiatry/@26.2044803,-81.8021344,17z",
    "isAcceptingNewPatients": true,
    "priceRange": "$$",
    "founder": {
      "@type": "Person",
      "@id": `${baseUrl}/#Physician`,
      "name": "Dr. Melva Reve",
      "jobTitle": "Board Certified Psychiatrist",
      "hasCredential": [
        {
          "@type": "EducationalOccupationalCredential",
          "credentialCategory": "Medical Degree",
          "educationalLevel": "MD",
          "recognizedBy": {
            "@type": "Organization",
            "name": "University of Miami"
          }
        }
      ],
      "memberOf": {
        "@type": "Organization",
        "name": "American Psychiatric Association"
      },
      "knowsLanguage": ["English", "Spanish"],
      "workLocation": {
        "@id": `${baseUrl}/#MedicalClinic`
      }
    }
  };
}

// server/routes.ts
async function registerRoutes(app2) {
  app2.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api") && !req.path.includes(".")) {
      const originalEnd = res.end;
      res.end = function(chunk, encoding) {
        if (typeof chunk === "string" && chunk.includes("<!DOCTYPE html")) {
          console.log(`\u{1F527} SEO: Injecting meta tags for ${req.originalUrl}`);
          const modifiedHtml = injectMetaTags(chunk, req);
          return originalEnd.call(this, modifiedHtml, encoding);
        }
        return originalEnd.call(this, chunk, encoding);
      };
    }
    next();
  });
  app2.use((req, res, next) => {
    const host = req.get("host");
    if (host === "healingmindsp.com") {
      const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
      return res.redirect(301, `${protocol}://www.healingmindsp.com${req.url}`);
    }
    next();
  });
  app2.get("/adhd-treatment-adults-naples-fl", (req, res) => {
    res.redirect(301, "/services/adhd-treatment");
  });
  app2.get("/locations/naples", (req, res) => {
    res.redirect(301, "/locations/psychiatrist-naples");
  });
  app2.get("/locations/psychiatrist-lely-resorts", (req, res) => {
    res.redirect(301, "/locations/psychiatrist-lely-resort");
  });
  app2.get("/es/ubicaciones/psiquiatra-lely-resorts", (req, res) => {
    res.redirect(301, "/es/ubicaciones/psiquiatra-lely-resort");
  });
  app2.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const contactMessage = await storage.createContactMessage(validatedData);
      try {
        console.log("\u{1F504} Starting email sending process...");
        await Promise.all([
          emailService.sendContactNotification(validatedData),
          emailService.sendConfirmationEmail(validatedData)
        ]);
        console.log("\u2705 Emails sent successfully for contact form submission");
      } catch (emailError) {
        console.error("\u274C Error sending emails:", emailError);
      }
      console.log("New contact message received:", contactMessage);
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
  app2.get("/api/contact-messages", async (req, res) => {
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
  const metricoolService = new MetricoolService();
  app2.get("/api/reviews", async (req, res) => {
    try {
      const cacheKey = "reviews-data";
      let cachedData = reviewsCache.get(cacheKey);
      if (cachedData) {
        return res.status(200).json({ success: true, data: cachedData });
      }
      try {
        const metricoolResponse = await metricoolService.fetchReviews();
        console.log("\u{1F4CA} Metricool response structure:", {
          hasReviews: "reviews" in metricoolResponse,
          reviewsType: typeof metricoolResponse.reviews,
          reviewsLength: metricoolResponse.reviews?.length || 0
        });
        const reviews = metricoolResponse.reviews || [];
        const transformedReviews = metricoolService.transformReviewsToUIFormat(reviews);
        const stats = metricoolService.calculateStats(reviews);
        const reviewsData = {
          stats,
          reviews: transformedReviews
        };
        reviewsCache.set(cacheKey, reviewsData);
        res.status(200).json({ success: true, data: reviewsData });
      } catch (apiError) {
        console.log("\u{1F4CB} Using static reviews as fallback due to API error:", apiError);
        const fallbackData = {
          stats: staticStats,
          reviews: staticReviews
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
  app2.get("/api/reviews/rating", async (req, res) => {
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
        console.log("\u{1F4CB} Using static rating as fallback due to API error:", apiError);
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
  app2.post("/api/reviews/refresh", async (req, res) => {
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
  app2.get("/api/tiktok", async (req, res) => {
    try {
      console.log("\u{1F3B5} TikTok API endpoint called");
      const tiktokData = await metricoolService.fetchTikTokPosts();
      res.status(200).json({
        success: true,
        data: tiktokData
      });
    } catch (error) {
      console.error("\u274C Error in TikTok endpoint:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching TikTok posts",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/sitemap.xml", generateSitemap);
  app2.get("/robots.txt", generateRobotsTxt);
  app2.use((req, res, next) => {
    const url = req.originalUrl;
    const pathname = req.path;
    if (url.includes("zhHant") || url.includes("surugaya") || url.includes("product/surugaya") || pathname.startsWith("/product/") || pathname.includes("/zh") || pathname.includes("/ja/")) {
      console.log(`\u{1F6AB} 410 Gone: Japanese hack URL blocked - ${url}`);
      return res.status(410).json({
        error: "Gone",
        message: "This content has been permanently removed",
        code: 410
      });
    }
    if (url.includes("?_g=") || url.includes("&_g=")) {
      console.log(`\u{1F6AB} 403 Forbidden: Parameter spam blocked - ${url}`);
      return res.status(403).json({
        error: "Forbidden",
        message: "Access denied - parameter spam detected",
        code: 403
      });
    }
    if (pathname.startsWith("/home-") || pathname.startsWith("/member/") || pathname.startsWith("/legend/") || pathname.includes("/wp-") || pathname.includes("/wordpress/") || pathname.includes("/blog/") && !pathname.startsWith("/blog")) {
      console.log(`\u{1F6AB} 404 Not Found: WordPress legacy URL blocked - ${url}`);
      return res.status(404).json({
        error: "Not Found",
        message: "The requested page does not exist",
        code: 404
      });
    }
    next();
  });
  let cachedIndexHtml = null;
  app2.use("*", async (req, res, next) => {
    if (process.env.NODE_ENV === "development") {
      return next();
    }
    if (req.method !== "GET" || req.path.startsWith("/api") || req.path.includes(".")) {
      return next();
    }
    try {
      if (!cachedIndexHtml) {
        const indexPath = path.resolve(import.meta.dirname, "public", "index.html");
        cachedIndexHtml = await fs.promises.readFile(indexPath, "utf-8");
        console.log(`\u{1F4E6} SEO: Cached index.html template in memory (${cachedIndexHtml.length} bytes)`);
      }
      const modifiedHtml = injectMetaTags(cachedIndexHtml, req);
      console.log(`\u{1F527} SEO (PRODUCTION): Injecting meta tags for ${req.originalUrl}`);
      res.status(200).set({ "Content-Type": "text/html; charset=utf-8" }).send(modifiedHtml);
    } catch (error) {
      console.error(`\u274C Error serving HTML in production: ${error}`);
      cachedIndexHtml = null;
      next();
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.set("etag", "strong");
app.use(compression({
  filter: (req, res) => {
    if (req.headers["x-no-compression"]) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 9,
  // Maximum compression level for text files
  threshold: 512
  // Compress even smaller files
}));
app.use((req, res, next) => {
  if (req.url.match(/\.(js|css|png|jpg|jpeg|webp|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("ETag", `"${Date.now()}-${req.url.split("/").pop()}"`);
  } else if (req.url.match(/\.html$/) || req.url === "/" || req.url.includes("/locations/") || req.url.includes("/services/") || req.url.includes("/es/") || req.url.match(/^\/(about|contact|for-patients|privacy-policy|terms-of-service|hipaa-notice|cookie-policy)/) || req.url === "/services" || req.url === "/es/servicios") {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
    res.setHeader("X-Accel-Expires", "0");
  }
  next();
});
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
