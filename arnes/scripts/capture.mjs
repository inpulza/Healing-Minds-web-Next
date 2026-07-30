#!/usr/bin/env node
// # RUN: node arnes/scripts/capture.mjs [--url=...] [--dir=_arnes] [--viewports=390,768,1440]
// Fase 01: congela la ground truth del original. Sin --url usa TARGET_URL de config.json.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { leerArgs, pass, fail } from './_lib/salida.mjs';
import { cargarConfig } from './_lib/config.mjs';

const args = leerArgs();
const dir = String(args.dir ?? '_arnes');
let cfg = null;
try { cfg = cargarConfig(dir); } catch (e) {
  if (!args.url) { fail(e.message); process.exit(2); }
}
const url = String(args.url ?? cfg.TARGET_URL);
const viewports = args.viewports
  ? String(args.viewports).split(',').map(Number)
  : (cfg?.VIEWPORTS ?? [390, 768, 1440]);
const capDir = join(dir, 'captura');
mkdirSync(join(capDir, 'assets'), { recursive: true });

async function autoscroll(page) {
  await page.evaluate(async () => {
    await new Promise(fin => {
      let total = 0;
      const paso = () => {
        window.scrollBy(0, 600); total += 600;
        if (total >= document.body.scrollHeight) { window.scrollTo(0, 0); setTimeout(fin, 400); }
        else setTimeout(paso, 120);
      };
      paso();
    });
  });
}

const inventariarSecciones = () => {
  const raiz = document.querySelector('main') ?? document.body;
  const hijos = [...raiz.children];
  return hijos.filter(el => {
    const r = el.getBoundingClientRect(), st = getComputedStyle(el);
    return r.height > 80 && st.display !== 'none' && st.visibility !== 'hidden';
  }).map((el, i) => ({
    orden: i + 1,
    selector: el.id ? `#${el.id}`
      : `${raiz === document.body ? 'body' : 'main'} > ${el.tagName.toLowerCase()}:nth-child(${hijos.indexOf(el) + 1})`,
    tag: el.tagName.toLowerCase(),
    alturaPx: Math.round(el.getBoundingClientRect().height),
    texto: (el.innerText ?? '').trim().slice(0, 80).replace(/\s+/g, ' '),
  }));
};

const listarAssets = () => {
  const urls = new Set();
  document.querySelectorAll('img').forEach(i => { if (i.currentSrc) urls.add(i.currentSrc); });
  document.querySelectorAll('*').forEach(el => {
    const bg = getComputedStyle(el).backgroundImage;
    const m = bg && bg.match(/url\("?[^")]+"?\)/g);
    if (m) m.forEach(u => {
      const limpio = u.replace(/^url\("?/, '').replace(/"?\)$/, '');
      if (/^https?:/.test(limpio)) urls.add(limpio);
    });
  });
  return [...urls].slice(0, 100);
};

async function descargar(page, url, carpeta, i) {
  try {
    const resp = await page.request.get(url, { timeout: 20000 });
    if (!resp.ok()) return { url, error: `HTTP ${resp.status()}` };
    const base = url.split('/').pop().split('?')[0].replace(/[^\w.-]/g, '_').slice(-80) || 'asset';
    const archivo = `${String(i).padStart(2, '0')}-${base}`;
    writeFileSync(join(carpeta, archivo), await resp.body());
    return { url, archivo };
  } catch (e) { return { url, error: String(e.message).slice(0, 120) }; }
}

const browser = await chromium.launch();
try {
  const mayor = Math.max(...viewports);
  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp, height: 900 } });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await autoscroll(page);
    await page.screenshot({ path: join(capDir, `original-${vp}.png`), fullPage: true });
    if (vp === mayor) {
      writeFileSync(join(capDir, 'pagina.html'), await page.content());
      writeFileSync(join(capDir, 'texto.txt'), await page.evaluate(() => document.body.innerText));
      writeFileSync(join(capDir, 'secciones.json'),
        JSON.stringify(await page.evaluate(inventariarSecciones), null, 2));
      const assets = await page.evaluate(listarAssets);
      const manifest = [];
      for (let i = 0; i < assets.length; i++)
        manifest.push(await descargar(page, assets[i], join(capDir, 'assets'), i));
      writeFileSync(join(capDir, 'assets', 'manifest.json'), JSON.stringify(manifest, null, 2));
    }
    await page.close();
    pass(`captura viewport ${vp}px`);
  }
} catch (e) {
  fail(`captura falló: ${e.message}`, 'Verifica la URL, tu red y que chromium esté instalado (npx playwright install chromium).');
  await browser.close();
  process.exit(1);
}
await browser.close();
pass(`ground truth congelada en ${capDir}`);
