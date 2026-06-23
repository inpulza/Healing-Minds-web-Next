# Sprint 2 — Base del blog (alcance cerrado)

> Fuente de verdad del patrón probado: `docs/xl-homes-blog-reference.md` (brief del
> equipo de XL Homes). Este documento adapta ese patrón a **Healing Minds**, que es
> **bilingüe (en/es)** y **YMYL (salud)**. CodeX implementa vía PR; el agente de
> Replit revisa, aplica la migración a la BD real y valida con `seo:check`.

## Objetivo
Construir SOLO la base del blog: modelo de datos, rutas públicas indexables,
integración en el sitemap, fix del `410`, y SEO por post (canonical/meta/JSON-LD).
Una URL de blog debe pasar `seo:check` con `renderAudit.ok: true`.

## Fuera de alcance (NO implementar en Sprint 2)
Panel admin · generación con IA · research automático · imágenes automáticas ·
auto-publicación · workflow editorial. (El pipeline de IA del brief de XL Homes se
ignora por completo en este sprint.)

---

## Diferencias clave vs. XL Homes (lo que SÍ cambia para Healing)

1. **Bilingüe desde el día 1** (XL Homes es monolingüe en-US). Decisión confirmada.
2. **YMYL / E-E-A-T de salud**: el `author` del JSON-LD va como **`Person`** real
   (Dr. Melva Reve, con credenciales), enlazado a la práctica como `publisher`
   (Organization/MedicalClinic). XL Homes usa Organization como author; para
   psiquiatría eso es débil ante Google. Modelamos autor-persona desde el inicio.
3. **NO tocar** el contacto ni `MemStorage`. El blog estrena su capa Postgres
   aislada. (Healing hoy corre todo en `MemStorage`; no se migra nada existente.)

---

## 1) Almacenamiento — Postgres real (Drizzle), módulo aislado

- Crear `server/db.ts`: cliente Postgres + Drizzle usando `process.env.DATABASE_URL`
  (`@neondatabase/serverless` ya está como dependencia). El secret `DATABASE_URL`
  (+ PG*) **ya existe** — no generar credenciales nuevas.
- Capa de storage del blog **separada** (p.ej. `server/blog/storage.ts`), NO mezclar
  con `server/storage.ts` (contacto/usuarios siguen en `MemStorage` intactos).
- Métodos mínimos:
  - `getBlogPosts({ status?, language?, categorySlug?, tagSlug?, limit?, offset? })`
    → filtra por `status='published'` en rutas públicas, ordena por `publishedAt DESC`,
    devuelve relaciones (author, category, tags).
  - `getBlogPostBySlug(slug, language)` → post + relaciones.
  - `getPostTranslations(translationGroupId)` → versiones en/es para construir hreflang.
- Migración: `shared/schema.ts` + `npm run db:push` (sin SQL manual). **La aplica el
  agente de Replit en el entorno** tras el merge (CodeX no puede tocar la BD real).

## 2) Modelo de datos (`shared/schema.ts`)

Replicar el esquema de XL Homes (`docs/xl-homes-blog-reference.md` §1) con estas
**adaptaciones bilingües**:

- `blogPosts`: añadir
  - `language varchar(5) NOT NULL` (`'en' | 'es'`)
  - `translationGroupId` (uuid o integer) compartido entre las dos versiones de un
    mismo artículo.
  - **Cambiar el unique global de `slug`** por un **índice único compuesto
    `(language, slug)`** (permite el mismo slug en otro idioma sin colisión).
- `blogCategories` y `blogTags`: añadir `language varchar(5)` (y opcionalmente
  `translationGroupId` si se quiere enlazar categorías traducidas; para la base
  basta `language`).
- `blogAuthors`: tal cual (name, title, bio, imageUrl) — se usará como **Person**.
- `blogPostTags`: pivote con PK compuesta `(postId, tagId)` igual que el brief.
- **NO** crear `post_images` ni nada del pipeline de IA en este sprint.
- Para cada tabla: `insert...Schema` con `createInsertSchema` (drizzle-zod), tipos
  `$inferSelect` y `z.infer`, siguiendo las guías del repo.

Campos obligatorios/opcionales: igual que el brief, más `language` (obligatorio) y
`translationGroupId` (obligatorio para enlazar; si un post aún no tiene traducción,
su grupo lo contiene a él solo).

## 3) Rutas públicas (bilingües)

- `/blog` (inglés) y `/es/blog` (español) → índice/archivo.
- `/blog/:slug` (inglés) y `/es/blog/:slug` (español) → post individual.
- Categoría/tag: para la base, replicar el patrón de XL Homes por **query param**
  (`/blog?category=:slug`, `/blog?tag=:slug`) — rutas reales de archivo quedan para
  más adelante. (Documentar como deuda técnica conocida.)
- Registrar en `client/src/App.tsx` (wouter), siguiendo el patrón bilingüe existente
  de Healing y su `urlMapping.ts` para el cambio de idioma.

## 4) Renderizado indexable — anti Soft 404 (CRÍTICO)

