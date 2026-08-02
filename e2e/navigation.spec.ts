import { expect, test, type Locator, type Page } from "@playwright/test";

const deploymentUrl = process.env.E2E_BASE_URL
  ? new URL(process.env.E2E_BASE_URL)
  : null;
const deploymentOrigin = deploymentUrl?.origin ?? null;
const healingMindsProtectedPreviewHost =
  /^healing-minds-psychi-git-[a-z0-9-]+-inpulzasolutions-6847s-projects\.vercel\.app$/i;
const acceptsPreviewCredential = Boolean(
  deploymentUrl?.protocol === "https:" &&
    healingMindsProtectedPreviewHost.test(deploymentUrl.hostname),
);
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

const tiktokAttempts = new WeakMap<Page, string[]>();
const tiktokCookiePattern =
  /^(?:_ttp|_tt_enable_cookie|_ttp_pixel|_tt_sessionId|_tt_pixel_session_index|_tt_appInfo|ttcsid(?:_|$)|ttclid$)/;
const tiktokNetworkPattern =
  /^https:\/\/[^/]*(?:tiktok\.com|tiktokcdn(?:-us)?\.com|byteoversea\.com|ibytedtos\.com|muscdn\.com)\//i;

function isTikTokPixelUrl(rawUrl: string): boolean {
  return tiktokNetworkPattern.test(rawUrl);
}

test.beforeEach(async ({ page }) => {
  const attempts: string[] = [];
  tiktokAttempts.set(page, attempts);
  page.on("request", (request) => {
    if (isTikTokPixelUrl(request.url())) attempts.push(request.url());
  });
  await page.route(tiktokNetworkPattern, async (route) => {
    await route.abort();
  });

  if (!deploymentOrigin || !previewCredential) return;

  // Scope Preview authentication to the deployment origin. A global header
  // would leak the credential to analytics, Clarity and every other
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
  expect(tiktokAttempts.get(page) ?? [], "TikTok Pixel network attempts").toEqual([]);
  await expect(
    page.locator('script[src*="analytics.tiktok.com"], script[src*="/i18n/pixel/"]'),
  ).toHaveCount(0);
  expect(await page.evaluate(() => typeof window.ttq)).toBe("undefined");
  expect(
    (await page.context().cookies())
      .filter((cookie) => tiktokCookiePattern.test(cookie.name))
      .map(({ name, domain }) => ({ name, domain })),
  ).toEqual([]);

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
  const becameVisible = await reject
    .waitFor({ state: "visible", timeout: 5_000 })
    .then(() => true)
    .catch(() => false);
  if (!becameVisible) return;

  await reject.click();
  await expect(reject).toBeHidden();
}

function collectUnexpectedRuntimeErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.stack || error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  return errors;
}

