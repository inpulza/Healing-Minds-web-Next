# SEO Publishing Sprint 18 - Strategic Auto Generate Topic Planner

Status: implemented on `codex/healing-topic-planner-sprint-18`; pending Replit
database migration and real provider smoke before merge.

Base: `main` after Sprint 17 merge `530bd25`.

## Practical outcome

`Auto Generate` becomes a genuinely automatic editorial workflow:

1. the admin chooses only the language when needed;
2. the system proposes five strategy-aware topics;
3. it evaluates all five against existing drafts and published posts;
4. it rejects cannibalization and unsafe medical angles;
5. it selects the best topic, category, keyword, pillar, patient stage, format
   and angle;
6. it creates one recoverable private draft;
7. it attempts reviewed image candidates;
8. it runs real verification;
9. a human reviews the result before any publication.

The primary Auto Generate flow will not ask the user to choose a category,
focus or number of ideas.

## Evidence used

### XL Homes

The current XL Homes Repl was audited read-only at:

`main` @ `d03676b8a91cf155e9a8dcfdd5be8f5e9f1872b6`

The audit confirms the useful behavior:

- zero topic/category input in Auto Generate;
- five candidates per run;
- every candidate evaluated before selection;
- niche boilerplate removed before lexical similarity;
- a semantic LLM judge;
- category selected by the winning idea before writing;
- private draft and human publication decision.

It also confirms debt that must not be copied:

- scoring limited to overlap, listicles and recent category;
- strategy mostly hardcoded inside prompts;
- conflicting taxonomies;
- no durable candidate/judge evidence;
- in-memory sessions;
- cosmetic verification;
- guided generation bypassing the planner;
- fabricated "verified facts" in the last research fallback;
- inline figures baked into content;
- duplicated and vestigial endpoints.

### Healing Minds

Healing Minds already has stronger foundations:

- Sprint 16: Postgres generation runs/events, idempotency, claims, replay,
  reconnect and interrupted-run handling.
- Sprint 17: persistent image variants, curated fallback, human selection,
  fail-open image generation and inline placement by `anchorHeading` without
  modifying `blog_posts.content`.
- Existing YMYL prompt rules, curated source allowlist, HTML sanitization,
  review gate and admin guard.

Sprint 18 extends those sources of truth. It does not import the XL Homes
session architecture or HTML behavior.

## Current gaps in Healing Minds

1. Auto Generate preselects the first category and presents it as an editorial
   choice.
2. Only `Anxiety Treatment` and `Ansiedad` are seeded.
3. The planner ranks eight fixed templates per language instead of generating a
   strategy-aware candidate batch.
4. Topics that do not match a category fall back to `categories[0]`.
5. Semantic memory uses an asymmetric token-overlap calculation over title,
   excerpt, tags and body text.
6. There is no LLM semantic duplicate judge.
7. Pillar, patient stage, format, cluster saturation and business priority are
   not structured planner fields.
8. Candidate decision evidence is present only as a workflow JSON snapshot; it
   is not normalized or queryable.
9. Guided AI Generate does not use the same final topic guard.
10. The UI exposes internal controls (`Category`, `Ideas checked`, `Focus`) that
    shift strategy work back to the user.

## Product contract

### Auto Generate inputs

Primary modal:

- `Language`: English or Spanish.
- `Author`: hidden when there is one eligible author; shown only if multiple
  valid authors exist.
- One primary action: `Auto Generate Draft`.

Removed from the primary flow:

- category;
- focus;
- number of ideas.

Language remains explicit for Sprint 18 because choosing the language changes
the public URL, taxonomy, research sources and clinical copy. A future cadence
planner may automate EN/ES rotation, but that is not required here.

### Auto Generate output

The workflow must display, after selection:

- selected topic;
- target keyword;
- category;
- content pillar;
- patient-journey stage;
- format;
- expertise angle;
- short reason for selection;
- candidate count and whether a second batch was required.

It must never expose chain-of-thought. It shows stored score components and
short operational reasons only.

### Human gate

- The result is always `draft`.
- `publishedAt` remains `null`.
- AI images remain candidates until selected by a human.
- Auto Generate never changes sitemap, Search Console or publication state.
- The existing `draft -> pending_review -> published` gate remains mandatory.

## Strategy registry

