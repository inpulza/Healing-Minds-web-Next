# SEO Publishing Sprint 6 - Research Sources and Semantic Memory

## Goal

Make AI Generate write with guardrails instead of writing from a blank prompt.

Sprint 6 gives the generator:

- trusted source suggestions from a curated medical/YMYL source list,
- a lightweight semantic memory scan of existing blog posts,
- server validation that rejects external source links outside the verified allowlist.

The output is still an unpublished draft only.

## Scope

- Add curated source selection in `server/blog/ai/research.ts`.
- Add lightweight anti-cannibalization memory in `server/blog/ai/memory.ts`.
- Pass selected sources and memory into the AI prompt.
- Allow the model to cite only trusted source URLs selected by the server.
- Reject generated external links that are not in the source allowlist.
- Return transient `ai.research` and `ai.semanticMemory` data after draft generation.
- Show a small research/memory note panel in the admin editor after generation.
- Extend the PHI guard to `topic`, `targetKeyword`, and `additionalContext`.

## Non-Goals

- No dynamic web browsing.
- No source scraping.
- No source vault database migration.
- No embeddings or vector DB.
- No image generation.
- No SSE/progress stream.
- No Search Console behavior changes.
- No auto-publish.

## Source Policy

Trusted sources are curated and deterministic. Each selected source includes:

- URL,
- title,
- publisher,
- domain,
- source category,
- summary,
- confidence,
- access date.

The model may only include external links from the selected source URLs. If it returns any other external URL, the server returns `502` and does not create a draft.

## Semantic Memory Policy

Memory scans existing posts in the same language using:

- topic,
- target keyword,
- category,
- tags,
- title,
- slug,
- excerpt,
- body text.

It returns possible overlap with:

- post id,
- title,
- slug,
- status,
- score,
- overlapping terms,
- recommendation: `create_new`, `change_angle`, or `update_existing`.

This is intentionally heuristic. No embeddings or new storage are added in this sprint.

## Review Checklist

1. `npm run check` passes.
2. `npm run build` passes.
3. AI Generate still saves only `status: "draft"` and `publishedAt: null`.
4. No image, Search Console, sitemap, public API, or publish-hook behavior changes.
5. Generated HTML is still sanitized by the server.
6. Generated external source links are restricted to selected trusted source URLs.
7. PHI guard rejects sensitive text in topic, target keyword, and additional context.
8. Response includes `ai.research.sources`.
9. Response includes `ai.semanticMemory.matches`.
10. Admin editor shows transient source/memory notes after generation.
11. Draft remains absent from public API and sitemap until published.

## Replit Smoke Test

1. Pull `main` after PR merge.
2. Run `npm run check`.
3. Run `npm run build`.
4. Try topic/keyword/context with an email or phone and confirm `400`.
5. Generate a draft for a topic close to an existing post, such as anxiety treatment.
6. Confirm HTTP `201`, `status: "draft"`, `publishedAt: null`.
7. Confirm response has trusted sources and semantic memory matches.
8. Confirm content includes only trusted external source URLs.
9. Confirm the admin editor displays source/memory notes.
10. Confirm the draft is not public and not in the sitemap.
