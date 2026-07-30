# Transforms y mediciones (carruseles, sliders)

**Síntoma:** obtienes medidas distintas cada vez que mides una sección tipo carrusel/slider. Calculas el destino de un track y las tarjetas aterrizan cortadas o corridas, aunque el código "parezca" correcto.

**Regla:** cuando un elemento se anima con `transform`, `getBoundingClientRect()` devuelve la posición transformada/interpolada, NO la geometría natural del layout. Si calculas el destino usando esos rects durante la propia transición, sumas o restas dos veces el desplazamiento y el track aterriza mal.

**Cómo detectarlo:** este error no se ve leyendo código ni DOM estático; requiere captura visual y métricas DESPUÉS del scroll/animación. Para medir la geometría real:

1. Lee `getComputedStyle(track).transform`.
2. Extrae el desplazamiento X: `const dx = new DOMMatrixReadOnly(transform).m41`.
3. Geometría natural = `rect.left - dx` (descuenta el transform).
4. Calcula el destino con el ancho real del viewport y el ancho total del track.
5. Aplica el resultado con variable CSS + clases, no con offsets fijos.

`extract-section.mjs` ya descuenta el transform (`rect - m41/m42` vía `DOMMatrixReadOnly`) al volcar cada nodo — esta referencia explica el porqué y qué revisar si el aterrizaje del track aún falla.

**Cómo arreglarlo (regla de auditoría visual):**
- Si el track completo cabe en pantalla, la primera tarjeta debe aterrizar en el gutter izquierdo real.
- Si el track es más ancho que el viewport, no puedes cumplir a la vez "primera tarjeta completa" y "última tarjeta completa": prioriza que la última no quede cortada y documenta la decisión.

**Origen:** Destilado de proyectos reales de clonado Framer 2026.
