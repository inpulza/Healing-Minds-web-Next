# Adaptadores por herramienta

Los genera `npx arnes-clonador-web init` (CLAUDE.md, AGENTS.md, GEMINI.md, .cursorrules,
.windsurf/rules/arnes-clonador-web.md). Todos contienen el mismo bloque: "lee arnes/SKILL.md;
el estado vive en _arnes/". Si tu herramienta usa otro archivo bootstrap, copia ese bloque ahí.
El marcador `<!-- arnes-clonador-web -->` los hace idempotentes: init nunca duplica ni destruye.
