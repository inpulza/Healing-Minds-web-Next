# Healing Minds Psychiatry Website

## Overview

This is a professional website for Healing Minds Psychiatry, the practice of Dr. Melva Reve, a board-certified psychiatrist serving Naples, FL and surrounding areas. The website provides bilingual (English/Spanish) psychiatric care information, services, and patient resources. It features a modern, accessible design built with React and TypeScript, focusing on mental health services including anxiety, depression, ADHD, PTSD, and other psychiatric conditions.

## Recent Changes (August 15, 2025)

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
- **Custom Analytics Module**: Event tracking for form submissions and user interactions