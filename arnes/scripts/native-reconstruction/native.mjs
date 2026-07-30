#!/usr/bin/env node
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
} from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  freezeArtifacts,
  verifyArtifactIntegrity,
} from './_lib/artifact-integrity.mjs';
import {
  defaultLedgerPaths,
  sha256,
  verifyIntegrityLedger,
} from './_lib/integrity-ledger.mjs';
import {
  lintRenderContract,
  loadRenderContract,
} from './_lib/render-contract.mjs';
import {
  PILOT_DIRECTORIES,
  initPilot,
  loadRolePolicy,
  materializeRoleWorkspace,
  verifyRoleIsolation,
} from './_lib/role-isolation.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(HERE, '..', '..');
const TEMPLATES = join(PACKAGE_ROOT, 'plantillas', 'native-reconstruction');
const FIXTURES = join(PACKAGE_ROOT, 'tests', 'fixtures', 'native-reconstruction');

function parseArgs(argv) {
  const parsed = { _: [] };
  for (const item of argv) {
    if (!item.startsWith('--')) {
      parsed._.push(item);
      continue;
    }
    const [key, ...value] = item.slice(2).split('=');
    parsed[key] = value.length ? value.join('=') : true;
  }
  return parsed;
}

function json(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function required(args, key) {
  const value = args[key];
  if (!value || value === true) throw new Error(`missing --${key}=VALUE`);
  return String(value);
}

function output(payload, exitCode = 0) {
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
  process.exit(exitCode);
}

function result(id, status, message, blocking = status === 'FAIL', details = null) {
  return { id, status, blocking, message, ...(details ? { details } : {}) };
}

function safely(check, fallbackMessage) {
  try {
    return check();
  } catch (error) {
    return { error: error.message || fallbackMessage };
  }
}

function init(args) {
  const pilotRoot = resolve(required(args, 'pilot-root'));
  const policy = loadRolePolicy(join(TEMPLATES, 'role-policy.json'));
  const pilotId = String(args['pilot-id'] ?? `native-pilot-${Date.now()}`);
  const initialized = initPilot({
    pilotRoot,
    policy,
    pilotId,
    enforcementMode: 'materialized-view',
  });

  cpSync(join(TEMPLATES, 'vault-policy.json'), join(pilotRoot, 'vault', 'policy.json'));
  cpSync(join(TEMPLATES, 'host-adapters.json'), join(pilotRoot, '.harness-control', 'host-adapters.json'));

  if (args['with-fixture']) {
    cpSync(join(FIXTURES, 'brief.valid.json'), join(pilotRoot, 'contract', 'brief.json'));
    cpSync(join(FIXTURES, 'render-contract.valid.json'), join(pilotRoot, 'contract', 'render-contract.json'));
  }

  const workspace = materializeRoleWorkspace({
    pilotRoot,
    policy,
    role: 'constructor',
  });

  output({
    command: 'native init',
    verdict: 'PASS',
    pilotRoot,
    pilotId,
    status: 'SCAFFOLD_ONLY',
    initialized: initialized.manifest,
    constructorWorkspace: workspace.workspaceRoot,
    next: [
      `native doctor --pilot-root=${pilotRoot} --level=scaffold`,
      'Capture a real forensic baseline before construction.',
      'Calibrate repeated-capture noise before freezing artifacts.',
    ],
  });
}

function contractCheck(pilotRoot) {
  const briefPath = join(pilotRoot, 'contract', 'brief.json');
  const contractPath = join(pilotRoot, 'contract', 'render-contract.json');
  if (!existsSync(briefPath) || !existsSync(contractPath)) {
    return result('NR-05', 'PENDING', 'Brief and Render Contract are not both present.', false);
  }
  const lint = lintRenderContract({
    brief: loadRenderContract(briefPath),
    contract: loadRenderContract(contractPath),
  });
  return lint.verdict === 'PASS'
    ? result('NR-05', 'PASS', 'Render Contract is valid and provider-agnostic.', false, lint)
    : result('NR-05', 'FAIL', 'Render Contract failed lint.', true, lint);
}

function calibrationCheck(pilotRoot) {
  const matrixPath = join(pilotRoot, 'audit-baseline', 'calibration', 'calibration-matrix.json');
  const freezePath = join(pilotRoot, 'audit-baseline', 'calibration', 'calibration-freeze.json');
  if (!existsSync(matrixPath) || !existsSync(freezePath)) {
    return result('NR-04', 'PENDING', 'Repeated-capture calibration is not frozen.', false);
  }
  const matrix = safely(() => json(matrixPath));
  const freeze = safely(() => json(freezePath));
  if (matrix.error || freeze.error) {
    return result('NR-04', 'FAIL', 'Calibration artifacts are unreadable.', true, { matrix, freeze });
  }
  const failures = [];
  if (matrix.verdict !== 'PASS') failures.push(`matrix verdict is ${matrix.verdict}`);
  if (matrix.minimumRepetitions < 5) failures.push('minimumRepetitions is below 5');
  if (!Array.isArray(matrix.cells) || !matrix.cells.length) failures.push('matrix has no cells');
  if (matrix.cells?.some((cell) => cell.sampleCount < matrix.minimumRepetitions)) {
    failures.push('at least one matrix cell has too few samples');
  }
  if (freeze.matrixSha256 !== sha256(readFileSync(matrixPath, 'utf8'))) failures.push('frozen file hash does not match matrix file');
  if (freeze.analysisSha256 !== matrix.matrixSha256) failures.push('analysis hash does not match matrix contents');
  return failures.length
    ? result('NR-04', 'FAIL', 'Noise calibration is invalid.', true, { failures })
    : result('NR-04', 'PASS', 'Repeated-capture noise matrix is frozen.', false, {
      cells: matrix.cells.length,
      minimumRepetitions: matrix.minimumRepetitions,
      matrixSha256: matrix.matrixSha256,
    });
}

function evidenceFiles(root) {
  if (!existsSync(root)) return [];
  const files = [];
  function visit(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const absolute = join(directory, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) visit(absolute);
      else if (entry.isFile() && entry.name !== '.nr-canary.json') files.push(absolute);
    }
  }
  visit(root);
  return files;
}

