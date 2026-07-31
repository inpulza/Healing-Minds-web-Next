# DECISIONES — registro inmutable. Se añade, jamás se borra ni se revierte sin decisión humana.

Formato: `- [fecha] [seccion|global] DECISIÓN — porqué`

Ejemplo: `- [2026-07-10] hero Se usó grid y no flex en features porque el original colapsa a 1 col con grid-template.`

---

- [2026-07-30] [global] No se marcará `APROBADO_SPECS: sí`, `✅` ni `AUDIT_PASS` de forma retroactiva desde la sesión constructora.
- [2026-07-30] [global] La primera regularización agregó la home en una sola fila; una revisión independiente posterior exigió sustituirla por las doce secciones reales de `captura/secciones.json` sin presentar evidencia page-level como section-level.
- [2026-07-30] [home] La paridad no se forzará ocultando mapas, fotografías o logos que sí cargan en el candidato cuando la fuente pública falla en resolver lazy media durante la captura.
- [2026-07-30] [global] Resend y el cambio de dominio quedan fuera del PR final hasta autorización expresa.
- [2026-07-31] [blog-privacy] Los campos administrativos destinados a IA que contengan la palabra completa `patient` o `paciente` se rechazan de forma fail-closed; el editor reformula el tema sin ese marcador. El contenido público mantiene el detector estrecho para no censurar artículos legítimos.
- [2026-07-31] [blog-privacy] La frontera fail-closed administrativa se amplía a `name/nombre`, incluyendo snake_case y camelCase, después de que Code Review demostrara que parsear etiquetas, wrappers y puntuación no converge. Esta ampliación no se aplica a contenido público ni imágenes.
