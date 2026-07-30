---
name: fase-03-build
description: Construye el clon sección por sección contra specs aprobados. Léela solo con APROBADO_SPECS sí y gate fase 3 fallando.
---

# Fase 03 — Build (sección por sección)

**Objetivo:** construir UNA sección a la vez, exactamente según su spec. La unidad de trabajo es la sección, jamás "la página".

## Checklist por sección
- [ ] Elegí la primera fila ⬜ del LEDGER (o la 🔧 si quedó a medias) y la marqué 🔧
- [ ] REUSE-FIRST: busqué si ya existe una sección ✅ equivalente en este LEDGER o en `arnes/examples/biblioteca/`
- [ ] Construí SOLO esa sección usando su `spec/<id>.md` + `spec/design-tokens.json`
- [ ] `node arnes/scripts/gate.mjs --fase=3` → OK (build compila + reglas de modo)
- [ ] Marqué la fila 🔎, llené la columna `codigo`, y emití la señal QA (plantilla `arnes/plantillas/qa-signal.md`)
- [ ] Bitácora actualizada

## Reglas tácticas de construcción
1. Usa los valores del spec tal cual: `text-[44px] leading-[1.2]`, no "text-4xl porque se parece".
2. Flex/grid para agrupar; posiciones absolutas solo si el spec las trae.
3. Nada de `<br/>` de diseño ni contenedores extra que el original no tiene: limita anchos con max-width.
4. Los SVG vienen del raw JSON (campo `svg`), inline y completos. Sin placeholders `{/* icon */}` JAMÁS.
5. Tokens: si un color/fuente está en design-tokens.json, referencia el token; no lo hardcodees de nuevo.
6. Modo `inspiracion`: copy del cliente (del spec), assets sustituidos. El gate te rechazará el literal.

## Al terminar la sección
1. Deja la fila en 🔎. NO la pases a ✅ — eso solo puede hacerlo el auditor (Regla dura 4).
2. Handoff al auditor: el humano (o tú, si tu herramienta permite subagentes) abre una SESIÓN NUEVA
   con `arnes/plantillas/prompt-auditor.md`. No le expliques nada por chat: todo va por archivos.
3. Mientras esperas veredicto puedes empezar la SIGUIENTE sección ⬜.

## Si el auditor te devuelve correcciones
Lee `_arnes/verify/<id>-audit.md`, aplica las correcciones EN ORDEN, y vuelve a emitir señal QA (intento 2).
Máximo 2 ciclos: si el auditor falla el intento 2, la sección queda ⛔ y decide el humano. No insistas.
