# Code Review de analítica y SEO — 2026-07-31

## Hallazgos corroborados

- Los clics de reserva CharmHealth emitían TikTok/Clarity, pero no la conversión recomendada `generate_lead` de GA4.
- Una conversión podía ocurrir mientras `gtag` existía como cola de Consent Mode pero antes de que GA tuviera un destino configurado; ese evento podía perderse.
- La home mantenía dos `h1` simultáneos en el DOM, ocultos solo por CSS según viewport.

## Correcciones

- Todas las variantes CharmHealth, la barra móvil y el footer emiten `appointment_booking`.
- Las conversiones consentidas se retienen en una cola acotada hasta `gtag('config')`; se vacían al revocar consentimiento.
- El título móvil conserva su aspecto pero pasa a párrafo; la home queda con un único `h1`.

## Hallazgos ya resueltos

- El pageview GA usa un único emisor manual con `send_page_view:false`, espera configuración y deduplica rutas.
- TikTok comparte dedupe global entre montajes.
- Canonical y robots se sincronizan por la ruta actual; California permanece noindex.
