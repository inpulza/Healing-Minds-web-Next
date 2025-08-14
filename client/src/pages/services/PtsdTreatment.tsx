import { useEffect } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ServiceHeroMasonry } from '@/components/ServiceHeroMasonry';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updateSEO } from '@/utils/seo';
import { ArrowRight, CheckCircle, Phone, Calendar, MapPin, Clock, Shield } from 'lucide-react';
import { IconBrain, IconHeart, IconMoodHappy, IconShield } from '@tabler/icons-react';
import WellnessIcon from '@/components/WellnessIcon';

// Import generated images
import doctorImage from "@assets/generated_images/Professional_psychiatrist_office_photo_e259ed9b.png";
import ptsdImage from "@assets/generated_images/Hope_and_growth_symbolism_978bb907.png";
import therapyRoomImage from "@assets/generated_images/Therapy_room_interior_4b5878fd.png";

const PtsdTreatment = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'PTSD Treatment Naples FL - Trauma Therapy & Psychiatric Care | Dr. Melva Reve'
        : 'Tratamiento TEPT Naples FL - Terapia de Trauma y Atención Psiquiátrica | Dra. Melva Reve',
      description: language === 'en'
        ? 'Expert PTSD treatment in Naples, FL. Dr. Melva Reve provides trauma-informed psychiatric care for post-traumatic stress disorder. Bilingual services, evidence-based treatment approaches.'
        : 'Tratamiento experto de TEPT en Naples, FL. La Dra. Melva Reve brinda atención psiquiátrica informada en trauma para trastorno de estrés postraumático. Servicios bilingües, enfoques de tratamiento basados en evidencia.',
      keywords: language === 'en'
        ? 'PTSD treatment Naples FL, trauma therapy Naples, post traumatic stress disorder Naples, PTSD psychiatrist Naples, trauma informed care Naples, military PTSD Naples'
        : 'tratamiento TEPT Naples FL, terapia trauma Naples, trastorno estrés postraumático Naples, psiquiatra TEPT Naples, atención informada trauma Naples, TEPT militar Naples',
      lang: language,
      canonical: language === 'en' ? '/services/ptsd-treatment' : '/es/servicios/tratamiento-tept'
    };
    updateSEO(seoData);
  }, [language]);

  const symptoms = language === 'en' ? [
    'Intrusive memories or flashbacks',
    'Nightmares or sleep disturbances',
    'Avoidance of trauma reminders',
    'Emotional numbing or detachment',
    'Hypervigilance or being easily startled',
    'Difficulty concentrating',
    'Irritability or anger outbursts',
    'Negative thoughts about oneself'
  ] : [
    'Memorias intrusivas o flashbacks',
    'Pesadillas o trastornos del sueño',
    'Evitación de recordatorios del trauma',
    'Entumecimiento emocional o desapego',
    'Hipervigilancia o sobresaltarse fácilmente',
    'Dificultad para concentrarse',
    'Irritabilidad o arrebatos de ira',
    'Pensamientos negativos sobre uno mismo'
  ];

  const traumaTypes = language === 'en' ? [
    {
      title: 'Combat & Military Trauma',
      description: 'Specialized care for veterans and active military personnel dealing with combat-related PTSD.'
    },
    {
      title: 'Accident & Injury Trauma',
      description: 'Treatment for PTSD resulting from car accidents, workplace injuries, or other traumatic incidents.'
    },
    {
      title: 'Personal Violence',
      description: 'Sensitive care for survivors of assault, domestic violence, or other personal trauma.'
    },
    {
      title: 'Medical Trauma',
      description: 'Support for trauma related to serious illness, medical procedures, or hospital experiences.'
    },
    {
      title: 'Natural Disasters',
      description: 'Treatment for PTSD resulting from hurricanes, floods, or other natural catastrophes.'
    },
    {
      title: 'Childhood Trauma',
      description: 'Specialized approach for adults dealing with the lasting effects of childhood trauma.'
    }
  ] : [
    {
      title: 'Trauma de Combate y Militar',
      description: 'Atención especializada para veteranos y personal militar activo que trata con TEPT relacionado con combate.'
    },
    {
      title: 'Trauma de Accidentes y Lesiones',
      description: 'Tratamiento para TEPT resultante de accidentes automovilísticos, lesiones laborales u otros incidentes traumáticos.'
    },
    {
      title: 'Violencia Personal',
      description: 'Atención sensible para sobrevivientes de asalto, violencia doméstica u otro trauma personal.'
    },
    {
      title: 'Trauma Médico',
      description: 'Apoyo para trauma relacionado con enfermedad grave, procedimientos médicos o experiencias hospitalarias.'
    },
    {
      title: 'Desastres Naturales',
      description: 'Tratamiento para TEPT resultante de huracanes, inundaciones u otras catástrofes naturales.'
    },
    {
      title: 'Trauma de la Infancia',
      description: 'Enfoque especializado para adultos que lidian con los efectos duraderos del trauma infantil.'
    }
  ];

  const treatments = language === 'en' ? [
    {
      title: 'Trauma-Informed Assessment',
      description: 'Comprehensive evaluation using trauma-specific tools to understand your unique experience and symptoms.'
    },
    {
      title: 'Medication Management',
      description: 'Careful prescribing of medications to manage PTSD symptoms, including antidepressants and anxiety medications.'
    },
    {
      title: 'Evidence-Based Therapy Coordination',
      description: 'Coordination with trauma therapists specializing in EMDR, CPT, and other proven PTSD treatments.'
    },
    {
      title: 'Crisis Safety Planning',
      description: 'Development of personalized safety plans to manage triggers and crisis situations effectively.'
    },
    {
      title: 'Sleep & Nightmare Management',
      description: 'Specialized treatment for trauma-related sleep disturbances and recurring nightmares.'
    },
    {
      title: 'Family & Support System Education',
      description: 'Guidance for loved ones on how to provide support and understand PTSD recovery.'
    }
  ] : [
    {
      title: 'Evaluación Informada en Trauma',
      description: 'Evaluación integral usando herramientas específicas de trauma para entender su experiencia única y síntomas.'
    },
    {
      title: 'Manejo de Medicamentos',
      description: 'Prescripción cuidadosa de medicamentos para manejar síntomas de TEPT, incluyendo antidepresivos y medicamentos para ansiedad.'
    },
    {
      title: 'Coordinación de Terapia Basada en Evidencia',
      description: 'Coordinación con terapeutas de trauma especializados en EMDR, CPT y otros tratamientos comprobados para TEPT.'
    },
    {
      title: 'Planificación de Seguridad en Crisis',
      description: 'Desarrollo de planes de seguridad personalizados para manejar desencadenantes y situaciones de crisis efectivamente.'
    },
    {
      title: 'Manejo del Sueño y Pesadillas',
      description: 'Tratamiento especializado para trastornos del sueño relacionados con trauma y pesadillas recurrentes.'
    },
    {
      title: 'Educación para Familia y Sistema de Apoyo',
      description: 'Orientación para seres queridos sobre cómo brindar apoyo y entender la recuperación del TEPT.'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section with Masonry Layout */}
        <ServiceHeroMasonry
          tagline={{
            en: 'Trauma Recovery',
            es: 'Recuperación del Trauma'
          }}
          title={{
            en: 'PTSD Treatment in Naples, FL',
            es: 'Tratamiento de TEPT en Naples, FL'
          }}
          description={{
            en: 'Find healing and reclaim your life with expert PTSD treatment. Dr. Melva Reve provides trauma-informed psychiatric care with compassion, understanding, and evidence-based approaches.',
            es: 'Encuentre sanación y reclame su vida con tratamiento experto de TEPT. La Dra. Melva Reve brinda atención psiquiátrica informada en trauma con compasión, comprensión y enfoques basados en evidencia.'
          }}
          specialNote={{
            es: '<strong>El trauma no define quién es usted.</strong> La recuperación es posible con el apoyo adecuado. Nuestro enfoque respeta su cultura y experiencias, ofreciendo un espacio seguro para sanar sin juicio ni estigma.'
          }}
          facts={{
            title: {
              en: 'PTSD Facts',
              es: 'Datos sobre TEPT'
            },
            items: [
              {
                en: '3.5% of adults experience PTSD annually',
                es: '3.5% de adultos experimentan TEPT anualmente'
              },
              {
                en: 'Trauma-informed care is essential',
                es: 'La atención informada en trauma es esencial'
              },
              {
                en: 'Recovery is possible with treatment',
                es: 'La recuperación es posible con tratamiento'
              },
              {
                en: 'Cultural competency matters',
                es: 'La competencia cultural importa'
              }
            ]
          }}
          quickStats={{
            items: [
              {
                en: 'Trauma-informed assessment',
                es: 'Evaluación informada en trauma'
              },
              {
                en: 'Evidence-based therapy coordination',
                es: 'Coordinación de terapia basada en evidencia'
              },
              {
                en: 'Crisis safety planning',
                es: 'Planificación de seguridad en crisis'
              }
            ]
          }}
          images={{
            doctorImage,
            therapyRoomImage: ptsdImage,
            symbolImage: therapyRoomImage
          }}
        />

        {/* Symptoms Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {language === 'en' ? (
                  <>Recognizing <span className="font-display italic text-green-700">PTSD</span> Symptoms</>
                ) : (
                  <>Reconociendo Síntomas de <span className="font-display italic text-green-700">TEPT</span></>
                )}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'PTSD can develop after experiencing or witnessing a traumatic event. These symptoms persist for more than a month and significantly impact daily functioning.'
                  : 'El TEPT puede desarrollarse después de experimentar o presenciar un evento traumático. Estos síntomas persisten por más de un mes e impactan significativamente el funcionamiento diario.'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {symptoms.map((symptom, index) => (
                <Card key={index} className="border-blue-100 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-gray-700 font-body">{symptom}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Trauma Types Section */}
        <section className="py-16 sm:py-20 bg-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {language === 'en' ? (
                  <>Types of <span className="font-display italic text-green-700">Trauma</span> We Treat</>
                ) : (
                  <>Tipos de <span className="font-display italic text-green-700">Trauma</span> que Tratamos</>
                )}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(language === 'en' ? [
                'Combat & Military Trauma',
                'Childhood Abuse',
                'Sexual Assault',
                'Motor Vehicle Accidents',
                'Natural Disasters',
                'Workplace Violence',
                'Medical Trauma',
                'Community Violence'
              ] : [
                'Trauma de Combate y Militar',
                'Abuso Infantil',
                'Agresión Sexual',
                'Accidentes Automovilísticos',
                'Desastres Naturales',
                'Violencia Laboral',
                'Trauma Médico',
                'Violencia Comunitaria'
              ]).map((type, index) => (
                <Card key={index} className="bg-white border-0 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <WellnessIcon size="md" color="blue" className="mx-auto mb-3">
                      <IconShield />
                    </WellnessIcon>
                    <h3 className="text-lg font-body font-semibold text-green-800">{type}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Treatment Approach Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {language === 'en' ? (
                  <>Our <span className="font-display italic text-green-700">Trauma-Informed</span> Treatment Approach</>
                ) : (
                  <>Nuestro Enfoque de Tratamiento <span className="font-display italic text-green-700">Informado en Trauma</span></>
                )}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(language === 'en' ? [
                {
                  title: 'Comprehensive Assessment',
                  description: 'Thorough evaluation of trauma history, symptoms, and current functioning to develop personalized treatment plans.'
                },
                {
                  title: 'Medication Management',
                  description: 'Evidence-based psychiatric medications to manage PTSD symptoms, including anxiety, depression, and sleep disturbances.'
                },
                {
                  title: 'Therapy Coordination',
                  description: 'Collaborative care with specialized trauma therapists for EMDR, CPT, and other evidence-based treatments.'
                },
                {
                  title: 'Crisis Safety Planning',
                  description: 'Developing personalized safety plans for managing flashbacks, panic attacks, and other crisis situations.'
                },
                {
                  title: 'Family Support',
                  description: 'Guidance and resources for family members to understand and support the healing process.'
                },
                {
                  title: 'Cultural Considerations',
                  description: 'Treatment approaches that honor cultural background and incorporate culturally relevant healing practices.'
                }
              ] : [
                {
                  title: 'Evaluación Integral',
                  description: 'Evaluación completa del historial de trauma, síntomas y funcionamiento actual para desarrollar planes de tratamiento personalizados.'
                },
                {
                  title: 'Manejo de Medicamentos',
                  description: 'Medicamentos psiquiátricos basados en evidencia para manejar síntomas de TEPT, incluyendo ansiedad, depresión y trastornos del sueño.'
                },
                {
                  title: 'Coordinación de Terapia',
                  description: 'Atención colaborativa con terapeutas especializados en trauma para EMDR, CPT y otros tratamientos basados en evidencia.'
                },
                {
                  title: 'Planificación de Seguridad en Crisis',
                  description: 'Desarrollo de planes de seguridad personalizados para manejar flashbacks, ataques de pánico y otras situaciones de crisis.'
                },
                {
                  title: 'Apoyo Familiar',
                  description: 'Orientación y recursos para miembros de la familia para entender y apoyar el proceso de sanación.'
                },
                {
                  title: 'Consideraciones Culturales',
                  description: 'Enfoques de tratamiento que honran el trasfondo cultural e incorporan prácticas de sanación culturalmente relevantes.'
                }
              ]).map((treatment, index) => (
                <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-bold text-lg">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-body font-bold text-green-800 mb-3">{treatment.title}</h3>
                        <p className="text-gray-600 font-body leading-relaxed">{treatment.description}</p>
                      </div>
                    </div>
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
                  <>Why Choose Dr. Reve for <span className="font-display italic text-green-700">PTSD Treatment</span></>
                ) : (
                  <>Por Qué Elegir a la Dra. Reve para <span className="font-display italic text-green-700">Tratamiento de TEPT</span></>
                )}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="space-y-6">
                  {(language === 'en' ? [
                    'Board-certified psychiatrist with specialized trauma training',
                    'Bilingual services in English and Spanish',
                    'Trauma-informed care approach',
                    'Collaborative treatment with specialized therapists',
                    'Insurance accepted and affordable payment options',
                    'Same-week appointment availability'
                  ] : [
                    'Psiquiatra certificada con entrenamiento especializado en trauma',
                    'Servicios bilingües en inglés y español',
                    'Enfoque de atención informada en trauma',
                    'Tratamiento colaborativo con terapeutas especializados',
                    'Se acepta seguro y opciones de pago accesibles',
                    'Disponibilidad de citas en la misma semana'
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
                    <IconBrain />
                  </WellnessIcon>
                  <h3 className="text-2xl font-body font-bold text-green-800 mb-4">
                    {language === 'en' ? 'Ready to Begin Healing?' : '¿Listo para Comenzar a Sanar?'}
                  </h3>
                  <p className="text-gray-600 font-body leading-relaxed mb-6">
                    {language === 'en'
                      ? 'Take the first step towards recovery. Contact us today to schedule your confidential consultation.'
                      : 'Da el primer paso hacia la recuperación. Contáctanos hoy para programar tu consulta confidencial.'
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

export default PtsdTreatment;
