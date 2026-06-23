import { getSeoSiteConfig, resolvePublicUrl } from "./config";

type SearchConsoleInspection = {
  verdict?: string;
  coverageState?: string;
  robotsTxtState?: string;
  indexingState?: string;
  pageFetchState?: string;
  lastCrawlTime?: string;
  crawledAs?: string;
  userCanonical?: string;
  googleCanonical?: string;
  sitemap?: string[];
  richResultsVerdict?: string;
};

type RenderAuditResult = {
  status: number | null;
  finalUrl: string;
  indexableRobots: boolean;
  robotsContent: string | null;
  canonical: string | null;
  canonicalMatches: boolean;
  sitemapContainsUrl: boolean;
  titlePresent: boolean;
  h1Present: boolean;
  estimatedWordCount: number;
  minimumWordCount: number;
  ok: boolean;
  errors: string[];
};

export type SeoPublishingResult = {
  input: string;
  url: string;
  sitemapUrl: string;
  checkedAt: string;
  renderAudit: RenderAuditResult;
  searchConsole: {
    configured: boolean;
    sitemapSubmitted: boolean;
    inspection?: SearchConsoleInspection;
    error?: string;
  };
};

type SeoPublishingOptions = {
  skipSearchConsole?: boolean;
  sitemapAlreadySubmitted?: boolean;
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof Error)) {
    return error ? String(error) : fallback;
  }

  const cause = (error as Error & { cause?: unknown }).cause;
  if (cause instanceof Error && cause.message) {
    return `${error.message}: ${cause.message}`;
  }

  return error.message || fallback;
}

function parseAttributes(tag: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  const regex = /([\w:-]+)\s*=\s*["']([^"']*)["']/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(tag)) !== null) {
    attributes[match[1].toLowerCase()] = match[2];
  }

  return attributes;
}

function extractRobotsContent(html: string): string | null {
  const tags = html.match(/<meta\s+[^>]*>/gi) || [];
  for (const tag of tags) {
    const attributes = parseAttributes(tag);
    const key = attributes.name || attributes.property;
    if (key?.toLowerCase() === "robots") {
      return attributes.content || null;
    }
  }

  return null;
}

function extractCanonical(html: string): string | null {
  const tags = html.match(/<link\s+[^>]*>/gi) || [];
  for (const tag of tags) {
    const attributes = parseAttributes(tag);
    if (attributes.rel?.toLowerCase() === "canonical") {
      return attributes.href || null;
    }
  }

  return null;
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getGoogleOAuthEnv(): { clientId: string; clientSecret: string; refreshToken: string } | null {
  const clientId = process.env.GSC_OAUTH_CLIENT_ID || process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GSC_OAUTH_CLIENT_SECRET || process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GSC_OAUTH_REFRESH_TOKEN || process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  return { clientId, clientSecret, refreshToken };
}

async function getAccessToken(): Promise<string | null> {
  const oauth = getGoogleOAuthEnv();
  if (!oauth) return null;

  const body = new URLSearchParams({
    client_id: oauth.clientId,
    client_secret: oauth.clientSecret,
    refresh_token: oauth.refreshToken,
    grant_type: "refresh_token",
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    throw new Error(`Google OAuth token refresh failed (${response.status}): ${await response.text()}`);
  }

  const data = await response.json() as { access_token?: string };
  if (!data.access_token) {
    throw new Error("Google OAuth did not return an access token");
  }

  return data.access_token;
}

async function auditRenderedUrl(url: string, sitemapUrl: string): Promise<RenderAuditResult> {
  const { minRenderedWords } = getSeoSiteConfig();
  const errors: string[] = [];
  let html = "";
  let status: number | null = null;
  let finalUrl = url;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Googlebot/2.1 (+http://www.google.com/bot.html)",
      },
      redirect: "follow",
    });
    status = response.status;
    finalUrl = response.url || url;
    html = await response.text();

    if (response.status !== 200) {
      errors.push(`URL returned HTTP ${response.status}`);
    }
  } catch (error) {
    errors.push(getErrorMessage(error, "Failed to fetch published URL"));
  }

  const robotsContent = html ? extractRobotsContent(html) : null;
  const indexableRobots = !robotsContent || !/noindex|none/i.test(robotsContent);
  if (!indexableRobots) errors.push(`Robots meta is not indexable: ${robotsContent}`);

  const canonical = html ? extractCanonical(html) : null;
  const canonicalMatches = canonical === finalUrl;
  if (!canonical) errors.push("Canonical tag missing");
  if (canonical && !canonicalMatches) errors.push(`Canonical mismatch: ${canonical}`);

  const titlePresent = /<title>[^<]{5,}<\/title>/i.test(html);
  if (!titlePresent) errors.push("Title tag missing or too short");

  const h1Present = /<h1[\s>]/i.test(html);
  if (!h1Present) errors.push("H1 missing from initial HTML");

  const estimatedWordCount = stripHtml(html).split(/\s+/).filter(Boolean).length;
  if (estimatedWordCount < minRenderedWords) {
    errors.push(`Initial HTML looks thin (${estimatedWordCount} words)`);
  }

  let sitemapContainsUrl = false;
  try {
    const sitemapResponse = await fetch(sitemapUrl, {
      headers: { "User-Agent": "Mozilla/5.0 Healing Minds SEO publishing audit" },
    });
    const sitemapXml = await sitemapResponse.text();
    sitemapContainsUrl = sitemapResponse.ok && sitemapXml.includes(finalUrl);
    if (!sitemapContainsUrl) errors.push("Sitemap does not contain audited URL");
  } catch (error) {
    errors.push(getErrorMessage(error, "Failed to fetch sitemap"));
  }

  return {
    status,
    finalUrl,
    indexableRobots,
    robotsContent,
    canonical,
    canonicalMatches,
    sitemapContainsUrl,
    titlePresent,
    h1Present,
    estimatedWordCount,
    minimumWordCount: minRenderedWords,
    ok: errors.length === 0,
    errors,
  };
}

