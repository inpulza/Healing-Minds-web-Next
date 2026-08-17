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

## 2026-07-30T18:41:15+02:00 Codex — cierre de Preview
**Qué se hizo:** Se publicó el segundo commit de campaña en la rama del PR draft #4, se esperó el deployment de Vercel y se verificaron las rutas vivas sin introducir credenciales reales.
**Decisiones:** El navegador anónimo queda bloqueado por Deployment Protection de Vercel, como corresponde; no se inició sesión en la cuenta de Jordan ni se desactivó esa protección. No se cambió la identidad Git local.
**Pendientes/bugs:** Jordan debe abrir el Preview desde su sesión de Vercel, hacer una generación real y aprobar visualmente el candidato. Normalizar `user.name`/`user.email` local si se desea que futuros commits/deployments muestren otra identidad.
**Archivos tocados:** evidencia y bitácora del arnés.
**Evidencia:** PR #4 draft, head `3d011489b3b40b009af491ce00ef304585f70a47`, mergeable; GitHub Quality PASS; Vercel PASS; deployment `dpl_Fg5wpB9K8kjR9WMKD7Z3anqvqtna` Preview Ready; `/admin/login` HTTP 200 y `/api/admin/session` confirmó `configured=true`, `mode=custom`, `authenticated=false` mediante la CLI autenticada de Vercel.

## 2026-07-30T20:10:00+02:00 Codex — profundidad editorial acotada
**Qué se hizo:** Se confirmó que el borrador copiado de Preview tenía aproximadamente 595 palabras frente al mínimo editorial de 800; se reforzó el primer prompt con criterios exactos de longitud y se añadió una sola ampliación automática antes de devolver un borrador corto.
**Decisiones:** La segunda pasada reutiliza el borrador ya validado y las mismas allowlists de fuentes y enlaces. No puede añadir estudios, estadísticas, URLs, historias de pacientes, diagnósticos ni promesas. Si falla o no produce un texto más largo y válido, se conserva el primer borrador con aviso de revisión humana.
**Pendientes/bugs:** Validar la experiencia con una nueva generación real en Preview después del deployment automático del PR. Los borradores ya guardados no se reescriben.
**Archivos tocados:** `server/blog/ai/generator.ts`, `server/blog/ai/prompts.ts`, `server/blog/ai/validation.ts`, guard y test de profundidad, documentación Sprint 8 y evidencia del arnés.
**Evidencia:** Pruebas mock sin API real cubren ampliación exitosa, omisión de la segunda llamada cuando el primer borrador ya cumple y conservación segura cuando la ampliación falla. La evidencia final de test/check/build/db se añadirá tras ejecutar la validación completa.

## 2026-07-30T20:24:00+02:00 Codex — validación de profundidad editorial
**Qué se hizo:** Se ejecutó la batería completa después de incorporar la ampliación acotada y se actualizó la metodología central reutilizable del motor.
**Decisiones:** No se hizo una generación pagada ni se tocó Vercel, Neon, Production o un post existente durante la validación.
**Pendientes/bugs:** Hacer una nueva generación real desde el Preview del PR #4 una vez desplegado el commit; el warning preexistente de `caniuse-lite` permanece fuera de alcance.
**Archivos tocados:** Evidencia y bitácora del arnés; `CONTEXTO.md` y `ESTADO.md` del command center fuera del repo.
**Evidencia:** `npm test` PASS 59/59; `npm run blog:depth-check` PASS; `npm run check` PASS; `npm run build` PASS 89/89; `npm run db:verify` PASS con 2 migraciones, 95 statements, 18 tablas, 20 foreign keys y tags ordenados; `blog:image-check`, `blog:topic-check` y `blog:link-check` PASS; `git diff --check` PASS.
## 2026-07-31 Codex — robustez de jobs, inventario e imágenes
**Qué se hizo:** El planificador recorre todo el inventario; las ejecuciones concurrentes respetan un único ganador; `queued` se recupera y topic planning mantiene heartbeat; las imágenes pagadas tienen rate limit, las generaciones abandonadas se recuperan y el borrado físico ocurre después del commit.
**Decisiones:** Se conserva revisión humana y borradores. Los fallos de limpieza física posteriores al commit se reportan como warning para no mentir sobre el estado ya confirmado de la base de datos.
**Pendientes/bugs:** Un rate limit global multi-instancia requeriría almacenamiento distribuido y queda fuera de este PR pequeño.
**Archivos tocados:** almacenamiento/generación del blog, rutas Next/Express de imágenes, planificador, guards y evidencia del arnés.
**Evidencia:** Matriz y decisiones en `_arnes/evidencia/CODE-REVIEW-BLOG-ROBUSTNESS-2026-07-31.md`.
## 2026-07-31 Codex — analítica de reservas y semántica SEO
**Qué se hizo:** Las reservas CharmHealth ahora generan la conversión GA4 consentida; los leads esperan a que GA tenga destino configurado; la home conserva un único H1 en el DOM.
**Decisiones:** La cola de leads es acotada, no contiene PII y se elimina al revocar consentimiento. TikTok y canonical no se reescriben porque sus hallazgos históricos ya están resueltos en main.
**Pendientes/bugs:** Validar en Preview con un contenedor GA real tras revisión del PR; no se modifica ninguna variable ni se publica.
**Archivos tocados:** `client/src/lib/analytics.ts`, componentes CharmHealth/MobileToolbar/Footer/Hero, guard de analítica y evidencia del arnés.
**Evidencia:** Guard automático exige cobertura en las cuatro variantes CharmHealth y en los otros puntos de reserva; detalle en `_arnes/evidencia/CODE-REVIEW-ANALYTICS-SEO-2026-07-31.md`.
## 2026-07-31 Codex — revisión clínica, licencia y horarios
**Qué se hizo:** Se contrastaron los claims de licencia y certificación con los registros oficiales; se retiró de EN/ES el claim de certificación de junta no corroborado y se unificaron nueve páginas de ubicación con el horario oficial de fin de semana cerrado.
**Decisiones:** La licencia California A 198275 permanece porque DCA la muestra vigente. La ausencia en ABPN no se presenta como prueba negativa; el claim se retira preventivamente hasta que Healing Minds aporte verificación oficial. No se autoaprueba contenido YMYL.
**Pendientes/bugs:** Revisión humana de Healing Minds y, si existe, incorporación futura de documentación oficial de board certification.
**Archivos tocados:** `client/src/data/pageContent/legal/telehealthConsent.ts`, nueve `client/src/pages/Location*.tsx`, `tests/clinical-content-guards.test.mjs`, `_arnes/evidencia/CODE-REVIEW-CLINICAL-2026-07-31.md`, `_arnes/BITACORA.md`.
**Evidencia:** California DCA consultado el 2026-07-31: licencia A 198275 vigente; ABPN VerifyCERT sin coincidencias en tres variantes del nombre, con advertencia oficial de que la ausencia no es prueba de no certificación. Guard clínico focalizado PASS 2/2; suite integrada, typecheck, DB y build se repitieron después de actualizar la rama con `main`.

## 2026-07-31 Codex — aislamiento del verificador de contacto
**Qué se hizo:** Se corrigieron los dos P2 vigentes del PR #3. Cada ejecución del verificador usa ahora una dirección única y borra por correo además de por id para cubrir respuestas perdidas después de persistir. Tras Code Review, la limpieza histórica se restringió a filas antiguas con los tres marcadores exactos del workflow.
**Decisiones:** El cambio queda aislado del corte de dominio y no altera la ruta pública de contacto. `VERIFY_CONTACT_EMAIL` es una plantilla explícita que debe contener `{run}`; así el operador declara una dirección única que su proveedor enruta, sin que el código asuma soporte universal de plus-addressing. Sin variable se usa la dirección de prueba documentada `delivered+{run}@resend.dev`.
**Pendientes/bugs:** El preview inmutable del PR está detrás de Vercel Authentication; la verificación funcional se ejecutó contra la URL estable del mismo proyecto. El warning de `caniuse-lite` y las vulnerabilidades informadas por `npm audit` no se modificaron.
**Archivos tocados:** `scripts/verify-live-contact.ts`, `tests/contact-verification-workflow.test.mjs`, `_arnes/BITACORA.md`.
**Evidencia:** prueba enfocada PASS 3/3; `npm test` PASS 58/58; `npm run check` PASS; `npm run db:verify` PASS con 2 migraciones, 95 statements, 18 tablas, 20 foreign keys, ordered tags y contact insert; `npm run build` PASS con 89/89 páginas; implementación final ejecutada de forma controlada contra `healing-minds-psychiatry-nextjs.vercel.app` con plantilla `delivered+{run}@resend.dev`: PASS 200, persistencia confirmada y limpieza confirmada. El preview inmutable devolvió 401 en el borde antes de ejecutar la ruta.

## 2026-07-31 Codex — seguimiento de Code Review clínico
**Qué se hizo:** Se clasificó como válida la nota P1 de CodeX sobre promesas residuales de disponibilidad en Immokalee; se corrigieron todas las fuentes hiperlócales y FAQ en EN/ES para reflejar únicamente telesalud entre semana dentro del horario publicado.
**Decisiones:** No se promete disponibilidad por la tarde, fines de semana ni citas adaptadas al horario agrícola. El texto publicado indica lunes a viernes, 8:00 AM–5:00 PM, y pide confirmar un horario disponible al programar.
**Pendientes/bugs:** Revisión final de CodeX y revisión humana de Healing Minds para cualquier futura ampliación de horarios.
**Archivos tocados:** `client/src/data/locationHyperlocal.ts`, `client/src/data/locationFAQs.ts`, `tests/clinical-content-guards.test.mjs`, `_arnes/evidencia/CODE-REVIEW-CLINICAL-2026-07-31.md`, `_arnes/BITACORA.md`.
**Evidencia:** guard clínico ampliado para rechazar `evening`, `weekend`, equivalentes en español y claims de adaptación al horario del campo dentro de las secciones Immokalee; suite completa y build pendientes de repetición sobre el diff final.

## 2026-07-31 Codex — verificación final del seguimiento clínico
**Qué se hizo:** Se repitió toda la batería sobre el diff que corrige la nota P1 de CodeX.
**Decisiones:** La corrección queda lista para una segunda revisión independiente; no se fusiona hasta recibirla y clasificar cualquier nota nueva.
**Pendientes/bugs:** Segunda revisión de CodeX y deployment inmutable del HEAD final.
**Archivos tocados:** `_arnes/evidencia/CODE-REVIEW-CLINICAL-2026-07-31.md`, `_arnes/BITACORA.md`.
**Evidencia:** guard focalizado PASS 3/3; `npm test` PASS 61/61; `npm run check` PASS; `npm run db:verify` PASS con 2 migraciones, 95 statements, 18 tablas, 20 foreign keys, ordered tags y contact insert; `npm run build` PASS con 89/89 páginas.

## 2026-07-31 Codex — reconciliación de metadatos clínicos en preview
**Qué se hizo:** La lectura HTTP del preview inmutable reveló que las descripciones SEO congeladas de Immokalee todavía prometían telesalud por la tarde. Se alinearon description, Open Graph y Twitter en EN/ES con la disponibilidad entre semana y se añadió el manifiesto al guard.
**Decisiones:** La comprobación de claims clínicos incluye tanto el contenido renderizado como el metadata que pueden mostrar buscadores y redes sociales.
**Pendientes/bugs:** Repetir batería, deployment inmutable y Code Review sobre el nuevo HEAD.
**Archivos tocados:** `shared/seo-manifest.json`, `tests/clinical-content-guards.test.mjs`, `_arnes/evidencia/CODE-REVIEW-CLINICAL-2026-07-31.md`, `_arnes/BITACORA.md`.
**Evidencia:** preview `dpl_8HhQX8yA3Um1MgFTF12dLSfScGd2` READY; lectura HTTP de `/locations/psychiatrist-immokalee` confirmó el claim obsoleto en meta description antes de esta corrección.

## 2026-07-31 Codex — verificación del manifiesto SEO corregido
**Qué se hizo:** Se ejecutó la batería completa después de incorporar las seis descripciones SEO de Immokalee al cambio y al guard.
**Decisiones:** El HEAD final volverá a pasar por CI, preview inmutable y Code Review antes del merge.
**Pendientes/bugs:** Deployment y revisión independiente del nuevo SHA.
**Archivos tocados:** `_arnes/BITACORA.md`.
**Evidencia:** guard focalizado PASS 3/3; `npm test` PASS 61/61; `npm run check` PASS; `npm run db:verify` PASS con 2 migraciones, 95 statements, 18 tablas y 20 foreign keys; `npm run build` PASS con 89/89 páginas.

## 2026-07-31 Codex — reconciliación sistémica de elegibilidad adult-only
**Qué se hizo:** Un juez independiente detectó que Immokalee aún ofrecía atención a teens/adolescentes pese a las políticas de adultos 18+. Se auditó el patrón completo y se corrigieron las nueve páginas de ubicación afectadas, Golden Gate e Immokalee hiperlócales, el índice de servicios, Naples y About en EN/ES.
**Decisiones:** Las referencias comunitarias a niños o familias no se alteran cuando no describen pacientes de Healing Minds. Toda oferta clínica revisada se limita a adultos de 18 años en adelante.
**Pendientes/bugs:** Repetir batería, deployment inmutable y Code Review del nuevo HEAD.
**Archivos tocados:** nueve `client/src/pages/Location*.tsx`, `client/src/data/locationHyperlocal.ts`, `client/src/data/pageContent/services/servicesIndex.ts`, `client/src/data/pageContent/mainPages/naples.ts`, `client/src/data/pageContent/mainPages/about.ts`, `tests/clinical-content-guards.test.mjs`, `_arnes/evidencia/CODE-REVIEW-CLINICAL-2026-07-31.md`, `_arnes/BITACORA.md`.
**Evidencia:** búsqueda global de `teen|adolescent` en `client/src/pages`, `client/src/data` y `shared/seo-manifest.json` sin coincidencias después de la corrección; suite completa y build pendientes sobre el diff final.

## 2026-07-31 Codex — verificación final de elegibilidad adult-only
**Qué se hizo:** Se repitió toda la batería después de corregir el patrón sistémico y añadir el guard adult-only.
**Decisiones:** El cambio vuelve a Code Review y a un preview inmutable; el PR no se fusiona hasta clasificar cualquier nota nueva.
**Pendientes/bugs:** Deployment y revisión independiente del nuevo SHA.
**Archivos tocados:** `_arnes/evidencia/CODE-REVIEW-CLINICAL-2026-07-31.md`, `_arnes/BITACORA.md`.
**Evidencia:** guard focalizado PASS 4/4; `npm test` PASS 62/62; `npm run check` PASS; `npm run db:verify` PASS con 2 migraciones, 95 statements, 18 tablas y 20 foreign keys; `npm run build` PASS con 89/89 páginas.

## 2026-07-31 Codex — semántica completa del guard adult-only
**Qué se hizo:** CodeX detectó que el guard aún podía omitir sinónimos de elegibilidad infantil. Se añadió detección contextual EN/ES para children, minors, pediatric patients, all ages y equivalentes, además de exigir el texto adultos 18+ en cada fuente con una oferta clínica explícita.
**Decisiones:** El detector no cruza límites de oración y prueba fixtures permitidos, por lo que referencias a recursos comunitarios, historia clínica o preguntas que niegan atención a menores permanecen válidas.
**Pendientes/bugs:** Verificación completa, nuevo SHA, Code Review y juez final.
**Archivos tocados:** `tests/clinical-content-guards.test.mjs`, `_arnes/evidencia/CODE-REVIEW-CLINICAL-2026-07-31.md`, `_arnes/BITACORA.md`.
**Evidencia:** thread P2 `PRRT_kwDOToJ8Pc6VdGBj`, comentario `3691378428`, clasificado válido; corrección pendiente de ejecución.

## 2026-07-31 Codex — verificación del guard semántico adult-only
**Qué se hizo:** Se ejecutó la batería completa con los patrones contextuales y las aserciones positivas de adultos 18+.
**Decisiones:** El detector permite referencias comunitarias a niños separadas por oración, pero rechaza ofertas clínicas equivalentes en EN/ES y prueba ambos comportamientos con fixtures.
**Pendientes/bugs:** Último Code Review, CI y juez del SHA resultante.
**Archivos tocados:** `_arnes/BITACORA.md`.
**Evidencia:** guard focalizado PASS 4/4; `npm test` PASS 62/62; `npm run check` PASS; `npm run db:verify` PASS con 2 migraciones, 95 statements, 18 tablas y 20 foreign keys; `npm run build` PASS con 89/89 páginas.

## 2026-07-31 Codex — ampliación final del guard adult-only
**Qué se hizo:** CodeX clasificó como P2 válida la omisión de `locationFAQs.ts` y `shared/seo-manifest.json` en la lista de superficies protegidas. Ambas fuentes publicadas se añadieron al guard.
**Decisiones:** El hallazgo es preventivo: no había una oferta actual a menores en FAQ o metadata, pero futuras ediciones deben quedar bloqueadas igual que el contenido visible.
**Pendientes/bugs:** Repetir batería, deployment, Code Review del nuevo SHA y pase final del juez.
**Archivos tocados:** `tests/clinical-content-guards.test.mjs`, `_arnes/evidencia/CODE-REVIEW-CLINICAL-2026-07-31.md`, `_arnes/BITACORA.md`.
**Evidencia:** thread P2 `PRRT_kwDOToJ8Pc6Vc8e9`, comentario `3691322189`, clasificado válido; corrección pendiente de verificación final.

## 2026-07-31 Codex — verificación final de superficies adult-only
**Qué se hizo:** Se repitió la batería completa con FAQ y manifiesto SEO incluidos en el guard.
**Decisiones:** El nuevo SHA se somete al último Code Review y al juez antes del merge.
**Pendientes/bugs:** Cerrar los gates externos del HEAD resultante.
**Archivos tocados:** `_arnes/BITACORA.md`.
**Evidencia:** guard focalizado PASS 4/4; `npm test` PASS 62/62; `npm run check` PASS; `npm run db:verify` PASS con 2 migraciones, 95 statements, 18 tablas y 20 foreign keys; `npm run build` PASS con 89/89 páginas.

## 2026-07-31 Codex — cierre del componente compartido adult-only
**Qué se hizo:** El segundo pase del juez encontró la misma oferta a teens/adolescentes en `client/src/components/Services.tsx`, fuera del inventario inicial de páginas y datos. Se corrigió EN/ES y se incorporó el componente al guard.
**Decisiones:** La auditoría textual se amplía a todo `client/src`; las referencias contextuales a menores que no sean ofertas de atención no se confunden con elegibilidad clínica.
**Pendientes/bugs:** Repetir batería, deployment inmutable, Code Review y pase final del juez sobre el nuevo SHA.
**Archivos tocados:** `client/src/components/Services.tsx`, `tests/clinical-content-guards.test.mjs`, `_arnes/evidencia/CODE-REVIEW-CLINICAL-2026-07-31.md`, `_arnes/BITACORA.md`.
**Evidencia:** búsqueda completa de `teen|adolescent` en `client/src` y `shared/seo-manifest.json` sin coincidencias después de esta corrección.

## 2026-07-31 Codex — verificación del componente compartido adult-only
**Qué se hizo:** Se repitió la batería completa con el componente de servicios dentro del guard.
**Decisiones:** El nuevo HEAD vuelve a CI, preview, Code Review y juez independiente antes del merge.
**Pendientes/bugs:** Completar los cuatro gates externos del nuevo SHA.
**Archivos tocados:** `_arnes/BITACORA.md`.
**Evidencia:** guard focalizado PASS 4/4; `npm test` PASS 62/62; `npm run check` PASS; `npm run db:verify` PASS con 2 migraciones, 95 statements, 18 tablas y 20 foreign keys; `npm run build` PASS con 89/89 páginas.

## 2026-07-31 Codex — cierre de variantes pediátricas y límite 18 inclusivo
**Qué se hizo:** El Code Review exacto de `688cc80` detectó dos P2 válidos: el guard omitía ofertas adjetivales pediátricas EN/ES y un FAQ excluía involuntariamente a pacientes de exactamente 18 años. Se ampliaron patrones y fixtures, se corrigió el FAQ a 18 años en adelante y se bloqueó la redacción exclusiva en todas las superficies publicadas.
**Decisiones:** La regla clínica queda normalizada como adultos de 18 años en adelante. El guard debe detectar tanto sustantivos como adjetivos pediátricos sin bloquear menciones contextuales que no sean ofertas de atención.
**Pendientes/bugs:** Repetir CI, preview y Code Review sobre el nuevo SHA; no fusionar mientras exista un hilo válido abierto.
**Archivos tocados:** `client/src/data/locationFAQs.ts`, `tests/clinical-content-guards.test.mjs`, `_arnes/evidencia/CODE-REVIEW-CLINICAL-2026-07-31.md`, `_arnes/BITACORA.md`.
**Evidencia:** threads P2 `PRRT_kwDOToJ8Pc6VdUCq` y `PRRT_kwDOToJ8Pc6VdUCu`, comentarios `3691461648` y `3691461653`, clasificados válidos; guard focalizado PASS 4/4; `npm test` PASS 62/62; `npm run check` PASS; `npm run db:verify` PASS con 2 migraciones, 95 statements, 18 tablas, 20 foreign keys, ordered tags y contact insert; `npm run build` PASS con 89/89 páginas.

