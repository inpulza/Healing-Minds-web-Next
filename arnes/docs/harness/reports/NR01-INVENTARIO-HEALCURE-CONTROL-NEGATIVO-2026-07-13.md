# NR-01 - Inventario de Healcure como control negativo

Fecha: 2026-07-13

Estado: primera ejecucion completada; reproduccion independiente pendiente.

Origen auditado, estrictamente en solo lectura:

```text
C:\Desarrollo\healcure-clone
```

## 1. Veredicto

`healcure-clone` es un control negativo valido: conserva una fidelidad visual alta, pero **falla pureza de forma binaria**.

No es una reconstruccion nativa en Next.js. Next.js actua como servidor de snapshots: la ruta principal lee y devuelve `index.html`, y la ruta catch-all lee y devuelve los once `page.html` almacenados en `src/snapshots/pages/`.

El proyecto no declara un paquete npm llamado Framer, pero incluye el runtime de origen como modulos `.mjs` locales, HTML generado, hidratacion, clases, atributos y solicitudes externas. Esto demuestra que revisar solamente `package.json` o dominios visibles no detecta el atajo.

## 2. Integridad y alcance

El directorio auditado no contiene `.git`; por tanto, la integridad se verifico con hashes antes y despues de las pruebas.

| Artefacto | Bytes | SHA-256 |
| --- | ---: | --- |
| `index.html` | 671107 | `5af0772b9822917c01c6dcd555f128578961e1621685794481b4c3803aab1055` |
| `package.json` | 662 | `1d64bb0441b436551c659047d56b4223a20f511e3efa8e0ff3e0bf2f1a42a33c` |
| `app/route.js` | 370 | `cfd20dff5f946343dec6ae11926eb0e56c2a75a20b74a289d15e34dec03030e7` |
| `app/[...path]/route.js` | 996 | `3da0a4467f806503c9e3825ae046cc65efa56e900a89010222ac7cf91c7a2acd` |
| `src/snapshots/manifest.json` | 2198 | `b10821c1e522ccf12b1e66d45045913aba69da5db763d486b042dc20c65d7dcb` |
| arbol `src/snapshots/pages` | 11 archivos | `1ea9645dc460a17dde0697e4e291e7ff711b1b742b9b3fcc8043c2a6e2162227` |
| arbol `public/vendor-assets` | 296 archivos | `d28e29eb60ce6bc561bb777d4e3e0653accb2604ea29234da50c09f4dfcaccca` |

Los hashes de los cinco archivos individuales fueron identicos antes y despues. El clon no fue modificado.

## 3. Arquitectura realmente servida

### Ruta principal

`app/route.js` ejecuta:

```js
const html = await readFile(join(process.cwd(), 'index.html'), 'utf8');
return new Response(html);
```

### Rutas internas

`app/[...path]/route.js` consulta el manifiesto y devuelve:

```js
const html = await readFile(
  join(process.cwd(), 'src', 'snapshots', 'pages', page.key, 'page.html'),
  'utf8',
);
return new Response(html);
```

Conclusiones comprobables:

- Next.js no renderiza componentes React del sitio.
- No existe un arbol de componentes equivalente a las secciones observadas.
- El entregable depende del DOM, CSS, hidratacion y modulos preservados del origen.
- Las once rutas son once snapshots completos, no once paginas reconstruidas.

## 4. Volumen de artefactos

| Area | Archivos | Bytes |
| --- | ---: | ---: |
| `app/` | 2 | 1366 |
| `src/` | 14 | 5115155 |
| `src/snapshots/pages/` | 11 HTML | 5085438 |
| `public/vendor-assets/` | 296 | 105301241 |
| `scripts/` | 2 | 9301 |
| `_arnes/` | 519 | 593259260 |

Distribucion de `public/vendor-assets/`:

| Extension | Archivos | Bytes |
| --- | ---: | ---: |
| `.png` | 103 | 38977543 |
| `.mjs` | 76 | 6524092 |
| `.woff2` | 59 | 781992 |
| `.webp` | 48 | 6926226 |
| `.svg` | 5 | 3524 |
| `.mp4` | 3 | 51976788 |
| `.json` | 2 | 111076 |

## 5. Residuo estatico reproducido

