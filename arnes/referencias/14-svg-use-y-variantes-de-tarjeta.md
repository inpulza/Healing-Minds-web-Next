# SVG `<use>` invisibles y variantes de tarjeta

**Síntoma:** iconos SVG que existen en el DOM pero no se ven, o tarjetas que se leen como texto plano sobre fondo blanco en vez de tarjetas blancas sobre una sección gris. La sección pasa los chequeos de DOM/conteo y aun así falla visualmente.

**Regla:** en secciones tipo detalle-de-servicio, valida el ESTADO VISIBLE, no la mera existencia en el DOM. Dos fallos típicos:
- Un `<use href="#...">` referencia un `<symbol>` que quedó ausente o colapsado tras el ensamblado del framework: el icono no renderiza.
- Faltan reglas de layout scopeadas: las tarjetas blancas se ven como texto plano porque no reciben su fondo/borde/padding.

**Cómo detectarlo:** comprueba el estado visible con números reales:
- ¿la fila de servicios tiene el conteo de tarjetas esperado?
- ¿los indicadores de check tienen `width/height` reales (no colapsados)?
- ¿el fondo de la sección es gris y el de cada tarjeta blanco?

`extract-section.mjs` vuelca el SVG real inline (campo `svg`, Ley 7), así que en el spec tienes el símbolo completo; el problema aparece al reensamblar, y por eso hay que validar con captura desktop y mobile — esta clase de bug es fácil de perder solo con inspección de texto/DOM.

**Cómo arreglarlo:**
1. Si los `<symbol>` no son fiables, usa un fallback visual SCOPEADO en el contenedor del icono, no un override global de SVG.
2. Aplica las reparaciones al nivel del PATRÓN compartido de detalle-de-servicio, para que todas las páginas que lo usan hereden el mismo layout aprobado.
3. Trata la tarjeta como un componente canónico único que solo recibe datos (icono, título, bullets, imagen, enlace); si una instancia no cumple el contrato visual, reemplázala por el componente canónico en vez de reconstruirla a mano.

**Origen:** Destilado de proyectos reales de clonado Framer 2026.