## 2026-07-31 Codex — cierre singular/plural del límite de edad
**Qué se hizo:** El Code Review de `1cddcd2` detectó que `mayor de 18 años` podía eludir el bloqueo preventivo porque el patrón cubría solo una forma plural incorrectamente construida. Se normalizó el detector para singular, plural y variantes equivalentes EN/ES, con siete fixtures explícitos.
**Decisiones:** Cualquier fórmula que excluya a la persona de exactamente 18 años debe fallar; la redacción aprobada sigue siendo 18 años en adelante.
**Pendientes/bugs:** Completar CI, preview y Code Review del nuevo SHA antes del merge.
**Archivos tocados:** `tests/clinical-content-guards.test.mjs`, `_arnes/evidencia/CODE-REVIEW-CLINICAL-2026-07-31.md`, `_arnes/BITACORA.md`.
**Evidencia:** thread P2 `PRRT_kwDOToJ8Pc6Vdd_C`, comentario `3691521515`, clasificado válido; guard focalizado PASS 4/4; `npm test` PASS 62/62; `npm run check` PASS; `npm run db:verify` PASS con 2 migraciones, 95 statements, 18 tablas, 20 foreign keys, ordered tags y contact insert; `npm run build` PASS con 89/89 páginas.

## 2026-07-31 Codex — exposición de desarrollo y privacidad
**Qué se hizo:** El servidor Next de desarrollo y el Express histórico quedan limitados a loopback fuera de producción; el modo admin desactivado solo funciona en requests locales; se retiró el logging de cuerpos JSON y se reforzó el filtro de PII para nombres aislados.
**Decisiones:** Production y Preview conservan autenticación custom fail-closed y binding público de producción. No se tocaron secretos ni variables de Vercel.
**Pendientes/bugs:** Mantener revisión humana de cualquier contenido que el filtro conservador rechace por posible PII.
**Archivos tocados:** `package.json`, `server/next-admin-auth.ts`, `app/api/admin/login/route.ts`, `server/index.ts`, `server/blog/privacy.ts`, guards/tests y evidencia del arnés.
**Evidencia:** Pruebas añadidas para localhost permitido, host remoto denegado y nombres aislados bloqueados; detalle en `_arnes/evidencia/CODE-REVIEW-SECURITY-PRIVACY-2026-07-31.md`.

## 2026-07-31 Codex — revisión independiente del hardening de privacidad
**Qué se hizo:** El juez reprodujo tres huecos válidos en el primer pase: IPv6 loopback se rechazaba, una cadena `x-forwarded-host` mixta podía aceptar solo su primer salto y el filtro omitía nombres internacionales, etiquetas españolas acentuadas y fechas españolas con mes escrito. También encontró un log histórico que imprimía el contacto persistido completo. Se corrigieron los cuatro puntos y se añadieron guards ejecutados por CI.
**Decisiones:** El modo admin desactivado exige que URL, `Host` y todos los valores de `X-Forwarded-Host` sean loopback. Los logs pueden registrar estado y duración, nunca el body del formulario. El filtro de PII permanece conservador y Unicode-aware.
**Pendientes/bugs:** Completar CI, preview y Code Review del nuevo HEAD antes del merge.
**Archivos tocados:** `server/next-admin-auth.ts`, `server/blog/privacy.ts`, `server/routes.ts`, `tests/admin-auth-flow.test.mjs`, `tests/blog-privacy.test.mjs`, `scripts/blog-image-guards.ts`, `_arnes/evidencia/CODE-REVIEW-SECURITY-PRIVACY-2026-07-31.md`, `_arnes/BITACORA.md`.
**Evidencia:** reproducción previa: IPv6 `false`, nombres con tilde/guion/apóstrofo `false`; adversarial final del juez GO para IPv4/IPv6, autoridades malformadas/mixtas/vacías, nombres Unicode en mayúsculas, con iniciales y partículas, títulos editoriales y etiquetas clínicas españolas. `npm test` PASS 64/64; `npm run check` PASS; `npm run db:verify` PASS con 2 migraciones, 95 statements, 18 tablas, 20 foreign keys, ordered tags y contact insert; `npm run blog:image-check` PASS; `npm run build` PASS con 89/89 páginas.

## 2026-07-31 Codex — fronteras de campos y precisión del guard PII
**Qué se hizo:** CodeX revisó `07a296c` y abrió dos hallazgos válidos: los endpoints unían topic, keyword y contexto con espacios, ocultando un nombre aislado dentro de `additionalContext`; además, la heurística standalone confundía títulos editoriales normales con nombres. Se creó un contrato común que revisa cada campo por separado, mantiene identificadores explícitos en cualquier campo e infiere nombres aislados de forma conservadora donde existe contexto sensible.
**Decisiones:** Los títulos `Understanding Seasonal Affective Disorder`, `Managing Panic Attacks`, `Depresión Estacional` y `Cómo Manejar la Ansiedad` deben pasar como temas editoriales. Los identificadores explícitos se bloquean en todos los campos; un nombre sin etiqueta se bloquea en `additionalContext`, mientras `topic` y `targetKeyword` conservan semántica editorial. Ningún título o keyword histórico se comparte en claro con el proveedor del planificador.
**Pendientes/bugs:** Publicar el nuevo SHA y completar CI, preview y Code Review exacto antes del merge.
**Archivos tocados:** `server/blog/privacy.ts`, endpoints Next/Express de `generate-draft`, `server/blog/ai/topic-planner.ts`, `server/blog/images/service.ts`, `tests/blog-privacy.test.mjs`, `scripts/blog-image-guards.ts`, evidencia y bitácora.
**Evidencia:** threads `PRRT_kwDOToJ8Pc6Vd_D-` (P1) y `PRRT_kwDOToJ8Pc6Vd_EG` (P2), comentarios `3691719619` y `3691719631`, clasificados válidos. El contrato final queda cubierto por la batería integrada y el juez descritos en el pase siguiente.

## 2026-07-31 Codex — segundo pase del guard PII y títulos enviados a IA
**Qué se hizo:** CodeX revisó `ae2f792` y abrió tres notas. Se clasificaron como válidas la exposición de un título existente con forma de nombre y el falso positivo provocado por tildes en títulos editoriales españoles. Se clasificó como inválida la supuesta omisión de `Name: jane doe`: el patrón ya era case-insensitive y el caso se reprodujo como bloqueado; se añadió un fixture para conservar esa evidencia. Un juez independiente confirmó además que `Maria Garcia` sin tilde escapaba en `additionalContext`.
**Decisiones:** El planificador sustituye todos los títulos y keywords existentes por `Private post <id>` antes de enviarlos a proveedores; la detección local de duplicados sigue usando el contenido real sin sacarlo del servidor. El contexto libre detecta estructuras de nombre multicultural sin censos finitos; los campos editoriales solo bloquean etiquetas o contexto explícito de paciente. El contenido completo usado para imágenes puede contener personal público y aplica solo identificadores explícitos; los tres posts publicados sirven como fixtures de no regresión.
**Pendientes/bugs:** Publicar el nuevo SHA, resolver los tres threads con esta clasificación y exigir Code Review exacto, CI, preview y juez final antes del merge.
**Archivos tocados:** `server/blog/privacy.ts`, `server/blog/ai/topic-planner.ts`, `server/blog/images/service.ts`, `tests/blog-privacy.test.mjs`, `scripts/blog-image-guards.ts`, evidencia y bitácora.
**Evidencia:** comentarios `3691817791` (P1 válido), `3691817798` (P2 válido) y `3691817803` (P1 inválido); juez independiente GO final sobre nombres multiculturales, narrativas EN/ES, headings editoriales, tres posts publicados, salida del planificador y generación de imágenes; batería local integrada PASS 67/67, typecheck PASS, DB PASS con 2 migraciones, 95 statements, 18 tablas y 20 foreign keys, `blog:image-check` PASS y build PASS con 89/89 páginas.

## 2026-07-31 Codex — cierre adversarial de privacidad entre campos y proveedores
**Qué se hizo:** Se clasificaron como válidas las seis notas nuevas del Code Review exacto de `0cd8808`: narrativas lowercase EN/ES, colisión del placeholder histórico, identificadores repartidos entre campos, memoria semántica cruda en generación de borradores, etiquetas de nombre sin puntuación y falsos positivos en compuestos editoriales con guion. El guard ahora detecta narrativas explícitas sin depender de una lista finita de verbos, reconstruye sólo fronteras de identificadores estructurados y conserva topics públicos normales. Todo título, slug, keyword y topicKey histórico queda redactado antes de salir al proveedor; el análisis local conserva los valores reales.
**Decisiones:** No se concatenan indiscriminadamente los campos AI. Las fronteras sólo se recomponen para etiquetas explícitas o una narrativa `patient/paciente` partida, con excepciones editoriales verificadas. Los placeholders y keywords históricos se limpian de forma incondicional, sin inferir si hubo sustitución comparando strings.
**Pendientes/bugs:** Crear el commit, publicar el SHA y exigir CI, preview y Code Review exacto sin hallazgos antes del merge.
**Archivos tocados:** `server/blog/privacy.ts`, `server/blog/ai/topic-planner.ts`, `server/blog/ai/memory.ts`, `server/blog/admin-routes.ts`, `tests/blog-privacy.test.mjs`, `scripts/blog-image-guards.ts`, evidencia y bitácora.
**Evidencia:** comentarios `3692089496` P1, `3692089501` P2, `3692089505` P1, `3692089508` P1, `3692114961` P1 y `3692114967` P2, todos válidos. El juez pasó de NO-GO a GO tras reproducir y cerrar verbos libres EN/ES, partículas `de la`, colisiones Will/May, splits de dos/tres campos y cuatro falsos positivos editoriales cross-field. `npm test` PASS 68/68; `npm run check` PASS; `npm run db:verify` PASS con 2 migraciones, 95 statements, 18 tablas, 20 foreign keys, ordered tags y contact insert; `npm run blog:image-check` PASS; `npm run build` PASS con 89/89 páginas; `git diff --check` PASS.

## 2026-07-31 Codex — segundo cierre exacto del guard PII
**Qué se hizo:** El Code Review exacto de `4b1aafe` abrió tres hallazgos válidos: topics de privacidad lowercase rechazados, nombres title-case tras `Patient/Paciente` sin separador omitidos y valores de email/DOB/ID partidos entre varios campos. Se incorporó detección bare de nombre con señal de alta confianza, recomposición compacta sólo detrás de etiquetas explícitas y una política lowercase privacy-first basada en el primer lead editorial, sin lista finita de verbos.
**Decisiones:** Ante texto ambiguo tras `patient/paciente`, se prioriza bloquear posible PII. Los topics comunes de privacidad, HIPAA, telehealth, housing, family y conceptos clínicos/operacionales documentados se permiten; un editor puede reformular un topic conservadoramente rechazado. Los fragmentos sin etiqueta no se recomponen para evitar falsos positivos entre campos.
**Pendientes/bugs:** Publicar el nuevo SHA y repetir CI, preview y Code Review exacto; no fusionar hasta cerrar los tres threads y confirmar cero hallazgos nuevos.
**Archivos tocados:** `server/blog/privacy.ts`, `tests/blog-privacy.test.mjs`, `scripts/blog-image-guards.ts`, evidencia y bitácora.
**Evidencia:** comentarios `3692271532` P2, `3692271535` P1 y `3692271541` P1, clasificados válidos. El juez pasó de NO-GO a GO al verificar narrativas con nombre de una/dos palabras y verbos libres EN/ES, topics privacy/confidentiality/HIPAA/Telehealth/housing/family, bare names directos y split, y email/DOB/ID fragmentados con/sin etiqueta. Batería integrada: 68/68 tests, typecheck PASS, DB PASS con 2 migraciones/95 statements/18 tablas/20 FKs, image guard PASS, build 89/89 y diff-check PASS.

## 2026-07-31 Codex — anclaje inmediato del nombre tras Patient/Paciente
**Qué se hizo:** El Code Review exacto de `6be7b8f` abrió un P2 válido: la búsqueda del nombre recorría todo el texto posterior a `Patient/Paciente` y podía confundir títulos como `Patient Guide to Managing Anxiety` o `Patient Perspectives on Mental Health` con datos de una persona. La detección bare ahora solo acepta un nombre que empiece inmediatamente después del marcador.
**Decisiones:** Los nombres directos y repartidos entre campos EN/ES siguen bloqueados; los títulos editoriales con una frase no nominal inmediata permanecen permitidos aunque aparezca un nombre más adelante. La heurística conservadora y la redacción antes del egress no cambian.
**Pendientes/bugs:** Publicar el SHA, resolver el thread y exigir CI, preview y Code Review exacto sin hallazgos antes del merge.
**Archivos tocados:** `server/blog/privacy.ts`, `tests/blog-privacy.test.mjs`, `scripts/blog-image-guards.ts`, `_arnes/evidencia/CODE-REVIEW-SECURITY-PRIVACY-2026-07-31.md`, `_arnes/BITACORA.md`.
**Evidencia:** comentario `3692390069`, thread `PRRT_kwDOToJ8Pc6VfuPD`, clasificado válido. Juez independiente GO para títulos editoriales, nombres directos/split, narrativas lowercase y egress redactado. Batería integrada: 68/68 tests, typecheck PASS, DB PASS con 2 migraciones/95 statements/18 tablas/20 FKs, image guard PASS, build 89/89 y diff-check PASS.

## 2026-07-31 Codex — cierre de nombres posteriores y contexto geográfico
**Qué se hizo:** El Code Review exacto de `2bca420` abrió un P1 válido: al anclar el nombre al primer token, una narrativa como `Patient provided Jane Doe as her name` podía omitir el identificador. Se añadió detección estructural de nombres posteriores, declaraciones explícitas, wrappers y monónimos EN/ES, con soporte cross-field. El juez separó después identidades de ubicaciones multiword para que New York, Los Angeles y South Florida no se confundan con personas.
**Decisiones:** La identidad tiene prioridad en verbos/copulas de contacto o referencia; la geografía solo prevalece con señales estructurales fuertes de dirección, preposición, movimiento o contexto editorial. Los títulos Guide/Perspectives y los temas de recursos, HIPAA, privacidad y telehealth permanecen permitidos. El egress al proveedor conserva la redacción incondicional y la memoria local mantiene los valores reales.
**Pendientes/bugs:** Publicar el SHA, resolver el thread y repetir CI, preview y Code Review exacto antes del merge.
**Archivos tocados:** `server/blog/privacy.ts`, `tests/blog-privacy.test.mjs`, `scripts/blog-image-guards.ts`, `_arnes/evidencia/CODE-REVIEW-SECURITY-PRIVACY-2026-07-31.md`, `_arnes/BITACORA.md`.
**Evidencia:** comentario `3692466757`, node `PRRC_kwDOToJ8Pc7cFpJF`, clasificado válido. Juez final GO sin hallazgos accionables para identidad/geografía EN/ES, campos partidos, regresiones históricas y egress redactado; focused 8/8, typecheck, image guard y diff-check PASS.

## 2026-07-31 Codex — frontera fail-closed para inputs administrativos de IA
**Qué se hizo:** El Code Review exacto de `b2d8c1c` abrió tres P1 válidos: nombres lowercase después de verbos, etiquetas de nombre con modificadores y una geografía seguida más tarde por una identidad. Después de reproducir también falsos positivos inevitables al ampliar regexes, se sustituyó esa clasificación abierta por una frontera simple: cualquier campo destinado a IA con la palabra completa `patient/paciente` se bloquea y debe reformularse sin el marcador.
**Decisiones:** La regla fail-closed solo aplica a `topic`, `targetKeyword` y `additionalContext` antes del egress. El detector estrecho del contenido público y de las imágenes permanece sin cambios, y los identificadores explícitos sin marcador siguen cubiertos por las señales existentes.
**Pendientes/bugs:** Recibir el veredicto del juez independiente, publicar el nuevo SHA, resolver los tres hilos y exigir CI, Preview y Code Review exacto sin hallazgos antes del merge.
**Archivos tocados:** `server/blog/privacy.ts`, `tests/blog-privacy.test.mjs`, `scripts/blog-image-guards.ts`, `_arnes/evidencia/CODE-REVIEW-SECURITY-PRIVACY-2026-07-31.md`, `_arnes/DECISIONES.md`, `_arnes/BITACORA.md`.
**Evidencia:** comentarios `3692767393`, `3692767396` y `3692767400`, clasificados válidos. Nueve casos adversariales directos/split bloqueados, cuatro reformulaciones sin marcador permitidas; `npm test` PASS 68/68, TypeScript PASS, DB PASS con 2 migraciones/95 statements/18 tablas/20 FKs, image guard PASS, build 89/89 y diff-check PASS.

## 2026-07-31 Codex — alineación del planificador con la frontera fail-closed
**Qué se hizo:** El primer pase del juez detectó que el planificador podía recomendar un título con `patient/paciente` y que las rutas seleccionaban o reclamaban el plan antes del mismo control que luego lo rechazaría. Se aplicó el contrato al filtro determinista de propuestas, se reformuló el prompt y se movieron selección y claim después de todos los gates en Express y Next.
**Decisiones:** Ningún candidato se ofrece si sus campos usados por generación incumplen la frontera. Leer y construir overrides desde un candidato no consume estado; `selectBlogTopicCandidate` y `claimCompletedBlogPlanningRun` solo se ejecutan tras privacidad, configuración, rate limit y `assertGuidedBlogTopicSafe`. El 400 explica que un tema público debe reformularse sin `patient/paciente`.
**Pendientes/bugs:** Crear y publicar el SHA, responder/resolver los tres P1 y exigir CI, Preview y Code Review exacto sin hallazgos antes del merge.
**Archivos tocados:** `server/blog/ai/topic-planner.ts`, `server/blog/ai/topic-provider.ts`, `server/blog/admin-routes.ts`, `app/api/admin/blog/[[...path]]/route.ts`, `tests/blog-privacy.test.mjs`, evidencia y bitácora.
**Evidencia:** juez inicial NO-GO reproducido y juez final GO sin hallazgos accionables; planificador 3/3 campos con marcador bloqueados, candidato neutral permitido, rutas verificadas en orden no mutante. `npm test` PASS 69/69; TypeScript, image guard, topic guard, DB 2 migraciones/95 statements/18 tablas/20 FKs, build 89/89 y diff-check PASS.

## 2026-07-31 Codex — cierre de etiquetas genéricas de nombre
**Qué se hizo:** El Code Review exacto de `23dbab7` detectó que `Legal name jane doe` y `Nombre completo maría garcía` podían llegar al proveedor sin `patient/paciente`. Dos intentos de parsear modificadores, separadores y wrappers recibieron NO-GO del juez por falsos positivos públicos y por variantes naturales restantes. Se sustituyeron por una extensión estructural de la frontera administrativa a palabras completas `name/nombre`, con tokenización de snake_case y camelCase.
**Decisiones:** Los cuatro marcadores `patient/paciente/name/nombre` se bloquean solo en campos administrativos destinados a IA. El detector de contenido publicado e imágenes no cambia; un tema legítimo se reformula con `identity/identidad`. Prompt del planner y respuestas 400 describen el mismo contrato.
**Pendientes/bugs:** Publicar el nuevo SHA, responder y resolver `PRRT_kwDOToJ8Pc6VhR3D`, y exigir CI, Preview y Code Review exacto sin hallazgos antes del merge.
**Archivos tocados:** `server/blog/privacy.ts`, `server/blog/ai/topic-provider.ts`, rutas Express/Next de generación, `tests/blog-privacy.test.mjs`, `scripts/blog-image-guards.ts`, evidencia, decisiones y bitácora.
**Evidencia:** comentario `3692984692` clasificado válido. Juez final GO: matriz de marcadores directos/split, prefijos, wrappers, puntuación, snake/camel, controles limpios, títulos públicos, PII explícito, planner y egress PASS; suite 69/69, TypeScript, image/topic guards y diff-check PASS.

## 2026-07-31 Codex — contexto editorial libre fuera del egress
**Qué se hizo:** El Code Review exacto de `febca6b` abrió un P1 válido porque un nombre lowercase sin etiqueta podía no ser inferido por los guards y `additionalContext` se copiaba literalmente al prompt externo. Se probó una heurística de nombres cortos, pero el juez emitió NO-GO: bloqueaba expresiones clínicas normales y seguía siendo evadible. Se retiró esa heurística. La frontera de `generateBlogDraftWithAi` ahora elimina siempre el campo libre antes de construir el request y conserva el brief estructurado generado localmente.
**Decisiones:** La privacidad no dependerá de adivinar si una frase lowercase es una persona. El texto libre puede ayudar localmente a escoger fuentes y outline, pero no sale verbatim. La interfaz informa de este comportamiento. Los guards fiables de email, teléfono, DOB, ID, dirección, marcadores explícitos y nombres title-case permanecen para feedback temprano.
**Pendientes/bugs:** Obtener GO final del juez, crear y publicar el SHA, responder/resolver `PRRT_kwDOToJ8Pc6VhquP`, y repetir Quality, Preview y Code Review exacto antes del merge.
**Archivos tocados:** `server/blog/ai/generator.ts`, `client/src/pages/admin/BlogAdminPage.tsx`, `tests/blog-privacy.test.mjs`, `scripts/blog-image-guards.ts`, evidencia, decisiones y bitácora.
**Evidencia:** comentario `3693133914` clasificado válido. Test runtime intercepta `fetch`: `jane doe`, `maría garcía` y el texto libre completo no aparecen en el body; el brief canónico sí. Diecinueve frases clínicas lowercase EN/ES permanecen permitidas y `medication safety` sigue afectando localmente la selección de fuente. Focused 2/2, TypeScript e image guard PASS.

