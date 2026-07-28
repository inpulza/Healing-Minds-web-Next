# SEO Publishing Sprint 19 - Link Intelligence

## Goal

Turn the blog's current hard-coded links into one durable, reviewable link
intelligence system.

In practical terms, the admin must be able to answer:

- which internal and external links are approved;
- which articles actually use each link and with which anchor;
- whether a link is healthy, redirected, stale, pending or broken;
- why an external medical source is trusted;
- where an internal link would strengthen the site graph;
- which link problems must be fixed before publication.

Sprint 19 does not import backlinks or page-performance data from Google. Those
belong to Sprint 20.

## Why this sprint is needed now

The current implementation has two useful but static lists:

- four internal destinations per language;
- six NIMH pages plus the 988 Lifeline.

They are selected with keyword heuristics, then written into the post HTML. The
system does not currently persist their real use, health, review status,
language fit, anchor text or editorial quality.

This is still manageable with four published posts. It becomes expensive and
error-prone after dozens of articles, so the inventory and graph should become
durable before the library grows.

## Evidence from the XL Homes pilot

XL Homes provides a useful product pattern:

- a link library;
- explicit review and health states;
- usage visibility;
- filtering and manual audit controls;
- reuse of approved sources before new research.

Its implementation is not portable as-is:

- pool links are counted as reused but never reach the writer context;
- live search still runs even after a pool hit;
- production generation does not record real link usages;
- `verified_sources`, `link_library` and `external_reference_links` compete as
  sources of truth;
- mutable usage counters can disagree with actual articles;
- generic text is synthesized and presented as a verified fact;
- URL checking is not protected against the full SSRF threat model;
- `403`, `429`, timeouts and some valid `HEAD` responses can be mislabeled as
  broken;
- admin panels expose cache and usage claims that the runtime does not uphold.

Healing Minds will copy the useful behavior, not those implementation choices.

## Product boundaries

### In scope

- one managed library for first-party internal targets and approved external
  medical sources;
- publisher/source quality review;
- page-level evidence metadata;
- technical health checks with durable history;
- actual post-to-link usage derived from saved HTML;
- transparent scores with named components and policy versions;
- internal-link opportunities and orphan-page signals;
- integration with AI Generate and the Sprint 18 Topic Planner;
- a separate Link Intelligence admin view;
- idempotent seed and backfill;
- link-aware prepublication verification;
- English and Spanish aliases, topics and labels;
- existing redirects remain integrated with impact analysis.

### Out of scope

- Search Console, GA4 or URL Inspection automation;
- backlink inventory or a proprietary backlink-authority metric;
- Moz Domain Authority, Ahrefs Domain Rating or invented equivalents;
- automatic disavow actions;
- automatic publication;
- automatically rewriting published article copy;
- replacing `blog_redirects`;
- injecting anchors at render time;
- live web research or arbitrary model-generated URLs;
- the Sprint 17 Spanish image-PHI heuristic;
- the separate article-depth and editor-action UX follow-up.

## Non-negotiable invariants

1. `blog_posts.content` remains the render source of truth for article anchors.
2. `blog_post_links` is a derived, rebuildable index of that HTML.
3. Links are not injected again in SSR or React.
4. `blog_redirects` remains the only redirect source of truth.
5. When Link Intelligence is enabled, the database library is the only runtime
   source for generation link choices.
6. The legacy constants may seed the database or serve the disabled flag path;
   they must not compete with the enabled runtime.
7. AI receives only exact, approved target URLs selected by the server.
8. The model never invents facts, source IDs or URLs.
9. Health failure never deletes or invalidates a draft.
10. A published article is never autoedited after an audit.
11. External medical links require human approval.
12. Review status and technical health are hard gates, not hidden point values.
13. No physical delete is offered for a source or link that has history or
    usage. It is blocked or retired.
14. No audit endpoint acts as an arbitrary server-side URL proxy.
15. No secrets, response bodies, cookies or authorization headers are stored in
    check history.

## Vocabulary

The UI must not collapse unrelated signals into one "reputation" number.

### Source quality

Editorial quality of the responsible publisher, for example NIMH or the 988
Lifeline.

### Evidence quality

Whether one exact page is an appropriate, direct source for a class of claim.
A trusted domain alone is not enough.

### Citation fit

Whether the exact page is suitable for one article, topic, language and use.
This is contextual, not a global property of the URL. Sprint 19 defines the
explainable formula for evaluation and guards, but does not persist a
post-link Citation Fit score or use one as a production gate. Runtime selection
uses the reviewed exact-page evidence score plus deterministic topical and
language matching. A future sprint may persist contextual scores without
silently relabeling the page-level evidence score.

### Technical health

Whether the target currently resolves safely and as expected. A technically
healthy page can still be a poor medical source.

### Internal opportunity

Whether a specific source article should link to a specific internal target.
This belongs to the source-target pair, not to the destination globally.

### Backlink value

An estimate for a third-party page that links to Healing Minds. It is not
implemented in Sprint 19.

