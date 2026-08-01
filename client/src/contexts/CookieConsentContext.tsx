import React, { createContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { 
  CookieConsentContextType, 
  CookieConsentState, 
  CookieConsent, 
  CookieCategory,
  DEFAULT_CONSENT_STATE 
} from '@/types/cookies';

const STORAGE_KEY = 'hmp_cookie_consent';

function removeStoredConsentSafely(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    // Privacy-restricted browsers may reject every Storage operation. The UI
    // must still hydrate with the default denied state instead of throwing out
    // of the effect that owns the banner.
    console.error('Error clearing cookie consent preferences:', error);
    return false;
  }
}

function parseStoredConsent(value: string): CookieConsentState | null {
  const parsed = JSON.parse(value) as CookieConsentState;
  if (!parsed || typeof parsed !== 'object' || !parsed.consent) {
    return null;
  }

  return {
    ...parsed,
    consentDate: parsed.consentDate ? new Date(parsed.consentDate) : undefined,
    lastUpdated: parsed.lastUpdated ? new Date(parsed.lastUpdated) : undefined,
  };
}

function createConsentEventDetail(
  consent: CookieConsent,
  persisted: boolean,
  effectiveConsent?: CookieConsent,
  categoryPersistence = { analytics: persisted, marketing: persisted },
) {
  // A newly requested grant that cannot be persisted must not open a provider,
  // but an already-persisted category that stayed granted need not be closed.
  // Callers can therefore supply the category-specific effective decision while
  // persisted=false still selects the no-expiry cleanup path for withdrawals.
  const effective = effectiveConsent ?? (persisted
    ? consent
    : { necessary: true, analytics: false, marketing: false });
  const analytics = effective.analytics;
  const marketing = effective.marketing;
  return {
    analytics,
    marketing,
    hasAnalyticsConsent: analytics,
    hasMarketingConsent: marketing,
    persisted,
    analyticsPersisted: categoryPersistence.analytics,
    marketingPersisted: categoryPersistence.marketing,
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
  // If a local withdrawal cannot be persisted, the old grant remains in
  // shared storage. Keep those categories denied in this document until a
  // later local choice saves successfully (or the document is replaced).
  const failedLocalRevocationsRef = useRef({ analytics: false, marketing: false });
  const effectiveConsentRef = useRef<CookieConsent>({ ...DEFAULT_CONSENT_STATE.consent });

  // Load consent from localStorage on initialization
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = parseStoredConsent(stored);
        
        // Validate the stored data structure
        if (parsed) {
          effectiveConsentRef.current = parsed.consent;
          setConsentState(parsed);
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

  // Keep every open tab on the same effective decision. Storage events fire in
  // the other documents only, so rebroadcast the persisted state through the
  // same consentChanged contract used by Google, Clarity and TikTok.
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) {
        return;
      }

      // A remote grant event can already be queued when this tab writes a
      // newer withdrawal. Re-read the shared value and prefer it over a stale
      // event payload before reopening any provider.
      let persistedValue = event.newValue;
      try {
        const currentValue = localStorage.getItem(STORAGE_KEY);
        if (currentValue !== event.newValue) {
          persistedValue = currentValue;
        }
      } catch (error) {
        console.error('Error confirming cross-tab cookie consent state:', error);
      }

      let nextState: CookieConsentState = DEFAULT_CONSENT_STATE;
      try {
        if (persistedValue) {
          const parsed = parseStoredConsent(persistedValue);
          if (parsed) {
            nextState = parsed;
          } else {
            console.warn('Invalid cross-tab cookie consent data, reverting to denied');
          }
        }
      } catch (error) {
        console.error('Error synchronizing cookie consent preferences:', error);
      }

      const failedLocalRevocations = failedLocalRevocationsRef.current;
      const hasFailedLocalRevocation =
        failedLocalRevocations.analytics || failedLocalRevocations.marketing;
      if (hasFailedLocalRevocation) {
        nextState = {
          ...nextState,
          consent: {
            ...nextState.consent,
            analytics: failedLocalRevocations.analytics
              ? false
              : nextState.consent.analytics,
            marketing: failedLocalRevocations.marketing
              ? false
              : nextState.consent.marketing,
          },
        };
      }

      effectiveConsentRef.current = nextState.consent;
      setConsentState(nextState);
      setPreferencesOpen(false);
      window.dispatchEvent(new CustomEvent('consentChanged', {
        // The remote value exists, but any locally-watermarked denial is not
        // represented by it. Keep provider cleanup on the no-expiry path until
        // a later local choice is saved successfully.
        detail: createConsentEventDetail(
          nextState.consent,
          !hasFailedLocalRevocation,
          nextState.consent,
          {
            analytics: !failedLocalRevocations.analytics,
            marketing: !failedLocalRevocations.marketing,
          },
        ),
      }));
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Save consent to localStorage
  const saveConsent = useCallback((newState: CookieConsentState) => {
    const previousEffectiveConsent = effectiveConsentRef.current;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      failedLocalRevocationsRef.current = { analytics: false, marketing: false };
      effectiveConsentRef.current = newState.consent;
      return {
        persisted: true,
        effectiveConsent: newState.consent,
        categoryPersistence: { analytics: true, marketing: true },
      };
    } catch (error) {
      failedLocalRevocationsRef.current = {
        analytics:
          failedLocalRevocationsRef.current.analytics ||
          (previousEffectiveConsent.analytics && !newState.consent.analytics),
        marketing:
          failedLocalRevocationsRef.current.marketing ||
          (previousEffectiveConsent.marketing && !newState.consent.marketing),
      };
      const effectiveConsent = {
        necessary: true,
        analytics: previousEffectiveConsent.analytics && newState.consent.analytics,
        marketing: previousEffectiveConsent.marketing && newState.consent.marketing,
      };
      effectiveConsentRef.current = effectiveConsent;
      console.error('Error saving cookie consent preferences:', error);
      return {
        persisted: false,
        effectiveConsent,
        categoryPersistence: {
          analytics:
            previousEffectiveConsent.analytics === newState.consent.analytics &&
            !failedLocalRevocationsRef.current.analytics,
          marketing:
            previousEffectiveConsent.marketing === newState.consent.marketing &&
            !failedLocalRevocationsRef.current.marketing,
        },
      };
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
    
    setPreferencesOpen(false);
    const saveResult = saveConsent(newState);
    setConsentState({ ...newState, consent: saveResult.effectiveConsent });
    
    // Trigger granular consent update event
    window.dispatchEvent(new CustomEvent('consentChanged', {
      detail: createConsentEventDetail(
        newState.consent,
        saveResult.persisted,
        saveResult.effectiveConsent,
        saveResult.categoryPersistence,
      ),
    }));
  }, [saveConsent]);

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
    
    setPreferencesOpen(false);
    const saveResult = saveConsent(newState);
    setConsentState({ ...newState, consent: saveResult.effectiveConsent });
    
    // Trigger granular consent event if any consent changed
    if (partialConsent.analytics !== undefined || partialConsent.marketing !== undefined) {
      window.dispatchEvent(new CustomEvent('consentChanged', {
        detail: createConsentEventDetail(
          newConsent,
          saveResult.persisted,
          saveResult.effectiveConsent,
          saveResult.categoryPersistence,
        ),
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
    
    setPreferencesOpen(false);
    const saveResult = saveConsent(newState);
    setConsentState({ ...newState, consent: saveResult.effectiveConsent });
    
    // Trigger granular consent update event
    window.dispatchEvent(new CustomEvent('consentChanged', {
      detail: createConsentEventDetail(
        newState.consent,
        saveResult.persisted,
        saveResult.effectiveConsent,
        saveResult.categoryPersistence,
      ),
    }));
  }, [saveConsent]);

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
    
    const saveResult = saveConsent(newState);
    setConsentState({ ...newState, consent: saveResult.effectiveConsent });
    
    // Trigger granular consent event for category changes
    window.dispatchEvent(new CustomEvent('consentChanged', {
      detail: createConsentEventDetail(
        newConsent,
        saveResult.persisted,
        saveResult.effectiveConsent,
        saveResult.categoryPersistence,
      ),
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
    const previousEffectiveConsent = effectiveConsentRef.current;
    const persisted = removeStoredConsentSafely();
    failedLocalRevocationsRef.current = persisted
      ? { analytics: false, marketing: false }
      : {
          analytics:
            failedLocalRevocationsRef.current.analytics || previousEffectiveConsent.analytics,
          marketing:
            failedLocalRevocationsRef.current.marketing || previousEffectiveConsent.marketing,
        };
    effectiveConsentRef.current = { ...DEFAULT_CONSENT_STATE.consent };
    setConsentState(DEFAULT_CONSENT_STATE);
    setPreferencesOpen(false);
    
    // Trigger granular consent reset event
    window.dispatchEvent(new CustomEvent('consentChanged', { 
      detail: createConsentEventDetail(
        DEFAULT_CONSENT_STATE.consent,
        persisted,
        DEFAULT_CONSENT_STATE.consent,
        {
          analytics: !failedLocalRevocationsRef.current.analytics,
          marketing: !failedLocalRevocationsRef.current.marketing,
        },
      ),
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
