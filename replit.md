# Healing Minds Psychiatry Website

## Overview
This project is a professional, bilingual (English/Spanish) website for Healing Minds Psychiatry, Dr. Melva Reve's practice in Naples, FL. Its core purpose is to establish a strong online presence, attract new patients, and provide accessible, high-quality information on mental health services (anxiety, depression, ADHD, PTSD, etc.). The site emphasizes modern design, optimal search engine visibility in the Naples, FL area, and compliance with medical transparency requirements, including detailed billing, payment, and cancellation policies.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 19+ with TypeScript, using Vite for building.
- **Routing**: Wouter for client-side routing, supporting main pages, individual service pages (6 specialized, bilingual), location pages, legal pages, and animated navigation.
- **Styling**: Tailwind CSS with shadcn/ui for consistent UI components.
- **State Management**: React Context for language switching and React Query for server state.
- **Component Structure**: Page-based components with reusable UI components.
- **Navigation**: Enhanced Header component with animated dropdowns and responsive design.

### Backend Architecture
- **Server**: Express.js with TypeScript for API endpoints.
- **Database Layer**: Drizzle ORM for PostgreSQL with type-safe schema definitions.
- **Storage Interface**: Abstract storage interface with in-memory implementation for development.
- **API Design**: RESTful endpoints for contact form submissions and message retrieval.

### Design System
- **Typography**: Instrument Sans for body text, Playfair Display for accent words and emphasis, with a dual-font pattern.
- **Color Scheme**: Primary green (#16a34a) with light green accents and professional gray text.
- **Responsive Design**: Mobile-first approach with responsive breakpoints.
- **Component Library**: shadcn/ui for consistent UI patterns.
- **UI/UX Decisions**: Modern section layouts inspired by "DoctorSection" patterns, incorporating rounded containers, shadows, grid systems, and interactive statistics. Features are displayed as horizontal badges for a compact hero section. Masonry-style hero sections for service pages.

### Data Layer
- **Schema**: PostgreSQL tables for users and contact messages, validated with Zod.
- **ORM**: Drizzle ORM for type-safe database operations.
- **Validation**: Zod schemas for runtime type checking and form validation.

### SEO and Analytics
- **SEO Utilities**: Dynamic meta tag updates, server-side HTML injection for canonical tags, comprehensive MedicalClinic, LocalBusiness, FAQPage, BreadcrumbList, and Physician schema JSON-LD with real verified data, and language-specific meta tags (hreflang). Optimized robots.txt to prevent URL parameter spam.
- **Analytics**: Google Analytics, Microsoft Clarity, and TikTok Pixel (ID D3IKI7BC77UEJB9HBO0G) integration for comprehensive behavioral tracking, including custom event tracking for phone calls, form submissions, service page views, and language changes. All analytics services follow consistent pattern with development mode detection and GDPR-compliant consent integration.
- **Multilingual SEO**: Language-specific meta tags and canonical URLs with bidirectional language switching.
- **Local SEO**: NAP consistency, geo-specific titles, Google Business Profile integration, and comprehensive Physician schema for Dr. Melva Reve including NPI and verified medical directory profiles.

### Content Management
- **Internationalization**: Context-based language switching with a comprehensive translation system supporting English and Spanish content for all pages, including legal policies.
- **Content Structure**: Centralized content data for practice information, services, testimonials, and FAQs.
- **Form Handling**: Contact form with validation, submission tracking, and toast notifications.

## External Dependencies

### Core Dependencies
- **@tanstack/react-query**: Server state management.
- **wouter**: Client-side routing.
- **drizzle-orm**: Type-safe ORM.
- **@neondatabase/serverless**: PostgreSQL database driver.

### UI and Styling
- **@radix-ui/react-***: Accessible headless UI components.
- **tailwindcss**: Utility-first CSS framework.
- **class-variance-authority**: Component variant management.
- **lucide-react**: Icon library.

### Form and Validation
- **react-hook-form**: Form state management.
- **@hookform/resolvers**: Form validation resolvers.
- **zod**: Runtime type validation and schema definition.

### Database and Infrastructure
- **drizzle-kit**: Database migration and schema management.
- **connect-pg-simple**: PostgreSQL session store.
- **Neon Database**: Serverless PostgreSQL hosting.

### Analytics and Monitoring
- **Google Analytics**: Website analytics with consent-based initialization.
- **Microsoft Clarity**: Behavioral analytics with session recordings, heatmaps, custom event tracking, and contextual tagging.
- **TikTok Pixel**: Marketing conversion tracking with ID D3IKI7BC77UEJB9HBO0G, automatic page view tracking, and consent-based initialization (marketing consent required).

### Third-Party Integrations
- **CharmHealthBooking**: For patient appointment booking.