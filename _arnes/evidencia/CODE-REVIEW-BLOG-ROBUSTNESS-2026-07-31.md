# Code Review de robustez del motor editorial — 2026-07-31

## Hallazgos corroborados y corregidos

- **Inventario truncado:** la planificación y el modo guiado solo recordaban los 200 posts más recientes. Ahora paginan hasta agotar el inventario y siguen excluyendo únicamente `rejected`.
- **Idempotencia concurrente:** dos requests con la misma clave podían recibir la misma fila y ambos intentar encolarla. La creación ahora informa si ganó el insert; el perdedor reabre la ejecución existente sin añadir eventos ni volver a encolar.
- **Jobs estancados:** la recuperación omitía `queued` y la planificación larga no enviaba heartbeat. Los `queued` antiguos se interrumpen a los cinco minutos y topic planning actualiza heartbeat cada 30 segundos.
- **Operaciones pagadas de imagen:** generate/regenerate no tenían límite específico. Se añade un límite conservador y configurable (`BLOG_IMAGE_HOURLY_LIMIT`, 4 por hora por actor por defecto) tanto en Next como en el servidor histórico.
- **Imágenes abandonadas:** filas `generating` de más de 15 minutos pasan a `failed/generation_interrupted` antes de reintentar, publicar o borrar.
- **Orden de borrado:** el almacenamiento físico se eliminaba dentro de la transacción, antes de confirmar el borrado del post. La base de datos y el redirect se confirman primero; después se limpian objetos. Un fallo de Blob queda como warning y no presenta una transacción ya confirmada como fallida.

## Hallazgos ya resueltos

- Los candidatos `change_angle` y `update_existing` no pueden generar borradores desde UI ni API.
- El fallo durable se persiste antes de emitir el evento final.
- Unpublish y redirect se actualizan en una sola transacción.
- El flujo largo de autogeneración ya tenía heartbeat mientras está `running`.

## Nota operativa

El rate limit en memoria es defensa de aplicación por instancia, coherente con el limitador de texto existente. Un límite global distribuido requeriría un sprint de infraestructura explícito.

## Revisión exacta posterior a la integración de `main`

El review de CodeX sobre `3ad4a81d31f0e0f129153915a1967ae601e9f310` abrió cuatro P2 y los cuatro se clasifican como **válidos**:

1. `3694143680`: el inventario paginado necesitaba un orden total. `getAdminBlogPosts` ordena ahora por `updatedAt`, `createdAt` e `id`, todos descendentes.
2. `3694143684`: un fallo temprano de Blob detenía el resto de eliminaciones y perdía las claves después del commit. La transacción guarda primero todas las claves en `blog_image_cleanup_queue`; después se intenta cada objeto independientemente. Los éxitos eliminan su entrada y los fallos conservan clave, contador y error. Cada ejecución incluye también el backlog anterior.
3. `3694143685`: Auto Generate no consumía el límite de imágenes. La cuota admite coste y cobra las tres llamadas potencialmente pagadas del flujo automático; generate manual cobra hero/inline/all según el máximo solicitado.
4. `3694143688`: planner y judge recibían un registro por cada post sin cota. Los checks locales siguen recorriendo el inventario completo, pero el proveedor recibe agregados completos y como máximo 40 perfiles seguros. Para el judge se priorizan matches léxicos y perfiles semánticos relevantes aunque estén al final del inventario. Los bonuses de etapa ausente consultan `patientStageCounts` completo, no la muestra, para no alterar el ranking.

Hallazgos adicionales del juez, también **válidos y corregidos**: colisión concurrente different-key convertida a 409 estable, heartbeat Express durante todo topic planning, desempate inmutable en paginación y paridad same-key Next/Express mediante una decisión compartida antes de eventos o queue.

Evidencia local posterior al patch: 81/81 tests, TypeScript PASS, migraciones PASS con 3 archivos/98 statements/19 tablas/20 FKs, image/topic/link/analytics guards PASS, SEO render audit PASS en 8 URLs, build Next 89/89 y `git diff --check` PASS. Juez independiente GO 4/4 después de detectar y verificar la corrección del falso bonus `missingStages`; sin hallazgos accionables nuevos.
