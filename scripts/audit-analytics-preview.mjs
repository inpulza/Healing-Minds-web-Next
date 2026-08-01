import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

const previewUrl = process.argv[2];
const oidcToken = process.env.VERCEL_OIDC_TOKEN;
const storageStatePath = process.env.E2E_STORAGE_STATE?.trim();
const healingMindsImmutablePreviewHost =
  /^healing-minds-psychiatry-nextjs-[a-z0-9]+\.vercel\.app$/i;
const healingMindsProtectedPreviewHost =
  /^healing-minds-psychi-git-[a-z0-9-]+-inpulzasolutions-6847s-projects\.vercel\.app$/i;

let parsedPreviewUrl;
try {
  parsedPreviewUrl = new URL(previewUrl);
} catch {
  parsedPreviewUrl = null;
}

if (
  !parsedPreviewUrl ||
  parsedPreviewUrl.protocol !== 'https:' ||
  !(
    healingMindsImmutablePreviewHost.test(parsedPreviewUrl.hostname) ||
    healingMindsProtectedPreviewHost.test(parsedPreviewUrl.hostname)
  )
) {
  throw new Error('Preview URL does not belong to the Healing Minds Vercel project.');
}
if (!oidcToken && !storageStatePath) {
  throw new Error('VERCEL_OIDC_TOKEN or E2E_STORAGE_STATE is required for Preview access.');
}
if (oidcToken && !healingMindsProtectedPreviewHost.test(parsedPreviewUrl.hostname)) {
  throw new Error('OIDC credentials may only be forwarded to the Healing Minds team Preview alias.');
}

const previewOrigin = parsedPreviewUrl.origin;
let storageState;
if (storageStatePath) {
  storageState = JSON.parse(fs.readFileSync(storageStatePath, 'utf8'));
  const cookieDomains = (storageState.cookies ?? []).map((cookie) =>
    cookie.domain.replace(/^\./, ''),
  );
  if (
    !cookieDomains.includes(parsedPreviewUrl.hostname) ||
    cookieDomains.some((domain) => domain !== parsedPreviewUrl.hostname) ||
    (storageState.origins ?? []).some((entry) => entry.origin !== previewOrigin)
  ) {
    throw new Error('Preview storage state must be scoped exactly to the requested deployment origin.');
  }
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  storageState,
});

const page = await context.newPage();
const requestedUrls = [];
const credentialLeaks = [];
page.on('request', (request) => requestedUrls.push(request.url()));
page.on('request', (request) => {
  if (new URL(request.url()).origin === previewOrigin) return;
  const headers = request.headers();
  if (headers['x-vercel-trusted-oidc-idp-token']) {
    credentialLeaks.push(request.url());
  }
});
if (oidcToken) {
  await page.route(`${previewOrigin}/**`, async (route) => {
    let response;
    try {
      response = await route.fetch({
        headers: {
          ...(await route.request().allHeaders()),
          'x-vercel-trusted-oidc-idp-token': oidcToken,
        },
        maxRedirects: 0,
      });
    } catch {
      const pathname = new URL(route.request().url()).pathname;
      throw new Error(`Preview authentication fetch failed for ${pathname}.`);
    }
    await route.fulfill({ response });
  });
}
await page.addInitScript(() => {
  window.__hmpConsentEvents = JSON.parse(
    sessionStorage.getItem('__hmpConsentEvents') ?? '[]',
  );
  window.addEventListener('consentChanged', (event) => {
    window.__hmpConsentEvents.push(event.detail);
    sessionStorage.setItem('__hmpConsentEvents', JSON.stringify(window.__hmpConsentEvents));
  });
});

function dataLayerCommands() {
  return page.evaluate(() =>
    (window.dataLayer ?? []).map((entry) => Array.from(entry)),
  );
}

async function setOptionalConsent(enabled) {
  const preferencesButton = page.getByTestId('footer-cookie-preferences');
  // Home lazy-mounts its footer only when the low-priority boundary approaches
  // the viewport. Sweep to the current document end until that boundary has
  // mounted; a locator cannot scroll to an element that is not in the DOM yet.
  for (let attempt = 0; attempt < 12 && (await preferencesButton.count()) === 0; attempt += 1) {
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(400);
  }
  await preferencesButton.waitFor({ state: 'visible', timeout: 10_000 });
  await preferencesButton.click();
  await page.getByTestId('cookie-preferences-modal').waitFor({ state: 'visible' });

  for (const category of ['analytics', 'marketing']) {
    const toggle = page.getByTestId(`switch-${category}`);
    const isEnabled = (await toggle.getAttribute('data-state')) === 'checked';
    if (isEnabled !== enabled) {
      await toggle.click();
    }
  }
  const reloadPromise = enabled
    ? null
    : page.waitForEvent('framenavigated', (frame) => frame === page.mainFrame());
  await page.getByTestId('button-save-preferences').click();
  if (reloadPromise) {
    await reloadPromise;
    await page.waitForLoadState('domcontentloaded');
  }
  await page.getByTestId('cookie-banner').waitFor({ state: 'hidden' });
}

