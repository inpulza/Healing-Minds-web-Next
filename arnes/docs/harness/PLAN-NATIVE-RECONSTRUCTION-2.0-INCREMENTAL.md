# Plan incremental - Native Reconstruction 2.0

Estado: beta de control y calibracion ejecutable; construccion bloqueada hasta disponer de un host elegible para NR-02.

Repositorio canonico: `C:\Desarrollo\Clonar web con arnes`

## 1. Regla de nombre y version

Este documento define la linea de capacidad **Native Reconstruction 2.0**. No cambia ni rebaja el `package.json`, que actualmente declara `3.0.0`, y no crea otra copia del arnes. El numero 2.0 identifica el nuevo metodo de reconstruccion nativa, no el semver actual del paquete.

La version anterior del flujo se conserva operativa hasta que el piloto completo alcance el gate de promocion. Las instalaciones dentro de proyectos cliente siguen siendo consumidores; nunca pasan a ser el arnes oficial.

## 2. Fuentes de verdad

El trabajo debe leer, en este orden:

1. `docs/harness/PLAN-NATIVE-RECONSTRUCTION-2.0-INCREMENTAL.md`: ejecucion incremental y estado de checks.
2. `docs/harness/PLAN-ARNES-ESTRICTO-RENDER-CONTRACT.md`: captura, Render Contract, probes, eval-suite, trazas, graders y auditor externo ya definidos.
3. Consenso resuelto `harness-native-reconstruction` del panel de agentes: arquitectura nativa, aislamiento, pureza y piloto.
4. Veredicto independiente de Claude Code: agrega obligatoriamente la prueba T14 de deriva controlada.

Si dos documentos parecen contradecirse, se detiene la tarea y se registra la contradiccion. No se resuelve por intuicion ni reescribiendo silenciosamente la regla.

## 3. Resultado buscado

El arnes observa una web original como oraculo de comportamiento, produce un contrato descriptivo agnostico y permite que una sesion nueva reconstruya una implementacion editable en Next.js, CSS y Motion o Framer Motion.

El entregable final debe cumplir simultaneamente:

- fidelidad visual y de comportamiento medida contra un baseline congelado;
- cero runtime, hidratacion, modulos, HTML o CSS reutilizado de Framer Sites, Webflow u otra plataforma de origen;
- cero dependencias de red no aprobadas durante la navegacion del clon;
- componentes y tokens editables por un desarrollador sin acceso al original;
- trazabilidad desde cada requisito del contrato hasta su implementacion y su prueba;
- auditoria ejecutada por una sesion distinta del constructor.

Las imagenes aprobadas pueden usarse temporalmente como activos. Framer Motion esta permitido. El runtime de Framer Sites no esta permitido.

## 4. Arquitectura obligatoria de cuatro roles

| Rol | Puede leer | Puede escribir | Prohibido |
| --- | --- | --- | --- |
| Capturador | original mediante navegador instrumentado | `forensics/`, `audit-baseline/` | contrato y entregable |
| Sintetizador | `forensics/` | contrato versionado, confianza y huecos | entregable |
| Constructor | contrato y activos aprobados | proyecto nativo, mapa de procedencia | original, `forensics/`, boveda, gates |
| Auditor | `audit-baseline/`, contrato y entregable | informes inmutables y veredicto | arreglar el clon o relajar gates |

El orquestador concede accesos por fase y registra cada lectura sensible. Una afirmacion de separacion sin prueba de permisos no cuenta como aislamiento.

## 5. Artefactos y ubicacion

Cada piloto vive en un directorio de ejecucion separado del codigo del arnes:

```text
_arnes/native-reconstruction/<pilot-id>/
  manifest.json
  ledger.jsonl
  forensics/
  audit-baseline/
  vault/
  contract/
    render-contract.v0.json
    confidence-report.json
    traceability.json
  approved-assets/
  deliverable/
  reports/
```

