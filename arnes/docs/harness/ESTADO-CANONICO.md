# Estado canonico del arnes

Fecha: 2026-07-09

Ubicacion canonica:

```text
C:\Desarrollo\Clonar web con arnes
```

Version actual:

```text
3.0.0
```

Decision:

El arnes oficial vive en `C:\Desarrollo\Clonar web con arnes`. Las copias dentro de proyectos cliente son instalaciones consumidoras creadas o actualizadas por el CLI.

La carpeta de Bedas/Dr. Ardens:

```text
C:\Users\mande\OneDrive\++++Mandex\+++++++++AGENCIA MKD\+++++ INPULZA\Clientes\41. Bedas Mental Health\13.Clone para web\arnes
```

ya fue actualizada desde el oficial con:

```text
node C:\Desarrollo\Clonar web con arnes\cli\cli.mjs update
```

Estado implementado:

- Skill 3.0 con ruta estricta Render Contract + Eval Suite.
- Eval-suite con task/trial.
- Trace JSONL.
- Code-based graders base.
- Gate integrado con eval-suite.
- Hooks de bloqueo.
- Probe generico `interaction-film`: video, frames, hover, focus, click seguro, scroll lento/rapido y trace.
- Probe generico `scroll-physics`: root de scroll, comportamiento CSS, timeline de entrada/salida, samples y trace.
- Probe generico `seams`: encaje con seccion anterior/siguiente, gaps/overlaps, screenshots y trace.
- Docs oficiales de investigacion, plan y modelo operativo.
- Tests oficiales pasando: `npm.cmd test` => 46/46.

Pendiente para considerar el arnes completamente cerrado:

- Auditor externo usando esos probes de punta a punta.
