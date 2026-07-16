# SEO Publishing Sprint 16 - Durable Auto Generate Progress

## Goal

Make the existing Auto Generate workflow observable and recoverable without changing its clinical or publishing behavior.

The admin should see each real step while it runs. A browser refresh or reconnect must recover the same run instead of creating a duplicate draft.

## XL Homes Reference

XL Homes proves the useful interaction pattern:

- a progress modal,
- one visible status per generation step,
- completion and partial-failure feedback.

Healing Minds keeps that interaction but does not copy XL Homes' in-memory session maps. Runs and events are stored in Postgres so the workflow can survive a browser reconnect and remain inspectable across application instances.

## In Scope

1. Persist Auto Generate runs and ordered progress events.
2. Start a run with a validated admin-only `POST` endpoint.
3. Stream persisted events through an admin-only SSE endpoint.
4. Expose a status endpoint for reconnect and recovery.
5. Use an idempotency key so a double click or reconnect cannot create a second draft.
6. Claim each queued run atomically so only one worker executes it.
7. Mark abandoned running jobs as interrupted after a stale heartbeat.
8. Reuse the existing Auto Generate pipeline and its exact guardrails.
9. Retire the synchronous `/api/admin/blog/auto-generate` endpoint so it cannot bypass idempotency and durable claims.
10. Update the admin modal with `pending`, `in_progress`, `completed`, and `failed` states.

## Safety Rules

- The result is always `status: draft` with `publishedAt: null`.
- Human review remains mandatory before publication.
- PHI checks run before planning, and raw free-form focus is never persisted or sent to the AI provider.
- Provider configuration and rate limiting remain enforced.
- HTML still passes through `sanitizeBlogContentHtml` and client DOMPurify.
- External URLs remain restricted to the curated source allowlist.
- A run creates at most one draft.
- SSE observes persisted work; it does not start generation.

## Out of Scope

- No AI image generation or inline images.
- No batch generation, cron, or scheduler.
- No automatic retry of AI calls.
- No autopublish.
- No sitemap or Search Console calls during generation.
- No changes to the `draft -> pending_review -> published` gate.

## Expected Flow

1. The admin submits Auto Generate with a new idempotency key.
2. The server validates input, author/category, PHI, provider config, and rate limit.
3. The server creates a `planning` run without persisting the raw focus, resolves the curated topic, and moves the run to `queued`.
4. The server returns `202` with `runId`; a worker claims the queued run and records each workflow transition.
5. The browser opens the SSE endpoint and replays stored events in order.
6. On completion, the run stores the resulting `postId` and response summary.
7. On reconnect, the same `runId` replays its current state and final result.

## Acceptance Criteria

1. `npm run check` passes.
2. `npm run build` passes.
3. New run, status, and SSE endpoints are protected by the existing admin guard.
4. Missing AI configuration returns `503` and creates no run.
5. PHI input returns `400` and creates no run.
6. Two starts with the same idempotency key return the same run.
7. Only one worker can claim a queued run.
8. Progress reaches the UI incrementally, not only after completion.
9. Reconnecting to SSE replays the stored events without another generation.
10. A successful run creates exactly one private draft.
11. A failed run records a clear terminal error.
12. The draft stays outside the public API, public route, and sitemap.
13. Direct `draft -> published` remains blocked.

## Replit Smoke Plan

1. Pull and run `db:push` before restarting the app. This is a deployment gate: do not deploy if the two run/event tables or the single-open-run index fail to apply.
2. Run `npm run check` and `npm run build`.
3. Verify PHI and missing-provider failures create no run or post.
4. Start a real run and confirm progress appears step by step.
5. Refresh or reconnect during/after the run and confirm the same run resumes.
6. Submit the same idempotency key twice and confirm one run and one draft.
7. Confirm the completed post is a private draft with `publishedAt: null`.
8. Confirm no public API, route, sitemap, Search Console, or publish action was triggered.
