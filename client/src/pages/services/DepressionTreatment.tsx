import { useEffect } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updateSEO } from '@/utils/seo';
import { ArrowRight, CheckCircle, Phone, Calendar, MapPin, Clock, Heart } from 'lucide-react';
import { IconBrain, IconHeart, IconMoodHappy, IconSun } from '@tabler/icons-react';
import WellnessIcon from '@/components/WellnessIcon';

const DepressionTreatment = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Depression Treatment Naples FL - Board-Certified Psychiatrist | Dr. Melva Reve'
        : 'Tratamiento para la Depresión Naples FL - Psiquiatra Certificada | Dra. Melva Reve',
      description: language === 'en'
        ? 'Expert depression treatment in Naples, FL. Dr. Melva Reve provides compassionate psychiatric care for major depression, postpartum depression, seasonal depression. Bilingual services available.'
        : 'Tratamiento experto para la depresión en Naples, FL. La Dra. Melva Reve brinda atención psiquiátrica compasiva para depresión mayor, depresión posparto, depresión estacional. Servicios bilingües disponibles.',
      keywords: language === 'en'
        ? 'depression treatment Naples FL, major depression Naples, postpartum depression Naples, depression psychiatrist Naples, antidepressant medication Naples, seasonal depression Naples'
        : 'tratamiento depresión Naples FL, depresión mayor Naples, depresión posparto Naples, psiquiatra depresión Naples, medicamento antidepresivo Naples, depresión estacional Naples',
      lang: language,
      canonical: language === 'en' ? '/services/depression-treatment' : '/es/servicios/tratamiento-depresion'
    };
    updateSEO(seoData);
  }, [language]);

  const symptoms = language === 'en' ? [
    'Persistent sadness or emptiness',
    'Loss of interest in activities',
    'Significant weight or appetite changes',
    'Sleep disturbances',
    'Fatigue or loss of energy',
    'Feelings of worthlessness or guilt',
    'Difficulty concentrating',
    'Thoughts of death or suicide'
  ] : [
    'Tristeza persistente o vacío',
    'Pérdida de interés en actividades',
    'Cambios significativos de peso o apetito',
    'Trastornos del sueño',
    'Fatiga o pérdida de energía',
    'Sentimientos de inutilidad o culpa',
    'Dificultad para concentrarse',
    'Pensamientos de muerte o suicidio'
  ];

  const treatments = language === 'en' ? [
    {
      title: 'Comprehensive Assessment',
      description: 'Thorough evaluation to understand your unique depression symptoms and contributing factors.'
    },
    {
      title: 'Medication Management',
      description: 'Careful selection and monitoring of antidepressant medications tailored to your needs.'
    },
    {
      title: 'Psychotherapy Integration',
      description: 'Coordination with therapy services for optimal treatment outcomes.'
    },
    {
      title: 'Lifestyle Counseling',
      description: 'Guidance on sleep, exercise, nutrition, and stress management techniques.'
    },
    {
      title: 'Crisis Support',
      description: 'Available support during difficult periods with safety planning when needed.'
    },
    {
      title: 'Long-term Recovery',
      description: 'Ongoing monitoring and adjustment of treatment to maintain wellness.'
    }
  ] : [
    {
      title: 'Evaluación Integral',
      description: 'Evaluación exhaustiva para entender sus síntomas únicos de depresión y factores contribuyentes.'
    },
    {
      title: 'Manejo de Medicamentos',
      description: 'Selección cuidadosa y monitoreo de medicamentos antidepresivos adaptados a sus necesidades.'
    },
    {
      title: 'Integración de Psicoterapia',
      description: 'Coordinación con servicios de terapia para resultados óptimos de tratamiento.'
    },
    {
      title: 'Consejería de Estilo de Vida',
      description: 'Orientación sobre sueño, ejercicio, nutrición y técnicas de manejo del estrés.'
    },
    {
      title: 'Apoyo en Crisis',
      description: 'Apoyo disponible durante períodos difíciles con planificación de seguridad cuando sea necesario.'
    },
    {
      title: 'Recuperación a Largo Plazo',
      description: 'Monitoreo continuo y ajuste del tratamiento para mantener el bienestar.'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <WellnessIcon size="sm" color="blue">
                    <IconSun />
                  </WellnessIcon>
                  <span className="text-blue-700 font-body font-semibold text-lg">
                    {language === 'en' ? 'Hope & Healing' : 'Esperanza y Sanación'}
                  </span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-body font-bold text-green-800 mb-6">
                  {language === 'en' ? (
                    <>Depression Treatment in <span className="font-display italic text-green-700">Naples, FL</span></>
                  ) : (
                    <>Tratamiento para la Depresión en <span className="font-display italic text-green-700">Naples, FL</span></>
                  )}
                </h1>
                
                <p className="text-lg sm:text-xl text-gray-600 mb-8 font-body leading-relaxed">
                  {language === 'en'
                    ? 'Find hope and healing with expert depression treatment. Dr. Melva Reve provides compassionate, evidence-based psychiatric care to help you reclaim your life and rediscover joy.'
                    : 'Encuentre esperanza y sanación con tratamiento experto para la depresión. La Dra. Melva Reve brinda atención psiquiátrica compasiva basada en evidencia para ayudarle a reclamar su vida y redescubrir la alegría.'
                  }
                </p>

                {language === 'es' && (
                  <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-8">
                    <p className="text-blue-800 font-body">
                      <strong>La depresión no es una falla personal.</strong> Es una condición médica tratable. 
                      Ofrecemos un ambiente seguro y sin juicio donde puede encontrar el apoyo que necesita para sanar.
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
                      <IconHeart />
                    </WellnessIcon>
                    <div>
                      <h3 className="text-xl font-body font-bold text-green-800">
                        {language === 'en' ? 'Depression Facts' : 'Datos sobre Depresión'}
                      </h3>
                      <p className="text-gray-600 font-body">
                        {language === 'en' ? 'Understanding depression' : 'Entendiendo la depresión'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700 font-body">
                        {language === 'en' ? '8.3% of adults experience major depression' : '8.3% de adultos experimentan depresión mayor'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700 font-body">
                        {language === 'en' ? 'Depression is highly treatable' : 'La depresión es altamente tratable'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700 font-body">
                        {language === 'en' ? 'Recovery is possible with proper care' : 'La recuperación es posible con atención adecuada'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700 font-body">
                        {language === 'en' ? 'Available in Spanish and English' : 'Disponible en español e inglés'}
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
                <Heart className="w-6 h-6" />
                <p className="font-body font-semibold">
                  If you're having thoughts of suicide, call 988 (Suicide & Crisis Lifeline) or go to your nearest emergency room.
                </p>
              </div>
            </div>
          </section>
        )}

        {language === 'es' && (
          <section className="bg-red-600 text-white py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center gap-4 text-center">
                <Heart className="w-6 h-6" />
                <p className="font-body font-semibold">
                  Si tiene pensamientos suicidas, llame al 988 (Línea Nacional de Prevención del Suicidio) o vaya a la sala de emergencias más cercana.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Symptoms Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {language === 'en' ? (
                  <>Recognizing <span className="font-display italic text-green-700">Depression</span> Symptoms</>
                ) : (
                  <>Reconociendo Síntomas de <span className="font-display italic text-green-700">Depresión</span></>
                )}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'Depression is more than just feeling sad. If you\'ve experienced several of these symptoms for two weeks or more, professional help can make a significant difference.'
                  : 'La depresión es más que simplemente sentirse triste. Si ha experimentado varios de estos síntomas por dos semanas o más, la ayuda profesional puede hacer una diferencia significativa.'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {symptoms.map((symptom, index) => (
                <Card key={index} className="border-blue-100 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
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
        <section className="py-16 sm:py-20 bg-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {language === 'en' ? (
                  <>Our <span className="font-display italic text-green-700">Evidence-Based</span> Treatment Approach</>
                ) : (
                  <>Nuestro Enfoque de Tratamiento <span className="font-display italic text-green-700">Basado en Evidencia</span></>
                )}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'Dr. Melva Reve uses proven treatment methods combined with cultural sensitivity to provide comprehensive depression care.'
                  : 'La Dra. Melva Reve utiliza métodos de tratamiento comprobados combinados con sensibilidad cultural para brindar atención integral para la depresión.'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {treatments.map((treatment, index) => (
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

        {/* Practice Information Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                  {language === 'en' ? (
                    <>Expert Depression Care in <span className="font-display italic text-green-700">Naples</span></>
                  ) : (
                    <>Atención Experta para la Depresión en <span className="font-display italic text-green-700">Naples</span></>
                  )}
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <WellnessIcon size="sm" color="blue">
                      <IconBrain />
                    </WellnessIcon>
                    <div>
                      <h3 className="text-xl font-body font-bold text-green-800 mb-2">
                        {language === 'en' ? 'Specialized Expertise' : 'Experiencia Especializada'}
                      </h3>
                      <p className="text-gray-600 font-body leading-relaxed">
                        {language === 'en'
                          ? 'Dr. Melva Reve specializes in treating various forms of depression including major depression, seasonal affective disorder, and postpartum depression.'
                          : 'La Dra. Melva Reve se especializa en tratar varias formas de depresión incluyendo depresión mayor, trastorno afectivo estacional y depresión posparto.'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <WellnessIcon size="sm" color="purple">
                      <IconMoodHappy />
                    </WellnessIcon>
                    <div>
                      <h3 className="text-xl font-body font-bold text-green-800 mb-2">
                        {language === 'en' ? 'Comprehensive Care' : 'Atención Integral'}
                      </h3>
                      <p className="text-gray-600 font-body leading-relaxed">
                        {language === 'en'
                          ? 'From initial assessment through long-term recovery support, we provide comprehensive care tailored to your unique situation.'
                          : 'Desde la evaluación inicial hasta el apoyo de recuperación a largo plazo, brindamos atención integral adaptada a su situación única.'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <WellnessIcon size="sm" color="green">
                      <IconSun />
                    </WellnessIcon>
                    <div>
                      <h3 className="text-xl font-body font-bold text-green-800 mb-2">
                        {language === 'en' ? 'Hope-Centered Approach' : 'Enfoque Centrado en la Esperanza'}
                      </h3>
                      <p className="text-gray-600 font-body leading-relaxed">
                        {language === 'en'
                          ? 'Our treatment philosophy centers on instilling hope while providing practical tools and strategies for recovery and wellness.'
                          : 'Nuestra filosofía de tratamiento se centra en infundir esperanza mientras brindamos herramientas prácticas y estrategias para la recuperación y el bienestar.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Card className="bg-green-800 text-white border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-body font-bold text-white">
                    {language === 'en' ? 'Start Your Healing Journey' : 'Comience Su Jornada de Sanación'}
                  </CardTitle>
                  <CardDescription className="text-green-200 font-body">
                    {language === 'en' 
                      ? 'Take the first step toward feeling better today'
                      : 'Dé el primer paso hacia sentirse mejor hoy'
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
                        {language === 'en' ? 'Same-Week Appointments Available' : 'Citas en la Misma Semana Disponibles'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-300" />
                      <span className="font-body">
                        {language === 'en' ? 'Insurance Plans Accepted' : 'Se Aceptan Planes de Seguro'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-300" />
                      <span className="font-body">
                        {language === 'en' ? 'Confidential & Safe Environment' : 'Ambiente Confidencial y Seguro'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <Link href="/contact">
                      <Button size="lg" variant="secondary" className="bg-white text-green-800 hover:bg-green-50 font-semibold py-6 px-8 rounded-full w-full inline-flex items-center justify-center gap-3">
                        <Calendar className="w-5 h-5" />
                        {language === 'en' ? 'Schedule Your Consultation' : 'Programe Su Consulta'}
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

export default DepressionTreatment;