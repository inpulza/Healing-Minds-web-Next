# SEO Publishing Sprint 17 - Reviewed AI Blog Images

## Goal

Add AI-generated blog image variants without weakening the private-draft and
human-review gates established by the earlier publishing sprints.

The current curated Healing Minds image remains the fallback. Image generation
is an optional, fail-open enhancement: a provider or storage failure must never
delete, invalidate, or publish the draft.

## Reference and Adaptation Boundary

XL Homes is the behavioral pilot for image variants, generation progress, and
editor controls. Healing Minds keeps the useful workflow but does not copy its
monolithic routes, in-memory generation state, regex HTML insertion, competing
image sources of truth, or database-only deletion.

The topic-diversity planner described in the July 22 methodology is Sprint 18
work and is intentionally excluded from this change.

## Storage Model

`blog_post_images` stores every curated or AI variant:

- `postId`, `role`, and `slot` identify where an image can be used.
- `anchorHeading` places inline images after a matching `h2`/`h3` at render
  time. Inline markup is not permanently baked into `blog_posts.content`.
- `source`, `generationStatus`, and `reviewStatus` separate provenance,
  provider progress, and human selection.
- `objectKey`, `publicUrl`, `mimeType`, dimensions, bytes, and checksum describe
  the physical asset.
- `alt`, `caption`, `safeVisualBrief`, `prompt`, `promptVersion`, `provider`,
  `model`, `generationRunId`, timing, and error fields preserve review and
  operational evidence.
- A partial unique index permits only one selected image for each
  `postId + slot`.

The existing `blog_posts.featuredImage` and `featuredImageAlt` fields stay as the
published/read fallback and remain populated with the curated image when a
draft is created. Selecting a reviewed hero variant synchronizes those fields;
starting or failing a regeneration never does.

## Provider

The server calls the OpenAI Image API directly with `OPENAI_API_KEY`; no OpenAI
SDK dependency is added.

- Default model: `gpt-image-2`
- Endpoint: `POST https://api.openai.com/v1/images/generations`
- Output: WebP
- Feature flag: `BLOG_IMAGE_ENABLED=true`
- Optional configuration: `BLOG_IMAGE_MODEL`, `BLOG_IMAGE_TIMEOUT_MS`,
  `BLOG_IMAGE_QUALITY`, and `BLOG_IMAGE_MAX_INLINE`

Prompts are built on the server from a fixed allowlist of broad mental-health
themes and conservative medical visual briefs. Article titles, excerpts,
headings, and body copy are inspected locally but are never copied verbatim
into the provider prompt. Prompts must not request or imply:

- PHI or identifiable patients;
- a fabricated likeness of Dr. Melva Reve;
- dramatized crisis, self-harm, violence, or distress;
- medication packaging, pills as treatment promises, readable text, or logos;
- diagnoses, outcomes, cures, testimonials, before/after scenes, or guaranteed
  results.

Visuals should be calm, educational, non-diagnostic, inclusive, and suitable
for a psychiatry practice article under human review.

## Vercel Blob

The production migration uses the official `@vercel/blob` SDK for upload,
download, and physical deletion with stable managed object keys.

Only keys matching `blog-images/posts/*.webp` are accepted. Public reads go
through the application route:

`GET /public-objects/blog-images/posts/:filename.webp`

The route re-validates the filename, returns only WebP, and does not expose
listing, arbitrary bucket keys, uploads, or admin operations.

Deleting an AI variant first claims the unselected row atomically, then deletes
its physical object, and only then removes the database row. A storage failure
leaves a retryable `deletion_pending` reference; an already absent object is
treated idempotently.

## Sanitization and Rendering

AI article generation continues to prohibit `img`, `figure`, and `figcaption`
in model-produced HTML.

The image backend owns image markup. A shared renderer:

1. reads selected `inline` variants from `blog_post_images`;
2. inserts a safe `figure/img/figcaption` after the matching heading;
3. falls back to a deterministic heading position if the stored anchor no
   longer exists;
4. emits only managed internal `publicUrl` values and safe dimensions, alt,
   caption, and lazy-loading attributes.

Server sanitization and client DOMPurify allow those three tags only for this
managed structure. Unsafe or external `src` values are removed.

## Admin Contract

All image endpoints use the existing admin guard. Listing remains read-only;
every mutation accepts draft posts only:

- list variants for a post;
- generate hero and/or inline variants;
- regenerate by creating a new variant;
- select a completed variant;
- remove a selected inline variant from its article slot;
- delete an unselected variant and its object.

Regeneration never overwrites or deselects the current selection while work is
in progress. A post cannot leave draft while image generation or deletion is in
progress. Published, pending-review, rejected, or missing posts reject image
mutations. Selecting and removing inline placement are explicit human actions.

## Auto Generate Integration

Sprint 16 remains the durable source of truth for generation runs and events.
After the private draft is saved with its curated hero:

1. record an image-generation progress step;
2. if image generation is enabled, attempt one hero and up to two inline
   variants;
3. persist success or failure per variant without selecting AI output;
4. complete the run with warnings when any image fails;
5. run verification after the image attempt.

The result remains a private draft with `publishedAt: null`. This sprint adds no
autopublish, scheduler, sitemap mutation, or Search Console submission.

## Replit Deployment Gate

Before a real smoke test:

1. Pull the branch and run `npm run db:push`.
2. Connect a Vercel Blob store and configure its project credentials.
3. Set `BLOG_IMAGE_ENABLED=true`.
4. Confirm `OPENAI_API_KEY` exists without printing it.
5. Optionally set `BLOG_IMAGE_MODEL=gpt-image-2`.
6. Run `npm run check` and `npm run build`.
7. Auto Generate one post and confirm the curated hero survives any image
   failure.
8. Confirm the run records image progress and still completes with warnings.
9. Generate/regenerate/select/remove-inline/delete variants in admin.
10. Confirm regeneration preserves the selected image until a human selects the
    new variant.
11. Confirm deletion removes both the object and its database row.
    Retry after an interrupted delete and confirm a missing object is harmless.
12. Confirm inline figures appear after their stored heading in React and the
    server-rendered article without changing stored article HTML.
13. Confirm the public route rejects traversal, non-WebP files, and arbitrary
    bucket keys.
14. Confirm the post remains `draft`, no public listing/sitemap entry appears,
    and no Search Console or publish action runs.

## July 30, 2026 Next/Vercel Hardening Addendum

The live migration review exposed two usability gaps in the original Sprint 17
delivery:

- the v1 prompt forced a still life or abstract metaphor, which produced
  repetitive desk/window scenes and excluded useful human editorial scenes;
- the admin eye action rendered plain sanitized text without the public article
  typography or selected inline images.

The hardening changes the prompt to `healing-minds-v3`, adds deterministic
topic-specific scene and composition families, and incorporates the approved
Healing Minds light editorial direction: fictional diverse adults, cream/sage
neutrals, clear backgrounds, vibrant but natural color, studio and location
campaign treatments, controlled directional light, authentic skin/fabric
texture, believable expressions, physical-realism constraints, and anti-cliche
mental-health rules.

The admin now loads a dedicated authenticated preview response that
materializes selected inline variants with the same server renderer used by the
public API. The public post and admin preview also share the same client
sanitizer and article preparation utility, so headings, lists, links, figures,
captions, and managed image validation do not drift.

The reusable rules and clone checklist live in
[`BLOG_VISUAL_EDITORIAL_METHOD.md`](./BLOG_VISUAL_EDITORIAL_METHOD.md).
