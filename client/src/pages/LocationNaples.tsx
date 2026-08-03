import { useEffect } from 'react';
import { assetUrl } from '@/lib/asset-url';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LocationInsuranceLogos from '@/components/LocationInsuranceLogos';
import CharmHealthBooking from '@/components/CharmHealthBooking';
import CompactVideoCarousel from '@/components/CompactVideoCarousel';
import Reviews from '@/components/Reviews';
import GoogleMapsEmbed from '@/components/GoogleMapsEmbed';
import { updateSEO } from '@/utils/seo';
import { practiceInfo, acceptedInsurance, serviceAreas } from '@/data/content';
import { naplesLocationContent } from '@/data/pageContent/mainPages/naples';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import WellnessIcon from '@/components/WellnessIcon';
import { trackLeadConversion } from '@/lib/analytics';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Star, 
  Shield, 
  Heart, 
  Users,
  CheckCircle,
  ArrowRight,
  Navigation,
  Calendar,
  VideoIcon,
  Sun,
  Brain,
  Smile,
  User,
  Leaf
} from 'lucide-react';
import { Link } from '@/lib/navigation';

// Import office photo
import officePhoto from '@assets/doctor-consultation.webp';
import heroLocationImage from '@assets/dr-melva-location-hero.webp';
import OptimizedImage from '@/components/OptimizedImage';

