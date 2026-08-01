import { expect, test, type Page } from "@playwright/test";

const deploymentOrigin = process.env.E2E_BASE_URL
  ? new URL(process.env.E2E_BASE_URL).origin
  : null;
const previewCredential = process.env.VERCEL_AUTOMATION_BYPASS_SECRET
  ? {
      name: "x-vercel-protection-bypass",
      value: process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
    }
  : process.env.VERCEL_OIDC_TOKEN
    ? {
        name: "x-vercel-trusted-oidc-idp-token",
        value: process.env.VERCEL_OIDC_TOKEN,
      }
    : null;

test.beforeEach(async ({ page }) => {
  if (!deploymentOrigin || !previewCredential) return;

  // Scope Preview authentication to the deployment origin. A global header
  // would leak the credential to analytics, Clarity, TikTok and every other
  // third-party request made by the page.
  await page.route(`${deploymentOrigin}/**`, async (route) => {
    await route.continue({
      headers: {
        ...route.request().headers(),
        [previewCredential.name]: previewCredential.value,
      },
    });
  });
});

type RouteCase = {
  entryPath: string;
  targetPath: string;
  expectedTitle: RegExp;
  expectedHeading: RegExp;
  expectedDescription: string;
  expectedCanonical: string;
  expectedLocale: "en" | "es";
};

const routes: RouteCase[] = [
  {
    entryPath: "/",
    targetPath: "/about",
    expectedTitle: /About Dr\. Melva Reve/i,
    expectedHeading: /Safe Space.*Heal.*Clarity/i,
    expectedDescription:
      "Learn about Dr. Melva Reve, a psychiatrist with 15+ years of experience serving Naples, FL. Bilingual care with cultural sensitivity.",
    expectedCanonical: "https://www.healingmindsp.com/about",
    expectedLocale: "en",
  },
  {
    entryPath: "/es",
    targetPath: "/es/acerca-de",
    expectedTitle: /Acerca de la Dra\. Melva Reve/i,
    expectedHeading: /Espacio Seguro.*Sanar.*Claridad/i,
    expectedDescription:
      "Conozca a la Dra. Melva Reve, psiquiatra con más de 15 años de experiencia sirviendo Naples, FL. Atención bilingüe con sensibilidad cultural.",
    expectedCanonical: "https://www.healingmindsp.com/es/acerca-de",
    expectedLocale: "es",
  },
];

async function rejectInitialConsent(page: Page) {
  const reject = page.getByTestId("button-reject-all");
  if (await reject.isVisible().catch(() => false)) {
    await reject.click();
    await expect(reject).toBeHidden();
  }
}

async function navigateFromHeader(page: Page, targetPath: string, isMobile: boolean) {
  if (isMobile) {
    await page.getByTestId("mobile-menu-toggle").click();
    const menu = page.getByTestId("mobile-menu");
    await expect(menu).toBeVisible();
    await menu.locator(`a[href="${targetPath}"]`).click();
    return;
  }

  const nav = page.getByTestId("desktop-nav");
  await expect(nav).toBeVisible();
  await nav.locator(`a[href="${targetPath}"]`).click();
}

for (const route of routes) {
  test(`one click replaces the rendered page for ${route.targetPath}`, async ({ page, isMobile }) => {
    const runtimeErrors: string[] = [];
    const credentialLeaks: string[] = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.stack || error.message));
    page.on("console", (message) => {
      if (message.type() === "error") runtimeErrors.push(message.text());
    });
    page.on("request", (request) => {
      if (!deploymentOrigin || new URL(request.url()).origin === deploymentOrigin) return;
      const headers = request.headers();
      if (
        headers["x-vercel-protection-bypass"] ||
        headers["x-vercel-trusted-oidc-idp-token"]
      ) {
        credentialLeaks.push(request.url());
      }
    });

    await page.goto(route.entryPath);
    await expect(page.locator("h1")).toBeVisible();
    await rejectInitialConsent(page);

    await navigateFromHeader(page, route.targetPath, isMobile);

    await expect(page).toHaveURL(new RegExp(`${route.targetPath.replaceAll("/", "\\/")}/?$`));
    await expect(page).toHaveTitle(route.expectedTitle);
    await expect(page.getByTestId("about-hero-title")).toContainText(route.expectedHeading);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("html")).toHaveAttribute("lang", route.expectedLocale);

    const description = page.locator('meta[name="description"]');
    const canonical = page.locator('link[rel="canonical"]');
    const openGraphTitle = page.locator('meta[property="og:title"]');
    const twitterTitle = page.locator('meta[name="twitter:title"]');
    await expect(description).toHaveCount(1);
    await expect(description).toHaveAttribute("content", route.expectedDescription);
    await expect(canonical).toHaveCount(1);
    await expect(canonical).toHaveAttribute("href", route.expectedCanonical);
    await expect(openGraphTitle).toHaveCount(1);
    await expect(openGraphTitle).toHaveAttribute("content", route.expectedTitle);
    await expect(twitterTitle).toHaveCount(1);
    await expect(twitterTitle).toHaveAttribute("content", route.expectedTitle);

    if (process.env.E2E_EXPECTED_SHA) {
      await expect(page.locator('meta[name="healing-build-sha"]')).toHaveAttribute(
        "content",
        process.env.E2E_EXPECTED_SHA,
      );
    }

    await page.goBack();
    await expect(page).toHaveURL(new RegExp(`${route.entryPath.replaceAll("/", "\\/")}/?$`));
    await expect(page.getByTestId("hero-title")).toBeVisible();
    await expect(page.getByTestId("about-hero-title")).toHaveCount(0);

    await page.goForward();
    await expect(page).toHaveURL(new RegExp(`${route.targetPath.replaceAll("/", "\\/")}/?$`));
    await expect(page.getByTestId("about-hero-title")).toContainText(route.expectedHeading);
    await expect(page.locator("h1")).toHaveCount(1);

    expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
    expect(credentialLeaks, credentialLeaks.join("\n")).toEqual([]);
  });
}
