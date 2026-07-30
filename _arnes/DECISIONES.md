# DECISIONES — registro inmutable. Se añade, jamás se borra ni se revierte sin decisión humana.

Formato: `- [fecha] [seccion|global] DECISIÓN — porqué`

Ejemplo: `- [2026-07-10] hero Se usó grid y no flex en features porque el original colapsa a 1 col con grid-template.`

---

- [2026-07-30] [global] No se marcará `APROBADO_SPECS: sí`, `✅` ni `AUDIT_PASS` de forma retroactiva desde la sesión constructora.
- [2026-07-30] [global] La primera regularización agregó la home en una sola fila; una revisión independiente posterior exigió sustituirla por las doce secciones reales de `captura/secciones.json` sin presentar evidencia page-level como section-level.
- [2026-07-30] [home] La paridad no se forzará ocultando mapas, fotografías o logos que sí cargan en el candidato cuando la fuente pública falla en resolver lazy media durante la captura.
- [2026-07-30] [global] Resend y el cambio de dominio quedan fuera del PR final hasta autorización expresa.
- [2026-07-30] [blog] Las imágenes editoriales se clasificarán localmente por tema y elegirán de forma determinista entre varias familias de escena; el proveedor solo recibe una descripción editorial segura, nunca texto clínico aportado por pacientes.
- [2026-07-30] [blog] La vista previa del ojo reutilizará el mismo materializador y sanitizador del post público para mostrar hero, imágenes inline y estructura real sin publicar ni modificar el borrador.
- [2026-07-30] [admin] El ojo de contraseña solo alterna la visualización local del campo; no lee, cambia ni persiste credenciales de Vercel.
