import { expect, test, type Page } from "@playwright/test";
import { authenticateProtectedPreview, finishProtectedPreview } from "./preview-auth";

const liveSubmissionEnabled = process.env.E2E_LIVE_CONTACT_SUBMISSION === "true";
const verificationEmails = new Set<string>();
let databaseModule: typeof import("../server/db") | undefined;

function collectRuntimeErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.stack || error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  return errors;
}

function verificationEmail(formKey: string): string {
  const email = `inpulza-zernio-${formKey}-${Date.now()}@example.com`;
  verificationEmails.add(email);
  return email;
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

async function waitForReactHydration(page: Page, testId: string) {
  await page.waitForFunction((id) => {
    const element = document.querySelector(`[data-testid="${id}"]`);
    return Boolean(element && Object.keys(element).some((key) => key.startsWith("__reactProps$")));
  }, testId);
}

async function expectAcceptedContactResponse(responsePromise: Promise<import("@playwright/test").Response>) {
  const response = await responsePromise;
  expect(response.status()).toBe(200);
  const body = await response.json() as Record<string, unknown>;
  expect(body.success).toBe(true);
  expect(body.filtered).not.toBe(true);
  expect(body.id).toEqual(expect.stringMatching(/^[0-9a-f-]{36}$/i));
}

test.beforeEach(async ({ page }) => {
  test.skip(!liveSubmissionEnabled, "Live contact persistence is opt-in for a protected Preview");
  await authenticateProtectedPreview(page);
});

test.afterEach(async ({ page }) => {
  await finishProtectedPreview(page);
});

test.afterAll(async () => {
  if (!liveSubmissionEnabled || verificationEmails.size === 0) return;
  const [{ eq }, { contactMessages }] = await Promise.all([
    import("drizzle-orm"),
    import("../shared/schema"),
  ]);
  databaseModule = await import("../server/db");
  for (const email of verificationEmails) {
    await databaseModule.db.delete(contactMessages).where(eq(contactMessages.email, email));
  }
  await databaseModule.pool.end();
});

test("deployed Contact accepts the synthetic Inpulza Zernio payload", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("desktop"), "Contact live verification runs once on desktop");
  const runtimeErrors = collectRuntimeErrors(page);
  const email = verificationEmail("contact");
  await page.goto("/contact", { waitUntil: "domcontentloaded" });
  await dismissCookieBanner(page);
  await waitForReactHydration(page, "button-submit");
  await page.getByTestId("input-first-name").fill("Inpulza");
  await page.getByTestId("input-last-name").fill("Zernio Test");
  await page.getByTestId("input-email").fill(email);
  await page.getByTestId("input-phone").fill("+1 305 555 0134");
  await page.getByTestId("textarea-message").fill("need appointment");
  await page.waitForTimeout(2_100);
  const responsePromise = page.waitForResponse((response) =>
    response.request().method() === "POST" && new URL(response.url()).pathname === "/api/contact"
  );
  await page.getByTestId("button-submit").click();
  await expectAcceptedContactResponse(responsePromise);
  await expect(page.getByText("Success!", { exact: true })).toBeVisible();
  expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
});

test("deployed Consultation accepts the synthetic Inpulza Zernio payload", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "Consultation live verification runs once on mobile");
  const runtimeErrors = collectRuntimeErrors(page);
  const email = verificationEmail("consultation");
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await dismissCookieBanner(page);
  await waitForReactHydration(page, "mobile-button-contact");
  await page.getByTestId("mobile-button-contact").click();
  await page.getByTestId("modal-input-first-name").fill("Inpulza");
  await page.getByTestId("modal-input-last-name").fill("Zernio Test");
  await page.getByTestId("modal-input-email").fill(email);
  await page.getByTestId("modal-input-phone").fill("+1 305 555 0134");
  await page.getByTestId("modal-textarea-message").fill("need appointment");
  await page.waitForTimeout(2_100);
  const responsePromise = page.waitForResponse((response) =>
    response.request().method() === "POST" && new URL(response.url()).pathname === "/api/contact"
  );
  await page.getByTestId("modal-button-submit").click();
  await expectAcceptedContactResponse(responsePromise);
  await expect(page.getByText("Success!", { exact: true })).toBeVisible();
  expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
});
