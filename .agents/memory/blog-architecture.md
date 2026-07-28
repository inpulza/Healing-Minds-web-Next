---
name: Blog architecture (Healing Minds, adapted from XL Homes)
description: Non-obvious decisions for the blog base — Soft-404 SSR fix, bilingual modeling, YMYL E-E-A-T. Detail lives in repo docs.
---

Reference docs in repo: `docs/xl-homes-blog-reference.md` (proven XL Homes pattern)
and `docs/SEO_PUBLISHING_SPRINT_2.md` (Healing's closed scope). Read those for the
full picture; this file holds only the lessons that code/grep won't tell you.

## Soft-404 SSR fix (the hard-won one)
Google marks SPA blog posts as "Soft 404 / thin content" when `#root` starts empty
and fills via async fetch. Fix: server injects the FULL sanitized article into the
served HTML AND injects `window.__SSR_BLOG_POST__` so the client renders the article
**synchronously into the VISIBLE #root on first paint** (no skeleton, no fetch),
then refetches in background.
**Why:** Google does NOT credit content in hidden/off-screen divs — it must be in the
visible root synchronously.
**How to apply:** never replace the synchronous inline-data render with an async
fetch; keep API `GET /api/blog/posts/:slug` and the SSR `inlineData` the SAME shape
(divergence = silent hydration failure); copy the `sanitize-html` allowlist verbatim
(server) + dompurify (client).

## Bilingual blog modeling (Healing is en/es; XL Homes was monolingual)
Decision: bilingual from day 1. Use `language varchar(5)` + a shared
`translationGroupId` on posts; replace the global-unique `slug` with a **composite
unique `(language, slug)`**. Emit hreflang (en/es/x-default) from translationGroupId
in BOTH the `<head>` and the sitemap (`<xhtml:link rel="alternate">`).
**Why:** retrofitting slugs/hreflang later is expensive (XL Homes' stated regret).
**How to apply:** URLs `/blog/:slug` (en) and `/es/blog/:slug` (es); reuse Healing's
`urlMapping.ts` for language switch; mind the `/es` vs `/es/` trailing-slash trap.

## YMYL / E-E-A-T (psychiatry = health)
JSON-LD `author` must be a real **`Person`** (Dr. Melva Reve, credentials) linked to
the practice as `publisher` (Organization/MedicalClinic) — NOT author-as-Organization
like XL Homes does. Never emit `aggregateRating`/`Review` on Organization/
MedicalClinic/Service nodes (Google manual-action risk).

## Validating seo:check locally (operational gotcha)
`npm run seo:check` fetches the **production** base URL by default
(`SITE_BASE_URL`/`PUBLIC_SITE_URL` else `https://www.healingmindsp.com`). For not-yet-deployed
pages it false-fails (404, or 410 from the legacy anti-WordPress rule still live in prod).
**How to apply:** boot the prod build on an isolated port with a matching base URL
(`SITE_BASE_URL=http://localhost:PORT PORT=PORT NODE_ENV=production node dist/index.js`)
and run `SITE_BASE_URL=http://localhost:PORT npm run seo:check -- --no-google <paths>`;
canonical/sitemap only match when server and checker share the base URL. The boot needs a
dummy `RESEND_API_KEY` just to pass the startup presence check (not a real secret).

## Division of labor (this project)
CodeX implements the blog code via GitHub PR; the Replit agent reviews, then **applies
the Drizzle migration to the real DB** (`npm run db:push`) in-environment after merge
(CodeX cannot reach the real Postgres). `DATABASE_URL` already exists — never generate
new credentials.
