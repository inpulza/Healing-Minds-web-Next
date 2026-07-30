import { readFile, writeFile } from "node:fs/promises";

const evidencePath = process.env.SEO_AUDIT_OUTPUT || "_arnes/evidencia/seo-parity.json";
const manifestPath = "shared/seo-manifest.json";
const evidence = JSON.parse(await readFile(evidencePath, "utf8"));
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

if (evidence.summary?.source !== "https://www.healingmindsp.com" || evidence.results?.length !== 77) {
  throw new Error("SEO evidence must contain the 77 current production sitemap routes");
}

function assignOrDelete(entry, key, value) {
  if (value === null || value === undefined || value === "") delete entry[key];
  else entry[key] = value;
}

for (const result of evidence.results) {
  if (result.error || result.source?.status !== 200) {
    throw new Error(`Cannot refresh SEO for ${result.pathname}: source was not a clean HTTP 200`);
  }
  const entry = manifest[result.pathname];
  if (!entry) throw new Error(`SEO manifest does not contain ${result.pathname}`);
  const source = result.source;
  entry.title = source.title;
  assignOrDelete(entry, "description", source.description);
  assignOrDelete(entry, "canonical", source.canonical);
  assignOrDelete(entry, "lang", source.language);
  assignOrDelete(entry, "robots", source.robots);
  assignOrDelete(entry, "og:title", source.openGraph.title);
  assignOrDelete(entry, "og:description", source.openGraph.description);
  assignOrDelete(entry, "og:url", source.openGraph.url);
  assignOrDelete(entry, "og:type", source.openGraph.type);
  assignOrDelete(entry, "og:image", source.openGraph.image);
  if (!source.openGraph.image) {
    delete entry["og:image:alt"];
    delete entry["og:image:width"];
    delete entry["og:image:height"];
  }
  assignOrDelete(entry, "twitter:card", source.twitter.card);
  assignOrDelete(entry, "twitter:title", source.twitter.title);
  assignOrDelete(entry, "twitter:description", source.twitter.description);
  assignOrDelete(entry, "twitter:image", source.twitter.image);
  if (!source.twitter.image) delete entry["twitter:image:alt"];
  entry.alternates = Object.fromEntries(
    source.alternates.map((alternate) => [alternate.language, alternate.href]),
  );
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ updated: evidence.results.length, source: evidence.summary.source }, null, 2));
