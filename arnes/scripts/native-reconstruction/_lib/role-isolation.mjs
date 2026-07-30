import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs';
import { createHash, randomBytes } from 'node:crypto';
import {
  basename,
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
  sep,
} from 'node:path';
import {
  appendIntegrityLedger,
  defaultLedgerPaths,
  initIntegrityLedger,
  verifyIntegrityLedger,
} from './integrity-ledger.mjs';

export const PILOT_DIRECTORIES = [
  'forensics',
  'audit-baseline',
  'vault',
  'contract',
  'approved-assets',
  'deliverable',
  'reports',
  'role-workspaces',
  '.harness-control',
];

const REQUIRED_WORKER_ROLES = ['capturer', 'synthesizer', 'constructor', 'auditor'];
const OPERATIONS = new Set(['read', 'write', 'append']);

function normalizePath(value) {
  return value.split(sep).join('/').replace(/^\.\//, '').replace(/\/$/, '');
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function patternMatches(path, pattern) {
  const normalizedPath = normalizePath(path);
  const normalizedPattern = normalizePath(pattern);
  if (normalizedPattern.endsWith('/**')) {
    const root = normalizedPattern.slice(0, -3);
    return normalizedPath === root || normalizedPath.startsWith(`${root}/`);
  }
  return normalizedPath === normalizedPattern;
}

function matchingPattern(path, patterns = []) {
  return patterns.find((pattern) => patternMatches(path, pattern)) ?? null;
}

function resolveInside(root, requestedPath) {
  const absoluteRoot = resolve(root);
  const absolute = isAbsolute(requestedPath)
    ? resolve(requestedPath)
    : resolve(absoluteRoot, requestedPath);
  const rel = relative(absoluteRoot, absolute);
  const outside = rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel);
  return {
    absolute,
    relativePath: normalizePath(rel || '.'),
    outside,
  };
}

function listFiles(root) {
  if (!existsSync(root)) return [];
  const files = [];
  function visit(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const absolute = join(directory, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) visit(absolute);
      else if (entry.isFile()) files.push(absolute);
    }
  }
  visit(root);
  return files.sort();
}

function baseFromPattern(pattern) {
  return normalizePath(pattern).replace(/\/\*\*$/, '');
}

export function validateRolePolicy(policy) {
  const errors = [];
  if (policy?.schemaVersion !== 1) errors.push('policy.schemaVersion must be 1');
  if (policy?.requiredEnforcementMode !== 'host-workspace-root') {
    errors.push('policy.requiredEnforcementMode must be host-workspace-root');
  }
  const workerRoles = new Set(policy?.workerRoles ?? []);
  for (const role of REQUIRED_WORKER_ROLES) {
    if (!workerRoles.has(role)) errors.push(`policy.workerRoles missing ${role}`);
    const definition = policy?.roles?.[role];
    if (!definition) {
      errors.push(`policy.roles.${role} is required`);
      continue;
    }
    for (const field of ['read', 'write', 'append', 'denyRead', 'denyWrite']) {
      if (!Array.isArray(definition[field])) errors.push(`policy.roles.${role}.${field} must be an array`);
    }
  }
  const constructor = policy?.roles?.constructor;
  for (const forbidden of ['forensics/**', 'audit-baseline/**', 'vault/**']) {
    if (!constructor?.denyRead?.includes(forbidden)) {
      errors.push(`constructor.denyRead missing ${forbidden}`);
    }
  }
  if (policy?.externalCapabilities?.constructor?.length) {
    errors.push('constructor cannot have external capabilities');
  }
  return { ok: errors.length === 0, errors };
}

