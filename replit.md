# Healing Minds Psychiatry Website

## Overview

This is a professional website for Healing Minds Psychiatry, the practice of Dr. Melva Reve, a board-certified psychiatrist serving Naples, FL and surrounding areas. The website provides bilingual (English/Spanish) psychiatric care information, services, and patient resources. It features a modern, accessible design built with React and TypeScript, focusing on mental health services including anxiety, depression, ADHD, PTSD, and other psychiatric conditions.

## Recent Changes (August 14, 2025)

- **Navigation Enhancement**: Implemented modern animated dropdown menu for Services section with smooth expansion animation
- **Service Pages Creation**: Built 6 individual service pages (Anxiety, Depression, ADHD, PTSD, Bipolar, TMS) with full SEO optimization
- **Bilingual URL Structure**: Configured /services/ (English) and /es/servicios/ (Spanish) routing for all service pages
- **Typography System Overhaul**: Implemented sophisticated dual-font system using Instrument Sans for body text and Playfair Display for accent words
- **Consistent Typography Pattern**: Applied font-body for main headings and font-display italic text-green-700 for accent words across all components
- **Enhanced Visual Hierarchy**: Created elegant contrast between functional text and decorative accents throughout the site
- **Dropdown Navigation Fix**: Fixed Services dropdown functionality - now only closes when clicking Services button again, removed borders/shadows
- **Circular Icon Optimization**: Added min-width/height and flex-shrink-0 to ensure perfect circles across all components
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