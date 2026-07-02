# SEO Publishing Sprint 10 - Auto Generate Workflow

## Goal

Add the first XL Homes-style Auto Generate action that can plan and create one blog draft in a traceable workflow.

This is not batch publishing. It is one admin-only action that:

- plans candidate topics,
- selects a low-overlap candidate,
- runs the existing AI draft pipeline,
- saves exactly one unpublished draft,
- returns the workflow steps and verification report.

## In Scope

1. Add an admin endpoint:
   - `POST /api/admin/blog/auto-generate`.
2. Reuse the existing manual generation chain:
   - PHI guard,
   - provider config check,
   - rate limit,
   - taxonomy selection,
   - internal links,
   - trusted research,
   - semantic memory,
   - editorial brief,
   - AI draft generation,
   - server-side HTML sanitization,
   - verification report.
3. Use the Sprint 9 topic planner before generation.
4. Generate only when the planner finds a `recommended` candidate.
5. Return `workflow.steps` for the admin UI:
   - topic plan,
   - topic selection,
   - editorial context,
   - taxonomy and links,
   - trusted research,
   - semantic memory,
   - editorial brief,
   - AI draft,
   - sanitize and save,
   - verification.
6. Add an admin modal for Auto Generate.

## Out of Scope

- No batch generation.
- No cron/scheduler.
- No image generation.
- No image upload/storage.
- No SSE/live streaming.
- No sitemap changes.
- No Search Console.
- No autopublish.
- No DB migration.

## Safety Rules

- Auto Generate must create `status = "draft"` only.
- `publishedAt` must stay `null`.
- Human review remains mandatory through the existing publish gate.
- If no low-overlap topic is available, return `409` and do not create a draft.
- Inputs must reject likely patient-identifying information.
- External URLs remain restricted by the curated allowlist in the existing AI validation.
- HTML must continue through `sanitizeBlogContentHtml` on the server and DOMPurify in the client.
- The workflow must not call the SEO publishing hook.

## Acceptance Criteria

1. `npm run check` passes.
2. `npm run build` passes.
3. `POST /api/admin/blog/auto-generate` is protected by the existing `/api/admin/*` guard.
4. With AI disabled or missing config, the endpoint returns `503` and creates no draft.
5. With PHI in `focus`, the endpoint returns `400` and creates no draft.
6. With no recommended topic, the endpoint returns `409`, includes workflow/topic-plan data, and creates no draft.
7. With a recommended candidate and AI enabled, the endpoint returns `201`.
8. The created post has `status: "draft"` and `publishedAt: null`.
9. Response includes `workflow.steps`, `ai.research`, `ai.semanticMemory`, `ai.editorialBrief`, `checks`, and `verification`.
10. The draft does not appear in the public blog API, public route, or sitemap.
11. Publishing directly from draft still fails until human review.

## Replit Smoke Plan

1. Pull and restart the app.
2. Run `npm run check`.
3. Run `npm run build`.
4. Count posts before the test.
5. Temporarily disable AI and confirm Auto Generate returns `503` with no new rows.
6. Re-enable AI and test PHI in focus, such as an email or phone number; expect `400` and no new rows.
7. Run Auto Generate with a safe focus that has a recommended candidate.
8. Confirm response has workflow steps and one new draft.
9. Confirm the draft is private:
   - not in `GET /api/blog/posts`,
   - public route is 404,
   - sitemap does not include it.
10. Try publishing directly from draft and confirm the human-review gate blocks it.
