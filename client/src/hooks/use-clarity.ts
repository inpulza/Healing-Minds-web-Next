import { useEffect, useRef } from 'react';
import Clarity from '@microsoft/clarity';
import { useLanguage } from './useLanguage';

const CLARITY_PROJECT_ID = 'sxayts0dzk';

export function useClarity() {
  const { language } = useLanguage();
  const initialized = useRef(false);

  useEffect(() => {
    // Only initialize in production environment
    if (import.meta.env.MODE === 'production' && !initialized.current) {
      // Defer initialization to avoid blocking critical rendering path
      const initClarity = () => {
        try {
          Clarity.init(CLARITY_PROJECT_ID);
          initialized.current = true;
          
          // Set initial language tag after idle callback to prevent reflows
          requestIdleCallback(() => {
            Clarity.setTag('language', language);
            Clarity.setTag('site_type', 'psychiatry_practice');
            Clarity.setTag('practice_location', 'naples_fl');
          });
          
          console.log('Microsoft Clarity initialized successfully with ID:', CLARITY_PROJECT_ID);
        } catch (error) {
          console.error('Failed to initialize Microsoft Clarity:', error);
        }
      };
      
      // Use requestIdleCallback to defer initialization
      if ('requestIdleCallback' in window) {
        requestIdleCallback(initClarity);
      } else {
        setTimeout(initClarity, 100);
      }
    } else if (import.meta.env.MODE === 'development') {
      console.log('🔍 Microsoft Clarity disabled in development mode');
    }
  }, []);

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