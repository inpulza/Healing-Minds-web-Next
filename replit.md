# Healing Minds Psychiatry Website

## Overview

This is a professional website for Healing Minds Psychiatry, the practice of Dr. Melva Reve, a board-certified psychiatrist serving Naples, FL and surrounding areas. The website provides bilingual (English/Spanish) psychiatric care information, services, and patient resources. It features a modern, accessible design built with React and TypeScript, focusing on mental health services including anxiety, depression, ADHD, PTSD, and other psychiatric conditions.

## Recent Changes (September 8, 2025)

- **SEO Local Audit & Action Plan**: Comprehensive local SEO audit and optimization plan implementation
  - Conducted full analysis of Google Business Profile synchronization requirements
  - Identified critical NAP (Name, Address, Phone) consistency issues in footer
  - Found schema markup coordinate discrepancies (current: 26.2540,-81.8057 vs required GBP: 26.2044803,-81.8021344)
  - Created 9-point optimization plan for web development team
  - Developed departmental task lists for GBP management, marketing, and technical teams
  - Established E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) enhancement strategy
  - Planned geo-specific title optimization for all 6 service pages
  - Designed internal linking strategy from service pages to location page for geographical relevance
  - Prioritized schema Person implementation for Dr. Melva Reve with medical specialties
  - Identified missing GBP URL connection in schema markup sameAs property

## Previous Changes (August 19, 2025)

- **Microsoft Clarity Integration**: Comprehensive behavioral analytics implementation
  - Installed @microsoft/clarity package with NPM method for optimal React integration
  - Created custom useClarity hook with environment-based initialization (production only)
  - Implemented advanced event tracking for user interactions:
    - Phone call clicks tracked from Footer, Contact page, and Service hero sections
    - Email contact tracking from Contact page
    - Contact form submissions with language preference tagging
    - Language switching behavior tracking
  - Added contextual tagging system:
    - Language selection (English/Spanish)
    - Click location tracking (footer, contact_page, service_hero)
    - Site categorization (psychiatry_practice, naples_fl)
  - Privacy-compliant setup with development mode disabled
  - Full integration with existing Google Analytics without conflicts

## Previous Changes (August 15, 2025)

- **Schema.org Optimization for Google Business Profile**: Completely enhanced structured data markup with Google Business Profile connection
  - Added Google Business Profile URL to sameAs property for direct GBP connection 
  - Updated coordinates to match exact GBP location (26.2044803,-81.8021344)
  - Enhanced opening hours specification with proper schema format for all days
  - Added @id properties for unique entity identification
  - Integrated MedicalBusiness and Physician schemas with cross-references
  - Improved hasMap property to use actual GBP URL instead of generic maps link
  - Extended medicalSpecialty to include all service offerings (ADHD, PTSD, Bipolar)
  - Optimized schema removal to avoid conflicts between multiple schemas

## Previous Changes (August 14, 2025)

- **Modern Section Layouts Implementation**: Applied DoctorSection-inspired design patterns to service pages with rounded containers, shadows, and sophisticated layouts
- **Service Page Visual Modernization**: Converted traditional card layouts to modern containers with grid systems, statistical elements, and visual hierarchy
- **Container Design System**: Implemented consistent `bg-white rounded-2xl sm:rounded-3xl p-8 shadow-lg border` pattern across service sections for professional appearance
- **Interactive Statistics Integration**: Added relevant statistics (40M+ anxiety sufferers, 80% treatment success, 98% satisfaction) within modern container layouts
- **Service Page Content Completion**: Completed missing content for PTSD Treatment, Bipolar Treatment pages with full symptom descriptions, treatment approaches, and "Why Choose Dr. Reve" sections
- **TMS to Medication Management Conversion**: Replaced TMS Therapy service page with Medication Management to better reflect the practice's actual services. Updated all routing, navigation, and content.
- **Service Page Structure Standardization**: All 6 service pages now have consistent complete structure with symptoms, treatment approaches, and specialized sections
- **Masonry Layout Implementation**: Redesigned all service pages with authentic masonry-style hero sections
- **ServiceHeroMasonry Component**: Created reusable component with 2x3 grid featuring large photos in opposite corners and smaller fact cards
- **Visual Hierarchy Enhancement**: Large photos (2 rows) contrasted with smaller data cards (1 row) for dynamic masonry effect
- **Typography Pattern Restoration**: Maintained dual-font system with "Naples, FL" highlighted in font-display italic text-green-700
- **Navigation Enhancement**: Implemented modern animated dropdown menu for Services section with smooth expansion animation
- **Service Pages Creation**: Built 6 individual service pages (Anxiety, Depression, ADHD, PTSD, Bipolar, Medication Management) with full SEO optimization
- **Bilingual URL Structure**: Configured /services/ (English) and /es/servicios/ (Spanish) routing for all service pages
- **Typography System Overhaul**: Implemented sophisticated dual-font system using Instrument Sans for body text and Playfair Display for accent words
- **Hero Image Optimization**: Converted new doctor photo to WebP format (90KB → 35KB desktop, 15KB mobile) for faster loading

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 19+ with TypeScript, using Vite as the build tool
- **Routing**: Wouter for client-side routing with complete service pages architecture
  - Main pages: Home, About, Services, For Patients, Contact, and Spanish services
  - Individual service pages: 6 specialized treatment pages with bilingual URLs
  - Animated navigation: Modern dropdown menu for service page navigation
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent UI components
- **State Management**: React Context for language switching (English/Spanish) and React Query for server state
- **Component Structure**: Page-based components with reusable UI components organized under `/components/ui/`
- **Navigation System**: Enhanced Header component with animated dropdown menus and responsive design

