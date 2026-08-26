import { eq } from "drizzle-orm";
import type { NeonDatabase } from "drizzle-orm/neon-serverless";
import type * as Schema from "@shared/schema";
import { webAlertOutbox, type WebAlertStatus } from "@shared/schema";

export interface WebAlertClaim {
  dedupeKey: string;
  tenantId: string;
  formKey: string;
  leadId: string;
  status: WebAlertStatus;
  lastErrorCode?: string;
}

export interface WebAlertCompletion {
  status: WebAlertStatus;
  attempts: number;
  zernioMessageId?: string;
  lastErrorCode?: string;
}

export interface WebAlertStore {
  claim(input: WebAlertClaim): Promise<string | null>;
  complete(id: string, input: WebAlertCompletion): Promise<void>;
}

export function createDrizzleWebAlertStore(
  db: NeonDatabase<typeof Schema>,
): WebAlertStore {
  return {
    async claim(input) {
      const [row] = await db
        .insert(webAlertOutbox)
        .values({
          dedupeKey: input.dedupeKey,
          tenantId: input.tenantId,
          formKey: input.formKey,
          leadId: input.leadId,
          status: input.status,
          lastErrorCode: input.lastErrorCode,
        })
        .onConflictDoNothing({ target: webAlertOutbox.dedupeKey })
        .returning({ id: webAlertOutbox.id });
      return row?.id || null;
    },
    async complete(id, input) {
      await db
        .update(webAlertOutbox)
        .set({
          status: input.status,
          attempts: input.attempts,
          zernioMessageId: input.zernioMessageId,
          lastErrorCode: input.lastErrorCode,
          updatedAt: new Date(),
        })
        .where(eq(webAlertOutbox.id, id));
    },
  };
}
