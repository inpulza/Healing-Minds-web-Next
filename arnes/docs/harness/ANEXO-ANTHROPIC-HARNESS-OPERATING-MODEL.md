# Anexo - Modelo Operativo Anthropic Para El Arnes De Clonado Web

Fecha: 2026-07-09

Documentos base:

- `_arnes/PLAN-ARNES-ESTRICTO-RENDER-CONTRACT.md`
- `_arnes/INVESTIGACION-ANTHROPIC-HARNESSES.md`

Objetivo:

Convertir el arnes actual de clonacion web en un verdadero harness agentico y evaluativo: no solo una lista de fases, sino un sistema que captura ground truth, produce contratos medibles, ejecuta pruebas, conserva trazas, separa roles, bloquea cierres incorrectos y permite probar el propio arnes desde cero.

## 1. Cambio Mental Principal

El arnes actual ya tiene una buena intuicion:

- capturar original;
- especificar;
- construir;
- auditar;
- cerrar.

El descubrimiento importante de Anthropic es que eso aun no basta. Un harness fuerte necesita cuatro piezas formales:

1. **Task**
   - Que trabajo exacto se evalua.
   - En nuestro caso: clonar o auditar una seccion concreta de una web concreta.

2. **Trial**
   - Un intento reproducible de resolver esa task.
   - En nuestro caso: intento 1, reintento 2, auditoria externa, fire test.

3. **Transcript**
   - Registro completo de lo que ocurrio.
   - En nuestro caso: comandos, tool calls, URLs, viewports, scroll steps, eventos de hover/click/focus, artefactos producidos, decisiones y fallos.

4. **Grader**
   - Sistema que decide PASS/FAIL usando evidencia.
   - En nuestro caso: comparadores de DOM, CSS, geometria, scroll, interaccion, seam, visual diff y auditor humano/model-based solo cuando un juicio visual no sea reducible a metrica.

Sin esas cuatro piezas, el arnes puede describir muy bien el proceso y aun asi permitir que un agente haga un trabajo flojo y diga que esta terminado.

## 2. Arquitectura Final Del Arnes

El arnes mejorado queda organizado en siete capas. Cada capa produce artefactos que la siguiente capa consume.

```text
1. Activation Layer
   Skill pequena + reglas de arranque + seleccion de fase

2. Ground Truth Layer
   Captura original + page contract + assets + texto + wrappers globales

3. Render Contract Layer
   Contrato por seccion, viewport, estado, interaccion y seam

4. Build Layer
   Constructor implementa solo contra el contrato, no contra recuerdos ni capturas sueltas

5. Evaluation Suite Layer
   Trials reproducibles, trace.jsonl, graders code-based/model/human

6. Enforcement Layer
   Gates y hooks que bloquean avance, cierre o PASS sin evidencia

7. Regression Layer
   Fixtures y fire tests que prueban que el propio arnes detecta fallos conocidos
```

La diferencia practica:

- Antes: "el agente debe mirar el DOM, video, scroll e interacciones".
- Ahora: "el arnes falla si no existe evidencia guardada de DOM, video, scroll e interacciones".

## 3. Resultado Que Debe Producir Cada Seccion

Cada seccion clonada debe producir una carpeta de evaluacion con esta forma conceptual:

```text
_arnes/eval-suite/<section>/<trial-id>/
  task.json
  trial.json
  trace.jsonl
  outcome.json
  aggregate.json
  artifacts/
    page-contract/
    render-contract/
    interaction-film/
    scroll-physics/
    seams/
    visual-diff/
    source-inspection/
  graders/
    code-results.json
    model-review.md
    human-required.md
  verdict.md
```

Nada de esto reemplaza los artefactos existentes. La `eval-suite` los agrupa, los indexa y permite que un auditor o agente nuevo entienda que paso sin depender de la conversacion.

## 4. Definicion De Task

Cada task debe estar en JSON para que sea ejecutable:

