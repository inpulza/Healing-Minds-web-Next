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

  const openWhenReady = async (page, pathname) => {
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

  const visibleH1s = (page) => page.locator("h1").evaluateAll((elements) => elements
    .filter((element) => Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length))
    .map((element) => ({ text: element.textContent?.trim(), testId: element.getAttribute("data-testid") })));

  const revealLazyContact = async (page, label) => {
    const contactTitle = page.getByTestId("contact-title");

    // Every section above Contact mounts through IntersectionObserver and can
    // increase scrollHeight after an earlier jump reached the old bottom. Keep
    // moving to the current bottom for the whole bounded window; a passive
    // wait cannot reveal a boundary that never entered the viewport.
    for (let attempt = 0; attempt < 60 && (await contactTitle.count()) === 0; attempt += 1) {
      await page.evaluate(() => window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "instant",
      }));
      await page.waitForTimeout(250);
    }

    assert.equal(
      await contactTitle.count(),
      1,
      `${label}: lazy Contact did not mount after the bounded scroll sweep`,
    );
    // React can replace the just-mounted lazy boundary while hydration settles.
    // Resolve the locator again inside a bounded retry instead of treating that
    // short detach as a product failure.
    for (let attempt = 0; attempt < 20; attempt += 1) {
      try {
        await contactTitle.scrollIntoViewIfNeeded({ timeout: 1_000 });
        await contactTitle.waitFor({ state: "visible", timeout: 1_000 });
        return contactTitle;
      } catch (error) {
        if (!/not attached|detached/i.test(error.message)) throw error;
        await page.waitForTimeout(100);
      }
    }
    throw new Error(`${label}: Contact detached repeatedly while hydration settled`);
  };

  for (const pathname of ["/", "/es"]) {
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport });
      try {
        console.log(`[heading-smoke] checking ${pathname} at ${viewport.width}px`);
        const response = await openWhenReady(page, pathname);
        assert.equal(response.status(), 200);
        const contactTitle = await revealLazyContact(
          page,
          `${pathname} ${viewport.width}px`,
        );
        assert.equal(await contactTitle.evaluate((element) => element.tagName), "H2");
        await page.getByTestId("hero-title").waitFor({ state: "visible" });
        const headings = await visibleH1s(page);
        assert.equal(await page.locator("h1").count(), 1, `${pathname} ${viewport.width}px has extra H1 elements`);
        assert.deepEqual(headings.map((heading) => heading.testId), ["hero-title"], `${pathname} ${viewport.width}px: ${JSON.stringify(headings)}`);
      } finally {
        await page.close();
      }
    }
  }

  for (const pathname of ["/contact", "/es/contacto"]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    try {
      console.log(`[heading-smoke] checking ${pathname}`);
      const response = await openWhenReady(page, pathname);
      assert.equal(response.status(), 200);
      const contactTitle = page.getByTestId("contact-title");
      await contactTitle.waitFor({ state: "visible", timeout: 10_000 });
      assert.equal(await contactTitle.evaluate((element) => element.tagName), "H1");
      const headings = await visibleH1s(page);
      assert.equal(await page.locator("h1").count(), 1, `${pathname} has extra H1 elements`);
      assert.deepEqual(headings.map((heading) => heading.testId), ["contact-title"], `${pathname}: ${JSON.stringify(headings)}`);
    } finally {
      await page.close();
    }
  }

  for (const [pathname, loadingText] of [["/", "Loading map..."], ["/es", "Cargando mapa..."]]) {
    const mapPage = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    try {
      console.log(`[heading-smoke] checking map load on ${pathname}`);
      const response = await openWhenReady(mapPage, pathname);
      assert.equal(response.status(), 200);
      await revealLazyContact(mapPage, `${pathname} map smoke`);
      await mapPage.getByText(loadingText).waitFor({ state: "hidden", timeout: 12_000 });
    } finally {
      await mapPage.close();
    }
  }

  const fallbackPage = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  let releaseHeldMap;
  let markHeldMapStarted;
  const heldMapStarted = new Promise((resolve) => { markHeldMapStarted = resolve; });
  await fallbackPage.route(/^https:\/\/www\.google\.com\/maps\/embed\?/, async (route) => {
    markHeldMapStarted();
    await new Promise((release) => { releaseHeldMap = release; });
    await route.abort();
  });
  try {
    console.log("[heading-smoke] checking held-map fallback");
    const response = await openWhenReady(fallbackPage, "/");
    assert.equal(response.status(), 200);
    await revealLazyContact(fallbackPage, "/ held-map smoke");
    const loadingOverlay = fallbackPage.getByTestId("google-maps-loading-contact");
    await loadingOverlay.waitFor({ state: "visible", timeout: 5_000 });
    await fallbackPage.getByTestId("google-maps-contact").scrollIntoViewIfNeeded();
    await Promise.race([
      heldMapStarted,
      new Promise((_, reject) => setTimeout(() => reject(new Error("Google Maps request was not held")), 5_000)),
    ]);
    await loadingOverlay.waitFor({ state: "hidden", timeout: 12_000 });
    const iframe = fallbackPage.getByTestId("iframe-google-maps-contact");
    assert.equal(await iframe.count(), 1);
    await fallbackPage.waitForFunction(
      () => getComputedStyle(document.querySelector('[data-testid="iframe-google-maps-contact"]')).opacity === "1",
      undefined,
      { timeout: 2_000 },
    );
  } finally {
    releaseHeldMap?.();
    await fallbackPage.unrouteAll({ behavior: "ignoreErrors" });
    await fallbackPage.close();
  }

  console.log("Heading hierarchy and map loading smokes passed for EN/ES home and contact pages.");
} finally {
  await browser?.close();
  server.kill();
}
