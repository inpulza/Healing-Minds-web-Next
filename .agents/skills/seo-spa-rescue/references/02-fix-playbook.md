# Referencia 02 — Fix Playbook (Fase 3)

El arreglo técnico completo. Hace que el servidor entregue metadata y contenido por
ruta **antes** de que React hidrate. Validado en producción con Veritas Medical
Group (bilingüe ES/EN, ~55 URLs).

> Reemplaza los placeholders en MAYÚSCULAS (`EXAMPLE.com`, `CANONICAL_HOST`, etc.)
> por los valores reales del cliente, detectados en la Fase 1.

## Stack objetivo

- **Vite + React (TypeScript)** frontend, `react-helmet-async` para meta.
- **Wouter o React Router** para routing cliente.
- **Express** (`server/index.ts`), normalmente con `setupVite`/`serveStatic`.
- Desplegado en **Replit Deployments** (`Server: Google Frontend` + `Express`).

Si el stack es otro, ver **§Otros stacks** al final.

## Arquitectura del fix

```
Request                          Middlewares (en este orden)              Response
GET /es/services/foo  ──►  ① canonical-host  ──►  ② language-redirect  ──►  ③ SEO-inject  ──►  ④ static/Vite
                            (www→apex, :443)      (/es/ /en/, legacy)       (buffer+rewrite)    (index.html)
```

Estáticos (`.css .js .webp .xml`) y `/api/*` saltan todos los middlewares con un
`next()` temprano (`req.path.startsWith('/api')` o `req.path.includes('.')`).

## Mapa de archivos

```
server/
  index.ts            # 3 middlewares + reescritura de HTML bufferizada
  seo/
    route-meta.ts     # registro ROUTE_META + builders de JSON-LD por ruta
    render-head.ts    # injectSeoHead(html, path, lang)
client/
  index.html          # defaults estáticos + IIFE de limpieza
  src/App.tsx         # <Router base={langBase}>  (solo si bilingüe)
public/
  sitemap.xml
  robots.txt
scripts/
  generate-sitemap.mjs
```

---

## FASE 0 — Host canónico (un solo salto 301)

**Problema:** `www` y apex ambos sirven 200 → contenido duplicado. Cadenas de 2+
saltos → "Page with redirect" / "Redirect error". Replit a veces inyecta `:443` en
el host.

Primer middleware en `server/index.ts`, **antes de todo lo demás**. Este ejemplo
canonicaliza hacia el **apex** (sin www); invierte la lógica si el canónico es www.

```ts
const CANONICAL_HOST = "EXAMPLE.com"; // apex, sin www (o "www.EXAMPLE.com")

app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();

  const fwdHost = (req.headers["x-forwarded-host"] as string | undefined)?.split(",")[0]?.trim();
  // .split(":")[0] elimina el puerto — corrige el bug :443 de Replit/Cloud Run
  const rawHost = (fwdHost || req.headers.host || "").split(":")[0].toLowerCase();
  const proto = (req.headers["x-forwarded-proto"] as string | undefined)?.split(",")[0]?.trim()
    || req.protocol;

  // Deja en paz los hosts de desarrollo (preview de Replit, localhost)
  if (rawHost === "" || rawHost === "localhost"
      || rawHost.endsWith(".replit.dev") || rawHost.endsWith(".repl.co")) {
    return next();
  }

  const isWww  = rawHost === `www.${CANONICAL_HOST}` || rawHost.endsWith(`.www.${CANONICAL_HOST}`);
  const isHttp = proto === "http" && (rawHost === CANONICAL_HOST || isWww);

  if (isWww || isHttp) {
    res.setHeader("Cache-Control", "public, max-age=31536000");
    return res.redirect(301, `https://${CANONICAL_HOST}${req.originalUrl}`);
  }
  next();
});
```

**Detalles que no se cambian:** 301 (no 302) · preservar `req.originalUrl` (path +
query) · leer `x-forwarded-host` primero · `.split(":")[0]` para quitar el puerto ·
whitelistear hosts de dev.

Verificar:
```bash
curl -sI -H "x-forwarded-host: www.EXAMPLE.com" -H "x-forwarded-proto: https" http://localhost:5000/about
# → 301 ; Location: https://EXAMPLE.com/about   (sin :443)
```

---

## FASE 1 — Inyección SSR de meta por ruta

El corazón del fix. Cada respuesta HTML se bufferiza, se reescribe el `<head>` con
tags específicos de la ruta, y se vuelca.

### 1a. `server/seo/route-meta.ts` — registro + helpers

```ts
export type Lang = "es" | "en";
export const CANONICAL_HOST = "EXAMPLE.com";

