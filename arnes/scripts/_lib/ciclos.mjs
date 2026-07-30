// # READ: librería interna. Lee y analiza _arnes/verify/ciclos.jsonl.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export const CATEGORIAS = ['medida', 'espaciado', 'tipografia', 'color-token', 'overflow-mobile',
  'variante-responsive', 'animacion-scroll', 'interaccion', 'asset-faltante', 'svg-roto',
  'solapamiento', 'navegacion', 'otro'];

export function leerCiclos(dirArnes) {
  const ruta = join(dirArnes, 'verify', 'ciclos.jsonl');
  if (!existsSync(ruta)) return { ciclos: [], avisos: [`No existe ${ruta} — aún no hay auditorías registradas.`] };
  const ciclos = [], avisos = [];
  readFileSync(ruta, 'utf8').split('\n').forEach((l, i) => {
    const t = l.trim();
    if (!t) return;
    try { ciclos.push(JSON.parse(t)); }
    catch { avisos.push(`Línea ${i + 1} de ciclos.jsonl no es JSON válido — ignorada`); }
  });
  return { ciclos, avisos };
}

export function analizarCiclos(dirArnes) {
  const { ciclos, avisos } = leerCiclos(dirArnes);
  const porCategoria = {}, porSeccion = {};
  for (const c of ciclos) {
    if (!c.seccion || !c.veredicto) continue;
    (porSeccion[c.seccion] ??= []).push(c);
    for (const f of c.fallos ?? []) porCategoria[f.categoria] = (porCategoria[f.categoria] ?? 0) + 1;
  }
  const bloqueadas = [], dosCiclos = [];
  for (const [seccion, lista] of Object.entries(porSeccion)) {
    const orden = [...lista].sort((a, b) => (a.intento ?? 0) - (b.intento ?? 0));
    const fails = orden.filter(c => c.veredicto === 'FAIL').length;
    const resuelta = orden.at(-1)?.veredicto === 'PASS';
    if (fails >= 2) bloqueadas.push({ seccion, resuelta });
    else if (fails === 1 && resuelta) dosCiclos.push(seccion);
  }
  const casosFaltantes = bloqueadas
    .filter(b => !existsSync(join(dirArnes, 'verify', 'casos', `${b.seccion}.md`)))
    .map(b => b.seccion);
  return { ciclos, avisos, porCategoria, dosCiclos, bloqueadas, casosFaltantes };
}
