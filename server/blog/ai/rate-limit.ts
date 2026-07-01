const DEFAULT_LIMIT = 6;
const DEFAULT_WINDOW_MS = 60 * 60 * 1000;
const SWEEP_INTERVAL_MS = 10 * 60 * 1000;

type HitState = {
  hits: number[];
};

export type BlogAiRateLimitResult = {
  allowed: boolean;
  retryAfterSec?: number;
};

const hitsByKey = new Map<string, HitState>();
let lastSweep = Date.now();

function getLimit(): number {
  const parsed = Number(process.env.BLOG_AI_HOURLY_LIMIT);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : DEFAULT_LIMIT;
}

function prune(hits: number[], now: number): number[] {
  const cutoff = now - DEFAULT_WINDOW_MS;
  return hits.filter(hit => hit > cutoff);
}

function maybeSweep(now: number): void {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;

  hitsByKey.forEach((state, key) => {
    const kept = prune(state.hits, now);
    if (kept.length === 0) hitsByKey.delete(key);
    else hitsByKey.set(key, { hits: kept });
  });
}

export function checkBlogAiRateLimit(key: string): BlogAiRateLimitResult {
  const now = Date.now();
  const state = hitsByKey.get(key) || { hits: [] };
  const hits = prune(state.hits, now);
  const limit = getLimit();

  if (hits.length >= limit) {
    hitsByKey.set(key, { hits });
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((hits[0] + DEFAULT_WINDOW_MS - now) / 1000)),
    };
  }

  hits.push(now);
  hitsByKey.set(key, { hits });
  maybeSweep(now);

  return { allowed: true };
}