type Bilingual = { en: string; es: string };
type JsonLd = Record<string, unknown>;

export type RouteMeta = {
  title: Bilingual;
  description: Bilingual;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  jsonLd?: (lang: Lang, canonicalUrl: string) => JsonLd | JsonLd[] | null;
};

const FALLBACK_META: RouteMeta = { /* meta del home */ };

export const ROUTE_META: Record<string, RouteMeta> = {
  "/": { title: { en: "...", es: "..." }, description: { en: "...", es: "..." }, jsonLd: buildHomeSchema },
  "/about": { title: { ... }, description: { ... } },
  "/services/anxiety-treatment": serviceMeta(SERVICE.anxiety),
  // ...una entrada por CADA ruta real. Lista las rutas del sitemap / App.tsx.
};

export function stripLangPrefix(path: string): { lang: Lang | null; rest: string } {
  if (path === "/es" || path === "/es/") return { lang: "es", rest: "/" };
  if (path === "/en" || path === "/en/") return { lang: "en", rest: "/" };
  if (path.startsWith("/es/")) return { lang: "es", rest: path.slice(3) };
  if (path.startsWith("/en/")) return { lang: "en", rest: path.slice(3) };
  return { lang: null, rest: path };
}

function normalize(p: string): string {
  return p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
}

export function metaForPath(path: string): RouteMeta {
  const { rest } = stripLangPrefix(path);
  return ROUTE_META[normalize(rest)] ?? FALLBACK_META;
}

export function hasRouteMeta(path: string): boolean {
  const { rest } = stripLangPrefix(path);
  return normalize(rest) in ROUTE_META;
}

// True si la URL parece navegación in-app pero el slug no existe → URL fantasma.
export function isPhantomPath(path: string): boolean {
  const { lang, rest } = stripLangPrefix(path);
  if (lang === null) return false; // rutas sin prefijo: las maneja el redirect
  if (rest === "/") return false;  // /es/ y /en/ son reales (homes de idioma)
  return !(normalize(rest) in ROUTE_META);
}
```

> **Sitio NO bilingüe:** elimina `stripLangPrefix` (que devuelva siempre
> `{lang:null, rest:path}`), quita los prefijos `/es/ /en/`, y `isPhantomPath` pasa
> a ser simplemente `!(normalize(path) in ROUTE_META)` para todo `path !== "/"`.

### 1b. `server/seo/render-head.ts` — constructor del `<head>`

```ts
import { CANONICAL_HOST, isPhantomPath, metaForPath, stripLangPrefix, type Lang } from "./route-meta";

const escapeAttr = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escapeJsonLd = (s: string) =>
  s.replace(/<\/script/gi, "<\\/script").replace(/<!--/g, "<\\!--");

function buildLangUrl(lang: Lang, rest: string): string {
  const n = rest === "/" ? "/" : rest.replace(/\/$/, "");
  return n === "/" ? `https://${CANONICAL_HOST}/${lang}/` : `https://${CANONICAL_HOST}/${lang}${n}`;
}

