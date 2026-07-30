import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useClarity } from '@/hooks/use-clarity';
import { useTikTokEvents } from '@/hooks/useTikTokEvents';
import { trackLeadConversion } from '@/lib/analytics';
import ContactFormModal from '@/components/ContactFormModal';
import { Calendar, Phone, FileText } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';

const MobileToolbar = () => {
  const { language } = useLanguage();
  const { trackEvent, setTag } = useClarity();
  const { trackPhoneClick, trackTelehealthClick } = useTikTokEvents();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // CharmHealth booking URL from existing component
  const charmHealthUrl = "https://ehr.charmtracker.com/publicCal.sas?method=getCal&digest=e54bdf77b791eb90cd5ef77f1bfb3dd742f7d5dfc96511bf80477815162a23b66ee57013c1a537e6a04718346ddb0ed8d95fcbc3b76e32a2";
  
  // Practice contact information
  const phoneNumber = 'tel:+12394230272';
  const whatsappNumber = 'https://wa.me/12399201019';

  const handleBookingClick = () => {
    trackEvent('mobile_toolbar_booking_clicked');
    setTag('toolbar_action', 'booking');
    trackTelehealthClick('mobile-toolbar');
    window.open(charmHealthUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCallClick = () => {
    trackLeadConversion('phone_call', { click_location: 'mobile_toolbar' });
    trackEvent('mobile_toolbar_call_clicked');
    setTag('toolbar_action', 'call');
    trackPhoneClick('(239) 423-0272', 'mobile-toolbar');
    window.location.href = phoneNumber;
  };

  const handleWhatsAppClick = () => {
    trackLeadConversion('whatsapp', { click_location: 'mobile_toolbar' });
    trackEvent('mobile_toolbar_whatsapp_clicked');
    setTag('toolbar_action', 'whatsapp');
    window.open(whatsappNumber, '_blank', 'noopener,noreferrer');
  };

  const handleContactClick = () => {
    trackEvent('mobile_toolbar_contact_clicked');
    setTag('toolbar_action', 'contact_modal');
    setIsContactModalOpen(true);
  };

  const buttons = [
    {
      icon: Calendar,
      label: language === 'en' ? 'Book Now' : 'Reservar Ahora',
      onClick: handleBookingClick,
      testId: 'mobile-button-book'
    },
    {
      icon: Phone,
      label: language === 'en' ? 'Call Now' : 'Llamar Ahora',
      onClick: handleCallClick,
      testId: 'mobile-button-call'
    },
    {
      icon: SiWhatsapp,
      label: language === 'en' ? 'WhatsApp' : 'WhatsApp',
      onClick: handleWhatsAppClick,
      testId: 'mobile-button-whatsapp'
    },
    {
      icon: FileText,
      label: language === 'en' ? 'Contact' : 'Contacto',
      onClick: handleContactClick,
      testId: 'mobile-button-contact'
    }
  ];

  return (
    <>
      {/* Mobile Toolbar - Fixed at bottom, only visible on mobile */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-gray-200 shadow-lg"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        data-testid="mobile-toolbar"
      >
        <div className="grid grid-cols-4 gap-0 px-2 py-3">
          {buttons.map((button, index) => {
            const IconComponent = button.icon;
            return (
              <button
                key={index}
                onClick={button.onClick}
                className="flex flex-col items-center justify-center p-2 text-green-700 hover:text-green-800 active:text-green-900 transition-colors duration-200 active:scale-95"
                data-testid={button.testId}
                aria-label={`${button.label}: ${
                  button.label === 'Book Now' || button.label === 'Reservar Ahora'
                    ? (language === 'en' ? 'telehealth appointment' : 'cita de telesalud')
                    : button.label === 'Call Now' || button.label === 'Llamar Ahora'
                      ? '(239) 423-0272'
                      : button.label === 'WhatsApp'
                        ? (language === 'en' ? 'open chat' : 'abrir chat')
                        : (language === 'en' ? 'open form' : 'abrir formulario')
                }`}
              >
                <IconComponent 
                  className={button.icon === SiWhatsapp ? "w-5 h-5 mb-1" : "w-6 h-6 mb-1"}
                  strokeWidth={button.icon === SiWhatsapp ? undefined : 1.5}
                />
                <span className="text-xs font-medium leading-tight text-center">
                  {button.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contact Form Modal */}
      <ContactFormModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </>
  );
};

export default MobileToolbar;