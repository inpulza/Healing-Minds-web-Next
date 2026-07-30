import { NextResponse, type NextRequest } from "next/server";

function gone() {
  return new NextResponse("Gone", {
    status: 410,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export function proxy(request: NextRequest) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;
  const query = search.startsWith("?") ? search.slice(1) : search;
  const lowerPath = pathname.toLowerCase();
  const lowerQuery = query.toLowerCase();

  if (
    search.includes("?_g=") ||
    search.includes("&_g=") ||
    request.nextUrl.searchParams.has("_g")
  ) {
    return new NextResponse("Forbidden", {
      status: 403,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  if (
    request.nextUrl.href.includes("zhHant") ||
    request.nextUrl.href.includes("surugaya") ||
    lowerQuery.includes("campaign_uid") ||
    lowerQuery.includes(".html") ||
    lowerQuery.startsWith("cd_html") ||
    lowerQuery.startsWith("hobby") ||
    lowerQuery.startsWith("events") ||
    lowerPath.startsWith("/product/") ||
    lowerPath.includes("/zh") ||
    lowerPath.includes("/ja/") ||
    lowerPath.startsWith("/home-") ||
    lowerPath.startsWith("/member/") ||
    lowerPath.startsWith("/legend/") ||
    lowerPath.includes("/wp-") ||
    lowerPath.includes("/wordpress/") ||
    lowerPath.includes("/comments") ||
    lowerPath.endsWith("/feed") ||
    lowerPath.includes("/feed/")
  ) {
    return gone();
  }

  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase();
  if (host === "healingmindsp.com") {
    const canonical = request.nextUrl.clone();
    canonical.protocol = "https";
    canonical.host = "www.healingmindsp.com";
    canonical.port = "";
    return NextResponse.redirect(canonical, 301);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-healing-pathname", pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: "/:path*",
};
