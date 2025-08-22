import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { IconBrain, IconHeart, IconLeaf } from '@tabler/icons-react';
import WellnessIcon from '@/components/WellnessIcon';
import heroImage from '@assets/hero-doctor-hq.webp';
import mobileHeroImage from '@assets/hero-doctor-mobile-optimized.webp';

const Hero = () => {
  const { language } = useLanguage();

  const services = [
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
  ];

  const servicesSpanish = [
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
  ];

  const displayServices = language === 'en' ? services : servicesSpanish;

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
            
            {/* Services Carousel Overlay - Mobile */}
            <div className="absolute bottom-0 left-0 right-0 py-3 overflow-hidden">
              <div className="flex animate-scroll whitespace-nowrap">
                {/* First set */}
                <div className="flex items-center space-x-4 text-white/90 font-body font-medium text-sm px-2">
                  {displayServices.map((service, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <span className="whitespace-nowrap drop-shadow-md">{service}</span>
                      <span className="text-white/70">•</span>
                    </div>
                  ))}
                </div>
                {/* Duplicate for seamless loop */}
                <div className="flex items-center space-x-4 text-white/90 font-body font-medium text-sm px-2">
                  {displayServices.map((service, index) => (
                    <div key={`duplicate-${index}`} className="flex items-center space-x-4">
                      <span className="whitespace-nowrap drop-shadow-md">{service}</span>
                      <span className="text-white/70">•</span>
                    </div>
                  ))}
                </div>
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
                <WellnessIcon size="sm" color="orange" className="inline-flex mx-1 align-middle">
                  <IconLeaf />
                </WellnessIcon>
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
                  <ArrowRight className="w-7 h-7 p-1.5 rounded-full transition-all duration-300 bg-green-100 text-green-800" />
                </Button>
              </Link>
              <a href="tel:(239) 423-0272">
                <Button
                  className="group inline-flex items-center justify-center gap-3 rounded-full text-lg font-semibold transition-all duration-300 bg-green-800 text-white hover:bg-green-900 border-2 border-green-800 hover:border-green-900 px-8 py-4 shadow-lg"
                  data-testid="hero-call-now"
                >
                  <span>Llamar Ahora</span>
                  <ArrowRight className="w-7 h-7 p-1.5 rounded-full transition-all duration-300 bg-white text-green-800" />
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
            <div className="relative z-10 w-full px-8 lg:px-16 py-16 text-left">
              <div className="max-w-4xl ml-4">
                {/* SEO Pills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Board Certified Psychiatrist</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Naples Mental Health</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Southwest Florida</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-relaxed text-green-700 text-left mb-6" data-testid="hero-title">
                  <div className="font-display italic font-bold mb-3">
                    Expert psychiatric 
                    <WellnessIcon size="md" color="blue" className="inline-flex mx-2 align-middle">
                      <IconHeart />
                    </WellnessIcon>
                    care in
                  </div>
                  <div className="font-display italic font-bold">
                    <WellnessIcon size="md" color="green" className="inline-flex mx-2 align-middle">
                      <IconLeaf />
                    </WellnessIcon>
                    Naples, FL
                    <WellnessIcon size="md" color="green" className="inline-flex mx-2 align-middle">
                      <IconBrain />
                    </WellnessIcon>
                  </div>
                </h1>
                
                <div className="text-xl lg:text-2xl leading-relaxed font-body mb-8 text-[#1e6b3b]" data-testid="hero-description">
                  <span>Designed to help you navigate life's challenges and foster lasting well-being through personalized treatment. Find Your Path to <span className="font-display italic text-green-700">Mental Clarity</span> with Compassionate Care from <span className="font-display italic text-green-700">Dr. Melva Reve</span></span>
                </div>
                
                <div className="ml-0 flex flex-col sm:flex-row gap-4">
                  <Link href="/services">
                    <Button
                      className="group inline-flex items-center justify-center gap-3 rounded-full text-lg font-semibold transition-all duration-300 bg-white text-green-800 hover:bg-gray-100 px-10 py-6 sm:py-7 shadow-lg"
                      data-testid="hero-book-consultation"
                    >
                      <span>Our Services</span>
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-green-100">
                        <ArrowRight className="w-5 h-5 text-green-800" />
                      </div>
                    </Button>
                  </Link>
                  <a href="tel:(239) 423-0272">
                    <Button
                      className="group inline-flex items-center justify-center gap-3 rounded-full text-lg font-semibold transition-all duration-300 bg-green-800 text-white hover:bg-green-900 border-2 border-green-800 hover:border-green-900 px-10 py-6 sm:py-7 shadow-lg"
                      data-testid="hero-call-now"
                    >
                      <span>Call Now</span>
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-white">
                        <ArrowRight className="w-5 h-5 text-green-800" />
                      </div>
                    </Button>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Services Carousel Overlay - Desktop */}
            <div className="absolute bottom-0 left-0 right-0 py-4 sm:py-6 overflow-hidden z-20">
              <div className="flex animate-scroll whitespace-nowrap">
                {/* First set */}
                <div className="flex items-center space-x-6 sm:space-x-8 text-white/90 font-body font-medium text-base sm:text-lg px-3 sm:px-4">
                  {displayServices.map((service, index) => (
                    <div key={index} className="flex items-center space-x-6 sm:space-x-8">
                      <span className="whitespace-nowrap drop-shadow-md">{service}</span>
                      <span className="text-white/70">•</span>
                    </div>
                  ))}
                </div>
                {/* Duplicate for seamless loop */}
                <div className="flex items-center space-x-6 sm:space-x-8 text-white/90 font-body font-medium text-base sm:text-lg px-3 sm:px-4">
                  {displayServices.map((service, index) => (
                    <div key={`duplicate-${index}`} className="flex items-center space-x-6 sm:space-x-8">
                      <span className="whitespace-nowrap drop-shadow-md">{service}</span>
                      <span className="text-white/70">•</span>
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
};

export default Hero;
