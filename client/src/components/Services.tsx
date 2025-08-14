import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { IconBrain, IconHeart, IconMoodHappy, IconUser, IconSun, IconLeaf } from '@tabler/icons-react';
import WellnessIcon from '@/components/WellnessIcon';

const Services = () => {
  const { language } = useLanguage();

  const services = [
    {
      id: 'scheduling',
      title: language === 'en' ? 'Flexible Scheduling' : 'Horarios Flexibles',
      description: language === 'en' 
        ? 'Adapt your mental health care to your busy life with comprehensive scheduling options. Choose from morning, afternoon, or evening appointments to fit your lifestyle.'
        : 'Adapte su atención de salud mental a su vida ocupada con opciones de programación integrales. Elija citas matutinas, vespertinas o nocturnas para adaptarse a su estilo de vida.',
      icon: IconBrain,
      featured: true
    },
    {
      id: 'programs',
      title: language === 'en' ? 'Personalized Programs' : 'Programas Personalizados',
      description: language === 'en'
        ? 'Achieve your goals with customized mental health programs tailored to your unique needs. Whether you\'re starting out or pushing your limits, we\'ll guide you every step of the way.'
        : 'Alcance sus metas con programas de salud mental personalizados adaptados a sus necesidades únicas. Ya sea que esté comenzando o superando sus límites, lo guiaremos en cada paso del camino.',
      icon: IconMoodHappy,
      featured: false
    },
    {
      id: 'experts',
      title: language === 'en' ? 'Expert Care' : 'Atención Experta',
      description: language === 'en'
        ? 'Our certified and experienced psychiatrist is here to support you. With expertise in anxiety, depression, and wellness, we\'re dedicated to helping you reach your mental health goals.'
        : 'Nuestra psiquiatra certificada y experimentada está aquí para apoyarlo. Con experiencia en ansiedad, depresión y bienestar, estamos dedicados a ayudarlo a alcanzar sus metas de salud mental.',
      icon: IconUser,
      featured: false
    },
    {
      id: 'wellness',
      title: language === 'en' ? 'Holistic Wellness' : 'Bienestar Holístico',
      description: language === 'en'
        ? 'Beyond just treatment, we provide holistic wellness services, including nutritional advice and stress management techniques, to help you achieve a balanced, healthy lifestyle.'
        : 'Más allá del tratamiento, brindamos servicios de bienestar holístico, incluyendo consejos nutricionales y técnicas de manejo del estrés, para ayudarlo a lograr un estilo de vida equilibrado y saludable.',
      icon: IconHeart,
      featured: false
    }
  ];

  return (
    <section id="services" className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <WellnessIcon size="md" color="green" className="opacity-70">
              <IconBrain />
            </WellnessIcon>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-green-800 text-center" data-testid="services-title">
              Mental Health for <span className="font-body italic">every</span> mind
            </h2>
            <WellnessIcon size="md" color="blue" className="opacity-70">
              <IconHeart />
            </WellnessIcon>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed px-4 sm:px-0" data-testid="services-description">
            {language === 'en'
              ? 'Comprehensive psychiatric care tailored to your individual needs, helping you navigate life\'s challenges with confidence and resilience.'
              : 'Atención psiquiátrica integral adaptada a sus necesidades individuales, ayudándole a navegar los desafíos de la vida con confianza y resistencia.'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:shadow-lg ${
                  service.featured 
                    ? 'bg-green-800 text-white' 
                    : 'bg-white text-green-800 border border-green-100'
                }`}
                data-testid={`service-${service.id}`}
              >

                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 ${
                  service.featured ? 'bg-green-700' : 'bg-green-100'
                }`}>
                  <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    service.featured ? 'text-white' : 'text-green-800'
                  }`} />
                </div>
                
                <h3 className={`text-xl sm:text-2xl font-display font-bold mb-3 sm:mb-4 ${
                  service.featured ? 'text-white' : 'text-green-800'
                }`} data-testid={`service-title-${service.id}`}>
                  {service.title}
                </h3>
                
                <p className={`text-base sm:text-lg font-body leading-relaxed mb-4 sm:mb-6 ${
                  service.featured ? 'text-green-100' : 'text-gray-600'
                }`} data-testid={`service-description-${service.id}`}>
                  {service.description}
                </p>

                <Link href="/contact">
                  <Button
                    className={`group inline-flex items-center justify-center gap-3 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 px-6 sm:px-8 py-6 sm:py-7 ${
                      service.featured
                        ? 'bg-white text-green-800 hover:bg-green-50'
                        : 'bg-green-800 text-white hover:bg-green-700'
                    }`}
                    data-testid={`service-button-${service.id}`}
                  >
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                      service.featured
                        ? 'bg-green-100'
                        : 'bg-green-700'
                    }`}>
                      <ArrowRight className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        service.featured ? 'text-green-800' : 'text-white'
                      }`} />
                    </div>
                    <span>{language === 'en' ? 'Learn More' : 'Saber Más'}</span>
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;