Reglas:

- `audit-baseline/` queda congelado por hash antes de construir.
- `ledger.jsonl` es append-only.
- `vault/` esta sellada, sin acceso por defecto y con expiracion declarada.
- El constructor recibe una vista materializada que contiene solo `contract/` y `approved-assets/`.
- Todo informe registra fecha, herramienta, version, viewport, estado y hashes de entrada.
- Ningun artefacto ejecutable del origen entra en `contract/` o `deliverable/`.

## 6. Metodo de ejecucion por micro-lotes

Cada lote sigue exactamente este ciclo:

1. Abrir una sola tarea con ID.
2. Registrar estado inicial y archivos permitidos.
3. Escribir primero la prueba que debe fallar cuando el control no existe.
4. Ejecutar la prueba y preservar la evidencia roja.
5. Implementar el cambio minimo.
6. Ejecutar la prueba nueva, `npm.cmd test` y `npm.cmd run eval`.
7. Entregar al auditor independiente.
8. Marcar `PASS`, `FAIL` o `BLOCKED` con enlaces y hashes.
9. No abrir el lote siguiente si el gate actual no esta cerrado.

Un `FAIL` es informacion valida. Esta prohibido cambiar umbrales, eliminar evidencias o ampliar allowlists durante la misma corrida para obtener un `PASS`.

## 7. Etapa 0 - Baseline, definiciones y calibracion

### NR-00 - Congelar el estado de partida

- [x] Guardar commit, rama, `git status --short`, version de Node y version del paquete.
- [x] Identificar cambios ya existentes sin modificarlos ni atribuirlos a esta etapa.
- [x] Ejecutar `npm.cmd test` y preservar salida completa.
- [x] Ejecutar `npm.cmd run eval` y preservar salida completa.
- [x] Confirmar que las pruebas no alteraron archivos fuente versionados.

Gate: ambos comandos terminan correctamente y existe evidencia reproducible del estado inicial. Si fallan, se corrige primero la salud del arnes actual; no se inicia Native Reconstruction.

Resultado 2026-07-13: `PASS`.

- Commit de partida: `101d2ebee398c376709f50dbc3ed391b03b8ef9a`.
- Rama: `main`.
- Node: `v24.14.1`; npm: `11.11.0`; paquete: `3.0.0`.
- Salud: `npm.cmd test` -> 47/47; `npm.cmd run eval` -> `EVAL GOLDEN: OK`.
- El worktree ya estaba sucio antes de NR-00: 10 archivos versionados modificados y varios modulos/documentos sin seguimiento pertenecientes a la evolucion Render Contract. NR-00 no los revirtio ni los atribuye al nuevo plan.
- El estado de archivos fuente antes y despues de las pruebas fue el mismo. El unico artefacto agregado deliberadamente por esta sesion es este plan.

### NR-01 - Inventario reproducible del control negativo

Objetivo: medir `C:\Desarrollo\healcure-clone` sin modificarlo.

- [x] Registrar estructura, archivos, tamanos y hashes relevantes.
- [x] Contar referencias a dominios de Framer y a cualquier plataforma de origen.
- [x] Inventariar HTML, CSS, JS, hidratacion, snapshots, vendor assets y solicitudes de red.
- [x] Separar activos de contenido aprobables de runtime o infraestructura prohibida.
- [ ] Repetir el inventario desde una sesion independiente.

Gate: dos ejecuciones producen el mismo inventario, salvo campos de tiempo declarados. Este clon se conserva como benchmark visual y debe fallar pureza; nunca se promociona como arquitectura final.

Resultado de primera ejecucion, 2026-07-13: `PASS_AS_NEGATIVE_CONTROL`. El clon original no fue modificado. Se confirmaron 8482 apariciones de `framer` en la home, 52815 en los once snapshots, 76 modulos `.mjs` locales y solicitudes de runtime a Framer al navegar con terceros bloqueados. Estado del gate: `WAITING_INDEPENDENT_REPRODUCTION`.

