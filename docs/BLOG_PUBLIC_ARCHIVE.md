# Archivo publico bilingue del blog

## Que ve el publico

- `/blog` consulta solo publicaciones `en`; `/es/blog` consulta solo publicaciones `es`.
- La primera pagina muestra un featured efectivo y hasta ocho tarjetas. Si existe un post marcado `isFeatured`, gana el mas reciente; si no, el articulo publicado mas reciente ocupa esa posicion.
- Las paginas posteriores muestran hasta nueve tarjetas y nunca repiten el featured.
- El orden estable es fecha de publicacion, fecha de creacion e id, siempre descendente.
- Los filtros de categoria reinician en pagina 1 y conservan URLs rastreables como `?category=anxiety-care&page=2`.
- Con 0 articulos se muestra el estado vacio; con 1 solo el featured; con 3 o 4 el featured y el resto del grid; con 10 o mas aparecen enlaces de paginacion accesibles.

Cada pagina tiene HTML SSR, canonical propio y enlaces anterior/siguiente y numerados. Los articulos siguen incluidos individualmente en sitemap y en la API publica, aunque no esten en la primera pagina del archivo.

## Que ve Jordan en el CMS

El contador general del CMS suma EN y ES. No representa cuantos articulos deberian aparecer en un archivo concreto. Por ejemplo, tres publicaciones EN y una ES se ven como cuatro publicadas en el panel, pero `/blog` contiene tres y `/es/blog` contiene una.

El filtro de idioma del CMS es la comparacion correcta con cada archivo publico. Draft, pending_review y rejected nunca cuentan como publicaciones publicas y no aparecen en archivo, API publica, sitemap ni rutas de articulo.

## Diferencias deliberadas frente a XL Homes

Se adapta su composicion featured + grid y el crecimiento por bloques. Se sustituye Load More cliente por paginacion SSR porque preserva mejor descubrimiento SEO, historial y navegacion, filtros compartibles, accesibilidad y un orden sin duplicados.
