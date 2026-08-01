# Code Review de analítica, consentimiento y SEO - 2026-07-31

## Hallazgos corroborados

- Los clics de reserva CharmHealth emitían TikTok/Clarity, pero no siempre la
  conversión recomendada `generate_lead` de GA4.
- Una conversión podía ocurrir mientras `gtag` existía como cola pero antes de
  que GA tuviera destino. La cola JavaScript añadida inicialmente tampoco era
  segura ante una navegación externa en la misma pestaña.
- La aplicación comprobaba `VITE_GA_MEASUREMENT_ID`, variable histórica de
  Replit/Vite, aunque el runtime Next usa `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- La retirada de consentimiento intentaba borrar cookies en
  `.www.healingmindsp.com` y omitía cookies publicitarias `_gcl_*`.
- El banner `z-50` quedaba debajo del widget de telehealth `z-[9998]`.
- Clarity y TikTok registraban listeners de consentimiento en cada componente
  que usaba sus hooks.
- El banner mencionaba Facebook Pixel sin existir un ID verificado y la política
  no documentaba TikTok.
- La home mantenía dos `h1` simultáneos en el DOM, ocultos solo por CSS según
  viewport.

## Correcciones aplicadas

- Google Consent Mode se encola primero; a continuación se encola el destino
  `G-WMRK41PX2E` y solo después los eventos. La carga de red sigue siendo async,
  pero una salida de página ya no depende de memoria pendiente.
- Todos los enlaces `tel:`, `mailto:`, `wa.me` y CharmHealth tienen una red de
  seguridad delegada. Los botones que ejecutan `window.open` registran el lead
  antes de salir. Una deduplicación corta evita que el handler explícito y el
  delegado cuenten el mismo clic dos veces.
- El build de Vercel falla si el ID público falta, cambia o usa el ID incorrecto
  conocido `G-42LWDS101X`.
- La limpieza de cookies cubre host y dominio canónico, incluidos `_ga_*`,
  `_gcl_*`, Clarity y las cookies first-party de TikTok. TikTok recibe además
  `revokeConsent()`; su cookie de tercero no se presenta como borrable desde la
  web.
- Cada runtime conserva un solo dueño del ciclo de consentimiento: el shell
  real de Next (`PublicRuntime`) y el `App` legacy. Los demás usos del hook
  conservan únicamente las APIs de eventos.
- Banner y diálogos están por encima de widgets flotantes. El texto y la
  política reflejan Google Ads, Clarity y TikTok, sin reclamar Meta Pixel.
- El título visible de cada layout intercambia dinámicamente `h1/p`; la home
  queda con un único `h1` visible tanto en desktop como en móvil.

## Verificación local

- TypeScript: PASS.
- Guard de pageviews, conversiones, tags y cobertura de CTAs: PASS.
- Chromium real 4/4: limpieza host/root y domain-scoped de Preview PASS, rechazo persistido limpia cookies
  heredadas, y Google `config` precede a un solo `generate_lead` aunque el
  handler explícito y el delegado usen ubicaciones distintas. La cookie TikTok
  third-party permanece correctamente fuera del control del sitio.
- Suite integrada: 76/76 PASS.
- Build Next con `G-WMRK41PX2E`: 89/89 rutas PASS.

## Pendiente antes de merge

- Publicar el SHA y comprobar el deployment Preview exacto.
- Ejecutar aceptar, preferencias, revocar y reaceptar en el Preview real,
  observando cookies y requests de Google, Clarity y TikTok.
- Clasificar el Code Review exacto del último SHA y obtener GO del juez
  independiente.
- Añadir el ID validado a Production solo después del Preview. Confirmar la
  importación de `generate_lead` dentro de Google Ads por la ruta nativa GCC;
  el código no puede demostrar el estado de esa cuenta.

El juez independiente dio GO local final: build 89/89, revocación + 6,5 s con
cero cookies first-party de proveedores y carrera revocar/reaceptar a 500 ms
sin borrado tardío de cookies consentidas; consola 0 errores y 0 warnings.

## Incidencia del Preview exacto `4f13daf`

El deployment READY `dpl_5xsWsAKDvZuT4Tw3MwS7mSJVQWUm` demostró que Google y
TikTok crean cookies con `Domain=.<hostname-preview>`. El evento de rechazo sí
llegaba y el estado persistido quedaba denegado, pero la limpieza solo expiraba
host-only y el root canónico de producción. `getCookieDomains()` incluye ahora
el hostname actual exacto y su forma dotted; no asciende a `vercel.app` ni a
ningún padre. En `*.healingmindsp.com` conserva además el root canónico.

El auditor barre el lazy footer hasta montarlo, registra el último evento de
consentimiento y examina dominio/path reales desde el contexto del navegador.
El juez dio GO a la corrección: Chromium 4/4, TypeScript, guard y diff-check
PASS. La suite integrada quedó 76/76 y el build 89/89.

## Incidencia de primer Preview

El deployment de `802efab` falló antes del build porque `.vercelignore`
excluía toda la carpeta `scripts/`, incluido el nuevo guard invocado por
`package.json`. La variable Preview sí existía. Se restringió la exclusión para
que Vercel reciba únicamente `scripts/verify-public-analytics-config.mjs`; el
resto del tooling sigue fuera del bundle de deployment.

## Clasificación del juez independiente sobre `a5c0c88`

- **P1 válida, CodeX `3693973816`:** el runtime real de Vercel es
  `app/public-shell.tsx`; allí los
  hooks seguían con `manageConsentLifecycle=false`. `client/src/App.tsx` era el
  shell heredado y el guard lo comprobaba por error. Resuelto activando el
  lifecycle en `PublicRuntime` y moviendo la aserción al shell Next real.
- **P1 válida, CodeX `3693973820`:** el handler explícito y el delegado podían describir un mismo
  clic con `click_location` distinta y escapar la deduplicación. Resuelto con
  una ventana corta por tipo de conversión. El test Chromium ahora instala el
  delegado, dispara un clic DOM real y usa ubicaciones distintas en ambas rutas.
- **P2 válida por auditoría complementaria:** el banner decía que las
  preferencias podían cambiarse en cualquier momento, pero no existía un acceso
  persistente tras la primera decisión. El footer abre de nuevo el gestor desde
  todas las páginas públicas en EN/ES.
- **P2 válida:** una carga inicial con consentimiento guardado como rechazado no
  limpiaba cookies heredadas si los proveedores aún no se habían inicializado
  en esa sesión. GA limpia `_ga/_gcl` durante `initGA`; los lifecycle owners de
  Clarity/TikTok ejecutan su revocación/limpieza también en el camino inicial
  denegado.
- **P2 válida:** al simplificar `trackServicePageView` se conservaron los maps
  `custom_1/custom_2` pero dejaron de enviarse los valores. Se restauran
  `serviceName` y `language` bajo el mismo gate de consentimiento/configuración.
- **P2 válida, elevada a bloqueante por reproducción E2E:** TikTok también crea
  cookies first-party `ttcsid`, `ttcsid_<pixel>` y `ttclid`. Las dos primeras
  sobrevivían a la revocación real y el SDK las recreaba después de la limpieza
  síncrona. La lista usa exactos y prefijo, conserva los nombres legacy y ejecuta
  un barrido acotado de seis segundos que se cancela si el usuario reacepta. La
  auditoría espera al final de esa ventana antes de exigir que desaparezcan.
  Referencia primaria: documentación oficial de cookies del TikTok Pixel.
- **P2 válida de CodeX `3693973822`:** el único `h1` literal estaba dentro de la rama desktop
  oculta en móvil, mientras el título visible móvil era un párrafo. Dos tags
  responsive intercambian `h1/p` según viewport, manteniendo exactamente un H1
  y haciendo que corresponda siempre al título visible.
- **P1 válida de CodeX `3693973825`:** subir el overlay del componente Dialog compartido
  dejaba portales hijos como Select (`z-50`) debajo del overlay. El Dialog vuelve
  a su stacking original y acepta `overlayClassName`; solo el modal de cookies,
  que no contiene portales hijos, usa 10001/10002 sobre el widget 9998.
