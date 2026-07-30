import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { mkdirSync } from 'node:fs';

function firstVisibleChild(node) {
  return (node?.hijos ?? []).find((child) => child?.rect?.w > 0 && child?.rect?.x !== undefined) ?? null;
}

function px(value) {
  if (typeof value === 'number') return value;
  const match = String(value ?? '').match(/(-?\d+(?:\.\d+)?)px/);
  return match ? Number(match[1]) : null;
}

function containerInfo(tree) {
  const section = tree?.rect ?? {};
  const container = firstVisibleChild(tree);
  const rect = container?.rect ?? section;
  const maxWidth = px(container?.estilos?.maxWidth);
  const centeredX = Math.round(Math.max(0, ((section.w ?? 0) - (rect.w ?? 0)) / 2));
  const centered = Math.abs((rect.x ?? 0) - centeredX) <= 24;
  const constrainedByWidth = (section.w ?? 0) > 0 && (rect.w ?? 0) < (section.w ?? 0) - 80;
  return {
    sectionWidth: section.w ?? null,
    containerX: rect.x ?? null,
    containerWidth: rect.w ?? null,
    declaredMaxWidth: maxWidth,
    centered,
    constrained: Boolean(constrainedByWidth || maxWidth),
  };
}

export function gradeMaxWidthContainerFromArtifacts({ sectionId, viewport, original, clone, artifactRefs = [] }) {
  const expected = containerInfo(original);
  const actual = containerInfo(clone);
  const cloneFullWidth = actual.sectionWidth &&
    actual.containerWidth >= actual.sectionWidth - 96 &&
    actual.containerX <= 48;
  const originalConstrained = expected.constrained && expected.centered;
  const fail = originalConstrained && cloneFullWidth;
  return {
    grader: 'max-width-container',
    verdict: fail ? 'FAIL' : 'PASS',
    sectionId,
    viewport,
    state: 'wide-layout',
    blocking: true,
    expected,
    actual,
    artifactRefs,
    message: fail
      ? `Original is constrained/centered but clone is full-width at ${viewport}`
      : 'PASS',
  };
}

export function gradeMaxWidthContainer({ sectionId, viewport, originalPath, clonePath }) {
  const artifactRefs = [originalPath, clonePath].filter(Boolean);
  if (!existsSync(originalPath) || !existsSync(clonePath)) {
    return {
      grader: 'max-width-container',
      verdict: 'FAIL',
      sectionId,
      viewport,
      state: 'wide-layout',
      blocking: true,
      expected: {},
      actual: {},
      artifactRefs,
      message: `Missing max-width artifacts for ${sectionId}@${viewport}`,
    };
  }
  return gradeMaxWidthContainerFromArtifacts({
    sectionId,
    viewport,
    original: JSON.parse(readFileSync(originalPath, 'utf8')),
    clone: JSON.parse(readFileSync(clonePath, 'utf8')),
    artifactRefs,
  });
}

export function writeMaxWidthResult(path, result) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(result, null, 2));
}
