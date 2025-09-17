import { useEffect } from 'react';
import { useLocation } from 'wouter';

// Lightweight analytics hook with dynamic loading for bundle optimization
export function useAnalytics(): void {
  const [location] = useLocation();

  useEffect(() => {
    // Skip analytics in development for better performance
    if (import.meta.env.DEV) {
      return;
    }
    
    // Dynamic import for analytics to reduce initial bundle size
    const trackPage = async () => {
      try {
        const { trackPageView } = await import('@/lib/analytics');
        trackPageView(location, document.title);
      } catch (error) {
        console.error('Failed to load analytics module:', error);
      }
    };
    
    // Use requestIdleCallback to defer analytics calls
    if ('requestIdleCallback' in window) {
      requestIdleCallback(trackPage, { timeout: 2000 });
    } else {
      setTimeout(trackPage, 150);
    }
  }, [location]);
}