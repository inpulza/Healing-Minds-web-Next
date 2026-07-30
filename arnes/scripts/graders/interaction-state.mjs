import { existsSync } from 'node:fs';
import { join } from 'node:path';

export function gradeInteractionState({ dir = '_arnes', sectionId, viewports }) {
  const missing = [];
  for (const viewport of viewports) {
    const candidates = [
      join(dir, 'interaction-film', sectionId, String(viewport), 'report.json'),
      join(dir, 'video-probe', sectionId, 'report.json'),
      join(dir, 'video-probe', `${sectionId}-${String(viewport).split('x')[0]}`, 'report.json'),
    ];
    if (!candidates.some((path) => existsSync(path))) missing.push(viewport);
  }
  return {
    grader: 'interaction-state',
    verdict: missing.length ? 'FAIL' : 'PASS',
    sectionId,
    blocking: true,
    expected: { interactionFilmForEachViewport: viewports },
    actual: { missingViewports: missing },
    artifactRefs: [],
    message: missing.length ? `Missing interaction-film evidence for ${missing.join(', ')}` : 'PASS',
  };
}