Evidencia: `docs/harness/reports/NR01-INVENTARIO-HEALCURE-CONTROL-NEGATIVO-2026-07-13.md`.

Actualizacion 2026-07-14: se agrego `scripts/purity-inventory.mjs` con libreria y cuatro pruebas. Dos ejecuciones sobre `healcure-clone` produjeron JSON identicos, `inventorySha256=90193df35797f91c3c0ecd97f09bf6777425bebd2d6498de0814b158c12bcff2` y `NOT_PURE_NATIVE`. Esto cierra la reproducibilidad automatica de la medicion estatica. La repeticion por sesion independiente fue diferida por decision humana y sigue pendiente antes del gate final.

Evidencia automatica: `docs/harness/reports/NR01-HEALCURE-PURITY-INVENTORY-2026-07-14.json`.

### NR-02 - Modelo de amenazas y permisos

- [x] Definir matriz maquina-legible de lectura y escritura por rol.
- [x] Crear canario unico dentro de `vault/` y `forensics/`.
- [x] Definir que eventos de acceso se registran y que proceso puede leerlos.
- [x] Especificar el rechazo inmediato ante lectura no autorizada.

Gate: la prueba T01 detecta un intento de lectura del constructor y el canario no aparece en contrato, entregable ni reportes del constructor.

Resultado 2026-07-14: politica, CLI, vista materializada, canarios, ledger, protocolo de host y verificador implementados. Suite `62/62` y eval golden en PASS. La prueba adversarial bloqueo los dos canarios y no detecto fugas. El adaptador Node demostro aislamiento de archivos y procesos hijos, pero falla correctamente por no aislar red. El cierre permanece en `WAITING_ELIGIBLE_HOST_ADAPTER`; una autoatestacion o un adaptador parcial no pueden emitir `host-workspace-root`.

Evidencia: `docs/harness/reports/NR02-ROLE-ISOLATION-2026-07-14.md`.

La futura instalacion de prueba sera `C:\Desarrollo\pruebas-arnes\native-reconstruction-v2-pilot-001`. Es un consumidor desechable; la unica fuente oficial sigue siendo `C:\Desarrollo\Clonar web con arnes`. Se crea cuando NR-03 y NR-05 tengan schemas y fixtures en PASS. No ejecuta el Constructor hasta disponer de un adaptador elegible con filesystem, red, procesos hijos y navegador original bloqueados o contenidos.

### NR-03 - Especificar artefactos y hashes

- [x] Esquema de `manifest.json`.
- [x] Esquema append-only de `ledger.jsonl`.
- [x] Manifiesto de `forensics/` y `audit-baseline/`.
- [x] Politica provisional de boveda, autorizacion, expiracion y purga.
- [x] Regla de congelacion y verificacion de hashes.

Gate: una alteracion posterior del baseline es detectada y bloquea la auditoria.

Resultado 2026-07-14: manifiesto congelado, hashes de arbol, ledger encadenado, head anti-truncamiento, lock de escritor y politica de boveda implementados. Los fixtures detectan cambios, altas, bajas, manipulacion y autorizaciones vencidas. Suite `68/68` y eval golden en PASS. Gate NR-03: `PASS`.

Evidencia: `docs/harness/reports/NR03-ARTIFACT-INTEGRITY-2026-07-14.md`.

### NR-04 - Calibrar el suelo de ruido

- [x] Capturar la referencia controlada al menos cinco veces por viewport, estado y region sin cambios intencionales.
- [x] Medir varianza de pixeles, cajas, tipografia, temporizacion, scroll y red.
- [x] Identificar animaciones no deterministas, contenido dinamico y carga de fuentes.
- [x] Proponer tolerancias por metrica y region basadas en datos, no un porcentaje global arbitrario.
- [x] Congelar la matriz `viewport x estado x scroll x interaccion x metrica`.

