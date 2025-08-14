import { useEffect } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updateSEO } from '@/utils/seo';
import { ArrowRight, CheckCircle, Phone, Calendar, MapPin, Clock, Brain } from 'lucide-react';
import { IconBrain, IconHeart, IconMoodHappy, IconTarget } from '@tabler/icons-react';
import WellnessIcon from '@/components/WellnessIcon';

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
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-orange-50 to-yellow-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <WellnessIcon size="sm" color="orange">
                    <IconTarget />
                  </WellnessIcon>
                  <span className="text-orange-700 font-body font-semibold text-lg">
                    {language === 'en' ? 'Focus & Success' : 'Enfoque y Éxito'}
                  </span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-body font-bold text-green-800 mb-6">
                  {language === 'en' ? (
                    <>ADHD Treatment in <span className="font-display italic text-green-700">Naples, FL</span></>
                  ) : (
                    <>Tratamiento de TDAH en <span className="font-display italic text-green-700">Naples, FL</span></>
                  )}
                </h1>
                
                <p className="text-lg sm:text-xl text-gray-600 mb-8 font-body leading-relaxed">
                  {language === 'en'
                    ? 'Unlock your potential with expert ADHD treatment. Dr. Melva Reve provides comprehensive evaluation and personalized treatment for adults and teens with attention deficit hyperactivity disorder.'
                    : 'Desbloquee su potencial con tratamiento experto de TDAH. La Dra. Melva Reve brinda evaluación integral y tratamiento personalizado para adultos y adolescentes con trastorno por déficit de atención e hiperactividad.'
                  }
                </p>

                {language === 'es' && (
                  <div className="bg-orange-100 border-l-4 border-orange-500 p-4 mb-8">
                    <p className="text-orange-800 font-body">
                      <strong>El TDAH no es falta de disciplina o pereza.</strong> Es una diferencia neurológica real que, 
                      con el tratamiento adecuado, puede convertirse en una fortaleza. Ofrecemos evaluación sin prejuicios 
                      y tratamiento culturalmente sensible.
                    </p>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/contact">
                    <Button size="lg" className="bg-green-800 hover:bg-green-700 text-white font-semibold py-6 px-8 rounded-full inline-flex items-center gap-3 transition-all duration-300">
                      <Calendar className="w-5 h-5" />
                      {language === 'en' ? 'Schedule Evaluation' : 'Programar Evaluación'}
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  
                  <Button variant="outline" size="lg" className="border-green-800 text-green-800 hover:bg-green-50 font-semibold py-6 px-8 rounded-full inline-flex items-center gap-3">
                    <Phone className="w-5 h-5" />
                    <a href="tel:+1-239-555-0123" className="flex items-center gap-3">
                      {language === 'en' ? 'Call Now' : 'Llamar Ahora'}
                    </a>
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10">
                  <div className="flex items-center gap-4 mb-6">
                    <WellnessIcon size="md" color="blue">
                      <Brain />
                    </WellnessIcon>
                    <div>
                      <h3 className="text-xl font-body font-bold text-green-800">
                        {language === 'en' ? 'ADHD Quick Facts' : 'Datos Rápidos sobre TDAH'}
                      </h3>
                      <p className="text-gray-600 font-body">
                        {language === 'en' ? 'Understanding ADHD' : 'Entendiendo el TDAH'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700 font-body">
                        {language === 'en' ? 'Affects 4.4% of adults in the US' : 'Afecta al 4.4% de adultos en EEUU'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700 font-body">
                        {language === 'en' ? 'Often undiagnosed until adulthood' : 'A menudo no diagnosticado hasta la adultez'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700 font-body">
                        {language === 'en' ? 'Highly treatable with proper care' : 'Altamente tratable con atención adecuada'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700 font-body">
                        {language === 'en' ? 'Evaluation available in English/Spanish' : 'Evaluación disponible en inglés/español'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Age Groups Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
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
                <Card key={index} className="border-orange-100 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-2xl font-body font-bold text-green-800">{group.title}</CardTitle>
                    <CardDescription className="text-gray-600 font-body leading-relaxed">{group.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {group.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                          <span className="text-gray-700 font-body">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
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

        {/* Practice Information Section */}
        <section className="py-16 sm:py-20 bg-orange-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                  {language === 'en' ? (
                    <>Expert ADHD Care in <span className="font-display italic text-green-700">Naples</span></>
                  ) : (
                    <>Atención Experta de TDAH en <span className="font-display italic text-green-700">Naples</span></>
                  )}
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <WellnessIcon size="sm" color="orange">
                      <IconBrain />
                    </WellnessIcon>
                    <div>
                      <h3 className="text-xl font-body font-bold text-green-800 mb-2">
                        {language === 'en' ? 'Evidence-Based Treatment' : 'Tratamiento Basado en Evidencia'}
                      </h3>
                      <p className="text-gray-600 font-body leading-relaxed">
                        {language === 'en'
                          ? 'Our ADHD treatment follows the latest research and clinical guidelines to ensure the most effective care for each individual.'
                          : 'Nuestro tratamiento de TDAH sigue las últimas investigaciones y directrices clínicas para asegurar la atención más efectiva para cada individuo.'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <WellnessIcon size="sm" color="blue">
                      <IconMoodHappy />
                    </WellnessIcon>
                    <div>
                      <h3 className="text-xl font-body font-bold text-green-800 mb-2">
                        {language === 'en' ? 'Strength-Based Approach' : 'Enfoque Basado en Fortalezas'}
                      </h3>
                      <p className="text-gray-600 font-body leading-relaxed">
                        {language === 'en'
                          ? 'We focus on identifying and building upon your unique strengths while addressing challenges, helping you thrive with ADHD.'
                          : 'Nos enfocamos en identificar y construir sobre sus fortalezas únicas mientras abordamos desafíos, ayudándole a prosperar con TDAH.'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <WellnessIcon size="sm" color="green">
                      <IconHeart />
                    </WellnessIcon>
                    <div>
                      <h3 className="text-xl font-body font-bold text-green-800 mb-2">
                        {language === 'en' ? 'Family-Centered Care' : 'Atención Centrada en la Familia'}
                      </h3>
                      <p className="text-gray-600 font-body leading-relaxed">
                        {language === 'en'
                          ? 'We involve families in the treatment process, providing education and strategies to support success at home and school.'
                          : 'Involucramos a las familias en el proceso de tratamiento, brindando educación y estrategias para apoyar el éxito en casa y la escuela.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Card className="bg-green-800 text-white border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-body font-bold text-white">
                    {language === 'en' ? 'Start Your ADHD Journey' : 'Comience Su Jornada con TDAH'}
                  </CardTitle>
                  <CardDescription className="text-green-200 font-body">
                    {language === 'en' 
                      ? 'Take the first step toward better focus and success'
                      : 'Dé el primer paso hacia mejor enfoque y éxito'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-green-300" />
                      <span className="font-body">Naples, FL & Surrounding Areas</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-green-300" />
                      <span className="font-body">
                        {language === 'en' ? 'Comprehensive ADHD Evaluations' : 'Evaluaciones Integrales de TDAH'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-300" />
                      <span className="font-body">
                        {language === 'en' ? 'Adult & Teen Specialization' : 'Especialización en Adultos y Adolescentes'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-300" />
                      <span className="font-body">
                        {language === 'en' ? 'Bilingual Services Available' : 'Servicios Bilingües Disponibles'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <Link href="/contact">
                      <Button size="lg" variant="secondary" className="bg-white text-green-800 hover:bg-green-50 font-semibold py-6 px-8 rounded-full w-full inline-flex items-center justify-center gap-3">
                        <Calendar className="w-5 h-5" />
                        {language === 'en' ? 'Schedule ADHD Evaluation' : 'Programar Evaluación de TDAH'}
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdhdTreatment;