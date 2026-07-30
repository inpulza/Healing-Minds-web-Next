// Frozen fallback captured from the live public Metricool-backed endpoint.
// Refresh this snapshot deliberately when production reviews change so a
// deployment without Metricool credentials preserves the public experience.
import snapshot from "@shared/reviews-snapshot.json";

export const staticReviews = snapshot.reviews.map((review) => ({
  ...review,
  createdAt: new Date(review.createdAt),
}));

export const staticStats = snapshot.stats;
