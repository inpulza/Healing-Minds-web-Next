import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import InsuranceLogos from '@/components/InsuranceLogos';
import DoctorSection from '@/components/DoctorSection';
import About from '@/components/About';
import Services from '@/components/Services';
import BilingualCare from '@/components/BilingualCare';
import FAQ from '@/components/FAQ';
import Testimonials from '@/components/Testimonials';
import ForPatients from '@/components/ForPatients';
import Contact from '@/components/Contact';
import ServiceAreas from '@/components/ServiceAreas';
import Footer from '@/components/Footer';
import CharmHealthBooking from '@/components/CharmHealthBooking';
import { updateSEO } from '@/utils/seo';
import { MapPin, Users, VideoIcon, Navigation, Monitor, CheckCircle, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import floridaMap from '../assets/florida-map.png';

const Home = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Dr. Melva Reve - Compassionate Psychiatric Care in Naples, FL | Healing Minds'
        : 'Dra. Melva Reve - Atención Psiquiátrica Compasiva en Naples, FL | Healing Minds',
      description: language === 'en'
        ? 'Expert psychiatric care for adults in Naples, FL. Dr. Melva Reve offers bilingual treatment for anxiety, depression, ADHD, and PTSD. 15+ years experience. Book your consultation today.'
        : 'Atención psiquiátrica experta para adultos en Naples, FL. La Dra. Melva Reve ofrece tratamiento bilingüe para ansiedad, depresión, TDAH y TEPT. Más de 15 años de experiencia. Reserve su consulta hoy.',
      keywords: language === 'en'
        ? 'psychiatrist Naples FL, psychiatric care Naples, anxiety treatment Naples, depression treatment Naples, bilingual psychiatrist, Spanish speaking psychiatrist Naples'
        : 'psiquiatra Naples FL, atención psiquiátrica Naples, tratamiento ansiedad Naples, tratamiento depresión Naples, psiquiatra bilingüe, psiquiatra español Naples',
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

            <div className="grid lg:grid-cols-3 gap-8 sm:gap-10 items-start">
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
                      <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
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
              <div className="order-1 lg:order-2 lg:col-span-1 space-y-6">
                {/* Telehealth Features */}
                <div className="space-y-4">
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
                            <h4 className="text-base sm:text-lg font-bold text-blue-800 mb-1">{feature.title}</h4>
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
                  <h4 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-3">
                    {language === 'en' ? 'Book Your Telehealth Session' : 'Reserve su Sesión de Telesalud'}
                  </h4>
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
        
        <DoctorSection />
        <Services />
        <About />
        <BilingualCare />
        <ServiceAreas />
        <Testimonials />
        <ForPatients />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
