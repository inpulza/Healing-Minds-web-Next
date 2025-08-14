import { useLanguage } from '@/hooks/useLanguage';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const { language } = useLanguage();

  const testimonials = [
    {
      name: 'J.D.',
      location: 'Patient',
      quote: language === 'en' 
        ? 'Dr. Reve created a safe space for me to truly open up. Her guidance has been invaluable on my journey to understanding myself better.'
        : 'La Dra. Reve creó un espacio seguro para que pudiera abrirme de verdad. Su orientación ha sido invaluable en mi viaje hacia comprender mejor a mí mismo.',
      rating: 5
    },
    {
      name: 'A.S.',
      location: 'Patient', 
      quote: language === 'en'
        ? 'I was hesitant to start medication, but Dr. Reve\'s collaborative and informative approach made me feel confident and cared for. It\'s been life-changing.'
        : 'Tenía dudas sobre empezar medicación, pero el enfoque colaborativo e informativo de la Dra. Reve me hizo sentir confiado y cuidado. Ha sido un cambio de vida.',
      rating: 5
    },
    {
      name: 'M.R.',
      location: 'Patient',
      quote: language === 'en'
        ? 'The level of empathy and professionalism is unmatched. I finally feel like I have a true partner in my mental health care.'
        : 'El nivel de empatía y profesionalismo no tiene comparación. Finalmente siento que tengo un verdadero compañero en mi cuidado de salud mental.',
      rating: 5
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: rating }, (_, i) => (
      <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
    ));
  };

  return (
    <section className="py-20 bg-soft-mint">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-warm mb-6" data-testid="testimonials-title">
            What our <span className="font-body italic">happy</span> patients say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed" data-testid="testimonials-description">
            {language === 'en'
              ? 'Real stories from patients who have found hope and healing through Dr. Reve\'s compassionate care.'
              : 'Historias reales de pacientes que han encontrado esperanza y sanación a través del cuidado compasivo de la Dra. Reve.'
            }
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card-modern hover:shadow-xl transition-all duration-300 group" data-testid={`testimonial-${index}`}>
              <div className="flex items-center justify-center mb-8">
                <div className="flex space-x-1">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
              
              <p className="text-gray-700 mb-8 text-lg leading-relaxed font-body" data-testid={`testimonial-quote-${index}`}>
                "{testimonial.quote}"
              </p>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                  <div className="text-white font-display font-bold text-sm">
                    {testimonial.name.split('.')[0]}
                  </div>
                </div>
                <div>
                  <div className="font-body font-semibold text-warm" data-testid={`testimonial-name-${index}`}>
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500 font-body" data-testid={`testimonial-location-${index}`}>
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
