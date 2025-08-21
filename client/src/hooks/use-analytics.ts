import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { trackPageView } from '@/lib/analytics';

// Hook to track page views automatically
export function useAnalytics(): void {
  const [location] = useLocation();

  useEffect(() => {
    // Defer page tracking to avoid blocking critical rendering
    const trackPage = () => {
      trackPageView(location, document.title);
    };
    
    // Use requestIdleCallback to defer analytics calls
    if ('requestIdleCallback' in window) {
      requestIdleCallback(trackPage);
    } else {
      setTimeout(trackPage, 100);
    }
  }, [location]);
}