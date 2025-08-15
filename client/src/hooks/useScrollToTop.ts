import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * Custom hook that scrolls to top whenever the route changes
 */
export const useScrollToTop = () => {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location]);
};