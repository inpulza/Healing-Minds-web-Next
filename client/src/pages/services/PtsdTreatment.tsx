import { useEffect } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updateSEO } from '@/utils/seo';
import { ArrowRight, CheckCircle, Phone, Calendar, MapPin, Clock, Shield } from 'lucide-react';
import { IconBrain, IconHeart, IconMoodHappy, IconShield } from '@tabler/icons-react';
import WellnessIcon from '@/components/WellnessIcon';

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
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <WellnessIcon size="sm" color="purple">
                    <IconShield />
                  </WellnessIcon>
                  <span className="text-purple-700 font-body font-semibold text-lg">
                    {language === 'en' ? 'Trauma Recovery' : 'Recuperación del Trauma'}
                  </span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-body font-bold text-green-800 mb-6">
                  {language === 'en' ? (
                    <>PTSD Treatment in <span className="font-display italic text-green-700">Naples, FL</span></>
                  ) : (
                    <>Tratamiento de TEPT en <span className="font-display italic text-green-700">Naples, FL</span></>
                  )}
                </h1>
                
                <p className="text-lg sm:text-xl text-gray-600 mb-8 font-body leading-relaxed">
                  {language === 'en'
                    ? 'Find healing and reclaim your life with expert PTSD treatment. Dr. Melva Reve provides trauma-informed psychiatric care with compassion, understanding, and evidence-based approaches.'
                    : 'Encuentre sanación y reclame su vida con tratamiento experto de TEPT. La Dra. Melva Reve brinda atención psiquiátrica informada en trauma con compasión, comprensión y enfoques basados en evidencia.'
                  }
                </p>

                {language === 'es' && (
                  <div className="bg-purple-100 border-l-4 border-purple-500 p-4 mb-8">
                    <p className="text-purple-800 font-body">
                      <strong>El trauma no define quién es usted.</strong> La recuperación es posible con el apoyo adecuado. 
                      Nuestro enfoque respeta su cultura y experiencias, ofreciendo un espacio seguro para sanar 
                      sin juicio ni estigma.
                    </p>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/contact">
                    <Button size="lg" className="bg-green-800 hover:bg-green-700 text-white font-semibold py-6 px-8 rounded-full inline-flex items-center gap-3 transition-all duration-300">
                      <Calendar className="w-5 h-5" />
                      {language === 'en' ? 'Schedule Consultation' : 'Programar Consulta'}
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
                    <WellnessIcon size="md" color="purple">
                      <Shield />
                    </WellnessIcon>
                    <div>
                      <h3 className="text-xl font-body font-bold text-green-800">
                        {language === 'en' ? 'PTSD Facts' : 'Datos sobre TEPT'}
                      </h3>
                      <p className="text-gray-600 font-body">
                        {language === 'en' ? 'Understanding trauma recovery' : 'Entendiendo la recuperación del trauma'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700 font-body">
                        {language === 'en' ? '3.5% of adults experience PTSD annually' : '3.5% de adultos experimentan TEPT anualmente'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700 font-body">
                        {language === 'en' ? 'Recovery is possible with proper treatment' : 'La recuperación es posible con tratamiento adecuado'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700 font-body">
                        {language === 'en' ? 'Trauma-informed, culturally sensitive care' : 'Atención informada en trauma, culturalmente sensible'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700 font-body">
                        {language === 'en' ? 'Confidential, safe treatment environment' : 'Ambiente de tratamiento confidencial y seguro'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Crisis Support Banner */}
        {language === 'en' && (
          <section className="bg-red-600 text-white py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center gap-4 text-center">
                <Shield className="w-6 h-6" />
                <p className="font-body font-semibold">
                  Crisis Support: Call 988 (Suicide & Crisis Lifeline) | Veterans Crisis Line: 1-800-273-8255
                </p>
              </div>
            </div>
          </section>
        )}

        {language === 'es' && (
          <section className="bg-red-600 text-white py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center gap-4 text-center">
                <Shield className="w-6 h-6" />
                <p className="font-body font-semibold">
                  Apoyo en Crisis: Llame al 988 | Línea de Crisis para Veteranos: 1-800-273-8255
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Trauma Types Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {language === 'en' ? (
                  <>We Treat <span className="font-display italic text-green-700">All Types</span> of Trauma</>
                ) : (
                  <>Tratamos <span className="font-display italic text-green-700">Todos los Tipos</span> de Trauma</>
                )}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'PTSD can develop from many different traumatic experiences. Our approach is tailored to your specific trauma history and cultural background.'
                  : 'El TEPT puede desarrollarse a partir de muchas experiencias traumáticas diferentes. Nuestro enfoque está adaptado a su historia específica de trauma y trasfondo cultural.'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {traumaTypes.map((type, index) => (
                <Card key={index} className="border-purple-100 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg font-body font-bold text-green-800 flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-bold text-sm">{index + 1}</span>
                      </div>
                      {type.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 font-body leading-relaxed">{type.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Symptoms Section */}
        <section className="py-16 sm:py-20 bg-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {language === 'en' ? (
                  <>Recognizing <span className="font-display italic text-green-700">PTSD</span> Symptoms</>
                ) : (
                  <>Reconociendo Síntomas del <span className="font-display italic text-green-700">TEPT</span></>
                )}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'PTSD symptoms can appear immediately after trauma or may emerge months or years later. Professional help can provide significant relief.'
                  : 'Los síntomas del TEPT pueden aparecer inmediatamente después del trauma o pueden surgir meses o años después. La ayuda profesional puede proporcionar alivio significativo.'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {symptoms.map((symptom, index) => (
                <Card key={index} className="bg-white border-purple-100 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 font-bold text-sm">{index + 1}</span>
                      </div>
                      <span className="text-gray-700 font-body">{symptom}</span>
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
                  <>Our <span className="font-display italic text-green-700">Trauma-Informed</span> Treatment Approach</>
                ) : (
                  <>Nuestro Enfoque de Tratamiento <span className="font-display italic text-green-700">Informado en Trauma</span></>
                )}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'Dr. Melva Reve uses trauma-informed principles combined with evidence-based treatments to create a safe, supportive environment for healing.'
                  : 'La Dra. Melva Reve utiliza principios informados en trauma combinados con tratamientos basados en evidencia para crear un ambiente seguro y de apoyo para la sanación.'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {treatments.map((treatment, index) => (
                <Card key={index} className="border-indigo-100 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-600 font-bold text-lg">{index + 1}</span>
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
        <section className="py-16 sm:py-20 bg-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                  {language === 'en' ? (
                    <>Specialized PTSD Care in <span className="font-display italic text-green-700">Naples</span></>
                  ) : (
                    <>Atención Especializada de TEPT en <span className="font-display italic text-green-700">Naples</span></>
                  )}
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <WellnessIcon size="sm" color="purple">
                      <IconShield />
                    </WellnessIcon>
                    <div>
                      <h3 className="text-xl font-body font-bold text-green-800 mb-2">
                        {language === 'en' ? 'Trauma-Informed Expertise' : 'Experiencia Informada en Trauma'}
                      </h3>
                      <p className="text-gray-600 font-body leading-relaxed">
                        {language === 'en'
                          ? 'Dr. Melva Reve has specialized training in trauma treatment and understands the complex nature of PTSD recovery.'
                          : 'La Dra. Melva Reve tiene entrenamiento especializado en tratamiento de trauma y entiende la naturaleza compleja de la recuperación del TEPT.'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <WellnessIcon size="sm" color="purple">
                      <IconBrain />
                    </WellnessIcon>
                    <div>
                      <h3 className="text-xl font-body font-bold text-green-800 mb-2">
                        {language === 'en' ? 'Safe, Supportive Environment' : 'Ambiente Seguro y de Apoyo'}
                      </h3>
                      <p className="text-gray-600 font-body leading-relaxed">
                        {language === 'en'
                          ? 'Our practice provides a confidential, judgment-free space where you can process trauma at your own pace.'
                          : 'Nuestra práctica brinda un espacio confidencial, libre de juicio donde puede procesar el trauma a su propio ritmo.'
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
                        {language === 'en' ? 'Culturally Sensitive Care' : 'Atención Culturalmente Sensible'}
                      </h3>
                      <p className="text-gray-600 font-body leading-relaxed">
                        {language === 'en'
                          ? 'We understand how cultural factors impact trauma and recovery, providing care that honors your background and values.'
                          : 'Entendemos cómo los factores culturales impactan el trauma y la recuperación, brindando atención que honra su trasfondo y valores.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Card className="bg-green-800 text-white border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-body font-bold text-white">
                    {language === 'en' ? 'Begin Your Healing Journey' : 'Comience Su Jornada de Sanación'}
                  </CardTitle>
                  <CardDescription className="text-green-200 font-body">
                    {language === 'en' 
                      ? 'Take the courageous step toward recovery today'
                      : 'Dé el paso valiente hacia la recuperación hoy'
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
                        {language === 'en' ? 'Confidential Trauma Assessments' : 'Evaluaciones Confidenciales de Trauma'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-300" />
                      <span className="font-body">
                        {language === 'en' ? 'Military & Veteran Friendly' : 'Amigable para Militares y Veteranos'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-300" />
                      <span className="font-body">
                        {language === 'en' ? 'Bilingual Trauma-Informed Care' : 'Atención Bilingüe Informada en Trauma'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <Link href="/contact">
                      <Button size="lg" variant="secondary" className="bg-white text-green-800 hover:bg-green-50 font-semibold py-6 px-8 rounded-full w-full inline-flex items-center justify-center gap-3">
                        <Calendar className="w-5 h-5" />
                        {language === 'en' ? 'Schedule Trauma Assessment' : 'Programar Evaluación de Trauma'}
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

export default PtsdTreatment;