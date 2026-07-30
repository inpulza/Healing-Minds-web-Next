# BITÁCORA — append-only. Nunca edites entradas anteriores.

Plantilla de entrada (cópiala tal cual y rellena):

```
## [fecha ISO] [herramienta/modelo] — [fase N]
**Qué se hizo:**
**Decisiones:** (o "ninguna")
**Pendientes/bugs:** (o "ninguno")
**Archivos tocados:**
**Evidencia:** (pega la salida PASS/FAIL de los scripts, no afirmaciones)
```

---

## 2026-07-29T21:34:34+02:00 Hermes Agent — fases 0–1
**Qué se hizo:** Se clonó el repositorio fuente en un directorio independiente; se instaló el Arnés Clonador Web v3.0.0; se repararon 193 URLs `package-firewall.replit.local` del lockfile para usar el registro público de npm; se instalaron dependencias y Chromium; se comprobó la aplicación heredada; se congeló el estado visual público de `https://www.healingmindsp.com`.
**Decisiones:** La migración se tratará como reconstrucción literal/refactor a Next.js con el sitio público como oráculo visual. Se conserva el repositorio fuente y su historial; no se ha creado todavía el repositorio GitHub de destino. El arnés se instaló desde `C:/Desarrollo/Clonar web con arnes` en commit `101d2ebee398c376709f50dbc3ed391b03b8ef9a`, checkout local con extensiones sin publicar; se eligió porque contiene los controles v3 de seis viewports, eval-suite, trazas y graders exigidos para esta migración.
**Pendientes/bugs:** Las capturas nominales de 390 y 768 tienen dimensiones físicas 545x19679 y 785x16270; antes de usarlas como oráculo estricto hay que diagnosticar el ancho mínimo/scrollbar o el contrato de captura y regenerar evidencia comparable. Quedan por inventariar rutas, datos, APIs y dependencias Replit antes de diseñar la arquitectura Next.js/Vercel.
**Archivos tocados:** `package.json`, `package-lock.json`, `arnes/**`, `_arnes/**`, adaptadores de agentes y `.windsurf/**`.
**Evidencia:** `npm run check` PASS; `npm run build` PASS (Vite 5.4.19, 2278 módulos); `doctor` PASS; `gate --fase=0` PASS; `capture.mjs` PASS nominal 390/768/1440; `gate --fase=1` PASS. SHA-256: 390 `32c8d345ae203763b411a4b6cecd42b3fd4854769d63b6474448af136be7de0d`; 768 `35c0cc85b317c2ff4353f5e23d2442d764f9b7a1ad298a7d4d289ba7ef785ec8`; 1440 `a44cca32424c3bc2499f9cfcbe2a8e59ca4d6eb789bd73f6eafe1889d916e77f`; HTML `b98daad68b5f8689e0922fd6e7f80dbd85e8b376d3a011d64750a334ac6a25e0`.

## 2026-07-29T22:17:17+02:00 Hermes Agent — migración Next App Router
**Qué se hizo:** Se centralizaron las 77 rutas públicas estáticas heredadas en una allowlist; se conectaron `/` y un catch-all App Router con prerender estático, redirección legacy y 404 real para rutas desconocidas; se añadió un renderer cliente compartido con sincronización de idioma.
**Decisiones:** Las rutas dinámicas de posts y las rutas administrativas quedan fuera del catch-all. El resolver exige coincidencia exacta y nunca construye imports desde segmentos suministrados por el usuario.
**Pendientes/bugs:** `npm run build` sin entorno falla por la inicialización preexistente de Resend sin `RESEND_API_KEY`; la compilación se verificó con un valor placeholder no secreto. Browserslist reporta `caniuse-lite` desactualizado.
**Archivos tocados:** `app/_routing/public-routes.mjs`, `app/_routing/public-page.tsx`, `app/[...slug]/page.tsx`, `app/page.tsx`, `tests/public-static-routes.test.mjs`, `_arnes/BITACORA.md`.
**Evidencia:** `npm test` PASS (15/15); `npm run check` PASS; `RESEND_API_KEY=re_build_placeholder npm run build` PASS (83 páginas, catch-all SSG con 76 paths); HTTP real: `/about` 200, `/es/acerca-de` 200, `/locations/naples` 307 a `/locations/psychiatrist-naples`, ruta desconocida 404.

## 2026-07-30T15:46:18+02:00 Codex — estabilización Next y Admin
**Qué se hizo:** Se reprodujeron en Vercel el `removeChild`, el desborde del selector a 914px y los logos cargados que quedaban transparentes; se estabilizó la navegación del login/dashboard; se hizo documental el cambio EN/ES; se reservó el header completo para `xl`; se reconcilió el estado de imágenes que terminan antes de hidratación; se añadió layout admin no-store, utilidad scrypt segura, documentación y guards de paridad para Sprints 17–19.
**Decisiones:** No se leyó ni cambió ningún secreto, `DATABASE_URL`, entorno Vercel, dominio o deployment. La prueba admin de navegador usó valores fixture y dejó `DATABASE_URL` ausente, por lo que los cinco `503` de datos son esperados y no se confundieron con fallos de autenticación. El pipeline de clon sigue formalmente en fase 2; esta tarea fue estabilización post-migración explícitamente solicitada, no construcción de una sección.
**Pendientes/bugs:** Jordan debe verificar o regenerar manualmente `BLOG_ADMIN_PASSWORD_HASH` y actualizar Vercel solo tras aprobar el PR. El warning local de GA sin ID y `caniuse-lite` desactualizado quedan fuera de alcance. No se ejecutó `npm audit fix`.
**Archivos tocados:** `client/src/components/Header.tsx`, `client/src/components/OptimizedImage.tsx`, `client/src/lib/navigation.tsx`, `app/admin/layout.tsx`, `scripts/admin-password-hash.mjs`, `docs/ADMIN_AUTH_VERCEL.md`, `tests/admin-auth-flow.test.mjs`, `tests/editorial-next-parity.test.mjs`, tests Next existentes, `_arnes/evidencia/NEXT-STABILIZATION-2026-07-30.md`, `_arnes/BITACORA.md`, `package.json`.
**Evidencia:** `npm test` PASS 47/47; `npm run check` PASS; `npm run db:verify` PASS `{"ok":true,"statements":94,"tables":18,"foreignKeys":20,"contactInsert":"pass"}`; build Next PASS, 89/89 páginas, admin dinámico; Chromium 1440/914/390 EN↔ES PASS, 0 errores; logos visibles `complete=true`, `naturalWidth=1920`, `opacity=1`; login→dashboard→logout PASS y rutas admin 200/no-store. Evidencia detallada: `_arnes/evidencia/NEXT-STABILIZATION-2026-07-30.md`.
