import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LocationInsuranceLogos from '@/components/LocationInsuranceLogos';
import CharmHealthBooking from '@/components/CharmHealthBooking';
import CompactVideoCarousel from '@/components/CompactVideoCarousel';
import Reviews from '@/components/Reviews';
import GoogleMapsEmbed from '@/components/GoogleMapsEmbed';
import { updateSEO } from '@/utils/seo';
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

const LocationNaples = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Psychiatrist Naples FL - Dr. Melva Reve Location | Healing Minds'
        : 'Psiquiatra Naples FL - Ubicación Dra. Melva Reve | Healing Minds',
      description: language === 'en'
        ? 'Visit Dr. Melva Reve in Naples, FL at 4760 Tamiami Trl N # 25. Expert psychiatric care for anxiety, depression, ADHD, PTSD. Call (239) 423-0272 to schedule.'
        : 'Visite a la Dra. Melva Reve en Naples, FL en 4760 Tamiami Trl N # 25. Atención psiquiátrica experta para ansiedad, depresión, TDAH, TEPT. Llame (239) 423-0272 para programar.',
      keywords: language === 'en'
        ? 'psychiatrist Naples FL location, 4760 Tamiami Trail Naples # 25, psychiatric office Naples, Dr Melva Reve address, mental health Naples FL'
        : 'ubicación psiquiatra Naples FL, 4760 Tamiami Trail Naples # 25, consultorio psiquiátrico Naples, dirección Dra Melva Reve, salud mental Naples FL',
      lang: language,
      canonical: '/locations/psychiatrist-naples'
    };
    updateSEO(seoData);

    // Schema already managed by App.tsx to avoid duplication

    return () => {
      // No cleanup needed
    };
  }, [language]);

  const contentData = {
    en: {
      title: "Visit Our Naples Location",
      subtitle: "Your mental health journey starts here in the heart of Naples, Florida",
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
          description: "Easy access from major roads in Naples with ample parking available"
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
      title: "Visite Nuestra Ubicación en Naples",
      subtitle: "Su viaje de salud mental comienza aquí en el corazón de Naples, Florida",
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
          description: "Fácil acceso desde las principales carreteras de Naples con amplio estacionamiento disponible"
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
        {/* Hero Section - Service Page Style */}
        <section className="pt-20 pb-8 sm:pb-12 lg:pb-16 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Text Content Section - Full Width */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <WellnessIcon size="sm" color="blue">
                  <MapPin />
                </WellnessIcon>
                <span className="text-blue-700 font-body font-semibold text-lg">
                  {language === 'en' ? 'Find Us in Naples' : 'Encuéntranos en Naples'}
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-body font-bold text-green-800 mb-6">
                {language === 'en' ? (
                  <>
                    Your Trusted <span className="font-display italic text-green-700">Psychiatrist</span> in{' '}
                    <span className="font-display italic text-green-700">Naples, FL</span>
                  </>
                ) : (
                  <>
                    Su <span className="font-display italic text-green-700">Psiquiatra</span> de Confianza en{' '}
                    <span className="font-display italic text-green-700">Naples, FL</span>
                  </>
                )}
              </h1>

              {/* Hero Image - Dr. Melva at Practice */}
              <div className="mb-8">
                <div className="max-w-4xl mx-auto">
                  <div className="w-full aspect-[1200/667] rounded-2xl overflow-hidden shadow-lg">
                    <OptimizedImage
                      src={heroLocationImage}
                      alt="Dr. Melva Reve at her Naples psychiatric practice - Professional mental health care in a welcoming environment"
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
                {language === 'en' 
                  ? 'Discover our conveniently located psychiatric practice in the heart of Naples, Florida. Expert mental health care with bilingual services, modern facilities, and comprehensive treatment options for anxiety, depression, ADHD, PTSD, and more.'
                  : 'Descubra nuestra práctica psiquiátrica convenientemente ubicada en el corazón de Naples, Florida. Atención experta de salud mental con servicios bilingües, instalaciones modernas y opciones de tratamiento integral para ansiedad, depresión, TDAH, TEPT y más.'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-green-800 hover:bg-green-700 text-white font-semibold py-6 px-8 rounded-full inline-flex items-center gap-3 transition-all duration-300"
                  onClick={() => window.location.href = '/contact'}
                  data-testid="button-schedule-consultation"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-green-600">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  {language === 'en' ? 'Schedule Consultation' : 'Programar Consulta'}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-green-800 text-green-800 hover:bg-green-50 font-semibold py-6 px-8 rounded-full inline-flex items-center gap-3"
                  onClick={() => window.open(practiceInfo.googleMapsUrl, '_blank')}
                  data-testid="button-get-directions"
                >
                  <Navigation className="w-5 h-5" />
                  {content.getDirections}
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
                      en: 'Convenient Naples Location',
                      es: 'Ubicación Conveniente en Naples'
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
                    {language === 'en' ? 'Premium Location' : 'Ubicación Premium'}
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                    {language === 'en' ? (
                      <>Your Healing Journey Starts at Our <span className="font-display italic text-green-700">Naples</span> Office</>
                    ) : (
                      <>Su Viaje de Sanación Comienza en Nuestra Oficina de <span className="font-display italic text-green-700">Naples</span></>
                    )}
                  </h2>
                  
                  {/* Key Stats */}
                  <div className="mb-6 sm:mb-8">
                    <div className="text-3xl sm:text-4xl font-bold mb-2 text-green-600">15+</div>
                    <div className="text-gray-600 font-body text-sm sm:text-base">
                      {language === 'en' ? 'Years serving the Naples community with excellence' : 'Años sirviendo a la comunidad de Naples con excelencia'}
                    </div>
                  </div>

                  <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 font-body leading-relaxed">
                    {language === 'en'
                      ? 'Located in the heart of Naples on Tamiami Trail, our modern facility provides a welcoming, comfortable environment designed specifically for mental health care. Experience compassionate psychiatric treatment in a setting that prioritizes your privacy and comfort.'
                      : 'Ubicado en el corazón de Naples en Tamiami Trail, nuestra instalación moderna proporciona un ambiente acogedor y cómodo diseñado específicamente para el cuidado de la salud mental. Experimente tratamiento psiquiátrico compasivo en un entorno que prioriza su privacidad y comodidad.'}
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

                  {/* Features Grid - moved below button */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                    {[
                      { en: 'Easy Parking Available', es: 'Estacionamiento Fácil Disponible' },
                      { en: 'Accessible Location', es: 'Ubicación Accesible' },
                      { en: 'Private & Confidential', es: 'Privado y Confidencial' },
                      { en: 'Modern Facilities', es: 'Instalaciones Modernas' },
                      { en: 'Welcoming Environment', es: 'Ambiente Acogedor' },
                      { en: 'Professional Care', es: 'Atención Profesional' }
                    ].map((feature, index) => (
                      <div key={index} className="p-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700 font-body text-sm">{language === 'en' ? feature.en : feature.es}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Photo Side */}
                <div className="order-1 lg:order-2 flex flex-col h-full">
                  <div className="w-full aspect-[3/4] sm:aspect-[4/5] lg:aspect-[4/5] rounded-xl overflow-hidden bg-gradient-to-br from-green-50 to-green-100">
                    <OptimizedImage
                      src={officePhoto}
                      alt="Dr. Melva Reve at her Naples psychiatric practice - Professional and compassionate mental health care"
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
                    <><span className="font-display italic text-green-700">Services</span> at This Location</>
                  ) : (
                    <><span className="font-display italic text-green-700">Servicios</span> en Esta Ubicación</>
                  )}
                </h2>
                <WellnessIcon size="md" color="blue" className="opacity-70">
                  <Heart />
                </WellnessIcon>
              </div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'Comprehensive psychiatric services available at our Naples location, tailored to meet your mental health needs with compassionate care.'
                  : 'Servicios psiquiátricos integrales disponibles en nuestra ubicación de Naples, adaptados para satisfacer sus necesidades de salud mental con atención compasiva.'}
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
                    ? 'Our Naples office is conveniently located in the heart of the city. Use these familiar landmarks to find us easily.'
                    : 'Nuestra oficina de Naples está convenientemente ubicada en el corazón de la ciudad. Use estos puntos de referencia familiares para encontrarnos fácilmente.'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* From Naples Pier */}
                <div className="bg-white rounded-2xl sm:rounded-3xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-blue-800" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-green-800 mb-2">
                        {language === 'en' ? 'From Naples Pier' : 'Desde Naples Pier'}
                      </h3>
                      <p className="text-sm text-gray-500 font-body">
                        Downtown Naples
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
                          ? 'From the Naples Pier at 25 12th Ave S, head east toward 5th Avenue S'
                          : 'Desde Naples Pier en 25 12th Ave S, diríjase al este hacia 5th Avenue S'}
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-800 font-bold text-xs">2</span>
                      </div>
                      <p className="text-sm text-gray-700 font-body leading-relaxed">
                        {language === 'en'
                          ? 'Turn left on US-41 (Tamiami Trail) and head north for about 3 miles'
                          : 'Gire a la izquierda en US-41 (Tamiami Trail) y diríjase al norte aproximadamente 3 millas'}
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
                      <span>{language === 'en' ? '8-12 minutes' : '8-12 minutos'}</span>
                    </div>

                    <Button 
                      className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-3 rounded-full"
                      onClick={() => window.open('https://maps.google.com/?saddr=Naples+Pier,+Naples,+FL&daddr=4760+Tamiami+Trl+N+%23+25,+Naples,+FL+34103', '_blank')}
                      data-testid="button-directions-pier"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      {language === 'en' ? 'Get Directions' : 'Obtener Direcciones'}
                    </Button>
                  </div>
                </div>

                {/* From Naples Municipal Airport */}
                <div className="bg-white rounded-2xl sm:rounded-3xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-blue-800" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-green-800 mb-2">
                        {language === 'en' ? 'From Naples Municipal Airport' : 'Desde Aeropuerto Municipal Naples'}
                      </h3>
                      <p className="text-sm text-gray-500 font-body">
                        Airport Access
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
                          ? 'Exit the airport and head west on Airport Pulling Road toward US-41'
                          : 'Salga del aeropuerto y diríjase al oeste por Airport Pulling Road hacia US-41'}
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-800 font-bold text-xs">2</span>
                      </div>
                      <p className="text-sm text-gray-700 font-body leading-relaxed">
                        {language === 'en'
                          ? 'Turn right on US-41 (Tamiami Trail) and head north for about 2 miles'
                          : 'Gire a la derecha en US-41 (Tamiami Trail) y diríjase al norte aproximadamente 2 millas'}
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-800 font-bold text-xs">3</span>
                      </div>
                      <p className="text-sm text-gray-700 font-body leading-relaxed">
                        {language === 'en'
                          ? 'Look for our mental health practice at 4760 Tamiami Trl N # 25, on the right'
                          : 'Busque nuestra práctica de salud mental en 4760 Tamiami Trl N # 25, a la derecha'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center gap-2 text-green-700 font-body text-sm font-medium mb-4">
                      <Clock className="w-4 h-4" />
                      <span>{language === 'en' ? '6-8 minutes' : '6-8 minutos'}</span>
                    </div>

                    <Button 
                      className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-3 rounded-full"
                      onClick={() => window.open('https://maps.google.com/?saddr=Naples+Municipal+Airport,+Naples,+FL&daddr=4760+Tamiami+Trl+N+%23+25,+Naples,+FL+34103', '_blank')}
                      data-testid="button-directions-airport"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      {language === 'en' ? 'Get Directions' : 'Obtener Direcciones'}
                    </Button>
                  </div>
                </div>

                {/* From Waterside Shops */}
                <div className="bg-white rounded-2xl sm:rounded-3xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-blue-800" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-green-800 mb-2">
                        {language === 'en' ? 'From Waterside Shops' : 'Desde Waterside Shops'}
                      </h3>
                      <p className="text-sm text-gray-500 font-body">
                        Shopping District
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
                          ? 'From Waterside Shops at 5415 Tamiami Trail N, head north on US-41'
                          : 'Desde Waterside Shops en 5415 Tamiami Trail N, diríjase al norte por US-41'}
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-800 font-bold text-xs">2</span>
                      </div>
                      <p className="text-sm text-gray-700 font-body leading-relaxed">
                        {language === 'en'
                          ? 'Continue north on Tamiami Trail for approximately 1.5 miles past Pine Ridge Road'
                          : 'Continúe al norte por Tamiami Trail aproximadamente 1.5 millas pasando Pine Ridge Road'}
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-800 font-bold text-xs">3</span>
                      </div>
                      <p className="text-sm text-gray-700 font-body leading-relaxed">
                        {language === 'en'
                          ? 'Our office is at 4760 Tamiami Trl N # 25, on the right side just before Immokalee Road'
                          : 'Nuestra oficina está en 4760 Tamiami Trl N # 25, del lado derecho justo antes de Immokalee Road'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center gap-2 text-green-700 font-body text-sm font-medium mb-4">
                      <Clock className="w-4 h-4" />
                      <span>{language === 'en' ? '4-6 minutes' : '4-6 minutos'}</span>
                    </div>

                    <Button 
                      className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-3 rounded-full"
                      onClick={() => window.open('https://maps.google.com/?saddr=Waterside+Shops,+Naples,+FL&daddr=4760+Tamiami+Trl+N+%23+25,+Naples,+FL+34103', '_blank')}
                      data-testid="button-directions-waterside"
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
                  {language === 'en' ? 'Easy Access for Naples Residents' : 'Fácil Acceso para Residentes de Naples'}
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
                            ? 'Located directly on US-41, our Naples psychiatric practice is easily accessible from all Naples neighborhoods'
                            : 'Ubicada directamente en US-41, nuestra práctica psiquiátrica en Naples es fácilmente accesible desde todos los vecindarios de Naples'}
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
                            ? 'Free, convenient parking available for all Naples patients visiting our facility'
                            : 'Estacionamiento gratuito y conveniente disponible para todos los pacientes de Naples que visiten nuestras instalaciones'}
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
                            ? 'Accessible by public transportation and ride-sharing services from Naples'
                            : 'Accesible por transporte público y servicios de viajes compartidos desde Naples'}
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
                      ? 'Serving Naples residents with expert psychiatric care at our conveniently located Naples practice. Call (239) 423-0272 for directions or appointment assistance.'
                      : 'Sirviendo a los residentes de Naples con atención psiquiátrica experta en nuestra práctica convenientemente ubicada en Naples. Llame al (239) 423-0272 para direcciones o asistencia con citas.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Involvement Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <WellnessIcon size="md" color="green" className="opacity-70">
                  <Heart />
                </WellnessIcon>
                <h2 className="text-4xl lg:text-5xl font-body font-bold text-green-800">
                  {language === 'en' ? (
                    <><span className="font-display italic text-green-700">Community</span> Involvement in Naples</>
                  ) : (
                    <><span className="font-display italic text-green-700">Participación</span> Comunitaria en Naples</>
                  )}
                </h2>
                <WellnessIcon size="md" color="blue" className="opacity-70">
                  <Users />
                </WellnessIcon>
              </div>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'Mental health is fundamental to building a thriving community. We proudly support Naples through our psychiatric care services and by recognizing the vital organizations that enhance our vibrant city.'
                  : 'La salud mental es fundamental para construir una comunidad próspera. Apoyamos con orgullo a Naples a través de nuestros servicios de atención psiquiátrica y reconociendo las organizaciones vitales que mejoran nuestra ciudad vibrante.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {/* Naples Botanical Garden */}
              <div className="rounded-2xl sm:rounded-3xl p-8 transition-all duration-300 hover:shadow-lg flex flex-col h-full bg-green-50 border border-green-100">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-green-100">
                  <Heart className="w-6 h-6 text-green-800" />
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-4 text-green-800">
                  Naples Botanical Garden
                </h3>
                
                <p className="text-base font-body leading-relaxed mb-6 flex-grow text-gray-600">
                  {language === 'en'
                    ? 'A 170-acre world-class botanical paradise that promotes the connection between people and plants. Their therapeutic gardens, wellness programs, and mindfulness initiatives support mental health and community well-being, serving over 400,000 visitors annually.'
                    : 'Un paraíso botánico de clase mundial de 170 acres que promueve la conexión entre las personas y las plantas. Sus jardines terapéuticos, programas de bienestar e iniciativas de mindfulness apoyan la salud mental y el bienestar comunitario, sirviendo a más de 400,000 visitantes anualmente.'}
                </p>

                <a
                  href="https://www.naplesgarden.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto"
                  data-testid="link-botanical-garden"
                >
                  <Button
                    className="group flex items-center justify-start gap-3 rounded-full text-base font-semibold transition-all duration-300 px-6 w-full min-h-[3.5rem] whitespace-normal bg-green-800 text-white hover:bg-green-700"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 self-center bg-green-700">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-left leading-tight flex-1 py-2">
                      {language === 'en' ? 'Visit Botanical Garden' : 'Visitar Jardín Botánico'}
                    </span>
                  </Button>
                </a>
              </div>

              {/* United Way of Collier County */}
              <div className="rounded-2xl sm:rounded-3xl p-8 transition-all duration-300 hover:shadow-lg flex flex-col h-full bg-green-50 border border-green-100">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-green-100">
                  <Users className="w-6 h-6 text-green-800" />
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-4 text-green-800">
                  United Way of Collier County
                </h3>
                
                <p className="text-base font-body leading-relaxed mb-6 flex-grow text-gray-600">
                  {language === 'en'
                    ? 'For over 50 years, United Way has strengthened our Naples community by funding programs that address critical needs. They support mental health initiatives, education, and family stability programs that create lasting change for over 75,000 residents annually.'
                    : 'Por más de 50 años, United Way ha fortalecido nuestra comunidad de Naples financiando programas que abordan necesidades críticas. Apoyan iniciativas de salud mental, educación y programas de estabilidad familiar que crean cambios duraderos para más de 75,000 residentes anualmente.'}
                </p>

                <a
                  href="https://www.unitedwayofc.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto"
                  data-testid="link-united-way"
                >
                  <Button
                    className="group flex items-center justify-start gap-3 rounded-full text-base font-semibold transition-all duration-300 px-6 w-full min-h-[3.5rem] whitespace-normal bg-green-800 text-white hover:bg-green-700"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 self-center bg-green-700">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-left leading-tight flex-1 py-2">
                      {language === 'en' ? 'Learn About Their Mission' : 'Conocer Su Misión'}
                    </span>
                  </Button>
                </a>
              </div>

              {/* Grace Place for Children & Families */}
              <div className="rounded-2xl sm:rounded-3xl p-8 transition-all duration-300 hover:shadow-lg flex flex-col h-full bg-green-50 border border-green-100">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-green-100">
                  <Heart className="w-6 h-6 text-green-800" />
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-4 text-green-800">
                  Grace Place for Children & Families
                </h3>
                
                <p className="text-base font-body leading-relaxed mb-6 flex-grow text-gray-600">
                  {language === 'en'
                    ? 'Dedicated to breaking the cycle of poverty through education, family support, and community engagement. Their comprehensive programs provide academic support, family counseling, and mental health resources to over 500 children and families in Naples.'
                    : 'Dedicados a romper el ciclo de pobreza a través de educación, apoyo familiar y participación comunitaria. Sus programas integrales proporcionan apoyo académico, consejería familiar y recursos de salud mental a más de 500 niños y familias en Naples.'}
                </p>

                <a
                  href="https://graceplacenaples.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto"
                  data-testid="link-grace-place"
                >
                  <Button
                    className="group flex items-center justify-start gap-3 rounded-full text-base font-semibold transition-all duration-300 px-6 w-full min-h-[3.5rem] whitespace-normal bg-green-800 text-white hover:bg-green-700"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 self-center bg-green-700">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-left leading-tight flex-1 py-2">
                      {language === 'en' ? 'Support Their Mission' : 'Apoyar Su Misión'}
                    </span>
                  </Button>
                </a>
              </div>
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

              <CompactVideoCarousel />
            </div>
          </div>
        </section>

        {/* CTA Section - Ready to take the first step */}
        <section className="py-16 lg:py-20 from-green-700 to-green-800 text-white bg-[#14532d]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold mb-6" data-testid="cta-title">
                {language === 'en' 
                  ? <>Ready to Take the <span className="font-display italic text-green-200">First</span> Step?</>
                  : <>¿Listo/a para Dar el <span className="font-display italic text-green-200">Primer</span> Paso?</>
                }
              </h2>
              <p className="text-xl lg:text-2xl text-green-100 mb-8 max-w-3xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'Change begins with a simple conversation. I am here to listen to you, understand you, and walk with you toward a fuller and more balanced life.'
                  : 'El cambio comienza con una simple conversación. Estoy aquí para escucharte, entenderte y caminar contigo hacia una vida más plena y equilibrada.'
                }
              </p>
              
              <Link href="/contact">
                <Button
                  className="group inline-flex items-center justify-center gap-2 sm:gap-4 rounded-full text-base sm:text-xl font-semibold transition-all duration-300 bg-white text-green-700 hover:bg-green-50 px-4 sm:px-10 py-6 sm:py-8 hover:shadow-xl hover:-translate-y-2 mb-6"
                  data-testid="cta-button"
                >
                  <span className="text-center">{language === 'en' ? 'Schedule My Consultation Now' : 'Agendar mi Consulta Ahora'}</span>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-700 text-white rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-green-800 flex-shrink-0">
                    <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                </Button>
              </Link>
              
              <p className="text-green-200 text-sm max-w-2xl mx-auto">
                {language === 'en'
                  ? 'All consultations are completely confidential and protected by medical privacy laws. Your privacy and well-being are our highest priorities.'
                  : 'Todas las consultas son completamente confidenciales y están protegidas por las leyes de privacidad médica. Tu privacidad y bienestar son nuestras máximas prioridades.'
                }
              </p>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <Reviews />

        {/* Telehealth Services Section */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-body font-bold text-gray-900 mb-4">
                {language === 'en' ? (
                  <>
                    <span className="font-display italic text-blue-700">Telehealth</span> Services Available
                  </>
                ) : (
                  <>
                    Servicios de <span className="font-display italic text-blue-700">Telesalud</span> Disponibles
                  </>
                )}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {language === 'en' 
                  ? 'Unable to visit our Naples office? Schedule secure online consultations from anywhere in Florida.'
                  : '¿No puede visitar nuestra oficina de Naples? Programe consultas seguras en línea desde cualquier lugar de Florida.'
                }
              </p>
            </div>
            <CharmHealthBooking variant="prominent" />
          </div>
        </section>

        {/* NAP Information Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Information */}
                <div className="space-y-8">
                  <h2 className="text-4xl font-body font-bold text-green-800 mb-8">
                    <span className="font-display italic text-green-700">Contact</span> {language === 'en' ? 'Information' : 'Información'}
                  </h2>
                  
                  {/* Address */}
                  <Card className="card-modern mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-body font-semibold text-green-800 mb-2">
                          {content.addressTitle}
                        </h3>
                        <p className="text-gray-700 font-body text-lg leading-relaxed" data-testid="text-address">
                          {practiceInfo.address.full}
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Phone */}
                  <Card className="card-modern mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-body font-semibold text-green-800 mb-2">
                          {language === 'en' ? 'Phone Number' : 'Número de Teléfono'}
                        </h3>
                        <a 
                          href={`tel:${practiceInfo.phone}`}
                          className="text-gray-700 font-body text-lg hover:text-green-700 transition-colors"
                          data-testid="link-phone"
                        >
                          {practiceInfo.phone}
                        </a>
                      </div>
                    </div>
                  </Card>

                  {/* Email */}
                  <Card className="card-modern mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-body font-semibold text-green-800 mb-2">
                          {language === 'en' ? 'Email Address' : 'Dirección de Email'}
                        </h3>
                        <a 
                          href={`mailto:${practiceInfo.email}`}
                          className="text-gray-700 font-body text-lg hover:text-green-700 transition-colors"
                          data-testid="link-email"
                        >
                          {practiceInfo.email}
                        </a>
                      </div>
                    </div>
                  </Card>

                  {/* Hours */}
                  <Card className="card-modern">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-body font-semibold text-green-800 mb-2">
                          {content.hoursTitle}
                        </h3>
                        <p className="text-gray-700 font-body text-lg" data-testid="text-hours">
                          {practiceInfo.hours}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Google Map - Full Height */}
                <div className="flex flex-col h-full">
                  <h2 className="text-4xl font-display font-bold text-green-800 mb-8">
                    {language === 'en' ? (
                      <><span className="font-display italic text-green-700">Find</span> Us on the <span className="font-display italic text-green-700">Map</span></>
                    ) : (
                      <><span className="font-display italic text-green-700">Encuéntrenos</span> en el <span className="font-display italic text-green-700">Mapa</span></>
                    )}
                  </h2>
                  <div className="flex-1 rounded-2xl overflow-hidden bg-gray-100 min-h-[400px]">
                    <GoogleMapsEmbed
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3579.759886892454!2d-81.80207962458476!3d26.204488077076398!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88db1f6ec4e7fe17%3A0x3b7682b63395c87f!2sHealing%20Minds%20Psychiatry!5e0!3m2!1sen!2sus!4v1758100640962!5m2!1sen!2sus"
                      title={language === 'en' 
                        ? 'Healing Minds Psychiatry Naples Location - Interactive Map'
                        : 'Ubicación Naples Healing Minds Psychiatry - Mapa Interactivo'
                      }
                      className="w-full h-full"
                      minHeight="400px"
                      context="location"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Call to Action */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
            <h2 className="text-4xl lg:text-5xl font-body font-bold text-gray-900 mb-6">
              {language === 'en' ? (
                <>
                  <span className="font-display italic text-green-700">Ready to Begin</span> Your <span className="font-display italic text-green-700">Journey?</span>
                </>
              ) : (
                <>
                  <span className="font-display italic text-green-700">¿Listo para Comenzar</span> su <span className="font-display italic text-green-700">Viaje?</span>
                </>
              )}
            </h2>
            <p className="text-xl text-gray-600 font-body mb-8 leading-relaxed">
              {language === 'en' 
                ? 'Take the first step towards better mental health. Contact us today to schedule your consultation.'
                : 'Dé el primer paso hacia una mejor salud mental. Contáctenos hoy para programar su consulta.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                className="bg-green-800 text-white hover:bg-green-700 px-8 py-6 rounded-full font-body font-semibold text-lg min-w-[240px]"
                onClick={() => window.location.href = '/contact'}
                data-testid="button-schedule-consultation"
              >
                <Heart className="w-5 h-5 mr-2" />
                {content.bookNow}
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-green-800 text-green-800 hover:bg-green-800 hover:text-white px-8 py-6 rounded-full font-body font-semibold text-lg min-w-[240px]"
                onClick={() => window.location.href = `tel:${practiceInfo.phone}`}
                data-testid="button-call-now"
              >
                <Phone className="w-4 h-4 mr-2" />
                {content.callNow}
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LocationNaples;