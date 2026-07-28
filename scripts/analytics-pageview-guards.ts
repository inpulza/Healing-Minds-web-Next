import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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

  console.log(
    `Page-view dedupe guards passed with ${MOUNTED_INSTANCES} mounted instances: `
    + "no double count on initial load, one emission per navigation, exactly one "
    + "replay per consent revoke/re-grant cycle, deferred sends dropped after a "
    + "navigation, a revocation or a return to an earlier route, claim tokens "
    + "monotonic, and every init path in the hook records the entry page.",
  );
}

main();
