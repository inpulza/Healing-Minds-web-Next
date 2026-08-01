// Privacy decision: TikTok Pixel is disabled across every public route.
// Re-enabling it requires a reviewed code change so a Vercel environment
// variable cannot silently turn advertising tracking back on.
export const TIKTOK_PIXEL_SITEWIDE_ENABLED = false as const;
