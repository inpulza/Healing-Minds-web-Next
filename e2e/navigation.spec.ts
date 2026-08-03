import {
  expect,
  test,
  type BrowserContext,
  type Locator,
  type Page,
} from "@playwright/test";
import { readFileSync } from "node:fs";

type PublicSeo = {
  title: string;
  description: string;
  canonical: string;
  lang: "en" | "es";
};

const seoManifest = JSON.parse(
  readFileSync(new URL("../shared/seo-manifest.json", import.meta.url), "utf8"),
) as Record<string, PublicSeo>;

function seoFor(pathname: string): PublicSeo {
  const seo = seoManifest[pathname];
  if (!seo) throw new Error(`Missing SEO manifest entry for ${pathname}`);
  return seo;
}

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
  const url = new URL(rawUrl);
  if (url.hostname === "www.tiktok.com" && url.pathname.replace(/\/$/, "") === "/@melvareve_md") {
    return false;
  }
  return tiktokNetworkPattern.test(rawUrl);
}

test.beforeEach(async ({ page }) => {
  const attempts: string[] = [];
  tiktokAttempts.set(page, attempts);
  page.on("request", (request) => {
    if (isTikTokPixelUrl(request.url())) attempts.push(request.url());
  });
  await page.route(tiktokNetworkPattern, async (route) => {
    if (isTikTokPixelUrl(route.request().url())) {
      await route.abort();
      return;
    }
    await route.fallback();
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
    entryTitle: seoFor("/").title,
    entryDescription: seoFor("/").description,
    entryCanonical: seoFor("/").canonical,
    targetPath: "/about",
    expectedTitle: seoFor("/about").title,
    expectedHeading: /Safe Space.*Heal.*Clarity/i,
    expectedDescription: seoFor("/about").description,
    expectedCanonical: seoFor("/about").canonical,
    expectedLocale: "en",
    secondPath: "/contact",
    secondTitle: seoFor("/contact").title,
    secondDescription: seoFor("/contact").description,
    secondCanonical: seoFor("/contact").canonical,
  },
  {
    entryPath: "/es",
    entryTitle: seoFor("/es").title,
    entryDescription: seoFor("/es").description,
    entryCanonical: seoFor("/es").canonical,
    targetPath: "/es/acerca-de",
    expectedTitle: seoFor("/es/acerca-de").title,
    expectedHeading: /Espacio Seguro.*Sanar.*Claridad/i,
    expectedDescription: seoFor("/es/acerca-de").description,
    expectedCanonical: seoFor("/es/acerca-de").canonical,
    expectedLocale: "es",
    secondPath: "/es/contacto",
    secondTitle: seoFor("/es/contacto").title,
    secondDescription: seoFor("/es/contacto").description,
    secondCanonical: seoFor("/es/contacto").canonical,
  },
];

const californiaRoutes = [
  {
    path: "/psychiatrist-california",
    expectedTitle: seoFor("/psychiatrist-california").title,
    expectedDescription: seoFor("/psychiatrist-california").description,
    expectedCanonical: seoFor("/psychiatrist-california").canonical,
    expectedLocale: "en",
  },
  {
    path: "/es/psiquiatra-california",
    expectedTitle: seoFor("/es/psiquiatra-california").title,
    expectedDescription: seoFor("/es/psiquiatra-california").description,
    expectedCanonical: seoFor("/es/psiquiatra-california").canonical,
    expectedLocale: "es",
  },
] as const;

const representativeMetadataRoutes = [
  "/services/anxiety-treatment",
  "/es/servicios/tratamiento-bipolar",
  "/es/ubicaciones/psiquiatra-estero",
  "/es/politica-comunicaciones",
  "/blog/bipolar-medication-follow-up-questions",
] as const;

const spanishSocialRoutes = [
  "/es/servicios/tratamiento-adhd",
  "/es/ubicaciones/psiquiatra-naples",
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

async function expectReactHydrated(locator: Locator) {
  await expect.poll(
    () => locator.evaluate((element) =>
      Object.keys(element).some(
        (key) => key.startsWith("__reactProps$") || key.startsWith("__reactFiber$"),
      ),
    ).catch(() => false),
    { message: "expected React event handlers to be attached", timeout: 10_000 },
  ).toBe(true);
}

async function expectSettledOutboundClick(
  page: Page,
  context: BrowserContext,
  testId: string,
  expectedUrl: string,
) {
  const normalize = (value: string) => value.replace(/\/$/, "");
  const routeMatcher = (url: URL) => normalize(url.toString()) === normalize(expectedUrl);
  await context.route(routeMatcher, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<!doctype html><title>Verified social profile</title><main>Verified outbound profile</main>",
    });
  });

  try {
    const popupPromise = page.waitForEvent("popup");
    await page.getByTestId(testId).click();
    const popup = await popupPromise;
    await popup.waitForLoadState("domcontentloaded");
    expect(normalize(popup.url())).toBe(normalize(expectedUrl));
    await expect(popup.locator("main")).toHaveText("Verified outbound profile");
    await popup.close();
  } finally {
    await context.unroute(routeMatcher);
  }
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
  const openGraphDescription = page.locator('meta[property="og:description"]');
  const openGraphUrl = page.locator('meta[property="og:url"]');
  const twitterTitle = page.locator('meta[name="twitter:title"]');
  const twitterDescription = page.locator('meta[name="twitter:description"]');
  const twitterCard = page.locator('meta[name="twitter:card"]');
  const openGraphImage = page.locator('meta[property="og:image"]');
  const twitterImage = page.locator('meta[name="twitter:image"]');
  await expect(page).toHaveTitle(expectedTitle);
  await expect(description).toHaveCount(1);
  await expect(description).toHaveAttribute("content", expectedDescription);
  await expect(canonical).toHaveCount(1);
  await expect(canonical).toHaveAttribute("href", expectedCanonical);
  await expect(openGraphTitle).toHaveCount(1);
  await expect(openGraphTitle).toHaveAttribute("content", expectedTitle);
  await expect(openGraphDescription).toHaveCount(1);
  await expect(openGraphDescription).toHaveAttribute("content", expectedDescription);
  await expect(openGraphUrl).toHaveCount(1);
  await expect(openGraphUrl).toHaveAttribute("content", expectedCanonical);
  await expect(twitterTitle).toHaveCount(1);
  await expect(twitterTitle).toHaveAttribute("content", expectedTitle);
  await expect(twitterDescription).toHaveCount(1);
  await expect(twitterDescription).toHaveAttribute("content", expectedDescription);
  await expect(twitterCard).toHaveCount(1);
  await expect(twitterCard).toHaveAttribute("content", "summary_large_image");
  await expect(openGraphImage).toHaveCount(1);
  await expect(openGraphImage).toHaveAttribute("content", /^https:\/\//);
  await expect(twitterImage).toHaveCount(1);
  await expect(twitterImage).toHaveAttribute("content", /^https:\/\//);
}

async function expectBoundedMetadataParity(page: Page, expectedCanonical: string) {
  const title = await page.title();
  const description = await page.locator('meta[name="description"]').getAttribute("content");

  expect(title, `${expectedCanonical}: empty title`).not.toBe("");
  expect(title, `${expectedCanonical}: title has surrounding whitespace`).toBe(title.trim());
  expect(title.length, `${expectedCanonical}: title length`).toBeLessThanOrEqual(60);
  expect(description, `${expectedCanonical}: missing description`).not.toBeNull();
  expect(description, `${expectedCanonical}: empty description`).not.toBe("");
  expect(description, `${expectedCanonical}: description has surrounding whitespace`).toBe(
    description?.trim(),
  );
  expect(description!.length, `${expectedCanonical}: description length`).toBeLessThanOrEqual(160);

  await expectUniqueMetadata(page, title, description!, expectedCanonical);
  return { title, description: description! };
}

async function expectExactDeploymentSha(page: Page) {
  if (!deploymentOrigin) return;

  const expectedSha = process.env.E2E_EXPECTED_SHA?.trim();
  if (!expectedSha || !/^[a-f0-9]{40}$/i.test(expectedSha)) {
    throw new Error("Deployed metadata E2E requires the exact 40-character E2E_EXPECTED_SHA");
  }

  const buildSha = page.locator('meta[name="healing-build-sha"]');
  await expect(buildSha).toHaveCount(1);
  await expect(buildSha).toHaveAttribute("content", expectedSha);
}

test("representative EN and ES metadata stays aligned after hydration", async ({ page }) => {
  const runtimeErrors = collectUnexpectedRuntimeErrors(page);

  for (const path of representativeMetadataRoutes) {
    const seo = seoFor(path);
    const response = await page.goto(path);
    expect(response?.status(), `${path}: status`).toBe(200);
    await expectReactHydrated(page.getByTestId("logo-link"));
    await expect(page.locator("html")).toHaveAttribute("lang", seo.lang);
    const actual = await expectBoundedMetadataParity(page, seo.canonical);
    if (!path.startsWith("/blog/") && !path.startsWith("/es/blog/")) {
      expect(actual).toEqual({ title: seo.title, description: seo.description });
    }
    await expectExactDeploymentSha(page);
  }

  expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
});

test("verified social profiles stay consistent in UI, outbound clicks and SSR identity", async ({
  page,
  context,
  isMobile,
}) => {
  const runtimeErrors = collectUnexpectedRuntimeErrors(page);
  const profiles = {
    linkedin: "https://www.linkedin.com/in/melva-reve-2549a9120",
    facebook: "https://www.facebook.com/profile.php?id=61578845287836",
    instagram: "https://www.instagram.com/melvareve_md/",
    tiktok: "https://www.tiktok.com/@melvareve_md",
    youtube: "https://www.youtube.com/@healingmindsp",
  } as const;

  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  const responseHtml = await response!.text();
  expect(responseHtml).toContain('id="social-identity-structured-data"');
  await rejectInitialConsent(page);

  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "https://www.healingmindsp.com/og-image.png",
  );
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    "content",
    "https://www.healingmindsp.com/og-image.png",
  );

  const structuredData = page.locator("#social-identity-structured-data");
  await expect(structuredData).toHaveCount(1);
  const graph = JSON.parse((await structuredData.textContent()) || "{}") as {
    "@graph"?: Array<{
      "@id"?: string;
      sameAs?: string[];
      address?: {
        "@type"?: string;
        streetAddress?: string;
        addressLocality?: string;
        addressRegion?: string;
        postalCode?: string;
        addressCountry?: string;
      };
    }>;
  };
  const organization = graph["@graph"]?.find((node) => node["@id"]?.endsWith("#organization"));
  const physician = graph["@graph"]?.find((node) => node["@id"]?.endsWith("#physician"));
  expect(organization?.sameAs).toEqual([
    profiles.facebook,
    profiles.instagram,
    profiles.tiktok,
    profiles.youtube,
  ]);
  expect(physician?.sameAs).toEqual([
    "https://npiregistry.cms.hhs.gov/provider-view/1982233631",
    profiles.linkedin,
  ]);
  expect(physician?.address).toEqual({
    "@type": "PostalAddress",
    streetAddress: "4760 Tamiami Trl N # 25",
    addressLocality: "Naples",
    addressRegion: "FL",
    postalCode: "34103",
    addressCountry: "US",
  });

  await page.evaluate(() => {
    (window as typeof window & { __identityNavigationSentinel?: string })
      .__identityNavigationSentinel = "home-document";
  });
  await navigateFromHeader(page, "/about", isMobile);
  await expect(page).toHaveURL(/\/about\/?$/);
  await expect(page.locator("#social-identity-structured-data")).toHaveCount(0);
  expect(
    await page.evaluate(
      () =>
        (window as typeof window & { __identityNavigationSentinel?: string })
          .__identityNavigationSentinel,
    ),
  ).toBe("home-document");

  await page.getByTestId("logo-link").click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByTestId("hero-title")).toBeVisible();
  await expect(page.locator("#social-identity-structured-data")).toHaveCount(1);
  expect(
    await page.evaluate(
      () =>
        (window as typeof window & { __identityNavigationSentinel?: string })
          .__identityNavigationSentinel,
    ),
  ).toBe("home-document");

  // Also cover a cold non-home entry: the root layout starts without the
  // identity graph, then the home page segment must add it through Next Link.
  await page.goto("/about");
  await expect(page.locator("#social-identity-structured-data")).toHaveCount(0);
  await expectReactHydrated(page.getByTestId("logo-link"));
  await page.evaluate(() => {
    (window as typeof window & { __identityNavigationSentinel?: string })
      .__identityNavigationSentinel = "about-document";
  });
  await page.getByTestId("logo-link").click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("#social-identity-structured-data")).toHaveCount(1);
  expect(
    await page.evaluate(
      () =>
        (window as typeof window & { __identityNavigationSentinel?: string })
          .__identityNavigationSentinel,
    ),
  ).toBe("about-document");

  await navigateFromHeader(page, "/about", isMobile);
  await expect(page).toHaveURL(/\/about\/?$/);
  await expect(page.locator("#social-identity-structured-data")).toHaveCount(0);

  await expect(page.getByTestId("linkedin-link")).toHaveAttribute("href", profiles.linkedin);
  await expect(page.getByTestId("facebook-link")).toHaveAttribute("href", profiles.facebook);
  await expect(page.getByTestId("instagram-link")).toHaveAttribute("href", profiles.instagram);
  await expect(page.getByTestId("tiktok-follow-button")).toHaveAttribute("href", profiles.tiktok);
  await expect(page.getByTestId("tiktok-follow-button")).toContainText("@melvareve_md");
  for (const [network, url] of Object.entries(profiles)) {
    await expect(page.getByTestId(`footer-social-${network}`)).toHaveAttribute("href", url);
  }

  const apiVideoIds = await page.evaluate(async () => {
    const response = await fetch("/api/tiktok");
    const body = (await response.json()) as {
      data?: { data?: Array<{ root?: { element?: { id?: string } } }> };
    };
    return body.data?.data?.map((item) => item.root?.element?.id).filter(Boolean) ?? [];
  });
  expect(apiVideoIds.length).toBeGreaterThan(0);
  expect(apiVideoIds).toHaveLength(new Set(apiVideoIds).size);
  const aboutVideoLinks = page.locator('[data-testid^="video-link-"]');
  await expect(aboutVideoLinks).toHaveCount(4);
  const aboutVideoHrefs = await aboutVideoLinks.evaluateAll((links) =>
    links.map((link) => link.getAttribute("href") || ""),
  );
  expect(aboutVideoHrefs).toHaveLength(new Set(aboutVideoHrefs).size);
  expect(aboutVideoHrefs.every((href) => href.includes("tiktok.com/@melvareve_md/video/"))).toBe(true);

  await expectSettledOutboundClick(page, context, "linkedin-link", profiles.linkedin);
  await expectSettledOutboundClick(page, context, "facebook-link", profiles.facebook);
  await expectSettledOutboundClick(page, context, "instagram-link", profiles.instagram);
  await expectSettledOutboundClick(page, context, "tiktok-follow-button", profiles.tiktok);
  await expectSettledOutboundClick(page, context, "footer-social-youtube", profiles.youtube);

  await page.goto("/locations/psychiatrist-naples");
  await rejectInitialConsent(page);
  const compactTikTok = page.getByTestId("compact-tiktok-follow-button");
  await expect(compactTikTok).toHaveAttribute("href", profiles.tiktok);
  await expect(compactTikTok).toContainText("@melvareve_md");
  const compactVideoLinks = page.locator('[data-testid^="compact-video-link-"]');
  await expect(compactVideoLinks).toHaveCount(4);
  const compactVideoHrefs = await compactVideoLinks.evaluateAll((links) =>
    links.map((link) => link.getAttribute("href") || ""),
  );
  expect(compactVideoHrefs).toHaveLength(new Set(compactVideoHrefs).size);
  expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
});