export function buildHeadTags(path: string, lang: Lang = "es") {
  const m = metaForPath(path);
  const { rest } = stripLangPrefix(path);
  const canonical = buildLangUrl(lang, rest);
  const title = m.title[lang] ?? m.title.es;
  const description = m.description[lang] ?? m.description.es;
  const ogImage = m.ogImage ?? `https://${CANONICAL_HOST}/og-image.jpg`;

  const lines: string[] = [
    `<link rel="canonical" href="${escapeAttr(canonical)}" data-server-rendered />`,
    `<meta property="og:url" content="${escapeAttr(canonical)}" data-server-rendered />`,
    // hreflang recíproco: cada página declara AMBOS hermanos + x-default
    `<link rel="alternate" hreflang="es" href="${escapeAttr(buildLangUrl("es", rest))}" data-server-rendered />`,
    `<link rel="alternate" hreflang="en" href="${escapeAttr(buildLangUrl("en", rest))}" data-server-rendered />`,
    `<link rel="alternate" hreflang="x-default" href="${escapeAttr(buildLangUrl("es", rest))}" data-server-rendered />`,
    `<meta property="og:image" content="${escapeAttr(ogImage)}" data-server-rendered />`,
    `<meta property="og:locale" content="${lang === "en" ? "en_US" : "es_US"}" data-server-rendered />`,
    `<meta name="twitter:card" content="summary_large_image" data-server-rendered />`,
    `<meta name="twitter:title" content="${escapeAttr(title)}" data-server-rendered />`,
    `<meta name="twitter:description" content="${escapeAttr(description)}" data-server-rendered />`,
    `<meta name="twitter:image" content="${escapeAttr(ogImage)}" data-server-rendered />`,
  ];

  // noindex para rutas opt-out O URLs fantasma
  if (m.noindex || isPhantomPath(path)) {
    lines.push(`<meta name="robots" content="noindex,nofollow" data-server-rendered />`);
  }

  // JSON-LD por ruta
  if (m.jsonLd) {
    const built = m.jsonLd(lang, canonical);
    if (built) for (const block of Array.isArray(built) ? built : [built]) {
      lines.push(`<script type="application/ld+json" data-server-rendered>${escapeJsonLd(JSON.stringify(block))}</script>`);
    }
  }

  return { title: escapeAttr(title), description: escapeAttr(description),
           ogType: m.ogType ?? "website", tagsBlock: lines.join("\n    ") };
}

export function injectSeoHead(html: string, path: string, lang: Lang = "es"): string {
  if (!html.includes("</head>")) return html;
  const head = buildHeadTags(path, lang);
  let out = html;

  // 1. <html lang="...">
  out = out.replace(/<html\b([^>]*)\blang="[^"]*"([^>]*)>/i, `<html$1lang="${lang}"$2>`);
  if (!/<html\b[^>]*\blang="/i.test(out)) out = out.replace(/<html\b([^>]*)>/i, `<html$1 lang="${lang}">`);

  // 2. Reemplazar defaults
  out = out.replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, `<title data-server-rendered>${head.title}</title>`);
  out = out.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${head.description}" data-server-rendered />`);
  out = out.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${head.title}" data-server-rendered />`);
  out = out.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${head.description}" data-server-rendered />`);

  // 3. Quitar defaults estáticos para no duplicar tags
  out = out.replace(/<link\s+rel="canonical"[^>]*data-default-canonical[^>]*>\s*/gi, "");
  out = out.replace(/<meta\b[^>]*\bdata-default-(og-url|seo)\b[^>]*>\s*/gi, "");

  // 4. Inyectar el bloque por ruta antes de </head>
  return out.replace("</head>", `    ${head.tagsBlock}\n  </head>`);
}
```

### 1c. `server/index.ts` — middleware de reescritura bufferizada

El truco crítico: sobreescribir `res.write`/`res.end` **antes** de `next()`, para
que `express.static`/`sendFile` escriban en nuestro buffer y no directo al socket.

```ts
import { injectSeoHead } from "./seo/render-head";
import { hasRouteMeta, isPhantomPath, stripLangPrefix, type Lang } from "./seo/route-meta";

