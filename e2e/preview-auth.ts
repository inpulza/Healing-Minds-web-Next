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

export async function authenticateProtectedPreview(
  page: Page,
  headers: Record<string, string> = {},
) {
  if (!deploymentOrigin || (!previewCredential && Object.keys(headers).length === 0)) return;

  await page.route(`${deploymentOrigin}/**`, async route => {
    let response;
    try {
      response = await route.fetch({
        headers: {
          ...(await route.request().allHeaders()),
          ...headers,
          ...(previewCredential ? { [previewCredential.name]: previewCredential.value } : {}),
        },
        maxRedirects: 0,
      });
    } catch {
      const pathname = new URL(route.request().url()).pathname;
      throw new Error(`Preview authentication fetch failed for ${pathname}.`);
    }
    await route.fulfill({ response });
  });
}

export async function finishProtectedPreview(page: Page) {
  await page.unrouteAll({ behavior: "ignoreErrors" });
}
