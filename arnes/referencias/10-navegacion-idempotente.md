# Navegación idempotente en la ruta activa

**Síntoma:** haces click en el enlace del navbar/menú que apunta a la página que YA estás viendo y algo se rompe o queda a medias: secciones ocultas, observers sin reinicializar, acordeones colapsados, animaciones en estado transitorio.

**Regla:** toda página clonada debe ser estable al pulsar su propio enlace activo. La auditoría no termina con hard load ni con navegación entre rutas distintas: también debe incluir el click repetido sobre la ruta actual.

**Cómo detectarlo:** un click hacia la misma ruta no siempre remonta el árbol del framework ni reejecuta una inicialización limpia. Es especialmente peligroso si la página usa `IntersectionObserver`, listeners manuales, mutaciones directas de `style.opacity/transform/height`, HTML inyectado (`dangerouslySetInnerHTML`) o variantes SSR ocultas. Validación mínima:
- Desktop 1440: hard load, click en el link activo, screenshot antes/después.
- Mobile 390: hard load, menú abierto, click en el link activo, screenshot después.
- Confirmar: sin overflow horizontal, bloques visibles estables, scroll top determinista, ningún elemento desaparece tras el click.

**Cómo arreglarlo:**
- Centraliza los links del navbar con el hook de ubicación de tu router (`useLocation()` o equivalente).
- Si el href normalizado coincide con la ruta actual: previene la navegación por defecto, cierra menú mobile y dropdowns, haz scroll top determinista y fuerza un remount/reset limpio de la página.
- Añade una capa global que capture también los anchors inyectados por HTML hacia la misma ruta (algunas páginas no usan el navbar del framework).
- Si una página no tiene link activo visible con el menú cerrado, no lo marques como fallo: el escenario aplicable es con el menú mobile abierto.

**Origen:** Destilado de proyectos reales de clonado Framer 2026.
