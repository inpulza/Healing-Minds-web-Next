import { and, gte, inArray, sql } from "drizzle-orm";
import { db } from "../server/db";
import { webAlertOutbox } from "../shared/schema";

const hours = 48;
const since = new Date(Date.now() - hours * 60 * 60_000);
const counts = await db
  .select({
    formKey: webAlertOutbox.formKey,
    status: webAlertOutbox.status,
    count: sql<number>`count(*)::int`,
  })
  .from(webAlertOutbox)
  .where(gte(webAlertOutbox.createdAt, since))
  .groupBy(webAlertOutbox.formKey, webAlertOutbox.status)
  .orderBy(webAlertOutbox.formKey, webAlertOutbox.status);

const [attention] = await db
  .select({ count: sql<number>`count(*)::int` })
  .from(webAlertOutbox)
  .where(and(
    gte(webAlertOutbox.createdAt, since),
    inArray(webAlertOutbox.status, ["failed", "unknown"]),
  ));

console.log(JSON.stringify({
  ok: (attention?.count || 0) === 0,
  windowHours: hours,
  counts,
  attentionRequired: attention?.count || 0,
}));

process.exitCode = (attention?.count || 0) > 0 ? 2 : 0;
