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
import { ArrowRight, CheckCircle, Phone, Calendar, MapPin, Clock, Shield, Brain } from 'lucide-react';
import WellnessIcon from '@/components/WellnessIcon';
import RichText from '@/components/RichText';
import { ptsdTreatmentContent } from '@/data/pageContent/services/ptsdTreatment';

// Import generated images
import doctorImage from "@assets/generated_images/Professional_psychiatrist_office_photo_e259ed9b.webp";
import ptsdImage from "@assets/generated_images/Hope_and_growth_symbolism_978bb907.webp";
import therapyRoomImage from "@assets/generated_images/Therapy_room_interior_4b5878fd.webp";
// Import trauma type images
import militaryImage from "@assets/f91b2e9a-8ab0-4719-b4c9-15edc522f27f_1755211669104.webp";
import childhoodImage from "@assets/e8202da4-08bf-45d6-b0b6-392795b53874_1755211669105.webp";
import vehicleImage from "@assets/f01c7d7e-f4d9-4a02-b3e0-d02f5f47a354_1755211669105.webp";
import naturalDisasterImage from "@assets/f9744cdb-4b98-4681-9f74-b6f4692a2ced (1)_1755211836264.webp";
import assaultImage from "@assets/6180c64d-fa53-4c88-8339-6aa0b06bdc93_1755211836265.webp";
import medicalImage from "@assets/4142165d-97e6-4e50-8313-f705c8e6e93f_1755212013126.webp";
import consultationImage from "@assets/d7b136b4-35bd-482a-b24a-98a1c5bb1abf_1755212133166.webp";

const markdownToHtml = (text: string) =>
  text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

const renderHeading = (text: string) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <span key={i} className="font-display italic text-green-700">{part.slice(2, -2)}</span>
    ) : (
      part
    ),
  );

