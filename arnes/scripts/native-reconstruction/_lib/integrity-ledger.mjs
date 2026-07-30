import {
  appendFileSync,
  closeSync,
  existsSync,
  openSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

export const LEDGER_GENESIS_HASH = '0'.repeat(64);

export function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function parseLedger(path) {
  if (!existsSync(path)) return { entries: [], errors: [`missing ledger: ${path}`] };
  const text = readFileSync(path, 'utf8').trim();
  if (!text) return { entries: [], errors: [] };
  const entries = [];
  const errors = [];
  for (const [index, line] of text.split('\n').entries()) {
    try { entries.push(JSON.parse(line)); }
    catch (error) { errors.push(`invalid ledger line ${index + 1}: ${error.message}`); }
  }
  return { entries, errors };
}

export function initIntegrityLedger({ ledgerPath, headPath }) {
  if (existsSync(ledgerPath) || existsSync(headPath)) throw new Error('integrity ledger already exists');
  writeFileSync(ledgerPath, '');
  writeFileSync(headPath, JSON.stringify({
    schemaVersion: 1,
    entryCount: 0,
    lastHash: LEDGER_GENESIS_HASH,
  }, null, 2));
}

export function verifyIntegrityLedger({ ledgerPath, headPath }) {
  const parsed = parseLedger(ledgerPath);
  const failures = [...parsed.errors];
  let previousHash = LEDGER_GENESIS_HASH;
  for (const [index, entry] of parsed.entries.entries()) {
    if (entry.schemaVersion !== 1) failures.push(`ledger entry ${index + 1} schemaVersion must be 1`);
    if (entry.seq !== index + 1) failures.push(`ledger entry ${index + 1} has invalid sequence ${entry.seq}`);
    if (entry.prevHash !== previousHash) failures.push(`ledger entry ${index + 1} has invalid prevHash`);
    const { entryHash, ...unsigned } = entry;
    const expectedHash = sha256(canonicalJson(unsigned));
    if (entryHash !== expectedHash) failures.push(`ledger entry ${index + 1} hash mismatch`);
    previousHash = entryHash ?? previousHash;
  }

  let head = null;
  if (!existsSync(headPath)) failures.push(`missing ledger head: ${headPath}`);
  else {
    try {
      head = JSON.parse(readFileSync(headPath, 'utf8'));
      if (head.entryCount !== parsed.entries.length) failures.push('ledger head entryCount mismatch; possible truncation');
      if (head.lastHash !== previousHash) failures.push('ledger head lastHash mismatch; possible mutation or truncation');
    } catch (error) {
      failures.push(`invalid ledger head: ${error.message}`);
    }
  }
  return {
    verdict: failures.length ? 'FAIL' : 'PASS',
    failures,
    entries: parsed.entries,
    head,
  };
}

export function appendIntegrityLedger({ ledgerPath, headPath, entry, now = new Date() }) {
  const lockPath = `${headPath}.lock`;
  let lock;
  try {
    lock = openSync(lockPath, 'wx');
  } catch (error) {
    throw new Error(`ledger is locked by another writer: ${error.message}`);
  }
  try {
    const current = verifyIntegrityLedger({ ledgerPath, headPath });
    if (current.verdict !== 'PASS') throw new Error(`cannot append to invalid ledger: ${current.failures.join('; ')}`);
    const unsigned = {
      schemaVersion: 1,
      seq: current.entries.length + 1,
      ts: now.toISOString(),
      ...entry,
      prevHash: current.head.lastHash,
    };
    delete unsigned.entryHash;
    const complete = { ...unsigned, entryHash: sha256(canonicalJson(unsigned)) };
    appendFileSync(ledgerPath, `${JSON.stringify(complete)}\n`);
    writeFileSync(headPath, JSON.stringify({
      schemaVersion: 1,
      entryCount: complete.seq,
      lastHash: complete.entryHash,
      updatedAt: complete.ts,
    }, null, 2));
    return complete;
  } finally {
    if (lock !== undefined) closeSync(lock);
    if (existsSync(lockPath)) unlinkSync(lockPath);
  }
}

export function defaultLedgerPaths(pilotRoot) {
  const root = resolve(pilotRoot);
  return {
    ledgerPath: resolve(root, 'ledger.jsonl'),
    headPath: resolve(root, '.harness-control', 'ledger-head.json'),
  };
}
