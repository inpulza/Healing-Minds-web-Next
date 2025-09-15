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
  VideoIcon
} from 'lucide-react';
import { IconSun, IconMapPin, IconBrain, IconHeart, IconMoodHappy, IconUser, IconLeaf } from '@tabler/icons-react';
import { Link } from 'wouter';

// Import office photo
import officePhoto from '@assets/doctor-consultation.webp';
import heroLocationImage from '@assets/dr-melva-location-hero.webp';
import OptimizedImage from '@/components/OptimizedImage';

const LocationMarcoIslandEspanol = () => {
  const { setLanguage, language } = useLanguage();

  useEffect(() => {
    // Force Spanish language for this page
    setLanguage('es');
    
    const seoData = {
      title: 'Psiquiatra Marco Island FL - Dra. Melva Reve | Healing Minds',
      description: 'La Dra. Melva Reve atiende Marco Island, FL. Atención psiquiátrica experta para ansiedad, depresión, TDAH, TEPT. Llame (239) 423-0272 para programar.',
      keywords: 'psiquiatra Marco Island FL, salud mental Marco Island, Dra Melva Reve Marco Island, atención psiquiátrica Marco Island FL',
      lang: 'es',
      canonical: '/es/ubicaciones/psiquiatra-marco-island'
    };
    updateSEO(seoData);

    // Add Service Schema for Marco Island location (Hub & Spoke Model)
    // This schema points to the main MedicalClinic as provider, avoiding conflicts
    const serviceDescription = 'Atención psiquiátrica experta para residentes de Marco Island. La Dra. Melva Reve proporciona servicios integrales de salud mental incluyendo tratamiento de ansiedad, terapia de depresión, evaluación de TDAH, tratamiento de TEPT, manejo de trastorno bipolar, y manejo de medicamentos psiquiátricos para la comunidad de Marco Island.';
    
    addLocationServiceSchema({
      "@type": "Service",
      "name": "Atención Psiquiátrica en Marco Island, FL",
      "description": serviceDescription,
      "provider": {
        "@type": "MedicalClinic",
        "@id": "https://www.healingmindsp.com/#medicalclinic"
      },
      "areaServed": {
        "@type": "City", 
        "name": "Marco Island",
        "containedInPlace": {
          "@type": "State",
          "name": "Florida"
        }
      },
      "availableChannel": {
        "@type": "ServiceChannel",
        "serviceUrl": "https://www.healingmindsp.com/es/ubicaciones/psiquiatra-marco-island",
        "servicePhone": "(239) 423-0272"
      }
    });

    return () => {
      // No cleanup needed
    };
  }, [setLanguage]);

  const contentData = {
    en: {
      title: "Expert Psychiatric Care in Marco Island",
      subtitle: "Compassionate mental health services for the Marco Island community",
      addressTitle: "Our Naples Office",
      contactTitle: "Contact Information", 
      hoursTitle: "Office Hours",
      servicesTitle: "Mental Health Services",
      insuranceTitle: "Accepted Insurance Plans",
      areaTitle: "Serving Marco Island & Surrounding Areas",
      mapTitle: "Find Us on the Map",
      bookNow: "Book Appointment",
      getDirections: "Get Directions",
      callNow: "Call Now",
      appointmentSubtitle: "Schedule your consultation today",
      communityTitle: "Marco Island Community Focus",
      communityDescription: "We understand the unique needs of Marco Island residents and provide culturally sensitive care.",
      features: [
        {
          title: "Experienced Psychiatrist",
          description: "Dr. Melva Reve brings years of expertise in treating diverse mental health conditions"
        },
        {
          title: "Bilingual Services",
          description: "Professional psychiatric care available in both English and Spanish"
        },
        {
          title: "Convenient Access", 
          description: "Easy drive from Marco Island to our Naples office location"
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
      title: "Atención Psiquiátrica Experta en Marco Island",
      subtitle: "Servicios compasivos de salud mental para la comunidad de Marco Island",
      addressTitle: "Nuestra Oficina en Naples",
      contactTitle: "Información de Contacto",
      hoursTitle: "Horarios de Oficina", 
      servicesTitle: "Servicios de Salud Mental",
      insuranceTitle: "Planes de Seguro Aceptados",
      areaTitle: "Sirviendo Marco Island y Áreas Circundantes",
      mapTitle: "Encuéntrenos en el Mapa",
      bookNow: "Reservar Cita",
      getDirections: "Obtener Direcciones",
      callNow: "Llamar Ahora",
      appointmentSubtitle: "Programe su consulta hoy",
      communityTitle: "Enfoque en la Comunidad de Marco Island",
      communityDescription: "Entendemos las necesidades únicas de los residentes de Marco Island y proporcionamos atención culturalmente sensible.",
      features: [
        {
          title: "Psiquiatra Experimentada",
          description: "La Dra. Melva Reve aporta años de experiencia en el tratamiento de diversas condiciones de salud mental"
        },
        {
          title: "Servicios Bilingües", 
          description: "Atención psiquiátrica profesional disponible tanto en inglés como en español"
        },
        {
          title: "Acceso Conveniente",
          description: "Fácil manejo desde Marco Island a nuestra ubicación de oficina en Naples"
        }
      ],
      services: [
        "Tratamiento de Ansiedad y Depresión",
        "Evaluación y Manejo de TDAH",
        "Terapia de TEPT y Trauma", 
        "Tratamiento de Trastorno Bipolar",
        "Manejo de Medicamentos",
        "Consultas de Telemedicina"
      ]
    }
  };

  const content = contentData[language] || contentData.es;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-gray-900 dark:text-white mb-6">
                  {content.title}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  {content.subtitle}
                </p>
                
                {/* Quick Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <CharmHealthBooking 
                    variant="primary"
                    size="lg"
                    className="flex-1 sm:flex-initial"
                    data-testid="button-book-appointment-hero"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    {content.bookNow}
                  </CharmHealthBooking>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="flex-1 sm:flex-initial border-2 hover:bg-green-50 dark:hover:bg-green-900"
                    onClick={() => window.open(`tel:${practiceInfo.phone}`, '_self')}
                    data-testid="button-call-now-hero"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    {content.callNow}
                  </Button>
                </div>

                {/* Location Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {content.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="relative z-10">
                  <OptimizedImage
                    src={heroLocationImage}
                    alt="Dr. Melva Reve Office serving Marco Island"
                    className="rounded-2xl shadow-2xl w-full h-auto"
                    width={600}
                    height={400}
                    priority
                    data-testid="img-hero-location"
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-green-200 dark:bg-green-800 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Focus Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                {content.communityTitle}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {content.communityDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Address Card */}
              <Card className="p-8 text-center border-2 hover:border-green-200 dark:hover:border-green-700 transition-colors" data-testid="card-address">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {content.addressTitle}
                </h3>
                <address className="text-gray-600 dark:text-gray-300 not-italic leading-relaxed" data-testid="text-address">
                  {practiceInfo.address.street}<br />
                  {practiceInfo.address.city}, {practiceInfo.address.state} {practiceInfo.address.zip}
                </address>
                <Button 
                  variant="outline" 
                  className="mt-6"
                  onClick={() => window.open(practiceInfo.googleMapsUrl, '_blank')}
                  data-testid="button-get-directions"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  {content.getDirections}
                </Button>
              </Card>

              {/* Contact Card */}
              <Card className="p-8 text-center border-2 hover:border-blue-200 dark:hover:border-blue-700 transition-colors" data-testid="card-contact">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {content.contactTitle}
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Phone:</p>
                    <a href={`tel:${practiceInfo.phone}`} className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline" data-testid="link-phone">
                      {practiceInfo.phone}
                    </a>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Email:</p>
                    <a href={`mailto:${practiceInfo.email}`} className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline" data-testid="link-email">
                      {practiceInfo.email}
                    </a>
                  </div>
                </div>
                <CharmHealthBooking 
                  variant="outline"
                  className="mt-6"
                  data-testid="button-book-appointment-contact"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {content.bookNow}
                </CharmHealthBooking>
              </Card>

              {/* Hours Card */}
              <Card className="p-8 text-center border-2 hover:border-purple-200 dark:hover:border-purple-700 transition-colors" data-testid="card-hours">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {content.hoursTitle}
                </h3>
                <div className="space-y-2 text-gray-600 dark:text-gray-300" data-testid="text-hours">
                  <p className="text-center">{practiceInfo.hours}</p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                {content.servicesTitle}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Comprehensive mental health services for Marco Island residents
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.services.map((service, index) => (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow" data-testid={`card-service-${index}`}>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <WellnessIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {service}
                  </h3>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/es/servicios">
                <Button variant="default" size="lg" data-testid="button-view-all-services">
                  Ver Todos los Servicios
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Insurance Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                {content.insuranceTitle}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                We accept most major insurance plans to make mental health care accessible
              </p>
            </div>
            
            <LocationInsuranceLogos />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                Preguntas Frecuentes - Marco Island
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Respuestas a preguntas comunes de residentes de Marco Island
              </p>
            </div>
            
            <LocationFAQ 
              locationFAQs={locationFAQs.marcoIsland} 
            />
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-6">
              Comience Su Viaje de Sanación Hoy
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Como residente de Marco Island, tiene acceso a atención psiquiátrica experta. Contáctenos para programar su consulta.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CharmHealthBooking 
                variant="secondary"
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100"
                data-testid="button-book-appointment-cta"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Reservar Cita
              </CharmHealthBooking>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-green-600"
                onClick={() => window.open(`tel:${practiceInfo.phone}`, '_self')}
                data-testid="button-call-now-cta"
              >
                <Phone className="w-5 h-5 mr-2" />
                Llamar Ahora
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LocationMarcoIslandEspanol;