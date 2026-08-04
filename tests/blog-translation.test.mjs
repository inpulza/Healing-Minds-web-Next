import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import test from "node:test";

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("translation workflow is durable, draft-only and chained after source completion", () => {
  const workflow = read("server/blog/translation/workflow.ts");
  const admin = read("server/blog/admin-routes.ts");
  assert.match(workflow, /status: "draft"/);
  assert.match(workflow, /publishedAt: null/);
  assert.match(workflow, /sourcePreserved: Boolean\(source\)/);
  assert.match(workflow, /assertBlogTranslationSchemaReady\(\)[\s\S]*const targetLanguage/);
  assert.match(workflow, /requeueBlogGenerationRun/);
  assert.match(workflow, /translationKey\(source, targetLanguage\)/);
  assert.match(workflow, /refreshDraft[\s\S]*source\.updatedAt\.getTime\(\)/);
  assert.match(workflow, /replaceBlogTranslationSiblingDraft/);
  assert.match(workflow, /source\.updatedAt\.toISOString\(\) !== claimed\.input\.sourceUpdatedAt/);
  assert.match(workflow, /Only a draft sibling can be refreshed from its source/);
  assert.match(read("server/blog/translation/storage.ts"), /blog_translation_refresh_sibling_changed/);
  assert.match(admin, /completeBlogGenerationRun[\s\S]*queueBlogTranslation/);
  assert.match(admin, /updateCompletedBlogGenerationRunResult/);
  assert.match(read("app/api/admin/blog/[[...path]]/route.ts"), /generate-draft[\s\S]*queueBlogTranslation\(result\.data\.id\)/);
});

test("database contract prevents duplicate siblings and keeps publication independent", () => {
  const schema = read("shared/schema.ts");
  const migration = read("migrations/0004_bilingual_translation_siblings.sql");
  assert.match(schema, /uniqueIndex\("idx_blog_posts_translation_group_language"\)/);
  assert.match(migration, /CREATE UNIQUE INDEX "idx_blog_posts_translation_group_language"/);
  assert.match(read("scripts/verify-migration-pglite.mjs"), /Publishing one language must not publish its sibling/);
  assert.match(read("server/blog/translation/storage.ts"), /blog_translation_migration_required/);
});

test("provider normalizes SEO metadata, preserves mapped links and rejects invented URLs", () => {
  const script = `
    import assert from 'node:assert/strict';
    import { assertTranslationLinkContract, normalizeBlogTranslationDraft, translateBlogPostWithAi } from './server/blog/translation/provider.ts';
    const sourceHtml = '<h2>Care</h2><p><a href="/services">Care</a> <a href="https://www.nimh.nih.gov/health/topics/depression">Source</a></p><p>Educational only.</p>';
    const mapped = { '/services': '/es/servicios', 'https://www.nimh.nih.gov/health/topics/depression': 'https://www.nimh.nih.gov/health/publications/espanol/depresion' };
    assert.doesNotThrow(() => assertTranslationLinkContract(sourceHtml, '<h2>Atencion</h2><p><a href="/es/servicios">Atencion</a> <a href="https://www.nimh.nih.gov/health/publications/espanol/depresion">Fuente</a></p>', mapped, []));
    assert.throws(() => assertTranslationLinkContract(sourceHtml, '<a href="https://invented.invalid/es">X</a>', mapped, []), /invented/i);
    process.env.OPENAI_API_KEY = 'test-only';
    globalThis.fetch = async () => new Response(JSON.stringify({ choices: [{ finish_reason: 'stop', message: { content: JSON.stringify({
      title: 'Entender la depresion', slug: 'entender-la-depresion', excerpt: 'Una guia educativa y conservadora para pacientes.',
      contentHtml: '<h2>Atencion</h2><p><a href="/es/servicios">Atencion</a> <a href="https://www.nimh.nih.gov/health/publications/espanol/depresion">Fuente</a></p><p>Este contenido es educativo y no sustituye la evaluacion profesional.</p>',
      metaTitle: 'Entender la depresion y reconocer cuando conviene buscar evaluacion profesional especializada', metaDescription: 'Informacion educativa sobre depresion, sus sintomas, la evaluacion profesional y las opciones de apoyo que pueden ayudar a una persona a reconocer cuando conviene buscar atencion de salud mental.',
      featuredImageAlt: 'Persona conversando con un profesional', targetKeyword: 'depresion', expertiseAngle: 'Educacion conservadora'
    }) } }] }), { status: 200, headers: { 'content-type': 'application/json' } });
    const translated = await translateBlogPostWithAi({
      source: { title: 'Understanding depression', slug: 'understanding-depression', excerpt: 'An educational guide.', content: sourceHtml, metaTitle: 'Understanding depression', metaDescription: 'Educational information.', featuredImageAlt: 'Person talking to a professional', targetKeyword: 'depression', expertiseAngle: 'Conservative education' },
      targetLanguage: 'es', linkMap: mapped, targetSourceUrls: []
    });
    assert.equal(translated.slug, 'entender-la-depresion');
    assert.ok(translated.metaTitle.length <= 70);
    assert.ok(translated.metaDescription.length <= 160);
    assert.equal(translated.metaTitle, 'Entender la depresion y reconocer cuando conviene buscar evaluacion');
    assert.equal(translated.metaDescription, 'Informacion educativa sobre depresion, sus sintomas, la evaluacion profesional y las opciones de apoyo que pueden ayudar a una persona a reconocer cuando');
    assert.throws(() => normalizeBlogTranslationDraft({}), error => {
      assert.equal(error.code, 'blog_translation_invalid_draft');
      assert.doesNotMatch(error.message, /too_big|Zod|path/);
      return true;
    });
  `;
  execFileSync(process.execPath, ["--import", "tsx", "--input-type=module", "-e", script], {
    cwd: new URL("..", import.meta.url),
    stdio: "pipe",
  });
});

test("public loaders, sitemap and hreflang remain published-only", () => {
  assert.match(read("server/blog/storage.ts"), /status = "published"/);
  assert.match(read("app/sitemap.ts"), /getBlogPosts\(\{ status: "published"/);
  const storage = read("server/blog/storage.ts");
  assert.match(storage, /getPostTranslations[\s\S]*eq\(blogPosts\.status, "published"\)/);
  assert.match(read("server/blog/sitemap-entries.mjs"), /postsByTranslationGroup/);
});
