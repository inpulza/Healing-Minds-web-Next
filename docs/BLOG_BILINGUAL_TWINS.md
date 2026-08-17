# Bilingual blog twins

## Decision

Auto Generate saves the requested-language article first, completes that durable
run, and then queues the other language as a second durable, recoverable run.
Guided AI Generate follows the same pair contract after creating the source
from the editor's topic, target keyword and local-only additional context.
The translation is not another step hidden behind the source request's spinner.
Its idempotency key is derived from `translationGroupId + targetLanguage`, and a
database unique index allows at most one row per language in a group.

This supersedes only the translation-automation exclusion recorded in Sprint
18. It does not change that sprint's topic-planning contract.

## Editorial and clinical contract

- The sibling is always created as `draft`, with `publishedAt = null`.
- It must independently pass `pending_review` and the existing YMYL publish
  gate. Publishing one language never changes the other language.
- A provider failure leaves the source draft valid and exposes a retry action.
- A same-key replay reopens a failed/interrupted run or returns the existing
  sibling. Concurrent inserts converge on the database unique index.
- The provider adapts title, slug, excerpt, HTML, headings, link labels,
  captions, disclaimer, SEO fields and featured-image alt text. It is told to
  preserve clinical meaning and cannot add claims, dosages, guarantees,
  patient stories, sources or URLs.
- Static internal links use the real bilingual route manifest. Blog-to-blog
  links switch only when the target sibling is already published. Otherwise
  the existing valid URL is retained.
- Curated target-language official sources replace a source URL only when the
  approved library has a URL on the same official host. URLs are never
  translated by string manipulation, and the provider output is rejected if
  it introduces an unapproved URL or removes a required link.
- The already selected editorial image is reused and its visible text/alt is
  adapted. The translation run never triggers new image generation or spend.
- Translation metadata follows the same persistence contract as manual edits:
  `metaTitle` is normalized to 60 characters and `metaDescription` to 160 at a
  word boundary. The admin also normalizes older over-limit drafts when they
  are opened, before a save can reach the strict API validator.

## Admin states

Every article row shows the other language and one of the editorial states:
`missing`, `draft`, `pending_review`, or `published`. A durable run may add
`queued`, `running`, `failed`, or `interrupted` operational detail without
changing that editorial state. Existing siblings open directly in the editor;
missing or failed siblings expose generate/retry.

Both generation dialogs label the choice as the **source language**. Selecting
English creates an English source and queues a Spanish sibling; selecting
Spanish creates a Spanish source and queues an English sibling. Both remain
private drafts and are reviewed and published independently.

Text edits are intentionally not mirrored silently. A row whose sibling is still a
`draft` exposes **Refresh sibling from this post**. The editor must confirm that
the current sibling draft will be replaced. The refresh is version-bound to
both rows and fails recoverably if either row changes while the run is queued.
`pending_review` and `published` siblings can never be overwritten by refresh.

Image review remains independent from text refresh, but an approved image set
is shared automatically with the sibling while that destination remains a
`draft`. It does not matter whether English or Spanish was generated first:
creating the sibling, selecting a completed hero/inline candidate, removing an
inline placement, or opening an older misaligned pair reconciles the approved
set without an extra editor button and without calling the image provider.

Candidate images are never promoted by this synchronization; the human
selection in the first language remains the approval gate. Curated assets may
reuse their stable public URL. Managed AI assets are downloaded from the source
Blob and uploaded under target-post keys, so each language owns an
independently deletable copy. Inline copies keep their order and are
re-anchored to headings in the target-language article; alt text and captions
are rebuilt in that language. The destination write is draft-only,
version-guarded, authoritative and atomic, so a removed inline selection is
also removed from the sibling's rendered set. A `pending_review` or
`published` destination is never changed silently. Uploaded objects that
cannot be registered are deleted immediately or placed in the durable cleanup
queue.

## Public privacy and SEO

Public loaders, the public API, sitemap and `getPostTranslations` continue to
query only `published` posts. Therefore drafts have no public route, sitemap
entry or hreflang. `x-default` and EN/ES alternates appear only from the set of
published siblings.

## Operations

Migration `0004_bilingual_translation_siblings.sql` replaces the non-unique group
index with `UNIQUE (translation_group_id, language)`. No new environment
variable or secret is required; translation uses the existing blog AI model,
timeout and key. Apply the migration before enabling the UI in an environment.
Until that index exists, the queue endpoint returns a recoverable `503` before
creating a run or calling the provider, so a code deployment cannot incur AI
spend and then fail while inserting the sibling.

Production applied migration `0004` on 2026-08-04 after verifying zero duplicate
`translation_group_id + language` rows. Existing image migrations `0002` and
`0003` were already physically present and were reconciled in the Drizzle
journal before recording `0004`; no post content or publication state changed.