### Backend Architecture
- **Server**: Express.js with TypeScript for API endpoints
- **Database Layer**: Drizzle ORM configured for PostgreSQL with type-safe schema definitions
- **Storage Interface**: Abstract storage interface with in-memory implementation for development
- **API Design**: RESTful endpoints for contact form submissions and message retrieval

### Design System
- **Typography**: Instrument Sans for primary text, Playfair Display for elegant accent words and emphasis
- **Typography Pattern**: Main headings use font-body, accent words use font-display italic with text-green-700 color
- **Color Scheme**: Primary green (#16a34a) with light green accents, professional gray text
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Component Library**: shadcn/ui components for consistent UI patterns

### Data Layer
- **Schema**: PostgreSQL tables for users and contact messages with Zod validation
- **ORM**: Drizzle ORM for type-safe database operations
- **Validation**: Zod schemas for runtime type checking and form validation

### SEO and Analytics
- **SEO Utilities**: Dynamic meta tag updates, structured data for medical business and physician
- **Analytics**: Google Analytics integration with event tracking
- **Multilingual SEO**: Language-specific meta tags and canonical URLs

### Content Management
- **Internationalization**: Context-based language switching with comprehensive translation system
- **Content Structure**: Centralized content data for practice information, services, and testimonials
- **Form Handling**: Contact form with validation, submission tracking, and toast notifications

## External Dependencies

### Core Dependencies
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight client-side routing
- **drizzle-orm**: Type-safe ORM for database operations
- **@neondatabase/serverless**: PostgreSQL database driver for Neon

### UI and Styling
- **@radix-ui/react-***: Accessible headless UI components
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Form and Validation
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Runtime type validation and schema definition

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Static type checking
- **eslint**: Code linting and formatting

### Database and Infrastructure
- **drizzle-kit**: Database migration and schema management
- **connect-pg-simple**: PostgreSQL session store
- **Neon Database**: Serverless PostgreSQL hosting (configured via DATABASE_URL)

### Analytics and Monitoring
- **Google Analytics**: Website analytics and user behavior tracking
- **Microsoft Clarity**: Behavioral analytics with session recordings and heatmaps
  - Project ID: sxayts0dzk (production only)
  - Custom event tracking for phone calls, form submissions, language changes
  - Contextual tagging for user journey analysis
  - Privacy-compliant implementation with development mode disabled
- **Custom Analytics Module**: Event tracking for form submissions and user interactions

## Lighthouse Performance Optimization (August 20, 2025)

### Performance Analysis Results
- **First Contentful Paint**: 1.5s (score: 0.57/1.0) - Needs improvement
- **Largest Contentful Paint**: 1.8s (score: 0.71/1.0) - Acceptable but can improve
- **Speed Index**: 1.6s (score: 0.81/1.0) - Good performance
- **Total Blocking Time**: 0ms (score: 1.0/1.0) - Excellent
- **Cumulative Layout Shift**: 0.012 (score: 1.0/1.0) - Excellent

### Critical Optimization Opportunities
1. **Render-blocking Resources** - Potential savings: 150ms in FCP
   - Eliminate CSS and JS that block initial paint
   - Inline critical CSS and defer non-critical resources

2. **Modern Image Formats** - Potential savings: 742 KiB (CRITICAL)
   - Convert PNG/JPG images to WebP format where not already optimized
   - Implement next-gen image formats for better compression

3. **Unused CSS Reduction** - Potential savings: 49 KiB
   - Remove unused CSS rules from stylesheets
   - Optimize critical CSS delivery

4. **Largest Contentful Paint Element** - Potential improvement: 550ms in LCP
   - Optimize hero image loading and delivery
   - Improve resource prioritization for above-the-fold content

### Optimization Strategy
- Maintain existing design system and visual appearance completely intact
- Focus on technical performance improvements without changing UI/UX
- Prioritize critical path optimizations first (image formats, render-blocking)
- Validate improvements while preserving accessibility and functionality