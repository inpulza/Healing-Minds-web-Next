import { useEffect } from 'react';
import { useLocation } from '@/lib/navigation';

/**
 * Custom hook that scrolls to top whenever the route changes
 */
export const useScrollToTop = () => {
  const [location] = useLocation();

  useEffect(() => {
    const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: shouldReduceMotion ? 'auto' : 'smooth'
    });
  }, [location]);
};
