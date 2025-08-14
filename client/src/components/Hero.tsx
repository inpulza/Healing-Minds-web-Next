import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { IconBrain, IconHeart, IconLeaf } from '@tabler/icons-react';
import WellnessIcon from '@/components/WellnessIcon';
import heroImage from '@assets/hero-doctor-hq.webp';
import mobileHeroImage from '@assets/hero-doctor-mobile-hq.webp';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="py-8 bg-white">
      <div className="max-w-full mx-auto px-2">
        {/* Mobile: Separate containers, Desktop: Single container */}
        <div className="block sm:hidden">
          {/* Mobile: Doctor image container */}
          <div className="relative rounded-2xl overflow-hidden mb-6 h-[250px]">
            <img 
              src={mobileHeroImage}
              alt="Dr. Melva Reve - Board Certified Psychiatrist in Naples, FL"
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading="eager"
            />
          </div>
          
          {/* Mobile: Content container */}
          <div className="bg-[#1e6b3b] rounded-2xl px-6 py-8 text-center">
            <h1 className="text-3xl font-display font-bold leading-tight text-white mb-4" data-testid="hero-title">
              Find Your Path to 
              <WellnessIcon size="md" color="green" className="inline-flex mx-2 mb-1">
                <IconBrain />
              </WellnessIcon>
              Clarity<br />
              with 
              <WellnessIcon size="md" color="blue" className="inline-flex mx-2 mb-1">
                <IconHeart />
              </WellnessIcon>
              <span className="font-display italic">Dr. Reve</span>
            </h1>
            
            <div className="text-lg leading-relaxed font-body mb-6 text-white" data-testid="hero-description">
              <span>Compassionate and expert psychiatric care in Naples, FL, designed to help you navigate life's challenges</span>
              <WellnessIcon size="md" color="orange" className="inline-flex mx-1">
                <IconLeaf />
              </WellnessIcon>
              <span>and foster lasting well-being.</span>
            </div>
            
            <Link href="/services">
              <Button
                className="group inline-flex items-center justify-center gap-3 rounded-full text-xl font-semibold transition-all duration-300 bg-white text-green-800 hover:bg-green-50 px-8 py-6 sm:py-7 shadow-lg"
                data-testid="hero-book-consultation"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 bg-green-100">
                  <ArrowRight className="w-5 h-5 text-green-800" />
                </div>
                <span>Our Services</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Desktop: Original single container layout */}
        <div className="hidden sm:block">
          <div className="relative rounded-3xl overflow-hidden h-[600px] sm:h-[700px] flex items-center justify-center">
            {/* Background Image */}
            <img 
              src={heroImage}
              alt="Dr. Melva Reve - Board Certified Psychiatrist in Naples, FL"
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading="eager"
            />
            

            
            {/* Left-Aligned Content */}
            <div className="relative z-10 w-full px-8 lg:px-16 py-16 text-left">
              <div className="max-w-4xl ml-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-body font-bold leading-tight text-[#1e6b3b] text-left mb-6" data-testid="hero-title">
                  Find Your Path to<br />
                  <WellnessIcon size="md" color="green" className="inline-flex mx-2 align-middle">
                    <IconBrain />
                  </WellnessIcon>
                  <span className="font-display italic text-green-700">Mental Clarity</span><br />
                  With 
                  <WellnessIcon size="md" color="blue" className="inline-flex mx-2 align-middle">
                    <IconHeart />
                  </WellnessIcon>
                  Compassionate Care from <span className="font-display italic text-green-700">Dr. Melva Reve</span>
                  <WellnessIcon size="md" color="green" className="inline-flex mx-2 align-middle">
                    <IconLeaf />
                  </WellnessIcon>
                </h1>
                
                <div className="text-lg lg:text-xl leading-relaxed font-body mb-8 text-[#1e6b3b]" data-testid="hero-description">
                  <span>Expert psychiatric care in Naples, FL, designed to help you navigate life's challenges and foster lasting well-being through personalized treatment.</span>
                </div>
                
                <div className="ml-0">
                  <Link href="/services">
                    <Button
                      className="group inline-flex items-center justify-center gap-3 rounded-full text-lg font-semibold transition-all duration-300 bg-white text-green-800 hover:bg-gray-100 px-10 py-6 sm:py-7 shadow-lg"
                      data-testid="hero-book-consultation"
                    >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-green-100">
                      <ArrowRight className="w-5 h-5 text-green-800" />
                    </div>
                      <span>Our Services</span>
                    </Button>
                  </Link>
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
