#!/usr/bin/env node
// # RUN: node scripts/scroll-physics-probe.mjs --url=... --selector="#section" --section=id
// Measures page-level scroll behavior around a target section.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
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
const out = String(args.out ?? join('_arnes', 'page-contract', viewportLabel, 'scroll-physics.json'));
const trialDir = args['trial-dir'] ? String(args['trial-dir']) : null;

if (!/^https?:\/\//.test(url)) {
  fail('Falta --url=http(s)://...');
  process.exit(2);
}
if (!selector && !anchor) {
  fail('Falta --selector=... o --anchor=texto visible');
  process.exit(2);
}

mkdirSync(dirname(out), { recursive: true });

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

async function snapshot(page, requestedY, startedAt) {
  await page.evaluate((y) => window.scrollTo(0, y), requestedY);
  await page.waitForTimeout(220);
  return page.evaluate((opts) => {
    const root = (0, eval)(opts.finder)(opts);
    if (!root) return { error: 'section not found' };
    const rect = root.getBoundingClientRect();
    const style = getComputedStyle(root);
    const htmlStyle = getComputedStyle(document.documentElement);
    const bodyStyle = getComputedStyle(document.body);
    return {
      requestedY: opts.requestedY,
      actualY: Math.round(scrollY),
      elapsedMs: Math.round(performance.now() - opts.startedAt),
      viewport: { width: innerWidth, height: innerHeight },
      sectionRect: {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        w: Math.round(rect.width),
        h: Math.round(rect.height),
        absoluteTop: Math.round(rect.top + scrollY),
        absoluteBottom: Math.round(rect.bottom + scrollY),
      },
      sectionStyle: {
        position: style.position,
        transform: style.transform === 'none' ? null : style.transform,
        transition: style.transition === 'all 0s ease 0s' ? null : style.transition,
      },
      cssScrollBehavior: {
        html: htmlStyle.scrollBehavior,
        body: bodyStyle.scrollBehavior,
      },
    };
  }, { selector, anchorText: anchor, finder: finder.toString(), requestedY, startedAt });
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: viewportWidth, height: viewportHeight } });

try {
  if (trialDir) appendTrace({ trialDir, event: 'probe_started', data: { probe: 'scroll-physics', sectionId, viewport: viewportLabel, url } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

  const base = await page.evaluate((opts) => {
    const root = (0, eval)(opts.finder)(opts);
    if (!root) return null;
    const rect = root.getBoundingClientRect();
    const htmlStyle = getComputedStyle(document.documentElement);
    const bodyStyle = getComputedStyle(document.body);
    const scrollRoot = document.scrollingElement || document.documentElement;
    const absoluteTop = rect.top + scrollY;
    const absoluteBottom = rect.bottom + scrollY;
    return {
      scrollRoot: scrollRoot.tagName.toLowerCase(),
      documentHeight: Math.round(scrollRoot.scrollHeight),
      initialScrollY: Math.round(scrollY),
      cssScrollBehavior: {
        html: htmlStyle.scrollBehavior,
        body: bodyStyle.scrollBehavior,
      },
      sectionRect: {
        absoluteTop: Math.round(absoluteTop),
        absoluteBottom: Math.round(absoluteBottom),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      },
      sectionTimeline: {
        enterY: Math.max(0, Math.round(absoluteTop - innerHeight)),
        topY: Math.max(0, Math.round(absoluteTop)),
        centerY: Math.max(0, Math.round(absoluteTop - innerHeight / 2 + rect.height / 2)),
        bottomY: Math.max(0, Math.round(absoluteBottom - innerHeight)),
        exitY: Math.max(0, Math.round(absoluteBottom)),
      },
    };
  }, { selector, anchorText: anchor, finder: finder.toString() });

  if (!base) throw new Error('section not found');

  const maxY = Math.max(0, base.documentHeight - viewportHeight);
  const candidates = [
    base.sectionTimeline.enterY,
    base.sectionTimeline.topY,
    base.sectionTimeline.centerY,
    base.sectionTimeline.bottomY,
    base.sectionTimeline.exitY,
  ].map((value) => Math.min(maxY, Math.max(0, value)));
  const positions = [...new Set(candidates)];
  while (positions.length < 5) {
    positions.push(Math.round(maxY * (positions.length / 4)));
  }

  const startedAt = await page.evaluate(() => performance.now());
  const samples = [];
  for (const y of positions.slice(0, 8)) {
    samples.push(await snapshot(page, y, startedAt));
  }

  const transforms = samples.map((sample) => sample.sectionStyle?.transform).filter(Boolean);
  const report = {
    sectionId,
    url,
    selector,
    anchor,
    viewport: { width: viewportWidth, height: viewportHeight, label: viewportLabel },
    createdAt: new Date().toISOString(),
    ...base,
    hasCssSmoothScroll: base.cssScrollBehavior.html === 'smooth' || base.cssScrollBehavior.body === 'smooth',
    hasScrollLinkedTransforms: new Set(transforms).size > 1,
    samples,
  };

  writeFileSync(out, JSON.stringify(report, null, 2));
  if (trialDir) {
    traceArtifact({ trialDir, path: out, kind: 'scroll-physics-contract', sectionId, viewport: viewportLabel, state: 'report' });
    appendTrace({ trialDir, event: 'probe_finished', data: { probe: 'scroll-physics', sectionId, viewport: viewportLabel, report: out } });
  }
  await browser.close();
  pass(`scroll-physics ${sectionId}@${viewportLabel}: ${resolve(out)}`);
} catch (error) {
  await browser.close().catch(() => {});
  if (trialDir) appendTrace({ trialDir, event: 'probe_finished', data: { probe: 'scroll-physics', sectionId, viewport: viewportLabel, error: error.message } });
  fail(`scroll-physics fallo: ${error.message}`);
  process.exit(1);
}
