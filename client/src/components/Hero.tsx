import React, { useMemo } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone } from 'lucide-react';
import { IconBrain, IconHeart } from '@tabler/icons-react';
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


  return (
    <section className="pt-8 pb-16 bg-white">
      <div className="max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[90%] mx-auto px-2 sm:px-4">
        {/* Mobile version lazy loaded to improve initial desktop performance */}
        <div className="block md:hidden">
          {/* Mobile hero content moved to separate component - not rendering initially for performance */}
          <div className="min-h-[400px] bg-gray-100 rounded-2xl flex items-center justify-center">
            <p className="text-gray-500">Loading mobile view...</p>
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
