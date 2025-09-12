import { useEffect, useRef, useCallback } from 'react';
import Clarity from '@microsoft/clarity';
import { useLanguage } from './useLanguage';

const CLARITY_PROJECT_ID = 'sxayts0dzk';

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

export function useClarity() {
  const { language } = useLanguage();
  const initialized = useRef(false);
  const consentRevoked = useRef(false);

  // Initialize Clarity when consent is available
  const initClarity = useCallback(() => {
    if (import.meta.env.MODE === 'development') {
      console.log('🔍 Microsoft Clarity disabled in development mode');
      return;
    }

    if (initialized.current || consentRevoked.current) {
      return; // Already initialized or consent was revoked
    }

    try {
      Clarity.init(CLARITY_PROJECT_ID);
      initialized.current = true;
      consentRevoked.current = false;
      
      // Set initial language tag after idle callback to prevent reflows
      requestIdleCallback(() => {
        if (initialized.current) {
          Clarity.setTag('language', language);
          Clarity.setTag('site_type', 'psychiatry_practice');
          Clarity.setTag('practice_location', 'naples_fl');
        }
      });
      
      console.log('🔍 Microsoft Clarity initialized successfully with ID:', CLARITY_PROJECT_ID);
    } catch (error) {
      console.error('Failed to initialize Microsoft Clarity:', error);
    }
  }, [language]);

  // Handle consent revocation with cookie cleanup
  const revokeClarity = useCallback(() => {
    if (initialized.current && !consentRevoked.current) {
      try {
        // Disable further tracking
        Clarity.consent(false);
        consentRevoked.current = true;
        
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
    if (import.meta.env.MODE === 'production' && hasAnalyticsConsent()) {
      initClarity();
    } else if (import.meta.env.MODE === 'development') {
      console.log('🔍 Microsoft Clarity disabled in development mode');
    } else if (import.meta.env.MODE === 'production') {
      console.log('🚫 Microsoft Clarity not initialized - no analytics consent');
    }

    // Listen for granular consent changes
    const handleConsentChange = (event: CustomEvent) => {
      const { analytics, marketing, hasAnalyticsConsent, hasMarketingConsent } = event.detail;
      // Microsoft Clarity uses analytics consent (not marketing)
      const analyticsGranted = analytics ?? hasAnalyticsConsent;
      
      if (analyticsGranted) {
        // Reset revoked state and initialize if not already done
        consentRevoked.current = false;
        if (!initialized.current) {
          initClarity();
        } else {
          // Re-enable tracking if it was previously revoked
          try {
            Clarity.consent(true);
            console.log('🔍 Microsoft Clarity consent restored - analytics tracking enabled');
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
  }, [initClarity, revokeClarity]);

  // Update language tag when language changes - with throttling to prevent reflows
  useEffect(() => {
    if (initialized.current) {
      // Use requestIdleCallback to prevent forced reflows
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          Clarity.setTag('language', language);
        });
      } else {
        setTimeout(() => {
          Clarity.setTag('language', language);
        }, 50);
      }
    }
  }, [language]);

  // Return Clarity API methods for custom tracking
  return {
    setTag: (key: string, value: string | string[]) => {
      if (initialized.current) {
        Clarity.setTag(key, value);
      }
    },
    
    trackEvent: (eventName: string) => {
      if (initialized.current) {
        Clarity.event(eventName);
      }
    },
    
    identify: (customId: string, sessionId?: string, pageId?: string, friendlyName?: string) => {
      if (initialized.current) {
        Clarity.identify(customId, sessionId, pageId, friendlyName);
      }
    },
    
    consent: (hasConsent: boolean = true) => {
      if (initialized.current) {
        Clarity.consent(hasConsent);
      }
    },
    
    upgrade: (reason: string) => {
      if (initialized.current) {
        Clarity.upgrade(reason);
      }
    }
  };
}