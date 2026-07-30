import { useEffect, useRef, useCallback } from 'react';
import Clarity from '@microsoft/clarity';
import { useLanguage } from './useLanguage';

function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

const CLARITY_PROJECT_ID = 'sxayts0dzk';

// Global guards to prevent multiple initializations across all hook instances
let globalClarityInitialized = false;
let globalInitializationTimestamp: number | null = null;
let globalConsentRevoked = false;

// Check if analytics consent is granted for Microsoft Clarity
function hasAnalyticsConsent(): boolean {
  try {
    const stored = localStorage.getItem('hmp_cookie_consent');
    if (stored) {
      const consent = JSON.parse(stored);
      return consent?.hasConsented && consent?.consent?.analytics;
    }
  } catch (error) {
    console.error('Error checking analytics consent for Clarity:', error);
  }
  return false;
}

// Clear Microsoft Clarity cookies for FDBR compliance
function clearClarityCookies(): void {
  const cookiesToClear = ['_clck', '_clsk'];
  
  cookiesToClear.forEach(cookie => {
    document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;
    document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  });
  
  console.log('🧹 Microsoft Clarity cookies cleared for compliance');
}

// Safe hook to get language, returns 'en' if provider is not available
function useSafeLanguage(): string {
  try {
    const { language } = useLanguage();
    return language;
  } catch (error) {
    // If LanguageProvider is not available, default to 'en'
    if (isDevelopment()) {
      console.warn('🔍 useLanguage not available in Clarity hook, defaulting to English');
    }
    return 'en';
  }
}