Gate: cada tolerancia tiene distribucion observada, justificacion y propietario. Sin calibracion no se aprueba fidelidad.

Resultado controlado 2026-07-17: `PASS_CONTROLLED`. Se implementaron el schema, analizador, CLI y congelacion anti-sobrescritura. La prueba amplia ejecuto 60 capturas: tres viewports (`390`, `768`, `1440`), cuatro estados (`initial`, `hover`, `scroll-slow`, `scroll-fast`) y cinco contextos de navegador limpios por celda. Las 12 celdas tienen distribuciones y tolerancias locales propiedad de `browser-auditor`. Hash del analisis: `6e01ab93b0f6de784445846a5f75467d601416cdd15e73a73a693c0319e4c44b`.

Evidencia: `C:\Desarrollo\pruebas-arnes\nr04-controlled-20260717`. La calibracion debe repetirse sobre cada referencia real y region del piloto; el `PASS_CONTROLLED` valida el mecanismo, no concede fidelidad a un clon futuro. La disciplina red-before-green no quedo preservada como artefacto anterior a la implementacion en este lote, por lo que la conformidad de proceso se registra como parcial aunque el gate funcional y sus controles negativos si pasan.

### NR-05 - Contrato de renderizado v0

- [x] Definir IDs semanticos propios, paginas, secciones, componentes y uniones.
- [x] Definir tokens, restricciones de layout, geometria y deltas responsive.
- [x] Definir tipografia resuelta, color, paint, capas, overflow y ancestors relevantes.
- [x] Definir estados, disparadores, precondiciones, resultados, duracion, easing y fisica.
- [x] Definir sticky, scroll root, seccion anterior/siguiente, multimedia y accesibilidad funcional.
- [x] Definir activos aprobados, procedencia, sustitucion y carga.
- [x] Marcar cada observacion como medida o inferida, con confianza y hueco explicito.
- [x] Rechazar HTML, CSS, scripts, clases, selectores, modulos, hidratacion e IDs de proveedor.
- [x] Justificar cada campo por una decision del constructor o una asercion del auditor.

Gate: T02 traza cada requisito del brief a un campo y a una prueba; el linter rechaza campos o valores de proveedor.

Resultado 2026-07-14: schemas de brief y Render Contract, linter semantico, pointers, trace, decisiones, aserciones, gaps y seis controles positivos/negativos implementados. Suite `74/74` y eval golden en PASS. T02: `PASS`.

Evidencia: `docs/harness/reports/NR05-RENDER-CONTRACT-V0-2026-07-14.md`.

Scaffold creado en `C:\Desarrollo\pruebas-arnes\native-reconstruction-v2-pilot-001`. Estado `SCAFFOLD_ONLY`; la ejecucion del Constructor sigue bloqueada hasta un adaptador host elegible.

### NR-06 - Probar agnosticidad antes de estabilizar el contrato

- [ ] Modelar una interaccion compleja observada en Framer.
- [ ] Modelar una interaccion compleja observada en Webflow.
- [ ] Verificar que ambas usan el mismo vocabulario y no campos especificos de proveedor.
- [ ] Registrar todo caso que exija extension del esquema.

Gate: T08 representa ambos casos sin proveedor en el contrato. Si no puede, el contrato vuelve a NR-05.

### NR-07 - Deriva controlada

- [ ] Congelar un `audit-baseline/` valido.
- [ ] Modificar deliberadamente el sitio de referencia despues de congelarlo.
- [ ] Auditar el mismo entregable contra el baseline congelado.
- [ ] Clasificar la diferencia del sitio vivo como `SOURCE_DRIFT`, no como fallo del clon.
- [ ] Comprobar que el auditor sigue evaluando contra la referencia congelada.

Gate: T14 distingue deriva del original de regresion del entregable sin abrir una excepcion de fidelidad.

## 8. Etapa A - Gates y controles adversariales

