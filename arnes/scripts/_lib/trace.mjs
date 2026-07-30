import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative } from 'node:path';

export function hashFile(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function readTrialId(trialDir) {
  const trialPath = join(trialDir, 'trial.json');
  if (!existsSync(trialPath)) return 'unknown-trial';
  try {
    return JSON.parse(readFileSync(trialPath, 'utf8')).trialId ?? 'unknown-trial';
  } catch {
    return 'unknown-trial';
  }
}

export function appendTrace({ trialDir, event, data = {} }) {
  if (!trialDir) throw new Error('appendTrace requires trialDir');
  if (!event) throw new Error('appendTrace requires event');
  const entry = {
    ts: new Date().toISOString(),
    event,
    trialId: data.trialId ?? readTrialId(trialDir),
    ...data,
  };
  appendFileSync(join(trialDir, 'trace.jsonl'), `${JSON.stringify(entry)}\n`);
  return entry;
}

export function traceArtifact({ trialDir, path, kind, sectionId, viewport, state }) {
  if (!existsSync(path)) throw new Error(`artifact does not exist: ${path}`);
  const entry = {
    kind,
    sectionId,
    viewport,
    state,
    path: relative(process.cwd(), path).replace(/\\/g, '/'),
    sha256: hashFile(path),
  };
  return appendTrace({ trialDir, event: 'artifact_written', data: entry });
}

export function readTrace(trialDir) {
  const tracePath = join(trialDir, 'trace.jsonl');
  if (!existsSync(tracePath)) return [];
  const text = readFileSync(tracePath, 'utf8').trim();
  if (!text) return [];
  return text.split('\n').map((line, index) => {
    try { return JSON.parse(line); }
    catch (error) { throw new Error(`Invalid trace JSONL at line ${index + 1}: ${error.message}`); }
  });
}
