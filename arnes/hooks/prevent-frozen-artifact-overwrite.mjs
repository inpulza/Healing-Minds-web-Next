#!/usr/bin/env node
import { normalize } from 'node:path';
import { leerArgs, fail, pass } from '../scripts/_lib/salida.mjs';

const args = leerArgs();
const path = normalize(String(args.path ?? '')).replace(/\\/g, '/');

function block(message) {
  fail(message);
  process.exit(2);
}

if (!path) block('Falta --path=<ruta>');

const frozenRoots = [
  '_arnes/captura/',
  '_arnes/page-contract/',
  '_arnes/render-contract/',
  '_arnes/interaction-film/',
  '_arnes/seams/',
];

const isFrozen = frozenRoots.some((root) => path.includes(root));
const isNewTrialArtifact = path.includes('/eval-suite/') || path.includes('_arnes/eval-suite/');
if (isFrozen && !isNewTrialArtifact) {
  block(`Evidencia congelada no se sobrescribe: ${path}`);
}

pass('hook frozen artifact overwrite blocker OK');
