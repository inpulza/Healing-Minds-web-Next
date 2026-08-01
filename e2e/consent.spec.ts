import { expect, test, type Page } from "@playwright/test";

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

async function stubAnalyticsProviders(page: Page) {
  // E2E exercises our consent lifecycle without sending synthetic visits to
  // the clinic's live analytics accounts. Any TikTok Pixel request is recorded
  // and blocked because the integration is disabled sitewide.
  const attempts: string[] = [];
  tiktokAttempts.set(page, attempts);
  page.on("request", (request) => {
    if (isTikTokPixelUrl(request.url())) attempts.push(request.url());
  });
  await page.route(tiktokNetworkPattern, async (route) => {
    await route.abort();
  });
  await page.route("https://www.googletagmanager.com/**", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
  });
  await page.route("https://www.google-analytics.com/**", async (route) => {
    await route.abort();
  });
  await page.route("https://*.clarity.ms/**", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
  });
}

async function authenticateProtectedPreview(page: Page) {
  if (!deploymentOrigin || !previewCredential) return;

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
}

test.beforeEach(async ({ page }) => {
  await stubAnalyticsProviders(page);
  await authenticateProtectedPreview(page);
});

test.afterEach(async ({ page }) => {
  expect(tiktokAttempts.get(page) ?? [], "TikTok Pixel network attempts").toEqual([]);
  await page.unrouteAll({ behavior: "ignoreErrors" });
});

async function expectDeployedSha(page: Page) {
  if (!process.env.E2E_EXPECTED_SHA) return;
  await expect(page.locator('meta[name="healing-build-sha"]')).toHaveAttribute(
    "content",
    process.env.E2E_EXPECTED_SHA,
  );
}

async function readStoredConsent(page: Page) {
  return page.evaluate(() =>
    JSON.parse(localStorage.getItem("hmp_cookie_consent") ?? "null"),
  );
}

async function dataLayerCommands(page: Page) {
  return page.evaluate(() =>
    (window.dataLayer ?? []).map((entry) => Array.from(entry)),
  );
}

async function hasVerifiedGoogleConfig(page: Page) {
  return (await dataLayerCommands(page)).some(
    (command) => command[0] === "config" && command[1] === "G-WMRK41PX2E",
  );
}

async function footerPreferencesButton(page: Page, isMobile: boolean) {
  const button = page.getByTestId(
    isMobile ? "footer-cookie-preferences-mobile" : "footer-cookie-preferences",
  );

  for (let attempt = 0; attempt < 12 && (await button.count()) === 0; attempt += 1) {
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(300);
  }

  await expect(button).toBeVisible();
  return button;
}

async function footerLink(page: Page, href: string) {
  const link = page.locator(`footer a[href="${href}"]`).first();
  for (let attempt = 0; attempt < 12 && (await link.count()) === 0; attempt += 1) {
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(300);
  }
  await expect(link).toBeVisible();
  return link;
}

async function setOptionalConsent(
  page: Page,
  consent: { analytics: boolean; marketing: boolean },
) {
  for (const category of ["analytics", "marketing"] as const) {
    const toggle = page.getByTestId(`switch-${category}`);
    const checked = (await toggle.getAttribute("data-state")) === "checked";
    if (checked !== consent[category]) await toggle.click();
  }
}

async function savePreferencesWithClarityConsentAudit(page: Page, expected: boolean) {
  const calls = await page.evaluate(() => {
    const state = window as typeof window & {
      clarity?: (...args: unknown[]) => unknown;
      __hmpE2eClarityConsentCalls?: boolean[];
    };
    const provider = state.clarity;
    if (typeof provider !== "function") {
      throw new Error("Clarity provider is unavailable before the consent change");
    }
    const recorded = state.__hmpE2eClarityConsentCalls ?? [];
    state.__hmpE2eClarityConsentCalls = recorded;
    const instrumented = (...args: unknown[]) => {
      if (args[0] === "consent") recorded.push(Boolean(args[1]));
      return Reflect.apply(provider, window, args);
    };
    state.clarity = instrumented;
    if (state.clarity !== instrumented) {
      throw new Error("Clarity provider could not be instrumented");
    }
    const saveButton = document.querySelector('[data-testid="button-save-preferences"]');
    if (!(saveButton instanceof HTMLButtonElement)) {
      throw new Error("Cookie preference save button is unavailable");
    }
    saveButton.click();
    return recorded;
  });
  expect(calls.at(-1), `Clarity consent(${expected})`).toBe(expected);
}

