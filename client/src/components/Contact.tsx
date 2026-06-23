import { useState, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useClarity } from '@/hooks/use-clarity';
import { useTikTokEvents } from '@/hooks/useTikTokEvents';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import CharmHealthBooking from '@/components/CharmHealthBooking';
import GoogleMapsEmbed from '@/components/GoogleMapsEmbed';
import OptimizedImage from '@/components/OptimizedImage';
import { Phone, Mail, MapPin, AlertTriangle } from 'lucide-react';
import aetnaLogo from '../assets/insurance-aetna.webp';
import ambetterLogo from '../assets/insurance-ambetter.webp';
import cignaLogo from '../assets/insurance-cigna.webp';
import medicareLogo from '../assets/insurance-medicare.webp';
import firstHealthLogo from '../assets/insurance-first-health.webp';
import medicaidLogo from '../assets/insurance-medicaid.webp';
import floridaMedicaidLogo from '../assets/insurance-florida-medicaid.webp';
import champvaLogo from '../assets/insurance-champva.webp';
import sunshineHealthLogo from '../assets/insurance-sunshine.webp';
import avmedLogo from '../assets/insurance-avmed.webp';
import wellcareLogo from '../assets/insurance-wellcare.webp';
import doctorsHealthcareLogo from '@assets/3_1755868276797.webp';
import floridaBlueLogo from '@assets/6_1755868276798.webp';
import unitedHealthcareLogo from '@assets/8_1755868276798.webp';
import oscarLogo from '@assets/10_1755868276798.webp';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredLanguage: string;
  message: string;
}

