# Evidencia — paridad de imágenes bilingües y metadata

Fecha: 2026-08-17

## Diagnóstico corroborado

- El run de traducción copiaba `featuredImage` en el instante de crear el
  sibling. Como la imagen curada seguía seleccionada entonces, una selección AI
  posterior en inglés no llegaba al borrador español.
- El admin no ofrecía ninguna acción para traer hero/inline ya aprobadas desde
  el post hermano.
- El proveedor de traducción aceptaba y normalizaba `metaTitle` a 70 caracteres,
  pero `adminBlogPostUpdateSchema`, el formulario y el gate SEO persistente
  permiten un máximo de 60. Un valor de 61–70 producía el 400 observado.

## Contrato implementado

- Acción explícita `Reuse approved images from English/Spanish`, solo en draft.
- Las imágenes AI se copian byte a byte desde el Blob fuente a claves propias
  del post destino; no hay una nueva llamada a GPT Image ni un objeto borrable
  compartido entre idiomas.
- Hero, orden inline, anchors del idioma destino, alt y caption quedan
  seleccionados en una transacción. Un cambio concurrente devuelve 409 sin
  aplicar un estado parcial.
- Copias físicas no registradas se eliminan o entran en
  `blog_image_cleanup_queue` para reintento.
- Traducciones nuevas y borradores antiguos abiertos en el editor respetan 60
  caracteres de meta title y 160 de meta description antes del PUT estricto.

## Evidencia exacta

- `npm run check`: PASS.
- `npm test`: 134/134 PASS.
- `npm run db:verify`: PASS; 5 migraciones, 112 statements, 20 tablas, 23 FKs,
  sibling único y publicación independiente.
- `npm run blog:image-check`: PASS para configuración, variedad, PHI,
  sanitización y render.
- `npm run build`: PASS; 87 páginas estáticas, rutas dinámicas admin/blog y
  presupuestos 669.5/750 KiB y 778.4/850 KiB.
- Playwright focalizado sobre build final: 2 PASS (Desktop Chrome y Pixel 7), 2
  skips deliberados por perfil cruzado. Valida abrir sibling ES, copiar hero e
  inline EN, reanclar heading ES, normalizar metaTitle legacy, guardar sin 400,
  y cero errores de página/consola/API.
- Playwright completo: 78 PASS, 8 skips deliberados por perfil, 0 fallos.
- `git diff --check`: PASS antes del gate remoto.

No se leyó ni imprimió ningún secreto. No se modificó Vercel, Neon, Production
ni el dominio.
