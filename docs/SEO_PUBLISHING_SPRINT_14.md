# Sprint 14 - Replit Auth Native Admin Login

## Goal

Make the blog admin authentication match the Replit-native pattern already used in the XL Homes reference project, while keeping the existing username/password mode as an explicit emergency fallback.

This sprint also fixes the frontend session-cache loop where `/admin/blog` could keep a stale unauthenticated session after a successful login.

## Scope

- Add native Replit OIDC login routes:
  - `/api/login`
  - `/api/callback`
  - `/api/logout`
- Mount Passport + `express-session` with PostgreSQL-backed sessions.
- Add the `sessions` table to the Drizzle schema.
- Keep existing custom username/password login.
- Make auth mode precedence explicit:
  - `BLOG_ADMIN_AUTH_MODE=custom` uses username/password.
  - `BLOG_ADMIN_AUTH_MODE=replit` uses Replit Auth.
  - no explicit mode keeps current fallback behavior.
- Keep Replit admin authorization fail-closed through `ADMIN_EMAILS` or `BLOG_ADMIN_EMAILS`.
- Trim custom username/password secrets to avoid invisible-space login failures.
- Set `/api/admin/session` as no-store.
- Invalidate/refetch the admin session query after login/logout.

## Non-Goals

- No blog workflow changes.
- No AI generation changes.
- No publish gate changes.
- No environment badge.
- No unpublish action.
- No migration of the legacy `users` table.

## Auth Behavior

### Replit mode

When `BLOG_ADMIN_AUTH_MODE=replit`, the admin uses Replit OIDC.

- `/api/admin/session` reports `mode: "replit"`.
- Unauthenticated admin API requests return `401` with `loginUrl: "/api/login"`.
- Missing OIDC/session configuration returns `503`, not an open admin.
- Missing allowlist returns `503`.
- Users outside the allowlist return `403`.

### Custom mode

When `BLOG_ADMIN_AUTH_MODE=custom`, the existing username/password login remains available.

- Password verification still uses the existing scrypt/hash compatibility path.
- Login rate limiting remains active.
- Session cookie behavior remains unchanged.

## Validation Checklist

- `npm run check`
- `npm run build`
- `db:push` creates/keeps the `sessions` table.
- In custom mode, `/admin/login` accepts valid credentials.
- After custom login, `/api/admin/session` refetches and `/admin/blog` does not loop.
- In Replit mode with missing config, admin stays closed with `503`.
- In Replit mode with config and allowlist, `/api/login` starts OIDC and `/api/callback` returns to `/admin/blog`.
- Without session, `/api/admin/*` still returns `401`.
- With Replit session but email outside allowlist, `/api/admin/*` returns `403`.
