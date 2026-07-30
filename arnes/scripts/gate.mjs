#!/usr/bin/env node
// # RUN: node arnes/scripts/gate.mjs --fase=N [--dir=_arnes]
// Valida los artefactos de la fase N (y anteriores). Exit 0 = puedes avanzar. Exit 1 = NO avances.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { leerArgs, pass, fail } from './_lib/salida.mjs';
import { cargarConfig } from './_lib/config.mjs';
import { parseLedger } from './_lib/ledger.mjs';
import { analizarCiclos } from './_lib/ciclos.mjs';
import { listTrials, readJson, validateTask, validateTrial } from './_lib/eval-suite.mjs';

const HEADINGS_SPEC = ['## Identidad', '## Geometría', '## Tipografía y color',
  '## Contenido', '## Interacciones y animación', '## Responsive'];

const args = leerArgs();
const dir = String(args.dir ?? '_arnes');
const fase = Number(args.fase);
if (!Number.isInteger(fase) || fase < 0 || fase > 5) {
  fail('Falta --fase=N (0..5).', 'Ej: node arnes/scripts/gate.mjs --fase=1');
  process.exit(2);
}

let fallos = 0;
const check = (cond, okMsg, failMsg, arreglo) => {
  if (cond) pass(okMsg); else { fail(failMsg, arreglo); fallos++; }
};
const archivo = (ruta, arreglo) =>
  check(existsSync(join(dir, ruta)), `existe ${ruta}`, `falta ${ruta}`, arreglo);
const jsonValido = (ruta, arreglo) => {
  if (!existsSync(join(dir, ruta))) { fail(`falta ${ruta}`, arreglo); fallos++; return null; }
  try { const v = JSON.parse(readFileSync(join(dir, ruta), 'utf8')); pass(`${ruta} parsea`); return v; }
  catch { fail(`${ruta} corrupto`, arreglo); fallos++; return null; }
};
function listarArchivos(carpeta) {
  const out = [];
  for (const f of readdirSync(carpeta)) {
    const ruta = join(carpeta, f);
    if (f === 'node_modules' || f.startsWith('.')) continue;
    if (statSync(ruta).isDirectory()) out.push(...listarArchivos(ruta));
    else out.push(ruta);
  }
  return out;
}
function validarEvalSuiteDeSeccion(sectionId, cfg) {
  const evalSuiteDir = cfg.EVAL_SUITE_DIR ?? join(dir, 'eval-suite');
  const trials = listTrials(evalSuiteDir, sectionId);
  if (!trials.length) {
    fail(`seccion ${sectionId}: falta eval-suite trial`,
      `Ejecuta node arnes/scripts/eval-suite.mjs start --section=${sectionId} --role=auditor --clone-url=<url>`);
    fallos++;
    return;
  }
  const trial = trials.find(t => t.verdict === 'PASS') ?? trials.at(-1);
  const taskPath = join(trial.trialDir, 'task.json');
  const trialPath = join(trial.trialDir, 'trial.json');
  const tracePath = join(trial.trialDir, 'trace.jsonl');
  const codeResultsPath = join(trial.trialDir, 'graders', 'code-results.json');
  const aggregatePath = join(trial.trialDir, 'aggregate.json');

  check(existsSync(taskPath), `eval task ${sectionId}: existe`, `eval task ${sectionId}: falta task.json`,
    'Recrea el trial de eval-suite');
  check(existsSync(trialPath), `eval trial ${sectionId}: existe`, `eval trial ${sectionId}: falta trial.json`,
    'Recrea el trial de eval-suite');
  check(existsSync(tracePath), `eval trace ${sectionId}: existe`, `eval trace ${sectionId}: falta trace.jsonl`,
    'Recrea el trial con trace');
  check(existsSync(codeResultsPath), `eval graders ${sectionId}: existen`, `eval graders ${sectionId}: falta code-results.json`,
    `Ejecuta node arnes/scripts/graders/run-graders.mjs --section=${sectionId}`);
  check(existsSync(aggregatePath), `eval aggregate ${sectionId}: existe`, `eval aggregate ${sectionId}: falta aggregate.json`,
    `Ejecuta node arnes/scripts/graders/run-graders.mjs --section=${sectionId}`);

  if (existsSync(taskPath)) {
    const res = validateTask(readJson(taskPath), cfg);
    check(res.ok, `eval task ${sectionId}: valida`,
      `eval task ${sectionId}: invalida: ${res.errors.join('; ')}`,
      'Corrige task.json o recrea el trial');
  }
  if (existsSync(trialPath)) {
    const res = validateTrial(readJson(trialPath));
    check(res.ok, `eval trial ${sectionId}: valida`,
      `eval trial ${sectionId}: invalida: ${res.errors.join('; ')}`,
      'Corrige trial.json o recrea el trial');
  }
  if (existsSync(aggregatePath)) {
    const aggregate = readJson(aggregatePath);
    check(aggregate.verdict === 'PASS', `eval aggregate ${sectionId}: PASS`,
      `eval aggregate ${sectionId}: ${aggregate.verdict}`,
      'Ningun AUDIT_PASS vale si aggregate.json no esta en PASS');
  }
}

