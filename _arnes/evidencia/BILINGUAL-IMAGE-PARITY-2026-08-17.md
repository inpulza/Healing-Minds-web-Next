# Evidencia — paridad de imágenes bilingües y metadata

Fecha: 2026-08-17

## Diagnóstico corroborado

- El run de traducción copiaba `featuredImage` en el instante de crear el
  sibling. Como la imagen curada seguía seleccionada entonces, una selección AI
  posterior en inglés no llegaba al borrador español.
- La corrección anterior exigía pulsar una acción manual para traer hero/inline
  ya aprobadas desde el post hermano. Eso no satisfacía la paridad automática
  pedida para EN→ES y ES→EN.
- El proveedor de traducción aceptaba y normalizaba `metaTitle` a 70 caracteres,
  pero `adminBlogPostUpdateSchema`, el formulario y el gate SEO persistente
  permiten un máximo de 60. Un valor de 61–70 producía el 400 observado.

## Contrato implementado

- Sincronización automática EN→ES y ES→EN al crear el sibling, seleccionar una
  variante completada, quitar una colocación inline o abrir una pareja antigua
  desalineada. El botón manual desaparece.
- Se propaga el set completo disponible: hero/inline seleccionados y también
  las variantes completadas. Las no elegidas conservan estado `candidate`, se
  ven en el editor hermano y siguen fuera del artículo hasta aprobación humana.
- Las imágenes AI se copian byte a byte desde el Blob fuente a claves propias
  del post destino; no hay una nueva llamada a GPT Image ni un objeto borrable
  compartido entre idiomas.
- Hero, orden inline, anchors del idioma destino, alt y caption seleccionados
  se aplican autoritativamente; las candidatas se registran sin promoverlas.
  Quitar un inline en el origen
  deselecciona ese slot en el sibling. Un cambio concurrente devuelve 409 sin
  aplicar un estado parcial.
- La escritura automática solo acepta un destino `draft`; un sibling en review
  o publicado permanece inmutable y conserva su revisión humana.
- Copias físicas no registradas se eliminan o entran en
  `blog_image_cleanup_queue` para reintento.
- Traducciones nuevas y borradores antiguos abiertos en el editor respetan 60
  caracteres de meta title y 160 de meta description antes del PUT estricto.

## Evidencia exacta

- `npm run check`: PASS.
- `npm test`: 135/135 PASS.
- `npm run db:verify`: PASS; 5 migraciones, 112 statements, 20 tablas, 23 FKs,
  sibling único y publicación independiente.
- `npm run blog:image-check`: PASS para configuración, variedad, PHI,
  sanitización y render.
- `npm run build`: PASS; 87 páginas estáticas, rutas dinámicas admin/blog y
  presupuestos 669.5/750 KiB y 778.4/850 KiB.
- Playwright focalizado sobre build final: 4 PASS (Desktop Chrome y Pixel 7), 4
  skips deliberados por perfil cruzado. Valida EN→ES y ES→EN sin botón, sin
  request de generación, con hero/inline visibles, headings reanclados,
  metadata legacy normalizada y cero errores de página/consola/API.
- Playwright completo: 80 PASS, 10 skips deliberados por perfil, 0 fallos.
- `git diff --check`: PASS antes del gate remoto.
- PR draft #28, Preview Vercel `READY` sobre el SHA exacto `40d4722` y E2E
  desplegado focalizado: 4 PASS/4 skips cruzados en Desktop Chrome y Pixel 7.
  Deployment Protection rechazó correctamente la corrida sin credencial; la
  repetición usó OIDC efímero sin leer, imprimir ni persistir el token.
- Code Review inicial: 0 hilos y 0 hallazgos accionables; solo comentario
  operativo de Vercel.

No se leyó ni imprimió ningún secreto. No se modificó Vercel, Neon, Production
ni el dominio.

## Precisión final del requisito

La comprobación visual posterior aclaró que el set hermano debe incluir también
las imágenes AI completadas que aún no fueron elegidas. El contrato y el E2E se
ampliaron: una candidata hero distinta aparece automáticamente en el editor del
otro idioma con estado `candidate`, junto al hero/inline seleccionados, sin
request a generación. El gate humano sigue intacto y las variantes `rejected`
no se propagan.