const LocationNaples = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en'
        ? 'Psychiatrist in Naples, FL — Bilingual Care in Park Shore | Dr. Melva Reve'
        : 'Psiquiatra en Naples, FL — Atención Bilingüe en Park Shore | Dra. Melva Reve',
      description: language === 'en'
        ? 'Bilingual psychiatrist Dr. Melva Reve at 4760 Tamiami Trl N #25, in the Park Shore corridor of Naples (ZIP 34103). In-person and secure telehealth for anxiety, depression, ADHD, PTSD and bipolar care. Call (239) 423-0272.'
        : 'Psiquiatra bilingüe Dra. Melva Reve en 4760 Tamiami Trl N #25, en el corredor de Park Shore en Naples (CP 34103). Atención presencial y telesalud segura para ansiedad, depresión, TDAH, TEPT y trastorno bipolar. (239) 423-0272.',
      keywords: language === 'en'
        ? 'psychiatrist Naples FL, bilingual psychiatrist Naples, Park Shore psychiatrist, Tamiami Trail psychiatrist, anxiety treatment Naples, ADHD adults Naples, Spanish speaking psychiatrist Collier County'
        : 'psiquiatra Naples FL, psiquiatra bilingüe Naples, psiquiatra Park Shore, psiquiatra en Tamiami Trail, tratamiento ansiedad Naples, TDAH adultos Naples, psiquiatra en español Collier County',
      lang: language,
      canonical: '/locations/psychiatrist-naples'
    };
    updateSEO(seoData);

    // Schema already managed by App.tsx to avoid duplication

    return () => {
      // No cleanup needed
    };
  }, [language]);

  const content = naplesLocationContent[language];
  const s = (key: string) => content.sections.find((section) => section.key === key)!;
  const labels = s('labels').bullets!;

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section - Location Page Style */}
        <section className="pt-20 pb-8 sm:pb-12 lg:pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Mobile Hero */}
            <div className="md:hidden">
              {/* Mobile Image */}
              <div className="relative h-[400px] sm:h-[450px] mb-4 rounded-2xl overflow-hidden">
                <OptimizedImage
                  src={assetUrl(heroLocationImage)}
                  alt="Dr. Melva Reve at her Naples psychiatric practice"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: '95% top' }}
                  width={800}
                  height={1000}
                  priority={true}
                  sizes="(max-width: 1024px) 100vw, 1800px"
                />
                {/* Mobile Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 z-10 px-4 sm:px-6 py-6 text-center bg-gradient-to-t from-black/60 to-transparent">
                  <div className="max-w-sm mx-auto">
                    <p className="text-2xl sm:text-3xl leading-tight text-white text-center font-body font-bold" data-testid="hero-title-mobile">
                      {language === 'en' ? (
                        <>
                          Your Trusted <span className="font-display italic">Psychiatrist</span> in Naples, FL
                        </>
                      ) : (
                        <>
                          Su <span className="font-display italic">Psiquiatra</span> de Confianza en Naples, FL
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Description */}
              <p className="text-sm text-center font-body text-green-700 mb-4 px-4 max-w-sm mx-auto" data-testid="hero-description-mobile">
                {s('hero-description').paragraphs![0]}
              </p>

              {/* Mobile Action Buttons */}
              <div className="flex flex-col gap-3 px-4">
                <Button 
                  size="lg" 
                  className="bg-green-800 hover:bg-green-700 text-white font-semibold py-4 sm:py-6 px-4 sm:px-8 rounded-full inline-flex items-center justify-center gap-2 sm:gap-3 w-full text-sm sm:text-base"
                  onClick={() => window.location.href = language === 'en' ? '/contact' : '/es/contacto'}
                  data-testid="button-schedule-consultation-mobile"
                >
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  {labels[0]}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-green-800 text-green-800 hover:bg-green-50 font-semibold py-4 sm:py-6 px-4 sm:px-8 rounded-full inline-flex items-center justify-center gap-2 sm:gap-3 w-full text-sm sm:text-base"
                  onClick={() => window.open(practiceInfo.googleMapsUrl, '_blank')}
                  data-testid="button-get-directions-mobile"
                >
                  <Navigation className="w-4 h-4 sm:w-5 sm:h-5" />
                  {labels[1]}
                </Button>
              </div>
            </div>

            {/* Desktop Hero */}
            <div className="hidden md:block">
              <div className="relative aspect-[18/9] rounded-2xl overflow-hidden border border-blue-200">
                <OptimizedImage
                  src={assetUrl(heroLocationImage)}
                  alt="Dr. Melva Reve at her Naples psychiatric practice"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  width={1800}
                  height={900}
                  priority={true}
                  sizes="(max-width: 1024px) 100vw, 1800px"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/15 to-transparent"></div>
                
                {/* Content positioned at top */}
                <div className="relative h-full flex items-start px-8 sm:px-12 lg:px-16 pt-12">
                  <div className="max-w-2xl text-left">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-green-100">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-green-600" />
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
                    
                    {/* Title */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-body font-bold text-green-800 mb-5" data-testid="hero-title-desktop">
                      {language === 'en' ? (
                        <>
                          Your Trusted <span className="font-display italic text-green-700">Psychiatrist</span> in{' '}
                          <span className="font-display italic text-green-700">Naples, FL</span>
                        </>
                      ) : (
                        <>
                          Su <span className="font-display italic text-green-700">Psiquiatra</span> de Confianza en{' '}
                          <span className="font-display italic text-green-700">Naples, FL</span>
                        </>
                      )}
                    </h1>
                    
                    {/* Description */}
                    <p className="text-sm md:text-base leading-relaxed font-body text-green-700 max-w-md mb-6" data-testid="hero-description-desktop">
                      {s('hero-description').paragraphs![0]}
                    </p>
                    
                    {/* CTA Button */}
                    <Button
                      onClick={() => window.location.href = language === 'en' ? '/contact' : '/es/contacto'}
                      className="bg-green-700 hover:bg-green-800 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                      data-testid="button-schedule-consultation-desktop"
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      {labels[0]}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Banner Image Section - Service Page Style */}
        <section className="py-16 sm:py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 shadow-lg border border-green-100">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Content Side */}
                <div className="order-2 lg:order-1">
                  <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    {s('banner-badge').paragraphs![0]}
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6">
                    {language === 'en' ? (
                      <>Your Healing Journey Starts at Our <span className="font-display italic text-green-700">Naples</span> Office</>
                    ) : (
                      <>Su Viaje de Sanación Comienza en Nuestra Oficina de <span className="font-display italic text-green-700">Naples</span></>
                    )}
                  </h2>
                  
                  {/* Key Stats */}
                  <div className="mb-6 sm:mb-8">
                    <div className="text-3xl sm:text-4xl font-bold mb-2 text-green-600">{s('banner-stat').paragraphs![0]}</div>
                    <div className="text-gray-600 font-body text-sm sm:text-base">
                      {s('banner-stat').paragraphs![1]}
                    </div>
                  </div>

                  <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 font-body leading-relaxed">
                    {s('banner-body').paragraphs![0]}
                  </p>

                  <Button 
                    className="group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full text-sm sm:text-lg font-semibold transition-all duration-300 bg-green-700 text-white hover:bg-green-800 px-4 sm:px-8 py-4 sm:py-7"
                    onClick={() => window.open(practiceInfo.googleMapsUrl, '_blank')}
                    data-testid="button-view-location"
                  >
                    <span>{labels[4]}</span>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 min-w-[2rem] min-h-[2rem] sm:min-w-[2.25rem] sm:min-h-[2.25rem] rounded-full flex items-center justify-center transition-all duration-300 bg-green-600 flex-shrink-0">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  </Button>
                </div>

                {/* Photo Side */}
                <div className="order-1 lg:order-2 flex flex-col h-full">
                  <div className="w-full aspect-[3/4] sm:aspect-[4/5] lg:aspect-[4/5] rounded-xl overflow-hidden bg-gradient-to-br from-green-50 to-green-100">
                    <OptimizedImage
                      src={assetUrl(officePhoto)}
                      alt="Dr. Melva Reve at her Naples psychiatric practice - Professional and compassionate mental health care"
                      className="w-full h-full object-cover object-center"
                      width={800}
                      height={600}
                      priority={true}
                      sizes="(max-width: 640px) 400px, (max-width: 1024px) 600px, 800px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Features Badges */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <div className="flex flex-wrap justify-center gap-3">
              {s('banner-features').bullets!.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-blue-100">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="text-gray-700 font-body font-medium text-xs sm:text-sm">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Insurance Logos Section - Moved below fold */}
        <LocationInsuranceLogos />

        {/* Services Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <WellnessIcon size="md" color="green" className="opacity-70">
                  <Brain />
                </WellnessIcon>
                <h2 className="text-4xl lg:text-5xl font-body font-bold text-green-800">
                  {language === 'en' ? (
                    <><span className="font-display italic text-green-700">Services</span> at This Location</>
                  ) : (
                    <><span className="font-display italic text-green-700">Servicios</span> en Esta Ubicación</>
                  )}
                </h2>
                <WellnessIcon size="md" color="blue" className="opacity-70">
                  <Heart />
                </WellnessIcon>
              </div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                {s('services-intro').paragraphs![0]}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: 'anxiety',
                  icon: Brain,
                  link: language === 'en' ? '/services/anxiety-treatment' : '/es/servicios/tratamiento-ansiedad'
                },
                {
                  id: 'depression',
                  icon: Sun,
                  link: language === 'en' ? '/services/depression-treatment' : '/es/servicios/tratamiento-depresion'
                },
                {
                  id: 'adhd',
                  icon: Smile,
                  link: language === 'en' ? '/services/adhd-treatment' : '/es/servicios/tratamiento-adhd'
                },
                {
                  id: 'ptsd',
                  icon: Leaf,
                  link: language === 'en' ? '/services/ptsd-treatment' : '/es/servicios/tratamiento-tept'
                },
                {
                  id: 'bipolar',
                  icon: Heart,
                  link: language === 'en' ? '/services/bipolar-treatment' : '/es/servicios/tratamiento-bipolar'
                },
                {
                  id: 'medication-management',
                  icon: User,
                  link: language === 'en' ? '/services/medication-management' : '/es/servicios/manejo-medicamentos'
                }
              ].map((service, index) => {
                const IconComponent = service.icon;
                const sc = s(`service-${service.id}`);
                return (
                  <div
                    key={service.id}
                    className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:shadow-lg flex flex-col h-full bg-white text-green-800 border border-green-100"
                    data-testid={`service-${service.id}`}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 bg-green-100">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-green-800" />
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl font-display font-bold mb-3 sm:mb-4 text-green-800">
                      {sc.heading}
                    </h3>
                    
                    <p className="text-sm sm:text-base font-body leading-relaxed mb-4 sm:mb-5 flex-grow text-gray-600">
                      {sc.paragraphs![0]}
                    </p>

                    <Link href={service.link} className="mt-auto">
                      <Button
                        className="group flex items-center justify-start gap-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 px-4 sm:px-6 w-full min-h-[4rem] sm:min-h-[4.5rem] whitespace-normal bg-green-800 text-white hover:bg-green-700"
                        data-testid={`service-button-${service.id}`}
                      >
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 self-center bg-green-700">
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <span className="text-left leading-tight flex-1 py-2">
                          {sc.bullets![0]}
                        </span>
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
            
            {/* Service Areas - Enhanced with more features */}
            <div className="mt-16 text-center">
              <h3 className="text-2xl font-display font-bold text-green-800 mb-8">
                {language === 'en' ? (
                  <><span className="font-display italic text-green-700">Areas</span> We Serve</>
                ) : (
                  <><span className="font-display italic text-green-700">Áreas</span> que Servimos</>
                )}
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {serviceAreas.map((area, index) => (
                  <div key={index} className="bg-green-50 rounded-full px-4 py-2 border border-green-200">
                    <span className="text-green-800 font-body text-sm font-medium">{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How to Get Here Section */}
        <section className="py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <WellnessIcon size="md" color="blue" className="opacity-70">
                    <Navigation />
                  </WellnessIcon>
                  <h2 className="text-3xl lg:text-4xl font-body font-bold text-green-800">
                    {language === 'en' ? (
                      <>How to Get <span className="font-display italic text-green-700">Here</span></>
                    ) : (
                      <>Cómo <span className="font-display italic text-green-700">Llegar</span></>
                    )}
                  </h2>
                  <WellnessIcon size="md" color="green" className="opacity-70">
                    <MapPin />
                  </WellnessIcon>
                </div>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                  {s('directions-intro').paragraphs![0]}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* From Naples Pier */}
                <div className="bg-white rounded-2xl sm:rounded-3xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-blue-800" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-green-800 mb-2">
                        {s('directions-pier').heading}
                      </h3>
                      <p className="text-sm text-gray-500 font-body">
                        {s('directions-pier').paragraphs![0]}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6 flex-grow">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-800 font-bold text-xs">1</span>
                      </div>
                      <p className="text-sm text-gray-700 font-body leading-relaxed">
                        {s('directions-pier').ordered![0]}
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-800 font-bold text-xs">2</span>
                      </div>
                      <p className="text-sm text-gray-700 font-body leading-relaxed">
                        {s('directions-pier').ordered![1]}
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-800 font-bold text-xs">3</span>
                      </div>
                      <p className="text-sm text-gray-700 font-body leading-relaxed">
                        {s('directions-pier').ordered![2]}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center gap-2 text-green-700 font-body text-sm font-medium mb-4">
                      <Clock className="w-4 h-4" />
                      <span>{s('directions-pier').bullets![0]}</span>
                    </div>

                    <Button 
                      className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-3 rounded-full"
                      onClick={() => window.open('https://maps.google.com/?saddr=Naples+Pier,+Naples,+FL&daddr=4760+Tamiami+Trl+N+%23+25,+Naples,+FL+34103', '_blank')}
                      data-testid="button-directions-pier"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      {labels[1]}
                    </Button>
                  </div>
                </div>

                {/* From Naples Municipal Airport */}
                <div className="bg-white rounded-2xl sm:rounded-3xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-blue-800" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-green-800 mb-2">
                        {s('directions-airport').heading}
                      </h3>
                      <p className="text-sm text-gray-500 font-body">
                        {s('directions-airport').paragraphs![0]}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6 flex-grow">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-800 font-bold text-xs">1</span>
                      </div>
                      <p className="text-sm text-gray-700 font-body leading-relaxed">
                        {s('directions-airport').ordered![0]}
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-800 font-bold text-xs">2</span>
                      </div>
                      <p className="text-sm text-gray-700 font-body leading-relaxed">
                        {s('directions-airport').ordered![1]}
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-800 font-bold text-xs">3</span>
                      </div>
                      <p className="text-sm text-gray-700 font-body leading-relaxed">
                        {s('directions-airport').ordered![2]}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center gap-2 text-green-700 font-body text-sm font-medium mb-4">
                      <Clock className="w-4 h-4" />
                      <span>{s('directions-airport').bullets![0]}</span>
                    </div>

                    <Button 
                      className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-3 rounded-full"
                      onClick={() => window.open('https://maps.google.com/?saddr=Naples+Municipal+Airport,+Naples,+FL&daddr=4760+Tamiami+Trl+N+%23+25,+Naples,+FL+34103', '_blank')}
                      data-testid="button-directions-airport"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      {labels[1]}
                    </Button>
                  </div>
                </div>

                {/* From Waterside Shops */}
                <div className="bg-white rounded-2xl sm:rounded-3xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-blue-800" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-green-800 mb-2">
                        {s('directions-waterside').heading}
                      </h3>
                      <p className="text-sm text-gray-500 font-body">
                        {s('directions-waterside').paragraphs![0]}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6 flex-grow">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-800 font-bold text-xs">1</span>
                      </div>
                      <p className="text-sm text-gray-700 font-body leading-relaxed">
                        {s('directions-waterside').ordered![0]}
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-800 font-bold text-xs">2</span>
                      </div>
                      <p className="text-sm text-gray-700 font-body leading-relaxed">
                        {s('directions-waterside').ordered![1]}
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-800 font-bold text-xs">3</span>
                      </div>
                      <p className="text-sm text-gray-700 font-body leading-relaxed">
                        {s('directions-waterside').ordered![2]}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center gap-2 text-green-700 font-body text-sm font-medium mb-4">
                      <Clock className="w-4 h-4" />
                      <span>{s('directions-waterside').bullets![0]}</span>
                    </div>

                    <Button 
                      className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-3 rounded-full"
                      onClick={() => window.open('https://maps.google.com/?saddr=Waterside+Shops,+Naples,+FL&daddr=4760+Tamiami+Trl+N+%23+25,+Naples,+FL+34103', '_blank')}
                      data-testid="button-directions-waterside"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      {labels[1]}
                    </Button>
                  </div>
                </div>
              </div>

            {/* Additional Info Section */}
            <div className="mt-16 text-center">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 shadow-lg border border-green-100 max-w-4xl mx-auto">
                <h3 className="text-2xl font-display font-bold text-green-800 mb-6">
                  {s('access-heading').heading}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-green-800 mb-1">
                          {s('access-location').heading}
                        </h4>
                        <p className="text-sm text-gray-600 font-body">
                          {s('access-location').paragraphs![0]}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-green-800 mb-1">
                          {s('access-parking').heading}
                        </h4>
                        <p className="text-sm text-gray-600 font-body">
                          {s('access-parking').paragraphs![0]}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-green-800 mb-1">
                          {s('access-transit').heading}
                        </h4>
                        <p className="text-sm text-gray-600 font-body">
                          {s('access-transit').paragraphs![0]}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-green-800 mb-1">
                          {s('access-signage').heading}
                        </h4>
                        <p className="text-sm text-gray-600 font-body">
                          {s('access-signage').paragraphs![0]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-green-100">
                  <p className="text-center text-gray-600 font-body text-sm leading-relaxed">
                    {s('access-footer').paragraphs![0]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Involvement Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <WellnessIcon size="md" color="green" className="opacity-70">
                  <Heart />
                </WellnessIcon>
                <h2 className="text-4xl lg:text-5xl font-body font-bold text-green-800">
                  {language === 'en' ? (
                    <><span className="font-display italic text-green-700">Community</span> Involvement in Naples</>
                  ) : (
                    <><span className="font-display italic text-green-700">Participación</span> Comunitaria en Naples</>
                  )}
                </h2>
                <WellnessIcon size="md" color="blue" className="opacity-70">
                  <Users />
                </WellnessIcon>
              </div>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto font-body leading-relaxed">
                {s('community-intro').paragraphs![0]}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {/* Naples Botanical Garden */}
              <div className="rounded-2xl sm:rounded-3xl p-8 transition-all duration-300 hover:shadow-lg flex flex-col h-full bg-green-50 border border-green-100">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-green-100">
                  <Heart className="w-6 h-6 text-green-800" />
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-4 text-green-800">
                  Naples Botanical Garden
                </h3>
                
                <p className="text-base font-body leading-relaxed mb-6 flex-grow text-gray-600">
                  {language === 'en'
                    ? 'A 170-acre world-class botanical paradise that promotes the connection between people and plants. Their therapeutic gardens, wellness programs, and mindfulness initiatives support mental health and community well-being, serving over 400,000 visitors annually.'
                    : 'Un paraíso botánico de clase mundial de 170 acres que promueve la conexión entre las personas y las plantas. Sus jardines terapéuticos, programas de bienestar e iniciativas de mindfulness apoyan la salud mental y el bienestar comunitario, sirviendo a más de 400,000 visitantes anualmente.'}
                </p>

                <a
                  href="https://www.naplesgarden.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto"
                  data-testid="link-botanical-garden"
                >
                  <Button
                    className="group flex items-center justify-start gap-3 rounded-full text-base font-semibold transition-all duration-300 px-6 w-full min-h-[3.5rem] whitespace-normal bg-green-800 text-white hover:bg-green-700"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 self-center bg-green-700">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-left leading-tight flex-1 py-2">
                      {language === 'en' ? 'Visit Botanical Garden' : 'Visitar Jardín Botánico'}
                    </span>
                  </Button>
                </a>
              </div>

              {/* United Way of Collier and the Keys */}
              <div className="rounded-2xl sm:rounded-3xl p-8 transition-all duration-300 hover:shadow-lg flex flex-col h-full bg-green-50 border border-green-100">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-green-100">
                  <Users className="w-6 h-6 text-green-800" />
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-4 text-green-800">
                  United Way of Collier and the Keys
                </h3>
                
                <p className="text-base font-body leading-relaxed mb-6 flex-grow text-gray-600">
                  {language === 'en'
                    ? 'United Way of Collier and the Keys brings people and resources together to address local needs, support healthy communities, improve financial security, and connect residents with help through 2-1-1.'
                    : 'United Way of Collier and the Keys reúne personas y recursos para atender necesidades locales, apoyar comunidades saludables, mejorar la seguridad financiera y conectar a los residentes con ayuda a través del 2-1-1.'}
                </p>

                <a
                  href="https://uwcollierkeys.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto"
                  data-testid="link-united-way"
                >
                  <Button
                    className="group flex items-center justify-start gap-3 rounded-full text-base font-semibold transition-all duration-300 px-6 w-full min-h-[3.5rem] whitespace-normal bg-green-800 text-white hover:bg-green-700"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 self-center bg-green-700">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-left leading-tight flex-1 py-2">
                      {language === 'en' ? 'Learn About Their Mission' : 'Conocer Su Misión'}
                    </span>
                  </Button>
                </a>
              </div>

              {/* Grace Place for Children & Families */}
              <div className="rounded-2xl sm:rounded-3xl p-8 transition-all duration-300 hover:shadow-lg flex flex-col h-full bg-green-50 border border-green-100">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-green-100">
                  <Heart className="w-6 h-6 text-green-800" />
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-4 text-green-800">
                  Grace Place for Children & Families
                </h3>
                
                <p className="text-base font-body leading-relaxed mb-6 flex-grow text-gray-600">
                  {language === 'en'
                    ? 'Dedicated to breaking the cycle of poverty through education, family support, and community engagement. Their comprehensive programs provide academic support, family counseling, and mental health resources to over 500 children and families in Naples.'
                    : 'Dedicados a romper el ciclo de pobreza a través de educación, apoyo familiar y participación comunitaria. Sus programas integrales proporcionan apoyo académico, consejería familiar y recursos de salud mental a más de 500 niños y familias en Naples.'}
                </p>

                <a
                  href="https://graceplacenaples.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto"
                  data-testid="link-grace-place"
                >
                  <Button
                    className="group flex items-center justify-start gap-3 rounded-full text-base font-semibold transition-all duration-300 px-6 w-full min-h-[3.5rem] whitespace-normal bg-green-800 text-white hover:bg-green-700"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 self-center bg-green-700">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-left leading-tight flex-1 py-2">
                      {language === 'en' ? 'Support Their Mission' : 'Apoyar Su Misión'}
                    </span>
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Video Section - A Conversation with Dr. Reve */}
        <section className="py-16 lg:py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 shadow-lg border">
              {/* Encabezado de sección */}
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6" data-testid="video-section-title">
                  {language === 'en' 
                    ? <>A <span className="font-display italic text-green-700">Conversation</span> with Dr. Reve</>
                    : <>Una <span className="font-display italic text-green-700">Conversación</span> con la Dra. Reve</>
                  }
                </h2>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto font-body leading-relaxed">
                  {language === 'en'
                    ? 'Get to know me through these educational videos where I share insights about mental health.'
                    : 'Conóceme a través de estos videos educativos donde comparto conocimientos sobre salud mental.'
                  }
                </p>
              </div>

              <CompactVideoCarousel />
            </div>
          </div>
        </section>

        {/* CTA Section - Ready to take the first step */}
        <section className="py-16 lg:py-20 from-green-700 to-green-800 text-white bg-[#14532d]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold mb-6" data-testid="cta-title">
                {language === 'en' 
                  ? <>Ready to Take the <span className="font-display italic text-green-200">First</span> Step?</>
                  : <>¿Listo/a para Dar el <span className="font-display italic text-green-200">Primer</span> Paso?</>
                }
              </h2>
              <p className="text-xl lg:text-2xl text-green-100 mb-8 max-w-3xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'Change begins with a simple conversation. I am here to listen to you, understand you, and walk with you toward a fuller and more balanced life.'
                  : 'El cambio comienza con una simple conversación. Estoy aquí para escucharte, entenderte y caminar contigo hacia una vida más plena y equilibrada.'
                }
              </p>
              
              <Link href={language === 'en' ? '/contact' : '/es/contacto'}>
                <Button
                  className="group inline-flex items-center justify-center gap-2 sm:gap-4 rounded-full text-base sm:text-xl font-semibold transition-all duration-300 bg-white text-green-700 hover:bg-green-50 px-4 sm:px-10 py-6 sm:py-8 hover:shadow-xl hover:-translate-y-2 mb-6"
                  data-testid="cta-button"
                >
                  <span className="text-center">{language === 'en' ? 'Schedule My Consultation Now' : 'Agendar mi Consulta Ahora'}</span>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-700 text-white rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-green-800 flex-shrink-0">
                    <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                </Button>
              </Link>
              
              <p className="text-green-200 text-sm max-w-2xl mx-auto">
                {language === 'en'
                  ? 'All consultations are completely confidential and protected by medical privacy laws. Your privacy and well-being are our highest priorities.'
                  : 'Todas las consultas son completamente confidenciales y están protegidas por las leyes de privacidad médica. Tu privacidad y bienestar son nuestras máximas prioridades.'
                }
              </p>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <Reviews />

        {/* Call to Action */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
            <h2 className="text-4xl lg:text-5xl font-body font-bold text-gray-900 mb-6">
              {language === 'en' ? (
                <>
                  <span className="font-display italic text-green-700">Ready to Begin</span> Your <span className="font-display italic text-green-700">Journey?</span>
                </>
              ) : (
                <>
                  <span className="font-display italic text-green-700">¿Listo para Comenzar</span> su <span className="font-display italic text-green-700">Viaje?</span>
                </>
              )}
            </h2>
            <p className="text-xl text-gray-600 font-body mb-8 leading-relaxed">
              {language === 'en' 
                ? 'Take the first step towards better mental health. Contact us today to schedule your consultation.'
                : 'Dé el primer paso hacia una mejor salud mental. Contáctenos hoy para programar su consulta.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                className="bg-green-800 text-white hover:bg-green-700 px-8 py-6 rounded-full font-body font-semibold text-lg min-w-[240px]"
                onClick={() => window.location.href = language === 'en' ? '/contact' : '/es/contacto'}
                data-testid="button-schedule-consultation"
              >
                <Heart className="w-5 h-5 mr-2" />
                {labels[2]}
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-green-800 text-green-800 hover:bg-green-800 hover:text-white px-8 py-6 rounded-full font-body font-semibold text-lg min-w-[240px]"
                onClick={() => {
                  trackLeadConversion('phone_call', { click_location: 'naples_final_cta' });
                  window.location.href = `tel:${practiceInfo.phone}`;
                }}
                data-testid="button-call-now"
              >
                <Phone className="w-4 h-4 mr-2" />
                {labels[3]}
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LocationNaples;
