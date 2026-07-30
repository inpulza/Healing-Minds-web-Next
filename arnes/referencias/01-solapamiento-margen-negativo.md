# Solapamiento con margen negativo (la ilusión de superposición)

**Síntoma:** una tarjeta/caja parece "flotar" sobre la sección siguiente (típicamente un footer oscuro). Intentas darle margen negativo a la `<section>` contenedora, pero como esa sección tiene fondo blanco, el blanco tapa/corta el fondo oscuro de abajo y no hay superposición flotante real.

**Regla:** el margen negativo va en el HIJO que debe flotar (la tarjeta), nunca en la sección de fondo blanco. Muchos constructores visuales fingen el efecto con solo `border-radius`; en CSS/Tailwind eso obliga a `overflow-visible` frágil. La superposición se resuelve con geometría real del layout de bloque vertical, no con trucos.

**Cómo detectarlo:** en el original, mide dónde termina la tarjeta y dónde empieza la zona siguiente con `getBoundingClientRect()`. Si `card.bottom` cae DENTRO de la sección siguiente (no en su borde), hay overlap real que debes reproducir. Si solo coinciden en el borde, es ilusión óptica y basta el radius.

**Cómo arreglarlo:**
1. El contenedor padre conserva su fondo o transparencia: `<section class="relative z-10">`.
2. Al hijo que flota se le aplica el margen negativo equivalente a los píxeles que debe solapar: `class="... rounded-[30px] -mb-[80px] relative z-10"`.
3. La sección siguiente absorbe ese margen y se sube por debajo de la tarjeta de forma natural (block flow vertical), como si tuviera un z-index inferior.
4. Si el texto de la sección de abajo queda pisado por la tarjeta, corrige con `z-10` en la card superior y padding-top extra en la sección inferior; evita `padding-bottom: 0` y otros hacks.

**Origen:** Destilado de proyectos reales de clonado Framer 2026.
