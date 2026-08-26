# Healing Minds Psychiatry: piloto de alertas web por WhatsApp

Estado: preparado, apagado y sin envíos reales. La activación requiere aprobación de Jordan, plantilla `APPROVED`, receptor de prueba confirmado, migración aplicada y preflight exitoso.

## Inventario verificable de formularios

| Formulario | Superficie e idioma | Componente | Endpoint activo | Validación y antispam | Canal principal y almacenamiento | Comportamiento final |
|---|---|---|---|---|---|---|
| Contact | `/contact` y `/es/contacto`, responsive desktop/mobile | `client/src/components/Contact.tsx` | `POST /api/contact` en `app/api/contact/route.ts` | Campos HTML requeridos, validación de email en cliente, Zod en servidor, teléfono requerido, rate limit por IP/email, cuatro honeypots, mínimo de 2 s, dominio DNS, teléfono ficticio y texto/nombre ilegible | UUID real en `contact_messages` de Neon; después intenta email interno y confirmación por Resend | Éxito después de persistir. Spam recibe `202 filtered` sin guardar ni alertar. Fallo de email no revierte el lead. |
| Consultation modal | Toolbar móvil en todas las rutas públicas, incluida navegación EN/ES | `client/src/components/ContactFormModal.tsx`, abierto por `MobileToolbar.tsx` | El mismo `POST /api/contact`, con contrato cerrado `formKey=consultation_modal` | Las mismas comprobaciones de cliente y servidor; el reloj antispam se reinicia al abrir | El mismo `contact_messages` de Neon y el mismo flujo de email | Éxito después de persistir y cierre del modal. Un fallo de Zernio no cambia el resultado. |

Los formularios administrativos de login y edición del blog no generan leads y quedan fuera. Los botones de teléfono, WhatsApp y CharmHealth son enlaces/salidas a canales externos, no formularios procesados por esta web. La ruta `server/routes.ts` pertenece al runtime Express/Replit histórico y no es el endpoint de producción Next.js; no se conecta al piloto.

## Arquitectura del piloto

No se encontró un gateway central de alertas disponible dentro de la fuente de verdad de Healing Minds. Por la autorización expresa de este piloto, se usa temporalmente un adaptador directo de servidor a Zernio:

1. `/api/contact` valida, filtra spam y guarda el lead y su fila de outbox en una única transacción de Neon.
2. El correo actual se conserva como operación secundaria existente.
3. La fila de `web_alert_outbox` usa la clave única `healing-minds:<formKey>:<leadId>` y ya existe antes de responder al navegador.
4. Si el interruptor está apagado, la fila queda `disabled` y no existe ninguna llamada a Zernio.
5. Si está encendido, consulta primero la plantilla en Zernio. Solo un contrato exacto y `APPROVED` permite intentar el envío.
6. Zernio se procesa después de construir la respuesta del formulario. Un cron protegido recupera filas `pending` tras fallos transitorios de preflight, con máximo cinco intentos y espera mínima de cinco minutos.
7. El resultado queda `sent`, `failed`, `pending` o `unknown`. Los estados ambiguos `unknown` no se reintentan automáticamente. Ningún fallo cambia el éxito del formulario ya persistido.

La outbox no guarda nombre, teléfono, email ni nota. Conserva únicamente identificadores técnicos, estado, intentos, código de error seguro e identificador de mensaje de Zernio. El worker recupera los datos del lead desde la misma base solo durante el intento.

Excepción temporal: retirar la credencial directa de Healing Minds y migrar el adaptador al gateway central antes de incorporar un tercer cliente o, como máximo, el 26 de noviembre de 2026. El evento y la outbox están encapsulados para que esa migración no cambie los formularios.

## Plantilla exacta recomendada

- Nombre: `healing_minds_new_web_lead_v1`
- Categoría: `UTILITY`
- Idioma de Meta/Zernio: `en_US`
- Componentes: solo `BODY`; sin header, media ni botones
- Privacidad: `healthcare_operational`

Texto exacto para copiar:

```text
New Healing Minds Psychiatry web form received.

Name: {{1}}
Phone: {{2}}
Reason: {{3}}
Note: {{4}}

Call the client.
```

Orden cerrado de variables:

| Variable | Valor | Ejemplo ficticio |
|---|---|---|
| `{{1}}` | Nombre y apellido unidos en servidor | `Maria Example` |
| `{{2}}` | Teléfono enviado por el paciente | `+1 305 555 0134` |
| `{{3}}` | Razón fija resuelta en servidor | `Contact` o `Consultation` |
| `{{4}}` | Nota del paciente | `Please call tomorrow morning.` |

