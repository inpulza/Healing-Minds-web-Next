import { lazy } from 'react';

// Lazy load components that are below the fold with optimized preloading
// High priority components (visible early in the page)
export const LazyDoctorSection = lazy(() => import(/* webpackChunkName: "doctor-section" */ './DoctorSection'));
export const LazyServices = lazy(() => import(/* webpackChunkName: "services" */ './Services'));
export const LazyAbout = lazy(() => import(/* webpackChunkName: "about" */ './About'));

// Medium priority components (mid-page content)
export const LazyBilingualCare = lazy(() => import(/* webpackChunkName: "bilingual-care" */ './BilingualCare'));
export const LazyServiceAreas = lazy(() => import(/* webpackChunkName: "service-areas" */ './ServiceAreas'));
export const LazyTestimonials = lazy(() => import(/* webpackChunkName: "testimonials" */ './Testimonials'));

// Lower priority components (bottom of page)
export const LazyForPatients = lazy(() => import(/* webpackChunkName: "for-patients" */ './ForPatients'));
export const LazyFAQ = lazy(() => import(/* webpackChunkName: "faq" */ './FAQ'));
export const LazyContact = lazy(() => import(/* webpackChunkName: "contact" */ './Contact'));
export const LazyFooter = lazy(() => import(/* webpackChunkName: "footer" */ './Footer'));

// Preload high-priority chunks when the page is idle
if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
  requestIdleCallback(() => {
    import('./DoctorSection');
    import('./Services');
  }, { timeout: 3000 });
}