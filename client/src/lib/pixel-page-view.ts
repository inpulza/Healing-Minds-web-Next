/**
 * Cross-instance page-view dedupe for marketing pixels.
 *
 * Several components mount the same pixel hook (App, Footer, individual pages),
 * so every one of them observes the same navigation and registers its own
 * consent listener. Dedupe therefore has to live at module scope, not in a
 * per-instance ref: per-instance state emits one page view per mounted instance
 * and inflates campaign metrics.
 *
 * A plain "last location" key is not enough either. Revoking and re-granting
 * marketing consent on the SAME route must emit a fresh page view (the route
 * effect never re-runs, because the location did not change), while still
 * emitting only once no matter how many listeners react to that consent event.
 * The dedupe key therefore combines the location with a consent generation
 * counter: revoking bumps the generation, which invalidates the recorded key
 * exactly once, so the first caller after a re-grant claims the slot and the
 * rest are no-ops.
 *
 * That key identifies a SLOT, not a claim, and the two must not be conflated.
 * Navigating A -> B -> A returns to the very same key, so a claim token built
 * from the key alone cannot tell the abandoned first visit to A apart from the
 * current one: with the sends deferred past all three navigations, the stale
 * claim would still look current and emit. Claims therefore carry a monotonic
 * sequence number, which makes every claim distinguishable from every other.
 */

// Slot identity: which (consent generation, location) pair has been claimed.
let lastTrackedKey: string | null = null;
// Claim identity: the newest token handed out, plus the generation it was
// issued under. Only that exact token may still send.
let lastClaimToken: string | null = null;
let lastClaimGeneration = 0;
let claimSeq = 0;
let consentGeneration = 0;

function pageViewKey(location: string): string {
  return `${consentGeneration}:${location}`;
}

/**
 * Claim the right to emit a page view for `location`.
 * Returns a claim token for the first caller only (null for everyone else),
 * until the location changes or consent is revoked and granted again.
 *
 * Pixels defer the actual send (idle callback / timeout), and the world can
 * change in between, so hold on to the token and check `isCurrentPageView`
 * immediately before sending.
 */
export function claimPageView(location: string): string | null {
  const key = pageViewKey(location);
  if (key === lastTrackedKey) {
    return null;
  }
  lastTrackedKey = key;
  claimSeq += 1;
  lastClaimGeneration = consentGeneration;
  lastClaimToken = `${claimSeq}:${key}`;
  return lastClaimToken;
}

/**
 * Is this claim still the current one?
 *
 * It stops being current as soon as any newer claim is handed out or a consent
 * revocation bumps the generation — exactly the cases where a deferred send has
 * to be dropped: the pixel reads the CURRENT url when it fires, so a late send
 * would be attributed to whatever route the visitor is on now (which claims its
 * own view), or would track after consent was withdrawn.
 *
 * The comparison is against the newest token rather than the slot key, so
 * returning to a previously visited route (A -> B -> A) invalidates the earlier
 * claim for that same route instead of resurrecting it.
 */
export function isCurrentPageView(claim: string): boolean {
  return claim === lastClaimToken && lastClaimGeneration === consentGeneration;
}

/**
 * Record a page view that was emitted by someone else, so no caller emits a
 * duplicate for it. The pixel bootstrap snippet fires its own page view on
 * load, so the location it covers must be marked as already tracked. Any claim
 * still in flight is superseded by that emission.
 */
export function markPageViewTracked(location: string): void {
  lastTrackedKey = pageViewKey(location);
  lastClaimToken = null;
}

/**
 * Invalidate the recorded key so the next claim succeeds even for the current
 * location. Call once per consent revocation: the pixel stops tracking, and
 * when consent returns the visitor's current page must be counted again.
 * Claims issued under the previous generation stop being current.
 */
export function bumpConsentGeneration(): void {
  consentGeneration += 1;
}

/** Test-only: reset module state between scenarios. */
export function resetPageViewDedupe(): void {
  lastTrackedKey = null;
  lastClaimToken = null;
  lastClaimGeneration = 0;
  claimSeq = 0;
  consentGeneration = 0;
}
