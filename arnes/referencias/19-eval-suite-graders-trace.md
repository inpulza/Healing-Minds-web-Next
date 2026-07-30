# 19 - Eval-suite, graders y trace

Usa esta referencia cuando una seccion entre en ruta estricta.

## Comandos base

Crear trial:

```text
node arnes/scripts/eval-suite.mjs start --section=<id> --role=constructor --clone-url=<url>
node arnes/scripts/eval-suite.mjs start --section=<id> --role=auditor --clone-url=<url>
```

Ejecutar graders:

```text
node arnes/scripts/graders/run-graders.mjs --section=<id> --trial=<trial-id>
```

Listar trials:

```text
node arnes/scripts/eval-suite.mjs list --section=<id>
```

## PASS real

Una seccion solo puede pasar si:

- existe `task.json`;
- existe `trial.json`;
- existe `trace.jsonl`;
- existe `graders/code-results.json`;
- existe `aggregate.json`;
- `aggregate.json` dice `PASS`;
- el auditor externo firma PASS;
- el gate tambien pasa.

## FAIL obligatorio

Falla si:

- falta un viewport requerido;
- falta interaction film;
- falta scroll physics;
- faltan seams;
- el clone es full-width cuando el original es constrained;
- el constructor intenta aprobar;
- falta trace;
- falta aggregate.

