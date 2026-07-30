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
import { ArrowRight, CheckCircle, Phone, Calendar, MapPin, Clock, Heart, Brain, Smile, Sun } from 'lucide-react';
import WellnessIcon from '@/components/WellnessIcon';
import { depressionTreatmentContent } from '@/data/pageContent/services/depressionTreatment';

// Import generated images
import doctorImage from "@assets/generated_images/Professional_psychiatrist_office_photo_e259ed9b.webp";
import therapyRoomImage from "@assets/generated_images/Therapy_room_interior_4b5878fd.webp";
import hopeSymbolImage from "@assets/generated_images/Hope_and_growth_symbolism_978bb907.webp";
import consultationImage from "../../assets/consultation-image.webp";

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

const DepressionTreatment = () => {
  const { language } = useLanguage();
  const { trackServiceView } = useTikTokEvents();
  const enS = (key: string) => depressionTreatmentContent.en.sections.find((x) => x.key === key)!;
  const esS = (key: string) => depressionTreatmentContent.es.sections.find((x) => x.key === key)!;
  const s = (key: string) => depressionTreatmentContent[language].sections.find((x) => x.key === key)!;
  const bilingualItems = (key: string) => {
    const en = enS(key).bullets!;
    const es = esS(key).bullets!;
    return en.map((e, i) => ({ en: e, es: es[i] }));
  };

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Depression Treatment Naples FL - Expert Psychiatrist | Dr. Melva Reve'
        : 'Tratamiento para la Depresión Naples FL - Psiquiatra con Licencia | Dra. Melva Reve',
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

  const symptoms = s('symptoms-list').bullets!;

  const treatments = s('treatments').bullets!.map((title, i) => ({
    title,
    description: s('treatment-descriptions').bullets![i]
  }));

  // Data for the ServiceHeroMasonry component
  const heroData = {
    tagline: {
      en: enS('hero-tagline').paragraphs![0],
      es: esS('hero-tagline').paragraphs![0]
    },
    title: {
      en: depressionTreatmentContent.en.title,
      es: depressionTreatmentContent.es.title
    },
    description: {
      en: enS('hero-description').paragraphs![0],
      es: esS('hero-description').paragraphs![0]
    },
    facts: {
      title: {
        en: enS('hero-facts').heading!,
        es: esS('hero-facts').heading!
      },
      items: bilingualItems('hero-facts')
    },
    images: {
      doctorImage,
      therapyRoomImage,
      symbolImage: hopeSymbolImage
    },
    specialNote: {
      es: markdownToHtml(esS('hero-special-note').paragraphs![0])
    },
    quickStats: {
      items: bilingualItems('hero-quick-stats')
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
                  {s('crisis-banner').paragraphs![0]}
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
                  {s('crisis-banner').paragraphs![0]}
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
                {renderHeading(s('symptoms').heading!)}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                {s('symptoms').paragraphs![0]}
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
                    {s('approach-badge').paragraphs![0]}
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                    {renderHeading(s('approach').heading!)}
                  </h2>
                  
                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{s('approach-stat-1').paragraphs![0]}</div>
                      <div className="text-sm text-gray-600 font-body">
                        {s('approach-stat-1').paragraphs![1]}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                      <div className="text-3xl font-bold text-green-600 mb-2">{s('approach-stat-2').paragraphs![0]}</div>
                      <div className="text-sm text-gray-600 font-body">
                        {s('approach-stat-2').paragraphs![1]}
                      </div>
                    </div>
                  </div>

                  <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 font-body leading-relaxed">
                    {s('approach-intro').paragraphs![0]}
                  </p>

                  <Link href={language === 'en' ? '/contact' : '/es/contacto'}>
                    <Button className="group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full text-sm sm:text-lg font-semibold transition-all duration-300 bg-green-700 text-white hover:bg-green-800 px-4 sm:px-6 sm:px-8 py-4 sm:py-6 sm:py-7">
                      <span>{s('approach-cta').paragraphs![0]}</span>
                      <div className="w-8 h-8 sm:w-9 sm:h-9 min-w-[2rem] min-h-[2rem] sm:min-w-[2.25rem] sm:min-h-[2.25rem] rounded-full flex items-center justify-center transition-all duration-300 bg-green-600 flex-shrink-0">
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                    </Button>
                  </Link>

                  {/* Professional Consultation Photo */}
                  <div className="mt-8">
                    <div className="w-full aspect-[16/9] overflow-hidden rounded-xl shadow-md">
                      <img 
                        src={assetUrl(consultationImage)}
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
                  {renderHeading(s('why').heading!)}
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <WellnessIcon size="sm" color="blue">
                      <Brain />
                    </WellnessIcon>
                    <div>
                      <h3 className="text-xl font-body font-bold text-green-800 mb-2">
                        {s('why-expertise').heading}
                      </h3>
                      <p className="text-gray-600 font-body leading-relaxed">
                        {s('why-expertise').paragraphs![0]}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <WellnessIcon size="sm" color="purple">
                      <Smile />
                    </WellnessIcon>
                    <div>
                      <h3 className="text-xl font-body font-bold text-green-800 mb-2">
                        {s('why-comprehensive').heading}
                      </h3>
                      <p className="text-gray-600 font-body leading-relaxed">
                        {s('why-comprehensive').paragraphs![0]}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <WellnessIcon size="sm" color="green">
                      <Sun />
                    </WellnessIcon>
                    <div>
                      <h3 className="text-xl font-body font-bold text-green-800 mb-2">
                        {s('why-hope').heading}
                      </h3>
                      <p className="text-gray-600 font-body leading-relaxed">
                        {s('why-hope').paragraphs![0]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Card className="bg-green-800 text-white border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-body font-bold text-white">
                    {s('practice-info').heading}
                  </CardTitle>
                  <CardDescription className="text-green-200 font-body">
                    {s('practice-info').paragraphs![0]}
                  </CardDescription>
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

export default DepressionTreatment;