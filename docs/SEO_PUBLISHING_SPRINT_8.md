# SEO Publishing Sprint 8 - Editorial Brief and Content Depth

## Goal

Make AI-generated drafts more structured and closer to human review quality before adding images or Auto Generate.

Sprint 7 made drafts mechanically cleaner with tags, internal links, and a stronger publish gate. Sprint 8 adds an editorial brief that the AI must follow:

- target word count,
- minimum acceptable depth,
- search intent,
- audience,
- required H2 section plan,
- internal-link targets,
- source requirement,
- editorial risk notes.

## In Scope

1. Build a deterministic editorial brief before calling the AI provider.
2. Pass the editorial brief into the prompt.
3. Return the editorial brief in the admin response.
4. Show the brief in the admin AI notes panel.
5. Increase default AI token budget so longer structured drafts are less likely to truncate.
6. Add risk notes when generated copy is below the brief's minimum/target word count.
7. Fail closed if the AI provider reports a truncated response.
8. Add risk notes when generated structure appears thin:
   - too few H2 sections,
   - expected brief sections missing or renamed.
9. Support condition-specific section matching in English and Spanish.

## Out of Scope

- No DB migration.
- No image generation.
- No image upload/storage.
- No SSE/progress UI.
- No Auto Generate batch workflow.
- No autopublish.
- No Search Console changes.
- No embeddings/vector DB.
- No automatic clinical expansion of existing posts.

## Safety Rules

- AI still creates drafts only.
- Human review remains mandatory.
- The brief guides structure; it does not override YMYL safety rules.
- If a draft is short, save it with a risk note rather than asking the model to invent filler.
- If the provider truncates the response, reject the draft instead of saving partial content.
- Do not add new external sources outside the curated source library.
- Do not make publication easier in this sprint.

## Acceptance Criteria

1. `npm run check` passes.
2. `npm run build` passes.
3. AI Generate response includes `ai.editorialBrief`.
4. `editorialBrief.targetWordCount` is present and normally around 1,100-1,250 words.
5. `editorialBrief.requiredSections` includes a condition-specific section when the topic matches anxiety, depression, ADHD, PTSD, bipolar, or medication.
6. The admin AI notes panel displays target word count and section plan.
7. A short generated draft receives a risk note about being below minimum/target depth.
8. A structurally thin draft receives a risk note about H2/section coverage.
9. Spanish topics such as `ansiedad` and `medicamentos` can trigger condition-specific sections.
10. Draft-only behavior remains unchanged.

## Replit Smoke Plan

After merge/pull:

1. Run `npm run check`.
2. Run `npm run build`.
3. Generate a real draft for `Anxiety treatment options in Naples`.
4. Confirm response contains:
   - `ai.editorialBrief.targetWordCount`,
   - `ai.editorialBrief.requiredSections`,
   - `ai.research`,
   - `ai.semanticMemory`.
5. Confirm admin panel shows the target word count and section plan.
6. Confirm draft remains:
   - `status: "draft"`,
   - `publishedAt: null`,
   - private from public API/routes/sitemap.
7. Confirm no images, Search Console submission, or publish action is triggered.

## 2026-07-30 follow-up: bounded depth expansion

The original Sprint 8 intentionally saved a short draft with a warning instead
of making a second provider call. After a real Preview smoke produced 595 words
against an 800-word minimum and a 1,100-word target, the generation flow was
hardened:

1. The first prompt now states the exact minimum, target, and maximum as success
   criteria.
2. A validated draft below the minimum receives exactly one expansion pass
   before it is returned to the admin.
3. The expansion reuses the saved draft, editorial brief, internal-link
   allowlist, and curated source allowlist.
4. The expansion may not add sources, URLs, studies, statistics, patient
   stories, credentials, diagnoses, guarantees, or personalized advice.
5. The expanded JSON is run through the same sanitizer, URL allowlists,
   disclaimer checks, structure checks, and word counter as the first response.
6. If the second call fails or does not create a longer valid draft, the first
   safe draft remains available with an explicit human-review warning.
7. Draft-only and human publish approval remain unchanged.

This follow-up affects newly generated drafts. It does not silently rewrite
previously saved drafts.