### NR-A1 - Gate de aislamiento

- [ ] Aplicar permisos reales por rol.
- [ ] Registrar accesos y ejecutar T01.
- [ ] Rechazar cualquier fuga del canario.

### NR-A2 - Gate de pureza binaria

- [ ] Allowlist de dependencias y dominios.
- [ ] Analisis de fuentes, dependencias, build, chunks, HTML generado e hidratacion.
- [ ] Navegacion con terceros bloqueados salvo allowlist.
- [ ] Mapa contrato -> componente -> archivo -> dependencia.
- [ ] Fixture adversarial con runtime prohibido renombrado.

Gate: cero runtime de origen y cero solicitudes no aprobadas. No existen waivers.

### NR-A3 - Gate de fidelidad y comportamiento

- [ ] Comparacion por region, viewport y estado usando tolerancias NR-04.
- [ ] Scripts de hover, focus, click, scroll lento/rapido, sticky, overflow y multimedia.
- [ ] Comprobacion de seams con seccion anterior y siguiente.
- [ ] Evidencia de max-width y comportamiento en pantallas anchas y moviles.

Gate: cada comportamiento tiene estado inicial, accion, timeline y resultado observable. Un promedio visual no puede ocultar un fallo localizado.

### NR-A4 - Gate de build y mantenibilidad

- [ ] `next build`, typecheck y lint.
- [ ] Rutas y activos locales/aprobados.
- [ ] Componentes legibles y tokens centralizados.
- [ ] Limite declarado de valores magicos y duplicacion.
- [ ] Mutacion dirigida de texto, token y timing.

Gate: T12 y T13 prueban que el cambio es localizado y realizable sin el original.

### NR-A5 - Control negativo completo

- [ ] Ejecutar todos los gates contra `healcure-clone` sin modificarlo.
- [ ] Confirmar que puede conservar buena fidelidad visual y aun asi falla pureza.
- [ ] Emitir razones concretas, rutas, dominios y hashes.
- [ ] Confirmar que el auditor puede decidir solo con baseline, contrato y entregable.

Gate de Etapa A: el control real y el runtime renombrado fallan; el fixture nativo correcto pasa; el auditor no consulta el sitio vivo.

## 9. Etapa B - Primera reconstruccion ciega

### NR-B1 - Seleccionar el piloto

La seccion debe incluir al menos responsive, una interaccion, movimiento ligado al scroll o sticky y una union visible con otra seccion. No se selecciona solo por ser facil.

- [ ] Registrar selector semantico y limites de seccion.
- [ ] Registrar seccion anterior y siguiente.
- [ ] Fijar viewports, estados, presupuesto de iteraciones y criterio manual.
- [ ] Confirmar que el constructor no participo en captura o sintesis.

### NR-B2 - Capturar y sintetizar

- [ ] Capturador produce forensics y baseline.
- [ ] Sintetizador produce contrato, confianza, huecos y activos aprobados.
- [ ] Auditor valida suficiencia del baseline antes de construir.
- [ ] Se congela el paquete de entrada del constructor.

### NR-B3 - Construir a ciegas

- [ ] Abrir sesion nueva sin memoria del original.
- [ ] Entregar solo contrato, activos aprobados y stack destino.
- [ ] Construir Next.js/CSS/Motion nativo.
- [ ] Registrar decisiones, componentes y trazabilidad.
- [ ] Ante un hueco, emitir `CONTRACT_INCOMPLETE`; no improvisar mirando el original.

### NR-B4 - Auditar independientemente

- [ ] Ejecutar aislamiento, contrato, pureza, fidelidad, comportamiento, build y mantenibilidad.
- [ ] Ejecutar mutacion dirigida y edicion humana.
- [ ] Ejecutar un hueco deliberado del contrato para demostrar fallo honesto.
- [ ] Preservar reportes y hashes.