export function authorizeRoleAccess({ policy, pilotRoot, role, operation, requestedPath }) {
  if (!OPERATIONS.has(operation)) {
    return { allowed: false, reason: `invalid operation: ${operation}`, role, operation, path: String(requestedPath) };
  }
  const definition = policy?.roles?.[role];
  if (!definition) {
    return { allowed: false, reason: `unknown role: ${role}`, role, operation, path: String(requestedPath) };
  }
  const resolved = resolveInside(pilotRoot, String(requestedPath));
  if (resolved.outside) {
    return {
      allowed: false,
      reason: 'path is outside pilot root',
      role,
      operation,
      path: resolved.relativePath,
    };
  }

  const denyField = operation === 'read' ? 'denyRead' : operation === 'write' ? 'denyWrite' : null;
  const deniedBy = denyField ? matchingPattern(resolved.relativePath, definition[denyField]) : null;
  if (deniedBy) {
    return {
      allowed: false,
      reason: `denied by ${role}.${denyField}: ${deniedBy}`,
      role,
      operation,
      path: resolved.relativePath,
    };
  }

  const allowedBy = matchingPattern(resolved.relativePath, definition[operation]);
  return {
    allowed: Boolean(allowedBy),
    reason: allowedBy ? `allowed by ${role}.${operation}: ${allowedBy}` : `no ${role}.${operation} rule allows path`,
    role,
    operation,
    path: resolved.relativePath,
  };
}

export function appendAccessLedger({ pilotRoot, decision, now = new Date() }) {
  return appendIntegrityLedger({
    ...defaultLedgerPaths(pilotRoot),
    now,
    entry: {
    event: decision.allowed ? 'access_allowed' : 'access_denied',
    role: decision.role,
    operation: decision.operation,
    path: decision.path,
    allowed: decision.allowed,
    reason: decision.reason,
    },
  });
}

export function initPilot({
  pilotRoot,
  policy,
  pilotId = `native-pilot-${Date.now()}`,
  enforcementMode = 'materialized-view',
  canaryTokens = {},
} = {}) {
  const validation = validateRolePolicy(policy);
  if (!validation.ok) throw new Error(`invalid role policy: ${validation.errors.join('; ')}`);
  const root = resolve(pilotRoot);
  const manifestPath = join(root, 'pilot-manifest.json');
  if (existsSync(manifestPath)) throw new Error(`pilot already initialized: ${manifestPath}`);
  for (const directory of PILOT_DIRECTORIES) mkdirSync(join(root, directory), { recursive: true });

  const canaries = [
    {
      id: 'forensics-canary',
      path: 'forensics/.nr-canary.json',
      token: canaryTokens.forensics ?? `NR_CANARY_FORENSICS_${randomBytes(16).toString('hex')}`,
    },
    {
      id: 'vault-canary',
      path: 'vault/.nr-canary.json',
      token: canaryTokens.vault ?? `NR_CANARY_VAULT_${randomBytes(16).toString('hex')}`,
    },
  ];
  for (const canary of canaries) {
    writeFileSync(join(root, canary.path), JSON.stringify({ id: canary.id, token: canary.token }, null, 2));
  }

  const control = {
    schemaVersion: 1,
    canaries: canaries.map((canary) => ({ ...canary, sha256: sha256(canary.token) })),
  };
  const manifest = {
    schemaVersion: 1,
    pilotId,
    status: 'initialized',
    enforcementMode,
    requiredEnforcementMode: policy.requiredEnforcementMode,
  };
  writeFileSync(join(root, 'role-policy.json'), JSON.stringify(policy, null, 2));
  writeFileSync(join(root, '.harness-control', 'canaries.json'), JSON.stringify(control, null, 2));
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  initIntegrityLedger(defaultLedgerPaths(root));
  return { root, manifest, control };
}

