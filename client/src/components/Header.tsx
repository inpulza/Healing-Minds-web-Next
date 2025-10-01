import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { useClarity } from '@/hooks/use-clarity';
import { getCorrespondingURL, hasBilingualCounterpart } from '@/utils/urlMapping';
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactCountryFlag from 'react-country-flag';

const Header = () => {
  const [location, navigate] = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { trackEvent, setTag } = useClarity();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isLocationsOpen, setIsLocationsOpen] = useState(false);
  const [isMobileLocationsOpen, setIsMobileLocationsOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const servicesPanelRef = useRef<HTMLDivElement>(null);
  const locationsPanelRef = useRef<HTMLDivElement>(null);
  const baseBarRef = useRef<HTMLDivElement>(null);
  const [spacerHeight, setSpacerHeight] = useState(80); // Default height for mobile

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Predictive height calculation for synchronized accordion animation
  useLayoutEffect(() => {
    const baseBar = baseBarRef.current;
    if (!baseBar) return;

    // Calculate base height (logo + nav bar)
    const baseHeight = baseBar.offsetHeight;

    // Calculate panel height if open, clamped to CSS max-height
    let panelHeight = 0;
    if (isServicesOpen && servicesPanelRef.current) {
      // Services panel has max-h-[500px]
      panelHeight = Math.min(servicesPanelRef.current.scrollHeight, 500);
    } else if (isLocationsOpen && locationsPanelRef.current) {
      // Locations panel has max-h-[calc(100vh-8rem)]
      const remSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const maxHeight = Math.max(0, window.innerHeight - (remSize * 8));
      panelHeight = Math.min(locationsPanelRef.current.scrollHeight, maxHeight);
    } else if (isMobileMenuOpen && headerRef.current) {
      // For mobile menu, measure the entire header
      panelHeight = Math.max(0, headerRef.current.scrollHeight - baseHeight);
    }

    // Set target height immediately for synchronized animation
    setSpacerHeight(baseHeight + panelHeight);
  }, [isServicesOpen, isLocationsOpen, isMobileMenuOpen]);

  // Update on window resize
  useEffect(() => {
    const handleResize = () => {
      const baseBar = baseBarRef.current;
      if (!baseBar) return;
      
      const baseHeight = baseBar.offsetHeight;
      let panelHeight = 0;
      
      if (isServicesOpen && servicesPanelRef.current) {
        panelHeight = Math.min(servicesPanelRef.current.scrollHeight, 500);
      } else if (isLocationsOpen && locationsPanelRef.current) {
        const remSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const maxHeight = Math.max(0, window.innerHeight - (remSize * 8));
        panelHeight = Math.min(locationsPanelRef.current.scrollHeight, maxHeight);
      } else if (isMobileMenuOpen && headerRef.current) {
        panelHeight = Math.max(0, headerRef.current.scrollHeight - baseHeight);
      }
      
      setSpacerHeight(baseHeight + panelHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isServicesOpen, isLocationsOpen, isMobileMenuOpen]);

  // Close mobile menu when navigation occurs (but keep dropdowns open)
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileServicesOpen(false);
    setIsMobileLocationsOpen(false);
  }, [location]);

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'es' : 'en';
    
    // Check if current URL has a bilingual counterpart
    const correspondingURL = getCorrespondingURL(location, newLanguage);
    
    if (correspondingURL && hasBilingualCounterpart(location)) {
      // Navigate to corresponding URL in target language
      navigate(correspondingURL);
      // Language will be set automatically by SpanishRouteWrapper or route detection
    } else {
      // No bilingual counterpart exists, just change language context
      setLanguage(newLanguage);
    }
    
    // Track language change with Clarity (preserve existing functionality)
    trackEvent('language_changed');
    setTag('selected_language', newLanguage);
  };

  const navigationItems = [
    { href: '/', label: t('nav.home') },
    { href: '/about', label: t('nav.about') },
    { href: '/services', label: t('nav.services'), hasDropdown: true, dropdownType: 'services' },
    { href: '/locations', label: language === 'en' ? 'Locations We Serve' : 'Áreas de Servicio', hasDropdown: true, dropdownType: 'locations' },
    { href: '/contact', label: t('nav.contact') },
  ];

  const serviceItems = [
    {
      href: language === 'en' ? '/services/anxiety-treatment' : '/es/servicios/tratamiento-ansiedad',
      label: language === 'en' ? 'Anxiety Treatment' : 'Tratamiento de Ansiedad',
      description: language === 'en' ? 'Expert care for anxiety disorders' : 'Atención experta para trastornos de ansiedad'
    },
    {
      href: language === 'en' ? '/services/depression-treatment' : '/es/servicios/tratamiento-depresion',
      label: language === 'en' ? 'Depression Treatment' : 'Tratamiento de Depresión',
      description: language === 'en' ? 'Comprehensive depression care' : 'Atención integral para depresión'
    },
    {
      href: language === 'en' ? '/services/adhd-treatment' : '/es/servicios/tratamiento-adhd',
      label: language === 'en' ? 'ADHD Treatment' : 'Tratamiento de TDAH',
      description: language === 'en' ? 'Specialized ADHD evaluation & care' : 'Evaluación y atención especializada de TDAH'
    },
    {
      href: language === 'en' ? '/services/ptsd-treatment' : '/es/servicios/tratamiento-tept',
      label: language === 'en' ? 'PTSD Treatment' : 'Tratamiento de TEPT',
      description: language === 'en' ? 'Trauma-informed psychiatric care' : 'Atención psiquiátrica informada en trauma'
    },
    {
      href: language === 'en' ? '/services/bipolar-treatment' : '/es/servicios/tratamiento-bipolar',
      label: language === 'en' ? 'Bipolar Treatment' : 'Tratamiento Bipolar',
      description: language === 'en' ? 'Expert mood stabilization' : 'Estabilización experta del ánimo'
    },
    {
      href: language === 'en' ? '/services/medication-management' : '/es/servicios/manejo-medicamentos',
      label: language === 'en' ? 'Medication Management' : 'Manejo de Medicamentos',
      description: language === 'en' ? 'Expert psychiatric medication care' : 'Cuidado experto de medicación psiquiátrica'
    }
  ];

  const locationItems = [
    {
      href: '/locations/psychiatrist-naples',
      label: language === 'en' ? 'Naples, FL' : 'Naples, FL',
      description: language === 'en' ? 'Comprehensive psychiatric care in Southwest Florida' : 'Atención psiquiátrica integral en el suroeste de Florida'
    },
    {
      href: '/locations/psychiatrist-ave-maria',
      label: language === 'en' ? 'Ave Maria, FL' : 'Ave Maria, FL',
      description: language === 'en' ? 'Expert psychiatric care in Ave Maria' : 'Atención psiquiátrica experta en Ave Maria'
    },
    {
      href: '/locations/psychiatrist-bonita-springs',
      label: language === 'en' ? 'Bonita Springs, FL' : 'Bonita Springs, FL',
      description: language === 'en' ? 'Professional psychiatric services in Bonita Springs' : 'Servicios psiquiátricos profesionales en Bonita Springs'
    },
    {
      href: '/locations/psychiatrist-estero',
      label: language === 'en' ? 'Estero, FL' : 'Estero, FL',
      description: language === 'en' ? 'Quality mental health care in Estero' : 'Atención de salud mental de calidad en Estero'
    },
    {
      href: '/locations/psychiatrist-fort-myers',
      label: language === 'en' ? 'Fort Myers, FL' : 'Fort Myers, FL',
      description: language === 'en' ? 'Comprehensive psychiatric treatment in Fort Myers' : 'Tratamiento psiquiátrico integral en Fort Myers'
    },
    {
      href: '/locations/psychiatrist-golden-gate',
      label: language === 'en' ? 'Golden Gate, FL' : 'Golden Gate, FL',
      description: language === 'en' ? 'Expert psychiatric care in Golden Gate' : 'Atención psiquiátrica experta en Golden Gate'
    },
    {
      href: '/locations/psychiatrist-immokalee',
      label: language === 'en' ? 'Immokalee, FL' : 'Immokalee, FL',
      description: language === 'en' ? 'Professional mental health services in Immokalee' : 'Servicios profesionales de salud mental en Immokalee'
    },
    {
      href: '/locations/psychiatrist-lely-resort',
      label: language === 'en' ? 'Lely Resort, FL' : 'Lely Resort, FL',
      description: language === 'en' ? 'Quality psychiatric care in Lely Resort' : 'Atención psiquiátrica de calidad en Lely Resort'
    },
    {
      href: '/locations/psychiatrist-marco-island',
      label: language === 'en' ? 'Marco Island, FL' : 'Marco Island, FL',
      description: language === 'en' ? 'Expert psychiatric treatment on Marco Island' : 'Tratamiento psiquiátrico experto en Marco Island'
    },
    {
      href: '/locations/psychiatrist-vanderbilt-beach',
      label: language === 'en' ? 'Vanderbilt Beach, FL' : 'Vanderbilt Beach, FL',
      description: language === 'en' ? 'Professional psychiatric services in Vanderbilt Beach' : 'Servicios psiquiátricos profesionales en Vanderbilt Beach'
    }
  ];

  const isActive = (href: string) => {
    return location === href || (href !== '/' && location.startsWith(href));
  };



  const handleMobileServiceClick = () => {
    console.log('Mobile service clicked - closing menus after navigation');
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsMobileServicesOpen(false);
    }, 100); // Small delay to allow navigation
  };

  const handleMobileLocationClick = () => {
    console.log('Mobile location clicked - closing menus after navigation');
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsMobileLocationsOpen(false);
    }, 100); // Small delay to allow navigation
  };

  // Apply background when scrolled OR when any dropdown/menu is open
  const hasOverlay = isScrolled || isServicesOpen || isLocationsOpen || isMobileMenuOpen;

  return (
    <>
    <header ref={headerRef} className={`fixed top-0 left-0 right-0 z-50 transition-[padding,height] ${
      !isScrolled && (isServicesOpen || isLocationsOpen || isMobileMenuOpen) ? 'duration-0' : 'duration-500'
    } ${
      hasOverlay 
        ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm' 
        : 'bg-transparent'
    } ${isServicesOpen || isLocationsOpen ? 'h-auto' : isMobileMenuOpen ? 'h-auto' : 'h-20 sm:h-24 md:h-28 lg:h-32'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
        <div ref={baseBarRef} className="flex items-center justify-between h-20 sm:h-24 md:h-28 lg:h-32 relative">
          {/* Logo */}
          <Link href="/" data-testid="logo-link" aria-label={language === 'en' ? 'Healing Minds Psychiatry - Go to homepage' : 'Healing Minds Psychiatry - Ir al inicio'}>
            <div className="text-sm sm:text-base md:text-lg font-body font-bold text-green-800">
              Healing Minds <span className="text-green-700">Psychiatry</span>
            </div>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2" ref={servicesRef}>
            <nav className="flex items-center transition-all duration-500 backdrop-blur-sm rounded-full p-2 border border-green-600/30" data-testid="desktop-nav">
            {navigationItems.map((item) => (
              <div key={item.href} className="relative">
                {item.hasDropdown ? (
                  <button
                    onClick={() => {
                      if (item.dropdownType === 'services') {
                        setIsServicesOpen(!isServicesOpen);
                        setIsLocationsOpen(false);
                      } else if (item.dropdownType === 'locations') {
                        setIsLocationsOpen(!isLocationsOpen);
                        setIsServicesOpen(false);
                      }
                    }}
                    className={`relative px-5 py-3 rounded-full font-body font-medium text-sm transition-all duration-500 flex items-center gap-2 after:content-[''] after:absolute after:bottom-2 after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:bg-primary after:transition-all after:duration-300 ${
                      isActive(item.href) || (item.dropdownType === 'services' && isServicesOpen) || (item.dropdownType === 'locations' && isLocationsOpen)
                        ? 'text-primary after:w-3/4'
                        : 'text-green-700 hover:text-primary after:w-0 hover:after:w-3/4'
                    }`}
                    data-testid={`nav-${item.href.replace('/', '') || 'home'}`}
                    aria-label={
                      item.dropdownType === 'services'
                        ? (isServicesOpen ? (language === 'en' ? 'Close services menu' : 'Cerrar menú de servicios') : (language === 'en' ? 'Open services menu' : 'Abrir menú de servicios'))
                        : item.dropdownType === 'locations'
                        ? (isLocationsOpen ? (language === 'en' ? 'Close locations menu' : 'Cerrar menú de ubicaciones') : (language === 'en' ? 'Open locations menu' : 'Abrir menú de ubicaciones'))
                        : ''
                    }
                    aria-expanded={item.dropdownType === 'services' ? isServicesOpen : item.dropdownType === 'locations' ? isLocationsOpen : false}
                  >
                    {item.label}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${
                      (item.dropdownType === 'services' && isServicesOpen) || (item.dropdownType === 'locations' && isLocationsOpen) ? 'rotate-180' : ''
                    }`} />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`relative px-5 py-3 rounded-full font-body font-medium text-sm transition-all duration-500 after:content-[''] after:absolute after:bottom-2 after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:bg-primary after:transition-all after:duration-300 ${
                      isActive(item.href)
                        ? 'text-primary after:w-3/4'
                        : 'text-green-700 hover:text-primary after:w-0 hover:after:w-3/4'
                    }`}
                    data-testid={`nav-${item.href.replace('/', '') || 'home'}`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            </nav>
          </div>

          {/* Language Toggle & CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-xs text-green-700 hover:text-green-800 transition-all duration-200 rounded-full px-3 py-2 font-body border border-green-600/30 flex items-center gap-1.5"
              data-testid="language-toggle"
              aria-label={language === 'en' ? 'Cambiar a español' : 'Switch to English'}
            >
              <span>{language === 'en' ? 'ES' : 'EN'}</span>
              <ReactCountryFlag
                countryCode={language === 'en' ? 'ES' : 'US'}
                svg
                alt={language === 'en' ? 'Bandera de España' : 'United States flag'}
                style={{
                  width: '20px',
                  height: '15px',
                  borderRadius: '2px',
                }}
              />
            </Button>
            <Link href="/contact">
              <Button
                className="group inline-flex items-center justify-center gap-2 rounded-full text-base font-semibold transition-all duration-300 bg-green-600 text-white hover:bg-green-700 px-8 py-6"
                data-testid="book-now-button"
              >
                <div className="w-6 h-6 min-w-[1.5rem] min-h-[1.5rem] rounded-full flex items-center justify-center transition-all duration-300 bg-green-500 flex-shrink-0">
                  <ArrowRight className="w-3 h-3 text-white" />
                </div>
                <span>Book Now</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden ml-auto">
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-primary rounded-full p-2 sm:p-3"
              data-testid="mobile-menu-toggle"
              style={{ minWidth: '48px', minHeight: '48px' }}
              aria-label={isMobileMenuOpen ? (language === 'en' ? 'Close navigation menu' : 'Cerrar menú de navegación') : (language === 'en' ? 'Open navigation menu' : 'Abrir menú de navegación')}
            >
              {isMobileMenuOpen ? (
                <X style={{ width: '24px', height: '24px', strokeWidth: '2px' }} />
              ) : (
                <Menu style={{ width: '24px', height: '24px', strokeWidth: '2px' }} />
              )}
            </Button>
          </div>
        </div>

        {/* Expanded Services Menu - Now inside header */}
        <div ref={servicesPanelRef} className={`transition-all duration-500 ease-in-out ${
          isServicesOpen 
            ? 'max-h-[500px] opacity-100 py-8' 
            : 'max-h-0 opacity-0 py-0 pointer-events-none'
        }`}>
          <div className="hidden md:block">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 mx-4 relative z-50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {serviceItems.map((service, index) => (
                  <Link
                    key={service.href}
                    href={service.href}
                    className="block"
                    data-testid={`dropdown-service-${index}`}
                  >
                    <Button
                      variant="ghost"
                      className="group w-full p-4 h-auto rounded-2xl transition-all duration-300 hover:bg-green-50/80 hover:shadow-sm border border-transparent hover:border-green-100 cursor-pointer relative z-10 text-left justify-start"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-3 h-3 min-w-[0.75rem] min-h-[0.75rem] rounded-full bg-green-600 mt-2 transition-all duration-300 group-hover:bg-green-700 flex-shrink-0"></div>
                        <div>
                          <h3 className="font-body font-semibold text-green-800 group-hover:text-green-900 transition-colors duration-300 text-lg">
                            {service.label}
                          </h3>
                          <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300 mt-1 leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </Button>
                  </Link>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200/60 text-center">
                <Link
                  href={language === 'en' ? '/services' : '/es/servicios'}
                  className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-body font-medium transition-colors duration-300 text-lg"
                >
                  {language === 'en' ? 'View All Services' : 'Ver Todos los Servicios'}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Locations Menu - Now inside header */}
        <div ref={locationsPanelRef} className={`transition-all duration-500 ease-in-out ${
          isLocationsOpen 
            ? 'max-h-[calc(100vh-8rem)] opacity-100 py-4 md:py-6 overflow-y-auto overscroll-contain' 
            : 'max-h-0 opacity-0 py-0 pointer-events-none'
        }`}>
          <div className="hidden md:block">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 md:p-8 mx-4 md:mx-6 relative z-50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {locationItems.map((location, index) => (
                  <Link
                    key={location.href}
                    href={location.href}
                    className="block"
                    data-testid={`dropdown-location-${index}`}
                  >
                    <Button
                      variant="ghost"
                      className="group w-full p-5 min-h-[112px] rounded-2xl overflow-hidden transition-all duration-300 hover:bg-green-50/80 hover:shadow-sm border border-transparent hover:border-green-100 cursor-pointer relative z-10 text-left justify-start"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-3 h-3 min-w-[0.75rem] min-h-[0.75rem] rounded-full bg-green-600 mt-2 transition-all duration-300 group-hover:bg-green-700 flex-shrink-0"></div>
                        <div className="min-w-0 w-full">
                          <h3 className="font-body font-semibold text-green-800 group-hover:text-green-900 transition-colors duration-300 text-lg">
                            {location.label}
                          </h3>
                          <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300 mt-2 leading-relaxed whitespace-normal break-words">
                            {location.description}
                          </p>
                        </div>
                      </div>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-md border-t border-gray-100 shadow-lg relative z-50" data-testid="mobile-menu">
          <div className="px-6 pt-4 pb-6 space-y-3 max-h-[80vh] overflow-y-auto">
            {navigationItems.map((item) => (
              <div key={item.href}>
                {item.hasDropdown ? (
                  <>
                    <button
                      onClick={() => {
                        if (item.dropdownType === 'services') {
                          setIsMobileServicesOpen(!isMobileServicesOpen);
                          setIsMobileLocationsOpen(false);
                        } else if (item.dropdownType === 'locations') {
                          setIsMobileLocationsOpen(!isMobileLocationsOpen);
                          setIsMobileServicesOpen(false);
                        }
                      }}
                      className={`flex items-center justify-between w-full py-3 text-base font-body transition-colors duration-200 ${
                        isActive(item.href) || (item.dropdownType === 'services' && isMobileServicesOpen) || (item.dropdownType === 'locations' && isMobileLocationsOpen)
                          ? 'text-primary font-medium'
                          : 'text-gray-700 hover:text-primary'
                      }`}
                      data-testid={`mobile-nav-${item.href.replace('/', '') || 'home'}`}
                      aria-label={
                        item.dropdownType === 'services'
                          ? (isMobileServicesOpen ? (language === 'en' ? 'Close services submenu' : 'Cerrar submenú de servicios') : (language === 'en' ? 'Open services submenu' : 'Abrir submenú de servicios'))
                          : item.dropdownType === 'locations'
                          ? (isMobileLocationsOpen ? (language === 'en' ? 'Close locations submenu' : 'Cerrar submenú de ubicaciones') : (language === 'en' ? 'Open locations submenu' : 'Abrir submenú de ubicaciones'))
                          : ''
                      }
                      aria-expanded={item.dropdownType === 'services' ? isMobileServicesOpen : item.dropdownType === 'locations' ? isMobileLocationsOpen : false}
                    >
                      {item.label}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                        (item.dropdownType === 'services' && isMobileServicesOpen) || (item.dropdownType === 'locations' && isMobileLocationsOpen) ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    {/* Mobile Services Submenu */}
                    {item.dropdownType === 'services' && isMobileServicesOpen && (
                      <div className="ml-4 mt-2 space-y-2 animate-in slide-in-from-top-2 fade-in-0">
                        {serviceItems.map((service, index) => (
                          <Link
                            key={service.href}
                            href={service.href}
                            className="block py-2 px-3 rounded-lg text-sm font-body text-gray-600 hover:text-green-700 hover:bg-green-50/80 transition-all duration-200"
                            data-testid={`mobile-dropdown-service-${index}`}
                            onClick={handleMobileServiceClick}
                          >
                            {service.label}
                          </Link>
                        ))}
                        <Link
                          href={language === 'en' ? '/services' : '/es/servicios'}
                          className="block py-2 px-3 rounded-lg text-sm font-body text-green-700 hover:text-green-800 hover:bg-green-50/80 transition-all duration-200 border-t border-gray-200/60 mt-2 pt-3"
                          onClick={handleMobileServiceClick}
                        >
                          {language === 'en' ? 'View All Services' : 'Ver Todos los Servicios'}
                        </Link>
                      </div>
                    )}

                    {/* Mobile Locations Submenu */}
                    {item.dropdownType === 'locations' && isMobileLocationsOpen && (
                      <div className="ml-4 mt-2 space-y-2 animate-in slide-in-from-top-2 fade-in-0">
                        {locationItems.map((location, index) => (
                          <Link
                            key={location.href}
                            href={location.href}
                            className="block py-2 px-3 rounded-lg text-sm font-body text-gray-600 hover:text-green-700 hover:bg-green-50/80 transition-all duration-200"
                            data-testid={`mobile-dropdown-location-${index}`}
                            onClick={handleMobileLocationClick}
                          >
                            {location.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`block py-3 text-base font-body transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'text-primary font-medium'
                        : 'text-gray-700 hover:text-primary'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-testid={`mobile-nav-${item.href.replace('/', '') || 'home'}`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:justify-between pt-6 border-t border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="text-sm text-gray-700 bg-gray-100/80 hover:bg-gray-200/80 hover:text-green-700 transition-all duration-200 rounded-full px-4 py-2 font-body border border-gray-200/50 shadow-sm flex items-center gap-2 flex-shrink-0"
                data-testid="mobile-language-toggle"
                aria-label={language === 'en' ? 'Cambiar idioma a español' : 'Change language to English'}
              >
                <span>{language === 'en' ? 'Español' : 'English'}</span>
                <ReactCountryFlag
                  countryCode={language === 'en' ? 'ES' : 'US'}
                  svg
                  style={{
                    width: '20px',
                    height: '15px',
                    borderRadius: '2px',
                  }}
                />
              </Button>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  className="group inline-flex items-center justify-center gap-2 rounded-full text-base font-semibold transition-all duration-300 bg-green-600 text-white hover:bg-green-700 px-6 py-4 w-full sm:w-auto"
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-testid="mobile-book-now-button"
                >
                  {t('nav.bookNow')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
    {/* Dynamic spacer to prevent content from being hidden behind fixed header */}
    <div 
      aria-hidden="true" 
      style={{ 
        height: `${spacerHeight}px`, 
        transition: 'height 500ms ease-in-out',
        willChange: 'height'
      }} 
      className="w-full" 
    />
    </>
  );
};

export default Header;