Conteos hechos con `rg -i -o`, por coincidencia y no por linea:

| Scope | `framer` | `data-framer-*` | Tokens `framer-*` | Hooks de hidratacion |
| --- | ---: | ---: | ---: | ---: |
| `index.html` | 8482 | 1225 | 8471 | 5 |
| once snapshots HTML | 52815 | 5864 | 52658 | 55 |
| vendor assets de texto | 19155 | n/a | n/a | n/a |

Valores unicos:

- `index.html`: 27 nombres distintos `data-framer-*`.
- `index.html`: 696 tokens distintos `framer-*`.
- once snapshots: 27 nombres distintos `data-framer-*`.
- once snapshots: 1068 tokens distintos `framer-*`.

Entre los atributos preservados aparecen `data-framer-hydrate-v2`, `data-framer-components`, `data-framer-css`, `data-framer-name`, `data-framer-root`, `data-framer-appear-animation` y `data-framer-appear-id`.

La home carga un `script_main` local, ocho scripts inline y 21 `modulepreload`. Esos preloads incluyen explicitamente:

- `framer.lFN4qhX2.mjs`;
- `motion.CWfRzVbq.mjs`;
- `react.DfCW-JTf.mjs`;
- `rolldown-runtime.TjgygFMs.mjs`;
- `shared-lib.CiOBQL8t.mjs`.

## 6. Dominios presentes en HTML y modulos

Conteos de hosts encontrados en `index.html`, snapshots y vendor assets de texto:

| Host | Apariciones |
| --- | ---: |
| `framerusercontent.com` | 2020 |
| `www.framer.com` | 11 |
| `framer.com` | 2 |
| `api.framer.com` | 2 |
| `unpkg.com` | 14 |

Otros hosts corresponden a enlaces de contenido o vocabulario interno y no deben confundirse automaticamente con solicitudes de runtime. El gate de red debe medir solicitudes reales, no solo buscar URLs estaticas.

## 7. Prueba de navegador

Para no escribir `.next` ni caches dentro del clon, se copio el deliverable a un directorio temporal, se enlazo el `node_modules` existente y se ejecuto Next.js con Webpack en `127.0.0.1:3102`. El directorio temporal fue eliminado al terminar y se volvieron a comprobar los hashes del origen.

Resultado despues de diez segundos en Chromium, viewport 1440 x 900:

| Metrica | Resultado |
| --- | ---: |
| Elementos DOM | 1397 |
| Apariciones `framer` en DOM | 8484 |
| Instancias de atributos `data-framer-*` | 991 |
| Nombres unicos `data-framer-*` | 18 |
| Elementos con clase que contiene `framer-` | 941 |
| Solicitudes observadas | 94 |
| Solicitudes locales | 44 |
| Intentos a `framerusercontent.com` | 48 |
| Intentos a `framer.com` | 1 |
| Intentos a `unpkg.com` | 1 |

La red externa estaba bloqueada por el entorno de auditoria, por lo que las 50 solicitudes externas fallaron con `ERR_NETWORK_ACCESS_DENIED`. El fallo es evidencia util: el clon intento usar esos recursos y no es autosuficiente con terceros bloqueados.

Entre las solicitudes intentadas aparecen:

- `https://framer.com/edit/init.mjs`;
- imagenes de `framerusercontent.com/images/...`;
- indices CMS `.framercms` alojados en `framerusercontent.com`;
- `https://unpkg.com/lenis@1.3.19/dist/lenis.css`.

## 8. Por que el check actual no lo detecto

`scripts/sanitize-framer-snapshots.mjs` declara expresamente que mantiene clases y nombres `data-*` generados porque son necesarios para el CSS y el runtime. Eso no es una limpieza fallida: es la confirmacion de que el resultado sigue dependiendo del contrato interno de Framer.

`scripts/build-check.mjs` valida que el HTML no contenga ciertos textos publicos, por ejemplo `Framer`, `Made in Framer`, `framerusercontent` o `framer.com/edit`. Sin embargo:

- la busqueda de `Framer` es sensible a mayusculas y no bloquea miles de tokens `framer-*` en minusculas;
- no inspecciona estructuralmente hidratacion, clases, modulos, chunks o procedencia;
- no navega con terceros bloqueados;
- considera suficiente que existan snapshots y marcadores internos;
- incluso acepta marcadores concretos como `section.framer-hraw2d` y `framer-tfmxqs`.

