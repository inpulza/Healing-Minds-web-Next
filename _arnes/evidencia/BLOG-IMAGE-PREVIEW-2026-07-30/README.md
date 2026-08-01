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

## Durable image-job correction

The exact Git deployment from `86e48eb100f6c55c50b3eeaacdc5e1340ae5e9af`
was Ready as `dpl_4Zh7tLC8mvGLx6BTnbqoTzz2tU4a`, and its function manifest
contained `maxDuration: 600` with Vercel Fluid enabled. A second real protected
Preview run still lost the browser response at exactly 60 seconds; its worker
continued and completed image rows 10, 11 and 12. This disproved the synchronous
HTTP design even though the Vercel function itself no longer timed out.

The manual generate-set and regenerate endpoints now use a dedicated durable
job table and immediately return an admitted job. Admission is deliberately
non-runnable until rate-limit approval transitions it from `admitting` to
`queued`. Polling can schedule only queued work. Job and slot uniqueness prevent
same-key replays, different-key overlaps and duplicate paid slots. Heartbeats
allow stale recovery; a possibly charged in-flight slot is failed rather than
automatically retried, while untouched pending slots continue.

Local verification after this correction:

- TypeScript: PASS.
- Test suite: 85/85 PASS.
- Next build: 89/89 PASS.
- Blog image and depth guards: PASS.
- Drizzle migration reader and PGlite migrator: 4/4 migrations PASS.
- Behavioral database checks: admission gate, same-key replay, different-key
  conflict, single worker, unique slot and stale pending-only recovery PASS.
- Drizzle snapshot drift check: `No schema changes, nothing to migrate`.

The shared Neon migration applied all 12 statements in one transaction. The
job table, `image_job_id` column, five indexes and six status labels were
verified afterward; the new structures contained zero jobs and zero linked
slots. The live 202/polling/replay smoke remains required before merge.
Production and the public domain remain unchanged.

## Durable live Preview result — 2026-08-01

The exact commit `5192da0a3f0c8945508f454f6a1812017e071cfa` deployed
Ready as `dpl_9Jo1ovZrqAutikAhMNpt9YK9qZLP`. GitHub tied that deployment to
the same SHA. Quality, Vercel and Vercel Preview Comments all passed, and
CodeX reported no major issues for `5192da0a3f`.

The old completed candidates were removed first. A single new protected
Preview request created job `1` and returned `202` in 791 ms. Replaying the
same idempotency key returned `200`, the same job id and no new slot; a
different key while the first job was open returned `409`. Polling reached
`completed` in 120.646 seconds and materialized exactly three unique rows:

- image `13`, `hero:hero`;
- image `14`, `inline:inline:1`;
- image `15`, `inline:inline:2`.

All three adults-only candidates were visually reviewed before selection. The
shared renderer displayed exactly one hero and two inline figures, a visible
Draft badge, 959 words against the 800-word minimum and zero console errors.
Desktop at 1440 px and mobile at 390 x 844 were checked. The draft remained a
public 404 and absent from the sitemap throughout.

Cleanup then removed the three AI rows, their exact Blob keys and temporary
post `8`. Direct Neon verification returned zero matching posts, image rows
and jobs, with a zero-row cleanup queue. Direct Blob listing and metadata
checks confirmed that none of the three target objects remained.

The cleanup check exposed one final response-normalization defect: the current
Blob SDK reports a missing object as a generic `Error` with the exact message
`Vercel Blob: The requested blob does not exist`, without a 404 property. The
existing adapter therefore returned 503 even though the object was correctly
gone. The adapter now maps that exact provider response to 404 while preserving
503 for every other storage failure.

The behavior test covers the exact provider message plus name, code and status
markers as 404. Generic failures, a near-match message, 401, 403, 500,
`forbidden` and null remain 503. Focused tests passed 3/3; the full suite passed
86/86, TypeScript, all image/depth/link guards, four real Drizzle migrations,
the 89-page Next build and diff-check passed. The independent judge returned
GO for this corrective push.

The exact corrective commit `1c9c2f98c5e67ee733b5c5e7bd7476773b982a3f`
deployed Ready as `dpl_HngDwq2NBfjyC7XrLP9zNdA6CjVP`. Cache-busted requests
through that new artifact returned `404`, `404` and `404` for the three removed
image paths. Direct provider listing still found zero target Blobs, and Neon
still reported zero posts, image rows, jobs and cleanup-queue rows for the
temporary post. The response-normalization defect is therefore closed in the
real protected Preview.

No Production variable, public URL, domain or DNS record was changed.
