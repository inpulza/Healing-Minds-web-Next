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