Replicar EXACTAMENTE el patrón de `server/ssr-meta.ts` del brief (§4 y §"3 puntos
donde NO improvisar"). Healing ya inyecta meta server-side en
`server/utils/html-injection.ts`: **extender ese mismo mecanismo** para blog, NO
crear un segundo sistema que compita.

- Buscar el post por `(language, slug)`; si no existe o `status != 'published'` →
  **404 real server-side** (ver §7).
- Inyectar en el `<head>`: `<title>`, meta description, OG/Twitter,
  `<link rel="canonical">`, hreflang (en/es/x-default) y JSON-LD.
- Inyectar el **artículo COMPLETO ya sanitizado** (no preview) para el crawler.
- Inyectar `window.__SSR_BLOG_POST__ = {...}` con el **mismo shape** que devuelve
  `GET /api/blog/posts/:slug`, para que `BlogPostPage.tsx` renderice **síncrono** en
  el `#root` visible (sin skeleton, sin fetch en el primer paint). Refetch en
  background para frescura.
- **Los 3 puntos donde CodeX NO debe improvisar** (del brief): render síncrono desde
  `__SSR_BLOG_POST__`, allowlist de `sanitize-html`, y mismo shape API↔SSR.

## 5) SEO por post

- Meta: `metaTitle` (≤70), `metaDescription` (≤160), OG/Twitter desde
  `featuredImage`/`featuredImageAlt`. Canonical se **calcula**
  (`${BASE_URL}/blog/${slug}` o `${BASE_URL}/es/blog/${slug}` según idioma), usando el
  config centralizado `server/seo/config.ts` (Sprint 1) — no hardcodear el dominio.
- JSON-LD por artículo: `BlogPosting` + `BreadcrumbList`.
  - `inLanguage`: `"en-US"` o `"es"` según el post.
  - **`author` como `Person`** (Dr. Melva Reve) con `@id`; `publisher` = la práctica
    (Organization/MedicalClinic, reutilizar el `@id` de los schemas existentes de
    Healing). E-E-A-T de salud.
  - `datePublished` (publishedAt), `dateModified` (updatedAt), `mainEntityOfPage`,
    `isPartOf` (#website), `wordCount`, `image`.
- **Prohibido**: `aggregateRating`/`Review` en Organization/MedicalClinic (riesgo de
  acción manual de Google) — regla del brief §5.

## 6) Sitemap (`server/routes/sitemap.ts`)

- Añadir las URLs de posts **publicados** (`status='published'`), `lastmod` =
  `publishedAt || updatedAt || createdAt`, `changefreq monthly`, `priority 0.6`.
- **Incluir hreflang en el sitemap** (`<xhtml:link rel="alternate" hreflang>`) entre
  las versiones en/es de cada artículo (a partir del `translationGroupId`). Esto es
  el añadido bilingüe respecto a XL Homes.
- Mantener consistencia con el manejo de hreflang del resto del sitemap de Healing
  (ojo con la trampa `/es` vs `/es/` ya documentada en memoria).

## 7) Fix del `410` (`server/routes.ts`)

Regla actual (≈línea 95) que **mata el blog en español**:
```ts
(pathname.includes('/blog/') && !pathname.startsWith('/blog'))
```
`/es/blog/mi-post` incluye `/blog/` y NO empieza por `/blog` → 410 indebido.

- Ajustar para **permitir** `^/blog/` y `^/es/blog/` (ambos idiomas) y seguir
  bloqueando las URLs fantasma de WordPress (mantener el resto de condiciones del
  bloque intactas: `/wp-`, `/feed`, `/home-`, etc.).
- Para slug no publicado/inexistente: devolver **404 real server-side** en
  `/blog/:slug` y `/es/blog/:slug` (no dejar que caiga al render SPA por defecto, que
  reactivaría Soft 404).
- Cambio quirúrgico: NO reescribir el middleware entero, solo la condición del blog.

## 8) Datos de prueba (para validar sin admin)

Como el panel admin está fuera de alcance, incluir un **seed mínimo**
(`scripts/seed-blog.ts` o equivalente) que inserte **1 artículo publicado en/es**
(con autor, categoría, ≥1 tag, ≥75 palabras de contenido real, meta y publishedAt)
para poder ejecutar `seo:check`. Sin esto no hay URL que auditar.

## 9) Criterio de aceptación (validación del agente de Replit)

1. `npm run check` y `npm run build` → exit 0.
2. `npm run db:push` aplica el esquema sin errores destructivos.
3. Seed inserta el post de prueba en/es.
4. `npm run seo:check -- /blog/<slug>` y `/es/blog/<slug>` →
   `renderAudit.ok: true` (status 200, canonical exacto, indexable, title+h1,
   words ≥ 75, presente en sitemap).
5. Borrador / slug inexistente → 404 real (no Soft 404).
6. hreflang en/es correctos en el `<head>` y en `sitemap.xml`.
7. `seo:check` con Google (sin `--no-google`) sigue funcionando (no rompimos la capa
   GSC del Sprint 1).

---

### Orden de implementación recomendado (del brief)
1. Esquema y tipos → 2. Storage → 3. API routes → 4. Páginas cliente →
5. SSR anti–Soft 404 → 6. Sitemap → 7. Fix 410 → 8. Seed. No saltar el orden: el SSR
depende del storage y del shape del payload de la API.
