# HTML reciclado que colapsa en altura

**Síntoma:** copias HTML del original (con sus textos y clases generadas) y al insertarlo en otra página/framework la sección aparece colapsada: un acordeón queda como una línea fina, desaparecen la altura, el gradiente o la composición. El DOM parece correcto, pero el resultado visual no.

**Regla:** no apruebes una página por tener el DOM correcto. El HTML de exportadores tipo Framer depende de contexto global de hidratación/animación y de reglas CSS base minificadas. Una extracción vía CSSOM suele devolver solo overrides de breakpoints y presets de texto, no todas las reglas base. Sin ellas, el layout se cae aunque el markup exista.

**Cómo detectarlo:**
- Mide el alto visible del original y del clon para la misma sección. Si el original mide cientos de px y el clon mide menos de ~120px, falta CSS base o el contenedor raíz está roto.
- Verifica top offsets en mobile con `getBoundingClientRect()`, no solo por captura.
- Señal inequívoca: una sección que debería medir cientos de px aparece como una línea, o el fondo/gradiente desaparece aunque el JSX esté presente. No es problema de contenido, es de hidratación/cascada.

**Cómo arreglarlo:**
1. Reutiliza primero textos, assets y estructura; toma captura DESPUÉS de insertar (no confíes solo en el DOM).
2. Si la sección pierde layout, reconstruye el wrapper visual en el framework de forma estable (React/CSS controlado) manteniendo los textos y assets reales.
3. Para secciones críticas y aisladas, puedes blindar el layout con estilos inline si la cascada global es frágil.
4. Reproduce medidas reales del original en mobile (label, H1, intro, primer panel) en vez de heredar el HTML incompleto.

**Origen:** Destilado de proyectos reales de clonado Framer 2026.
