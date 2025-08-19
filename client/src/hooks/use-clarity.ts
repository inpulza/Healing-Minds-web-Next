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
      try {
        Clarity.init(CLARITY_PROJECT_ID);
        initialized.current = true;
        
        // Set initial language tag
        Clarity.setTag('language', language);
        Clarity.setTag('site_type', 'psychiatry_practice');
        Clarity.setTag('practice_location', 'naples_fl');
        
        console.log('Microsoft Clarity initialized successfully with ID:', CLARITY_PROJECT_ID);
      } catch (error) {
        console.error('Failed to initialize Microsoft Clarity:', error);
      }
    } else if (import.meta.env.MODE === 'development') {
      console.log('🔍 Microsoft Clarity disabled in development mode');
    }
  }, []);

  // Update language tag when language changes
  useEffect(() => {
    if (initialized.current) {
      Clarity.setTag('language', language);
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