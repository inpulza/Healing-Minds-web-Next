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

const tiktokCookiePattern =
  /^(?:_ttp|_tt_enable_cookie|_ttp_pixel|_tt_sessionId|_tt_pixel_session_index|_tt_appInfo|ttcsid(?:_|$)|ttclid$)/;
const tiktokNetworkPattern =
  /^https:\/\/[^/]*(?:tiktok\.com|tiktokcdn(?:-us)?\.com|byteoversea\.com|ibytedtos\.com|muscdn\.com)\//i;

function isTikTokPixelUrl(rawUrl) {
  return tiktokNetworkPattern.test(rawUrl);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  storageState,
});

// Simulate identifiers left by the previously active Pixel. The disabled
// lifecycle must remove every one without loading TikTok.
await context.addCookies(
  [
    '_ttp',
    '_tt_enable_cookie',
    '_ttp_pixel',
    '_tt_sessionId',
    '_tt_pixel_session_index',
    '_tt_appInfo',
    'ttcsid',
    'ttcsid_D3IKI7BC77UEJB9HBO0G',
    'ttclid',
  ].map((name) => ({ name, value: 'legacy-preview-audit', url: previewOrigin })),
);

const page = await context.newPage();
const requestedUrls = [];
const tiktokRequests = [];
const credentialLeaks = [];
page.on('request', (request) => {
  requestedUrls.push(request.url());
  if (isTikTokPixelUrl(request.url())) tiktokRequests.push(request.url());
  if (new URL(request.url()).origin === previewOrigin) return;
  const headers = request.headers();
  if (headers['x-vercel-trusted-oidc-idp-token']) credentialLeaks.push(request.url());
});

