import crypto from "node:crypto";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "hm_admin_session";
export const ADMIN_SESSION_TTL_SECONDS = 8 * 60 * 60;
const SCRYPT_KEY_LENGTH = 32;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 10;

type PasswordVerifier =
  | { scheme: "scrypt"; salt: string; key: string }
  | { scheme: "sha256"; hash: string };

type AdminConfig = {
  username: string;
  verifier: PasswordVerifier;
  secret: string;
};

export type AdminSession = {
  username: string;
  role: "admin";
  exp: number;
};

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function safeEqual(leftValue: string, rightValue: string): boolean {
  const left = Buffer.from(leftValue);
  const right = Buffer.from(rightValue);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function parseVerifier(value: string): PasswordVerifier {
  const normalized = value.trim();
  if (normalized.toLowerCase().startsWith("scrypt:")) {
    const [, salt, key] = normalized.split(":");
    if (!salt || !key) throw new Error("Invalid scrypt verifier");
    return { scheme: "scrypt", salt, key };
  }
  return { scheme: "sha256", hash: normalized.replace(/^sha256:/i, "").toLowerCase() };
}

function createVerifier(password: string, username: string, secret: string): PasswordVerifier {
  const salt = sha256(`${username}:${secret}:blog-admin`).slice(0, 32);
  return {
    scheme: "scrypt",
    salt,
    key: crypto.scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString("base64url"),
  };
}

function config(): AdminConfig | null {
  const username = process.env.BLOG_ADMIN_USERNAME?.trim();
  const rawPassword = process.env.BLOG_ADMIN_PASSWORD?.trim();
  const passwordHash = process.env.BLOG_ADMIN_PASSWORD_HASH?.trim();
  const secret = (process.env.BLOG_ADMIN_SESSION_SECRET || process.env.SESSION_SECRET)?.trim();
  if (!username || !secret || (!rawPassword && !passwordHash)) return null;
  try {
    return {
      username,
      secret,
      verifier: passwordHash ? parseVerifier(passwordHash) : createVerifier(rawPassword || "", username, secret),
    };
  } catch {
    return null;
  }
}

export function adminAuthMode(): "off" | "custom" {
  const requested = (process.env.BLOG_ADMIN_AUTH_MODE || process.env.ADMIN_AUTH_MODE || "").toLowerCase();
  if ((requested === "off" || requested === "disabled") && process.env.NODE_ENV !== "production") return "off";
  return "custom";
}

export function adminAuthConfigured(): boolean {
  return adminAuthMode() === "off" || config() !== null;
}

function isLoopbackHostname(value: string | null): boolean {
  if (!value) return false;
  const normalized = value.trim().toLowerCase().replace(/^\[|\]$/g, "");
  return normalized === "localhost"
    || normalized === "127.0.0.1"
    || normalized === "::1";
}

function hostnameFromHostHeader(value: string | null): string | null {
  const host = value?.trim();
  if (!host) return null;
  const bracketedIpv6 = host.match(/^\[([0-9a-f:.]+)\](?::(\d{1,5}))?$/i);
  const hostnameOrIpv4 = host.match(/^([^:/?#@\s]+)(?::(\d{1,5}))?$/);
  const match = bracketedIpv6 || hostnameOrIpv4;
  if (!match) return null;
  const port = match[2] ? Number(match[2]) : null;
  if (port !== null && (port < 1 || port > 65535)) return null;
  return match[1] || null;
}

function isLoopbackHostHeader(value: string | null, allowList: boolean): boolean {
  if (!value) return false;
  const hosts = value.split(",").map(host => host.trim());
  return hosts.length > 0
    && (allowList || hosts.length === 1)
    && hosts.every(Boolean)
    && hosts.every(host => isLoopbackHostname(hostnameFromHostHeader(host)));
}

function isLoopbackClientAddress(value: string): boolean {
  const normalized = value.trim().toLowerCase().split("%")[0];
  return normalized === "127.0.0.1"
    || normalized === "::1"
    || normalized === "::ffff:127.0.0.1";
}

function isLoopbackClientHeader(value: string | null, allowList: boolean): boolean {
  if (!value) return false;
  const addresses = value.split(",").map(address => address.trim());
  return addresses.length > 0
    && (allowList || addresses.length === 1)
    && addresses.every(Boolean)
    && addresses.every(isLoopbackClientAddress);
}

export function isLocalAdminRequest(request: NextRequest): boolean {
  const hasForwardedHost = request.headers.has("x-forwarded-host");
  const hasForwardedFor = request.headers.has("x-forwarded-for");
  const hasRealIp = request.headers.has("x-real-ip");
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const hasProxyMetadata = hasForwardedHost
    || request.headers.has("x-forwarded-proto")
    || request.headers.has("x-forwarded-port");
  const hasVerifiedClientChain = (hasForwardedFor || hasRealIp)
    && (!hasForwardedFor || isLoopbackClientHeader(forwardedFor, true))
    && (!hasRealIp || isLoopbackClientHeader(realIp, false));
  const host = request.headers.get("host");
  return isLoopbackHostname(request.nextUrl.hostname)
    && Boolean(host)
    && !request.headers.has("forwarded")
    && (!hasProxyMetadata || hasVerifiedClientChain)
    && (!hasForwardedFor || isLoopbackClientHeader(forwardedFor, true))
    && (!hasRealIp || isLoopbackClientHeader(realIp, false))
    && (!hasForwardedHost || isLoopbackHostHeader(forwardedHost, true))
    && isLoopbackHostHeader(host || "", false);
}

function sign(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createAdminSessionToken(username: string): string | null {
  const current = config();
  if (!current || !safeEqual(username, current.username)) return null;
  const session: AdminSession = {
    username: current.username,
    role: "admin",
    exp: Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000,
  };
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload, current.secret)}`;
}

export function verifyAdminSessionToken(token: string | undefined): AdminSession | null {
  const current = config();
  if (!current || !token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload, current.secret))) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AdminSession;
    if (session.role !== "admin" || !session.username || session.exp <= Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export function getAdminSession(request: NextRequest): AdminSession | null {
  if (adminAuthMode() === "off") {
    if (!isLocalAdminRequest(request)) return null;
    return { username: "development", role: "admin", exp: Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000 };
  }
  return verifyAdminSessionToken(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
}

export function verifyAdminCredentials(username: string, password: string): boolean {
  const current = config();
  if (!current) return false;
  const usernameOk = safeEqual(username.trim(), current.username);
  const passwordCandidate = current.verifier.scheme === "scrypt"
    ? crypto.scryptSync(password, current.verifier.salt, SCRYPT_KEY_LENGTH).toString("base64url")
    : sha256(password);
  const passwordExpected = current.verifier.scheme === "scrypt" ? current.verifier.key : current.verifier.hash;
  return usernameOk && safeEqual(passwordCandidate, passwordExpected);
}

export function loginRateLimit(ip: string): { limited: boolean; retryAfter: number } {
  const key = `${ip}:admin-login`;
  const now = Date.now();
  const attempt = loginAttempts.get(key);
  if (!attempt || attempt.resetAt <= now) {
    if (attempt) loginAttempts.delete(key);
    return { limited: false, retryAfter: 0 };
  }
  return {
    limited: attempt.count >= LOGIN_MAX_ATTEMPTS,
    retryAfter: Math.max(1, Math.ceil((attempt.resetAt - now) / 1000)),
  };
}

export function recordFailedAdminLogin(ip: string): void {
  const key = `${ip}:admin-login`;
  const now = Date.now();
  const attempt = loginAttempts.get(key);
  if (!attempt || attempt.resetAt <= now) {
    loginAttempts.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
  } else {
    loginAttempts.set(key, { count: attempt.count + 1, resetAt: attempt.resetAt });
  }
}

export function clearAdminLoginFailures(ip: string): void {
  loginAttempts.delete(`${ip}:admin-login`);
}

export const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: ADMIN_SESSION_TTL_SECONDS,
};

export const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};
