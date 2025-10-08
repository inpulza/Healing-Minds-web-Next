import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { VideoIcon, Shield, Clock, Users, CheckCircle, MapPin, Monitor, ArrowRight, Calendar } from 'lucide-react';
import InsuranceLogos from '@/components/InsuranceLogos';
import LocationFAQ from '@/components/LocationFAQ';
import { locationFAQs } from '@/data/locationFAQs';
import WellnessIcon from '@/components/WellnessIcon';
import heroLocationImage from '@assets/dr-melva-location-hero.webp';
import OptimizedImage from '@/components/OptimizedImage';
import floridaMap from '../assets/florida-map.webp';

const TelepsychiatryFlorida = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Telepsychiatry Florida | Online Psychiatrist (Bilingual) | Healing Minds'
        : 'Telepsiquiatría Florida | Psiquiatra Online (Bilingüe) | Healing Minds',
      description: language === 'en'
        ? 'Access a board-certified psychiatrist from anywhere in Florida. Dr. Melva Reve offers expert telepsychiatry for anxiety, depression & ADHD. Secure & confidential. Book online.'
        : 'Acceda a una psiquiatra certificada desde cualquier lugar de Florida. La Dra. Melva Reve ofrece telepsiquiatría experta para ansiedad, depresión y TDAH. Segura y confidencial. Reserve en línea.',
      keywords: language === 'en'
        ? 'telepsychiatry Florida, online psychiatrist Florida, telehealth psychiatry FL, virtual psychiatrist Florida, telepsiquiatria Florida'
        : 'telepsiquiatría Florida, psiquiatra online Florida, telepsiquiatría FL, psiquiatra virtual Florida',
      lang: language,
      canonical: language === 'en' ? '/telepsychiatry-florida' : '/es/telepsiquiatria-florida'
    };
    updateSEO(seoData);
  }, [language]);

  const content = {
    en: {
      hero: {
        title: "Expert Psychiatric Care from Anywhere in Florida",
        subtitle: "Telepsychiatry Services Throughout Florida",
        description: "At Healing Minds Psychiatry, we believe that access to exceptional mental health care should have no boundaries. Our Telepsychiatry (Telehealth) service eliminates distance and time barriers, connecting you with Dr. Melva Reve from the comfort and privacy of your home, wherever you are in Florida.",
        ctaPrimary: "Schedule Virtual Appointment",
        ctaSecondary: "Call: (239) 423-0272"
      },
      benefits: {
        title: "Why Choose Telepsychiatry?",
        items: [
          {
            icon: MapPin,
            title: "Access from Anywhere in Florida",
            description: "Whether you're in Miami, Orlando, Tampa, or a rural community, connect with a board-certified psychiatrist without the need to travel."
          },
          {
            icon: Clock,
            title: "Convenient & Time-Saving",
            description: "No traffic, no waiting rooms. Our virtual appointments fit your schedule, allowing you to receive care efficiently from home."
          },
          {
            icon: Shield,
            title: "100% Private & Secure",
            description: "HIPAA-compliant platform ensures your sessions are completely confidential and encrypted. Your privacy is our priority."
          },
          {
            icon: Users,
            title: "Continuity of Care",
            description: "Perfect for seasonal residents, college students, or anyone traveling within Florida. Your treatment never gets interrupted."
          }
        ]
      },
      coverage: {
        title: "Statewide Coverage",
        description: "Dr. Melva Reve is licensed to provide telepsychiatry services throughout the entire state of Florida."
      },
      process: {
        title: "How It Works",
        description: "Getting started with telepsychiatry is simple and straightforward.",
        steps: [
          {
            number: "1",
            title: "Book Your Appointment",
            description: "Call us or use our online booking portal to schedule your first virtual consultation."
          },
          {
            number: "2",
            title: "Receive Secure Link",
            description: "You'll get a confirmation email with a unique, HIPAA-compliant video session link."
          },
          {
            number: "3",
            title: "Connect with Dr. Reve",
            description: "At your appointment time, click the link from any device and meet with Dr. Reve in English or Spanish."
          },
          {
            number: "4",
            title: "Ongoing Care",
            description: "Receive prescriptions electronically and schedule follow-ups as needed, all from the comfort of home."
          }
        ]
      },
      services: {
        title: "Complete Psychiatry Services via Telemedicine",
        description: "Our virtual platform allows us to offer our full range of diagnostic and medication management services for adults (18+).",
        list: [
          "Initial Psychiatric Evaluation",
          "Anxiety & Depression Treatment",
          "ADHD Evaluation & Management",
          "PTSD & Trauma Therapy",
          "Bipolar Disorder Treatment",
          "Medication Management & Prescription Renewals"
        ]
      }
    },
    es: {
      hero: {
        title: "Atención Psiquiátrica Experta desde Cualquier Lugar de Florida",
        subtitle: "Servicios de Telepsiquiatría en Toda Florida",
        description: "En Healing Minds Psychiatry, creemos que el acceso a un cuidado de salud mental excepcional no debería tener fronteras. Nuestro servicio de Telepsiquiatría (Telehealth) elimina las barreras de la distancia y el tiempo, conectándote con la Dra. Melva Reve desde la comodidad y privacidad de tu hogar, estés donde estés en Florida.",
        ctaPrimary: "Agendar Cita Virtual",
        ctaSecondary: "Llamar: (239) 423-0272"
      },
      benefits: {
        title: "¿Por Qué Elegir Telepsiquiatría?",
        items: [
          {
            icon: MapPin,
            title: "Acceso desde Cualquier Lugar de Florida",
            description: "Ya sea que esté en Miami, Orlando, Tampa o una comunidad rural, conéctese con una psiquiatra certificada sin necesidad de viajar."
          },
          {
            icon: Clock,
            title: "Conveniente y Ahorra Tiempo",
            description: "Sin tráfico, sin salas de espera. Nuestras citas virtuales se adaptan a su horario, permitiéndole recibir atención eficientemente desde casa."
          },
          {
            icon: Shield,
            title: "100% Privado y Seguro",
            description: "Plataforma compatible con HIPAA garantiza que sus sesiones sean completamente confidenciales y encriptadas. Su privacidad es nuestra prioridad."
          },
          {
            icon: Users,
            title: "Continuidad de la Atención",
            description: "Perfecto para residentes estacionales, estudiantes universitarios o cualquiera que viaje dentro de Florida. Su tratamiento nunca se interrumpe."
          }
        ]
      },
      coverage: {
        title: "Cobertura Estatal",
        description: "La Dra. Melva Reve tiene licencia para proporcionar servicios de telepsiquiatría en todo el estado de Florida."
      },
      process: {
        title: "Cómo Funciona",
        description: "Comenzar con la telepsiquiatría es simple y directo.",
        steps: [
          {
            number: "1",
            title: "Reserve su Cita",
            description: "Llámenos o use nuestro portal de reservas en línea para programar su primera consulta virtual."
          },
          {
            number: "2",
            title: "Reciba Enlace Seguro",
            description: "Recibirá un correo de confirmación con un enlace único de sesión de video compatible con HIPAA."
          },
          {
            number: "3",
            title: "Conéctese con la Dra. Reve",
            description: "A la hora de su cita, haga clic en el enlace desde cualquier dispositivo y reúnase con la Dra. Reve en inglés o español."
          },
          {
            number: "4",
            title: "Atención Continua",
            description: "Reciba recetas electrónicamente y programe seguimientos según sea necesario, todo desde la comodidad de su hogar."
          }
        ]
      },
      services: {
        title: "Servicios Completos de Psiquiatría a través de Telemedicina",
        description: "Nuestra plataforma virtual nos permite ofrecer nuestra gama completa de servicios de diagnóstico y manejo de medicamentos para adultos (18+).",
        list: [
          "Evaluación Psiquiátrica Inicial",
          "Tratamiento de Ansiedad y Depresión",
          "Evaluación y Manejo de TDAH",
          "Terapia de TEPT y Trauma",
          "Tratamiento de Trastorno Bipolar",
          "Manejo de Medicamentos y Renovación de Recetas"
        ]
      }
    }
  };

  const currentContent = content[language];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section - Location Page Style */}
        <section className="pt-20 pb-8 sm:pb-12 lg:pb-16 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Text Content Section - Full Width */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <WellnessIcon size="sm" color="green">
                  <VideoIcon />
                </WellnessIcon>
                <span className="text-green-700 font-body font-semibold text-lg">
                  {currentContent.hero.subtitle}
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-body font-bold text-green-800 mb-6">
                {language === 'en' ? (
                  <>
                    Expert <span className="font-display italic text-green-700">Psychiatric Care</span> from Anywhere in{' '}
                    <span className="font-display italic text-green-700">Florida</span>
                  </>
                ) : (
                  <>
                    Atención <span className="font-display italic text-green-700">Psiquiátrica Experta</span> desde Cualquier Lugar de{' '}
                    <span className="font-display italic text-green-700">Florida</span>
                  </>
                )}
              </h1>

              {/* Hero Image - Dr. Melva */}
              <div className="mb-8">
                <div className="max-w-4xl mx-auto">
                  <div className="w-full aspect-[1200/667] rounded-2xl overflow-hidden shadow-lg">
                    <OptimizedImage
                      src={heroLocationImage}
                      alt="Dr. Melva Reve - Telepsychiatry services throughout Florida"
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
                {currentContent.hero.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-green-800 hover:bg-green-700 text-white font-semibold py-6 px-8 rounded-full inline-flex items-center gap-3 transition-all duration-300"
                  onClick={() => window.location.href = '/contact'}
                  data-testid="button-schedule-virtual"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-green-600">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  {currentContent.hero.ctaPrimary}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-green-800 text-green-800 hover:bg-green-50 font-semibold py-6 px-8 rounded-full inline-flex items-center gap-3"
                  onClick={() => window.location.href = 'tel:+12394230272'}
                  data-testid="button-call-info"
                >
                  {currentContent.hero.ctaSecondary}
                </Button>
              </div>
            </div>

            {/* Feature Tags - Service Page Style */}
            <div className="mt-16">
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-wrap gap-4 justify-center">
                  {[
                    {
                      en: '15+ Years Experience',
                      es: '15+ Años de Experiencia'
                    },
                    {
                      en: 'Board-Certified Psychiatrist',
                      es: 'Psiquiatra Certificada'
                    },
                    {
                      en: 'Bilingual Services',
                      es: 'Servicios Bilingües'
                    },
                    {
                      en: 'Statewide Coverage',
                      es: 'Cobertura Estatal'
                    },
                    {
                      en: 'HIPAA Compliant',
                      es: 'Compatible con HIPAA'
                    },
                    {
                      en: 'Secure Platform',
                      es: 'Plataforma Segura'
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white rounded-full px-5 py-2.5 shadow-md hover:shadow-lg transition-shadow duration-200 border border-green-100">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      <span className="text-gray-700 font-body font-medium text-sm">
                        {language === 'en' ? item.en : item.es}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statewide Coverage Section with Map */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-body font-bold text-green-800 mb-4">
                {currentContent.coverage.title}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                {currentContent.coverage.description}
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="bg-green-50 rounded-3xl p-8 border border-green-100">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                  <img 
                    src={floridaMap}
                    alt="Florida State Map - Telepsychiatry Services Available Statewide"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-green-500 bg-opacity-5"></div>
                  <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 rounded-lg shadow-lg px-4 py-3 border border-green-200">
                    <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                      <VideoIcon className="w-4 h-4" />
                      <span>{language === 'en' ? 'Available Statewide' : 'Disponible en Todo el Estado'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-body font-bold text-green-800 mb-4" data-testid="benefits-title">
                {currentContent.benefits.title}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {currentContent.benefits.items.map((benefit, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 border border-green-100 shadow-sm hover:shadow-md transition-shadow duration-300" data-testid={`benefit-${index}`}>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <WellnessIcon size="md" color="green">
                        <benefit.icon />
                      </WellnessIcon>
                    </div>
                    <div>
                      <h3 className="text-xl font-body font-bold text-green-800 mb-3">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-700 font-body leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-body font-bold text-green-800 mb-4" data-testid="process-title">
                {currentContent.process.title}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed" data-testid="process-description">
                {currentContent.process.description}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {currentContent.process.steps.map((step, index) => (
                <div key={index} className="relative" data-testid={`process-step-${index}`}>
                  <div className="bg-white rounded-2xl p-6 border border-green-100 h-full shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-green-800 text-white flex items-center justify-center text-xl font-bold">
                        {step.number}
                      </div>
                      <h3 className="text-lg font-body font-bold text-green-800">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-700 font-body leading-relaxed text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-body font-bold text-green-800 mb-4" data-testid="services-title">
                {currentContent.services.title}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6 font-body leading-relaxed" data-testid="services-description">
                {currentContent.services.description}
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="bg-green-50 rounded-2xl p-8 border border-green-100">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentContent.services.list.map((service, index) => (
                    <li key={index} className="flex items-start gap-3" data-testid={`service-${index}`}>
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <span className="text-gray-700 font-body leading-relaxed">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Insurance Section */}
        <InsuranceLogos />

        {/* FAQ Section */}
        <LocationFAQ 
          locationFAQs={locationFAQs.telehealth} 
          title={
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-body font-bold text-green-800 mb-8 text-center">
              {language === 'en' ? (
                <>
                  Frequently Asked <span className="font-display italic text-green-700">Questions</span>
                </>
              ) : (
                <>
                  Preguntas <span className="font-display italic text-green-700">Frecuentes</span>
                </>
              )}
            </h2>
          }
        />

        {/* Final CTA Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-green-50 to-green-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-body font-bold text-green-800 mb-4" data-testid="cta-title">
              {language === 'en' ? 'Ready to Get Started?' : '¿Listo para Comenzar?'}
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 mb-8 font-body leading-relaxed" data-testid="cta-description">
              {language === 'en' 
                ? 'Quality mental health care is just a click away.'
                : 'La atención de salud mental de calidad está a solo un clic de distancia.'
              }
            </p>
            <Link href="/contact">
              <Button 
                size="lg"
                className="group inline-flex items-center justify-center gap-3 rounded-full text-xl font-semibold transition-all duration-300 bg-green-800 text-white hover:bg-green-700 px-12 py-8"
                data-testid="button-schedule-final"
              >
                <VideoIcon className="w-6 h-6" />
                <span>{language === 'en' ? 'Schedule Virtual Appointment' : 'Agendar Cita Virtual'}</span>
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TelepsychiatryFlorida;
