import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import InsuranceLogos from '@/components/InsuranceLogos';
import SuspenseWrapper from '@/components/SuspenseWrapper';
import { 
  LazyDoctorSection,
  LazyServices,
  LazyAbout,
  LazyBilingualCare,
  LazyServiceAreas,
  LazyTestimonials,
  LazyForPatients,
  LazyFAQ,
  LazyContact,
  LazyFooter
} from '@/components/LazyComponents';
import CharmHealthBooking from '@/components/CharmHealthBooking';
import { updateSEO } from '@/utils/seo';
import { MapPin, Users, VideoIcon, Navigation, Monitor, CheckCircle, Clock, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import floridaMap from '../assets/florida-map.webp';

const Home = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Expert Psychiatric Care in Naples, FL - Anxiety, Depression, ADHD, Therapy | Dr. Melva Reve'
        : 'Atención Psiquiátrica Experta en Naples, FL - Ansiedad, Depresión, TDAH, Terapia | Dra. Melva Reve',
      description: language === 'en'
        ? 'Board certified psychiatrist Dr. Melva Reve provides expert psychiatric care in Naples, FL. Specializing in anxiety, depression, ADHD, and therapy. Mental health services for Southwest Florida. Call (239) 423-0272.'
        : 'La psiquiatra certificada Dra. Melva Reve brinda atención psiquiátrica experta en Naples, FL. Especializada en ansiedad, depresión, TDAH y terapia. Servicios de salud mental para el suroeste de Florida. Llame (239) 423-0272.',
      keywords: language === 'en'
        ? 'expert psychiatric care Naples FL, board certified psychiatrist Naples, anxiety treatment Naples FL, depression treatment Naples FL, ADHD therapy Naples, Naples mental health, Southwest Florida psychiatrist, Dr Melva Reve psychiatrist'
        : 'atención psiquiátrica experta Naples FL, psiquiatra certificada Naples, tratamiento ansiedad Naples FL, tratamiento depresión Naples FL, terapia TDAH Naples, salud mental Naples, psiquiatra suroeste Florida, Dra Melva Reve psiquiatra',
      lang: language,
      canonical: language === 'en' ? '/' : '/es'
    };
    updateSEO(seoData);
  }, [language]);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <InsuranceLogos />
        
        {/* Telehealth Services Section - Florida Wide */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-blue-800 mb-4 sm:mb-6">
                {language === 'en' ? (
                  <>
                    <span className="font-display italic text-blue-700">Telehealth</span> Services
                  </>
                ) : (
                  <>
                    Servicios de <span className="font-display italic text-blue-700">Telesalud</span>
                  </>
                )}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'Professional psychiatric care available throughout Florida via secure telehealth sessions. No travel required - connect with Dr. Melva Reve from the comfort of your home.'
                  : 'Atención psiquiátrica profesional disponible en toda Florida a través de sesiones seguras de telesalud. No se requiere viajar - conéctese con la Dra. Melva Reve desde la comodidad de su hogar.'
                }
              </p>
            </div>

            {/* Stats - Above Map */}
            <div className="mb-8 sm:mb-12">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {[
                  {
                    icon: Users,
                    value: '22M+',
                    label: language === 'en' ? 'Florida Residents' : 'Residentes de FL'
                  },
                  {
                    icon: VideoIcon,
                    value: '24/7',
                    label: language === 'en' ? 'Online Scheduling' : 'Programación Online'
                  },
                  {
                    icon: Monitor,
                    value: '100%',
                    label: language === 'en' ? 'Secure Platform' : 'Plataforma Segura'
                  }
                ].map((stat, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <stat.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-800 whitespace-nowrap">{stat.value}</div>
                    <div className="text-sm text-gray-600 font-medium whitespace-nowrap">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 sm:gap-10 items-stretch">
              {/* Florida Map */}
              <div className="relative order-2 lg:order-1 lg:col-span-2">
                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-blue-100">
                  <div className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[4/3]">
                    
                    {/* Florida Map as Background */}
                    <div className="absolute inset-0">
                      <img 
                        src={floridaMap}
                        alt="Florida State Map - Telehealth Services Available"
                        className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                      />
                    </div>

                    {/* State-wide coverage overlay */}
                    <div className="absolute inset-0">
                      {/* Statewide coverage indication */}
                      <div className="absolute inset-0 bg-blue-500 bg-opacity-5 border-2 border-blue-400 border-opacity-20 rounded-xl"></div>
                    </div>

                    {/* Compass */}
                    <div className="absolute top-4 right-4 z-10">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200">
                        <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      </div>
                    </div>

                    {/* Coverage indicator */}
                    <div className="absolute bottom-4 left-4 z-10">
                      <div className="bg-white bg-opacity-95 rounded-lg shadow-lg px-3 py-2 border border-blue-200">
                        <div className="flex items-center gap-2 text-xs text-blue-700 font-medium">
                          <VideoIcon className="w-3 h-3" />
                          <span>{language === 'en' ? 'Statewide Coverage' : 'Cobertura Estatal'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Map Legend */}
                  <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-700 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-700">
                        {language === 'en' ? 'Main Office' : 'Oficina Principal'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">
                        {language === 'en' ? 'Telehealth Areas' : 'Áreas de Telesalud'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Telehealth Info & Booking */}
              <div className="order-1 lg:order-2 lg:col-span-1 flex flex-col h-full">
                {/* Telehealth Features */}
                <div className="flex flex-col justify-between h-full space-y-2">
                  {[
                    {
                      title: language === 'en' ? 'Secure Video Sessions' : 'Sesiones de Video Seguras',
                      description: language === 'en' ? 'HIPAA-compliant platform' : 'Plataforma compatible con HIPAA',
                      icon: VideoIcon
                    },
                    {
                      title: language === 'en' ? 'Real-time Scheduling' : 'Programación en Tiempo Real',
                      description: language === 'en' ? '24/7 online booking' : 'Reserva online 24/7',
                      icon: Clock
                    },
                    {
                      title: language === 'en' ? 'Prescription Management' : 'Manejo de Prescripciones', 
                      description: language === 'en' ? 'Digital prescriptions sent directly' : 'Prescripciones digitales enviadas directamente',
                      icon: CheckCircle
                    },
                    {
                      title: language === 'en' ? 'Bilingual Care' : 'Atención Bilingüe',
                      description: language === 'en' ? 'English & Spanish sessions' : 'Sesiones en inglés y español',
                      icon: Users
                    },
                    {
                      title: language === 'en' ? 'Insurance Accepted' : 'Seguros Aceptados',
                      description: language === 'en' ? 'Most major plans accepted' : 'Se aceptan la mayoría de planes principales',
                      icon: Shield
                    }
                  ].map((feature, index) => {
                    const IconComponent = feature.icon;
                    return (
                      <Card key={index} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-blue-50 hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg font-bold text-blue-800 mb-1">{feature.title}</h3>
                            <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

              </div>
            </div>

            {/* Main Booking Card - Full Width Below */}
            <div className="mt-12">
              <Card className="p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                <div className="text-center">
                  <VideoIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-3">
                    {language === 'en' ? 'Book Your Telehealth Session' : 'Reserve su Sesión de Telesalud'}
                  </h3>
                  <p className="text-lg sm:text-xl text-blue-700 mb-6">
                    {language === 'en' 
                      ? 'Schedule with Dr. Melva Reve from anywhere in Florida'
                      : 'Programe con la Dra. Melva Reve desde cualquier lugar de Florida'
                    }
                  </p>
                  <CharmHealthBooking variant="compact" showDescription={false} className="justify-center" />
                </div>
              </Card>
            </div>
          </div>
        </section>
        
        <SuspenseWrapper priority="high" preload>
          <LazyDoctorSection />
        </SuspenseWrapper>
        <SuspenseWrapper priority="high" preload>
          <LazyServices />
        </SuspenseWrapper>
        <SuspenseWrapper priority="high">
          <LazyAbout />
        </SuspenseWrapper>
        <SuspenseWrapper priority="medium">
          <LazyBilingualCare />
        </SuspenseWrapper>
        <SuspenseWrapper priority="medium">
          <LazyServiceAreas />
        </SuspenseWrapper>
        <SuspenseWrapper priority="medium">
          <LazyTestimonials />
        </SuspenseWrapper>
        <SuspenseWrapper priority="low">
          <LazyForPatients />
        </SuspenseWrapper>
        <SuspenseWrapper priority="low">
          <LazyFAQ />
        </SuspenseWrapper>
        <SuspenseWrapper priority="low">
          <LazyContact />
        </SuspenseWrapper>
      </main>
      <SuspenseWrapper priority="low">
        <LazyFooter />
      </SuspenseWrapper>
    </div>
  );
};

export default Home;