Gate de Etapa B: pureza e aislamiento al 100 %, fidelidad dentro de tolerancias calibradas, comportamiento completo, build correcto, edicion superada y veredicto de auditor independiente.

## 10. Etapa C - Prueba representativa y decision

- [ ] Reconstruir tres clases distintas de seccion Framer.
- [ ] Incluir al menos una interaccion dificil, un seam y responsive amplio.
- [ ] Ejecutar una prueba estructural Webflow.
- [ ] Medir coste, tiempo, iteraciones, causas, ruta manual y aperturas de boveda.
- [ ] Medir coste de modificar contenido, estilo y timing despues de aprobar.
- [ ] Ejecutar T1: saneamiento de snapshot y reemplazo nativo con exactamente los mismos gates.
- [ ] Decidir politica final de boveda usando sus accesos reales y su utilidad demostrada.

Gate de promocion: decision humana basada en informes completos. Salidas posibles: promover la via nativa, ajustar y repetir, aceptar un hibrido solo si sigue siendo puro y nativo, o detener.

## 11. Catalogo obligatorio de pruebas

| ID | Prueba | Resultado obligatorio |
| --- | --- | --- |
| T01 | Canario de aislamiento | detecta toda lectura no autorizada |
| T02 | Trazabilidad brief -> contrato -> asercion | cobertura completa y validable |
| T03 | Reconstruccion ciega | constructor opera sin original ni forensics |
| T04 | Suficiencia del baseline | auditor decide sin sitio vivo |
| T05 | Pureza adversarial | runtime renombrado tambien falla |
| T06 | Fallo honesto | contrato incompleto regresa a investigacion |
| T07 | Capturas repetidas | tolerancias derivan del suelo de ruido |
| T08 | Framer + Webflow | contrato sin campos de proveedor |
| T09 | T1 economico | ambas rutas usan puertas identicas |
| T10 | Utilidad de boveda | toda apertura es autorizada, util y trazada |
| T11 | Red bloqueada | solo funciona la allowlist aprobada |
| T12 | Mutacion por contrato | cambia solo el objetivo declarado |
| T13 | Edicion humana | contenido, estilo y timing son localizables |
| T14 | Deriva controlada | separa `SOURCE_DRIFT` de fallo del clon |

## 12. Orden de pruebas pequenas

No se ejecuta todo a la vez:

1. **Lote 0 - Salud:** NR-00. Solo lectura y comandos existentes.
2. **Lote 1 - Evidencia:** NR-01. Inventario independiente del control negativo.
3. **Lote 2 - Esquemas:** NR-02, NR-03 y NR-05 con fixtures pequenos.
4. **Lote 3 - Calibracion:** NR-04 y NR-07 sobre una pagina de prueba controlada.
5. **Lote 4 - Gates:** NR-A1 a NR-A4 con controles sinteticos positivos y negativos.
6. **Lote 5 - Control real:** NR-A5 sobre `healcure-clone` sin modificarlo.
7. **Lote 6 - Piloto ciego:** NR-B1 a NR-B4 en una seccion.
8. **Lote 7 - Muestra:** Etapa C y decision humana.

Cada lote necesita autorizacion explicita, resultado registrado y gate cerrado. Un lote puede terminar en `FAIL` sin autorizar el siguiente.

## 13. Registro de ejecucion

Por cada tarea se agrega una fila; nunca se reemplaza evidencia previa.

