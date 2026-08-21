import { useEffect, useCallback } from 'react';
import { assetUrl } from '@/lib/asset-url';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';
import { Button } from '@/components/ui/button';
import { VideoIcon, CheckCircle, MapPin, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useTikTokEvents } from '@/hooks/useTikTokEvents';
import InsuranceLogos from '@/components/InsuranceLogos';
import LocationFAQ from '@/components/LocationFAQ';
import { locationFAQs } from '@/data/locationFAQs';
import { telepsychiatryFloridaContent } from '@/data/pageContent/mainPages/telepsychiatryFlorida';
import WellnessIcon from '@/components/WellnessIcon';
import floridaMap from '../assets/florida-map.webp';
import useEmblaCarousel from 'embla-carousel-react';
import CharmHealthBooking from '@/components/CharmHealthBooking';
import DoctorSection from '@/components/DoctorSection';
import { trackLeadConversion } from '@/lib/analytics';
import accessFromHomeImg from '@assets/generated_images/Access_from_anywhere_Florida_325859e3.webp';
import convenientSchedulingImg from '@assets/generated_images/Convenient_time_saving_66f1475e.webp';
import securePrivateImg from '@assets/generated_images/Private_secure_platform_a7ed7a02.webp';
import continuityCareImg from '@assets/generated_images/Continuity_of_care_87991256.webp';
import initialEvaluationImg from '@assets/generated_images/Initial_psychiatric_evaluation_99ae51a4.webp';
import anxietyDepressionImg from '@assets/generated_images/Anxiety_depression_calm_bdd7c98f.webp';
import adhdManagementImg from '@assets/generated_images/ADHD_evaluation_management_b7a38ebf.webp';
import ptsdTherapyImg from '@assets/generated_images/PTSD_trauma_therapy_61fd2d71.webp';
import bipolarTreatmentImg from '@assets/generated_images/Bipolar_balance_stability_da9b84ed.webp';
import medicationManagementImg from '@assets/generated_images/Medication_management_studio_556b9569.webp';