## 2026-07-31 Codex — cierre exacto de túnel, plurales y proveniencia planner
**Qué se hizo:** El Code Review exacto de `65c4da1` abrió tres notas válidas. El Express heredado ahora valida la IP efectiva además del peer y las autoridades, de modo que un túnel local con cliente remoto recibe 403 en middleware, sesión y login. Los labels plurales con separador se detectan dentro de un campo o repartidos entre dos/tres campos. El contexto humano sigue fuera del egress, mientras el ángulo generado y verificado por el planificador viaja por un canal de proveniencia separado.
**Decisiones:** No se confía solo en la dirección del socket cuando `trust proxy=1`. No se bloquean globalmente palabras plurales editoriales: se exige separador explícito. `providerEditorialContext` nunca se toma directamente del request; Express/Next lo pasan únicamente después de verificar `topicCandidateId`, y auto-generation lo toma del candidato seleccionado.
**Pendientes/bugs:** Ejecutar batería integrada y build, publicar el SHA, responder/resolver los tres threads y exigir nuevamente Quality, Preview y Code Review exacto antes del merge.
**Archivos tocados:** `server/admin-auth.ts`, `server/blog/privacy.ts`, `server/blog/ai/types.ts`, `server/blog/ai/generator.ts`, `server/blog/admin-routes.ts`, ruta Next, tests/guards, evidencia, decisiones y bitácora.
**Evidencia:** `3693243874` / `PRRT_kwDOToJ8Pc6Vh86A`, `3693243877` / `PRRT_kwDOToJ8Pc6Vh86E` y `3693243881` / `PRRT_kwDOToJ8Pc6Vh86H`, todos clasificados válidos. Juez final GO en 3/3: túnel con `req.ip` remoto bloqueado, fronteras plurales EN/ES bloqueadas sin censurar controles editoriales, human context ausente y trusted angle presente en fetch runtime. Focused, TypeScript, image/topic guards y diff-check PASS.

## 2026-07-31 Codex — preview Replit autenticada y PII cross-field en imágenes
**Qué se hizo:** El Code Review exacto de `837c850` abrió dos notas válidas. Se conservó el desarrollo local de Next en loopback y se creó un comando separado para la preview pública de Replit, con carga previa de `.env*` y rechazo explícito de `off/disabled`. El guard de imágenes ahora detecta etiquetas y valores repartidos entre título, excerpt, heading y contenido sin concatenar indiscriminadamente los campos.
**Decisiones:** Replit puede seguir sirviendo una preview en `0.0.0.0:5000`, pero solo con autenticación activa. En imágenes, etiquetas fuertes de paciente o nombre legal/completo fallan en cerrado incluso si el valor parece una frase editorial; etiquetas genéricas usan un filtro de leads editoriales para evitar falsos positivos.
**Pendientes/bugs:** Publicar el nuevo SHA, responder/resolver los dos threads y exigir Quality, Preview Ready y Code Review exacto sin notas antes del merge.
**Archivos tocados:** `.replit`, `package.json`, `package-lock.json`, `scripts/run-replit-dev.mjs`, `server/blog/privacy.ts`, `server/blog/images/service.ts`, guards/tests, evidencia, decisiones y bitácora.
**Evidencia:** comentarios `3693358195` / `PRRT_kwDOToJ8Pc6ViP6h` y `3693358202` / `PRRT_kwDOToJ8Pc6ViP6n`, ambos válidos. El juez pasó de NO-GO por `.env*`, wrappers y ambigüedad editorial a GO 2/2 tras verificar carga con `@next/env`, modos `off/disabled` desde archivo, nombres envueltos y separación entre labels fuertes y genéricos. Batería integrada final: 71/71 tests, TypeScript PASS, DB PASS con 2 migraciones/95 statements/18 tablas/20 FKs, image/topic guards PASS, build 89/89 y diff-check PASS.

## 2026-07-31 Codex — marcadores clínicos, semántica segura y precheck de planes
**Qué se hizo:** El Code Review exacto de `0a82905` abrió cuatro notas válidas. La frontera AI reconoce `Client/Cliente`, plurales etiquetados y teléfonos internacionales. El topic judge recibe perfiles semánticos canónicos calculados localmente en vez de títulos/keywords históricos. Las rutas Next y Express consultan la disponibilidad del plan antes de privacidad, rate limit y juez externo, sin seleccionar ni reclamar todavía.
**Decisiones:** No se reintroducen resúmenes libres ni títulos sanitizados heurísticamente. Los perfiles tienen solo seis campos enum/faceta cerrados. El precheck es consultivo; privacidad sigue antes de toda mutación y el claim condicionado posterior sigue siendo el árbitro atómico de concurrencia.
**Pendientes/bugs:** Publicar el nuevo SHA, responder/resolver los cuatro threads y repetir Quality, Preview y Code Review exacto.
**Archivos tocados:** privacidad, topic planner/judge/provider, storage de runs, rutas Next/Express, guards/tests, evidencia, decisiones y bitácora.
**Evidencia:** `3693498793` / `PRRT_kwDOToJ8Pc6VinN7`, `3693498795` / `PRRT_kwDOToJ8Pc6VinN9`, `3693498797` / `PRRT_kwDOToJ8Pc6VinN-` y `3693498799` / `PRRT_kwDOToJ8Pc6VinOA`, todos válidos. Juez independiente GO 4/4: marcadores EN/ES, `+34`/`+52`/`00` y 7–15 dígitos, perfiles exclusivamente canónicos y precheck `SELECT` antes de gastos con claim atómico posterior. Batería integrada final: 72/72 tests, TypeScript PASS, DB PASS con 2 migraciones/95 statements/18 tablas/20 FKs, image/topic guards PASS y build 89/89.

## 2026-07-31 Codex — cliente efectivo Next y claim/selección transaccional
**Qué se hizo:** El Code Review exacto de `a2f0675` abrió dos notas válidas. Next `auth-off` valida ahora todos los elementos de `x-forwarded-for` y el valor único de `x-real-ip`, exige esa cadena cuando hay metadata proxy y rechaza el header estándar `Forwarded`. El consumo de un topic plan reclama el run y actualiza el candidato seleccionado dentro de la misma transacción para las tablas actual y legacy.
**Decisiones:** Un header proxy vacío, malformado, mixto o contradictorio no concede sesión de desarrollo. En la transacción, el update condicionado del run ocurre primero; el perdedor concurrente no toca candidatos y cualquier fallo posterior revierte el claim. El conflicto `23505` se convierte en 409 desde el helper compartido para conservar paridad Next/Express.
**Pendientes/bugs:** Publicar el SHA, responder/resolver los dos threads y exigir otra vez Quality, Preview y Code Review exacto.
**Archivos tocados:** `server/next-admin-auth.ts`, `server/blog/topic-candidate-storage.ts`, rutas Next/Express, tests de auth/privacidad, evidencia, decisiones y bitácora.
**Evidencia:** `3693600713` / `PRRT_kwDOToJ8Pc6Vi4L9` y `3693600717` / `PRRT_kwDOToJ8Pc6Vi4MB`, ambos válidos. El juez pasó de NO-GO a GO total: IPv4/IPv6/mapped, listas remotas prepend/append, headers contradictorios/vacíos/malformados, rollback, un único ganador y paridad 409. Batería integrada final: 72/72 tests, TypeScript PASS, DB PASS con 2 migraciones/95 statements/18 tablas/20 FKs, image/topic guards PASS y build 89/89.

## 2026-07-31 Codex — paridad proxy fail-closed en Express
**Qué se hizo:** El Code Review exacto de `f2befa0` detectó que Express podía conservar socket y `req.ip` loopback mientras un proxy declaraba el cliente remoto solo en `X-Real-IP` o `Forwarded`. `isLocalExpressAdminRequest` valida ahora la presencia y contenido de toda la metadata proxy con el mismo contrato de Next.
**Decisiones:** Socket, `req.ip`, Host y XFH siguen siendo obligatorios y no se sustituyen. Además, XFF completo y X-Real-IP único deben ser loopback; metadata proxy exige cadena verificada y `Forwarded` se rechaza sin interpretarlo.
**Pendientes/bugs:** Publicar el SHA, responder/resolver el thread y repetir Quality, Preview y Code Review exacto.
**Archivos tocados:** `server/admin-auth.ts`, `tests/admin-auth-flow.test.mjs`, evidencia, decisiones y bitácora.
**Evidencia:** `3693670395` / `PRRT_kwDOToJ8Pc6VjD_C`, válido. Juez independiente GO final para X-Real-IP aislado, contradicciones en ambos sentidos, remotos prepend/append, metadata sin cadena, `Forwarded` local/remoto, headers vacíos/malformados y loopbacks IPv4/IPv6/mapped. Batería integrada final: 72/72 tests, TypeScript PASS, DB PASS con 2 migraciones/95 statements/18 tablas/20 FKs, image/topic guards PASS y build 89/89.

## 2026-07-31 Codex — identificadores partidos y contexto semántico persistido
**Qué se hizo:** El Code Review exacto de `297e745` abrió dos notas válidas. La frontera de privacidad reconstruye teléfonos y direcciones no etiquetados partidos entre dos o tres campos, incluyendo un solo dígito o puntuación telefónica en un extremo, pero solo los bloquea si el resultado completo valida. Los borradores guiados recuperan el perfil canónico y el ángulo del candidato persistido; estos valores ganan sobre cualquier override del request y llegan al juez de duplicidad.
**Decisiones:** No se usa un `join` global como detector. La reconstrucción queda acotada a fronteras adyacentes y validación completa para conservar títulos editoriales. El perfil persisted es trusted únicamente después de validar enums/categoría y después del gate de privacidad.
**Pendientes/bugs:** Publicar el nuevo SHA, responder y resolver los dos threads, y repetir Quality, Preview y Code Review exacto antes del merge.
**Archivos tocados:** `server/blog/privacy.ts`, `server/blog/ai/planned-topic-provenance.ts`, `server/blog/ai/topic-planner.ts`, rutas Next/Express, guards/tests, evidencia, decisiones y bitácora.
**Evidencia:** `3693716793` / `PRRT_kwDOToJ8Pc6VjLxa` y `3693716797` / `PRRT_kwDOToJ8Pc6VjLxe`, ambos válidos. El juez pasó de NO-GO por fragmentos extremos de un dígito y signos aislados a GO final; verificó teléfono US/internacional, direcciones en 2–3 campos, controles editoriales y autoridad del perfil persisted. Batería integrada final: 72/72 tests, TypeScript PASS, DB PASS con 2 migraciones/95 statements/18 tablas/20 FKs, image/topic guards PASS, build 89/89 y diff-check PASS.

## 2026-07-31 Codex — SSN partidos entre campos administrativos
**Qué se hizo:** El Code Review exacto de `bf09b98` abrió un P1 válido: un SSN podía repartirse entre campos sin etiqueta y escapar mientras el prompt externo conservaba las partes. La reconstrucción acotada ahora valida formato 3-2-4, signos y todos los cortes continuos de nueve dígitos en dos o tres campos. Un contexto fuerte SSN permite prosa final; la excepción de años se calcula sobre los cuatro primeros dígitos acumulados.
**Decisiones:** No se vuelve al `join` global. Un número continuo sin etiqueta requiere prosa previa y fragmentos posteriores puramente numéricos; los años 1900–2099 y los controles con texto posterior permanecen permitidos. Una etiqueta SSN inequívoca prioriza privacidad.
**Pendientes/bugs:** Publicar SHA, responder/resolver el thread y exigir de nuevo Quality, Preview y Code Review exacto.
**Archivos tocados:** `server/blog/privacy.ts`, `tests/blog-privacy.test.mjs`, evidencia, decisiones y bitácora.
**Evidencia:** `3693800947` / `PRRT_kwDOToJ8Pc6VjZ_g`, válido. Juez independiente GO final: los 8 cortes posibles en dos campos y los 28 en tres quedan bloqueados; años partidos, prosa final con contexto fuerte, variante inversa y controles genéricos verificados. Batería integrada final: 72/72 tests, TypeScript PASS, DB PASS con 2 migraciones/95 statements/18 tablas/20 FKs, image/topic guards PASS, build 89/89 y diff-check PASS.

## 2026-07-31 Codex - hardening integral de analytics y consentimiento
**Qué se hizo:** El PR de analytics quedó sincronizado con `main` y se corrigieron la variable pública heredada de Vite, el orden de Google Consent Mode/config/eventos, la limpieza de cookies host/root, los listeners duplicados de Clarity/TikTok, el banner bloqueado por el widget y la cobertura completa de leads de cita, teléfono, email y WhatsApp. Se registraron todos los IDs públicos verificados y se añadió un guard de build Vercel.
**Decisiones:** Un clic de CharmHealth es `generate_lead`, no una cita confirmada. Los eventos de salida se encolan detrás de `gtag('config')` sin depender de una cola en memoria. TikTok se revoca por API y solo se prometen borrar sus cookies first-party. Production recibe el ID después de validar Preview.
**Pendientes/bugs:** Crear commit y push, esperar Preview READY, ejecutar el ciclo real de consentimiento, clasificar Code Review exacto, obtener GO del juez y después añadir el ID a Production antes del merge.
**Archivos tocados:** analytics/cookie cleanup, hooks Clarity/TikTok, App/env, banner/política/dialog, CTAs globales y de ubicaciones, guards, prueba Chromium, registro de tags y evidencia.
**Evidencia:** TypeScript PASS, analytics guard PASS, Chromium 2/2 PASS, suite 74/74 PASS, build Next 89/89 con `G-WMRK41PX2E`, diff-check PASS.

## 2026-07-31 Codex - corrección del paquete de build Vercel
**Qué se hizo:** El primer Preview de `802efab` falló antes de compilar porque `.vercelignore` omitía toda la carpeta `scripts/`. Se mantuvo la exclusión del tooling, pero se incluyó expresamente el único guard que `npm run build` necesita.
**Decisiones:** El guard permanece como script versionado y ejecutable tanto localmente como en Vercel; no se duplica su lógica dentro de `package.json`.
**Pendientes/bugs:** Publicar el ajuste y validar que el siguiente deployment exacto alcance READY y reciba `G-WMRK41PX2E`.
**Archivos tocados:** `.vercelignore`, evidencia y bitácora.
**Evidencia:** deployment `healing-minds-psychiatry-nextjs-41gzjru5q.vercel.app`, log `MODULE_NOT_FOUND /vercel/path0/scripts/verify-public-analytics-config.mjs`; `vercel env ls` confirma `NEXT_PUBLIC_GA_MEASUREMENT_ID` en Preview.

## 2026-07-31 Codex - lifecycle Next y dedupe por clic real
**Qué se hizo:** El juez independiente detectó que el guard observaba el `App` legacy y no el `app/public-shell.tsx` que Vercel ejecuta, por lo que Clarity/TikTok no recibían cambios de consentimiento. También demostró que ubicaciones distintas entre handler explícito y delegado duplicaban el mismo lead. Se activó el lifecycle en el shell Next, se cambió la ventana de dedupe a tipo de conversión y el test Chromium dispara ahora un clic DOM real con labels distintos.
**Decisiones:** Cada runtime conserva un único lifecycle owner. La ventana de 500 ms deduplica solo el mismo tipo de lead; teléfono y reserva distintos siguen siendo eventos independientes.
**Pendientes/bugs:** Repetir batería, publicar SHA, Preview real, Code Review exacto y veredicto final del juez.
**Archivos tocados:** `app/public-shell.tsx`, analytics, guard, Chromium test, evidencia y bitácora.
**Evidencia:** juez NO-GO provisional con dos P1 válidos sobre `a5c0c88`; correcciones locales pendientes de verificación.

## 2026-07-31 Codex - acceso persistente a preferencias de cookies
**Qué se hizo:** La auditoría complementaria comprobó que el texto prometía cambiar preferencias en cualquier momento, pero el banner desaparecía sin dejar un acceso visible. El footer público incluye ahora `Cookie Preferences / Preferencias de Cookies` y vuelve a mostrar el gestor con el consentimiento actual.
**Decisiones:** La retirada de consentimiento no depende de borrar localStorage ni de herramientas de desarrollador; queda disponible como control de usuario en todas las páginas con footer.
**Pendientes/bugs:** Incluir el flujo aceptar, retirar y reaceptar en la verificación del Preview exacto.
**Archivos tocados:** footer, guard, evidencia y bitácora.
**Evidencia:** revisión del estado `hasConsented && !showBanner` y ausencia previa de consumidores de `showPreferences`.

## 2026-07-31 Codex - rechazo persistido y dimensiones GA
**Qué se hizo:** La pasada final del juez detectó dos P2 válidos: cookies heredadas sobrevivían si la página arrancaba ya en estado rechazado, y `trackServicePageView` había dejado de enviar las dimensiones que su `custom_map` declaraba. La inicialización denegada limpia ahora GA/Ads/Clarity/TikTok sin exigir un nuevo evento, y los eventos de servicio vuelven a incluir servicio e idioma.
**Decisiones:** Un consentimiento persistido denegado se ejecuta activamente en cada carga; no se limita a impedir scripts futuros. El mapping GA se conserva porque sus dimensiones vuelven a tener emisor y utilidad.
**Pendientes/bugs:** Añadir prueba browser del estado rechazado heredado, repetir batería y devolver al juez.
**Archivos tocados:** analytics, hooks Clarity/TikTok, guard, evidencia y bitácora.
**Evidencia:** juez P2 sobre caminos iniciales sin cleanup y P2 sobre `custom_1/custom_2`, ambos clasificados válidos.

## 2026-07-31 Codex - cookies TikTok oficiales, H1 visible y stacking aislado
**Qué se hizo:** El E2E del juez encontró `ttcsid` y `ttcsid_<pixel>` persistiendo tras revocar; la referencia oficial añade también `ttclid`. Se amplió limpieza y fixtures. CodeX abrió además un P2 válido porque el H1 desktop quedaba oculto en móvil y un P1 válido porque elevar todos los Dialog rompía portales Select. El Hero mantiene un solo H1 dinámico visible y el z-index alto queda aislado al modal de cookies.
**Decisiones:** La lista TikTok sigue la taxonomía oficial más los nombres legacy observados. El componente Dialog compartido conserva z50; expone solo una clase opcional de overlay para casos sin child portals. El título semántico se intercambia en runtime sin duplicar H1.
**Pendientes/bugs:** Obtener GO del juez; publicar y validar Preview exacto; repetir el Code Review sobre el SHA publicado.
**Archivos tocados:** TikTok hook/tests, Hero/test, Dialog/CookieBanner/guard, auditor Preview, evidencia y bitácora.
**Evidencia:** E2E juez inicial: `ttcsid` y `ttcsid_D3IKI7BC77UEJB9HBO0G` persistentes; CodeX threads `3693973816`, `3693973820`, `3693973822` y `3693973825`, todos clasificados válidos. Tras corregirlos: focused Chromium 3/3 PASS, suite integrada 75/75 PASS, TypeScript PASS, build Next 89/89 con `G-WMRK41PX2E` y diff-check PASS.

## 2026-07-31 Codex - limpieza TikTok durante asentamiento post-revocación
**Qué se hizo:** El juez reprodujo que el SDK ya cargado recreaba `ttcsid` y `ttcsid_<pixel>` segundos después de la limpieza síncrona. La revocación mantiene ahora un barrido acotado de seis segundos y la auditoría real espera a que termine antes de comprobar cookies.
**Decisiones:** El barrido se detiene inmediatamente si vuelve el consentimiento de marketing; nunca borra cookies tras una reaceptación. No se deja un monitor permanente.
**Pendientes/bugs:** Publicar el SHA, validar Preview exacto y repetir Code Review sobre ese commit.
**Archivos tocados:** hook TikTok, guard de analytics, auditor Preview y bitácora.
**Evidencia:** juez inicial NO-GO porque `ttcsid*` reaparecía a los cinco segundos. Juez final GO: build 89/89; revocación + 6,5 s dejó 0 cookies first-party, incluidas `ttcsid`, `ttcsid_<pixel>` y `ttclid`; revocación + reaceptación a 500 ms conservó las cookies consentidas tras 6,5 s; consola 0 errores/0 warnings. Suite integrada 75/75, TypeScript, guard, focused Chromium 5/5 y diff-check PASS.

