---
name: California landing pages (noindex)
description: Why /es/psiquiatra-california and /psychiatrist-california exist as noindex pages, the hard content rules, and what unblocks indexing (Fase B).
---

# California landings — status and rules

Two bilingual CA telehealth landings live on main: `/es/psiquiatra-california` (primary) and `/psychiatrist-california`. Both are **noindex,follow on purpose**.

**Why noindex (actualizado 2026-07-28):** la licencia estatal **ya está verificada por documento** — el cliente aportó el certificado de la Medical Board of California (Physician and Surgeon, agosto 2024) y la página CA muestra ya el número de licencia, igual que la página de Florida. Lo que sigue bloqueando la indexación: precio, teléfono de CA, el Aviso al Consumidor de la MBC con su QR, y el visto bueno del cliente. La **certificación de junta (board certification) sigue sin verificar**, así que en toda la web la redacción es de licenciatura ("con licencia" / "licensed"), nunca "board-certified".

**How to apply / what unblocks indexing (called "Fase B", NOT done):** the CA license is verified and already displayed on the page; what is still missing is pricing, the CA phone number, the MBC Notice to Consumers (with its QR) and the owner's sign-off. Only then: flip robots to index and add both URLs to sitemap.ts, llms.txt, DEFAULT_PATHS and nameMapping. The page ships with those facts simply ABSENT — there are no ⟨PENDIENTE⟩/⟨PENDING⟩ placeholders left anywhere in `client/src`, so do not go hunting for placeholders to replace.

**Internal linking (Jordan's decision, Jul 2026):** the CA pages stay UNLINKED from all site navigation (no menu, no footer) until Fase B data is complete; direct URL only (for campaigns). When Fase B happens, add the link to BOTH the footer and the "Áreas de Servicio" menu, in both languages.

## Hard content rules for these pages (client-mandated, YMYL)
- No medication names; no word "terapia"/"therapy"; no em-dashes; adults 18+ only.
- No Naples address, no FL license ME165518, no InsuranceLogos, no `tel:` CTA (main CTA = CharmHealth booking + WhatsApp wa.me/12399201019 with `trackLeadConversion('whatsapp','california_landing')`).
- Crisis resources on CA pages = only 988/911 (no Florida-local lines).
- Schema: Service with areaServed State California, provider only via `@id: #organization` (never inherit Naples PostalAddress), no FAQPage schema.
- Green italic Playfair span in headlines (site pattern).

**Page sections (Jul 2026):** Jordan expanded the CA page with the shared Reviews component (REAL Google Business Profile reviews via /api/reviews, same as home; Jordan explicitly approved despite Naples GBP links, replacing earlier inline anonymized quotes), a video section reusing CompactVideoCarousel (TikTok, self-contained), and extra FAQs (payment/cash pay, first appointment, privacy). Florida telepsychiatry page keeps insurance (Jordan confirmed only CA is cash pay).

## Open flags awaiting Jordan's decision (reported, do not act unilaterally)
- RESOLVED: hero photo — Jordan supplied a doctor-holding-California-map image; CharmHealthBooking now accepts optional `heroImage`/`heroImageAlt` props (defaults keep Florida pages byte-identical), CA page passes its own asset. Same pattern for any future state landing.
- Shared Header/Footer on CA pages still show Naples address + main tel: link (rule was applied to page content/schema only).
- Fax mismatch: site shows (239) 330-2073 vs public listings (239) 423-0292 — do not touch, client must confirm.
- WhatsApp (239) 920-1019 differs from main line (239) 423-0272 — intentional per docs, but flagged.
- Al retirar una credencial hay que barrer **todo** el registro de contenido, no solo badges y traducciones: el módulo legal de consentimiento de telesalud siguió afirmando "board-certified" / "certificada por la junta médica" en cuatro sitios mucho después de quitarlo del resto del sitio, y una página legal es justo donde más caro sale. Grep por la afirmación en `client/src/data/pageContent/**` incluidas las páginas legales.
- "15 años" experience badge omitted pending client confirmation; "Certificada" badge replaced with "Médica Psiquiatra"/"Psychiatrist, M.D." site-wide (board-certified claims removed everywhere — commented out in `data/content.ts` and `data/translations.ts`; this removal ships with the page-content-modules change, so verify it is present before trusting this line on an older tree).

Note: `npm run seo:check` audits sitemap URLs only, so the CA pages don't appear in it and it passes 0 errors — that is expected, not a gap.