const TelepsychiatryFlorida = () => {
  const { language } = useLanguage();
  const { trackTelehealthClick } = useTikTokEvents();
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    breakpoints: {
      '(min-width: 768px)': { active: false }
    }
  });

  const [emblaRef2, emblaApi2] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    breakpoints: {
      '(min-width: 768px)': { active: false }
    }
  });

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Telepsychiatry Florida | Online Psychiatrist (Bilingual) | Healing Minds'
        : 'Telepsiquiatría Florida | Psiquiatra Online (Bilingüe) | Healing Minds',
      description: language === 'en'
        ? 'Florida adults may request telepsychiatry for anxiety, depression or ADHD. The office confirms the professional, location, licensing, suitability and availability.'
        : 'Los adultos en Florida pueden solicitar telepsiquiatría para ansiedad, depresión o TDAH. La oficina confirma profesional, ubicación, licencias, adecuación y disponibilidad.',
      keywords: language === 'en'
        ? 'telepsychiatry Florida, online psychiatrist Florida, telehealth psychiatry FL, virtual psychiatrist Florida, telepsiquiatria Florida'
        : 'telepsiquiatría Florida, psiquiatra online Florida, telepsiquiatría FL, psiquiatra virtual Florida',
      lang: language,
      canonical: language === 'en' ? '/telepsychiatry-florida' : '/es/telepsiquiatria-florida'
    };
    updateSEO(seoData);
  }, [language]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollPrev2 = useCallback(() => {
    if (emblaApi2) emblaApi2.scrollPrev();
  }, [emblaApi2]);

  const scrollNext2 = useCallback(() => {
    if (emblaApi2) emblaApi2.scrollNext();
  }, [emblaApi2]);

  const content = telepsychiatryFloridaContent[language];
  const s = (key: string) => content.sections.find((section) => section.key === key)!;
  const benefitSections = ['benefit-access', 'benefit-convenient', 'benefit-secure', 'benefit-continuity'].map(s);
  const processSteps = ['process-step-1', 'process-step-2', 'process-step-3', 'process-step-4'].map(s);
  const serviceSections = ['service-evaluation', 'service-anxiety-depression', 'service-adhd', 'service-ptsd', 'service-bipolar', 'service-medication'].map(s);
  const benefitAltTexts = language === 'en'
    ? [
        'Adult using a laptop at home',
        'Calendar and clock beside a laptop',
        'Video-call interface displayed on a laptop',
        'Person reviewing notes beside a laptop',
      ]
    : [
        'Persona adulta usando una computadora portátil en casa',
        'Calendario y reloj junto a una computadora portátil',
        'Interfaz de videollamada en una computadora portátil',
        'Persona revisando notas junto a una computadora portátil',
      ];
  const serviceAltTexts = language === 'en'
    ? [
        'Clinician reviewing an evaluation form',
        'Calm indoor scene representing anxiety and depression care',
        'Desk materials representing attention and planning',
        'Quiet supportive setting representing trauma care',
        'Balanced stones representing mood stability',
        'Medication bottles and a clinical notebook',
      ]
    : [
        'Profesional clínico revisando un formulario de evaluación',
        'Escena interior tranquila que representa atención para ansiedad y depresión',
        'Materiales de escritorio que representan atención y planificación',
        'Entorno tranquilo de apoyo que representa atención relacionada con trauma',
        'Piedras equilibradas que representan estabilidad del estado de ánimo',
        'Frascos de medicamentos y una libreta clínica',
      ];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section - Simplified */}
        <section className="pt-20 pb-12 sm:pb-16 lg:pb-20 bg-[#ffffff]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <div className="max-w-7xl mx-auto mb-10">
                <CharmHealthBooking 
                  variant="prominent" 
                  showDescription={false}
                  colorScheme="green"
                  heroBadges={
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-green-100">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <VideoIcon className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-gray-700 font-body font-medium text-xs sm:text-sm">
                          {s('hero-badges').bullets![0]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-green-100">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-gray-700 font-body font-medium text-xs sm:text-sm">
                          {s('hero-badges').bullets![1]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-green-100">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-gray-700 font-body font-medium text-xs sm:text-sm">
                          {s('hero-badges').bullets![2]}
                        </span>
                      </div>
                    </div>
                  }
                  heroTitle={
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-body font-bold text-green-800 text-left">
                      {language === 'en' ? (
                        <>
                          Request <span className="font-display italic text-green-700">Telepsychiatry</span> in{' '}
                          <span className="font-display italic text-green-700">Florida</span>
                        </>
                      ) : (
                        <>
                          Solicite <span className="font-display italic text-green-700">Telepsiquiatría</span> en{' '}
                          <span className="font-display italic text-green-700">Florida</span>
                        </>
                      )}
                    </h1>
                  }
                  heroDescription={
                    <p className="text-sm md:text-base leading-relaxed font-body text-[#1e6b3b] max-w-md">
                      {s('hero-description').paragraphs![0]}
                    </p>
                  }
                />
              </div>
            </div>
          </div>
        </section>

        {/* Statewide Coverage Section with Map */}
        <section className="py-12 sm:py-16 lg:py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-4">
                {language === 'en' ? (
                  <>Florida <span className="font-display italic text-green-700">Eligibility</span></>
                ) : (
                  <>Cobertura <span className="font-display italic text-green-700">Estatal</span></>
                )}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed mb-8">
                {s('coverage-description').paragraphs![0]}
              </p>
              
              {/* Feature Tags */}
              <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
                {s('coverage-feature-tags').bullets!.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-green-100" data-testid={`feature-tag-${index}`}>
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-body font-medium text-xs sm:text-sm">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="bg-green-50 rounded-3xl p-8 border border-green-100">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                  <img 
                    src={assetUrl(floridaMap)}
                    alt="Map of Florida used to explain location and licensing eligibility"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-green-500 bg-opacity-5"></div>
                  <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 rounded-lg shadow-lg px-4 py-3 border border-green-200">
                    <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                      <VideoIcon className="w-4 h-4" />
                      <span>{s('coverage-map-badge').paragraphs![0]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section - Cards with Image Placeholders and Mobile Carousel */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-4" data-testid="benefits-title">
                {language === 'en' ? (
                  <>Why Choose <span className="font-display italic text-green-700">Telepsychiatry</span>?</>
                ) : (
                  <>¿Por Qué Elegir <span className="font-display italic text-green-700">Telepsiquiatría</span>?</>
                )}
              </h2>
            </div>
            
            {/* Desktop Grid / Mobile Carousel */}
            <div className="relative">
              {/* Carousel for Mobile */}
              <div className="md:hidden">
                <div className="overflow-hidden" ref={emblaRef}>
                  <div className="flex">
                    {benefitSections.map((benefit, index) => {
                      const benefitImages = [assetUrl(accessFromHomeImg), assetUrl(convenientSchedulingImg), assetUrl(securePrivateImg), assetUrl(continuityCareImg)];
                      return (
                        <div key={index} className="flex-[0_0_100%] min-w-0 px-2">
                          <div className="bg-white rounded-2xl overflow-hidden border border-green-100 shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                            {/* Benefit Image */}
                            <div className="h-48 overflow-hidden">
                              <img 
                                src={benefitImages[index]} 
                                alt={benefitAltTexts[index]}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {/* Content */}
                            <div className="p-6">
                              <h3 className="text-lg font-body font-bold text-green-800 mb-3">
                                {benefit.heading}
                              </h3>
                              <p className="text-gray-700 font-body leading-relaxed text-sm">
                                {benefit.paragraphs![0]}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Carousel Controls */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    onClick={scrollPrev}
                    className="w-10 h-10 rounded-full bg-green-800 hover:bg-green-700 text-white flex items-center justify-center transition-colors"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={scrollNext}
                    className="w-10 h-10 rounded-full bg-green-800 hover:bg-green-700 text-white flex items-center justify-center transition-colors"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Desktop Grid */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {benefitSections.map((benefit, index) => {
                  const benefitImages = [assetUrl(accessFromHomeImg), assetUrl(convenientSchedulingImg), assetUrl(securePrivateImg), assetUrl(continuityCareImg)];
                  return (
                    <div key={index} className="bg-white rounded-2xl overflow-hidden border border-green-100 shadow-sm hover:shadow-md transition-shadow duration-300" data-testid={`benefit-${index}`}>
                      {/* Benefit Image */}
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={benefitImages[index]} 
                          alt={benefitAltTexts[index]}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-lg font-body font-bold text-green-800 mb-3">
                          {benefit.heading}
                        </h3>
                        <p className="text-gray-700 font-body leading-relaxed text-sm">
                          {benefit.paragraphs![0]}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-4" data-testid="process-title">
                {language === 'en' ? (
                  <>How It <span className="font-display italic text-green-700">Works</span></>
                ) : (
                  <>Cómo <span className="font-display italic text-green-700">Funciona</span></>
                )}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed" data-testid="process-description">
                {s('process-description').paragraphs![0]}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <div key={index} className="relative" data-testid={`process-step-${index}`}>
                  <div className="bg-white rounded-2xl p-6 border border-green-100 h-full shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-green-800 text-white flex items-center justify-center text-xl font-bold">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-body font-bold text-green-800">
                        {step.heading}
                      </h3>
                    </div>
                    <p className="text-gray-700 font-body leading-relaxed text-sm">
                      {step.paragraphs![0]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section - Cards with Image Placeholders and Mobile Carousel */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-4" data-testid="services-title">
                {language === 'en' ? (
                  <>Complete <span className="font-display italic text-green-700">Psychiatry Services</span> via Telemedicine</>
                ) : (
                  <>Servicios Completos de <span className="font-display italic text-green-700">Psiquiatría</span> a través de Telemedicina</>
                )}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6 font-body leading-relaxed" data-testid="services-description">
                {s('services-description').paragraphs![0]}
              </p>
            </div>
            
            {/* Desktop Grid / Mobile Carousel */}
            <div className="relative">
              {/* Carousel for Mobile */}
              <div className="md:hidden">
                <div className="overflow-hidden" ref={emblaRef2}>
                  <div className="flex">
                    {serviceSections.map((service, index) => {
                      const serviceImages = [
                                              assetUrl(initialEvaluationImg),
                                              assetUrl(anxietyDepressionImg),
                                              assetUrl(adhdManagementImg),
                                              assetUrl(ptsdTherapyImg),
                                              assetUrl(bipolarTreatmentImg),
                                              assetUrl(medicationManagementImg)
                                            ];
                      return (
                        <div key={index} className="flex-[0_0_100%] min-w-0 px-2">
                          <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                            {/* Service Image */}
                            <div className="h-48 overflow-hidden">
                              <img 
                                src={serviceImages[index]} 
                                alt={serviceAltTexts[index]}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {/* Content */}
                            <div className="p-6">
                              <h3 className="text-lg font-body font-bold text-green-800 mb-3">
                                {service.heading}
                              </h3>
                              <p className="text-gray-600 font-body text-sm leading-relaxed">
                                {service.paragraphs![0]}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Carousel Controls */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    onClick={scrollPrev2}
                    className="w-10 h-10 rounded-full bg-green-800 hover:bg-green-700 text-white flex items-center justify-center transition-colors"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={scrollNext2}
                    className="w-10 h-10 rounded-full bg-green-800 hover:bg-green-700 text-white flex items-center justify-center transition-colors"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Desktop Grid */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {serviceSections.map((service, index) => {
                  const serviceImages = [
                                          assetUrl(initialEvaluationImg),
                                          assetUrl(anxietyDepressionImg),
                                          assetUrl(adhdManagementImg),
                                          assetUrl(ptsdTherapyImg),
                                          assetUrl(bipolarTreatmentImg),
                                          assetUrl(medicationManagementImg)
                                        ];
                  return (
                    <div key={index} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300" data-testid={`service-${index}`}>
                      {/* Service Image */}
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={serviceImages[index]} 
                          alt={serviceAltTexts[index]}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-lg font-body font-bold text-green-800 mb-3">
                          {service.heading}
                        </h3>
                        <p className="text-gray-600 font-body text-sm leading-relaxed">
                          {service.paragraphs![0]}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Doctor Section */}
        <DoctorSection />

        {/* Insurance Section */}
        <InsuranceLogos />

        {/* FAQ Section - Without Question Mark Icon */}
        <LocationFAQ 
          locationFAQs={locationFAQs.telehealth} 
          title={
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-8 text-center">
              {language === 'en' ? (
                <>
                  Frequently Asked <span className="font-display italic text-green-700">Questions</span>
                </>
              ) : (
                <>
                  Preguntas <span className="font-display italic text-green-700">Frecuentes</span>
                </>
              )}
            </h2>
          }
        />

        {/* Compliance & Credentials Section */}
        <section className="py-8 bg-green-50 border-t border-green-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-3 mb-5">
              {s('compliance-badges').bullets!.map((item, index) => (
                <div key={index} className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-green-100">
                  <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-2.5 h-2.5 text-green-600" />
                  </div>
                  <span className="text-gray-600 font-body font-medium text-xs">
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-gray-400 font-body max-w-2xl mx-auto">
              {s('compliance-footer').paragraphs![0]}
            </p>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-green-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-4" data-testid="cta-title">
              {language === 'en' ? (
                <>Ready to Get <span className="font-display italic text-green-700">Started</span>?</>
              ) : (
                <>¿Listo para <span className="font-display italic text-green-700">Comenzar</span>?</>
              )}
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 font-body leading-relaxed mb-8" data-testid="cta-description">
              {s('cta-description').paragraphs![0]}
            </p>
            <Button
              onClick={() => {
                trackLeadConversion('appointment_booking', { click_location: 'florida_final_cta' });
                trackTelehealthClick('cta-section');
                window.open("https://ehr.charmtracker.com/publicCal.sas?method=getCal&digest=e54bdf77b791eb90cd5ef77f1bfb3dd742f7d5dfc96511bf80477815162a23b66ee57013c1a537e6a04718346ddb0ed8d95fcbc3b76e32a2", '_blank', 'noopener,noreferrer');
              }}
              className="bg-green-700 hover:bg-green-800 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              data-testid="cta-schedule-button"
            >
              <Calendar className="w-5 h-5 mr-2 inline" />
              {s('cta-button').bullets![0]}
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TelepsychiatryFlorida;
