import { NextRequest, NextResponse } from "next/server";
import {
  adminAuthConfigured,
  adminAuthMode,
  getAdminSession,
  noStoreHeaders,
} from "../../../../server/next-admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const mode = adminAuthMode();
  const session = getAdminSession(request);
  return NextResponse.json(
    {
      success: true,
      configured: adminAuthConfigured(),
      mode,
      authenticated: Boolean(session),
      loginUrl: null,
      admin: session ? { username: session.username, role: session.role } : null,
    },
    { headers: noStoreHeaders },
  );
}
