import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
  Calendar
} from 'lucide-react';
import { IconSun, IconMapPin, IconBrain } from '@tabler/icons-react';

const LocationNaples = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Naples Location - Dr. Melva Reve Psychiatric Care | Healing Minds'
        : 'Ubicación Naples - Atención Psiquiátrica Dra. Melva Reve | Healing Minds',
      description: language === 'en'
        ? 'Visit Dr. Melva Reve in Naples, FL at 4760 Tamiami Trl N #25. Expert psychiatric care for anxiety, depression, ADHD, PTSD. Call (239) 423-0272 to schedule.'
        : 'Visite a la Dra. Melva Reve en Naples, FL en 4760 Tamiami Trl N #25. Atención psiquiátrica experta para ansiedad, depresión, TDAH, TEPT. Llame (239) 423-0272 para programar.',
      keywords: language === 'en'
        ? 'psychiatrist Naples FL location, 4760 Tamiami Trail Naples, psychiatric office Naples, Dr Melva Reve address, mental health Naples FL'
        : 'ubicación psiquiatra Naples FL, 4760 Tamiami Trail Naples, consultorio psiquiátrico Naples, dirección Dra Melva Reve, salud mental Naples FL',
      lang: language,
      canonical: '/locations/naples'
    };
    updateSEO(seoData);

    // Add LocalBusiness Schema
    const existingScript = document.querySelector('script[data-schema="location"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', 'location');
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": "https://healingmindsp.com/locations/naples",
      "name": practiceInfo.name,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": practiceInfo.address.street,
        "addressLocality": practiceInfo.address.city,
        "addressRegion": practiceInfo.address.state,
        "postalCode": practiceInfo.address.zip,
        "addressCountry": "US"
      },
      "telephone": practiceInfo.phone,
      "email": practiceInfo.email,
      "url": "https://healingmindsp.com",
      "sameAs": [
        "https://www.google.com/maps/place/4760+Tamiami+Trl+N+%2325,+Naples,+FL+34103"
      ],
      "openingHours": "Mo-Fr 09:00-17:00",
      "priceRange": "$$",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "26.2540",
        "longitude": "-81.8057"
      },
      "areaServed": serviceAreas,
      "medicalSpecialty": "Psychiatry",
      "paymentAccepted": acceptedInsurance
    });
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.querySelector('script[data-schema="location"]');
      if (scriptToRemove && scriptToRemove.parentNode) {
        scriptToRemove.parentNode.removeChild(scriptToRemove);
      }
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
                  <IconMapPin />
                </WellnessIcon>
                <span className="text-blue-700 font-body font-semibold text-lg">
                  {language === 'en' ? 'Find Us in Naples' : 'Encuéntranos en Naples'}
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-body font-bold text-green-800 mb-6">
                {language === 'en' ? (
                  <>
                    Our Professional Practice Location in{' '}
                    <span className="font-display italic text-green-700">Naples, FL</span>
                  </>
                ) : (
                  <>
                    Nuestra Ubicación de Práctica Profesional en{' '}
                    <span className="font-display italic text-green-700">Naples, FL</span>
                  </>
                )}
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 mb-8 font-body leading-relaxed max-w-4xl mx-auto">
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
                  <Calendar className="w-5 h-5" />
                  {language === 'en' ? 'Schedule Consultation' : 'Programar Consulta'}
                  <ArrowRight className="w-5 h-5" />
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
                    className="group inline-flex items-center justify-center gap-3 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 bg-green-600 text-white hover:bg-green-700 px-6 sm:px-8 py-6 sm:py-7"
                    onClick={() => window.open(practiceInfo.googleMapsUrl, '_blank')}
                    data-testid="button-view-location"
                  >
                    <span>{language === 'en' ? 'View Our Location' : 'Ver Nuestra Ubicación'}</span>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 min-w-[2rem] min-h-[2rem] sm:min-w-[2.25rem] sm:min-h-[2.25rem] rounded-full flex items-center justify-center transition-all duration-300 bg-green-500 flex-shrink-0">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  </Button>
                </div>

                {/* Features Grid Side */}
                <div className="order-1 lg:order-2 flex flex-col h-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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
                  
                  {/* Photo - Fills remaining space */}
                  <div className="flex-1">
                    <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-green-50 to-green-100 min-h-[10rem]">
                      <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                        {/* Placeholder for now - you can replace with actual office photo */}
                        <div className="text-center p-8">
                          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-8 h-8 text-white" />
                          </div>
                          <p className="text-green-800 font-body font-semibold">
                            {language === 'en' ? 'Naples Office Location' : 'Ubicación de la Oficina de Naples'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Location Features Carousel */}
        <section className="py-16 bg-soft-green">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="overflow-hidden">
              <div className="flex animate-scroll">
                {[...content.features, ...content.features].map((feature, index) => (
                  <div key={index} className="flex-shrink-0 w-80 mx-6">
                    <Card className="card-modern text-center h-full">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-display font-semibold text-green-800 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 font-body leading-relaxed">
                        {feature.description}
                      </p>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* NAP Information Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Information */}
                <div className="space-y-8">
                  <h2 className="text-4xl font-display font-bold text-green-800 mb-8">
                    {content.contactTitle}
                  </h2>
                  
                  {/* Address */}
                  <Card className="card-modern mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
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
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
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
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
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
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
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
                    {content.mapTitle}
                  </h2>
                  <div className="flex-1 rounded-2xl overflow-hidden bg-gray-100">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.123456789!2d-81.8057!3d26.2540!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s4760%20Tamiami%20Trl%20N%20%2325%2C%20Naples%2C%20FL%2034103!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Healing Minds Psychiatry Location Map"
                      data-testid="map-google"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services & Insurance Section */}
        <section className="py-20 bg-soft-mint">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Services */}
              <div>
                <h2 className="text-3xl font-display font-bold text-green-800 mb-8">
                  {content.servicesTitle}
                </h2>
                <div className="space-y-4">
                  {content.services.map((service, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-600 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 font-body text-lg">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insurance Plans */}
              <div>
                <h2 className="text-3xl font-display font-bold text-green-800 mb-8">
                  {content.insuranceTitle}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {acceptedInsurance.map((insurance, index) => (
                    <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                        <Shield className="w-6 h-6 text-gray-500" />
                      </div>
                      <p className="text-sm font-body text-gray-700 leading-tight">{insurance}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Areas */}
              <div>
                <h2 className="text-3xl font-display font-bold text-green-800 mb-8">
                  {content.areaTitle}
                </h2>
                <div className="space-y-4">
                  {serviceAreas.map((area, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-600 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 font-body text-lg">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-green-800">
          <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-6">
              {language === 'en' ? 'Ready to Begin Your Journey?' : '¿Listo para Comenzar su Viaje?'}
            </h2>
            <p className="text-xl text-green-100 font-body mb-8 leading-relaxed">
              {language === 'en' 
                ? 'Take the first step towards better mental health. Contact us today to schedule your consultation.'
                : 'Dé el primer paso hacia una mejor salud mental. Contáctenos hoy para programar su consulta.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-white text-green-800 hover:bg-gray-100 text-lg px-8 py-6 rounded-full font-body font-semibold"
                onClick={() => window.location.href = '/contact'}
                data-testid="button-schedule-consultation"
              >
                <Heart className="w-5 h-5 mr-2" />
                {content.bookNow}
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-green-800 text-lg px-8 py-6 rounded-full font-body font-semibold"
                onClick={() => window.location.href = `tel:${practiceInfo.phone}`}
                data-testid="button-call-now"
              >
                <Phone className="w-5 h-5 mr-2" />
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