## Data model

All changes are additive and applied through `npm run db:push`.

### Enums

#### `blog_link_kind`

- `internal`
- `external`

#### `blog_link_review_status`

- `pending`
- `approved`
- `blocked`
- `retired`

#### `blog_link_health_status`

- `unchecked`
- `healthy`
- `redirected`
- `unreachable`
- `broken`
- `changed_review_needed`
- `stale`

#### `blog_link_origin`

- `seed`
- `manual`
- `ai`
- `backfill`

#### `blog_link_usage_origin`

- `ai`
- `manual`
- `backfill`
- `server_fix`

#### `blog_link_audit_status`

- `queued`
- `running`
- `completed`
- `failed`
- `interrupted`

### `blog_link_sources`

One row represents the responsible publisher or first-party owner, not an
individual page.

- `id`
- `stableKey` unique
- `name`
- `canonicalDomain` unique
- `sourceType`
  - `first_party`
  - `government`
  - `professional_guideline`
  - `academic`
  - `health_system`
  - `crisis`
  - `other`
- `languages` JSON array
- `reviewStatus`
- `reviewedBy`
- `reviewedAt`
- `reviewNotes`
- `qualityScore`
- `qualityBreakdown` JSON
- `scoreVersion`
- `createdAt`
- `updatedAt`

The server computes the score from the persisted breakdown. The client cannot
submit a free-form final score.

### `blog_links`

One row represents one exact internal path or external page.

- `id`
- `stableKey` unique and nullable for discovered links
- `sourceId` nullable for internal links
- `kind`
- `normalizedHref`
- `canonicalKey` SHA-256, unique
- `displayHref`
- `host`
- `title`
- `label`
- `language`: `en`, `es` or `all`
- `sourceCategory`
- `topicTags` JSON array
- `categoryKeys` JSON array
- `contentPillars` JSON array
- `keywords` JSON array with EN/ES aliases
- `summary`
- `evidenceType`
- `evidenceScope`
- `evidenceScore`
- `freshnessScore`
- `reviewStatus`
- `generationEligible`
- `healthStatus`
- `httpStatus`
- `finalHref`
- `redirectCount`
- `consecutiveFailures`
- `lastCheckedAt`
- `lastSuccessfulAt`
- `nextCheckAt`
- `lastErrorCode`
- `scoreBreakdown` JSON
- `scoreVersion`
- `origin`
- `targetPostId` nullable, `onDelete: set null`
- `createdAt`
- `updatedAt`

`canonicalKey` prevents very large URL indexes while retaining
`normalizedHref` for inspection. Application code must still compare the
normalized value when a hash collision is detected.

For a published blog post, the stable post identity belongs only to its current
canonical path. If its language or slug changes, the previous exact-path row is
retired and retained for historical usages while a new exact-path row receives
the stable post key. A path change never mutates old usage evidence into a URL
that was not actually present.

### `blog_post_links`

This table records actual occurrences found in saved post HTML.

- `id`
- `postId`, `onDelete: cascade`
- `linkId`, `onDelete: restrict`
- `generationRunId`, nullable, `onDelete: set null`
- `occurrenceKey`
- `ordinal`
- `rawHref`
- `normalizedHref`
- `anchorText`
- `sectionHeading`
- `rel`
- `target`
- `claimClass` nullable
- `origin`
- `postContentChecksum`
- `firstSeenAt`
- `lastSeenAt`
- `removedAt` nullable
- `createdAt`
- `updatedAt`

Unique indexes:

- current occurrence identity: `postId + occurrenceKey`;
- query indexes on `linkId + removedAt` and `postId + removedAt`.

Usage totals are derived from current rows (`removedAt is null`). There is no
mutable `timesUsed` source of truth.

### `blog_link_audit_runs`

Batch health checks must be recoverable and inspectable.

- `id`
- `idempotencyKey` unique
- `status`
- `input` JSON containing only persisted link IDs
- `result` JSON counts plus the durable `completedLinkIds` checkpoint
- `requestedBy`
- `createdAt`
- `startedAt`
- `completedAt`
- `heartbeatAt`
- `leaseToken`, private server-only fencing credential
- `leaseEpoch`, monotonically increasing fencing generation
- `updatedAt`

Only one open audit run is allowed initially. A stale run becomes
`interrupted`, its lease is revoked, and retrying with the same idempotency key
requeues that same run without changing its persisted link-ID set. The new
worker skips checkpointed IDs. Every check insert, managed-link health update
and checkpoint update is one transaction fenced by `runId + leaseToken +
leaseEpoch`, so an obsolete worker cannot write, heartbeat, fail or complete
after recovery. After the bounded network request, that transaction locks a
managed target post first (when present), then the current publisher and link
rows in global `target post -> source -> link` order (after the independent
audit-run fence). It revalidates the exact canonical target identity and
derives failure counters, next-check timing and generation eligibility from
those current rows, preventing batch and individual audits from overwriting one
another with stale pre-request or lifecycle state.

### `blog_link_checks`