async function expectOptionalConsent(page: Page, enabled: boolean) {
  const state = enabled ? "checked" : "unchecked";
  await expect(page.getByTestId("switch-analytics")).toHaveAttribute("data-state", state);
  await expect(page.getByTestId("switch-marketing")).toHaveAttribute("data-state", state);
}

async function expectTikTokPixelAbsent(page: Page, label: string) {
  expect(tiktokAttempts.get(page) ?? [], `${label}: TikTok requests`).toEqual([]);
  await expect(
    page.locator('script[src*="analytics.tiktok.com"], script[src*="/i18n/pixel/"]'),
    `${label}: TikTok scripts`,
  ).toHaveCount(0);
  expect(await page.evaluate(() => typeof window.ttq), `${label}: window.ttq`).toBe("undefined");
  const identifiers = (await page.context().cookies())
    .filter((cookie) => tiktokCookiePattern.test(cookie.name))
    .map(({ name, domain }) => ({ name, domain }));
  expect(identifiers, `${label}: TikTok cookies`).toEqual([]);
}

test("first-visit cookie controls close, persist and remain explicit", async ({ page }) => {
  await page.goto("/");
  await expectDeployedSha(page);

  const banner = page.getByTestId("cookie-banner");
  const modal = page.getByTestId("cookie-preferences-modal");
  await expect(banner).toBeVisible();
  await expectTikTokPixelAbsent(page, "initial denied state");

  await page.getByTestId("button-manage-preferences").click();
  await expect(modal).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
  await expect(modal).toBeHidden();
  await expect(banner).toBeVisible();

  await page.getByTestId("button-manage-preferences").click();
  await page.getByTestId("button-cancel-preferences").click();
  await expect(modal).toBeHidden();
  await expect(banner).toBeVisible();

  await page.getByTestId("button-reject-all").click();
  await expect(banner).toBeHidden();
  expect(await readStoredConsent(page)).toMatchObject({
    hasConsented: true,
    consent: { necessary: true, analytics: false, marketing: false },
  });

  await page.reload();
  await expect(banner).toBeHidden();
  await expectTikTokPixelAbsent(page, "persisted rejection");
});

test("privacy-restricted storage still hydrates usable cookie controls", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.addInitScript(() => {
    const originalGetItem = Storage.prototype.getItem;
    const originalRemoveItem = Storage.prototype.removeItem;
    Storage.prototype.getItem = function blockConsentRead(key) {
      if (this === window.localStorage && key === "hmp_cookie_consent") {
        throw new DOMException("Synthetic storage restriction", "SecurityError");
      }
      return originalGetItem.call(this, key);
    };
    Storage.prototype.removeItem = function blockConsentRemoval(key) {
      if (this === window.localStorage && key === "hmp_cookie_consent") {
        throw new DOMException("Synthetic storage restriction", "SecurityError");
      }
      return originalRemoveItem.call(this, key);
    };
  });

  await page.goto("/");
  await expectDeployedSha(page);
  await expect(page.getByTestId("cookie-banner")).toBeVisible();
  await page.getByTestId("button-reject-all").click();
  await expect(page.getByTestId("cookie-banner")).toBeHidden();
  expect(pageErrors).toEqual([]);
  await expectTikTokPixelAbsent(page, "restricted storage");
});

