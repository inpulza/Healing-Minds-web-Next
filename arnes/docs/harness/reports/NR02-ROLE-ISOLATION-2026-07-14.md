# NR-02 - Aislamiento de roles y canarios

Fecha: 2026-07-14

Estado: implementacion, protocolo de host y pruebas locales completadas; gate pendiente de un adaptador elegible disponible en la maquina piloto.

## 1. Objetivo

Impedir que una declaracion de rol sea confundida con aislamiento real. El flujo V1 ya registraba `constructor` y `auditor` y bloqueaba la autoaprobacion, pero no controlaba la lectura de `forensics/`, `vault/`, `audit-baseline/` u otras rutas sensibles.

NR-02 agrega una via separada bajo `scripts/native-reconstruction/`. No modifica el comportamiento del flujo V1.

## 2. Archivos implementados

| Archivo | SHA-256 |
| --- | --- |
| `plantillas/native-reconstruction/role-policy.json` | `a4576195afbe29cedc0fecbfd477240b3610183b357c2f3ef43c06b25fb925c7` |
| `plantillas/native-reconstruction/host-adapters.json` | `f0f61370d8af3f3708a4544b335c0840ecae86188d22607c883153a9a6cd44c8` |
| `scripts/native-reconstruction/_lib/host-adapter.mjs` | `8161d07f14293ee13a5e719ed7330305c30c20947d39717b04d6ef711e9db36a` |
| `scripts/native-reconstruction/_lib/role-isolation.mjs` | `b553ac7da0cef42e41fd482a294c96bded937022b6a0322991f59ca12e05f4dc` |
| `scripts/native-reconstruction/role-isolation.mjs` | `480a3407b5a6ff2eb7ac5f3bdbbc3022be1d58c9dd8bb36bc5d5a0a27a908755` |
| `tests/role-isolation.test.mjs` | `4243827482e40187acc125850ce0359b213a48b8449ba7a3e246720bda9f3625` |

## 3. Politica de cuatro roles

La politica define exactamente cuatro roles de trabajo:

| Rol | Lectura principal | Escritura principal | Restricciones criticas |
| --- | --- | --- | --- |
| Capturador | `forensics/`, `audit-baseline/` | `forensics/`, `audit-baseline/`, `vault/` | no lee `vault/`; no toca contrato o entregable |
| Sintetizador | `forensics/` | `contract/` | no lee baseline, vault o entregable |
| Constructor | `contract/`, `approved-assets/` | `deliverable/` | no lee original, forensics, baseline, vault o reports |
| Auditor | baseline, contrato, activos, entregable y ledger | `reports/` | no lee forensics o vault; no edita entregable |

Todos los roles solo pueden anexar al ledger mediante el control plane. El Constructor no recibe capacidades externas de navegador.

## 4. Mecanismos

### Politica maquina-legible

Cada lectura, escritura o append se contrasta con allowlist y denylist. La denegacion tiene precedencia y las rutas fuera de la raiz del piloto siempre fallan.

### Canarios

Al inicializar un piloto se crean canarios unicos dentro de:

```text
forensics/.nr-canary.json
vault/.nr-canary.json
```

Los tokens solo se conservan en `.harness-control/canaries.json`. El verificador busca fugas en contrato, activos aprobados, entregable e informes. Este informe no preserva ni publica los tokens de prueba.

### Vista materializada

El workspace del Constructor contiene unicamente:

```text
contract/
approved-assets/
deliverable/
.role-workspace.json
```

No contiene `forensics/`, `audit-baseline/`, `vault/` ni `.harness-control/`.

### Atestacion del host

Una vista materializada no basta. El verificador exige una atestacion separada con:

- modo `host-workspace-root`;
- rol;
- raiz exacta entregada al agente;
- SHA-256 del manifest de esa vista;
- identidad y fecha del host que aplico la restriccion.

Una atestacion ausente, debil o apuntando a otra raiz bloquea el cierre.

## 5. Pruebas

Se agregaron once pruebas:

1. La politica contiene los cuatro roles y ninguna capacidad externa para Constructor.
2. El Constructor puede leer contrato y escribir entregable.
3. El Constructor no puede leer forensics, vault o rutas externas al piloto.
4. Su vista materializada no contiene carpetas prohibidas.
5. El verificador pasa con canarios bloqueados y atestacion de host valida en fixture.
6. El verificador falla ante fuga, modo debil o falta de atestacion.
7. El CLI bloquea el intento y lo registra en `ledger.jsonl`.
8. El registro de adaptadores rechaza aislamiento parcial.
9. El permiso de Node bloquea rutas externas y procesos hijos, pero declara la red como no aislada.
10. Una autoatestacion directa no puede reclamar `host-workspace-root`.
11. Un desafio falso o un adaptador parcial no pueden producir certificacion.

Resultados globales:

```text
npm.cmd test     -> 62/62 PASS
npm.cmd run eval -> EVAL GOLDEN: OK
```

## 6. Prueba adversarial local

Se creo un piloto desechable fuera del repositorio. El Constructor intento:

| Operacion | Resultado |
| --- | --- |
| leer `forensics/.nr-canary.json` | DENIED |
| leer `vault/.nr-canary.json` | DENIED |
| leer `contract/render-contract.json` | ALLOWED |

El ledger registro tres eventos. No aparecieron canarios fuera de cuarentena.

El verificador final devolvio correctamente:

```text
verdict: FAIL
blocking: true
failures:
  - enforcement mode materialized-view does not satisfy host-workspace-root
  - constructor attestation mode materialized-view does not satisfy host-workspace-root
```

Este FAIL no es un defecto de la implementacion. Evita declarar aislamiento real cuando el host todavia permite rutas absolutas fuera de la vista materializada.

## 7. Futuro arnes piloto

No se creara una segunda fuente oficial. La arquitectura prevista es:

```text
C:\Desarrollo\Clonar web con arnes
  -> unica fuente canonica

C:\Desarrollo\pruebas-arnes\native-reconstruction-v2-pilot-001
  -> instalacion consumidora, experimental y desechable
```

El piloto se creara cuando los gates previos necesarios esten disponibles. Se ejecutara con la vista del Constructor como unica raiz de workspace autorizada. Si supera las etapas A, B y C, la via nueva se promociona dentro del mismo repositorio canonico; la instalacion piloto nunca se convierte en otra fuente oficial.

## 8. Estado de gate

Implementacion NR-02: `PASS`.

Pruebas unitarias y adversariales: `PASS`.

Aislamiento host real: `WAITING_ELIGIBLE_HOST_ADAPTER`.

El protocolo del runner ya esta preparado. El siguiente trabajo del lote es NR-03 y NR-05 con fixtures pequenos. El piloto no ejecutara un Constructor hasta disponer de `container-no-network`, `sandbox-vm-no-network` u otro adaptador que demuestre todas las capacidades obligatorias.

## 9. Protocolo de host y punto de creacion del piloto

El host sigue ahora tres pasos separados:

1. `prepare-host` congela rol, raiz, hash del workspace, adaptador, capacidades y un desafio aleatorio dentro del control plane.
2. Un adaptador externo ejecuta el Constructor y devuelve evidencia ligada al desafio.
3. `certify-host` comprueba evidencia, probes y hashes antes de emitir la atestacion. El comando `attest` no puede autoemitir `host-workspace-root`.

La maquina actual ofrece Node `v24.14.1`. Su permission model demostro lectura permitida, escritura permitida, lectura externa bloqueada y procesos hijos bloqueados. No ofrece aislamiento de red, por lo que figura como `partial` y nunca certifica el gate. Docker y WSL no estan disponibles en esta maquina en la comprobacion del 2026-07-14.

El directorio `C:\Desarrollo\pruebas-arnes\native-reconstruction-v2-pilot-001` se crea una sola vez cuando NR-03 y NR-05 tengan schemas y fixtures en PASS. En ese momento sera un consumidor desechable del arnes canonico. La ejecucion ciega del Constructor queda adicionalmente bloqueada hasta que exista un adaptador de host elegible.
