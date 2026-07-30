#!/usr/bin/env node
// # RUN: node scripts/seam-probe.mjs --url=... --selector="#section" --section=id
// Captures how the target section joins the previous and next visible sections.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright';
import { leerArgs, fail, pass } from './_lib/salida.mjs';
import { appendTrace, traceArtifact } from './_lib/trace.mjs';

const args = leerArgs();
const url = String(args.url ?? '');
const selector = args.selector ? String(args.selector) : '';
const anchor = args.anchor ? String(args.anchor) : '';
const sectionId = String(args.section ?? (selector.replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '') || 'section'));
const viewportWidth = Number(args.viewport ?? 768);
const viewportHeight = Number(args.height ?? 900);
const viewportLabel = `${viewportWidth}x${viewportHeight}`;
const outDir = String(args['out-dir'] ?? join('_arnes', 'seams', sectionId, viewportLabel));
const trialDir = args['trial-dir'] ? String(args['trial-dir']) : null;

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
  return [...document.querySelectorAll('section, article, main > div, body > div')]
    .filter((el) => visible(el) && (el.innerText || el.textContent || '').includes(anchorText))
    .sort((a, b) => b.getBoundingClientRect().width * b.getBoundingClientRect().height -
      a.getBoundingClientRect().width * a.getBoundingClientRect().height)[0] ?? null;
};

function safeNumber(value) {
  return Number.isFinite(value) ? Math.round(value) : null;
}

async function seamData(page) {
  return page.evaluate((opts) => {
    const root = (0, eval)(opts.finder)(opts);
    if (!root) return null;
    const visible = (el) => {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      const st = getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && st.display !== 'none' && st.visibility !== 'hidden';
    };
    const previous = (() => {
      let el = root.previousElementSibling;
      while (el && !visible(el)) el = el.previousElementSibling;
      return el;
    })();
    const next = (() => {
      let el = root.nextElementSibling;
      while (el && !visible(el)) el = el.nextElementSibling;
      return el;
    })();
    const pick = (el) => {
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const st = getComputedStyle(el);
      return {
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        classes: el.className && typeof el.className === 'string' ? el.className : null,
        text: (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120),
        rect: {
          x: Math.round(rect.x + scrollX),
          y: Math.round(rect.y + scrollY),
          viewportX: Math.round(rect.x),
          viewportY: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          top: Math.round(rect.top + scrollY),
          bottom: Math.round(rect.bottom + scrollY),
        },
        style: {
          marginTop: st.marginTop,
          marginBottom: st.marginBottom,
          paddingTop: st.paddingTop,
          paddingBottom: st.paddingBottom,
          position: st.position,
          zIndex: st.zIndex,
          backgroundColor: st.backgroundColor,
          transform: st.transform === 'none' ? null : st.transform,
        },
      };
    };
    const rootData = pick(root);
    const previousData = pick(previous);
    const nextData = pick(next);
    const beforeGap = previousData ? rootData.rect.top - previousData.rect.bottom : null;
    const afterGap = nextData ? nextData.rect.top - rootData.rect.bottom : null;
    return {
      root: rootData,
      previous: previousData,
      next: nextData,
      beforeRelation: previousData ? {
        gapPx: Math.round(beforeGap),
        overlapPx: Math.max(0, Math.round(-beforeGap)),
      } : null,
      afterRelation: nextData ? {
        gapPx: Math.round(afterGap),
        overlapPx: Math.max(0, Math.round(-afterGap)),
      } : null,
      viewport: { width: innerWidth, height: innerHeight },
      scrollY: Math.round(scrollY),
    };
  }, { selector, anchorText: anchor, finder: finder.toString() });
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: viewportWidth, height: viewportHeight } });

try {
  if (trialDir) appendTrace({ trialDir, event: 'probe_started', data: { probe: 'seams', sectionId, viewport: viewportLabel, url } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  const data = await seamData(page);
  if (!data) throw new Error('section not found');

  await page.evaluate((y) => scrollTo(0, y), Math.max(0, data.root.rect.top - Math.round(viewportHeight * 0.45)));
  await page.waitForTimeout(220);
  const beforePng = join(outDir, 'before.png');
  await page.screenshot({ path: beforePng, fullPage: false });

  await page.evaluate((y) => scrollTo(0, y), Math.max(0, data.root.rect.bottom - Math.round(viewportHeight * 0.55)));
  await page.waitForTimeout(220);
  const afterPng = join(outDir, 'after.png');
  await page.screenshot({ path: afterPng, fullPage: false });

  const before = {
    sectionId,
    url,
    viewport: { width: viewportWidth, height: viewportHeight, label: viewportLabel },
    edge: 'before',
    root: data.root,
    adjacent: data.previous,
    relation: data.beforeRelation ?? { gapPx: null, overlapPx: 0 },
    screenshot: beforePng,
  };
  const after = {
    sectionId,
    url,
    viewport: { width: viewportWidth, height: viewportHeight, label: viewportLabel },
    edge: 'after',
    root: data.root,
    adjacent: data.next,
    relation: data.afterRelation ?? { gapPx: null, overlapPx: 0 },
    screenshot: afterPng,
  };

  const beforeJson = join(outDir, 'before.json');
  const afterJson = join(outDir, 'after.json');
  writeFileSync(beforeJson, JSON.stringify(before, null, 2));
  writeFileSync(afterJson, JSON.stringify(after, null, 2));

  if (trialDir) {
    traceArtifact({ trialDir, path: beforePng, kind: 'seam-frame', sectionId, viewport: viewportLabel, state: 'before' });
    traceArtifact({ trialDir, path: afterPng, kind: 'seam-frame', sectionId, viewport: viewportLabel, state: 'after' });
    traceArtifact({ trialDir, path: beforeJson, kind: 'seam-contract', sectionId, viewport: viewportLabel, state: 'before' });
    traceArtifact({ trialDir, path: afterJson, kind: 'seam-contract', sectionId, viewport: viewportLabel, state: 'after' });
    appendTrace({ trialDir, event: 'probe_finished', data: { probe: 'seams', sectionId, viewport: viewportLabel, outDir } });
  }
  await browser.close();
  pass(`seams ${sectionId}@${viewportLabel}: ${resolve(outDir)}`);
} catch (error) {
  await browser.close().catch(() => {});
  if (trialDir) appendTrace({ trialDir, event: 'probe_finished', data: { probe: 'seams', sectionId, viewport: viewportLabel, error: error.message } });
  fail(`seams fallo: ${error.message}`);
  process.exit(1);
}
