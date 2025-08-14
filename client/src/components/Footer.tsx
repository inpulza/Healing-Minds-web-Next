import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';

const Footer = () => {
  const { language } = useLanguage();

  const services = [
    language === 'en' ? 'Anxiety Treatment' : 'Tratamiento de Ansiedad',
    language === 'en' ? 'Depression Treatment' : 'Tratamiento de Depresión',
    language === 'en' ? 'ADHD Treatment' : 'Tratamiento de TDAH',
    language === 'en' ? 'PTSD & Trauma' : 'TEPT y Trauma',
    language === 'en' ? 'Bipolar Disorder' : 'Trastorno Bipolar',
    language === 'en' ? 'OCD Treatment' : 'Tratamiento de TOC'
  ];

  const areas = [
    'Naples, FL',
    'Marco Island, FL',
    'Bonita Springs, FL',
    'Collier County'
  ];

  const footerLinks = [
    { href: '/privacy', label: language === 'en' ? 'Privacy Policy' : 'Política de Privacidad' },
    { href: '/terms', label: language === 'en' ? 'Terms of Service' : 'Términos de Servicio' },
    { href: '/patient-portal', label: language === 'en' ? 'Patient Portal' : 'Portal del Paciente' }
  ];

  return (
    <footer className="bg-gray-900 text-white py-12" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Practice Info */}
          <div className="md:col-span-2">
            <div className="text-2xl font-serif font-bold text-primary-green mb-4">
              Healing Minds Psychiatry
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              {language === 'en'
                ? 'Your partner in mental wellness. Board-certified psychiatrist providing compassionate, bilingual mental health care to adults in Naples, Florida and surrounding areas.'
                : 'Su socio en bienestar mental. Psiquiatra certificada que brinda atención compasiva y bilingüe de salud mental a adultos en Naples, Florida y áreas circundantes.'
              }
            </p>
            <div className="space-y-2 text-sm text-gray-300">
              <div data-testid="footer-address">📍 4760 Tamiami Trl N #25, Naples, FL 34103</div>
              <div data-testid="footer-phone">📞 <a href="tel:+12394230272" className="hover:text-primary-green">(239) 423-0272</a></div>
              <div data-testid="footer-email">✉️ <a href="mailto:info@healingmindsnaples.com" className="hover:text-primary-green">info@healingmindsnaples.com</a></div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4" data-testid="footer-services-title">
              {language === 'en' ? 'Services' : 'Servicios'}
            </h4>
            <ul className="space-y-2 text-sm text-gray-300" data-testid="footer-services-list">
              {services.map((service, index) => (
                <li key={index}>
                  <Link href="/services" className="hover:text-primary-green">
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas Served */}
          <div>
            <h4 className="font-semibold text-lg mb-4" data-testid="footer-areas-title">
              {language === 'en' ? 'Service Areas' : 'Áreas de Servicio'}
            </h4>
            <ul className="space-y-2 text-sm text-gray-300" data-testid="footer-areas-list">
              {areas.map((area, index) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400" data-testid="footer-copyright">
            © 2025 Healing Minds Psychiatry. {language === 'en' ? 'All rights reserved.' : 'Todos los derechos reservados.'}
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-400" data-testid="footer-links">
            {footerLinks.map((link, index) => (
              <Link key={index} href={link.href} className="hover:text-primary-green">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
