#!/usr/bin/env node
// # RUN: node arnes/scripts/capture-six.mjs --url=https://example.com --dir=_arnes/verify/source-six
// Captura raw diagnóstica + raster recortado comparable + métricas para seis pares WxH.
import { mkdirSync, writeFileSync } from "node:fs";
import { basename, resolve, sep } from "node:path";
import { chromium } from "playwright";
import { PNG } from "pngjs";
import sharp from "sharp";
import { leerArgs, pass, fail } from "./_lib/salida.mjs";

const DEFAULT_VIEWPORTS = "390x844,768x1024,1024x900,1440x900,1920x1080,2560x1440";

function parseViewports(value) {
  const entries = String(value).split(",").map((entry) => entry.trim()).filter(Boolean);
  if (entries.length === 0) throw new Error("la lista de viewports está vacía");

  return entries.map((entry) => {
    const match = /^(\d+)x(\d+)$/i.exec(entry);
    if (!match) throw new Error(`viewport inválido "${entry}"; usa pares WxH (ej. 390x844)`);
    const width = Number(match[1]);
    const height = Number(match[2]);
    if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width <= 0 || height <= 0)
      throw new Error(`viewport inválido "${entry}"; ancho y alto deben ser enteros positivos`);
    return { width, height, pair: `${width}x${height}` };
  });
}

function safeOutputDirectory(value) {
  const output = resolve(String(value));
  const normalized = output.toLowerCase();
  const frozen = `${sep}_arnes${sep}captura`.toLowerCase();
  if (normalized.endsWith(frozen) || normalized.includes(`${frozen}${sep}`))
    throw new Error(`directorio bloqueado: ${output}; _arnes/captura contiene evidencia congelada`);
  return output;
}

function safePrefix(value) {
  const prefix = String(value ?? "source").trim();
  if (!/^[a-z0-9][a-z0-9._-]*$/i.test(prefix))
    throw new Error(`prefijo inválido "${prefix}"`);
  return prefix;
}

async function autoscroll(page) {
  await page.evaluate(async () => {
    await new Promise((finish) => {
      let total = 0;
      const step = () => {
        window.scrollBy(0, 400);
        total += 400;
        if (total >= document.body.scrollHeight) {
          window.scrollTo(0, 0);
          setTimeout(finish, 800);
        } else setTimeout(step, 300);
      };
      step();
    });
  });
}

async function normalizeToViewportWidth(raw, rawMeta, width) {
  if (rawMeta.width < width)
    throw new Error(`PNG raw más estrecho que el viewport: ${rawMeta.width}px < ${width}px`);
  if (rawMeta.width === width) return raw;
  return sharp(raw)
    .extract({ left: 0, top: 0, width, height: rawMeta.height })
    .png()
    .toBuffer();
}

async function main() {
  const args = leerArgs();
  const url = String(args.url ?? "").trim();
  if (!url) throw new Error("falta --url=<URL>");
  try { new URL(url); } catch { throw new Error(`URL inválida "${url}"`); }

  const outputDir = safeOutputDirectory(args.dir ?? "_arnes/verify/source-six");
  const prefix = safePrefix(args.prefix);
  const viewports = parseViewports(args.viewports ?? DEFAULT_VIEWPORTS);
  mkdirSync(outputDir, { recursive: true });

  const browser = await chromium.launch();
  const captures = [];
  try {
    for (const { width, height, pair } of viewports) {
      const page = await browser.newPage({
        viewport: { width, height },
        deviceScaleFactor: 1,
      });
      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
        await autoscroll(page);
        // Capture the settled state after lazy images, maps and reveal animations
        // have had time to complete. The scroll sweep alone is not evidence of
        // final UI state because it can leave transient opacity/placeholders.
        await page.waitForTimeout(Number(args.settle ?? 2_500));

        const pageMetrics = await page.evaluate(() => ({
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
          devicePixelRatio: window.devicePixelRatio,
          htmlClientWidth: document.documentElement.clientWidth,
          htmlScrollWidth: document.documentElement.scrollWidth,
          bodyScrollWidth: document.body.scrollWidth,
          htmlScrollHeight: document.documentElement.scrollHeight,
          bodyScrollHeight: document.body.scrollHeight,
        }));
        if (pageMetrics.innerWidth !== width || pageMetrics.innerHeight !== height || pageMetrics.devicePixelRatio !== 1)
          throw new Error(`viewport mismatch ${pair}: ${JSON.stringify(pageMetrics)}`);

        const raw = await page.screenshot({ fullPage: true });
        const rawPng = PNG.sync.read(raw);
        const comparable = await normalizeToViewportWidth(raw, rawPng, width);
        const comparablePng = PNG.sync.read(comparable);
        if (comparablePng.width !== width)
          throw new Error(`PNG comparable ${pair}: ancho ${comparablePng.width}px != ${width}px`);
        if (comparablePng.height !== rawPng.height)
          throw new Error(`PNG comparable ${pair}: alto ${comparablePng.height}px != raw ${rawPng.height}px`);

        const rawName = `${prefix}-${pair}.raw.png`;
        const comparableName = `${prefix}-${pair}.png`;
        const metricsName = `${prefix}-${pair}.metrics.json`;
        const metrics = {
          url,
          requestedViewport: { width, height },
          page: pageMetrics,
          images: {
            raw: { width: rawPng.width, height: rawPng.height },
            comparable: { width: comparablePng.width, height: comparablePng.height },
          },
          normalization: {
            applied: rawPng.width !== width,
            policy: "crop-right-to-viewport-width",
            crop: { left: 0, top: 0, width, height: rawPng.height },
            removedRightPx: rawPng.width - width,
          },
          files: { raw: rawName, comparable: comparableName, metrics: metricsName },
        };

        writeFileSync(resolve(outputDir, rawName), raw);
        writeFileSync(resolve(outputDir, comparableName), comparable);
        writeFileSync(resolve(outputDir, metricsName), `${JSON.stringify(metrics, null, 2)}\n`);
        captures.push(metrics);
        pass(`${pair}: raw ${rawPng.width}x${rawPng.height} → comparable ${comparablePng.width}x${comparablePng.height}`);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }

  const manifest = {
    schemaVersion: 1,
    url,
    outputDirectory: outputDir,
    prefix,
    captures,
  };
  writeFileSync(resolve(outputDir, "metrics.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  pass(`captura comparable ${captures.length}/${viewports.length} en ${basename(outputDir)}`);
}

main().catch((error) => {
  fail(`captura comparable falló: ${error.message}`);
  process.exitCode = 1;
});
