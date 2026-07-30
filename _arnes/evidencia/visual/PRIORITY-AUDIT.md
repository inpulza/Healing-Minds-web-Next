# Priority visual audit — Next.js migration

Date: 2026-07-30

## Method

- Source of truth: `https://www.healingmindsp.com`.
- Candidate: `http://127.0.0.1:3100` production Next build.
- Viewports: `390x844`, `768x1024`, `1024x900`, `1440x900`, `1920x1080`, `2560x1440`.
- DPR 1, full-page raw capture, right-edge crop only when transformed marquees enlarged the raw canvas.
- The capture performs a slow full-page scroll, returns to the top, waits for settled state, and never changes opacity, transforms or page DOM.
- Raw and comparable captures are retained beside each `report.json`.

## Results

| Route | 390 | 768 | 1024 | 1440 | 1920 | 2560 | Height parity |
|---|---:|---:|---:|---:|---:|---:|---|
| `/services/anxiety-treatment` | 0.89% | 1.04% | 1.42% | 1.48% | 1.11% | 0.012% | exact 6/6 |
| `/es/blog/tratamiento-ansiedad-naples` | 0.0169% | 0.0141% | 0.0130% | 0.0092% | 0.0080% | 0.0061% | exact 6/6 |
| `/contact` | 0.0834% | 0.1486% | 0.0709% | 0.0523% | 0.0455% | 0.0341% | exact 6/6 |
| `/privacy-policy` | 0.0621% | 0.0840% | 0.0530% | 0.0325% | 0.0287% | 0.0215% | exact 6/6 |
| `/es/ubicaciones/psiquiatra-naples` | 2.99% | 8.10% | 4.99% | 4.67% | 4.89% | 3.63% | exact 6/6 |
| `/es` | 11.66% | 5.70% | 6.27% | 2.98% | 4.61% | 3.46% | exact except 390 (+362 px candidate) |
| `/` | 11.84% | 5.94% | 6.46% | 9.14% | 7.06% | 5.41% | exact at 768; dynamic media affects others |

## Classification

### Exact or near-exact routes

The blog article, Contact, Privacy Policy and Anxiety Treatment preserve the source geometry at all six viewports. Their residual raster delta is primarily antialiasing and dynamic overlay state.

### Location route

All six page heights are exact. The larger raster delta is concentrated in map/media slots whose public-source requests do not consistently settle during full-page capture. Candidate assets are present and independently pass the 77-route asset audit.

### Home EN/ES

The public source intermittently leaves these media slots blank while the candidate correctly renders them:

- telehealth Florida map;
- clinician/laptop photograph;
- clinician/patient photograph;
- Southwest Florida map;
- accepted-insurance logo strip and contact map/brand media in some runs.

On Spanish mobile, the first accumulated height difference starts at **“Guiados por la pasión”**:

- source section: 1,148 px with the lazy image absent;
- candidate section: 1,446 px with the image loaded;
- delta introduced there: +298 px.

The remaining +64 px is introduced in Contact by media/logo settlement. Sections before “Guiados por la pasión” have identical top offsets and heights. This is classified as a source-capture lazy-loading anomaly, not a candidate regression. Raw FAIL evidence remains preserved; no DOM or screenshot alteration was used to hide it.

## Supporting gates

- Editorial text parity: 77/77 routes.
- SEO/HTTP metadata parity: 77/77 routes for audited fields.
- Asset audit: 77 routes, 0 HTTP failures, 0 broken images, 0 `[object Object]` image sources.
- Hero temporal contract: one visible active `h1` before scroll and after returning to the top.
- Next build, TypeScript and automated contracts pass on the audited build.
