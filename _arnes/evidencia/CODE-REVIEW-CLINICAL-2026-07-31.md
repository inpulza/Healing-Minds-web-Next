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
- **Elegibilidad de menores — válido tras juez independiente.** Immokalee y otras ubicaciones, Golden Gate, el índice y el componente compartido de servicios, Naples y About todavía presentaban atención a teens/adolescentes, mientras Telehealth Consent, Medical Disclaimer y el servicio de TDAH limitan la práctica a adultos de 18 años en adelante. Se hizo una corrección sistémica de todas las ofertas clínicas EN/ES y se añadió un guard adult-only que incluye el componente renderizado en `/services` y `/es/servicios`.
- **Variantes pediátricas y límite inclusivo de edad — válidos tras Code Review final.** El guard no reconocía ofertas adjetivales comunes como `pediatric care`, `child psychiatry`, `atención pediátrica` o `psiquiatría infantil`; se ampliaron los patrones y fixtures EN/ES. El FAQ de TDAH decía `over 18` / `mayores de 18`, excluyendo a pacientes de exactamente 18 años; se corrigió a `18 and older` / `de 18 años en adelante` y se añadió un bloqueo de regresión para límites exclusivos en singular, plural y variantes equivalentes EN/ES.

## Fuentes oficiales

- California DCA: https://search.dca.ca.gov/details/8002/A/198275/74d0a71e0dc9bf82a8ba3460ff18a948
- ABPN VerifyCERT: https://verifycert.abpn.org/verifycert/
- ABPN FAQ: https://www.abpn.com/faq/how-can-i-determine-if-my-doctor-is-board-certified/

## Seguridad editorial

No se modifican diagnósticos, planes terapéuticos ni datos de pacientes. Las promesas de disponibilidad y elegibilidad se corrigen únicamente para que coincidan con las políticas públicas de Healing Minds. La retirada del claim de junta queda sujeta a revisión humana de Healing Minds.

## Guard automático

`tests/clinical-content-guards.test.mjs` impide reintroducir el claim no corroborado en el consentimiento, verifica que las nueve páginas mantengan sábado y domingo cerrados en EN/ES, bloquea nuevas promesas de tardes, fines de semana o adaptación al horario agrícola en Immokalee y exige que las fuentes clínicas revisadas, los FAQ y el manifiesto SEO no ofrezcan servicios a teens, adolescentes, niños, menores, pacientes pediátricos ni pacientes de todas las edades. También reconoce variantes adjetivales EN/ES y bloquea límites exclusivos como `over 18` o `mayores de 18`. Las fuentes que sí publican ofertas clínicas deben contener adultos 18+ en EN y ES; el detector incluye fixtures negativos y contextos permitidos para no bloquear referencias comunitarias, históricas o el FAQ que rechaza menores.

Validación final tras todos los hallazgos: guard focalizado PASS 4/4; suite integrada PASS 62/62; TypeScript PASS; verificación de base de datos PASS (2 migraciones, 95 statements, 18 tablas, 20 foreign keys); build Next PASS con 89/89 páginas.
