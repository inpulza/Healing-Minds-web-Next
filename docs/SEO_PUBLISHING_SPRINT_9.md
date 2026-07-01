# SEO Publishing Sprint 9 - Auto Topic Planner

## Goal

Add the first XL Homes-style automation step without generating posts in bulk.

Sprint 9 proposes and ranks article topics before AI Generate. It helps the editor see:

- topic idea,
- target keyword,
- category,
- suggested existing tags,
- internal links,
- trusted source coverage,
- semantic overlap/cannibalization risk,
- editorial brief/depth target.

## In Scope

1. Add a deterministic admin endpoint:
   - `POST /api/admin/blog/topic-plan`.
2. Build topic candidates from curated Healing Minds templates.
3. Reuse existing infrastructure:
   - taxonomy/tag selection,
   - internal-link selection,
   - trusted source selection,
   - semantic memory,
   - editorial brief.
4. Return scored candidates with:
   - `score`,
   - `noveltyScore`,
   - `overlapScore`,
   - `recommendation`,
   - `riskNotes`.
5. Add a small admin planner modal.
6. Allow the editor to load a candidate into the existing AI Generate form.

## Out of Scope

- No OpenAI call.
- No draft creation.
- No batch generation.
- No image generation.
- No image upload/storage.
- No SSE/progress stream.
- No Search Console.
- No sitemap changes.
- No autopublish.
- No DB migration.

## Safety Rules

- Planner inputs must reject likely patient-identifying information.
- Planner must be admin-only through the existing `/api/admin/*` guard.
- Planner must not create, update, publish, or delete posts.
- Topic overlap should warn and downgrade candidates, not silently duplicate content.
- High-overlap candidates should recommend updating or changing angle.
- Existing taxonomy only: do not create categories/tags.
- Existing curated sources only: do not invent external sources.

## Acceptance Criteria

1. `npm run check` passes.
2. `npm run build` passes.
3. `POST /api/admin/blog/topic-plan` returns candidates without `OPENAI_API_KEY`.
4. The endpoint does not insert rows in `blog_posts`.
5. Candidates include `score`, `overlapScore`, `recommendation`, `research`, `semanticMemory`, and `editorialBrief`.
6. A focus such as `anxiety` ranks anxiety candidates higher.
7. A Spanish request can return Spanish candidates.
8. The admin shows the planner modal and candidate cards.
9. "Use for Draft" fills the existing AI Generate form; draft creation still requires the editor to click Generate.
10. Existing draft-only/publish gates remain unchanged.

## Replit Smoke Plan

1. Run `npm run check`.
2. Run `npm run build`.
3. Call planner with English anxiety focus.
4. Confirm response includes candidates and no blog post count increase.
5. Call planner with Spanish `ansiedad medicamentos` focus.
6. Confirm Spanish candidates and overlap/recommendation fields.
7. In `/admin/blog`, open Plan Topics, run planner, click "Use for Draft".
8. Confirm AI Generate is prefilled but no draft exists until Generate is clicked.