// ---- fase 0: estado instalado ----
let cfg = null;
try { cfg = cargarConfig(dir); pass('config.json válido'); }
catch (e) { fail(e.message, 'npx arnes-clonador-web init'); fallos++; }
archivo('LEDGER.md', 'npx arnes-clonador-web init');
archivo('BITACORA.md', 'npx arnes-clonador-web init');
archivo('DECISIONES.md', 'npx arnes-clonador-web init');

// ---- fase 1: ground truth ----
if (fase >= 1 && cfg) {
  for (const vp of cfg.VIEWPORTS) archivo(`captura/original-${vp}.png`, 'node arnes/scripts/capture.mjs');
  archivo('captura/pagina.html', 'node arnes/scripts/capture.mjs');
  archivo('captura/texto.txt', 'node arnes/scripts/capture.mjs');
  archivo('captura/secciones.json', 'node arnes/scripts/capture.mjs');
  jsonValido('captura/assets/manifest.json', 'node arnes/scripts/capture.mjs');
}

// ---- fase 2: specs ----
let ledger = null;
if (fase >= 2) {
  try { ledger = parseLedger(dir); }
  catch (e) { fail(`LEDGER ilegible: ${e.message}`, 'Restaura _arnes/LEDGER.md desde arnes/plantillas/LEDGER.md'); fallos++; }
  if (ledger) {
    check(ledger.secciones.length > 0, `${ledger.secciones.length} secciones en LEDGER`,
      'LEDGER sin secciones', 'Fase 02: inventaría con captura/secciones.json y registra cada sección');
    jsonValido('spec/design-tokens.json', 'node arnes/scripts/extract-tokens.mjs');
    for (const s of ledger.secciones) {
      const rutaSpec = join(dir, s.spec);
      if (!s.spec || !existsSync(rutaSpec)) {
        fail(`sección ${s.id}: falta spec ${s.spec || '(sin ruta)'}`, 'Créalo desde arnes/plantillas/spec-de-seccion.md');
        fallos++; continue;
      }
      const spec = readFileSync(rutaSpec, 'utf8');
      const faltan = HEADINGS_SPEC.filter(h => !spec.includes(h));
      check(!faltan.length, `spec ${s.id} completo`,
        `spec ${s.id} incompleto: faltan ${faltan.join(', ')}`,
        'Copia las secciones de arnes/plantillas/spec-de-seccion.md');
    }
  }
}