// A regression must be observable but must not send a synthetic clinical-site
// visit to TikTok while this audit is proving that the Pixel is disabled.
await page.route(tiktokNetworkPattern, async (route) => {
  await route.abort();
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
  window.__hmpClarityConsentCalls = JSON.parse(
    sessionStorage.getItem('__hmpClarityConsentCalls') ?? '[]',
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

async function footerPreferencesButton() {
  const button = page.getByTestId('footer-cookie-preferences');
  for (let attempt = 0; attempt < 12 && (await button.count()) === 0; attempt += 1) {
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(400);
  }
  await button.waitFor({ state: 'visible', timeout: 10_000 });
  return button;
}

async function footerLink(href) {
  const link = page.locator(`footer a[href="${href}"]`).first();
  for (let attempt = 0; attempt < 12 && (await link.count()) === 0; attempt += 1) {
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(400);
  }
  await link.waitFor({ state: 'visible', timeout: 10_000 });
  return link;
}

async function savePreferencesWithClarityConsentAudit(expected) {
  const calls = await page.evaluate(() => {
    const provider = window.clarity;
    if (typeof provider !== 'function') {
      throw new Error('Clarity provider is unavailable before the consent change');
    }
    const recorded = window.__hmpClarityConsentCalls ?? [];
    window.__hmpClarityConsentCalls = recorded;
    const instrumented = (...args) => {
      if (args[0] === 'consent') {
        recorded.push(Boolean(args[1]));
        sessionStorage.setItem('__hmpClarityConsentCalls', JSON.stringify(recorded));
      }
      return Reflect.apply(provider, window, args);
    };
    window.clarity = instrumented;
    if (window.clarity !== instrumented) {
      throw new Error('Clarity provider could not be instrumented');
    }
    const saveButton = document.querySelector('[data-testid="button-save-preferences"]');
    if (!(saveButton instanceof HTMLButtonElement)) {
      throw new Error('Cookie preference save button is unavailable');
    }
    saveButton.click();
    if (window.clarity === instrumented) window.clarity = provider;
    return recorded;
  });
  assert.equal(calls.at(-1), expected, `Clarity must receive consent(${expected})`);
}

async function setOptionalConsent(enabled, { auditClarityConsent = false } = {}) {
  const preferencesButton = await footerPreferencesButton();
  await preferencesButton.click();
  await page.getByTestId('cookie-preferences-modal').waitFor({ state: 'visible' });
  for (const category of ['analytics', 'marketing']) {
    const toggle = page.getByTestId(`switch-${category}`);
    const isEnabled = (await toggle.getAttribute('data-state')) === 'checked';
    if (isEnabled !== enabled) await toggle.click();
  }
  if (auditClarityConsent) {
    await savePreferencesWithClarityConsentAudit(enabled);
  } else {
    await page.getByTestId('button-save-preferences').click();
  }
  await page.getByTestId('cookie-preferences-modal').waitFor({ state: 'hidden' });
  await page.getByTestId('cookie-banner').waitFor({ state: 'hidden' });
}

async function currentProviderIdentifiers() {
  const firstPartyDomainCookie = (cookie) =>
    parsedPreviewUrl.hostname.endsWith(cookie.domain.replace(/^\./, ''));
  return (await context.cookies())
    .filter(firstPartyDomainCookie)
    .filter((cookie) =>
      /^(?:_ga|_gid|_gat|_gcl|_gac|_cl|_ttp|_tt_enable_cookie|_tt_sessionId|_tt_pixel_session_index|_tt_appInfo|ttcsid(?:_|$)|ttclid$)/.test(
        cookie.name,
      ),
    )
    .map(({ name, domain }) => ({ name, domain }));
}

async function assertTikTokDisabled(stage) {
  assert.deepEqual(tiktokRequests, [], `${stage}: TikTok Pixel made a network request`);
  assert.equal(
    await page.locator('script[src*="analytics.tiktok.com"], script[src*="/i18n/pixel/"]').count(),
    0,
    `${stage}: TikTok Pixel injected a script`,
  );
  assert.equal(
    await page.evaluate(() => typeof window.ttq),
    'undefined',
    `${stage}: TikTok Pixel created window.ttq`,
  );
  assert.deepEqual(
    (await context.cookies())
      .filter((cookie) => tiktokCookiePattern.test(cookie.name))
      .map(({ name, domain }) => ({ name, domain })),
    [],
    `${stage}: TikTok Pixel left first-party state`,
  );
}

try {
  await page.goto(previewUrl, { waitUntil: 'domcontentloaded' });
  assert.equal(new URL(page.url()).origin, previewOrigin);
  assert.notEqual(new URL(page.url()).hostname, 'vercel.com', 'preview auth was not bypassed');

  const banner = page.getByTestId('cookie-banner');
  await banner.waitFor({ state: 'visible' });
  await page.waitForFunction(
    () => (window.dataLayer ?? []).some((entry) => Array.from(entry)[0] === 'config'),
    undefined,
    { timeout: 10_000 },
  );
  for (let attempt = 0; attempt < 20 && (await currentProviderIdentifiers()).length > 0; attempt += 1) {
    await page.waitForTimeout(250);
  }

  assert.equal(
    await page.locator('script[src*="clarity.ms"]').count(),
    0,
    'Clarity must not load before analytics consent',
  );
  await assertTikTokDisabled('initial denied state');

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
  await page.setViewportSize({ width: 1440, height: 1000 });

  // A real click also proves the banner is above the floating telehealth widget.
  await page.getByTestId('button-accept-all').click();
  await banner.waitFor({ state: 'hidden' });
  await page.locator('script[src*="clarity.ms/tag/sxayts0dzk"]').waitFor({ timeout: 15_000 });
  await assertTikTokDisabled('accepted state');

  const acceptedState = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('hmp_cookie_consent') ?? 'null'),
  );
  assert.equal(acceptedState.consent.analytics, true);
  assert.equal(acceptedState.consent.marketing, true);
  const acceptedPageViews = (await dataLayerCommands()).filter(
    (command) => command[0] === 'event' && command[1] === 'page_view',
  ).length;
  assert.equal(acceptedPageViews, 1, 'initial acceptance must emit one pageview');

  await (await footerLink('/about')).click();
  await page.waitForURL(/\/about$/);
  await page.waitForFunction(
    (expected) =>
      (window.dataLayer ?? []).filter(
        (entry) => Array.from(entry)[0] === 'event' && Array.from(entry)[1] === 'page_view',
      ).length === expected,
    acceptedPageViews + 1,
  );
  await assertTikTokDisabled('accepted SPA navigation');

  await setOptionalConsent(false, { auditClarityConsent: true });
  const rejectedState = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('hmp_cookie_consent') ?? 'null'),
  );
  assert.equal(rejectedState.consent.analytics, false);
  assert.equal(rejectedState.consent.marketing, false);

  // Sample the delayed recreation window. Loaded GA/Clarity code must not
  // recreate identifiers after a persisted withdrawal.
  for (let sample = 0; sample <= 60; sample += 1) {
    assert.deepEqual(
      await currentProviderIdentifiers(),
      [],
      `provider identifiers reappeared ${sample * 500}ms after revocation`,
    );
    await assertTikTokDisabled(`withdrawal sample ${sample}`);
    if (sample < 60) await page.waitForTimeout(500);
  }

  const consentEvents = await page.evaluate(() => window.__hmpConsentEvents);
  assert.deepEqual(consentEvents.at(-1), {
    analytics: false,
    marketing: false,
    hasAnalyticsConsent: false,
    hasMarketingConsent: false,
    persisted: true,
    analyticsPersisted: true,
    marketingPersisted: true,
  });

  const deniedPageViews = (await dataLayerCommands()).filter(
    (command) => command[0] === 'event' && command[1] === 'page_view',
  ).length;
  await (await footerLink('/')).click();
  await page.waitForURL(/\/$/);
  await page.waitForTimeout(250);
  assert.equal(
    (await dataLayerCommands()).filter(
      (command) => command[0] === 'event' && command[1] === 'page_view',
    ).length,
    deniedPageViews,
    'denied navigation must not emit a pageview',
  );

  await setOptionalConsent(true, { auditClarityConsent: true });
  await page.waitForFunction(
    (expected) =>
      (window.dataLayer ?? []).filter(
        (entry) => Array.from(entry)[0] === 'event' && Array.from(entry)[1] === 'page_view',
      ).length === expected,
    deniedPageViews + 1,
  );
  await assertTikTokDisabled('reaccepted state');

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

  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByTestId('cookie-banner').waitFor({ state: 'hidden' });
  await page.locator('script[src*="clarity.ms/tag/sxayts0dzk"]').waitFor({ timeout: 15_000 });
  await assertTikTokDisabled('persisted accepted reload');
  const reloadedPageViews = (await dataLayerCommands()).filter(
    (command) => command[0] === 'event' && command[1] === 'page_view',
  ).length;
  assert.equal(reloadedPageViews, 1, 'persisted accepted reload must emit one pageview');

  assert.ok(
    requestedUrls.some((url) => url.includes('googletagmanager.com/gtag/js?id=G-WMRK41PX2E')),
  );
  assert.ok(
    requestedUrls.some((url) => /clarity\.ms\/tag\/sxayts0dzk/i.test(url)),
    'the exact Clarity project must load',
  );
  assert.deepEqual(tiktokRequests, [], 'TikTok Pixel must remain disabled sitewide');
  assert.deepEqual(credentialLeaks, [], 'Preview credentials must never reach third parties');

  console.log(
    JSON.stringify({
      previewUrl,
      consentCycle: 'denied -> accepted -> rejected -> accepted',
      pageViewsBeforeReload: deniedPageViews + 1,
      pageViewsAfterReload: reloadedPageViews,
      leadEventsForOneClick: leadsAfter - leadsBefore,
      providers: ['G-WMRK41PX2E', 'sxayts0dzk'],
      clarityConsentCalls: await page.evaluate(() => window.__hmpClarityConsentCalls),
      tiktokPixel: { id: 'D3IKI7BC77UEJB9HBO0G', status: 'disabled-sitewide', requests: 0 },
      status: 'PASS',
    }),
  );
} finally {
  await page.unrouteAll({ behavior: 'ignoreErrors' });
  await context.close();
  await browser.close();
}
