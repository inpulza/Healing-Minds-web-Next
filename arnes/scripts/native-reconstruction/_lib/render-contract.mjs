import { readFileSync } from 'node:fs';
import { isAbsolute } from 'node:path';

const FORBIDDEN_KEYS = new Set([
  'html',
  'css',
  'script',
  'scripts',
  'class',
  'classname',
  'selector',
  'selectors',
  'module',
  'modules',
  'hydration',
  'providerid',
  'vendorid',
  'sourcecode',
  'domsnapshot',
  'runtimeurl',
]);

const PROVIDER_RESIDUE = /(?:framerusercontent|data-framer|__framer|\bframer\b|website-files\.com|webflow\.com|__wf|\bwebflow\b)/i;
const RAW_MARKUP = /<[a-z][^>]*>/i;
const RAW_STYLE_DECLARATION = /\b(?:display|position|background|color|transform|transition|animation)\s*:/i;
const EXTERNAL_URL = /https?:\/\//i;

function addUnique(errors, message) {
  if (!errors.includes(message)) errors.push(message);
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function semanticId(value) {
  return typeof value === 'string' && /^[a-z][a-z0-9-]*$/.test(value);
}

function scanForbidden(value, path, errors) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => scanForbidden(item, `${path}/${index}`, errors));
    return;
  }
  if (isObject(value)) {
    for (const [key, child] of Object.entries(value)) {
      const normalizedKey = key.toLowerCase();
      if (FORBIDDEN_KEYS.has(normalizedKey)) addUnique(errors, `${path}/${key}: forbidden implementation field`);
      if (PROVIDER_RESIDUE.test(key)) addUnique(errors, `${path}/${key}: provider-specific key`);
      scanForbidden(child, `${path}/${key}`, errors);
    }
    return;
  }
  if (typeof value !== 'string') return;
  if (PROVIDER_RESIDUE.test(value)) addUnique(errors, `${path}: provider residue is forbidden`);
  if (EXTERNAL_URL.test(value)) addUnique(errors, `${path}: external URL is forbidden in constructor contract`);
  if (RAW_MARKUP.test(value)) addUnique(errors, `${path}: raw markup is forbidden`);
  if (RAW_STYLE_DECLARATION.test(value)) addUnique(errors, `${path}: raw style declaration is forbidden`);
}

export function resolveContractPointer(contract, pointer) {
  if (pointer === '#') return contract;
  if (typeof pointer !== 'string' || !pointer.startsWith('#/')) return undefined;
  const tokens = pointer.slice(2).split('/').map((token) => token.replace(/~1/g, '/').replace(/~0/g, '~'));
  let value = contract;
  for (const token of tokens) {
    if (value === null || value === undefined || !Object.prototype.hasOwnProperty.call(value, token)) return undefined;
    value = value[token];
  }
  return value;
}

export function validateBrief(brief) {
  const errors = [];
  if (brief?.schemaVersion !== 1) errors.push('brief.schemaVersion must be 1');
  if (typeof brief?.briefId !== 'string' || !brief.briefId) errors.push('brief.briefId is required');
  if (!Array.isArray(brief?.requirements) || !brief.requirements.length) errors.push('brief.requirements must not be empty');
  const ids = new Set();
  for (const [index, requirement] of asArray(brief?.requirements).entries()) {
    if (!/^BR-[A-Z0-9-]+$/.test(requirement?.id ?? '')) errors.push(`brief requirement ${index} has invalid id`);
    if (ids.has(requirement?.id)) errors.push(`duplicate brief requirement id: ${requirement?.id}`);
    ids.add(requirement?.id);
    if (typeof requirement?.statement !== 'string' || !requirement.statement) errors.push(`brief requirement ${requirement?.id} statement is required`);
  }
  return { ok: errors.length === 0, errors };
}

