import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { IconBrain, IconHeart, IconLeaf } from '@tabler/icons-react';
import WellnessIcon from '@/components/WellnessIcon';
import heroImage from '@assets/hero-doctor-optimized.png';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="py-8 bg-white">
      <div className="max-w-[95%] mx-auto px-2">
        {/* Wider Rounded Hero Container */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-[500px] sm:min-h-[600px] flex items-center justify-center">
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
          <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 py-12 sm:py-16 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight text-[#1e6b3b] text-center" data-testid="hero-title">
                  Find Your Path to 
                  <WellnessIcon size="md" color="green" className="inline-flex mx-1 sm:mx-3 mb-1 sm:mb-2">
                    <IconBrain />
                  </WellnessIcon>
                  Clarity<br />
                  with 
                  <WellnessIcon size="md" color="blue" className="inline-flex mx-1 sm:mx-2 mb-1">
                    <IconHeart />
                  </WellnessIcon>
                  <span className="font-display italic">Dr. Reve</span>
                </h1>
              </div>
              
              <div className="text-base sm:text-lg lg:text-xl leading-relaxed font-body mb-6 sm:mb-8 text-[#1e6b3b] flex flex-wrap items-center justify-center gap-1 sm:gap-2" data-testid="hero-description">
                <span>Compassionate and expert psychiatric care in Naples, FL, designed to help you navigate life's challenges</span>
                <WellnessIcon size="md" color="orange" className="inline-flex mx-1">
                  <IconLeaf />
                </WellnessIcon>
                <span>and foster lasting well-being.</span>
              </div>
              
              <div className="flex justify-center">
                <Link href="/services">
                  <Button
                    className="group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 bg-white text-green-800 hover:bg-gray-100 px-6 sm:px-10 py-6 sm:py-8 shadow-lg"
                    data-testid="hero-book-consultation"
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-green-100">
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-green-800" />
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
