---
name: Page content modules & bot parity registry
description: How page copy is single-sourced for humans and crawlers; rules when adding or editing pages.
---

# Rule
All visible page copy (except California landings, blog, hyperlocal satellites) lives ONCE in pure-TS modules under `client/src/data/pageContent/` (legal/, services/, mainPages/). React pages render them (RichText handles `**bold**`/`[link](href)` markers); crawler bodies are built from the same modules via the `BOT_CONTENT_BY_PATH` registry in `server/utils/html-injection.ts`.

**Why:** Google flagged the site for bot/visible content divergence (soft-doorway risk). Hand-written bot bodies drifted from visible copy; parity (~90% words, same H1) is now enforced structurally.

**How to apply:**
- To change page text: edit the pageContent module, never hardcode copy in JSX — both bot and human views update together.
- New indexable page: add module + entry in `BOT_CONTENT_PAGES` (html-injection.ts) + route in `shared/routeManifest.ts` (source for sitemap, url mapping, SEO helpers and the bot-parity audit — but NOT for the React router: `App.tsx` still registers every `<Route>` by hand, so a manifest entry alone does not make the page reachable).
- Verify with `npx tsx scripts/audit-bot-parity.ts` (restart workflow first — server caches modules).
- Heading accent `<strong class="font-display ...">` elements must keep `font-weight: inherit` (rule in index.css) or Tailwind preflight makes them bolder than the original spans.
- California pair stays hand-written + noindex until license verified; blog SSR is a separate system — don't touch either when editing the registry.

## NAP (name, address, phone, hours) is NOT single-sourced

Business contact data lives in three unrelated layers, and a change has to be applied to all three or the site contradicts itself — which is a local-SEO ranking problem, not just a typo:

1. **Visible copy** — hardcoded per page. Hours in particular are repeated once per language on every location page (~9 pages, 18 strings), not pulled from a shared constant.
2. **Structured data** — `openingHoursSpecification` / `telephone` in the LocalBusiness + MedicalClinic schema injected server-side.
3. **Transactional e-mail templates** — separate copies of phone and hours in the server e-mail service.

**Why it matters:** the practice phone was updated site-wide at some point but the e-mail templates kept the old number for months, and the location pages advertised Saturday "by appointment" while the schema declared Monday-Friday only. Both were found by auditing, not by the code failing.

**How to apply:** when any NAP value changes, grep all three layers before declaring it done (phone in every format: `(239) `, `tel:+1239`, `+1-239-`; hours as `AM`/`PM` strings *and* `opens`/`closes`), and confirm the visible copy and the schema agree. Note the WhatsApp number is a genuinely different line from the practice phone — do not "unify" them.

**Canonical NAP as confirmed by the owner (2026-07-28):** 4760 Tamiami Trl N #25, Naples, FL 34103 - (239) 423-0272 - Monday to Friday 8 AM-5 PM, Saturday and Sunday closed.