// ---- fase 3: checkpoint humano + build + reglas de modo ----
if (fase >= 3 && ledger && cfg) {
  check(ledger.aprobado, 'checkpoint humano: specs aprobados',
    'Specs NO aprobados por el humano',
    'El humano debe cambiar "APROBADO_SPECS: no" a "sí" en _arnes/LEDGER.md tras revisar los specs');
  try { execSync(cfg.BUILD_CMD, { stdio: 'pipe', timeout: 300000 }); pass(`build OK (${cfg.BUILD_CMD})`); }
  catch (e) {
    fail(`build falla (${cfg.BUILD_CMD})`,
      'Últimas líneas:\n' + String(e.stdout ?? e.message).split('\n').filter(Boolean).slice(-10).join('\n'));
    fallos++;
  }
  if (cfg.MODO === 'inspiracion') {
    const rutaTexto = join(dir, 'captura', 'texto.txt');
    const texto = existsSync(rutaTexto) ? readFileSync(rutaTexto, 'utf8') : '';
    const frases = texto.split(/[\n.!?]+/).map(f => f.trim()).filter(f => f.split(/\s+/).length >= 8);
    const hayFuente = existsSync(cfg.SRC_DIR);
    check(hayFuente, `SRC_DIR encontrado (${cfg.SRC_DIR})`,
      `SRC_DIR no existe: ${cfg.SRC_DIR}`,
      'Configura SRC_DIR en _arnes/config.json apuntando a la carpeta del código del clon — sin ella no se puede verificar copy ni assets');
    const cuerpo = hayFuente
      ? listarArchivos(cfg.SRC_DIR)
          .filter(f => /\.(tsx?|jsx?|html?|css|astro|vue|svelte)$/.test(f))
          .map(f => readFileSync(f, 'utf8')).join('\n')
      : '';
    if (hayFuente) {
      const copiadas = frases.filter(f => cuerpo.includes(f));
      check(!copiadas.length, 'modo inspiración: sin copy literal del original',
        `modo inspiración: ${copiadas.length} frase(s) copiadas literalmente del original`,
        `Reescribe con el copy del cliente. Primera: "${copiadas[0]?.slice(0, 90)}…"`);
      let host = '';
      try { host = new URL(cfg.TARGET_URL).host; } catch { /* sin host */ }
      if (host) check(!cuerpo.includes(host), 'sin assets hotlinkeados del original',
        `hay referencias a ${host} dentro de ${cfg.SRC_DIR}`,
        'Descarga los assets sustituidos y sírvelos localmente');
    }
  }
}

// ---- fase 4: veredicto del auditor + diffs ----
if (fase >= 4 && ledger && cfg) {
  const verificadas = ledger.secciones.filter(s => s.estado === '✅');
  for (const s of verificadas) {
    const rutaAudit = join(dir, 'verify', `${s.id}-audit.md`);
    if (!existsSync(rutaAudit)) {
      fail(`sección ${s.id} está ✅ sin auditoría`,
        `El auditor (sesión limpia con arnes/plantillas/prompt-auditor.md) debe crear _arnes/verify/${s.id}-audit.md — el constructor no se auto-aprueba`);
      fallos++; continue;
    }
    check(/\b(AUDIT_PASS|REAUDIT_PASS)\b/.test(readFileSync(rutaAudit, 'utf8')),
      `auditoría ${s.id} firmada`,
      `auditoría ${s.id} sin firma válida del auditor`,
      'La firma la emite SOLO el auditor al final de su procedimiento (arnes/fases/04-verify.md). Si falló 2 veces: estado ⛔ y decide el humano');
    for (const vp of cfg.VIEWPORTS) {
      const r = jsonValido(`verify/${s.id}-diff-${vp}.json`,
        `node arnes/scripts/diff-visual.mjs <original> <clon> --json=_arnes/verify/${s.id}-diff-${vp}.json`);
      if (r) check(r.veredicto === 'PASS', `diff ${s.id}@${vp}px ${r.porcentaje}%`,
        `diff ${s.id}@${vp}px ${r.porcentaje}% > ${r.umbral}%`, 'Corrige y re-audita (máx 2 ciclos)');
    }
    validarEvalSuiteDeSeccion(s.id, cfg);
  }
}

// ---- fase 5: cierre ----
if (fase >= 5 && ledger) {
  const abiertas = ledger.secciones.filter(s => ['⬜', '🔧', '🔎'].includes(s.estado));
  check(!abiertas.length, 'sin secciones pendientes ni abiertas',
    `secciones sin cerrar: ${abiertas.map(s => `${s.id} ${s.estado}`).join(', ')}`,
    'Construye las ⬜, termina las 🔧/🔎, o márcalas ⛔ con decisión humana documentada');
  archivo('verify/resumen-ciclos.md', 'node arnes/scripts/harvest.mjs');
  const an = analizarCiclos(dir);
  check(!an.casosFaltantes.length, 'todos los ⛔ tienen caso de estudio',
    `⛔ sin caso de estudio: ${an.casosFaltantes.join(', ')}`,
    'Crea _arnes/verify/casos/<seccion>.md con arnes/plantillas/caso-de-estudio.md');
}

console.log(fallos
  ? `\nGATE FASE ${fase}: ${fallos} problema(s). NO avances de fase.`
  : `\nGATE FASE ${fase}: OK. Puedes avanzar.`);
process.exit(fallos ? 1 : 0);
