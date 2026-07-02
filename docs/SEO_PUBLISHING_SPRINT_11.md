# Sprint 11 - Blog Presentation Parity

## Goal

Bring Healing Minds closer to the proven XL Homes public blog presentation layer without changing database schema, generation logic, publishing, Search Console, images, sitemap, or admin security.

This sprint is not a new feature invented outside the roadmap. It ports the public-facing rendering lessons from XL Homes after Sprint 10 made Auto Generate available.

## XL Homes Reference Checked

Reference repo:

`C:\Users\jorda\dev-repos\XL-Home`

Files inspected:

- `client/src/pages/BlogPage.tsx`
- `client/src/pages/BlogPostPage.tsx`
- `client/src/index.css`
- `server/blog/prompts.ts`

Relevant XL patterns:

- Blog index has a hero, category pills, a featured article card, a post grid, date/read-time metadata, and image hierarchy.
- Blog article page processes headings, adds ids, extracts a table of contents, shows author/date/read-time/category metadata, uses a specific `.blog-article` typography layer, and shows related posts.
- The richer article look comes from both prompt structure and frontend rendering. This sprint focuses only on the rendering/presentation layer.

## Scope

- Improve `/blog` and `/es/blog` index presentation.
- Add category filters derived from the public post list.
- Highlight a featured post first, using `isFeatured` when available and otherwise the newest post.
- Improve `/blog/:slug` and `/es/blog/:slug` article presentation.
- Add heading ids and a table of contents derived from safe H2/H3 content.
- Add related posts from the same category, falling back to recent posts.
- Replace generic `prose` rendering with a Healing-specific `.blog-article` CSS layer inspired by XL Homes.
- Keep all HTML sanitation intact.

## Out Of Scope

- No database migration.
- No AI prompt changes.
- No new external dependencies.
- No image generation.
- No inline image system.
- No Search Console hook changes.
- No sitemap changes.
- No publishing or admin workflow changes.
- No autopublish.

## Acceptance Criteria

- `npm run check` passes.
- `npm run build` passes.
- Public drafts remain private because only published posts are fetched by public API.
- Article HTML remains sanitized by server and client.
- Blog index still works in EN and ES.
- Blog posts still render synchronously from `window.__SSR_BLOG_POST__` when available.
- Related posts and TOC enhance the page but do not block article rendering if empty.

