<!-- arnes-clonador-web -->
## Arnes de clonado web
Lee `arnes/SKILL.md` y siguelo al pie de la letra. El estado del proyecto vive en `_arnes/`
(config.json, LEDGER.md, BITACORA.md, DECISIONES.md). Toda sesion nueva arranca leyendo esos archivos.

## Browser E2E gate

Los cambios que afecten UI, navegacion, formularios, cookies/consentimiento, analytics o renderizado SEO deben incluir o actualizar pruebas en `e2e/`. `npm run test:e2e` se ejecuta de forma serial y determinista contra el build ya creado; `npm run test:e2e:build` crea el build y luego ejecuta desktop y mobile Chromium. Para verificar Preview o Production, define `E2E_BASE_URL` y el SHA completo en `E2E_EXPECTED_SHA`, y ejecuta `npm run test:e2e:deployed`; el comando falla en cerrado si falta cualquiera de los dos o si el deployment no expone ese SHA. Los tests unitarios no sustituyen este gate. No hacer merge sin PASS local/Preview y verificacion del SHA exacto desplegado, salvo excepcion explicita de Jordan.
