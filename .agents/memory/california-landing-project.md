---
name: California telepsychiatry landing project
description: Alignment facts for the CA landings (/es/psiquiatra-california + /psychiatrist-california) — verified codebase state, CA legal findings, pending data from Jordan.
---

# California landing project (Inpulza docs 00-07, July 2026)

## Verified codebase state (July 21, 2026 — trust this over the docs' commit-5ee74fb line numbers)
- The docs' claim of 3 fake phones (+1-239-555-0123) on active service pages is STALE: fake
  numbers exist ONLY in `client/src/pages/services/*.tsx.backup` files (BipolarTreatment,
  TmsTherapy). Active pages use tel:+12394230272. Task reduces to deleting .backup clutter.
- TWO real phone numbers coexist on the site: (239) 423-0272 in service-page CTAs vs
  (239) 920-1019 in WhatsApp (floating button + MobileToolbar). Ask which is canonical before
  putting any phone on new pages — never assume.
- `/telepsychiatry-florida` and `/es/telepsiquiatria-florida` are MISSING from
  `client/src/utils/urlMapping.ts` (language switcher breaks there). Pre-existing gap — fix it
  when registering the CA routes, and never clone this omission.
- Noindex precedent: html-injection.ts `/admin` case returns `noindex, nofollow`. Unknown
  routes get 404+noindex via isKnownRoute in server/routes.ts (~193-201).
- React is 18.3.1 (docs and replit.md both say so now; the old "React 19+" claim in replit.md was wrong).
- LocationFAQ component falls back to ENGLISH when the es key is missing — for a
  Spanish-primary CA page both languages of the `californiaTelehealth` FAQ key must ship
  together or the ES page shows English FAQs silently.

## Tracking facts (Fase B)
- `trackContactFormEvent` in analytics.ts is dead code (never called). Contact.tsx and
  ContactFormModal.tsx only call Clarity's trackEvent inside `if (!result?.filtered)` — GA4
  gets NO form-submit event today. No generate_lead, no Google Ads/GTM tag anywhere.
- use-clarity.ts / use-tiktok-pixel.ts guard bug: only the FIRST mounted component gets
  `initialized.current = true`; every later component's trackEvent silently no-ops.
- Hero "Call Now" tel: links have zero tracking.

**RESUELTO (verificado 2026-07-28) — no volver a implementarlo.** Los tres puntos
anteriores ya están corregidos en el código: ambos formularios llaman a
`trackLeadConversion('contact_form', ...)`, `analytics.ts` emite `generate_lead` de GA4,
los enlaces `tel:` del hero llaman a `trackLeadConversion('phone_call', ...)`, y los
hooks de píxeles se controlan con banderas de módulo (no refs por instancia).
Añadir un segundo juego de handlers duplicaría conversiones. Los pixel hooks deduplican
además la vista de página a nivel de módulo: varias instancias montadas comparten
`globalLastTrackedLocation`.

## California legal findings (own research; Jordan will send a regulations doc too)
- CA requires a full active CA license to treat patients located in CA; CA is NOT in the
  IMLC. The CA license is now verified by document (MBC Physician and Surgeon certificate,
  August 2024) and shown on the page; the landings still stay noindex until pricing, the CA
  phone, the MBC Notice to Consumers and the owner's sign-off are in place.
- MBC Notice to Consumers (BPC §2026, 16 CCR §1355.4, in force since 2023): physicians must
  notify CA patients they're licensed/regulated by the Medical Board of California, incl. QR
  code to mbc.ca.gov notice page. NOT covered in docs 00-07 — must be added to the CA landing
  when it goes live.
- Telehealth consent (BPC §2290.5): documented verbal/written consent before first telehealth
  service — operational, but worth a landing/FAQ mention.
- CMIA (Civil Code §56) applies to out-of-state providers serving CA residents and is
  stricter than HIPAA → privacy policy needs a CA section later (wait for Jordan's doc).
- CCPA/CPRA: practice is under all thresholds (~$26.6M / 100k consumers) → likely exempt at
  entity level. CalOPPA already satisfied (privacy policy exists).
- CIPA pixel-litigation wave targets healthcare sites tracking CA residents: TikTok/Meta-type
  pixels must never fire pre-consent; consider excluding TikTok pixel from CA pages.

## Working agreement
- Deliverable phases kept separate (per docs + memory rule "don't mix"): Fase A = landings
  noindex; Fase B = generate_lead tracking; Fase C = .backup cleanup. As Replit main agent I
  work on main with checkpoints, not branches/PRs (doc 07's PR flow is CodeX's lane).
