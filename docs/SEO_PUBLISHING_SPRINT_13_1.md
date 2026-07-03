# Sprint 13.1 - Blog Admin Operational Safety

## Purpose

Add operational guardrails for the blog admin now that development and production each have real blog databases.

This sprint does not change publishing, sitemap generation, Search Console, AI generation, image selection, or the public blog renderer.

## What Changed

### Runtime badge

The admin now calls `GET /api/admin/runtime` after authentication and shows a visible database badge:

- `LIVE DATABASE` when `REPLIT_DEPLOYMENT === "1"`
- `DEV DATABASE` otherwise
- `DATABASE UNKNOWN` if the runtime endpoint cannot be read yet

The endpoint is protected by the existing `/api/admin/*` guard and returns only a coarse runtime label. It does not expose environment variables or secrets.

### Move published posts out of live status

Published posts can now be moved out of `published`, but the server requires an explicit confirmation:

- `confirmUnpublish: true`
- `confirmSlug` exactly matching the current post slug

This avoids accidental live content removal. The post is not deleted, and `publishedAt` is preserved for audit/history.

The normal edit route (`PUT /api/admin/blog/posts/:id`) rejects `status` in the payload. Status changes must go through the dedicated status endpoint so the live-content guard cannot be bypassed.

### Internal-link impact check

The admin exposes `GET /api/admin/blog/posts/:id/unpublish-impact` to show whether other published posts link to the post being unpublished.

The UI displays the affected posts in the confirmation dialog so the editor can decide whether to update links later.

This sprint only reports impact. It does not automatically rewrite or remove links.

## Non-Goals

- No database migration.
- No authentication changes.
- No AI generation changes.
- No image changes.
- No Search Console or sitemap changes.
- No automatic link cleanup.
- No redirect manager.

## Expected Replit Smoke Test

1. Run `npm run check`.
2. Run `npm run build`.
3. Confirm `/admin/blog` shows `DEV DATABASE` in development.
4. Confirm `GET /api/admin/runtime` returns `dev` in development and is protected without admin session.
5. Try moving a published post to draft or pending review without confirmation: expect HTTP 400.
6. Try with the wrong slug: expect HTTP 400.
7. Try with the exact slug and `confirmUnpublish: true`: expect HTTP 200 and status `draft`.
8. Try `PUT /api/admin/blog/posts/:id` with a `status` payload: expect HTTP 400.
9. Confirm the post disappears from the public API and sitemap after it is a draft.
10. Confirm a non-published post can still move to draft without the extra slug confirmation.
11. If another published post links to the target URL, confirm the dialog lists it.

## Backlog

Later sprint: redirect manager and dead-internal-link cleanup after delete or unpublish.