test("TikTok Pixel stays absent through consent, navigation and reload", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  await expectDeployedSha(page);
  await expectTikTokPixelAbsent(page, "first visit");

  // Seed every legacy first-party identifier and prove the disabled lifecycle
  // removes them before any visitor choice is made.
  const origin = new URL(page.url()).origin;
  await page.context().addCookies(
    [
      "_ttp",
      "_tt_enable_cookie",
      "_ttp_pixel",
      "_tt_sessionId",
      "_tt_pixel_session_index",
      "_tt_appInfo",
      "ttcsid",
      "ttcsid_D3IKI7BC77UEJB9HBO0G",
      "ttclid",
    ].map((name) => ({ name, value: "legacy-e2e", url: origin })),
  );
  await page.reload();
  await expect
    .poll(async () =>
      (await page.context().cookies())
        .filter((cookie) => tiktokCookiePattern.test(cookie.name))
        .map((cookie) => cookie.name),
    )
    .toEqual([]);
  await expectTikTokPixelAbsent(page, "legacy cleanup");

  await page.getByTestId("button-accept-all").click();
  await expect(page.getByTestId("cookie-banner")).toBeHidden();
  await expect(page.locator('script[src*="clarity.ms/tag/sxayts0dzk"]')).toHaveCount(1);
  await expectTikTokPixelAbsent(page, "accepted state");

  const googleConfigured = await hasVerifiedGoogleConfig(page);
  if (process.env.E2E_EXPECTED_SHA) expect(googleConfigured).toBe(true);
  const acceptedViews = googleConfigured ? 1 : 0;
  await expect
    .poll(async () =>
      (await dataLayerCommands(page)).filter(
        (command) => command[0] === "event" && command[1] === "page_view",
      ).length,
    )
    .toBe(acceptedViews);

  const acceptedPreferences = await footerPreferencesButton(page, isMobile);
  await acceptedPreferences.click();
  await setOptionalConsent(page, { analytics: false, marketing: false });
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByTestId("cookie-preferences-modal")).toBeHidden();
  expect(await readStoredConsent(page)).toMatchObject({
    consent: { analytics: true, marketing: true },
  });
  const cancelledPreferences = await footerPreferencesButton(page, isMobile);
  await cancelledPreferences.click();
  await expectOptionalConsent(page, true);
  await setOptionalConsent(page, { analytics: false, marketing: false });
  await page.getByTestId("button-cancel-preferences").click();
  await expect(page.getByTestId("cookie-preferences-modal")).toBeHidden();
  expect(await readStoredConsent(page)).toMatchObject({
    consent: { analytics: true, marketing: true },
  });

  await (await footerLink(page, "/about")).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect
    .poll(async () =>
      (await dataLayerCommands(page)).filter(
        (command) => command[0] === "event" && command[1] === "page_view",
      ).length,
    )
    .toBe(acceptedViews + (googleConfigured ? 1 : 0));
  await expectTikTokPixelAbsent(page, "accepted SPA navigation");

  const originalTimeOrigin = await page.evaluate(() => performance.timeOrigin);
  const preferences = await footerPreferencesButton(page, isMobile);
  await preferences.click();
  await setOptionalConsent(page, { analytics: false, marketing: false });
  await savePreferencesWithClarityConsentAudit(page, false);
  await expect(page.getByTestId("cookie-preferences-modal")).toBeHidden();
  expect(await page.evaluate(() => performance.timeOrigin)).toBe(originalTimeOrigin);
  expect(await readStoredConsent(page)).toMatchObject({
    consent: { analytics: false, marketing: false },
  });
  await expectTikTokPixelAbsent(page, "withdrawn state");

  const deniedViews = (await dataLayerCommands(page)).filter(
    (command) => command[0] === "event" && command[1] === "page_view",
  ).length;
  await (await footerLink(page, "/")).click();
  await expect(page).toHaveURL(/\/$/);
  await page.waitForTimeout(250);
  expect(
    (await dataLayerCommands(page)).filter(
      (command) => command[0] === "event" && command[1] === "page_view",
    ).length,
  ).toBe(deniedViews);

  const restorePreferences = await footerPreferencesButton(page, isMobile);
  await restorePreferences.click();
  await setOptionalConsent(page, { analytics: true, marketing: true });
  await savePreferencesWithClarityConsentAudit(page, true);
  await expect
    .poll(async () =>
      (await dataLayerCommands(page)).filter(
        (command) => command[0] === "event" && command[1] === "page_view",
      ).length,
    )
    .toBe(deniedViews + (googleConfigured ? 1 : 0));
  await expectTikTokPixelAbsent(page, "restored state");

  await page.reload();
  await expectDeployedSha(page);
  await expect(page.getByTestId("cookie-banner")).toBeHidden();
  await expect(page.locator('script[src*="clarity.ms/tag/sxayts0dzk"]')).toHaveCount(1);
  await expectTikTokPixelAbsent(page, "persisted accepted reload");
});

