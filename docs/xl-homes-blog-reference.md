# Cómo está estructurado el blog de XL Homes (brief de replicación)

Stack: React 19 + Vite (frontend), Express + TypeScript (backend), Drizzle ORM + PostgreSQL. Motor de blog propio con generación de contenido por IA, SSR para indexabilidad, y metadatos/JSON-LD por post.

---

## 1) Base de datos y almacenamiento

Sí: los posts se guardan en **Postgres real con Drizzle ORM**. No hay otra capa (ni archivos, ni CMS externo). Conexión en `server/db.ts`, config en `drizzle.config.ts`.

Esquema completo (de `shared/schema.ts`):

```ts
export const blogPostStatusEnum = pgEnum('blog_post_status',
  ['draft', 'pending_review', 'published', 'rejected']);

export const blogAuthors = pgTable("blog_authors", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }),
  bio: text("bio"),
  imageUrl: varchar("image_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogCategories = pgTable("blog_categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogTags = pgTable("blog_tags", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content"),
  featuredImage: varchar("featured_image", { length: 500 }),
  featuredImageAlt: varchar("featured_image_alt", { length: 255 }),
  authorId: integer("author_id").references(() => blogAuthors.id, { onDelete: 'set null' }),
  categoryId: integer("category_id").references(() => blogCategories.id, { onDelete: 'set null' }),
  status: blogPostStatusEnum("status").default('draft').notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  metaTitle: varchar("meta_title", { length: 70 }),
  metaDescription: varchar("meta_description", { length: 160 }),
  readingTime: integer("reading_time"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_blog_posts_status").on(table.status),
  index("idx_blog_posts_published_at").on(table.publishedAt),
  index("idx_blog_posts_category_id").on(table.categoryId),
]);

// Pivote post <-> tag (PK compuesta)
export const blogPostTags = pgTable("blog_post_tags", {
  postId: integer("post_id").references(() => blogPosts.id, { onDelete: 'cascade' }).notNull(),
  tagId: integer("tag_id").references(() => blogTags.id, { onDelete: 'cascade' }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.postId, table.tagId] }),
}));
```

Obligatorias vs opcionales en `blog_posts`:
- **Obligatorias** (NOT NULL): `id`, `title`, `slug` (UNIQUE), `status` (default `draft`), `isFeatured` (default `false`), `createdAt`, `updatedAt`.
- **Opcionales** (nullable): `excerpt`, `content`, `featuredImage`, `featuredImageAlt`, `authorId`, `categoryId`, `metaTitle`, `metaDescription`, `readingTime`, `publishedAt`.

Tabla adicional `post_images` (imágenes IA por artículo): tipos `hero | thumbnail | inline | og_image`, con `imageUrl`, `altText`, `isSelected`, `status`, `sortOrder`. Útil si más adelante automatizas imágenes.

**Migraciones**: se usa `drizzle-kit push` (script `db:push` en `package.json`) contra el esquema en `shared/schema.ts`. La config (`drizzle.config.ts`) apunta a `out: "./migrations"`, `dialect: "postgresql"`, `url: process.env.DATABASE_URL`. El flujo normal es editar `shared/schema.ts` y correr `npm run db:push` (push directo, sin archivos de migración versionados a mano). Recomendación: no escribir SQL manual; deja que Drizzle haga el diff.

---

## 2) Bilingüe (inglés/español) — ESTADO ACTUAL: NO implementado

Importante para tu réplica: **el blog de XL Homes hoy es monolingüe (en-US)**. No hay columna `language`, ni `translationGroupId`, ni hreflang en el sitemap. El JSON-LD fija `"inLanguage": "en-US"`.

Si quieres bilingüe bien hecho desde el principio (recomendado), el patrón sugerido es:
- Añadir a `blog_posts`: `language varchar(5)` (`'en' | 'es'`) y `translationGroupId` (uuid/integer compartido entre las dos versiones).
- **Slug distinto por idioma** y colisiones evitadas con índice único compuesto `(language, slug)` en vez de `slug` único global.
- **hreflang**: generarlos a partir del `translationGroupId` (buscas las versiones del grupo y emites `<link rel="alternate" hreflang="es" href="...">` / `"en"` / `"x-default"`) tanto en el `<head>` SSR como dentro del sitemap (`<xhtml:link rel="alternate">`).
- URLs: lo más limpio es prefijo de idioma, p.ej. `/blog/:slug` (en) y `/es/blog/:slug` (es).