app.use((req, res, next) => {
  if (req.method !== "GET") return next();
  if (req.path.startsWith("/api")) return next();
  if (req.path.includes(".")) return next(); // .js .css .webp .xml etc.

  const seoPath = req.path || "/";
  const { lang: urlLang } = stripLangPrefix(seoPath);
  const seoLang: Lang = urlLang ?? pickLang(req);

  const isHtml = () => ((res.getHeader("Content-Type") as string | undefined) || "").includes("text/html");
  const origWrite = res.write.bind(res);
  const origEnd = res.end.bind(res);
  const buffered: Buffer[] = [];
  let buffering: boolean | null = null;
  const shouldBuffer = () => (buffering ??= isHtml());

  res.write = function patched(chunk: any, encOrCb?: any, cb?: any): boolean {
    const enc = typeof encOrCb === "string" ? encOrCb : undefined;
    const callback = typeof encOrCb === "function" ? encOrCb : cb;
    if (shouldBuffer() && chunk != null) {
      buffered.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, enc as BufferEncoding));
      callback?.(); return true;
    }
    return origWrite(chunk, enc, callback);
  } as typeof res.write;

  res.end = function patched(chunk?: any, encOrCb?: any, cb?: any): typeof res {
    const c = typeof chunk === "function" ? undefined : chunk;
    const enc = typeof encOrCb === "string" ? encOrCb : undefined;
    const callback = typeof chunk === "function" ? chunk : typeof encOrCb === "function" ? encOrCb : cb;
    if (shouldBuffer()) {
      if (c != null) buffered.push(Buffer.isBuffer(c) ? c : Buffer.from(c, enc));
      const out = Buffer.from(injectSeoHead(Buffer.concat(buffered).toString("utf8"), seoPath, seoLang), "utf8");
      res.removeHeader("Content-Length"); // el body cambió de tamaño
      // URL fantasma → 404 (el status sigue mutable: nunca dejamos que sendFile
      // llame _implicitHeader, porque nuestro write bufferizó sin llamar origWrite)
      if (isPhantomPath(seoPath) && res.statusCode === 200) res.status(404);
      buffered.length = 0;
      return origEnd(out, callback) as typeof res;
    }
    return origEnd(c, enc, callback) as typeof res;
  } as typeof res.end;

  next();
});
```

**Por qué el status 404 funciona tras `sendFile`:** `sendFile` escribe vía
`res.write`, y `res.write` es lo único que llama al `_implicitHeader()` de Node.
Nuestro `res.write` parcheado bufferiza y devuelve `true` sin invocar `origWrite`,
así que los headers nunca se vuelcan. Cuando corre `res.end`, el status sigue
mutable.

---

## URLs fantasma → 404 + noindex

Síntoma: `curl -sI https://HOST/ruta-typo-que-no-existe` → `200 OK` con el title del
home. Google indexa la URL-typo como duplicado del home.

Ya cubierto arriba: `isPhantomPath` en `route-meta.ts`, el `noindex` en
`render-head.ts`, y el `res.status(404)` en `index.ts`. Si el sitio también usa
`res.send` para HTML, parchea esa vía igual, con guarda `!res.headersSent`.

Verificar:
```bash
for u in /es/services/typo-slug /en/fake-page /zzz-99; do
  echo -n "$u "; curl -s -o /dev/null -w "[%{http_code}] " "http://localhost:5000$u"
  curl -s "http://localhost:5000$u" | grep -oE 'name="robots" content="[^"]+'; echo
done
# → [404] noindex,nofollow
```

---

## Healthcare JSON-LD (clínicas, "aceptamos seguro X")

Para páginas "aceptamos el seguro X", usar `MedicalBusiness` con `paymentAccepted`
— **no** `Service`, y **no** el `<title>` SEO como nombre de aseguradora.