Add a single versioned runtime registry:

`server/blog/strategy/healing-minds.ts`

The planner, seed, category resolver, prompt builder, scorer and validation
must import this registry. It cannot be a decorative config.

Initial strategy version:

`healing-minds-topic-strategy-v1`

### Canonical bilingual categories

Existing category rows are preserved. Missing rows are inserted idempotently;
no category is deleted.

| Key | English | English slug | Spanish | Spanish slug |
|---|---|---|---|---|
| anxiety | Anxiety Treatment | `anxiety-treatment` | Ansiedad | `ansiedad` |
| depression | Depression Treatment | `depression-treatment` | Depresión | `depresion` |
| adult_adhd | Adult ADHD Care | `adult-adhd` | TDAH en Adultos | `tdah-adultos` |
| trauma_ptsd | PTSD & Trauma | `ptsd-trauma` | TEPT y Trauma | `tept-trauma` |
| bipolar | Bipolar Care | `bipolar-care` | Trastorno Bipolar | `trastorno-bipolar` |
| medication | Medication Management | `medication-management` | Manejo de Medicamentos | `manejo-medicamentos` |
| telepsychiatry | Telepsychiatry | `telepsychiatry` | Telepsiquiatría | `telepsiquiatria` |
| psychiatric_guides | Psychiatric Care Guides | `psychiatric-care-guides` | Guías de Atención Psiquiátrica | `guias-atencion-psiquiatrica` |

Aliases map existing site/service terminology to these keys. Resolution must
fail with an actionable error when a generated category is not in the
registry; it must never silently use the first category.

### Content pillars

Initial relative priorities are based on the services and journeys already
published on the site, not on unverified search-volume claims:

| Pillar | Relative priority | Purpose |
|---|---:|---|
| `condition_education` | 22 | Conservative education about anxiety, depression, ADHD, PTSD and bipolar care |
| `evaluation_care_journey` | 20 | What evaluation, appointments and follow-up can look like |
| `medication_safety` | 18 | Questions, monitoring and shared decision-making without dosage advice |
| `access_telepsychiatry` | 15 | Florida telepsychiatry, access and visit preparation |
| `daily_function` | 10 | Sleep, work, routines and relationships without diagnosing the reader |
| `local_service_navigation` | 8 | Naples/Florida service navigation using only verified practice facts |
| `family_support` | 7 | Educational support for families and caregivers without patient stories |

The numbers are configurable relative weights. They are not percentages of
published content and do not override saturation or safety gates.

### Patient-journey stages

- `recognition`
- `evaluation`
- `treatment_consideration`
- `ongoing_care`

`crisis` is not an acquisition/content stage. Crisis language is limited to
the required safety resources and disclaimers.

### Allowed formats

- `explainer`
- `what_to_expect`
- `questions_to_ask`
- `comparison`
- `checklist`
- `local_guide`
- `follow_up_guide`

`Top`/`Best` listicles are discouraged and limited to at most one candidate per
batch. A cosmetic year, season or location change never makes a duplicate
topic unique.

### Prohibited topic behavior

Candidates must not request:

- diagnosis of the reader or self-diagnosis tests;
- personalized treatment or medication recommendations;
- medication dosages or prescriptive drug comparisons;
- cure, outcome or response guarantees;
- fabricated patient stories, testimonials or case studies;
- dramatized crisis or self-harm content;
- unverified statistics, studies, credentials or practice claims;
- PHI or identifiable patient information.

## Candidate contract

Every AI-proposed candidate must satisfy a structured schema:

```ts
type TopicCandidateProposal = {
  candidateKey: string;
  topic: string;
  targetKeyword: string;
  language: "en" | "es";
  categoryKey: string;
  pillar: string;
  patientStage: string;
  contentFormat: string;
  searchIntent: string;
  expertiseAngle: string;
  whyTimely: string;
  sourceRecommendationIds: string[];
  createOrUpdate: "create_new" | "update_existing";
};
```

All enums are validated against the strategy registry. The model cannot invent
categories, source identifiers, pillars, stages or formats.

## Planner algorithm

### Batch limits

- Default batch: 5 candidates.
- Maximum second batch: 1.
- Maximum candidates considered per run: 10.
- The user cannot change these limits from the primary UI.

### Phase 1 - local inventory

