import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Phone, Mail, MapPin, AlertTriangle } from 'lucide-react';
// Analytics will be imported once the module is available
// import { trackEvent } from '@/lib/analytics';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredLanguage: 'english',
    message: ''
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
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
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Track successful form submission (analytics disabled for now)
      // trackEvent('form_submit', 'contact', 'contact_form');

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
      subtext: language === 'en' ? 'Monday - Friday: 9:00 AM - 5:00 PM' : 'Lunes - Viernes: 9:00 AM - 5:00 PM'
    },
    {
      icon: Mail,
      title: t('contact.email'),
      value: 'info@healingmindsnaples.com',
      link: 'mailto:info@healingmindsnaples.com',
      subtext: language === 'en' ? 'We respond within 24 hours' : 'Respondemos dentro de 24 horas'
    },
    {
      icon: MapPin,
      title: t('contact.address'),
      value: '4760 Tamiami Trl N #25\nNaples, FL 34103',
      link: 'https://maps.google.com/?q=4760+Tamiami+Trl+N+25,+Naples,+FL+34103',
      subtext: language === 'en' ? 'View on Google Maps →' : 'Ver en Google Maps →'
    }
  ];

  return (
    <section id="contact" className="py-20 bg-green-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-green-800 mb-6" data-testid="contact-title">
            Get in <span className="font-body italic">touch</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed" data-testid="contact-description">
            {t('contact.description')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6" data-testid="contact-info-title">
              {language === 'en' ? 'Contact Information' : 'Información de Contacto'}
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
            <Card className="bg-yellow-50 border border-yellow-200 p-4" data-testid="emergency-info">
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
          </div>

          {/* Contact Form */}
          <Card className="bg-white p-8 shadow-sm" data-testid="contact-form-card">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6" data-testid="contact-form-title">
              {t('contact.form.title')}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
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
                  {t('contact.form.phone')}
                </Label>
                <Input
                  id="phone"
                  type="tel"
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
                  <SelectTrigger className="w-full" data-testid="select-language">
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
                className="w-full bg-primary-green text-white hover:bg-primary-green-hover font-medium"
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
      </div>
    </section>
  );
};

export default Contact;
