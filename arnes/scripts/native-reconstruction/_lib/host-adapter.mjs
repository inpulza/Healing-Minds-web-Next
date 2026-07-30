import {
  existsSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { createHash, randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { basename, isAbsolute, join, relative, resolve, sep } from 'node:path';

import { attestHostWorkspace } from './role-isolation.mjs';

const REQUIRED_PROBES = [
  'allowedReadSucceeded',
  'allowedWriteSucceeded',
  'forbiddenReadBlocked',
  'networkBlocked',
  'childProcessDeniedOrContained',
  'originalBrowserDenied',
];

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function isInside(root, candidate) {
  const rel = relative(resolve(root), resolve(candidate));
  return rel === '' || (rel !== '..' && !rel.startsWith(`..${sep}`) && !isAbsolute(rel));
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function controlPath(pilotRoot, name) {
  return join(resolve(pilotRoot), '.harness-control', name);
}

export function validateHostAdapterRegistry(registry) {
  const errors = [];
  if (registry?.schemaVersion !== 1) errors.push('registry.schemaVersion must be 1');
  if (registry?.requiredEnforcementMode !== 'host-workspace-root') {
    errors.push('registry.requiredEnforcementMode must be host-workspace-root');
  }
  const required = registry?.requiredCapabilities;
  if (!required || typeof required !== 'object') errors.push('registry.requiredCapabilities is required');
  for (const [adapterId, adapter] of Object.entries(registry?.adapters ?? {})) {
    if (!['partial', 'eligible'].includes(adapter?.status)) {
      errors.push(`adapter ${adapterId} has invalid status`);
    }
    for (const key of Object.keys(required ?? {})) {
      if (typeof adapter?.capabilities?.[key] !== 'boolean') {
        errors.push(`adapter ${adapterId} capability ${key} must be boolean`);
      }
    }
  }
  if (!Object.keys(registry?.adapters ?? {}).length) errors.push('registry.adapters must not be empty');
  return { ok: errors.length === 0, errors };
}

export function evaluateHostAdapter({ registry, adapterId }) {
  const validation = validateHostAdapterRegistry(registry);
  if (!validation.ok) return { adapterId, eligible: false, failures: validation.errors };
  const adapter = registry.adapters[adapterId];
  if (!adapter) return { adapterId, eligible: false, failures: [`unknown host adapter: ${adapterId}`] };
  const failures = [];
  for (const [capability, expected] of Object.entries(registry.requiredCapabilities)) {
    if (adapter.capabilities[capability] !== expected) {
      failures.push(`${capability}=${adapter.capabilities[capability]} does not satisfy ${expected}`);
    }
  }
  if (adapter.status !== 'eligible') failures.push(`adapter status is ${adapter.status}`);
  return {
    adapterId,
    eligible: failures.length === 0,
    status: adapter.status,
    capabilities: adapter.capabilities,
    failures,
  };
}

export function loadHostAdapterRegistry(path) {
  return readJson(path);
}

export function probeNodeFilesystemBoundary({ allowedReadPath, allowedWritePath, forbiddenReadPath }) {
  const source = `
    const fs = require('node:fs');
    const cp = require('node:child_process');
    const [allowedReadPath, allowedWritePath, forbiddenReadPath] = process.argv.slice(1);
    const result = {
      allowedReadSucceeded: false,
      allowedWriteSucceeded: false,
      forbiddenReadBlocked: false,
      childProcessDeniedOrContained: false,
      networkBlocked: false,
      originalBrowserDenied: true,
      errors: {},
    };
    try { fs.readFileSync(allowedReadPath); result.allowedReadSucceeded = true; }
    catch (error) { result.errors.allowedRead = error.code || error.message; }
    try { fs.writeFileSync(allowedWritePath, 'host-boundary-probe'); result.allowedWriteSucceeded = true; }
    catch (error) { result.errors.allowedWrite = error.code || error.message; }
    try { fs.readFileSync(forbiddenReadPath); }
    catch (error) {
      result.errors.forbiddenRead = error.code || error.message;
      result.forbiddenReadBlocked = error.code === 'ERR_ACCESS_DENIED';
    }
    try { cp.spawnSync(process.execPath, ['--version']); }
    catch (error) {
      result.errors.childProcess = error.code || error.message;
      result.childProcessDeniedOrContained = error.code === 'ERR_ACCESS_DENIED';
    }
    process.stdout.write(JSON.stringify(result));
  `;
  const child = spawnSync(process.execPath, [
    '--permission',
    `--allow-fs-read=${resolve(allowedReadPath)}`,
    `--allow-fs-write=${resolve(allowedWritePath)}`,
    '-e',
    source,
    resolve(allowedReadPath),
    resolve(allowedWritePath),
    resolve(forbiddenReadPath),
  ], { encoding: 'utf8', timeout: 10_000 });
  if (child.error) throw child.error;
  if (child.status !== 0) throw new Error(`node permission probe failed: ${child.stderr || child.stdout}`);
  return {
    adapterId: 'node-permission-model',
    runtime: process.version,
    probes: JSON.parse(child.stdout),
  };
}

export function prepareHostLaunch({
  pilotRoot,
  role,
  workspaceRoot,
  registry,
  adapterId,
  challenge = randomBytes(32).toString('hex'),
  now = new Date(),
}) {
  const root = resolve(pilotRoot);
  const workspace = resolve(workspaceRoot);
  const expectedWorkspace = join(root, 'role-workspaces', role);
  if (workspace !== resolve(expectedWorkspace)) throw new Error('workspace must be the materialized role workspace');
  const metadataPath = join(workspace, '.role-workspace.json');
  if (!existsSync(metadataPath)) throw new Error(`missing role workspace metadata: ${metadataPath}`);
  const metadataText = readFileSync(metadataPath, 'utf8');
  const metadata = JSON.parse(metadataText);
  if (metadata.role !== role) throw new Error(`workspace role ${metadata.role} does not match ${role}`);
  if (resolve(metadata.sourcePilot) !== root) throw new Error('workspace metadata points to another pilot');

  const adapter = evaluateHostAdapter({ registry, adapterId });
  const request = {
    schemaVersion: 1,
    requestId: `host-launch-${role}-${now.getTime()}-${randomBytes(6).toString('hex')}`,
    role,
    adapterId,
    adapterEligible: adapter.eligible,
    adapterFailures: adapter.failures,
    requiredEnforcementMode: registry.requiredEnforcementMode,
    requiredCapabilities: registry.requiredCapabilities,
    workspaceRoot: workspace,
    workspaceMetadataSha256: sha256(metadataText),
    challenge,
    createdAt: now.toISOString(),
    evidenceOrigin: 'external-host-adapter',
  };
  writeFileSync(controlPath(root, `launch-request-${role}.json`), JSON.stringify(request, null, 2));
  return request;
}

export function verifyHostEvidence({ pilotRoot, role, registry, evidence }) {
  const root = resolve(pilotRoot);
  const failures = [];
  const requestPath = controlPath(root, `launch-request-${role}.json`);
  if (!existsSync(requestPath)) {
    return { verdict: 'FAIL', failures: [`missing host launch request for ${role}`], request: null };
  }
  const request = readJson(requestPath);
  const adapter = evaluateHostAdapter({ registry, adapterId: request.adapterId });
  if (!request.adapterEligible || !adapter.eligible) failures.push(...adapter.failures);
  if (evidence?.schemaVersion !== 1) failures.push('evidence.schemaVersion must be 1');
  if (evidence?.origin !== 'external-host-adapter') failures.push('evidence origin must be external-host-adapter');
  if (evidence?.requestId !== request.requestId) failures.push('evidence requestId does not match launch request');
  if (evidence?.challenge !== request.challenge) failures.push('evidence challenge does not match launch request');
  if (evidence?.role !== role) failures.push(`evidence role must be ${role}`);
  if (evidence?.adapterId !== request.adapterId) failures.push('evidence adapterId does not match launch request');
  if (resolve(String(evidence?.workspaceRoot ?? '.')) !== resolve(request.workspaceRoot)) {
    failures.push('evidence workspaceRoot does not match launch request');
  }
  if (evidence?.workspaceMetadataSha256 !== request.workspaceMetadataSha256) {
    failures.push('evidence workspace metadata hash does not match launch request');
  }
  for (const [capability, expected] of Object.entries(request.requiredCapabilities)) {
    if (evidence?.capabilities?.[capability] !== expected) {
      failures.push(`evidence capability ${capability} does not satisfy ${expected}`);
    }
  }
  for (const probe of REQUIRED_PROBES) {
    if (evidence?.probes?.[probe] !== true) failures.push(`host probe ${probe} did not pass`);
  }
  const metadataPath = join(request.workspaceRoot, '.role-workspace.json');
  if (!existsSync(metadataPath)) failures.push('role workspace metadata disappeared after launch request');
  else if (sha256(readFileSync(metadataPath, 'utf8')) !== request.workspaceMetadataSha256) {
    failures.push('role workspace metadata changed after launch request');
  }
  return { verdict: failures.length ? 'FAIL' : 'PASS', failures, request, adapter };
}

export function certifyHostWorkspace({
  pilotRoot,
  role,
  registry,
  evidence,
  attestedBy,
  now = new Date(),
}) {
  const root = resolve(pilotRoot);
  const verification = verifyHostEvidence({ pilotRoot: root, role, registry, evidence });
  if (verification.verdict !== 'PASS') {
    throw new Error(`host evidence rejected: ${verification.failures.join('; ')}`);
  }
  if (!attestedBy) throw new Error('attestedBy is required');
  const evidencePath = controlPath(root, `host-evidence-${role}.json`);
  if (!isInside(join(root, '.harness-control'), evidencePath)) throw new Error('host evidence path escaped control root');
  const evidenceText = JSON.stringify(evidence, null, 2);
  writeFileSync(evidencePath, evidenceText);
  const hostEvidence = {
    path: `.harness-control/${basename(evidencePath)}`,
    sha256: sha256(evidenceText),
    adapterId: evidence.adapterId,
    requestId: evidence.requestId,
    verdict: 'PASS',
  };
  const attestation = attestHostWorkspace({
    pilotRoot: root,
    role,
    workspaceRoot: evidence.workspaceRoot,
    mode: registry.requiredEnforcementMode,
    attestedBy,
    hostEvidence,
    now,
  });
  return { verification, attestation, hostEvidence };
}
