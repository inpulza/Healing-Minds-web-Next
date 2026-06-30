# Sprint 3 - Admin editorial foundation

> Alcance cerrado para PR #4. El objetivo no es portar `AI Generate` todavia.
> Este sprint crea la superficie editorial manual donde luego viviran la
> generacion IA, research, imagenes, fixers y autopublish.

## Objetivo

Crear un panel de administracion basico para operar posts reales del blog:
listar, filtrar, crear, editar, revisar, publicar y correr el chequeo SEO manual.

En cristiano: despues de este sprint Healing Minds ya tiene un CMS minimo para el
blog. La maquinaria IA de XL Homes se porta despues, por capas.

## Incluye

- `/admin/login` y `/admin/blog`.
- API admin bajo `/api/admin/blog/*`.
- Lista de posts con filtros por estado, idioma y busqueda.
- Crear y editar posts manuales.
- Estados editoriales:
  - `draft`
  - `pending_review`
  - `published`
  - `rejected`
- Preview basico del contenido.
- Campos editoriales principales:
  - titulo
  - slug
  - idioma
  - `translationGroupId`
  - excerpt
  - contenido HTML
  - meta title
  - meta description
  - featured image URL
  - featured image alt
  - autor
  - categoria
  - tags
  - featured flag
- CRUD basico de categorias y tags.
- Stats por estado.
- Sanitizacion server-side del HTML del post.
- Publish gate antes de publicar.
- Manual SEO check para posts publicados.
- Hook SEO en background al publicar.
- Bloquear borrado directo de posts publicados.
- Proteger `/api/contact-messages` con admin auth.

## Fuera de alcance

- AI Generate.
- Research automatico.
- Semantic memory / anti-canibalizacion.
- Generacion de imagenes.
- Inline image generation.
- Job queue.
- SSE progress.
- Fixers complejos.
- Traduccion automatica.
- Autopublicacion desde IA.

## Autenticacion

Healing Minds usara la autenticacion nativa de Replit, igual que XL Homes.

El codigo queda preparado asi:

- modo normal: Replit Auth (`/api/login`, `req.isAuthenticated()` y `req.user`);
- allowlist obligatoria por email con `ADMIN_EMAILS` o `BLOG_ADMIN_EMAILS`;
- modo custom opcional solo si se configuran credenciales propias;
- modo abierto solo en no-produccion si se define explicitamente `BLOG_ADMIN_AUTH_MODE=off`.

La revision de Replit debe confirmar el comportamiento final en su entorno real.

## Publish gate minimo

Antes de pasar a `published`, el sistema debe validar:

- titulo presente;
- excerpt presente;
- contenido con longitud suficiente;
- meta title dentro de limite razonable;
- meta description dentro de limite razonable;
- autor presente;
- categoria presente;
- al menos un tag;
- featured image alt descriptivo;
- disclaimer medico/emergencia cuando aplique.

Si falla, el post no se publica y el API devuelve los checks.

## Reglas YMYL

- No prometer resultados clinicos.
- No publicar sin autor medico real.
- No inventar doctores, credenciales ni reviewers.
- El contenido puede ser draft, pero publicar exige revision humana.
- No `Review` ni `aggregateRating` artificial.

## Criterios de aceptacion

1. `npm run check` pasa.
2. `npm run build` pasa.
3. `/admin/blog` compila y carga como ruta SPA.
4. Admin API queda protegida por auth; `BLOG_ADMIN_AUTH_MODE=off` solo funciona fuera de produccion.
5. Crear draft no lo expone en API publica ni sitemap.
6. Publicar ejecuta publish gate.
7. Post publicado sigue apareciendo en `/api/blog/posts`, `/blog/:slug`, sitemap y SEO check.
8. Slug inexistente o post no publicado sigue devolviendo 404/noindex en publico.
9. Manual SEO check admin funciona para posts publicados.

## Siguiente sprint

Sprint 4 debe portar el framework de verificacion/fixers antes de traer IA:

- checks editoriales mas completos,
- links internos/externos,
- hero image readiness,
- translation pair readiness,
- sugerencias/fixers no destructivos.
