# Healing Minds Analytics and Advertising Tag Registry

Verified migration registry for `healingmindsp.com`. This file is the source of
truth for the public IDs that must survive the Replit to Vercel cutover.

| Provider | Public ID / destination | Consent category | Implementation |
|---|---|---|---|
| Google tag / GA4 | `G-WMRK41PX2E` | Analytics | One `gtag.js` loader; manual deduplicated `page_view` |
| Google Ads | `AW-17438126012` | Marketing | Destination linked to the same Google tag; no second loader |
| Google tag alias | `GT-PJ4656D6` | Registry only | Alias observed in the current Google container |
| Google tag alias | `GT-KFNPQ7PS` | Registry only | Alias observed in the current Google container |
| Microsoft Clarity | `sxayts0dzk` | Analytics | Loaded only after analytics consent |
| TikTok Pixel | `D3IKI7BC77UEJB9HBO0G` | Marketing | Loaded only after marketing consent |

## Explicit exclusions

- No Google Tag Manager container is installed.
- No verified Meta/Facebook Pixel ID is installed. The consent copy must not
  claim that a Facebook Pixel is active.
- `G-42LWDS101X` is a known incorrect GA4 ID and is blocked by the Vercel build
  guard.

## Conversion semantics

- `generate_lead` records a contact-form success or a click to call, WhatsApp,
  email, or CharmHealth booking.
- A CharmHealth click is a lead click, not a confirmed appointment. Keep the
  imported Google Ads action secondary until CharmHealth confirmation can be
  measured independently.
- Production Google Ads import status must be verified in the Google Ads
  account after the Vercel preview passes; source code alone cannot confirm it.

## Environment gate

`NEXT_PUBLIC_GA_MEASUREMENT_ID` must equal `G-WMRK41PX2E` on every Vercel build.
Preview is validated first. The same value is added to Production only after the
consent and network checks pass on the exact Preview deployment.
