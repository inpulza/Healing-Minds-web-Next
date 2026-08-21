import { NextResponse } from "next/server";
import { MetricoolService } from "../../../server/services/metricool";
import {
  staticReviews,
  staticReviewsFetchedAt,
  staticStats,
} from "../../../server/data/static-reviews";

export const revalidate = 300;

export async function GET() {
  try {
    const service = new MetricoolService();
    const response = await service.fetchReviews();
    return NextResponse.json({
      success: true,
      data: {
        fetchedAt: new Date().toISOString(),
        stats: service.calculateStats(response.reviews || []),
        reviews: service.transformReviewsToUIFormat(response.reviews || []),
      },
    });
  } catch {
    return NextResponse.json({
      success: true,
      data: {
        fetchedAt: staticReviewsFetchedAt,
        stats: staticStats,
        reviews: staticReviews,
      },
      fallback: true,
      message: "Using static reviews - API unavailable",
    });
  }
}
