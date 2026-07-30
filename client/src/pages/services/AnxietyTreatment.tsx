import { useEffect } from 'react';
import { assetUrl } from '@/lib/asset-url';
import { Link } from '@/lib/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { useTikTokEvents } from '@/hooks/useTikTokEvents';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ServiceHeroMasonry } from '@/components/ServiceHeroMasonry';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updateSEO } from '@/utils/seo';
import { ArrowRight, CheckCircle, Phone, Calendar, MapPin, Clock, Brain, Heart, Smile } from 'lucide-react';
import WellnessIcon from '@/components/WellnessIcon';
import { anxietyTreatmentContent } from '@/data/pageContent/services/anxietyTreatment';

// Import generated images
import doctorImage from "@assets/generated_images/Professional_psychiatrist_office_photo_e259ed9b.webp";
import anxietyImage from "@assets/generated_images/Anxiety_representation_efc2b954.webp";
import therapyRoomImage from "@assets/generated_images/Wellness_meditation_space_ae6f4d77.webp";
import zenStonesImage from "@assets/2b5aedce-1c8b-495c-a402-1c0a19a1633b_1755211366855.webp";

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

const AnxietyTreatment = () => {
  const { language } = useLanguage();
  const { trackServiceView } = useTikTokEvents();
  const enS = (key: string) => anxietyTreatmentContent.en.sections.find((x) => x.key === key)!;
  const esS = (key: string) => anxietyTreatmentContent.es.sections.find((x) => x.key === key)!;
  const s = (key: string) => anxietyTreatmentContent[language].sections.find((x) => x.key === key)!;
  const bilingualItems = (key: string) => {
    const en = enS(key).bullets!;
    const es = esS(key).bullets!;
    return en.map((e, i) => ({ en: e, es: es[i] }));
  };

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

    // Track TikTok ViewContent event
    trackServiceView('Anxiety Treatment', 'anxiety');
  }, [language, trackServiceView]);

  const symptoms = s('symptoms-list').bullets!;

  const treatments = s('approach-list').bullets!;

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
            en: anxietyTreatmentContent.en.title,
            es: anxietyTreatmentContent.es.title
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
                    {s('symptoms-badge').paragraphs![0]}
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                    {renderHeading(s('symptoms').heading!)}
                  </h2>
                  
                  {/* Key Stats */}
                  <div className="mb-6 sm:mb-8">
                    <div className="text-3xl sm:text-4xl font-bold mb-2 text-green-600">{s('symptoms-stat').paragraphs![0]}</div>
                    <div className="text-gray-600 font-body text-sm sm:text-base">
                      {s('symptoms-stat').paragraphs![1]}
                    </div>
                  </div>

                  <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 font-body leading-relaxed">
                    {s('symptoms-intro').paragraphs![0]}
                  </p>

                  <Link href={language === 'en' ? '/contact' : '/es/contacto'}>
                    <Button className="group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full text-sm sm:text-lg font-semibold transition-all duration-300 bg-green-700 text-white hover:bg-green-800 px-4 sm:px-6 sm:px-8 py-4 sm:py-6 sm:py-7">
                      <span>{s('symptoms-cta').paragraphs![0]}</span>
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
                        src={assetUrl(zenStonesImage)}
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
                        <span>{language === 'en' ? '+' : '+'}{symptoms.length - 6} {s('symptoms-more').paragraphs![0]}</span>
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
                {renderHeading(s('approach').heading!)}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                {s('approach-intro').paragraphs![0]}
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
                          {s('approach-card-desc').paragraphs![0]}
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
                  {renderHeading(s('why').heading!)}
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <WellnessIcon size="sm" color="green">
                      <Brain />
                    </WellnessIcon>
                    <div>
                      <h3 className="text-xl font-body font-bold text-green-800 mb-2">
                        {s('why-expertise').heading!}
                      </h3>
                      <p className="text-gray-600 font-body leading-relaxed">
                        {s('why-expertise').paragraphs![0]}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <WellnessIcon size="sm" color="blue">
                      <Smile />
                    </WellnessIcon>
                    <div>
                      <h3 className="text-xl font-body font-bold text-green-800 mb-2">
                        {s('why-cultural').heading!}
                      </h3>
                      <p className="text-gray-600 font-body leading-relaxed">
                        {s('why-cultural').paragraphs![0]}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <WellnessIcon size="sm" color="green">
                      <Heart />
                    </WellnessIcon>
                    <div>
                      <h3 className="text-xl font-body font-bold text-green-800 mb-2">
                        {s('why-personalized').heading!}
                      </h3>
                      <p className="text-gray-600 font-body leading-relaxed">
                        {s('why-personalized').paragraphs![0]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Card className="bg-green-800 text-white border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-body font-bold text-white">
                    {s('practice-info').heading!}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-green-300" />
                      <Link href={language === 'en' ? '/locations/psychiatrist-naples' : '/es/ubicaciones/psiquiatra-naples'} className="font-body hover:text-green-100 transition-colors underline">
                        {s('practice-link').paragraphs![0]}
                      </Link>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-green-300" />
                      <span className="font-body">
                        {s('practice-features').bullets![0]}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-300" />
                      <span className="font-body">
                        {s('practice-features').bullets![1]}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-300" />
                      <span className="font-body">
                        {s('practice-features').bullets![2]}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <Link href={language === 'en' ? '/contact' : '/es/contacto'}>
                      <Button size="lg" variant="secondary" className="bg-white text-green-800 hover:bg-green-50 font-semibold py-6 px-8 rounded-full w-full inline-flex items-center justify-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-green-100">
                          <Calendar className="w-4 h-4 text-green-800" />
                        </div>
                        {s('practice-cta').paragraphs![0]}
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