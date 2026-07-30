#!/usr/bin/env node
// # RUN: node scripts/video-ui-probe.mjs --url=... --selector="#section" --section=id
// Captures a generic interaction film: scroll states, hover, focus, safe click, screenshots, video and trace.
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright';
import { leerArgs, fail, pass } from './_lib/salida.mjs';
import { appendTrace, traceArtifact } from './_lib/trace.mjs';

const args = leerArgs();
const url = String(args.url ?? '');
const selector = args.selector ? String(args.selector) : '';
const anchor = args.anchor ? String(args.anchor) : '';
const sectionId = String(args.section ?? args.label ?? (selector.replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '') || 'section'));
const viewportWidth = Number(args.viewport ?? 768);
const viewportHeight = Number(args.height ?? 900);
const viewportLabel = `${viewportWidth}x${viewportHeight}`;
const outDir = String(args['out-dir'] ?? args.outDir ?? join('_arnes', 'interaction-film', sectionId, viewportLabel));
const trialDir = args['trial-dir'] ? String(args['trial-dir']) : null;
const maxTargets = Number(args['max-targets'] ?? 6);

if (!/^https?:\/\//.test(url)) {
  fail('Falta --url=http(s)://...');
  process.exit(2);
}
if (!selector && !anchor) {
  fail('Falta --selector=... o --anchor=texto visible');
  process.exit(2);
}

mkdirSync(outDir, { recursive: true });

const finder = ({ selector: sel, anchorText }) => {
  const visible = (el) => {
    const rect = el.getBoundingClientRect();
    const st = getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && st.display !== 'none' && st.visibility !== 'hidden';
  };
  if (sel) {
    const match = [...document.querySelectorAll(sel)].find(visible);
    if (match) return match;
  }
  const textMatch = [...document.querySelectorAll('section, article, main > div, body > div')]
    .filter((el) => visible(el) && (el.innerText || el.textContent || '').includes(anchorText))
    .sort((a, b) => b.getBoundingClientRect().width * b.getBoundingClientRect().height -
      a.getBoundingClientRect().width * a.getBoundingClientRect().height)[0];
  return textMatch ?? null;
};

async function metrics(page) {
  return page.evaluate((opts) => {
    const root = (0, eval)(opts.finder)(opts);
    if (!root) return { error: 'section not found' };
    const pick = (el) => {
      const rect = el.getBoundingClientRect();
      const st = getComputedStyle(el);
      return {
        tag: el.tagName.toLowerCase(),
        id: el.id || undefined,
        classes: el.className && typeof el.className === 'string' ? el.className : undefined,
        text: (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 160),
        rect: {
          x: Math.round(rect.x + scrollX),
          y: Math.round(rect.y + scrollY),
          viewportX: Math.round(rect.x),
          viewportY: Math.round(rect.y),
          w: Math.round(rect.width),
          h: Math.round(rect.height),
        },
        style: {
          display: st.display,
          position: st.position,
          opacity: st.opacity,
          color: st.color,
          backgroundColor: st.backgroundColor,
          fontSize: st.fontSize,
          fontWeight: st.fontWeight,
          lineHeight: st.lineHeight,
          borderRadius: st.borderRadius,
          transform: st.transform === 'none' ? undefined : st.transform,
          transition: st.transition === 'all 0s ease 0s' ? undefined : st.transition,
          zIndex: st.zIndex === 'auto' ? undefined : st.zIndex,
        },
      };
    };
    const targets = [...root.querySelectorAll('a[href], button, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])')]
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        const st = getComputedStyle(el);
        return rect.width > 2 && rect.height > 2 && st.display !== 'none' && st.visibility !== 'hidden';
      })
      .slice(0, opts.maxTargets)
      .map((el, index) => ({ index, ...pick(el), href: el.href || undefined, role: el.getAttribute('role') || undefined }));
    return {
      url: location.href,
      viewport: { width: innerWidth, height: innerHeight },
      scrollY: Math.round(scrollY),
      root: pick(root),
      targets,
      bodyClicked: document.body.dataset.clicked || null,
    };
  }, { selector, anchorText: anchor, finder: finder.toString(), maxTargets });
}

async function rootTop(page) {
  return page.evaluate((opts) => {
    const root = (0, eval)(opts.finder)(opts);
    if (!root) return 0;
    return Math.max(0, Math.round(root.getBoundingClientRect().top + scrollY));
  }, { selector, anchorText: anchor, finder: finder.toString() });
}

async function writeStep(page, timeline, step) {
  const shot = join(outDir, `${sectionId}-${viewportLabel}-${step}.png`);
  await page.screenshot({ path: shot, fullPage: false });
  if (trialDir) traceArtifact({ trialDir, path: shot, kind: 'interaction-frame', sectionId, viewport: viewportLabel, state: step });
  timeline.push({ step, screenshot: shot, metrics: await metrics(page) });
}

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: viewportWidth, height: viewportHeight },
  recordVideo: { dir: outDir, size: { width: viewportWidth, height: viewportHeight } },
});
const page = await context.newPage();
const timeline = [];

