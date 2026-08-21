import { NextResponse } from "next/server";
import { MetricoolService } from "../../../../server/services/metricool";
import { staticReviewsFetchedAt, staticStats } from "../../../../server/data/static-reviews";

export const revalidate = 300;

export async function GET() {
  try {
    const service = new MetricoolService();
    const response = await service.fetchReviews();
    const stats = service.calculateStats(response.reviews || []);
    return NextResponse.json({
      success: true,
      data: {
        fetchedAt: new Date().toISOString(),
        averageRating: stats.averageRating,
        totalReviews: stats.totalReviews,
      },
    });
  } catch {
    return NextResponse.json({
      success: true,
      data: {
        fetchedAt: staticReviewsFetchedAt,
        averageRating: staticStats.averageRating,
        totalReviews: staticStats.totalReviews,
      },
      fallback: true,
    });
  }
}
