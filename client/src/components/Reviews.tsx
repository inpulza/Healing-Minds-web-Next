import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/useLanguage';
import { Card } from '@/components/ui/card';
import { Star, Shield, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { ReviewsResponse } from '@shared/schema';

const Reviews = () => {
  const { language } = useLanguage();
  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout>();

  // Fetch reviews data
  const { data: reviewsData, isLoading, error } = useQuery<{ data: ReviewsResponse }>({
    queryKey: ['/api/reviews'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const reviews = reviewsData?.data?.reviews || [];
  const stats = reviewsData?.data?.stats || { averageRating: 0, totalReviews: 0 };
  
  // Mobile carousel auto-scroll logic with scroll sync
  useEffect(() => {
    if (reviews.length <= 1 || isPaused) return;

    autoScrollRef.current = setInterval(() => {
      setCurrentPage(prev => {
        const next = (prev + 1) % reviews.length;
        
        // Auto-scroll to the next card
        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          const cardWidth = 320;
          const gap = 16;
          const scrollPosition = next * (cardWidth + gap);
          
          container.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
          });
        }
        
        return next;
      });
    }, 4000);

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [reviews.length, isPaused]);

  // Handle manual navigation with scroll sync
  const goToPage = (page: number) => {
    setCurrentPage(page);
    setIsPaused(true);
    
    // Scroll to the specific card
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 320; // Matches sm:min-w-[320px]
      const gap = 16; // Matches gap-4
      const scrollPosition = page * (cardWidth + gap);
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
    
    setTimeout(() => setIsPaused(false), 8000); // Resume auto-scroll after 8 seconds
  };

  const nextPage = () => {
    const next = (currentPage + 1) % reviews.length;
    goToPage(next);
  };

  const prevPage = () => {
    const prev = currentPage === 0 ? reviews.length - 1 : currentPage - 1;
    goToPage(prev);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse mb-6"></div>
            <div className="h-6 bg-gray-200 rounded-lg animate-pulse max-w-2xl mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-16 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('Reviews error:', error);
  }

  return (
    <section className="py-20 from-white to-gray-50 bg-[#f0fdf4]" data-testid="reviews-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-body font-bold text-green-800 mb-6" data-testid="reviews-title">
            {language === 'en' ? 'What our ' : 'Lo que dicen nuestros '}
            <span className="font-display italic text-green-700">
              {language === 'en' ? 'patients' : 'pacientes'}
            </span>
            {language === 'en' ? ' say' : ''}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed" data-testid="reviews-description">
            {language === 'en'
              ? 'Real stories from patients who have found hope and healing through Dr. Reve\'s compassionate care.'
              : 'Historias reales de pacientes que han encontrado esperanza y sanación a través del cuidado compasivo de la Dra. Reve.'
            }
          </p>
          
          {/* Stats Display */}
          <div className="flex justify-center items-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <div className="flex">{renderStars(Math.round(stats.averageRating))}</div>
              <span className="text-2xl font-bold text-green-800" data-testid="average-rating">
                {stats.averageRating.toFixed(1)}
              </span>
            </div>
            <div className="text-gray-500 text-lg" data-testid="total-reviews">
              {language === 'en' 
                ? `${stats.totalReviews} reviews` 
                : `${stats.totalReviews} reseñas`
              }
            </div>
          </div>
        </div>

        {/* Desktop Grid Layout (3x3) */}
        <div className="hidden lg:grid grid-cols-3 gap-6" data-testid="reviews-desktop-grid">
          {reviews.slice(0, 6).map((review, index) => (
            <Card 
              key={review.id} 
              className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
              data-testid={`review-card-desktop-${index}`}
            >
              {/* Verified Badge */}
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                  <Shield className="w-3 h-3" />
                  <span>{language === 'en' ? 'Verified' : 'Verificado'}</span>
                </div>
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">{renderStars(review.rating)}</div>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
              
              {/* Review Content */}
              <blockquote className="text-gray-700 mb-4 leading-relaxed">
                "{review.comment}"
              </blockquote>
              
              {/* Author */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {review.image ? (
                    <img 
                      src={review.image} 
                      alt={review.name}
                      className="w-10 h-10 rounded-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-700 font-semibold text-sm">
                        {review.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{review.name}</p>
                    <p className="text-sm text-gray-500">
                      {language === 'en' ? 'Patient' : 'Paciente'}
                    </p>
                  </div>
                </div>
                
                {/* View on Google Button */}
                <a 
                  href="https://g.page/r/CX_IlTO2gnY7EBM/review"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 hover:scale-105"
                  aria-label={language === 'en' ? 'View this review on Google' : 'Ver esta reseña en Google'}
                  data-testid={`button-view-google-desktop-${index}`}
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>{language === 'en' ? 'View on Google' : 'Ver en Google'}</span>
                </a>
              </div>
            </Card>
          ))}
        </div>

        {/* Mobile Horizontal Scrollable Layout */}
        <div className="lg:hidden" data-testid="reviews-mobile-container">
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide px-4 -mx-4"
            style={{ scrollSnapType: 'x mandatory' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            data-testid="reviews-mobile-scroll"
          >
            {reviews.map((review, index) => (
              <Card 
                key={review.id}
                className="min-w-[280px] sm:min-w-[320px] w-[280px] sm:w-[320px] bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 snap-center flex-shrink-0 relative overflow-hidden"
                data-testid={`review-card-mobile-${index}`}
              >
                {/* Verified Badge */}
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                    <Shield className="w-3 h-3" />
                    <span>{language === 'en' ? 'Verified' : 'Verificado'}</span>
                  </div>
                </div>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">{renderStars(review.rating)}</div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                
                {/* Review Content */}
                <blockquote className="text-gray-700 mb-4 leading-relaxed">
                  "{review.comment}"
                </blockquote>
                
                {/* Author */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {review.image ? (
                      <img 
                        src={review.image} 
                        alt={review.name}
                        className="w-10 h-10 rounded-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-700 font-semibold text-sm">
                          {review.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{review.name}</p>
                      <p className="text-sm text-gray-500">
                        {language === 'en' ? 'Patient' : 'Paciente'}
                      </p>
                    </div>
                  </div>
                  
                  {/* View on Google Button */}
                  <a 
                    href="https://g.page/r/CX_IlTO2gnY7EBM/review"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 hover:scale-105"
                    aria-label={language === 'en' ? 'View this review on Google' : 'Ver esta reseña en Google'}
                    data-testid={`button-view-google-mobile-${index}`}
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>{language === 'en' ? 'View on Google' : 'Ver en Google'}</span>
                  </a>
                </div>
              </Card>
            ))}
          </div>

          {/* Mobile Navigation Dots */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button 
              onClick={prevPage}
              className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              aria-label={language === 'en' ? 'Previous review' : 'Reseña anterior'}
              data-testid="button-prev-review"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            
            <div className="flex gap-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentPage 
                      ? 'bg-green-600' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`${language === 'en' ? 'Go to review' : 'Ir a reseña'} ${index + 1}`}
                  data-testid={`dot-review-${index}`}
                />
              ))}
            </div>
            
            <button 
              onClick={nextPage}
              className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              aria-label={language === 'en' ? 'Next review' : 'Siguiente reseña'}
              data-testid="button-next-review"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <a 
            href="https://g.page/r/CX_IlTO2gnY7EBM/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-200 shadow-sm hover:shadow-lg hover:bg-white transition-all duration-300 hover:-translate-y-1"
            data-testid="button-google-review"
          >
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="text-gray-700 font-medium">
              {language === 'en' 
                ? 'Click here - Leave us a review on Google' 
                : 'Click aquí - Déjanos una reseña en Google'
              }
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Reviews;