---

## 3) Rutas públicas

Definidas en `client/src/App.tsx` (router `wouter`):
- `/blog` → índice/archivo (`client/src/pages/BlogPage.tsx`)
- `/blog/:slug` → post individual (`client/src/pages/BlogPostPage.tsx`)

- **Archivo por categoría / tag**: NO son rutas propias; se filtran por **query param**: `/blog?category=:slug` y `/blog?tag=:slug`. El JSON-LD de breadcrumb apunta a `/blog?category=...`.
- **Paginación**: lado cliente con `limit`/`offset` contra `/api/blog/posts` (no usa `rel=next/prev` ni `?page=`). Para tu réplica, si te importa SEO de paginación, conviene migrar a `?page=` con rutas reales.

---

## 4) Renderizado e indexabilidad (la parte clave del SEO)

El servidor hace **inyección de HTML por post (SSR ligero)** en `server/ssr-meta.ts`. Intercepta la petición, busca el post por slug, y reescribe el `index.html` antes de mandarlo:

- Inyecta `<title>`, meta description, OG/Twitter, `<link rel="canonical">` y JSON-LD en el `<head>`.
- Inyecta el **artículo completo** (no un preview recortado) ya sanitizado, para que el crawler reciba contenido sustancial sin ejecutar JS.
- Además inyecta los datos del post como `window.__SSR_BLOG_POST__` para que el cliente **renderice el artículo de forma síncrona en el primer paint** (sin skeleton, sin fetch). Esto es el fix canónico del **"Soft 404"** de Google en SPAs.

```ts
// server/ssr-meta.ts — reescritura de canonical/og:url
html.replace(
  /<link rel="canonical" href="[^"]*"\s*\/?>/,
  `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`
);
// Inyección de datos para hidratación síncrona
meta.inlineData
  ? `<script>window.__SSR_BLOG_POST__=${meta.inlineData}</script>\n    `
  : '';
```

`BlogPostPage.tsx` lee `window.__SSR_BLOG_POST__` en los inicializadores de `useState`, así el `#root` visible queda lleno al instante; luego refetch en background para frescura + posts relacionados.

> Lección dura aprendida: Google **no** acredita el contenido de un `<div>` oculto fuera de pantalla. El contenido tiene que renderizar en el `#root` VISIBLE de forma síncrona, igual que las páginas de proyectos/ubicaciones. (Documentado internamente como el fix de Soft 404.)

---

## 5) SEO por post

Metadatos guardados en `blog_posts`: `metaTitle` (≤70), `metaDescription` (≤160), `featuredImage` + `featuredImageAlt` (para OG/Twitter), `excerpt`, `publishedAt`, `updatedAt`, `categoryId`, `authorId`, tags (vía pivote). Canonical se calcula (`${BASE_URL}/blog/${slug}`), no se guarda en columna.

JSON-LD por artículo: **`BlogPosting`** + **`BreadcrumbList`** (generados en `server/ssr-meta.ts`; también hay componente cliente `client/src/components/BlogSEO.tsx`). Campos reales:

```ts
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.title,
  "description": description,
  "image": image,
  "datePublished": publishedDate,   // ISO, desde publishedAt
  "dateModified": modifiedDate,     // ISO, desde updatedAt
  "author":   { "@type": "Organization", "@id": ".../#organization", "name": "XL Homes of SWFL", ... },
  "publisher":{ "@type": "Organization", "@id": ".../#organization", "logo": {...} },
  "mainEntityOfPage": { "@type": "WebPage", "@id": ".../blog/<slug>" },
  "isPartOf": { "@type": "WebSite", "@id": ".../#website" },
  "wordCount": <conteo>,
  "keywords": "<tags + categoría + marca>",
  "about": { "@type": "Thing", "name": "<categoría>" },
  "inLanguage": "en-US"
}
```

**E-E-A-T / autor**: existe tabla `blog_authors` (name, title, bio, imageUrl) y `blogPosts.authorId`. El byline visible usa `post.author?.name` (fallback "XL Homes of SWFL"). OJO: en el JSON-LD el `author` se fija hoy a la **Organización** (no a la `Person`), decisión deliberada de marca. No se modela un "revisor" aparte. Si quieres E-E-A-T más fuerte, emite `author` como `Person` con `@id` enlazado a la org como `publisher`.