async function firstPartyJavaScriptBytes(page: Page): Promise<number> {
  return page.evaluate(() => {
    const origin = window.location.origin;
    return performance
      .getEntriesByType("resource")
      .filter(
        (entry) =>
          entry.initiatorType === "script" && new URL(entry.name).origin === origin,
      )
      .reduce(
        (total, entry) => total + (entry.decodedBodySize || entry.transferSize || 0),
        0,
      );
  });
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

test("cold route chunks keep the current page visible until navigation can commit", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "one browser contract is sufficient for App Router transitions");
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.stack || error.message));
  const loadedChunkPaths = new Set<string>();

  page.on("response", (response) => {
    const pathname = new URL(response.url()).pathname;
    if (pathname.startsWith("/_next/static/chunks/") && pathname.endsWith(".js")) {
      loadedChunkPaths.add(pathname);
    }
  });
  await page.route("**/*", async (route) => {
    const headers = route.request().headers();
    if (headers["next-router-prefetch"] || headers.purpose === "prefetch") {
      await route.abort();
      return;
    }
    await route.fallback();
  });

  await page.goto("/");
  await expect(page.getByTestId("hero-title")).toBeVisible();
  await rejectInitialConsent(page);

  let releaseChunks!: () => void;
  const chunkGate = new Promise<void>((resolve) => {
    releaseChunks = resolve;
  });
  let delayedChunkRequests = 0;
  await page.route("**/_next/static/chunks/**", async (route) => {
    const pathname = new URL(route.request().url()).pathname;
    if (!loadedChunkPaths.has(pathname) && pathname.endsWith(".js")) {
      delayedChunkRequests += 1;
      await chunkGate;
    }
    await route.fallback();
  });

  const navigation = navigateFromHeader(page, "/about", false);
  try {
    await expect.poll(() => delayedChunkRequests, { timeout: 5_000 }).toBeGreaterThan(0);
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByTestId("hero-title")).toBeVisible();
    await expect(page.getByTestId("about-hero-title")).toHaveCount(0);
    await expect(page.locator("header")).toHaveCount(1);
    await expect(page.locator("main")).toHaveCount(1);
  } finally {
    releaseChunks();
  }

  await navigation;
  await expect(page).toHaveURL(/\/about\/?$/);
  await expect(page.getByTestId("about-hero-title")).toBeVisible();
  expect(pageErrors, pageErrors.join("\n\n")).toEqual([]);
});

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

test("route scroll respects reduced motion without a smooth-scroll runtime", async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const state = window as typeof window & { __hmpScrollBehaviors?: ScrollBehavior[] };
    state.__hmpScrollBehaviors = [];
    const nativeScrollTo = window.scrollTo.bind(window);
    window.scrollTo = ((optionsOrX: ScrollToOptions | number, y?: number) => {
      if (typeof optionsOrX === "object" && optionsOrX.behavior) {
        state.__hmpScrollBehaviors?.push(optionsOrX.behavior);
      }
      if (typeof optionsOrX === "number") {
        nativeScrollTo(optionsOrX, y ?? 0);
      } else {
        nativeScrollTo(optionsOrX);
      }
    }) as typeof window.scrollTo;
  });

  await page.goto("/");
  await rejectInitialConsent(page);
  await page.evaluate(() => {
    (window as typeof window & { __hmpScrollBehaviors?: ScrollBehavior[] })
      .__hmpScrollBehaviors = [];
  });
  await navigateFromHeader(page, "/about", isMobile);
  await expect(page).toHaveURL(/\/about\/?$/);
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as typeof window & { __hmpScrollBehaviors?: ScrollBehavior[] })
            .__hmpScrollBehaviors?.at(-1),
      ),
    )
    .toBe("auto");

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.evaluate(() => {
    (window as typeof window & { __hmpScrollBehaviors?: ScrollBehavior[] })
      .__hmpScrollBehaviors = [];
  });
  await navigateFromHeader(page, "/contact", isMobile);
  await expect(page).toHaveURL(/\/contact\/?$/);
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as typeof window & { __hmpScrollBehaviors?: ScrollBehavior[] })
            .__hmpScrollBehaviors?.at(-1),
      ),
    )
    .toBe("smooth");
});

