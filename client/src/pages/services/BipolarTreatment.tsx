import { useEffect } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ServiceHeroMasonry } from '@/components/ServiceHeroMasonry';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updateSEO, addServiceSchema } from '@/utils/seo';
import { ArrowRight, CheckCircle, Phone, Calendar, MapPin, Clock, Activity, TrendingUp, TrendingDown, Sparkles, Zap, Brain } from 'lucide-react';
import { IconBrain, IconHeart, IconMoodHappy, IconMoodUp, IconMoodSad } from '@tabler/icons-react';
import WellnessIcon from '@/components/WellnessIcon';

// Import generated images
import doctorImage from "@assets/generated_images/Professional_psychiatrist_office_photo_e259ed9b.png";
import bipolarImage from "@assets/generated_images/Wellness_meditation_space_ae6f4d77.png";
import therapyRoomImage from "@assets/generated_images/Therapy_room_interior_4b5878fd.png";
import drMelvaOfficeImage from "../../assets/dr-melva-office.webp";

const BipolarTreatment = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Bipolar Disorder Treatment Naples FL - Mood Stabilization | Dr. Melva Reve'
        : 'Tratamiento Trastorno Bipolar Naples FL - Estabilización del Ánimo | Dra. Melva Reve',
      description: language === 'en'
        ? 'Expert bipolar disorder treatment in Naples, FL. Dr. Melva Reve provides comprehensive care for bipolar I, II, and cyclothymia. Mood stabilization, medication management, bilingual services.'
        : 'Tratamiento experto de trastorno bipolar en Naples, FL. La Dra. Melva Reve brinda atención integral para bipolar I, II y ciclotimia. Estabilización del ánimo, manejo de medicamentos, servicios bilingües.',
      keywords: language === 'en'
        ? 'bipolar disorder treatment Naples FL, mood stabilization Naples, bipolar psychiatrist Naples, manic depression treatment Naples, mood swings Naples, lithium treatment Naples'
        : 'tratamiento trastorno bipolar Naples FL, estabilización ánimo Naples, psiquiatra bipolar Naples, tratamiento depresión maníaca Naples, cambios humor Naples, tratamiento litio Naples',
      lang: language,
      canonical: language === 'en' ? '/services/bipolar-treatment' : '/es/servicios/tratamiento-bipolar'
    };
    updateSEO(seoData);
    
    // Add Service Schema (SPOKE) - connects to MedicalClinic HUB
    addServiceSchema({
      serviceType: "Bipolar Treatment",
      name: language === 'en' 
        ? "Tratamiento de Trastorno Bipolar en Naples, FL"
        : "Bipolar Disorder Treatment in Naples, FL",
      description: language === 'en'
        ? "Expert psychiatric care for bipolar disorder with mood stabilization, medication management, and comprehensive support for bipolar I, II, and cyclothymia."
        : "Atención psiquiátrica experta para trastorno bipolar con estabilización del ánimo, manejo de medicamentos y apoyo integral para bipolar I, II y ciclotimia.",
      pageId: "bipolar"
    });
  }, [language]);

  const symptoms = language === 'en' ? [
    {
      type: 'Manic Episodes',
      icon: IconMoodUp,
      items: [
        'Elevated, euphoric mood',
        'Decreased need for sleep',
        'Racing thoughts or rapid speech',
        'Increased energy or activity',
        'Poor judgment or risky behavior',
        'Grandiose thoughts or inflated self-esteem'
      ]
    },
    {
      type: 'Depressive Episodes',
      icon: IconMoodSad,
      items: [
        'Persistent sadness or emptiness',
        'Loss of interest in activities',
        'Fatigue or loss of energy',
        'Difficulty concentrating',
        'Sleep disturbances',
        'Thoughts of death or suicide'
      ]
    }
  ] : [
    {
      type: 'Episodios Maníacos',
      icon: IconMoodUp,
      items: [
        'Estado de ánimo elevado, eufórico',
        'Disminución de la necesidad de dormir',
        'Pensamientos acelerados o habla rápida',
        'Aumento de energía o actividad',
        'Mal juicio o comportamiento arriesgado',
        'Pensamientos grandiosos o autoestima inflada'
      ]
    },
    {
      type: 'Episodios Depresivos',
      icon: IconMoodSad,
      items: [
        'Tristeza persistente o vacío',
        'Pérdida de interés en actividades',
        'Fatiga o pérdida de energía',
        'Dificultad para concentrarse',
        'Trastornos del sueño',
        'Pensamientos de muerte o suicidio'
      ]
    }
  ];

  const bipolarTypes = language === 'en' ? [
    {
      title: 'Bipolar I Disorder',
      description: 'Characterized by at least one manic episode that lasts 7 days or requires hospitalization.',
      features: [
        'Full manic episodes',
        'May include depressive episodes',
        'Significant functional impairment',
        'Often requires mood stabilizers'
      ]
    },
    {
      title: 'Bipolar II Disorder',
      description: 'Involves hypomanic episodes and major depressive episodes, but no full manic episodes.',
      features: [
        'Hypomanic episodes (less severe)',
        'Major depressive episodes',
        'Often misdiagnosed as depression',
        'Requires specialized treatment approach'
      ]
    },
    {
      title: 'Cyclothymic Disorder',
      description: 'Chronic mood instability with numerous periods of hypomanic and depressive symptoms.',
      features: [
        'Milder but chronic symptoms',
        'Symptoms for at least 2 years',
        'Periods of normal mood',
        'May progress to Bipolar I or II'
      ]
    }
  ] : [
    {
      title: 'Trastorno Bipolar I',
      description: 'Caracterizado por al menos un episodio maníaco que dura 7 días o requiere hospitalización.',
      features: [
        'Episodios maníacos completos',
        'Puede incluir episodios depresivos',
        'Deterioro funcional significativo',
        'A menudo requiere estabilizadores del ánimo'
      ]
    },
    {
      title: 'Trastorno Bipolar II',
      description: 'Involucra episodios hipomaníacos y episodios depresivos mayores, pero no episodios maníacos completos.',
      features: [
        'Episodios hipomaníacos (menos severos)',
        'Episodios depresivos mayores',
        'A menudo mal diagnosticado como depresión',
        'Requiere enfoque de tratamiento especializado'
      ]
    },
    {
      title: 'Trastorno Ciclotímico',
      description: 'Inestabilidad crónica del ánimo con numerosos períodos de síntomas hipomaníacos y depresivos.',
      features: [
        'Síntomas más leves pero crónicos',
        'Síntomas por al menos 2 años',
        'Períodos de estado de ánimo normal',
        'Puede progresar a Bipolar I o II'
      ]
    }
  ];

  const treatments = language === 'en' ? [
    {
      title: 'Comprehensive Mood Assessment',
      description: 'Detailed evaluation to accurately diagnose bipolar disorder type and rule out other conditions.'
    },
    {
      title: 'Mood Stabilizer Management',
      description: 'Expert prescribing and monitoring of mood stabilizers like lithium, anticonvulsants, and atypical antipsychotics.'
    },
    {
      title: 'Episode Prevention Planning',
      description: 'Strategies to identify early warning signs and prevent manic and depressive episodes.'
    },
    {
      title: 'Psychotherapy Coordination',
      description: 'Collaboration with therapists specializing in bipolar disorder, including CBT and family therapy.'
    },
    {
      title: 'Lifestyle & Sleep Management',
      description: 'Guidance on sleep hygiene, routine maintenance, and lifestyle factors crucial for mood stability.'
    },
    {
      title: 'Crisis Intervention Support',
      description: 'Emergency planning and support during acute manic or depressive episodes.'
    }
  ] : [
    {
      title: 'Evaluación Integral del Estado de Ánimo',
      description: 'Evaluación detallada para diagnosticar con precisión el tipo de trastorno bipolar y descartar otras condiciones.'
    },
    {
      title: 'Manejo de Estabilizadores del Ánimo',
      description: 'Prescripción experta y monitoreo de estabilizadores del ánimo como litio, anticonvulsivos y antipsicóticos atípicos.'
    },
    {
      title: 'Planificación de Prevención de Episodios',
      description: 'Estrategias para identificar señales de advertencia temprana y prevenir episodios maníacos y depresivos.'
    },
    {
      title: 'Coordinación de Psicoterapia',
      description: 'Colaboración con terapeutas especializados en trastorno bipolar, incluyendo TCC y terapia familiar.'
    },
    {
      title: 'Manejo de Estilo de Vida y Sueño',
      description: 'Orientación sobre higiene del sueño, mantenimiento de rutina y factores de estilo de vida cruciales para la estabilidad del ánimo.'
    },
    {
      title: 'Apoyo en Intervención de Crisis',
      description: 'Planificación de emergencia y apoyo durante episodios agudos maníacos o depresivos.'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section with Masonry Layout */}
        <ServiceHeroMasonry
          tagline={{
            en: 'Mood Stability',
            es: 'Estabilidad del Ánimo'
          }}
          title={{
            en: 'Bipolar Disorder Treatment in Naples, FL',
            es: 'Tratamiento de Trastorno Bipolar en Naples, FL'
          }}
          description={{
            en: 'Find balance and stability with expert bipolar disorder treatment. Dr. Melva Reve provides comprehensive care for mood stabilization, helping you manage both manic and depressive episodes effectively.',
            es: 'Encuentre equilibrio y estabilidad con tratamiento experto de trastorno bipolar. La Dra. Melva Reve brinda atención integral para estabilización del ánimo, ayudándole a manejar episodios maníacos y depresivos efectivamente.'
          }}
          specialNote={{
            es: '<strong>El trastorno bipolar es una condición médica tratable.</strong> Con el tratamiento adecuado, puede lograr estabilidad del ánimo y vivir una vida plena. Ofrecemos atención especializada que comprende su cultura y necesidades.'
          }}
          facts={{
            title: {
              en: 'Bipolar Facts',
              es: 'Datos sobre Bipolar'
            },
            items: [
              {
                en: '2.8% of adults have bipolar disorder',
                es: '2.8% de adultos tienen trastorno bipolar'
              },
              {
                en: 'Mood stabilizers are highly effective',
                es: 'Los estabilizadores del ánimo son muy efectivos'
              },
              {
                en: 'Early treatment improves outcomes',
                es: 'El tratamiento temprano mejora resultados'
              },
              {
                en: 'Cultural sensitivity in treatment',
                es: 'Sensibilidad cultural en el tratamiento'
              }
            ]
          }}
          quickStats={{
            items: [
              {
                en: 'Mood stabilizer management',
                es: 'Manejo de estabilizadores del ánimo'
              },
              {
                en: 'Episode prevention planning',
                es: 'Planificación de prevención de episodios'
              },
              {
                en: 'Crisis intervention support',
                es: 'Apoyo en intervención de crisis'
              }
            ]
          }}
          images={{
            doctorImage,
            therapyRoomImage: bipolarImage,
            symbolImage: therapyRoomImage
          }}
        /> 

        {/* Modern Treatment Approach Section */}
        <section className="py-16 sm:py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 shadow-lg border border-green-100">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Content Side */}
                <div className="lg:col-span-2">
                  <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    {language === 'en' ? 'Comprehensive Care' : 'Atención Integral'}
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                    {language === 'en' ? (
                      <>Our <span className="font-display italic text-green-700">Comprehensive</span> Treatment Approach</>
                    ) : (
                      <>Nuestro Enfoque de Tratamiento <span className="font-display italic text-green-700">Integral</span></>
                    )}
                  </h2>
                  
                  <p className="text-lg sm:text-xl text-gray-600 mb-8 font-body leading-relaxed">
                    {language === 'en'
                      ? 'Bipolar disorder requires specialized expertise and a multifaceted treatment approach addressing both manic and depressive episodes for long-term stability.'
                      : 'El trastorno bipolar requiere experiencia especializada y un enfoque de tratamiento multifacético que aborde tanto episodios maníacos como depresivos para estabilidad a largo plazo.'
                    }
                  </p>

                  {/* Treatment List */}
                  <div className="grid gap-4 mb-8">
                    {(language === 'en' ? [
                      {
                        title: 'Mood Stabilization',
                        description: 'Evidence-based medications including lithium, anticonvulsants, and atypical antipsychotics.'
                      },
                      {
                        title: 'Comprehensive Assessment',
                        description: 'Thorough evaluation of mood patterns, triggers, and medical history.'
                      },
                      {
                        title: 'Medication Monitoring',
                        description: 'Regular blood work and careful monitoring to ensure therapeutic levels.'
                      },
                      {
                        title: 'Episode Prevention',
                        description: 'Strategies to prevent manic and depressive episodes through lifestyle management.'
                      }
                    ] : [
                      {
                        title: 'Estabilización del Ánimo',
                        description: 'Medicamentos basados en evidencia incluyendo litio, anticonvulsivos y antipsicóticos atípicos.'
                      },
                      {
                        title: 'Evaluación Integral',
                        description: 'Evaluación completa de patrones del ánimo, desencadenantes e historial médico.'
                      },
                      {
                        title: 'Monitoreo de Medicamentos',
                        description: 'Análisis de sangre regulares y monitoreo cuidadoso para asegurar niveles terapéuticos.'
                      },
                      {
                        title: 'Prevención de Episodios',
                        description: 'Estrategias para prevenir episodios maníacos y depresivos a través del manejo del estilo de vida.'
                      }
                    ]).map((treatment, index) => (
                      <div key={index} className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-green-600 font-bold text-sm">{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-body font-bold text-green-800 mb-1">{treatment.title}</h3>
                            <p className="text-gray-600 font-body text-sm leading-relaxed">{treatment.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link href="/contact">
                    <Button className="group inline-flex items-center justify-center gap-3 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 bg-green-700 text-white hover:bg-green-800 px-6 sm:px-8 py-6 sm:py-7">
                      <span>{language === 'en' ? 'Get Specialized Care' : 'Obtener Atención Especializada'}</span>
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
                      <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
                      <div className="text-sm text-gray-600 font-body">
                        {language === 'en' ? 'Achieve mood stability' : 'Logran estabilidad del ánimo'}
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                      <div className="text-sm text-gray-600 font-body">
                        {language === 'en' ? 'Crisis support available' : 'Apoyo de crisis disponible'}
                      </div>
                    </div>
                  </div>

                  {/* Dr. Melva Office Photo - Fills remaining space */}
                  <div className="flex-1 w-full overflow-hidden rounded-xl shadow-md">
                    <img 
                      src={drMelvaOfficeImage}
                      alt="Dr. Melva Reve in her professional psychiatric office - Naples, FL"
                      className="w-full h-full object-cover object-[65%_35%] scale-125"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Symptoms Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                <WellnessIcon size="md" color="green" className="opacity-70">
                  <IconBrain />
                </WellnessIcon>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-body font-bold text-green-800 text-center">
                  {language === 'en' ? (
                    <>Understanding <span className="font-display italic text-green-700">Bipolar</span> Symptoms</>
                  ) : (
                    <>Entendiendo Síntomas del <span className="font-display italic text-green-700">Trastorno Bipolar</span></>
                  )}
                </h2>
                <WellnessIcon size="md" color="green" className="opacity-70">
                  <IconHeart />
                </WellnessIcon>
              </div>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed px-4 sm:px-0">
                {language === 'en'
                  ? 'Bipolar disorder involves distinct episodes of mania/hypomania and depression. Understanding these patterns is key to effective treatment.'
                  : 'El trastorno bipolar involucra episodios distintos de manía/hipomanía y depresión. Entender estos patrones es clave para un tratamiento efectivo.'
                }
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {symptoms.map((symptomGroup, groupIndex) => {
                const IconComponent = symptomGroup.icon;
                return (
                  <div
                    key={groupIndex}
                    className={`rounded-2xl sm:rounded-3xl ${
                      groupIndex === 0 
                        ? 'bg-green-50' 
                        : 'bg-blue-50'
                    }`}
                  >
                    <div className="p-6 sm:p-8 text-green-800">
                      {/* Header with Icon and Title */}
                      <div className="flex items-center gap-4 mb-6 bg-[#ffffff00]">
                        <div className="p-3 rounded-2xl">
                          <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-green-800" />
                        </div>
                        <div>
                          <h3 className="text-xl sm:text-2xl font-display font-bold mb-1 text-green-800">
                            {symptomGroup.type}
                          </h3>
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#16a34a] text-[#ffffff]">
                            {groupIndex === 0 
                              ? <TrendingUp className="w-3 h-3" />
                              : <TrendingDown className="w-3 h-3" />
                            }
                            {groupIndex === 0 
                              ? (language === 'en' ? 'Elevated Mood' : 'Ánimo Elevado')
                              : (language === 'en' ? 'Depressed Mood' : 'Ánimo Deprimido')
                            }
                          </div>
                        </div>
                      </div>

                      {/* Symptoms Grid */}
                      <div className="grid gap-3 mb-6">
                        {symptomGroup.items.map((item, index) => (
                          <div 
                            key={index} 
                            className="flex items-start gap-3 p-3 rounded-xl"
                          >
                            <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2 bg-green-500"></div>
                            <span className="text-sm sm:text-base font-body leading-relaxed text-green-800">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Bottom Action Area */}
                      <div className="p-4 rounded-xl bg-[#ffffff]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {groupIndex === 0 ? (
                              <Zap className="w-4 h-4 text-green-800" />
                            ) : (
                              <Brain className="w-4 h-4 text-green-800" />
                            )}
                            <span className="text-sm font-medium text-green-800">
                              {groupIndex === 0 
                                ? (language === 'en' ? 'High Energy Phase' : 'Fase de Alta Energía')
                                : (language === 'en' ? 'Low Energy Phase' : 'Fase de Baja Energía')
                              }
                            </span>
                          </div>
                          <div className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                            {groupIndex === 0 
                              ? (language === 'en' ? 'MANIC' : 'MANÍACO')
                              : (language === 'en' ? 'DEPRESSIVE' : 'DEPRESIVO')
                            }
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

        {/* Types of Bipolar Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {language === 'en' ? (
                  <>Types of <span className="font-display italic text-green-700">Bipolar Disorder</span></>
                ) : (
                  <>Tipos de <span className="font-display italic text-green-700">Trastorno Bipolar</span></>
                )}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {(language === 'en' ? [
                {
                  type: 'Bipolar I Disorder',
                  description: 'At least one manic episode lasting 7+ days or requiring hospitalization. May include depressive episodes.',
                  severity: 'High',
                  features: ['Full manic episodes', 'Severe impairment', 'May require hospitalization'],
                  color: 'purple'
                },
                {
                  type: 'Bipolar II Disorder',
                  description: 'At least one hypomanic episode and one major depressive episode. No full manic episodes.',
                  severity: 'Moderate',
                  features: ['Hypomanic episodes', 'Major depression', 'Often misdiagnosed'],
                  color: 'blue'
                },
                {
                  type: 'Cyclothymic Disorder',
                  description: 'Numerous periods of hypomanic and depressive symptoms for at least 2 years (1 year in children).',
                  severity: 'Mild',
                  features: ['Chronic symptoms', 'Milder episodes', 'Long-term pattern'],
                  color: 'green'
                }
              ] : [
                {
                  type: 'Trastorno Bipolar I',
                  description: 'Al menos un episodio maníaco que dura 7+ días o requiere hospitalización. Puede incluir episodios depresivos.',
                  severity: 'Alto',
                  features: ['Episodios maníacos completos', 'Deterioro severo', 'Puede requerir hospitalización'],
                  color: 'purple'
                },
                {
                  type: 'Trastorno Bipolar II',
                  description: 'Al menos un episodio hipomaníaco y un episodio depresivo mayor. Sin episodios maníacos completos.',
                  severity: 'Moderado',
                  features: ['Episodios hipomaníacos', 'Depresión mayor', 'A menudo mal diagnosticado'],
                  color: 'blue'
                },
                {
                  type: 'Trastorno Ciclotímico',
                  description: 'Numerosos períodos de síntomas hipomaníacos y depresivos durante al menos 2 años (1 año en niños).',
                  severity: 'Leve',
                  features: ['Síntomas crónicos', 'Episodios más leves', 'Patrón a largo plazo'],
                  color: 'green'
                }
              ]).map((type, index) => {
                const backgroundClasses: Record<string, string> = {
                  purple: 'bg-green-50',
                  blue: 'bg-blue-50',
                  green: 'bg-purple-50'
                };

                return (
                  <div
                    key={index}
                    className={`rounded-2xl sm:rounded-3xl ${backgroundClasses[type.color]} min-h-[400px] flex flex-col`}
                  >
                    <div className="p-6 sm:p-8 text-green-800 flex flex-col h-full bg-[#f0fdf4]">
                      {/* Header */}
                      <div className="text-center mb-6">
                        <div className="inline-flex p-4 rounded-2xl mb-4 bg-[#00ff5e5c]">
                          <Activity className="w-8 h-8 text-green-800" />
                        </div>
                        
                        <div className="px-3 py-1 rounded-full text-xs font-bold text-green-800 inline-block mb-3">
                          {type.severity}
                        </div>
                        
                        <h3 className="text-xl sm:text-2xl font-display font-bold mb-3 text-green-800">
                          {type.type}
                        </h3>
                        
                        <p className="text-green-800 font-body leading-relaxed text-sm sm:text-base">
                          {type.description}
                        </p>
                      </div>

                      {/* Features List */}
                      <div className="flex-grow">
                        <div className="space-y-3 mb-6">
                          {type.features.map((feature, featureIndex) => (
                            <div 
                              key={featureIndex}
                              className="flex items-center gap-3 p-3 rounded-xl"
                            >
                              <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                              <span className="text-sm font-body text-green-800">
                                {feature}
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
                              {language === 'en' ? 'Treatment Focus' : 'Enfoque de Tratamiento'}
                            </span>
                            <div className="flex items-center gap-1">
                              <Sparkles className="w-4 h-4 text-green-800" />
                              <span className="text-xs font-medium text-green-800">
                                {language === 'en' ? 'Specialized Care' : 'Atención Especializada'}
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

        {/* Why Choose Section */}
        <section className="py-16 sm:py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {language === 'en' ? (
                  <>Why Choose Dr. Reve for <span className="font-display italic text-green-700">Bipolar Treatment</span></>
                ) : (
                  <>Por Qué Elegir a la Dra. Reve para <span className="font-display italic text-green-700">Tratamiento Bipolar</span></>
                )}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="space-y-6">
                  {(language === 'en' ? [
                    'Board-certified psychiatrist with mood disorder expertise',
                    'Bilingual services in English and Spanish',
                    'Evidence-based medication management',
                    'Collaborative approach with therapists and support teams',
                    'Regular monitoring and adjustment of treatment plans',
                    <>Insurance accepted and flexible scheduling at <Link href="/locations/naples" className="text-green-700 hover:text-green-800 underline">our Naples, FL location</Link></>
                  ] : [
                    'Psiquiatra certificada con experiencia en trastornos del ánimo',
                    'Servicios bilingües en inglés y español',
                    'Manejo de medicamentos basado en evidencia',
                    'Enfoque colaborativo con terapeutas y equipos de apoyo',
                    'Monitoreo regular y ajuste de planes de tratamiento',
                    <>Se acepta seguro y horarios flexibles en <Link href="/locations/naples" className="text-green-700 hover:text-green-800 underline">nuestra ubicación en Naples, FL</Link></>
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
                    <Activity />
                  </WellnessIcon>
                  <h3 className="text-2xl font-body font-bold text-green-800 mb-4">
                    {language === 'en' ? 'Ready to Stabilize Your Mood?' : '¿Listo para Estabilizar tu Ánimo?'}
                  </h3>
                  <p className="text-gray-600 font-body leading-relaxed mb-6">
                    {language === 'en'
                      ? 'Take control of your bipolar disorder with expert psychiatric care. Schedule your consultation today.'
                      : 'Toma control de tu trastorno bipolar con atención psiquiátrica experta. Programa tu consulta hoy.'
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

export default BipolarTreatment;
