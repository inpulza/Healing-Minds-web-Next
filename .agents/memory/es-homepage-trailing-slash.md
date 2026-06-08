---
name: Spanish homepage trailing-slash SEO trap
description: Why /es vs /es/ keeps causing recurring SEO audit flags (canonical/hreflang/sitemap/redirect)
---

# /es trailing-slash mismatch is the recurring SEO regression

The server 301-redirects every path ending in "/" (except root "/") to its slashless
version, so `GET /es/` → 301 → `/es`. But the Spanish homepage's canonical, og:url,
hreflang `es`, and the sitemap `<loc>`+hreflang all reference `/es/` (WITH trailing slash) —
i.e. they point at a URL that permanently redirects.

**Why this matters:** This single inconsistency produces several distinct audit findings at
once (Semrush/Zenbrush): "page with permanent redirect", "incorrect page in sitemap.xml"
(non-canonical/redirecting URL in sitemap), and "incorrect hreflang links / hreflang conflict
in source". It looks like 3-4 separate problems but it's ONE root cause. This is why the
practice keeps re-flagging it after every audit.

**How to apply:** The Spanish homepage must standardize on `/es` (NO trailing slash)
everywhere. Every other ES URL is already slashless — only `/es/` is wrong. Fix all of:
- `server/routes/sitemap.ts` homepage entry `es: '/es/'` → `/es`
- `server/utils/html-injection.ts` homepage (EN) hreflang es href `/es/` → `/es`
- `server/utils/html-injection.ts` Spanish-home case `/es`: canonical, og:url, hreflang es all `/es/` → `/es`
Keep `x-default` and `en` pointing at `/` (root keeps its slash — root is the exception).

# Other confirmed live SEO gaps (same audit)

- **llms.txt is fake**: `/llms.txt` returns the SPA `index.html` with `content-type: text/html`
  (catch-all serves index.html for unmatched routes). There is no real llms.txt file or route.
  Fix: serve a real plain-text llms.txt (add an Express route like robots.txt/sitemap, or a
  static file) so crawlers get valid markdown, not HTML.
- **Thin location pages**: satellite city pages (Bonita Springs, Estero, etc.) trip
  low-word-count / low-text-to-HTML / single-internal-inbound-link warnings — same root as the
  pending "unique city FAQ/patient-story content" task.
- **Structured-data warnings** need confirmation via Google Rich Results Test (JSON-LD is
  JS/SSR-injected, web_fetch can't see it reliably). Suspects in getMedicalBusinessSchema:
  `isAcceptingNewPatients: "True"` (string not boolean), 2 of 3 reviews missing `datePublished`,
  and location `Service` schema `provider.@id` `#MedicalClinic` not matching org `@id` `#organization`.
