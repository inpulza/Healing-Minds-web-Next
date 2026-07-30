type StaticAsset = string | { src: string };

/** Return the browser URL for assets imported by either Vite (string) or Next (StaticImageData). */
export function assetUrl(asset: StaticAsset): string {
  return typeof asset === "string" ? asset : asset.src;
}