export function materializeRoleWorkspace({ pilotRoot, policy, role, workspaceRoot }) {
  const definition = policy?.roles?.[role];
  if (!definition) throw new Error(`unknown role: ${role}`);
  const root = resolve(pilotRoot);
  const target = resolve(workspaceRoot ?? join(root, 'role-workspaces', role));
  if (existsSync(target)) throw new Error(`role workspace already exists: ${target}`);
  mkdirSync(target, { recursive: true });

  const copied = new Set();
  for (const pattern of definition.read) {
    const base = baseFromPattern(pattern);
    if (base === '.') continue;
    const source = join(root, base);
    if (!existsSync(source) || copied.has(base)) continue;
    const destination = join(target, base);
    mkdirSync(dirname(destination), { recursive: true });
    cpSync(source, destination, { recursive: true, force: false });
    copied.add(base);
  }
  for (const pattern of definition.write) {
    const base = baseFromPattern(pattern);
    if (base !== '.') mkdirSync(join(target, base), { recursive: true });
  }

  const metadata = {
    schemaVersion: 1,
    role,
    sourcePilot: root,
    workspaceRoot: target,
    requiredHostEnforcement: policy.requiredEnforcementMode,
    read: definition.read,
    write: definition.write,
    append: definition.append,
    denyRead: definition.denyRead,
    denyWrite: definition.denyWrite,
  };
  writeFileSync(join(target, '.role-workspace.json'), JSON.stringify(metadata, null, 2));
  return metadata;
}

export function attestHostWorkspace({
  pilotRoot,
  role,
  workspaceRoot,
  mode,
  attestedBy,
  hostEvidence = null,
  now = new Date(),
}) {
  if (!role) throw new Error('attestation role is required');
  if (!mode) throw new Error('attestation mode is required');
  if (!attestedBy) throw new Error('attestation attestedBy is required');
  if (mode === 'host-workspace-root' && hostEvidence?.verdict !== 'PASS') {
    throw new Error('host-workspace-root requires verified external host evidence');
  }
  const root = resolve(pilotRoot);
  const workspace = resolve(workspaceRoot);
  const metadataPath = join(workspace, '.role-workspace.json');
  if (!existsSync(metadataPath)) throw new Error(`missing role workspace metadata: ${metadataPath}`);
  const metadataText = readFileSync(metadataPath, 'utf8');
  const metadata = JSON.parse(metadataText);
  if (metadata.role !== role) throw new Error(`workspace role ${metadata.role} does not match ${role}`);
  if (resolve(metadata.sourcePilot) !== root) throw new Error('workspace metadata points to another pilot');
  const attestation = {
    schemaVersion: 1,
    role,
    mode,
    workspaceRoot: workspace,
    workspaceMetadataSha256: sha256(metadataText),
    attestedBy,
    attestedAt: now.toISOString(),
    hostEvidence,
  };
  const path = join(root, '.harness-control', `enforcement-${role}.json`);
  writeFileSync(path, JSON.stringify(attestation, null, 2));
  return attestation;
}

function findCanaryLeaks(root, control) {
  const outputRoots = ['contract', 'approved-assets', 'deliverable', 'reports'];
  const leaks = [];
  for (const outputRoot of outputRoots) {
    for (const file of listFiles(join(root, outputRoot))) {
      const content = readFileSync(file);
      for (const canary of control.canaries) {
        if (content.includes(Buffer.from(canary.token))) {
          leaks.push({
            canaryId: canary.id,
            path: normalizePath(relative(root, file)),
          });
        }
      }
    }
  }
  return leaks;
}

function readLedger(root) {
  const result = verifyIntegrityLedger(defaultLedgerPaths(root));
  return { entries: result.entries, errors: result.failures };
}

