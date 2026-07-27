import { and, asc, eq, inArray } from "drizzle-orm";
import {
  blogPostImages,
  blogPosts,
  type BlogPostImage,
  type InsertBlogPostImage,
} from "@shared/schema";
import { isManagedBlogImagePublicUrl } from "@shared/blog-images";
import { db } from "../../db";
import type { BlogPostWithRelations } from "../storage";

export async function listBlogPostImages(postId: number): Promise<BlogPostImage[]> {
  return db
    .select()
    .from(blogPostImages)
    .where(eq(blogPostImages.postId, postId))
    .orderBy(asc(blogPostImages.sortOrder), asc(blogPostImages.createdAt));
}

export async function getBlogPostImage(imageId: number): Promise<BlogPostImage | undefined> {
  const [image] = await db
    .select()
    .from(blogPostImages)
    .where(eq(blogPostImages.id, imageId))
    .limit(1);
  return image;
}

export async function getBlogPostImageByObjectKey(objectKey: string): Promise<BlogPostImage | undefined> {
  const [image] = await db
    .select()
    .from(blogPostImages)
    .where(eq(blogPostImages.objectKey, objectKey))
    .limit(1);
  return image;
}

export async function getSelectedBlogPostImages(postId: number): Promise<BlogPostImage[]> {
  return db
    .select()
    .from(blogPostImages)
    .where(and(
      eq(blogPostImages.postId, postId),
      eq(blogPostImages.reviewStatus, "selected"),
      eq(blogPostImages.generationStatus, "completed"),
    ))
    .orderBy(asc(blogPostImages.sortOrder), asc(blogPostImages.createdAt));
}

export async function createBlogPostImage(values: InsertBlogPostImage): Promise<BlogPostImage> {
  const [created] = await db.insert(blogPostImages).values(values).returning();
  return created;
}

export async function createDraftBlogPostImage(values: InsertBlogPostImage): Promise<BlogPostImage> {
  return db.transaction(async tx => {
    const [post] = await tx
      .select({ id: blogPosts.id, status: blogPosts.status })
      .from(blogPosts)
      .where(eq(blogPosts.id, values.postId))
      .limit(1)
      .for("update");
    if (!post) {
      throw Object.assign(new Error("Blog post not found"), { statusCode: 404 });
    }
    if (post.status !== "draft") {
      throw Object.assign(new Error("Blog image changes are allowed only while the post is a draft"), {
        statusCode: 409,
      });
    }
    const [created] = await tx.insert(blogPostImages).values(values).returning();
    return created;
  });
}

export async function updateBlogPostImage(
  imageId: number,
  values: Partial<InsertBlogPostImage>,
): Promise<BlogPostImage | undefined> {
  const [updated] = await db
    .update(blogPostImages)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(blogPostImages.id, imageId))
    .returning();
  return updated;
}

export async function updateDraftBlogPostImage(
  postId: number,
  imageId: number,
  values: Partial<InsertBlogPostImage>,
): Promise<BlogPostImage | undefined> {
  return db.transaction(async tx => {
    const [post] = await tx
      .select({ id: blogPosts.id, status: blogPosts.status })
      .from(blogPosts)
      .where(eq(blogPosts.id, postId))
      .limit(1)
      .for("update");
    if (!post || post.status !== "draft") return undefined;
    const [updated] = await tx
      .update(blogPostImages)
      .set({ ...values, updatedAt: new Date() })
      .where(and(
        eq(blogPostImages.id, imageId),
        eq(blogPostImages.postId, postId),
      ))
      .returning();
    return updated;
  });
}

export async function deleteBlogPostImageRow(imageId: number): Promise<boolean> {
  const deleted = await db
    .delete(blogPostImages)
    .where(eq(blogPostImages.id, imageId))
    .returning({ id: blogPostImages.id });
  return deleted.length > 0;
}

export async function selectBlogPostImage(
  postId: number,
  imageId: number,
): Promise<BlogPostImage | undefined> {
  return db.transaction(async tx => {
    const [post] = await tx
      .select({ id: blogPosts.id, status: blogPosts.status })
      .from(blogPosts)
      .where(eq(blogPosts.id, postId))
      .limit(1)
      .for("update");
    if (!post || post.status !== "draft") return undefined;

    const [image] = await tx
      .select()
      .from(blogPostImages)
      .where(and(
        eq(blogPostImages.id, imageId),
        eq(blogPostImages.postId, postId),
      ))
      .limit(1)
      .for("update");
    if (
      !image
      || image.reviewStatus !== "candidate"
      || image.generationStatus !== "completed"
      || !image.publicUrl
    ) return undefined;

    await tx
      .update(blogPostImages)
      .set({ reviewStatus: "candidate", updatedAt: new Date() })
      .where(and(
        eq(blogPostImages.postId, image.postId),
        eq(blogPostImages.slot, image.slot),
        eq(blogPostImages.reviewStatus, "selected"),
      ));

    const [selected] = await tx
      .update(blogPostImages)
      .set({ reviewStatus: "selected", updatedAt: new Date() })
      .where(and(
        eq(blogPostImages.id, image.id),
        eq(blogPostImages.reviewStatus, "candidate"),
      ))
      .returning();
    if (!selected) return undefined;

    if (selected.role === "hero") {
      await tx
        .update(blogPosts)
        .set({
          featuredImage: selected.publicUrl,
          featuredImageAlt: selected.alt,
          updatedAt: new Date(),
        })
        .where(eq(blogPosts.id, selected.postId));
    }
    return selected;
  });
}