const Contact = () => {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const { trackEvent, setTag } = useClarity();
  const { trackContactFormSubmission, trackPhoneClick } = useTikTokEvents();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredLanguage: 'english',
    message: ''
  });
  // Honeypot fields: hidden from real users, only bots fill them.
  const [honeypot, setHoneypot] = useState({
    website: '',
    url: '',
    homepage: '',
    companyWebsite: ''
  });
  // Timestamp when the form first mounted, used to reject instant bot submissions.
  const formStartedAtRef = useRef<number>(Date.now());

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.message) {
        toast({
          title: language === 'en' ? 'Error' : 'Error',
          description: language === 'en' 
            ? 'Please fill in all required fields.' 
            : 'Por favor complete todos los campos requeridos.',
          variant: 'destructive'
        });
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast({
          title: language === 'en' ? 'Error' : 'Error',
          description: language === 'en' 
            ? 'Please enter a valid email address.' 
            : 'Por favor ingrese una dirección de correo válida.',
          variant: 'destructive'
        });
        return;
      }

      // Submit form to backend
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ...honeypot,
          formStartedAt: formStartedAtRef.current,
        }),
      });

      if (response.status === 429) {
        toast({
          title: language === 'en' ? 'Please wait' : 'Por favor espere',
          description: language === 'en'
            ? 'You have submitted too many times. Please try again later.'
            : 'Ha enviado demasiadas veces. Por favor intente más tarde.',
          variant: 'destructive'
        });
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const result = await response.json().catch(() => ({}));

      // Only fire analytics/conversions for genuine, non-filtered submissions.
      if (!result?.filtered) {
        trackEvent('contact_form_submitted');
        setTag('contact_language', formData.preferredLanguage);
        setTag('contact_form_type', 'main_contact');
        trackContactFormSubmission('contact');
      }

      toast({
        title: language === 'en' ? 'Success!' : '¡Éxito!',
        description: language === 'en' 
          ? 'Thank you for your message! We will get back to you within 24 hours.'
          : '¡Gracias por su mensaje! Le responderemos dentro de 24 horas.',
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        preferredLanguage: 'english',
        message: ''
      });
      setHoneypot({ website: '', url: '', homepage: '', companyWebsite: '' });
      formStartedAtRef.current = Date.now();

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Error',
        description: language === 'en' 
          ? 'There was an error sending your message. Please try again.'
          : 'Hubo un error enviando su mensaje. Por favor intente de nuevo.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: t('contact.phone'),
      value: '(239) 423-0272',
      link: 'tel:+12394230272',
      subtext: language === 'en' ? 'Monday - Friday: 8:00 AM - 5:00 PM' : 'Lunes - Viernes: 8:00 AM - 5:00 PM'
    },
    {
      icon: Mail,
      title: t('contact.email'),
      value: 'info@healingmindsp.com',
      link: 'mailto:info@healingmindsp.com',
      subtext: language === 'en' ? 'We respond within 24 hours' : 'Respondemos dentro de 24 horas'
    },
    {
      icon: MapPin,
      title: t('contact.address'),
      value: '4760 Tamiami Trl N # 25\nNaples, FL 34103',
      link: 'https://www.google.com/maps/dir/?api=1&destination=Healing+Minds+Psychiatry,4760+Tamiami+Trl+N+%23+25,Naples,FL+34103',
      subtext: language === 'en' ? 'Get Directions →' : 'Obtener Direcciones →'
    }
  ];

  const insuranceLogos = [
    { src: aetnaLogo, alt: 'Aetna Insurance', name: 'Aetna' },
    { src: unitedHealthcareLogo, alt: 'United Healthcare', name: 'United Healthcare' },
    { src: medicareLogo, alt: 'Medicare', name: 'Medicare' },
    { src: medicaidLogo, alt: 'Medicaid', name: 'Medicaid' },
    { src: cignaLogo, alt: 'Cigna Healthcare', name: 'Cigna' },
    { src: floridaBlueLogo, alt: 'Florida Blue', name: 'Florida Blue' },
    { src: ambetterLogo, alt: 'Ambetter Health', name: 'Ambetter' },
    { src: firstHealthLogo, alt: 'First Health', name: 'First Health' },
    { src: oscarLogo, alt: 'Oscar Health', name: 'Oscar' },
    { src: wellcareLogo, alt: 'WellCare', name: 'WellCare' },
    { src: sunshineHealthLogo, alt: 'Sunshine Health', name: 'Sunshine Health' },
    { src: avmedLogo, alt: 'AvMed', name: 'AvMed' },
    { src: doctorsHealthcareLogo, alt: 'Doctors Healthcare Plans', name: 'Doctors Healthcare' },
    { src: champvaLogo, alt: 'CHAMPVA', name: 'CHAMPVA' },
    { src: floridaMedicaidLogo, alt: 'Florida Medicaid', name: 'Florida Medicaid' }
  ];

  return (
    <section id="contact" className="pt-12 pb-20 bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-body font-bold text-green-800 mb-6" data-testid="contact-title">
            Get in <span className="font-display italic text-green-700">touch</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed" data-testid="contact-description">
            {t('contact.description')}
          </p>
        </div>

        {/* Insurance Section */}
        <div className="mb-12">
          <p className="text-center text-xs text-gray-500 mb-4 font-body uppercase tracking-wide">
            {language === 'en' ? 'Insurance We Accept' : 'Seguros que Aceptamos'}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {insuranceLogos.map((logo, index) => (
              <div 
                key={index} 
                className="flex items-center justify-center"
                data-testid={`contact-insurance-logo-${logo.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <OptimizedImage
                  src={logo.src}
                  alt={logo.alt}
                  className="h-12 sm:h-14 md:h-16 w-auto object-contain filter grayscale opacity-70"
                  width={80}
                  height={64}
                  priority={false}
                  sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, 64px"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-10 lg:gap-12">
          {/* Contact Information Column - Order 2 on mobile, Order 1 (left) on desktop */}
          <div className="flex flex-col h-full order-2 md:order-1">
            <h3 className="text-2xl font-body font-semibold text-gray-900 mb-6" data-testid="contact-info-title">
              {language === 'en' ? <>Contact <span className="font-display italic text-green-700">Information</span></> : <>Información de <span className="font-display italic text-green-700">Contacto</span></>}
            </h3>
            
            <div className="space-y-6 mb-8">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <div key={index} className="flex items-start" data-testid={`contact-info-${index}`}>
                    <IconComponent className="w-6 h-6 text-primary-green mr-4 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{info.title}</h4>
                      {info.link ? (
                        <a 
                          href={info.link} 
                          className="text-primary-green hover:text-primary-green-hover"
                          target={info.link.startsWith('http') ? '_blank' : undefined}
                          rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                          aria-label={
                            info.link?.startsWith('tel:') 
                              ? (language === 'en' ? `Call us at ${info.value}` : `Llamarnos al ${info.value}`)
                              : info.link?.startsWith('mailto:') 
                                ? (language === 'en' ? `Send email to ${info.value}` : `Enviar email a ${info.value}`)
                                : info.link?.startsWith('http')
                                  ? (language === 'en' ? `View address on Google Maps - ${info.value}` : `Ver dirección en Google Maps - ${info.value}`)
                                  : undefined
                          }
                          onClick={() => {
                            if (info.link?.startsWith('tel:')) {
                              trackEvent('phone_call_initiated');
                              setTag('phone_click_location', 'contact_page');
                              trackPhoneClick(info.value, 'contact_page');
                            } else if (info.link?.startsWith('mailto:')) {
                              trackEvent('email_initiated');
                              setTag('email_click_location', 'contact_page');
                            }
                          }}
                        >
                          {info.value}
                        </a>
                      ) : (
                        <div className="text-gray-700 whitespace-pre-line">{info.value}</div>
                      )}
                      <p className="text-sm text-gray-600 mt-1">{info.subtext}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Emergency Services */}
            <Card className="bg-yellow-50 border border-yellow-200 p-4 mb-8" data-testid="emergency-info">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {t('contact.emergency')}
                  </h4>
                  <p className="text-sm text-gray-700 mb-2">
                    {language === 'en' 
                      ? 'If you are experiencing a mental health emergency, please call:'
                      : 'Si está experimentando una emergencia de salud mental, por favor llame:'
                    }
                  </p>
                  <div className="space-y-1 text-sm">
                    <div><strong>911</strong> - {language === 'en' ? 'Emergency services' : 'Servicios de emergencia'}</div>
                    <div><strong>988</strong> - {language === 'en' ? 'Suicide & Crisis Lifeline' : 'Línea de Vida de Suicidio y Crisis'}</div>
                    <div><strong>(239) 263-7158</strong> - {language === 'en' ? 'David Lawrence Center Crisis Line' : 'Línea de Crisis del Centro David Lawrence'}</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Telehealth Booking */}
            <div className="md:mt-auto">
              <h3 className="text-xl font-body font-semibold text-gray-900 mb-4">
                {language === 'en' ? (
                  <>
                    <span className="font-display italic text-blue-700">Telehealth</span> Appointments
                  </>
                ) : (
                  <>
                    Citas de <span className="font-display italic text-blue-700">Telesalud</span>
                  </>
                )}
              </h3>
              <CharmHealthBooking variant="default" showDescription={false} />
            </div>
          </div>

          {/* Contact Form - Order 1 on mobile, Order 2 (right) on desktop */}
          <Card className="bg-white p-8 shadow-sm order-1 md:order-2" data-testid="contact-form-card">
            <h3 className="text-2xl font-body font-semibold text-gray-900 mb-6" data-testid="contact-form-title">
              {language === 'en' ? <>Send us a <span className="font-display italic text-green-700">message</span></> : <>Envíanos un <span className="font-display italic text-green-700">mensaje</span></>}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
              {/* Honeypot fields - hidden from real users, only bots fill these */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>
                <label htmlFor="contact-website">Website</label>
                <input
                  id="contact-website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot.website}
                  onChange={(e) => setHoneypot(prev => ({ ...prev, website: e.target.value }))}
                />
                <input
                  id="contact-url"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot.url}
                  onChange={(e) => setHoneypot(prev => ({ ...prev, url: e.target.value }))}
                />
                <input
                  id="contact-homepage"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot.homepage}
                  onChange={(e) => setHoneypot(prev => ({ ...prev, homepage: e.target.value }))}
                />
                <input
                  id="contact-companyWebsite"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot.companyWebsite}
                  onChange={(e) => setHoneypot(prev => ({ ...prev, companyWebsite: e.target.value }))}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.firstName')} *
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full"
                    data-testid="input-first-name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.lastName')} *
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full"
                    data-testid="input-last-name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.form.email')} *
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full"
                  data-testid="input-email"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.form.phone')} *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full"
                  data-testid="input-phone"
                />
              </div>

              <div>
                <Label htmlFor="preferredLanguage" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.form.preferredLanguage')}
                </Label>
                <Select value={formData.preferredLanguage} onValueChange={(value) => handleInputChange('preferredLanguage', value)}>
                  <SelectTrigger className="w-full" data-testid="select-language" aria-label={language === 'en' ? 'Select preferred language for communication' : 'Seleccione idioma preferido para comunicación'}>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Español</SelectItem>
                    <SelectItem value="both">{language === 'en' ? 'Both / Ambos' : 'Ambos / Both'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.form.message')} *
                </Label>
                <Textarea
                  id="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="w-full resize-vertical"
                  placeholder={language === 'en' 
                    ? 'Please let us know how we can help you or any questions you have about our services.'
                    : 'Por favor déjenos saber cómo podemos ayudarle o cualquier pregunta que tenga sobre nuestros servicios.'
                  }
                  data-testid="textarea-message"
                />
              </div>

              <div className="text-sm text-gray-600">
                <p>
                  {language === 'en' 
                    ? '* Required fields. By submitting this form, you consent to us contacting you about your inquiry. Your information is kept confidential and secure.'
                    : '* Campos requeridos. Al enviar este formulario, usted consiente que lo contactemos sobre su consulta. Su información se mantiene confidencial y segura.'
                  }
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 text-white hover:bg-green-700 font-medium rounded-full px-8 py-6"
                disabled={isSubmitting}
                data-testid="button-submit"
              >
                {isSubmitting 
                  ? (language === 'en' ? 'Sending...' : 'Enviando...') 
                  : t('contact.form.send')
                }
              </Button>
            </form>
          </Card>
        </div>

        {/* Google Maps Section - Within Container */}
        <div className="mt-16 lg:mt-20">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-body font-bold text-green-800 mb-4" data-testid="map-section-title">
              {language === 'en' ? (
                <>Find Us on the <span className="font-display italic text-green-700">Map</span></>
              ) : (
                <>Encuéntranos en el <span className="font-display italic text-green-700">Mapa</span></>
              )}
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
              {language === 'en'
                ? 'Visit our Naples office conveniently located on Tamiami Trail. Easy access with ample parking available.'
                : 'Visite nuestra oficina de Naples convenientemente ubicada en Tamiami Trail. Fácil acceso con amplio estacionamiento disponible.'
              }
            </p>
          </div>
          
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <GoogleMapsEmbed
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3579.759886892454!2d-81.80207962458476!3d26.204488077076398!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88db1f6ec4e7fe17%3A0x3b7682b63395c87f!2sHealing%20Minds%20Psychiatry!5e0!3m2!1sen!2sus!4v1758100640962!5m2!1sen!2sus"
              title={language === 'en' 
                ? 'Healing Minds Psychiatry Naples Location - Interactive Map'
                : 'Ubicación Naples Healing Minds Psychiatry - Mapa Interactivo'
              }
              className="w-full"
              minHeight="450px"
              context="contact"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