```ts
function buildInsuranceSchema(lang: Lang, url: string, description: Bilingual, carriers: string[]) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "NOMBRE DE LA CLÍNICA",
    description: description[lang],
    url,
    telephone: "+1-XXX-XXX-XXXX",
    address: { "@type": "PostalAddress", streetAddress: "...", addressLocality: "...",
               addressRegion: "FL", postalCode: "...", addressCountry: "US" },
    areaServed: [{ "@type": "City", name: "..." }],
  };
  if (carriers.length) schema.paymentAccepted = carriers; // ["Aetna"], NO el título
  return schema;
}
```

Guarda los `carriers` como campo separado del `title` SEO. No uses
`HealthInsurancePlan` como `@type` de la página (ese schema describe el plan, no el
hecho de que la clínica lo acepte).

Para el home de una clínica: schemas `Organization` + `MedicalClinic`/`Physician`.

---

## FASE 2 — Prefijos de idioma `/es/*` `/en/*` (solo sitios bilingües)

Si el sitio no es bilingüe, **salta esta fase entera.**

### 2a. Middleware de redirect de idioma (después de canonical-host, antes de SEO)

```ts
app.use((req, res, next) => {
  if (req.method !== "GET") return next();
  if (req.path.startsWith("/api") || req.path.includes(".")) return next();
  if (req.path.startsWith("/es") || req.path.startsWith("/en")) return next();

  const qs = req.url.includes("?") ? req.url.substring(req.url.indexOf("?")) : "";
  if (req.path === "/") return res.redirect(302, `/${pickLang(req)}/${qs}`); // 302: ambos homes se indexan
  if (hasRouteMeta(req.path)) return res.redirect(301, `/es${req.path}${qs}`); // legacy → /es/
  next();
});

function pickLang(req: Request): Lang {
  const al = (req.headers["accept-language"] as string | undefined) || "";
  if (/\bes\b/i.test(al) && !/\ben\b/i.test(al)) return "es";
  if (/\ben\b/i.test(al) && !/\bes\b/i.test(al)) return "en";
  return "es"; // default audiencia primaria
}
```

### 2b. Wouter `<Router base>` en `client/src/App.tsx`

```tsx
function App() {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
  const base = pathname.startsWith("/en") ? "/en" : "/es";
  return (
    <Router base={base}>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      {/* rutas SIN prefijo: Wouter añade/quita el base. <Link href="/about">, nunca "/es/about" */}
    </Router>
  );
}
```

### 2c. Cambio de idioma = navegación de página completa

```tsx
const setLanguage = (next: Lang) => {
  const rest = window.location.pathname.replace(/^\/(es|en)/, "") || "/";
  window.location.assign(`/${next}${rest}${window.location.search}`); // assign, no router nav
};
```
`window.location.assign` (no navegación de Wouter) para que el servidor re-ejecute
la inyección SEO en el idioma destino.

---

## FASE 3 — Sitemap

Auto-generar `public/sitemap.xml` desde `ROUTE_META` antes de cada publish, con
`<lastmod>` de hoy. Script listo en `../assets/generate-sitemap.mjs` — cópialo a
`scripts/`, ajusta `HOST` y la fuente de rutas, y añade el npm script:

```json
"scripts": { "sitemap:generate": "node scripts/generate-sitemap.mjs" }
```

Correr `npm run sitemap:generate` antes de cada deploy.

---

## `client/index.html` — defaults + IIFE de limpieza

Marca los defaults estáticos con `data-default-*` y añade el IIFE que borra los
tags server-rendered cuando `react-helmet-async` monta los suyos (deja exactamente
uno de cada en el DOM):

