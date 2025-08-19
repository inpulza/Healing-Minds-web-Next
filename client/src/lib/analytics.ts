// Google Analytics 4 integration
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Initialize Google Analytics
export function initGA(): void {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  
  if (!measurementId) {
    console.warn('Google Analytics measurement ID not provided');
    return;
  }

  // Create script tag for Google Analytics
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: any[]) {
    window.dataLayer.push(arguments);
  };

  // Configure Google Analytics
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    page_title: document.title,
    page_location: window.location.href,
    // Enhanced measurement for better tracking
    send_page_view: true,
    // Enhanced e-commerce (if needed later)
    allow_enhanced_conversions: true,
    // Custom parameters for medical practice
    custom_map: {
      'custom_1': 'service_type',
      'custom_2': 'language_preference'
    }
  });

  // Log successful initialization (development only)
  if (import.meta.env.DEV) {
    console.log('Google Analytics initialized successfully with ID:', measurementId);
  }
}

// Track page views
export function trackPageView(path: string, title?: string): void {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title || document.title,
    });
  }
}

// Track custom events
export function trackEvent(action: string, category: string, label?: string, value?: number): void {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });

    // Log events in development
    if (import.meta.env.DEV) {
      console.log('GA Event tracked:', { action, category, label, value });
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