import { useContext } from 'react';
import { CookieConsentContext } from '@/contexts/CookieConsentContext';
import { CookieConsentContextType, CookieCategory } from '@/types/cookies';

/**
 * Hook to access cookie consent state and actions throughout the app
 * 
 * @returns CookieConsentContextType - All consent state and actions
 * @throws Error if used outside of CookieConsentProvider
 */
export const useCookieConsent = (): CookieConsentContextType => {
  const context = useContext(CookieConsentContext);
  
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  
  return context;
};

/**
 * Helper hook to check if a specific cookie category has consent
 * 
 * @param category - The cookie category to check
 * @returns boolean - Whether the category has consent
 */
export const useHasConsent = (category: CookieCategory): boolean => {
  const { hasConsent } = useCookieConsent();
  return hasConsent(category);
};

/**
 * Helper hook to check if analytics can be loaded
 * 
 * @returns boolean - Whether analytics scripts can be loaded
 */
export const useCanLoadAnalytics = (): boolean => {
  const { canLoadAnalytics } = useCookieConsent();
  return canLoadAnalytics();
};

/**
 * Helper hook to check if marketing can be loaded
 * 
 * @returns boolean - Whether marketing scripts can be loaded
 */
export const useCanLoadMarketing = (): boolean => {
  const { canLoadMarketing } = useCookieConsent();
  return canLoadMarketing();
};

/**
 * Helper hook to get current consent state for debugging
 * 
 * @returns string - Consent string in format "N:1-A:0-M:0"
 */
export const useConsentString = (): string => {
  const { getConsentString } = useCookieConsent();
  return getConsentString();
};

export default useCookieConsent;