import { and, asc, desc, eq, gt, inArray, isNull, lt, or, sql } from "drizzle-orm";
import { blogGenerationEvents, blogGenerationRuns } from "@shared/schema";
import { db } from "../../db";
import type {
  AppendGenerationEventInput,
  CompleteGenerationRunInput,
  CompletePlanningRunInput,
  CreateGenerationRunInput,
  FailGenerationRunInput,
  GenerationEvent,
  GenerationRun,
  ListGenerationEventsOptions,
  UpdateGenerationRunInput,
} from "./types";

export async function createBlogGenerationRun(
  values: CreateGenerationRunInput,
): Promise<GenerationRun> {
  return (await createBlogGenerationRunIfAbsent(values)).run;
}

export async function createBlogGenerationRunIfAbsent(
  values: CreateGenerationRunInput,
): Promise<{ run: GenerationRun; created: boolean }> {
  let created: GenerationRun | undefined;
  try {
    [created] = await db
      .insert(blogGenerationRuns)
      .values({
        idempotencyKey: values.idempotencyKey,
        input: values.input,
        workflow: values.workflow,
      })
      .onConflictDoNothing({ target: blogGenerationRuns.idempotencyKey })
      .returning();
  } catch (error) {
    if ((error as { code?: string }).code !== "23505") throw error;

    const existing = await getBlogGenerationRunByIdempotencyKey(values.idempotencyKey);
    if (existing) return { run: existing, created: false };

    throw Object.assign(
      new Error("Another generation or planning run started at the same time. Reopen it before trying again."),
      { statusCode: 409, code: "blog_generation_run_conflict" },
    );
  }

  if (created) return { run: created, created: true };

  const existing = await getBlogGenerationRunByIdempotencyKey(values.idempotencyKey);
  if (!existing) {
    throw new Error("Blog generation run conflict could not be resolved");
  }
  return { run: existing, created: false };
}

export async function getBlogGenerationRun(runId: number): Promise<GenerationRun | undefined> {
  const [run] = await db
    .select()
    .from(blogGenerationRuns)
    .where(eq(blogGenerationRuns.id, runId))
    .limit(1);
  return run;
}

export async function getBlogGenerationRunByIdempotencyKey(
  idempotencyKey: string,
): Promise<GenerationRun | undefined> {
  const [run] = await db
    .select()
    .from(blogGenerationRuns)
    .where(eq(blogGenerationRuns.idempotencyKey, idempotencyKey))
    .limit(1);
  return run;
}

export async function getOpenBlogGenerationRun(): Promise<GenerationRun | undefined> {
  const [run] = await db
    .select()
    .from(blogGenerationRuns)
    .where(inArray(blogGenerationRuns.status, ["planning", "queued", "running"]))
    .orderBy(desc(blogGenerationRuns.createdAt))
    .limit(1);
  return run;
}

export async function getAvailableCompletedBlogPlanningRun(
  runId: number,
): Promise<GenerationRun | undefined> {
  const [run] = await db
    .select()
    .from(blogGenerationRuns)
    .where(and(
      eq(blogGenerationRuns.id, runId),
      eq(blogGenerationRuns.status, "completed"),
      isNull(blogGenerationRuns.postId),
      sql`${blogGenerationRuns.input}->>'mode' = 'topic-plan'`,
    ))
    .limit(1);
  return run;
}

export async function queuePreparedBlogGenerationRun(
  runId: number,
  workflow: UpdateGenerationRunInput["workflow"],
): Promise<GenerationRun | undefined> {
  const now = new Date();
  const [queued] = await db
    .update(blogGenerationRuns)
    .set({
      status: "queued",
      workflow,
      heartbeatAt: now,
      updatedAt: now,
    })
    .where(and(
      eq(blogGenerationRuns.id, runId),
      eq(blogGenerationRuns.status, "planning"),
    ))
    .returning();
  return queued;
}

export async function claimBlogGenerationRun(runId: number): Promise<GenerationRun | undefined> {
  const now = new Date();
  const [claimed] = await db
    .update(blogGenerationRuns)
    .set({
      status: "running",
      startedAt: now,
      heartbeatAt: now,
      updatedAt: now,
    })
    .where(
      and(
        eq(blogGenerationRuns.id, runId),
        eq(blogGenerationRuns.status, "queued"),
      ),
    )
    .returning();
  return claimed;
}

export async function claimCompletedBlogPlanningRun(
  runId: number,
): Promise<GenerationRun | undefined> {
  const now = new Date();
  const [claimed] = await db
    .update(blogGenerationRuns)
    .set({
      status: "running",
      startedAt: now,
      completedAt: null,
      heartbeatAt: now,
      updatedAt: now,
    })
    .where(and(
      eq(blogGenerationRuns.id, runId),
      eq(blogGenerationRuns.status, "completed"),
      isNull(blogGenerationRuns.postId),
      sql`${blogGenerationRuns.input}->>'mode' = 'topic-plan'`,
    ))
    .returning();
  return claimed;
}

export async function updateBlogGenerationRun(
  runId: number,
  values: UpdateGenerationRunInput,
): Promise<GenerationRun | undefined> {
  const now = new Date();
  const postIdGuard = values.postId === undefined
    ? undefined
    : or(
        isNull(blogGenerationRuns.postId),
        eq(blogGenerationRuns.postId, values.postId),
      );

  const [updated] = await db
    .update(blogGenerationRuns)
    .set({
      ...(values.workflow !== undefined ? { workflow: values.workflow } : {}),
      ...(values.result !== undefined ? { result: values.result } : {}),
      ...(values.postId !== undefined ? { postId: values.postId } : {}),
      heartbeatAt: values.heartbeatAt ?? now,
      updatedAt: now,
    })
    .where(
      and(
        eq(blogGenerationRuns.id, runId),
        eq(blogGenerationRuns.status, "running"),
        postIdGuard,
      ),
    )
    .returning();
  return updated;
}

