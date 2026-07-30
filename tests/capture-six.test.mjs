import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";
import test from "node:test";
import { PNG } from "pngjs";

const root = process.cwd();
const script = resolve(root, "arnes/scripts/capture-six.mjs");
const scriptSource = readFileSync(script, "utf8");
const viewports = [
  [390, 844],
  [768, 1024],
  [1024, 900],
  [1440, 900],
  [1920, 1080],
  [2560, 1440],
];

function runNode(args) {
  return new Promise((resolveRun) => {
    const child = spawn(process.execPath, args, { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("close", (code) => resolveRun({ code, stdout, stderr }));
  });
}

test("capture-six records the settled state after its scroll sweep", () => {
  assert.match(scriptSource, /waitForTimeout\(Number\(args\.settle/);
  assert.ok(scriptSource.indexOf("await autoscroll(page)") < scriptSource.indexOf("args.settle"));
});

test("capture-six creates raw, width-normalized PNGs, and measured metadata for all six viewports", { timeout: 120_000 }, async (t) => {
  const outDir = mkdtempSync(join(tmpdir(), "capture-six-"));
  t.after(() => rmSync(outDir, { recursive: true, force: true }));

  const server = createServer((_request, response) => {
    response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    response.end(`<!doctype html><style>
      html, body { margin: 0; }
      main { min-height: 1200px; background: linear-gradient(#fff, #acf); }
      .overflow { width: calc(100vw + 37px); height: 10px; background: red; }
    </style><main><div class="overflow"></div><h1>Comparable capture fixture</h1></main>`);
  });
  await new Promise((resolveListen) => server.listen(0, "127.0.0.1", resolveListen));
  t.after(() => server.close());
  const address = server.address();
  const url = `http://127.0.0.1:${address.port}/`;

  const result = await runNode([
    script,
    `--url=${url}`,
    `--dir=${outDir}`,
    "--prefix=source",
    `--viewports=${viewports.map(([width, height]) => `${width}x${height}`).join(",")}`,
  ]);

  assert.equal(result.code, 0, `stdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
  assert.match(result.stdout, /PASS captura comparable 6\/6/);

  const manifest = JSON.parse(readFileSync(join(outDir, "metrics.json"), "utf8"));
  assert.equal(manifest.captures.length, 6);

  for (const [width, height] of viewports) {
    const pair = `${width}x${height}`;
    const raw = PNG.sync.read(readFileSync(join(outDir, `source-${pair}.raw.png`)));
    const comparable = PNG.sync.read(readFileSync(join(outDir, `source-${pair}.png`)));
    const metrics = JSON.parse(readFileSync(join(outDir, `source-${pair}.metrics.json`), "utf8"));

    assert.equal(raw.width, width + 37, `${pair} must retain diagnostic body overflow in raw`);
    assert.equal(comparable.width, width, `${pair} comparable width`);
    assert.equal(comparable.height, raw.height, `${pair} crop must preserve full-page height`);
    assert.deepEqual(metrics.requestedViewport, { width, height });
    assert.equal(metrics.page.innerWidth, width);
    assert.equal(metrics.page.innerHeight, height);
    assert.equal(metrics.page.devicePixelRatio, 1);
    assert.deepEqual(metrics.images.raw, { width: raw.width, height: raw.height });
    assert.deepEqual(metrics.images.comparable, { width: comparable.width, height: comparable.height });
    assert.equal(metrics.normalization.applied, true);
    assert.equal(metrics.normalization.removedRightPx, 37);
  }
});

test("capture-six rejects malformed viewport pairs before launching the browser", async () => {
  const result = await runNode([script, "--url=http://127.0.0.1/", "--viewports=390,768x1024"]);
  assert.notEqual(result.code, 0);
  assert.match(result.stderr, /viewport inválido.*390/i);
});