export function verifyRoleIsolation({ pilotRoot, policy }) {
  const root = resolve(pilotRoot);
  const failures = [];
  const manifest = JSON.parse(readFileSync(join(root, 'pilot-manifest.json'), 'utf8'));
  const control = JSON.parse(readFileSync(join(root, '.harness-control', 'canaries.json'), 'utf8'));
  const validation = validateRolePolicy(policy);
  if (!validation.ok) failures.push(...validation.errors);
  if (manifest.enforcementMode !== policy.requiredEnforcementMode) {
    failures.push(`enforcement mode ${manifest.enforcementMode} does not satisfy ${policy.requiredEnforcementMode}`);
  }

  const canaryLeaks = findCanaryLeaks(root, control);
  if (canaryLeaks.length) failures.push(`${canaryLeaks.length} canary leak(s) found outside quarantine`);

  const ledger = readLedger(root);
  failures.push(...ledger.errors);
  const invalidAllowedEntries = ledger.entries.filter((entry) => {
    if (!entry.allowed) return false;
    return !authorizeRoleAccess({
      policy,
      pilotRoot: root,
      role: entry.role,
      operation: entry.operation,
      requestedPath: entry.path,
    }).allowed;
  });
  if (invalidAllowedEntries.length) failures.push(`${invalidAllowedEntries.length} ledger entries allow forbidden access`);

  const requiredDenied = ['forensics/.nr-canary.json', 'vault/.nr-canary.json'];
  const deniedConstructorCanaries = requiredDenied.filter((path) => ledger.entries.some((entry) =>
    entry.role === 'constructor'
    && entry.operation === 'read'
    && entry.path === path
    && entry.allowed === false));
  if (deniedConstructorCanaries.length !== requiredDenied.length) {
    failures.push('missing denied constructor canary attempts for forensics and vault');
  }

  const constructorWorkspace = join(root, 'role-workspaces', 'constructor');
  if (!existsSync(constructorWorkspace)) failures.push('constructor workspace is missing');
  const forbiddenInConstructorView = ['forensics', 'audit-baseline', 'vault', '.harness-control']
    .filter((name) => existsSync(join(constructorWorkspace, name)));
  if (forbiddenInConstructorView.length) {
    failures.push(`constructor workspace exposes: ${forbiddenInConstructorView.join(', ')}`);
  }

  const attestationPath = join(root, '.harness-control', 'enforcement-constructor.json');
  let attestation = null;
  if (!existsSync(attestationPath)) {
    failures.push('constructor host enforcement attestation is missing');
  } else {
    try {
      attestation = JSON.parse(readFileSync(attestationPath, 'utf8'));
      if (attestation.mode !== policy.requiredEnforcementMode) {
        failures.push(`constructor attestation mode ${attestation.mode} does not satisfy ${policy.requiredEnforcementMode}`);
      }
      if (resolve(attestation.workspaceRoot) !== resolve(constructorWorkspace)) {
        failures.push('constructor attestation references another workspace root');
      }
      if (attestation.mode === policy.requiredEnforcementMode) {
        const evidence = attestation.hostEvidence;
        const expectedPath = '.harness-control/host-evidence-constructor.json';
        if (evidence?.verdict !== 'PASS' || evidence?.path !== expectedPath) {
          failures.push('constructor attestation lacks verified external host evidence');
        } else {
          const evidencePath = join(root, evidence.path);
          if (!existsSync(evidencePath)) failures.push('constructor host evidence file is missing');
          else if (sha256(readFileSync(evidencePath, 'utf8')) !== evidence.sha256) {
            failures.push('constructor host evidence hash does not match attestation');
          }
        }
      }
      const workspaceMetadataPath = join(constructorWorkspace, '.role-workspace.json');
      if (!existsSync(workspaceMetadataPath)) {
        failures.push('constructor workspace metadata is missing');
      } else {
        const metadataHash = sha256(readFileSync(workspaceMetadataPath, 'utf8'));
        if (attestation.workspaceMetadataSha256 !== metadataHash) {
          failures.push('constructor workspace metadata hash does not match attestation');
        }
      }
    } catch (error) {
      failures.push(`invalid constructor enforcement attestation: ${error.message}`);
    }
  }

  return {
    verifier: 'native-role-isolation',
    verdict: failures.length ? 'FAIL' : 'PASS',
    blocking: true,
    failures,
    canaryLeaks,
    deniedConstructorCanaries,
    enforcementMode: manifest.enforcementMode,
    requiredEnforcementMode: policy.requiredEnforcementMode,
    constructorAttestation: attestation,
    ledgerEntries: ledger.entries.length,
  };
}

export function loadRolePolicy(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}
