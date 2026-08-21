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
  await expect(page.getByRole("heading", { name: "Archive fixture article 1" })).toBeVisible();

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

test("Production keeps the deterministic blog archive fixture private", async ({ request }) => {
  test.skip(!isPublicProductionTarget, "Production-only fixture boundary");
  const response = await request.get("/e2e-fixtures/blog-archive?language=en", {
    headers: { "x-e2e-blog-fixtures": "1" },
  });
  expect(response.status()).toBe(404);
});
