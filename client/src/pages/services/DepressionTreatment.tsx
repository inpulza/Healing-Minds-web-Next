import { useEffect } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { useTikTokEvents } from '@/hooks/useTikTokEvents';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ServiceHeroMasonry } from '@/components/ServiceHeroMasonry';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updateSEO } from '@/utils/seo';
import { ArrowRight, CheckCircle, Phone, Calendar, MapPin, Clock, Heart, Brain, Smile, Sun } from 'lucide-react';
import WellnessIcon from '@/components/WellnessIcon';

// Import generated images
import doctorImage from "@assets/generated_images/Professional_psychiatrist_office_photo_e259ed9b.webp";
import therapyRoomImage from "@assets/generated_images/Therapy_room_interior_4b5878fd.webp";
import hopeSymbolImage from "@assets/generated_images/Hope_and_growth_symbolism_978bb907.webp";
import consultationImage from "../../assets/consultation-image.webp";

const DepressionTreatment = () => {
  const { language } = useLanguage();
  const { trackServiceView } = useTikTokEvents();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Depression Treatment Naples FL - Expert Psychiatrist | Dr. Melva Reve'
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

    // Track TikTok ViewContent event
    trackServiceView('Depression Treatment', 'depression');
  }, [language, trackServiceView]);

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

  // Data for the ServiceHeroMasonry component
  const heroData = {
    tagline: {
      en: 'Hope & Healing',
      es: 'Esperanza y Sanación'
    },
    title: {
      en: 'Depression Treatment in Naples, FL',
      es: 'Tratamiento para la Depresión en Naples, FL'
    },
    description: {
      en: 'Find hope and healing with expert depression treatment. Dr. Melva Reve provides compassionate, evidence-based psychiatric care to help you reclaim your life and rediscover joy.',
      es: 'Encuentre esperanza y sanación con tratamiento experto para la depresión. La Dra. Melva Reve brinda atención psiquiátrica compasiva basada en evidencia para ayudarle a reclamar su vida y redescubrir la alegría.'
    },
    facts: {
      title: {
        en: 'Depression Facts',
        es: 'Datos sobre Depresión'
      },
      items: [
        {
          en: '8.3% of adults experience major depression',
          es: '8.3% de adultos experimentan depresión mayor'
        },
        {
          en: 'Depression is highly treatable',
          es: 'La depresión es altamente tratable'
        },
        {
          en: 'Recovery is possible with proper care',
          es: 'La recuperación es posible con atención adecuada'
        },
        {
          en: 'Available in Spanish and English',
          es: 'Disponible en español e inglés'
        }
      ]
    },
    images: {
      doctorImage,
      therapyRoomImage,
      symbolImage: hopeSymbolImage
    },
    specialNote: {
      es: '<strong>La depresión no es una falla personal.</strong> Es una condición médica tratable. Ofrecemos un ambiente seguro y sin juicio donde puede encontrar el apoyo que necesita para sanar.'
    },
    quickStats: {
      items: [
        {
          en: 'Same-week appointments',
          es: 'Citas en la misma semana'
        },
        {
          en: 'Insurance accepted',
          es: 'Se acepta seguro'
        },
        {
          en: 'Bilingual services',
          es: 'Servicios bilingües'
        }
      ]
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section with Masonry Design */}
        <ServiceHeroMasonry {...heroData} />

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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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

        {/* Modern Treatment Approach Section */}
        <section className="py-16 sm:py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 shadow-lg border border-green-100">
              <div className="grid md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-end">
                {/* Content Side */}
                <div>
                  <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    {language === 'en' ? 'Evidence-Based Care' : 'Atención Basada en Evidencia'}
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                    {language === 'en' ? (
                      <>Our <span className="font-display italic text-green-700">Evidence-Based</span> Treatment Approach</>
                    ) : (
                      <>Nuestro Enfoque de Tratamiento <span className="font-display italic text-green-700">Basado en Evidencia</span></>
                    )}
                  </h2>
                  
                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                      <div className="text-3xl font-bold text-blue-600 mb-2">80%</div>
                      <div className="text-sm text-gray-600 font-body">
                        {language === 'en' ? 'Treatment success rate' : 'Tasa de éxito del tratamiento'}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                      <div className="text-3xl font-bold text-green-600 mb-2">15+</div>
                      <div className="text-sm text-gray-600 font-body">
                        {language === 'en' ? 'Years experience' : 'Años de experiencia'}
                      </div>
                    </div>
                  </div>

                  <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 font-body leading-relaxed">
                    {language === 'en'
                      ? 'Dr. Melva Reve uses proven treatment methods combined with cultural sensitivity to provide comprehensive depression care.'
                      : 'La Dra. Melva Reve utiliza métodos de tratamiento comprobados combinados con sensibilidad cultural para brindar atención integral para la depresión.'
                    }
                  </p>

                  <Link href="/contact">
                    <Button className="group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full text-sm sm:text-lg font-semibold transition-all duration-300 bg-green-700 text-white hover:bg-green-800 px-4 sm:px-6 sm:px-8 py-4 sm:py-6 sm:py-7">
                      <span>{language === 'en' ? 'Start Treatment' : 'Iniciar Tratamiento'}</span>
                      <div className="w-8 h-8 sm:w-9 sm:h-9 min-w-[2rem] min-h-[2rem] sm:min-w-[2.25rem] sm:min-h-[2.25rem] rounded-full flex items-center justify-center transition-all duration-300 bg-green-600 flex-shrink-0">
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                    </Button>
                  </Link>

                  {/* Professional Consultation Photo */}
                  <div className="mt-8">
                    <div className="w-full aspect-[16/9] overflow-hidden rounded-xl shadow-md">
                      <img 
                        src={consultationImage}
                        alt="Professional consultation - Dr. Melva Reve writing notes during patient consultation"
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                </div>

                {/* Treatment Options Grid Side */}
                <div className="space-y-4">
                  {treatments.map((treatment, index) => (
                    <div key={index} className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-body font-bold text-green-800 mb-2">{treatment.title}</h3>
                          <p className="text-gray-600 font-body text-sm leading-relaxed">{treatment.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Practice Information Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
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
                      <Brain />
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
                      <Smile />
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
                      <Sun />
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
                      <Link href="/locations/psychiatrist-naples" className="font-body hover:text-green-100 transition-colors underline">
                        {language === 'en' ? 'Visit Our Naples, FL Location' : 'Visite Nuestra Ubicación en Naples, FL'}
                      </Link>
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
                        <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-green-100">
                          <Calendar className="w-4 h-4 text-green-800" />
                        </div>
                        {language === 'en' ? 'Schedule Your Consultation' : 'Programe Su Consulta'}
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