test("frozen blog routes share their exact published hero image", async ({ page }) => {
  const runtimeErrors = collectUnexpectedRuntimeErrors(page);
  const route = "/blog/understanding-anxiety-treatment-naples";
  const image =
    "https://www.healingmindsp.com/images/blog/approved/anxiety-treatment.webp";
  const response = await page.goto(route);
  expect(response?.status()).toBe(200);
  await rejectInitialConsent(page);

  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", image);
  await expect(page.locator('meta[name="twitter:image"]')).toHaveCount(1);
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", image);
  expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
});

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

test("Spanish social metadata is self-referencing and responses are hardened", async ({ page }) => {
  for (const path of spanishSocialRoutes) {
    const response = await page.goto(path);
    expect(response?.status(), `${path}: status`).toBe(200);

    const expectedUrl = `https://www.healingmindsp.com${path}`;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", expectedUrl);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", expectedUrl);

    const headers = response?.headers() ?? {};
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'self'");
    expect(headers["x-frame-options"]).toBe("SAMEORIGIN");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["permissions-policy"]).toBe("camera=(), microphone=(), geolocation=()");
  }
});

test("Spanish Open Graph URL follows an in-app click to an affected route", async ({ page }) => {
  const path = "/es/servicios/tratamiento-adhd";
  const seo = seoFor(path);

  await page.goto("/es");
  await rejectInitialConsent(page);
  const link = page.locator(`main a[href="${path}"]`).first();
  await expect(link).toBeVisible();
  await link.click();

  await expect(page).toHaveURL(new RegExp(`${path.replaceAll("/", "\\/")}/?$`));
  await expectUniqueMetadata(page, seo.title, seo.description, seo.canonical);
});

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
  expect(xml).toContain("<loc>https://www.healingmindsp.com/</loc>");
  expect(xml).not.toContain("<loc>https://www.healingmindsp.com</loc>");

  const blockFor = (url: string) => {
    const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return xml.match(new RegExp(`<url>\\s*<loc>${escaped}</loc>[\\s\\S]*?</url>`))?.[0];
  };
  const blogIndex = blockFor("https://www.healingmindsp.com/blog");
  const spanishBlogIndex = blockFor("https://www.healingmindsp.com/es/blog");
  const home = blockFor("https://www.healingmindsp.com/");
  expect(blogIndex).toBeTruthy();
  expect(spanishBlogIndex).toBeTruthy();
  expect(home).toBeTruthy();
  expect(home).toContain('hreflang="en" href="https://www.healingmindsp.com/"');
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

