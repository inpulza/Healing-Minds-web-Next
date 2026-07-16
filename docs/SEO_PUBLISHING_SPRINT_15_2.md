# SEO Publishing Sprint 15.2 - Atomic Published Delete Redirects

## Goal

Close the remaining redirect-ordering edge case from Sprint 15. A published post deletion must complete before its redirect becomes active, without allowing a partial result if either database operation fails.

## Scope

- Validate the published-delete confirmation and redirect decision before mutating data.
- Delete the post first and create the redirect second inside one database transaction.
- Roll back the deletion if redirect creation fails.
- Store `sourcePostId` as null because the source post no longer exists after deletion.
- Preserve draft deletion behavior and the existing API response shape.

## Non-goals

- No schema migration.
- No admin UI changes.
- No changes to unpublish, republish, link cleanup, AI generation, images, sitemap, or Search Console.

## Validation checklist

1. `npm run check`
2. `npm run build`
3. Delete a draft and confirm it is removed without creating a redirect.
4. Try deleting a published post without confirmation; expect `400` and no mutation.
5. Try deleting a published post with the wrong slug; expect `400` and no mutation.
6. Delete a published post with exact confirmation and a redirect target; confirm the post is deleted before the redirect is created and the old URL returns `301`.
7. Force or simulate redirect insertion failure; confirm the transaction rolls back and the published post remains available.
8. Confirm the returned redirect has `sourcePostId: null`.
