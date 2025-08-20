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
      id: 'anxiety',
      title: language === 'en' ? 'Anxiety Treatment' : 'Tratamiento de Ansiedad',
      description: language === 'en' 
        ? 'Expert care for panic attacks, social anxiety, and generalized anxiety disorder. Evidence-based treatment with compassionate support for lasting relief.'
        : 'Atención experta para ataques de pánico, ansiedad social y trastorno de ansiedad generalizada. Tratamiento basado en evidencia con apoyo compasivo para alivio duradero.',
      icon: IconBrain,
      featured: true,
      link: language === 'en' ? '/services/anxiety-treatment' : '/es/servicios/tratamiento-ansiedad'
    },
    {
      id: 'depression',
      title: language === 'en' ? 'Depression Treatment' : 'Tratamiento de Depresión',
      description: language === 'en'
        ? 'Comprehensive care for major depression, including medication management and therapy coordination. Find hope and healing with personalized treatment plans.'
        : 'Atención integral para depresión mayor, incluyendo manejo de medicamentos y coordinación de terapia. Encuentre esperanza y sanación con planes de tratamiento personalizados.',
      icon: IconSun,
      featured: false,
      link: language === 'en' ? '/services/depression-treatment' : '/es/servicios/tratamiento-depresion'
    },
    {
      id: 'adhd',
      title: language === 'en' ? 'ADHD Treatment' : 'Tratamiento de TDAH',
      description: language === 'en'
        ? 'Specialized evaluation and treatment for adults and teens with ADHD. Improve focus, organization, and daily functioning with expert psychiatric care.'
        : 'Evaluación especializada y tratamiento para adultos y adolescentes con TDAH. Mejore el enfoque, organización y funcionamiento diario con atención psiquiátrica experta.',
      icon: IconMoodHappy,
      featured: false,
      link: language === 'en' ? '/services/adhd-treatment' : '/es/servicios/tratamiento-tdah'
    },
    {
      id: 'ptsd',
      title: language === 'en' ? 'PTSD Treatment' : 'Tratamiento de TEPT',
      description: language === 'en'
        ? 'Trauma-informed psychiatric care for post-traumatic stress disorder. Safe, culturally sensitive treatment to help you reclaim your life from trauma.'
        : 'Atención psiquiátrica informada en trauma para trastorno de estrés postraumático. Tratamiento seguro y culturalmente sensible para ayudarle a reclamar su vida del trauma.',
      icon: IconLeaf,
      featured: false,
      link: language === 'en' ? '/services/ptsd-treatment' : '/es/servicios/tratamiento-tept'
    },
    {
      id: 'bipolar',
      title: language === 'en' ? 'Bipolar Treatment' : 'Tratamiento Bipolar',
      description: language === 'en'
        ? 'Expert mood stabilization for bipolar I, II, and cyclothymia. Comprehensive care to help you achieve emotional balance and prevent future episodes.'
        : 'Estabilización experta del ánimo para bipolar I, II y ciclotimia. Atención integral para ayudarle a lograr equilibrio emocional y prevenir episodios futuros.',
      icon: IconHeart,
      featured: false,
      link: language === 'en' ? '/services/bipolar-treatment' : '/es/servicios/tratamiento-bipolar'
    },
    {
      id: 'medication-management',
      title: language === 'en' ? 'Medication Management' : 'Manejo de Medicamentos',
      description: language === 'en'
        ? 'Expert psychiatric medication evaluation, monitoring, and adjustment. Personalized medication plans with comprehensive safety assessments and ongoing care.'
        : 'Evaluación, monitoreo y ajuste experto de medicamentos psiquiátricos. Planes de medicación personalizados con evaluaciones de seguridad integrales y atención continua.',
      icon: IconUser,
      featured: false,
      link: language === 'en' ? '/services/medication-management' : '/es/servicios/manejo-medicamentos'
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-body font-bold text-green-800 text-center" data-testid="services-title">
              Mental Health for <span className="font-display italic text-green-700">every</span> mind
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:shadow-lg flex flex-col h-full ${
                  service.featured 
                    ? 'bg-green-800 text-white' 
                    : 'bg-white text-green-800 border border-green-100'
                }`}
                data-testid={`service-${service.id}`}
              >

                <div className={`w-10 h-10 sm:w-12 sm:h-12 min-w-[2.5rem] min-h-[2.5rem] sm:min-w-[3rem] sm:min-h-[3rem] rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 flex-shrink-0 ${
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
                
                <p className={`text-sm sm:text-base font-body leading-relaxed mb-4 sm:mb-5 flex-grow ${
                  service.featured ? 'text-green-100' : 'text-gray-600'
                }`} data-testid={`service-description-${service.id}`}>
                  {service.description}
                </p>

                <Link href={service.link} className="mt-auto">
                  <Button
                    className={`group inline-flex items-center justify-center gap-3 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 px-6 sm:px-8 py-6 sm:py-7 w-full ${
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
                    <span>
                      {language === 'en' 
                        ? (() => {
                            switch(service.id) {
                              case 'anxiety': return 'Learn About Anxiety Treatment';
                              case 'depression': return 'Learn About Depression Treatment';
                              case 'adhd': return 'Learn About ADHD Treatment';
                              case 'ptsd': return 'Learn About PTSD Treatment';
                              case 'bipolar': return 'Learn About Bipolar Treatment';
                              case 'medication-management': return 'Learn About Medication Management';
                              default: return 'Learn More';
                            }
                          })()
                        : (() => {
                            switch(service.id) {
                              case 'anxiety': return 'Conocer Tratamiento de Ansiedad';
                              case 'depression': return 'Conocer Tratamiento de Depresión';
                              case 'adhd': return 'Conocer Tratamiento de TDAH';
                              case 'ptsd': return 'Conocer Tratamiento de TEPT';
                              case 'bipolar': return 'Conocer Tratamiento Bipolar';
                              case 'medication-management': return 'Conocer Manejo de Medicamentos';
                              default: return 'Saber Más';
                            }
                          })()
                      }
                    </span>
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