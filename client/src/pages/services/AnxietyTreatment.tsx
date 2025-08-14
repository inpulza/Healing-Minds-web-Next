import { useEffect } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ServiceHeroMasonry } from '@/components/ServiceHeroMasonry';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updateSEO } from '@/utils/seo';
import { ArrowRight, CheckCircle, Phone, Calendar, MapPin, Clock } from 'lucide-react';
import { IconBrain, IconHeart, IconMoodHappy } from '@tabler/icons-react';
import WellnessIcon from '@/components/WellnessIcon';

// Import generated images
import doctorImage from "@assets/generated_images/Professional_psychiatrist_office_photo_e259ed9b.png";
import anxietyImage from "@assets/generated_images/Anxiety_representation_efc2b954.png";
import therapyRoomImage from "@assets/generated_images/Wellness_meditation_space_ae6f4d77.png";

const AnxietyTreatment = () => {
  const { language } = useLanguage();

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
  }, [language]);

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
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <WellnessIcon size="sm" color="green">
                    <IconBrain />
                  </WellnessIcon>
                  <span className="text-green-700 font-body font-semibold text-lg">
                    {language === 'en' ? 'Expert Anxiety Care' : 'Atención Experta para la Ansiedad'}
                  </span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-body font-bold text-green-800 mb-6">
                  {language === 'en' ? (
                    <>Anxiety Treatment in <span className="font-display italic text-green-700">Naples, FL</span></>
                  ) : (
                    <>Tratamiento para la Ansiedad en <span className="font-display italic text-green-700">Naples, FL</span></>
                  )}
                </h1>
                
                <p className="text-lg sm:text-xl text-gray-600 mb-8 font-body leading-relaxed">
                  {language === 'en'
                    ? 'Find relief from anxiety with compassionate, evidence-based psychiatric care. Dr. Melva Reve specializes in treating panic attacks, social anxiety, and generalized anxiety disorder with personalized treatment plans.'
                    : 'Encuentre alivio de la ansiedad con atención psiquiátrica compasiva basada en evidencia. La Dra. Melva Reve se especializa en tratar ataques de pánico, ansiedad social y trastorno de ansiedad generalizada con planes de tratamiento personalizados.'
                  }
                </p>

                {language === 'es' && (
                  <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-8">
                    <p className="text-green-800 font-body">
                      <strong>Comprenda que buscar ayuda es valentía, no debilidad.</strong> La salud mental es salud. 
                      Nuestra clínica ofrece un espacio seguro y culturalmente competente para la comunidad hispana.
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
                    <WellnessIcon size="md" color="blue">
                      <IconHeart />
                    </WellnessIcon>
                    <div>
                      <h3 className="text-xl font-body font-bold text-green-800">
                        {language === 'en' ? 'Quick Facts' : 'Datos Importantes'}
                      </h3>
                      <p className="text-gray-600 font-body">
                        {language === 'en' ? 'About anxiety treatment' : 'Sobre el tratamiento de ansiedad'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700 font-body">
                        {language === 'en' ? '19.1% of adults experience anxiety disorders' : '19.1% de adultos experimentan trastornos de ansiedad'}
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
                        {language === 'en' ? 'Insurance coverage available' : 'Cobertura de seguro disponible'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700 font-body">
                        {language === 'en' ? 'Bilingual care in Spanish/English' : 'Atención bilingüe en español/inglés'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Symptoms Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {language === 'en' ? (
                  <>Recognizing <span className="font-display italic text-green-700">Anxiety</span> Symptoms</>
                ) : (
                  <>Reconociendo Síntomas de <span className="font-display italic text-green-700">Ansiedad</span></>
                )}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'Anxiety affects everyone differently. If you\'re experiencing any of these symptoms persistently, professional help can provide significant relief.'
                  : 'La ansiedad afecta a cada persona de manera diferente. Si está experimentando cualquiera de estos síntomas persistentemente, la ayuda profesional puede proporcionar alivio significativo.'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {symptoms.map((symptom, index) => (
                <Card key={index} className="border-green-100 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700 font-body text-lg">{symptom}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Treatment Approach Section */}
        <section className="py-16 sm:py-20 bg-green-50">
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
                      <IconBrain />
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
                      <IconMoodHappy />
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
                      <IconHeart />
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
                      <span className="font-body">Naples, FL & Surrounding Areas</span>
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

export default AnxietyTreatment;