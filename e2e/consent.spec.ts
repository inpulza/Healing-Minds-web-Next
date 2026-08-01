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

async function stubAnalyticsProviders(page: Page) {
  // Consent E2E must exercise our lifecycle without sending synthetic visits to
  // the clinic's live analytics accounts. TikTok's loader only needs a
  // successful script response for this test; the dedicated Preview audit
  // verifies the real provider SDKs separately.
  await page.route("https://analytics.tiktok.com/**", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
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

async function setOptionalConsent(
  page: Page,
  consent: { analytics: boolean; marketing: boolean },
) {
  for (const category of ["analytics", "marketing"] as const) {
    const toggle = page.getByTestId(`switch-${category}`);
    const checked = (await toggle.getAttribute("data-state")) === "checked";
    if (checked !== consent[category]) {
      await toggle.click();
    }
  }
}

async function expectOptionalConsent(page: Page, enabled: boolean) {
  const state = enabled ? "checked" : "unchecked";
  await expect(page.getByTestId("switch-analytics")).toHaveAttribute("data-state", state);
  await expect(page.getByTestId("switch-marketing")).toHaveAttribute("data-state", state);
}

async function addSyntheticTikTokIdentifier(page: Page) {
  await page.context().addCookies([
    {
      name: "ttcsid",
      value: "synthetic-e2e-identifier",
      url: new URL(page.url()).origin,
    },
  ]);
}

async function expectNoSyntheticTikTokIdentifier(page: Page) {
  const cookies = await page.context().cookies();
  expect(cookies.some((cookie) => cookie.name === "ttcsid")).toBe(false);
}

test("first-visit cookie controls close, persist and remain explicit", async ({ page }) => {
  await page.goto("/");
  await expectDeployedSha(page);

  const banner = page.getByTestId("cookie-banner");
  const modal = page.getByTestId("cookie-preferences-modal");
  await expect(banner).toBeVisible();

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
});

test("accepted visitors can reopen, cancel and withdraw consent", async ({ page, isMobile }) => {
  await page.goto("/");
  await expectDeployedSha(page);

  const banner = page.getByTestId("cookie-banner");
  const modal = page.getByTestId("cookie-preferences-modal");
  await page.getByTestId("button-accept-all").click();
  await expect(banner).toBeHidden();

  const preferences = await footerPreferencesButton(page, isMobile);
  await preferences.click();
  await expect(modal).toBeVisible();
  await expect(banner).toBeHidden();
  await setOptionalConsent(page, { analytics: false, marketing: false });
  await page.getByRole("button", { name: "Close" }).click();
  await expect(modal).toBeHidden();
  await expect(banner).toBeHidden();

  await preferences.click();
  await expect(modal).toBeVisible();
  await expectOptionalConsent(page, true);
  await setOptionalConsent(page, { analytics: false, marketing: false });
  await page.getByTestId("button-cancel-preferences").click();
  await expect(modal).toBeHidden();
  await expect(banner).toBeHidden();

  await preferences.click();
  await expect(modal).toBeVisible();
  await expectOptionalConsent(page, true);
  await setOptionalConsent(page, { analytics: true, marketing: false });
  await page.getByTestId("button-save-preferences").click();
  await page.waitForFunction(() => {
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    return navigation?.type === "reload";
  });
  await expect(modal).toBeHidden();
  await expect(banner).toBeHidden();
  expect(await readStoredConsent(page)).toMatchObject({
    hasConsented: true,
    consent: { necessary: true, analytics: true, marketing: false },
  });

  await page.reload();
  await expect(banner).toBeHidden();
  expect(await readStoredConsent(page)).toMatchObject({
    consent: { analytics: true, marketing: false },
  });

  await page.goto("/about");
  await expect(banner).toBeHidden();
  await page.goBack();
  await expect(banner).toBeHidden();
  await page.goForward();
  await expect(banner).toBeHidden();
  expect(await readStoredConsent(page)).toMatchObject({
    consent: { analytics: true, marketing: false },
  });

  await page.evaluate(() => {
    window.__hmpE2eRestoreCalls = [];
    const queue = [];
    const nativePush = Array.prototype.push;
    queue.push = function recordCleanRestore(...items) {
      for (const item of items) {
        if (
          Array.isArray(item) &&
          ["enableCookie", "grantConsent", "page"].includes(item[0])
        ) {
          window.__hmpE2eRestoreCalls.push(item[0]);
        }
      }
      return nativePush.apply(this, items);
    };
    window.ttq = queue;
  });
  const cleanPreferences = await footerPreferencesButton(page, isMobile);
  await cleanPreferences.click();
  await setOptionalConsent(page, { analytics: true, marketing: true });
  await page.getByTestId("button-save-preferences").click();
  await expect(page.locator('script[src*="analytics.tiktok.com"]')).toHaveCount(1);
  const cleanRestoreCalls = await page.evaluate(() => window.__hmpE2eRestoreCalls);
  expect(cleanRestoreCalls).toEqual(["enableCookie", "grantConsent", "page"]);
  expect(await readStoredConsent(page)).toMatchObject({
    consent: { analytics: true, marketing: true },
  });

  // A fast reload can happen before the previous document's asynchronous
  // TikTok SDK consumes its restoration queue. Every fresh document with a
  // persisted grant must therefore reaffirm provider consent before page().
  await page.addInitScript(() => {
    window.__hmpE2eFreshRestoreCalls = [];
    const queue = [];
    const nativePush = Array.prototype.push;
    queue.push = function recordFreshRestore(...items) {
      for (const item of items) {
        if (
          Array.isArray(item) &&
          ["enableCookie", "grantConsent", "page"].includes(item[0])
        ) {
          window.__hmpE2eFreshRestoreCalls.push(item[0]);
        }
      }
      return nativePush.apply(this, items);
    };
    window.ttq = queue;
  });
  await page.reload();
  await expect(page.getByTestId("cookie-banner")).toBeHidden();
  await expect(page.locator('script[src*="analytics.tiktok.com"]')).toHaveCount(1);
  await expect
    .poll(() => page.evaluate(() => window.__hmpE2eFreshRestoreCalls))
    .toEqual(["enableCookie", "grantConsent", "page"]);
});

test("a partial TikTok restoration rolls back and remains fail-closed", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  await expectDeployedSha(page);
  await page.getByTestId("button-reject-all").click();
  await expect(page.getByTestId("cookie-banner")).toBeHidden();

  await page.evaluate(() => {
    window.__hmpE2eRestoreCalls = [];
    window.ttq = {
      enableCookie() {
        window.__hmpE2eRestoreCalls.push("enableCookie");
      },
      grantConsent() {
        window.__hmpE2eRestoreCalls.push("grantConsent");
        throw new Error("Synthetic TikTok grant failure");
      },
      revokeConsent() {
        window.__hmpE2eRestoreCalls.push("revokeConsent");
      },
      disableCookie() {
        window.__hmpE2eRestoreCalls.push("disableCookie");
      },
      page() {
        window.__hmpE2eRestoreCalls.push("page");
      },
    };
  });

  const originalTimeOrigin = await page.evaluate(() => performance.timeOrigin);
  const preferences = await footerPreferencesButton(page, isMobile);
  await preferences.click();
  await setOptionalConsent(page, { analytics: false, marketing: true });
  await page.getByTestId("button-save-preferences").click();

  await expect
    .poll(() => page.evaluate(() => window.__hmpE2eRestoreCalls))
    .toEqual(["enableCookie", "grantConsent", "revokeConsent", "disableCookie"]);
  expect(await readStoredConsent(page)).toMatchObject({
    consent: { analytics: false, marketing: true },
  });

  await addSyntheticTikTokIdentifier(page);
  await page.waitForTimeout(500);
  await expectNoSyntheticTikTokIdentifier(page);
  await page.locator('footer a[href="/about"]').first().click();
  await expect(page).toHaveURL(/\/about$/);
  expect(await page.evaluate(() => performance.timeOrigin)).toBe(originalTimeOrigin);
  expect(await page.evaluate(() => window.__hmpE2eRestoreCalls)).toEqual([
    "enableCookie",
    "grantConsent",
    "revokeConsent",
    "disableCookie",
  ]);

  // Retry in the same document after the provider recovers. Because the
  // failed attempt never counted this route, restoration must emit page()
  // before marking it as tracked.
  await page.evaluate(() => {
    window.ttq.grantConsent = () => {
      window.__hmpE2eRestoreCalls.push("grantConsent");
    };
  });
  const retryPreferences = await footerPreferencesButton(page, isMobile);
  await retryPreferences.click();
  await setOptionalConsent(page, { analytics: false, marketing: true });
  await page.getByTestId("button-save-preferences").click();
  await expect
    .poll(() => page.evaluate(() => window.__hmpE2eRestoreCalls))
    .toEqual([
      "enableCookie",
      "grantConsent",
      "revokeConsent",
      "disableCookie",
      "enableCookie",
      "grantConsent",
      "page",
    ]);
});

test("a persisted withdrawal after failed TikTok restoration reloads the loaded SDK", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  await expectDeployedSha(page);
  await page.getByTestId("button-reject-all").click();
  await expect(page.getByTestId("cookie-banner")).toBeHidden();

  await page.evaluate(() => {
    window.__hmpE2eRestoreCalls = [];
    window.ttq = {
      enableCookie() {
        window.__hmpE2eRestoreCalls.push("enableCookie");
      },
      grantConsent() {
        window.__hmpE2eRestoreCalls.push("grantConsent");
        throw new Error("Synthetic TikTok grant failure");
      },
      revokeConsent() {
        window.__hmpE2eRestoreCalls.push("revokeConsent");
      },
      disableCookie() {
        window.__hmpE2eRestoreCalls.push("disableCookie");
      },
      page() {
        window.__hmpE2eRestoreCalls.push("page");
      },
    };
    const loadedSdk = document.createElement("script");
    loadedSdk.src =
      "https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=synthetic&lib=ttq";
    document.head.appendChild(loadedSdk);
  });

  const grantPreferences = await footerPreferencesButton(page, isMobile);
  await grantPreferences.click();
  await setOptionalConsent(page, { analytics: false, marketing: true });
  await page.getByTestId("button-save-preferences").click();
  await expect
    .poll(() => page.evaluate(() => window.__hmpE2eRestoreCalls))
    .toEqual(["enableCookie", "grantConsent", "revokeConsent", "disableCookie"]);
  expect(await readStoredConsent(page)).toMatchObject({
    consent: { analytics: false, marketing: true },
  });
  await expect(page.locator('script[src*="analytics.tiktok.com"]')).toHaveCount(1);

  const originalTimeOrigin = await page.evaluate(() => performance.timeOrigin);
  const withdrawalPreferences = await footerPreferencesButton(page, isMobile);
  await withdrawalPreferences.click();
  await setOptionalConsent(page, { analytics: false, marketing: false });
  const reloadPromise = page.waitForEvent(
    "framenavigated",
    (frame) => frame === page.mainFrame(),
  );
  await page.getByTestId("button-save-preferences").click();
  await reloadPromise;
  await page.waitForLoadState("domcontentloaded");
  await expectDeployedSha(page);

  expect(await page.evaluate(() => performance.timeOrigin)).not.toBe(originalTimeOrigin);
  await expect(page.getByTestId("cookie-banner")).toBeHidden();
  expect(await readStoredConsent(page)).toMatchObject({
    consent: { analytics: false, marketing: false },
  });
  await expect(page.locator('script[src*="analytics.tiktok.com"]')).toHaveCount(0);
  await page.waitForTimeout(6_250);
  await expect(page.locator('script[src*="analytics.tiktok.com"]')).toHaveCount(0);
  await expectNoSyntheticTikTokIdentifier(page);
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
      const consentUpdates = (window.dataLayer ?? [])
        .map((entry) => Array.from(entry))
        .filter((entry) => entry[0] === "consent" && entry[1] === "update");
      return consentUpdates.at(-1)?.[2]?.analytics_storage === "denied";
    });

    // Reproduce an older grant arriving after the newer withdrawal is already
    // persisted. The listener must prefer the current shared value and keep
    // every provider denied.
    await page.evaluate(() => {
      const currentState = JSON.parse(
        localStorage.getItem("hmp_cookie_consent") ?? "null",
      );
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
      const consentUpdates = (window.dataLayer ?? [])
        .map((entry) => Array.from(entry))
        .filter((entry) => entry[0] === "consent" && entry[1] === "update");
      const latest = consentUpdates.at(-1)?.[2];
      return latest?.analytics_storage === "denied" && latest?.ad_storage === "denied";
    });

    await page
      .getByTestId(isMobile ? "hero-call-now-mobile" : "hero-call-now")
      .click();
    await page
      .getByTestId(
        isMobile ? "hero-book-consultation-mobile" : "hero-book-consultation",
      )
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
  } finally {
    await otherTab.unrouteAll({ behavior: "ignoreErrors" });
    await otherTab.close();
  }
});