Append-only technical observations:

- `id`
- `runId`, nullable
- `linkId`
- `checkedAt`
- `method`
- `result`
- `httpStatus`
- `resolvedHref`
- `redirectCount`
- `durationMs`
- `errorCategory`
- `createdAt`

No response body is stored.

## URL normalization

Normalization is a pure, tested server function.

### Internal links

- accept only same-site paths or absolute URLs for the configured public site;
- convert same-site absolute URLs to paths;
- reject protocol-relative URLs;
- remove fragments and query parameters from canonical targets;
- normalize a trailing slash except for `/`;
- preserve case only where the real route requires it; blog routes are already
  lowercase;
- reject `/api`, `/admin`, asset and non-public paths.

### External links

- require HTTPS for new managed sources;
- lowercase the host and remove the default port;
- remove fragments;
- remove known tracking parameters such as `utm_*`, `gclid` and `fbclid`;
- retain and deterministically sort meaningful query parameters;
- normalize the root/trailing slash without changing meaningful paths;
- reject credentials in URLs.

The raw occurrence remains available in `blog_post_links.rawHref`; the library
uses the normalized target.

## HTML extraction and reconciliation

New link logic uses `htmlparser2`, which is already installed.

It must not use regex as the source of truth.

For each saved post:

1. sanitize the HTML with the existing shared sanitizer;
2. parse anchors in document order;
3. track the nearest preceding H2/H3;
4. normalize the href;
5. resolve or create one library target;
6. create a stable occurrence fingerprint from post, normalized URL, ordinal,
   anchor and heading;
7. upsert observed occurrences;
8. mark previously current but now absent occurrences with `removedAt`;
9. store the content checksum;
10. reconcile the derived projection in its own transaction after the post
    save. If that projection fails, keep the draft and surface a warning;
    Verify and Publish always rebuild it before relying on the report.

Unknown links discovered in manually edited drafts are created as `pending` and
`generationEligible=false`. They are not silently trusted.

Backfill performs the same reconciliation but never mutates post content,
status, slug, timestamps or publication dates.

## Source-quality policy

Policy ID: `healing-link-policy-v1`.

The source-quality score is explanatory metadata. Approval remains a human
gate.

| Component | Weight |
| --- | ---: |
| Accountable publisher/editor | 25 |
| Expert editorial or scientific review | 25 |
| Traceable evidence and references | 20 |
| Currency and maintenance | 15 |
| Funding/conflict transparency | 10 |
| Stable identifier or permalink | 5 |

Rules:

- a `.gov`, `.edu` or `.org` suffix does not automatically set a score;
- reviewer, evidence and financing notes must be inspectable;
- the server calculates the total from bounded components;
- a retracted source is blocked;
- an expression of concern requires renewed human review;
- testimonials, UGC and promotional copy cannot support clinical claims.

The policy follows NIH/NCCIH guidance to inspect evidence, expert review,
currency, ownership and funding rather than trusting a domain suffix:

- https://www.nccih.nih.gov/health/know-science/finding-and-evaluating-online-resources/finding-health-information-online/how-do-you-know-the-information-is-accurate
- https://www.nccih.nih.gov/health/know-science/finding-and-evaluating-online-resources/finding-health-information-online/is-the-information-reviewed-by-experts
- https://www.nccih.nih.gov/health/know-science/finding-and-evaluating-online-resources/finding-health-information-online/how-current-is-the-information
- https://www.nccih.nih.gov/health/know-science/finding-and-evaluating-online-resources/finding-health-information-online/who-runs-and-pays-for-the-website

## External citation scoring

### Global page evidence

The exact page stores a reviewed `evidenceScore` and evidence type. A publisher
quality score cannot make an unrelated page eligible.

### Contextual matching in Sprint 19

The scoring module defines this future-ready post-link breakdown:

| Component | Weight |
| --- | ---: |
| Direct support for the article claim/topic | 50 |
| Appropriate evidence type | 20 |
| Correct population, jurisdiction and context | 15 |
| Language and reader accessibility | 10 |
| Diversity and non-redundancy | 5 |

and can calculate:

`Citation Use = 40% Source Quality + 60% Citation Fit`

It is not shown as a production score in Sprint 19 because the runtime does not
persist the evidence needed to justify each component. The admin shows Source
Quality and Exact-page Evidence separately. The writer requires a real
topic-term match and a compatible reviewed language; the model cannot turn a
globally trusted but unrelated page into an eligible citation.

Eligibility:

- normal educational source: approved, current, publisher quality at least 75
  and exact-page evidence at least 80;
- medication, treatment, safety or crisis: publisher quality at least 85,
  exact-page evidence at least 90 and explicit human review;
- exact URL match only;
- reviewed page and publisher language must match the article;
- runtime requires a deterministic topic-term match;
- health must be currently `healthy`; redirects remain visible for review and
  are not selected for new AI drafts;
- stale medical pages leave AI selection until reviewed.

