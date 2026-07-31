import React from 'react';
import { Link } from '@/lib/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { trackLeadConversion } from '@/lib/analytics';
import { ArrowRight, Phone, Brain, Heart } from 'lucide-react';
import heroImage from '../assets/hero-doctor-latest.webp';
import mobileHeroImage from '../assets/hero-doctor-latest.webp';
import { homeContent } from '@/data/pageContent/mainPages/home';
import { renderRichText } from '@/components/RichText';
import { useIsMobile } from '@/hooks/use-mobile';
import { assetUrl } from '@/lib/asset-url';

// Optimized Hero component with performance improvements
const Hero = React.memo(() => {
  const { language, t } = useLanguage();
  const isMobile = useIsMobile();
  const content = homeContent[language];
  const section = (key: string) => content.sections.find((x) => x.key === key)!;

  const pillsMobile = section('heroPillsMobile').bullets!;
  const pillsDesktop = section('heroPillsDesktop').bullets!;
  const buttons = section('heroButtons').bullets!;
  const displayServices = section('heroServices').bullets!;


  return (
    <section className="pt-8 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile version */}
        <div className="block md:hidden">
          {/* Mobile SEO Pills - Above photo container */}
          <div className="flex flex-wrap justify-center gap-2 mb-4 px-4">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">{pillsMobile[0]}</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">{pillsMobile[1]}</span>
          </div>

          {/* Photo Container */}
          <div className="relative rounded-2xl overflow-hidden h-[400px] sm:h-[450px] mb-6">
            {/* Mobile Background Image */}
            <img 
              src={assetUrl(mobileHeroImage)}
              alt="Dr. Melva Reve, MD - Psychiatrist providing compassionate mental health care in Naples, FL"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: '95% top' }}
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
                <p className="text-2xl sm:text-3xl leading-tight text-white text-center font-body font-bold" data-testid={isMobile ? 'hero-title' : undefined}>
                  {renderRichText(content.title, undefined, 'font-display italic')}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Description - Above buttons */}
          <p className="text-sm text-center font-body text-green-700 mb-4 px-4 max-w-sm mx-auto" data-testid="hero-description-mobile">
            {section('heroDescriptionMobile').paragraphs![0]}
          </p>

          {/* Mobile Action Buttons - Below description */}
          <div className="flex flex-col gap-3 px-4">
            <Link href="/services">
              <Button
                className="whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 w-full group inline-flex items-center justify-center gap-2 rounded-full text-base font-semibold transition-all duration-300 bg-white text-green-800 hover:bg-gray-100 px-6 py-4 shadow-lg border border-green-800 pt-[24px] pb-[24px]"
                data-testid="hero-book-consultation-mobile"
              >
                <span>{buttons[0]}</span>
                <ArrowRight className="w-4 h-4 text-green-800" />
              </Button>
            </Link>
            <a
              href="tel:+12394230272"
              onClick={() => trackLeadConversion('phone_call', { click_location: 'hero_mobile' })}
            >
              <Button
                className="whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 w-full group inline-flex items-center justify-center gap-2 rounded-full text-base font-semibold transition-all duration-300 bg-green-800 text-white hover:bg-green-900 border-2 border-green-800 hover:border-green-900 px-6 py-4 shadow-lg pt-[24px] pb-[24px]"
                data-testid="hero-call-now-mobile"
              >
                <span>{buttons[1]}</span>
                <Phone className="w-4 h-4 text-white" />
              </Button>
            </a>
          </div>
        </div>

        {/* Tablet & Desktop: Original single container layout */}
        <div className="hidden md:block">
          <div className="relative rounded-3xl overflow-hidden aspect-[18/9] flex items-start hero-container border border-blue-200">
            {/* Background Image */}
            <img 
              src={assetUrl(heroImage)}
              alt="Dr. Melva Reve, MD - Psychiatrist providing compassionate mental health care in her modern Naples office"
              className="absolute inset-0 w-full h-full object-cover object-top hero-image"
              width={1200}
              height={800}
              loading="eager"
              decoding="sync"
              sizes="(min-width: 1200px) 1200px, 100vw"
              {...({'fetchpriority': 'high'} as any)}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/15 to-transparent"></div>

            
            {/* Left-Aligned Content */}
            <div className="relative z-10 w-full px-8 sm:px-12 lg:px-16 pt-12 text-left">
              <div className="max-w-2xl">
                {/* SEO Pills */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-green-100">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Brain className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-body font-medium text-xs sm:text-sm">{pillsDesktop[0]}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-blue-100">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="w-3 h-3 text-blue-600" />
                    </div>
                    <span className="text-gray-700 font-body font-medium text-xs sm:text-sm">{pillsDesktop[1]}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-purple-100">
                    <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="w-3 h-3 text-purple-600" />
                    </div>
                    <span className="text-gray-700 font-body font-medium text-xs sm:text-sm">{pillsDesktop[2]}</span>
                  </div>
                </div>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight text-green-800 text-left mb-5 font-body font-bold" data-testid={!isMobile ? 'hero-title' : undefined}>
                  {renderRichText(content.title, undefined, 'font-display italic text-green-700')}
                </h1>
                
                <div className="text-sm md:text-base leading-relaxed font-body mb-6 text-[#1e6b3b] max-w-md" data-testid="hero-description">
                  <span>{t('hero.description')}</span>
                </div>
                
                <div className="ml-0 flex flex-row items-center gap-4">
                  <Link href="/services">
                    <Button
                      className="whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 group inline-flex items-center justify-center gap-2 rounded-full text-base font-semibold transition-all duration-300 text-white hover:bg-green-900 px-6 md:px-8 py-5 md:py-6 shadow-lg bg-[#15803d]"
                      data-testid="hero-book-consultation"
                    >
                      <span>{buttons[0]}</span>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border border-white">
                        <ArrowRight className="w-4 h-4 text-white" />
                      </div>
                    </Button>
                  </Link>
                  <a
                    href="tel:+12394230272"
                    onClick={() => trackLeadConversion('phone_call', { click_location: 'hero_desktop' })}
                  >
                    <Button
                      className="group inline-flex items-center justify-center gap-2 rounded-full text-base font-semibold transition-all duration-300 bg-transparent text-green-800 hover:bg-green-50 border-2 border-green-800 px-6 md:px-8 py-5 md:py-6 shadow-lg"
                      data-testid="hero-call-now"
                    >
                      <span>{buttons[1]}</span>
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
