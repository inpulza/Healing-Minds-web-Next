# Structured Data, AEO/GEO and Local SEO Playbook

This is the repeatable standard for Inpulza sites hosted on Vercel. It separates what a crawler receives from what a browser later hydrates, and it treats visible business facts as part of the structured-data contract.

## 1. Prove the deployed source before editing

1. Record repository, default branch, production commit SHA, Vercel project and team.
2. Identify the production runtime (`next start`, legacy Express, static export, etc.).
3. Trace every existing JSON-LD generator to a public route. A file that is imported only by an admin API or legacy command is not production coverage.
4. Preserve a baseline audit artifact before implementation.

Never infer coverage from the existence of schema code. Fetch the official domain.

## 2. Audit raw HTML and hydrated DOM separately

For representative EN/ES routes and then every sitemap URL:

- request initial HTML without JavaScript;
- repeat with normal browser, Googlebot, Bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot and PerplexityBot user agents;
- record status, redirects, canonical, meta robots, `X-Robots-Tag`, hreflang and JSON-LD count;
- parse every `application/ld+json` block and record types, `@id`, references and JSON errors;
- separately load a real browser and check the settled DOM, console and navigation.

SSR evidence answers whether non-JavaScript crawlers can understand the page. Hydrated evidence catches duplicate or stale graphs during client navigation. Neither substitutes for the other.

## 3. Crawl the complete sitemap

Do not extrapolate from home.

- Resolve every `<loc>` and require the intended 200/redirect contract.
- Group coverage by language and page kind: home, service index, service detail, physical office, service area, contact, telehealth, blog index, article and legal.
- Require one parseable route-owned graph and a self-canonical `WebPage` or subtype per indexable URL.
- Compare the URL count with the production database-backed count. A local fallback can legitimately contain fewer articles, but Preview/Production must match the live count.
- On database failure, preserve the last valid ISR sitemap/llms response; never cache a degraded snapshot as current truth.

## 4. Build one entity model before page schemas

Create one canonical business profile shared by visible NAP and JSON-LD.

- Stable global IDs: `/#organization`, `/#person`, `/#website`.
- Route IDs: `{canonical}#webpage`, `#breadcrumb`, `#service`, `#faq`, `#blog`, `#article`.
- Use one `@context` and one `@graph` block per URL.
- Render the script from the App Router page segment, not a persistent client layout.
- Escape `<` during serialization to prevent a closing-script payload.
- Keep EN/ES page entities separate while referencing the same organization and person IDs.

Schema.org type eligibility and Google rich-result eligibility are different. A valid `MedicalClinic`, `Physician`, `Service` or `Person` graph can improve machine understanding without creating a Google rich result.

Primary references:

- https://nextjs.org/docs/app/guides/json-ld
- https://schema.org/
- https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- https://developers.google.com/search/docs/appearance/structured-data/organization
- https://developers.google.com/search/docs/appearance/structured-data/local-business
- https://developers.google.com/search/docs/appearance/structured-data/breadcrumb

## 5. Local entity and NAP rules

Use sources in this order:

1. current Google Business Profile;
2. official business/provider registries;
3. current public website and signed operational confirmation;
4. secondary directories only as corroboration.

Record source URL and verification date. Do not infer fax, accepting-new-patients status, price range, board certification, rating, coordinates or additional branches.

For a practice with one office and several city pages:

- only the physical office receives the full medical/local business entity, address, hours and verified geo;
- satellite pages receive `Service` plus `areaServed` and point `provider` to the one practice;
- headings say “serving [city]” or “for residents of [city]”, never imply an office there;
- all directions target the canonical map/address and qualify travel estimates by origin and live traffic.

## 6. Visible claims are part of the schema audit

FAQ schema must come from the same data rendered in HTML. Before marking a visible FAQ:

- remove or clinically confirm exact appointment durations, same-day/urgent/flexible scheduling, accepting-new-patient claims and payment promises;
- do not claim partnerships, routine record sharing or patient testimonials without evidence;
- make provider coordination consent-based and case-by-case;
- state that appointment modality is clinically determined;
- limit telehealth by the patient's physical location and the clinician's applicable license.

All FAQ answers must exist in initial HTML. They may be visually collapsed with HTML/CSS, but must not depend on JavaScript mounting.

Google currently limits FAQ rich results mainly to authoritative government and health sites. Valid FAQ markup still does not guarantee display: https://developers.google.com/search/blog/2023/08/howto-faq-changes

## 7. Crawler policy and AEO/GEO

Audit `robots.txt`, `sitemap.xml`, `llms.txt`, meta robots and response headers together.

- Googlebot/Bingbot: search crawling and indexing.
- OAI-SearchBot/Claude-SearchBot/PerplexityBot: search or answer retrieval/indexing according to each provider's current documentation.
- GPTBot/ClaudeBot: model-training crawler controls.
- ChatGPT-User/Claude-User/Perplexity-User: user-initiated retrieval; treatment of robots rules differs by provider.

Allowing a bot does not guarantee indexing, ranking, citation or answer inclusion. Recheck provider documentation at audit time:

- https://developers.openai.com/api/docs/bots
- https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- https://docs.perplexity.ai/docs/resources/perplexity-crawlers

`llms.txt` is a supplementary plain-text map, not a substitute for crawlable HTML, sitemap, canonicals or structured data.

## 8. Validator matrix and limitations

Use several signals:

- JSON parse and internal graph reference tests;
- Schema.org Validator for vocabulary errors;
- Google Rich Results Test for Google-supported result types;
- raw HTML inspection and real-browser E2E;
- production sitemap crawl.

The Rich Results Test does not validate every Schema.org medical/local type. A result with zero eligible rich-result items is not proof that JSON-LD is absent. Record rate limits, bot protection, unsupported types and stale cache as tool limitations, not site failures.

## 9. Mandatory regression gates

Unit/contract tests should fail on:

- invalid JSON, duplicate `@id`, unresolved internal references or more than one graph;
- a satellite typed as a branch/local business;
- NAP variations or unverified legacy fields;
- route-owned schema rendered from a persistent layout;
- unsupported scheduling, telehealth, partnership or testimonial claims;
- false road directions or duplicated travel times;
- FAQ text diverging from visible SSR content.

Browser E2E must cover:

- scripts disabled on representative EN/ES pages;
- all sitemap URLs and all required crawler user agents;
- desktop and mobile client navigation with exactly one current graph;
- no console/page errors;
- exact deployment SHA on Vercel Preview before merge.

## 10. Delivery workflow

1. Isolated local worktree outside OneDrive.
2. Unit, TypeScript, build and full E2E green.
3. Independent judge/reviewer reruns the evidence and searches for claims the implementation tests missed.
4. Draft PR and exact-SHA Vercel Preview.
5. Preview sitemap count, raw HTML, hydrated DOM, validators and deployed E2E.
6. Read and classify every Code Review note, including late reviews.
7. Squash merge through GitHub; keep the remote branch.
8. Verify the exact production SHA and repeat the complete production crawl.
9. Save baseline, candidate and production artifacts plus decisions and unresolved business confirmations.

This process improves machine-readable consistency and reduces false local/entity signals. It cannot promise Google rankings or citations by answer engines.
