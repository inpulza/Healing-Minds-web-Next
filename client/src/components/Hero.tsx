import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center bg-warm-beige">
      {/* Modern Background Layout with Image */}
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-7xl font-display font-bold text-warm leading-tight" data-testid="hero-title">
              Find Your Path to <span className="font-body italic">Clarity</span>
              <br />
              with <span className="font-display italic">Dr. Reve</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed font-body" data-testid="hero-description">
              {t('hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <Button
                  className="pill-button text-lg px-10 py-5"
                  data-testid="hero-book-consultation"
                >
                  {t('hero.bookConsultation')}
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Image Side */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000&q=80"
                alt="Dr. Melva Reve providing compassionate psychiatric care"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating stats card */}
            <div className="absolute -bottom-8 -left-8 bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-primary mb-1">15+</div>
                <div className="text-sm font-body text-gray-600">Years Experience</div>
              </div>
            </div>
            
            {/* Floating testimonial card */}
            <div className="absolute -top-8 -right-8 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-soft-mint rounded-full flex items-center justify-center">
                  <div className="text-primary font-display font-bold">DR</div>
                </div>
                <div>
                  <div className="text-sm font-body font-semibold text-warm">Compassionate Care</div>
                  <div className="text-xs text-gray-500 font-body">Bilingual Services</div>
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
