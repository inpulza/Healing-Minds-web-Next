# SEO Publishing Sprint 4 - Editorial Verification Framework

## Goal

Add the verification and safe-fix layer that every future AI-generated blog draft must pass before human review and publication.

This sprint intentionally does not generate AI content. It prepares the admin workflow so AI can later create drafts without bypassing medical/YMYL quality controls.

## Scope

- Add an admin verification report for each blog post.
- Separate blocking publish requirements from editorial SEO warnings.
- Add deterministic fixes for safe mechanical issues:
  - slug
  - meta title
  - meta description
  - reading time
  - featured image alt text
  - standard medical disclaimer
- Expose admin endpoints:
  - `GET /api/admin/blog/posts/:id/verify`
  - `POST /api/admin/blog/posts/:id/fix`
- Surface the verification report and safe fixes in `/admin/blog`.
- Keep all routes under the existing admin auth guard.
- Keep all generated/updated HTML passing through `sanitizeBlogContentHtml`.

## Non-Goals

- No AI article generation.
- No AI research.
- No AI image generation.
- No automatic publication.
- No new database migration.
- No new Google credentials or OAuth flow.

## Review Checklist

1. `npm run check` passes.
2. `npm run build` passes.
3. `GET /api/admin/blog/posts/:id/verify` returns a structured report.
4. The report includes blocking checks for title, slug, excerpt, content length, meta fields, author, category, tags, alt text, medical disclaimer, and sanitized HTML.
5. The report includes warning checks for SEO depth, featured image, internal links, external sources, heading structure, and human review.
6. `POST /api/admin/blog/posts/:id/fix` refuses to mutate published posts.
7. Fixes update only safe deterministic fields and return the updated verification report.
8. The disclaimer fix uses a standard educational/emergency disclaimer in the post language.
9. The admin UI can run verification and apply available fixes.
10. Existing publish gate behavior still works.

## Notes for Replit

This is the bridge into Sprint 5. Future AI generation should only create or update drafts, then immediately run this verification report. Human review remains required before publishing health content.