try {
  await page.goto(previewUrl, { waitUntil: 'domcontentloaded' });
  assert.equal(new URL(page.url()).origin, previewOrigin);
  assert.notEqual(new URL(page.url()).hostname, 'vercel.com', 'preview auth was not bypassed');

  const banner = page.getByTestId('cookie-banner');
  await banner.waitFor({ state: 'visible' });
  await page.waitForFunction(
    () =>
      (window.dataLayer ?? []).some(
        (entry) => Array.from(entry)[0] === 'config',
      ),
    undefined,
    { timeout: 10_000 },
  );
  assert.equal(
    await page.locator('script[src*="clarity.ms"]').count(),
    0,
    'Clarity must not load before analytics consent',
  );
  assert.equal(
    await page.locator('script[src*="analytics.tiktok.com"]').count(),
    0,
    'TikTok must not load before marketing consent',
  );

  const initialCommands = await dataLayerCommands();
  assert.ok(
    initialCommands.some(
      (command) =>
        command[0] === 'consent' &&
        command[1] === 'default' &&
        command[2]?.analytics_storage === 'denied',
    ),
    'Google Consent Mode must start denied',
  );
  assert.ok(
    initialCommands.some(
      (command) => command[0] === 'config' && command[1] === 'G-WMRK41PX2E',
    ),
    'Preview must configure the verified GA4 destination',
  );

  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.getByTestId('hero-title').evaluate((element) => element.tagName), 'H1');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByTestId('hero-title').waitFor({ state: 'visible' });
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.getByTestId('hero-title').evaluate((element) => element.tagName), 'H1');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByTestId('hero-title').waitFor({ state: 'visible' });

  // A real click proves the banner is above the floating telehealth widget.
  await page.getByTestId('button-accept-all').click();
  await banner.waitFor({ state: 'hidden' });
  await page.waitForFunction(
    () =>
      Boolean(document.querySelector('script[src*="clarity.ms"]')) &&
      Boolean(document.querySelector('script[src*="analytics.tiktok.com"]')),
    undefined,
    { timeout: 15_000 },
  );

  await page.evaluate(() => {
    window.__hmpTikTokConsentCalls = [];
    sessionStorage.setItem('__hmpTikTokConsentCalls', '[]');
    for (const method of ['revokeConsent', 'disableCookie', 'enableCookie', 'grantConsent']) {
      const original = window.ttq?.[method];
      if (typeof original !== 'function') continue;
      window.ttq[method] = function instrumentedTikTokConsent(...args) {
        window.__hmpTikTokConsentCalls.push(method);
        sessionStorage.setItem(
          '__hmpTikTokConsentCalls',
          JSON.stringify(window.__hmpTikTokConsentCalls),
        );
        return original.apply(this, args);
      };
    }
  });

  const acceptedState = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('hmp_cookie_consent') ?? 'null'),
  );
  assert.equal(acceptedState.consent.analytics, true);
  assert.equal(acceptedState.consent.marketing, true);
  const acceptedPageViews = (await dataLayerCommands()).filter(
    (command) => command[0] === 'event' && command[1] === 'page_view',
  );
  assert.equal(acceptedPageViews.length, 1, 'initial acceptance must emit one pageview');

  await setOptionalConsent(false);
  const rejectedState = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('hmp_cookie_consent') ?? 'null'),
  );
  assert.equal(rejectedState.consent.analytics, false);
  assert.equal(rejectedState.consent.marketing, false);
  assert.equal(
    await page.locator('script[src*="analytics.tiktok.com"]').count(),
    0,
    'the clean document must not reload TikTok after persisted rejection',
  );

  const firstPartyDomainCookie = (cookie) =>
    parsedPreviewUrl.hostname.endsWith(cookie.domain.replace(/^\./, ''));
  const providerIdentifier = (cookie) =>
    /^(?:_ga|_gid|_gat|_gcl|_gac|_cl|_ttp$|_ttp_pixel$|_tt_sessionId$|_tt_pixel_session_index$|_tt_appInfo$|ttcsid(?:_|$)|ttclid$)/.test(
      cookie.name,
    );

  // Sample the whole delayed-recreation window, rather than checking only the
  // final instant. A regression at seven or twelve seconds must be observable.
  for (let sample = 0; sample <= 60; sample += 1) {
    const elapsedMs = sample * 500;
    const currentCookies = (await context.cookies()).filter(firstPartyDomainCookie);
    const identifiers = currentCookies
      .filter(providerIdentifier)
      .map(({ name, domain }) => ({ name, domain }));
    assert.deepEqual(
      identifiers,
      [],
      `provider identifiers reappeared ${elapsedMs}ms after revocation`,
    );

    const optOutMarker = currentCookies.find((cookie) => cookie.name === '_tt_enable_cookie');
    if (optOutMarker) {
      assert.equal(optOutMarker.value, '0', `TikTok opt-out marker changed after ${elapsedMs}ms`);
    }

    if (sample < 60) {
      await page.waitForTimeout(500);
    }
  }

  const consentEvents = await page.evaluate(() => window.__hmpConsentEvents);
  assert.deepEqual(consentEvents.at(-1), {
    analytics: false,
    marketing: false,
    hasAnalyticsConsent: false,
    hasMarketingConsent: false,
  });
  const revokeCalls = await page.evaluate(() =>
    JSON.parse(sessionStorage.getItem('__hmpTikTokConsentCalls') ?? '[]'),
  );
  assert.ok(revokeCalls.indexOf('revokeConsent') >= 0, 'TikTok revokeConsent must run');
  assert.ok(
    revokeCalls.indexOf('revokeConsent') < revokeCalls.indexOf('disableCookie'),
    'TikTok data sharing must stop before first-party cookies are disabled',
  );

  await setOptionalConsent(true);
  await page.waitForFunction(() => {
    const state = JSON.parse(localStorage.getItem('hmp_cookie_consent') ?? 'null');
    return state?.consent?.analytics && state?.consent?.marketing;
  });
  await page.waitForFunction(
    () =>
      Boolean(document.querySelector('script[src*="clarity.ms"]')) &&
      Boolean(document.querySelector('script[src*="analytics.tiktok.com"]')),
    undefined,
    { timeout: 15_000 },
  );

  // Prevent the external tel protocol while allowing React and document bubble
  // handlers to process the same native click.
  await page.evaluate(() => {
    document.addEventListener(
      'click',
      (event) => {
        if (event.target instanceof Element && event.target.closest('a[href^="tel:"]')) {
          event.preventDefault();
        }
      },
      true,
    );
  });
  const leadsBefore = (await dataLayerCommands()).filter(
    (command) => command[0] === 'event' && command[1] === 'generate_lead',
  ).length;
  await page.getByTestId('hero-call-now').click();
  const leadsAfter = (await dataLayerCommands()).filter(
    (command) => command[0] === 'event' && command[1] === 'generate_lead',
  ).length;
  assert.equal(leadsAfter - leadsBefore, 1, 'one explicit + delegated click must be one lead');

  const finalCommands = await dataLayerCommands();
  const pageViews = finalCommands.filter(
    (command) => command[0] === 'event' && command[1] === 'page_view',
  );
  assert.equal(pageViews.length, 1, 'reacceptance in the clean document must emit one pageview');
  const pageViewTotal = acceptedPageViews.length + pageViews.length;
  assert.equal(pageViewTotal, 2, 'accept and reaccept each emit exactly once across the reload');

  assert.ok(requestedUrls.some((url) => url.includes('googletagmanager.com/gtag/js?id=G-WMRK41PX2E')));
  assert.ok(requestedUrls.some((url) => url.includes('clarity.ms')));
  assert.ok(requestedUrls.some((url) => url.includes('analytics.tiktok.com')));
  assert.deepEqual(credentialLeaks, [], 'Preview credentials must never reach third parties');

  console.log(
    JSON.stringify({
      previewUrl,
      consentCycle: 'denied -> accepted -> rejected -> accepted',
      pageViews: pageViewTotal,
      leadEventsForOneClick: leadsAfter - leadsBefore,
      providers: ['G-WMRK41PX2E', 'sxayts0dzk', 'D3IKI7BC77UEJB9HBO0G'],
      status: 'PASS',
    }),
  );
} finally {
  await page.unrouteAll({ behavior: 'ignoreErrors' });
  await context.close();
  await browser.close();
}
