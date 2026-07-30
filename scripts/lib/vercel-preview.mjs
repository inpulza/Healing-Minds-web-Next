export function candidateContextOptions(secret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
  if (!secret) return {};

  return {
    extraHTTPHeaders: {
      "x-vercel-protection-bypass": secret,
    },
  };
}
