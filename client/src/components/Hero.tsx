import React, { useMemo } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone } from 'lucide-react';
import { IconBrain, IconHeart, IconLeaf } from '@tabler/icons-react';
import WellnessIcon from '@/components/WellnessIcon';
import heroImage from '@assets/hero-doctor-hq.webp';
import mobileHeroImage from '@assets/hero-doctor-mobile-optimized.webp';

// Optimized Hero component with performance improvements
const Hero = React.memo(() => {
  const { language } = useLanguage();

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

  // Memoize the scrolling text content to reduce DOM elements
  const scrollingText = useMemo(() => {
    return displayServices.join(' • ') + ' • ';
  }, [displayServices]);

  return (
    <section className="pt-8 pb-16 bg-white">
      <div className="max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[90%] mx-auto px-2 sm:px-4">
        {/* Mobile: Separate containers, Tablet & Desktop: Single container */}
        <div className="block md:hidden">
          {/* Mobile: Doctor image container */}
          <div className="relative rounded-2xl overflow-hidden mb-6 h-[250px]">
            <img 
              src={mobileHeroImage}
              alt="Dr. Melva Reve, MD - Board-certified psychiatrist providing compassionate mental health care in her modern Naples office"
              className="absolute inset-0 w-full h-full object-cover object-center hero-image"
              width={400}
              height={250}
              loading="eager"
              decoding="async"
              sizes="100vw"
              {...({'fetchpriority': 'high'} as any)}
            />
            
            {/* Services Carousel Overlay - Mobile - Optimized */}
            <div className="absolute bottom-0 left-0 right-0 py-3 overflow-hidden">
              <div 
                className="animate-scroll whitespace-nowrap text-gray-600/80 font-body font-medium text-sm px-2"
                style={{ willChange: 'transform' }}
              >
                <span className="inline-block drop-shadow-md">
                  {scrollingText.repeat(3)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Mobile: Content container */}
          <div className="bg-[#1e6b3b] rounded-2xl px-8 py-10 text-center">
            <h1 className="text-2xl sm:text-3xl font-display font-bold leading-relaxed text-white mb-6" data-testid="hero-title">
              <div className="italic font-bold mb-3 text-center">
                Expert psychiatric 
                <WellnessIcon size="sm" color="blue" className="inline-flex mx-1 align-middle">
                  <IconHeart />
                </WellnessIcon>
                care in
              </div>
              <div className="italic font-bold text-center">
                Naples, FL
                <WellnessIcon size="sm" color="green" className="inline-flex mx-1 align-middle">
                  <IconBrain />
                </WellnessIcon>
              </div>
            </h1>
            
            <div className="text-xl leading-relaxed font-body mb-8 text-white/95 max-w-md mx-auto" data-testid="hero-description">
              <span>Designed to help you navigate life's challenges and foster lasting well-being through personalized treatment. Find Your Path to <span className="font-display italic">Mental Clarity</span> with Compassionate Care from <span className="font-display italic">Dr. Reve</span></span>
            </div>
            
            <div className="flex flex-col gap-3">
              <Link href="/services">
                <Button
                  className="group inline-flex items-center justify-center gap-3 rounded-full text-lg font-semibold transition-all duration-300 bg-white text-green-800 hover:bg-green-50 px-8 py-4 shadow-lg"
                  data-testid="hero-book-consultation"
                >
                  <span>Our Services</span>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 bg-green-100">
                    <ArrowRight className="w-4 h-4 text-green-800" />
                  </div>
                </Button>
              </Link>
              <a href="tel:(239) 423-0272">
                <Button
                  className="group inline-flex items-center justify-center gap-3 rounded-full text-lg font-semibold transition-all duration-300 bg-white text-green-800 hover:bg-green-50 border-2 border-white hover:border-green-50 px-8 py-4 shadow-lg"
                  data-testid="hero-call-now"
                >
                  <span>Llamar Ahora</span>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 bg-green-100">
                    <Phone className="w-4 h-4 text-green-800" />
                  </div>
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Tablet & Desktop: Original single container layout */}
        <div className="hidden md:block">
          <div className="relative rounded-3xl overflow-hidden h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] flex items-center justify-center">
            {/* Background Image */}
            <img 
              src={heroImage}
              alt="Dr. Melva Reve, MD - Board-certified psychiatrist providing compassionate mental health care in her modern Naples office"
              className="absolute inset-0 w-full h-full object-cover object-center hero-image"
              width={1200}
              height={800}
              loading="eager"
              decoding="async"
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
                    Expert psychiatric
                    <WellnessIcon size="md" color="blue" className="inline-flex mx-1 md:mx-2 align-middle">
                      <IconHeart />
                    </WellnessIcon>
                    care in
                  </div>
                  <div className="font-display italic font-bold">
                    Naples, FL
                    <WellnessIcon size="md" color="green" className="inline-flex mx-1 md:mx-2 align-middle">
                      <IconBrain />
                    </WellnessIcon>
                  </div>
                </h1>
                
                <div className="text-lg md:text-xl lg:text-xl xl:text-2xl leading-relaxed font-body mb-8 md:mb-10 lg:mb-12 text-[#1e6b3b]" data-testid="hero-description">
                  <span>Designed to help you navigate life's challenges and foster lasting well-being through personalized treatment. Find Your Path to <span className="font-display italic text-green-700 font-bold">Mental Clarity</span> with Compassionate Care from <span className="font-display italic text-green-700 font-bold">Dr. Melva Reve</span></span>
                </div>
                
                <div className="ml-0 flex flex-col sm:flex-row gap-4">
                  <Link href="/services">
                    <Button
                      className="group inline-flex items-center justify-center gap-3 rounded-full text-base md:text-lg font-semibold transition-all duration-300 bg-white text-green-800 hover:bg-gray-100 px-6 md:px-8 lg:px-10 py-4 md:py-5 lg:py-6 xl:py-7 shadow-lg"
                      data-testid="hero-book-consultation"
                    >
                      <span>Our Services</span>
                      <div className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-green-100">
                        <ArrowRight className="w-5 h-5 text-green-800" />
                      </div>
                    </Button>
                  </Link>
                  <a href="tel:(239) 423-0272">
                    <Button
                      className="group inline-flex items-center justify-center gap-3 rounded-full text-base md:text-lg font-semibold transition-all duration-300 bg-green-800 text-white hover:bg-green-900 border-2 border-green-800 hover:border-green-900 px-6 md:px-8 lg:px-10 py-4 md:py-5 lg:py-6 xl:py-7 shadow-lg"
                      data-testid="hero-call-now"
                    >
                      <span>Call Now</span>
                      <div className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-white">
                        <Phone className="w-5 h-5 text-green-800" />
                      </div>
                    </Button>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Services Carousel Overlay - Desktop - Optimized */}
            <div className="absolute bottom-0 left-0 right-0 py-4 sm:py-6 overflow-hidden z-20">
              <div 
                className="animate-scroll whitespace-nowrap text-gray-600/80 font-body font-medium text-base sm:text-lg px-3 sm:px-4"
                style={{ willChange: 'transform' }}
              >
                <span className="inline-block drop-shadow-md" style={{ letterSpacing: '0.5em' }}>
                  {scrollingText.repeat(3)}
                </span>
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