test("Google provider errors cannot skip revocation cookie cleanup", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  await expectDeployedSha(page);
  await page.getByTestId("button-manage-preferences").click();
  await setOptionalConsent(page, { analytics: true, marketing: false });
  await page.getByTestId("button-save-preferences").click();
  await expect(page.getByTestId("cookie-banner")).toBeHidden();

  const origin = new URL(page.url()).origin;
  await page.context().addCookies([
    { name: "_ga", value: "synthetic-ga", url: origin },
    { name: "_ga_SYNTHETIC", value: "synthetic-ga-stream", url: origin },
    { name: "_gcl_au", value: "synthetic-ads", url: origin },
  ]);
  await page.evaluate(() => {
    window.gtag = () => {
      throw new Error("Synthetic Google provider failure");
    };
  });

  const preferences = await footerPreferencesButton(page, isMobile);
  await preferences.click();
  await setOptionalConsent(page, { analytics: false, marketing: false });
  await page.getByTestId("button-save-preferences").click();
  await expect(page.getByTestId("cookie-preferences-modal")).toBeHidden();
  await expect
    .poll(async () =>
      (await page.context().cookies())
        .filter((cookie) => cookie.name.startsWith("_ga") || cookie.name.startsWith("_gcl"))
        .map((cookie) => cookie.name),
    )
    .toEqual([]);
  await expectTikTokPixelAbsent(page, "Google provider failure");
});

test("a withdrawal in another tab closes Google events in the first tab", async ({
  page,
  context,
  isMobile,
}) => {
  await page.goto("/");
  await expectDeployedSha(page);
  await page.getByTestId("button-manage-preferences").click();
  await setOptionalConsent(page, { analytics: true, marketing: false });
  await page.getByTestId("button-save-preferences").click();
  await expect(page.getByTestId("cookie-banner")).toBeHidden();

  const eventsBefore = await page.evaluate(() => ({
    pageViews: (window.dataLayer ?? []).filter(
      (entry) => Array.from(entry)[0] === "event" && Array.from(entry)[1] === "page_view",
    ).length,
    leads: (window.dataLayer ?? []).filter(
      (entry) => Array.from(entry)[0] === "event" && Array.from(entry)[1] === "generate_lead",
    ).length,
  }));
  const originalTimeOrigin = await page.evaluate(() => performance.timeOrigin);
  await page.evaluate(() => {
    document.addEventListener(
      "click",
      (event) => {
        if (event.target instanceof Element && event.target.closest('a[href^="tel:"]')) {
          event.preventDefault();
        }
      },
      true,
    );
  });

  const otherTab = await context.newPage();
  try {
    await stubAnalyticsProviders(otherTab);
    await authenticateProtectedPreview(otherTab);
    await otherTab.goto("/");
    await expectDeployedSha(otherTab);
    await expect(otherTab.getByTestId("cookie-banner")).toBeHidden();
    const otherPreferences = await footerPreferencesButton(otherTab, isMobile);
    await otherPreferences.click();
    await setOptionalConsent(otherTab, { analytics: false, marketing: false });
    await otherTab.getByTestId("button-save-preferences").click();

    await page.waitForFunction(() => {
      const updates = (window.dataLayer ?? [])
        .map((entry) => Array.from(entry))
        .filter((entry) => entry[0] === "consent" && entry[1] === "update");
      return updates.at(-1)?.[2]?.analytics_storage === "denied";
    });

    await page.evaluate(() => {
      const currentState = JSON.parse(localStorage.getItem("hmp_cookie_consent") ?? "null");
      const staleGrant = {
        ...currentState,
        consent: { necessary: true, analytics: true, marketing: true },
        lastUpdated: new Date(Date.now() - 60_000).toISOString(),
      };
      window.dispatchEvent(new StorageEvent("storage", {
        key: "hmp_cookie_consent",
        newValue: JSON.stringify(staleGrant),
        url: window.location.href,
      }));
    });
    await page.waitForFunction(() => {
      const updates = (window.dataLayer ?? [])
        .map((entry) => Array.from(entry))
        .filter((entry) => entry[0] === "consent" && entry[1] === "update");
      const latest = updates.at(-1)?.[2];
      return latest?.analytics_storage === "denied" && latest?.ad_storage === "denied";
    });

    await page.getByTestId(isMobile ? "hero-call-now-mobile" : "hero-call-now").click();
    await page
      .getByTestId(isMobile ? "hero-book-consultation-mobile" : "hero-book-consultation")
      .click();
    await expect(page).toHaveURL(/\/services$/);
    await page.waitForTimeout(250);
    const eventsAfter = await page.evaluate(() => ({
      pageViews: (window.dataLayer ?? []).filter(
        (entry) => Array.from(entry)[0] === "event" && Array.from(entry)[1] === "page_view",
      ).length,
      leads: (window.dataLayer ?? []).filter(
        (entry) => Array.from(entry)[0] === "event" && Array.from(entry)[1] === "generate_lead",
      ).length,
    }));
    expect(eventsAfter).toEqual(eventsBefore);
    expect(await page.evaluate(() => performance.timeOrigin)).toBe(originalTimeOrigin);
    await expectTikTokPixelAbsent(page, "cross-tab withdrawal");
    await expectTikTokPixelAbsent(otherTab, "cross-tab source");
  } finally {
    await otherTab.unrouteAll({ behavior: "ignoreErrors" });
    await otherTab.close();
  }
});

