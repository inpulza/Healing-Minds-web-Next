import { useEffect, useState } from 'react';
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
import { ArrowRight, CheckCircle, Phone, Calendar, Brain, Activity, Sparkles, ChevronDown } from 'lucide-react';
import WellnessIcon from '@/components/WellnessIcon';
import RichText from '@/components/RichText';
import { adhdTreatmentContent } from '@/data/pageContent/services/adhdTreatment';

// Import generated images
import doctorImage from "@assets/generated_images/Professional_psychiatrist_office_photo_e259ed9b.webp";
import adhdImage from "@assets/generated_images/ADHD_concentration_challenges_4b3ea4fb.webp";
import therapyRoomImage from "@assets/generated_images/Therapy_room_interior_4b5878fd.webp";
import focusImage from "@assets/dfb74c06-cc22-4bd4-a763-984d9e0fb151_1755252634353.webp";

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

const AdhdTreatment = () => {
  const { language } = useLanguage();
  const { trackServiceView } = useTikTokEvents();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const enS = (key: string) => adhdTreatmentContent.en.sections.find((x) => x.key === key)!;
  const esS = (key: string) => adhdTreatmentContent.es.sections.find((x) => x.key === key)!;
  const s = (key: string) => adhdTreatmentContent[language].sections.find((x) => x.key === key)!;
  const bilingualItems = (key: string) => {
    const en = enS(key).bullets!;
    const es = esS(key).bullets!;
    return en.map((e, i) => ({ en: e, es: es[i] }));
  };

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'ADHD Treatment Naples FL - Adult ADHD Psychiatrist | Dr. Melva Reve'
        : 'Tratamiento TDAH Adultos en Naples, FL | Healing Minds Psychiatry',
      description: language === 'en'
        ? 'Expert ADHD treatment for adults in Naples, FL. Dr. Melva Reve provides comprehensive evaluation, medication management, and behavioral strategies for adults 18+. Bilingual ADHD psychiatrist.'
        : 'Tratamiento especializado de TDAH para adultos en Naples, FL. Dra. Melva Reve ofrece evaluación integral, manejo de medicamentos y estrategias personalizadas. Psiquiatra bilingüe experta.',
      keywords: language === 'en'
        ? 'ADHD treatment Naples FL, adult ADHD Naples, ADHD psychiatrist Naples, ADHD medication Naples, attention deficit disorder Naples, adult ADD Naples'
        : 'tratamiento TDAH adultos Naples FL, psiquiatra TDAH Naples, diagnóstico TDAH adultos, medicamento TDAH Naples, trastorno déficit atención adultos, Condado Collier TDAH',
      lang: language,
      canonical: '/services/adhd-treatment'
    };
    updateSEO(seoData);

    // Track TikTok ViewContent event
    trackServiceView('ADHD Treatment', 'adhd');
  }, [language, trackServiceView]);

  const symptomItemKeys = ['symptoms-inattention', 'symptoms-hyperactivity', 'symptoms-impulsivity'];
  const symptoms = s('symptoms-categories').bullets!.map((category, i) => ({
    category,
    items: s(symptomItemKeys[i]).bullets!,
  }));

  const treatmentDescriptions = s('approach-treatment-descriptions').bullets!;
  const treatments = s('approach-treatments').bullets!.map((title, i) => ({
    title,
    description: treatmentDescriptions[i],
  }));

  const processDescriptions = s('process-step-descriptions').bullets!;
  const processSteps = s('process-steps').bullets!.map((title, i) => ({
    step: i + 1,
    title,
    description: processDescriptions[i],
  }));

  const adultOptionDescriptions = s('adult-option-descriptions').bullets!;
  const adultOptions = s('adult-options').bullets!.map((title, i) => ({
    title,
    description: adultOptionDescriptions[i],
  }));

  const comparisonAdhd = s('comparison-adhd').bullets!;
  const comparisonStress = s('comparison-stress').bullets!;
  const comparisonRows = s('comparison-symptoms').bullets!.map((symptom, i) => ({
    symptom,
    adhd: comparisonAdhd[i],
    stress: comparisonStress[i],
  }));

  const faqAnswers = s('faq-answers').bullets!;
  const faqs = s('faq-questions').bullets!.map((question, i) => ({
    question,
    answer: faqAnswers[i],
  }));

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
            en: adhdTreatmentContent.en.title,
            es: adhdTreatmentContent.es.title
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
            therapyRoomImage: adhdImage,
            symbolImage: therapyRoomImage
          }}
        />

        {/* Identification Section - ¿Te Sientes Identificado? */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {renderHeading(s('identification').heading!)}
              </h2>
              <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                {s('identification-badge').paragraphs![0]}
              </div>
            </div>

            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
              <p className="text-lg mb-6">
                {s('identification-p1').paragraphs![0]}
              </p>
              
              <p className="text-lg">
                {s('identification-p2').paragraphs![0]}
              </p>
            </div>
          </div>
        </section>


        {/* Treatment Process Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {renderHeading(s('process').heading!)}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {s('process-intro').paragraphs![0]}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {processSteps.map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xl">{item.step}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-green-800 mb-4">{item.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Adult ADHD Treatment Section */}
        <section className="py-16 sm:py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 shadow-lg border border-green-100">
              {/* Header Section */}
              <div className="text-center mb-10">
                <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  {s('adult-badge').paragraphs![0]}
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                  {renderHeading(s('adult').heading!)}
                </h2>
                
                {/* Key Stats */}
                <div className="flex justify-center">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-xs sm:max-w-md">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-6">
                      <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">{s('adult-stat-1').paragraphs![0]}</div>
                      <div className="text-xs sm:text-sm text-gray-600 font-body">
                        {s('adult-stat-1').paragraphs![1]}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 sm:p-6">
                      <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">{s('adult-stat-2').paragraphs![0]}</div>
                      <div className="text-xs sm:text-sm text-gray-600 font-body">
                        {s('adult-stat-2').paragraphs![1]}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content with Photo */}
              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-10">
                <div>
                  <p className="text-lg text-gray-600 mb-8 font-body leading-relaxed">
                    {s('adult-intro').paragraphs![0]}
                  </p>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-bold text-green-800 mb-3">
                      {s('adult-bilingual').heading!}
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {s('adult-bilingual').paragraphs![0]}
                    </p>
                  </div>

                  <Link href={language === 'en' ? '/contact' : '/es/contacto'}>
                    <Button className="group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full text-sm sm:text-base lg:text-lg font-semibold transition-all duration-300 bg-green-700 text-white hover:bg-green-800 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-7 w-full sm:w-auto">
                      <span className="text-center">{s('adult-cta').paragraphs![0]}</span>
                      <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9 min-w-[1.5rem] min-h-[1.5rem] sm:min-w-[2rem] sm:min-h-[2rem] lg:min-w-[2.25rem] lg:min-h-[2.25rem] rounded-full flex items-center justify-center transition-all duration-300 bg-green-600 flex-shrink-0">
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                      </div>
                    </Button>
                  </Link>
                </div>

                <div className="w-full">
                  <div className="w-full aspect-[4/3] overflow-hidden rounded-xl shadow-lg mb-6 max-w-full">
                    <img 
                      src={assetUrl(focusImage)}
                      alt="Professional therapist reviewing ADHD treatment plans - Dr. Melva Reve's modern psychiatric practice"
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>

              {/* Dr. Reve Quote Section */}
              <div className="border-t border-gray-200 pt-8 mb-8">
                <div className="max-w-4xl mx-auto text-center">
                  <div className="mb-6">
                    <div className="w-1 h-12 bg-green-600 mx-auto mb-6"></div>
                    <blockquote className="text-xl lg:text-2xl text-gray-700 font-light leading-relaxed italic">
                      {s('adult-quote').paragraphs![0]}
                    </blockquote>
                    <cite className="block text-green-800 font-semibold text-lg mt-6">
                      {s('adult-quote-cite').paragraphs![0]}
                    </cite>
                  </div>
                </div>
              </div>

              {/* Bottom Section - Treatment Options in 2x2 Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {adultOptions.map((treatment, index) => (
                  <div key={index} className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-bold text-xs sm:text-sm">{index + 1}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-body font-bold text-green-800 mb-2">{treatment.title}</h3>
                        <p className="text-gray-600 font-body text-xs sm:text-sm leading-relaxed">{treatment.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Symptoms Section */}
        <section className="py-16 sm:py-20 bg-[#ffffff]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {renderHeading(s('symptoms').heading!)}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                {s('symptoms-intro').paragraphs![0]}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {symptoms.map((category, index) => {
                const backgroundClasses: { [key: number]: string } = {
                  0: 'bg-blue-50',
                  1: 'bg-green-50', 
                  2: 'bg-purple-50'
                };
                
                return (
                  <div
                    key={index}
                    className={`rounded-2xl sm:rounded-3xl ${backgroundClasses[index]} min-h-[400px] flex flex-col`}
                  >
                    <div className="p-6 sm:p-8 text-green-800 flex flex-col h-full">
                      {/* Header */}
                      <div className="text-center mb-6">
                        {/* Icon and Category Group */}
                        <div className="mb-4">
                          <div className="inline-flex p-4 rounded-2xl bg-[#00ff5c4f]">
                            <Brain className="w-8 h-8 text-green-800" />
                          </div>
                          <div className="block">
                            <div className="px-3 py-1 rounded-full text-xs font-bold text-green-800 inline-block mt-2">
                              {s('symptoms-category-label').paragraphs![0]} {index + 1}
                            </div>
                          </div>
                        </div>
                        
                        <h3 className="text-xl sm:text-2xl font-display font-bold mb-3 text-green-800">
                          {category.category}
                        </h3>
                        
                        <p className="text-green-800 font-body leading-relaxed text-sm sm:text-base">
                          {s('symptoms-card-desc').paragraphs![0]}
                        </p>
                      </div>

                      {/* Features List */}
                      <div className="flex-grow">
                        <div className="space-y-3 mb-6">
                          {category.items.map((item, itemIndex) => (
                            <div 
                              key={itemIndex}
                              className="flex items-center gap-3 p-3 rounded-xl"
                            >
                              <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                              <span className="text-sm font-body text-green-800">
                                {item}
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
                              {s('symptoms-footer-label').paragraphs![0]}
                            </span>
                            <div className="flex items-center gap-1">
                              <Activity className="w-4 h-4 text-green-800" />
                              <span className="text-xs font-medium text-green-800">
                                {s('symptoms-footer-impact').paragraphs![0]}
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

        {/* ADHD vs Work Stress Comparison Table */}
        <section className="py-16 sm:py-20 bg-green-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {renderHeading(s('comparison').heading!)}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {s('comparison-intro').paragraphs![0]}
              </p>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-green-100">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold text-green-800">
                        {s('comparison-headers').bullets![0]}
                      </th>
                      <th className="px-6 py-4 text-left font-bold text-green-800">
                        {s('comparison-headers').bullets![1]}
                      </th>
                      <th className="px-6 py-4 text-left font-bold text-green-800">
                        {s('comparison-headers').bullets![2]}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-6 py-4 font-semibold text-gray-800">{row.symptom}</td>
                        <td className="px-6 py-4 text-gray-700">{row.adhd}</td>
                        <td className="px-6 py-4 text-gray-700">{row.stress}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>


        {/* Final Call to Action */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-green-600 to-green-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 shadow-xl">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {renderHeading(s('cta').heading!)}
              </h2>
              
              <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                {s('cta-badge').paragraphs![0]}
              </div>

              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                {s('cta-intro').paragraphs![0]}
              </p>

              <p className="text-xl font-bold text-green-800 mb-8">
                {s('cta-highlight').paragraphs![0]}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="tel:+12394230272"
                  className="group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full text-sm sm:text-lg font-semibold transition-all duration-300 bg-green-700 text-white hover:bg-green-800 px-4 sm:px-8 py-3 sm:py-4"
                  data-testid="button-call-now"
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>
                    {s('cta-call').paragraphs![0]}
                  </span>
                </a>
                
                <Link href={language === 'en' ? '/contact' : '/es/contacto'}>
                  <Button 
                    variant="outline" 
                    className="group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full text-sm sm:text-lg font-semibold transition-all duration-300 border-2 border-green-700 text-green-700 hover:bg-green-50 px-4 sm:px-8 py-3 sm:py-4"
                    data-testid="button-schedule-online"
                  >
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>
                      {s('cta-schedule').paragraphs![0]}
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Treatment Approach Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {renderHeading(s('approach').heading!)}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                {s('approach-intro').paragraphs![0]}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {treatments.map((treatment, index) => {
                const backgroundClasses: { [key: number]: string } = {
                  0: 'bg-blue-50',
                  1: 'bg-green-50',
                  2: 'bg-purple-50',
                  3: 'bg-orange-50',
                  4: 'bg-teal-50',
                  5: 'bg-pink-50'
                };
                
                return (
                  <div
                    key={index}
                    className={`rounded-2xl sm:rounded-3xl ${backgroundClasses[index]} min-h-[300px] flex flex-col`}
                  >
                    <div className="p-6 sm:p-8 text-green-800 flex flex-col h-full">
                      {/* Header */}
                      <div className="text-center mb-6">
                        {/* Icon and Step Group */}
                        <div className="mb-4">
                          <div className="inline-flex p-4 rounded-2xl bg-[#00ff5d4d]">
                            <CheckCircle className="w-8 h-8 text-green-800" />
                          </div>
                          <div className="block">
                            <div className="px-3 py-1 rounded-full text-xs font-bold text-green-800 inline-block mt-2">
                              {s('approach-step-label').paragraphs![0]} {index + 1}
                            </div>
                          </div>
                        </div>
                        
                        <h3 className="text-xl sm:text-2xl font-display font-bold mb-3 text-green-800">
                          {treatment.title}
                        </h3>
                        
                        <p className="text-green-800 font-body leading-relaxed text-sm sm:text-base">
                          {treatment.description}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="mt-auto">
                        <div className="p-4 rounded-xl bg-[#ffffff]">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-800">
                              {s('approach-footer-label').paragraphs![0]}
                            </span>
                            <div className="flex items-center gap-1">
                              <Sparkles className="w-4 h-4 text-green-800" />
                              <span className="text-xs font-medium text-green-800">
                                {s('approach-footer-expert').paragraphs![0]}
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

        {/* FAQ Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {renderHeading(s('faq').heading!)}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {s('faq-intro').paragraphs![0]}
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden"
                  data-testid={`faq-item-${index}`}
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 text-left flex items-center justify-between hover:bg-green-50 transition-colors duration-200"
                    data-testid={`faq-question-${index}`}
                  >
                    <h3 className="text-lg sm:text-xl font-display font-semibold text-gray-900 pr-4 sm:pr-8">
                      {faq.question}
                    </h3>
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                      openFAQ === index 
                        ? 'bg-green-600' 
                        : 'bg-green-200'
                    }`}>
                      <ChevronDown 
                        className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
                          openFAQ === index 
                            ? 'text-white rotate-180' 
                            : 'text-green-700'
                        }`} 
                      />
                    </div>
                  </button>
                  
                  {openFAQ === index && (
                    <div className="px-4 sm:px-6 lg:px-8 pb-5 sm:pb-6">
                      <div className="pt-2 border-t border-green-100">
                        <p 
                          className="text-gray-600 font-body leading-relaxed text-lg"
                          data-testid={`faq-answer-${index}`}
                        >
                          <RichText text={faq.answer} linkClassName="text-green-700 hover:text-green-800 underline" />
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AdhdTreatment;
