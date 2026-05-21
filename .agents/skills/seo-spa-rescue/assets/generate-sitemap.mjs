#!/usr/bin/env node
/**
 * generate-sitemap.mjs — regenera public/sitemap.xml con <lastmod> de hoy.
 *
 * Skill: seo-spa-rescue. Copiar a scripts/ del proyecto del cliente y ajustar
 * la config de abajo. Correr `node scripts/generate-sitemap.mjs` antes de cada
 * publish para que Google recrawlee más rápido.
 *
 * Deriva las rutas de la tabla <Route> en client/src/App.tsx. Si el proyecto
 * tiene un registro server/seo/route-meta.ts, usa la opción B (ver abajo).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ─── CONFIG — ajustar por cliente ────────────────────────────────────────────
const BASE_URL  = "https://EXAMPLE.com";   // host canónico, con o sin www
const BILINGUAL = false;                   // true → emite /es/<ruta> y /en/<ruta>
const ROUTES_FROM = "App.tsx";             // "App.tsx" | "route-meta"
// ─────────────────────────────────────────────────────────────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT   = path.resolve(__dirname, "..");
const ROBOTS = path.join(ROOT, "public/robots.txt");
const OUT    = path.join(ROOT, "public/sitemap.xml");
const today  = new Date().toISOString().slice(0, 10);

// ─── Opción A: rutas desde las entradas <Route path="..."> de App.tsx ────────
function routesFromAppTsx() {
  const src = fs.readFileSync(path.join(ROOT, "client/src/App.tsx"), "utf8");
  return [...new Set(
    [...src.matchAll(/<Route\s+path=["']([^"']+)["']/g)]
      .map((m) => m[1])
      .filter((p) => !p.includes(":") && !p.includes("*")), // sin params ni catch-all
  )];
}

// ─── Opción B: rutas desde las claves de ROUTE_META ──────────────────────────
function routesFromRouteMeta() {
  const src = fs.readFileSync(path.join(ROOT, "server/seo/route-meta.ts"), "utf8");
  const block = src.slice(src.indexOf("ROUTE_META"));
  return [...new Set([...block.matchAll(/["'](\/[^"']*)["']\s*:/g)].map((m) => m[1]))];
}

// ─── robots.txt: rutas Disallow para excluirlas del sitemap ──────────────────
function disallowedPaths() {
  if (!fs.existsSync(ROBOTS)) return [];
  return fs.readFileSync(ROBOTS, "utf8").split(/\r?\n/)
    .map((l) => /^Disallow:\s*(\S+)/i.exec(l.trim())?.[1])
    .filter((d) => d && d !== "/");
}

const routes = ROUTES_FROM === "route-meta" ? routesFromRouteMeta() : routesFromAppTsx();
const disallow = disallowedPaths();
const allowed = routes.filter((p) =>
  !disallow.some((d) => p === d || p.startsWith(d.replace(/\/?$/, "/"))));

function entriesFor(p) {
  const clean = p === "/" ? "/" : p.replace(/\/$/, "");
  if (!BILINGUAL) return [{ loc: `${BASE_URL}${clean}` }];
  return ["es", "en"].map((lang) => ({
    loc: `${BASE_URL}/${lang}${clean === "/" ? "/" : clean}`,
  }));
}

const urls = allowed.sort().flatMap(entriesFor);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${u.loc === BASE_URL + "/" ? "1.0" : "0.7"}</priority>
  </url>`).join("\n")}
</urlset>
`;

fs.writeFileSync(OUT, xml);
console.log(`sitemap.xml: ${urls.length} URLs (lastmod=${today})`);