test("a failed mixed withdrawal only watermarks its own category", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  await expectDeployedSha(page);
  await page.getByTestId("button-manage-preferences").click();
  await setOptionalConsent(page, { analytics: false, marketing: true });
  await page.getByTestId("button-save-preferences").click();
  await expect(page.getByTestId("cookie-banner")).toBeHidden();

  await page.evaluate(() => {
    const state = window as typeof window & {
      __hmpE2eConsentEvents?: CustomEvent["detail"][];
      __hmpE2eOriginalSetItem?: typeof Storage.prototype.setItem;
    };
    state.__hmpE2eConsentEvents = [];
    window.addEventListener("consentChanged", (event) => {
      state.__hmpE2eConsentEvents?.push((event as CustomEvent).detail);
    });
    state.__hmpE2eOriginalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function failConsentPersistence(key, value) {
      if (this === window.localStorage && key === "hmp_cookie_consent") {
        throw new DOMException("Synthetic storage failure", "QuotaExceededError");
      }
      return state.__hmpE2eOriginalSetItem?.call(this, key, value);
    };
  });

  const preferences = await footerPreferencesButton(page, isMobile);
  await preferences.click();
  await setOptionalConsent(page, { analytics: false, marketing: false });
  await page.getByTestId("button-save-preferences").click();
  await page.waitForTimeout(250);
  expect(
    await page.evaluate(() =>
      (window as typeof window & { __hmpE2eConsentEvents?: CustomEvent["detail"][] })
        .__hmpE2eConsentEvents?.at(-1),
    ),
  ).toMatchObject({
    analytics: false,
    marketing: false,
    persisted: false,
    analyticsPersisted: true,
    marketingPersisted: false,
  });
  expect(await readStoredConsent(page)).toMatchObject({
    consent: { analytics: false, marketing: true },
  });

  await page.evaluate(() => {
    const state = window as typeof window & {
      __hmpE2eOriginalSetItem?: typeof Storage.prototype.setItem;
    };
    const current = JSON.parse(localStorage.getItem("hmp_cookie_consent") ?? "null");
    const remoteGrant = {
      ...current,
      consent: { necessary: true, analytics: true, marketing: true },
      lastUpdated: new Date().toISOString(),
    };
    state.__hmpE2eOriginalSetItem?.call(
      window.localStorage,
      "hmp_cookie_consent",
      JSON.stringify(remoteGrant),
    );
    window.dispatchEvent(new StorageEvent("storage", {
      key: "hmp_cookie_consent",
      oldValue: JSON.stringify(current),
      newValue: JSON.stringify(remoteGrant),
      url: window.location.href,
    }));
  });
  await page.waitForFunction(() => {
    const updates = (window.dataLayer ?? [])
      .map((entry) => Array.from(entry))
      .filter((entry) => entry[0] === "consent" && entry[1] === "update");
    const latest = updates.at(-1)?.[2];
    return latest?.analytics_storage === "granted" && latest?.ad_storage === "denied";
  });

  const updatedPreferences = await footerPreferencesButton(page, isMobile);
  await updatedPreferences.click();
  await expect(page.getByTestId("switch-analytics")).toHaveAttribute("data-state", "checked");
  await expect(page.getByTestId("switch-marketing")).toHaveAttribute("data-state", "unchecked");
  await page.getByTestId("button-cancel-preferences").click();
  await expectTikTokPixelAbsent(page, "category watermark");
});

