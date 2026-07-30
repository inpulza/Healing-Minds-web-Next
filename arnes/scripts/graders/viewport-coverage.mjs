import { existsSync } from 'node:fs';
import { join } from 'node:path';

export function gradeViewportCoverage({ dir = '_arnes', sectionId, viewports }) {
  const missing = [];
  for (const viewport of viewports) {
    const width = String(viewport).split('x')[0];
    const original = join(dir, 'spec', `raw-${sectionId}-${width}.json`);
    const clone = join(dir, 'verify', `raw-clon-${sectionId}-${width}.json`);
    if (!existsSync(original) || !existsSync(clone)) missing.push(viewport);
  }

  return {
    grader: 'viewport-coverage',
    verdict: missing.length ? 'FAIL' : 'PASS',
    sectionId,
    blocking: true,
    expected: { viewports },
    actual: { missingViewports: missing },
    artifactRefs: [],
    message: missing.length ? `Missing evidence for viewport(s): ${missing.join(', ')}` : 'PASS',
  };
}
