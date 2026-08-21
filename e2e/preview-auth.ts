import type { Page } from "@playwright/test";

const deploymentUrl = process.env.E2E_BASE_URL ? new URL(process.env.E2E_BASE_URL) : null;
const deploymentOrigin = deploymentUrl?.origin ?? null;
const protectedPreviewHost = /^(?:healing-minds-psychi-git-[a-z0-9-]+-inpulzasolutions-6847s-projects|healing-minds-psychiatry-nextjs-[a-z0-9]+)\.vercel\.app$/i;
const previewCredential = deploymentUrl && protectedPreviewHost.test(deploymentUrl.hostname)
  ? process.env.VERCEL_AUTOMATION_BYPASS_SECRET
    ? { name: "x-vercel-protection-bypass", value: process.env.VERCEL_AUTOMATION_BYPASS_SECRET }
    : process.env.VERCEL_OIDC_TOKEN
      ? { name: "x-vercel-trusted-oidc-idp-token", value: process.env.VERCEL_OIDC_TOKEN }
      : null
  : null;

export function protectedPreviewHeaders(
  headers: Record<string, string> = {},
): Record<string, string> {
  return previewCredential
    ? { ...headers, [previewCredential.name]: previewCredential.value }
    : headers;
}

export async function authenticateProtectedPreview(
  page: Page,
  headers: Record<string, string> = {},
) {
  const hasHeaders = Object.keys(headers).length > 0;

  if (!deploymentOrigin) {
    if (hasHeaders) await page.setExtraHTTPHeaders(headers);
    return;
  }

  if (!previewCredential && !hasHeaders) return;

  await page.route(`${deploymentOrigin}/**`, async route => {
    const authenticatedHeaders = {
      ...(await route.request().allHeaders()),
      ...protectedPreviewHeaders(headers),
    };
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        const response = await route.fetch({
          headers: authenticatedHeaders,
          maxRedirects: 0,
        });
        await route.fulfill({ response });
        return;
      } catch {
        if (attempt === 2) {
          const pathname = new URL(route.request().url()).pathname;
          throw new Error(`Preview authentication fetch failed for ${pathname}.`);
        }
      }
    }
  });
}

export async function finishProtectedPreview(page: Page) {
  await page.unrouteAll({ behavior: "ignoreErrors" });
}
