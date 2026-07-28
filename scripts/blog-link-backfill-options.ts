export type BlogLinkBackfillMode = "dry-run" | "apply";

export type BlogLinkBackfillOptions = {
  mode: BlogLinkBackfillMode;
  batchSize: number;
  afterId: number;
};

const MAX_POST_ID = 2_147_483_647;

function parseIntegerArgument(
  name: string,
  value: string | undefined,
  bounds: { minimum: number; maximum: number },
): number {
  if (!value || !/^\d+$/.test(value)) {
    throw new Error(`${name} must be an integer`);
  }
  const parsed = Number.parseInt(value, 10);
  if (parsed < bounds.minimum || parsed > bounds.maximum) {
    throw new Error(
      `${name} must be between ${bounds.minimum} and ${bounds.maximum}`,
    );
  }
  return parsed;
}

function takeArgumentValue(
  args: string[],
  index: number,
  name: string,
): { value: string; consumed: number } {
  const argument = args[index];
  const prefix = `${name}=`;
  if (argument.startsWith(prefix)) {
    return { value: argument.slice(prefix.length), consumed: 0 };
  }
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${name} requires a value`);
  }
  return { value, consumed: 1 };
}

export function parseBlogLinkBackfillOptions(args: string[]): BlogLinkBackfillOptions {
  let mode: BlogLinkBackfillMode | null = null;
  let batchSize = 25;
  let afterId = 0;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--dry-run") {
      if (mode === "apply") {
        throw new Error("--dry-run and --apply are mutually exclusive");
      }
      mode = "dry-run";
      continue;
    }
    if (argument === "--apply") {
      if (mode === "dry-run") {
        throw new Error("--dry-run and --apply are mutually exclusive");
      }
      mode = "apply";
      continue;
    }
    if (argument === "--batch-size" || argument.startsWith("--batch-size=")) {
      const parsed = takeArgumentValue(args, index, "--batch-size");
      batchSize = parseIntegerArgument("--batch-size", parsed.value, {
        minimum: 1,
        maximum: 100,
      });
      index += parsed.consumed;
      continue;
    }
    if (argument === "--after-id" || argument.startsWith("--after-id=")) {
      const parsed = takeArgumentValue(args, index, "--after-id");
      afterId = parseIntegerArgument("--after-id", parsed.value, {
        minimum: 0,
        maximum: MAX_POST_ID,
      });
      index += parsed.consumed;
      continue;
    }
    throw new Error(`Unknown argument: ${argument}`);
  }

  return {
    mode: mode || "dry-run",
    batchSize,
    afterId,
  };
}
