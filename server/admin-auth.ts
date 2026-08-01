import type { Express, NextFunction, Request, Response } from "express";
import crypto from "crypto";
import { getClientIp } from "./utils/client-ip";
import { isReplitAuthConfigured, logoutReplitSession } from "./replit-auth";

const ADMIN_COOKIE_NAME = "hm_admin_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const SCRYPT_KEY_LENGTH = 32;
const LOGIN_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_RATE_LIMIT_MAX_ATTEMPTS = 10;

type AdminPasswordVerifier =
  | { scheme: "scrypt"; salt: string; key: string }
  | { scheme: "sha256"; hash: string };

type AdminSessionPayload = {
  username: string;
  role: "admin";
  exp: number;
};

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function getAdminConfig(): { username: string; passwordVerifier: AdminPasswordVerifier; secret: string } | null {
  const username = process.env.BLOG_ADMIN_USERNAME?.trim();
  const rawPassword = process.env.BLOG_ADMIN_PASSWORD?.trim();
  const providedHash = process.env.BLOG_ADMIN_PASSWORD_HASH;
  const secret = process.env.BLOG_ADMIN_SESSION_SECRET || process.env.SESSION_SECRET;

  if (!username || !secret || (!rawPassword && !providedHash)) return null;

  try {
    const passwordVerifier = providedHash
      ? parsePasswordVerifier(providedHash)
      : createScryptVerifier(rawPassword || "", username, secret);

    return { username, passwordVerifier, secret };
  } catch (error) {
    console.error("Invalid admin password configuration:", error);
    return null;
  }
}

function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === "production" || process.env.REPLIT_DEPLOYMENT === "1";
}

function getAllowedReplitAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || process.env.BLOG_ADMIN_EMAILS || "")
    .split(",")
    .map(emailValue => emailValue.trim().toLowerCase())
    .filter(Boolean);
}

function getAdminAuthMode(): "off" | "replit" | "custom" {
  const mode = (process.env.BLOG_ADMIN_AUTH_MODE || process.env.ADMIN_AUTH_MODE || "").toLowerCase();
  if ((mode === "off" || mode === "disabled") && !isProductionRuntime()) return "off";
  if (mode === "custom") return "custom";
  if (mode === "replit") return "replit";
  if (getAdminConfig()) return "custom";
  return "replit";
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

function isLoopbackHostHeader(value: string, allowList: boolean): boolean {
  const hosts = value.split(",").map(host => host.trim());
  return hosts.length > 0
    && (allowList || hosts.length === 1)
    && hosts.every(Boolean)
    && hosts.every(host => isLoopbackHostname(hostnameFromHostHeader(host)));
}

function headerValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value.join(",");
  return value || null;
}

function hasHeader(req: Request, name: string): boolean {
  return Object.prototype.hasOwnProperty.call(req.headers, name);
}

function isLoopbackPeerAddress(value: string | undefined): boolean {
  const normalized = value?.trim().toLowerCase().split("%")[0];
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
    && addresses.every(address => isLoopbackPeerAddress(address));
}

export function isLocalExpressAdminRequest(req: Request): boolean {
  const hasForwardedHost = hasHeader(req, "x-forwarded-host");
  const hasForwardedFor = hasHeader(req, "x-forwarded-for");
  const hasRealIp = hasHeader(req, "x-real-ip");
  const host = headerValue(req.headers.host);
  const forwardedHost = headerValue(req.headers["x-forwarded-host"]);
  const forwardedFor = headerValue(req.headers["x-forwarded-for"]);
  const realIp = headerValue(req.headers["x-real-ip"]);
  const hasProxyMetadata = hasForwardedHost
    || hasHeader(req, "x-forwarded-proto")
    || hasHeader(req, "x-forwarded-port");
  const hasVerifiedClientChain = (hasForwardedFor || hasRealIp)
    && (!hasForwardedFor || isLoopbackClientHeader(forwardedFor, true))
    && (!hasRealIp || isLoopbackClientHeader(realIp, false));
  return isLoopbackPeerAddress(req.socket.remoteAddress)
    && isLoopbackPeerAddress(req.ip)
    && Boolean(host)
    && !hasHeader(req, "forwarded")
    && (!hasProxyMetadata || hasVerifiedClientChain)
    && (!hasForwardedFor || isLoopbackClientHeader(forwardedFor, true))
    && (!hasRealIp || isLoopbackClientHeader(realIp, false))
    && isLoopbackHostHeader(host || "", false)
    && (!hasForwardedHost || isLoopbackHostHeader(forwardedHost || "", true));
}

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function createScryptVerifier(password: string, username: string, secret: string): AdminPasswordVerifier {
  const salt = sha256(`${username}:${secret}:blog-admin`).slice(0, 32);
  return {
    scheme: "scrypt",
    salt,
    key: crypto.scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString("base64url"),
  };
}

