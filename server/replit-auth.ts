import type { Express, Request, Response } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import passport from "passport";
import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

let oidcConfigPromise: Promise<client.Configuration> | null = null;
const registeredStrategies = new Set<string>();

function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === "production" || process.env.REPLIT_DEPLOYMENT === "1";
}

function getSessionSecret(): string | undefined {
  return process.env.SESSION_SECRET || process.env.BLOG_ADMIN_SESSION_SECRET;
}

function getReplitAuthMissingConfig(): string[] {
  const missing: string[] = [];
  if (!process.env.REPL_ID) missing.push("REPL_ID");
  if (!process.env.DATABASE_URL) missing.push("DATABASE_URL");
  if (!getSessionSecret()) missing.push("SESSION_SECRET");
  return missing;
}

export function isReplitAuthConfigured(): boolean {
  return getReplitAuthMissingConfig().length === 0;
}

async function getOidcConfig(): Promise<client.Configuration> {
  if (!oidcConfigPromise) {
    oidcConfigPromise = client.discovery(
      new URL(process.env.ISSUER_URL || "https://replit.com/oidc"),
      process.env.REPL_ID!,
    );
  }
  return oidcConfigPromise;
}

function updateUserSession(
  user: Record<string, unknown>,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
): void {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims && typeof user.claims === "object" ? (user.claims as { exp?: number }).exp : undefined;
}

function getRequestDomain(req: Request): string {
  return req.hostname || String(req.headers.host || "").split(":")[0];
}

async function ensureStrategy(domain: string): Promise<string> {
  const strategyName = `replitauth:${domain}`;
  if (registeredStrategies.has(strategyName)) return strategyName;

  const config = await getOidcConfig();
  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback,
  ) => {
    const user: Record<string, unknown> = {};
    updateUserSession(user, tokens);
    verified(null, user);
  };

  passport.use(
    strategyName,
    new Strategy(
      {
        name: strategyName,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
      },
      verify,
    ),
  );
  registeredStrategies.add(strategyName);
  return strategyName;
}

function destroyPassportSession(req: Request, res: Response, redirectTo?: string): void {
  const maybeReq = req as Request & {
    logout?: (callback: (error?: unknown) => void) => void;
    session?: { destroy: (callback: (error?: unknown) => void) => void };
  };

  const finish = () => {
    if (redirectTo) {
      res.redirect(redirectTo);
      return;
    }
    res.status(200).json({ success: true });
  };

  const destroy = () => {
    if (maybeReq.session && typeof maybeReq.session.destroy === "function") {
      maybeReq.session.destroy((error?: unknown) => {
        if (error) {
          res.status(500).json({ success: false, message: "Unable to clear admin session" });
          return;
        }
        finish();
      });
      return;
    }
    finish();
  };

  if (typeof maybeReq.logout === "function") {
    maybeReq.logout((error?: unknown) => {
      if (error) {
        res.status(500).json({ success: false, message: "Unable to log out" });
        return;
      }
      destroy();
    });
    return;
  }

  destroy();
}

export function logoutReplitSession(req: Request, res: Response, redirectTo?: string): void {
  destroyPassportSession(req, res, redirectTo);
}

export async function setupReplitAuth(app: Express): Promise<void> {
  const missingConfig = getReplitAuthMissingConfig();
  if (missingConfig.length > 0) {
    app.get("/api/login", (_req, res) => {
      res.status(503).json({
        success: false,
        message: `Replit Auth is not configured: missing ${missingConfig.join(", ")}`,
      });
    });
    app.get("/api/callback", (_req, res) => {
      res.status(503).json({
        success: false,
        message: `Replit Auth is not configured: missing ${missingConfig.join(", ")}`,
      });
    });
    app.get("/api/logout", (_req, res) => {
      res.redirect("/admin/login");
    });
    return;
  }

  const PgSessionStore = connectPg(session);
  app.use(
    session({
      secret: getSessionSecret()!,
      store: new PgSessionStore({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true,
        ttl: Math.floor(SESSION_TTL_MS / 1000),
        tableName: "sessions",
      }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: isProductionRuntime(),
        sameSite: "lax",
        maxAge: SESSION_TTL_MS,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user: Express.User, callback) => callback(null, user));
  passport.deserializeUser((user: Express.User, callback) => callback(null, user));

  app.get("/api/login", async (req, res, next) => {
    try {
      const strategyName = await ensureStrategy(getRequestDomain(req));
      passport.authenticate(strategyName, {
        prompt: "login consent",
        scope: ["openid", "email", "profile", "offline_access"],
      })(req, res, next);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/callback", async (req, res, next) => {
    try {
      const strategyName = await ensureStrategy(getRequestDomain(req));
      passport.authenticate(strategyName, {
        successRedirect: "/admin/blog",
        failureRedirect: "/admin/login",
      })(req, res, next);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/logout", async (req, res, next) => {
    try {
      const config = await getOidcConfig();
      const host = req.get("host") || req.hostname;
      const postLogoutUrl = client.buildEndSessionUrl(config, {
        client_id: process.env.REPL_ID!,
        post_logout_redirect_uri: `${req.protocol}://${host}/admin/login`,
      }).href;
      logoutReplitSession(req, res, postLogoutUrl);
    } catch (error) {
      next(error);
    }
  });
}
