import { NextResponse, type NextRequest } from "next/server";
import { processPendingContactWebAlerts } from "../../../../../server/web-alerts/contact-alert";
import { createDrizzleWebAlertStore } from "../../../../../server/web-alerts/store";
import { readZernioConfig } from "../../../../../server/web-alerts/zernio";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const config = readZernioConfig();
  if (!config.enabled) return NextResponse.json({ success: true, processed: 0, disabled: true });

  const { db } = await import("../../../../../server/db");
  const results = await processPendingContactWebAlerts({
    store: createDrizzleWebAlertStore(db),
    config,
  });
  const outcomes = results.reduce<Record<string, number>>((counts, result) => {
    counts[result.status] = (counts[result.status] || 0) + 1;
    return counts;
  }, {});
  if ((outcomes.failed || 0) > 0 || (outcomes.unknown || 0) > 0) {
    console.error("Healing Minds web alert worker requires review", {
      tenantId: "healing-minds",
      outcomes,
    });
  }
  return NextResponse.json({
    success: true,
    processed: results.length,
    outcomes,
  });
}
