import { readTrace } from '../_lib/trace.mjs';

const REQUIRED_EVENTS = [
  'trial_started',
  'probe_started',
  'probe_finished',
  'artifact_written',
  'grader_started',
  'grader_result',
  'trial_finished',
];

export function gradeTraceCompleteness({ trialDir, sectionId }) {
  let trace = [];
  const failures = [];
  try {
    trace = readTrace(trialDir);
  } catch (error) {
    failures.push(error.message);
  }
  const events = new Set(trace.map((entry) => entry.event));
  for (const event of REQUIRED_EVENTS) {
    if (!events.has(event)) failures.push(`missing event ${event}`);
  }

  return {
    grader: 'trace-completeness',
    verdict: failures.length ? 'FAIL' : 'PASS',
    sectionId,
    blocking: true,
    expected: { requiredEvents: REQUIRED_EVENTS },
    actual: { events: [...events], failures },
    artifactRefs: [`${trialDir}/trace.jsonl`],
    message: failures.length ? failures.join('; ') : 'PASS',
  };
}
