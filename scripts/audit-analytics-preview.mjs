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

async function savePreferencesWithTikTokWithdrawalAudit() {
  // Capture the provider controls and dispatch the React click in one browser
  // task. TikTok's async SDK cannot replace the proxied provider view in
  // between, which makes this proof deterministic without assuming that the
  // mere presence of events.js means the provider has finished loading.
  return page.evaluate(() => {
    window.__hmpTikTokConsentCalls = [];
    sessionStorage.setItem('__hmpTikTokConsentCalls', '[]');
    const provider = window.ttq;
    const controls = new Set(['revokeConsent', 'disableCookie']);
    if (!provider) {
      throw new Error('TikTok provider is unavailable before withdrawal');
    }
    for (const method of controls) {
      if (typeof provider[method] !== 'function') {
        throw new Error(`TikTok ${method} control is unavailable before withdrawal`);
      }
    }

    // The live SDK exposes consent methods as protected properties, so direct
    // assignment can silently leave its originals in place. Proxy reads made
    // by our hook instead and delegate each call back to the untouched SDK.
    const instrumentedProvider = new Proxy({}, {
      get(_target, property) {
        const value = provider[property];
        if (!controls.has(property) || typeof value !== 'function') {
          return value;
        }
        return (...args) => {
          window.__hmpTikTokConsentCalls.push(property);
          sessionStorage.setItem(
            '__hmpTikTokConsentCalls',
            JSON.stringify(window.__hmpTikTokConsentCalls),
          );
          return Reflect.apply(value, provider, args);
        };
      },
    });
    window.ttq = instrumentedProvider;
    if (window.ttq !== instrumentedProvider) {
      throw new Error('TikTok provider could not be instrumented');
    }

    const saveButton = document.querySelector('[data-testid="button-save-preferences"]');
    if (!(saveButton instanceof HTMLButtonElement)) {
      throw new Error('Cookie preference save button is unavailable');
    }
    saveButton.click();
    return JSON.parse(sessionStorage.getItem('__hmpTikTokConsentCalls') ?? '[]');
  });
}

async function setOptionalConsent(enabled, { auditTikTokWithdrawal = false } = {}) {
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
    : page
        .waitForEvent('framenavigated', (frame) => frame === page.mainFrame())
        .catch((error) => {
          if (page.isClosed()) return null;
          throw error;
        });
  let immediateCalls = null;
  if (auditTikTokWithdrawal) {
    immediateCalls = await savePreferencesWithTikTokWithdrawalAudit();
  } else {
    await page.getByTestId('button-save-preferences').click();
  }
  if (reloadPromise) {
    await reloadPromise;
    await page.waitForLoadState('domcontentloaded');
  }
  if (auditTikTokWithdrawal) {
    assert.deepEqual(
      immediateCalls,
      ['revokeConsent', 'disableCookie'],
      'TikTok withdrawal must synchronously revoke data sharing before disabling cookies',
    );
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

  const acceptedState = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('hmp_cookie_consent') ?? 'null'),
  );
  assert.equal(acceptedState.consent.analytics, true);
  assert.equal(acceptedState.consent.marketing, true);
  const acceptedPageViews = (await dataLayerCommands()).filter(
    (command) => command[0] === 'event' && command[1] === 'page_view',
  );
  assert.equal(acceptedPageViews.length, 1, 'initial acceptance must emit one pageview');

  await setOptionalConsent(false, { auditTikTokWithdrawal: true });
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
    persisted: true,
    analyticsPersisted: true,
    marketingPersisted: true,
  });
  const revokeCalls = await page.evaluate(() =>
    JSON.parse(sessionStorage.getItem('__hmpTikTokConsentCalls') ?? '[]'),
  );
  assert.deepEqual(
    revokeCalls,
    ['revokeConsent', 'disableCookie'],
    'TikTok must revoke data sharing before disabling first-party cookies',
  );

  // The clean document has no TikTok SDK, but retains the provider opt-out
  // marker. Preserve a real array queue while recording the commands our
  // snippet adds so reacceptance proves enableCookie -> grantConsent happens
  // before its first page event.
  await page.evaluate(() => {
    const recordedCalls = JSON.parse(
      sessionStorage.getItem('__hmpTikTokConsentCalls') ?? '[]',
    );
    const queue = [];
    const nativePush = Array.prototype.push;
    queue.push = function recordTikTokQueue(...items) {
      for (const item of items) {
        if (
          Array.isArray(item) &&
          ['enableCookie', 'grantConsent', 'page'].includes(item[0])
        ) {
          recordedCalls.push(item[0]);
        }
      }
      sessionStorage.setItem(
        '__hmpTikTokConsentCalls',
        JSON.stringify(recordedCalls),
      );
      return nativePush.apply(this, items);
    };
    window.ttq = queue;
  });

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
  const restoredCalls = await page.evaluate(() =>
    JSON.parse(sessionStorage.getItem('__hmpTikTokConsentCalls') ?? '[]'),
  );
  const enableCookieIndex = restoredCalls.lastIndexOf('enableCookie');
  const grantConsentIndex = restoredCalls.lastIndexOf('grantConsent');
  const restoredPageIndex = restoredCalls.lastIndexOf('page');
  assert.ok(enableCookieIndex >= 0, 'clean reacceptance must enable TikTok cookies');
  assert.ok(
    enableCookieIndex < grantConsentIndex && grantConsentIndex < restoredPageIndex,
    'clean reacceptance must queue enableCookie, grantConsent and then page',
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

  // Recreate the exact fast-reload boundary: the previous document may close
  // before TikTok's asynchronous SDK consumes the grant queue. The next
  // document must independently queue provider restoration before page().
  await page.addInitScript(() => {
    window.__hmpFreshTikTokConsentCalls = [];
    const queue = [];
    const nativePush = Array.prototype.push;
    queue.push = function recordFreshTikTokQueue(...items) {
      for (const item of items) {
        if (
          Array.isArray(item) &&
          ['enableCookie', 'grantConsent', 'page'].includes(item[0])
        ) {
          window.__hmpFreshTikTokConsentCalls.push(item[0]);
        }
      }
      return nativePush.apply(this, items);
    };
    window.ttq = queue;
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(
    () => window.__hmpFreshTikTokConsentCalls?.length >= 3,
    undefined,
    { timeout: 15_000 },
  );
  assert.deepEqual(
    await page.evaluate(() => window.__hmpFreshTikTokConsentCalls),
    ['enableCookie', 'grantConsent', 'page'],
    'a fresh document must reaffirm TikTok provider consent before its first page event',
  );
  await page.getByTestId('cookie-banner').waitFor({ state: 'hidden' });

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
      freshTikTokRestore: ['enableCookie', 'grantConsent', 'page'],
      providers: ['G-WMRK41PX2E', 'sxayts0dzk', 'D3IKI7BC77UEJB9HBO0G'],
      status: 'PASS',
    }),
  );
} finally {
  await page.unrouteAll({ behavior: 'ignoreErrors' });
  await context.close();
  await browser.close();
}
