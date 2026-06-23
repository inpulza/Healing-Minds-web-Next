---
name: Contact form anti-spam filter
description: Design rules for the silent anti-spam layer on POST /api/contact (the single shared contact endpoint).
---

# Contact form anti-spam

There is ONE endpoint `POST /api/contact` shared by the main contact form and the
popup modal. All anti-spam logic is centralized server-side; spam is filtered
SILENTLY (route returns `202 {success:true, filtered:true}` — no save, no email,
no analytics) so bots get no signal. Rate-limit returns `429`.

## Fail-open is the hard constraint
The whole point is "never block a real patient." Every heuristic must err toward
allowing. Specifically the DNS domain check (`verifyDomainHasDns`) only returns
false (filter) when BOTH the native resolver AND the DoH fallback independently
conclude NXDOMAIN/notfound. Any timeout, SERVFAIL, non-OK HTTP, or ambiguous
result on either side fails open (allows).
**Why:** a transient DNS/network hiccup must not silently drop genuine leads — that
loss is invisible and unrecoverable. A code review caught an earlier version that
filtered when DoH alone said NXDOMAIN.
**How to apply:** if you touch the DNS logic or add new heuristics, keep the
"both must agree to block / anything uncertain allows" rule.

## Gibberish heuristic must combine signals
Do NOT use a naive "few vowels" rule — it blocks real words (growth, brands,
strong, months). The heuristic scores each token on multiple weak signals
(no vowels, long consonant runs, case chaos) and only flags when several agree
across enough tokens.

## Other notes
- Phone is REQUIRED on both frontend and backend (deviation from the original
  optional phone) — part of the Inpulza spec port.
- IP for rate limiting comes from `req.ip` (app has `trust proxy` set); do not
  hand-parse the spoofable X-Forwarded-For header.
- Runnable smoke test: `npx tsx server/services/spam-filter.smoke.ts` (calls the
  filter directly, real DNS, no emails/rate-limit side effects).
