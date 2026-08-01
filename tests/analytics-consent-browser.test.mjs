import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'esbuild';
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';

async function bundleBrowserModule(entryPoint, globalName) {
  const result = await build({
    entryPoints: [entryPoint],
    bundle: true,
    write: false,
    format: 'iife',
    globalName,
    platform: 'browser',
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID': JSON.stringify('G-WMRK41PX2E'),
    },
  });
  return result.outputFiles[0].text;
}

test('consent cleanup removes first-party provider cookies at the canonical domain', async () => {
  const cleanupBundle = await bundleBrowserModule(
    fileURLToPath(new URL('../client/src/lib/cookie-cleanup.ts', import.meta.url)),
    'CookieCleanup',
  );
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  try {
    await context.addCookies([
      ...['_ga', '_ga_WMRK41PX2E', '_gcl_au', '_clck', '_ttp', 'ttcsid', 'ttclid'].map((name) => ({
        name,
        value: 'root-cookie',
        domain: '.healingmindsp.com',
        path: '/',
        secure: true,
        sameSite: 'Lax',
      })),
      ...['_gid', '_gcl_aw', '_clsk', '_tt_enable_cookie', 'ttcsid_D3IKI7BC77UEJB9HBO0G'].map((name) => ({
        name,
        value: 'host-cookie',
        url: 'https://www.healingmindsp.com/',
      })),
      {
        name: '_ttp',
        value: 'third-party-cookie',
        domain: '.tiktok.com',
        path: '/',
        secure: true,
        sameSite: 'None',
      },
    ]);

    const page = await context.newPage();
    await page.route('https://www.healingmindsp.com/**', (route) =>
      route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Cookie test</title>' }),
    );
    await page.goto('https://www.healingmindsp.com/cookie-test');
    await page.addScriptTag({ content: cleanupBundle });
    await page.evaluate(() => {
      window.CookieCleanup.clearFirstPartyCookies({
        exactNames: [
          '_ga',
          '_gid',
          '_gcl_au',
          '_gcl_aw',
          '_clck',
          '_clsk',
          '_ttp',
          '_tt_enable_cookie',
          'ttcsid',
          'ttclid',
        ],
        prefixes: ['_ga_', '_gcl_', '_gac_', 'ttcsid_'],
      });
    });

    const remainingCookies = await context.cookies();
    const remainingFirstParty = remainingCookies.filter((cookie) =>
      cookie.domain.endsWith('healingmindsp.com'),
    );
    assert.deepEqual(remainingFirstParty, []);
    assert.ok(
      remainingCookies.some(
        (cookie) => cookie.name === '_ttp' && cookie.domain.endsWith('tiktok.com'),
      ),
      'a site cannot delete TikTok third-party cookies; revokeConsent handles that provider state',
    );
  } finally {
    await context.close();
    await browser.close();
  }
});

test('consent cleanup removes provider domain cookies on a preview host', async () => {
  const cleanupBundle = await bundleBrowserModule(
    fileURLToPath(new URL('../client/src/lib/cookie-cleanup.ts', import.meta.url)),
    'CookieCleanup',
  );
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const previewHost = 'healing-minds-psychiatry-nextjs-test.vercel.app';

  try {
    await context.addCookies(
      ['_ga', '_ga_WMRK41PX2E', '_gcl_au', '_ttp', 'ttcsid', 'ttcsid_D3IKI7BC77UEJB9HBO0G'].map(
        (name) => ({
          name,
          value: 'preview-domain-cookie',
          domain: `.${previewHost}`,
          path: '/',
          secure: true,
          sameSite: 'Lax',
        }),
      ),
    );

    const page = await context.newPage();
    await page.route(`https://${previewHost}/**`, (route) =>
      route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Preview cookie test</title>' }),
    );
    await page.goto(`https://${previewHost}/cookie-test`);
    await page.addScriptTag({ content: cleanupBundle });
    await page.evaluate(() => {
      window.CookieCleanup.clearFirstPartyCookies({
        exactNames: ['_ga', '_gcl_au', '_ttp', 'ttcsid'],
        prefixes: ['_ga_', 'ttcsid_'],
      });
    });

    const remainingPreviewCookies = (await context.cookies()).filter(
      (cookie) => cookie.domain.replace(/^\./, '') === previewHost,
    );
    assert.deepEqual(remainingPreviewCookies, []);
  } finally {
    await context.close();
    await browser.close();
  }
});

