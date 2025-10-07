import { useTikTokPixel } from './use-tiktok-pixel';

export function useTikTokEvents() {
  const { track } = useTikTokPixel();

  const trackContactFormSubmission = (formType: 'contact' | 'telehealth' = 'contact') => {
    track('Lead', {
      contents: [{
        content_type: 'service',
        content_name: formType === 'contact' ? 'Contact Form' : 'Telehealth Request'
      }]
    });
  };

  const trackPhoneClick = (phoneNumber: string, location: 'header' | 'footer' | 'contact_page' = 'header') => {
    track('Contact', {
      contents: [{
        content_type: 'service',
        content_name: `Phone Click - ${location}`
      }]
    });
  };

  const trackServiceView = (serviceName: string, serviceType: string) => {
    track('ViewContent', {
      contents: [{
        content_type: 'service',
        content_name: serviceName,
        content_id: serviceType
      }]
    });
  };

  const trackTelehealthClick = (source: 'header' | 'footer' | 'button' = 'button') => {
    track('ClickButton', {
      contents: [{
        content_type: 'service',
        content_name: `Telehealth Button - ${source}`
      }]
    });
  };

  const trackAppointmentClick = (source: string = 'button') => {
    track('ClickButton', {
      contents: [{
        content_type: 'service',
        content_name: `Schedule Appointment - ${source}`
      }]
    });
  };

  return {
    trackContactFormSubmission,
    trackPhoneClick,
    trackServiceView,
    trackTelehealthClick,
    trackAppointmentClick
  };
}
