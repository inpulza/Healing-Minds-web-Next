import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

test("blog tag relations persist and load editorial order", () => {
  const schema = read("shared/schema.ts");
  const storage = read("server/blog/storage.ts");
  const seed = read("server/blog/seed.ts");

  assert.match(schema, /position: integer\("position"\)\.default\(0\)\.notNull\(\)/);
  assert.match(storage, /position: blogPostTags\.position/);
  assert.match(storage, /orderBy\(blogPostTags\.postId, blogPostTags\.position, blogPostTags\.tagId\)/);
  assert.match(storage, /map\(\(tagId, position\) => \(\{ postId, tagId, position \}\)\)/);
  assert.match(storage, /map\(\(tagId, position\) => \(\{ postId: post\.id, tagId, position \}\)\)/);
  assert.match(storage, /map\(\(tagId, position\) => \(\{ postId: id, tagId, position \}\)\)/);
  assert.match(seed, /map\(\(tagId, position\) => \(\{ postId, tagId, position \}\)\)/);
});

test("ordered blog tags have an additive database migration", () => {
  const migration = read("migrations/0001_ordered_blog_tags.sql");
  const verifier = read("scripts/verify-migration-pglite.mjs");
  assert.match(migration, /ALTER TABLE "blog_post_tags" ADD COLUMN "position" integer DEFAULT 0 NOT NULL/);
  assert.match(verifier, /readdir\(migrationsDirectory\)/);
  assert.match(verifier, /where table_name = 'blog_post_tags' and column_name = 'position'/);
});
