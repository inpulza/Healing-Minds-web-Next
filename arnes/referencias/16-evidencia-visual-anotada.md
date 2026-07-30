# Evidencia visual anotada (fallback manual)

**Síntoma:** necesitas auditar una diferencia visual pero no puedes correr los scripts de diff (`diff-visual.mjs` no aplica: no tienes las dos capturas alineadas, el entorno no levanta, o el hallazgo es interactivo y no sale en un PNG estático). Necesitas un método manual para mostrar el error de forma que otro pueda auditar al auditor.

**Regla:** este es el FALLBACK manual del diff automático. Todo hallazgo visual P0, P1 o P2 debe llevar evidencia visual anotada siempre que sea posible: una comparativa lado a lado, mismo viewport, misma posición de scroll, con marcas sobre el área problemática. Si no pudiste generar la imagen anotada, el reporte debe decir por qué y usar la mejor evidencia disponible.

**Cómo detectarlo (juego de diferencias, rondas):**
1. Lectura de página completa: orden de secciones, altura relativa, cambios de fondo, ritmo vertical, pesos visuales.
2. Sección por sección: textos exactos, ancho de contenedor, padding, gaps, alineación, cards, imágenes, iconos.
3. Comportamiento: scroll/reveal, sticky, hover, click, acordeones, tabs, sliders, forms, menú mobile.
4. Responsive: overflow horizontal, textos cortados, cards comprimidas, grids mal convertidos.
5. Medición cuando el ojo duda: `getBoundingClientRect()` + `getComputedStyle()` antes de concluir. Sin números no hay hallazgo.

**Cómo arreglarlo (formato de la anotación):**
- Comparativa: izquierda original, derecha clon.
- Cada marca: rectángulo/círculo rojo sobre la zona, etiqueta corta (`P1-01`, `P2-02`) y una nota de una línea (`Accordion missing`, `Card clipped`, `Wrong spacing`).
- Úsala para layout roto, elementos ausentes, secciones incompletas, diferencias claras de tamaño/posición/color, estados interactivos incorrectos y mobile divergente. No es obligatoria para hallazgos puramente técnicos sin manifestación visual.
- El handoff al constructor debe incluir la comparativa (o la ruta del artifact) para que vea exactamente qué corregir.

**Origen:** Destilado de proyectos reales de clonado Framer 2026.