The 988 Lifeline is an operational crisis resource. It is selected only for
crisis/suicide/self-harm context, not appended to every article as a generic
medical citation.

## Internal opportunity scoring

The score is calculated for one source post and one destination:

| Component | Weight |
| --- | ---: |
| Topical affinity | 35 |
| Patient journey and intent fit | 20 |
| Graph need/orphan reduction | 20 |
| Anchor and section context | 15 |
| Editorial diversity | 10 |

Hard gates:

- destination is public, canonical and indexable;
- destination is not the source post;
- language is compatible;
- the link is not already duplicated;
- destination is not a redirect or confirmed broken;
- topical affinity is at least 15/35.

Bands:

- `80-100`: recommended;
- `65-79`: optional for editor;
- below `65`: do not suggest.

Google's current link guidance requires crawlable anchors and recommends
descriptive, concise, contextual anchor text:

https://developers.google.com/search/docs/crawling-indexing/links-crawlable

## Health checks and SSRF protection

The checker operates only on persisted link IDs. The client never supplies an
arbitrary URL to fetch.

External checks:

- HTTPS only;
- ports 80 and 443 only;
- no credentials;
- resolve A and AAAA records before connecting;
- block localhost, `.local`, loopback, private, link-local, multicast,
  documentation, reserved and metadata ranges;
- pin/validate the resolved address for the request;
- revalidate DNS and destination on every redirect;
- maximum three redirects;
- cross-domain redirects become `changed_review_needed`;
- strict connect and total timeouts;
- low concurrency;
- `HEAD`, then limited `GET` fallback for unsupported or suspicious HEAD
  responses;
- never send cookies, authorization or app secrets;
- never save or log response bodies.

Classification:

- `200-399` is not automatically editorial approval;
- `404/410` becomes broken only after confirmation/retry;
- `403`, `429`, timeout, TLS and DNS failures are `unreachable`, not broken;
- a first missing/failed observation increments failures but does not retire a
  link;
- redirects store final URL and history;
- changed final domain requires human review.

Internal checks use the real public route registry, published blog posts and
active `blog_redirects`. They do not fetch arbitrary local server paths.

### Initial TTLs

These are internal operating defaults, not Google or NIH mandates:

| Link class | Technical check | Editorial review |
| --- | ---: | ---: |
| Internal | on relevant post/redirect change | weekly graph scan |
| Crisis/emergency | 24 hours | 30 days |
| Medication/treatment/guideline | 7 days | 90 days |
| Official patient education | 14 days | 90 days |
| DOI/PMID paper | 30 days | 180 days plus retraction check |
| Other approved external | 30 days | 180 days |

## Seed and backfill

The seed is idempotent and contains:

- one first-party Healing Minds source;
- eight current internal targets, four EN and four ES;
- current published blog post targets;
- six original English NIMH exact pages;
- five verified Spanish NIMH exact pages for anxiety, depression, ADHD,
  bipolar disorder and PTSD;
- separate English and Spanish 988 Lifeline exact pages;
- bilingual topic aliases and conservative source metadata.

The seed preserves the existing stable source IDs:

- `nimh-anxiety-disorders`
- `nimh-depression`
- `nimh-adhd`
- `nimh-medications`
- `nimh-bipolar-disorder`
- `nimh-ptsd`
- `nimh-es-anxiety`
- `nimh-es-depression`
- `nimh-es-adhd`
- `nimh-es-bipolar-disorder`
- `nimh-es-ptsd`
- `988-lifeline`
- `988-lifeline-es`

Backfill:

- supports `--dry-run` and `--apply`;
- processes posts in batches;
- is idempotent and resumable;
- uses a transaction per post;
- reports unknown/pending URLs;
- never changes HTML or article status;
- never deletes posts, sources or historical checks.

## Runtime cutover

Feature flag:

`BLOG_LINK_ENABLED=true`

When false:

- the current generation path remains unchanged;
- topic-candidate reads and writes use a dedicated physical Sprint 18 table
  definition, so generated SQL omits the Sprint 19 column entirely and the
  code-first deployment remains safe before `db:push`;
- new admin Link Intelligence endpoints return a clear disabled response;
- public articles continue rendering normally.

When true:

- the database library is the only generation link inventory;
- current hard-coded rows are not queried as a fallback;
- an empty or temporarily unavailable selection produces a recoverable warning,
  not a fabricated URL;
- the draft can continue with zero links/sources and conservative copy;
- publication still applies link-review gates.

Activation order:

1. set `BLOG_LINK_ENABLED=false` before pulling the PR head; the Replit
   post-merge hook deliberately refuses to continue when the flag is already
   on and no longer applies database changes automatically;
2. boot the new code against the old schema and exercise Topic Planner once
   with the flag off to prove the legacy candidate projection;
3. run `npm run db:push` manually;
4. verify `/api/admin/blog/links/config` reports the canonical public site as
   `https://www.healingmindsp.com`, then run `npm run blog:link-seed` twice;
5. run `npm run blog:link-backfill -- --dry-run`, inspect the shadow report,
   then run `npm run blog:link-backfill -- --apply`;
