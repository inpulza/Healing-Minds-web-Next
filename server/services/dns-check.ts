import { promises as dnsPromises } from "dns";

// Short budget so a real patient never waits on a slow DNS server.
const DNS_TIMEOUT_MS = 1200;

type DnsStatus = "exists" | "notfound" | "error";

function withTimeout<T>(p: Promise<T>, ms: number, onTimeout: T): Promise<T> {
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve(onTimeout);
      }
    }, ms);
    p.then((v) => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        resolve(v);
      }
    }).catch(() => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        resolve(onTimeout);
      }
    });
  });
}

// Native resolver: MX first, then A/AAAA. Distinguishes "domain definitively
// has no records" (notfound) from "lookup failed" (error) so we can fail open.
async function nativeLookup(domain: string): Promise<DnsStatus> {
  const tryResolve = async (
    fn: () => Promise<unknown[]>,
  ): Promise<DnsStatus> => {
    try {
      const records = await fn();
      return records && records.length ? "exists" : "notfound";
    } catch (e: any) {
      const code = e?.code;
      if (code === "ENOTFOUND" || code === "ENODATA") return "notfound";
      return "error";
    }
  };

  const mx = await tryResolve(() => dnsPromises.resolveMx(domain));
  if (mx === "exists") return "exists";
  const a = await tryResolve(() => dnsPromises.resolve4(domain));
  if (a === "exists") return "exists";
  const aaaa = await tryResolve(() => dnsPromises.resolve6(domain));
  if (aaaa === "exists") return "exists";

  // If any individual query failed for a non-"missing" reason, treat the whole
  // thing as an infrastructure error so the caller fails open.
  if (mx === "error" || a === "error" || aaaa === "error") return "error";
  return "notfound";
}

// DNS-over-HTTPS fallback. Only the bare domain is sent, never the full email.
// "notfound" is only returned when the resolver explicitly reports NXDOMAIN
// (Status 3). Anything inconclusive (SERVFAIL, non-OK HTTP, timeouts, malformed
// responses) is treated as "error" so the caller can fail open.
async function dohLookup(domain: string): Promise<DnsStatus> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DNS_TIMEOUT_MS);
  try {
    let sawNxdomain = false;
    for (const type of ["MX", "A", "AAAA"]) {
      const res = await fetch(
        `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`,
        { signal: controller.signal, headers: { accept: "application/dns-json" } },
      );
      if (!res.ok) continue; // inconclusive — try the next record type
      const data: any = await res.json();
      if (Array.isArray(data?.Answer) && data.Answer.length) return "exists";
      if (data?.Status === 3) sawNxdomain = true; // NXDOMAIN — domain absent
      // Status 0 (NOERROR) with no Answer for this type is normal (e.g. no MX);
      // keep checking A/AAAA before concluding anything.
    }
    // Only authoritative if we actually saw NXDOMAIN; otherwise stay ambiguous.
    return sawNxdomain ? "notfound" : "error";
  } catch {
    return "error";
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Returns true if the email domain plausibly exists (has MX or A/AAAA records).
 * FAILS OPEN: any timeout or infrastructure error returns true so real leads
 * are never lost. Returns false only when both native DNS and the DoH fallback
 * agree the domain has no records / does not exist.
 */
export async function verifyDomainHasDns(domain: string): Promise<boolean> {
  if (!domain) return true;

  const native = await withTimeout(
    nativeLookup(domain),
    DNS_TIMEOUT_MS,
    "error" as DnsStatus,
  );
  if (native === "exists") return true;

  const doh = await dohLookup(domain);
  if (doh === "exists") return true;

  // Only filter when BOTH resolvers independently concluded the domain does not
  // exist. Any error/timeout/ambiguity on either side fails open so a real lead
  // is never dropped on a transient DNS or network problem.
  if (native === "notfound" && doh === "notfound") return false;
  return true;
}
