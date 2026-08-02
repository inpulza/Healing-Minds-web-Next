import { NextResponse } from "next/server";
import { MetricoolService } from "../../../server/services/metricool";
import tikTokSnapshot from "../../../shared/tiktok-snapshot.json";
import { dedupeTikTokPayload } from "../../../shared/tiktok-feed.mjs";

export const revalidate = 300;

export async function GET() {
  if (!process.env.METRICOOL_TOKEN) {
    return NextResponse.json({ success: true, data: dedupeTikTokPayload(tikTokSnapshot) });
  }

  try {
    const data = await new MetricoolService().fetchTikTokPosts();
    return NextResponse.json({ success: true, data: dedupeTikTokPayload(data) });
  } catch {
    return NextResponse.json({ success: true, data: dedupeTikTokPayload(tikTokSnapshot) });
  }
}