test('Google config is queued before one deduplicated outbound lead event', async () => {
  const analyticsBundle = await bundleBrowserModule(
    fileURLToPath(new URL('../client/src/lib/analytics.ts', import.meta.url)),
    'HmpAnalytics',
  );
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  try {
    const page = await context.newPage();
    await page.route('https://www.healingmindsp.com/**', (route) =>
      route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Analytics test</title>' }),
    );
    await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
    await page.goto('https://www.healingmindsp.com/analytics-test');
    await page.evaluate(() => {
      localStorage.setItem(
        'hmp_cookie_consent',
        JSON.stringify({
          hasConsented: true,
          consent: { necessary: true, analytics: true, marketing: true },
        }),
      );
    });
    await page.addScriptTag({ content: analyticsBundle });

    const commands = await page.evaluate(() => {
      window.HmpAnalytics.initGA();
      const removeDelegatedTracking = window.HmpAnalytics.installOutboundLeadTracking();
      const phoneLink = document.createElement('a');
      phoneLink.href = 'tel:+12394230272';
      phoneLink.id = 'delegated_browser_guard';
      phoneLink.addEventListener('click', (event) => {
        event.preventDefault();
        window.HmpAnalytics.trackLeadConversion('phone_call', {
          click_location: 'explicit_browser_guard',
        });
      });
      document.body.appendChild(phoneLink);
      phoneLink.click();

      const hotlineLink = document.createElement('a');
      hotlineLink.href = 'tel:+18009853059';
      hotlineLink.id = 'federal_hotline';
      hotlineLink.addEventListener('click', (event) => event.preventDefault());
      document.body.appendChild(hotlineLink);
      hotlineLink.click();

      removeDelegatedTracking();
      return window.dataLayer.map((entry) => Array.from(entry));
    });

    const configIndex = commands.findIndex(
      (command) => command[0] === 'config' && command[1] === 'G-WMRK41PX2E',
    );
    const leadCommands = commands.filter(
      (command) => command[0] === 'event' && command[1] === 'generate_lead',
    );
    const leadIndex = commands.findIndex(
      (command) => command[0] === 'event' && command[1] === 'generate_lead',
    );

    assert.ok(configIndex >= 0, 'the real GA destination must be configured');
    assert.ok(configIndex < leadIndex, 'configuration must precede the outbound lead');
    assert.equal(
      leadCommands.length,
      1,
      'one real click with different explicit/delegated locations must not double count',
    );
    assert.notEqual(
      leadCommands[0][2].click_location,
      'federal_hotline',
      'a federal assistance line must not be reported as a clinic lead',
    );
    assert.equal(leadCommands[0][2].transport_type, 'beacon');
  } finally {
    await context.close();
    await browser.close();
  }
});

test('a persisted rejection clears inherited Google analytics and advertising cookies on load', async () => {
  const analyticsBundle = await bundleBrowserModule(
    fileURLToPath(new URL('../client/src/lib/analytics.ts', import.meta.url)),
    'HmpAnalytics',
  );
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  try {
    await context.addCookies(
      ['_ga', '_ga_WMRK41PX2E', '_gcl_au', '_gcl_aw'].map((name) => ({
        name,
        value: 'legacy-cookie',
        domain: '.healingmindsp.com',
        path: '/',
        secure: true,
        sameSite: 'Lax',
      })),
    );
    await context.addInitScript(() => {
      localStorage.setItem(
        'hmp_cookie_consent',
        JSON.stringify({
          hasConsented: true,
          consent: { necessary: true, analytics: false, marketing: false },
        }),
      );
    });

    const page = await context.newPage();
    await page.route('https://www.healingmindsp.com/**', (route) =>
      route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Reject test</title>' }),
    );
    await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
    await page.goto('https://www.healingmindsp.com/rejected-consent');
    await page.addScriptTag({ content: analyticsBundle });
    await page.evaluate(() => window.HmpAnalytics.initGA());

    const inheritedCookies = (await context.cookies()).filter(
      (cookie) =>
        cookie.domain.endsWith('healingmindsp.com') &&
        (cookie.name.startsWith('_ga') || cookie.name.startsWith('_gcl')),
    );
    assert.deepEqual(inheritedCookies, []);
  } finally {
    await context.close();
    await browser.close();
  }
});
