---
name: Listón de fusión con revisores automáticos iterados
description: Cuándo dejar de perseguir el PASS de un revisor externo en un PR grande y mandar el resto a tareas de seguimiento.
---

En PRs grandes revisados por un agente externo (aquí: Codex sobre los PRs divididos), las rondas no convergen solas. Cada ronda mezcla tres cosas distintas: defectos reales, ampliación de alcance disfrazada de defecto, y puntos que dependen de un dato que solo el dueño del negocio tiene.

**Regla:** antes de fusionar se arregla lo que provoque pérdida de datos, agujero de seguridad, métricas infladas o una afirmación legal/clínica incorrecta. Todo lo demás — contenido nuevo, tests opcionales, refactors sugeridos — se convierte en tarea de seguimiento y no bloquea la fusión.

**Why:** el reparto de una ronda tardía típica fue: dos defectos reales de código, un hueco real de paridad de enlaces, dos señalamientos falsos (el contenido existía y ya estaba single-sourced), una petición que habría convertido una edición de blog en una caída del arranque, y uno bloqueado por un dato de licencia profesional. Perseguir un PASS limpio en un PR de tres dígitos de ficheros no termina, y cada ronda cuesta tiempo y dinero reales.

**How to apply:** verificar cada señalamiento contra el repo con grep/curl antes de aceptarlo como defecto; responder en el PR qué se arregla y qué no **con el motivo técnico**; y decirle al usuario en qué ronda va, qué queda fuera del listón y por qué. Un "no, y este es el motivo" documentado vale más que un arreglo complaciente que empeora el sistema.
