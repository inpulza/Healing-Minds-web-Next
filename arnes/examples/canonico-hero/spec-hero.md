# Spec de sección: hero

Fuente de verdad: `_arnes/spec/raw-hero-1440.json` + `_arnes/captura/secciones/hero-1440.png`.
Todo valor de este spec sale de ahí. Si un valor no está medido, mídelo — no lo estimes.

## Identidad
- id: `hero` · selector original: `#hero` · viewports medidos: 1440
- Rol de la sección: hero
- Modo del proyecto: clon

## Geometría
- Contenedor: 1440×431 @1440px · padding: `96px 24px 88px` · layout: flex column, `gap: 20px`, `align-items: center`.
- Hijos directos (del raw JSON, offsets en px absolutos de la página):
  - `h1` — 720×106 · x360 y157
  - `p.sub` — 560×54 · x440 y283
  - `a.cta` — 190×47 · x625 y357 (padding interno `14px 32px`)

## Tipografía y color
- `h1`: Georgia / 44px / 700 / line-height 52.8px / color `#1a202c`.
- `p.sub`: Georgia / 18px / 400 / line-height 27px / color `#4a5568`.
- `a.cta`: Georgia / 16px / 400 / color `#ffffff` sobre `background #2b6cb0`.
- Fondo de sección (gradiente exacto del raw): `linear-gradient(160deg, #ebf8ff 0%, #fefcbf 100%)`.
- Tokens usados (design-tokens.json): tinta `#1a202c`, texto secundario `#4a5568`, primario/CTA `#2b6cb0`, radio `28px`.

## Contenido
- Modo clon: texto VERBATIM del original, elemento por elemento.
  - `h1`: "Diseñamos espacios que cuentan la historia de tu marca"
  - `p.sub`: "Estudio de arquitectura interior con quince años creando oficinas y comercios memorables."
  - `a.cta`: "Agenda una visita" (href `#contacto`)
- Assets: ninguno (sección sin imágenes ni SVG).
- SVGs: ninguno en esta sección.

## Interacciones y animación
- Hover/focus/active: el original NO define `:hover` sobre `.cta` — sin cambio de estado. No inventes uno.
- Animaciones de entrada/scroll: ninguna.
- Sticky/fixed: no aplica al hero (el sticky vive en `#cabecera`, otra sección).

## Responsive
- Este ejemplo canónico midió SOLO 1440. En un proyecto real se mide cada viewport de config.
- OJO (lección `referencias/12-variantes-responsive-ocultas.md`): el original tiene una variante `<810px`
  donde `h1` baja a 30px, `.sub` se oculta y aparece `.solo-movil` con TEXTO distinto. No se asume: se mide.

## Fuera de alcance
- El header `#cabecera`, la sección `#caracteristicas` y el resto de la página: cada una es su propia fila del LEDGER.
