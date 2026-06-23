---
name: Healing Minds SEO Publishing Engine (Inpulza project)
description: Multi-session project — port XL Homes' SEO/blog publishing methodology to Healing Minds Psychiatry and turn it into a reusable Inpulza module. Scope, constraints, sprint roadmap, work dynamic.
---

# Healing Minds SEO Publishing Engine

Long-running, intermittent project. Healing Minds is the **second pilot** for turning XL Homes' SEO editorial system into a packageable module reusable for any Inpulza client/niche. Goal is NOT to copy-paste XL Homes' blog — it's to **adapt** the proven methodology to a healthcare/YMYL context, step by step (no big bang).

## What XL Homes already has (the reference system)
- Admin panel to create/generate blogs.
- Editorial flow with many steps: idea → research → anti-cannibalization → article → SEO metadata → images → verification → publish.
- Public blog rendered for Google, dynamic sitemap.
- Post-publish SEO hook: audits the URL (canonical/robots/content/sitemap), submits sitemap to Search Console, runs URL Inspection.
- Proven in production on xl-homes.com.

## Healthcare-specific constraints (non-negotiable, this is YMYL)
- Responsible medical tone; reliable/credible sources.
- Careful with clinical claims; add disclaimers where applicable.
- **Human review before publishing** (draft → human review → publish).
- Bilingual EN/ES routes when it makes sense.
- Local focus: Naples, Southwest Florida, telepsychiatry Florida.

## Domain / SEO config
- Canonical domain: https://www.healingmindsp.com
- Search Console property: sc-domain:healingmindsp.com
- Sitemap: https://www.healingmindsp.com/sitemap.xml
- **Do NOT generate new Google tokens.** Reuse Inpulza's secure infra when needed. Never commit or display secrets.

## Work dynamic (how the team operates)
- CodeX: reviews from outside, plans, implements in branches/PRs, validates with data.
- Replit (me): reviews the repo from inside, runs tests, verifies deploys, helps with smoke tests.
- Do NOT mix large refactors with critical SEO changes.
- Every important change goes through PR or controlled flow (as done in XL Homes).
- **Confirm the sprint and scope BEFORE implementing.**

## Reviewing CodeX PRs from this Repl (access method)
- The GitHub repo `inpulza/Healing-Minds-Psychiatry-New-Web` is **private**; CodeX pushes branches and opens PRs there. CodeX's code does NOT auto-arrive in this Repl's workspace — it stays on `main` until pulled.
- Main agent's shell has **no GitHub credential by default** (no credential helper, no token) — git ops to `origin` fail with "Authentication failed". A user-provided `GITHUB_TOKEN` secret unlocks access.
- **`git fetch`/`git checkout` are BLOCKED for the main agent** (treated as destructive). So you cannot fetch the PR branch into `.git`. Instead, read the PR via the **GitHub REST API** (`api.github.com` is reachable): use `GITHUB_TOKEN` to GET `/repos/.../pulls/N` (diff media type `application/vnd.github.v3.diff` for full diff), `/pulls/N/files`, etc.
- You can't run the PR branch's npm scripts without the files in-workspace. Two ways to actually run them: (a) have the user pull the branch via Replit's Git pane (UI has the OAuth token), or (b) replicate the logic against the live production site (the SEO audit just fetches public URLs over HTTP).
- Never print the token; pass it inline in curl/URLs only, redact in any echoed output.

## Sprint roadmap
- Sprint 0 — Audit: review routes, sitemap, SSR/meta injection, schema, build, Search Console, DB structure, and whether any blog/admin exists. Document differences vs XL Homes. Decide exactly which pieces are portable.
- Sprint 1 — SEO Publishing Engine: port only the reusable layer (audit URL, sitemap submit, URL Inspection, per-domain config). Test against existing routes, not a new blog yet. Verify it doesn't break production.
- Sprint 2 — Blog base: create /blog and /blog/:slug if missing, decide post schema, integrate posts into sitemap, ensure real SSR + JSON-LD.
- Sprint 3 — Healthcare profile: content rules for Healing Minds, trusted medical sources, categories/services/locations/tone, keep draft → human review → publish.
- Sprint 4 — Editorial engine: adapt idea generation, research, article, images (if applicable), verification, publishing.
