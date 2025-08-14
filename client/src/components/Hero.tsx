import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80')`
        }}
      />
      <div className="absolute inset-0 hero-overlay" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight" data-testid="hero-title">
            {t('hero.title')}<br />
            <span className="text-3xl md:text-5xl">{t('hero.subtitle')}</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 leading-relaxed opacity-90" data-testid="hero-description">
            {t('hero.description')}
          </p>
          
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-white text-primary-green hover:bg-gray-50 font-semibold px-8 py-3 text-lg"
                data-testid="hero-book-consultation"
              >
                {t('hero.bookConsultation')}
              </Button>
            </Link>
            
            <Link href="/services">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-green font-semibold px-8 py-3 text-lg"
                data-testid="hero-learn-more"
              >
                {t('hero.learnMore')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