```html
<title>Marca — Título por defecto</title>
<meta name="description" content="Descripción del home." />
<link rel="canonical" href="https://EXAMPLE.com/" data-default-canonical />
<meta property="og:url" content="https://EXAMPLE.com/" data-default-og-url />
<meta property="og:image" content="/og-image.jpg" data-default-seo />
<script>
  (function () {
    var done = false;
    function clean() {
      if (done) return;
      var helmet = document.head.querySelector('link[rel="canonical"]:not([data-default-canonical])');
      if (helmet) {
        done = true;
        document.head.querySelectorAll('[data-server-rendered],[data-default-canonical],[data-default-og-url],[data-default-seo]')
          .forEach(function (n) { n.parentNode && n.parentNode.removeChild(n); });
      }
    }
    var mo = new MutationObserver(clean);
    mo.observe(document.head, { childList: true, subtree: false });
    setTimeout(function () { mo.disconnect(); clean(); }, 10000);
  })();
</script>
```

---

## Trailing slash + redirects de URLs legacy (opcional)

Si `/foo` y `/foo/` ambos dan 200:
```ts
app.use((req, res, next) => {
  if (req.method === "GET" && req.path.length > 1 && req.path.endsWith("/")) {
    const qs = req.url.includes("?") ? req.url.substring(req.url.indexOf("?")) : "";
    return res.redirect(301, req.path.slice(0, -1) + qs);
  }
  next();
});
```

Si el sitio migró de URLs planas a jerárquicas, un `Map` de redirects 301
`viejo → nuevo`, registrado antes del catch-all.

---

## Otros stacks (no Vite+React+Express)

| Stack | Adaptación |
|---|---|
| **Next.js** | Ya hace SSR/SSG — el problema raíz casi nunca aplica. Canonical host vía `next.config.js redirects()`. Meta por ruta vía `generateMetadata()`. 404 real con `not-found.tsx`. |
| **Astro** | SSG por defecto, ya indexable. Redirects vía middleware o `astro.config`. Meta en el frontmatter de cada página. |
| **Remix** | SSR nativo. Meta vía `meta` export por ruta. |
| **Vue SPA** | Mismo problema que React. El middleware Express de Fase 0/1 es idéntico; `ROUTE_META` es agnóstico del framework de cliente. |
| **WordPress** | Otro mundo — plugins de SEO (Yoast/RankMath). Este playbook no aplica. |

El middleware de Express (Fases 0 y 1) es **agnóstico del framework de cliente** —
funciona con cualquier SPA servida por Express, no solo React.

---

## Verificación local (antes de publicar)

```bash
# Canonical host
curl -sI -H "x-forwarded-host: www.EXAMPLE.com" -H "x-forwarded-proto: https" http://localhost:5000/about
# → 301 → https://EXAMPLE.com/about  (sin :443)

# Meta por ruta — cada URL su propio title
for u in /es/about /en/about /es/services/anxiety-treatment; do
  curl -s "http://localhost:5000$u" | grep -oE '<title[^>]*>[^<]+'
done

# URL fantasma
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/es/typo-slug   # → 404

# canonical exactamente 1 en el HTML crudo
curl -s http://localhost:5000/es/about | grep -c '<link rel="canonical"'      # → 1
```

**Si algo falla, NO publicar.** Revisar el orden de middlewares:
canonical-host → language-redirect → SEO-inject → static.

## Errores comunes

- Correr el SEO-inject antes del canonical-host → desperdicias rewrites en
  requests que se 301ean igual.
- Olvidar `req.path.includes('.')` → intenta reescribir `<head>` dentro de `.css`.
- Olvidar `res.removeHeader("Content-Length")` → `ERR_CONTENT_LENGTH_MISMATCH`.
- `<Link href="/es/about">` dentro de `<Router base="/es">` → da `/es/es/about`.
- 301 (no 302) de `/` a `/es/` → usa 302 para que ambos homes se indexen.
- hreflang auto-referencial → cada página declara AMBOS hermanos + x-default.
- `paymentAccepted: [title]` → usa un campo `carriers` limpio aparte.
- Olvidar quitar el `:443` del host → Google ve una URL distinta.
