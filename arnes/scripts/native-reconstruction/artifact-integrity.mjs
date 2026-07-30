#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { leerArgs } from '../_lib/salida.mjs';
import {
  checkVaultAuthorization,
  freezeArtifacts,
  validateVaultPolicy,
  verifyArtifactIntegrity,
} from './_lib/artifact-integrity.mjs';

const args = leerArgs();
const [command] = args._;
const here = dirname(fileURLToPath(import.meta.url));
const defaultVaultPolicy = resolve(here, '..', '..', 'plantillas', 'native-reconstruction', 'vault-policy.json');

function fail(message, code = 2) {
  console.error(`FAIL ${message}`);
  process.exit(code);
}

if (!command || !['freeze', 'verify', 'vault-check'].includes(command)) {
  fail('Uso: artifact-integrity.mjs freeze|verify|vault-check --pilot-root=RUTA');
}
const pilotRoot = args['pilot-root'] ? resolve(String(args['pilot-root'])) : null;
if (!pilotRoot) fail('Falta --pilot-root=RUTA');

try {
  if (command === 'freeze') {
    const frozenBy = String(args.actor ?? '');
    if (!frozenBy) fail('freeze requiere --actor');
    const roots = String(args.roots ?? 'forensics,audit-baseline').split(',').map((value) => value.trim()).filter(Boolean);
    const result = freezeArtifacts({ pilotRoot, roots, frozenBy });
    console.log(JSON.stringify(result, null, 2));
    console.error(`PASS artifact roots frozen: ${roots.join(', ')}`);
  }

  if (command === 'verify') {
    const result = verifyArtifactIntegrity({ pilotRoot });
    console.log(JSON.stringify(result, null, 2));
    if (result.verdict !== 'PASS') fail(result.failures.join('; '), 1);
    console.error('PASS artifact integrity verified');
  }

  if (command === 'vault-check') {
    const authorizationPath = args.authorization ? resolve(String(args.authorization)) : null;
    const requestedPath = String(args.path ?? '');
    if (!authorizationPath || !requestedPath) fail('vault-check requiere --authorization y --path');
    const policyPath = args.policy ? resolve(String(args.policy)) : defaultVaultPolicy;
    const policy = JSON.parse(readFileSync(policyPath, 'utf8'));
    const policyValidation = validateVaultPolicy(policy);
    if (!policyValidation.ok) fail(policyValidation.errors.join('; '), 1);
    const authorization = JSON.parse(readFileSync(authorizationPath, 'utf8'));
    const result = checkVaultAuthorization({ policy, authorization, requestedPath });
    console.log(JSON.stringify(result, null, 2));
    if (!result.allowed) fail(result.failures.join('; '), 1);
    console.error(`PASS vault access authorized: ${result.requestedPath}`);
  }
} catch (error) {
  fail(error.message, 1);
}