```json
{
  "taskId": "clone-section-case-studies",
  "targetUrl": "https://drardens.framer.website/",
  "cloneUrl": "http://localhost:3001/#case-studies",
  "sectionId": "case-studies",
  "selectorOriginal": "[data-section='case-studies']",
  "selectorClone": "#case-studies",
  "mode": "clone",
  "requiredViewports": ["390x844", "768x1024", "1024x900", "1440x900", "1920x1080", "2560x1440"],
  "requiredStates": [
    "before-section",
    "section-enter",
    "initial",
    "settled",
    "scroll-slow",
    "scroll-fast",
    "hover-each-interactive",
    "focus-each-interactive",
    "click-each-safe-interactive",
    "section-exit",
    "after-section",
    "wide-layout"
  ],
  "passPolicy": "all-required-graders-pass",
  "constructorMayApprove": false
}
```

Regla dura:

- Si un required viewport o required state no tiene artefacto, el grader falla.
- Si el selector esta mal y mide otra cosa, el grader falla.
- Si el original no puede medirse, la task no puede construirse.

## 5. Definicion De Trial

Cada intento debe tener un `trial.json`:

```json
{
  "trialId": "case-studies-attempt-001",
  "taskId": "clone-section-case-studies",
  "role": "constructor",
  "startedAt": "2026-07-09T00:00:00.000Z",
  "endedAt": null,
  "agent": "codex",
  "allowedActions": ["read-contract", "edit-clone", "run-build", "run-probes"],
  "forbiddenActions": ["write-audit-pass", "overwrite-original-evidence"],
  "status": "running"
}
```

Y el auditor debe tener otro trial distinto:

```json
{
  "trialId": "case-studies-audit-001",
  "taskId": "clone-section-case-studies",
  "role": "auditor",
  "agent": "fresh-agent",
  "allowedActions": ["read-artifacts", "run-probes", "write-audit"],
  "forbiddenActions": ["edit-clone", "trust-constructor-summary"],
  "status": "running"
}
```

La separacion constructor/auditor deja de ser una recomendacion: queda escrita en el trial y validada por gates.

## 6. Trace Obligatoria

Cada trial escribe `trace.jsonl`. Una linea por evento. Ejemplos:

```jsonl
{"ts":"2026-07-09T00:00:01.000Z","event":"trial_started","trialId":"case-studies-attempt-001","role":"constructor"}
{"ts":"2026-07-09T00:00:05.000Z","event":"probe_started","probe":"render-contract","viewport":"1440x900","state":"initial"}
{"ts":"2026-07-09T00:00:09.000Z","event":"artifact_written","path":"_arnes/render-contract/case-studies/1440x900/initial.json","sha256":"..."}
{"ts":"2026-07-09T00:00:15.000Z","event":"interaction","type":"hover","target":"case-card-1","beforeArtifact":"...","afterArtifact":"..."}
{"ts":"2026-07-09T00:00:20.000Z","event":"grader_result","grader":"max-width","viewport":"2560x1440","verdict":"FAIL","reason":"clone width 2560px, original container max 1248px"}
```

Reglas:

- La trace no es una bitacora narrativa; es evidencia de ejecucion.
- Todo artefacto importante se registra con path y hash.
- Todo FAIL debe aparecer en trace y en audit.
- Si un agente afirma haber probado algo que no aparece en trace, esa prueba no existe.

## 7. Graders

Los graders se dividen en tres grupos.

### 7.1 Code-Based Graders

Son obligatorios y deben correr siempre que aplique:

- artifact-presence grader;
- viewport-coverage grader;
- section-selector grader;
- max-width/container grader;
- computed-style grader;
- geometry grader;
- typography grader;
- color/paint grader;
- asset grader;
- scroll-physics grader;
- sticky/transform grader;
- interaction-state grader;
- seam grader;
- visual-diff grader;
- source-copy grader en modo inspiracion;
- role-permission grader;
- trace-completeness grader.

