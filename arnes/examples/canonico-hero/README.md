# Ejemplo canónico: una sección recorriendo el arnés completo

**Así se ve UNA sección (`#hero`) viajando por todo el pipeline. Imita este formato.**

Cada archivo de esta carpeta es salida REAL de los scripts del arnés sobre el golden-site
(`evals/golden-site/`), no números inventados. Recórrelos en este orden:

1. **`raw-hero-1440.json`** — extracción determinista del original (fase 01/02). La fuente de
   verdad: geometría, tipografía y color medidos, nunca a ojo.
2. **`spec-hero.md`** — el spec de la sección, relleno desde `plantillas/spec-de-seccion.md` con
   los valores del raw. Lo que el humano aprueba antes de construir (`APROBADO_SPECS: sí`).
3. **`hero.html` + `hero.css`** — el build (fase 03), construido SOLO desde el spec.
4. **`hero-audit.md`** — el veredicto del auditor (fase 04): `AUDIT_PASS`, diff **0%** ≤ 3%.
5. **`ciclos.jsonl`** — la telemetría: una línea, el registro del ciclo.
6. **`ledger-row.md`** — la fila del LEDGER de `hero` en sus 4 estados (⬜ → 🔧 → 🔎 → ✅).
7. **`bitacora-entry.md`** — la entrada de bitácora que cierra el bloque, con las salidas PASS pegadas.

## Nota sobre el stack

Aquí la sección reconstruida es **HTML+CSS estático** (`STACK: html-estatico`) para que el ejemplo
sea autoverificable sin tooling de build. En un proyecto de cliente real el stack sería
**Next.js + Tailwind** (o el que use el original); **el flujo es idéntico**: mismo spec, mismos
scripts de extracción y diff, mismo gate del auditor. Solo cambia cómo se sirve el clon en fase 04.

## Reproducirlo (comandos exactos, desde la raíz del paquete)

```bash
# 1. Sirve el original (golden-site) en :4999
node evals/servir.mjs &
# 2. Congela la ground truth
node scripts/capture.mjs --url=http://localhost:4999 --dir=_arnes --viewports=1440
# 3. Mide la sección (raw + screenshot) y los tokens
node scripts/extract-section.mjs --url=http://localhost:4999 --selector="#hero" --viewport=1440 \
  --out=_arnes/spec/raw-hero-1440.json --shot=_arnes/captura/secciones/hero-1440.png
node scripts/extract-tokens.mjs --url=http://localhost:4999 --dir=_arnes
# 4. (Build: hero.html + hero.css desde el spec.) Sirve el clon y mídelo:
node scripts/extract-section.mjs --url=http://localhost:5010/hero.html --selector="#hero" \
  --viewport=1440 --out=_arnes/verify/clon-raw.json --shot=_arnes/verify/clon-hero-1440.png
# 5. Diff visual: PASS si <= umbral
node scripts/diff-visual.mjs _arnes/captura/secciones/hero-1440.png _arnes/verify/clon-hero-1440.png \
  --umbral=3 --salida=_arnes/verify/hero-diff-1440.png --json=_arnes/verify/hero-diff-1440.json
```

> En un proyecto de cliente los scripts viven bajo `arnes/scripts/…` y el clon se sirve con `npm run dev`.