Por eso el atajo podia pasar el build-check: el gate comprobaba la presencia del snapshot y una limpieza publica parcial, no la reconstruccion nativa.

## 9. Clasificacion provisional

### Prohibido en el entregable nativo

- los 76 modulos `.mjs` capturados de la plataforma;
- HTML completo de snapshots como respuesta de produccion;
- hidratacion, clases, atributos, selectores e identificadores de Framer;
- editor y CMS de Framer;
- solicitudes a dominios de la plataforma;
- un wrapper Next.js que se limite a servir esos artefactos.

### Candidatos a activos aprobados

- imagenes y videos de contenido que el proyecto decida conservar temporalmente;
- SVG de contenido despues de inventario individual.

### Requieren decision antes de aprobar

- 59 fuentes `.woff2` y su procedencia de carga;
- dos JSON que pueden contener datos o indices de runtime;
- cualquier activo cuyo valor dependa de una URL, transformacion o CMS del proveedor.

Esta clasificacion es tecnica y de procedencia; no realiza analisis legal.

## 10. Resultado de NR-01

Primera ejecucion: `PASS` como control negativo.

Se demostro que:

1. el inventario es reproducible por comandos y hashes;
2. el clon contiene runtime y estructura de origen aunque `package.json` parezca limpio;
3. una auditoria de pureza correcta debe rechazarlo;
4. las imagenes pueden separarse del runtime como clase de activo, sujetas a aprobacion;
5. la repeticion por una sesion independiente sigue siendo obligatoria antes de cerrar el gate de NR-01.

Siguiente estado permitido: `WAITING_INDEPENDENT_REPRODUCTION`.

## 11. Automatizacion reproducible posterior

Fecha: 2026-07-14.

Se incorporo al arnes un scanner estatico agnostico por proveedor:

```text
scripts/_lib/purity-inventory.mjs
scripts/purity-inventory.mjs
tests/purity-inventory.test.mjs
```

El scanner:

- recorre el entregable sin seguir enlaces simbolicos;
- excluye por defecto `.git`, `.next`, `node_modules`, `_arnes`, `arnes` y `spikes`;
- calcula SHA-256 por archivo y del arbol completo;
- cuenta marcadores, atributos, tokens e hidratacion del proveedor;
- inventaria dominios, archivos runtime y rutas que re-sirven HTML;
- rechaza escribir la evidencia dentro del objetivo auditado;
- emite `PURE_NATIVE` o `NOT_PURE_NATIVE` y codigo de salida util para gates.

Comando ejecutado:

```powershell
node scripts\purity-inventory.mjs `
  --root=C:\Desarrollo\healcure-clone `
  --provider=framer `
  --out=<directorio-temporal>\healcure-purity-inventory-2026-07-14.json
```

Resultado automatico:

| Metrica | Resultado |
| --- | --- |
| Veredicto | `NOT_PURE_NATIVE` |
| Archivos incluidos | 325 |
| Bytes incluidos | 111141010 |
| SHA-256 del arbol | `4f317bb39f2e78b8e6ea6761d5546773b5d32b6f3c237ce2b68a7ecd73058aa9` |
| SHA-256 del inventario | `90193df35797f91c3c0ecd97f09bf6777425bebd2d6498de0814b158c12bcff2` |
| Apariciones del proveedor | 80474 |
| Atributos del proveedor | 8837 |
| Tokens del proveedor | 75483 |
| Hooks de hidratacion | 806 |
| Archivos runtime con marcadores | 86 |
| Rutas que re-sirven snapshots | 2 |

Se ejecuto dos veces. Ambos JSON fueron identicos byte por byte y tuvieron SHA-256:

```text
b08fe30136c5742f753fff75b6d20a9d98f9f9fc00c8b4be9c564519ae5fd924
```

Evidencia preservada:

```text
docs/harness/reports/NR01-HEALCURE-PURITY-INVENTORY-2026-07-14.json
```

Esta repetibilidad automatica no se presenta como auditoria independiente. La revision externa queda diferida por decision humana, no eliminada del gate final.