Build a safe planning inventory from:

- published, pending-review and draft post titles;
- language, category and saved strategy fields;
- target keywords and topic keys when available;
- recent category, pillar, stage and format sequence;
- cluster counts;
- curated research-source coverage.

Do not send article bodies, free-form focus, patient data or admin notes to the
topic provider.

Legacy posts without Sprint 18 fields are classified deterministically from
their title, category, tags and known service aliases. The classification is
used as planning context and marked `legacy_inferred`; it is not silently
written back to published content.

### Phase 2 - structured ideation

Request five candidates in one provider call using:

- strategy version;
- allowed category/pillar/stage/format enums;
- aggregate cluster saturation;
- recent editorial sequence;
- existing normalized topic inventory;
- curated source identifiers;
- YMYL prohibitions.

The provider returns Structured Outputs. Server-side Zod validation still runs
even when the API enforces the JSON schema.

### Phase 3 - deterministic gates

For each candidate:

1. validate all enums and safe text limits;
2. reject exact normalized title/topic matches;
3. calculate symmetric core-token Jaccard similarity;
4. calculate category, cluster, intent and format overlap;
5. reject prohibited YMYL patterns;
6. reject saturated `create_new` clusters;
7. retain the top three matching posts as evidence.

Initial thresholds:

- similarity `>= 0.30`: record as a meaningful match;
- similarity `>= 0.55`: reject direct creation;
- exact normalized match: reject;
- saturated cluster: reject `create_new`, permit `update_existing`.

Thresholds live in the versioned strategy and are covered by fixtures. They are
not duplicated in route handlers or prompts.

### Phase 4 - semantic judge

One batched judge call evaluates the deterministically viable candidates
against their closest matches.

Judge output:

```ts
type SemanticJudgeDecision = {
  candidateKey: string;
  decision: "duplicate" | "same_cluster_distinct_intent" | "distinct";
  matchedPostIds: number[];
  confidenceBasisPoints: number;
  reason: string;
};
```

The judge classifies duplication. It does not choose the winner and cannot
publish or modify data.

Hard reject:

- `decision === "duplicate"` with confidence `>= 7500`.

If the judge is unavailable:

- retry once only for a transient provider failure;
- accept automatically only when deterministic overlap is below `0.20`, the
  cluster is not saturated and all other safety gates pass;
- otherwise stop before drafting with a recoverable planning error.

This bounded degradation avoids treating provider failure as proof of novelty.

### Phase 5 - score

Viable candidates receive a transparent score from 0 to 100:

| Component | Maximum |
|---|---:|
| Semantic and lexical novelty | 40 |
| Underrepresented cluster opportunity | 18 |
| Strategic pillar priority | 15 |
| Category rotation | 10 |
| Patient-stage gap | 8 |
| Format diversity | 5 |
| Curated research coverage | 4 |

Additional penalties:

- listicle format: `-15`;
- same category as both most recent posts: `-8`;
- same pillar as both most recent posts: `-8`;
- same format as the three most recent posts: `-6`.

Every component and penalty is persisted in `scoreBreakdown`. The highest
viable score wins; deterministic candidate key is the final tie-breaker.

### Phase 6 - no-safe-topic behavior

If the first batch has no viable topic:

1. generate one replacement batch with explicit rejection evidence;
2. re-run all local and semantic gates;
3. if no candidate passes, end the run with `409 no_safe_unique_topic`;
4. create no draft.

Never manufacture uniqueness with a year, season, location synonym or title
rewrite.

## Provider and API plan

Use direct `fetch` and the existing `OPENAI_API_KEY`; no OpenAI SDK dependency
is required.

For new planner calls:

- use the Responses API;
- set `store: false`;
- use Structured Outputs with a JSON schema plus server Zod validation;
- keep models role-specific and environment-overridable;
- preserve provider/model/prompt/strategy versions with each candidate.

Proposed initial configuration, to be confirmed by representative evals and
Replit model access:

- `BLOG_TOPIC_MODEL=gpt-5.6-sol` for the five-candidate strategy batch;
- `BLOG_TOPIC_JUDGE_MODEL=gpt-5.6-terra` for semantic classification;
- `BLOG_TOPIC_REASONING_EFFORT=medium`;
- `BLOG_TOPIC_JUDGE_REASONING_EFFORT=low`;
- `BLOG_TOPIC_TIMEOUT_MS=60000`;
- `BLOG_TOPIC_ENABLED=false` until the real smoke passes.