Estos graders producen JSON con:

```json
{
  "grader": "max-width-container",
  "verdict": "FAIL",
  "sectionId": "case-studies",
  "viewport": "2560x1440",
  "expected": {"containerMaxWidth": 1248, "centered": true},
  "actual": {"containerWidth": 2560, "centered": false},
  "blocking": true,
  "artifactRefs": ["_arnes/render-contract/case-studies/2560x1440/wide-layout.json"]
}
```

### 7.2 Model-Based Graders

Solo se usan cuando la diferencia visual no se puede resolver con una metrica simple:

- jerarquia visual percibida;
- fidelidad visual global;
- composicion editorial;
- "se siente igual" despues de que los graders metricos ya pasaron.

Reglas:

- Nunca reemplazan a los code-based graders.
- No pueden convertir un FAIL metrico en PASS.
- Solo pueden crear hallazgos adicionales o marcar revision humana.

### 7.3 Human-Required Grader

Se activa cuando:

- el original esta roto;
- hay una excepcion de copyright/inspiracion;
- un comportamiento no se puede clonar de forma legal o tecnica;
- el segundo intento falla;
- hay conflicto entre metrica y percepcion.

La decision humana se guarda en `_arnes/DECISIONES.md`.

## 8. Enforcement Con Gates Y Hooks

El arnes no debe confiar en que el agente recuerde las reglas.

Gates minimos:

- `gate.mjs --fase=1`: ground truth completa.
- `gate.mjs --fase=2`: specs + render contract completo.
- `gate.mjs --fase=3`: build + no copy prohibido + artifacts de constructor.
- `gate.mjs --fase=4`: auditor externo + graders completos + trace completa.
- `gate.mjs --fase=5`: cierre sin secciones abiertas.

Hooks recomendados para entornos compatibles:

- Stop hook:
  - Bloquea la declaracion de cierre si faltan artefactos requeridos.
  - Bloquea "esta listo" si `aggregate.json` no existe o tiene FAIL.

- PreToolUse hook:
  - Bloquea que el constructor escriba `AUDIT_PASS`.
  - Bloquea editar artefactos congelados de original.
  - Bloquea sobrescribir artefactos sin crear nuevo trial.

- PostToolUse hook:
  - Registra escritura de artefactos en trace.
  - Ejecuta checksum/hash.
  - Marca artefactos incompletos.

Si el entorno no soporta hooks, las mismas reglas deben existir en `gate.mjs`.

## 9. Skill Del Arnes

La skill no debe contener el plan completo. Debe ser pequena y activar el procedimiento correcto.

`arnes/SKILL.md` debe hacer solo esto:

1. Decidir si aplica al pedido del usuario.
2. Leer `_arnes/config.json`, `_arnes/LEDGER.md`, ultimas lineas de `_arnes/BITACORA.md`.
3. Ejecutar gate para detectar fase.
4. Cargar solo la fase correspondiente.
5. Si la fase exige render contract, cargar la referencia estricta.
6. Si la fase exige auditoria, cargar prompt-auditor y reglas de permisos.
7. Nunca aprobar por memoria o por descripcion del constructor.

El detalle pesado vive en:

- `arnes/fases/*.md`
- `arnes/referencias/*.md`
- `arnes/scripts/*.mjs`
- `_arnes/PLAN-ARNES-ESTRICTO-RENDER-CONTRACT.md`
- `_arnes/ANEXO-ANTHROPIC-HARNESS-OPERATING-MODEL.md`

## 10. Flujo Exacto Para Clonar Una Seccion

Este es el flujo que debe seguirse para una seccion dificil, como `Case studies`.

### Paso A: Crear Task

- Registrar sectionId, URL original, URL clon, selectores y viewports.
- Guardar `task.json`.
- Registrar inicio en trace.

### Paso B: Medir Original Como Navegador

