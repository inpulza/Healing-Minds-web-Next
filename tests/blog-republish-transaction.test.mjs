import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import Module from "node:module";
import test from "node:test";
import { build } from "esbuild";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";

test("real publication transaction restores EN/ES URLs atomically and rejects stale redirects", async () => {
  const database = new PGlite();
  globalThis.__republishTestDb = drizzle(database);
  try {
    for (const name of fs.readdirSync("migrations").filter(name => /^\d+.*\.sql$/.test(name)).sort()) {
      for (const sql of fs.readFileSync(path.join("migrations", name), "utf8").split("--> statement-breakpoint").filter(sql => sql.trim())) await database.exec(sql);
    }
    const compiled = await build({
      entryPoints: ["server/blog/storage.ts"], bundle: true, write: false, platform: "node", format: "cjs", packages: "external",
      plugins: [{ name: "test-database", setup(builder) {
        builder.onResolve({ filter: /^\.\.\/db$/ }, () => ({ path: "test-db", namespace: "test-db" }));
        builder.onLoad({ filter: /.*/, namespace: "test-db" }, () => ({ contents: "export const db = globalThis.__republishTestDb;" }));
      } }],
    });
    const filename = path.resolve("tests/republish-test-runtime.cjs");
    const runtime = new Module(filename);
    runtime.filename = filename;
    runtime.paths = Module._nodeModulePaths(path.dirname(filename));
    runtime._compile(compiled.outputFiles[0].text, filename);
    const storage = runtime.exports;
    for (const language of ["en", "es"]) {
      const sourcePath = `${language === "es" ? "/es" : ""}/blog/republish-test`;
      const post = (await database.query("INSERT INTO blog_posts (title, slug, language, status) VALUES ('Test', 'republish-test', $1, 'pending_review') RETURNING id", [language])).rows[0];
      await database.query("INSERT INTO blog_redirects (source_path, target_path, reason, source_post_id) VALUES ($1, '/blog', 'unpublish', $2)", [sourcePath, post.id]);
      const snapshot = await storage.getBlogRedirectBySourcePath(sourcePath);
      await database.query("UPDATE blog_redirects SET reason='manual' WHERE source_path=$1", [sourcePath]);
      await assert.rejects(storage.updateBlogPostStatusWithImageGuard(post.id, "published", new Date(), { redirectSnapshot: snapshot }, { deactivateRedirectPath: sourcePath }), { code: "blog_redirect_reclaim_conflict" });
      await database.query("UPDATE blog_redirects SET reason='unpublish' WHERE source_path=$1", [sourcePath]);
      await database.query("UPDATE blog_redirects SET target_path='/es/blog' WHERE source_path=$1", [sourcePath]);
      await assert.rejects(storage.updateBlogPostStatusWithImageGuard(post.id, "published", new Date(), { redirectSnapshot: snapshot }, { deactivateRedirectPath: sourcePath }), { code: "blog_redirect_publish_snapshot_changed" });
      assert.equal((await database.query("SELECT status FROM blog_posts WHERE id=$1", [post.id])).rows[0].status, "pending_review");
      assert.equal((await storage.getBlogRedirectBySourcePath(sourcePath)).isActive, true);
      const fresh = await storage.getBlogRedirectBySourcePath(sourcePath);
      const result = await storage.updateBlogPostStatusWithImageGuard(post.id, "published", new Date(), { redirectSnapshot: fresh }, { deactivateRedirectPath: sourcePath });
      assert.equal(result.post.status, "published");
      assert.equal(result.deactivatedRedirect.isActive, false);
      assert.equal(await storage.getActiveBlogRedirect(sourcePath), undefined);
    }
  } finally {
    delete globalThis.__republishTestDb;
    await database.close();
  }
});
