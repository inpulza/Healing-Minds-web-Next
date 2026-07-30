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
import { ArrowRight, CheckCircle, Phone, Calendar, MapPin, Clock, Zap, Info, Bolt } from 'lucide-react';
import WellnessIcon from '@/components/WellnessIcon';
import RichText from '@/components/RichText';
import { medicationManagementContent } from '@/data/pageContent/services/medicationManagement';

// Import generated images
import doctorImage from "@assets/generated_images/Professional_psychiatrist_office_photo_e259ed9b.webp";
import medicationImage from "@assets/generated_images/Medical_assessment_tools_78e50118.webp";
import therapyRoomImage from "@assets/generated_images/Therapy_room_interior_4b5878fd.webp";
import medicationCapsules from "@assets/e4031136-1b10-4229-8e1d-2c74e4186617_1755210913815.webp";

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

const MedicationManagement = () => {
  const { language } = useLanguage();
  const { trackServiceView } = useTikTokEvents();
  const enS = (key: string) => medicationManagementContent.en.sections.find((x) => x.key === key)!;
  const esS = (key: string) => medicationManagementContent.es.sections.find((x) => x.key === key)!;
  const s = (key: string) => medicationManagementContent[language].sections.find((x) => x.key === key)!;
  const bilingualItems = (key: string) => {
    const en = enS(key).bullets!;
    const es = esS(key).bullets!;
    return en.map((e, i) => ({ en: e, es: es[i] }));
  };

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Medication Management Naples FL - Psychiatric Medications | Dr. Melva Reve'
        : 'Manejo de Medicamentos Naples FL - Medicamentos Psiquiátricos | Dra. Melva Reve',
      description: language === 'en'
        ? 'Expert psychiatric medication management in Naples, FL. Dr. Melva Reve provides comprehensive medication evaluation, monitoring, and adjustment for mental health conditions. Bilingual services.'
        : 'Manejo experto de medicamentos psiquiátricos en Naples, FL. La Dra. Melva Reve brinda evaluación, monitoreo y ajuste integral de medicamentos para condiciones de salud mental. Servicios bilingües.',
      keywords: language === 'en'
        ? 'medication management Naples FL, psychiatric medications Naples, antidepressants Naples, mood stabilizers Naples, psychiatrist medication Naples, medication monitoring Naples'
        : 'manejo medicamentos Naples FL, medicamentos psiquiátricos Naples, antidepresivos Naples, estabilizadores ánimo Naples, psiquiatra medicamentos Naples, monitoreo medicamentos Naples',
      lang: language,
      canonical: language === 'en' ? '/services/medication-management' : '/es/servicios/manejo-medicamentos'
    };
    updateSEO(seoData);

    // Track TikTok ViewContent event
    trackServiceView('Medication Management', 'medication-management');
  }, [language, trackServiceView]);

  const benefits = s('benefits-grid').bullets!;

  const treatmentProcess = [1, 2, 3, 4, 5, 6].map((n) => ({
    step: String(n),
    title: s(`process-step-${n}`).heading!,
    description: s(`process-step-${n}`).paragraphs![0],
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
            en: medicationManagementContent.en.title,
            es: medicationManagementContent.es.title
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
            therapyRoomImage: medicationImage,
            symbolImage: therapyRoomImage
          }}
        />

        {/* Modern Benefits Section */}
        <section className="py-16 sm:py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 shadow-lg border border-green-100">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Content Side */}
                <div className="order-2 lg:order-1">
                  <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    {s('benefits-badge').paragraphs![0]}
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                    {renderHeading(s('benefits').heading!)}
                  </h2>
                  
                  {/* Key Stats */}
                  <div className="mb-6 sm:mb-8">
                    <div className="text-3xl sm:text-4xl font-bold mb-2 text-green-600">{s('benefits-stat').paragraphs![0]}</div>
                    <div className="text-gray-600 font-body text-sm sm:text-base">
                      {s('benefits-stat').paragraphs![1]}
                    </div>
                  </div>

                  <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 font-body leading-relaxed">
                    {s('benefits-intro').paragraphs![0]}
                  </p>

                  <Link href={language === 'en' ? '/contact' : '/es/contacto'}>
                    <Button className="group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full text-sm sm:text-lg font-semibold transition-all duration-300 bg-green-700 text-white hover:bg-green-800 px-4 sm:px-6 sm:px-8 py-4 sm:py-6 sm:py-7">
                      <span>{s('benefits-cta').paragraphs![0]}</span>
                      <div className="w-8 h-8 sm:w-9 sm:h-9 min-w-[2rem] min-h-[2rem] sm:min-w-[2.25rem] sm:min-h-[2.25rem] rounded-full flex items-center justify-center transition-all duration-300 bg-green-600 flex-shrink-0">
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                    </Button>
                  </Link>
                </div>

                {/* Photo and Benefits Side */}
                <div className="order-1 lg:order-2">
                  {/* Photo on top */}
                  <div className="mb-6">
                    <div className="w-full h-48 rounded-xl overflow-hidden bg-gradient-to-br from-green-50 to-green-100">
                      <img 
                        src={assetUrl(medicationCapsules)}
                        alt="Medication capsules on green background representing psychiatric care"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  
                  {/* Benefits Grid below */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {benefits.slice(0, 4).map((benefit, index) => (
                      <div key={index} className="p-4 hover:bg-green-50 transition-all duration-300 rounded-lg">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                          <Zap className="w-4 h-4 text-green-600" />
                        </div>
                        <h3 className="text-base font-body font-semibold text-green-800">{benefit}</h3>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modern Medication Management Benefits Section */}
        <section className="py-16 sm:py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 shadow-lg border border-green-100">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Content Side */}
                <div className="lg:col-span-2">
                  <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    {s('who-badge').paragraphs![0]}
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                    {renderHeading(s('who').heading!)}
                  </h2>
                  
                  <p className="text-lg sm:text-xl text-gray-600 mb-8 font-body leading-relaxed">
                    {s('who').paragraphs![0]}
                  </p>

                  {/* Benefits Grid */}
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Good Candidates */}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-xl font-body font-bold text-green-800">
                          {s('who-candidates').heading!}
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {s('who-candidates').bullets!.map((item, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-600 font-body text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Important Notes */}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Info className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-xl font-body font-bold text-green-800">
                          {s('who-considerations').heading!}
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {s('who-considerations').bullets!.map((item, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-600 font-body text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Link href={language === 'en' ? '/contact' : '/es/contacto'}>
                    <Button className="group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full text-sm sm:text-lg font-semibold transition-all duration-300 bg-green-700 text-white hover:bg-green-800 px-4 sm:px-6 sm:px-8 py-4 sm:py-6 sm:py-7">
                      <span>{s('who-cta').paragraphs![0]}</span>
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
                      <div className="text-3xl font-bold text-green-600 mb-2">{s('who-stat-1').paragraphs![0]}</div>
                      <div className="text-sm text-gray-600 font-body">
                        {s('who-stat-1').paragraphs![1]}
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                      <div className="text-3xl font-bold text-green-600 mb-2">{s('who-stat-2').paragraphs![0]}</div>
                      <div className="text-sm text-gray-600 font-body">
                        {s('who-stat-2').paragraphs![1]}
                      </div>
                    </div>
                  </div>

                  {/* Photo - Fills remaining space */}
                  <div className="flex-1 w-full rounded-xl overflow-hidden bg-gradient-to-br from-green-50 to-green-100">
                    <img 
                      src={assetUrl(medicationCapsules)}
                      alt="Medication capsules on green background representing psychiatric care"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Treatment Process Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                {renderHeading(s('process').heading!)}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {treatmentProcess.map((process, index) => (
                <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-green-600 font-bold text-2xl">{process.step}</span>
                    </div>
                    <h3 className="text-xl font-body font-bold text-green-800 mb-4">{process.title}</h3>
                    <p className="text-gray-600 font-body leading-relaxed">{process.description}</p>
                  </CardContent>
                </Card>
              ))}
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
                    <Bolt />
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

export default MedicationManagement;
