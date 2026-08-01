import { and, asc, desc, eq, inArray, lt } from "drizzle-orm";
import {
  blogImageGenerationJobs,
  blogPostImages,
  blogPosts,
  type BlogImageGenerationJob,
  type BlogImageGenerationJobStatus,
  type BlogImageGenerationOperation,
  type BlogPostImage,
  type InsertBlogPostImage,
} from "@shared/schema";
import { db } from "../../db";

export type CreateBlogImageGenerationJobInput = {
  postId: number;
  idempotencyKey: string;
  operation: BlogImageGenerationOperation;
  role: "hero" | "inline" | "all";
  maxInline: number;
  sourceImageId?: number | null;
  initialResult?: Record<string, unknown>;
  slots: Array<Omit<InsertBlogPostImage, "imageJobId">>;
};

function assertMatchingImageJob(
  job: BlogImageGenerationJob,
  input: CreateBlogImageGenerationJobInput,
): void {
  if (
    job.postId !== input.postId
    || job.operation !== input.operation
    || job.role !== input.role
    || job.maxInline !== input.maxInline
    || (job.sourceImageId || null) !== (input.sourceImageId || null)
  ) {
    throw Object.assign(
      new Error("Idempotency key was already used for a different blog image request"),
      { statusCode: 409, code: "blog_image_job_idempotency_mismatch" },
    );
  }
}

export async function getBlogImageGenerationJob(
  jobId: number,
): Promise<BlogImageGenerationJob | undefined> {
  const [job] = await db
    .select()
    .from(blogImageGenerationJobs)
    .where(eq(blogImageGenerationJobs.id, jobId))
    .limit(1);
  return job;
}

export async function getBlogImageGenerationJobByKey(
  idempotencyKey: string,
): Promise<BlogImageGenerationJob | undefined> {
  const [job] = await db
    .select()
    .from(blogImageGenerationJobs)
    .where(eq(blogImageGenerationJobs.idempotencyKey, idempotencyKey))
    .limit(1);
  return job;
}

export async function getLatestBlogImageGenerationJobForPost(
  postId: number,
): Promise<BlogImageGenerationJob | undefined> {
  const [job] = await db
    .select()
    .from(blogImageGenerationJobs)
    .where(eq(blogImageGenerationJobs.postId, postId))
    .orderBy(desc(blogImageGenerationJobs.createdAt), desc(blogImageGenerationJobs.id))
    .limit(1);
  return job;
}

export async function getOpenBlogImageGenerationJobForPost(
  postId: number,
): Promise<BlogImageGenerationJob | undefined> {
  const [job] = await db
    .select()
    .from(blogImageGenerationJobs)
    .where(and(
      eq(blogImageGenerationJobs.postId, postId),
      inArray(blogImageGenerationJobs.status, ["admitting", "queued", "running"]),
    ))
    .orderBy(desc(blogImageGenerationJobs.createdAt), desc(blogImageGenerationJobs.id))
    .limit(1);
  return job;
}

export async function createBlogImageGenerationJobIfAbsent(
  input: CreateBlogImageGenerationJobInput,
): Promise<{ job: BlogImageGenerationJob; created: boolean }> {
  try {
    return await db.transaction(async tx => {
      const [post] = await tx
        .select({ id: blogPosts.id, status: blogPosts.status })
        .from(blogPosts)
        .where(eq(blogPosts.id, input.postId))
        .limit(1)
        .for("update");
      if (!post) throw Object.assign(new Error("Blog post not found"), { statusCode: 404 });
      if (post.status !== "draft") {
        throw Object.assign(new Error("Blog image changes are allowed only while the post is a draft"), {
          statusCode: 409,
        });
      }

      const [created] = await tx
        .insert(blogImageGenerationJobs)
        .values({
          postId: input.postId,
          idempotencyKey: input.idempotencyKey,
          operation: input.operation,
          role: input.role,
          maxInline: input.maxInline,
          sourceImageId: input.sourceImageId || null,
          result: input.initialResult,
          heartbeatAt: new Date(),
        })
        .onConflictDoNothing({ target: blogImageGenerationJobs.idempotencyKey })
        .returning();

      if (!created) {
        const [existing] = await tx
          .select()
          .from(blogImageGenerationJobs)
          .where(eq(blogImageGenerationJobs.idempotencyKey, input.idempotencyKey))
          .limit(1);
        if (!existing) throw new Error("Blog image job conflict could not be resolved");
        assertMatchingImageJob(existing, input);
        return { job: existing, created: false };
      }

      if (input.slots.length > 0) {
        await tx.insert(blogPostImages).values(input.slots.map(slot => ({
          ...slot,
          imageJobId: created.id,
        })));
      }
      return { job: created, created: true };
    });
  } catch (error) {
    if ((error as { code?: string }).code !== "23505") throw error;

    const existing = await getBlogImageGenerationJobByKey(input.idempotencyKey);
    if (existing) {
      assertMatchingImageJob(existing, input);
      return { job: existing, created: false };
    }
    const open = await getOpenBlogImageGenerationJobForPost(input.postId);
    throw Object.assign(
      new Error(open
        ? `Image generation job ${open.id} is already ${open.status}. Reopen it instead of starting another paid request.`
        : "Another image generation job started at the same time. Reopen it instead of starting another paid request."),
      {
        statusCode: 409,
        code: "blog_image_job_conflict",
        openJobId: open?.id,
      },
    );
  }
}

