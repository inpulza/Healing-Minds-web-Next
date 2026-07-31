# Code Review clínico y horarios — 2026-07-31

## Alcance

Revisión focalizada de claims clínicos, licencia de California, rutas legales y horarios sobre `origin/main` (`8dca5ee`).

## Evidencia y decisiones

- **Licencia de California — resuelto/corroborado.** El registro oficial de California DCA muestra a `REVE URGELLES, MELVA`, licencia `A 198275`, como `License Renewed & Current`, con vencimiento el 31 de octubre de 2026. No se modifica el claim de licencia.
- **Board certification — válido.** Las búsquedas públicas en ABPN VerifyCERT por `Melva Reve Urgelles`, `Melva Urgelles` y `Melva Reve` no devolvieron coincidencias. ABPN advierte que una ausencia en el buscador no demuestra que el profesional no esté certificado. Por prudencia YMYL se elimina el claim público hasta contar con verificación documental oficial; no se afirma que sea falso.
- **Rutas legales y California — resuelto.** Las rutas EN/ES existen en el manifiesto Next, las páginas de California se mantienen `noindex` y fuera del sitemap.
- **Horarios — válido.** Nueve páginas de ubicación prometían atención los sábados con cita, mientras contacto, correo, emergencia y schema indican fines de semana cerrados. Se unifican las nueve páginas a sábado y domingo cerrados.
- **Disponibilidad de Immokalee — válido tras Code Review.** CodeX detectó que la fuente hiperlócal y el FAQ todavía prometían telesalud por la tarde, fines de semana o adaptada al horario agrícola. Se sustituyeron esos claims por disponibilidad entre semana dentro del horario publicado de lunes a viernes, 8:00 AM–5:00 PM, y se añadió un guard específico para las fuentes renderizadas.
- **Metadatos SEO de Immokalee — válido en verificación del preview.** El HTML visible ya estaba corregido, pero `shared/seo-manifest.json` seguía publicando “evening telehealth” en description, Open Graph y Twitter para EN, además de “telesalud por la tarde” en ES. Se alinearon las seis descripciones y el manifiesto SEO se incorporó al guard.

## Fuentes oficiales

- California DCA: https://search.dca.ca.gov/details/8002/A/198275/74d0a71e0dc9bf82a8ba3460ff18a948
- ABPN VerifyCERT: https://verifycert.abpn.org/verifycert/
- ABPN FAQ: https://www.abpn.com/faq/how-can-i-determine-if-my-doctor-is-board-certified/

## Seguridad editorial

No se modifican diagnósticos, tratamientos, promesas clínicas ni datos de pacientes. La retirada del claim de junta queda sujeta a revisión humana de Healing Minds.

## Guard automático

`tests/clinical-content-guards.test.mjs` impide reintroducir el claim no corroborado en el consentimiento, verifica que las nueve páginas mantengan sábado y domingo cerrados en EN/ES y bloquea nuevas promesas de tardes, fines de semana o adaptación al horario agrícola en la sección Immokalee, su FAQ y sus metadatos SEO.

Validación final tras corregir la nota P1: guard focalizado PASS 3/3; suite integrada PASS 61/61; TypeScript PASS; verificación de base de datos PASS (2 migraciones, 95 statements, 18 tablas, 20 foreign keys); build Next PASS con 89/89 páginas.
