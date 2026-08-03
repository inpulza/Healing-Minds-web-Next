import type { BlogGenerationRun } from "@shared/schema";
import { selectRuntimeBlogResearchSources } from "../links/runtime";
import { estimateReadingTime, sanitizeBlogContentHtml } from "../sanitize";
import {
  getBlogCategories,
  getBlogPostById,
  getBlogTags,
  type BlogLanguage,
  type BlogPostWithRelations,
} from "../storage";
import { buildTopicKey } from "../ai/topic-normalization";
import { getHealingMindsCategory, inferHealingMindsCategoryKey } from "../strategy/healing-minds";
import {
  appendBlogGenerationEvent,
  claimBlogGenerationRun,
  completeBlogGenerationRun,
  createBlogGenerationRunIfAbsent,
  failBlogGenerationRun,
  getBlogGenerationRunByIdempotencyKey,
  getOpenBlogGenerationRun,
  queuePreparedBlogGenerationRun,
  requeueBlogGenerationRun,
} from "../generation/storage";
import type { JsonObject } from "../generation/types";
import { buildBlogTranslationLinkMap, preferCuratedTargetLanguageSources } from "./links";
import { translateBlogPostWithAi } from "./provider";
import { createBlogTranslationSibling, getBlogTranslationSibling } from "./storage";

function json(value: unknown): JsonObject {
  return JSON.parse(JSON.stringify(value)) as JsonObject;
}

function targetFor(source: Pick<BlogPostWithRelations, "language">): BlogLanguage {
  return source.language === "en" ? "es" : "en";
}

function translationKey(source: Pick<BlogPostWithRelations, "translationGroupId">, targetLanguage: BlogLanguage): string {
  return `blog-translation:${source.translationGroupId}:${targetLanguage}`;
}

export async function queueBlogTranslation(sourcePostId: number): Promise<{
  source: BlogPostWithRelations;
  sibling: BlogPostWithRelations | null;
  run: BlogGenerationRun | null;
  created: boolean;
}> {
  const source = await getBlogPostById(sourcePostId);
  if (!source) throw Object.assign(new Error("Source blog post not found"), { statusCode: 404 });
  const sibling = await getBlogTranslationSibling(source);
  if (sibling) return { source, sibling, run: null, created: false };
  const targetLanguage = targetFor(source);
  const idempotencyKey = translationKey(source, targetLanguage);
  const existing = await getBlogGenerationRunByIdempotencyKey(idempotencyKey);
  if (existing) {
    if (existing.status === "failed" || existing.status === "interrupted" || existing.status === "completed") {
      const open = await getOpenBlogGenerationRun();
      if (open && open.id !== existing.id) throw Object.assign(new Error(`Generation run ${open.id} is already ${open.status}`), { statusCode: 409 });
      const requeued = await requeueBlogGenerationRun(existing.id, existing.workflow ? json(existing.workflow) : undefined);
      return { source, sibling: null, run: requeued || existing, created: false };
    }
    return { source, sibling: null, run: existing, created: false };
  }
  const open = await getOpenBlogGenerationRun();
  if (open) throw Object.assign(new Error(`Generation run ${open.id} is already ${open.status}`), { statusCode: 409 });
  const workflow = json({
    mode: "translation",
    sourcePostId: source.id,
    sourceLanguage: source.language,
    targetLanguage,
    translationGroupId: source.translationGroupId,
    step: "queued",
  });
  const creation = await createBlogGenerationRunIfAbsent({
    idempotencyKey,
    input: json({ mode: "translation", sourcePostId: source.id, targetLanguage }),
    workflow,
  });
  const queued = creation.created ? await queuePreparedBlogGenerationRun(creation.run.id, workflow) : creation.run;
  if (!queued) throw Object.assign(new Error("Translation run could not be queued"), { statusCode: 409 });
  await appendBlogGenerationEvent({
    runId: queued.id,
    eventType: "progress",
    payload: json({ runId: queued.id, workflow }),
  });
  return { source, sibling: null, run: queued, created: creation.created };
}

