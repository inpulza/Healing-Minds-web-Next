# Blog Visual and Editorial Preview Method

## Purpose

This is the reusable Inpulza method for client blog engines that generate
reviewable images and let an editor inspect a private draft before publication.

XL Homes remains the behavioral reference: classify the article subject first,
then choose an appropriate visual family such as exterior, interior, detail,
aerial, or construction. Each client replaces those families with its own
niche, brand, safety, and compliance rules.

Healing Minds adapts that pattern to mental-health education. It does not copy
XL Homes architectural prompts or its legacy admin implementation.

## Visual Selection Pipeline

Image direction is selected in this order:

1. Inline heading, when generating an inline image.
2. Article title.
3. Category.
4. Excerpt.
5. Sanitized article text.

The source text is classified locally. It is not copied into the image-provider
prompt. Only approved broad themes and prewritten safe scene directions leave
the application.

Healing Minds theme families include:

- telehealth;
- medication follow-up;
- attention and focus;
- anxiety;
- depression;
- mood stability;
- trauma-informed wellbeing;
- sleep;
- stress;
- Florida access;
- general mental wellbeing.

Each family has several scene options. Common topics deliberately include
people in natural activity, while some families retain an environmental or
detail option when that better fits the subject.

## Prompt Layers

Every provider prompt is assembled from fixed layers:

1. **Purpose**: hero or inline editorial image and article language.
2. **Approved theme**: broad, non-identifying educational topic.
3. **Scene**: a concrete human action, environment, or detail selected from the
   theme family.
4. **People**: fictional adults, varied age, skin tone, body type, and cultural
   background; never a real patient or clinician likeness.
5. **Composition**: hero and inline images use different shot families so the
   article does not repeat the same desk/window view.
6. **Brand art direction**: bright cream, soft sage, pale blue, warm neutrals,
   vibrant but natural accents, campaign lighting, authentic skin and fabric
   texture, and a clean background.
7. **Medical safety**: no crisis, diagnosis, outcome, cure, testimonial,
   before/after claim, medication packaging, readable records, logos, or text.
8. **Output constraints**: horizontal 3:2 crop, coherent objects and anatomy,
   and safe responsive cropping.

### Healing Minds campaign treatments

The approved visual bar is a premium fashion/lifestyle campaign, adapted to a
psychiatry practice without copying any specific brand, photographer, person,
wardrobe, or artwork. A deterministic treatment adds variety while the shared
color and realism rules keep the library cohesive:

- seamless cream, sage, or sky-blue studio with sculpted light;
- sunlit South Florida lifestyle with defined architectural shadows;
- textured warm interior with directional side light;
- clean cinematic cool/warm color separation;
- candid documentary-fashion movement with subtle fine grain.

Images should have a medium-format editorial feel, professional portrait-lens
rendering, punchy but believable color, clean blacks, luminous whites, preserved
highlights, lifted shadow detail, skin texture, flyaway hair, fabric folds, and
unforced expressions. Wardrobe is elevated everyday clothing in unbranded
cotton, linen, knit, or denim.

Reference images containing children define lighting, color, framing, texture,
and campaign energy only. Healing Minds generation uses fictional adults and
does not add children or infants.

The prompt version is persisted with every candidate. A material methodology
change must increment that version so editors can identify older variants.

## Variability Contract

- A post receives a deterministic scene and composition based on post, role,
  slot, and inline heading.
- A hero and an inline image must not use the same composition family.
- Inline headings may select a more specific theme than the article title.
- A curated hero remains selected until a human explicitly selects a completed
  AI candidate.
- Regeneration creates another candidate; it never overwrites the selected
  image.
- Generated images never publish a post or bypass human review.

This contract avoids random prompt drift while distributing scenes consistently
across a growing library.

## Editorial Preview Contract

The eye action in the admin is a private editorial preview, not a publish
action. It must:

- fetch the complete saved post through an authenticated, `no-store` endpoint;
- materialize only selected inline image variants with the same server renderer
  used by public posts;
- use the same client sanitizer and article typography as the public blog;
- show the hero, H1, excerpt, author, H2/H3 hierarchy, paragraphs, lists, links,
  blockquotes, inline figures, captions, and tags;
- remove any unmanaged or external inline image URL;
- state clearly that nothing is published from the preview window.

Draft-only previews do not require a public URL. Published posts may still offer
the separate “open published post” action.

## Environment Switch

`BLOG_IMAGE_ENABLED` is a Vercel environment variable, not a password and not a
value editors type into the application.

- Missing or any value other than `true`: AI image generation stays off.
- `true` plus `OPENAI_API_KEY` and Vercel Blob configuration: generation
  controls become available.
- Preview and Production are separate Vercel scopes. Enable Preview first,
  validate cost, storage, output, and review controls, then enable Production
  only after approval.
- Changing a Vercel environment variable requires a new deployment to affect
  that environment.

The application remains fail-closed for provider access and fail-open for the
draft: an image failure cannot delete the curated fallback or publish content.

## Clone Checklist

Before adapting this method to another client:

1. Inspect the living XL Homes implementation and the target client's approved
   brand/reference material.
2. Define target-specific theme families and concrete scene options.
3. Define people, composition, color, lighting, exclusions, and YMYL rules.
4. Keep article text local; send only approved safe visual briefs.
5. Persist prompt version, provider/model, candidate state, dimensions, and
   review decision.
6. Reuse one public/admin renderer rather than implementing a second preview.
7. Test hero and inline rendering on desktop, tablet, and mobile.
8. Inspect hands, faces, object coherence, text/logos, crop safety, and clinical
   implications before selecting a candidate.
9. Confirm the draft remains private throughout generation and preview.
10. Roll the environment flag from Preview to Production only after human
    approval.
11. For bilingual siblings, do not share one deletable Blob row between posts.
    Synchronize the human-approved image set automatically in either language
    while the destination is still a draft, copy managed bytes into
    target-owned keys, rebuild target-language alt/caption, and verify both
    directions without another paid generation. Never overwrite a reviewed or
    published destination silently.
