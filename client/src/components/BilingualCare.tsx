import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
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
    <section className="py-20 bg-soft-mint">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-green-800 mb-8" data-testid="bilingual-title">
              <span className="font-body italic">Guided</span> by passion. <span className="font-display italic">Driven</span> by purpose.
            </h2>
            
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
                className="pill-button text-lg px-10 py-5"
                data-testid="bilingual-schedule-consultation"
              >
                {language === 'en' ? 'Schedule your Consultation' : 'Programe su Consulta'}
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
