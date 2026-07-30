#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { leerArgs } from '../_lib/salida.mjs';
import {
  appendAccessLedger,
  attestHostWorkspace,
  authorizeRoleAccess,
  initPilot,
  loadRolePolicy,
  materializeRoleWorkspace,
  verifyRoleIsolation,
} from './_lib/role-isolation.mjs';
import {
  certifyHostWorkspace,
  evaluateHostAdapter,
  loadHostAdapterRegistry,
  prepareHostLaunch,
  validateHostAdapterRegistry,
} from './_lib/host-adapter.mjs';

const args = leerArgs();
const [command] = args._;
const here = dirname(fileURLToPath(import.meta.url));
const defaultPolicy = resolve(here, '..', '..', 'plantillas', 'native-reconstruction', 'role-policy.json');
const defaultHostRegistry = resolve(here, '..', '..', 'plantillas', 'native-reconstruction', 'host-adapters.json');

function fail(message, code = 2) {
  console.error(`FAIL ${message}`);
  process.exit(code);
}

if (!command || !['init', 'check', 'materialize', 'attest', 'prepare-host', 'certify-host', 'host-status', 'verify'].includes(command)) {
  fail('Uso: role-isolation.mjs init|check|materialize|attest|prepare-host|certify-host|host-status|verify --pilot-root=RUTA');
}

const pilotRoot = args['pilot-root'] ? resolve(String(args['pilot-root'])) : null;
if (!pilotRoot) fail('Falta --pilot-root=RUTA');
const policyPath = args.policy ? resolve(String(args.policy)) : existsSync(join(pilotRoot, 'role-policy.json'))
  ? join(pilotRoot, 'role-policy.json')
  : defaultPolicy;
const policy = loadRolePolicy(policyPath);
const hostRegistryPath = args['host-registry'] ? resolve(String(args['host-registry'])) : defaultHostRegistry;

try {
  if (command === 'init') {
    const result = initPilot({
      pilotRoot,
      policy,
      pilotId: String(args['pilot-id'] ?? `native-pilot-${Date.now()}`),
      enforcementMode: String(args['enforcement-mode'] ?? 'materialized-view'),
    });
    console.log(JSON.stringify({ root: result.root, manifest: result.manifest }, null, 2));
    console.error(`PASS pilot initialized: ${result.root}`);
  }

  if (command === 'check') {
    const role = String(args.role ?? '');
    const operation = String(args.operation ?? '');
    const requestedPath = String(args.path ?? '');
    if (!role || !operation || !requestedPath) fail('check requiere --role, --operation y --path');
    const decision = authorizeRoleAccess({ policy, pilotRoot, role, operation, requestedPath });
    appendAccessLedger({ pilotRoot, decision });
    console.log(JSON.stringify(decision, null, 2));
    if (!decision.allowed) fail(decision.reason);
    console.error(`PASS access allowed: ${role} ${operation} ${decision.path}`);
  }

  if (command === 'materialize') {
    const role = String(args.role ?? '');
    if (!role) fail('materialize requiere --role');
    const result = materializeRoleWorkspace({
      pilotRoot,
      policy,
      role,
      workspaceRoot: args['workspace-root'] ? resolve(String(args['workspace-root'])) : undefined,
    });
    console.log(JSON.stringify(result, null, 2));
    console.error(`PASS role workspace materialized: ${result.workspaceRoot}`);
  }

  if (command === 'attest') {
    const role = String(args.role ?? '');
    const workspaceRoot = args['workspace-root'] ? resolve(String(args['workspace-root'])) : null;
    const mode = String(args.mode ?? '');
    const attestedBy = String(args['attested-by'] ?? '');
    if (!role || !workspaceRoot || !mode || !attestedBy) {
      fail('attest requiere --role, --workspace-root, --mode y --attested-by');
    }
    const result = attestHostWorkspace({ pilotRoot, role, workspaceRoot, mode, attestedBy });
    console.log(JSON.stringify(result, null, 2));
    console.error(`PASS host workspace attested: ${role} ${workspaceRoot}`);
  }

  if (command === 'host-status') {
    const registry = loadHostAdapterRegistry(hostRegistryPath);
    const validation = validateHostAdapterRegistry(registry);
    if (!validation.ok) fail(validation.errors.join('; '), 1);
    const adapters = Object.keys(registry.adapters).map((adapterId) => evaluateHostAdapter({ registry, adapterId }));
    console.log(JSON.stringify({ requiredCapabilities: registry.requiredCapabilities, adapters }, null, 2));
    console.error('PASS host adapter registry evaluated');
  }

  if (command === 'prepare-host') {
    const role = String(args.role ?? 'constructor');
    const workspaceRoot = args['workspace-root']
      ? resolve(String(args['workspace-root']))
      : join(pilotRoot, 'role-workspaces', role);
    const adapterId = String(args.adapter ?? '');
    if (!adapterId) fail('prepare-host requiere --adapter');
    const registry = loadHostAdapterRegistry(hostRegistryPath);
    const result = prepareHostLaunch({ pilotRoot, role, workspaceRoot, registry, adapterId });
    console.log(JSON.stringify(result, null, 2));
    if (!result.adapterEligible) fail(`host adapter is not eligible: ${result.adapterFailures.join('; ')}`, 1);
    console.error(`PASS host launch prepared: ${role} via ${adapterId}`);
  }

  if (command === 'certify-host') {
    const role = String(args.role ?? 'constructor');
    const evidencePath = args.evidence ? resolve(String(args.evidence)) : null;
    const attestedBy = String(args['attested-by'] ?? '');
    if (!evidencePath || !attestedBy) fail('certify-host requiere --evidence y --attested-by');
    const registry = loadHostAdapterRegistry(hostRegistryPath);
    const evidence = JSON.parse(readFileSync(evidencePath, 'utf8'));
    const result = certifyHostWorkspace({ pilotRoot, role, registry, evidence, attestedBy });
    console.log(JSON.stringify(result, null, 2));
    console.error(`PASS external host evidence certified: ${role}`);
  }

  if (command === 'verify') {
    const result = verifyRoleIsolation({ pilotRoot, policy });
    console.log(JSON.stringify(result, null, 2));
    if (result.verdict !== 'PASS') fail(result.failures.join('; '), 1);
    console.error(`PASS role isolation: ${pilotRoot}`);
  }
} catch (error) {
  fail(error.message, 1);
}
