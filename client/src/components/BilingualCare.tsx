import { Link } from '@/lib/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Check, Heart, Sun } from 'lucide-react';
import WellnessIcon from '@/components/WellnessIcon';
import bilingualImage from '@assets/bilingual-consultation-updated.webp';
import { assetUrl } from '@/lib/asset-url';

const BilingualCare = () => {
  const { language } = useLanguage();

  const features = [
    {
      title: language === 'en' ? 'Bilingual Care in English and Spanish' : 'Atención Bilingüe en Inglés y Español',
      description: language === 'en' 
        ? 'Consultations conducted in both Spanish and English for optimal communication'
        : 'Consultas realizadas tanto en español como en inglés para una comunicación óptima',
      isBilingual: true
    },
    {
      title: language === 'en' ? 'Cultural Understanding' : 'Comprensión Cultural',
      description: language === 'en'
        ? 'Sensitive to cultural factors that influence mental health and treatment'
        : 'Sensible a los factores culturales que influyen en la salud mental y el tratamiento'
    },
    {
      title: language === 'en' ? 'Family-Centered Approach' : 'Enfoque Centrado en la Familia',
      description: language === 'en'
        ? 'Understanding the important role of family in Hispanic mental health care'
        : 'Comprensión del papel importante de la familia en el cuidado de la salud mental hispana'
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-body font-bold text-green-800 leading-tight" data-testid="bilingual-title">
              {language === 'en' ? (
                <>
                  <span className="font-display italic text-green-700">Guided</span> by passion.
                  <WellnessIcon size="md" color="orange" className="inline-flex mx-2 sm:mx-3 mb-1 sm:mb-2">
                    <Heart />
                  </WellnessIcon>
                  <span className="font-display italic text-green-700">Driven</span> by purpose.
                </>
              ) : (
                <>
                  <span className="font-display italic text-green-700">Guiados</span> por la pasión.
                  <WellnessIcon size="md" color="orange" className="inline-flex mx-2 sm:mx-3 mb-1 sm:mb-2">
                    <Heart />
                  </WellnessIcon>
                  <span className="font-display italic text-green-700">Impulsados</span> por el propósito.
                </>
              )}
              </h2>
            </div>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed font-body" data-testid="bilingual-description">
              {language === 'en' 
                ? 'Dr. Reve provides bilingual psychiatric care in English and Spanish, so patients can discuss their concerns and treatment in their preferred language.'
                : 'La Dra. Reve ofrece atención psiquiátrica bilingüe en inglés y español para que los pacientes puedan hablar sobre sus inquietudes y tratamiento en su idioma preferido.'
              }
            </p>
            
            <div className="grid md:grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-8" data-testid="bilingual-features">
              {features.map((feature, index) => (
                <div key={index} className="relative flex items-start bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                  {feature.isBilingual && (
                    <div className="absolute -top-3 -right-3 bg-orange-100 text-green-700 text-sm font-bold px-3 py-1.5 rounded-full shadow-md">
                      {language === 'en' ? 'Bilingual' : 'Bilingüe'}
                    </div>
                  )}
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3 sm:mr-4 mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-display font-bold text-green-800 mb-1 sm:mb-2 text-sm sm:text-base">{feature.title}</h4>
                    <p className="text-gray-600 font-body leading-relaxed text-sm sm:text-base">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Link href={language === 'en' ? '/contact' : '/es/contacto'}>
              <Button
                className="group inline-flex items-center justify-center gap-3 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 bg-green-700 text-white hover:bg-green-800 px-6 sm:px-8 py-6 sm:py-7"
                data-testid="bilingual-schedule-consultation"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 bg-green-600">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span>{language === 'en' ? 'Schedule your Consultation' : 'Programe su Consulta'}</span>
              </Button>
            </Link>
          </div>
          
          <div>
            <img
              src={assetUrl(bilingualImage)}
              alt="Bilingual psychiatric care - diverse community support"
              className="rounded-lg sm:rounded-xl shadow-lg w-full h-auto"
              width={600}
              height={400}
              loading="lazy"
              decoding="async"
              data-testid="bilingual-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BilingualCare;
