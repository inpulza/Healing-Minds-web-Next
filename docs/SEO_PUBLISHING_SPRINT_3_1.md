# SEO Publishing Sprint 3.1 - Blog Admin Hardening

## Goal

Harden the editorial admin before AI-generated HTML enters the workflow. This sprint does not add AI generation; it reduces security and indexing risk in the manual admin foundation from Sprint 3.

## Scope

- Replace the server blog HTML sanitizer with `sanitize-html`.
- Sanitize public blog API responses as a second server-side boundary.
- Replace client-side regex sanitizers with `dompurify` in the public article view and admin preview.
- Add explicit `noindex, nofollow` metadata for `/admin/*` HTML routes.
- Add in-memory rate limiting to custom admin login attempts.
- Add `scrypt` password verifier support for custom admin auth, while keeping legacy `sha256:` hash compatibility.

## Non-Goals

- No AI writing or image generation.
- No Search Console behavior changes.
- No schema or database migration.
- No production auth-mode change.

## Review Checklist

1. `npm run check` passes.
2. `npm run build` passes.
3. Blog content sanitizer removes scripts, event handlers, and `javascript:` hrefs.
4. Internal links such as `/services` remain valid.
5. Public API returns sanitized `content`.
6. `/admin/login` and `/admin/blog` receive `robots=noindex,nofollow` in injected HTML.
7. Failed custom-login attempts return `429` after the configured threshold.
8. Existing raw `BLOG_ADMIN_PASSWORD` custom mode still works.
9. Existing `BLOG_ADMIN_PASSWORD_HASH=sha256:<hash>` mode still works.
10. New `BLOG_ADMIN_PASSWORD_HASH=scrypt:<salt>:<key>` mode works.

## Notes for Replit

Development can stay in `BLOG_ADMIN_AUTH_MODE=off` for fast testing. Production still blocks `off` mode through the Sprint 3 guard.

Use this sprint as the hardening bridge before Sprint 4, where AI generation will create draft content only and human review will remain required before publish.