function integrityCheck(pilotRoot) {
  const ledger = safely(() => verifyIntegrityLedger(defaultLedgerPaths(pilotRoot)));
  if (ledger.error) return result('NR-03-ledger', 'FAIL', ledger.error, true);
  return ledger.verdict === 'PASS'
    ? result('NR-03-ledger', 'PASS', 'Append-only integrity ledger is valid.', false, { entries: ledger.entries.length })
    : result('NR-03-ledger', 'FAIL', 'Integrity ledger failed verification.', true, ledger);
}

function freezeCheck(pilotRoot) {
  const manifestPath = join(pilotRoot, '.harness-control', 'manifest.json');
  if (!existsSync(manifestPath)) {
    return result('NR-03-freeze', 'PENDING', 'Forensics and baseline artifacts are not frozen.', false);
  }
  const verification = safely(() => verifyArtifactIntegrity({ pilotRoot }));
  if (verification.error) return result('NR-03-freeze', 'FAIL', verification.error, true);
  return verification.verdict === 'PASS'
    ? result('NR-03-freeze', 'PASS', 'Frozen artifacts match their manifest.', false, verification)
    : result('NR-03-freeze', 'FAIL', 'Frozen artifacts changed after freeze.', true, verification);
}

function roleCheck(pilotRoot) {
  const policyPath = join(pilotRoot, 'role-policy.json');
  if (!existsSync(policyPath)) return result('NR-02', 'FAIL', 'Role policy is missing.', true);
  const verification = safely(() => verifyRoleIsolation({
    pilotRoot,
    policy: loadRolePolicy(policyPath),
  }));
  if (verification.error) return result('NR-02', 'FAIL', verification.error, true);
  return verification.verdict === 'PASS'
    ? result('NR-02', 'PASS', 'Constructor isolation has verified external host evidence.', false, verification)
    : result('NR-02', 'BLOCKED', 'External host isolation is not certified; construction must not start.', true, verification);
}

function structureCheck(pilotRoot) {
  const missing = [
    ...PILOT_DIRECTORIES.filter((directory) => !existsSync(join(pilotRoot, directory))),
    ...['pilot-manifest.json', 'role-policy.json', 'ledger.jsonl']
      .filter((path) => !existsSync(join(pilotRoot, path))),
  ];
  return missing.length
    ? result('pilot-structure', 'FAIL', 'Pilot structure is incomplete.', true, { missing })
    : result('pilot-structure', 'PASS', 'Pilot structure is complete.', false);
}