test("queued remote withdrawals cannot cancel the TikTok clean reload", async ({ page }) => {
  await page.goto("/");
  await expectDeployedSha(page);
  await page.getByTestId("button-accept-all").click();
  await expect(page.getByTestId("cookie-banner")).toBeHidden();
  await expect(page.locator('script[src*="analytics.tiktok.com"]')).toHaveCount(1);

  const originalTimeOrigin = await page.evaluate(() => performance.timeOrigin);
  const reloadPromise = page.waitForEvent(
    "framenavigated",
    (frame) => frame === page.mainFrame(),
  );
  await page.evaluate(() => {
    const storedGrant = JSON.parse(
      localStorage.getItem("hmp_cookie_consent") ?? "null",
    );
    const persistedWithdrawal = {
      ...storedGrant,
      consent: { necessary: true, analytics: false, marketing: false },
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(
      "hmp_cookie_consent",
      JSON.stringify(persistedWithdrawal),
    );

    // Reproduce a queued grant followed by a withdrawal. Both notifications
    // must resolve to the final persisted withdrawal; the duplicate denial
    // must not cancel the first event's already-scheduled clean reload.
    window.dispatchEvent(new StorageEvent("storage", {
      key: "hmp_cookie_consent",
      oldValue: JSON.stringify(storedGrant),
      newValue: JSON.stringify(storedGrant),
      url: window.location.href,
    }));
    window.dispatchEvent(new StorageEvent("storage", {
      key: "hmp_cookie_consent",
      oldValue: JSON.stringify(storedGrant),
      newValue: JSON.stringify(persistedWithdrawal),
      url: window.location.href,
    }));
  });
  await reloadPromise;
  await page.waitForLoadState("domcontentloaded");
  await expectDeployedSha(page);

  expect(await page.evaluate(() => performance.timeOrigin)).not.toBe(originalTimeOrigin);
  await expect(page.getByTestId("cookie-banner")).toBeHidden();
  expect(await readStoredConsent(page)).toMatchObject({
    consent: { analytics: false, marketing: false },
  });
  await expect(page.locator('script[src*="analytics.tiktok.com"]')).toHaveCount(0);
});

test("a persisted withdrawal retry upgrades indefinite cleanup to a clean reload", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  await expectDeployedSha(page);
  await page.getByTestId("button-accept-all").click();
  await expect(page.getByTestId("cookie-banner")).toBeHidden();
  await expect(page.locator('script[src*="analytics.tiktok.com"]')).toHaveCount(1);

  const originalTimeOrigin = await page.evaluate(() => performance.timeOrigin);
  await page.evaluate(() => {
    window.__hmpE2eConsentEvents = [];
    window.addEventListener("consentChanged", (event) => {
      window.__hmpE2eConsentEvents.push(event.detail);
    });
    const originalSetItem = Storage.prototype.setItem;
    let failedOnce = false;
    Storage.prototype.setItem = function failFirstConsentPersistence(key, value) {
      if (
        this === window.localStorage &&
        key === "hmp_cookie_consent" &&
        !failedOnce
      ) {
        failedOnce = true;
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
  expect(await page.evaluate(() => window.__hmpE2eConsentEvents.at(-1))).toMatchObject({
    analytics: false,
    marketing: false,
    persisted: false,
    analyticsPersisted: false,
    marketingPersisted: false,
  });

  const retryPreferences = await footerPreferencesButton(page, isMobile);
  await retryPreferences.click();
  await expectOptionalConsent(page, false);
  const reloadPromise = page.waitForEvent(
    "framenavigated",
    (frame) => frame === page.mainFrame(),
  );
  await page.getByTestId("button-save-preferences").click();
  await reloadPromise;
  await page.waitForLoadState("domcontentloaded");
  await expectDeployedSha(page);

  expect(await page.evaluate(() => performance.timeOrigin)).not.toBe(originalTimeOrigin);
  await expect(page.getByTestId("cookie-banner")).toBeHidden();
  expect(await readStoredConsent(page)).toMatchObject({
    consent: { analytics: false, marketing: false },
  });
  await expect(page.locator('script[src*="analytics.tiktok.com"]')).toHaveCount(0);
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
  await expect(page.locator('script[src*="analytics.tiktok.com"]')).toHaveCount(1);

  await page.evaluate(() => {
    window.__hmpE2eConsentEvents = [];
    window.addEventListener("consentChanged", (event) => {
      window.__hmpE2eConsentEvents.push(event.detail);
    });
    window.__hmpE2eOriginalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function failConsentPersistence(key, value) {
      if (this === window.localStorage && key === "hmp_cookie_consent") {
        throw new DOMException("Synthetic storage failure", "QuotaExceededError");
      }
      return window.__hmpE2eOriginalSetItem.call(this, key, value);
    };
  });

  const preferences = await footerPreferencesButton(page, isMobile);
  await preferences.click();
  await setOptionalConsent(page, { analytics: false, marketing: false });
  await page.getByTestId("button-save-preferences").click();
  await page.waitForTimeout(250);
  expect(await page.evaluate(() => window.__hmpE2eConsentEvents.at(-1))).toMatchObject({
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
    window.__hmpE2eQueuedGrantCalls = [];
    for (const method of ["enableCookie", "grantConsent"]) {
      const original = window.ttq?.[method];
      if (typeof original !== "function") continue;
      window.ttq[method] = function recordQueuedGrantCall(...args) {
        window.__hmpE2eQueuedGrantCalls.push(method);
        return original.apply(this, args);
      };
    }

    const current = JSON.parse(localStorage.getItem("hmp_cookie_consent") ?? "null");
    const remoteGrant = {
      ...current,
      consent: { necessary: true, analytics: true, marketing: true },
      lastUpdated: new Date().toISOString(),
    };
    window.__hmpE2eOriginalSetItem.call(
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
    const consentUpdates = (window.dataLayer ?? [])
      .map((entry) => Array.from(entry))
      .filter((entry) => entry[0] === "consent" && entry[1] === "update");
    const latest = consentUpdates.at(-1)?.[2];
    return latest?.analytics_storage === "granted" && latest?.ad_storage === "denied";
  });
  expect(await page.evaluate(() => window.__hmpE2eConsentEvents.at(-1))).toMatchObject({
    analytics: true,
    marketing: false,
    persisted: false,
    analyticsPersisted: true,
    marketingPersisted: false,
  });
  expect(await page.evaluate(() => window.__hmpE2eQueuedGrantCalls)).toEqual([]);
  await addSyntheticTikTokIdentifier(page);
  await page.waitForTimeout(500);
  await expectNoSyntheticTikTokIdentifier(page);

  const updatedPreferences = await footerPreferencesButton(page, isMobile);
  await updatedPreferences.click();
  await expect(page.getByTestId("switch-analytics")).toHaveAttribute("data-state", "checked");
  await expect(page.getByTestId("switch-marketing")).toHaveAttribute("data-state", "unchecked");
  await page.getByTestId("button-cancel-preferences").click();
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
    window.__hmpE2eConsentEvents = [];
    window.addEventListener("consentChanged", (event) => {
      window.__hmpE2eConsentEvents.push(event.detail);
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

    expect(await page.evaluate(() => window.__hmpE2eConsentEvents.at(-1))).toMatchObject({
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
    await expect(page.locator('script[src*="analytics.tiktok.com"]')).toHaveCount(0);
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
  await expect(page.locator('script[src*="analytics.tiktok.com"]')).toHaveCount(1);

  const originalTimeOrigin = await page.evaluate(() => performance.timeOrigin);
  await page.evaluate(() => {
    window.__hmpE2eConsentEvents = [];
    window.addEventListener("consentChanged", (event) => {
      window.__hmpE2eConsentEvents.push(event.detail);
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
  await page.waitForTimeout(500);

  expect(await page.evaluate(() => performance.timeOrigin)).toBe(originalTimeOrigin);
  expect(await readStoredConsent(page)).toMatchObject({
    consent: { analytics: true, marketing: true },
  });
  expect(await page.evaluate(() => window.__hmpE2eConsentEvents.at(-1))).toMatchObject({
    analytics: false,
    marketing: false,
    persisted: false,
  });

  // A grant from another tab may already be queued while the failed local
  // withdrawal leaves the older grant in storage. This document must retain
  // its local revocation watermark and refuse to reopen either provider.
  await page.evaluate(() => {
    window.__hmpE2eQueuedGrantCalls = [];
    for (const method of ["enableCookie", "grantConsent"]) {
      const original = window.ttq?.[method];
      if (typeof original !== "function") continue;
      window.ttq[method] = function recordQueuedGrantCall(...args) {
        window.__hmpE2eQueuedGrantCalls.push(method);
        return original.apply(this, args);
      };
    }
    const staleGrant = localStorage.getItem("hmp_cookie_consent");
    window.dispatchEvent(new StorageEvent("storage", {
      key: "hmp_cookie_consent",
      newValue: staleGrant,
      url: window.location.href,
    }));
  });
  await page.waitForTimeout(100);
  expect(await page.evaluate(() => window.__hmpE2eQueuedGrantCalls)).toEqual([]);
  expect(await page.evaluate(() => window.__hmpE2eConsentEvents.at(-1))).toMatchObject({
    analytics: false,
    marketing: false,
    persisted: false,
  });

  await addSyntheticTikTokIdentifier(page);
  await page.waitForTimeout(500);
  await expectNoSyntheticTikTokIdentifier(page);

  const googleEventsBefore = await page.evaluate(() => ({
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
  await page
    .getByTestId(isMobile ? "hero-call-now-mobile" : "hero-call-now")
    .click();
  await page.locator('footer a[href="/about"]').first().click();
  await expect(page).toHaveURL(/\/about$/);
  await page.waitForTimeout(250);
  const googleEventsAfter = await page.evaluate(() => ({
    pageViews: (window.dataLayer ?? []).filter(
      (entry) => Array.from(entry)[0] === "event" && Array.from(entry)[1] === "page_view",
    ).length,
    leads: (window.dataLayer ?? []).filter(
      (entry) => Array.from(entry)[0] === "event" && Array.from(entry)[1] === "generate_lead",
    ).length,
  }));
  expect(googleEventsAfter).toEqual(googleEventsBefore);
  expect(await page.evaluate(() => performance.timeOrigin)).toBe(originalTimeOrigin);

  // The normal sweep expires at six seconds. A failed write cannot safely
  // reload the old stored grant, so this exceptional document must continue
  // clearing identifiers after that boundary.
  await page.waitForTimeout(6_250);
  await addSyntheticTikTokIdentifier(page);
  await page.waitForTimeout(500);
  await expectNoSyntheticTikTokIdentifier(page);

  await page.evaluate(() => {
    window.__hmpE2eRestoreCalls = [];
    for (const method of ["enableCookie", "grantConsent"]) {
      const original = window.ttq?.[method];
      if (typeof original !== "function") continue;
      window.ttq[method] = function recordRestoreCall(...args) {
        window.__hmpE2eRestoreCalls.push(method);
        return original.apply(this, args);
      };
    }
  });
  const failedGrantPreferences = await footerPreferencesButton(page, isMobile);
  await failedGrantPreferences.click();
  await setOptionalConsent(page, { analytics: true, marketing: true });
  await page.getByTestId("button-save-preferences").click();
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => window.__hmpE2eRestoreCalls)).toEqual([]);
  expect(await page.evaluate(() => window.__hmpE2eConsentEvents.at(-1))).toMatchObject({
    analytics: false,
    marketing: false,
    persisted: false,
  });
  expect(await page.evaluate(() => performance.timeOrigin)).toBe(originalTimeOrigin);
  await addSyntheticTikTokIdentifier(page);
  await page.waitForTimeout(500);
  await expectNoSyntheticTikTokIdentifier(page);
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
});