## 2026-08-01 Codex - dominio real de cookies en Vercel Preview
**Qué se hizo:** El Preview exacto de `4f13daf` cambió correctamente el consentimiento a denegado, pero reveló cookies con `Domain=.<hostname-preview>` que la limpieza host-only/canónica no podía expirar. La utilidad incluye ahora el hostname actual exacto y dotted; el auditor monta el footer lazy mediante un scroll sweep y comprueba evento, dominio y path reales.
**Decisiones:** No se hardcodea ni se asciende a `vercel.app`. Solo se toca el hostname donde corre la página; en subdominios de Healing Minds se añade además el root canónico existente.
**Pendientes/bugs:** Publicar follow-up, esperar su Preview exacto READY, repetir el ciclo real y exigir Code Review sobre el nuevo SHA.
**Archivos tocados:** cookie cleanup, test Chromium de Preview, guard, auditor Preview, evidencia y bitácora.
**Evidencia:** `dpl_5xsWsAKDvZuT4Tw3MwS7mSJVQWUm` READY; fallo real mostró `_ga`, `_gcl_au`, `_ttp` y `ttcsid*` domain-scoped tras 6,5 s. Corrección local: juez GO, Chromium 4/4, suite 76/76, TypeScript, guard, build 89/89 y diff-check PASS.

## 2026-08-01 Codex - integración de main en PR #5
**Qué se hizo:** Se integró `main` ya con los PR #6, #7 y #8 en el hardening del blog. El conflicto del topic planner conserva el perfil semántico y la privacidad actuales, pero sustituye el límite de 200 posts por la paginación completa de inventario de #5. La bitácora se concilió por concatenación cronológica.
**Decisiones:** PR #5 se cierra antes que #4 porque es hardening independiente y reduce el riesgo del feature grande. No se apila #4 dentro de #5. Los checks anteriores al merge de `main` se consideran obsoletos.
**Pendientes/bugs:** Publicar el SHA integrado, exigir Preview READY, Code Review exacto y GO del juez antes de fusionar por squash sin borrar la rama.
**Archivos tocados:** merge de `origin/main`, `server/blog/ai/topic-planner.ts` y bitácora.
**Evidencia:** juez de secuencia GO para #5 primero. Árbol integrado: suite 76/76, TypeScript PASS, DB 2 migraciones/95 statements/18 tablas/20 FKs, image/topic guards PASS, build 89/89 y diff-check PASS.

## 2026-08-01 Codex - cierre de concurrencia, Blob, cuota e inventario del PR #5
**Qué se hizo:** Se corrigieron las cuatro notas P2 del Code Review exacto de `3ad4a81`: orden total del inventario, cola duradera de limpieza Blob, cuota de imagen aplicada a Auto Generate y payloads del proveedor limitados. También quedaron cerrados los hallazgos del juez sobre carreras same-key/different-key y heartbeat Express.
**Decisiones:** Los checks de duplicidad, saturación y gaps de etapa siguen usando el inventario o los conteos completos; solo la frontera del proveedor queda limitada a agregados completos y 40 perfiles seguros priorizados. El borrado del post registra las claves dentro de la misma transacción antes del cascade; los objetos se limpian después del commit y el backlog se reintenta en ejecuciones posteriores. La cuota cuenta llamadas potencialmente pagadas, no solo clics de endpoint.
**Pendientes/bugs:** Publicar un nuevo SHA, responder y resolver los cuatro threads, y repetir Quality, Vercel READY y CodeX exacto antes del merge.
**Archivos tocados:** inventario/payload del planner y judge, rutas Next/Express, storage de runs, rate limit e imágenes, esquema/migración, guards/tests, evidencia, decisiones y bitácora.
**Evidencia:** threads `3694143680`, `3694143684`, `3694143685` y `3694143688`, todos válidos. Juez independiente GO 4/4, incluido el guard de `missingStages` fuera de la muestra. Local: 81/81 tests, TypeScript PASS, DB 3 migraciones/98 statements/19 tablas/20 FKs, image/topic/link/analytics guards PASS, SEO render audit 8/8, build 89/89 y diff-check PASS.

## 2026-08-01 Codex - integración de main y migración durable para PR #4
**Qué se hizo:** Se integró `main` después de cerrar #5 y #8 en la rama editorial de #4. Los conflictos se resolvieron conservando a la vez la privacidad y los límites de proveedor de `main`, el segundo pase editorial seguro, el preview compartido y la materialización única de imágenes. También se aplicó en Neon la migración aditiva `0002_durable_blog_image_cleanup.sql` y se verificaron su tabla e índices sin tocar contenido.
**Decisiones:** El contexto humano sin filtrar no entra ni en el prompt inicial ni en la expansión. La expansión reutiliza allowlists, conserva todos los enlaces validados y no puede cambiar metadatos del primer borrador. Los historiales del arnés se conservaron por concatenación cronológica.
**Pendientes/bugs:** Crear y publicar el merge commit; exigir Quality, Preview READY y Code Review sobre el SHA exacto; ejecutar el checklist real del preview sin publicar contenido y limpiar sus artefactos de prueba antes del merge.
**Archivos tocados:** integración completa de `origin/main`, resoluciones en generador, rutas admin, guard de imágenes, pruebas de profundidad, decisiones y bitácora.
**Evidencia:** juez independiente GO para crear el merge commit. Árbol integrado: suite 84/84, TypeScript PASS, DB 3 migraciones/98 statements/19 tablas/20 FKs, guards de profundidad/imagen/topics/enlaces/analytics PASS, build 89/89 y diff-check PASS. Neon: tabla `blog_image_cleanup_queue` e índices `idx_blog_image_cleanup_queue_object_key` y `idx_blog_image_cleanup_queue_updated_at` presentes.

## 2026-08-01 Codex - smoke real de profundidad, imágenes y preview del PR #4
**Qué se hizo:** Se resincronizaron únicamente las tres variables cifradas de acceso de Preview con sus propios valores actuales después de que el primer artefacto respondiera 401; Production no cambió. Se generó un solo borrador temporal de 959 palabras, se confirmó Draft/404/ausencia de sitemap/disclaimer, se revisaron tres imágenes adultas antes de seleccionarlas y el ojo renderizó un hero y dos figuras inline exactamente una vez con consola limpia.
**Decisiones:** El lote manual mantiene por ahora ejecución síncrona, pero la ruta Next recibe 600 segundos para cubrir tres llamadas válidas de 150 segundos más almacenamiento. El backlog estructural es un job durable con polling. Las advertencias del primer proveedor sobreviven a la expansión salvo las cuatro plantillas internas exactas que se recalculan; superar el máximo descarta la expansión.
**Pendientes/bugs:** Publicar un build nuevo con el límite de 600 segundos y las dos correcciones CodeX; regenerar un set real para verificar respuesta 201 sin retry; repetir preview, borrar el post temporal y sus Blobs, comprobar cola vacía, y exigir Quality/Vercel/CodeX exactos antes del merge.
**Archivos tocados:** route admin Next, generador y guards de profundidad/imágenes, evidencia, decisiones y bitácora.
**Evidencia:** `dpl_CWhscdvCCigDvumAN2Rw27dkSoh8` READY. Runtime: POST de imágenes perdió respuesta a 60 s y el retry recibió 429 aunque las tres filas quedaron completed. Preview: 959/800 PASS, 404 público, sitemap false, 3 imágenes/2 figuras, Draft y 0 errores. CodeX `3694247628` y `3694247629`, ambos válidos y resueltos localmente. Juez independiente pasó de NO-GO a GO tras exigir 600 s, guard anclado y regex de plantillas completas. Local final: 84/84, TypeScript, DB 3/98/19/20, image/depth/topic/link guards, build 89/89 y diff-check PASS.

## 2026-08-01 Codex - jobs durables para la generación manual de imágenes
**Qué se hizo:** El build exacto con `maxDuration=600` confirmó que la función seguía trabajando, pero la conexión protegida del navegador cortaba el POST a los 60 segundos y provocaba un retry 429. Generar set y regenerar variante pasan ahora por `blog_image_generation_jobs`: el POST persiste slots, responde 202 y el cliente consulta progreso. Cada request usa `Idempotency-Key`, solo existe un job abierto por post y cada slot queda identificado por `image_job_id + slot`.
**Decisiones:** Un job nace en `admitting`, estado no ejecutable. Solo el request que creó la fila consume rate-limit y, tras aprobarlo, realiza la transición atómica a `queued`; polling y workers solo reclaman `queued`. Un worker interrumpido no vuelve a cobrar automáticamente el slot que estaba `generating`: lo marca failed y reanuda únicamente slots `pending`. Publicar o borrar queda bloqueado mientras existan slots pending/generating.
**Pendientes/bugs:** Aplicar `0003` de forma aditiva en Neon, publicar el SHA, exigir Quality/Vercel/CodeX exactos y ejecutar el smoke real: 202 rápido, replay same-key, polling terminal, tres filas sin duplicados, preview compartido y limpieza completa del post/Blobs de prueba.
**Archivos tocados:** esquema y migración 0003 con journal/snapshots Drizzle, storage/service/routes de jobs, rutas Next/Express, UI con polling, guards de lifecycle, pruebas conductuales PGlite y evidencia.
**Evidencia:** Drizzle real lee y aplica 4/4 migraciones; PGlite verifica admission no reclamable, replay same-key, conflicto different-key, un solo worker, slot único y recuperación stale solo-pending. Suite 85/85, TypeScript, image/depth guards, build 89/89 y drift de schema `No schema changes` PASS. Neon compartido: 12 statements de `0003` aplicados en transacción; tabla, columna, cinco índices y seis estados verificados; 0 jobs y 0 slots enlazados después de migrar.

## 2026-08-01 Codex - smoke durable completo y limpieza del PR #4
**Qué se hizo:** El Preview exacto de `5192da0` respondió 202 en 791 ms, devolvió el mismo job al repetir la misma clave, rechazó con 409 otra clave concurrente y completó tres slots únicos en 120,646 s. Las tres imágenes se revisaron antes de seleccionar; el renderer compartido mostró 1 hero, 2 figuras inline, Draft visible y consola limpia en escritorio y móvil. Después se eliminaron el post 8, sus filas, el job y los tres Blobs.
**Decisiones:** La ausencia real de un Blob se valida contra el proveedor y la base, no contra una respuesta inmutable ya cacheada. El mensaje exacto de ausencia que devuelve `@vercel/blob` se normaliza a 404; otros errores siguen siendo 503.
**Pendientes/bugs:** Publicar el fix de normalización y verificar en un nuevo Preview que las rutas de los tres objetos eliminados respondan 404. Repetir Quality, Vercel, CodeX exacto y juez antes del merge.
**Archivos tocados:** adapter de Vercel Blob, guard de storage, evidencia y bitácora.
**Evidencia:** deployment `dpl_9Jo1ovZrqAutikAhMNpt9YK9qZLP` READY ligado a `5192da0`; job 1 completed, imágenes 13/14/15, 959/800 palabras, 404 público, sitemap false, 3/2 imágenes, Draft y 0 errores. Limpieza: posts=0, images=0, jobs=0, queue=0; target Blobs=0. CodeX exacto sin problemas importantes; Quality y Vercel PASS. Fix local: conducta 3/3, suite 86/86, TypeScript, 4 migraciones Drizzle, image/depth/link guards, build 89/89 y diff-check PASS; juez independiente GO.

## 2026-08-01 Codex - verificación final 404 de la limpieza Blob
**Qué se hizo:** El commit correctivo `1c9c2f9` se desplegó en un artefacto nuevo y las tres rutas cache-busted de los objetos eliminados respondieron 404. La consulta directa al proveedor siguió sin encontrar ninguno de los tres Blobs y Neon mantuvo posts=0, images=0, jobs=0 y cleanup queue=0.
**Decisiones:** El fix queda cerrado con evidencia del adapter local, del proveedor real, de la base compartida y del Route Handler desplegado. No se repite una generación pagada porque el código de jobs no cambió en este follow-up.
**Pendientes/bugs:** Registrar este resultado, eliminar scripts y credenciales temporales, y exigir Quality, Vercel, CodeX exacto y GO final antes del merge.
**Archivos tocados:** evidencia y bitácora únicamente.
**Evidencia:** `dpl_HngDwq2NBfjyC7XrLP9zNdA6CjVP` READY; proxy 404/404/404, targets Blob=0, posts=0, images=0, jobs=0, queue=0.

## 2026-08-01 Codex - noindex explícito para el área privada
**Qué se hizo:** La auditoría integrada de Producción detectó que `/admin/login` estaba excluido de `robots.txt`, pero su HTML no declaraba `noindex`. El layout completo de `/admin/*` publica ahora `noindex, nofollow, nocache` sin alterar la autenticación ni el shell público.
**Decisiones:** Se aplica la directiva en el layout padre para cubrir login, editor y futuras rutas administrativas. El juez detectó que bloquear `/admin/` en `robots.txt` impedía a Google leer `noindex`; se retiró ese bloqueo, se mantuvo `/api/admin/` como `Disallow` y la autenticación continúa siendo la barrera de seguridad real.
**Pendientes/bugs:** Publicar el PR pequeño, exigir Quality, Vercel READY, Code Review sobre el SHA exacto y juez final; después repetir la auditoría integrada de Producción.
**Archivos tocados:** layout admin, robots, smoke de build, workflow Quality, contratos de prueba y bitácora.
**Evidencia:** antes del cambio, Producción no tenía header ni meta robots en `/admin/login`; después del cambio, el build local renderiza `<meta name="robots" content="noindex, nofollow, nocache"/>` para login y editor, permite rastrear `/admin/`, bloquea `/api/admin/` y mantiene admin fuera del sitemap. Suite 88/88, TypeScript, DB 4/110/20/23, build 89/89, smoke de Producción local y diff-check PASS.

## 2026-08-01 Codex - jerarquía H1 tras montar el contacto lazy
**Qué se hizo:** La auditoría asentada de Producción reveló que la home tenía dos H1 visibles después de montar el contacto lazy: el hero y “Get in touch”. El componente Contact conserva H1 cuando es la página principal de contacto, pero acepta H2 cuando se inserta como sección dentro de las homes EN/ES.
**Decisiones:** El nivel del encabezado se decide explícitamente desde el contexto que usa el componente; el valor por defecto sigue siendo H1 para no degradar las páginas `/contact` y `/es/contacto`. Quality monta el contacto lazy en un navegador real y comprueba las cuatro rutas después del build. La nota CodeX `3694578267` se clasificó válida: cada ancho de home abre ahora una página nueva, por lo que móvil no hereda el montaje lazy de escritorio.
**Pendientes/bugs:** Exigir juez, Quality, Vercel READY y CodeX sobre el SHA exacto; repetir la auditoría integrada asentada sobre la nueva Producción.
**Archivos tocados:** componente Contact, homes EN/ES, smoke de jerarquía, workflow Quality, contratos de prueba y bitácora.
**Evidencia:** antes del cambio, home asentada: `hero-title` H1 + `contact-title` H1. Después: homes EN/ES tienen un único H1 `hero-title` y `contact-title` H2; páginas Contact EN/ES conservan un único H1 `contact-title`. El smoke corregido recrea navegación y montaje lazy desde cero para EN/ES a 1440 y 390 px. Suite 90/90, TypeScript, DB 4/110/20/23, build 89/89, smokes admin y headings, diff-check PASS.

## 2026-08-01 Codex - salida segura del loading del mapa
**Qué se hizo:** La pasada visual asentada del Preview mostró que el mapa podía permanecer más de 30 segundos cubierto por “Cargando mapa…”, aunque el iframe de Google ya existía. GoogleMapsEmbed conserva el cierre normal por `onLoad`, pero ahora retira el overlay después de ocho segundos como límite de seguridad y reinicia ese reloj si cambian `src` o la política de loading.
**Decisiones:** El fallback solo controla la capa visual; no cancela ni sustituye el iframe, por lo que un mapa lento puede terminar de cargar y hacerse visible. El timer se limpia al desmontar para no dejar actualizaciones tardías. Quality reproduce navegación home EN → ES, montaje lazy y desaparición del overlay en el build real.
**Pendientes/bugs:** Exigir juez, Quality, Vercel READY, CodeX exacto y comprobación visual del Preview antes de mergear; después repetir la auditoría integrada de Producción.
**Archivos tocados:** GoogleMapsEmbed, contrato de prueba, smoke de producción y bitácora.
**Evidencia:** Preview anterior: `/es` mantuvo `Cargando mapa...` visible más de 30 s y emitió el diagnóstico CORS externo `mapsjs/gen_204?csp_test=true`. Corrección local: suite 91/91, TypeScript, DB 4/110/20/23, build 89/89, admin smoke y heading/map smoke PASS. El smoke mantiene pendiente deliberadamente la petición del iframe, confirma que el overlay aparece, verifica que el fallback lo retira antes de liberar la petición y que el iframe permanece visible.

## 2026-08-01 Codex - navegación App Router y gate E2E real
**Qué se hizo:** Se reprodujo que un solo clic cambiaba URL y título, pero dejaba el contenido anterior y disparaba `removeChild` en React. El layout marca ahora a Next como dueño único de los metadatos y el helper SEO legado no toca el `<head>` en ese runtime. Se añadió Playwright Test con recorridos EN/ES en desktop y móvil, incluyendo ida, atrás y adelante, valores SEO exactos y cero errores de página/consola; Quality ejecuta el E2E después del build. El gate desplegado exige URL HTTPS y SHA completo, compara ese SHA con el metadato real del build de Vercel y limita la autenticación de Preview al origen exacto para no filtrar credenciales a terceros.
**Decisiones:** No se sustituye la navegación SPA por recargas completas ni se rompe el fallback Vite: el no-op se activa mediante un marcador explícito de Next. Los tests unitarios no sustituyen este gate y la regla queda documentada en el AGENTS del repo. Un E2E desplegado no puede caer silenciosamente a localhost, el servidor local no se reutiliza salvo opt-in explícito y los recorridos corren con un worker para evitar falsos fallos por cuatro contextos fríos compitiendo con el prefetch masivo.
**Pendientes/bugs:** Publicar el PR, exigir Preview READY, repetir E2E sobre su URL exacta, clasificar todos los Code Review del SHA final y obtener juez GO antes del merge.
**Archivos tocados:** layout Next, helper SEO legado, configuración y spec E2E, scripts npm, Quality, smoke del mapa, AGENTS, gitignore, dependencias y bitácora.
**Evidencia:** E2E rojo previo: `/about` recibía URL/título correctos, no montaba `about-hero-title` y React emitía `removeChild`. Tras el fix: 4/4 E2E PASS en Home→About EN/ES, desktop/móvil, back/forward, H1 único, description/canonical/OG/Twitter/lang exactos y cero errores. El metadato de build local se verificó como `local`; cuatro contratos verifican el fail-closed de URL/SHA y otro impide auth global. Un juez reprodujo saturación al lanzar cuatro workers fríos; con el gate serial, dos ejecuciones independientes pasaron 4/4 en 22,4 s y 19,3 s. Build 89/89, TypeScript PASS, suite 97/97 PASS, DB 4/110/20/23 PASS, admin smoke PASS y heading/map smoke PASS dos veces consecutivas después del hardening. El primer intento aislado no interceptó el iframe lazy porque el test dejaba el mapa fuera del viewport; el smoke ahora desplaza explícitamente el mapa antes de exigir la petición, sin ampliar timeouts ni ocultar el contrato.

## 2026-08-01 Codex - estabilización del contrato SEO E2E en CI
**Qué se hizo:** La Preview READY del SHA `28ac1ee` pasó 4/4 recorridos desplegados con autenticación OIDC limitada al origen. GitHub Actions pasó TypeScript, 97 tests, DB y build, pero el runner móvil mantuvo transitoriamente dos `meta[name="description"]` durante la reconciliación del App Router y agotó el timeout por defecto de cinco segundos. El timeout de las aserciones web sube a quince segundos para esperar el estado final sin aceptar duplicados.
**Decisiones:** La comprobación sigue exigiendo exactamente una description, canonical, Open Graph y Twitter con valores exactos; no se elimina ni relaja ninguna aserción. El margen solo permite que un runner con recursos limitados termine la transición de metadatos.
**Pendientes/bugs:** Repetir Quality sobre el nuevo SHA, volver a verificar su Preview exacta y ejecutar Code Review actualizado antes del merge.
**Archivos tocados:** configuración Playwright y bitácora.
**Evidencia:** Preview exacta `dpl_FEutJ3MA7r85Q1WPAZUj7k4yq4hy`: 4/4 PASS. Reproducción local intensiva móvil con `CI=true`: 10/10 PASS. Fallo de Actions `30701538271`: solo 2 pruebas móviles, `description` recibió 2 nodos; todos los gates previos pasaron.

