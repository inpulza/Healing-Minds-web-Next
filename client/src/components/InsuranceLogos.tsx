import { useLanguage } from '@/hooks/useLanguage';
import OptimizedImage from './OptimizedImage';

// Import insurance logos
import aetnaLogo from '@assets/1_1755867827627.png';
import ambetterLogo from '@assets/15_1755868276796.png';
import cignaLogo from '@assets/2_1755868276797.png';
import doctorsHealthcareLogo from '@assets/3_1755868276797.png';
import medicareLogo from '@assets/4_1755868276797.png';
import firstHealthLogo from '@assets/5_1755868276798.png';
import floridaBlueLogo from '@assets/6_1755868276798.png';
import medicaidLogo from '@assets/7_1755868276798.png';
import unitedHealthcareLogo from '@assets/8_1755868276798.png';
import floridaMedicaidLogo from '@assets/9_1755868276798.png';
import oscarLogo from '@assets/10_1755868276798.png';
import champvaLogo from '@assets/11_1755868276799.png';
import sunshineHealthLogo from '@assets/12_1755868276799.png';
import avmedLogo from '@assets/13_1755868276799.png';
import wellcareLogo from '@assets/14_1755868276799.png';

const InsuranceLogos = () => {
  const { language } = useLanguage();
  
  // Insurance logos use optimized eager/lazy loading strategy to avoid network contention

  const insuranceLogos = [
    { src: aetnaLogo, alt: 'Aetna Insurance', name: 'Aetna', size: 'large' },
    { src: unitedHealthcareLogo, alt: 'United Healthcare', name: 'United Healthcare', size: 'large' },
    { src: medicareLogo, alt: 'Medicare', name: 'Medicare', size: 'medium' },
    { src: medicaidLogo, alt: 'Medicaid', name: 'Medicaid', size: 'medium' },
    { src: cignaLogo, alt: 'Cigna Healthcare', name: 'Cigna', size: 'large' },
    { src: floridaBlueLogo, alt: 'Florida Blue', name: 'Florida Blue', size: 'medium' },
    { src: ambetterLogo, alt: 'Ambetter Health', name: 'Ambetter', size: 'large' },
    { src: firstHealthLogo, alt: 'First Health', name: 'First Health', size: 'medium' },
    { src: oscarLogo, alt: 'Oscar Health', name: 'Oscar', size: 'small' },
    { src: wellcareLogo, alt: 'WellCare', name: 'WellCare', size: 'medium' },
    { src: sunshineHealthLogo, alt: 'Sunshine Health', name: 'Sunshine Health', size: 'large' },
    { src: avmedLogo, alt: 'AvMed', name: 'AvMed', size: 'small' },
    { src: doctorsHealthcareLogo, alt: 'Doctors Healthcare Plans', name: 'Doctors Healthcare', size: 'medium' },
    { src: champvaLogo, alt: 'CHAMPVA', name: 'CHAMPVA', size: 'small' },
    { src: floridaMedicaidLogo, alt: 'Florida Medicaid', name: 'Florida Medicaid', size: 'large' }
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

        {/* Masonry Grid Layout */}
        <div className="p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 items-center justify-items-center">
            {insuranceLogos.map((logo, index) => {
              const isHighPriority = index < 6; // First 6 images get high priority
              
              // Define size classes based on logo.size
              const getSizeClasses = () => {
                switch (logo.size) {
                  case 'large':
                    return 'w-32 h-24 sm:w-40 sm:h-30 md:w-48 md:h-36 lg:w-56 lg:h-40';
                  case 'medium':
                    return 'w-28 h-20 sm:w-36 sm:h-27 md:w-44 md:h-32 lg:w-52 lg:h-36';
                  case 'small':
                    return 'w-24 h-18 sm:w-32 sm:h-24 md:w-40 md:h-28 lg:w-48 lg:h-32';
                  default:
                    return 'w-28 h-20 sm:w-36 sm:h-27 md:w-44 md:h-32 lg:w-52 lg:h-36';
                }
              };
              
              return (
                <div 
                  key={index} 
                  className="group flex items-center justify-center"
                  data-testid={`insurance-logo-${logo.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <OptimizedImage
                    src={logo.src}
                    alt={logo.alt}
                    className={`${getSizeClasses()} object-contain transition-all duration-300 hover:scale-105 filter grayscale hover:grayscale-0`}
                    width={logo.size === 'large' ? 224 : logo.size === 'small' ? 192 : 208}
                    height={logo.size === 'large' ? 160 : logo.size === 'small' ? 128 : 144}
                    priority={isHighPriority}
                    sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 192px, 224px"
                    style={{
                      aspectRatio: '14/10',
                      minWidth: 'min(96px, 20vw)',
                      minHeight: 'min(68px, 14vw)',
                      containIntrinsicSize: '224px 160px',
                      contentVisibility: isHighPriority ? 'visible' : 'auto',
                      willChange: 'auto'
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

export default InsuranceLogos;