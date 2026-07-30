# NR-05 - Render Contract v0 y piloto V2

Fecha: 2026-07-14

Estado NR-05: `PASS`.

## 1. Objetivo

Dar al Constructor una especificacion suficiente para reconstruir comportamiento y presentacion sin entregarle HTML, CSS, DOM, scripts, hidratacion, selectores, IDs o runtime del proveedor original.

## 2. Artefactos

| Archivo | SHA-256 |
| --- | --- |
| `plantillas/native-reconstruction/brief.schema.json` | `5f711783717575461c1b92a424ad3bac3923d46162a2f1d43617d823a6f74990` |
| `plantillas/native-reconstruction/render-contract.schema.json` | `b920dd21cc5e8411cd0d09f2a7aed05a20cfd974b1689c51a1b932e0e2205274` |
| `scripts/native-reconstruction/_lib/render-contract.mjs` | `facb73db799dbcdb56d06df845cc68dd010eddac45ae55c642e126c1e05044c7` |
| `scripts/native-reconstruction/render-contract.mjs` | `bea35d2858ec88fc3333fffa56f3e4252282815fb0fe572c9514bf4bc59f6a23` |
| `tests/fixtures/native-reconstruction/brief.valid.json` | `3c49d5ec7e34fae2ff5987648c551e811c31379d422c0cf498d6821f72b05cca` |
| `tests/fixtures/native-reconstruction/render-contract.valid.json` | `6c07af7152f1521b2bc960d1e418dfa48248a779bafbbcd37869564019b2c00e` |
| `tests/render-contract.test.mjs` | `004348afec051865947f10374119324326b1dd385e223aa819f9dd5674246f25` |

## 3. Vocabulario del contrato

El schema define:

- IDs semanticos propios para paginas, secciones, componentes, estados, breakpoints y activos.
- Tokens de color, tipografia, espaciado, radios y movimiento.
- Layout, max-width, geometria, flujo y uniones con secciones anterior y siguiente.
- Paint, capas, overflow y ancestor contenedor.
- Reglas responsive continuas, sin huecos o solapamientos.
- Estados con trigger, precondiciones, resultado, duracion, delay, easing y fisica.
- Sticky, scroll root, scroll linked, multimedia y accesibilidad funcional.
- Activos locales aprobados, procedencia, sustitucion y estrategia de carga.
- Observacion medida o inferida, confianza, gap, decisiones y aserciones.

## 4. Trazabilidad T02

El brief es un artefacto separado. Cada requirement ID debe aparecer exactamente una vez en `briefCoverage` con:

1. Uno o mas JSON Pointers resolubles dentro del contrato.
2. Una o mas assertion IDs existentes.

Las aserciones tambien apuntan a campos resolubles. Secciones, componentes, reglas responsive, estados, activos, paginas y tokens requieren `trace`. Una inferencia exige un gap no vacio y registrado. Un gap bloqueante impide PASS.

## 5. Rechazos estrictos

El linter bloquea:

- HTML o markup crudo;
- CSS o declaraciones de estilo crudas;
- scripts, modulos, clases y selectores;
- hidratacion, snapshots DOM, source code e IDs de proveedor;
- nombres o dominios de Framer y Webflow;
- URLs externas dentro del contrato del Constructor;
- activos fuera de `approved-assets/`;
- referencias, decisiones, aserciones, seams o componentes inexistentes;
- breakpoints incompletos, solapados o con huecos.

## 6. Pruebas

Se agregaron seis pruebas:

1. Contrato neutral valido con cobertura completa.
2. Residuos de proveedor y payload de implementacion rechazados.
3. Requirement sin cobertura rechazado.
4. JSON Pointer y assertion ID rotos rechazados.
5. Inferencia sin gap y gap bloqueante rechazados.
6. URL externa rechazada por CLI con codigo no cero.

Resultados globales:

```text
npm.cmd test     -> 74/74 PASS
npm.cmd run eval -> EVAL GOLDEN: OK
```

## 7. Piloto creado

Se creo:

```text
C:\Desarrollo\pruebas-arnes\native-reconstruction-v2-pilot-001
```

Es un consumidor desechable, no una copia fuente. Contiene el fixture de brief y contrato, politicas, canarios, ledger, carpetas de evidencia y la vista materializada del Constructor.

La vista del Constructor expone solo `contract/`, `approved-assets/`, `deliverable/` y `.role-workspace.json`. La comprobacion confirmo que no expone `forensics/`, `audit-baseline/`, `vault/` o `.harness-control/`.

El contrato del piloto pasa el linter. El verificador de aislamiento devuelve deliberadamente `FAIL` porque el modo actual es `materialized-view`, faltan los intentos de canario y no existe atestacion externa. Este bloqueo es correcto; el piloto esta marcado `SCAFFOLD_ONLY`.

## 8. Gate

Gate NR-05 y T02: `PASS`.

Scaffold piloto: `CREATED`.

Ejecucion ciega del Constructor: `BLOCKED_WAITING_ELIGIBLE_HOST_ADAPTER`.

La proxima prueba pequena es NR-04: calibrar ruido en una pagina controlada. El piloto no se promociona ni se usa en clientes.
