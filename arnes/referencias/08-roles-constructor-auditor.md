# Roles: constructor vs auditor

**Síntoma:** una sección falla y no sabes quién la corrige. El que construyó tiende a auto-aprobarse ("el DOM parece razonable, el build compila") y luego la captura demuestra que sigue mal. O el auditor se pone a arreglar el clon en vez de reportar.

**Regla:** son dos roles separados. El AUDITOR detecta el fallo, captura evidencia, documenta la causa probable y entrega un handoff accionable. El CONSTRUCTOR aplica el cambio, valida y registra el aprendizaje. El auditor NO ejecuta fixes salvo petición explícita; el constructor NO se auto-aprueba. La razón: quien construyó tiene sesgo de autoconfianza visual prematura y no puede ser juez de su propio trabajo.

**Cómo detectarlo:** esto ya está FORZADO por el gate de la fase 4:
- Una sección solo pasa a ✅ si existe `_arnes/verify/<id>-audit.md` con firma `AUDIT_PASS`/`REAUDIT_PASS`. El constructor no puede marcarla ✅ por su cuenta.
- El auditor debe correr en SESIÓN LIMPIA (plantilla `prompt-auditor.md`): si audita en la misma sesión que construyó, el veredicto no vale y el gate lo rechaza.
- La firma la emite SOLO el auditor al final de su procedimiento (fase 04-verify).

**Cómo arreglarlo:**
1. El constructor deja la sección en 🔎 y emite señal QA por archivos (no explica nada por chat).
2. El auditor abre sesión nueva, verifica contra spec + captura original con evidencia métrica y escribe el `<id>-audit.md`.
3. Según veredicto, el LEDGER se actualiza: PASS → ✅; FAIL → vuelve al constructor.
4. Todo hallazgo va con su número/medida; "mejorar visualmente" no es un handoff válido: di qué selector, qué medida comparar, qué bloque reutilizar y cómo validar.

**Origen:** Destilado de proyectos reales de clonado Framer 2026.
