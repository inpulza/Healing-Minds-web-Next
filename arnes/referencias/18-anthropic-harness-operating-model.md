# 18 - Modelo operativo Anthropic para el arnes

Lee esto cuando el trabajo requiera fidelidad estricta o cuando estes mejorando el arnes.

Fuente canonica local dentro del arnes instalado:

- `arnes/docs/harness/ANEXO-ANTHROPIC-HARNESS-OPERATING-MODEL.md`
- `arnes/docs/harness/INVESTIGACION-ANTHROPIC-HARNESSES.md`
- `arnes/docs/harness/PLAN-ARNES-ESTRICTO-RENDER-CONTRACT.md`

Resumen operativo:

1. Cada seccion es una `task`.
2. Cada intento es un `trial`.
3. Cada trial deja `trace.jsonl`.
4. El resultado se decide con graders.
5. El constructor no aprueba.
6. El auditor trabaja desde artefactos.
7. Los hooks/gates bloquean cierre sin evidencia.
8. La memoria de conversacion no es evidencia.

Si falta cualquiera de estas piezas, la seccion no puede marcarse como fiel.
