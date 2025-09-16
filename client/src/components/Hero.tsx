import React, { useMemo } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Phone, Calendar, Clock, AlertTriangle, Video } from 'lucide-react';
import { IconBrain, IconHeart } from '@tabler/icons-react';
import WellnessIcon from '@/components/WellnessIcon';
import { urgencyMessaging, ctaOptions } from '@/data/content';
import heroImage from '@assets/hero-doctor-hq.webp';
import mobileHeroImage from '@assets/hero-doctor-mobile-optimized.webp';

// Optimized Hero component with performance improvements
const Hero = React.memo(() => {
  const { language, t } = useLanguage();

  // Memoize services arrays to prevent recreation on each render
  const services = useMemo(() => [
    'Anxiety Disorders',
    'Depression Treatment', 
    'ADHD Assessment',
    'PTSD Therapy',
    'Bipolar Disorder',
    'OCD Treatment',
    'Panic Disorders',
    'Social Anxiety',
    'Mood Stabilization',
    'Trauma-Informed Care',
    'Medication Management',
    'Psychoeducation',
    'Crisis Intervention',
    'Stress Management'
  ], []);

  const servicesSpanish = useMemo(() => [
    'Trastornos de Ansiedad',
    'Tratamiento de Depresión',
    'Evaluación de TDAH',
    'Terapia para TEPT',
    'Trastorno Bipolar',
    'Tratamiento TOC',
    'Trastornos de Pánico',
    'Ansiedad Social',
    'Estabilización del Estado de Ánimo',
    'Atención Informada por Trauma',
    'Manejo de Medicamentos',
    'Psicoeducación',
    'Intervención de Crisis',
    'Manejo del Estrés'
  ], []);

  // Memoize display services to prevent recalculation
  const displayServices = useMemo(() => 
    language === 'en' ? services : servicesSpanish, 
    [language, services, servicesSpanish]
  );


  return (
    <section className="pt-8 pb-16 bg-white">
      <div className="max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[90%] mx-auto px-2 sm:px-4">
        {/* Mobile version */}
        <div className="block md:hidden">
          {/* Mobile SEO Pills - Above photo container */}
          <div className="flex flex-wrap justify-center gap-2 mb-4 px-4">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Board Certified</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Naples FL</span>
          </div>

          {/* Photo Container */}
          <div className="relative rounded-2xl overflow-hidden h-[400px] sm:h-[450px] mb-6">
            {/* Mobile Background Image */}
            <img 
              src={mobileHeroImage}
              alt="Dr. Melva Reve, MD - Board-certified psychiatrist providing compassionate mental health care in Naples, FL"
              className="absolute inset-0 w-full h-full object-cover object-center"
              width={768}
              height={450}
              loading="eager"
              decoding="sync"
              sizes="(max-width: 767px) 100vw, 768px"
              {...({'fetchpriority': 'high'} as any)}
            />
            
            {/* Mobile Content Overlay - Bottom of photo */}
            <div className="absolute bottom-0 left-0 right-0 z-10 px-4 sm:px-6 py-6 text-center bg-gradient-to-t from-black/60 to-transparent">
              <div className="max-w-sm mx-auto">
                {/* Mobile Title */}
                <h1 className="text-2xl sm:text-3xl leading-tight text-white text-center mb-3" data-testid="hero-title-mobile">
                  <div className="font-display italic font-bold mb-2">
                    {language === 'en' ? 'Expert psychiatric care in' : 'Atención psiquiátrica experta en'}
                  </div>
                  <div className="font-display italic font-bold">
                    Naples, FL
                    <WellnessIcon size="sm" color="green" className="inline-flex mx-1 align-middle">
                      <IconBrain />
                    </WellnessIcon>
                  </div>
                </h1>
                
                {/* Mobile Description */}
                <div className="text-sm leading-relaxed font-body text-white/90" data-testid="hero-description-mobile">
                  <span>{t('hero.description')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Urgency & Availability Messaging */}
          <div className="flex flex-col items-center gap-2 mb-4 px-4">
            <Badge className="bg-red-500 text-white px-4 py-2 text-sm font-medium animate-pulse border-0" data-testid="urgency-mobile">
              {urgencyMessaging[language].urgency.bookingFast}
            </Badge>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge className="bg-green-100 text-green-800 px-3 py-1 text-xs font-medium border-0" data-testid="availability-mobile-1">
                {urgencyMessaging[language].availability.sameDayAvailable}
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 px-3 py-1 text-xs font-medium border-0" data-testid="availability-mobile-2">
                {urgencyMessaging[language].availability.answeringNow}
              </Badge>
            </div>
          </div>

          {/* Enhanced Mobile Action Buttons - Below photo container */}
          <div className="flex flex-col gap-3 px-4">
            {/* Primary CTA - Book Online */}
            <a href="https://ehr.charmtracker.com/publicCal.sas?method=getCal&digest=e54bdf77b791eb90cd5ef77f1bfb3dd742f7d5dfc96511bf80477815162a23b66ee57013c1a537e6a04718346ddb0ed8d95fcbc3b76e32a2">
              <Button
                className="w-full group inline-flex items-center justify-center gap-2 rounded-full text-base font-semibold transition-all duration-300 bg-green-800 text-white hover:bg-green-900 px-6 py-5 shadow-xl border-2 border-green-800 hover:border-green-900 min-h-[56px]"
                data-testid="hero-book-online-mobile"
              >
                <Calendar className="w-5 h-5 text-white" />
                <span>{ctaOptions[language].primary.text}</span>
                <Badge className="bg-green-600 text-white text-xs px-2 py-1 ml-1">
                  {ctaOptions[language].primary.subtext}
                </Badge>
              </Button>
            </a>
            
            {/* Secondary CTA - Call Now */}
            <a href="tel:(239) 423-0272">
              <Button
                className="w-full group inline-flex items-center justify-center gap-2 rounded-full text-base font-semibold transition-all duration-300 bg-white text-green-800 hover:bg-gray-100 px-6 py-4 shadow-lg border-2 border-green-800 min-h-[52px]"
                data-testid="hero-call-now-mobile"
              >
                <Phone className="w-4 h-4 text-green-800" />
                <span>{ctaOptions[language].secondary.text}</span>
                <ArrowRight className="w-4 h-4 text-green-800" />
              </Button>
            </a>
            
            {/* Tertiary Options Row */}
            <div className="flex gap-2">
              <Link href="/services" className="flex-1">
                <Button
                  className="w-full group inline-flex items-center justify-center gap-1 rounded-full text-sm font-medium transition-all duration-300 bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-3 border border-gray-300"
                  data-testid="hero-services-mobile"
                >
                  <ArrowRight className="w-3 h-3" />
                  <span>{language === 'en' ? 'Our Services' : 'Servicios'}</span>
                </Button>
              </Link>
              <Link href="/contact" className="flex-1">
                <Button
                  className="w-full group inline-flex items-center justify-center gap-1 rounded-full text-sm font-medium transition-all duration-300 bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-3 border border-blue-300"
                  data-testid="hero-video-mobile"
                >
                  <Video className="w-3 h-3" />
                  <span>{language === 'en' ? 'Video Call' : 'Video'}</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Tablet & Desktop: Original single container layout */}
        <div className="hidden md:block">
          <div className="relative rounded-3xl overflow-hidden h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] flex items-center justify-center hero-container">
            {/* Background Image */}
            <img 
              src={heroImage}
              alt="Dr. Melva Reve, MD - Board-certified psychiatrist providing compassionate mental health care in her modern Naples office"
              className="absolute inset-0 w-full h-full object-cover object-center hero-image"
              width={1200}
              height={800}
              loading="eager"
              decoding="sync"
              sizes="(min-width: 1200px) 1200px, 100vw"
              {...({'fetchpriority': 'high'} as any)}
            />
            

            
            {/* Left-Aligned Content */}
            <div className="relative z-10 w-full px-8 lg:px-16 py-8 text-left">
              <div className="max-w-5xl ml-2 md:ml-4" style={{maxWidth: "65%"}}>
                {/* SEO Pills */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-base font-medium">Board Certified Psychiatrist</span>
                  <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-base font-medium">Naples Mental Health</span>
                  <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-base font-medium">Southwest Florida</span>
                </div>
                
                <h1 className="text-4xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl leading-relaxed text-green-700 text-left mb-6 md:mb-8" data-testid="hero-title">
                  <div className="font-display italic font-bold mb-2 md:mb-3 lg:mb-4">
                    {language === 'en' ? 'Expert psychiatric' : 'Atención psiquiátrica experta'}
                    <WellnessIcon size="md" color="blue" className="inline-flex mx-1 md:mx-2 align-middle">
                      <IconHeart />
                    </WellnessIcon>
                    {language === 'en' ? ' care in' : ' en'}
                  </div>
                  <div className="font-display italic font-bold">
                    Naples, FL
                    <WellnessIcon size="md" color="green" className="inline-flex mx-1 md:mx-2 align-middle">
                      <IconBrain />
                    </WellnessIcon>
                  </div>
                </h1>
                
                <div className="text-lg md:text-xl lg:text-xl xl:text-2xl leading-relaxed font-body mb-6 md:mb-8 text-[#1e6b3b]" data-testid="hero-description">
                  <span>{t('hero.description')}</span>
                </div>

                {/* Desktop Urgency & Availability Messaging */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mb-6 md:mb-8">
                  <Badge className="bg-red-500 text-white px-4 py-2 text-sm md:text-base font-medium animate-pulse border-0" data-testid="urgency-desktop">
                    {urgencyMessaging[language].urgency.bookingFast}
                  </Badge>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-green-100 text-green-800 px-3 py-1 text-sm font-medium border-0" data-testid="availability-desktop-1">
                      {urgencyMessaging[language].availability.sameDayAvailable}
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 px-3 py-1 text-sm font-medium border-0" data-testid="availability-desktop-2">
                      {urgencyMessaging[language].availability.answeringNow}
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800 px-3 py-1 text-sm font-medium border-0" data-testid="availability-desktop-3">
                      {urgencyMessaging[language].availability.fastResponse}
                    </Badge>
                  </div>
                </div>
                
                {/* Enhanced Desktop CTAs */}
                <div className="ml-0 flex flex-col lg:flex-row gap-4 mb-4">
                  {/* Primary CTA - Book Online */}
                  <a href="https://ehr.charmtracker.com/publicCal.sas?method=getCal&digest=e54bdf77b791eb90cd5ef77f1bfb3dd742f7d5dfc96511bf80477815162a23b66ee57013c1a537e6a04718346ddb0ed8d95fcbc3b76e32a2">
                    <Button
                      className="group inline-flex items-center justify-center gap-3 rounded-full text-base md:text-lg lg:text-xl font-bold transition-all duration-300 bg-green-800 text-white hover:bg-green-900 border-2 border-green-800 hover:border-green-900 px-8 md:px-10 lg:px-12 py-5 md:py-6 lg:py-7 xl:py-8 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                      data-testid="hero-book-online-desktop"
                    >
                      <Calendar className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      <span>{ctaOptions[language].primary.text}</span>
                      <Badge className="bg-green-600 text-white text-xs px-2 py-1 ml-2">
                        {ctaOptions[language].primary.subtext}
                      </Badge>
                    </Button>
                  </a>
                  
                  {/* Secondary CTA - Call Now */}
                  <a href="tel:(239) 423-0272">
                    <Button
                      className="group inline-flex items-center justify-center gap-3 rounded-full text-base md:text-lg lg:text-xl font-semibold transition-all duration-300 bg-white text-green-800 hover:bg-gray-50 border-2 border-green-800 hover:border-green-900 px-6 md:px-8 lg:px-10 py-5 md:py-6 lg:py-7 xl:py-8 shadow-lg hover:shadow-xl"
                      data-testid="hero-call-now-desktop"
                    >
                      <Phone className="w-5 h-5 md:w-6 md:h-6 text-green-800" />
                      <span>{ctaOptions[language].secondary.text}</span>
                      <div className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-green-100">
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-green-800" />
                      </div>
                    </Button>
                  </a>
                </div>

                {/* Tertiary Options for Desktop */}
                <div className="flex flex-wrap gap-3">
                  <Link href="/services">
                    <Button
                      className="group inline-flex items-center justify-center gap-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 md:px-6 py-3 md:py-4 border border-gray-300 shadow-sm"
                      data-testid="hero-services-desktop"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>{language === 'en' ? 'Our Services' : 'Nuestros Servicios'}</span>
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button
                      className="group inline-flex items-center justify-center gap-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 md:px-6 py-3 md:py-4 border border-blue-300 shadow-sm"
                      data-testid="hero-video-desktop"
                    >
                      <Video className="w-4 h-4" />
                      <span>{ctaOptions[language].telehealth.text}</span>
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button
                      className="group inline-flex items-center justify-center gap-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 bg-red-100 text-red-800 hover:bg-red-200 px-4 md:px-6 py-3 md:py-4 border border-red-300 shadow-sm"
                      data-testid="hero-crisis-desktop"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>{ctaOptions[language].emergency.text}</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Services Carousel Overlay - Desktop */}
            <div className="absolute bottom-0 left-0 right-0 py-4 sm:py-6 overflow-hidden z-20">
              <div className="flex animate-scroll whitespace-nowrap" style={{ willChange: 'transform' }}>
                {/* First set */}
                <div className="flex items-center space-x-6 sm:space-x-8 text-gray-600/80 font-body font-medium text-base sm:text-lg px-3 sm:px-4">
                  {displayServices.map((service, index) => (
                    <div key={index} className="flex items-center space-x-6 sm:space-x-8">
                      <span className="whitespace-nowrap drop-shadow-md">{service}</span>
                      <span className="text-gray-600/80">•</span>
                    </div>
                  ))}
                </div>
                {/* Duplicate for seamless loop */}
                <div className="flex items-center space-x-6 sm:space-x-8 text-gray-600/80 font-body font-medium text-base sm:text-lg px-3 sm:px-4">
                  {displayServices.map((service, index) => (
                    <div key={`duplicate-${index}`} className="flex items-center space-x-6 sm:space-x-8">
                      <span className="whitespace-nowrap drop-shadow-md">{service}</span>
                      <span className="text-gray-600/80">•</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

// Set display name for debugging
Hero.displayName = 'Hero';

export default Hero;
