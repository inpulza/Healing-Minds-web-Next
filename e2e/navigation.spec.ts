import { expect, test, type Page } from "@playwright/test";

const deploymentUrl = process.env.E2E_BASE_URL
  ? new URL(process.env.E2E_BASE_URL)
  : null;
const deploymentOrigin = deploymentUrl?.origin ?? null;
const acceptsPreviewCredential = deploymentUrl?.hostname.endsWith(".vercel.app") ?? false;
const previewCredential = acceptsPreviewCredential && process.env.VERCEL_AUTOMATION_BYPASS_SECRET
  ? {
      name: "x-vercel-protection-bypass",
      value: process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
    }
  : acceptsPreviewCredential && process.env.VERCEL_OIDC_TOKEN
    ? {
        name: "x-vercel-trusted-oidc-idp-token",
        value: process.env.VERCEL_OIDC_TOKEN,
      }
    : null;

test.beforeEach(async ({ page }) => {
  if (!deploymentOrigin || !previewCredential) return;

  // Scope Preview authentication to the deployment origin. A global header
  // would leak the credential to analytics, Clarity, TikTok and every other
  // third-party request made by the page. Fetch without following redirects:
  // Playwright otherwise forwards header overrides through the redirect chain.
  await page.route(`${deploymentOrigin}/**`, async (route) => {
    let response;
    try {
      response = await route.fetch({
        headers: {
          ...(await route.request().allHeaders()),
          [previewCredential.name]: previewCredential.value,
        },
        maxRedirects: 0,
      });
    } catch {
      const pathname = new URL(route.request().url()).pathname;
      throw new Error(`Preview authentication fetch failed for ${pathname}.`);
    }
    await route.fulfill({ response });
  });
});

test.afterEach(async ({ page }) => {
  // A page can finish its assertions while late images are still in flight.
  // The browser closing can legitimately cancel those callbacks. Remove the
  // handler and ignore only teardown-time callback errors; in-test failures
  // still surface through the awaited route handler and the test assertions.
  await page.unrouteAll({ behavior: "ignoreErrors" });
});

type RouteCase = {
  entryPath: string;
  entryTitle: string;
  entryDescription: string;
  entryCanonical: string;
  targetPath: string;
  expectedTitle: string;
  expectedHeading: RegExp;
  expectedDescription: string;
  expectedCanonical: string;
  expectedLocale: "en" | "es";
  secondPath: string;
  secondTitle: string;
  secondDescription: string;
  secondCanonical: string;
};

const routes: RouteCase[] = [
  {
    entryPath: "/",
    entryTitle:
      "Expert Psychiatric Care in Naples, FL - Anxiety, Depression, ADHD, Therapy | Dr. Melva Reve",
    entryDescription:
      "Dr. Melva Reve provides expert psychiatric care in Naples, FL. Specializing in anxiety, depression, ADHD, and therapy. Mental health services for Southwest Florida. Call (239) 423-0272.",
    entryCanonical: "https://www.healingmindsp.com/",
    targetPath: "/about",
    expectedTitle: "About Dr. Melva Reve - Psychiatrist in Naples, FL",
    expectedHeading: /Safe Space.*Heal.*Clarity/i,
    expectedDescription:
      "Learn about Dr. Melva Reve, a psychiatrist with 15+ years of experience serving Naples, FL. Bilingual care with cultural sensitivity.",
    expectedCanonical: "https://www.healingmindsp.com/about",
    expectedLocale: "en",
    secondPath: "/contact",
    secondTitle: "Contact Dr. Melva Reve - Book Psychiatric Consultation Naples FL",
    secondDescription:
      "Contact Healing Minds Psychiatry in Naples, FL to schedule your consultation. Call (239) 423-0272 or send a message. Bilingual services available.",
    secondCanonical: "https://www.healingmindsp.com/contact",
  },
  {
    entryPath: "/es",
    entryTitle:
      "Atención Psiquiátrica Experta en Naples, FL - Ansiedad, Depresión, TDAH, Terapia | Dra. Melva Reve",
    entryDescription:
      "La psiquiatra Dra. Melva Reve brinda atención psiquiátrica experta en Naples, FL. Especializada en ansiedad, depresión, TDAH y terapia. Servicios de salud mental para el suroeste de Florida. Llame (239) 423-0272.",
    entryCanonical: "https://www.healingmindsp.com/es",
    targetPath: "/es/acerca-de",
    expectedTitle: "Acerca de la Dra. Melva Reve - Psiquiatra en Naples, FL",
    expectedHeading: /Espacio Seguro.*Sanar.*Claridad/i,
    expectedDescription:
      "Conozca a la Dra. Melva Reve, psiquiatra con más de 15 años de experiencia sirviendo Naples, FL. Atención bilingüe con sensibilidad cultural.",
    expectedCanonical: "https://www.healingmindsp.com/es/acerca-de",
    expectedLocale: "es",
    secondPath: "/es/contacto",
    secondTitle: "Contactar Dra. Melva Reve - Reservar Consulta Psiquiátrica Naples FL",
    secondDescription:
      "Contacte Healing Minds Psychiatry en Naples, FL para programar su consulta. Llame (239) 423-0272 o envíe un mensaje. Servicios bilingües disponibles.",
    secondCanonical: "https://www.healingmindsp.com/es/contacto",
  },
];

