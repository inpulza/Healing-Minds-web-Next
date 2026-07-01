# SEO Publishing Sprint 7 - Editorial Taxonomy and Draft Readiness

## Goal

Move AI-generated drafts closer to human review without changing the safety model.

The generator already creates safe drafts with trusted sources and semantic memory. This sprint adds deterministic editorial completion for fields that the system can safely infer:

- topic tags,
- internal links,
- reusable Fix buttons for old drafts,
- small cleanup from Sprint 6 review notes.

## In Scope

1. AI Generate may auto-select topic tags from existing tags in the same language.
2. AI Generate may add a short internal-link paragraph when the model returns no internal links.
3. Verification exposes deterministic fixes for:
   - `tagsMinimum` / `tagsDepth`,
   - `internalLinks`.
4. Fixes still reject published posts.
5. Publishing requires the post to be in `pending_review` and to have zero blocking verification checks.
6. Fixes only use existing local data:
   - article title,
   - excerpt,
   - body text,
   - category,
   - existing tag list,
   - approved internal-link map.
7. Admin still shows the resulting verification report after each fix.
8. Cleanup:
   - remove unused semantic memory formatter,
   - remove `samhsa.gov` from generated research queries until SAMHSA is part of the curated source library.

## Out of Scope

- No DB migration.
- No AI image generation.
- No autopublish.
- No Search Console hook.
- No SSE/progress UI.
- No embeddings/vector DB.
- No broad web browsing.
- No automatic clinical expansion of article depth.

## Safety Rules

- AI generation remains draft-only.
- Human review remains required before publish.
- Drafts cannot be published directly; they must move to pending review first.
- Published posts cannot receive automatic fixes.
- Tag selection is advisory/deterministic; it never creates new tags.
- Internal-link fix can only use known internal routes.
- The system must not invent medical claims to satisfy SEO depth warnings.

## Acceptance Criteria

1. `npm run check` passes.
2. `npm run build` passes.
3. AI Generate with no selected tags on an anxiety topic creates a draft with at least one matching existing tag.
4. AI Generate output includes at least one internal link even if the model omitted it.
5. A draft with no tags can be fixed with `fixType: "tags"`.
6. A draft with no internal links can be fixed with `fixType: "internalLinks"`.
7. The same fixes return 400 for published posts.
8. Direct publish from `draft` returns 400.
9. Publish from `pending_review` is allowed only with zero blocking verification checks.
10. Draft remains private: no public API, no public route, no sitemap.

## Replit Smoke Plan

After merge/pull:

1. Run `npm run check`.
2. Run `npm run build`.
3. With `OPENAI_API_KEY`, generate a draft from a topic such as:
   - `Anxiety treatment options in Naples`
4. Confirm:
   - `status: "draft"`,
   - `publishedAt: null`,
   - at least one tag selected automatically,
   - `verification.tagsMinimum.ok === true`,
   - `verification.internalLinks.ok === true`,
   - draft is not public and not in sitemap.
5. Create or edit a draft with no tags and run:
   - `POST /api/admin/blog/posts/:id/fix` with `fixType: "tags"`.
6. Create or edit a draft with no internal links and run:
   - `POST /api/admin/blog/posts/:id/fix` with `fixType: "internalLinks"`.
7. Confirm both fixes reject a published post.
8. Confirm direct publish from draft fails.
9. Confirm publish from pending review succeeds only after blockers are clean.
