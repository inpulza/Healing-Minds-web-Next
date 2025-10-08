import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'wouter';
import { 
  VideoIcon, 
  Shield, 
  Clock, 
  Users, 
  CheckCircle, 
  MapPin, 
  Monitor, 
  ArrowRight,
  Calendar,
  Phone,
  Navigation,
  ChevronDown,
  HelpCircle,
  Brain,
  Heart
} from 'lucide-react';
import InsuranceLogos from '@/components/InsuranceLogos';
import WellnessIcon from '@/components/WellnessIcon';
import { useState } from 'react';
import floridaMap from '@/assets/florida-map.webp';
import patientCareImage from '@/assets/telepsychiatry-patient-care.webp';
import floridaStateImage from '@/assets/telepsychiatry-florida-state.webp';

const TelepsychiatryFlorida = () => {
  const { language } = useLanguage();
  const [openFaqItem, setOpenFaqItem] = useState<number | null>(0);

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
        tagline: "Professional Virtual Care",
        title: "Expert Psychiatric Care from Anywhere in Florida",
        subtitle: "Connect with Dr. Melva Reve through secure video sessions. No travel required - receive compassionate, bilingual care from the comfort of your home.",
        ctaPrimary: "Schedule Virtual Appointment",
        ctaSecondary: "Call (239) 423-0272"
      },
      stats: [
        { icon: Users, value: '22M+', label: 'Florida Residents' },
        { icon: VideoIcon, value: '24/7', label: 'Online Scheduling' },
        { icon: Monitor, value: '100%', label: 'HIPAA Secure' }
      ],
      benefits: {
        title: "Why Choose Telepsychiatry?",
        description: "Experience mental health care designed around your life, not the other way around.",
        items: [
          {
            icon: MapPin,
            title: "Statewide Access",
            description: "Whether in Miami, Orlando, Tampa, or rural Florida, connect with Dr. Reve from anywhere in the state."
          },
          {
            icon: Clock,
            title: "Save Time & Energy",
            description: "No traffic, no waiting rooms. Virtual appointments fit seamlessly into your schedule."
          },
          {
            icon: Shield,
            title: "Complete Privacy",
            description: "Receive care in the comfort and privacy of your own space with HIPAA-compliant security."
          },
          {
            icon: Users,
            title: "Continuity of Care",
            description: "Perfect for seasonal residents, students, or travelers. Your treatment continues wherever you are."
          }
        ]
      },
      process: {
        title: "How It Works",
        description: "Starting your telepsychiatry journey is simple and secure.",
        steps: [
          {
            number: "1",
            title: "Book Your Session",
            description: "Schedule online or call us. We'll guide you through the simple intake process digitally."
          },
          {
            number: "2",
            title: "Receive Secure Link",
            description: "Get a confirmation email with your private, encrypted video session link."
          },
          {
            number: "3",
            title: "Meet Dr. Reve",
            description: "Connect from any device. Have your full psychiatric evaluation in English or Spanish."
          }
        ]
      },
      services: {
        title: "Complete Psychiatric Services via Telehealth",
        description: "Our virtual platform provides the full range of psychiatric care for adults (18+).",
        items: [
          {
            icon: Brain,
            title: "Comprehensive Evaluations",
            description: "Initial psychiatric assessments for accurate diagnosis"
          },
          {
            icon: Heart,
            title: "Medication Management",
            description: "Expert treatment for anxiety, depression, ADHD, and more"
          },
          {
            icon: CheckCircle,
            title: "Follow-Up Care",
            description: "Ongoing support and prescription management"
          },
          {
            icon: Users,
            title: "Bilingual Services",
            description: "Professional care in English or Spanish"
          }
        ]
      },
      faqs: [
        {
          question: "Is telepsychiatry as effective as in-person visits?",
          answer: "Yes! Research shows telepsychiatry is equally effective for most psychiatric conditions. Dr. Reve provides the same comprehensive evaluation, diagnosis, and treatment planning through secure video sessions."
        },
        {
          question: "What technology do I need?",
          answer: "You only need a smartphone, tablet, or computer with a camera, microphone, and internet connection. Our platform is user-friendly and works on all devices - no special software required."
        },
        {
          question: "Can prescriptions be sent to my pharmacy?",
          answer: "Absolutely. Dr. Reve can electronically send prescriptions to any pharmacy in Florida. You'll receive your medications the same day at your chosen location."
        },
        {
          question: "Is my video session private and secure?",
          answer: "Yes. We use CharmHealth, a fully HIPAA-compliant platform. All sessions are encrypted end-to-end, ensuring your privacy and confidentiality are protected at all times."
        },
        {
          question: "Do you accept insurance for telehealth?",
          answer: "Yes, we accept most major insurance plans for telepsychiatry services. Our team will verify your benefits before your appointment. We also offer flexible payment options."
        },
        {
          question: "What conditions can be treated via telepsychiatry?",
          answer: "We treat anxiety disorders, depression, ADHD, PTSD, bipolar disorder, OCD, and other mental health conditions. Dr. Reve will assess if telepsychiatry is appropriate for your specific needs."
        }
      ],
      mapSection: {
        title: "Serving All of Florida",
        description: "Professional telepsychiatry services available throughout the state",
        statewideLabel: "Statewide Coverage",
        mainOfficeLabel: "Main Office - Naples",
        telehealthLabel: "Telehealth Available"
      },
      cta: {
        title: "Ready to Get Started?",
        description: "Quality mental health care is just one click away. Schedule your virtual appointment today.",
        button: "Book Your Telehealth Session"
      }
    },
    es: {
      hero: {
        tagline: "Atención Virtual Profesional",
        title: "Atención Psiquiátrica Experta desde Cualquier Lugar de Florida",
        subtitle: "Conéctese con la Dra. Melva Reve a través de sesiones de video seguras. Sin necesidad de viajar - reciba atención compasiva y bilingüe desde la comodidad de su hogar.",
        ctaPrimary: "Programar Cita Virtual",
        ctaSecondary: "Llamar (239) 423-0272"
      },
      stats: [
        { icon: Users, value: '22M+', label: 'Residentes de FL' },
        { icon: VideoIcon, value: '24/7', label: 'Reserva Online' },
        { icon: Monitor, value: '100%', label: 'Seguro HIPAA' }
      ],
      benefits: {
        title: "¿Por Qué Elegir Telepsiquiatría?",
        description: "Experimente atención de salud mental diseñada alrededor de su vida, no al revés.",
        items: [
          {
            icon: MapPin,
            title: "Acceso Estatal",
            description: "Ya sea en Miami, Orlando, Tampa o la Florida rural, conéctese con la Dra. Reve desde cualquier lugar del estado."
          },
          {
            icon: Clock,
            title: "Ahorre Tiempo y Energía",
            description: "Sin tráfico, sin salas de espera. Las citas virtuales se adaptan perfectamente a su agenda."
          },
          {
            icon: Shield,
            title: "Privacidad Completa",
            description: "Reciba atención en la comodidad y privacidad de su propio espacio con seguridad compatible con HIPAA."
          },
          {
            icon: Users,
            title: "Continuidad del Cuidado",
            description: "Perfecto para residentes estacionales, estudiantes o viajeros. Su tratamiento continúa donde quiera que esté."
          }
        ]
      },
      process: {
        title: "Cómo Funciona",
        description: "Comenzar su viaje de telepsiquiatría es simple y seguro.",
        steps: [
          {
            number: "1",
            title: "Reserve su Sesión",
            description: "Programe en línea o llámenos. Le guiaremos a través del proceso de admisión digital."
          },
          {
            number: "2",
            title: "Reciba Enlace Seguro",
            description: "Obtenga un correo de confirmación con su enlace privado y encriptado para la sesión de video."
          },
          {
            number: "3",
            title: "Conozca a la Dra. Reve",
            description: "Conéctese desde cualquier dispositivo. Tenga su evaluación psiquiátrica completa en inglés o español."
          }
        ]
      },
      services: {
        title: "Servicios Psiquiátricos Completos vía Telesalud",
        description: "Nuestra plataforma virtual proporciona toda la gama de atención psiquiátrica para adultos (18+).",
        items: [
          {
            icon: Brain,
            title: "Evaluaciones Integrales",
            description: "Evaluaciones psiquiátricas iniciales para diagnóstico preciso"
          },
          {
            icon: Heart,
            title: "Manejo de Medicamentos",
            description: "Tratamiento experto para ansiedad, depresión, TDAH y más"
          },
          {
            icon: CheckCircle,
            title: "Atención de Seguimiento",
            description: "Apoyo continuo y manejo de prescripciones"
          },
          {
            icon: Users,
            title: "Servicios Bilingües",
            description: "Atención profesional en inglés o español"
          }
        ]
      },
      faqs: [
        {
          question: "¿Es la telepsiquiatría tan efectiva como las visitas en persona?",
          answer: "¡Sí! La investigación muestra que la telepsiquiatría es igualmente efectiva para la mayoría de las condiciones psiquiátricas. La Dra. Reve proporciona la misma evaluación integral, diagnóstico y planificación de tratamiento a través de sesiones de video seguras."
        },
        {
          question: "¿Qué tecnología necesito?",
          answer: "Solo necesita un teléfono inteligente, tableta o computadora con cámara, micrófono y conexión a internet. Nuestra plataforma es fácil de usar y funciona en todos los dispositivos - no se requiere software especial."
        },
        {
          question: "¿Pueden enviar las recetas a mi farmacia?",
          answer: "Absolutamente. La Dra. Reve puede enviar recetas electrónicamente a cualquier farmacia en Florida. Recibirá sus medicamentos el mismo día en la ubicación que elija."
        },
        {
          question: "¿Es mi sesión de video privada y segura?",
          answer: "Sí. Usamos CharmHealth, una plataforma totalmente compatible con HIPAA. Todas las sesiones están encriptadas de extremo a extremo, asegurando que su privacidad y confidencialidad estén protegidas en todo momento."
        },
        {
          question: "¿Aceptan seguro para telesalud?",
          answer: "Sí, aceptamos la mayoría de los planes de seguro principales para servicios de telepsiquiatría. Nuestro equipo verificará sus beneficios antes de su cita. También ofrecemos opciones de pago flexibles."
        },
        {
          question: "¿Qué condiciones pueden tratarse vía telepsiquiatría?",
          answer: "Tratamos trastornos de ansiedad, depresión, TDAH, TEPT, trastorno bipolar, TOC y otras condiciones de salud mental. La Dra. Reve evaluará si la telepsiquiatría es apropiada para sus necesidades específicas."
        }
      ],
      mapSection: {
        title: "Sirviendo a Toda Florida",
        description: "Servicios de telepsiquiatría profesional disponibles en todo el estado",
        statewideLabel: "Cobertura Estatal",
        mainOfficeLabel: "Oficina Principal - Naples",
        telehealthLabel: "Telesalud Disponible"
      },
      cta: {
        title: "¿Listo para Comenzar?",
        description: "Atención de salud mental de calidad está a solo un clic de distancia. Programe su cita virtual hoy.",
        button: "Reservar su Sesión de Telesalud"
      }
    }
  };

  const currentContent = content[language];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Hero Section - Modern Design with Images */}
        <section className="pt-20 pb-12 sm:pb-16 lg:pb-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Content */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <WellnessIcon size="sm" color="blue">
                  <VideoIcon />
                </WellnessIcon>
                <span className="text-blue-700 font-body font-semibold text-lg" data-testid="hero-tagline">
                  {currentContent.hero.tagline}
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-body font-bold text-blue-800 mb-6" data-testid="telepsychiatry-title">
                {currentContent.hero.title}
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 mb-8 font-body leading-relaxed max-w-4xl mx-auto" data-testid="telepsychiatry-subtitle">
                {currentContent.hero.subtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link href="/contact">
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 px-8 rounded-full inline-flex items-center gap-3 transition-all duration-300"
                    data-testid="button-schedule-virtual"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-blue-500">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    {currentContent.hero.ctaPrimary}
                  </Button>
                </Link>
                
                <a href="tel:+12394230272">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-6 px-8 rounded-full inline-flex items-center gap-3"
                    data-testid="button-call-info"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-blue-100">
                      <Phone className="w-4 h-4 text-blue-600" />
                    </div>
                    {currentContent.hero.ctaSecondary}
                  </Button>
                </a>
              </div>
            </div>

            {/* Hero Images Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card className="overflow-hidden border-blue-100">
                <img 
                  src={patientCareImage} 
                  alt="Patient receiving compassionate mental health care"
                  className="w-full h-[300px] object-cover"
                  data-testid="hero-image-patient"
                />
              </Card>
              <Card className="overflow-hidden border-blue-100">
                <img 
                  src={floridaStateImage} 
                  alt="Florida state coverage for telepsychiatry services"
                  className="w-full h-[300px] object-cover"
                  data-testid="hero-image-florida"
                />
              </Card>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {currentContent.stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-blue-100 shadow-sm" data-testid={`stat-${index}`}>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-800 whitespace-nowrap">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-blue-800 mb-4" data-testid="benefits-title">
                {currentContent.benefits.title}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed" data-testid="benefits-description">
                {currentContent.benefits.description}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {currentContent.benefits.items.map((benefit, index) => (
                <Card key={index} className="bg-blue-50 border-blue-100 p-6 sm:p-8 hover:shadow-lg transition-shadow duration-300" data-testid={`benefit-${index}`}>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <WellnessIcon size="md" color="blue">
                        <benefit.icon />
                      </WellnessIcon>
                    </div>
                    <div>
                      <h3 className="text-xl font-body font-bold text-blue-800 mb-3">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-700 font-body leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Florida Map Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-blue-800 mb-4" data-testid="map-title">
                {currentContent.mapSection.title}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed" data-testid="map-description">
                {currentContent.mapSection.description}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-blue-100">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                {/* Florida Map */}
                <div className="absolute inset-0">
                  <img 
                    src={floridaMap}
                    alt="Florida State Map - Telehealth Services Available"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>

                {/* Coverage Overlay */}
                <div className="absolute inset-0 bg-blue-500 bg-opacity-5 border-2 border-blue-400 border-opacity-20 rounded-2xl"></div>

                {/* Compass */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200">
                    <Navigation className="w-5 h-5 text-blue-600" />
                  </div>
                </div>

                {/* Coverage Badge */}
                <div className="absolute bottom-4 left-4 z-10">
                  <div className="bg-white bg-opacity-95 rounded-lg shadow-lg px-4 py-2 border border-blue-200">
                    <div className="flex items-center gap-2 text-sm text-blue-700 font-medium">
                      <VideoIcon className="w-4 h-4" />
                      <span>{currentContent.mapSection.statewideLabel}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Legend */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-700 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">
                    {currentContent.mapSection.mainOfficeLabel}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    {currentContent.mapSection.telehealthLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-blue-800 mb-4" data-testid="process-title">
                {currentContent.process.title}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed" data-testid="process-description">
                {currentContent.process.description}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {currentContent.process.steps.map((step, index) => (
                <div key={index} className="relative" data-testid={`process-step-${index}`}>
                  <Card className="bg-blue-50 border-blue-100 p-6 sm:p-8 h-full hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
                        {step.number}
                      </div>
                      <h3 className="text-xl font-body font-bold text-blue-800">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-700 font-body leading-relaxed">
                      {step.description}
                    </p>
                  </Card>
                  {index < currentContent.process.steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-8 h-8 text-blue-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-blue-800 mb-4" data-testid="services-title">
                {currentContent.services.title}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed" data-testid="services-description">
                {currentContent.services.description}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentContent.services.items.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <Card key={index} className="bg-white border-blue-100 p-6 text-center hover:shadow-lg transition-shadow duration-300" data-testid={`service-${index}`}>
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-body font-bold text-blue-800 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 font-body leading-relaxed">
                      {service.description}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <WellnessIcon size="md" color="blue" className="opacity-80">
                  <HelpCircle />
                </WellnessIcon>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-body font-bold text-blue-800" data-testid="faq-title">
                  {language === 'en' ? (
                    <>Frequently <span className="font-display italic text-blue-700">Asked</span> Questions</>
                  ) : (
                    <>Preguntas <span className="font-display italic text-blue-700">Frecuentes</span></>
                  )}
                </h2>
              </div>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-body leading-relaxed" data-testid="faq-description">
                {language === 'en'
                  ? 'Common questions about our telepsychiatry services answered.'
                  : 'Preguntas comunes sobre nuestros servicios de telepsiquiatría respondidas.'
                }
              </p>
            </div>

            <div className="space-y-4">
              {currentContent.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-blue-50 rounded-2xl shadow-sm border border-blue-100 overflow-hidden"
                  data-testid={`faq-item-${index}`}
                >
                  <button
                    onClick={() => setOpenFaqItem(openFaqItem === index ? null : index)}
                    className="w-full px-6 lg:px-8 py-6 text-left flex items-center justify-between hover:bg-blue-100 transition-colors duration-200"
                    data-testid={`faq-question-${index}`}
                  >
                    <h3 className="text-lg sm:text-xl font-display font-semibold text-blue-900 pr-8">
                      {faq.question}
                    </h3>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                      openFaqItem === index 
                        ? 'bg-blue-600' 
                        : 'bg-blue-200'
                    }`}>
                      <ChevronDown 
                        className={`w-5 h-5 transition-all duration-300 ${
                          openFaqItem === index 
                            ? 'text-white rotate-180' 
                            : 'text-blue-700'
                        }`} 
                      />
                    </div>
                  </button>
                  
                  {openFaqItem === index && (
                    <div className="px-6 lg:px-8 pb-6">
                      <div className="pt-2 border-t border-blue-200">
                        <p 
                          className="text-gray-700 font-body leading-relaxed text-lg"
                          data-testid={`faq-answer-${index}`}
                        >
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Insurance Section */}
        <InsuranceLogos />

        {/* Final CTA Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-blue-50 to-blue-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-blue-800 mb-4" data-testid="cta-title">
              {currentContent.cta.title}
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 mb-8 font-body leading-relaxed" data-testid="cta-description">
              {currentContent.cta.description}
            </p>
            <Link href="/contact">
              <Button 
                size="lg"
                className="group inline-flex items-center justify-center gap-3 rounded-full text-xl font-semibold transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 px-12 py-8"
                data-testid="button-schedule-final"
              >
                <VideoIcon className="w-6 h-6" />
                <span>{currentContent.cta.button}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
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
