#!/usr/bin/env node
// # RUN: node arnes/scripts/extract-section.mjs --url=... --selector="#hero" [--out=...json] [--shot=...png] [--viewport=1440] [--dir=_arnes]
// Mide UNA sección: geometría (transform-aware), tipografía completa, SVGs reales.
// PROHIBIDO extraer body/html enteros (Ley 6: análisis quirúrgico).
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { chromium } from 'playwright';
import { leerArgs, pass, fail } from './_lib/salida.mjs';
import { cargarConfig } from './_lib/config.mjs';
import { appendTrace, traceArtifact } from './_lib/trace.mjs';

const args = leerArgs();
const selector = String(args.selector ?? '').trim();
if (!selector || ['body', 'html'].includes(selector.toLowerCase())) {
  fail('Falta --selector válido ("body"/"html" están prohibidos).',
    'Este script mide UNA sección, p.ej. --selector="#hero". La Ley 6 prohíbe extraer la página entera.');
  process.exit(2);
}
const dir = String(args.dir ?? '_arnes');
let cfg = null; try { cfg = cargarConfig(dir); } catch { /* --url manda */ }
const url = String(args.url ?? cfg?.TARGET_URL ?? '');
if (!/^https?:\/\//.test(url)) { fail('Falta --url (o TARGET_URL en config).', '--url=https://…'); process.exit(2); }
const viewport = Number(args.viewport ?? 1440);
const slug = selector.replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '') || 'seccion';
const out = String(args.out ?? join(dir, 'spec', `raw-${slug}.json`));
const trialDir = args['trial-dir'] ? String(args['trial-dir']) : null;

const walker = (sel) => {
  const candidatos = [...document.querySelectorAll(sel)];
  const raiz = candidatos.find(n => {
    const r = n.getBoundingClientRect(), st = getComputedStyle(n);
    return r.width > 0 && r.height > 0 && st.display !== 'none' && st.visibility !== 'hidden';
  });
  if (!raiz) return { error: `Ningún nodo VISIBLE coincide con "${sel}" (matches totales: ${candidatos.length}). Recuerda: las variantes ocultas de Framer no se miden.` };
  const extraer = (el, prof) => {
    const st = getComputedStyle(el), r = el.getBoundingClientRect();
    if (st.display === 'none' || st.visibility === 'hidden' || r.width === 0 || r.height === 0) return null;
    const m = new DOMMatrixReadOnly(st.transform);            // lección 04: descontar transforms
    const nodo = {
      tag: el.tagName.toLowerCase(),
      rect: { x: Math.round(r.x + scrollX - m.m41), y: Math.round(r.y + scrollY - m.m42),
              w: Math.round(r.width), h: Math.round(r.height) },
      estilos: {
        display: st.display, position: st.position,
        fontFamily: st.fontFamily.split(',')[0].replace(/"/g, '').trim(),
        fontSize: st.fontSize, fontWeight: st.fontWeight, lineHeight: st.lineHeight,
        letterSpacing: st.letterSpacing === 'normal' ? undefined : st.letterSpacing,
        color: st.color, backgroundColor: st.backgroundColor,
        backgroundImage: st.backgroundImage === 'none' ? undefined : st.backgroundImage.slice(0, 200),
        padding: st.padding, margin: st.margin, gap: st.gap === 'normal' ? undefined : st.gap,
        borderRadius: st.borderRadius === '0px' ? undefined : st.borderRadius,
        boxShadow: st.boxShadow === 'none' ? undefined : st.boxShadow,
        opacity: st.opacity === '1' ? undefined : st.opacity,
        zIndex: st.zIndex === 'auto' ? undefined : st.zIndex,
        flexDirection: st.display.includes('flex') ? st.flexDirection : undefined,
        justifyContent: (st.display.includes('flex') || st.display.includes('grid')) ? st.justifyContent : undefined,
        alignItems: (st.display.includes('flex') || st.display.includes('grid')) ? st.alignItems : undefined,
        gridTemplateColumns: st.display.includes('grid') ? st.gridTemplateColumns : undefined,
      },
    };
    const texto = [...el.childNodes].filter(n => n.nodeType === 3)
      .map(n => n.textContent.trim()).filter(Boolean).join(' ');
    if (texto) nodo.texto = texto;
    if (el.tagName.toLowerCase() === 'svg') { nodo.svg = el.outerHTML.slice(0, 20000); return nodo; } // Ley 7
    if (el.tagName === 'IMG') nodo.img = { src: el.currentSrc, w: el.naturalWidth, h: el.naturalHeight, alt: el.alt };
    if (prof >= 12) { nodo.aviso = 'profundidad máxima 12 alcanzada — mide los hijos con otra llamada'; return nodo; }
    const hijos = [...el.children].map(h => extraer(h, prof + 1)).filter(Boolean);
    if (hijos.length) nodo.hijos = hijos;
    return nodo;
  };
  return extraer(raiz, 0);
};

const contar = (n) => 1 + (n.hijos ?? []).reduce((a, h) => a + contar(h), 0);

const browser = await chromium.launch();
try {
  if (trialDir) appendTrace({
    trialDir,
    event: 'probe_started',
    data: { probe: 'extract-section', url, selector, viewport },
  });
  const page = await browser.newPage({ viewport: { width: viewport, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.locator(selector).first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(400); // lección 08: dejar asentar animaciones de entrada
  const arbol = await page.evaluate(walker, selector);
  if (arbol?.error) {
    await browser.close();
    fail(arbol.error, 'Revisa el selector en captura/secciones.json.');
    process.exit(1);
  }
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(arbol, null, 2));
  if (trialDir) traceArtifact({
    trialDir,
    path: out,
    kind: 'section-raw',
    sectionId: slug,
    viewport: `${viewport}x900`,
    state: 'settled',
  });
  if (args.shot) {
    mkdirSync(dirname(String(args.shot)), { recursive: true });
    await page.locator(selector).first().screenshot({ path: String(args.shot) });
    if (trialDir) traceArtifact({
      trialDir,
      path: String(args.shot),
      kind: 'section-screenshot',
      sectionId: slug,
      viewport: `${viewport}x900`,
      state: 'settled',
    });
  }
  pass(`sección ${selector} @${viewport}px: ${contar(arbol)} nodos → ${out}${args.shot ? ` + ${args.shot}` : ''}`);
  if (trialDir) appendTrace({
    trialDir,
    event: 'probe_finished',
    data: { probe: 'extract-section', url, selector, viewport, out },
  });
} catch (e) {
  if (trialDir) appendTrace({
    trialDir,
    event: 'probe_finished',
    data: { probe: 'extract-section', url, selector, viewport, error: e.message },
  });
  fail(`extracción falló: ${e.message}`, 'Verifica URL, selector y que chromium esté instalado.');
  await browser.close();
  process.exit(1);
}
await browser.close();
