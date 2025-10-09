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
import { ArrowRight, CheckCircle, Phone, Calendar, MapPin, Clock, Brain, Heart, Smile } from 'lucide-react';
import WellnessIcon from '@/components/WellnessIcon';

// Import generated images
import doctorImage from "@assets/generated_images/Professional_psychiatrist_office_photo_e259ed9b.webp";
import anxietyImage from "@assets/generated_images/Anxiety_representation_efc2b954.webp";
import therapyRoomImage from "@assets/generated_images/Wellness_meditation_space_ae6f4d77.webp";
import zenStonesImage from "@assets/2b5aedce-1c8b-495c-a402-1c0a19a1633b_1755211366855.webp";

const AnxietyTreatment = () => {
  const { language } = useLanguage();
  const { trackServiceView } = useTikTokEvents();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Anxiety Treatment Naples FL - Expert Psychiatric Care | Dr. Melva Reve'
        : 'Tratamiento para la Ansiedad Naples FL - Atención Psiquiátrica Experta | Dra. Melva Reve',
      description: language === 'en'
        ? 'Expert anxiety treatment in Naples, FL. Dr. Melva Reve offers comprehensive care for panic attacks, social anxiety, generalized anxiety disorder. Bilingual psychiatrist. Insurance accepted.'
        : 'Tratamiento experto para la ansiedad en Naples, FL. La Dra. Melva Reve ofrece atención integral para ataques de pánico, ansiedad social, trastorno de ansiedad generalizada. Psiquiatra bilingüe. Se acepta seguro.',
      keywords: language === 'en'
        ? 'anxiety treatment Naples FL, panic attacks Naples, social anxiety Naples, anxiety psychiatrist Naples, generalized anxiety disorder Naples, anxiety medication Naples'
        : 'tratamiento ansiedad Naples FL, ataques de pánico Naples, ansiedad social Naples, psiquiatra ansiedad Naples, trastorno ansiedad generalizada Naples, medicamento ansiedad Naples',
      lang: language,
      canonical: language === 'en' ? '/services/anxiety-treatment' : '/es/servicios/tratamiento-ansiedad'
    };
    updateSEO(seoData);
    
    // Add Service Schema (SPOKE) - connects to MedicalClinic HUB
    addServiceSchema({
      serviceType: "Anxiety Treatment",
      name: language === 'en' 
        ? "Tratamiento de Ansiedad en Naples, FL"
        : "Anxiety Treatment in Naples, FL",
      description: language === 'en'
        ? "Expert psychiatric care for anxiety disorders including panic attacks, social anxiety, and generalized anxiety disorder with evidence-based treatments."
        : "Atención psiquiátrica experta para trastornos de ansiedad incluyendo ataques de pánico, ansiedad social y trastorno de ansiedad generalizada con tratamientos basados en evidencia.",
      pageId: "anxiety"
    });

    // Track TikTok ViewContent event
    trackServiceView('Anxiety Treatment', 'anxiety');
  }, [language, trackServiceView]);

  const symptoms = language === 'en' ? [
    'Persistent worry or fear',
    'Panic attacks or racing heart',
    'Difficulty sleeping or concentrating',
    'Avoiding social situations',
    'Physical symptoms like trembling',
    'Feeling constantly on edge'
  ] : [
    'Preocupación o miedo persistente',
    'Ataques de pánico o palpitaciones',
    'Dificultad para dormir o concentrarse',
    'Evitar situaciones sociales',
    'Síntomas físicos como temblores',
    'Sentirse constantemente nervioso'
  ];

  const treatments = language === 'en' ? [
    'Comprehensive psychiatric evaluation',
    'Personalized medication management',
    'Evidence-based therapy approaches',
    'Stress management techniques',
    'Lifestyle and wellness counseling',
    'Ongoing support and monitoring'
  ] : [
    'Evaluación psiquiátrica integral',
    'Manejo personalizado de medicamentos',
    'Enfoques terapéuticos basados en evidencia',
    'Técnicas de manejo del estrés',
    'Consejería de estilo de vida y bienestar',
    'Apoyo y monitoreo continuo'
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section with Masonry Layout */}
        <ServiceHeroMasonry
          tagline={{
            en: 'Expert Anxiety Care',
            es: 'Atención Experta para la Ansiedad'
          }}
          title={{
            en: 'Anxiety Treatment in Naples, FL',
            es: 'Tratamiento para la Ansiedad en Naples, FL'
          }}
          description={{
            en: 'Find relief from anxiety with compassionate, evidence-based psychiatric care. Dr. Melva Reve specializes in treating panic attacks, social anxiety, and generalized anxiety disorder with personalized treatment plans.',
            es: 'Encuentre alivio de la ansiedad con atención psiquiátrica compasiva basada en evidencia. La Dra. Melva Reve se especializa en tratar ataques de pánico, ansiedad social y trastorno de ansiedad generalizada con planes de tratamiento personalizados.'
          }}
          specialNote={{
            es: '<strong>Comprenda que buscar ayuda es valentía, no debilidad.</strong> La salud mental es salud. Nuestra clínica ofrece un espacio seguro y culturalmente competente para la comunidad hispana.'
          }}
          facts={{
            title: {
              en: 'Anxiety Facts',
              es: 'Datos sobre Ansiedad'
            },
            items: [
              {
                en: '19.1% of adults experience anxiety disorders',
                es: '19.1% de adultos experimentan trastornos de ansiedad'
              },
              {
                en: 'Highly treatable with proper care',
                es: 'Altamente tratable con atención adecuada'
              },
              {
                en: 'Insurance coverage available',
                es: 'Cobertura de seguro disponible'
              },
              {
                en: 'Bilingual care in Spanish/English',
                es: 'Atención bilingüe en español/inglés'
              }
            ]
          }}
          quickStats={{
            items: [
              {
                en: 'Same-week appointments',
                es: 'Citas la misma semana'
              },
              {
                en: 'Insurance accepted',
                es: 'Se acepta seguro'
              },
              {
                en: 'Bilingual services',
                es: 'Servicios bilingües'
              },
              {
                en: 'Evidence-based treatment',
                es: 'Tratamiento basado en evidencia'
              }
            ]
          }}
          images={{
            doctorImage,
            therapyRoomImage: anxietyImage,
            symbolImage: therapyRoomImage
          }}
        />

        {/* Modern Symptoms Section */}
        <section className="py-16 sm:py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 shadow-lg border border-green-100">
              <div className="grid md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
                {/* Content Side */}
                <div className="order-2 md:order-1">
                  <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    {language === 'en' ? 'Symptom Recognition' : 'Reconocimiento de Síntomas'}
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                    {language === 'en' ? (
                      <>Recognizing <span className="font-display italic text-green-700">Anxiety</span> Symptoms</>
                    ) : (
                      <>Reconociendo Síntomas de <span className="font-display italic text-green-700">Ansiedad</span></>
                    )}
                  </h2>
                  
                  {/* Key Stats */}
                  <div className="mb-6 sm:mb-8">
                    <div className="text-3xl sm:text-4xl font-bold mb-2 text-green-600">40M+</div>
                    <div className="text-gray-600 font-body text-sm sm:text-base">
                      {language === 'en' ? 'Adults affected by anxiety disorders annually' : 'Adultos afectados por trastornos de ansiedad anualmente'}
                    </div>
                  </div>

                  <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 font-body leading-relaxed">
                    {language === 'en'
                      ? 'Anxiety affects everyone differently. If you\'re experiencing any of these symptoms persistently, professional help can provide significant relief.'
                      : 'La ansiedad afecta a cada persona de manera diferente. Si está experimentando cualquiera de estos síntomas persistentemente, la ayuda profesional puede proporcionar alivio significativo.'
                    }
                  </p>

                  <Link href="/contact">
                    <Button className="group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full text-sm sm:text-lg font-semibold transition-all duration-300 bg-green-700 text-white hover:bg-green-800 px-4 sm:px-6 sm:px-8 py-4 sm:py-6 sm:py-7">
                      <span>{language === 'en' ? 'Schedule Assessment' : 'Programar Evaluación'}</span>
                      <div className="w-8 h-8 sm:w-9 sm:h-9 min-w-[2rem] min-h-[2rem] sm:min-w-[2.25rem] sm:min-h-[2.25rem] rounded-full flex items-center justify-center transition-all duration-300 bg-green-600 flex-shrink-0">
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                    </Button>
                  </Link>
                </div>

                {/* Symptoms Grid Side */}
                <div className="order-1 md:order-2 flex flex-col h-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {symptoms.slice(0, 6).map((symptom, index) => (
                      <div key={index} className="p-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700 font-body text-sm">{symptom}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Photo - Fills remaining space */}
                  <div className="flex-1">
                    <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-green-50 to-green-100 min-h-[10rem]">
                      <img 
                        src={zenStonesImage} 
                        alt="Zen stones stacked on green background representing meditation and relaxation for anxiety treatment"
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                  
                  {/* Additional symptoms if any */}
                  {symptoms.length > 6 && (
                    <div className="mt-4 text-center">
                      <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-green-50 rounded-full px-4 py-2 border border-green-200">
                        <span>{language === 'en' ? '+' : '+'}{symptoms.length - 6} {language === 'en' ? 'more symptoms treated' : 'síntomas más tratados'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Treatment Approach Section */}
        <section className="py-16 sm:py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
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
                  ? 'Dr. Melva Reve combines evidence-based psychiatric treatment with compassionate care, tailored to your unique needs and cultural background.'
                  : 'La Dra. Melva Reve combina tratamiento psiquiátrico basado en evidencia con atención compasiva, adaptado a sus necesidades únicas y trasfondo cultural.'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {treatments.map((treatment, index) => (
                <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-800 font-bold text-lg">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-body font-bold text-green-800 mb-2">{treatment}</h3>
                        <p className="text-gray-600 font-body leading-relaxed">
                          {language === 'en' 
                            ? 'Personalized care designed to address your specific anxiety symptoms and improve your quality of life.'
                            : 'Atención personalizada diseñada para abordar sus síntomas específicos de ansiedad y mejorar su calidad de vida.'
                          }
                        </p>
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                  {language === 'en' ? (
                    <>Why Choose Dr. Melva <span className="font-display italic text-green-700">Reve</span>?</>
                  ) : (
                    <>¿Por Qué Elegir a la Dra. Melva <span className="font-display italic text-green-700">Reve</span>?</>
                  )}
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <WellnessIcon size="sm" color="green">
                      <Brain />
                    </WellnessIcon>
                    <div>
                      <h3 className="text-xl font-body font-bold text-green-800 mb-2">
                        {language === 'en' ? 'Board-Certified Expertise' : 'Experiencia Certificada'}
                      </h3>
                      <p className="text-gray-600 font-body leading-relaxed">
                        {language === 'en'
                          ? 'Over 15 years of specialized experience in treating anxiety disorders with evidence-based approaches.'
                          : 'Más de 15 años de experiencia especializada en el tratamiento de trastornos de ansiedad con enfoques basados en evidencia.'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <WellnessIcon size="sm" color="blue">
                      <Smile />
                    </WellnessIcon>
                    <div>
                      <h3 className="text-xl font-body font-bold text-green-800 mb-2">
                        {language === 'en' ? 'Culturally Competent Care' : 'Atención Culturalmente Competente'}
                      </h3>
                      <p className="text-gray-600 font-body leading-relaxed">
                        {language === 'en'
                          ? 'Bilingual services with deep understanding of cultural factors affecting mental health in the Hispanic community.'
                          : 'Servicios bilingües con profundo entendimiento de factores culturales que afectan la salud mental en la comunidad hispana.'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <WellnessIcon size="sm" color="green">
                      <Heart />
                    </WellnessIcon>
                    <div>
                      <h3 className="text-xl font-body font-bold text-green-800 mb-2">
                        {language === 'en' ? 'Personalized Treatment Plans' : 'Planes de Tratamiento Personalizados'}
                      </h3>
                      <p className="text-gray-600 font-body leading-relaxed">
                        {language === 'en'
                          ? 'Every treatment plan is carefully tailored to your unique symptoms, lifestyle, and goals.'
                          : 'Cada plan de tratamiento está cuidadosamente adaptado a sus síntomas únicos, estilo de vida y metas.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Card className="bg-green-800 text-white border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-body font-bold text-white">
                    {language === 'en' ? 'Practice Information' : 'Información de la Práctica'}
                  </CardTitle>
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
                        {language === 'en' ? 'Flexible Scheduling Available' : 'Horarios Flexibles Disponibles'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-300" />
                      <span className="font-body">
                        {language === 'en' ? 'Most Insurance Plans Accepted' : 'Se Aceptan Mayoría de Seguros'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-300" />
                      <span className="font-body">
                        {language === 'en' ? 'Telehealth Options Available' : 'Opciones de Telesalud Disponibles'}
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

export default AnxietyTreatment;