const PtsdTreatment = () => {
  const { language } = useLanguage();
  const { trackServiceView } = useTikTokEvents();
  const enS = (key: string) => ptsdTreatmentContent.en.sections.find((x) => x.key === key)!;
  const esS = (key: string) => ptsdTreatmentContent.es.sections.find((x) => x.key === key)!;
  const s = (key: string) => ptsdTreatmentContent[language].sections.find((x) => x.key === key)!;
  const bilingualItems = (key: string) => {
    const en = enS(key).bullets!;
    const es = esS(key).bullets!;
    return en.map((e, i) => ({ en: e, es: es[i] }));
  };

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

    // Track TikTok ViewContent event
    trackServiceView('PTSD Treatment', 'ptsd');
  }, [language, trackServiceView]);

  const symptoms = s('symptoms-list').bullets!;

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section with Masonry Layout */}
        <ServiceHeroMasonry
          tagline={{
            en: enS('hero-tagline').paragraphs![0],
            es: esS('hero-tagline').paragraphs![0]
          }}
          title={{
            en: ptsdTreatmentContent.en.title,
            es: ptsdTreatmentContent.es.title
          }}
          description={{
            en: enS('hero-description').paragraphs![0],
            es: esS('hero-description').paragraphs![0]
          }}
          specialNote={{
            es: markdownToHtml(esS('hero-special-note').paragraphs![0])
          }}
          facts={{
            title: {
              en: enS('hero-facts').heading!,
              es: esS('hero-facts').heading!
            },
            items: bilingualItems('hero-facts')
          }}
          quickStats={{
            items: bilingualItems('hero-quick-stats')
          }}
          images={{
            doctorImage,
            therapyRoomImage: ptsdImage,
            symbolImage: therapyRoomImage
          }}
        />

        {/* Modern Treatment Approach Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-green-50 rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 shadow-lg border border-green-100">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Content Side */}
                <div className="lg:col-span-2">
                  <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    {s('approach-badge').paragraphs![0]}
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                    {renderHeading(s('approach').heading!)}
                  </h2>
                  
                  <p className="text-lg sm:text-xl text-gray-600 mb-8 font-body leading-relaxed">
                    {s('approach-intro').paragraphs![0]}
                  </p>

                  {/* Treatment List */}
                  <div className="grid gap-4 mb-8">
                    {s('approach-list').bullets!.map((title, index) => (
                      <div key={index} className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-green-600 font-bold text-sm">{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-body font-bold text-green-800 mb-1">{title}</h3>
                            <p className="text-gray-600 font-body text-sm leading-relaxed">{s('approach-list-descriptions').bullets![index]}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link href={language === 'en' ? '/contact' : '/es/contacto'}>
                    <Button className="group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full text-sm sm:text-lg font-semibold transition-all duration-300 bg-green-700 text-white hover:bg-green-800 px-4 sm:px-6 sm:px-8 py-4 sm:py-6 sm:py-7">
                      <span>{s('approach-cta').paragraphs![0]}</span>
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
                    <div className="bg-white rounded-xl p-6 border border-green-200 shadow-sm">
                      <div className="text-3xl font-bold text-green-600 mb-2">{s('approach-stat-1').paragraphs![0]}</div>
                      <div className="text-sm text-gray-600 font-body">
                        {s('approach-stat-1').paragraphs![1]}
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-green-200 shadow-sm">
                      <div className="text-3xl font-bold text-green-600 mb-2">{s('approach-stat-2').paragraphs![0]}</div>
                      <div className="text-sm text-gray-600 font-body">
                        {s('approach-stat-2').paragraphs![1]}
                      </div>
                    </div>
                  </div>

                  {/* Photo - Fills remaining space */}
                  <div className="flex-1 w-full rounded-xl overflow-hidden bg-gradient-to-br from-green-50 to-green-100">
                    <img 
                      src={consultationImage} 
                      alt="Professional psychiatrist Dr. Melva Reve conducting PTSD consultation in modern medical office"
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                      decoding="async"
                      style={{ objectPosition: 'center center' }}
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
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {renderHeading(s('symptoms').heading!)}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                {s('symptoms-intro').paragraphs![0]}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {symptoms.map((symptom, index) => (
                <Card key={index} className="border-green-100 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700 font-body">{symptom}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Modern Trauma Types Section */}
        <section className="py-16 sm:py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 shadow-lg border border-green-100">
              <div className="text-center mb-12">
                <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  {s('trauma-badge').paragraphs![0]}
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                  {renderHeading(s('trauma').heading!)}
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                  {s('trauma-intro').paragraphs![0]}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(language === 'en' ? [
                  {
                    image: militaryImage,
                    alt: 'Military uniform with dog tags representing combat trauma and PTSD treatment'
                  },
                  {
                    image: childhoodImage,
                    alt: 'Teddy bear representing childhood trauma and therapeutic healing'
                  },
                  {
                    image: vehicleImage,
                    alt: 'Car steering wheel representing motor vehicle accident trauma treatment'
                  },
                  {
                    image: assaultImage,
                    alt: 'Soft pink fabric representing sensitivity and support for sexual assault survivors'
                  },
                  {
                    image: naturalDisasterImage,
                    alt: 'Glass jar with seashell and sand representing recovery and resilience after natural disasters'
                  },
                  {
                    image: medicalImage,
                    alt: 'White hospital bracelet representing medical trauma and healthcare-related PTSD treatment'
                  }
                ] : [
                  {
                    image: militaryImage,
                    alt: 'Uniforme militar con placas de identificación representando trauma de combate y tratamiento TEPT'
                  },
                  {
                    image: childhoodImage,
                    alt: 'Osito de peluche representando trauma infantil y sanación terapéutica'
                  },
                  {
                    image: vehicleImage,
                    alt: 'Volante de automóvil representando tratamiento de trauma por accidente vehicular'
                  },
                  {
                    image: assaultImage,
                    alt: 'Tela suave rosa representando sensibilidad y apoyo para sobrevivientes de agresión sexual'
                  },
                  {
                    image: naturalDisasterImage,
                    alt: 'Frasco de vidrio con concha marina y arena representando recuperación y resistencia después de desastres naturales'
                  },
                  {
                    image: medicalImage,
                    alt: 'Pulsera hospitalaria blanca representando trauma médico y tratamiento de TEPT relacionado con atención médica'
                  }
                ]).map((trauma, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300">
                    {/* Photo - Top */}
                    <div className="h-48 bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
                      {trauma.image ? (
                        <img 
                          src={trauma.image} 
                          alt={trauma.alt}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <span className="text-green-600 font-bold">🛡️</span>
                            </div>
                            <p className="text-green-600 font-body text-sm">Specialized Care</p>
                            <p className="text-green-500 font-body text-xs">Professional Treatment</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Content - Bottom */}
                    <div className="p-6">
                      <h3 className="text-lg font-body font-bold text-green-800 mb-3">{s('trauma-titles').bullets![index]}</h3>
                      <p className="text-gray-600 font-body text-sm leading-relaxed">{s('trauma-descriptions').bullets![index]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-16 sm:py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {renderHeading(s('why').heading!)}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="space-y-6">
                  {s('why-benefits').bullets!.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700 font-body text-lg">
                        <RichText text={benefit} linkClassName="text-green-700 hover:text-green-800 underline" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-center lg:text-left">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <WellnessIcon size="lg" color="green" className="mx-auto lg:mx-0 mb-6">
                    <Brain />
                  </WellnessIcon>
                  <h3 className="text-2xl font-body font-bold text-green-800 mb-4">
                    {s('why-card').heading!}
                  </h3>
                  <p className="text-gray-600 font-body leading-relaxed mb-6">
                    {s('why-card').paragraphs![0]}
                  </p>
                  <div className="space-y-4">
                    <Link href={language === 'en' ? '/contact' : '/es/contacto'}>
                      <Button 
                        size="lg" 
                        className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-6 px-8 rounded-full inline-flex items-center justify-center gap-3 transition-all duration-300"
                        data-testid="button-schedule-consultation"
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-green-500">
                          <Calendar className="w-4 h-4 text-white" />
                        </div>
                        {s('why-schedule').paragraphs![0]}
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
                      <a href="tel:+12394230272" className="flex items-center gap-3">
                        {s('why-call').paragraphs![0]}
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
