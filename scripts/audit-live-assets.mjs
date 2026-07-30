import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SOURCE = "https://www.healingmindsp.com";
const CANDIDATE = process.env.CANDIDATE_URL || "http://127.0.0.1:3100";
const OUTPUT = path.resolve("_arnes/evidencia/asset-audit.json");

const sitemap = await fetch(`${SOURCE}/sitemap.xml`).then((response) => response.text());
const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
if (paths.length !== 77) throw new Error(`Expected 77 sitemap routes, received ${paths.length}`);

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const results = new Array(paths.length);
let cursor = 0;

async function worker() {
  const page = await context.newPage();
  while (true) {
    const index = cursor++;
    if (index >= paths.length) break;
    const pathname = paths[index];
    try {
      const response = await page.goto(`${CANDIDATE}${pathname}`, {
        waitUntil: "domcontentloaded",
        timeout: 45_000,
      });
      await page.evaluate(async () => {
        const height = document.documentElement.scrollHeight;
        for (let y = 0; y < height; y += 700) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 60));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(600);
      const images = await page.evaluate(() =>
        Array.from(document.images)
          .filter((image) => image.getAttribute("src") === "[object Object]" || (image.complete && image.naturalWidth === 0))
          .map((image) => ({
            src: image.getAttribute("src"),
            alt: image.alt,
            testId: image.getAttribute("data-testid"),
          })),
      );
      results[index] = { pathname, status: response?.status() ?? null, brokenImages: images };
    } catch (error) {
      results[index] = { pathname, error: error instanceof Error ? error.message : String(error), brokenImages: [] };
    }
  }
  await page.close();
}

await Promise.all(Array.from({ length: 4 }, () => worker()));
await browser.close();

const summary = {
  generatedAt: new Date().toISOString(),
  candidate: CANDIDATE,
  total: results.length,
  httpFailures: results.filter((item) => item.status !== 200).map((item) => ({ pathname: item.pathname, status: item.status })),
  routesWithBrokenImages: results.filter((item) => item.brokenImages.length > 0).map((item) => item.pathname),
  brokenImageCount: results.reduce((sum, item) => sum + item.brokenImages.length, 0),
  errors: results.filter((item) => item.error).map((item) => ({ pathname: item.pathname, error: item.error })),
};
await mkdir(path.dirname(OUTPUT), { recursive: true });
await writeFile(OUTPUT, `${JSON.stringify({ summary, results }, null, 2)}\n`, "utf8");
console.log(JSON.stringify(summary, null, 2));
if (summary.httpFailures.length || summary.brokenImageCount || summary.errors.length) process.exitCode = 1;
