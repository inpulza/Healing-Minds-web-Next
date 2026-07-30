import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const root = process.cwd();
const sourceDir = path.resolve(process.argv[2] || "_arnes/evidencia/visual/home/source");
const candidateDir = path.resolve(process.argv[3] || "_arnes/evidencia/visual/home/candidate");
const outDir = path.resolve(process.argv[4] || "_arnes/evidencia/visual/home/diff");
const pairs = ["390x844", "768x1024", "1024x900", "1440x900", "1920x1080", "2560x1440"];

function cropTop(image, height) {
  const output = new PNG({ width: image.width, height });
  image.data.copy(output.data, 0, 0, image.width * height * 4);
  return output;
}

await mkdir(outDir, { recursive: true });
const comparisons = [];
for (const pair of pairs) {
  const source = PNG.sync.read(await readFile(path.join(sourceDir, `source-${pair}.png`)));
  const candidate = PNG.sync.read(await readFile(path.join(candidateDir, `candidate-${pair}.png`)));
  if (source.width !== candidate.width) throw new Error(`${pair}: width mismatch`);
  const commonHeight = Math.min(source.height, candidate.height);
  const sourceCommon = cropTop(source, commonHeight);
  const candidateCommon = cropTop(candidate, commonHeight);
  const diff = new PNG({ width: source.width, height: commonHeight });
  const differentPixels = pixelmatch(
    sourceCommon.data,
    candidateCommon.data,
    diff.data,
    source.width,
    commonHeight,
    { threshold: 0.1, includeAA: false },
  );
  const bands = [];
  for (let top = 0; top < commonHeight; top += 1000) {
    const height = Math.min(1000, commonHeight - top);
    const a = new Uint8Array(sourceCommon.data.buffer, sourceCommon.data.byteOffset + top * source.width * 4, height * source.width * 4);
    const b = new Uint8Array(candidateCommon.data.buffer, candidateCommon.data.byteOffset + top * source.width * 4, height * source.width * 4);
    const bandDiff = new Uint8Array(height * source.width * 4);
    const changed = pixelmatch(a, b, bandDiff, source.width, height, { threshold: 0.1, includeAA: false });
    bands.push({ top, height, ratio: changed / (source.width * height) });
  }
  await writeFile(path.join(outDir, `diff-${pair}.png`), PNG.sync.write(diff));
  comparisons.push({
    pair,
    source: { width: source.width, height: source.height },
    candidate: { width: candidate.width, height: candidate.height },
    commonHeight,
    heightDelta: candidate.height - source.height,
    differentPixels,
    differenceRatio: differentPixels / (source.width * commonHeight),
    bands,
  });
}
const report = { generatedAt: new Date().toISOString(), sourceDir, candidateDir, comparisons };
await writeFile(path.join(outDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(comparisons.map(({ pair, heightDelta, differenceRatio }) => ({ pair, heightDelta, differenceRatio })), null, 2));
