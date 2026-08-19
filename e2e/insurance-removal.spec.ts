import { expect, test, type Page } from "@playwright/test";

const affectedRoutes = [
  "/",
  "/es",
  "/contact",
  "/es/contacto",
  "/services",
  "/es/servicios",
  "/locations/psychiatrist-estero",
  "/es/ubicaciones/psiquiatra-estero",
  "/locations/psychiatrist-marco-island",
  "/es/ubicaciones/psiquiatra-marco-island",
  "/locations/psychiatrist-vanderbilt-beach",
  "/es/ubicaciones/psiquiatra-vanderbilt-beach",
  "/telepsychiatry-florida",
  "/es/telepsiquiatria-florida",
] as const;

const unsupportedPlanPattern = /florida\s*blue|blue\s*cross\s*blue\s*shield|bluecross\s*blueshield/i;
const retiredLogoPattern = /6_1755868276798/i;

async function rejectConsentIfVisible(page: Page) {
  const reject = page.getByTestId("button-reject-all");
  if (await reject.isVisible().catch(() => false)) {
    await reject.click();
    await expect(reject).toBeHidden();
  }
}

test("unsupported insurance is absent from affected English and Spanish journeys", async ({ page }) => {
  const runtimeErrors: string[] = [];
  const retiredLogoRequests: string[] = [];

  page.on("pageerror", (error) => runtimeErrors.push(error.stack || error.message));
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });
  page.on("request", (request) => {
    if (retiredLogoPattern.test(request.url())) retiredLogoRequests.push(request.url());
  });

  for (const pathname of affectedRoutes) {
    const response = await page.goto(pathname, { waitUntil: "domcontentloaded" });
    expect(response?.status(), `${pathname} should load successfully`).toBe(200);
    await rejectConsentIfVisible(page);
    await expect(page.locator("body")).not.toContainText(unsupportedPlanPattern);
    expect(await page.content(), `${pathname} rendered HTML`).not.toMatch(unsupportedPlanPattern);
    expect(await page.content(), `${pathname} retired logo URL`).not.toMatch(retiredLogoPattern);

    const expectedSha = process.env.E2E_EXPECTED_SHA?.trim();
    if (expectedSha) {
      await expect(page.locator('meta[name="healing-build-sha"]')).toHaveAttribute("content", expectedSha);
    }
  }

  expect(retiredLogoRequests, "retired logo network requests").toEqual([]);
  expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
});