La plantilla cubre Contact EN/ES y Consultation modal EN/ES porque los cuatro parámetros existen y mantienen el mismo orden en ambos. El navegador no puede aportar nombre de plantilla, idioma, cuenta, tenant ni receptor.

## Variables de Vercel

Crear por separado en `Production` y `Preview`, todas server-only y sin prefijos públicos:

| Variable | Production | Preview |
|---|---|---|
| `ZERNIO_WHATSAPP_ENABLED` | `false` hasta aprobación y prueba | `false`; solo podría pasar a `true` con receptor interno de prueba de Inpulza |
| `ZERNIO_API_KEY` | Secreto de Zernio; no documentar valor | Secreto separado o el mismo solo si Jordan lo autoriza; nunca exponer valor |
| `ZERNIO_ACCOUNT_ID` | Cuenta WhatsApp empresarial de Inpulza conectada | Cuenta de prueba autorizada |
| `ZERNIO_RECIPIENT_E164` | WhatsApp interno confirmado de la clínica | Exclusivamente el número interno de prueba de Inpulza |
| `ZERNIO_API_BASE_URL` | Opcional; por defecto `https://zernio.com/api` | Igual |
| `ZERNIO_REQUEST_TIMEOUT_MS` | Opcional; por defecto `8000` | Igual |
| `CRON_SECRET` | Secreto generado por Vercel para autenticar el worker de reintentos | Secreto independiente o gestionado por Vercel; nunca exponer valor |
| `DATABASE_URL` | Ya requerido por el formulario y la outbox | Debe apuntar al esquema con la migración `0005` aplicada |

El nombre, la categoría, el idioma y el texto de plantilla no son variables de entorno: son constantes revisables en servidor. Así no pueden desviarse entre Preview y Production.

## Preflight obligatorio

Con variables server-only cargadas en una terminal segura:

```text
npm run zernio:preflight
```

El comando consulta `GET /v1/whatsapp/templates`, nunca imprime la API key ni el receptor, y falla si no coincide cualquiera de estos puntos:

- nombre `healing_minds_new_web_lead_v1`;
- estado `APPROVED`;
- categoría `UTILITY`;
- idioma `en_US`;
- texto exacto;
- cuatro parámetros en orden `BODY:1`, `BODY:2`, `BODY:3`, `BODY:4`;
- un único componente `BODY`, sin header, footer, media, botones ni variables extra.

El envío normal ejecuta el mismo preflight antes de cada alerta del piloto. Esto prioriza seguridad sobre una llamada adicional y puede migrarse después a un cache/gateway controlado.

## Datos que faltan de Jordan

- Confirmar que el idioma operativo interno será inglés `en_US`.
- Crear/enviar a aprobación la plantilla exacta y confirmar cuando figure `APPROVED`.
- Validar qué `ZERNIO_ACCOUNT_ID` corresponde al número empresarial de Inpulza.
- Proporcionar la API key únicamente en Vercel o en una terminal segura, nunca por chat/PR.
- Confirmar el número E.164 interno de prueba de Inpulza y, más adelante, el receptor interno de Healing Minds con consentimiento.

La migración `0005_durable_web_alert_outbox.sql` ya se aplicó de forma aditiva al Neon compartido por Preview/Production el 26 de agosto de 2026. No activó Zernio ni modificó leads existentes.

## Checklist de futura prueba autorizada

- [ ] Plantilla exacta en `APPROVED` y preflight PASS.
- [ ] Preview ligado al SHA exacto del PR.
- [x] Migración `0005` aplicada.
- [ ] `ZERNIO_RECIPIENT_E164` apunta solo al número interno de prueba de Inpulza.
- [ ] `ZERNIO_WHATSAPP_ENABLED=true` únicamente en Preview durante la ventana de prueba.
- [ ] Enviar un lead ficticio rotulado desde Contact y comprobar DB + email + un WhatsApp.
- [ ] Reprocesar el mismo `leadId` y comprobar que no aparece un segundo WhatsApp.
- [ ] Simular rechazo/timeout y comprobar que el formulario sigue mostrando éxito.
- [ ] Revisar outbox sin datos personales: `sent`, `failed`, `pending`, `unknown`.
- [ ] Volver inmediatamente `ZERNIO_WHATSAPP_ENABLED=false` al terminar.
- [ ] No activar Production hasta decisión expresa de Jordan.
