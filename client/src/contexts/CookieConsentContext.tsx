import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  CookieConsentContextType, 
  CookieConsentState, 
  CookieConsent, 
  CookieCategory,
  DEFAULT_CONSENT_STATE 
} from '@/types/cookies';

const STORAGE_KEY = 'hmp_cookie_consent';

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

interface CookieConsentProviderProps {
  children: ReactNode;
}

export const CookieConsentProvider: React.FC<CookieConsentProviderProps> = ({ children }) => {
  const [consentState, setConsentState] = useState<CookieConsentState>(DEFAULT_CONSENT_STATE);

  // Load consent from localStorage on initialization
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CookieConsentState;
        
        // Validate the stored data structure
        if (parsed && typeof parsed === 'object' && parsed.consent) {
          setConsentState({
            ...parsed,
            consentDate: parsed.consentDate ? new Date(parsed.consentDate) : undefined,
            lastUpdated: parsed.lastUpdated ? new Date(parsed.lastUpdated) : undefined,
          });
        } else {
          // Invalid stored data, reset to default
          console.warn('Invalid cookie consent data found, resetting to defaults');
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading cookie consent preferences:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Save consent to localStorage
  const saveConsent = useCallback((newState: CookieConsentState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (error) {
      console.error('Error saving cookie consent preferences:', error);
    }
  }, []);

  // Accept all cookies
  const acceptAll = useCallback(() => {
    const newState: CookieConsentState = {
      hasConsented: true,
      showBanner: false,
      consent: {
        necessary: true,
        analytics: true,
        marketing: true,
      },
      consentDate: new Date(),
      lastUpdated: new Date(),
    };
    
    setConsentState(newState);
    saveConsent(newState);
    
    // Trigger granular consent update event
    window.dispatchEvent(new CustomEvent('consentChanged', { 
      detail: { 
        analytics: newState.consent.analytics,
        marketing: newState.consent.marketing,
        hasAnalyticsConsent: newState.consent.analytics,
        hasMarketingConsent: newState.consent.marketing
      } 
    }));
  }, [consentState.consent.analytics, saveConsent]);

  // Accept selected cookies
  const acceptSelected = useCallback((partialConsent: Partial<CookieConsent>) => {
    const newConsent: CookieConsent = {
      necessary: true, // Always true
      analytics: partialConsent.analytics ?? consentState.consent.analytics,
      marketing: partialConsent.marketing ?? consentState.consent.marketing,
    };

    const newState: CookieConsentState = {
      hasConsented: true,
      showBanner: false,
      consent: newConsent,
      consentDate: consentState.consentDate || new Date(),
      lastUpdated: new Date(),
    };
    
    setConsentState(newState);
    saveConsent(newState);
    
    // Trigger granular consent event if any consent changed
    if (partialConsent.analytics !== undefined || partialConsent.marketing !== undefined) {
      window.dispatchEvent(new CustomEvent('consentChanged', { 
        detail: { 
          analytics: newConsent.analytics,
          marketing: newConsent.marketing,
          hasAnalyticsConsent: newConsent.analytics,
          hasMarketingConsent: newConsent.marketing
        } 
      }));
    }
  }, [consentState.consent.analytics, consentState.consent.marketing, consentState.consentDate, saveConsent]);

  // Reject all non-necessary cookies
  const rejectAll = useCallback(() => {
    const newState: CookieConsentState = {
      hasConsented: true,
      showBanner: false,
      consent: {
        necessary: true,
        analytics: false,
        marketing: false,
      },
      consentDate: new Date(),
      lastUpdated: new Date(),
    };
    
    setConsentState(newState);
    saveConsent(newState);
    
    // Trigger granular consent update event
    window.dispatchEvent(new CustomEvent('consentChanged', { 
      detail: { 
        analytics: newState.consent.analytics,
        marketing: newState.consent.marketing,
        hasAnalyticsConsent: newState.consent.analytics,
        hasMarketingConsent: newState.consent.marketing
      } 
    }));
  }, [consentState.consent.analytics, saveConsent]);

  // Update specific cookie category
  const updateConsent = useCallback((category: CookieCategory, value: boolean) => {
    if (category === 'necessary') {
      // Necessary cookies cannot be disabled
      return;
    }

    const newConsent: CookieConsent = {
      ...consentState.consent,
      [category]: value,
    };

    const newState: CookieConsentState = {
      ...consentState,
      consent: newConsent,
      lastUpdated: new Date(),
    };
    
    setConsentState(newState);
    saveConsent(newState);
    
    // Trigger granular consent event for category changes
    window.dispatchEvent(new CustomEvent('consentChanged', { 
      detail: { 
        analytics: newConsent.analytics,
        marketing: newConsent.marketing,
        hasAnalyticsConsent: newConsent.analytics,
        hasMarketingConsent: newConsent.marketing
      } 
    }));
  }, [consentState, saveConsent]);

  // Show preferences modal
  const showPreferences = useCallback(() => {
    setConsentState(prev => ({
      ...prev,
      showBanner: true,
    }));
  }, []);

  // Hide banner
  const hideBanner = useCallback(() => {
    setConsentState(prev => ({
      ...prev,
      showBanner: false,
    }));
  }, []);

  // Reset all consent (for testing/debugging)
  const resetConsent = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setConsentState(DEFAULT_CONSENT_STATE);
    
    // Trigger granular consent reset event
    window.dispatchEvent(new CustomEvent('consentChanged', { 
      detail: { 
        analytics: false,
        marketing: false,
        hasAnalyticsConsent: false,
        hasMarketingConsent: false
      } 
    }));
  }, []);

  // Check if specific category has consent
  const hasConsent = useCallback((category: CookieCategory): boolean => {
    if (!consentState.hasConsented) return false;
    return consentState.consent[category];
  }, [consentState]);

  // Check if analytics can be loaded
  const canLoadAnalytics = useCallback((): boolean => {
    return hasConsent('analytics');
  }, [hasConsent]);

  // Check if marketing can be loaded
  const canLoadMarketing = useCallback((): boolean => {
    return hasConsent('marketing');
  }, [hasConsent]);

  // Get consent string for debugging/reporting
  const getConsentString = useCallback((): string => {
    const { consent } = consentState;
    return `N:${consent.necessary ? '1' : '0'}-A:${consent.analytics ? '1' : '0'}-M:${consent.marketing ? '1' : '0'}`;
  }, [consentState]);

  const contextValue: CookieConsentContextType = {
    consentState,
    acceptAll,
    acceptSelected,
    rejectAll,
    updateConsent,
    showPreferences,
    hideBanner,
    resetConsent,
    hasConsent,
    canLoadAnalytics,
    canLoadMarketing,
    getConsentString,
  };

  return (
    <CookieConsentContext.Provider value={contextValue}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export { CookieConsentContext };