test("mobile home buffers one responsive logo without blanking the active slide", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "mobile carousel contract");
  const runtimeErrors = collectUnexpectedRuntimeErrors(page);

  let releaseSecondLogo!: () => void;
  const secondLogoGate = new Promise<void>((resolve) => {
    releaseSecondLogo = resolve;
  });
  let delayedSecondLogo = false;
  await page.route("**/_next/image?**", async (route) => {
    const decodedUrl = decodeURIComponent(route.request().url());
    if (decodedUrl.includes("8_1755868276798")) {
      delayedSecondLogo = true;
      await secondLogoGate;
      await route.fulfill({
        status: 200,
        contentType: "image/webp",
        body: "invalid-image",
      });
      return;
    }
    await route.fallback();
  });

  await page.goto("/");
  await rejectInitialConsent(page);

  const carousel = page.getByTestId("mobile-insurance-carousel");
  await carousel.scrollIntoViewIfNeeded();
  await expect(carousel).toBeVisible();
  await expect
    .poll(() =>
      carousel.locator('[data-active="true"] img').evaluate((image) =>
        image.complete && image.naturalWidth > 0 && Number(getComputedStyle(image).opacity) > 0.99,
      ),
    )
    .toBe(true);
  await expect(carousel.locator('[data-active="true"] img')).toHaveAttribute(
    "src",
    /\/_next\/image\?/,
  );

  const activeLogo = carousel.locator('[data-active="true"]');
  const firstLogoTestId = await activeLogo.getAttribute("data-testid");
  try {
    await expect.poll(() => delayedSecondLogo).toBe(true);
    await expect(carousel.locator("img")).toHaveCount(2);
    await page.waitForTimeout(2_250);
    await expect(activeLogo).toHaveAttribute("data-testid", firstLogoTestId!);
    await expect
      .poll(() =>
        activeLogo.locator("img").evaluate((image) =>
          image.complete && image.naturalWidth > 0 && Number(getComputedStyle(image).opacity) > 0.99,
        ),
      )
      .toBe(true);
  } finally {
    releaseSecondLogo();
  }

  await expect
    .poll(() => activeLogo.getAttribute("data-testid"), { timeout: 5_000 })
    .toBe("insurance-logo-medicare");
  await expect
    .poll(() => carousel.locator("img").count())
    .toBeLessThanOrEqual(3);
  await expect
    .poll(() => activeLogo.locator("img").evaluate((image) => image.naturalWidth))
    .toBeGreaterThan(0);
  expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
});

test("location hero requests one optimized source for the active viewport", async ({
  page,
  isMobile,
}) => {
  const runtimeErrors = collectUnexpectedRuntimeErrors(page);
  await page.setViewportSize(
    isMobile ? { width: 390, height: 844 } : { width: 2048, height: 1200 },
  );

  const heroRequests: string[] = [];
  page.on("request", (request) => {
    const decodedUrl = decodeURIComponent(request.url());
    if (decodedUrl.includes("dr-melva-location-hero")) {
      heroRequests.push(request.url());
    }
  });

  await page.goto("/locations/psychiatrist-fort-myers");
  await rejectInitialConsent(page);

  const visibleHero = page.locator(
    'img[alt="Dr. Melva Reve serving Fort Myers"]:visible',
  );
  await expect(visibleHero).toHaveCount(1);
  await expect
    .poll(() =>
      visibleHero.evaluate(
        (image) => image.complete && image.naturalWidth > 0,
      ),
    )
    .toBe(true);
  await page.waitForTimeout(1_500);

  const distinctRequests = [...new Set(heroRequests)];
  expect(heroRequests).toHaveLength(1);
  expect(distinctRequests).toHaveLength(1);
  expect(new URL(distinctRequests[0]).pathname).toBe("/_next/image");
  expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
});

test("mobile location hero is present before hydration chunks finish", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "mobile SSR hero contract");
  const runtimeErrors = collectUnexpectedRuntimeErrors(page);

  let releaseChunks!: () => void;
  const chunkGate = new Promise<void>((resolve) => {
    releaseChunks = resolve;
  });
  let heldChunks = 0;
  await page.route(/\/_next\/static\/.*\.js(?:\?|$)/, async (route) => {
    heldChunks += 1;
    await chunkGate;
    await route.fallback();
  });

  const navigation = page.goto("/locations/psychiatrist-fort-myers");
  const mobileHeroSection = page
    .locator("main section")
    .first()
    .locator("div.md\\:hidden")
    .first();
  const mobileHero = mobileHeroSection.locator(
    'img[alt="Dr. Melva Reve serving Fort Myers"]',
  );

  try {
    await expect.poll(() => heldChunks).toBeGreaterThan(0);
    await expect(mobileHero).toHaveCount(1);
    await expect(mobileHero).toHaveAttribute(
      "sizes",
      "(max-width: 1024px) 100vw, 1800px",
    );
    await expect
      .poll(() =>
        mobileHero.evaluate(
          (image) => Number(getComputedStyle(image).opacity),
        ),
      )
      .toBe(1);
    await expect(mobileHeroSection.locator('[role="status"]')).toHaveCount(0);
  } finally {
    releaseChunks();
  }

  await navigation;
  await rejectInitialConsent(page);
  await expect
    .poll(() => mobileHero.evaluate((image) => image.complete && image.naturalWidth > 0))
    .toBe(true);
  expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
});

