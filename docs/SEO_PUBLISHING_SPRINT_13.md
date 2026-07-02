# Sprint 13 - Curated Featured Images

## Goal

Move Healing Minds closer to the XL Homes blog engine image workflow without introducing visual AI generation risk too early for a medical/YMYL site.

Instead of generating new clinical images, this sprint auto-selects from a curated set of already-approved Healing Minds assets and applies the best matching image to AI-generated drafts.

## Why This Sprint Exists

XL Homes generates hero and inline images as part of the blog automation flow. Healing Minds already has `featuredImage` and `featuredImageAlt` fields, but generated drafts were saved without a featured image. That left the public blog visually repetitive and kept the verification warning open.

For Healing Minds, the safer intermediate step is:

- no generated patient/doctor scenes,
- no new storage service,
- no provider dependency,
- no invented medical imagery,
- human review still required before publishing.

## Scope

- Add stable public blog image assets under `/images/blog/approved/`.
- Add a deterministic curated featured image selector.
- Auto-assign a curated `featuredImage` and `featuredImageAlt` when AI Generate or Auto Generate creates a draft.
- Add a deterministic `featuredImage` fix for existing drafts.
- Show a small featured image preview in the admin editor.
- Resolve relative blog image URLs to absolute URLs for SSR `og:image`, `twitter:image`, and JSON-LD.
- Document the sprint and non-goals.

## Non-Goals

- No AI image generation.
- No inline images.
- No image upload UI.
- No object storage integration.
- No DB migration.
- No publishing, sitemap, or Search Console changes.
- No bypass of human review.

## Expected Behavior

When a draft is generated:

1. The existing topic/category/tags/content are scored against a curated image library.
2. The best matching image URL is saved to `featuredImage`.
3. A safe descriptive alt text is saved to `featuredImageAlt`.
4. The draft remains `status: draft` and `publishedAt: null`.
5. Verification should mark `featuredImage` and `featuredImageAlt` as passing.

For existing drafts:

1. The `Featured image` verification row exposes a `Fix` action.
2. The fix selects a curated image and alt text.
3. The fix is rejected for published posts, like the other deterministic fixes.

## Validation Checklist

- `npm run check`
- `npm run build`
- Curated image asset returns `200` (for example `/images/blog/approved/anxiety-treatment.webp`).
- AI Generate creates a draft with `featuredImage` and `featuredImageAlt`.
- Auto Generate creates a draft with `featuredImage` and `featuredImageAlt`.
- Generated drafts stay private and unpublished.
- `featuredImage` fix works on a draft with no image.
- `featuredImage` fix rejects published posts.
- Public blog index/post pages render the curated image URLs.
- SSR metadata emits absolute featured image URLs for blog posts.