test("repeated failed grants never become effective consent", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  await expectDeployedSha(page);
  await page.getByTestId("button-reject-all").click();
  await expect(page.getByTestId("cookie-banner")).toBeHidden();

  await page.evaluate(() => {
    const state = window as typeof window & { __hmpE2eConsentEvents?: CustomEvent["detail"][] };
    state.__hmpE2eConsentEvents = [];
    window.addEventListener("consentChanged", (event) => {
      state.__hmpE2eConsentEvents?.push((event as CustomEvent).detail);
    });
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function failConsentPersistence(key, value) {
      if (this === window.localStorage && key === "hmp_cookie_consent") {
        throw new DOMException("Synthetic storage failure", "QuotaExceededError");
      }
      return originalSetItem.call(this, key, value);
    };
  });

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const preferences = await footerPreferencesButton(page, isMobile);
    await preferences.click();
    await expectOptionalConsent(page, false);
    await setOptionalConsent(page, { analytics: true, marketing: true });
    await page.getByTestId("button-save-preferences").click();
    await page.waitForTimeout(250);

    expect(
      await page.evaluate(() =>
        (window as typeof window & { __hmpE2eConsentEvents?: CustomEvent["detail"][] })
          .__hmpE2eConsentEvents?.at(-1),
      ),
    ).toMatchObject({
      analytics: false,
      marketing: false,
      persisted: false,
      analyticsPersisted: false,
      marketingPersisted: false,
    });
    expect(await readStoredConsent(page)).toMatchObject({
      consent: { analytics: false, marketing: false },
    });
    await expect(page.locator('script[src*="clarity.ms"]')).toHaveCount(0);
    await expectTikTokPixelAbsent(page, `failed grant ${attempt + 1}`);
  }
});

