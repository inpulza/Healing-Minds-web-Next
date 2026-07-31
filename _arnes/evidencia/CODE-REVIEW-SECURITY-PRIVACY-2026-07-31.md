# Code Review de seguridad y privacidad — 2026-07-31

## Hallazgos corroborados

- El servidor Next de desarrollo escuchaba en todas las interfaces y el modo de autenticación desactivado concedía sesión administrativa a cualquier request no productiva.
- El servidor Express histórico también escuchaba en todas las interfaces durante desarrollo y registraba fragmentos del cuerpo JSON de APIs, con riesgo de incluir consultas o datos de contacto.
- El filtro de PII detectaba nombres asociados explícitamente con “patient”, pero no un nombre aislado ni un campo genérico `Name:`.

## Correcciones

- `npm run dev` escucha únicamente en `127.0.0.1`.
- El modo admin `off` solo concede sesión/login a requests inequívocamente locales; producción continúa fail-closed.
- El servidor Express solo expone `0.0.0.0` en producción y deja de registrar cuerpos de respuesta.
- El filtro de PII bloquea nombres aislados por línea y campos `Name/Nombre`, además de los identificadores ya cubiertos.

## Límites

No se accedió a secretos, datos reales de pacientes ni variables de Vercel. No se cambia la autenticación custom de Production o Preview.