async function submitSitemap(accessToken: string, siteUrl: string, sitemapUrl: string): Promise<void> {
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;
  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Sitemap submit failed (${response.status}): ${await response.text()}`);
  }
}

async function inspectUrl(accessToken: string, siteUrl: string, url: string): Promise<SearchConsoleInspection> {
  const response = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inspectionUrl: url,
      siteUrl,
    }),
  });

  if (!response.ok) {
    throw new Error(`URL Inspection failed (${response.status}): ${await response.text()}`);
  }

  const data = await response.json() as any;
  const indexStatus = data.inspectionResult?.indexStatusResult || {};
  const richResults = data.inspectionResult?.richResultsResult || {};

  return {
    verdict: indexStatus.verdict,
    coverageState: indexStatus.coverageState,
    robotsTxtState: indexStatus.robotsTxtState,
    indexingState: indexStatus.indexingState,
    pageFetchState: indexStatus.pageFetchState,
    lastCrawlTime: indexStatus.lastCrawlTime,
    crawledAs: indexStatus.crawledAs,
    userCanonical: indexStatus.userCanonical,
    googleCanonical: indexStatus.googleCanonical,
    sitemap: indexStatus.sitemap,
    richResultsVerdict: richResults.verdict,
  };
}

export async function runSeoPublishingCheck(
  pathOrUrl: string,
  options: SeoPublishingOptions = {},
): Promise<SeoPublishingResult> {
  const config = getSeoSiteConfig();
  const url = resolvePublicUrl(pathOrUrl);
  const renderAudit = await auditRenderedUrl(url, config.sitemapUrl);

  const result: SeoPublishingResult = {
    input: pathOrUrl,
    url,
    sitemapUrl: config.sitemapUrl,
    checkedAt: new Date().toISOString(),
    renderAudit,
    searchConsole: {
      configured: false,
      sitemapSubmitted: false,
    },
  };

  if (options.skipSearchConsole) {
    result.searchConsole.error = "Search Console check skipped by option";
    return result;
  }

  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      result.searchConsole.error = "Search Console OAuth env vars are not configured";
      return result;
    }

    result.searchConsole.configured = true;
    if (!options.sitemapAlreadySubmitted) {
      await submitSitemap(accessToken, config.gscSiteUrl, config.sitemapUrl);
    }
    result.searchConsole.sitemapSubmitted = true;
    result.searchConsole.inspection = await inspectUrl(accessToken, config.gscSiteUrl, renderAudit.finalUrl);
  } catch (error) {
    result.searchConsole.error = getErrorMessage(error, "Search Console request failed");
  }

  return result;
}
