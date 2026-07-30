import { chromium } from "playwright";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { candidateContextOptions } from "./lib/vercel-preview.mjs";

const SOURCE = process.env.SOURCE_ORIGIN || "https://www.healingmindsp.com";
const CANDIDATE = process.env.CANDIDATE_ORIGIN || "http://127.0.0.1:3100";
const OUTPUT = process.env.CONTENT_AUDIT_OUTPUT || "_arnes/evidencia/content-parity.json";

function normalize(text) {
  return text
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function hash(lines) {
  return createHash("sha256").update(lines.join("\n"), "utf8").digest("hex");
}

function multisetDifference(left, right) {
  const counts = new Map();
  for (const line of right) counts.set(line, (counts.get(line) || 0) + 1);
  const missing = [];
  for (const line of left) {
    const count = counts.get(line) || 0;
    if (count > 0) counts.set(line, count - 1);
    else missing.push(line);
  }
  return missing;
}

async function inspect(page, url) {
  const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
  await page.waitForTimeout(1_200);
  const payload = await page.evaluate(() => {
    // Social feeds are audited through their Route Handlers/snapshots. Their
    // live contents can change between the two requests made by this static
    // copy audit, so exclude only the dynamic cards—not their section copy.
    document
      .querySelectorAll('[data-testid^="video-link-"]')
      .forEach((node) => node.remove());

    // Google reviews are also independently audited through the reviews API
    // and frozen fallback. Production occasionally omits the whole lazy
    // section when the upstream widget fails while the candidate correctly
    // renders its snapshot; that availability state is not an editorial-copy
    // regression and must not produce false mismatches here.
    document
      .querySelectorAll('[data-testid="reviews-section"]')
      .forEach((node) => node.remove());

    return {
      text: document.body.innerText,
      headings: Array.from(document.querySelectorAll("h1,h2,h3")).map((node) => ({
        level: node.tagName.toLowerCase(),
        text: node.textContent?.replace(/\s+/g, " ").trim() || "",
      })),
    };
  });
  const lines = normalize(payload.text);
  return {
    status: response?.status() ?? null,
    lines,
    hash: hash(lines),
    headings: payload.headings,
  };
}

const sitemap = await fetch(`${SOURCE}/sitemap.xml`).then((response) => response.text());
const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
if (paths.length !== 77) throw new Error(`Expected 77 live sitemap URLs, received ${paths.length}`);

const browser = await chromium.launch({ headless: true });
const sourceContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const candidateContext = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  ...candidateContextOptions(),
});
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
      results[index] = {
        pathname,
        source: { status: source.status, hash: source.hash, lines: source.lines.length, headings: source.headings },
        candidate: { status: candidate.status, hash: candidate.hash, lines: candidate.lines.length, headings: candidate.headings },
        equal: source.hash === candidate.hash,
        missingFromCandidate: multisetDifference(source.lines, candidate.lines).slice(0, 50),
        extraInCandidate: multisetDifference(candidate.lines, source.lines).slice(0, 50),
      };
    } catch (error) {
      results[index] = { pathname, error: error instanceof Error ? error.message : String(error), equal: false };
    }
  }
  await sourcePage.close();
  await candidatePage.close();
}

await Promise.all(Array.from({ length: 4 }, () => worker()));
await browser.close();

const summary = {
  generatedAt: new Date().toISOString(),
  source: SOURCE,
  candidate: CANDIDATE,
  total: results.length,
  exactTextMatches: results.filter((item) => item?.equal).length,
  statusMismatches: results.filter((item) => item?.source?.status !== item?.candidate?.status).map((item) => item.pathname),
  textMismatches: results.filter((item) => !item?.equal).map((item) => item.pathname),
  errors: results.filter((item) => item?.error).map((item) => ({ pathname: item.pathname, error: item.error })),
};

const absoluteOutput = path.resolve(OUTPUT);
await mkdir(path.dirname(absoluteOutput), { recursive: true });
await writeFile(absoluteOutput, `${JSON.stringify({ summary, results }, null, 2)}\n`, "utf8");
console.log(JSON.stringify(summary, null, 2));
if (summary.statusMismatches.length || summary.errors.length) process.exitCode = 1;
