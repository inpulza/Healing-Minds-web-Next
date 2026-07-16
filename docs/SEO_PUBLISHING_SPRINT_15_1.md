# SEO Publishing Sprint 15.1 - Redirect Manager Hardening

## Goal

Close two edge cases found after Sprint 15:

- A published post could be renamed into a URL that already has an active redirect, making the live post unreachable.
- During unpublish, the redirect was created before the status update. If the status update failed, a live post could be shadowed by a redirect.

## Scope

- Block saving a published post when its resulting public path has an active redirect.
- Create the unpublish redirect only after the post successfully leaves `published`.

## Non-goals

- No new redirect UI.
- No schema changes.
- No Search Console calls.
- No AI, images, sitemap changes, or public blog design changes.

## Validation checklist

1. `npm run check`
2. `npm run build`
3. Create an active redirect for `/blog/renamed-target`.
4. Try to rename a published post slug/language so its path becomes `/blog/renamed-target`; expect `400`.
5. Confirm normal edits to a published post still save when the resulting path has no active redirect.
6. Unpublish a published post with redirect; confirm the post leaves public API/sitemap and then the redirect exists.
7. Force or simulate a status update failure if practical; confirm no redirect is created before the status change.
