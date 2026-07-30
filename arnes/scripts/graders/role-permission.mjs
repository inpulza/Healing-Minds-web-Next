import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export function gradeRolePermission({ trialDir, sectionId }) {
  const trialPath = join(trialDir, 'trial.json');
  const auditPath = join(trialDir, 'verdict.md');
  const failures = [];
  let trial = null;
  try {
    trial = JSON.parse(readFileSync(trialPath, 'utf8'));
  } catch {
    failures.push('missing or invalid trial.json');
  }

  if (trial?.role === 'constructor') {
    const forbidden = new Set(trial.forbiddenActions ?? []);
    if (!forbidden.has('write-audit-pass')) failures.push('constructor trial does not forbid write-audit-pass');
    if (existsSync(auditPath) && /\b(RE)?AUDIT_PASS\b/.test(readFileSync(auditPath, 'utf8'))) {
      failures.push('constructor trial wrote an audit PASS');
    }
  }

  if (trial?.role === 'auditor') {
    const forbidden = new Set(trial.forbiddenActions ?? []);
    if (!forbidden.has('edit-clone')) failures.push('auditor trial does not forbid edit-clone');
  }

  return {
    grader: 'role-permission',
    verdict: failures.length ? 'FAIL' : 'PASS',
    sectionId,
    blocking: true,
    expected: { constructorCannotApprove: true, auditorCannotEditClone: true },
    actual: { role: trial?.role ?? 'unknown', failures },
    artifactRefs: [trialPath],
    message: failures.length ? failures.join('; ') : 'PASS',
  };
}
