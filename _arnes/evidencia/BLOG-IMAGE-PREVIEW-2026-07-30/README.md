# AI Blog — visual image method and faithful preview

Date: 2026-07-30

Scope: post-migration editorial hardening requested after PR #2. This does not
approve clone Phase 3 and does not publish a post.

## Browser contract

The production Next build was started locally with explicit fake admin fixtures.
No real Vercel credential or secret was read or printed. Protected blog API
responses were deterministic browser fixtures so the interaction could be
tested without writing to the shared Neon database.

Verified viewports:

- 1440 x 900: preview title, editorial status, hero and close control visible.
- 914 x 768: preview has no horizontal overflow; hero and inline image render.
- 390 x 844: login eye remains usable; preview and inline figure fit the
  viewport with no horizontal overflow.

Verified journey:

1. `GET /api/admin/session` -> 200
2. `POST /api/admin/login` -> 200
3. `GET /admin/blog` -> 200
4. protected config/list/stat endpoints -> 200
5. `GET /api/admin/blog/posts/42/preview` -> 200
6. preview renders H1, H2, H3, list, link, blockquote, hero, inline figure and
   caption
7. password control changes the input between masked and visible
8. `POST /api/admin/logout` -> 200
9. browser console -> 0 errors, 0 warnings

## Captures

- `admin-preview-1440-top.png`
- `admin-preview-tablet-914.png`
- `admin-preview-mobile-390-content.png`
- `admin-login-mobile-390.png`

The images shown in these captures are fixed local visual fixtures. They verify
layout and rendering, not a paid provider generation.

## Automated evidence

- `npm test` -> PASS, 58/58.
- `npm run check` -> PASS.
- `npm run build` -> PASS, 89/89 static pages and dynamic admin/API routes.
- `npm run db:verify` -> PASS, 2 migrations, 95 statements, 18 tables, 20
  foreign keys, ordered blog tags PASS.
- `npm run blog:image-check` -> PASS.
- `npm run blog:topic-check` -> PASS.
- `npm run blog:link-check` -> PASS.
- `git diff --check` -> PASS.

## Approved visual direction

Jordan supplied a campaign reference board after the first implementation.
Prompt version `healing-minds-v3` translates its lighting, color, texture,
camera energy, natural expression, and art direction into five reusable
treatments: studio editorial, sunlit lifestyle, textured interior, clean
cinematic, and documentary fashion.

The reference board is not copied into the repository or sent to the provider.
References containing children influence style only; generated Healing Minds
briefs explicitly use fictional adults and exclude children and infants.

## Safety result

- Drafts remain unpublished until human review and publish approval.
- Prompt classification is local and does not send patient-provided clinical
  text to the image provider.
- The preview reads the saved draft and selected images; it does not mutate or
  publish the post.
- Production image generation remains an independent environment approval.

## Preview environment

Vercel was checked by variable name and target only; no environment value was
read. `BLOG_IMAGE_ENABLED=true` was added as a non-secret Preview-only variable.
`OPENAI_API_KEY` and `BLOB_READ_WRITE_TOKEN` were already present for Preview.
Production was not changed.
