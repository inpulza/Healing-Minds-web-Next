import { HONEYPOT_FIELDS } from "@shared/schema";
import { verifyDomainHasDns } from "./dns-check";

// Minimum time (ms) a real human needs between opening the form and submitting.
// Inside the 1.5s–2.5s band from the spec; anything faster is almost certainly a bot.
const MIN_FILL_MS = 2000;

const VOWELS = new Set(["a", "e", "i", "o", "u", "y"]);

const RESERVED_DOMAINS = new Set([
  "example.com",
  "example.net",
  "example.org",
  "localhost",
]);
const RESERVED_TLDS = [".test", ".invalid", ".example", ".localhost"];

export interface SpamVerdict {
  spam: boolean;
  reason?: string;
}

export function hasHoneypot(payload: Record<string, unknown>): boolean {
  return HONEYPOT_FIELDS.some((field) => {
    const value = payload[field];
    return typeof value === "string" && value.trim().length > 0;
  });
}

export function isTooFast(
  formStartedAt: number | undefined,
  now: number = Date.now(),
): boolean {
  if (
    typeof formStartedAt !== "number" ||
    !Number.isFinite(formStartedAt) ||
    formStartedAt <= 0
  ) {
    return true; // missing/forged timestamp
  }
  const elapsed = now - formStartedAt;
  if (elapsed < 0) return true; // clock skew / forged future timestamp
  return elapsed < MIN_FILL_MS;
}

export function isReservedDomain(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase().trim();
  if (!domain) return false;
  if (RESERVED_DOMAINS.has(domain)) return true;
  return RESERVED_TLDS.some(
    (tld) => domain === tld.slice(1) || domain.endsWith(tld),
  );
}

// Segmented spam emails like "k.es.t.re.lh.erb.far.m@gmail.com": many dotted
// fragments of 1–2 chars in the local part. Real "john.doe" has few, longer parts.
export function isSegmentedEmail(email: string): boolean {
  const local = email.split("@")[0] ?? "";
  if (!local.includes(".")) return false;
  const segments = local.split(".").filter(Boolean);
  if (segments.length < 4) return false;
  const avgLen =
    segments.reduce((sum, s) => sum + s.length, 0) / segments.length;
  return avgLen <= 2;
}

// A phone is "fake/invalid" if it has letters, fewer than 7 digits, or falls in
// the reserved North-American fictional range 555-0100 … 555-0199.
export function isFakePhone(phone: string): boolean {
  const raw = phone || "";
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 7) return true;
  if (/[a-zA-Z]/.test(raw)) return true;
  const last7 = digits.slice(-7); // exchange (3) + subscriber (4)
  if (last7.startsWith("5550") && last7[4] === "1") return true; // 555-0100..0199
  return false;
}

// Scores a single token for "gibberish-ness". Multiple weak signals are
// combined; no single signal (especially low vowel ratio) blocks on its own,
// so real words like growth/brands/strong/months don't trip it.
function classifyToken(token: string): number {
  const letters = token.replace(/[^a-zA-Z]/g, "");
  if (letters.length < 4) return 0;

  let score = 0;
  const lower = letters.toLowerCase();
  const vowelCount = lower.split("").filter((c) => VOWELS.has(c)).length;
  const vowelRatio = vowelCount / lower.length;

  if (vowelCount === 0) score += 2;
  else if (vowelRatio < 0.2) score += 1;

  // Longest run of consecutive consonants.
  let run = 0;
  let maxRun = 0;
  for (const c of lower) {
    if (!VOWELS.has(c)) {
      run += 1;
      if (run > maxRun) maxRun = run;
    } else {
      run = 0;
    }
  }
  if (maxRun >= 5) score += 2;
  else if (maxRun >= 4) score += 1;

  // Case chaos: random upper/lower switching (e.g. "ZDsOrIKMNLrc").
  let transitions = 0;
  for (let i = 1; i < letters.length; i++) {
    const prevUpper = letters[i - 1] >= "A" && letters[i - 1] <= "Z";
    const curUpper = letters[i] >= "A" && letters[i] <= "Z";
    if (prevUpper !== curUpper) transitions += 1;
  }
  if (letters.length >= 8 && transitions >= 5) score += 2;
  else if (letters.length >= 6 && transitions >= 4) score += 1;

  return score;
}

export function isGibberish(text: string): boolean {
  if (!text) return false;
  const tokens = text.trim().split(/\s+/).filter(Boolean);
  const longTokens = tokens.filter(
    (t) => t.replace(/[^a-zA-Z]/g, "").length >= 4,
  );
  if (longTokens.length === 0) return false;

  // A single long token (e.g. "HqrnGTowpmaJlwkZIBxF") only counts if it's both
  // suspicious and reasonably long, to avoid flagging one odd real word.
  if (longTokens.length === 1) {
    const only = longTokens[0];
    return (
      classifyToken(only) >= 2 && only.replace(/[^a-zA-Z]/g, "").length >= 6
    );
  }

  const badCount = longTokens.filter((t) => classifyToken(t) >= 2).length;
  return badCount / longTokens.length >= 0.6;
}

interface EvaluateOptions {
  skipDns?: boolean;
}

/**
 * Decide whether a contact submission should be silently filtered as spam.
 * High-confidence signals are checked first; the network DNS check runs last.
 */
export async function evaluateContactSubmission(
  payload: Record<string, unknown>,
  options: EvaluateOptions = {},
): Promise<SpamVerdict> {
  if (hasHoneypot(payload)) return { spam: true, reason: "honeypot" };

  const formStartedAt =
    typeof payload.formStartedAt === "number"
      ? payload.formStartedAt
      : undefined;
  if (isTooFast(formStartedAt)) return { spam: true, reason: "timing" };

  const email = String(payload.email ?? "");
  if (isReservedDomain(email)) return { spam: true, reason: "reserved_domain" };
  if (isSegmentedEmail(email)) return { spam: true, reason: "segmented_email" };

  if (isFakePhone(String(payload.phone ?? "")))
    return { spam: true, reason: "fake_phone" };

  if (isGibberish(String(payload.message ?? "")))
    return { spam: true, reason: "gibberish_message" };

  if (
    isGibberish(String(payload.firstName ?? "")) &&
    isGibberish(String(payload.lastName ?? ""))
  ) {
    return { spam: true, reason: "gibberish_name" };
  }

  if (!options.skipDns) {
    const domain = email.split("@")[1]?.toLowerCase().trim();
    if (domain) {
      const hasDns = await verifyDomainHasDns(domain);
      if (!hasDns) return { spam: true, reason: "no_dns" };
    }
  }

  return { spam: false };
}
