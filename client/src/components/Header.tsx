import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactCountryFlag from 'react-country-flag';

const Header = () => {
  const [location, navigate] = useLocation();
  const { language, setLanguage, t } = useLanguage();
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

    const handleClickOutside = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  const navigationItems = [
    { href: '/', label: t('nav.home') },
    { href: '/about', label: t('nav.about') },
    { href: '/services', label: t('nav.services'), hasDropdown: true },
    { href: '/for-patients', label: t('nav.forPatients') },
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
      href: language === 'en' ? '/services/adhd-treatment' : '/es/servicios/tratamiento-tdah',
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
      href: language === 'en' ? '/services/tms-therapy' : '/es/servicios/terapia-tms',
      label: language === 'en' ? 'TMS Therapy' : 'Terapia TMS',
      description: language === 'en' ? 'Advanced brain stimulation therapy' : 'Terapia avanzada de estimulación cerebral'
    }
  ];

  const isActive = (href: string) => {
    return location === href || (href !== '/' && location.startsWith(href));
  };

  const handleServiceNavigation = (href: string) => {
    console.log('Navigating to:', href);
    setIsServicesOpen(false);
    // Use window.location.href for more reliable navigation
    setTimeout(() => {
      window.location.href = href;
    }, 100);
  };

  const handleMobileServiceNavigation = (href: string) => {
    console.log('Mobile navigating to:', href);
    setIsMobileMenuOpen(false);
    setIsMobileServicesOpen(false);
    // Use window.location.href for more reliable navigation
    setTimeout(() => {
      window.location.href = href;
    }, 100);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 overflow-hidden ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm' 
        : 'bg-white/95 backdrop-blur-md border-b border-gray-100'
    } ${isServicesOpen ? 'h-auto' : 'h-20'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" data-testid="logo-link">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-full mr-3 flex items-center justify-center">
                <div className="text-white font-display font-bold text-sm">O</div>
              </div>
              <div className="text-2xl font-body font-bold text-green-800">
                Healing <span className="font-display italic text-green-700">Minds</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex relative" ref={servicesRef}>
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
            >
              <span>{language === 'en' ? 'ES' : 'EN'}</span>
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
            <Link href="/contact">
              <Button
                className="group inline-flex items-center justify-center gap-2 rounded-full text-base font-semibold transition-all duration-300 bg-green-600 text-white hover:bg-green-700 px-8 py-6"
                data-testid="book-now-button"
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 bg-green-500">
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
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-primary rounded-full p-2"
              data-testid="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Expanded Services Menu - Now inside header */}
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isServicesOpen 
            ? 'max-h-[500px] opacity-100 py-8' 
            : 'max-h-0 opacity-0 py-0'
        }`}>
          <div className="hidden md:block">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200/70 p-8 mx-4">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceItems.map((service, index) => (
                  <div
                    key={service.href}
                    onClick={() => handleServiceNavigation(service.href)}
                    className="group block p-4 rounded-2xl transition-all duration-300 hover:bg-green-50/80 hover:shadow-sm border border-transparent hover:border-green-100 cursor-pointer"
                    data-testid={`dropdown-service-${index}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-600 mt-2 transition-all duration-300 group-hover:bg-green-700"></div>
                      <div>
                        <h3 className="font-body font-semibold text-green-800 group-hover:text-green-900 transition-colors duration-300 text-lg">
                          {service.label}
                        </h3>
                        <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300 mt-1 leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200/60 text-center">
                <div
                  onClick={() => handleServiceNavigation(language === 'en' ? '/services' : '/servicios-espanol')}
                  className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-body font-medium transition-colors duration-300 text-lg cursor-pointer"
                >
                  {language === 'en' ? 'View All Services' : 'Ver Todos los Servicios'}
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100" data-testid="mobile-menu">
          <div className="px-6 pt-4 pb-6 space-y-3">
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
                          <div
                            key={service.href}
                            onClick={() => handleMobileServiceNavigation(service.href)}
                            className="block py-2 px-3 rounded-lg text-sm font-body text-gray-600 hover:text-green-700 hover:bg-green-50/80 transition-all duration-200 cursor-pointer"
                            data-testid={`mobile-dropdown-service-${index}`}
                          >
                            {service.label}
                          </div>
                        ))}
                        <div
                          onClick={() => handleMobileServiceNavigation(language === 'en' ? '/services' : '/servicios-espanol')}
                          className="block py-2 px-3 rounded-lg text-sm font-body text-green-700 hover:text-green-800 hover:bg-green-50/80 transition-all duration-200 border-t border-gray-200/60 mt-2 pt-3 cursor-pointer"
                        >
                          {language === 'en' ? 'View All Services' : 'Ver Todos los Servicios'}
                        </div>
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
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="text-sm text-gray-700 bg-gray-100/80 hover:bg-gray-200/80 hover:text-green-700 transition-all duration-200 rounded-full px-4 py-2 font-body border border-gray-200/50 shadow-sm flex items-center gap-2"
                data-testid="mobile-language-toggle"
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
              <Link href="/contact">
                <Button
                  className="group inline-flex items-center justify-center gap-2 rounded-full text-base font-semibold transition-all duration-300 bg-green-600 text-white hover:bg-green-700 px-6 py-4"
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
