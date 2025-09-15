import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ServiceHeroMasonry } from '@/components/ServiceHeroMasonry';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updateSEO, addServiceSchema } from '@/utils/seo';
import { ArrowRight, CheckCircle, Phone, Calendar, MapPin, Clock, Brain, Activity, Sparkles, HelpCircle, Users, MessageSquare, ChevronDown } from 'lucide-react';
import { IconBrain, IconHeart, IconMoodHappy, IconTarget } from '@tabler/icons-react';
import WellnessIcon from '@/components/WellnessIcon';

// Import generated images
import doctorImage from "@assets/generated_images/Professional_psychiatrist_office_photo_e259ed9b.png";
import adhdImage from "@assets/generated_images/ADHD_concentration_challenges_4b3ea4fb.png";
import therapyRoomImage from "@assets/generated_images/Therapy_room_interior_4b5878fd.png";
import focusImage from "@assets/dfb74c06-cc22-4bd4-a763-984d9e0fb151_1755252634353.png";

const AdhdTreatment = () => {
  const { language } = useLanguage();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'ADHD Treatment Naples FL - Adult ADHD Psychiatrist | Dr. Melva Reve'
        : 'Tratamiento TDAH Adultos en Naples, FL | Healing Minds Psychiatry',
      description: language === 'en'
        ? 'Expert ADHD treatment for adults in Naples, FL. Dr. Melva Reve provides comprehensive evaluation, medication management, and behavioral strategies for adults 18+. Bilingual ADHD psychiatrist.'
        : 'Tratamiento especializado de TDAH para adultos en Naples, FL. Dra. Melva Reve ofrece evaluación integral, manejo de medicamentos y estrategias personalizadas. Psiquiatra bilingüe experta.',
      keywords: language === 'en'
        ? 'ADHD treatment Naples FL, adult ADHD Naples, ADHD psychiatrist Naples, ADHD medication Naples, attention deficit disorder Naples, adult ADD Naples'
        : 'tratamiento TDAH adultos Naples FL, psiquiatra TDAH Naples, diagnóstico TDAH adultos, medicamento TDAH Naples, trastorno déficit atención adultos, Condado Collier TDAH',
      lang: language,
      canonical: '/services/adhd-treatment'
    };
    updateSEO(seoData);
    
    // Add Service Schema (SPOKE) - connects to MedicalClinic HUB
    addServiceSchema({
      serviceType: "ADHD Treatment",
      name: language === 'en' 
        ? "Tratamiento de TDAH en Naples, FL"
        : "ADHD Treatment in Naples, FL",
      description: language === 'en'
        ? "Expert ADHD treatment for adults with comprehensive evaluation, medication management, and behavioral strategies to improve focus and daily functioning."
        : "Tratamiento experto de TDAH para adultos con evaluación integral, manejo de medicamentos y estrategias conductuales para mejorar el enfoque y funcionamiento diario.",
      pageId: "adhd"
    });
  }, [language]);

  const symptoms = language === 'en' ? [
    {
      category: 'Inattention',
      items: [
        'Difficulty focusing on tasks or conversations',
        'Easily distracted by external stimuli',
        'Frequent forgetfulness in daily activities like paying bills',
        'Tendency to procrastinate on tasks requiring sustained mental effort'
      ]
    },
    {
      category: 'Hyperactivity',
      items: [
        'Constant restlessness, like moving feet or hands',
        'Difficulty remaining seated for extended periods',
        'Internal feeling of being always "on the go" or agitated',
        'Excessive talking'
      ]
    },
    {
      category: 'Impulsivity',
      items: [
        'Frequently interrupting others during conversations',
        'Making important decisions hastily without considering consequences',
        'Difficulty waiting for their turn',
        'Acting without thinking through the results'
      ]
    }
  ] : [
    {
      category: 'Inatención',
      items: [
        'Dificultad para concentrarse en tareas o conversaciones',
        'Se distrae con facilidad por estímulos externos',
        'Olvidos frecuentes en actividades diarias, como pagar facturas',
        'Tendencia a procrastinar, especialmente en tareas que requieren esfuerzo mental sostenido'
      ]
    },
    {
      category: 'Hiperactividad',
      items: [
        'Inquietud constante, como mover los pies o las manos',
        'Dificultad para permanecer sentado durante periodos prolongados',
        'Sensación interna de estar siempre "en marcha" o agitado',
        'Hablar en exceso'
      ]
    },
    {
      category: 'Impulsividad',
      items: [
        'Interrumpir a los demás con frecuencia durante las conversaciones',
        'Tomar decisiones importantes de forma precipitada sin pensar en las consecuencias',
        'Dificultad para esperar su turno',
        'Actuar sin pensar en los resultados'
      ]
    }
  ];

  const treatments = language === 'en' ? [
    {
      title: 'Comprehensive ADHD Assessment',
      description: 'Detailed evaluation using standardized tools and clinical interview to accurately diagnose ADHD and rule out other conditions.'
    },
    {
      title: 'Medication Management',
      description: 'Careful selection and monitoring of ADHD medications including stimulants and non-stimulants, tailored to individual needs.'
    },
    {
      title: 'Behavioral Strategies',
      description: 'Teaching practical skills for organization, time management, and focus improvement that work alongside medication.'
    },
    {
      title: 'Family Education',
      description: 'Supporting families with understanding ADHD and implementing effective strategies at home and school.'
    },
    {
      title: 'Academic/Work Accommodations',
      description: 'Guidance on appropriate accommodations for school or workplace to optimize success and performance.'
    },
    {
      title: 'Ongoing Support',
      description: 'Regular monitoring and adjustment of treatment as life circumstances and needs change over time.'
    }
  ] : [
    {
      title: 'Evaluación Integral de TDAH',
      description: 'Evaluación detallada usando herramientas estandarizadas y entrevista clínica para diagnosticar TDAH con precisión y descartar otras condiciones.'
    },
    {
      title: 'Manejo de Medicamentos',
      description: 'Selección cuidadosa y monitoreo de medicamentos para TDAH incluyendo estimulantes y no estimulantes, adaptados a necesidades individuales.'
    },
    {
      title: 'Estrategias Conductuales',
      description: 'Enseñar habilidades prácticas para organización, manejo del tiempo y mejora del enfoque que funcionan junto con medicamentos.'
    },
    {
      title: 'Educación Familiar',
      description: 'Apoyar a las familias con la comprensión del TDAH e implementar estrategias efectivas en casa y la escuela.'
    },
    {
      title: 'Acomodaciones Académicas/Laborales',
      description: 'Orientación sobre acomodaciones apropiadas para la escuela o lugar de trabajo para optimizar el éxito y rendimiento.'
    },
    {
      title: 'Apoyo Continuo',
      description: 'Monitoreo regular y ajuste del tratamiento según cambien las circunstancias de vida y necesidades con el tiempo.'
    }
  ];

  const ageGroups = language === 'en' ? [
    {
      title: 'Adults (18+)',
      description: 'Many adults discover they have ADHD later in life. We provide comprehensive evaluation and treatment for adult ADHD.',
      features: [
        'Late-diagnosed ADHD assessment',
        'Career and relationship impact',
        'Adult-specific treatment strategies',
        'Workplace accommodation guidance'
      ]
    },
    {
      title: 'Teens (13-17)',
      description: 'Adolescence brings unique challenges for teens with ADHD. We help navigate academic and social difficulties.',
      features: [
        'School-focused treatment plans',
        'Transition planning for college',
        'Family therapy coordination',
        'Peer relationship support'
      ]
    }
  ] : [
    {
      title: 'Adultos (18+)',
      description: 'Muchos adultos descubren que tienen TDAH más tarde en la vida. Brindamos evaluación y tratamiento integral para TDAH en adultos.',
      features: [
        'Evaluación de TDAH diagnosticado tardíamente',
        'Impacto en carrera y relaciones',
        'Estrategias de tratamiento específicas para adultos',
        'Orientación para acomodaciones laborales'
      ]
    },
    {
      title: 'Adolescentes (13-17)',
      description: 'La adolescencia trae desafíos únicos para adolescentes con TDAH. Ayudamos a navegar dificultades académicas y sociales.',
      features: [
        'Planes de tratamiento enfocados en la escuela',
        'Planificación de transición para universidad',
        'Coordinación de terapia familiar',
        'Apoyo en relaciones con compañeros'
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section with Masonry Layout */}
        <ServiceHeroMasonry
          tagline={{
            en: 'Focus & Success',
            es: 'Enfoque y Éxito'
          }}
          title={{
            en: 'Adult ADHD Treatment in Naples, FL',
            es: 'Tratamiento Especializado de TDAH para Adultos en Naples, FL'
          }}
          description={{
            en: 'Unlock your potential with expert ADHD treatment. Dr. Melva Reve provides comprehensive evaluation and personalized treatment for adults 18+ with attention deficit hyperactivity disorder.',
            es: 'Desbloquee su potencial con tratamiento experto de TDAH. La Dra. Melva Reve brinda evaluación integral y tratamiento personalizado para adultos 18+ con trastorno por déficit de atención e hiperactividad.'
          }}
          specialNote={{
            es: '<strong>El TDAH no es una limitación, es una diferencia en el funcionamiento del cerebro.</strong> Con el tratamiento adecuado, puede aprovechar sus fortalezas únicas y alcanzar su máximo potencial. Ofrecemos evaluación y tratamiento especializado.'
          }}
          facts={{
            title: {
              en: 'ADHD Facts',
              es: 'Datos sobre TDAH'
            },
            items: [
              {
                en: '4.4% of adults have ADHD',
                es: '4.4% de adultos tienen TDAH'
              },
              {
                en: 'Highly treatable with proper care',
                es: 'Altamente tratable con atención adecuada'
              },
              {
                en: 'Affects focus, organization, and impulse control',
                es: 'Afecta enfoque, organización y control de impulsos'
              },
              {
                en: 'Bilingual evaluation available',
                es: 'Evaluación bilingüe disponible'
              }
            ]
          }}
          quickStats={{
            items: [
              {
                en: 'Comprehensive ADHD evaluation',
                es: 'Evaluación integral de TDAH'
              },
              {
                en: 'Adult-focused treatment',
                es: 'Tratamiento enfocado en adultos'
              },
              {
                en: 'Medication management',
                es: 'Manejo de medicamentos'
              }
            ]
          }}
          images={{
            doctorImage,
            therapyRoomImage: adhdImage,
            symbolImage: therapyRoomImage
          }}
        />

        {/* Identification Section - ¿Te Sientes Identificado? */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {language === 'en' ? (
                  <>Do You Feel <span className="font-display italic text-green-700">Identified</span>?</>
                ) : (
                  <>¿Te Sientes <span className="font-display italic text-green-700">Identificado</span>?</>
                )}
              </h2>
              <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                {language === 'en' ? 'Adult ADHD in Collier County' : 'El TDAH en la Vida Adulta en el Condado de Collier'}
              </div>
            </div>

            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
              <p className="text-lg mb-6">
                {language === 'en'
                  ? 'Do you feel like you have to work twice as hard to maintain focus at work? Do everyday tasks like organizing your schedule or remembering appointments become a constant source of stress? You are not alone. For many adults in Naples and throughout Collier County, these challenges are not a reflection of their ability or intelligence, but persistent symptoms of Attention Deficit Hyperactivity Disorder (ADHD).'
                  : '¿Sientes que te esfuerzas el doble para mantener la concentración en el trabajo? ¿Las tareas cotidianas como organizar tu agenda o recordar citas se convierten en una fuente constante de estrés? No estás solo. Para muchos adultos en Naples y en todo el Condado de Collier, estos desafíos no son un reflejo de su capacidad o inteligencia, sino síntomas persistentes del Trastorno por Déficit de Atención e Hiperactividad (TDAH).'
                }
              </p>
              
              <p className="text-lg">
                {language === 'en'
                  ? 'Living with undiagnosed or untreated ADHD in adulthood can affect your professional career, personal relationships, and self-esteem. But there is a path to clarity and control. At Healing Minds Psychiatry, we understand the nuances of ADHD in adults and offer a compassionate and effective approach to help you thrive.'
                  : 'Vivir con TDAH no diagnosticado o no tratado en la edad adulta puede afectar tu carrera profesional, tus relaciones personales y tu autoestima. Pero hay un camino hacia la claridad y el control. En Healing Minds Psychiatry, entendemos los matices del TDAH en adultos y ofrecemos un enfoque compasivo y efectivo para ayudarte a prosperar.'
                }
              </p>
            </div>
          </div>
        </section>


        {/* Treatment Process Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {language === 'en' ? (
                  <>Our <span className="font-display italic text-green-700">Comprehensive</span> Process</>
                ) : (
                  <>Nuestro Proceso de Diagnóstico y <span className="font-display italic text-green-700">Tratamiento</span></>
                )}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {language === 'en'
                  ? 'Our method is comprehensive and centered on you. We don\'t believe in one-size-fits-all solutions; instead, we design a treatment plan that adapts to your life, needs, and personal and professional goals.'
                  : 'Nuestro método es integral y se centra en ti. No creemos en soluciones únicas; en su lugar, diseñamos un plan de tratamiento que se adapta a tu vida, tus necesidades y tus objetivos personales y profesionales.'
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  step: 1,
                  title: language === 'en' ? 'Complete and Accurate Evaluation' : 'Evaluación Completa y Precisa',
                  description: language === 'en' 
                    ? 'The first step is a comprehensive diagnostic evaluation. We use standardized tools and detailed clinical interview to confirm ADHD diagnosis, rule out other conditions, and thoroughly understand how it affects you daily.'
                    : 'El primer paso es una evaluación diagnóstica exhaustiva. Utilizamos herramientas estandarizadas y una entrevista clínica detallada para confirmar el diagnóstico de TDAH, descartar otras condiciones y comprender a fondo cómo te afecta en tu día a día.'
                },
                {
                  step: 2,
                  title: language === 'en' ? 'Personalized Treatment Plans' : 'Planes de Tratamiento Personalizados',
                  description: language === 'en'
                    ? 'Your treatment plan is unique. While medication can be a very effective tool, we believe in a multifaceted approach. We combine medication management with practical strategies and supportive therapy for sustainable results.'
                    : 'Tu plan de tratamiento es único. Si bien la medicación puede ser una herramienta muy eficaz, creemos en un enfoque multifacético. Combinamos el manejo de medicamentos con estrategias prácticas y terapia de apoyo para ofrecerte resultados sostenibles.'
                },
                {
                  step: 3,
                  title: language === 'en' ? 'Effective Medication Management' : 'Manejo Efectivo de Medicamentos',
                  description: language === 'en'
                    ? 'When medication is appropriate, Dr. Reve works with you to find the optimal type and dose, whether stimulants or non-stimulants. We provide careful monitoring to maximize benefits and minimize side effects, adjusting the plan as needed.'
                    : 'Cuando la medicación es apropiada, la Dra. Reve trabaja contigo para encontrar el tipo y la dosis óptima, ya sean estimulantes o no estimulantes. Realizamos un seguimiento cuidadoso para maximizar los beneficios y minimizar los efectos secundarios, ajustando el plan según sea necesario.'
                },
                {
                  step: 4,
                  title: language === 'en' ? 'Daily Life Strategies and Skills' : 'Estrategias y Habilidades para el Día a Día',
                  description: language === 'en'
                    ? 'We equip you with practical tools to manage ADHD symptoms. This includes organization techniques, time management, focus improvement, and strategies for dealing with impulsivity, enabling you to succeed both at work and at home.'
                    : 'Te equipamos con herramientas prácticas para manejar los síntomas del TDAH. Esto incluye técnicas de organización, gestión del tiempo, mejora del enfoque y estrategias para afrontar la impulsividad, permitiéndote tener éxito tanto en el trabajo como en casa.'
                }
              ].map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xl">{item.step}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-green-800 mb-4">{item.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Adult ADHD Treatment Section */}
        <section className="py-16 sm:py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 shadow-lg border border-green-100">
              {/* Header Section */}
              <div className="text-center mb-10">
                <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  {language === 'en' ? 'Adult-Focused Care' : 'Atención Enfocada en Adultos'}
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                  {language === 'en' ? (
                    <>Adult ADHD Treatment in <span className="font-display italic text-green-700">Naples</span></>
                  ) : (
                    <>Tratamiento de TDAH para Adultos en <span className="font-display italic text-green-700">Naples</span></>
                  )}
                </h2>
                
                {/* Key Stats */}
                <div className="flex justify-center">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-xs sm:max-w-md">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-6">
                      <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">4.4%</div>
                      <div className="text-xs sm:text-sm text-gray-600 font-body">
                        {language === 'en' ? 'Adults have ADHD' : 'Adultos tienen TDAH'}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 sm:p-6">
                      <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">85%</div>
                      <div className="text-xs sm:text-sm text-gray-600 font-body">
                        {language === 'en' ? 'Treatment success rate' : 'Tasa de éxito del tratamiento'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content with Photo */}
              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-10">
                <div>
                  <p className="text-lg text-gray-600 mb-8 font-body leading-relaxed">
                    {language === 'en'
                      ? 'Many adults discover they have ADHD later in life. Dr. Melva Reve, M.D., a board-certified psychiatrist, provides comprehensive evaluation and treatment specifically designed for adults 18+ with ADHD. She sees you not just as a set of symptoms, but as a complete person with unique goals and challenges.'
                      : 'Muchos adultos descubren que tienen TDAH más tarde en la vida. La Dra. Melva Reve, M.D., una psiquiatra certificada, brinda evaluación integral y tratamiento específicamente diseñado para adultos de 18+ con TDAH. Ella no solo te ve como un conjunto de síntomas, sino como una persona completa con metas y desafíos únicos.'
                    }
                  </p>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-bold text-green-800 mb-3">
                      {language === 'en' ? 'Bilingual Care (English & Spanish)' : 'Atención Bilingüe (Inglés y Español)'}
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {language === 'en'
                        ? 'Dr. Reve is fully bilingual, offering evaluations and treatments in both English and Spanish. This eliminates language barriers and ensures accessible mental health care for the entire Naples community.'
                        : 'La Dra. Reve es completamente bilingüe, ofreciendo evaluaciones y tratamientos tanto en inglés como en español. Esto elimina las barreras del idioma y asegura un cuidado de salud mental accesible para toda la comunidad de Naples.'
                      }
                    </p>
                  </div>

                  <Link href="/contact">
                    <Button className="group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full text-sm sm:text-base lg:text-lg font-semibold transition-all duration-300 bg-green-700 text-white hover:bg-green-800 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-7 w-full sm:w-auto">
                      <span className="text-center">{language === 'en' ? 'Schedule ADHD Evaluation' : 'Programar Evaluación TDAH'}</span>
                      <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9 min-w-[1.5rem] min-h-[1.5rem] sm:min-w-[2rem] sm:min-h-[2rem] lg:min-w-[2.25rem] lg:min-h-[2.25rem] rounded-full flex items-center justify-center transition-all duration-300 bg-green-600 flex-shrink-0">
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                      </div>
                    </Button>
                  </Link>
                </div>

                <div className="w-full">
                  <div className="w-full aspect-[4/3] overflow-hidden rounded-xl shadow-lg mb-6 max-w-full">
                    <img 
                      src={focusImage}
                      alt="Professional therapist reviewing ADHD treatment plans - Dr. Melva Reve's modern psychiatric practice"
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>

              {/* Dr. Reve Quote Section */}
              <div className="border-t border-gray-200 pt-8 mb-8">
                <div className="max-w-4xl mx-auto text-center">
                  <div className="mb-6">
                    <div className="w-1 h-12 bg-green-600 mx-auto mb-6"></div>
                    <blockquote className="text-xl lg:text-2xl text-gray-700 font-light leading-relaxed italic">
                      {language === 'en'
                        ? '"Throughout my career, I have seen firsthand how an ADHD diagnosis in adulthood can be both challenging and revelatory. My passion, especially here in the Naples community, is to offer a safe and bilingual space where my patients not only receive treatment, but also rediscover their strengths and learn to thrive."'
                        : '"A lo largo de mi carrera, he visto de primera mano cómo un diagnóstico de TDAH en la etapa adulta puede ser tanto un desafío como una revelación. Mi pasión, especialmente aquí en la comunidad de Naples, es ofrecer un espacio seguro y bilingüe donde mis pacientes no solo reciben un tratamiento, sino que también redescubren sus fortalezas y aprenden a prosperar."'
                      }
                    </blockquote>
                    <cite className="block text-green-800 font-semibold text-lg mt-6">
                      - Dra. Melva Reve, M.D.
                    </cite>
                  </div>
                </div>
              </div>

              {/* Bottom Section - Treatment Options in 2x2 Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {[
                  {
                    title: language === 'en' ? 'Late-Diagnosed ADHD Assessment' : 'Evaluación de TDAH Diagnosticado Tardíamente',
                    description: language === 'en' ? 'Comprehensive evaluation for adults who suspect they may have ADHD.' : 'Evaluación integral para adultos que sospechan que pueden tener TDAH.'
                  },
                  {
                    title: language === 'en' ? 'Adult-Specific Treatment Strategies' : 'Estrategias de Tratamiento Específicas para Adultos',
                    description: language === 'en' ? 'Tailored approaches for managing ADHD in work and personal life.' : 'Enfoques adaptados para manejar el TDAH en el trabajo y la vida personal.'
                  },
                  {
                    title: language === 'en' ? 'Career and Relationship Impact' : 'Impacto en Carrera y Relaciones',
                    description: language === 'en' ? 'Addressing how ADHD affects professional and personal relationships.' : 'Abordar cómo el TDAH afecta las relaciones profesionales y personales.'
                  },
                  {
                    title: language === 'en' ? 'Workplace Accommodation Guidance' : 'Orientación para Acomodaciones Laborales',
                    description: language === 'en' ? 'Support with obtaining appropriate workplace accommodations.' : 'Apoyo para obtener acomodaciones laborales apropiadas.'
                  }
                ].map((treatment, index) => (
                  <div key={index} className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-bold text-xs sm:text-sm">{index + 1}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-body font-bold text-green-800 mb-2">{treatment.title}</h3>
                        <p className="text-gray-600 font-body text-xs sm:text-sm leading-relaxed">{treatment.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Symptoms Section */}
        <section className="py-16 sm:py-20 bg-[#ffffff]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {language === 'en' ? (
                  <>Recognizing <span className="font-display italic text-green-700">ADHD</span> Symptoms</>
                ) : (
                  <>Reconociendo Síntomas del <span className="font-display italic text-green-700">TDAH</span></>
                )}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'ADHD symptoms fall into three main categories. You may experience symptoms from one or more categories.'
                  : 'Los síntomas del TDAH se dividen en tres categorías principales. Puede experimentar síntomas de una o más categorías.'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {symptoms.map((category, index) => {
                const backgroundClasses: { [key: number]: string } = {
                  0: 'bg-blue-50',
                  1: 'bg-green-50', 
                  2: 'bg-purple-50'
                };
                
                return (
                  <div
                    key={index}
                    className={`rounded-2xl sm:rounded-3xl ${backgroundClasses[index]} min-h-[400px] flex flex-col`}
                  >
                    <div className="p-6 sm:p-8 text-green-800 flex flex-col h-full">
                      {/* Header */}
                      <div className="text-center mb-6">
                        {/* Icon and Category Group */}
                        <div className="mb-4">
                          <div className="inline-flex p-4 rounded-2xl bg-[#00ff5c4f]">
                            <Brain className="w-8 h-8 text-green-800" />
                          </div>
                          <div className="block">
                            <div className="px-3 py-1 rounded-full text-xs font-bold text-green-800 inline-block mt-2">
                              {language === 'en' ? 'Category' : 'Categoría'} {index + 1}
                            </div>
                          </div>
                        </div>
                        
                        <h3 className="text-xl sm:text-2xl font-display font-bold mb-3 text-green-800">
                          {category.category}
                        </h3>
                        
                        <p className="text-green-800 font-body leading-relaxed text-sm sm:text-base">
                          {language === 'en'
                            ? 'Common symptoms that affect daily functioning and quality of life.'
                            : 'Síntomas comunes que afectan el funcionamiento diario y la calidad de vida.'
                          }
                        </p>
                      </div>

                      {/* Features List */}
                      <div className="flex-grow">
                        <div className="space-y-3 mb-6">
                          {category.items.map((item, itemIndex) => (
                            <div 
                              key={itemIndex}
                              className="flex items-center gap-3 p-3 rounded-xl"
                            >
                              <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                              <span className="text-sm font-body text-green-800">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-auto">
                        <div className="p-4 rounded-xl bg-[#ffffff]">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-800">
                              {language === 'en' ? 'Symptom Focus' : 'Enfoque de Síntoma'}
                            </span>
                            <div className="flex items-center gap-1">
                              <Activity className="w-4 h-4 text-green-800" />
                              <span className="text-xs font-medium text-green-800">
                                {language === 'en' ? 'Daily Impact' : 'Impacto Diario'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ADHD vs Work Stress Comparison Table */}
        <section className="py-16 sm:py-20 bg-green-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {language === 'en' ? (
                  <>Adult ADHD vs. <span className="font-display italic text-green-700">Work Stress</span></>
                ) : (
                  <>TDAH en Adultos vs. <span className="font-display italic text-green-700">Estrés Laboral</span></>
                )}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {language === 'en'
                  ? 'Understanding the difference between ADHD symptoms and common work stress helps with accurate diagnosis.'
                  : 'Diferenciando los síntomas del TDAH del estrés laboral común para un diagnóstico preciso.'
                }
              </p>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-green-100">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold text-green-800">
                        {language === 'en' ? 'Symptom' : 'Síntoma'}
                      </th>
                      <th className="px-6 py-4 text-left font-bold text-green-800">
                        {language === 'en' ? 'ADHD in Adults' : 'TDAH en Adultos'}
                      </th>
                      <th className="px-6 py-4 text-left font-bold text-green-800">
                        {language === 'en' ? 'Common Work Stress' : 'Estrés Laboral Común'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        symptom: language === 'en' ? 'Main Cause' : 'Causa Principal',
                        adhd: language === 'en' ? 'Chronic neurobiological condition' : 'Condición neurobiológica crónica',
                        stress: language === 'en' ? 'Related to specific situations or deadlines' : 'Relacionado con situaciones o plazos específicos'
                      },
                      {
                        symptom: language === 'en' ? 'Duration' : 'Duración',
                        adhd: language === 'en' ? 'Present since childhood/adolescence' : 'Presente desde la infancia/adolescencia',
                        stress: language === 'en' ? 'Tends to decrease when stressful situation improves' : 'Tiende a disminuir cuando la situación estresante mejora'
                      },
                      {
                        symptom: language === 'en' ? 'Scope' : 'Ámbito',
                        adhd: language === 'en' ? 'Affects multiple life areas (work, home, social)' : 'Afecta a múltiples áreas de la vida (trabajo, hogar, social)',
                        stress: language === 'en' ? 'Primarily centered on work environment' : 'Principalmente centrado en el entorno laboral'
                      }
                    ].map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-6 py-4 font-semibold text-gray-800">{row.symptom}</td>
                        <td className="px-6 py-4 text-gray-700">{row.adhd}</td>
                        <td className="px-6 py-4 text-gray-700">{row.stress}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>


        {/* Final Call to Action */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-green-600 to-green-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 shadow-xl">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {language === 'en' ? (
                  <>Take the First Step to <span className="font-display italic text-green-700">Regain Your Focus</span></>
                ) : (
                  <>Da el Primer Paso para Recuperar tu <span className="font-display italic text-green-700">Enfoque</span></>
                )}
              </h2>
              
              <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                {language === 'en' ? 'Naples, FL - Adult ADHD Specialists' : 'Naples, FL - Especialistas en TDAH para Adultos'}
              </div>

              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                {language === 'en'
                  ? 'Don\'t let ADHD define your potential. With the right support and strategy, you can learn to manage your symptoms and use your strengths to achieve your goals. If you\'re ready to take control, our team in Naples is here to help you.'
                  : 'No dejes que el TDAH defina tu potencial. Con el apoyo y la estrategia adecuados, puedes aprender a manejar tus síntomas y utilizar tus fortalezas para alcanzar tus metas. Si estás listo para tomar el control, nuestro equipo en Naples está aquí para ayudarte.'
                }
              </p>

              <p className="text-xl font-bold text-green-800 mb-8">
                {language === 'en' 
                  ? 'Call now to schedule your confidential evaluation.'
                  : 'Llama ahora para agendar tu evaluación confidencial.'
                }
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="tel:+12394230272"
                  className="group inline-flex items-center justify-center gap-3 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 bg-green-700 text-white hover:bg-green-800 px-8 py-4"
                  data-testid="button-call-now"
                >
                  <Phone className="w-5 h-5" />
                  <span>
                    {language === 'en' ? 'Call Now: (239) 423-0272' : 'Llamar Ahora: (239) 423-0272'}
                  </span>
                </a>
                
                <Link href="/contact">
                  <Button 
                    variant="outline" 
                    className="group inline-flex items-center justify-center gap-3 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 border-2 border-green-700 text-green-700 hover:bg-green-50 px-8 py-4"
                    data-testid="button-schedule-online"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>
                      {language === 'en' ? 'Schedule Online' : 'Programar en Línea'}
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Treatment Approach Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {language === 'en' ? (
                  <>Our <span className="font-display italic text-green-700">Comprehensive</span> Treatment Approach</>
                ) : (
                  <>Nuestro Enfoque de Tratamiento <span className="font-display italic text-green-700">Integral</span></>
                )}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'Dr. Melva Reve uses a multi-faceted approach to ADHD treatment, combining medication management with behavioral strategies and family support.'
                  : 'La Dra. Melva Reve usa un enfoque multifacético para el tratamiento del TDAH, combinando manejo de medicamentos con estrategias conductuales y apoyo familiar.'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {treatments.map((treatment, index) => {
                const backgroundClasses: { [key: number]: string } = {
                  0: 'bg-blue-50',
                  1: 'bg-green-50',
                  2: 'bg-purple-50',
                  3: 'bg-orange-50',
                  4: 'bg-teal-50',
                  5: 'bg-pink-50'
                };
                
                return (
                  <div
                    key={index}
                    className={`rounded-2xl sm:rounded-3xl ${backgroundClasses[index]} min-h-[300px] flex flex-col`}
                  >
                    <div className="p-6 sm:p-8 text-green-800 flex flex-col h-full">
                      {/* Header */}
                      <div className="text-center mb-6">
                        {/* Icon and Step Group */}
                        <div className="mb-4">
                          <div className="inline-flex p-4 rounded-2xl bg-[#00ff5d4d]">
                            <CheckCircle className="w-8 h-8 text-green-800" />
                          </div>
                          <div className="block">
                            <div className="px-3 py-1 rounded-full text-xs font-bold text-green-800 inline-block mt-2">
                              {language === 'en' ? 'Step' : 'Paso'} {index + 1}
                            </div>
                          </div>
                        </div>
                        
                        <h3 className="text-xl sm:text-2xl font-display font-bold mb-3 text-green-800">
                          {treatment.title}
                        </h3>
                        
                        <p className="text-green-800 font-body leading-relaxed text-sm sm:text-base">
                          {treatment.description}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="mt-auto">
                        <div className="p-4 rounded-xl bg-[#ffffff]">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-800">
                              {language === 'en' ? 'Treatment Focus' : 'Enfoque de Tratamiento'}
                            </span>
                            <div className="flex items-center gap-1">
                              <Sparkles className="w-4 h-4 text-green-800" />
                              <span className="text-xs font-medium text-green-800">
                                {language === 'en' ? 'Expert Care' : 'Atención Experta'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {language === 'en' ? (
                  <>Frequently Asked <span className="font-display italic text-green-700">Questions</span></>
                ) : (
                  <>Preguntas <span className="font-display italic text-green-700">Frecuentes</span></>
                )}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {language === 'en'
                  ? 'Common questions about adult ADHD treatment in Naples, FL'
                  : 'Preguntas comunes sobre el tratamiento del TDAH en adultos en Naples, FL'
                }
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {[
                {
                  question: language === 'en' 
                    ? 'What is the first step to treat ADHD if I am an adult?'
                    : '¿Cuál es el primer paso para tratar el TDAH si soy adulto?',
                  answer: language === 'en'
                    ? 'The first and most important step is to seek a complete professional evaluation with a qualified psychiatrist, like Dr. Reve. An accurate diagnosis is fundamental to creating an effective treatment plan.'
                    : 'El primer y más importante paso es buscar una evaluación profesional completa con un psiquiatra cualificado, como la Dra. Reve. Un diagnóstico preciso es fundamental para crear un plan de tratamiento efectivo.'
                },
                {
                  question: language === 'en'
                    ? 'Does ADHD treatment always include medications?'
                    : '¿El tratamiento para el TDAH siempre incluye medicamentos?',
                  answer: language === 'en'
                    ? 'Not necessarily. While medications are highly effective for many adults, they are not the only option. The best approach often combines therapy, behavioral strategies, and, if appropriate, medication. The plan is personalized for you.'
                    : 'No necesariamente. Si bien los medicamentos son altamente efectivos para muchos adultos, no son la única opción. El mejor enfoque a menudo combina terapia, estrategias de comportamiento y, si es apropiado, medicación. El plan se personaliza para ti.'
                },
                {
                  question: language === 'en'
                    ? 'How can therapy help in my work and relationships?'
                    : '¿Cómo puede ayudar la terapia en mi trabajo y relaciones?',
                  answer: language === 'en'
                    ? 'Therapy can provide you with invaluable tools to better manage time, improve your organizational and communication skills, and understand how ADHD influences your interactions. This can lead to reduced stress and healthier, more productive relationships.'
                    : 'La terapia puede proporcionarte herramientas invaluables para gestionar mejor el tiempo, mejorar tus habilidades de organización y comunicación, y comprender cómo el TDAH influye en tus interacciones. Esto puede conducir a una reducción del estrés y a relaciones más saludables y productivas.'
                },
                {
                  question: language === 'en'
                    ? 'Do you offer telepsychiatry for ADHD treatment in Florida?'
                    : '¿Ofrecen telepsiquiatría para el tratamiento del TDAH en Florida?',
                  answer: language === 'en'
                    ? <>Yes, at Healing Minds Psychiatry we offer telepsychiatry services from <Link href="/locations/psychiatrist-naples" className="text-green-700 hover:text-green-800 underline">our Naples, FL practice</Link>. This allows you to receive expert care and follow-up from the comfort of your home, as long as you are located within the state of Florida.</>
                    : <>Sí, en Healing Minds Psychiatry ofrecemos servicios de telepsiquiatría desde <Link href="/locations/psychiatrist-naples" className="text-green-700 hover:text-green-800 underline">nuestra práctica en Naples, FL</Link>. Esto te permite recibir atención experta y seguimiento desde la comodidad de tu hogar, siempre que te encuentres en el estado de Florida.</>
                }
              ].map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden"
                  data-testid={`faq-item-${index}`}
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 text-left flex items-center justify-between hover:bg-green-50 transition-colors duration-200"
                    data-testid={`faq-question-${index}`}
                  >
                    <h3 className="text-lg sm:text-xl font-display font-semibold text-gray-900 pr-4 sm:pr-8">
                      {faq.question}
                    </h3>
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                      openFAQ === index 
                        ? 'bg-green-600' 
                        : 'bg-green-200'
                    }`}>
                      <ChevronDown 
                        className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
                          openFAQ === index 
                            ? 'text-white rotate-180' 
                            : 'text-green-700'
                        }`} 
                      />
                    </div>
                  </button>
                  
                  {openFAQ === index && (
                    <div className="px-4 sm:px-6 lg:px-8 pb-5 sm:pb-6">
                      <div className="pt-2 border-t border-green-100">
                        <p 
                          className="text-gray-600 font-body leading-relaxed text-lg"
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
      </main>
      <Footer />
    </div>
  );
};

export default AdhdTreatment;