6. health-check the seeded targets and review every redirect or failure;
7. pause blog create/edit/status/delete actions for the short cutover window,
   rerun `npm run blog:link-seed` and the apply backfill, and confirm both are
   clean against the latest post state;
8. enable the flag in development without another intervening blog mutation;
9. run EN and ES smoke tests;
10. enable production only after Replit approval.

## Topic Planner and AI Generate integration

At planner time, load the current eligible library view:

- approved and eligible exact external pages;
- valid internal targets;
- current source scores, health and languages;
- stable IDs.

Each manual Topic Planner request creates a completed durable generation run.
Its candidates, recommendation evidence, and external/internal stable IDs are
persisted; the selected row is linked to the eventual draft through
`topicCandidateId`. Before writing,
the server queries the library again and revalidates approval, technical TTL,
publisher review, language and topic match. This deliberate second lookup is
not an immutable snapshot: a target that becomes unsafe between planning and
writing drops out fail-open instead of being trusted from stale candidate
data. Policy and score versions remain available through Link Intelligence
metadata and on scored records; they are not persisted in the generation
workflow in this sprint.

Topic planning:

- recommends only stable IDs present in the current managed view;
- rejects model-created IDs;
- persists recommended external and internal IDs with candidate evidence;
- uses source coverage as one explainable component, never as a substitute for
  topic uniqueness.

Writing:

- re-resolves preferred external and internal stable IDs server-side;
- receives only exact internal and external URLs still eligible at write time;
- preserves the current exact external allowlist validator;
- applies the same exact allowlist rule to internal anchors after sanitization;
- cannot introduce another external URL;
- cannot introduce an internal route that the managed selector did not return;
- uses no external source when no eligible source fits;
- uses 988 only for an actual crisis context.

After the sanitized draft is saved, reconciliation records what the model
actually used. Planned links and actual usages remain distinguishable.

If link selection or health infrastructure fails:

- the draft/run remains recoverable;
- no selected content is erased;
- Auto Generate and Topic Planner-to-Draft warnings remain on their durable
  generation run; guided one-off Generate Draft without a planner is returned
  for the active editorial review but does not create a second competing
  warning store;
- the system never autopublishes.

## Manual editing and publication gates

Saving a draft remains permissive:

- anchors are parsed and reconciled;
- unknown external links become pending;
- transient check failures become warnings;
- the editor never loses copy because a link service failed.

Moving to pending review or publishing reports:

- unapproved or blocked external medical links;
- confirmed broken links;
- external cross-domain redirects awaiting review;
- nonexistent/unpublished internal blog targets;
- redirected internal targets;
- language mismatch;
- generic anchor text;
- source-quality and exact-page evidence thresholds.

Confirmed unsafe/unapproved external links and invalid internal destinations are
blocking. Anchors rejected by URL policy remain in the saved draft but appear
as explicit blockers in Verify/Publish; they can never disappear from the
ledger silently. `unchecked` or transiently `unreachable` external links are
visible warnings unless the link class is crisis, medication, treatment or
safety, where current human review is required. Non-healthy internal
destinations are blocking.

Publish uses the post, link and publisher timestamps returned by the completed
verification pass as one optimistic snapshot. The status transaction locks and
rechecks that snapshot plus the presence or exact version of the article
redirect before changing the post to `published`; concurrent content,
approval, health, publisher-review or redirect changes return `409` and
require Verify to run again. A redundant `published -> published` request is
rejected before it can prepare or deactivate the managed target.

## Redirect integration

`blog_redirects` remains authoritative.

Impact analysis uses current `blog_post_links` rows instead of `ILIKE` scans.

Cleanup:

- parses HTML;
- rewrites only exact matching anchors;
- sanitizes;
- locks and validates every impacted post plus the exact active redirect
  snapshot;
- saves all rewrites and rebuilds their derived link projections inside one
  transaction;
- rolls back every rewrite if any post, redirect or projection changes/fails;
- never uses a broad regex replacement;
- never modifies another URL that merely shares a substring.

Post deletion also uses the post status/timestamp snapshot that drove its
confirmation and redirect decision. It locks the post and image rows, refuses
deletion while generation/deletion is active, removes managed image objects,
then lets the same transaction cascade the image rows and delete the post. A
concurrent edit or publication returns `409` before any object is touched.

Sprint 19 may keep the current endpoint shape for compatibility while replacing
its internal evidence source.

## Admin API

All endpoints use the existing blog admin guard.

### Summary and library

- `GET /api/admin/blog/links/summary`
- `GET /api/admin/blog/links`
- `GET /api/admin/blog/links/:id`
- `POST /api/admin/blog/links`
- `PATCH /api/admin/blog/links/:id`
- `POST /api/admin/blog/links/:id/review`

List filters:

- kind;
- language;
- source;
- review status;
- health status;
- category/pillar;
- generation eligibility;
- search;
- bounded page/page size.

There is no ordinary DELETE endpoint.

