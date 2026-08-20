import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const privatePaths = [
    "/api/admin/",
    "/api/contact-messages",
    "/cgi-bin/",
    "/wp-admin/",
    "/wp-login.php",
  ];
  return {
    rules: [
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-SearchBot",
          "Claude-User",
          "PerplexityBot",
        ],
        allow: "/",
        disallow: privatePaths,
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: privatePaths,
      },
    ],
    sitemap: "https://www.healingmindsp.com/sitemap.xml",
    host: "https://www.healingmindsp.com",
  };
}
