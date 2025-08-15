import { useLanguage } from '@/hooks/useLanguage';
import { useEffect } from 'react';

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

const LocationInsuranceLogos = () => {
  const { language } = useLanguage();
  
  // Preload critical insurance logos for faster loading
  useEffect(() => {
    const criticalLogos = [aetnaLogo, cignaLogo, medicareLogo, medicaidLogo];
    criticalLogos.forEach(logo => {
      const img = new Image();
      img.src = logo;
    });
  }, []);

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
    <section className="py-8 sm:py-12 lg:py-16 bg-[#f0fdf4]">
      <div className="max-w-[85%] lg:max-w-[90%] mx-auto px-2">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-body font-bold text-green-800 mb-4">
            {language === 'en' ? (
              <>
                Insurance <span className="font-display italic text-green-700">Plans</span> Accepted
              </>
            ) : (
              <>
                <span className="font-display italic text-green-700">Planes</span> de Seguro Aceptados
              </>
            )}
          </h2>
          <p className="text-lg text-gray-600 font-body leading-relaxed max-w-3xl mx-auto">
            {language === 'en' 
              ? 'We work with most major insurance providers to make quality mental health care accessible and affordable for our patients.'
              : 'Trabajamos con la mayoría de los principales proveedores de seguros para hacer que la atención de salud mental de calidad sea accesible y asequible para nuestros pacientes.'}
          </p>
        </div>

        {/* White Background Layout */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-100">
          <div className="flex flex-wrap gap-6 sm:gap-8 lg:gap-10 justify-center items-center min-h-[112px] sm:min-h-[128px] lg:min-h-[144px]">
            {insuranceLogos.map((logo, index) => {
              const isHighPriority = index < 4; // First 4 images get high priority
              return (
                <div 
                  key={index} 
                  className="group flex-shrink-0"
                  data-testid={`insurance-logo-${logo.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="w-36 h-28 sm:w-44 sm:h-32 lg:w-52 lg:h-36 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 hover:scale-110"
                    width={isHighPriority ? 208 : undefined}
                    height={isHighPriority ? 144 : undefined}
                    loading={isHighPriority ? "eager" : "lazy"}
                    fetchPriority={isHighPriority ? "high" : "low"}
                    decoding="async"
                    style={{
                      aspectRatio: '13/9',
                      minWidth: '144px',
                      minHeight: '112px'
                    }}
                  />
                </div>
              );
            })}
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

export default LocationInsuranceLogos;