### Usages and opportunities

- `GET /api/admin/blog/links/:id/usages`
- `GET /api/admin/blog/posts/:postId/links`
- `GET /api/admin/blog/posts/:postId/link-opportunities`
- `POST /api/admin/blog/posts/:postId/links/resync`

### Health

- `POST /api/admin/blog/links/:id/check`
- `GET /api/admin/blog/links/:id/checks`
- `POST /api/admin/blog/link-audits`
- `GET /api/admin/blog/link-audits/:runId`

Audit input contains at most 25 persisted link IDs. It never accepts a URL
field or acts as an arbitrary fetch proxy.

## Admin interface

Add a separate modular `LinkIntelligencePanel`, not another large section
inside the existing 2,700-line editor component.

Top-level blog admin navigation:

- `Posts`
- `Link Intelligence`

Link Intelligence contains three working views.

### Overview

Only actionable counters:

- published broken links;
- pending medical publishers;
- stale medical sources;
- links needing a current technical health check;
- orphan published posts with no current inbound internal link;
- redirected targets requiring review;
- approved and generation-eligible links.

### Library

Filters and columns:

- title/URL;
- internal/external;
- publisher/source type;
- language;
- review;
- health;
- source quality;
- evidence quality;
- current usages;
- last check/next review.

Actions:

- add;
- inspect;
- approve;
- block;
- retire;
- check now.

The detail drawer shows:

- score breakdown and policy version;
- reviewer, reason and review date;
- health history;
- exact posts, anchors and headings;
- generation eligibility;
- metadata edit controls.

### Internal opportunities

Show source post to destination suggestions with:

- opportunity score;
- component reasons;
- existing incoming links;
- current anchors;
- orphan/underlinked explanation;
- language and target status.

Suggestions are editorial aids. They do not edit content automatically.

### Accessibility and behavior

- explicit labels and helper text;
- keyboard-operable controls;
- `aria-live` status for audit progress;
- destructive-looking actions require confirmation;
- review and health use both text and color;
- quiet visual hierarchy consistent with the current admin;
- mobile table fallback uses readable rows, not horizontal mystery controls.

## Search Console and backlink boundary

Search Console's Links report is sampled, grouped and not a complete backlink
inventory. The official Search Console API does not expose a Links-report
endpoint; Search Analytics provides clicks, impressions, CTR and position, not
backlink reputation.

References:

- https://support.google.com/webmasters/answer/9049606
- https://developers.google.com/webmaster-tools/v1/api_reference_index
- https://developers.google.com/webmaster-tools/v1/searchanalytics/query

Sprint 20 may add:

- Search Analytics page/query performance;
- URL Inspection status;
- versioned manual CSV snapshots of the Links report;
- backlink observations with evidence confidence;
- GA4 article engagement.

It must not present incomplete Google samples as a complete inventory and must
not invent Domain Authority.

## Code organization

New server modules:

- `server/blog/links/config.ts`
- `server/blog/links/normalization.ts`
- `server/blog/links/pinned-lookup.ts`
- `server/blog/links/extract.ts`
- `server/blog/links/policy.ts`
- `server/blog/links/scoring.ts`
- `server/blog/links/storage.ts`
- `server/blog/links/service.ts`
- `server/blog/links/audit.ts`
- `server/blog/links/routes.ts`
- `server/blog/links/seed.ts`

Client:

- `client/src/components/admin/blog/LinkIntelligencePanel.tsx`
- small focused child components only when they remove meaningful complexity.

Scripts:

- `scripts/blog-link-guards.ts`
- `scripts/seed-blog-links.ts`
- `scripts/blog-link-backfill.ts`

The existing `admin-routes.ts` registers the modular routes but does not absorb
their implementation.

## Automated validation

Add:

`npm run blog:link-check`

The guard suite requires no database, network or secrets and covers:

- internal/external URL normalization;
- same-site absolute URLs;
- fragment and tracking cleanup while meaningful query values remain part of
  the exact allowlist identity;
- credential/protocol/private-network rejection;
- IPv4-embedded IPv6 and both well-known and local-use NAT64 rejection;
- unconditional rejection of the complete `64:ff9b::/96` and
  `64:ff9b:1::/48` ranges, including public embedded IPv4 values;
- Node 20+ `lookup(..., { all: true })` compatibility while the auditor stays
  pinned to the already validated DNS address;
- HTML parsing with single/double/unquoted-safe attribute cases;
- heading and anchor extraction;
- stable occurrence fingerprints;
- idempotent reconciliation plan;
- unknown links become pending;
- exact allowlist eligibility;
- Spanish aliases and diacritic normalization;
- 988 selected only for crisis intent;
- source quality component bounds;
- exact-page evidence, future Citation Fit, and opportunity score breakdowns;
- deterministic ties;
- approval and health hard gates;
- redirect classification;
- `403`, `429`, timeout and TLS are not labeled broken;
- no arbitrary URL field in audit requests;
- audit idempotency validates the canonical link set; an interrupted run
  resumes under the same key from its durable completed-ID checkpoint;
