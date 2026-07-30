# Extracción quirúrgica, sin placeholders

**Síntoma:** el JSON de extracción es gigante (decenas de miles de caracteres), el modelo empieza a saltarse bloques visuales y aparecen placeholders como `{/* aquí van las tarjetas */}`, `Icon goes here`, Lorem Ipsum o SVGs ausentes. También: el inventario de secciones sale vacío o con una sola macro-sección enorme.

**Regla:** JAMÁS extraigas `document.body` ni `html` completos. Un cuerpo entero devolvió ~60.000 caracteres de datos espaciales y colapsó la resolución analítica del agente. Se extrae UNA sección a la vez. Un placeholder no es una simplificación aceptable: es una extracción fallida.

**Cómo detectarlo:**
- `extract-section.mjs` ya rechaza `--selector=body|html` (Ley 6) y mide una sola sección; si te tienta apuntar al body, el propio script te frena.
- Si `captura/secciones.json` (lo genera `capture.mjs`) trae 0 secciones o una sola de altura enorme, el inventario está mal: la página no cuelga de `main`/`body > *` como espera el script, o el wrapper real está más adentro. Ajusta el selector raíz o inventaría a mano las secciones visibles (`height > 80`, visibles).
- Busca en el código del clon comentarios placeholder o texto genérico: es señal de contexto saturado.

**Cómo arreglarlo:**
1. Identifica el `id`/clase del wrapper de SOLO UNA sección (Hero, Benefits, Footer…).
2. Extrae el DOM solo sobre ese nodo: el JSON queda pequeño y puedes clonar texto exacto, assets y SVGs reales sin "huecos lógicos".
3. Repite sección por sección. Cada SVG sale del campo `svg` del raw, inline y completo.
4. Si ya metiste placeholders, no los "rellenes de memoria": vuelve a extraer la sección real.

**Origen:** Destilado de proyectos reales de clonado Framer 2026.
