interface MetricoolCustomer {
  name?: string;
  imageProfileUrl?: string;
}

interface MetricoolReview {
  id: string;
  stars: number;
  comment: string;
  creationDate: string;
  customer?: MetricoolCustomer;
}

interface MetricoolResponse {
  reviews: MetricoolReview[];
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
  };
}

export class MetricoolService {
  private readonly apiUrl = 'https://app.metricool.com/api/v2/inbox/reviews';
  private readonly userId = '2603584';
  private readonly blogId = '5128724'; // Updated blogId as specified
  private readonly provider = 'GMB';
  private readonly token = process.env.METRICOOL_TOKEN;

  async fetchReviews(): Promise<MetricoolResponse> {
    if (!this.token) {
      throw new Error('METRICOOL_TOKEN environment variable is not set');
    }

    const url = `${this.apiUrl}?userId=${this.userId}&blogId=${this.blogId}&provider=${this.provider}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Mc-Auth': this.token,
        },
      });

      if (!response.ok) {
        throw new Error(`Metricool API error: ${response.status} ${response.statusText}`);
      }

      const data: MetricoolResponse = await response.json();
      console.log(`✅ Metricool API: Fetched ${data.reviews?.length || 0} reviews successfully`);
      
      return data;
    } catch (error) {
      console.error('❌ Error fetching reviews from Metricool:', error);
      throw error;
    }
  }

  transformReviewsToUIFormat(metricoolReviews: MetricoolReview[]) {
    if (!metricoolReviews || !Array.isArray(metricoolReviews)) {
      console.log('⚠️  Metricool reviews is not an array, received:', typeof metricoolReviews);
      return [];
    }

    return metricoolReviews.map(review => {
      const fullComment = review.comment || '';
      const truncatedComment = fullComment.length > 120 
        ? `${fullComment.substring(0, 120)}...`
        : fullComment;

      // Calculate "hace X días" format
      const createdDate = new Date(review.creationDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - createdDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let dateString = '';
      if (diffDays === 1) {
        dateString = 'hace 1 día';
      } else if (diffDays < 30) {
        dateString = `hace ${diffDays} días`;
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        dateString = months === 1 ? 'hace 1 mes' : `hace ${months} meses`;
      } else {
        const years = Math.floor(diffDays / 365);
        dateString = years === 1 ? 'hace 1 año' : `hace ${years} años`;
      }

      return {
        id: review.id,
        name: review.customer?.name || 'Anonymous',
        image: review.customer?.imageProfileUrl,
        date: dateString,
        rating: review.stars,
        comment: truncatedComment,
        fullComment: fullComment,
        createdAt: createdDate,
      };
    });
  }

  calculateStats(reviews: MetricoolReview[]) {
    if (!reviews || !Array.isArray(reviews)) {
      console.log('⚠️  Metricool reviews is not an array for stats calculation');
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const totalReviews = reviews.length;
    
    if (totalReviews === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const ratingCounts = reviews.reduce((acc, review) => {
      acc[review.stars as keyof typeof acc] = (acc[review.stars as keyof typeof acc] || 0) + 1;
      return acc;
    }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

    const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
    const averageRating = Math.round((totalStars / totalReviews) * 10) / 10;

    return {
      averageRating,
      totalReviews,
      ratingDistribution: ratingCounts
    };
  }
}