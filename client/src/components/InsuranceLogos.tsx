import { useLanguage } from '@/hooks/useLanguage';
import OptimizedImage from './OptimizedImage';

const InsuranceLogos = () => {
  const { language } = useLanguage();
  
  // Insurance logos array - ready to receive new logos
  const insuranceLogos = [
    // Add new insurance logos here
    // Format: { src: logoImage, alt: 'Logo Alt Text', name: 'Logo Name' }
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