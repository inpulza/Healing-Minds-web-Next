import { useLanguage } from '@/hooks/useLanguage';
import OptimizedImage from './OptimizedImage';

// Import all insurance logos
import aetnaLogo from '@/assets/insurance-aetna-new.png';
import cignaLogo from '@/assets/insurance-cigna-new.png';
import doctorsHealthcareLogo from '@/assets/insurance-doctors-healthcare.png';
import medicareLogo from '@/assets/insurance-medicare-new.png';
import firstHealthLogo from '@/assets/insurance-first-health-new.png';
import floridaBlueLogo from '@/assets/insurance-florida-blue.png';
import medicaidLogo from '@/assets/insurance-medicaid-new.png';
import unitedHealthcareLogo from '@/assets/insurance-united-healthcare.png';
import floridaMedicaidLogo from '@/assets/insurance-florida-medicaid-new.png';
import oscarLogo from '@/assets/insurance-oscar.png';
import champvaLogo from '@/assets/insurance-champva-new.png';
import sunshineHealthLogo from '@/assets/insurance-sunshine-new.png';
import avmedLogo from '@/assets/insurance-avmed-new.png';
import wellcareLogo from '@/assets/insurance-wellcare-new.png';
import ambetterLogo from '@/assets/insurance-ambetter-new.png';

const InsuranceLogos = () => {
  const { language } = useLanguage();
  
  // Insurance logos array with all accepted providers
  const insuranceLogos = [
    { 
      src: aetnaLogo, 
      alt: language === 'en' ? 'Aetna Insurance Logo - Mental Health Coverage Accepted' : 'Logo de Seguro Aetna - Cobertura de Salud Mental Aceptada',
      name: 'Aetna'
    },
    { 
      src: cignaLogo, 
      alt: language === 'en' ? 'Cigna Healthcare Insurance Logo - Psychiatric Services Covered' : 'Logo de Seguro Cigna Healthcare - Servicios Psiquiátricos Cubiertos',
      name: 'Cigna Healthcare'
    },
    { 
      src: doctorsHealthcareLogo, 
      alt: language === 'en' ? 'Doctors Healthcare Plans Insurance Logo - Mental Health Benefits' : 'Logo de Planes de Salud Doctors Healthcare - Beneficios de Salud Mental',
      name: 'Doctors Healthcare Plans'
    },
    { 
      src: medicareLogo, 
      alt: language === 'en' ? 'Medicare Insurance Logo - Mental Health Services Covered' : 'Logo de Seguro Medicare - Servicios de Salud Mental Cubiertos',
      name: 'Medicare'
    },
    { 
      src: firstHealthLogo, 
      alt: language === 'en' ? 'First Health Insurance Logo - Psychiatric Treatment Coverage' : 'Logo de Seguro First Health - Cobertura de Tratamiento Psiquiátrico',
      name: 'First Health'
    },
    { 
      src: floridaBlueLogo, 
      alt: language === 'en' ? 'Florida Blue Insurance Logo - Mental Health Care Benefits' : 'Logo de Seguro Florida Blue - Beneficios de Cuidado de Salud Mental',
      name: 'Florida Blue'
    },
    { 
      src: medicaidLogo, 
      alt: language === 'en' ? 'Medicaid Insurance Logo - Psychiatric Services Accepted' : 'Logo de Seguro Medicaid - Servicios Psiquiátricos Aceptados',
      name: 'Medicaid'
    },
    { 
      src: unitedHealthcareLogo, 
      alt: language === 'en' ? 'United Healthcare Insurance Logo - Mental Health Coverage' : 'Logo de Seguro United Healthcare - Cobertura de Salud Mental',
      name: 'United Healthcare'
    },
    { 
      src: floridaMedicaidLogo, 
      alt: language === 'en' ? 'Florida Medicaid Insurance Logo - State Mental Health Benefits' : 'Logo de Seguro Florida Medicaid - Beneficios Estatales de Salud Mental',
      name: 'Florida Medicaid'
    },
    { 
      src: oscarLogo, 
      alt: language === 'en' ? 'Oscar Health Insurance Logo - Behavioral Health Coverage' : 'Logo de Seguro Oscar Health - Cobertura de Salud Conductual',
      name: 'Oscar Health'
    },
    { 
      src: champvaLogo, 
      alt: language === 'en' ? 'ChampVA Insurance Logo - Veterans Mental Health Benefits' : 'Logo de Seguro ChampVA - Beneficios de Salud Mental para Veteranos',
      name: 'ChampVA'
    },
    { 
      src: sunshineHealthLogo, 
      alt: language === 'en' ? 'Sunshine Health Insurance Logo - Mental Health Services' : 'Logo de Seguro Sunshine Health - Servicios de Salud Mental',
      name: 'Sunshine Health'
    },
    { 
      src: avmedLogo, 
      alt: language === 'en' ? 'AvMed Insurance Logo - Psychiatric Care Coverage' : 'Logo de Seguro AvMed - Cobertura de Cuidado Psiquiátrico',
      name: 'AvMed'
    },
    { 
      src: wellcareLogo, 
      alt: language === 'en' ? 'WellCare Insurance Logo - Mental Health Benefits' : 'Logo de Seguro WellCare - Beneficios de Salud Mental',
      name: 'WellCare'
    },
    { 
      src: ambetterLogo, 
      alt: language === 'en' ? 'Ambetter Health Insurance Logo - Behavioral Health Coverage' : 'Logo de Seguro Ambetter Health - Cobertura de Salud Conductual',
      name: 'Ambetter Health'
    }
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

        {/* Insurance Logos Container - Ready for new logos */}
        <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap gap-6 sm:gap-8 lg:gap-10 justify-center items-center min-h-[112px] sm:min-h-[128px] lg:min-h-[144px]">
            {insuranceLogos.length > 0 ? (
              insuranceLogos.map((logo, index) => {
                const isHighPriority = index < 4 || index >= 8; // First 4 and last 3 images get high priority
                return (
                  <div 
                    key={index} 
                    className="group flex-shrink-0"
                    data-testid={`insurance-logo-${logo.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <OptimizedImage
                      src={logo.src}
                      alt={logo.alt}
                      className="w-28 h-20 sm:w-36 sm:h-28 md:w-44 md:h-32 lg:w-52 lg:h-36 object-contain transition-all duration-300 hover:scale-110"
                      width={isHighPriority ? 208 : 112}
                      height={isHighPriority ? 144 : 80}
                      priority={isHighPriority}
                      sizes="(max-width: 640px) 112px, (max-width: 768px) 144px, (max-width: 1024px) 176px, 208px"
                      style={{
                        aspectRatio: '13/9',
                        minWidth: 'min(112px, 25vw)',
                        minHeight: 'min(80px, 18vw)',
                        containIntrinsicSize: '208px 144px',
                        contentVisibility: isHighPriority ? 'visible' : 'auto',
                        willChange: 'auto'
                      }}
                    />
                  </div>
                );
              })
            ) : (
              <div className="w-full text-center py-8">
                <p className="text-gray-500 font-body text-lg">
                  {language === 'en' 
                    ? 'Insurance logos will be displayed here.'
                    : 'Los logos de seguros se mostrarán aquí.'}
                </p>
              </div>
            )}
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