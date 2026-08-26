import { expect, test, type Page } from "@playwright/test";
import { authenticateProtectedPreview, finishProtectedPreview } from "./preview-auth";

test.beforeEach(async ({ page }) => {
  await authenticateProtectedPreview(page);
});

test.afterEach(async ({ page }) => {
  await finishProtectedPreview(page);
});

function collectRuntimeErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.stack || error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  return errors;
}

async function dismissCookieBanner(page: Page) {
  const banner = page.getByTestId("cookie-banner");
  const reject = page.getByTestId("button-reject-all");
  await banner.waitFor({ state: "visible", timeout: 5_000 }).catch(() => undefined);
  if (await reject.isVisible().catch(() => false)) {
    await reject.click();
    await expect(banner).toBeHidden();
  }
}

async function mockPersistedLeadWithFailedZernio(
  page: Page,
  expectedFormKey: "contact_page" | "consultation_modal",
) {
  let submissions = 0;
  await page.route("**/api/contact", async (route) => {
    if (route.request().method() !== "POST") return route.continue();
    submissions += 1;
    const payload = route.request().postDataJSON() as Record<string, unknown>;
    expect(payload.formKey).toBe(expectedFormKey);
    expect(payload.firstName).toBe("Jordan");
    expect(payload.lastName).toBe("Fixture");
    expect(payload.phone).toBe("+1 305 555 0134");
    expect(payload.message).toBe("Browser fixture: please call tomorrow morning.");
    for (const forbidden of ["templateName", "templateLanguage", "accountId", "recipientE164", "tenantId"]) {
      expect(payload).not.toHaveProperty(forbidden);
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        id: `lead-${expectedFormKey}`,
        fixtureAlertStatus: "unknown",
      }),
    });
  });
  return () => submissions;
}

async function fillMainContactForm(page: Page) {
  await page.getByTestId("input-first-name").fill("Jordan");
  await page.getByTestId("input-last-name").fill("Fixture");
  await page.getByTestId("input-email").fill("jordan.fixture@gmail.com");
  await page.getByTestId("input-phone").fill("+1 305 555 0134");
  await page.getByTestId("textarea-message").fill("Browser fixture: please call tomorrow morning.");
  await page.getByTestId("button-submit").click();
}

async function fillConsultationModal(page: Page) {
  await page.getByTestId("modal-input-first-name").fill("Jordan");
  await page.getByTestId("modal-input-last-name").fill("Fixture");
  await page.getByTestId("modal-input-email").fill("jordan.fixture@gmail.com");
  await page.getByTestId("modal-input-phone").fill("+1 305 555 0134");
  await page.getByTestId("modal-textarea-message").fill("Browser fixture: please call tomorrow morning.");
  await page.getByTestId("modal-button-submit").click();
}

for (const locale of [
  { route: "/contact", success: "Success!" },
  { route: "/es/contacto", success: "¡Éxito!" },
] as const) {
  test(`${locale.route} keeps the persisted contact form successful when Zernio fails`, async ({ page }) => {
    const runtimeErrors = collectRuntimeErrors(page);
    const submissions = await mockPersistedLeadWithFailedZernio(page, "contact_page");
    const response = await page.goto(locale.route, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    await dismissCookieBanner(page);
    await fillMainContactForm(page);
    await expect(page.getByText(locale.success, { exact: true })).toBeVisible();
    expect(submissions()).toBe(1);
    expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
  });
}

for (const locale of [
  { route: "/", success: "Success!" },
  { route: "/es", success: "¡Éxito!" },
] as const) {
  test(`${locale.route} mobile consultation modal keeps success when Zernio fails`, async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.startsWith("mobile"), "The consultation modal exists only in the mobile toolbar");
    const runtimeErrors = collectRuntimeErrors(page);
    const submissions = await mockPersistedLeadWithFailedZernio(page, "consultation_modal");
    const response = await page.goto(locale.route, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    await dismissCookieBanner(page);
    await page.getByTestId("mobile-button-contact").click();
    await expect(page.getByTestId("contact-form-modal")).toBeVisible();
    await fillConsultationModal(page);
    await expect(page.getByText(locale.success, { exact: true })).toBeVisible();
    await expect(page.getByTestId("contact-form-modal")).toBeHidden();
    expect(submissions()).toBe(1);
    expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
  });
}
