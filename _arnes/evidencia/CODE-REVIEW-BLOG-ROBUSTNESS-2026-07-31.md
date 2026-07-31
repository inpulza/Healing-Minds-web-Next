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