export function useClarity() {
  const language = useSafeLanguage();
  const initialized = useRef(false);
  const consentRevoked = useRef(false);

  // Initialize Clarity when consent is available
  const initClarity = useCallback(() => {
    if (isDevelopment()) {
      if (isDevelopment()) {
        console.log('🔍 Microsoft Clarity disabled in development mode');
      }
      return;
    }

    // Enhanced global guards to prevent multiple initializations
    const currentTimestamp = Date.now();
    const recentInitialization = globalInitializationTimestamp && 
      (currentTimestamp - globalInitializationTimestamp) < 3000; // 3 second cooldown
    
    if (globalClarityInitialized || 
        initialized.current || 
        globalConsentRevoked || 
        consentRevoked.current ||
        recentInitialization) {
      if (isDevelopment()) {
        console.log('🔍 Microsoft Clarity already initialized or blocked, skipping');
      }
      return;
    }

    // Set initialization timestamp to prevent rapid re-initialization
    globalInitializationTimestamp = currentTimestamp;

    try {
      // Check if Clarity is already loaded in the page
      if ((window as any).clarity && typeof (window as any).clarity === 'function') {
        if (isDevelopment()) {
          console.log('🔍 Microsoft Clarity already loaded in page, skipping init');
        }
        globalClarityInitialized = true;
        initialized.current = true;
        return;
      }

      Clarity.init(CLARITY_PROJECT_ID);
      globalClarityInitialized = true;
      initialized.current = true;
      consentRevoked.current = false;
      globalConsentRevoked = false;
      
      // Set initial language tag after idle callback to prevent reflows
      requestIdleCallback(() => {
        if (globalClarityInitialized && initialized.current) {
          Clarity.setTag('language', language);
          Clarity.setTag('site_type', 'psychiatry_practice');
          Clarity.setTag('practice_location', 'naples_fl');
        }
      });
      
      console.log('🔍 Microsoft Clarity initialized successfully with ID:', CLARITY_PROJECT_ID);
    } catch (error) {
      console.error('Failed to initialize Microsoft Clarity:', error);
      globalClarityInitialized = false;
      globalInitializationTimestamp = null;
    }
  }, [language]);

  // Handle consent revocation with cookie cleanup
  // Gate on GLOBAL flags: any hook instance must be able to revoke, even if a
  // different instance performed the initialization.
  const revokeClarity = useCallback(() => {
    if (globalClarityInitialized && !globalConsentRevoked) {
      try {
        // Disable further tracking
        Clarity.consent(false);
        consentRevoked.current = true;
        globalConsentRevoked = true;
        
        // Clear Clarity cookies for FDBR compliance
        clearClarityCookies();
        
        console.log('🚫 Microsoft Clarity consent revoked - tracking disabled and cookies cleared');
      } catch (error) {
        console.error('Error revoking Microsoft Clarity consent:', error);
      }
    }
  }, []);

  // Initial setup and consent change listener
  useEffect(() => {
    // Check initial consent state and initialize if available
    if (process.env.NODE_ENV === 'production' && hasAnalyticsConsent()) {
      initClarity();
    } else if (isDevelopment()) {
      if (isDevelopment()) {
        console.log('🔍 Microsoft Clarity disabled in development mode');
      }
    } else if (process.env.NODE_ENV === 'production') {
      if (isDevelopment()) {
        console.log('🚫 Microsoft Clarity not initialized - no analytics consent');
      }
    }

    // Listen for granular consent changes
    const handleConsentChange = (event: CustomEvent) => {
      const { analytics, marketing, hasAnalyticsConsent, hasMarketingConsent } = event.detail;
      // Microsoft Clarity uses analytics consent (not marketing)
      const analyticsGranted = analytics ?? hasAnalyticsConsent;
      
      if (analyticsGranted) {
        // Reset revoked state and initialize if not already done
        consentRevoked.current = false;
        globalConsentRevoked = false;
        if (!initialized.current && !globalClarityInitialized) {
          initClarity();
        } else {
          // Re-enable tracking if it was previously revoked
          try {
            if (globalClarityInitialized) {
              Clarity.consent(true);
              console.log('🔍 Microsoft Clarity consent restored - analytics tracking enabled');
            }
          } catch (error) {
            console.error('Error restoring Microsoft Clarity consent:', error);
          }
        }
      } else {
        revokeClarity();
      }
    };

    // Add event listener for granular consent changes
    window.addEventListener('consentChanged', handleConsentChange as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('consentChanged', handleConsentChange as EventListener);
    };
    // OPTIMIZED DEPENDENCIES: Remove language from dependencies to prevent unnecessary re-runs
    // initClarity already has language in its useCallback dependencies
  }, [initClarity, revokeClarity]);

  // Update language tag when language changes - with throttling to prevent reflows
  useEffect(() => {
    if (globalClarityInitialized && initialized.current) {
      // Use requestIdleCallback to prevent forced reflows
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          try {
            Clarity.setTag('language', language);
          } catch (error) {
            if (isDevelopment()) {
              console.warn('Failed to update Clarity language tag:', error);
            }
          }
        });
      } else {
        setTimeout(() => {
          try {
            Clarity.setTag('language', language);
          } catch (error) {
            if (isDevelopment()) {
              console.warn('Failed to update Clarity language tag:', error);
            }
          }
        }, 50);
      }
    }
  }, [language]); // Keep language dependency but check global state before execution

  // Return Clarity API methods for custom tracking.
  // IMPORTANT: gate on GLOBAL flags, not per-instance refs. Clarity is
  // initialized once globally, but many components create their own hook
  // instance; a per-instance ref would silently drop their events.
  return {
    setTag: (key: string, value: string | string[]) => {
      if (globalClarityInitialized && !globalConsentRevoked) {
        Clarity.setTag(key, value);
      }
    },
    
    trackEvent: (eventName: string) => {
      if (globalClarityInitialized && !globalConsentRevoked) {
        Clarity.event(eventName);
      }
    },
    
    identify: (customId: string, sessionId?: string, pageId?: string, friendlyName?: string) => {
      if (globalClarityInitialized && !globalConsentRevoked) {
        Clarity.identify(customId, sessionId, pageId, friendlyName);
      }
    },
    
    consent: (hasConsent: boolean = true) => {
      if (globalClarityInitialized) {
        Clarity.consent(hasConsent);
      }
    },
    
    upgrade: (reason: string) => {
      if (globalClarityInitialized && !globalConsentRevoked) {
        Clarity.upgrade(reason);
      }
    }
  };
}
