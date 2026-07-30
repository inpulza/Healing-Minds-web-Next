# Spec de sección: <id>

Fuente de verdad: `_arnes/spec/raw-<id>-<vp>.json` + `_arnes/captura/secciones/<id>-<vp>.png`.
Todo valor de este spec sale de ahí. Si un valor no está medido, mídelo — no lo estimes.

## Identidad
- id: `<id>` · selector original: `<selector>` · viewports medidos: <390, 768, 1440>
- Rol de la sección: <hero / features / testimonio / footer / …>
- Modo del proyecto: <clon | inspiracion>

## Geometría
- Contenedor: <w×h por viewport> · padding: <…> · layout: <flex col gap 20px / grid 3 cols gap 24px>
- Hijos directos (uno por línea): tag, dimensiones, offsets relevantes. Valores en px del raw JSON.

## Tipografía y color
- Por elemento de texto: familia / tamaño / peso / line-height / color (hex).
- Fondos y gradientes exactos (backgroundImage del raw).
- Tokens usados: referencia a design-tokens.json (p.ej. color primario #2b6cb0).

## Contenido
- Modo clon: texto VERBATIM del original, elemento por elemento.
- Modo inspiracion: texto REESCRITO para el cliente (longitud/tono similares). El original solo como nota.
- Assets: lista archivo-por-archivo (de captura/assets/ o sustitutos), con dimensiones destino.
- SVGs: pega el campo `svg` del raw JSON (inline completo).

## Interacciones y animación
- Hover/focus/active de cada elemento interactivo (qué cambia, con valores).
- Animaciones de entrada/scroll: trigger, propiedad, duración, easing. Si no hay: "ninguna".
- Comportamiento sticky/fixed si aplica.

## Responsive
- Por cada viewport: qué cambia (layout, tamaños, texto distinto, elementos que aparecen/desaparecen).
- OJO lección Framer: el texto puede CAMBIAR entre breakpoints, no solo ocultarse — verifica en el raw de cada viewport.

## Fuera de alcance
- Qué NO incluye esta sección (evita que el constructor invente).