test("a failed rejection write stays fail-closed without reloading an old grant", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  await expectDeployedSha(page);
  await page.getByTestId("button-accept-all").click();
  await expect(page.getByTestId("cookie-banner")).toBeHidden();
  await expect(page.locator('script[src*="clarity.ms/tag/sxayts0dzk"]')).toHaveCount(1);

  const originalTimeOrigin = await page.evaluate(() => performance.timeOrigin);
  await page.evaluate(() => {
    const state = window as typeof window & { __hmpE2eConsentEvents?: CustomEvent["detail"][] };
    state.__hmpE2eConsentEvents = [];
    window.addEventListener("consentChanged", (event) => {
      state.__hmpE2eConsentEvents?.push((event as CustomEvent).detail);
    });
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function failConsentPersistence(key, value) {
      if (this === window.localStorage && key === "hmp_cookie_consent") {
        throw new DOMException("Synthetic storage failure", "QuotaExceededError");
      }
      return originalSetItem.call(this, key, value);
    };
  });

  const preferences = await footerPreferencesButton(page, isMobile);
  await preferences.click();
  await setOptionalConsent(page, { analytics: false, marketing: false });
  await page.getByTestId("button-save-preferences").click();
  await page.waitForTimeout(250);

  expect(await page.evaluate(() => performance.timeOrigin)).toBe(originalTimeOrigin);
  expect(await readStoredConsent(page)).toMatchObject({
    consent: { analytics: true, marketing: true },
  });
  expect(
    await page.evaluate(() =>
      (window as typeof window & { __hmpE2eConsentEvents?: CustomEvent["detail"][] })
        .__hmpE2eConsentEvents?.at(-1),
    ),
  ).toMatchObject({ analytics: false, marketing: false, persisted: false });

  await page.evaluate(() => {
    const staleGrant = localStorage.getItem("hmp_cookie_consent");
    window.dispatchEvent(new StorageEvent("storage", {
      key: "hmp_cookie_consent",
      newValue: staleGrant,
      url: window.location.href,
    }));
  });
  await page.waitForTimeout(100);

  const eventsBefore = await page.evaluate(() => ({
    pageViews: (window.dataLayer ?? []).filter(
      (entry) => Array.from(entry)[0] === "event" && Array.from(entry)[1] === "page_view",
    ).length,
    leads: (window.dataLayer ?? []).filter(
      (entry) => Array.from(entry)[0] === "event" && Array.from(entry)[1] === "generate_lead",
    ).length,
  }));
  await page.evaluate(() => {
    document.addEventListener(
      "click",
      (event) => {
        if (event.target instanceof Element && event.target.closest('a[href^="tel:"]')) {
          event.preventDefault();
        }
      },
      true,
    );
  });
  await page.getByTestId(isMobile ? "hero-call-now-mobile" : "hero-call-now").click();
  await (await footerLink(page, "/about")).click();
  await expect(page).toHaveURL(/\/about$/);
  await page.waitForTimeout(250);
  const eventsAfter = await page.evaluate(() => ({
    pageViews: (window.dataLayer ?? []).filter(
      (entry) => Array.from(entry)[0] === "event" && Array.from(entry)[1] === "page_view",
    ).length,
    leads: (window.dataLayer ?? []).filter(
      (entry) => Array.from(entry)[0] === "event" && Array.from(entry)[1] === "generate_lead",
    ).length,
  }));
  expect(eventsAfter).toEqual(eventsBefore);
  expect(await page.evaluate(() => performance.timeOrigin)).toBe(originalTimeOrigin);
  await expectTikTokPixelAbsent(page, "failed rejection");
});

test("Spanish cookie actions remain fully localized", async ({ page, isMobile }) => {
  await page.goto("/es");
  await expectDeployedSha(page);

  const banner = page.getByTestId("cookie-banner");
  await expect(banner).toBeVisible();
  await expect(page.getByTestId("button-manage-preferences")).toContainText(
    "Gestionar Preferencias",
  );
  await page.getByTestId("button-manage-preferences").click();
  await expect(page.getByTestId("button-cancel-preferences")).toHaveText("Cancelar");
  await page.getByTestId("button-cancel-preferences").click();
  await expect(banner).toBeVisible();
  await expect(page.getByTestId("button-reject-all")).toHaveText("Rechazar Todo");
  await page.getByTestId("button-reject-all").click();
  await expect(banner).toBeHidden();

  const preferences = await footerPreferencesButton(page, isMobile);
  await preferences.click();
  await expect(page.getByTestId("cookie-preferences-modal")).toBeVisible();
  await expect(banner).toBeHidden();
  await expect(page.getByTestId("button-cancel-preferences")).toHaveText("Cancelar");
  await page.getByTestId("button-cancel-preferences").click();
  await expect(page.getByTestId("cookie-preferences-modal")).toBeHidden();
  await expect(banner).toBeHidden();
  await expectTikTokPixelAbsent(page, "Spanish controls");
});