function parsePasswordVerifier(value: string): AdminPasswordVerifier {
  const normalized = value.trim();
  if (normalized.toLowerCase().startsWith("scrypt:")) {
    const [, salt, key] = normalized.split(":");
    if (!salt || !key) {
      throw new Error("BLOG_ADMIN_PASSWORD_HASH scrypt format must be scrypt:<salt>:<key>");
    }
    return { scheme: "scrypt", salt, key };
  }

  return {
    scheme: "sha256",
    hash: normalized.replace(/^sha256:/i, "").toLowerCase(),
  };
}

function verifyAdminPassword(password: string, verifier: AdminPasswordVerifier): boolean {
  if (verifier.scheme === "scrypt") {
    const candidate = crypto.scryptSync(password, verifier.salt, SCRYPT_KEY_LENGTH).toString("base64url");
    return safeEqual(candidate, verifier.key);
  }

  return safeEqual(sha256(password), verifier.hash);
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function getLoginRateLimitKey(req: Request): string {
  return `${getClientIp(req)}:admin-login`;
}

function isLoginRateLimited(key: string): boolean {
  const attempt = loginAttempts.get(key);
  if (!attempt) return false;
  if (attempt.resetAt <= Date.now()) {
    loginAttempts.delete(key);
    return false;
  }
  return attempt.count >= LOGIN_RATE_LIMIT_MAX_ATTEMPTS;
}

function recordFailedLogin(key: string): void {
  const now = Date.now();
  const current = loginAttempts.get(key);
  if (!current || current.resetAt <= now) {
    loginAttempts.set(key, {
      count: 1,
      resetAt: now + LOGIN_RATE_LIMIT_WINDOW_MS,
    });
    return;
  }

  current.count += 1;
  loginAttempts.set(key, current);
}

function clearLoginRateLimit(key: string): void {
  loginAttempts.delete(key);
}

function base64UrlEncode(value: string): string {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

function createSessionToken(username: string, secret: string): string {
  const payload: AdminSessionPayload = {
    username,
    role: "admin",
    exp: Date.now() + SESSION_TTL_MS,
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  return `${encodedPayload}.${signPayload(encodedPayload, secret)}`;
}

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;

  for (const part of cookieHeader.split(";")) {
    const [rawName, ...rawValue] = part.trim().split("=");
    if (!rawName || rawValue.length === 0) continue;
    cookies[rawName] = decodeURIComponent(rawValue.join("="));
  }

  return cookies;
}

function verifySessionToken(token: string | undefined, secret: string): AdminSessionPayload | null {
  if (!token) return null;
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = signPayload(encodedPayload, secret);
  if (!safeEqual(signature, expectedSignature)) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as AdminSessionPayload;
    if (payload.role !== "admin" || !payload.username || payload.exp < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

function getAdminSession(req: Request): AdminSessionPayload | null {
  const config = getAdminConfig();
  if (!config) return null;
  const token = parseCookies(req.headers.cookie)[ADMIN_COOKIE_NAME];
  return verifySessionToken(token, config.secret);
}

function getReplitUser(req: Request): any | null {
  const maybeReq = req as Request & {
    isAuthenticated?: () => boolean;
    user?: any;
  };

  if (typeof maybeReq.isAuthenticated !== "function" || !maybeReq.isAuthenticated()) {
    return null;
  }

  return maybeReq.user || null;
}

function isAllowedReplitAdmin(user: any): boolean {
  const email = String(user?.claims?.email || user?.email || "").trim().toLowerCase();
  if (!email) return false;

  const allowedEmails = getAllowedReplitAdminEmails();
  return allowedEmails.length > 0 && allowedEmails.includes(email);
}

function clearAdminCookie(res: Response): void {
  res.cookie(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" || process.env.REPLIT_DEPLOYMENT === "1",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function isAdminAuthConfigured(): boolean {
  const mode = getAdminAuthMode();
  if (mode === "off") return true;
  if (mode === "custom") return getAdminConfig() !== null;
  return isReplitAuthConfigured() && getAllowedReplitAdminEmails().length > 0;
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const mode = getAdminAuthMode();
  if (mode === "off") {
    if (!isLocalExpressAdminRequest(req)) {
      res.status(403).json({
        success: false,
        message: "Development authentication is only available on localhost",
      });
      return;
    }
    next();
    return;
  }

  if (mode === "replit") {
    if (!isReplitAuthConfigured()) {
      res.status(503).json({
        success: false,
        message: "Replit Auth is not configured",
      });
      return;
    }

    if (getAllowedReplitAdminEmails().length === 0) {
      res.status(503).json({
        success: false,
        message: "Admin email allowlist is not configured",
      });
      return;
    }

    const user = getReplitUser(req);
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Admin login required",
        loginUrl: "/api/login",
      });
      return;
    }

    if (!isAllowedReplitAdmin(user)) {
      res.status(403).json({
        success: false,
        message: "Admin access denied",
      });
      return;
    }

    next();
    return;
  }

  const config = getAdminConfig();
  if (!config) {
    res.status(503).json({
      success: false,
      message: "Admin authentication is not configured",
    });
    return;
  }

  const session = getAdminSession(req);
  if (!session) {
    res.status(401).json({
      success: false,
      message: "Admin login required",
    });
    return;
  }

  next();
}

export function registerAdminAuthRoutes(app: Express): void {
  app.get("/api/admin/session", (req, res) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");

    const configured = isAdminAuthConfigured();
    const mode = getAdminAuthMode();
    const replitUser = mode === "replit" ? getReplitUser(req) : null;
    const session = mode === "custom" && configured ? getAdminSession(req) : null;
    const localDevelopmentSession = mode === "off" && isLocalExpressAdminRequest(req);
    const authenticated = localDevelopmentSession || Boolean(session) || Boolean(replitUser && isAllowedReplitAdmin(replitUser));
    res.status(200).json({
      success: true,
      configured,
      mode,
      authenticated,
      loginUrl: mode === "replit" ? "/api/login" : null,
      admin: session
        ? { username: session.username, role: session.role }
        : replitUser
          ? { username: replitUser.claims?.email || replitUser.email || "admin", role: "admin" }
          : localDevelopmentSession
            ? { username: "development", role: "admin" }
            : null,
    });
  });

  app.post("/api/admin/login", (req, res) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate");

    const mode = getAdminAuthMode();
    if (mode === "off") {
      if (!isLocalExpressAdminRequest(req)) {
        return res.status(403).json({
          success: false,
          message: "Development authentication is only available on localhost",
        });
      }
      return res.status(200).json({
        success: true,
        admin: { username: "development", role: "admin" },
      });
    }

    if (mode === "replit") {
      return res.status(400).json({
        success: false,
        message: "Use Replit login for this admin",
        loginUrl: "/api/login",
      });
    }

    const config = getAdminConfig();
    if (!config) {
      return res.status(503).json({
        success: false,
        message: "Admin authentication is not configured",
      });
    }

    const { username, password } = req.body || {};
    if (typeof username !== "string" || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const rateLimitKey = getLoginRateLimitKey(req);
    if (isLoginRateLimited(rateLimitKey)) {
      res.set("Retry-After", String(Math.ceil(LOGIN_RATE_LIMIT_WINDOW_MS / 1000)));
      return res.status(429).json({
        success: false,
        message: "Too many failed login attempts. Please try again later.",
      });
    }

    const usernameOk = safeEqual(username.trim(), config.username);
    const passwordOk = verifyAdminPassword(password, config.passwordVerifier);
    if (!usernameOk || !passwordOk) {
      recordFailedLogin(rateLimitKey);
      clearAdminCookie(res);
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    clearLoginRateLimit(rateLimitKey);
    const token = createSessionToken(config.username, config.secret);
    res.cookie(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" || process.env.REPLIT_DEPLOYMENT === "1",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_TTL_MS,
    });

    return res.status(200).json({
      success: true,
      admin: { username: config.username, role: "admin" },
    });
  });

  app.post("/api/admin/logout", (req, res) => {
    clearAdminCookie(res);
    if (getAdminAuthMode() === "replit") {
      logoutReplitSession(req, res);
      return;
    }
    res.status(200).json({ success: true });
  });
}
