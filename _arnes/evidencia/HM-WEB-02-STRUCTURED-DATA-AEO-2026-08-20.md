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

## Preview evidence — PR #31

- Initial commit: `5c9a46e167d21f6e806dad3877b689374f87a39f`.
- Vercel deployment: `dpl_7y5JwMJPeC2KEpynoKqYD6dRwQxT`, Ready, Preview, official project/team.
- Raw crawl with Preview database: sitemap 80 URLs; 80 status 200; 80/80 with exactly one JSON-LD block; 0 invalid blocks.
- Hydrated browser sample: 14/14 with JSON-LD; 0 pages with console errors.
- Exact-SHA structured-data E2E: 8 PASS and 4 intentional cross-profile skips.
- Exact-SHA full deployed E2E: 98 PASS, 22 intentional cross-profile skips, 0 failures across 120 cases.
- GitHub Quality exposed two races in the heading/map smoke itself: a transient lazy-boundary detach during hydration and a circular wait while releasing an intercepted Maps request. The smoke now retries only the transient detach and releases the held route with Playwright's `ignoreErrors` cleanup. The reproduced command completes locally in 18.5 seconds.

The smoke-test repair changes verification code only. A new exact-SHA Preview/Quality run is required after push; the previous Preview evidence remains valid for the unchanged application output but does not substitute for that gate.

## Post-hardening local evidence — 2026-08-21

The final hardening removed or qualified public statements that could not be demonstrated from a dated primary or operational source: named insurance participation, fixed visit durations, same-week or flexible availability, 24/7 clinic support, guaranteed telehealth modality or clinician, absolute privacy/security, patient-frequency claims, fabricated testimonials, unverified credentials, stale demographic statistics, promotional parking claims and implied local partnerships.

`shared/public-claims-sources.json` is the versioned provenance and freshness registry for the facts that remain. It includes Florida ME165518, California A198275 with its renewal deadline, NPPES organization/person records, the canonical Google Business Profile/Maps identity, Larkin psychiatry residency evidence, David Lawrence Centers crisis/general contact distinction and dated social-profile checks. Tests fail when a renewable record expires.

The first complete browser run exposed a real SSR omission: React did not serialize closed FAQ answer branches implemented with the HTML `hidden` attribute in every active page variant. All six accordion implementations now keep the answer nodes in initial HTML with CSS visibility plus `aria-hidden`, while preserving real hydrated toggles. The final browser contract enumerates 28 canonical FAQ routes EN/ES and compares every question and answer across JSON-LD, initial HTML and a real click in Desktop Chrome and Pixel 7.

Final local gates on the settled tree:

- TypeScript: PASS.
- Unit and contract tests: 173/173 PASS (162 `.mjs` + 11 TypeScript).
- Next production build: PASS; 87 generated pages.
- Bundle budgets: `/` 668.9/750 KiB; catch-all 779.6/850 KiB.
- Focused FAQ browser gate: 2/2 PASS, covering all 28 routes in both viewports.
- Full Playwright matrix: 124 PASS, 22 intentional cross-profile skips, 0 failures across 146 cases.
- `git diff --check`: PASS; line-ending warnings only.

Deployment evidence remains deliberately pending until the final judge returns PASS and the exact tree is committed. The required order remains branch → PR → exact-SHA Preview → review classification → squash merge → exact-SHA Production verification. The remote branch must not be deleted.

## Final false-green closure — 2026-08-21

The independent judge did not accept the earlier green suites as proof of factual accuracy. It found three classes of blind spot after the initial hardening:

1. Lazy hydrated content was missing from source-only guards: `ServiceAreas` still exposed unsupported population/reach/travel metrics and blanket telehealth availability.
2. Legal and conversion copy conflated the practice, clinician and website: practice-level licensure, website-request consent, a confirmed clinician/modality, and CharmHealth as a clinical video platform.
3. Image alternatives acted as hidden marketing copy: they asserted a secure platform, active treatment and a named treating physician even though the visual UI had already been made conservative.

The final contract now checks each layer separately: source files, initial SSR HTML, lazy DOM after real scrolling, hydrated interaction, metadata and JSON-LD. The remediation uses one Naples physical office, request-only telehealth wording, treating-professional licensure at the patient's physical location, documented clinical consent under applicable law, and purely visual localized image alternatives.

Official legal citations were added to the dated source registry:

- Florida Statutes Section 456.47: https://leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0400-0499%2F0456%2FSections%2F0456.47.html
- California Business and Professions Code Section 2290.5: https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=2290.5

Final settled local evidence, superseding earlier local counts:

- Independent judge: PASS for PR/deployment, followed by the required global E2E.
- TypeScript: PASS.
- Unit/contracts: 181/181 PASS (170 `.mjs` + 11 TypeScript).
- Next production build: PASS; 87 generated pages.
- Bundle budgets: `/` 669.0/750 KiB; catch-all 779.8/850 KiB.
- Focused public-claims E2E: 44/44 PASS.
- Full Playwright matrix: 148 PASS, 22 intentional cross-profile skips, 0 failures across 170 cases.
- `git diff --check`: PASS; line-ending warnings only.

Preview and Production evidence must be appended outside this local-only checkpoint after the exact committed SHAs are deployed and verified.
