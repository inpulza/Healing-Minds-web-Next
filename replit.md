# Healing Minds Psychiatry Website

## Overview
This project is a professional, bilingual (English/Spanish) website for Healing Minds Psychiatry, Dr. Melva Reve's practice in Naples, FL. Its core purpose is to establish a strong online presence, attract new patients, and provide accessible, high-quality information on mental health services (anxiety, depression, ADHD, PTSD, etc.). The site emphasizes modern design, optimal search engine visibility in the Naples, FL area, and compliance with medical transparency requirements, including detailed billing, payment, cancellation, and emergency policies.

## Recent Changes

### July 21, 2026 - Six New Bilingual Legal/Compliance Pages
- **New Pages (EN ↔ ES)**: Telehealth Informed Consent (`/telehealth-consent` ↔ `/es/consentimiento-telesalud`), No Surprises Act & Good Faith Estimate (`/no-surprises-act` ↔ `/es/ley-sin-sorpresas`), Accessibility Statement (`/accessibility-statement` ↔ `/es/declaracion-accesibilidad`), Nondiscrimination Notice (`/nondiscrimination-notice` ↔ `/es/aviso-no-discriminacion`), Communications/SMS Policy (`/communications-policy` ↔ `/es/politica-comunicaciones`), Medical Disclaimer (`/medical-disclaimer` ↔ `/es/descargo-responsabilidad-medica`)
- **Content Highlights**: Telehealth consent cites FL §456.47 and CA B&P §2290.5; No Surprises Act includes Good Faith Estimate rights ($400 dispute threshold, 120-day window, 1-800-985-3059, cms.gov/nosurprises); Nondiscrimination includes HHS OCR complaint contacts; Communications policy covers SMS/WhatsApp consent, STOP/HELP opt-out, and unencrypted-channel risk disclosure; all pages include 911/988 crisis language where relevant
- **Full Integration**: App.tsx lazy routes, bidirectional urlMapping.ts pairs, Footer links (split across Patient Resources and Legal columns), sitemap.xml with hreflang, llms.txt EN/ES lists, server-side meta injection (canonical, og tags, hreflang pairs) in html-injection.ts
- **For Patients Page**: Important Policies card grid expanded to 6 cards (added No Surprises Act and Telehealth Consent); No Surprises Act button added to policy button row