export async function listBlogImageJobSlots(jobId: number): Promise<BlogPostImage[]> {
  return db
    .select()
    .from(blogPostImages)
    .where(eq(blogPostImages.imageJobId, jobId))
    .orderBy(asc(blogPostImages.sortOrder), asc(blogPostImages.id));
}

export async function claimBlogImageGenerationJob(
  jobId: number,
): Promise<BlogImageGenerationJob | undefined> {
  const now = new Date();
  const [job] = await db
    .update(blogImageGenerationJobs)
    .set({
      status: "running",
      startedAt: now,
      heartbeatAt: now,
      updatedAt: now,
    })
    .where(and(
      eq(blogImageGenerationJobs.id, jobId),
      eq(blogImageGenerationJobs.status, "queued"),
    ))
    .returning();
  return job;
}

export async function admitBlogImageGenerationJob(
  jobId: number,
): Promise<BlogImageGenerationJob | undefined> {
  const now = new Date();
  const [job] = await db
    .update(blogImageGenerationJobs)
    .set({
      status: "queued",
      heartbeatAt: now,
      updatedAt: now,
    })
    .where(and(
      eq(blogImageGenerationJobs.id, jobId),
      eq(blogImageGenerationJobs.status, "admitting"),
    ))
    .returning();
  return job;
}

export async function expireStaleBlogImageJobAdmission(
  jobId: number,
  staleBefore = new Date(Date.now() - 2 * 60 * 1000),
): Promise<BlogImageGenerationJob | undefined> {
  return db.transaction(async tx => {
    const [current] = await tx
      .select()
      .from(blogImageGenerationJobs)
      .where(and(
        eq(blogImageGenerationJobs.id, jobId),
        eq(blogImageGenerationJobs.status, "admitting"),
        lt(blogImageGenerationJobs.createdAt, staleBefore),
      ))
      .limit(1)
      .for("update");
    if (!current) return undefined;

    const now = new Date();
    const message = "Image generation admission expired safely before any provider call was allowed.";
    await tx
      .update(blogPostImages)
      .set({
        generationStatus: "failed",
        completedAt: now,
        errorCode: "admission_expired",
        errorMessage: message,
        updatedAt: now,
      })
      .where(and(
        eq(blogPostImages.imageJobId, jobId),
        eq(blogPostImages.generationStatus, "pending"),
      ));
    const [expired] = await tx
      .update(blogImageGenerationJobs)
      .set({
        status: "failed",
        result: {
          ...(current.result || {}),
          errorCode: "admission_expired",
          errorMessage: message,
        },
        heartbeatAt: now,
        completedAt: now,
        updatedAt: now,
      })
      .where(and(
        eq(blogImageGenerationJobs.id, jobId),
        eq(blogImageGenerationJobs.status, "admitting"),
      ))
      .returning();
    return expired;
  });
}

export async function heartbeatBlogImageGenerationJob(jobId: number): Promise<void> {
  const now = new Date();
  await db
    .update(blogImageGenerationJobs)
    .set({ heartbeatAt: now, updatedAt: now })
    .where(and(
      eq(blogImageGenerationJobs.id, jobId),
      eq(blogImageGenerationJobs.status, "running"),
    ));
}

export async function claimPendingBlogImageJobSlot(
  jobId: number,
  imageId: number,
): Promise<BlogPostImage | undefined> {
  const now = new Date();
  const [image] = await db
    .update(blogPostImages)
    .set({
      generationStatus: "generating",
      startedAt: now,
      completedAt: null,
      errorCode: null,
      errorMessage: null,
      updatedAt: now,
    })
    .where(and(
      eq(blogPostImages.id, imageId),
      eq(blogPostImages.imageJobId, jobId),
      eq(blogPostImages.generationStatus, "pending"),
    ))
    .returning();
  return image;
}

export async function updateBlogImageGenerationJobProgress(
  jobId: number,
  result: Record<string, unknown>,
): Promise<void> {
  const now = new Date();
  await db
    .update(blogImageGenerationJobs)
    .set({ result, heartbeatAt: now, updatedAt: now })
    .where(and(
      eq(blogImageGenerationJobs.id, jobId),
      eq(blogImageGenerationJobs.status, "running"),
    ));
}

