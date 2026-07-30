# Reuse-first (no reconstruyas lo aprobado)

**Síntoma:** vas a construir una sección que "suena" a algo que ya construiste en otra página (mismo título visual, misma estructura: CTA, FAQ, testimonios, footer…). Reconstruirla desde cero gasta tiempo y tokens y suele producir una versión inferior o divergente.

**Regla:** antes de construir una sección nueva, está PROHIBIDO implementarla desde cero hasta demostrar que no existe una fuente aprobada reusable. Y cuando reuses, reusa el bloque completo: `markup + scope + CSS + comportamiento + assets`. Reciclar solo el fragmento o solo el componente no basta (el resultado aprobado suele estar atomizado en HTML + scope CSS + lógica JS).

**Cómo detectarlo:** el "registro de secciones" ya está IMPLEMENTADO en el arnés:
- El **LEDGER** (`_arnes/LEDGER.md`) es el registro vivo: cada sección con su `id`, `estado` (✅ = verificada) y ruta de `codigo`. Búscala ahí antes de construir.
- `arnes/examples/biblioteca/` guarda secciones canónicas reutilizables entre proyectos.
- La fase 03 (build) exige el paso REUSE-FIRST: buscar una sección ✅ equivalente en el LEDGER o en la biblioteca antes de empezar.

**Cómo arreglarlo:**
1. Busca por texto, nombre visual y estructura en las páginas ya clonadas (filas ✅ del LEDGER) y en la biblioteca.
2. Identifica en qué forma existe: componente, fragmento markup, bloque CSS, lógica de comportamiento y wrapper/scope necesario.
3. Reusa el bloque aprobado completo; cambia solo textos/assets si la página lo exige.
4. Captura antes/después para confirmar que el bloque no perdió su contexto al moverlo.

**Origen:** Destilado de proyectos reales de clonado Framer 2026.
