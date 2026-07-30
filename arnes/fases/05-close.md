---
name: fase-05-close
description: Cierra el proyecto: cosecha telemetría, casos de estudio de ⛔, exporta secciones a la biblioteca y destila learnings. Léela cuando no queden secciones ⬜/🔧/🔎.
---

# Fase 05 — Close (cosecha y mejora del arnés)

**Objetivo:** que este proyecto haga mejor al siguiente. Nada de conocimiento se queda en la conversación.

## Checklist
- [ ] `node arnes/scripts/harvest.mjs` → `_arnes/verify/resumen-ciclos.md`
- [ ] Todo ⛔ resuelto por el humano tiene su `_arnes/verify/casos/<id>.md` (plantilla `caso-de-estudio.md`)
- [ ] Modo inspiracion: specs aprobados copiados a `_arnes/biblioteca-export/`
- [ ] Candidatos a learning del resumen añadidos a LEARNINGS.md del PAQUETE (no de este proyecto)
- [ ] `node arnes/scripts/gate.mjs --fase=5` → OK
- [ ] Entrada final en bitácora con el resumen del proyecto

## Pasos
1. Corre harvest y LEE el resumen: categorías de fallo frecuentes, secciones con 2 ciclos, ⛔.
2. Por cada ⛔ que el humano resolvió: rellena el caso de estudio (qué intentó cada rol, causa raíz,
   solución humana, cómo detectarlo antes). El gate no cierra sin esto.
3. Exporta a biblioteca (modo inspiracion): copia `_arnes/spec/<id>.md` de las secciones ✅ a
   `_arnes/biblioteca-export/`. El humano las commiteará al repo del paquete (`examples/biblioteca/`).
4. Propón learnings en el LEARNINGS.md del repo del paquete con esta jerarquía (de mejor a peor):
   (1) check nuevo en un script — el error se vuelve imposible;
   (2) ítem nuevo en la checklist de una fase — se detecta antes;
   (3) referencia nueva en referencias/ + fila en INDEX.md — se resuelve más rápido.
   NUNCA promuevas directo a fases/scripts sin pasar por LEARNINGS + eval golden (eso es del release del paquete).
5. Gate de fase 5 hasta OK. Fin del proyecto.
