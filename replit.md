# Healing Minds Psychiatry Website

## Overview
This project is a professional, bilingual (English/Spanish) website for Healing Minds Psychiatry, Dr. Melva Reve's practice in Naples, FL. The site provides information on mental health services, including anxiety, depression, ADHD, PTSD, and other psychiatric conditions, along with patient resources. Its core purpose is to establish a strong online presence, attract new patients, and provide accessible, high-quality information, with a focus on modern design and optimal search engine visibility in the Naples, FL area.

## Recent Changes

### October 9, 2025 - Comprehensive Schema.org Implementation with REAL Data for Google Rich Results
- **Schema Architecture**: All schema markup server-side injected in HTML `<head>` for optimal Google crawling
- **MedicalOrganization Primary Schema**: Multiple types ["MedicalOrganization", "LocalBusiness", "MedicalClinic"] for maximum search visibility
- **Real Data Only**: All schema contains ONLY verified, real information per Google's 2025 guidelines
- **Rich Results Implementation** (Real GMB Data):
  - AggregateRating: 5.0 stars with 17 REAL reviews from Google My Business
  - 3 REAL Review entities: Julio Gonzalez, Ismael Gonzalez, Maylin Garcia Gonzalez (actual GMB reviews)
  - FAQPage schema with 7 relevant questions for expandable FAQ Rich Results
  - BreadcrumbList schema for navigation hierarchy in search results
- **LocalBusiness Optimization**: areaServed (Naples + Florida), paymentAccepted, priceRange ($$), currenciesAccepted
- **Social Media Integration** (Real Profiles):
  - Instagram: @hmpsychiatry
  - Facebook: Healing Minds Psychiatry official
  - YouTube: @healingmindsp
  - TikTok: @dra.melvavidal
  - Yelp: Verified business listing
  - Google Maps: Official location
- **Physician Entity**: Dr. Melva Reve Urgelles complete verified profile
  - NPI: 1982233631 (official National Provider Identifier)
  - 4 verified medical directory profiles (Healthgrades, WePrevent, Sharecare, NPIDB)
  - Complete name structure, gender, specialty
- **Credentials**: Removed unverified credentials per Google's "DO NOT markup credentials you cannot verify" policy; added verified NPI identifier instead
- **Duplicate Prevention**: Disabled client-side schema injection to ensure single authoritative source

### October 8, 2025 - Location Pages Telehealth Section Simplification
- **Design Simplification**: Updated all 9 location pages (Ave Maria, Bonita Springs, Estero, Fort Myers, Golden Gate, Immokalee, Lely Resorts, Marco Island, Vanderbilt Beach) with ultra-simple Telehealth section
- **Telehealth Section**: New standalone section with bg-white background, max-w-7xl container, centered text content (title, description, booking button), NO cards or doctor images
- **CharmHealthBooking**: Updated to use variant="prominent" in all Telehealth sections for consistent appearance
- **Contact Information Refactor**: Simplified to single "Call Now" button in Contact Information section
- **Quick Contact Card**: Added separate "Quick Contact" card with "Contact Form" button to replace dual-button layout
- **User Feedback**: Design responds to user preference for extremely simple, clean layouts without complex visual elements

### October 8, 2025 - Location Pages Features Repositioning
- **Layout Update**: Moved features/stats from inside hero container to horizontal badges below on all 10 Location pages
- **Compact Hero**: Hero container now more square and compact without internal features grid
- **Feature Badges**: New horizontal badges section at full viewport width (max-w-7xl) with centered flex-wrap layout
- **Styling**: Badges use blue accent colors (border-blue-100, bg-blue-100, text-blue-600) for visual distinction
- **Consistency**: Applied identical pattern across Naples, Ave Maria, Bonita Springs, Estero, Fort Myers, Golden Gate, Immokalee, Lely Resort, Marco Island, and Vanderbilt Beach
- **Responsive Design**: Badges wrap naturally on smaller screens with gap-3 spacing

### October 8, 2025 - Telepsychiatry Page Redesign
- **Visual Redesign**: Complete overhaul of TelehealthSection to match location pages design system
- **Color Palette Update**: Changed from blue theme to brand green (green-800, green-700, green-50) for consistency
- **Hero Section**: Implemented location-page style hero with doctor image, green typography, and feature badges
- **Typography**: Updated titles to consistent sizing (text-4xl sm:text-5xl lg:text-6xl) matching rest of site
- **New Sections Added**: 
  - Statewide coverage map with Florida visualization
  - "Why Choose Telepsychiatry?" benefits grid with 4 key advantages
  - "How It Works" 4-step process guide
  - Dedicated FAQ section with 10 bilingual Q&A pairs
- **FAQ Integration**: Added telehealth-specific FAQs to locationFAQs.ts, integrated with LocationFAQ component
- **Component Updates**: Modified LocationFAQ to accept ReactNode titles for styled headings
- **Testing**: Added data-testid attributes for automated testing support