> Nota de política de reseñas (relevante para no romper Rich Results): en este sitio **no** se emite `aggregateRating`/`Review` en nodos de negocio/Product/Service. Google penaliza reseñas auto-recolectadas en `LocalBusiness`/`Organization`.

---

## 6) Integración con el sitemap

`server/sitemap.ts` consulta solo publicados y añade una `<url>` por post:

```ts
const result = await storage.getBlogPosts({ status: 'published', limit: 500 });
// por post:
const lastmod = formatDate(post.publishedAt || post.updatedAt || post.createdAt);
//   <loc>${BASE_URL}/blog/${post.slug}</loc>
//   <lastmod>${lastmod}</lastmod>
//   <changefreq>monthly</changefreq><priority>0.6</priority>
```

- Se **filtra por estado** (`published`) y la fecha sale de `publishedAt` (fallback updated/created).
- **hreflang en el sitemap: NO** (porque hoy es monolingüe). Si haces bilingüe, aquí añades los `<xhtml:link rel="alternate" hreflang>`.
- Hay índice de sitemaps (`sitemap-index.xml`) que agrupa sitemap, image-sitemap y video-sitemap; referenciado en `robots.txt`.

---

## 7) Estado y publicación

- Enum `status`: `draft | pending_review | published | rejected` (+ `publishedAt`). El flujo IA crea en `draft` con `publishedAt: null`; un humano aprueba en el panel `/admin/blog`.
- **Borradores fuera de todo lo público**: tanto `server/ssr-meta.ts` (`if (!post || post.status !== 'published') return null;`) como las rutas API y el sitemap filtran por `published`.
- Para un slug no publicado/inexistente: el SSR devuelve null (cae al render por defecto / 404 del cliente). No hay manejo explícito de **410**; si te importa, devuelve 404 real en `/blog/:slug` server-side cuando el post no esté publicado.

---

## 8) Formato del contenido y sanitización

- El cuerpo (`content`) se guarda como **HTML** (texto generado por IA o manual), no Markdown ni JSON.
- **Sanitización doble**:
  - Servidor: `sanitize-html` con allowlist estricto en `server/ssr-meta.ts` (`sanitizeContentHtml`) antes de inyectar el artículo al crawler.
  - Cliente: `dompurify` en `BlogPostPage.tsx` antes de pintar.
- Hay además una "purga tipográfica" (em-dashes, comillas curvas, palabras-firma de IA) en el pipeline de generación para limpiar la huella de IA.

---

## 9) Categorías y tags

- Tablas planas: `blog_categories` (name, slug único, description) y `blog_tags` (name, slug único). Relación post↔tag por pivote `blog_post_tags` (PK compuesta `postId+tagId`); categoría por FK directa `blogPosts.categoryId`.
- **No son bilingües** hoy (un único name/slug por entrada). Para bilingüe: mismo patrón que posts (columna `language` + grupo de traducción, o tabla de traducciones).

---

## 10) Imágenes

- Imagen destacada: columnas `featuredImage` (URL) y `featuredImageAlt` (alt) en `blog_posts`.
- Gestión avanzada (multi-imagen por post) en `post_images`: tipos `hero|thumbnail|inline|og_image`, con `imageUrl`, `altText`, `isSelected`, `status`, `sortOrder`, `promptUsed`. El SSR arma `images.{hero,thumbnail,inline}` desde las marcadas `isSelected && status='completed'`.

---

## 11) Lecciones aprendidas / cosas a evitar

1. **Soft 404 en SPA**: el mayor problema. Un `#root` vacío que se llena por fetch async hace que Google marque "Soft 404 / thin content". Solución: render **síncrono** del artículo completo en el `#root` visible (datos inyectados en `window.__SSR_BLOG_POST__`) + HTML del artículo inyectado por SSR. No confíes en divs ocultos off-screen: Google no los acredita.
2. **Inyecta el artículo COMPLETO**, no un preview recortado, en el payload del crawler (sanitizado). Un preview corto reactiva el Soft 404.
3. **Decide el bilingüe desde el día 1.** Re-adaptar slugs/hreflang después es caro. Usa `(language, slug)` único + `translationGroupId` y emite hreflang en head y sitemap.
4. **No metas `Review`/`aggregateRating`** en Organization/LocalBusiness/Product/Service: viola la política de Google y arriesga acción manual.
5. **JSON-LD author como Organization** funciona, pero si buscas E-E-A-T máximo, usa `Person` real con bio (`blog_authors` ya lo soporta).
6. **Paginación por query param** (`?category=`) no es ideal para SEO de archivos; considera rutas reales `/blog/category/:slug` y `?page=` con rel next/prev si el volumen crece.
7. **`routes.ts` del blog creció demasiado** (~1.8k líneas). Modularízalo desde el principio (posts / generation / images / research / verification).
8. **Migraciones**: `drizzle-kit push` es cómodo en dev; en prod ten cuidado con cambios destructivos de columnas — revisa el diff antes.