test("verified community resource links settle on their current destinations", async ({
  page,
  context,
}) => {
  const runtimeErrors = collectUnexpectedRuntimeErrors(page);
  const resources = [
    {
      path: "/locations/psychiatrist-naples",
      testId: "link-united-way",
      url: "https://uwcollierkeys.org/",
    },
    {
      path: "/locations/psychiatrist-immokalee",
      testId: "link-coffo",
      url: "https://www.coffo.org/",
    },
    {
      path: "/locations/psychiatrist-fort-myers",
      testId: "link-harry-chapin-food-bank",
      url: "https://harrychapinfoodbank.org/",
    },
    {
      path: "/locations/psychiatrist-estero",
      testId: "link-engage-estero",
      url: "https://esterotoday.com/",
    },
  ] as const;

  for (const resource of resources) {
    const response = await page.goto(resource.path);
    expect(response?.status()).toBe(200);
    await rejectInitialConsent(page);
    await expect(page.getByTestId(resource.testId)).toHaveAttribute("href", resource.url);
    await expectSettledOutboundClick(page, context, resource.testId, resource.url);
  }

  expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
});

test("contextual service links settle on the intended articles in one client navigation", async ({
  page,
}) => {
  const runtimeErrors = collectUnexpectedRuntimeErrors(page);
  const articles = [
    {
      path: "/services/anxiety-treatment",
      testId: "link-anxiety-guide",
      href: "/blog/understanding-anxiety-treatment-naples",
      heading: "Understanding Anxiety Treatment in Naples: What Patients Can Expect",
    },
    {
      path: "/es/servicios/tratamiento-ansiedad",
      testId: "link-anxiety-guide",
      href: "/es/blog/tratamiento-ansiedad-naples",
      heading: "Tratamiento de Ansiedad en Naples: Que Pueden Esperar los Pacientes",
    },
    {
      path: "/services/bipolar-treatment",
      testId: "link-bipolar-follow-up-guide",
      href: "/blog/bipolar-medication-follow-up-questions",
      heading: "Essential Questions for Your Bipolar Medication Follow-Up",
    },
  ] as const;

  for (const article of articles) {
    const response = await page.goto(article.path);
    expect(response?.status()).toBe(200);
    await rejectInitialConsent(page);
    const link = page.getByTestId(article.testId);
    await expect(link).toHaveAttribute("href", article.href);
    await expectReactHydrated(link);

    const marker = `${article.testId}-client-navigation`;
    await page.evaluate((value) => {
      (window as unknown as Record<string, string>).__contextualNavigationMarker = value;
    }, marker);
    await link.click();

    await expect(page).toHaveURL(article.href);
    await expect(page.locator("h1")).toHaveText(article.heading);
    expect(
      await page.evaluate(
        () => (window as unknown as Record<string, string>).__contextualNavigationMarker,
      ),
    ).toBe(marker);
  }

  expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
});

