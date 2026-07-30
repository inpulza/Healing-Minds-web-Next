import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";

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
  assert.match(seed, /values\(tagIds\.map\(\(tagId, position\) => \(\{ postId, tagId, position \}\)\)\)/);
  assert.match(seed, /db\.transaction\(async \(tx\) =>/);
  assert.match(seed, /tx\.delete\(blogPostTags\)/);
  assert.match(seed, /tx\s*\.insert\(blogPostTags\)/);
});

test("ordered blog tags have an additive database migration", () => {
  const migration = read("migrations/0001_ordered_blog_tags.sql");
  const verifier = read("scripts/verify-migration-pglite.mjs");
  assert.match(migration, /ALTER TABLE "blog_post_tags" ADD COLUMN "position" integer DEFAULT 0 NOT NULL/);
  assert.match(verifier, /readdir\(migrationsDirectory\)/);
  assert.match(verifier, /where table_name = 'blog_post_tags' and column_name = 'position'/);
});

test("ordered blog tags round-trip and failed replacement rolls back", async () => {
  const database = new PGlite();
  try {
    const migrationFiles = fs.readdirSync(path.join(root, "migrations"))
      .filter((name) => /^\d+.*\.sql$/.test(name))
      .sort();
    for (const migrationFile of migrationFiles) {
      const migration = read(path.join("migrations", migrationFile));
      const statements = migration
        .split("--> statement-breakpoint")
        .map((sql) => sql.trim())
        .filter(Boolean);
      for (const statement of statements) await database.exec(statement);
    }

    const post = await database.query(`
      INSERT INTO blog_posts (title, slug)
      VALUES ('Ordered tags test', 'ordered-tags-test')
      RETURNING id
    `);
    const tags = await database.query(`
      INSERT INTO blog_tags (name, slug)
      VALUES ('Third', 'third'), ('First', 'first'), ('Second', 'second')
      RETURNING id, slug
    `);
    const postId = post.rows[0].id;
    const bySlug = new Map(tags.rows.map((tag) => [tag.slug, tag.id]));
    const expected = ["third", "first", "second"];

    const replace = async (tagSlugs, failAfterDelete = false) => {
      await database.exec("BEGIN");
      try {
        await database.query("DELETE FROM blog_post_tags WHERE post_id = $1", [postId]);
        if (failAfterDelete) {
          await database.query(
            "INSERT INTO blog_post_tags (post_id, tag_id, position) VALUES ($1, $2, 0)",
            [postId, 999_999],
          );
        } else {
          for (const [position, slug] of tagSlugs.entries()) {
            await database.query(
              "INSERT INTO blog_post_tags (post_id, tag_id, position) VALUES ($1, $2, $3)",
              [postId, bySlug.get(slug), position],
            );
          }
        }
        await database.exec("COMMIT");
      } catch (error) {
        await database.exec("ROLLBACK");
        throw error;
      }
    };

    const readOrder = async () => {
      const result = await database.query(`
        SELECT blog_tags.slug
        FROM blog_post_tags
        INNER JOIN blog_tags ON blog_tags.id = blog_post_tags.tag_id
        WHERE blog_post_tags.post_id = $1
        ORDER BY blog_post_tags.position, blog_post_tags.tag_id
      `, [postId]);
      return result.rows.map((row) => row.slug);
    };

    await replace(expected);
    await replace(expected);
    assert.deepEqual(await readOrder(), expected);
    await assert.rejects(() => replace(expected, true));
    assert.deepEqual(await readOrder(), expected);
  } finally {
    await database.close();
  }
});
