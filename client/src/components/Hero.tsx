import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="py-8 bg-green-50">
      <div className="max-w-[95%] mx-auto px-2">
        {/* Wider Rounded Hero Container */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[600px] flex items-center justify-center">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80')`
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 via-teal-500/80 to-transparent" />
          
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
                <Link href="/contact">
                  <Button
                    className="bg-white text-teal-700 hover:bg-gray-50 font-body font-semibold px-8 py-4 rounded-full text-lg shadow-lg flex items-center gap-3"
                    data-testid="hero-book-consultation"
                  >
                    <ArrowRight className="w-5 h-5 text-teal-600" />
                    Book a Consultation
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
