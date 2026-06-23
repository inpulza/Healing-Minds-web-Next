import type { Request } from "express";

// Best-effort client IP for rate limiting. The app sets `trust proxy`, so
// Express already resolves req.ip from the trusted proxy hop in X-Forwarded-For.
// We rely on that rather than parsing the raw, spoofable XFF header ourselves.
export function getClientIp(req: Request): string {
  return req.ip || req.socket?.remoteAddress || "unknown";
}
