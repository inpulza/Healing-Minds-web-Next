import { useLanguage } from '@/hooks/useLanguage';
import OptimizedImage from './OptimizedImage';

// Import insurance logos
import aetnaLogo from '@/assets/insurance-aetna.webp';
import cignaLogo from '@/assets/insurance-cigna.webp';
import medicareLogo from '@/assets/insurance-medicare.webp';
import firstHealthLogo from '@/assets/insurance-first-health.webp';
import medicaidLogo from '@/assets/insurance-medicaid.webp';
import floridaMedicaidLogo from '@/assets/insurance-florida-medicaid.webp';
import champvaLogo from '@/assets/insurance-champva.webp';
import sunshineHealthLogo from '@/assets/insurance-sunshine.webp';
import avmedLogo from '@/assets/insurance-avmed.webp';
import wellcareLogo from '@/assets/insurance-wellcare.webp';
import ambetterLogo from '@/assets/insurance-ambetter.webp';

const InsuranceLogos = () => {
  const { language } = useLanguage();
  
  // Insurance logos use optimized eager/lazy loading strategy to avoid network contention

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

        {/* Masonry Layout - Clean No Background Design */}
        <div className="py-8">
          {/* Logo Grid - Masonry Style */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 sm:gap-10 md:gap-12 items-center justify-items-center max-w-5xl mx-auto">
            {insuranceLogos.map((logo, index) => {
              const isHighPriority = index < 4 || index >= 8; // First 4 and last 3 images get high priority
              return (
                <div 
                  key={index} 
                  className="group flex items-center justify-center w-full h-24 sm:h-28 md:h-32"
                  data-testid={`insurance-logo-${logo.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <OptimizedImage
                    src={logo.src}
                    alt={logo.alt}
                    className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 hover:scale-105"
                    width={isHighPriority ? 144 : 96}
                    height={isHighPriority ? 96 : 64}
                    priority={isHighPriority}
                    sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, (max-width: 1024px) 128px, 144px"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      width: 'auto',
                      height: 'auto'
                    }}
                  />
                </div>
              );
            })}
          </div>
          
          {/* Bottom Note */}
          <div className="text-center mt-12">
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