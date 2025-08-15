import { useLanguage } from '@/hooks/useLanguage';

// Import insurance logos
import aetnaLogo from '@/assets/insurance-aetna.png';
import cignaLogo from '@/assets/insurance-cigna.png';
import medicareLogo from '@/assets/insurance-medicare.png';
import firstHealthLogo from '@/assets/insurance-first-health.png';
import medicaidLogo from '@/assets/insurance-medicaid.png';
import floridaMedicaidLogo from '@/assets/insurance-florida-medicaid.png';
import champvaLogo from '@/assets/insurance-champva.png';
import sunshineHealthLogo from '@/assets/insurance-sunshine.png';
import avmedLogo from '@/assets/insurance-avmed.png';
import wellcareLogo from '@/assets/insurance-wellcare.png';
import ambetterLogo from '@/assets/insurance-ambetter.png';

const InsuranceLogos = () => {
  const { language } = useLanguage();

  const insuranceLogos = [
    { src: aetnaLogo, alt: 'Aetna Insurance', name: 'Aetna' },
    { src: cignaLogo, alt: 'Cigna Healthcare', name: 'Cigna' },
    { src: medicareLogo, alt: 'Medicare', name: 'Medicare' },
    { src: firstHealthLogo, alt: 'First Health', name: 'First Health' },
    { src: medicaidLogo, alt: 'Medicaid', name: 'Medicaid' },
    { src: floridaMedicaidLogo, alt: 'Florida Medicaid', name: 'Florida Medicaid' },
    { src: champvaLogo, alt: 'ChampVA', name: 'ChampVA' },
    { src: sunshineHealthLogo, alt: 'Sunshine Health', name: 'Sunshine Health' },
    { src: avmedLogo, alt: 'AvMed', name: 'AvMed' },
    { src: wellcareLogo, alt: 'WellCare', name: 'WellCare' },
    { src: ambetterLogo, alt: 'Ambetter Health', name: 'Ambetter' }
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-[85%] lg:max-w-[90%] mx-auto px-2">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-body font-bold text-green-800 mb-4">
            {language === 'en' ? 'Insurance Plans Accepted' : 'Planes de Seguro Aceptados'}
          </h2>
          <p className="text-lg text-gray-600 font-body leading-relaxed max-w-3xl mx-auto">
            {language === 'en' 
              ? 'We work with most major insurance providers to make quality mental health care accessible and affordable for our patients.'
              : 'Trabajamos con la mayoría de los principales proveedores de seguros para hacer que la atención de salud mental de calidad sea accesible y asequible para nuestros pacientes.'}
          </p>
        </div>

        {/* Masonry Grid Layout */}
        <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
            {insuranceLogos.map((logo, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-center group"
                data-testid={`insurance-logo-${logo.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-w-full max-h-12 sm:max-h-14 lg:max-h-16 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
          
          {/* Bottom Note */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-body">
              {language === 'en' 
                ? 'Don\'t see your insurance? Contact us to verify coverage for your specific plan.'
                : '¿No ve su seguro? Contáctenos para verificar la cobertura de su plan específico.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsuranceLogos;