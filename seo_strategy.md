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
- The site now uses partial server-injected static body HTML: home, about, contact, service-detail, and location routes send meaningful body content in the initial HTML, while hub, telepsychiatry, and legal/trust routes still rely on client rendering for body content.
