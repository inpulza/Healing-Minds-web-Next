import { useLanguage } from '@/hooks/useLanguage';
import OptimizedImage from './OptimizedImage';
import MobileInsuranceCarousel from './MobileInsuranceCarousel';

// Import insurance logos - WebP optimized using full path (70% size reduction, same visual quality)
import aetnaLogo from '../assets/insurance-aetna.webp';           // 38KB vs 110KB PNG
import ambetterLogo from '../assets/insurance-ambetter.webp';     // 26KB vs 57KB PNG
import cignaLogo from '../assets/insurance-cigna.webp';           // 65KB vs 173KB PNG
import medicareLogo from '../assets/insurance-medicare.webp';     // 45KB vs 134KB PNG
import firstHealthLogo from '../assets/insurance-first-health.webp'; // 48KB vs 107KB PNG
import medicaidLogo from '../assets/insurance-medicaid.webp';     // 70KB vs 173KB PNG
import floridaMedicaidLogo from '../assets/insurance-florida-medicaid.webp'; // 59KB vs 133KB PNG
import champvaLogo from '../assets/insurance-champva.webp';       // 36KB vs 95KB PNG
import sunshineHealthLogo from '../assets/insurance-sunshine.webp'; // 44KB vs 116KB PNG
import avmedLogo from '../assets/insurance-avmed.webp';           // 39KB vs 91KB PNG
import wellcareLogo from '../assets/insurance-wellcare.webp';     // 30KB vs 67KB PNG
// Additional WebP optimized logos
import doctorsHealthcareLogo from '@assets/3_1755868276797.webp';  // 77KB vs 197KB PNG
import floridaBlueLogo from '@assets/6_1755868276798.webp';         // 77KB vs 201KB PNG
import unitedHealthcareLogo from '@assets/8_1755868276798.webp';   // 71KB vs 173KB PNG
import oscarLogo from '@assets/10_1755868276798.webp';              // 39KB vs 91KB PNG

const LocationInsuranceLogos = () => {
  const { language } = useLanguage();
  
  // Insurance logos use optimized eager/lazy loading strategy to avoid network contention

  const insuranceLogos = [
    { src: aetnaLogo, alt: 'Aetna Insurance', name: 'Aetna' },
    { src: unitedHealthcareLogo, alt: 'United Healthcare', name: 'United Healthcare' },
    { src: medicareLogo, alt: 'Medicare', name: 'Medicare' },
    { src: medicaidLogo, alt: 'Medicaid', name: 'Medicaid' },
    { src: cignaLogo, alt: 'Cigna Healthcare', name: 'Cigna' },
    { src: floridaBlueLogo, alt: 'Florida Blue', name: 'Florida Blue' },
    { src: ambetterLogo, alt: 'Ambetter Health', name: 'Ambetter' },
    { src: firstHealthLogo, alt: 'First Health', name: 'First Health' },
    { src: oscarLogo, alt: 'Oscar Health', name: 'Oscar' },
    { src: wellcareLogo, alt: 'WellCare', name: 'WellCare' },
    { src: sunshineHealthLogo, alt: 'Sunshine Health', name: 'Sunshine Health' },
    { src: avmedLogo, alt: 'AvMed', name: 'AvMed' },
    { src: doctorsHealthcareLogo, alt: 'Doctors Healthcare Plans', name: 'Doctors Healthcare' },
    { src: champvaLogo, alt: 'CHAMPVA', name: 'CHAMPVA' },
    { src: floridaMedicaidLogo, alt: 'Florida Medicaid', name: 'Florida Medicaid' }
  ];

  // Split logos into three rows for brick layout
  const firstRow = insuranceLogos.slice(0, 5);   // First 5 logos
  const secondRow = insuranceLogos.slice(5, 10); // Next 5 logos
  const thirdRow = insuranceLogos.slice(10);     // Last 5 logos

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

        {/* Responsive Insurance Layout */}
        <div className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-100 bg-[#ffffff]">
          
          {/* Mobile Layout - Auto Slider */}
          <MobileInsuranceCarousel
            logos={insuranceLogos}
            testId="mobile-location-insurance-carousel"
          />

          {/* Desktop Layout - Three Rows Brick Style */}
          <div className="hidden md:flex flex-col items-center gap-4 lg:gap-6">
            
            {/* First Row */}
            <div className="flex flex-wrap justify-center gap-4 lg:gap-8">
              {firstRow.map((logo, index) => (
                <div 
                  key={index} 
                  className="group flex items-center justify-center"
                  data-testid={`insurance-logo-${logo.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <OptimizedImage
                    src={logo.src}
                    alt={logo.alt}
                    className="w-36 h-28 lg:w-52 lg:h-36 object-contain transition-all duration-300 hover:scale-105 filter grayscale hover:grayscale-0"
                    width={144}
                    height={112}
                    priority={false}
                    sizes="(max-width: 1024px) 144px, 208px"
                    style={{
                      aspectRatio: '13/9',
                      minWidth: '144px',
                      minHeight: '112px',
                      containIntrinsicSize: '144px 112px',
                      contentVisibility: 'auto',
                      willChange: 'auto'
                    }}
                  />
                </div>
              ))}
            </div>
            
            {/* Second Row - Offset */}
            <div className="flex flex-wrap justify-center gap-4 lg:gap-8" style={{ marginLeft: 'clamp(2rem, 6vw, 4rem)' }}>
              {secondRow.map((logo, index) => (
                <div 
                  key={index + firstRow.length} 
                  className="group flex items-center justify-center"
                  data-testid={`insurance-logo-${logo.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <OptimizedImage
                    src={logo.src}
                    alt={logo.alt}
                    className="w-36 h-28 lg:w-52 lg:h-36 object-contain transition-all duration-300 hover:scale-105 filter grayscale hover:grayscale-0"
                    width={208}
                    height={144}
                    priority={false}
                    sizes="(max-width: 1024px) 144px, 208px"
                    style={{
                      aspectRatio: '13/9',
                      minWidth: '144px',
                      minHeight: '112px',
                      containIntrinsicSize: '208px 144px',
                      contentVisibility: 'auto',
                      willChange: 'auto'
                    }}
                  />
                </div>
              ))}
            </div>
            
            {/* Third Row */}
            <div className="flex flex-wrap justify-center gap-4 lg:gap-8">
              {thirdRow.map((logo, index) => (
                <div 
                  key={index + firstRow.length + secondRow.length} 
                  className="group flex items-center justify-center"
                  data-testid={`insurance-logo-${logo.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <OptimizedImage
                    src={logo.src}
                    alt={logo.alt}
                    className="w-36 h-28 lg:w-52 lg:h-36 object-contain transition-all duration-300 hover:scale-105 filter grayscale hover:grayscale-0"
                    width={144}
                    height={112}
                    priority={false}
                    sizes="(max-width: 1024px) 144px, 208px"
                    style={{
                      aspectRatio: '13/9',
                      minWidth: '144px',
                      minHeight: '112px',
                      containIntrinsicSize: '144px 112px',
                      contentVisibility: 'auto',
                      willChange: 'auto'
                    }}
                  />
                </div>
              ))}
            </div>
            
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
