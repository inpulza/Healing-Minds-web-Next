# HM Web 02 — Structured Data, AEO/GEO and Local SEO Evidence

Date: 2026-08-20

## Baseline verdict

Production coverage was partial but functionally absent across the site: 1 of 80 sitemap URLs (1.25%) exposed JSON-LD in initial HTML. The home contained one limited social-identity graph; 79 URLs had none. Therefore the external “zero” audit was imprecise for home but substantially correct for the site.

The legacy generator in `server/utils/html-injection.ts` belongs to the Express/Vite renderer. Public Vercel traffic runs the Next.js App Router, so edits to that injector did not reach public page HTML.

## Verified entity facts

- Public name: Healing Minds Psychiatry.
- Legal organization: VIDAL HEALING MINDS CORP; NPI 1417786278.
- Public clinician: Dr. Melva Reve, MD; individual NPI 1982233631; Florida license ME165518.
- One physical office: 4760 Tamiami Trl N #25, Naples, FL 34103.
- Phone: (239) 423-0272 / +1-239-423-0272.
- GBP hours: Monday–Friday 8:00 AM–5:00 PM; Saturday/Sunday closed.
- Stable map: https://www.google.com/maps?cid=4284755814550718591
- GBP coordinates: 26.2044881, -81.7995047.

Sources: current Google Business Profile, NPPES organization/individual records, Florida Department of Health license profile, Sunbiz and the public website.

## Risks deliberately excluded

- Board certification: not repeated because Florida DOH does not list a recognized specialty-board certification.
- Fax: excluded because the site and public registries disagree.
- Accepting new patients, price range and aggregate rating: excluded without current first-party confirmation.
- Legacy coordinates: excluded; they pointed roughly 262 metres west of the current GBP point.
- Satellite branches: none created. Nine city pages represent service areas pointing to the one Naples office.

## Implemented contract

- Route-owned SSR JSON-LD with one `@graph` per public URL.
- Stable organization, practice, person and website IDs; route-specific WebPage/Breadcrumb/Service/FAQ/Blog/Article IDs.
- Practice entity uses `MedicalOrganization`, `MedicalClinic`, `Physician` and `LocalBusiness`; clinician is a separate `Person`.
- Naples/contact/home receive verified NAP; satellite cities receive `Service.areaServed`, never a fake branch.
- FAQ answers and essential business content exist in initial HTML.
- Robots explicitly state policy for Googlebot, Bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User and PerplexityBot.
- `llms.txt` enumerates public pages and preserves the last valid ISR response on database failures.
- Legacy public schema dependency removed from the active Next path.

## Exhaustive location-content audit

All 20 EN/ES location routes were reviewed. False directions and duplicated times in Naples, Bonita Springs, Estero, Fort Myers, Immokalee, Ave Maria and Lely Resort were corrected. All nine satellite H1s now say the practice serves the city instead of implying a physical office. Travel times have one data source and are qualified by origin/traffic.

Visible FAQ and service-area copy no longer promises unverified flexible/urgent scheduling, exact first-appointment durations, payment plans, third-party partnerships, routine record sharing or patient testimonials. Telehealth copy requires clinical appropriateness, the patient's physical location and applicable licensing; record coordination requires consent.

## Local gates before PR

- TypeScript: PASS.
- Unit/contract: 151/151 PASS (142 `.mjs` + 9 TypeScript).
- Build: PASS; 87 generated pages.
- Bundle budgets: `/` 669.5/750 KiB; catch-all 780.0/850 KiB.
- Independent location/schema judge: no remaining blocker before final E2E.
- Full E2E after final location changes: 98 PASS, 22 deliberate cross-profile skips, 0 failures across 120 desktop/mobile cases.
- Final local raw crawl: 77/77 URLs returned 200, 77/77 contained exactly one JSON-LD block, 0 invalid blocks.
- Final local hydrated audit: 14/14 representative pages contained JSON-LD, 0 console-error pages.
- Schema.org Validator retry: external endpoint returned HTTP 405 with HTML instead of validator JSON. This is recorded as a validator availability/rate-limit boundary, not a passing external validation; it must be retried on the public Preview.

## Required deployed evidence

Before merge: exact-SHA Vercel Preview, 80-URL sitemap crawl with Neon data, crawler-UA matrix, hydrated DOM audit, Schema.org Validator and Google Rich Results Test where accessible, then complete Code Review classification.

After merge: exact production SHA, repeat the same 80-URL crawl and validators, and archive final artifacts outside the repository.
