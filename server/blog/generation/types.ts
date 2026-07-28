import type {
  BlogGenerationEvent,
  BlogGenerationRun,
  BlogGenerationRunStatus,
} from "@shared/schema";

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export type JsonObject = { [key: string]: JsonValue };

export type GenerationRun = BlogGenerationRun;
export type GenerationEvent = BlogGenerationEvent;
export type GenerationRunStatus = BlogGenerationRunStatus;

export type CreateGenerationRunInput = {
  idempotencyKey: string;
  input: JsonObject;
  workflow?: JsonObject;
};

export type UpdateGenerationRunInput = {
  workflow?: JsonObject;
  result?: JsonObject;
  postId?: number;
  heartbeatAt?: Date;
};

export type CompleteGenerationRunInput = {
  postId: number;
  workflow?: JsonObject;
  result: JsonObject;
};

export type CompletePlanningRunInput = {
  workflow?: JsonObject;
  result: JsonObject;
};

export type FailGenerationRunInput = {
  error: string;
  workflow?: JsonObject;
  result?: JsonObject;
};

export type AppendGenerationEventInput = {
  runId: number;
  eventType: string;
  payload: JsonObject;
};

export type ListGenerationEventsOptions = {
  afterId?: number;
};
