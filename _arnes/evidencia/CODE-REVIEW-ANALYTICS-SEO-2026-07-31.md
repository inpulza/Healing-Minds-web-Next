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
- Solo `App` gestiona los ciclos de consentimiento de Clarity y TikTok; los
  demás usos del hook conservan únicamente las APIs de eventos.
- Banner y diálogos están por encima de widgets flotantes. El texto y la
  política reflejan Google Ads, Clarity y TikTok, sin reclamar Meta Pixel.
- El título móvil conserva su aspecto pero pasa a párrafo; la home queda con un
  único `h1`.

## Verificación local

- TypeScript: PASS.
- Guard de pageviews, conversiones, tags y cobertura de CTAs: PASS.
- Chromium real: limpieza host/root PASS; cookie TikTok third-party permanece
  correctamente fuera del control del sitio; Google `config` precede a un solo
  `generate_lead` con beacon.
- Suite integrada: 74/74 PASS.
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

## Incidencia de primer Preview

El deployment de `802efab` falló antes del build porque `.vercelignore`
excluía toda la carpeta `scripts/`, incluido el nuevo guard invocado por
`package.json`. La variable Preview sí existía. Se restringió la exclusión para
que Vercel reciba únicamente `scripts/verify-public-analytics-config.mjs`; el
resto del tooling sigue fuera del bundle de deployment.