- lease token/epoch guards fence obsolete workers and deterministic duplicate
  checkpoint updates never double-count a link;
- browser retries persist the complete idempotency-key/link-ID payload across
  refresh and filter changes and provide an explicit discard/reset action;
- failure counters are advanced from the latest locked link state rather than
  the snapshot read before the network request;
- managed blog targets are locked before their source/link rows and an audit
  cannot revive a target whose post was unpublished or whose exact path
  changed during the request;
- generated internal anchors must match the exact managed allowlist;
- protocol-relative, malformed and other non-allowlisted AI anchor targets are
  rejected from the original provider HTML before sanitization can remove
  evidence of the violation;
- live internal targets must still resolve to the exact currently published
  blog path;
- generated draft failure remains fail-open;
- planner snapshots selected stable IDs, the writer rebuilds canonical
  overrides from that snapshot, and exact current URLs are revalidated;
- a preferred stable ID cannot bypass deterministic topical compatibility;
- the flag-off Topic Planner INSERT physically omits every Sprint 19 column;
- publication status, managed target and redirect effects share one
  fail-closed transaction;
- redirect cleanup validates post and redirect snapshots before its atomic
  rewrite plus ledger reconciliation;
- no SSR/React anchor injection;
- no secrets in configuration output.

The local suite covers the pure provenance and selection boundaries. The full
database transition from persisted planning run and candidate to generated
draft remains an explicit Replit real-environment smoke test below.

Regression:

- `npm run blog:topic-check`
- `npm run blog:image-check`
- `npm run check`
- `npm run build`
- `git diff --check`

## Replit real-environment checklist

1. Before pulling the exact PR head, set `BLOG_LINK_ENABLED=false`.
2. Pull the exact PR head without merging.
3. Confirm the branch contains no unrelated local cleanup commit.
4. Confirm `scripts/post-merge.sh` did not run `db:push` automatically.
5. Before `db:push`, boot with the flag off and exercise Topic Planner; confirm
   the new candidate column is never queried and the request still completes.
6. Stop the process and run `npm run db:push` manually.
7. Confirm all additive link tables, enums, indexes, checks and FKs exist.
8. With the flag still off, confirm
   `/api/admin/blog/links/config` reports
   `publicSiteUrl=https://www.healingmindsp.com`.
9. Run `npm run blog:link-seed` twice; confirm the second run creates zero rows
   and the final totals are unchanged.
10. Run `npm run blog:link-backfill -- --dry-run`.
11. Confirm dry-run changes no post HTML, status or timestamps.
12. Run `npm run blog:link-backfill -- --apply`.
13. Confirm all four existing published posts remain byte-for-byte unchanged.
14. Compare extracted occurrence counts with their actual anchors.
15. Confirm current EN and ES NIMH/988 stable IDs resolve.
16. Confirm the eight current internal targets resolve.
17. Confirm unknown manual URLs are pending and not generation eligible.
18. Open Link Intelligence and test filters/details on desktop and mobile.
19. Approve, block and retire a disposable test link; confirm history remains.
20. Run health checks for every seeded target; confirm only healthy, reviewed
    targets become generation eligible.
21. Confirm a valid external target records health without storing a body.
22. Confirm redirect final URL/count.
23. Confirm `403`/`429`/timeout is unreachable, not broken, and a false-negative
    HEAD response is retried with a bounded GET.
24. Attempt localhost, private IPv4, private IPv6, encoded/private DNS and a
    redirect to private space; all must be blocked before request.
25. Start a batch audit, refresh and confirm durable progress/result.
26. Interrupt that audit after at least one persisted checkpoint, let stale
    recovery revoke its lease, then retry with the same key and IDs. Confirm
    the same run resumes only the remaining IDs; a late response from the old
    worker creates no check and changes no link. Start two retry requests
    concurrently and confirm only one lease is claimed. Reuse the key with
    different IDs and confirm `409`.
27. Pause blog mutations, rerun seed and apply backfill, and confirm the second
    cutover pass is clean.
28. Enable `BLOG_LINK_ENABLED=true` in development.
29. Generate one EN draft and verify selected IDs, exact URLs and actual usages.
30. Generate one ES draft and verify it uses Spanish exact pages rather than
    treating English NIMH pages as bilingual.
31. Confirm a non-crisis post does not receive either 988 page automatically.
32. Force library selection/audit failure and confirm the draft/run survives
    with a warning.
33. Add an unapproved external URL manually and confirm save succeeds but
    publication is blocked.
34. Save HTTP, `/admin`, `/api` and asset anchors in a disposable draft;
    confirm Verify identifies each rejected URL and Publish blocks.
35. Confirm a broken or stale internal destination is blocked before
    publication.
36. Confirm an unchecked non-critical external source is a visible warning.
37. Test redirect impact through the derived usage index.
38. Test exact cleanup and confirm unrelated URLs/content are unchanged.
39. Run all automated validation commands.
40. Review logs for secrets, response bodies and unexpected external fetches.
41. From Plan Topics, choose a recommended candidate and confirm its durable
    run/candidate IDs plus both external and internal stable IDs are reloaded
    and re-resolved server-side at write time.
