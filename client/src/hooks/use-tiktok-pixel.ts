import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from '@/lib/navigation';
import {
  bumpConsentGeneration,
  claimPageView,
  isCurrentPageView,
  markPageViewTracked,
} from '@/lib/pixel-page-view';
import { clearFirstPartyCookies } from '@/lib/cookie-cleanup';

function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

const TIKTOK_PIXEL_ID = 'D3IKI7BC77UEJB9HBO0G';

// Global guards to prevent multiple initializations
let globalTikTokInitialized = false;
let globalInitializationTimestamp: number | null = null;
let globalConsentRevoked = false;

/**
 * Single page-view emitter, shared by the route effect and the consent
 * listeners. Dedupe lives in pixel-page-view at module scope because App.tsx,
 * Footer and several pages each mount their own useTikTokPixel(): per-instance
 * state would emit one ttq.page() per mounted instance and inflate metrics.
 */
function emitTikTokPageView(location: string): void {
  const claim = claimPageView(location);
  if (!claim) {
    return;
  }

  const send = () => {
    // The send is deferred, so the visitor may have revoked consent or navigated
    // before this runs. Both invalidate the claim, and sending anyway would
    // either track without consent or let ttq.page() attribute this view to the
    // route the visitor moved to (which claims its own view).
    if (globalConsentRevoked || !isCurrentPageView(claim)) {
      return;
    }

    try {
      if (window.ttq && typeof window.ttq.page === 'function') {
        window.ttq.page();
        if (isDevelopment()) {
          console.log('🎵 TikTok Pixel page view tracked:', location);
        }
      }
    } catch (error) {
      if (isDevelopment()) {
        console.warn('Failed to track TikTok page view:', error);
      }
    }
  };

  // Defer to prevent forced reflows
  if ('requestIdleCallback' in window) {
    requestIdleCallback(send);
  } else {
    setTimeout(send, 50);
  }
}

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
  clearFirstPartyCookies({
    exactNames: [
      '_ttp',
      '_tt_enable_cookie',
      '_ttp_pixel',
      '_tt_sessionId',
      '_tt_pixel_session_index',
      '_tt_appInfo',
    ],
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

export function useTikTokPixel(manageConsentLifecycle = false) {
  const initialized = useRef(false);
  const consentRevoked = useRef(false);
  const [location] = useLocation();
  const previousLocation = useRef(location);
  // Always-current location for listeners registered once: their closures would
  // otherwise keep the location from the render that registered them.
  const locationRef = useRef(location);
  locationRef.current = location;

  // Initialize TikTok Pixel when consent is available
  const initTikTokPixel = useCallback(() => {
    if (isDevelopment()) {
      if (isDevelopment()) {
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
      if (isDevelopment()) {
        console.log('🎵 TikTok Pixel already initialized or blocked, skipping');
      }
      return;
    }

    // Set initialization timestamp to prevent rapid re-initialization
    globalInitializationTimestamp = currentTimestamp;

    try {
      // Two ways to end up with a live pixel, and both of them already counted
      // the current route: our own snippet fires ttq.page() on load, and a pixel
      // that some other script put on the page did the same. So this branch only
      // decides whether to inject the snippet; the shared tail below is what
      // records the entry page.
      const alreadyLoaded = Boolean(window.ttq && typeof window.ttq.page === 'function');

      if (alreadyLoaded) {
        if (isDevelopment()) {
          console.log('🎵 TikTok Pixel already loaded in page, skipping script injection');
        }
      } else {
        loadTikTokPixel();
      }

      globalTikTokInitialized = true;
      initialized.current = true;
      consentRevoked.current = false;
      globalConsentRevoked = false;
      // Single exit for every init path: record the entry page, or the route
      // effect of this (and every later-mounting) instance emits a second page
      // view for it. A branch that skips this line is how the entry page got
      // counted twice, so scripts/analytics-pageview-guards.ts asserts there is
      // exactly one of them and nothing bails out before it.
      markPageViewTracked(locationRef.current);

      if (!alreadyLoaded) {
        console.log('🎵 TikTok Pixel initialized successfully with ID:', TIKTOK_PIXEL_ID);
      }
    } catch (error) {
      console.error('Failed to initialize TikTok Pixel:', error);
      globalTikTokInitialized = false;
      globalInitializationTimestamp = null;
    }
  }, []);

  // Handle consent revocation with cookie cleanup
  // Gate on GLOBAL flags: any hook instance must be able to revoke, even if a
  // different instance performed the initialization.
  const revokeTikTokPixel = useCallback(() => {
    if (globalTikTokInitialized && !globalConsentRevoked) {
      try {
        // Revoke consent
        if (window.ttq && typeof window.ttq.revokeConsent === 'function') {
          window.ttq.revokeConsent();
        }
        consentRevoked.current = true;
        globalConsentRevoked = true;
        // Invalidate the page-view dedupe key exactly once per revocation (this
        // block is guarded by globalConsentRevoked, so only the first listener
        // runs it). If consent comes back on this same route, the visit must be
        // counted again.
        bumpConsentGeneration();
        
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
    if (!manageConsentLifecycle) {
      return;
    }

    // Check initial consent state and initialize if available
    if (process.env.NODE_ENV === 'production' && hasMarketingConsent()) {
      initTikTokPixel();
    } else if (isDevelopment()) {
      if (isDevelopment()) {
        console.log('🎵 TikTok Pixel disabled in development mode');
      }
    } else if (process.env.NODE_ENV === 'production') {
      if (isDevelopment()) {
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
              // The route effect only reacts to location changes, so restoring
              // consent without navigating would never emit a view for the page
              // the visitor is actually on. The revocation already invalidated
              // the dedupe key, so the first listener to run emits and every
              // other mounted instance is a no-op.
              emitTikTokPageView(locationRef.current);
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
  }, [initTikTokPixel, manageConsentLifecycle, revokeTikTokPixel]);

  // Track page views on route change (gate on GLOBAL flags, not per-instance refs)
  useEffect(() => {
    if (manageConsentLifecycle && globalTikTokInitialized && !globalConsentRevoked) {
      // emitTikTokPageView owns the dedupe: once per navigation, no matter how
      // many hook instances are mounted.
      previousLocation.current = location;
      emitTikTokPageView(location);
    }
  }, [location, manageConsentLifecycle]);

  // Return TikTok Pixel API methods for custom tracking.
  // IMPORTANT: gate on GLOBAL flags, not per-instance refs. The pixel is
  // initialized once globally, but many components create their own hook
  // instance; a per-instance ref would silently drop their events.
  return {
    track: (eventName: string, properties?: Record<string, any>) => {
      if (globalTikTokInitialized && !globalConsentRevoked && window.ttq) {
        try {
          window.ttq.track(eventName, properties);
        } catch (error) {
          if (isDevelopment()) {
            console.warn('Failed to track TikTok event:', error);
          }
        }
      }
    },
    
    identify: (userData: Record<string, any>) => {
      if (globalTikTokInitialized && !globalConsentRevoked && window.ttq) {
        try {
          window.ttq.identify(userData);
        } catch (error) {
          if (isDevelopment()) {
            console.warn('Failed to identify user in TikTok Pixel:', error);
          }
        }
      }
    },
    
    page: () => {
      if (globalTikTokInitialized && !globalConsentRevoked && window.ttq) {
        try {
          window.ttq.page();
        } catch (error) {
          if (isDevelopment()) {
            console.warn('Failed to track TikTok page:', error);
          }
        }
      }
    }
  };
}
