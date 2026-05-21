# Referencia 01 — Auditoría (Fase 1)

Cómo sondear cualquier sitio en vivo, clasificar los síntomas y producir el
diagnóstico. Funciona para CUALQUIER web; no asume stack.

---

## 1. Batería de sondeos (producción)

Reemplaza `EXAMPLE.com` por el dominio del cliente. Usa el host real (con o sin
`www` según resuelva). Hay variante Bash y PowerShell — usa la que tengas.

### 1a. Bash / curl

```bash
HOST="www.EXAMPLE.com"
UA="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"

# Host: www vs apex, http vs https — solo UNO debe dar 200
curl -sI "https://EXAMPLE.com/"        | grep -iE 'HTTP|location'
curl -sI "https://www.EXAMPLE.com/"    | grep -iE 'HTTP|location'
curl -sI "http://$HOST/"               | grep -iE 'HTTP|location'   # ojo al :443

# Stack / hosting
curl -sI "https://$HOST/" | grep -iE 'server|x-powered-by|via'

# Renderizado SPA: title + tamaño de cuerpo de varias rutas + una URL FALSA
for u in / /about /services/SOMETHING /contact /esta-url-no-existe-12345; do
  html=$(curl -s --max-time 25 -A "$UA" "https://$HOST$u")
  title=$(echo "$html" | grep -oiE '<title>[^<]*</title>' | head -1)
  body=$(echo "$html" | sed -e 's/<script[^>]*>.*<\/script>//g' -e 's/<[^>]*>/ /g' | tr -s ' ')
  echo "$u  | ${#body} chars body | $title"
done

# Canonical + og:url + H1 + hreflang en el HTML INICIAL (lo que ve Googlebot)
html=$(curl -s -A "$UA" "https://$HOST/about")
echo "$html" | grep -oiE '<link[^>]*rel="canonical"[^>]*>' | head -1
echo "$html" | grep -oiE '<meta[^>]*property="og:url"[^>]*>' | head -1
echo "$html" | grep -ociE '<h1'
echo "$html" | grep -ociE 'hreflang'
echo "$html" | grep -oiE '<meta[^>]*name="robots"[^>]*>' | head -1

# Soft 404: URL inventada debe dar 404, no 200
curl -sI -A "$UA" "https://$HOST/zzz-fake-99" | head -1

# Trailing slash: /about y /about/ no deben dar ambos 200
curl -sI "https://$HOST/about/" | grep -iE 'HTTP|location'

# Sitemap + robots
curl -sI "https://$HOST/sitemap.xml" | head -1
curl -s  "https://$HOST/sitemap.xml" | grep -c '<loc>'
curl -s  "https://$HOST/sitemap.xml" | grep -oE '<lastmod>[^<]+' | sort -u | tail -3
curl -s  "https://$HOST/robots.txt"
```

### 1b. PowerShell (Windows)

```powershell
$site = "https://www.EXAMPLE.com"
$ua = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"

foreach ($p in @("/", "/about", "/services/SOMETHING", "/no-existe-12345")) {
    $r = Invoke-WebRequest -Uri "$site$p" -UseBasicParsing -UserAgent $ua
    $title = [regex]::Match($r.Content, '<title>([^<]+)</title>').Groups[1].Value
    $body  = ($r.Content -replace '<script.*?</script>','' -replace '<[^>]+>',' ' -replace '\s+',' ')
    Write-Host "$p | $($body.Length) chars | $title"
}
# SPA: <div id="root"> o <div id="app"> + body inicial pequeño
if ($r.Content -match '<div id="(root|app)"') { Write-Host "SPA detectada" }
```

---

## 2. Qué buscar — banderas rojas

| Bandera | Significado | Severidad |
|---|---|---|
| Mismo `<title>` y mismo tamaño de cuerpo en 3+ rutas distintas | SPA sin SSR — Google dedupea | **P0** |
| Cuerpo inicial < ~1.500 chars + `<div id="root">` | Crawler no-JS no ve contenido | **P0** |
| URL inventada devuelve `200 OK` | Soft 404 — el servidor miente | **P0** |
| `www` y apex ambos `200` con mismo etag | Contenido duplicado por host | **P0** |
| Sin `<link rel="canonical">` en el HTML inicial | Crawler no ve canonical | **P0** |
| `og:url` fijo / distinto del canonical | Señales en conflicto | P1 |
| Redirect `http→https` con `:443` en el Location | URL "distinta" para Google | P1 |
| `/ruta` y `/ruta/` ambos `200` | Pares de duplicados | P1 |
| Web bilingüe sin `hreflang` | Google no conoce variantes | P0 |
| `<html lang>` inconsistente con la UI visible | Idioma equivocado indexado | P0 |
| Sin `<h1>` en el HTML inicial | Falta señal de jerarquía | P1 |
| Sitemap ausente o `<lastmod>` > 60 días | Recrawl lento | P1 |
| robots.txt bloquea contenido real | Páginas no aparecen | P0 |

**2 o más P0 = HALLAZGO CRÍTICO.** Reportar que debe arreglarse ANTES de cualquier
inversión en contenido, keyword research o rediseño.

---

## 3. Mapeo: categoría de Search Console → causa raíz

