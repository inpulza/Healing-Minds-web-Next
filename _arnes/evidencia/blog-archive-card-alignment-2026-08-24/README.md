# Blog archive card alignment — 2026-08-24

Focused browser evidence for the regular public blog archive cards rendered through the real `BlogIndex` component and deterministic EN/ES archive fixture.

## Contract checked

- Category and date stay in the explicit primary metadata row.
- Reading time stays in an independent second metadata row.
- Title and excerpt keep natural length without truncation.
- The CTA remains at a constant bottom inset and aligns with peer cards in the same grid row.
- Mobile cards keep natural height rather than inheriting an artificial desktop minimum.
- Browser `pageerror`, unexpected console errors and horizontal overflow fail the capture run.

## Responsive matrix

| Viewport | English | Spanish |
|---|---|---|
| 390x844 | [EN mobile](./en-blog-cards-390x844.png) | [ES mobile](./es-blog-cards-390x844.png) |
| 1024x900 | [EN tablet](./en-blog-cards-1024x900.png) | [ES tablet](./es-blog-cards-1024x900.png) |
| 1280x900 | [EN intermediate](./en-blog-cards-1280x900.png) | [ES intermediate](./es-blog-cards-1280x900.png) |
| 1440x900 | [EN laptop](./en-blog-cards-1440x900.png) | [ES laptop](./es-blog-cards-1440x900.png) |
| 1920x1080 | [EN desktop](./en-blog-cards-1920x1080.png) | [ES desktop](./es-blog-cards-1920x1080.png) |
| 3440x1440 | [EN ultrawide](./en-blog-cards-3440x1440.png) | [ES ultrawide](./es-blog-cards-3440x1440.png) |

Machine-readable geometry and runtime results: [`measurements.json`](./measurements.json).

## Result

PASS 12/12 captures. Every viewport stayed within its requested width, metadata rows remained separate, runtime errors were empty, and first-row CTA top/bottom spread stayed below 1 CSS pixel.
