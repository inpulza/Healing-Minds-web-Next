import { useEffect } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ServiceHeroMasonry } from '@/components/ServiceHeroMasonry';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updateSEO } from '@/utils/seo';
import { ArrowRight, CheckCircle, Phone, Calendar, MapPin, Clock, Zap, Info } from 'lucide-react';
import { IconBrain, IconHeart, IconMoodHappy, IconBolt, IconTarget } from '@tabler/icons-react';
import WellnessIcon from '@/components/WellnessIcon';

// Import generated images
import doctorImage from "@assets/generated_images/Professional_psychiatrist_office_photo_e259ed9b.png";
import medicationImage from "@assets/generated_images/Medical_assessment_tools_78e50118.png";
import therapyRoomImage from "@assets/generated_images/Therapy_room_interior_4b5878fd.png";

const MedicationManagement = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Medication Management Naples FL - Psychiatric Medications | Dr. Melva Reve'
        : 'Manejo de Medicamentos Naples FL - Medicamentos Psiquiátricos | Dra. Melva Reve',
      description: language === 'en'
        ? 'Expert psychiatric medication management in Naples, FL. Dr. Melva Reve provides comprehensive medication evaluation, monitoring, and adjustment for mental health conditions. Bilingual services.'
        : 'Manejo experto de medicamentos psiquiátricos en Naples, FL. La Dra. Melva Reve brinda evaluación, monitoreo y ajuste integral de medicamentos para condiciones de salud mental. Servicios bilingües.',
      keywords: language === 'en'
        ? 'medication management Naples FL, psychiatric medications Naples, antidepressants Naples, mood stabilizers Naples, psychiatrist medication Naples, medication monitoring Naples'
        : 'manejo medicamentos Naples FL, medicamentos psiquiátricos Naples, antidepresivos Naples, estabilizadores ánimo Naples, psiquiatra medicamentos Naples, monitoreo medicamentos Naples',
      lang: language,
      canonical: language === 'en' ? '/services/medication-management' : '/es/servicios/manejo-medicamentos'
    };
    updateSEO(seoData);
  }, [language]);

  const benefits = language === 'en' ? [
    'Expert evaluation and monitoring',
    'Personalized medication plans',
    'Regular safety assessments',
    'Side effect management',
    'Medication interactions review',
    'Dosage optimization',
    'Insurance accepted',
    'Evidence-based prescribing'
  ] : [
    'Evaluación y monitoreo experto',
    'Planes de medicación personalizados',
    'Evaluaciones regulares de seguridad',
    'Manejo de efectos secundarios',
    'Revisión de interacciones medicamentosas',
    'Optimización de dosis',
    'Se acepta seguro',
    'Prescripción basada en evidencia'
  ];

  const candidatesCriteria = language === 'en' ? [
    {
      title: 'New Diagnosis',
      description: 'Recently diagnosed with depression, anxiety, bipolar disorder, or other mental health conditions.'
    },
    {
      title: 'Medication Adjustment',
      description: 'Current medications aren\'t working effectively or are causing unwanted side effects.'
    },
    {
      title: 'Multiple Medications',
      description: 'Taking several psychiatric medications that need careful coordination and monitoring.'
    },
    {
      title: 'Complex Medical History',
      description: 'Have other medical conditions that may interact with psychiatric medications.'
    },
    {
      title: 'Treatment Compliance',
      description: 'Need support and guidance to maintain consistent medication routines.'
    },
    {
      title: 'Ongoing Monitoring',
      description: 'Require regular assessment of medication effectiveness and side effects.'
    }
  ] : [
    {
      title: 'Nuevo Diagnóstico',
      description: 'Recientemente diagnosticado con depresión, ansiedad, trastorno bipolar u otras condiciones de salud mental.'
    },
    {
      title: 'Ajuste de Medicación',
      description: 'Los medicamentos actuales no funcionan efectivamente o están causando efectos secundarios no deseados.'
    },
    {
      title: 'Múltiples Medicamentos',
      description: 'Tomando varios medicamentos psiquiátricos que necesitan coordinación y monitoreo cuidadosos.'
    },
    {
      title: 'Historia Médica Compleja',
      description: 'Tiene otras condiciones médicas que pueden interactuar con medicamentos psiquiátricos.'
    },
    {
      title: 'Cumplimiento del Tratamiento',
      description: 'Necesita apoyo y orientación para mantener rutinas de medicación consistentes.'
    },
    {
      title: 'Monitoreo Continuo',
      description: 'Requiere evaluación regular de efectividad de medicamentos y efectos secundarios.'
    }
  ];

  const treatmentProcess = language === 'en' ? [
    {
      step: '1',
      title: 'Initial Assessment',
      description: 'Comprehensive psychiatric evaluation including medical history, current symptoms, and previous medication experiences.'
    },
    {
      step: '2',
      title: 'Medication Selection',
      description: 'Evidence-based medication choice considering your specific diagnosis, medical history, and treatment goals.'
    },
    {
      step: '3',
      title: 'Treatment Initiation',
      description: 'Starting medication with careful dosing strategy, clear instructions, and side effect monitoring plan.'
    },
    {
      step: '4',
      title: 'Regular Monitoring',
      description: 'Scheduled follow-up appointments to assess effectiveness, monitor side effects, and adjust dosages as needed.'
    },
    {
      step: '5',
      title: 'Optimization',
      description: 'Fine-tuning medication regimen based on your response, lifestyle factors, and treatment goals.'
    },
    {
      step: '6',
      title: 'Long-term Management',
      description: 'Ongoing medication management with regular reviews, preventive care, and coordination with other providers.'
    }
  ] : [
    {
      step: '1',
      title: 'Evaluación Inicial',
      description: 'Evaluación psiquiátrica integral incluyendo historia médica, síntomas actuales y experiencias previas con medicamentos.'
    },
    {
      step: '2',
      title: 'Selección de Medicación',
      description: 'Elección de medicamento basada en evidencia considerando su diagnóstico específico, historia médica y objetivos de tratamiento.'
    },
    {
      step: '3',
      title: 'Inicio del Tratamiento',
      description: 'Inicio de medicación con estrategia de dosis cuidadosa, instrucciones claras y plan de monitoreo de efectos secundarios.'
    },
    {
      step: '4',
      title: 'Monitoreo Regular',
      description: 'Citas de seguimiento programadas para evaluar efectividad, monitorear efectos secundarios y ajustar dosis según sea necesario.'
    },
    {
      step: '5',
      title: 'Optimización',
      description: 'Ajuste fino del régimen de medicación basado en su respuesta, factores de estilo de vida y objetivos de tratamiento.'
    },
    {
      step: '6',
      title: 'Manejo a Largo Plazo',
      description: 'Manejo continuo de medicación con revisiones regulares, atención preventiva y coordinación con otros proveedores.'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section with Masonry Layout */}
        <ServiceHeroMasonry
          tagline={{
            en: 'Expert Medication Care',
            es: 'Cuidado Experto de Medicación'
          }}
          title={{
            en: 'Medication Management in Naples, FL',
            es: 'Manejo de Medicamentos en Naples, FL'
          }}
          description={{
            en: 'Expert psychiatric medication management for optimal mental health outcomes. Dr. Melva Reve provides comprehensive medication evaluation, monitoring, and adjustment to ensure safe, effective treatment tailored to your individual needs.',
            es: 'Manejo experto de medicación psiquiátrica para resultados óptimos de salud mental. La Dra. Melva Reve brinda evaluación, monitoreo y ajuste integral de medicamentos para asegurar tratamiento seguro y efectivo adaptado a sus necesidades individuales.'
          }}
          specialNote={{
            es: '<strong>El manejo adecuado de medicamentos es fundamental para el éxito del tratamiento.</strong> Nuestra experiencia garantiza que reciba la medicación correcta, en la dosis adecuada, con monitoreo continuo para optimizar su bienestar y minimizar efectos secundarios.'
          }}
          facts={{
            title: {
              en: 'Medication Management',
              es: 'Manejo de Medicamentos'
            },
            items: [
              {
                en: 'Evidence-based prescribing practices',
                es: 'Prácticas de prescripción basadas en evidencia'
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
                en: 'Regular medication reviews',
                es: 'Revisiones regulares de medicación'
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
                      <>Benefits of Expert <span className="font-display italic text-green-700">Medication Management</span></>
                    ) : (
                      <>Beneficios del <span className="font-display italic text-green-700">Manejo Experto</span> de Medicamentos</>
                    )}
                  </h2>
                  
                  {/* Key Stats */}
                  <div className="mb-6 sm:mb-8">
                    <div className="text-3xl sm:text-4xl font-bold mb-2 text-green-600">98%</div>
                    <div className="text-gray-600 font-body text-sm sm:text-base">
                      {language === 'en' ? 'Patient satisfaction with medication optimization' : 'Satisfacción del paciente con optimización de medicamentos'}
                    </div>
                  </div>

                  <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 font-body leading-relaxed">
                    {language === 'en'
                      ? 'Professional medication management ensures safe, effective treatment with personalized care and ongoing monitoring for optimal mental health outcomes.'
                      : 'El manejo profesional de medicamentos asegura tratamiento seguro y efectivo con atención personalizada y monitoreo continuo para resultados óptimos de salud mental.'
                    }
                  </p>

                  <Link href="/contact">
                    <Button className="group inline-flex items-center justify-center gap-3 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 bg-green-600 text-white hover:bg-green-700 px-6 sm:px-8 py-6 sm:py-7">
                      <span>{language === 'en' ? 'Schedule Consultation' : 'Programar Consulta'}</span>
                      <div className="w-8 h-8 sm:w-9 sm:h-9 min-w-[2rem] min-h-[2rem] sm:min-w-[2.25rem] sm:min-h-[2.25rem] rounded-full flex items-center justify-center transition-all duration-300 bg-green-500 flex-shrink-0">
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                    </Button>
                  </Link>
                </div>

                {/* Benefits Grid Side */}
                <div className="order-1 lg:order-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {benefits.slice(0, 4).map((benefit, index) => (
                      <div key={index} className="bg-blue-50 rounded-xl p-6 border border-blue-200 hover:bg-blue-100 transition-all duration-300">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4 border border-blue-300">
                          <Zap className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-body font-semibold text-green-800">{benefit}</h3>
                      </div>
                    ))}
                  </div>
                  
                  {/* Photo Placeholder */}
                  <div className="mt-6">
                    <div className="w-full h-44 bg-green-50 rounded-xl border-2 border-dashed border-green-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-green-600 font-bold">💊</span>
                        </div>
                        <p className="text-green-600 font-body text-sm">Aquí va una foto</p>
                        <p className="text-green-500 font-body text-xs">Medicamentos/farmacia</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional benefits if any */}
                  {benefits.length > 4 && (
                    <div className="mt-4 text-center">
                      <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-green-50 rounded-full px-4 py-2 border border-green-200">
                        <span>{language === 'en' ? '+' : '+'}{benefits.length - 4} {language === 'en' ? 'more benefits' : 'beneficios más'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Candidate Criteria Section */}
        <section className="py-16 sm:py-20 bg-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {language === 'en' ? (
                  <>Who Benefits from <span className="font-display italic text-green-700">Medication Management</span>?</>
                ) : (
                  <>¿Quién se Beneficia del <span className="font-display italic text-green-700">Manejo de Medicamentos</span>?</>
                )}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-body font-bold text-green-800 flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    {language === 'en' ? 'Good Candidates' : 'Buenos Candidatos'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(language === 'en' ? [
                      'Treatment-resistant depression',
                      'Unable to tolerate antidepressant side effects',
                      'Seeking medication-free treatment option',
                      'Adults 18 years and older',
                      'Stable medical conditions',
                      'Committed to full treatment course'
                    ] : [
                      'Depresión resistente al tratamiento',
                      'Incapaz de tolerar efectos secundarios de antidepresivos',
                      'Buscando opción de tratamiento sin medicamentos',
                      'Adultos de 18 años en adelante',
                      'Condiciones médicas estables',
                      'Comprometido con el curso completo de tratamiento'
                    ]).map((criteria, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-gray-700 font-body">{criteria}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-body font-bold text-red-800 flex items-center gap-3">
                    <Info className="w-6 h-6 text-red-600" />
                    {language === 'en' ? 'Important Considerations' : 'Consideraciones Importantes'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(language === 'en' ? [
                      'Metal implants near the head',
                      'History of seizures or epilepsy',
                      'Certain medications that lower seizure threshold',
                      'Pregnancy (safety not established)',
                      'Active substance abuse',
                      'Severe cognitive impairment'
                    ] : [
                      'Implantes metálicos cerca de la cabeza',
                      'Historial de convulsiones o epilepsia',
                      'Ciertos medicamentos que reducen el umbral de convulsiones',
                      'Embarazo (seguridad no establecida)',
                      'Abuso activo de sustancias',
                      'Deterioro cognitivo severo'
                    ]).map((consideration, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Info className="w-4 h-4 text-red-600" />
                        </div>
                        <span className="text-gray-700 font-body">{consideration}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-blue-600 font-bold text-2xl">{process.step}</span>
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
                    'Board-certified psychiatrist with TMS expertise',
                    'Latest FDA-approved TMS technology',
                    'Bilingual services in English and Spanish',
                    'Insurance coverage assistance',
                    'Comprehensive pre and post-treatment care',
                    'Convenient scheduling and location'
                  ] : [
                    'Psiquiatra certificada con experiencia en TMS',
                    'Tecnología TMS más reciente aprobada por FDA',
                    'Servicios bilingües en inglés y español',
                    'Asistencia con cobertura de seguro',
                    'Atención integral pre y post-tratamiento',
                    'Horarios convenientes y ubicación accesible'
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
                    <IconBolt />
                  </WellnessIcon>
                  <h3 className="text-2xl font-body font-bold text-green-800 mb-4">
                    {language === 'en' ? 'Ready to Try TMS Therapy?' : '¿Listo para Probar la Terapia TMS?'}
                  </h3>
                  <p className="text-gray-600 font-body leading-relaxed mb-6">
                    {language === 'en'
                      ? 'Discover if TMS therapy is right for you. Schedule a consultation to learn more about this innovative treatment option.'
                      : 'Descubre si la terapia TMS es adecuada para ti. Programa una consulta para aprender más sobre esta opción de tratamiento innovadora.'
                    }
                  </p>
                  <div className="space-y-4">
                    <Link href="/contact">
                      <Button 
                        size="lg" 
                        className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-6 px-8 rounded-full inline-flex items-center justify-center gap-3 transition-all duration-300"
                        data-testid="button-schedule-consultation"
                      >
                        <Calendar className="w-5 h-5" />
                        {language === 'en' ? 'Schedule Consultation' : 'Programar Consulta'}
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </Link>
                    
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full border-green-800 text-green-800 hover:bg-green-50 font-semibold py-6 px-8 rounded-full inline-flex items-center justify-center gap-3"
                      data-testid="button-call-now"
                    >
                      <Phone className="w-5 h-5" />
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
