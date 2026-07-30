import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  ADMIN_COOKIE_NAME,
  adminAuthConfigured,
  adminAuthMode,
  adminCookieOptions,
  clearAdminLoginFailures,
  createAdminSessionToken,
  loginRateLimit,
  noStoreHeaders,
  recordFailedAdminLogin,
  verifyAdminCredentials,
} from "../../../../server/next-admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const credentialsSchema = z.object({
  username: z.string().min(1).max(200),
  password: z.string().min(1).max(1000),
});

function clientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

export async function POST(request: NextRequest) {
  if (adminAuthMode() === "off") {
    return NextResponse.json(
      { success: true, admin: { username: "development", role: "admin" } },
      { headers: noStoreHeaders },
    );
  }
  if (!adminAuthConfigured()) {
    return NextResponse.json(
      { success: false, message: "Admin authentication is not configured" },
      { status: 503, headers: noStoreHeaders },
    );
  }

  const parsed = credentialsSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Username and password are required" },
      { status: 400, headers: noStoreHeaders },
    );
  }

  const ip = clientIp(request);
  const limit = loginRateLimit(ip);
  if (limit.limited) {
    return NextResponse.json(
      { success: false, message: "Too many failed login attempts. Please try again later." },
      { status: 429, headers: { ...noStoreHeaders, "Retry-After": String(limit.retryAfter) } },
    );
  }

  if (!verifyAdminCredentials(parsed.data.username, parsed.data.password)) {
    recordFailedAdminLogin(ip);
    const response = NextResponse.json(
      { success: false, message: "Invalid admin credentials" },
      { status: 401, headers: noStoreHeaders },
    );
    response.cookies.set(ADMIN_COOKIE_NAME, "", { ...adminCookieOptions, maxAge: 0 });
    return response;
  }

  clearAdminLoginFailures(ip);
  const token = createAdminSessionToken(parsed.data.username);
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Admin authentication is not configured" },
      { status: 503, headers: noStoreHeaders },
    );
  }
  const response = NextResponse.json(
    { success: true, admin: { username: parsed.data.username.trim(), role: "admin" } },
    { headers: noStoreHeaders },
  );
  response.cookies.set(ADMIN_COOKIE_NAME, token, adminCookieOptions);
  return response;
}
