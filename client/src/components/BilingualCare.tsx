import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { IconHeart, IconSun } from '@tabler/icons-react';
import WellnessIcon from '@/components/WellnessIcon';
import bilingualImage from '@assets/bilingual-consultation-updated.png';

const BilingualCare = () => {
  const { language } = useLanguage();

  const features = [
    {
      title: language === 'en' ? 'Native Spanish Fluency' : 'Fluidez Nativa en Español',
      description: language === 'en' 
        ? 'Consultations conducted entirely in Spanish for optimal communication'
        : 'Consultas realizadas completamente en español para una comunicación óptima'
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
    <section className="py-20 bg-green-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-green-800 leading-tight" data-testid="bilingual-title">
                <span className="font-body italic">Guided</span> by passion.
                <WellnessIcon size="md" color="orange" className="inline-flex mx-3 mb-2">
                  <IconHeart />
                </WellnessIcon>
                <span className="font-display italic">Driven</span> by purpose.
              </h2>
            </div>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed font-body" data-testid="bilingual-description">
              {language === 'en' 
                ? 'Dr. Reve understands that mental health care is most effective when provided in your native language. As a fluent Spanish speaker, she offers comprehensive psychiatric services to the Hispanic community in Naples with cultural sensitivity and understanding.'
                : 'La Dra. Reve entiende que la atención de salud mental es más efectiva cuando se proporciona en su idioma nativo. Como hablante fluida de español, ofrece servicios psiquiátricos integrales a la comunidad hispana en Naples con sensibilidad y comprensión cultural.'
              }
            </p>
            
            <div className="grid md:grid-cols-1 gap-6 mb-8" data-testid="bilingual-features">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start bg-white rounded-2xl p-6 shadow-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-4 mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-display font-bold text-green-800 mb-2">{feature.title}</h4>
                    <p className="text-gray-600 font-body leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Link href="/contact">
              <Button
                className="group inline-flex items-center justify-center gap-3 rounded-full text-lg font-semibold transition-all duration-300 bg-green-600 text-white hover:bg-green-700 px-8 py-6"
                data-testid="bilingual-schedule-consultation"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-green-500">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span>{language === 'en' ? 'Schedule your Consultation' : 'Programe su Consulta'}</span>
              </Button>
            </Link>
          </div>
          
          <div>
            <img
              src={bilingualImage}
              alt="Bilingual psychiatric care - diverse community support"
              className="rounded-xl shadow-lg w-full h-auto"
              data-testid="bilingual-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BilingualCare;
