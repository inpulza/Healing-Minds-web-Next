import { useEffect } from 'react';
import { assetUrl } from '@/lib/asset-url';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LocationInsuranceLogos from '@/components/LocationInsuranceLogos';
import CharmHealthBooking from '@/components/CharmHealthBooking';
import LocationFAQ from '@/components/LocationFAQ';
import { locationFAQs } from '@/data/locationFAQs';
import { updateSEO } from '@/utils/seo';
import { cityHyperlocal } from '@/data/locationHyperlocal';
import { practiceInfo, serviceAreas } from '@/data/content';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import WellnessIcon from '@/components/WellnessIcon';
import { trackLeadConversion } from '@/lib/analytics';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Star, 
  Shield, 
  Heart, 
  Users,
  CheckCircle,
  ArrowRight,
  Navigation,
  Calendar,
  VideoIcon,
  Sun,
  Brain,
  Smile,
  User,
  Leaf
} from 'lucide-react';
import { Link } from '@/lib/navigation';

// Import office photo
import officePhoto from '@assets/doctor-consultation.webp';
import heroLocationImage from '@assets/dr-melva-location-hero.webp';
import OptimizedImage from '@/components/OptimizedImage';

const LocationFortMyers = () => {
  const { language } = useLanguage();

  const local = cityHyperlocal.fortMyers;

  useEffect(() => {
    const seoData = {
      title: local.seo.title[language],
      description: local.seo.description[language],
      keywords: local.seo.keywords[language],
      lang: language,
      canonical: '/locations/psychiatrist-fort-myers'
    };
    updateSEO(seoData);

  }, [language]);

  const contentData = {
    en: {
      title: "Serving Fort Myers from Our Naples Office",
      subtitle: "Your mental health journey starts here, serving Fort Myers, Florida",
      addressTitle: "Our Address",
      contactTitle: "Contact Information", 
      hoursTitle: "Office Hours",
      servicesTitle: "Services for This Community",
      insuranceTitle: "Insurance and Billing Questions",
      areaTitle: "Areas We Serve",
      mapTitle: "Find Us on the Map",
      bookNow: "Book Appointment",
      getDirections: "Get Directions",
      callNow: "Call Now",
      features: [
        {
          title: "Convenient Location",
          description: "Check parking and access details when scheduling"
        },
        {
          title: "Modern Facilities", 
          description: "Comfortable, private setting designed for your peace of mind"
        },
        {
          title: "Bilingual Services",
          description: "Professional care available in both English and Spanish"
        }
      ],
      services: [
        "Anxiety & Depression Treatment",
        "ADHD Evaluation & Management", 
        "PTSD & Trauma Therapy",
        "Bipolar Disorder Treatment",
        "Medication Management",
        "Telehealth Consultations"
      ]
    },
    es: {
      title: "Atención para Fort Myers desde Nuestra Oficina de Naples",
      subtitle: "Su viaje de salud mental comienza aquí, sirviendo a Fort Myers, Florida",
      addressTitle: "Nuestra Dirección",
      contactTitle: "Información de Contacto",
      hoursTitle: "Horarios de Oficina", 
      servicesTitle: "Servicios para Esta Comunidad",
      insuranceTitle: "Preguntas sobre Seguro y Facturación",
      areaTitle: "Áreas que Servimos",
      mapTitle: "Encuéntrenos en el Mapa",
      bookNow: "Reservar Cita",
      getDirections: "Obtener Direcciones",
      callNow: "Llamar Ahora",
      features: [
        {
          title: "Ubicación Conveniente",
          description: "Confirme estacionamiento y acceso al programar"
        },
        {
          title: "Instalaciones Modernas",
          description: "Ambiente cómodo y privado diseñado para su tranquilidad"
        },
        {
          title: "Servicios Bilingües", 
          description: "Atención profesional disponible tanto en inglés como en español"
        }
      ],
      services: [
        "Tratamiento de Ansiedad y Depresión",
        "Evaluación y Manejo de TDAH",
        "Terapia de TEPT y Trauma", 
        "Tratamiento de Trastorno Bipolar",
        "Manejo de Medicamentos",
        "Consultas de Telesalud"
      ]
    }
  };

  const content = contentData[language];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section - Location Page Style */}
        <section className="pt-20 pb-8 sm:pb-12 lg:pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:hidden">
              <div className="relative h-[400px] sm:h-[450px] mb-4 rounded-2xl overflow-hidden">
                <OptimizedImage src={assetUrl(heroLocationImage)} alt="Dr. Melva Reve serving Fort Myers" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: '95% top' }} width={800} height={1000} priority={true} sizes="(max-width: 1024px) 100vw, 1800px" />
                <div className="absolute bottom-0 left-0 right-0 z-10 px-4 sm:px-6 py-6 text-center bg-gradient-to-t from-black/60 to-transparent">
                  <div className="max-w-sm mx-auto">
                    <p className="text-2xl sm:text-3xl leading-tight text-white text-center font-body font-bold" data-testid="hero-title-mobile">
                      {language === 'en' ? (<><span className="font-display italic">Psychiatrist</span> Serving Fort Myers, FL</>) : (<><span className="font-display italic">Psiquiatra</span> para residentes de Fort Myers, FL</>)}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-center font-body text-green-700 mb-4 px-4 max-w-sm mx-auto" data-testid="hero-description-mobile">
                {local.heroDescription[language]}
              </p>
              <div className="flex flex-col gap-3 px-4">
                <Button size="lg" className="bg-green-800 hover:bg-green-700 text-white font-semibold py-6 px-8 rounded-full inline-flex items-center justify-center gap-3 w-full" onClick={() => window.location.href = language === 'en' ? '/contact' : '/es/contacto'} data-testid="button-schedule-consultation-mobile"><Calendar className="w-5 h-5" />{language === 'en' ? 'Schedule Consultation' : 'Programar Consulta'}</Button>
                <Button variant="outline" size="lg" className="border-green-800 text-green-800 hover:bg-green-50 font-semibold py-6 px-8 rounded-full inline-flex items-center justify-center gap-3 w-full" onClick={() => window.open(practiceInfo.googleMapsUrl, '_blank')} data-testid="button-get-directions-mobile"><Navigation className="w-5 h-5" />{content.getDirections}</Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative aspect-[18/9] rounded-2xl overflow-hidden border border-blue-200">
                <OptimizedImage src={assetUrl(heroLocationImage)} alt="Dr. Melva Reve serving Fort Myers" className="absolute inset-0 w-full h-full object-cover object-center" width={1800} height={900} priority={true} sizes="(max-width: 1024px) 100vw, 1800px" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/15 to-transparent"></div>
                <div className="relative h-full flex items-start px-8 sm:px-12 lg:px-16 pt-12">
                  <div className="max-w-2xl text-left">
                    <div className="flex flex-wrap gap-2 mb-6">
                      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-green-100"><div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"><CheckCircle className="w-3 h-3 text-green-600" /></div><span className="text-gray-700 font-body font-medium text-xs sm:text-sm">{language === 'en' ? 'Active Florida License ME165518' : 'Licencia Activa de Florida ME165518'}</span></div>
                      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-green-100"><div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"><CheckCircle className="w-3 h-3 text-green-600" /></div><span className="text-gray-700 font-body font-medium text-xs sm:text-sm">{language === 'en' ? 'Bilingual Care' : 'Atención Bilingüe'}</span></div>
                      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-green-100"><div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"><CheckCircle className="w-3 h-3 text-green-600" /></div><span className="text-gray-700 font-body font-medium text-xs sm:text-sm">{language === 'en' ? 'Serving Fort Myers' : 'Sirviendo Fort Myers'}</span></div>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-body font-bold text-green-800 mb-5" data-testid="hero-title-desktop">
                      {language === 'en' ? (<><span className="font-display italic text-green-700">Psychiatrist</span> Serving{' '}<span className="font-display italic text-green-700">Fort Myers, FL</span></>) : (<><span className="font-display italic text-green-700">Psiquiatra</span> para residentes de{' '}<span className="font-display italic text-green-700">Fort Myers, FL</span></>)}
                    </h1>
                    <p className="text-sm md:text-base leading-relaxed font-body text-green-700 max-w-md mb-6" data-testid="hero-description-desktop">{local.heroDescription[language]}</p>
                    <Button onClick={() => window.location.href = language === 'en' ? '/contact' : '/es/contacto'} className="bg-green-700 hover:bg-green-800 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200" data-testid="button-schedule-consultation-desktop"><Calendar className="w-5 h-5 mr-2" />{language === 'en' ? 'Schedule Consultation' : 'Programar Consulta'}</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Banner Image Section - Service Page Style */}
        <section className="py-16 sm:py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 shadow-lg border border-green-100">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Content Side */}
                <div className="order-2 lg:order-1">
                  <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    {language === 'en' ? 'Serving Fort Myers' : 'Sirviendo a Fort Myers'}
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                    {language === 'en' ? (
                      <>Fort Myers <span className="font-display italic text-green-700">Psychiatrist</span>: Your Path to Wellness</>
                    ) : (
                      <>Psiquiatra Especialista en <span className="font-display italic text-green-700">Fort Myers</span>: Su Camino Hacia el Bienestar</>
                    )}
                  </h2>
                  
                  {/* Key Stats */}
                  <div className="mb-6 sm:mb-8">
                    <div className="text-2xl sm:text-3xl font-bold mb-2 text-green-600">ME165518</div>
                    <div className="text-gray-600 font-body text-sm sm:text-base">
                      {language === 'en' ? 'Active Florida medical license' : 'Licencia médica activa de Florida'}
                    </div>
                  </div>

                  <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 font-body leading-relaxed">
                    {local.healingParagraph[language]}
                  </p>

                  <Button 
                    className="group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 bg-green-700 text-white hover:bg-green-800 px-6 sm:px-8 py-6 sm:py-7"
                    onClick={() => window.open(practiceInfo.googleMapsUrl, '_blank')}
                    data-testid="button-view-location"
                  >
                    <span>{language === 'en' ? 'View Our Location' : 'Ver Nuestra Ubicación'}</span>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 min-w-[2rem] min-h-[2rem] sm:min-w-[2.25rem] sm:min-h-[2.25rem] rounded-full flex items-center justify-center transition-all duration-300 bg-green-600 flex-shrink-0">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  </Button>
                </div>

                {/* Photo Side */}
                <div className="order-1 lg:order-2 flex flex-col h-full">
                  <div className="w-full aspect-[3/4] sm:aspect-[4/5] lg:aspect-[4/5] rounded-xl overflow-hidden bg-gradient-to-br from-green-50 to-green-100">
                    <OptimizedImage
                      src={assetUrl(officePhoto)}
                      alt="Dr. Melva Reve serving Fort Myers - Professional and compassionate mental health care"
                      className="w-full h-full object-cover object-center"
                      width={800}
                      height={600}
                      priority={true}
                      sizes="(max-width: 640px) 400px, (max-width: 1024px) 600px, 800px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Features Badges */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <div className="flex flex-wrap justify-center gap-3">
              {local.featureBadges.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-blue-100">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="text-gray-700 font-body font-medium text-xs sm:text-sm">
                    {language === 'en' ? feature.en : feature.es}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Insurance Logos Section - Moved below fold */}
        <LocationInsuranceLogos />

        {/* Neighborhoods & Communities We Serve */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-body font-bold text-green-800 mb-4">
                {language === 'en' ? (
                  <>Neighborhoods &amp; <span className="font-display italic text-green-700">Communities</span> We Serve</>
                ) : (
                  <>Vecindarios y <span className="font-display italic text-green-700">Comunidades</span> que Atendemos</>
                )}
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                {local.localContext[language]}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {local.neighborhoods[language].map((neighborhood, index) => (
                <div key={index} className="flex items-center gap-2 bg-green-50 rounded-full px-4 py-2 border border-green-100">
                  <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 font-body font-medium text-sm">{neighborhood}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <WellnessIcon size="md" color="green" className="opacity-70">
                  <Brain />
                </WellnessIcon>
                <h2 className="text-4xl lg:text-5xl font-body font-bold text-green-800">
                  {language === 'en' ? (
                    <><span className="font-display italic text-green-700">Mental Health</span> Treatments for Fort Myers</>
                  ) : (
                    <>Tratamientos de <span className="font-display italic text-green-700">Salud Mental</span> para Fort Myers</>
                  )}
                </h2>
                <WellnessIcon size="md" color="blue" className="opacity-70">
                  <Heart />
                </WellnessIcon>
              </div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                {local.servicesIntro[language]}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: 'anxiety',
                  title: language === 'en' ? 'Anxiety Treatment' : 'Tratamiento de Ansiedad',
                  description: language === 'en' 
                    ? 'Specialized anxiety treatment in Naples FL for Fort Myers residents. Expert care for panic attacks, social anxiety, and generalized anxiety disorder with evidence-based treatments.'
                    : 'Tratamiento especializado de ansiedad para residentes de Fort Myers. Atención experta para ataques de pánico, ansiedad social y trastorno de ansiedad generalizada con tratamientos basados en evidencia.',
                  icon: Brain,
                  link: language === 'en' ? '/services/anxiety-treatment' : '/es/servicios/tratamiento-ansiedad'
                },
                {
                  id: 'depression',
                  title: language === 'en' ? 'Depression Treatment' : 'Tratamiento de Depresión',
                  description: language === 'en'
                    ? 'Depression treatment Fort Myers FL with comprehensive care for major depression. Personalized treatment plans and ongoing support designed specifically for the Fort Myers community.'
                    : 'Tratamiento de depresión con atención integral para depresión mayor. Planes de tratamiento personalizados y apoyo continuo diseñados específicamente para la comunidad de Fort Myers.',
                  icon: Sun,
                  link: language === 'en' ? '/services/depression-treatment' : '/es/servicios/tratamiento-depresion'
                },
                {
                  id: 'adhd',
                  title: language === 'en' ? 'ADHD Treatment' : 'Tratamiento de TDAH',
                  description: language === 'en'
                    ? 'ADHD evaluation and treatment Fort Myers FL. Specialized assessment and treatment for adults 18 and older to improve focus and daily functioning with medication management near me.'
                    : 'Evaluación especializada y tratamiento para adultos de 18 años en adelante para mejorar el enfoque y funcionamiento diario.',
                  icon: Smile,
                  link: language === 'en' ? '/services/adhd-treatment' : '/es/servicios/tratamiento-adhd'
                },
                {
                  id: 'ptsd',
                  title: language === 'en' ? 'PTSD Treatment' : 'Tratamiento de TEPT',
                  description: language === 'en'
                    ? 'PTSD treatment near Fort Myers with trauma-informed psychiatric care to help you heal and reclaim your life from traumatic experiences.'
                    : 'Atención psiquiátrica informada en trauma para ayudarle a sanar y reclamar su vida de experiencias traumáticas.',
                  icon: Leaf,
                  link: language === 'en' ? '/services/ptsd-treatment' : '/es/servicios/tratamiento-tept'
                },
                {
                  id: 'bipolar',
                  title: language === 'en' ? 'Bipolar Treatment' : 'Tratamiento Bipolar',
                  description: language === 'en'
                    ? 'Bipolar disorder treatment Fort Myers with expert mood stabilization to help achieve emotional balance and prevent future episodes.'
                    : 'Estabilización experta del ánimo para lograr equilibrio emocional y prevenir episodios futuros.',
                  icon: Heart,
                  link: language === 'en' ? '/services/bipolar-treatment' : '/es/servicios/tratamiento-bipolar'
                },
                {
                  id: 'medication-management',
                  title: language === 'en' ? 'Medication Management' : 'Manejo de Medicamentos',
                  description: language === 'en'
                    ? 'Expert psychiatric medication evaluation, monitoring, and adjustment with comprehensive safety assessments for Fort Myers patients.'
                    : 'Evaluación, monitoreo y ajuste experto de medicamentos psiquiátricos con evaluaciones de seguridad integrales.',
                  icon: User,
                  link: language === 'en' ? '/services/medication-management' : '/es/servicios/manejo-medicamentos'
                }
              ].map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <div
                    key={service.id}
                    className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:shadow-lg flex flex-col h-full bg-white text-green-800 border border-green-100"
                  >
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-green-100">
                      <IconComponent className="w-6 h-6 text-green-800" />
                    </div>
                    
                    <h3 className="text-2xl font-display font-bold mb-4 text-green-800">
                      {service.title}
                    </h3>
                    
                    <p className="text-base font-body leading-relaxed mb-6 flex-grow text-gray-600">
                      {service.description}
                    </p>

                    <p className="text-sm text-green-700 mb-4 sm:mb-6 font-body italic leading-relaxed">
                      {local.serviceNotes[language][index]}
                    </p>

                    <Link href={service.link} className="mt-auto">
                      <Button
                        className="group flex items-center justify-start gap-3 rounded-full text-base font-semibold transition-all duration-300 px-6 w-full min-h-[3.5rem] whitespace-normal bg-green-800 text-white hover:bg-green-700"
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 self-center bg-green-700">
                          <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-left leading-tight flex-1 py-2">
                          {language === 'en' ? 'Learn More' : 'Saber Más'}
                        </span>
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How to Get Here Section - Cómo Llegar */}
        <section className="py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <WellnessIcon size="md" color="blue" className="opacity-70">
                  <Navigation />
                </WellnessIcon>
                <h2 className="text-4xl lg:text-5xl font-body font-bold text-green-800">
                  {language === 'en' ? (
                    <><span className="font-display italic text-green-700">How to Get Here</span> from Fort Myers</>
                  ) : (
                    <><span className="font-display italic text-green-700">Cómo Llegar</span> desde Fort Myers</>
                  )}
                </h2>
                <WellnessIcon size="md" color="green" className="opacity-70">
                  <MapPin />
                </WellnessIcon>
              </div>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto font-body leading-relaxed">
                {local.routeIntro[language]}
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* From Fort Myers Regional Library */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-800" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-green-800 mb-2">
                      {language === 'en' ? 'From Fort Myers Regional Library' : 'Desde la Biblioteca Regional de Fort Myers'}
                    </h3>
                    <p className="text-sm text-gray-500 font-body">
                      Downtown Fort Myers Branch
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6 flex-grow">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-800 font-bold text-xs">1</span>
                    </div>
                    <p className="text-sm text-gray-700 font-body leading-relaxed">
                      {language === 'en'
                        ? 'Follow current directions from the library to I-75 South toward Naples'
                        : 'Siga las indicaciones actuales desde la biblioteca hasta la I-75 Sur hacia Naples'}
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-800 font-bold text-xs">2</span>
                    </div>
                    <p className="text-sm text-gray-700 font-body leading-relaxed">
                      {language === 'en'
                        ? 'Continue south into Collier County, following live directions toward Naples'
                        : 'Continúe hacia el sur hasta el condado de Collier, siguiendo las indicaciones en vivo hacia Naples'}
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-800 font-bold text-xs">3</span>
                    </div>
                    <p className="text-sm text-gray-700 font-body leading-relaxed">
                      {language === 'en'
                        ? 'Follow Pine Ridge Road west to US-41, then turn south to 4760 Tamiami Trl N #25'
                        : 'Siga Pine Ridge Road al oeste hasta US-41 y gire al sur hacia 4760 Tamiami Trl N #25'}
                    </p>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center gap-2 text-green-700 font-body text-sm font-medium mb-4">
                    <Clock className="w-4 h-4" />
                    <span>{local.duration[language]} — {language === 'en' ? 'traffic varies' : 'el tráfico varía'}</span>
                  </div>

                  <Button 
                    className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-3 rounded-full"
                    onClick={() => window.open('https://maps.google.com/?saddr=Fort+Myers+Regional+Library,+Fort+Myers,+FL&daddr=4760+Tamiami+Trl+N+%23+25,+Naples,+FL+34103', '_blank')}
                    data-testid="button-directions-library"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Get Directions' : 'Obtener Direcciones'}
                  </Button>
                </div>
              </div>

              {/* From Edison and Ford Winter Estates */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-800" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-green-800 mb-2">
                      {language === 'en' ? 'From Edison & Ford Winter Estates' : 'Desde Edison & Ford Winter Estates'}
                    </h3>
                    <p className="text-sm text-gray-500 font-body">
                      2350 McGregor Blvd
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6 flex-grow">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-800 font-bold text-xs">1</span>
                    </div>
                    <p className="text-sm text-gray-700 font-body leading-relaxed">
                      {language === 'en'
                        ? 'Follow current directions from the estates to I-75 South toward Naples'
                        : 'Siga las indicaciones actuales desde Edison & Ford Estates hasta la I-75 Sur hacia Naples'}
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-800 font-bold text-xs">2</span>
                    </div>
                    <p className="text-sm text-gray-700 font-body leading-relaxed">
                      {language === 'en'
                        ? 'Continue south into Collier County, following live directions toward Naples'
                        : 'Continúe hacia el sur hasta el condado de Collier, siguiendo las indicaciones en vivo hacia Naples'}
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-800 font-bold text-xs">3</span>
                    </div>
                    <p className="text-sm text-gray-700 font-body leading-relaxed">
                      {language === 'en'
                        ? 'Follow Pine Ridge Road west to US-41, then turn south to 4760 Tamiami Trl N #25'
                        : 'Siga Pine Ridge Road al oeste hasta US-41 y gire al sur hacia 4760 Tamiami Trl N #25'}
                    </p>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center gap-2 text-green-700 font-body text-sm font-medium mb-4">
                    <Clock className="w-4 h-4" />
                    <span>{local.duration[language]} — {language === 'en' ? 'traffic varies' : 'el tráfico varía'}</span>
                  </div>

                  <Button 
                    className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-3 rounded-full"
                    onClick={() => window.open('https://maps.google.com/?saddr=2350+McGregor+Blvd,+Fort+Myers,+FL&daddr=4760+Tamiami+Trl+N+%23+25,+Naples,+FL+34103', '_blank')}
                    data-testid="button-directions-edison-ford"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Get Directions' : 'Obtener Direcciones'}
                  </Button>
                </div>
              </div>

              {/* From Downtown River District */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-800" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-green-800 mb-2">
                      {language === 'en' ? 'From Downtown River District' : 'Desde Downtown River District'}
                    </h3>
                    <p className="text-sm text-gray-500 font-body">
                      Fort Myers Downtown Area
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6 flex-grow">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-800 font-bold text-xs">1</span>
                    </div>
                    <p className="text-sm text-gray-700 font-body leading-relaxed">
                      {language === 'en'
                        ? 'Follow current directions from the River District to I-75 South toward Naples'
                        : 'Siga las indicaciones actuales desde River District hasta la I-75 Sur hacia Naples'}
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-800 font-bold text-xs">2</span>
                    </div>
                    <p className="text-sm text-gray-700 font-body leading-relaxed">
                      {language === 'en'
                        ? 'Continue south into Collier County, following live directions toward Naples'
                        : 'Continúe hacia el sur hasta el condado de Collier, siguiendo las indicaciones en vivo hacia Naples'}
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-800 font-bold text-xs">3</span>
                    </div>
                    <p className="text-sm text-gray-700 font-body leading-relaxed">
                      {language === 'en'
                        ? 'Follow Pine Ridge Road west to US-41, then turn south to 4760 Tamiami Trl N #25'
                        : 'Siga Pine Ridge Road al oeste hasta US-41 y gire al sur hacia 4760 Tamiami Trl N #25'}
                    </p>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center gap-2 text-green-700 font-body text-sm font-medium mb-4">
                    <Clock className="w-4 h-4" />
                    <span>{local.duration[language]} — {language === 'en' ? 'traffic varies' : 'el tráfico varía'}</span>
                  </div>

                  <Button 
                    className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-3 rounded-full"
                    onClick={() => window.open('https://maps.google.com/?saddr=Downtown+Fort+Myers+River+District,+Fort+Myers,+FL&daddr=4760+Tamiami+Trl+N+%23+25,+Naples,+FL+34103', '_blank')}
                    data-testid="button-directions-downtown"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Get Directions' : 'Obtener Direcciones'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Additional Info Section */}
            <div className="mt-16 text-center">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 shadow-lg border border-green-100 max-w-4xl mx-auto">
                <h3 className="text-2xl font-display font-bold text-green-800 mb-6">
                  {language === 'en' ? 'Easy Access for Fort Myers Residents' : 'Fácil Acceso para Residentes de Fort Myers'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-green-800 mb-1">
                          {language === 'en' ? 'Direct Route' : 'Ruta Directa'}
                        </h4>
                        <p className="text-sm text-gray-600 font-body">
                          {language === 'en'
                            ? 'Travel south from Fort Myers toward Naples. The recommended route uses I-75 South, Pine Ridge Road and US-41.'
                            : 'Viaje al sur desde Fort Myers hacia Naples. La ruta recomendada usa la I-75 Sur, Pine Ridge Road y US-41.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-green-800 mb-1">
                          {language === 'en' ? 'Parking and Access Details' : 'Detalles de Estacionamiento y Acceso'}
                        </h4>
                        <p className="text-sm text-gray-600 font-body">
                          {language === 'en'
                            ? 'Check parking and access details with the office when scheduling your visit'
                            : 'Confirme con la oficina los detalles de estacionamiento y acceso al programar su visita'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-green-800 mb-1">
                          {language === 'en' ? 'Plan for Traffic' : 'Planifique el Tráfico'}
                        </h4>
                        <p className="text-sm text-gray-600 font-body">
                          {language === 'en'
                            ? 'The trip is about 40–45 minutes in typical conditions, but the starting point and live traffic can change the estimate.'
                            : 'El trayecto es de unos 40–45 minutos en condiciones típicas, pero el punto de partida y el tráfico pueden cambiar la estimación.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-green-800 mb-1">
                          {language === 'en' ? 'Clear Signage' : 'Señalización Clara'}
                        </h4>
                        <p className="text-sm text-gray-600 font-body">
                          {language === 'en'
                            ? 'Well-marked building with clear signs to help Fort Myers residents find our practice easily'
                            : 'Edificio bien marcado con señales claras para ayudar a los residentes de Fort Myers a encontrar nuestra práctica fácilmente'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-green-100">
                  <p className="text-center text-gray-600 font-body text-sm leading-relaxed">
                    {local.bottomNote[language]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Involvement Section - Participación Comunitaria */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <WellnessIcon size="md" color="green" className="opacity-70">
                  <Heart />
                </WellnessIcon>
                <h2 className="text-4xl lg:text-5xl font-body font-bold text-green-800">
                  {language === 'en' ? (
                    <><span className="font-display italic text-green-700">Independent Local</span> Resources in Fort Myers</>
                  ) : (
                    <><span className="font-display italic text-green-700">Recursos Locales</span> Independientes en Fort Myers</>
                  )}
                </h2>
                <WellnessIcon size="md" color="blue" className="opacity-70">
                  <Users />
                </WellnessIcon>
              </div>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'These independent local resources provide community information and services in Fort Myers. Listings are informational only and do not imply partnership, endorsement, or referral.'
                  : 'Estos recursos locales independientes ofrecen información y servicios comunitarios en Fort Myers. La lista es solo informativa y no implica colaboración, respaldo ni referido.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {/* Harry Chapin Food Bank */}
              <div className="rounded-2xl sm:rounded-3xl p-8 transition-all duration-300 hover:shadow-lg flex flex-col h-full bg-green-50 border border-green-100">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-green-100">
                  <Heart className="w-6 h-6 text-green-800" />
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-4 text-green-800">
                  Harry Chapin Food Bank
                </h3>
                
                <p className="text-base font-body leading-relaxed mb-6 flex-grow text-gray-600">
                  {language === 'en'
                    ? 'Food assistance and hunger-relief resources offered by Harry Chapin Food Bank.'
                    : 'Recursos de asistencia alimentaria y alivio del hambre ofrecidos por Harry Chapin Food Bank.'}
                </p>

                <a
                  href="https://harrychapinfoodbank.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto"
                  data-testid="link-harry-chapin-food-bank"
                >
                  <Button
                    className="group flex items-center justify-start gap-3 rounded-full text-base font-semibold transition-all duration-300 px-6 w-full min-h-[3.5rem] whitespace-normal bg-green-800 text-white hover:bg-green-700"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 self-center bg-green-700">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-left leading-tight flex-1 py-2">
                      {language === 'en' ? 'Visit Official Site' : 'Visitar Sitio Oficial'}
                    </span>
                  </Button>
                </a>
              </div>

              {/* Sidney & Berne Davis Art Center */}
              <div className="rounded-2xl sm:rounded-3xl p-8 transition-all duration-300 hover:shadow-lg flex flex-col h-full bg-green-50 border border-green-100">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-green-100">
                  <Users className="w-6 h-6 text-green-800" />
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-4 text-green-800">
                  Sidney & Berne Davis Art Center
                </h3>
                
                <p className="text-base font-body leading-relaxed mb-6 flex-grow text-gray-600">
                  {language === 'en'
                    ? 'Exhibitions, performances, and arts programs offered by the Sidney & Berne Davis Art Center.'
                    : 'Exhibiciones, presentaciones y programas artísticos ofrecidos por Sidney & Berne Davis Art Center.'}
                </p>

                <a
                  href="https://sbdac.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto"
                  data-testid="link-sidney-berne-davis"
                >
                  <Button
                    className="group flex items-center justify-start gap-3 rounded-full text-base font-semibold transition-all duration-300 px-6 w-full min-h-[3.5rem] whitespace-normal bg-green-800 text-white hover:bg-green-700"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 self-center bg-green-700">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-left leading-tight flex-1 py-2">
                      {language === 'en' ? 'Explore Arts Programs' : 'Explorar Programas de Arte'}
                    </span>
                  </Button>
                </a>
              </div>

              {/* ACT (Abuse Counseling & Treatment) */}
              <div className="rounded-2xl sm:rounded-3xl p-8 transition-all duration-300 hover:shadow-lg flex flex-col h-full bg-green-50 border border-green-100">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-green-100">
                  <Heart className="w-6 h-6 text-green-800" />
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-4 text-green-800">
                  ACT (Abuse Counseling & Treatment)
                </h3>
                
                <p className="text-base font-body leading-relaxed mb-6 flex-grow text-gray-600">
                  {language === 'en'
                    ? 'Official information about services and resources for survivors of domestic violence and sexual assault.'
                    : 'Información oficial sobre servicios y recursos para sobrevivientes de violencia doméstica y agresión sexual.'}
                </p>

                <a
                  href="https://www.actabuse.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto"
                  data-testid="link-act-abuse-counseling"
                >
                  <Button
                    className="group flex items-center justify-start gap-3 rounded-full text-base font-semibold transition-all duration-300 px-6 w-full min-h-[3.5rem] whitespace-normal bg-green-800 text-white hover:bg-green-700"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 self-center bg-green-700">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-left leading-tight flex-1 py-2">
                      {language === 'en' ? 'Visit Official Site' : 'Visitar Sitio Oficial'}
                    </span>
                  </Button>
                </a>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-16 text-center">
              <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'Healing Minds provides psychiatric care for adults in Fort Myers through telepsychiatry and appointments at our Naples office.'
                  : 'Healing Minds ofrece atención psiquiátrica para adultos de Fort Myers mediante telepsiquiatría y citas en nuestra oficina de Naples.'}
              </p>
              <Button 
                className="group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 bg-green-700 text-white hover:bg-green-800 px-4 sm:px-8 py-4 sm:py-6"
                onClick={() => window.location.href = language === 'en' ? '/contact' : '/es/contacto'}
                data-testid="button-schedule-community"
              >
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{language === 'en' ? 'Schedule Your Consultation Today' : 'Programar Su Consulta Hoy'}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </div>
          </div>
        </section>

        {/* Video Section - A Conversation with Dr. Reve */}
        <section className="py-16 lg:py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 shadow-lg border">
              {/* Encabezado de sección */}
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6" data-testid="video-section-title">
                  {language === 'en' 
                    ? <>A <span className="font-display italic text-green-700">Conversation</span> with Dr. Reve</>
                    : <>Una <span className="font-display italic text-green-700">Conversación</span> con la Dra. Reve</>
                  }
                </h2>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto font-body leading-relaxed">
                  {language === 'en'
                    ? 'Get to know me through these educational videos where I share insights about mental health.'
                    : 'Conóceme a través de estos videos educativos donde comparto conocimientos sobre salud mental.'
                  }
                </p>
              </div>


              {/* Contact CTA */}
              <div className="text-center mt-12">
                <Button 
                  className="group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 bg-green-700 text-white hover:bg-green-800 px-4 sm:px-8 py-4 sm:py-6"
                  onClick={() => window.location.href = language === 'en' ? '/contact' : '/es/contacto'}
                  data-testid="button-schedule-after-video"
                >
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{language === 'en' ? 'Schedule Your Consultation' : 'Programar Su Consulta'}</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </div>
            </div>
          </div>
        </section>


        {/* Contact Information Section */}
        <section className="py-16 lg:py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {language === 'en' ? (
                  <><span className="font-display italic text-green-700">Contact</span> Information</>
                ) : (
                  <><span className="font-display italic text-green-700">Información</span> de Contacto</>
                )}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'Ready to take the first step? Reach out today to schedule your consultation.'
                  : '¿Listo para dar el primer paso? Póngase en contacto hoy para programar su consulta.'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="lg:col-span-1 space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-green-800" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-green-800 mb-2">
                      {content.addressTitle}
                    </h3>
                    <p className="text-gray-600 font-body leading-relaxed">
                      4760 Tamiami Trl N #25<br />
                      Naples, FL 34103
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-green-800" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-green-800 mb-2">
                      {content.contactTitle}
                    </h3>
                    <p className="text-gray-600 font-body leading-relaxed">
                      Phone: (239) 423-0272
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-green-800" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-green-800 mb-2">
                      {content.hoursTitle}
                    </h3>
                    <p className="text-gray-600 font-body leading-relaxed">
                      {language === 'en' 
                        ? 'Monday - Friday: 8:00 AM - 5:00 PM\nSaturday: Closed\nSunday: Closed'
                        : 'Lunes - Viernes: 8:00 AM - 5:00 PM\nSábado: Cerrado\nDomingo: Cerrado'}
                    </p>
                  </div>
                </div>

                <Button 
                  variant="outline"
                  className="border-green-800 text-green-800 hover:bg-green-50"
                  onClick={() => {
                    trackLeadConversion('phone_call', { click_location: 'fort_myers_final_cta' });
                    window.open(`tel:${practiceInfo.phone}`, '_self');
                  }}
                  data-testid="button-call-now"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {content.callNow}
                </Button>
              </div>

              {/* Telehealth Booking */}
              <div className="lg:col-span-1">
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 lg:sticky lg:top-24">
                  <div className="text-center space-y-4">
                    <VideoIcon className="w-8 h-8 text-blue-600 mx-auto" />
                    <h3 className="text-lg font-bold text-blue-800">
                      {language === 'en' ? 'Request Telehealth' : 'Solicitar Telesalud'}
                    </h3>
                    <CharmHealthBooking variant="compact" showDescription={false} className="justify-center" />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <LocationFAQ locationFAQs={locationFAQs.fortMyers} />
      </main>
      <Footer />
    </div>
  );
};

export default LocationFortMyers;
