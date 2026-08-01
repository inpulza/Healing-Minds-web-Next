import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const previewUrl = process.argv[2];
const oidcToken = process.env.VERCEL_OIDC_TOKEN;

let parsedPreviewUrl;
try {
  parsedPreviewUrl = new URL(previewUrl);
} catch {
  parsedPreviewUrl = null;
}

if (
  !parsedPreviewUrl ||
  parsedPreviewUrl.protocol !== 'https:' ||
  !parsedPreviewUrl.hostname.endsWith('.vercel.app')
) {
  throw new Error('Usage: node --env-file=.env.local scripts/audit-analytics-preview.mjs <preview-url>');
}
if (!oidcToken) {
  throw new Error('VERCEL_OIDC_TOKEN is required; run vercel link for the real project first.');
}

const previewOrigin = parsedPreviewUrl.origin;

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
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
await page.addInitScript(() => {
  window.__hmpConsentEvents = [];
  window.addEventListener('consentChanged', (event) => {
    window.__hmpConsentEvents.push(event.detail);
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
  await page.getByTestId('button-save-preferences').click();
  await page.getByTestId('cookie-banner').waitFor({ state: 'hidden' });
}

try {
  await page.goto(previewUrl, { waitUntil: 'domcontentloaded' });
  assert.equal(new URL(page.url()).hostname.endsWith('.vercel.app'), true);
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
    for (const method of ['revokeConsent', 'disableCookie', 'enableCookie', 'grantConsent']) {
      const original = window.ttq?.[method];
      if (typeof original !== 'function') continue;
      window.ttq[method] = function instrumentedTikTokConsent(...args) {
        window.__hmpTikTokConsentCalls.push(method);
        return original.apply(this, args);
      };
    }
  });

  const acceptedState = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('hmp_cookie_consent') ?? 'null'),
  );
  assert.equal(acceptedState.consent.analytics, true);
  assert.equal(acceptedState.consent.marketing, true);

  await setOptionalConsent(false);
  const rejectedState = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('hmp_cookie_consent') ?? 'null'),
  );
  assert.equal(rejectedState.consent.analytics, false);
  assert.equal(rejectedState.consent.marketing, false);

  const firstPartyDomainCookie = (cookie) =>
    parsedPreviewUrl.hostname.endsWith(cookie.domain.replace(/^\./, ''));
  const providerIdentifier = (cookie) =>
    /^(?:_ga|_gid|_gat|_gcl|_gac|_cl|_ttp$|_ttp_pixel$|_tt_sessionId$|_tt_pixel_session_index$|_tt_appInfo$|ttcsid(?:_|$)|ttclid$)/.test(
      cookie.name,
    );

  // Sample the whole delayed-recreation window, rather than checking only the
  // final instant. A regression at seven or twelve seconds must be observable.
  for (let sample = 0; sample < 60; sample += 1) {
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

    if (sample < 59) {
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
  const revokeCalls = await page.evaluate(() => window.__hmpTikTokConsentCalls);
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
  const restoredCalls = await page.evaluate(() => window.__hmpTikTokConsentCalls);
  assert.ok(restoredCalls.indexOf('enableCookie') >= 0, 'TikTok enableCookie must run on reaccept');
  assert.ok(
    restoredCalls.indexOf('enableCookie') < restoredCalls.indexOf('grantConsent'),
    'TikTok cookies must be enabled before consent is granted again',
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
  assert.equal(pageViews.length, 2, 'accept and reaccept on the same page each emit exactly once');

  assert.ok(requestedUrls.some((url) => url.includes('googletagmanager.com/gtag/js?id=G-WMRK41PX2E')));
  assert.ok(requestedUrls.some((url) => url.includes('clarity.ms')));
  assert.ok(requestedUrls.some((url) => url.includes('analytics.tiktok.com')));
  assert.deepEqual(credentialLeaks, [], 'Preview credentials must never reach third parties');

  console.log(
    JSON.stringify({
      previewUrl,
      consentCycle: 'denied -> accepted -> rejected -> accepted',
      pageViews: pageViews.length,
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
