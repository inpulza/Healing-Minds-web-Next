import { pool } from "../server/db";
import { seedBlogLinkLibrary } from "../server/blog/links/seed";

seedBlogLinkLibrary()
  .catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
