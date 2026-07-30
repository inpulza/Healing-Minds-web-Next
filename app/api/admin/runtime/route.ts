import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, noStoreHeaders } from "../../../../server/next-admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!getAdminSession(request)) {
    return NextResponse.json(
      { success: false, message: "Admin login required" },
      { status: 401, headers: noStoreHeaders },
    );
  }
  return NextResponse.json(
    {
      success: true,
      data: {
        runtime: process.env.NODE_ENV === "production" ? "production" : "development",
        platform: process.env.VERCEL ? "vercel" : "local",
        isVercelDeployment: Boolean(process.env.VERCEL),
      },
    },
    { headers: noStoreHeaders },
  );
}
