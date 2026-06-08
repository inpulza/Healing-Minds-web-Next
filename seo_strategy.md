# SEO Strategy

## In scope
- Public marketing pages
- Public service pages
- Public location pages
- Public legal and trust pages
- English and Spanish versions of all public pages

## Out of scope
- Authenticated or admin surfaces
- Internal API endpoints except where they affect crawlability or indexation

## Target audience
- Prospective psychiatry patients and families in Naples, Florida and nearby Southwest Florida communities
- English- and Spanish-speaking visitors seeking psychiatric care or telepsychiatry in Florida

## Primary keywords
- psychiatrist Naples FL
- psychiatric care Naples FL
- anxiety treatment Naples FL
- depression treatment Naples FL
- ADHD treatment Naples FL
- telepsychiatry Florida
- bilingual psychiatrist Naples FL

## Dismissed categories
- None yet

## Notes
- This project uses a Vite + React frontend with Wouter routing and an Express server.
- Public pages are served through a shared SPA HTML shell with server-side head injection for route-specific metadata.
- `getStaticPageBody()` now covers the home, about, contact, service-detail, location, hub, telepsychiatry, and legal/trust routes, so the public site is no longer an empty-body shell for non-rendering crawlers on those pages.
- The remaining high-impact SEO risk is fidelity, not absence: several satellite location pages still send generic initial HTML/head content compared with the richer hyperlocal copy users see after hydration.
- AI crawlers and social preview bots should be evaluated from the server response, not the hydrated React view, because they do not execute the full client app.
