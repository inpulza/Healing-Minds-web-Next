import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
    <section id="services" className="py-20 bg-warm-beige">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-warm mb-6" data-testid="services-title">
            Mental Health for <span className="font-body italic">every</span> mind
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed" data-testid="services-description">
            {t('services.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.slice(0, 3).map((service) => {
            const IconComponent = service.icon;
            return (
              <div key={service.id} className="card-modern group hover:shadow-xl transition-all duration-300" data-testid={`service-${service.id}`}>
                <div className="mb-6">
                  <div className="w-full h-48 bg-gradient-to-br from-warm-pink to-soft-mint rounded-2xl mb-6 flex items-center justify-center">
                    <IconComponent className="h-16 w-16 text-primary" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-warm mb-3">
                    {service.title}
                  </h3>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed font-body">
                  {service.description}
                </p>
                
                <ul className="space-y-3 mb-8">
                  {service.items.slice(0, 3).map((item, index) => (
                    <li key={index} className="text-gray-700 font-body flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-4 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                
                <Link href="/contact">
                  <Button className="pill-button w-full">
                    Learn More
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Link href="/services">
            <Button className="pill-button text-lg px-12 py-5">
              View All Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