- Page contract global.
- Wrapper y scroll root.
- CSS computed.
- Layout tree.
- Bounding boxes.
- Ancestor chain.
- z-index/layers.
- overflow ancestors.
- transforms.
- assets reales.
- text runs.
- responsive matrix.

### Paso C: Interaction Film

No significa solo grabar video. Significa ejecutar una pelicula de interacciones:

- scroll lento desde seccion anterior;
- entrada en seccion;
- pausa en estado inicial;
- hover de cada elemento interactivo;
- focus por teclado;
- click seguro;
- scroll rapido;
- salida hacia siguiente seccion;
- medicion de seams.

La salida incluye:

- WebM o capturas temporales;
- snapshots DOM antes/despues;
- computed styles antes/despues;
- bounding boxes antes/despues;
- eventos de scroll y tiempos;
- cambios de texto, opacidad, transform, background, height, width, z-index.

### Paso D: Construccion

El constructor implementa en Next.js usando el contrato. No decide por ojo. Si necesita interpretar algo, crea decision pendiente o nuevo probe.

### Paso E: Evaluacion Automatizada

Ejecutar graders:

- presencia de artefactos;
- viewports;
- render contract diff;
- interaction diff;
- scroll diff;
- seam diff;
- visual diff;
- role/trace.

### Paso F: Auditor Externo

El auditor:

- no lee resumen del constructor como verdad;
- no edita codigo;
- revisa artefactos;
- corre probes si faltan;
- escribe audit;
- PASS solo si todos los blockers pasan.

### Paso G: Cierre

El cierre solo ocurre si:

- `aggregate.json` esta en PASS;
- auditor firmo PASS;
- no faltan artefactos;
- no hay secciones abiertas;
- la bitacora tiene evidencia;
- `gate.mjs --fase=5` pasa.

## 11. Cambios Concretos Que Deben Entrar Al Plan Canonico

El plan canónico debe ampliarse con:

1. **Task 15: Formal Eval Suite Runner**
   - Crear estructura `_arnes/eval-suite/`.
   - Crear `task.json`, `trial.json`, `outcome.json`, `aggregate.json`.
   - Orquestar probes existentes como una ejecucion reproducible.

2. **Task 16: Grader Architecture**
   - Crear graders code-based.
   - Separar model-based y human-required.
   - Bloquear PASS si falla cualquier grader obligatorio.

3. **Task 17: Trial Transcript / Trace JSONL**
   - Registrar eventos de cada trial.
   - Hash de artefactos.
   - Comandos y resultados.
   - Interacciones y pruebas.

4. **Task 18: Hooks / Enforcement**
   - Bloquear constructor-authored PASS.
   - Bloquear cierre sin aggregate PASS.
   - Bloquear sobrescritura de evidencia congelada.

5. **Task 19: Skill arnes-render-contract**
   - Skill pequena.
   - Progressive disclosure.
   - No copiar el plan entero dentro del SKILL.

6. **Task 20: Fresh-Agent Skill Evaluation**
   - Probar el arnes con agente limpio.
   - Usar Case studies como prueba de fuego.
   - Fallar si el agente no detecta max-width, hover, scroll, seams o falta de evidencia.

## 12. Criterio De Exito Del Arnes Mejorado

El arnes mejorado solo se considera potente cuando puede hacer fallar automaticamente estos clones defectuosos:

- clon visualmente parecido pero full-width cuando el original tiene max-width;
- clon con captura correcta pero hover incorrecto;
- clon con scroll estatico cuando original tiene inercia/interpolacion;
- clon con sticky stack traducido pero sin capas/scale/release timing;
- clon que no mide seccion anterior/siguiente;
- clon que no prueba mobile/tablet/wide;
- clon que no deja trace;
- constructor que intenta aprobarse;
- auditor que aprueba sin artefactos;
- skill que no guia a un agente fresco hasta las pruebas correctas.

Cuando esos defectos fallan de forma reproducible y el clon correcto pasa, el arnes ya no depende de fe ni memoria: funciona como un sistema de evaluacion.

