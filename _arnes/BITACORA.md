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