try {
  if (trialDir) appendTrace({ trialDir, event: 'probe_started', data: { probe: 'interaction-film', sectionId, viewport: viewportLabel, url } });
  await page.addInitScript(() => {
    document.addEventListener('click', (event) => {
      const a = event.target?.closest?.('a[href]');
      if (a) event.preventDefault();
    }, true);
  });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  const top = await rootTop(page);

  await page.evaluate((y) => scrollTo(0, y), Math.max(0, top - viewportHeight));
  await page.waitForTimeout(180);
  await writeStep(page, timeline, 'before-section');

  await page.evaluate((y) => scrollTo(0, y), Math.max(0, top - Math.round(viewportHeight * 0.25)));
  await page.waitForTimeout(220);
  await writeStep(page, timeline, 'section-enter');

  await page.evaluate((opts) => {
    const root = (0, eval)(opts.finder)(opts);
    root?.scrollIntoView({ block: 'center', inline: 'nearest' });
  }, { selector, anchorText: anchor, finder: finder.toString() });
  await page.waitForTimeout(260);
  await writeStep(page, timeline, 'initial');

  const targetCount = (await metrics(page)).targets.length;
  for (let i = 0; i < targetCount; i++) {
    const handle = await page.evaluateHandle((opts) => {
      const root = (0, eval)(opts.finder)(opts);
      if (!root) return null;
      const visible = (el) => {
        const rect = el.getBoundingClientRect();
        const st = getComputedStyle(el);
        return rect.width > 2 && rect.height > 2 && st.display !== 'none' && st.visibility !== 'hidden';
      };
      return [...root.querySelectorAll('a[href], button, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])')]
        .filter(visible)[opts.index] ?? null;
    }, { selector, anchorText: anchor, finder: finder.toString(), index: i });
    const locator = handle.asElement();
    if (!locator) continue;
    if (trialDir) appendTrace({ trialDir, event: 'interaction_started', data: { type: 'hover', targetIndex: i, sectionId, viewport: viewportLabel } });
    await locator.hover({ timeout: 2500 }).catch(() => {});
    await page.waitForTimeout(220);
    await writeStep(page, timeline, `hover-${i}`);
    if (trialDir) appendTrace({ trialDir, event: 'interaction_finished', data: { type: 'hover', targetIndex: i, sectionId, viewport: viewportLabel } });

    if (trialDir) appendTrace({ trialDir, event: 'interaction_started', data: { type: 'focus', targetIndex: i, sectionId, viewport: viewportLabel } });
    await locator.focus({ timeout: 2500 }).catch(() => {});
    await page.waitForTimeout(180);
    await writeStep(page, timeline, `focus-${i}`);
    if (trialDir) appendTrace({ trialDir, event: 'interaction_finished', data: { type: 'focus', targetIndex: i, sectionId, viewport: viewportLabel } });

    if (trialDir) appendTrace({ trialDir, event: 'interaction_started', data: { type: 'click', targetIndex: i, sectionId, viewport: viewportLabel } });
    await locator.click({ timeout: 2500 }).catch(() => {});
    await page.waitForTimeout(180);
    await writeStep(page, timeline, `click-${i}`);
    if (trialDir) appendTrace({ trialDir, event: 'interaction_finished', data: { type: 'click', targetIndex: i, sectionId, viewport: viewportLabel } });
    await handle.dispose();
  }

  await page.mouse.wheel(0, 180);
  await page.waitForTimeout(260);
  await writeStep(page, timeline, 'scroll-slow');

  await page.mouse.wheel(0, 760);
  await page.waitForTimeout(220);
  await writeStep(page, timeline, 'scroll-fast');

  await page.evaluate((y) => scrollTo(0, y), top + viewportHeight);
  await page.waitForTimeout(220);
  await writeStep(page, timeline, 'section-exit');

  await context.close();
  const rawVideo = await page.video()?.path();
  let video = null;
  if (rawVideo && existsSync(rawVideo)) {
    video = resolve(join(outDir, `${sectionId}-${viewportLabel}.webm`));
    copyFileSync(rawVideo, video);
  }
  await browser.close();

  const report = {
    sectionId,
    url,
    selector,
    anchor,
    viewport: { width: viewportWidth, height: viewportHeight, label: viewportLabel },
    createdAt: new Date().toISOString(),
    video,
    timeline,
  };
  const reportPath = join(outDir, 'report.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  if (trialDir) {
    traceArtifact({ trialDir, path: reportPath, kind: 'interaction-report', sectionId, viewport: viewportLabel, state: 'report' });
    if (video) traceArtifact({ trialDir, path: video, kind: 'interaction-video', sectionId, viewport: viewportLabel, state: 'video' });
    appendTrace({ trialDir, event: 'probe_finished', data: { probe: 'interaction-film', sectionId, viewport: viewportLabel, report: reportPath } });
  }
  pass(`interaction-film ${sectionId}@${viewportLabel}: ${resolve(reportPath)}`);
} catch (error) {
  await context.close().catch(() => {});
  await browser.close().catch(() => {});
  if (trialDir) appendTrace({ trialDir, event: 'probe_finished', data: { probe: 'interaction-film', sectionId, viewport: viewportLabel, error: error.message } });
  fail(`interaction-film fallo: ${error.message}`);
  process.exit(1);
}