`BLOG_AI_MODEL` for article writing is not changed by this sprint.

The current model family and role guidance were checked on 2026-07-27. Model
IDs remain configuration rather than being repeated across call sites.

Official references:

- [Responses API migration](https://developers.openai.com/api/docs/guides/migrate-to-responses)
- [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
- [Current model guidance](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.6)

## Persistence model

### New table: `blog_topic_candidates`

One row per candidate:

- `id`
- `runId`
- `batchNumber`
- `candidateKey`
- `language`
- `topic`
- `targetKeyword`
- `categoryId`
- `categoryKey`
- `pillar`
- `patientStage`
- `contentFormat`
- `searchIntent`
- `expertiseAngle`
- `whyTimely`
- `sourceRecommendationIds`
- `strategyVersion`
- `promptVersion`
- `provider`
- `model`
- `deterministicStatus`
- `overlapBasisPoints`
- `matchedPostIds`
- `semanticDecision`
- `semanticConfidenceBasisPoints`
- `semanticReason`
- `score`
- `scoreBreakdown`
- `recommendation`
- `selected`
- timestamps

Indexes:

- unique `(runId, candidateKey)`;
- index `(runId, batchNumber)`;
- partial unique index allowing one selected candidate per run;
- index on `(language, categoryKey, pillar)`.

Candidate rows are the audit source of truth. The generation workflow keeps
only IDs and a small display snapshot for SSE replay.

### New nullable planning fields on `blog_posts`

- `topicCandidateId`
- `topicKey`
- `targetKeyword`
- `contentPillar`
- `patientStage`
- `contentFormat`
- `searchIntent`
- `expertiseAngle`
- `topicStrategyVersion`

The selected candidate populates these fields atomically when Auto Generate
creates the draft. Article generation cannot overwrite them.

Existing posts remain valid with null fields. No published post is edited by
the migration.

### Existing durable sources

Keep:

- `blog_generation_runs` for run status, input, workflow, result and post link;
- `blog_generation_events` for ordered replay;
- `blog_post_images` for image variants.

Do not create a second run/session/event system.

## Workflow integration

Proposed durable steps:

1. `strategy-context`
2. `topic-ideation`
3. `deterministic-review`
4. `semantic-review`
5. `topic-selection`
6. `editorial-context`
7. `taxonomy-links`
8. `trusted-research`
9. `editorial-brief`
10. `ai-draft`
11. `featured-image`
12. `sanitize-save`
13. `ai-images`
14. `verify`

The existing `semantic-memory` step is absorbed into planner evidence. It must
not run a second selector that can change the chosen topic after selection.

The selected plan passed to the writer is immutable:

- topic;
- keyword;
- category;
- pillar;
- stage;
- format;
- intent;
- expertise angle.

The writer may return content risk notes, but cannot reassign strategy fields.

## Guided and manual parity

### `AI Generate`

The user may still enter a topic. Before generation, that topic must pass the
same:

- normalization;
- deterministic overlap;
- cluster saturation;
- semantic judge;
- category resolver;
- YMYL safety validation;
- evidence persistence.

The user-provided topic is not replaced silently. A conflict returns the
matched post and asks for a different angle.

### Manual editor

Pure manual post creation remains possible. It does not call OpenAI, but the
admin should show the deterministic overlap warning before submission to
review. This warning does not modify published posts or auto-publish content.

### `Plan Topics`

The advanced planning dialog may remain for editorial exploration, but it must
call the same planner service. In this sprint it accepts language only, so it
cannot create a competing category/focus scoring path.

## Research boundary

Sprint 18 does not add a web crawler or copy the XL Homes research fallback.

Current allowlisted NIMH/988 entries remain curated source recommendations.
They must not be called extracted or verified facts unless the application
actually fetched and stored the supporting text.

Changes in scope:

- rename operational language from `verified facts` to `curated sources` where
  applicable;
- persist selected source IDs on candidates;
- keep the writer restricted to allowlisted URLs;
- omit specific claims when the curated source is insufficient;
- never synthesize a quotation, statistic, study result or URL;
- keep PHI out of prompts, logs and candidate evidence.

## UI plan

### Before generation

The modal shows:

- title: `Auto Generate Draft`;
- explanation: the system selects a strategy-aware, low-overlap topic;
- language selector;
- author only when more than one eligible author exists;
- one primary button.

### During generation

- Durable run ID remains visible.
- Steps update through the existing SSE replay.
- Status icons retain text labels; color is not the only signal.
- The progress area uses an appropriate live region.
- Closing/reopening or refreshing reconnects to the same run.

### After topic selection

Show a compact decision card:

- topic and keyword;
- category;
- pillar and patient stage;
- format;
- score;
- closest-overlap percentage;
- short reason.

### Completion

Show:

- draft title and private status;
- real verification score and blockers/warnings;
- image candidate summary;
- `Open Draft`.

### Failure

Planning failures state explicitly:

- no draft was created, or
- a private partial draft was recovered.

No-safe-topic failure offers `Plan Topics` as an advanced next action but does
not silently weaken thresholds.

## Modular implementation map

New modules:

- `server/blog/strategy/healing-minds.ts`
- `server/blog/ai/topic-provider.ts`
- `server/blog/ai/topic-normalization.ts`
- `server/blog/ai/topic-judge.ts`
- `server/blog/ai/topic-scoring.ts`
- `server/blog/topic-candidate-storage.ts`

Changed modules:

- `shared/schema.ts`
- `server/blog/seed.ts`
- `server/blog/ai/topic-planner.ts`
- `server/blog/ai/types.ts`
- `server/blog/admin-validation.ts`
- `server/blog/admin-routes.ts`
- `server/blog/generation/storage.ts`
- `server/blog/verification.ts`
- `client/src/pages/admin/BlogAdminPage.tsx`
- `package.json`

Avoid:

- duplicate Auto Generate endpoints;
- provider calls inside route handlers;
- a new progress/session implementation;
- regex insertion of images;
- category constants duplicated across seed, prompt and UI;
- automatic edits to published posts.

## Implementation sequence

1. Add strategy registry and safe bilingual category seeding.
2. Add candidate schema/storage and blog post planning fields.
3. Implement deterministic normalization, cluster inventory and scoring.
4. Add Responses API structured ideation provider.
5. Add batched semantic judge and bounded failure behavior.
6. Replace fixed-template planner and persist all decisions.
7. Integrate the selected plan with the existing durable run.
8. Apply the same final guards to guided AI Generate.
9. Simplify Auto Generate UI and expose the decision card.
10. Run real verification before terminal completion.
11. Add deterministic guard/eval script and deployment documentation.

All implementation stays in one feature-flagged Sprint 18 PR so the UI is not
shipped without the corresponding taxonomy and planner.

## Deterministic validation

Add:

`npm run blog:topic-check`

The script must run without secrets or provider calls and cover:

1. source and archive fixtures load correctly;
2. all category/pillar/stage/format values resolve from one registry;
3. English and Spanish normalization preserve topic-defining terms;
4. brand, location, year and format boilerplate are removed;
5. the known XL Homes outdoor-living duplicate scores above threshold;
6. Healing Minds duplicate fixtures are rejected;
7. genuinely different condition/intent pairs remain distinct;
8. saturated clusters cannot win as `create_new`;
9. recent category/pillar/format penalties are deterministic;
10. ties resolve deterministically;
11. only one candidate can be selected per run;
12. no cosmetic year/season fallback exists;
13. planner payload contains no focus, body content or PHI field;
14. generated category never falls back to the first database row;
15. selected strategy fields cannot be overwritten by writer output.

Required project validation:

- `npm.cmd run blog:topic-check`
- `npm.cmd run blog:image-check`
- `npm.cmd run check`
- `npm.cmd run build`
- `git diff --check`
- independent code judge with no P0-P2 findings

## Migration and environment

Required:

- `npm run db:push`
- existing `OPENAI_API_KEY`
- `BLOG_TOPIC_ENABLED=true` only after the smoke test

Proposed optional overrides:

- `BLOG_TOPIC_MODEL`
- `BLOG_TOPIC_JUDGE_MODEL`
- `BLOG_TOPIC_REASONING_EFFORT`
- `BLOG_TOPIC_JUDGE_REASONING_EFFORT`
- `BLOG_TOPIC_TIMEOUT_MS`

No new secret is required.

## Exact Replit smoke checklist

1. Pull the Sprint 18 branch without mixing PR #23.
2. Run `npm run db:push`.
3. Confirm `blog_topic_candidates`, its unique indexes and new nullable
   `blog_posts` planning fields.
4. Restart and confirm all eight EN and eight ES categories exist exactly once.
5. Keep `BLOG_TOPIC_ENABLED=false`; run topic/image checks, typecheck and build.
6. Confirm the old private drafts and published posts still load unchanged.
7. Confirm admin guards reject all planner/run/candidate endpoints without an
   authenticated admin.
8. Enable `BLOG_TOPIC_ENABLED=true`; confirm `OPENAI_API_KEY` without printing
   it.
9. Auto Generate in English: UI asks no category/focus/count, stores five
   candidates, selects one and creates exactly one private draft.
10. Repeat in Spanish and confirm Spanish taxonomy, source IDs and copy.
11. Confirm selected category is not the first-row fallback and matches the
    persisted candidate.
12. Confirm pillar, stage, format, intent, keyword and angle reach the draft
    unchanged.
13. Refresh during ideation, semantic judge, writing and images; reconnect to
    the same run without another draft.
14. Repeat the same idempotency key and confirm the same run/candidates/post.
15. Try a known duplicate: candidate is rejected with matched-post evidence.
16. Force all five candidates to collide: one replacement batch runs; after a
    second failure, no draft is created.
17. Simulate judge outage: only a very-low-overlap candidate can continue and
    the warning is persisted.
18. Simulate ideation failure: one bounded retry, terminal failure, no draft.
19. Simulate article failure before save: no incomplete public content.
20. Simulate image failure: draft and curated hero survive; run completes with
    warning.
21. Confirm AI hero/inline variants remain unselected and inline content is
    still materialized by `anchorHeading`.
22. Confirm terminal `verify` contains the real stored verification report.
23. Guided AI Generate with a duplicate topic must return overlap/judge
    evidence instead of silently changing the topic.
24. Confirm no raw body, focus, PHI, API key or chain-of-thought is present in
    candidate rows, run events or logs.
25. Confirm `store:false` and the configured topic/judge model roles in the
    outbound requests without logging credentials or medical content.
26. Confirm no autopublish, sitemap mutation or Search Console call.
27. Publish only through the existing human review gate.

## Implemented evidence

- `shared/schema.ts` adds `blog_topic_candidates`, one-selected-per-run
  enforcement, and the selected strategy fields on `blog_posts`.
- `server/blog/strategy/healing-minds.ts` is the single bilingual taxonomy and
  content-strategy registry used by the seed and planner.
- `server/blog/ai/topic-provider.ts` and `topic-judge.ts` use direct Responses
  API calls with strict Structured Outputs and `store:false`.
- `server/blog/ai/topic-planner.ts` performs local symmetric Jaccard,
  intra-batch duplicate checks, saturation/listicle/freshness gates, one
  batched semantic decision, explainable scoring, a maximum second batch, and
  durable candidate selection.
- planning now executes inside the Sprint 16 durable run worker and publishes
  progress through the existing stored events/SSE path.
- the selected strategy is saved with the private draft; image generation and
  curated fallback behavior remain owned by Sprint 17.
- `scripts/blog-topic-guards.ts` validates the registry, bilingual
  normalization, known duplicate/distinct pairs, score penalties, input
  stripping, and feature-flag/config behavior without a real key.

## PR boundary

In scope:

- strategic topic generation and selection;
- taxonomy completion;
- durable decision evidence;
- Auto Generate UI simplification;
- guided-topic parity;
- real verification integration.

Out of scope:

- autopublish or scheduled batches;
- Search Console/GSC performance scoring;
- sitemap changes;
- translation automation or automatic EN/ES cadence;
- a live medical research crawler;
- article-writer model migration;
- image provider/storage changes;
- analytics PR #23;
- retroactive edits to published content.

The remote Sprint 17 branch must remain preserved.

> Superseded on 2026-08-03 for translation automation only: the independent
> bilingual-twins change implements a durable draft-only sibling workflow.
> Topic planning and every other Sprint 18 boundary remain unchanged. See
> `docs/BLOG_BILINGUAL_TWINS.md`.
