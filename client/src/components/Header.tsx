import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [location] = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" data-testid="logo-link">
            <div className="flex items-center">
              <div className="text-2xl font-serif font-bold text-primary-green">
                Healing Minds
              </div>
              <span className="ml-2 text-sm text-gray-600 hidden sm:inline">
                Dr. Melva Reve, MD
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8" data-testid="desktop-nav">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-primary-green font-medium'
                    : 'text-gray-700 hover:text-primary-green'
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
              className="text-sm text-gray-600 hover:text-primary-green transition-colors duration-200"
              data-testid="language-toggle"
            >
              {language === 'en' ? 'ES' : 'EN'}
            </Button>
            <Link href="/contact">
              <Button
                className="bg-primary-green text-white hover:bg-primary-green-hover transition-colors duration-200"
                data-testid="book-now-button"
              >
                {t('nav.bookNow')}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-primary-green"
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
        <div className="md:hidden bg-white border-t border-gray-100" data-testid="mobile-menu">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block py-2 text-base transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-primary-green font-medium'
                    : 'text-gray-700 hover:text-primary-green'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid={`mobile-nav-${item.href.replace('/', '') || 'home'}`}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="text-sm text-gray-600 hover:text-primary-green"
                data-testid="mobile-language-toggle"
              >
                {language === 'en' ? 'Español' : 'English'}
              </Button>
              <Link href="/contact">
                <Button
                  className="bg-primary-green text-white hover:bg-primary-green-hover"
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
