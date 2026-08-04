import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root, file), "utf8");

test("archive pagination keeps 0, 1, 3, 4 and 10+ post totals stable", () => {
  const program = `
    import {
      getBlogArchiveRegularLimit,
      getBlogArchiveRegularOffset,
      getBlogArchiveTotalPages,
    } from './shared/blog-archive.ts';
    import { createBlogArchiveFixture } from './app/_routing/blog-archive-fixture.ts';
    const totals = [0, 1, 3, 4, 9, 10, 18, 19].map(total => [total, getBlogArchiveTotalPages(total)]);
    const en1 = createBlogArchiveFixture('en', 1);
    const en2 = createBlogArchiveFixture('en', 2);
    const anxiety1 = createBlogArchiveFixture('en', 1, 'anxiety-care');
    const anxiety2 = createBlogArchiveFixture('en', 2, 'anxiety-care');
    process.stdout.write(JSON.stringify({
      totals,
      limits: [getBlogArchiveRegularLimit(1), getBlogArchiveRegularLimit(2)],
      offsets: [getBlogArchiveRegularOffset(1), getBlogArchiveRegularOffset(2), getBlogArchiveRegularOffset(3)],
      enIds: [...en1.data, ...en2.data].map(post => post.id),
      anxietyIds: [...anxiety1.data, ...anxiety2.data].map(post => post.id),
      featured: en1.featuredPostId,
    }));
  `;
  const result = spawnSync(
    process.execPath,
    ["--import", "tsx", "--input-type=module", "-e", program],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.deepEqual(payload.totals, [[0, 1], [1, 1], [3, 1], [4, 1], [9, 1], [10, 2], [18, 2], [19, 3]]);
  assert.deepEqual(payload.limits, [8, 9]);
  assert.deepEqual(payload.offsets, [0, 8, 17]);
  assert.equal(payload.enIds.length, 14);
  assert.equal(new Set(payload.enIds).size, 14);
  assert.equal(payload.anxietyIds.length, 10);
  assert.equal(new Set(payload.anxietyIds).size, 10);
  assert.equal(payload.enIds[0], payload.featured);
});

test("the public archive is SSR-owned and uses deterministic database ordering", () => {
  const catchAll = read("app/[...slug]/page.tsx");
  const storage = read("server/blog/storage.ts");
  const english = read("app/blog/page.tsx");
  const spanish = read("app/es/blog/page.tsx");
  const index = read("client/src/pages/BlogIndex.tsx");

  assert.match(english, /dynamic = ["']force-dynamic["']/);
  assert.match(spanish, /dynamic = ["']force-dynamic["']/);
  assert.match(catchAll, /slug\.join\("\/"\) !== "blog"/);
  assert.match(storage, /desc\(blogPosts\.isFeatured\)/);
  assert.match(storage, /desc\(blogPosts\.publishedAt\)/);
  assert.match(storage, /desc\(blogPosts\.createdAt\)/);
  assert.match(storage, /desc\(blogPosts\.id\)/);
  assert.match(storage, /ne\(blogPosts\.id, featuredRow\.post\.id\)/);
  assert.match(index, /rel="prev"/);
  assert.match(index, /rel="next"/);
  assert.match(index, /aria-current=\{pageNumber === archive\.page \? 'page'/);
});
