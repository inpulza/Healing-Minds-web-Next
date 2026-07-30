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

## 2026-07-30 Hermes Agent — reconciliación documental de fase 2
**Qué se hizo:** Se generó `spec/design-tokens.json` desde la evidencia congelada y se documentó la página completa como sección `home` en `spec/home.md`.
**Decisiones:** La implementación Next.js y el primer deployment precedieron al cierre formal de Fase 2. El estado permanece `🔎` y `APROBADO_SPECS: no`; esta sesión no se autoaprueba ni crea una aprobación humana retroactiva. Las diferencias raster de la home están dominadas por lazy media remota ausente en ejecuciones de la fuente, por lo que se conserva la evidencia FAIL y no se oculta contenido funcional del candidato.
**Pendientes/bugs:** Fase 3 requiere revisión y aprobación humana explícita de los specs. Fase 4 requiere auditor externo, trazas, graders y `aggregate.json` válido.
**Archivos tocados:** `_arnes/spec/design-tokens.json`, `_arnes/spec/home.md`, `_arnes/LEDGER.md`, `_arnes/BITACORA.md`, `_arnes/DECISIONES.md`.
**Evidencia:** `extract-tokens.mjs` PASS: 12 colores, 2 familias y 13 espaciados. La evidencia de seis viewports y su clasificación permanece en `_arnes/evidencia/visual/PRIORITY-AUDIT.md` y los artefactos locales de `_arnes/verify/`.

## 2026-07-30 Hermes Agent — corrección del inventario retrospectivo
**Qué se hizo:** Tras revisión independiente, la fila agregada `home` se sustituyó por las doce secciones reales de `captura/secciones.json`; se creó un spec retrospectivo por sección con selector, altura registrada, código mapeado y limitaciones explícitas.
**Decisiones:** Los specs no presentan los resúmenes page-level como raws section-level. Las doce filas permanecen `🔎` y `APROBADO_SPECS: no` hasta revisión humana. La evidencia externa de interacción, seams, trazas, graders y aggregate sigue pendiente.
**Pendientes/bugs:** Medir raws DOM específicos y completar trials externos sobre una URL inmutable asociada al SHA del PR.
**Archivos tocados:** `_arnes/spec/*.md`, `_arnes/LEDGER.md`, `_arnes/BITACORA.md`.
**Evidencia:** Inventario fuente de doce elementos en `_arnes/captura/secciones.json`; auditor independiente recomendó no reducir el alcance a una única fila agregada.

## 2026-07-30T15:46:18+02:00 Codex — estabilización Next y Admin
**Qué se hizo:** Se reprodujeron en Vercel el `removeChild`, el desborde del selector a 914px y los logos cargados que quedaban transparentes; se estabilizó la navegación del login/dashboard; se hizo documental el cambio EN/ES; se reservó el header completo para `xl`; se reconcilió el estado de imágenes que terminan antes de hidratación; se añadió layout admin no-store, utilidad scrypt segura, documentación y guards de paridad para Sprints 17–19.
**Decisiones:** No se leyó ningún secreto ni se tocó `DATABASE_URL` o el dominio. La prueba admin de navegador usó valores fixture y dejó `DATABASE_URL` ausente, por lo que los cinco `503` de datos son esperados y no se confundieron con fallos de autenticación. Jordan configuró manualmente credenciales `BLOG_ADMIN_PASSWORD` sensibles en Vercel y validó login en Production y Preview; el hash scrypt queda como endurecimiento opcional, no como requisito de esta entrega. El pipeline de clon sigue formalmente en fase 2; esta tarea fue estabilización post-migración explícitamente solicitada, no construcción de una sección.
**Pendientes/bugs:** El warning local de GA sin ID y `caniuse-lite` desactualizado quedan fuera de alcance. No se ejecutó `npm audit fix`.
**Archivos tocados:** `client/src/components/Header.tsx`, `client/src/components/OptimizedImage.tsx`, `client/src/lib/navigation.tsx`, `client/src/pages/admin/AdminLogin.tsx`, `app/admin/layout.tsx`, `scripts/admin-password-hash.mjs`, `docs/ADMIN_AUTH_VERCEL.md`, `tests/admin-auth-flow.test.mjs`, `tests/editorial-next-parity.test.mjs`, tests Next existentes, `_arnes/evidencia/NEXT-STABILIZATION-2026-07-30.md`, `_arnes/BITACORA.md`, `package.json`.
**Evidencia:** Tras sincronizar PR #1: `npm test` PASS 55/55; `npm run check` PASS; `npm run db:verify` PASS con 2 migraciones, 95 statements, 18 tablas, 20 foreign keys y orden de tags PASS; build Next PASS, 89/89 páginas, admin dinámico; Chromium 1440/914/390 EN↔ES PASS, 0 errores; logos visibles `complete=true`, `naturalWidth=1920`, `opacity=1`; login→dashboard→logout local PASS y Jordan confirmó credenciales reales en Production y Preview. El único conflicto manual fue el log append-only del arnés; se conservaron ambas entradas. Evidencia detallada: `_arnes/evidencia/NEXT-STABILIZATION-2026-07-30.md`.

