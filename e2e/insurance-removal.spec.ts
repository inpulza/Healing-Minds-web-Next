import { expect, test, type Page } from "@playwright/test";
import {
  authenticateProtectedPreview,
  finishProtectedPreview,
  protectedPreviewHeaders,
} from "./preview-auth";

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

const unsupportedCarrierPattern = /\b(?:Florida\s*Blue|Blue\s*Cross(?:\s*Blue\s*Shield)?|BCBS)\b/i;
const unsupportedBroadClaimPattern = /most major insurance|major commercial insurance|tele(?:health|psychiatry)[^.]{0,80}covered|covered[^.]{0,80}same as in-person|payment plans? (?:are )?available|la mayor[ií]a de (?:los )?(?:principales )?planes de seguro|tele(?:salud|psiquiatr[ií]a)[^.]{0,80}cubiert[ao]s?|planes? de pago (?:flexibles )?(?:est[aá]n )?disponibles/i;
const retiredLogoRequestPattern = /(?:insurance-florida-blue|6_1755868276798)/i;
const approvedPlanCount = 14;

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

test("Florida Blue and BCBS remain absent from every affected English and Spanish journey", async ({ page }) => {
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
    expect(html, `${pathname} unsupported carrier`).not.toMatch(unsupportedCarrierPattern);
    expect(html, `${pathname} broad insurance promise`).not.toMatch(unsupportedBroadClaimPattern);

    const expectedSha = process.env.E2E_EXPECTED_SHA?.trim();
    if (expectedSha) {
      await expect(page.locator('meta[name="healing-build-sha"]')).toHaveAttribute("content", expectedSha);
    }
  }

  expect(carrierLogoRequests, "retired Florida Blue logo network requests").toEqual([]);
  expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
});

test("approved galleries and conservative guidance are visible on home, contact, telehealth and every location", async ({ page, request }, testInfo) => {
  test.setTimeout(120_000);

  const galleryRoutes = [
    ["/", "insurance-billing-guidance", "accepted-insurance-gallery"],
    ["/es", "insurance-billing-guidance", "accepted-insurance-gallery"],
    ["/contact", "contact-insurance-billing-guidance", "contact-accepted-insurance-gallery"],
    ["/es/contacto", "contact-insurance-billing-guidance", "contact-accepted-insurance-gallery"],
    ["/telepsychiatry-florida", "insurance-billing-guidance", "accepted-insurance-gallery"],
    ["/es/telepsiquiatria-florida", "insurance-billing-guidance", "accepted-insurance-gallery"],
    ...affectedRoutes
      .filter((pathname) => pathname.includes("/locations/") || pathname.includes("/ubicaciones/"))
      .map((pathname) => [pathname, "location-insurance-billing-guidance", "location-accepted-insurance-gallery"] as const),
  ] as const;

  for (const [pathname, guidanceTestId, galleryTestId] of galleryRoutes) {
    const initialResponse = await request.get(pathname, {
      headers: protectedPreviewHeaders(),
    });
    expect(initialResponse.status(), `${pathname} initial HTML`).toBe(200);
    const initialHtml = await initialResponse.text();
    expect(initialHtml, `${pathname} SSR guidance`).toContain(`data-testid="${guidanceTestId}"`);
    expect(initialHtml, `${pathname} SSR gallery`).toContain(`data-testid="${galleryTestId}"`);
    expect(initialHtml, `${pathname} SSR unsupported carrier`).not.toMatch(unsupportedCarrierPattern);

    await page.goto(pathname, { waitUntil: "domcontentloaded" });
    await rejectConsentIfVisible(page);
    const guidance = page.getByTestId(guidanceTestId);
    await guidance.scrollIntoViewIfNeeded();
    await expect(guidance, pathname).toBeVisible();
    const gallery = page.getByTestId(galleryTestId);
    await expect(gallery, `${pathname} gallery`).toBeVisible();
    await gallery.scrollIntoViewIfNeeded();
    await expect(gallery).toHaveAttribute("data-plan-count", String(approvedPlanCount));
    const images = gallery.locator("img");
    if (testInfo.project.name === "desktop-chromium") {
      await expect(images, `${pathname} approved logos`).toHaveCount(approvedPlanCount);
    } else {
      await expect.poll(() => images.count(), { message: `${pathname} active mobile logos` }).toBeGreaterThanOrEqual(2);
      await expect.poll(
        () => images.evaluateAll((logos: HTMLImageElement[]) => logos.filter((logo) => logo.naturalWidth > 0).length),
        { message: `${pathname} mobile carousel logos loaded` },
      ).toBeGreaterThanOrEqual(2);

      if (pathname === "/" || pathname === "/es") {
        const pauseButton = gallery.getByRole("button", {
          name: pathname === "/" ? "Pause logo rotation" : "Pausar rotación de logotipos",
        });
        await expect(pauseButton).toBeVisible();
        await pauseButton.click();
        await expect(gallery.getByRole("button", {
          name: pathname === "/" ? "Resume logo rotation" : "Reanudar rotación de logotipos",
        })).toBeVisible();
      }
    }
    await expect.poll(async () => images.first().evaluate((image: HTMLImageElement) => image.naturalWidth), {
      message: `${pathname} first approved logo loaded`,
    }).toBeGreaterThan(0);
    await expect(gallery).not.toContainText(unsupportedCarrierPattern);
  }
});

test("reduced-motion users can inspect every approved mobile logo without animation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await rejectConsentIfVisible(page);

  const carousel = page.getByTestId("mobile-insurance-carousel");
  await expect(carousel).toHaveAttribute("data-reduced-motion", "static");
  const logoItems = carousel.locator('[data-testid^="insurance-logo-"]');
  await expect(logoItems).toHaveCount(approvedPlanCount);
  for (let index = 0; index < approvedPlanCount; index += 1) {
    const item = logoItems.nth(index);
    await item.scrollIntoViewIfNeeded();
    const image = item.locator("img");
    await expect(image).toBeVisible();
    await expect.poll(() => image.evaluate((logo: HTMLImageElement) => logo.naturalWidth)).toBeGreaterThan(0);
  }
  await expect(carousel.getByRole("button", { name: "Pause logo rotation" })).toHaveCount(0);
});

test("sticky navigation does not cover insurance headings after section navigation", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "one deterministic viewport matrix is sufficient");
  test.setTimeout(90_000);

  const routes = [
    ["/", "insurance-billing-guidance"],
    ["/es", "insurance-billing-guidance"],
    ["/contact", "contact-insurance-billing-guidance"],
    ["/es/contacto", "contact-insurance-billing-guidance"],
    ["/locations/psychiatrist-naples", "location-insurance-billing-guidance"],
    ["/es/ubicaciones/psiquiatra-naples", "location-insurance-billing-guidance"],
  ] as const;

  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    for (const [pathname, sectionTestId] of routes) {
      await page.goto(pathname, { waitUntil: "domcontentloaded" });
      await rejectConsentIfVisible(page);
      const section = page.getByTestId(sectionTestId);
      await section.evaluate((element) => element.scrollIntoView({ block: "start" }));

      const headerBox = await page.locator("header").boundingBox();
      const headingBox = await section.locator("h2, h3").first().boundingBox();
      expect(headerBox, `${pathname} ${viewport.width}px header`).not.toBeNull();
      expect(headingBox, `${pathname} ${viewport.width}px insurance heading`).not.toBeNull();
      expect(headingBox!.y, `${pathname} ${viewport.width}px sticky overlap`).toBeGreaterThanOrEqual(
        headerBox!.y + headerBox!.height - 1,
      );
    }
  }
});
