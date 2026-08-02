import fs from "node:fs";
import path from "node:path";

const statsPath = path.join(
  process.cwd(),
  ".next",
  "diagnostics",
  "route-bundle-stats.json",
);
const routeBudgets = new Map([
  ["/", 750 * 1024],
  ["/[...slug]", 850 * 1024],
]);

if (!fs.existsSync(statsPath)) {
  throw new Error(`Next route bundle statistics are missing: ${statsPath}`);
}

const routeStats = JSON.parse(fs.readFileSync(statsPath, "utf8"));

for (const [route, budgetBytes] of routeBudgets) {
  const stats = routeStats.find((entry) => entry.route === route);
  if (!stats || !Number.isFinite(stats.firstLoadUncompressedJsBytes)) {
    throw new Error(`Missing first-load JavaScript statistics for ${route}`);
  }

  const actualBytes = stats.firstLoadUncompressedJsBytes;
  if (actualBytes > budgetBytes) {
    throw new Error(
      `${route} first-load JavaScript is ${(actualBytes / 1024).toFixed(1)} KiB; ` +
        `budget is ${(budgetBytes / 1024).toFixed(0)} KiB`,
    );
  }

  console.log(
    `${route} first-load JavaScript: ${(actualBytes / 1024).toFixed(1)} KiB ` +
      `(budget ${(budgetBytes / 1024).toFixed(0)} KiB)`,
  );
}
