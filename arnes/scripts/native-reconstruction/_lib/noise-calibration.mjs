import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

import {
  appendIntegrityLedger,
  canonicalJson,
  defaultLedgerPaths,
  sha256,
} from './integrity-ledger.mjs';

function round(value, digits = 4) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function quantile(sorted, q) {
  if (!sorted.length) return 0;
  const position = (sorted.length - 1) * q;
  const base = Math.floor(position);
  const rest = position - base;
  return sorted[base + 1] === undefined
    ? sorted[base]
    : sorted[base] + rest * (sorted[base + 1] - sorted[base]);
}

function distribution(values) {
  const numbers = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!numbers.length) return { count: 0, min: 0, max: 0, mean: 0, p50: 0, p95: 0, range: 0 };
  const mean = numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
  return {
    count: numbers.length,
    min: round(numbers[0]),
    max: round(numbers.at(-1)),
    mean: round(mean),
    p50: round(quantile(numbers, 0.5)),
    p95: round(quantile(numbers, 0.95)),
    range: round(numbers.at(-1) - numbers[0]),
  };
}

function variants(values) {
  return [...new Set(values.filter((value) => value !== undefined && value !== null).map(String))].sort();
}

function pairwisePixelDiffs(samples) {
  const results = [];
  const images = samples.map((sample) => ({
    sample,
    image: PNG.sync.read(readFileSync(sample.screenshot)),
  }));
  for (let left = 0; left < images.length; left += 1) {
    for (let right = left + 1; right < images.length; right += 1) {
      const a = images[left].image;
      const b = images[right].image;
      if (a.width !== b.width || a.height !== b.height) {
        results.push(100);
        continue;
      }
      const different = pixelmatch(a.data, b.data, null, a.width, a.height, { threshold: 0.1 });
      results.push((different * 100) / (a.width * a.height));
    }
  }
  return results;
}

function sampleKey(sample) {
  return [
    sample.viewport?.label,
    sample.state,
    sample.scroll?.mode,
    sample.interaction?.type,
  ].join('|');
}

function cellFromSamples(samples, owner) {
  const first = samples[0];
  const pixel = distribution(pairwisePixelDiffs(samples));
  const rects = {
    x: distribution(samples.map((sample) => sample.geometry?.x)),
    y: distribution(samples.map((sample) => sample.geometry?.y)),
    width: distribution(samples.map((sample) => sample.geometry?.width)),
    height: distribution(samples.map((sample) => sample.geometry?.height)),
  };
  const maxGeometryRange = Math.max(...Object.values(rects).map((item) => item.range));
  const typography = {
    fontFamily: variants(samples.map((sample) => sample.typography?.fontFamily)),
    fontSizePx: distribution(samples.map((sample) => sample.typography?.fontSizePx)),
    fontWeight: variants(samples.map((sample) => sample.typography?.fontWeight)),
    lineHeightPx: distribution(samples.map((sample) => sample.typography?.lineHeightPx)),
    letterSpacingPx: distribution(samples.map((sample) => sample.typography?.letterSpacingPx)),
  };
  const timing = {
    navigationMs: distribution(samples.map((sample) => sample.timing?.navigationMs)),
    fontsReadyMs: distribution(samples.map((sample) => sample.timing?.fontsReadyMs)),
    settleMs: distribution(samples.map((sample) => sample.timing?.settleMs)),
  };
  const maxTimingRange = Math.max(...Object.values(timing).map((item) => item.range));
  const scrollErrors = samples.map((sample) => Math.abs((sample.scroll?.actualY ?? 0) - (sample.scroll?.requestedY ?? 0)));
  const networkCounts = distribution(samples.map((sample) => sample.network?.requestCount));
  const networkSignatures = variants(samples.map((sample) => sample.network?.signature));
  const networkHosts = variants(samples.flatMap((sample) => sample.network?.hosts ?? []));
  const fontStatuses = variants(samples.map((sample) => sample.fonts?.status));
  const maxActiveAnimations = Math.max(0, ...samples.map((sample) => sample.animations?.activeCount ?? 0));
  const nondeterminism = [];
  if (pixel.max > 0) nondeterminism.push('pixel-variance');
  if (maxGeometryRange > 0) nondeterminism.push('geometry-variance');
  if (typography.fontFamily.length > 1 || typography.fontWeight.length > 1
    || typography.fontSizePx.range > 0 || typography.lineHeightPx.range > 0
    || typography.letterSpacingPx.range > 0) nondeterminism.push('typography-variance');
  if (maxTimingRange > 0) nondeterminism.push('timing-variance');
  if (networkSignatures.length > 1 || networkCounts.range > 0) nondeterminism.push('network-variance');
  if (fontStatuses.length > 1 || fontStatuses.some((status) => status !== 'loaded')) nondeterminism.push('font-loading-variance');
  if (maxActiveAnimations > 0) nondeterminism.push('active-animation');

  const pixelMargin = Math.max(0.02, pixel.max * 0.25);
  const maxTypographyRange = Math.max(
    typography.fontSizePx.range,
    typography.lineHeightPx.range,
    typography.letterSpacingPx.range,
  );
  return {
    id: sampleKey(first),
    viewport: first.viewport,
    state: first.state,
    scroll: { mode: first.scroll?.mode, requestedY: first.scroll?.requestedY },
    interaction: first.interaction,
    region: first.region,
    sampleCount: samples.length,
    distributions: {
      pixelsDifferentPercent: pixel,
      geometryPx: rects,
      typography,
      timingMs: timing,
      scrollErrorPx: distribution(scrollErrors),
      networkRequestCount: networkCounts,
      networkSignatures,
      networkHosts,
      fontStatuses,
      activeAnimations: distribution(samples.map((sample) => sample.animations?.activeCount ?? 0)),
    },
    nondeterminism,
    tolerances: {
      pixelsDifferentPercent: {
        value: round(pixel.max + pixelMargin),
        observedMax: pixel.max,
        safetyMargin: round(pixelMargin),
        owner,
        justification: 'maximum pairwise observed pixel variance plus a local safety margin',
      },
      geometryPx: {
        value: Math.ceil(maxGeometryRange + 1),
        observedMaxRange: maxGeometryRange,
        owner,
        justification: 'maximum observed bounding-box range plus one pixel',
      },
      typographyPx: {
        value: round(maxTypographyRange + 0.25),
        observedMaxRange: maxTypographyRange,
        owner,
        justification: 'maximum observed resolved typography range plus subpixel allowance',
      },
      timingMs: {
        value: Math.ceil(maxTimingRange + 20),
        observedMaxRange: maxTimingRange,
        owner,
        justification: 'maximum observed timing range plus scheduler allowance',
      },
      scrollPx: {
        value: Math.ceil(Math.max(0, ...scrollErrors) + 1),
        observedMaxError: round(Math.max(0, ...scrollErrors)),
        owner,
        justification: 'maximum observed requested-versus-actual scroll error plus one pixel',
      },
      networkRequestDelta: {
        value: Math.ceil(networkCounts.range),
        observedRange: networkCounts.range,
        owner,
        justification: 'observed request-count range for this exact state',
      },
    },
  };
}

