#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { leerArgs, fail, pass } from '../scripts/_lib/salida.mjs';

const args = leerArgs();
const trialDir = String(args['trial-dir'] ?? '');

function block(message) {
  fail(message);
  process.exit(2);
}

if (!trialDir) block('Falta --trial-dir=<eval-suite trial>');

const aggregatePath = join(trialDir, 'aggregate.json');
const codeResultsPath = join(trialDir, 'graders', 'code-results.json');
const tracePath = join(trialDir, 'trace.jsonl');

if (!existsSync(aggregatePath)) block(`Falta ${aggregatePath}`);
if (!existsSync(codeResultsPath)) block(`Falta ${codeResultsPath}`);
if (!existsSync(tracePath)) block(`Falta ${tracePath}`);

const aggregate = JSON.parse(readFileSync(aggregatePath, 'utf8'));
if (aggregate.verdict !== 'PASS') block(`aggregate.json no esta en PASS: ${aggregate.verdict}`);

const results = JSON.parse(readFileSync(codeResultsPath, 'utf8'));
const missingGraders = ['artifact-presence', 'viewport-coverage', 'role-permission', 'trace-completeness']
  .filter((name) => !results.some((result) => result.grader === name));
if (missingGraders.length) block(`Faltan graders requeridos: ${missingGraders.join(', ')}`);

pass(`hook stop OK: ${trialDir}`);
