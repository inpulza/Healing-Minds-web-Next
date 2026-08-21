import { isValidElement, createElement, type ReactNode } from 'react';
import { assetUrl } from '@/lib/asset-url';
import { useLanguage } from '@/hooks/useLanguage';
import { useTikTokEvents } from '@/hooks/useTikTokEvents';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { trackLeadConversion } from '@/lib/analytics';
import { Calendar, Clock, VideoIcon, Smartphone, Monitor, CheckCircle } from 'lucide-react';
import telehealthHeroBg from '../assets/telehealth-hero-bg.webp?v=2';

// The hero title is rendered in both the mobile and desktop layouts. To avoid
// duplicate <h1> elements in the DOM, the mobile copy is demoted to a <p>
// (same classes/styles) while the desktop copy keeps the semantic <h1>.
const demoteHeading = (node: ReactNode): ReactNode => {
  if (isValidElement(node) && node.type === 'h1') {
    return createElement('p', node.props as Record<string, unknown>);
  }
  return node;
};

interface CharmHealthBookingProps {
  variant?: 'default' | 'compact' | 'prominent';
  showDescription?: boolean;
  className?: string;
  heroTitle?: React.ReactNode;
  heroBadges?: React.ReactNode;
  heroDescription?: React.ReactNode;
  heroImage?: string;
  heroImageAlt?: string;
  colorScheme?: 'blue' | 'green';
}