| GSC dice | Causa raíz más probable | Fase del fix |
|---|---|---|
| Crawled - currently not indexed | Contenido fino/duplicado: HTML idéntico por ruta | Fase 1 (SSR meta + contenido) |
| Discovered - currently not indexed | Crawl budget + sitemap viejo | Fase 3 (sitemap fresco) |
| Duplicate without user-selected canonical | Sin canonical en HTML inicial | Fase 0/1 |
| Duplicate, Google chose different canonical | Canonical existe pero las páginas son idénticas, o www+apex vivos | Fase 0/1 |
| Page with redirect | Enlace/sitemap apunta a una URL que 301ea; o variante www/http vieja | Fase 0 + sitemap |
| Redirect error | Loop o cadena > 5 saltos | Inspeccionar cadena (`curl -ILk`) |
| Soft 404 | SPA devuelve 200 para rutas inexistentes | URLs fantasma |
| Excluded by noindex | Etiqueta `noindex` (intencional o no) | Verificar cuáles |
| Blocked by robots.txt | Reglas de robots + URLs técnicas/fantasma | Exportar ejemplos; suele ser benigno |

**Sobre "Blocked by robots.txt" con números altos (cientos/miles):** casi nunca es
el problema principal. Significa "Google quiso rastrear esto y robots.txt lo
prohíbe". Si son URLs técnicas (`/api/`, assets, parámetros) está BIEN. Acción:
exportar ejemplos de GSC y verificar que no haya páginas reales atrapadas.

---

## 4. Detección de stack

| Señal | Stack |
|---|---|
| `Server: Google Frontend` + `X-Powered-By: Express` | Replit Deployments (Express SPA) — **el caso típico de la agencia** |
| Rutas `/_next/`, `X-Powered-By: Next.js` | Next.js |
| `<div id="root">` + bundle `assets/index-*.js` | Vite + React |
| `_astro/` en assets | Astro |
| `X-Powered-By: PHP`, `wp-content/` | WordPress |
| HTML completo con contenido en la primera carga | SSR o estático — el fix probablemente NO aplica |

Si el `Server:` no es concluyente, NO asumas: pregunta al dev team del cliente.

---

## 5. Trampas conocidas

| Trampa | Solución |
|---|---|
| Scraper (Tavily, Firecrawl) "ve" contenido | Ejecutan JS. Usa `curl` + UA Googlebot para el HTML crudo |
| Lighthouse score alto = todo OK | Lighthouse ejecuta JS antes de medir. Valida también con curl |
| Schema markup OK en el home | Las internas pueden tener el MISMO schema. Verifica varias rutas |
| Canonical presente = perfecto | Si lo inyecta react-helmet client-side, Google puede no verlo. Verifica el HTML inicial |
| Sitemap completo = indexable | Si todas las URLs devuelven el mismo HTML, Google las dedupea igual |
| `Server:` header = hosting | "Google Frontend" puede ser Replit, Cloud Run, Firebase. Confirma |

---

## 6. Entregable: diagnóstico

Estructura del diagnóstico en markdown (guardar en
`[N. Cliente]/08. Web/_audits/YYYY-MM-DD_auditoria-indexacion.md`):

```markdown
# Auditoría de indexación — [Cliente]
**Fecha · Sitio · Stack detectado · Auditado por: Inpulza**

## TL;DR
[2-3 párrafos: qué encontramos, severidad, ¿hay penalización? (casi siempre no),
recomendación principal]

## Hallazgos críticos (P0)
### [Título] — síntoma / evidencia (comando reproducible) / impacto / fix requerido

## Hallazgos secundarios (P1)

## Lo que el sitio SÍ hace bien (no tocar)

## Plan de acción priorizado (sprints)

## Validación post-fix (comandos reproducibles)

## Anexo: comandos de auditoría usados
```

---

## 7. Plantilla del PDF para el cliente (opcional)

Cuando el cliente necesita un entregable formal, generar un PDF profesional. Patrón
validado (Healing Minds Psychiatry, mayo 2026):

1. Escribir un HTML con CSS `@page` A4, portada con gradiente de marca, secciones
   con `page-break-before`, cajas de color para P0/P1/OK, tablas, bloques de
   evidencia tipo terminal.
2. Convertir con Chrome headless:
   ```bash
   chrome --headless --disable-gpu --no-pdf-header-footer \
     --print-to-pdf="OUT.pdf" --virtual-time-budget=12000 "file:///ABS/PATH.html"
   ```
3. **OneDrive da "Acceso denegado"** al escribir el PDF directo en su carpeta:
   genera en una carpeta temporal Windows (`C:/Users/.../AppData/Local/Temp/...`)
   con ruta `file:///C:/...` explícita, y luego copia el PDF al destino.
4. Verificar páginas con `pypdf`.

Secciones recomendadas del PDF: Resumen ejecutivo · ¿Penalización? (No) · Números
de GSC explicados · Causa raíz · Hallazgos P0 con evidencia · Hallazgos P1 · Lo que
está bien · Plan de acción · Cómo hablar con el dev team · Validación · Anexo.

Para los detalles de construcción del PDF, invocar el skill `pdf`.

---

## 8. Validación post-fix (Fase 4) — checklist GSC

- [ ] Re-correr la batería de sondeos contra producción. Title y tamaño de cuerpo
      distintos entre rutas; URL falsa → 404; redirect sin `:443`.
- [ ] GSC → Sitemaps → reenviar `/sitemap.xml`, esperar "Correcto".
- [ ] GSC → Páginas → *Validar corrección* en cada categoría de error (corre ~14
      días).
- [ ] GSC → Inspección de URL → probar 5–10 páginas prioritarias → *Solicitar
      indexación* (límite ~10/día).
- [ ] GSC → Seguridad y acciones manuales → confirmar "No se han detectado
      problemas".
- [ ] A los 7 días: "crawled - not indexed" empieza a bajar.
- [ ] A las 4 semanas: páginas indexadas se acercan al total del sitemap.

Tiempos: validación 1–3 días; reindexación completa 2–4 semanas; "discovered - not
indexed" es lo más lento.
