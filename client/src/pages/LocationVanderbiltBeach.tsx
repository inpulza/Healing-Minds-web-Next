import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LocationInsuranceLogos from '@/components/LocationInsuranceLogos';
import CharmHealthBooking from '@/components/CharmHealthBooking';
import LocationFAQ from '@/components/LocationFAQ';
import { locationFAQs } from '@/data/locationFAQs';
import { updateSEO, addLocationServiceSchema } from '@/utils/seo';
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
import { Link } from 'wouter';

// Import office photo
import officePhoto from '@assets/doctor-consultation.webp';
import heroLocationImage from '@assets/dr-melva-location-hero.webp';
import OptimizedImage from '@/components/OptimizedImage';

const LocationVanderbiltBeach = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Psychiatrist Vanderbilt Beach FL - Dr. Melva Reve | Healing Minds'
        : 'Psiquiatra Vanderbilt Beach FL - Dra. Melva Reve | Healing Minds',
      description: language === 'en'
        ? 'Dr. Melva Reve serves Vanderbilt Beach, FL. Expert psychiatric care for anxiety, depression, ADHD, PTSD. Call (239) 423-0272 to schedule.'
        : 'La Dra. Melva Reve atiende Vanderbilt Beach, FL. Atención psiquiátrica experta para ansiedad, depresión, TDAH, TEPT. Llame (239) 423-0272 para programar.',
      keywords: language === 'en'
        ? 'psychiatrist Vanderbilt Beach FL, mental health Vanderbilt Beach, Dr Melva Reve Vanderbilt Beach, psychiatric care Vanderbilt Beach FL'
        : 'psiquiatra Vanderbilt Beach FL, salud mental Vanderbilt Beach, Dra Melva Reve Vanderbilt Beach, atención psiquiátrica Vanderbilt Beach FL',
      lang: language,
      canonical: '/locations/psychiatrist-vanderbilt-beach'
    };
    updateSEO(seoData);

    // This schema points to the main MedicalClinic as provider, avoiding conflicts
    const serviceDescription = language === 'en'
      ? 'Expert psychiatric care serving Vanderbilt Beach residents. Dr. Melva Reve provides comprehensive mental health services including anxiety treatment, depression therapy, ADHD evaluation, PTSD treatment, bipolar disorder management, and psychiatric medication management for the Vanderbilt Beach community.'
      : 'Atención psiquiátrica experta para residentes de Vanderbilt Beach. La Dra. Melva Reve proporciona servicios integrales de salud mental incluyendo tratamiento de ansiedad, terapia de depresión, evaluación de TDAH, tratamiento de TEPT, manejo de trastorno bipolar, y manejo de medicamentos psiquiátricos para la comunidad de Vanderbilt Beach.';

    addLocationServiceSchema({
      locationName: 'Vanderbilt Beach',
      description: serviceDescription,
      pageId: 'vanderbilt-beach-location',
      language: language
    });

    return () => {
      // Clean up Service schema when component unmounts
      const serviceSchema = document.querySelector('script[type="application/ld+json"]#vanderbilt-beach-location-service-schema');
      if (serviceSchema) {
        serviceSchema.remove();
        console.log('🧹 Cleaned up Vanderbilt Beach Service schema');
      }
    };
  }, [language]);

  const contentData = {
    en: {
      title: "Visit Our Vanderbilt Beach Location",
      subtitle: "Your mental health journey starts here, serving Vanderbilt Beach, Florida",
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
          description: "Easily accessible from Vanderbilt Beach with ample parking available"
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
      title: "Visite Nuestra Ubicación en Vanderbilt Beach",
      subtitle: "Su viaje de salud mental comienza aquí, sirviendo a Vanderbilt Beach, Florida",
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
          description: "Fácil acceso desde Vanderbilt Beach con amplio estacionamiento disponible"
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
        {/* Hero Section */}
        <section className="pt-20 pb-8 sm:pb-12 lg:pb-16 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative aspect-[18/9] rounded-3xl overflow-hidden border border-blue-200 shadow-2xl">
              <div className="absolute inset-0">
                <OptimizedImage
                  src={heroLocationImage}
                  alt="Dr. Melva Reve serving Vanderbilt Beach - Professional mental health care in a welcoming environment"
                  className="w-full h-full object-cover"
                  width={1200}
                  height={600}
                  priority={true}
                  sizes="(max-width: 640px) 600px, (max-width: 1024px) 800px, 1200px"
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/15 to-transparent" />
              
              <div className="relative h-full flex flex-col items-start justify-start pt-12 px-6 sm:px-12 lg:px-16">
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-blue-100">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-3 h-3 text-blue-600" />
                    </div>
                    <span className="text-gray-700 font-body font-medium text-xs sm:text-sm">
                      {language === 'en' ? 'Serving Vanderbilt Beach' : 'Sirviendo a Vanderbilt Beach'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-blue-100">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3 h-3 text-blue-600" />
                    </div>
                    <span className="text-gray-700 font-body font-medium text-xs sm:text-sm">
                      {language === 'en' ? 'Bilingual Services' : 'Servicios Bilingües'}
                    </span>
                  </div>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-body font-bold text-green-800 mb-4 max-w-3xl">
                  {language === 'en' ? (
                    <>Your Trusted <span className="font-display italic text-green-700">Psychiatrist</span> in Vanderbilt Beach</>
                  ) : (
                    <>Su <span className="font-display italic text-green-700">Psiquiatra</span> de Confianza en Vanderbilt Beach</>
                  )}
                </h1>

                <p className="text-sm md:text-base text-gray-700 mb-6 max-w-md font-body leading-relaxed">
                  {language === 'en' 
                    ? 'Expert mental health care for Vanderbilt Beach residents with bilingual services and comprehensive treatment options.'
                    : 'Atención experta de salud mental para residentes de Vanderbilt Beach con servicios bilingües y opciones de tratamiento integral.'}
                </p>

                <Button
                  size="lg"
                  className="bg-green-800 hover:bg-green-700 text-white font-semibold py-6 px-8 rounded-full inline-flex items-center gap-3 transition-all duration-300 shadow-lg"
                  onClick={() => window.location.href = '/contact'}
                  data-testid="button-schedule-consultation"
                >
                  <Calendar className="w-5 h-5" />
                  {language === 'en' ? 'Schedule Consultation' : 'Programar Consulta'}
                </Button>
              </div>
            </div>

            {/* Stats Tags - Service Page Style */}
            <div className="mt-16">
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-wrap gap-4 justify-center">
                  {[
                    {
                      en: '15+ Years Experience',
                      es: '15+ Años de Experiencia'
                    },
                    {
                      en: 'Bilingual Care Available',
                      es: 'Atención Bilingüe Disponible'
                    },
                    {
                      en: 'Modern Facilities',
                      es: 'Instalaciones Modernas'
                    },
                    {
                      en: 'Serving Vanderbilt Beach',
                      es: 'Sirviendo a Vanderbilt Beach'
                    },
                    {
                      en: 'Insurance Accepted',
                      es: 'Se Acepta Seguro'
                    },
                    {
                      en: 'Same Day Appointments',
                      es: 'Citas el Mismo Día'
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

        {/* Banner Image Section - Service Page Style */}
        <section className="py-16 sm:py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 shadow-lg border border-green-100">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Content Side */}
                <div className="order-2 lg:order-1">
                  <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    {language === 'en' ? 'Serving Vanderbilt Beach' : 'Sirviendo a Vanderbilt Beach'}
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                    {language === 'en' ? (
                      <>Your Healing Journey Starts Here for <span className="font-display italic text-green-700">Vanderbilt Beach</span> Residents</>
                    ) : (
                      <>Su Viaje de Sanación Comienza Aquí para Residentes de <span className="font-display italic text-green-700">Vanderbilt Beach</span></>
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
                    {language === 'en'
                      ? 'Conveniently serving Vanderbilt Beach residents from our Naples location on Tamiami Trail. Our modern facility provides a welcoming, comfortable environment designed specifically for mental health care. Experience compassionate psychiatric treatment that prioritizes your privacy and comfort.'
                      : 'Sirviendo convenientemente a los residentes de Vanderbilt Beach desde nuestra ubicación de Naples en Tamiami Trail. Nuestra instalación moderna proporciona un ambiente acogedor y cómodo diseñado específicamente para el cuidado de la salud mental. Experimente tratamiento psiquiátrico compasivo que prioriza su privacidad y comodidad.'}
                  </p>

                  <Button 
                    className="group inline-flex items-center justify-center gap-3 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 bg-green-700 text-white hover:bg-green-800 px-6 sm:px-8 py-6 sm:py-7"
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
                      src={officePhoto}
                      alt="Dr. Melva Reve serving Vanderbilt Beach - Professional and compassionate mental health care"
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
              {[
                { en: 'Easy Parking Available', es: 'Estacionamiento Fácil Disponible' },
                { en: 'Accessible Location', es: 'Ubicación Accesible' },
                { en: 'Private & Confidential', es: 'Privado y Confidencial' },
                { en: 'Modern Facilities', es: 'Instalaciones Modernas' },
                { en: 'Welcoming Environment', es: 'Ambiente Acogedor' },
                { en: 'Professional Care', es: 'Atención Profesional' }
              ].map((feature, index) => (
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
                    <><span className="font-display italic text-green-700">Services</span> for Vanderbilt Beach Residents</>
                  ) : (
                    <><span className="font-display italic text-green-700">Servicios</span> para Residentes de Vanderbilt Beach</>
                  )}
                </h2>
                <WellnessIcon size="md" color="blue" className="opacity-70">
                  <Heart />
                </WellnessIcon>
              </div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'Comprehensive psychiatric services available for Vanderbilt Beach residents, tailored to meet your mental health needs with compassionate care.'
                  : 'Servicios psiquiátricos integrales disponibles para residentes de Vanderbilt Beach, adaptados para satisfacer sus necesidades de salud mental con atención compasiva.'}
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
                    ? 'Specialized evaluation and treatment for adults and teens to improve focus and daily functioning.'
                    : 'Evaluación especializada y tratamiento para adultos y adolescentes para mejorar el enfoque y funcionamiento diario.',
                  icon: Smile,
                  link: '/services/adhd-treatment'
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
                  {language === 'en'
                    ? 'Our Naples office is conveniently located for Vanderbilt Beach residents. Use these familiar landmarks to find us easily.'
                    : 'Nuestra oficina de Naples está convenientemente ubicada para residentes de Vanderbilt Beach. Use estos puntos de referencia familiares para encontrarnos fácilmente.'}
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
                        {language === 'en' ? 'From Vanderbilt Beach Park' : 'Desde Vanderbilt Beach Park'}
                      </h3>
                      <p className="text-sm text-gray-500 font-body">
                        Beach Recreation Area
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
                          ? 'Exit the beach area and head east on Vanderbilt Beach Rd'
                          : 'Salga del área de playa y diríjase al este por Vanderbilt Beach Rd'}
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-800 font-bold text-xs">2</span>
                      </div>
                      <p className="text-sm text-gray-700 font-body leading-relaxed">
                        {language === 'en'
                          ? 'Turn right on US-41 (Tamiami Trail) and head south'
                          : 'Gire a la derecha en US-41 (Tamiami Trail) y diríjase al sur'}
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-800 font-bold text-xs">3</span>
                      </div>
                      <p className="text-sm text-gray-700 font-body leading-relaxed">
                        {language === 'en'
                          ? 'Our psychiatric practice is at 4760 Tamiami Trl N # 25, on the right side'
                          : 'Nuestra práctica psiquiátrica está en 4760 Tamiami Trl N # 25, del lado derecho'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center gap-2 text-green-700 font-body text-sm font-medium mb-4">
                      <Clock className="w-4 h-4" />
                      <span>{language === 'en' ? '8-10 minutes' : '8-10 minutos'}</span>
                    </div>

                    <Button 
                      className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-3 rounded-full"
                      onClick={() => window.open('https://maps.google.com/?saddr=Vanderbilt+Beach+Park,+Naples,+FL&daddr=4760+Tamiami+Trl+N+%23+25,+Naples,+FL+34103', '_blank')}
                      data-testid="button-directions-beach-park"
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
                        {language === 'en' ? 'From Delnor-Wiggins Pass' : 'Desde Delnor-Wiggins Pass'}
                      </h3>
                      <p className="text-sm text-gray-500 font-body">
                        State Park Beach
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
                          ? 'Take Vanderbilt Dr south to Vanderbilt Beach Rd'
                          : 'Tome Vanderbilt Dr al sur hacia Vanderbilt Beach Rd'}
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-800 font-bold text-xs">2</span>
                      </div>
                      <p className="text-sm text-gray-700 font-body leading-relaxed">
                        {language === 'en'
                          ? 'Turn left (east) and continue to US-41, then turn right south'
                          : 'Gire a la izquierda (este) y continúe hasta US-41, luego gire a la derecha al sur'}
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-800 font-bold text-xs">3</span>
                      </div>
                      <p className="text-sm text-gray-700 font-body leading-relaxed">
                        {language === 'en'
                          ? 'Our mental health office is ahead at 4760 Tamiami Trl N # 25, on the right'
                          : 'Nuestra oficina de salud mental está adelante en 4760 Tamiami Trl N # 25, a la derecha'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center gap-2 text-green-700 font-body text-sm font-medium mb-4">
                      <Clock className="w-4 h-4" />
                      <span>{language === 'en' ? '12-15 minutes' : '12-15 minutos'}</span>
                    </div>

                    <Button 
                      className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-3 rounded-full"
                      onClick={() => window.open('https://maps.google.com/?saddr=Delnor-Wiggins+Pass+State+Park,+Naples,+FL&daddr=4760+Tamiami+Trl+N+%23+25,+Naples,+FL+34103', '_blank')}
                      data-testid="button-directions-wiggins-pass"
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
                        {language === 'en' ? 'From North Naples Area' : 'Desde Área Norte de Naples'}
                      </h3>
                      <p className="text-sm text-gray-500 font-body">
                        Residential Areas
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
                          ? 'From North Naples, take Vanderbilt Beach Rd east toward US-41'
                          : 'Desde el Norte de Naples, tome Vanderbilt Beach Rd este hacia US-41'}
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-800 font-bold text-xs">2</span>
                      </div>
                      <p className="text-sm text-gray-700 font-body leading-relaxed">
                        {language === 'en'
                          ? 'Turn right on US-41 (Tamiami Trail) and head south briefly'
                          : 'Gire a la derecha en US-41 (Tamiami Trail) y diríjase al sur brevemente'}
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
                      <span>{language === 'en' ? '5-8 minutes' : '5-8 minutos'}</span>
                    </div>

                    <Button 
                      className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-3 rounded-full"
                      onClick={() => window.open('https://maps.google.com/?saddr=North+Naples,+FL&daddr=4760+Tamiami+Trl+N+%23+25,+Naples,+FL+34103', '_blank')}
                      data-testid="button-directions-north-naples"
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
                  {language === 'en' ? 'Easy Access for Vanderbilt Beach Residents' : 'Fácil Acceso para Residentes de Vanderbilt Beach'}
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
                            ? 'Located directly on US-41, our Naples psychiatric practice is easily accessible from all Vanderbilt Beach neighborhoods'
                            : 'Ubicada directamente en US-41, nuestra práctica psiquiátrica en Naples es fácilmente accesible desde todos los vecindarios de Vanderbilt Beach'}
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
                            ? 'Free, convenient parking available for all Vanderbilt Beach patients visiting our facility'
                            : 'Estacionamiento gratuito y conveniente disponible para todos los pacientes de Vanderbilt Beach que visiten nuestras instalaciones'}
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
                            ? 'Accessible by public transportation and ride-sharing services from Vanderbilt Beach'
                            : 'Accesible por transporte público y servicios de viajes compartidos desde Vanderbilt Beach'}
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
                    {language === 'en'
                      ? 'Serving Vanderbilt Beach residents with expert psychiatric care at our conveniently located Naples practice. Call (239) 423-0272 for directions or appointment assistance.'
                      : 'Sirviendo a los residentes de Vanderbilt Beach con atención psiquiátrica experta en nuestra práctica convenientemente ubicada en Naples. Llame al (239) 423-0272 para direcciones o asistencia con citas.'}
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
                    <><span className="font-display italic text-green-700">Community</span> Involvement in Vanderbilt Beach</>
                  ) : (
                    <><span className="font-display italic text-green-700">Participación</span> Comunitaria en Vanderbilt Beach</>
                  )}
                </h2>
                <WellnessIcon size="md" color="blue" className="opacity-70">
                  <Users />
                </WellnessIcon>
              </div>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'Mental health is fundamental to building a thriving community. We proudly support Vanderbilt Beach through our psychiatric care services and by recognizing the vital organizations that strengthen our local community fabric.'
                  : 'La salud mental es fundamental para construir una comunidad próspera. Apoyamos con orgullo a Vanderbilt Beach a través de nuestros servicios de atención psiquiátrica y reconociendo las organizaciones vitales que fortalecen el tejido de nuestra comunidad local.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {/* Vanderbilt Beach Residents Association */}
              <div className="rounded-2xl sm:rounded-3xl p-8 transition-all duration-300 hover:shadow-lg flex flex-col h-full bg-green-50 border border-green-100">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-green-100">
                  <Shield className="w-6 h-6 text-green-800" />
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-4 text-green-800">
                  Vanderbilt Beach Residents Association
                </h3>
                
                <p className="text-base font-body leading-relaxed mb-6 flex-grow text-gray-600">
                  {language === 'en'
                    ? 'Community advocacy organization preserving quality of life in Vanderbilt Beach through active resident engagement and environmental stewardship. They work tirelessly to maintain the character and natural beauty of our coastal community while advocating for responsible development.'
                    : 'Organización de defensa comunitaria que preserva la calidad de vida en Vanderbilt Beach a través del compromiso activo de los residentes y la administración ambiental. Trabajan incansablemente para mantener el carácter y la belleza natural de nuestra comunidad costera mientras abogan por el desarrollo responsable.'}
                </p>

                <a
                  href="https://vbra.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto"
                  data-testid="link-vanderbilt-residents"
                >
                  <Button
                    className="group flex items-center justify-start gap-3 rounded-full text-base font-semibold transition-all duration-300 px-6 w-full min-h-[3.5rem] whitespace-normal bg-green-800 text-white hover:bg-green-700"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 self-center bg-green-700">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-left leading-tight flex-1 py-2">
                      {language === 'en' ? 'Visit VBRA Website' : 'Visitar Sitio VBRA'}
                    </span>
                  </Button>
                </a>
              </div>

              {/* Collier Community Foundation */}
              <div className="rounded-2xl sm:rounded-3xl p-8 transition-all duration-300 hover:shadow-lg flex flex-col h-full bg-green-50 border border-green-100">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-green-100">
                  <Heart className="w-6 h-6 text-green-800" />
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-4 text-green-800">
                  Collier Community Foundation
                </h3>
                
                <p className="text-base font-body leading-relaxed mb-6 flex-grow text-gray-600">
                  {language === 'en'
                    ? 'Supporting Collier County nonprofits and community initiatives that serve Vanderbilt Beach and surrounding areas. Their philanthropic leadership helps address critical community needs through strategic grants and partnerships that enhance quality of life for all residents.'
                    : 'Apoyando organizaciones sin fines de lucro e iniciativas comunitarias del Condado de Collier que sirven a Vanderbilt Beach y áreas circundantes. Su liderazgo filantrópico ayuda a abordar las necesidades críticas de la comunidad a través de subvenciones estratégicas y asociaciones que mejoran la calidad de vida de todos los residentes.'}
                </p>

                <a
                  href="https://colliercf.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto"
                  data-testid="link-collier-foundation"
                >
                  <Button
                    className="group flex items-center justify-start gap-3 rounded-full text-base font-semibold transition-all duration-300 px-6 w-full min-h-[3.5rem] whitespace-normal bg-green-800 text-white hover:bg-green-700"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 self-center bg-green-700">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-left leading-tight flex-1 py-2">
                      {language === 'en' ? 'Learn About Their Impact' : 'Conocer Su Impacto'}
                    </span>
                  </Button>
                </a>
              </div>

              {/* Vanderbilt Beach MSTU */}
              <div className="rounded-2xl sm:rounded-3xl p-8 transition-all duration-300 hover:shadow-lg flex flex-col h-full bg-green-50 border border-green-100">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-green-100">
                  <Users className="w-6 h-6 text-green-800" />
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-4 text-green-800">
                  Vanderbilt Beach MSTU
                </h3>
                
                <p className="text-base font-body leading-relaxed mb-6 flex-grow text-gray-600">
                  {language === 'en'
                    ? 'Municipal Services Taxing Unit managing landscaping and community improvements throughout Vanderbilt Beach area. They maintain the beautiful streetscapes, parks, and public spaces that make our community a peaceful and welcoming place for residents and visitors alike.'
                    : 'Unidad de Servicios Municipales que gestiona paisajismo y mejoras comunitarias en toda el área de Vanderbilt Beach. Mantienen los hermosos paisajes urbanos, parques y espacios públicos que hacen de nuestra comunidad un lugar pacífico y acogedor para residentes y visitantes por igual.'}
                </p>

                <a
                  href="https://www.colliercountyfl.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto"
                  data-testid="link-vanderbilt-mstu"
                >
                  <Button
                    className="group flex items-center justify-start gap-3 rounded-full text-base font-semibold transition-all duration-300 px-6 w-full min-h-[3.5rem] whitespace-normal bg-green-800 text-white hover:bg-green-700"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 self-center bg-green-700">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-left leading-tight flex-1 py-2">
                      {language === 'en' ? 'View County Services' : 'Ver Servicios del Condado'}
                    </span>
                  </Button>
                </a>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-16 text-center">
              <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'Just as these organizations strengthen our Vanderbilt Beach community, we are committed to supporting your mental health journey with compassionate, professional psychiatric care.'
                  : 'Así como estas organizaciones fortalecen nuestra comunidad de Vanderbilt Beach, estamos comprometidos a apoyar su viaje de salud mental con atención psiquiátrica compasiva y profesional.'}
              </p>
              <Button 
                className="group inline-flex items-center justify-center gap-3 rounded-full text-base font-semibold transition-all duration-300 bg-green-700 text-white hover:bg-green-800 px-8 py-6"
                onClick={() => window.location.href = '/contact'}
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
                  onClick={() => window.location.href = '/contact'}
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
        <section className="py-16 lg:py-20 bg-white">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Info */}
              <div className="lg:col-span-2 space-y-8">
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
                        ? 'Monday - Friday: 9:00 AM - 5:00 PM\nSaturday: By appointment\nSunday: Closed'
                        : 'Lunes - Viernes: 9:00 AM - 5:00 PM\nSábado: Con cita\nDomingo: Cerrado'}
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
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
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
        <LocationFAQ locationFAQs={locationFAQs.vanderbiltBeach} />
      </main>
      <Footer />
    </div>
  );
};

export default LocationVanderbiltBeach;