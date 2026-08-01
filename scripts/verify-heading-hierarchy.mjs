import assert from "node:assert/strict";
import net from "node:net";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const getAvailablePort = () => new Promise((resolve, reject) => {
  const probe = net.createServer();
  probe.once("error", reject);
  probe.listen(0, "127.0.0.1", () => {
    const address = probe.address();
    const port = typeof address === "object" && address ? address.port : null;
    probe.close((error) => {
      if (error) reject(error);
      else if (port) resolve(port);
      else reject(new Error("Unable to allocate a local verification port."));
    });
  });
});

const port = await getAvailablePort();
const origin = `http://127.0.0.1:${port}`;
const server = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", String(port)],
  { stdio: ["ignore", "pipe", "pipe"] },
);

let stderr = "";
server.stderr.on("data", (chunk) => { stderr += chunk; });

let browser;
try {
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  const openWhenReady = async (pathname) => {
    let lastError;
    for (let attempt = 0; attempt < 60; attempt += 1) {
      if (server.exitCode !== null) throw new Error(`Next exited before verification: ${stderr}`);
      try {
        const response = await page.goto(`${origin}${pathname}`, {
          waitUntil: "domcontentloaded",
          timeout: 5_000,
        });
        if (response) return response;
      } catch (error) {
        lastError = error;
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    }
    throw new Error(`Next did not become ready: ${lastError?.message || stderr}`);
  };

  const visibleH1s = () => page.locator("h1").evaluateAll((elements) => elements
    .filter((element) => Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length))
    .map((element) => ({ text: element.textContent?.trim(), testId: element.getAttribute("data-testid") })));

  for (const pathname of ["/", "/es"]) {
    const response = await openWhenReady(pathname);
    assert.equal(response.status(), 200);
    const contactTitle = page.getByTestId("contact-title");
    for (let attempt = 0; attempt < 12 && (await contactTitle.count()) === 0; attempt += 1) {
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForTimeout(400);
    }
    await contactTitle.waitFor({ state: "visible", timeout: 10_000 });
    assert.equal(await contactTitle.evaluate((element) => element.tagName), "H2");
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      await page.getByTestId("hero-title").waitFor({ state: "visible" });
      const headings = await visibleH1s();
      assert.equal(await page.locator("h1").count(), 1, `${pathname} ${viewport.width}px has extra H1 elements`);
      assert.deepEqual(headings.map((heading) => heading.testId), ["hero-title"], `${pathname} ${viewport.width}px: ${JSON.stringify(headings)}`);
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
  }

  for (const pathname of ["/contact", "/es/contacto"]) {
    const response = await openWhenReady(pathname);
    assert.equal(response.status(), 200);
    const contactTitle = page.getByTestId("contact-title");
    await contactTitle.waitFor({ state: "visible", timeout: 10_000 });
    assert.equal(await contactTitle.evaluate((element) => element.tagName), "H1");
    const headings = await visibleH1s();
    assert.equal(await page.locator("h1").count(), 1, `${pathname} has extra H1 elements`);
    assert.deepEqual(headings.map((heading) => heading.testId), ["contact-title"], `${pathname}: ${JSON.stringify(headings)}`);
  }

  console.log("Heading hierarchy production smoke passed for EN/ES home and contact pages.");
} finally {
  await browser?.close();
  server.kill();
}
