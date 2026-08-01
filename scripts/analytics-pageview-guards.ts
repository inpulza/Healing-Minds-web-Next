import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import {
  bumpConsentGeneration,
  claimPageView,
  isCurrentPageView,
  markPageViewTracked,
  resetPageViewDedupe,
} from "../client/src/lib/pixel-page-view";

/**
 * Guards for the marketing-pixel page-view dedupe.
 *
 * The hook that uses it (useTikTokPixel) is mounted by App, Footer and several
 * pages at the same time, so each scenario below simulates MULTIPLE mounted
 * instances: every instance observes the same navigation and every instance
 * registers its own consent listener. `instances` counts how many of them would
 * actually fire ttq.page().
 */

const MOUNTED_INSTANCES = 3;

/** How many of N mounted instances would emit a page view for `location`. */
function emissionsFromMountedInstances(location: string, instances = MOUNTED_INSTANCES): number {
  let emissions = 0;
  for (let instance = 0; instance < instances; instance += 1) {
    if (claimPageView(location) !== null) {
      emissions += 1;
    }
  }
  return emissions;
}

/** Consent revocation: guarded by globalConsentRevoked, so it bumps once. */
function revokeConsent(): void {
  bumpConsentGeneration();
}

function checkInitialLoadIsNotDoubleCounted(): void {
  resetPageViewDedupe();

  // The pixel bootstrap snippet fires its own ttq.page() on load.
  markPageViewTracked("/");

  assert.equal(
    emissionsFromMountedInstances("/"),
    0,
    "the route effect must not re-emit the page view the pixel snippet already sent",
  );
}

function checkNavigationEmitsOncePerRoute(): void {
  resetPageViewDedupe();
  markPageViewTracked("/");

  assert.equal(emissionsFromMountedInstances("/es/psiquiatra-california"), 1);
  assert.equal(
    emissionsFromMountedInstances("/es/psiquiatra-california"),
    0,
    "re-renders on the same route must not emit again",
  );
  assert.equal(emissionsFromMountedInstances("/services"), 1);
}

function checkReconsentOnSameRouteEmitsExactlyOnce(): void {
  resetPageViewDedupe();
  markPageViewTracked("/");

  revokeConsent();

  // Every mounted instance has its own consentChanged listener, and all of them
  // run for the same event.
  assert.equal(
    emissionsFromMountedInstances("/"),
    1,
    "re-granting consent on the same route must emit exactly one page view",
  );
}

function checkReconsentWithoutRevocationDoesNotEmit(): void {
  resetPageViewDedupe();
  markPageViewTracked("/");

  // A consentChanged event that only toggles analytics (marketing stays
  // granted) must not manufacture a page view.
  assert.equal(emissionsFromMountedInstances("/"), 0);
}

function checkNavigationWhileRevokedIsCountedOnReconsent(): void {
  resetPageViewDedupe();
  markPageViewTracked("/");

  revokeConsent();
  // Route changes while consent is revoked emit nothing (the hook gates on
  // globalConsentRevoked before calling in), so nothing is recorded.
  const routeAfterRevocation = "/contact";

  assert.equal(
    emissionsFromMountedInstances(routeAfterRevocation),
    1,
    "the page the visitor is on when consent returns must be counted",
  );
  assert.equal(emissionsFromMountedInstances(routeAfterRevocation), 0);
}

/**
 * Pixels defer the actual send to an idle callback, so claiming and sending are
 * not atomic. If the visitor navigates in between, the send must be dropped:
 * ttq.page() reads the CURRENT url, so it would attribute this view to the new
 * route, which claims its own view on top.
 */
function checkDeferredSendIsDroppedAfterNavigation(): void {
  resetPageViewDedupe();
  markPageViewTracked("/");

  const claim = claimPageView("/services");
  assert.ok(claim, "the first instance reacting to the navigation must claim it");

  // The visitor keeps navigating before the idle callback runs.
  assert.ok(claimPageView("/contact"), "the next navigation claims its own view");

  assert.equal(
    isCurrentPageView(claim),
    false,
    "a claim left behind by a navigation must not be sent: it would be attributed to /contact",
  );
}

