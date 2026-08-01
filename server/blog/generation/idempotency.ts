export type GenerationRunCreationAction =
  | "queue_new"
  | "resume_queued"
  | "reopen_existing";

export function decideGenerationRunCreationAction(creation: {
  created: boolean;
  run: { status: string };
}): GenerationRunCreationAction {
  if (creation.created) return "queue_new";
  return creation.run.status === "queued" ? "resume_queued" : "reopen_existing";
}