## 2026-08-01 Codex - corrección del diagnóstico de metadatos y segunda ronda Code Review
**Qué se hizo:** Una segunda ejecución de GitHub Actions demostró que ampliar el timeout no resolvía el caso móvil: el App Router puede transmitir los metadatos de la ruta destino al cuerpo durante una navegación cliente mientras todavía existen etiquetas de la ruta anterior. El E2E vuelve al timeout normal y exige exactamente una señal con el valor de la ruta destino para description, canonical, Open Graph y Twitter, además del título, H1, idioma, URL, navegación atrás/adelante y ausencia de errores. Se añadieron metadatos dedicados para las rutas de California, manteniendo su política `noindex, follow`, y cobertura E2E para ambas. Las credenciales de Preview solo pueden aplicarse a hosts `*.vercel.app`; nunca a un dominio personalizado aunque redirija.
**Decisiones:** Se corrige la entrada anterior sin reescribir el historial: el fallo no era una convergencia lenta que debiera esperarse quince segundos, sino una aserción global incompatible con el streaming documentado de metadatos de Next. La unicidad y exactitud del HTML servido siguen cubiertas por el manifiesto SEO y sus contratos; el recorrido cliente comprueba la señal exacta de la ruta ya navegada. Quality conserva los artefactos de Playwright durante siete días si vuelve a fallar.
**Pendientes/bugs:** Ejecutar la batería local completa, publicar el SHA nuevo, exigir Quality y CodeX sobre ese SHA, verificar la Preview inmutable con su SHA exacto y resolver únicamente entonces los tres hilos válidos de Code Review antes del merge.
**Archivos tocados:** manifiesto SEO, recorrido E2E, contratos del gate desplegado y de CI, workflow Quality, configuración Playwright y bitácora.
**Evidencia:** Actions `30702166052` volvió a fallar tras quince segundos solo en móvil ES, descartando el diagnóstico de simple lentitud. CodeX `3695730763` señaló correctamente las dos rutas de California ausentes del manifiesto; `3695730766` señaló correctamente el riesgo de seguir un redirect con credenciales de Preview. La nueva cobertura exige metadatos California exactos, `noindex, follow`, H1 único, idioma correcto y SHA desplegado.

## 2026-08-01 Codex - árbol SEO único tras navegación cliente
**Qué se hizo:** Dos jueces independientes rechazaron correctamente el primer ajuste del E2E porque encontrar la etiqueta destino no bastaba si la etiqueta anterior sobrevivía. La reproducción sobre la Preview inmutable confirmó que una carga directa tenía un árbol SEO único, pero algunas navegaciones cliente dejaban de forma persistente dos descriptions, canonicals y títulos sociales distintos en `HEAD`. Se activó la opción oficial de Next `htmlLimitedBots: /.*/` para resolver los metadatos antes de enviar la ruta, y el E2E vuelve a exigir un único description, canonical, Open Graph title y Twitter title con los valores exactos del destino.
**Decisiones:** No se oculta ni se tolera la duplicidad. El gate cubre ahora Home a About, historial atrás/adelante y el caso exacto catch-all a catch-all About a Contact, en inglés y español, escritorio y móvil. Desactivar el streaming puede aumentar el tiempo hasta el primer byte en una ruta cuyo metadata dependa de datos externos; aquí las páginas públicas usan el manifiesto local, y el impacto se medirá de nuevo con Lighthouse después del despliegue.
**Pendientes/bugs:** Publicar un nuevo SHA y exigir que Quality Linux, la Preview inmutable y CodeX pasen sobre ese mismo SHA antes de resolver los hilos o fusionar.
**Archivos tocados:** configuración Next, E2E estricto, contratos SEO y bitácora.
**Evidencia:** la Preview `0b33d70` mostró, por ejemplo, dos descriptions persistentes tras `/` a `/about`, mientras un hard reload de `/about` devolvió una sola. Con metadata bloqueante, build 89/89 PASS, E2E estricto 8/8 PASS y repetición de estabilidad 24/24 PASS; ningún recorrido aceptó una etiqueta de la ruta anterior.

## 2026-08-01 Codex - autenticación de Preview sin propagación por redirects
**Qué se hizo:** Un juez detectó que `route.continue({ headers })` limita el interceptor al origen de Vercel, pero Playwright propaga esos headers a los redirects iniciados por la petición. La autenticación de Preview usa ahora `route.fetch` con `maxRedirects: 0` y entrega la respuesta al navegador mediante `route.fulfill`; si existe un 30x, el navegador lo sigue como una petición nueva sin el token. El contrato prohíbe `route.continue`, exige fetch sin redirects y conserva la detección de credenciales en terceros.
**Decisiones:** El test falla cerrado fuera de `*.vercel.app` y nunca añade credenciales a dominios personalizados. Se conservan todos los headers originales mediante `request.allHeaders()` antes de añadir únicamente el token de Preview.
**Pendientes/bugs:** Confirmar el mecanismo sobre la Preview del nuevo SHA junto con el E2E completo; no considerar suficiente la comprobación estática local.
**Archivos tocados:** gate E2E desplegado, contrato de seguridad y bitácora.
**Evidencia:** TypeScript PASS y 14/14 contratos focalizados PASS. El handler nuevo atravesó la protección real de la Preview `0b33d70` y recibió la aplicación; las cuatro aserciones California fallaron después, como era esperable, porque ese SHA anterior todavía no contiene sus nuevos metadatos, no por autenticación.

## 2026-08-01 Codex - cierre limpio del interceptor de Preview
**Qué se hizo:** El E2E exacto de la Preview `16a544f` confirmó la aplicación y pasó cinco de ocho recorridos; los otros tres completaron sus aserciones pero fallaron durante el teardown porque `response.dispose()` corría cuando Playwright ya había cerrado página o contexto. Se retiró esa liberación manual: la respuesta pertenece al contexto y su ciclo de vida termina con él después de `route.fulfill`.
**Decisiones:** No se atrapa ni se ignora el error. Se elimina la operación redundante que originaba la carrera y se mantiene intacta la contención de credenciales mediante `route.fetch({ maxRedirects: 0 })`.
**Pendientes/bugs:** Publicar otro SHA y repetir Quality, Preview exacta, E2E desplegado y Code Review; el SHA `16a544f` no es candidato a merge.
**Archivos tocados:** interceptor E2E y bitácora.
**Evidencia:** en la Preview `dpl_S8mP836b7W3XcwtNAMphrEogwJZC`, navegación EN/ES desktop/móvil y las páginas California alcanzaron la aplicación y sus aserciones; los tres fallos mostraron únicamente `apiResponse.dispose: Target page, context or browser has been closed` durante el cierre.

## 2026-08-01 Codex - drenaje de peticiones autenticadas antes del teardown
**Qué se hizo:** El siguiente Preview pasó los ocho recorridos y todas sus aserciones, pero Playwright informó fuera de los tests que una imagen aún estaba dentro de `route.fetch` cuando terminó el worker. El E2E ejecuta ahora `page.unrouteAll({ behavior: "wait" })` después de cada test: retira el interceptor y espera las callbacks ya activas antes de que se cierre el BrowserContext. Los errores de `route.fetch` se reemplazan por un mensaje saneado que solo contiene el pathname y nunca serializa headers.
**Decisiones:** Se mantiene la espera explícita en vez de ignorar errores de teardown. La seguridad de redirects no cambia: `maxRedirects: 0`, origen exacto y `route.fulfill` continúan siendo obligatorios.
**Pendientes/bugs:** Publicar otro SHA y repetir todos los gates exactos; `217f7fb` tampoco es candidato a merge pese a que sus 8/8 aserciones funcionales pasaron.
**Archivos tocados:** interceptor E2E, contrato de seguridad y bitácora.
**Evidencia:** Quality Linux de `217f7fb` PASS completo. Preview `dpl_GUTZ94oSBP6uEdsxgSbPRMKEz6PY`: 8/8 tests y aserciones PASS, seguido de un único error fuera de test por un WebP aún en `route.fetch`; el nuevo afterEach espera precisamente esas callbacks.

## 2026-08-01 Codex - cancelación acotada de assets al cerrar cada test
**Qué se hizo:** La prueba del drenaje con `behavior: "wait"` mostró que retirar el handler podía resolver una ruta mientras una callback regresaba de `route.fetch`, produciendo `Route is already handled`. Playwright recomienda `behavior: "ignoreErrors"` para el teardown de handlers aún activos. Se adopta esa semántica únicamente en `afterEach`; durante el test, cada fetch y fulfill sigue siendo awaited y cualquier fallo funcional continúa fallando el test.
**Decisiones:** No se deja el handler vivo ni se suprimen errores de aplicación. Solo se ignoran callbacks canceladas por el cierre de la propia página después de completar las aserciones. El catch saneado evita además serializar headers si un fetch falla antes del teardown.
**Pendientes/bugs:** Repetir el E2E exacto sobre la misma Preview para validar el arnés antes de otro commit; después volver a ejecutar todos los gates sobre el SHA publicado.
**Archivos tocados:** teardown E2E, contrato y bitácora.
**Evidencia:** la pasada anterior alcanzó 8/8 aserciones funcionales; el cambio responde exactamente a los dos errores exclusivos de cierre recomendados por Playwright: callback después de BrowserContext cerrado y ruta ya manejada durante `unrouteAll(wait)`.

## 2026-08-01 Codex - validación del teardown acotado
**Qué se hizo:** El E2E local actualizado se ejecutó contra la Preview protegida e inmutable de `217f7fb`, usando su SHA exacto y el interceptor con `ignoreErrors` solo durante `afterEach`.
**Decisiones:** La estrategia queda validada antes de publicar otro commit: no hubo errores fuera de test, el token siguió limitado al origen de Vercel y las ocho aserciones funcionales permanecieron estrictas.
**Pendientes/bugs:** Commit, Quality, Preview final, CodeX y juez sobre el nuevo SHA; no reutilizar la evidencia de `217f7fb` como sustituto del gate final.
**Archivos tocados:** bitácora.
**Evidencia:** Preview `dpl_GUTZ94oSBP6uEdsxgSbPRMKEz6PY`, expected SHA `217f7fbd309847ca0abf907cb4b48c31361222ab`, E2E desplegado 8/8 PASS en 54,3 s, sin error de teardown.

## 2026-08-01 Codex - consentimiento reabrible y revocación estable de tags
**Qué se hizo:** Las preferencias de cookies usan ahora un estado de modal independiente de la franja inicial. Aceptar y rechazar cierran la interfaz; desde el pie, escritorio y móvil abren directamente el panel; X y Cancel/Cancelar descartan borradores; Guardar persiste la selección. El tracking delegado de teléfono solo considera lead el número oficial de la clínica. El auditor de Preview limita OIDC a un host `*.vercel.app` validado antes de usar el token. TikTok bloquea primero los eventos propios, revoca data sharing, desactiva cookies y conserva el marker de exclusión mientras elimina identificadores.
**Decisiones:** El marker `_tt_enable_cookie=0` no se trata como identificador publicitario ni se borra, porque el SDK lo usa para recordar el opt-out. La Preview real demostró que el SDK aun así recrea `ttcsid` a los nueve segundos; no se amplía indefinidamente el polling. Si el Pixel ya estaba cargado, la app guarda y revoca primero y después refresca una vez la misma ruta. El documento nuevo lee marketing=false antes de poder inyectar TikTok. Al reaceptar sin Pixel cargado, se inicializa de nuevo con consentimiento explícito; el camino defensivo para una restauración sin reload conserva el orden `enableCookie` y después `grantConsent`.
**Pendientes/bugs:** Publicar el nuevo SHA, repetir el auditor de 30 s y el E2E completo sobre su Preview exacta, clasificar Code Review y obtener juez GO. Queda una decisión separada antes del cierre total: TikTok prohíbe transmitir datos de salud y el código heredado todavía emite rutas/eventos de condiciones y tratamientos; también hay que decidir si se retira definitivamente el build Vite legado de Replit.
**Archivos tocados:** contexto y panel de consentimiento, footer, hook TikTok, analytics, política de cookies, auditor de Preview, guards, E2E y pruebas browser.
**Evidencia:** TypeScript PASS, suite 102/102 PASS, build Next 89/89 PASS, guards de pageview PASS, pruebas browser 4/4 PASS, contrato focalizado del auditor 7/7 PASS y E2E local ampliado 16/16 PASS en escritorio y móvil. La matriz cubre consentimiento mixto A1/M0, persistencia en back/forward, borradores descartados, fallo sintético de almacenamiento, rechazo de tenants Vercel ajenos y localización completa de Cancelar; el caso español también reabre el modal directamente desde el footer.

## 2026-08-01 Codex - cierre fail-closed y reaceptación durable de proveedores
**Qué se hizo:** Las notas CodeX posteriores detectaron dos bordes válidos. Google conserva ahora en memoria la decisión efectiva del documento, de modo que una retirada sigue cerrando pageviews y leads aunque falle la escritura y quede un grant antiguo en localStorage. TikTok reafirma `enableCookie` y `grantConsent` en cada documento con marketing permitido, antes de `page`; si la restauración falla después de habilitar cookies, revoca, deshabilita, mantiene cerradas las compuertas y continúa limpiando identificadores. El banner espera a leer la preferencia local antes de mostrarse, eliminando el flash intermitente observado en historial.
**Decisiones:** La restauración del proveedor se trata como una operación transaccional: la limpieza solo se detiene tras completar ambos controles. Un permiso persistido se reafirma en cada documento porque una recarga rápida puede ocurrir antes de que el SDK asíncrono consuma la cola anterior. Los tests de navegador no usan retries para ocultar inestabilidad.
**Pendientes/bugs:** Publicar este árbol en un SHA nuevo, exigir Quality y Code Review exactos, ejecutar 18/18 E2E y el auditor real de 30 segundos contra la Preview inmutable, y clasificar/resolver los cuatro hilos vigentes. No fusionar hasta decidir el riesgo contractual separado del TikTok Pixel sitewide en páginas clínicas.
**Archivos tocados:** analytics, hook TikTok, contexto/tipos/banner de consentimiento, E2E, auditor de Preview, guards y contrato del gate desplegado.
**Evidencia:** TypeScript PASS, suite 102/102 PASS, build 89/89 PASS, guard de analytics PASS, matriz de consentimiento repetida 30/30 sin retries y E2E completo 18/18 PASS. La cobertura nueva fuerza un fallo de `grantConsent` después de `enableCookie`, exige rollback `revokeConsent -> disableCookie`, verifica limpieza continua, bloquea navegación/eventos Google tras un write fallido y comprueba `enableCookie -> grantConsent -> page` tanto en reaceptación como después de una recarga inmediata.

## 2026-08-01 Codex - excepciones de proveedor y almacenamiento restringido
**Qué se hizo:** Las operaciones de Google y su limpieza local quedaron aisladas para que una excepción de `gtag` no cancele la retirada de cookies. El contexto de consentimiento también captura navegadores que bloquean simultáneamente `getItem` y `removeItem`, hidrata el estado denegado y mantiene utilizable la interfaz.
**Decisiones:** Los fallos del proveedor nunca tienen prioridad sobre el cierre local. El estado visual se hidrata en `finally`, incluso cuando Storage no está disponible.
**Pendientes/bugs:** Publicar el SHA de seguimiento, repetir Quality, E2E y Code Review exactos, y conservar separada la decisión contractual sobre TikTok en páginas clínicas.
**Archivos tocados:** analytics, contexto de consentimiento, E2E, pruebas browser y guards.
**Evidencia:** TypeScript PASS, suite 102/102 PASS, build 89/89 PASS, guards PASS, casos de excepción 4/4 y E2E limpio 22/22 tras cerrar procesos paralelos que compartían `.next` y `test-results`.

## 2026-08-01 Codex - sincronización cross-tab y recuperación de TikTok
**Qué se hizo:** Una retirada en otra pestaña actualiza la UI y todos los proveedores de la primera. El listener contrasta eventos obsoletos con el valor vigente antes de aplicarlos. Si una restauración TikTok falla, una recuperación posterior emite la ruta pendiente antes de marcarla como cubierta. El polling de cookies realiza veinte esperas y una lectura final real.
**Decisiones:** El estado persistido vigente prevalece sobre el payload de un evento Storage en cola. La recuperación de proveedor no marca una página hasta que `page()` se haya emitido correctamente.
**Pendientes/bugs:** Publicar y validar el SHA exacto, revisar todas las notas CodeX y no fusionar sin la decisión contractual del Pixel sitewide.
**Archivos tocados:** contexto de consentimiento, hook TikTok, E2E, pruebas browser, guards y bitácora.
**Evidencia:** Tres jueces GO sin P0-P2, TypeScript PASS, 102/102 tests, build 89/89, guards PASS y Preview inmutable `4b7e291` con 24/24 E2E en escritorio y móvil.

## 2026-08-01 Codex - auditor atómico y bordes finales de CodeX
**Qué se hizo:** El auditor dejó de intentar sobrescribir métodos protegidos del SDK de TikTok. Usa una vista Proxy temporal, delega cada control al proveedor intacto y dispara Guardar en la misma tarea del navegador. La última revisión CodeX añadió dos cierres: las retiradas remotas duplicadas ya no cancelan la recarga protectora, y una retirada local que no pudo guardarse mantiene un watermark por categoría frente a grants antiguos en cola. Se añadieron regresiones E2E para ambos recorridos.
**Decisiones:** La recarga protectora y el barrido de cookies tienen cancelaciones separadas; solo una restauración exitosa cancela la recarga. Un watermark local fallido se limpia únicamente cuando otra elección local se persiste correctamente o al reemplazar el documento. La bitácora se restaura como append-only y todo trabajo posterior se añade en entradas nuevas.
**Pendientes/bugs:** Publicar un SHA nuevo, exigir Quality y Code Review exactos, ejecutar la matriz E2E ampliada y el auditor real contra su Preview inmutable, y clasificar/resolver todos los hilos. No fusionar hasta decidir el riesgo separado del TikTok Pixel sitewide en páginas clínicas.
**Archivos tocados:** auditor y contrato de Preview, contexto de consentimiento, hook TikTok, E2E, guards y bitácora.
**Evidencia:** El auditor corregido pasó contra `4b7e291` el ciclo `denied -> accepted -> rejected -> accepted`, dos pageviews exactos, un lead por click, `revokeConsent -> disableCookie`, treinta segundos sin identificadores y restauración `enableCookie -> grantConsent -> page` con GA4 `G-WMRK41PX2E`, Clarity `sxayts0dzk` y TikTok `D3IKI7BC77UEJB9HBO0G`. Antes de los dos últimos fixes CodeX, TypeScript y la suite 102/102 también pasaron.

## 2026-08-01 Codex - apagado sitewide de TikTok y gates invertidos
**Qué se hizo:** Se añadió un kill switch literal que impide inicializar, identificar, trackear o emitir páginas a TikTok en Next y en el runtime legado. El lifecycle limpia todos los identificadores first-party heredados y revoca cualquier instancia preexistente. Banner, políticas EN/ES y documentación reflejan GA4 y Clarity activos por consentimiento, TikTok desactivado y Vercel como hosting con Hostinger como registrador/DNS. Los E2E y el auditor ahora fallan ante cualquier request, script, `window.ttq` o cookie de la familia TikTok.
**Decisiones:** El Pixel no puede reactivarse por variable de Vercel; requiere cambio de código revisado. La categoría Marketing permanece porque controla Google Ads Consent Mode. Replit conservará temporalmente su URL nativa y base de datos como rollback, pero los custom domains se retirarán solo después del merge, auditoría real de producción y paridad completa de URLs.
**Pendientes/bugs:** Commit/push del HEAD final, Quality y Code Review exactos, Preview inmutable, auditor real, merge por GitHub, validación de producción, paridad sitemap/URLs y retirada segura de apex/www en Replit.
**Archivos tocados:** tracking config, hook TikTok, shells, banner y políticas, documentación, E2E, auditor Preview, guards, tests estáticos, decisiones y bitácora.
**Evidencia:** Tres jueces revisaron el diff; los P1/P2 del primer pase quedaron resueltos. TypeScript PASS, guards PASS, tests estáticos 10/10 PASS, suite unitaria 102/102 PASS, build 89/89 PASS y Playwright local 26/26 PASS en desktop y mobile. La evidencia exacta de Preview y producción queda pendiente del nuevo SHA.

## 2026-08-02 Codex - paridad final de sitemap y auditor desplegado estable
**Qué se hizo:** La comparación byte a byte confirmó que el manifiesto de rutas histórico y el de Next son idénticos. El sitemap conserva 74 URLs base y tres posts publicados; se restauraron para el blog los alternates XML históricos, `x-default`, prioridad 0.6, fecha publicada `YYYY-MM-DD` y refresco de base de datos cada 24 horas. El auditor de Preview espera que el script no visual de Clarity esté adjunto al DOM, exige cero pageviews antes del consentimiento y estabiliza cada conteo exacto. El scroll de ruta continúa nativo y respeta movimiento reducido.
**Decisiones:** No se instala Lenis: no corrige navegación ni consentimiento y añadiría un bucle de animación e interceptores innecesarios. Los fallos de acceso que devuelvan `Login - Vercel` se clasifican como protección de Preview, no como regresión del producto; el gate exacto usa storage state limitado al hostname inmutable.
**Pendientes/bugs:** Publicar este follow-up, repetir Quality y CodeX sobre su SHA exacto, validar la nueva Preview, fusionar por GitHub, auditar producción y solo entonces retirar apex/www de Replit.
**Archivos tocados:** sitemap Next, auditor Preview, scroll nativo, contratos unitarios, decisiones y bitácora.
**Evidencia:** 77/77 URLs vivas responden 200 con canonical y hreflang correctos; missing y extras estáticos vacíos. El auditor real estricto pasó `denied -> accepted -> rejected -> accepted`, pageviews 0/1/2/3 y 1 tras reload, un lead, Clarity `[false,true]` y cero requests TikTok. Build 89/89 expone `/sitemap.xml` con revalidate 1d; Playwright local 30/30 PASS en desktop y mobile, incluidos XML serializado y reduced motion reales.

