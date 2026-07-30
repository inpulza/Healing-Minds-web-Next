# Auditoría: <id> — intento <1|2>

- Fecha: <ISO> · Auditor: <herramienta/modelo> · Viewports: <…> · Umbral diff: <N>%

## Veredicto
<AUDIT_PASS | AUDIT_FAIL | REAUDIT_PASS | REAUDIT_FAIL>

## Evidencia de diffs visuales
| viewport | % diff | veredicto | archivo |
|----------|--------|-----------|---------|
| 1440 | <…> | <…> | verify/<id>-diff-1440.png |

## Correcciones ordenadas (solo si FAIL — el constructor las aplica EN ESTE ORDEN)
1. [categoria: <taxonomía>] <qué está mal, con números: "gap 24px, spec dice 32px"> → <qué hacer>
2. …

Taxonomía permitida: medida | espaciado | tipografia | color-token | overflow-mobile |
variante-responsive | animacion-scroll | interaccion | asset-faltante | svg-roto | solapamiento | navegacion | otro

## Línea de telemetría (añádela a `_arnes/verify/ciclos.jsonl` — UNA línea, sin saltos)
{"seccion":"<id>","intento":<1|2>,"veredicto":"<PASS|FAIL>","fallos":[{"categoria":"<taxonomía>","detalle":"<con números>"}],"correccion":"<si intento 2: qué corrección funcionó>","fecha":"<YYYY-MM-DD>"}

## Riesgos / notas para el humano
- <o "ninguno">