export function analyzeNoiseCalibration({
  samples,
  minimumRepetitions = 5,
  owner,
  calibrationId = `noise-calibration-${Date.now()}`,
  createdAt = new Date().toISOString(),
}) {
  if (!owner) throw new Error('calibration owner is required');
  if (!Number.isInteger(minimumRepetitions) || minimumRepetitions < 5) {
    throw new Error('minimumRepetitions must be an integer >= 5');
  }
  if (!Array.isArray(samples) || !samples.length) throw new Error('calibration samples are required');
  const groups = new Map();
  for (const sample of samples) {
    if (!sample?.screenshot || !existsSync(sample.screenshot)) throw new Error(`missing sample screenshot: ${sample?.screenshot}`);
    const key = sampleKey(sample);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(sample);
  }
  const failures = [];
  const cells = [...groups.values()].map((group) => {
    if (group.length < minimumRepetitions) failures.push(`${sampleKey(group[0])} has ${group.length}/${minimumRepetitions} repetitions`);
    return cellFromSamples(group, owner);
  }).sort((a, b) => a.id.localeCompare(b.id));
  const unsigned = {
    schemaVersion: 1,
    calibrationId,
    createdAt,
    owner,
    minimumRepetitions,
    sampleCount: samples.length,
    cellCount: cells.length,
    cells,
    failures,
  };
  const matrixSha256 = sha256(canonicalJson(unsigned));
  return {
    ...unsigned,
    matrixSha256,
    verdict: failures.length ? 'FAIL' : 'PASS',
  };
}

export function writeCalibrationArtifacts({ outDir, samples, matrix, pilotRoot = null, now = new Date() }) {
  const output = resolve(outDir);
  mkdirSync(output, { recursive: true });
  const runsPath = join(output, 'calibration-runs.json');
  const matrixPath = join(output, 'calibration-matrix.json');
  const freezePath = join(output, 'calibration-freeze.json');
  for (const path of [runsPath, matrixPath, freezePath]) {
    if (existsSync(path)) throw new Error(`calibration artifact already exists: ${path}`);
  }
  const runsText = JSON.stringify({ schemaVersion: 1, samples }, null, 2);
  const matrixText = JSON.stringify(matrix, null, 2);
  writeFileSync(runsPath, runsText);
  writeFileSync(matrixPath, matrixText);
  const freeze = {
    schemaVersion: 1,
    frozenAt: now.toISOString(),
    runsPath,
    runsSha256: sha256(runsText),
    matrixPath,
    matrixSha256: sha256(matrixText),
    analysisSha256: matrix.matrixSha256,
  };
  writeFileSync(freezePath, JSON.stringify(freeze, null, 2));
  if (pilotRoot) {
    appendIntegrityLedger({
      ...defaultLedgerPaths(pilotRoot),
      entry: {
        event: 'noise_calibration_frozen',
        role: 'control-plane',
        actor: matrix.owner,
        calibrationId: matrix.calibrationId,
        matrixSha256: freeze.matrixSha256,
        sampleCount: matrix.sampleCount,
        cellCount: matrix.cellCount,
      },
      now,
    });
  }
  return { runsPath, matrixPath, freezePath, freeze };
}
