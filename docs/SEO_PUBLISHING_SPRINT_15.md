# SEO Publishing Sprint 15 - Blog Redirect Manager

## Goal

Prevent published blog URLs from becoming accidental dead ends when a post is unpublished or deleted, and give the admin a controlled way to find and clean internal links that point to an old blog URL.

## Scope

- Add a `blog_redirects` table for internal blog redirects.
- Resolve active redirects for `GET /blog/*` and `GET /es/blog/*` before SSR/HTML injection handles 404s.
- Add admin endpoints to list/upsert redirects and audit internal links by path.
- Add a confirmed cleanup action that rewrites exact `href` values from the old path to the redirect target.
- Require a redirect target or explicit no-redirect confirmation when a published post is unpublished or deleted.
- Update the existing delete/unpublish dialogs with redirect controls.

## Safety rules

- Redirect sources must be blog post paths: `/blog/*` or `/es/blog/*`.
- Redirect targets must be internal public paths.
- Redirect targets cannot be `/api`, `/admin`, or the same path as the source.
- Redirect chains are rejected: if the target already has an active redirect, the admin must choose the final destination.
- Public redirect lookup fails open: if the table is missing during deploy/migration or the DB has a transient error, the site continues with the existing 404 behavior instead of crashing.
- Link cleanup requires exact source-path confirmation.
- Link cleanup only rewrites `href` attributes. It does not rewrite arbitrary body text.
- A redirect cannot be created manually for a source path that is currently a published post URL.
- Publishing a post deactivates any active redirect for that post's public path so a live article cannot stay shadowed by a stale 301.

## Non-goals

- No Search Console calls.
- No sitemap entries for redirects.
- No AI, images, or Auto Generate changes.
- No external redirect support.
- No automatic best-related-post suggestion yet. The UI defaults to the blog index for the same language.

## Admin endpoints

- `GET /api/admin/blog/redirects`
- `POST /api/admin/blog/redirects`
- `GET /api/admin/blog/internal-link-audit?path=/blog/old-slug&status=published`
- `POST /api/admin/blog/redirects/:id/apply-link-cleanup`
- `POST /api/admin/blog/redirects/:id/cleanup-links`

## Validation checklist for Replit

1. `npm run check`
2. `npm run build`
3. `db:push` creates `blog_redirects`.
4. Create a redirect `/blog/old-test` -> `/blog`.
5. Confirm `GET /blog/old-test` returns `301` to `/blog`.
6. Confirm `/blog/old-test?utm=x` preserves the query string.
7. Confirm `/api`, `/admin`, external-looking targets, same source/target, and redirect chains are rejected.
8. Confirm unpublishing/deleting a published post without redirect and without explicit no-redirect confirmation returns `400`.
9. Confirm unpublishing/deleting with redirect creates the redirect and removes the post from public API/sitemap as before.
10. Confirm link cleanup rewrites exact `href="/blog/old-test"` values and does not rewrite plain text.
11. Confirm republishing a previously unpublished post deactivates the old redirect and the article URL returns `200`.
12. Confirm `POST /api/admin/blog/redirects` rejects a `sourcePath` that belongs to a currently published post.
