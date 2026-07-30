import fs from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

const migrationsDirectory = new URL("../migrations/", import.meta.url);
const migrationFiles = (await fs.readdir(migrationsDirectory))
  .filter(file => /^\d+.*\.sql$/.test(file))
  .sort();
if (migrationFiles.length === 0) throw new Error("No SQL migrations found");

const migrations = await Promise.all(migrationFiles.map(async file => ({
  file,
  sql: await fs.readFile(new URL(file, migrationsDirectory), "utf8"),
})));
const expectedTables = migrations
  .flatMap(({ sql }) => [...sql.matchAll(/CREATE TABLE "([^"]+)"/g)].map(match => match[1]))
  .sort();
const statements = migrations.flatMap(({ sql }) => sql
  .split("--> statement-breakpoint")
  .map(statement => statement.trim())
  .filter(Boolean));

const db = new PGlite();
try {
  for (const statement of statements) await db.exec(statement);

  const tablesResult = await db.query(
    "select tablename from pg_tables where schemaname = 'public' order by tablename",
  );
  const actualTables = tablesResult.rows.map(row => String(row.tablename)).sort();
  const missing = expectedTables.filter(table => !actualTables.includes(table));
  if (missing.length) throw new Error(`Migration omitted tables: ${missing.join(", ")}`);

  const constraintsResult = await db.query(
    "select count(*)::int as total from pg_constraint where contype = 'f'",
  );
  const foreignKeys = Number(constraintsResult.rows[0]?.total || 0);
  if (foreignKeys < 15) throw new Error(`Expected at least 15 foreign keys, found ${foreignKeys}`);

  const orderedTagColumn = await db.query(`
    select is_nullable, column_default
    from information_schema.columns
    where table_name = 'blog_post_tags' and column_name = 'position'
  `);
  if (orderedTagColumn.rows.length !== 1) throw new Error("Ordered blog tag migration was not applied");
  if (orderedTagColumn.rows[0]?.is_nullable !== "NO") throw new Error("Blog tag position must be NOT NULL");

  await db.exec(`
    insert into contact_messages (first_name, last_name, email, message)
    values ('Migration', 'Check', 'migration-check@example.invalid', 'Schema verification only')
  `);
  const contactResult = await db.query("select count(*)::int as total from contact_messages");
  if (Number(contactResult.rows[0]?.total) !== 1) throw new Error("Contact insert smoke test failed");

  console.log(JSON.stringify({
    ok: true,
    migrations: migrationFiles,
    statements: statements.length,
    tables: actualTables.length,
    foreignKeys,
    orderedBlogTags: "pass",
    contactInsert: "pass",
  }));
} finally {
  await db.close();
}
