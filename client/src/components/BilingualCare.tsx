import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6" data-testid="bilingual-title">
              {language === 'en' ? 'Bilingual Psychiatric Care' : 'Atención Psiquiátrica Bilingüe'}
            </h2>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed" data-testid="bilingual-description">
              {language === 'en' 
                ? 'Dr. Reve understands that mental health care is most effective when provided in your native language. As a fluent Spanish speaker, she offers comprehensive psychiatric services to the Hispanic community in Naples with cultural sensitivity and understanding.'
                : 'La Dra. Reve entiende que la atención de salud mental es más efectiva cuando se proporciona en su idioma nativo. Como hablante fluida de español, ofrece servicios psiquiátricos integrales a la comunidad hispana en Naples con sensibilidad y comprensión cultural.'
              }
            </p>
            
            <div className="space-y-4 mb-8" data-testid="bilingual-features">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <Check className="w-6 h-6 text-primary-green mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                    <p className="text-gray-700">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Link href="/contact">
              <Button
                className="bg-primary-green text-white hover:bg-primary-green-hover font-medium px-8 py-3"
                data-testid="bilingual-schedule-consultation"
              >
                {language === 'en' ? 'Schedule your Consultation' : 'Programe su Consulta'}
              </Button>
            </Link>
          </div>
          
          <div>
            <img
              src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
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
