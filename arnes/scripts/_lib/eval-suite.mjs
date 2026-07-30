import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { appendTrace } from './trace.mjs';

export const DEFAULT_REQUIRED_VIEWPORTS = [
  '390x844',
  '768x1024',
  '1024x900',
  '1440x900',
  '1920x1080',
  '2560x1440',
];

export const DEFAULT_REQUIRED_STATES = [
  'before-section',
  'section-enter',
  'initial',
  'settled',
  'scroll-slow',
  'scroll-fast',
  'hover-each-interactive',
  'focus-each-interactive',
  'click-each-safe-interactive',
  'section-exit',
  'after-section',
  'wide-layout',
];

export const REQUIRED_TASK_FIELDS = [
  'taskId',
  'targetUrl',
  'cloneUrl',
  'sectionId',
  'selectorOriginal',
  'selectorClone',
  'mode',
  'requiredViewports',
  'requiredStates',
  'passPolicy',
  'constructorMayApprove',
];

export const REQUIRED_TRIAL_FIELDS = [
  'trialId',
  'taskId',
  'role',
  'startedAt',
  'agent',
  'allowedActions',
  'forbiddenActions',
  'status',
];

const ROLES = new Set(['constructor', 'auditor']);
const STATUSES = new Set(['running', 'failed', 'passed', 'blocked']);

export function normalizeViewport(value) {
  if (typeof value === 'number') {
    const match = DEFAULT_REQUIRED_VIEWPORTS.find((vp) => vp.startsWith(`${value}x`));
    return match ?? `${value}x900`;
  }
  const text = String(value ?? '').trim();
  if (/^\d+$/.test(text)) return normalizeViewport(Number(text));
  return text;
}

export function requiredViewportsFromConfig(cfg = {}) {
  const configured = Array.isArray(cfg.REQUIRED_VIEWPORTS) ? cfg.REQUIRED_VIEWPORTS : cfg.VIEWPORTS;
  const normalized = Array.isArray(configured) ? configured.map(normalizeViewport) : [];
  return [...new Set([...DEFAULT_REQUIRED_VIEWPORTS, ...normalized])];
}

export function validateTask(task, cfg = {}) {
  const errors = [];
  for (const field of REQUIRED_TASK_FIELDS) {
    if (task?.[field] === undefined || task?.[field] === '') errors.push(`task.${field} is required`);
  }
  for (const field of ['targetUrl', 'cloneUrl']) {
    try { new URL(task?.[field]); }
    catch { errors.push(`task.${field} must be a valid URL`); }
  }
  if (task?.constructorMayApprove !== false) errors.push('task.constructorMayApprove must be false');
  if (task?.passPolicy !== 'all-required-graders-pass') {
    errors.push('task.passPolicy must be all-required-graders-pass');
  }
  const taskViewports = new Set((task?.requiredViewports ?? []).map(normalizeViewport));
  for (const viewport of requiredViewportsFromConfig(cfg)) {
    if (!taskViewports.has(viewport)) errors.push(`task.requiredViewports missing ${viewport}`);
  }
  const states = new Set(task?.requiredStates ?? []);
  for (const state of DEFAULT_REQUIRED_STATES) {
    if (!states.has(state)) errors.push(`task.requiredStates missing ${state}`);
  }
  return { ok: errors.length === 0, errors };
}

export function validateTrial(trial) {
  const errors = [];
  for (const field of REQUIRED_TRIAL_FIELDS) {
    if (trial?.[field] === undefined || trial?.[field] === '') errors.push(`trial.${field} is required`);
  }
  if (!ROLES.has(trial?.role)) errors.push('trial.role must be constructor or auditor');
  if (!STATUSES.has(trial?.status)) errors.push('trial.status is invalid');
  const forbidden = new Set(trial?.forbiddenActions ?? []);
  if (trial?.role === 'constructor' && !forbidden.has('write-audit-pass')) {
    errors.push('constructor trial must forbid write-audit-pass');
  }
  if (trial?.role === 'auditor' && !forbidden.has('edit-clone')) {
    errors.push('auditor trial must forbid edit-clone');
  }
  return { ok: errors.length === 0, errors };
}

export function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(value, null, 2));
}

export function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function safeTimestamp(date = new Date()) {
  return date.toISOString().replace(/[:.]/g, '-');
}

export function defaultActionsForRole(role) {
  if (role === 'auditor') {
    return {
      allowedActions: ['read-artifacts', 'run-probes', 'write-audit'],
      forbiddenActions: ['edit-clone', 'trust-constructor-summary'],
    };
  }
  return {
    allowedActions: ['read-contract', 'edit-clone', 'run-build', 'run-probes'],
    forbiddenActions: ['write-audit-pass', 'overwrite-original-evidence'],
  };
}

export function createTrial({ evalSuiteDir, task, role, agent = 'unknown-agent', now = new Date() }) {
  const taskValidation = validateTask(task);
  if (!taskValidation.ok) throw new Error(`Invalid task: ${taskValidation.errors.join('; ')}`);
  const actions = defaultActionsForRole(role);
  const trialId = `${task.sectionId}-${role}-${safeTimestamp(now)}`;
  const trial = {
    trialId,
    taskId: task.taskId,
    role,
    startedAt: now.toISOString(),
    endedAt: null,
    agent,
    allowedActions: actions.allowedActions,
    forbiddenActions: actions.forbiddenActions,
    status: 'running',
  };
  const trialValidation = validateTrial(trial);
  if (!trialValidation.ok) throw new Error(`Invalid trial: ${trialValidation.errors.join('; ')}`);

  const trialDir = join(evalSuiteDir, task.sectionId, trialId);
  mkdirSync(join(trialDir, 'artifacts'), { recursive: true });
  mkdirSync(join(trialDir, 'graders'), { recursive: true });
  writeFileSync(join(trialDir, 'task.json'), JSON.stringify(task, null, 2));
  writeFileSync(join(trialDir, 'trial.json'), JSON.stringify(trial, null, 2));
  writeFileSync(join(trialDir, 'outcome.json'), JSON.stringify({ status: 'running', sectionId: task.sectionId }, null, 2));
  writeFileSync(join(trialDir, 'trace.jsonl'), '');
  appendTrace({ trialDir, event: 'trial_started', data: { role, taskId: task.taskId } });
  return { trialId, trialDir, task, trial };
}

export function listTrials(evalSuiteDir, sectionId) {
  const sectionDir = join(evalSuiteDir, sectionId);
  if (!existsSync(sectionDir)) return [];
  return readdirSync(sectionDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const trialDir = join(sectionDir, entry.name);
      let trial = null;
      let aggregate = null;
      try { trial = readJson(join(trialDir, 'trial.json')); } catch { /* ignored */ }
      try { aggregate = readJson(join(trialDir, 'aggregate.json')); } catch { /* ignored */ }
      return {
        trialId: entry.name,
        trialDir,
        role: trial?.role ?? 'unknown',
        status: trial?.status ?? 'unknown',
        verdict: aggregate?.verdict ?? 'NO_AGGREGATE',
      };
    });
}

export function inferSectionFromTrialDir(trialDir) {
  const trialName = basename(trialDir);
  return trialName.split('-constructor-')[0].split('-auditor-')[0];
}
