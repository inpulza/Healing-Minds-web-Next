import { expect, test, type Page } from "@playwright/test";
import { authenticateProtectedPreview, finishProtectedPreview } from "./preview-auth";

const affectedRoutes = [
  "/",
  "/es",
  "/contact",
  "/es/contacto",
  "/services",
  "/es/servicios",
  "/for-patients",
  "/es/para-pacientes",
  "/telepsychiatry-florida",
  "/es/telepsiquiatria-florida",
  "/billing-policy",
  "/es/politica-facturacion",
  "/locations/psychiatrist-naples",
  "/es/ubicaciones/psiquiatra-naples",
  "/locations/psychiatrist-bonita-springs",
  "/es/ubicaciones/psiquiatra-bonita-springs",
  "/locations/psychiatrist-marco-island",
  "/es/ubicaciones/psiquiatra-marco-island",
  "/locations/psychiatrist-estero",
  "/es/ubicaciones/psiquiatra-estero",
  "/locations/psychiatrist-golden-gate",
  "/es/ubicaciones/psiquiatra-golden-gate",
  "/locations/psychiatrist-immokalee",
  "/es/ubicaciones/psiquiatra-immokalee",
  "/locations/psychiatrist-vanderbilt-beach",
  "/es/ubicaciones/psiquiatra-vanderbilt-beach",
  "/locations/psychiatrist-ave-maria",
  "/es/ubicaciones/psiquiatra-ave-maria",
  "/locations/psychiatrist-fort-myers",
  "/es/ubicaciones/psiquiatra-fort-myers",
  "/locations/psychiatrist-lely-resort",
  "/es/ubicaciones/psiquiatra-lely-resort",
  "/services/anxiety-treatment",
  "/es/servicios/tratamiento-ansiedad",
  "/services/depression-treatment",
  "/es/servicios/tratamiento-depresion",
  "/services/ptsd-treatment",
  "/es/servicios/tratamiento-tept",
  "/services/bipolar-treatment",
  "/es/servicios/tratamiento-bipolar",
  "/services/medication-management",
  "/es/servicios/manejo-medicamentos",
] as const;

const unsupportedCarrierPattern = /\b(?:Aetna|Cigna|United\s*Healthcare|UHC|Medicare(?:\s+Advantage)?|Medicaid|WellCare|Ambetter|AvMed|CHAMPVA|Sunshine\s+Health|First\s+Health|Oscar\s+Health|Doctors\s+Healthcare|TRICARE|Florida\s*Blue|Blue\s*Cross\s*Blue\s*Shield)\b/i;
const unsupportedBroadClaimPattern = /most major insurance|major commercial insurance|insurance (?:plans? )?accepted|accepted insurance|tele(?:health|psychiatry)[^.]{0,80}covered|covered[^.]{0,80}same as in-person|payment plans? (?:are )?available|la mayor[ií]a de (?:los )?(?:principales )?planes de seguro|seguros? (?:m[eé]dicos )?aceptados|tele(?:salud|psiquiatr[ií]a)[^.]{0,80}cubiert[ao]s?|planes? de pago (?:flexibles )?(?:est[aá]n )?disponibles/i;
const retiredLogoRequestPattern = /(?:insurance-(?:aetna|ambetter|cigna|medicare|medicaid|first-health|champva|sunshine|avmed|wellcare)|(?:3|8|10)_175586827679[78])/i;

test.beforeEach(async ({ page }) => {
  await authenticateProtectedPreview(page);
});

test.afterEach(async ({ page }) => {
  await finishProtectedPreview(page);
});

async function rejectConsentIfVisible(page: Page) {
  const reject = page.getByTestId("button-reject-all");
  if (await reject.isVisible().catch(() => false)) {
    await reject.click();
    await expect(reject).toBeHidden();
  }
}

test("carrier claims and logos are absent from every affected English and Spanish journey", async ({ page }) => {
  const runtimeErrors: string[] = [];
  const carrierLogoRequests: string[] = [];

  page.on("pageerror", (error) => runtimeErrors.push(error.stack || error.message));
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });
  page.on("request", (request) => {
    if (retiredLogoRequestPattern.test(decodeURIComponent(request.url()))) {
      carrierLogoRequests.push(request.url());
    }
  });

  for (const pathname of affectedRoutes) {
    const response = await page.goto(pathname, { waitUntil: "domcontentloaded" });
    expect(response?.status(), `${pathname} should load successfully`).toBe(200);
    await rejectConsentIfVisible(page);

    const html = await page.content();
    expect(html, `${pathname} named carrier`).not.toMatch(unsupportedCarrierPattern);
    expect(html, `${pathname} broad insurance promise`).not.toMatch(unsupportedBroadClaimPattern);

    const expectedSha = process.env.E2E_EXPECTED_SHA?.trim();
    if (expectedSha) {
      await expect(page.locator('meta[name="healing-build-sha"]')).toHaveAttribute("content", expectedSha);
    }
  }

  expect(carrierLogoRequests, "carrier logo network requests").toEqual([]);
  expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
});

test("neutral guidance is visible on home, contact, telehealth and every location", async ({ page }) => {
  const guidanceRoutes = [
    ["/", "insurance-billing-guidance"],
    ["/es", "insurance-billing-guidance"],
    ["/contact", "contact-insurance-billing-guidance"],
    ["/es/contacto", "contact-insurance-billing-guidance"],
    ["/telepsychiatry-florida", "insurance-billing-guidance"],
    ["/es/telepsiquiatria-florida", "insurance-billing-guidance"],
    ...affectedRoutes
      .filter((pathname) => pathname.includes("/locations/") || pathname.includes("/ubicaciones/"))
      .map((pathname) => [pathname, "location-insurance-billing-guidance"] as const),
  ] as const;

  for (const [pathname, testId] of guidanceRoutes) {
    await page.goto(pathname, { waitUntil: "domcontentloaded" });
    await rejectConsentIfVisible(page);
    const guidance = page.getByTestId(testId);
    await guidance.scrollIntoViewIfNeeded();
    await expect(guidance, pathname).toBeVisible();
    await expect(guidance.locator("img"), `${pathname} carrier images`).toHaveCount(0);
  }
});
