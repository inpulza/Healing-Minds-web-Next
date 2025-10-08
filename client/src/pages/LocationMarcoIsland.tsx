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

const LocationMarcoIsland = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Psychiatrist Marco Island FL - Dr. Melva Reve | Healing Minds'
        : 'Psiquiatra Marco Island FL - Dra. Melva Reve | Healing Minds',
      description: language === 'en'
        ? 'Dr. Melva Reve serves Marco Island, FL. Expert psychiatric care for anxiety, depression, ADHD, PTSD. Call (239) 423-0272 to schedule.'
        : 'La Dra. Melva Reve atiende Marco Island, FL. Atención psiquiátrica experta para ansiedad, depresión, TDAH, TEPT. Llame (239) 423-0272 para programar.',
      keywords: language === 'en'
        ? 'psychiatrist Marco Island FL, mental health Marco Island, Dr Melva Reve Marco Island, psychiatric care Marco Island FL'
        : 'psiquiatra Marco Island FL, salud mental Marco Island, Dra Melva Reve Marco Island, atención psiquiátrica Marco Island FL',
      lang: language,
      canonical: '/locations/psychiatrist-marco-island'
    };
    updateSEO(seoData);

    // Add Service Schema for Marco Island location (Hub & Spoke Model)
    // This schema points to the main MedicalClinic as provider, avoiding conflicts
    const serviceDescription = language === 'en'
      ? 'Expert psychiatric care serving Marco Island residents. Dr. Melva Reve provides comprehensive mental health services including anxiety treatment, depression therapy, ADHD evaluation, PTSD treatment, bipolar disorder management, and psychiatric medication management for the Marco Island community.'
      : 'Atención psiquiátrica experta para residentes de Marco Island. La Dra. Melva Reve proporciona servicios integrales de salud mental incluyendo tratamiento de ansiedad, terapia de depresión, evaluación de TDAH, tratamiento de TEPT, manejo de trastorno bipolar, y manejo de medicamentos psiquiátricos para la comunidad de Marco Island.';

    addLocationServiceSchema({
      locationName: 'Marco Island',
      description: serviceDescription,
      pageId: 'marco-island-location',
      language: language
    });

    return () => {
      // Clean up Service schema when component unmounts
      const serviceSchema = document.querySelector('script[type="application/ld+json"]#marco-island-location-service-schema');
      if (serviceSchema) {
        serviceSchema.remove();
        console.log('🧹 Cleaned up Marco Island Service schema');
      }
    };
  }, [language]);

  const contentData = {
    en: {
      title: "Visit Our Marco Island Location",
      subtitle: "Your mental health journey starts here, serving Marco Island, Florida",
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
          description: "Easily accessible from Marco Island with ample parking available"
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
      title: "Visite Nuestra Ubicación en Marco Island",
      subtitle: "Su viaje de salud mental comienza aquí, sirviendo a Marco Island, Florida",
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
          description: "Fácil acceso desde Marco Island con amplio estacionamiento disponible"
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
                  alt="Dr. Melva Reve serving Marco Island - Professional mental health care in a welcoming environment"
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
                      {language === 'en' ? 'Serving Marco Island' : 'Sirviendo a Marco Island'}
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
                    <>Your Trusted <span className="font-display italic text-green-700">Psychiatrist</span> in Marco Island</>
                  ) : (
                    <>Su <span className="font-display italic text-green-700">Psiquiatra</span> de Confianza en Marco Island</>
                  )}
                </h1>

                <p className="text-sm md:text-base text-gray-700 mb-6 max-w-md font-body leading-relaxed">
                  {language === 'en' 
                    ? 'Expert mental health care for Marco Island residents with bilingual services and comprehensive treatment options.'
                    : 'Atención experta de salud mental para residentes de Marco Island con servicios bilingües y opciones de tratamiento integral.'}
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
                      en: 'Serving Marco Island',
                      es: 'Sirviendo a Marco Island'
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
                    {language === 'en' ? 'Serving Marco Island' : 'Sirviendo a Marco Island'}
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                    {language === 'en' ? (
                      <>Marco Island <span className="font-display italic text-green-700">Psychiatrist</span>: Your Path to Wellness</>
                    ) : (
                      <>Psiquiatra Especialista en <span className="font-display italic text-green-700">Marco Island</span>: Su Camino Hacia el Bienestar</>
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
                      ? 'As a psychiatrist near you in the Marco Island area, I offer specialized mental health services from our Naples practice on Tamiami Trail. Our modern facilities provide a welcoming environment specifically designed for anxiety treatment in Naples FL and psychiatric medication management near you. The short drive from Marco Island makes accessing compassionate psychiatric care convenient and confidential.'
                      : 'Como psiquiatra cerca de usted en el área de Marco Island, ofrezco servicios especializados de salud mental desde nuestra práctica en Naples en Tamiami Trail. Nuestras instalaciones modernas brindan un ambiente acogedor específicamente diseñado para tratamientos de ansiedad y manejo de medicamentos psiquiátricos cerca de usted. El corto viaje desde Marco Island hace que el acceso a atención psiquiátrica compasiva sea conveniente y confidencial.'}
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
                      alt="Dr. Melva Reve serving Marco Island - Professional and compassionate mental health care"
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
                    <><span className="font-display italic text-green-700">Mental Health</span> Treatments for Marco Island</>
                  ) : (
                    <>Tratamientos de <span className="font-display italic text-green-700">Salud Mental</span> para Marco Island</>
                  )}
                </h2>
                <WellnessIcon size="md" color="blue" className="opacity-70">
                  <Heart />
                </WellnessIcon>
              </div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'Specialized psychiatric services for Marco Island residents, including depression treatment Marco Island FL, ADHD evaluations, and expert psychiatric medication management. Our compassionate care is designed specifically for the Southwest Florida island community.'
                  : 'Servicios psiquiátricos especializados para residentes de Marco Island, incluyendo tratamiento de depresión, evaluaciones de TDAH, y manejo experto de medicamentos psiquiátricos. Nuestra atención compasiva está diseñada específicamente para la comunidad isleña del Suroeste de Florida.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: 'anxiety',
                  title: language === 'en' ? 'Anxiety Treatment' : 'Tratamiento de Ansiedad',
                  description: language === 'en' 
                    ? 'Specialized anxiety treatment in Naples FL for Marco Island residents. Expert care for panic attacks, social anxiety, and generalized anxiety disorder with evidence-based treatments.'
                    : 'Tratamiento especializado de ansiedad para residentes de Marco Island. Atención experta para ataques de pánico, ansiedad social y trastorno de ansiedad generalizada con tratamientos basados en evidencia.',
                  icon: Brain,
                  link: language === 'en' ? '/services/anxiety-treatment' : '/es/servicios/tratamiento-ansiedad'
                },
                {
                  id: 'depression',
                  title: language === 'en' ? 'Depression Treatment' : 'Tratamiento de Depresión',
                  description: language === 'en'
                    ? 'Depression treatment Marco Island FL with comprehensive care for major depression. Personalized treatment plans and ongoing support designed specifically for the Marco Island community.'
                    : 'Tratamiento de depresión con atención integral para depresión mayor. Planes de tratamiento personalizados y apoyo continuo diseñados específicamente para la comunidad de Marco Island.',
                  icon: Sun,
                  link: language === 'en' ? '/services/depression-treatment' : '/es/servicios/tratamiento-depresion'
                },
                {
                  id: 'adhd',
                  title: language === 'en' ? 'ADHD Treatment' : 'Tratamiento de TDAH',
                  description: language === 'en'
                    ? 'ADHD evaluation and treatment Marco Island FL. Specialized assessment and treatment for adults and teens to improve focus and daily functioning with medication management near me.'
                    : 'Evaluación especializada y tratamiento para adultos y adolescentes para mejorar el enfoque y funcionamiento diario.',
                  icon: Smile,
                  link: '/services/adhd-treatment'
                },
                {
                  id: 'ptsd',
                  title: language === 'en' ? 'PTSD Treatment' : 'Tratamiento de TEPT',
                  description: language === 'en'
                    ? 'PTSD treatment near Marco Island with trauma-informed psychiatric care to help you heal and reclaim your life from traumatic experiences.'
                    : 'Atención psiquiátrica informada en trauma para ayudarle a sanar y reclamar su vida de experiencias traumáticas.',
                  icon: Leaf,
                  link: language === 'en' ? '/services/ptsd-treatment' : '/es/servicios/tratamiento-tept'
                },
                {
                  id: 'bipolar',
                  title: language === 'en' ? 'Bipolar Treatment' : 'Tratamiento Bipolar',
                  description: language === 'en'
                    ? 'Bipolar disorder treatment Marco Island with expert mood stabilization to help achieve emotional balance and prevent future episodes.'
                    : 'Estabilización experta del ánimo para lograr equilibrio emocional y prevenir episodios futuros.',
                  icon: Heart,
                  link: language === 'en' ? '/services/bipolar-treatment' : '/es/servicios/tratamiento-bipolar'
                },
                {
                  id: 'medication-management',
                  title: language === 'en' ? 'Medication Management' : 'Manejo de Medicamentos',
                  description: language === 'en'
                    ? 'Expert psychiatric medication evaluation, monitoring, and adjustment with comprehensive safety assessments for Marco Island patients.'
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
                    <><span className="font-display italic text-green-700">How to Get Here</span> from Marco Island</>
                  ) : (
                    <><span className="font-display italic text-green-700">Cómo Llegar</span> desde Marco Island</>
                  )}
                </h2>
                <WellnessIcon size="md" color="green" className="opacity-70">
                  <MapPin />
                </WellnessIcon>
              </div>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'Our Naples psychiatric practice is conveniently located for Marco Island residents. Here are easy directions from popular Marco Island landmarks to our mental health facility on Tamiami Trail.'
                  : 'Nuestra práctica psiquiátrica en Naples está convenientemente ubicada para residentes de Marco Island. Aquí tiene direcciones fáciles desde puntos de referencia populares de Marco Island hasta nuestras instalaciones de salud mental en Tamiami Trail.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* From Marco Island Branch Library */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-800" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-green-800 mb-2">
                      {language === 'en' ? 'From Marco Island Branch Library' : 'Desde la Biblioteca de Marco Island'}
                    </h3>
                    <p className="text-sm text-gray-500 font-body">
                      210 S. Heathwood Drive
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
                        ? 'Head north from the library on Heathwood Drive toward Bald Eagle Drive'
                        : 'Diríjase hacia el norte desde la biblioteca por Heathwood Drive hacia Bald Eagle Drive'}
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-800 font-bold text-xs">2</span>
                    </div>
                    <p className="text-sm text-gray-700 font-body leading-relaxed">
                      {language === 'en'
                        ? 'Turn right on Bald Eagle Drive, then continue to the Marco Island Bridge (SR-951)'
                        : 'Gire a la derecha en Bald Eagle Drive, luego continúe hacia el Puente de Marco Island (SR-951)'}
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-800 font-bold text-xs">3</span>
                    </div>
                    <p className="text-sm text-gray-700 font-body leading-relaxed">
                      {language === 'en'
                        ? 'Cross the bridge to Naples, continue on US-41 North. Our practice is at 4760 Tamiami Trl N # 25'
                        : 'Cruce el puente hacia Naples, continúe por US-41 Norte. Nuestra práctica está en 4760 Tamiami Trl N # 25'}
                    </p>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center gap-2 text-green-700 font-body text-sm font-medium mb-4">
                    <Clock className="w-4 h-4" />
                    <span>{language === 'en' ? '25-30 minutes' : '25-30 minutos'}</span>
                  </div>

                  <Button 
                    className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-3 rounded-full"
                    onClick={() => window.open('https://maps.google.com/?saddr=210+S+Heathwood+Dr,+Marco+Island,+FL&daddr=4760+Tamiami+Trl+N+%23+25,+Naples,+FL+34103', '_blank')}
                    data-testid="button-directions-library"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Get Directions' : 'Obtener Direcciones'}
                  </Button>
                </div>
              </div>

              {/* From Frank E. Mackle Park */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-800" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-green-800 mb-2">
                      {language === 'en' ? 'From Frank E. Mackle Park' : 'Desde Frank E. Mackle Park'}
                    </h3>
                    <p className="text-sm text-gray-500 font-body">
                      Community Center Area
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
                        ? 'Exit the park area toward Bald Eagle Drive and head north'
                        : 'Salga del área del parque hacia Bald Eagle Drive y diríjase al norte'}
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-800 font-bold text-xs">2</span>
                    </div>
                    <p className="text-sm text-gray-700 font-body leading-relaxed">
                      {language === 'en'
                        ? 'Continue to Marco Island Bridge (SR-951) and cross toward Naples'
                        : 'Continúe hacia el Puente de Marco Island (SR-951) y cruce hacia Naples'}
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-800 font-bold text-xs">3</span>
                    </div>
                    <p className="text-sm text-gray-700 font-body leading-relaxed">
                      {language === 'en'
                        ? 'Take US-41 North to our mental health practice at 4760 Tamiami Trl N # 25'
                        : 'Tome US-41 Norte hacia nuestra práctica de salud mental en 4760 Tamiami Trl N # 25'}
                    </p>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center gap-2 text-green-700 font-body text-sm font-medium mb-4">
                    <Clock className="w-4 h-4" />
                    <span>{language === 'en' ? '25-30 minutes' : '25-30 minutos'}</span>
                  </div>

                  <Button 
                    className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-3 rounded-full"
                    onClick={() => window.open('https://maps.google.com/?saddr=Frank+E+Mackle+Park,+Marco+Island,+FL&daddr=4760+Tamiami+Trl+N+%23+25,+Naples,+FL+34103', '_blank')}
                    data-testid="button-directions-mackle-park"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Get Directions' : 'Obtener Direcciones'}
                  </Button>
                </div>
              </div>

              {/* From Marco Walk Plaza */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-800" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-green-800 mb-2">
                      {language === 'en' ? 'From Marco Walk Plaza' : 'Desde Marco Walk Plaza'}
                    </h3>
                    <p className="text-sm text-gray-500 font-body">
                      Shopping & Entertainment
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
                        ? 'From Marco Walk, head east on Marco Island Parkway toward San Marco Road'
                        : 'Desde Marco Walk, diríjase al este por Marco Island Parkway hacia San Marco Road'}
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-800 font-bold text-xs">2</span>
                    </div>
                    <p className="text-sm text-gray-700 font-body leading-relaxed">
                      {language === 'en'
                        ? 'Turn right on San Marco Road, continue to SR-951 Marco Island Bridge'
                        : 'Gire a la derecha en San Marco Road, continúe hacia el Puente SR-951 de Marco Island'}
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-800 font-bold text-xs">3</span>
                    </div>
                    <p className="text-sm text-gray-700 font-body leading-relaxed">
                      {language === 'en'
                        ? 'Cross bridge to Naples and head north on US-41 to 4760 Tamiami Trl N # 25'
                        : 'Cruce el puente hacia Naples y diríjase al norte por US-41 hacia 4760 Tamiami Trl N # 25'}
                    </p>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center gap-2 text-green-700 font-body text-sm font-medium mb-4">
                    <Clock className="w-4 h-4" />
                    <span>{language === 'en' ? '30-35 minutes' : '30-35 minutos'}</span>
                  </div>

                  <Button 
                    className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-3 rounded-full"
                    onClick={() => window.open('https://maps.google.com/?saddr=Marco+Walk+Plaza,+Marco+Island,+FL&daddr=4760+Tamiami+Trl+N+%23+25,+Naples,+FL+34103', '_blank')}
                    data-testid="button-directions-marco-walk"
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
                  {language === 'en' ? 'Easy Access for Marco Island Residents' : 'Fácil Acceso para Residentes de Marco Island'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-green-800 mb-1">
                          {language === 'en' ? 'Bridge Access' : 'Acceso por Puente'}
                        </h4>
                        <p className="text-sm text-gray-600 font-body">
                          {language === 'en'
                            ? 'Located directly on US-41, our Naples psychiatric practice is easily accessible via Marco Island Bridge for all island residents'
                            : 'Ubicada directamente en US-41, nuestra práctica psiquiátrica en Naples es fácilmente accesible a través del Puente de Marco Island para todos los residentes de la isla'}
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
                            ? 'Free, convenient parking available for all Marco Island patients visiting our mental health facility'
                            : 'Estacionamiento gratuito y conveniente disponible para todos los pacientes de Marco Island que visiten nuestras instalaciones de salud mental'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-green-800 mb-1">
                          {language === 'en' ? 'Island Convenient' : 'Conveniente para la Isla'}
                        </h4>
                        <p className="text-sm text-gray-600 font-body">
                          {language === 'en'
                            ? 'Short drive from Marco Island makes accessing specialized psychiatric care both convenient and private'
                            : 'Corto viaje desde Marco Island hace que el acceso a atención psiquiátrica especializada sea conveniente y privado'}
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
                            ? 'Well-marked building with clear signs to help Marco Island residents find our practice easily'
                            : 'Edificio bien marcado con señales claras para ayudar a los residentes de Marco Island a encontrar nuestra práctica fácilmente'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-green-100">
                  <p className="text-center text-gray-600 font-body text-sm leading-relaxed">
                    {language === 'en'
                      ? 'Serving Marco Island residents with expert psychiatric care at our conveniently located Naples practice. Call (239) 423-0272 for directions or appointment assistance.'
                      : 'Sirviendo a los residentes de Marco Island con atención psiquiátrica experta en nuestra práctica convenientemente ubicada en Naples. Llame al (239) 423-0272 para direcciones o asistencia con citas.'}
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
                    <><span className="font-display italic text-green-700">Community</span> Involvement in Marco Island</>
                  ) : (
                    <><span className="font-display italic text-green-700">Participación</span> Comunitaria en Marco Island</>
                  )}
                </h2>
                <WellnessIcon size="md" color="blue" className="opacity-70">
                  <Users />
                </WellnessIcon>
              </div>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'Mental health is fundamental to building a thriving community. We proudly support Marco Island through our psychiatric care services and by recognizing the vital organizations that strengthen our island community fabric.'
                  : 'La salud mental es fundamental para construir una comunidad próspera. Apoyamos con orgullo a Marco Island a través de nuestros servicios de atención psiquiátrica y reconociendo las organizaciones vitales que fortalecen el tejido de nuestra comunidad isleña.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {/* Marco Island Historical Museum */}
              <div className="rounded-2xl sm:rounded-3xl p-8 transition-all duration-300 hover:shadow-lg flex flex-col h-full bg-green-50 border border-green-100">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-green-100">
                  <Heart className="w-6 h-6 text-green-800" />
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-4 text-green-800">
                  Marco Island Historical Museum
                </h3>
                
                <p className="text-base font-body leading-relaxed mb-6 flex-grow text-gray-600">
                  {language === 'en'
                    ? 'Home to the world-famous Key Marco Cat artifact on loan from the Smithsonian. This 6-inch-tall half-cat, half-human figure was carved by Calusa Native Americans 500-1500 years ago, representing the rich cultural heritage of our island community and the importance of preserving history for mental wellness.'
                    : 'Hogar del mundialmente famoso artefacto Key Marco Cat prestado por el Smithsonian. Esta figura de 6 pulgadas de alto, mitad gato, mitad humano, fue tallada por los nativos americanos Calusa hace 500-1500 años, representando el rico patrimonio cultural de nuestra comunidad isleña y la importancia de preservar la historia para el bienestar mental.'}
                </p>

                <a
                  href="https://www.themihs.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto"
                  data-testid="link-marco-historical-museum"
                >
                  <Button
                    className="group flex items-center justify-start gap-3 rounded-full text-base font-semibold transition-all duration-300 px-6 w-full min-h-[3.5rem] whitespace-normal bg-green-800 text-white hover:bg-green-700"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 self-center bg-green-700">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-left leading-tight flex-1 py-2">
                      {language === 'en' ? 'Visit Museum Website' : 'Visitar Sitio del Museo'}
                    </span>
                  </Button>
                </a>
              </div>

              {/* Marco Island Center for the Arts */}
              <div className="rounded-2xl sm:rounded-3xl p-8 transition-all duration-300 hover:shadow-lg flex flex-col h-full bg-green-50 border border-green-100">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-green-100">
                  <Users className="w-6 h-6 text-green-800" />
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-4 text-green-800">
                  Marco Island Center for the Arts
                </h3>
                
                <p className="text-base font-body leading-relaxed mb-6 flex-grow text-gray-600">
                  {language === 'en'
                    ? 'Bringing wide variety of arts through exhibitions and educational programs for adults and children. With monthly exhibits and receptions, this center fosters creative expression and community connection - essential elements for mental health and well-being in our island community.'
                    : 'Aportando una amplia variedad de artes a través de exposiciones y programas educativos para adultos y niños. Con exposiciones y recepciones mensuales, este centro fomenta la expresión creativa y la conexión comunitaria - elementos esenciales para la salud mental y el bienestar en nuestra comunidad isleña.'}
                </p>

                <a
                  href="https://www.marcoislandart.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto"
                  data-testid="link-marco-arts-center"
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

              {/* Friends of the Library of Collier County */}
              <div className="rounded-2xl sm:rounded-3xl p-8 transition-all duration-300 hover:shadow-lg flex flex-col h-full bg-green-50 border border-green-100">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-green-100">
                  <Heart className="w-6 h-6 text-green-800" />
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-4 text-green-800">
                  Friends of the Library
                </h3>
                
                <p className="text-base font-body leading-relaxed mb-6 flex-grow text-gray-600">
                  {language === 'en'
                    ? 'With around 2,700-3,000 members, this major nonprofit supports the Marco Island Branch Library and all ten Collier County libraries. They bring educational programs, training, and new technology including a recent $100,000 donation for eBooks, supporting community learning and mental enrichment.'
                    : 'Con alrededor de 2,700-3,000 miembros, esta importante organización sin fines de lucro apoya la Biblioteca de Marco Island y las diez bibliotecas del Condado de Collier. Aportan programas educativos, capacitación y nueva tecnología incluyendo una donación reciente de $100,000 para eBooks, apoyando el aprendizaje comunitario y el enriquecimiento mental.'}
                </p>

                <a
                  href="https://collier-friends.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto"
                  data-testid="link-friends-library"
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

            {/* Bottom CTA */}
            <div className="mt-16 text-center">
              <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'Just as these organizations strengthen our Marco Island community, we are committed to supporting your mental health journey with compassionate and professional psychiatric care.'
                  : 'Así como estas organizaciones fortalecen nuestra comunidad de Marco Island, estamos comprometidos a apoyar su viaje de salud mental con atención psiquiátrica compasiva y profesional.'}
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Contact Info */}
              <div className="space-y-8">
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

                <div className="flex gap-4">
                  <Button 
                    className="bg-green-800 hover:bg-green-700 text-white"
                    onClick={() => window.open(`tel:${practiceInfo.phone}`, '_self')}
                    data-testid="button-call-now"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    {content.callNow}
                  </Button>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
                  <h3 className="text-2xl font-display font-bold text-green-800 mb-6">
                    {language === 'en' ? 'Send Us a Message' : 'Envíanos un Mensaje'}
                  </h3>
                  <Button 
                    className="w-full bg-green-800 hover:bg-green-700 text-white"
                    onClick={() => window.location.href = '/contact'}
                    data-testid="button-contact-form"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    {language === 'en' ? 'Contact Form' : 'Formulario de Contacto'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Telehealth Services Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-green-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Info */}
              <div>
                <h2 className="text-3xl lg:text-4xl font-body font-bold text-gray-900 mb-4">
                  {language === 'en' ? (
                    <>
                      <span className="font-display italic text-green-800">Telehealth</span> Services Available
                    </>
                  ) : (
                    <>
                      Servicios de <span className="font-display italic text-green-800">Telesalud</span> Disponibles
                    </>
                  )}
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  {language === 'en' 
                    ? 'Unable to visit our Naples office? Schedule secure online consultations from anywhere in Florida.'
                    : '¿No puede visitar nuestra oficina de Naples? Programe consultas seguras en línea desde cualquier lugar de Florida.'
                  }
                </p>
                <CharmHealthBooking variant="prominent" />
              </div>

              {/* Right: Doctor Image */}
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                  <OptimizedImage
                    src={heroLocationImage}
                    alt="Dr. Melva Reve - Telehealth Services"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <LocationFAQ locationFAQs={locationFAQs.marcoIsland} />
      </main>
      <Footer />
    </div>
  );
};

export default LocationMarcoIsland;