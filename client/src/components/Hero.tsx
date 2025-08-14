import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { IconBrain, IconHeart, IconLeaf } from '@tabler/icons-react';
import WellnessIcon from '@/components/WellnessIcon';
import heroImage from '@assets/hero-doctor-optimized.png';
import mobileHeroImage from '@assets/e534f45f-8c35-4c68-853b-c0dc841a0387_1755195321913.png';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="py-8 bg-white">
      <div className="max-w-[95%] mx-auto px-2">
        {/* Mobile: Separate containers, Desktop: Single container */}
        <div className="block sm:hidden">
          {/* Mobile: Doctor image container */}
          <div className="relative rounded-2xl overflow-hidden mb-6 h-[300px]">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${mobileHeroImage})`,
                backgroundSize: 'cover'
              }}
            />
          </div>
          
          {/* Mobile: Content container */}
          <div className="bg-green-50 rounded-2xl px-6 py-8 text-center">
            <h1 className="text-3xl font-display font-bold leading-tight text-[#1e6b3b] mb-4" data-testid="hero-title">
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
            
            <div className="text-base leading-relaxed font-body mb-6 text-[#1e6b3b]" data-testid="hero-description">
              <span>Compassionate and expert psychiatric care in Naples, FL, designed to help you navigate life's challenges</span>
              <WellnessIcon size="md" color="orange" className="inline-flex mx-1">
                <IconLeaf />
              </WellnessIcon>
              <span>and foster lasting well-being.</span>
            </div>
            
            <Link href="/services">
              <Button
                className="group inline-flex items-center justify-center gap-2 rounded-full text-base font-semibold transition-all duration-300 bg-green-600 text-white hover:bg-green-700 px-8 py-4 shadow-lg"
                data-testid="hero-book-consultation"
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 bg-green-500">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
                <span>Our Services</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Desktop: Original single container layout */}
        <div className="hidden sm:block">
          <div className="relative rounded-3xl overflow-hidden min-h-[600px] flex items-center justify-center">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${heroImage})`,
                backgroundSize: 'cover'
              }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 via-green-500/15 to-transparent" />
            
            {/* Centered Content */}
            <div className="relative z-10 w-full px-8 lg:px-12 py-16 text-center">
              <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight text-[#1e6b3b] text-center mb-6" data-testid="hero-title">
                  Find Your Path to 
                  <WellnessIcon size="md" color="green" className="inline-flex mx-3 mb-2">
                    <IconBrain />
                  </WellnessIcon>
                  Clarity<br />
                  with 
                  <WellnessIcon size="md" color="blue" className="inline-flex mx-2 mb-1">
                    <IconHeart />
                  </WellnessIcon>
                  <span className="font-display italic">Dr. Reve</span>
                </h1>
                
                <div className="text-lg lg:text-xl leading-relaxed font-body mb-8 text-[#1e6b3b] flex flex-wrap items-center justify-center gap-2" data-testid="hero-description">
                  <span>Compassionate and expert psychiatric care in Naples, FL, designed to help you navigate life's challenges</span>
                  <WellnessIcon size="md" color="orange" className="inline-flex mx-1">
                    <IconLeaf />
                  </WellnessIcon>
                  <span>and foster lasting well-being.</span>
                </div>
                
                <Link href="/services">
                  <Button
                    className="group inline-flex items-center justify-center gap-3 rounded-full text-base font-semibold transition-all duration-300 bg-white text-green-800 hover:bg-gray-100 px-10 py-8 shadow-lg"
                    data-testid="hero-book-consultation"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-green-100">
                      <ArrowRight className="w-4 h-4 text-green-800" />
                    </div>
                    <span>Our Services</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
