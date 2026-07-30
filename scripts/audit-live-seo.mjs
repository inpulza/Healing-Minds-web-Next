import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SOURCE = process.env.SOURCE_ORIGIN || "https://www.healingmindsp.com";
const CANDIDATE = process.env.CANDIDATE_ORIGIN || "http://127.0.0.1:3100";
const OUTPUT = process.env.SEO_AUDIT_OUTPUT || "_arnes/evidencia/seo-parity.json";

function normalizeUrl(value) {
  if (!value) return null;
  const url = new URL(value, SOURCE);
  return `${url.pathname}${url.search}` || "/";
}

async function inspect(page, url) {
  const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
  // Production still applies part of its metadata through client-side Helmet.
  // Wait for the settled head so we compare the indexed state, not hydration timing.
  await page.waitForTimeout(1_200);
  const metadata = await page.evaluate(() => {
    const meta = (selector) => document.querySelector(selector)?.getAttribute("content") || null;
    const link = (selector) => document.querySelector(selector)?.getAttribute("href") || null;
    const alternates = Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]'))
      .map((node) => ({
        language: node.getAttribute("hreflang"),
        href: node.getAttribute("href"),
      }));
    return {
      title: document.title,
      description: meta('meta[name="description"]'),
      canonical: link('link[rel="canonical"]'),
      language: document.documentElement.lang,
      robots: meta('meta[name="robots"]'),
      openGraph: {
        title: meta('meta[property="og:title"]'),
        description: meta('meta[property="og:description"]'),
        url: meta('meta[property="og:url"]'),
        image: meta('meta[property="og:image"]'),
        type: meta('meta[property="og:type"]'),
      },
      twitter: {
        card: meta('meta[name="twitter:card"]'),
        title: meta('meta[name="twitter:title"]'),
        description: meta('meta[name="twitter:description"]'),
        image: meta('meta[name="twitter:image"]'),
      },
      alternates,
    };
  });
  return { status: response?.status() ?? null, ...metadata };
}

function comparable(record) {
  return {
    ...record,
    canonical: normalizeUrl(record.canonical),
    openGraph: { ...record.openGraph, url: normalizeUrl(record.openGraph.url), image: normalizeUrl(record.openGraph.image) },
    twitter: { ...record.twitter, image: normalizeUrl(record.twitter.image) },
    alternates: record.alternates
      .map((item) => ({ language: item.language, href: normalizeUrl(item.href) }))
      .sort((a, b) => String(a.language).localeCompare(String(b.language))),
  };
}

const sitemap = await fetch(`${SOURCE}/sitemap.xml`).then((response) => response.text());
const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
if (paths.length !== 77) throw new Error(`Expected 77 sitemap routes, received ${paths.length}`);

const browser = await chromium.launch({ headless: true });
const sourceContext = await browser.newContext();
const candidateContext = await browser.newContext();
const results = new Array(paths.length);
let cursor = 0;

async function worker() {
  const sourcePage = await sourceContext.newPage();
  const candidatePage = await candidateContext.newPage();
  while (true) {
    const index = cursor++;
    if (index >= paths.length) break;
    const pathname = paths[index];
    try {
      const [source, candidate] = await Promise.all([
        inspect(sourcePage, `${SOURCE}${pathname}`),
        inspect(candidatePage, `${CANDIDATE}${pathname}`),
      ]);
      const equal = JSON.stringify(comparable(source)) === JSON.stringify(comparable(candidate));
      results[index] = { pathname, equal, source, candidate };
    } catch (error) {
      results[index] = { pathname, equal: false, error: error instanceof Error ? error.message : String(error) };
    }
  }
  await Promise.all([sourcePage.close(), candidatePage.close()]);
}

await Promise.all(Array.from({ length: 4 }, () => worker()));
await browser.close();

const mismatches = results.filter((item) => !item.equal).map((item) => item.pathname);
const errors = results.filter((item) => item.error).map((item) => ({ pathname: item.pathname, error: item.error }));
const summary = {
  generatedAt: new Date().toISOString(),
  source: SOURCE,
  candidate: CANDIDATE,
  total: results.length,
  exactMatches: results.length - mismatches.length,
  mismatches,
  errors,
};
await mkdir(path.dirname(OUTPUT), { recursive: true });
await writeFile(OUTPUT, `${JSON.stringify({ summary, results }, null, 2)}\n`, "utf8");
console.log(JSON.stringify(summary, null, 2));
if (mismatches.length || errors.length) process.exitCode = 1;
