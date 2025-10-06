import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';

const TIKTOK_PIXEL_ID = 'D3HT9QRC77UAH4NB96KG';

// Global guards to prevent multiple initializations
let globalTikTokInitialized = false;
let globalInitializationTimestamp: number | null = null;
let globalConsentRevoked = false;

// Declare TikTok global type
declare global {
  interface Window {
    ttq?: any;
    TiktokAnalyticsObject?: string;
  }
}

// Check if marketing consent is granted for TikTok Pixel
function hasMarketingConsent(): boolean {
  try {
    const stored = localStorage.getItem('hmp_cookie_consent');
    if (stored) {
      const consent = JSON.parse(stored);
      return consent?.hasConsented && consent?.consent?.marketing;
    }
  } catch (error) {
    console.error('Error checking marketing consent for TikTok:', error);
  }
  return false;
}

// Clear TikTok cookies for GDPR compliance
function clearTikTokCookies(): void {
  const cookiesToClear = ['_ttp', '_tt_enable_cookie', '_ttp_pixel'];
  
  cookiesToClear.forEach(cookie => {
    document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;
    document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  });
  
  console.log('🧹 TikTok Pixel cookies cleared for compliance');
}

// Load TikTok Pixel script
function loadTikTokPixel(): void {
  if (typeof window === 'undefined') return;
  
  const w = window as any;
  const d = document;
  const t = 'ttq';
  
  w.TiktokAnalyticsObject = t;
  const ttq = w[t] = w[t] || [];
  
  ttq.methods = [
    "page", "track", "identify", "instances", "debug", "on", "off", 
    "once", "ready", "alias", "group", "enableCookie", "disableCookie", 
    "holdConsent", "revokeConsent", "grantConsent"
  ];
  
  ttq.setAndDefer = function(t: any, e: string) {
    t[e] = function() {
      t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
    };
  };
  
  for (let i = 0; i < ttq.methods.length; i++) {
    ttq.setAndDefer(ttq, ttq.methods[i]);
  }
  
  ttq.instance = function(t: string) {
    const e = ttq._i[t] || [];
    for (let n = 0; n < ttq.methods.length; n++) {
      ttq.setAndDefer(e, ttq.methods[n]);
    }
    return e;
  };
  
  ttq.load = function(e: string, n?: any) {
    const r = "https://analytics.tiktok.com/i18n/pixel/events.js";
    const o = n && n.partner;
    ttq._i = ttq._i || {};
    ttq._i[e] = [];
    ttq._i[e]._u = r;
    ttq._t = ttq._t || {};
    ttq._t[e] = +new Date();
    ttq._o = ttq._o || {};
    ttq._o[e] = n || {};
    
    const scriptElement = d.createElement("script");
    scriptElement.type = "text/javascript";
    scriptElement.async = true;
    scriptElement.src = r + "?sdkid=" + e + "&lib=" + t;
    
    const firstScript = d.getElementsByTagName("script")[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(scriptElement, firstScript);
    }
  };
  
  // Load the pixel
  ttq.load(TIKTOK_PIXEL_ID);
  ttq.page();
}

