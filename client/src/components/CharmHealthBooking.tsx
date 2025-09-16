import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, VideoIcon, Smartphone, Monitor, CheckCircle, AlertTriangle, Phone, ArrowRight, Zap } from 'lucide-react';
import { urgencyMessaging, ctaOptions } from '@/data/content';

interface CharmHealthBookingProps {
  variant?: 'default' | 'compact' | 'prominent' | 'urgent' | 'crisis';
  showDescription?: boolean;
  className?: string;
  showUrgency?: boolean;
  showAvailability?: boolean;
}

const CharmHealthBooking = ({ 
  variant = 'default', 
  showDescription = true, 
  className = '',
  showUrgency = true,
  showAvailability = true 
}: CharmHealthBookingProps) => {
  const { language } = useLanguage();

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

  // NEW: Urgent variant with enhanced urgency messaging
  if (variant === 'urgent') {
    return (
      <Card className={`bg-gradient-to-br from-red-50 to-orange-50 border-red-200 p-6 ${className}`}>
        <div className="space-y-4">
          {/* Urgency Header */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
              <Zap className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <Badge className="bg-red-500 text-white text-xs font-medium px-3 py-1 mb-2" data-testid="urgent-badge">
                {urgencyMessaging[language].urgency.bookingFast}
              </Badge>
              <h4 className="text-lg font-bold text-red-800" data-testid="urgent-title">
                {language === 'en' ? 'Urgent Booking Available' : 'Reserva Urgente Disponible'}
              </h4>
            </div>
          </div>

          {/* Availability Indicators */}
          {showAvailability && (
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1" data-testid="urgent-availability-1">
                {urgencyMessaging[language].availability.sameDayAvailable}
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-1" data-testid="urgent-availability-2">
                {urgencyMessaging[language].availability.nextAvailable}
              </Badge>
            </div>
          )}

          {/* Enhanced Features for Urgent */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
              <span>{language === 'en' ? 'Same-day slots' : 'Citas mismo día'}</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
              <span>{language === 'en' ? 'Instant booking' : 'Reserva instantánea'}</span>
            </div>
          </div>

          {/* Primary CTA */}
          <Button
            onClick={() => window.open(charmHealthUrl, '_blank', 'noopener,noreferrer')}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-base font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            data-testid="button-charm-health-urgent"
          >
            <Calendar className="w-5 h-5 mr-2" />
            {language === 'en' ? 'Book Urgent Appointment' : 'Reservar Cita Urgente'}
          </Button>

          {/* Secondary Actions */}
          <div className="flex gap-2">
            <a href="tel:(239) 423-0272" className="flex-1">
              <Button
                className="w-full bg-white text-red-600 border-2 border-red-600 hover:bg-red-50 py-3 text-sm font-semibold rounded-full"
                data-testid="button-call-urgent"
              >
                <Phone className="w-4 h-4 mr-1" />
                {language === 'en' ? 'Call Now' : 'Llamar'}
              </Button>
            </a>
          </div>
        </div>
      </Card>
    );
  }

  // NEW: Crisis variant for emergency situations
  if (variant === 'crisis') {
    return (
      <Card className={`bg-gradient-to-br from-red-100 to-red-50 border-red-300 p-6 ${className}`}>
        <div className="space-y-4">
          {/* Crisis Header */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-6 h-6 text-red-700" />
            </div>
            <div>
              <Badge className="bg-red-600 text-white text-sm font-bold px-4 py-2 mb-2" data-testid="crisis-badge">
                {urgencyMessaging[language].crisis.emergency}
              </Badge>
              <h4 className="text-xl font-bold text-red-900" data-testid="crisis-title">
                {language === 'en' ? 'Mental Health Crisis Support' : 'Apoyo de Crisis de Salud Mental'}
              </h4>
            </div>
          </div>

          {/* Crisis Description */}
          <p className="text-red-800 font-medium text-sm leading-relaxed">
            {language === 'en' 
              ? 'If you are experiencing a mental health emergency, immediate support is available. Do not hesitate to reach out.'
              : 'Si está experimentando una emergencia de salud mental, hay apoyo inmediato disponible. No dude en comunicarse.'
            }
          </p>

          {/* Emergency Numbers */}
          <div className="bg-white rounded-lg p-4 border border-red-200">
            <h5 className="font-bold text-red-900 text-sm mb-3">
              {language === 'en' ? 'Emergency Contacts:' : 'Contactos de Emergencia:'}
            </h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span>{urgencyMessaging[language].crisis.crisis988}</span>
                <a href="tel:988">
                  <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2" data-testid="button-crisis-988">
                    <Phone className="w-3 h-3 mr-1" />
                    988
                  </Button>
                </a>
              </div>
              <div className="flex justify-between items-center">
                <span>{urgencyMessaging[language].crisis.emergency911}</span>
                <a href="tel:911">
                  <Button size="sm" className="bg-red-700 hover:bg-red-800 text-white px-4 py-2" data-testid="button-crisis-911">
                    <Phone className="w-3 h-3 mr-1" />
                    911
                  </Button>
                </a>
              </div>
              <div className="flex justify-between items-center">
                <span>{urgencyMessaging[language].crisis.davidLawrence}</span>
                <a href="tel:(239) 263-7158">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2" data-testid="button-crisis-local">
                    <Phone className="w-3 h-3 mr-1" />
                    (239) 263-7158
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Professional Support CTA */}
          <Button
            onClick={() => window.open(charmHealthUrl, '_blank', 'noopener,noreferrer')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-base font-semibold rounded-full shadow-lg"
            data-testid="button-charm-health-crisis"
          >
            <Calendar className="w-5 h-5 mr-2" />
            {language === 'en' ? 'Schedule Professional Support' : 'Programar Apoyo Profesional'}
          </Button>
        </div>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex flex-col sm:flex-row items-center gap-3 ${className}`}>
        {/* Enhanced Compact with Urgency */}
        {showUrgency && (
          <Badge className="bg-red-500 text-white text-xs px-3 py-1 animate-pulse" data-testid="compact-urgency">
            {urgencyMessaging[language].urgency.limitedTime}
          </Badge>
        )}
        <div className="flex items-center gap-3">
          {showAvailability && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 h-10 px-4 flex items-center text-sm">
              <CheckCircle className="w-4 h-4 mr-2" />
              {urgencyMessaging[language].availability.sameDayAvailable}
            </Badge>
          )}
          <Badge variant="outline" className="bg-[#ffffff] text-blue-700 border-blue-200 h-10 px-4 flex items-center text-sm">
            <VideoIcon className="w-4 h-4 mr-2" />
            {currentContent.badge}
          </Badge>
          <Button
            onClick={() => window.open(charmHealthUrl, '_blank', 'noopener,noreferrer')}
            className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-6 text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200"
            data-testid="button-charm-health-compact"
          >
            <Calendar className="w-4 h-4 mr-2" />
            {currentContent.button}
          </Button>
        </div>
      </div>
    );
  }

  if (variant === 'prominent') {
    return (
      <Card className={`bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 p-8 ${className}`}>
        <div className="text-center">
          {/* Enhanced Urgency Messaging for Prominent */}
          {showUrgency && (
            <div className="mb-6">
              <Badge className="bg-red-500 text-white px-4 py-2 text-sm font-bold animate-pulse mb-3" data-testid="prominent-urgency">
                {urgencyMessaging[language].urgency.bookingFast}
              </Badge>
              {showAvailability && (
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge className="bg-green-100 text-green-800 px-3 py-1 text-xs" data-testid="prominent-availability-1">
                    {urgencyMessaging[language].availability.sameDayAvailable}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 px-3 py-1 text-xs" data-testid="prominent-availability-2">
                    {urgencyMessaging[language].availability.answeringNow}
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800 px-3 py-1 text-xs" data-testid="prominent-availability-3">
                    {urgencyMessaging[language].availability.fastResponse}
                  </Badge>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <VideoIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <Badge className="bg-slate-500 text-white mb-4 px-6 py-3 text-base font-medium rounded-full" data-testid="telehealth-badge">
            <Monitor className="w-4 h-4 mr-2" />
            {currentContent.badge}
          </Badge>
          
          <h3 className="text-2xl font-body font-bold text-gray-900 mb-2" data-testid="telehealth-title">
            {currentContent.title}
          </h3>
          
          <p className="text-blue-700 font-medium mb-4" data-testid="telehealth-subtitle">
            {currentContent.subtitle}
          </p>
          
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
          
          {/* Enhanced Primary CTA */}
          <Button
            onClick={() => window.open(charmHealthUrl, '_blank', 'noopener,noreferrer')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-7 text-xl font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 mb-4"
            data-testid="button-charm-health-prominent"
          >
            <Calendar className="w-6 h-6 mr-3" />
            {currentContent.button}
            <Badge className="bg-blue-500 text-white text-xs px-2 py-1 ml-3">
              {language === 'en' ? 'Instant Confirmation' : 'Confirmación Instantánea'}
            </Badge>
          </Button>

          {/* Secondary Actions for Prominent */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <a href="tel:(239) 423-0272">
              <Button
                className="bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 px-6 py-3 rounded-full font-semibold"
                data-testid="button-call-prominent"
              >
                <Phone className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Call Now' : 'Llamar Ahora'}
              </Button>
            </a>
            <Button
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-6 py-3 rounded-full font-medium"
              data-testid="button-callback-prominent"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Request Callback' : 'Solicitar Llamada'}
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {urgencyMessaging[language].availability.onlineNow}
            </div>
            <div className="flex items-center">
              <Smartphone className="w-4 h-4 mr-1" />
              {language === 'en' ? 'Mobile Optimized' : 'Móvil Optimizado'}
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
            onClick={() => window.open(charmHealthUrl, '_blank', 'noopener,noreferrer')}
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