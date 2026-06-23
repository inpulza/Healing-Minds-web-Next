const DEFAULT_SITE_BASE_URL = "https://www.healingmindsp.com";
const DEFAULT_GSC_SITE_URL = "sc-domain:healingmindsp.com";

export type SeoSiteConfig = {
  siteBaseUrl: string;
  sitemapUrl: string;
  gscSiteUrl: string;
  canonicalHost: string;
  minRenderedWords: number;
};

function normalizeBaseUrl(value: string): string {
  const normalized = value.trim().replace(/\/+$/, "");
  const url = new URL(normalized);
  return `${url.protocol}//${url.host}`;
}

function parseMinRenderedWords(): number {
  const raw = process.env.SEO_MIN_RENDERED_WORDS;
  if (!raw) return 75;

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 75;
}

export function getSeoSiteConfig(): SeoSiteConfig {
  const siteBaseUrl = normalizeBaseUrl(
    process.env.SITE_BASE_URL ||
    process.env.PUBLIC_SITE_URL ||
    DEFAULT_SITE_BASE_URL,
  );
  const canonicalHost = new URL(siteBaseUrl).host.toLowerCase();

  return {
    siteBaseUrl,
    canonicalHost,
    sitemapUrl: process.env.SEO_SITEMAP_URL || `${siteBaseUrl}/sitemap.xml`,
    gscSiteUrl: process.env.GSC_SITE_URL || DEFAULT_GSC_SITE_URL,
    minRenderedWords: parseMinRenderedWords(),
  };
}

export function getCanonicalRedirectUrl(originalUrl: string): string {
  return `${getSeoSiteConfig().siteBaseUrl}${originalUrl}`;
}

export function shouldRedirectToCanonicalHost(rawHost: string | undefined): boolean {
  if (!rawHost) return false;

  const { canonicalHost } = getSeoSiteConfig();
  const lowerHost = rawHost.toLowerCase();
  const hadDefaultHttpsPort = lowerHost.endsWith(":443");
  const hostBare = hadDefaultHttpsPort ? lowerHost.slice(0, -4) : lowerHost;
  const shouldRedirectApexToWww = canonicalHost.startsWith("www.");
  const apexHost = shouldRedirectApexToWww ? canonicalHost.slice(4) : null;

  return (
    hadDefaultHttpsPort ||
    (apexHost !== null && hostBare === apexHost) ||
    hostBare.endsWith(".replit.app")
  );
}

export function resolvePublicUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl.replace(/\/+$/, "");
  }

  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  if (path === "/") return `${getSeoSiteConfig().siteBaseUrl}/`;
  return `${getSeoSiteConfig().siteBaseUrl}${path.replace(/\/+$/, "")}`;
}
