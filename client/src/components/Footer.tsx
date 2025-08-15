import { useLanguage } from '@/hooks/useLanguage';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { FaLinkedin, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Mail, Phone, MapPin, ArrowRight, Calendar } from 'lucide-react';
import { useState } from 'react';

const Footer = () => {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');

  const services = [
    { href: '/services', label: language === 'en' ? 'Anxiety Treatment' : 'Tratamiento de Ansiedad' },
    { href: '/services', label: language === 'en' ? 'Depression Treatment' : 'Tratamiento de Depresión' },
    { href: '/services', label: language === 'en' ? 'ADHD Treatment' : 'Tratamiento de TDAH' },
    { href: '/services', label: language === 'en' ? 'PTSD & Trauma' : 'TEPT y Trauma' }
  ];

  const quickLinks = [
    { href: '/about', label: language === 'en' ? 'About Dr. Reve' : 'Sobre la Dra. Reve' },
    { href: '/for-patients', label: language === 'en' ? 'For Patients' : 'Para Pacientes' },
    { href: '/contact', label: language === 'en' ? 'Contact Us' : 'Contáctanos' },
    { href: '/patient-portal', label: language === 'en' ? 'Patient Portal' : 'Portal del Paciente' }
  ];

  const charmHealthUrl = "https://ehr.charmtracker.com/publicCal.sas?method=getCal&digest=e54bdf77b791eb90cd5ef77f1bfb3dd742f7d5dfc96511bf80477815162a23b66ee57013c1a537e6a04718346ddb0ed8d95fcbc3b76e32a2";

  const socialLinks = [
    { href: 'https://linkedin.com/in/dr-melva-reve', icon: FaLinkedin, label: 'LinkedIn' },
    { href: 'https://facebook.com/healingmindspsychiatry', icon: FaFacebook, label: 'Facebook' },
    { href: 'https://instagram.com/healingmindspsychiatry', icon: FaInstagram, label: 'Instagram' },
    { href: 'https://twitter.com/healingmindsfl', icon: FaTwitter, label: 'Twitter' }
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter signup logic would go here
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="bg-green-900 text-white py-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left Section - Brand & Newsletter */}
          <div className="lg:col-span-5">
            {/* Brand */}
            <div className="mb-8">
              <Link href="/" className="inline-block">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-500 rounded-full mr-3 flex items-center justify-center">
                    <div className="text-white font-display font-bold text-lg">H</div>
                  </div>
                  <div className="text-2xl font-display font-bold text-white">
                    Healing Minds
                  </div>
                </div>
              </Link>
              <p className="text-green-200 mt-4 max-w-md text-lg leading-relaxed">
                {language === 'en'
                  ? 'Join our newsletter to stay up to date on mental health resources and practice updates.'
                  : 'Únase a nuestro boletín para mantenerse al día sobre recursos de salud mental y actualizaciones de la práctica.'
                }
              </p>
            </div>

            {/* Newsletter Form */}
            <div className="mb-8">
              <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                <div>
                  <label htmlFor="footer-email" className="block text-base font-medium text-green-200 mb-2">
                    {language === 'en' ? 'Enter your email' : 'Ingresa tu email'}
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="email"
                      id="footer-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={language === 'en' ? 'your@email.com' : 'tu@email.com'}
                      className="flex-1 px-4 py-3 bg-green-800/50 border border-green-700 rounded-lg text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                      data-testid="newsletter-email-input"
                    />
                    <Button
                      type="submit"
                      className="px-6 py-6 sm:py-7 bg-green-600 hover:bg-green-500 text-white text-base sm:text-lg rounded-lg font-semibold transition-colors duration-200"
                      data-testid="newsletter-submit-button"
                    >
                      {language === 'en' ? 'Subscribe' : 'Suscribirse'}
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-green-300">
                  {language === 'en'
                    ? 'By subscribing you agree to our Privacy Policy and provide consent to receive updates from our practice.'
                    : 'Al suscribirse, acepta nuestra Política de Privacidad y da su consentimiento para recibir actualizaciones de nuestra práctica.'
                  }
                </p>
              </form>
            </div>

            {/* Telehealth Booking */}
            <div className="p-4 bg-green-800/30 rounded-lg border border-green-700">
              <h5 className="text-base font-body font-semibold text-white mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Book Telehealth' : 'Reservar Telesalud'}
              </h5>
              <p className="text-green-200 text-sm mb-3">
                {language === 'en' 
                  ? 'Schedule secure online consultations with Dr. Melva Reve'
                  : 'Programe consultas seguras en línea con la Dra. Melva Reve'
                }
              </p>
              <Button
                onClick={() => window.open(charmHealthUrl, '_blank', 'noopener,noreferrer')}
                variant="outline"
                size="sm"
                className="text-green-200 border-green-600 hover:bg-green-700 hover:text-white text-sm"
                data-testid="footer-telehealth-button"
              >
                {language === 'en' ? 'Schedule Now' : 'Programar Ahora'}
              </Button>
            </div>
          </div>

          {/* Right Section - Links */}
          <div className="lg:col-span-7">
            {/* Links Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* Our Services */}
              <div>
                <h4 className="text-lg font-body font-bold text-white mb-6" data-testid="footer-services-title">
                  {language === 'en' ? <>Our <span className="font-display italic text-green-200">Services</span></> : <>Nuestros <span className="font-display italic text-green-200">Servicios</span></>}
                </h4>
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
                <h4 className="text-lg font-body font-bold text-white mb-6" data-testid="footer-areas-title">
                  {language === 'en' ? <>Service <span className="font-display italic text-green-200">Areas</span></> : <><span className="font-display italic text-green-200">Áreas</span> de Servicio</>}
                </h4>
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
                    Collier County
                  </li>
                </ul>
              </div>

              {/* Quick Links & Social */}
              <div>
                <h4 className="text-lg font-body font-bold text-white mb-6" data-testid="footer-quick-links-title">
                  {language === 'en' ? <>Quick <span className="font-display italic text-green-200">Links</span></> : <>Enlaces <span className="font-display italic text-green-200">Rápidos</span></>}
                </h4>
                <ul className="space-y-3 mb-6" data-testid="footer-quick-links-list">
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

                {/* Social Media */}
                <div>
                  <h5 className="text-lg font-body font-bold text-white mb-4" data-testid="footer-social-title">
                    {language === 'en' ? <>Follow <span className="font-display italic text-green-200">Us</span></> : <><span className="font-display italic text-green-200">Síguenos</span></>}
                  </h5>
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
                        >
                          <IconComponent className="w-5 h-5 text-green-200 group-hover:text-white" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-green-700 pt-8 mt-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
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
                >
                  info@healingmindsp.com
                </a>
              </div>
            </div>

            {/* Legal Links & Copyright */}
            <div className="text-right">
              <div className="flex flex-wrap gap-6 text-sm text-green-300 mb-2" data-testid="footer-legal-links">
                <Link href="/privacy" className="hover:text-white transition-colors">
                  {language === 'en' ? 'Privacy Policy' : 'Política de Privacidad'}
                </Link>
                <Link href="/terms" className="hover:text-white transition-colors">
                  {language === 'en' ? 'Terms of Service' : 'Términos de Servicio'}
                </Link>
                <a href="#" className="hover:text-white transition-colors">
                  {language === 'en' ? 'Back to top' : 'Volver arriba'}
                </a>
              </div>
              <div className="text-sm text-green-300" data-testid="footer-copyright">
                © {new Date().getFullYear()} Healing Minds Psychiatry. 
                {language === 'en' ? ' All rights reserved.' : ' Todos los derechos reservados.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;