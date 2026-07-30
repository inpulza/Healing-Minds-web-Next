#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve, sep } from 'node:path';
import { leerArgs } from './_lib/salida.mjs';
import {
  DEFAULT_EXCLUDED_DIRECTORIES,
  scanPurityInventory,
} from './_lib/purity-inventory.mjs';

function isInside(parent, candidate) {
  const rel = relative(resolve(parent), resolve(candidate));
  return rel === '' || (!rel.startsWith(`..${sep}`) && rel !== '..');
}

const args = leerArgs();
if (!args.root) {
  console.error('FAIL Falta --root=RUTA');
  console.error('  -> Ejemplo: node scripts/purity-inventory.mjs --root=C:\\proyecto --provider=framer --out=C:\\evidencia\\inventory.json');
  process.exit(2);
}

try {
  const root = resolve(String(args.root));
  const out = args.out ? resolve(String(args.out)) : null;
  if (out && isInside(root, out)) {
    throw new Error('--out must be outside --root so the audit cannot modify or contaminate the target');
  }

  const extraExcludes = args.exclude
    ? String(args.exclude).split(',').map((value) => value.trim()).filter(Boolean)
    : [];
  const report = scanPurityInventory({
    root,
    provider: args.provider || 'framer',
    excludedDirectories: [...DEFAULT_EXCLUDED_DIRECTORIES, ...extraExcludes],
  });

  if (out) {
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`);
  } else {
    console.log(JSON.stringify(report, null, 2));
  }

  const summary = `${report.verdict.status} provider=${report.provider} files=${report.files.total} inventory=${report.inventorySha256}`;
  if (report.verdict.status === 'PURE_NATIVE') console.error(`PASS ${summary}`);
  else console.error(`FAIL ${summary}`);
  process.exitCode = report.verdict.status === 'PURE_NATIVE' ? 0 : 1;
} catch (error) {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 2;
}

