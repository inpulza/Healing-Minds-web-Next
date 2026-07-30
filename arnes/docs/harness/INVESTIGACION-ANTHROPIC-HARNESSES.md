# Investigacion Oficial - Harnesses, Skills, Evals y Auditoria Externa

Fecha: 2026-07-09

Documento relacionado:

- `_arnes/PLAN-ARNES-ESTRICTO-RENDER-CONTRACT.md`

Objetivo:

Validar el plan del arnes estricto contra documentacion y publicaciones oficiales de Anthropic sobre harnesses, agents, evals, skills, subagents, hooks, memoria/contexto y herramientas para agentes.

## Fuentes Primarias Revisadas

### Anthropic Engineering

- Demystifying evals for AI agents
  - https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
- Harness design for long-running application development
  - https://www.anthropic.com/engineering/harness-design-long-running-apps
- Effective harnesses for long-running agents
  - https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- Building effective agents
  - https://www.anthropic.com/engineering/building-effective-agents
- Best practices for Claude Code
  - https://code.claude.com/docs/en/best-practices
- Writing effective tools for agents
  - https://www.anthropic.com/engineering/writing-tools-for-agents
- Effective context engineering for AI agents
  - https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents

### Anthropic / Claude Platform Docs

- Agent Skills overview
  - https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
- Skill authoring best practices
  - https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
- Claude Code subagents
  - https://code.claude.com/docs/en/sub-agents
- Claude Code hooks guide
  - https://code.claude.com/docs/en/hooks-guide
- Claude Code hooks reference
  - https://code.claude.com/docs/en/hooks
- Claude Code memory
  - https://code.claude.com/docs/en/memory
- Claude Evaluation Tool
  - https://platform.claude.com/docs/en/test-and-evaluate/eval-tool

## Sintesis De Lo Que Anthropic Llama Harness

Segun Anthropic, hay dos conceptos relacionados:

1. **Evaluation harness**
   - Infraestructura que ejecuta evaluaciones de extremo a extremo.
   - Provee instrucciones y herramientas.
   - Corre tareas.
   - Registra pasos/trazas.
   - Califica resultados con graders.
   - Agrega resultados.

2. **Agent harness / scaffold**
   - Sistema que permite que un modelo actue como agente.
   - Procesa inputs.
   - Orquesta tool calls.
   - Gestiona contexto.
   - Devuelve resultados.

Conclusión aplicada:

Nuestro arnes de clonacion no debe ser solo un conjunto de scripts. Debe ser ambas cosas:

- un **agent harness** para guiar constructor/auditor;
- un **evaluation harness** para comprobar con pruebas reproducibles si el clon es fiel.

## Hallazgos Clave Contra Nuestro Plan

### 1. El plan de Render Contract esta alineado con la idea de outcome real

Anthropic separa transcript, outcome, grader y eval harness. Esto encaja directamente con nuestro problema:

- El constructor puede decir "esta igual".
- El screenshot puede parecer correcto.
- Pero el outcome real es si el navegador renderiza e interactua igual.

Aplicacion al arnes:

- El outcome debe ser el estado medido del clon en navegador.
- El transcript debe guardar tool calls, comandos, artefactos y resultados.
- Los graders deben ser scripts que comparen original vs clon.
- El auditor externo debe revisar artefactos y fallos, no intenciones.

### 2. Nuestro plan necesita formalizar una eval suite, no solo probes

El plan actual define probes muy fuertes:

- page contract;
- render contract;
- responsive sweep;
- scroll physics;
- interaction film;
- seams;
- comparator.

Pero desde buenas practicas de Anthropic, eso debe organizarse como una suite de evaluacion:

- task = clonar/verificar una seccion;
- trial = intento de clon o auditoria;
- grader = comparador deterministic o model-based;
- transcript = registro completo de comandos, artefactos y decisiones;
- outcome = estado final medido en navegador;
- aggregate = resumen de PASS/FAIL por seccion, viewport y estado.

Accion necesaria:

- Agregar al plan una capa `eval-suite` por encima de los probes.

### 3. Los graders deben ser principalmente code-based

