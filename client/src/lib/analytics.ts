// Google Analytics 4 integration with Google Consent Mode v2 and cookie consent support
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    hmp_analytics_initialized?: boolean;
    hmp_consent_mode_initialized?: boolean;
    hmp_ga_script_loaded?: boolean;
    hmp_init_timestamp?: number;
  }
}

// Check if analytics consent is granted
function hasAnalyticsConsent(): boolean {
  try {
    const stored = localStorage.getItem('hmp_cookie_consent');
    if (stored) {
      const consent = JSON.parse(stored);
      return consent?.hasConsented && consent?.consent?.analytics;
    }
  } catch (error) {
    console.error('Error checking analytics consent:', error);
  }
  return false;
}

// Check if marketing consent is granted
function hasMarketingConsent(): boolean {
  try {
    const stored = localStorage.getItem('hmp_cookie_consent');
    if (stored) {
      const consent = JSON.parse(stored);
      return consent?.hasConsented && consent?.consent?.marketing;
    }
  } catch (error) {
    console.error('Error checking marketing consent:', error);
  }
  return false;
}

// Initialize Google Consent Mode v2 with default denied state
function initConsentMode(): void {
  // Enhanced guard: Check multiple conditions to prevent duplicate initialization
  if (window.hmp_consent_mode_initialized || 
      (window.dataLayer && window.gtag && typeof window.gtag === 'function')) {
    if (import.meta.env.DEV) {
      console.log('🔒 Google Consent Mode already initialized, skipping');
    }
    return;
  }

  // Initialize dataLayer first to prevent errors
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: any[]) {
    window.dataLayer.push(arguments);
  };

  // Set default consent state (all denied) - REQUIRED for Google Consent Mode v2
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500, // milliseconds to wait for update
  });

  window.hmp_consent_mode_initialized = true;
  console.log('🔒 Google Consent Mode v2 initialized with default denied state');
}

// Update consent based on user preferences with proper category separation
export function updateGoogleConsent(analyticsConsent: boolean, marketingConsent: boolean): void {
  if (!window.hmp_consent_mode_initialized) {
    initConsentMode();
  }

  if (typeof window.gtag !== 'undefined') {
    // Use requestIdleCallback to defer consent updates
    const updateConsent = () => {
      window.gtag('consent', 'update', {
        analytics_storage: analyticsConsent ? 'granted' : 'denied',
        ad_storage: marketingConsent ? 'granted' : 'denied',
        ad_user_data: marketingConsent ? 'granted' : 'denied',
        ad_personalization: marketingConsent ? 'granted' : 'denied',
      });

      console.log(`🔄 Google Consent updated: analytics_storage=${analyticsConsent ? 'granted' : 'denied'}, ad_storage=${marketingConsent ? 'granted' : 'denied'}`);
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(updateConsent);
    } else {
      setTimeout(updateConsent, 50);
    }
  }
}

