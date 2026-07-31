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
      ...['_ga', '_ga_WMRK41PX2E', '_gcl_au', '_clck', '_ttp'].map((name) => ({
        name,
        value: 'root-cookie',
        domain: '.healingmindsp.com',
        path: '/',
        secure: true,
        sameSite: 'Lax',
      })),
      ...['_gid', '_gcl_aw', '_clsk', '_tt_enable_cookie'].map((name) => ({
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
        ],
        prefixes: ['_ga_', '_gcl_', '_gac_'],
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
      window.HmpAnalytics.trackLeadConversion('phone_call', {
        click_location: 'browser_guard',
      });
      window.HmpAnalytics.trackLeadConversion('phone_call', {
        click_location: 'browser_guard',
      });
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
    assert.equal(leadCommands.length, 1, 'explicit and delegated handlers must not double count');
    assert.equal(leadCommands[0][2].transport_type, 'beacon');
  } finally {
    await context.close();
    await browser.close();
  }
});
