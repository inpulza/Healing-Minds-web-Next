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

## Live Preview evidence

- PR: `https://github.com/inpulza/Healing-Minds-web-Next/pull/4`
- Head: `3d011489b3b40b009af491ce00ef304585f70a47`
- Deployment: `dpl_Fg5wpB9K8kjR9WMKD7Z3anqvqtna`
- Target/status: Preview / Ready
- Stable branch alias:
  `https://healing-minds-psychi-git-3e2ff0-inpulzasolutions-6847s-projects.vercel.app`
- Authenticated Vercel request to `/admin/login`: HTTP 200.
- Authenticated Vercel request to `/api/admin/session`: success, configured,
  custom mode, unauthenticated.
- A clean anonymous browser is redirected to Vercel login by Deployment
  Protection. This is expected and occurs before the application.
- GitHub Quality and Vercel checks: PASS.

## Deployment identity note

The repository and PR owner are `inpulza`. The local Git author configured for
the two commits is `Claude Code <inpulza.media@gmail.com>`, which GitHub links
to `inpulzamedia`. Vercel can display that commit identity while the deployment
itself belongs to the `inpulzasolutions-6847s-projects` team. These are separate
concepts; no account owner or Git identity was changed in this task.

## Content-depth follow-up

A real Preview generation returned 595 words for an 800-word minimum and a
1,100-word target. The counter was confirmed as accurate within one copied HTML
token; the missing behavior was generation depth, not the admin display.

Newly generated drafts now receive exactly one safe expansion pass when the
first validated response is below the editorial minimum. The second response is
subject to the same source/link allowlists, sanitizer, disclaimer, structure,
and word-count checks. Mocked guards cover a successful expansion, no retry for
an already sufficient draft, and preservation of the first safe draft when the
provider expansion fails. No real API key, provider call, database write,
publication, Production environment change, or manual deployment is involved.

## Integrated live smoke — 2026-08-01

The merged feature branch at `7565d60650114d2ae2b5c6ad744eecd22f953dd6`
received a Ready Preview. Its first custom-admin login returned 401 even though
the current encrypted Preview values passed the same verifier locally. The
three existing Preview-only auth variables were updated with those same values,
without reading them into evidence or changing Production, and the exact
artifact was redeployed as `dpl_CWhscdvCCigDvumAN2Rw27dkSoh8`. Login then
returned 200.

One real temporary post was generated in shared Neon:

- post `8`, status `draft`;
- 959 words against the 800-word SEO depth requirement: PASS;
- public route: 404;
- slug absent from `/sitemap.xml`;
- medical disclaimer present;
- no publish transition was executed.

The three `healing-minds-v3` candidates completed and were reviewed before
selection: one hero and two inline images, all adult-only, diverse, physically
coherent and editorially appropriate. The authenticated eye preview rendered
exactly one selected hero and exactly two inline figures, each once after its
saved heading. The dialog remained labelled Draft, stated that nothing was
published, and produced zero console errors.

The live run also exposed a Vercel-only timeout. `POST
/api/admin/blog/posts/8/images/generate` started at 01:34:30 UTC and lost its
client response at the former 60-second function boundary. The underlying work
still completed all three images; the browser retry then received 429 because
the paid-call quota had already been consumed. The App Router route now exports
`maxDuration=600`, covering the configured 3 x 150-second provider ceiling plus
conversion, Blob and database work. This must be verified on a new build from
the corrective commit, not another redeploy of the older artifact.

CodeX reviewed `7565d6065` and opened two valid P2 notes. The expansion now
preserves first-pass provider warnings while replacing only the four exact
shape warnings recalculated by the normalizer. An expansion above the editorial
maximum is rejected in favor of the first safe draft with a human-review note.
Focused guards cover both cases, including a provider warning that deliberately
shares the prefix of an internal depth warning.

The temporary post and its Blob objects remain intentionally present only until
the corrective Preview completes the 600-second generation check and the final
shared-renderer audit. They must be deleted before merge.
