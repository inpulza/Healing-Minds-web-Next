// Google Analytics 4 integration
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Initialize Google Analytics with performance optimization
export function initGA(): void {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  
  if (!measurementId) {
    console.warn('Google Analytics measurement ID not provided');
    return;
  }

  // Defer GA initialization to avoid blocking critical rendering path
  const initializeGA = () => {
    // Create script tag for Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    
    // Initialize dataLayer first to prevent errors
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: any[]) {
      window.dataLayer.push(arguments);
    };
    
    // Load script after DOM is interactive
    script.onload = () => {
      // Use requestIdleCallback to defer configuration
      const configureGA = () => {
        window.gtag('js', new Date());
        window.gtag('config', measurementId, {
          page_title: document.title,
          page_location: window.location.href,
          send_page_view: true,
          allow_enhanced_conversions: true,
          custom_map: {
            'custom_1': 'service_type',
            'custom_2': 'language_preference'
          }
        });
        
        if (import.meta.env.DEV) {
          console.log('Google Analytics initialized successfully with ID:', measurementId);
        }
      };
      
      if ('requestIdleCallback' in window) {
        requestIdleCallback(configureGA, { timeout: 2000 });
      } else {
        setTimeout(configureGA, 100);
      }
    };
    
    document.head.appendChild(script);
  };
  
  // Initialize GA after the page has loaded and is idle
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(initializeGA, { timeout: 3000 });
      } else {
        setTimeout(initializeGA, 200);
      }
    });
  } else {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(initializeGA, { timeout: 3000 });
    } else {
      setTimeout(initializeGA, 200);
    }
  }
}

// Track page views with throttling to prevent performance impact
export function trackPageView(path: string, title?: string): void {
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

// Track specific medical practice events
export function trackServicePageView(serviceName: string, language: 'en' | 'es' = 'en'): void {
  trackEvent('service_page_view', 'medical_services', serviceName, undefined);
  
  // Track language preference
  window.gtag?.('event', 'language_selection', {
    event_category: 'user_preference',
    event_label: language,
    custom_1: serviceName,
    custom_2: language
  });
}

// Track contact form interactions
export function trackContactFormEvent(action: 'start' | 'submit' | 'error', formType: string = 'general'): void {
  trackEvent(`contact_form_${action}`, 'lead_generation', formType);
}

// Track insurance logo clicks
export function trackInsuranceClick(insuranceName: string): void {
  trackEvent('insurance_logo_click', 'user_engagement', insuranceName);
}