#!/usr/bin/env node
// # RUN: node arnes/scripts/diff-visual.mjs <original.png> <clon.png> [--umbral=3] [--salida=diff.png] [--json=r.json]
// Compara dos PNG y falla si el % de píxeles distintos supera el umbral.
import { readFileSync, writeFileSync } from 'node:fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { leerArgs, pass, fail } from './_lib/salida.mjs';

const args = leerArgs();
const [rutaA, rutaB] = args._;
if (!rutaA || !rutaB) {
  fail('Faltan argumentos.', 'Uso: node diff-visual.mjs original.png clon.png [--umbral=3] [--salida=diff.png] [--json=r.json]');
  process.exit(2);
}
function leerPng(ruta) {
  try { return PNG.sync.read(readFileSync(ruta)); }
  catch (e) { fail(`No pude leer ${ruta}: ${e.message}`, 'Verifica que exista y sea un PNG válido.'); process.exit(2); }
}
const a = leerPng(rutaA), b = leerPng(rutaB);
const width = Math.max(a.width, b.width), height = Math.max(a.height, b.height);
const distintas = a.width !== b.width || a.height !== b.height;
function lienzo(img) {
  if (img.width === width && img.height === height) return img;
  const out = new PNG({ width, height });
  out.data.fill(255);
  PNG.bitblt(img, out, 0, 0, img.width, img.height, 0, 0);
  return out;
}
const diff = new PNG({ width, height });
const nDistintos = pixelmatch(lienzo(a).data, lienzo(b).data, diff.data, width, height, { threshold: 0.1 });
const porcentaje = +((100 * nDistintos) / (width * height)).toFixed(2);
const umbral = Number(args.umbral ?? 3);
const veredicto = porcentaje <= umbral ? 'PASS' : 'FAIL';
if (args.salida) writeFileSync(String(args.salida), PNG.sync.write(diff));
if (args.json) writeFileSync(String(args.json), JSON.stringify({
  original: rutaA, clon: rutaB, porcentaje, umbral, veredicto,
  dimensiones: { width, height },
  nota: distintas ? 'dimensiones distintas: la imagen menor se rellenó con blanco' : undefined,
}, null, 2));
if (veredicto === 'PASS') pass(`diff ${porcentaje}% <= ${umbral}%`);
else fail(`diff ${porcentaje}% > ${umbral}%`,
  args.salida ? `Revisa la imagen diff: ${args.salida}` : 'Pasa --salida=diff.png para ver dónde difiere.');
process.exit(veredicto === 'PASS' ? 0 : 1);
