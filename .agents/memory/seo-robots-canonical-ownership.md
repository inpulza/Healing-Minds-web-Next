---
name: Ownership of robots + canonical (server vs client)
description: Who may write the robots meta and canonical link, and why the client must only touch them after SPA navigation.
---

# Rule

The server owns `robots` and `canonical` **for the URL the document was requested with**. The client must not rewrite them for that path. The client may only rewrite them once the visitor has navigated to a *different* path inside the SPA.

**Why:** two failures pull in opposite directions.

- Rewriting these tags on first paint (right after hydration) previously produced "Google chose a different canonical than the user" in Search Console, because the client-computed value did not match the server-injected one. That is why the client was locked out of both tags entirely.
- But locking the client out completely leaves the entry URL's tags in the DOM forever. Leaving a `noindex` landing (the California ad pages) left the *next* page carrying `noindex` and the landing's canonical. Low indexing risk — crawlers request each URL fresh rather than clicking through — but still a defect, and it makes any client-side audit tool report the wrong thing.

**How to apply:** capture the entry path once at module load, compare against the current path on every SEO update, and return early when they match. Derive the desired values from the shared route registry, never from ad-hoc per-page props, so client and server cannot disagree.

For paths the route registry does not know (dynamic routes, anything new), return "unknown" and leave the existing tag alone. Do **not** default to indexable: a wrong `noindex` that lingers in the DOM is harmless, while stripping a legitimate `noindex` off a private or draft page is not.

# Gotcha

Any page type that the server marks `noindex` must be discoverable from the shared route registry, or the client cannot keep the tag correct. When adding a noindex page, add it to the registry in the same change — same discipline as the bot-body registry.
