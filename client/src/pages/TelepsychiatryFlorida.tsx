import { useEffect, useCallback } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';
import { Button } from '@/components/ui/button';
import { VideoIcon, CheckCircle, MapPin, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import InsuranceLogos from '@/components/InsuranceLogos';
import LocationFAQ from '@/components/LocationFAQ';
import { locationFAQs } from '@/data/locationFAQs';
import WellnessIcon from '@/components/WellnessIcon';
import floridaMap from '../assets/florida-map.webp';
import useEmblaCarousel from 'embla-carousel-react';
import CharmHealthBooking from '@/components/CharmHealthBooking';
import DoctorSection from '@/components/DoctorSection';
import accessFromHomeImg from '@assets/generated_images/Access_from_anywhere_Florida_325859e3.png';
import convenientSchedulingImg from '@assets/generated_images/Convenient_time_saving_66f1475e.png';
import securePrivateImg from '@assets/generated_images/Private_secure_platform_a7ed7a02.png';
import continuityCareImg from '@assets/generated_images/Continuity_of_care_87991256.png';
import initialEvaluationImg from '@assets/generated_images/Initial_psychiatric_evaluation_99ae51a4.png';
import anxietyDepressionImg from '@assets/generated_images/Anxiety_depression_calm_bdd7c98f.png';
import adhdManagementImg from '@assets/generated_images/ADHD_evaluation_management_b7a38ebf.png';
import ptsdTherapyImg from '@assets/generated_images/PTSD_trauma_therapy_61fd2d71.png';
import bipolarTreatmentImg from '@assets/generated_images/Bipolar_balance_stability_da9b84ed.png';
import medicationManagementImg from '@assets/generated_images/Medication_management_studio_556b9569.png';
import telehealthHeroBg from '@assets/Generated Image October 08, 2025 - 8_20PM_1759949272611.png';
import { useTikTokEvents } from '@/hooks/useTikTokEvents';

const TelepsychiatryFlorida = () => {
  const { language } = useLanguage();
  const { trackTelehealthClick } = useTikTokEvents();
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    breakpoints: {
      '(min-width: 768px)': { active: false }
    }
  });

  const [emblaRef2, emblaApi2] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    breakpoints: {
      '(min-width: 768px)': { active: false }
    }
  });

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

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollPrev2 = useCallback(() => {
    if (emblaApi2) emblaApi2.scrollPrev();
  }, [emblaApi2]);

  const scrollNext2 = useCallback(() => {
    if (emblaApi2) emblaApi2.scrollNext();
  }, [emblaApi2]);

  const content = {
    en: {
      hero: {
        title: "Expert Psychiatric Care from Anywhere in Florida",
        subtitle: "Telepsychiatry Services Throughout Florida",
        description: "Connect with Dr. Melva Reve from the comfort and privacy of your home, wherever you are in Florida."
      },
      benefits: {
        title: "Why Choose Telepsychiatry?",
        items: [
          {
            title: "Access from Anywhere in Florida",
            description: "Whether you're in Miami, Orlando, Tampa, or a rural community, connect with a board-certified psychiatrist without the need to travel."
          },
          {
            title: "Convenient & Time-Saving",
            description: "No traffic, no waiting rooms. Our virtual appointments fit your schedule, allowing you to receive care efficiently from home."
          },
          {
            title: "100% Private & Secure",
            description: "HIPAA-compliant platform ensures your sessions are completely confidential and encrypted. Your privacy is our priority."
          },
          {
            title: "Continuity of Care",
            description: "Perfect for seasonal residents, college students, or anyone traveling within Florida. Your treatment never gets interrupted."
          }
        ]
      },
      coverage: {
        title: "Statewide Coverage",
        description: "Dr. Melva Reve is licensed to provide telepsychiatry services throughout the entire state of Florida."
      },
      process: {
        title: "How It Works",
        description: "Getting started with telepsychiatry is simple and straightforward.",
        steps: [
          {
            number: "1",
            title: "Book Your Appointment",
            description: "Call us or use our online booking portal to schedule your first virtual consultation."
          },
          {
            number: "2",
            title: "Receive Secure Link",
            description: "You'll get a confirmation email with a unique, HIPAA-compliant video session link."
          },
          {
            number: "3",
            title: "Connect with Dr. Reve",
            description: "At your appointment time, click the link from any device and meet with Dr. Reve in English or Spanish."
          },
          {
            number: "4",
            title: "Ongoing Care",
            description: "Receive prescriptions electronically and schedule follow-ups as needed, all from the comfort of home."
          }
        ]
      },
      services: {
        title: "Complete Psychiatry Services via Telemedicine",
        description: "Our virtual platform allows us to offer our full range of diagnostic and medication management services for adults (18+).",
        list: [
          {
            title: "Initial Psychiatric Evaluation",
            description: "Comprehensive assessment to understand your mental health needs and create a personalized treatment plan."
          },
          {
            title: "Anxiety & Depression Treatment",
            description: "Expert medication management and ongoing support for anxiety disorders and depression."
          },
          {
            title: "ADHD Evaluation & Management",
            description: "Thorough ADHD assessment and medication management for adults seeking focus and productivity."
          },
          {
            title: "PTSD & Trauma Therapy",
            description: "Trauma-informed care and medication support for post-traumatic stress disorder."
          },
          {
            title: "Bipolar Disorder Treatment",
            description: "Specialized mood stabilization and comprehensive bipolar disorder management."
          },
          {
            title: "Medication Management & Renewals",
            description: "Ongoing prescription management with electronic prescriptions sent directly to your pharmacy."
          }
        ]
      }
    },
    es: {
      hero: {
        title: "Atención Psiquiátrica Experta desde Cualquier Lugar de Florida",
        subtitle: "Servicios de Telepsiquiatría en Toda Florida",
        description: "Conéctese con la Dra. Melva Reve desde la comodidad y privacidad de su hogar, donde quiera que esté en Florida."
      },
      benefits: {
        title: "¿Por Qué Elegir Telepsiquiatría?",
        items: [
          {
            title: "Acceso desde Cualquier Lugar de Florida",
            description: "Ya sea que esté en Miami, Orlando, Tampa o una comunidad rural, conéctese con una psiquiatra certificada sin necesidad de viajar."
          },
          {
            title: "Conveniente y Ahorra Tiempo",
            description: "Sin tráfico, sin salas de espera. Nuestras citas virtuales se adaptan a su horario, permitiéndole recibir atención eficientemente desde casa."
          },
          {
            title: "100% Privado y Seguro",
            description: "Plataforma compatible con HIPAA garantiza que sus sesiones sean completamente confidenciales y encriptadas. Su privacidad es nuestra prioridad."
          },
          {
            title: "Continuidad de la Atención",
            description: "Perfecto para residentes estacionales, estudiantes universitarios o cualquiera que viaje dentro de Florida. Su tratamiento nunca se interrumpe."
          }
        ]
      },
      coverage: {
        title: "Cobertura Estatal",
        description: "La Dra. Melva Reve tiene licencia para proporcionar servicios de telepsiquiatría en todo el estado de Florida."
      },
      process: {
        title: "Cómo Funciona",
        description: "Comenzar con la telepsiquiatría es simple y directo.",
        steps: [
          {
            number: "1",
            title: "Reserve su Cita",
            description: "Llámenos o use nuestro portal de reservas en línea para programar su primera consulta virtual."
          },
          {
            number: "2",
            title: "Reciba Enlace Seguro",
            description: "Recibirá un correo de confirmación con un enlace único de sesión de video compatible con HIPAA."
          },
          {
            number: "3",
            title: "Conéctese con la Dra. Reve",
            description: "A la hora de su cita, haga clic en el enlace desde cualquier dispositivo y reúnase con la Dra. Reve en inglés o español."
          },
          {
            number: "4",
            title: "Atención Continua",
            description: "Reciba recetas electrónicamente y programe seguimientos según sea necesario, todo desde la comodidad de su hogar."
          }
        ]
      },
      services: {
        title: "Servicios Completos de Psiquiatría a través de Telemedicina",
        description: "Nuestra plataforma virtual nos permite ofrecer nuestra gama completa de servicios de diagnóstico y manejo de medicamentos para adultos (18+).",
        list: [
          {
            title: "Evaluación Psiquiátrica Inicial",
            description: "Evaluación integral para comprender sus necesidades de salud mental y crear un plan de tratamiento personalizado."
          },
          {
            title: "Tratamiento de Ansiedad y Depresión",
            description: "Manejo experto de medicamentos y apoyo continuo para trastornos de ansiedad y depresión."
          },
          {
            title: "Evaluación y Manejo de TDAH",
            description: "Evaluación exhaustiva de TDAH y manejo de medicación para adultos que buscan enfoque y productividad."
          },
          {
            title: "Terapia de TEPT y Trauma",
            description: "Atención informada en trauma y apoyo con medicamentos para trastorno de estrés postraumático."
          },
          {
            title: "Tratamiento de Trastorno Bipolar",
            description: "Estabilización del estado de ánimo especializada y manejo integral del trastorno bipolar."
          },
          {
            title: "Manejo y Renovación de Medicamentos",
            description: "Manejo continuo de recetas con prescripciones electrónicas enviadas directamente a su farmacia."
          }
        ]
      }
    }
  };

  const currentContent = content[language];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section - Home Style */}
        <section className="pt-8 pb-16 bg-white">
          <div className="max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[90%] mx-auto px-2 sm:px-4">
            <div className="relative rounded-3xl overflow-hidden h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] flex items-center justify-center">
              {/* Background Image */}
              <img 
                src={telehealthHeroBg} 
                alt="Dr. Melva Reve - Telepsychiatry Services Throughout Florida"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              
              {/* Left-Aligned Content */}
              <div className="relative z-10 w-full px-8 lg:px-16 py-8 text-left">
                <div className="max-w-5xl ml-2 md:ml-4" style={{maxWidth: "65%"}}>
                  {/* SEO Pills */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-base font-medium">Telepsychiatry</span>
                    <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-base font-medium">Statewide Florida</span>
                    <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-base font-medium">Virtual Care</span>
                  </div>
                  
                  <h1 className="text-4xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl leading-relaxed text-green-700 text-left mb-6 md:mb-8" data-testid="hero-title">
                    <div className="font-display italic font-bold">
                      {language === 'en' ? (
                        <>Expert <span className="text-green-600">Psychiatric Care</span> from Anywhere in <span className="text-green-600">Florida</span></>
                      ) : (
                        <>Atención <span className="text-green-600">Psiquiátrica Experta</span> desde Cualquier Lugar de <span className="text-green-600">Florida</span></>
                      )}
                    </div>
                  </h1>
                  
                  <div className="text-lg md:text-xl lg:text-xl xl:text-2xl leading-relaxed font-body mb-8 md:mb-10 lg:mb-12 text-[#1e6b3b] lg:mr-20 xl:mr-32 2xl:mr-40" data-testid="hero-description">
                    <span>{currentContent.hero.description}</span>
                  </div>
                  
                  {/* Booking Button */}
                  <div className="mb-8">
                    <Button
                      onClick={() => {
                        trackTelehealthClick('telepsychiatry-hero');
                        window.open('https://patient.charmtracker.com/login.jsp?PID=7a4f7f03d9f44ac4ba3d28c9fda4c99a', '_blank', 'noopener,noreferrer');
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                      data-testid="button-telehealth-hero"
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      {language === 'en' ? 'Book Telehealth Appointment' : 'Reservar Cita de Telesalud'}
                    </Button>
                  </div>
                  
                  {/* Badges */}
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 bg-white/95 rounded-full px-4 py-2 shadow-sm border border-green-100">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <VideoIcon className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-gray-700 font-body font-medium text-sm">
                        {language === 'en' ? 'Telehealth Available' : 'Telesalud Disponible'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/95 rounded-full px-4 py-2 shadow-sm border border-green-100">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-gray-700 font-body font-medium text-sm">
                        {language === 'en' ? 'Available 24/7' : 'Disponible 24/7'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/95 rounded-full px-4 py-2 shadow-sm border border-green-100">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-gray-700 font-body font-medium text-sm">
                        {language === 'en' ? 'Mobile Friendly' : 'Móvil Amigable'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statewide Coverage Section with Map */}
        <section className="py-12 sm:py-16 lg:py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-4">
                {language === 'en' ? (
                  <>Statewide <span className="font-display italic text-green-700">Coverage</span></>
                ) : (
                  <>Cobertura <span className="font-display italic text-green-700">Estatal</span></>
                )}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed mb-8">
                {currentContent.coverage.description}
              </p>
              
              {/* Feature Tags */}
              <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
                {[
                  {
                    en: '15+ Years Experience',
                    es: '15+ Años de Experiencia'
                  },
                  {
                    en: 'Board-Certified Psychiatrist',
                    es: 'Psiquiatra Certificada'
                  },
                  {
                    en: 'Bilingual Services',
                    es: 'Servicios Bilingües'
                  },
                  {
                    en: 'Statewide Coverage',
                    es: 'Cobertura Estatal'
                  },
                  {
                    en: 'HIPAA Compliant',
                    es: 'Compatible con HIPAA'
                  },
                  {
                    en: 'Secure Platform',
                    es: 'Plataforma Segura'
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-green-100" data-testid={`feature-tag-${index}`}>
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-body font-medium text-xs sm:text-sm">
                      {language === 'en' ? item.en : item.es}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="bg-green-50 rounded-3xl p-8 border border-green-100">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                  <img 
                    src={floridaMap}
                    alt="Florida State Map - Telepsychiatry Services Available Statewide"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-green-500 bg-opacity-5"></div>
                  <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 rounded-lg shadow-lg px-4 py-3 border border-green-200">
                    <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                      <VideoIcon className="w-4 h-4" />
                      <span>{language === 'en' ? 'Available Statewide' : 'Disponible en Todo el Estado'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section - Cards with Image Placeholders and Mobile Carousel */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-4" data-testid="benefits-title">
                {language === 'en' ? (
                  <>Why Choose <span className="font-display italic text-green-700">Telepsychiatry</span>?</>
                ) : (
                  <>¿Por Qué Elegir <span className="font-display italic text-green-700">Telepsiquiatría</span>?</>
                )}
              </h2>
            </div>
            
            {/* Desktop Grid / Mobile Carousel */}
            <div className="relative">
              {/* Carousel for Mobile */}
              <div className="md:hidden">
                <div className="overflow-hidden" ref={emblaRef}>
                  <div className="flex">
                    {currentContent.benefits.items.map((benefit, index) => {
                      const benefitImages = [accessFromHomeImg, convenientSchedulingImg, securePrivateImg, continuityCareImg];
                      return (
                        <div key={index} className="flex-[0_0_100%] min-w-0 px-2">
                          <div className="bg-white rounded-2xl overflow-hidden border border-green-100 shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                            {/* Benefit Image */}
                            <div className="h-48 overflow-hidden">
                              <img 
                                src={benefitImages[index]} 
                                alt={benefit.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {/* Content */}
                            <div className="p-6">
                              <h3 className="text-lg font-body font-bold text-green-800 mb-3">
                                {benefit.title}
                              </h3>
                              <p className="text-gray-700 font-body leading-relaxed text-sm">
                                {benefit.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Carousel Controls */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    onClick={scrollPrev}
                    className="w-10 h-10 rounded-full bg-green-800 hover:bg-green-700 text-white flex items-center justify-center transition-colors"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={scrollNext}
                    className="w-10 h-10 rounded-full bg-green-800 hover:bg-green-700 text-white flex items-center justify-center transition-colors"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Desktop Grid */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentContent.benefits.items.map((benefit, index) => {
                  const benefitImages = [accessFromHomeImg, convenientSchedulingImg, securePrivateImg, continuityCareImg];
                  return (
                    <div key={index} className="bg-white rounded-2xl overflow-hidden border border-green-100 shadow-sm hover:shadow-md transition-shadow duration-300" data-testid={`benefit-${index}`}>
                      {/* Benefit Image */}
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={benefitImages[index]} 
                          alt={benefit.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-lg font-body font-bold text-green-800 mb-3">
                          {benefit.title}
                        </h3>
                        <p className="text-gray-700 font-body leading-relaxed text-sm">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-4" data-testid="process-title">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {currentContent.process.steps.map((step, index) => (
                <div key={index} className="relative" data-testid={`process-step-${index}`}>
                  <div className="bg-white rounded-2xl p-6 border border-green-100 h-full shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-green-800 text-white flex items-center justify-center text-xl font-bold">
                        {step.number}
                      </div>
                      <h3 className="text-lg font-body font-bold text-green-800">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-700 font-body leading-relaxed text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section - Cards with Image Placeholders and Mobile Carousel */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-4" data-testid="services-title">
                {language === 'en' ? (
                  <>Complete <span className="font-display italic text-green-700">Psychiatry Services</span> via Telemedicine</>
                ) : (
                  <>Servicios Completos de <span className="font-display italic text-green-700">Psiquiatría</span> a través de Telemedicina</>
                )}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6 font-body leading-relaxed" data-testid="services-description">
                {currentContent.services.description}
              </p>
            </div>
            
            {/* Desktop Grid / Mobile Carousel */}
            <div className="relative">
              {/* Carousel for Mobile */}
              <div className="md:hidden">
                <div className="overflow-hidden" ref={emblaRef2}>
                  <div className="flex">
                    {currentContent.services.list.map((service, index) => {
                      const serviceImages = [
                        initialEvaluationImg, 
                        anxietyDepressionImg, 
                        adhdManagementImg, 
                        ptsdTherapyImg, 
                        bipolarTreatmentImg, 
                        medicationManagementImg
                      ];
                      return (
                        <div key={index} className="flex-[0_0_100%] min-w-0 px-2">
                          <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                            {/* Service Image */}
                            <div className="h-48 overflow-hidden">
                              <img 
                                src={serviceImages[index]} 
                                alt={service.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {/* Content */}
                            <div className="p-6">
                              <h3 className="text-lg font-body font-bold text-green-800 mb-3">
                                {service.title}
                              </h3>
                              <p className="text-gray-600 font-body text-sm leading-relaxed">
                                {service.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Carousel Controls */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    onClick={scrollPrev2}
                    className="w-10 h-10 rounded-full bg-green-800 hover:bg-green-700 text-white flex items-center justify-center transition-colors"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={scrollNext2}
                    className="w-10 h-10 rounded-full bg-green-800 hover:bg-green-700 text-white flex items-center justify-center transition-colors"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Desktop Grid */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentContent.services.list.map((service, index) => {
                  const serviceImages = [
                    initialEvaluationImg, 
                    anxietyDepressionImg, 
                    adhdManagementImg, 
                    ptsdTherapyImg, 
                    bipolarTreatmentImg, 
                    medicationManagementImg
                  ];
                  return (
                    <div key={index} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300" data-testid={`service-${index}`}>
                      {/* Service Image */}
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={serviceImages[index]} 
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-lg font-body font-bold text-green-800 mb-3">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 font-body text-sm leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Doctor Section */}
        <DoctorSection />

        {/* Insurance Section */}
        <InsuranceLogos />

        {/* FAQ Section - Without Question Mark Icon */}
        <LocationFAQ 
          locationFAQs={locationFAQs.telehealth} 
          title={
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-8 text-center">
              {language === 'en' ? (
                <>
                  Frequently Asked <span className="font-display italic text-green-700">Questions</span>
                </>
              ) : (
                <>
                  Preguntas <span className="font-display italic text-green-700">Frecuentes</span>
                </>
              )}
            </h2>
          }
        />

        {/* Final CTA Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-green-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-4" data-testid="cta-title">
                {language === 'en' ? (
                  <>Ready to Get <span className="font-display italic text-green-700">Started</span>?</>
                ) : (
                  <>¿Listo para <span className="font-display italic text-green-700">Comenzar</span>?</>
                )}
              </h2>
              <p className="text-lg sm:text-xl text-gray-700 font-body leading-relaxed" data-testid="cta-description">
                {language === 'en' 
                  ? 'Quality mental health care is just a click away.'
                  : 'La atención de salud mental de calidad está a solo un clic de distancia.'
                }
              </p>
            </div>
            <CharmHealthBooking variant="prominent" showDescription={false} />
            
            {/* Badges below the card */}
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-blue-100">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <VideoIcon className="w-3 h-3 text-blue-600" />
                </div>
                <span className="text-gray-700 font-body font-medium text-xs sm:text-sm">
                  {language === 'en' ? 'Telehealth Available' : 'Telesalud Disponible'}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-blue-100">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-blue-600" />
                </div>
                <span className="text-gray-700 font-body font-medium text-xs sm:text-sm">
                  {language === 'en' ? 'Available 24/7' : 'Disponible 24/7'}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-blue-100">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-blue-600" />
                </div>
                <span className="text-gray-700 font-body font-medium text-xs sm:text-sm">
                  {language === 'en' ? 'Mobile Friendly' : 'Móvil Amigable'}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TelepsychiatryFlorida;