### October 16, 2025 - Patient Rights and Responsibilities Page Implementation
- **New Legal Page**: Created comprehensive bilingual Patient Rights and Responsibilities page to educate patients about their legal rights and obligations under Florida law
- **URLs Implemented**: `/patient-rights` (English) and `/es/derechos-paciente` (Spanish)
- **Florida Statutory Compliance 2025**: Full compliance with Florida Statutes §394.459 (Mental Health Patient Rights), §394.4615 (Additional Rights for Mental Health Patients), and §381.026 (Patient's Bill of Rights and Responsibilities)
- **Patient Rights Coverage**: Complete listing including respectful care, confidential records (enhanced Florida privacy protections beyond HIPAA), informed consent, right to refuse treatment, access to medical records, second opinion, interpreter services, emergency treatment, legal communications, and complaint filing procedures
- **Patient Responsibilities**: Clear outline of patient obligations including providing accurate information, keeping appointments, following treatment plans, meeting financial obligations, and maintaining respectful behavior
- **Complaint Filing Resources**: Complete contact information for Florida Department of Health Consumer Services Unit (1-850-245-4444, business hours, mailing address, website) and AHCA Health Care Complaint Hotline (1-888-419-3456 24/7, TTY 1-800-955-8771 Florida Relay, mailing address, website, online complaint form)
- **Footer Integration**: Added link alongside other legal pages (Privacy Policy, Terms of Service, HIPAA Notice, Cookie Policy, Cancellation Policy, Billing Policy, Emergency Policy)
- **SEO Implementation**: Complete sitemap.xml integration with proper hreflang tags for bilingual support
- **URL Mapping**: Bidirectional language switching enabled via urlMapping.ts updates
- **Content Standards**: Professional medical language, comprehensive rights listing, clear responsibilities, accessible complaint procedures, and policy acknowledgment requirement

### October 16, 2025 - Emergency and Crisis Policy Page Implementation
- **New Legal Page**: Created comprehensive bilingual Emergency and Crisis Policy page to protect patients and the practice by clearly defining scope of emergency services
- **URLs Implemented**: `/emergency-policy` (English) and `/es/politica-emergencias` (Spanish)
- **Policy Details**: Clear disclaimer that practice is NOT an emergency service, operates by appointment only, staff unavailable for crisis situations outside office hours
- **Florida Crisis Resources 2025**: Complete listing of emergency contacts including 911, 988 Suicide & Crisis Lifeline (call/text), Crisis Text Line (text "HELLO" to 741741), David Lawrence Center (239) 455-8500, Mobile Response Teams (MRTs), and 211 general information
- **Baker Act Information**: Educational content about Florida's involuntary examination law (Chapter 394), 72-hour evaluation period, patient rights, and when it applies
- **Visual Design**: Prominent red alert banner at top of page emphasizing "NOT an emergency service" with clear call-to-action for immediate crisis resources
- **Legal Protection**: Essential disclaimer for psychiatry practice operating in mental health sector, clearly delineating emergency vs. routine care boundaries
- **Footer Integration**: Added link alongside other legal pages with high visibility per user request for important safety information
- **SEO Implementation**: Complete sitemap.xml integration with proper hreflang tags for bilingual support
- **URL Mapping**: Bidirectional language switching enabled via urlMapping.ts updates
- **Content Standards**: Professional medical language, life-threatening crisis definition, immediate action steps, post-crisis communication protocol, and policy acknowledgment requirement

### October 16, 2025 - Billing and Payment Policy Page Implementation
- **New Legal Page**: Created comprehensive bilingual Billing and Payment Policy page to address patient questions about fees and payment procedures
- **URLs Implemented**: `/billing-policy` (English) and `/es/politica-facturacion` (Spanish)
- **Policy Details**: Complete coverage of insurance acceptance, copayment requirements, self-pay rates with good faith estimates, credit card processing fees (3% with clear disclosure and avoidance options), insurance claims processing timelines, payment plans, and financial assistance options
- **Florida Compliance 2025**: Policy reviewed against Florida medical billing transparency requirements (§395.301) and credit card surcharge regulations - fully compliant with all state and federal requirements
- **Credit Card Fee Disclosure**: Clear 3% processing fee disclosure with examples and alternatives (cash, check, debit card) to meet legal transparency requirements
- **Footer Integration**: Added link alongside other legal pages (Privacy Policy, Terms of Service, HIPAA Notice, Cookie Policy, Cancellation Policy)
- **SEO Implementation**: Complete sitemap.xml integration with proper hreflang tags for bilingual support
- **URL Mapping**: Bidirectional language switching enabled via urlMapping.ts updates
- **Content Standards**: Professional medical language, transparent fee structure, good faith estimate availability, insurance claim timelines (2-6 weeks), payment plan options, and billing questions contact information

### October 16, 2025 - Cancellation and No-Show Policy Page Implementation
- **New Legal Page**: Created comprehensive bilingual Cancellation and No-Show Policy page addressing patient appointment expectations and fees
- **URLs Implemented**: `/cancellation-policy` (English) and `/es/politica-cancelacion` (Spanish)
- **Policy Details**: 24 business hours cancellation requirement with $50 late cancellation/no-show fee, including clear exceptions for medical emergencies
- **Compliance Verification**: Policy reviewed against Florida medical practice regulations and industry best practices - fully compliant with no state-mandated specific requirements
- **Footer Integration**: Added link alongside other legal pages (Privacy Policy, Terms of Service, HIPAA Notice, Cookie Policy)
- **SEO Implementation**: Complete sitemap.xml integration with proper hreflang tags for bilingual support
- **URL Mapping**: Bidirectional language switching enabled via urlMapping.ts updates
- **Content Standards**: Professional medical language, clear fee structure, patient responsibility acknowledgment, emergency exceptions, and policy acknowledgment requirement

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18.3.1 with TypeScript, using Vite for building.
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