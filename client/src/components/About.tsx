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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
              alt="Dr. Melva Reve, MD - Board Certified Psychiatrist in Naples, FL"
              className="rounded-xl shadow-lg w-full h-auto"
              data-testid="about-doctor-image"
            />
          </div>
          
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6" data-testid="about-title">
              {t('about.title')}
            </h2>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed" data-testid="about-description-1">
              {t('about.description1')}
            </p>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed" data-testid="about-description-2">
              {t('about.description2')}
            </p>
            
            <div className="space-y-3 mb-8" data-testid="about-credentials">
              {credentials.map((credential, index) => (
                <div key={index} className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-primary-green mr-3 flex-shrink-0" />
                  <span>{credential}</span>
                </div>
              ))}
            </div>

            <Link href="/contact">
              <Button
                className="bg-primary-green text-white hover:bg-primary-green-hover font-medium px-8 py-3"
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