// Initialize Google Analytics with deferred loading and performance optimization
export function initGA(): void {
  // Skip if already initialized or in development mode
  if (import.meta.env.DEV) {
    console.log('📊 Google Analytics initialization skipped in development mode');
    return;
  }
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  
  if (!measurementId) {
    console.warn('Google Analytics measurement ID not provided');
    return;
  }

  // Enhanced guard: Multiple checks to prevent duplicate initialization
  const currentTimestamp = Date.now();
  const existingScript = document.querySelector(`script[src*="gtag/js?id=${measurementId}"]`);
  const recentInitialization = window.hmp_init_timestamp && 
    (currentTimestamp - window.hmp_init_timestamp) < 5000; // 5 second cooldown
  
  if (window.hmp_analytics_initialized || 
      window.hmp_ga_script_loaded || 
      existingScript || 
      recentInitialization) {
    if (import.meta.env.DEV) {
      console.log('📊 Google Analytics already initialized or in progress, skipping');
    }
    return;
  }

  // Mark initialization timestamp to prevent rapid re-initialization
  window.hmp_init_timestamp = currentTimestamp;

  // Initialize consent mode first
  initConsentMode();

  // Defer GA initialization to avoid blocking critical rendering path
  const initializeGA = () => {
    // Final check before script creation
    if (window.hmp_ga_script_loaded || document.querySelector(`script[src*="gtag/js?id=${measurementId}"]`)) {
      return;
    }
    
    // Mark script as being loaded
    window.hmp_ga_script_loaded = true;
    
    // Create script tag for Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.setAttribute('data-hmp-analytics', 'true'); // Identify our script
    
    // Load script after DOM is interactive
    script.onload = () => {
      // Use requestIdleCallback to defer configuration
      const configureGA = () => {
        // Final check before configuration
        if (window.hmp_analytics_initialized) {
          return;
        }
        
        window.gtag('js', new Date());
        window.gtag('config', measurementId, {
          page_title: document.title,
          page_location: window.location.href,
          send_page_view: hasAnalyticsConsent(), // Only send if consent is available
          allow_enhanced_conversions: true,
          custom_map: {
            'custom_1': 'service_type',
            'custom_2': 'language_preference'
          }
        });
        
        // Update consent based on current state
        updateGoogleConsent(hasAnalyticsConsent(), hasMarketingConsent());
        
        // Mark as initialized
        window.hmp_analytics_initialized = true;
        
        if (import.meta.env.DEV) {
          console.log('📊 Google Analytics initialized successfully with ID:', measurementId);
        }
      };
      
      if ('requestIdleCallback' in window) {
        requestIdleCallback(configureGA, { timeout: 2000 });
      } else {
        setTimeout(configureGA, 100);
      }
    };
    
    script.onerror = () => {
      console.error('Failed to load Google Analytics script');
      window.hmp_ga_script_loaded = false;
    };
    
    document.head.appendChild(script);
  };
  
  // Defer GA initialization until user interaction or after delay
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupDeferredGA(initializeGA);
    });
  } else {
    setupDeferredGA(initializeGA);
  }
}

// Setup deferred Google Analytics loading to eliminate initial bundle bloat
function setupDeferredGA(initializeGA: () => void): void {
  let gaInitialized = false;
  
  const triggerGA = () => {
    if (gaInitialized) return;
    gaInitialized = true;
    
    if ('requestIdleCallback' in window) {
      requestIdleCallback(initializeGA, { timeout: 2000 });
    } else {
      setTimeout(initializeGA, 100);
    }
  };
  
  // Strategy 1: Load on first user interaction (scroll, click, keydown)
  const interactionEvents = ['scroll', 'click', 'keydown', 'touchstart', 'mousemove'];
  const handleFirstInteraction = () => {
    triggerGA();
    // Remove listeners after first interaction
    interactionEvents.forEach(event => {
      document.removeEventListener(event, handleFirstInteraction);
    });
  };
  
  // Add passive listeners for performance
  interactionEvents.forEach(event => {
    document.addEventListener(event, handleFirstInteraction, { passive: true });
  });
  
  // Strategy 2: Fallback - Load after 5 seconds if no interaction
  setTimeout(() => {
    if (!gaInitialized) {
      triggerGA();
    }
  }, 5000);
  
  // Strategy 3: Load when page becomes visible (if user switches tabs)
  if ('requestIdleCallback' in window) {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !gaInitialized) {
        triggerGA();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }
}

// Track page views with throttling to prevent performance impact
export function trackPageView(path: string, title?: string): void {
  if (!hasAnalyticsConsent()) {
    return;
  }
  
  if (typeof window.gtag !== 'undefined') {
    // Use requestIdleCallback to defer tracking calls
    const trackPage = () => {
      window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
        page_path: path,
        page_title: title || document.title,
      });
    };
    
    if ('requestIdleCallback' in window) {
      requestIdleCallback(trackPage);
    } else {
      setTimeout(trackPage, 50);
    }
  }
}

