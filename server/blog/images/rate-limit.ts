const DEFAULT_LIMIT = 4;
const WINDOW_MS = 60 * 60 * 1000;
const SWEEP_INTERVAL_MS = 10 * 60 * 1000;

type HitState = { hits: number[] };

export type BlogImageRateLimitResult = {
  allowed: boolean;
  retryAfterSec?: number;
};

const hitsByKey = new Map<string, HitState>();
let lastSweep = Date.now();

function getLimit(): number {
  const parsed = Number(process.env.BLOG_IMAGE_HOURLY_LIMIT);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : DEFAULT_LIMIT;
}

function prune(hits: number[], now: number): number[] {
  const cutoff = now - WINDOW_MS;
  return hits.filter(hit => hit > cutoff);
}

export function getBlogImageRateLimitCost(
  role: "hero" | "inline" | "all",
  maxInline = 2,
): number {
  const inlineCost = Math.max(1, Math.min(2, Math.floor(maxInline)));
  if (role === "hero") return 1;
  if (role === "inline") return inlineCost;
  return 1 + inlineCost;
}

export function checkBlogImageRateLimit(key: string, cost = 1): BlogImageRateLimitResult {
  const now = Date.now();
  if (now - lastSweep >= SWEEP_INTERVAL_MS) {
    lastSweep = now;
    hitsByKey.forEach((state, storedKey) => {
      const kept = prune(state.hits, now);
      if (kept.length === 0) hitsByKey.delete(storedKey);
      else hitsByKey.set(storedKey, { hits: kept });
    });
  }

  const hits = prune(hitsByKey.get(key)?.hits || [], now);
  const limit = getLimit();
  const normalizedCost = Math.max(1, Math.floor(cost));
  if (hits.length + normalizedCost > limit) {
    hitsByKey.set(key, { hits });
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil(((hits[0] || now) + WINDOW_MS - now) / 1000)),
    };
  }

  hits.push(...Array.from({ length: normalizedCost }, () => now));
  hitsByKey.set(key, { hits });
  return { allowed: true };
}
