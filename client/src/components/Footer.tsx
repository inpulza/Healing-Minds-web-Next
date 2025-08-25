import { useLanguage } from '@/hooks/useLanguage';
import { useClarity } from '@/hooks/use-clarity';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { FaLinkedin, FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import { Mail, Phone, MapPin, ArrowRight, Calendar } from 'lucide-react';
import { useState } from 'react';

const Footer = () => {
  const { language } = useLanguage();
  const { trackEvent, setTag } = useClarity();
  const [email, setEmail] = useState('');

  const services = [
    { href: language === 'en' ? '/services/anxiety-treatment' : '/es/servicios/tratamiento-ansiedad', label: language === 'en' ? 'Anxiety Treatment' : 'Tratamiento de Ansiedad' },
    { href: language === 'en' ? '/services/depression-treatment' : '/es/servicios/tratamiento-depresion', label: language === 'en' ? 'Depression Treatment' : 'Tratamiento de Depresión' },
    { href: '/adhd-treatment-adults-naples-fl', label: language === 'en' ? 'ADHD Treatment' : 'Tratamiento de TDAH' },
    { href: language === 'en' ? '/services/ptsd-treatment' : '/es/servicios/tratamiento-tept', label: language === 'en' ? 'PTSD Treatment' : 'Tratamiento de TEPT' },
    { href: language === 'en' ? '/services/bipolar-treatment' : '/es/servicios/tratamiento-bipolar', label: language === 'en' ? 'Bipolar Treatment' : 'Tratamiento Bipolar' },
    { href: language === 'en' ? '/services/medication-management' : '/es/servicios/manejo-medicamentos', label: language === 'en' ? 'Medication Management' : 'Manejo de Medicamentos' }
  ];

  const quickLinks = [
    { href: '/about', label: language === 'en' ? 'About Dr. Reve' : 'Sobre la Dra. Reve' },
    { href: '/for-patients', label: language === 'en' ? 'For Patients' : 'Para Pacientes' },
    { href: '/contact', label: language === 'en' ? 'Contact Us' : 'Contáctanos' },
    { href: '/patient-portal', label: language === 'en' ? 'Patient Portal' : 'Portal del Paciente' }
  ];

  const charmHealthUrl = "https://ehr.charmtracker.com/publicCal.sas?method=getCal&digest=e54bdf77b791eb90cd5ef77f1bfb3dd742f7d5dfc96511bf80477815162a23b66ee57013c1a537e6a04718346ddb0ed8d95fcbc3b76e32a2";

  const socialLinks = [
    { href: 'https://www.linkedin.com/in/melva-reve-2549a9120', icon: FaLinkedin, label: 'LinkedIn' },
    { href: 'https://www.facebook.com/profile.php?id=61578845287836', icon: FaFacebook, label: 'Facebook' },
    { href: 'https://www.instagram.com/hmpsychiatry', icon: FaInstagram, label: 'Instagram' },
    { href: 'https://www.tiktok.com/@dra.melvavidal', icon: FaTiktok, label: 'TikTok' }
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
                onClick={() => window.open(charmHealthUrl, '_blank', 'noopener,noreferrer')}
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
                  <li className="text-green-200 text-base flex items-center">
                    <ArrowRight className="w-3 h-3 mr-2 opacity-60" />
                    Naples, FL
                  </li>
                  <li className="text-green-200 text-base flex items-center">
                    <ArrowRight className="w-3 h-3 mr-2 opacity-60" />
                    Marco Island, FL
                  </li>
                  <li className="text-green-200 text-base flex items-center">
                    <ArrowRight className="w-3 h-3 mr-2 opacity-60" />
                    Bonita Springs, FL
                  </li>
                  <li className="text-green-200 text-base flex items-center">
                    <ArrowRight className="w-3 h-3 mr-2 opacity-60" />
                    Estero, FL
                  </li>
                </ul>
              </div>

              {/* Quick Links */}
              <div>
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
                <span data-testid="footer-address">4760 Tamiami Trl N #25, Naples, FL 34103</span>
              </div>
              <div className="flex items-center text-green-200 text-sm">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <a 
                  href="tel:+12394230272" 
                  className="hover:text-white transition-colors"
                  data-testid="footer-phone"
                  aria-label={language === 'en' ? 'Call Healing Minds Psychiatry at (239) 423-0272' : 'Llamar a Healing Minds Psychiatry al (239) 423-0272'}
                  onClick={() => {
                    trackEvent('phone_call_initiated');
                    setTag('phone_click_location', 'footer');
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
              <div className="flex flex-wrap gap-4 text-sm text-green-300 mb-2" data-testid="footer-legal-links">
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