/**
 * Returning to a route is the case a key-based claim cannot express: A -> B -> A
 * lands on the very same (consent generation, location) pair, so an identity
 * built from that pair alone would declare the ABANDONED first claim for A
 * current again. With the sends deferred past all three navigations that emits
 * two page views for A and none for B.
 */
function checkDeferredSendIsDroppedAfterReturningToTheSameRoute(): void {
  resetPageViewDedupe();
  markPageViewTracked("/");

  const firstVisitToA = claimPageView("/services");
  assert.ok(firstVisitToA, "the first visit to A claims a view");
  const visitToB = claimPageView("/contact");
  assert.ok(visitToB, "B claims its own view");
  const secondVisitToA = claimPageView("/services");
  assert.ok(secondVisitToA, "coming back to A claims a fresh view, not a repeat of the first");

  assert.notEqual(
    firstVisitToA,
    secondVisitToA,
    "two separate visits to the same route must not share a claim token",
  );
  assert.equal(
    isCurrentPageView(firstVisitToA),
    false,
    "the abandoned first visit to A must not send once the visitor has come back to A",
  );
  assert.equal(
    isCurrentPageView(visitToB),
    false,
    "the claim for B must not send after the visitor left B",
  );
  assert.equal(
    isCurrentPageView(secondVisitToA),
    true,
    "the newest claim is the only one allowed to send",
  );

  // Same property over a longer burst: whatever the route order, exactly one
  // outstanding claim may survive it.
  const burst = ["/", "/services", "/", "/contact", "/services", "/"];
  const claims = burst.map((route) => claimPageView(route));
  claims.forEach((claim, index) => {
    assert.ok(claim, `navigation ${index} in the burst must claim its own view`);
    assert.equal(
      isCurrentPageView(claim!),
      index === claims.length - 1,
      `after the burst only the last claim may send (index ${index})`,
    );
  });
}

/** Same window, but the visitor revokes consent instead of navigating. */
function checkDeferredSendIsDroppedAfterRevocation(): void {
  resetPageViewDedupe();

  const claim = claimPageView("/");
  assert.ok(claim);

  revokeConsent();

  assert.equal(
    isCurrentPageView(claim),
    false,
    "a page view claimed before a revocation must not be sent after it",
  );
}

/**
 * The primitives above only help if the hook actually records the entry page,
 * and initialization can finish two ways: injecting the snippet, or finding a
 * pixel another script already loaded. The second path used to bail out early
 * and skip the marking, so the entry page was counted twice. Guard the shape of
 * that function, not just the arithmetic: one marking call, reached by every
 * path that completes initialization.
 */
