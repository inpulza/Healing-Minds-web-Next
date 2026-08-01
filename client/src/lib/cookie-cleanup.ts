const PRODUCTION_COOKIE_DOMAIN = 'healingmindsp.com';

type CookieCleanupOptions = {
  exactNames?: readonly string[];
  prefixes?: readonly string[];
};

function getVisibleCookieNames(): string[] {
  return document.cookie
    .split(';')
    .map((cookie) => cookie.trim().split('=')[0])
    .filter(Boolean);
}

function getCookieDomains(hostname: string): string[] {
  const currentHostname = hostname.toLowerCase().replace(/\.$/, '');
  const normalizedHostname = currentHostname.replace(/^www\./, '');
  const domains = new Set([currentHostname, `.${currentHostname}`]);

  if (
    normalizedHostname === PRODUCTION_COOKIE_DOMAIN ||
    normalizedHostname.endsWith(`.${PRODUCTION_COOKIE_DOMAIN}`)
  ) {
    domains.add(PRODUCTION_COOKIE_DOMAIN);
    domains.add(`.${PRODUCTION_COOKIE_DOMAIN}`);
  }

  return Array.from(domains);
}

function expireCookie(name: string, domain?: string): void {
  const domainAttribute = domain ? `; domain=${domain}` : '';
  document.cookie = `${name}=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domainAttribute}`;
}

/**
 * Removes first-party cookies visible to the site at host-only, current-domain
 * and canonical Healing Minds domain scope. Providers use current-domain
 * cookies on preview hosts, while production also needs the canonical root.
 * Third-party cookies remain under the provider's control and must be disabled
 * through that provider's consent API.
 */
export function clearFirstPartyCookies({
  exactNames = [],
  prefixes = [],
}: CookieCleanupOptions): void {
  const cookieNames = new Set(exactNames);

  for (const cookieName of getVisibleCookieNames()) {
    if (prefixes.some((prefix) => cookieName.startsWith(prefix))) {
      cookieNames.add(cookieName);
    }
  }

  const domains = getCookieDomains(window.location.hostname);

  for (const cookieName of cookieNames) {
    expireCookie(cookieName);
    for (const domain of domains) {
      expireCookie(cookieName, domain);
    }
  }
}
