# El original roto no se clona pixel-perfect

**Síntoma:** el ORIGINAL se ve roto en una variante (overflow horizontal, texto o botón desplazado fuera del viewport, glitch visual) y dudas si debes clonarlo tal cual "por fidelidad".

**Regla:** pixel-perfect NO significa copiar roturas que impiden navegar o leer. Si el original está roto en una variante, se clona la INTENCIÓN visual y se conserva la usabilidad. No degrades un comportamiento mejor del clon para parecerte a un bug conocido del original.

**Cómo detectarlo:** el original merece una variante corregida cuando el bug:
- causa overflow visual o deja contenido fuera de pantalla (p.ej. un H1 con `left` negativo en mobile que empuja el hero fuera del viewport),
- oculta CTA, botones o texto principal,
- contradice una mejora de UX ya aceptada por el proyecto.
Mide con captura + `getBoundingClientRect()` para confirmar que es rotura, no diseño intencional.

**Cómo arreglarlo:**
1. Documenta el bug original con captura y métricas.
2. Mantén la fidelidad en los viewports donde el original SÍ está correcto (típicamente desktop).
3. Crea una variante corregida (típicamente mobile) sin overflow y con el contenido visible.
4. Declara la divergencia en la señal QA y regístrala en DECISIONES para que QA/humano la apruebe conscientemente.

El arnés respeta esto: la fase 04 del auditor manda que "si el original está roto, la divergencia documentada en DECISIONES manda — no exijas clonar bugs". No pidas al constructor restaurar un comportamiento roto del original.

**Origen:** Destilado de proyectos reales de clonado Framer 2026.
