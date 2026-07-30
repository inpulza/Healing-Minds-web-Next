---
name: fase-02-spec
description: Inventaría secciones en el LEDGER y produce un spec medido por sección + design tokens. Léela solo cuando gate fase 1 pase y fase 2 falle.
---

# Fase 02 — Spec (inventario + medición por sección)

**Objetivo:** convertir la captura en specs cerrados que cualquier constructor (humano o modelo débil) pueda ejecutar sin mirar el original.

## Checklist
- [ ] `node arnes/scripts/extract-tokens.mjs` → design-tokens.json
- [ ] Cada sección de `captura/secciones.json` tiene su fila en `_arnes/LEDGER.md` (estado ⬜)
- [ ] Por CADA sección: raw JSON + screenshots de elemento por viewport + spec relleno
- [ ] `node arnes/scripts/gate.mjs --fase=2` → OK
- [ ] Bitácora actualizada y aprobación humana SOLICITADA

## Pasos por sección (repite para cada fila del LEDGER)
1. Mide (por cada viewport de config, cambia `--viewport`):
   `node arnes/scripts/extract-section.mjs --selector="<selector>" --viewport=1440 --out=_arnes/spec/raw-<id>-1440.json --shot=_arnes/captura/secciones/<id>-1440.png`
2. Crea `_arnes/spec/<id>.md` COPIANDO `arnes/plantillas/spec-de-seccion.md` y rellenando
   cada campo con los valores del raw JSON. Nada de "aprox" ni valores inventados (Regla dura 3).
3. Registra la fila en el LEDGER: `| <id> | <nombre> | ⬜ | spec/<id>.md | - | - |`
4. Si el modo es `inspiracion`: en el spec, la sección **Contenido** lleva el copy REESCRITO para el
   cliente (el original va solo como referencia de longitud/tono) y **Assets** lista sustitutos.

## Cierre de fase — checkpoint humano (obligatorio)
1. Corre el gate de fase 2 hasta OK.
2. Pide al humano: "Revisa los specs en `_arnes/spec/` y cambia `APROBADO_SPECS: no` a `sí` en `_arnes/LEDGER.md`".
3. NO toques código hasta que ese flag sea `sí` (el gate de fase 3 lo bloquea).

## Prohibido en esta fase
- Extraer `body` entero (el script ya lo impide) o rellenar un spec "de memoria".
