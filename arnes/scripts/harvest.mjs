#!/usr/bin/env node
// # RUN: node arnes/scripts/harvest.mjs [--dir=_arnes]
// Fase 05: agrega ciclos.jsonl + casos/ → _arnes/verify/resumen-ciclos.md
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { leerArgs, pass } from './_lib/salida.mjs';
import { analizarCiclos } from './_lib/ciclos.mjs';

const args = leerArgs();
const dir = String(args.dir ?? '_arnes');
const an = analizarCiclos(dir);
for (const a of an.avisos) console.log(`AVISO ${a}`);

const md_ = (s) => String(s).replace(/\|/g, '\\|').replace(/^#/gm, '\\#');
const cat = Object.entries(an.porCategoria).sort((a, b) => b[1] - a[1]);
const candidatos = cat.filter(([, n]) => n >= 2)
  .map(([c, n]) => `- **${md_(c)}** (${n} apariciones): revisar si amerita check en script > ítem de checklist > referencia.`);

const md = `# Resumen de ciclos QA
Generado por harvest.mjs — ${an.ciclos.length} ciclos registrados.

## Fallos por categoría
| categoría | apariciones |
|-----------|-------------|
${cat.map(([c, n]) => `| ${md_(c)} | ${n} |`).join('\n') || '| (ninguno) | - |'}

## Secciones que necesitaron 2 ciclos (FAIL→fix→PASS)
${an.dosCiclos.map(s => `- \`${md_(s)}\``).join('\n') || '- (ninguna)'}

## Secciones bloqueadas (⛔, 2+ FAIL)
${an.bloqueadas.map(b => `- \`${md_(b.seccion)}\` — ${b.resuelta ? 'resuelta después' : 'SIN resolver'} — caso de estudio: ${an.casosFaltantes.includes(b.seccion) ? '❌ FALTA (obligatorio para cerrar fase 5)' : '✅ verify/casos/' + b.seccion + '.md'}`).join('\n') || '- (ninguna)'}

## Candidatos a learning (categorías con ≥2 apariciones)
${candidatos.join('\n') || '- (ninguno)'}

> Siguiente paso humano: revisar candidatos y promover a LEARNINGS.md del paquete
> (jerarquía: check en script > ítem de checklist > referencia).
`;
writeFileSync(join(dir, 'verify', 'resumen-ciclos.md'), md);
pass(`resumen escrito en ${join(dir, 'verify', 'resumen-ciclos.md')} (${an.ciclos.length} ciclos, ${an.bloqueadas.length} bloqueadas)`);
