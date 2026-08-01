// Cookie consent types for FDBR/CCPA compliance

export type CookieCategory = 'necessary' | 'analytics' | 'marketing';

export interface CookieConsent {
  necessary: boolean;   // Always true - required for basic functionality
  analytics: boolean;   // Google Analytics, Microsoft Clarity
  marketing: boolean;   // Google Ads, remarketing, etc.
}

export interface CookieConsentState {
  hasConsented: boolean;
  showBanner: boolean;
  consent: CookieConsent;
  consentDate?: Date;
  lastUpdated?: Date;
}

export interface CookieConsentContextType {
  // State
  consentState: CookieConsentState;
  preferencesOpen: boolean;
  
  // Actions
  acceptAll: () => void;
  acceptSelected: (consent: Partial<CookieConsent>) => void;
  rejectAll: () => void;
  updateConsent: (category: CookieCategory, value: boolean) => void;
  showPreferences: () => void;
  closePreferences: () => void;
  hideBanner: () => void;
  resetConsent: () => void;
  
  // Utilities
  hasConsent: (category: CookieCategory) => boolean;
  canLoadAnalytics: () => boolean;
  canLoadMarketing: () => boolean;
  getConsentString: () => string;
}

export interface CookieInfo {
  category: CookieCategory;
  name: string;
  description: {
    en: string;
    es: string;
  };
  provider: string;
  purpose: {
    en: string;
    es: string;
  };
  expiry: string;
  type: 'persistent' | 'session' | 'local_storage';
}

// Default consent state
export const DEFAULT_CONSENT_STATE: CookieConsentState = {
  hasConsented: false,
  showBanner: true,
  consent: {
    necessary: true,
    analytics: false,
    marketing: false,
  },
  consentDate: undefined,
  lastUpdated: undefined,
};
