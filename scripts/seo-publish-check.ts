import { runSeoPublishingCheck } from "../server/seo/publishing";

const DEFAULT_PATHS = [
  "/",
  "/services/anxiety-treatment",
  "/locations/psychiatrist-naples",
  "/es/servicios/tratamiento-ansiedad",
];

function printUsage(): void {
  console.log(`Usage:
  npm run seo:check
  npm run seo:check -- /services/anxiety-treatment
  npm run seo:check -- --no-google /locations/psychiatrist-naples

Options:
  --no-google   Run render/sitemap audit only. Skip Search Console submit/inspection.
`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    printUsage();
    return;
  }

  const skipSearchConsole = args.includes("--no-google");
  const targets = args.filter(arg => !arg.startsWith("--"));
  const pathsToCheck = targets.length > 0 ? targets : DEFAULT_PATHS;
  const results = [];
  let sitemapSubmitted = false;

  for (const target of pathsToCheck) {
    const result = await runSeoPublishingCheck(target, {
      skipSearchConsole,
      sitemapAlreadySubmitted: sitemapSubmitted,
    });
    results.push(result);
    sitemapSubmitted ||= result.searchConsole.sitemapSubmitted;
  }

  console.log(JSON.stringify(results, null, 2));

  const hasRenderFailure = results.some(result => !result.renderAudit.ok);
  if (hasRenderFailure) {
    process.exitCode = 1;
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
