// Bot/visible content parity audit (Task: paridad bots).
//
// Crawls every static route from shared/routeManifest.ts against a running
// local server using a Googlebot user agent, then verifies for every
// module-backed page that:
//   1. The injected crawler H1 matches the shared module title (the same
//      string the React page renders as its visible H1).
//   2. At least 90% of the module's words appear in the crawler body.
// Non-module routes (hyperlocal satellites, California landings, blog index)
// get a baseline check: HTTP 200, a non-empty injected body with an <h1>.
//
// Scope note: for module-backed pages this compares the crawler body against
// the same shared module the server serialized, so it guards registry wiring,
// serialization, and lost bodies — NOT the React page's own rendering. The
// visible side stays in parity because pages import and render the exact same
// modules (enforced by code review, not by this script).
//
// Usage: npx tsx scripts/audit-bot-parity.ts [baseUrl]
// Exit code 0 = all pass, 1 = at least one failure.

import { getKnownRoutePaths, getSitemapEntries } from '../shared/routeManifest';
import { BOT_CONTENT_BY_PATH } from '../server/utils/html-injection';
import { pageContentToHtml } from '../server/utils/content-html';

const BASE_URL = process.argv[2] ?? 'http://localhost:5000';
const GOOGLEBOT_UA =
  'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/125.0.0.0 Safari/537.36';
const MIN_COVERAGE = 0.9;

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  mdash: '\u2014', ndash: '\u2013', hellip: '\u2026', rsquo: '\u2019', lsquo: '\u2018',
  rdquo: '\u201d', ldquo: '\u201c',
  ntilde: 'ñ', Ntilde: 'Ñ', aacute: 'á', eacute: 'é', iacute: 'í', oacute: 'ó',
  uacute: 'ú', Aacute: 'Á', Eacute: 'É', Iacute: 'Í', Oacute: 'Ó', Uacute: 'Ú',
  uuml: 'ü', Uuml: 'Ü', iquest: '¿', iexcl: '¡',
};

function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-zA-Z]+);/g, (m, name) => NAMED_ENTITIES[name] ?? m);
}

function htmlToText(html: string): string {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim();
}

function words(text: string): string[] {
  // Latin letters (incl. accented EN/ES chars) and digits; avoids \p{L} so the
  // script typechecks under the project's tsconfig target.
  return (text.toLowerCase().match(/[a-z0-9\u00c0-\u024f]+/g) ?? []);
}

/** Fraction of expected words (as a multiset) found in the actual words. */
function coverage(expected: string[], actual: string[]): number {
  if (expected.length === 0) return 1;
  const counts = new Map<string, number>();
  for (const w of actual) counts.set(w, (counts.get(w) ?? 0) + 1);
  let matched = 0;
  for (const w of expected) {
    const c = counts.get(w) ?? 0;
    if (c > 0) {
      matched++;
      counts.set(w, c - 1);
    }
  }
  return matched / expected.length;
}

function stripRichMarkers(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\*\*/g, '');
}

function extractInjectedBody(doc: string): string | null {
  const start = doc.indexOf('<div id="root">');
  if (start === -1) return null;
  const inner = doc.slice(start + '<div id="root">'.length);
  // The injected body is everything up to the matching close; the SSR-injected
  // markup never nests bare `</div>` (it uses main/section/nav/article/ul/li).
  const end = inner.indexOf('</div>');
  if (end === -1) return null;
  return inner.slice(0, end);
}

function extractH1(html: string): string | null {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return m ? htmlToText(m[1]) : null;
}

interface Failure {
  path: string;
  problem: string;
}

async function main() {
  // Pass 1: every sitemap URL (EN + ES) — the strict acceptance contract.
  // Pass 2: remaining routed-but-unlisted pages (blog index, noindex pages, ...).
  const sitemapPaths: string[] = [];
  for (const entry of getSitemapEntries()) sitemapPaths.push(entry.en, entry.es);
  const sitemapSet = new Set(sitemapPaths);
  const otherPaths = getKnownRoutePaths().filter(
    p => !sitemapSet.has(p) && !p.startsWith('/admin'),
  );
  const paths = [...sitemapPaths, ...otherPaths];
  const failures: Failure[] = [];
  let moduleChecked = 0;
  let baselineChecked = 0;

  for (const path of paths) {
    let doc: string;
    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        headers: { 'User-Agent': GOOGLEBOT_UA },
        redirect: 'manual',
      });
      if (res.status !== 200) {
        failures.push({ path, problem: `HTTP ${res.status}` });
        continue;
      }
      doc = await res.text();
    } catch (err) {
      failures.push({ path, problem: `fetch failed: ${(err as Error).message}` });
      continue;
    }

    const body = extractInjectedBody(doc);
    if (!body || htmlToText(body).length === 0) {
      failures.push({ path, problem: 'no injected crawler body in #root' });
      continue;
    }
    const h1 = extractH1(body);
    if (!h1) {
      failures.push({ path, problem: 'injected body has no <h1>' });
      continue;
    }

    const entry = BOT_CONTENT_BY_PATH[path];
    if (!entry) {
      baselineChecked++;
      continue;
    }
    moduleChecked++;

    const pageContent = entry.content[entry.lang];
    const expectedH1 = stripRichMarkers(pageContent.title).replace(/\s+/g, ' ').trim();
    if (h1 !== expectedH1) {
      failures.push({ path, problem: `H1 mismatch: bot="${h1}" module="${expectedH1}"` });
    }

    const expectedText = htmlToText(pageContentToHtml(pageContent));
    const cov = coverage(words(expectedText), words(htmlToText(body)));
    if (cov < MIN_COVERAGE) {
      failures.push({
        path,
        problem: `module word coverage ${(cov * 100).toFixed(1)}% < ${MIN_COVERAGE * 100}%`,
      });
    }
  }

  console.log(`Audited ${paths.length} routes @ ${BASE_URL} (${sitemapPaths.length} sitemap + ${otherPaths.length} other routed)`);
  console.log(`  module-parity checks: ${moduleChecked}`);
  console.log(`  baseline checks (satellites/California/blog/misc): ${baselineChecked}`);
  if (failures.length === 0) {
    console.log('PASS: all routes have a crawler body with H1; all module-backed pages meet H1 + >=90% word parity.');
    return;
  }
  console.error(`FAIL: ${failures.length} problem(s):`);
  for (const f of failures) console.error(`  ${f.path} -> ${f.problem}`);
  process.exitCode = 1;
}

main().catch(err => {
  console.error('audit crashed:', err);
  process.exitCode = 1;
});
