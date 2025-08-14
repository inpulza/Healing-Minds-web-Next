import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [location] = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  const navigationItems = [
    { href: '/', label: t('nav.home') },
    { href: '/about', label: t('nav.about') },
    { href: '/services', label: t('nav.services') },
    { href: '/for-patients', label: t('nav.forPatients') },
    { href: '/contact', label: t('nav.contact') },
  ];

  const isActive = (href: string) => {
    return location === href || (href !== '/' && location.startsWith(href));
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm' 
        : 'bg-white/95 backdrop-blur-md border-b border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" data-testid="logo-link">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-full mr-3 flex items-center justify-center">
                <div className="text-white font-display font-bold text-sm">O</div>
              </div>
              <div className="text-2xl font-display font-bold text-green-800">
                Healing Minds
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center bg-gray-100/80 backdrop-blur-sm rounded-full p-2 shadow-sm border border-gray-200/50" data-testid="desktop-nav">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-6 py-3 rounded-full font-body font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-700 hover:text-primary hover:bg-white/50'
                }`}
                data-testid={`nav-${item.href.replace('/', '') || 'home'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

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
              <span className="text-base">
                {language === 'en' ? '🇪🇸' : '🇺🇸'}
              </span>
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
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100" data-testid="mobile-menu">
          <div className="px-6 pt-4 pb-6 space-y-3">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
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
                <span className="text-base">
                  {language === 'en' ? '🇪🇸' : '🇺🇸'}
                </span>
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