function checkHookRecordsEntryPageOnEveryInitPath(): void {
  const source = readFileSync(
    new URL("../client/src/hooks/use-tiktok-pixel.ts", import.meta.url),
    "utf8",
  );
  const initStart = source.indexOf("const initTikTokPixel");
  const initEnd = source.indexOf("const revokeTikTokPixel");
  assert.ok(
    initStart > -1 && initEnd > initStart,
    "could not locate initTikTokPixel in use-tiktok-pixel.ts",
  );
  const initBody = source.slice(initStart, initEnd);

  assert.equal(
    (initBody.match(/markPageViewTracked\(/g) ?? []).length,
    1,
    "initTikTokPixel must record the entry page in exactly one place, so no branch can forget it",
  );

  // The "should I initialize at all?" guards legitimately bail out; they run
  // before the timestamp is claimed. From that point on, every path has to reach
  // the marking.
  const afterGuards = initBody.slice(
    initBody.indexOf("globalInitializationTimestamp = currentTimestamp"),
  );
  const beforeMarking = afterGuards.slice(0, afterGuards.indexOf("markPageViewTracked("));
  assert.equal(
    (beforeMarking.match(/\breturn\b/g) ?? []).length,
    0,
    "no early exit may sit between completing initialization and recording the entry page",
  );

  // And the deferred send has to re-check both invalidations, since the claim can
  // go stale between scheduling and running.
  const emitStart = source.indexOf("function emitTikTokPageView");
  const deferred = source.slice(source.indexOf("const send = ", emitStart), source.indexOf("declare global"));
  assert.match(
    deferred,
    /globalConsentRevoked/,
    "the deferred send must re-check consent before calling ttq.page()",
  );
  assert.match(
    deferred,
    /isCurrentPageView\(/,
    "the deferred send must re-check that its claim is still the current route",
  );
}

/**
 * Guard the shape of the claim identity too. The arithmetic scenarios above can
 * be satisfied by accident, but a refactor back to "the dedupe key IS the claim
 * token" would reintroduce the A -> B -> A duplicate, so require the module to
 * mint a distinct token per claim and to compare against that token.
 */
function checkClaimTokensAreMonotonic(): void {
  const source = readFileSync(
    new URL("../client/src/lib/pixel-page-view.ts", import.meta.url),
    "utf8",
  );
  const claimStart = source.indexOf("export function claimPageView");
  const currentStart = source.indexOf("export function isCurrentPageView");
  assert.ok(
    claimStart > -1 && currentStart > claimStart,
    "could not locate claimPageView / isCurrentPageView in pixel-page-view.ts",
  );

  const claimBody = source.slice(claimStart, currentStart);
  assert.match(
    claimBody,
    /claimSeq \+= 1/,
    "every successful claim must advance a monotonic counter, so no two claims share an identity",
  );

  const currentBody = source.slice(currentStart, source.indexOf("export function markPageViewTracked"));
  assert.match(
    currentBody,
    /claim === lastClaimToken/,
    "isCurrentPageView must compare against the newest claim token, not the dedupe key",
  );
  assert.doesNotMatch(
    currentBody,
    /lastTrackedKey/,
    "comparing a claim against the dedupe key resurrects stale claims when a route is revisited",
  );
}

function checkRepeatedConsentCyclesKeepEmittingOnce(): void {
  resetPageViewDedupe();
  markPageViewTracked("/");

  for (let cycle = 0; cycle < 3; cycle += 1) {
    revokeConsent();
    assert.equal(
      emissionsFromMountedInstances("/"),
      1,
      `consent cycle ${cycle + 1} must emit exactly one page view`,
    );
  }
}

function checkLeadMeasurementCoverage(): void {
  const analyticsSource = readFileSync(
    new URL("../client/src/lib/analytics.ts", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(
    analyticsSource,
    /pendingLeadConversions/,
    "outbound leads must not depend on an in-memory queue that is lost during navigation",
  );
  assert.ok(
    analyticsSource.indexOf("window.gtag('config'") <
      analyticsSource.indexOf("window.gtag('event', 'generate_lead'"),
    "the Google destination must be queued before lead events",
  );
  assert.match(analyticsSource, /transport_type: 'beacon'/);
  assert.match(
    analyticsSource,
    /installOutboundLeadTracking[\s\S]*href\.startsWith\('tel:'\)[\s\S]*href\.startsWith\('mailto:'\)[\s\S]*wa\.me\/[\s\S]*charmtracker\.com\/publicCal\.sas/,
    "telephone, email, WhatsApp and CharmHealth links need an exhaustive delegated guard",
  );

  const charmSource = readFileSync(
    new URL("../client/src/components/CharmHealthBooking.tsx", import.meta.url),
    "utf8",
  );
  assert.equal(
    (charmSource.match(/trackLeadConversion\('appointment_booking'/g) ?? []).length,
    4,
    "all four CharmHealth booking variants must emit the GA lead conversion",
  );

  for (const component of ["MobileToolbar.tsx", "Footer.tsx"]) {
    const source = readFileSync(
      new URL(`../client/src/components/${component}`, import.meta.url),
      "utf8",
    );
    assert.match(
      source,
      /trackLeadConversion\('appointment_booking'/,
      `${component} booking must emit the GA lead conversion`,
    );
  }

  const telehealthWidget = readFileSync(
    new URL("../client/src/components/TelehealthVideoWidget.tsx", import.meta.url),
    "utf8",
  );
  assert.match(telehealthWidget, /trackLeadConversion\('appointment_booking'/);
  assert.match(telehealthWidget, /trackLeadConversion\('phone_call'/);

  const california = readFileSync(
    new URL("../client/src/pages/PsiquiatraCalifornia.tsx", import.meta.url),
    "utf8",
  );
  assert.ok(
    (california.match(/trackLeadConversion\('appointment_booking'/g) ?? []).length >= 2,
    "both direct California booking buttons must emit a lead click",
  );

  const florida = readFileSync(
    new URL("../client/src/pages/TelepsychiatryFlorida.tsx", import.meta.url),
    "utf8",
  );
  assert.match(florida, /trackLeadConversion\('appointment_booking'/);

  const naples = readFileSync(
    new URL("../client/src/pages/LocationNaples.tsx", import.meta.url),
    "utf8",
  );
  assert.match(naples, /trackLeadConversion\('phone_call'/);

  const pagesDirectory = new URL("../client/src/pages/", import.meta.url);
  for (const entry of readdirSync(pagesDirectory, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.tsx')) {
      continue;
    }
    const source = readFileSync(new URL(entry.name, pagesDirectory), 'utf8');
    if (/window\.(?:open|location\.href)[\s\S]{0,40}tel:/.test(source)) {
      assert.match(
        source,
        /trackLeadConversion\('phone_call'/,
        `${entry.name} launches a phone call from a button and must record the lead first`,
      );
    }
  }
}

function checkConsentAndTagRegistry(): void {
  const appSource = readFileSync(new URL("../client/src/App.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(appSource, /VITE_GA_MEASUREMENT_ID/);

  const consentContextSource = readFileSync(
    new URL("../client/src/contexts/CookieConsentContext.tsx", import.meta.url),
    "utf8",
  );
  assert.match(consentContextSource, /const saveConsent = useCallback/);
  assert.match(consentContextSource, /const analytics = effective\.analytics/);
  assert.match(consentContextSource, /const marketing = effective\.marketing/);
  assert.match(consentContextSource, /detail: createConsentEventDetail\(/);

  const nextShellSource = readFileSync(
    new URL("../app/public-shell.tsx", import.meta.url),
    "utf8",
  );
  assert.match(nextShellSource, /useClarity\(true\)/);
  assert.match(nextShellSource, /useTikTokPixel\(true\)/);

  const trackingConfigSource = readFileSync(
    new URL("../client/src/lib/tracking-config.ts", import.meta.url),
    "utf8",
  );
  assert.match(trackingConfigSource, /TIKTOK_PIXEL_SITEWIDE_ENABLED = false/);
  assert.doesNotMatch(
    trackingConfigSource,
    /process\.env/,
    'TikTok Pixel cannot be silently re-enabled by a deployment variable',
  );

  const claritySource = readFileSync(
    new URL("../client/src/hooks/use-clarity.ts", import.meta.url),
    "utf8",
  );
  assert.match(claritySource, /useClarity\(manageConsentLifecycle = false\)/);
  assert.match(claritySource, /clearFirstPartyCookies/);
  assert.match(claritySource, /Clarity\.consent\(false\)/);
  assert.match(claritySource, /Clarity\.consent\(true\)/);
  assert.match(
    claritySource,
    /else if \(process\.env\.NODE_ENV === 'production'\) \{\s*revokeClarity\(\)/,
  );

  const tiktokSource = readFileSync(
    new URL("../client/src/hooks/use-tiktok-pixel.ts", import.meta.url),
    "utf8",
  );
  assert.match(tiktokSource, /useTikTokPixel\(manageConsentLifecycle = false\)/);
  assert.match(tiktokSource, /ttq\.revokeConsent\(\)/);
  assert.match(tiktokSource, /ttq\.disableCookie\(\)/);
  assert.match(tiktokSource, /ttq\.enableCookie\(\)/);
  assert.match(tiktokSource, /ttq\.grantConsent\(\)/);
  const enableCookieIndex = tiktokSource.indexOf('ttq.enableCookie()');
  const grantConsentIndex = tiktokSource.indexOf('ttq.grantConsent()');
  const reopenGateIndex = tiktokSource.indexOf(
    'consentRevoked.current = false',
    grantConsentIndex,
  );
  assert.match(tiktokSource, /import \{ TIKTOK_PIXEL_SITEWIDE_ENABLED \}/);
  assert.match(
    tiktokSource,
    /if \(!TIKTOK_PIXEL_SITEWIDE_ENABLED \|\| typeof window === 'undefined'\) return/,
  );
  assert.match(
    tiktokSource,
    /if \(!TIKTOK_PIXEL_SITEWIDE_ENABLED\) \{\s*return;\s*\}/,
    'the initializer must fail closed before touching the provider',
  );
  assert.match(
    tiktokSource,
    /if \(!TIKTOK_PIXEL_SITEWIDE_ENABLED\) \{[\s\S]*?rollbackTikTokProviderConsent\(window\.ttq\);[\s\S]*?clearDisabledTikTokState\(\);[\s\S]*?return;/,
    'the lifecycle manager must revoke and clear legacy state while disabled',
  );
  assert.ok(
    enableCookieIndex >= 0 &&
      enableCookieIndex < grantConsentIndex &&
      grantConsentIndex < reopenGateIndex,
    'TikTok must enable cookies, grant provider consent and only then reopen the local gate',
  );
  const pixelLoadStart = tiktokSource.indexOf('function loadTikTokPixel');
  const pixelLoadEnd = tiktokSource.indexOf('export function useTikTokPixel');
  const pixelLoadSource = tiktokSource.slice(pixelLoadStart, pixelLoadEnd);
  const loadIndex = pixelLoadSource.indexOf('ttq.load(TIKTOK_PIXEL_ID)');
  const restoreIndex = pixelLoadSource.indexOf('restoreTikTokProviderConsent(ttq)');
  const firstPageIndex = pixelLoadSource.indexOf('ttq.page()');
  assert.ok(
    loadIndex >= 0 && loadIndex < restoreIndex && restoreIndex < firstPageIndex,
    'a clean TikTok reacceptance must queue provider restoration before its first page event',
  );
  assert.match(tiktokSource, /initTikTokPixel\(true\)/);
  assert.match(
    tiktokSource,
    /hasMarketingConsent\(\)\) \{[\s\S]*?initTikTokPixel\(true\)/,
    'every fresh document with a persisted marketing grant must reaffirm provider consent',
  );
  const rollbackStart = tiktokSource.indexOf('function rollbackTikTokProviderConsent');
  const rollbackEnd = tiktokSource.indexOf('// Load TikTok Pixel', rollbackStart);
  const rollbackSource = tiktokSource.slice(rollbackStart, rollbackEnd);
  assert.ok(
    rollbackSource.indexOf('ttq.revokeConsent()') >= 0 &&
      rollbackSource.indexOf('ttq.revokeConsent()') < rollbackSource.indexOf('ttq.disableCookie()'),
    'a partial TikTok restoration must revoke provider consent before disabling cookies',
  );
  assert.match(
    tiktokSource,
    /rollbackTikTokProviderConsent\(window\.ttq\);\s*keepTikTokCookiesClearedAfterRevoke\(false\)/,
    'a provider restoration failure must roll back and keep identifier cleanup active',
  );
  const recoveryIndex = tiktokSource.indexOf('if (recoveringProviderConsent)');
  const recoveryPageIndex = tiktokSource.indexOf('window.ttq.page()', recoveryIndex);
  const recoveryMarkIndex = tiktokSource.indexOf(
    'markPageViewTracked(locationRef.current)',
    recoveryPageIndex,
  );
  assert.ok(
    recoveryIndex >= 0 &&
      recoveryIndex < recoveryPageIndex &&
      recoveryPageIndex < recoveryMarkIndex,
    'a recovered TikTok restoration must emit the missed page before marking the route tracked',
  );
  assert.match(tiktokSource, /clearFirstPartyCookies/);
  for (const cookieName of ["ttcsid", "ttcsid_", "ttclid"]) {
    assert.match(tiktokSource, new RegExp(cookieName));
  }
  assert.match(tiktokSource, /window\.setInterval/);
  assert.match(tiktokSource, /POST_REVOKE_CLEANUP_WINDOW_MS = 6000/);
  assert.match(tiktokSource, /reloadAfterLoadedPixelRevoke/);
  assert.match(tiktokSource, /window\.location\.reload\(\)/);
  const stopCleanupStart = tiktokSource.indexOf('function stopPostRevokeCookieCleanup');
  const stopCleanupEnd = tiktokSource.indexOf(
    'function cancelPostRevokeReload',
    stopCleanupStart,
  );
  assert.doesNotMatch(
    tiktokSource.slice(stopCleanupStart, stopCleanupEnd),
    /postRevokeReloadTimeout/,
    'a duplicate withdrawal cleanup must not cancel an already-scheduled clean reload',
  );
  assert.match(tiktokSource, /function cancelPostRevokeReload\(\)/);
  assert.match(
    tiktokSource,
    /restoreTikTokProviderConsent\(window\.ttq\);\s*stopPostRevokeCookieCleanup\(\);\s*cancelPostRevokeReload\(\)/,
    'successful provider restoration must explicitly cancel any pending withdrawal reload',
  );
  assert.match(
    tiktokSource,
    /const shouldReload =\s*persistenceSucceeded &&\s*globalTikTokSdkLoaded &&\s*postRevokeReloadTimeout === null/,
    'only a persisted withdrawal with a loaded Pixel and no pending reload may schedule the clean reload',
  );
  assert.match(tiktokSource, /let globalTikTokSdkLoaded = false/);
  assert.match(
    tiktokSource,
    /ttq\.load\(TIKTOK_PIXEL_ID\);\s*globalTikTokSdkLoaded = true/,
    'injecting the provider must record SDK presence independently from consent readiness',
  );
  assert.match(
    tiktokSource,
    /if \(alreadyLoaded\) \{\s*globalTikTokSdkLoaded = true;\s*if \(restoreProviderConsent\)/,
    'an existing provider must stay marked as loaded even when consent restoration throws',
  );
  assert.match(
    tiktokSource,
    /globalConsentRevoked && !hasMarketingConsent\(\)/,
    'a queued reload must be cancelled logically if consent is restored',
  );
  const clearTikTokStart = tiktokSource.indexOf('function clearTikTokCookies');
  const clearTikTokEnd = tiktokSource.indexOf('function clearDisabledTikTokState');
  const clearTikTokSource = tiktokSource.slice(clearTikTokStart, clearTikTokEnd);
  assert.doesNotMatch(
    clearTikTokSource,
    /_tt_enable_cookie/,
    'the TikTok opt-out marker must survive identifier cleanup',
  );
  const clearDisabledTikTokStart = clearTikTokEnd;
  const clearDisabledTikTokEnd = tiktokSource.indexOf(
    'function stopPostRevokeCookieCleanup',
    clearDisabledTikTokStart,
  );
  assert.match(
    tiktokSource.slice(clearDisabledTikTokStart, clearDisabledTikTokEnd),
    /_tt_enable_cookie/,
    'sitewide shutdown must remove the legacy TikTok opt-out marker too',
  );
  assert.match(
    tiktokSource,
    /if \(!globalConsentRevoked\) \{\s*stopPostRevokeCookieCleanup\(\)/,
    "post-revoke cleanup must stop immediately after successful re-consent",
  );
  assert.match(
    tiktokSource,
    /keepTikTokCookiesClearedAfterRevoke\(persistenceSucceeded\)/,
    "a failed rejection write must keep the current document fail-closed",
  );
  assert.match(
    tiktokSource,
    /const persistenceSucceeded = marketingPersisted \?\? persisted !== false/,
    'TikTok cleanup expiry must use marketing-specific persistence',
  );
  assert.match(
    tiktokSource,
    /else if \(process\.env\.NODE_ENV === 'production'\) \{\s*revokeTikTokPixel\(\)/,
  );

  const cleanupSource = readFileSync(
    new URL("../client/src/lib/cookie-cleanup.ts", import.meta.url),
    "utf8",
  );
  assert.match(cleanupSource, /PRODUCTION_COOKIE_DOMAIN = 'healingmindsp\.com'/);
  assert.match(cleanupSource, /currentHostname/);
  assert.match(cleanupSource, /new Set\(\[currentHostname, `\.\$\{currentHostname\}`\]\)/);
  assert.doesNotMatch(cleanupSource, /vercel\.app/);

  const analyticsSource = readFileSync(
    new URL("../client/src/lib/analytics.ts", import.meta.url),
    "utf8",
  );
  assert.match(analyticsSource, /let inMemoryAnalyticsConsent: boolean \| null = null/);
  assert.match(analyticsSource, /inMemoryAnalyticsConsent \?\? readConsent\('analytics'\)/);
  const consentHandlerStart = analyticsSource.indexOf('export function handleConsentChange');
  const consentHandlerSource = analyticsSource.slice(consentHandlerStart);
  const inMemoryGateIndex = consentHandlerSource.indexOf(
    'inMemoryAnalyticsConsent = analyticsConsent',
  );
  const googleProviderUpdateIndex = consentHandlerSource.indexOf(
    'updateGoogleConsent(analyticsConsent, marketingConsent)',
  );
  assert.ok(
    inMemoryGateIndex >= 0 && inMemoryGateIndex < googleProviderUpdateIndex,
    'effective in-memory consent must close Google before provider updates or later emitters',
  );
  assert.match(
    consentHandlerSource,
    /try \{\s*clearAnalyticsCookies\(\);[\s\S]*?try \{\s*clearAdvertisingCookies\(\);/,
    'provider exceptions must not skip local analytics or advertising cookie cleanup',
  );
  assert.match(
    analyticsSource,
    /const leadKey = source/,
    "explicit and delegated handlers can label one click differently, so dedupe must use source",
  );
  for (const cookieName of ["_ga", "_gcl_au", "_gcl_aw"]) {
    assert.match(analyticsSource, new RegExp(cookieName));
  }
  assert.match(
    analyticsSource,
    /if \(!analyticsConsent\) \{\s*clearAnalyticsCookies\(\)/,
  );
  assert.match(analyticsSource, /custom_1: serviceName/);
  assert.match(analyticsSource, /custom_2: language/);

  const bannerSource = readFileSync(
    new URL("../client/src/components/CookieBanner.tsx", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(bannerSource, /TikTok Pixel/);
  assert.match(bannerSource, /Google Ads, conversion measurement, remarketing/);
  assert.doesNotMatch(bannerSource, /Facebook Pixel/);
  assert.match(bannerSource, /z-\[10000\]/);
  assert.match(bannerSource, /overlayClassName="z-\[10001\]"/);
  assert.match(bannerSource, /className="z-\[10002\]/);
  assert.match(bannerSource, /if \(!isHydrated\) \{\s*return null/);

  assert.match(consentContextSource, /const \[isHydrated, setIsHydrated\] = useState\(false\)/);
  assert.match(consentContextSource, /finally \{\s*setIsHydrated\(true\)/);
  assert.match(consentContextSource, /function removeStoredConsentSafely\(\): boolean/);
  assert.match(
    consentContextSource,
    /catch \(error\) \{[\s\S]*?removeStoredConsentSafely\(\);[\s\S]*?finally \{/,
    'privacy-restricted storage must still reach the hydrated default state',
  );
  assert.match(consentContextSource, /window\.addEventListener\('storage', handleStorage\)/);
  assert.match(
    consentContextSource,
    /const currentValue = localStorage\.getItem\(STORAGE_KEY\);[\s\S]*?if \(currentValue !== event\.newValue\) \{\s*persistedValue = currentValue/,
    'a queued cross-tab event must not override a newer value already persisted by this tab',
  );
  assert.match(
    consentContextSource,
    /setConsentState\(nextState\);[\s\S]*?detail: createConsentEventDetail\([\s\S]*?nextState\.consent,[\s\S]*?!hasFailedLocalRevocation,[\s\S]*?analytics: !failedLocalRevocations\.analytics,[\s\S]*?marketing: !failedLocalRevocations\.marketing/,
    'cross-tab storage changes must update the UI and rebroadcast the effective provider decision',
  );
  assert.match(consentContextSource, /failedLocalRevocationsRef/);
  assert.match(
    consentContextSource,
    /failedLocalRevocations\.analytics[\s\S]*?analytics: failedLocalRevocations\.analytics[\s\S]*?marketing: failedLocalRevocations\.marketing/,
    'queued remote grants must preserve categories from a failed local withdrawal',
  );
  assert.match(
    consentContextSource,
    /localStorage\.setItem\(STORAGE_KEY, JSON\.stringify\(newState\)\);\s*failedLocalRevocationsRef\.current = \{ analytics: false, marketing: false \}/,
    'only a successfully persisted local choice may clear the local withdrawal watermark',
  );
  assert.match(
    consentContextSource,
    /previousEffectiveConsent\.analytics && !newState\.consent\.analytics/,
    'an unchanged denied category must not be misclassified as a failed local withdrawal',
  );
  assert.match(consentContextSource, /const effectiveConsentRef = useRef<CookieConsent>/);
  assert.match(
    consentContextSource,
    /const previousEffectiveConsent = effectiveConsentRef\.current;[\s\S]*?effectiveConsentRef\.current = effectiveConsent/,
    'repeated failed grants must be evaluated against the last effective decision, not draft UI state',
  );
  assert.match(
    consentContextSource,
    /previousEffectiveConsent\.marketing === newState\.consent\.marketing/,
    'a repeated unpersisted marketing grant must remain marked as unpersisted',
  );
  assert.match(
    consentContextSource,
    /setConsentState\(\{ \.\.\.newState, consent: saveResult\.effectiveConsent \}\)/,
    'the preferences UI must reflect the effective decision after a failed write',
  );
  assert.match(consentContextSource, /analyticsPersisted: categoryPersistence\.analytics/);
  assert.match(consentContextSource, /marketingPersisted: categoryPersistence\.marketing/);

  const dialogSource = readFileSync(
    new URL("../client/src/components/ui/dialog.tsx", import.meta.url),
    "utf8",
  );
  assert.match(dialogSource, /overlayClassName\?: string/);
  assert.match(dialogSource, /fixed inset-0 z-50/);
  assert.doesNotMatch(dialogSource, /fixed inset-0 z-\[10001\]/);

  const footerSource = readFileSync(
    new URL("../client/src/components/Footer.tsx", import.meta.url),
    "utf8",
  );
  assert.match(footerSource, /footer-cookie-preferences/);
  assert.match(footerSource, /onClick=\{showPreferences\}/);

  const policySource = readFileSync(
    new URL("../client/src/data/pageContent/legal/cookiePolicy.ts", import.meta.url),
    "utf8",
  );
  assert.match(policySource, /TikTok Pixel is currently disabled across this Site/);
  assert.match(policySource, /TikTok Pixel está actualmente desactivado en todo este Sitio/);
  assert.doesNotMatch(policySource, /third-party cookies remain under TikTok's control/);

  const privacyPolicySource = readFileSync(
    new URL("../client/src/data/pageContent/legal/privacyPolicy.ts", import.meta.url),
    "utf8",
  );
  assert.match(privacyPolicySource, /web hosting \(Vercel\)/);
  assert.match(privacyPolicySource, /domain registration and DNS management \(Hostinger\)/);

  const environmentGuard = readFileSync(
    new URL("./verify-public-analytics-config.mjs", import.meta.url),
    "utf8",
  );
  assert.match(environmentGuard, /G-WMRK41PX2E/);
  assert.match(environmentGuard, /G-42LWDS101X/);
}

function main(): void {
  checkInitialLoadIsNotDoubleCounted();
  checkNavigationEmitsOncePerRoute();
  checkReconsentOnSameRouteEmitsExactlyOnce();
  checkReconsentWithoutRevocationDoesNotEmit();
  checkNavigationWhileRevokedIsCountedOnReconsent();
  checkRepeatedConsentCyclesKeepEmittingOnce();
  checkDeferredSendIsDroppedAfterNavigation();
  checkDeferredSendIsDroppedAfterReturningToTheSameRoute();
  checkDeferredSendIsDroppedAfterRevocation();
  checkHookRecordsEntryPageOnEveryInitPath();
  checkClaimTokensAreMonotonic();
  checkLeadMeasurementCoverage();
  checkConsentAndTagRegistry();

  console.log(
    `Page-view dedupe guards passed with ${MOUNTED_INSTANCES} mounted instances: `
    + "no double count on initial load, one emission per navigation, exactly one "
    + "replay per consent revoke/re-grant cycle, deferred sends dropped after a "
    + "navigation, a revocation or a return to an earlier route, claim tokens "
    + "monotonic, and every init path in the hook records the entry page.",
  );
}

main();