function validateTrace({ trace, path, decisionIds, assertionIds, gapIds, errors }) {
  if (!isObject(trace)) {
    errors.push(`${path}.trace is required`);
    return;
  }
  if (!['measured', 'inferred'].includes(trace.basis)) errors.push(`${path}.trace basis must be measured or inferred`);
  if (typeof trace.confidence !== 'number' || trace.confidence < 0 || trace.confidence > 1) {
    errors.push(`${path}.trace confidence must be between 0 and 1`);
  }
  if (!Object.prototype.hasOwnProperty.call(trace, 'gap')) errors.push(`${path}.trace gap must be explicit`);
  if (trace.basis === 'inferred' && (typeof trace.gap !== 'string' || !trace.gap)) {
    errors.push(`${path}.trace inferred observations require a non-empty gap`);
  }
  if (typeof trace.gap === 'string' && !gapIds.has(trace.gap)) errors.push(`${path}.trace references unknown gap ${trace.gap}`);
  const decisions = asArray(trace.decisionIds);
  const assertions = asArray(trace.assertionIds);
  if (!decisions.length && !assertions.length) errors.push(`${path}.trace must reference a decision or assertion`);
  for (const id of decisions) if (!decisionIds.has(id)) errors.push(`${path}.trace references unknown decision ${id}`);
  for (const id of assertions) if (!assertionIds.has(id)) errors.push(`${path}.trace references unknown assertion ${id}`);
}

function collectId(set, id, label, errors) {
  if (!semanticId(id)) errors.push(`${label} has invalid semantic id: ${id}`);
  if (set.has(id)) errors.push(`duplicate semantic id: ${id}`);
  set.add(id);
}

