import { sql } from "drizzle-orm";
import { db } from "../db";

export type BlogRedirectTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export async function lockBlogRedirectPaths(
  tx: BlogRedirectTransaction,
  paths: Array<string | null | undefined>,
): Promise<void> {
  const uniquePaths = Array.from(new Set(
    paths.filter((value): value is string => Boolean(value)),
  )).sort();
  for (const path of uniquePaths) {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${`blog-redirect:${path}`}))`);
  }
}
