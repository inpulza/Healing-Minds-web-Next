# Timing de animaciones en la auditoría

**Síntoma:** el diff visual falla solo por las animaciones de entrada. Una sección se ve bien en un navegador (estado final) pero, por timing de scroll/emulación, el usuario alcanza a ver el estado inicial `enter` antes del estado asentado, y las tarjetas quedan corridas o cortadas.

**Regla:** si una animación de entrada controla una posición CRÍTICA de layout, no puedes aprobar la sección solo porque un navegador muestre el estado final correcto. Estas animaciones suelen basarse en `IntersectionObserver` + un `transform` transitorio (p.ej. `translateX(final + 280px)`) que se retira al asentar; en mobile ese estado intermedio se ve de verdad.

**Cómo detectarlo:** valida todos los momentos de la animación, no solo el reposo:
- Emulación mobile en DevTools + viewport real si lo tienes.
- Estado inicial antes de scroll.
- Scroll lento y scroll rápido.
- Estado después de que el observer asienta.

`extract-section.mjs` espera ~400ms tras `scrollIntoViewIfNeeded` para dejar asentar la entrada, y `diff-visual.mjs` compara PNGs con un umbral configurable; aun así, si la captura cae a mitad de la transición el diff dispara — por eso hay que capturar el estado ya asentado y probar los estados intermedios a mano.

**Cómo arreglarlo:**
- En mobile, las tarjetas cuya posición es crítica no deben depender de un `transform` horizontal de entrada. Neutralízalo solo en mobile:

```css
@media (max-width: 809.98px) {
  .selector-track, .selector-track.enter, .selector-track.settled {
    transform: none !important;
    transition: none !important;
  }
}
```

- El fix debe permanecer mobile-only para no perder el comportamiento desktop aprobado.

**Origen:** Destilado de proyectos reales de clonado Framer 2026.
