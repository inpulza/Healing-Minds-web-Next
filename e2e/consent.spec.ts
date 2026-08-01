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

test.beforeEach(async ({ page }) => {
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

  await addSyntheticTikTokIdentifier(page);
  await page.waitForTimeout(500);
  await expectNoSyntheticTikTokIdentifier(page);

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
  await preferences.click();
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
