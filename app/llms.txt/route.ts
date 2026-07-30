import { getSitemapEntries } from "@shared/routeManifest";

export const dynamic = "force-static";

export function GET() {
  const routeLines = getSitemapEntries()
    .flatMap((entry) => [entry.en, entry.es])
    .map((route) => `- https://www.healingmindsp.com${route === "/" ? "" : route}`)
    .join("\n");

  const body = `# Healing Minds Psychiatry

Healing Minds Psychiatry provides bilingual psychiatric care in Naples and Southwest Florida.

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
