# Referencia 03 — Handoff a Replit (Fase 3, entrega)

Cómo convertir el fix en **un único archivo** que Jordan sube al Replit del cliente
y el **Agente de Replit** ejecuta. Jordan no edita código a mano.

## El flujo

```
Claude (este skill)                    Jordan                 Replit Agent
─────────────────                      ──────                 ────────────
Fase 1: audita → detecta dominio,      Sube replit-fix-       Lee el brief,
stack, rutas, bilingüe sí/no           brief.md al Replit     edita los archivos,
        │                              del cliente            corre la verificación
        ▼                                   │                       │
genera replit-fix-brief.md  ───────────────►│──────────────────────►│
(personalizado)                                                      ▼
                                                          Jordan pulsa "Publish"
```

## Cómo generar el brief

1. **Toma los datos de la Fase 1**: dominio, host canónico (¿www o apex?), stack,
   bilingüe (sí/no), healthcare (sí/no), lista de rutas reales (del sitemap o del
   archivo `revisar paginas indexadas.txt` del cliente si existe).
2. **Copia la plantilla de abajo** y rellena los `[[PLACEHOLDERS]]`.
3. **Incrusta el código** de `02-fix-playbook.md` que aplique — ya resuelto con los
   valores reales del cliente (no dejes placeholders en el código que va al brief).
4. **Recorta lo que no aplica**: si el sitio no es bilingüe, borra la Fase 2 entera
   del brief; si no es healthcare, borra la sección de JSON-LD médico.
5. Guarda como `[N. Cliente]/08. Web/_audits/replit-fix-brief.md`.

## Qué entregar a Jordan

Junto al brief, dile a Jordan exactamente esto:

> 1. Abre el proyecto del cliente en Replit.
> 2. Sube `replit-fix-brief.md` a la raíz del proyecto (arrastrar y soltar).
> 3. Abre el Agente de Replit y escríbele: *"Lee replit-fix-brief.md en la raíz
>    del proyecto y aplícalo paso a paso. Al terminar, corre la sección de
>    verificación y muéstrame los resultados."*
> 4. Cuando el Agente termine y la verificación pase, pulsa **Publish / Deploy**.
> 5. Avísame para hacer la Fase 4 (validación en Search Console).

---

## PLANTILLA — `replit-fix-brief.md`

> Todo lo que va entre `[[ ]]` se reemplaza antes de entregar. El código ya debe ir
> resuelto con los valores reales.

````markdown
# Brief de arreglo SEO — [[CLIENTE]]

**Para:** el Agente de Replit de este proyecto.
**Objetivo:** hacer que el servidor entregue metadata y contenido por ruta, para
que Google pueda indexar cada página. Hoy todas las páginas devuelven el mismo HTML.

**Stack de este proyecto:** [[STACK]] · **Dominio:** [[DOMINIO]] · **Host
canónico:** [[CANONICAL_HOST]] · **Bilingüe:** [[SÍ/NO]]

## Reglas para el Agente

- Aplica los pasos EN ORDEN. No saltes pasos.
- NO cambies de framework ni reescribas la app. Solo añade/edita lo indicado.
- Si un archivo indicado no existe con ese nombre, búscalo por su rol (el server
  Express, el `index.html` del cliente, la tabla de rutas) y adapta.
- Registra los middlewares en este orden en el server Express, ANTES de las rutas
  existentes y de `setupVite`/`serveStatic`: ① canonical-host → ② [[redirect de
  idioma, si bilingüe]] → ③ inyección SEO.
- Al terminar, corre la sección "Verificación" y reporta los resultados.

## Paso 1 — Host canónico

[[Pegar aquí el middleware de la Fase 0 de 02-fix-playbook.md, con CANONICAL_HOST
ya resuelto.]]

## Paso 2 — Crear `server/seo/route-meta.ts`

Crea este archivo con el registro de TODAS las rutas reales del sitio:

[[Pegar route-meta.ts resuelto. La lista ROUTE_META debe contener una entrada por
cada una de estas rutas con su title y description propios:
[[LISTA DE RUTAS REALES]] ]]

## Paso 3 — Crear `server/seo/render-head.ts`

[[Pegar render-head.ts de 02-fix-playbook.md.]]

## Paso 4 — Middleware de inyección SEO en el server

[[Pegar el middleware bufferizado de index.ts de 02-fix-playbook.md.]]

## Paso 5 — `client/index.html`

Añade los atributos `data-default-*` a los tags SEO existentes y pega el IIFE de
limpieza antes del `<script type="module">`:

[[Pegar el bloque de client/index.html de 02-fix-playbook.md.]]

## [[Paso 6 — Prefijos de idioma /es/ /en/  — SOLO si bilingüe; si no, borrar]]

[[Pegar la Fase 2 completa de 02-fix-playbook.md.]]

## Paso [[N]] — 404 reales para URLs inexistentes

Ya incluido en el middleware del Paso 4 vía `isPhantomPath`. Verifica que esté.

## Paso [[N]] — Sitemap

Crea `scripts/generate-sitemap.mjs` [[pegar assets/generate-sitemap.mjs resuelto]]
y añade a package.json: `"sitemap:generate": "node scripts/generate-sitemap.mjs"`.
Córrelo una vez.

## Verificación (correr al terminar, reportar salida)

```bash
# Cada ruta su propio title (deben ser DISTINTOS)
for u in / /about [[/ruta-servicio]]; do
  curl -s "http://localhost:5000$u" | grep -oE '<title[^>]*>[^<]+'
done
# URL inventada → 404
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/no-existe-xyz
# canonical exactamente 1
curl -s http://localhost:5000/about | grep -c '<link rel="canonical"'
# host canónico
curl -sI -H "x-forwarded-host: [[HOST NO CANÓNICO]]" -H "x-forwarded-proto: https" \
  http://localhost:5000/about | grep -iE 'HTTP|location'
```

Criterios de éxito: 3 titles distintos · URL inventada da 404 · canonical = 1 ·
el host no-canónico da 301 sin `:443`.

## Si algo falla

No publiques. Revisa el orden de los middlewares y reporta el error exacto.
````

---

## Notas

- El brief es **autocontenido**: el Agente de Replit no necesita ningún otro
  archivo. Todo el código va incrustado y resuelto.
- Un brief por cliente. No reutilices uno entre clientes sin re-personalizar
  (dominio, rutas y bilingüe cambian).
- Si el cliente NO está en Replit o el stack no es SPA+Express, el handoff cambia:
  para Next.js/Astro entrega las adaptaciones de `02-fix-playbook.md §Otros stacks`
  como brief; para WordPress este skill no aplica.
- Si en el futuro hay acceso directo al repo (Claude Code dentro del Replit, o
  GitHub conectado), salta el brief: aplica `02-fix-playbook.md` directamente y ve
  a la Fase 4.