test("mobile insurance srcsets cover the rendered width at the device DPR", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "mobile responsive image contract");
  const runtimeErrors = collectUnexpectedRuntimeErrors(page);

  const expectEnoughPixels = async (image: Locator, sizes: string) => {
    await expect(image).toHaveAttribute("sizes", sizes);
    await expect.poll(() => image.evaluate((element) => element.naturalWidth)).toBeGreaterThan(0);
    const measurement = await image.evaluate((element) => ({
      candidateWidth: Number(new URL(element.currentSrc).searchParams.get("w")),
      requiredWidth: Math.ceil(element.getBoundingClientRect().width * window.devicePixelRatio),
    }));
    expect(measurement.candidateWidth).toBeGreaterThanOrEqual(measurement.requiredWidth);
  };

  await page.goto("/contact");
  await rejectInitialConsent(page);
  const contactLogo = page.getByTestId("contact-insurance-logo-aetna").locator("img");
  await contactLogo.scrollIntoViewIfNeeded();
  await expectEnoughPixels(
    contactLogo,
    "(max-width: 639px) 86px, (max-width: 767px) 100px, 114px",
  );

  await page.goto("/locations/psychiatrist-fort-myers");
  await rejectInitialConsent(page);
  const locationCarousel = page.getByTestId("mobile-location-insurance-carousel");
  await locationCarousel.scrollIntoViewIfNeeded();
  const locationLogo = locationCarousel.locator('[data-active="true"] img');
  await expectEnoughPixels(locationLogo, "256px");

  expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
});

test("telehealth widget opens, exposes both actions and restores its trigger", async ({ page }) => {
  const runtimeErrors = collectUnexpectedRuntimeErrors(page);
  await page.goto("/");
  await rejectInitialConsent(page);

  const trigger = page.getByTestId("button-open-telehealth-widget");
  await expect(trigger).toBeVisible({ timeout: 5_000 });
  await trigger.click();

  const card = page.getByTestId("telehealth-widget-card");
  await expect(card).toBeVisible();
  await expect(page.getByTestId("button-widget-book")).toHaveAttribute("target", "_blank");
  await expect(page.getByTestId("button-widget-call")).toHaveAttribute("href", "tel:+12394230272");

  await page.getByTestId("button-close-telehealth-widget").click();
  await expect(card).toBeHidden();
  await expect(trigger).toBeVisible();
  await expect(trigger).toBeFocused();
  expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
});

test("mobile home stays within its hydrated first-visit JavaScript budget", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "mobile runtime budget");
  const runtimeErrors = collectUnexpectedRuntimeErrors(page);

  await page.goto("/");
  await rejectInitialConsent(page);
  await expect(page.getByTestId("button-open-telehealth-widget")).toBeVisible({ timeout: 5_000 });
  await page.waitForTimeout(1_500);

  const hydratedJavaScriptBytes = await firstPartyJavaScriptBytes(page);

  expect(hydratedJavaScriptBytes).toBeLessThanOrEqual(1024 * 1024);
  expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
});

