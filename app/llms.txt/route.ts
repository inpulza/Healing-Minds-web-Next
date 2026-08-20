import { getSitemapEntries } from "@shared/routeManifest";
import blogSnapshot from "@shared/blog-snapshot.json";

export const revalidate = 86400;

type PublicPost = { slug: string; language: string };

async function getPublishedPosts(): Promise<PublicPost[]> {
  if (!process.env.DATABASE_URL) return Object.values(blogSnapshot);
  const { getBlogPosts } = await import("../../server/blog/storage");
  return getBlogPosts({ status: "published", limit: 1000, offset: 0 });
}

export async function GET() {
  const staticUrls = getSitemapEntries()
    .flatMap((entry) => [entry.en, entry.es])
    .map((route) => `https://www.healingmindsp.com${route === "/" ? "" : route}`);
  const blogUrls = (await getPublishedPosts()).map((post) =>
    `https://www.healingmindsp.com${post.language === "es" ? "/es" : ""}/blog/${post.slug}`,
  );
  const routeLines = Array.from(new Set([
    ...staticUrls,
    "https://www.healingmindsp.com/blog",
    "https://www.healingmindsp.com/es/blog",
    ...blogUrls,
  ]))
    .map((url) => `- ${url}`)
    .join("\n");

  const body = `# Healing Minds Psychiatry

Healing Minds Psychiatry provides bilingual psychiatric care in Naples and Southwest Florida.

## Verified practice facts
- Public name: Healing Minds Psychiatry
- Address: 4760 Tamiami Trl N #25, Naples, FL 34103
- Phone: +1-239-423-0272
- Hours: Monday-Friday, 8:00 AM-5:00 PM; Saturday-Sunday closed
- Languages: English and Spanish
- Physical offices: one, in Naples; other location pages describe service areas, not branches

## Primary resources
- https://www.healingmindsp.com
- https://www.healingmindsp.com/services
- https://www.healingmindsp.com/es/servicios
- https://www.healingmindsp.com/blog
- https://www.healingmindsp.com/es/blog
- https://www.healingmindsp.com/contact

## Public pages
${routeLines}

Administrative and API routes are not public documentation resources.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
