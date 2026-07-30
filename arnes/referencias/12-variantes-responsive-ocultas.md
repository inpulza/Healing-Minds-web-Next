# Variantes responsive ocultas

**Síntoma:** mides el nodo "correcto" pero los valores no cuadran (una sección reporta `0x0`, un footer aparece en una posición imposible, un CTA no coincide), o el texto cambia entre desktop y mobile y no sabes cuál es el válido.

**Regla:** las páginas exportadas o recicladas suelen incluir VARIAS variantes en el DOM a la vez. En mobile es común que existan nodos desktop ocultos con `width: 0`, `height: 0` o wrappers SSR invisibles. Si buscas por `querySelector` o por texto sin filtrar visibilidad, puedes medir la variante equivocada. Y ojo: una variante responsive no cambia solo por visibilidad — también puede cambiar el TEXTO (p.ej. un heading corto en mobile vs uno largo en desktop). No asumas que el copy desktop vale para mobile.

**Cómo detectarlo:** filtra siempre nodos visibles antes de medir o buscar por texto:

```js
const isVisible = (el) => {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  const st = getComputedStyle(el);
  return r.width > 0 && r.height > 0 && st.display !== 'none' && st.visibility !== 'hidden';
};
```

`extract-section.mjs` ya elige la raíz VISIBLE y descarta nodos con `display:none`/`visibility:hidden`/`0x0` — por eso las variantes ocultas de Framer no se miden. Aun así, valida capturas de original y clon en el MISMO viewport mobile.

**Cómo arreglarlo:**
- Restaura la visibilidad scopeada al nodo exacto, nunca con override global de clases responsive.
- Controla el contenido por breakpoint: copy desktop en `>= 810px`, copy original de mobile en `< 810px`.
- Regla semántica: no uses `<footer>` para bloques internos (autor/share de un artículo) si la página tiene footer global, o `document.querySelector('footer')` medirá el bloque equivocado; usa `<div>`/`<section>`.

**Origen:** Destilado de proyectos reales de clonado Framer 2026.
