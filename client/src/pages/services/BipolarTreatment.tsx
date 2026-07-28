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
import { ArrowRight, CheckCircle, Phone, Calendar, Activity, TrendingUp, TrendingDown, Sparkles, Zap, Brain, Heart, ChevronUp, ChevronDown } from 'lucide-react';
import WellnessIcon from '@/components/WellnessIcon';
import RichText from '@/components/RichText';
import { bipolarTreatmentContent } from '@/data/pageContent/services/bipolarTreatment';

// Import generated images
import doctorImage from "@assets/generated_images/Professional_psychiatrist_office_photo_e259ed9b.webp";
import bipolarImage from "@assets/generated_images/Wellness_meditation_space_ae6f4d77.webp";
import therapyRoomImage from "@assets/generated_images/Therapy_room_interior_4b5878fd.webp";
import drMelvaOfficeImage from "../../assets/dr-melva-office.webp";

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

const BipolarTreatment = () => {
  const { language } = useLanguage();
  const { trackServiceView } = useTikTokEvents();
  const enS = (key: string) => bipolarTreatmentContent.en.sections.find((x) => x.key === key)!;
  const esS = (key: string) => bipolarTreatmentContent.es.sections.find((x) => x.key === key)!;
  const s = (key: string) => bipolarTreatmentContent[language].sections.find((x) => x.key === key)!;
  const bilingualItems = (key: string) => {
    const en = enS(key).bullets!;
    const es = esS(key).bullets!;
    return en.map((e, i) => ({ en: e, es: es[i] }));
  };

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Bipolar Disorder Treatment Naples FL - Mood Stabilization | Dr. Melva Reve'
        : 'Tratamiento Trastorno Bipolar Naples FL - Estabilización del Ánimo | Dra. Melva Reve',
      description: language === 'en'
        ? 'Expert bipolar disorder treatment in Naples, FL. Dr. Melva Reve provides comprehensive care for bipolar I, II, and cyclothymia. Mood stabilization, medication management, bilingual services.'
        : 'Tratamiento experto de trastorno bipolar en Naples, FL. La Dra. Melva Reve brinda atención integral para bipolar I, II y ciclotimia. Estabilización del ánimo, manejo de medicamentos, servicios bilingües.',
      keywords: language === 'en'
        ? 'bipolar disorder treatment Naples FL, mood stabilization Naples, bipolar psychiatrist Naples, manic depression treatment Naples, mood swings Naples, lithium treatment Naples'
        : 'tratamiento trastorno bipolar Naples FL, estabilización ánimo Naples, psiquiatra bipolar Naples, tratamiento depresión maníaca Naples, cambios humor Naples, tratamiento litio Naples',
      lang: language,
      canonical: language === 'en' ? '/services/bipolar-treatment' : '/es/servicios/tratamiento-bipolar'
    };
    updateSEO(seoData);

    // Track TikTok ViewContent event
    trackServiceView('Bipolar Treatment', 'bipolar');
  }, [language, trackServiceView]);

  const symptoms = [
    {
      type: s('symptom-manic').heading!,
      icon: ChevronUp,
      badge: s('symptom-manic').paragraphs![0],
      phase: s('symptom-manic').paragraphs![1],
      label: s('symptom-manic').paragraphs![2],
      items: s('symptom-manic').bullets!,
    },
    {
      type: s('symptom-depressive').heading!,
      icon: ChevronDown,
      badge: s('symptom-depressive').paragraphs![0],
      phase: s('symptom-depressive').paragraphs![1],
      label: s('symptom-depressive').paragraphs![2],
      items: s('symptom-depressive').bullets!,
    },
  ];

  const approachItems = [1, 2, 3, 4].map((n) => ({
    title: s(`approach-item-${n}`).heading!,
    description: s(`approach-item-${n}`).paragraphs![0],
  }));

  const bipolarTypes = [
    {
      type: s('type-1').heading!,
      description: s('type-1').paragraphs![1],
      severity: s('type-1').paragraphs![0],
      features: s('type-1').bullets!,
      color: 'purple',
    },
    {
      type: s('type-2').heading!,
      description: s('type-2').paragraphs![1],
      severity: s('type-2').paragraphs![0],
      features: s('type-2').bullets!,
      color: 'blue',
    },
    {
      type: s('type-3').heading!,
      description: s('type-3').paragraphs![1],
      severity: s('type-3').paragraphs![0],
      features: s('type-3').bullets!,
      color: 'green',
    },
  ];

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
            en: bipolarTreatmentContent.en.title,
            es: bipolarTreatmentContent.es.title
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
            therapyRoomImage: bipolarImage,
            symbolImage: therapyRoomImage
          }}
        /> 

        {/* Modern Treatment Approach Section */}
        <section className="py-16 sm:py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 shadow-lg border border-green-100">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Content Side */}
                <div className="lg:col-span-2">
                  <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    {s('approach-badge').paragraphs![0]}
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                    {renderHeading(s('approach').heading!)}
                  </h2>
                  
                  <p className="text-lg sm:text-xl text-gray-600 mb-8 font-body leading-relaxed">
                    {s('approach').paragraphs![0]}
                  </p>

                  {/* Treatment List */}
                  <div className="grid gap-4 mb-8">
                    {approachItems.map((treatment, index) => (
                      <div key={index} className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-green-600 font-bold text-sm">{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-body font-bold text-green-800 mb-1">{treatment.title}</h3>
                            <p className="text-gray-600 font-body text-sm leading-relaxed">{treatment.description}</p>
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
                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                      <div className="text-3xl font-bold text-green-600 mb-2">{s('approach-stat-1').paragraphs![0]}</div>
                      <div className="text-sm text-gray-600 font-body">
                        {s('approach-stat-1').paragraphs![1]}
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{s('approach-stat-2').paragraphs![0]}</div>
                      <div className="text-sm text-gray-600 font-body">
                        {s('approach-stat-2').paragraphs![1]}
                      </div>
                    </div>
                  </div>

                  {/* Dr. Melva Office Photo - Fills remaining space */}
                  <div className="flex-1 w-full overflow-hidden rounded-xl shadow-md">
                    <img 
                      src={drMelvaOfficeImage}
                      alt="Dr. Melva Reve in her professional psychiatric office - Naples, FL"
                      className="w-full h-full object-cover object-[65%_35%] scale-125"
                      loading="lazy"
                      decoding="async"
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
            <div className="text-center mb-12 sm:mb-16">
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                <WellnessIcon size="md" color="green" className="opacity-70">
                  <Brain />
                </WellnessIcon>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-body font-bold text-green-800 text-center">
                  {renderHeading(s('symptoms').heading!)}
                </h2>
                <WellnessIcon size="md" color="green" className="opacity-70">
                  <Heart />
                </WellnessIcon>
              </div>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed px-4 sm:px-0">
                {s('symptoms').paragraphs![0]}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {symptoms.map((symptomGroup, groupIndex) => {
                const IconComponent = symptomGroup.icon;
                return (
                  <div
                    key={groupIndex}
                    className={`rounded-2xl sm:rounded-3xl ${
                      groupIndex === 0 
                        ? 'bg-green-50' 
                        : 'bg-blue-50'
                    }`}
                  >
                    <div className="p-6 sm:p-8 text-green-800">
                      {/* Header with Icon and Title */}
                      <div className="flex items-center gap-4 mb-6 bg-[#ffffff00]">
                        <div className="p-3 rounded-2xl">
                          <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-green-800" />
                        </div>
                        <div>
                          <h3 className="text-xl sm:text-2xl font-display font-bold mb-1 text-green-800">
                            {symptomGroup.type}
                          </h3>
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#16a34a] text-[#ffffff]">
                            {groupIndex === 0 
                              ? <TrendingUp className="w-3 h-3" />
                              : <TrendingDown className="w-3 h-3" />
                            }
                            {symptomGroup.badge}
                          </div>
                        </div>
                      </div>

                      {/* Symptoms Grid */}
                      <div className="grid gap-3 mb-6">
                        {symptomGroup.items.map((item, index) => (
                          <div 
                            key={index} 
                            className="flex items-start gap-3 p-3 rounded-xl"
                          >
                            <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2 bg-green-500"></div>
                            <span className="text-sm sm:text-base font-body leading-relaxed text-green-800">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Bottom Action Area */}
                      <div className="p-4 rounded-xl bg-[#ffffff]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {groupIndex === 0 ? (
                              <Zap className="w-4 h-4 text-green-800" />
                            ) : (
                              <Brain className="w-4 h-4 text-green-800" />
                            )}
                            <span className="text-sm font-medium text-green-800">
                              {symptomGroup.phase}
                            </span>
                          </div>
                          <div className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                            {symptomGroup.label}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Types of Bipolar Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {renderHeading(s('types').heading!)}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {bipolarTypes.map((type, index) => {
                const backgroundClasses: Record<string, string> = {
                  purple: 'bg-green-50',
                  blue: 'bg-blue-50',
                  green: 'bg-purple-50'
                };

                return (
                  <div
                    key={index}
                    className={`rounded-2xl sm:rounded-3xl ${backgroundClasses[type.color]} min-h-[400px] flex flex-col`}
                  >
                    <div className="p-6 sm:p-8 text-green-800 flex flex-col h-full bg-[#f0fdf4]">
                      {/* Header */}
                      <div className="text-center mb-6">
                        <div className="inline-flex p-4 rounded-2xl mb-4 bg-[#00ff5e5c]">
                          <Activity className="w-8 h-8 text-green-800" />
                        </div>
                        
                        <div className="px-3 py-1 rounded-full text-xs font-bold text-green-800 inline-block mb-3">
                          {type.severity}
                        </div>
                        
                        <h3 className="text-xl sm:text-2xl font-display font-bold mb-3 text-green-800">
                          {type.type}
                        </h3>
                        
                        <p className="text-green-800 font-body leading-relaxed text-sm sm:text-base">
                          {type.description}
                        </p>
                      </div>

                      {/* Features List */}
                      <div className="flex-grow">
                        <div className="space-y-3 mb-6">
                          {type.features.map((feature, featureIndex) => (
                            <div 
                              key={featureIndex}
                              className="flex items-center gap-3 p-3 rounded-xl"
                            >
                              <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                              <span className="text-sm font-body text-green-800">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-auto">
                        <div className="p-4 rounded-xl bg-[#ffffff]">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-800">
                              {s('types-footer').paragraphs![0]}
                            </span>
                            <div className="flex items-center gap-1">
                              <Sparkles className="w-4 h-4 text-green-800" />
                              <span className="text-xs font-medium text-green-800">
                                {s('types-footer').paragraphs![1]}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                      <span className="text-gray-700 font-body text-lg"><RichText text={benefit} linkClassName="text-green-700 hover:text-green-800 underline" /></span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-center lg:text-left">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <WellnessIcon size="lg" color="green" className="mx-auto lg:mx-0 mb-6">
                    <Activity />
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
                        {s('why-card-cta').paragraphs![0]}
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
                        {s('why-card-cta').paragraphs![1]}
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

export default BipolarTreatment;
