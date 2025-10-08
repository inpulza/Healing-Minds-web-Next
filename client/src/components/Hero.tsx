import React, { useMemo } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone, Brain, Heart } from 'lucide-react';
import WellnessIcon from '@/components/WellnessIcon';
import heroImage from '../assets/hero-doctor-latest.png';
import mobileHeroImage from '../assets/hero-doctor-latest.png';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: '75% top' }}
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
                      <Brain />
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

          {/* Mobile Action Buttons - Below photo container */}
          <div className="flex flex-col gap-3 px-4">
            <Link href="/services">
              <Button
                className="whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 w-full group inline-flex items-center justify-center gap-2 rounded-full text-base font-semibold transition-all duration-300 bg-white text-green-800 hover:bg-gray-100 px-6 py-4 shadow-lg border border-green-800 pt-[24px] pb-[24px]"
                data-testid="hero-book-consultation-mobile"
              >
                <span>{language === 'en' ? 'Our Services' : 'Nuestros Servicios'}</span>
                <ArrowRight className="w-4 h-4 text-green-800" />
              </Button>
            </Link>
            <a href="tel:(239) 423-0272">
              <Button
                className="whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 w-full group inline-flex items-center justify-center gap-2 rounded-full text-base font-semibold transition-all duration-300 bg-green-800 text-white hover:bg-green-900 border-2 border-green-800 hover:border-green-900 px-6 py-4 shadow-lg pt-[24px] pb-[24px]"
                data-testid="hero-call-now-mobile"
              >
                <span>{language === 'en' ? 'Call Now' : 'Llamar Ahora'}</span>
                <Phone className="w-4 h-4 text-white" />
              </Button>
            </a>
          </div>
        </div>

        {/* Tablet & Desktop: Original single container layout */}
        <div className="hidden md:block">
          <div className="relative rounded-3xl overflow-hidden aspect-[18/9] flex items-center hero-container">
            {/* Background Image */}
            <img 
              src={heroImage}
              alt="Dr. Melva Reve, MD - Board-certified psychiatrist providing compassionate mental health care in her modern Naples office"
              className="absolute inset-0 w-full h-full object-cover object-top hero-image"
              width={1200}
              height={800}
              loading="eager"
              decoding="sync"
              sizes="(min-width: 1200px) 1200px, 100vw"
              {...({'fetchpriority': 'high'} as any)}
            />
            

            
            {/* Left-Aligned Content */}
            <div className="relative z-10 w-full px-8 sm:px-12 lg:px-16 py-8 text-left">
              <div className="max-w-2xl">
                {/* SEO Pills */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-base font-medium">Board Certified Psychiatrist</span>
                  <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-base font-medium">Naples Mental Health</span>
                  <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-base font-medium">Southwest Florida</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight text-green-700 text-left mb-5" data-testid="hero-title">
                  <div className="font-display italic font-bold">
                    {language === 'en' ? 'Expert psychiatric' : 'Atención psiquiátrica experta'}
                    <WellnessIcon size="md" color="blue" className="inline-flex mx-1 md:mx-2 align-middle">
                      <Heart />
                    </WellnessIcon>
                    {language === 'en' ? ' care in Naples, FL' : ' en Naples, FL'}
                    <WellnessIcon size="md" color="green" className="inline-flex mx-1 md:mx-2 align-middle">
                      <Brain />
                    </WellnessIcon>
                  </div>
                </h1>
                
                <div className="text-base md:text-lg lg:text-xl leading-relaxed font-body mb-6 text-[#1e6b3b]" data-testid="hero-description">
                  <span>{t('hero.description')}</span>
                </div>
                
                <div className="ml-0 flex flex-row items-center gap-4">
                  <Link href="/services">
                    <Button
                      className="whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 group inline-flex items-center justify-center gap-2 rounded-full text-base font-semibold transition-all duration-300 text-white hover:bg-green-900 px-6 md:px-8 py-5 md:py-6 shadow-lg bg-[#16a34a]"
                      data-testid="hero-book-consultation"
                    >
                      <span>{language === 'en' ? 'Our Services' : 'Nuestros Servicios'}</span>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border border-white">
                        <ArrowRight className="w-4 h-4 text-white" />
                      </div>
                    </Button>
                  </Link>
                  <a href="tel:(239) 423-0272">
                    <Button
                      className="group inline-flex items-center justify-center gap-2 rounded-full text-base font-semibold transition-all duration-300 bg-transparent text-green-800 hover:bg-green-50 border-2 border-green-800 px-6 md:px-8 py-5 md:py-6 shadow-lg"
                      data-testid="hero-call-now"
                    >
                      <span>{language === 'en' ? 'Call Now' : 'Llamar Ahora'}</span>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border border-green-800">
                        <Phone className="w-4 h-4 text-green-800" />
                      </div>
                    </Button>
                  </a>
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
