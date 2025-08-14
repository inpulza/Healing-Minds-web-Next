import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const About = () => {
  const { t } = useLanguage();

  const credentials = [
    t('about.credential1'),
    t('about.credential2'),
    t('about.credential3'),
    t('about.credential4'),
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=700&q=80"
                alt="Dr. Melva Reve, MD - Board Certified Psychiatrist in Naples, FL"
                className="w-full h-[500px] object-cover"
                data-testid="about-doctor-image"
              />
            </div>
            
            {/* Floating certification badge */}
            <div className="absolute -bottom-8 -right-8 bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
              <div className="text-center">
                <div className="text-2xl font-display font-bold text-primary mb-2">Board</div>
                <div className="text-sm font-body text-gray-600">Certified</div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-warm mb-8" data-testid="about-title">
              Where <span className="font-body italic">wellness</span> meets <span className="font-display italic">community</span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-6 leading-relaxed font-body" data-testid="about-description-1">
              {t('about.description1')}
            </p>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed font-body" data-testid="about-description-2">
              {t('about.description2')}
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8" data-testid="about-credentials">
              {credentials.map((credential, index) => (
                <div key={index} className="flex items-start text-gray-700">
                  <div className="w-2 h-2 bg-primary rounded-full mt-3 mr-4 flex-shrink-0" />
                  <span className="font-body">{credential}</span>
                </div>
              ))}
            </div>

            <Link href="/contact">
              <Button
                className="pill-button text-lg px-10 py-5"
                data-testid="about-schedule-consultation"
              >
                {t('about.scheduleConsultation')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
