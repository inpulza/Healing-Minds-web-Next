# 20 - Fresh-agent fire test

Objetivo: probar si el arnes funciona sin memoria de conversacion.

## Prompt minimo para el agente fresco

```text
Usa el arnes-clonador-web.
Objetivo: auditar/clonar la seccion Case studies.
Original: https://drardens.framer.website/
Clone local: http://localhost:3001/#case-studies
No apruebes nada sin artefactos, trace, graders y auditoria.
```

No le des pistas sobre max-width, hover, scroll o seams. El arnes debe llevarlo a descubrirlo.

## Debe detectar

- si la seccion es constrained o full-width;
- max-width y centrado en viewports anchos;
- hover/focus/click seguro;
- entrada y salida con scroll;
- relacion con seccion anterior y siguiente;
- si el scroll global tiene interpolacion/inercia;
- missing evidence como FAIL.

## Falla la prueba si

- aprueba por screenshot;
- no produce `trace.jsonl`;
- no produce `aggregate.json`;
- no ejecuta graders;
- no mira viewports anchos;
- no mira interacciones;
- no mira seams;
- se autoaprueba.