test.describe("server-rendered SEO without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("representative EN and ES metadata is complete in the initial HTML", async ({ page }) => {
    const runtimeErrors = collectUnexpectedRuntimeErrors(page);

    for (const path of representativeMetadataRoutes) {
      const seo = seoFor(path);
      const response = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(response?.status(), `${path}: status`).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", seo.lang);
      const actual = await expectBoundedMetadataParity(page, seo.canonical);
      if (!path.startsWith("/blog/") && !path.startsWith("/es/blog/")) {
        expect(actual).toEqual({ title: seo.title, description: seo.description });
      }
      await expectExactDeploymentSha(page);
    }

    expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
  });

  test("Spanish service HTML is Spanish before JavaScript", async ({ page }) => {
    const runtimeErrors = collectUnexpectedRuntimeErrors(page);
    const response = await page.goto("/es/servicios/tratamiento-ansiedad", {
      waitUntil: "domcontentloaded",
    });

    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page.locator("h1")).toContainText(
      "Tratamiento para la Ansiedad en Naples, FL",
    );
    await expect(page.locator("h1")).not.toContainText(
      "Anxiety Treatment in Naples, FL",
    );
    expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
  });

  test("Spanish home keeps its main internal journeys in Spanish", async ({ page }) => {
    const runtimeErrors = collectUnexpectedRuntimeErrors(page);
    const response = await page.goto("/es", { waitUntil: "domcontentloaded" });

    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page.locator("h1")).toContainText(
      "Atención psiquiátrica experta en Naples, FL",
    );
    await expect(page.locator("h1")).not.toContainText(
      "Expert psychiatric care in Naples, FL",
    );
    await expect(page.getByTestId("logo-link")).toHaveAttribute("href", "/es");
    expect(await page.locator('a[href="/es/servicios"]').count()).toBeGreaterThan(0);
    expect(await page.locator('a[href="/es/blog"]').count()).toBeGreaterThan(0);
    expect(await page.locator('a[href="/es/contacto"]').count()).toBeGreaterThan(0);
    expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
  });

  test("service pages expose contextual article links before JavaScript", async ({ page }) => {
    const runtimeErrors = collectUnexpectedRuntimeErrors(page);
    const links = [
      {
        path: "/services/anxiety-treatment",
        testId: "link-anxiety-guide",
        href: "/blog/understanding-anxiety-treatment-naples",
      },
      {
        path: "/es/servicios/tratamiento-ansiedad",
        testId: "link-anxiety-guide",
        href: "/es/blog/tratamiento-ansiedad-naples",
      },
      {
        path: "/services/bipolar-treatment",
        testId: "link-bipolar-follow-up-guide",
        href: "/blog/bipolar-medication-follow-up-questions",
      },
    ] as const;

    for (const link of links) {
      const response = await page.goto(link.path, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);
      await expect(page.getByTestId(link.testId)).toHaveAttribute("href", link.href);
    }

    expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
  });

  test("community and AHCA links are current in the initial HTML", async ({ page }) => {
    const runtimeErrors = collectUnexpectedRuntimeErrors(page);
    const currentLinks = [
      ["/locations/psychiatrist-naples", "https://uwcollierkeys.org/"],
      ["/es/ubicaciones/psiquiatra-naples", "https://uwcollierkeys.org/"],
      ["/locations/psychiatrist-immokalee", "https://www.coffo.org/"],
      ["/es/ubicaciones/psiquiatra-immokalee", "https://www.coffo.org/"],
      ["/locations/psychiatrist-fort-myers", "https://harrychapinfoodbank.org/"],
      ["/es/ubicaciones/psiquiatra-fort-myers", "https://harrychapinfoodbank.org/"],
      ["/locations/psychiatrist-estero", "https://esterotoday.com/"],
      ["/es/ubicaciones/psiquiatra-estero", "https://esterotoday.com/"],
      ["/patient-rights", "https://ahca.myflorida.com/"],
      ["/patient-rights", "https://apps.ahca.myflorida.com/hcfc/"],
      ["/es/derechos-paciente", "https://ahca.myflorida.com/"],
      ["/es/derechos-paciente", "https://apps.ahca.myflorida.com/hcfc/"],
    ] as const;

    for (const [path, href] of currentLinks) {
      const response = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);
      const link = page.locator(`a[href="${href}"]`);
      await expect(link).toHaveCount(1);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", /noopener/);
      await expect(link).toHaveAttribute("rel", /noreferrer/);
    }

    for (const path of [
      "/locations/psychiatrist-golden-gate",
      "/es/ubicaciones/psiquiatra-golden-gate",
    ]) {
      const goldenGate = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(goldenGate?.status()).toBe(200);
      await expect(page.getByText("Golden Gate Estates Area Civic Association", { exact: true })).toHaveCount(path.startsWith("/es/") ? 0 : 1);
      await expect(page.locator('a[href="https://ggeaca.org/"]')).toHaveCount(0);
      await expect(page.getByTestId("link-civic-association")).toHaveCount(0);
    }
    expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
  });

  test("privacy choices use descriptive anchor text before JavaScript", async ({ page }) => {
    const runtimeErrors = collectUnexpectedRuntimeErrors(page);
    const pages = [
      {
        path: "/cookie-policy",
        labels: [
          "Google Analytics opt-out add-on",
          "Google My Ad Center",
          "Microsoft privacy dashboard",
        ],
      },
      {
        path: "/es/politica-cookies",
        labels: [
          "Complemento de inhabilitación de Google Analytics",
          "Mi Centro de Anuncios de Google",
          "Panel de privacidad de Microsoft",
        ],
      },
      {
        path: "/privacy-policy",
        labels: [
          "Google Analytics opt-out add-on",
          "Google My Ad Center",
          "Microsoft privacy dashboard",
        ],
      },
      {
        path: "/es/politica-privacidad",
        labels: [
          "complemento de inhabilitación de Google Analytics",
          "Mi Centro de Anuncios de Google",
          "panel de privacidad de Microsoft",
        ],
      },
    ] as const;

    for (const legalPage of pages) {
      const response = await page.goto(legalPage.path, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);
      for (const label of legalPage.labels) {
        const link = page.getByRole("link", { name: label, exact: true });
        await expect(link).toHaveCount(1);
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", /noopener/);
        await expect(link).toHaveAttribute("rel", /noreferrer/);
      }
      await expect(page.locator("a").filter({ hasText: /^https?:\/\// })).toHaveCount(0);
    }

    expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
  });

  test("blog indexes expose every published article before JavaScript", async ({
    page,
  }) => {
    const runtimeErrors = collectUnexpectedRuntimeErrors(page);

    for (const language of ["en", "es"] as const) {
      const publishedPosts: Array<{ slug: string; language: "en" | "es" }> = [];
      for (let pageIndex = 0; pageIndex < 10; pageIndex += 1) {
        const apiResponse = await page.goto(
          `/api/blog/posts?language=${language}&limit=100&offset=${pageIndex * 100}`,
          { waitUntil: "domcontentloaded" },
        );
        expect(apiResponse?.status()).toBe(200);
        const payload = (await apiResponse!.json()) as {
          success?: boolean;
          data?: Array<{ slug: string; language: "en" | "es" }>;
        };
        expect(payload.success).toBe(true);
        expect(Array.isArray(payload.data)).toBe(true);
        publishedPosts.push(...(payload.data ?? []));
        if ((payload.data?.length ?? 0) < 100) break;
        if (pageIndex === 9) {
          throw new Error(`Published blog API exceeded the audited ${language} bound`);
        }
      }
      expect(publishedPosts.length).toBeGreaterThan(0);

      const indexPath = language === "es" ? "/es/blog" : "/blog";
      const indexResponse = await page.goto(indexPath, {
        waitUntil: "domcontentloaded",
      });
      expect(indexResponse?.status()).toBe(200);

      for (const post of publishedPosts) {
        const postPath = post.language === "es"
          ? `/es/blog/${post.slug}`
          : `/blog/${post.slug}`;
        expect(
          await page.locator(`a[href="${postPath}"]`).count(),
          `${indexPath} should link to ${postPath} in the initial HTML`,
        ).toBeGreaterThan(0);
      }
    }

    expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
  });
});

test("Spanish blog navigation settles as a hydrated client transition", async ({
  page,
}) => {
  const runtimeErrors = collectUnexpectedRuntimeErrors(page);

  await page.goto("/es/blog");
  await rejectInitialConsent(page);
  const articlePath = "/es/blog/tratamiento-ansiedad-naples";
  const articleLink = page.locator(`a[href="${articlePath}"]`).first();
  await expect(articleLink).toBeVisible();
  expect(await page.locator(`a[href="${articlePath}"]`).count()).toBeGreaterThan(0);

  const navigationMarker = "healing-blog-client-transition";
  await page.evaluate((marker) => {
    (window as unknown as Record<string, string>).__healingNavigationMarker = marker;
  }, navigationMarker);

  await articleLink.click();
  await expect(page).toHaveURL(articlePath);
  expect(
    await page.evaluate(
      () => (window as unknown as Record<string, string>).__healingNavigationMarker,
    ),
    "the marker must survive a Next client transition",
  ).toBe(navigationMarker);
  await expect(page.locator("h1")).toContainText(
    "Tratamiento de Ansiedad en Naples",
  );
  expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
});
