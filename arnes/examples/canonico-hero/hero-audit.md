# Auditoría: hero — intento 1

- Fecha: 2026-07-08 · Auditor: sesión limpia (Claude) + scripts del arnés · Viewports: 1440 · Umbral diff: 3%

## Veredicto
AUDIT_PASS

## Evidencia de diffs visuales
| viewport | % diff | veredicto | archivo |
|----------|--------|-----------|---------|
| 1440 | 0% | PASS | verify/hero-diff-1440.png |

Salida real de `diff-visual.mjs`: `PASS diff 0% <= 3%` (dimensiones 1440×431).
Comparación raw a raw: `fontSize` 44px/18px/16px, `fontWeight` 700/400/400, `gap` 20px, `padding`
`96px 24px 88px`, gradiente `linear-gradient(160deg, #ebf8ff 0%, #fefcbf 100%)`, `borderRadius` 28px
del CTA — todos coinciden con el original. Las coordenadas `y` absolutas difieren (el original arranca
bajo el header sticky) pero la geometría intra-sección (w/h/padding/gap) es idéntica: no es hallazgo.

## Correcciones ordenadas (solo si FAIL — el constructor las aplica EN ESTE ORDEN)
Ninguna. Intento 1 pasó sin correcciones.

## Línea de telemetría (añádela a `_arnes/verify/ciclos.jsonl` — UNA línea, sin saltos)
{"seccion":"hero","intento":1,"veredicto":"PASS","fallos":[],"fecha":"2026-07-08"}

## Riesgos / notas para el humano
- Ninguno a 1440. Pendiente en un proyecto real: auditar la variante `<810px` (ver spec §Responsive).