### October 7, 2025 - TikTok Pixel Update
- **Pixel ID Updated**: Changed from D3HT9QRC77UAH4NB96KG to D3IKI7BC77UEJB9HBO0G
- **Event Tracking Active**: All existing events (Lead, Contact, ViewContent, ClickButton) continue working with new pixel
- **Integration Points**: Contact forms, phone clicks, service pages, telehealth buttons all tracking correctly

### October 7, 2025 - TikTok Pixel Event Tracking System
- **Enhanced Event Tracking**: Implemented comprehensive TikTok Pixel event tracking system with custom hook (useTikTokEvents.ts)
- **Lead Events**: Integrated on contact form submissions (main contact page and modal) to track lead generation
- **Contact Events**: Added on phone number clicks (Footer, Contact page, MobileToolbar) to track direct engagement
- **ViewContent Events**: Implemented on all 6 service pages (Anxiety, Depression, ADHD, PTSD, Bipolar, Medication Management) with specific service names and content IDs
- **ClickButton Events**: Added for telehealth booking buttons (CharmHealthBooking component with 3 variants, Footer, MobileToolbar)
- **HIPAA Compliance**: All TikTok events use anonymous tracking without PII collection - no ttq.identify() used
- **Consent Integration**: All events respect marketing consent requirement and integrate with GDPR-compliant consent management

### October 6, 2025 - TikTok Pixel Integration
- **Implementation**: Added TikTok Pixel tracking infrastructure
- **Architecture**: Created use-tiktok-pixel.ts hook following the same pattern as Clarity and Google Analytics
- **Consent Integration**: TikTok Pixel requires marketing consent and integrates with existing GDPR-compliant consent management
- **Features**: Automatic page view tracking on route changes, consent-based initialization, cookie cleanup on revocation
- **Development Mode**: Disabled in development to prevent test data pollution, enabled only in production

### September 15, 2025 - Spanish Location URLs 404 Resolution
- **Critical Fix**: Resolved 404 errors for Spanish location URLs that were present in sitemap.xml but not implemented in the application
- **Implementation**: Added 10 Spanish location routes in App.tsx to complete the bilingual routing architecture:
  - `/es/ubicaciones/psiquiatra-naples`
  - `/es/ubicaciones/psiquiatra-bonita-springs`
  - `/es/ubicaciones/psiquiatra-marco-island`
  - `/es/ubicaciones/psiquiatra-estero`
  - `/es/ubicaciones/psiquiatra-golden-gate`
  - `/es/ubicaciones/psiquiatra-immokalee`
  - `/es/ubicaciones/psiquiatra-vanderbilt-beach`
  - `/es/ubicaciones/psiquiatra-ave-maria`
  - `/es/ubicaciones/psiquiatra-fort-myers`
  - `/es/ubicaciones/psiquiatra-lely-resort`
- **Architecture**: The existing bilingual component infrastructure was already in place; only the route definitions were missing
- **SEO Impact**: All URLs declared in sitemap.xml now have complete implementation, ensuring proper indexing and user experience

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 19+ with TypeScript, using Vite for building.
- **Routing**: Wouter for client-side routing, supporting main pages, individual service pages (6 specialized, bilingual), and animated navigation.
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
- **UI/UX Decisions**: Modern section layouts inspired by "DoctorSection" patterns, incorporating rounded containers, shadows, grid systems, and interactive statistics. Masonry-style hero sections for service pages.

### Data Layer
- **Schema**: PostgreSQL tables for users and contact messages, validated with Zod.
- **ORM**: Drizzle ORM for type-safe database operations.
- **Validation**: Zod schemas for runtime type checking and form validation.

### SEO and Analytics
- **SEO Utilities**: Dynamic meta tag updates, server-side HTML injection for canonical tags and comprehensive MedicalClinic schema JSON-LD, and language-specific meta tags. Optimized robots.txt to prevent URL parameter spam.
- **Analytics**: Google Analytics, Microsoft Clarity, and TikTok Pixel integration for comprehensive behavioral tracking, including custom event tracking for phone calls, form submissions, and language changes. All analytics services follow consistent pattern with development mode detection and GDPR-compliant consent integration.
- **Multilingual SEO**: Language-specific meta tags and canonical URLs.
- **Local SEO**: NAP consistency, geo-specific titles, Google Business Profile integration, and comprehensive Physician schema for Dr. Melva Reve.

### Content Management
- **Internationalization**: Context-based language switching with a comprehensive translation system.
- **Content Structure**: Centralized content data for practice information, services, and testimonials.
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

### Development Tools
- **vite**: Build tool and development server.
- **typescript**: Static type checking.
- **eslint**: Code linting.

### Database and Infrastructure
- **drizzle-kit**: Database migration and schema management.
- **connect-pg-simple**: PostgreSQL session store.
- **Neon Database**: Serverless PostgreSQL hosting.

### Analytics and Monitoring
- **Google Analytics**: Website analytics with consent-based initialization.
- **Microsoft Clarity**: Behavioral analytics with session recordings, heatmaps, custom event tracking, and contextual tagging.
- **TikTok Pixel**: Marketing conversion tracking with ID D3IKI7BC77UEJB9HBO0G, automatic page view tracking, and consent-based initialization (marketing consent required).