42. Edit the chosen topic/language/category/context/keyword/tags before
    generating and confirm stale planned IDs are cleared.
43. Force the provider to return an invented internal route and confirm it is
    rejected before the draft is saved.
44. Approve an external URL with a meaningful query value, return a different
    value from the provider, and confirm exact allowlist rejection; tracking
    parameters alone may be removed.
45. Change a disposable published post slug through the required unpublish
    flow; confirm the old exact-path link row/history is retained and the new
    canonical path receives the stable post identity.
46. Change a link or publisher review between Verify and Publish; confirm
    Publish returns `409` and requires a fresh Verify.
47. Unpublish/delete a target during synchronization and confirm it becomes
    ineligible atomically and cannot be selected from a stale row.
48. Test the full `64:ff9b:1::/48` local-use NAT64 range and an A-to-B-to-A
    redirect chain; both must remain blocked/review-required.
49. Force managed-target and redirect writes to fail during publish and
    unpublish; confirm status, target eligibility and redirect all roll back
    together.
50. Race a manual redirect creation against publication of the same URL;
    confirm the final published URL has no active redirect and the losing
    operation returns `409`. Send `published -> published` and confirm it also
    returns `409` without changing target eligibility.
51. Change an impacted post and separately edit/deactivate the redirect while
    cleanup is waiting; each case must return `409` with no partial HTML or
    ledger rewrite.
52. Change a post after opening its delete confirmation and confirm delete
    returns `409` without removing image objects or database rows. Repeat while
    an image is generating/deletion-pending and confirm the same fail-closed
    behavior; on a clean snapshot, confirm objects are removed before the post
    and its image rows disappear together.
53. Simulate a lost audit POST response, refresh, change filters and retry;
    confirm the browser reuses the same key and persisted link-ID set. Use
    Discard and confirm both the saved request and run reference are cleared.
54. Run a batch and individual check concurrently while unpublishing a managed
    target and while changing a source/link identity; confirm stale network
    results write no check, checkpoint or health state and never revive
    generation eligibility.
55. Post an explicit PASS/FAIL verdict on the draft PR.

### Focused revalidation after the 2026-07-28 conditional verdict

The first real-environment pass completed the migration, seed, backfill,
durable audits, EN/ES generation, publication gates and all existing guards.
Before changing its verdict to PASS, Replit must validate the correction commit
without retaining its local `VALIDATION SHIM`:

1. Pull the exact updated PR head and confirm the local shim in
   `server/blog/links/audit.ts` is absent.
2. Run the 25-link batch on Node 20+; confirm external checks no longer fail
   with `ERR_INVALID_IP_ADDRESS` and the expected fixture result remains
   24 healthy plus one reviewed redirect.
3. Attempt both `https://[64:ff9b::808:808]/x` and representatives at the
   beginning/end of `64:ff9b:1::/48`; each must be rejected as
   `private_or_reserved_host` before any request.
4. Force provider HTML containing `href="//unapproved.example/medical"` and an
   entity-encoded equivalent; generation must fail before saving a draft.
5. Submit unsafe link-creation requests; each must return HTTP 400 with the
   matching `BlogLinkNormalizationError` code rather than a generic 500.
6. Rerun `blog:link-check`, `blog:topic-check`, `blog:image-check`, typecheck,
   build and `git diff --check`.
7. Replace the conditional verdict with an explicit PASS/FAIL comment on PR
   #27. Do not merge from Replit.

## Deployment and rollback

Deployment requirements:

- `BLOG_LINK_ENABLED=false` before checkout/preflight;
- manual `npm run db:push` because post-merge no longer pushes schema;
- seed and backfill;
- final mutation-free seed/backfill cutover pass;
- `BLOG_LINK_ENABLED=true` only after QA;
- no new third-party API key is required in Sprint 19.

Rollback:

- set `BLOG_LINK_ENABLED=false`;
- restart;
- keep additive tables and history;
- do not drop data;
- public post HTML remains unchanged and continues to render.

## Acceptance criteria

Sprint 19 is complete only when:

1. the library is durable and is the sole enabled generation inventory;
2. saved HTML is the render truth and usages reconstruct from it;
3. source quality, evidence, health and opportunity are visibly separate;
4. human approval gates external medical sources;
5. AI can use only exact eligible URLs;
6. real usages, anchors and headings appear in the admin;
7. Spanish matching no longer depends on English-only keyword heuristics;
8. 988 is contextual rather than automatic;
9. health checks are durable and SSRF-safe;
10. drafts survive link-service failures;
11. published posts are never autoedited;
12. redirect impact no longer depends on fragile HTML `ILIKE` evidence;
13. no Google/backlink metric is fabricated;
14. all local guards, typecheck, build and independent code review pass;
15. Replit completes database, network and EN/ES smoke tests before merge.