Anthropic clasifica graders en:

- code-based;
- model-based;
- human.

Para nuestro caso, la mayor parte debe ser code-based:

- geometria;
- max-width;
- scrollY/timeline;
- hover del DOM;
- CSS computed;
- seam overlap;
- visual diff;
- screenshot dimensions;
- artifact presence.

Los model-based graders solo deben usarse donde la percepcion visual sea subjetiva:

- "se siente igual";
- calidad visual;
- interpretacion de una diferencia no cuantificada.

El humano entra solo como decision final en bloqueos o excepciones.

Accion necesaria:

- Definir `graders/code`, `graders/model`, `graders/human-required`.

### 4. La separacion constructor/auditor esta fuertemente respaldada

Anthropic recomienda separar verificacion de implementacion. Sus docs de Claude Code tambien recomiendan checks ejecutables, subagentes de verificacion y segunda opinion.

Nuestro plan ya lo contempla:

- constructor no se autoaprueba;
- auditor limpio;
- auditor no confia en el constructor.

Refuerzo necesario:

- El arnes debe impedir estructuralmente que el constructor genere `AUDIT_PASS`.
- El auditor debe tener tool permissions distintas:
  - read-only sobre codigo al principio;
  - acceso a navegador/probes;
  - escritura solo en carpeta de auditoria;
  - no edicion del clon.

### 5. Hooks son el mecanismo correcto para bloquear "me salto el proceso"

Anthropic diferencia memoria/instrucciones de enforcement. CLAUDE.md y memoria son contexto; los hooks bloquean o ejecutan reglas deterministicamente.

Aplicacion directa:

- No basta decir "no apruebes sin pruebas".
- Hay que crear hooks/gates que lo impidan.

Hooks recomendados:

- Stop hook: bloquear cierre si falta evidencia.
- PreToolUse hook: bloquear `AUDIT_PASS` escrito por constructor.
- PostToolUse hook: despues de editar arnes, correr tests.
- SessionStart hook: recordar ruta del plan canonico.

### 6. El plan debe conservar contexto por artefactos, no por chat

Anthropic insiste en structured artifacts y handoff entre sesiones. Esto valida directamente:

- `_arnes/PLAN-ARNES-ESTRICTO-RENDER-CONTRACT.md`;
- `render-contract`;
- `interaction-film`;
- `seams`;
- `verify`;
- bitacora.

Accion necesaria:

- Agregar un `arnes-progress.md` o fortalecer `_arnes/BITACORA.md` como handoff estructurado.
- Cada fase debe terminar dejando:
  - que se hizo;
  - que falta;
  - que comandos se corrieron;
  - que artefactos se generaron;
  - que no se debe asumir.

### 7. Una skill si tiene sentido, pero no debe contener todo el plan

Segun Anthropic, una Skill debe usar progressive disclosure:

- `SKILL.md` pequeno;
- referencias en archivos aparte;
- scripts ejecutables para operaciones deterministas;
- ejemplos concretos;
- evaluaciones reales.

Por tanto:

- Si creamos una skill `arnes-render-contract`, `SKILL.md` no debe pegar las 913 lineas del plan.
- Debe ser un enrutador:
  - cuando usarla;
  - que archivo canonico abrir;
  - que fase ejecutar;
  - que scripts correr;
  - que gates bloquean.

Estructura recomendada:

```text
arnes-render-contract/
  SKILL.md
  references/
    render-contract-plan.md
    auditor-protocol.md
    constructor-protocol.md
    eval-suite.md
    artifact-schema.md
  scripts/
    check-required-artifacts.mjs
    summarize-audit-state.mjs
  examples/
    case-studies-zero-memory.md
```

### 8. La skill debe probarse con "Claude A / Claude B"

Anthropic recomienda crear skills iterativamente:

- Claude A ayuda a disenar/refinar.
- Claude B, en contexto fresco, la usa en tareas reales.
- Se observa donde falla.
- Se vuelve a mejorar.

Aplicacion:

