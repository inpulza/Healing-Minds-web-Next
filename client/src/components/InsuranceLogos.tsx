import { useLanguage } from '@/hooks/useLanguage';
import { useState, useEffect } from 'react';
import OptimizedImage from './OptimizedImage';
import { homeContent } from '@/data/pageContent/mainPages/home';
import { renderRichText } from '@/components/RichText';

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

const InsuranceLogos = () => {
  const { language } = useLanguage();
  const content = homeContent[language];
  const section = (key: string) => content.sections.find((x) => x.key === key)!;
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
  
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
  const currentLogo = insuranceLogos[currentLogoIndex] ?? insuranceLogos[0];

  // Auto-rotate logos for mobile slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLogoIndex((prev) => (prev + 1) % insuranceLogos.length);
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval);
  }, [insuranceLogos.length]);

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-[85%] lg:max-w-[90%] mx-auto px-2">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-body font-bold text-green-800 mb-4">
            {renderRichText(section('insuranceHeading').heading!, undefined, 'font-display italic text-green-700')}
          </h2>
          <p className="text-lg text-gray-600 font-body leading-relaxed max-w-3xl mx-auto">
            {section('insuranceHeading').paragraphs![0]}
          </p>
        </div>

        {/* Responsive Insurance Layout */}
        <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-100">
          
          {/* Mobile Layout - Auto Slider */}
          <div className="block md:hidden" data-testid="mobile-insurance-carousel">
            <div className="h-48 flex items-center justify-center">
              <div className="relative w-full flex items-center justify-center">
                <div
                  key={currentLogo.name}
                  className="absolute flex items-center justify-center inset-0 animate-in fade-in duration-500"
                  data-testid={`insurance-logo-${currentLogo.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <OptimizedImage
                    src={currentLogo.src}
                    alt={currentLogo.alt}
                    className="h-36 w-auto object-contain filter grayscale"
                    width={256}
                    height={144}
                    priority={false}
                    sizes="256px"
                  />
                </div>
              </div>
            </div>
            
            {/* Progress dots */}
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                {insuranceLogos.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentLogoIndex ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

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
                      contentVisibility: index < 2 ? 'visible' : 'auto',
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
              {section('insuranceNote').paragraphs![0]}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsuranceLogos;
