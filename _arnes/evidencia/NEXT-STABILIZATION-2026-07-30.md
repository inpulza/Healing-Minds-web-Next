# Next and admin stabilization evidence — 2026-07-30

Scope: post-migration stabilization on `fix/next-admin-stabilization`.
No Vercel environment, deployment, domain, production database, or real
credential was read or changed.

## Live baseline diagnosis

Stable URL checked before implementation:
`https://healing-minds-psychiatry-nextjs.vercel.app`.

- 1440x900 language click navigated `/` to `/es`, then React emitted
  `TypeError: Cannot read properties of null (reading 'removeChild')`.
- At 914x900 the desktop language control rendered from x=917.22 to x=983.86,
  outside the 914px viewport.
- Insurance logo responses completed successfully (`naturalWidth=1920`) but
  visible eager logos remained at computed `opacity: 0`.

## Admin authentication and cache boundary

The automated route-handler flow uses fixture-only values and no database:

```text
login: pass
session: pass
protectedApi: pass
logout: pass
noStore: pass
productionFailClosed: pass
```

Real Chromium against the local production build:

```text
/admin/login -> successful custom login -> /admin/blog
dashboard heading: Blog Editorial Admin
/api/admin/session: 200, authenticated=true, Cache-Control=no-store
/api/admin/runtime: 200, Cache-Control=no-store
/api/admin/blog/images/config: 200, Cache-Control=no-store
/admin/blog: 200, Cache-Control=private, no-cache, no-store
logout -> /admin/login
/api/admin/session after logout: 200, authenticated=false, Cache-Control=no-store
```

The five dashboard data requests returned expected `503` responses because
`DATABASE_URL` was intentionally absent in the isolated browser run. This
avoided touching a real database while proving the authenticated shell and
protected boundary. The route-handler test covers the protected API without
real secrets.

## Responsive and bilingual browser verification

Real Chromium, local production build:

| Viewport | Header result | EN/ES result | Console |
|---|---|---|---|
| 1440x900 | Desktop toggle fully inside viewport | `/` -> `/es` | 0 errors |
| 914x900 | Compact menu button x=823..871; language control visible in menu | `/` -> `/es` | 0 errors |
| 390x844 | Compact menu and language control clickable | `/` -> `/es` | 0 errors |

Loaded visible insurance logos reported `complete=true`, `naturalWidth=1920`
and `opacity=1` at desktop and mobile.

Equivalent route pairs loaded with server-correct language, title and H1:

```text
/about                html[lang]=en
/es/acerca-de         html[lang]=es
/services             html[lang]=en
/es/servicios         html[lang]=es
```

All four route loads reported 0 console errors. The only public warning was the
known missing local GA measurement ID.

Local Playwright screenshots and traces are retained outside Git scope under
`output/playwright/next-stabilization-2026-07-30/`.

## Editorial engine parity: Sprints 17–19

Automated structural guards confirm:

- Sprint 17: image schema/table/indexes, storage/provider/service, all image
  review endpoints, and admin controls are present.
- Sprint 18: generation runs/events/topic candidates, planner/provider/judge,
  Healing Minds strategy, generation/SSE endpoints, and admin controls are
  present.
- Sprint 19: link source/library/usage/audit tables and indexes, service/audit
  modules, link library/review/report/audit endpoints, and admin panels are
  present.
- `migrations/0000_initial_schema.sql` contains all required Sprint 17–19
  tables. `db:verify` applied 94 statements, found 18 tables and 20 foreign
  keys, and passed its insert smoke.
- No critical endpoint used by the migrated Sprints 17–19 admin UI is absent
  from the Next catch-all handler.

## Exact gates

```text
npm test
tests 47, pass 47, fail 0

npm run check
PASS

npm run db:verify
{"ok":true,"statements":94,"tables":18,"foreignKeys":20,"contactInsert":"pass"}

RESEND_API_KEY=re_build_placeholder npm run build
PASS — 89/89 static pages generated; admin pages and APIs dynamic
```

The arnés clone pipeline still reports phase 2 incomplete because its original
section inventory/spec checkpoint was never completed. This stabilization did
not create or reconstruct a clone section; it followed the user's explicit
post-migration scope and recorded its evidence separately.