- Despues de crear la skill, hay que probarla en una sesion limpia.
- La prueba debe ser el caso `Case studies` desde cero.
- Si la skill no fuerza a abrir el plan canonico y ejecutar probes, falla.

### 9. El arnes debe tener fixtures/regression tests

Anthropic diferencia evals de capacidad y de regresion.

Aplicacion:

- El plan ya incluye fixtures.
- Hay que elevarlos a suite oficial:
  - capability eval: puede detectar nuevas clases de errores.
  - regression eval: nunca vuelve a pasar full-width si original tiene max-width.

### 10. Deben existir trazas completas

Anthropic define transcript/trace como registro completo del trial.

Aplicacion:

- Cada auditoria debe guardar:
  - comandos ejecutados;
  - stdout/stderr;
  - archivos generados;
  - screenshots;
  - videos;
  - JSON;
  - comparaciones;
  - decisiones.

Accion necesaria:

- Agregar `_arnes/traces/<section>/<attempt>/trace.jsonl`.

## Gaps Detectados En El Plan Canonico Actual

El plan actual es fuerte, pero tras contrastarlo con Anthropic hay que agregar estos puntos:

### Gap A: Falta nombrar formalmente la eval suite

Agregar una tarea:

- Crear `arnes/scripts/run-eval-suite.mjs`.
- Crear estructura `_arnes/evals/<section>/<attempt>/`.
- Definir task/trial/grader/transcript/outcome.

### Gap B: Falta esquema de graders

Agregar:

```text
arnes/graders/
  code/
    geometry.mjs
    css-constraints.mjs
    responsive.mjs
    scroll-physics.mjs
    interaction-states.mjs
    seams.mjs
  model/
    visual-rubric.md
  human/
    escalation.md
```

### Gap C: Falta trace.jsonl

Agregar:

```text
_arnes/traces/<section>/<attempt>/trace.jsonl
```

Cada script debe anexar una linea con:

```json
{
  "timestamp": "",
  "phase": "",
  "command": "",
  "exitCode": 0,
  "stdoutPath": "",
  "stderrPath": "",
  "artifacts": []
}
```

### Gap D: Falta hook plan

Agregar un plan especifico para hooks:

- Stop hook para bloquear finalizacion sin gates.
- PreToolUse hook para impedir auditoria escrita por constructor.
- PostToolUse hook para correr pruebas tras cambios de scripts.
- SessionStart hook para apuntar al plan canonico.

### Gap E: Falta skill como capa de activacion

Crear skill:

```text
arnes-render-contract
```

Objetivo:

- Activar el protocolo correcto.
- Abrir el plan canonico.
- No confiar en memoria.
- Ejecutar fases/gates.
- Enrutar a referencias y scripts.

### Gap F: Falta probar la skill con agente fresco

Agregar eval:

- Claude/agent A crea la skill.
- Claude/agent B la usa desde cero.
- Si B resume o salta pasos, la skill falla.

## Veredicto

El plan `_arnes/PLAN-ARNES-ESTRICTO-RENDER-CONTRACT.md` esta conceptualmente alineado con las mejores practicas oficiales de Anthropic:

- separa plan, build y verificacion;
- usa artefactos;
- busca gates deterministicos;
- separa constructor/auditor;
- convierte comportamiento visual en criterios medibles;
- evita depender de memoria o screenshot.

Pero para ser un arnes mas fiel al enfoque de Anthropic, hay que ampliar el plan con:

- eval suite formal;
- graders clasificados;
- trace/transcript por intento;
- hooks como enforcement;
- skill de activacion con progressive disclosure;
- prueba de la skill con agente fresco.

## Recomendacion Operativa

Antes de implementar el plan canonico, hacer una version 1.1 del documento con seis tareas nuevas:

1. Task 15: Formal Eval Suite Runner.
2. Task 16: Grader Architecture.
3. Task 17: Trial Transcript / Trace JSONL.
4. Task 18: Claude Code Hooks Enforcement.
5. Task 19: `arnes-render-contract` Skill.
6. Task 20: Fresh-Agent Skill Evaluation.

No modificar el arnes hasta que estas tareas queden integradas en el plan canonico.

