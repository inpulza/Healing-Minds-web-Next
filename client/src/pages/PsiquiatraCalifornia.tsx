import { useEffect, useCallback } from 'react';
import { assetUrl } from '@/lib/asset-url';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';
import { Button } from '@/components/ui/button';
import { VideoIcon, CheckCircle, ChevronLeft, ChevronRight, Calendar, MessageCircle } from 'lucide-react';
import CompactVideoCarousel from '@/components/CompactVideoCarousel';
import Reviews from '@/components/Reviews';
import { useTikTokEvents } from '@/hooks/useTikTokEvents';
import { trackLeadConversion } from '@/lib/analytics';
import LocationFAQ from '@/components/LocationFAQ';
import { locationFAQs } from '@/data/locationFAQs';
import californiaMap from '../assets/california-map.webp?v=2';
import californiaHeroBg from '../assets/california-hero-bg.webp';
import useEmblaCarousel from 'embla-carousel-react';
import CharmHealthBooking from '@/components/CharmHealthBooking';
import DoctorSection from '@/components/DoctorSection';
import accessFromHomeImg from '@assets/generated_images/Access_from_anywhere_Florida_325859e3.webp';
import convenientSchedulingImg from '@assets/generated_images/Convenient_time_saving_66f1475e.webp';
import securePrivateImg from '@assets/generated_images/Private_secure_platform_a7ed7a02.webp';
import continuityCareImg from '@assets/generated_images/Continuity_of_care_87991256.webp';
import initialEvaluationImg from '@assets/generated_images/Initial_psychiatric_evaluation_99ae51a4.webp';
import anxietyDepressionImg from '@assets/generated_images/Anxiety_depression_calm_bdd7c98f.webp';
import adhdManagementImg from '@assets/generated_images/ADHD_evaluation_management_b7a38ebf.webp';
import bipolarTreatmentImg from '@assets/generated_images/Bipolar_balance_stability_da9b84ed.webp';
import medicationManagementImg from '@assets/generated_images/Medication_management_studio_556b9569.webp';

const PsiquiatraCalifornia = () => {
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
        ? 'Online Psychiatrist in Spanish | California | Healing Minds'
        : 'Psiquiatra Online en Español | California | Healing Minds',
      description: language === 'en'
        ? 'A psychiatrist who sees you in Spanish from home, anywhere in California. Anxiety, depression and ADHD. Direct pay, clear pricing, no insurance.'
        : 'Psiquiatra que te atiende en español desde tu casa, en California. Ansiedad, depresión y TDAH. Pago directo, precio claro, sin seguros.',
      keywords: language === 'en'
        ? 'online psychiatrist California, Spanish speaking psychiatrist California, telepsychiatry California, virtual psychiatrist California'
        : 'psiquiatra online California, psiquiatra en español California, telepsiquiatría California, psiquiatra virtual California',
      lang: language,
      canonical: language === 'en' ? '/psychiatrist-california' : '/es/psiquiatra-california'
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

  const whatsappUrl = `https://wa.me/12399201019?text=${language === 'es'
    ? encodeURIComponent('Hola, me gustaría información sobre una consulta psiquiátrica online desde California.')
    : encodeURIComponent('Hello, I would like information about an online psychiatric appointment from California.')}`;

  const content = {
    en: {
      hero: {
        subtitle: "Psychiatric care with Dr. Melva Reve, from the comfort of your home.",
        description: "Finding help for anxiety, depression, or ADHD is hard enough. Finding a psychiatrist who also understands you in your language should not be the hard part. Dr. Melva Reve is a psychiatrist and a native Spanish speaker. Not an app, not a chatbot: a doctor who sees you by video call, evaluates you, and follows up on your treatment."
      },
      benefits: {
        items: [
          {
            title: "Care in Your Language, for Real",
            description: "Not a translator or an interpreter. Dr. Reve is a native Spanish speaker and the daughter of immigrants. She understands how hard it can be to talk about mental health in a Latino family."
          },
          {
            title: "A Doctor, Not an App",
            description: "Dr. Reve is a psychiatrist. She can evaluate you, diagnose you, and follow up on your treatment. You always talk to her, not a different assistant every time."
          },
          {
            title: "You Know What You Will Pay",
            description: "Direct pay, no insurance in between. No authorizations, no billing surprises, no finding out halfway through that your plan does not cover what you need. You confirm the exact price before you book."
          },
          {
            title: "From Your Home, No Commute",
            description: "No traffic, no waiting rooms, no taking the day off. A video call from wherever you are, in a private space, at the time you booked."
          }
        ]
      },
      coverage: {
        description: "Dr. Reve sees patients by video call throughout the entire state of California. It does not matter if you are in Los Angeles, San Diego, the Central Valley, or anywhere else: you only need to be in California at the time of your appointment."
      },
      process: {
        description: "Getting started is simple and straightforward.",
        steps: [
          {
            number: "1",
            title: "Book Your Appointment",
            description: "Choose a day and time online, or call us."
          },
          {
            number: "2",
            title: "Receive Your Link",
            description: "You will get a private, secure video call link by email."
          },
          {
            number: "3",
            title: "Talk to Dr. Reve",
            description: "At your appointment time, join from your phone or computer. In Spanish or English, whichever you prefer."
          },
          {
            number: "4",
            title: "Continue Your Treatment",
            description: "Schedule your follow-up appointments and keep your treatment on track."
          }
        ]
      },
      services: {
        description: "Psychiatric evaluation and treatment follow-up for adults, by video call.",
        list: [
          {
            title: "Initial Psychiatric Evaluation",
            description: "A thorough first consultation to understand what is going on and decide together how to treat it."
          },
          {
            title: "Anxiety",
            description: "Evaluation and follow-up for anxiety disorders and panic attacks."
          },
          {
            title: "Depression",
            description: "Psychiatric care for depression, with continuous follow-up on your progress."
          },
          {
            title: "Adult ADHD",
            description: "Attention deficit evaluation in adults and treatment follow-up."
          },
          {
            title: "Treatment Follow-Up",
            description: "Regular appointments to review how you are doing and adjust whatever is needed."
          }
        ]
      },
      pricing: {
        description: "In California, appointments are direct pay. We do not work with insurance, and that has an advantage: you know exactly what you will pay before you book. No prior authorizations. No surprise copays. No calls to your insurer. Write to us on WhatsApp and we will confirm the exact price before you book.",
        rows: [
          { label: "Initial consultation (complete evaluation)", price: "60-minute video call" },
          { label: "Follow-up consultation", price: "30-minute video call" }
        ],
        note: "What does \"cash pay\" or direct pay mean? It is the term used in the United States for appointments paid directly to the practice, without going through health insurance. It does not mean paying in physical cash: you simply pay for your appointment like any other professional service, with no insurance claims and no prior authorizations."
      },
      cta: {
        description: "Book your first appointment with Dr. Reve and take the first step, in your language."
      }
    },
    es: {
      hero: {
        subtitle: "Atención psiquiátrica con la Dra. Melva Reve, desde la comodidad de tu casa.",
        description: "Buscar ayuda para la ansiedad, la depresión o el TDAH ya cuesta bastante. Encontrar una psiquiatra que además te entienda en tu idioma no debería ser lo difícil. La Dra. Melva Reve es médica psiquiatra y habla español de forma nativa. No es una aplicación ni un chat: es una doctora que te atiende por videollamada, te evalúa y da seguimiento a tu tratamiento."
      },
      benefits: {
        items: [
          {
            title: "Te Atiende en Tu Idioma, de Verdad",
            description: "No es un traductor ni un intérprete. La Dra. Reve es hablante nativa de español e hija de inmigrantes. Entiende lo que cuesta hablar de salud mental en una familia latina."
          },
          {
            title: "Una Doctora, No una Aplicación",
            description: "La Dra. Reve es médica psiquiatra. Puede evaluarte, diagnosticarte y hacer el seguimiento de tu tratamiento. Hablas siempre con ella, no con un asistente distinto cada vez."
          },
          {
            title: "Sabes lo que Vas a Pagar",
            description: "Pago directo, sin seguros de por medio. Sin autorizaciones, sin sorpresas en la factura, sin descubrir a mitad de camino que tu plan no cubre lo que necesitas. Confirmas el precio exacto antes de reservar."
          },
          {
            title: "Desde Tu Casa, Sin Desplazarte",
            description: "Sin tráfico, sin salas de espera, sin pedir el día libre. Una videollamada desde donde estés, en un espacio privado, a la hora que hayas reservado."
          }
        ]
      },
      coverage: {
        description: "La Dra. Reve atiende por videollamada a pacientes de todo el estado de California. Da igual si estás en Los Ángeles, en San Diego, en el Valle Central o en cualquier otro punto: solo necesitas estar en California en el momento de la cita."
      },
      process: {
        description: "Comenzar es simple y directo.",
        steps: [
          {
            number: "1",
            title: "Reserva Tu Cita",
            description: "Elige día y hora desde la web, o llama por teléfono."
          },
          {
            number: "2",
            title: "Recibe Tu Enlace",
            description: "Te llega por correo un enlace privado y seguro para la videollamada."
          },
          {
            number: "3",
            title: "Habla con la Dra. Reve",
            description: "A la hora de tu cita, entras desde el móvil o el ordenador. En español o en inglés, como prefieras."
          },
          {
            number: "4",
            title: "Continúa Tu Tratamiento",
            description: "Agenda tus citas de seguimiento y mantén tu tratamiento al día."
          }
        ]
      },
      services: {
        description: "Evaluación psiquiátrica y seguimiento del tratamiento para adultos, por videollamada.",
        list: [
          {
            title: "Evaluación Psiquiátrica Inicial",
            description: "Una primera consulta a fondo para entender qué te pasa y decidir juntos cómo tratarlo."
          },
          {
            title: "Ansiedad",
            description: "Evaluación y seguimiento para los trastornos de ansiedad y los ataques de pánico."
          },
          {
            title: "Depresión",
            description: "Atención psiquiátrica para la depresión, con seguimiento continuo de tu evolución."
          },
          {
            title: "TDAH en Adultos",
            description: "Evaluación de déficit de atención en adultos y seguimiento del tratamiento."
          },
          {
            title: "Seguimiento del Tratamiento",
            description: "Citas periódicas para revisar cómo vas y ajustar lo que haga falta."
          }
        ]
      },
      pricing: {
        description: "En California la consulta es de pago directo. No trabajamos con seguros, y eso tiene una ventaja: sabes exactamente lo que vas a pagar antes de reservar. Sin autorizaciones previas. Sin copagos sorpresa. Sin llamadas a tu aseguradora. Escríbenos por WhatsApp y te confirmamos el precio exacto antes de reservar.",
        rows: [
          { label: "Primera consulta (evaluación completa)", price: "Videollamada de 60 minutos" },
          { label: "Consulta de seguimiento", price: "Videollamada de 30 minutos" }
        ],
        note: "¿Qué significa \"cash pay\" o pago directo? Es el término que se usa en Estados Unidos para las consultas que se pagan directamente a la práctica, sin pasar por un seguro médico. No significa pagar en efectivo: simplemente pagas tu cita como cualquier otro servicio profesional, sin reclamos a aseguradoras ni autorizaciones previas."
      },
      cta: {
        description: "Reserva tu primera consulta con la Dra. Reve y da el primer paso, en tu idioma."
      }
    }
  };

  const currentContent = content[language];

  const benefitAltTexts = language === 'en' ? [
    "Dr. Melva Reve providing psychiatric care in Spanish by video call for patients in California",
    "A licensed physician, not an app - direct psychiatric care by video call",
    "Clear direct-pay pricing for online psychiatric consultations, no insurance paperwork",
    "Patient attending an online psychiatric appointment from home in California"
  ] : [
    "Dra. Melva Reve brindando atención psiquiátrica en español por videollamada para pacientes en California",
    "Una médica con licencia, no una aplicación - atención psiquiátrica directa por videollamada",
    "Precio claro de pago directo para consultas psiquiátricas online, sin trámites de seguros",
    "Paciente en una cita psiquiátrica online desde su casa en California"
  ];

  const serviceAltTexts = language === 'en' ? [
    "Initial psychiatric evaluation by video call - online mental health assessment in Spanish",
    "Online evaluation and follow-up for anxiety disorders and panic attacks",
    "Online psychiatric care for depression with continuous follow-up",
    "Adult ADHD evaluation and treatment follow-up by video call",
    "Regular follow-up appointments to review and adjust psychiatric treatment"
  ] : [
    "Evaluación psiquiátrica inicial por videollamada - evaluación de salud mental online en español",
    "Evaluación y seguimiento online para trastornos de ansiedad y ataques de pánico",
    "Atención psiquiátrica online para la depresión con seguimiento continuo",
    "Evaluación de TDAH en adultos y seguimiento del tratamiento por videollamada",
    "Citas periódicas de seguimiento para revisar y ajustar el tratamiento psiquiátrico"
  ];

  const benefitImages = [continuityCareImg, securePrivateImg, convenientSchedulingImg, accessFromHomeImg];
  const serviceImages = [initialEvaluationImg, anxietyDepressionImg, bipolarTreatmentImg, adhdManagementImg, medicationManagementImg];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-20 pb-12 sm:pb-16 lg:pb-20 bg-[#ffffff]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <div className="max-w-7xl mx-auto mb-10">
                <CharmHealthBooking
                  variant="prominent"
                  showDescription={false}
                  colorScheme="green"
                  heroImage={californiaHeroBg}
                  heroImageAlt={language === 'en'
                    ? 'Dr. Melva Reve providing secure online psychiatric consultations by video call in Spanish'
                    : 'Dra. Melva Reve brindando consultas psiquiátricas seguras en línea por videollamada en español'}
                  heroBadges={
                    <div className="flex flex-wrap gap-3">
                      {[
                        { en: 'In Spanish', es: 'En Español', icon: 'check' },
                        { en: 'Video Appointment', es: 'Consulta por Video', icon: 'video' },
                        { en: 'Adults 18+', es: 'Adultos 18+', icon: 'check' },
                        { en: 'Direct Pay', es: 'Pago Directo', icon: 'check' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-green-100">
                          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            {item.icon === 'video' ? (
                              <VideoIcon className="w-3 h-3 text-green-600" />
                            ) : (
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            )}
                          </div>
                          <span className="text-gray-700 font-body font-medium text-xs sm:text-sm">
                            {language === 'en' ? item.en : item.es}
                          </span>
                        </div>
                      ))}
                    </div>
                  }
                  heroTitle={
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-body font-bold text-green-800 text-left">
                      {language === 'en' ? (
                        <>
                          Online Psychiatrist in Spanish for{' '}
                          <span className="font-display italic text-green-700">California</span>
                        </>
                      ) : (
                        <>
                          Psiquiatra Online en Español para{' '}
                          <span className="font-display italic text-green-700">California</span>
                        </>
                      )}
                    </h1>
                  }
                  heroDescription={
                    <p className="text-sm md:text-base leading-relaxed font-body text-[#1e6b3b] max-w-md">
                      {currentContent.hero.description}
                    </p>
                  }
                />
              </div>
            </div>
          </div>
        </section>

        {/* California Coverage Section with Map */}
        <section className="py-12 sm:py-16 lg:py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-4">
                {language === 'en' ? (
                  <>Care Throughout <span className="font-display italic text-green-700">California</span></>
                ) : (
                  <>Atención en <span className="font-display italic text-green-700">Todo California</span></>
                )}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed mb-8">
                {currentContent.coverage.description}
              </p>

              {/* Feature Tags */}
              <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
                {[
                  {
                    en: 'Psychiatrist, M.D.',
                    es: 'Médica Psiquiatra'
                  },
                  {
                    en: 'California Licensed Psychiatrist · A198275',
                    es: 'Psiquiatra con Licencia en California · A198275'
                  },
                  {
                    en: 'In Spanish',
                    es: 'En Español'
                  },
                  {
                    en: 'From Your Home',
                    es: 'Desde Tu Casa'
                  },
                  {
                    en: 'Confidential',
                    es: 'Confidencial'
                  },
                  {
                    en: 'Adults 18+',
                    es: 'Adultos 18+'
                  },
                  {
                    en: 'All of California',
                    es: 'Todo California'
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
                    src={assetUrl(californiaMap)}
                    alt={language === 'en'
                      ? 'California state map - online psychiatric care available throughout the state'
                      : 'Mapa del estado de California - atención psiquiátrica online disponible en todo el estado'}
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

        {/* Benefits Section - Cards with Mobile Carousel */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-4" data-testid="benefits-title">
                {language === 'en' ? (
                  <>Why Choose <span className="font-display italic text-green-700">This Practice</span>?</>
                ) : (
                  <>Por Qué Elegir <span className="font-display italic text-green-700">Esta Consulta</span></>
                )}
              </h2>
            </div>

            {/* Desktop Grid / Mobile Carousel */}
            <div className="relative">
              {/* Carousel for Mobile */}
              <div className="md:hidden">
                <div className="overflow-hidden" ref={emblaRef}>
                  <div className="flex">
                    {currentContent.benefits.items.map((benefit, index) => (
                      <div key={index} className="flex-[0_0_100%] min-w-0 px-2">
                        <div className="bg-white rounded-2xl overflow-hidden border border-green-100 shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                          {/* Benefit Image */}
                          <div className="h-48 overflow-hidden">
                            <img
                              src={benefitImages[index]}
                              alt={benefitAltTexts[index]}
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
                    ))}
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
                {currentContent.benefits.items.map((benefit, index) => (
                  <div key={index} className="bg-white rounded-2xl overflow-hidden border border-green-100 shadow-sm hover:shadow-md transition-shadow duration-300" data-testid={`benefit-${index}`}>
                    {/* Benefit Image */}
                    <div className="h-48 overflow-hidden">
                      <img
                        src={benefitImages[index]}
                        alt={benefitAltTexts[index]}
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
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Symptoms Recognition Section */}
        <section id="sintomas" className="py-12 sm:py-16 lg:py-20 bg-green-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-4" data-testid="ca-symptoms-title">
                {language === 'en' ? (
                  <>Do You <span className="font-display italic text-green-700">Recognize</span> Yourself in This?</>
                ) : (
                  <>¿Te <span className="font-display italic text-green-700">Identificas</span> con Esto?</>
                )}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 font-body leading-relaxed max-w-2xl mx-auto">
                {language === 'en'
                  ? 'These signs do not always mean a diagnosis, but if they have been affecting your daily life for weeks, a professional evaluation can give you clarity and a plan.'
                  : 'Estas señales no siempre significan un diagnóstico, pero si llevan semanas afectando tu vida diaria, una evaluación profesional puede darte claridad y un plan.'}
              </p>
            </div>
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm border border-green-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {(language === 'en' ? [
                  'Worry or anxiety almost every day',
                  'Sadness or low mood that does not go away',
                  'Trouble sleeping or resting',
                  'Difficulty concentrating or finishing tasks',
                  'Irritability or mood changes',
                  'Constant tiredness, low energy'
                ] : [
                  'Preocupación o ansiedad casi todos los días',
                  'Tristeza o desánimo que no se va',
                  'Problemas para dormir o descansar',
                  'Dificultad para concentrarte o terminar tareas',
                  'Irritabilidad o cambios de humor',
                  'Cansancio constante, poca energía'
                ]).map((symptom, index) => (
                  <div key={index} className="flex items-center gap-3 py-2" data-testid={`ca-symptom-${index}`}>
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700 font-body">{symptom}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center mt-8">
              <p className="text-gray-600 font-body mb-6">
                {language === 'en' ? (
                  <><span className="font-bold text-green-700">1 in 5</span> adults in the U.S. experiences a mental health condition each year. You are not alone.</>
                ) : (
                  <><span className="font-bold text-green-700">1 de cada 5</span> adultos en EE. UU. experimenta un problema de salud mental cada año. No estás solo.</>
                )}
              </p>
              <Button
                onClick={() => {
                  trackLeadConversion('appointment_booking', { click_location: 'california_symptoms' });
                  trackTelehealthClick('california-symptoms-section');
                  window.open("https://ehr.charmtracker.com/publicCal.sas?method=getCal&digest=e54bdf77b791eb90cd5ef77f1bfb3dd742f7d5dfc96511bf80477815162a23b66ee57013c1a537e6a04718346ddb0ed8d95fcbc3b76e32a2", '_blank', 'noopener,noreferrer');
                }}
                className="bg-green-700 hover:bg-green-800 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                data-testid="ca-symptoms-cta"
              >
                <Calendar className="w-5 h-5 mr-2 inline" />
                {language === 'en' ? 'Book Your Evaluation' : 'Agenda Tu Evaluación'}
              </Button>
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

        {/* Services Section - Cards with Mobile Carousel */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-4" data-testid="services-title">
                {language === 'en' ? (
                  <>What We <span className="font-display italic text-green-700">Treat</span></>
                ) : (
                  <>Qué <span className="font-display italic text-green-700">Tratamos</span></>
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
                    {currentContent.services.list.map((service, index) => (
                      <div key={index} className="flex-[0_0_100%] min-w-0 px-2">
                        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                          {/* Service Image */}
                          <div className="h-48 overflow-hidden">
                            <img
                              src={serviceImages[index]}
                              alt={serviceAltTexts[index]}
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
                    ))}
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
                {currentContent.services.list.map((service, index) => (
                  <div key={index} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300" data-testid={`service-${index}`}>
                    {/* Service Image */}
                    <div className="h-48 overflow-hidden">
                      <img
                        src={serviceImages[index]}
                        alt={serviceAltTexts[index]}
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
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Doctor Section */}
        <DoctorSection />

        {/* Pricing Section - replaces insurance logos on this page */}
        <section className="py-12 sm:py-16 lg:py-20 bg-green-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-4" data-testid="pricing-title">
                {language === 'en' ? (
                  <>Clear <span className="font-display italic text-green-700">Pricing</span>, No Insurance</>
                ) : (
                  <>Precio <span className="font-display italic text-green-700">Claro</span>, Sin Seguros</>
                )}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 font-body leading-relaxed" data-testid="pricing-description">
                {currentContent.pricing.description}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden" data-testid="pricing-table">
              {currentContent.pricing.rows.map((row, index) => (
                <div key={index} className={`flex items-center justify-between px-6 py-5 ${index > 0 ? 'border-t border-green-100' : ''}`} data-testid={`pricing-row-${index}`}>
                  <span className="text-gray-700 font-body font-medium">
                    {row.label}
                  </span>
                  <span className="text-green-800 font-body font-bold">
                    {row.price}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-gray-600 font-body leading-relaxed text-center" data-testid="pricing-note">
              {currentContent.pricing.note}
            </p>
          </div>
        </section>

        {/* Google Reviews Section (real reviews, same as home page) */}
        <Reviews />

        {/* Video Section - A Conversation with Dr. Reve */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-lg border border-green-100">
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-4" data-testid="ca-video-title">
                  {language === 'en' ? (
                    <>A <span className="font-display italic text-green-700">Conversation</span> with Dr. Reve</>
                  ) : (
                    <>Una <span className="font-display italic text-green-700">Conversación</span> con la Dra. Reve</>
                  )}
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 font-body leading-relaxed max-w-3xl mx-auto">
                  {language === 'en'
                    ? 'Get to know her before your first appointment: short videos where she shares mental health tips, in Spanish.'
                    : 'Conócela antes de tu primera cita: videos cortos donde comparte consejos de salud mental, en español.'}
                </p>
              </div>
              <CompactVideoCarousel />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <LocationFAQ
          locationFAQs={locationFAQs.californiaTelehealth}
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

        {/* Compliance Section */}
        <section className="py-8 bg-green-50 border-t border-green-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-3 mb-5">
              {[
                {
                  en: 'HIPAA-Compliant Platform',
                  es: 'Plataforma Compatible con HIPAA'
                },
                {
                  en: 'Clinical Evaluations Only · Not an Online Pharmacy',
                  es: 'Solo Evaluaciones Clínicas · No es Farmacia en Línea'
                }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-green-100">
                  <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-2.5 h-2.5 text-green-600" />
                  </div>
                  <span className="text-gray-600 font-body font-medium text-xs">
                    {language === 'en' ? item.en : item.es}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-gray-400 font-body max-w-2xl mx-auto">
              {language === 'en'
                ? 'Virtual appointments are clinical consultations conducted by a licensed physician. Treatment plans are determined individually after evaluation. Not intended for emergencies: call 988 or 911 in a crisis.'
                : 'Las citas virtuales son consultas clínicas realizadas por una médica con licencia. Los planes de tratamiento se determinan individualmente tras la evaluación. No es para emergencias: llame al 988 o al 911 en una crisis.'}
            </p>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-green-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-4" data-testid="cta-title">
              {language === 'en' ? (
                <>Shall We <span className="font-display italic text-green-700">Start</span>?</>
              ) : (
                <>¿<span className="font-display italic text-green-700">Empezamos</span>?</>
              )}
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 font-body leading-relaxed mb-8" data-testid="cta-description">
              {currentContent.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => {
                  trackLeadConversion('appointment_booking', { click_location: 'california_final_cta' });
                  trackTelehealthClick('california-cta-section');
                  window.open("https://ehr.charmtracker.com/publicCal.sas?method=getCal&digest=e54bdf77b791eb90cd5ef77f1bfb3dd742f7d5dfc96511bf80477815162a23b66ee57013c1a537e6a04718346ddb0ed8d95fcbc3b76e32a2", '_blank', 'noopener,noreferrer');
                }}
                className="bg-green-700 hover:bg-green-800 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
                data-testid="cta-schedule-button"
              >
                <Calendar className="w-5 h-5 mr-2 inline" />
                {language === 'en' ? 'Book Your Appointment' : 'Agenda Tu Cita'}
              </Button>
              <Button
                onClick={() => {
                  trackLeadConversion('whatsapp', { click_location: 'california_landing' });
                  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                }}
                variant="outline"
                className="border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
                data-testid="cta-whatsapp-button"
              >
                <MessageCircle className="w-5 h-5 mr-2 inline" />
                {language === 'en' ? 'Message on WhatsApp' : 'Escribir por WhatsApp'}
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PsiquiatraCalifornia;