## 2026-08-02 Codex - sitemap fail-closed frente a publicaciones conocidas
**Qué se hizo:** La revisión CodeX del SHA `1da26e05` detectó que el E2E aceptaba cero posts si la consulta de sitemap fallaba. El sitemap usa ahora el snapshot publicado como fallback cuando no existe `DATABASE_URL` o Neon falla. El E2E pagina la API pública en inglés y español y exige igualdad exacta entre cada slug publicado y cada `<loc>` de artículo.
**Decisiones:** Las 74 rutas fijas no sustituyen las publicaciones conocidas. API y sitemap deben degradar al mismo snapshot, y una diferencia de conteo o URL falla el navegador en cerrado.
**Pendientes/bugs:** Commit/push del follow-up, repetir Quality, CodeX y Preview exacta; resolver el hilo P1 solo después de esa evidencia.
**Archivos tocados:** sitemap Next, E2E de sitemap, contrato SEO, decisiones y bitácora.
**Evidencia:** TypeScript PASS, 11/11 contratos focalizados, build 89/89 con sitemap revalidate 1d y Playwright local 30/30 PASS. El build local sin base de datos produjo las tres publicaciones del snapshot y el E2E las cruzó con la API pública en desktop y mobile.

## 2026-08-02 Codex - preservación del último sitemap ISR válido
**Qué se hizo:** Un juez detectó que convertir un fallo de Neon en una respuesta snapshot podía reemplazar el ISR bueno durante 24 horas. El fallback queda limitado a entornos sin base configurada. Con `DATABASE_URL`, cualquier error se registra y relanza para que Next conserve el último sitemap generado y reintente la revalidación.
**Decisiones:** Una indisponibilidad transitoria no debe publicar ni cachear una versión degradada. El snapshot sigue garantizando 77 URLs en builds deliberadamente sin base; producción con Neon falla en cerrado y conserva el último ISR.
**Pendientes/bugs:** Repetir gates focalizados y jueces; después commit/push, Quality, CodeX y Preview exacta.
**Archivos tocados:** sitemap, contrato SEO, decisiones y bitácora.
**Evidencia:** Pendiente de la validación posterior a esta entrada.

## 2026-08-02 Codex - validación del fail-closed ISR del sitemap
**Qué se hizo:** Se verificó la estrategia final: snapshot únicamente sin base configurada; error relanzado con Neon configurado; comparación API-sitemap intacta.
**Decisiones:** El follow-up queda candidato a publicar solo después de una nueva pasada de jueces sin P0-P2.
**Pendientes/bugs:** Commit/push, Quality, CodeX y Preview exacta; después clasificar y resolver el hilo vigente.
**Archivos tocados:** bitácora.
**Evidencia:** TypeScript PASS, 11/11 contratos focalizados, build 89/89 con sitemap ISR 1d y E2E XML 2/2 PASS en desktop y mobile. La batería completa inmediatamente anterior de este mismo follow-up pasó 105/105 unitarios y 30/30 E2E.

## 2026-08-02 Codex - retirada cross-tab mediante localStorage.clear
**Qué se hizo:** CodeX detectó que un clear remoto emite `StorageEvent.key=null` y el listener solo atendía la clave concreta. El contexto acepta ahora ambos casos, descarta clears de sessionStorage y relee siempre la decisión actual antes de abrir o cerrar proveedores. Se añadió un E2E real de dos pestañas que parte de grant completo, preserva un grant vigente ante un evento null sintético y luego exige retirada al ejecutar `localStorage.clear()` en la otra pestaña.
**Decisiones:** `key=null` significa que la clave pudo cambiar, no una denegación ciega. Una decisión más nueva ya persistida prevalece; si la clave desapareció, el estado vuelve a denied sin recargar el documento.
**Pendientes/bugs:** Ejecutar guards, TypeScript, unitarios, build y E2E desktop/mobile; obtener tres jueces GO, publicar el SHA, repetir Quality, CodeX, Preview exacta y resolver ambos hilos antes del merge.
**Archivos tocados:** contexto de consentimiento, guard de analítica, E2E, decisiones y bitácora.
**Evidencia:** Pendiente de la validación posterior a esta entrada.

## 2026-08-02 Codex - grants cross-tab solo desde Storage confirmado
**Qué se hizo:** El primer endurecimiento de `key=null` todavía conservaba `event.newValue` si la relectura fallaba. El listener parte ahora de denied, ignora el payload como autoridad y solo reabre categorías después de leer y validar la clave actual. Lecturas bloqueadas y valores inválidos emiten persistencia falsa. Los E2E añaden un grant no confirmado que debe cerrar Google y Clarity, y prueban que un watermark local sobrevive a clear más un grant remoto posterior.
**Decisiones:** Un evento informa de un posible cambio, pero no demuestra una elección vigente. Los watermarks de una retirada local fallida solo se limpian mediante una elección local guardada con éxito o al reemplazar el documento.
**Pendientes/bugs:** Repetir la matriz local y tres jueces; después publicar y volver a ejecutar los gates remotos exactos antes del merge.
**Archivos tocados:** contexto, E2E, guard de analítica, decisiones y bitácora.
**Evidencia:** Pendiente.

## 2026-08-02 Codex - validación local de clear y grants cross-tab
**Qué se hizo:** Se corrigió la instrumentación del E2E para esperar a Clarity después del primer grant y se cerró el banner con una elección denied antes de probar navegación en móvil. La suite focalizada y la matriz completa recorrieron el clear remoto, sessionStorage ignorado, grant obsoleto, lectura bloqueada y watermark persistente.
**Decisiones:** Un fallo del test por overlay móvil no se confunde con una regresión del producto; el recorrido debe conservar las mismas aserciones de tracking con el banner cerrado de forma explícita.
**Pendientes/bugs:** Obtener tres jueces GO, commit/push, Quality, CodeX y Preview exacta; clasificar y resolver los hilos solo con evidencia remota.
**Archivos tocados:** E2E y bitácora.
**Evidencia:** TypeScript PASS, guardas de pageview PASS, 105/105 unitarios, build 89/89, 6/6 E2E focalizados y 34/34 E2E completos en desktop y mobile. `git diff --check` limpio.

## 2026-08-02 Codex - optimización de rendimiento móvil y presupuestos de regresión
**Qué se hizo:** El registro público dejó de importar las 45 páginas en cada visita y ahora divide cada página con `next/dynamic` conservando SSR. Las imágenes compartidas usan el optimizador responsive de Next; la foto de DoctorSection y el carrusel de seguros entregan tamaños reales, y móvil monta un solo logo visible. El hero recuperó prioridad de red válida. El widget de telesalud conserva apertura, cierre, foco, Escape y CTAs con CSS, sin cargar Framer Motion. Se añadieron presupuestos automáticos para el shell posbuild y para el JavaScript hidratado observado en Pixel 7, tanto en Inicio como en una ubicación pesada.
**Decisiones:** Se conserva Google Consent Mode avanzado y su modelado de Ads; no se retrasa ni se elimina `gtag` sin una decisión comercial separada. No se quita contenido inferior del HTML SSR para ganar puntuación. La URL nativa y el proyecto de respaldo de Replit permanecen intactos; este cambio no toca DNS ni dominios.
**Pendientes/bugs:** Publicar el SHA, exigir Quality y Code Review exactos, validar la Preview inmutable y repetir Lighthouse allí antes del merge. Backlog separado: ajustar alturas intrínsecas de los wrappers lazy para evitar saltos al recorrer rápidamente varias secciones; decidir aparte si se cambia Consent Mode avanzado por básico.
**Archivos tocados:** registro público, imágenes Hero/Doctor/seguros, widget de telesalud, dependencias, presupuestos de build, contratos unitarios, E2E y bitácora.
**Evidencia:** El shell de `/` bajó de 2.09 MB a 669.4 KiB y el catch-all quedó en 777.3 KiB; Pixel 7 observó 868,974 B de JavaScript first-party hidratado en Inicio frente al límite de 1 MiB, y Fort Myers pasa el límite de 1280 KiB. Lighthouse móvil local controlado pasó de 61 a mediana 77, con una pasada de 81; imágenes evitables bajaron de aproximadamente 385 KiB a 8 KiB; accesibilidad, buenas prácticas y SEO quedaron en 100 y CLS inicial en 0. TypeScript PASS, 108/108 unitarios PASS, build 89/89 PASS, 38 E2E PASS y 2 skips exclusivos de desktop antes de ampliar los dos contratos runtime; los cuatro E2E focalizados posteriores y el catch-all final pasaron, y `git diff --check` quedó limpio. Verificación visual: Hero correcto, Doctor nítido, carrusel móvil rotando, 15/15 logos desktop visibles, todos los `/_next/image` en 200 y cero errores de consola/página. La revisión independiente clasificó sus cuatro P2 como válidos y resueltos, sin hallazgos accionables restantes.

## 2026-08-02 Codex - validación final de presupuestos runtime móviles
**Qué se hizo:** Se repitió la matriz completa después de añadir el presupuesto hidratado de Fort Myers, la comprobación del segundo logo del carrusel y la captura de errores de consola/página en los cuatro recorridos nuevos.
**Decisiones:** Los presupuestos del shell y del navegador se conservan juntos: el primero impide volver a agrupar el registro público y los segundos cubren chunks dinámicos reales de Inicio y de una ruta catch-all pesada.
**Pendientes/bugs:** Commit/push, Quality, Code Review, Preview inmutable y Lighthouse remoto exacto antes del merge.
**Archivos tocados:** E2E y bitácora.
**Evidencia:** 39/39 E2E aplicables PASS en desktop/mobile y 3 skips deliberados de contratos exclusivos de móvil. Review independiente final sin hallazgos bloqueantes ni accionables; los cuatro P2 quedaron válidos, resueltos y verificados.

## 2026-08-02 Codex - inclusión del presupuesto posbuild en Vercel
**Qué se hizo:** El primer Preview del PR completó el build de Next y las 89 páginas, pero Vercel excluyó `verify-public-route-bundle-budget.mjs` por la regla general `scripts/*`. Se añadió una excepción explícita en `.vercelignore` para que el mismo presupuesto que pasa localmente también se ejecute en el constructor remoto.
**Decisiones:** El guard de rendimiento no se desactiva ni se salta en Vercel; se corrige el paquete de entrada para mantener el gate real en Preview y producción.
**Pendientes/bugs:** Repetir build local, push, Quality, Code Review, Preview exacta y E2E/Lighthouse remoto antes del merge.
**Archivos tocados:** `.vercelignore` y bitácora.
**Evidencia:** Logs del deployment `dpl_BovYoeXMsNmk4yF9c6BcaNvGcJfK`: compilación y 89/89 páginas completadas; único fallo `MODULE_NOT_FOUND` del verificador excluido.

## 2026-08-02 Codex - cierre de notas móviles del Code Review
**Qué se hizo:** El carrusel móvil conserva el logo actual hasta que el siguiente recurso responsive confirma que está listo, y solo entonces hace la transición; Inicio y ubicaciones comparten el mismo componente acotado. Se corrigieron las dimensiones y pistas `sizes` de Contact y ubicaciones para que Next entregue una variante suficiente en pantallas retina. Se añadió un recorrido de navegación fría que bloquea los chunks de destino y confirma que la página actual permanece visible hasta el cambio atómico.
**Decisiones:** La nota `discussion_r3698931219` fue **válida y resuelta**: se reprodujo el hueco con el segundo logo retrasado y ahora no se desmonta el activo. La nota `discussion_r3698931222` fue **inválida**: con prefetch desactivado y chunks de About demorados, Next conserva URL, H1 y contenido de Inicio hasta poder completar la navegación; añadir un fallback global reemplazaría contenido que hoy se preserva. La nota `discussion_r3698931224` fue **válida y resuelta**: se auditaron los 39 usos y se corrigieron los dos patrones materiales de `sizes`.
**Pendientes/bugs:** Publicar el nuevo SHA, repetir Quality y CodeX sobre ese HEAD, ejecutar E2E y Lighthouse contra su Preview inmutable y fusionar solo si no quedan notas válidas.
**Archivos tocados:** imagen optimizada, carrusel compartido, seguros de Inicio y ubicaciones, Contact, contratos unitarios, E2E y bitácora.
**Evidencia:** TypeScript PASS, 110/110 unitarios PASS, build 89/89 PASS; shell de Inicio 669.5 KiB frente a 750 KiB y catch-all 777.4 KiB frente a 850 KiB. Playwright local completo: 41 PASS y 5 skips deliberados por perfil, incluidos clic único EN/ES, cookies, navegación fría sin blanco, logo retrasado sin hueco, `srcset` suficiente al DPR real, SEO/sitemap y presupuestos hidratados.

## 2026-08-02 Codex - salto de logos fallidos y hero único por viewport
**Qué se hizo:** La revisión CodeX exacta de `2245b3a` detectó dos bordes reales. El carrusel registra candidatos fallidos, conserva el logo activo y busca circularmente el siguiente disponible; `OptimizedImage` informa tanto cargas listas como fallos de red o decodificación. En las diez páginas de ubicación, el hero móvil ocultable deja de ser prioritario y el hero de escritorio conserva prioridad: en móvil ambos elementos describen la misma variante responsive y comparten una sola descarga; en escritorio solo el visible inicia la petición prioritaria.
**Decisiones:** `discussion_r3699125519` fue **válida y resuelta**: un United Healthcare corrupto ya no congela la rotación y se salta hasta Medicare sin blanco. `discussion_r3699125522` fue **válida y resuelta**: se reprodujeron las dos variantes `w=2048` y `w=1920` en 2048 px y el contrato nuevo exige una única URL optimizada en 390 px y 2048 px. Se conserva un hero prioritario por viewport para no sacrificar LCP.
**Pendientes/bugs:** Obtener tres jueces independientes sin P0-P2, publicar el follow-up, repetir Quality y CodeX sobre el nuevo SHA, validar su Preview inmutable y volver a medir Lighthouse antes del merge.
**Archivos tocados:** imagen optimizada, carrusel móvil, diez páginas de ubicación, contratos unitarios, E2E y bitácora.
**Evidencia:** TypeScript PASS, 111/111 unitarios PASS, build 89/89 PASS y presupuestos 669.5/750 KiB y 777.4/850 KiB. Los dos recorridos focalizados pasaron en móvil y escritorio; Playwright completo cerró con 43 PASS y 5 skips deliberados, incluida una respuesta de imagen 200 no decodificable que se salta sin hueco y una única petición hero visible a 390×844 y 2048×1200.

## 2026-08-02 Codex - corrección SSR/LCP del enfoque de hero
**Qué se hizo:** Dos jueces rechazaron el primer enfoque `priority=false` porque resolvía la descarga doble a costa de montar el hero móvil solo después de hidratar. La solución final restaura prioridad en ambas representaciones y les asigna el mismo `sizes`, por lo que Next genera el mismo candidato y el navegador realiza una sola petición coalescida. Además, toda imagen `priority` se entrega con opacidad 1 desde SSR; el fundido queda reservado para recursos diferidos.
**Decisiones:** El intento anterior no se publica. El contrato final exige una sola petición cruda, no solo una URL distinta, tanto en 390 px como en 2048 px. Con todos los chunks JavaScript retenidos, el hero móvil debe existir, no mostrar placeholder y mantener opacidad computada 1 antes de la hidratación.
**Pendientes/bugs:** Repetir la matriz completa sin procesos concurrentes, obtener el tercer GO sobre la opacidad SSR, commit/push, Quality, CodeX y Preview exacta antes del merge.
**Archivos tocados:** imagen optimizada, diez heroes de ubicación, contratos unitarios, E2E y bitácora.
**Evidencia:** TypeScript PASS, contratos 6/6 PASS, build 89/89 PASS y recorrido focalizado final 4 PASS/2 skips esperados. La única prueba histórica de consentimiento que agotó 30 s durante builds concurrentes pasó después 3/3 aislada; no está relacionada con el diff y todavía se exige una matriz completa final limpia.

## 2026-08-02 Codex - validación local final del follow-up móvil
**Qué se hizo:** Se ejecutó la matriz completa en aislamiento después de la corrección de opacidad SSR y de la coalescencia del hero. Tres jueces independientes revisaron el diff final y no encontraron P0, P1 ni P2 restantes.
**Decisiones:** El código queda autorizado para commit/push, no todavía para merge. Los dos hilos CodeX nuevos permanecen abiertos hasta que el SHA publicado pase Quality, Preview inmutable, E2E desplegado y una nueva revisión exacta.
**Pendientes/bugs:** Publicar el SHA, repetir todos los gates remotos, clasificar cualquier nota nueva, resolver los dos hilos vigentes y medir Lighthouse antes de fusionar.
**Archivos tocados:** bitácora.
**Evidencia:** TypeScript PASS, 111/111 unitarios PASS, build 89/89 PASS, shell 669.5/750 KiB y catch-all 777.4/850 KiB. Playwright final: 44 PASS y 6 skips deliberados; el timeout histórico de consentimiento pasó 3/3 aislado. Hero: una petición exacta en 390/DPR2 y 2048/DPR1, imagen SSR con opacidad 1 antes de hidratar. Carrusel: candidato corrupto saltado hasta Medicare sin desmontar Aetna. Tres jueces: GO, cero P0-P2.

## 2026-08-02 Codex - canonical social ES y endurecimiento de respuestas
**Qué se hizo:** El crawl posterior al merge detectó once rutas españolas cuyo `og:url` todavía apuntaba a la pareja inglesa. Se corrigieron las once entradas, Next prioriza ahora el canonical de la ruta y el runtime legado construye Open Graph desde el pathname real. Todas las respuestas reciben CSP mínimo anti-framing/objetos/base, `X-Frame-Options`, `nosniff`, Referrer Policy y Permissions Policy sin bloquear los proveedores externos existentes.
**Decisiones:** Open Graph y canonical forman una invariante por idioma. El CSP no introduce todavía una allowlist de recursos: una política estricta se diseñará solo con inventario completo de GA, Clarity, Maps, Charm y medios. El doble salto exclusivo de `http://` apex queda como mejora de configuración Vercel separada, no como cambio de aplicación.
**Pendientes/bugs:** Commit/push en PR independiente, Quality, Code Review exacto, Preview inmutable, E2E desplegado y crawl final antes del merge.
**Archivos tocados:** manifiesto SEO, generador Metadata de Next, helper SEO legado, headers Next, contratos unitarios, E2E, decisiones y bitácora.
**Evidencia:** TypeScript PASS, 113/113 unitarios PASS, build 89/89 PASS, presupuestos 669.5/750 KiB y 777.3/850 KiB. Playwright local final: 48 PASS y 6 skips deliberados; la focalizada previa cerró 8/8. La invariante del manifiesto queda en 79/79; los recorridos validan `og:url` ES en carga fría y tras clic SPA real, además de los cinco headers en desktop y móvil. Dos jueces dieron GO final, cero P0-P2.

## 2026-08-02 Codex - identidad social verificada y datos estructurados SSR
**Qué se hizo:** Se centralizaron las cuentas oficiales de Healing Minds y de la Dra. Melva para Footer, About, CTA de TikTok, carrusel y schemas. TikTok e Instagram usan `@melvareve_md`, Facebook conserva el ID oficial de Naples, LinkedIn queda asociado a la doctora y YouTube `@healingmindsp` vuelve a ser visible. Next emite Organization/Physician JSON-LD solo en Inicio desde el HTML inicial, con NPPES oficial, NPI, logo 512 y especialidad `Psychiatric`. Todas las rutas recuperan imagen Open Graph/Twitter 1200x630. La respuesta y el cliente deduplican las repeticiones que Metricool entrega del mismo TikTok.
**Decisiones:** Ninguna cifra de seguidores se codifica porque cambia con el tiempo. `sameAs` solo contiene identidades vivas y verificadas; se retiraron NPIDB y Sharecare. Organization se publica en la home canónica, no en admin ni en todas las páginas. Los clics externos se prueban con popups interceptados para validar el cableado sin hacer CI dependiente de Meta, TikTok, LinkedIn o YouTube.
**Pendientes/bugs:** Publicar el SHA, exigir Quality y Code Review exactos, validar la Preview inmutable con E2E desktop/móvil y fusionar solo sin notas válidas pendientes. Backlog separado: hidratación de los tres artículos, schemas específicos por tipo de página, H1 móvil de ubicaciones y segunda pasada de rendimiento/consentimiento.
**Archivos tocados:** registro social compartido, Footer/About/carruseles, API y hook TikTok, Metadata/JSON-LD de Next, schema legado, contratos unitarios, E2E y bitácora.
**Evidencia:** Perfiles revalidados en navegador público; NPPES confirma NPI activo `1982233631` para Melva Reve Urgelles. `git diff --check` limpio, TypeScript PASS, 115/115 unitarios PASS, build 89/89 PASS con presupuestos 669.5/750 KiB y 778.1/850 KiB. E2E social local: 2/2 PASS en Desktop Chrome y Pixel 7, cubriendo cinco clics, SSR, OG/Twitter, unicidad de API y cuatro enlaces únicos en About y carrusel compacto. Tres jueces finales: GO, cero P0-P3.