export async function heartbeatBlogGenerationRun(
  runId: number,
): Promise<GenerationRun | undefined> {
  const now = new Date();
  const [updated] = await db
    .update(blogGenerationRuns)
    .set({ heartbeatAt: now, updatedAt: now })
    .where(and(
      eq(blogGenerationRuns.id, runId),
      inArray(blogGenerationRuns.status, ["planning", "queued", "running"]),
    ))
    .returning();
  return updated;
}

export async function requeueBlogGenerationRun(
  runId: number,
  workflow?: UpdateGenerationRunInput["workflow"],
): Promise<GenerationRun | undefined> {
  const now = new Date();
  const [queued] = await db
    .update(blogGenerationRuns)
    .set({
      status: "queued",
      ...(workflow !== undefined ? { workflow } : {}),
      result: null,
      startedAt: null,
      completedAt: null,
      heartbeatAt: now,
      updatedAt: now,
    })
    .where(and(
      eq(blogGenerationRuns.id, runId),
      inArray(blogGenerationRuns.status, ["failed", "interrupted", "completed"]),
    ))
    .returning();
  return queued;
}

export async function updateCompletedBlogGenerationRunResult(
  runId: number,
  result: UpdateGenerationRunInput["result"],
): Promise<GenerationRun | undefined> {
  const [updated] = await db
    .update(blogGenerationRuns)
    .set({ result, updatedAt: new Date() })
    .where(and(
      eq(blogGenerationRuns.id, runId),
      eq(blogGenerationRuns.status, "completed"),
    ))
    .returning();
  return updated;
}

export async function completeBlogGenerationRun(
  runId: number,
  values: CompleteGenerationRunInput,
): Promise<GenerationRun | undefined> {
  const now = new Date();
  const [completed] = await db
    .update(blogGenerationRuns)
    .set({
      status: "completed",
      postId: values.postId,
      ...(values.workflow !== undefined ? { workflow: values.workflow } : {}),
      result: values.result,
      heartbeatAt: now,
      completedAt: now,
      updatedAt: now,
    })
    .where(
      and(
        eq(blogGenerationRuns.id, runId),
        eq(blogGenerationRuns.status, "running"),
        or(
          isNull(blogGenerationRuns.postId),
          eq(blogGenerationRuns.postId, values.postId),
        ),
      ),
    )
    .returning();
  return completed;
}

export async function completeBlogPlanningRun(
  runId: number,
  values: CompletePlanningRunInput,
): Promise<GenerationRun | undefined> {
  const now = new Date();
  const [completed] = await db
    .update(blogGenerationRuns)
    .set({
      status: "completed",
      ...(values.workflow !== undefined ? { workflow: values.workflow } : {}),
      result: values.result,
      heartbeatAt: now,
      completedAt: now,
      updatedAt: now,
    })
    .where(and(
      eq(blogGenerationRuns.id, runId),
      eq(blogGenerationRuns.status, "planning"),
      isNull(blogGenerationRuns.postId),
    ))
    .returning();
  return completed;
}

export async function failBlogGenerationRun(
  runId: number,
  values: FailGenerationRunInput,
): Promise<GenerationRun | undefined> {
  const now = new Date();
  const [failed] = await db
    .update(blogGenerationRuns)
    .set({
      status: "failed",
      ...(values.workflow !== undefined ? { workflow: values.workflow } : {}),
      result: {
        ...values.result,
        error: values.error,
      },
      heartbeatAt: now,
      completedAt: now,
      updatedAt: now,
    })
    .where(
      and(
        eq(blogGenerationRuns.id, runId),
        inArray(blogGenerationRuns.status, ["planning", "queued", "running"]),
      ),
    )
    .returning();
  return failed;
}

export async function appendBlogGenerationEvent(
  values: AppendGenerationEventInput,
): Promise<GenerationEvent> {
  const [event] = await db
    .insert(blogGenerationEvents)
    .values(values)
    .returning();
  return event;
}

export async function listBlogGenerationEvents(
  runId: number,
  options: ListGenerationEventsOptions = {},
): Promise<GenerationEvent[]> {
  const conditions = [eq(blogGenerationEvents.runId, runId)];
  if (options.afterId !== undefined) {
    conditions.push(gt(blogGenerationEvents.id, options.afterId));
  }

  return db
    .select()
    .from(blogGenerationEvents)
    .where(and(...conditions))
    .orderBy(asc(blogGenerationEvents.id));
}

export async function markStaleBlogGenerationRunsInterrupted(
  staleBefore: Date,
): Promise<GenerationRun[]> {
  const now = new Date();
  return db
    .update(blogGenerationRuns)
    .set({
      status: "interrupted",
      completedAt: now,
      updatedAt: now,
    })
    .where(
      and(
        inArray(blogGenerationRuns.status, ["planning", "queued", "running"]),
        or(
          lt(blogGenerationRuns.heartbeatAt, staleBefore),
          and(
            isNull(blogGenerationRuns.heartbeatAt),
            lt(blogGenerationRuns.updatedAt, staleBefore),
          ),
        ),
      ),
    )
    .returning();
}
