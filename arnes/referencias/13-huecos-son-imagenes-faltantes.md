# Los huecos suelen ser imágenes faltantes

**Síntoma:** un hueco vertical grande entre bloques que "parece espaciado intencional". Lo replicas con `height` y el clon queda con un vacío raro donde el original tenía contenido.

**Regla:** antes de replicar un hueco grande con altura fija, descarta que sea una imagen interna que no extrajiste. Un espacio en blanco gigante es, con frecuencia, un asset que la primera auditoría no listó desde el DOM original. Si el hueco coincide con la posición de una imagen en el original, inserta la imagen real, no un espaciador.

**Cómo detectarlo:** extrae las imágenes VISIBLES del original ordenadas por posición vertical:

```js
Array.from(document.images)
  .map((img) => ({
    src: img.currentSrc || img.src,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
    rect: img.getBoundingClientRect(),
  }))
  .filter((i) => i.rect.width > 20 && i.rect.height > 20)
  .sort((a, b) => a.rect.top - b.rect.top);
```

Cruza cada imagen con los landmarks de texto cercanos (títulos de sección, subtítulos) para saber entre qué bloques va. `capture.mjs` ya descarga los assets del original a `captura/assets/manifest.json` (imgs + backgrounds), así que la imagen real probablemente ya está en disco; esta referencia recuerda mirar ahí antes de inventar un `height`.

**Cómo arreglarlo:**
- Inserta la imagen real en la posición donde el original la tiene y elimina los espaciadores manuales.
- Usa `naturalWidth/naturalHeight` para respetar la relación de aspecto.
- Verifica con captura que el hueco desaparece y el ritmo vertical coincide con el original.

**Origen:** Destilado de proyectos reales de clonado Framer 2026.