## 2026-07-30T18:27:08+02:00 Codex — método visual y preview editorial
**Qué se hizo:** Se adaptó el patrón temático de XL Homes al dominio de Healing Minds con familias de escena y composición deterministas; se sustituyó el preview de texto plano por el mismo materializador y sanitizador del post público; se añadieron hero, imágenes inline, estructura editorial y estado de borrador; se añadió el ojo accesible para mostrar u ocultar la contraseña.
**Decisiones:** El proveedor recibe descripciones editoriales seguras, no texto clínico aportado por pacientes. Las personas generadas deben ser ficticias y diversas, sin suplantar pacientes, clínicos ni personas reales. El preview no publica ni modifica el borrador. `BLOG_IMAGE_ENABLED=true` quedó configurado solo en Preview; Production queda pendiente de aprobación tras el humo real.
**Pendientes/bugs:** Jordan debe revisar en el Preview del PR una generación real sobre un borrador, considerando que Preview y Production comparten Neon. No ejecutar `npm audit fix`; la actualización de `caniuse-lite` queda fuera de alcance.
**Archivos tocados:** `server/blog/images/*`, `client/src/lib/blog-article.ts`, `client/src/pages/BlogPost.tsx`, `client/src/pages/admin/BlogAdminPage.tsx`, `client/src/pages/admin/AdminLogin.tsx`, rutas admin Next/legacy, tests y guards, documentación editorial/autenticación, `_arnes/DECISIONES.md`, `_arnes/evidencia/BLOG-IMAGE-PREVIEW-2026-07-30/**`, `_arnes/BITACORA.md`.
**Evidencia:** `npm test` PASS 58/58; `npm run check` PASS; `npm run build` PASS 89/89; `npm run db:verify` PASS 2 migraciones, 95 statements, 18 tablas y 20 foreign keys; guards de imágenes, temas y enlaces PASS; Chromium 1440/914/390 sin overflow, consola 0 errores/0 warnings, login→dashboard→preview protegido→logout PASS con fixtures falsos; Vercel listó `BLOG_IMAGE_ENABLED` únicamente para Preview y confirmó que `OPENAI_API_KEY` y `BLOB_READ_WRITE_TOKEN` ya estaban presentes. Detalle y capturas: `_arnes/evidencia/BLOG-IMAGE-PREVIEW-2026-07-30/README.md`.

## 2026-07-30T18:35:02+02:00 Codex — DNA de campaña editorial
**Qué se hizo:** Se analizó el tablero visual aportado por Jordan y se elevó el prompt a `healing-minds-v3` con cinco tratamientos coherentes: estudio editorial, lifestyle al sol, interior texturizado, cinematográfico limpio y documental-fashion. Se añadieron dirección de color, óptica, vestuario, expresión y realismo físico inspiradas en la arquitectura de prompt de XL Homes.
**Decisiones:** Las referencias definen luz, color, encuadre, textura y energía, no personas, ropa, logos ni composición para copiar. Los ejemplos con menores no autorizan contenido pediátrico; el motor genera adultos ficticios. No se promete ausencia absoluta de artefactos: cada candidato conserva revisión humana obligatoria.
**Pendientes/bugs:** Ejecutar una generación real en Preview y rechazar cualquier candidato con manos, rostro, contacto, texto, logo, encuadre o implicación clínica defectuosos.
**Archivos tocados:** `server/blog/images/prompt.ts`, `scripts/blog-image-guards.ts`, `docs/BLOG_VISUAL_EDITORIAL_METHOD.md`, `docs/SEO_PUBLISHING_SPRINT_17.md`, `_arnes/DECISIONES.md`, `_arnes/BITACORA.md`, evidencia del arnés.
**Evidencia:** El guard focalizado exige versión v3, tratamiento de campaña, look medium-format, adultos ficticios, exclusión de menores y coherencia anatómica/espacial; la validación completa se repite antes del push.
