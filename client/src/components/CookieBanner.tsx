import React, { useState, useEffect } from 'react';
import { X, Settings, Shield, BarChart, Target, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { useLanguage } from '@/hooks/useLanguage';
import { CookieConsent } from '@/types/cookies';

interface CookieBannerProps {
  className?: string;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ className = '' }) => {
  const { consentState, acceptAll, rejectAll, acceptSelected, hideBanner } = useCookieConsent();
  const { language, t } = useLanguage();
  const [showPreferences, setShowPreferences] = useState(false);
  const [tempConsent, setTempConsent] = useState<CookieConsent>(consentState.consent);

  // Update temp consent when consent state changes
  useEffect(() => {
    setTempConsent(consentState.consent);
  }, [consentState.consent]);

  const cookieCategories = [
    {
      id: 'necessary' as const,
      icon: Shield,
      title: language === 'es' ? 'Esenciales' : 'Necessary',
      description: language === 'es' 
        ? 'Estas cookies son esenciales para el funcionamiento básico del sitio web y no se pueden desactivar.'
        : 'These cookies are essential for the basic functionality of the website and cannot be disabled.',
      enabled: true,
      required: true,
      examples: language === 'es' 
        ? 'Gestión de sesiones, preferencias de idioma, funciones de seguridad'
        : 'Session management, language preferences, security features'
    },
    {
      id: 'analytics' as const,
      icon: BarChart,
      title: language === 'es' ? 'Analíticas' : 'Analytics',
      description: language === 'es'
        ? 'Estas cookies nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web mediante la recopilación de información de forma anónima.'
        : 'These cookies help us understand how visitors interact with our website by collecting information anonymously.',
      enabled: tempConsent.analytics,
      required: false,
      examples: language === 'es'
        ? 'Google Analytics, Microsoft Clarity, métricas de rendimiento'
        : 'Google Analytics, Microsoft Clarity, performance metrics'
    },
    {
      id: 'marketing' as const,
      icon: Target,
      title: language === 'es' ? 'Marketing' : 'Marketing',
      description: language === 'es'
        ? 'Estas cookies se utilizan para mostrar anuncios que son relevantes para usted y sus intereses.'
        : 'These cookies are used to show advertisements that are relevant to you and your interests.',
      enabled: tempConsent.marketing,
      required: false,
      examples: language === 'es'
        ? 'Google Ads, TikTok Pixel, remarketing'
        : 'Google Ads, TikTok Pixel, remarketing'
    }
  ];

  const handleCategoryToggle = (categoryId: keyof CookieConsent, enabled: boolean) => {
    if (categoryId === 'necessary') return; // Cannot toggle necessary cookies
    
    setTempConsent(prev => ({
      ...prev,
      [categoryId]: enabled
    }));
  };

  const handleSavePreferences = () => {
    acceptSelected(tempConsent);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    acceptAll();
  };

  const handleRejectAll = () => {
    rejectAll();
  };

  const translations = {
    en: {
      bannerTitle: 'We value your privacy',
      bannerDescription: 'We use cookies to enhance your browsing experience, provide personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.',
      acceptAll: 'Accept All',
      rejectAll: 'Reject All',
      managePreferences: 'Manage Preferences',
      cookiePreferences: 'Cookie Preferences',
      preferencesDescription: 'Choose which cookies you want to allow. You can change these settings at any time.',
      savePreferences: 'Save Preferences',
      category: 'Category',
      status: 'Status',
      required: 'Required',
      optional: 'Optional',
      enabled: 'Enabled',
      disabled: 'Disabled',
      examples: 'Examples',
      learnMore: 'Learn more about our privacy practices',
      privacyPolicy: 'Privacy Policy',
    },
    es: {
      bannerTitle: 'Valoramos su privacidad',
      bannerDescription: 'Utilizamos cookies para mejorar su experiencia de navegación, proporcionar contenido personalizado y analizar nuestro tráfico. Al hacer clic en "Aceptar todo", usted consiente nuestro uso de cookies.',
      acceptAll: 'Aceptar Todo',
      rejectAll: 'Rechazar Todo',
      managePreferences: 'Gestionar Preferencias',
      cookiePreferences: 'Preferencias de Cookies',
      preferencesDescription: 'Elija qué cookies desea permitir. Puede cambiar estas configuraciones en cualquier momento.',
      savePreferences: 'Guardar Preferencias',
      category: 'Categoría',
      status: 'Estado',
      required: 'Requerido',
      optional: 'Opcional',
      enabled: 'Habilitado',
      disabled: 'Deshabilitado',
      examples: 'Ejemplos',
      learnMore: 'Conozca más sobre nuestras prácticas de privacidad',
      privacyPolicy: 'Política de Privacidad',
    }
  };

  const tr = translations[language];

  // Don't show banner if user has already consented or explicitly hidden it
  if (consentState.hasConsented && !consentState.showBanner) {
    return null;
  }

  return (
    <>
      {/* Cookie Banner */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-[10000] ${className}`}
        data-testid="cookie-banner"
      >
        <div className="container mx-auto p-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <Info className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1" data-testid="banner-title">
                    {tr.bannerTitle}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300" data-testid="banner-description">
                    {tr.bannerDescription}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 min-w-fit">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPreferences(true)}
                data-testid="button-manage-preferences"
                className="whitespace-nowrap"
              >
                <Settings className="h-4 w-4 mr-2" />
                {tr.managePreferences}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRejectAll}
                data-testid="button-reject-all"
                className="whitespace-nowrap"
              >
                {tr.rejectAll}
              </Button>
              <Button 
                size="sm"
                onClick={handleAcceptAll}
                data-testid="button-accept-all"
                className="bg-green-700 hover:bg-green-800 whitespace-nowrap"
              >
                {tr.acceptAll}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Preferences Modal */}
      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="cookie-preferences-modal">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {tr.cookiePreferences}
            </DialogTitle>
            <DialogDescription>
              {tr.preferencesDescription}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {cookieCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card key={category.id} className="border-gray-200 dark:border-gray-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                        <div>
                          <CardTitle className="text-base">{category.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant={category.required ? 'default' : 'secondary'}
                              className={category.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}
                            >
                              {category.required ? tr.required : tr.optional}
                            </Badge>
                            <Badge 
                              variant={category.enabled ? 'default' : 'outline'}
                              className={category.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                            >
                              {category.enabled ? tr.enabled : tr.disabled}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={category.enabled}
                        onCheckedChange={(checked) => handleCategoryToggle(category.id, checked)}
                        disabled={category.required}
                        data-testid={`switch-${category.id}`}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="mb-3">
                      {category.description}
                    </CardDescription>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <strong>{tr.examples}:</strong> {category.examples}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <Button 
              variant="ghost" 
              size="sm"
              asChild
              className="text-blue-600 hover:text-blue-700"
            >
              <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                {tr.privacyPolicy}
              </a>
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowPreferences(false)}
                data-testid="button-cancel-preferences"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSavePreferences}
                data-testid="button-save-preferences"
                className="bg-green-600 hover:bg-green-700"
              >
                {tr.savePreferences}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieBanner;