export async function executePersistedBlogTranslationRun(runId: number): Promise<void> {
  const claimed = await claimBlogGenerationRun(runId);
  if (!claimed) return;
  const sourcePostId = Number(claimed.input.sourcePostId);
  const targetLanguage = claimed.input.targetLanguage === "es" ? "es" : "en";
  let source: BlogPostWithRelations | undefined;
  try {
    source = await getBlogPostById(sourcePostId);
    if (!source) throw Object.assign(new Error("Source blog post no longer exists"), { statusCode: 404 });
    const existing = await getBlogTranslationSibling(source);
    if (existing) {
      const response = json({ success: true, post: existing, created: false, sourcePostId, targetLanguage });
      await completeBlogGenerationRun(runId, { postId: existing.id, result: response });
      await appendBlogGenerationEvent({ runId, eventType: "complete", payload: response });
      return;
    }
    const workflow = json({ ...claimed.workflow, step: "translating" });
    await appendBlogGenerationEvent({ runId, eventType: "progress", payload: json({ runId, workflow }) });
    const categoryKey = inferHealingMindsCategoryKey(`${source.category?.slug || ""} ${source.category?.name || ""} ${source.title}`);
    const targetCategory = getHealingMindsCategory(categoryKey, targetLanguage);
    const [categories, tags, research, linkMap] = await Promise.all([
      getBlogCategories(targetLanguage),
      getBlogTags(targetLanguage),
      selectRuntimeBlogResearchSources({ topic: source.title, targetKeyword: source.targetKeyword || undefined, language: targetLanguage }),
      buildBlogTranslationLinkMap(source, targetLanguage),
    ]);
    const category = categories.find(item => item.slug === targetCategory.slug);
    if (!category) throw Object.assign(new Error(`Target category ${targetCategory.slug} is not seeded`), { statusCode: 409 });
    const tag = tags.find(item => item.slug === targetCategory.tag.slug);
    const targetSourceUrls = research.sources.map(item => item.url);
    const curatedLinkMap = preferCuratedTargetLanguageSources(linkMap, targetSourceUrls);
    const draft = await translateBlogPostWithAi({
      source,
      targetLanguage,
      linkMap: curatedLinkMap,
      targetSourceUrls,
    });
    const content = sanitizeBlogContentHtml(draft.contentHtml);
    const created = await createBlogTranslationSibling({
      title: draft.title,
      slug: draft.slug,
      language: targetLanguage,
      translationGroupId: source.translationGroupId,
      excerpt: draft.excerpt,
      content,
      featuredImage: source.featuredImage,
      featuredImageAlt: draft.featuredImageAlt,
      authorId: source.authorId,
      categoryId: category.id,
      status: "draft",
      isFeatured: false,
      metaTitle: draft.metaTitle,
      metaDescription: draft.metaDescription,
      readingTime: estimateReadingTime(content),
      topicKey: buildTopicKey(`${draft.title} ${draft.targetKeyword}`, targetLanguage),
      targetKeyword: draft.targetKeyword,
      contentPillar: source.contentPillar,
      patientStage: source.patientStage,
      contentFormat: source.contentFormat,
      searchIntent: source.searchIntent,
      expertiseAngle: draft.expertiseAngle,
      topicStrategyVersion: source.topicStrategyVersion,
      publishedAt: null,
      tagIds: tag ? [tag.id] : [],
    }, runId);
    const response = json({
      success: true,
      sourcePostId,
      post: created.post,
      created: created.created,
      targetLanguage,
      imagePolicy: source.featuredImage ? "reused-approved-neutral-image" : "no-image-no-automatic-visual-spend",
      requiresHumanReview: true,
      publication: "independent",
    });
    const completed = await completeBlogGenerationRun(runId, { postId: created.post.id, result: response });
    if (!completed) throw new Error("Translation run could not be completed");
    await appendBlogGenerationEvent({ runId, eventType: "complete", payload: response });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Blog translation failed";
    const failure = json({
      success: false,
      message,
      sourcePostId,
      sourcePreserved: Boolean(source),
      targetLanguage,
      recoverable: true,
    });
    await failBlogGenerationRun(runId, { error: message, result: failure });
    await appendBlogGenerationEvent({ runId, eventType: "failed", payload: failure }).catch(() => undefined);
  }
}
