import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { randomBytes } from 'node:crypto';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';

import {
  appendIntegrityLedger,
  canonicalJson,
  defaultLedgerPaths,
  sha256,
  verifyIntegrityLedger,
} from './integrity-ledger.mjs';

const FREEZABLE_ROOTS = new Set(['forensics', 'audit-baseline']);

function normalizePath(value) {
  return value.split(sep).join('/').replace(/^\.\//, '').replace(/\/$/, '');
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
  return files.sort((a, b) => a.localeCompare(b));
}

function rootRecord(pilotRoot, rootName) {
  if (!FREEZABLE_ROOTS.has(rootName)) throw new Error(`root is not freezable: ${rootName}`);
  const absoluteRoot = join(resolve(pilotRoot), rootName);
  if (!existsSync(absoluteRoot)) throw new Error(`missing artifact root: ${absoluteRoot}`);
  const files = listFiles(absoluteRoot).map((file) => ({
    path: normalizePath(relative(absoluteRoot, file)),
    size: statSync(file).size,
    sha256: sha256(readFileSync(file)),
  }));
  return {
    path: rootName,
    treeSha256: sha256(canonicalJson(files)),
    files,
  };
}

function compareRoot(expected, actual) {
  const expectedFiles = new Map(expected.files.map((file) => [file.path, file]));
  const actualFiles = new Map(actual.files.map((file) => [file.path, file]));
  const added = [...actualFiles.keys()].filter((path) => !expectedFiles.has(path)).sort();
  const removed = [...expectedFiles.keys()].filter((path) => !actualFiles.has(path)).sort();
  const modified = [...expectedFiles.keys()].filter((path) => {
    const current = actualFiles.get(path);
    const original = expectedFiles.get(path);
    return current && (current.sha256 !== original.sha256 || current.size !== original.size);
  }).sort();
  return { root: expected.path, added, removed, modified, treeMatches: expected.treeSha256 === actual.treeSha256 };
}

export function validateArtifactManifest(manifest) {
  const errors = [];
  if (manifest?.schemaVersion !== 1) errors.push('manifest.schemaVersion must be 1');
  for (const field of ['manifestId', 'pilotId', 'createdAt', 'frozenBy']) {
    if (typeof manifest?.[field] !== 'string' || !manifest[field]) errors.push(`manifest.${field} is required`);
  }
  if (!Array.isArray(manifest?.roots) || !manifest.roots.length) errors.push('manifest.roots must not be empty');
  const seen = new Set();
  for (const root of manifest?.roots ?? []) {
    if (!FREEZABLE_ROOTS.has(root?.path)) errors.push(`manifest root not allowed: ${root?.path}`);
    if (seen.has(root?.path)) errors.push(`manifest root duplicated: ${root?.path}`);
    seen.add(root?.path);
    if (!/^[a-f0-9]{64}$/.test(root?.treeSha256 ?? '')) errors.push(`manifest root ${root?.path} has invalid treeSha256`);
    if (!Array.isArray(root?.files)) errors.push(`manifest root ${root?.path} files must be an array`);
    for (const file of root?.files ?? []) {
      if (!file.path || isAbsolute(file.path) || file.path.includes('..')) errors.push(`invalid manifest file path: ${file.path}`);
      if (!Number.isInteger(file.size) || file.size < 0) errors.push(`invalid size for ${file.path}`);
      if (!/^[a-f0-9]{64}$/.test(file.sha256 ?? '')) errors.push(`invalid sha256 for ${file.path}`);
    }
  }
  return { ok: errors.length === 0, errors };
}

export function freezeArtifacts({
  pilotRoot,
  roots = ['forensics', 'audit-baseline'],
  frozenBy,
  now = new Date(),
}) {
  if (!frozenBy) throw new Error('frozenBy is required');
  const root = resolve(pilotRoot);
  const manifestPath = join(root, '.harness-control', 'manifest.json');
  const freezePath = join(root, '.harness-control', 'freeze.json');
  if (existsSync(manifestPath) || existsSync(freezePath)) throw new Error('artifact roots are already frozen');
  const pilotManifestPath = join(root, 'pilot-manifest.json');
  if (!existsSync(pilotManifestPath)) throw new Error('pilot-manifest.json is required');
  const pilot = JSON.parse(readFileSync(pilotManifestPath, 'utf8'));
  const uniqueRoots = [...new Set(roots.map(String))].sort();
  const manifest = {
    schemaVersion: 1,
    manifestId: `artifact-manifest-${now.getTime()}-${randomBytes(6).toString('hex')}`,
    pilotId: pilot.pilotId,
    createdAt: now.toISOString(),
    frozenBy,
    roots: uniqueRoots.map((name) => rootRecord(root, name)),
  };
  const validation = validateArtifactManifest(manifest);
  if (!validation.ok) throw new Error(`invalid artifact manifest: ${validation.errors.join('; ')}`);
  const ledger = defaultLedgerPaths(root);
  const ledgerBeforeFreeze = verifyIntegrityLedger(ledger);
  if (ledgerBeforeFreeze.verdict !== 'PASS') {
    throw new Error(`cannot freeze with invalid ledger: ${ledgerBeforeFreeze.failures.join('; ')}`);
  }
  const manifestText = JSON.stringify(manifest, null, 2);
  writeFileSync(manifestPath, manifestText);
  const freeze = {
    schemaVersion: 1,
    manifestPath: '.harness-control/manifest.json',
    manifestSha256: sha256(manifestText),
    frozenAt: now.toISOString(),
    frozenBy,
    roots: manifest.roots.map(({ path, treeSha256 }) => ({ path, treeSha256 })),
  };
  writeFileSync(freezePath, JSON.stringify(freeze, null, 2));
  appendIntegrityLedger({
    ...ledger,
    entry: {
      event: 'artifacts_frozen',
      role: 'control-plane',
      actor: frozenBy,
      manifestId: manifest.manifestId,
      manifestSha256: freeze.manifestSha256,
      roots: freeze.roots,
    },
    now,
  });
  return { manifest, freeze, manifestPath, freezePath };
}

export function verifyArtifactIntegrity({ pilotRoot }) {
  const root = resolve(pilotRoot);
  const failures = [];
  const manifestPath = join(root, '.harness-control', 'manifest.json');
  const freezePath = join(root, '.harness-control', 'freeze.json');
  if (!existsSync(manifestPath)) failures.push('missing frozen artifact manifest');
  if (!existsSync(freezePath)) failures.push('missing freeze record');
  if (failures.length) return { verdict: 'FAIL', failures, changes: [], ledger: null };

  let manifest;
  let freeze;
  try { manifest = JSON.parse(readFileSync(manifestPath, 'utf8')); }
  catch (error) { failures.push(`invalid artifact manifest JSON: ${error.message}`); }
  try { freeze = JSON.parse(readFileSync(freezePath, 'utf8')); }
  catch (error) { failures.push(`invalid freeze record JSON: ${error.message}`); }
  if (!manifest || !freeze) return { verdict: 'FAIL', failures, changes: [], ledger: null };

  const validation = validateArtifactManifest(manifest);
  failures.push(...validation.errors);
  const manifestHash = sha256(readFileSync(manifestPath, 'utf8'));
  if (freeze.manifestSha256 !== manifestHash) failures.push('frozen manifest hash mismatch');

  const changes = [];
  for (const expected of manifest.roots ?? []) {
    try {
      const actual = rootRecord(root, expected.path);
      const change = compareRoot(expected, actual);
      changes.push(change);
      if (!change.treeMatches) failures.push(`frozen root changed: ${expected.path}`);
    } catch (error) {
      failures.push(error.message);
    }
  }
  const ledger = verifyIntegrityLedger(defaultLedgerPaths(root));
  failures.push(...ledger.failures.map((failure) => `ledger: ${failure}`));
  return { verdict: failures.length ? 'FAIL' : 'PASS', failures, changes, ledger };
}

export function validateVaultPolicy(policy) {
  const errors = [];
  if (policy?.schemaVersion !== 1) errors.push('vault policy schemaVersion must be 1');
  if (typeof policy?.policyId !== 'string' || !policy.policyId) errors.push('vault policy policyId is required');
  if (policy?.defaultDeny !== true) errors.push('vault policy must default deny');
  if (!Number.isInteger(policy?.maxAuthorizationMinutes) || policy.maxAuthorizationMinutes < 1) {
    errors.push('vault policy maxAuthorizationMinutes must be a positive integer');
  }
  const expectedFields = ['authorizationId', 'authorizedBy', 'reason', 'scope', 'issuedAt', 'expiresAt'];
  for (const field of expectedFields) {
    if (!policy?.authorization?.requiredFields?.includes(field)) errors.push(`vault authorization missing required field ${field}`);
  }
  if (policy?.purge?.mode !== 'authorized-delete') errors.push('vault purge mode must be authorized-delete');
  if (policy?.purge?.verifyPathAbsent !== true) errors.push('vault purge must verify path absence');
  if (policy?.purge?.recordTombstone !== true) errors.push('vault purge must record a tombstone');
  if (policy?.purge?.secureEraseClaim !== false) errors.push('vault purge cannot claim secure erase');
  return { ok: errors.length === 0, errors };
}

function scopeMatches(path, pattern) {
  const normalizedPath = normalizePath(path);
  const normalizedPattern = normalizePath(pattern);
  if (normalizedPattern.endsWith('/**')) {
    const base = normalizedPattern.slice(0, -3);
    return normalizedPath === base || normalizedPath.startsWith(`${base}/`);
  }
  return normalizedPath === normalizedPattern;
}

export function checkVaultAuthorization({ policy, authorization, requestedPath, now = new Date() }) {
  const failures = [...validateVaultPolicy(policy).errors];
  for (const field of policy?.authorization?.requiredFields ?? []) {
    const value = authorization?.[field];
    if (value === undefined || value === null || value === '' || (Array.isArray(value) && !value.length)) {
      failures.push(`authorization.${field} is required`);
    }
  }
  const issuedAt = Date.parse(authorization?.issuedAt ?? '');
  const expiresAt = Date.parse(authorization?.expiresAt ?? '');
  if (!Number.isFinite(issuedAt)) failures.push('authorization.issuedAt is invalid');
  if (!Number.isFinite(expiresAt)) failures.push('authorization.expiresAt is invalid');
  if (Number.isFinite(issuedAt) && Number.isFinite(expiresAt)) {
    if (expiresAt <= issuedAt) failures.push('authorization expiresAt must be after issuedAt');
    if (expiresAt - issuedAt > policy.maxAuthorizationMinutes * 60_000) failures.push('authorization exceeds maximum duration');
    if (now.getTime() > expiresAt) failures.push('authorization is expired');
    if (now.getTime() < issuedAt) failures.push('authorization is not active yet');
  }
  const normalizedPath = normalizePath(String(requestedPath ?? ''));
  if (!normalizedPath.startsWith('vault/')) failures.push('requested path must be inside vault/');
  if (!(authorization?.scope ?? []).some((pattern) => scopeMatches(normalizedPath, pattern))) {
    failures.push('requested path is outside authorization scope');
  }
  return { allowed: failures.length === 0, failures, requestedPath: normalizedPath };
}
