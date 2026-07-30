import fs from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

const migrationUrl = new URL("../migrations/0000_initial_schema.sql", import.meta.url);
const migration = await fs.readFile(migrationUrl, "utf8");
const expectedTables = [...migration.matchAll(/CREATE TABLE "([^"]+)"/g)].map(match => match[1]).sort();
const statements = migration
  .split("--> statement-breakpoint")
  .map(statement => statement.trim())
  .filter(Boolean);

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

  await db.exec(`
    insert into contact_messages (first_name, last_name, email, message)
    values ('Migration', 'Check', 'migration-check@example.invalid', 'Schema verification only')
  `);
  const contactResult = await db.query("select count(*)::int as total from contact_messages");
  if (Number(contactResult.rows[0]?.total) !== 1) throw new Error("Contact insert smoke test failed");

  console.log(JSON.stringify({
    ok: true,
    statements: statements.length,
    tables: actualTables.length,
    foreignKeys,
    contactInsert: "pass",
  }));
} finally {
  await db.close();
}
