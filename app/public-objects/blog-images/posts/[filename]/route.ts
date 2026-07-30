import { NextResponse } from "next/server";
import { isManagedBlogImageKey } from "@shared/blog-images";
import { downloadBlogImage } from "../../../../../server/blog/images/object-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ filename: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { filename } = await context.params;
  const objectKey = `blog-images/posts/${filename}`;
  if (!isManagedBlogImageKey(objectKey)) {
    return new NextResponse("Not found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  try {
    const bytes = await downloadBlogImage(objectKey);
    return new NextResponse(new Uint8Array(bytes), {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Content-Length": String(bytes.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    const status = (error as { statusCode?: number }).statusCode === 404 ? 404 : 503;
    return new NextResponse(status === 404 ? "Not found" : "Image unavailable", {
      status,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }
}
