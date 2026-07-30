#!/usr/bin/env node
// # RUN: node arnes/scripts/graders/run-graders.mjs --section=<id> [--trial=<id>]
// Runs code-based graders and writes code-results.json + aggregate.json.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { cargarConfig } from '../_lib/config.mjs';
import { leerArgs, pass, fail } from '../_lib/salida.mjs';
import { DEFAULT_REQUIRED_VIEWPORTS, listTrials, readJson } from '../_lib/eval-suite.mjs';
import { appendTrace } from '../_lib/trace.mjs';
import { gradeArtifactPresence } from './artifact-presence.mjs';
import { gradeInteractionState } from './interaction-state.mjs';
import { gradeMaxWidthContainer } from './max-width-container.mjs';
import { gradeRolePermission } from './role-permission.mjs';
import { gradeScrollPhysics } from './scroll-physics.mjs';
import { gradeSeam } from './seam.mjs';
import { gradeTraceCompleteness } from './trace-completeness.mjs';
import { gradeViewportCoverage } from './viewport-coverage.mjs';

const args = leerArgs();
const dir = String(args.dir ?? '_arnes');
const sectionId = String(args.section ?? '').trim();

function selectTrial(evalSuiteDir) {
  const trials = listTrials(evalSuiteDir, sectionId);
  if (args.trial) {
    return trials.find((trial) => trial.trialId === args.trial);
  }
  return trials.at(-1);
}

function rawPath(prefix, viewport) {
  const width = String(viewport).split('x')[0];
  if (prefix === 'original') return join(dir, 'spec', `raw-${sectionId}-${width}.json`);
  return join(dir, 'verify', `raw-clon-${sectionId}-${width}.json`);
}

try {
  if (!sectionId) {
    fail('Falta --section=<id>.', '--section=case-studies');
    process.exit(2);
  }
  const cfg = cargarConfig(dir);
  const evalSuiteDir = String(args['eval-suite-dir'] ?? cfg.EVAL_SUITE_DIR ?? join(dir, 'eval-suite'));
  const trial = selectTrial(evalSuiteDir);
  if (!trial) throw new Error(`No hay trial para ${sectionId}. Ejecuta eval-suite.mjs start.`);
  const trialDir = trial.trialDir;
  const task = readJson(join(trialDir, 'task.json'));
  const viewports = task.requiredViewports?.length ? task.requiredViewports : DEFAULT_REQUIRED_VIEWPORTS;
  const results = [];

  const run = (name, fn) => {
    appendTrace({ trialDir, event: 'grader_started', data: { grader: name } });
    const result = fn();
    appendTrace({
      trialDir,
      event: 'grader_result',
      data: { grader: name, verdict: result.verdict, blocking: result.blocking, message: result.message },
    });
    results.push(result);
  };

  run('artifact-presence', () => gradeArtifactPresence({ dir, sectionId, viewports, trialDir }));
  run('viewport-coverage', () => gradeViewportCoverage({ dir, sectionId, viewports }));
  for (const viewport of viewports) {
    run(`max-width-container:${viewport}`, () => gradeMaxWidthContainer({
      sectionId,
      viewport,
      originalPath: rawPath('original', viewport),
      clonePath: rawPath('clone', viewport),
    }));
  }
  run('interaction-state', () => gradeInteractionState({ dir, sectionId, viewports }));
  run('scroll-physics', () => gradeScrollPhysics({ dir, sectionId, viewports }));
  run('seam', () => gradeSeam({ dir, sectionId, viewports }));
  run('role-permission', () => gradeRolePermission({ trialDir, sectionId }));

  const preliminaryFailures = results.filter((result) => result.blocking && result.verdict !== 'PASS');
  appendTrace({
    trialDir,
    event: 'trial_finished',
    data: {
      verdict: preliminaryFailures.length ? 'FAIL' : 'PENDING_TRACE_COMPLETENESS',
      blockingFailures: preliminaryFailures.length,
    },
  });
  run('trace-completeness', () => gradeTraceCompleteness({ trialDir, sectionId }));

  const gradersDir = join(trialDir, 'graders');
  mkdirSync(gradersDir, { recursive: true });
  writeFileSync(join(gradersDir, 'code-results.json'), JSON.stringify(results, null, 2));

  const blockingFailures = results.filter((result) => result.blocking && result.verdict !== 'PASS');
  const aggregate = {
    sectionId,
    trialId: trial.trialId,
    verdict: blockingFailures.length ? 'FAIL' : 'PASS',
    totalGraders: results.length,
    blockingFailures,
    createdAt: new Date().toISOString(),
  };
  writeFileSync(join(trialDir, 'aggregate.json'), JSON.stringify(aggregate, null, 2));
  console.log(JSON.stringify(aggregate, null, 2));
  if (aggregate.verdict === 'PASS') pass(`graders PASS ${sectionId}`);
  else fail(`graders FAIL ${sectionId}`, `${blockingFailures.length} fallo(s) bloqueante(s). Ver ${join(trialDir, 'aggregate.json')}`);
  process.exit(aggregate.verdict === 'PASS' ? 0 : 1);
} catch (error) {
  fail(error.message);
  process.exit(1);
}