| Fecha | Tarea | Responsable | Commit/estado | Prueba | Resultado | Evidencia | Siguiente decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-07-13 | NR-00 | Codex | `101d2eb`, worktree preexistente sucio | `npm.cmd test` + `npm.cmd run eval` | PASS, 47/47 y EVAL GOLDEN OK | salida de terminal y bloque NR-00 | NR-01 puede abrirse por autorizacion expresa |
| 2026-07-13 | NR-01, ejecucion 1 | Codex | control sin `.git`; hashes preservados | inventario estatico + Chromium/Next en copia temporal | PASS como control negativo; pureza FAIL | `docs/harness/reports/NR01-INVENTARIO-HEALCURE-CONTROL-NEGATIVO-2026-07-13.md` | repetir en sesion independiente antes de cerrar NR-01 |
| 2026-07-14 | NR-01, automatizacion | Codex | tres archivos nuevos, objetivo no modificado | 4 tests + suite 51/51 + eval + doble inventario | scanner PASS; control `NOT_PURE_NATIVE`; JSON identicos | `docs/harness/reports/NR01-HEALCURE-PURITY-INVENTORY-2026-07-14.json` | independencia diferida; no declararla satisfecha |
| 2026-07-14 | NR-02 | Codex | via separada `native-reconstruction/` | 7 tests + suite 58/58 + eval + canarios | implementacion PASS; host gate pendiente | `docs/harness/reports/NR02-ROLE-ISOLATION-2026-07-14.md` | crear runner/piloto con raiz impuesta por host |
| 2026-07-14 | NR-02, protocolo host | Codex | registro y certificacion externa | 11 tests NR-02 + suite 62/62 + eval | protocolo PASS; Node parcial rechazado; adaptador elegible pendiente | `docs/harness/reports/NR02-ROLE-ISOLATION-2026-07-14.md` | abrir NR-03 y NR-05; crear piloto tras sus fixtures |
| 2026-07-14 | NR-03 | Codex | via `native-reconstruction/` | 6 tests NR-03 + suite 68/68 + eval | PASS; mutacion y truncamiento bloqueados | `docs/harness/reports/NR03-ARTIFACT-INTEGRITY-2026-07-14.md` | abrir NR-05; despues crear scaffold piloto |
| 2026-07-14 | NR-05 + piloto scaffold | Codex | schema, linter y consumidor separado | 6 tests NR-05 + suite 74/74 + eval + verificacion piloto | NR-05 PASS; scaffold creado; host execution BLOCKED | `docs/harness/reports/NR05-RENDER-CONTRACT-V0-2026-07-14.md` | abrir NR-04 sobre pagina controlada |
| 2026-07-17 | NR-04 + CLI beta | Codex | `native init/doctor/lint/calibrate/freeze/verify` | suite 79/79 + eval golden + 60 capturas controladas | `PASS_CONTROLLED`; proceso red-before-green no preservado; construccion sigue BLOCKED por NR-02 | `docs/harness/reports/NR04-NOISE-CALIBRATION-2026-07-17.md` | probar calibracion manual; habilitar host elegible antes del Constructor |

## 14. Regla de cambios y rollback

- No se modifica el proyecto `healcure-clone` durante las Etapas 0 y A.
- No se reemplaza el flujo actual mientras no cierre la Etapa C.
- Todo codigo nuevo entra por archivos o modulos delimitados y con pruebas rojas previas.
- No se mezcla una reparacion del arnes actual con una tarea Native Reconstruction.
- Un rollback elimina solo el lote nuevo; nunca revierte cambios preexistentes del usuario.
- No se hace commit, push, release o instalacion en clientes sin autorizacion independiente.

## 15. Definicion de terminado

Native Reconstruction 2.0 no esta terminada porque el clon se vea bien. Esta terminada solo cuando:

- [ ] T01-T14 pasan con evidencia preservada.
- [ ] Los fallos estrictos del Render Contract existente siguen detectandose.
- [ ] El piloto ciego y la muestra representativa pasan todos los gates.
- [ ] Pureza y aislamiento son binarios y no tienen excepciones.
- [ ] El clon aprobado construye y navega con terceros no aprobados bloqueados.
- [ ] Un desarrollador puede editarlo sin original ni conocimiento del proveedor.
- [ ] El auditor independiente reproduce el veredicto desde el baseline congelado.
- [ ] La decision humana de Etapa C promueve expresamente la nueva via.
