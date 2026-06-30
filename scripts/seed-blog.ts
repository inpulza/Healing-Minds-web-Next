import { seedInitialBlogPosts } from "../server/blog/seed";
import { pool } from "../server/db";

seedInitialBlogPosts()
  .catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