## 2026-08-02 Codex - corrección de los dos P2 del review social
**Qué se hizo:** Los artículos congelados resuelven ahora su post antes de aceptar el metadata del manifiesto y sustituyen la tarjeta genérica por su imagen publicada exacta. El schema Organization/Physician dejó el layout persistente y pertenece al segmento de Inicio, por lo que se añade y retira junto con la ruta durante navegación Next real.
**Decisiones:** `discussion_r3700392879` fue **válida y resuelta**: las tres rutas congeladas devolvían antes del lookup del post. `discussion_r3700392881` fue **válida y resuelta**: un header del request no sincroniza un root layout persistente durante navegación cliente. El E2E entra y sale de Inicio mediante links reales y comprueba la imagen versionada exacta del artículo de ansiedad.
**Pendientes/bugs:** Publicar un nuevo SHA y exigir Quality, Preview desplegada, E2E completo y Code Review sobre ese HEAD antes del merge.
**Archivos tocados:** metadata de catch-all, layout, segmento Inicio, contratos unitarios, E2E y bitácora.
**Evidencia:** `git diff --check`, TypeScript y 116/116 unitarios PASS; build 89/89 PASS con shell 669.5/750 KiB y catch-all 778.3/850 KiB. Los recorridos sociales y del artículo pasan 4/4 en Desktop Chrome y Pixel 7.

## 2026-08-02 Codex - hidratación determinista de artículos públicos
**Qué se hizo:** El test de metadata reprodujo React #418 en las tres publicaciones: SSR entregaba el contenido crudo sin IDs ni índice, mientras el primer render del navegador procesaba 8/3/3 encabezados e insertaba dos TOC. El procesamiento DOM se difiere ahora hasta después de hidratar. Fechas y año usan UTC, el año limita la tolerancia de hidratación a su propio `span`, TanStack Query crea un cliente por petición SSR y la lectura del post se cachea con claves primitivas compartidas entre metadata y página.
**Decisiones:** No se silenció el error de artículo ni se relajó el E2E. El contenido SSR permanece completo y previamente sanitizado; solo el enriquecimiento de navegación interna se añade tras hidratar. En navegador se conserva un singleton para que las mutaciones existentes sigan invalidando el mismo QueryClient.
**Pendientes/bugs:** Publicar el SHA final, repetir Quality y CodeX, ejecutar la matriz completa contra la Preview inmutable y fusionar solo sin notas válidas.
**Archivos tocados:** página de artículo, loader público, provider/query client, Footer, contratos y E2E.
**Evidencia:** Dos matrices locales completas consecutivas cerraron con 52 PASS y 6 skips deliberados antes de los remates P3; sobre el diff final: `git diff --check`, TypeScript, 116/116 unitarios, build 89/89 y 4/4 E2E focalizados PASS. Tres revisiones independientes: cero P0-P3; la matriz completa exacta queda delegada al CI/Preview del SHA publicado.

## 2026-08-02 Codex - dirección propia en el nodo Physician
**Qué se hizo:** El segundo CodeX Review del PR detectó que Google ya había marcado como crítico el `address` ausente en `/#physician`. Organization y Physician reutilizan ahora la misma dirección verificada de Naples, y el E2E inspecciona el objeto postal completo dentro del JSON-LD SSR.
**Decisiones:** El hilo `PRRT_kwDOToJ8Pc6V04nv` fue **válido y resuelto**. `worksFor` no sustituye el campo requerido en un nodo Physician autónomo; se reutiliza el dato existente sin inventar ni duplicar valores divergentes.
**Pendientes/bugs:** Repetir validación local, publicar el tercer SHA, exigir Quality, Preview, E2E desplegado y CodeX exactos antes del merge.
**Archivos tocados:** JSON-LD social, guard unitario, E2E y bitácora.
**Evidencia:** `git diff --check`, TypeScript y 116/116 unitarios PASS; build 89/89 y presupuestos PASS. E2E social con dirección postal exacta: 2/2 PASS en Desktop Chrome y Pixel 7.

## 2026-08-03 Codex - idioma español y enlaces del blog desde el HTML inicial
**Qué se hizo:** El idioma calculado por Next en cada request llega ahora al provider global antes del primer render. Las rutas españolas entregan texto, navegación y enlaces internos españoles sin esperar JavaScript. `/blog` y `/es/blog` cargan en servidor todos los artículos publicados, entregan anchors reales a los crawlers y conservan esa lista durante la hidratación. Los logos, CTA principal y enlace de privacidad respetan también el idioma activo.
**Decisiones:** El listado de blog usa caché de servidor separada por idioma durante cinco minutos y un snapshot congelado solo como fallback fuera de caché. La versión legacy sigue consultando su API cuando no recibe datos iniciales. Fechas y orden de categorías quedan fijados a UTC y locale explícito para evitar diferencias de hidratación. Cuatro P2 de los jueces fueron **válidos y resueltos**: lista legacy vacía, orden potencialmente distinto de categorías y dos pruebas E2E que no demostraban suficientemente el H1 español y la transición Next.
**Pendientes/bugs:** Publicar el SHA en un PR, exigir Quality y Code Review sobre ese HEAD, ejecutar E2E contra la Preview inmutable con Neon real y fusionar solo si no quedan notas válidas.
**Archivos tocados:** layout/providers de Next, contexto de idioma, Header/Footer/Hero/CookieBanner, loader y wrapper SSR del índice de blog, BlogIndex, contratos unitarios, E2E y bitácora.
**Evidencia:** `git diff --check` y TypeScript PASS; 117/117 unitarios PASS; build 89/89 PASS, shell 669.5/750 KiB y catch-all 786.8/850 KiB. Playwright local final: 60 PASS y 6 skips deliberados por perfil, cubriendo Desktop Chrome y Pixel 7, HTML sin JavaScript, enlaces de todos los posts, hidratación, navegación de un clic, cookies, analítica y presupuestos móviles. Tres jueces finales: GO, cero P0-P3 pendientes.

## 2026-08-03 Codex - enlaces públicos, anchors legales y sitemap canónico
**Qué se hizo:** Se sustituyeron destinos públicos retirados por las URLs oficiales vigentes de AHCA, United Way of Collier and the Keys, COFFO, Harry Chapin Food Bank y Estero Today. La tarjeta de GGEACA conserva la entidad activa, pero elimina el CTA porque no existe una web oficial operativa verificable. Las políticas de cookies y privacidad muestran etiquetas descriptivas en lugar de URLs crudas. Los tres artículos que solo recibían un enlace interno ahora se descubren también desde sus páginas clínicas, y el sitemap publica la home con la misma barra final que canonical y hreflang.
**Decisiones:** Ave Maria no se modifica porque responde correctamente. Collier Parks tampoco se cambia: su 403 corresponde al crawler y la página oficial sigue activa. COFFO se presenta como una organización distinta y verificada, no como sucesora de Immokalee Community Action. Engage Estero conserva su nombre y enlaza a su web actual EsteroToday.com. Los H1 quedan intactos porque el crawl actual confirma uno por ruta y ninguno supera 75 caracteres.
**Pendientes/bugs:** Publicar el SHA, exigir Quality y Code Review exactos, validar la Preview inmutable, clasificar todas las notas y fusionar solo sin hallazgos válidos pendientes. Los titles y descriptions largos quedan en un PR de metadata separado.
**Archivos tocados:** datos legales, cinco páginas de ubicación, dos páginas de servicio, sitemap, guardas unitarias, E2E y bitácora.
**Evidencia:** `git diff --check` y TypeScript PASS; 121/121 unitarios PASS; build 89/89 PASS, shell 669.5/750 KiB y catch-all 786.8/850 KiB. Playwright local final: 70 PASS y 6 skips deliberados por perfil en Desktop Chrome y Pixel 7, con clics externos interceptados, navegación interna de un solo clic hasta URL y H1 finales, HTML sin JavaScript, cookies, analítica, anchors legales y sitemap. Tres jueces finales: GO, cero P0-P3 accionables.

## 2026-08-03 Codex - límites editoriales de títulos y descripciones SEO
**Qué se hizo:** Se reescribieron manualmente los metadatos largos del manifiesto público EN/ES, manteniendo la intención clínica, la ubicación real y el nombre de marca sin truncados automáticos. Title, description, Open Graph y Twitter comparten ahora el mismo texto por ruta. Las pruebas recorren las 79 rutas, el snapshot dinámico de los tres artículos y rutas representativas EN/ES/blog antes y después de hidratar, en escritorio y Pixel 7.
**Decisiones:** Se adopta 60 caracteres como límite editorial conservador para títulos y 160 para descripciones; no se usa el límite como excusa para eliminar intención local. Las páginas satélite dicen `for/para` o explican que la atención presencial ocurre en Naples, sin fingir una oficina en cada ciudad. Los tres artículos dinámicos ya cumplen los límites y quedan cubiertos aparte porque Neon puede sustituir el manifiesto. Los H1, URLs, canonicals, robots, alternates, body y meta keywords quedan fuera de este cambio; el crawl público confirma un H1 por ruta y ninguno mayor de 75.
**Pendientes/bugs:** Completar build y E2E local, obtener tres jueces sin hallazgos, publicar el SHA, exigir Quality y Code Review exactos, validar Preview inmutable en desktop/móvil y fusionar solo sin notas válidas. La ortografía completa del artículo español almacenado en Neon se tratará como corrección editorial separada para no mezclar contenido con este lote de snippets.
**Archivos tocados:** manifiesto SEO congelado, contratos unitarios de límites/paridad y E2E de metadata, más bitácora.
**Evidencia:** Crawl de producción sobre `187358d`: 79/79 rutas 200 y paridad exacta con el manifiesto; baseline de 58 títulos >60, 42 >70, 34 >75 y 55 descripciones >160; un H1 por ruta y cero H1 >75. Después del cambio: máximos 60/157, cero excesos, vacíos o duplicados y paridad social 79/79. Las pruebas nuevas fallaron primero sobre el baseline largo; tras la reescritura, `git diff --check`, TypeScript y 122/122 unitarios PASS. Build, E2E, jueces y gates remotos aún pendientes al registrar esta entrada.

## 2026-08-03 Codex - cierre de hallazgos del juez de metadata
**Qué se hizo:** El límite de 60 caracteres se extendió al flujo completo del blog: validación de API/admin, verificación editorial, normalización y prompt de IA, autofix y contador del panel. La prueba de IA entrega deliberadamente un meta title largo y exige que salga acotado. El título bipolar ES conserva Naples con una redacción natural, la política de comunicaciones explica cómo dejar de recibir mensajes y la descripción de TEPT usa `enfoque sensible al trauma`.
**Decisiones:** Los cinco hallazgos del juez fueron válidos. La corrección ortográfica del artículo español se retiró de este manifiesto porque Neon tiene prioridad y habría sido un cambio aparente sin efecto; se mantiene el valor productivo actual hasta el PR editorial separado que sincronizará snapshot, seed y Neon por idioma+slug. El límite 60 no queda solo como test del inventario existente: también bloquea reintroducciones desde el editor y la IA.
**Pendientes/bugs:** Recompilar el estado final, repetir unitarios y E2E focalizados/completos, obtener GO final de tres jueces y completar los gates remotos del PR.
**Archivos tocados:** manifiesto y E2E de metadata; validación, verificación, IA, autofix y panel del blog; guardas unitarias/IA; bitácora.
**Evidencia:** El primer E2E focalizado posterior a los snippets detectó correctamente que el servidor aún ejecutaba el build previo y recibió el título anterior. Tras alinear el pipeline, `git diff --check`, TypeScript, 8/8 guardas focalizadas y búsqueda de límites heredados a 70 PASS; no queda ninguna ruta activa del flujo del blog que acepte o genere 70 caracteres.

## 2026-08-03 Codex - recorte SEO en límite de palabra
**Qué se hizo:** La revisión final reprodujo que el normalizador podía convertir un título largo en una palabra incompleta aunque respetara numéricamente el límite. `truncateSeoText` conserva ahora la última palabra completa dentro del presupuesto; solo usa corte duro cuando todo el valor es un único token sin espacios. La prueba de IA exige el resultado exacto y legible, no solo `length <= 60`.
**Decisiones:** El hallazgo P2 de los jueces general y SEO fue válido y resuelto. El límite de caracteres es una guarda, no una autorización para publicar snippets rotos.
**Pendientes/bugs:** Repetir toda la matriz sobre el build final y obtener GO independiente. El timeout móvil aislado de consentimiento ocurrió antes de localizar el botón, sin aserción del producto, y debe pasar aislado y dentro de una matriz limpia antes de publicar.
**Archivos tocados:** normalizador editorial, guard de IA y bitácora.
**Evidencia:** Antes del fix, la fixture terminaba literalmente en `article title th`; la nueva expectativa exige `An intentionally overlong psychiatric care article title`.

## 2026-08-03 Codex - validación local final de metadata y pipeline
**Qué se hizo:** Se repitieron suite, build y la matriz completa después de centralizar el recorte por palabra. El test móvil de retirada de cookies que había agotado 30 segundos antes de encontrar su primer botón pasó aislado y volvió a pasar dentro de la matriz final.
**Decisiones:** Solo la última matriz limpia cuenta como gate final; el run intermedio con 73 PASS, 6 skips y un timeout de arranque queda documentado como evidencia transitoria, no como excepción. Tres jueces independientes revisaron el diff posterior a todos los fixes y dieron GO sin P0-P3.
**Pendientes/bugs:** Commit/push, PR, Quality, Code Review exacto, Preview inmutable y E2E desplegado desktop/móvil antes de fusionar. El artículo español de Neon sigue en el PR editorial separado ya diagnosticado.
**Archivos tocados:** bitácora.
**Evidencia:** `git diff --check`, TypeScript y 123/123 unitarios PASS; build Next 89/89 con presupuestos 669.5/750 KiB y 786.8/850 KiB; E2E local final 74 PASS y 6 skips deliberados por perfil. Consentimiento móvil focalizado 1/1 PASS. Inventario final: 79 rutas, máximos 60/157, cero excesos, vacíos, duplicados o deriva OG/Twitter. Jueces general, SEO y pruebas: GO, cero P0-P3.

## 2026-08-03 Codex - gemelos bilingües durables y privados
**Qué se hizo:** Auto Generate conserva primero el borrador fuente y crea después una corrida durable recuperable para el idioma contrario. El gemelo comparte `translationGroupId`, nace siempre draft, conserva estructura clínica, enlaces y fuentes bajo allowlist, reutiliza la imagen seleccionada sin gasto visual y aparece en el admin como missing/draft/pending_review/published con acción de abrir o reintentar.
**Decisiones:** Dos artículos del mismo grupo e idioma quedan bloqueados por índice único en DB. La publicación es independiente. Rutas estáticas se traducen solo con el manifiesto real; links a artículos solo cambian si el sibling está publicado; fuentes externas solo usan una URL target-language curada del mismo host oficial. El run de traducción es un subpaso separado y durable: su fallo no modifica el run completado ni el borrador fuente.
**Pendientes/bugs:** Completar suite/build/E2E local, publicar en PR draft, verificar Preview por SHA y clasificar todas las notas vigentes de Code Review antes de considerar el PR listo. No mergear ni aplicar la migración en Production desde esta tarea.
**Archivos tocados:** schema/migración Drizzle, storage y worker de traducción, dispatcher de runs, API/admin, documentación, guardas PGlite/unitarias y E2E desktop/móvil.
**Evidencia:** `db:verify` PASS con 5 migraciones, 112 statements, unicidad del sibling y publicación independiente; guardas focalizadas de traducción 4/4 PASS; TypeScript PASS. Suite completa, build, E2E y `diff --check` quedan pendientes al registrar esta entrada.

## 2026-08-03 Codex - gate final local de gemelos bilingües
**Qué se hizo:** Se ejecutó el pipeline completo sobre el contrato final y el admin real con APIs interceptadas sin secretos. El recorrido genera el draft target, observa el estado durable y abre el sibling en el editor.
**Decisiones:** Los 404 de favicon/imagen de una primera fixture se trataron como fallo real del gate de consola; la fixture dejó de solicitar ambos recursos y la matriz final quedó limpia. No se relajó el detector de errores.
**Pendientes/bugs:** Gates remotos del PR draft: aplicar migración solo en Preview/entorno autorizado, verificar deployment por SHA, repetir E2E y clasificar todas las notas de Code Review. No mergear ni modificar Production desde esta tarea.
**Archivos tocados:** fixture E2E y bitácora en el remate.
**Evidencia:** `npm test` 127/127 PASS; TypeScript PASS; build 89/89 y budgets 669.5/750 KiB + 786.8/850 KiB PASS; `db:verify`, link/topic/image guards y `git diff --check` PASS; E2E admin final 2/2 PASS (Desktop Chrome y Pixel 7), con 2 skips deliberados por perfil cruzado.
## 2026-08-03 Codex - archivo público escalable por idioma
**Qué se hizo:** Se inspeccionó la implementación viva de XL Homes y se documentaron su featured, grid y Load More junto con sus límites SEO. Healing Minds separa ahora los índices `/blog` y `/es/blog` en rutas SSR dinámicas, pagina nueve publicaciones por URL, mantiene un único featured efectivo y ofrece categorías y navegación anterior/siguiente/numerada con anchors reales. Se añadió una fixture de navegador protegida y no indexable con 14 EN y 12 ES.
**Decisiones:** No se copia el offset cliente de XL Homes. La página 1 muestra featured más ocho regulares; las siguientes muestran nueve regulares. El desempate por id impide saltos y el post featured se excluye de todas las páginas regulares. El sitemap y la API pública conservan todas las publicaciones; solo cambia la composición del archivo. El conteo CMS global se documenta por separado del archivo por idioma.
**Pendientes/bugs:** Crear PR draft, esperar Preview del SHA exacto, ejecutar E2E desplegado desktop/móvil y clasificar todas las notas vigentes de Code Review. No mergear.
**Archivos tocados:** storage y helper de paginación, loaders y rutas SSR EN/ES, índice público, API, fixture/E2E, contratos unitarios, documentación XL/archivo, decisiones y bitácora.
**Evidencia:** `npm test` 125/125 PASS; TypeScript PASS; `db:verify` 4 migraciones/110 statements/20 tablas/23 FKs PASS; guards blog link/topic/image PASS; build Next 87/87 estáticas PASS, `/blog` y `/es/blog` dinámicas, presupuestos 669.4/750 KiB y 778.3/850 KiB; E2E focalizado con 10+ fixtures 2/2 PASS en Desktop Chrome y Pixel 7; `git diff --check` pendiente de la revisión final previa al commit.

## 2026-08-03 Codex - gate final local del archivo público
**Qué se hizo:** Se repitió el contrato crawlable modificado después del build final. El navegador sin JavaScript recorrió las páginas numeradas EN/ES y comparó la unión de enlaces con todos los posts publicados de la API.
**Decisiones:** La ejecución combinada con todo `navigation.spec.ts` agotó el límite externo de 184 segundos sin emitir un fallo de producto; no se usa como evidencia. Cuenta la ejecución focalizada posterior del test realmente modificado, junto con la matriz propia de 10+ fixtures.
**Pendientes/bugs:** Gates remotos del PR draft: Preview por SHA exacto, E2E desplegado desktop/móvil y clasificación completa de Code Review.
**Archivos tocados:** bitácora solamente en este remate.
**Evidencia:** `git diff --check` PASS; crawl SSR de todos los posts paginados 2/2 PASS en Desktop Chrome y Pixel 7; fixture de archivo 10+ ya cerrada 2/2 en ambos perfiles.

## 2026-08-04 Codex - preflight de migración antes de traducción
**Qué se hizo:** Tras la orden de merge, el PR bilingüe se realineó con el `main` que ya contiene el archivo público. La cola comprueba ahora que existe el índice único de la migración 0004 antes de crear un run o llamar al proveedor.
**Decisiones:** La orden de fusionar no autoriza mutar la DB de Production. El código puede desplegarse antes del schema, pero falla en cerrado con `blog_translation_migration_required` y 503, sin gasto IA ni borrador parcial. Si el sibling ya existe, puede abrirse aunque el entorno aún no tenga el índice.
**Pendientes/bugs:** Repetir check, unitarios, db:verify, build, E2E y gates remotos sobre el nuevo HEAD antes de fusionar #21.
**Archivos tocados:** storage/workflow de traducción, contrato unitario, documentación, decisiones y bitácora.
**Evidencia:** Pendiente al registrar esta entrada.

## 2026-08-04 Codex - gate local combinado antes de actualizar PR #21
**Qué se hizo:** Se validó el gemelo bilingüe ya montado sobre el archivo público fusionado y con el preflight de migración fail-closed.
**Decisiones:** El nuevo HEAD solo se publicará tras pasar tanto el archivo como el flujo admin bilingüe en desktop y móvil; los gates remotos deberán repetirse por ser un update del PR.
**Pendientes/bugs:** Push, Preview exacta, Quality completa, relectura/clasificación de Code Review y squash merge de #21 si todo permanece verde.
**Archivos tocados:** bitácora en este cierre de evidencia.
**Evidencia:** TypeScript, 129/129 unitarios, 5 migraciones/112 statements, build 87/87, budgets y `git diff --check` PASS. E2E focalizado combinado: 4 PASS y 2 skips deliberados por perfil, cubriendo archivo 10+ y admin del gemelo en Desktop Chrome y Pixel 7 sin errores inesperados.

