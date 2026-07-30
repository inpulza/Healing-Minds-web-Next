#!/usr/bin/env node
// # RUN: node arnes/scripts/eval-suite.mjs start|aggregate|list --section=<id>
// Creates and manages reproducible eval-suite trials for strict web-clone audits.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { cargarConfig } from './_lib/config.mjs';
import { leerArgs, pass, fail } from './_lib/salida.mjs';
import {
  DEFAULT_REQUIRED_STATES,
  DEFAULT_REQUIRED_VIEWPORTS,
  createTrial,
  listTrials,
  readJson,
  validateTask,
  validateTrial,
} from './_lib/eval-suite.mjs';
import { appendTrace } from './_lib/trace.mjs';

const args = leerArgs();
const [command] = args._;
const dir = String(args.dir ?? '_arnes');
const section = String(args.section ?? '').trim();

function readCaptureSelector(sectionId) {
  const capturePath = join(dir, 'captura', 'secciones.json');
  if (!existsSync(capturePath)) return `#${sectionId}`;
  try {
    const sections = JSON.parse(readFileSync(capturePath, 'utf8'));
    const byText = sections.find((item) =>
      String(item.texto ?? '').toLowerCase().includes(sectionId.replace(/-/g, ' ')));
    return byText?.selector ?? `#${sectionId}`;
  } catch {
    return `#${sectionId}`;
  }
}

function buildTask(cfg, sectionId) {
  const targetUrl = String(args['target-url'] ?? cfg.TARGET_URL ?? '');
  const cloneUrl = String(args['clone-url'] ?? cfg.CLONE_URL ?? 'http://localhost:3001/');
  return {
    taskId: String(args['task-id'] ?? `clone-section-${sectionId}`),
    targetUrl,
    cloneUrl,
    sectionId,
    selectorOriginal: String(args['selector-original'] ?? readCaptureSelector(sectionId)),
    selectorClone: String(args['selector-clone'] ?? `#${sectionId}`),
    mode: String(args.mode ?? cfg.MODO ?? 'clon'),
    requiredViewports: DEFAULT_REQUIRED_VIEWPORTS,
    requiredStates: DEFAULT_REQUIRED_STATES,
    passPolicy: 'all-required-graders-pass',
    constructorMayApprove: false,
  };
}

function latestTrial(sectionId) {
  const trials = listTrials(String(args['eval-suite-dir'] ?? join(dir, 'eval-suite')), sectionId);
  return trials.at(-1);
}

try {
  if (!command || !['start', 'aggregate', 'list'].includes(command)) {
    fail('Comando invalido o ausente.', 'Uso: node arnes/scripts/eval-suite.mjs start|aggregate|list --section=<id>');
    process.exit(2);
  }
  if (!section) {
    fail('Falta --section=<id>.', '--section=case-studies');
    process.exit(2);
  }

  const cfg = cargarConfig(dir);
  const evalSuiteDir = String(args['eval-suite-dir'] ?? cfg.EVAL_SUITE_DIR ?? join(dir, 'eval-suite'));

  if (command === 'start') {
    const role = String(args.role ?? 'constructor');
    const task = buildTask(cfg, section);
    const taskValidation = validateTask(task, cfg);
    if (!taskValidation.ok) throw new Error(taskValidation.errors.join('; '));
    const result = createTrial({ evalSuiteDir, task, role, agent: String(args.agent ?? 'codex') });
    pass(`eval trial creado: ${result.trialDir}`);
    console.log(JSON.stringify({ trialId: result.trialId, trialDir: result.trialDir }, null, 2));
  }

  if (command === 'list') {
    const trials = listTrials(evalSuiteDir, section);
    console.log(JSON.stringify(trials, null, 2));
    pass(`${trials.length} trial(s) en ${evalSuiteDir}/${section}`);
  }

  if (command === 'aggregate') {
    const trial = args.trial
      ? listTrials(evalSuiteDir, section).find((item) => item.trialId === args.trial)
      : latestTrial(section);
    if (!trial) throw new Error(`No hay trials para ${section}`);
    const codeResultsPath = join(trial.trialDir, 'graders', 'code-results.json');
    if (!existsSync(codeResultsPath)) throw new Error(`Falta ${codeResultsPath}. Ejecuta run-graders.mjs primero.`);
    const trialJson = readJson(join(trial.trialDir, 'trial.json'));
    const trialValidation = validateTrial(trialJson);
    if (!trialValidation.ok) throw new Error(trialValidation.errors.join('; '));
    const results = JSON.parse(readFileSync(codeResultsPath, 'utf8'));
    const blockingFailures = results.filter((item) => item.blocking && item.verdict !== 'PASS');
    const aggregate = {
      sectionId: section,
      trialId: trial.trialId,
      verdict: blockingFailures.length ? 'FAIL' : 'PASS',
      blockingFailures,
      totalGraders: results.length,
      createdAt: new Date().toISOString(),
    };
    writeFileSync(join(trial.trialDir, 'aggregate.json'), JSON.stringify(aggregate, null, 2));
    appendTrace({
      trialDir: trial.trialDir,
      event: 'trial_finished',
      data: { verdict: aggregate.verdict, blockingFailures: blockingFailures.length },
    });
    console.log(JSON.stringify(aggregate, null, 2));
    if (aggregate.verdict === 'PASS') pass(`aggregate PASS ${section}/${trial.trialId}`);
    else fail(`aggregate FAIL ${section}/${trial.trialId}`, `${blockingFailures.length} grader(s) bloqueantes fallaron`);
    process.exit(aggregate.verdict === 'PASS' ? 0 : 1);
  }
} catch (error) {
  fail(error.message);
  process.exit(1);
}
