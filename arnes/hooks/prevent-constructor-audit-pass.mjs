#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { leerArgs, fail, pass } from '../scripts/_lib/salida.mjs';

const args = leerArgs();
const trialDir = String(args['trial-dir'] ?? '');
const content = String(args.content ?? '');

function block(message) {
  fail(message);
  process.exit(2);
}

if (!trialDir) block('Falta --trial-dir=<eval-suite trial>');
const trialPath = join(trialDir, 'trial.json');
if (!existsSync(trialPath)) block(`Falta ${trialPath}`);

const trial = JSON.parse(readFileSync(trialPath, 'utf8'));
if (trial.role === 'constructor' && /\b(RE)?AUDIT_PASS\b/.test(content)) {
  block('El constructor no puede escribir AUDIT_PASS ni REAUDIT_PASS');
}

pass('hook constructor PASS blocker OK');
