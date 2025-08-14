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
import tmsImage from "@assets/generated_images/TMS_therapy_equipment_38dd31e3.png";
import therapyRoomImage from "@assets/generated_images/Therapy_room_interior_4b5878fd.png";

const TmsTherapy = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'TMS Therapy Naples FL - Transcranial Magnetic Stimulation | Dr. Melva Reve'
        : 'Terapia TMS Naples FL - Estimulación Magnética Transcraneal | Dra. Melva Reve',
      description: language === 'en'
        ? 'Advanced TMS therapy in Naples, FL for treatment-resistant depression. Dr. Melva Reve offers transcranial magnetic stimulation as FDA-approved, non-invasive treatment option. Insurance covered.'
        : 'Terapia TMS avanzada en Naples, FL para depresión resistente al tratamiento. La Dra. Melva Reve ofrece estimulación magnética transcraneal como opción de tratamiento no invasiva aprobada por FDA. Cubierto por seguro.',
      keywords: language === 'en'
        ? 'TMS therapy Naples FL, transcranial magnetic stimulation Naples, treatment resistant depression Naples, TMS psychiatrist Naples, magnetic therapy Naples, non-invasive depression treatment Naples'
        : 'terapia TMS Naples FL, estimulación magnética transcraneal Naples, depresión resistente tratamiento Naples, psiquiatra TMS Naples, terapia magnética Naples, tratamiento depresión no invasivo Naples',
      lang: language,
      canonical: language === 'en' ? '/services/tms-therapy' : '/es/servicios/terapia-tms'
    };
    updateSEO(seoData);
  }, [language]);

  const benefits = language === 'en' ? [
    'FDA-approved for treatment-resistant depression',
    'Non-invasive, no anesthesia required',
    'Outpatient procedure with no downtime',
    'Minimal side effects compared to medications',
    'No memory or cognitive effects',
    'Can be combined with other treatments',
    'Insurance coverage often available',
    'Proven effective in clinical studies'
  ] : [
    'Aprobado por FDA para depresión resistente al tratamiento',
    'No invasivo, no requiere anestesia',
    'Procedimiento ambulatorio sin tiempo de inactividad',
    'Efectos secundarios mínimos comparado con medicamentos',
    'No hay efectos en memoria o cognición',
    'Puede combinarse con otros tratamientos',
    'Cobertura de seguro a menudo disponible',
    'Efectividad comprobada en estudios clínicos'
  ];

  const candidatesCriteria = language === 'en' ? [
    {
      title: 'Treatment-Resistant Depression',
      description: 'Have tried multiple antidepressant medications without sufficient improvement.'
    },
    {
      title: 'Major Depressive Disorder',
      description: 'Diagnosed with major depression and experiencing significant symptoms.'
    },
    {
      title: 'Unable to Tolerate Medications',
      description: 'Experience severe side effects from antidepressant medications.'
    },
    {
      title: 'Seeking Non-Drug Options',
      description: 'Prefer to avoid or reduce psychiatric medications while maintaining treatment.'
    },
    {
      title: 'Adolescent Depression',
      description: 'FDA-approved for teens (13+) with treatment-resistant depression.'
    },
    {
      title: 'Other Conditions',
      description: 'May be considered for certain anxiety disorders and other psychiatric conditions.'
    }
  ] : [
    {
      title: 'Depresión Resistente al Tratamiento',
      description: 'Ha probado múltiples medicamentos antidepresivos sin mejoría suficiente.'
    },
    {
      title: 'Trastorno Depresivo Mayor',
      description: 'Diagnosticado con depresión mayor y experimentando síntomas significativos.'
    },
    {
      title: 'No Puede Tolerar Medicamentos',
      description: 'Experimenta efectos secundarios severos de medicamentos antidepresivos.'
    },
    {
      title: 'Busca Opciones Sin Medicamentos',
      description: 'Prefiere evitar o reducir medicamentos psiquiátricos mientras mantiene tratamiento.'
    },
    {
      title: 'Depresión Adolescente',
      description: 'Aprobado por FDA para adolescentes (13+) con depresión resistente al tratamiento.'
    },
    {
      title: 'Otras Condiciones',
      description: 'Puede considerarse para ciertos trastornos de ansiedad y otras condiciones psiquiátricas.'
    }
  ];

  const treatmentProcess = language === 'en' ? [
    {
      step: '1',
      title: 'Initial Consultation',
      description: 'Comprehensive evaluation to determine if TMS is appropriate for your specific condition and history.'
    },
    {
      step: '2',
      title: 'Treatment Planning',
      description: 'Brain mapping and personalized treatment protocol development based on your individual needs.'
    },
    {
      step: '3',
      title: 'TMS Sessions',
      description: 'Daily 20-minute sessions for 4-6 weeks, typically 5 days per week in our comfortable setting.'
    },
    {
      step: '4',
      title: 'Progress Monitoring',
      description: 'Regular assessment of symptoms and treatment response with adjustments as needed.'
    },
    {
      step: '5',
      title: 'Maintenance Care',
      description: 'Follow-up sessions as needed to maintain treatment benefits and prevent relapse.'
    },
    {
      step: '6',
      title: 'Ongoing Support',
      description: 'Continued psychiatric care and coordination with other treatments for optimal outcomes.'
    }
  ] : [
    {
      step: '1',
      title: 'Consulta Inicial',
      description: 'Evaluación integral para determinar si TMS es apropiado para su condición específica e historia.'
    },
    {
      step: '2',
      title: 'Planificación del Tratamiento',
      description: 'Mapeo cerebral y desarrollo de protocolo de tratamiento personalizado basado en sus necesidades individuales.'
    },
    {
      step: '3',
      title: 'Sesiones de TMS',
      description: 'Sesiones diarias de 20 minutos por 4-6 semanas, típicamente 5 días por semana en nuestro ambiente cómodo.'
    },
    {
      step: '4',
      title: 'Monitoreo del Progreso',
      description: 'Evaluación regular de síntomas y respuesta al tratamiento con ajustes según sea necesario.'
    },
    {
      step: '5',
      title: 'Cuidado de Mantenimiento',
      description: 'Sesiones de seguimiento según sea necesario para mantener beneficios del tratamiento y prevenir recaída.'
    },
    {
      step: '6',
      title: 'Apoyo Continuo',
      description: 'Atención psiquiátrica continua y coordinación con otros tratamientos para resultados óptimos.'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section with Masonry Layout */}
        <ServiceHeroMasonry
          tagline={{
            en: 'Advanced Brain Therapy',
            es: 'Terapia Cerebral Avanzada'
          }}
          title={{
            en: 'TMS Therapy in Naples, FL',
            es: 'Terapia TMS en Naples, FL'
          }}
          description={{
            en: 'Break through treatment-resistant depression with TMS therapy. Dr. Melva Reve offers FDA-approved transcranial magnetic stimulation - a revolutionary, non-invasive treatment that helps when medications haven\'t worked.',
            es: 'Supere la depresión resistente al tratamiento con terapia TMS. La Dra. Melva Reve ofrece estimulación magnética transcraneal aprobada por FDA - un tratamiento revolucionario, no invasivo que ayuda cuando los medicamentos no han funcionado.'
          }}
          specialNote={{
            es: '<strong>TMS es una opción esperanzadora cuando otros tratamientos no han funcionado.</strong> Esta tecnología avanzada ofrece nueva esperanza para la recuperación sin los efectos secundarios de medicamentos adicionales. Es seguro, efectivo y respaldado por investigación científica.'
          }}
          facts={{
            title: {
              en: 'TMS Facts',
              es: 'Datos sobre TMS'
            },
            items: [
              {
                en: 'FDA-approved for treatment-resistant depression',
                es: 'Aprobado por FDA para depresión resistente'
              },
              {
                en: 'Non-invasive, no anesthesia required',
                es: 'No invasivo, no requiere anestesia'
              },
              {
                en: '50-60% response rate in clinical trials',
                es: '50-60% tasa de respuesta en ensayos clínicos'
              },
              {
                en: 'Insurance coverage often available',
                es: 'Cobertura de seguro frecuentemente disponible'
              }
            ]
          }}
          quickStats={{
            items: [
              {
                en: '20-minute daily sessions',
                es: 'Sesiones diarias de 20 minutos'
              },
              {
                en: '4-6 week treatment course',
                es: 'Curso de tratamiento de 4-6 semanas'
              },
              {
                en: 'Minimal side effects',
                es: 'Efectos secundarios mínimos'
              }
            ]
          }}
          images={{
            doctorImage,
            therapyRoomImage: tmsImage,
            symbolImage: therapyRoomImage
          }}
        />

        {/* Benefits Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {language === 'en' ? (
                  <>Benefits of <span className="font-display italic text-green-700">TMS</span> Therapy</>
                ) : (
                  <>Beneficios de la <span className="font-display italic text-green-700">Terapia TMS</span></>
                )}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'TMS therapy offers a revolutionary approach to treating depression without the side effects of traditional medications.'
                  : 'La terapia TMS ofrece un enfoque revolucionario para tratar la depresión sin los efectos secundarios de los medicamentos tradicionales.'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-blue-100 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-body font-semibold text-green-800 mb-2">{benefit}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Candidate Criteria Section */}
        <section className="py-16 sm:py-20 bg-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {language === 'en' ? (
                  <>Who is a <span className="font-display italic text-green-700">Good Candidate</span> for TMS?</>
                ) : (
                  <>¿Quién es un <span className="font-display italic text-green-700">Buen Candidato</span> para TMS?</>
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
                  <>The <span className="font-display italic text-green-700">TMS Treatment</span> Process</>
                ) : (
                  <>El Proceso de <span className="font-display italic text-green-700">Tratamiento TMS</span></>
                )}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(language === 'en' ? [
                {
                  step: '1',
                  title: 'Initial Consultation',
                  description: 'Comprehensive evaluation to determine if TMS is right for you, including medical history and depression assessment.'
                },
                {
                  step: '2',
                  title: 'Motor Threshold Mapping',
                  description: 'Personalized calibration to determine the exact magnetic field strength needed for your treatment.'
                },
                {
                  step: '3',
                  title: 'Treatment Sessions',
                  description: '5 days per week for 4-6 weeks. Each session lasts about 19-37 minutes with no anesthesia required.'
                },
                {
                  step: '4',
                  title: 'Progress Monitoring',
                  description: 'Regular assessment of symptoms and adjustment of treatment plan as needed throughout the course.'
                }
              ] : [
                {
                  step: '1',
                  title: 'Consulta Inicial',
                  description: 'Evaluación integral para determinar si TMS es adecuado para usted, incluyendo historial médico y evaluación de depresión.'
                },
                {
                  step: '2',
                  title: 'Mapeo del Umbral Motor',
                  description: 'Calibración personalizada para determinar la intensidad exacta del campo magnético necesaria para su tratamiento.'
                },
                {
                  step: '3',
                  title: 'Sesiones de Tratamiento',
                  description: '5 días por semana durante 4-6 semanas. Cada sesión dura aproximadamente 19-37 minutos sin necesidad de anestesia.'
                },
                {
                  step: '4',
                  title: 'Monitoreo del Progreso',
                  description: 'Evaluación regular de síntomas y ajuste del plan de tratamiento según sea necesario durante el curso.'
                }
              ]).map((process, index) => (
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
                  <>Why Choose Dr. Reve for <span className="font-display italic text-green-700">TMS Therapy</span></>
                ) : (
                  <>Por Qué Elegir a la Dra. Reve para <span className="font-display italic text-green-700">Terapia TMS</span></>
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

export default TmsTherapy;
