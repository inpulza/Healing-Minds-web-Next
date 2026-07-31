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
import { practiceInfo, acceptedInsurance, serviceAreas } from '@/data/content';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import WellnessIcon from '@/components/WellnessIcon';
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

const LocationAveMaria = () => {
  const { language } = useLanguage();

  const local = cityHyperlocal.aveMaria;

  useEffect(() => {
    const seoData = {
      title: local.seo.title[language],
      description: local.seo.description[language],
      keywords: local.seo.keywords[language],
      lang: language,
      canonical: '/locations/psychiatrist-ave-maria'
    };
    updateSEO(seoData);

  }, [language]);

  const contentData = {
    en: {
      title: "Visit Our Ave Maria Location",
      subtitle: "Your mental health journey starts here, serving Ave Maria, Florida",
      addressTitle: "Our Address",
      contactTitle: "Contact Information", 
      hoursTitle: "Office Hours",
      servicesTitle: "Services at This Location",
      insuranceTitle: "Accepted Insurance Plans",
      areaTitle: "Areas We Serve",
      mapTitle: "Find Us on the Map",
      bookNow: "Book Appointment",
      getDirections: "Get Directions",
      callNow: "Call Now",
      features: [
        {
          title: "Convenient Location",
          description: "Easily accessible from Ave Maria with ample parking available"
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
      title: "Visite Nuestra Ubicación en Ave Maria",
      subtitle: "Su viaje de salud mental comienza aquí, sirviendo a Ave Maria, Florida",
      addressTitle: "Nuestra Dirección",
      contactTitle: "Información de Contacto",
      hoursTitle: "Horarios de Oficina", 
      servicesTitle: "Servicios en Esta Ubicación",
      insuranceTitle: "Planes de Seguro Aceptados",
      areaTitle: "Áreas que Servimos",
      mapTitle: "Encuéntrenos en el Mapa",
      bookNow: "Reservar Cita",
      getDirections: "Obtener Direcciones",
      callNow: "Llamar Ahora",
      features: [
        {
          title: "Ubicación Conveniente",
          description: "Fácil acceso desde Ave Maria con amplio estacionamiento disponible"
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
            {/* Mobile Hero */}
            <div className="md:hidden">
              {/* Mobile Image */}
              <div className="relative h-[400px] sm:h-[450px] mb-4 rounded-2xl overflow-hidden">
                <OptimizedImage
                  src={assetUrl(heroLocationImage)}
                  alt="Dr. Melva Reve serving Ave Maria"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: '95% top' }}
                  width={800}
                  height={1000}
                  priority={true}
                  sizes="100vw"
                />
                {/* Mobile Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 z-10 px-4 sm:px-6 py-6 text-center bg-gradient-to-t from-black/60 to-transparent">
                  <div className="max-w-sm mx-auto">
                    <p className="text-2xl sm:text-3xl leading-tight text-white text-center font-body font-bold" data-testid="hero-title-mobile">
                      {language === 'en' ? (
                        <>
                          Your Trusted <span className="font-display italic">Psychiatrist</span> in Ave Maria, FL
                        </>
                      ) : (
                        <>
                          Su <span className="font-display italic">Psiquiatra</span> de Confianza en Ave Maria, FL
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Description */}
              <p className="text-sm text-center font-body text-green-700 mb-4 px-4 max-w-sm mx-auto" data-testid="hero-description-mobile">
                {local.heroDescription[language]}
              </p>

              {/* Mobile Action Buttons */}
              <div className="flex flex-col gap-3 px-4">
                <Button 
                  size="lg" 
                  className="bg-green-800 hover:bg-green-700 text-white font-semibold py-4 sm:py-6 px-4 sm:px-8 rounded-full inline-flex items-center justify-center gap-2 sm:gap-3 w-full text-sm sm:text-base"
                  onClick={() => window.location.href = language === 'en' ? '/contact' : '/es/contacto'}
                  data-testid="button-schedule-consultation-mobile"
                >
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  {language === 'en' ? 'Schedule Consultation' : 'Programar Consulta'}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-green-800 text-green-800 hover:bg-green-50 font-semibold py-4 sm:py-6 px-4 sm:px-8 rounded-full inline-flex items-center justify-center gap-2 sm:gap-3 w-full text-sm sm:text-base"
                  onClick={() => window.open(practiceInfo.googleMapsUrl, '_blank')}
                  data-testid="button-get-directions-mobile"
                >
                  <Navigation className="w-4 h-4 sm:w-5 sm:h-5" />
                  {content.getDirections}
                </Button>
              </div>
            </div>

            {/* Desktop Hero */}
            <div className="hidden md:block">
              <div className="relative aspect-[18/9] rounded-2xl overflow-hidden border border-blue-200">
                <OptimizedImage
                  src={assetUrl(heroLocationImage)}
                  alt="Dr. Melva Reve serving Ave Maria"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  width={1800}
                  height={900}
                  priority={true}
                  sizes="(max-width: 1024px) 100vw, 1800px"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/15 to-transparent"></div>
                
                {/* Content positioned at top */}
                <div className="relative h-full flex items-start px-8 sm:px-12 lg:px-16 pt-12">
                  <div className="max-w-2xl text-left">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-green-100">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-gray-700 font-body font-medium text-xs sm:text-sm">
                          {language === 'en' ? '15+ Years Experience' : '15+ Años de Experiencia'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-green-100">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-gray-700 font-body font-medium text-xs sm:text-sm">
                          {language === 'en' ? 'Bilingual Care' : 'Atención Bilingüe'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-green-100">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-gray-700 font-body font-medium text-xs sm:text-sm">
                          {language === 'en' ? 'Serving Ave Maria' : 'Sirviendo Ave Maria'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-body font-bold text-green-800 mb-5" data-testid="hero-title-desktop">
                      {language === 'en' ? (
                        <>
                          Your Trusted <span className="font-display italic text-green-700">Psychiatrist</span> in{' '}
                          <span className="font-display italic text-green-700">Ave Maria, FL</span>
                        </>
                      ) : (
                        <>
                          Su <span className="font-display italic text-green-700">Psiquiatra</span> de Confianza en{' '}
                          <span className="font-display italic text-green-700">Ave Maria, FL</span>
                        </>
                      )}
                    </h1>
                    
                    {/* Description */}
                    <p className="text-sm md:text-base leading-relaxed font-body text-green-700 max-w-md mb-6" data-testid="hero-description-desktop">
                      {local.heroDescription[language]}
                    </p>
                    
                    {/* CTA Button */}
                    <Button
                      onClick={() => window.location.href = language === 'en' ? '/contact' : '/es/contacto'}
                      className="bg-green-700 hover:bg-green-800 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                      data-testid="button-schedule-consultation-desktop"
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      {language === 'en' ? 'Schedule Consultation' : 'Programar Consulta'}
                    </Button>
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
                    {language === 'en' ? 'Serving Ave Maria' : 'Sirviendo a Ave Maria'}
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                    {language === 'en' ? (
                      <>Your Healing Journey Starts Here for <span className="font-display italic text-green-700">Ave Maria</span> Residents</>
                    ) : (
                      <>Su Viaje de Sanación Comienza Aquí para Residentes de <span className="font-display italic text-green-700">Ave Maria</span></>
                    )}
                  </h2>
                  
                  {/* Key Stats */}
                  <div className="mb-6 sm:mb-8">
                    <div className="text-3xl sm:text-4xl font-bold mb-2 text-green-600">15+</div>
                    <div className="text-gray-600 font-body text-sm sm:text-base">
                      {language === 'en' ? 'Years serving the Southwest Florida community with excellence' : 'Años sirviendo a la comunidad del Suroeste de Florida con excelencia'}
                    </div>
                  </div>

                  <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 font-body leading-relaxed">
                    {local.healingParagraph[language]}
                  </p>

                  <Button 
                    className="group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full text-sm sm:text-lg font-semibold transition-all duration-300 bg-green-700 text-white hover:bg-green-800 px-4 sm:px-8 py-4 sm:py-7"
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
                      alt="Dr. Melva Reve serving Ave Maria - Professional and compassionate mental health care"
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
                    <><span className="font-display italic text-green-700">Services</span> for Ave Maria Residents</>
                  ) : (
                    <><span className="font-display italic text-green-700">Servicios</span> para Residentes de Ave Maria</>
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
                    ? 'Expert care for panic attacks, social anxiety, and generalized anxiety disorder with evidence-based treatments.'
                    : 'Atención experta para ataques de pánico, ansiedad social y trastorno de ansiedad generalizada con tratamientos basados en evidencia.',
                  icon: Brain,
                  link: language === 'en' ? '/services/anxiety-treatment' : '/es/servicios/tratamiento-ansiedad'
                },
                {
                  id: 'depression',
                  title: language === 'en' ? 'Depression Treatment' : 'Tratamiento de Depresión',
                  description: language === 'en'
                    ? 'Comprehensive care for major depression with personalized treatment plans and ongoing support.'
                    : 'Atención integral para depresión mayor con planes de tratamiento personalizados y apoyo continuo.',
                  icon: Sun,
                  link: language === 'en' ? '/services/depression-treatment' : '/es/servicios/tratamiento-depresion'
                },
                {
                  id: 'adhd',
                  title: language === 'en' ? 'ADHD Treatment' : 'Tratamiento de TDAH',
                  description: language === 'en'
                    ? 'Specialized evaluation and treatment for adults 18 and older to improve focus and daily functioning.'
                    : 'Evaluación especializada y tratamiento para adultos de 18 años en adelante para mejorar el enfoque y funcionamiento diario.',
                  icon: Smile,
                  link: language === 'en' ? '/services/adhd-treatment' : '/es/servicios/tratamiento-adhd'
                },
                {
                  id: 'ptsd',
                  title: language === 'en' ? 'PTSD Treatment' : 'Tratamiento de TEPT',
                  description: language === 'en'
                    ? 'Trauma-informed psychiatric care to help you heal and reclaim your life from traumatic experiences.'
                    : 'Atención psiquiátrica informada en trauma para ayudarle a sanar y reclamar su vida de experiencias traumáticas.',
                  icon: Leaf,
                  link: language === 'en' ? '/services/ptsd-treatment' : '/es/servicios/tratamiento-tept'
                },
                {
                  id: 'bipolar',
                  title: language === 'en' ? 'Bipolar Treatment' : 'Tratamiento Bipolar',
                  description: language === 'en'
                    ? 'Expert mood stabilization to help achieve emotional balance and prevent future episodes.'
                    : 'Estabilización experta del ánimo para lograr equilibrio emocional y prevenir episodios futuros.',
                  icon: Heart,
                  link: language === 'en' ? '/services/bipolar-treatment' : '/es/servicios/tratamiento-bipolar'
                },
                {
                  id: 'medication-management',
                  title: language === 'en' ? 'Medication Management' : 'Manejo de Medicamentos',
                  description: language === 'en'
                    ? 'Expert psychiatric medication evaluation, monitoring, and adjustment with comprehensive safety assessments.'
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
                    data-testid={`service-${service.id}`}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 bg-green-100">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-green-800" />
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl font-display font-bold mb-3 sm:mb-4 text-green-800">
                      {service.title}
                    </h3>
                    
                    <p className="text-sm sm:text-base font-body leading-relaxed mb-4 sm:mb-5 flex-grow text-gray-600">
                      {service.description}
                    </p>

                    <p className="text-sm text-green-700 mb-4 sm:mb-6 font-body italic leading-relaxed">
                      {local.serviceNotes[language][index]}
                    </p>

                    <Link href={service.link} className="mt-auto">
                      <Button
                        className="group flex items-center justify-start gap-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 px-4 sm:px-6 w-full min-h-[4rem] sm:min-h-[4.5rem] whitespace-normal bg-green-800 text-white hover:bg-green-700"
                        data-testid={`service-button-${service.id}`}
                      >
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 self-center bg-green-700">
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <span className="text-left leading-tight flex-1 py-2">
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
            
            {/* Service Areas - Enhanced with more features */}
            <div className="mt-16 text-center">
              <h3 className="text-2xl font-display font-bold text-green-800 mb-8">
                {language === 'en' ? (
                  <><span className="font-display italic text-green-700">Areas</span> We Serve</>
                ) : (
                  <><span className="font-display italic text-green-700">Áreas</span> que Servimos</>
                )}
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {serviceAreas.map((area, index) => (
                  <div key={index} className="bg-green-50 rounded-full px-4 py-2 border border-green-200">
                    <span className="text-green-800 font-body text-sm font-medium">{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How to Get Here Section */}
        <section className="py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <WellnessIcon size="md" color="blue" className="opacity-70">
                    <Navigation />
                  </WellnessIcon>
                  <h2 className="text-3xl lg:text-4xl font-body font-bold text-green-800">
                    {language === 'en' ? (
                      <>How to Get <span className="font-display italic text-green-700">Here</span></>
                    ) : (
                      <>Cómo <span className="font-display italic text-green-700">Llegar</span></>
                    )}
                  </h2>
                  <WellnessIcon size="md" color="green" className="opacity-70">
                    <MapPin />
                  </WellnessIcon>
                </div>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                {local.routeIntro[language]}
              </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl sm:rounded-3xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-blue-800" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-green-800 mb-2">
                        {language === 'en' ? 'From Ave Maria University' : 'Desde Ave Maria University'}
                      </h3>
                      <p className="text-sm text-gray-500 font-body">
                        Catholic University Campus
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
                          ? 'Head south on Oil Well Rd toward Immokalee Rd'
                          : 'Diríjase al sur por Oil Well Rd hacia Immokalee Rd'}
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-800 font-bold text-xs">2</span>
                      </div>
                      <p className="text-sm text-gray-700 font-body leading-relaxed">
                        {language === 'en'
                          ? 'Take I-75 South to Exit 105 (Immokalee Rd), then turn right'
                          : 'Tome la I-75 Sur hasta la Salida 105 (Immokalee Rd), luego gire a la derecha'}
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-800 font-bold text-xs">3</span>
                      </div>
                      <p className="text-sm text-gray-700 font-body leading-relaxed">
                        {language === 'en'
                          ? 'Turn right on Tamiami Trail N. Our psychiatric practice is at 4760 Tamiami Trl N # 25'
                          : 'Gire a la derecha en Tamiami Trail N. Nuestra práctica psiquiátrica está en 4760 Tamiami Trl N # 25'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center gap-2 text-green-700 font-body text-sm font-medium mb-4">
                      <Clock className="w-4 h-4" />
                      <span>{language === 'en' ? '22-25 minutes' : '22-25 minutos'}</span>
                    </div>

                    <Button 
                      className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-3 rounded-full"
                      onClick={() => window.open('https://maps.google.com/?saddr=Ave+Maria+University,+Ave+Maria,+FL&daddr=4760+Tamiami+Trl+N+%23+25,+Naples,+FL+34103', '_blank')}
                      data-testid="button-directions-university"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      {language === 'en' ? 'Get Directions' : 'Obtener Direcciones'}
                    </Button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl sm:rounded-3xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-blue-800" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-green-800 mb-2">
                        {language === 'en' ? 'From Ave Maria Town Center' : 'Desde Ave Maria Town Center'}
                      </h3>
                      <p className="text-sm text-gray-500 font-body">
                        Shopping & Services
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
                          ? 'Exit the Town Center and head west on Ave Maria Blvd'
                          : 'Salga del Town Center y diríjase al oeste por Ave Maria Blvd'}
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-800 font-bold text-xs">2</span>
                      </div>
                      <p className="text-sm text-gray-700 font-body leading-relaxed">
                        {language === 'en'
                          ? 'Continue on Oil Well Rd, then take I-75 South to Exit 105'
                          : 'Continúe por Oil Well Rd, luego tome la I-75 Sur hasta la Salida 105'}
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-800 font-bold text-xs">3</span>
                      </div>
                      <p className="text-sm text-gray-700 font-body leading-relaxed">
                        {language === 'en'
                          ? 'Turn right on Tamiami Trail N. Our mental health office is at 4760 Tamiami Trl N # 25'
                          : 'Gire a la derecha en Tamiami Trail N. Nuestra oficina de salud mental está en 4760 Tamiami Trl N # 25'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center gap-2 text-green-700 font-body text-sm font-medium mb-4">
                      <Clock className="w-4 h-4" />
                      <span>{language === 'en' ? '20-23 minutes' : '20-23 minutos'}</span>
                    </div>

                    <Button 
                      className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-3 rounded-full"
                      onClick={() => window.open('https://maps.google.com/?saddr=Ave+Maria+Town+Center,+Ave+Maria,+FL&daddr=4760+Tamiami+Trl+N+%23+25,+Naples,+FL+34103', '_blank')}
                      data-testid="button-directions-town-center"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      {language === 'en' ? 'Get Directions' : 'Obtener Direcciones'}
                    </Button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl sm:rounded-3xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-blue-800" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-green-800 mb-2">
                        {language === 'en' ? 'From Central Ave Maria' : 'Desde Centro de Ave Maria'}
                      </h3>
                      <p className="text-sm text-gray-500 font-body">
                        Residential Area
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
                          ? 'From central Ave Maria, take Oil Well Rd west to I-75 South'
                          : 'Desde el centro de Ave Maria, tome Oil Well Rd oeste hasta I-75 Sur'}
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-800 font-bold text-xs">2</span>
                      </div>
                      <p className="text-sm text-gray-700 font-body leading-relaxed">
                        {language === 'en'
                          ? 'Take Exit 105 (Immokalee Rd) and turn right toward Naples'
                          : 'Tome la Salida 105 (Immokalee Rd) y gire a la derecha hacia Naples'}
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-800 font-bold text-xs">3</span>
                      </div>
                      <p className="text-sm text-gray-700 font-body leading-relaxed">
                        {language === 'en'
                          ? 'GPS: 4760 Tamiami Trail N # 25, Naples, FL 34103 with ample parking'
                          : 'GPS: 4760 Tamiami Trail N # 25, Naples, FL 34103 con amplio estacionamiento'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center gap-2 text-green-700 font-body text-sm font-medium mb-4">
                      <Clock className="w-4 h-4" />
                      <span>{language === 'en' ? '18-22 minutes' : '18-22 minutos'}</span>
                    </div>

                    <Button 
                      className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-3 rounded-full"
                      onClick={() => window.open('https://maps.google.com/?saddr=Ave+Maria,+FL&daddr=4760+Tamiami+Trl+N+%23+25,+Naples,+FL+34103', '_blank')}
                      data-testid="button-directions-central"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      {language === 'en' ? 'Get Directions' : 'Obtener Direcciones'}
                    </Button>
                  </div>
                </div>
              </div>

            </div>

            {/* Additional Info Section */}
            <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 shadow-lg border border-green-100 max-w-4xl mx-auto">
            <h3 className="text-2xl font-display font-bold text-green-800 mb-6">
              {language === 'en' ? 'Easy Access for Ave Maria Residents' : 'Fácil Acceso para Residentes de Ave Maria'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-800 mb-1">
                      {language === 'en' ? 'Convenient Location' : 'Ubicación Conveniente'}
                    </h4>
                    <p className="text-sm text-gray-600 font-body">
                      {language === 'en'
                        ? 'Located directly on US-41, our Naples psychiatric practice is easily accessible from all Ave Maria neighborhoods'
                        : 'Ubicada directamente en US-41, nuestra práctica psiquiátrica en Naples es fácilmente accesible desde todos los vecindarios de Ave Maria'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-800 mb-1">
                      {language === 'en' ? 'Ample Parking' : 'Amplio Estacionamiento'}
                    </h4>
                    <p className="text-sm text-gray-600 font-body">
                      {language === 'en'
                        ? 'Free, convenient parking available for all Ave Maria patients visiting our facility'
                        : 'Estacionamiento gratuito y conveniente disponible para todos los pacientes de Ave Maria que visiten nuestras instalaciones'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-800 mb-1">
                      {language === 'en' ? 'Transit Friendly' : 'Amigable para el Transporte'}
                    </h4>
                    <p className="text-sm text-gray-600 font-body">
                      {language === 'en'
                        ? 'Accessible by public transportation and ride-sharing services from Ave Maria'
                        : 'Accesible por transporte público y servicios de viajes compartidos desde Ave Maria'}
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
                        ? 'Well-marked building with clear signs to help you find our mental health practice easily'
                        : 'Edificio bien marcado con señales claras para ayudarle a encontrar nuestra práctica de salud mental fácilmente'}
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
                    <><span className="font-display italic text-green-700">Community</span> Involvement in Ave Maria</>
                  ) : (
                    <><span className="font-display italic text-green-700">Participación</span> Comunitaria en Ave Maria</>
                  )}
                </h2>
                <WellnessIcon size="md" color="blue" className="opacity-70">
                  <Users />
                </WellnessIcon>
              </div>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'Mental health is fundamental to building a thriving community. We proudly support Ave Maria through our psychiatric care services and by recognizing the vital organizations that strengthen our local community fabric.'
                  : 'La salud mental es fundamental para construir una comunidad próspera. Apoyamos con orgullo a Ave Maria a través de nuestros servicios de atención psiquiátrica y reconociendo las organizaciones vitales que fortalecen el tejido de nuestra comunidad local.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {/* Ave Maria Stewardship Community Development District */}
              <div className="rounded-2xl sm:rounded-3xl p-8 transition-all duration-300 hover:shadow-lg flex flex-col h-full bg-green-50 border border-green-100">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-green-100">
                  <Shield className="w-6 h-6 text-green-800" />
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-4 text-green-800">
                  Ave Maria Stewardship District
                </h3>
                
                <p className="text-base font-body leading-relaxed mb-6 flex-grow text-gray-600">
                  {language === 'en'
                    ? 'Local government entity providing essential infrastructure and community services to Ave Maria residents. This special-purpose district manages water systems, stormwater management, landscaping, and recreational facilities that make Ave Maria a beautiful and functional community.'
                    : 'Entidad gubernamental local que brinda infraestructura esencial y servicios comunitarios a los residentes de Ave Maria. Este distrito de propósito especial gestiona sistemas de agua, manejo de aguas pluviales, paisajismo e instalaciones recreativas que hacen de Ave Maria una comunidad hermosa y funcional.'}
                </p>

                <a
                  href="https://avemariastewardshipcd.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto"
                  data-testid="link-ave-maria-stewardship"
                >
                  <Button
                    className="group flex items-center justify-start gap-3 rounded-full text-base font-semibold transition-all duration-300 px-6 w-full min-h-[3.5rem] whitespace-normal bg-green-800 text-white hover:bg-green-700"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 self-center bg-green-700">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-left leading-tight flex-1 py-2">
                      {language === 'en' ? 'Visit Stewardship District' : 'Visitar Distrito Administrativo'}
                    </span>
                  </Button>
                </a>
              </div>

              {/* Ave Maria Master Association */}
              <div className="rounded-2xl sm:rounded-3xl p-8 transition-all duration-300 hover:shadow-lg flex flex-col h-full bg-green-50 border border-green-100">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-green-100">
                  <Heart className="w-6 h-6 text-green-800" />
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-4 text-green-800">
                  Ave Maria Master Association
                </h3>
                
                <p className="text-base font-body leading-relaxed mb-6 flex-grow text-gray-600">
                  {language === 'en'
                    ? 'Managing community amenities and resident services to enhance the Ave Maria living experience. They coordinate maintenance of common areas, community events, and ensure that the high quality of life standards that make Ave Maria special are preserved for all residents.'
                    : 'Gestionando amenidades comunitarias y servicios para residentes para mejorar la experiencia de vida en Ave Maria. Coordinan el mantenimiento de áreas comunes, eventos comunitarios y se aseguran de que los altos estándares de calidad de vida que hacen especial a Ave Maria se preserven para todos los residentes.'}
                </p>

                <a
                  href="https://avemariamasterassociation.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto"
                  data-testid="link-ave-maria-master-association"
                >
                  <Button
                    className="group flex items-center justify-start gap-3 rounded-full text-base font-semibold transition-all duration-300 px-6 w-full min-h-[3.5rem] whitespace-normal bg-green-800 text-white hover:bg-green-700"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 self-center bg-green-700">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-left leading-tight flex-1 py-2">
                      {language === 'en' ? 'Learn About Community Services' : 'Conocer Servicios Comunitarios'}
                    </span>
                  </Button>
                </a>
              </div>

              {/* Ave Maria Catholic Parish */}
              <div className="rounded-2xl sm:rounded-3xl p-8 transition-all duration-300 hover:shadow-lg flex flex-col h-full bg-green-50 border border-green-100">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-green-100">
                  <Star className="w-6 h-6 text-green-800" />
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-4 text-green-800">
                  Ave Maria Catholic Parish
                </h3>
                
                <p className="text-base font-body leading-relaxed mb-6 flex-grow text-gray-600">
                  {language === 'en'
                    ? 'Central gathering place providing spiritual support and community connections in Ave Maria. This beautiful parish serves as the heart of the community, offering worship services, community outreach programs, and fostering the strong sense of faith and fellowship that defines Ave Maria.'
                    : 'Lugar central de reunión que brinda apoyo espiritual y conexiones comunitarias en Ave Maria. Esta hermosa parroquia sirve como el corazón de la comunidad, ofreciendo servicios de adoración, programas de divulgación comunitaria y fomentando el fuerte sentido de fe y compañerismo que define a Ave Maria.'}
                </p>

                <a
                  href="https://www.avemariaparish.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto"
                  data-testid="link-ave-maria-parish"
                >
                  <Button
                    className="group flex items-center justify-start gap-3 rounded-full text-base font-semibold transition-all duration-300 px-6 w-full min-h-[3.5rem] whitespace-normal bg-green-800 text-white hover:bg-green-700"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 self-center bg-green-700">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-left leading-tight flex-1 py-2">
                      {language === 'en' ? 'Visit Parish Community' : 'Visitar Comunidad Parroquial'}
                    </span>
                  </Button>
                </a>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-16 text-center">
              <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'Just as these organizations strengthen our Ave Maria community, we are committed to supporting your mental health journey with compassionate, professional psychiatric care.'
                  : 'Así como estas organizaciones fortalecen nuestra comunidad de Ave Maria, estamos comprometidos a apoyar su viaje de salud mental con atención psiquiátrica compasiva y profesional.'}
              </p>
              <Button 
                className="group inline-flex items-center justify-center gap-3 rounded-full text-base font-semibold transition-all duration-300 bg-green-700 text-white hover:bg-green-800 px-8 py-6"
                onClick={() => window.location.href = language === 'en' ? '/contact' : '/es/contacto'}
                data-testid="button-schedule-community"
              >
                <Calendar className="w-5 h-5" />
                <span>{language === 'en' ? 'Schedule Your Consultation Today' : 'Programar Su Consulta Hoy'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
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
                  className="group inline-flex items-center justify-center gap-3 rounded-full text-base font-semibold transition-all duration-300 bg-green-700 text-white hover:bg-green-800 px-8 py-6"
                  onClick={() => window.location.href = language === 'en' ? '/contact' : '/es/contacto'}
                  data-testid="button-schedule-after-video"
                >
                  <Calendar className="w-5 h-5" />
                  <span>{language === 'en' ? 'Schedule Your Consultation' : 'Programar Su Consulta'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
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
                      4760 Tamiami Trl N # 25<br />
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
                      Phone: (239) 423-0272<br />
                      Fax: (239) 330-2073
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
                  onClick={() => window.open(`tel:${practiceInfo.phone}`, '_self')}
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
                      {language === 'en' ? 'Book Telehealth' : 'Reservar Telesalud'}
                    </h3>
                    <CharmHealthBooking variant="compact" showDescription={false} className="justify-center" />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <LocationFAQ locationFAQs={locationFAQs.aveMaria} />
      </main>
      <Footer />
    </div>
  );
};

export default LocationAveMaria;
