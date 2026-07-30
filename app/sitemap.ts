import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@shared/routeManifest";

const ORIGIN = "https://www.healingmindsp.com";

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
      alternates: { languages: { en: `${ORIGIN}/blog`, es: `${ORIGIN}/es/blog` } },
    },
    {
      url: `${ORIGIN}/es/blog`,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: { languages: { en: `${ORIGIN}/blog`, es: `${ORIGIN}/es/blog` } },
    },
  );

  if (process.env.DATABASE_URL) {
    try {
      const { getBlogPosts } = await import("../server/blog/storage");
      const posts = await getBlogPosts({ status: "published", limit: 1000, offset: 0 });
      for (const post of posts) {
        const prefix = post.language === "es" ? "/es/blog/" : "/blog/";
        routes.push({
          url: `${ORIGIN}${prefix}${encodeURIComponent(post.slug)}`,
          lastModified: post.updatedAt || post.publishedAt || undefined,
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    } catch (error) {
      console.error("Dynamic blog sitemap entries unavailable", error);
    }
  }

  return routes;
}