function diagnose(args, forceLevel = null) {
  const pilotRoot = resolve(required(args, 'pilot-root'));
  const level = forceLevel ?? String(args.level ?? 'scaffold');
  if (!['scaffold', 'construct'].includes(level)) throw new Error('--level must be scaffold or construct');

  const checks = [
    structureCheck(pilotRoot),
    integrityCheck(pilotRoot),
    contractCheck(pilotRoot),
    calibrationCheck(pilotRoot),
    freezeCheck(pilotRoot),
    roleCheck(pilotRoot),
  ];
  const byId = Object.fromEntries(checks.map((check) => [check.id, check]));
  const scaffoldRequired = ['pilot-structure', 'NR-03-ledger', 'NR-05'];
  const constructRequired = [...scaffoldRequired, 'NR-04', 'NR-03-freeze', 'NR-02'];
  const ready = (ids) => ids.every((id) => byId[id]?.status === 'PASS');
  const scaffoldReady = ready(scaffoldRequired);
  const constructionReady = ready(constructRequired);
  const requestedReady = level === 'construct' ? constructionReady : scaffoldReady;
  return {
    command: `native doctor --level=${level}`,
    verdict: requestedReady ? 'PASS' : 'FAIL',
    pilotRoot,
    level,
    status: constructionReady ? 'READY_FOR_CONSTRUCTION' : scaffoldReady ? 'SCAFFOLD_ONLY' : 'NOT_READY',
    scaffoldReady,
    constructionReady,
    checks,
  };
}

function doctor(args) {
  const report = diagnose(args);
  output(report, report.verdict === 'PASS' ? 0 : 1);
}

function lint(args) {
  const pilotRoot = resolve(required(args, 'pilot-root'));
  const briefPath = resolve(String(args.brief ?? join(pilotRoot, 'contract', 'brief.json')));
  const contractPath = resolve(String(args.contract ?? join(pilotRoot, 'contract', 'render-contract.json')));
  const report = lintRenderContract({
    brief: loadRenderContract(briefPath),
    contract: loadRenderContract(contractPath),
  });
  output({ command: 'native lint', pilotRoot, briefPath, contractPath, ...report }, report.verdict === 'PASS' ? 0 : 1);
}

function calibrate(rawArgs) {
  const executable = join(HERE, 'noise-calibration.mjs');
  const child = spawnSync(process.execPath, [executable, ...rawArgs], {
    encoding: 'utf8',
    stdio: ['inherit', 'pipe', 'pipe'],
  });
  if (child.stdout) process.stdout.write(child.stdout);
  if (child.stderr) process.stderr.write(child.stderr);
  process.exit(child.status ?? 1);
}

function freeze(args) {
  const pilotRoot = resolve(required(args, 'pilot-root'));
  const frozenBy = required(args, 'actor');
  const prerequisites = [contractCheck(pilotRoot), calibrationCheck(pilotRoot)];
  const capturedForensics = evidenceFiles(join(pilotRoot, 'forensics'));
  if (!capturedForensics.length) {
    prerequisites.push(result('forensics-evidence', 'FAIL', 'No forensic evidence exists beyond the isolation canary.', true));
  }
  const failures = prerequisites.filter((check) => check.status !== 'PASS');
  if (failures.length) {
    output({
      command: 'native freeze',
      verdict: 'FAIL',
      pilotRoot,
      error: 'Artifacts cannot be frozen before contract, calibration, and forensic evidence pass.',
      checks: prerequisites,
    }, 1);
  }
  const report = freezeArtifacts({ pilotRoot, frozenBy });
  output({ command: 'native freeze', verdict: 'PASS', pilotRoot, ...report });
}

function verify(args) {
  const report = diagnose({ ...args, level: 'construct' }, 'construct');
  output({ ...report, command: 'native verify' }, report.verdict === 'PASS' ? 0 : 1);
}

function help(exitCode = 0) {
  process.stdout.write(`Native Reconstruction V2 beta\n\n`);
  process.stdout.write(`Usage:\n`);
  process.stdout.write(`  native init --pilot-root=PATH [--pilot-id=ID] [--with-fixture]\n`);
  process.stdout.write(`  native doctor --pilot-root=PATH [--level=scaffold|construct]\n`);
  process.stdout.write(`  native lint --pilot-root=PATH [--brief=FILE] [--contract=FILE]\n`);
  process.stdout.write(`  native calibrate --url=URL --selector=CSS --owner=NAME [--pilot-root=PATH]\n`);
  process.stdout.write(`  native freeze --pilot-root=PATH --actor=NAME\n`);
  process.stdout.write(`  native verify --pilot-root=PATH\n\n`);
  process.stdout.write(`Construction is blocked until doctor --level=construct returns PASS.\n`);
  process.exit(exitCode);
}

const raw = process.argv.slice(2);
const [command, ...rest] = raw;
const args = parseArgs(rest);

try {
  const handler = { init, doctor, lint, freeze, verify }[command];
  if (handler) handler(args);
  else if (command === 'calibrate') calibrate(rest);
  else help(command ? 2 : 0);
} catch (error) {
  output({ command: `native ${command ?? ''}`.trim(), verdict: 'FAIL', error: error.message }, 2);
}
