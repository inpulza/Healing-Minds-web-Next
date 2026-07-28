# Inpulza — Handoff: Motor SEO/Blog en Healing Minds Psychiatry

> Documento **atemporal** para coordinar el trabajo entre **CodeX** (implementa desde fuera)
> y **el agente de Replit** (revisa, migra y valida desde dentro). Sirve para arrancar
> cualquier conversación nueva sin arrastrar el contexto anterior.
>
> Aquí describimos **cómo trabajamos** (el método), no en qué punto exacto estamos.
> El **estado actual** se consulta en vivo: ver la sección "Dónde mirar el estado actual".

---

## 1. Qué es este proyecto

Healing Minds es un **piloto** para convertir el sistema editorial/SEO de **XL Homes** en un
módulo reutilizable de Inpulza. No es copiar el blog de XL Homes: es **adaptar** la
metodología probada a un contexto **sanitario / YMYL** (salud mental), por pasos pequeños,
sin "big bang".

- Sitio: Healing Minds Psychiatry (Dra. Melva Reve, Naples, FL). Bilingüe EN/ES.
- Stack: React 18.3.1 + Vite (front) y Express + Drizzle/Postgres (back).
- Dominio canónico: `https://www.healingmindsp.com`
- Search Console: `sc-domain:healingmindsp.com` · Sitemap: `/sitemap.xml`
- **Nunca** generar tokens de Google nuevos ni mostrar/commitear secretos.

---

## 2. Cómo trabajamos (el método, siempre igual)

- **CodeX** (fuera): planifica, implementa en ramas y abre **Pull Requests** en GitHub.
  Convención de rama: `codex/...`.
- **Replit (agente)** (dentro): revisa el PR, corre `npm run check` / `build`, aplica la
  migración a la BD real (`npm run db:push`), siembra/valida datos, corre las
  comprobaciones SEO (`seo:check`) y hace la revisión de código formal (architect). Verifica
  el deploy y el smoke test en producción.
- Ritmo: trabajamos por **incrementos pequeños y controlados**. Cada incremento se confirma
  en **alcance** ANTES de implementar. Nada de mezclar refactors grandes con cambios SEO
  críticos. Todo cambio importante pasa por **PR** o flujo controlado.
- Comunicación con el usuario: **español, lenguaje sencillo**.

### Cómo revisa el agente de Replit un PR de CodeX
- El repo es **privado**. El código de CodeX **no** llega solo al workspace: se queda en
  `origin/main` hasta que se trae.
- El shell del agente **no** tiene credencial de GitHub por defecto, pero existe el secreto
  `GITHUB_TOKEN`. `checkout`/`pull` de `origin` están **bloqueados** para el agente (se tratan
  como destructivos) y `git fetch` puede cortarse por el mismo guard. Cuando hace falta
  refrescar refs o publicar una rama, el agente da la credencial con un **helper en línea**
  (`credential.helper` efímero); el token nunca va en la URL del remoto ni en `argv`.
- Para **leer** un PR: usar la **API REST de GitHub** con `GITHUB_TOKEN`
  (`/repos/.../pulls/N`, `/pulls/N/files`, diff con `Accept: application/vnd.github.v3.diff`).
  Nunca imprimir el token.
- Para **ejecutar** el código del PR: el **usuario** lo trae con el **panel Git de Replit**
  (la UI sí tiene el OAuth). No usar tareas de proyecto aisladas para esto.

### Ciclo típico de cada incremento
1. CodeX abre el PR. → 2. El agente lo revisa por API y comenta si falta algo. →
3. El usuario trae la rama por el panel Git. → 4. El agente corre `check`/`build`/`db:push`,
siembra/valida y corre `seo:check`. → 5. Revisión de código formal (architect). →
6. Se mergea a `main`. → 7. Se publica y se valida en **producción** (smoke test + `seo:check`
con Google). → 8. Se cierra el incremento y se acuerda el siguiente.

---

## 3. Reglas y gotchas recurrentes (aplican siempre)

- **Producción es una BD SEPARADA de desarrollo.** Al pulsar **Publish**, Replit migra el
  **esquema** dev→prod automáticamente, **pero NO copia los datos**. Cualquier dato sembrado
  vive solo en dev hasta que algo lo escriba en prod. El agente solo tiene acceso **de solo
  lectura** a prod y **no** puede sembrar prod ni escribir scripts de migración de prod
  (Replit gestiona el esquema de prod). → Antes de decir "está en producción", confirmar que
  prod tiene los **datos**, no solo el esquema.
- **YMYL / salud:** tono médico responsable, fuentes fiables, cuidado con afirmaciones
  clínicas, **revisión humana antes de publicar**, disclaimers donde aplique.
- **SEO frágil:** SSR real (no Soft-404), canonical/hreflang correctos, autor del contenido
  como `Person` real, sin `aggregateRating`/`Review` en nodos de negocio. Cuidado con la
  trampa de la barra final `/es` vs `/es/`.
- **Secretos:** reusar la infra segura de Inpulza; nunca generar tokens de Google nuevos ni
  imprimir/commitear secretos.

---

## 4. Dónde mirar el estado actual (en vivo, no hardcodeado)

En lugar de fijar aquí "vamos por el paso N" (se queda obsoleto), consultar siempre:

- **Memoria del agente:** `.agents/memory/healing-minds-seo-engine.md` (roadmap + estado) y
  `.agents/memory/blog-architecture.md` (decisiones técnicas del blog).
- **GitHub:** PRs abiertos/mergeados y los últimos commits de `origin/main`
  (vía API con `GITHUB_TOKEN`).
- **`docs/`** del repo: notas de alcance de cada incremento, si las hay.
- **Producción:** `seo:check` contra el sitio en vivo y consulta de solo lectura a la BD de
  prod para confirmar datos.

---

## 5. Mensaje para abrir la próxima conversación (copiar/pegar)

```text
Proyecto Inpulza: estamos adaptando el sistema SEO/editorial de blog de XL Homes a Healing
Minds Psychiatry (web sanitaria YMYL, bilingüe EN/ES). Trabajamos por incrementos pequeños y
controlados: CodeX implementa desde fuera abriendo Pull Requests en GitHub, y tú (el agente de
Replit) revisas el PR desde dentro, traes/migras a la BD real, validas (check/build/db:push,
seed, seo:check), haces revisión de código y verificas el deploy en producción.

Antes de seguir, lee docs/INPULZA_HANDOFF.md y tu memoria
(.agents/memory/healing-minds-seo-engine.md + blog-architecture.md) para el método completo,
las reglas recurrentes y dónde está el estado actual. Para saber EN QUÉ PUNTO estamos, mira la
memoria y los PRs/commits de GitHub (no asumas) y, si hace falta, pregúntame.

Recuerda las reglas que no cambian: producción es una BD separada (al publicar se migra el
esquema pero NO los datos); contenido sanitario con revisión humana; SEO frágil (SSR real,
canonical/hreflang, autor Person); nunca generar tokens de Google nuevos ni imprimir secretos.

Háblame en español, sencillo.
```
