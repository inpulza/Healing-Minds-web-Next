#!/usr/bin/env node
import { existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright';

import { leerArgs, fail, pass } from '../_lib/salida.mjs';
import { sha256 } from './_lib/integrity-ledger.mjs';
import {
  analyzeNoiseCalibration,
  writeCalibrationArtifacts,
} from './_lib/noise-calibration.mjs';

const args = leerArgs();
const url = String(args.url ?? '');
const selector = String(args.selector ?? '');
const sectionId = String(args.section ?? (selector.replace(/[^a-z0-9-]+/gi, '-').replace(/^-+|-+$/g, '') || 'section'));
const viewportWidths = String(args.viewports ?? '390,768,1440').split(',').map(Number).filter(Number.isFinite);
const viewportHeight = Number(args.height ?? 900);
const repetitions = Number(args.repetitions ?? 5);
const states = String(args.states ?? 'initial,hover,scroll-slow,scroll-fast').split(',').map((value) => value.trim()).filter(Boolean);
const owner = String(args.owner ?? '');
const pilotRoot = args['pilot-root'] ? resolve(String(args['pilot-root'])) : null;
const outDir = resolve(String(args['out-dir'] ?? (pilotRoot
  ? join(pilotRoot, 'audit-baseline', 'calibration')
  : join('_arnes', 'native-reconstruction', 'calibration'))));
const frozenArtifacts = ['calibration-runs.json', 'calibration-matrix.json', 'calibration-freeze.json']
  .map((name) => join(outDir, name));

const allowedStates = new Set(['initial', 'hover', 'focus', 'scroll-slow', 'scroll-fast']);
if (!/^https?:\/\//.test(url)) {
  fail('Falta --url=http(s)://...');
  process.exit(2);
}
if (!selector) {
  fail('Falta --selector para la region calibrada');
  process.exit(2);
}
if (!owner) {
  fail('Falta --owner para asignar las tolerancias');
  process.exit(2);
}
if (!Number.isInteger(repetitions) || repetitions < 5) {
  fail('--repetitions debe ser un entero >= 5');
  process.exit(2);
}
if (!viewportWidths.length || viewportWidths.some((width) => width < 240)) {
  fail('--viewports debe contener anchos validos');
  process.exit(2);
}
for (const state of states) {
  if (!allowedStates.has(state)) {
    fail(`Estado de calibracion no soportado: ${state}`);
    process.exit(2);
  }
}
if (frozenArtifacts.some(existsSync)) {
  fail(`La calibracion ya contiene artefactos congelados: ${outDir}`);
  process.exit(2);
}

const screenshotDir = join(outDir, 'screenshots');
mkdirSync(screenshotDir, { recursive: true });

function numeric(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

async function rootMetrics(page) {
  return page.locator(selector).first().evaluate((root) => {
    const style = getComputedStyle(root);
    const rect = root.getBoundingClientRect();
    const animations = document.getAnimations().filter((animation) => {
      const target = animation.effect?.target;
      return target && (target === root || root.contains(target));
    });
    return {
      geometry: {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      },
      typography: {
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
        letterSpacing: style.letterSpacing,
      },
      fonts: {
        status: document.fonts?.status ?? 'unsupported',
      },
      animations: {
        count: animations.length,
        activeCount: animations.filter((animation) => animation.playState === 'running' || animation.playState === 'pending').length,
        playStates: animations.map((animation) => animation.playState).sort(),
      },
      actualScrollY: scrollY,
    };
  });
}

async function findInteractionTarget(page) {
  const root = page.locator(selector).first();
  const preferred = root.locator('[data-calibration-target], a[href], button, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])').first();
  return await preferred.count() ? preferred : root;
}

async function calibratePage({ browser, width, state, repetition, samples }) {
  const viewport = { width, height: viewportHeight, label: `${width}x${viewportHeight}` };
  const context = await browser.newContext({ viewport: { width, height: viewportHeight } });
  const page = await context.newPage();
  const requests = [];
  page.on('request', (request) => {
    try {
      const parsed = new URL(request.url());
      requests.push({ url: parsed.href, host: parsed.host, resourceType: request.resourceType() });
    } catch {}
  });
  const navigationStarted = performance.now();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});
  const navigationMs = performance.now() - navigationStarted;
  const fontsStarted = performance.now();
  await page.evaluate(() => document.fonts?.ready ?? Promise.resolve());
  const fontsReadyMs = performance.now() - fontsStarted;
  const root = page.locator(selector).first();
  if (!await root.count()) throw new Error(`section not found: ${selector}`);
  const absoluteTop = await root.evaluate((element) => element.getBoundingClientRect().top + scrollY);
  const baseY = Math.max(0, Math.round(absoluteTop - viewportHeight * 0.25));

  await page.evaluate((y) => scrollTo(0, y), baseY);
  await page.mouse.move(0, 0);
  await page.evaluate(() => document.activeElement?.blur?.());
  await page.waitForTimeout(120);
  let requestedY = baseY;
  let interaction = { type: 'none', target: selector };
  const stateStarted = performance.now();
  if (state === 'hover') {
    const target = await findInteractionTarget(page);
    await target.hover({ timeout: 3_000 });
    interaction = { type: 'hover', target: await target.evaluate((element) => element.id || element.tagName.toLowerCase()) };
  }
  if (state === 'focus') {
    const target = await findInteractionTarget(page);
    await target.focus({ timeout: 3_000 });
    interaction = { type: 'focus', target: await target.evaluate((element) => element.id || element.tagName.toLowerCase()) };
  }
  if (state === 'scroll-slow') {
    requestedY = baseY + 180;
    await page.mouse.wheel(0, 180);
    interaction = { type: 'wheel', deltaY: 180 };
  }
  if (state === 'scroll-fast') {
    requestedY = baseY + 760;
    await page.mouse.wheel(0, 760);
    interaction = { type: 'wheel', deltaY: 760 };
  }
  await page.waitForTimeout(260);
  const settleMs = performance.now() - stateStarted;
  const screenshot = join(screenshotDir, `${sectionId}-${viewport.label}-${state}-r${String(repetition).padStart(2, '0')}.png`);
  await page.screenshot({ path: screenshot, fullPage: false, animations: 'allow' });
  const metrics = await rootMetrics(page);
  const uniqueRequests = [...new Set(requests.map((request) => request.url))].sort();
  const hosts = [...new Set(requests.map((request) => request.host))].sort();
  samples.push({
    sampleId: `${viewport.label}-${state}-r${repetition}`,
    repetition,
    state,
    viewport,
    region: { type: 'viewport', sectionId, selector },
    screenshot: resolve(screenshot),
    geometry: metrics.geometry,
    typography: {
      fontFamily: metrics.typography.fontFamily,
      fontSizePx: numeric(metrics.typography.fontSize),
      fontWeight: metrics.typography.fontWeight,
      lineHeightPx: numeric(metrics.typography.lineHeight),
      letterSpacingPx: numeric(metrics.typography.letterSpacing),
    },
    timing: { navigationMs, fontsReadyMs, settleMs },
    scroll: {
      mode: state.startsWith('scroll-') ? state : 'positioned',
      requestedY,
      actualY: metrics.actualScrollY,
    },
    interaction,
    fonts: metrics.fonts,
    animations: metrics.animations,
    network: {
      requestCount: requests.length,
      uniqueRequestCount: uniqueRequests.length,
      hosts,
      signature: sha256(JSON.stringify(uniqueRequests)),
    },
  });
  await context.close();
}

const browser = await chromium.launch();
const samples = [];
try {
  for (const width of viewportWidths) {
    for (const state of states) {
      for (let repetition = 1; repetition <= repetitions; repetition += 1) {
        await calibratePage({ browser, width, state, repetition, samples });
      }
    }
  }
  const matrix = analyzeNoiseCalibration({
    samples,
    minimumRepetitions: repetitions,
    owner,
    calibrationId: `noise-${sectionId}-${Date.now()}`,
  });
  const artifacts = writeCalibrationArtifacts({ outDir, samples, matrix, pilotRoot });
  await browser.close();
  console.log(JSON.stringify({ verdict: matrix.verdict, matrix, artifacts }, null, 2));
  if (matrix.verdict !== 'PASS') {
    fail(matrix.failures.join('; '));
    process.exit(1);
  }
  pass(`NR-04 ${sectionId}: ${matrix.cellCount} celdas, ${matrix.sampleCount} muestras`);
} catch (error) {
  await browser.close().catch(() => {});
  fail(`NR-04 fallo: ${error.message}`);
  process.exit(1);
}