export async function deselectInlineBlogPostImage(
  postId: number,
  imageId: number,
): Promise<BlogPostImage | undefined> {
  return db.transaction(async tx => {
    const [post] = await tx
      .select({ id: blogPosts.id, status: blogPosts.status })
      .from(blogPosts)
      .where(eq(blogPosts.id, postId))
      .limit(1)
      .for("update");
    if (!post || post.status !== "draft") return undefined;

    const [image] = await tx
      .update(blogPostImages)
      .set({ reviewStatus: "candidate", updatedAt: new Date() })
      .where(and(
        eq(blogPostImages.id, imageId),
        eq(blogPostImages.postId, postId),
        eq(blogPostImages.role, "inline"),
        eq(blogPostImages.reviewStatus, "selected"),
      ))
      .returning();
    return image;
  });
}

export async function claimBlogPostImageForDeletion(
  postId: number,
  imageId: number,
): Promise<BlogPostImage | undefined> {
  return db.transaction(async tx => {
    const [post] = await tx
      .select({ id: blogPosts.id, status: blogPosts.status })
      .from(blogPosts)
      .where(eq(blogPosts.id, postId))
      .limit(1)
      .for("update");
    if (!post || post.status !== "draft") return undefined;

    const [claimed] = await tx
      .update(blogPostImages)
      .set({
        reviewStatus: "rejected",
        errorCode: "deletion_pending",
        errorMessage: null,
        updatedAt: new Date(),
      })
      .where(and(
        eq(blogPostImages.id, imageId),
        eq(blogPostImages.postId, postId),
        eq(blogPostImages.source, "ai"),
        inArray(blogPostImages.generationStatus, ["completed", "failed"]),
        inArray(blogPostImages.reviewStatus, ["candidate", "rejected"]),
      ))
      .returning();
    return claimed;
  });
}

export async function finalizeBlogPostImageDeletion(
  postId: number,
  imageId: number,
): Promise<boolean> {
  return db.transaction(async tx => {
    const [post] = await tx
      .select({ id: blogPosts.id, status: blogPosts.status })
      .from(blogPosts)
      .where(eq(blogPosts.id, postId))
      .limit(1)
      .for("update");
    if (!post || post.status !== "draft") return false;
    const deleted = await tx
      .delete(blogPostImages)
      .where(and(
        eq(blogPostImages.id, imageId),
        eq(blogPostImages.postId, postId),
        eq(blogPostImages.reviewStatus, "rejected"),
        eq(blogPostImages.errorCode, "deletion_pending"),
      ))
      .returning({ id: blogPostImages.id });
    return deleted.length > 0;
  });
}

export async function ensureCuratedHeroImage(post: BlogPostWithRelations): Promise<BlogPostImage | undefined> {
  if (!post.featuredImage) return undefined;
  const images = await listBlogPostImages(post.id);
  const selected = images.find(image => image.slot === "hero" && image.reviewStatus === "selected");
  if (selected?.publicUrl === post.featuredImage) {
    if (selected.alt !== post.featuredImageAlt) {
      return updateDraftBlogPostImage(post.id, selected.id, { alt: post.featuredImageAlt });
    }
    return selected;
  }

  if (isManagedBlogImagePublicUrl(post.featuredImage)) {
    const matchingManaged = images.find(image =>
      image.slot === "hero"
      && image.publicUrl === post.featuredImage
      && image.generationStatus === "completed");
    if (matchingManaged?.reviewStatus === "candidate") {
      return selectBlogPostImage(post.id, matchingManaged.id);
    }
    return matchingManaged || selected;
  }

  const curated = images.find(image => image.slot === "hero" && image.source === "curated");
  if (curated) {
    const updated = await updateDraftBlogPostImage(post.id, curated.id, {
      publicUrl: post.featuredImage,
      alt: post.featuredImageAlt,
      generationStatus: "completed",
      completedAt: curated.completedAt || new Date(),
      errorCode: null,
      errorMessage: null,
    });
    if (updated?.reviewStatus === "candidate") {
      return selectBlogPostImage(post.id, updated.id);
    }
    return updated;
  }

  try {
    const created = await createDraftBlogPostImage({
      postId: post.id,
      role: "hero",
      slot: "hero",
      anchorHeading: null,
      source: "curated",
      generationStatus: "completed",
      reviewStatus: selected ? "candidate" : "selected",
      objectKey: null,
      publicUrl: post.featuredImage,
      mimeType: null,
      width: null,
      height: null,
      bytes: null,
      checksum: null,
      alt: post.featuredImageAlt,
      caption: null,
      safeVisualBrief: "Existing curated Healing Minds image retained as the durable fallback.",
      prompt: null,
      promptVersion: null,
      provider: null,
      model: null,
      generationRunId: null,
      startedAt: null,
      completedAt: new Date(),
      durationMs: null,
      errorCode: null,
      errorMessage: null,
      sortOrder: 0,
    });
    return selected ? selectBlogPostImage(post.id, created.id) : created;
  } catch (error) {
    if ((error as { code?: string }).code === "23505") {
      return (await listBlogPostImages(post.id))
        .find(image => image.slot === "hero" && image.source === "curated");
    }
    throw error;
  }
}