test("mobile heavy catch-all route stays within its hydrated JavaScript budget", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "mobile runtime budget");
  const runtimeErrors = collectUnexpectedRuntimeErrors(page);

  await page.goto("/locations/psychiatrist-fort-myers");
  await rejectInitialConsent(page);
  await expect(page.getByTestId("hero-title-mobile")).toBeVisible();
  await expect(page.getByTestId("button-open-telehealth-widget")).toBeVisible({ timeout: 5_000 });
  await page.waitForTimeout(1_500);

  const hydratedJavaScriptBytes = await firstPartyJavaScriptBytes(page);
  expect(hydratedJavaScriptBytes).toBeLessThanOrEqual(1280 * 1024);
  expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
});

test("sitemap XML preserves blog alternates, dates and priority", async ({ page }) => {
  const response = await page.goto("/sitemap.xml", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(200);
  const xml = await response!.text();

  const blockFor = (url: string) => {
    const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return xml.match(new RegExp(`<url>\\s*<loc>${escaped}</loc>[\\s\\S]*?</url>`))?.[0];
  };
  const blogIndex = blockFor("https://www.healingmindsp.com/blog");
  const spanishBlogIndex = blockFor("https://www.healingmindsp.com/es/blog");
  expect(blogIndex).toBeTruthy();
  expect(spanishBlogIndex).toBeTruthy();
  for (const block of [blogIndex!, spanishBlogIndex!]) {
    expect(block).toContain(
      'hreflang="x-default" href="https://www.healingmindsp.com/blog"',
    );
    expect(block).toContain("<priority>0.7</priority>");
  }

  const postBlocks = [
    ...xml.matchAll(
      /<url>\s*<loc>https:\/\/www\.healingmindsp\.com\/(?:es\/)?blog\/[^<]+<\/loc>[\s\S]*?<\/url>/g,
    ),
  ].map((match) => match[0]);
  for (const block of postBlocks) {
    expect(block).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
    expect(block).not.toMatch(/<lastmod>[^<]*T/);
    expect(block).toContain("<priority>0.6</priority>");
    expect(block).toContain('hreflang="x-default"');

    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    const english = block.match(/hreflang="en" href="([^"]+)"/)?.[1];
    const xDefault = block.match(/hreflang="x-default" href="([^"]+)"/)?.[1];
    expect(xDefault).toBe(english ?? loc);
  }

  const locCount = (xml.match(/<loc>/g) ?? []).length;
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  expect(new Set(locs).size).toBe(locCount);
  expect(locCount - postBlocks.length).toBe(74);

  const publishedPosts = await page.evaluate(async () => {
    const posts: Array<{ slug: string; language: string }> = [];
    for (const language of ["en", "es"] as const) {
      for (let pageIndex = 0; pageIndex < 10; pageIndex += 1) {
        const response = await fetch(
          `/api/blog/posts?language=${language}&limit=100&offset=${pageIndex * 100}`,
        );
        const body = (await response.json()) as {
          success?: boolean;
          data?: Array<{ slug: string; language: string }>;
        };
        if (!response.ok || body.success !== true || !Array.isArray(body.data)) {
          throw new Error(`Published blog API failed for ${language} page ${pageIndex + 1}`);
        }
        posts.push(...body.data);
        if (body.data.length < 100) break;
        if (pageIndex === 9) {
          throw new Error(`Published blog API exceeded the audited ${language} pagination bound`);
        }
      }
    }
    return posts;
  });
  expect(publishedPosts.length).toBeGreaterThan(0);
  const publishedPaths = publishedPosts.map((post) =>
    post.language === "es"
      ? `/es/blog/${encodeURIComponent(post.slug)}`
      : `/blog/${encodeURIComponent(post.slug)}`,
  );
  const sitemapPostPaths = postBlocks.map((block) => {
    const absolute = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (!absolute) throw new Error("Sitemap blog entry has no loc");
    return new URL(absolute).pathname;
  });
  expect([...new Set(sitemapPostPaths)].sort()).toEqual(
    [...new Set(publishedPaths)].sort(),
  );
});
