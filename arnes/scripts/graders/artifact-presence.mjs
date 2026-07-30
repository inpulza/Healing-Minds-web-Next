import { existsSync } from 'node:fs';
import { join } from 'node:path';

export function gradeArtifactPresence({ dir = '_arnes', sectionId, viewports, trialDir }) {
  const missing = [];
  if (!existsSync(join(trialDir, 'task.json'))) missing.push('task.json');
  if (!existsSync(join(trialDir, 'trial.json'))) missing.push('trial.json');
  if (!existsSync(join(trialDir, 'trace.jsonl'))) missing.push('trace.jsonl');

  for (const viewport of viewports) {
    const width = String(viewport).split('x')[0];
    const required = [
      join(dir, 'spec', `raw-${sectionId}-${width}.json`),
      join(dir, 'verify', `raw-clon-${sectionId}-${width}.json`),
      join(dir, 'verify', `${sectionId}-diff-${width}.json`),
    ];
    for (const path of required) {
      if (!existsSync(path)) missing.push(path);
    }
  }

  const hasInteractionFilm = viewports.some((viewport) =>
    existsSync(join(dir, 'interaction-film', sectionId, String(viewport), 'report.json')) ||
    existsSync(join(dir, 'video-probe', sectionId, 'report.json')));
  if (!hasInteractionFilm) missing.push(`interaction-film/${sectionId}/<viewport>/report.json`);

  return {
    grader: 'artifact-presence',
    verdict: missing.length ? 'FAIL' : 'PASS',
    sectionId,
    blocking: true,
    expected: { requiredArtifacts: 'task/trial/trace/raw-original/raw-clone/diff/interaction-film' },
    actual: { missing },
    artifactRefs: [],
    message: missing.length ? `Missing ${missing.length} required artifact(s)` : 'PASS',
  };
}
