// Lightweight in-memory rate limiter keyed by IP and by email. State is volatile
// (matches the existing in-memory storage). It self-prunes so memory stays bounded.

const IP_LIMIT = 5;
const IP_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const EMAIL_LIMIT = 3;
const EMAIL_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const SWEEP_INTERVAL_MS = 10 * 60 * 1000;

const ipHits = new Map<string, number[]>();
const emailHits = new Map<string, number[]>();
let lastSweep = Date.now();

function prune(times: number[], windowMs: number, now: number): number[] {
  const cutoff = now - windowMs;
  return times.filter((t) => t > cutoff);
}

function maybeSweep(now: number): void {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  ipHits.forEach((times, key) => {
    const kept = prune(times, IP_WINDOW_MS, now);
    if (kept.length) ipHits.set(key, kept);
    else ipHits.delete(key);
  });
  emailHits.forEach((times, key) => {
    const kept = prune(times, EMAIL_WINDOW_MS, now);
    if (kept.length) emailHits.set(key, kept);
    else emailHits.delete(key);
  });
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSec?: number;
}

export function checkRateLimit(
  ip: string | undefined,
  email: string | undefined,
): RateLimitResult {
  const now = Date.now();
  const ipKey = ip || "unknown";
  const emailKey = (email || "").toLowerCase().trim() || "unknown";

  const ipArr = prune(ipHits.get(ipKey) || [], IP_WINDOW_MS, now);
  const emailArr = prune(emailHits.get(emailKey) || [], EMAIL_WINDOW_MS, now);

  if (ipArr.length >= IP_LIMIT) {
    ipHits.set(ipKey, ipArr);
    return {
      allowed: false,
      retryAfterSec: Math.max(
        1,
        Math.ceil((ipArr[0] + IP_WINDOW_MS - now) / 1000),
      ),
    };
  }

  if (emailArr.length >= EMAIL_LIMIT) {
    emailHits.set(emailKey, emailArr);
    return {
      allowed: false,
      retryAfterSec: Math.max(
        1,
        Math.ceil((emailArr[0] + EMAIL_WINDOW_MS - now) / 1000),
      ),
    };
  }

  ipArr.push(now);
  emailArr.push(now);
  ipHits.set(ipKey, ipArr);
  emailHits.set(emailKey, emailArr);
  maybeSweep(now);

  return { allowed: true };
}

// Test helper: clear all counters.
export function resetRateLimits(): void {
  ipHits.clear();
  emailHits.clear();
}
