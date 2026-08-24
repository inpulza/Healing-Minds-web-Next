import { expect, test, type Page } from "@playwright/test";
import { authenticateProtectedPreview, finishProtectedPreview } from "./preview-auth";

const deployedHostname = process.env.E2E_BASE_URL
  ? new URL(process.env.E2E_BASE_URL).hostname.toLowerCase()
  : null;
const isPublicProductionTarget = deployedHostname === "www.healingmindsp.com"
  || deployedHostname === "healingmindsp.com";

test.afterEach(async ({ page }) => {
  await finishProtectedPreview(page);
});

function collectRuntimeErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(`pageerror: ${error.message}`));
  page.on("console", message => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  return errors;
}

async function articleHrefs(page: Page, language: "en" | "es"): Promise<string[]> {
  const prefix = language === "es" ? "/es/blog/" : "/blog/";
  return page.locator(`main a[href^="${prefix}"]`).evaluateAll((links, expectedPrefix) =>
    Array.from(new Set(
      links
        .map(link => link.getAttribute("href"))
        .filter((href): href is string => Boolean(href?.startsWith(expectedPrefix))),
    )), prefix);
}

test("the bilingual archive paginates 10+ posts without duplicates and keeps filters crawlable", async ({ page }) => {
  test.skip(isPublicProductionTarget, "The deterministic archive fixture is intentionally unavailable in Production");
  const runtimeErrors = collectRuntimeErrors(page);
  await authenticateProtectedPreview(page, { "x-e2e-blog-fixtures": "1" });

  const firstResponse = await page.goto("/e2e-fixtures/blog-archive?language=en", {
    waitUntil: "domcontentloaded",
  });
  expect(firstResponse?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: "Mental Health Blog" })).toBeVisible();
  await expect(page.getByText("Page 1 of 2", { exact: true })).toBeVisible();
  const englishPageOne = await articleHrefs(page, "en");
  expect(englishPageOne).toHaveLength(9);
  await expect(page.getByRole("heading", { name: "A short wellness guide 1" })).toBeVisible();

  await page.getByRole("link", { name: "Page 2", exact: true }).click();
  await expect(page).toHaveURL(/language=en&page=2$/);
  await expect(page.getByText("Page 2 of 2", { exact: true })).toBeVisible();
  const englishPageTwo = await articleHrefs(page, "en");
  expect(englishPageTwo).toHaveLength(5);
  expect(new Set([...englishPageOne, ...englishPageTwo]).size).toBe(14);

  await page.getByRole("link", { name: "Anxiety Care", exact: true }).click();
  await expect(page).toHaveURL(/language=en&category=anxiety-care$/);
  await expect(page.getByText("Page 1 of 2", { exact: true })).toBeVisible();
  const anxietyPageOne = await articleHrefs(page, "en");
  expect(anxietyPageOne).toHaveLength(9);
  await page.getByRole("link", { name: "Page 2", exact: true }).click();
  await expect(page).toHaveURL(/(?:category=anxiety-care.*page=2|page=2.*category=anxiety-care)/);
  await expect(page.getByText("Page 2 of 2", { exact: true })).toBeVisible();
  const anxietyPageTwo = await articleHrefs(page, "en");
  expect(anxietyPageTwo).toHaveLength(1);
  expect(new Set([...anxietyPageOne, ...anxietyPageTwo]).size).toBe(10);

  await page.goto("/e2e-fixtures/blog-archive?language=es", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Blog de Salud Mental" })).toBeVisible();
  await expect(page.getByText("Pagina 1 de 2", { exact: true })).toBeVisible();
  const spanishPageOne = await articleHrefs(page, "es");
  await page.getByRole("link", { name: "Pagina 2", exact: true }).click();
  await expect(page).toHaveURL(/language=es.*page=2|page=2.*language=es/);
  await expect(page.getByText("Pagina 2 de 2", { exact: true })).toBeVisible();
  const spanishPageTwo = await articleHrefs(page, "es");
  expect(new Set([...spanishPageOne, ...spanishPageTwo]).size).toBe(12);
  expect([...spanishPageOne, ...spanishPageTwo].every(href => href.startsWith("/es/blog/es-"))).toBe(true);

  await page.goto("/e2e-fixtures/blog-archive?language=es&category=missing-category", {
    waitUntil: "domcontentloaded",
  });
  await expect(page.getByText("Todavia no hay articulos publicados.", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Todos los Articulos", exact: true })).toBeVisible();
  expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
});

test("the bilingual archive keeps metadata rows deliberate and card CTAs bottom-aligned", async ({ page }) => {
  test.skip(isPublicProductionTarget, "The deterministic archive fixture is intentionally unavailable in Production");
  const runtimeErrors = collectRuntimeErrors(page);
  await authenticateProtectedPreview(page, { "x-e2e-blog-fixtures": "1" });

  for (const language of ["en", "es"] as const) {
    await page.goto(`/e2e-fixtures/blog-archive?language=${language}`, {
      waitUntil: "domcontentloaded",
    });

    const cards = page.locator('[data-blog-card="regular"]');
    await expect(cards).toHaveCount(8);
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    await page.waitForTimeout(250);

    const contentLengths = await cards.locator("[data-blog-card-title]").evaluateAll(headings =>
      headings.slice(0, 3).map(heading => heading.textContent?.trim().length || 0),
    );
    expect(Math.max(...contentLengths) - Math.min(...contentLengths)).toBeGreaterThan(30);

    const cardsToInspect = Math.min(3, await cards.count());
    for (let index = 0; index < cardsToInspect; index += 1) {
      const card = cards.nth(index);
      const primaryMetadata = await card.locator("[data-blog-card-meta-primary]").boundingBox();
      const readingMetadata = await card.locator("[data-blog-card-meta-reading]").boundingBox();
      const title = await card.locator("[data-blog-card-title]").boundingBox();
      const excerpt = await card.locator("[data-blog-card-excerpt]").boundingBox();
      const cta = await card.locator("[data-blog-card-cta]").boundingBox();

      expect(primaryMetadata).not.toBeNull();
      expect(readingMetadata).not.toBeNull();
      expect(title).not.toBeNull();
      expect(excerpt).not.toBeNull();
      expect(cta).not.toBeNull();
      expect(readingMetadata!.y).toBeGreaterThanOrEqual(primaryMetadata!.y + primaryMetadata!.height - 1);
      expect(title!.y).toBeGreaterThanOrEqual(readingMetadata!.y + readingMetadata!.height - 1);
      expect(excerpt!.y).toBeGreaterThanOrEqual(title!.y + title!.height - 1);
      expect(cta!.y).toBeGreaterThanOrEqual(excerpt!.y + excerpt!.height - 1);
      expect(await card.locator("[data-blog-card-meta-primary]").evaluate(element =>
        element.scrollWidth <= element.clientWidth,
      )).toBe(true);
    }

    const viewportWidth = page.viewportSize()?.width || 0;
    const cardsInFirstRow = viewportWidth >= 1024 ? 3 : viewportWidth >= 768 ? 2 : 1;
    const geometry = [];
    for (let index = 0; index < cardsInFirstRow; index += 1) {
      const cardBox = await cards.nth(index).boundingBox();
      const ctaBox = await cards.nth(index).locator("[data-blog-card-cta]").boundingBox();
      expect(cardBox).not.toBeNull();
      expect(ctaBox).not.toBeNull();
      geometry.push({
        ctaTop: ctaBox!.y,
        bottomInset: cardBox!.y + cardBox!.height - (ctaBox!.y + ctaBox!.height),
      });
    }

    expect(geometry.every(item => item.bottomInset >= 20 && item.bottomInset <= 30)).toBe(true);
    expect(Math.max(...geometry.map(item => item.bottomInset)) - Math.min(...geometry.map(item => item.bottomInset))).toBeLessThanOrEqual(1);
    if (cardsInFirstRow > 1) {
      expect(Math.max(...geometry.map(item => item.ctaTop)) - Math.min(...geometry.map(item => item.ctaTop))).toBeLessThanOrEqual(1);
    }
  }

  expect(runtimeErrors, runtimeErrors.join("\n\n")).toEqual([]);
});

test("Production keeps the deterministic blog archive fixture private", async ({ request }) => {
  test.skip(!isPublicProductionTarget, "Production-only fixture boundary");
  const response = await request.get("/e2e-fixtures/blog-archive?language=en", {
    headers: { "x-e2e-blog-fixtures": "1" },
  });
  expect(response.status()).toBe(404);
});
