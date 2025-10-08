import { MapPin, Users, VideoIcon, Monitor, CheckCircle, Calendar, Shield, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import CharmHealthBooking from '@/components/CharmHealthBooking';
import LocationFAQ from '@/components/LocationFAQ';
import WellnessIcon from '@/components/WellnessIcon';
import OptimizedImage from '@/components/OptimizedImage';
import { locationFAQs } from '@/data/locationFAQs';
import floridaMap from '../assets/florida-map.webp';
import heroLocationImage from '@assets/dr-melva-location-hero.webp';

const TelehealthSection = () => {
  const { language } = useLanguage();

  const contentData = {
    en: {
      badge: 'Statewide Telehealth',
      title: (
        <>
          Professional <span className="font-display italic text-green-700">Telepsychiatry</span>{' '}
          Services in <span className="font-display italic text-green-700">Florida</span>
        </>
      ),
      subtitle: 'Expert psychiatric care from anywhere in Florida - secure, convenient, and effective',
      scheduleBtn: 'Schedule Telehealth Session',
      learnMoreBtn: 'Learn More',
      badges: [
        'Board Certified Psychiatrist',
        'Bilingual Care Available',
        'Same Day Appointments',
        'HIPAA Compliant Platform',
        'Prescription Management',
        'Florida Licensed'
      ],
      benefitsTitle: 'Why Choose Telepsychiatry?',
      benefits: [
        {
          title: 'No Travel Required',
          description: 'Meet with Dr. Reve from the comfort and privacy of your home',
          icon: Monitor
        },
        {
          title: 'Same Quality Care',
          description: 'Research-proven to be as effective as in-person appointments',
          icon: CheckCircle
        },
        {
          title: 'Convenient Access',
          description: 'Flexible scheduling that fits your busy lifestyle',
          icon: Calendar
        },
        {
          title: 'Bilingual Services',
          description: 'Sessions available in English and Spanish',
          icon: Users
        }
      ]
    },
    es: {
      badge: 'Telesalud Estatal',
      title: (
        <>
          Servicios Profesionales de <span className="font-display italic text-green-700">Telepsiquiatría</span>{' '}
          en <span className="font-display italic text-green-700">Florida</span>
        </>
      ),
      subtitle: 'Atención psiquiátrica experta desde cualquier lugar de Florida - segura, conveniente y efectiva',
      scheduleBtn: 'Programar Sesión de Telesalud',
      learnMoreBtn: 'Más Información',
      badges: [
        'Psiquiatra Certificada',
        'Atención Bilingüe Disponible',
        'Citas el Mismo Día',
        'Plataforma Compatible HIPAA',
        'Manejo de Prescripciones',
        'Licenciada en Florida'
      ],
      benefitsTitle: '¿Por Qué Elegir Telepsiquiatría?',
      benefits: [
        {
          title: 'Sin Necesidad de Viajar',
          description: 'Reúnase con la Dra. Reve desde la comodidad y privacidad de su hogar',
          icon: Monitor
        },
        {
          title: 'Misma Calidad de Atención',
          description: 'Comprobado científicamente ser tan efectivo como citas en persona',
          icon: CheckCircle
        },
        {
          title: 'Acceso Conveniente',
          description: 'Horarios flexibles que se ajustan a su estilo de vida ocupado',
          icon: Calendar
        },
        {
          title: 'Servicios Bilingües',
          description: 'Sesiones disponibles en inglés y español',
          icon: Users
        }
      ]
    }
  };

  const content = contentData[language];

  return (
    <>
      {/* Hero Section - Location Page Style */}
      <section className="py-12 sm:py-16 lg:py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Text Content Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <WellnessIcon size="sm" color="green">
                <VideoIcon />
              </WellnessIcon>
              <span className="text-green-700 font-body font-semibold text-lg">
                {content.badge}
              </span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-body font-bold text-green-800 mb-6" data-testid="telehealth-hero-title">
              {content.title}
            </h2>

            {/* Hero Image - Dr. Melva */}
            <div className="mb-8">
              <div className="max-w-4xl mx-auto">
                <div className="w-full aspect-[1200/667] rounded-2xl overflow-hidden shadow-lg">
                  <OptimizedImage
                    src={heroLocationImage}
                    alt="Dr. Melva Reve - Professional telepsychiatry services throughout Florida"
                    className="w-full h-full object-cover object-center"
                    width={1200}
                    height={675}
                    priority={true}
                    sizes="(max-width: 640px) 600px, (max-width: 1024px) 800px, 1200px"
                  />
                </div>
              </div>
            </div>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-4xl mx-auto font-body">
              {content.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CharmHealthBooking variant="prominent" showDescription={false} />
            </div>
          </div>

          {/* Feature Badges */}
          <div className="mt-16">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap gap-4 justify-center">
                {content.badges.map((badge, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white rounded-full px-5 py-2.5 shadow-md hover:shadow-lg transition-shadow duration-200 border border-green-100" data-testid={`telehealth-badge-${index}`}>
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-body font-medium text-sm">
                      {badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Florida Map & Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Florida Map */}
            <div className="relative order-2 lg:order-1">
              <div className="bg-green-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-green-100">
                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[4/3]">
                  <img 
                    src={floridaMap}
                    alt="Florida State Map - Telepsychiatry Services Available Statewide"
                    className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-green-500 bg-opacity-5 border-2 border-green-400 border-opacity-20 rounded-xl"></div>
                  
                  <div className="absolute bottom-4 left-4 z-10">
                    <div className="bg-white bg-opacity-95 rounded-lg shadow-lg px-3 py-2 border border-green-200">
                      <div className="flex items-center gap-2 text-xs text-green-700 font-medium">
                        <VideoIcon className="w-3 h-3" />
                        <span>{language === 'en' ? 'Statewide Coverage' : 'Cobertura Estatal'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 text-center">
                  <p className="text-sm text-gray-600 font-body">
                    {language === 'en' 
                      ? 'Serving all 67 counties across Florida'
                      : 'Sirviendo los 67 condados de Florida'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="order-1 lg:order-2">
              <h3 className="text-3xl sm:text-4xl font-body font-bold text-green-800 mb-8">
                {content.benefitsTitle}
              </h3>
              <div className="space-y-4">
                {content.benefits.map((benefit, index) => {
                  const IconComponent = benefit.icon;
                  return (
                    <Card key={index} className="bg-white rounded-xl p-6 shadow-sm border border-green-50 hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-green-800 mb-1">{benefit.title}</h4>
                          <p className="text-base text-gray-600">{benefit.description}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-body font-bold text-green-800 mb-4">
              {language === 'en' ? 'How Telepsychiatry Works' : 'Cómo Funciona la Telepsiquiatría'}
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {language === 'en' 
                ? 'Getting started with virtual psychiatric care is simple and convenient'
                : 'Comenzar con atención psiquiátrica virtual es simple y conveniente'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                step: '1',
                titleEn: 'Schedule Online',
                titleEs: 'Programar en Línea',
                descEn: 'Book your appointment 24/7 through our secure portal',
                descEs: 'Reserve su cita 24/7 a través de nuestro portal seguro'
              },
              {
                step: '2',
                titleEn: 'Prepare Your Space',
                titleEs: 'Prepare su Espacio',
                descEn: 'Find a private, quiet location with internet access',
                descEs: 'Encuentre un lugar privado y tranquilo con acceso a internet'
              },
              {
                step: '3',
                titleEn: 'Join Your Session',
                titleEs: 'Únase a su Sesión',
                descEn: 'Click the link to connect with Dr. Reve at your appointment time',
                descEs: 'Haga clic en el enlace para conectarse con la Dra. Reve a la hora de su cita'
              },
              {
                step: '4',
                titleEn: 'Receive Care',
                titleEs: 'Reciba Atención',
                descEn: 'Get expert treatment and prescriptions sent to your pharmacy',
                descEs: 'Obtenga tratamiento experto y recetas enviadas a su farmacia'
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-6 shadow-md border border-green-100 h-full">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <span className="text-white font-bold text-xl">{item.step}</span>
                  </div>
                  <h4 className="text-lg font-bold text-green-800 mb-2 text-center">
                    {language === 'en' ? item.titleEn : item.titleEs}
                  </h4>
                  <p className="text-gray-600 text-center text-sm">
                    {language === 'en' ? item.descEn : item.descEs}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <CharmHealthBooking variant="prominent" showDescription={false} />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <LocationFAQ 
        locationFAQs={locationFAQs.telehealth}
        title={language === 'en' 
          ? <>Telehealth <span className="font-display italic text-green-700">FAQ</span></>
          : <>Preguntas <span className="font-display italic text-green-700">Frecuentes</span> de Telesalud</>
        }
        description={language === 'en'
          ? 'Find answers to common questions about our telepsychiatry services'
          : 'Encuentre respuestas a preguntas comunes sobre nuestros servicios de telepsiquiatría'
        }
      />
    </>
  );
};

export default TelehealthSection;
