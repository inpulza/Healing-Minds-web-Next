# NR-03 - Integridad de artefactos y ledger append-only

Fecha: 2026-07-14

Estado: `PASS`.

## 1. Objetivo

Congelar la evidencia que alimenta el contrato y la auditoria, y detectar cualquier cambio posterior. NR-03 tambien reemplaza el ledger JSONL confiado por una cadena verificable que detecta edicion, reordenamiento y truncamiento.

## 2. Artefactos implementados

| Archivo | SHA-256 |
| --- | --- |
| `plantillas/native-reconstruction/ledger-entry.schema.json` | `7dd0b058787318b5694a4fed6c25d05aeacf5cedaf0952bdeef6ddb7f6a85f48` |
| `plantillas/native-reconstruction/artifact-manifest.schema.json` | `168e6be72c78b47b58d9f5bc86e805d9175c79ea7ab1e4fefd27a95eb8f99341` |
| `plantillas/native-reconstruction/vault-policy.schema.json` | `702fdcdbb2a78a0bc7d5ed45a635e9de88f405f6f7752a713f3669debb58882c` |
| `plantillas/native-reconstruction/vault-policy.json` | `b437c0f6187821b6a063405a0a1857acd9959fe6df23461a7b9476f83f7294b9` |
| `scripts/native-reconstruction/_lib/integrity-ledger.mjs` | `16c33c12331db884b6a4ad3e1249971630dcba813dc6321ab270c3c28bf3c921` |
| `scripts/native-reconstruction/_lib/artifact-integrity.mjs` | `78b51c967d903fa85fd8088b6c5e2d8786f5f17c9c0b1708edb1543923927867` |
| `scripts/native-reconstruction/_lib/role-isolation.mjs` | `3f50f93a0ba739c816459f36ac116e86c9d429a0c08f28315774effcab162f35` |
| `scripts/native-reconstruction/artifact-integrity.mjs` | `016533f8393b1a130ccadc51326fe6fde474cc577b22766560974beacda60bda` |
| `tests/artifact-integrity.test.mjs` | `56be95fc5c4b69ab774b9852da11a0ef24734467a479243bcbbecb94762a5b35` |

## 3. Manifiesto congelado

`freeze` inventaria `forensics/` y `audit-baseline/` por ruta relativa, bytes y SHA-256. Cada raiz obtiene un hash de arbol determinista. El manifiesto y su registro de congelacion viven en `.harness-control/`, fuera de la vista del Constructor.

`verify` vuelve a calcular el inventario e informa por separado:

- archivos agregados;
- archivos eliminados;
- archivos modificados;
- hash de arbol distinto;
- manifiesto de control manipulado.

La congelacion es de una sola escritura. Un segundo `freeze` falla en vez de reemplazar la evidencia anterior.

## 4. Ledger encadenado

Cada entrada contiene `seq`, `prevHash` y `entryHash`. El hash se calcula sobre JSON canonico. `.harness-control/ledger-head.json` conserva cantidad y ultimo hash; por eso eliminar la ultima linea tambien falla. Un lock exclusivo evita dos escritores simultaneos.

Los eventos de acceso de NR-02 ya utilizan esta cadena. Si el ledger no verifica, no acepta nuevos eventos y el verificador de aislamiento tambien falla.

## 5. Boveda provisional

La politica es deny-by-default. Toda autorizacion requiere identidad, responsable humano, motivo, scope, inicio y expiracion. La duracion maxima inicial es 60 minutos.

La purga se define como borrado autorizado, comprobacion de ausencia y tombstone. La politica fija `secureEraseClaim: false`: borrar un archivo no permite afirmar borrado fisico seguro en SSD, copias o sincronizacion.

## 6. Pruebas

Se agregaron seis pruebas NR-03:

1. Manifiesto sin cambios en PASS.
2. Mutacion del baseline detectada con ruta exacta.
3. Archivo forense agregado y eliminado detectados.
4. Edicion del ledger detectada por hash y truncamiento detectado por head.
5. Autorizacion de boveda activa, expirada y fuera de scope.
6. CLI devuelve codigo no cero tras alterar un baseline congelado.

Resultados globales:

```text
npm.cmd test     -> 68/68 PASS
npm.cmd run eval -> EVAL GOLDEN: OK
```

## 7. Gate

Gate NR-03: `PASS`.

Una alteracion posterior de `audit-baseline/` fue detectada y bloqueo la verificacion. El siguiente punto del lote es NR-05, contrato de renderizado v0. El piloto V2 no se crea hasta que NR-05 tenga schema, linter y fixtures en PASS.
