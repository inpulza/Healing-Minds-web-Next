---
name: fase-01-captura
description: Congela la ground truth del sitio original. Léela solo cuando el gate de fase 1 falle y el de fase 0 pase.
---

# Fase 01 — Captura (ground truth congelada)

**Objetivo:** fijar la verdad del proyecto. Desde ahora, TODO se compara contra `_arnes/captura/`, nunca contra el sitio vivo ni contra tu memoria.

## Checklist (pégala en tu respuesta y ve tachando)
- [ ] `node arnes/scripts/capture.mjs` terminó con PASS
- [ ] Abrí `_arnes/captura/secciones.json` y el inventario tiene sentido (una entrada por sección visual)
- [ ] Revisé `_arnes/captura/assets/manifest.json`: los assets con `error` los anoté en la bitácora
- [ ] `node arnes/scripts/gate.mjs --fase=1` → OK
- [ ] Entrada en `_arnes/BITACORA.md` con la evidencia

## Pasos
1. Corre: `node arnes/scripts/capture.mjs`
   (usa `TARGET_URL` y `VIEWPORTS` de `_arnes/config.json`).
2. Abre `_arnes/captura/secciones.json`. Si está vacío o tiene una sola macro-sección,
   el sitio agrupa todo en un wrapper: busca "inventario vacío" en `arnes/referencias/INDEX.md`.
3. Si el sitio tiene cookie-banner/chat flotante que ensucia los screenshots, anótalo en la bitácora:
   el auditor lo descontará (los overlays NO se clonan).
4. Corre el gate. Si falla, lee el `→ Arreglo:` de cada FAIL y corrígelo. No avances con FAILs.

## Prohibido en esta fase
- Escribir código del clon.
- "Mejorar" la captura editándola a mano: es evidencia congelada.

## Ruta B (opcional, solo si capture.mjs no puede correr)
Si tu herramienta tiene MCP de navegador (Chrome DevTools/Playwright MCP), reproduce los mismos artefactos
con los mismos nombres de archivo. El gate valida artefactos, no herramientas.
