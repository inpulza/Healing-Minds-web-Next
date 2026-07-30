---
name: arnes-clonador-web
description: Usa esta skill SIEMPRE que el usuario pida clonar, replicar, recrear o inspirarse en una pagina web, seccion o componente. Guia un pipeline de fases con gates ejecutables, extraccion determinista con scripts, eval-suite, trazas y auditoria independiente. NO aplica a auditorias SEO ni a scraping de datos.
compatibility: Requiere Node 20+ y Playwright (npx playwright install chromium)
metadata:
  version: "3.0"
  author: inpulza
---

# Arnes Clonador Web

Pipeline fijo para clonar con fidelidad maxima o inspirarse en una web sin copiar contenido/activos cuando el modo sea `inspiracion`.

Tu no decides que sigue: lo decide el gate. Tu trabajo es ejecutar la fase actual y nada mas.

## Ruta estricta Render Contract + Eval Suite

Activa SIEMPRE esta ruta si el pedido exige fidelidad, pixel-perfect, sticky behavior, scroll-linked animation, hover/click/focus behavior, responsive parity, max-width real, section seams o auditoria estricta.

Regla central:

```text
Conversation memory is not evidence. Only stored artifacts, trace, graders, audit report, and gates can approve a section.
```

Cuando esta ruta aplica:

1. Trata cada seccion como una `task`.
2. Trata cada intento de constructor/auditor como un `trial`.
3. Crea o usa `_arnes/eval-suite/<section>/<trial-id>/`.
4. Exige `trace.jsonl`.
5. Ejecuta code-based graders.
6. No aceptes model/human review como reemplazo de un FAIL metrico.
7. No cierres si `aggregate.json` no esta en PASS.

Referencias de carga progresiva:

- Arquitectura: `arnes/referencias/18-anthropic-harness-operating-model.md`.
- Eval-suite, graders y trace: `arnes/referencias/19-eval-suite-graders-trace.md`.
- Prueba con agente limpio: `arnes/referencias/20-fresh-agent-fire-test.md`.

## Protocolo de arranque

1. Lee `_arnes/config.json`, `_arnes/LEDGER.md` y las ultimas 20 lineas de `_arnes/BITACORA.md`.
2. Si `_arnes/` no existe, inicializa el arnes o pide al humano la URL.
3. Encuentra la fase actual ejecutando `node arnes/scripts/gate.mjs --fase=N` subiendo N desde 1.
4. La primera fase cuyo gate falle es tu fase actual.
5. Lee solo el archivo de esa fase en `arnes/fases/`.

## Fases

| N | Archivo | Leelo cuando | Gate |
|---|---------|--------------|------|
| 1 | `arnes/fases/01-captura.md` | vas a congelar el original | `node arnes/scripts/gate.mjs --fase=1` |
| 2 | `arnes/fases/02-spec.md` | vas a inventariar y especificar | `node arnes/scripts/gate.mjs --fase=2` |
| 3 | `arnes/fases/03-build.md` | specs aprobados y vas a construir | `node arnes/scripts/gate.mjs --fase=3` |
| 4 | `arnes/fases/04-verify.md` | eres el auditor en sesion limpia | `node arnes/scripts/gate.mjs --fase=4` |
| 5 | `arnes/fases/05-close.md` | todas las secciones estan cerradas o bloqueadas | `node arnes/scripts/gate.mjs --fase=5` |

## Reglas duras

1. Prohibido construir sin aprobacion humana de specs (`APROBADO_SPECS: si` en el LEDGER).
2. Prohibido reconstruir una seccion ya verificada. Reusala tal cual.
3. Prohibido medir a ojo: toda medida sale de scripts/probes o navegador inspeccionado.
4. El constructor nunca se autoaprueba.
5. Solo el auditor independiente puede emitir PASS.
6. En modo `inspiracion`, prohibido copy literal y assets del original.
7. En ruta estricta, missing evidence equals FAIL.
8. Un screenshot o video es evidencia, no entregable ni aprobacion.

## Al terminar cualquier bloque de trabajo

Anade una entrada a `_arnes/BITACORA.md` con:

- que se hizo;
- decisiones;
- pendientes;
- archivos tocados;
- evidencia con salidas PASS/FAIL reales.

## Si algo se ve raro o un fix no converge

Busca el sintoma en `arnes/referencias/INDEX.md` y lee solo el archivo indicado.

## Alcance

Este arnes extrae estructura, estilo, comportamiento y evidencia verificable. No roba contenido con copyright: en modo `inspiracion` los textos se reescriben y los assets se sustituyen.

