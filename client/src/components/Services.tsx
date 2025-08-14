import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { Card } from '@/components/ui/card';
import { 
  Heart, 
  Sun, 
  Zap, 
  Shield, 
  TrendingUp, 
  RotateCcw 
} from 'lucide-react';

const Services = () => {
  const { t } = useLanguage();

  const services = [
    {
      id: 'anxiety',
      title: t('services.anxiety.title'),
      description: t('services.anxiety.description'),
      icon: Heart,
      items: [
        'Generalized Anxiety Disorder',
        'Panic Disorder',
        'Social Anxiety',
        'Specific Phobias'
      ]
    },
    {
      id: 'depression',
      title: t('services.depression.title'),
      description: t('services.depression.description'),
      icon: Sun,
      items: [
        'Major Depressive Disorder',
        'Persistent Depressive Disorder',
        'Seasonal Affective Disorder',
        'Postpartum Depression'
      ]
    },
    {
      id: 'adhd',
      title: t('services.adhd.title'),
      description: t('services.adhd.description'),
      icon: Zap,
      items: [
        'Adult ADHD Assessment',
        'Medication Management',
        'Behavioral Strategies',
        'Executive Function Support'
      ]
    },
    {
      id: 'ptsd',
      title: t('services.ptsd.title'),
      description: t('services.ptsd.description'),
      icon: Shield,
      items: [
        'PTSD Treatment',
        'Trauma-Informed Care',
        'Acute Stress Disorder',
        'Complex Trauma'
      ]
    },
    {
      id: 'bipolar',
      title: t('services.bipolar.title'),
      description: t('services.bipolar.description'),
      icon: TrendingUp,
      items: [
        'Bipolar I & II Disorder',
        'Mood Stabilization',
        'Medication Management',
        'Psychoeducation'
      ]
    },
    {
      id: 'ocd',
      title: t('services.ocd.title'),
      description: t('services.ocd.description'),
      icon: RotateCcw,
      items: [
        'Obsessive-Compulsive Disorder',
        'Exposure Response Prevention',
        'Medication Management',
        'Body-Focused Repetitive Behaviors'
      ]
    }
  ];

  return (
    <section id="services" className="py-20 bg-light-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6" data-testid="services-title">
            {t('services.title')}
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto" data-testid="services-description">
            {t('services.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card key={service.id} className="bg-white p-8 hover:shadow-md transition-shadow duration-200" data-testid={`service-${service.id}`}>
                <div className="w-12 h-12 bg-primary-green/10 rounded-lg flex items-center justify-center mb-6">
                  <IconComponent className="w-6 h-6 text-primary-green" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {service.title}
                </h3>
                
                <p className="text-gray-700 mb-4">
                  {service.description}
                </p>
                
                <ul className="text-sm text-gray-600 space-y-1 mb-6">
                  {service.items.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
                
                <Link href="/contact">
                  <span className="text-primary-green font-medium hover:text-primary-green-hover cursor-pointer">
                    Learn More →
                  </span>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
