import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@shared/routeManifest";
import { buildBlogSitemapEntries } from "../server/blog/sitemap-entries.mjs";

const ORIGIN = "https://www.healingmindsp.com";

// Match the historical sitemap's 24-hour cache while allowing newly
// published database articles to appear without another deployment.
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [];

  for (const entry of getSitemapEntries()) {
    const languages = {
      en: `${ORIGIN}${entry.en === "/" ? "" : entry.en}`,
      es: `${ORIGIN}${entry.es}`,
    };
    routes.push({
      url: languages.en,
      changeFrequency: entry.changefreq,
      priority: Number(entry.priority),
      alternates: { languages },
    });
    routes.push({
      url: languages.es,
      changeFrequency: entry.changefreq,
      priority: Number(entry.priority),
      alternates: { languages },
    });
  }

  routes.push(
    {
      url: `${ORIGIN}/blog`,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: {
        languages: {
          en: `${ORIGIN}/blog`,
          es: `${ORIGIN}/es/blog`,
          "x-default": `${ORIGIN}/blog`,
        },
      },
    },
    {
      url: `${ORIGIN}/es/blog`,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: {
        languages: {
          en: `${ORIGIN}/blog`,
          es: `${ORIGIN}/es/blog`,
          "x-default": `${ORIGIN}/blog`,
        },
      },
    },
  );

  if (process.env.DATABASE_URL) {
    try {
      const { getBlogPosts } = await import("../server/blog/storage");
      const posts = await getBlogPosts({ status: "published", limit: 1000, offset: 0 });
      routes.push(...buildBlogSitemapEntries(ORIGIN, posts));
    } catch (error) {
      console.error("Dynamic blog sitemap entries unavailable", error);
    }
  }

  return routes;
}