export async function completeBlogImageGenerationJob(
  jobId: number,
  status: Extract<BlogImageGenerationJobStatus, "completed" | "partial_failed" | "failed">,
  result: Record<string, unknown>,
): Promise<BlogImageGenerationJob | undefined> {
  const now = new Date();
  const [job] = await db
    .update(blogImageGenerationJobs)
    .set({
      status,
      result,
      heartbeatAt: now,
      completedAt: now,
      updatedAt: now,
    })
    .where(and(
      eq(blogImageGenerationJobs.id, jobId),
      inArray(blogImageGenerationJobs.status, ["queued", "running"]),
    ))
    .returning();
  return job;
}

export async function failBlogImageGenerationJob(
  jobId: number,
  code: string,
  message: string,
): Promise<BlogImageGenerationJob | undefined> {
  return db.transaction(async tx => {
    const now = new Date();
    await tx
      .update(blogPostImages)
      .set({
        generationStatus: "failed",
        completedAt: now,
        errorCode: code,
        errorMessage: message.slice(0, 1000),
        updatedAt: now,
      })
      .where(and(
        eq(blogPostImages.imageJobId, jobId),
        inArray(blogPostImages.generationStatus, ["pending", "generating"]),
      ));
    const [job] = await tx
      .update(blogImageGenerationJobs)
      .set({
        status: "failed",
        result: { errorCode: code, errorMessage: message.slice(0, 1000) },
        heartbeatAt: now,
        completedAt: now,
        updatedAt: now,
      })
      .where(and(
        eq(blogImageGenerationJobs.id, jobId),
        inArray(blogImageGenerationJobs.status, ["admitting", "queued", "running"]),
      ))
      .returning();
    return job;
  });
}

export async function requeueBlogImageGenerationJobAfterWorkerError(
  jobId: number,
  message: string,
): Promise<BlogImageGenerationJob | undefined> {
  return db.transaction(async tx => {
    const [current] = await tx
      .select()
      .from(blogImageGenerationJobs)
      .where(and(
        eq(blogImageGenerationJobs.id, jobId),
        eq(blogImageGenerationJobs.status, "running"),
      ))
      .limit(1)
      .for("update");
    if (!current) return undefined;

    const now = new Date();
    await tx
      .update(blogPostImages)
      .set({
        generationStatus: "failed",
        completedAt: now,
        errorCode: "generation_interrupted",
        errorMessage: "This slot was in progress when the worker stopped. It was not charged again automatically.",
        updatedAt: now,
      })
      .where(and(
        eq(blogPostImages.imageJobId, jobId),
        eq(blogPostImages.generationStatus, "generating"),
      ));

    const [requeued] = await tx
      .update(blogImageGenerationJobs)
      .set({
        status: "queued",
        result: {
          ...(current.result || {}),
          recoveryWarning: message.slice(0, 1000),
        },
        heartbeatAt: now,
        updatedAt: now,
      })
      .where(and(
        eq(blogImageGenerationJobs.id, jobId),
        eq(blogImageGenerationJobs.status, "running"),
      ))
      .returning();
    return requeued;
  });
}

export async function recoverStaleBlogImageGenerationJob(
  jobId: number,
  staleBefore = new Date(Date.now() - 3 * 60 * 1000),
): Promise<BlogImageGenerationJob | undefined> {
  return db.transaction(async tx => {
    const [current] = await tx
      .select()
      .from(blogImageGenerationJobs)
      .where(and(
        eq(blogImageGenerationJobs.id, jobId),
        eq(blogImageGenerationJobs.status, "running"),
        lt(blogImageGenerationJobs.heartbeatAt, staleBefore),
      ))
      .limit(1)
      .for("update");
    if (!current) return undefined;

    const now = new Date();
    const [recovered] = await tx
      .update(blogImageGenerationJobs)
      .set({
        status: "queued",
        result: {
          ...(current.result || {}),
          recoveryWarning: "The previous worker stopped responding. Only untouched image slots will resume.",
        },
        heartbeatAt: now,
        updatedAt: now,
      })
      .where(and(
        eq(blogImageGenerationJobs.id, jobId),
        eq(blogImageGenerationJobs.status, "running"),
        lt(blogImageGenerationJobs.heartbeatAt, staleBefore),
      ))
      .returning();
    if (!recovered) return undefined;

    await tx
      .update(blogPostImages)
      .set({
        generationStatus: "failed",
        completedAt: now,
        errorCode: "generation_interrupted",
        errorMessage: "This slot was in progress when the worker stopped. It was not charged again automatically.",
        updatedAt: now,
      })
      .where(and(
        eq(blogPostImages.imageJobId, jobId),
        eq(blogPostImages.generationStatus, "generating"),
      ));
    return recovered;
  });
}
