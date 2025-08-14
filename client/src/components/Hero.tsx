import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import heroImage from '@assets/hero-doctor-optimized.png';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="py-8 bg-white">
      <div className="max-w-[95%] mx-auto px-2">
        {/* Wider Rounded Hero Container */}
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
          <div className="relative z-10 w-full px-12 py-16 text-center">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6" data-testid="hero-title">
                Find Your Path to Clarity<br />
                with <span className="font-display italic">Dr. Reve</span>
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed font-body mb-8" data-testid="hero-description">
                Compassionate and expert psychiatric care in Naples, FL, designed to help you navigate life's challenges and foster lasting well-being.
              </p>
              
              <div className="flex justify-center">
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
