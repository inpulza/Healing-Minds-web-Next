# Sprint 12 - Published Post Deletion

## Goal

Allow an admin to delete published blog posts when cleanup is intentional, while preventing accidental removal of live SEO URLs.

This follows the XL Homes admin behavior that published posts are deletable, but adapts it for Healing Minds with a stronger confirmation step because the site is medical/YMYL and deleting a live URL has public SEO impact.

## Scope

- Enable the delete action for published posts in `/admin/blog`.
- Keep deletion behind the existing `/api/admin/*` admin guard.
- Require exact slug confirmation before deleting a published post.
- Keep draft, pending review, and rejected post deletion simple.
- Return structured delete metadata from the admin API.
- Do not change publishing, review gates, AI generation, sitemap generation, Search Console hooks, or database schema.

## Behavior

### Unpublished posts

Draft, pending review, and rejected posts can be deleted from the admin after the standard confirmation dialog. They are not public and do not affect sitemap or Search Console.

### Published posts

Published posts can be deleted only when the admin types the exact slug in the confirmation dialog.

After deletion:

- The post disappears from the admin list after query invalidation.
- The public blog route no longer resolves to the post.
- The dynamic sitemap no longer includes the post because it is no longer returned from storage.
- No Search Console call is triggered in this sprint.

## Non-Goals

- No soft delete/archive system.
- No redirect management.
- No Google URL removal API.
- No automatic Search Console notification.
- No bulk deletion.
- No audit log.

Those can be separate sprints if needed.

## Validation Checklist

- `npm run check`
- `npm run build`
- Published delete without slug confirmation returns `400`.
- Published delete with the wrong slug returns `400`.
- Published delete with the exact slug returns `200`.
- Draft delete still returns `200`.
- After deleting a published post, it is absent from public API/list and sitemap.
