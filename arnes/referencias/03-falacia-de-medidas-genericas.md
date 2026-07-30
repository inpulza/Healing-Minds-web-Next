# La falacia de las medidas genéricas

**Síntoma:** rellenaste "huecos dimensionales" con clases utility estándar (`p-8`, `w-16 h-16`, `gap-6`, `rounded-xl`) "porque se parece", y el clon no calza: márgenes inflados, badges desproporcionados, íconos perfectamente redondos que en el original eran asimétricos.

**Regla:** las clases genéricas NO son evidencia. Cuando un contenedor interno (tarjeta, badge absoluto) no devuelva dimensiones exactas en el escaneo masivo (`rect.width === 0`, fallos en cascada), no inventes proporciones: mídelas en píxeles literales y tradúcelas a `[XXpx]`.

**Cómo detectarlo:** lanza una medición matemática sobre el nodo específico:

```javascript
const el = document.querySelector('.selector-objetivo');
const style = window.getComputedStyle(el);
const rect = el.getBoundingClientRect();
return { exactWidth: rect.width, exactHeight: rect.height,
  padding: style.padding, paddingTop: style.paddingTop,
  gap: style.gap, borderRadius: style.borderRadius };
```

`extract-section.mjs` ya vuelca `rect` (w/h) + padding/gap/radius/tipografía en píxeles reales por nodo; esta referencia explica por qué NO debes redondear esos valores a la utility "más cercana".

**Cómo arreglarlo:**
- Transforma el clonado "al ojo" en matemática pura: inyecta la altura, anchura, padding y gap literales.
- Ejemplos que enseñan: un ícono supuestamente redondo medía `51px x 41px` (óvalo), no `64x64`; un badge medía `30px x 40px`, no una caja cuadrada.
- Regla híbrida: en componentes anidados e insignias flotantes (`position: absolute`) nunca asumas utilities genéricas; usa el valor medido.

**Origen:** Destilado de proyectos reales de clonado Framer 2026.
