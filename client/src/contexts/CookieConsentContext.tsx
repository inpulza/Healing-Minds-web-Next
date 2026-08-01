import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  CookieConsentContextType, 
  CookieConsentState, 
  CookieConsent, 
  CookieCategory,
  DEFAULT_CONSENT_STATE 
} from '@/types/cookies';

const STORAGE_KEY = 'hmp_cookie_consent';

function removeStoredConsentSafely(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // Privacy-restricted browsers may reject every Storage operation. The UI
    // must still hydrate with the default denied state instead of throwing out
    // of the effect that owns the banner.
    console.error('Error clearing cookie consent preferences:', error);
  }
}

function createConsentEventDetail(consent: CookieConsent, persisted: boolean) {
  // A grant that cannot be persisted must never open provider gates for only
  // this document. Revocations still propagate immediately, and listeners can
  // use persisted=false to choose a no-reload fail-closed path.
  const analytics = persisted && consent.analytics;
  const marketing = persisted && consent.marketing;
  return {
    analytics,
    marketing,
    hasAnalyticsConsent: analytics,
    hasMarketingConsent: marketing,
    persisted,
  };
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

interface CookieConsentProviderProps {
  children: ReactNode;
}

export const CookieConsentProvider: React.FC<CookieConsentProviderProps> = ({ children }) => {
  const [consentState, setConsentState] = useState<CookieConsentState>(DEFAULT_CONSENT_STATE);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

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
          removeStoredConsentSafely();
        }
      }
    } catch (error) {
      console.error('Error loading cookie consent preferences:', error);
      removeStoredConsentSafely();
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save consent to localStorage
  const saveConsent = useCallback((newState: CookieConsentState): boolean => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return true;
    } catch (error) {
      console.error('Error saving cookie consent preferences:', error);
      return false;
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
    setPreferencesOpen(false);
    const persisted = saveConsent(newState);
    
    // Trigger granular consent update event
    window.dispatchEvent(new CustomEvent('consentChanged', {
      detail: createConsentEventDetail(newState.consent, persisted),
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
    setPreferencesOpen(false);
    const persisted = saveConsent(newState);
    
    // Trigger granular consent event if any consent changed
    if (partialConsent.analytics !== undefined || partialConsent.marketing !== undefined) {
      window.dispatchEvent(new CustomEvent('consentChanged', {
        detail: createConsentEventDetail(newConsent, persisted),
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
    setPreferencesOpen(false);
    const persisted = saveConsent(newState);
    
    // Trigger granular consent update event
    window.dispatchEvent(new CustomEvent('consentChanged', {
      detail: createConsentEventDetail(newState.consent, persisted),
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
    const persisted = saveConsent(newState);
    
    // Trigger granular consent event for category changes
    window.dispatchEvent(new CustomEvent('consentChanged', {
      detail: createConsentEventDetail(newConsent, persisted),
    }));
  }, [consentState, saveConsent]);

  // Open preferences directly. This is separate from the first-visit banner so
  // footer users can review or withdraw consent without reopening two layers.
  const showPreferences = useCallback(() => {
    setPreferencesOpen(true);
  }, []);

  const closePreferences = useCallback(() => {
    setPreferencesOpen(false);
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
    removeStoredConsentSafely();
    setConsentState(DEFAULT_CONSENT_STATE);
    setPreferencesOpen(false);
    
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
    preferencesOpen,
    isHydrated,
    acceptAll,
    acceptSelected,
    rejectAll,
    updateConsent,
    showPreferences,
    closePreferences,
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
