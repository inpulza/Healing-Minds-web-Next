# Entrada de bitácora de ejemplo (fase 03 → 04 de `hero`)

Así queda una entrada real en `_arnes/BITACORA.md` al cerrar el bloque de la sección `hero`.
Nota el patrón: salidas PASS/FAIL PEGADAS, no afirmaciones ("quedó bien").

```
## 2026-07-08 Claude — fase 03→04 (sección hero)
**Qué se hizo:** Construí `hero.html` + `hero.css` (STACK html-estatico) desde `spec/hero.md`,
tomando cada valor del raw (44px/700 Georgia el h1, gradiente 160deg, CTA pill #2b6cb0 radio 28px).
Serví el clon en :5010, lo medí y lo pasé a auditoría (sesión limpia). Auditor: AUDIT_PASS a la primera.
**Decisiones:** ninguna (no hubo desviación que decidir).
**Pendientes/bugs:** ninguno a 1440. En proyecto real falta medir la variante <810px.
**Archivos tocados:** examples/canonico-hero/hero.html, examples/canonico-hero/hero.css,
_arnes/verify/hero-audit.md, _arnes/verify/ciclos.jsonl, _arnes/LEDGER.md (hero → ✅).
**Evidencia:**
  $ node scripts/extract-section.mjs --url=http://localhost:5010/hero.html --selector="#hero" --viewport=1440 ...
  PASS sección #hero @1440px: 4 nodos → _arnes/verify/clon-raw.json + _arnes/verify/clon-hero-1440.png
  $ node scripts/diff-visual.mjs _arnes/captura/secciones/hero-1440.png _arnes/verify/clon-hero-1440.png --umbral=3 ...
  PASS diff 0% <= 3%
```
