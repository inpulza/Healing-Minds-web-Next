import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  adminCookieOptions,
  noStoreHeaders,
} from "../../../../server/next-admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ success: true }, { headers: noStoreHeaders });
  response.cookies.set(ADMIN_COOKIE_NAME, "", { ...adminCookieOptions, maxAge: 0 });
  return response;
}