export function lintRenderContract({ contract, brief }) {
  const errors = [];
  const briefValidation = validateBrief(brief);
  errors.push(...briefValidation.errors);
  if (contract?.schemaVersion !== 1) errors.push('contract.schemaVersion must be 1');
  if (typeof contract?.contractId !== 'string' || !contract.contractId) errors.push('contract.contractId is required');
  if (contract?.providerAgnostic !== true) errors.push('contract.providerAgnostic must be true');
  if (contract?.briefId !== brief?.briefId) errors.push('contract.briefId does not match brief.briefId');
  scanForbidden(contract, '#', errors);

  const decisions = asArray(contract?.decisions);
  const assertions = asArray(contract?.assertions);
  const gaps = asArray(contract?.gaps);
  const decisionIds = new Set();
  const assertionIds = new Set();
  const gapIds = new Set();
  for (const gap of gaps) {
    if (!/^G-[A-Z0-9-]+$/.test(gap?.id ?? '')) errors.push(`invalid gap id: ${gap?.id}`);
    if (gapIds.has(gap?.id)) errors.push(`duplicate gap id: ${gap?.id}`);
    gapIds.add(gap?.id);
  }
  for (const decision of decisions) {
    if (!/^D-[A-Z0-9-]+$/.test(decision?.id ?? '')) errors.push(`invalid decision id: ${decision?.id}`);
    if (decisionIds.has(decision?.id)) errors.push(`duplicate decision id: ${decision?.id}`);
    decisionIds.add(decision?.id);
    for (const field of ['question', 'selected', 'rationale']) {
      if (typeof decision?.[field] !== 'string' || !decision[field]) errors.push(`decision ${decision?.id} missing ${field}`);
    }
  }
  for (const assertion of assertions) {
    if (!/^A-[A-Z0-9-]+$/.test(assertion?.id ?? '')) errors.push(`invalid assertion id: ${assertion?.id}`);
    if (assertionIds.has(assertion?.id)) errors.push(`duplicate assertion id: ${assertion?.id}`);
    assertionIds.add(assertion?.id);
    if (resolveContractPointer(contract, assertion?.targetRef) === undefined) {
      errors.push(`assertion ${assertion?.id} targetRef does not resolve: ${assertion?.targetRef}`);
    }
    if (typeof assertion?.metric !== 'string' || !assertion.metric) errors.push(`assertion ${assertion?.id} metric is required`);
    if (!Object.prototype.hasOwnProperty.call(assertion ?? {}, 'expected')) errors.push(`assertion ${assertion?.id} expected is required`);
    if (!Object.prototype.hasOwnProperty.call(assertion ?? {}, 'tolerance')) errors.push(`assertion ${assertion?.id} tolerance is required`);
  }

  const briefIds = new Set(asArray(brief?.requirements).map((item) => item.id));
  const covered = new Set();
  for (const coverage of asArray(contract?.briefCoverage)) {
    if (!briefIds.has(coverage?.requirementId)) errors.push(`coverage references unknown brief requirement ${coverage?.requirementId}`);
    if (covered.has(coverage?.requirementId)) errors.push(`duplicate brief coverage ${coverage?.requirementId}`);
    covered.add(coverage?.requirementId);
    const refs = asArray(coverage?.contractRefs);
    const coverageAssertions = asArray(coverage?.assertionIds);
    if (!refs.length) errors.push(`brief coverage ${coverage?.requirementId} has no contractRefs`);
    if (!coverageAssertions.length) errors.push(`brief coverage ${coverage?.requirementId} has no assertionIds`);
    for (const pointer of refs) if (resolveContractPointer(contract, pointer) === undefined) errors.push(`brief coverage ${coverage?.requirementId} pointer does not resolve: ${pointer}`);
    for (const id of coverageAssertions) if (!assertionIds.has(id)) errors.push(`brief coverage ${coverage?.requirementId} references unknown assertion ${id}`);
  }
  for (const id of briefIds) if (!covered.has(id)) errors.push(`brief requirement is not covered: ${id}`);

  if (!isObject(contract?.tokens)) errors.push('contract.tokens is required');
  else {
    for (const key of ['colors', 'typography', 'spacing', 'radii', 'motion']) {
      if (!isObject(contract.tokens[key]) || !Object.keys(contract.tokens[key]).length) errors.push(`tokens.${key} must not be empty`);
    }
    validateTrace({ trace: contract.tokens.trace, path: 'tokens', decisionIds, assertionIds, gapIds, errors });
  }

  const semanticIds = new Set();
  const sectionIds = new Set();
  const componentIds = new Set();
  const assetIds = new Set();
  const pages = asArray(contract?.pages);
  const components = asArray(contract?.components);
  const assets = asArray(contract?.assets);
  if (!pages.length) errors.push('contract.pages must not be empty');
  if (!components.length) errors.push('contract.components must not be empty');

  for (const [pageIndex, page] of pages.entries()) {
    collectId(semanticIds, page?.id, `page ${pageIndex}`, errors);
    if (typeof page?.route !== 'string' || !page.route.startsWith('/')) errors.push(`page ${page?.id} route must start with /`);
    validateTrace({ trace: page?.trace, path: `page ${page?.id}`, decisionIds, assertionIds, gapIds, errors });
    const sections = asArray(page?.sections);
    if (!sections.length) errors.push(`page ${page?.id} must contain sections`);
    for (const [sectionIndex, section] of sections.entries()) {
      collectId(semanticIds, section?.id, `section ${sectionIndex}`, errors);
      sectionIds.add(section?.id);
      if (section?.order !== sectionIndex) errors.push(`section ${section?.id} order must equal ${sectionIndex}`);
      validateTrace({ trace: section?.trace, path: `section ${section?.id}`, decisionIds, assertionIds, gapIds, errors });
      const expectedPrevious = sectionIndex === 0 ? null : sections[sectionIndex - 1]?.id;
      const expectedNext = sectionIndex === sections.length - 1 ? null : sections[sectionIndex + 1]?.id;
      if (section?.seams?.previousSectionId !== expectedPrevious) errors.push(`section ${section?.id} previous seam must be ${expectedPrevious}`);
      if (section?.seams?.nextSectionId !== expectedNext) errors.push(`section ${section?.id} next seam must be ${expectedNext}`);
      if (typeof section?.seams?.overlapPx !== 'number') errors.push(`section ${section?.id} seams.overlapPx is required`);
      if (!['independent', 'overlap', 'shared-scroll', 'sticky-handoff'].includes(section?.seams?.coupling)) errors.push(`section ${section?.id} seams.coupling is invalid`);
      if (!['normal', 'grid', 'stack', 'sticky-stack', 'carousel'].includes(section?.layout?.flow)) errors.push(`section ${section?.id} layout.flow is invalid`);
      if (typeof section?.layout?.minHeightPx !== 'number' || section.layout.minHeightPx < 0) errors.push(`section ${section?.id} layout.minHeightPx is invalid`);
      const container = section?.layout?.container;
      if (!isObject(container)) errors.push(`section ${section?.id} layout.container is required`);
      else {
        if (container.mode === 'max-width' && !(typeof container.maxWidthPx === 'number' && container.maxWidthPx > 0)) errors.push(`section ${section?.id} max-width requires maxWidthPx`);
        if (container.mode === 'full-width' && container.maxWidthPx !== null) errors.push(`section ${section?.id} full-width requires maxWidthPx null`);
        if (!['start', 'center', 'end'].includes(container.alignment)) errors.push(`section ${section?.id} container alignment is invalid`);
      }
    }
  }

  for (const [componentIndex, component] of components.entries()) {
    collectId(semanticIds, component?.id, `component ${componentIndex}`, errors);
    componentIds.add(component?.id);
  }
  for (const [assetIndex, asset] of assets.entries()) {
    collectId(semanticIds, asset?.id, `asset ${assetIndex}`, errors);
    assetIds.add(asset?.id);
  }

  for (const page of pages) {
    for (const section of asArray(page?.sections)) {
      for (const id of asArray(section?.componentIds)) if (!componentIds.has(id)) errors.push(`section ${section?.id} references unknown component ${id}`);
      for (const seamKey of ['previousSectionId', 'nextSectionId']) {
        const seam = section?.seams?.[seamKey];
        if (seam !== null && !sectionIds.has(seam)) errors.push(`section ${section?.id} references unknown seam section ${seam}`);
      }
    }
  }

  for (const component of components) {
    const path = `component ${component?.id}`;
    if (!sectionIds.has(component?.sectionId)) errors.push(`${path} references unknown section ${component?.sectionId}`);
    if (typeof component?.kind !== 'string' || !component.kind) errors.push(`${path}.kind is required`);
    for (const field of ['geometry', 'typography', 'paint', 'overflow']) if (!isObject(component?.[field]) || !Object.keys(component[field]).length) errors.push(`${path}.${field} must not be empty`);
    if (!Array.isArray(component?.layers)) errors.push(`${path}.layers must be an array`);
    else for (const layer of component.layers) if (layer?.id) collectId(semanticIds, layer.id, `${path} layer`, errors);
    validateTrace({ trace: component?.trace, path, decisionIds, assertionIds, gapIds, errors });
    const rules = asArray(component?.responsive);
    if (!rules.length) errors.push(`${path} requires responsive rules`);
    for (const rule of rules) {
      collectId(semanticIds, rule?.id, `${path} responsive rule`, errors);
      if (typeof rule?.minWidthPx !== 'number' || rule.minWidthPx < 0) errors.push(`${path} responsive ${rule?.id} minWidthPx is invalid`);
      if (rule?.maxWidthPx !== null && (typeof rule?.maxWidthPx !== 'number' || rule.maxWidthPx < rule.minWidthPx)) errors.push(`${path} responsive ${rule?.id} maxWidthPx is invalid`);
      if (!isObject(rule?.deltas) || !Object.keys(rule.deltas).length) errors.push(`${path} responsive ${rule?.id} deltas must not be empty`);
      validateTrace({ trace: rule?.trace, path: `${path} responsive ${rule?.id}`, decisionIds, assertionIds, gapIds, errors });
    }
    const sortedRules = [...rules].sort((a, b) => (a?.minWidthPx ?? 0) - (b?.minWidthPx ?? 0));
    if (sortedRules.length && sortedRules[0]?.minWidthPx !== 0) errors.push(`${path} responsive coverage must start at 0px`);
    for (let index = 1; index < sortedRules.length; index += 1) {
      const previous = sortedRules[index - 1];
      const current = sortedRules[index];
      if (previous?.maxWidthPx === null || current?.minWidthPx !== previous?.maxWidthPx + 1) errors.push(`${path} responsive ranges must be contiguous and non-overlapping`);
    }
    if (sortedRules.length && sortedRules.at(-1)?.maxWidthPx !== null) errors.push(`${path} responsive coverage must have an open upper range`);
    const states = asArray(component?.states);
    if (!states.length) errors.push(`${path} requires states`);
    if (!states.some((state) => state?.trigger?.type === 'initial')) errors.push(`${path} requires an initial state`);
    for (const state of states) {
      collectId(semanticIds, state?.id, `${path} state`, errors);
      if (!['initial', 'hover', 'focus', 'click', 'scroll', 'timer', 'drag'].includes(state?.trigger?.type)) errors.push(`${path} state ${state?.id} trigger is invalid`);
      if (!Array.isArray(state?.preconditions)) errors.push(`${path} state ${state?.id} preconditions must be an array`);
      if (!isObject(state?.result) || !Object.keys(state.result).length) errors.push(`${path} state ${state?.id} result must not be empty`);
      if (typeof state?.motion?.durationMs !== 'number' || state.motion.durationMs < 0) errors.push(`${path} state ${state?.id} durationMs is invalid`);
      if (typeof state?.motion?.delayMs !== 'number' || state.motion.delayMs < 0) errors.push(`${path} state ${state?.id} delayMs is invalid`);
      if (typeof state?.motion?.easing !== 'string' || !state.motion.easing) errors.push(`${path} state ${state?.id} easing is required`);
      if (!isObject(state?.motion?.physics) || !Object.keys(state.motion.physics).length) errors.push(`${path} state ${state?.id} physics is required`);
      validateTrace({ trace: state?.trace, path: `${path} state ${state?.id}`, decisionIds, assertionIds, gapIds, errors });
    }
    if (!isObject(component?.sticky) || typeof component.sticky.enabled !== 'boolean') errors.push(`${path} sticky contract is required`);
    if (component?.sticky?.enabled === true && typeof component.sticky.topPx !== 'number') errors.push(`${path} sticky topPx is required when enabled`);
    if (component?.sticky?.enabled === false && component.sticky.topPx !== null) errors.push(`${path} sticky topPx must be null when disabled`);
    if (typeof component?.scroll?.root !== 'string' || !component.scroll.root) errors.push(`${path} scroll.root is required`);
    if (typeof component?.scroll?.linked !== 'boolean') errors.push(`${path} scroll.linked must be boolean`);
    if (!isObject(component?.scroll?.physics) || !Object.keys(component.scroll.physics).length) errors.push(`${path} scroll.physics is required`);
    if (!['none', 'image', 'video', 'audio', 'canvas', '3d'].includes(component?.media?.kind)) errors.push(`${path} media.kind is invalid`);
    const mediaAssets = asArray(component?.media?.assetIds);
    if (component?.media?.kind === 'none' && mediaAssets.length) errors.push(`${path} media none cannot reference assets`);
    if (component?.media?.kind !== 'none' && !mediaAssets.length) errors.push(`${path} media requires assetIds`);
    for (const id of mediaAssets) if (!assetIds.has(id)) errors.push(`${path} references unknown asset ${id}`);
    if (typeof component?.accessibility?.role !== 'string' || !component.accessibility.role) errors.push(`${path} accessibility.role is required`);
    if (!Array.isArray(component?.accessibility?.keyboard)) errors.push(`${path} accessibility.keyboard must be an array`);
    if (typeof component?.accessibility?.reducedMotion !== 'string' || !component.accessibility.reducedMotion) errors.push(`${path} accessibility.reducedMotion is required`);
  }

  for (const asset of assets) {
    const path = `asset ${asset?.id}`;
    if (typeof asset?.localPath !== 'string' || !asset.localPath.startsWith('approved-assets/') || isAbsolute(asset.localPath) || asset.localPath.includes('..')) errors.push(`${path} localPath must stay inside approved-assets/`);
    if (asset?.approval !== 'approved') errors.push(`${path} must be approved`);
    if (!['image', 'video', 'audio', 'font', 'model', 'data'].includes(asset?.kind)) errors.push(`${path} kind is invalid`);
    if (!['client-owned', 'licensed', 'generated', 'temporary-reference'].includes(asset?.provenance)) errors.push(`${path} provenance is invalid`);
    if (!['eager', 'lazy', 'preload'].includes(asset?.loading)) errors.push(`${path} loading is invalid`);
    if (typeof asset?.substitution !== 'string') errors.push(`${path} substitution is required`);
    validateTrace({ trace: asset?.trace, path, decisionIds, assertionIds, gapIds, errors });
  }

  for (const gap of gaps) {
    if (resolveContractPointer(contract, gap?.targetRef) === undefined) errors.push(`gap ${gap?.id} targetRef does not resolve`);
    if (gap?.blocking === true) errors.push(`blocking gap remains unresolved: ${gap?.id}`);
  }
  return { verdict: errors.length ? 'FAIL' : 'PASS', errors };
}

export function loadRenderContract(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}
