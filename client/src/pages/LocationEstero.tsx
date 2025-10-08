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

const LocationEstero = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Psychiatrist Estero FL - Dr. Melva Reve | Healing Minds'
        : 'Psiquiatra Estero FL - Dra. Melva Reve | Healing Minds',
      description: language === 'en'
        ? 'Dr. Melva Reve serves Estero, FL. Expert psychiatric care for anxiety, depression, ADHD, PTSD. Call (239) 423-0272 to schedule.'
        : 'La Dra. Melva Reve atiende Estero, FL. Atención psiquiátrica experta para ansiedad, depresión, TDAH, TEPT. Llame (239) 423-0272 para programar.',
      keywords: language === 'en'
        ? 'psychiatrist Estero FL, mental health Estero, Dr Melva Reve Estero, psychiatric care Estero FL'
        : 'psiquiatra Estero FL, salud mental Estero, Dra Melva Reve Estero, atención psiquiátrica Estero FL',
      lang: language,
      canonical: '/locations/psychiatrist-estero'
    };
    updateSEO(seoData);

    // Add Service Schema for Estero location (Hub & Spoke Model)
    // This schema points to the main MedicalClinic as provider, avoiding conflicts
    const serviceDescription = language === 'en'
      ? 'Expert psychiatric care serving Estero residents. Dr. Melva Reve provides comprehensive mental health services including anxiety treatment, depression therapy, ADHD evaluation, PTSD treatment, bipolar disorder management, and psychiatric medication management for the Estero community.'
      : 'Atención psiquiátrica experta para residentes de Estero. La Dra. Melva Reve proporciona servicios integrales de salud mental incluyendo tratamiento de ansiedad, terapia de depresión, evaluación de TDAH, tratamiento de TEPT, manejo de trastorno bipolar, y manejo de medicamentos psiquiátricos para la comunidad de Estero.';

    addLocationServiceSchema({
      locationName: 'Estero',
      description: serviceDescription,
      pageId: 'estero-location',
      language: language
    });

    return () => {
      // Clean up Service schema when component unmounts
      const serviceSchema = document.querySelector('script[type="application/ld+json"]#estero-location-service-schema');
      if (serviceSchema) {
        serviceSchema.remove();
        console.log('🧹 Cleaned up Estero Service schema');
      }
    };
  }, [language]);

  const contentData = {
    en: {
      title: "Visit Our Estero Location",
      subtitle: "Your mental health journey starts here, serving Estero, Florida",
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
          description: "Easily accessible from Estero with ample parking available"
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
      title: "Visite Nuestra Ubicación en Estero",
      subtitle: "Su viaje de salud mental comienza aquí, sirviendo a Estero, Florida",
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
          description: "Fácil acceso desde Estero con amplio estacionamiento disponible"
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
              <div className="relative aspect-[4/5] mb-4 rounded-2xl overflow-hidden">
                <OptimizedImage src={heroLocationImage} alt="Dr. Melva Reve serving Estero" className="w-full h-full object-cover object-center" width={800} height={1000} priority={true} sizes="100vw" />
                <div className="absolute bottom-0 left-0 right-0 z-10 px-4 sm:px-6 py-6 text-center bg-gradient-to-t from-black/60 to-transparent">
                  <div className="max-w-sm mx-auto">
                    <h1 className="text-2xl sm:text-3xl leading-tight text-white text-center font-body font-bold" data-testid="hero-title-mobile">
                      {language === 'en' ? (<>Your Trusted <span className="font-display italic">Psychiatrist</span> in Estero, FL</>) : (<>Su <span className="font-display italic">Psiquiatra</span> de Confianza en Estero, FL</>)}
                    </h1>
                  </div>
                </div>
              </div>
              <p className="text-sm text-center font-body text-green-700 mb-4 px-4 max-w-sm mx-auto" data-testid="hero-description-mobile">
                {language === 'en' ? 'Quality mental health care in Estero.' : 'Atención de salud mental de calidad en Estero.'}
              </p>
              <div className="flex flex-col gap-3 px-4">
                <Button size="lg" className="bg-green-800 hover:bg-green-700 text-white font-semibold py-6 px-8 rounded-full inline-flex items-center justify-center gap-3 w-full" onClick={() => window.location.href = '/contact'} data-testid="button-schedule-consultation-mobile"><Calendar className="w-5 h-5" />{language === 'en' ? 'Schedule Consultation' : 'Programar Consulta'}</Button>
                <Button variant="outline" size="lg" className="border-green-800 text-green-800 hover:bg-green-50 font-semibold py-6 px-8 rounded-full inline-flex items-center justify-center gap-3 w-full" onClick={() => window.open(practiceInfo.googleMapsUrl, '_blank')} data-testid="button-get-directions-mobile"><Navigation className="w-5 h-5" />{content.getDirections}</Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative aspect-[18/9] rounded-2xl overflow-hidden border border-blue-200">
                <OptimizedImage src={heroLocationImage} alt="Dr. Melva Reve serving Estero" className="absolute inset-0 w-full h-full object-cover object-center" width={1800} height={900} priority={true} sizes="(max-width: 1024px) 100vw, 1800px" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/15 to-transparent"></div>
                <div className="relative h-full flex items-start px-8 sm:px-12 lg:px-16 pt-12">
                  <div className="max-w-2xl text-left">
                    <div className="flex flex-wrap gap-2 mb-6">
                      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-green-100"><div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"><CheckCircle className="w-3 h-3 text-green-600" /></div><span className="text-gray-700 font-body font-medium text-xs sm:text-sm">{language === 'en' ? '15+ Years Experience' : '15+ Años de Experiencia'}</span></div>
                      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-green-100"><div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"><CheckCircle className="w-3 h-3 text-green-600" /></div><span className="text-gray-700 font-body font-medium text-xs sm:text-sm">{language === 'en' ? 'Bilingual Care' : 'Atención Bilingüe'}</span></div>
                      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-green-100"><div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"><CheckCircle className="w-3 h-3 text-green-600" /></div><span className="text-gray-700 font-body font-medium text-xs sm:text-sm">{language === 'en' ? 'Serving Estero' : 'Sirviendo Estero'}</span></div>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-body font-bold text-green-800 mb-5" data-testid="hero-title-desktop">
                      {language === 'en' ? (<>Your Trusted <span className="font-display italic text-green-700">Psychiatrist</span> in{' '}<span className="font-display italic text-green-700">Estero, FL</span></>) : (<>Su <span className="font-display italic text-green-700">Psiquiatra</span> de Confianza en{' '}<span className="font-display italic text-green-700">Estero, FL</span></>)}
                    </h1>
                    <p className="text-sm md:text-base leading-relaxed font-body text-green-700 max-w-md mb-6" data-testid="hero-description-desktop">{language === 'en' ? 'Quality mental health care in Estero.' : 'Atención de salud mental de calidad en Estero.'}</p>
                    <Button onClick={() => window.location.href = '/contact'} className="bg-green-700 hover:bg-green-800 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200" data-testid="button-schedule-consultation-desktop"><Calendar className="w-5 h-5 mr-2" />{language === 'en' ? 'Schedule Consultation' : 'Programar Consulta'}</Button>
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
                    {language === 'en' ? 'Serving Estero' : 'Sirviendo a Estero'}
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                    {language === 'en' ? (
                      <>Estero <span className="font-display italic text-green-700">Psychiatrist</span>: Your Path to Wellness</>
                    ) : (
                      <>Psiquiatra Especialista en <span className="font-display italic text-green-700">Estero</span>: Su Camino Hacia el Bienestar</>
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
                      ? 'As a psychiatrist near you in the Estero area, I offer specialized mental health services from our Naples practice on Tamiami Trail. Our modern facilities provide a welcoming environment specifically designed for anxiety treatment in Naples FL and psychiatric medication management near you. The convenient proximity to Estero makes accessing compassionate psychiatric care comfortable and confidential.'
                      : 'Como psiquiatra cerca de usted en el área de Estero, ofrezco servicios especializados de salud mental desde nuestra práctica en Naples en Tamiami Trail. Nuestras instalaciones modernas brindan un ambiente acogedor específicamente diseñado para tratamientos de ansiedad y manejo de medicamentos psiquiátricos cerca de usted. La proximidad conveniente a Estero hace que el acceso a atención psiquiátrica compasiva sea cómodo y confidencial.'}
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
                      alt="Dr. Melva Reve serving Estero - Professional and compassionate mental health care"
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
                    <><span className="font-display italic text-green-700">Mental Health</span> Treatments for Estero</>
                  ) : (
                    <>Tratamientos de <span className="font-display italic text-green-700">Salud Mental</span> para Estero</>
                  )}
                </h2>
                <WellnessIcon size="md" color="blue" className="opacity-70">
                  <Heart />
                </WellnessIcon>
              </div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'Specialized psychiatric services for Estero residents, including depression treatment Estero FL, ADHD evaluations, and expert psychiatric medication management. Our compassionate care is designed specifically for the Southwest Florida community near Florida Gulf Coast University.'
                  : 'Servicios psiquiátricos especializados para residentes de Estero, incluyendo tratamiento de depresión, evaluaciones de TDAH, y manejo experto de medicamentos psiquiátricos. Nuestra atención compasiva está diseñada específicamente para la comunidad del Suroeste de Florida cerca de Florida Gulf Coast University.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: 'anxiety',
                  title: language === 'en' ? 'Anxiety Treatment' : 'Tratamiento de Ansiedad',
                  description: language === 'en' 
                    ? 'Specialized anxiety treatment in Naples FL for Estero residents. Expert care for panic attacks, social anxiety, and generalized anxiety disorder with evidence-based treatments.'
                    : 'Tratamiento especializado de ansiedad para residentes de Estero. Atención experta para ataques de pánico, ansiedad social y trastorno de ansiedad generalizada con tratamientos basados en evidencia.',
                  icon: Brain,
                  link: language === 'en' ? '/services/anxiety-treatment' : '/es/servicios/tratamiento-ansiedad'
                },
                {
                  id: 'depression',
                  title: language === 'en' ? 'Depression Treatment' : 'Tratamiento de Depresión',
                  description: language === 'en'
                    ? 'Depression treatment Estero FL with comprehensive care for major depression. Personalized treatment plans and ongoing support designed specifically for the Estero community.'
                    : 'Tratamiento de depresión con atención integral para depresión mayor. Planes de tratamiento personalizados y apoyo continuo diseñados específicamente para la comunidad de Estero.',
                  icon: Sun,
                  link: language === 'en' ? '/services/depression-treatment' : '/es/servicios/tratamiento-depresion'
                },
                {
                  id: 'adhd',
                  title: language === 'en' ? 'ADHD Treatment' : 'Tratamiento de TDAH',
                  description: language === 'en'
                    ? 'ADHD evaluation and treatment Estero FL. Specialized assessment and treatment for adults and teens to improve focus and daily functioning with medication management near me.'
                    : 'Evaluación especializada y tratamiento para adultos y adolescentes para mejorar el enfoque y funcionamiento diario.',
                  icon: Smile,
                  link: '/services/adhd-treatment'
                },
                {
                  id: 'ptsd',
                  title: language === 'en' ? 'PTSD Treatment' : 'Tratamiento de TEPT',
                  description: language === 'en'
                    ? 'PTSD treatment near Estero with trauma-informed psychiatric care to help you heal and reclaim your life from traumatic experiences.'
                    : 'Atención psiquiátrica informada en trauma para ayudarle a sanar y reclamar su vida de experiencias traumáticas.',
                  icon: Leaf,
                  link: language === 'en' ? '/services/ptsd-treatment' : '/es/servicios/tratamiento-tept'
                },
                {
                  id: 'bipolar',
                  title: language === 'en' ? 'Bipolar Treatment' : 'Tratamiento Bipolar',
                  description: language === 'en'
                    ? 'Bipolar disorder treatment Estero with expert mood stabilization to help achieve emotional balance and prevent future episodes.'
                    : 'Estabilización experta del ánimo para lograr equilibrio emocional y prevenir episodios futuros.',
                  icon: Heart,
                  link: language === 'en' ? '/services/bipolar-treatment' : '/es/servicios/tratamiento-bipolar'
                },
                {
                  id: 'medication-management',
                  title: language === 'en' ? 'Medication Management' : 'Manejo de Medicamentos',
                  description: language === 'en'
                    ? 'Expert psychiatric medication evaluation, monitoring, and adjustment with comprehensive safety assessments for Estero patients.'
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
                    <><span className="font-display italic text-green-700">How to Get Here</span> from Estero</>
                  ) : (
                    <><span className="font-display italic text-green-700">Cómo Llegar</span> desde Estero</>
                  )}
                </h2>
                <WellnessIcon size="md" color="green" className="opacity-70">
                  <MapPin />
                </WellnessIcon>
              </div>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'Our Naples psychiatric practice is conveniently located for Estero residents. Here are easy directions from popular Estero landmarks to our mental health facility on Tamiami Trail.'
                  : 'Nuestra práctica psiquiátrica en Naples está convenientemente ubicada para residentes de Estero. Aquí tiene direcciones fáciles desde puntos de referencia populares de Estero hasta nuestras instalaciones de salud mental en Tamiami Trail.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* From South County Regional Library */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-800" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-green-800 mb-2">
                      {language === 'en' ? 'From South County Regional Library' : 'Desde la Biblioteca Regional del Sur'}
                    </h3>
                    <p className="text-sm text-gray-500 font-body">
                      Serving Estero & South Fort Myers
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
                        ? 'Head north from the library area toward US-41 (Tamiami Trail)'
                        : 'Diríjase hacia el norte desde el área de la biblioteca hacia US-41 (Tamiami Trail)'}
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-800 font-bold text-xs">2</span>
                    </div>
                    <p className="text-sm text-gray-700 font-body leading-relaxed">
                      {language === 'en'
                        ? 'Turn right (north) on US-41 and continue toward Naples'
                        : 'Gire a la derecha (norte) en US-41 y continúe hacia Naples'}
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-800 font-bold text-xs">3</span>
                    </div>
                    <p className="text-sm text-gray-700 font-body leading-relaxed">
                      {language === 'en'
                        ? 'Our practice is located at 4760 Tamiami Trl N # 25, just past Wiggins Pass Road'
                        : 'Nuestra práctica está ubicada en 4760 Tamiami Trl N # 25, justo después de Wiggins Pass Road'}
                    </p>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center gap-2 text-green-700 font-body text-sm font-medium mb-4">
                    <Clock className="w-4 h-4" />
                    <span>{language === 'en' ? '15-20 minutes' : '15-20 minutos'}</span>
                  </div>

                  <Button 
                    className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-3 rounded-full"
                    onClick={() => window.open('https://maps.google.com/?saddr=South+County+Regional+Library,+Fort+Myers,+FL&daddr=4760+Tamiami+Trl+N+%23+25,+Naples,+FL+34103', '_blank')}
                    data-testid="button-directions-library"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Get Directions' : 'Obtener Direcciones'}
                  </Button>
                </div>
              </div>

              {/* From Estero Community Park & Recreation Center */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-800" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-green-800 mb-2">
                      {language === 'en' ? 'From Estero Community Park' : 'Desde Estero Community Park'}
                    </h3>
                    <p className="text-sm text-gray-500 font-body">
                      9200 Corkscrew Palms Blvd
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
                        ? 'Exit the park area and head west toward US-41 (Tamiami Trail)'
                        : 'Salga del área del parque y diríjase al oeste hacia US-41 (Tamiami Trail)'}
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-800 font-bold text-xs">2</span>
                    </div>
                    <p className="text-sm text-gray-700 font-body leading-relaxed">
                      {language === 'en'
                        ? 'Turn right (north) on US-41 Tamiami Trail toward Naples'
                        : 'Gire a la derecha (norte) en US-41 Tamiami Trail hacia Naples'}
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-800 font-bold text-xs">3</span>
                    </div>
                    <p className="text-sm text-gray-700 font-body leading-relaxed">
                      {language === 'en'
                        ? 'Continue north. Our mental health practice is at 4760 Tamiami Trl N # 25'
                        : 'Continúe hacia el norte. Nuestra práctica de salud mental está en 4760 Tamiami Trl N # 25'}
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
                    onClick={() => window.open('https://maps.google.com/?saddr=9200+Corkscrew+Palms+Blvd,+Estero,+FL&daddr=4760+Tamiami+Trl+N+%23+25,+Naples,+FL+34103', '_blank')}
                    data-testid="button-directions-community-park"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Get Directions' : 'Obtener Direcciones'}
                  </Button>
                </div>
              </div>

              {/* From Coconut Point Mall */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-800" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-green-800 mb-2">
                      {language === 'en' ? 'From Coconut Point Mall' : 'Desde Coconut Point Mall'}
                    </h3>
                    <p className="text-sm text-gray-500 font-body">
                      Shopping & Entertainment Center
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
                        ? 'Exit Coconut Point toward Coconut Road and head west to US-41'
                        : 'Salga de Coconut Point hacia Coconut Road y diríjase al oeste hacia US-41'}
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-800 font-bold text-xs">2</span>
                    </div>
                    <p className="text-sm text-gray-700 font-body leading-relaxed">
                      {language === 'en'
                        ? 'Turn right (north) on US-41 Tamiami Trail and continue toward Naples'
                        : 'Gire a la derecha (norte) en US-41 Tamiami Trail y continúe hacia Naples'}
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-800 font-bold text-xs">3</span>
                    </div>
                    <p className="text-sm text-gray-700 font-body leading-relaxed">
                      {language === 'en'
                        ? 'Look for our psychiatric practice at 4760 Tamiami Trl N # 25, near Wiggins Pass'
                        : 'Busque nuestra práctica psiquiátrica en 4760 Tamiami Trl N # 25, cerca de Wiggins Pass'}
                    </p>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center gap-2 text-green-700 font-body text-sm font-medium mb-4">
                    <Clock className="w-4 h-4" />
                    <span>{language === 'en' ? '20-25 minutes' : '20-25 minutos'}</span>
                  </div>

                  <Button 
                    className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-3 rounded-full"
                    onClick={() => window.open('https://maps.google.com/?saddr=Coconut+Point,+Estero,+FL&daddr=4760+Tamiami+Trl+N+%23+25,+Naples,+FL+34103', '_blank')}
                    data-testid="button-directions-coconut-point"
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
                  {language === 'en' ? 'Easy Access for Estero Residents' : 'Fácil Acceso para Residentes de Estero'}
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
                            ? 'Located directly on US-41, our Naples psychiatric practice is easily accessible from all Estero neighborhoods including near FGCU'
                            : 'Ubicada directamente en US-41, nuestra práctica psiquiátrica en Naples es fácilmente accesible desde todos los vecindarios de Estero incluyendo cerca de FGCU'}
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
                            ? 'Free, convenient parking available for all Estero patients visiting our mental health facility'
                            : 'Estacionamiento gratuito y conveniente disponible para todos los pacientes de Estero que visiten nuestras instalaciones de salud mental'}
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
                            ? 'Accessible by public transportation and ride-sharing services from Estero and FGCU area'
                            : 'Accesible por transporte público y servicios de viajes compartidos desde Estero y el área de FGCU'}
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
                            ? 'Well-marked building with clear signs to help Estero residents find our practice easily'
                            : 'Edificio bien marcado con señales claras para ayudar a los residentes de Estero a encontrar nuestra práctica fácilmente'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-green-100">
                  <p className="text-center text-gray-600 font-body text-sm leading-relaxed">
                    {language === 'en'
                      ? 'Serving Estero residents with expert psychiatric care at our conveniently located Naples practice. Call (239) 423-0272 for directions or appointment assistance.'
                      : 'Sirviendo a los residentes de Estero con atención psiquiátrica experta en nuestra práctica convenientemente ubicada en Naples. Llame al (239) 423-0272 para direcciones o asistencia con citas.'}
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
                    <><span className="font-display italic text-green-700">Community</span> Involvement in Estero</>
                  ) : (
                    <><span className="font-display italic text-green-700">Participación</span> Comunitaria en Estero</>
                  )}
                </h2>
                <WellnessIcon size="md" color="blue" className="opacity-70">
                  <Users />
                </WellnessIcon>
              </div>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'Mental health is fundamental to building a thriving community. We proudly support Estero through our psychiatric care services and by recognizing the vital organizations that strengthen our local community fabric.'
                  : 'La salud mental es fundamental para construir una comunidad próspera. Apoyamos con orgullo a Estero a través de nuestros servicios de atención psiquiátrica y reconociendo las organizaciones vitales que fortalecen el tejido de nuestra comunidad local.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {/* Estero Historical Society */}
              <div className="rounded-2xl sm:rounded-3xl p-8 transition-all duration-300 hover:shadow-lg flex flex-col h-full bg-green-50 border border-green-100">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-green-100">
                  <Heart className="w-6 h-6 text-green-800" />
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-4 text-green-800">
                  Estero Historical Society
                </h3>
                
                <p className="text-base font-body leading-relaxed mb-6 flex-grow text-gray-600">
                  {language === 'en'
                    ? 'Dedicated to learning, teaching, and preserving Estero\'s rich history. Headquartered at the historic Hall-Hanson-Collier house and 1904 schoolhouse at Estero Community Park, they preserve the legacy of early settlements and contribute to the cultural wellness of our community.'
                    : 'Dedicada a aprender, enseñar y preservar la rica historia de Estero. Con sede en la histórica casa Hall-Hanson-Collier y la escuela de 1904 en Estero Community Park, preservan el legado de los primeros asentamientos y contribuyen al bienestar cultural de nuestra comunidad.'}
                </p>

                <a
                  href="https://estero-fl.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto"
                  data-testid="link-estero-historical"
                >
                  <Button
                    className="group flex items-center justify-start gap-3 rounded-full text-base font-semibold transition-all duration-300 px-6 w-full min-h-[3.5rem] whitespace-normal bg-green-800 text-white hover:bg-green-700"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 self-center bg-green-700">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-left leading-tight flex-1 py-2">
                      {language === 'en' ? 'Learn About Local History' : 'Conocer Historia Local'}
                    </span>
                  </Button>
                </a>
              </div>

              {/* Engage Estero */}
              <div className="rounded-2xl sm:rounded-3xl p-8 transition-all duration-300 hover:shadow-lg flex flex-col h-full bg-green-50 border border-green-100">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-green-100">
                  <Users className="w-6 h-6 text-green-800" />
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-4 text-green-800">
                  Engage Estero
                </h3>
                
                <p className="text-base font-body leading-relaxed mb-6 flex-grow text-gray-600">
                  {language === 'en'
                    ? 'All-volunteer, nonpartisan civic advocacy organization focused on community engagement and quality of life issues. Through active communications and resident education, they foster civic participation essential for community mental wellness and democratic engagement.'
                    : 'Organización de defensa cívica completamente voluntaria y no partidaria enfocada en la participación comunitaria y temas de calidad de vida. A través de comunicaciones activas y educación de residentes, fomentan la participación cívica esencial para el bienestar mental comunitario y la participación democrática.'}
                </p>

                <a
                  href="https://engageestero.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto"
                  data-testid="link-engage-estero"
                >
                  <Button
                    className="group flex items-center justify-start gap-3 rounded-full text-base font-semibold transition-all duration-300 px-6 w-full min-h-[3.5rem] whitespace-normal bg-green-800 text-white hover:bg-green-700"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 self-center bg-green-700">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-left leading-tight flex-1 py-2">
                      {language === 'en' ? 'Support Civic Engagement' : 'Apoyar Participación Cívica'}
                    </span>
                  </Button>
                </a>
              </div>

              {/* CREW Land & Water Trust */}
              <div className="rounded-2xl sm:rounded-3xl p-8 transition-all duration-300 hover:shadow-lg flex flex-col h-full bg-green-50 border border-green-100">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-green-100">
                  <Heart className="w-6 h-6 text-green-800" />
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-4 text-green-800">
                  CREW Land & Water Trust
                </h3>
                
                <p className="text-base font-body leading-relaxed mb-6 flex-grow text-gray-600">
                  {language === 'en'
                    ? 'Educates Southwest Florida citizens about conserving water recharge areas and wildlife habitat through public-private partnerships. Their environmental stewardship connects to mental health through nature preservation and community education, promoting overall well-being for Estero residents.'
                    : 'Educa a los ciudadanos del suroeste de Florida sobre la conservación de áreas de recarga de agua y hábitat de vida silvestre a través de asociaciones público-privadas. Su administración ambiental se conecta con la salud mental a través de la preservación de la naturaleza y la educación comunitaria, promoviendo el bienestar general para los residentes de Estero.'}
                </p>

                <a
                  href="https://www.crewtrust.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto"
                  data-testid="link-crew-trust"
                >
                  <Button
                    className="group flex items-center justify-start gap-3 rounded-full text-base font-semibold transition-all duration-300 px-6 w-full min-h-[3.5rem] whitespace-normal bg-green-800 text-white hover:bg-green-700"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 self-center bg-green-700">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-left leading-tight flex-1 py-2">
                      {language === 'en' ? 'Support Conservation' : 'Apoyar Conservación'}
                    </span>
                  </Button>
                </a>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-16 text-center">
              <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'Just as these organizations strengthen our Estero community, we are committed to supporting your mental health journey with compassionate and professional psychiatric care.'
                  : 'Así como estas organizaciones fortalecen nuestra comunidad de Estero, estamos comprometidos a apoyar su viaje de salud mental con atención psiquiátrica compasiva y profesional.'}
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

        {/* FAQ Section */}
        <LocationFAQ locationFAQs={locationFAQs.estero} />
      </main>
      <Footer />
    </div>
  );
};

export default LocationEstero;