import { and, asc, eq, lt, or, sql } from "drizzle-orm";
import type { NeonDatabase } from "drizzle-orm/neon-serverless";
import type * as Schema from "@shared/schema";
import { contactMessages, webAlertOutbox, type WebAlertStatus } from "@shared/schema";

export interface WebAlertCompletion {
  status: WebAlertStatus;
  zernioMessageId?: string;
  lastErrorCode?: string;
}

export interface PendingContactWebAlert {
  outboxId: string;
  leadId: string;
  formKey: "contact_page" | "consultation_modal";
  lead: {
    firstName: string;
    lastName: string;
    phone: string;
    message: string;
  };
}

export interface WebAlertStore {
  acquire(id: string): Promise<boolean>;
  complete(id: string, input: WebAlertCompletion): Promise<void>;
  pending(limit: number): Promise<PendingContactWebAlert[]>;
}

export function createDrizzleWebAlertStore(
  db: NeonDatabase<typeof Schema>,
): WebAlertStore {
  return {
    async acquire(id) {
      const retryCutoff = new Date(Date.now() - 5 * 60_000);
      const [row] = await db
        .update(webAlertOutbox)
        .set({
          attempts: sql`${webAlertOutbox.attempts} + 1`,
          updatedAt: new Date(),
        })
        .where(and(
          eq(webAlertOutbox.id, id),
          eq(webAlertOutbox.status, "pending"),
          lt(webAlertOutbox.attempts, 5),
          or(eq(webAlertOutbox.attempts, 0), lt(webAlertOutbox.updatedAt, retryCutoff)),
        ))
        .returning({ id: webAlertOutbox.id });
      return Boolean(row);
    },
    async complete(id, input) {
      await db
        .update(webAlertOutbox)
        .set({
          status: input.status,
          zernioMessageId: input.zernioMessageId,
          lastErrorCode: input.lastErrorCode,
          updatedAt: new Date(),
        })
        .where(eq(webAlertOutbox.id, id));
    },
    async pending(limit) {
      const rows = await db
        .select({
          outboxId: webAlertOutbox.id,
          leadId: webAlertOutbox.leadId,
          formKey: webAlertOutbox.formKey,
          firstName: contactMessages.firstName,
          lastName: contactMessages.lastName,
          phone: contactMessages.phone,
          message: contactMessages.message,
        })
        .from(webAlertOutbox)
        .innerJoin(contactMessages, eq(webAlertOutbox.leadId, contactMessages.id))
        .where(and(eq(webAlertOutbox.status, "pending"), lt(webAlertOutbox.attempts, 5)))
        .orderBy(asc(webAlertOutbox.updatedAt))
        .limit(limit);
      return rows.flatMap((row) =>
        (row.formKey === "contact_page" || row.formKey === "consultation_modal") && row.phone
          ? [{
              outboxId: row.outboxId,
              leadId: row.leadId,
              formKey: row.formKey,
              lead: {
                firstName: row.firstName,
                lastName: row.lastName,
                phone: row.phone,
                message: row.message,
              },
            }]
          : [],
      );
    },
  };
}
