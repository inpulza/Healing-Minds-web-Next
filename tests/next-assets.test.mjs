import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const source = fs.readFileSync(path.join(process.cwd(), "client", "src", "components", "OptimizedImage.tsx"), "utf8");

test("the shared image component sends local assets through the Next responsive optimizer", () => {
  assert.match(source, /import Image, \{ type ImageProps \} from ['"]next\/image['"]/);
  assert.match(source, /StaticImageLike/);
  assert.match(source, /typeof src === ['"]string['"]/);
  assert.match(source, /<Image/);
  assert.match(source, /src=\{resolvedSrc\}/);
  assert.match(source, /fetchPriority=\{priority \? ['"]high['"] : undefined\}/);
  assert.doesNotMatch(source, /fetchpriority/);
});

test("the shared image component reveals assets that completed before hydration", () => {
  assert.match(source, /imageRef/);
  assert.match(source, /image\?\.complete/);
  assert.match(source, /image\.naturalWidth > 0/);
  assert.match(source, /setIsLoaded\(true\)/);
});

test("direct img elements resolve imported static assets instead of serializing objects", () => {
  const root = path.join(process.cwd(), "client", "src");
  const files = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (entry.name.endsWith(".tsx")) files.push(full);
    }
  };
  visit(root);

  const offenders = [];
  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const imports = [...content.matchAll(/import\s+(\w+)\s+from\s+['"][^'"]+\.(?:webp|png|jpe?g|svg)(?:\?[^'"]*)?['"]/gi)];
    const srcExpressions = [...content.matchAll(/src=\{([^}\n]+)\}/g)].map((match) => match[1]);
    for (const [, identifier] of imports) {
      for (const expression of srcExpressions) {
        const usesIdentifier = new RegExp(`\\b${identifier}\\b`).test(expression);
        if (usesIdentifier && !expression.includes(`assetUrl(${identifier})`)) {
          offenders.push(`${path.relative(root, file)}:${identifier}:${expression.trim()}`);
        }
      }
    }
  }
  assert.deepEqual(offenders, []);
});
