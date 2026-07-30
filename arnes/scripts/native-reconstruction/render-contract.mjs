#!/usr/bin/env node
import { resolve } from 'node:path';

import { leerArgs } from '../_lib/salida.mjs';
import {
  lintRenderContract,
  loadRenderContract,
} from './_lib/render-contract.mjs';

const args = leerArgs();
const [command] = args._;

function fail(message, code = 2) {
  console.error(`FAIL ${message}`);
  process.exit(code);
}

if (command !== 'lint') fail('Uso: render-contract.mjs lint --contract=RUTA --brief=RUTA');
const contractPath = args.contract ? resolve(String(args.contract)) : null;
const briefPath = args.brief ? resolve(String(args.brief)) : null;
if (!contractPath || !briefPath) fail('lint requiere --contract y --brief');

try {
  const contract = loadRenderContract(contractPath);
  const brief = loadRenderContract(briefPath);
  const result = lintRenderContract({ contract, brief });
  console.log(JSON.stringify(result, null, 2));
  if (result.verdict !== 'PASS') fail(result.errors.join('; '), 1);
  console.error(`PASS render contract lint: ${contract.contractId}`);
} catch (error) {
  fail(error.message, 1);
}
