import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/admin/",
          "/api/contact-messages",
          "/cgi-bin/",
          "/wp-admin/",
          "/wp-login.php",
        ],
      },
    ],
    sitemap: "https://www.healingmindsp.com/sitemap.xml",
    host: "https://www.healingmindsp.com",
  };
}
