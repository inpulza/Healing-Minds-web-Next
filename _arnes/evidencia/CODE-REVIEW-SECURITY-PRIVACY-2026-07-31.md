# Code Review de seguridad y privacidad — 2026-07-31

## Hallazgos corroborados

- El servidor Next de desarrollo escuchaba en todas las interfaces y el modo de autenticación desactivado concedía sesión administrativa a cualquier request no productiva.
- El servidor Express histórico también escuchaba en todas las interfaces durante desarrollo y registraba fragmentos del cuerpo JSON de APIs, con riesgo de incluir consultas o datos de contacto.
- El filtro de PII detectaba nombres asociados explícitamente con “patient”, pero no un nombre aislado ni un campo genérico `Name:`.
- El primer hardening no interpretaba correctamente hosts IPv6 y aceptaba el primer valor de un `x-forwarded-host` mixto aunque otro salto fuera público.
- Los nombres internacionales, etiquetas médicas españolas con tildes y fechas españolas con mes escrito podían eludir el filtro conservador.
- La ruta Express histórica todavía registraba el objeto completo del contacto después de persistirlo.

## Correcciones

- `npm run dev` escucha únicamente en `127.0.0.1`.
- El modo admin `off` solo concede sesión/login a requests inequívocamente locales; producción continúa fail-closed.
- El servidor Express solo expone `0.0.0.0` en producción y deja de registrar cuerpos de respuesta.
- El filtro de PII bloquea nombres aislados por línea y campos `Name/Nombre`, además de los identificadores ya cubiertos.
- El parser de hosts acepta `localhost`, IPv4 e IPv6 loopback, pero exige que todos los valores reenviados sean locales y rechaza listas mixtas.
- El filtro reconoce identificadores explícitos, `Número de paciente`, `Historia clínica`, fechas españolas con mes escrito y estructuras de nombre de alta confianza con tildes, guiones, apóstrofos, iniciales, partículas o mayúsculas.
- Los endpoints Next y Express revisan `topic`, `targetKeyword` y `additionalContext` por separado antes de usar IA. Los identificadores explícitos se bloquean en cualquier campo y el contexto libre aplica además una forma conservadora de nombre propio sin depender de listas culturales finitas.
- El planificador nunca envía títulos o keywords históricos en claro: usa una referencia `Private post <id>` y conserva el análisis de duplicados determinista dentro del servidor.
- La limpieza del inventario y de ambos payloads del juez es incondicional: también protege un post cuyo título literal ya sea `Private post <id>` y elimina `targetKeyword`/`topicKey` sin comparaciones de sentinel.
- La generación de borradores recibe una copia de memoria semántica con título y slug históricos reemplazados; la copia local conserva los datos reales para deduplicación y administración.
- Las narrativas lowercase EN/ES tras `patient/paciente`, incluso repartidas entre campos, se bloquean con fixtures adversariales. Las fronteras estructuradas detectan nombre, fecha de nacimiento, ID médico, email, teléfono y dirección sin concatenar indiscriminadamente topics editoriales.
- Las etiquetas `Patient name`/`Nombre del paciente` funcionan con o sin puntuación, mientras compuestos editoriales como `Patient-Centered Care` y `Case-Based Approaches` permanecen permitidos.
- Los nombres title-case directamente ligados a `Patient/Paciente`, incluso si marcador y nombre viven en campos distintos, se bloquean sin exigir puntuación ni un verbo posterior.
- Email, fecha de nacimiento, identificador médico y teléfono pueden reconstruirse a través de dos fronteras cuando existe una etiqueta explícita; los mismos fragmentos sin etiqueta no se unen.
- Para narrativas lowercase se aplica una frontera privacy-first basada en el primer lead después de `patient/paciente`: topics sanitarios y operacionales verificados se permiten, pero una secuencia ambigua se rechaza para evitar que un verbo no enumerado abra una fuga.
- La ruta Express deja de imprimir el objeto de contacto y un test impide reintroducir logs del body persistido.

## Límites

No se accedió a secretos ni datos reales de pacientes. No se cambia la autenticación custom de Production o Preview. Un topic o keyword sin etiqueta se trata como tema editorial para no bloquear expresiones clínicas normales; el campo libre `additionalContext` es deliberadamente más estricto. Esta frontera por función no reemplaza la prohibición humana de introducir PII ni constituye un detector clínico universal. El contenido completo de un artículo puede mencionar personal público, por lo que la salida de imágenes exige identificadores explícitos en vez de inferir que cualquier nombre es un paciente.
