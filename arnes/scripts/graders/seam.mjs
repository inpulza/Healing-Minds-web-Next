import { existsSync } from 'node:fs';
import { join } from 'node:path';

export function gradeSeam({ dir = '_arnes', sectionId, viewports }) {
  const missing = [];
  for (const viewport of viewports) {
    const before = join(dir, 'seams', sectionId, String(viewport), 'before.json');
    const after = join(dir, 'seams', sectionId, String(viewport), 'after.json');
    if (!existsSync(before) || !existsSync(after)) missing.push(viewport);
  }
  return {
    grader: 'seam',
    verdict: missing.length ? 'FAIL' : 'PASS',
    sectionId,
    blocking: true,
    expected: { beforeAndAfterSeamsForEachViewport: viewports },
    actual: { missingViewports: missing },
    artifactRefs: [],
    message: missing.length ? `Missing seam evidence for ${missing.join(', ')}` : 'PASS',
  };
}
