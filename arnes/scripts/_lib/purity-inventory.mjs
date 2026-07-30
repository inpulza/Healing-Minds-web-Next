import {
  readFileSync,
  readdirSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import {
  basename,
  extname,
  relative,
  resolve,
  sep,
} from 'node:path';

export const DEFAULT_EXCLUDED_DIRECTORIES = [
  '.git',
  '.next',
  'node_modules',
  '_arnes',
  'arnes',
  'spikes',
];

const PRODUCTION_TEXT_EXTENSIONS = new Set([
  '.cjs', '.css', '.htm', '.html', '.js', '.json', '.jsx', '.mjs',
  '.svelte', '.svg', '.ts', '.tsx', '.vue', '.xml',
]);

const DOCUMENTATION_EXTENSIONS = new Set(['.log', '.md', '.txt']);
const RUNTIME_EXTENSIONS = new Set([
  '.cjs', '.css', '.htm', '.html', '.js', '.json', '.jsx', '.mjs',
  '.svelte', '.ts', '.tsx', '.vue', '.wasm',
]);
const CODE_EXTENSIONS = new Set(['.cjs', '.js', '.jsx', '.mjs', '.ts', '.tsx']);

function normalizePath(path) {
  return path.split(sep).join('/');
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function hashFile(path) {
  return sha256(readFileSync(path));
}

function countMatches(text, regex) {
  return [...text.matchAll(regex)].length;
}

function uniqueMatches(text, regex) {
  return [...new Set([...text.matchAll(regex)].map((match) => match[0].toLowerCase()))];
}

function addMetric(map, key, bytes) {
  const current = map.get(key) ?? { files: 0, bytes: 0 };
  current.files += 1;
  current.bytes += bytes;
  map.set(key, current);
}

function sortedMetrics(map) {
  return Object.fromEntries([...map.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

function walk(root, excludedDirectories) {
  const files = [];

  function visit(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const absolute = resolve(directory, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) {
        if (!excludedDirectories.has(entry.name.toLowerCase())) visit(absolute);
        continue;
      }
      if (!entry.isFile()) continue;

      const rel = normalizePath(relative(root, absolute));
      const bytes = readFileSync(absolute).byteLength;
      files.push({
        absolute,
        path: rel,
        bytes,
        extension: extname(entry.name).toLowerCase() || '[none]',
        sha256: hashFile(absolute),
      });
    }
  }

  visit(root);
  return files.sort((a, b) => a.path.localeCompare(b.path));
}

function scanTextFiles(files, provider) {
  const escaped = escapeRegex(provider);
  const providerRegexSource = escaped;
  const dataAttributeSource = `data-${escaped}-[A-Za-z0-9_-]+`;
  const providerTokenSource = `${escaped}-[A-Za-z0-9_-]+`;
  const hydrationSource = `(?:data-${escaped}-hydrate[A-Za-z0-9_-]*|__${escaped}__[A-Za-z0-9_-]*)`;
  const urlRegex = /https?:\/\/[^\s"'<>\\)]+/gi;
  const domains = new Map();
  const uniqueDataAttributes = new Set();
  const uniqueProviderTokens = new Set();
  const perFile = [];
  let providerOccurrences = 0;
  let dataAttributes = 0;
  let providerTokens = 0;
  let hydrationHooks = 0;

  for (const file of files) {
    const text = readFileSync(file.absolute, 'utf8');
    const providerCount = countMatches(text, new RegExp(providerRegexSource, 'gi'));
    const dataCount = countMatches(text, new RegExp(dataAttributeSource, 'gi'));
    const tokenCount = countMatches(text, new RegExp(providerTokenSource, 'gi'));
    const hydrationCount = countMatches(text, new RegExp(hydrationSource, 'gi'));

    providerOccurrences += providerCount;
    dataAttributes += dataCount;
    providerTokens += tokenCount;
    hydrationHooks += hydrationCount;

    for (const value of uniqueMatches(text, new RegExp(dataAttributeSource, 'gi'))) {
      uniqueDataAttributes.add(value);
    }
    for (const value of uniqueMatches(text, new RegExp(providerTokenSource, 'gi'))) {
      uniqueProviderTokens.add(value);
    }
    for (const match of text.matchAll(urlRegex)) {
      try {
        const hostname = new URL(match[0]).hostname.toLowerCase();
        domains.set(hostname, (domains.get(hostname) ?? 0) + 1);
      } catch {
        // A malformed URL is ignored here and remains visible in the source hash.
      }
    }

    if (providerCount || dataCount || tokenCount || hydrationCount) {
      perFile.push({
        path: file.path,
        providerOccurrences: providerCount,
        dataAttributes: dataCount,
        providerTokens: tokenCount,
        hydrationHooks: hydrationCount,
      });
    }
  }

  return {
    providerOccurrences,
    dataAttributes,
    providerTokens,
    hydrationHooks,
    uniqueDataAttributes: [...uniqueDataAttributes].sort(),
    uniqueProviderTokens: [...uniqueProviderTokens].sort(),
    perFile: perFile.sort((a, b) => a.path.localeCompare(b.path)),
    domains,
  };
}

function isProviderDomain(hostname, provider) {
  const lower = provider.toLowerCase();
  return hostname.split('.').some((label) => label === lower || label.startsWith(lower));
}

function findSnapshotResponders(files) {
  const responders = [];
  for (const file of files.filter((entry) => CODE_EXTENSIONS.has(entry.extension))) {
    const text = readFileSync(file.absolute, 'utf8');
    const readsFile = /\breadFile(?:Sync)?\b/.test(text);
    const referencesHtml = /(?:\.html\b|['"]page\.html['"]|['"]index\.html['"])/i.test(text);
    const returnsResponse = /\bnew\s+Response\s*\(|\bResponse\s*\(/.test(text);
    if (readsFile && referencesHtml && returnsResponse) responders.push(file.path);
  }
  return responders.sort();
}

function inventoryDigest(files) {
  const rows = files.map((file) => `${file.path}\0${file.bytes}\0${file.sha256}`).join('\n');
  return sha256(rows);
}

export function scanPurityInventory({
  root,
  provider = 'framer',
  excludedDirectories = DEFAULT_EXCLUDED_DIRECTORIES,
} = {}) {
  if (!root) throw new Error('root is required');
  const sourceRoot = resolve(root);
  const providerName = String(provider).trim().toLowerCase();
  if (!/^[a-z0-9_-]+$/.test(providerName)) {
    throw new Error('provider must contain only letters, numbers, underscore, or hyphen');
  }

  const excluded = new Set(excludedDirectories.map((value) => String(value).toLowerCase()));
  const files = walk(sourceRoot, excluded);
  const areaMetrics = new Map();
  const extensionMetrics = new Map();

  for (const file of files) {
    const area = file.path.includes('/') ? file.path.split('/')[0] : '[root]';
    addMetric(areaMetrics, area, file.bytes);
    addMetric(extensionMetrics, file.extension, file.bytes);
  }

  const productionTextFiles = files.filter((file) => PRODUCTION_TEXT_EXTENSIONS.has(file.extension));
  const documentationFiles = files.filter((file) => DOCUMENTATION_EXTENSIONS.has(file.extension));
  const production = scanTextFiles(productionTextFiles, providerName);
  const documentation = scanTextFiles(documentationFiles, providerName);
  const providerDomains = Object.fromEntries(
    [...production.domains.entries()]
      .filter(([hostname]) => isProviderDomain(hostname, providerName))
      .sort(([a], [b]) => a.localeCompare(b)),
  );
  const runtimeProviderFiles = production.perFile
    .filter((entry) => {
      const file = files.find((candidate) => candidate.path === entry.path);
      return file && RUNTIME_EXTENSIONS.has(file.extension) && entry.providerOccurrences > 0;
    })
    .map((entry) => entry.path);
  const providerNamedFiles = files
    .filter((file) => basename(file.path).toLowerCase().includes(providerName))
    .map((file) => file.path);
  const snapshotResponders = findSnapshotResponders(files);

  const reasons = [];
  if (runtimeProviderFiles.length) reasons.push('provider markers exist in runtime-surface files');
  if (production.dataAttributes) reasons.push('provider data attributes exist in production markup or data');
  if (production.hydrationHooks) reasons.push('provider hydration hooks exist');
  if (Object.keys(providerDomains).length) reasons.push('provider domains exist in production text');
  if (providerNamedFiles.some((path) => RUNTIME_EXTENSIONS.has(extname(path).toLowerCase()))) {
    reasons.push('provider-named runtime files exist');
  }
  if (snapshotResponders.length) reasons.push('application routes re-serve HTML snapshots');

  const deterministic = {
    schemaVersion: 1,
    provider: providerName,
    excludedDirectories: [...excluded].sort(),
    files: {
      total: files.length,
      bytes: files.reduce((sum, file) => sum + file.bytes, 0),
      treeSha256: inventoryDigest(files),
      byArea: sortedMetrics(areaMetrics),
      byExtension: sortedMetrics(extensionMetrics),
      entries: files.map(({ path, bytes, extension, sha256: hash }) => ({ path, bytes, extension, sha256: hash })),
    },
    markers: {
      production: {
        providerOccurrences: production.providerOccurrences,
        dataAttributes: production.dataAttributes,
        providerTokens: production.providerTokens,
        hydrationHooks: production.hydrationHooks,
        uniqueDataAttributes: production.uniqueDataAttributes,
        uniqueProviderTokens: production.uniqueProviderTokens,
        perFile: production.perFile,
      },
      documentation: {
        providerOccurrences: documentation.providerOccurrences,
        perFile: documentation.perFile,
      },
    },
    network: {
      domains: Object.fromEntries([...production.domains.entries()].sort(([a], [b]) => a.localeCompare(b))),
      providerDomains,
    },
    architecture: {
      snapshotResponderFiles: snapshotResponders,
    },
    artifacts: {
      runtimeProviderFiles,
      providerNamedFiles,
    },
    verdict: {
      status: reasons.length ? 'NOT_PURE_NATIVE' : 'PURE_NATIVE',
      reasons,
    },
  };

  return {
    ...deterministic,
    sourceRoot,
    inventorySha256: sha256(JSON.stringify(deterministic)),
    limitations: [
      'Static inventory cannot prove that a renamed provider runtime is independent.',
      'Observed browser requests and hydrated DOM require a separate dynamic probe.',
      'Provider-domain detection is lexical and must be reviewed when a brand name is also a normal hostname label.',
    ],
  };
}

