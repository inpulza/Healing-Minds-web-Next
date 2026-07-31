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
- Las etiquetas `Patient name`/`Nombre del paciente` funcionan con o sin puntuación. El detector del contenido público conserva compuestos editoriales normales; los campos administrativos que se enviarán a IA aplican una frontera fail-closed separada.
- Los nombres title-case directamente ligados a `Patient/Paciente`, incluso si marcador y nombre viven en campos distintos, se bloquean sin exigir puntuación ni un verbo posterior.
- Email, fecha de nacimiento, identificador médico y teléfono pueden reconstruirse a través de dos fronteras cuando existe una etiqueta explícita; los mismos fragmentos sin etiqueta no se unen.
- El detector estrecho de contenido público conserva las heurísticas de narrativas lowercase y nombres bare para no censurar artículos ya publicados. En los campos administrativos para IA ya no se intenta distinguir por verbos, nombres o ciudades: cualquier palabra completa `patient/paciente` se rechaza antes del egress.
- Los temas editoriales se reformulan sin el marcador, por ejemplo `Confidentiality in Florida care`; así pasan sin relajar los bloqueos de email, teléfono, fecha de nacimiento, identificador médico, dirección o nombre de alta confianza.
- La ruta Express deja de imprimir el objeto de contacto y un test impide reintroducir logs del body persistido.

## Clasificación final del Code Review exacto

- `3692390069` / `PRRT_kwDOToJ8Pc6VfuPD` — **válida y resuelta**. La búsqueda no estaba anclada al comienzo del fragmento posterior al marcador y producía falsos positivos en títulos editoriales. Se ancló la coincidencia, se añadieron fixtures EN y un juez independiente confirmó que nombres directos/split y narrativas adversariales siguen bloqueados, mientras las variantes editoriales permanecen permitidas.
- `3692466757` / `PRRC_kwDOToJ8Pc7cFpJF` — **válida y resuelta**. El anclaje inmediato omitía nombres introducidos después de un verbo narrativo. Se añadieron señales separadas para nombre completo, nombre envuelto, monónimo con diacrítico y declaración explícita EN/ES; el análisis conjunto de campos preserva esos bloqueos. La pasada adversarial distinguió además personas de regiones/ciudades multiword usando contexto geográfico, sin debilitar referencias, contactos o copulas de identidad.

Verificación del juez final: identidad directa/split EN/ES PASS; geografía/editorial EN/ES PASS; Guide/Perspectives/Resources/HIPAA/privacy PASS; Madonna/Pelé e identificadores etiquetados bloqueados; egress dinámico redactado con memoria local preservada; focused 8/8, TypeScript, image guard y diff-check PASS. Verificación integrada final: 68/68 tests, TypeScript PASS, 2 migraciones/95 statements/18 tablas/20 foreign keys PASS, image guard PASS, build 89/89 y diff-check PASS.

## Clasificación del Code Review exacto de `b2d8c1c`

- `3692767393` / `PRRC_kwDOToJ8Pc7cGyih` — **válida y resuelta por la frontera fail-closed**. Las identidades lowercase después de verbos narrativos podían eludir la heurística. Un campo para IA que contenga `patient/paciente` ahora se bloquea antes de intentar clasificar el resto de la frase.
- `3692767396` / `PRRC_kwDOToJ8Pc7cGyik` — **válida y resuelta por la frontera fail-closed**. Las etiquetas modificadas como `full legal name` ya no dependen de enumerar el orden de los modificadores porque el marcador de paciente basta para detener el egress.
- `3692767400` / `PRRC_kwDOToJ8Pc7cGyio` — **válida y resuelta por la frontera fail-closed**. Una ubicación seguida más tarde por un nombre ya no puede aprovechar la excepción geográfica dentro de un input marcado como paciente.

## Decisión final de seguridad para campos IA

Se abandona la clasificación abierta de frases administrativas con `patient/paciente`. Era imposible mantener una lista finita y fiable de verbos, modificadores, nombres, ciudades y sustantivos comunes en inglés y español. La frontera nueva es explícita, bilingüe y fácil de verificar: si cualquiera de `topic`, `targetKeyword` o `additionalContext` contiene la palabra completa `patient` o `paciente`, el borrador se rechaza y el editor debe reformular el tema sin ese marcador. Esto afecta solo a inputs administrativos que se enviarían a un proveedor de IA; no cambia el detector usado para artículos públicos ni la generación de imágenes sobre contenido publicado.

El primer pase del juez dio **NO-GO** por una regresión de workflow: el planificador automático aún podía recomendar `Patient Guide...`, mientras generación lo rechazaría después, y la ruta Next podía reclamar el plan antes del control. Se alineó `deterministicStatus` con la misma frontera fail-closed, se retiró `Prefer patient questions` del prompt y se prohibió el marcador en `topic`, `targetKeyword` y `expertiseAngle`. Las rutas Express y Next ahora construyen el payload sin mutar estado, ejecutan privacidad, configuración, rate limit y seguridad temática, y solo entonces seleccionan el candidato y reclaman el planning run.

Verificación final: el juez independiente emitió **GO sin hallazgos accionables**. Los nueve casos directos y repartidos que cubren los tres P1 quedan bloqueados; nueve reformulaciones editoriales sin el marcador pasan; ocho formas de PII explícito sin marcador siguen bloqueadas; el planificador rechaza sus tres campos sensibles; el inventario publicado y el egress redactado permanecen correctos. `npm test` PASS 69/69, TypeScript PASS, 2 migraciones/95 statements/18 tablas/20 foreign keys PASS, `blog:image-check` PASS, `blog:topic-check` PASS, build 89/89 y `git diff --check` PASS. `additionalContext` conserva deliberadamente el detector de nombres más estricto; una frase con geografía title-case puede requerir reformulación, pero se descarta antes de recomendar o consumir el plan. Los hilos se resolverán únicamente después de publicar el SHA y obtener Code Review exacto nuevo.

## Límites

No se accedió a secretos ni datos reales de pacientes. No se cambia la autenticación custom de Production o Preview. Un topic o keyword sin el marcador `patient/paciente` conserva semántica editorial; el campo libre `additionalContext` sigue siendo deliberadamente más estricto. Esta frontera por función no reemplaza la prohibición humana de introducir PII ni constituye un detector clínico universal. El contenido completo de un artículo puede mencionar personal público, por lo que la salida de imágenes exige identificadores explícitos en vez de inferir que cualquier nombre es un paciente.