## 2026-08-04 Codex - contrato bilingüe completo para ambos generadores
**Qué se hizo:** Se comprobó la UI productiva y el patrón histórico de XL Homes. Auto Generate ya encadenaba el idioma contrario, pero AI Generate con topic/keyword/contexto solo creaba la fuente. Ambos flujos comparten ahora el contrato de par y la UI llama al idioma elegido `Source language`. Se agregó un refresh confirmado del sibling desde el post actual, limitado a drafts y protegido contra cambios concurrentes en cualquiera de las dos versiones.
**Decisiones:** EN crea fuente EN y sibling ES; ES crea fuente ES y sibling EN. Ambos quedan privados y se publican por separado. Las correcciones nunca pisan automáticamente un sibling revisado: pending_review y published están bloqueados, y un draft solo se reemplaza tras confirmación explícita.
**Producción:** Se verificaron cero duplicados, se reconciliaron en el journal las migraciones 0002/0003 ya físicamente presentes y se aplicó 0004 en una transacción. Resultado: 5 migraciones, índice bilingüe único activo, índice viejo retirado, 0 duplicados y 7 posts intactos.
**Archivos tocados:** workflow/storage/API Next y Express, admin UI, E2E, tests de contrato, documentación, decisiones y bitácora.
**Evidencia:** TypeScript PASS; 129/129 tests PASS; db:verify 5 migraciones/112 statements PASS; build 87/87 y budgets PASS; E2E admin desktop/mobile 2/2 PASS con 2 skips de perfil, sin errores inesperados. Pendiente PR, Preview exacta, E2E desplegado y Code Review.

## 2026-08-04 Codex - normalización recuperable de metadata bilingüe
**Qué se hizo:** Se reprodujo el rechazo real de `metaDescription` por superar 160 caracteres. La traducción ahora acota localmente meta title y meta description por frontera de palabra antes de persistir, y las respuestas estructuralmente inválidas muestran un error editorial estable en vez del array interno de Zod.
**Decisiones:** La normalización solo toca metadata SEO; no recorta cuerpo, claims, enlaces ni fuentes. El prompt mantiene los límites como instrucción y el servidor los garantiza sin una segunda llamada al proveedor.
**Pendientes/bugs:** Crear PR, verificar Preview por SHA y completar Code Review antes de integrar.
**Archivos tocados:** `server/blog/translation/provider.ts`, `tests/blog-translation.test.mjs`, `_arnes/DECISIONES.md`, `_arnes/BITACORA.md`.
**Evidencia:** Prueba focalizada de traducción 4/4 PASS; suite completa 129/129 PASS; TypeScript PASS; db:verify 5 migraciones/112 statements PASS; build 87/87 y budgets PASS; E2E admin local desktop/móvil 2/2 PASS con 2 skips deliberados por perfil y sin errores inesperados.

## 2026-08-04 Codex - normalización determinista de enlaces del gemelo
**Qué se hizo:** Un reintento productivo para el post publicado EN `depression-follow-up-when-symptoms-improve-unevenly` falló con `Translation removed source links: /services`. El contrato podía aceptar que el proveedor retuviera `/services` y después exigir `/es/servicios`, produciendo un falso "removed". El mapa autorizado se aplica ahora antes y después del proveedor.
**Decisiones:** Solo se reemplazan coincidencias exactas de `href` presentes en `linkMap`. Si la IA elimina realmente el anchor o inventa una URL, la traducción sigue rechazándose completa; el post fuente y cualquier publicación existente permanecen intactos.
**Pendientes/bugs:** Crear PR, verificar Preview exacta, completar Code Review y Production antes de pedir un nuevo Retry.
**Archivos tocados:** `server/blog/translation/provider.ts`, `tests/blog-translation.test.mjs`, `_arnes/DECISIONES.md`, `_arnes/BITACORA.md`.
**Evidencia:** Prueba focalizada 4/4 PASS; suite 129/129 PASS; TypeScript PASS; db:verify 5 migraciones/112 statements PASS; build 87/87 y budgets PASS; E2E admin local desktop/móvil 2/2 PASS con 2 skips deliberados por perfil y sin errores inesperados.

## 2026-08-04 Codex - invalidación inmediata del archivo al publicar
**Qué se hizo:** Se confirmó en vivo que la API ES devolvía dos posts publicados y el detalle del nuevo sibling respondía 200, mientras `/es/blog` seguía renderizando solo ansiedad. El archivo conserva una caché de cinco minutos que la acción de publicar no invalidaba.
**Decisiones:** Publicar, despublicar o borrar un post publicado expira inmediatamente `public-blog-index`; el TTL de 300 segundos queda solo como respaldo. Se invalida el tag compartido para cubrir EN/ES, categorías y páginas sin mantener una lista frágil de rutas.
**Pendientes/bugs:** Crear PR, verificar Preview exacta, completar Code Review y Production.
**Archivos tocados:** ruta admin Next, contrato unitario, decisiones y bitácora.
**Evidencia:** Diagnóstico productivo: API ES 2 published; detalle 200; SSR/browser del archivo solo 1. Corrección: 130/130 tests, TypeScript, db:verify 5 migraciones/112 statements, build 87/87 y budgets PASS; E2E archivo + admin local desktop/móvil 4 PASS con 2 skips deliberados por perfil y sin errores inesperados.

## 2026-08-04 Codex - confirmación de la causa y recuperación por TTL
**Qué se hizo:** Se ejecutó `getBlogArchive` contra Neon Production en modo lectura y devolvió los dos posts ES en el orden correcto: ansiedad como featured y depresión como tarjeta regular. Tras expirar la ventana existente, una respuesta fresca de `/es/blog` (`X-Vercel-Cache: MISS`) incluyó el slug nuevo y Chrome confirmó visualmente el título.
**Decisiones:** El incidente no fue un estado editorial incorrecto ni un bug de featured/grid. Fue una demora de visibilidad causada por no invalidar la caché de datos al cambiar el estado publicado. Se conserva el TTL como respaldo, pero el publish gate debe invalidarlo inmediatamente.
**Pendientes/bugs:** PR #26 sigue draft hasta Quality, E2E de Preview contra SHA exacto y clasificación final de todas las notas de Code Review. No se fusiona basándose solo en que el TTL haya recuperado Production.
**Archivos tocados:** bitácora; sin mutaciones de datos ni configuración.
**Evidencia:** DB ES `total=2`, ids 2 y 12; SSR productivo contiene `seguimiento-depresion-cuando-sintomas-mejoran-desigualmente`; Chrome recargado contiene `Qué Revisar Cuando los Síntomas de Depresión Mejoran de Manera Desigual`.

## 2026-08-04 Codex - endurecimiento del E2E de Preview protegido
**Qué se hizo:** La primera corrida desplegada reveló que el archivo fixture no reutilizaba la autenticación de Preview del admin y que dos conteos se ejecutaban antes de asentarse la navegación. Se extrajo un helper común, limitado al origin exacto de Healing Minds y sin seguir redirects; los clics de página esperan URL y estado visible antes de contar.
**Decisiones:** Las credenciales de Preview nunca se configuran como headers globales porque podrían viajar a terceros. El teardown ignora solo callbacks cancelados al cerrar la página; errores durante el recorrido siguen fallando el test.
**Pendientes/bugs:** Repetir suite completa y E2E contra el Preview del SHA que incluya este gate, no solo contra el deployment anterior usado para desarrollar el test.
**Archivos tocados:** helper E2E de Preview, archivo E2E, admin bilingüe E2E, contrato del gate y bitácora.
**Evidencia:** contrato focalizado 8/8 PASS; Preview desktop/móvil archivo + admin 4 PASS y 2 skips deliberados, sin errores inesperados.

## 2026-08-04 Codex - clasificación Code Review PR #26, ronda 1
**Qué se hizo:** Se leyó la revisión de Vercel Agent sobre `main` y HEAD `87b68c2`. Una nota señaló que el helper devolvía temprano sin `E2E_BASE_URL` y perdía `x-e2e-blog-fixtures` en ejecuciones locales.
**Clasificación:** 1 válida; 0 inválidas; 0 ya resueltas; 0 no aplica; 0 requieren decisión. Se aplica el header no secreto directamente solo en local; las credenciales de Preview continúan limitadas al origin exacto.
**Pendientes/bugs:** Repetir local E2E, gates, Preview exacta y una nueva lectura completa de notas después del push.
**Archivos tocados:** helper E2E y bitácora.
**Evidencia:** Pendiente al registrar la clasificación.

## 2026-08-04 Codex - cierre local de la nota válida PR #26
**Qué se hizo:** Se corrigió el helper y se ejecutó el HEAD aislado en puerto 3101 porque 3100 pertenecía a otro worktree. El primer intento aislado heredó `VERCEL_ENV=production` del env descargado y el fixture se cerró correctamente con 404; al arrancar el mismo build como development, el recorrido completo pasó.
**Decisiones:** No se detuvo ni modificó el servidor ajeno de 3100. El proceso temporal de 3101 fue verificado por ruta de worktree y detenido al terminar. Los fixtures permanecen inaccesibles en Production por diseño.
**Pendientes/bugs:** Push, nueva Preview por SHA, E2E desplegado y nueva ronda completa de Code Review.
**Archivos tocados:** bitácora; helper ya corregido en la entrada anterior.
**Evidencia:** E2E local aislado archivo + admin desktop/móvil: 4 PASS, 2 skips deliberados, cero errores inesperados.

## 2026-08-17 Codex - paridad editorial de imágenes EN/ES y límite SEO único
**Qué se hizo:** Se reprodujeron dos causas distintas. El sibling heredaba solo la imagen seleccionada al crearse —normalmente el stock— y no podía incorporar las aprobadas después en el idioma fuente. Además, el traductor aceptaba 70 caracteres de meta title aunque el PUT estricto acepta 60. El admin incorpora una acción explícita para copiar hero e inline aprobadas desde el hermano, reconstruir alt/caption y anchors en el idioma destino y guardar cada Blob bajo una clave propia. Traducciones nuevas y borradores legacy abiertos se normalizan a 60/160 antes de guardar.
**Decisiones:** No hay propagación silenciosa ni gasto nuevo de imagen. Los assets curados pueden compartir URL estable; los AI gestionados nunca comparten una fila/objeto borrable entre posts. La copia es solo para draft, atómica, protegida contra cambios concurrentes y con cleanup durable si Blob y DB no pueden completar juntos. El límite de 70 del traductor queda reemplazado por el contrato compartido de 60 de editor/API/SEO.
**Pendientes/bugs:** Publicar el HEAD en PR draft, esperar Preview exacta, ejecutar el E2E desplegado por SHA y clasificar todas las notas vigentes de Code Review. No mergear, desplegar manualmente ni modificar variables de entorno desde esta tarea.
**Archivos tocados:** provider de traducción, servicio/storage/rutas de imágenes Next y legacy, admin UI, E2E y contratos unitarios, metodología bilingüe/visual, decisiones, evidencia y bitácora.
**Evidencia:** TypeScript PASS; 134/134 unitarios PASS; `db:verify` 5 migraciones/112 statements/20 tablas/23 FKs PASS; image guard PASS; build 87 páginas estáticas y budgets 669.5/750 KiB + 778.4/850 KiB PASS; Playwright focalizado final 2 PASS/2 skips de perfil y matriz completa 78 PASS/8 skips, sin fallos. La primera fixture emitió un 404 de su stock simulado y el gate falló correctamente; se sirvió la fixture sin relajar el detector y la matriz final quedó limpia.

## 2026-08-17 Codex - sincronización automática de imágenes entre gemelos
**Qué se hizo:** Se sustituyó el paso manual de reutilizar imágenes por un contrato automático y bidireccional. Al crear el sibling, seleccionar hero/inline, quitar un inline o abrir una pareja legacy desalineada, el conjunto aprobado aparece en el borrador hermano sin regenerar. La UI ya no muestra el botón manual y explica que la sincronización no crea otro gasto de imagen.
**Decisiones:** La aprobación humana sigue siendo la selección del candidato; no se promocionan candidatos solos. La reconciliación elige de forma determinista el conjunto aprobado más completo para reparar pares antiguos; si ambos conjuntos tienen la misma prioridad, manda el lado ya revisado o publicado y, entre dos drafts, el artículo creado primero. Solo escribe sobre un destino `draft`: pending review y published nunca se modifican silenciosamente. Los Blobs AI continúan copiándose a claves propias del destino; la equivalencia usa checksum, no una fila ni objeto borrable compartido.
**Pendientes/bugs:** Crear PR draft, esperar Preview del SHA exacto, correr el E2E desplegado y clasificar cada nota de Code Review antes de cualquier merge. No se hizo deploy ni se cambió Vercel/Neon.
**Archivos tocados:** servicio/storage/rutas de imágenes Next y legacy, workflow de traducción, admin UI, unitarios/E2E, metodología bilingüe/visual, decisiones, evidencia y bitácora.
**Evidencia:** TypeScript PASS; 135/135 unitarios PASS; `db:verify` 5 migraciones/112 statements/20 tablas/23 FKs PASS; image guard PASS; build 87 páginas y budgets 669.5/750 KiB + 778.4/850 KiB PASS; Playwright focalizado 4 PASS/4 skips y matriz completa 80 PASS/10 skips en Desktop Chrome y Pixel 7, sin fallos ni requests inesperadas de generación; `git diff --check` PASS.

## 2026-08-17 Codex - Preview y Code Review inicial del PR #28
**Qué se hizo:** Se publicó la rama `fix/bilingual-image-auto-sync` como PR draft #28. Vercel construyó el Preview del SHA `40d472202b61b3c6b22db158ea228e1bf1e13001` en el proyecto y equipo oficiales. El primer E2E desplegado fue redirigido al login de Vercel porque no había credencial local; se repitió con un token OIDC efímero emitido por el proyecto y el recorrido bilingüe pasó.
**Clasificación Code Review:** 0 notas válidas, 0 inválidas, 0 ya resueltas, 0 no aplicables y 0 que requieran decisión. Solo existía el comentario operativo de Vercel.
**Decisiones:** Un redirect de Deployment Protection no se presenta como fallo de la app. No se descargó, leyó ni imprimió ningún secreto y no se cambió ninguna variable; el token efímero solo vivió en el proceso de prueba.
**Pendientes/bugs:** Este registro documental crea un nuevo HEAD; repetir Preview por SHA exacto, E2E desplegado y lectura completa de Code Review antes del cierre. No mergear ni promover a Production.
**Archivos tocados:** bitácora.
**Evidencia:** Vercel deployment `dpl_CS3oGb6ATX6c4VbKHynywoZQ3X5D` READY, Preview, proyecto `healing-minds-psychiatry-nextjs`, equipo `inpulzasolutions-6847s-projects`, SHA exacto `40d4722`; E2E desplegado 4 PASS/4 skips en Desktop Chrome y Pixel 7, sin errores inesperados después del bypass OIDC seguro.

## 2026-08-17 Codex - paridad del set visual completo EN/ES
**Qué se hizo:** Se precisó el requisito con la evidencia del editor: “las mismas fotos” incluye no solo hero/inline ya seleccionados, sino también cada variante AI completada que todavía aparece como `candidate`. La reconciliación automática copia ahora el set visible completo al sibling draft en ambos sentidos y la UI confirma el set completo sin botón ni regeneración.
**Decisiones:** Una candidata copiada conserva estado `candidate`; verla en el otro idioma no la aprueba ni la publica. Selecciones y colocaciones inline siguen sincronizadas, mientras cada candidata continúa bajo revisión humana. Los Blobs AI se duplican bajo claves propias del post destino y las variantes rechazadas no se reintroducen.
**Pendientes/bugs:** Publicar este nuevo HEAD en el PR draft #28, verificar el Preview exacto, repetir E2E desplegado y releer Code Review. No mergear ni promover a Production.
**Archivos tocados:** servicio de imágenes, admin UI, E2E/contrato unitario, documentación bilingüe/visual, decisiones, evidencia y bitácora.
**Evidencia local:** TypeScript PASS; 135/135 tests PASS; `db:verify` 5 migraciones/112 statements/20 tablas/23 FKs PASS; image guards PASS; build 87 páginas y budgets 669.5/750 KiB + 778.4/850 KiB PASS; Playwright focalizado 4 PASS/4 skips en Desktop Chrome y Pixel 7, incluyendo una candidata hero visible en el hermano y cero requests de generación.

## 2026-08-17 Codex - hotfix posterior al Code Review tardío de PR #28
**Qué se hizo:** PR #28 se integró después de Quality, Preview, E2E desplegado y una lectura sin hilos. Ocho minutos después del merge llegó una revisión tardía con siete observaciones reproducibles. Se preparó un hotfix separado: permite sets formados solo por candidatos; vuelve a reconciliar al completar el job; propaga la eliminación al sibling draft para que no reaparezca; guarda selecciones y candidatos en una sola transacción; hidrata checksums de Blobs legacy; limpia `featuredImage` si el set autoritativo no tiene hero; y conserva el slot original, por ejemplo `inline:2`, al quitar otro inline.
**Clasificación Code Review:** 7 válidas; 0 inválidas; 0 ya resueltas; 0 no aplicables; 0 que requieran decisión. Todas las válidas quedaron corregidas en la rama `fix/bilingual-image-sync-review`.
**Decisiones:** El borrado físico sigue después del commit y usa la cola durable. Si falla la sincronización previa del sibling, se revierte el claim de borrado y el Blob fuente permanece. El destino solo puede ser `draft`; no se reescribe una versión publicada ni en revisión. La reconciliación terminal del navegador no lanza otra generación de IA.
**Pendientes/bugs:** Crear PR hotfix, verificar Preview por SHA exacto, esperar la revisión tardía y solo integrar si Quality, E2E y todos los hilos quedan limpios.
**Archivos tocados:** storage/servicio de imágenes, editor admin, E2E y contrato unitario, decisiones, evidencia y bitácora.
**Evidencia local:** TypeScript PASS; prueba focalizada 4/4 PASS; suite completa 135/135 PASS; `db:verify` 5 migraciones/112 statements/20 tablas/23 FKs PASS; image guards PASS; build 87 páginas y budgets 669.5/750 KiB + 778.4/850 KiB PASS; Playwright focalizado 6 PASS/6 skips deliberados por perfil en Desktop Chrome y Pixel 7, sin errores inesperados; `git diff --check` PASS.

## 2026-08-17 Codex - Preview exacto del hotfix PR #29
**Qué se hizo:** La rama del hotfix se publicó como PR draft #29. Vercel construyó el SHA exacto `db7f4c698a57ea66e3231d85b153cec6bca7bf68` en el proyecto/equipo oficiales y el recorrido bilingüe completo se repitió sobre ese Preview protegido.
**Decisiones:** El token OIDC fue efímero y limitado a la ejecución; no se leyó, imprimió ni persistió. El PR continúa draft hasta registrar esta evidencia, repetir el Preview sobre el HEAD documental y completar Quality y Code Review, incluida una espera suficiente para revisiones tardías.
**Pendientes/bugs:** Push documental final, nuevo Preview por SHA, E2E desplegado, marcar ready y cerrar todos los hilos antes de integrar.
**Archivos tocados:** bitácora y evidencia.
**Evidencia:** deployment `dpl_48oxLAoEYsCAh4Lq6rSF5egpCg4r` READY, Preview, proyecto `healing-minds-psychiatry-nextjs`, equipo `inpulzasolutions-6847s-projects`, rama `fix/bilingual-image-sync-review`, creador Vercel `inpulzasolutions-6847`; Playwright desplegado 6 PASS/6 skips cruzados en Desktop Chrome y Pixel 7, sin errores inesperados y con comprobación de SHA exacto.

## 2026-08-17 Codex - clasificación Code Review PR #29, ronda 1
**Qué se hizo:** La revisión de Codex sobre `b2b43ac95540fe08d97401d03c6f2bf8976c080d` terminó después de 11m33s y señaló cuatro casos reproducibles. El formulario toma ahora el `null` autoritativo de portada sin conservar la URL anterior; un job terminal espera y reintenta si ya existe una reconciliación en curso; las filas `rejected/deletion_pending` se excluyen de la hidratación legacy para que un Blob ya ausente no bloquee su limpieza; y cada fila target queda reservada una sola vez para que una colisión de checksum no convierta la selección en candidata.
**Clasificación:** 4 válidas; 0 inválidas; 0 ya resueltas; 0 no aplicables; 0 que requieran decisión. Las cuatro válidas se corrigieron y se añadieron recorridos de navegador específicos.
**Decisiones:** El job no se marca manejado mientras una reconciliación del mismo par siga pendiente; al terminar, la dependencia `isPending` reactiva el efecto exactamente una vez. La colisión válida entre una seleccionada y una candidata con el mismo checksum conserva dos filas target distintas y ambos estados editoriales. Una candidata ya rechazada no necesita descargar su objeto para sincronizar su ausencia.
**Pendientes/bugs:** Push, Preview/Quality/E2E del nuevo SHA y una segunda ronda completa de Code Review; resolver los cuatro hilos cuando el HEAD que los corrige quede verificable.
**Archivos tocados:** servicio de imágenes, editor admin, E2E, contrato unitario, evidencia y bitácora.
**Evidencia local:** TypeScript PASS; 135/135 tests PASS; `db:verify` e image guards PASS; build 87 páginas y budgets 669.5/750 KiB + 778.4/850 KiB PASS; Playwright focalizado 12 PASS/12 skips cruzados en Desktop Chrome y Pixel 7, cubriendo solapamiento, hero nulo, borrado bilingüe, colisión de checksum, EN→ES y ES→EN; `git diff --check` PASS.
