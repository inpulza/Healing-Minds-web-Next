import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { readMigrationFiles } from "drizzle-orm/migrator";

const migrationsDirectory = new URL("../migrations/", import.meta.url);
const migrationsFolder = fileURLToPath(migrationsDirectory);
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
const drizzleMigrations = readMigrationFiles({ migrationsFolder });
if (drizzleMigrations.length !== migrationFiles.length) {
  throw new Error(
    `Drizzle journal exposes ${drizzleMigrations.length} migration(s), but ${migrationFiles.length} SQL files exist`,
  );
}

const db = new PGlite();
try {
  await migrate(drizzle(db), { migrationsFolder });

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

  const contactId = await db.query("select id from contact_messages limit 1");
  const leadId = String(contactId.rows[0]?.id || "");
  await db.query(
    `insert into web_alert_outbox (dedupe_key, tenant_id, form_key, lead_id, status)
     values ('healing-minds:contact_page:migration-check', 'healing-minds', 'contact_page', $1, 'disabled')`,
    [leadId],
  );
  let duplicateWebAlertRejected = false;
  try {
    await db.query(
      `insert into web_alert_outbox (dedupe_key, tenant_id, form_key, lead_id)
       values ('healing-minds:contact_page:migration-check', 'healing-minds', 'contact_page', $1)`,
      [leadId],
    );
  } catch {
    duplicateWebAlertRejected = true;
  }
  if (!duplicateWebAlertRejected) throw new Error("Web alert dedupe key must be unique");

  await db.exec(`insert into blog_posts (title, slug) values ('Image job migration check', 'image-job-migration-check')`);
  const translationGroup = await db.query(`select translation_group_id from blog_posts where id = 1`);
  const translationGroupId = String(translationGroup.rows[0]?.translation_group_id || "");
  await db.query(
    `insert into blog_posts (title, slug, language, translation_group_id, status)
     values ('Borrador gemelo', 'borrador-gemelo', 'es', $1, 'draft')`,
    [translationGroupId],
  );
  let duplicateTranslationRejected = false;
  try {
    await db.query(
      `insert into blog_posts (title, slug, language, translation_group_id, status)
       values ('Gemelo duplicado', 'gemelo-duplicado', 'es', $1, 'draft')`,
      [translationGroupId],
    );
  } catch {
    duplicateTranslationRejected = true;
  }
  if (!duplicateTranslationRejected) throw new Error("A translation group must allow only one post per language");
  await db.exec(`update blog_posts set status = 'published', published_at = now() where id = 1`);
  const independentSibling = await db.query(`select status, published_at from blog_posts where slug = 'borrador-gemelo'`);
  if (independentSibling.rows[0]?.status !== "draft" || independentSibling.rows[0]?.published_at !== null) {
    throw new Error("Publishing one language must not publish its sibling");
  }
  await db.exec(`
    insert into blog_image_generation_jobs (post_id, idempotency_key, operation, role)
    values (1, 'migration-image-job-key-1', 'generate_set', 'all')
  `);
  const admissionState = await db.query(`
    select status from blog_image_generation_jobs where idempotency_key = 'migration-image-job-key-1'
  `);
  if (admissionState.rows[0]?.status !== "admitting") {
    throw new Error("New image jobs must remain non-runnable until admission completes");
  }
  const prematureClaim = await db.query(`
    update blog_image_generation_jobs
    set status = 'running'
    where idempotency_key = 'migration-image-job-key-1' and status = 'queued'
    returning id
  `);
  if (prematureClaim.rows.length !== 0) {
    throw new Error("An admitting image job must not be claimable by a polling worker");
  }
  const idempotentReplay = await db.query(`
    insert into blog_image_generation_jobs (post_id, idempotency_key, operation, role)
    values (1, 'migration-image-job-key-1', 'generate_set', 'all')
    on conflict (idempotency_key) do nothing
    returning id
  `);
  if (idempotentReplay.rows.length !== 0) {
    throw new Error("A same-key replay must not create or admit a second paid image job");
  }
  let duplicateKeyRejected = false;
  try {
    await db.exec(`
      insert into blog_image_generation_jobs (post_id, idempotency_key, operation, role)
      values (1, 'migration-image-job-key-1', 'generate_set', 'all')
    `);
  } catch {
    duplicateKeyRejected = true;
  }
  if (!duplicateKeyRejected) throw new Error("Image job idempotency key must be unique");

  let concurrentJobRejected = false;
  try {
    await db.exec(`
      insert into blog_image_generation_jobs (post_id, idempotency_key, operation, role)
      values (1, 'migration-image-job-key-2', 'generate_set', 'hero')
    `);
  } catch {
    concurrentJobRejected = true;
  }
  if (!concurrentJobRejected) throw new Error("Only one open image job per post is allowed");

  await db.exec(`
    insert into blog_post_images (post_id, role, slot, source, image_job_id)
    values (1, 'hero', 'hero', 'ai', 1)
  `);
  let duplicateSlotRejected = false;
  try {
    await db.exec(`
      insert into blog_post_images (post_id, role, slot, source, image_job_id)
      values (1, 'hero', 'hero', 'ai', 1)
    `);
  } catch {
    duplicateSlotRejected = true;
  }
  if (!duplicateSlotRejected) throw new Error("A durable image job cannot create the same paid slot twice");
  await db.exec(`
    insert into blog_post_images (post_id, role, slot, source, image_job_id)
    values (1, 'inline', 'inline:1', 'ai', 1)
  `);

  const admittedJob = await db.query(`
    update blog_image_generation_jobs
    set status = 'queued'
    where id = 1 and status = 'admitting'
    returning id
  `);
  if (admittedJob.rows.length !== 1) throw new Error("Exactly one request must admit the image job");
  const workerClaims = await Promise.all([
    db.query(`update blog_image_generation_jobs set status = 'running' where id = 1 and status = 'queued' returning id`),
    db.query(`update blog_image_generation_jobs set status = 'running' where id = 1 and status = 'queued' returning id`),
  ]);
  if (workerClaims.reduce((total, claim) => total + claim.rows.length, 0) !== 1) {
    throw new Error("Two workers must not claim the same durable image job");
  }

  await db.exec(`
    update blog_post_images set generation_status = 'generating' where image_job_id = 1 and slot = 'hero';
    update blog_image_generation_jobs set heartbeat_at = now() - interval '10 minutes' where id = 1;
    update blog_image_generation_jobs set status = 'queued' where id = 1 and status = 'running' and heartbeat_at < now() - interval '3 minutes';
    update blog_post_images set generation_status = 'failed', error_code = 'generation_interrupted'
    where image_job_id = 1 and generation_status = 'generating';
  `);
  const recoveredSlots = await db.query(`
    select slot, generation_status from blog_post_images where image_job_id = 1 order by slot
  `);
  const recoveredBySlot = new Map(recoveredSlots.rows.map(row => [String(row.slot), String(row.generation_status)]));
  if (recoveredBySlot.get("hero") !== "failed" || recoveredBySlot.get("inline:1") !== "pending") {
    throw new Error("Stale recovery must fail the in-flight slot and preserve only untouched pending work");
  }
  await db.exec(`update blog_image_generation_jobs set status = 'running' where id = 1 and status = 'queued'`);
  const retriedChargedSlot = await db.query(`
    update blog_post_images set generation_status = 'generating'
    where image_job_id = 1 and slot = 'hero' and generation_status = 'pending'
    returning id
  `);
  const resumedPendingSlot = await db.query(`
    update blog_post_images set generation_status = 'generating'
    where image_job_id = 1 and slot = 'inline:1' and generation_status = 'pending'
    returning id
  `);
  if (retriedChargedSlot.rows.length !== 0 || resumedPendingSlot.rows.length !== 1) {
    throw new Error("Recovery must resume only the pending slot without retrying the possibly charged slot");
  }

  console.log(JSON.stringify({
    ok: true,
    migrations: migrationFiles,
    drizzleMigrations: drizzleMigrations.length,
    statements: statements.length,
    tables: actualTables.length,
    foreignKeys,
    orderedBlogTags: "pass",
    contactInsert: "pass",
    webAlertDurableDedupe: "pass",
    imageJobIdempotency: "pass",
    imageJobSingleOpenPost: "pass",
    imageJobUniqueSlot: "pass",
    imageJobAdmissionGate: "pass",
    imageJobSingleWorker: "pass",
    imageJobStaleRecovery: "pass",
    translationSiblingUnique: "pass",
    translationIndependentPublish: "pass",
  }));
} finally {
  await db.close();
}
