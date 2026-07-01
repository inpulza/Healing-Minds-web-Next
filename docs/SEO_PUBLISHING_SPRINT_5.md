# SEO Publishing Sprint 5 - AI Generate Manual Draft

## Goal

Add the first AI-assisted blog generation workflow to the admin while preserving the editorial safety model from Sprint 4.

The AI creates an unpublished draft only. It never publishes, never submits to Search Console, never adds images, and never bypasses human review.

## Scope

- Add server-only AI generation modules under `server/blog/ai/`.
- Add `POST /api/admin/blog/generate-draft`.
- Add an in-memory generation rate limit.
- Add admin UI button/modal for topic + context + language + author/category/tags.
- Save generated output as `status = draft` and `publishedAt = null`.
- Sanitize generated HTML through `sanitizeBlogContentHtml`.
- Return existing publish checks and the Sprint 4 verification report after saving.
- Reject obvious patient-identifying data in `additionalContext`.

## Non-Goals

- No web research.
- No citations or generated sources.
- No semantic memory.
- No image generation.
- No SSE/progress stream.
- No Search Console behavior changes.
- No database migration.
- No auto-publish.

## Required Env

- `OPENAI_API_KEY`

Optional:

- `BLOG_AI_ENABLED=false` disables the endpoint.
- `BLOG_AI_MODEL` overrides the default model.
- `BLOG_AI_TIMEOUT_MS` overrides the provider timeout.
- `BLOG_AI_MAX_TOKENS` overrides max output tokens.
- `BLOG_AI_HOURLY_LIMIT` overrides the per-IP hourly generation limit.

## Review Checklist

1. `npm run check` passes.
2. `npm run build` passes.
3. Endpoint is under `/api/admin/*` auth guard.
4. Missing topic returns `400`.
5. Missing AI config returns `503` and creates no draft, even after repeated calls.
6. Generated post is saved as `draft` with `publishedAt = null`.
7. Draft does not appear in public blog API, public route, or sitemap.
8. Generated HTML is sanitized by the server.
9. Response includes `checks` and `verification`.
10. Publish gate still blocks incomplete drafts.
11. Prompt does not ask the model to invent sources, claims, credentials, patient stories, reviews, or guarantees.
12. Additional context warning prevents obvious emails, phone numbers, SSN-like values, DOB/date-of-birth text, medical/member/patient IDs, and named-patient snippets.

## Request / Response Contract

Request body:

```json
{
  "topic": "Anxiety treatment options in Naples",
  "additionalContext": "Optional editorial angle. No patient data.",
  "targetKeyword": "anxiety treatment Naples",
  "language": "en",
  "authorId": 1,
  "categoryId": 1,
  "tagIds": [1, 2],
  "internalLinks": ["/services", "/contact"]
}
```

Success response:

```json
{
  "success": true,
  "data": { "status": "draft", "publishedAt": null },
  "checks": [],
  "verification": {},
  "ai": { "riskNotes": [] }
}
```

Validation order:

1. Validate payload shape.
2. Reject obvious PHI in `additionalContext`.
3. Validate AI config and disabled state.
4. Count rate limit.
5. Validate selected author/category/tags.
6. Call the provider and save the sanitized draft.

## Replit Smoke Test

1. Pull `main` after PR merge.
2. Run `npm run check`.
3. Run `npm run build`.
4. With `BLOG_AI_ENABLED=false`, call `POST /api/admin/blog/generate-draft` and confirm `503`.
5. With AI env configured, generate a draft from a real topic.
6. Confirm admin response has `status: "draft"` and `publishedAt: null`.
7. Confirm the slug is not public while draft.
8. Confirm sitemap does not include the draft.
9. Open the draft in `/admin/blog`, verify report appears.
10. Try publishing an incomplete draft and confirm the publish gate still blocks.
