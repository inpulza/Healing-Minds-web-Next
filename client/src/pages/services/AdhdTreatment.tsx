import { useEffect } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ServiceHeroMasonry } from '@/components/ServiceHeroMasonry';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updateSEO } from '@/utils/seo';
import { ArrowRight, CheckCircle, Phone, Calendar, MapPin, Clock, Brain } from 'lucide-react';
import { IconBrain, IconHeart, IconMoodHappy, IconTarget } from '@tabler/icons-react';
import WellnessIcon from '@/components/WellnessIcon';

// Import generated images
import doctorImage from "@assets/generated_images/Professional_psychiatrist_office_photo_e259ed9b.png";
import adhdImage from "@assets/generated_images/ADHD_concentration_challenges_4b3ea4fb.png";
import therapyRoomImage from "@assets/generated_images/Therapy_room_interior_4b5878fd.png";

const AdhdTreatment = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'ADHD Treatment Naples FL - Adult & Teen ADHD Psychiatrist | Dr. Melva Reve'
        : 'Tratamiento TDAH Naples FL - Psiquiatra TDAH Adultos y Adolescentes | Dra. Melva Reve',
      description: language === 'en'
        ? 'Expert ADHD treatment for adults and teens in Naples, FL. Dr. Melva Reve provides comprehensive evaluation, medication management, and behavioral strategies. Bilingual ADHD psychiatrist.'
        : 'Tratamiento experto de TDAH para adultos y adolescentes en Naples, FL. La Dra. Melva Reve brinda evaluación integral, manejo de medicamentos y estrategias conductuales. Psiquiatra TDAH bilingüe.',
      keywords: language === 'en'
        ? 'ADHD treatment Naples FL, adult ADHD Naples, teen ADHD Naples, ADHD psychiatrist Naples, ADHD medication Naples, attention deficit disorder Naples'
        : 'tratamiento TDAH Naples FL, TDAH adultos Naples, TDAH adolescentes Naples, psiquiatra TDAH Naples, medicamento TDAH Naples, trastorno déficit atención Naples',
      lang: language,
      canonical: language === 'en' ? '/services/adhd-treatment' : '/es/servicios/tratamiento-tdah'
    };
    updateSEO(seoData);
  }, [language]);

  const symptoms = language === 'en' ? [
    {
      category: 'Inattention',
      items: [
        'Difficulty focusing on tasks',
        'Easily distracted',
        'Forgetfulness in daily activities',
        'Avoiding tasks requiring mental effort'
      ]
    },
    {
      category: 'Hyperactivity',
      items: [
        'Restlessness or fidgeting',
        'Difficulty sitting still',
        'Excessive talking',
        'Feeling constantly "on the go"'
      ]
    },
    {
      category: 'Impulsivity',
      items: [
        'Interrupting others',
        'Difficulty waiting turns',
        'Making hasty decisions',
        'Acting without thinking'
      ]
    }
  ] : [
    {
      category: 'Falta de Atención',
      items: [
        'Dificultad para enfocarse en tareas',
        'Se distrae fácilmente',
        'Olvidos en actividades diarias',
        'Evitar tareas que requieren esfuerzo mental'
      ]
    },
    {
      category: 'Hiperactividad',
      items: [
        'Inquietud o movimientos nerviosos',
        'Dificultad para permanecer sentado',
        'Hablar excesivamente',
        'Sentirse constantemente "en movimiento"'
      ]
    },
    {
      category: 'Impulsividad',
      items: [
        'Interrumpir a otros',
        'Dificultad para esperar turnos',
        'Tomar decisiones apresuradas',
        'Actuar sin pensar'
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
            en: 'ADHD Treatment in Naples, FL',
            es: 'Tratamiento de TDAH en Naples, FL'
          }}
          description={{
            en: 'Unlock your potential with expert ADHD treatment. Dr. Melva Reve provides comprehensive evaluation and personalized treatment for adults and teens with attention deficit hyperactivity disorder.',
            es: 'Desbloquee su potencial con tratamiento experto de TDAH. La Dra. Melva Reve brinda evaluación integral y tratamiento personalizado para adultos y adolescentes con trastorno por déficit de atención e hiperactividad.'
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
                en: 'Teen and adult treatment',
                es: 'Tratamiento para adolescentes y adultos'
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

        {/* Modern Age Groups Section */}
        <section className="py-16 sm:py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 shadow-lg border border-green-100">
              <div className="text-center mb-12">
                <div className="inline-block bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  {language === 'en' ? 'Age-Specific Care' : 'Atención Específica por Edad'}
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                  {language === 'en' ? (
                    <>ADHD Treatment for <span className="font-display italic text-green-700">All Ages</span></>
                  ) : (
                    <>Tratamiento de TDAH para <span className="font-display italic text-green-700">Todas las Edades</span></>
                  )}
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                  {language === 'en'
                    ? 'We provide specialized ADHD care tailored to the unique needs of different age groups, from teens navigating school to adults managing careers.'
                    : 'Brindamos atención especializada de TDAH adaptada a las necesidades únicas de diferentes grupos de edad, desde adolescentes navegando la escuela hasta adultos manejando carreras.'
                  }
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {ageGroups.map((group, index) => (
                  <div key={index} className="bg-blue-50 rounded-xl p-8 border border-blue-200 hover:bg-blue-100 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-300">
                        <span className="text-blue-600 font-bold text-lg">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-body font-bold text-green-800">{group.title}</h3>
                        <p className="text-gray-600 font-body">{group.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {group.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          <span className="text-gray-700 font-body">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Photo Placeholder - Full Width */}
              <div className="mt-8 -mx-8 sm:-mx-10 lg:-mx-12">
                <div className="w-full h-48 bg-green-50 border-2 border-dashed border-green-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-600 font-bold">🎯</span>
                    </div>
                    <p className="text-green-600 font-body text-sm">Aquí va una foto</p>
                    <p className="text-green-500 font-body text-xs">Enfoque/concentración</p>
                  </div>
                </div>
              </div>

              {/* Action Section */}
              <div className="text-center mt-12">
                <Link href="/contact">
                  <Button className="group inline-flex items-center justify-center gap-3 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 bg-green-600 text-white hover:bg-green-700 px-6 sm:px-8 py-6 sm:py-7">
                    <span>{language === 'en' ? 'Schedule ADHD Evaluation' : 'Programar Evaluación de TDAH'}</span>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 min-w-[2rem] min-h-[2rem] sm:min-w-[2.25rem] sm:min-h-[2.25rem] rounded-full flex items-center justify-center transition-all duration-300 bg-green-500 flex-shrink-0">
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Symptoms Section */}
        <section className="py-16 sm:py-20 bg-orange-50">
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
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {symptoms.map((category, index) => (
                <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl font-body font-bold text-green-800 flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-bold text-sm">{index + 1}</span>
                      </div>
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
                          <span className="text-gray-700 font-body text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {treatments.map((treatment, index) => (
                <Card key={index} className="border-orange-100 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-orange-600 font-bold text-lg">{index + 1}</span>
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
      </main>
      
      <Footer />
    </div>
  );
};

export default AdhdTreatment;
