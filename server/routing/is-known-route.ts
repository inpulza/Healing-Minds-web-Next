import { getKnownRoutePaths } from "@shared/routeManifest";
import { getBlogPostBySlug, getBlogSlugFromPath } from "../blog/storage";

const knownStaticRoutes: ReadonlySet<string> = new Set(getKnownRoutePaths());

/**
 * Shared route-existence contract for the legacy Express fallback and the
 * active Next.js blog-link auditor. It intentionally contains no HTML or SEO
 * injection logic, so importing it cannot pull the dead Express renderer into
 * the App Router bundle.
 */
export async function isKnownRoute(urlOrPath: string): Promise<boolean> {
  if (!urlOrPath) return false;
  let pathname = urlOrPath.split("?")[0].split("#")[0];
  if (pathname.length > 1 && pathname.endsWith("/")) pathname = pathname.slice(0, -1);
  if (knownStaticRoutes.has(pathname)) return true;

  const match = getBlogSlugFromPath(pathname);
  if (!match) return false;
  return Boolean(await getBlogPostBySlug(match.slug, match.language));
}
