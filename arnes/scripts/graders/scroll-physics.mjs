import { existsSync } from 'node:fs';
import { join } from 'node:path';

export function gradeScrollPhysics({ dir = '_arnes', sectionId, viewports }) {
  const missing = [];
  for (const viewport of viewports) {
    const candidates = [
      join(dir, 'page-contract', String(viewport), 'scroll-physics.json'),
      join(dir, 'render-contract', sectionId, String(viewport), 'scroll-physics.json'),
      join(dir, 'interaction-film', sectionId, String(viewport), 'report.json'),
    ];
    if (!candidates.some((path) => existsSync(path))) missing.push(viewport);
  }
  return {
    grader: 'scroll-physics',
    verdict: missing.length ? 'FAIL' : 'PASS',
    sectionId,
    blocking: true,
    expected: { scrollPhysicsForEachViewport: viewports },
    actual: { missingViewports: missing },
    artifactRefs: [],
    message: missing.length ? `Missing scroll-physics evidence for ${missing.join(', ')}` : 'PASS',
  };
}
