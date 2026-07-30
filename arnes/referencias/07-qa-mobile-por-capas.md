# QA mobile por capas

**Síntoma:** en mobile la página "pasa" a primera vista, pero al usarla de verdad se ve mal: navbar sticky con logo oscuro sobre barra oscura, acordeones que dejan la sección vacía, cards que existen en el DOM pero están ocultas por clases responsive, CTA que diverge del común.

**Regla:** mobile NO es una comprobación final rápida; es una auditoría propia por capas. Un nodo en el DOM no equivale a un nodo visible. Valida con mediciones, no solo con screenshots. Cualquier override de clases responsive debe estar scopeado a la sección/página que lo necesita: nunca global.

**Cómo detectarlo:** audita en capas independientes para no perderte en la página completa:
1. Navegación/header: logo, links, CTA, sticky; contraste del logo en top, sticky con scroll y menú abierto.
2. Fidelidad visual: hero, textos, cards, fondos, gaps, radius, shadows por viewport (mobile 360/390, laptop, desktop 1440).
3. Responsive: overflow horizontal (`documentElement.scrollWidth` vs `innerWidth`), cards cortadas, variantes ocultas por clases responsive, texto/botones comprimidos.
4. Componentes interactivos: buttons, acordeones, tabs/toggles, forms; estado inicial + interacción + estado posterior.
5. Animaciones y scroll: reveal, carruseles con transform, sin layout shift brusco.
6. Reuse y consistencia: bloques comunes (CTA/FAQ) reciclados, no variantes locales.

Para decidir si un nodo cuenta, comprueba `display`, `visibility` y `getBoundingClientRect()`.

**Cómo arreglarlo:**
- En sticky mobile, valida el contraste real del logo en los tres estados.
- En acordeones reciclados, no permitas "todos cerrados" salvo que la sección reserve altura estable: deja al menos un item abierto.
- Validación mínima: mobile 360 y 390, desktop 1440, tap en dos ítems, sin overflow horizontal, y confirmar que al abrir/cambiar un ítem la sección nunca queda sin contenido visible.

**Origen:** Destilado de proyectos reales de clonado Framer 2026.
