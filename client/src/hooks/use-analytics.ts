import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { trackPageView } from '@/lib/analytics';

// Hook to track page views automatically
export function useAnalytics(): void {
  const [location] = useLocation();

  useEffect(() => {
    // Track page view when location changes
    trackPageView(location, document.title);
  }, [location]);
}