// Track custom events with performance optimization
export function trackEvent(action: string, category: string, label?: string, value?: number): void {
  if (!hasAnalyticsConsent()) {
    return;
  }
  
  if (typeof window.gtag !== 'undefined') {
    const trackEventDeferred = () => {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });

      if (import.meta.env.DEV) {
        console.log('GA Event tracked:', { action, category, label, value });
      }
    };
    
    // Defer event tracking to prevent blocking UI
    if ('requestIdleCallback' in window) {
      requestIdleCallback(trackEventDeferred);
    } else {
      setTimeout(trackEventDeferred, 25);
    }
  }
}

// Lightweight tracking functions with lazy loading
export const trackServicePageView = (serviceName: string, language: 'en' | 'es' = 'en'): void => {
  if (!hasAnalyticsConsent()) return;
  
  // Use dynamic loading for performance
  requestIdleCallback(() => {
    trackEvent('service_page_view', 'medical_services', serviceName, undefined);
    
    // Track language preference
    window.gtag?.('event', 'language_selection', {
      event_category: 'user_preference',
      event_label: language,
      custom_1: serviceName,
      custom_2: language
    });
  });
};

// Optimized contact form tracking
export const trackContactFormEvent = (action: 'start' | 'submit' | 'error', formType: string = 'general'): void => {
  if (!hasAnalyticsConsent()) return;
  requestIdleCallback(() => trackEvent(`contact_form_${action}`, 'lead_generation', formType));
};

// Optimized insurance click tracking
export const trackInsuranceClick = (insuranceName: string): void => {
  if (!hasAnalyticsConsent()) return;
  requestIdleCallback(() => trackEvent('insurance_logo_click', 'user_engagement', insuranceName));
};

// Handle granular consent changes for FDBR compliance
export function handleConsentChange(analyticsConsent: boolean, marketingConsent: boolean): void {
  // Update Google Consent Mode v2 with granular consent
  updateGoogleConsent(analyticsConsent, marketingConsent);

  if (analyticsConsent) {
    // Initialize analytics if consent is granted and not already initialized
    if (!window.hmp_analytics_initialized && !window.hmp_ga_script_loaded) {
      console.log('🔄 Initializing Google Analytics after analytics consent granted');
      initGA();
    } else {
      console.log('🔄 Google Analytics consent granted - tracking enabled');
    }
  } else {
    // Analytics consent revoked - keep GA loaded but with denied consent state
    if (window.hmp_analytics_initialized) {
      console.log('🚫 Google Analytics consent revoked - tracking disabled via Consent Mode');
      
      // Clear analytics cookies for compliance
      clearAnalyticsCookies();
    } else {
      console.log('🚫 Google Analytics consent revoked - never initialized');
    }
  }
  
  // Log marketing consent changes for compliance tracking (only in dev for debugging)
  if (import.meta.env.DEV) {
    if (marketingConsent) {
      console.log('🔄 Marketing consent granted - ad tracking enabled');
    } else {
      console.log('🚫 Marketing consent revoked - ad tracking disabled');
    }
  }
}

// Lightweight analytics loader with dynamic import for bundle optimization
export async function loadAnalyticsModule(): Promise<void> {
  if (window.hmp_analytics_initialized) {
    return;
  }
  
  try {
    // Dynamic import reduces initial bundle size
    const { initGA: dynamicInitGA } = await import('./analytics');
    dynamicInitGA();
  } catch (error) {
    console.error('Failed to load analytics module:', error);
  }
}

// Clear analytics cookies when consent is revoked
function clearAnalyticsCookies(): void {
  const cookiesToClear = ['_ga', '_ga_' + import.meta.env.VITE_GA_MEASUREMENT_ID?.replace('G-', ''), '_gid', '_gat'];
  
  cookiesToClear.forEach(cookie => {
    document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;
    document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  });
}