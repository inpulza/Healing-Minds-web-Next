import { lazy } from 'react';

// Lazy load components that are below the fold
export const LazyDoctorSection = lazy(() => import('./DoctorSection'));
export const LazyServices = lazy(() => import('./Services'));
export const LazyAbout = lazy(() => import('./About'));
export const LazyBilingualCare = lazy(() => import('./BilingualCare'));
export const LazyServiceAreas = lazy(() => import('./ServiceAreas'));
export const LazyTestimonials = lazy(() => import('./Testimonials'));
export const LazyForPatients = lazy(() => import('./ForPatients'));
export const LazyFAQ = lazy(() => import('./FAQ'));
export const LazyContact = lazy(() => import('./Contact'));
export const LazyFooter = lazy(() => import('./Footer'));