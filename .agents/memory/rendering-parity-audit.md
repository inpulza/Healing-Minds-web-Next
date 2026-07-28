---
name: Rendering parity (bot vs user) — confirmed audit
description: Bot-facing prerender is hand-written and decoupled from React; 12 legal pages serve 0 body/0 H1 to bots; duplicate H1s from mobile/desktop responsive pattern.
---

# Rendering parity audit (confirmed 2026-07-23)

> **Estado posterior:** el cuerpo para bots ya no se escribe a mano página a página; lo sirve el registro de módulos de contenido (ver `page-content-modules.md`, que manda sobre este fichero en todo lo que se refiera a *dónde* vive el copy). Lo que sigue vigente aquí es el diagnóstico: una ruta sin entrada en la fuente del cuerpo para bots sirve 0 body, y el patrón responsive duplica H1.

External audit (Claude Code crawl of all 76 sitemap URLs, browser vs Googlebot UA vs real Chromium) was verified against production AND current workspace code. **All major claims are real.**

## Confirmed findings

1. **12 URLs serve 0 body / 0 H1 to bots** — the 6 newer legal pages (telehealth-consent, no-surprises-act, accessibility-statement, nondiscrimination-notice, communications-policy, medical-disclaimer) EN+ES get meta tags injected but have NO case in the `getStaticPageBody` switch in `server/utils/html-injection.ts`, so `#root` stays empty for crawlers. Confirmed in prod and local dev.
   **Why:** the bot-body switch is hand-maintained; adding a route to App.tsx/urlMapping/sitemap does NOT add a bot body. This is a recurring trap — every new page needs a `getStaticPageBody` entry (or the system needs to be replaced).

2. **Bot HTML is a thin, hand-written parallel version** — `getStaticPageBody` contains hardcoded HTML strings totally decoupled from the React components. Avg ~126 words for bots vs ~731 rendered. 72/76 URLs differ by >50 words; 49 URLs have DIFFERENT H1 text bot-vs-user (e.g. /about bot: "About Dr. Melva Reve — Naples, FL Psychiatrist" vs visible: "A Safe Space to Heal and Find Clarity").
   Location pages generate bot bodies via `buildLocationBody` from `client/src/data/locationHyperlocal.ts`; blog uses DB (blog is fine — real SSR sync render).

3. **Duplicate visible H1s (24 pages)** — home (`Hero.tsx`), all 20 location pages (`Location*.tsx`), and telepsychiatry (via `CharmHealthBooking.tsx` rendering `heroTitle` prop in BOTH mobile `md:hidden` and desktop `hidden md:block` blocks). Both H1s exist in the DOM; CSS hides one.
   **How to apply:** when fixing, keep one `<h1>` and demote the duplicate to `<p>`/`<div>` styled identically, or render the title once outside the responsive split.

4. **Not cloaking-penalty proof, but real risk** — canonical/schema/hreflang DO match between variants. Google calls dynamic rendering a deprecated workaround; the mismatch (esp. different H1s and 0-body pages) is the actionable problem.

## Status: P1–P3 FIXED in dev (2026-07-23), architect-reviewed PASS
- P1 done: 12 legal-page cases added to `getStaticPageBody` (bot body = h1 + summary + contact + legal navs).
- P2 done: all bot H1s (incl. `buildLocationBody` templates) now copy the VISIBLE React H1 verbatim — direction chosen because handoff forbids changing visible copy. Known trade-off: some visible H1s are keyword-weak (e.g. "A Safe Space to Heal and Find Clarity"); improving them requires changing visible copy WITH user approval, then updating the bot side in lockstep.
- P3 done: mobile responsive `<h1>` demoted to `<p>` (same classes) in Hero + 10 Location pages; `CharmHealthBooking` demotes its `heroTitle` prop to `<p>` in the mobile block via a `demoteHeading` helper (only fires if top-level node is exactly `h1` — fragile if a caller wraps it in a div).
- /es/contacto visible H1 was untranslated English ("Get in touch") → translated to "Póngase en contacto" (user-approved parity work); bot matches.
- **A11y trade-off:** the sole `<h1>` now lives in the `hidden md:block` desktop block, so mobile screen readers get no page-level heading on those pages. Acceptable; long-term fix = single responsive H1.
- **Recurring trap remains:** every new page still needs a manual `getStaticPageBody` entry. Long term: generate bot bodies from the same source as React (or true SSR) + CI parity check bot-vs-rendered. After deploy, re-run the Googlebot-vs-rendered crawl to confirm parity in prod.
