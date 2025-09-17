import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useClarity } from '@/hooks/use-clarity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredLanguage: string;
  message: string;
}

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactFormModal = ({ isOpen, onClose }: ContactFormModalProps) => {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const { trackEvent, setTag } = useClarity();
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

      // Track successful form submission with Clarity
      trackEvent('contact_form_submitted');
      setTag('contact_language', formData.preferredLanguage);
      setTag('contact_form_type', 'mobile_modal');

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

      // Close modal after successful submission
      onClose();

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto" data-testid="contact-form-modal">
        <DialogHeader>
          <DialogTitle className="text-xl font-body font-semibold text-gray-900" data-testid="contact-form-modal-title">
            {language === 'en' ? (
              <>Send us a <span className="font-display italic text-green-700">message</span></>
            ) : (
              <>Envíanos un <span className="font-display italic text-green-700">mensaje</span></>
            )}
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4" data-testid="close-contact-modal">
            <X className="h-4 w-4" />
            <span className="sr-only">{language === 'en' ? 'Close' : 'Cerrar'}</span>
          </DialogClose>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" data-testid="contact-form-modal-form">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="modal-firstName" className="block text-sm font-medium text-gray-700 mb-1">
                {t('contact.form.firstName')} *
              </Label>
              <Input
                id="modal-firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full"
                data-testid="modal-input-first-name"
              />
            </div>
            <div>
              <Label htmlFor="modal-lastName" className="block text-sm font-medium text-gray-700 mb-1">
                {t('contact.form.lastName')} *
              </Label>
              <Input
                id="modal-lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full"
                data-testid="modal-input-last-name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="modal-email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('contact.form.email')} *
            </Label>
            <Input
              id="modal-email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full"
              data-testid="modal-input-email"
            />
          </div>

          <div>
            <Label htmlFor="modal-phone" className="block text-sm font-medium text-gray-700 mb-1">
              {t('contact.form.phone')}
            </Label>
            <Input
              id="modal-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full"
              data-testid="modal-input-phone"
            />
          </div>

          <div>
            <Label htmlFor="modal-preferredLanguage" className="block text-sm font-medium text-gray-700 mb-1">
              {t('contact.form.preferredLanguage')}
            </Label>
            <Select value={formData.preferredLanguage} onValueChange={(value) => handleInputChange('preferredLanguage', value)}>
              <SelectTrigger className="w-full" data-testid="modal-select-language" aria-label={language === 'en' ? 'Select preferred language for communication' : 'Seleccione idioma preferido para comunicación'}>
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
            <Label htmlFor="modal-message" className="block text-sm font-medium text-gray-700 mb-1">
              {t('contact.form.message')} *
            </Label>
            <Textarea
              id="modal-message"
              rows={4}
              required
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              className="w-full resize-vertical"
              placeholder={language === 'en' 
                ? 'Please let us know how we can help you or any questions you have about our services.'
                : 'Por favor déjenos saber cómo podemos ayudarle o cualquier pregunta que tenga sobre nuestros servicios.'
              }
              data-testid="modal-textarea-message"
            />
          </div>

          <div className="text-xs text-gray-600">
            <p>
              {language === 'en' 
                ? '* Required fields. By submitting this form, you consent to us contacting you about your inquiry.'
                : '* Campos requeridos. Al enviar este formulario, usted consiente que lo contactemos sobre su consulta.'
              }
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              data-testid="modal-button-cancel"
            >
              {language === 'en' ? 'Cancel' : 'Cancelar'}
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-green-600 text-white hover:bg-green-700 font-medium"
              disabled={isSubmitting}
              data-testid="modal-button-submit"
            >
              {isSubmitting 
                ? (language === 'en' ? 'Sending...' : 'Enviando...') 
                : t('contact.form.send')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactFormModal;