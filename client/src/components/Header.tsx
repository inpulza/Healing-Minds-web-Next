import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { useClarity } from '@/hooks/use-clarity';
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
  const servicesRef = useRef<HTMLDivElement>(null);

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

  // Close mobile menu when navigation occurs (but keep services dropdown open)
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileServicesOpen(false);
  }, [location]);

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'es' : 'en';
    setLanguage(newLanguage);
    
    // Track language change with Clarity
    trackEvent('language_changed');
    setTag('selected_language', newLanguage);
  };

  const navigationItems = [
    { href: '/', label: t('nav.home') },
    { href: '/about', label: t('nav.about') },
    { href: '/services', label: t('nav.services'), hasDropdown: true },
    { href: '/locations/naples', label: language === 'en' ? 'Location' : 'Ubicación' },
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
      href: '/adhd-treatment-adults-naples-fl',
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

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 mb-4 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm' 
        : 'bg-transparent'
    } ${isServicesOpen ? 'h-auto' : isMobileMenuOpen ? 'h-auto' : 'h-20 sm:h-24 md:h-28 lg:h-32'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
        <div className="flex justify-between items-center h-20 sm:h-24 md:h-28 lg:h-32">
          {/* Logo */}
          <Link href="/" data-testid="logo-link" aria-label={language === 'en' ? 'Healing Minds Psychiatry - Go to homepage' : 'Healing Minds Psychiatry - Ir al inicio'}>
            <div className="text-lg sm:text-xl md:text-2xl font-body font-bold text-green-800">
              Healing Minds <span className="text-green-700">Psychiatry</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex relative mt-4 sm:mt-6 md:mt-8 mb-4 sm:mb-6 md:mb-8" ref={servicesRef}>
            <nav className={`flex items-center transition-all duration-500 ${
              isServicesOpen 
                ? 'bg-gray-100/90 backdrop-blur-lg rounded-3xl p-3 shadow-lg border border-gray-200/70' 
                : 'bg-gray-100/80 backdrop-blur-sm rounded-full p-2 shadow-sm border border-gray-200/50'
            }`} data-testid="desktop-nav">
              {navigationItems.map((item) => (
                <div key={item.href} className="relative">
                  {item.hasDropdown ? (
                    <button
                      onClick={() => setIsServicesOpen(!isServicesOpen)}
                      className={`relative px-6 py-3 rounded-full font-body font-medium transition-all duration-500 flex items-center gap-2 ${
                        isActive(item.href) || isServicesOpen
                          ? 'bg-white text-primary shadow-sm'
                          : 'text-gray-700 hover:text-primary hover:bg-white/50'
                      }`}
                      data-testid={`nav-${item.href.replace('/', '') || 'home'}`}
                      aria-label={isServicesOpen ? (language === 'en' ? 'Close services menu' : 'Cerrar menú de servicios') : (language === 'en' ? 'Open services menu' : 'Abrir menú de servicios')}
                      aria-expanded={isServicesOpen}
                    >
                      {item.label}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${
                        isServicesOpen ? 'rotate-180' : ''
                      }`} />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`relative px-6 py-3 rounded-full font-body font-medium transition-all duration-500 ${
                        isActive(item.href)
                          ? 'bg-white text-primary shadow-sm'
                          : 'text-gray-700 hover:text-primary hover:bg-white/50'
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
              className="text-sm text-gray-700 bg-gray-100/80 hover:bg-gray-200/80 hover:text-green-700 transition-all duration-200 rounded-full px-4 py-2 font-body border border-gray-200/50 shadow-sm flex items-center gap-2"
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
          <div className="md:hidden">
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
        <div className={`transition-all duration-500 ease-in-out ${
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
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-md border-t border-gray-100 shadow-lg relative z-60" data-testid="mobile-menu">
          <div className="px-6 pt-4 pb-6 space-y-3 max-h-[80vh] overflow-y-auto">
            {navigationItems.map((item) => (
              <div key={item.href}>
                {item.hasDropdown ? (
                  <>
                    <button
                      onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                      className={`flex items-center justify-between w-full py-3 text-base font-body transition-colors duration-200 ${
                        isActive(item.href) || isMobileServicesOpen
                          ? 'text-primary font-medium'
                          : 'text-gray-700 hover:text-primary'
                      }`}
                      data-testid={`mobile-nav-${item.href.replace('/', '') || 'home'}`}
                      aria-label={isMobileServicesOpen ? (language === 'en' ? 'Close services submenu' : 'Cerrar submenú de servicios') : (language === 'en' ? 'Open services submenu' : 'Abrir submenú de servicios')}
                      aria-expanded={isMobileServicesOpen}
                    >
                      {item.label}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                        isMobileServicesOpen ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    {/* Mobile Services Submenu */}
                    {isMobileServicesOpen && (
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
  );
};

export default Header;
