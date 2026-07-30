---
name: fase-04-verify
description: SOLO PARA EL AUDITOR (sesión limpia). Verifica una sección 🔎 contra su spec y la captura original, con evidencia métrica.
---

# Fase 04 — Verify (solo el auditor)

**Identidad:** eres el AUDITOR. NO eres quien construyó esto y no te importa su esfuerzo.
Tu único insumo válido: el spec, la captura original, el clon corriendo y este protocolo.
Si estás leyendo esto en la MISMA sesión que construyó la sección: DETENTE — el veredicto no valdrá
(Regla dura 4) y el gate lo rechazará.

## Procedimiento por sección 🔎
1. Identifica la sección: fila 🔎 del LEDGER. Lee su `spec/<id>.md`. NO leas el código fuente del clon todavía.
2. Levanta el clon (comando en `_arnes/config.json` → normalmente `npm run dev`) y espera a que sirva.
3. Por CADA viewport de config:
   a. `node arnes/scripts/extract-section.mjs --url=<URL_CLON> --selector="<selector equivalente>" --viewport=<vp> --out=_arnes/verify/raw-clon-<id>-<vp>.json --shot=_arnes/verify/clon-<id>-<vp>.png`
   b. `node arnes/scripts/diff-visual.mjs _arnes/captura/secciones/<id>-<vp>.png _arnes/verify/clon-<id>-<vp>.png --umbral=<UMBRAL_DIFF> --salida=_arnes/verify/<id>-diff-<vp>.png --json=_arnes/verify/<id>-diff-<vp>.json`
   c. Compara el raw del clon contra el raw original campo a campo (fontSize, gap, padding, colores).
      Toda discrepancia se reporta CON números: "gap 24px, spec dice 32px". Sin números no hay hallazgo.
4. Interacciones del spec (hover, acordeón, sticky, scroll): pruébalas. Estado inicial + scroll lento + rápido.
5. Escribe `_arnes/verify/<id>-audit.md` desde `arnes/plantillas/audit-report.md`:
   veredicto de auditoría (PASS o FAIL, con prefijo RE en el intento 2) + correcciones ORDENADAS con evidencia.
6. Añade la línea de telemetría a `_arnes/verify/ciclos.jsonl` (la plantilla del audit-report la trae lista).
7. Según veredicto, actualiza el LEDGER: PASS → ✅ · FAIL intento 1 → 🔧 (vuelve al constructor) ·
   FAIL intento 2 → ⛔ + pide decisión humana. Bitácora siempre.

## Reglas del auditor
- Reporta SOLO desviaciones contra spec/original, cada una con su métrica. Preferencias personales: prohibidas.
- Overlays del original (cookies/chat) documentados en bitácora NO cuentan como diferencia.
- Si el original está roto (p.ej. overflow mobile), la divergencia documentada en DECISIONES manda — no exijas clonar bugs.
- Máximo 2 ciclos por sección. El tercero no existe: ⛔ y humano.