---

## Archivos relevantes (rutas exactas para tu otro agente)

- `shared/schema.ts` — esquema Drizzle (todas las tablas del blog).
- `drizzle.config.ts` — config de migraciones / dialecto / DATABASE_URL.
- `server/db.ts` — conexión Postgres + Drizzle.
- `server/blog/routes.ts` — API del blog (CRUD, generación IA, filtros por status).
- `server/ssr-meta.ts` — inyección SSR de meta + JSON-LD + artículo + `window.__SSR_BLOG_POST__` (ver `getBlogPostMeta`, líneas ~140-260).
- `server/sitemap.ts` — generación de sitemap (filtro `published`, lastmod).
- `client/src/App.tsx` — rutas `/blog` y `/blog/:slug` (wouter).
- `client/src/pages/BlogPage.tsx` — índice + filtros + paginación cliente.
- `client/src/pages/BlogPostPage.tsx` — render síncrono desde SSR + dompurify.
- `client/src/components/BlogSEO.tsx` — JSON-LD/meta lado cliente.
- `docs/BLOG_MANUAL.md` — manual completo del sistema de blog (incluye guía de replicación).

---

## Guía de lectura para CodeX (con acceso al repo)

CodeX tiene acceso al repositorio, así que en vez de copiar código aquí, estas son las **ubicaciones exactas** que debe abrir, qué extraer de cada una, y en qué orden replicarlo. Las líneas son aproximadas (el archivo puede cambiar): si no coinciden, busca por el símbolo indicado.

### Orden de implementación recomendado
1. Esquema y tipos → 2. Capa de storage → 3. API routes → 4. Páginas cliente → 5. SSR anti–Soft 404 → 6. Sitemap. No saltes el orden: el SSR depende del storage y del shape del payload de la API.

### Mapa de archivos y qué extraer

1. **`shared/schema.ts`** (líneas ~13-166)
   - Símbolos: `blogPostStatusEnum`, `blogAuthors`, `blogCategories`, `blogTags`, `blogPosts`, `blogPostTags`, `postImages`.
   - Extraer: definición exacta de columnas, el enum de `status`, la PK compuesta del pivote, los `insert...Schema` (Zod) y los tipos `$inferSelect`. Replica este patrón tal cual.

2. **`drizzle.config.ts`** + `package.json` (script `db:push`)
   - Extraer: dialecto `postgresql`, `out: ./migrations`, uso de `DATABASE_URL`, y que las migraciones se aplican con `drizzle-kit push`.

3. **`server/db.ts`**
   - Extraer: cómo se inicializa el cliente Postgres + Drizzle (pool/cliente y el `drizzle(...)`).

4. **`server/storage.ts`**
   - `getBlogPosts(options)` — interfaz en línea ~90, implementación ~290. Extraer: filtros por `status`, orden por `publishedAt DESC`, paginación `limit/offset`, y el join de relaciones (`BlogPostWithRelations`: author, category, tags).
   - `getBlogPostBySlug(slug)` — interfaz ~92, implementación ~419. Extraer: cómo trae el post + relaciones por slug.
   - `getPostImages(postId)` — interfaz ~109, implementación ~504. Extraer: cómo trae las imágenes del post.
   - Clave: el SSR y la API dependen de que estos métodos devuelvan el mismo shape con relaciones.

5. **`server/blog/routes.ts`** (archivo grande, ~1.8k líneas)
   - Extraer: el endpoint `GET /api/blog/posts/:slug` y su shape de respuesta (es el que el SSR replica), y el filtro `status: 'published'` en las rutas públicas. Ignora por ahora todo el pipeline de generación IA si no lo necesitas.
   - Nota: modularízalo desde el inicio en tu proyecto (posts / images / generation).

6. **`client/src/App.tsx`**
   - Extraer: registro de rutas `wouter` `/blog` y `/blog/:slug`.

