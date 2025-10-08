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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import floridaMap from '@/assets/florida-map.webp';
import doctorImage from '@/assets/doctor-consultation.webp';
import heroLocationImage from '@/assets/dr-melva-location-hero.webp';
// Generated benefit images
import statewideAccessImg from '@assets/generated_images/Statewide_telepsychiatry_access_concept_b85ef47e.png';
import saveTimeImg from '@assets/generated_images/Time_saving_telehealth_concept_4adac1c8.png';
import privacyImg from '@assets/generated_images/Privacy_and_confidentiality_concept_e1fc7f17.png';
import continuityImg from '@assets/generated_images/Continuity_of_care_concept_3152cd39.png';
// Generated service images
import evaluationImg from '@assets/generated_images/Comprehensive_psychiatric_evaluation_concept_72248a38.png';
import medicationImg from '@assets/generated_images/Medication_management_service_concept_5aec039c.png';
import followUpCareImg from '@assets/generated_images/Follow-up_psychiatric_care_concept_281a1466.png';
import bilingualImg from '@assets/generated_images/Bilingual_psychiatric_services_concept_405e7f7c.png';

const TelepsychiatryFlorida = () => {
  const { language } = useLanguage();
  const [openFaqItem, setOpenFaqItem] = useState<number | null>(0);
  
  // Charm Health booking URL
  const charmHealthBookingUrl = "https://ehr.charmtracker.com/publicCal.sas?method=getCal&digest=e54bdf77b791eb90cd5ef77f1bfb3dd742f7d5dfc96511bf80477815162a23b66ee57013c1a537e6a04718346ddb0ed8d95fcbc3b76e32a2";

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
            description: "Whether in Miami, Orlando, Tampa, or rural Florida, connect with Dr. Reve from anywhere in the state.",
            image: statewideAccessImg
          },
          {
            icon: Clock,
            title: "Save Time & Energy",
            description: "No traffic, no waiting rooms. Virtual appointments fit seamlessly into your schedule.",
            image: saveTimeImg
          },
          {
            icon: Shield,
            title: "Complete Privacy",
            description: "Receive care in the comfort and privacy of your own space with HIPAA-compliant security.",
            image: privacyImg
          },
          {
            icon: Users,
            title: "Continuity of Care",
            description: "Perfect for seasonal residents, students, or travelers. Your treatment continues wherever you are.",
            image: continuityImg
          }
        ]
      },
      process: {
        title: "How It Works",
        description: "Book your appointment through our secure CharmHealth platform and connect with Dr. Reve from anywhere in Florida.",
        steps: [
          {
            number: "1",
            title: "Choose Your Appointment Type",
            description: "Visit our CharmHealth booking portal and select from: New Patient Telehealth (60 mins), Follow-up Telehealth (20 mins), or in-person options if preferred."
          },
          {
            number: "2",
            title: "Complete Secure Check-In",
            description: "Fill out your information through CharmHealth's HIPAA-compliant platform. You'll receive a confirmation email with your encrypted video session link."
          },
          {
            number: "3",
            title: "Meet Dr. Reve Virtually",
            description: "Join your session from any device - smartphone, tablet, or computer. Have your full psychiatric evaluation in English or Spanish."
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
            description: "Initial psychiatric assessments for accurate diagnosis",
            image: evaluationImg
          },
          {
            icon: Heart,
            title: "Medication Management",
            description: "Expert treatment for anxiety, depression, ADHD, and more",
            image: medicationImg
          },
          {
            icon: CheckCircle,
            title: "Follow-Up Care",
            description: "Ongoing support and prescription management",
            image: followUpCareImg
          },
          {
            icon: Users,
            title: "Bilingual Services",
            description: "Professional care in English or Spanish",
            image: bilingualImg
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
            description: "Ya sea en Miami, Orlando, Tampa o la Florida rural, conéctese con la Dra. Reve desde cualquier lugar del estado.",
            image: statewideAccessImg
          },
          {
            icon: Clock,
            title: "Ahorre Tiempo y Energía",
            description: "Sin tráfico, sin salas de espera. Las citas virtuales se adaptan perfectamente a su agenda.",
            image: saveTimeImg
          },
          {
            icon: Shield,
            title: "Privacidad Completa",
            description: "Reciba atención en la comodidad y privacidad de su propio espacio con seguridad compatible con HIPAA.",
            image: privacyImg
          },
          {
            icon: Users,
            title: "Continuidad del Cuidado",
            description: "Perfecto para residentes estacionales, estudiantes o viajeros. Su tratamiento continúa donde quiera que esté.",
            image: continuityImg
          }
        ]
      },
      process: {
        title: "Cómo Funciona",
        description: "Reserve su cita a través de nuestra plataforma segura CharmHealth y conéctese con la Dra. Reve desde cualquier lugar de Florida.",
        steps: [
          {
            number: "1",
            title: "Elija su Tipo de Cita",
            description: "Visite nuestro portal de reservas CharmHealth y seleccione: Nuevo Paciente Telesalud (60 min), Seguimiento Telesalud (20 min), o opciones presenciales si lo prefiere."
          },
          {
            number: "2",
            title: "Complete el Registro Seguro",
            description: "Complete su información a través de la plataforma compatible con HIPAA de CharmHealth. Recibirá un correo de confirmación con su enlace de sesión de video encriptado."
          },
          {
            number: "3",
            title: "Conozca a la Dra. Reve Virtualmente",
            description: "Únase a su sesión desde cualquier dispositivo - teléfono, tableta o computadora. Tenga su evaluación psiquiátrica completa en inglés o español."
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
            description: "Evaluaciones psiquiátricas iniciales para diagnóstico preciso",
            image: evaluationImg
          },
          {
            icon: Heart,
            title: "Manejo de Medicamentos",
            description: "Tratamiento experto para ansiedad, depresión, TDAH y más",
            image: medicationImg
          },
          {
            icon: CheckCircle,
            title: "Atención de Seguimiento",
            description: "Apoyo continuo y manejo de prescripciones",
            image: followUpCareImg
          },
          {
            icon: Users,
            title: "Servicios Bilingües",
            description: "Atención profesional en inglés o español",
            image: bilingualImg
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
      <main>
        {/* Hero Section */}
        <section className="pt-20 pb-12 sm:pb-16 lg:pb-20 bg-gradient-to-b from-green-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Content */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <WellnessIcon size="sm" color="green">
                  <VideoIcon />
                </WellnessIcon>
                <span className="text-green-700 font-body font-semibold text-lg" data-testid="hero-tagline">
                  {currentContent.hero.tagline}
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-body font-bold text-green-800 mb-6" data-testid="telepsychiatry-title">
                {currentContent.hero.title}
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 mb-8 font-body leading-relaxed max-w-4xl mx-auto" data-testid="telepsychiatry-subtitle">
                {currentContent.hero.subtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <a href={charmHealthBookingUrl} target="_blank" rel="noopener noreferrer">
                  <Button 
                    size="lg" 
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-6 px-8 rounded-full inline-flex items-center gap-3 transition-all duration-300"
                    data-testid="button-schedule-virtual"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-green-500">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    {currentContent.hero.ctaPrimary}
                  </Button>
                </a>
                
                <a href="tel:+12394230272">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-green-600 text-green-600 hover:bg-green-50 font-semibold py-6 px-8 rounded-full inline-flex items-center gap-3"
                    data-testid="button-call-info"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-green-100">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    {currentContent.hero.ctaSecondary}
                  </Button>
                </a>
              </div>
            </div>

            {/* Hero Image - Dr. Melva Reve */}
            <div className="mb-12">
              <div className="w-full aspect-[1200/667] rounded-2xl overflow-hidden shadow-lg border border-green-100">
                <img 
                  src={heroLocationImage} 
                  alt="Dr. Melva Reve providing telepsychiatry services in Florida"
                  className="w-full h-full object-contain bg-white"
                  data-testid="hero-image-doctor"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {currentContent.stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-green-100 shadow-sm" data-testid={`stat-${index}`}>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <stat.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-800 whitespace-nowrap">{stat.value}</div>
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
              <h2 className="text-5xl font-body font-bold text-green-800 mb-4" data-testid="benefits-title">
                {language === 'en' ? (
                  <>Why Choose <span className="font-display italic text-green-700">Telepsychiatry</span>?</>
                ) : (
                  <>¿Por Qué Elegir <span className="font-display italic text-green-700">Telepsiquiatría</span>?</>
                )}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed" data-testid="benefits-description">
                {currentContent.benefits.description}
              </p>
            </div>
            {/* Mobile Carousel */}
            <div className="lg:hidden">
              <Carousel opts={{ align: "start", loop: true }} className="w-full">
                <CarouselContent>
                  {currentContent.benefits.items.map((benefit, index) => (
                    <CarouselItem key={index}>
                      <Card className="bg-green-50 border-green-100 overflow-hidden hover:shadow-lg transition-shadow duration-300" data-testid={`benefit-${index}`}>
                        {benefit.image && (
                          <div className="w-full aspect-square bg-white p-4">
                            <img 
                              src={benefit.image} 
                              alt={benefit.title}
                              className="w-full h-full object-contain rounded-2xl"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <WellnessIcon size="sm" color="green">
                              <benefit.icon />
                            </WellnessIcon>
                            <h3 className="text-lg font-body font-bold text-green-800">
                              {benefit.title}
                            </h3>
                          </div>
                          <p className="text-gray-700 font-body leading-relaxed text-sm">
                            {benefit.description}
                          </p>
                        </div>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 bg-white/90 hover:bg-white border-green-200" />
                <CarouselNext className="right-2 bg-white/90 hover:bg-white border-green-200" />
              </Carousel>
            </div>

            {/* Desktop Grid */}
            <div className="hidden lg:grid lg:grid-cols-4 gap-6">
              {currentContent.benefits.items.map((benefit, index) => (
                <Card key={index} className="bg-green-50 border-green-100 overflow-hidden hover:shadow-lg transition-shadow duration-300" data-testid={`benefit-${index}`}>
                  {benefit.image && (
                    <div className="w-full aspect-square bg-white p-4">
                      <img 
                        src={benefit.image} 
                        alt={benefit.title}
                        className="w-full h-full object-contain rounded-2xl"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <WellnessIcon size="sm" color="green">
                        <benefit.icon />
                      </WellnessIcon>
                      <h3 className="text-lg font-body font-bold text-green-800">
                        {benefit.title}
                      </h3>
                    </div>
                    <p className="text-gray-700 font-body leading-relaxed text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* About Dr. Melva Reve Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-lg border border-green-100">
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
                {/* Content */}
                <div className="text-green-800 order-2 md:order-1">
                  <h2 className="text-5xl font-body font-bold mb-4 sm:mb-6" data-testid="doctor-about-title">
                    {language === 'en' 
                      ? <>Dedicated to your <span className="font-display italic text-green-700">mental health</span>, every day</>
                      : <>Dedicados a su <span className="font-display italic text-green-700">salud mental</span>, todos los días</>
                    }
                  </h2>
                  
                  <div className="mb-6 sm:mb-8">
                    <div className="text-3xl sm:text-4xl font-bold mb-2 text-green-600" data-testid="experience-years">15+</div>
                    <div className="text-gray-600 font-body text-sm sm:text-base">
                      {language === 'en' ? 'Years of experience' : 'Años de experiencia'}
                    </div>
                  </div>

                  <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 font-body leading-relaxed">
                    {language === 'en'
                      ? 'Dr. Melva Reve provides compassionate telepsychiatry care with the same expertise and attention you would receive in person. As a board-certified psychiatrist, she brings years of experience directly to your home through secure video consultations.'
                      : 'La Dra. Melva Reve brinda atención de telepsiquiatría compasiva con la misma experiencia y atención que recibiría en persona. Como psiquiatra certificada, aporta años de experiencia directamente a su hogar a través de consultas de video seguras.'
                    }
                  </p>

                  <a href={charmHealthBookingUrl} target="_blank" rel="noopener noreferrer">
                    <Button
                      className="group inline-flex items-center justify-center gap-3 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 bg-green-600 text-white hover:bg-green-700 px-6 sm:px-8 py-6 sm:py-7"
                      data-testid="button-meet-doctor"
                    >
                      <span>{language === 'en' ? 'Book Your Consultation' : 'Reserve Su Consulta'}</span>
                      <ArrowRight className="w-8 h-8 sm:w-9 sm:h-9 p-2 min-w-[2rem] min-h-[2rem] sm:min-w-[2.25rem] sm:min-h-[2.25rem] rounded-full transition-all duration-300 bg-green-500 text-white flex-shrink-0" />
                    </Button>
                  </a>
                </div>

                {/* Doctor Image */}
                <div className="relative order-1 md:order-2">
                  <div className="aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden">
                    <img
                      src={doctorImage}
                      alt="Dr. Melva Reve, MD - Board-certified psychiatrist providing telepsychiatry services"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      data-testid="doctor-about-image"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Florida Map Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-5xl font-body font-bold text-green-800 mb-4" data-testid="map-title">
                {language === 'en' ? (
                  <>Serving <span className="font-display italic text-green-700">All</span> of Florida</>
                ) : (
                  <>Sirviendo a <span className="font-display italic text-green-700">Toda</span> Florida</>
                )}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed" data-testid="map-description">
                {currentContent.mapSection.description}
              </p>
            </div>

            {/* Stats - Above Map */}
            <div className="mb-8 sm:mb-12">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {currentContent.stats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                    <stat.icon className="w-12 h-12 p-3 bg-green-100 rounded-lg text-green-600 flex-shrink-0" />
                    <div className="text-2xl font-bold text-green-800 whitespace-nowrap">{stat.value}</div>
                    <div className="text-sm text-gray-600 font-medium whitespace-nowrap">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-green-100">
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
                <div className="absolute inset-0 bg-green-500 bg-opacity-5 border-2 border-green-400 border-opacity-20 rounded-2xl"></div>

                {/* Compass */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200">
                    <Navigation className="w-5 h-5 text-green-600" />
                  </div>
                </div>

                {/* Coverage Badge */}
                <div className="absolute bottom-4 left-4 z-10">
                  <div className="bg-white bg-opacity-95 rounded-lg shadow-lg px-4 py-2 border border-green-200">
                    <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                      <VideoIcon className="w-4 h-4" />
                      <span>{currentContent.mapSection.statewideLabel}</span>
                    </div>
                  </div>
                </div>

                {/* Office Location Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-white bg-opacity-95 rounded-lg shadow-lg px-3 py-2 border border-green-200">
                    <div className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                      <MapPin className="w-3 h-3 text-green-600" />
                      <span>Naples, FL 34103</span>
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
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
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
              <h2 className="text-5xl font-body font-bold text-green-800 mb-4" data-testid="process-title">
                {language === 'en' ? (
                  <>How It <span className="font-display italic text-green-700">Works</span></>
                ) : (
                  <>Cómo <span className="font-display italic text-green-700">Funciona</span></>
                )}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed" data-testid="process-description">
                {currentContent.process.description}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {currentContent.process.steps.map((step, index) => (
                <div key={index} className="relative" data-testid={`process-step-${index}`}>
                  <Card className="bg-green-50 border-green-100 p-6 sm:p-8 h-full hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
                        {step.number}
                      </div>
                      <h3 className="text-xl font-body font-bold text-green-800">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-700 font-body leading-relaxed">
                      {step.description}
                    </p>
                  </Card>
                  {index < currentContent.process.steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-8 h-8 text-green-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section - Con imagen de patient care */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-5xl font-body font-bold text-green-800 mb-4" data-testid="services-title">
                {language === 'en' ? (
                  <>Complete <span className="font-display italic text-green-700">Psychiatric</span> Services via Telehealth</>
                ) : (
                  <>Servicios <span className="font-display italic text-green-700">Psiquiátricos</span> Completos vía Telesalud</>
                )}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed" data-testid="services-description">
                {currentContent.services.description}
              </p>
            </div>
            {/* Mobile Carousel */}
            <div className="lg:hidden">
              <Carousel opts={{ align: "start", loop: true }} className="w-full">
                <CarouselContent>
                  {currentContent.services.items.map((service, index) => {
                    const IconComponent = service.icon;
                    return (
                      <CarouselItem key={index}>
                        <Card className="bg-white border-green-100 overflow-hidden hover:shadow-lg transition-shadow duration-300" data-testid={`service-${index}`}>
                          {service.image && (
                            <div className="w-full aspect-square bg-green-50 p-4">
                              <img 
                                src={service.image} 
                                alt={service.title}
                                className="w-full h-full object-contain rounded-2xl"
                              />
                            </div>
                          )}
                          <div className="p-6">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <IconComponent className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-lg font-body font-bold text-green-800 mb-2 text-center">
                              {service.title}
                            </h3>
                            <p className="text-gray-600 font-body leading-relaxed text-center text-sm">
                              {service.description}
                            </p>
                          </div>
                        </Card>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className="left-2 bg-white/90 hover:bg-white border-green-200" />
                <CarouselNext className="right-2 bg-white/90 hover:bg-white border-green-200" />
              </Carousel>
            </div>

            {/* Desktop Grid */}
            <div className="hidden lg:grid lg:grid-cols-4 gap-6">
              {currentContent.services.items.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <Card key={index} className="bg-white border-green-100 overflow-hidden hover:shadow-lg transition-shadow duration-300" data-testid={`service-${index}`}>
                    {service.image && (
                      <div className="w-full aspect-square bg-green-50 p-4">
                        <img 
                          src={service.image} 
                          alt={service.title}
                          className="w-full h-full object-contain rounded-2xl"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-lg font-body font-bold text-green-800 mb-2 text-center">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 font-body leading-relaxed text-center text-sm">
                        {service.description}
                      </p>
                    </div>
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
              <h2 className="text-5xl font-body font-bold text-green-800 mb-4" data-testid="faq-title">
                {language === 'en' ? (
                  <>Frequently <span className="font-display italic text-green-700">Asked</span> Questions</>
                ) : (
                  <>Preguntas <span className="font-display italic text-green-700">Frecuentes</span></>
                )}
              </h2>
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
                  className="bg-green-50 rounded-2xl shadow-sm border border-green-100 overflow-hidden"
                  data-testid={`faq-item-${index}`}
                >
                  <button
                    onClick={() => setOpenFaqItem(openFaqItem === index ? null : index)}
                    className="w-full px-6 lg:px-8 py-6 text-left flex items-center justify-between hover:bg-green-100 transition-colors duration-200"
                    data-testid={`faq-question-${index}`}
                  >
                    <h3 className="text-lg sm:text-xl font-display font-semibold text-green-900 pr-8">
                      {faq.question}
                    </h3>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                      openFaqItem === index 
                        ? 'bg-green-600' 
                        : 'bg-green-200'
                    }`}>
                      <ChevronDown 
                        className={`w-5 h-5 transition-all duration-300 ${
                          openFaqItem === index 
                            ? 'text-white rotate-180' 
                            : 'text-green-700'
                        }`} 
                      />
                    </div>
                  </button>
                  
                  {openFaqItem === index && (
                    <div className="px-6 lg:px-8 pb-6">
                      <div className="pt-2 border-t border-green-200">
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
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-green-50 to-green-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-5xl font-body font-bold text-green-800 mb-4" data-testid="cta-title">
              {language === 'en' ? (
                <>Ready to <span className="font-display italic text-green-700">Get Started</span>?</>
              ) : (
                <>¿Listo para <span className="font-display italic text-green-700">Comenzar</span>?</>
              )}
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 mb-8 font-body leading-relaxed" data-testid="cta-description">
              {currentContent.cta.description}
            </p>
            <a href={charmHealthBookingUrl} target="_blank" rel="noopener noreferrer">
              <Button 
                size="lg"
                className="group inline-flex items-center justify-center gap-3 rounded-full text-xl font-semibold transition-all duration-300 bg-green-600 text-white hover:bg-green-700 px-12 py-8"
                data-testid="button-schedule-final"
              >
                <VideoIcon className="w-6 h-6" />
                <span>{currentContent.cta.button}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TelepsychiatryFlorida;