const CharmHealthBooking = ({ 
  variant = 'default', 
  showDescription = true, 
  className = '',
  heroTitle,
  heroBadges,
  heroDescription,
  heroImage,
  heroImageAlt,
  colorScheme = 'blue'
}: CharmHealthBookingProps) => {
  const { language } = useLanguage();
  const { trackTelehealthClick } = useTikTokEvents();

  const charmHealthUrl = "https://ehr.charmtracker.com/publicCal.sas?method=getCal&digest=e54bdf77b791eb90cd5ef77f1bfb3dd742f7d5dfc96511bf80477815162a23b66ee57013c1a537e6a04718346ddb0ed8d95fcbc3b76e32a2";

  const content = {
    en: {
      title: "Request a Telehealth Appointment",
      subtitle: "Submit an online appointment request for office review",
      description: "Request a telehealth appointment through CharmHealth. The office confirms the treating professional, patient location, licensing, clinical suitability and availability before booking.",
      features: [
        "Availability confirmed by the office",
        "Video may be offered after office confirmation",
        "Medication management",
        "Appointment requests reviewed by the office"
      ],
      button: "Request Online",
      badge: "Office Confirmation Required"
    },
    es: {
      title: "Solicitar una Cita de Telesalud",
      subtitle: "Envíe una solicitud de cita en línea para revisión de la oficina",
      description: "Solicite una cita de telesalud mediante CharmHealth. La oficina confirma el profesional tratante, ubicación del paciente, licencias, adecuación clínica y disponibilidad antes de reservar.",
      features: [
        "Disponibilidad confirmada por la oficina",
        "Puede ofrecerse video después de la confirmación de la oficina",
        "Manejo de medicamentos", 
        "Solicitudes de cita revisadas por la oficina"
      ],
      button: "Solicitar en Línea",
      badge: "Requiere Confirmación de la Oficina"
    }
  };

  const currentContent = content[language];
  const defaultHeroAlt = language === 'en'
    ? 'Dr. Melva Reve in a medical office'
    : 'Dra. Melva Reve en una oficina médica';

  if (variant === 'compact') {
    return (
      <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 ${className}`}>
        <Badge variant="outline" className="bg-[#ffffff] text-blue-700 border-blue-200 h-12 sm:h-10 px-4 py-3 sm:py-0 flex items-center justify-center text-sm w-full sm:w-auto">
          <VideoIcon className="w-4 h-4 mr-2" />
          {currentContent.badge}
        </Badge>
        <Button
          onClick={() => {
            trackLeadConversion('appointment_booking', { click_location: 'charm_health_compact' });
            trackTelehealthClick('charm-health-compact');
            window.open(charmHealthUrl, '_blank', 'noopener,noreferrer');
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white h-12 sm:h-10 px-4 py-3 sm:py-0 text-sm font-semibold w-full sm:w-auto"
          data-testid="button-charm-health-compact"
        >
          <Calendar className="w-4 h-4 mr-2" />
          {currentContent.button}
        </Button>
      </div>
    );
  }

  if (variant === 'prominent') {
    return (
      <Card className={`w-full overflow-hidden border-blue-200 ${className}`}>
        {/* Mobile Layout - Stacked */}
        <div className="md:hidden">
          {/* Mobile Image - Shorter aspect ratio to crop bottom and remove watermark */}
          <div className="relative aspect-[4/5]">
            <img 
              src={heroImage || assetUrl(telehealthHeroBg)}
              alt={heroImageAlt || defaultHeroAlt}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: '75% top' }}
            />
          </div>
          
          {/* Mobile Content - Overlaps image to crop bottom */}
          <div className="p-6 bg-white -mt-12 relative z-10 rounded-t-3xl">
            {heroTitle && (
              <div className="mb-6">
                {demoteHeading(heroTitle)}
              </div>
            )}
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <VideoIcon className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-blue-700 font-medium text-sm" data-testid="telehealth-subtitle">
                {currentContent.subtitle}
              </p>
            </div>
            
            <h3 className="text-2xl font-body font-bold text-gray-900 mb-4" data-testid="telehealth-title">
              {currentContent.title}
            </h3>
            
            <Button
              onClick={() => {
                trackLeadConversion('appointment_booking', { click_location: 'charm_health_prominent_mobile' });
                trackTelehealthClick('charm-health-prominent');
                window.open(charmHealthUrl, '_blank', 'noopener,noreferrer');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 w-full"
              data-testid="button-charm-health-prominent"
            >
              <Calendar className="w-5 h-5 mr-2" />
              {currentContent.button}
            </Button>
          </div>
        </div>
        {/* Desktop Layout - Horizontal */}
        <div className="hidden md:block relative aspect-[18/9]">
          <img 
            src={heroImage || assetUrl(telehealthHeroBg)}
            alt={heroImageAlt || defaultHeroAlt}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/15 to-transparent"></div>
          
          {/* Icono y subtítulo en el borde inferior izquierdo */}
          <div className="absolute bottom-10 left-8 sm:left-12 lg:left-16 flex items-center gap-3">
            <div className={`w-12 h-12 ${colorScheme === 'green' ? 'bg-green-100' : 'bg-blue-100'} rounded-full flex items-center justify-center flex-shrink-0`}>
              <VideoIcon className={`w-6 h-6 ${colorScheme === 'green' ? 'text-green-600' : 'text-blue-600'}`} />
            </div>
            <p className={`${colorScheme === 'green' ? 'text-green-700' : 'text-blue-700'} font-medium sm:text-base text-[18px]`} data-testid="telehealth-subtitle-desktop">
              {currentContent.subtitle}. {currentContent.title}
            </p>
          </div>
          
          {/* Contenido principal - posicionado arriba */}
          <div className="relative h-full flex items-start px-8 sm:px-12 lg:px-16 pt-12">
            <div className="max-w-2xl text-left">
              {heroBadges && (
                <div className="mb-6">
                  {heroBadges}
                </div>
              )}
              
              {heroTitle && (
                <div className="mb-5">
                  {heroTitle}
                </div>
              )}
              
              {heroDescription && (
                <div className="mb-6">
                  {heroDescription}
                </div>
              )}
              
              <Button
                onClick={() => {
                  trackLeadConversion('appointment_booking', { click_location: 'charm_health_prominent_desktop' });
                  trackTelehealthClick('charm-health-prominent');
                  window.open(charmHealthUrl, '_blank', 'noopener,noreferrer');
                }}
                className={`${colorScheme === 'green' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200`}
                data-testid="button-charm-health-prominent-desktop"
              >
                <Calendar className="w-5 h-5 mr-2" />
                {currentContent.button}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={`bg-white border-blue-200 p-6 shadow-sm hover:shadow-md transition-shadow mt-auto ${className}`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <VideoIcon className="w-6 h-6 text-blue-600" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-lg font-body font-semibold text-gray-900" data-testid="telehealth-title-default">
              {currentContent.title}
            </h4>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
              {currentContent.badge}
            </Badge>
          </div>
          
          <p className="text-blue-700 font-medium mb-3 text-sm" data-testid="telehealth-subtitle-default">
            {currentContent.subtitle}
          </p>
          
          {showDescription && (
            <p className="text-gray-600 mb-4 text-sm leading-relaxed" data-testid="telehealth-description-default">
              {currentContent.description}
            </p>
          )}
          
          <Button
            onClick={() => {
              trackLeadConversion('appointment_booking', { click_location: 'charm_health_default' });
              trackTelehealthClick('charm-health-default');
              window.open(charmHealthUrl, '_blank', 'noopener,noreferrer');
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            data-testid="button-charm-health-default"
          >
            <Calendar className="w-4 h-4 mr-2" />
            {currentContent.button}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CharmHealthBooking;
