import { useLanguage } from '@/hooks/useLanguage';
import { useClarity } from '@/hooks/use-clarity';
import { useTikTokEvents } from '@/hooks/useTikTokEvents';
import { trackLeadConversion } from '@/lib/analytics';
import { Link } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, ArrowRight, Calendar, Linkedin, Facebook, Instagram } from 'lucide-react';
import { useState } from 'react';
import TikTokIcon from '@/components/TikTokIcon';

const Footer = () => {
  const { language } = useLanguage();
  const { trackEvent, setTag } = useClarity();
  const { trackPhoneClick, trackTelehealthClick } = useTikTokEvents();
  const [email, setEmail] = useState('');

  const services = [
    { href: language === 'en' ? '/services/anxiety-treatment' : '/es/servicios/tratamiento-ansiedad', label: language === 'en' ? 'Anxiety Treatment' : 'Tratamiento de Ansiedad' },
    { href: language === 'en' ? '/services/depression-treatment' : '/es/servicios/tratamiento-depresion', label: language === 'en' ? 'Depression Treatment' : 'Tratamiento de Depresión' },
    { href: language === 'en' ? '/services/adhd-treatment' : '/es/servicios/tratamiento-adhd', label: language === 'en' ? 'ADHD Treatment' : 'Tratamiento de TDAH' },
    { href: language === 'en' ? '/services/ptsd-treatment' : '/es/servicios/tratamiento-tept', label: language === 'en' ? 'PTSD Treatment' : 'Tratamiento de TEPT' },
    { href: language === 'en' ? '/services/bipolar-treatment' : '/es/servicios/tratamiento-bipolar', label: language === 'en' ? 'Bipolar Treatment' : 'Tratamiento Bipolar' },
    { href: language === 'en' ? '/services/medication-management' : '/es/servicios/manejo-medicamentos', label: language === 'en' ? 'Medication Management' : 'Manejo de Medicamentos' }
  ];

  const quickLinks = [
    { href: language === 'en' ? '/about' : '/es/acerca-de', label: language === 'en' ? 'About Dr. Reve' : 'Sobre la Dra. Reve' },
    { href: language === 'en' ? '/for-patients' : '/es/para-pacientes', label: language === 'en' ? 'For Patients' : 'Para Pacientes' },
    { href: language === 'en' ? '/blog' : '/es/blog', label: 'Blog' },
    { href: language === 'en' ? '/contact' : '/es/contacto', label: language === 'en' ? 'Contact Us' : 'Contáctanos' }
  ];

  const patientResources = [
    { href: language === 'en' ? '/cancellation-policy' : '/es/politica-cancelacion', label: language === 'en' ? 'Cancellation Policy' : 'Política de Cancelación' },
    { href: language === 'en' ? '/billing-policy' : '/es/politica-facturacion', label: language === 'en' ? 'Billing Policy' : 'Política de Facturación' },
    { href: language === 'en' ? '/emergency-policy' : '/es/politica-emergencias', label: language === 'en' ? 'Emergency Policy' : 'Política de Emergencias' },
    { href: language === 'en' ? '/patient-rights' : '/es/derechos-paciente', label: language === 'en' ? 'Patient Rights' : 'Derechos del Paciente' },
    { href: language === 'en' ? '/telehealth-consent' : '/es/consentimiento-telesalud', label: language === 'en' ? 'Telehealth Consent' : 'Consentimiento de Telesalud' },
    { href: language === 'en' ? '/no-surprises-act' : '/es/ley-sin-sorpresas', label: language === 'en' ? 'No Surprises Act' : 'Ley Sin Sorpresas' },
    { href: language === 'en' ? '/communications-policy' : '/es/politica-comunicaciones', label: language === 'en' ? 'Communications Policy' : 'Política de Comunicaciones' }
  ];

  const legalPolicies = [
    { href: language === 'en' ? '/privacy-policy' : '/es/politica-privacidad', label: language === 'en' ? 'Privacy Policy' : 'Política de Privacidad' },
    { href: language === 'en' ? '/terms-of-service' : '/es/terminos-servicio', label: language === 'en' ? 'Terms of Service' : 'Términos de Servicio' },
    { href: language === 'en' ? '/hipaa-notice' : '/es/aviso-hipaa', label: language === 'en' ? 'HIPAA Notice' : 'Aviso HIPAA' },
    { href: language === 'en' ? '/cookie-policy' : '/es/politica-cookies', label: language === 'en' ? 'Cookie Policy' : 'Política de Cookies' },
    { href: language === 'en' ? '/medical-disclaimer' : '/es/descargo-responsabilidad-medica', label: language === 'en' ? 'Medical Disclaimer' : 'Descargo Médico' },
    { href: language === 'en' ? '/accessibility-statement' : '/es/declaracion-accesibilidad', label: language === 'en' ? 'Accessibility' : 'Accesibilidad' },
    { href: language === 'en' ? '/nondiscrimination-notice' : '/es/aviso-no-discriminacion', label: language === 'en' ? 'Nondiscrimination' : 'No Discriminación' }
  ];

  const serviceAreas = [
    { href: language === 'en' ? '/locations/psychiatrist-naples' : '/es/ubicaciones/psiquiatra-naples', label: 'Naples, FL' },
    { href: language === 'en' ? '/locations/psychiatrist-marco-island' : '/es/ubicaciones/psiquiatra-marco-island', label: 'Marco Island, FL' },
    { href: language === 'en' ? '/locations/psychiatrist-bonita-springs' : '/es/ubicaciones/psiquiatra-bonita-springs', label: 'Bonita Springs, FL' },
    { href: language === 'en' ? '/locations/psychiatrist-estero' : '/es/ubicaciones/psiquiatra-estero', label: 'Estero, FL' },
    { href: language === 'en' ? '/locations/psychiatrist-golden-gate' : '/es/ubicaciones/psiquiatra-golden-gate', label: 'Golden Gate, FL' },
    { href: language === 'en' ? '/locations/psychiatrist-immokalee' : '/es/ubicaciones/psiquiatra-immokalee', label: 'Immokalee, FL' },
    { href: language === 'en' ? '/locations/psychiatrist-vanderbilt-beach' : '/es/ubicaciones/psiquiatra-vanderbilt-beach', label: 'Vanderbilt Beach, FL' },
    { href: language === 'en' ? '/locations/psychiatrist-fort-myers' : '/es/ubicaciones/psiquiatra-fort-myers', label: 'Fort Myers, FL' },
    { href: language === 'en' ? '/locations/psychiatrist-ave-maria' : '/es/ubicaciones/psiquiatra-ave-maria', label: 'Ave Maria, FL' },
    { href: language === 'en' ? '/locations/psychiatrist-lely-resort' : '/es/ubicaciones/psiquiatra-lely-resort', label: 'Lely Resort, FL' }
  ];

  const charmHealthUrl = "https://ehr.charmtracker.com/publicCal.sas?method=getCal&digest=e54bdf77b791eb90cd5ef77f1bfb3dd742f7d5dfc96511bf80477815162a23b66ee57013c1a537e6a04718346ddb0ed8d95fcbc3b76e32a2";

  const socialLinks = [
    { href: 'https://www.linkedin.com/in/melva-reve-2549a9120', icon: Linkedin, label: 'LinkedIn' },
    { href: 'https://www.facebook.com/profile.php?id=61578845287836', icon: Facebook, label: 'Facebook' },
    { href: 'https://www.instagram.com/hmpsychiatry', icon: Instagram, label: 'Instagram' },
    { href: 'https://www.tiktok.com/@dra.melvavidal', icon: TikTokIcon, label: 'TikTok' }
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter signup logic would go here
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="bg-green-900 text-white py-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
        <div className="grid md:grid-cols-8 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-12">
          {/* Left Section - Brand & Newsletter */}
          <div className="md:col-span-3 lg:col-span-5">
            {/* Brand */}
            <div className="mb-8">
              <Link href="/" className="inline-block" aria-label={language === 'en' ? 'Healing Minds Psychiatry - Return to homepage' : 'Healing Minds Psychiatry - Volver al inicio'}>
                <div className="text-2xl font-body font-bold text-white">
                  Healing Minds <span className="text-green-200">Psychiatry</span>
                </div>
              </Link>
            </div>

            {/* Telehealth Booking */}
            <div className="mb-8 p-4 bg-green-800/30 rounded-lg border border-green-700">
              <h2 className="text-base font-body font-semibold text-white mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Book Telehealth' : 'Reservar Telesalud'}
              </h2>
              <p className="text-green-200 text-sm mb-3">
                {language === 'en' 
                  ? 'Schedule secure online consultations with Dr. Melva Reve'
                  : 'Programe consultas seguras en línea con la Dra. Melva Reve'
                }
              </p>
              <Button
                onClick={() => {
                  trackTelehealthClick('footer');
                  window.open(charmHealthUrl, '_blank', 'noopener,noreferrer');
                }}
                size="sm"
                className="bg-green-700 hover:bg-green-600 text-white text-sm font-semibold"
                data-testid="footer-telehealth-button"
              >
                {language === 'en' ? 'Schedule Now' : 'Programar Ahora'}
              </Button>
            </div>

            {/* Social Media */}
            <div>
              <h2 className="text-lg font-body font-bold text-white mb-4" data-testid="footer-social-title">
                {language === 'en' ? <>Follow <span className="font-display italic text-green-200">Us</span></> : <><span className="font-display italic text-green-200">Síguenos</span></>}
              </h2>
              <div className="flex gap-4" data-testid="footer-social-links">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-green-800/50 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors duration-200 group"
                      data-testid={`footer-social-${social.label.toLowerCase()}`}
                      aria-label={`${social.label} - ${language === 'en' ? 'Open in new window' : 'Abrir en nueva ventana'}`}
                      title={social.label}
                    >
                      <IconComponent className="w-5 h-5 text-green-200 group-hover:text-white" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Section - Links */}
          <div className="md:col-span-5 lg:col-span-7">
            {/* Links Grid */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
              {/* Our Services */}
              <div>
                <h3 className="text-lg font-body font-bold text-white mb-6" data-testid="footer-services-title">
                  {language === 'en' ? <>Our <span className="font-display italic text-green-200">Services</span></> : <>Nuestros <span className="font-display italic text-green-200">Servicios</span></>}
                </h3>
                <ul className="space-y-3" data-testid="footer-services-list">
                  {services.map((service, index) => (
                    <li key={index}>
                      <Link 
                        href={service.href}
                        className="text-green-200 hover:text-white transition-colors duration-200 text-base flex items-center group"
                        data-testid={`footer-service-${index}`}
                      >
                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        {service.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Service Areas */}
              <div>
                <h3 className="text-lg font-body font-bold text-white mb-6" data-testid="footer-areas-title">
                  {language === 'en' ? <>Service <span className="font-display italic text-green-200">Areas</span></> : <><span className="font-display italic text-green-200">Áreas</span> de Servicio</>}
                </h3>
                <ul className="space-y-3" data-testid="footer-areas-list">
                  {serviceAreas.map((area, index) => (
                    <li key={index}>
                      <Link 
                        href={area.href}
                        className="text-green-200 hover:text-white transition-colors duration-200 text-base flex items-center group"
                        data-testid={`footer-area-${index}`}
                      >
                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        {area.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Links & Patient Resources */}
              <div>
                {/* Quick Links Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-body font-bold text-white mb-6" data-testid="footer-quick-links-title">
                    {language === 'en' ? <>Quick <span className="font-display italic text-green-200">Links</span></> : <>Enlaces <span className="font-display italic text-green-200">Rápidos</span></>}
                  </h3>
                  <ul className="space-y-3" data-testid="footer-quick-links-list">
                    {quickLinks.map((link, index) => (
                      <li key={index}>
                        <Link 
                          href={link.href}
                          className="text-green-200 hover:text-white transition-colors duration-200 text-base flex items-center group"
                          data-testid={`footer-quick-link-${index}`}
                        >
                          <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Patient Resources Section */}
                <div>
                  <h3 className="text-lg font-body font-bold text-white mb-6" data-testid="footer-patient-resources-title">
                    {language === 'en' ? (
                      <>Patient <span className="font-display italic text-green-200">Resources</span></>
                    ) : (
                      <><span className="font-display italic text-green-200">Recursos</span> del Paciente</>
                    )}
                  </h3>
                  <ul className="space-y-3" data-testid="footer-patient-resources-list">
                    {patientResources.map((resource, index) => (
                      <li key={index}>
                        <Link 
                          href={resource.href}
                          className="text-green-200 hover:text-white transition-colors duration-200 text-base flex items-center group"
                          data-testid={`footer-patient-resource-${index}`}
                        >
                          <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          {resource.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal Policies Section - Mobile Only */}
                <div className="md:hidden mt-8">
                  <h3 className="text-lg font-body font-bold text-white mb-6" data-testid="footer-legal-policies-title">
                    {language === 'en' ? (
                      <>Legal <span className="font-display italic text-green-200">Policies</span></>
                    ) : (
                      <>Políticas <span className="font-display italic text-green-200">Legales</span></>
                    )}
                  </h3>
                  <ul className="space-y-3" data-testid="footer-legal-policies-list">
                    {legalPolicies.map((policy, index) => (
                      <li key={index}>
                        <Link 
                          href={policy.href}
                          className="text-green-200 hover:text-white transition-colors duration-200 text-base flex items-center group"
                          data-testid={`footer-legal-policy-${index}`}
                        >
                          <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          {policy.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-green-700 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
            {/* Contact Info */}
            <div className="space-y-2" data-testid="footer-contact-info">
              <div className="flex items-center text-green-200 text-sm">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span data-testid="footer-address">4760 Tamiami Trl N # 25, Naples, FL 34103</span>
              </div>
              <div className="flex items-center text-green-200 text-sm">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <a 
                  href="tel:+12394230272" 
                  className="hover:text-white transition-colors"
                  data-testid="footer-phone"
                  aria-label={language === 'en' ? 'Call Healing Minds Psychiatry at (239) 423-0272' : 'Llamar a Healing Minds Psychiatry al (239) 423-0272'}
                  onClick={() => {
                    trackLeadConversion('phone_call', { click_location: 'footer' });
                    trackEvent('phone_call_initiated');
                    setTag('phone_click_location', 'footer');
                    trackPhoneClick('(239) 423-0272', 'footer');
                  }}
                >
                  (239) 423-0272
                </a>
              </div>
              <div className="flex items-center text-green-200 text-sm">
                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                <a 
                  href="mailto:info@healingmindsp.com" 
                  className="hover:text-white transition-colors"
                  data-testid="footer-email"
                  aria-label={language === 'en' ? 'Send email to info@healingmindsp.com' : 'Enviar email a info@healingmindsp.com'}
                >
                  info@healingmindsp.com
                </a>
              </div>
            </div>

            {/* Legal Links & Copyright */}
            <div className="text-right">
              <div className="hidden md:flex flex-wrap gap-4 text-sm text-green-300 mb-2" data-testid="footer-legal-links">
                <Link 
                  href={language === 'en' ? '/privacy-policy' : '/es/politica-privacidad'} 
                  className="hover:text-white transition-colors"
                >
                  {language === 'en' ? 'Privacy Policy' : 'Política de Privacidad'}
                </Link>
                <Link 
                  href={language === 'en' ? '/terms-of-service' : '/es/terminos-servicio'} 
                  className="hover:text-white transition-colors"
                >
                  {language === 'en' ? 'Terms of Service' : 'Términos de Servicio'}
                </Link>
                <Link 
                  href={language === 'en' ? '/hipaa-notice' : '/es/aviso-hipaa'} 
                  className="hover:text-white transition-colors"
                >
                  {language === 'en' ? 'HIPAA Notice' : 'Aviso HIPAA'}
                </Link>
                <Link 
                  href={language === 'en' ? '/cookie-policy' : '/es/politica-cookies'} 
                  className="hover:text-white transition-colors"
                >
                  {language === 'en' ? 'Cookie Policy' : 'Política de Cookies'}
                </Link>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-white transition-colors cursor-pointer"
                  data-testid="footer-back-to-top"
                >
                  {language === 'en' ? 'Back to top' : 'Volver arriba'}
                </button>
              </div>
              <div className="text-sm text-green-300" data-testid="footer-copyright">
                © {new Date().getFullYear()} Healing Minds Psychiatry. 
                {language === 'en' ? ' All rights reserved.' : ' Todos los derechos reservados.'}
              </div>
              <div className="text-xs text-green-300 mt-2 flex items-center justify-end gap-1" data-testid="footer-credits">
                <span className="font-normal">
                  {language === 'en' ? 'Crafted with' : 'Creado con'} 
                </span>
                <span className="text-green-300 text-sm">♥</span>
                <span className="font-normal">
                  {language === 'en' ? 'by' : 'por'}
                </span>
                <a 
                  href="https://www.inpulza.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-green-300 hover:text-white transition-colors duration-200 ml-1"
                  data-testid="footer-inpulza-link"
                >
                  Inpulza
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
