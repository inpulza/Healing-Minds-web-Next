import { useEffect } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { useTikTokEvents } from '@/hooks/useTikTokEvents';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ServiceHeroMasonry } from '@/components/ServiceHeroMasonry';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updateSEO, addServiceSchema } from '@/utils/seo';
import { ArrowRight, CheckCircle, Phone, Calendar, MapPin, Clock, Zap, Info, Bolt } from 'lucide-react';
import WellnessIcon from '@/components/WellnessIcon';

// Import generated images
import doctorImage from "@assets/generated_images/Professional_psychiatrist_office_photo_e259ed9b.webp";
import medicationImage from "@assets/generated_images/Medical_assessment_tools_78e50118.webp";
import therapyRoomImage from "@assets/generated_images/Therapy_room_interior_4b5878fd.webp";
import medicationCapsules from "@assets/e4031136-1b10-4229-8e1d-2c74e4186617_1755210913815.webp";

const TreatmentPlanning = () => {
  const { language } = useLanguage();
  const { trackServiceView } = useTikTokEvents();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Psychiatric Treatment Planning Naples FL - Mental Health Care | Dr. Melva Reve'
        : 'Planificación de Tratamiento Psiquiátrico Naples FL - Atención de Salud Mental | Dra. Melva Reve',
      description: language === 'en'
        ? 'Expert psychiatric treatment planning in Naples, FL. Dr. Melva Reve provides comprehensive psychiatric evaluation, ongoing monitoring, and personalized care for mental health conditions. Bilingual services.'
        : 'Planificación experta de tratamiento psiquiátrico en Naples, FL. La Dra. Melva Reve brinda evaluación psiquiátrica integral, monitoreo continuo y atención personalizada para condiciones de salud mental. Servicios bilingües.',
      keywords: language === 'en'
        ? 'treatment planning Naples FL, psychiatric care Naples, mental health treatment Naples, psychiatrist Naples, psychiatric evaluation Naples, ongoing psychiatric care Naples'
        : 'planificación tratamiento Naples FL, atención psiquiátrica Naples, tratamiento salud mental Naples, psiquiatra Naples, evaluación psiquiátrica Naples, atención psiquiátrica continua Naples',
      lang: language,
      canonical: language === 'en' ? '/services/treatment-planning' : '/es/servicios/planificacion-tratamiento'
    };
    updateSEO(seoData);
    
    // Add Service Schema (SPOKE) - connects to MedicalClinic HUB
    addServiceSchema({
      serviceType: "Psychiatric Treatment Planning",
      name: language === 'en' 
        ? "Psychiatric Treatment Planning in Naples, FL"
        : "Planificación de Tratamiento Psiquiátrico en Naples, FL",
      description: language === 'en'
        ? "Expert psychiatric evaluation, ongoing monitoring, and personalized treatment planning with comprehensive care and individualized support."
        : "Evaluación psiquiátrica experta, monitoreo continuo y planificación de tratamiento personalizada con atención integral y apoyo individualizado.",
      pageId: "treatment-planning"
    });

    // Track TikTok ViewContent event
    trackServiceView('Treatment Planning', 'treatment-planning');
  }, [language, trackServiceView]);

  const benefits = language === 'en' ? [
    'Expert evaluation and monitoring',
    'Personalized treatment plans',
    'Regular progress assessments',
    'Comprehensive symptom management',
    'Treatment coordination review',
    'Therapy optimization',
    'Insurance accepted',
    'Evidence-based care approach'
  ] : [
    'Evaluación y monitoreo experto',
    'Planes de tratamiento personalizados',
    'Evaluaciones regulares de progreso',
    'Manejo integral de síntomas',
    'Revisión de coordinación del tratamiento',
    'Optimización de terapia',
    'Se acepta seguro',
    'Enfoque de atención basado en evidencia'
  ];

  const candidatesCriteria = language === 'en' ? [
    {
      title: 'New Diagnosis',
      description: 'Recently diagnosed with depression, anxiety, bipolar disorder, or other mental health conditions.'
    },
    {
      title: 'Treatment Adjustment',
      description: 'Current treatment approach isn\'t working effectively or you need a different care strategy.'
    },
    {
      title: 'Comprehensive Care Needs',
      description: 'Managing multiple aspects of mental health that need careful coordination and monitoring.'
    },
    {
      title: 'Complex Medical History',
      description: 'Have other medical conditions that may affect your psychiatric treatment approach.'
    },
    {
      title: 'Treatment Support',
      description: 'Need guidance and support to maintain consistent treatment routines.'
    },
    {
      title: 'Ongoing Monitoring',
      description: 'Require regular assessment of treatment effectiveness and symptom management.'
    }
  ] : [
    {
      title: 'Nuevo Diagnóstico',
      description: 'Recientemente diagnosticado con depresión, ansiedad, trastorno bipolar u otras condiciones de salud mental.'
    },
    {
      title: 'Ajuste de Tratamiento',
      description: 'El enfoque de tratamiento actual no funciona efectivamente o necesita una estrategia de atención diferente.'
    },
    {
      title: 'Necesidades de Atención Integral',
      description: 'Manejo de múltiples aspectos de salud mental que necesitan coordinación y monitoreo cuidadosos.'
    },
    {
      title: 'Historia Médica Compleja',
      description: 'Tiene otras condiciones médicas que pueden afectar su enfoque de tratamiento psiquiátrico.'
    },
    {
      title: 'Apoyo de Tratamiento',
      description: 'Necesita orientación y apoyo para mantener rutinas de tratamiento consistentes.'
    },
    {
      title: 'Monitoreo Continuo',
      description: 'Requiere evaluación regular de efectividad del tratamiento y manejo de síntomas.'
    }
  ];

  const treatmentProcess = language === 'en' ? [
    {
      step: '1',
      title: 'Initial Assessment',
      description: 'Comprehensive psychiatric evaluation including medical history, current symptoms, and previous treatment experiences.'
    },
    {
      step: '2',
      title: 'Treatment Approach Selection',
      description: 'Evidence-based treatment approach considering your specific diagnosis, medical history, and treatment goals.'
    },
    {
      step: '3',
      title: 'Treatment Initiation',
      description: 'Beginning treatment with careful treatment strategy, clear instructions, and side effect monitoring plan.'
    },
    {
      step: '4',
      title: 'Regular Monitoring',
      description: 'Scheduled follow-up appointments to assess effectiveness, monitor treatment response, and adjust treatment as needed.'
    },
    {
      step: '5',
      title: 'Optimization',
      description: 'Fine-tuning treatment regimen based on your response, lifestyle factors, and treatment goals.'
    },
    {
      step: '6',
      title: 'Long-term Management',
      description: 'Ongoing treatment management with regular reviews, preventive care, and coordination with other providers.'
    }
  ] : [
    {
      step: '1',
      title: 'Evaluación Inicial',
      description: 'Evaluación psiquiátrica integral incluyendo historia médica, síntomas actuales y experiencias previas de tratamiento.'
    },
    {
      step: '2',
      title: 'Selección del Enfoque de Tratamiento',
      description: 'Enfoque de tratamiento basado en evidencia considerando su diagnóstico específico, historia médica y objetivos de tratamiento.'
    },
    {
      step: '3',
      title: 'Inicio del Tratamiento',
      description: 'Inicio del tratamiento con estrategia de tratamiento cuidadosa, instrucciones claras y plan de monitoreo de respuesta al tratamiento.'
    },
    {
      step: '4',
      title: 'Monitoreo Regular',
      description: 'Citas de seguimiento programadas para evaluar efectividad, monitorear respuesta al tratamiento y ajustar tratamiento según sea necesario.'
    },
    {
      step: '5',
      title: 'Optimización',
      description: 'Ajuste fino del régimen de tratamiento basado en su respuesta, factores de estilo de vida y objetivos de tratamiento.'
    },
    {
      step: '6',
      title: 'Manejo a Largo Plazo',
      description: 'Manejo continuo del tratamiento con revisiones regulares, atención preventiva y coordinación con otros proveedores.'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section with Masonry Layout */}
        <ServiceHeroMasonry
          tagline={{
            en: 'Expert Psychiatric Care',
            es: 'Atención Psiquiátrica Experta'
          }}
          title={{
            en: 'Psychiatric Treatment Planning in Naples, FL',
            es: 'Planificación de Tratamiento Psiquiátrico en Naples, FL'
          }}
          description={{
            en: 'Expert psychiatric treatment planning for optimal mental health outcomes. Dr. Melva Reve provides comprehensive psychiatric evaluation, ongoing monitoring, and personalized care coordination to ensure safe, effective treatment tailored to your individual needs.',
            es: 'Planificación experta de tratamiento psiquiátrico para resultados óptimos de salud mental. La Dra. Melva Reve brinda evaluación psiquiátrica integral, monitoreo continuo y coordinación de atención personalizada para asegurar tratamiento seguro y efectivo adaptado a sus necesidades individuales.'
          }}
          specialNote={{
            es: '<strong>La planificación adecuada del tratamiento es fundamental para el éxito terapéutico.</strong> Nuestra experiencia garantiza que reciba el enfoque de tratamiento correcto, con atención personalizada y monitoreo continuo para optimizar su bienestar.'
          }}
          facts={{
            title: {
              en: 'Treatment Planning',
              es: 'Planificación de Tratamiento'
            },
            items: [
              {
                en: 'Evidence-based care practices',
                es: 'Prácticas de atención basadas en evidencia'
              },
              {
                en: 'Comprehensive safety monitoring',
                es: 'Monitoreo integral de seguridad'
              },
              {
                en: 'Personalized treatment plans',
                es: 'Planes de tratamiento personalizados'
              },
              {
                en: 'Regular progress reviews',
                es: 'Revisiones regulares de progreso'
              }
            ]
          }}
          quickStats={{
            items: [
              {
                en: 'Expert evaluation and monitoring',
                es: 'Evaluación y monitoreo experto'
              },
              {
                en: 'Insurance accepted',
                es: 'Se acepta seguro'
              },
              {
                en: 'Bilingual consultations',
                es: 'Consultas bilingües'
              }
            ]
          }}
          images={{
            doctorImage,
            therapyRoomImage: medicationImage,
            symbolImage: therapyRoomImage
          }}
        />

        {/* Modern Benefits Section */}
        <section className="py-16 sm:py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 shadow-lg border border-green-100">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Content Side */}
                <div className="order-2 lg:order-1">
                  <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    {language === 'en' ? 'Expert Care' : 'Atención Experta'}
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                    {language === 'en' ? (
                      <>Benefits of Expert <span className="font-display italic text-green-700">Treatment Planning</span></>
                    ) : (
                      <>Beneficios de la <span className="font-display italic text-green-700">Planificación Experta</span> del Tratamiento</>
                    )}
                  </h2>
                  
                  {/* Key Stats */}
                  <div className="mb-6 sm:mb-8">
                    <div className="text-3xl sm:text-4xl font-bold mb-2 text-green-600">98%</div>
                    <div className="text-gray-600 font-body text-sm sm:text-base">
                      {language === 'en' ? 'Patient satisfaction with personalized treatment approach' : 'Satisfacción del paciente con enfoque de tratamiento personalizado'}
                    </div>
                  </div>

                  <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 font-body leading-relaxed">
                    {language === 'en'
                      ? 'Professional treatment planning ensures safe, effective psychiatric care with personalized support and ongoing monitoring for optimal mental health outcomes.'
                      : 'La planificación profesional del tratamiento asegura atención psiquiátrica segura y efectiva con apoyo personalizado y monitoreo continuo para resultados óptimos de salud mental.'
                    }
                  </p>

                  <Link href="/contact">
                    <Button className="group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full text-sm sm:text-lg font-semibold transition-all duration-300 bg-green-700 text-white hover:bg-green-800 px-4 sm:px-6 sm:px-8 py-4 sm:py-6 sm:py-7">
                      <span>{language === 'en' ? 'Schedule Consultation' : 'Programar Consulta'}</span>
                      <div className="w-8 h-8 sm:w-9 sm:h-9 min-w-[2rem] min-h-[2rem] sm:min-w-[2.25rem] sm:min-h-[2.25rem] rounded-full flex items-center justify-center transition-all duration-300 bg-green-600 flex-shrink-0">
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                    </Button>
                  </Link>
                </div>

                {/* Photo and Benefits Side */}
                <div className="order-1 lg:order-2">
                  {/* Photo on top */}
                  <div className="mb-6">
                    <div className="w-full h-48 rounded-xl overflow-hidden bg-gradient-to-br from-green-50 to-green-100">
                      <img 
                        src={medicationCapsules} 
                        alt="Medication capsules on green background representing pharmaceutical care"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  
                  {/* Benefits Grid below */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {benefits.slice(0, 4).map((benefit, index) => (
                      <div key={index} className="p-4 hover:bg-green-50 transition-all duration-300 rounded-lg">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                          <Zap className="w-4 h-4 text-green-600" />
                        </div>
                        <h3 className="text-base font-body font-semibold text-green-800">{benefit}</h3>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modern Medication Management Benefits Section */}
        <section className="py-16 sm:py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 shadow-lg border border-green-100">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Content Side */}
                <div className="lg:col-span-2">
                  <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    {language === 'en' ? 'Personalized Care' : 'Atención Personalizada'}
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                    {language === 'en' ? (
                      <>Who Benefits from <span className="font-display italic text-green-700">Medication Management</span>?</>
                    ) : (
                      <>¿Quién se Beneficia del <span className="font-display italic text-green-700">Manejo de Medicamentos</span>?</>
                    )}
                  </h2>
                  
                  <p className="text-lg sm:text-xl text-gray-600 mb-8 font-body leading-relaxed">
                    {language === 'en'
                      ? 'Our comprehensive medication management ensures optimal treatment outcomes through careful monitoring, adjustment, and personalized care for each patient.'
                      : 'Nuestro manejo integral de medicamentos asegura resultados óptimos de tratamiento a través de monitoreo cuidadoso, ajustes y atención personalizada para cada paciente.'
                    }
                  </p>

                  {/* Benefits Grid */}
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Good Candidates */}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-xl font-body font-bold text-green-800">
                          {language === 'en' ? 'Ideal Candidates' : 'Candidatos Ideales'}
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {(language === 'en' ? [
                          'Comprehensive treatment needs',
                          'Complex medication interactions',
                          'Side effect management needed',
                          'Treatment optimization required'
                        ] : [
                          'Múltiples medicamentos psiquiátricos',
                          'Interacciones medicamentosas complejas',
                          'Necesita manejo de respuesta al tratamiento',
                          'Requiere optimización del tratamiento'
                        ]).map((item, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-600 font-body text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Important Notes */}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Info className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-xl font-body font-bold text-green-800">
                          {language === 'en' ? 'Key Considerations' : 'Consideraciones Clave'}
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {(language === 'en' ? [
                          'Regular monitoring required',
                          'Lab work may be necessary',
                          'Medication compliance essential',
                          'Follow-up appointments needed'
                        ] : [
                          'Monitoreo regular requerido',
                          'Trabajo de laboratorio puede ser necesario',
                          'Cumplimiento de medicación esencial',
                          'Citas de seguimiento necesarias'
                        ]).map((item, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-600 font-body text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Link href="/contact">
                    <Button className="group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full text-sm sm:text-lg font-semibold transition-all duration-300 bg-green-700 text-white hover:bg-green-800 px-4 sm:px-6 sm:px-8 py-4 sm:py-6 sm:py-7">
                      <span>{language === 'en' ? 'Start Medication Management' : 'Iniciar Manejo de Medicamentos'}</span>
                      <div className="w-8 h-8 sm:w-9 sm:h-9 min-w-[2rem] min-h-[2rem] sm:min-w-[2.25rem] sm:min-h-[2.25rem] rounded-full flex items-center justify-center transition-all duration-300 bg-green-600 flex-shrink-0">
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                    </Button>
                  </Link>
                </div>

                {/* Sidebar with Stats and Photo */}
                <div className="flex flex-col h-full">
                  {/* Stats Cards */}
                  <div className="space-y-4 mb-6">
                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                      <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                      <div className="text-sm text-gray-600 font-body">
                        {language === 'en' ? 'Medication adherence improvement' : 'Mejora en adherencia a medicación'}
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                      <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                      <div className="text-sm text-gray-600 font-body">
                        {language === 'en' ? 'Emergency consultation available' : 'Consulta de emergencia disponible'}
                      </div>
                    </div>
                  </div>

                  {/* Photo - Fills remaining space */}
                  <div className="flex-1 w-full rounded-xl overflow-hidden bg-gradient-to-br from-green-50 to-green-100">
                    <img 
                      src={medicationCapsules} 
                      alt="Medication capsules on green background representing pharmaceutical care"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Treatment Process Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {language === 'en' ? (
                  <>Our <span className="font-display italic text-green-700">Medication Management</span> Process</>
                ) : (
                  <>Nuestro Proceso de <span className="font-display italic text-green-700">Manejo de Medicamentos</span></>
                )}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {treatmentProcess.map((process, index) => (
                <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-green-600 font-bold text-2xl">{process.step}</span>
                    </div>
                    <h3 className="text-xl font-body font-bold text-green-800 mb-4">{process.title}</h3>
                    <p className="text-gray-600 font-body leading-relaxed">{process.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-16 sm:py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {language === 'en' ? (
                  <>Why Choose Dr. Reve for <span className="font-display italic text-green-700">Medication Management</span></>
                ) : (
                  <>Por Qué Elegir a la Dra. Reve para <span className="font-display italic text-green-700">Manejo de Medicamentos</span></>
                )}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="space-y-6">
                  {(language === 'en' ? [
                    'Board-certified psychiatrist with medication expertise',
                    'Comprehensive medication monitoring and adjustments',
                    'Bilingual services in English and Spanish',
                    'Insurance coverage assistance',
                    'Regular follow-up and safety monitoring',
                    <>Convenient scheduling and <Link href="/locations/psychiatrist-naples" className="text-green-700 hover:text-green-800 underline">accessible Naples, FL location</Link></>
                  ] : [
                    'Psiquiatra certificada con experiencia en medicamentos',
                    'Monitoreo integral y ajustes de medicación',
                    'Servicios bilingües en inglés y español',
                    'Asistencia con cobertura de seguro',
                    'Seguimiento regular y monitoreo de seguridad',
                    <>Horarios convenientes y <Link href="/locations/psychiatrist-naples" className="text-green-700 hover:text-green-800 underline">ubicación accesible en Naples, FL</Link></>
                  ]).map((benefit, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700 font-body text-lg">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-center lg:text-left">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <WellnessIcon size="lg" color="green" className="mx-auto lg:mx-0 mb-6">
                    <Bolt />
                  </WellnessIcon>
                  <h3 className="text-2xl font-body font-bold text-green-800 mb-4">
                    {language === 'en' ? 'Ready to Optimize Your Medications?' : '¿Listo para Optimizar sus Medicamentos?'}
                  </h3>
                  <p className="text-gray-600 font-body leading-relaxed mb-6">
                    {language === 'en'
                      ? 'Take control of your mental health with expert medication management. Schedule a consultation to review your current medications.'
                      : 'Toma control de tu salud mental con manejo experto de medicamentos. Programa una consulta para revisar tus medicamentos actuales.'
                    }
                  </p>
                  <div className="space-y-4">
                    <Link href="/contact">
                      <Button 
                        size="lg" 
                        className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-6 px-8 rounded-full inline-flex items-center justify-center gap-3 transition-all duration-300"
                        data-testid="button-schedule-consultation"
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-green-500">
                          <Calendar className="w-4 h-4 text-white" />
                        </div>
                        {language === 'en' ? 'Schedule Consultation' : 'Programar Consulta'}
                      </Button>
                    </Link>
                    
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full border-green-800 text-green-800 hover:bg-green-50 font-semibold py-6 px-8 rounded-full inline-flex items-center justify-center gap-3"
                      data-testid="button-call-now"
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-green-100">
                        <Phone className="w-4 h-4 text-green-800" />
                      </div>
                      <a href="tel:+1-239-555-0123" className="flex items-center gap-3">
                        {language === 'en' ? 'Call Now' : 'Llamar Ahora'}
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
};

export default MedicationManagement;
