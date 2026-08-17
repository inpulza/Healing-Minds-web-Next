import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = relativePath => fs.readFileSync(path.join(root, relativePath), "utf8");

test("the complete available image set synchronizes in either language without another AI request", () => {
  const route = read("app/api/admin/blog/[[...path]]/route.ts");
  const legacyRoute = read("server/blog/images/routes.ts");
  const client = read("client/src/pages/admin/BlogAdminPage.tsx");
  const service = read("server/blog/images/service.ts");
  const synchronizationFunctions = service.slice(
    service.indexOf("async function copyAvailableBlogImages"),
    service.indexOf("function assertBlogImageInputsSafe"),
  );

  assert.match(route, /reconcile-sibling[\s\S]*reconcileBilingualBlogImages/);
  assert.match(route, /select[\s\S]*syncSelectedBlogImagesToDraftSibling/);
  assert.match(route, /deselect[\s\S]*syncSelectedBlogImagesToDraftSibling/);
  assert.match(legacyRoute, /reconcile-sibling[\s\S]*reconcileBilingualBlogImages/);
  assert.match(client, /reconcileSiblingImagesMutation\.mutate/);
  assert.match(client, /handledImageJobIdRef[\s\S]*reconciledImagePairRef\.current = null[\s\S]*reconcileSiblingImagesMutation\.mutate/);
  assert.match(client, /hasOpenSiblingPair && reconcileSiblingImagesMutation\.isPending[\s\S]*handledImageJobIdRef\.current = imageJob\.id/);
  assert.match(client, /featuredImage: data\.data\.post\.featuredImage \?\? ''[\s\S]*featuredImageAlt: data\.data\.post\.featuredImageAlt \?\? ''/);
  assert.doesNotMatch(client, /Reuse approved images from/);
  assert.match(client, /No new AI image request was sent/);
  assert.match(synchronizationFunctions, /getSelectedBlogPostImages/);
  assert.match(synchronizationFunctions, /downloadBlogImage/);
  assert.match(synchronizationFunctions, /uploadBlogImage/);
  assert.match(synchronizationFunctions, /buildObjectKey\(target\.id/);
  assert.match(synchronizationFunctions, /currentPriority > siblingPriority/);
  assert.match(synchronizationFunctions, /current\.createdAt\.getTime\(\) < sibling\.createdAt\.getTime\(\)/);
  assert.match(synchronizationFunctions, /target\.status !== "draft"/);
  assert.doesNotMatch(synchronizationFunctions, /no approved images to synchronize/);
  assert.doesNotMatch(synchronizationFunctions, /generateImageWithOpenAi/);
});

test("sibling image parity is authoritative, draft-only, atomic and independently cleanable", () => {
  const storage = read("server/blog/images/storage.ts");
  const service = read("server/blog/images/service.ts");
  const synchronizationFunctions = service.slice(
    service.indexOf("async function copyAvailableBlogImages"),
    service.indexOf("function assertBlogImageInputsSafe"),
  );
  assert.match(storage, /replaceDraftBlogImageSet[\s\S]*post\.status !== "draft"/);
  assert.match(storage, /expectedUpdatedAt[\s\S]*The draft changed while sibling images were being prepared/);
  assert.match(storage, /input\.authoritative[\s\S]*reviewStatus: "candidate"[\s\S]*reviewStatus: "selected"/);
  assert.match(storage, /for \(const candidate of input\.candidates\)[\s\S]*reviewStatus: "candidate"/);
  assert.match(storage, /staleObjectKeys[\s\S]*blogImageCleanupQueue[\s\S]*delete\(blogPostImages\)/);
  assert.match(storage, /featuredImage: null[\s\S]*featuredImageAlt: null/);
  assert.match(service, /candidateSourceImages[\s\S]*reviewStatus === "candidate"/);
  assert.match(synchronizationFunctions, /candidateCopies[\s\S]*replaceDraftBlogImageSet/);
  assert.doesNotMatch(synchronizationFunctions, /candidateSourceImages[\s\S]*createDraftBlogPostImage/);
  assert.match(service, /availableImageSignature[\s\S]*reviewStatus !== "rejected"/);
  assert.match(service, /hydrateManagedImageChecksums[\s\S]*crypto\.createHash\("sha256"\)/);
  assert.match(service, /image\.reviewStatus === "rejected"/);
  assert.match(service, /reservedTargetImageIds[\s\S]*!reservedTargetImageIds\.has\(image\.id\)/);
  assert.match(service, /slot: image\.slot[\s\S]*targetAnchors\[slotIndex\]/);
  assert.match(storage, /featuredImage: hero\.publicUrl/);
  assert.match(service, /authoritative: true/);
  assert.match(service, /pruneCandidates: true/);
  assert.match(service, /deleteBlogImageVariant[\s\S]*syncSelectedBlogImagesToDraftSibling\(post\)/);
  assert.match(service, /releaseBlogPostImageDeletionClaim/);
  assert.match(service, /cleanupUnregisteredSiblingCopies/);
  assert.match(service, /queueBlogImageCleanup/);
});

test("translation creation applies the available source image set to the new sibling draft", () => {
  const workflow = read("server/blog/translation/workflow.ts");
  assert.match(workflow, /createBlogTranslationSibling[\s\S]*syncSelectedBlogImagesToDraftSibling\(source\)/);
  assert.match(workflow, /approved-images-synchronized-without-generation/);
});

test("legacy translated SEO fields are normalized to the shared persistence limits", () => {
  const provider = read("server/blog/translation/provider.ts");
  const client = read("client/src/pages/admin/BlogAdminPage.tsx");
  assert.match(provider, /metaTitle: z\.string\(\)\.trim\(\)\.min\(5\)\.max\(60\)/);
  assert.match(provider, /truncateSeoText\(draft\.metaTitle, 60\)/);
  assert.match(provider, /Keep metaTitle at 60 characters or fewer/);
  assert.match(client, /metaTitle: truncateSeoText\(post\.metaTitle \|\| '', 60\)/);
  assert.match(client, /metaTitle: truncateSeoText\(form\.metaTitle, 60\)/);
});
