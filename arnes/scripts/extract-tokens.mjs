#!/usr/bin/env node
// # RUN: node arnes/scripts/extract-tokens.mjs [--dir=_arnes] [--url=...]
// Fase 02: extrae paleta, tipografía, escala de espaciados y radios → _arnes/spec/design-tokens.json
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { leerArgs, pass, fail } from './_lib/salida.mjs';
import { cargarConfig } from './_lib/config.mjs';

const args = leerArgs();
const dir = String(args.dir ?? '_arnes');
let cfg = null; try { cfg = cargarConfig(dir); } catch { /* --url manda */ }
const url = String(args.url ?? cfg?.TARGET_URL ?? '');
if (!/^https?:\/\//.test(url)) { fail('Falta --url (o TARGET_URL en config).', '--url=https://…'); process.exit(2); }

const recolector = () => {
  const cuenta = (m, k) => m.set(k, (m.get(k) ?? 0) + 1);
  const colores = new Map(), familias = new Map(), tamanos = new Map();
  const radios = new Set(), espacios = new Set();
  const hex = (c) => {
    const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!m || m[4] === '0') return null;
    return '#' + [m[1], m[2], m[3]].map(n => (+n).toString(16).padStart(2, '0')).join('');
  };
  let n = 0;
  for (const el of document.querySelectorAll('*')) {
    if (++n > 5000) break;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const st = getComputedStyle(el);
    const c1 = hex(st.color); if (c1) cuenta(colores, c1);
    const c2 = hex(st.backgroundColor); if (c2) cuenta(colores, c2);
    cuenta(familias, st.fontFamily.split(',')[0].replace(/"/g, '').trim());
    if (el.innerText?.trim()) cuenta(tamanos, st.fontSize);
    if (st.borderRadius !== '0px') radios.add(st.borderRadius.split(' ')[0]);
    for (const v of [st.paddingTop, st.paddingLeft, st.marginTop, st.gap.split(' ')[0]]) {
      const px = parseFloat(v);
      if (px > 0 && px < 300) espacios.add(Math.round(px));
    }
  }
  const top = (m, k = 12) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, k)
    .map(([valor, usos]) => ({ valor, usos }));
  return {
    colores: top(colores),
    tipografia: { familias: top(familias, 5), tamanos: top(tamanos, 10) },
    espaciados: [...espacios].sort((a, b) => a - b),
    radios: [...radios].slice(0, 8),
  };
};

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  const tokens = await page.evaluate(recolector);
  mkdirSync(join(dir, 'spec'), { recursive: true });
  writeFileSync(join(dir, 'spec', 'design-tokens.json'), JSON.stringify(tokens, null, 2));
  pass(`tokens: ${tokens.colores.length} colores, ${tokens.tipografia.familias.length} familias, ${tokens.espaciados.length} espaciados → ${join(dir, 'spec', 'design-tokens.json')}`);
} catch (e) {
  fail(`extracción de tokens falló: ${e.message}`, 'Verifica la URL y chromium.');
  await browser.close();
  process.exit(1);
}
await browser.close();