export function useTikTokPixel() {
  const initialized = useRef(false);
  const consentRevoked = useRef(false);
  const [location] = useLocation();
  const previousLocation = useRef(location);

  // Initialize TikTok Pixel when consent is available
  const initTikTokPixel = useCallback(() => {
    if (import.meta.env.MODE === 'development') {
      if (import.meta.env.DEV) {
        console.log('🎵 TikTok Pixel disabled in development mode');
      }
      return;
    }

    // Enhanced global guards to prevent multiple initializations
    const currentTimestamp = Date.now();
    const recentInitialization = globalInitializationTimestamp && 
      (currentTimestamp - globalInitializationTimestamp) < 3000; // 3 second cooldown
    
    if (globalTikTokInitialized || 
        initialized.current || 
        globalConsentRevoked || 
        consentRevoked.current ||
        recentInitialization) {
      if (import.meta.env.DEV) {
        console.log('🎵 TikTok Pixel already initialized or blocked, skipping');
      }
      return;
    }

    // Set initialization timestamp to prevent rapid re-initialization
    globalInitializationTimestamp = currentTimestamp;

    try {
      // Check if TikTok Pixel is already loaded
      if (window.ttq && typeof window.ttq.page === 'function') {
        if (import.meta.env.DEV) {
          console.log('🎵 TikTok Pixel already loaded in page, skipping init');
        }
        globalTikTokInitialized = true;
        initialized.current = true;
        return;
      }

      loadTikTokPixel();
      globalTikTokInitialized = true;
      initialized.current = true;
      consentRevoked.current = false;
      globalConsentRevoked = false;
      
      console.log('🎵 TikTok Pixel initialized successfully with ID:', TIKTOK_PIXEL_ID);
    } catch (error) {
      console.error('Failed to initialize TikTok Pixel:', error);
      globalTikTokInitialized = false;
      globalInitializationTimestamp = null;
    }
  }, []);

  // Handle consent revocation with cookie cleanup
  const revokeTikTokPixel = useCallback(() => {
    if (initialized.current && !consentRevoked.current) {
      try {
        // Revoke consent
        if (window.ttq && typeof window.ttq.revokeConsent === 'function') {
          window.ttq.revokeConsent();
        }
        consentRevoked.current = true;
        globalConsentRevoked = true;
        
        // Clear TikTok cookies for GDPR compliance
        clearTikTokCookies();
        
        console.log('🚫 TikTok Pixel consent revoked - tracking disabled and cookies cleared');
      } catch (error) {
        console.error('Error revoking TikTok Pixel consent:', error);
      }
    }
  }, []);

  // Initial setup and consent change listener
  useEffect(() => {
    // Check initial consent state and initialize if available
    if (import.meta.env.MODE === 'production' && hasMarketingConsent()) {
      initTikTokPixel();
    } else if (import.meta.env.MODE === 'development') {
      if (import.meta.env.DEV) {
        console.log('🎵 TikTok Pixel disabled in development mode');
      }
    } else if (import.meta.env.MODE === 'production') {
      if (import.meta.env.DEV) {
        console.log('🚫 TikTok Pixel not initialized - no marketing consent');
      }
    }

    // Listen for granular consent changes
    const handleConsentChange = (event: CustomEvent) => {
      const { marketing, hasMarketingConsent } = event.detail;
      // TikTok Pixel uses marketing consent
      const marketingGranted = marketing ?? hasMarketingConsent;
      
      if (marketingGranted) {
        // Reset revoked state and initialize if not already done
        consentRevoked.current = false;
        globalConsentRevoked = false;
        if (!initialized.current && !globalTikTokInitialized) {
          initTikTokPixel();
        } else {
          // Re-enable tracking if it was previously revoked
          try {
            if (globalTikTokInitialized && window.ttq && typeof window.ttq.grantConsent === 'function') {
              window.ttq.grantConsent();
              console.log('🎵 TikTok Pixel consent restored - marketing tracking enabled');
            }
          } catch (error) {
            console.error('Error restoring TikTok Pixel consent:', error);
          }
        }
      } else {
        revokeTikTokPixel();
      }
    };

    // Add event listener for granular consent changes
    window.addEventListener('consentChanged', handleConsentChange as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('consentChanged', handleConsentChange as EventListener);
    };
  }, [initTikTokPixel, revokeTikTokPixel]);

  // Track page views on route change
  useEffect(() => {
    if (globalTikTokInitialized && initialized.current && !consentRevoked.current) {
      // Only track if the location has actually changed
      if (location !== previousLocation.current) {
        previousLocation.current = location;
        
        // Use requestIdleCallback to prevent forced reflows
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            try {
              if (window.ttq && typeof window.ttq.page === 'function') {
                window.ttq.page();
                if (import.meta.env.DEV) {
                  console.log('🎵 TikTok Pixel page view tracked:', location);
                }
              }
            } catch (error) {
              if (import.meta.env.DEV) {
                console.warn('Failed to track TikTok page view:', error);
              }
            }
          });
        } else {
          setTimeout(() => {
            try {
              if (window.ttq && typeof window.ttq.page === 'function') {
                window.ttq.page();
                if (import.meta.env.DEV) {
                  console.log('🎵 TikTok Pixel page view tracked:', location);
                }
              }
            } catch (error) {
              if (import.meta.env.DEV) {
                console.warn('Failed to track TikTok page view:', error);
              }
            }
          }, 50);
        }
      }
    }
  }, [location]);

  // Return TikTok Pixel API methods for custom tracking
  return {
    track: (eventName: string, properties?: Record<string, any>) => {
      if (initialized.current && !consentRevoked.current && window.ttq) {
        try {
          window.ttq.track(eventName, properties);
        } catch (error) {
          if (import.meta.env.DEV) {
            console.warn('Failed to track TikTok event:', error);
          }
        }
      }
    },
    
    identify: (userData: Record<string, any>) => {
      if (initialized.current && !consentRevoked.current && window.ttq) {
        try {
          window.ttq.identify(userData);
        } catch (error) {
          if (import.meta.env.DEV) {
            console.warn('Failed to identify user in TikTok Pixel:', error);
          }
        }
      }
    },
    
    page: () => {
      if (initialized.current && !consentRevoked.current && window.ttq) {
        try {
          window.ttq.page();
        } catch (error) {
          if (import.meta.env.DEV) {
            console.warn('Failed to track TikTok page:', error);
          }
        }
      }
    }
  };
}
