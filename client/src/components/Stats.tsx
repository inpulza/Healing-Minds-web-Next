import { useLanguage } from '@/hooks/useLanguage';
import { Card } from '@/components/ui/card';

const Stats = () => {
  const { t } = useLanguage();

  const stats = [
    { 
      value: '15+', 
      label: t('stats.experience'),
      testId: 'stat-experience',
      color: 'bg-soft-mint'
    },
    { 
      value: '98%', 
      label: t('stats.successRate'),
      testId: 'stat-success-rate',
      color: 'bg-warm-pink'
    },
    { 
      value: '4.9/5', 
      label: t('stats.rating'),
      testId: 'stat-rating',
      color: 'bg-soft-purple'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center" data-testid={stat.testId}>
              <div className={`inline-flex items-center justify-center w-24 h-24 ${stat.color} rounded-full mb-6`}>
                <div className="text-3xl font-display font-bold text-primary">
                  {stat.value}
                </div>
              </div>
              <div className="text-lg font-body font-medium text-warm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
