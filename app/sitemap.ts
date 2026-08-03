import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@shared/routeManifest";
import blogSnapshot from "@shared/blog-snapshot.json";
import { buildBlogSitemapEntries } from "../server/blog/sitemap-entries.mjs";

const ORIGIN = "https://www.healingmindsp.com";

// Match the historical sitemap's 24-hour cache while allowing newly
// published database articles to appear without another deployment.
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [];

  for (const entry of getSitemapEntries()) {
    const languages = {
      en: `${ORIGIN}${entry.en}`,
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

  type SitemapPost = Parameters<typeof buildBlogSitemapEntries>[1][number];
  let publishedPosts: SitemapPost[] = Object.values(blogSnapshot);

  if (process.env.DATABASE_URL) {
    try {
      const { getBlogPosts } = await import("../server/blog/storage");
      publishedPosts = await getBlogPosts({ status: "published", limit: 1000, offset: 0 });
    } catch (error) {
      // Throwing during ISR preserves the last successfully generated sitemap
      // and lets Next retry, instead of caching a degraded snapshot for 24h.
      console.error("Dynamic blog sitemap entries unavailable; preserving last valid sitemap", error);
      throw error;
    }
  }
  routes.push(...buildBlogSitemapEntries(ORIGIN, publishedPosts));

  return routes;
}
