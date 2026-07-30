# Hooks del arnes

Estos hooks son enforcement, no documentacion.

Si el entorno soporta hooks, deben instalarse para bloquear acciones antes de que ocurran. Si el entorno no soporta hooks, `node arnes/scripts/gate.mjs` debe aplicar las mismas reglas antes de aprobar fases.

Reglas que estos hooks protegen:

- un constructor no puede escribir `AUDIT_PASS` ni `REAUDIT_PASS`;
- una seccion no puede cerrarse sin `aggregate.json` en PASS;
- una seccion no puede cerrarse sin trace y graders;
- la evidencia congelada del original no se sobrescribe;
- memoria, notas o capturas sueltas no aprueban trabajo.

Uso manual:

```text
node arnes/hooks/stop-verify-required.mjs --trial-dir=_arnes/eval-suite/<section>/<trial>
node arnes/hooks/prevent-constructor-audit-pass.mjs --trial-dir=_arnes/eval-suite/<section>/<trial> --content="..."
node arnes/hooks/prevent-frozen-artifact-overwrite.mjs --path=_arnes/captura/original-1440.png
```

