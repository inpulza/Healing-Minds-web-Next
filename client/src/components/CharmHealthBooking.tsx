import { useLanguage } from '@/hooks/useLanguage';
import { useTikTokEvents } from '@/hooks/useTikTokEvents';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, VideoIcon, Smartphone, Monitor, CheckCircle } from 'lucide-react';
import telehealthHeroBg from '../assets/telehealth-hero-bg.png?v=2';

interface CharmHealthBookingProps {
  variant?: 'default' | 'compact' | 'prominent';
  showDescription?: boolean;
  className?: string;
  heroTitle?: React.ReactNode;
  heroBadges?: React.ReactNode;
  colorScheme?: 'blue' | 'green';
}

const CharmHealthBooking = ({ 
  variant = 'default', 
  showDescription = true, 
  className = '',
  heroTitle,
  heroBadges,
  colorScheme = 'blue'
}: CharmHealthBookingProps) => {
  const { language } = useLanguage();
  const { trackTelehealthClick } = useTikTokEvents();

  const charmHealthUrl = "https://ehr.charmtracker.com/publicCal.sas?method=getCal&digest=e54bdf77b791eb90cd5ef77f1bfb3dd742f7d5dfc96511bf80477815162a23b66ee57013c1a537e6a04718346ddb0ed8d95fcbc3b76e32a2";

  const content = {
    en: {
      title: "Book Telehealth Appointment",
      subtitle: "Schedule online consultation with Dr. Melva Reve",
      description: "Access professional psychiatric care from anywhere in Florida through secure telehealth sessions using CharmHealth platform.",
      features: [
        "Real-time availability",
        "Secure video sessions", 
        "Prescription management",
        "24/7 scheduling access"
      ],
      button: "Schedule Now",
      badge: "Telehealth Available"
    },
    es: {
      title: "Reservar Cita de Telesalud",
      subtitle: "Programe consulta en línea con la Dra. Melva Reve",
      description: "Acceda a atención psiquiátrica profesional desde cualquier lugar de Florida a través de sesiones seguras de telesalud usando la plataforma CharmHealth.",
      features: [
        "Disponibilidad en tiempo real",
        "Sesiones de video seguras",
        "Manejo de prescripciones", 
        "Acceso de programación 24/7"
      ],
      button: "Programar Ahora",
      badge: "Telesalud Disponible"
    }
  };

  const currentContent = content[language];

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Badge variant="outline" className="bg-[#ffffff] text-blue-700 border-blue-200 h-10 px-4 flex items-center text-sm">
          <VideoIcon className="w-4 h-4 mr-2" />
          {currentContent.badge}
        </Badge>
        <Button
          onClick={() => {
            trackTelehealthClick('charm-health-compact');
            window.open(charmHealthUrl, '_blank', 'noopener,noreferrer');
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-4 text-sm font-semibold"
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
              src={telehealthHeroBg} 
              alt="Telehealth Background"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: '75% top' }}
            />
          </div>
          
          {/* Mobile Content - Overlaps image to crop bottom */}
          <div className="p-6 bg-white -mt-12 relative z-10 rounded-t-3xl">
            {heroTitle && (
              <div className="mb-6">
                {heroTitle}
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
            src={telehealthHeroBg} 
            alt="Telehealth Background"
            className="absolute inset-0 w-full h-full object-contain object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 to-transparent"></div>
          
          {/* Icono y subtítulo en el borde inferior izquierdo */}
          <div className="absolute bottom-10 left-8 sm:left-12 lg:left-16 flex items-center gap-3">
            <div className={`w-12 h-12 ${colorScheme === 'green' ? 'bg-green-100' : 'bg-blue-100'} rounded-full flex items-center justify-center flex-shrink-0`}>
              <VideoIcon className={`w-6 h-6 ${colorScheme === 'green' ? 'text-green-600' : 'text-blue-600'}`} />
            </div>
            <p className={`${colorScheme === 'green' ? 'text-green-700' : 'text-blue-700'} font-medium sm:text-base text-[18px]`} data-testid="telehealth-subtitle-desktop">
              {currentContent.subtitle}
            </p>
          </div>
          
          {/* Contenido principal centrado verticalmente */}
          <div className="relative h-full flex items-center px-8 sm:px-12 lg:px-16">
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
              
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-body font-bold text-gray-900 mb-4" data-testid="telehealth-title-desktop">
                {currentContent.title}
              </h3>
              
              {showDescription && (
                <>
                  <p className="text-gray-600 mb-6 leading-relaxed" data-testid="telehealth-description">
                    {currentContent.description}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-3 mb-8">
                    {currentContent.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              <Button
                onClick={() => {
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