const californiaRoutes = [
  {
    path: "/psychiatrist-california",
    expectedTitle: "Online Psychiatrist in Spanish | California | Healing Minds",
    expectedDescription:
      "A psychiatrist who sees you in Spanish from home, anywhere in California. Anxiety, depression and ADHD. Direct pay, clear pricing, no insurance.",
    expectedCanonical: "https://www.healingmindsp.com/psychiatrist-california",
    expectedLocale: "en",
  },
  {
    path: "/es/psiquiatra-california",
    expectedTitle: "Psiquiatra Online en Español | California | Healing Minds",
    expectedDescription:
      "Psiquiatra que te atiende en español desde tu casa, en California. Ansiedad, depresión y TDAH. Pago directo, precio claro, sin seguros.",
    expectedCanonical: "https://www.healingmindsp.com/es/psiquiatra-california",
    expectedLocale: "es",
  },
] as const;

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
    await menu.locator(`a[data-testid^="mobile-nav-"][href="${targetPath}"]`).click();
    return;
  }

  const nav = page.getByTestId("desktop-nav");
  await expect(nav).toBeVisible();
  await nav.locator(`a[href="${targetPath}"]`).click();
}

async function expectUniqueMetadata(
  page: Page,
  expectedTitle: string,
  expectedDescription: string,
  expectedCanonical: string,
) {
  const description = page.locator('meta[name="description"]');
  const canonical = page.locator('link[rel="canonical"]');
  const openGraphTitle = page.locator('meta[property="og:title"]');
  const twitterTitle = page.locator('meta[name="twitter:title"]');
  await expect(page).toHaveTitle(expectedTitle);
  await expect(description).toHaveCount(1);
  await expect(description).toHaveAttribute("content", expectedDescription);
  await expect(canonical).toHaveCount(1);
  await expect(canonical).toHaveAttribute("href", expectedCanonical);
  await expect(openGraphTitle).toHaveCount(1);
  await expect(openGraphTitle).toHaveAttribute("content", expectedTitle);
  await expect(twitterTitle).toHaveCount(1);
  await expect(twitterTitle).toHaveAttribute("content", expectedTitle);
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
    await expect(page.getByTestId("about-hero-title")).toContainText(route.expectedHeading);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("html")).toHaveAttribute("lang", route.expectedLocale);

    // The settled document must expose one unambiguous SEO signal. A previous
    // route's metadata may exist only while the transition is in flight; it
    // must not remain beside the destination route once rendering has settled.
    await expectUniqueMetadata(
      page,
      route.expectedTitle,
      route.expectedDescription,
      route.expectedCanonical,
    );

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
    await expectUniqueMetadata(
      page,
      route.entryTitle,
      route.entryDescription,
      route.entryCanonical,
    );

    await page.goForward();
    await expect(page).toHaveURL(new RegExp(`${route.targetPath.replaceAll("/", "\\/")}/?$`));
    await expect(page.getByTestId("about-hero-title")).toContainText(route.expectedHeading);
    await expect(page.locator("h1")).toHaveCount(1);
    await expectUniqueMetadata(
      page,
      route.expectedTitle,
      route.expectedDescription,
      route.expectedCanonical,
    );

    // Exercise the exact catch-all-to-catch-all transition that previously
    // retained the source route's metadata tree.
    await navigateFromHeader(page, route.secondPath, isMobile);
    await expect(page).toHaveURL(new RegExp(`${route.secondPath.replaceAll("/", "\\/")}/?$`));
    await expect(page.getByTestId("contact-title")).toBeVisible();
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("html")).toHaveAttribute("lang", route.expectedLocale);
    await expectUniqueMetadata(
      page,
      route.secondTitle,
      route.secondDescription,
      route.secondCanonical,
    );

    expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
    expect(credentialLeaks, credentialLeaks.join("\n")).toEqual([]);
  });
}

for (const route of californiaRoutes) {
  test(`serves dedicated noindex metadata for ${route.path}`, async ({ page }) => {
    await page.goto(route.path);

    await expect(page).toHaveTitle(route.expectedTitle);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("html")).toHaveAttribute("lang", route.expectedLocale);
    const description = page.locator('meta[name="description"]');
    const canonical = page.locator('link[rel="canonical"]');
    await expect(description).toHaveCount(1);
    await expect(description).toHaveAttribute("content", route.expectedDescription);
    await expect(canonical).toHaveCount(1);
    await expect(canonical).toHaveAttribute("href", route.expectedCanonical);
    await expect(page.locator('meta[name="robots"][content="noindex, follow"]')).toHaveCount(1);

    if (process.env.E2E_EXPECTED_SHA) {
      await expect(page.locator('meta[name="healing-build-sha"]')).toHaveAttribute(
        "content",
        process.env.E2E_EXPECTED_SHA,
      );
    }
  });
}