7. **`client/src/pages/BlogPage.tsx`**
   - Extraer: lectura de query params `?category=` / `?tag=`, fetch a `/api/blog/posts` y paginación cliente (`limit`/`offset`).

8. **`client/src/pages/BlogPostPage.tsx`** (CRÍTICO para Soft 404)
   - `readInlinedPost()` (~línea 368-374) y los `useState` inicializados desde él (~381-385). Extraer: cómo lee `window.__SSR_BLOG_POST__` y arranca con `loading=false` cuando hay datos inyectados (render síncrono, sin skeleton), refetch en background.
   - `import DOMPurify from 'dompurify'` (línea 3): cómo sanitiza `content` antes de pintar con `dangerouslySetInnerHTML`.

9. **`server/ssr-meta.ts`** (CRÍTICO — el corazón del SEO)
   - `safeInlineJson` / `escapeHtml` (~líneas 25-45): cómo serializa de forma segura el JSON inyectado en `<script>`.
   - `sanitizeContentHtml` (~líneas 52-74): el **allowlist exacto** de `sanitize-html` (`allowedTags`, `allowedAttributes`, `disallowedTagsMode: 'discard'`). Cópialo tal cual.
   - `getBlogPostMeta(slug)` (~líneas 140-260): construcción de title/description/canonical, JSON-LD `BlogPosting` + `BreadcrumbList`, el HTML del `<article>` completo, y el armado de `inlineData` (`window.__SSR_BLOG_POST__`) con el mismo shape que la API.
   - `injectMetaIntoHtml(html, meta)` (~línea 1468 en adelante): la cadena de `.replace(...)` que reescribe title, meta description, canonical, og/twitter y **antepone** el `<script>window.__SSR_BLOG_POST__=...</script>` antes del bundle de React (~línea 1547-1551).
   - El dispatcher que hace `match` de `/blog/:slug` y llama a `getBlogPostMeta` (~línea 1426).

10. **`server/sitemap.ts`** (~líneas 103-110)
    - Extraer: `storage.getBlogPosts({ status: 'published', limit: 500 })`, el `lastmod = publishedAt || updatedAt || createdAt`, `changefreq monthly`, `priority 0.6`. (No hay hreflang porque es monolingüe.)

11. **`client/src/components/BlogSEO.tsx`** (~líneas 47-58)
    - Extraer: cómo inyecta/actualiza `<script type="application/ld+json">` en el `<head>` lado cliente (complementa al SSR).

## Auditoria del archivo publico para Healing Minds (2026-08-03)

La implementacion viva de XL Homes en `client/src/pages/BlogPage.tsx` hace tres cosas utiles: separa una tarjeta featured, muestra el resto en grid de tres columnas y carga bloques de nueve mediante `limit/offset`, conservando el filtro de categoria en la URL. Ese patron visual se adapta a Healing Minds.

No se copia literalmente su deuda:

- XL decide el featured solo dentro del bloque cargado y luego lo elimina del grid. Si el destacado cae en otro offset, puede desaparecer de esa pagina y el total visible deja de coincidir con el total de API.
- Load More agrega contenido solo por JavaScript. No crea una URL SSR por bloque ni enlaces anterior/siguiente, por lo que un crawler no tiene un camino HTML estable hasta cada lote.
- El orden usa fecha sin `id` como ultimo desempate; publicaciones con timestamps iguales pueden saltar entre paginas.
- El filtro se aplica en cliente y el archivo inicial no es un contrato SSR paginado.

Healing Minds conserva featured + grid, pero usa paginas SSR reales (`?page=N`) con anchors accesibles, orden total `publishedAt DESC, createdAt DESC, id DESC`, un unico featured efectivo separado una sola vez y filtros independientes por idioma. La API y el sitemap siguen exponiendo todos los publicados; la paginacion solo controla cuantos se componen en cada pagina visible.

### Los 3 puntos donde CodeX NO debe improvisar
- **Render síncrono desde `window.__SSR_BLOG_POST__`** (`BlogPostPage.tsx` + `ssr-meta.ts`): si lo cambia por un fetch async, vuelve el Soft 404.
- **Allowlist de `sanitize-html`** (`sanitizeContentHtml`): copiar el mismo set de tags/atributos para no romper el HTML del artículo ni abrir XSS.
- **Mismo shape de payload** entre `GET /api/blog/posts/:slug` y el `inlineData` del SSR: si divergen, la hidratación falla en silencio.
